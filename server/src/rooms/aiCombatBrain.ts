export type AiCombatPosture='none'|'push'|'hold'|'kite'|'cover'|'reload'|'disengage';
export type AiCombatDecisionReason='contract'|'reload'|'critical-health'|'outnumbered'|'high-threat'|'too-close'|'too-far'|'finish-weak-target'|'effective-range';

export type AiCombatMemory={
  targetId:string;
  targetCommittedUntil:number;
  posture:AiCombatPosture;
  postureUntil:number;
  postureTargetId:string;
  coverTargetId:string;
  coverX:number;
  coverY:number;
  coverUntil:number;
  targetSwitchCount:number;
  postureSwitchCount:number;
  coverSelectionCount:number;
  disengageCount:number;
};

export type AiCombatDecisionInput={
  hp:number;
  maxHp:number;
  armor:number;
  magazine:number;
  magazineSize:number;
  reserveAmmo:number;
  isReloading:boolean;
  hasLoadedAlternate:boolean;
  melee:boolean;
  distance:number;
  desiredRange:number;
  targetHp:number;
  targetThreat:number;
  recentlyDamaged:boolean;
  outnumberedBy:number;
  hasCover:boolean;
  aggression:number;
  riskAvoidance:number;
};

export type AiCombatDecision={posture:AiCombatPosture;reason:AiCombatDecisionReason;lockSeconds:number};

export const AI_COMBAT_BRAIN={
  targetCommitSeconds:2.8,
  attackerCommitSeconds:3.6,
  mechanicalCommitSeconds:3.25,
  coverMemorySeconds:2.8,
  postureSeconds:{push:1.2,hold:1.45,kite:1,cover:2.2,reload:2.4,disengage:2.5} satisfies Record<Exclude<AiCombatPosture,'none'>,number>,
  criticalHealthRatio:.25,
  lowHealthRatio:.43,
  outnumberedCount:2,
  lowMagazineRatio:.22,
} as const;

export function createAiCombatMemory():AiCombatMemory{
  return{targetId:'',targetCommittedUntil:0,posture:'none',postureUntil:0,postureTargetId:'',coverTargetId:'',coverX:0,coverY:0,coverUntil:0,targetSwitchCount:0,postureSwitchCount:0,coverSelectionCount:0,disengageCount:0};
}

export function aiCombatTargetCommitSeconds(input:{recentAttacker:boolean;mechanical:boolean;focus:number}){
  const base=input.recentAttacker?AI_COMBAT_BRAIN.attackerCommitSeconds:input.mechanical?AI_COMBAT_BRAIN.mechanicalCommitSeconds:AI_COMBAT_BRAIN.targetCommitSeconds;
  return base+Math.max(0,Math.min(1,input.focus))*.35;
}

export function commitAiCombatTarget(memory:AiCombatMemory,targetId:string,now:number,seconds:number){
  if(memory.targetId&&memory.targetId!==targetId)memory.targetSwitchCount++;
  if(memory.targetId!==targetId||now>=memory.targetCommittedUntil){memory.targetId=targetId;memory.targetCommittedUntil=now+seconds;}
}

export function isAiCombatTargetCommitted(memory:AiCombatMemory,targetId:string,now:number){return memory.targetId===targetId&&now<memory.targetCommittedUntil;}

function rawAiCombatDecision(input:AiCombatDecisionInput):AiCombatDecision{
  const maxHp=Math.max(1,input.maxHp),effectiveHealth=(input.hp+Math.max(0,input.armor)*.32)/maxHp;
  const criticalThreshold=AI_COMBAT_BRAIN.criticalHealthRatio+input.riskAvoidance*.08;
  const lowThreshold=AI_COMBAT_BRAIN.lowHealthRatio+input.riskAvoidance*.09;
  const needsReload=input.isReloading||!input.melee&&input.reserveAmmo>0&&!input.hasLoadedAlternate&&(input.magazine<=0||input.magazine/input.magazineSize<=AI_COMBAT_BRAIN.lowMagazineRatio&&(input.distance>input.desiredRange*.82||input.hasCover));
  if(input.isReloading||needsReload)return{posture:'reload',reason:'reload',lockSeconds:AI_COMBAT_BRAIN.postureSeconds.reload};
  if(effectiveHealth<=criticalThreshold&&(input.recentlyDamaged||input.outnumberedBy>0||input.targetThreat>=80))return{posture:'disengage',reason:'critical-health',lockSeconds:AI_COMBAT_BRAIN.postureSeconds.disengage};
  if(input.outnumberedBy>=AI_COMBAT_BRAIN.outnumberedCount&&effectiveHealth<.76)return{posture:input.hasCover?'cover':'disengage',reason:'outnumbered',lockSeconds:input.hasCover?AI_COMBAT_BRAIN.postureSeconds.cover:AI_COMBAT_BRAIN.postureSeconds.disengage};
  if(effectiveHealth<=lowThreshold&&(input.recentlyDamaged||input.targetThreat>=95))return{posture:input.hasCover?'cover':'disengage',reason:'high-threat',lockSeconds:input.hasCover?AI_COMBAT_BRAIN.postureSeconds.cover:AI_COMBAT_BRAIN.postureSeconds.disengage};
  if(!input.melee&&input.distance<input.desiredRange*(.42+input.riskAvoidance*.14))return{posture:'kite',reason:'too-close',lockSeconds:AI_COMBAT_BRAIN.postureSeconds.kite};
  if(input.targetHp<=24&&effectiveHealth>.48&&input.aggression>.42)return{posture:'push',reason:'finish-weak-target',lockSeconds:AI_COMBAT_BRAIN.postureSeconds.push};
  if(input.distance>input.desiredRange*(1.08+input.aggression*.16))return{posture:'push',reason:'too-far',lockSeconds:AI_COMBAT_BRAIN.postureSeconds.push};
  return{posture:'hold',reason:'effective-range',lockSeconds:AI_COMBAT_BRAIN.postureSeconds.hold};
}

function postureStillUseful(posture:AiCombatPosture,input:AiCombatDecisionInput){
  if(posture==='reload')return input.isReloading||input.magazine<=0&&input.reserveAmmo>0&&!input.hasLoadedAlternate;
  if(posture==='cover'||posture==='disengage')return input.hp/Math.max(1,input.maxHp)<.58||input.outnumberedBy>0&&input.recentlyDamaged;
  if(posture==='push')return input.melee||input.distance>input.desiredRange*.72;
  if(posture==='kite')return !input.melee&&input.distance<input.desiredRange*.82;
  return posture==='hold';
}

export function decideAiCombatPosture(input:AiCombatDecisionInput,current:AiCombatPosture,locked:boolean):AiCombatDecision{
  const next=rawAiCombatDecision(input);
  const emergency=next.posture==='reload'&&input.magazine<=0||next.posture==='disengage'&&next.reason==='critical-health';
  if(locked&&current!=='none'&&next.posture!==current&&!emergency&&postureStillUseful(current,input))return{posture:current,reason:'contract',lockSeconds:0};
  return next;
}

export function commitAiCombatPosture(memory:AiCombatMemory,targetId:string,decision:AiCombatDecision,now:number){
  const changed=memory.posture!==decision.posture||memory.postureTargetId!==targetId;
  if(changed){memory.postureSwitchCount++;if(decision.posture==='disengage')memory.disengageCount++;}
  memory.posture=decision.posture;memory.postureTargetId=targetId;
  if(changed||now>=memory.postureUntil)memory.postureUntil=now+decision.lockSeconds;
}

export function rememberAiCombatCover(memory:AiCombatMemory,targetId:string,point:{x:number;y:number},now:number){
  memory.coverTargetId=targetId;memory.coverX=point.x;memory.coverY=point.y;memory.coverUntil=now+AI_COMBAT_BRAIN.coverMemorySeconds;memory.coverSelectionCount++;
}

export function recallAiCombatCover(memory:AiCombatMemory,targetId:string,now:number){
  return memory.coverTargetId===targetId&&now<memory.coverUntil?{x:memory.coverX,y:memory.coverY}:undefined;
}

export function clearAiCombatCover(memory:AiCombatMemory){memory.coverTargetId='';memory.coverX=0;memory.coverY=0;memory.coverUntil=0;}
