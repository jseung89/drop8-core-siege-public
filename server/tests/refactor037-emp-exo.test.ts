import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { EMP_EXO_SUIT_BALANCE, EXO_PART_COPIES_PER_MAP, MAP_CONFIGS } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { MotorcycleState, PlayerState } from '../src/rooms/schema.js';

function roomAt(clock:{value:number}){
  const room=new Drop8Room() as any;
  room.now=()=>clock.value;
  room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=MAP_CONFIGS.small.width;room.state.phase='ACTIVE';
  return room;
}

function player(id:string,x=900,y=900){const value=new PlayerState();value.id=id;value.name=id;value.alive=true;value.phase='landed';value.x=x;value.y=y;return value;}

function openPair(room:any){
  for(let y=180;y<MAP_CONFIGS.small.height-180;y+=120)for(let x=180;x<MAP_CONFIGS.small.width-360;x+=120)if(room.isPositionFree(x,y,24)&&room.isPositionFree(x+170,y,24)&&room.firstObstacleHitT(x,y,x+170,y,2)===null)return{x,y};
  throw new Error('No open EMP exo test position');
}

function openLongPair(room:any){
  for(let y=220;y<MAP_CONFIGS.small.height-220;y+=120)for(let x=220;x<MAP_CONFIGS.small.width-620;x+=120)if(room.isPositionFree(x,y,24)&&room.isPositionFree(x+360,y,24)&&room.firstObstacleHitT(x,y,x+420,y,4)===null)return{x,y};
  throw new Error('No open long-range EMP exo test position');
}

describe('Refactor 037 blue EMP robot',()=>{
  it('spawns two complete blue robot sets without replacing the steel sets',()=>{
    const room=roomAt({value:0});room.spawnLoot();const kinds=[...room.state.loot.values()].map((loot:any)=>loot.kind);
    for(const kind of ['exo_head','exo_core','exo_limbs','emp_exo_head','emp_exo_core','emp_exo_limbs'])expect(kinds.filter((value:string)=>value===kind),kind).toHaveLength(EXO_PART_COPIES_PER_MAP);
  });

  it('assembles the three blue parts into the timed 560 hp robot',()=>{
    const clock={value:10},room=roomAt(clock),pilot=player('pilot'),send=vi.fn(),inventory=room.tacticalInventory(pilot.id);room.state.players.set(pilot.id,pilot);
    inventory.empExoHeadCount=1;inventory.empExoCoreCount=1;inventory.empExoLimbsCount=1;room.activateExoSuit({sessionId:pilot.id,send},'emp');
    expect(inventory.exoAssembling).toBe(true);expect(inventory.exoKind).toBe('emp');
    clock.value+=EMP_EXO_SUIT_BALANCE.assemblySeconds;room.updateExoSuits();
    expect(inventory.exoActive).toBe(true);expect(inventory.exoKind).toBe('emp');expect(inventory.exoHp).toBe(EMP_EXO_SUIT_BALANCE.maxHp);expect(inventory.exoEndsAt).toBe(clock.value+EMP_EXO_SUIT_BALANCE.durationSeconds);
    expect(inventory.empExoHeadCount+inventory.empExoCoreCount+inventory.empExoLimbsCount).toBe(0);
  });

  it('EMP-stops nearby vehicles, robots, and drone shields for six seconds',()=>{
    const clock={value:20},room=roomAt(clock),point=openPair(room),pilot=player('pilot',point.x,point.y),robot=player('robot',point.x+120,point.y),droneCarrier=player('drone',point.x,point.y+140);room.state.players.set(pilot.id,pilot);room.state.players.set(robot.id,robot);room.state.players.set(droneCarrier.id,droneCarrier);
    const broadcast=vi.fn();room.broadcast=broadcast;
    const pilotExo=room.tacticalInventory(pilot.id);pilotExo.exoActive=true;pilotExo.exoKind='emp';pilotExo.exoHp=EMP_EXO_SUIT_BALANCE.maxHp;pilotExo.exoEndsAt=62;pilotExo.empPulseReadyAt=clock.value;
    const robotExo=room.tacticalInventory(robot.id);robotExo.exoActive=true;robotExo.exoKind='assault';robotExo.exoHp=700;robotExo.exoEndsAt=60;
    const drones=room.tacticalInventory(droneCarrier.id);drones.hunterDroneCount=2;
    const bike=new MotorcycleState();bike.id='bike';bike.x=point.x+180;bike.y=point.y;bike.velocityX=300;bike.speed=300;room.state.motorcycles.set(bike.id,bike);
    const tank=new MotorcycleState();tank.id='tank';tank.vehicleKind='tank';tank.x=point.x;tank.y=point.y+220;tank.velocityY=120;tank.speed=120;room.state.motorcycles.set(tank.id,tank);
    const edgeBike=new MotorcycleState();edgeBike.id='edge';edgeBike.x=point.x+EMP_EXO_SUIT_BALANCE.empRadius-15;edgeBike.y=point.y;room.state.motorcycles.set(edgeBike.id,edgeBike);
    const farBike=new MotorcycleState();farBike.id='far';farBike.x=point.x+EMP_EXO_SUIT_BALANCE.empRadius+80;farBike.y=point.y;room.state.motorcycles.set(farBike.id,farBike);
    room.fireEmpExoPulse({sessionId:pilot.id,send:vi.fn()});
    const disabledUntil=clock.value+EMP_EXO_SUIT_BALANCE.empDisableSeconds;
    expect(bike.empDisabledUntil).toBe(disabledUntil);expect(bike.speed).toBe(0);expect(tank.empDisabledUntil).toBe(disabledUntil);expect(tank.speed).toBe(0);expect(edgeBike.empDisabledUntil).toBe(disabledUntil);
    expect(robotExo.empDisabledUntil).toBe(disabledUntil);expect(drones.empDisabledUntil).toBe(disabledUntil);expect(farBike.empDisabledUntil).toBe(0);
    expect(pilotExo.empPulseReadyAt).toBe(clock.value+EMP_EXO_SUIT_BALANCE.empCooldownSeconds);
    expect(broadcast).toHaveBeenCalledWith('empPulse',expect.objectContaining({fieldDuration:3.2,affectedTargets:expect.arrayContaining([expect.objectContaining({id:'bike',velocityX:300}),expect.objectContaining({id:'tank',velocityY:120})])}));
  });

  it('uses low player damage and triple mechanical damage for the blue machine gun',()=>{
    const clock={value:30},room=roomAt(clock),point=openPair(room),pilot=player('pilot',point.x,point.y),inventory=room.tacticalInventory(pilot.id);room.state.players.set(pilot.id,pilot);inventory.exoActive=true;inventory.exoKind='emp';inventory.exoHp=EMP_EXO_SUIT_BALANCE.maxHp;inventory.exoEndsAt=72;
    const bike=new MotorcycleState();bike.id='bike';bike.x=point.x+150;bike.y=point.y;bike.hp=180;bike.maxHp=180;room.state.motorcycles.set(bike.id,bike);
    room.fireEmpExoMachineGun({sessionId:pilot.id,send:vi.fn()},{aimWorldX:bike.x,aimWorldY:bike.y});room.updateBullets(.12);
    expect(bike.hp).toBe(180-EMP_EXO_SUIT_BALANCE.machineGunMechanicalDamage);
    room.state.motorcycles.clear();clock.value+=EMP_EXO_SUIT_BALANCE.machineGunCooldownSeconds+.01;
    const target=player('target',point.x+150,point.y);room.state.players.set(target.id,target);room.fireEmpExoMachineGun({sessionId:pilot.id,send:vi.fn()},{aimWorldX:target.x,aimWorldY:target.y});room.updateBullets(.12);
    expect(target.hp).toBe(100-EMP_EXO_SUIT_BALANCE.machineGunPlayerDamage);
    expect(EMP_EXO_SUIT_BALANCE.machineGunMechanicalDamage).toBe(EMP_EXO_SUIT_BALANCE.machineGunPlayerDamage*3);
  });

  it('corrects a near-miss machine-gun aim toward a mechanical target',()=>{
    const clock={value:35},room=roomAt(clock),point=openLongPair(room),pilot=player('pilot',point.x,point.y),inventory=room.tacticalInventory(pilot.id);room.state.players.set(pilot.id,pilot);inventory.exoActive=true;inventory.exoKind='emp';inventory.exoHp=EMP_EXO_SUIT_BALANCE.maxHp;inventory.exoEndsAt=77;
    const bike=new MotorcycleState();bike.id='assisted-bike';bike.x=point.x+360;bike.y=point.y;bike.hp=180;bike.maxHp=180;room.state.motorcycles.set(bike.id,bike);
    const random=vi.spyOn(Math,'random').mockReturnValue(.5);
    room.fireEmpExoMachineGun({sessionId:pilot.id,send:vi.fn()},{aimWorldX:bike.x,aimWorldY:bike.y+46});room.updateBullets(.24);
    random.mockRestore();
    expect(bike.hp).toBe(180-EMP_EXO_SUIT_BALANCE.machineGunMechanicalDamage);
  });

  it('blocks both blue robot weapons while the robot itself is EMP-disabled',()=>{
    const clock={value:40},room=roomAt(clock),pilot=player('pilot'),inventory=room.tacticalInventory(pilot.id);room.state.players.set(pilot.id,pilot);inventory.exoActive=true;inventory.exoKind='emp';inventory.exoHp=EMP_EXO_SUIT_BALANCE.maxHp;inventory.exoEndsAt=82;inventory.empDisabledUntil=46;inventory.empPulseReadyAt=40;
    room.fireEmpExoMachineGun({sessionId:pilot.id,send:vi.fn()},{aimWorldX:1100,aimWorldY:900});room.fireEmpExoPulse({sessionId:pilot.id,send:vi.fn()});
    expect(room.state.bullets.size).toBe(0);expect(inventory.empPulseReadyAt).toBe(40);
  });
});

const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
describe('Refactor 037 blue EMP robot client controls',()=>{
  it('routes C, left click, and right click to the blue robot actions',()=>{
    expect(scene).toContain("this.keys.C.on('down'");expect(scene).toContain("empExo?'empExoMachineGun'");expect(scene).toContain("empExo?'empExoPulse':'exoLaser'");expect(scene).toContain("type==='empPulse'");expect(scene).toContain('drawEmpPulseVisual');expect(scene).toContain('affectedTargets');
  });
});
