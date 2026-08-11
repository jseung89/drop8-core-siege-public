// DROP8_REFACTOR_017_ADHESIVE_STRIP_LOBBY_BAZOOKA_WATER
import { describe, expect, it } from 'vitest';
import { ADHESIVE_SPRAYER_BALANCE, MAP_CONFIGS, STRIP_TRAP_BALANCE, STRIP_TRAP_VEHICLE_PROFILE, WEAPONS, distance } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { MotorcycleState, PlayerState, StripTrapState } from '../src/rooms/schema.js';

function roomAt(nowRef:{value:number}){const room=new Drop8Room() as any;room.state.mapId='dock8';room.state.mapSizeMode='dock8';room.state.worldSize=MAP_CONFIGS.dock8.width;room.now=()=>nowRef.value;room.setMatchmaking=async()=>undefined;return room;}
function player(id:string,x:number,y:number){const p=new PlayerState();p.id=id;p.alive=true;p.phase='landed';p.x=x;p.y=y;p.angle=0;p.buildingId='';return p;}

describe('Refactor 017 adhesive sprayer and strip trap authority',()=>{
  it('accumulates exposure, applies a capped vehicle slow, and restores neutral state',()=>{
    const clock={value:0},room=roomAt(clock),p=player('sprayer',200,200),bike=new MotorcycleState();
    p.primary='adhesive_sprayer';p.equipped='adhesive_sprayer';room.tacticalInventory(p.id).adhesiveSprayerMagazine=20;bike.id='bike';bike.x=p.x+180;bike.y=p.y;room.state.players.set(p.id,p);room.state.motorcycles.set(bike.id,bike);
    for(const t of [0,.11,.22,.33,.44]){clock.value=t;room.firePlayer(p);}
    expect(room.tacticalInventory(p.id).adhesiveSprayerMagazine).toBe(15);expect(room.state.adhesiveJets.size).toBeGreaterThan(0);
    expect(bike.slowKind).toBe('adhesive');expect(bike.slowSpeedMultiplier).toBe(ADHESIVE_SPRAYER_BALANCE.motorcycle.speedMultiplier);
    clock.value=7;room.syncVehicleSlowState(bike,clock.value);expect(bike.slowKind).toBe('');expect(bike.slowSpeedMultiplier).toBe(1);
  });

  it('places adhesive puddles near the clicked world target instead of always at max range',()=>{
    const clock={value:0},room=roomAt(clock),p=player('sprayer',900,900);
    p.primary='adhesive_sprayer';p.equipped='adhesive_sprayer';room.tacticalInventory(p.id).adhesiveSprayerMagazine=20;room.state.players.set(p.id,p);
    const origin={x:p.x+Math.cos(p.angle)*ADHESIVE_SPRAYER_BALANCE.muzzleOffset,y:p.y+Math.sin(p.angle)*ADHESIVE_SPRAYER_BALANCE.muzzleOffset};
    const target=[{x:p.x+150,y:p.y+70},{x:p.x+140,y:p.y-80},{x:p.x+220,y:p.y+20}].find((point)=>room.isPositionFree(point.x,point.y,12)&&room.firstObstacleHitT(origin.x,origin.y,point.x,point.y,2)===null)!;
    expect(target).toBeTruthy();
    room.firePlayer(p,{aimWorldX:target.x,aimWorldY:target.y});
    const puddle=[...room.state.adhesiveJets.values()].find((jet)=>jet.id.startsWith('adhesive-puddle-'));
    const stream=[...room.state.adhesiveJets.values()].find((jet)=>jet.id.startsWith('adhesive-')&&!jet.id.startsWith('adhesive-puddle-'));
    expect(puddle).toBeTruthy();
    expect(distance(puddle!.x,puddle!.y,target.x,target.y)).toBeLessThan(50);
    expect(stream).toBeTruthy();expect(stream!.range).toBeCloseTo(distance(origin.x,origin.y,target.x,target.y));
    expect(stream!.angle).toBeCloseTo(Math.atan2(target.y-origin.y,target.x-origin.x));
  });

  it('activates after 0.8 seconds, triggers once, and does not affect walking players',()=>{
    const clock={value:0},room=roomAt(clock),owner=player('owner',2500,3200),walker=player('walker',200,200),bike=new MotorcycleState();
    room.state.players.set(owner.id,owner);room.state.players.set(walker.id,walker);bike.id='bike';bike.x=2600;bike.y=3200;room.state.motorcycles.set(bike.id,bike);
    const trap=new StripTrapState();trap.id='trap';trap.ownerId=owner.id;trap.x=2600;trap.y=3200;trap.angle=0;trap.length=STRIP_TRAP_BALANCE.length;trap.width=STRIP_TRAP_BALANCE.width;trap.hp=30;trap.maxHp=30;trap.placedAt=0;trap.activatesAt=.8;trap.expiresAt=60;room.state.stripTraps.set(trap.id,trap);
    clock.value=.7;room.updateStripTraps();expect(room.state.stripTraps.has(trap.id)).toBe(true);expect(bike.slowKind).toBe('');expect(walker.hp).toBe(100);
    clock.value=.81;room.updateStripTraps();expect(room.state.stripTraps.has(trap.id)).toBe(false);expect(bike.slowKind).toBe('strip_trap');expect(walker.hp).toBe(100);
  });

  it('makes tanks especially vulnerable to adhesive and strip-trap setup tools',()=>{
    const clock={value:1},room=roomAt(clock),tank=new MotorcycleState();
    tank.id='tank';tank.vehicleKind='tank';tank.x=400;tank.y=400;room.state.motorcycles.set(tank.id,tank);
    room.applyVehicleSlow(tank,'adhesive','test',ADHESIVE_SPRAYER_BALANCE.motorcycle,ADHESIVE_SPRAYER_BALANCE.motorcycle.maxDurationSeconds);
    expect(tank.slowSpeedMultiplier).toBe(.24);
    expect(tank.slowAccelerationMultiplier).toBe(.16);
    expect(tank.slowSteeringMultiplier).toBe(.38);
    expect(tank.slowUntil).toBeCloseTo(1+ADHESIVE_SPRAYER_BALANCE.motorcycle.durationSeconds*1.55);
    clock.value=20;room.syncVehicleSlowState(tank,clock.value);
    room.applyVehicleSlow(tank,'strip_trap','trap',STRIP_TRAP_VEHICLE_PROFILE.motorcycle);
    expect(tank.slowSpeedMultiplier).toBe(.22);
    expect(tank.slowAccelerationMultiplier).toBe(.12);
    expect(tank.slowSteeringMultiplier).toBe(.28);
    expect(tank.slowUntil).toBeCloseTo(20+STRIP_TRAP_VEHICLE_PROFILE.motorcycle.durationSeconds*1.85);
  });

  it('turns strip traps into an anti-tank EMP counter',()=>{
    const clock={value:1},room=roomAt(clock),owner=player('owner',300,300),tank=new MotorcycleState(),trap=new StripTrapState();
    tank.id='tank';tank.vehicleKind='tank';tank.x=460;tank.y=400;tank.hp=720;tank.maxHp=720;room.state.players.set(owner.id,owner);room.state.motorcycles.set(tank.id,tank);
    trap.id='trap';trap.ownerId=owner.id;trap.x=tank.x;trap.y=tank.y;trap.angle=0;trap.length=STRIP_TRAP_BALANCE.length;trap.width=STRIP_TRAP_BALANCE.width;trap.hp=30;trap.maxHp=30;trap.placedAt=0;trap.activatesAt=.8;trap.expiresAt=60;room.state.stripTraps.set(trap.id,trap);
    room.updateStripTraps();
    expect(room.state.stripTraps.has(trap.id)).toBe(false);
    expect(tank.hp).toBe(540);
    expect(tank.slowKind).toBe('strip_trap');
  });


  it('clears countermeasure state on vehicle destruction and round completion',async()=>{
    const clock={value:1},room=roomAt(clock),owner=player('owner',200,200),survivor=player('survivor',500,500),bike=new MotorcycleState(),trap=new StripTrapState();
    bike.id='bike';bike.x=300;bike.y=200;room.state.players.set(owner.id,owner);room.state.players.set(survivor.id,survivor);room.state.motorcycles.set(bike.id,bike);
    room.applyVehicleSlow(bike,'adhesive',owner.id,ADHESIVE_SPRAYER_BALANCE.motorcycle,ADHESIVE_SPRAYER_BALANCE.motorcycle.maxDurationSeconds);
    room.beginMotorcycleExplosion(bike,'test');expect(bike.slowKind).toBe('');expect(bike.slowUntil).toBe(0);
    bike.exploding=false;bike.hp=180;owner.alive=false;trap.id='trap';trap.ownerId=owner.id;trap.expiresAt=60;room.state.stripTraps.set(trap.id,trap);
    room.applyVehicleSlow(bike,'strip_trap',owner.id,STRIP_TRAP_VEHICLE_PROFILE.motorcycle);
    room.finishCheck();await room.registrySyncQueue;expect(room.state.phase).toBe('FINISHED');expect(room.state.stripTraps.size).toBe(0);expect(bike.slowKind).toBe('');
  });

  it('preserves the current manual weapon and vehicle counter values',()=>{
    expect(WEAPONS.bazooka.projectileSpeed).toBe(900);expect(WEAPONS.flamethrower.range).toBe(420);expect(WEAPONS.adhesive_sprayer.range).toBe(420);
  });
});
