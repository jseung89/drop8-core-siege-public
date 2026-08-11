// DROP8_REFACTOR_055_AI_LOCOMOTION_UTILITY_BRAIN
export interface AiLocomotionSample{
  x:number;
  y:number;
  at:number;
}

export interface AiLocomotionMemory{
  context:string;
  selectedKey:string;
  selectedSince:number;
  headingX:number;
  headingY:number;
  positionSamples:AiLocomotionSample[];
  switchTimes:number[];
  reversalTimes:number[];
  totalSwitches:number;
  totalReversals:number;
}

export interface AiMovementCandidate{
  key:string;
  directionX:number;
  directionY:number;
  progressGain?:number;
  rangeGain?:number;
  coverGain?:number;
  dangerAvoidance?:number;
  separationGain?:number;
  collisionRisk?:number;
  aimInstability?:number;
  baseBias?:number;
}

export interface AiMovementDecisionOptions{
  context:string;
  now:number;
  urgency?:number;
  emergency?:boolean;
}

export interface AiMovementDecision{
  key:string;
  directionX:number;
  directionY:number;
  score:number;
  switched:boolean;
  efficiency:number;
  hysteresis:number;
}

export const AI_LOCOMOTION_BRAIN={
  sampleIntervalSeconds:.12,
  sampleWindowSeconds:1.6,
  switchWindowSeconds:2.2,
  minimumEfficiencyTravel:14,
  baseSwitchMargin:6,
  lowEfficiencySwitchMargin:8,
  repeatedSwitchMargin:3,
  reversalBasePenalty:10,
  reversalInefficiencyPenalty:24,
  repeatedReversalPenalty:10,
} as const;

function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value));}

function normalized(x:number,y:number){
  const length=Math.hypot(x,y);
  return length>.0001?{x:x/length,y:y/length}:{x:0,y:0};
}

export function createAiLocomotionMemory(initialHeadingX=0,initialHeadingY=0):AiLocomotionMemory{
  const heading=normalized(initialHeadingX,initialHeadingY);
  return{context:'',selectedKey:'',selectedSince:0,headingX:heading.x,headingY:heading.y,positionSamples:[],switchTimes:[],reversalTimes:[],totalSwitches:0,totalReversals:0};
}

export function recordAiLocomotionPosition(memory:AiLocomotionMemory,x:number,y:number,now:number){
  const last=memory.positionSamples.at(-1);
  if(last&&(now<last.at||now-last.at>AI_LOCOMOTION_BRAIN.sampleWindowSeconds*2))memory.positionSamples=[];
  const currentLast=memory.positionSamples.at(-1);
  if(!currentLast||now-currentLast.at>=AI_LOCOMOTION_BRAIN.sampleIntervalSeconds)memory.positionSamples.push({x,y,at:now});
  const cutoff=now-AI_LOCOMOTION_BRAIN.sampleWindowSeconds;
  while(memory.positionSamples.length>2&&memory.positionSamples[1]!.at<cutoff)memory.positionSamples.shift();
  if(memory.positionSamples.length>18)memory.positionSamples.splice(0,memory.positionSamples.length-18);
}

export function aiLocomotionEfficiency(memory:AiLocomotionMemory,now:number){
  const samples=memory.positionSamples.filter((sample)=>sample.at>=now-AI_LOCOMOTION_BRAIN.sampleWindowSeconds);
  if(samples.length<2)return 1;
  let travel=0;
  for(let index=1;index<samples.length;index++)travel+=Math.hypot(samples[index]!.x-samples[index-1]!.x,samples[index]!.y-samples[index-1]!.y);
  if(travel<AI_LOCOMOTION_BRAIN.minimumEfficiencyTravel)return 1;
  const first=samples[0]!,last=samples.at(-1)!;
  return clamp(Math.hypot(last.x-first.x,last.y-first.y)/travel,0,1);
}

function recentCount(times:readonly number[],now:number){return times.filter((at)=>at>=now-AI_LOCOMOTION_BRAIN.switchWindowSeconds).length;}

export function aiMovementReversalPenalty(memory:AiLocomotionMemory,candidate:AiMovementCandidate,now:number,emergency=false){
  const heading=normalized(memory.headingX,memory.headingY),direction=normalized(candidate.directionX,candidate.directionY);
  if(!heading.x&&!heading.y||!direction.x&&!direction.y)return 0;
  const reversal=Math.max(0,-(heading.x*direction.x+heading.y*direction.y));
  if(reversal<=0)return 0;
  const efficiency=aiLocomotionEfficiency(memory,now),recentReversals=recentCount(memory.reversalTimes,now);
  const penalty=reversal*(AI_LOCOMOTION_BRAIN.reversalBasePenalty+(1-efficiency)*AI_LOCOMOTION_BRAIN.reversalInefficiencyPenalty+recentReversals*AI_LOCOMOTION_BRAIN.repeatedReversalPenalty);
  if(!emergency)return penalty;
  return reversal*(
    AI_LOCOMOTION_BRAIN.reversalBasePenalty*.2
    +(1-efficiency)*AI_LOCOMOTION_BRAIN.reversalInefficiencyPenalty*.25
    +recentReversals*AI_LOCOMOTION_BRAIN.repeatedReversalPenalty*.85
  );
}

export function scoreAiMovementCandidate(memory:AiLocomotionMemory,candidate:AiMovementCandidate,now:number,emergency=false){
  const heading=normalized(memory.headingX,memory.headingY),direction=normalized(candidate.directionX,candidate.directionY),alignment=heading.x||heading.y?heading.x*direction.x+heading.y*direction.y:1;
  const continuity=candidate.key===memory.selectedKey&&(!direction.x&&!direction.y||alignment>-.15)?2:0;
  return(candidate.progressGain??0)*3
    +(candidate.rangeGain??0)*1.5
    +(candidate.coverGain??0)*2
    +(candidate.dangerAvoidance??0)*2.5
    +(candidate.separationGain??0)*.8
    -(candidate.collisionRisk??0)*2.2
    -(candidate.aimInstability??0)*1.4
    +(candidate.baseBias??0)
    +continuity
    -aiMovementReversalPenalty(memory,candidate,now,emergency);
}

export function chooseAiMovement(memory:AiLocomotionMemory,candidates:readonly AiMovementCandidate[],options:AiMovementDecisionOptions):AiMovementDecision|undefined{
  if(candidates.length===0)return undefined;
  const now=options.now,urgency=clamp(options.urgency??.35,0,1),emergency=Boolean(options.emergency),efficiency=aiLocomotionEfficiency(memory,now);
  memory.switchTimes=memory.switchTimes.filter((at)=>at>=now-AI_LOCOMOTION_BRAIN.switchWindowSeconds);
  memory.reversalTimes=memory.reversalTimes.filter((at)=>at>=now-AI_LOCOMOTION_BRAIN.switchWindowSeconds);
  const scored=candidates.map((candidate)=>({candidate,score:scoreAiMovementCandidate(memory,candidate,now,emergency)}));
  let best=scored[0]!;
  for(const entry of scored.slice(1))if(entry.score>best.score)best=entry;
  const contextChanged=memory.context!==options.context,previous=normalized(memory.headingX,memory.headingY);
  const currentEntry=contextChanged?undefined:scored.find((entry)=>entry.candidate.key===memory.selectedKey),currentDirection=currentEntry?normalized(currentEntry.candidate.directionX,currentEntry.candidate.directionY):undefined;
  const current=currentEntry&&(!currentDirection||!previous.x&&!previous.y||!currentDirection.x&&!currentDirection.y||previous.x*currentDirection.x+previous.y*currentDirection.y>-.15)?currentEntry:undefined;
  const hysteresis=emergency?0:AI_LOCOMOTION_BRAIN.baseSwitchMargin+(1-efficiency)*AI_LOCOMOTION_BRAIN.lowEfficiencySwitchMargin+memory.switchTimes.length*AI_LOCOMOTION_BRAIN.repeatedSwitchMargin;
  const selected=current&&best.candidate.key!==current.candidate.key&&best.score<=current.score+hysteresis?current:best;
  const direction=normalized(selected.candidate.directionX,selected.candidate.directionY),directionReversed=!contextChanged&&Boolean(memory.selectedKey)&&Boolean(previous.x||previous.y)&&Boolean(direction.x||direction.y)&&previous.x*direction.x+previous.y*direction.y<-.15;
  const changed=!contextChanged&&Boolean(memory.selectedKey)&&(selected.candidate.key!==memory.selectedKey||directionReversed);
  if(changed){
    memory.totalSwitches++;
    memory.switchTimes.push(now);
    if((previous.x||previous.y)&&(direction.x||direction.y)&&previous.x*direction.x+previous.y*direction.y<-.15){memory.totalReversals++;memory.reversalTimes.push(now);}
  }
  if(contextChanged||!memory.selectedKey||changed){memory.context=options.context;memory.selectedKey=selected.candidate.key;memory.selectedSince=now;}
  let output=direction;
  if(direction.x||direction.y){
    const alpha=emergency?.9:contextChanged?.7:changed?.62+urgency*.2:.24+urgency*.3;
    output=normalized(previous.x*(1-alpha)+direction.x*alpha,previous.y*(1-alpha)+direction.y*alpha);
    memory.headingX=output.x;memory.headingY=output.y;
  }else if(now-memory.selectedSince>.65){memory.headingX=0;memory.headingY=0;}
  return{key:selected.candidate.key,directionX:output.x,directionY:output.y,score:selected.score,switched:changed,efficiency,hysteresis};
}

export function aiLocomotionSummary(memories:Iterable<AiLocomotionMemory>,now:number){
  let agents=0,totalEfficiency=0,minimumEfficiency=1,inefficientAgents=0,oscillatingAgents=0,totalSwitches=0,totalReversals=0,maxSwitchesPerAgent=0,maxReversalsPerAgent=0,maxRecentReversalsPerAgent=0;
  for(const memory of memories){const efficiency=aiLocomotionEfficiency(memory,now),recentReversals=recentCount(memory.reversalTimes,now);agents++;totalEfficiency+=efficiency;minimumEfficiency=Math.min(minimumEfficiency,efficiency);if(efficiency<.42)inefficientAgents++;if(efficiency<.42&&recentReversals>=2)oscillatingAgents++;totalSwitches+=memory.totalSwitches;totalReversals+=memory.totalReversals;maxSwitchesPerAgent=Math.max(maxSwitchesPerAgent,memory.totalSwitches);maxReversalsPerAgent=Math.max(maxReversalsPerAgent,memory.totalReversals);maxRecentReversalsPerAgent=Math.max(maxRecentReversalsPerAgent,recentReversals);}
  return{agents,averageEfficiency:agents?Math.round(totalEfficiency/agents*1000)/1000:1,minimumEfficiency:Math.round(minimumEfficiency*1000)/1000,inefficientAgents,oscillatingAgents,totalSwitches,totalReversals,maxSwitchesPerAgent,maxReversalsPerAgent,maxRecentReversalsPerAgent};
}
