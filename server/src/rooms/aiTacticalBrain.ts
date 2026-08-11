// DROP8_REFACTOR_049_AI_TACTICAL_BRAIN
import type { AiPersonality } from './aiHumanization.js';
import { aiRoleTacticalBonus } from './aiRoleBrain.js';

export type AiTacticalAction=
  |'none'
  |'launch_drones'
  |'throw_frag'
  |'throw_smoke'
  |'throw_incendiary'
  |'place_spider_mine'
  |'place_strip_trap';

export interface AiTacticalMemory{
  actionLockedUntil:number;
  lastAction:AiTacticalAction;
  lastActionAt:number;
  lastTargetId:string;
  actionReadyAt:Partial<Record<AiTacticalAction,number>>;
  actionsUsed:number;
}

export interface AiTacticalDecisionInput{
  now:number;
  targetId:string;
  distance:number;
  targetMounted:boolean;
  targetMechanical:boolean;
  targetClosing:boolean;
  recentlyDamaged:boolean;
  selfHp:number;
  outnumberedBy:number;
  reloading:boolean;
  hunterDroneCount:number;
  spiderMineCount:number;
  stripTrapCount:number;
  throwableType:string;
  throwableCount:number;
  ownActiveMines:number;
  ownActiveStripTraps:number;
  personality:AiPersonality;
  aggression:number;
  riskAvoidance:number;
  droneSearchRadius:number;
  fragSafeDistance:number;
}

export interface AiTacticalDecision{
  action:AiTacticalAction;
  deployCount:number;
  reason:string;
  score:number;
}

export const AI_TACTICAL_BRAIN={
  actionLockSeconds:.72,
  actionCooldownSeconds:{
    launch_drones:5.5,
    throw_frag:4.2,
    throw_smoke:7.5,
    throw_incendiary:6.5,
    place_spider_mine:5.8,
    place_strip_trap:5.2,
  },
} as const;

export function createAiTacticalMemory():AiTacticalMemory{
  return{actionLockedUntil:0,lastAction:'none',lastActionAt:-99,lastTargetId:'',actionReadyAt:{},actionsUsed:0};
}

function actionReady(memory:AiTacticalMemory,action:AiTacticalAction,now:number){
  return action!=='none'&&now>=(memory.actionReadyAt[action]??0);
}

export function decideAiTacticalAction(memory:AiTacticalMemory,input:AiTacticalDecisionInput):AiTacticalDecision{
  const none:AiTacticalDecision={action:'none',deployCount:0,reason:'no-useful-action',score:0};
  if(input.now<memory.actionLockedUntil||input.distance<=0)return none;
  const candidates:AiTacticalDecision[]=[];
  const add=(action:AiTacticalAction,score:number,reason:string,deployCount=1)=>{
    if(actionReady(memory,action,input.now)&&score>=80)candidates.push({action,score,reason,deployCount});
  };

  if(input.throwableType==='smokeGrenade'&&input.throwableCount>0){
    const survivalPressure=(input.selfHp<=55?72:0)+(input.outnumberedBy>0?38:0)+(input.reloading?42:0)+(input.recentlyDamaged?24:0);
    add('throw_smoke',42+survivalPressure+input.riskAvoidance*24+aiRoleTacticalBonus(input.personality,'smoke'),'break-line-of-sight');
  }
  if(input.stripTrapCount>0&&input.ownActiveStripTraps<2&&input.distance>=95&&input.distance<=520&&(input.targetMounted||input.targetMechanical)){
    add('place_strip_trap',124+(input.targetMechanical?30:14)+(input.targetClosing?22:0)+aiRoleTacticalBonus(input.personality,'strip'),'counter-mechanical-push');
  }
  if(input.spiderMineCount>0&&input.ownActiveMines<3&&input.distance>=125&&input.distance<=455){
    const retreatPressure=(input.targetClosing?42:0)+(input.recentlyDamaged?25:0)+(input.selfHp<70?20:0)+input.riskAvoidance*22;
    add('place_spider_mine',80+retreatPressure+aiRoleTacticalBonus(input.personality,'mine'),'deny-pursuit');
  }
  if(input.throwableType==='incendiaryGrenade'&&input.throwableCount>0&&input.distance>=170&&input.distance<=510){
    add('throw_incendiary',78+input.outnumberedBy*18+input.aggression*34+aiRoleTacticalBonus(input.personality,'incendiary'),'deny-area');
  }
  if(input.throwableType==='fragGrenade'&&input.throwableCount>0&&input.distance>=input.fragSafeDistance&&input.distance<=520){
    add('throw_frag',88+input.outnumberedBy*12+input.aggression*24+aiRoleTacticalBonus(input.personality,'frag'),'medium-range-burst');
  }
  if(input.hunterDroneCount>0&&input.distance>=150&&input.distance<=input.droneSearchRadius){
    const emergency=input.targetMechanical||input.selfHp<=42||input.outnumberedBy>=2;
    const deployCount=Math.min(input.hunterDroneCount,emergency?2:input.hunterDroneCount<=2?input.hunterDroneCount:2);
    add('launch_drones',84+(input.targetMechanical?30:0)+input.aggression*24+aiRoleTacticalBonus(input.personality,'drone'),'pressure-moving-target',deployCount);
  }

  if(!candidates.length)return none;
  candidates.sort((a,b)=>b.score-a.score||a.action.localeCompare(b.action));
  return candidates[0]!;
}

export function recordAiTacticalAction(memory:AiTacticalMemory,decision:AiTacticalDecision,now:number,targetId:string){
  if(decision.action==='none')return;
  memory.lastAction=decision.action;memory.lastActionAt=now;memory.lastTargetId=targetId;memory.actionLockedUntil=now+AI_TACTICAL_BRAIN.actionLockSeconds;memory.actionsUsed++;
  const cooldown=AI_TACTICAL_BRAIN.actionCooldownSeconds[decision.action];
  memory.actionReadyAt[decision.action]=now+cooldown;
}
