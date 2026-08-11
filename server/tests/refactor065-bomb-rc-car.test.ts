import { describe,expect,it,vi } from 'vitest';
import { MAP_CONFIGS,RC_CAR_BALANCE,WEAPONS,rcCarPlayerDamage,rcCarVehicleDamage } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { BulletState,PlayerState,ThrownObjectState } from '../src/rooms/schema.js';

function player(id:string,x:number,y:number,ai=false){const value=new PlayerState();value.id=id;value.name=id;value.x=x;value.y=y;value.ai=ai;value.alive=true;value.phase='landed';return value;}
function room(){const game=new Drop8Room() as any;game.gameMode='openArena';game.openArenaRoundState='active';game.state.phase='ACTIVE';game.state.mapId='small';game.state.worldSize=MAP_CONFIGS.small.width;game.firstObstacleHitT=vi.fn(()=>null);game.emitAudioEvent=vi.fn();game.addAiNoise=vi.fn();game.revealBushPlayer=vi.fn();game.damage=vi.fn();game.damageMotorcycle=vi.fn();return game;}

describe('Refactor 065 bomb RC car',()=>{
  it('defines a ground-seeking area weapon with distance falloff',()=>{
    expect(WEAPONS.rc_car).toMatchObject({name:'폭탄 RC카',magazine:1,reloadSeconds:3.4,ammoType:'rocket_ammo'});
    expect(RC_CAR_BALANCE).toMatchObject({searchRadius:1120,triggerRadius:62,lifetimeSeconds:8,maxHp:50,explosionRadius:235,maxPlayerDamage:120,maxVehicleDamage:210});
    expect(rcCarPlayerDamage(0)).toBe(120);expect(rcCarPlayerDamage(0,true)).toBe(60);expect(rcCarPlayerDamage(RC_CAR_BALANCE.explosionRadius+1)).toBe(0);
    expect(rcCarVehicleDamage(0)).toBe(210);
  });

  it('drives toward the nearest enemy and explodes on approach',()=>{
    const game=room(),owner=player('owner',100,100),target=player('target',520,100);owner.equipped='rc_car';owner.primary='rc_car';owner.angle=0;game.state.players.set(owner.id,owner);game.state.players.set(target.id,target);game.tacticalInventory(owner.id).rcCarMagazine=1;
    game.firePlayer(owner);expect([...game.state.thrownObjects.values()][0]).toMatchObject({kind:'rcCar',ownerId:'owner',hp:RC_CAR_BALANCE.maxHp});
    for(let index=0;index<200&&game.state.thrownObjects.size;index++)game.updateThrowables(.03);
    expect(game.state.thrownObjects.size).toBe(0);expect([...game.state.explosions.values()].at(-1)).toMatchObject({kind:'rcCar',weaponType:'rcCar',radius:RC_CAR_BALANCE.explosionRadius});
    expect(game.damage.mock.calls.some((call:any[])=>call[0]===target&&call[3]==='폭탄 RC카')).toBe(true);
  });

  it('can be shot and detonated before reaching its target',()=>{
    const game=room(),owner=player('owner',100,100),shooter=player('shooter',100,180);game.state.players.set(owner.id,owner);game.state.players.set(shooter.id,shooter);
    const car=new ThrownObjectState();car.id='rc-test';car.kind='rcCar';car.ownerId=owner.id;car.x=240;car.y=180;car.hp=8;car.detonateAt=99;game.state.thrownObjects.set(car.id,car);
    const bullet=new BulletState();bullet.id='bullet';bullet.owner=shooter.id;bullet.weaponId='rifle';bullet.x=180;bullet.y=180;bullet.prevX=180;bullet.prevY=180;bullet.vx=1200;bullet.vy=0;bullet.life=1;bullet.damage=17;bullet.radius=3;game.state.bullets.set(bullet.id,bullet);
    game.updateBullets(.08);expect(game.state.thrownObjects.has(car.id)).toBe(false);expect([...game.state.explosions.values()].at(-1)?.kind).toBe('rcCar');
  });
});
