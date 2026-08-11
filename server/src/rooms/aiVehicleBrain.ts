export type AiVehicleObjectiveKind='loot'|'supply'|'altar'|'tank'|'zone'|'patrol';
export type AiVehicleExitReason='objective'|'completed'|'combat'|'critical'|'expired'|'stuck'|'lost'|'disabled';
export type AiVehicleBlock={vehicleId:string;until:number;reason:AiVehicleExitReason};

export type AiVehicleMemory={
  mountedAt:number;
  lastVehicleId:string;
  lastDismountAt:number;
  lastExitReason:AiVehicleExitReason|'';
  planCooldownUntil:number;
  blockedVehicles:AiVehicleBlock[];
  mountCount:number;
  dismountCount:number;
  abandonCount:number;
  recoveryCount:number;
};

export const AI_VEHICLE_BRAIN={
  minimumMountSeconds:4,
  seekTimeoutSeconds:8,
  returnTimeoutSeconds:8,
  reverseTriggerSeconds:.8,
  reverseDurationSeconds:.58,
  recoveryResetSeconds:3,
  maxLocalRecoveryAttempts:2,
  arrivalSpeedThreshold:82,
  combatDismountDistance:310,
  patrolRetargetSeconds:18,
  blockSeconds:{
    objective:0,
    completed:2,
    combat:10,
    critical:14,
    expired:8,
    stuck:14,
    lost:4,
    disabled:12,
  } satisfies Record<AiVehicleExitReason,number>,
  planCooldownSeconds:{
    objective:0,
    completed:1.5,
    combat:8,
    critical:12,
    expired:6,
    stuck:10,
    lost:2.5,
    disabled:10,
  } satisfies Record<AiVehicleExitReason,number>,
} as const;

export function createAiVehicleMemory():AiVehicleMemory{
  return{mountedAt:0,lastVehicleId:'',lastDismountAt:0,lastExitReason:'',planCooldownUntil:0,blockedVehicles:[],mountCount:0,dismountCount:0,abandonCount:0,recoveryCount:0};
}

export function pruneAiVehicleMemory(memory:AiVehicleMemory,now:number){
  memory.blockedVehicles=memory.blockedVehicles.filter((entry)=>entry.until>now);
}

export function canStartAiVehiclePlan(memory:AiVehicleMemory,now:number){
  pruneAiVehicleMemory(memory,now);
  return now>=memory.planCooldownUntil;
}

export function canUseAiVehicle(memory:AiVehicleMemory,vehicleId:string,now:number){
  pruneAiVehicleMemory(memory,now);
  return !memory.blockedVehicles.some((entry)=>entry.vehicleId===vehicleId&&entry.until>now);
}

export function recordAiVehicleMount(memory:AiVehicleMemory,vehicleId:string,now:number){
  memory.mountedAt=now;
  memory.lastVehicleId=vehicleId;
  memory.mountCount++;
}

export function recordAiVehicleRecovery(memory:AiVehicleMemory){memory.recoveryCount++;}

export function recordAiVehicleExit(memory:AiVehicleMemory,vehicleId:string,now:number,reason:AiVehicleExitReason,wasMounted=true){
  pruneAiVehicleMemory(memory,now);
  memory.lastVehicleId=vehicleId;
  memory.lastExitReason=reason;
  memory.lastDismountAt=now;
  if(wasMounted)memory.dismountCount++;
  if(!['objective','completed'].includes(reason))memory.abandonCount++;
  const blockSeconds=AI_VEHICLE_BRAIN.blockSeconds[reason];
  if(blockSeconds>0){
    const existing=memory.blockedVehicles.find((entry)=>entry.vehicleId===vehicleId);
    if(existing){existing.until=Math.max(existing.until,now+blockSeconds);existing.reason=reason;}
    else memory.blockedVehicles.push({vehicleId,until:now+blockSeconds,reason});
  }
  memory.planCooldownUntil=Math.max(memory.planCooldownUntil,now+AI_VEHICLE_BRAIN.planCooldownSeconds[reason]);
}

export function aiVehicleRecoveryDecision(recoveryAttempts:number){
  return recoveryAttempts<AI_VEHICLE_BRAIN.maxLocalRecoveryAttempts?'reverse' as const:'abandon' as const;
}

export function aiVehicleArrivalRadius(vehicleKind:string,objectiveKind:AiVehicleObjectiveKind){
  if(objectiveKind==='altar')return 220;
  if(objectiveKind==='supply'||objectiveKind==='loot')return vehicleKind==='tank'||vehicleKind==='fusion_robot'?220:185;
  if(objectiveKind==='zone')return vehicleKind==='tank'||vehicleKind==='fusion_robot'?210:165;
  if(objectiveKind==='patrol')return vehicleKind==='tank'||vehicleKind==='fusion_robot'?210:145;
  return 150;
}

export function aiVehicleShouldBrake(distanceToTarget:number,speed:number,arrivalRadius:number,deceleration:number){
  if(distanceToTarget<=arrivalRadius||speed<28)return false;
  const stoppingDistance=speed*speed/(2*Math.max(1,deceleration));
  return distanceToTarget<=arrivalRadius+stoppingDistance*1.2+22;
}

export function canAiVehicleCombatDismount(mountedAt:number,now:number,targetDistance:number){
  return now-mountedAt>=AI_VEHICLE_BRAIN.minimumMountSeconds&&targetDistance<=AI_VEHICLE_BRAIN.combatDismountDistance;
}

export function shouldAiVehicleKeepPatrolling(vehicleKind:string,objectiveKind:AiVehicleObjectiveKind){
  return objectiveKind==='patrol'&&(vehicleKind==='tank'||vehicleKind==='fusion_robot');
}
