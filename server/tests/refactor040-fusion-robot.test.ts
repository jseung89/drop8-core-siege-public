import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { EMP_EXO_SUIT_BALANCE, EXO_PART_COPIES_PER_MAP, EXO_SUIT_BALANCE, FUSION_ROBOT_BALANCE, MAP_CONFIGS, MOTORCYCLE_DESTRUCTION_BALANCE, TANK_BALANCE } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { MotorcycleState, PlayerState } from '../src/rooms/schema.js';

function roomAt(clock:{value:number}){
  const room=new Drop8Room() as any;
  room.now=()=>clock.value;room.state.phase='ACTIVE';room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=MAP_CONFIGS.small.width;
  return room;
}

function openPoint(room:any){
  for(let y=220;y<MAP_CONFIGS.small.height-220;y+=120)for(let x=220;x<MAP_CONFIGS.small.width-720;x+=120){
    if(!room.isVehiclePositionFree(x,y,'',FUSION_ROBOT_BALANCE.collisionRadius))continue;
    if(!room.isVehiclePositionFree(x+320,y))continue;
    if(room.firstObstacleHitT(x,y,x+560,y,4)===null)return{x,y};
  }
  throw new Error('No open fusion robot test point');
}

function player(id:string,x:number,y:number){const value=new PlayerState();value.id=id;value.name=id;value.alive=true;value.phase='landed';value.x=x;value.y=y;value.angle=0;return value;}

function grantSixParts(room:any,playerId:string){const inventory=room.tacticalInventory(playerId);inventory.exoHeadCount=1;inventory.exoCoreCount=1;inventory.exoLimbsCount=1;inventory.empExoHeadCount=1;inventory.empExoCoreCount=1;inventory.empExoLimbsCount=1;return inventory;}

function assemble(room:any,pilot:PlayerState){
  const client={sessionId:pilot.id,send:vi.fn()};room.state.players.set(pilot.id,pilot);const inventory=grantSixParts(room,pilot.id);room.activateFusionRobot(client);const robot=[...room.state.motorcycles.values()].find((vehicle:any)=>vehicle.vehicleKind==='fusion_robot') as MotorcycleState|undefined;return{client,inventory,robot};
}

describe('Refactor 040 permanent fusion robot',()=>{
  it('consumes all six parts, creates the large permanent vehicle, and auto-mounts it',()=>{
    const clock={value:10},room=roomAt(clock),point=openPoint(room),pilot=player('pilot',point.x,point.y),{inventory,robot}=assemble(room,pilot);
    expect(robot).toBeDefined();expect(robot?.maxHp).toBe(FUSION_ROBOT_BALANCE.maxHp);expect(robot?.fusionWeaponSlot).toBe(1);
    expect(pilot.isDriving).toBe(true);expect(pilot.vehicleId).toBe(robot?.id);expect(robot?.driverId).toBe(pilot.id);
    expect([inventory.exoHeadCount,inventory.exoCoreCount,inventory.exoLimbsCount,inventory.empExoHeadCount,inventory.empExoCoreCount,inventory.empExoLimbsCount]).toEqual([0,0,0,0,0,0]);
    expect(inventory.exoActive).toBe(false);expect(inventory.exoEndsAt).toBe(0);
    clock.value=10_000;room.updateExoSuits();room.updateMotorcycles(.05);expect(room.state.motorcycles.has(robot!.id)).toBe(true);expect(robot?.destroyed).toBe(false);
  });

  it('refuses fusion when even one of the six parts is missing',()=>{
    const room=roomAt({value:5}),point=openPoint(room),pilot=player('pilot',point.x,point.y),send=vi.fn();room.state.players.set(pilot.id,pilot);const inventory=grantSixParts(room,pilot.id);inventory.empExoLimbsCount=0;
    room.activateFusionRobot({sessionId:pilot.id,send});expect(room.state.motorcycles.size).toBe(0);expect(pilot.isDriving).toBe(false);expect(send).toHaveBeenCalledWith('notice',expect.objectContaining({type:'warning'}));
  });

  it('switches with 1-4 and fires every red and blue weapon from the vehicle',()=>{
    const clock={value:20},room=roomAt(clock),point=openPoint(room),pilot=player('pilot',point.x,point.y),{client,robot}=assemble(room,pilot),broadcast=vi.fn();room.broadcast=broadcast;expect(robot).toBeDefined();
    room.switchWeapon(client,{slot:1});room.firePlayer(pilot,{aimWorldX:point.x+500,aimWorldY:point.y});expect([...room.state.rockets.values()].some((rocket:any)=>rocket.weaponId==='exo_missile')).toBe(true);room.state.rockets.clear();
    clock.value+=EXO_SUIT_BALANCE.bombCooldownSeconds+.01;const target=player('target',point.x+240,point.y);room.state.players.set(target.id,target);room.switchWeapon(client,{slot:2});room.firePlayer(pilot,{aimWorldX:target.x,aimWorldY:target.y});expect(target.hp).toBe(100-EXO_SUIT_BALANCE.laserDamage);room.state.players.delete(target.id);
    clock.value+=EXO_SUIT_BALANCE.laserCooldownSeconds+.01;const bike=new MotorcycleState();bike.id='target-bike';bike.x=point.x+260;bike.y=point.y;bike.hp=180;bike.maxHp=180;room.state.motorcycles.set(bike.id,bike);const random=vi.spyOn(Math,'random').mockReturnValue(.5);room.switchWeapon(client,{slot:3});room.firePlayer(pilot,{aimWorldX:bike.x,aimWorldY:bike.y});room.updateBullets(.2);random.mockRestore();expect(bike.hp).toBe(180-EMP_EXO_SUIT_BALANCE.machineGunMechanicalDamage);
    clock.value+=EMP_EXO_SUIT_BALANCE.machineGunCooldownSeconds+.01;bike.velocityX=180;room.switchWeapon(client,{slot:4});room.firePlayer(pilot);expect(bike.empDisabledUntil).toBe(clock.value+EMP_EXO_SUIT_BALANCE.empDisableSeconds);expect(robot?.empDisabledUntil).toBe(0);expect(robot?.fusionEmpReadyAt).toBe(clock.value+EMP_EXO_SUIT_BALANCE.empCooldownSeconds);expect(broadcast).toHaveBeenCalledWith('empPulse',expect.objectContaining({affectedTargets:expect.arrayContaining([expect.objectContaining({id:'target-bike',velocityX:180})])}));
  });

  it('returns both complete part families only after the permanent vehicle is destroyed',()=>{
    const clock={value:30},room=roomAt(clock),point=openPoint(room),pilot=player('pilot',point.x,point.y),{robot}=assemble(room,pilot);expect(robot).toBeDefined();
    room.damageMotorcycle(robot,FUSION_ROBOT_BALANCE.maxHp,'enemy','test');expect(robot?.exploding).toBe(true);expect(room.state.loot.size).toBe(0);
    clock.value+=MOTORCYCLE_DESTRUCTION_BALANCE.explosionFuseMs/1000+.01;room.updateMotorcycles(.02);expect(robot?.destroyed).toBe(true);
    const kinds=[...room.state.loot.values()].map((loot:any)=>loot.kind);for(const kind of ['exo_head','exo_core','exo_limbs','emp_exo_head','emp_exo_core','emp_exo_limbs'])expect(kinds.filter((value:string)=>value===kind),kind).toHaveLength(EXO_PART_COPIES_PER_MAP);
  });

  it('keeps the center tank at twenty cannon shells',()=>{expect(TANK_BALANCE.cannonShells).toBe(20);});
});

const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
const hud=readFileSync(fileURLToPath(new URL('../../client/src/main.ts',import.meta.url)),'utf8');
describe('Refactor 040 fusion robot client contract',()=>{
  it('routes V, exposes four vehicle slots, and renders the side-by-side chassis',()=>{
    expect(scene).toContain("this.keys.V.on('down'");expect(scene).toContain("this.net.send('activateFusionRobot')");expect(scene).toContain("vehicleKind==='fusion_robot'");expect(scene).toContain('redArmor');expect(scene).toContain('blueArmor');expect(scene).toContain('if(!fusionMounted)this.drawPlayer');expect(scene).toContain('if(me.isDriving){this.pickupText.setVisible(false)');expect(hud).toContain('FUSION_ROBOT_WEAPON_NAMES[4]');expect(hud).toContain("'fusion-loadout'");
  });
});
