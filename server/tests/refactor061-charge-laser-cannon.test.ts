import { describe,expect,it,vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { LASER_CANNON_BALANCE,LOOT_LABELS,MAP_CONFIGS,WEAPONS } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { PlayerState } from '../src/rooms/schema.js';

const room=readFileSync(fileURLToPath(new URL('../src/rooms/Drop8Room.ts',import.meta.url)),'utf8');
const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
const network=readFileSync(fileURLToPath(new URL('../../client/src/network.ts',import.meta.url)),'utf8');
const audio=readFileSync(fileURLToPath(new URL('../../client/src/audio/synthSounds.ts',import.meta.url)),'utf8');

describe('Refactor 061 charge laser cannon',()=>{
  it('defines a strong human-focused tap and charged fire profile',()=>{
    expect(WEAPONS.laser_cannon).toMatchObject({name:'충전형 레이저포',damage:30,fireInterval:.32,magazine:12,projectileSpeed:1650,range:1100,ammoType:'laser_cell'});
    expect(LASER_CANNON_BALANCE).toMatchObject({chargeSeconds:1.2,chargedPlayerDamage:155,chargedVehicleDamage:60,chargedAmmoCost:3,guideRange:WEAPONS.sniper.range,maxPenetrationTargets:4,penetrationDamageMultiplier:.82,pulseSpeed:6400,pulseLength:260,pulseGlowWidth:34,pulseCoreWidth:12});
    expect(LOOT_LABELS.laser_cell).toBe('레이저 셀');
  });

  it('keeps charge timing, wall stop, target selection and damage server authoritative',()=>{
    expect(room).toContain("this.onMessage('laserCannonChargeStart'");expect(room).toContain("this.onMessage('laserCannonChargeRelease'");expect(room).toContain("this.onMessage('laserCannonChargeCancel'");
    expect(room).toContain('held<LASER_CANNON_BALANCE.chargeSeconds');expect(room).toContain('this.firstObstacleHitT(startX,startY,rangeX,rangeY,3)');expect(room).toContain('LASER_CANNON_BALANCE.maxPenetrationTargets');expect(room).toContain('LASER_CANNON_BALANCE.penetrationDamageMultiplier');expect(room).toContain("this.setWeaponMagazine(p,'laser_cannon',magazine-LASER_CANNON_BALANCE.chargedAmmoCost)");
  });

  it('fires a normal projectile on a short click and a beam only after full charge',()=>{
    expect(room).toContain('this.firePlayer(p,m);return true');expect(room).toContain("this.broadcast('laserCannonShot'");expect(room).toContain("variant:'laser_cannon_charged'");
  });

  it('shows a sniper-range wall-aware guide and charged muzzle effect',()=>{
    expect(scene).toContain('LASER_CANNON_BALANCE.guideRange');expect(scene).toContain('player.laserCannonCharging');expect(scene).toContain('segmentRectIntersectionT(sx,sy,rx,ry,rect,2)');expect(scene).toContain("if(type==='laserCannonShot')");
  });

  it('animates a thick charged laser pulse from muzzle to impact instead of flashing a full hitscan line',()=>{
    expect(room).toContain('travelSeconds=Math.max(.16,visualDistance/LASER_CANNON_BALANCE.pulseSpeed)');expect(room).toContain('travelSeconds,impacts});return true');
    expect(network).toContain("'exoLaser','laserCannonShot','arenaStatus'");expect(scene).toContain('elapsed/beam.travelMs');expect(scene).toContain('LASER_CANNON_BALANCE.pulseLength/len');expect(scene).toContain('pulseGlowWidth');expect(scene).toContain('pulseCoreWidth');
  });

  it('damages multiple aligned targets in order but stops at the first wall',()=>{
    const game=new Drop8Room() as any;game.gameMode='openArena';game.openArenaRoundState='active';game.state.phase='ACTIVE';game.state.mapId='small';game.state.worldSize=MAP_CONFIGS.small.width;game.now=()=>2;game.firstObstacleHitT=vi.fn(()=>.72);game.damage=vi.fn();game.damageMotorcycle=vi.fn();game.emitAudioEvent=vi.fn();game.broadcast=vi.fn();
    const makePlayer=(id:string,x:number)=>{const player=new PlayerState();player.id=id;player.name=id;player.alive=true;player.phase='landed';player.x=x;player.y=100;return player;};
    const shooter=makePlayer('shooter',100),front=makePlayer('front',320),rear=makePlayer('rear',540),behindWall=makePlayer('behind-wall',100+LASER_CANNON_BALANCE.guideRange*.9);shooter.equipped='laser_cannon';game.state.players.set(shooter.id,shooter);game.state.players.set(front.id,front);game.state.players.set(rear.id,rear);game.state.players.set(behindWall.id,behindWall);
    const tactical=game.tacticalInventory(shooter.id);tactical.laserCannonMagazine=12;tactical.laserCannonCharging=true;tactical.laserCannonChargeStartedAt=0;
    expect(game.releaseLaserCannonCharge(shooter,{aimWorldX:1400,aimWorldY:100})).toBe(true);expect(game.damage).toHaveBeenCalledTimes(2);
    expect(game.damage.mock.calls[0][0]).toBe(front);expect(game.damage.mock.calls[0][1]).toBeCloseTo(LASER_CANNON_BALANCE.chargedPlayerDamage);
    expect(game.damage.mock.calls[1][0]).toBe(rear);expect(game.damage.mock.calls[1][1]).toBeCloseTo(LASER_CANNON_BALANCE.chargedPlayerDamage*LASER_CANNON_BALANCE.penetrationDamageMultiplier);
    expect(game.damage.mock.calls.some((call:any[])=>call[0]===behindWall)).toBe(false);expect(game.broadcast).toHaveBeenCalledWith('laserCannonShot',expect.objectContaining({impacts:expect.arrayContaining([expect.objectContaining({x:expect.any(Number),y:expect.any(Number)})])}));
  });

  it('provides distinct charge hum, tap projectile and charged blast sounds',()=>{
    expect(audio).toContain("case'laser_charge'");expect(audio).toContain("case'weapon_laser_cannon_fire'");expect(audio).toContain("case'weapon_laser_cannon_charged'");expect(scene).toContain("type==='laser_charge'");expect(scene).toContain('for(const impact of beam.impacts)');
  });
});
