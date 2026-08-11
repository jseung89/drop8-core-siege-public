import { describe, expect, it } from 'vitest';
import { MAP_CONFIGS, TANK_BALANCE } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { MotorcycleState, PlayerState } from '../src/rooms/schema.js';

function roomAt(nowRef:{value:number}){const room=new Drop8Room() as any;room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=MAP_CONFIGS.small.width;room.now=()=>nowRef.value;return room;}
function player(id:string,x:number,y:number){const p=new PlayerState();p.id=id;p.alive=true;p.phase='landed';p.x=x;p.y=y;p.angle=0;p.buildingId='';return p;}

describe('Refactor 029 tank cannon',()=>{
  it('fires a tank cannon shell while driving and respects cooldown',()=>{
    const clock={value:10},room=roomAt(clock),driver=player('driver',1200,1200),tank=new MotorcycleState();
    tank.id='tank';tank.vehicleKind='tank';tank.x=1200;tank.y=1200;tank.hp=TANK_BALANCE.maxHp;tank.maxHp=TANK_BALANCE.maxHp;tank.tankShells=TANK_BALANCE.cannonShells;tank.driverId=driver.id;driver.isDriving=true;driver.vehicleId=tank.id;
    room.state.players.set(driver.id,driver);room.state.motorcycles.set(tank.id,tank);
    room.firePlayer(driver,{aimWorldX:1800,aimWorldY:1200});
    const shell=[...room.state.rockets.values()][0]!;
    expect(shell.weaponId).toBe('tank_cannon');
    expect(shell.ownerId).toBe(driver.id);
    expect(tank.turretAngle).toBeCloseTo(0);
    expect(tank.tankShells).toBe(TANK_BALANCE.cannonShells-1);
    room.firePlayer(driver,{aimWorldX:1800,aimWorldY:1200});
    expect(room.state.rockets.size).toBe(1);
    expect(tank.tankShells).toBe(TANK_BALANCE.cannonShells-1);
  });

  it('explodes with tank-cannon metadata and damages nearby players',()=>{
    const clock={value:10},room=roomAt(clock),driver=player('driver',1200,1200),target=player('target',1520,1200),tank=new MotorcycleState();
    tank.id='tank';tank.vehicleKind='tank';tank.x=1200;tank.y=1200;tank.tankShells=TANK_BALANCE.cannonShells;tank.driverId=driver.id;driver.isDriving=true;driver.vehicleId=tank.id;
    room.state.players.set(driver.id,driver);room.state.players.set(target.id,target);room.state.motorcycles.set(tank.id,tank);
    room.firePlayer(driver,{aimWorldX:1800,aimWorldY:1200});
    room.updateRockets(.33);
    expect(room.state.rockets.size).toBe(0);
    const explosion=[...room.state.explosions.values()][0]!;
    expect(explosion.weaponType).toBe('tank_cannon');
    expect(explosion.radius).toBe(172);
    expect(target.hp).toBeLessThan(100);
  });

  it('does not also punch while driving and cannot fire while trapped or EMP-disabled',()=>{
    const clock={value:10},room=roomAt(clock),driver=player('driver',1200,1200),target=player('target',1240,1200),tank=new MotorcycleState();
    tank.id='tank';tank.vehicleKind='tank';tank.x=1200;tank.y=1200;tank.tankShells=TANK_BALANCE.cannonShells;tank.driverId=driver.id;tank.slowKind='strip_trap';tank.slowUntil=20;driver.isDriving=true;driver.vehicleId=tank.id;driver.equipped='fists';
    room.state.players.set(driver.id,driver);room.state.players.set(target.id,target);room.state.motorcycles.set(tank.id,tank);
    room.meleePlayer(driver);
    expect(target.hp).toBe(100);
    room.firePlayer(driver,{aimWorldX:1800,aimWorldY:1200});
    expect(room.state.rockets.size).toBe(0);
    tank.slowKind='';tank.slowUntil=0;tank.empDisabledUntil=20;
    room.firePlayer(driver,{aimWorldX:1800,aimWorldY:1200});
    expect(room.state.rockets.size).toBe(0);
    expect(tank.tankShells).toBe(TANK_BALANCE.cannonShells);
  });

  it('has six non-refillable cannon shells and refuses a seventh shot',()=>{
    const clock={value:10},room=roomAt(clock),driver=player('driver',1200,1200),tank=new MotorcycleState();
    tank.id='tank';tank.vehicleKind='tank';tank.x=1200;tank.y=1200;tank.tankShells=TANK_BALANCE.cannonShells;tank.driverId=driver.id;driver.isDriving=true;driver.vehicleId=tank.id;
    room.state.players.set(driver.id,driver);room.state.motorcycles.set(tank.id,tank);
    for(let shot=0;shot<TANK_BALANCE.cannonShells;shot++){
      room.firePlayer(driver,{aimWorldX:1800,aimWorldY:1200});
      expect(room.state.rockets.size).toBe(1);
      room.state.rockets.clear();
      clock.value+=2;
    }
    expect(tank.tankShells).toBe(0);
    room.firePlayer(driver,{aimWorldX:1800,aimWorldY:1200});
    expect(room.state.rockets.size).toBe(0);
    expect(tank.tankShells).toBe(0);
  });
});
