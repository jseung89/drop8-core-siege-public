import { describe, expect, it, vi } from 'vitest';
import { FUSION_ROBOT_BALANCE, MAP_CONFIGS, WEREWOLF_BALANCE } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { OPEN_ARENA_FUSION_PARTS_SUPPLY_SEQUENCE } from '../src/rooms/openArenaWorld.js';
import { MotorcycleState, PlayerState, SupplyDropState } from '../src/rooms/schema.js';

const fusionPartKinds=['exo_head','exo_core','exo_limbs','emp_exo_head','emp_exo_core','emp_exo_limbs'] as const;

function roomAt(clock:{value:number}){
  const room=new Drop8Room() as any;
  room.now=()=>clock.value;room.gameMode='openArena';room.state.phase='ACTIVE';room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=MAP_CONFIGS.small.width;room.firstObstacleHitT=()=>null;
  return room;
}

function player(room:any,id:string,x:number,y:number){const value=new PlayerState();value.id=id;value.name=id;value.alive=true;value.phase='landed';value.x=x;value.y=y;room.state.players.set(id,value);room.tacticalInventory(id);return value;}

function mountedFusionRobot(room:any,driver:PlayerState,x:number,y:number){const robot=new MotorcycleState();robot.id='fusion-counter-target';robot.vehicleKind='fusion_robot';robot.x=x;robot.y=y;robot.hp=FUSION_ROBOT_BALANCE.maxHp;robot.maxHp=FUSION_ROBOT_BALANCE.maxHp;robot.driverId=driver.id;driver.isDriving=true;driver.vehicleId=robot.id;room.state.motorcycles.set(robot.id,robot);return robot;}

describe('Refactor 041 Open Arena fusion climax and werewolf counter',()=>{
  it('puts all six robot parts in exactly the third recurring Open Arena supply',()=>{
    const room=roomAt({value:10});let index=0;room.findSupplyPosition=()=>({x:900+index++*240,y:900});room.findSeparatedLootPosition=(x:number,y:number)=>({x,y});room.lootRandom=()=>.8;
    for(let sequence=1;sequence<=3;sequence++)expect(room.spawnSupplyDrop({allowMultiple:true,openArenaRecurring:true})).toBe(true);
    const drops=[...room.state.supplyDrops.values()].sort((a:any,b:any)=>a.openArenaSequence-b.openArenaSequence) as SupplyDropState[];
    expect(drops.map((drop)=>drop.openArenaSequence)).toEqual([1,2,OPEN_ARENA_FUSION_PARTS_SUPPLY_SEQUENCE]);
    room.spawnSupplyContents(drops[2]!);const thirdKinds=[...room.state.loot.values()].map((loot:any)=>loot.kind);
    for(const kind of fusionPartKinds)expect(thirdKinds.filter((value:string)=>value===kind),kind).toHaveLength(1);
    room.state.loot.clear();const later=new SupplyDropState();later.id='later';later.x=1800;later.y=900;later.specialWeapon='bazooka';later.openArenaSequence=4;room.spawnSupplyContents(later);
    const laterKinds=[...room.state.loot.values()].map((loot:any)=>loot.kind);for(const kind of fusionPartKinds)expect(laterKinds).not.toContain(kind);
  });

  it('lets two werewolf claws eject and disable a fusion robot while preserving ordinary vehicle damage',()=>{
    const clock={value:1},room=roomAt(clock),wolf=player(room,'wolf',2000,2000),driver=player(room,'driver',2060,2000),robot=mountedFusionRobot(room,driver,2060,2000);wolf.angle=0;wolf.werewolf.transformed=true;wolf.werewolf.transformEndsAt=99;
    room.werewolfClaw(wolf);expect(robot.hp).toBe(FUSION_ROBOT_BALANCE.maxHp-WEREWOLF_BALANCE.fusionClawDamage);expect(robot.huntMarkedBy).toBe(wolf.id);expect(driver.isDriving).toBe(true);
    clock.value=1.7;room.werewolfClaw(wolf);expect(robot.hp).toBe(FUSION_ROBOT_BALANCE.maxHp-WEREWOLF_BALANCE.fusionClawDamage*2);expect(driver.isDriving).toBe(false);expect(driver.vehicleId).toBe('');expect(robot.empDisabledUntil).toBe(clock.value+WEREWOLF_BALANCE.fusionDisableSeconds);expect(driver.werewolf.actionLockedUntil).toBe(clock.value+WEREWOLF_BALANCE.fusionDriverLockSeconds);
    driver.x=robot.x+60;driver.y=robot.y;expect(room.mountMotorcycle(driver,robot,{send:vi.fn()})).toBe(false);clock.value=driver.werewolf.actionLockedUntil+.01;expect(room.mountMotorcycle(driver,robot,{send:vi.fn()})).toBe(true);expect(room.mechanicalActionDisabled(driver)).toBe(true);expect(WEREWOLF_BALANCE.huntVehicleDamage).toBe(8);
  });

  it('turns sustained werewolf aura contact into a fusion robot shutdown',()=>{
    const clock={value:5},room=roomAt(clock),wolf=player(room,'wolf',1000,1000),driver=player(room,'driver',1040,1000),robot=mountedFusionRobot(room,driver,1040,1000);wolf.werewolf.transformed=true;wolf.werewolf.transformEndsAt=99;
    room.updateWerewolfAura();expect(robot.hp).toBe(FUSION_ROBOT_BALANCE.maxHp-WEREWOLF_BALANCE.fusionAuraVehicleDamage);expect(driver.isDriving).toBe(true);
    clock.value=5.81;room.updateWerewolfAura();expect(driver.isDriving).toBe(false);expect(robot.empDisabledUntil).toBe(clock.value+WEREWOLF_BALANCE.fusionDisableSeconds);expect(robot.hp).toBe(FUSION_ROBOT_BALANCE.maxHp-WEREWOLF_BALANCE.fusionAuraVehicleDamage*2);
  });
});
