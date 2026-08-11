import { describe, expect, it, vi } from 'vitest';
import { STUN_GUN_BALANCE } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { BulletState, MotorcycleState, PlayerState } from '../src/rooms/schema.js';

function mountedVehicle(room:any,kind:string,driver:PlayerState){
  const vehicle=new MotorcycleState();
  vehicle.id=`${kind}-stun-target`;vehicle.vehicleKind=kind;vehicle.x=2000;vehicle.y=2000;vehicle.driverId=driver.id;
  vehicle.velocityX=320;vehicle.velocityY=40;vehicle.speed=Math.hypot(vehicle.velocityX,vehicle.velocityY);vehicle.angularVelocity=.8;
  driver.x=vehicle.x;driver.y=vehicle.y;driver.isDriving=true;driver.vehicleId=vehicle.id;
  room.state.players.set(driver.id,driver);room.state.motorcycles.set(vehicle.id,vehicle);
  return vehicle;
}

describe('Refactor 042 stun gun vehicle eject',()=>{
  for(const kind of ['motorcycle','tank','fusion_robot'])it(`ejects and electrically locks a mounted ${kind}`,()=>{
    const room=new Drop8Room() as any,clock={value:10},driver=new PlayerState(),send=vi.fn();
    room.now=()=>clock.value;driver.id=`${kind}-driver`;driver.alive=true;driver.phase='landed';
    room.clients=[{sessionId:driver.id,send}];
    const vehicle=mountedVehicle(room,kind,driver);

    room.applyStunGunVehicleHit(vehicle,'attacker');

    expect(driver.isDriving).toBe(false);expect(driver.vehicleId).toBe('');
    expect(driver.werewolf.actionLockedUntil).toBe(clock.value+STUN_GUN_BALANCE.humanStunSeconds);
    expect(vehicle.driverId).toBe('');expect(vehicle.velocityX).toBe(0);expect(vehicle.velocityY).toBe(0);expect(vehicle.speed).toBe(0);
    expect(vehicle.empDisabledUntil).toBe(clock.value+STUN_GUN_BALANCE.vehicleDisableSeconds);
    expect(vehicle.mountLockedUntil).toBe(clock.value+STUN_GUN_BALANCE.vehicleMountLockSeconds);
    expect(send).toHaveBeenCalledWith('notice',expect.objectContaining({message:expect.stringContaining('강제 하차')}));

    driver.x=vehicle.x+40;driver.y=vehicle.y;driver.werewolf.actionLockedUntil=0;
    expect(room.mountMotorcycle(driver,vehicle,{send})).toBe(false);
    expect(send).toHaveBeenCalledWith('notice',expect.objectContaining({message:expect.stringContaining('전기 잠금')}));
    clock.value=vehicle.mountLockedUntil+.01;
    if(kind==='tank')room.tacticalInventory(driver.id).tankKeyCount=1;
    expect(room.mountMotorcycle(driver,vehicle,{send})).toBe(true);
  });

  it('locks an empty vehicle without inventing a driver',()=>{
    const room=new Drop8Room() as any,vehicle=new MotorcycleState();
    room.now=()=>5;vehicle.id='empty-bike';vehicle.vehicleKind='motorcycle';vehicle.x=1200;vehicle.y=1200;room.state.motorcycles.set(vehicle.id,vehicle);
    room.applyStunGunVehicleHit(vehicle,'attacker');
    expect(vehicle.driverId).toBe('');expect(vehicle.mountLockedUntil).toBe(5+STUN_GUN_BALANCE.vehicleMountLockSeconds);expect(vehicle.empDisabledUntil).toBe(5+STUN_GUN_BALANCE.vehicleDisableSeconds);
  });

  it('routes a stun projectile that hits the vehicle body through the eject rule',()=>{
    const room=new Drop8Room() as any,driver=new PlayerState(),audio=vi.fn();
    room.now=()=>8;room.firstObstacleHitT=()=>null;room.emitAudioEvent=audio;driver.id='bullet-driver';driver.alive=true;driver.phase='landed';
    const vehicle=mountedVehicle(room,'tank',driver),bullet=new BulletState();
    bullet.id='stun-vehicle-bullet';bullet.owner='attacker';bullet.weaponId='stun_gun';bullet.x=1900;bullet.y=2000;bullet.prevX=bullet.x;bullet.prevY=bullet.y;bullet.vx=1000;bullet.vy=0;bullet.life=1;bullet.damage=3;bullet.radius=4.8;
    room.state.bullets.set(bullet.id,bullet);

    room.updateBullets(.2);

    expect(room.state.bullets.has(bullet.id)).toBe(false);expect(driver.isDriving).toBe(false);expect(vehicle.driverId).toBe('');expect(vehicle.mountLockedUntil).toBe(8+STUN_GUN_BALANCE.vehicleMountLockSeconds);
    expect(audio).toHaveBeenCalledWith('hit_confirm',expect.objectContaining({targetId:vehicle.id}),undefined);
  });
});
