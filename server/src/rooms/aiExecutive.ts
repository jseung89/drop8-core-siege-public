import { aiGoalPriority, type AiGoalKind } from './aiNavigation.js';

export type AiGoalBlockReason='failed'|'oscillation';
export type AiGoalOutcome='completed'|'failed'|'invalid'|'interrupted';
export type AiGoalTransition={kind:AiGoalKind;key:string;at:number};
export type AiGoalBlock={kind:AiGoalKind;key:string;until:number;reason:AiGoalBlockReason};

export type AiExecutiveMetrics={
  goalsStarted:number;
  goalSwitches:number;
  rejectedSwitches:number;
  decisionOscillations:number;
  emergencyInterrupts:number;
  completedGoals:number;
  failedGoals:number;
};

export type AiExecutiveMemory={
  goalStartedAt:number;
  recentGoals:AiGoalTransition[];
  recentSwitches:number[];
  blockedGoals:AiGoalBlock[];
  lastDecisionReason:string;
  lastOutcome:AiGoalOutcome|'';
  metrics:AiExecutiveMetrics;
};

export type AiGoalTransitionRequest={
  currentKind:AiGoalKind;
  currentKey:string;
  lockedUntil:number;
  nextKind:AiGoalKind;
  nextKey:string;
  now:number;
  force?:boolean;
  emergency?:boolean;
  reason?:string;
};

export type AiGoalTransitionDecision={allowed:boolean;reason:'same-goal'|'accepted'|'contract'|'blocked'|'oscillation'};

export const AI_EXECUTIVE_BRAIN={
  historySeconds:10,
  maxRecentGoals:16,
  oscillationCooldownSeconds:7,
  interruptPriorityMargin:16,
  failedGoalCooldownSeconds:4.8,
  currentLootBonus:18,
  lockedLootBonus:42,
  telemetryWindowSeconds:10,
  goalContractSeconds:{
    none:0,
    patrol:3,
    loot:3.4,
    sound:1.6,
    objective:4.5,
    search:1.8,
    combat:1.5,
    heal:2.5,
    escape:1.8,
    zone:2.2,
    'swim-exit':2.4,
    hazard:.8,
  } satisfies Record<AiGoalKind,number>,
} as const;

function goalToken(kind:AiGoalKind,key:string){return `${kind}|${key}`;}

export function createAiExecutiveMemory(now=0):AiExecutiveMemory{
  return{
    goalStartedAt:now,
    recentGoals:[],
    recentSwitches:[],
    blockedGoals:[],
    lastDecisionReason:'spawn',
    lastOutcome:'',
    metrics:{goalsStarted:0,goalSwitches:0,rejectedSwitches:0,decisionOscillations:0,emergencyInterrupts:0,completedGoals:0,failedGoals:0},
  };
}

export function pruneAiExecutiveMemory(memory:AiExecutiveMemory,now:number){
  memory.recentSwitches=(memory.recentSwitches??[]).filter((at)=>now-at<=AI_EXECUTIVE_BRAIN.telemetryWindowSeconds);
  memory.recentGoals=memory.recentGoals.filter((goal)=>now-goal.at<=AI_EXECUTIVE_BRAIN.historySeconds).slice(-AI_EXECUTIVE_BRAIN.maxRecentGoals);
  memory.blockedGoals=memory.blockedGoals.filter((goal)=>goal.until>now);
}

export function aiGoalContractSeconds(kind:AiGoalKind,requestedSeconds=0){
  return Math.max(requestedSeconds,AI_EXECUTIVE_BRAIN.goalContractSeconds[kind]);
}

export function aiGoalFailureCooldownSeconds(kind:AiGoalKind,requestedSeconds=0){
  const minimum=kind==='combat'?3.2:AI_EXECUTIVE_BRAIN.failedGoalCooldownSeconds;
  return Math.max(requestedSeconds,minimum);
}

export function blockAiExecutiveGoal(memory:AiExecutiveMemory,kind:AiGoalKind,key:string,until:number,reason:AiGoalBlockReason){
  const existing=memory.blockedGoals.find((goal)=>goal.kind===kind&&goal.key===key);
  if(existing){existing.until=Math.max(existing.until,until);existing.reason=reason;return;}
  memory.blockedGoals.push({kind,key,until,reason});
}

export function isAiExecutiveGoalBlocked(memory:AiExecutiveMemory,kind:AiGoalKind,key:string,now:number){
  pruneAiExecutiveMemory(memory,now);
  return memory.blockedGoals.some((goal)=>goal.kind===kind&&goal.key===key&&goal.until>now);
}

export function detectAiDecisionOscillation(history:readonly AiGoalTransition[],nextKind:AiGoalKind,nextKey:string,now:number){
  const recent=history.filter((goal)=>now-goal.at<=AI_EXECUTIVE_BRAIN.historySeconds).slice(-3);
  if(recent.length<3)return false;
  const sequence=[...recent.map((goal)=>goalToken(goal.kind,goal.key)),goalToken(nextKind,nextKey)];
  return sequence[0]===sequence[2]&&sequence[1]===sequence[3]&&sequence[0]!==sequence[1];
}

export function requestAiGoalTransition(memory:AiExecutiveMemory,request:AiGoalTransitionRequest):AiGoalTransitionDecision{
  pruneAiExecutiveMemory(memory,request.now);
  if(request.currentKind===request.nextKind&&request.currentKey===request.nextKey)return{allowed:true,reason:'same-goal'};
  if(!request.emergency&&isAiExecutiveGoalBlocked(memory,request.nextKind,request.nextKey,request.now)){
    memory.metrics.rejectedSwitches++;
    memory.lastDecisionReason='blocked-goal';
    return{allowed:false,reason:'blocked'};
  }
  const priorityLead=aiGoalPriority(request.nextKind)-aiGoalPriority(request.currentKind);
  const contractActive=request.currentKind!=='none'&&request.now<request.lockedUntil;
  if(!request.emergency&&!request.force&&contractActive&&priorityLead<AI_EXECUTIVE_BRAIN.interruptPriorityMargin){
    memory.metrics.rejectedSwitches++;
    memory.lastDecisionReason='goal-contract';
    return{allowed:false,reason:'contract'};
  }
  if(!request.emergency&&detectAiDecisionOscillation(memory.recentGoals,request.nextKind,request.nextKey,request.now)){
    memory.metrics.rejectedSwitches++;
    memory.metrics.decisionOscillations++;
    memory.lastDecisionReason='decision-oscillation';
    blockAiExecutiveGoal(memory,request.nextKind,request.nextKey,request.now+AI_EXECUTIVE_BRAIN.oscillationCooldownSeconds,'oscillation');
    return{allowed:false,reason:'oscillation'};
  }
  if(request.currentKind!=='none'){memory.metrics.goalSwitches++;memory.recentSwitches.push(request.now);}
  if(request.emergency&&request.currentKind!=='none')memory.metrics.emergencyInterrupts++;
  memory.metrics.goalsStarted++;
  memory.goalStartedAt=request.now;
  memory.lastDecisionReason=request.reason||'accepted';
  memory.recentGoals.push({kind:request.nextKind,key:request.nextKey,at:request.now});
  pruneAiExecutiveMemory(memory,request.now);
  return{allowed:true,reason:'accepted'};
}

export function finishAiExecutiveGoal(memory:AiExecutiveMemory,outcome:AiGoalOutcome,reason:string){
  memory.lastOutcome=outcome;
  if(outcome!=='interrupted')memory.lastDecisionReason=reason;
  if(outcome==='completed')memory.metrics.completedGoals++;
  else if(outcome==='failed')memory.metrics.failedGoals++;
}

export function aiLootCommitmentBonus(memory:AiExecutiveMemory,intent:{goalKind:AiGoalKind;goalKey:string;goalLockedUntil:number},lootId:string,now:number){
  if(intent.goalKind!=='loot'||intent.goalKey!==lootId||isAiExecutiveGoalBlocked(memory,'loot',lootId,now))return 0;
  return now<intent.goalLockedUntil?AI_EXECUTIVE_BRAIN.lockedLootBonus:AI_EXECUTIVE_BRAIN.currentLootBonus;
}

function rounded(value:number){return Number(value.toFixed(3));}

export function summarizeAiExecutives(memories:readonly AiExecutiveMemory[],tickSamples:readonly number[],now:number){
  const recentSwitches=memories.map((memory)=>{
    pruneAiExecutiveMemory(memory,now);
    return memory.recentSwitches.length;
  });
  const sortedTicks=[...tickSamples].sort((a,b)=>a-b),p95Index=Math.max(0,Math.ceil(sortedTicks.length*.95)-1);
  const total=(key:keyof AiExecutiveMetrics)=>memories.reduce((sum,memory)=>sum+memory.metrics[key],0);
  return{
    agents:memories.length,
    goalsStarted:total('goalsStarted'),
    goalSwitches:total('goalSwitches'),
    rejectedSwitches:total('rejectedSwitches'),
    decisionOscillations:total('decisionOscillations'),
    emergencyInterrupts:total('emergencyInterrupts'),
    completedGoals:total('completedGoals'),
    failedGoals:total('failedGoals'),
    activeGoalBlocks:memories.reduce((sum,memory)=>sum+memory.blockedGoals.length,0),
    maxSwitchesPerAgent10s:Math.max(0,...recentSwitches),
    aiTickAverageMs:rounded(sortedTicks.length?sortedTicks.reduce((sum,value)=>sum+value,0)/sortedTicks.length:0),
    aiTickP95Ms:rounded(sortedTicks[p95Index]??0),
    aiTickMaxMs:rounded(sortedTicks.at(-1)??0),
  };
}
