import { normalizeOpenArenaConfig } from '@drop8/shared';
import { describe,expect,it,vi } from 'vitest';
import {
  aiGoalContractSeconds,
  blockAiExecutiveGoal,
  createAiExecutiveMemory,
  detectAiDecisionOscillation,
  isAiExecutiveGoalBlocked,
  requestAiGoalTransition,
  summarizeAiExecutives,
} from '../src/rooms/aiExecutive.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';

describe('Refactor 045 AI executive brain',()=>{
  it('keeps a useful goal contract but allows a real emergency interrupt',()=>{
    const memory=createAiExecutiveMemory();
    expect(requestAiGoalTransition(memory,{currentKind:'none',currentKey:'',lockedUntil:0,nextKind:'loot',nextKey:'loot-a',now:0}).allowed).toBe(true);
    const distracted=requestAiGoalTransition(memory,{currentKind:'loot',currentKey:'loot-a',lockedUntil:4,nextKind:'sound',nextKey:'sound-a',now:1});
    const combat=requestAiGoalTransition(memory,{currentKind:'loot',currentKey:'loot-a',lockedUntil:4,nextKind:'combat',nextKey:'combat:enemy-a',now:1.1});
    expect(distracted).toEqual({allowed:false,reason:'contract'});
    expect(combat).toEqual({allowed:true,reason:'accepted'});
    expect(aiGoalContractSeconds('loot',1.8)).toBeGreaterThanOrEqual(3.4);
  });

  it('detects A-B-A-B decisions and temporarily blocks the repeated choice',()=>{
    const memory=createAiExecutiveMemory();
    expect(requestAiGoalTransition(memory,{currentKind:'none',currentKey:'',lockedUntil:0,nextKind:'loot',nextKey:'loot-a',now:0}).allowed).toBe(true);
    expect(requestAiGoalTransition(memory,{currentKind:'loot',currentKey:'loot-a',lockedUntil:0,nextKind:'loot',nextKey:'loot-b',now:3}).allowed).toBe(true);
    expect(requestAiGoalTransition(memory,{currentKind:'loot',currentKey:'loot-b',lockedUntil:0,nextKind:'loot',nextKey:'loot-a',now:6}).allowed).toBe(true);
    expect(detectAiDecisionOscillation(memory.recentGoals,'loot','loot-b',8)).toBe(true);
    expect(requestAiGoalTransition(memory,{currentKind:'loot',currentKey:'loot-a',lockedUntil:0,nextKind:'loot',nextKey:'loot-b',now:8})).toEqual({allowed:false,reason:'oscillation'});
    expect(isAiExecutiveGoalBlocked(memory,'loot','loot-b',8.1)).toBe(true);
    expect(memory.metrics.decisionOscillations).toBe(1);
  });

  it('remembers several failed goals while emergency behavior can override a block',()=>{
    const memory=createAiExecutiveMemory();
    blockAiExecutiveGoal(memory,'loot','loot-a',8,'failed');
    blockAiExecutiveGoal(memory,'loot','loot-b',9,'failed');
    expect(isAiExecutiveGoalBlocked(memory,'loot','loot-a',2)).toBe(true);
    expect(isAiExecutiveGoalBlocked(memory,'loot','loot-b',2)).toBe(true);
    const normal=requestAiGoalTransition(memory,{currentKind:'patrol',currentKey:'patrol-a',lockedUntil:0,nextKind:'loot',nextKey:'loot-a',now:2});
    const emergency=requestAiGoalTransition(memory,{currentKind:'patrol',currentKey:'patrol-a',lockedUntil:0,nextKind:'loot',nextKey:'loot-a',now:2.1,emergency:true,reason:'survival-item'});
    expect(normal.reason).toBe('blocked');
    expect(emergency.allowed).toBe(true);
  });

  it('stops the same decision loop for all 16 spectator AI and reports timing percentiles',()=>{
    const memories=Array.from({length:16},(_,index)=>{
      const memory=createAiExecutiveMemory();
      const a=`loot-${index}-a`,b=`loot-${index}-b`;
      requestAiGoalTransition(memory,{currentKind:'none',currentKey:'',lockedUntil:0,nextKind:'loot',nextKey:a,now:0});
      requestAiGoalTransition(memory,{currentKind:'loot',currentKey:a,lockedUntil:0,nextKind:'loot',nextKey:b,now:3});
      requestAiGoalTransition(memory,{currentKind:'loot',currentKey:b,lockedUntil:0,nextKind:'loot',nextKey:a,now:6});
      requestAiGoalTransition(memory,{currentKind:'loot',currentKey:a,lockedUntil:0,nextKind:'loot',nextKey:b,now:8});
      return memory;
    });
    const summary=summarizeAiExecutives(memories,[.8,1.1,1.4,2.2],8);
    expect(summary.agents).toBe(16);
    expect(summary.decisionOscillations).toBe(16);
    expect(summary.activeGoalBlocks).toBe(16);
    expect(summary.maxSwitchesPerAgent10s).toBeLessThanOrEqual(2);
    expect(summary.aiTickP95Ms).toBe(2.2);
  });

  it('keeps the committed room intent intact when a weak distraction is rejected',()=>{
    const room=new Drop8Room() as any;
    let now=0;
    room.now=()=>now;
    const intent=room.newAiIntent({x:100,y:100});
    expect(room.startAiGoal(intent,'loot','loot-a',1.8)).toBe(true);
    intent.progressSamples.push({x:100,y:100,goalDistance:200,at:0});
    now=1;
    expect(room.startAiGoal(intent,'sound','sound-a',1.1)).toBe(false);
    expect(intent.goalKey).toBe('loot-a');
    expect(intent.progressSamples).toHaveLength(1);
    expect(room.startAiGoal(intent,'combat','combat:enemy-a',1.15)).toBe(true);
    expect(intent.goalKey).toBe('combat:enemy-a');
    expect(intent.progressSamples).toHaveLength(0);
  });

  it('runs a 16-AI spectator simulation with bounded decision churn',()=>{
    const room=new Drop8Room() as any;
    let now=0;
    room.now=()=>now;
    room.gameMode='openArena';
    room.openArenaConfig=normalizeOpenArenaConfig(0,16,20);
    room.system=vi.fn();
    room.broadcast=vi.fn();
    room.damage=vi.fn();
    room.fillOpenArenaAi();
    room.beginOpenArena();
    for(let tick=0;tick<240;tick++){now+=.05;room.updateAi(.05);}
    const summary=room.aiBrainTelemetrySnapshot(now);
    expect(summary.agents).toBe(16);
    expect(summary.goalsStarted).toBeGreaterThan(0);
    expect(summary.maxSwitchesPerAgent10s).toBeLessThanOrEqual(8);
    expect(summary.aiTickP95Ms).toBeLessThan(100);
    expect([...room.aiIntent.values()].every((intent:any)=>intent.executive)).toBe(true);
  });
});
