import { describe, expect, it } from 'vitest';
import { EXO_PART_COPIES_PER_MAP, MAP_CONFIGS, TANK_BALANCE, type MapId } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';

const partKinds=['exo_head','exo_core','exo_limbs','emp_exo_head','emp_exo_core','emp_exo_limbs'] as const;

function roomFor(mapId:MapId){
  const room=new Drop8Room() as any;
  room.state.mapId=mapId;room.state.mapSizeMode=mapId;room.state.worldSize=MAP_CONFIGS[mapId].width;room.lootRandom=()=>.5;
  return room;
}

describe('Refactor 039 EMP and tank balance pass',()=>{
  it.each(['small','large','dock8'] as MapId[])('keeps exactly two of every robot part on %s',mapId=>{
    const room=roomFor(mapId);room.scatterExoParts('assault');room.scatterExoParts('emp');
    const kinds=[...room.state.loot.values()].map((loot:any)=>loot.kind);
    for(const kind of partKinds)expect(kinds.filter((value:string)=>value===kind),kind).toHaveLength(EXO_PART_COPIES_PER_MAP);
  });

  it('spawns a slower center tank with twenty cannon shells',()=>{
    const room=roomFor('small');room.spawnCenterTank();const tank=room.state.motorcycles.get('center-tank');
    expect(tank).toBeDefined();expect(tank.vehicleKind).toBe('tank');expect(tank.hp).toBe(TANK_BALANCE.maxHp);expect(tank.tankShells).toBe(TANK_BALANCE.cannonShells);
    expect(TANK_BALANCE.speedMultiplier).toBe(.36);expect(TANK_BALANCE.accelerationMultiplier).toBe(.42);expect(TANK_BALANCE.cannonShells).toBe(20);
  });
});
