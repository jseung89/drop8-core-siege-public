// DROP8_REFACTOR_017_ADHESIVE_STRIP_LOBBY_BAZOOKA_WATER
import { describe, expect, it } from 'vitest';
import { ADHESIVE_PLAYER_BALANCE, ADHESIVE_SPRAYER_BALANCE, STRIP_TRAP_VEHICLE_PROFILE, adhesivePlayerHoldSeconds, adhesivePlayerSpeedMultiplier, adhesivePlayerStage, aggregateVehicleSlowEffects, coneContains, normalizeAmmoType, type VehicleSlowEffect } from '../src/index.js';

function effect(kind:'adhesive'|'strip_trap',expiresAt:number):VehicleSlowEffect{
  const profile=kind==='adhesive'?ADHESIVE_SPRAYER_BALANCE.motorcycle:STRIP_TRAP_VEHICLE_PROFILE.motorcycle;
  return{kind,sourceId:kind,startedAt:0,expiresAt,maxExpiresAt:expiresAt,...profile};
}

describe('Refactor 017 adhesive and vehicle status rules',()=>{
  it('uses the strongest active multiplier instead of multiplying effects',()=>{
    const aggregate=aggregateVehicleSlowEffects([effect('adhesive',10),effect('strip_trap',8)],2);
    expect(aggregate.kind).toBe('mixed');
    expect(aggregate.speedMultiplier).toBe(.38);
    expect(aggregate.accelerationMultiplier).toBe(.28);
    expect(aggregate.steeringMultiplier).toBe(.60);
    expect(aggregate.speedMultiplier).toBeGreaterThanOrEqual(.30);
  });

  it('drops expired effects and restores exact neutral multipliers',()=>{
    expect(aggregateVehicleSlowEffects([effect('adhesive',1)],2)).toEqual({kind:'',speedMultiplier:1,accelerationMultiplier:1,steeringMultiplier:1,expiresAt:0});
  });


  it('builds three player slow stages and recovers gradually after spraying stops',()=>{
    expect(adhesivePlayerStage(.1)).toBe(1);
    expect(adhesivePlayerStage(.5)).toBe(2);
    expect(adhesivePlayerStage(1.1)).toBe(3);
    expect(adhesivePlayerHoldSeconds(3)).toBe(4.5);
    const active=adhesivePlayerSpeedMultiplier(3,4,5,8);
    const recovering=adhesivePlayerSpeedMultiplier(3,6.5,5,8);
    expect(active).toBe(ADHESIVE_PLAYER_BALANCE.stage3SpeedMultiplier);
    expect(recovering).toBeGreaterThan(active);
    expect(recovering).toBeLessThan(1);
    expect(adhesivePlayerSpeedMultiplier(3,8,5,8)).toBe(1);
  });

  it('normalizes adhesive charge aliases without changing existing ammunition mappings',()=>{
    expect(normalizeAmmoType('foam_charge')).toBe('adhesive_charge');
    expect(normalizeAmmoType('fuel')).toBe('fuel_ammo');
    expect(normalizeAmmoType('bazooka_ammo')).toBe('rocket_ammo');
  });

  it('uses a wider server-authoritative short-range cone',()=>{
    expect(coneContains(0,0,0,ADHESIVE_SPRAYER_BALANCE.range,ADHESIVE_SPRAYER_BALANCE.halfAngleRadians,250,40,20)).toBe(true);
    expect(coneContains(0,0,0,ADHESIVE_SPRAYER_BALANCE.range,ADHESIVE_SPRAYER_BALANCE.halfAngleRadians,400,0,20)).toBe(true);
    expect(coneContains(0,0,0,ADHESIVE_SPRAYER_BALANCE.range,ADHESIVE_SPRAYER_BALANCE.halfAngleRadians,460,0,20)).toBe(false);
  });
});
