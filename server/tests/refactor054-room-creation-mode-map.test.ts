// DROP8_REFACTOR_054_ROOM_CREATION_MODE_MAP
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe,expect,it,vi } from 'vitest';
import { normalizeOpenArenaConfig } from '@drop8/shared';
import { resolveRoomCreation } from '../../client/src/roomCreation.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';

describe('Refactor 054 room creation mode and map',()=>{
  it('keeps playable arenas playable and clamps an old 16-AI spectator value',()=>{
    expect(resolveRoomCreation({gameMode:'openArena',participation:'play',maxHumans:8,aiCount:16,killLimit:20,mapId:'dock8'})).toEqual({gameMode:'openArena',participation:'play',maxHumans:8,aiCount:8,killLimit:20,mapId:'dock8',spectatorOnly:false,totalCombatants:16});
  });

  it('creates an explicit 0-human spectator arena on the selected large map',()=>{
    expect(resolveRoomCreation({gameMode:'openArena',participation:'spectate',maxHumans:8,aiCount:7,killLimit:30,mapId:'large'})).toEqual({gameMode:'openArena',participation:'spectate',maxHumans:0,aiCount:16,killLimit:30,mapId:'large',spectatorOnly:true,totalCombatants:16});
  });

  it('uses the dedicated map and team-sized defaults for core siege',()=>{
    expect(resolveRoomCreation({gameMode:'coreSiege',participation:'spectate',maxHumans:6,aiCount:4,killLimit:30,mapId:'large'})).toEqual({gameMode:'coreSiege',participation:'play',maxHumans:6,aiCount:4,killLimit:0,mapId:'coreSiege',spectatorOnly:false,totalCombatants:10});
  });

  it('adds a real player for playable open arena rooms',()=>{
    const room=new Drop8Room() as any;room.gameMode='openArena';room.openArenaConfig=normalizeOpenArenaConfig(8,8,20);room.state.phase='LOBBY';room.system=vi.fn();room.syncRoomRegistry=vi.fn();const send=vi.fn();
    room.onJoin({sessionId:'human-1',send} as any,{nickname:'플레이어'});
    expect(room.state.players.get('human-1')).toMatchObject({id:'human-1',name:'플레이어',ai:false,host:true});expect(room.arenaSpectators.size).toBe(0);expect(send).toHaveBeenCalledWith('roomConfig',expect.objectContaining({spectatorOnly:false,maxHumans:8}));
  });

  it('creates the selected mode directly and keeps lobby map settings available',()=>{
    const source=readFileSync(resolve(process.cwd(),'../client/src/main.ts'),'utf8');
    expect(source).toContain('mapSizeMode:selection.mapId');expect(source).toContain('mapId:selection.mapId');expect(source).toContain('gameMode:selection.gameMode');expect(source).toContain('mapId:$<HTMLSelectElement>(\'mapSizeMode\').value');
  });

  it('keeps the selected map while the server initializes an instant spectator room',async()=>{
    const room=new Drop8Room() as any;room.presence={get:vi.fn(async()=>undefined),setex:vi.fn(async()=>undefined)};room.setSimulationInterval=vi.fn();room.onMessage=vi.fn();room.syncRoomRegistry=vi.fn();
    await room.onCreate({gameMode:'openArena',maxHumans:0,aiCount:16,killLimit:20,mapId:'large',mapSizeMode:'large',publicRoom:true});
    expect(room.state.mapId).toBe('large');expect(room.state.mapSizeMode).toBe('large');expect(room.openArenaConfig).toMatchObject({spectatorOnly:true,maxHumans:0,configuredAiCount:16});
  });
});
