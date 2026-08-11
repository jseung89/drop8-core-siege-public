export const SPIDER_MINE_BALANCE={
  placementDistance:54,
  armSeconds:.9,
  lifetimeSeconds:50,
  detectionRadius:170,
  triggerRadius:32,
  chaseSpeed:330,
  turnResponse:11,
  chaseSeconds:2.6,
  effectRadius:116,
  maxPlayerDamage:50,
  minPlayerDamage:12,
  ownerMaxDamage:10,
  maxVehicleDamage:140,
  minVehicleDamage:32,
  tankDamageMultiplier:1.28,
  hp:24,
  hitRadius:15,
  maxCarry:2,
  pickupAmount:1,
  maxActivePerOwner:2,
  overlapDistance:76,
} as const;

function radialDamage(distance:number,radius:number,maxDamage:number,minDamage:number){
  if(!Number.isFinite(distance)||distance>=radius)return 0;
  const ratio=Math.max(0,Math.min(1,distance/radius));
  return Math.round(maxDamage-(maxDamage-minDamage)*ratio);
}

export function spiderMinePlayerDamage(distance:number,isOwner=false){
  const damage=radialDamage(distance,SPIDER_MINE_BALANCE.effectRadius,SPIDER_MINE_BALANCE.maxPlayerDamage,SPIDER_MINE_BALANCE.minPlayerDamage);
  return isOwner?Math.min(SPIDER_MINE_BALANCE.ownerMaxDamage,damage):damage;
}

export function spiderMineVehicleDamage(distance:number,isTank=false){
  const damage=radialDamage(distance,SPIDER_MINE_BALANCE.effectRadius,SPIDER_MINE_BALANCE.maxVehicleDamage,SPIDER_MINE_BALANCE.minVehicleDamage);
  return isTank?Math.round(damage*SPIDER_MINE_BALANCE.tankDamageMultiplier):damage;
}
