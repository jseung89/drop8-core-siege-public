// DROP8_REFACTOR_051_AI_EXPERIENCE_BRAIN
export type AiDangerKind='bullet'|'explosion'|'fire'|'melee'|'vehicle'|'trap'|'death'|'stuck'|'other';

export interface AiDangerRecord{
  x:number;
  y:number;
  radius:number;
  weight:number;
  recordedAt:number;
  expiresAt:number;
  kind:AiDangerKind;
  hits:number;
}

export interface AiExperienceMemory{
  dangers:AiDangerRecord[];
  damageEvents:number;
  deathsRemembered:number;
  failedRoutes:number;
}

export const AI_EXPERIENCE_BRAIN={
  maxDangerRecords:12,
  mergeDistance:150,
  dangerLifetimeSeconds:18,
  deathLifetimeSeconds:32,
  stuckLifetimeSeconds:12,
} as const;

export function createAiExperienceMemory():AiExperienceMemory{return{dangers:[],damageEvents:0,deathsRemembered:0,failedRoutes:0};}

export function pruneAiExperience(memory:AiExperienceMemory,now:number){
  memory.dangers=memory.dangers.filter((danger)=>danger.expiresAt>now&&danger.weight>1);
  if(memory.dangers.length>AI_EXPERIENCE_BRAIN.maxDangerRecords)memory.dangers.sort((a,b)=>b.weight-a.weight||b.recordedAt-a.recordedAt).splice(AI_EXPERIENCE_BRAIN.maxDangerRecords);
}

export function recordAiDanger(memory:AiExperienceMemory,input:{x:number;y:number;now:number;kind:AiDangerKind;severity:number;radius?:number}){
  pruneAiExperience(memory,input.now);
  const severity=Math.max(.1,Math.min(2,input.severity)),radius=input.radius??(input.kind==='death'?260:input.kind==='stuck'?120:210),lifetime=input.kind==='death'?AI_EXPERIENCE_BRAIN.deathLifetimeSeconds:input.kind==='stuck'?AI_EXPERIENCE_BRAIN.stuckLifetimeSeconds:AI_EXPERIENCE_BRAIN.dangerLifetimeSeconds,weight=(input.kind==='death'?92:input.kind==='stuck'?24:48)*severity;
  const existing=memory.dangers.find((danger)=>danger.kind===input.kind&&Math.hypot(danger.x-input.x,danger.y-input.y)<=Math.min(AI_EXPERIENCE_BRAIN.mergeDistance,(danger.radius+radius)*.45));
  if(existing){const total=Math.max(1,existing.hits+1);existing.x=(existing.x*existing.hits+input.x)/total;existing.y=(existing.y*existing.hits+input.y)/total;existing.hits=total;existing.radius=Math.max(existing.radius,radius);existing.weight=Math.min(160,existing.weight+weight*.45);existing.recordedAt=input.now;existing.expiresAt=input.now+lifetime;}
  else memory.dangers.push({x:input.x,y:input.y,radius,weight,recordedAt:input.now,expiresAt:input.now+lifetime,kind:input.kind,hits:1});
  if(input.kind==='death')memory.deathsRemembered++;
  else if(input.kind==='stuck')memory.failedRoutes++;
  else memory.damageEvents++;
  pruneAiExperience(memory,input.now);
}

export function aiDangerScoreAt(memory:AiExperienceMemory,x:number,y:number,now:number){
  let score=0;
  for(const danger of memory.dangers){
    if(danger.expiresAt<=now)continue;
    const d=Math.hypot(danger.x-x,danger.y-y);if(d>=danger.radius)continue;
    const lifetime=Math.max(.01,danger.expiresAt-danger.recordedAt),freshness=Math.max(0,Math.min(1,(danger.expiresAt-now)/lifetime)),proximity=1-d/danger.radius;
    score+=danger.weight*freshness*proximity*proximity;
  }
  return Math.min(180,score);
}

export function aiExperienceSummary(memories:Iterable<AiExperienceMemory>,now:number){
  let agents=0,activeDangers=0,damageEvents=0,deathsRemembered=0,failedRoutes=0;
  for(const memory of memories){agents++;pruneAiExperience(memory,now);activeDangers+=memory.dangers.length;damageEvents+=memory.damageEvents;deathsRemembered+=memory.deathsRemembered;failedRoutes+=memory.failedRoutes;}
  return{agents,activeDangers,damageEvents,deathsRemembered,failedRoutes};
}
