import { describe,expect,it,vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { normalizeGameMode,normalizeOpenArenaConfig,OPEN_ARENA_LIMITS } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { aiCombatTargetScore,shouldSwitchAiTarget } from '../src/rooms/aiHumanization.js';
import { aiDialogueAudience } from '../src/rooms/aiNavigation.js';
import { shouldFinishOpenArenaRound,sortOpenArenaRows,type ArenaScoreRow } from '../src/rooms/openArenaRound.js';

const roomSource=readFileSync(resolve(process.cwd(),'src/rooms/Drop8Room.ts'),'utf8');
const networkSource=readFileSync(resolve(process.cwd(),'../client/src/network.ts'),'utf8');

const scoreInput={
  distance:300,
  targetHp:100,
  targetThreat:50,
  focusCount:0,
  currentTarget:false,
  recentAttacker:false,
  targetInVehicle:false,
  targetMechanical:false,
};

const scoreRow=(overrides:Partial<ArenaScoreRow>={}):ArenaScoreRow=>({
  id:'ai-1',name:'AI-준희커',ai:true,kills:0,deaths:0,kd:0,streak:0,bestStreak:0,
  humanKills:0,aiKills:0,damageDone:0,alive:true,reachedAt:0,...overrides,
});

describe('Refactor 044 shared AI spectator arena',()=>{
  it('removes zombie defense and accepts a 0-human, 16-AI arena',()=>{
    expect(normalizeGameMode('zombieDefense')).toBe('battleRoyale');
    expect(normalizeOpenArenaConfig(0,16,20)).toEqual({
      maxHumans:0,
      configuredAiCount:16,
      maxTotalCombatants:16,
      killLimit:20,
      spectatorOnly:true,
    });
    expect(OPEN_ARENA_LIMITS.maxAi).toBe(16);
    expect(()=>normalizeOpenArenaConfig(0,0,20)).toThrow(/AI가 1명 이상/);
  });

  it('lets AI win spectator rounds while preserving human-only arena rules',()=>{
    const winner=scoreRow({kills:20});
    expect(shouldFinishOpenArenaRound(20,winner)).toBe(false);
    expect(shouldFinishOpenArenaRound(20,winner,true)).toBe(true);
    expect(sortOpenArenaRows([scoreRow({id:'low',kills:2}),scoreRow({id:'high',kills:6})],true).map((row)=>row.id)).toEqual(['high','low']);
  });

  it('retaliates against attackers, spreads focus and keeps stable targets',()=>{
    const baseline=aiCombatTargetScore(scoreInput);
    const attacker=aiCombatTargetScore({...scoreInput,recentAttacker:true});
    const crowded=aiCombatTargetScore({...scoreInput,focusCount:4});
    expect(attacker).toBeGreaterThan(baseline);
    expect(crowded).toBeLessThan(baseline);
    expect(shouldSwitchAiTarget(100,150,true)).toBe(false);
    expect(shouldSwitchAiTarget(100,121,false)).toBe(false);
    expect(shouldSwitchAiTarget(100,122,false)).toBe(true);
  });

  it('treats a characterless arena viewer as a full spectator audience',()=>{
    expect(aiDialogueAudience(undefined,Number.POSITIVE_INFINITY,450,true)).toBe('spectator');
    expect(aiDialogueAudience(undefined,10,450)).toBe('none');
  });

  it('joins a spectator without creating a combat player',()=>{
    const room=new Drop8Room() as any;
    room.gameMode='openArena';
    room.openArenaConfig=normalizeOpenArenaConfig(0,16,20);
    room.state.phase='ACTIVE';
    room.system=vi.fn();
    room.syncRoomRegistry=vi.fn();
    const send=vi.fn();
    room.onJoin({sessionId:'viewer-1',send} as any,{nickname:'감독'});
    expect(room.state.players.size).toBe(0);
    expect(room.arenaSpectators.get('viewer-1')?.name).toBe('감독');
    expect(send).toHaveBeenCalledWith('roomConfig',expect.objectContaining({spectatorOnly:true,configuredAiCount:16}));
    expect(send).toHaveBeenCalledWith('arenaStatus',expect.objectContaining({spectators:1,spectatorOnly:true}));
  });

  it('supports an explicit post-join config refresh after client listeners attach',()=>{
    expect(roomSource).toContain("this.onMessage('requestRoomConfig'");
    expect(networkSource).toContain("this.room.send('requestRoomConfig')");
  });

  it('creates and initializes all 16 AI combatants without a human host',()=>{
    const room=new Drop8Room() as any;
    room.gameMode='openArena';
    room.openArenaConfig=normalizeOpenArenaConfig(0,16,20);
    room.system=vi.fn();
    room.broadcast=vi.fn();
    room.fillOpenArenaAi();
    expect(room.state.players.size).toBe(16);
    expect([...room.state.players.values()].every((player:any)=>player.ai)).toBe(true);
    expect(room.openArenaAiSlots.size).toBe(16);
    room.beginOpenArena();
    const players=[...room.state.players.values()] as any[];
    expect(room.state.phase).toBe('ACTIVE');
    expect(players.every((player)=>player.alive&&player.phase==='landed')).toBe(true);
    expect(room.aiIntent.size).toBe(16);
    expect(room.aiProfiles.size).toBe(16);
    expect(room.aiMemories.size).toBe(16);
  });
});
