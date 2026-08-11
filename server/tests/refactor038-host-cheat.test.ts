import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MAP_CONFIGS } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { PlayerState } from '../src/rooms/schema.js';

function roomAt(clock:{value:number}){
  const room=new Drop8Room() as any;
  room.now=()=>clock.value;
  room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=MAP_CONFIGS.small.width;room.state.phase='ACTIVE';
  return room;
}

function hostPlayer(id:string){const player=new PlayerState();player.id=id;player.name=id;player.host=true;player.alive=true;player.phase='landed';player.x=900;player.y=900;player.angle=0;return player;}

afterEach(()=>vi.unstubAllEnvs());

describe('Refactor 038 host robot part and special weapon cheat',()=>{
  it('spawns robot parts and every non-basic special weapon in front of the host, then replaces the previous set',()=>{
    vi.stubEnv('DROP8_TEST_CHEATS','1');
    const clock={value:10},room=roomAt(clock),host=hostPlayer('host'),send=vi.fn();room.state.players.set(host.id,host);
    room.spawnRobotPartsCheat({sessionId:host.id,send});
    const first=[...room.state.loot.values()];
    expect(first.map((loot:any)=>loot.kind).sort()).toEqual([
      'adhesive_sprayer','bazooka','boomerang','chicken_blaster','emp_exo_core','emp_exo_head','emp_exo_limbs','exo_core','exo_head','exo_limbs',
      'flamethrower','laser_cannon','railgun','rc_car','silver_bolt','silver_crossbow','stun_gun',
    ]);
    const specialWeapons=first.filter((loot:any)=>['stun_gun','chicken_blaster','railgun','laser_cannon','boomerang','rc_car','bazooka','flamethrower','adhesive_sprayer','silver_crossbow'].includes(loot.kind));
    expect(specialWeapons).toHaveLength(10);expect(specialWeapons.every((loot:any)=>loot.weaponMagazine>0&&loot.grantsAmmo)).toBe(true);
    expect(first.find((loot:any)=>loot.kind==='silver_bolt')?.ammoCount).toBe(10);
    expect(first.every((loot:any)=>loot.x>host.x)).toBe(true);
    const firstIds=first.map((loot:any)=>loot.id);clock.value+=3;
    room.spawnRobotPartsCheat({sessionId:host.id,send});
    expect(room.state.loot.size).toBe(17);expect(firstIds.every((id:string)=>!room.state.loot.has(id))).toBe(true);
    expect(send).toHaveBeenLastCalledWith('notice',expect.objectContaining({type:'success'}));
  });

  it('rejects non-hosts and keeps the cheat disabled unless the server opts in',()=>{
    const room=roomAt({value:10}),player=hostPlayer('guest'),send=vi.fn();player.host=false;room.state.players.set(player.id,player);
    room.spawnRobotPartsCheat({sessionId:player.id,send});expect(room.state.loot.size).toBe(0);
    vi.stubEnv('DROP8_TEST_CHEATS','1');room.spawnRobotPartsCheat({sessionId:player.id,send});expect(room.state.loot.size).toBe(0);
    expect(send).toHaveBeenLastCalledWith('notice',expect.objectContaining({message:'방장만 테스트 치트를 사용할 수 있습니다.'}));
  });
});

const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
describe('Refactor 038 client cheat key',()=>{
  it('routes F8 to the server-authoritative part spawn request',()=>{
    expect(scene).toContain('F3,F8');expect(scene).toContain("this.keys.F8.on('down'");expect(scene).toContain("this.net.send('spawnRobotPartsCheat')");
  });
});
