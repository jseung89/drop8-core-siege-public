// DROP8_REFACTOR_020_WEREWOLF_PREDATOR_ADHESIVE_BALANCE
// DROP8_REFACTOR_018_WEREWOLF_SEASON
// DROP8_REFACTOR_017_ADHESIVE_STRIP_LOBBY_BAZOOKA_WATER
export type VehicleSlowKind='adhesive'|'strip_trap'|'werewolf_hunt'|'stun';

export interface VehicleSlowProfile{
  speedMultiplier:number;
  accelerationMultiplier:number;
  steeringMultiplier:number;
  durationSeconds:number;
}

export interface VehicleSlowEffect extends VehicleSlowProfile{
  kind:VehicleSlowKind;
  sourceId:string;
  startedAt:number;
  expiresAt:number;
  maxExpiresAt:number;
}

export interface VehicleSlowAggregate{
  kind:''|VehicleSlowKind|'mixed';
  speedMultiplier:number;
  accelerationMultiplier:number;
  steeringMultiplier:number;
  expiresAt:number;
}

export const ADHESIVE_SPRAYER_BALANCE={
  range:420,
  halfAngleRadians:21*Math.PI/180,
  tickSeconds:.10,
  exposureThresholdSeconds:.25,
  exposureBreakSeconds:.35,
  magazine:80,
  chargePerTick:1,
  chargePickupAmount:40,
  maxChargeReserve:160,
  visualDurationSeconds:.18,
  muzzleOffset:34,
  puddle:{radius:78,lifetimeSeconds:8,placeIntervalSeconds:.32,maxActivePerOwner:8,playerStage:2,playerHoldSeconds:2.8,vehicle:{speedMultiplier:.50,accelerationMultiplier:.38,steeringMultiplier:.70,durationSeconds:2.4,maxDurationSeconds:4}},
  motorcycle:{speedMultiplier:.45,accelerationMultiplier:.30,steeringMultiplier:.65,durationSeconds:5,maxDurationSeconds:7},
  otherVehicle:{speedMultiplier:.65,accelerationMultiplier:.50,steeringMultiplier:.82,durationSeconds:4,maxDurationSeconds:6},
} as const;


export const ADHESIVE_PLAYER_BALANCE={
  exposureBreakSeconds:.35,
  stage2ExposureSeconds:.45,
  stage3ExposureSeconds:1.0,
  stage1SpeedMultiplier:.72,
  stage2SpeedMultiplier:.55,
  stage3SpeedMultiplier:.38,
  stage1HoldSeconds:2.5,
  stage2HoldSeconds:3.5,
  stage3HoldSeconds:4.5,
  recoverySeconds:3,
} as const;

export function adhesivePlayerStage(exposureSeconds:number){
  if(exposureSeconds>=ADHESIVE_PLAYER_BALANCE.stage3ExposureSeconds)return 3;
  if(exposureSeconds>=ADHESIVE_PLAYER_BALANCE.stage2ExposureSeconds)return 2;
  return exposureSeconds>0?1:0;
}

export function adhesivePlayerHoldSeconds(stage:number){
  if(stage>=3)return ADHESIVE_PLAYER_BALANCE.stage3HoldSeconds;
  if(stage===2)return ADHESIVE_PLAYER_BALANCE.stage2HoldSeconds;
  return stage===1?ADHESIVE_PLAYER_BALANCE.stage1HoldSeconds:0;
}

export function adhesivePlayerSpeedMultiplier(stage:number,now:number,slowUntil:number,recoveryUntil:number){
  if(stage<=0||now>=recoveryUntil)return 1;
  const base=stage>=3?ADHESIVE_PLAYER_BALANCE.stage3SpeedMultiplier:stage===2?ADHESIVE_PLAYER_BALANCE.stage2SpeedMultiplier:ADHESIVE_PLAYER_BALANCE.stage1SpeedMultiplier;
  if(now<=slowUntil)return base;
  const span=Math.max(.001,recoveryUntil-slowUntil),progress=Math.max(0,Math.min(1,(now-slowUntil)/span));
  return base+(1-base)*progress;
}

export const STRIP_TRAP_VEHICLE_PROFILE={
  motorcycle:{speedMultiplier:.38,accelerationMultiplier:.28,steeringMultiplier:.60,durationSeconds:5.5},
  otherVehicle:{speedMultiplier:.60,accelerationMultiplier:.45,steeringMultiplier:.80,durationSeconds:4},
} as const;

export const WEREWOLF_HUNT_VEHICLE_PROFILE={speedMultiplier:.70,accelerationMultiplier:.75,steeringMultiplier:.80,durationSeconds:2.5} as const;

export const VEHICLE_MIN_SPEED_MULTIPLIER=.22;

export function coneContains(
  sourceX:number,sourceY:number,angle:number,range:number,halfAngleRadians:number,
  targetX:number,targetY:number,targetRadius=0,
){
  const dx=targetX-sourceX,dy=targetY-sourceY,distance=Math.hypot(dx,dy);
  if(distance>range+targetRadius)return false;
  if(distance<=targetRadius+1)return true;
  const targetAngle=Math.atan2(dy,dx);
  const delta=Math.abs(Math.atan2(Math.sin(targetAngle-angle),Math.cos(targetAngle-angle)));
  return delta<=halfAngleRadians+Math.asin(Math.min(1,targetRadius/Math.max(1,distance)));
}

export function aggregateVehicleSlowEffects(effects:readonly VehicleSlowEffect[],now:number):VehicleSlowAggregate{
  const active=effects.filter((effect)=>Number.isFinite(effect.expiresAt)&&effect.expiresAt>now);
  if(!active.length)return{kind:'',speedMultiplier:1,accelerationMultiplier:1,steeringMultiplier:1,expiresAt:0};
  const kinds=new Set(active.map((effect)=>effect.kind));
  return{
    kind:kinds.size>1?'mixed':active[0]!.kind,
    speedMultiplier:Math.max(VEHICLE_MIN_SPEED_MULTIPLIER,Math.min(...active.map((effect)=>effect.speedMultiplier))),
    accelerationMultiplier:Math.min(...active.map((effect)=>effect.accelerationMultiplier)),
    steeringMultiplier:Math.min(...active.map((effect)=>effect.steeringMultiplier)),
    expiresAt:Math.max(...active.map((effect)=>effect.expiresAt)),
  };
}
