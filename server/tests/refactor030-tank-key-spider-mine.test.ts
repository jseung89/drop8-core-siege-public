import { describe, expect, it, vi } from 'vitest';
import { MAP_CONFIGS, SPIDER_MINE_BALANCE, spaceAt } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { LootState, MotorcycleState, PlayerState, ThrownObjectState } from '../src/rooms/schema.js';

function roomAt(clock:{value:number}){
  const room=new Drop8Room() as any;
  room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=MAP_CONFIGS.small.width;
  room.now=()=>clock.value;room.lootRandom=()=>.43;
  return room;
}

function player(id:string,x:number,y:number){
  const p=new PlayerState();p.id=id;p.alive=true;p.phase='landed';p.x=x;p.y=y;p.angle=0;
  const space=spaceAt(x,y,MAP_CONFIGS.small.buildingVisibilityZones,MAP_CONFIGS.small.rooms,0);p.buildingId=space.buildingId;p.roomIndex=space.roomIndex;
  return p;
}

function openPair(room:any,separation=130){
  for(let y=180;y<MAP_CONFIGS.small.height-180;y+=120)for(let x=180;x<MAP_CONFIGS.small.width-300;x+=120){
    if(room.isPositionFree(x,y,20)&&room.isPositionFree(x+separation,y,24)&&room.firstObstacleHitT(x,y,x+separation,y,15)===null)return{x,y};
  }
  throw new Error('No open test position found');
}

describe('Refactor 030 tank key and spider mine',()=>{
  it('guarantees one tank key in the initial field loot',()=>{
    const room=roomAt({value:0});
    room.spawnLoot();
    expect([...room.state.loot.values()].filter((loot:LootState)=>loot.kind==='tank_key')).toHaveLength(1);
  });

  it('rejects tank mounting without a key and allows a key holder to mount',()=>{
    const room=roomAt({value:5}),p=player('driver',900,900),tank=new MotorcycleState(),send=vi.fn();
    tank.id='tank';tank.vehicleKind='tank';tank.x=p.x+30;tank.y=p.y;tank.hp=720;tank.maxHp=720;
    room.state.players.set(p.id,p);room.state.motorcycles.set(tank.id,tank);
    expect(room.mountMotorcycle(p,tank,{sessionId:p.id,send})).toBe(false);
    expect(send).toHaveBeenCalledWith('notice',expect.objectContaining({message:expect.stringContaining('탱크 열쇠')}));
    room.tacticalInventory(p.id).tankKeyCount=1;
    expect(room.mountMotorcycle(p,tank,{sessionId:p.id,send})).toBe(true);
    expect(p.vehicleId).toBe(tank.id);
    expect(room.tacticalInventory(p.id).tankKeyCount).toBe(1);
  });

  it('places, arms, reveals, and detonates a spider mine against an enemy',()=>{
    const clock={value:1},room=roomAt(clock),point=openPair(room),owner=player('owner',point.x-54,point.y),target=player('target',point.x+130,point.y),send=vi.fn();
    owner.angle=0;room.state.players.set(owner.id,owner);room.state.players.set(target.id,target);room.tacticalInventory(owner.id).spiderMineCount=1;
    room.placeSpiderMine({sessionId:owner.id,send});
    const mine=[...room.state.thrownObjects.values()].find((object:ThrownObjectState)=>object.kind==='spiderMine') as ThrownObjectState;
    expect(mine).toBeDefined();expect(mine.phase).toBe('arming');expect(room.tacticalInventory(owner.id).spiderMineCount).toBe(0);
    clock.value=mine.activatesAt+.01;room.updateSpiderMines(.1);
    expect(mine.phase).toBe('chasing');expect(mine.targetId).toBe(target.id);expect(mine.x).toBeGreaterThan(point.x);
    for(let i=0;i<8&&room.state.thrownObjects.has(mine.id);i++){clock.value+=.1;room.updateSpiderMines(.1);}
    expect(room.state.thrownObjects.has(mine.id)).toBe(false);
    expect([...room.state.explosions.values()].some((explosion:any)=>explosion.kind==='spiderMine')).toBe(true);
    expect(target.hp).toBeLessThan(100);expect(owner.hp).toBe(100);
  });

  it('deals amplified anti-tank damage without one-shotting a full tank',()=>{
    const clock={value:10},room=roomAt(clock),point=openPair(room),owner=player('owner',point.x-130,point.y),tank=new MotorcycleState(),mine=new ThrownObjectState(),mineSpace=spaceAt(point.x,point.y,MAP_CONFIGS.small.buildingVisibilityZones,MAP_CONFIGS.small.rooms,0);
    room.state.players.set(owner.id,owner);tank.id='tank';tank.vehicleKind='tank';tank.x=point.x;tank.y=point.y;tank.hp=720;tank.maxHp=720;tank.buildingId=mineSpace.buildingId;room.state.motorcycles.set(tank.id,tank);
    mine.id='mine';mine.kind='spiderMine';mine.ownerId=owner.id;mine.x=tank.x;mine.y=tank.y;mine.phase='chasing';mine.buildingId=mineSpace.buildingId;mine.roomIndex=mineSpace.roomIndex;room.state.thrownObjects.set(mine.id,mine);
    room.explodeSpiderMine(mine);
    const damage=720-tank.hp;
    expect(damage).toBeGreaterThanOrEqual(Math.round(SPIDER_MINE_BALANCE.maxVehicleDamage*SPIDER_MINE_BALANCE.tankDamageMultiplier)-1);
    expect(tank.hp).toBeGreaterThan(0);
  });
});
