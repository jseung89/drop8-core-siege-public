// DROP8_REFACTOR_048_AI_COMBAT_BRAIN
import { describe,expect,it,vi } from 'vitest';
import { MAP_CONFIGS } from '@drop8/shared';
import {
  AI_COMBAT_BRAIN,
  commitAiCombatPosture,
  commitAiCombatTarget,
  createAiCombatMemory,
  decideAiCombatPosture,
  isAiCombatTargetCommitted,
  recallAiCombatCover,
  rememberAiCombatCover,
  type AiCombatDecisionInput,
} from '../src/rooms/aiCombatBrain.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { PlayerState } from '../src/rooms/schema.js';

const baseDecision:AiCombatDecisionInput={hp:100,maxHp:100,armor:0,magazine:20,magazineSize:30,reserveAmmo:60,isReloading:false,hasLoadedAlternate:false,melee:false,distance:340,desiredRange:400,targetHp:100,targetThreat:70,recentlyDamaged:false,outnumberedBy:0,hasCover:false,aggression:.5,riskAvoidance:.5};

function makeRoom(clock:{value:number}){
  const room=new Drop8Room() as any,map={...MAP_CONFIGS.small,collisionObstacles:[],bulletObstacles:[],visibilityObstacles:[],buildingVisibilityZones:[],rooms:[],portals:[],rivers:[],landCrossings:[],shallowWaterZones:[],bushes:[],propObstacles:[],obstacles:[]};
  Object.defineProperty(room,'map',{value:map});room.now=()=>clock.value;room.state.phase='ACTIVE';room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=map.width;room.state.aliveCount=8;room.emitAudioEvent=vi.fn();room.emitAiDialogue=vi.fn();room.emitAiPersonaDialogue=vi.fn();room.broadcast=vi.fn();room.system=vi.fn();room.aiCanVisuallyAcquire=()=>true;room.canSeeTarget=()=>true;return room;
}

function ai(id:string,x=600,y=600){
  const p=new PlayerState();p.id=id;p.name=id;p.ai=true;p.alive=true;p.phase='landed';p.x=x;p.y=y;p.hp=100;p.angle=0;p.primary='rifle';p.secondary='pistol';p.equipped='rifle';p.rifleMagazine=20;p.pistolMagazine=8;p.standardAmmo=60;p.pistolAmmo=30;p.magazine=20;return p;
}

describe('Refactor 048 AI combat brain contracts',()=>{
  it('selects push, hold, kite, cover, reload and disengage from battlefield pressure',()=>{
    expect(decideAiCombatPosture({...baseDecision,distance:700},'none',false).posture).toBe('push');
    expect(decideAiCombatPosture(baseDecision,'none',false).posture).toBe('hold');
    expect(decideAiCombatPosture({...baseDecision,distance:120},'none',false).posture).toBe('kite');
    expect(decideAiCombatPosture({...baseDecision,hp:42,recentlyDamaged:true,targetThreat:110,hasCover:true},'none',false).posture).toBe('cover');
    expect(decideAiCombatPosture({...baseDecision,magazine:0,reserveAmmo:30},'none',false).posture).toBe('reload');
    expect(decideAiCombatPosture({...baseDecision,hp:18,recentlyDamaged:true},'none',false).posture).toBe('disengage');
  });

  it('keeps a useful posture contract but allows empty-magazine emergencies',()=>{
    expect(decideAiCombatPosture({...baseDecision,distance:620},'hold',true)).toEqual({posture:'hold',reason:'contract',lockSeconds:0});
    expect(decideAiCombatPosture({...baseDecision,magazine:0,reserveAmmo:20},'hold',true).posture).toBe('reload');
  });

  it('commits to one target and remembers one cover point for a bounded time',()=>{
    const memory=createAiCombatMemory();commitAiCombatTarget(memory,'target-a',10,3);
    expect(isAiCombatTargetCommitted(memory,'target-a',12.99)).toBe(true);expect(isAiCombatTargetCommitted(memory,'target-a',13)).toBe(false);
    commitAiCombatTarget(memory,'target-b',13,3);expect(memory.targetSwitchCount).toBe(1);
    rememberAiCombatCover(memory,'target-b',{x:400,y:500},13);expect(recallAiCombatCover(memory,'target-b',13.5)).toEqual({x:400,y:500});expect(recallAiCombatCover(memory,'target-b',13+AI_COMBAT_BRAIN.coverMemorySeconds)).toBeUndefined();
  });

  it('bounds posture churn for all 16 spectator combatants',()=>{
    const memories=Array.from({length:16},()=>createAiCombatMemory());
    for(let step=0;step<40;step++){
      const now=step*.2,distance=step%2===0?450:510;
      for(const memory of memories){const decision=decideAiCombatPosture({...baseDecision,distance},memory.posture,now<memory.postureUntil);commitAiCombatPosture(memory,'target',decision,now);}
    }
    expect(Math.max(...memories.map((memory)=>memory.postureSwitchCount))).toBeLessThanOrEqual(7);
  });
});

describe('Refactor 048 AI combat brain integration',()=>{
  it('keeps the committed visible target before accepting a much better target',()=>{
    const clock={value:10},room=makeRoom(clock),fighter=ai('fighter'),first=ai('target-a',850,600),better=ai('target-b',660,600);first.ai=false;better.ai=false;better.hp=10;
    room.state.players.set(fighter.id,fighter);room.state.players.set(first.id,first);const intent=room.newAiIntent(fighter);room.aiIntent.set(fighter.id,intent);
    expect(room.findVisibleTarget(fighter,intent)?.id).toBe(first.id);room.rememberAiTarget(fighter,first,intent);room.state.players.set(better.id,better);
    clock.value=11;expect(room.findVisibleTarget(fighter,intent)?.id).toBe(first.id);
    clock.value=14;expect(room.findVisibleTarget(fighter,intent)?.id).toBe(better.id);room.rememberAiTarget(fighter,better,intent);expect(room.aiCombatBrains.get(fighter.id).targetSwitchCount).toBe(1);
  });

  it('interrupts target commitment to retaliate against a recent attacker',()=>{
    const clock={value:10},room=makeRoom(clock),fighter=ai('retaliator'),first=ai('first-target',850,600),attacker=ai('recent-attacker',700,600);first.ai=false;attacker.ai=false;room.state.players.set(fighter.id,fighter);room.state.players.set(first.id,first);
    const intent=room.newAiIntent(fighter);room.aiIntent.set(fighter.id,intent);room.rememberAiTarget(fighter,first,intent);room.state.players.set(attacker.id,attacker);const memory=room.ensureAiMemory(fighter);memory.damagedById=attacker.id;memory.damagedAt=clock.value;
    clock.value+=.2;expect(room.findVisibleTarget(fighter,intent)?.id).toBe(attacker.id);
  });

  it('reuses the same cover route instead of changing direction every think',()=>{
    const clock={value:20},room=makeRoom(clock),fighter=ai('cover-fighter'),target=ai('cover-target',920,600);fighter.hp=42;target.ai=false;target.equipped='bazooka';room.state.players.set(fighter.id,fighter);room.state.players.set(target.id,target);
    const intent=room.newAiIntent(fighter);room.aiIntent.set(fighter.id,intent);const humanMemory=room.ensureAiMemory(fighter);humanMemory.damagedById=target.id;humanMemory.damagedAt=clock.value;const coverSearch=vi.fn().mockReturnValueOnce({x:470,y:760}).mockReturnValue({x:360,y:440});room.findAiCoverPoint=coverSearch;
    room.planAiCombatEngagement(fighter,intent,target,320);expect(fighter.aiState).toBe('TAKE_COVER');expect(intent.mode).toBe('move');expect(intent.routeGoalX).toBe(470);expect(intent.routeGoalY).toBe(760);
    clock.value+=.5;room.planAiCombatEngagement(fighter,intent,target,320);expect(coverSearch).toHaveBeenCalledTimes(1);expect(intent.routeGoalX).toBe(470);expect(intent.routeGoalY).toBe(760);expect(room.aiCombatBrains.get(fighter.id).coverSelectionCount).toBe(1);
  });

  it('reloads while following a remembered cover route',()=>{
    const clock={value:30},room=makeRoom(clock),fighter=ai('reload-fighter'),target=ai('reload-target',1120,600);target.ai=false;fighter.rifleMagazine=1;fighter.pistolMagazine=0;fighter.magazine=1;room.state.players.set(fighter.id,fighter);room.state.players.set(target.id,target);room.findAiCoverPoint=vi.fn(()=>({x:500,y:760}));
    const intent=room.newAiIntent(fighter);room.aiIntent.set(fighter.id,intent);room.planAiCombatEngagement(fighter,intent,target,520);
    expect(room.reloadUntil.has(fighter.id)).toBe(true);expect(fighter.aiState).toBe('RELOAD');expect(intent.mode).toBe('move');expect(intent.routeGoalX).toBe(500);expect(intent.routeGoalY).toBe(760);
  });

  it('switches an empty primary to a loaded sidearm under pressure',()=>{
    const clock={value:40},room=makeRoom(clock),fighter=ai('switch-fighter'),target=ai('switch-target',850,600);target.ai=false;fighter.rifleMagazine=0;fighter.pistolMagazine=8;fighter.magazine=0;room.state.players.set(fighter.id,fighter);room.state.players.set(target.id,target);
    const intent=room.newAiIntent(fighter);room.aiIntent.set(fighter.id,intent);const memory=room.ensureAiMemory(fighter);memory.damagedById=target.id;memory.damagedAt=clock.value;room.planAiCombatEngagement(fighter,intent,target,250);
    expect(fighter.equipped).toBe('pistol');expect(room.reloadUntil.has(fighter.id)).toBe(false);room.runAi(fighter,intent,.05);expect(fighter.equipped).toBe('pistol');
  });
});
