// DROP8_REFACTOR_053_AI_ARENA_DIRECTOR
import type { AiRolePlan } from './aiRoleBrain.js';

export interface AiArenaDirectorMemory{
  lastCombatAt:number;
  hotspotX:number;
  hotspotY:number;
  hotspotUntil:number;
  interventionUntil:number;
  lastInterventionAt:number;
  generation:number;
  interventions:number;
  combatEvents:number;
}

export interface AiArenaDirectorInput{
  now:number;
  active:boolean;
  aiCount:number;
  humanCombatants:number;
  engagedAi:number;
  centerX:number;
  centerY:number;
}

export const AI_ARENA_DIRECTOR={
  staleCombatSeconds:9.5,
  interventionSeconds:11,
  interventionCooldownSeconds:7,
  minimumAiCount:4,
} as const;

function hashUnit(value:string){let hash=2166136261>>>0;for(const char of value){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)>>>0;}return(hash>>>0)/4294967295;}

export function createAiArenaDirectorMemory(now=0,x=0,y=0):AiArenaDirectorMemory{return{lastCombatAt:now,hotspotX:x,hotspotY:y,hotspotUntil:0,interventionUntil:0,lastInterventionAt:-99,generation:0,interventions:0,combatEvents:0};}

export function recordAiArenaCombat(memory:AiArenaDirectorMemory,x:number,y:number,now:number){
  const blend=memory.hotspotUntil>now?.35:1;memory.hotspotX=memory.hotspotX*(1-blend)+x*blend;memory.hotspotY=memory.hotspotY*(1-blend)+y*blend;memory.hotspotUntil=now+20;memory.lastCombatAt=now;memory.combatEvents++;
  if(memory.interventionUntil>now)memory.interventionUntil=now;
}

export function maybeStartAiArenaIntervention(memory:AiArenaDirectorMemory,input:AiArenaDirectorInput){
  if(!input.active||input.aiCount<AI_ARENA_DIRECTOR.minimumAiCount||input.humanCombatants>0||input.engagedAi>1||input.now-memory.lastCombatAt<AI_ARENA_DIRECTOR.staleCombatSeconds||input.now-memory.lastInterventionAt<AI_ARENA_DIRECTOR.interventionCooldownSeconds||input.now<memory.interventionUntil)return false;
  if(memory.hotspotUntil<input.now){memory.hotspotX=input.centerX;memory.hotspotY=input.centerY;}
  memory.generation++;memory.interventions++;memory.lastInterventionAt=input.now;memory.interventionUntil=input.now+AI_ARENA_DIRECTOR.interventionSeconds;return true;
}

export function isAiArenaInterventionActive(memory:AiArenaDirectorMemory,now:number){return now<memory.interventionUntil;}

export function shouldAiJoinArenaIntervention(aiId:string,generation:number,role:AiRolePlan){
  const threshold=Math.max(.72,Math.min(.96,.56+role.directorParticipation*.3));
  return hashUnit(`${aiId}:join:${generation}`)<=threshold;
}

export function aiArenaDirectorWaypoint(memory:AiArenaDirectorMemory,aiId:string,role:AiRolePlan){
  const angle=hashUnit(`${aiId}:angle:${memory.generation}`)*Math.PI*2,ring=(145+hashUnit(`${aiId}:ring:${memory.generation}`)*185)*role.directorRingMultiplier;
  return{x:memory.hotspotX+Math.cos(angle)*ring,y:memory.hotspotY+Math.sin(angle)*ring};
}

export function aiArenaDirectorSummary(memory:AiArenaDirectorMemory,now:number){return{generation:memory.generation,interventions:memory.interventions,combatEvents:memory.combatEvents,active:isAiArenaInterventionActive(memory,now),secondsSinceCombat:Math.max(0,now-memory.lastCombatAt)};}
