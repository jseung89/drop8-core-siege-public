import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe,expect,it,vi } from 'vitest';
import { PVP_QUICK_START_CONFIG, QUICK_START_CONFIG, quickStartMatchKey } from '@drop8/shared';
import { quickStartRoomOptions, rankQuickStartRooms, type QuickStartRoom } from '../../client/src/quickStart.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';

function room(overrides:Partial<QuickStartRoom>={}):QuickStartRoom{
  return{
    roomId:'ROOM01',roomCode:'ROOM01',humans:1,maxHumans:4,configuredAiCount:12,
    gameMode:'openArena',matchFormat:'teams',mapSizeMode:'large',phase:'ACTIVE',publicRoom:true,locked:false,
    spectatorOnly:false,joinInProgress:true,lifecycle:'active',updatedAt:100,
    ...overrides,
  };
}

describe('Refactor 058 quick start matchmaking',()=>{
  it('builds the fixed 4-human and 12-AI contract on the selected map',()=>{
    expect(QUICK_START_CONFIG).toMatchObject({maxHumans:4,aiCount:12,killLimit:20,defaultMapId:'large'});
    expect(quickStartRoomOptions('Player','dock8')).toMatchObject({
      nickname:'Player',gameMode:'openArena',mapId:'dock8',mapSizeMode:'dock8',
      maxHumans:4,aiCount:12,killLimit:20,quickStart:true,
      quickMatchKey:'openArena:teams:dock8:4:12:20',
    });
    expect(quickStartMatchKey('large')).toBe('openArena:teams:large:4:12:20');
  });

  it('prefers an exact quick room and then the room with more humans',()=>{
    const ranked=rankQuickStartRooms([
      room({roomId:'MANUAL',roomCode:'MANUAL',maxHumans:8,configuredAiCount:8,humans:3,updatedAt:500}),
      room({roomId:'LOW',roomCode:'LOW',humans:1,updatedAt:400}),
      room({roomId:'HIGH',roomCode:'HIGH',humans:3,updatedAt:200}),
    ],'large');
    expect(ranked.map((candidate)=>candidate.roomId)).toEqual(['HIGH','LOW','MANUAL']);
  });

  it('builds and ranks a human-only PvP quick match separately from mixed arenas',()=>{
    expect(PVP_QUICK_START_CONFIG).toMatchObject({maxHumans:8,aiCount:0,killLimit:20});
    expect(quickStartRoomOptions('Player','large','pvp')).toMatchObject({
      gameMode:'openArena',maxHumans:8,aiCount:0,fillAi:false,killLimit:20,
      quickStart:true,quickStartPreset:'pvp',quickMatchKey:'openArena:solo:large:8:0:20',
    });
    const ranked=rankQuickStartRooms([
      room({roomId:'MIXED'}),
      room({roomId:'PVP-LOW',matchFormat:'solo',maxHumans:8,configuredAiCount:0,humans:1}),
      room({roomId:'PVP-HIGH',matchFormat:'solo',maxHumans:8,configuredAiCount:0,humans:5}),
    ],'large','pvp');
    expect(ranked.map((candidate)=>candidate.roomId)).toEqual(['PVP-HIGH','PVP-LOW']);
    expect(quickStartMatchKey('large','pvp')).toBe('openArena:solo:large:8:0:20');
  });

  it('ignores other maps and rooms that cannot accept immediate combat joins',()=>{
    const ranked=rankQuickStartRooms([
      room({roomId:'GOOD'}),
      room({roomId:'SMALL',mapSizeMode:'small'}),
      room({roomId:'FULL',humans:4}),
      room({roomId:'LOBBY',phase:'LOBBY',joinInProgress:false}),
      room({roomId:'ENDING',lifecycle:'emptyGrace'}),
      room({roomId:'VIEW',spectatorOnly:true,maxHumans:0,configuredAiCount:16}),
      room({roomId:'LOCKED',locked:true}),
    ],'large');
    expect(ranked.map((candidate)=>candidate.roomId)).toEqual(['GOOD']);
  });

  it('auto-starts a newly created quick arena as soon as its first human joins',async()=>{
    const game=new Drop8Room() as any;
    game.presence={get:vi.fn(async()=>undefined),setex:vi.fn(async()=>undefined)};
    game.setSimulationInterval=vi.fn();game.onMessage=vi.fn();game.syncRoomRegistry=vi.fn();
    await game.onCreate(quickStartRoomOptions('Player','large'));
    expect(game.quickStart).toBe(true);expect(game.quickMatchKey).toBe('openArena:teams:large:4:12:20');
    expect(game.maxClients).toBe(4);expect(game.state.mapId).toBe('large');
    game.fillOpenArenaAi=vi.fn();game.beginOpenArena=vi.fn();game.system=vi.fn();
    const send=vi.fn();game.onJoin({sessionId:'human-1',send} as any,{nickname:'Player'});
    expect(game.fillOpenArenaAi).toHaveBeenCalledOnce();expect(game.beginOpenArena).toHaveBeenCalledOnce();
    expect(game.state.players.get('human-1')).toMatchObject({host:true,ai:false});
  });

  it('auto-starts PvP quick rooms without filling AI seats',async()=>{
    const game=new Drop8Room() as any;
    game.presence={get:vi.fn(async()=>undefined),setex:vi.fn(async()=>undefined)};
    game.setSimulationInterval=vi.fn();game.onMessage=vi.fn();game.syncRoomRegistry=vi.fn();
    await game.onCreate(quickStartRoomOptions('Player','dock8','pvp'));
    expect(game.quickStart).toBe(true);expect(game.quickMatchKey).toBe('openArena:solo:dock8:8:0:20');
    expect(game.maxClients).toBe(8);expect(game.state.fillAi).toBe(false);
    game.fillOpenArenaAi=vi.fn();game.beginOpenArena=vi.fn();game.system=vi.fn();
    game.onJoin({sessionId:'human-1',send:vi.fn()} as any,{nickname:'Player'});
    expect(game.fillOpenArenaAi).toHaveBeenCalledOnce();expect(game.beginOpenArena).toHaveBeenCalledOnce();
    expect([...game.state.players.values()].filter((player:any)=>player.ai)).toHaveLength(0);
  });

  it('uses Colyseus atomic join-or-create matching sorted by occupied seats',()=>{
    const appSource=readFileSync(resolve(process.cwd(),'src/app.config.ts'),'utf8');
    const networkSource=readFileSync(resolve(process.cwd(),'../client/src/network.ts'),'utf8');
    expect(appSource).toContain(".filterBy(['quickMatchKey'])");
    expect(appSource).toContain('.sortBy({clients:-1})');
    expect(networkSource).toContain("this.client.joinOrCreate('drop8',options)");
  });
});
