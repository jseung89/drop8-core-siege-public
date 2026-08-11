// DROP8_REFACTOR_052_AI_ROLE_BRAIN
import type { AiPersonality } from './aiHumanization.js';
import type { AiResourceCategory } from './aiResourceBrain.js';

export interface AiRolePlan{
  combatRangeMultiplier:number;
  vehicleMinimumTripDistance:number;
  vehicleScoreBonus:number;
  directorParticipation:number;
  directorRingMultiplier:number;
  tacticalBias:number;
  trapBias:number;
  antiMechanicalBias:number;
  survivalBias:number;
}

const ROLE_PLANS:Record<AiPersonality,AiRolePlan>={
  aggressive:{combatRangeMultiplier:.84,vehicleMinimumTripDistance:650,vehicleScoreBonus:0,directorParticipation:1.2,directorRingMultiplier:.78,tacticalBias:18,trapBias:-4,antiMechanicalBias:4,survivalBias:-8},
  cautious:{combatRangeMultiplier:1.16,vehicleMinimumTripDistance:760,vehicleScoreBonus:-20,directorParticipation:.78,directorRingMultiplier:1.2,tacticalBias:-2,trapBias:22,antiMechanicalBias:8,survivalBias:24},
  support:{combatRangeMultiplier:1.06,vehicleMinimumTripDistance:680,vehicleScoreBonus:-6,directorParticipation:.96,directorRingMultiplier:1.04,tacticalBias:16,trapBias:10,antiMechanicalBias:22,survivalBias:10},
  scavenger:{combatRangeMultiplier:1,vehicleMinimumTripDistance:720,vehicleScoreBonus:-8,directorParticipation:.86,directorRingMultiplier:1.12,tacticalBias:2,trapBias:6,antiMechanicalBias:2,survivalBias:8},
  driver:{combatRangeMultiplier:.94,vehicleMinimumTripDistance:420,vehicleScoreBonus:145,directorParticipation:1.05,directorRingMultiplier:.9,tacticalBias:4,trapBias:8,antiMechanicalBias:16,survivalBias:2},
};

export function aiRolePlan(personality:AiPersonality){return ROLE_PLANS[personality];}

export function aiRoleResourceBonus(personality:AiPersonality,category:AiResourceCategory){
  const bonuses:Record<AiPersonality,Partial<Record<AiResourceCategory,number>>>={
    aggressive:{weapon:18,ammo:10,tactical:10,healing:-6},
    cautious:{healing:20,armor:18,ammo:8,vehicle:-12},
    support:{tactical:20,ammo:10,healing:10,robot:8},
    scavenger:{robot:26,supply:22,weapon:8,armor:8,tactical:8},
    driver:{vehicle:34,ammo:8,armor:6,robot:4},
  };
  return bonuses[personality][category]??0;
}

export function aiRoleObjectiveBonus(personality:AiPersonality,kind:'supply'|'altar'){
  if(kind==='supply')return personality==='scavenger'?28:personality==='support'?12:personality==='cautious'?-6:0;
  return personality==='aggressive'?18:personality==='cautious'?-16:personality==='scavenger'?8:0;
}

export function aiRoleTacticalBonus(personality:AiPersonality,action:'drone'|'frag'|'smoke'|'incendiary'|'mine'|'strip'){
  const plan=aiRolePlan(personality);
  if(action==='smoke')return plan.survivalBias;
  if(action==='mine')return plan.trapBias;
  if(action==='strip')return plan.antiMechanicalBias;
  return plan.tacticalBias;
}
