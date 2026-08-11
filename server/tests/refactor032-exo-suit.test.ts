import { describe, expect, it, vi } from 'vitest';
import { EXO_PART_COPIES_PER_MAP, EXO_SUIT_BALANCE, MAP_CONFIGS } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { MotorcycleState, PlayerState } from '../src/rooms/schema.js';

function roomAt(clock:{value:number}){const room=new Drop8Room() as any;room.now=()=>clock.value;room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=MAP_CONFIGS.small.width;room.state.phase='ACTIVE';return room;}
function player(id:string,x=900,y=900){const p=new PlayerState();p.id=id;p.name=id;p.alive=true;p.phase='landed';p.x=x;p.y=y;return p;}
function openPair(room:any){for(let y=180;y<MAP_CONFIGS.small.height-180;y+=120)for(let x=180;x<MAP_CONFIGS.small.width-360;x+=120)if(room.isPositionFree(x,y,24)&&room.isPositionFree(x+150,y,24)&&room.firstObstacleHitT(x,y,x+150,y,2)===null)return{x,y};throw new Error('No open exo test position');}

describe('Refactor 032 steel exo suit',()=>{
  it('uses the upgraded sustained beam balance',()=>{expect(EXO_SUIT_BALANCE.laserDamage).toBe(36);expect(EXO_SUIT_BALANCE.laserVehicleDamage).toBe(28);expect(EXO_SUIT_BALANCE.laserRange).toBe(1150);expect(EXO_SUIT_BALANCE.laserCooldownSeconds).toBe(.34);});
  it('spawns two head, core, and limbs sets across the map',()=>{
    const room=roomAt({value:0});room.spawnLoot();const kinds=[...room.state.loot.values()].map((loot:any)=>loot.kind);
    for(const kind of ['exo_head','exo_core','exo_limbs'])expect(kinds.filter((value:string)=>value===kind)).toHaveLength(EXO_PART_COPIES_PER_MAP);
  });

  it('locks actions during a three-stage assembly before activating the timed 700 hp suit',()=>{
    const clock={value:10},room=roomAt(clock),p=player('pilot'),send=vi.fn(),inventory=room.tacticalInventory(p.id);room.state.players.set(p.id,p);
    inventory.exoHeadCount=1;inventory.exoCoreCount=1;inventory.exoLimbsCount=1;room.activateExoSuit({sessionId:p.id,send});
    expect(inventory.exoAssembling).toBe(true);expect(inventory.exoActive).toBe(false);expect(p.werewolf.actionLockedUntil).toBe(10+EXO_SUIT_BALANCE.assemblySeconds);
    clock.value=10+EXO_SUIT_BALANCE.assemblySeconds;room.updateExoSuits();
    expect(inventory.exoAssembling).toBe(false);expect(inventory.exoActive).toBe(true);expect(inventory.exoHp).toBe(EXO_SUIT_BALANCE.maxHp);expect(inventory.exoEndsAt).toBe(clock.value+EXO_SUIT_BALANCE.durationSeconds);
    expect(inventory.exoHeadCount+inventory.exoCoreCount+inventory.exoLimbsCount).toBe(0);
  });

  it('absorbs damage with suit hp and scatters all parts when time expires',()=>{
    const clock={value:2},room=roomAt(clock),p=player('pilot'),inventory=room.tacticalInventory(p.id);room.state.players.set(p.id,p);inventory.exoActive=true;inventory.exoHp=700;inventory.exoEndsAt=42;
    room.damage(p,120,'','test',0,undefined,'bullet');expect(p.hp).toBe(100);expect(inventory.exoHp).toBe(580);
    clock.value=42.01;room.updateExoSuits();expect(inventory.exoActive).toBe(false);
    const parts=[...room.state.loot.values()].filter((loot:any)=>String(loot.kind).startsWith('exo_'));expect(parts).toHaveLength(EXO_PART_COPIES_PER_MAP*3);
  });

  it('drops held parts again when their carrier dies',()=>{
    const room=roomAt({value:1}),p=player('carrier'),inventory=room.tacticalInventory(p.id);room.state.players.set(p.id,p);inventory.exoHeadCount=1;inventory.exoLimbsCount=1;
    room.dropInventory(p);const kinds=[...room.state.loot.values()].map((loot:any)=>loot.kind);expect(kinds).toContain('exo_head');expect(kinds).toContain('exo_limbs');
  });

  it('fires a small left-hand explosion and a right-hand laser',()=>{
    const clock={value:5},room=roomAt(clock),point=openPair(room),pilot=player('pilot',point.x,point.y),bombTarget=player('target',point.x+150,point.y);room.state.players.set(pilot.id,pilot);room.state.players.set(bombTarget.id,bombTarget);const inventory=room.tacticalInventory(pilot.id);inventory.exoActive=true;inventory.exoHp=700;inventory.exoEndsAt=45;
    room.fireExoBomb({sessionId:pilot.id,send:vi.fn()},{aimWorldX:bombTarget.x,aimWorldY:bombTarget.y});expect([...room.state.rockets.values()].some((value:any)=>value.weaponId==='exo_missile')).toBe(true);room.updateRockets(.2);expect(bombTarget.hp).toBeLessThan(100);expect([...room.state.explosions.values()].some((value:any)=>value.kind==='exoBomb')).toBe(true);
    const hpAfterBomb=bombTarget.hp;room.fireExoLaser({sessionId:pilot.id,send:vi.fn()},{aimWorldX:bombTarget.x,aimWorldY:bombTarget.y});expect(bombTarget.hp).toBeLessThan(hpAfterBomb);
  });

  it('damages motorcycles and tanks with both exo weapons',()=>{
    const clock={value:8},room=roomAt(clock),point=openPair(room),pilot=player('pilot',point.x,point.y),bike=new MotorcycleState(),tank=new MotorcycleState();room.state.players.set(pilot.id,pilot);const inventory=room.tacticalInventory(pilot.id);inventory.exoActive=true;inventory.exoHp=700;inventory.exoEndsAt=48;
    bike.id='bike';bike.x=point.x+150;bike.y=point.y;bike.hp=180;bike.maxHp=180;room.state.motorcycles.set(bike.id,bike);
    room.fireExoBomb({sessionId:pilot.id,send:vi.fn()},{aimWorldX:bike.x,aimWorldY:bike.y});room.updateRockets(.2);expect(bike.hp).toBeLessThan(180);
    room.state.motorcycles.delete(bike.id);clock.value=9;tank.id='tank';tank.vehicleKind='tank';tank.x=point.x+150;tank.y=point.y;tank.hp=720;tank.maxHp=720;room.state.motorcycles.set(tank.id,tank);
    room.fireExoLaser({sessionId:pilot.id,send:vi.fn()},{aimWorldX:tank.x,aimWorldY:tank.y});expect(tank.hp).toBeLessThan(720);
  });
});
