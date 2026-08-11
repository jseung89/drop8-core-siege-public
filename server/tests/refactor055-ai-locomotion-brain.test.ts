// DROP8_REFACTOR_055_AI_LOCOMOTION_UTILITY_BRAIN
import { describe,expect,it,vi } from 'vitest';
import { createSeededRandom,MAP_CONFIGS,normalizeOpenArenaConfig } from '@drop8/shared';
import {
  aiLocomotionEfficiency,
  aiLocomotionSummary,
  aiMovementReversalPenalty,
  chooseAiMovement,
  createAiLocomotionMemory,
  recordAiLocomotionPosition,
  type AiMovementCandidate,
} from '../src/rooms/aiLocomotionBrain.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { LootState,PlayerState } from '../src/rooms/schema.js';

const forward:AiMovementCandidate={key:'forward',directionX:1,directionY:0};
const reverse:AiMovementCandidate={key:'reverse',directionX:-1,directionY:0};

function room(clock:{value:number}){
  const instance=new Drop8Room() as any,map={...MAP_CONFIGS.small,collisionObstacles:[],bulletObstacles:[],visibilityObstacles:[],buildingVisibilityZones:[],rooms:[],portals:[],rivers:[],landCrossings:[],shoreExits:[],shallowWaterZones:[],bushes:[],propObstacles:[],obstacles:[]};
  Object.defineProperty(instance,'map',{value:map});instance.now=()=>clock.value;instance.state.phase='ACTIVE';instance.state.mapId='small';instance.state.mapSizeMode='small';instance.state.worldSize=map.width;instance.state.difficulty='normal';instance.broadcast=vi.fn();instance.system=vi.fn();return instance;
}

function ai(id:string,x=600,y=600){
  const player=new PlayerState();player.id=id;player.name=id;player.ai=true;player.alive=true;player.phase='landed';player.x=x;player.y=y;player.hp=100;player.angle=0;player.primary='rifle';player.secondary='pistol';player.equipped='rifle';player.rifleMagazine=20;player.standardAmmo=60;player.magazine=20;return player;
}

describe('Refactor 055 AI locomotion utility contracts',()=>{
  it('measures A-B-A-B travel as inefficient movement',()=>{
    const memory=createAiLocomotionMemory(1,0),points=[0,48,0,48,0];
    points.forEach((x,index)=>recordAiLocomotionPosition(memory,x,0,index*.13));
    expect(aiLocomotionEfficiency(memory,.52)).toBeLessThan(.1);
    expect(aiMovementReversalPenalty(memory,reverse,.52)).toBeGreaterThan(30);
  });

  it('keeps the current lane when another lane is only slightly better',()=>{
    const memory=createAiLocomotionMemory(1,0),laneA={key:'lane-a',directionX:1,directionY:0,baseBias:5},laneB={key:'lane-b',directionX:.8,directionY:.6,baseBias:4};
    expect(chooseAiMovement(memory,[laneA,laneB],{context:'route',now:0})?.key).toBe('lane-a');
    expect(chooseAiMovement(memory,[{...laneA,baseBias:0},{...laneB,baseBias:7}],{context:'route',now:.2})?.key).toBe('lane-a');
    expect(memory.totalSwitches).toBe(0);
  });

  it('allows a justified turn when danger avoidance clearly beats hysteresis',()=>{
    const memory=createAiLocomotionMemory(1,0);chooseAiMovement(memory,[forward],{context:'route',now:0});
    const decision=chooseAiMovement(memory,[{...forward,dangerAvoidance:-8},{...reverse,dangerAvoidance:24}],{context:'route',now:.2});
    expect(decision?.key).toBe('reverse');expect(decision?.switched).toBe(true);expect(memory.totalReversals).toBe(1);
  });

  it('lets emergency escape bypass the normal switch margin',()=>{
    const memory=createAiLocomotionMemory(1,0);chooseAiMovement(memory,[forward],{context:'route',now:0});
    const normal=chooseAiMovement(memory,[forward,{...reverse,baseBias:9}],{context:'route',now:.2});expect(normal?.key).toBe('forward');
    const emergency=chooseAiMovement(memory,[forward,{...reverse,baseBias:9}],{context:'route',now:.3,emergency:true,urgency:1});expect(emergency?.key).toBe('reverse');
  });

  it('raises the cost of repeated emergency reversals without blocking the first escape',()=>{
    const memory=createAiLocomotionMemory(1,0);chooseAiMovement(memory,[forward],{context:'route',now:0});
    for(let step=1;step<=8;step++){
      const preferred=step%2===1?reverse:forward,current=step%2===1?forward:reverse;
      chooseAiMovement(memory,[{...current,baseBias:0},{...preferred,baseBias:20}],{context:'route',now:step*.2,emergency:true,urgency:1});
    }
    expect(memory.totalReversals).toBeGreaterThan(0);
    expect(memory.totalReversals).toBeLessThanOrEqual(2);
  });

  it('bounds direction churn across all 16 AI brains under noisy scores',()=>{
    const memories=Array.from({length:16},()=>createAiLocomotionMemory(1,0));
    for(let step=0;step<80;step++)for(const memory of memories){
      const noise=step%2===0?7:-7;
      chooseAiMovement(memory,[{...forward,baseBias:noise},{...reverse,baseBias:-noise}],{context:'combat',now:step*.05,urgency:.35});
    }
    expect(Math.max(...memories.map((memory)=>memory.totalReversals))).toBeLessThanOrEqual(1);
    expect(aiLocomotionSummary(memories,4).agents).toBe(16);
  });
});

describe('Refactor 055 AI locomotion integration',()=>{
  it('holds one useful combat strafe instead of flipping on a timer',()=>{
    const clock={value:10},instance=room(clock),fighter=ai('stable-fighter'),target=ai('target',1010,600);target.ai=false;
    instance.state.players.set(fighter.id,fighter);instance.state.players.set(target.id,target);
    const intent=instance.newAiIntent(fighter);intent.targetId=target.id;intent.mode='hold';intent.combatHoldStartedAt=9;instance.aiIntent.set(fighter.id,intent);instance.ensureAiMemory(fighter).targetVisible=true;
    const start={x:fighter.x,y:fighter.y};
    for(let tick=0;tick<50;tick++){clock.value+=.1;instance.runAiCombatHold(fighter,intent,target,.1);instance.ensureAiMemory(fighter).targetVisible=true;}
    const locomotion=instance.aiLocomotionBrains.get(fighter.id);
    expect(Math.hypot(fighter.x-start.x,fighter.y-start.y)).toBeGreaterThan(35);
    expect(locomotion.totalReversals).toBeLessThanOrEqual(1);
    expect(locomotion.totalSwitches).toBeLessThanOrEqual(3);
  });

  it('abandons a repeatedly unreachable low-priority goal and reassesses',()=>{
    const clock={value:20},instance=room(clock),fighter=ai('stuck-looter'),loot=new LootState();loot.id='blocked-loot';loot.kind='rifle';loot.x=920;loot.y=600;instance.state.players.set(fighter.id,fighter);instance.state.loot.set(loot.id,loot);
    const intent=instance.newAiIntent(fighter);intent.goalKind='loot';intent.goalKey=loot.id;intent.lootId=loot.id;intent.mode='move';intent.tx=loot.x;intent.ty=loot.y;intent.routeGoalX=loot.x;intent.routeGoalY=loot.y;intent.route=[{x:loot.x,y:loot.y}];intent.stuckFor=2;intent.stuckCount=1;instance.aiIntent.set(fighter.id,intent);instance.lootReservations.set(loot.id,{aiId:fighter.id,expiresAt:30,lastDistance:320});instance.moveAiWithAvoidance=vi.fn(()=>true);
    instance.runAi(fighter,intent,.1);
    expect(intent.goalKind).toBe('none');expect(intent.failedGoalKey).toBe(loot.id);expect(intent.lootId).toBe('');expect(intent.route).toHaveLength(0);expect(fighter.aiState).toBe('REASSESS');expect(instance.lootReservations.has(loot.id)).toBe(false);
  });

  it('runs all 16 spectator AI with bounded reversals and brain cost',()=>{
    const random=vi.spyOn(Math,'random').mockImplementation(createSeededRandom(0x55a1c0de));
    const date=vi.spyOn(Date,'now').mockReturnValue(1_750_000_000_000);
    try{
      const instance=new Drop8Room() as any;let now=0;instance.now=()=>now;instance.gameMode='openArena';instance.openArenaConfig=normalizeOpenArenaConfig(0,16,20);instance.system=vi.fn();instance.broadcast=vi.fn();instance.fillOpenArenaAi();instance.beginOpenArena();
      for(let tick=0;tick<360;tick++){now+=.05;instance.updateAi(.05);}
      const telemetry=instance.aiBrainTelemetrySnapshot(now),locomotion=telemetry.locomotion;
      expect(locomotion.agents).toBeGreaterThanOrEqual(14);
      expect(locomotion.averageEfficiency).toBeGreaterThan(.2);
      expect(locomotion.inefficientAgents).toBeLessThanOrEqual(8);
      expect(locomotion.oscillatingAgents).toBeLessThanOrEqual(2);
      expect(locomotion.totalSwitches).toBeLessThanOrEqual(300);
      expect(locomotion.totalReversals).toBeLessThanOrEqual(160);
      expect(locomotion.maxSwitchesPerAgent).toBeLessThanOrEqual(40);
      expect(locomotion.maxReversalsPerAgent).toBeLessThanOrEqual(24);
      expect(locomotion.maxRecentReversalsPerAgent).toBeLessThanOrEqual(2);
      expect(telemetry.aiTickP95Ms).toBeLessThan(100);
    }finally{
      random.mockRestore();date.mockRestore();
    }
  });
});
