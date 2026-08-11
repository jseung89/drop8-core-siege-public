// DROP8_REFACTOR_050_AI_RESOURCE_BRAIN
export type AiResourceCategory='weapon'|'ammo'|'healing'|'armor'|'tactical'|'robot'|'vehicle'|'supply'|'other';

export interface AiResourceMemory{
  focus:AiResourceCategory;
  focusUntil:number;
  targetId:string;
  targetCategory:AiResourceCategory;
  targetUntil:number;
  lastPickupCategory:AiResourceCategory;
  lastPickupAt:number;
  pickups:number;
}

export interface AiResourceContext{
  now:number;
  hp:number;
  armor:number;
  hasUsableGun:boolean;
  combatReady:boolean;
  ammoRatio:number;
  healingCount:number;
  robotParts:number;
  closestRobotSetParts:number;
  hasTankKey:boolean;
  tankAvailable:boolean;
  tacticalCount:number;
  lootPreference:number;
  riskAvoidance:number;
}

export interface AiResourceCandidateInput{
  baseScore:number;
  distance:number;
  category:AiResourceCategory;
  focus:AiResourceCategory;
  zoneRisk:number;
  enemyRisk:number;
  routeRisk:number;
  dangerRisk:number;
  competition:number;
  commitmentBonus:number;
  urgent:boolean;
  lootPreference:number;
  riskAvoidance:number;
}

export function createAiResourceMemory():AiResourceMemory{
  return{focus:'other',focusUntil:0,targetId:'',targetCategory:'other',targetUntil:0,lastPickupCategory:'other',lastPickupAt:-99,pickups:0};
}

export function aiResourceUrgency(context:AiResourceContext){
  if(!context.hasUsableGun)return 1;
  if(context.hp<42&&context.healingCount===0)return .95;
  if(context.hp<68&&context.healingCount<2)return .82;
  if(context.ammoRatio<.22)return .78;
  if(context.armor<35)return .58;
  if(context.closestRobotSetParts===2)return .72;
  if(context.hasTankKey&&context.tankAvailable)return .62;
  return .28+context.lootPreference*.18;
}

export function chooseAiResourceFocus(memory:AiResourceMemory,context:AiResourceContext):AiResourceCategory{
  const emergency:AiResourceCategory|undefined=!context.hasUsableGun?'weapon':context.hp<42&&context.healingCount===0?'healing':context.ammoRatio<.12?'ammo':undefined;
  if(emergency){memory.focus=emergency;memory.focusUntil=context.now+4.5;return memory.focus;}
  if(context.now<memory.focusUntil&&memory.focus!=='other')return memory.focus;
  if(context.hp<68&&context.healingCount<2)memory.focus='healing';
  else if(context.closestRobotSetParts>=2)memory.focus='robot';
  else if(context.ammoRatio<.34)memory.focus='ammo';
  else if(context.armor<45)memory.focus='armor';
  else if(context.hasTankKey&&context.tankAvailable)memory.focus='vehicle';
  else if(context.tacticalCount<2)memory.focus='tactical';
  else if(context.robotParts>0)memory.focus='robot';
  else memory.focus='other';
  memory.focusUntil=context.now+3.8;
  return memory.focus;
}

export function isAiResourceUrgent(category:AiResourceCategory,context:AiResourceContext){
  return category==='weapon'&&!context.hasUsableGun||category==='healing'&&context.hp<48&&context.healingCount===0||category==='ammo'&&context.ammoRatio<.12||category==='robot'&&context.closestRobotSetParts===2;
}

export function scoreAiResourceCandidate(input:AiResourceCandidateInput){
  const focusBonus=input.focus===input.category?42:input.focus==='other'?0:-12;
  const riskWeight=input.urgent?.42:.82+input.riskAvoidance*.38;
  const totalRisk=(input.zoneRisk+input.enemyRisk+input.routeRisk+input.dangerRisk)*riskWeight;
  return input.baseScore+focusBonus+input.commitmentBonus+input.lootPreference*12-input.distance*.035-totalRisk-input.competition*9;
}

export function commitAiResourceTarget(memory:AiResourceMemory,id:string,category:AiResourceCategory,now:number){
  if(memory.targetId!==id){memory.targetId=id;memory.targetCategory=category;}
  memory.targetUntil=now+3.5;
}

export function recordAiResourcePickup(memory:AiResourceMemory,category:AiResourceCategory,now:number){
  memory.lastPickupCategory=category;memory.lastPickupAt=now;memory.pickups++;
  if(memory.targetCategory===category){memory.targetId='';memory.targetCategory='other';memory.targetUntil=0;memory.focusUntil=Math.min(memory.focusUntil,now+.4);}
}

export function aiResourceTargetCommitment(memory:AiResourceMemory,id:string,category:AiResourceCategory,now:number){
  if(now>=memory.targetUntil)return 0;
  if(memory.targetId===id)return 28;
  return memory.targetCategory===category?6:-8;
}

export function scoreAiSupplyObjective(context:AiResourceContext,distance:number,dangerPenalty:number,competition:number){
  return 102+aiResourceUrgency(context)*82+context.lootPreference*26-distance*.055-dangerPenalty*(.8+context.riskAvoidance*.4)-competition*10;
}
