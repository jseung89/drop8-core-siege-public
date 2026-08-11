// DROP8_REFACTOR_028_RECURRING_WEREWOLF_RITUAL_CYCLE
// DROP8_REFACTOR_027_OPEN_ARENA_RECURRING_SUPPLY_DROPS
// DROP8_REFACTOR_025_OPEN_ARENA_KILL_LIMIT_MATCH_CYCLE
// DROP8_REFACTOR_024E_OPEN_ARENA_SCOREBOARD_UX
// DROP8_REFACTOR_024D_OPEN_ARENA_PERSISTENT_WORLD
// DROP8_REFACTOR_024C_OPEN_ARENA_RESPAWN
// DROP8_REFACTOR_024B_OPEN_ARENA_LIFECYCLE_HOST_MIGRATION
// DROP8_REFACTOR_024A_OPEN_ARENA_FOUNDATION
// DROP8_REFACTOR_023_AI_SAFE_ZONE_SWEEP_LIVE_SPECTATOR_DIALOGUE
// DROP8_REFACTOR_022_AI_NAVIGATION_TACTICAL_RECOVERY
// DROP8_REFACTOR_021_AI_PERSONA_DIALOGUE
// DROP8_REFACTOR_020_WEREWOLF_PREDATOR_ADHESIVE_BALANCE
// DROP8_REFACTOR_020_AI_VEHICLE_OBJECTIVE_RIVALRY
// DROP8_REFACTOR_019_AI_HUMANIZATION
// DROP8_AI_PATROL_STABILITY_HOTFIX
// DROP8_AI_LARGE_BUILDING_PERIMETER_HOTFIX
// DROP8_REFACTOR_018_WEREWOLF_SEASON
// DROP8_REFACTOR_017_ADHESIVE_STRIP_LOBBY_BAZOOKA_WATER
// DROP8_REFACTOR_015A_SUPPLY_DROP_FLAMETHROWER
// DROP8_REFACTOR_014_PLANE_VISIBILITY_BAZOOKA_SLOT_SWAP
// DROP8_REFACTOR_013H_FIXED_V3_VISIBILITY_ROOF_RIVER_ZONE_SNIPER_AI
// DROP8_REFACTOR_013H_VISIBILITY_ROOF_RIVER_ZONE_SNIPER
// DROP8_REFACTOR_013G_DOCK8_RECOVERY
// DROP8_REFACTOR_013H1_LARGE_NESTED_ROOM_WINDOW_DOCK8_TERRAIN_LOOT
import { Client, CloseCode, Room } from '@colyseus/core';
import { AdhesiveJetState, BulletState, CoreSiegeCampState, CoreSiegeDeviceState, CoreSiegeMinionState, CoreSiegePickupState, CoreSiegePlayerState, CoreSiegeStructureState, CoreSiegeUpgradeState, DominationSiteState, Drop8State, ExplosionState, FireFieldState, FlameJetState, LootState, MotorcycleState, PlayerState, RocketState, SmokeFieldState, StripTrapState, SupplyDropState, TacticalInventoryState, ThrownObjectState } from './schema.js';
import {
// DROP8_REFACTOR_013_INTERIOR_RIVER_DOCK8
  ADHESIVE_PLAYER_BALANCE,
  ADHESIVE_SPRAYER_BALANCE,
  AI_HUMANIZATION,
  aiVisionDistance,
  aiVisionFovRadians,
  turnAngleToward,
  BAZOOKA_BALANCE,
  EMP_EXO_SUIT_BALANCE,
  EXO_PART_COPIES_PER_MAP,
  EXO_SUIT_BALANCE,
  FUSION_ROBOT_BALANCE,
  FUSION_ROBOT_WEAPON_NAMES,
  FLAMETHROWER_BALANCE,
  STUN_GUN_BALANCE,
  STRIP_TRAP_BALANCE,
  STRIP_TRAP_VEHICLE_PROFILE,
  SPIDER_MINE_BALANCE,
  SILVER_CROSSBOW_BALANCE,
  WEREWOLF_BALANCE,
  WEREWOLF_HUNT_VEHICLE_PROFILE,
  SUPPLY_DROP_BALANCE,
  BUSH_FIRE_REVEAL_SECONDS,
  BUSH_HIT_REVEAL_SECONDS,
  BOOMERANG_BALANCE,
  RC_CAR_BALANCE,
  FIRE_TIMING,
  HUNTER_DRONE_BALANCE,
  SMOKE_TIMING,
  THROWABLE_CONFIGS,
  THROWABLE_MAX_CHARGE_MS,
  CHAT_RADIUS,
  CHICKEN_BLASTER_BALANCE,
  CORE_SIEGE_BASIC_ATTACKS,
  CORE_SIEGE_CONFIG,
  CORE_SIEGE_HERO_IDS,
  CORE_SIEGE_HEROES,
  CORE_SIEGE_POSITIONING,
  DOMINATION_CONFIG,
  FALL_START_ALTITUDE,
  GUN_LOOT_MIN_DISTANCE,
  LOOT_DOOR_CLEARANCE,
  LOOT_MIN_DISTANCE,
  LOOT_WALL_CLEARANCE,
  MAX_PLAYERS,
  OPEN_ARENA_LIMITS,
  PVP_QUICK_START_CONFIG,
  QUICK_START_CONFIG,
  MELEE_WEAPONS,
  MOTORCYCLE_BALANCE,
  MOTORCYCLE_DESTRUCTION_BALANCE,
  MOTORCYCLE_COLLISION_COOLDOWN,
  MOTORCYCLE_DIRECT_ACCELERATION,
  MOTORCYCLE_DIRECT_DECELERATION,
  MOTORCYCLE_LAUNCH_SPEED,
  MOTORCYCLE_MAX_SPEED,
  MOTORCYCLE_MAX_TURN_RATE,
  MOTORCYCLE_MOUNT_DISTANCE,
  MOTORCYCLE_RADIUS,
  MOTORCYCLE_ROTATION_RESPONSE,
  MOTORCYCLE_SCOPE_SPEED_RATIO,
  TANK_BALANCE,
  PATCH_RATE_MS,
  PLANE_DURATION,
  PLAYER_BODY_RADIUS,
  PLAYER_HIT_RADIUS,
  PLAYER_SEPARATION_RADIUS,
  PLAYER_SPEED,
  PROJECTILE_CONFIGS,
  RAILGUN_BALANCE,
  LASER_CANNON_BALANCE,
  REGION_LOOT_TABLES,
  SERVER_TICK_RATE,
  SNIPER_SCOPE_MOVE_MULTIPLIER,
  WEAPONS,
  adhesivePlayerHoldSeconds,
  adhesivePlayerSpeedMultiplier,
  adhesivePlayerStage,
  adjustedLootTableForMap,
  chooseWerewolfSeasonPoints,
  bazookaPlayerDamage,
  bazookaVehicleDamage,
  seasonPointStructurallyValid,
  WINDOW_INTERACTION_DISTANCE,
  WINDOW_VAULT_COOLDOWN_MS,
  WINDOW_VAULT_DURATION_MS,
  buildingIdAt,
  buildingSpacesInteractable,
  circleHitsStripTrap,
  circleHitsRect,
  clamp,
  coneContains,
  createInitialZone,
  createNextZone,
  createPlaneRoute,
  createRoomCode,
  createSeededRandom,
  createThrowableMotion,
  coreSiegeAbilityCooldown,
  coreSiegeAbilityPowerMultiplier,
  coreSiegeAreaRepeatMultiplier,
  coreSiegeBasicDamageMultiplier,
  coreSiegeCanUpgradeSkill,
  coreSiegeCrowdControlMultiplier,
  coreSiegeHeroMaxHp,
  coreSiegeHeroMoveMultiplier,
  coreSiegeHeroSlowResistance,
  coreSiegeSmokeTrackerConcealed,
  coreSiegeLayout,
  coreSiegeLevelForXp,
  coreSiegePowerMultiplier,
  coreSiegeRespawnSeconds,
  coreSiegeStructureVulnerable,
  clampCoreSiegeTarget,
  assistedCoreSiegeTarget,
  distance,
  dominationSitesForMap,
  dominationWallsForMap,
  explosionExposureMultiplier,
  fireFieldContains,
  fragPlayerDamage,
  fragVehicleDamage,
  flamethrowerConeContains,
  hunterDronePlayerDamage,
  hunterDroneVehicleDamage,
  rcCarPlayerDamage,
  rcCarVehicleDamage,
  findPortalVaultCandidate,
  portalBuildingIdForSide,
   getMapConfig,
  normalizeMapId,
  normalizeGameMode,
  normalizeCoreSiegeHero,
  normalizeCoreSiegeHumans,
  normalizeCombatTeam,
  normalizeMatchFormat,
  normalizeDominationAiCount,
  normalizeOpenArenaConfig,
  isCoreSiegeMeleeHero,
  quickStartMatchKey,
  isFiniteNumber,
  crossingAt,
  movementMultiplierAt,
  motorcycleCanOccupyWaterPosition,
  riverLandSideAt,
  terrainAt,
  waterSignedDepthAt,
  spaceAt,
  spaceInteractionAllowed,
  traceSpaceVisibility,
  SWIM_ENTER_MARGIN,
  SWIM_EXIT_MARGIN,
  SWIM_SPEED,
  motorcycleCollisionDamage,
  motorcycleExplosionDamage,
  motorcyclePlayerCollisionDamage,
  motorcycleProjectileDamage,
  motorcycleWallCollisionDamage,
  motorcycleDirectionRetention,
  motorcycleSpeedMultiplier,
  motorcycleSpreadRadians,
  normalizeAimVector,
  normalizeMovementInput,
  isThrowableType,
  sanitizeText,
  segmentCircleIntersectionT,
  segmentRectIntersectionT,
  smokeRadiusAt,
  smokeRadiusForBushes,
  smokeVisibilityBetween,
  spiderMinePlayerDamage,
  spiderMineVehicleDamage,
  stripTrapsOverlap,
  stepThrowableMotion,
  visibilitySampleResult,
  weightedLootChoice,
  werewolfDamage,
  werewolfSpeed,
  type AiDialogueCategory,
  type AiDialogueLineId,
  type AmmoType,
  type Building,
  type Difficulty,
  type EquippedId,
  type ExoSuitKind,
  type FusionRobotWeaponSlot,
  type LootKind,
  type MapConfig,
  type MapId,
  type MapSizeMode,
  type GameMode,
  type CombatTeam,
  type CoreSiegeAbilitySlot,
  type CoreSiegeHeroId,
  type CoreSiegeUpgradeKind,
  type MatchFormat,
  type OpenArenaConfig,
  type OpenArenaKillLimit,
  type OpenArenaLifecycle,
  type MeleeId,
  type RegionId,
  type ThrowableType,
  type WeaponId,
  type VehicleSlowKind,
  type VehicleSlowProfile,
  type WerewolfEndReason,
  type ZoneSpeed,
} from '@drop8/shared';
import { VehicleStatusManager } from './vehicleStatus.js';
import { aiGoalContractSeconds, aiGoalFailureCooldownSeconds, aiLootCommitmentBonus, blockAiExecutiveGoal, createAiExecutiveMemory, finishAiExecutiveGoal, isAiExecutiveGoalBlocked, pruneAiExecutiveMemory, requestAiGoalTransition, summarizeAiExecutives, type AiExecutiveMemory, type AiGoalOutcome } from './aiExecutive.js';
import { aiCombatTargetCommitSeconds, clearAiCombatCover, commitAiCombatPosture, commitAiCombatTarget, createAiCombatMemory, decideAiCombatPosture, isAiCombatTargetCommitted, recallAiCombatCover, rememberAiCombatCover, type AiCombatMemory } from './aiCombatBrain.js';
import { AI_VEHICLE_BRAIN, aiVehicleArrivalRadius, aiVehicleRecoveryDecision, aiVehicleShouldBrake, canAiVehicleCombatDismount, canStartAiVehiclePlan, canUseAiVehicle, createAiVehicleMemory, pruneAiVehicleMemory, recordAiVehicleExit, recordAiVehicleMount, recordAiVehicleRecovery, shouldAiVehicleKeepPatrolling, type AiVehicleExitReason, type AiVehicleMemory } from './aiVehicleBrain.js';
import { createAiTacticalMemory, decideAiTacticalAction, recordAiTacticalAction, type AiTacticalMemory } from './aiTacticalBrain.js';
import { aiResourceTargetCommitment, chooseAiResourceFocus, commitAiResourceTarget, createAiResourceMemory, isAiResourceUrgent, recordAiResourcePickup, scoreAiResourceCandidate, scoreAiSupplyObjective, type AiResourceCategory, type AiResourceContext, type AiResourceMemory } from './aiResourceBrain.js';
import { aiDangerScoreAt, aiExperienceSummary, createAiExperienceMemory, recordAiDanger, type AiDangerKind, type AiExperienceMemory } from './aiExperienceBrain.js';
import { aiRoleObjectiveBonus, aiRolePlan, aiRoleResourceBonus } from './aiRoleBrain.js';
import { aiArenaDirectorSummary, aiArenaDirectorWaypoint, createAiArenaDirectorMemory, isAiArenaInterventionActive, maybeStartAiArenaIntervention, recordAiArenaCombat, shouldAiJoinArenaIntervention, type AiArenaDirectorMemory } from './aiArenaDirector.js';
import { aiLocomotionEfficiency, aiLocomotionSummary, chooseAiMovement, createAiLocomotionMemory, recordAiLocomotionPosition, type AiLocomotionMemory, type AiMovementCandidate } from './aiLocomotionBrain.js';
import { AI_COMBAT_TACTICS, aiCombatTargetScore, awarenessForState, createAiMemory, createAiProfile, estimateSoundPoint, finishAiBurstShot, pickDialogue, prepareAiBurst, prepareAiReaction, refreshAiAim, shouldSwitchAiTarget, type AiHumanMemory, type AiPersonalityProfile, type AiSoundKind } from './aiHumanization.js';
import { AI_PERSONA_NAMES, aiDialogueProfileForName, aiPersonaEventFromLegacy, selectAiPersonaLine, selectAiPersonaResponse, type AiPersonaEvent, type AiPersonaLine } from './aiDialogueProfiles.js';
import { AI_NAVIGATION_RECOVERY, AI_SAFE_ZONE_SWEEP, aiDialogueAudience, aiSweepDetourMetrics, createAiSafeZoneSweepTarget, detectAiOscillation, nextAiStallSeconds, pushAiProgressSample, shouldTakeAiSweepLoot, type AiGoalKind, type AiProgressSample, type AiSweepZone } from './aiNavigation.js';
import { chooseOpenArenaSpawn, type OpenArenaAiSlot, type RecentArenaSpawn } from './openArenaRespawn.js';
import { OPEN_ARENA_ROUND_COUNTDOWN_SECONDS, OPEN_ARENA_ROUND_TOTAL_SECONDS, shouldFinishOpenArenaRound, sortOpenArenaHumanRows, sortOpenArenaRows, type ArenaScoreRow, type OpenArenaRoundState } from './openArenaRound.js';
import { OPEN_ARENA_DROP_TTL_SECONDS, OPEN_ARENA_FUSION_PARTS_SUPPLY_SEQUENCE, OPEN_ARENA_MAX_ACTIVE_SUPPLY_DROPS, OPEN_ARENA_RITUAL_ACTIVE_SECONDS, OPEN_ARENA_RITUAL_COMPLETION_SECONDS, OPEN_ARENA_RITUAL_COOLDOWN_SECONDS, OPEN_ARENA_RITUAL_FIRST_DELAY_SECONDS, OPEN_ARENA_RITUAL_SUPPLY_CLEARANCE, OPEN_ARENA_RITUAL_WARNING_SECONDS, OPEN_ARENA_SUPPLY_DROP_FIRST_DELAY_SECONDS, OPEN_ARENA_SUPPLY_DROP_INTERVAL_SECONDS, OPEN_ARENA_SUPPLY_DROP_RETRY_SECONDS, OPEN_ARENA_VEHICLE_RESPAWN_SECONDS, OPEN_ARENA_WORLD_CLEANUP_INTERVAL_SECONDS, arenaLootRespawnSeconds, type ArenaLootSlot, type ArenaVehicleSlot } from './openArenaWorld.js';

const TANK_CANNON_BALANCE={
  cooldownSeconds:1.85,
  projectileSpeed:760,
  range:760,
  projectileRadius:10,
  muzzleOffset:70,
  explosionRadius:172,
  directVehicleDamage:250,
  splashVehicleMinDamage:58,
  directPlayerDamage:92,
  splashPlayerMinDamage:18,
  ownerMaxDamage:24,
  knockback:430,
  structureDamage:90,
} as const;

const TANK_COUNTER_BALANCE={
  stripTrapDamage:180,
} as const;

type Input = { x:number; y:number; aimX:number; aimY:number; angle:number; seq:number; aiming:boolean; huntSprint:boolean; accelerate:boolean; brake:boolean; turnLeft:boolean; turnRight:boolean };
type Point = { x:number; y:number };
type AiRoutePoint = Point & { kind?:'window'; windowId?:string; targetX?:number; targetY?:number; targetBuildingId?:string; targetRoomIndex?:number };
type AiRouteEdge = { to:number; cost:number; kind:'move'|'window'; windowId?:string; targetBuildingId?:string; targetRoomIndex?:number };
type AiMode = 'move'|'retreat'|'hold';
type AiObjectiveKind='loot'|'supply'|'altar'|'tank'|'zone'|'patrol';
type AiVehiclePhase='seek'|'drive'|'walk'|'return'|'ritual';
type AiWorldObjective={kind:'supply'|'altar';id:string;x:number;y:number;expiresAt:number};
type AiVehiclePlan={
  vehicleId:string;
  preferredVehicleId:string;
  phase:AiVehiclePhase;
  objectiveKind:AiObjectiveKind;
  objectiveId:string;
  targetX:number;
  targetY:number;
  startedAt:number;
  expiresAt:number;
  avoidSign:number;
  stuckFor:number;
  reverseUntil:number;
  lastX:number;
  lastY:number;
  phaseStartedAt?:number;
  mountedAt?:number;
  recoveryAttempts?:number;
  lastRecoveryAt?:number;
  braking?:boolean;
  patrolGeneration?:number;
};
type AiIntent = {
  tx:number;
  ty:number;
  targetId:string;
  lootId:string;
  mode:AiMode;
  state:string;
  avoidSign:number;
  stuckFor:number;
  lastX:number;
  lastY:number;
  route:AiRoutePoint[];
  lastSeenX:number;
  lastSeenY:number;
  lastSeenUntil:number;
  routeGoalX:number;
  routeGoalY:number;
  repathAt:number;
  failedWindowId:string;
  failedWindowUntil:number;
  stuckCount:number;
  lastRepathReason:string;
  goalKind:AiGoalKind;
  goalKey:string;
  goalLockedUntil:number;
  executive:AiExecutiveMemory;
  failedGoalKey:string;
  failedGoalUntil:number;
  lastGoalDistance:number;
  progressSamples:AiProgressSample[];
  lastProgressSampleAt:number;
  oscillationCount:number;
  swimExitId:string;
  swimExitLockedUntil:number;
  failedShoreExitId:string;
  failedShoreExitUntil:number;
  combatStrafeSign:number;
  combatStrafeUntil:number;
  combatHoldStartedAt:number;
  combatBlockedFor:number;
  sweepTargetX:number;
  sweepTargetY:number;
  sweepStartedAt:number;
  sweepExpiresAt:number;
  sweepZoneSignature:string;
  sweepGeneration:number;
  sweepKey:string;
  sweepSector:number;
  itemDetourActive:boolean;
};
type HealKind = 'bandage'|'medkit';
type HealJob = { at:number; startedAt:number; duration:number; amount:number; kind:HealKind };
type ReloadJob = { at:number; startedAt:number; duration:number; weapon:WeaponId };
type Noise = { id:string; x:number; y:number; at:number; owner:string; kind:AiSoundKind; radius:number; danger:number };
type AiDialogueEmitOptions={casual?:boolean;loggable?:boolean;allowResponse?:boolean;force?:boolean};
type PendingAiDialogueResponse={at:number;speakerId:string;responderId:string;depth:number};
type LootReservation={aiId:string;expiresAt:number;lastDistance:number};
type SafePoint={x:number;y:number;mapId:string;buildingId:string;roomIndex:number;recordedAt:number};
type StuckState={lastX:number;lastY:number;movingSince:number;lastRecoveryAt:number};
type VehicleStuckState={lastX:number;lastY:number;stuckFor:number;lastRecoveryAt:number};
type VehicleMotionState={movementHeldMs:number;previousInputX:number;previousInputY:number;mountedAt:number;directionPenaltyUntil:number};
type AdhesiveExposure={ownerId:string;accumulated:number;lastHitAt:number};
type WerewolfAuraContact={startedAt:number;lastAt:number};
type BoomerangFlight={hitIds:Set<string>;targetId:string;returning:boolean};
type DamageKind='bullet'|'explosion'|'silver'|'melee'|'fire'|'zone'|'vehicle'|'other';
type CoreSiegeAreaDamageGroup='grenade'|'sticky'|'barrage'|'gravity'|'rcCar';
type CoreSiegeAreaJob={
  id:string;
  ownerId:string;
  kind:'grenade'|'sticky'|'adhesive';
  x:number;
  y:number;
  radius:number;
  detonatesAt:number;
  expiresAt:number;
  nextTickAt:number;
  power:number;
  damageGroup?:CoreSiegeAreaDamageGroup;
};
type CoreSiegeDashJob={
  ownerId:string;
  startX:number;
  startY:number;
  endX:number;
  endY:number;
  startedAt:number;
  duration:number;
  damage:number;
  power:number;
  angle:number;
  hitPlayerIds:Set<string>;
  hitMinionIds:Set<string>;
  style:'wolf'|'shield'|'steel'|'iron'|'grapple'|'hammer'|'blade'|'bladeUltimate'|'position';
  positionStyle?:string;
  remaining:Array<{x:number;y:number}>;
};
type CoreSiegeChainPullJob={
  ownerId:string;
  targetId:string;
  targetKind:'player'|'minion';
  latchAt:number;
  pullStartedAt:number;
  pullDuration:number;
  pullStartX:number;
  pullStartY:number;
  rank:number;
  power:number;
  latched:boolean;
};
type CoreSiegeAttackProjectileJob={
  id:string;
  kind:'minionBullet'|'minionShell'|'towerShell';
  sourceId:string;
  targetId:string;
  targetKind:'player'|'minion'|'device'|'structure';
  team:string;
  damage:number;
  launchedAt:number;
  impactAt:number;
  x1:number;y1:number;x2:number;y2:number;
};
type CoreSiegeSpinJob={
  ownerId:string;
  endsAt:number;
  nextHitAt:number;
  power:number;
  rank:number;
  hitCounts:Map<string,number>;
};
type CoreSiegeWaveJob={
  id:string;
  ownerId:string;
  x:number;
  y:number;
  angle:number;
  radius:number;
  speed:number;
  damage:number;
  power:number;
  expiresAt:number;
  hitIds:Set<string>;
};
type CoreSiegeVolleyJob={ownerId:string;weaponId:WeaponId;angle:number;remaining:number;nextAt:number;interval:number;spread:number;damageMultiplier:number;endsAt:number;interruptible:boolean};
type CoreSiegeAbilityStageJob={heroId:CoreSiegeHeroId;slot:1|2;targetId:string;expiresAt:number};
type CoreSiegeCableJob={ownerId:string;targetId:string;expiresAt:number;breakDistance:number;damage:number;power:number};
type CoreSiegeSummonOrder={x:number;y:number;targetId:string;expiresAt:number};
type CoreSiegeHuntMark={targetId:string;expiresAt:number};
type CoreSiegeExecutionZone={targetId:string;power:number;rank:number};
type CoreSiegeSummonTarget=PlayerState|CoreSiegeMinionState|CoreSiegeStructureState|CoreSiegeDeviceState;
type CoreSiegeAiTarget={
  kind:'minion'|'structure'|'pickup'|'summon';
  id:string;
  x:number;
  y:number;
  radius:number;
};
type CoreSiegeAiRole='front'|'back'|'support'|'flank';
type Drop8RoomMetadata={roomCode:string;hostName:string;players:number;humans:number;spectators:number;phase:'LOBBY'|'PLANE'|'DROP'|'ACTIVE'|'FINISHED';fillAi:boolean;publicRoom:boolean;mapSizeMode:MapSizeMode;mapDisplayName:string;createdAt:number;updatedAt:number;gameMode:GameMode;matchFormat:MatchFormat;maxHumans:number;configuredAiCount:number;spectatorOnly:boolean;joinInProgress:boolean;lifecycle:'lobby'|'active'|'emptyGrace'|'disposed';killLimit:OpenArenaKillLimit;roundState:OpenArenaRoundState;quickStart:boolean;quickMatchKey:string};
type VaultJob={startX:number;startY:number;targetX:number;targetY:number;startedAt:number;duration:number;windowId:string;targetBuildingId:string;targetRoomIndex:number;startBuildingId:string;startRoomIndex:number;transitioned:boolean};
type JoinOptions = {
  nickname?:unknown;
  password?:unknown;
  fillAi?:boolean;
  difficulty?:Difficulty;
  zoneSpeed?:ZoneSpeed;
  roomPassword?:unknown;
  publicRoom?:boolean;
  mapSizeMode?:MapSizeMode;
  mapId?:MapId;
  gameMode?:unknown;
  maxHumans?:unknown;
  aiCount?:unknown;
  killLimit?:unknown;
  quickStart?:unknown;
  quickStartPreset?:unknown;
  quickMatchKey?:unknown;
  matchFormat?:unknown;
  teamAiBlue?:unknown;
  teamAiRed?:unknown;
  practiceMode?:unknown;
  heroId?:unknown;
};

const AI_NAMES=[...AI_PERSONA_NAMES];
// DROP8_REFACTOR_012A_SMOKE_MOTORCYCLE_AI_NAV
// DROP8_REFACTOR_012A1_TEST_FIXTURE_CLEANUP
const AI_NAV_DEBUG=false;
const AI_HUMAN_DEBUG=process.env.DROP8_AI_DEBUG==='1';

export class Drop8Room extends Room<{ state: Drop8State; metadata: Drop8RoomMetadata }> {
  maxClients=MAX_PLAYERS;
  state=new Drop8State();

  private inputs=new Map<string,Input>();
  private shotAt=new Map<string,number>();
  private laserChargeCuePlayed=new Set<string>();
  private reloadUntil=new Map<string,ReloadJob>();
  private healUntil=new Map<string,HealJob>();
  private aiThinkAt=new Map<string,number>();
  private aiIntent=new Map<string,AiIntent>();
  private aiSwitchAt=new Map<string,number>();
  private aiLandedAt=new Map<string,number>();
  private aiDefendUntil=new Map<string,number>();
  private aiProfiles=new Map<string,AiPersonalityProfile>();
  private aiMemories=new Map<string,AiHumanMemory>();
  private aiLineCooldown=new Map<string,number>();
  private aiGlobalDialogueAt=-99;
  private aiDialogueResponses:PendingAiDialogueResponse[]=[];
  private aiDialogueSequence=0;
  private aiMovementSamples=new Map<string,{x:number;y:number;at:number}>();
  private aiLocomotionBrains=new Map<string,AiLocomotionMemory>();
  private aiMovementNoiseAt=0;
  private aiCombatBrains=new Map<string,AiCombatMemory>();
  private aiVehiclePlans=new Map<string,AiVehiclePlan>();
  private aiVehicleMemories=new Map<string,AiVehicleMemory>();
  private aiWorldObjectives=new Map<string,AiWorldObjective>();
  private aiObjectiveCooldown=new Map<string,number>();
  private aiTacticalAt=new Map<string,number>();
  private aiTacticalBrains=new Map<string,AiTacticalMemory>();
  private aiResourceBrains=new Map<string,AiResourceMemory>();
  private aiExperienceBrains=new Map<string,AiExperienceMemory>();
  private aiArenaDirector:AiArenaDirectorMemory=createAiArenaDirectorMemory();
  private aiRobotDecision=new Map<string,'assault'|'emp'|'fusion'>();
  private aiBrainTickSamples:number[]=[];
  private aiBrainTelemetryAt=0;
  private aiNoiseSeq=0;
  private lootReservations=new Map<string,LootReservation>();
  private bushRevealUntil=new Map<string,number>();
  private lastSafePositions=new Map<string,SafePoint>();
  private stuckStates=new Map<string,StuckState>();
  private knockback=new Map<string,{vx:number;vy:number}>();
  private chatAt=new Map<string,number>();
  private noises:Noise[]=[];
  private password='';
  private gameMode:GameMode='battleRoyale';
  private practiceMode=false;
  private practiceHeroId:CoreSiegeHeroId='vanguard';
  private practiceTargetMode:'hold'|'move'|'attack'='hold';
  private practiceTargetInvulnerable=false;
  private matchFormat:MatchFormat='solo';
  private teamAiBlue=0;
  private teamAiRed=0;
  private openArenaConfig:OpenArenaConfig|undefined;
  private quickStart=false;
  private quickMatchKey='';
  private boomerangFlights=new Map<string,BoomerangFlight>();
  private openArenaLifecycle:OpenArenaLifecycle='active';
  private humanJoinedAt=new Map<string,number>();
  private arenaSpectators=new Map<string,{name:string;joinedAt:number}>();
  private openArenaEmptyGraceUntil=0;
  private openArenaDisposeRequested=false;
  private humanRespawnAt=new Map<string,number>();
  private spawnProtectionUntil=new Map<string,number>();
  private openArenaDeaths=new Map<string,number>();
  private openArenaAiSlots=new Map<string,OpenArenaAiSlot>();
  private recentArenaSpawns:RecentArenaSpawn[]=[];
  private arenaLootSlots=new Map<string,ArenaLootSlot>();
  private arenaLootToSlot=new Map<string,string>();
  private arenaDropExpiresAt=new Map<string,number>();
  private arenaVehicleSlots=new Map<string,ArenaVehicleSlot>();
  private arenaWorldCleanupAt=0;
  private openArenaNextSupplyDropAt=0;
  private openArenaSupplyDropCount=0;
  private openArenaNextRitualWarningAt=0;
  private openArenaRitualActiveEndsAt=0;
  private openArenaLastRitualPoint:Point|null=null;
  private arenaKillStreak=new Map<string,number>();
  private arenaBestStreak=new Map<string,number>();
  private arenaHumanKills=new Map<string,number>();
  private arenaAiKills=new Map<string,number>();
  private arenaScoreboardAt=0;
  private openArenaRoundState:OpenArenaRoundState='active';
  private openArenaRoundEndsAt=0;
  private openArenaRoundResettingAt=0;
  private openArenaRoundGeneration=0;
  private openArenaRoundWinnerId='';
  private openArenaRoundRows:ArenaScoreRow[]=[];
  private openArenaTeamKills={blue:0,red:0};
  private arenaKillReachedAt=new Map<string,number>();
  private dominationScoreAt=0;
  private dominationWallMapId='';
  private dominationWallRects:Array<{x:number;y:number;w:number;h:number}>=[];
  private dominationCollisionRectsCache:MapConfig['collisionObstacles']=[];
  private dominationBulletRectsCache:MapConfig['bulletObstacles']=[];
  private elapsed=0;
  private bulletSeq=0;
  private rocketSeq=0;
  private lootSeq=0;
  private fusionRobotSeq=0;
  private planeStart={x:0,y:0};
  private planeEnd={x:4096,y:4096};
  private lootRandom:()=>number=Math.random;
  private zoneShrinkDuration=28;
  private readonly firstZoneAnnouncementSeconds=15;
  private tickSamples:number[]=[];
  private perfLastPublish=0;
  private registryLastSync=0;
  private registrySyncQueue:Promise<void>=Promise.resolve();
  private createdAt=Date.now();
  private exitReasons=new Map<string,'left'|'kicked'>();
  private bulletRemoveQueue=new Set<string>();
  private vehicleCollisionAt=new Map<string,number>();
  private vehicleStuckStates=new Map<string,VehicleStuckState>();
  private vehicleMotionStates=new Map<string,VehicleMotionState>();
  private vaultJobs=new Map<string,VaultJob>();
  private vaultCooldownUntil=new Map<string,number>();
  private vehicleWallDamageAt=new Map<string,number>();
  private vehicleShotDamage=new Map<string,{damage:number;expiresAt:number}>();
  private vehicleAttackerAt=new Map<string,number>();
  private tankCannonAt=new Map<string,number>();
  private tankEmptyNoticeAt=new Map<string,number>();
  private explosionSeq=0;
  private audioEventSeq=0;
  private throwableSeq=0;
  private smokeSeq=0;
  private fireSeq=0;
  private flameSeq=0;
  private adhesiveSeq=0;
  private adhesivePuddleSeq=0;
  private stripTrapSeq=0;
  private spiderMineSeq=0;
  private supplySeq=0;
  private tankKeyRespawnAt=0;
  private flameDamageAt=new Map<string,number>();
  private adhesiveExposure=new Map<string,AdhesiveExposure>();
  private adhesivePlayerExposure=new Map<string,AdhesiveExposure>();
  private adhesivePuddleAt=new Map<string,number>();
  private werewolfAuraDamageAt=new Map<string,number>();
  private werewolfAuraVehicleContact=new Map<string,WerewolfAuraContact>();
  private vehicleStatus=new VehicleStatusManager();
  private throwPrepareAt=new Map<string,number>();
  private hunterDroneShieldAt=new Map<string,number>();
  private nextFireTickAt=0;
  private werewolfMoveVectors=new Map<string,{x:number;y:number}>();
  private exoBombAt=new Map<string,number>();
  private exoLaserAt=new Map<string,number>();
  private empExoGunAt=new Map<string,number>();
  private testCheatAt=new Map<string,number>();
  private testCheatLootIds=new Map<string,string[]>();
  private coreSiegeMinionSeq=0;
  private coreSiegeUpgradeSeq=0;
  private coreSiegeAbilitySeq=0;
  private coreSiegeAreaJobs=new Map<string,CoreSiegeAreaJob>();
  private coreSiegeDashJobs=new Map<string,CoreSiegeDashJob>();
  private coreSiegeChainPullJobs=new Map<string,CoreSiegeChainPullJob>();
  private coreSiegeAttackProjectiles=new Map<string,CoreSiegeAttackProjectileJob>();
  private coreSiegeChainComboTargets=new Map<string,{targetId:string;expiresAt:number}>();
  private coreSiegeSpinJobs=new Map<string,CoreSiegeSpinJob>();
  private coreSiegeWaveJobs=new Map<string,CoreSiegeWaveJob>();
  private coreSiegeSummonOrders=new Map<string,CoreSiegeSummonOrder>();
  private coreSiegeHuntMarks=new Map<string,CoreSiegeHuntMark>();
  private coreSiegeExecutionZones=new Map<string,CoreSiegeExecutionZone>();
  private coreSiegeMeleeCombos=new Map<string,{step:number;expiresAt:number}>();
  private coreSiegeAiAbilityAt=new Map<string,number>();
  private coreSiegeAreaHitWindows=new Map<string,{expiresAt:number;hits:Map<string,number>}>();
  private coreSiegePersistentDamageAt=new Map<string,number>();
  private coreSiegeMeleeShieldReadyAt=new Map<string,number>();
  private coreSiegeCrowdControl=new Map<string,{expiresAt:number;hits:number}>();
  private coreSiegeAiTeamUltimateReadyAt=new Map<string,number>();
  private coreSiegePositioningLockedUntil=new Map<string,number>();
  private coreSiegeVolleyJobs=new Map<string,CoreSiegeVolleyJob>();
  private coreSiegeAbilityStages=new Map<string,CoreSiegeAbilityStageJob>();
  private coreSiegeCableJobs=new Map<string,CoreSiegeCableJob>();
  private coreSiegeJetTargetReadyAt=new Map<string,number>();
  private coreSiegeMeleeSkillCombos=new Map<string,{count:number;expiresAt:number}>();
  private coreSiegeSpotterRounds=new Map<string,number>();
  private coreSiegeBarrageSlowUntil=new Map<string,number>();

  private get map():MapConfig{return getMapConfig(this.state.mapId);}
  private get worldWidth(){return this.map.width;}
  private get worldHeight(){return this.map.height;}
  private get worldSize(){return this.map.width;}
  private arenaLike(){return this.gameMode!=='battleRoyale';}
  private dominationWalls(){if(this.gameMode!=='domination')return[];if(this.dominationWallMapId!==this.map.id){this.dominationWallMapId=this.map.id;this.dominationWallRects=dominationWallsForMap(this.map.width,this.map.height);this.dominationCollisionRectsCache=[...this.map.collisionObstacles,...this.dominationWallRects];this.dominationBulletRectsCache=[...this.map.bulletObstacles,...this.dominationWallRects];}return this.dominationWallRects;}
  private collisionRects(){if(this.practiceMode)return[];if(this.gameMode!=='domination')return this.map.collisionObstacles;this.dominationWalls();return this.dominationCollisionRectsCache;}
  private bulletRects(){if(this.practiceMode)return[];if(this.gameMode!=='domination')return this.map.bulletObstacles;this.dominationWalls();return this.dominationBulletRectsCache;}

  async onCreate(options:JoinOptions) {
    let code=createRoomCode();
    for(let i=0;i<8 && await this.presence.get(`drop8:${code}`);i++)code=createRoomCode();
    await this.presence.setex(`drop8:${code}`,'1',60*60*8);
    this.roomId=code;
    this.state.roomCode=code;
    this.gameMode=normalizeGameMode(options.gameMode);
    this.practiceMode=this.gameMode==='coreSiege'&&options.practiceMode===true;
    this.practiceHeroId=normalizeCoreSiegeHero(options.heroId);
    this.matchFormat=this.gameMode==='domination'||this.gameMode==='coreSiege'?'teams':normalizeMatchFormat(options.matchFormat);
    const requestedAi=Math.max(0,Math.min(OPEN_ARENA_LIMITS.maxAi,Math.trunc(Number(options.aiCount)||0)));
    this.teamAiBlue=Math.max(0,Math.min(8,Math.trunc(Number(options.teamAiBlue)||Math.ceil(requestedAi/2))));
    this.teamAiRed=Math.max(0,Math.min(8,Math.trunc(Number(options.teamAiRed)||Math.floor(requestedAi/2))));
    this.openArenaConfig=this.gameMode==='domination'
      ?normalizeOpenArenaConfig(DOMINATION_CONFIG.maxHumans,normalizeDominationAiCount(options.aiCount),0)
      :this.gameMode==='coreSiege'
        ?normalizeOpenArenaConfig(this.practiceMode?1:normalizeCoreSiegeHumans(options.maxHumans),this.practiceMode?0:requestedAi,0)
        :this.gameMode==='openArena'?normalizeOpenArenaConfig(options.maxHumans,options.aiCount,options.killLimit):undefined;
    this.maxClients=this.practiceMode?1:this.openArenaConfig?.spectatorOnly?OPEN_ARENA_LIMITS.spectatorSlots:this.openArenaConfig?.maxHumans??MAX_PLAYERS;
    if(this.arenaLike())this.autoDispose=false;
    this.state.fillAi=this.arenaLike()?(this.openArenaConfig?.configuredAiCount??0)>0:options.fillAi!==false;
    this.state.publicRoom=!this.practiceMode&&options.publicRoom!==false;
    this.state.difficulty=options.difficulty??'normal';
    this.state.zoneSpeed=options.zoneSpeed??'normal';
    this.state.mapId=this.gameMode==='domination'?DOMINATION_CONFIG.mapId:this.gameMode==='coreSiege'?CORE_SIEGE_CONFIG.mapId:normalizeMapId(options.mapId??options.mapSizeMode);
    this.state.mapSizeMode=this.state.mapId;
    const quickStartPreset=options.quickStartPreset==='pvp'?'pvp':'mixed';
    const quickStartConfig=quickStartPreset==='pvp'?PVP_QUICK_START_CONFIG:QUICK_START_CONFIG;
    const expectedQuickMatchKey=quickStartMatchKey(this.state.mapId,quickStartPreset);
    this.quickStart=this.gameMode==='openArena'
      &&this.openArenaConfig?.maxHumans===quickStartConfig.maxHumans
      &&this.openArenaConfig.configuredAiCount===quickStartConfig.aiCount
      &&this.openArenaConfig.killLimit===quickStartConfig.killLimit
      &&options.quickStart===true
      &&options.quickMatchKey===expectedQuickMatchKey;
    this.quickMatchKey=this.quickStart?expectedQuickMatchKey:'';
    this.state.worldSize=this.map.width;
    this.password=sanitizeText(options.roomPassword,32);
    this.patchRate=PATCH_RATE_MS;
    this.setSimulationInterval((dt)=>this.tick(dt/1000),1000/SERVER_TICK_RATE);

    this.onMessage('ready',(c)=>this.ready(c));
    this.onMessage('selectTeam',(c,m)=>this.selectTeam(c,m));
    this.onMessage('selectSiegeHero',(c,m)=>this.selectCoreSiegeHero(c,m));
    this.onMessage('upgradeCoreSiegeAbility',(c,m)=>this.upgradeCoreSiegeAbility(c,m));
    this.onMessage('useCoreSiegeAbility',(c,m)=>this.useCoreSiegeAbility(c,m));
    this.onMessage('useCoreSiegePositioning',(c,m)=>this.useCoreSiegePositioning(c,m));
    this.onMessage('coreSiegeSkillLab',(c,m)=>this.coreSiegeSkillLab(c,m));
    this.onMessage('coreSiegePractice',(c,m)=>this.coreSiegePractice(c,m));
    this.onMessage('settings',(c,m)=>this.settings(c,m));
    this.onMessage('start',(c)=>this.start(c));
    this.onMessage('input',(c,m)=>this.input(c,m));
    this.onMessage('jump',(c)=>this.jump(c));
    this.onMessage('vaultWindow',(c)=>this.vaultWindow(c));
    this.onMessage('fire',(c,m)=>this.fire(c,m));
    this.onMessage('laserCannonChargeStart',(c)=>this.startLaserCannonChargeForClient(c));
    this.onMessage('laserCannonChargeRelease',(c,m)=>this.releaseLaserCannonChargeForClient(c,m));
    this.onMessage('laserCannonChargeCancel',(c)=>{const p=this.state.players.get(c.sessionId);if(p)this.cancelLaserCannonCharge(p);});
    this.onMessage('laserCannonChargeCue',(c)=>{const p=this.state.players.get(c.sessionId),tactical=p?this.tacticalInventory(p.id):undefined;if(p&&tactical?.laserCannonCharging&&!this.laserChargeCuePlayed.has(p.id)&&this.now()-tactical.laserCannonChargeStartedAt>=.15){this.laserChargeCuePlayed.add(p.id);this.emitAudioEvent('laser_charge',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'laser_cannon',sequence:p.attackSeq});}});
    this.onMessage('melee',(c)=>this.melee(c));
    this.onMessage('reload',(c)=>this.reload(c));
    this.onMessage('interact',(c)=>this.interact(c));
    this.onMessage('pickup',(c)=>this.pickup(c));
    this.onMessage('switch',(c,m)=>this.switchWeapon(c,m));
    this.onMessage('swapWeaponSlots',(c,m)=>this.swapWeaponSlots(c,m));
    this.onMessage('dropWeapon',(c,m)=>this.dropWeapon(c,m));
    this.onMessage('throwPrepare',(c)=>this.prepareThrow(c));
    this.onMessage('throwCancel',(c)=>this.cancelThrowForClient(c));
    this.onMessage('throw',(c,m)=>this.throwEquipped(c,m));
    this.onMessage('placeStripTrap',(c)=>this.placeStripTrap(c));
    this.onMessage('placeSpiderMine',(c)=>this.placeSpiderMine(c));
    this.onMessage('launchHunterDrones',(c)=>this.launchHunterDrones(c));
    this.onMessage('activateExoSuit',(c)=>this.activateExoSuit(c,'assault'));
    this.onMessage('activateEmpExoSuit',(c)=>this.activateExoSuit(c,'emp'));
    this.onMessage('activateFusionRobot',(c)=>this.activateFusionRobot(c));
    this.onMessage('exoBomb',(c,m)=>this.fireExoBomb(c,m));
    this.onMessage('exoLaser',(c,m)=>this.fireExoLaser(c,m));
    this.onMessage('empExoMachineGun',(c,m)=>this.fireEmpExoMachineGun(c,m));
    this.onMessage('empExoPulse',(c)=>this.fireEmpExoPulse(c));
    this.onMessage('spawnRobotPartsCheat',(c)=>this.spawnRobotPartsCheat(c));
    this.onMessage('werewolfRitualStart',(c)=>this.werewolfRitualStart(c));
    this.onMessage('werewolfRitualCancel',(c)=>this.werewolfRitualCancel(c));
    this.onMessage('werewolfTransform',(c)=>this.werewolfTransform(c));
    this.onMessage('heal',(c,m)=>this.heal(c,m));
    this.onMessage('chat',(c,m)=>this.chat(c,m));
    this.onMessage('kick',(c,m)=>this.kick(c,m));
    this.onMessage('requestRoomConfig',(c)=>{
      c.send('roomConfig',this.roomConfigPayload());
      if(this.arenaLike()){
        c.send('arenaStatus',this.arenaStatusPayload());
        c.send('arenaScoreboard',this.openArenaScoreboardPayload());
      }
    });
    this.onMessage('ping',(c,m)=>c.send('pong',{t:Number(m?.t)||Date.now(),serverTime:Date.now()}));
    this.onMessage('rematch',(c)=>{
      if(this.state.phase==='FINISHED'&&this.state.players.get(c.sessionId)?.host)this.resetLobby();
    });
    this.syncRoomRegistry();
  }

  onAuth(_client:Client,options:JoinOptions){
    if(this.password&&sanitizeText(options.password,32)!==this.password)throw new Error('비밀번호가 맞지 않습니다.');
    if(this.arenaLike()){
      if(this.openArenaLifecycle!=='active')throw new Error('이 전장은 종료 중이라 새로 난입할 수 없습니다.');
      if(this.openArenaConfig?.spectatorOnly)return true;
      const humans=[...this.state.players.values()].filter((player)=>!player.ai).length;
      if(humans>=(this.openArenaConfig?.maxHumans??OPEN_ARENA_LIMITS.maxHumans))throw new Error('인간 플레이어 정원이 가득 찼습니다.');
    }else if(this.state.phase!=='LOBBY')throw new Error('진행 중인 배틀로얄에는 참가할 수 없습니다.');
    return true;
  }

  onJoin(client:Client,options:JoinOptions){
    if(this.openArenaConfig?.spectatorOnly){
      const name=sanitizeText(options.nickname,16)||`관전자${this.arenaSpectators.size+1}`;
      this.arenaSpectators.set(client.sessionId,{name,joinedAt:Date.now()});
      client.send('roomConfig',this.roomConfigPayload());
      if(this.state.phase==='LOBBY'){
        this.fillOpenArenaAi();
        this.beginOpenArena();
      }
      client.send('arenaStatus',this.arenaStatusPayload());
      client.send('arenaScoreboard',this.openArenaScoreboardPayload());
      this.system(`${name}님이 AI 자동전투 관전에 입장했습니다.`);
      this.syncRoomRegistry();
      return;
    }
    const p=new PlayerState();
    p.id=client.sessionId;
    p.name=sanitizeText(options.nickname,16)||`유저${this.clients.length}`;
    p.host=[...this.state.players.values()].every((player)=>player.ai);
    if(this.matchFormat==='teams')p.team=this.leastPopulatedTeam(false);
    this.state.players.set(client.sessionId,p);
    this.humanJoinedAt.set(p.id,Date.now());
    this.tacticalInventory(p.id);
    if(this.gameMode==='coreSiege')this.coreSiegePlayer(p.id);
    if(p.host)this.state.hostId=p.id;
    client.send('roomConfig',this.roomConfigPayload());
    if(this.practiceMode&&this.state.phase==='LOBBY'){
      p.team='blue';p.ready=true;this.coreSiegePlayer(p.id).heroId=this.practiceHeroId;
      const target=new PlayerState();target.id='core-siege-practice-target';target.name='연습 상대';target.ai=true;target.team='red';target.ready=true;target.aiState='HOLD';this.state.players.set(target.id,target);this.tacticalInventory(target.id);this.coreSiegePlayer(target.id).heroId='vanguard';this.openArenaAiSlots.set(target.id,{slotId:'practice-target',playerId:target.id,personaName:target.name,state:'alive',respawnAt:0,generation:0});
      this.beginOpenArena();this.resetCoreSiegePracticePositions();
      client.send('arenaStatus',this.arenaStatusPayload());client.send('arenaScoreboard',this.openArenaScoreboardPayload());
      this.system(`${p.name}님의 영웅 연구소가 열렸습니다.`);
    }else if(this.quickStart&&this.gameMode==='openArena'&&this.state.phase==='LOBBY'){
      this.fillOpenArenaAi();
      this.beginOpenArena();
      client.send('arenaStatus',this.arenaStatusPayload());
      client.send('arenaScoreboard',this.openArenaScoreboardPayload());
      this.system(`${p.name}님이 빠른 시작 전장을 열었습니다.`);
    }else if(this.arenaLike()&&this.state.phase==='ACTIVE'){
      if(this.openArenaRoundState==='active'){
        this.resetOpenArenaCombatant(p,[...this.state.players.values()].filter((player)=>!player.ai).length-1,false);
        if(this.gameMode==='coreSiege')this.giveOpenArenaStarterKit(p);
      }
      else{p.hp=0;p.alive=false;p.phase='dead';p.aiState='DEAD';client.send('arenaRoundResult',this.openArenaRoundPayload());}
      this.state.aliveCount=[...this.state.players.values()].filter((player)=>player.alive).length;
      client.send('arenaStatus',this.arenaStatusPayload());
      this.system(`${p.name}님이 진행 중인 ${this.gameMode==='coreSiege'?'코어 공성전':this.gameMode==='domination'?'점령전':'상시 전장'}에 난입했습니다.`);
    }else this.system(`${p.name}님이 입장했습니다.`);
    this.syncRoomRegistry();
  }

  async onLeave(client:Client,code:CloseCode){
    const spectator=this.arenaSpectators.get(client.sessionId);
    if(spectator){
      if(this.state.phase!=='LOBBY'&&code!==CloseCode.CONSENTED){
        try{await this.allowReconnection(client,10);return;}catch{/* reconnect timeout */}
      }
      this.arenaSpectators.delete(client.sessionId);
      this.system(`${spectator.name}님이 AI 자동전투 관전에서 나갔습니다.`);
      if(this.connectedArenaAudienceCount()===0)this.enterOpenArenaEmptyGrace();
      this.syncRoomRegistry();
      return;
    }
    const p=this.state.players.get(client.sessionId);
    if(!p)return;
    const reason=this.exitReasons.get(client.sessionId);
    this.exitReasons.delete(client.sessionId);
    if(!reason&&this.state.phase!=='LOBBY'&&code!==CloseCode.CONSENTED){
      try{await this.allowReconnection(client,this.arenaLike()?10:15);return;}catch{/* reconnect timeout */}
    }
    this.removePlayer(client.sessionId,reason??'left');
  }

  private removePlayer(playerId:string,reason:'left'|'kicked'){
    const p=this.state.players.get(playerId);
    if(!p)return;
    const wasHost=p.host;
    this.humanJoinedAt.delete(playerId);
    this.laserChargeCuePlayed.delete(playerId);
    this.humanRespawnAt.delete(playerId);this.spawnProtectionUntil.delete(playerId);this.openArenaDeaths.delete(playerId);this.arenaKillStreak.delete(playerId);this.arenaBestStreak.delete(playerId);this.arenaHumanKills.delete(playerId);this.arenaAiKills.delete(playerId);this.arenaKillReachedAt.delete(playerId);
    if(p.werewolf.transformed)this.endWerewolfCycle(p,'disconnect');
    else if(p.werewolf.hasCurse)this.dropWerewolfCurse(p,Math.max(WEREWOLF_BALANCE.curseMinimumTransferSeconds,p.werewolf.curseExpiresAt-this.now()));
    this.detachPlayerFromVehicle(p);
    p.isSniperScoped=false;
    if(this.state.phase!=='LOBBY'&&p.alive){
      p.alive=false;
      p.phase='dead';
      this.dropInventory(p);
    }
    this.state.players.delete(playerId);
    this.state.tacticalInventories.delete(playerId);
    this.state.coreSiege.players.delete(playerId);
    this.inputs.delete(playerId);
    this.cancelHeal(p);
    this.cancelReload(p);
    this.lastSafePositions.delete(playerId);
    this.stuckStates.delete(playerId);
    this.vaultJobs.delete(playerId);
    this.vaultCooldownUntil.delete(playerId);
    this.aiIntent.delete(playerId);
    this.aiThinkAt.delete(playerId);
    this.aiSwitchAt.delete(playerId);
    this.aiLandedAt.delete(playerId);
    this.aiDefendUntil.delete(playerId);
    this.aiProfiles.delete(playerId);
    this.aiMemories.delete(playerId);
    this.aiMovementSamples.delete(playerId);
    this.aiLocomotionBrains.delete(playerId);
    this.aiCombatBrains.delete(playerId);
    this.aiVehiclePlans.delete(playerId);
    this.aiVehicleMemories.delete(playerId);
    this.aiWorldObjectives.delete(playerId);
    this.aiObjectiveCooldown.delete(playerId);
    this.aiTacticalAt.delete(playerId);
    this.aiTacticalBrains.delete(playerId);
    this.aiResourceBrains.delete(playerId);
    this.aiExperienceBrains.delete(playerId);
    this.aiRobotDecision.delete(playerId);
    this.bushRevealUntil.delete(playerId);
    this.knockback.delete(playerId);
    this.chatAt.delete(playerId);
    this.throwPrepareAt.delete(playerId);
    this.hunterDroneShieldAt.delete(playerId);
    this.clearRobotPartCheatDrops(playerId);this.testCheatAt.delete(playerId);
    this.removeStripTrapsForOwner(playerId);
    this.removeSpiderMinesForOwner(playerId);
    this.vehicleStatus.deleteSource(playerId);
    for(const vehicle of this.state.motorcycles.values())this.syncVehicleSlowState(vehicle,this.now());
    this.system(reason==='kicked'?`${p.name}님이 방장에 의해 퇴장했습니다.`:`${p.name}님이 퇴장했습니다.`);
    if(wasHost)this.migrateHost();
    if(this.gameMode==='battleRoyale')this.finishCheck();
    else if(this.arenaLike()&&this.connectedArenaAudienceCount()===0)this.enterOpenArenaEmptyGrace();
    this.syncRoomRegistry();
  }

  private kick(client:Client,message:any){
    const requester=this.state.players.get(client.sessionId);
    if(!requester?.host)return client.send('error','방장만 강퇴할 수 있습니다.');
    const targetId=sanitizeText(message?.targetPlayerId,80);
    if(!targetId||targetId===client.sessionId)return client.send('error','자기 자신은 강퇴할 수 없습니다.');
    const targetPlayer=this.state.players.get(targetId);
    if(!targetPlayer||targetPlayer.ai)return client.send('error','강퇴할 수 없는 대상입니다.');
    const targetClient=this.clients.find((candidate)=>candidate.sessionId===targetId);
    if(!targetClient)return client.send('error','대상이 이미 퇴장했습니다.');
    this.exitReasons.set(targetId,'kicked');
    targetClient.send('kicked',{message:'방장에 의해 방에서 나갔습니다.'});
    targetClient.leave(CloseCode.CONSENTED,'kicked');
  }

  onDispose(){this.openArenaLifecycle='disposed';this.humanJoinedAt.clear();this.arenaSpectators.clear();this.humanRespawnAt.clear();this.spawnProtectionUntil.clear();this.openArenaDeaths.clear();this.openArenaAiSlots.clear();this.recentArenaSpawns=[];this.arenaLootSlots.clear();this.arenaLootToSlot.clear();this.arenaDropExpiresAt.clear();this.arenaVehicleSlots.clear();this.arenaKillStreak.clear();this.arenaBestStreak.clear();this.arenaHumanKills.clear();this.arenaAiKills.clear();this.arenaKillReachedAt.clear();this.openArenaRoundRows=[];this.openArenaNextSupplyDropAt=0;this.openArenaNextRitualWarningAt=0;this.openArenaRitualActiveEndsAt=0;this.openArenaLastRitualPoint=null;for(const p of this.state.players.values())if(p.werewolf.transformed)this.endWerewolfCycle(p,'round_end');this.clearCountermeasureState();this.werewolfMoveVectors.clear();this.aiProfiles.clear();this.aiMemories.clear();this.aiLineCooldown.clear();this.aiMovementSamples.clear();this.aiCombatBrains.clear();this.aiVehiclePlans.clear();this.aiVehicleMemories.clear();this.aiWorldObjectives.clear();this.aiObjectiveCooldown.clear();this.aiTacticalAt.clear();this.aiTacticalBrains.clear();this.aiResourceBrains.clear();this.aiExperienceBrains.clear();this.aiRobotDecision.clear();this.aiBrainTickSamples=[];void this.presence.del(`drop8:${this.roomId}`);}

  private system(text:string){const now=Date.now();this.broadcast('chat',{channel:'system',sender:'시스템',nickname:'시스템',text,time:now,sentAt:now});}
  private emitAudioEvent(type:string,data:Record<string,unknown>={},target?:Client){
    const payload={id:`audio-${++this.audioEventSeq}`,type,createdAt:Date.now(),...data};
    if(target)target.send('audioEvent',payload);else this.broadcast('audioEvent',payload);
  }
  private playerClient(playerId:string){return this.clients.find((client)=>client.sessionId===playerId);}

  private connectedHumanCount(){return [...this.state.players.values()].filter((player)=>!player.ai).length;}
  private connectedArenaAudienceCount(){return this.openArenaConfig?.spectatorOnly?this.arenaSpectators.size:this.connectedHumanCount();}

  private teamCounts(ai:boolean|undefined=undefined){
    const players=[...this.state.players.values()].filter((player)=>ai===undefined||player.ai===ai);
    return{blue:players.filter((player)=>player.team==='blue').length,red:players.filter((player)=>player.team==='red').length};
  }

  private leastPopulatedTeam(ai:boolean|undefined=undefined):CombatTeam{
    const counts=this.teamCounts(ai);return counts.blue<=counts.red?'blue':'red';
  }

  private sameCombatTeam(a:PlayerState|undefined,b:PlayerState|undefined){
    return Boolean(this.matchFormat==='teams'&&a&&b&&a.id!==b.id&&a.team!=='none'&&a.team===b.team);
  }

  private assignLobbyTeams(){
    if(this.matchFormat!=='teams'){for(const player of this.state.players.values())player.team='none';return;}
    for(const player of this.state.players.values())if(player.team!=='blue'&&player.team!=='red')player.team=this.leastPopulatedTeam(player.ai);
  }

  private selectTeam(c:Client,message:any){
    const player=this.state.players.get(c.sessionId);if(!player||player.ai||this.state.phase!=='LOBBY'||this.matchFormat!=='teams')return;
    const team=normalizeCombatTeam(message?.team);if(team==='none')return;
    const humans=[...this.state.players.values()].filter((candidate)=>!candidate.ai&&candidate.team===team&&candidate.id!==player.id).length;
    if(humans>=Math.ceil((this.openArenaConfig?.maxHumans??MAX_PLAYERS)/2)){c.send('error',`${team==='blue'?'파랑':'빨강'}팀 인원이 가득 찼습니다.`);return;}
    player.team=team;player.ready=false;this.system(`${player.name}님이 ${team==='blue'?'파랑팀':'빨강팀'}에 참가했습니다.`);
  }

  private coreSiegePlayer(playerId:string){
    let progress=this.state.coreSiege.players.get(playerId);
    if(progress)return progress;
    progress=new CoreSiegePlayerState();
    progress.id=playerId;
    this.state.coreSiege.players.set(playerId,progress);
    return progress;
  }

  private playerMaxHp(player:PlayerState){return Math.max(1,Number(player.maxHp)||100);}

  private healPlayer(player:PlayerState,amount:number){player.hp=Math.min(this.playerMaxHp(player),player.hp+amount);}

  private syncCoreSiegeHeroHealth(player:PlayerState,refill=false){
    const progress=this.coreSiegePlayer(player.id);
    player.maxHp=progress.maxHp=coreSiegeHeroMaxHp(normalizeCoreSiegeHero(progress.heroId));
    player.hp=refill?player.maxHp:Math.min(player.hp,player.maxHp);
  }

  private selectCoreSiegeHero(c:Client,message:any){
    const player=this.state.players.get(c.sessionId);
    if(this.gameMode!=='coreSiege'||this.state.phase!=='LOBBY'||!player||player.ai)return;
    const progress=this.coreSiegePlayer(player.id);
    progress.heroId=normalizeCoreSiegeHero(message?.heroId);
    progress.level=CORE_SIEGE_CONFIG.startLevel;progress.xp=CORE_SIEGE_CONFIG.startXp;progress.skillPoints=0;
    progress.ability1Rank=2;progress.ability2Rank=1;progress.ultimateRank=0;progress.positioningReadyAt=0;
    this.syncCoreSiegeHeroHealth(player,true);
    player.ready=false;
    c.send('notice',{type:'info',message:`${CORE_SIEGE_HEROES[progress.heroId as CoreSiegeHeroId].name}을 선택했습니다.`});
  }

  private coreSiegeAbilityRank(progress:CoreSiegePlayerState,slot:CoreSiegeAbilitySlot){
    return slot===1?progress.ability1Rank:slot===2?progress.ability2Rank:progress.ultimateRank;
  }

  private setCoreSiegeAbilityRank(progress:CoreSiegePlayerState,slot:CoreSiegeAbilitySlot,rank:number){
    if(slot===1)progress.ability1Rank=rank;
    else if(slot===2)progress.ability2Rank=rank;
    else progress.ultimateRank=rank;
  }

  private spendCoreSiegeSkillPoint(player:PlayerState,slot:CoreSiegeAbilitySlot,client?:Client){
    const progress=this.coreSiegePlayer(player.id),rank=this.coreSiegeAbilityRank(progress,slot);
    if(!coreSiegeCanUpgradeSkill(progress.level,progress.skillPoints,slot,rank))return false;
    this.setCoreSiegeAbilityRank(progress,slot,rank+1);
    progress.skillPoints--;
    const hero=CORE_SIEGE_HEROES[normalizeCoreSiegeHero(progress.heroId)];
    client?.send('notice',{type:'success',message:`${hero.abilityNames[slot-1]} Lv.${rank+1} 강화 완료`});
    this.broadcast('coreSiegeEffect',{kind:'skillUpgrade',playerId:player.id,x:player.x,y:player.y,radius:72,slot,rank:rank+1,duration:.7});
    return true;
  }

  private upgradeCoreSiegeAbility(c:Client,message:any){
    const player=this.state.players.get(c.sessionId),slot=Number(message?.slot) as CoreSiegeAbilitySlot;
    if(this.gameMode!=='coreSiege'||!player||player.ai||!(slot===1||slot===2||slot===3))return;
    if(!this.spendCoreSiegeSkillPoint(player,slot,c))c.send('notice',{type:'warning',message:'현재 레벨에서는 이 스킬을 더 강화할 수 없습니다.'});
  }

  private autoUpgradeCoreSiegeAi(player:PlayerState){
    if(!player.ai)return;
    const progress=this.coreSiegePlayer(player.id),hero=normalizeCoreSiegeHero(progress.heroId);
    const priorities:Record<CoreSiegeHeroId,CoreSiegeAbilitySlot[]>={
      vanguard:[1,2],
      technician:[2,1],
      trapper:[1,2],
      trickster:[2,1],
      medigel:[1,2],
      fireEngineer:[2,1],
      orbitalSniper:[1,2],
      wolfWarrior:[1,2],
      shieldCaptain:[1,2],
      demolitionist:[1,2],
      steelPilot:[1,2],
      empPilot:[2,1],
      ironCyclone:[1,2],
      scrapSummoner:[1,2],
      gravityWarden:[1,2],
      smokeTracker:[1,2],
      sonicCommander:[1,2],
      earthHammer:[1,2],
      chainExecutioner:[1,2],
      twinBlade:[1,2],
      burstTrooper:[1,2],
      phaseMarksman:[1,2],
      opticArtillerist:[1,2],
      impactDriller:[1,2],
      spotterGunner:[1,2],
      jetstreamBlade:[1,2],
      blackoutAssassin:[1,2],
    };
    let guard=0;
    while(progress.skillPoints>0&&guard++<12){
      const newlyUnlocked=([3,2] as CoreSiegeAbilitySlot[]).find((slot)=>this.coreSiegeAbilityRank(progress,slot)===0&&coreSiegeCanUpgradeSkill(progress.level,progress.skillPoints,slot,0));
      const ultimateRank=this.coreSiegeAbilityRank(progress,3);
      const ultimateUpgrade=ultimateRank>0&&coreSiegeCanUpgradeSkill(progress.level,progress.skillPoints,3,ultimateRank)?3:undefined;
      const preferred=newlyUnlocked??ultimateUpgrade??priorities[hero].find((slot)=>coreSiegeCanUpgradeSkill(progress.level,progress.skillPoints,slot,this.coreSiegeAbilityRank(progress,slot)));
      if(!preferred)break;
      this.spendCoreSiegeSkillPoint(player,preferred);
    }
  }

  private awardCoreSiegeXp(player:PlayerState,amount:number){
    if(this.gameMode!=='coreSiege'||amount<=0)return;
    const progress=this.coreSiegePlayer(player.id),previousLevel=progress.level;
    progress.xp=Math.min(65535,progress.xp+Math.max(1,Math.round(amount)));
    progress.level=coreSiegeLevelForXp(progress.xp);
    if(progress.level<=previousLevel)return;
    const gained=progress.level-previousLevel;
    progress.skillPoints=Math.min(20,progress.skillPoints+gained);
    this.healPlayer(player,gained*16);
    this.broadcast('coreSiegeEffect',{kind:'levelUp',playerId:player.id,x:player.x,y:player.y,radius:95,level:progress.level,duration:1.15});
    this.playerClient(player.id)?.send('notice',{type:'success',message:`레벨 ${progress.level}! 스킬 포인트 +${gained}`});
    this.autoUpgradeCoreSiegeAi(player);
  }

  private awardCoreSiegeTeamXp(team:string,x:number,y:number,amount:number,lastHitterId:string){
    if(team!=='blue'&&team!=='red')return;
    const recipients=[...this.state.players.values()].filter((player)=>player.alive&&player.team===team&&distance(player.x,player.y,x,y)<=CORE_SIEGE_CONFIG.sharedXpRadius);
    const lastHitter=this.state.players.get(lastHitterId);
    if(lastHitter?.team===team&&!recipients.includes(lastHitter))recipients.push(lastHitter);
    for(const player of recipients)this.awardCoreSiegeXp(player,player.id===lastHitterId?amount:amount*.55);
  }

  private arenaStatusPayload(){
    const humans=this.connectedHumanCount();
    const ai=[...this.state.players.values()].filter((player)=>player.ai);
    const aliveAi=ai.filter((player)=>player.alive).length;
    return{lifecycle:this.openArenaLifecycle,humans,maxHumans:this.openArenaConfig?.maxHumans??MAX_PLAYERS,spectators:this.arenaSpectators.size,spectatorOnly:Boolean(this.openArenaConfig?.spectatorOnly),aliveAi,respawningAi:Math.max(0,(this.openArenaConfig?.configuredAiCount??0)-aliveAi),configuredAiCount:this.openArenaConfig?.configuredAiCount??0,totalCombatants:humans+(this.openArenaConfig?.configuredAiCount??0),hostId:this.state.hostId,killLimit:this.openArenaConfig?.killLimit??0,roundState:this.openArenaRoundState,roundEndsAt:this.openArenaRoundEndsAt,roundGeneration:this.openArenaRoundGeneration};
  }

  private migrateHost(){
    for(const player of this.state.players.values())player.host=false;
    const candidates=[...this.state.players.values()].filter((player)=>!player.ai).sort((a,b)=>(this.humanJoinedAt.get(a.id)??Number.MAX_SAFE_INTEGER)-(this.humanJoinedAt.get(b.id)??Number.MAX_SAFE_INTEGER));
    const next=candidates[0];
    if(!next){this.state.hostId='';return;}
    next.host=true;this.state.hostId=next.id;
    this.broadcast('hostChanged',{hostId:next.id,hostName:next.name});
    this.system(`${next.name}님이 새로운 방장이 되었습니다.`);
  }

  private enterOpenArenaEmptyGrace(){
    if(!this.arenaLike()||this.openArenaLifecycle!=='active')return;
    this.openArenaLifecycle='emptyGrace';
    this.openArenaEmptyGraceUntil=this.now()+10;
    this.broadcast('arenaStatus',this.arenaStatusPayload());
    this.syncRoomRegistry();
  }

  private updateOpenArenaLifecycle(){
    if(!this.arenaLike()||this.openArenaLifecycle!=='emptyGrace'||this.openArenaDisposeRequested)return;
    if(this.connectedArenaAudienceCount()>0){this.openArenaLifecycle='active';this.openArenaEmptyGraceUntil=0;this.broadcast('arenaStatus',this.arenaStatusPayload());this.syncRoomRegistry();return;}
    if(this.now()<this.openArenaEmptyGraceUntil)return;
    this.openArenaDisposeRequested=true;
    this.openArenaLifecycle='disposed';
    this.syncRoomRegistry();
    void this.disconnect();
  }

  private ready(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(p&&this.state.phase==='LOBBY'){
      p.ready=!p.ready;
      this.system(`${p.name}님이 ${p.ready?'준비했습니다.':'준비를 취소했습니다.'}`);
    }
  }

  private settings(c:Client,m:any){
    const p=this.state.players.get(c.sessionId);
    if(!p?.host||this.state.phase!=='LOBBY')return;
    const previousMode=this.gameMode,previousFormat=this.matchFormat;
    this.gameMode=normalizeGameMode(m?.gameMode??this.gameMode);
    this.matchFormat=this.gameMode==='domination'||this.gameMode==='coreSiege'?'teams':normalizeMatchFormat(m?.matchFormat??this.matchFormat);
    const requestedMaxHumans=this.gameMode==='coreSiege'
      ?normalizeCoreSiegeHumans(m?.maxHumans??this.openArenaConfig?.maxHumans)
      :Math.max(1,Math.min(OPEN_ARENA_LIMITS.maxHumans,Math.trunc(Number(m?.maxHumans)||this.openArenaConfig?.maxHumans||MAX_PLAYERS)));
    if(Number.isFinite(Number(m?.teamAiBlue)))this.teamAiBlue=Math.max(0,Math.min(8,Math.trunc(Number(m.teamAiBlue))));
    if(Number.isFinite(Number(m?.teamAiRed)))this.teamAiRed=Math.max(0,Math.min(8,Math.trunc(Number(m.teamAiRed))));
    const requestedAi=this.matchFormat==='teams'?this.teamAiBlue+this.teamAiRed:Math.max(0,Math.min(OPEN_ARENA_LIMITS.maxAi,Math.trunc(Number(m?.aiCount)||this.openArenaConfig?.configuredAiCount||0)));
    this.openArenaConfig=this.gameMode==='domination'
      ?normalizeOpenArenaConfig(requestedMaxHumans,requestedAi,0)
      :this.gameMode==='coreSiege'
        ?normalizeOpenArenaConfig(requestedMaxHumans,requestedAi,0)
        :this.gameMode==='openArena'?normalizeOpenArenaConfig(requestedMaxHumans,requestedAi,m?.killLimit??this.openArenaConfig?.killLimit):undefined;
    this.maxClients=Math.max(this.connectedHumanCount(),this.openArenaConfig?.maxHumans??MAX_PLAYERS);
    this.state.fillAi=this.gameMode==='battleRoyale'?m?.fillAi??this.state.fillAi:requestedAi>0;
    if(typeof m?.fillAi==='boolean')this.state.fillAi=m.fillAi;
    if(['easy','normal','hard'].includes(m?.difficulty))this.state.difficulty=m.difficulty;
    if(['slow','normal','fast'].includes(m?.zoneSpeed))this.state.zoneSpeed=m.zoneSpeed;
    const requestedMap=this.gameMode==='coreSiege'?CORE_SIEGE_CONFIG.mapId:m?.mapId??m?.mapSizeMode;
    if(requestedMap==='small'||requestedMap==='large'||requestedMap==='dock8'||requestedMap==='coreSiege'){
      const mapId=normalizeMapId(requestedMap);
      if(mapId!==this.state.mapId){this.state.mapId=mapId;this.state.mapSizeMode=mapId;this.state.worldSize=this.map.width;this.state.mapRevision++;this.system(`맵이 ${this.map.displayName}으로 변경되었습니다.`);}
    }
    this.assignLobbyTeams();
    for(const player of this.state.players.values())player.ready=false;
    if(previousMode!==this.gameMode||previousFormat!==this.matchFormat)this.system(`${this.gameMode==='battleRoyale'?'배틀로얄':this.gameMode==='domination'?'점령전':this.gameMode==='coreSiege'?'코어 공성전':'상시 전투'} ${this.matchFormat==='teams'?'팀전':'개인전'}으로 변경되었습니다.`);
    this.broadcast('roomConfig',this.roomConfigPayload());
    this.syncRoomRegistry();
  }

  private start(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(!p?.host||this.state.phase!=='LOBBY')return;
    const humans=[...this.state.players.values()].filter((v)=>!v.ai);
    if(humans.some((v)=>!v.ready)){c.send('error','모든 실제 플레이어가 준비해야 합니다.');return;}
    if(this.matchFormat==='teams'){
      if(humans.some((player)=>player.team!=='blue'&&player.team!=='red')){c.send('error','모든 플레이어가 팀을 선택해야 합니다.');return;}
      const counts=this.teamCounts();
      const plannedBlue=counts.blue+this.teamAiBlue,plannedRed=counts.red+this.teamAiRed;
      const battleRoyaleMissingTeam=!this.state.fillAi&&this.gameMode==='battleRoyale'&&(counts.blue===0||counts.red===0);
      const arenaMissingTeam=this.gameMode!=='battleRoyale'&&(plannedBlue===0||plannedRed===0);
      if(battleRoyaleMissingTeam||arenaMissingTeam){c.send('error','파랑팀과 빨강팀에 각각 한 명 이상 필요합니다.');return;}
    }
    if(this.arenaLike()){
      this.fillOpenArenaAi();
      this.beginOpenArena();
    }else{
      if(this.state.fillAi)this.fillAi();
      this.beginMatch();
    }
    this.syncRoomRegistry();
  }

  private fillAi(){
    if(this.matchFormat==='teams'){
      const targets:{team:'blue'|'red';count:number}[]=[{team:'blue',count:this.teamAiBlue},{team:'red',count:this.teamAiRed}];
      let sequence=1;
      for(const target of targets){
        const existing=[...this.state.players.values()].filter((player)=>player.ai&&player.team===target.team).length;
        for(let index=existing;index<target.count;index++){
          const p=new PlayerState();p.id=`ai-${Date.now()}-${target.team}-${sequence}`;p.name=`AI-${AI_NAMES[(sequence-1)%AI_NAMES.length]}`;p.ai=true;p.team=target.team;p.ready=true;p.aiState='PLANE';this.state.players.set(p.id,p);this.tacticalInventory(p.id);this.aiProfiles.set(p.id,createAiProfile(p.id,this.state.difficulty as Difficulty,p.name));this.aiMemories.set(p.id,createAiMemory(p.x,p.y,p.buildingId,p.roomIndex,this.now()));this.aiCombatBrains.set(p.id,createAiCombatMemory());sequence++;
        }
      }
      return;
    }
    let i=1;
    while(this.state.players.size<MAX_PLAYERS){
      const p=new PlayerState();
      p.id=`ai-${Date.now()}-${i}`;
      p.name=`AI-${AI_NAMES[(i-1)%AI_NAMES.length]}`;
      p.ai=true;
      p.ready=true;
      p.aiState='PLANE';
      this.state.players.set(p.id,p);
      this.tacticalInventory(p.id);
      this.aiProfiles.set(p.id,createAiProfile(p.id,this.state.difficulty as Difficulty,p.name));
      this.aiMemories.set(p.id,createAiMemory(p.x,p.y,p.buildingId,p.roomIndex,this.now()));
      this.aiCombatBrains.set(p.id,createAiCombatMemory());
      i++;
    }
  }


  private roomConfigPayload(){
    return{
      gameMode:this.gameMode,
      matchFormat:this.matchFormat,
      teamAiBlue:this.teamAiBlue,
      teamAiRed:this.teamAiRed,
      maxHumans:this.openArenaConfig?.maxHumans??MAX_PLAYERS,
      configuredAiCount:this.openArenaConfig?.configuredAiCount??0,
      maxTotalCombatants:this.openArenaConfig?.maxTotalCombatants??MAX_PLAYERS,
      spectatorOnly:Boolean(this.openArenaConfig?.spectatorOnly),
      joinInProgress:this.arenaLike(),
      zoneEnabled:this.gameMode==='battleRoyale',
      respawnEnabled:this.gameMode!=='battleRoyale',
      lifecycle:this.arenaLike()?this.openArenaLifecycle:'lobby',
      killLimit:this.openArenaConfig?.killLimit??0,
      roundState:this.openArenaRoundState,
      quickStart:this.quickStart,
      quickMatchKey:this.quickMatchKey,
      practiceMode:this.practiceMode,
      domination:this.gameMode==='domination'?{scoreToWin:DOMINATION_CONFIG.scoreToWin,captureSeconds:DOMINATION_CONFIG.captureSeconds}:undefined,
      coreSiege:this.gameMode==='coreSiege'?{
        humanOptions:CORE_SIEGE_CONFIG.humanOptions,
        defaultHumans:CORE_SIEGE_CONFIG.defaultHumans,
        roundSeconds:CORE_SIEGE_CONFIG.roundSeconds,
        heroes:CORE_SIEGE_HEROES,
      }:undefined,
    };
  }

  private fillOpenArenaAi(){
    const target=this.openArenaConfig?.configuredAiCount??0;
    const existing=[...this.state.players.values()].filter((player)=>player.ai).length;
    for(let i=existing;i<target;i++){
      const p=new PlayerState();
      p.id=`arena-ai-${this.createdAt}-${i+1}`;
      p.name=`AI-${AI_NAMES[i%AI_NAMES.length]}`;
      p.ai=true;
      if(this.matchFormat==='teams')p.team=this.leastPopulatedTeam();
      if(this.matchFormat==='teams')p.team=i<this.teamAiBlue?'blue':'red';
      p.ready=true;
      p.aiState='PATROL';
      this.state.players.set(p.id,p);
      this.tacticalInventory(p.id);
      if(this.gameMode==='coreSiege'){
        const progress=this.coreSiegePlayer(p.id);
        progress.heroId=CORE_SIEGE_HERO_IDS[i%CORE_SIEGE_HERO_IDS.length]!;
      }
      this.openArenaAiSlots.set(p.id,{slotId:`arena-ai-slot-${i+1}`,playerId:p.id,personaName:p.name,state:'alive',respawnAt:0,generation:0});
    }
  }

  private openArenaSpawnPoint(index:number,playerId=''){
    if(this.practiceMode){
      const target=playerId==='core-siege-practice-target';
      return{x:this.worldWidth/2+(target?260:-260),y:this.worldHeight/2};
    }
    if(this.gameMode==='coreSiege'){
      const player=this.state.players.get(playerId),red=player?.team==='red',row=index%4;
      const base={x:this.worldWidth*(red?0.9:0.1),y:this.worldHeight*(.38+row*.08)};
      return this.findNearestFreePoint(base.x,base.y,360,false)??base;
    }
    if(this.gameMode==='domination'){
      const player=this.state.players.get(playerId),red=player?.team==='red',row=index%4;
      const base={x:this.worldSize*(red?0.88:0.12),y:this.worldSize*(0.41+row*0.06)};
      return this.findNearestFreePoint(base.x,base.y,420,false)??base;
    }
    if(this.matchFormat==='teams'){
      const player=this.state.players.get(playerId),red=player?.team==='red',row=index%6;
      const base={x:this.worldSize*(red?0.82:0.18),y:this.worldSize*(0.27+row*0.092)};
      return this.findNearestFreePoint(base.x,base.y,520,false)??base;
    }
    const emergency=this.map.emergencySpawnPoints;
    const lootCandidates=this.map.lootSpawns.filter((_,candidateIndex)=>candidateIndex%Math.max(1,Math.floor(this.map.lootSpawns.length/24))===0).map((spawn)=>({x:spawn.x,y:spawn.y}));
    const candidates=[...emergency,...lootCandidates];
    const threats=[...this.state.players.values()].filter((player)=>player.alive&&player.phase==='landed'&&player.id!==playerId).map((player)=>({x:player.x,y:player.y,alive:true}));
    const selected=chooseOpenArenaSpawn(candidates,threats,this.recentArenaSpawns,this.now(),(point)=>this.isPositionFree(point.x,point.y)&&this.playerClearOfMotorcycles(point.x,point.y),(from,to)=>this.firstVisibilityObstacleHitT(from.x,from.y,to.x,to.y,PLAYER_HIT_RADIUS)===null);
    const base=selected??(emergency.length?emergency[index%emergency.length]!:{x:this.worldWidth/2,y:this.worldHeight/2});
    return this.findNearestFreePoint(base.x,base.y,420,false)??base;
  }

  private resetOpenArenaCombatant(p:PlayerState,index:number,resetScore:boolean){
    const spawn=this.openArenaSpawnPoint(index,p.id);
    p.maxHp=100;p.hp=p.maxHp;p.armor=0;p.alive=true;if(resetScore){p.kills=0;p.damageDone=0;}p.attackSeq=0;p.hitSeq=0;p.lastHitAngle=0;p.lastHitDamage=0;
    p.inBush=false;p.bushRevealed=false;p.buildingId='';p.roomIndex=0;p.insideBuilding=false;p.isSwimming=false;p.buildingTransitionSeq=0;
    p.isSniperScoped=false;p.isDriving=false;p.vehicleId='';p.isVaulting=false;p.vaultProgress=0;p.vaultWindowId='';p.reloading=false;p.reloadWeapon='';p.reloadProgress=0;
    p.phase='landed';p.altitude=0;p.primary='';p.secondary='';p.melee='fists';p.equipped='fists';p.previousEquipped='fists';p.throwableType='';p.throwableCount=0;p.isPreparingThrow=false;p.throwCharge=0;
    p.magazine=0;p.pistolMagazine=0;p.smgMagazine=0;p.rifleMagazine=0;p.shotgunMagazine=0;p.sniperMagazine=0;p.bazookaMagazine=0;p.flamethrowerMagazine=0;
    p.pistolAmmo=0;p.standardAmmo=0;p.shotgunAmmo=0;p.rocketAmmo=0;p.fuelAmmo=0;p.bandages=0;p.medkits=0;p.healingKind='';p.healingProgress=0;
    this.tacticalInventory(p.id).boomerangMagazine=0;
    this.tacticalInventory(p.id).rcCarMagazine=0;
    this.resetWerewolfPlayer(p);this.resetChickenPlayer(p);const tactical=this.tacticalInventory(p.id);tactical.adhesiveSprayerMagazine=0;tactical.adhesiveCharge=0;tactical.stripTrapCount=0;tactical.silverCrossbowMagazine=0;tactical.silverBoltAmmo=0;tactical.railgunMagazine=0;tactical.railSlugAmmo=0;tactical.laserCannonMagazine=0;tactical.laserCellAmmo=0;tactical.laserCannonCharging=false;tactical.laserCannonChargeStartedAt=0;tactical.stunGunMagazine=0;tactical.hunterDroneCount=0;tactical.spiderMineCount=0;tactical.tankKeyCount=0;this.resetChickenInventory(tactical);this.resetExoInventory(tactical);
    p.x=spawn.x;p.y=spawn.y;p.aiState=p.ai?'PATROL':'';
    this.recentArenaSpawns.push({x:p.x,y:p.y,at:this.now()});this.recentArenaSpawns=this.recentArenaSpawns.filter((item)=>this.now()-item.at<12).slice(-24);
    this.lastSafePositions.set(p.id,{x:p.x,y:p.y,mapId:this.map.id,buildingId:'',roomIndex:0,recordedAt:this.now()});
    this.stuckStates.set(p.id,{lastX:p.x,lastY:p.y,movingSince:0,lastRecoveryAt:-99});
    if(p.ai){this.aiThinkAt.set(p.id,this.now()+.4+index*.08);this.aiIntent.set(p.id,this.newAiIntent(p));this.aiProfiles.set(p.id,createAiProfile(p.id,this.state.difficulty as Difficulty,p.name));this.aiMemories.set(p.id,createAiMemory(p.x,p.y,p.buildingId,p.roomIndex,this.now()));this.aiLocomotionBrains.set(p.id,createAiLocomotionMemory(Math.cos(p.angle),Math.sin(p.angle)));this.aiCombatBrains.set(p.id,createAiCombatMemory());this.aiTacticalBrains.set(p.id,createAiTacticalMemory());this.aiResourceBrains.set(p.id,createAiResourceMemory());}
  }

  private beginOpenArena(){
    this.clearTransient();
    this.elapsed=0;
    this.lootRandom=createSeededRandom((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0);
    this.state.phase='ACTIVE';this.state.winner='';this.state.placements.clear();this.state.worldSize=this.map.width;this.openArenaRoundState='active';this.openArenaRoundEndsAt=0;this.openArenaRoundResettingAt=0;this.openArenaRoundWinnerId='';this.openArenaRoundRows=[];this.openArenaRoundGeneration=1;this.clearOpenArenaRoundScores();
    this.state.zoneX=this.worldWidth/2;this.state.zoneY=this.worldHeight/2;this.state.zoneRadius=Math.max(this.worldWidth,this.worldHeight);this.state.zoneStartX=this.state.zoneX;this.state.zoneStartY=this.state.zoneY;this.state.zoneStartRadius=this.state.zoneRadius;
    this.state.nextZoneX=this.state.zoneX;this.state.nextZoneY=this.state.zoneY;this.state.nextZoneRadius=this.state.zoneRadius;this.state.zoneTimer=0;this.state.zoneStage=0;this.state.zoneProgress=0;this.state.zoneActive=false;this.state.zoneState='DISABLED';this.state.supplySpawned=false;this.state.supplyDropId='';this.openArenaSupplyDropCount=0;this.openArenaNextSupplyDropAt=this.now()+this.arenaSupplyFirstDelay();this.openArenaNextRitualWarningAt=this.now()+this.arenaRitualFirstDelay();this.openArenaRitualActiveEndsAt=0;this.openArenaLastRitualPoint=null;
    this.state.planeStartX=0;this.state.planeStartY=0;this.state.planeX=0;this.state.planeY=0;this.state.planeEndX=0;this.state.planeEndY=0;this.state.planeAngle=0;this.state.planeProgress=1;
    let index=0;for(const player of this.state.players.values()){this.resetOpenArenaCombatant(player,index++,true);if(this.gameMode==='coreSiege')this.giveOpenArenaStarterKit(player);}
    this.state.aliveCount=this.state.players.size;
    if(this.gameMode==='coreSiege')this.initializeCoreSiege();
    else{this.spawnLoot();this.spawnMotorcycles();}
    this.initializeDomination();
    this.broadcast('roomConfig',this.roomConfigPayload());
    this.system(this.gameMode==='domination'
      ?`AI 점령전이 시작되었습니다. 인간 최대 ${DOMINATION_CONFIG.maxHumans}명 대 AI ${this.openArenaConfig?.configuredAiCount??DOMINATION_CONFIG.aiCount}명 · 대각선 A/B 확보 · ${DOMINATION_CONFIG.scoreToWin}점 승리`
      :`상시 개방 전장이 시작되었습니다. 인간 ${this.openArenaConfig?.maxHumans??0}명 · AI ${this.openArenaConfig?.configuredAiCount??0}명 · ${this.openArenaConfig?.killLimit?`${this.openArenaConfig.killLimit}킬 제한`:'무제한'} · 자기장 없음`);
  }

  private initializeDomination(){
    const state=this.state.domination;state.enabled=this.gameMode==='domination';state.sites.clear();state.humanScore=0;state.aiScore=0;state.scoreToWin=DOMINATION_CONFIG.scoreToWin;state.winner='';this.dominationScoreAt=this.now()+DOMINATION_CONFIG.scoreTickSeconds;
    if(!state.enabled)return;
    for(const layout of dominationSitesForMap(this.map.width,this.map.height,DOMINATION_CONFIG.captureRadius)){
      const site=new DominationSiteState();site.id=layout.id;site.x=layout.x;site.y=layout.y;site.radius=layout.radius;state.sites.set(site.id,site);
    }
  }

  private updateDomination(dt:number){
    if(this.gameMode!=='domination'||this.openArenaRoundState!=='active')return;
    const state=this.state.domination;
    for(const site of state.sites.values()){
      let blue=0,red=0;
      for(const player of this.state.players.values()){
        if(!player.alive||player.phase!=='landed'||distance(player.x,player.y,site.x,site.y)>site.radius)continue;
        if(player.team==='blue')blue++;else if(player.team==='red')red++;
      }
      site.humanCount=blue;site.aiCount=red;site.contested=blue>0&&red>0;
      if(site.contested)continue;
      const team=blue>0?'blue':red>0?'red':'neutral';
      if(team==='neutral'){
        if(site.owner==='neutral')site.captureProgress=Math.max(0,site.captureProgress-dt/DOMINATION_CONFIG.captureSeconds*.35);
        continue;
      }
      if(site.owner===team){site.capturingTeam=team;site.captureProgress=1;continue;}
      if(site.owner!=='neutral'){
        site.capturingTeam=team;site.captureProgress=Math.max(0,site.captureProgress-dt/DOMINATION_CONFIG.captureSeconds);
        if(site.captureProgress<=0){site.owner='neutral';site.captureProgress=0;}
        continue;
      }
      if(site.capturingTeam!==team){site.capturingTeam=team;site.captureProgress=0;}
      site.captureProgress=Math.min(1,site.captureProgress+dt/DOMINATION_CONFIG.captureSeconds);
      if(site.captureProgress>=1){site.owner=team;site.capturingTeam=team;this.system(`${site.id} 거점을 ${team==='blue'?'파랑팀':'빨강팀'}이 확보했습니다.`);}
    }
    const now=this.now();
    if(now<this.dominationScoreAt)return;
    this.dominationScoreAt=now+DOMINATION_CONFIG.scoreTickSeconds;
    for(const site of state.sites.values())if(site.owner==='blue')state.humanScore++;else if(site.owner==='red')state.aiScore++;
    if(state.humanScore>=state.scoreToWin)this.finishDominationRound('blue');
    else if(state.aiScore>=state.scoreToWin)this.finishDominationRound('red');
  }

  private finishDominationRound(team:'blue'|'red'){
    if(this.gameMode!=='domination'||this.openArenaRoundState!=='active')return;
    const now=this.now(),winner=[...this.state.players.values()].find((player)=>player.team===team);
    this.state.domination.winner=team;this.openArenaRoundState='result';this.openArenaRoundEndsAt=now+OPEN_ARENA_ROUND_TOTAL_SECONDS;this.openArenaRoundResettingAt=this.openArenaRoundEndsAt-OPEN_ARENA_ROUND_COUNTDOWN_SECONDS;this.openArenaRoundWinnerId=winner?.id??'';this.openArenaRoundRows=this.openArenaHumanRows();this.openArenaRoundGeneration++;
    this.humanRespawnAt.clear();this.spawnProtectionUntil.clear();this.inputs.clear();for(const slot of this.openArenaAiSlots.values()){slot.respawnAt=0;slot.generation++;}for(const player of this.state.players.values()){this.cancelHeal(player);this.cancelReload(player);this.cancelThrow(player);player.isSniperScoped=false;}
    const winnerName=team==='blue'?'파랑팀':'빨강팀';this.broadcast('arenaRoundResult',{...this.openArenaRoundPayload(),winnerName,dominationWinner:team});this.system(`${winnerName}이 A/B 점령전에서 승리했습니다. 8초 후 다음 라운드가 시작됩니다.`);this.syncRoomRegistry();
  }

  private initializeCoreSiege(){
    const state=this.state.coreSiege;
    state.enabled=this.gameMode==='coreSiege';
    state.structures.clear();
    state.minions.clear();
    state.camps.clear();
    state.upgrades.clear();
    state.pickups.clear();
    state.devices.clear();
    state.waveNumber=0;
    state.winner='';
    this.coreSiegeAreaJobs.clear();
    this.coreSiegeDashJobs.clear();
    this.coreSiegeChainPullJobs.clear();
    this.coreSiegeAttackProjectiles.clear();
    this.coreSiegeChainComboTargets.clear();
    this.coreSiegeSpinJobs.clear();
    this.coreSiegeWaveJobs.clear();
    this.coreSiegeSummonOrders.clear();
    this.coreSiegeHuntMarks.clear();
    this.coreSiegeExecutionZones.clear();
    this.coreSiegeMeleeCombos.clear();
    this.coreSiegeAreaHitWindows.clear();
    this.coreSiegePersistentDamageAt.clear();
    this.coreSiegeMeleeShieldReadyAt.clear();
    this.coreSiegeCrowdControl.clear();
    this.coreSiegeAiTeamUltimateReadyAt.clear();
    this.coreSiegePositioningLockedUntil.clear();
    this.coreSiegeAiAbilityAt.clear();
    if(!state.enabled)return;
    if(this.practiceMode){
      for(const player of this.state.players.values()){const progress=this.coreSiegePlayer(player.id);progress.level=10;progress.xp=0;progress.skillPoints=0;progress.ability1Rank=5;progress.ability2Rank=5;progress.ultimateRank=1;}
      state.nextWaveAt=this.now()+86400;state.roundEndsAt=this.now()+86400;return;
    }
    const layout=coreSiegeLayout(this.worldWidth,this.worldHeight);
    for(const item of layout.structures){
      const structure=new CoreSiegeStructureState();
      structure.id=item.id;structure.team=item.team;structure.kind=item.kind;structure.order=item.order;
      structure.x=item.x;structure.y=item.y;structure.radius=item.radius;structure.hp=item.hp;structure.maxHp=item.hp;
      state.structures.set(structure.id,structure);
    }
    for(const item of layout.pickups){
      const pickup=new CoreSiegePickupState();
      pickup.id=item.id;pickup.kind=item.kind;pickup.x=item.x;pickup.y=item.y;pickup.radius=item.radius;pickup.active=true;
      state.pickups.set(pickup.id,pickup);
    }
    for(const player of this.state.players.values()){
      const progress=this.coreSiegePlayer(player.id);
      progress.level=CORE_SIEGE_CONFIG.startLevel;progress.xp=CORE_SIEGE_CONFIG.startXp;progress.skillPoints=0;
      progress.ability1Rank=2;progress.ability2Rank=1;progress.ultimateRank=0;
      progress.powerStacks=0;progress.guardStacks=0;progress.hasteStacks=0;
      progress.ability1ReadyAt=0;progress.ability2ReadyAt=0;progress.ultimateReadyAt=0;progress.positioningReadyAt=0;
      progress.medicalGel=CORE_SIEGE_CONFIG.medicalGelMax;progress.heat=0;progress.temporaryShield=0;progress.temporaryShieldEndsAt=0;progress.deathGuardReady=false;progress.deathGuardUntil=0;progress.markedUntil=0;progress.hasteUntil=0;progress.spinUntil=0;progress.rampageUntil=0;progress.marchUntil=0;progress.anchoredUntil=0;progress.parryUntil=0;progress.parryRecoveryUntil=0;progress.meleeChaseUntil=0;
    }
    state.nextWaveAt=this.now()+CORE_SIEGE_CONFIG.firstWaveDelaySeconds;
    state.roundEndsAt=this.now()+CORE_SIEGE_CONFIG.roundSeconds;
    this.refreshCoreSiegeStructureVulnerability();
  }

  private refreshCoreSiegeStructureVulnerability(){
    const structures=[...this.state.coreSiege.structures.values()];
    for(const structure of structures){
      structure.vulnerable=!structure.destroyed&&coreSiegeStructureVulnerable(
        {team:structure.team as 'blue'|'red',kind:structure.kind as 'core'|'outerTower'|'innerTower'},
        structures.map((candidate)=>({team:candidate.team as 'blue'|'red',kind:candidate.kind as 'core'|'outerTower'|'innerTower',hp:candidate.hp})),
      );
    }
  }

  private spawnCoreSiegeWave(){
    const state=this.state.coreSiege;
    state.waveNumber++;
    const layout=coreSiegeLayout(this.worldWidth,this.worldHeight);
    const kinds:Array<'melee'|'ranged'|'siege'>=[
      ...Array.from({length:CORE_SIEGE_CONFIG.meleePerWave},()=> 'melee' as const),
      ...Array.from({length:CORE_SIEGE_CONFIG.rangedPerWave},()=> 'ranged' as const),
    ];
    if(state.waveNumber%CORE_SIEGE_CONFIG.siegeEveryWaves===0)kinds.push('siege');
    for(const team of ['blue','red'] as const){
      let meleeIndex=0,rangedIndex=0;
      kinds.forEach((kind)=>{
        const minion=new CoreSiegeMinionState();
        minion.id=`siege-minion-${++this.coreSiegeMinionSeq}`;
        minion.team=team;minion.kind=kind;
        const direction=team==='blue'?1:-1;
        if(kind==='melee'){
          const offsets=[-82,0,82];
          minion.formationOffsetX=68-meleeIndex*22;minion.formationOffsetY=offsets[meleeIndex%offsets.length]!;
          meleeIndex++;
        }else if(kind==='ranged'){
          const offsets=[-54,54];
          minion.formationOffsetX=-54-rangedIndex*38;minion.formationOffsetY=offsets[rangedIndex%offsets.length]!;
          rangedIndex++;
        }else{
          minion.formationOffsetX=-138;minion.formationOffsetY=0;
        }
        minion.x=this.worldWidth*(team==='blue'?.115:.885)+direction*minion.formationOffsetX;
        minion.y=layout.laneY+minion.formationOffsetY;
        minion.radius=kind==='siege'?23:kind==='melee'?17:15;
        minion.maxHp=kind==='siege'?230:kind==='melee'?125:88;
        minion.hp=minion.maxHp;
        state.minions.set(minion.id,minion);
      });
    }
    this.broadcast('coreSiegeEffect',{kind:'wave',wave:state.waveNumber,x:this.worldWidth/2,y:layout.laneY});
  }

  private coreSiegeEnemyTeam(team:string){return team==='blue'?'red':'blue';}

  private damageCoreSiegeStructure(structure:CoreSiegeStructureState,amount:number,attackerId:string,fromMinion=false){
    if(this.gameMode!=='coreSiege'||this.openArenaRoundState!=='active'||structure.destroyed||!structure.vulnerable)return false;
    const attacker=this.state.players.get(attackerId);
    if(attacker?.team===structure.team)return false;
    let applied=amount*(attacker?coreSiegePowerMultiplier(this.coreSiegePlayer(attacker.id).powerStacks):1);
    if(attacker&&!fromMinion){
      const protectedByMinion=[...this.state.coreSiege.minions.values()].some((minion)=>minion.team===attacker.team&&distance(minion.x,minion.y,structure.x,structure.y)<=CORE_SIEGE_CONFIG.minionProtectionRadius);
      if(!protectedByMinion)applied*=CORE_SIEGE_CONFIG.backdoorDamageMultiplier;
    }
    structure.hp=Math.max(0,structure.hp-applied);
    if(structure.hp>0)return true;
    structure.destroyed=true;
    structure.vulnerable=false;
    if(attacker?.team)this.awardCoreSiegeTeamXp(attacker.team,structure.x,structure.y,CORE_SIEGE_CONFIG.structureXp,attacker.id);
    this.refreshCoreSiegeStructureVulnerability();
    this.broadcast('coreSiegeEffect',{kind:'structureDestroyed',structureId:structure.id,team:structure.team,x:structure.x,y:structure.y,radius:structure.radius*2.4});
    this.emitAudioEvent('bazooka_explosion',{sourceId:structure.id,ownerId:attackerId,x:structure.x,y:structure.y,buildingId:'',radius:structure.radius*2.4,weaponType:'core_siege'});
    if(structure.kind==='core')this.finishCoreSiegeRound(this.coreSiegeEnemyTeam(structure.team) as 'blue'|'red');
    return true;
  }

  private hitCoreSiegeStructure(structure:CoreSiegeStructureState,amount:number,attackerId:string,x=structure.x,y=structure.y){
    const applied=this.damageCoreSiegeStructure(structure,amount,attackerId);
    this.broadcast('coreSiegeEffect',{kind:applied?'structureHit':'structureBlocked',structureId:structure.id,ownerId:attackerId,x,y,radius:structure.radius,duration:.16});
    this.emitAudioEvent(applied?'impact_vehicle':'impact_wall',{sourceId:attackerId,targetId:structure.id,x,y,buildingId:'',variant:'core_siege_structure'});
    return applied;
  }

  private damageCoreSiegeStructuresInRadius(x:number,y:number,radius:number,damageAmount:number,attackerId:string,falloff=.55){
    if(this.gameMode!=='coreSiege')return;
    const attacker=this.state.players.get(attackerId);
    for(const structure of this.state.coreSiege.structures.values()){
      if(structure.destroyed||structure.team===attacker?.team)continue;
      const d=distance(x,y,structure.x,structure.y),reach=radius+structure.radius;
      if(d>reach)continue;
      this.hitCoreSiegeStructure(structure,damageAmount*(1-Math.min(1,d/reach)*falloff),attackerId,x,y);
    }
  }

  private damageCoreSiegeMinion(minion:CoreSiegeMinionState,amount:number,attackerId:string,damageKind:DamageKind='other'){
    const attacker=this.state.players.get(attackerId);
    if(attacker?.team===minion.team)return false;
    const actual=amount*(attacker?coreSiegePowerMultiplier(this.coreSiegePlayer(attacker.id).powerStacks):1);
    minion.hp-=actual;
    if(damageKind==='melee'&&attacker?.werewolf.transformed&&normalizeCoreSiegeHero(this.coreSiegePlayer(attacker.id).heroId)==='wolfWarrior')this.healPlayer(attacker,Math.min(4,actual*.05));
    if(minion.hp<=0){
      this.state.coreSiege.minions.delete(minion.id);
      if(attacker?.team)this.awardCoreSiegeTeamXp(attacker.team,minion.x,minion.y,CORE_SIEGE_CONFIG.minionXp[minion.kind as 'melee'|'ranged'|'siege'],attacker.id);
    }
    return true;
  }

  private damageCoreSiegeMinionsInRadius(x:number,y:number,radius:number,amount:number,attackerId:string,falloff=.35){
    const attacker=this.state.players.get(attackerId);
    let hits=0;
    for(const minion of [...this.state.coreSiege.minions.values()]){
      if(attacker?.team===minion.team)continue;
      const d=distance(x,y,minion.x,minion.y);if(d>radius+minion.radius)continue;
      this.damageCoreSiegeMinion(minion,amount*(1-Math.min(1,d/radius)*falloff),attackerId);hits++;
    }
    return hits;
  }

  private damageCoreSiegeCamp(camp:CoreSiegeCampState,amount:number,attackerId:string){
    if(!camp.alive)return false;
    const attacker=this.state.players.get(attackerId);
    camp.lastAttackerId=attackerId;
    camp.hp-=amount*(attacker?coreSiegePowerMultiplier(this.coreSiegePlayer(attacker.id).powerStacks):1);
    if(camp.hp>0)return true;
    camp.hp=0;camp.alive=false;camp.respawnsAt=this.now()+CORE_SIEGE_CONFIG.campRespawnSeconds;
    if(attacker?.team)this.awardCoreSiegeTeamXp(attacker.team,camp.x,camp.y,CORE_SIEGE_CONFIG.campXp,attacker.id);
    const upgrade=new CoreSiegeUpgradeState();
    upgrade.id=`siege-upgrade-${++this.coreSiegeUpgradeSeq}`;upgrade.kind=camp.kind;upgrade.x=camp.x;upgrade.y=camp.y;upgrade.expiresAt=this.now()+CORE_SIEGE_CONFIG.upgradeLifetimeSeconds;
    this.state.coreSiege.upgrades.set(upgrade.id,upgrade);
    this.broadcast('coreSiegeEffect',{kind:'campDefeated',upgradeKind:camp.kind,x:camp.x,y:camp.y,radius:130});
    return true;
  }

  private updateCoreSiegeMinions(dt:number){
    const state=this.state.coreSiege,now=this.now();
    for(const minion of [...state.minions.values()]){
      if(minion.hp<=0){state.minions.delete(minion.id);continue;}
      const enemyTeam=this.coreSiegeEnemyTeam(minion.team);
      const attackRange=minion.kind==='ranged'?250:minion.kind==='siege'?310:48;
      const damageAmount=minion.kind==='siege'?34:minion.kind==='ranged'?15:18;
      const fireInterval=minion.kind==='siege'?1.8:minion.kind==='ranged'?1.25:.9;
      const enemyMinion=[...state.minions.values()]
        .filter((candidate)=>candidate.team===enemyTeam)
        .sort((a,b)=>distance(minion.x,minion.y,a.x,a.y)-distance(minion.x,minion.y,b.x,b.y))[0];
      const enemyPlayer=[...this.state.players.values()]
        .filter((candidate)=>candidate.alive&&candidate.phase==='landed'&&candidate.team===enemyTeam)
        .sort((a,b)=>distance(minion.x,minion.y,a.x,a.y)-distance(minion.x,minion.y,b.x,b.y))[0];
      const enemySummon=[...state.devices.values()]
        .filter((candidate)=>candidate.hp>0&&this.isCoreSiegeSummon(candidate)&&candidate.team===enemyTeam)
        .sort((a,b)=>distance(minion.x,minion.y,a.x,a.y)-distance(minion.x,minion.y,b.x,b.y))[0];
      const structure=[...state.structures.values()]
        .filter((candidate)=>candidate.team===enemyTeam&&!candidate.destroyed&&candidate.vulnerable)
        .sort((a,b)=>distance(minion.x,minion.y,a.x,a.y)-distance(minion.x,minion.y,b.x,b.y))[0];
      const target=enemyMinion&&distance(minion.x,minion.y,enemyMinion.x,enemyMinion.y)<=attackRange
        ?enemyMinion
        :enemySummon&&distance(minion.x,minion.y,enemySummon.x,enemySummon.y)<=attackRange
          ?enemySummon
        :enemyPlayer&&distance(minion.x,minion.y,enemyPlayer.x,enemyPlayer.y)<=attackRange
          ?enemyPlayer
          :structure&&distance(minion.x,minion.y,structure.x,structure.y)<=attackRange+structure.radius
            ?structure
            :undefined;
      const sequence=Number(minion.id.slice(minion.id.lastIndexOf('-')+1))||1;
      const direction=minion.team==='blue'?1:-1,laneY=coreSiegeLayout(this.worldWidth,this.worldHeight).laneY;
      const nearbyAlly=[...state.minions.values()].find((candidate)=>candidate.id!==minion.id&&candidate.team===minion.team&&Math.abs(candidate.x-minion.x)<64&&distance(candidate.x,candidate.y,minion.x,minion.y)<minion.radius+candidate.radius+22);
      const separation=nearbyAlly?(minion.y<=nearbyAlly.y?-1:1)*30:0;
      const wanderAmplitude=minion.kind==='siege'?18:minion.kind==='ranged'?42:32;
      const wander=Math.sin(now*.8+sequence*1.71+minion.x*.0035)*wanderAmplitude;
      const combatDrift=target?Math.sin(now*1.55+sequence*2.13)*(minion.kind==='ranged'?48:28):0;
      const desiredY=clamp(laneY+minion.formationOffsetY+wander+combatDrift+separation,laneY-CORE_SIEGE_CONFIG.laneHalfWidth,laneY+CORE_SIEGE_CONFIG.laneHalfWidth);
      minion.y+=(desiredY-minion.y)*Math.min(1,dt*(target?3.2:2.1));
      if(target){
        if(now>=minion.attackReadyAt){
          minion.attackReadyAt=now+fireInterval;
          if(minion.kind==='melee'){
            if(target instanceof CoreSiegeMinionState)this.damageCoreSiegeMinion(target,damageAmount,'');
            else if(target instanceof PlayerState)this.damage(target,damageAmount,'','전투 미니언',0,Math.atan2(target.y-minion.y,target.x-minion.x),'melee');
            else if(target instanceof CoreSiegeDeviceState)target.hp=Math.max(0,target.hp-damageAmount);
            else this.damageCoreSiegeStructure(target,damageAmount,'',true);
            this.broadcast('coreSiegeEffect',{kind:'minionMelee',minionKind:minion.kind,team:minion.team,x1:minion.x,y1:minion.y,x2:target.x,y2:target.y,duration:.28});
          }else this.launchCoreSiegeAttackProjectile(minion.kind==='siege'?'minionShell':'minionBullet',minion.id,target,damageAmount,minion.team,minion.x,minion.y);
        }
        continue;
      }
      const pace=.9+(sequence%7)*.035;
      minion.x=clamp(minion.x+direction*CORE_SIEGE_CONFIG.minionMoveSpeed*(minion.kind==='siege'?.72:1)*pace*dt,30,this.worldWidth-30);
    }
  }

  private updateCoreSiegeStructures(){
    const state=this.state.coreSiege,now=this.now();
    for(const structure of state.structures.values()){
      if(structure.destroyed||structure.kind==='core'&&!structure.vulnerable||now<structure.attackReadyAt)continue;
      const core=structure.kind==='core',range=core?CORE_SIEGE_CONFIG.coreDefenseRange:CORE_SIEGE_CONFIG.towerRange;
      const enemyTeam=this.coreSiegeEnemyTeam(structure.team);
      const minion=[...state.minions.values()]
        .filter((candidate)=>candidate.team===enemyTeam&&distance(candidate.x,candidate.y,structure.x,structure.y)<=range)
        .sort((a,b)=>distance(structure.x,structure.y,a.x,a.y)-distance(structure.x,structure.y,b.x,b.y))[0];
      const summon=!minion?[...state.devices.values()]
        .filter((candidate)=>candidate.hp>0&&this.isCoreSiegeSummon(candidate)&&candidate.team===enemyTeam&&distance(candidate.x,candidate.y,structure.x,structure.y)<=range)
        .sort((a,b)=>distance(structure.x,structure.y,a.x,a.y)-distance(structure.x,structure.y,b.x,b.y))[0]:undefined;
      const player=!minion&&!summon?[...this.state.players.values()]
        .filter((candidate)=>candidate.alive&&candidate.phase==='landed'&&candidate.team===enemyTeam&&distance(candidate.x,candidate.y,structure.x,structure.y)<=range)
        .sort((a,b)=>distance(structure.x,structure.y,a.x,a.y)-distance(structure.x,structure.y,b.x,b.y))[0]:undefined;
      const target=minion??summon??player;
      if(!target)continue;
      structure.attackReadyAt=now+(core?CORE_SIEGE_CONFIG.coreDefenseFireIntervalSeconds:CORE_SIEGE_CONFIG.towerFireIntervalSeconds);
      const damage=core?(player?CORE_SIEGE_CONFIG.coreDefensePlayerDamage:CORE_SIEGE_CONFIG.coreDefenseMinionDamage):(player?CORE_SIEGE_CONFIG.towerPlayerDamage:CORE_SIEGE_CONFIG.towerMinionDamage);
      this.launchCoreSiegeAttackProjectile('towerShell',structure.id,target,damage,structure.team,structure.x,structure.y);
    }
  }

  private launchCoreSiegeAttackProjectile(kind:CoreSiegeAttackProjectileJob['kind'],sourceId:string,target:PlayerState|CoreSiegeMinionState|CoreSiegeDeviceState|CoreSiegeStructureState,damage:number,team:string,x1:number,y1:number){
    const targetKind=target instanceof PlayerState?'player':target instanceof CoreSiegeMinionState?'minion':target instanceof CoreSiegeDeviceState?'device':'structure',speed=kind==='towerShell'?820:kind==='minionShell'?520:760,duration=clamp(distance(x1,y1,target.x,target.y)/speed,.18,.72),id=`siege-projectile-${++this.coreSiegeAbilitySeq}`,job:CoreSiegeAttackProjectileJob={id,kind,sourceId,targetId:target.id,targetKind,team,damage,launchedAt:this.now(),impactAt:this.now()+duration,x1,y1,x2:target.x,y2:target.y};
    this.coreSiegeAttackProjectiles.set(id,job);this.broadcast('coreSiegeEffect',{kind:'siegeProjectile',projectileKind:kind,effectId:id,sourceId,targetId:target.id,targetKind,team,x1,y1,x2:target.x,y2:target.y,duration});
  }

  private coreSiegeShieldIntersectionT(x1:number,y1:number,x2:number,y2:number,attackingTeam:string,padding=0){
    let closest:{device:CoreSiegeDeviceState;t:number}|undefined;
    for(const device of this.state.coreSiege.devices.values()){
      if(device.kind!=='shieldField'||device.hp<=0||device.team===attackingTeam)continue;
      const t=this.coreSiegeShieldDeviceIntersectionT(device,x1,y1,x2,y2,padding);
      if(t!==null&&(!closest||t<closest.t))closest={device,t};
    }
    return closest;
  }

  private coreSiegeShieldDeviceIntersectionT(device:CoreSiegeDeviceState,x1:number,y1:number,x2:number,y2:number,padding=0){const cosine=Math.cos(-device.angle),sine=Math.sin(-device.angle),local=(x:number,y:number)=>{const dx=x-device.x,dy=y-device.y;return{x:dx*cosine-dy*sine,y:dx*sine+dy*cosine};},start=local(x1,y1),end=local(x2,y2);return segmentRectIntersectionT(start.x,start.y,end.x,end.y,{x:-12-padding,y:-device.radius/2-padding,w:24+padding*2,h:device.radius+padding*2});}

  private updateCoreSiegeAttackProjectiles(){
    const now=this.now();
    for(const [id,job] of this.coreSiegeAttackProjectiles){
      if(now<job.impactAt)continue;this.coreSiegeAttackProjectiles.delete(id);
      const target=job.targetKind==='player'?this.state.players.get(job.targetId):job.targetKind==='minion'?this.state.coreSiege.minions.get(job.targetId):job.targetKind==='device'?this.state.coreSiege.devices.get(job.targetId):this.state.coreSiege.structures.get(job.targetId);
      if(!target)continue;
      const x=target.x,y=target.y,angle=Math.atan2(y-job.y1,x-job.x1);
      const shield=this.coreSiegeShieldIntersectionT(job.x1,job.y1,x,y,job.team,6);if(shield){shield.device.hp=Math.max(0,shield.device.hp-job.damage);const hitX=job.x1+(x-job.x1)*shield.t,hitY=job.y1+(y-job.y1)*shield.t;this.broadcast('coreSiegeEffect',{kind:'shieldBlock',effectId:shield.device.id,x:hitX,y:hitY,radius:shield.device.radius,duration:.35,hp:shield.device.hp,maxHp:shield.device.maxHp});continue;}
      if(target instanceof PlayerState){if(target.alive)this.damage(target,job.damage,'',job.kind==='towerShell'?'방어 포탑':job.kind==='minionShell'?'공성 미니언':'전투 미니언',0,angle,'bullet');}
      else if(target instanceof CoreSiegeMinionState)this.damageCoreSiegeMinion(target,job.damage,'');
      else if(target instanceof CoreSiegeDeviceState)target.hp=Math.max(0,target.hp-job.damage);
      else this.damageCoreSiegeStructure(target,job.damage,'',job.kind!=='towerShell');
      this.broadcast('coreSiegeEffect',{kind:'siegeProjectileHit',projectileKind:job.kind,targetId:job.targetId,targetKind:job.targetKind,team:job.team,x,y,radius:job.kind==='towerShell'?58:job.kind==='minionShell'?42:24,duration:.32});
    }
  }

  private updateCoreSiegeCamps(){
    const state=this.state.coreSiege,now=this.now();
    for(const camp of state.camps.values()){
      if(!camp.alive){
        if(now>=camp.respawnsAt){camp.alive=true;camp.hp=camp.maxHp;camp.respawnsAt=0;camp.lastAttackerId='';}
        continue;
      }
      const target=camp.lastAttackerId?this.state.players.get(camp.lastAttackerId):undefined;
      if(!target?.alive||distance(target.x,target.y,camp.x,camp.y)>360){camp.lastAttackerId='';continue;}
      if(now<camp.attackReadyAt)continue;
      camp.attackReadyAt=now+1.25;
      this.damage(target,camp.kind==='guard'?10:8,'','정글 수호자',0,Math.atan2(target.y-camp.y,target.x-camp.x),'melee');
      this.broadcast('coreSiegeEffect',{kind:'campAttack',upgradeKind:camp.kind,x1:camp.x,y1:camp.y,x2:target.x,y2:target.y});
    }
  }

  private updateCoreSiegeUpgrades(){
    const state=this.state.coreSiege,now=this.now();
    for(const [id,upgrade] of [...state.upgrades]){
      if(now>=upgrade.expiresAt){state.upgrades.delete(id);continue;}
      const player=[...this.state.players.values()].find((candidate)=>candidate.alive&&candidate.phase==='landed'&&distance(candidate.x,candidate.y,upgrade.x,upgrade.y)<=PLAYER_BODY_RADIUS+30);
      if(!player)continue;
      const progress=this.coreSiegePlayer(player.id),kind=upgrade.kind as CoreSiegeUpgradeKind;
      if(kind==='power')progress.powerStacks=Math.min(CORE_SIEGE_CONFIG.maxUpgradeStacks,progress.powerStacks+1);
      else if(kind==='haste')progress.hasteStacks=Math.min(CORE_SIEGE_CONFIG.maxUpgradeStacks,progress.hasteStacks+1);
      else{progress.guardStacks=Math.min(CORE_SIEGE_CONFIG.maxUpgradeStacks,progress.guardStacks+1);player.armor=Math.min(100,player.armor+CORE_SIEGE_CONFIG.guardArmorPerStack);}
      state.upgrades.delete(id);
      this.playerClient(player.id)?.send('notice',{type:'success',message:`${kind==='power'?'공격':kind==='guard'?'방어':'쿨타임'} 강화 ${kind==='power'?progress.powerStacks:kind==='guard'?progress.guardStacks:progress.hasteStacks}/3`});
      this.broadcast('coreSiegeEffect',{kind:'upgradePickup',upgradeKind:kind,playerId:player.id,x:player.x,y:player.y,radius:90});
    }
  }

  private updateCoreSiegePickups(){
    const now=this.now();
    for(const pickup of this.state.coreSiege.pickups.values()){
      if(!pickup.active){
        if(now>=pickup.respawnsAt){pickup.active=true;pickup.respawnsAt=0;}
        continue;
      }
      const player=[...this.state.players.values()]
        .filter((candidate)=>candidate.alive&&candidate.phase==='landed'&&distance(candidate.x,candidate.y,pickup.x,pickup.y)<=pickup.radius+PLAYER_BODY_RADIUS)
        .sort((a,b)=>a.hp-b.hp)[0];
      if(!player||pickup.kind==='healing'&&player.hp>=this.playerMaxHp(player))continue;
      const progress=this.coreSiegePlayer(player.id);
      if(pickup.kind==='healing'){
        this.healPlayer(player,CORE_SIEGE_CONFIG.healingAmount);
        progress.medicalGel=Math.min(CORE_SIEGE_CONFIG.medicalGelMax,progress.medicalGel+28);
      }else{
        const stacks=[
          {kind:'power' as const,value:progress.powerStacks},
          {kind:'guard' as const,value:progress.guardStacks},
          {kind:'haste' as const,value:progress.hasteStacks},
        ].sort((a,b)=>a.value-b.value);
        const kind=stacks[0]!.kind;
        if(kind==='power')progress.powerStacks=Math.min(CORE_SIEGE_CONFIG.maxUpgradeStacks,progress.powerStacks+1);
        else if(kind==='haste')progress.hasteStacks=Math.min(CORE_SIEGE_CONFIG.maxUpgradeStacks,progress.hasteStacks+1);
        else{progress.guardStacks=Math.min(CORE_SIEGE_CONFIG.maxUpgradeStacks,progress.guardStacks+1);player.armor=Math.min(100,player.armor+CORE_SIEGE_CONFIG.guardArmorPerStack);}
        this.awardCoreSiegeXp(player,CORE_SIEGE_CONFIG.supplyXp);
      }
      pickup.active=false;
      pickup.respawnsAt=now+(pickup.kind==='healing'?CORE_SIEGE_CONFIG.healingRespawnSeconds:CORE_SIEGE_CONFIG.supplyRespawnSeconds);
      this.broadcast('coreSiegeEffect',{kind:pickup.kind==='healing'?'healingPickup':'supplyPickup',pickupId:pickup.id,playerId:player.id,x:pickup.x,y:pickup.y,radius:95,duration:.8});
    }
  }

  private updateCoreSiegePlayers(dt:number){
    const now=this.now();
    for(const player of this.state.players.values()){
      const progress=this.coreSiegePlayer(player.id);
      if(progress.temporaryShieldEndsAt>0&&now>=progress.temporaryShieldEndsAt){progress.temporaryShield=0;progress.temporaryShieldEndsAt=0;}
      if(progress.deathGuardReady&&now>=progress.deathGuardUntil){progress.deathGuardReady=false;progress.deathGuardUntil=0;}
      const hero=normalizeCoreSiegeHero(progress.heroId);
      if(hero==='medigel'&&now-(this.shotAt.get(player.id)??-99)>.35)progress.medicalGel=Math.min(CORE_SIEGE_CONFIG.medicalGelMax,progress.medicalGel+CORE_SIEGE_CONFIG.medicalGelRechargePerSecond*dt);
      const profile=CORE_SIEGE_BASIC_ATTACKS[hero];
      if(profile.coolPerSecond&&now-(this.shotAt.get(player.id)??-99)>.2)progress.heat=Math.max(0,progress.heat-profile.coolPerSecond*dt);
      if(hero==='wolfWarrior'&&player.werewolf.transformed&&now>=player.werewolf.transformEndsAt){player.werewolf.transformed=false;player.werewolf.transformEndsAt=0;player.werewolf.sprinting=false;player.werewolf.sprintGauge=1;}
    }
  }

  private updateCoreSiegeDevices(dt:number){
    const now=this.now();
    for(const [id,device] of [...this.state.coreSiege.devices]){
      if(device.hp<=0||now>=device.expiresAt){
        if(device.hp>0&&device.kind==='gravityCollapse')this.explodeCoreSiegeGravity(device);
        else if(device.hp>0&&device.kind==='executionStake')this.resolveCoreSiegeExecutionZone(device);
        else if(device.kind==='executionStake')this.broadcast('coreSiegeEffect',{kind:'chainBreak',effectId:id,x:device.x,y:device.y,radius:device.radius,duration:.45});
        this.coreSiegeExecutionZones.delete(id);this.state.coreSiege.devices.delete(id);this.broadcast('coreSiegeEffect',{kind:'deviceEnd',effectId:id});continue;
      }
      if(this.isCoreSiegeSummon(device)){this.updateCoreSiegeSummon(device,dt,now);continue;}
      if(now<device.nextTickAt)continue;
      device.nextTickAt=now+.5;
      const owner=this.state.players.get(device.ownerId),linkedTargetIds:string[]=[];
      if(device.kind==='lifeSupport'){
        for(const target of this.state.players.values()){
          if(!target.alive||target.team!==device.team||this.tacticalInventory(target.id).exoActive||distance(target.x,target.y,device.x,device.y)>device.radius)continue;
          linkedTargetIds.push(target.id);
          this.healPlayer(target,5);
          const progress=this.coreSiegePlayer(target.id);progress.deathGuardReady=true;progress.deathGuardUntil=now+1;
        }
      }else if(device.kind==='regenFoam'||device.kind==='shieldField'){
        for(const target of this.state.players.values()){
          if(!target.alive||distance(target.x,target.y,device.x,device.y)>device.radius)continue;
          if(target.team===device.team){
            const progress=this.coreSiegePlayer(target.id);
            progress.temporaryShield=Math.max(progress.temporaryShield,device.kind==='shieldField'?32:16);
            progress.temporaryShieldEndsAt=Math.max(progress.temporaryShieldEndsAt,now+1);
          }else this.applyCoreSiegeSlow(target,.75);
        }
      }else if(device.kind==='fireCapsule'||device.kind==='fireWall'||device.kind==='fireStorm'){
        for(const target of this.state.players.values())if(target.alive&&target.team!==device.team&&distance(target.x,target.y,device.x,device.y)<=device.radius&&this.canApplyCoreSiegePersistentDamage('fire',target.id,now))this.damage(target,7,device.ownerId,'화염 장벽',0,undefined,'fire');
        for(const minion of [...this.state.coreSiege.minions.values()])if(minion.team!==device.team&&distance(minion.x,minion.y,device.x,device.y)<=device.radius)this.damageCoreSiegeMinion(minion,10,device.ownerId);
        this.damageCoreSiegeStructuresInRadius(device.x,device.y,device.radius,8,device.ownerId,.35);
      }else if(device.kind==='gravityAnchor'||device.kind==='gravityCollapse'){
        const pull=device.kind==='gravityCollapse'?28:18;
        for(const target of this.state.players.values()){
          if(!target.alive||target.team===device.team||distance(target.x,target.y,device.x,device.y)>device.radius)continue;
          const angle=Math.atan2(device.y-target.y,device.x-target.x);this.tryMove(target,Math.cos(angle)*pull,Math.sin(angle)*pull);if(device.kind==='gravityAnchor')this.damage(target,4,device.ownerId,'중력 닻',0,angle,'other');
        }
        for(const minion of this.state.coreSiege.minions.values())if(minion.team!==device.team&&distance(minion.x,minion.y,device.x,device.y)<=device.radius){const angle=Math.atan2(device.y-minion.y,device.x-minion.x);minion.x+=Math.cos(angle)*pull;minion.y+=Math.sin(angle)*pull;if(device.kind==='gravityAnchor')this.damageCoreSiegeMinion(minion,7,device.ownerId);}
      }else if(device.kind==='seismicStake'){
        for(const target of this.state.players.values())if(target.alive&&target.team!==device.team&&distance(target.x,target.y,device.x,device.y)<=device.radius)this.applyCoreSiegeSlow(target,.75);
      }else if(device.kind==='executionStake'){
        const zone=this.coreSiegeExecutionZones.get(id),target=zone?this.state.players.get(zone.targetId):undefined;
        if(!target?.alive||distance(target.x,target.y,device.x,device.y)>device.radius){this.coreSiegeExecutionZones.delete(id);this.state.coreSiege.devices.delete(id);this.broadcast('coreSiegeEffect',{kind:'chainBreak',effectId:id,x:device.x,y:device.y,radius:device.radius,duration:.45});continue;}
        this.applyCoreSiegeSlow(target,.7);
      }
      if(owner?.alive)this.broadcast('coreSiegeEffect',{kind:'devicePulse',effectId:id,deviceKind:device.kind,x:device.x,y:device.y,radius:device.radius,linkedTargetIds,duration:.55});
    }
  }

  private resolveCoreSiegeStructureCollisions(){
    for(const player of this.state.players.values()){
      if(!player.alive||player.phase!=='landed')continue;
      for(const structure of this.state.coreSiege.structures.values()){
        if(structure.destroyed)continue;
        const dx=player.x-structure.x,dy=player.y-structure.y,minDistance=PLAYER_BODY_RADIUS+structure.radius,current=Math.hypot(dx,dy);
        if(current>=minDistance)continue;
        const angle=current>.001?Math.atan2(dy,dx):player.team===structure.team?0:Math.PI;
        player.x=clamp(structure.x+Math.cos(angle)*minDistance,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS);
        player.y=clamp(structure.y+Math.sin(angle)*minDistance,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
      }
    }
  }

  private updateCoreSiegeAreaJobs(){
    const now=this.now();
    for(const [id,job] of [...this.coreSiegeAreaJobs]){
      if(job.kind==='grenade'&&now>=job.detonatesAt){
        this.explodeCoreSiegeGrenade(job);
        this.coreSiegeAreaJobs.delete(id);
        continue;
      }
      if(job.kind==='sticky'){
        if(now<job.detonatesAt)continue;
        const owner=this.state.players.get(job.ownerId);
        const triggered=[...this.state.players.values()].some((target)=>target.alive&&!this.sameCombatTeam(owner,target)&&target.id!==job.ownerId&&distance(target.x,target.y,job.x,job.y)<=job.radius*.72)
          ||[...this.state.coreSiege.minions.values()].some((minion)=>minion.team!==owner?.team&&distance(minion.x,minion.y,job.x,job.y)<=job.radius*.72);
        if(!triggered&&now<job.expiresAt)continue;
        this.explodeCoreSiegeGrenade(job);this.coreSiegeAreaJobs.delete(id);continue;
      }
      if(job.kind!=='adhesive')continue;
      if(now>=job.expiresAt){this.coreSiegeAreaJobs.delete(id);this.broadcast('coreSiegeEffect',{kind:'areaEnd',effectId:id});continue;}
      if(now<job.nextTickAt)continue;
      job.nextTickAt=now+.45;
      const owner=this.state.players.get(job.ownerId);
      for(const target of this.state.players.values()){
        if(!target.alive||this.sameCombatTeam(owner,target)||distance(target.x,target.y,job.x,job.y)>job.radius)continue;
        this.applyCoreSiegeSlow(target,.7);
        if(this.canApplyCoreSiegePersistentDamage('adhesive',target.id,now))this.damage(target,3*job.power,job.ownerId,'점착 폭발장',0,undefined,'fire');
      }
      for(const minion of [...this.state.coreSiege.minions.values()])if(minion.team!==owner?.team&&distance(minion.x,minion.y,job.x,job.y)<=job.radius)this.damageCoreSiegeMinion(minion,7*job.power,job.ownerId);
    }
  }

  private canApplyCoreSiegePersistentDamage(kind:'adhesive'|'fire',targetId:string,now=this.now()){
    const key=`${kind}:${targetId}`,last=this.coreSiegePersistentDamageAt.get(key)??-99;
    if(now-last<CORE_SIEGE_CONFIG.persistentDamageIntervalSeconds)return false;
    this.coreSiegePersistentDamageAt.set(key,now);return true;
  }

  private nextCoreSiegeCrowdControlMultiplier(targetId:string){
    const now=this.now(),current=this.coreSiegeCrowdControl.get(targetId),state=current&&now<current.expiresAt?current:{expiresAt:now+CORE_SIEGE_CONFIG.crowdControlWindowSeconds,hits:0};
    const multiplier=coreSiegeCrowdControlMultiplier(state.hits);state.hits++;state.expiresAt=now+CORE_SIEGE_CONFIG.crowdControlWindowSeconds;this.coreSiegeCrowdControl.set(targetId,state);return multiplier;
  }

  private applyCoreSiegeCrowdControl(target:PlayerState,stunSeconds:number,slowSeconds:number){
    const now=this.now(),multiplier=this.nextCoreSiegeCrowdControlMultiplier(target.id);
    const appliedStun=stunSeconds*multiplier;target.werewolf.actionLockedUntil=Math.max(target.werewolf.actionLockedUntil,now+appliedStun);
    target.werewolf.silverSlowUntil=Math.max(target.werewolf.silverSlowUntil,now+slowSeconds*multiplier);
    if(appliedStun>0)this.broadcast('coreSiegeEffect',{kind:'stunApplied',targetId:target.id,x:target.x,y:target.y,radius:48,duration:appliedStun});
    return multiplier;
  }

  private applyCoreSiegeSlow(target:PlayerState,seconds:number){
    const now=this.now(),multiplier=this.nextCoreSiegeCrowdControlMultiplier(target.id);
    target.werewolf.silverSlowUntil=Math.max(target.werewolf.silverSlowUntil,now+seconds*multiplier);return multiplier;
  }

  private damageCoreSiegeAreaPlayer(target:PlayerState,amount:number,attackerId:string,reason:string,group:CoreSiegeAreaDamageGroup,knockback=0,hitAngle?:number){
    const now=this.now(),key=`${attackerId}:${group}`,current=this.coreSiegeAreaHitWindows.get(key);
    const window=current&&now<current.expiresAt?current:{expiresAt:now+CORE_SIEGE_CONFIG.areaRepeatWindowSeconds,hits:new Map<string,number>()};
    if(window!==current)this.coreSiegeAreaHitWindows.set(key,window);
    const hits=window.hits.get(target.id)??0;window.hits.set(target.id,hits+1);
    const heroMultiplier=group==='barrage'?CORE_SIEGE_CONFIG.carpetBombingHeroDamageMultiplier:CORE_SIEGE_CONFIG.areaHeroDamageMultiplier;
    this.damage(target,amount*heroMultiplier*coreSiegeAreaRepeatMultiplier(hits),attackerId,reason,knockback,hitAngle,'explosion');
  }

  private explodeCoreSiegeGrenade(job:CoreSiegeAreaJob){
    const owner=this.state.players.get(job.ownerId),now=this.now(),sticky=job.kind==='sticky';
    const explosion=new ExplosionState();
    explosion.id=`explosion-${++this.explosionSeq}`;explosion.x=job.x;explosion.y=job.y;explosion.radius=job.radius;explosion.startedAt=now;explosion.duration=.9;
    explosion.sourceId=job.id;explosion.ownerId=job.ownerId;explosion.kind=sticky?'coreSiegeSticky':'coreSiegeGrenade';explosion.attackerId=job.ownerId;explosion.weaponType='frag';explosion.structureDamage=sticky?92:66;
    this.state.explosions.set(explosion.id,explosion);
    for(const target of this.state.players.values()){
      if(!target.alive||this.sameCombatTeam(owner,target))continue;
      const d=distance(job.x,job.y,target.x,target.y);if(d>job.radius)continue;
      const ratio=1-d/job.radius,maxDamage=sticky?82:CORE_SIEGE_CONFIG.grenadeMaxDamage,amount=(CORE_SIEGE_CONFIG.grenadeMinDamage+(maxDamage-CORE_SIEGE_CONFIG.grenadeMinDamage)*ratio)*job.power;
      this.damageCoreSiegeAreaPlayer(target,amount,job.ownerId,sticky?'점착 폭탄':'대형 파편탄',job.damageGroup??(sticky?'sticky':'grenade'),(sticky?120:230)*ratio,Math.atan2(target.y-job.y,target.x-job.x));
    }
    this.damageCoreSiegeMinionsInRadius(job.x,job.y,job.radius,(sticky?108:72)*job.power,job.ownerId,.65);
    for(const camp of this.state.coreSiege.camps.values()){const d=distance(job.x,job.y,camp.x,camp.y);if(d<=job.radius+camp.radius)this.damageCoreSiegeCamp(camp,62*job.power*(1-Math.min(1,d/(job.radius+camp.radius))*.5),job.ownerId);}
    this.damageCoreSiegeStructuresInRadius(job.x,job.y,job.radius,(sticky?92:66)*job.power,job.ownerId);
    this.broadcast('coreSiegeEffect',{kind:'grenadeExplosion',variant:sticky?'sticky':'fragmentation',effectId:job.id,x:job.x,y:job.y,radius:job.radius,duration:.9});
    this.emitAudioEvent('frag_explosion',{sourceId:job.id,ownerId:job.ownerId,x:job.x,y:job.y,buildingId:'',radius:job.radius,variant:sticky?'core_siege_sticky':'core_siege_grenade'});
  }

  private updateCoreSiege(dt:number){
    if(this.gameMode!=='coreSiege'||this.openArenaRoundState!=='active')return;
    const state=this.state.coreSiege,now=this.now();
    if(this.practiceMode){this.updateCoreSiegePracticeTarget();this.updateCoreSiegePlayers(dt);this.updateCoreSiegeDashes();this.updateCoreSiegeChainPulls();this.updateCoreSiegeIronSpins();this.updateCoreSiegeWaves(dt);this.updateCoreSiegeVolleysAndCables();this.updateCoreSiegeDevices(dt);this.updateCoreSiegeAreaJobs();this.updateCoreSiegeAttackProjectiles();return;}
    if(now>=state.nextWaveAt){this.spawnCoreSiegeWave();state.nextWaveAt=now+CORE_SIEGE_CONFIG.waveIntervalSeconds;}
    this.updateCoreSiegeMinions(dt);
    this.updateCoreSiegeStructures();
    this.updateCoreSiegeAttackProjectiles();
    this.updateCoreSiegePlayers(dt);
    this.updateCoreSiegeDashes();
    this.updateCoreSiegeChainPulls();
    this.updateCoreSiegeIronSpins();
    this.updateCoreSiegeWaves(dt);
    this.updateCoreSiegeVolleysAndCables();
    this.updateCoreSiegePickups();
    this.updateCoreSiegeDevices(dt);
    this.updateCoreSiegeAreaJobs();
    this.resolveCoreSiegeStructureCollisions();
    this.updateCoreSiegeAiAbilities();
    if(now>=state.roundEndsAt){
      const score=(team:'blue'|'red')=>[...state.structures.values()].filter((structure)=>structure.team===team).reduce((sum,structure)=>sum+structure.hp/Math.max(1,structure.maxHp),0);
      this.finishCoreSiegeRound(score('blue')>=score('red')?'blue':'red');
    }
  }

  private finishCoreSiegeRound(team:'blue'|'red'){
    if(this.gameMode!=='coreSiege'||this.openArenaRoundState!=='active')return;
    const now=this.now(),winner=[...this.state.players.values()].find((player)=>player.team===team);
    this.state.coreSiege.winner=team;this.openArenaRoundState='result';this.openArenaRoundEndsAt=now+OPEN_ARENA_ROUND_TOTAL_SECONDS;this.openArenaRoundResettingAt=this.openArenaRoundEndsAt-OPEN_ARENA_ROUND_COUNTDOWN_SECONDS;this.openArenaRoundWinnerId=winner?.id??'';this.openArenaRoundRows=this.openArenaHumanRows();this.openArenaRoundGeneration++;
    this.humanRespawnAt.clear();this.spawnProtectionUntil.clear();this.inputs.clear();this.coreSiegeAreaJobs.clear();this.coreSiegeDashJobs.clear();this.coreSiegeSpinJobs.clear();this.coreSiegeWaveJobs.clear();this.coreSiegeSummonOrders.clear();this.coreSiegeHuntMarks.clear();this.coreSiegeExecutionZones.clear();this.coreSiegeMeleeCombos.clear();this.coreSiegeAreaHitWindows.clear();this.coreSiegePersistentDamageAt.clear();this.coreSiegeMeleeShieldReadyAt.clear();this.coreSiegeCrowdControl.clear();this.coreSiegeAiTeamUltimateReadyAt.clear();
    const winnerName=team==='blue'?'블루 팀':'레드 팀';
    this.broadcast('arenaRoundResult',{...this.openArenaRoundPayload(),winnerName,coreSiegeWinner:team});
    this.system(`${winnerName}이 적 코어를 파괴했습니다. 잠시 후 다음 공성전이 시작됩니다.`);
    this.syncRoomRegistry();
  }

  private coreSiegeAimPoint(p:PlayerState,message:any,range:number,assistRadius:number){
    const rawX=Number(message?.aimWorldX),rawY=Number(message?.aimWorldY);
    const desired=clampCoreSiegeTarget(
      p,
      Number.isFinite(rawX)&&Number.isFinite(rawY)?{x:rawX,y:rawY}:{x:p.x+Math.cos(p.angle)*range,y:p.y+Math.sin(p.angle)*range},
      range,
    );
    const enemies=[...this.state.players.values()].filter((target)=>target.alive&&target.phase==='landed'&&!this.sameCombatTeam(p,target)&&target.id!==p.id&&!this.coreSiegePlayerInsideSmoke(target));
    return clampCoreSiegeTarget(p,assistedCoreSiegeTarget(desired,enemies,assistRadius),range);
  }

  private coreSiegePlayerInsideSmoke(p:PlayerState){return [...this.state.smokeFields.values()].some((field)=>distance(p.x,p.y,field.x,field.y)<=Math.max(0,field.radius));}

  private coreSiegeSupportAimPoint(p:PlayerState,message:any,range:number,assistRadius:number){
    const rawX=Number(message?.aimWorldX),rawY=Number(message?.aimWorldY);
    const desired=clampCoreSiegeTarget(
      p,
      Number.isFinite(rawX)&&Number.isFinite(rawY)?{x:rawX,y:rawY}:{x:p.x+Math.cos(p.angle)*range,y:p.y+Math.sin(p.angle)*range},
      range,
    );
    const allies=[...this.state.players.values()].filter((target)=>target.alive&&target.phase==='landed'&&this.sameCombatTeam(p,target)&&target.hp<this.playerMaxHp(target));
    return clampCoreSiegeTarget(p,assistedCoreSiegeTarget(desired,allies,assistRadius),range);
  }

  private createCoreSiegeDevice(p:PlayerState,kind:string,x:number,y:number,radius:number,hp:number,duration:number,angle=p.angle){
    const device=new CoreSiegeDeviceState();
    device.id=`siege-device-${++this.coreSiegeAbilitySeq}`;device.ownerId=p.id;device.team=p.team;device.kind=kind;
    device.x=clamp(x,radius,this.worldWidth-radius);device.y=clamp(y,radius,this.worldHeight-radius);device.angle=angle;device.radius=radius;device.hp=hp;device.maxHp=hp;device.expiresAt=this.now()+duration;device.nextTickAt=this.now();
    this.state.coreSiege.devices.set(device.id,device);
    this.broadcast('coreSiegeEffect',{kind:'deviceSpawn',effectId:device.id,deviceKind:kind,ownerId:p.id,team:p.team,x:device.x,y:device.y,angle:device.angle,radius,duration});
    return device;
  }

  private resolveCoreSiegeExecutionZone(device:CoreSiegeDeviceState){
    const zone=this.coreSiegeExecutionZones.get(device.id),target=zone?this.state.players.get(zone.targetId):undefined;
    if(!zone||!target?.alive||target.team===device.team||distance(target.x,target.y,device.x,device.y)>device.radius)return;
    const missing=Math.max(0,this.playerMaxHp(target)-target.hp),damage=(38+zone.rank*5+Math.min(18,missing*.2))*zone.power;
    this.damage(target,damage,device.ownerId,'처형 구역',105,Math.atan2(target.y-device.y,target.x-device.x),'melee');
    this.broadcast('coreSiegeEffect',{kind:'executionStrike',effectId:device.id,ownerId:device.ownerId,targetId:target.id,x:target.x,y:target.y,radius:device.radius,duration:.75});
  }

  private isCoreSiegeSummon(device:CoreSiegeDeviceState){return device.kind==='gearling'||device.kind==='scrapGiant';}

  private coreSiegeSummonTargetById(device:CoreSiegeDeviceState,targetId:string):CoreSiegeSummonTarget|undefined{
    const player=this.state.players.get(targetId);if(player?.alive&&player.team!==device.team)return player;
    const minion=this.state.coreSiege.minions.get(targetId);if(minion&&minion.team!==device.team)return minion;
    const structure=this.state.coreSiege.structures.get(targetId);if(structure&&!structure.destroyed&&structure.vulnerable&&structure.team!==device.team)return structure;
    const summon=this.state.coreSiege.devices.get(targetId);if(summon&&summon.hp>0&&this.isCoreSiegeSummon(summon)&&summon.team!==device.team)return summon;
    return;
  }

  private markCoreSiegeSummonTarget(ownerId:string,targetId:string,x:number,y:number){
    const owner=this.state.players.get(ownerId);if(!owner||this.gameMode!=='coreSiege'||normalizeCoreSiegeHero(this.coreSiegePlayer(ownerId).heroId)!=='scrapSummoner')return;
    this.coreSiegeSummonOrders.set(ownerId,{x,y,targetId,expiresAt:this.now()+4});
  }

  private spawnCoreSiegeSummon(p:PlayerState,kind:'gearling'|'scrapGiant',rank:number,count=1){
    let spawned=0;
    if(kind==='scrapGiant'){
      for(const device of [...this.state.coreSiege.devices.values()])if(device.ownerId===p.id&&device.kind===kind)this.state.coreSiege.devices.delete(device.id);
      count=1;
    }
    for(let index=0;index<count;index++){
      const devices=[...this.state.coreSiege.devices.values()],owned=devices.filter((device)=>device.ownerId===p.id&&device.kind===kind),teamGearlings=devices.filter((device)=>device.team===p.team&&device.kind==='gearling');
      if(kind==='gearling'&&(owned.length>=CORE_SIEGE_CONFIG.summonPerHeroLimit||teamGearlings.length>=CORE_SIEGE_CONFIG.summonPerTeamLimit))break;
      const giant=kind==='scrapGiant',side=giant?0:(owned.length%2?1:-1)*(38+Math.floor(owned.length/2)*18),forward=giant?84:72+Math.floor(owned.length/2)*30,sx=-Math.sin(p.angle),sy=Math.cos(p.angle),spawn=this.findNearestFreePoint(p.x+Math.cos(p.angle)*forward+sx*side,p.y+Math.sin(p.angle)*forward+sy*side,120,false)??{x:p.x,y:p.y};
      const device=this.createCoreSiegeDevice(p,kind,spawn.x,spawn.y,giant?52:27,giant?230+rank*35:60+rank*12,giant?10+rank*.5:24,p.angle);
      device.nextTickAt=this.now()+.35+index*.08;spawned++;
      this.broadcast('coreSiegeEffect',{kind:'summonAssemble',effectId:`assemble-${device.id}`,deviceKind:kind,ownerId:p.id,x:device.x,y:device.y,radius:device.radius,duration:giant?1.1:.65});
    }
    return spawned>0;
  }

  private commandCoreSiegeSummons(p:PlayerState,x:number,y:number,rank:number){
    const candidates:CoreSiegeSummonTarget[]=[
      ...[...this.state.players.values()].filter((target)=>target.alive&&target.team!==p.team),
      ...[...this.state.coreSiege.minions.values()].filter((target)=>target.team!==p.team),
      ...[...this.state.coreSiege.structures.values()].filter((target)=>!target.destroyed&&target.vulnerable&&target.team!==p.team),
    ];
    const target=candidates.filter((candidate)=>distance(candidate.x,candidate.y,x,y)<=150+rank*12).sort((a,b)=>distance(a.x,a.y,x,y)-distance(b.x,b.y,x,y))[0];
    this.coreSiegeSummonOrders.set(p.id,{x,y,targetId:target?.id??'',expiresAt:this.now()+6+rank});
    this.broadcast('coreSiegeEffect',{kind:'summonCommand',ownerId:p.id,targetId:target?.id??'',x,y,radius:150+rank*12,duration:.8});
    return true;
  }

  private moveCoreSiegeSummon(device:CoreSiegeDeviceState,dx:number,dy:number){
    const radius=Math.max(18,device.radius*.55),free=(x:number,y:number)=>!this.collisionRects().some((rect)=>circleHitsRect(x,y,radius,rect))&&![...this.state.coreSiege.structures.values()].some((structure)=>!structure.destroyed&&distance(x,y,structure.x,structure.y)<radius+structure.radius);
    const nx=clamp(device.x+dx,radius,this.worldWidth-radius),ny=clamp(device.y+dy,radius,this.worldHeight-radius);
    if(free(nx,ny)){device.x=nx;device.y=ny;return;}
    if(free(nx,device.y))device.x=nx;else if(free(device.x,ny))device.y=ny;
  }

  private updateCoreSiegeSummon(device:CoreSiegeDeviceState,dt:number,now:number){
    const owner=this.state.players.get(device.ownerId);if(!owner?.alive){device.hp=0;return;}
    const order=this.coreSiegeSummonOrders.get(device.ownerId),ordered=order&&now<order.expiresAt?this.coreSiegeSummonTargetById(device,order.targetId):undefined;
    const candidates:CoreSiegeSummonTarget[]=[
      ...[...this.state.coreSiege.minions.values()].filter((target)=>target.team!==device.team),
      ...[...this.state.players.values()].filter((target)=>target.alive&&target.team!==device.team),
      ...[...this.state.coreSiege.structures.values()].filter((target)=>!target.destroyed&&target.vulnerable&&target.team!==device.team),
      ...[...this.state.coreSiege.devices.values()].filter((target)=>target.id!==device.id&&target.hp>0&&this.isCoreSiegeSummon(target)&&target.team!==device.team),
    ];
    const target=ordered??candidates.filter((candidate)=>distance(device.x,device.y,candidate.x,candidate.y)<=720).sort((a,b)=>distance(device.x,device.y,a.x,a.y)-distance(device.x,device.y,b.x,b.y))[0];
    const siblings=[...this.state.coreSiege.devices.values()].filter((item)=>item.ownerId===device.ownerId&&item.kind===device.kind).sort((a,b)=>a.id.localeCompare(b.id)),formationIndex=Math.max(0,siblings.findIndex((item)=>item.id===device.id)),formationSide=(formationIndex%2?1:-1)*(34+Math.floor(formationIndex/2)*24),baseGoal=target??(order&&now<order.expiresAt?order:owner),baseAngle=Math.atan2(baseGoal.y-device.y,baseGoal.x-device.x),goal=target?baseGoal:{x:baseGoal.x-Math.sin(baseAngle)*formationSide,y:baseGoal.y+Math.cos(baseAngle)*formationSide},attackRange=device.kind==='scrapGiant'?88:58,d=distance(device.x,device.y,goal.x,goal.y),angle=Math.atan2(goal.y-device.y,goal.x-device.x);device.angle=angle;
    const targetRadius=target instanceof PlayerState?PLAYER_HIT_RADIUS:target?.radius??0;
    if(d>attackRange+targetRadius){const speed=device.kind==='scrapGiant'?138:205,nearby=siblings.filter((item)=>item.id!==device.id&&distance(device.x,device.y,item.x,item.y)<62),repelX=nearby.reduce((sum,item)=>sum+(device.x-item.x),0),repelY=nearby.reduce((sum,item)=>sum+(device.y-item.y),0),repelLength=Math.hypot(repelX,repelY)||1;this.moveCoreSiegeSummon(device,Math.cos(angle)*speed*dt+repelX/repelLength*nearby.length*18*dt,Math.sin(angle)*speed*dt+repelY/repelLength*nearby.length*18*dt);return;}
    if(!target||now<device.nextTickAt)return;
    device.nextTickAt=now+(device.kind==='scrapGiant'?.9:.65);
    const giant=device.kind==='scrapGiant',playerDamage=giant?25:9,minionDamage=giant?42:15,structureDamage=giant?13:4;
    if(target instanceof PlayerState)this.damage(target,playerDamage,device.ownerId,giant?'폐품 거인':'톱니봇',giant?65:22,angle,'melee');
    else if(target instanceof CoreSiegeMinionState)this.damageCoreSiegeMinion(target,minionDamage,device.ownerId);
    else if(target instanceof CoreSiegeStructureState)this.hitCoreSiegeStructure(target,structureDamage,device.ownerId);
    else target.hp=Math.max(0,target.hp-minionDamage);
    this.broadcast('coreSiegeEffect',{kind:'summonAttack',deviceKind:device.kind,ownerId:device.ownerId,x1:device.x,y1:device.y,x2:target.x,y2:target.y,radius:device.radius,duration:.3});
  }

  private castCoreSiegeGravityRepulse(p:PlayerState,rank:number,power:number){
    const radius=250+rank*12,push=105+rank*14;
    for(const target of this.state.players.values()){
      if(!target.alive||target.id===p.id||this.sameCombatTeam(p,target))continue;
      const d=distance(p.x,p.y,target.x,target.y),angle=Math.atan2(target.y-p.y,target.x-p.x);if(d>radius||Math.abs(this.angleDiff(angle,p.angle))>.82)continue;
      this.tryMove(target,Math.cos(angle)*push,Math.sin(angle)*push);this.damage(target,(14+rank*3)*power,p.id,'반발 충격',70,angle,'other');
    }
    for(const minion of this.state.coreSiege.minions.values()){
      const d=distance(p.x,p.y,minion.x,minion.y),angle=Math.atan2(minion.y-p.y,minion.x-p.x);if(minion.team===p.team||d>radius||Math.abs(this.angleDiff(angle,p.angle))>.82)continue;
      minion.x=clamp(minion.x+Math.cos(angle)*push,30,this.worldWidth-30);minion.y=clamp(minion.y+Math.sin(angle)*push,30,this.worldHeight-30);this.damageCoreSiegeMinion(minion,(24+rank*5)*power,p.id);
    }
    for(const [id,bullet] of this.state.bullets){const owner=this.state.players.get(bullet.owner),angle=Math.atan2(bullet.y-p.y,bullet.x-p.x);if(owner&&owner.team!==p.team&&distance(p.x,p.y,bullet.x,bullet.y)<=radius&&Math.abs(this.angleDiff(angle,p.angle))<=.9)this.state.bullets.delete(id);}
    this.broadcast('coreSiegeEffect',{kind:'gravityRepulse',ownerId:p.id,x:p.x,y:p.y,angle:p.angle,radius,duration:.65});
    return true;
  }

  private explodeCoreSiegeGravity(device:CoreSiegeDeviceState){
    const owner=this.state.players.get(device.ownerId);if(!owner)return;
    for(const target of this.state.players.values()){
      if(!target.alive||this.sameCombatTeam(owner,target))continue;
      const d=distance(device.x,device.y,target.x,target.y);if(d>device.radius)continue;
      const falloff=.5+.5*(1-d/device.radius);this.damageCoreSiegeAreaPlayer(target,48*falloff,device.ownerId,'중력 붕괴','gravity',120,Math.atan2(target.y-device.y,target.x-device.x));
    }
    this.damageCoreSiegeMinionsInRadius(device.x,device.y,device.radius,82,device.ownerId,.48);this.damageCoreSiegeStructuresInRadius(device.x,device.y,device.radius,28,device.ownerId,.45);
    this.broadcast('coreSiegeEffect',{kind:'gravityExplosion',ownerId:device.ownerId,x:device.x,y:device.y,radius:device.radius,duration:.8});
  }

  private castCoreSiegeSonicCone(p:PlayerState,rank:number,power:number){
    const radius=270+rank*14,halfArc=.72,push=90+rank*13;
    for(const target of this.state.players.values()){
      const angle=Math.atan2(target.y-p.y,target.x-p.x);if(!target.alive||target.id===p.id||this.sameCombatTeam(p,target)||distance(p.x,p.y,target.x,target.y)>radius||Math.abs(this.angleDiff(angle,p.angle))>halfArc)continue;
      this.damage(target,(18+rank*4)*power,p.id,'저음 폭발',push,angle,'other');
    }
    for(const minion of this.state.coreSiege.minions.values()){
      const angle=Math.atan2(minion.y-p.y,minion.x-p.x);if(minion.team===p.team||distance(p.x,p.y,minion.x,minion.y)>radius||Math.abs(this.angleDiff(angle,p.angle))>halfArc)continue;
      minion.x=clamp(minion.x+Math.cos(angle)*push,30,this.worldWidth-30);minion.y=clamp(minion.y+Math.sin(angle)*push,30,this.worldHeight-30);this.damageCoreSiegeMinion(minion,(38+rank*7)*power,p.id);
    }
    this.broadcast('coreSiegeEffect',{kind:'sonicCone',ownerId:p.id,x:p.x,y:p.y,angle:p.angle,radius,duration:.55});return true;
  }

  private startCoreSiegeSonicWave(p:PlayerState,rank:number,power:number){
    const id=`siege-wave-${++this.coreSiegeAbilitySeq}`,duration=1.65,radius=90+rank*7;
    this.coreSiegeWaveJobs.set(id,{id,ownerId:p.id,x:p.x+Math.cos(p.angle)*45,y:p.y+Math.sin(p.angle)*45,angle:p.angle,radius,speed:520,damage:25+rank*5,power,expiresAt:this.now()+duration,hitIds:new Set()});
    this.broadcast('coreSiegeEffect',{kind:'sonicWave',effectId:id,ownerId:p.id,x:p.x,y:p.y,angle:p.angle,radius,speed:520,duration});return true;
  }

  private updateCoreSiegeWaves(dt:number){
    const now=this.now();
    for(const [id,job] of [...this.coreSiegeWaveJobs]){
      const owner=this.state.players.get(job.ownerId);if(!owner||now>=job.expiresAt){this.coreSiegeWaveJobs.delete(id);continue;}
      const nextX=job.x+Math.cos(job.angle)*job.speed*dt,nextY=job.y+Math.sin(job.angle)*job.speed*dt;if(this.firstObstacleHitT(job.x,job.y,nextX,nextY,job.radius*.35)!==null){this.coreSiegeWaveJobs.delete(id);continue;}job.x=nextX;job.y=nextY;
      for(const target of this.state.players.values())if(target.alive&&!this.sameCombatTeam(owner,target)&&!job.hitIds.has(target.id)&&distance(job.x,job.y,target.x,target.y)<=job.radius){job.hitIds.add(target.id);this.damage(target,job.damage*job.power,job.ownerId,'공명 행진',125,job.angle,'other');}
      for(const minion of [...this.state.coreSiege.minions.values()])if(minion.team!==owner.team&&!job.hitIds.has(minion.id)&&distance(job.x,job.y,minion.x,minion.y)<=job.radius+minion.radius){job.hitIds.add(minion.id);this.damageCoreSiegeMinion(minion,job.damage*1.55*job.power,job.ownerId);}
      for(const [bulletId,bullet] of this.state.bullets){const bulletOwner=this.state.players.get(bullet.owner);if(bulletOwner&&bulletOwner.team!==owner.team&&distance(job.x,job.y,bullet.x,bullet.y)<=job.radius)this.state.bullets.delete(bulletId);}
    }
  }

  private updateCoreSiegeVolleysAndCables(){
    const now=this.now();
    for(const [id,job] of [...this.coreSiegeVolleyJobs]){
      const owner=this.state.players.get(job.ownerId);if(!owner?.alive||now>=job.endsAt||job.interruptible&&owner.werewolf.actionLockedUntil>now){this.coreSiegeVolleyJobs.delete(id);this.coreSiegeBarrageSlowUntil.delete(job.ownerId);continue;}
      if(now<job.nextAt)continue;job.nextAt=now+job.interval;
      const shot=job.remaining-1,offset=((shot%7)-3)/3*job.spread,targetX=owner.x+Math.cos(job.angle+offset)*1100,targetY=owner.y+Math.sin(job.angle+offset)*1100;
      this.spawnCoreSiegeSkillBullets(owner,job.weaponId,targetX,targetY,1,0,job.damageMultiplier);job.remaining--;
      if(job.remaining<=0){this.coreSiegeVolleyJobs.delete(id);this.coreSiegeBarrageSlowUntil.delete(job.ownerId);}
    }
    for(const [ownerId,job] of [...this.coreSiegeCableJobs]){
      const owner=this.state.players.get(ownerId),target=this.state.players.get(job.targetId);
      if(!owner?.alive||!target?.alive||distance(owner.x,owner.y,target.x,target.y)>job.breakDistance){this.coreSiegeCableJobs.delete(ownerId);this.broadcast('coreSiegeEffect',{kind:'cableBreak',ownerId,targetId:job.targetId,x:target?.x??owner?.x??0,y:target?.y??owner?.y??0,duration:.35});continue;}
      if(now<job.expiresAt)continue;this.coreSiegeCableJobs.delete(ownerId);this.applyCoreSiegeCrowdControl(target,1.5,1.8);this.damage(target,job.damage*job.power,owner.id,'구속 케이블',0,undefined,'other');this.broadcast('coreSiegeEffect',{kind:'cableBind',ownerId,targetId:target.id,x1:owner.x,y1:owner.y,x2:target.x,y2:target.y,radius:70,duration:1.5});
    }
  }

  private castCoreSiegeHammerSlam(p:PlayerState,rank:number,power:number,rawCharge:number){
    const charge=clamp(Number.isFinite(rawCharge)?rawCharge:0,0,1.2)/1.2,range=205+rank*11,halfArc=.88,chargePower=.68+charge*.42;
    for(const target of this.state.players.values()){
      const angle=Math.atan2(target.y-p.y,target.x-p.x);if(!target.alive||target.id===p.id||this.sameCombatTeam(p,target)||distance(p.x,p.y,target.x,target.y)>range||Math.abs(this.angleDiff(angle,p.angle))>halfArc)continue;
      this.damage(target,(30+rank*5)*chargePower*power,p.id,'균열 강타',95+charge*70,angle,'melee');
    }
    for(const minion of [...this.state.coreSiege.minions.values()]){
      const angle=Math.atan2(minion.y-p.y,minion.x-p.x);if(minion.team===p.team||distance(p.x,p.y,minion.x,minion.y)>range+minion.radius||Math.abs(this.angleDiff(angle,p.angle))>halfArc)continue;
      this.damageCoreSiegeMinion(minion,(62+rank*9)*chargePower*power,p.id);
    }
    for(const structure of this.state.coreSiege.structures.values()){
      const angle=Math.atan2(structure.y-p.y,structure.x-p.x);if(structure.destroyed||structure.team===p.team||distance(p.x,p.y,structure.x,structure.y)>range+structure.radius||Math.abs(this.angleDiff(angle,p.angle))>halfArc)continue;
      this.hitCoreSiegeStructure(structure,(22+rank*3)*chargePower*power*.55,p.id);
    }
    this.broadcast('coreSiegeEffect',{kind:'hammerSlam',ownerId:p.id,x:p.x,y:p.y,angle:p.angle,radius:range,charge,duration:.65});
    return true;
  }

  private castCoreSiegeChainHook(p:PlayerState,point:Point,rank:number,power:number){
    const range=520+rank*18,clamped=clampCoreSiegeTarget(p,point,range),endX=clamped.x,endY=clamped.y;
    const candidates:Array<{target:PlayerState|CoreSiegeMinionState;t:number}>=[];
    for(const target of this.state.players.values()){
      if(!target.alive||target.id===p.id||this.sameCombatTeam(p,target))continue;
      const t=segmentCircleIntersectionT(p.x,p.y,endX,endY,target.x,target.y,PLAYER_HIT_RADIUS+12);if(t!==null)candidates.push({target,t});
    }
    for(const target of this.state.coreSiege.minions.values()){
      if(target.team===p.team)continue;const t=segmentCircleIntersectionT(p.x,p.y,endX,endY,target.x,target.y,target.radius+12);if(t!==null)candidates.push({target,t});
    }
    const hit=candidates.sort((a,b)=>a.t-b.t)[0],now=this.now(),target=hit?.target,hitX=target?.x??endX,hitY=target?.y??endY;
    this.broadcast('coreSiegeEffect',{kind:'chainHook',phase:'flight',hit:Boolean(target),ownerId:p.id,targetId:target?.id??'',x:p.x,y:p.y,x1:p.x,y1:p.y,x2:hitX,y2:hitY,angle:p.angle,radius:range,duration:target?.22:.44});
    if(target)this.coreSiegeChainPullJobs.set(p.id,{ownerId:p.id,targetId:target.id,targetKind:target instanceof PlayerState?'player':'minion',latchAt:now+.2,pullStartedAt:now+.3,pullDuration:.34,pullStartX:target.x,pullStartY:target.y,rank,power,latched:false});
    return true;
  }

  private updateCoreSiegeChainPulls(){
    const now=this.now();
    for(const [ownerId,job] of this.coreSiegeChainPullJobs){
      const owner=this.state.players.get(ownerId),target=job.targetKind==='player'?this.state.players.get(job.targetId):this.state.coreSiege.minions.get(job.targetId);
      if(!owner?.alive||!target||(target instanceof PlayerState&&!target.alive)){this.coreSiegeChainPullJobs.delete(ownerId);continue;}
      if(now<job.latchAt)continue;
      if(!job.latched){
        job.latched=true;job.pullStartX=target.x;job.pullStartY=target.y;
        const angle=Math.atan2(owner.y-target.y,owner.x-target.x);
        if(target instanceof PlayerState)this.damage(target,(18+job.rank*3)*job.power,owner.id,'사슬 포획',35,angle+Math.PI,'melee');
        else this.damageCoreSiegeMinion(target,(36+job.rank*6)*job.power,owner.id);
        this.broadcast('coreSiegeEffect',{kind:'chainLatch',ownerId,targetId:target.id,x:target.x,y:target.y,radius:42,duration:.18});
        this.broadcast('coreSiegeEffect',{kind:'chainPull',ownerId,targetId:target.id,targetKind:job.targetKind,x1:owner.x,y1:owner.y,x2:target.x,y2:target.y,radius:72,duration:job.pullDuration+.1});
      }
      if(now<job.pullStartedAt)continue;
      const progress=clamp((now-job.pullStartedAt)/job.pullDuration,0,1),towardTarget=Math.atan2(target.y-owner.y,target.x-owner.x),desiredGap=PLAYER_BODY_RADIUS+PLAYER_HIT_RADIUS+20,endX=owner.x+Math.cos(towardTarget)*desiredGap,endY=owner.y+Math.sin(towardTarget)*desiredGap,targetX=job.pullStartX+(endX-job.pullStartX)*progress,targetY=job.pullStartY+(endY-job.pullStartY)*progress;
      if(target instanceof PlayerState)this.tryMove(target,targetX-target.x,targetY-target.y);
      else if(this.firstObstacleHitT(target.x,target.y,targetX,targetY,Math.max(4,target.radius*.45))===null){target.x=clamp(targetX,target.radius,this.worldWidth-target.radius);target.y=clamp(targetY,target.radius,this.worldHeight-target.radius);}
      if(progress>=1){this.coreSiegeChainPullJobs.delete(ownerId);if(target instanceof PlayerState)this.coreSiegeChainComboTargets.set(ownerId,{targetId:target.id,expiresAt:now+2.5});this.broadcast('coreSiegeEffect',{kind:'chainPullEnd',ownerId,targetId:target.id,x:target.x,y:target.y,radius:58,duration:.22});}
    }
  }

  private castCoreSiegeExecutionZone(p:PlayerState,point:Point,rank:number,power:number){
    const target=[...this.state.players.values()].filter((candidate)=>candidate.alive&&candidate.id!==p.id&&!this.sameCombatTeam(p,candidate)&&distance(candidate.x,candidate.y,point.x,point.y)<=165+rank*8).sort((a,b)=>distance(a.x,a.y,point.x,point.y)-distance(b.x,b.y,point.x,point.y))[0];
    if(!target)return false;
    const duration=3.1+rank*.25,device=this.createCoreSiegeDevice(p,'executionStake',target.x,target.y,225+rank*8,115+rank*35,duration);
    this.coreSiegeExecutionZones.set(device.id,{targetId:target.id,power,rank});
    this.broadcast('coreSiegeEffect',{kind:'executionZone',effectId:device.id,ownerId:p.id,targetId:target.id,x:device.x,y:device.y,x1:device.x,y1:device.y,x2:target.x,y2:target.y,radius:device.radius,duration});
    return true;
  }

  private startCoreSiegeBladeRush(p:PlayerState,point:Point,rank:number,power:number,ultimate:boolean){
    const range=ultimate?720:480,aim=clampCoreSiegeTarget(p,point,range),angle=Math.atan2(aim.y-p.y,aim.x-p.x),sideX=-Math.sin(angle),sideY=Math.cos(angle),forwardX=Math.cos(angle),forwardY=Math.sin(angle);
    const points=ultimate
      ?[{x:aim.x+sideX*105-forwardX*55,y:aim.y+sideY*105-forwardY*55},{x:aim.x-sideX*105,y:aim.y-sideY*105},{x:aim.x+forwardX*135,y:aim.y+forwardY*135}]
      :[{x:aim.x+sideX*72,y:aim.y+sideY*72},{x:aim.x-sideX*72,y:aim.y-sideY*72}];
    this.broadcast('coreSiegeEffect',{kind:ultimate?'bladeDanceGuide':'bladeCrossGuide',ownerId:p.id,x:p.x,y:p.y,x1:p.x,y1:p.y,x2:aim.x,y2:aim.y,angle,radius:ultimate?165:115,duration:ultimate?.72:.45});
    return this.dashCoreSiegeHero(p,points[0]!,range,ultimate?27+rank*4:19+rank*3,power,ultimate?'bladeUltimate':'blade',points.slice(1));
  }

  private resolveCoreSiegeHammerLanding(p:PlayerState,power:number){
    const radius=178;
    for(const target of this.state.players.values())if(target.alive&&target.id!==p.id&&!this.sameCombatTeam(p,target)&&distance(p.x,p.y,target.x,target.y)<=radius){this.damage(target,42*power,p.id,'대지 분쇄',165,Math.atan2(target.y-p.y,target.x-p.x),'melee');this.applyCoreSiegeCrowdControl(target,1,1.25);}
    this.damageCoreSiegeMinionsInRadius(p.x,p.y,radius,88*power,p.id,.7);
    this.damageCoreSiegeStructuresInRadius(p.x,p.y,radius,22*power,p.id,.5);
    this.broadcast('coreSiegeEffect',{kind:'hammerLanding',ownerId:p.id,x:p.x,y:p.y,radius,duration:.8});
  }

  private createCoreSiegeSmoke(p:PlayerState,x:number,y:number,rank:number){
    const field=new SmokeFieldState(),now=this.now();field.id=`smoke-${++this.smokeSeq}`;field.ownerId=p.id;field.x=x;field.y=y;field.maxRadius=190+rank*16;field.radius=0;field.startedAt=now;field.expiresAt=now+(SMOKE_TIMING.growMs+SMOKE_TIMING.holdMs+SMOKE_TIMING.fadeMs)/1000;field.buildingId='';this.state.smokeFields.set(field.id,field);
    this.broadcast('coreSiegeEffect',{kind:'tacticalSmoke',effectId:field.id,ownerId:p.id,x,y,radius:field.maxRadius,duration:(field.expiresAt-now)});this.emitAudioEvent('smoke_deploy',{sourceId:field.id,ownerId:p.id,x,y,buildingId:'',radius:field.maxRadius});return true;
  }

  private markCoreSiegeHuntTarget(p:PlayerState,x:number,y:number,rank:number){
    const target=[...this.state.players.values()].filter((candidate)=>candidate.alive&&candidate.id!==p.id&&!this.sameCombatTeam(p,candidate)&&distance(candidate.x,candidate.y,x,y)<=155+rank*8).sort((a,b)=>distance(a.x,a.y,x,y)-distance(b.x,b.y,x,y))[0];if(!target)return false;
    const duration=6+rank;this.coreSiegeHuntMarks.set(p.id,{targetId:target.id,expiresAt:this.now()+duration});this.broadcast('coreSiegeEffect',{kind:'huntMark',ownerId:p.id,targetId:target.id,x:target.x,y:target.y,radius:75,duration});return true;
  }

  private dashCoreSiegeHero(p:PlayerState,target:Point,range:number,damage:number,power:number,dashStyle:CoreSiegeDashJob['style'],remaining:Point[]=[],positionStyle?:string){
    const clamped=clampCoreSiegeTarget(p,target,range);
    const destination=this.findNearestFreePoint(clamped.x,clamped.y,120,false)??clamped;
    const startX=p.x,startY=p.y,endX=clamp(destination.x,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS),endY=clamp(destination.y,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
    const angle=Math.atan2(endY-startY,endX-startX),duration=clamp(distance(startX,startY,endX,endY)/1100,.18,.3);
    const safeRemaining=remaining.map((next)=>{const clampedNext=clampCoreSiegeTarget(p,next,range),free=this.findNearestFreePoint(clampedNext.x,clampedNext.y,120,false)??clampedNext;return{x:clamp(free.x,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS),y:clamp(free.y,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS)};});
    this.coreSiegeDashJobs.set(p.id,{ownerId:p.id,startX,startY,endX,endY,startedAt:this.now(),duration,damage,power,angle,hitPlayerIds:new Set(),hitMinionIds:new Set(),style:dashStyle,remaining:safeRemaining,positionStyle});
    this.broadcast('coreSiegeEffect',{kind:'heroDash',dashStyle,positionStyle,ownerId:p.id,x:endX,y:endY,x1:startX,y1:startY,x2:endX,y2:endY,angle,radius:110,duration});
    return true;
  }

  private updateCoreSiegeDashes(){
    const now=this.now();
    for(const [ownerId,job] of this.coreSiegeDashJobs){
      const p=this.state.players.get(ownerId);
      if(!p?.alive){this.coreSiegeDashJobs.delete(ownerId);continue;}
      const progress=clamp((now-job.startedAt)/job.duration,0,1),targetX=job.startX+(job.endX-job.startX)*progress,targetY=job.startY+(job.endY-job.startY)*progress;
      this.tryMove(p,targetX-p.x,targetY-p.y);
      const blocker=[...this.state.coreSiege.devices.values()].find((device)=>device.kind==='seismicStake'&&device.team!==p.team&&device.hp>0&&distance(p.x,p.y,device.x,device.y)<=device.radius+PLAYER_BODY_RADIUS);
      if(blocker){this.coreSiegeDashJobs.delete(ownerId);this.broadcast('coreSiegeEffect',{kind:'dashBlocked',ownerId,deviceId:blocker.id,x:p.x,y:p.y,radius:72,duration:.45});continue;}
      if(job.damage>0)for(const targetPlayer of this.state.players.values()){
        if(!targetPlayer.alive||targetPlayer.id===p.id||job.hitPlayerIds.has(targetPlayer.id)||this.sameCombatTeam(p,targetPlayer)||distance(p.x,p.y,targetPlayer.x,targetPlayer.y)>105)continue;
        job.hitPlayerIds.add(targetPlayer.id);this.damage(targetPlayer,job.damage*job.power,p.id,'돌진 충격',150,job.angle,'melee');
      }
      if(job.damage>0)for(const minion of this.state.coreSiege.minions.values()){
        if(minion.team===p.team||job.hitMinionIds.has(minion.id)||distance(p.x,p.y,minion.x,minion.y)>115+minion.radius)continue;
        job.hitMinionIds.add(minion.id);this.damageCoreSiegeMinion(minion,job.damage*1.25*job.power,p.id);
      }
      if(distance(p.x,p.y,targetX,targetY)>18){this.coreSiegeDashJobs.delete(ownerId);continue;}
      if(progress<1)continue;
      const next=job.remaining.shift();
      if(next){job.startX=p.x;job.startY=p.y;job.endX=next.x;job.endY=next.y;job.startedAt=now;job.angle=Math.atan2(next.y-p.y,next.x-p.x);job.duration=clamp(distance(p.x,p.y,next.x,next.y)/1150,.14,.28);this.broadcast('coreSiegeEffect',{kind:'heroDash',dashStyle:job.style,positionStyle:job.positionStyle,ownerId,x:next.x,y:next.y,x1:p.x,y1:p.y,x2:next.x,y2:next.y,angle:job.angle,radius:110,duration:job.duration});continue;}
      this.coreSiegeDashJobs.delete(ownerId);
      if(job.style==='hammer')this.resolveCoreSiegeHammerLanding(p,job.power);
    }
  }

  private startCoreSiegeIronSpin(p:PlayerState,rank:number,power:number){
    const duration=2.8+(rank-1)*.125,now=this.now(),progress=this.coreSiegePlayer(p.id);
    progress.spinUntil=now+duration;
    this.coreSiegeSpinJobs.set(p.id,{ownerId:p.id,endsAt:progress.spinUntil,nextHitAt:now,power,rank,hitCounts:new Map()});
    this.broadcast('coreSiegeEffect',{kind:'ironSpin',ownerId:p.id,x:p.x,y:p.y,radius:112,duration});
    return true;
  }

  private updateCoreSiegeIronSpins(){
    const now=this.now();
    for(const [ownerId,job] of [...this.coreSiegeSpinJobs]){
      const p=this.state.players.get(ownerId),progress=p?this.coreSiegePlayer(ownerId):undefined;
      if(!p?.alive||now>=job.endsAt){if(progress)progress.spinUntil=0;this.coreSiegeSpinJobs.delete(ownerId);continue;}
      if(now<job.nextHitAt)continue;
      job.nextHitAt=now+.22;
      const radius=104+job.rank*3,damage=(10+job.rank*2)*job.power*(now<(progress?.rampageUntil??0)?1.18:1);
      for(const target of this.state.players.values()){
        if(!target.alive||target.id===ownerId||this.sameCombatTeam(p,target)||distance(p.x,p.y,target.x,target.y)>radius)continue;
        const hits=job.hitCounts.get(target.id)??0;if(hits>=5)continue;
        job.hitCounts.set(target.id,hits+1);this.damage(target,damage,ownerId,'회전 강습',28,Math.atan2(target.y-p.y,target.x-p.x),'melee');
      }
      for(const minion of [...this.state.coreSiege.minions.values()]){
        if(minion.team===p.team||distance(p.x,p.y,minion.x,minion.y)>radius+minion.radius)continue;
        const hits=job.hitCounts.get(minion.id)??0;if(hits>=5)continue;
        job.hitCounts.set(minion.id,hits+1);this.damageCoreSiegeMinion(minion,damage*1.45,ownerId);
      }
      for(const structure of this.state.coreSiege.structures.values())if(!structure.destroyed&&structure.team!==p.team&&distance(p.x,p.y,structure.x,structure.y)<=radius+structure.radius)this.hitCoreSiegeStructure(structure,damage*.16,ownerId);
      this.broadcast('coreSiegeEffect',{kind:'ironSpinTick',ownerId,x:p.x,y:p.y,radius,duration:.26});
    }
  }

  private activateCoreSiegeRobot(p:PlayerState,kind:ExoSuitKind,rank:number){
    const tactical=this.tacticalInventory(p.id);
    if(tactical.exoActive||tactical.exoAssembling)return false;
    const now=this.now(),duration=(kind==='emp'?CORE_SIEGE_CONFIG.robotEmpDurationSeconds:CORE_SIEGE_CONFIG.robotRedDurationSeconds)+(rank-1);
    tactical.exoKind=kind;tactical.exoActive=true;tactical.exoAssembling=false;tactical.exoHp=CORE_SIEGE_CONFIG.robotMaxHp*(1+(rank-1)*.1);tactical.exoEndsAt=now+duration;tactical.empDisabledUntil=0;tactical.empPulseReadyAt=kind==='emp'?now:0;
    this.cancelReload(p);this.cancelHeal(p);this.cancelThrow(p);p.isSniperScoped=false;
    this.broadcast('coreSiegeEffect',{kind:'robotActivate',ownerId:p.id,robotKind:kind,x:p.x,y:p.y,radius:120,duration});
    this.emitAudioEvent('exo_activate',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:kind});
    return true;
  }

  private activateCoreSiegeWerewolf(p:PlayerState,rank:number){
    const now=this.now(),w=p.werewolf;
    if(w.transformed)return false;
    w.hasCurse=false;w.transformPreparing=false;w.transformed=true;w.transformEndsAt=now+8+(rank-1)*1.5;w.sprintGauge=1;w.sprinting=false;w.sprintRechargeAt=now;w.silverSlowUntil=0;
    this.broadcast('coreSiegeEffect',{kind:'werewolfTransform',ownerId:p.id,x:p.x,y:p.y,radius:105,duration:1});
    this.emitAudioEvent('werewolf_transform',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'core_siege'});
    return true;
  }

  private castCoreSiegeEmp(p:PlayerState,radius:number,damage:number,power:number,empStyle:'wave'|'grenade'){
    const now=this.now();
    for(const target of this.state.players.values()){
      if(!target.alive||this.sameCombatTeam(p,target)||target.id===p.id||distance(p.x,p.y,target.x,target.y)>radius)continue;
      this.applyStunGunHit(target,p.id);
      this.damage(target,damage*power,p.id,'EMP 파동',0,undefined,'bullet');
      const exo=this.tacticalInventory(target.id);
      if(exo.exoActive){exo.empDisabledUntil=Math.max(exo.empDisabledUntil,now+1.5);exo.exoEndsAt=Math.max(now,exo.exoEndsAt-2.5);}
    }
    for(const vehicle of this.state.motorcycles.values())if(!vehicle.destroyed&&distance(p.x,p.y,vehicle.x,vehicle.y)<=radius){vehicle.empDisabledUntil=Math.max(vehicle.empDisabledUntil,now+2.5);vehicle.velocityX=0;vehicle.velocityY=0;}
    for(const minion of this.state.coreSiege.minions.values())if(minion.team!==p.team&&distance(p.x,p.y,minion.x,minion.y)<=radius){minion.attackReadyAt=Math.max(minion.attackReadyAt,now+1.35);this.damageCoreSiegeMinion(minion,damage*1.5*power,p.id);}
    this.broadcast('coreSiegeEffect',{kind:'empPulse',empStyle,ownerId:p.id,x:p.x,y:p.y,radius,duration:1.1});
    return true;
  }

  private useCoreSiegeAbility(c:Client,message:any){
    const player=this.state.players.get(c.sessionId);
    if(player)this.castCoreSiegeAbility(player,Number(message?.slot) as CoreSiegeAbilitySlot,message,c);
  }

  private useCoreSiegePositioning(c:Client,message:any){
    const p=this.state.players.get(c.sessionId);
    if(!p||p.ai)return false;
    return this.castCoreSiegePositioning(p,message);
  }

  private castCoreSiegePositioning(p:PlayerState,message:any){
    if(this.gameMode!=='coreSiege'||!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting)return false;
    const tactical=this.tacticalInventory(p.id),progress=this.coreSiegePlayer(p.id),heroId=normalizeCoreSiegeHero(progress.heroId),profile=CORE_SIEGE_POSITIONING[heroId],now=this.now();
    if(profile.kind!=='move'||tactical.exoActive||tactical.exoAssembling||now<progress.positioningReadyAt||now<progress.parryRecoveryUntil||now<(this.coreSiegePositioningLockedUntil.get(p.id)??0)||this.coreSiegeDashJobs.has(p.id))return false;
    const desired=this.coreSiegeAimPoint(p,message,profile.distance,70),aimAngle=Math.atan2(desired.y-p.y,desired.x-p.x),moveAngle=aimAngle+(profile.direction==='backward'?Math.PI:0),distanceScale=heroId==='wolfWarrior'&&p.werewolf.transformed?1.25:1,target={x:p.x+Math.cos(moveAngle)*profile.distance*distanceScale,y:p.y+Math.sin(moveAngle)*profile.distance*distanceScale};
    p.angle=aimAngle;progress.positioningReadyAt=now+profile.cooldown;this.coreSiegePositioningLockedUntil.set(p.id,now+.28);this.cancelHeal(p);this.cancelReload(p);this.cancelThrow(p);
    const used=this.dashCoreSiegeHero(p,target,profile.distance*distanceScale,0,1,'position',[],profile.style);
    if(used){this.broadcast('coreSiegeEffect',{kind:'positioningMove',positionStyle:profile.style,heroId,ownerId:p.id,x:p.x,y:p.y,x2:target.x,y2:target.y,angle:moveAngle,radius:75,duration:.35});this.emitAudioEvent('dash',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:profile.style});}
    return used;
  }

  private coreSiegeAbilityReadyAt(progress:CoreSiegePlayerState,slot:CoreSiegeAbilitySlot){
    return slot===1?progress.ability1ReadyAt:slot===2?progress.ability2ReadyAt:progress.ultimateReadyAt;
  }

  private setCoreSiegeAbilityReadyAt(progress:CoreSiegePlayerState,slot:CoreSiegeAbilitySlot,readyAt:number){
    if(slot===1)progress.ability1ReadyAt=readyAt;
    else if(slot===2)progress.ability2ReadyAt=readyAt;
    else progress.ultimateReadyAt=readyAt;
  }

  private castCoreSiegeAbility(p:PlayerState,slot:CoreSiegeAbilitySlot,message:any,c?:Client){
    if(this.gameMode!=='coreSiege'||this.openArenaRoundLocked()||!p.alive||p.phase!=='landed'||p.isVaulting||p.isDriving||this.tacticalInventory(p.id).exoActive||this.now()<(this.coreSiegePositioningLockedUntil.get(p.id)??0)||!(slot===1||slot===2||slot===3))return false;
    const progress=this.coreSiegePlayer(p.id),heroId=normalizeCoreSiegeHero(progress.heroId),hero=CORE_SIEGE_HEROES[heroId],now=this.now();
    if(now<progress.parryRecoveryUntil)return false;
    const rank=this.coreSiegeAbilityRank(progress,slot);
    if(rank<=0){c?.send('notice',{type:'warning',message:`${hero.abilityNames[slot-1]} 스킬을 먼저 배워야 합니다.`});return false;}
    if(now<this.coreSiegeAbilityReadyAt(progress,slot)){c?.send('notice',{type:'warning',message:'스킬 재사용 대기 중입니다.'});return false;}
    const skillPower=coreSiegeAbilityPowerMultiplier(rank);
    const point=heroId==='medigel'
      ?this.coreSiegeSupportAimPoint(p,message,slot===3?700:CORE_SIEGE_CONFIG.grenadeRange,CORE_SIEGE_CONFIG.grenadeAimAssistRadius)
      :this.coreSiegeAimPoint(p,message,slot===3?900:CORE_SIEGE_CONFIG.grenadeRange,slot===1?CORE_SIEGE_CONFIG.grenadeAimAssistRadius:115);
    p.angle=Math.atan2(point.y-p.y,point.x-p.x);
    let used=false,skipCooldown=false,cooldownRefund=0;
    if(heroId==='vanguard'){
      if(slot===1)used=this.castCoreSiegeGrenade(p,point.x,point.y,skillPower,rank);
      else if(slot===2){this.spawnCoreSiegeSkillBullets(p,'stun_gun',point.x,point.y,5,.105,skillPower);used=true;}
      else{this.castCoreSiegePiercingBeam(p,point.x,point.y,skillPower,'vanguard');used=true;}
    }else if(heroId==='technician'){
      if(slot===1){const id=`siege-area-${++this.coreSiegeAbilitySeq}`,radius=215*(1+(rank-1)*.035);this.coreSiegeAreaJobs.set(id,{id,ownerId:p.id,kind:'adhesive',x:point.x,y:point.y,radius,detonatesAt:now,expiresAt:now+5,nextTickAt:now,power:skillPower});this.broadcast('coreSiegeEffect',{kind:'adhesiveArea',effectId:id,ownerId:p.id,x:point.x,y:point.y,radius,duration:5});used=true;}
      else if(slot===2)used=this.castCoreSiegeEmp(p,390+(rank-1)*18,14,skillPower,'wave');
      else{const tactical=this.tacticalInventory(p.id),count=Math.min(4,1+rank);tactical.hunterDroneCount=Math.min(4,tactical.hunterDroneCount+count);this.broadcast('coreSiegeEffect',{kind:'droneFormation',ownerId:p.id,x:p.x,y:p.y,angle:p.angle,count,radius:185,duration:.95});used=Boolean(this.launchHunterDronesForPlayer(p,undefined,count));}
    }else if(heroId==='trapper'){
      const tactical=this.tacticalInventory(p.id);
      if(slot===1){tactical.spiderMineCount+=rank>=4?2:1;used=this.placeSpiderMineForPlayer(p,c);}
      else if(slot===2){tactical.stripTrapCount+=rank>=4?2:1;used=this.placeStripTrapForPlayer(p,c);}
      else{const old=p.angle,count=Math.min(5,2+rank);for(let index=0;index<count;index++){p.angle=old+(index-(count-1)/2)*.16;this.spawnBombRcCar(p);}p.angle=old;this.broadcast('coreSiegeEffect',{kind:'rcSwarm',ownerId:p.id,x:p.x,y:p.y,angle:p.angle,radius:160+rank*15});used=true;}
    }else if(heroId==='trickster'){
      if(slot===1){this.spawnCoreSiegeSkillBullets(p,'chicken_blaster',point.x,point.y,1,0,skillPower);used=true;}
      else if(slot===2){this.spawnCoreSiegeSkillBullets(p,'boomerang',point.x,point.y,1,0,skillPower);used=true;}
      else{this.spawnCoreSiegeSkillBullets(p,'chicken_blaster',point.x,point.y,7+rank*2,.07,skillPower);this.broadcast('coreSiegeEffect',{kind:'chickenVolley',ownerId:p.id,x:p.x,y:p.y,angle:p.angle,radius:430+rank*18});used=true;}
    }else if(heroId==='medigel'){
      if(slot===1){
        const target=[...this.state.players.values()].filter((candidate)=>candidate.alive&&!this.tacticalInventory(candidate.id).exoActive&&(candidate.id===p.id||this.sameCombatTeam(p,candidate))&&distance(candidate.x,candidate.y,point.x,point.y)<=120).sort((a,b)=>a.hp-b.hp)[0]??p;
        this.healPlayer(target,28+rank*7);target.werewolf.silverSlowUntil=0;target.werewolf.adhesiveSlowUntil=0;target.werewolf.adhesiveSlowStage=0;
        this.broadcast('coreSiegeEffect',{kind:'emergencyGel',ownerId:p.id,targetId:target.id,x:target.x,y:target.y,radius:72,duration:.7});used=true;
      }else if(slot===2){this.createCoreSiegeDevice(p,'regenFoam',point.x,point.y,185+rank*8,120+rank*30,6+rank*.5);used=true;}
      else{const device=this.createCoreSiegeDevice(p,'lifeSupport',point.x,point.y,285+rank*15,180+rank*50,8+rank);this.broadcast('coreSiegeEffect',{kind:'lifeSupportDeploy',effectId:device.id,ownerId:p.id,x:device.x,y:device.y,radius:device.radius,duration:1.15});used=true;}
    }else if(heroId==='fireEngineer'){
      if(slot===1){this.createCoreSiegeDevice(p,'fireCapsule',point.x,point.y,150+rank*8,100,4.5+rank*.4);used=true;}
      else if(slot===2){this.createCoreSiegeDevice(p,'fireWall',point.x,point.y,235+rank*10,160,6+rank*.5);used=true;}
      else{this.createCoreSiegeDevice(p,'fireStorm',p.x,p.y,340+rank*15,260,7+rank);used=true;}
    }else if(heroId==='orbitalSniper'){
      if(slot===1){
        const target=[...this.state.players.values()].filter((candidate)=>candidate.alive&&!this.sameCombatTeam(p,candidate)&&candidate.id!==p.id&&distance(candidate.x,candidate.y,point.x,point.y)<=150).sort((a,b)=>distance(a.x,a.y,point.x,point.y)-distance(b.x,b.y,point.x,point.y))[0];
        if(target)this.coreSiegePlayer(target.id).markedUntil=now+4+rank*.5;
        this.spawnCoreSiegeSkillBullets(p,'sniper',point.x,point.y,1,0,.82*skillPower);used=true;
      }else if(slot===2){progress.hasteUntil=now+5+rank*.5;this.broadcast('coreSiegeEffect',{kind:'orbitalFocus',ownerId:p.id,x:p.x,y:p.y,radius:80,duration:5});used=true;}
      else{this.castCoreSiegePiercingBeam(p,point.x,point.y,skillPower,'railgun');used=true;}
    }else if(heroId==='wolfWarrior'){
      if(slot===1)used=this.dashCoreSiegeHero(p,point,260+rank*12,24+rank*5,skillPower,'wolf');
      else if(slot===2){progress.hasteUntil=now+5+rank;this.broadcast('coreSiegeEffect',{kind:'hunterHowl',ownerId:p.id,x:p.x,y:p.y,radius:420+rank*15,duration:1});used=true;}
      else used=this.activateCoreSiegeWerewolf(p,rank);
    }else if(heroId==='shieldCaptain'){
      if(slot===1){this.createCoreSiegeDevice(p,'shieldField',p.x+Math.cos(p.angle)*90,p.y+Math.sin(p.angle)*90,175+rank*10,180+rank*35,6+rank*.5,p.angle);used=true;}
      else if(slot===2)used=this.dashCoreSiegeHero(p,point,300+rank*14,28+rank*5,skillPower,'shield');
      else{for(const target of this.state.players.values())if(target.alive&&(target.id===p.id||this.sameCombatTeam(p,target))&&distance(p.x,p.y,target.x,target.y)<=430){const ally=this.coreSiegePlayer(target.id);ally.temporaryShield=Math.max(ally.temporaryShield,48+rank*12);ally.temporaryShieldEndsAt=now+7;}this.broadcast('coreSiegeEffect',{kind:'shieldFormation',ownerId:p.id,x:p.x,y:p.y,radius:430,duration:1});used=true;}
    }else if(heroId==='demolitionist'){
      if(slot===1)used=this.castCoreSiegeStickyBomb(p,point.x,point.y,skillPower,rank);
      else if(slot===2){this.spawnExoMissile(p,message);used=true;}
      else{
        const angle=Math.atan2(point.y-p.y,point.x-p.x),halfLength=550,startX=clamp(point.x-Math.cos(angle)*halfLength,90,this.worldWidth-90),startY=clamp(point.y-Math.sin(angle)*halfLength,90,this.worldHeight-90),endX=clamp(point.x+Math.cos(angle)*halfLength,90,this.worldWidth-90),endY=clamp(point.y+Math.sin(angle)*halfLength,90,this.worldHeight-90),warning=1.05,bombInterval=.16,count=7;
        for(let index=0;index<count;index++){const t=index/(count-1),id=`siege-carpet-${++this.coreSiegeAbilitySeq}`,x=startX+(endX-startX)*t,y=startY+(endY-startY)*t,radius=CORE_SIEGE_CONFIG.grenadeRadius*CORE_SIEGE_CONFIG.carpetBombingRadiusMultiplier,detonatesAt=now+warning+index*bombInterval;this.coreSiegeAreaJobs.set(id,{id,ownerId:p.id,kind:'grenade',x,y,radius,detonatesAt,expiresAt:detonatesAt+1,nextTickAt:0,power:CORE_SIEGE_CONFIG.carpetBombingPower*skillPower,damageGroup:'barrage'});}
        this.broadcast('coreSiegeEffect',{kind:'carpetBombing',ownerId:p.id,x:point.x,y:point.y,x1:startX,y1:startY,x2:endX,y2:endY,angle,width:300,bombCount:count,warning,planeDuration:.65,bombInterval,radius:CORE_SIEGE_CONFIG.grenadeRadius*.72,duration:warning+.65+(count-1)*bombInterval+1});used=true;
      }
    }else if(heroId==='steelPilot'){
      if(slot===1){this.spawnExoMissile(p,message);used=true;}
      else if(slot===2)used=this.dashCoreSiegeHero(p,point,280+rank*12,25+rank*5,skillPower,'steel');
      else used=this.activateCoreSiegeRobot(p,'assault',rank);
    }else if(heroId==='empPilot'){
      if(slot===1){this.spawnCoreSiegeSkillBullets(p,'stun_gun',point.x,point.y,2+rank,.07,skillPower);used=true;}
      else if(slot===2)used=this.castCoreSiegeEmp(p,285+rank*18,12,skillPower,'grenade');
      else used=this.activateCoreSiegeRobot(p,'emp',rank);
    }else if(heroId==='ironCyclone'){
      if(slot===1)used=this.startCoreSiegeIronSpin(p,rank,skillPower);
      else if(slot===2){progress.temporaryShield=Math.max(progress.temporaryShield,32+rank*8);progress.temporaryShieldEndsAt=now+3;used=this.dashCoreSiegeHero(p,point,300+rank*16,24+rank*5,skillPower,'iron');}
      else{progress.rampageUntil=now+6+rank;progress.temporaryShield=Math.max(progress.temporaryShield,24+rank*6);progress.temporaryShieldEndsAt=now+3;this.broadcast('coreSiegeEffect',{kind:'ironRampage',ownerId:p.id,x:p.x,y:p.y,radius:125,duration:6+rank});used=true;}
    }else if(heroId==='scrapSummoner'){
      if(slot===1)used=this.spawnCoreSiegeSummon(p,'gearling',rank,2);
      else if(slot===2)used=this.commandCoreSiegeSummons(p,point.x,point.y,rank);
      else used=this.spawnCoreSiegeSummon(p,'scrapGiant',rank);
    }else if(heroId==='gravityWarden'){
      if(slot===1){this.createCoreSiegeDevice(p,'gravityAnchor',point.x,point.y,185+rank*12,105+rank*22,4.5+rank*.35);used=true;}
      else if(slot===2)used=this.castCoreSiegeGravityRepulse(p,rank,skillPower);
      else{this.createCoreSiegeDevice(p,'gravityCollapse',point.x,point.y,245+rank*15,90,1.35);this.broadcast('coreSiegeEffect',{kind:'gravityCollapse',ownerId:p.id,x:point.x,y:point.y,radius:245+rank*15,duration:1.35});used=true;}
    }else if(heroId==='smokeTracker'){
      if(slot===1)used=this.dashCoreSiegeHero(p,point,380+rank*18,8+rank*2,skillPower,'grapple');
      else if(slot===2)used=this.createCoreSiegeSmoke(p,point.x,point.y,rank);
      else used=this.markCoreSiegeHuntTarget(p,point.x,point.y,rank);
    }else if(heroId==='sonicCommander'){
      if(slot===1)used=this.castCoreSiegeSonicCone(p,rank,skillPower);
      else if(slot===2){const duration=5+rank*.5;for(const target of this.state.players.values())if(target.alive&&(target.id===p.id||this.sameCombatTeam(p,target))&&distance(p.x,p.y,target.x,target.y)<=400+rank*15)this.coreSiegePlayer(target.id).marchUntil=now+duration;this.broadcast('coreSiegeEffect',{kind:'marchBeat',ownerId:p.id,x:p.x,y:p.y,radius:400+rank*15,duration});used=true;}
      else used=this.startCoreSiegeSonicWave(p,rank,skillPower);
    }else if(heroId==='earthHammer'){
      if(slot===1)used=this.castCoreSiegeHammerSlam(p,rank,skillPower,Number(message?.chargeSeconds));
      else if(slot===2){this.createCoreSiegeDevice(p,'seismicStake',point.x,point.y,170+rank*8,125+rank*30,5.5+rank*.5);used=true;}
      else used=this.dashCoreSiegeHero(p,point,390+rank*18,0,skillPower,'hammer');
    }else if(heroId==='chainExecutioner'){
      if(slot===1)used=this.castCoreSiegeChainHook(p,point,rank,skillPower);
      else if(slot===2){const combo=this.coreSiegeChainComboTargets.get(p.id),target=combo&&now<combo.expiresAt?this.state.players.get(combo.targetId):undefined;if(target?.alive&&distance(p.x,p.y,target.x,target.y)<=190){this.coreSiegeChainComboTargets.delete(p.id);this.applyCoreSiegeCrowdControl(target,1.1,1.35);this.damage(target,(12+rank*2)*skillPower,p.id,'형장의 말뚝',25,Math.atan2(target.y-p.y,target.x-p.x),'melee');this.broadcast('coreSiegeEffect',{kind:'chainStake',ownerId:p.id,targetId:target.id,x:target.x,y:target.y,radius:72,duration:.72});used=true;}else{const duration=2.1+rank*.18;progress.anchoredUntil=now+duration;progress.temporaryShield=Math.max(progress.temporaryShield,28+rank*9);progress.temporaryShieldEndsAt=Math.max(progress.temporaryShieldEndsAt,now+duration);this.broadcast('coreSiegeEffect',{kind:'chainAnchor',ownerId:p.id,x:p.x,y:p.y,radius:170,duration});used=true;}}
      else used=this.castCoreSiegeExecutionZone(p,point,rank,skillPower);
    }else if(heroId==='twinBlade'){
      if(slot===1)used=this.startCoreSiegeBladeRush(p,point,rank,skillPower,false);
      else if(slot===2){progress.parryUntil=now+.45;progress.parryRecoveryUntil=now+.75;this.broadcast('coreSiegeEffect',{kind:'bladeParry',ownerId:p.id,x:p.x,y:p.y,angle:p.angle,radius:92,duration:.75});used=true;}
      else used=this.startCoreSiegeBladeRush(p,point,rank,skillPower,true);
    }else if(heroId==='burstTrooper'){
      if(slot===1){this.startCoreSiegeVolley(p,'smg',point,2,.12,0,1.15*skillPower,false);used=true;}
      else if(slot===2){used=this.dashCoreSiegeHero(p,point,300,0,1,'position',[],'slide');if(used){progress.hasteUntil=now+1.5;this.broadcast('coreSiegeEffect',{kind:'burstEvasion',ownerId:p.id,x:p.x,y:p.y,angle:p.angle,radius:90,duration:1.5});}}
      else{this.startCoreSiegeVolley(p,'smg',point,22,.115,.42,.72*skillPower,true);this.coreSiegeBarrageSlowUntil.set(p.id,now+2.6);this.broadcast('coreSiegeEffect',{kind:'fullMagazineBarrage',ownerId:p.id,x:p.x,y:p.y,angle:p.angle,radius:620,duration:2.6});used=true;}
    }else if(heroId==='phaseMarksman'){
      if(slot===1){const hit=this.castCoreSiegeLineStrike(p,point,980,18,34*skillPower,58*skillPower,1,0,'phaseShot');cooldownRefund=hit.playerHits?1.2:hit.minionHits?.6:0;used=true;}
      else if(slot===2){used=this.dashCoreSiegeHero(p,point,380,0,1,'position',[],'phase');if(used)this.spawnCoreSiegeSkillBullets(p,'pistol',point.x,point.y,1,0,1.3*skillPower);}
      else{this.castCoreSiegePiercingBeam(p,point.x,point.y,skillPower,'phase');used=true;}
    }else if(heroId==='opticArtillerist'){
      if(slot===1){this.castCoreSiegeLineStrike(p,point,900,30,24*skillPower,52*skillPower,2,.8,'condensedRay');used=true;}
      else if(slot===2){const existing=[...this.coreSiegeAreaJobs.values()].find((job)=>job.ownerId===p.id&&job.kind==='sticky');if(existing){existing.detonatesAt=now;existing.expiresAt=Math.max(existing.expiresAt,now+.2);skipCooldown=true;}else this.castCoreSiegeStickyBomb(p,point.x,point.y,.8*skillPower,rank);used=true;}
      else{this.castCoreSiegePiercingBeam(p,point.x,point.y,skillPower,'optic');used=true;}
    }else if(heroId==='impactDriller'){
      const stageKey=`${p.id}:${slot}`,stage=this.coreSiegeAbilityStages.get(stageKey);
      if(slot===1&&stage&&now<stage.expiresAt){const target=this.coreSiegeStageTarget(stage.targetId);if(target){used=this.dashCoreSiegeHero(p,{x:target.x,y:target.y},420,24+rank*4,skillPower,'steel');}this.coreSiegeAbilityStages.delete(stageKey);}
      else if(slot===1){const hit=this.castCoreSiegeLineStrike(p,point,560,30,16*skillPower,45*skillPower,1,0,'resonanceAnchor');const targetId=hit.firstTargetId;if(targetId){this.coreSiegeAbilityStages.set(stageKey,{heroId,slot:1,targetId,expiresAt:now+4});skipCooldown=true;this.broadcast('coreSiegeEffect',{kind:'resonanceMark',ownerId:p.id,targetId,x:point.x,y:point.y,radius:62,duration:4});}used=Boolean(targetId);}
      else if(slot===2&&stage&&now<stage.expiresAt){const radius=170;for(const target of this.state.players.values())if(target.alive&&!this.sameCombatTeam(p,target)&&distance(p.x,p.y,target.x,target.y)<=radius)this.damage(target,(20+rank*3)*skillPower,p.id,'배출',80,Math.atan2(target.y-p.y,target.x-p.x),'melee');this.healPlayer(p,18+rank*4);this.coreSiegeAbilityStages.delete(stageKey);this.broadcast('coreSiegeEffect',{kind:'drillDischarge',ownerId:p.id,x:p.x,y:p.y,radius,duration:.65});used=true;}
      else if(slot===2){const ally=[...this.state.players.values()].filter((target)=>target.alive&&target.id!==p.id&&this.sameCombatTeam(p,target)&&distance(target.x,target.y,point.x,point.y)<150).sort((a,b)=>distance(a.x,a.y,point.x,point.y)-distance(b.x,b.y,point.x,point.y))[0];if(ally){used=this.dashCoreSiegeHero(p,{x:ally.x,y:ally.y},390,0,1,'position',[],'drill');if(used){progress.temporaryShield=Math.max(progress.temporaryShield,35+rank*7);progress.temporaryShieldEndsAt=now+2.5;this.coreSiegeAbilityStages.set(stageKey,{heroId,slot:2,targetId:ally.id,expiresAt:now+3});skipCooldown=true;}}}
      else{const target=this.nearestCoreSiegeEnemy(p,point,230);if(target){const angle=Math.atan2(point.y-p.y,point.x-p.x);this.damage(target,(48+rank*7)*skillPower,p.id,'충격 강타',190,angle,'melee');this.applyCoreSiegeCrowdControl(target,.65,1);used=true;}}
    }else if(heroId==='spotterGunner'){
      if(slot===1){this.castCoreSiegeLineStrike(p,point,1250,22,42*skillPower,95*skillPower,3,0,'chainBurst');used=true;}
      else if(slot===2){const tactical=this.tacticalInventory(p.id);tactical.stripTrapCount++;used=this.placeStripTrapForPlayer(p,c);}
      else{progress.anchoredUntil=now+8;this.startCoreSiegeVolley(p,'sniper',point,4,1.7,0,1.45*skillPower,true);this.broadcast('coreSiegeEffect',{kind:'fixedFire',ownerId:p.id,x:p.x,y:p.y,angle:p.angle,radius:150,duration:8});used=true;}
    }else if(heroId==='jetstreamBlade'){
      if(slot===1){const combo=this.coreSiegeMeleeSkillCombos.get(p.id),count=combo&&now<combo.expiresAt?combo.count%3+1:1;this.coreSiegeMeleeSkillCombos.set(p.id,{count,expiresAt:now+2.5});const hit=this.castCoreSiegeLineStrike(p,point,count===3?470:210,count===3?34:26,(count===3?35:24)*skillPower,(count===3?70:46)*skillPower,count===3?4:1,count===3?.35:0,count===3?'risingGale':'compressedSlash');if(count<3)skipCooldown=true;used=Boolean(hit.playerHits||hit.minionHits);}
      else if(slot===2){const target=this.nearestCoreSiegeEnemy(p,point,180,true),key=target?`${p.id}:${target.id}`:'';if(target&&now>=(this.coreSiegeJetTargetReadyAt.get(key)??0)){const angle=Math.atan2(target.y-p.y,target.x-p.x),landing={x:target.x+Math.cos(angle)*70,y:target.y+Math.sin(angle)*70};if(this.isPositionFree(landing.x,landing.y)){this.coreSiegeJetTargetReadyAt.set(key,now+8);used=this.dashCoreSiegeHero(p,landing,520,22+rank*3,skillPower,'blade');}}}
      else{const target=this.nearestCoreSiegeEnemy(p,point,180);if(target&&target.werewolf.actionLockedUntil>now){for(let index=0;index<4;index++)this.damage(target,(14+rank*2)*skillPower,p.id,'제트 강습',index===3?90:15,p.angle,'melee');this.broadcast('coreSiegeEffect',{kind:'jetAssault',ownerId:p.id,targetId:target.id,x:target.x,y:target.y,angle:p.angle,radius:110,duration:.9});used=true;}}
    }else if(heroId==='blackoutAssassin'){
      if(slot===1){const hit=this.castCoreSiegeLineStrike(p,point,620,25,26*skillPower,52*skillPower,1,0,'currentChain');if(hit.playerHits||hit.minionHits)progress.hasteUntil=now+2;used=true;}
      else if(slot===2){const target=this.nearestCoreSiegeEnemy(p,point,170);if(target){this.coreSiegeCableJobs.set(p.id,{ownerId:p.id,targetId:target.id,expiresAt:now+1.1,breakDistance:460,damage:20+rank*3,power:skillPower});this.broadcast('coreSiegeEffect',{kind:'cableLink',ownerId:p.id,targetId:target.id,x1:p.x,y1:p.y,x2:target.x,y2:target.y,radius:55,duration:1.1});used=true;}}
      else{const target=this.nearestCoreSiegeEnemy(p,point,260);if(target){this.broadcast('coreSiegeEffect',{kind:'blackoutDrop',ownerId:p.id,targetId:target.id,team:target.team,x:target.x,y:target.y,radius:520,duration:2.4});used=this.dashCoreSiegeHero(p,{x:target.x-Math.cos(p.angle)*65,y:target.y-Math.sin(p.angle)*65},900,38+rank*5,skillPower,'blade');if(used)this.coreSiegePositioningLockedUntil.set(p.id,now+.8);}}
    }
    if(!used)return false;
    this.broadcast('coreSiegeEffect',{kind:'heroAbilityCast',heroId,abilitySlot:slot,rank,ultimate:slot===3,ownerId:p.id,x:p.x,y:p.y,x1:p.x,y1:p.y,x2:point.x,y2:point.y,angle:p.angle,radius:slot===3?150:slot===2?105:78,duration:slot===3?1.25:slot===2?.72:.55});
    const baseCooldown=hero.cooldowns[slot-1]!;
    this.setCoreSiegeAbilityReadyAt(progress,slot,now+coreSiegeAbilityCooldown(baseCooldown,progress.hasteStacks,rank));
    if(skipCooldown)this.setCoreSiegeAbilityReadyAt(progress,slot,0);
    if(cooldownRefund>0){progress.ability1ReadyAt=Math.max(now,progress.ability1ReadyAt-cooldownRefund);progress.ability2ReadyAt=Math.max(now,progress.ability2ReadyAt-cooldownRefund);progress.ultimateReadyAt=Math.max(now,progress.ultimateReadyAt-cooldownRefund);}
    this.clearOpenArenaSpawnProtection(p.id);
    return true;
  }

  private castCoreSiegeGrenade(p:PlayerState,x:number,y:number,power=1,rank=1){
    const id=`siege-grenade-${++this.coreSiegeAbilitySeq}`,now=this.now(),radius=CORE_SIEGE_CONFIG.grenadeRadius*(1+(rank-1)*.04);
    this.coreSiegeAreaJobs.set(id,{id,ownerId:p.id,kind:'grenade',x,y,radius,detonatesAt:now+CORE_SIEGE_CONFIG.grenadeTelegraphSeconds,expiresAt:now+2,nextTickAt:0,power,damageGroup:'grenade'});
    this.broadcast('coreSiegeEffect',{kind:'grenadeTelegraph',effectId:id,ownerId:p.id,x,y,radius,duration:CORE_SIEGE_CONFIG.grenadeTelegraphSeconds});
    this.emitAudioEvent('throwable_throw',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'core_siege_grenade'});
    return true;
  }

  private castCoreSiegeStickyBomb(p:PlayerState,x:number,y:number,power=1,rank=1){
    const id=`siege-sticky-${++this.coreSiegeAbilitySeq}`,now=this.now(),radius=180+rank*8,armSeconds=.45,duration=4.2;
    this.coreSiegeAreaJobs.set(id,{id,ownerId:p.id,kind:'sticky',x,y,radius,detonatesAt:now+armSeconds,expiresAt:now+duration,nextTickAt:0,power,damageGroup:'sticky'});
    this.broadcast('coreSiegeEffect',{kind:'grenadeTelegraph',variant:'sticky',effectId:id,ownerId:p.id,x,y,radius,duration});
    this.emitAudioEvent('throwable_throw',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'core_siege_sticky'});
    return true;
  }

  private spawnCoreSiegeSkillBullets(p:PlayerState,weaponId:WeaponId,targetX:number,targetY:number,pellets=1,spacing=0,damageMultiplier=1){
    const config=PROJECTILE_CONFIGS[weaponId as Exclude<WeaponId,'fists'>],weapon=WEAPONS[weaponId];
    if(!config||!weapon)return;
    const base=Math.atan2(targetY-p.y,targetX-p.x);p.attackSeq++;
    for(let index=0;index<pellets;index++){
      const angle=base+(index-(pellets-1)/2)*spacing,muzzle=PLAYER_HIT_RADIUS+10;
      const bullet=new BulletState();bullet.id=`b-${++this.bulletSeq}`;bullet.owner=p.id;bullet.weaponId=weaponId;bullet.x=p.x+Math.cos(angle)*muzzle;bullet.y=p.y+Math.sin(angle)*muzzle;bullet.prevX=bullet.x;bullet.prevY=bullet.y;
      bullet.vx=Math.cos(angle)*config.projectileSpeed;bullet.vy=Math.sin(angle)*config.projectileSpeed;bullet.life=config.lifetimeMs/1000;bullet.damage=config.damage*damageMultiplier;bullet.radius=Math.max(config.radius,weaponId==='chicken_blaster'?7:config.radius);bullet.shotSeq=p.attackSeq;
      this.state.bullets.set(bullet.id,bullet);
      if(weaponId==='boomerang')this.boomerangFlights.set(bullet.id,{hitIds:new Set(),targetId:'',returning:false});
    }
    this.emitAudioEvent('weapon_fire',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:weaponId,sequence:p.attackSeq});
  }

  private startCoreSiegeVolley(p:PlayerState,weaponId:WeaponId,point:Point,count:number,interval:number,spread:number,damageMultiplier:number,interruptible:boolean){
    const now=this.now(),id=`siege-volley-${++this.coreSiegeAbilitySeq}`;
    this.coreSiegeVolleyJobs.set(id,{ownerId:p.id,weaponId,angle:Math.atan2(point.y-p.y,point.x-p.x),remaining:count,nextAt:now,interval,spread,damageMultiplier,endsAt:now+Math.max(.5,count*interval+.4),interruptible});
  }

  private coreSiegeStageTarget(targetId:string){
    return this.state.players.get(targetId)??this.state.coreSiege.minions.get(targetId);
  }

  private nearestCoreSiegeEnemy(p:PlayerState,point:Point,assistRadius:number,includeMinions=false){
    const players=[...this.state.players.values()].filter((target)=>target.alive&&target.id!==p.id&&!this.sameCombatTeam(p,target)&&distance(target.x,target.y,point.x,point.y)<=assistRadius).sort((a,b)=>distance(a.x,a.y,point.x,point.y)-distance(b.x,b.y,point.x,point.y));
    if(players[0]||!includeMinions)return players[0];
    return [...this.state.coreSiege.minions.values()].filter((target)=>target.team!==p.team&&distance(target.x,target.y,point.x,point.y)<=assistRadius).sort((a,b)=>distance(a.x,a.y,point.x,point.y)-distance(b.x,b.y,point.x,point.y))[0];
  }

  private castCoreSiegeLineStrike(p:PlayerState,point:Point,range:number,width:number,playerDamage:number,minionDamage:number,maxTargets:number,stunSeconds:number,effectKind:string){
    const angle=Math.atan2(point.y-p.y,point.x-p.x),x1=p.x+Math.cos(angle)*34,y1=p.y+Math.sin(angle)*34,x2=x1+Math.cos(angle)*range,y2=y1+Math.sin(angle)*range,obstacleT=this.firstObstacleHitT(x1,y1,x2,y2,width*.18)??1,endX=x1+(x2-x1)*obstacleT,endY=y1+(y2-y1)*obstacleT;
    const players=[...this.state.players.values()].map((target)=>({target,t:segmentCircleIntersectionT(x1,y1,endX,endY,target.x,target.y,PLAYER_HIT_RADIUS+width)})).filter((hit)=>hit.target.alive&&hit.target.id!==p.id&&!this.sameCombatTeam(p,hit.target)&&hit.t!==null).sort((a,b)=>a.t!-b.t!).slice(0,maxTargets);
    const minions=[...this.state.coreSiege.minions.values()].map((target)=>({target,t:segmentCircleIntersectionT(x1,y1,endX,endY,target.x,target.y,target.radius+width)})).filter((hit)=>hit.target.team!==p.team&&hit.t!==null).sort((a,b)=>a.t!-b.t!).slice(0,Math.max(1,maxTargets-players.length));
    for(const hit of players){this.damage(hit.target,playerDamage,p.id,effectKind,0,angle,'bullet');if(stunSeconds>0)this.applyCoreSiegeCrowdControl(hit.target,stunSeconds,stunSeconds+.5);}
    for(const hit of minions)this.damageCoreSiegeMinion(hit.target,minionDamage,p.id);
    const ordered=[...players.map((hit)=>({id:hit.target.id,t:hit.t!})),...minions.map((hit)=>({id:hit.target.id,t:hit.t!}))].sort((a,b)=>a.t-b.t);
    this.broadcast('coreSiegeEffect',{kind:effectKind,ownerId:p.id,x1,y1,x2:endX,y2:endY,angle,width,radius:width,duration:.55,impacts:ordered.map((hit)=>({id:hit.id,x:x1+(endX-x1)*hit.t,y:y1+(endY-y1)*hit.t}))});
    return{playerHits:players.length,minionHits:minions.length,firstTargetId:ordered[0]?.id??''};
  }

  private castCoreSiegePiercingBeam(p:PlayerState,targetX:number,targetY:number,power=1,beamStyle:'vanguard'|'railgun'|'phase'|'optic'='vanguard'){
    const angle=Math.atan2(targetY-p.y,targetX-p.x),range=beamStyle==='phase'?1900:beamStyle==='optic'?2200:1050,x1=p.x+Math.cos(angle)*34,y1=p.y+Math.sin(angle)*34,x2=x1+Math.cos(angle)*range,y2=y1+Math.sin(angle)*range;
    const obstacleT=this.firstObstacleHitT(x1,y1,x2,y2,5)??1,endX=x1+(x2-x1)*obstacleT,endY=y1+(y2-y1)*obstacleT;
    const targets=[...this.state.players.values()].map((target)=>({target,t:segmentCircleIntersectionT(x1,y1,endX,endY,target.x,target.y,PLAYER_HIT_RADIUS+8)})).filter((item)=>item.target.alive&&item.target.id!==p.id&&!this.sameCombatTeam(p,item.target)&&item.t!==null).sort((a,b)=>a.t!-b.t!).slice(0,5);
    const styleMultiplier=beamStyle==='railgun'?CORE_SIEGE_CONFIG.piercingBeamRailgunMultiplier:beamStyle==='phase'?1.15:beamStyle==='optic'?1.25:1;
    targets.forEach((item,index)=>this.damage(item.target,CORE_SIEGE_CONFIG.piercingBeamHeroDamage*styleMultiplier*power*Math.pow(CORE_SIEGE_CONFIG.piercingBeamFalloff,index),p.id,beamStyle==='railgun'?'관통 레일건':'충전 관통포',0,angle,'bullet'));
    for(const minion of [...this.state.coreSiege.minions.values()])if(minion.team!==p.team&&segmentCircleIntersectionT(x1,y1,endX,endY,minion.x,minion.y,minion.radius+8)!==null)this.damageCoreSiegeMinion(minion,125*styleMultiplier*power,p.id);
    for(const camp of this.state.coreSiege.camps.values())if(camp.alive&&segmentCircleIntersectionT(x1,y1,endX,endY,camp.x,camp.y,camp.radius+8)!==null)this.damageCoreSiegeCamp(camp,100*styleMultiplier*power,p.id);
    for(const structure of this.state.coreSiege.structures.values())if(structure.team!==p.team&&segmentCircleIntersectionT(x1,y1,endX,endY,structure.x,structure.y,structure.radius+8)!==null)this.damageCoreSiegeStructure(structure,130*styleMultiplier*power,p.id);
    this.broadcast('laserCannonShot',{sourceId:p.id,x1,y1,x2:endX,y2:endY,duration:.55,travelSeconds:.18,impacts:targets.map((item)=>({x:x1+(endX-x1)*item.t!,y:y1+(endY-y1)*item.t!,t:item.t}))});
    this.broadcast('coreSiegeEffect',{kind:'piercingBeam',beamStyle,ownerId:p.id,x1,y1,x2:endX,y2:endY,duration:.65});
  }

  private coreSiegeAiRole(p:PlayerState):CoreSiegeAiRole{
    const hero=normalizeCoreSiegeHero(this.coreSiegePlayer(p.id).heroId);
    if(['shieldCaptain','ironCyclone','earthHammer','chainExecutioner','wolfWarrior'].includes(hero))return'front';
    if(['medigel','technician','sonicCommander'].includes(hero))return'support';
    if(['smokeTracker','twinBlade'].includes(hero))return'flank';
    return'back';
  }

  private coreSiegeAiFormationOffset(p:PlayerState){
    const team=[...this.state.players.values()].filter((candidate)=>candidate.ai&&candidate.alive&&candidate.team===p.team).sort((a,b)=>a.id.localeCompare(b.id));
    const index=Math.max(0,team.findIndex((candidate)=>candidate.id===p.id));return(index-(Math.max(1,team.length)-1)/2)*CORE_SIEGE_CONFIG.aiFormationSpacing;
  }

  private coreSiegeAiRangeMultiplier(p:PlayerState){
    const role=this.coreSiegeAiRole(p);return role==='front'?.72:role==='support'?1.14:role==='flank'?.9:1.08;
  }

  private coreSiegeHazardForAi(p:PlayerState){
    const now=this.now(),hazards:Array<{id:string;x:number;y:number;radius:number}>=[];
    for(const job of this.coreSiegeAreaJobs.values()){
      if(job.kind==='adhesive')continue;const owner=this.state.players.get(job.ownerId);if(!owner||this.sameCombatTeam(owner,p))continue;
      const imminent=job.kind==='sticky'?now<job.expiresAt:job.detonatesAt>=now&&job.detonatesAt-now<=1.2;if(imminent)hazards.push({id:job.id,x:job.x,y:job.y,radius:job.radius});
    }
    for(const device of this.state.coreSiege.devices.values())if(device.team!==p.team&&(device.kind==='fireCapsule'||device.kind==='fireWall'||device.kind==='fireStorm'||device.kind==='gravityCollapse'))hazards.push({id:device.id,x:device.x,y:device.y,radius:device.radius});
    return hazards.filter((hazard)=>distance(p.x,p.y,hazard.x,hazard.y)<=hazard.radius+CORE_SIEGE_CONFIG.aiHazardMargin).sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0];
  }

  private coreSiegeAiUltimateAvailable(p:PlayerState,now=this.now()){return now>=(this.coreSiegeAiTeamUltimateReadyAt.get(p.team)??0);}
  private reserveCoreSiegeAiUltimate(p:PlayerState,now=this.now()){this.coreSiegeAiTeamUltimateReadyAt.set(p.team,now+CORE_SIEGE_CONFIG.aiUltimateTeamLockSeconds);}

  private updateCoreSiegeAiAbilities(){
    const now=this.now();
    for(const p of this.state.players.values()){
      if(!p.ai||!p.alive||now<(this.coreSiegeAiAbilityAt.get(p.id)??0))continue;
      const progress=this.coreSiegePlayer(p.id),heroId=normalizeCoreSiegeHero(progress.heroId);
      const enemies=[...this.state.players.values()]
        .filter((candidate)=>candidate.alive&&!this.sameCombatTeam(p,candidate)&&candidate.id!==p.id)
        .sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y));
      const allies=[...this.state.players.values()]
        .filter((candidate)=>candidate.alive&&(candidate.id===p.id||this.sameCombatTeam(p,candidate))&&!this.tacticalInventory(candidate.id).exoActive)
        .sort((a,b)=>a.hp/this.playerMaxHp(a)-b.hp/this.playerMaxHp(b));
      const enemyPlayer=enemies[0],injuredAlly=allies[0];
      const objective=this.coreSiegeAiTarget(p);
      const attackObjective=objective?.kind==='pickup'?undefined:objective;
      const target=enemyPlayer&&distance(p.x,p.y,enemyPlayer.x,enemyPlayer.y)<=820?enemyPlayer:attackObjective;
      const positionProfile=CORE_SIEGE_POSITIONING[heroId],hazard=this.coreSiegeHazardForAi(p),targetDistance=target?distance(p.x,p.y,target.x,target.y):999,meleeHero=isCoreSiegeMeleeHero(heroId);
      if(positionProfile.kind==='move'&&now>=progress.positioningReadyAt&&!this.coreSiegeDashJobs.has(p.id)){
        let actualAngle:number|undefined;
        if(hazard)actualAngle=Math.atan2(p.y-hazard.y,p.x-hazard.x)+(p.id.length%2?Math.PI/5:-Math.PI/5);
        else if(meleeHero&&target&&targetDistance>190&&targetDistance<470)actualAngle=Math.atan2(target.y-p.y,target.x-p.x);
        else if(!meleeHero&&enemyPlayer&&targetDistance<175&&p.hp/this.playerMaxHp(p)<.72)actualAngle=Math.atan2(p.y-enemyPlayer.y,p.x-enemyPlayer.x);
        if(actualAngle!==undefined){const aimAngle=actualAngle-(positionProfile.direction==='backward'?Math.PI:0),aim={aimWorldX:p.x+Math.cos(aimAngle)*positionProfile.distance,aimWorldY:p.y+Math.sin(aimAngle)*positionProfile.distance};if(this.castCoreSiegePositioning(p,aim)){this.coreSiegeAiAbilityAt.set(p.id,now+.8+Math.random()*.45);continue;}}
      }
      const available=([1,2,3] as CoreSiegeAbilitySlot[]).filter((slot)=>this.coreSiegeAbilityRank(progress,slot)>0&&now>=this.coreSiegeAbilityReadyAt(progress,slot));
      if(!available.length)continue;
      const ready=(slot:CoreSiegeAbilitySlot)=>available.includes(slot);
      const nearbyEnemies=enemies.filter((candidate)=>distance(p.x,p.y,candidate.x,candidate.y)<=430);
      const pressuredAllies=allies.filter((candidate)=>candidate.hp/this.playerMaxHp(candidate)<=.5&&distance(p.x,p.y,candidate.x,candidate.y)<=520),pHpRatio=p.hp/this.playerMaxHp(p);
      const disabledEnemy=nearbyEnemies.find((candidate)=>candidate.werewolf.actionLockedUntil>now||candidate.werewolf.silverSlowUntil>now||candidate.werewolf.adhesiveSlowUntil>now);
      const nearEnemyStructure=attackObjective?.kind==='structure'&&distance(p.x,p.y,attackObjective.x,attackObjective.y)<=620;
      const ownCore=[...this.state.coreSiege.structures.values()].find((structure)=>structure.team===p.team&&structure.kind==='core'&&!structure.destroyed);
      const defendingCore=Boolean(ownCore&&enemies.some((candidate)=>distance(candidate.x,candidate.y,ownCore.x,ownCore.y)<=700));
      let slot:CoreSiegeAbilitySlot|undefined;
      let aim=target?{x:target.x,y:target.y}:{x:p.x+Math.cos(p.angle)*420,y:p.y+Math.sin(p.angle)*420};

      if(heroId==='medigel'){
        if(!injuredAlly||injuredAlly.hp/this.playerMaxHp(injuredAlly)>=.85)continue;
        aim={x:injuredAlly.x,y:injuredAlly.y};
        if(ready(3)&&pressuredAllies.length>=2)slot=3;
        else if(ready(1)&&injuredAlly.hp/this.playerMaxHp(injuredAlly)<=.6)slot=1;
        else if(ready(2)&&pressuredAllies.length>=1)slot=2;
      }else if(heroId==='steelPilot'||heroId==='empPilot'){
        const tactical=this.tacticalInventory(p.id);
        if(ready(3)&&!tactical.exoActive&&(nearbyEnemies.length>=2||nearEnemyStructure||defendingCore))slot=3;
        else if(ready(2)&&nearbyEnemies.length>=1)slot=2;
        else if(ready(1)&&target)slot=1;
      }else if(heroId==='shieldCaptain'){
        if(ready(3)&&pressuredAllies.length>=2)slot=3;
        else if(ready(1)&&(pressuredAllies.length>=1||nearEnemyStructure))slot=1;
        else if(ready(2)&&target&&distance(p.x,p.y,target.x,target.y)>170)slot=2;
      }else if(heroId==='technician'){
        if(ready(3)&&nearbyEnemies.length>=2)slot=3;
        else if(ready(2)&&(nearbyEnemies.length>=2||nearbyEnemies.some((candidate)=>this.tacticalInventory(candidate.id).exoActive)))slot=2;
        else if(ready(1)&&target)slot=1;
      }else if(heroId==='fireEngineer'||heroId==='demolitionist'||heroId==='trickster'){
        if(ready(3)&&nearbyEnemies.length>=2)slot=3;
        else if(ready(2)&&target&&(nearbyEnemies.length>=1||nearEnemyStructure))slot=2;
        else if(ready(1)&&target)slot=1;
      }else if(heroId==='wolfWarrior'){
        if(ready(3)&&(nearbyEnemies.length>=2||nearEnemyStructure||defendingCore))slot=3;
        else if(ready(2)&&(nearbyEnemies.length>=1||pressuredAllies.length>=1))slot=2;
        else if(ready(1)&&target&&distance(p.x,p.y,target.x,target.y)>150)slot=1;
      }else if(heroId==='orbitalSniper'){
        if(ready(3)&&(nearbyEnemies.length>=2||nearEnemyStructure))slot=3;
        else if(ready(1)&&target)slot=1;
        else if(ready(2)&&target)slot=2;
      }else if(heroId==='ironCyclone'){
        const targetDistance=target?distance(p.x,p.y,target.x,target.y):999;
        if(ready(3)&&(nearbyEnemies.length>=2||nearEnemyStructure||defendingCore))slot=3;
        else if(ready(1)&&targetDistance<=150)slot=1;
        else if(ready(2)&&target&&targetDistance>125)slot=2;
      }else if(heroId==='scrapSummoner'){
        const owned=[...this.state.coreSiege.devices.values()].filter((device)=>device.ownerId===p.id&&device.kind==='gearling').length;
        if(ready(3)&&(nearbyEnemies.length>=2||nearEnemyStructure))slot=3;
        else if(ready(1)&&owned<CORE_SIEGE_CONFIG.summonPerHeroLimit)slot=1;
        else if(ready(2)&&target)slot=2;
      }else if(heroId==='gravityWarden'){
        if(ready(3)&&nearbyEnemies.length>=2)slot=3;
        else if(ready(2)&&nearbyEnemies.length>=1)slot=2;
        else if(ready(1)&&target)slot=1;
      }else if(heroId==='sonicCommander'){
        if(ready(3)&&nearbyEnemies.length>=2)slot=3;
        else if(ready(2)&&(pressuredAllies.length>=1||nearbyEnemies.length>=2))slot=2;
        else if(ready(1)&&target)slot=1;
      }else if(heroId==='smokeTracker'){
        if(ready(3)&&target)slot=3;
        else if(ready(2)&&(nearbyEnemies.length>=2||pHpRatio<.5))slot=2;
        else if(ready(1)&&target&&distance(p.x,p.y,target.x,target.y)>180)slot=1;
      }else if(heroId==='earthHammer'){
        const targetDistance=target?distance(p.x,p.y,target.x,target.y):999;
        if(ready(3)&&target&&(nearbyEnemies.length>=2||targetDistance>220&&targetDistance<650))slot=3;
        else if(ready(2)&&(nearbyEnemies.length>=1||nearEnemyStructure))slot=2;
        else if(ready(1)&&targetDistance<=285)slot=1;
      }else if(heroId==='chainExecutioner'){
        const combo=this.coreSiegeChainComboTargets.get(p.id),comboTarget=combo&&now<combo.expiresAt?this.state.players.get(combo.targetId):undefined,targetDistance=target?distance(p.x,p.y,target.x,target.y):999;
        if(comboTarget?.alive)aim={x:comboTarget.x,y:comboTarget.y};
        if(ready(2)&&comboTarget?.alive)slot=2;
        else if(ready(3)&&enemyPlayer&&targetDistance<=650)slot=3;
        else if(ready(2)&&(pHpRatio<.55||nearbyEnemies.length>=2))slot=2;
        else if(ready(1)&&target&&targetDistance>135&&targetDistance<=620)slot=1;
      }else if(heroId==='twinBlade'){
        const targetDistance=target?distance(p.x,p.y,target.x,target.y):999;
        if(ready(3)&&target&&(nearbyEnemies.length>=2||defendingCore))slot=3;
        else if(ready(2)&&nearbyEnemies.length>=1&&pHpRatio<.5)slot=2;
        else if(ready(1)&&target&&targetDistance>110&&targetDistance<=620)slot=1;
      }else{
        if(ready(3)&&(nearbyEnemies.length>=2||nearEnemyStructure||defendingCore))slot=3;
        else if(ready(2)&&(disabledEnemy||nearbyEnemies.length>=1))slot=2;
        else if(ready(1)&&target)slot=1;
      }
      if(slot===3&&!this.coreSiegeAiUltimateAvailable(p,now))slot=ready(1)?1:ready(2)?2:undefined;
      if(!slot||!this.castCoreSiegeAbility(p,slot,{aimWorldX:aim.x,aimWorldY:aim.y,chargeSeconds:heroId==='earthHammer'&&slot===1?1.2:0}))continue;
      if(slot===3)this.reserveCoreSiegeAiUltimate(p,now);
      this.coreSiegeAiAbilityAt.set(p.id,now+1.15+Math.random()*.85);
    }
  }

  private beginMatch(){
    this.clearTransient();
    this.elapsed=0;
    this.lootRandom=createSeededRandom((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0);
    this.state.phase='PLANE';
    this.state.winner='';
    this.state.placements.clear();
    this.state.worldSize=this.map.width;
    this.state.zoneX=this.worldSize/2;
    this.state.zoneY=this.worldHeight/2;
    this.state.zoneRadius=this.map.initialZoneRadius;
    this.state.zoneStartX=this.state.zoneX;
    this.state.zoneStartY=this.state.zoneY;
    this.state.zoneStartRadius=this.state.zoneRadius;
    this.state.nextZoneX=this.state.zoneX;
    this.state.nextZoneY=this.state.zoneY;
    this.state.nextZoneRadius=this.state.zoneRadius;
    this.state.zoneTimer=this.map.zoneFreeSeconds;
    this.state.zoneStage=0;
    this.state.zoneProgress=0;
    this.state.zoneActive=false;
    this.state.zoneState='FREE';
    this.state.supplySpawned=false;
    this.state.supplyDropId='';
    this.coreSiegeAreaJobs.clear();
    this.coreSiegeDashJobs.clear();
    this.coreSiegeSpinJobs.clear();
    this.coreSiegeWaveJobs.clear();
    this.coreSiegeSummonOrders.clear();
    this.coreSiegeHuntMarks.clear();
    this.coreSiegeExecutionZones.clear();
    this.coreSiegeMeleeCombos.clear();
    this.coreSiegeAiAbilityAt.clear();
    this.coreSiegeAreaHitWindows.clear();
    this.coreSiegePersistentDamageAt.clear();
    this.coreSiegeMeleeShieldReadyAt.clear();
    this.coreSiegeCrowdControl.clear();
    this.coreSiegeAiTeamUltimateReadyAt.clear();
    this.choosePlane();

    let aiIndex=0;
    for(const p of this.state.players.values()){
      p.maxHp=100;
      p.hp=p.maxHp;
      p.armor=0;
      p.alive=true;
      p.kills=0;
      p.damageDone=0;
      p.attackSeq=0;
      p.hitSeq=0;
      p.lastHitAngle=0;
      p.lastHitDamage=0;
      p.inBush=false;
      p.bushRevealed=false;
      p.buildingId='';
      p.roomIndex=0;
      p.insideBuilding=false;
      p.isSwimming=false;
      p.buildingTransitionSeq=0;
      p.isSniperScoped=false;
      p.isDriving=false;
      p.vehicleId='';
      p.isVaulting=false;
      p.vaultProgress=0;
      p.vaultWindowId='';
      p.reloading=false;
      p.reloadWeapon='';
      p.reloadProgress=0;
      p.phase='plane';
      p.altitude=FALL_START_ALTITUDE;
      p.primary='';
      p.secondary='';
      p.melee='fists';
      p.equipped='fists';
      p.previousEquipped='fists';
      p.throwableType='';
      p.throwableCount=0;
      p.isPreparingThrow=false;
      p.throwCharge=0;
      p.aiState=p.ai?'PLANE':'';
      p.magazine=0;
      p.pistolMagazine=0;
      p.smgMagazine=0;
      p.rifleMagazine=0;
      p.shotgunMagazine=0;
      p.sniperMagazine=0;
      p.bazookaMagazine=0;
      p.flamethrowerMagazine=0;
      p.pistolAmmo=0;
      p.standardAmmo=0;
      p.shotgunAmmo=0;
      p.rocketAmmo=0;
      p.fuelAmmo=0;
      this.tacticalInventory(p.id).boomerangMagazine=0;
      this.tacticalInventory(p.id).rcCarMagazine=0;
      this.resetWerewolfPlayer(p);this.resetChickenPlayer(p);
      {const tactical=this.tacticalInventory(p.id);tactical.adhesiveSprayerMagazine=0;tactical.adhesiveCharge=0;tactical.stripTrapCount=0;tactical.silverCrossbowMagazine=0;tactical.silverBoltAmmo=0;tactical.railgunMagazine=0;tactical.railSlugAmmo=0;tactical.laserCannonMagazine=0;tactical.laserCellAmmo=0;tactical.laserCannonCharging=false;tactical.laserCannonChargeStartedAt=0;tactical.stunGunMagazine=0;tactical.hunterDroneCount=0;tactical.spiderMineCount=0;tactical.tankKeyCount=0;this.resetChickenInventory(tactical);this.resetExoInventory(tactical);}
      p.bandages=0;
      p.medkits=0;
      p.healingKind='';
      p.healingProgress=0;
      p.x=this.planeStart.x;
      p.y=this.planeStart.y;
      this.lastSafePositions.set(p.id,{x:p.x,y:p.y,mapId:this.map.id,buildingId:'',roomIndex:0,recordedAt:this.now()});
      this.stuckStates.set(p.id,{lastX:p.x,lastY:p.y,movingSince:0,lastRecoveryAt:-99});
      if(p.ai){
        this.aiThinkAt.set(p.id,3+aiIndex++*1.7);
        this.aiIntent.set(p.id,this.newAiIntent(p));
        this.aiProfiles.set(p.id,createAiProfile(p.id,this.state.difficulty as Difficulty,p.name));
        this.aiMemories.set(p.id,createAiMemory(p.x,p.y,p.buildingId,p.roomIndex,this.now()));
        this.aiCombatBrains.set(p.id,createAiCombatMemory());
      }
    }
    this.state.aliveCount=this.state.players.size;
    this.spawnLoot();
    this.spawnMotorcycles();
    this.initializeWerewolfSeason();
    this.system('비행기가 출발했습니다. Space로 낙하하세요.');
  }

  private newAiIntent(p:PlayerState):AiIntent{
    return {
      tx:p.x,ty:p.y,targetId:'',lootId:'',mode:'move',state:'PATROL',
      avoidSign:Math.random()<.5?-1:1,stuckFor:0,lastX:p.x,lastY:p.y,
      route:[],lastSeenX:p.x,lastSeenY:p.y,lastSeenUntil:0,
      routeGoalX:p.x,routeGoalY:p.y,repathAt:0,
      failedWindowId:'',failedWindowUntil:0,stuckCount:0,lastRepathReason:'spawn',
      goalKind:'none',goalKey:'',goalLockedUntil:0,executive:createAiExecutiveMemory(this.now()),failedGoalKey:'',failedGoalUntil:0,lastGoalDistance:0,
      progressSamples:[],lastProgressSampleAt:0,oscillationCount:0,swimExitId:'',swimExitLockedUntil:0,failedShoreExitId:'',failedShoreExitUntil:0,
      combatStrafeSign:Math.random()<.5?-1:1,combatStrafeUntil:0,combatHoldStartedAt:0,combatBlockedFor:0,
      sweepTargetX:p.x,sweepTargetY:p.y,sweepStartedAt:0,sweepExpiresAt:0,sweepZoneSignature:'',sweepGeneration:0,sweepKey:'',sweepSector:0,itemDetourActive:false,
    };
  }

  private choosePlane(){
    const route=createPlaneRoute(this.lootRandom,this.worldSize,this.map.planeMargin);
    this.planeStart={x:route.startX,y:route.startY};
    this.planeEnd={x:route.endX,y:route.endY};
    this.state.planeStartX=route.startX;
    this.state.planeStartY=route.startY;
    this.state.planeX=route.startX;
    this.state.planeY=route.startY;
    this.state.planeEndX=route.endX;
    this.state.planeEndY=route.endY;
    this.state.planeAngle=route.angle;
    this.state.planeProgress=0;
  }

  private lootKindForSpawn(spawn:MapConfig['lootSpawns'][number]):LootKind{
    const choose=(table:Parameters<typeof adjustedLootTableForMap>[1])=>{
      let adjusted=adjustedLootTableForMap(this.map.id,table);
      if(this.gameMode==='domination')adjusted=adjusted.map((entry)=>{
        const weapon=entry.kind in WEAPONS&&entry.kind!=='fists';
        const ammo=['pistol_ammo','standard_ammo','shotgun_ammo','rocket_ammo','rail_slug','laser_cell','chicken_capsule','fuel_ammo','adhesive_charge','silver_bolt'].includes(entry.kind);
        return{...entry,weight:entry.weight*(weapon?DOMINATION_CONFIG.weaponWeightMultiplier:ammo?DOMINATION_CONFIG.ammoWeightMultiplier:1)};
      });
      return weightedLootChoice(adjusted,this.lootRandom) as LootKind;
    };
    const category=spawn.category;
    if(category==='weapon')return choose([{kind:'pistol',weight:26},{kind:'stun_gun',weight:8},{kind:'smg',weight:24},{kind:'rifle',weight:20},{kind:'shotgun',weight:20},{kind:'sniper',weight:10},{kind:'railgun',weight:3},{kind:'laser_cannon',weight:3},{kind:'boomerang',weight:11},{kind:'rc_car',weight:15},{kind:'bazooka',weight:20},{kind:'adhesive_sprayer',weight:5}]);
    if(category==='ammo')return choose([{kind:'pistol_ammo',weight:28},{kind:'standard_ammo',weight:48},{kind:'shotgun_ammo',weight:24},{kind:'rocket_ammo',weight:16},{kind:'rail_slug',weight:7},{kind:'laser_cell',weight:7},{kind:'adhesive_charge',weight:10}]);
    if(category==='heal')return weightedLootChoice([{kind:'bandage',weight:68},{kind:'medkit',weight:32}],this.lootRandom) as LootKind;
    if(category==='throwable')return choose([{kind:'fragGrenade',weight:34},{kind:'smokeGrenade',weight:30},{kind:'incendiaryGrenade',weight:22},{kind:'hunter_drone',weight:10},{kind:'strip_trap',weight:10},{kind:'spider_mine',weight:12}]);
    const table=REGION_LOOT_TABLES[spawn.regionId as RegionId]??REGION_LOOT_TABLES.residential;
    return choose(table);
  }

  private activeLootBudget(){
    if(this.gameMode!=='domination')return this.map.lootBudget;
    const humans=[...this.state.players.values()].filter((player)=>!player.ai).length;
    const combatants=Math.max(1,humans+(this.openArenaConfig?.configuredAiCount??DOMINATION_CONFIG.aiCount));
    return Math.min(DOMINATION_CONFIG.lootMaxBudget,DOMINATION_CONFIG.lootBaseBudget+combatants*DOMINATION_CONFIG.lootPerCombatant);
  }

  private spawnLoot(){
    this.state.loot.clear();
    this.lootReservations.clear();
    if(this.arenaLike()){this.arenaLootSlots.clear();this.arenaLootToSlot.clear();this.arenaDropExpiresAt.clear();}
    const lootBudget=this.activeLootBudget();
    for(let slotIndex=0;slotIndex<lootBudget;slotIndex++){
      const spawnIndex=slotIndex%this.map.lootSpawns.length,spawn=this.map.lootSpawns[spawnIndex];if(!spawn)continue;
      const kind=this.lootKindForSpawn(spawn);
      const expectedSpace=spaceAt(spawn.x,spawn.y,this.map.buildingVisibilityZones,this.map.rooms,0);
      const expectedBuildingId=spawn.buildingId??expectedSpace.buildingId;
      const expectedRoomIndex=spawn.roomIndex??expectedSpace.roomIndex;
      const pos=this.findSeparatedLootPosition(spawn.x,spawn.y,kind,expectedBuildingId,expectedRoomIndex);
      if(!pos)continue;
      const l=new LootState();
      l.id=`loot-${++this.lootSeq}`;
      l.kind=kind;
      l.x=pos.x;
      l.y=pos.y;
      const lootSpace=spaceAt(l.x,l.y,this.map.buildingVisibilityZones,this.map.rooms,0);
      l.buildingId=lootSpace.buildingId;
      l.roomIndex=lootSpace.roomIndex;
      this.state.loot.set(l.id,l);
      if(this.arenaLike()){const slotId=`arena-loot-slot-${slotIndex}`;this.arenaLootSlots.set(slotId,{slotId,spawnIndex,currentLootId:l.id,respawnAt:0,generation:0});this.arenaLootToSlot.set(l.id,slotId);}
    }
    this.spawnTankKeyLoot();
    this.scatterExoParts('assault',true);
    this.scatterExoParts('emp',true);
  }

  private isExoPart(kind:LootKind){return kind==='exo_head'||kind==='exo_core'||kind==='exo_limbs'||kind==='emp_exo_head'||kind==='emp_exo_core'||kind==='emp_exo_limbs';}

  private exoPartKinds(kind:ExoSuitKind):LootKind[]{return kind==='emp'?['emp_exo_head','emp_exo_core','emp_exo_limbs']:['exo_head','exo_core','exo_limbs'];}

  private exoPartCounts(tactical:TacticalInventoryState,kind:ExoSuitKind){return kind==='emp'?[tactical.empExoHeadCount,tactical.empExoCoreCount,tactical.empExoLimbsCount]:[tactical.exoHeadCount,tactical.exoCoreCount,tactical.exoLimbsCount];}

  private consumeExoParts(tactical:TacticalInventoryState,kind:ExoSuitKind){if(kind==='emp'){tactical.empExoHeadCount=0;tactical.empExoCoreCount=0;tactical.empExoLimbsCount=0;}else{tactical.exoHeadCount=0;tactical.exoCoreCount=0;tactical.exoLimbsCount=0;}}

  private resetExoInventory(tactical:TacticalInventoryState){tactical.exoHeadCount=0;tactical.exoCoreCount=0;tactical.exoLimbsCount=0;tactical.empExoHeadCount=0;tactical.empExoCoreCount=0;tactical.empExoLimbsCount=0;tactical.exoKind='';tactical.exoActive=false;tactical.exoAssembling=false;tactical.exoAssemblyStartedAt=0;tactical.exoAssemblyEndsAt=0;tactical.exoHp=0;tactical.exoEndsAt=0;tactical.empDisabledUntil=0;tactical.empPulseReadyAt=0;}

  private createExoPartLoot(kind:LootKind,x:number,y:number,positionAllowed?:(point:Point)=>boolean){
    const pos=this.findSeparatedLootPosition(x,y,kind,undefined,undefined,positionAllowed)??(positionAllowed?undefined:this.findNearestFreePoint(x,y,240));if(!pos)return;
    const loot=new LootState();loot.id=`loot-${++this.lootSeq}`;loot.kind=kind;loot.x=pos.x;loot.y=pos.y;const lootSpace=spaceAt(pos.x,pos.y,this.map.buildingVisibilityZones,this.map.rooms,0);loot.buildingId=lootSpace.buildingId;loot.roomIndex=lootSpace.roomIndex;loot.grantsAmmo=false;this.state.loot.set(loot.id,loot);return loot;
  }

  private scatterExoParts(exoKind:ExoSuitKind='assault',replaceExisting=false){
    const parts=this.exoPartKinds(exoKind),planned=Array.from({length:EXO_PART_COPIES_PER_MAP},()=>parts).flat();
    for(const [id,loot] of this.state.loot)if(parts.includes(loot.kind as LootKind))this.state.loot.delete(id);
    const spawns=this.map.lootSpawns;
    if(replaceExisting){
      const candidates=[...this.state.loot.values()].filter((loot)=>loot.kind!=='tank_key'&&!this.isExoPart(loot.kind as LootKind));
      planned.forEach((kind,index)=>{const selected=candidates[Math.floor((index+.5)*candidates.length/planned.length)];if(selected){selected.kind=kind;selected.stackCount=1;selected.ammoCount=-1;selected.weaponMagazine=-1;selected.grantsAmmo=false;}else{const anchor=spawns[Math.floor((index+.25)*spawns.length/planned.length)];if(anchor)this.createExoPartLoot(kind,anchor.x,anchor.y);}});return;
    }
    const offset=exoKind==='emp' ? .48 : .15;
    planned.forEach((kind,index)=>{const anchor=spawns[Math.floor((index+offset)*spawns.length/planned.length)]??{x:this.worldWidth*(.2+(index%3)*.3),y:this.worldHeight*(index<3?.28:.72)};this.createExoPartLoot(kind,anchor.x,anchor.y);});
  }

  private clearRobotPartCheatDrops(playerId:string){
    for(const lootId of this.testCheatLootIds.get(playerId)??[]){this.state.loot.delete(lootId);this.lootReservations.delete(lootId);this.arenaDropExpiresAt.delete(lootId);}
    this.testCheatLootIds.delete(playerId);
  }

  private spawnRobotPartsCheat(c:Client){
    if(process.env.DROP8_TEST_CHEATS!=='1'){c.send('notice',{type:'warning',message:'테스트 치트가 비활성화되어 있습니다. 서버에서 DROP8_TEST_CHEATS=1을 설정하세요.'});return;}
    const p=this.state.players.get(c.sessionId);if(!p?.host){c.send('notice',{type:'warning',message:'방장만 테스트 치트를 사용할 수 있습니다.'});return;}
    if(!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting){c.send('notice',{type:'warning',message:'지상에서 이동 가능한 상태일 때만 파츠를 호출할 수 있습니다.'});return;}
    const now=this.now(),readyAt=this.testCheatAt.get(p.id)??0;if(now<readyAt){c.send('notice',{type:'warning',message:`파츠 호출 대기 ${Math.max(1,Math.ceil(readyAt-now))}초`});return;}
    this.clearRobotPartCheatDrops(p.id);
    const specialWeapons:WeaponId[]=['stun_gun','chicken_blaster','railgun','laser_cannon','boomerang','rc_car','bazooka','flamethrower','adhesive_sprayer','silver_crossbow'];
    const forwardX=Math.cos(p.angle),forwardY=Math.sin(p.angle),sideX=-forwardY,sideY=forwardX,rows:Array<{kinds:LootKind[];forward:number}>=[
      {kinds:this.exoPartKinds('assault'),forward:104},
      {kinds:this.exoPartKinds('emp'),forward:184},
      {kinds:specialWeapons.slice(0,4),forward:272},
      {kinds:specialWeapons.slice(4,8),forward:352},
      {kinds:[...specialWeapons.slice(8),'silver_bolt'],forward:432},
    ],lootIds:string[]=[],inFront=(point:Point)=>(point.x-p.x)*forwardX+(point.y-p.y)*forwardY>56;
    rows.forEach((row)=>row.kinds.forEach((kind,index)=>{
      const lateral=(index-(row.kinds.length-1)/2)*68,targetX=p.x+forwardX*row.forward+sideX*lateral,targetY=p.y+forwardY*row.forward+sideY*lateral,loot=this.createExoPartLoot(kind,targetX,targetY,inFront)??this.createExoPartLoot(kind,targetX,targetY);
      if(!loot)return;
      if(kind in WEAPONS&&kind!=='fists'){loot.weaponMagazine=WEAPONS[kind as WeaponId].magazine;loot.grantsAmmo=true;}
      else if(kind==='silver_bolt')loot.ammoCount=SILVER_CROSSBOW_BALANCE.maxReserve;
      lootIds.push(loot.id);
    }));
    if(!lootIds.length){c.send('notice',{type:'warning',message:'앞쪽에 파츠를 생성할 공간이 없습니다.'});return;}
    this.testCheatAt.set(p.id,now+3);this.testCheatLootIds.set(p.id,lootIds);c.send('notice',{type:'success',message:`F8 테스트 치트 · 로봇 파츠와 특수 무기 세트 ${lootIds.length}개 호출`});
  }

  private coreSiegeSkillLab(c:Client,message:any){
    if(process.env.DROP8_TEST_CHEATS!=='1'){c.send('notice',{type:'warning',message:'공성전 검수장은 테스트 치트 서버에서만 사용할 수 있습니다.'});return false;}
    const p=this.state.players.get(c.sessionId);if(!p?.host){c.send('notice',{type:'warning',message:'방장만 공성전 검수장을 사용할 수 있습니다.'});return false;}
    if(this.gameMode!=='coreSiege'||!p.alive||p.phase!=='landed')return false;
    const action=String(message?.action??''),progress=this.coreSiegePlayer(p.id),current=normalizeCoreSiegeHero(progress.heroId);
    if(action==='hero'){
      const currentIndex=CORE_SIEGE_HERO_IDS.indexOf(current),requested=String(message?.heroId??''),heroId=CORE_SIEGE_HERO_IDS.includes(requested as CoreSiegeHeroId)?requested as CoreSiegeHeroId:CORE_SIEGE_HERO_IDS[(currentIndex+(Number(message?.delta)<0?-1:1)+CORE_SIEGE_HERO_IDS.length)%CORE_SIEGE_HERO_IDS.length]!;
      progress.heroId=heroId;progress.level=10;progress.xp=0;progress.skillPoints=0;progress.ability1Rank=5;progress.ability2Rank=5;progress.ultimateRank=1;this.syncCoreSiegeHeroHealth(p,true);this.giveOpenArenaStarterKit(p);this.resetCoreSiegeSkillLabPlayer(p);c.send('notice',{type:'success',message:`검수 영웅 · ${CORE_SIEGE_HEROES[heroId].name}`});return true;
    }
    if(action==='reset'){this.resetCoreSiegeSkillLabPlayer(p);return true;}
    if(action==='targets'){this.spawnCoreSiegeSkillLabTargets(p);return true;}
    const target=[...this.state.players.values()].filter((candidate)=>candidate.alive&&!this.sameCombatTeam(p,candidate)).sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0],aim={aimWorldX:target?.x??p.x+Math.cos(p.angle)*320,aimWorldY:target?.y??p.y+Math.sin(p.angle)*320};
    if(action==='basic'){p.angle=Math.atan2(aim.aimWorldY-p.y,aim.aimWorldX-p.x);const profile=CORE_SIEGE_BASIC_ATTACKS[current];if(profile.weaponId==='fists')this.meleePlayer(p);else this.firePlayer(p,aim);return true;}
    const slot=Number(message?.slot) as CoreSiegeAbilitySlot;if(action==='cast'&&(slot===1||slot===2||slot===3)){this.setCoreSiegeAbilityReadyAt(progress,slot,0);return this.castCoreSiegeAbility(p,slot,aim,c);}
    return false;
  }

  private coreSiegePractice(c:Client,message:any){
    const p=this.state.players.get(c.sessionId);if(!this.practiceMode||!p?.host||!p.alive||p.phase!=='landed')return false;
    const action=String(message?.action??''),progress=this.coreSiegePlayer(p.id),target=this.state.players.get('core-siege-practice-target');
    if(action==='hero'){
      const heroId=normalizeCoreSiegeHero(message?.heroId);progress.heroId=heroId;this.practiceHeroId=heroId;this.resetCoreSiegeSkillLabPlayer(p);this.resetCoreSiegePracticePositions();return true;
    }
    if(action==='targetHero'&&target){const heroId=normalizeCoreSiegeHero(message?.heroId);this.coreSiegePlayer(target.id).heroId=heroId;this.resetCoreSiegeSkillLabPlayer(target);this.resetCoreSiegePracticePositions();return true;}
    if(action==='reset'){this.resetCoreSiegeSkillLabPlayer(p);if(target)this.resetCoreSiegeSkillLabPlayer(target);this.resetCoreSiegePracticePositions();return true;}
    if(action==='targetMode'){const mode=String(message?.mode);if(mode==='hold'||mode==='move'||mode==='attack')this.practiceTargetMode=mode;return true;}
    if(action==='invulnerable'){this.practiceTargetInvulnerable=Boolean(message?.enabled);return true;}
    const aim={aimWorldX:target?.x??p.x+360,aimWorldY:target?.y??p.y};
    if(action==='basic'){p.angle=Math.atan2(aim.aimWorldY-p.y,aim.aimWorldX-p.x);const profile=CORE_SIEGE_BASIC_ATTACKS[normalizeCoreSiegeHero(progress.heroId)];if(profile.weaponId==='fists')this.meleePlayer(p);else this.firePlayer(p,aim);return true;}
    const slot=Number(message?.slot) as CoreSiegeAbilitySlot;if(action==='cast'&&(slot===1||slot===2||slot===3)){this.setCoreSiegeAbilityReadyAt(progress,slot,0);return this.castCoreSiegeAbility(p,slot,aim,c);}
    return false;
  }

  private resetCoreSiegePracticePositions(){
    if(!this.practiceMode)return;const owner=[...this.state.players.values()].find((player)=>!player.ai),target=this.state.players.get('core-siege-practice-target'),cx=this.worldWidth/2,cy=this.worldHeight/2;
    if(owner){owner.x=cx-260;owner.y=cy;owner.angle=0;owner.alive=true;owner.phase='landed';this.coreSiegePlayer(owner.id).ability1ReadyAt=0;this.coreSiegePlayer(owner.id).ability2ReadyAt=0;this.coreSiegePlayer(owner.id).ultimateReadyAt=0;this.coreSiegePlayer(owner.id).positioningReadyAt=0;this.giveOpenArenaStarterKit(owner);}
    if(target){target.x=cx+260;target.y=cy;target.angle=Math.PI;target.alive=true;target.phase='landed';target.hp=target.maxHp=coreSiegeHeroMaxHp(normalizeCoreSiegeHero(this.coreSiegePlayer(target.id).heroId));this.giveOpenArenaStarterKit(target);const slot=this.openArenaAiSlots.get(target.id);if(slot){slot.state='alive';slot.respawnAt=0;}}
  }

  private updateCoreSiegePracticeTarget(){
    if(!this.practiceMode)return;const target=this.state.players.get('core-siege-practice-target'),owner=[...this.state.players.values()].find((player)=>!player.ai);if(!target?.alive||!owner?.alive)return;
    this.setAiNeutralInput(target);target.angle=Math.atan2(owner.y-target.y,owner.x-target.x);
    if(this.practiceTargetMode==='move')target.y=this.worldHeight/2+Math.sin(this.now()*1.35)*190;
    else if(this.practiceTargetMode==='attack')this.firePlayer(target,{aimWorldX:owner.x,aimWorldY:owner.y});
  }

  private resetCoreSiegeSkillLabPlayer(p:PlayerState){
    const progress=this.coreSiegePlayer(p.id);progress.ability1ReadyAt=0;progress.ability2ReadyAt=0;progress.ultimateReadyAt=0;progress.positioningReadyAt=0;progress.medicalGel=CORE_SIEGE_CONFIG.medicalGelMax;progress.heat=0;progress.temporaryShield=0;progress.parryRecoveryUntil=0;this.syncCoreSiegeHeroHealth(p,true);this.giveOpenArenaStarterKit(p);
  }

  private spawnCoreSiegeSkillLabTargets(p:PlayerState){
    for(const id of [...this.state.players.keys()])if(id.startsWith('siege-lab-')){this.state.players.delete(id);this.state.coreSiege.players.delete(id);}
    for(const id of [...this.state.coreSiege.minions.keys()])if(id.startsWith('siege-lab-'))this.state.coreSiege.minions.delete(id);
    const fx=Math.cos(p.angle),fy=Math.sin(p.angle),sx=-fy,sy=fx;
    for(const [suffix,team,forward,side] of [['ally',p.team,180,-150],['enemy',p.team==='blue'?'red':'blue',340,0]] as const){const target=new PlayerState();target.id=`siege-lab-${suffix}`;target.name=suffix==='ally'?'검수 아군':'검수 적군';target.team=team;target.ai=true;target.alive=true;target.phase='landed';target.x=p.x+fx*forward+sx*side;target.y=p.y+fy*forward+sy*side;target.maxHp=target.hp=300;this.state.players.set(target.id,target);this.coreSiegePlayer(target.id).heroId=suffix==='ally'?'shieldCaptain':'vanguard';}
    const minion=new CoreSiegeMinionState();minion.id='siege-lab-minion';minion.team=p.team==='blue'?'red':'blue';minion.kind='melee';minion.x=p.x+fx*300+sx*150;minion.y=p.y+fy*300+sy*150;minion.maxHp=minion.hp=320;minion.radius=22;minion.attackReadyAt=this.now()+999;this.state.coreSiege.minions.set(minion.id,minion);
    this.spawnCoreSiegeSummon(p,'gearling',1,1);this.broadcast('coreSiegeEffect',{kind:'skillLabTargets',ownerId:p.id,x:p.x+fx*300,y:p.y+fy*300,radius:190,duration:.9});
  }

  private activateFusionRobot(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(p)this.activateFusionRobotForPlayer(p,c);
  }

  private activateFusionRobotForPlayer(p:PlayerState,c?:Client){
    if(!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing)return false;
    const tactical=this.tacticalInventory(p.id);
    if(tactical.exoActive||tactical.exoAssembling)return false;
    const allParts=[...this.exoPartCounts(tactical,'assault'),...this.exoPartCounts(tactical,'emp')];
    if(allParts.some((count)=>count<1)){c?.send('notice',{type:'warning',message:'합체 로봇에는 적색과 청색 파츠 6개가 모두 필요합니다.'});return false;}
    let point:Point|undefined;
    const radius=FUSION_ROBOT_BALANCE.collisionRadius;
    for(const distanceFromPlayer of [0,40,64]){
      const samples=distanceFromPlayer===0?1:16;
      for(let index=0;index<samples;index++){
        const angle=p.angle+index/samples*Math.PI*2;
        const x=clamp(p.x+Math.cos(angle)*distanceFromPlayer,radius,this.worldWidth-radius),y=clamp(p.y+Math.sin(angle)*distanceFromPlayer,radius,this.worldHeight-radius);
        if(!this.isVehiclePositionFree(x,y,'',radius))continue;
        if([...this.state.players.values()].some((other)=>other.id!==p.id&&other.alive&&other.phase==='landed'&&distance(x,y,other.x,other.y)<radius+PLAYER_BODY_RADIUS+8))continue;
        point={x,y};break;
      }
      if(point)break;
    }
    if(!point){c?.send('notice',{type:'warning',message:'합체할 공간이 부족합니다. 건물 밖의 넓은 곳으로 이동하세요.'});return false;}
    const robot=new MotorcycleState();
    robot.id=`fusion-robot-${++this.fusionRobotSeq}`;robot.vehicleKind='fusion_robot';robot.x=point.x;robot.y=point.y;robot.rotation=p.angle;robot.turretAngle=p.angle;robot.lastSafeX=point.x;robot.lastSafeY=point.y;robot.hp=FUSION_ROBOT_BALANCE.maxHp;robot.maxHp=FUSION_ROBOT_BALANCE.maxHp;robot.fusionWeaponSlot=1;robot.buildingId=buildingIdAt(point.x,point.y,0,this.map.buildingVisibilityZones);
    this.state.motorcycles.set(robot.id,robot);this.vehicleStuckStates.set(robot.id,{lastX:point.x,lastY:point.y,stuckFor:0,lastRecoveryAt:-99});
    if(!this.mountMotorcycle(p,robot,c)){this.state.motorcycles.delete(robot.id);this.vehicleStuckStates.delete(robot.id);c?.send('notice',{type:'warning',message:'합체 로봇에 탑승할 수 없습니다.'});return false;}
    this.consumeExoParts(tactical,'assault');this.consumeExoParts(tactical,'emp');
    this.emitAudioEvent('exo_activate',{sourceId:p.id,x:robot.x,y:robot.y,buildingId:robot.buildingId,variant:'fusion'});
    c?.send('notice',{type:'success',message:'합체 로봇 완성 · 영구 기체 · 숫자 1~4 무기 전환'});
    return true;
  }

  private activateExoSuit(c:Client,kind:ExoSuitKind='assault'){
    const p=this.state.players.get(c.sessionId);if(p)this.activateExoSuitForPlayer(p,kind,c);
  }

  private activateExoSuitForPlayer(p:PlayerState,kind:ExoSuitKind='assault',c?:Client){
    if(!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting||p.werewolf.transformed)return false;
    const tactical=this.tacticalInventory(p.id);if(tactical.exoActive||tactical.exoAssembling)return false;
    if(this.exoPartCounts(tactical,kind).some((count)=>count<1)){c?.send('notice',{type:'warning',message:kind==='emp'?'청색 EMP 로봇 머리·코어·팔다리 파츠가 모두 필요합니다.':'강철 엑소슈트 머리·코어·팔다리 파츠가 모두 필요합니다.'});return false;}
    const now=this.now(),assemblySeconds=kind==='emp'?EMP_EXO_SUIT_BALANCE.assemblySeconds:EXO_SUIT_BALANCE.assemblySeconds;tactical.exoKind=kind;tactical.exoAssembling=true;tactical.exoAssemblyStartedAt=now;tactical.exoAssemblyEndsAt=now+assemblySeconds;tactical.empDisabledUntil=0;tactical.empPulseReadyAt=0;p.werewolf.actionLockedUntil=Math.max(p.werewolf.actionLockedUntil,tactical.exoAssemblyEndsAt);p.isSniperScoped=false;this.cancelReload(p);this.cancelHeal(p);this.cancelThrow(p);this.emitAudioEvent('exo_assembly',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:kind});c?.send('notice',{type:'info',message:kind==='emp'?'청색 EMP 로봇 파츠 결합 중':'강철 엑소슈트 파츠 결합 중'});return true;
  }

  private endExoSuit(p:PlayerState,reason:'expired'|'destroyed'|'death'){
    const exo=this.tacticalInventory(p.id);
    if(!exo.exoActive)return;
    const kind:ExoSuitKind=exo.exoKind==='emp'?'emp':'assault';
    const hero=this.gameMode==='coreSiege'?normalizeCoreSiegeHero(this.coreSiegePlayer(p.id).heroId):undefined;
    const corePilot=hero==='steelPilot'||hero==='empPilot';
    exo.exoActive=false;exo.exoAssembling=false;exo.exoKind='';exo.exoHp=0;exo.exoEndsAt=0;exo.empDisabledUntil=0;exo.empPulseReadyAt=0;
    this.exoBombAt.delete(p.id);this.exoLaserAt.delete(p.id);this.empExoGunAt.delete(p.id);
    if(corePilot){
      if(reason==='destroyed'&&p.alive)p.hp=Math.min(p.hp,CORE_SIEGE_CONFIG.robotDestroyedPilotHp);
      this.broadcast('coreSiegeEffect',{kind:'robotEnd',ownerId:p.id,robotKind:kind,x:p.x,y:p.y,radius:110,duration:.8,reason});
      return;
    }
    const name=kind==='emp'?'청색 EMP 로봇':'강철 엑소슈트',subject=kind==='emp'?'청색 EMP 로봇이':'강철 엑소슈트가';
    this.scatterExoParts(kind);
    this.system(reason==='expired'?`${name}의 가동 시간이 끝나 파츠가 흩어졌습니다.`:reason==='destroyed'?`${subject} 파괴되어 파츠가 흩어졌습니다.`:`${name} 조종자가 쓰러져 파츠가 흩어졌습니다.`);
  }

  private updateExoSuits(){
    const now=this.now();
    for(const p of this.state.players.values()){
      const exo=this.tacticalInventory(p.id);
      if(exo.empDisabledUntil>0&&now>=exo.empDisabledUntil)exo.empDisabledUntil=0;
      if(exo.exoAssembling&&now>=exo.exoAssemblyEndsAt){
        const kind:ExoSuitKind=exo.exoKind==='emp'?'emp':'assault',counts=this.exoPartCounts(exo,kind),balance=kind==='emp'?EMP_EXO_SUIT_BALANCE:EXO_SUIT_BALANCE;
        exo.exoAssembling=false;exo.exoAssemblyStartedAt=0;exo.exoAssemblyEndsAt=0;
        if(p.alive&&p.phase==='landed'&&counts.every((count)=>count>0)){this.consumeExoParts(exo,kind);exo.exoActive=true;exo.exoHp=balance.maxHp;exo.exoEndsAt=now+balance.durationSeconds;exo.empPulseReadyAt=kind==='emp'?now:0;this.emitAudioEvent('exo_activate',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:kind});this.playerClient(p.id)?.send('notice',{type:'success',message:`${kind==='emp'?'청색 EMP 로봇':'강철 엑소슈트'} 가동 · ${balance.durationSeconds}초`});}
        else exo.exoKind='';
      }
      if(exo.exoActive&&now>=exo.exoEndsAt)this.endExoSuit(p,'expired');
    }
  }

  private exoAimPoint(p:PlayerState,m:any,maxRange:number){const requestedX=Number(m?.aimWorldX),requestedY=Number(m?.aimWorldY),angle=p.angle,dx=Number.isFinite(requestedX)?requestedX-p.x:Math.cos(angle)*maxRange,dy=Number.isFinite(requestedY)?requestedY-p.y:Math.sin(angle)*maxRange,length=Math.hypot(dx,dy)||1,range=Math.min(maxRange,length);return{x:p.x+dx/length*range,y:p.y+dy/length*range};}

  private empExoMachineGunAimPoint(p:PlayerState,m:any){
    const base=this.exoAimPoint(p,m,EMP_EXO_SUIT_BALANCE.machineGunRange),baseDx=base.x-p.x,baseDy=base.y-p.y,baseAngle=Math.hypot(baseDx,baseDy)>1?Math.atan2(baseDy,baseDx):p.angle,maxAngle=EMP_EXO_SUIT_BALANCE.machineGunAimAssistDegrees*Math.PI/180;
    let assisted:Point|undefined,bestScore=Number.POSITIVE_INFINITY;
    const consider=(x:number,y:number,radius:number,velocityX=0,velocityY=0)=>{
      const dx=x-p.x,dy=y-p.y,range=Math.hypot(dx,dy);if(range<=1||range>EMP_EXO_SUIT_BALANCE.machineGunRange)return;
      const delta=Math.abs(this.angleDiff(Math.atan2(dy,dx),baseAngle)),missDistance=Math.sin(delta)*range;if(delta>maxAngle||missDistance>radius+EMP_EXO_SUIT_BALANCE.machineGunAimAssistRadius)return;
      if(this.firstObstacleHitT(p.x,p.y,x,y,EMP_EXO_SUIT_BALANCE.machineGunProjectileRadius)!==null)return;
      const score=delta+range/EMP_EXO_SUIT_BALANCE.machineGunRange*.015;if(score>=bestScore)return;
      const leadSeconds=range/EMP_EXO_SUIT_BALANCE.machineGunProjectileSpeed*EMP_EXO_SUIT_BALANCE.machineGunLeadRatio,predictedX=x+velocityX*leadSeconds,predictedY=y+velocityY*leadSeconds,predictedDx=predictedX-p.x,predictedDy=predictedY-p.y,predictedLength=Math.hypot(predictedDx,predictedDy)||1,clampedRange=Math.min(EMP_EXO_SUIT_BALANCE.machineGunRange,predictedLength);
      bestScore=score;assisted={x:p.x+predictedDx/predictedLength*clampedRange,y:p.y+predictedDy/predictedLength*clampedRange};
    };
    for(const vehicle of this.state.motorcycles.values())if(!vehicle.destroyed&&!vehicle.exploding&&vehicle.driverId!==p.id)consider(vehicle.x,vehicle.y,this.vehicleRadius(vehicle),vehicle.velocityX,vehicle.velocityY);
    for(const target of this.state.players.values())if(target.id!==p.id&&target.alive&&target.phase==='landed'&&this.tacticalInventory(target.id).exoActive)consider(target.x,target.y,PLAYER_HIT_RADIUS+7);
    return assisted??base;
  }

  private fireExoBomb(c:Client,m:any){
    const p=this.state.players.get(c.sessionId);if(p)this.fireExoBombForPlayer(p,m);
  }

  private fireExoBombForPlayer(p:PlayerState,m:any){
    const now=this.now(),exo=this.tacticalInventory(p.id);
    if(!exo.exoActive||exo.exoKind==='emp'||now<exo.empDisabledUntil||now<(this.exoBombAt.get(p.id)??0))return false;
    const coreSteel=this.gameMode==='coreSiege'&&normalizeCoreSiegeHero(this.coreSiegePlayer(p.id).heroId)==='steelPilot';
    if(coreSteel){
      const progress=this.coreSiegePlayer(p.id);
      if(progress.heat>=100)return false;
      this.exoBombAt.set(p.id,now+.095);progress.heat=Math.min(100,progress.heat+4);
      const point=this.exoAimPoint(p,m,900),angle=Math.atan2(point.y-p.y,point.x-p.x)+(Math.random()*2-1)*.035,muzzleX=p.x+Math.cos(angle)*48,muzzleY=p.y+Math.sin(angle)*48;
      if(this.firstObstacleHitT(p.x,p.y,muzzleX,muzzleY,1)!==null)return false;
      p.attackSeq++;
      const bullet=new BulletState();bullet.id=`b-${++this.bulletSeq}`;bullet.owner=p.id;bullet.weaponId='railgun';bullet.x=muzzleX;bullet.y=muzzleY;bullet.prevX=muzzleX;bullet.prevY=muzzleY;bullet.vx=Math.cos(angle)*1900;bullet.vy=Math.sin(angle)*1900;bullet.life=.55;bullet.damage=13*coreSiegeBasicDamageMultiplier(progress.level);bullet.radius=5;bullet.buildingId=p.buildingId;bullet.shotSeq=p.attackSeq;this.state.bullets.set(bullet.id,bullet);
      this.emitAudioEvent('weapon_fire',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'railgun',sequence:p.attackSeq});
      return true;
    }
    this.exoBombAt.set(p.id,now+EXO_SUIT_BALANCE.bombCooldownSeconds);this.spawnExoMissile(p,m);p.attackSeq++;return true;
  }

  private spawnExoMissile(p:PlayerState,m:any){
    const point=this.exoAimPoint(p,m,EXO_SUIT_BALANCE.bombRange),angle=Math.atan2(point.y-p.y,point.x-p.x),sideX=-Math.sin(angle),sideY=Math.cos(angle),muzzleX=p.x+Math.cos(angle)*38-sideX*27,muzzleY=p.y+Math.sin(angle)*38-sideY*27;
    const rocket=new RocketState();rocket.id=`rocket-${++this.rocketSeq}`;rocket.ownerId=p.id;rocket.weaponId='exo_missile';rocket.x=muzzleX;rocket.y=muzzleY;rocket.prevX=muzzleX;rocket.prevY=muzzleY;rocket.vx=Math.cos(angle)*EXO_SUIT_BALANCE.missileSpeed;rocket.vy=Math.sin(angle)*EXO_SUIT_BALANCE.missileSpeed;rocket.life=EXO_SUIT_BALANCE.bombRange/EXO_SUIT_BALANCE.missileSpeed+.2;rocket.radius=EXO_SUIT_BALANCE.missileRadius;rocket.buildingId=p.buildingId;this.state.rockets.set(rocket.id,rocket);this.emitAudioEvent('weapon_fire',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'bazooka',sequence:p.attackSeq});
  }

  private explodeExoMissile(rocket:RocketState,directMotorcycle?:MotorcycleState){
    const now=this.now(),buildingId=buildingIdAt(rocket.x,rocket.y,0,this.map.buildingVisibilityZones),source={x:rocket.x,y:rocket.y,buildingId},radius=EXO_SUIT_BALANCE.bombRadius;
    const explosion=new ExplosionState();explosion.id=`explosion-${++this.explosionSeq}`;explosion.x=rocket.x;explosion.y=rocket.y;explosion.radius=radius;explosion.startedAt=now;explosion.duration=.46;explosion.sourceId=rocket.id;explosion.ownerId=rocket.ownerId;explosion.kind='exoBomb';explosion.attackerId=rocket.ownerId;explosion.weaponType='exo_missile';explosion.vehicleDamage=EXO_SUIT_BALANCE.missileDirectVehicleDamage;explosion.buildingId=buildingId;this.state.explosions.set(explosion.id,explosion);
    for(const target of this.state.players.values()){if(!target.alive||target.phase!=='landed'||target.id===rocket.ownerId)continue;const d=distance(rocket.x,rocket.y,target.x,target.y);if(d>radius)continue;const exposure=explosionExposureMultiplier(source,target,this.map.visibilityObstacles,this.map.buildingVisibilityZones,PLAYER_HIT_RADIUS),damage=Math.round(EXO_SUIT_BALANCE.bombDamage*(1-d/radius*.65)*exposure);if(damage>0)this.damage(target,damage,rocket.ownerId,'엑소 소형 미사일',115,Math.atan2(target.y-rocket.y,target.x-rocket.x),'explosion');}
    for(const vehicle of this.state.motorcycles.values()){if(vehicle.destroyed)continue;const d=distance(rocket.x,rocket.y,vehicle.x,vehicle.y),direct=vehicle.id===directMotorcycle?.id;if(d>radius+this.vehicleRadius(vehicle)&&!direct)continue;const base=direct?EXO_SUIT_BALANCE.missileDirectVehicleDamage:Math.round(EXO_SUIT_BALANCE.missileSplashVehicleDamage*(1-Math.min(1,d/radius)*.6)),damage=vehicle.vehicleKind==='tank'?Math.round(base*.82):base;if(damage>0)this.damageMotorcycle(vehicle,damage,rocket.ownerId,'엑소 소형 미사일');}
    if(this.gameMode==='coreSiege')this.damageCoreSiegeMinionsInRadius(rocket.x,rocket.y,radius,EXO_SUIT_BALANCE.bombDamage*1.25,rocket.ownerId,.55);
    this.damageCoreSiegeStructuresInRadius(rocket.x,rocket.y,radius,68,rocket.ownerId);
    this.emitAudioEvent('bazooka_explosion',{sourceId:rocket.id,ownerId:rocket.ownerId,x:rocket.x,y:rocket.y,buildingId,radius,weaponType:'exo_missile',vehicleDamage:EXO_SUIT_BALANCE.missileDirectVehicleDamage});
  }

  private fireExoLaser(c:Client,m:any){
    const p=this.state.players.get(c.sessionId);if(p)this.fireExoLaserForPlayer(p,m);
  }

  private fireExoLaserForPlayer(p:PlayerState,m:any){
    const now=this.now(),exo=this.tacticalInventory(p.id);if(!exo.exoActive||exo.exoKind==='emp'||now<exo.empDisabledUntil||now<(this.exoLaserAt.get(p.id)??0))return false;this.exoLaserAt.set(p.id,now+EXO_SUIT_BALANCE.laserCooldownSeconds);const end=this.exoAimPoint(p,m,EXO_SUIT_BALANCE.laserRange);let selectedPlayer:PlayerState|undefined,selectedVehicle:MotorcycleState|undefined,selectedStructure:CoreSiegeStructureState|undefined,closest=1;
    const obstacleT=this.firstObstacleHitT(p.x,p.y,end.x,end.y,3);if(obstacleT!==null)closest=obstacleT;
    for(const target of this.state.players.values()){if(!target.alive||target.id===p.id)continue;const t=segmentCircleIntersectionT(p.x,p.y,end.x,end.y,target.x,target.y,PLAYER_HIT_RADIUS+7);if(t!==null&&t<closest){closest=t;selectedPlayer=target;selectedVehicle=undefined;}}
    for(const vehicle of this.state.motorcycles.values()){if(vehicle.destroyed||vehicle.driverId===p.id)continue;const t=segmentCircleIntersectionT(p.x,p.y,end.x,end.y,vehicle.x,vehicle.y,this.vehicleRadius(vehicle)+5);if(t!==null&&t<closest){closest=t;selectedVehicle=vehicle;selectedPlayer=undefined;}}
    if(this.gameMode==='coreSiege')for(const structure of this.state.coreSiege.structures.values()){if(structure.destroyed||structure.team===p.team)continue;const t=segmentCircleIntersectionT(p.x,p.y,end.x,end.y,structure.x,structure.y,structure.radius+5);if(t!==null&&t<closest){closest=t;selectedStructure=structure;selectedVehicle=undefined;selectedPlayer=undefined;}}
    if(selectedPlayer)this.damage(selectedPlayer,EXO_SUIT_BALANCE.laserDamage,p.id,'엑소 에너지 빔',0,Math.atan2(selectedPlayer.y-p.y,selectedPlayer.x-p.x),'bullet');
    else if(selectedVehicle)this.damageMotorcycle(selectedVehicle,selectedVehicle.vehicleKind==='tank'?Math.round(EXO_SUIT_BALANCE.laserVehicleDamage*.75):EXO_SUIT_BALANCE.laserVehicleDamage,p.id,'엑소 에너지 빔');
    else if(selectedStructure)this.hitCoreSiegeStructure(selectedStructure,EXO_SUIT_BALANCE.laserDamage*.65,p.id,p.x+(end.x-p.x)*closest,p.y+(end.y-p.y)*closest);
    p.attackSeq++;this.broadcast('exoLaser',{ownerId:p.id,x1:p.x,y1:p.y,x2:p.x+(end.x-p.x)*closest,y2:p.y+(end.y-p.y)*closest,duration:EXO_SUIT_BALANCE.laserDurationSeconds,expiresAt:now+EXO_SUIT_BALANCE.laserDurationSeconds});return true;
  }

  private fireEmpExoMachineGun(c:Client,m:any){
    const p=this.state.players.get(c.sessionId);if(p)this.fireEmpExoMachineGunForPlayer(p,m);
  }

  private fireEmpExoMachineGunForPlayer(p:PlayerState,m:any){
    const now=this.now();if(!p.alive||p.phase!=='landed')return false;
    const exo=this.tacticalInventory(p.id);if(!exo.exoActive||exo.exoKind!=='emp'||now<exo.empDisabledUntil||now<(this.empExoGunAt.get(p.id)??0))return;
    if(this.gameMode==='coreSiege'&&normalizeCoreSiegeHero(this.coreSiegePlayer(p.id).heroId)==='empPilot'){
      const progress=this.coreSiegePlayer(p.id);if(progress.heat>=100)return false;progress.heat=Math.min(100,progress.heat+5);
    }
    this.empExoGunAt.set(p.id,now+EMP_EXO_SUIT_BALANCE.machineGunCooldownSeconds);
    while(this.state.bullets.size>=this.state.activeBulletLimit){const oldest=this.state.bullets.keys().next().value as string|undefined;if(!oldest)break;this.state.bullets.delete(oldest);}
    const point=this.empExoMachineGunAimPoint(p,m),baseAngle=Math.atan2(point.y-p.y,point.x-p.x),sideX=-Math.sin(baseAngle),sideY=Math.cos(baseAngle),muzzleX=p.x+Math.cos(baseAngle)*42+sideX*24,muzzleY=p.y+Math.sin(baseAngle)*42+sideY*24,angle=Math.atan2(point.y-muzzleY,point.x-muzzleX)+(Math.random()*2-1)*EMP_EXO_SUIT_BALANCE.machineGunSpread;
    if(this.firstObstacleHitT(p.x,p.y,muzzleX,muzzleY,1)!==null)return;
    p.attackSeq++;
    const bullet=new BulletState();bullet.id=`b-${++this.bulletSeq}`;bullet.owner=p.id;bullet.weaponId='emp_exo_machine_gun';bullet.x=muzzleX;bullet.y=muzzleY;bullet.prevX=muzzleX;bullet.prevY=muzzleY;bullet.vx=Math.cos(angle)*EMP_EXO_SUIT_BALANCE.machineGunProjectileSpeed;bullet.vy=Math.sin(angle)*EMP_EXO_SUIT_BALANCE.machineGunProjectileSpeed;bullet.life=EMP_EXO_SUIT_BALANCE.machineGunRange/EMP_EXO_SUIT_BALANCE.machineGunProjectileSpeed+.12;bullet.damage=EMP_EXO_SUIT_BALANCE.machineGunPlayerDamage;bullet.radius=EMP_EXO_SUIT_BALANCE.machineGunProjectileRadius;bullet.buildingId=p.buildingId;bullet.shotSeq=p.attackSeq;this.state.bullets.set(bullet.id,bullet);
    this.addAiNoise(p.x,p.y,p.id,'gun',780,.58);this.emitAudioEvent('weapon_fire',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'smg',sequence:p.attackSeq});return true;
  }

  private fireEmpExoPulse(c:Client){
    const p=this.state.players.get(c.sessionId);if(p)this.fireEmpExoPulseForPlayer(p,c);
  }

  private fireEmpExoPulseForPlayer(p:PlayerState,c?:Client){
    const now=this.now();if(!p.alive||p.phase!=='landed')return false;
    const exo=this.tacticalInventory(p.id);if(!exo.exoActive||exo.exoKind!=='emp'||now<exo.empDisabledUntil||now<exo.empPulseReadyAt)return false;
    const disabledUntil=now+EMP_EXO_SUIT_BALANCE.empDisableSeconds,affected=new Set<string>(),affectedTargets:Array<{id:string;x:number;y:number;velocityX:number;velocityY:number;kind:string}>=[];exo.empPulseReadyAt=now+EMP_EXO_SUIT_BALANCE.empCooldownSeconds;p.attackSeq++;
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed||distance(p.x,p.y,vehicle.x,vehicle.y)>EMP_EXO_SUIT_BALANCE.empRadius)continue;
      affectedTargets.push({id:vehicle.id,x:vehicle.x,y:vehicle.y,velocityX:vehicle.velocityX,velocityY:vehicle.velocityY,kind:vehicle.vehicleKind});
      vehicle.empDisabledUntil=Math.max(vehicle.empDisabledUntil,disabledUntil);vehicle.velocityX=0;vehicle.velocityY=0;vehicle.speed=0;vehicle.angularVelocity=0;affected.add(vehicle.id);
      const motion=this.vehicleMotionStates.get(vehicle.id);if(motion){motion.movementHeldMs=0;motion.previousInputX=0;motion.previousInputY=0;}
      const driver=vehicle.driverId?this.state.players.get(vehicle.driverId):undefined,input=driver?this.inputs.get(driver.id):undefined;if(input){input.x=0;input.y=0;input.aiming=false;}if(driver)this.playerClient(driver.id)?.send('notice',{type:'warning',message:`EMP 피격 · 차량 ${EMP_EXO_SUIT_BALANCE.empDisableSeconds}초 정지`});
    }
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed'||target.id===p.id||distance(p.x,p.y,target.x,target.y)>EMP_EXO_SUIT_BALANCE.empRadius)continue;
      const targetExo=this.tacticalInventory(target.id);if(!targetExo.exoActive&&targetExo.hunterDroneCount<=0)continue;
      affectedTargets.push({id:target.id,x:target.x,y:target.y,velocityX:0,velocityY:0,kind:targetExo.exoActive?`${targetExo.exoKind||'assault'}_robot`:'escort_drone'});
      targetExo.empDisabledUntil=Math.max(targetExo.empDisabledUntil,disabledUntil);affected.add(target.id);
      if(targetExo.exoActive){const input=this.inputs.get(target.id);if(input){input.x=0;input.y=0;input.aiming=false;input.huntSprint=false;}this.knockback.delete(target.id);this.cancelHeal(target);this.cancelReload(target);this.cancelThrow(target);target.isSniperScoped=false;this.playerClient(target.id)?.send('notice',{type:'warning',message:`EMP 피격 · 로봇 ${EMP_EXO_SUIT_BALANCE.empDisableSeconds}초 정지`});}
    }
    this.broadcast('empPulse',{ownerId:p.id,x:p.x,y:p.y,radius:EMP_EXO_SUIT_BALANCE.empRadius,duration:.9,fieldDuration:3.2,disabledUntil,affectedIds:[...affected],affectedTargets});
    this.emitAudioEvent('emp_pulse',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,radius:EMP_EXO_SUIT_BALANCE.empRadius});
    c?.send('notice',{type:'success',message:affected.size?`EMP 발동 · 기계 장비 ${affected.size}개 정지`:'EMP 발동 · 범위 안에 기계 장비 없음'});return true;
  }

  private fusionRobotFor(p:PlayerState){
    const vehicle=p.isDriving&&p.vehicleId?this.state.motorcycles.get(p.vehicleId):undefined;
    return vehicle?.vehicleKind==='fusion_robot'&&vehicle.driverId===p.id?vehicle:undefined;
  }

  private fireFusionRobotWeapon(p:PlayerState,robot:MotorcycleState,m:any){
    if(robot.destroyed||robot.exploding||this.now()<robot.empDisabledUntil)return;
    const slot=Math.max(1,Math.min(4,Math.floor(Number(robot.fusionWeaponSlot||1)))) as FusionRobotWeaponSlot;
    const now=this.now();
    if(slot===1){if(now<robot.fusionMissileReadyAt)return;robot.fusionMissileReadyAt=now+EXO_SUIT_BALANCE.bombCooldownSeconds;this.spawnExoMissile(p,m);p.attackSeq++;return;}
    if(slot===2){if(now<robot.fusionLaserReadyAt)return;robot.fusionLaserReadyAt=now+EXO_SUIT_BALANCE.laserCooldownSeconds;this.fireFusionLaser(p,m,now);return;}
    if(slot===3){if(now<robot.fusionMachineGunReadyAt)return;robot.fusionMachineGunReadyAt=now+EMP_EXO_SUIT_BALANCE.machineGunCooldownSeconds;this.fireFusionMachineGun(p,m);return;}
    if(now<robot.fusionEmpReadyAt)return;robot.fusionEmpReadyAt=now+EMP_EXO_SUIT_BALANCE.empCooldownSeconds;this.fireFusionEmpPulse(p,robot,now);
  }

  private fireFusionLaser(p:PlayerState,m:any,now:number){
    const end=this.exoAimPoint(p,m,EXO_SUIT_BALANCE.laserRange);let selectedPlayer:PlayerState|undefined,selectedVehicle:MotorcycleState|undefined,closest=1;
    const obstacleT=this.firstObstacleHitT(p.x,p.y,end.x,end.y,3);if(obstacleT!==null)closest=obstacleT;
    for(const target of this.state.players.values()){if(!target.alive||target.id===p.id)continue;const t=segmentCircleIntersectionT(p.x,p.y,end.x,end.y,target.x,target.y,PLAYER_HIT_RADIUS+7);if(t!==null&&t<closest){closest=t;selectedPlayer=target;selectedVehicle=undefined;}}
    for(const vehicle of this.state.motorcycles.values()){if(vehicle.destroyed||vehicle.driverId===p.id)continue;const t=segmentCircleIntersectionT(p.x,p.y,end.x,end.y,vehicle.x,vehicle.y,this.vehicleRadius(vehicle)+5);if(t!==null&&t<closest){closest=t;selectedVehicle=vehicle;selectedPlayer=undefined;}}
    if(selectedPlayer)this.damage(selectedPlayer,EXO_SUIT_BALANCE.laserDamage,p.id,'합체 로봇 에너지 레이저',0,Math.atan2(selectedPlayer.y-p.y,selectedPlayer.x-p.x),'bullet');
    if(selectedVehicle)this.damageMotorcycle(selectedVehicle,selectedVehicle.vehicleKind==='tank'?Math.round(EXO_SUIT_BALANCE.laserVehicleDamage*.75):EXO_SUIT_BALANCE.laserVehicleDamage,p.id,'합체 로봇 에너지 레이저');
    p.attackSeq++;this.broadcast('exoLaser',{ownerId:p.id,x1:p.x,y1:p.y,x2:p.x+(end.x-p.x)*closest,y2:p.y+(end.y-p.y)*closest,duration:EXO_SUIT_BALANCE.laserDurationSeconds,expiresAt:now+EXO_SUIT_BALANCE.laserDurationSeconds});
  }

  private fireFusionMachineGun(p:PlayerState,m:any){
    while(this.state.bullets.size>=this.state.activeBulletLimit){const oldest=this.state.bullets.keys().next().value as string|undefined;if(!oldest)break;this.state.bullets.delete(oldest);}
    const point=this.empExoMachineGunAimPoint(p,m),baseAngle=Math.atan2(point.y-p.y,point.x-p.x),sideX=-Math.sin(baseAngle),sideY=Math.cos(baseAngle),muzzleX=p.x+Math.cos(baseAngle)*50+sideX*31,muzzleY=p.y+Math.sin(baseAngle)*50+sideY*31,angle=Math.atan2(point.y-muzzleY,point.x-muzzleX)+(Math.random()*2-1)*EMP_EXO_SUIT_BALANCE.machineGunSpread;
    if(this.firstObstacleHitT(p.x,p.y,muzzleX,muzzleY,1)!==null)return;
    p.attackSeq++;const bullet=new BulletState();bullet.id=`b-${++this.bulletSeq}`;bullet.owner=p.id;bullet.weaponId='emp_exo_machine_gun';bullet.x=muzzleX;bullet.y=muzzleY;bullet.prevX=muzzleX;bullet.prevY=muzzleY;bullet.vx=Math.cos(angle)*EMP_EXO_SUIT_BALANCE.machineGunProjectileSpeed;bullet.vy=Math.sin(angle)*EMP_EXO_SUIT_BALANCE.machineGunProjectileSpeed;bullet.life=EMP_EXO_SUIT_BALANCE.machineGunRange/EMP_EXO_SUIT_BALANCE.machineGunProjectileSpeed+.12;bullet.damage=EMP_EXO_SUIT_BALANCE.machineGunPlayerDamage;bullet.radius=EMP_EXO_SUIT_BALANCE.machineGunProjectileRadius;bullet.buildingId=p.buildingId;bullet.shotSeq=p.attackSeq;this.state.bullets.set(bullet.id,bullet);
    this.addAiNoise(p.x,p.y,p.id,'gun',780,.58);this.emitAudioEvent('weapon_fire',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'smg',sequence:p.attackSeq});
  }

  private fireFusionEmpPulse(p:PlayerState,sourceRobot:MotorcycleState,now:number){
    const disabledUntil=now+EMP_EXO_SUIT_BALANCE.empDisableSeconds,affected=new Set<string>(),affectedTargets:Array<{id:string;x:number;y:number;velocityX:number;velocityY:number;kind:string}>=[];p.attackSeq++;
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.id===sourceRobot.id||vehicle.destroyed||distance(p.x,p.y,vehicle.x,vehicle.y)>EMP_EXO_SUIT_BALANCE.empRadius)continue;
      affectedTargets.push({id:vehicle.id,x:vehicle.x,y:vehicle.y,velocityX:vehicle.velocityX,velocityY:vehicle.velocityY,kind:vehicle.vehicleKind});
      vehicle.empDisabledUntil=Math.max(vehicle.empDisabledUntil,disabledUntil);vehicle.velocityX=0;vehicle.velocityY=0;vehicle.speed=0;vehicle.angularVelocity=0;affected.add(vehicle.id);
      const motion=this.vehicleMotionStates.get(vehicle.id);if(motion){motion.movementHeldMs=0;motion.previousInputX=0;motion.previousInputY=0;}
      const driver=vehicle.driverId?this.state.players.get(vehicle.driverId):undefined,input=driver?this.inputs.get(driver.id):undefined;if(input){input.x=0;input.y=0;input.aiming=false;}if(driver)this.playerClient(driver.id)?.send('notice',{type:'warning',message:`EMP 피격 · 차량 ${EMP_EXO_SUIT_BALANCE.empDisableSeconds}초 정지`});
    }
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed'||target.id===p.id||distance(p.x,p.y,target.x,target.y)>EMP_EXO_SUIT_BALANCE.empRadius)continue;
      const targetExo=this.tacticalInventory(target.id);if(!targetExo.exoActive&&targetExo.hunterDroneCount<=0)continue;
      affectedTargets.push({id:target.id,x:target.x,y:target.y,velocityX:0,velocityY:0,kind:targetExo.exoActive?`${targetExo.exoKind||'assault'}_robot`:'escort_drone'});
      targetExo.empDisabledUntil=Math.max(targetExo.empDisabledUntil,disabledUntil);affected.add(target.id);
      if(targetExo.exoActive){const input=this.inputs.get(target.id);if(input){input.x=0;input.y=0;input.aiming=false;input.huntSprint=false;}this.knockback.delete(target.id);this.cancelHeal(target);this.cancelReload(target);this.cancelThrow(target);target.isSniperScoped=false;this.playerClient(target.id)?.send('notice',{type:'warning',message:`EMP 피격 · 로봇 ${EMP_EXO_SUIT_BALANCE.empDisableSeconds}초 정지`});}
    }
    this.broadcast('empPulse',{ownerId:p.id,x:p.x,y:p.y,radius:EMP_EXO_SUIT_BALANCE.empRadius,duration:.9,fieldDuration:3.2,disabledUntil,affectedIds:[...affected],affectedTargets});this.emitAudioEvent('emp_pulse',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,radius:EMP_EXO_SUIT_BALANCE.empRadius});this.playerClient(p.id)?.send('notice',{type:'success',message:affected.size?`EMP 발동 · 기계 장비 ${affected.size}개 정지`:'EMP 발동 · 범위 안에 기계 장비 없음'});
  }

  private activeTankKeyCount(){let count=0;for(const player of this.state.players.values())if(player.alive)count+=this.tacticalInventory(player.id).tankKeyCount;return count;}

  private spawnTankKeyLoot(){
    const desired=this.gameMode==='domination'?4:1;
    let missing=desired-this.activeTankKeyCount()-[...this.state.loot.values()].filter((loot)=>loot.kind==='tank_key').length;
    if(missing<=0)return false;
    const centerX=this.worldSize/2,centerY=this.worldSize/2;
    const candidates=[...this.state.loot.values()].filter((loot)=>loot.kind!=='tank_key'&&distance(loot.x,loot.y,centerX,centerY)>this.worldSize*.14);
    let placed=false;
    while(missing>0&&candidates.length){const selected=candidates.splice(Math.floor(this.lootRandom()*candidates.length),1)[0]!;selected.kind='tank_key';selected.stackCount=1;selected.ammoCount=-1;selected.weaponMagazine=-1;selected.grantsAmmo=false;missing--;placed=true;}
    for(const spawn of this.map.lootSpawns){
      if(missing<=0)break;
      if(distance(spawn.x,spawn.y,centerX,centerY)<=this.worldSize*.18)continue;
      const expected=spaceAt(spawn.x,spawn.y,this.map.buildingVisibilityZones,this.map.rooms,0);
      const pos=this.findSeparatedLootPosition(spawn.x,spawn.y,'tank_key',spawn.buildingId??expected.buildingId,spawn.roomIndex??expected.roomIndex);
      if(!pos)continue;
      const loot=new LootState();loot.id=`loot-${++this.lootSeq}`;loot.kind='tank_key';loot.x=pos.x;loot.y=pos.y;const lootSpace=spaceAt(pos.x,pos.y,this.map.buildingVisibilityZones,this.map.rooms,0);loot.buildingId=lootSpace.buildingId;loot.roomIndex=lootSpace.roomIndex;loot.grantsAmmo=false;this.state.loot.set(loot.id,loot);missing--;placed=true;
    }
    if(placed)this.tankKeyRespawnAt=this.now()+45;
    return placed;
  }

  private lootSpacing(kind:LootKind){return kind in WEAPONS&&kind!=='fists'?GUN_LOOT_MIN_DISTANCE:LOOT_MIN_DISTANCE;}

  private doorCenters():Point[]{
    return this.map.buildings.map((building)=>{
      if(building.doorSide==='north'||building.doorSide==='south')return{x:building.x+building.w*building.doorOffset,y:building.doorSide==='north'?building.y:building.y+building.h};
      return{x:building.doorSide==='west'?building.x:building.x+building.w,y:building.y+building.h*building.doorOffset};
    });
  }

  private isLootPositionValid(x:number,y:number,kind:LootKind,ignoreId='',expectedBuildingId?:string,expectedRoomIndex?:number){
    if(x<40||y<40||x>this.worldWidth-40||y>this.worldHeight-40)return false;
    if(this.terrainKindAt(x,y)==='deep-water')return false;
    if(this.collisionRects().some((rect)=>circleHitsRect(x,y,LOOT_WALL_CLEARANCE,rect)))return false;
    if(this.doorCenters().some((door)=>distance(x,y,door.x,door.y)<LOOT_DOOR_CLEARANCE))return false;
    if(this.map.portals.some((portal)=>circleHitsRect(x,y,LOOT_DOOR_CLEARANCE*.75,portal.opening)))return false;
    if(this.map.shoreExits.some((exit)=>circleHitsRect(x,y,LOOT_DOOR_CLEARANCE*.6,exit.entry)))return false;
    const space=spaceAt(x,y,this.map.buildingVisibilityZones,this.map.rooms,0);
    if(expectedBuildingId!==undefined&&space.buildingId!==expectedBuildingId)return false;
    if(expectedRoomIndex!==undefined&&space.roomIndex!==expectedRoomIndex)return false;
    const min=this.lootSpacing(kind);
    for(const loot of this.state.loot.values()){
      if(loot.id===ignoreId)continue;
      const otherMin=this.lootSpacing(loot.kind as LootKind);
      if(distance(x,y,loot.x,loot.y)<Math.max(min,otherMin))return false;
    }
    return true;
  }

  private findSeparatedLootPosition(baseX:number,baseY:number,kind:LootKind,expectedBuildingId?:string,expectedRoomIndex?:number,positionAllowed?:(point:Point)=>boolean):Point|undefined{
    const dock8=this.map.id==='dock8';
    const attempts=dock8?32:18;
    for(let i=0;i<attempts;i++){
      const ring=Math.floor(i/6);
      const radius=i===0?(dock8?28+this.lootRandom()*62:0):42+ring*52+this.lootRandom()*(dock8?42:28);
      const angle=(i*2.399963+this.lootRandom()*(dock8?0.9:0.45))%(Math.PI*2);
      const x=clamp(baseX+Math.cos(angle)*radius,40,this.worldWidth-40);
      const y=clamp(baseY+Math.sin(angle)*radius,40,this.worldHeight-40);
      if((!positionAllowed||positionAllowed({x,y}))&&this.isLootPositionValid(x,y,kind,'',expectedBuildingId,expectedRoomIndex))return{x,y};
    }
    const expectedRoom=expectedRoomIndex?this.map.rooms.find((room)=>room.index===expectedRoomIndex&&(!expectedBuildingId||room.buildingId===expectedBuildingId)):undefined;
    if(dock8&&expectedRoom){
      const inset=36;
      for(let i=0;i<36;i++){
        const x=expectedRoom.rect.x+inset+this.lootRandom()*Math.max(1,expectedRoom.rect.w-inset*2);
        const y=expectedRoom.rect.y+inset+this.lootRandom()*Math.max(1,expectedRoom.rect.h-inset*2);
        if((!positionAllowed||positionAllowed({x,y}))&&this.isLootPositionValid(x,y,kind,'',expectedBuildingId,expectedRoomIndex))return{x,y};
      }
    }
    const region=this.map.regions.find((r)=>baseX>=r.x&&baseX<=r.x+r.w&&baseY>=r.y&&baseY<=r.y+r.h);
    if(region){
      for(let i=0;i<(dock8?36:18);i++){
        const x=region.x+55+this.lootRandom()*Math.max(1,region.w-110);
        const y=region.y+55+this.lootRandom()*Math.max(1,region.h-110);
        if((!positionAllowed||positionAllowed({x,y}))&&this.isLootPositionValid(x,y,kind,'',expectedBuildingId,expectedRoomIndex))return{x,y};
      }
    }
    return undefined;
  }

  private clearCountermeasureState(){
    this.state.adhesiveJets.clear();
    this.state.stripTraps.clear();
    for(const [id,object] of this.state.thrownObjects)if(object.kind==='spiderMine')this.state.thrownObjects.delete(id);
    this.adhesiveExposure.clear();
    this.adhesivePuddleAt.clear();
    this.vehicleStatus.clear();
    for(const vehicle of this.state.motorcycles.values()){
      vehicle.slowKind='';vehicle.slowSpeedMultiplier=1;vehicle.slowAccelerationMultiplier=1;vehicle.slowSteeringMultiplier=1;vehicle.slowUntil=0;vehicle.empDisabledUntil=0;vehicle.mountLockedUntil=0;
    }
    for(const tactical of this.state.tacticalInventories.values()){tactical.empDisabledUntil=0;tactical.empPulseReadyAt=0;}
  }

  private clearTransient(){
    this.state.bullets.clear();
    this.state.rockets.clear();
    this.state.loot.clear();
    this.inputs.clear();
    this.shotAt.clear();
    this.laserChargeCuePlayed.clear();
    this.reloadUntil.clear();
    this.healUntil.clear();
    this.aiIntent.clear();
    this.aiSwitchAt.clear();
    this.aiLandedAt.clear();
    this.aiDefendUntil.clear();
    this.aiProfiles.clear();
    this.aiMemories.clear();
    this.aiLineCooldown.clear();
    this.aiGlobalDialogueAt=-99;
    this.aiDialogueResponses=[];
    this.aiDialogueSequence=0;
    this.aiMovementSamples.clear();
    this.aiLocomotionBrains.clear();
    this.aiMovementNoiseAt=0;
    this.aiCombatBrains.clear();
    this.aiVehiclePlans.clear();
    this.aiVehicleMemories.clear();
    this.aiWorldObjectives.clear();
    this.aiObjectiveCooldown.clear();
    this.aiTacticalAt.clear();
    this.aiTacticalBrains.clear();
    this.aiResourceBrains.clear();
    this.aiExperienceBrains.clear();
    this.aiArenaDirector=createAiArenaDirectorMemory(this.now(),this.worldWidth/2,this.worldHeight/2);
    this.aiRobotDecision.clear();
    this.lootReservations.clear();
    this.bushRevealUntil.clear();
    this.lastSafePositions.clear();
    this.stuckStates.clear();
    this.bulletRemoveQueue.clear();
    this.state.motorcycles.clear();
    this.state.explosions.clear();
    this.state.thrownObjects.clear();
    this.state.smokeFields.clear();
    this.state.fireFields.clear();
    this.state.flameJets.clear();
    this.clearCountermeasureState();
    this.state.supplyDrops.clear();
    this.state.supplySpawned=false;
    this.state.supplyDropId='';
    this.flameDamageAt.clear();
    this.throwPrepareAt.clear();
    this.exoBombAt.clear();
    this.exoLaserAt.clear();
    this.empExoGunAt.clear();
    this.tankCannonAt.clear();
    this.tankEmptyNoticeAt.clear();
    this.nextFireTickAt=0;
    this.tankKeyRespawnAt=0;
    this.vehicleCollisionAt.clear();
    this.vehicleStuckStates.clear();
    this.vehicleMotionStates.clear();
    this.vaultJobs.clear();
    this.vaultCooldownUntil.clear();
    this.vehicleWallDamageAt.clear();
    this.vehicleShotDamage.clear();
    this.vehicleAttackerAt.clear();
    this.knockback.clear();
    this.noises=[];
    this.werewolfMoveVectors.clear();
    this.adhesivePlayerExposure.clear();
    this.openArenaNextRitualWarningAt=0;
    this.openArenaRitualActiveEndsAt=0;
    this.openArenaLastRitualPoint=null;
    this.werewolfAuraDamageAt.clear();
    this.werewolfAuraVehicleContact.clear();
    const season=this.state.werewolfSeason;season.enabled=false;season.altarPhase='disabled';season.curseOwnerId='';season.werewolfPlayerId='';season.curseDropActive=false;season.armoryActive=false;season.armoryOpened=false;season.disabledForEndgame=false;
    for(const p of this.state.players.values()){this.resetWerewolfPlayer(p);this.resetChickenPlayer(p);}
    this.tickSamples=[];
    this.perfLastPublish=0;
  }

  private input(c:Client,m:any){
    const p=this.state.players.get(c.sessionId);
    if(!p||p.ai||!p.alive)return;
    if(!isFiniteNumber(m?.x)||!isFiniteNumber(m?.y))return;
    const aim=normalizeAimVector(Number(m?.aimX),Number(m?.aimY));
    if(!aim)return;
    const input:Input={
      x:p.isVaulting?0:clamp(m.x,-1,1),y:p.isVaulting?0:clamp(m.y,-1,1),aimX:aim.x,aimY:aim.y,angle:Math.atan2(aim.y,aim.x),seq:Number(m.seq)||0,
      aiming:!p.isVaulting&&Boolean(m?.aiming),huntSprint:!p.isVaulting&&Boolean(m?.huntSprint),accelerate:false,brake:false,turnLeft:false,turnRight:false,
    };
    this.inputs.set(p.id,input);
    p.angle=input.angle;
    const motorcycle=p.vehicleId?this.state.motorcycles.get(p.vehicleId):undefined;
    if((motorcycle?.vehicleKind==='tank'||motorcycle?.vehicleKind==='fusion_robot')&&this.now()>=motorcycle.empDisabledUntil)motorcycle.turretAngle=input.angle;
    const speedRatio=motorcycle?Math.hypot(motorcycle.velocityX,motorcycle.velocityY)/MOTORCYCLE_MAX_SPEED:0;
    const scopeAllowed=p.phase==='landed'&&!this.chickenState(p).chickenTransformed&&!p.werewolf.transformed&&!p.werewolf.transformPreparing&&!p.werewolf.ritualizing&&!p.isSwimming&&p.equipped==='sniper'&&!p.reloading&&!p.healingKind&&motorcycle?.vehicleKind!=='fusion_robot'&&(!p.isDriving||(Math.hypot(input.x,input.y)<.05&&speedRatio<=MOTORCYCLE_SCOPE_SPEED_RATIO));
    p.isSniperScoped=scopeAllowed&&input.aiming;
  }

  private jump(c:Client){const p=this.state.players.get(c.sessionId);if(p?.phase==='plane')this.doJump(p);}

  private vaultWindow(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(!p||p.ai||!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing)return;
    const candidate=findPortalVaultCandidate(p.x,p.y,p.buildingId,p.roomIndex,this.map.portals,WINDOW_INTERACTION_DISTANCE);
    if(candidate)this.beginWindowVault(p,candidate,c);
  }

  private beginWindowVault(p:PlayerState,candidate:NonNullable<ReturnType<typeof findPortalVaultCandidate>>,client?:Client){
    if(!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil)return false;
    const now=this.now();
    if(now<(this.vaultCooldownUntil.get(p.id)??0))return false;
    if(distance(p.x,p.y,candidate.start.x,candidate.start.y)>WINDOW_INTERACTION_DISTANCE+8)return false;
    const destination=this.resolveVaultDestination(candidate,p.id);
    if(!destination){
      client?.send('notice',{type:'warning',message:'창문 반대편이 막혀 있습니다.'});
      return false;
    }
    this.cancelHeal(p);
    this.cancelReload(p);
    this.cancelThrow(p);
    this.knockback.delete(p.id);
    p.isSniperScoped=false;
    const duration=WINDOW_VAULT_DURATION_MS/1000;
    this.vaultJobs.set(p.id,{startX:p.x,startY:p.y,targetX:destination.x,targetY:destination.y,startedAt:now,duration,windowId:candidate.portal.id,targetBuildingId:destination.buildingId,targetRoomIndex:destination.roomIndex,startBuildingId:p.buildingId,startRoomIndex:p.roomIndex,transitioned:false});
    this.vaultCooldownUntil.set(p.id,now+duration+WINDOW_VAULT_COOLDOWN_MS/1000);
    p.isVaulting=true;
    p.vaultProgress=0;
    p.vaultWindowId=candidate.portal.id;
    this.inputs.set(p.id,{x:0,y:0,aimX:Math.cos(p.angle),aimY:Math.sin(p.angle),angle:p.angle,seq:0,aiming:false,huntSprint:false,accelerate:false,brake:false,turnLeft:false,turnRight:false});
    return true;
  }

  private aiWindowVaultCandidate(p:PlayerState,windowId:string):NonNullable<ReturnType<typeof findPortalVaultCandidate>>|undefined{
    const portal=this.map.portals.find((candidate)=>candidate.id===windowId&&candidate.kind==='window'&&candidate.vaultable);
    if(!portal)return undefined;
    return findPortalVaultCandidate(p.x,p.y,p.buildingId,p.roomIndex,[portal],Number.POSITIVE_INFINITY);
  }

  private vaultLandingFree(x:number,y:number,playerId:string){
    if(!this.isPositionFree(x,y,PLAYER_BODY_RADIUS+2))return false;
    for(const motorcycle of this.state.motorcycles.values())if(distance(x,y,motorcycle.x,motorcycle.y)<PLAYER_BODY_RADIUS+this.vehicleRadius(motorcycle)+6)return false;
    for(const player of this.state.players.values())if(player.id!==playerId&&player.alive&&player.phase==='landed'&&distance(x,y,player.x,player.y)<PLAYER_SEPARATION_RADIUS*1.75)return false;
    return true;
  }

  private resolveVaultDestination(candidate:NonNullable<ReturnType<typeof findPortalVaultCandidate>>,playerId:string){
    const dx=candidate.target.x-candidate.start.x,dy=candidate.target.y-candidate.start.y,length=Math.hypot(dx,dy)||1;
    const nx=dx/length,ny=dy/length,tx=-ny,ty=nx;
    const valid=(x:number,y:number)=>{
      if(!this.vaultLandingFree(x,y,playerId)||this.terrainKindAt(x,y)==='deep-water')return undefined;
      const space=spaceAt(x,y,this.map.buildingVisibilityZones,this.map.rooms,0);
      if(space.buildingId!==candidate.targetBuildingId||space.roomIndex!==candidate.targetRoomIndex)return undefined;
      return{x,y,buildingId:space.buildingId,roomIndex:space.roomIndex};
    };
    const forwardOffsets=[0,12,24,38,54,72,96,124];
    const lateralOffsets=[0,-14,14,-28,28,-42,42,-60,60,-80,80];
    for(const forward of forwardOffsets)for(const lateral of lateralOffsets){
      const result=valid(candidate.target.x+nx*forward+tx*lateral,candidate.target.y+ny*forward+ty*lateral);
      if(result)return result;
    }
    const baseAngle=Math.atan2(ny,nx);
    for(let radius=12;radius<=168;radius+=12)for(let step=0;step<24;step++){
      const angle=baseAngle+step*(Math.PI*2/24);
      const result=valid(candidate.target.x+Math.cos(angle)*radius,candidate.target.y+Math.sin(angle)*radius);
      if(result)return result;
    }
    return undefined;
  }

  private clearVault(p:PlayerState){
    this.vaultJobs.delete(p.id);
    p.isVaulting=false;
    p.vaultProgress=0;
    p.vaultWindowId='';
  }

  private updateVaults(){
    const now=this.now();
    for(const [playerId,job] of [...this.vaultJobs]){
      const p=this.state.players.get(playerId);
      if(!p?.alive||p.phase!=='landed'||p.isDriving){if(p)this.clearVault(p);else this.vaultJobs.delete(playerId);continue;}
      const progress=clamp((now-job.startedAt)/job.duration,0,1);
      p.isVaulting=true;
      p.vaultProgress=progress;
      p.x=job.startX+(job.targetX-job.startX)*progress;
      p.y=job.startY+(job.targetY-job.startY)*progress;
      if(progress>=.5&&!job.transitioned){
        job.transitioned=true;
        if(p.buildingId!==job.targetBuildingId||p.roomIndex!==job.targetRoomIndex){p.buildingId=job.targetBuildingId;p.roomIndex=job.targetRoomIndex;p.insideBuilding=Boolean(job.targetBuildingId);p.buildingTransitionSeq++;}
      }
      if(progress<1)continue;
      if(this.vaultLandingFree(job.targetX,job.targetY,p.id)){p.x=job.targetX;p.y=job.targetY;}
      else if(this.vaultLandingFree(job.startX,job.startY,p.id)){p.x=job.startX;p.y=job.startY;p.buildingId=job.startBuildingId;p.roomIndex=job.startRoomIndex;p.insideBuilding=Boolean(p.buildingId);p.buildingTransitionSeq++;}
      else{
        const safe=this.findNearestFreePoint(job.targetX,job.targetY,180)??this.findNearestFreePoint(job.startX,job.startY,180);
        if(safe){p.x=safe.x;p.y=safe.y;const space=spaceAt(safe.x,safe.y,this.map.buildingVisibilityZones,this.map.rooms,0);p.buildingId=space.buildingId;p.roomIndex=space.roomIndex;p.insideBuilding=Boolean(p.buildingId);p.buildingTransitionSeq++;}
      }
      this.lastSafePositions.set(p.id,{x:p.x,y:p.y,mapId:this.map.id,buildingId:p.buildingId,roomIndex:p.roomIndex,recordedAt:now});
      this.clearVault(p);this.cancelThrow(p);
    }
  }

  private doJump(p:PlayerState){
    p.phase='falling';
    p.aiState=p.ai?'FALLING':'';
    p.x=this.state.planeX;
    p.y=this.state.planeY;
    p.altitude=FALL_START_ALTITUDE;
    if(this.state.phase==='PLANE')this.state.phase='DROP';
  }

  private resetWerewolfPlayer(p:PlayerState){
    const w=p.werewolf;w.hasCurse=false;w.curseExpiresAt=0;w.ritualizing=false;w.ritualStartedAt=0;w.ritualCompletesAt=0;w.ritualOriginX=0;w.ritualOriginY=0;w.transformPreparing=false;w.transformReadyAt=0;w.transformed=false;w.transformEndsAt=0;w.sprintGauge=1;w.sprinting=false;w.sprintRechargeAt=0;w.silverSlowUntil=0;w.adhesiveSlowStage=0;w.adhesiveSlowUntil=0;w.adhesiveRecoveryUntil=0;w.actionLockedUntil=0;w.attackRecoveryUntil=0;w.huntDismountImmuneUntil=0;
    this.werewolfMoveVectors.delete(p.id);
  }

  private resetChickenPlayer(p:PlayerState){const chicken=this.chickenState(p);chicken.chickenTransformed=false;chicken.chickenUntil=0;chicken.chickenImmuneUntil=0;chicken.chickenSourceId='';}
  private resetChickenInventory(tactical:TacticalInventoryState){tactical.chickenBlasterMagazine=0;tactical.chickenCapsuleAmmo=0;}

  private initializeWerewolfSeason(firstDelaySeconds=WEREWOLF_BALANCE.altarWakeSeconds){
    const season=this.state.werewolfSeason;
    season.enabled=false;season.altarPhase='disabled';season.altarX=0;season.altarY=0;season.altarActivatesAt=0;season.altarReactivateAt=0;season.armoryX=0;season.armoryY=0;season.armoryActive=false;season.armoryOpened=false;season.armoryOpenedBy='';season.curseOwnerId='';season.werewolfPlayerId='';season.curseDropActive=false;season.curseDropX=0;season.curseDropY=0;season.curseDropRemaining=0;season.cycle=0;season.initialNoticeSent=false;season.disabledForEndgame=false;
    const selected=chooseWerewolfSeasonPoints(this.map.id,this.lootRandom,(point)=>{
      const space=spaceAt(point.x,point.y,this.map.buildingVisibilityZones,this.map.rooms,0);
      return seasonPointStructurallyValid(this.map,point,this.terrainKindAt(point.x,point.y),space.outdoors);
    });
    if(!selected){console.error('[DROP8 Refactor 018] no valid werewolf season points',this.map.id);return;}
    season.enabled=true;season.altarPhase='dormant';season.altarX=selected.altar.x;season.altarY=selected.altar.y;season.altarActivatesAt=this.now()+firstDelaySeconds;season.armoryX=selected.armory.x;season.armoryY=selected.armory.y;
  }

  private openArenaRitualPositionClear(point:Point){
    if(this.openArenaLastRitualPoint&&distance(point.x,point.y,this.openArenaLastRitualPoint.x,this.openArenaLastRitualPoint.y)<OPEN_ARENA_RITUAL_SUPPLY_CLEARANCE)return false;
    for(const drop of this.state.supplyDrops.values())if(!drop.opened&&distance(point.x,point.y,drop.x,drop.y)<OPEN_ARENA_RITUAL_SUPPLY_CLEARANCE)return false;
    return true;
  }

  private arenaSupplyFirstDelay(){return this.gameMode==='domination'?DOMINATION_CONFIG.supplyFirstDelaySeconds:OPEN_ARENA_SUPPLY_DROP_FIRST_DELAY_SECONDS;}
  private arenaSupplyInterval(){return this.gameMode==='domination'?DOMINATION_CONFIG.supplyIntervalSeconds:OPEN_ARENA_SUPPLY_DROP_INTERVAL_SECONDS;}
  private arenaSupplyRetry(){return this.gameMode==='domination'?DOMINATION_CONFIG.supplyRetrySeconds:OPEN_ARENA_SUPPLY_DROP_RETRY_SECONDS;}
  private arenaMaxActiveSupplyDrops(){return this.gameMode==='domination'?DOMINATION_CONFIG.maxActiveSupplyDrops:OPEN_ARENA_MAX_ACTIVE_SUPPLY_DROPS;}
  private arenaRitualFirstDelay(){return this.gameMode==='domination'?DOMINATION_CONFIG.ritualFirstDelaySeconds:OPEN_ARENA_RITUAL_FIRST_DELAY_SECONDS;}
  private arenaRitualWarningSeconds(){return this.gameMode==='domination'?DOMINATION_CONFIG.ritualWarningSeconds:OPEN_ARENA_RITUAL_WARNING_SECONDS;}
  private arenaRitualActiveSeconds(){return this.gameMode==='domination'?DOMINATION_CONFIG.ritualActiveSeconds:OPEN_ARENA_RITUAL_ACTIVE_SECONDS;}
  private arenaRitualCooldownSeconds(){return this.gameMode==='domination'?DOMINATION_CONFIG.ritualCooldownSeconds:OPEN_ARENA_RITUAL_COOLDOWN_SECONDS;}
  private arenaRitualCompletionSeconds(){return this.gameMode==='domination'?DOMINATION_CONFIG.ritualCompletionSeconds:OPEN_ARENA_RITUAL_COMPLETION_SECONDS;}

  private startOpenArenaRitualWarning(now=this.now()){
    if(!this.arenaLike()||this.state.phase!=='ACTIVE'||this.openArenaRoundState!=='active')return false;
    const selected=chooseWerewolfSeasonPoints(this.map.id,this.lootRandom,(point)=>{
      const space=spaceAt(point.x,point.y,this.map.buildingVisibilityZones,this.map.rooms,0);
      return seasonPointStructurallyValid(this.map,point,this.terrainKindAt(point.x,point.y),space.outdoors)&&this.openArenaRitualPositionClear(point);
    });
    if(!selected){this.openArenaNextRitualWarningAt=now+this.arenaRitualWarningSeconds();return false;}
    const season=this.state.werewolfSeason;
    for(const p of this.state.players.values())this.cancelWerewolfRitual(p);
    season.enabled=true;season.altarPhase='dormant';season.altarX=selected.altar.x;season.altarY=selected.altar.y;season.altarActivatesAt=now+this.arenaRitualWarningSeconds();season.altarReactivateAt=0;season.armoryX=selected.armory.x;season.armoryY=selected.armory.y;season.armoryActive=false;season.armoryOpened=false;season.armoryOpenedBy='';season.curseOwnerId='';season.werewolfPlayerId='';season.curseDropActive=false;season.curseDropX=0;season.curseDropY=0;season.curseDropRemaining=0;season.cycle++;season.initialNoticeSent=true;season.disabledForEndgame=false;
    this.openArenaLastRitualPoint={x:selected.altar.x,y:selected.altar.y};this.openArenaRitualActiveEndsAt=0;this.openArenaNextRitualWarningAt=0;
    this.system('늑대인간 의식 장소가 드러났습니다. 곧 제단이 깨어납니다.');
    return true;
  }

  private endOpenArenaRitualAttempt(message:string){
    const season=this.state.werewolfSeason;
    for(const p of this.state.players.values())this.cancelWerewolfRitual(p);
    season.altarPhase='recharging';season.altarReactivateAt=this.now()+this.arenaRitualCooldownSeconds();season.armoryActive=false;season.armoryOpened=true;season.curseDropActive=false;this.openArenaRitualActiveEndsAt=0;
    if(message)this.system(message);
  }

  private disableWerewolfSeason(){
    const season=this.state.werewolfSeason;season.disabledForEndgame=true;season.altarPhase='disabled';season.armoryActive=false;season.curseDropActive=false;
    for(const p of this.state.players.values()){p.werewolf.ritualizing=false;p.werewolf.ritualStartedAt=0;p.werewolf.ritualCompletesAt=0;}
  }

  private werewolfRitualStart(c:Client){
    if(this.openArenaRoundLocked())return;
    const p=this.state.players.get(c.sessionId);if(!p||!p.alive||p.phase!=='landed'||p.ai)return;
    const season=this.state.werewolfSeason;
    if(season.enabled&&season.altarPhase==='active'&&!season.curseOwnerId&&!season.werewolfPlayerId&&distance(p.x,p.y,season.altarX,season.altarY)<=WEREWOLF_BALANCE.ritualRadius){
      if(p.isDriving||p.isSwimming||p.isVaulting||p.werewolf.transformed||p.werewolf.transformPreparing){c.send('notice',{type:'warning',message:'차량·수영·변신 상태에서는 의식을 시작할 수 없습니다.'});return;}
      this.cancelHeal(p);this.cancelReload(p);this.cancelThrow(p);p.isSniperScoped=false;
      const now=this.now(),w=p.werewolf,ritualSeconds=this.arenaLike()?this.arenaRitualCompletionSeconds():WEREWOLF_BALANCE.ritualSeconds;w.ritualizing=true;w.ritualStartedAt=now;w.ritualCompletesAt=now+ritualSeconds;w.ritualOriginX=p.x;w.ritualOriginY=p.y;
      c.send('notice',{type:'warning',message:`제단 의식 중... ${ritualSeconds.toFixed(0)}초 동안 움직이지 마세요.`});return;
    }
    this.interact(c);
  }

  private werewolfRitualCancel(c:Client){const p=this.state.players.get(c.sessionId);if(p)this.cancelWerewolfRitual(p);}
  private cancelWerewolfRitual(p:PlayerState){const w=p.werewolf;w.ritualizing=false;w.ritualStartedAt=0;w.ritualCompletesAt=0;}

  private werewolfTransform(c:Client){
    const p=this.state.players.get(c.sessionId);if(!p||!p.alive||!p.werewolf.hasCurse||p.werewolf.transformed||p.werewolf.transformPreparing)return;
    if(p.isDriving){c.send('notice',{type:'warning',message:'먼저 오토바이에서 내려야 변신할 수 있습니다.'});return;}
    this.beginWerewolfTransform(p);
  }

  private beginWerewolfTransform(p:PlayerState){
    if(!p.alive||!p.werewolf.hasCurse||p.werewolf.transformed||p.werewolf.transformPreparing)return false;
    this.cancelWerewolfRitual(p);this.cancelHeal(p);this.cancelReload(p);this.cancelThrow(p);p.isSniperScoped=false;
    const now=this.now();p.werewolf.transformPreparing=true;p.werewolf.transformReadyAt=now+WEREWOLF_BALANCE.transformPrepareSeconds;p.werewolf.actionLockedUntil=p.werewolf.transformReadyAt;return true;
  }

  private completeWerewolfTransform(p:PlayerState){
    if(!p.alive||!p.werewolf.hasCurse)return;
    const season=this.state.werewolfSeason;if(season.werewolfPlayerId&&season.werewolfPlayerId!==p.id)return;
    this.returnSilverCountermeasuresForWerewolf(p);
    const now=this.now(),w=p.werewolf;w.hasCurse=false;w.curseExpiresAt=0;w.transformPreparing=false;w.transformReadyAt=0;w.transformed=true;w.transformEndsAt=now+WEREWOLF_BALANCE.transformDurationSeconds;w.sprintGauge=1;w.sprinting=false;w.sprintRechargeAt=now;w.silverSlowUntil=0;season.curseOwnerId='';season.werewolfPlayerId=p.id;season.altarPhase='claimed';if(this.gameMode==='openArena')this.openArenaRitualActiveEndsAt=0;
    this.system('늑대인간이 나타났습니다!');this.emitAudioEvent('werewolf_transform',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'werewolf'});
  }

  private returnSilverCountermeasuresForWerewolf(p:PlayerState){
    const tactical=this.tacticalInventory(p.id),amount=tactical.silverCrossbowMagazine+tactical.silverBoltAmmo;
    let crossbows=0;
    if(p.primary==='silver_crossbow'){const loot=this.spawnWerewolfLoot('silver_crossbow',p.x-28,p.y);if(loot){loot.weaponMagazine=0;loot.grantsAmmo=false;}p.primary='';crossbows++;}
    if(p.secondary==='silver_crossbow'){const loot=this.spawnWerewolfLoot('silver_crossbow',p.x+28,p.y);if(loot){loot.weaponMagazine=0;loot.grantsAmmo=false;}p.secondary='';crossbows++;}
    tactical.silverCrossbowMagazine=0;tactical.silverBoltAmmo=0;
    if(amount>0)this.spawnWerewolfLoot('silver_bolt',p.x,p.y+28,amount);
    if(p.equipped==='silver_crossbow'){p.equipped=p.primary||p.secondary||p.melee||'fists';p.previousEquipped=p.equipped;this.syncMagazine(p);}
    if(amount>0||crossbows>0)this.playerClient(p.id)?.send('notice',{type:'warning',message:`늑대인간 변신 · 은화살 쇠뇌 ${crossbows}개와 은화살 ${amount}발을 반납했습니다.`});
    return{crossbows,bolts:amount};
  }

  private grantWerewolfCurse(p:PlayerState,seconds:number=WEREWOLF_BALANCE.curseUseSeconds){
    const season=this.state.werewolfSeason;if(!p.alive||p.werewolf.hasCurse||p.werewolf.transformed||season.curseOwnerId||season.werewolfPlayerId)return false;
    const now=this.now();p.werewolf.hasCurse=true;p.werewolf.curseExpiresAt=now+Math.max(1,seconds);season.curseOwnerId=p.id;season.altarPhase='claimed';season.curseDropActive=false;if(this.gameMode==='openArena')this.openArenaRitualActiveEndsAt=0;this.cancelWerewolfRitual(p);this.system('누군가 제단의 저주를 손에 넣었습니다.');this.playerClient(p.id)?.send('notice',{type:'success',message:'늑대의 저주를 얻었습니다. F키로 변신하거나 제한시간이 끝나면 강제 변신합니다.'});return true;
  }

  private dropWerewolfCurse(p:PlayerState,remaining:number){
    const season=this.state.werewolfSeason;const safe=this.findNearestFreePoint(p.x,p.y,140)??{x:p.x,y:p.y};season.curseOwnerId='';season.curseDropActive=true;season.curseDropX=safe.x;season.curseDropY=safe.y;season.curseDropRemaining=Math.max(WEREWOLF_BALANCE.curseMinimumTransferSeconds,remaining);p.werewolf.hasCurse=false;p.werewolf.curseExpiresAt=0;p.werewolf.transformPreparing=false;p.werewolf.transformReadyAt=0;
  }

  private handleCurseHolderDeath(p:PlayerState,attacker?:PlayerState){
    if(!p.werewolf.hasCurse)return;const remaining=Math.max(0,p.werewolf.curseExpiresAt-this.now());
    p.werewolf.hasCurse=false;p.werewolf.curseExpiresAt=0;p.werewolf.transformPreparing=false;p.werewolf.transformReadyAt=0;this.state.werewolfSeason.curseOwnerId='';
    if(attacker&&attacker.alive&&attacker.id!==p.id&&!attacker.werewolf.hasCurse&&!attacker.werewolf.transformed){this.grantWerewolfCurse(attacker,Math.max(WEREWOLF_BALANCE.curseMinimumTransferSeconds,remaining));return;}
    this.dropWerewolfCurse(p,remaining);
  }

  private endWerewolfCycle(p:PlayerState,reason:WerewolfEndReason){
    if(!p.werewolf.transformed)return;const season=this.state.werewolfSeason;p.werewolf.transformed=false;p.werewolf.transformEndsAt=0;p.werewolf.sprinting=false;p.werewolf.sprintGauge=1;p.werewolf.silverSlowUntil=0;p.werewolf.attackRecoveryUntil=0;this.werewolfMoveVectors.delete(p.id);if(season.werewolfPlayerId===p.id)season.werewolfPlayerId='';
    for(const vehicle of this.state.motorcycles.values()){if(vehicle.huntMarkedBy===p.id){vehicle.huntMarkedBy='';vehicle.huntMarkUntil=0;}this.vehicleStatus.deleteSource(`werewolf:${p.id}`);this.syncVehicleSlowState(vehicle,this.now());}
    if(reason==='round_end'){season.altarPhase='disabled';return;}
    this.system(reason==='death'?'늑대인간이 쓰러졌습니다.':'늑대의 밤이 끝났습니다.');this.system('제단이 새로운 주인을 기다립니다.');
    if(this.state.zoneState==='FINAL'||this.state.zoneStage>=6||this.state.phase==='FINISHED'){this.disableWerewolfSeason();return;}
    season.altarPhase='recharging';season.altarReactivateAt=this.now()+(this.arenaLike()?this.arenaRitualCooldownSeconds():WEREWOLF_BALANCE.rechargeSeconds);if(this.arenaLike()){season.armoryActive=false;season.armoryOpened=true;this.openArenaRitualActiveEndsAt=0;}
  }

  private openSilverArmory(p:PlayerState,c?:Client){
    const season=this.state.werewolfSeason;if(!season.armoryActive||season.armoryOpened||distance(p.x,p.y,season.armoryX,season.armoryY)>92)return false;
    season.armoryOpened=true;season.armoryOpenedBy=p.id;this.spawnWerewolfLoot('silver_crossbow',season.armoryX-24,season.armoryY);this.spawnWerewolfLoot('silver_bolt',season.armoryX+24,season.armoryY,WEREWOLF_BALANCE.initialSilverBolts);c?.send('notice',{type:'success',message:'은빛 무기함을 열었습니다.'});return true;
  }

  private spawnWerewolfLoot(kind:LootKind,x:number,y:number,amount:number=1){
    const pos=this.findNearestFreePoint(x,y,120)??{x,y};const loot=new LootState();loot.id=`loot-${++this.lootSeq}`;loot.kind=kind;loot.x=pos.x;loot.y=pos.y;const sp=spaceAt(pos.x,pos.y,this.map.buildingVisibilityZones,this.map.rooms,0);loot.buildingId=sp.buildingId;loot.roomIndex=sp.roomIndex;if(kind==='silver_bolt')loot.ammoCount=amount;this.state.loot.set(loot.id,loot);
    return loot;
  }

  private countSilverCrossbows(){let count=0;for(const p of this.state.players.values())if(p.primary==='silver_crossbow'||p.secondary==='silver_crossbow')count++;for(const l of this.state.loot.values())if(l.kind==='silver_crossbow')count++;return count;}
  private countSilverBolts(){let count=0;for(const p of this.state.players.values()){const t=this.tacticalInventory(p.id);count+=t.silverBoltAmmo+t.silverCrossbowMagazine;}for(const l of this.state.loot.values())if(l.kind==='silver_bolt')count+=Math.max(1,l.ammoCount);return count;}
  private ensureSilverCountermeasures(initial=false){const season=this.state.werewolfSeason;if(!season.enabled||season.disabledForEndgame)return;if(initial){season.armoryActive=true;season.armoryOpened=false;return;}if(this.countSilverCrossbows()===0)this.spawnWerewolfLoot('silver_crossbow',season.armoryX-24,season.armoryY);if(this.countSilverBolts()<2)this.spawnWerewolfLoot('silver_bolt',season.armoryX+24,season.armoryY,WEREWOLF_BALANCE.rechargeSilverBolts);}

  private updateWerewolfSeason(dt:number){
    const season=this.state.werewolfSeason;const now=this.now();
    if(!season.enabled){if(this.arenaLike()&&this.state.phase==='ACTIVE'&&this.openArenaRoundState==='active'&&this.openArenaNextRitualWarningAt>0&&now>=this.openArenaNextRitualWarningAt)this.startOpenArenaRitualWarning(now);return;}
    if(this.state.zoneState==='FINAL'||this.state.zoneStage>=6){season.disabledForEndgame=true;if(!season.werewolfPlayerId&&!season.curseOwnerId)this.disableWerewolfSeason();}
    if(season.altarPhase==='dormant'&&now>=season.altarActivatesAt){season.altarPhase='active';season.armoryActive=true;season.initialNoticeSent=true;if(this.arenaLike())this.openArenaRitualActiveEndsAt=now+this.arenaRitualActiveSeconds();this.system('늑대인간의 제단이 깨어났습니다.');this.system('누군가가 늑대인간이 될지 모릅니다.');this.system('은빛 사냥 무기가 나타났습니다.');this.emitAudioEvent('werewolf_altar_wake',{x:season.altarX,y:season.altarY,buildingId:'',variant:'werewolf'});this.ensureSilverCountermeasures(true);}
    if(season.altarPhase==='recharging'&&now>=season.altarReactivateAt&&!season.disabledForEndgame){if(this.arenaLike())this.startOpenArenaRitualWarning(now);else{season.altarPhase='active';season.cycle++;this.system('늑대인간의 제단이 다시 깨어났습니다.');this.ensureSilverCountermeasures(false);}}
    if(this.arenaLike()&&season.altarPhase==='active'&&!season.curseOwnerId&&!season.werewolfPlayerId&&this.openArenaRitualActiveEndsAt>0&&now>=this.openArenaRitualActiveEndsAt)this.endOpenArenaRitualAttempt('늑대인간 의식이 실패했습니다. 제단이 다시 잠잠해집니다.');
    for(const p of this.state.players.values()){
      const w=p.werewolf;
      if(w.ritualizing){const invalid=!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting||season.altarPhase!=='active'||distance(p.x,p.y,w.ritualOriginX,w.ritualOriginY)>WEREWOLF_BALANCE.ritualMoveTolerance||distance(p.x,p.y,season.altarX,season.altarY)>WEREWOLF_BALANCE.ritualRadius;if(invalid)this.cancelWerewolfRitual(p);else if(now>=w.ritualCompletesAt){if(!season.curseOwnerId&&!season.werewolfPlayerId)this.grantWerewolfCurse(p);else this.cancelWerewolfRitual(p);}}
      if(w.hasCurse&&now>=w.curseExpiresAt&&!w.transformPreparing){if(p.isDriving){const motorcycle=this.state.motorcycles.get(p.vehicleId);if(motorcycle)this.forceDismountMotorcycle(p,motorcycle);}this.beginWerewolfTransform(p);}
      if(w.transformPreparing&&now>=w.transformReadyAt)this.completeWerewolfTransform(p);
      if(w.transformed){
        if(!p.alive){this.endWerewolfCycle(p,'death');continue;}
        if(now>=w.transformEndsAt){this.endWerewolfCycle(p,'expired');continue;}
        const input=this.inputs.get(p.id);const canSprint=Boolean(input?.huntSprint)&&now>=w.silverSlowUntil&&now>=w.adhesiveSlowUntil&&now>=w.actionLockedUntil&&now>=w.attackRecoveryUntil&&w.sprintGauge>0;
        if(canSprint){w.sprinting=true;w.sprintGauge=Math.max(0,w.sprintGauge-dt/WEREWOLF_BALANCE.sprintSeconds);w.sprintRechargeAt=now+WEREWOLF_BALANCE.sprintRechargeDelaySeconds;if(w.sprintGauge<=0)w.sprinting=false;}
        else{w.sprinting=false;if(now>=w.sprintRechargeAt)w.sprintGauge=Math.min(1,w.sprintGauge+dt/WEREWOLF_BALANCE.sprintRechargeSeconds);}
      }
    }
    this.updateWerewolfAura();
    if(season.curseDropActive){for(const p of this.state.players.values())if(p.alive&&!p.ai&&!p.werewolf.hasCurse&&!p.werewolf.transformed&&distance(p.x,p.y,season.curseDropX,season.curseDropY)<=62){const remaining=season.curseDropRemaining;season.curseDropActive=false;this.grantWerewolfCurse(p,remaining);break;}}
  }


  private disruptFusionRobotByWerewolf(wolf:PlayerState,vehicle:MotorcycleState,now:number){
    if(vehicle.vehicleKind!=='fusion_robot'||vehicle.destroyed||vehicle.exploding)return false;
    const newlyDisabled=vehicle.empDisabledUntil<=now;vehicle.empDisabledUntil=Math.max(vehicle.empDisabledUntil,now+WEREWOLF_BALANCE.fusionDisableSeconds);vehicle.velocityX=0;vehicle.velocityY=0;vehicle.speed=0;vehicle.angularVelocity=0;this.applyVehicleSlow(vehicle,'werewolf_hunt',`werewolf-fusion:${wolf.id}`,WEREWOLF_HUNT_VEHICLE_PROFILE);
    const motion=this.vehicleMotionStates.get(vehicle.id);if(motion){motion.movementHeldMs=0;motion.previousInputX=0;motion.previousInputY=0;}
    const driver=vehicle.driverId?this.state.players.get(vehicle.driverId):undefined;
    if(driver&&now>=driver.werewolf.huntDismountImmuneUntil){this.forceDismountMotorcycle(driver,vehicle);driver.werewolf.actionLockedUntil=Math.max(driver.werewolf.actionLockedUntil,now+WEREWOLF_BALANCE.fusionDriverLockSeconds);driver.werewolf.huntDismountImmuneUntil=now+WEREWOLF_BALANCE.huntDismountImmunitySeconds;this.playerClient(driver.id)?.send('notice',{type:'warning',message:`늑대 파쇄 · 합체 로봇 ${WEREWOLF_BALANCE.fusionDisableSeconds.toFixed(1)}초 정지`});}
    if(newlyDisabled)this.playerClient(wolf.id)?.send('notice',{type:'success',message:'합체 로봇 파쇄 성공 · 기계 정지'});
    return true;
  }

  private updateWerewolfAura(){
    const now=this.now(),activeContacts=new Set<string>();
    for(const wolf of this.state.players.values()){
      if(!wolf.alive||wolf.phase!=='landed'||!wolf.werewolf.transformed)continue;
      for(const target of this.state.players.values()){
        if(!target.alive||target.phase!=='landed'||target.id===wolf.id||target.isDriving)continue;
        if(distance(wolf.x,wolf.y,target.x,target.y)>WEREWOLF_BALANCE.auraRadius+PLAYER_HIT_RADIUS)continue;
        if(this.firstObstacleHitT(wolf.x,wolf.y,target.x,target.y,2)!==null)continue;
        const key=`player:${wolf.id}:${target.id}`,last=this.werewolfAuraDamageAt.get(key)??-99;
        if(now-last<WEREWOLF_BALANCE.auraTickSeconds)continue;
        this.werewolfAuraDamageAt.set(key,now);
        this.damage(target,WEREWOLF_BALANCE.auraDamage,wolf.id,'늑대 열기',0,undefined,'fire');
      }
      for(const vehicle of this.state.motorcycles.values()){
        if(vehicle.destroyed||vehicle.exploding||distance(wolf.x,wolf.y,vehicle.x,vehicle.y)>WEREWOLF_BALANCE.auraRadius+this.vehicleRadius(vehicle))continue;
        if(this.firstObstacleHitT(wolf.x,wolf.y,vehicle.x,vehicle.y,2)!==null)continue;
        const fusion=vehicle.vehicleKind==='fusion_robot';
        const contactKey=`vehicle:${wolf.id}:${vehicle.id}`;activeContacts.add(contactKey);
        const contact=this.werewolfAuraVehicleContact.get(contactKey)??{startedAt:now,lastAt:now};contact.lastAt=now;this.werewolfAuraVehicleContact.set(contactKey,contact);
        const damageKey=`bike:${wolf.id}:${vehicle.id}`,last=this.werewolfAuraDamageAt.get(damageKey)??-99;
        if(now-last>=WEREWOLF_BALANCE.auraTickSeconds){this.werewolfAuraDamageAt.set(damageKey,now);this.damageMotorcycle(vehicle,fusion?WEREWOLF_BALANCE.fusionAuraVehicleDamage:WEREWOLF_BALANCE.auraVehicleDamage,wolf.id,fusion?'늑대 합체 로봇 파쇄 열기':'늑대 열기');}
        if(vehicle.driverId&&now-contact.startedAt>=WEREWOLF_BALANCE.auraDismountSeconds){
          const driver=this.state.players.get(vehicle.driverId);
          if(driver&&now>=driver.werewolf.huntDismountImmuneUntil){
            if(fusion)this.disruptFusionRobotByWerewolf(wolf,vehicle,now);
            else{this.forceDismountMotorcycle(driver,vehicle);driver.werewolf.actionLockedUntil=Math.max(driver.werewolf.actionLockedUntil,now+.35);driver.werewolf.huntDismountImmuneUntil=now+WEREWOLF_BALANCE.auraDismountImmunitySeconds;}
            this.werewolfAuraVehicleContact.delete(contactKey);
            if(AI_HUMAN_DEBUG)console.debug('[DROP8 WEREWOLF AURA] dismount',{wolf:wolf.id,driver:driver.id,vehicle:vehicle.id});
          }
        }
      }
    }
    for(const [key,contact] of this.werewolfAuraVehicleContact)if(!activeContacts.has(key)&&now-contact.lastAt>WEREWOLF_BALANCE.auraTickSeconds*1.5)this.werewolfAuraVehicleContact.delete(key);
    for(const [key,last] of this.werewolfAuraDamageAt)if(now-last>2)this.werewolfAuraDamageAt.delete(key);
  }

  private werewolfClaw(p:PlayerState){
    const now=this.now(),w=p.werewolf;if(!w.transformed||now<w.actionLockedUntil||now<w.attackRecoveryUntil)return;if(now-(this.shotAt.get(p.id)??-99)<WEREWOLF_BALANCE.clawCooldownSeconds)return;this.shotAt.set(p.id,now);w.sprinting=false;w.sprintRechargeAt=now+WEREWOLF_BALANCE.sprintRechargeDelaySeconds;p.attackSeq++;this.revealBushPlayer(p,.8);
    for(const target of this.state.players.values()){if(!target.alive||target.id===p.id||target.phase!=='landed'||(target.isDriving&&target.vehicleId))continue;const d=distance(p.x,p.y,target.x,target.y);if(d>WEREWOLF_BALANCE.clawRange+PLAYER_HIT_RADIUS)continue;if(Math.abs(this.angleDiff(Math.atan2(target.y-p.y,target.x-p.x),p.angle))>WEREWOLF_BALANCE.clawHalfAngleRadians)continue;if(!this.canSeeTarget(p,target))continue;this.damage(target,WEREWOLF_BALANCE.clawDamage,p.id,'늑대 할퀴기',0,undefined,'melee');}
    if(this.gameMode==='coreSiege')for(const minion of [...this.state.coreSiege.minions.values()]){if(minion.team===p.team||distance(p.x,p.y,minion.x,minion.y)>WEREWOLF_BALANCE.clawRange+minion.radius||Math.abs(this.angleDiff(Math.atan2(minion.y-p.y,minion.x-p.x),p.angle))>WEREWOLF_BALANCE.clawHalfAngleRadians)continue;this.damageCoreSiegeMinion(minion,WEREWOLF_BALANCE.clawDamage,p.id,'melee');}
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed||vehicle.exploding||distance(p.x,p.y,vehicle.x,vehicle.y)>WEREWOLF_BALANCE.clawRange+this.vehicleRadius(vehicle))continue;
      if(Math.abs(this.angleDiff(Math.atan2(vehicle.y-p.y,vehicle.x-p.x),p.angle))>WEREWOLF_BALANCE.clawHalfAngleRadians||this.firstObstacleHitT(p.x,p.y,vehicle.x,vehicle.y,2)!==null)continue;
      const fusion=vehicle.vehicleKind==='fusion_robot',second=vehicle.huntMarkedBy===p.id&&vehicle.huntMarkUntil>now;this.damageMotorcycle(vehicle,fusion?WEREWOLF_BALANCE.fusionClawDamage:WEREWOLF_BALANCE.huntVehicleDamage,p.id,fusion?'늑대 합체 로봇 파쇄':'늑대 할퀴기');
      if(vehicle.destroyed||vehicle.exploding){vehicle.huntMarkedBy='';vehicle.huntMarkUntil=0;continue;}
      if(second&&fusion){this.disruptFusionRobotByWerewolf(p,vehicle,now);w.attackRecoveryUntil=now+WEREWOLF_BALANCE.huntAttackRecoverySeconds;vehicle.huntMarkedBy='';vehicle.huntMarkUntil=0;continue;}
      if(second&&vehicle.driverId){const driver=this.state.players.get(vehicle.driverId);if(driver&&now>=driver.werewolf.huntDismountImmuneUntil){this.forceDismountMotorcycle(driver,vehicle);driver.werewolf.actionLockedUntil=now+WEREWOLF_BALANCE.huntDriverLockSeconds;driver.werewolf.huntDismountImmuneUntil=now+WEREWOLF_BALANCE.huntDismountImmunitySeconds;w.attackRecoveryUntil=now+WEREWOLF_BALANCE.huntAttackRecoverySeconds;vehicle.huntMarkedBy='';vehicle.huntMarkUntil=0;continue;}}
      vehicle.huntMarkedBy=p.id;vehicle.huntMarkUntil=now+WEREWOLF_BALANCE.huntMarkSeconds;this.applyVehicleSlow(vehicle,'werewolf_hunt',`werewolf:${p.id}`,WEREWOLF_HUNT_VEHICLE_PROFILE);
    }
    this.emitAudioEvent('werewolf_claw',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'werewolf'});
  }

  private fire(c:Client,m?:any){const p=this.state.players.get(c.sessionId);if(p)this.firePlayer(p,m);}

  private startLaserCannonChargeForClient(c:Client){const p=this.state.players.get(c.sessionId);if(p)this.startLaserCannonCharge(p);}
  private releaseLaserCannonChargeForClient(c:Client,m?:any){const p=this.state.players.get(c.sessionId);if(p)this.releaseLaserCannonCharge(p,m);}

  private startLaserCannonCharge(p:PlayerState){
    const tactical=this.tacticalInventory(p.id),now=this.now();
    if(this.openArenaRoundLocked()||this.mechanicalActionDisabled(p,now)||!p.alive||p.phase!=='landed'||p.equipped!=='laser_cannon'||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||now<p.werewolf.actionLockedUntil||this.reloadUntil.has(p.id)||this.getWeaponMagazine(p,'laser_cannon')<=0)return false;
    if(!tactical.laserCannonCharging){this.laserChargeCuePlayed.delete(p.id);tactical.laserCannonCharging=true;tactical.laserCannonChargeStartedAt=now;this.clearOpenArenaSpawnProtection(p.id);}
    return true;
  }

  private cancelLaserCannonCharge(p:PlayerState){this.laserChargeCuePlayed.delete(p.id);const tactical=this.tacticalInventory(p.id);tactical.laserCannonCharging=false;tactical.laserCannonChargeStartedAt=0;}

  private releaseLaserCannonCharge(p:PlayerState,m?:any){
    const tactical=this.tacticalInventory(p.id),now=this.now(),started=tactical.laserCannonChargeStartedAt;
    if(!tactical.laserCannonCharging)return false;
    this.cancelLaserCannonCharge(p);
    if(!p.alive||p.phase!=='landed'||p.equipped!=='laser_cannon'||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||this.reloadUntil.has(p.id)||this.mechanicalActionDisabled(p,now))return false;
    const held=Math.max(0,now-started);if(held<LASER_CANNON_BALANCE.chargeSeconds){this.firePlayer(p,m);return true;}
    const magazine=this.getWeaponMagazine(p,'laser_cannon');if(magazine<LASER_CANNON_BALANCE.chargedAmmoCost){this.firePlayer(p,m);return true;}if(now-(this.shotAt.get(p.id)??-99)<WEAPONS.laser_cannon.fireInterval)return false;
    const rawX=Number(m?.aimWorldX),rawY=Number(m?.aimWorldY),aimX=Number.isFinite(rawX)?rawX:p.x+Math.cos(p.angle)*LASER_CANNON_BALANCE.guideRange,aimY=Number.isFinite(rawY)?rawY:p.y+Math.sin(p.angle)*LASER_CANNON_BALANCE.guideRange,angle=Math.atan2(aimY-p.y,aimX-p.x),startX=p.x+Math.cos(angle)*(PLAYER_HIT_RADIUS+12),startY=p.y+Math.sin(angle)*(PLAYER_HIT_RADIUS+12),rangeX=startX+Math.cos(angle)*LASER_CANNON_BALANCE.guideRange,rangeY=startY+Math.sin(angle)*LASER_CANNON_BALANCE.guideRange;
    const obstacleT=this.firstObstacleHitT(startX,startY,rangeX,rangeY,3)??1,candidates:Array<{t:number;player?:PlayerState;vehicle?:MotorcycleState}>=[];
    for(const target of this.state.players.values()){
      if(!target.alive||target.id===p.id||target.phase!=='landed'||target.isDriving&&target.vehicleId||this.sameCombatTeam(p,target))continue;
      const t=segmentCircleIntersectionT(startX,startY,rangeX,rangeY,target.x,target.y,PLAYER_HIT_RADIUS+5);if(t!==null&&t<obstacleT)candidates.push({t,player:target});
    }
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed||vehicle.exploding||vehicle.driverId===p.id)continue;
      const driver=vehicle.driverId?this.state.players.get(vehicle.driverId):undefined;if(this.sameCombatTeam(p,driver))continue;
      const t=segmentCircleIntersectionT(startX,startY,rangeX,rangeY,vehicle.x,vehicle.y,this.vehicleRadius(vehicle)+4);if(t!==null&&t<obstacleT)candidates.push({t,vehicle});
    }
    const impacts=candidates.sort((a,b)=>a.t-b.t).slice(0,LASER_CANNON_BALANCE.maxPenetrationTargets).map((hit,index)=>{
      const multiplier=Math.pow(LASER_CANNON_BALANCE.penetrationDamageMultiplier,index);
      if(hit.player)this.damage(hit.player,LASER_CANNON_BALANCE.chargedPlayerDamage*multiplier,p.id,'충전 레이저포',0,angle,'bullet');
      if(hit.vehicle)this.damageMotorcycle(hit.vehicle,LASER_CANNON_BALANCE.chargedVehicleDamage*multiplier,p.id,'충전 레이저포');
      return{x:startX+(rangeX-startX)*hit.t,y:startY+(rangeY-startY)*hit.t,t:hit.t/Math.max(.001,obstacleT)};
    });
    const endX=startX+(rangeX-startX)*obstacleT,endY=startY+(rangeY-startY)*obstacleT;
    const visualDistance=Math.hypot(endX-startX,endY-startY),travelSeconds=Math.max(.16,visualDistance/LASER_CANNON_BALANCE.pulseSpeed),visualDuration=travelSeconds+LASER_CANNON_BALANCE.impactSeconds;
    this.shotAt.set(p.id,now);p.attackSeq++;this.setWeaponMagazine(p,'laser_cannon',magazine-LASER_CANNON_BALANCE.chargedAmmoCost);this.revealBushPlayer(p,3);this.addAiNoise(p.x,p.y,p.id,'gun',1350,1);this.emitAudioEvent('weapon_fire',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'laser_cannon_charged',sequence:p.attackSeq});this.broadcast('laserCannonShot',{sourceId:p.id,x1:startX,y1:startY,x2:endX,y2:endY,duration:visualDuration,travelSeconds,impacts});return true;
  }

  private mechanicalActionDisabled(p:PlayerState,now=this.now()){
    const tactical=this.tacticalInventory(p.id);if(tactical.exoActive&&now<tactical.empDisabledUntil)return true;
    const vehicle=p.isDriving&&p.vehicleId?this.state.motorcycles.get(p.vehicleId):undefined;return Boolean(vehicle&&vehicle.driverId===p.id&&now<vehicle.empDisabledUntil);
  }

  private coreSiegeBasicProfile(p:PlayerState,weaponId:WeaponId=p.equipped as WeaponId){
    if(this.gameMode!=='coreSiege')return undefined;
    const profile=CORE_SIEGE_BASIC_ATTACKS[normalizeCoreSiegeHero(this.coreSiegePlayer(p.id).heroId)];
    return profile.weaponId===weaponId?profile:undefined;
  }

  private fireCoreSiegeMedigel(p:PlayerState,_now:number){
    const progress=this.coreSiegePlayer(p.id);
    if(progress.medicalGel<2)return false;
    progress.medicalGel=Math.max(0,progress.medicalGel-2);
    const range=470,halfAngle=.32;
    const candidates=[...this.state.players.values()]
      .filter((target)=>target.id!==p.id&&target.alive&&target.phase==='landed'&&distance(p.x,p.y,target.x,target.y)<=range)
      .map((target)=>({target,distance:distance(p.x,p.y,target.x,target.y),angle:Math.abs(this.angleDiff(Math.atan2(target.y-p.y,target.x-p.x),p.angle))}))
      .filter((item)=>item.angle<=halfAngle&&this.canSeeTarget(p,item.target))
      .sort((a,b)=>(a.angle*260+a.distance)-(b.angle*260+b.distance));
    const ally=candidates.find((item)=>this.sameCombatTeam(p,item.target)&&item.target.hp<this.playerMaxHp(item.target)&&!this.tacticalInventory(item.target.id).exoActive)?.target;
    const enemy=candidates.find((item)=>!this.sameCombatTeam(p,item.target))?.target;
    const enemyMinion=[...this.state.coreSiege.minions.values()]
      .filter((minion)=>minion.team!==p.team&&distance(p.x,p.y,minion.x,minion.y)<=range)
      .map((minion)=>({minion,distance:distance(p.x,p.y,minion.x,minion.y),angle:Math.abs(this.angleDiff(Math.atan2(minion.y-p.y,minion.x-p.x),p.angle))}))
      .filter((item)=>item.angle<=halfAngle&&this.firstObstacleHitT(p.x,p.y,item.minion.x,item.minion.y,4)===null)
      .sort((a,b)=>(a.angle*260+a.distance)-(b.angle*260+b.distance))[0]?.minion;
    const enemyStructure=[...this.state.coreSiege.structures.values()]
      .filter((structure)=>!structure.destroyed&&structure.team!==p.team&&distance(p.x,p.y,structure.x,structure.y)<=range+structure.radius)
      .map((structure)=>({structure,distance:distance(p.x,p.y,structure.x,structure.y),angle:Math.abs(this.angleDiff(Math.atan2(structure.y-p.y,structure.x-p.x),p.angle))}))
      .filter((item)=>item.angle<=halfAngle&&this.firstObstacleHitT(p.x,p.y,item.structure.x,item.structure.y,4)===null)
      .sort((a,b)=>(a.angle*260+a.distance)-(b.angle*260+b.distance))[0]?.structure;
    p.attackSeq++;
    if(ally){
      const sustained=ally.hp>=this.playerMaxHp(ally)*.75?CORE_SIEGE_CONFIG.medicalGelSustainFalloff:1;
      this.healPlayer(ally,CORE_SIEGE_CONFIG.medicalGelHealPerSecond*.1*sustained);
      this.broadcast('coreSiegeEffect',{kind:'medigelHeal',ownerId:p.id,targetId:ally.id,x1:p.x,y1:p.y,x2:ally.x,y2:ally.y,duration:.16});
    }else if(enemy){
      this.applyCoreSiegeSlow(enemy,.25);
      this.damage(enemy,CORE_SIEGE_CONFIG.medicalGelDamagePerSecond*.1,p.id,'메디젤 분사',0,p.angle,'bullet');
      this.broadcast('coreSiegeEffect',{kind:'medigelHit',ownerId:p.id,targetId:enemy.id,x1:p.x,y1:p.y,x2:enemy.x,y2:enemy.y,duration:.16});
    }else if(enemyMinion){
      this.damageCoreSiegeMinion(enemyMinion,CORE_SIEGE_CONFIG.medicalGelDamagePerSecond*.1,p.id);
      this.broadcast('coreSiegeEffect',{kind:'medigelHit',ownerId:p.id,targetId:enemyMinion.id,x1:p.x,y1:p.y,x2:enemyMinion.x,y2:enemyMinion.y,duration:.16});
    }else if(enemyStructure){
      const profile=this.coreSiegeBasicProfile(p,'adhesive_sprayer')!;
      this.hitCoreSiegeStructure(enemyStructure,profile.damage*profile.structureDamageMultiplier*coreSiegeBasicDamageMultiplier(progress.level),p.id);
      this.broadcast('coreSiegeEffect',{kind:'medigelHit',targetKind:'structure',ownerId:p.id,targetId:enemyStructure.id,x1:p.x,y1:p.y,x2:enemyStructure.x,y2:enemyStructure.y,duration:.16});
    }else{
      this.broadcast('coreSiegeEffect',{kind:'medigelSpray',ownerId:p.id,x1:p.x,y1:p.y,x2:p.x+Math.cos(p.angle)*range,y2:p.y+Math.sin(p.angle)*range,duration:.12});
    }
    this.emitAudioEvent('weapon_fire',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'medigel',sequence:p.attackSeq});
    return true;
  }

  private firePlayer(p:PlayerState,m?:any){
    if(this.openArenaRoundLocked())return;
    if(this.mechanicalActionDisabled(p))return;
    this.clearOpenArenaSpawnProtection(p.id);
    if(this.tacticalInventory(p.id).exoActive)return;
    if(!p.alive||p.phase!=='landed'||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil)return;
    if(p.isDriving&&p.vehicleId){
      const vehicle=this.state.motorcycles.get(p.vehicleId);
      if(vehicle?.vehicleKind==='fusion_robot'&&vehicle.driverId===p.id){this.fireFusionRobotWeapon(p,vehicle,m);return;}
      if(vehicle?.vehicleKind==='tank'&&vehicle.driverId===p.id){this.fireTankCannon(p,vehicle,m);return;}
    }
    if(this.healUntil.has(p.id)){this.cancelHeal(p);return;}
    if(this.reloadUntil.has(p.id))return;
    const id=p.equipped as WeaponId;
    if(id==='bazooka'&&p.isDriving){const motorcycle=p.vehicleId?this.state.motorcycles.get(p.vehicleId):undefined;if(!motorcycle||motorcycle.driverId!==p.id||Math.hypot(motorcycle.velocityX,motorcycle.velocityY)>8)return;}
    if(id==='rc_car'&&p.isDriving)return;
    const w=WEAPONS[id],profile=this.coreSiegeBasicProfile(p,id);
    if(!w||w.id==='fists')return;
    const now=this.now();
    const siegeProgress=profile?this.coreSiegePlayer(p.id):undefined,hasteFactor=siegeProgress&&now<siegeProgress.hasteUntil?.82:1;
    if(now-(this.shotAt.get(p.id)??-99)<(profile?.fireInterval??w.fireInterval)*hasteFactor)return;
    if(profile&&normalizeCoreSiegeHero(this.coreSiegePlayer(p.id).heroId)==='medigel'){
      if(!siegeProgress||siegeProgress.medicalGel<2){this.emitAudioEvent('weapon_dry_fire',{sourceId:p.id,variant:'medigel'},this.playerClient(p.id));return;}
      this.shotAt.set(p.id,now);this.fireCoreSiegeMedigel(p,now);return;
    }
    const magazine=this.getWeaponMagazine(p,id);
    if(magazine<=0){if(!this.beginReload(p,id))this.emitAudioEvent('weapon_dry_fire',{sourceId:p.id,variant:id},this.playerClient(p.id));return;}
    this.shotAt.set(p.id,now);
    if(id==='flamethrower'){this.fireFlamethrower(p,magazine,now);return;}
    if(id==='adhesive_sprayer'){this.fireAdhesiveSprayer(p,magazine,now,m);return;}
    p.attackSeq++;
    this.setWeaponMagazine(p,id,magazine-1);
    this.revealBushPlayer(p,id==='sniper'?2:BUSH_FIRE_REVEAL_SECONDS);
    this.addAiNoise(p.x,p.y,p.id,this.aiWeaponSoundKind(id),this.aiWeaponHearingRadius(id),id==='bazooka'?1:.65);
    this.emitAudioEvent('weapon_fire',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:id,sequence:p.attackSeq});
    const config=PROJECTILE_CONFIGS[id as Exclude<WeaponId,'fists'>];
    if(!config)return;
    if(id==='rc_car'){this.spawnBombRcCar(p);return;}
    if(id==='bazooka'){this.spawnBazookaRocket(p,w.spread);return;}
    while(this.state.bullets.size>=this.state.activeBulletLimit){
      const oldest=this.state.bullets.keys().next().value as string|undefined;
      if(!oldest)break;
      this.state.bullets.delete(oldest);
    }
    const motorcycle=p.isDriving&&p.vehicleId?this.state.motorcycles.get(p.vehicleId):undefined;
    const speedRatio=motorcycle?clamp(Math.hypot(motorcycle.velocityX,motorcycle.velocityY)/MOTORCYCLE_MAX_SPEED,0,1):0;
    const motion=motorcycle?this.vehicleMotionStates.get(motorcycle.id):undefined;
    const turnRatio=motorcycle?Math.max(clamp(Math.abs(motorcycle.angularVelocity)/MOTORCYCLE_MAX_TURN_RATE,0,1),motion&&now<motion.directionPenaltyUntil?1:0):0;
    const baseSpread=profile?.spread??w.spread;
    const spread=motorcycle?motorcycleSpreadRadians(id,baseSpread,speedRatio,turnRatio):baseSpread;
    if(motorcycle&&id==='sniper'&&speedRatio>MOTORCYCLE_SCOPE_SPEED_RATIO)p.isSniperScoped=false;
    const pellets=profile?.pellets??w.pellets;
    for(let i=0;i<pellets;i++){
      const a=id==='stun_gun'&&pellets>1?p.angle+(i-(pellets-1)/2)*spread:p.angle+(Math.random()*2-1)*spread;
      const muzzleOffset=PLAYER_HIT_RADIUS+10;
      const muzzleX=p.x+Math.cos(a)*muzzleOffset;
      const muzzleY=p.y+Math.sin(a)*muzzleOffset;
      const obstacleT=this.firstObstacleHitT(p.x,p.y,muzzleX,muzzleY,1);
      if(obstacleT!==null)continue;
      const b=new BulletState();
      b.id=`b-${++this.bulletSeq}`;
      b.owner=p.id;
      b.weaponId=id;
      b.x=muzzleX;
      b.y=muzzleY;
      b.prevX=muzzleX;
      b.prevY=muzzleY;
      b.vx=Math.cos(a)*config.projectileSpeed;
      b.vy=Math.sin(a)*config.projectileSpeed;
      b.life=config.lifetimeMs/1000;
      b.traveled=0;
      b.damage=(profile?.damage??config.damage)*(profile?coreSiegeBasicDamageMultiplier(this.coreSiegePlayer(p.id).level):1);
      b.radius=config.radius*(profile?.projectileRadiusMultiplier??1);
      b.buildingId=p.buildingId;
      b.shotSeq=p.attackSeq;
      this.state.bullets.set(b.id,b);
      if(id==='boomerang')this.boomerangFlights.set(b.id,{hitIds:new Set(),targetId:'',returning:false});
    }
  }

  private launchHunterDrones(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(p)this.launchHunterDronesForPlayer(p,c);
  }

  private launchHunterDronesForPlayer(p:PlayerState,c?:Client,requestedCount?:number){
    if(this.openArenaRoundLocked())return false;
    if(!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil)return false;
    const tactical=this.tacticalInventory(p.id);if(this.now()<tactical.empDisabledUntil)return;const count=clamp(Math.floor(requestedCount??tactical.hunterDroneCount),0,Math.min(4,tactical.hunterDroneCount));
    if(count<=0){c?.send('notice',{type:'warning',message:'출격 가능한 호위 드론이 없습니다.'});return false;}
    for(let i=0;i<count;i++)this.launchHunterDroneEscort(p,i,count);
    return true;
  }

  private launchHunterDroneEscort(p:PlayerState,index=0,total=1){
    const tactical=this.tacticalInventory(p.id);
    if(tactical.hunterDroneCount<=0||!p.alive||p.phase!=='landed')return;
    tactical.hunterDroneCount--;
    const angle=p.angle,side=(index-(total-1)/2)*.34,spawnAngle=angle+Math.PI*.82+side;
    const x=clamp(p.x+Math.cos(spawnAngle)*(42+index*4),16,this.worldWidth-16),y=clamp(p.y+Math.sin(spawnAngle)*(42+index*4),16,this.worldHeight-16);
    const object=new ThrownObjectState();
    object.id=`hunter-drone-${++this.throwableSeq}`;
    object.ownerId=p.id;
    object.kind='hunterDrone';
    object.x=x;object.y=y;object.z=0;
    object.vx=Math.cos(angle+side*.25)*HUNTER_DRONE_BALANCE.speed;
    object.vy=Math.sin(angle+side*.25)*HUNTER_DRONE_BALANCE.speed;
    object.vz=0;object.bounces=0;object.phase='seeking';
    object.spawnedAt=this.now();
    object.detonateAt=this.now()+HUNTER_DRONE_BALANCE.lifetimeSeconds;
    object.buildingId=p.buildingId;
    this.state.thrownObjects.set(object.id,object);
    this.emitAudioEvent('throwable_throw',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'hunter_drone'});
  }


  private fireFlamethrower(p:PlayerState,magazine:number,now:number){
    const source=p.isDriving&&p.vehicleId?this.state.motorcycles.get(p.vehicleId):p;if(!source)return;
    const siegeProfile=this.coreSiegeBasicProfile(p,'flamethrower'),playerDamage=siegeProfile?.damage??FLAMETHROWER_BALANCE.playerDamagePerTick;
    const angle=p.angle,originX=source.x+Math.cos(angle)*FLAMETHROWER_BALANCE.muzzleOffset,originY=source.y+Math.sin(angle)*FLAMETHROWER_BALANCE.muzzleOffset;
    if(this.firstObstacleHitT(source.x,source.y,originX,originY,2)!==null)return;
    p.attackSeq++;this.setWeaponMagazine(p,'flamethrower',magazine-FLAMETHROWER_BALANCE.fuelPerTick);this.revealBushPlayer(p,BUSH_FIRE_REVEAL_SECONDS);this.addAiNoise(source.x,source.y,p.id,'flame',720,.7);
    const jet=new FlameJetState();jet.id=`flame-${++this.flameSeq}`;jet.ownerId=p.id;jet.x=originX;jet.y=originY;jet.angle=angle;jet.range=FLAMETHROWER_BALANCE.range;jet.halfAngle=FLAMETHROWER_BALANCE.halfAngleRadians;jet.startedAt=now;jet.expiresAt=now+FLAMETHROWER_BALANCE.visualDurationSeconds;jet.buildingId=p.buildingId;this.state.flameJets.set(jet.id,jet);
    this.emitAudioEvent('weapon_fire',{sourceId:p.id,x:source.x,y:source.y,buildingId:p.buildingId,variant:'flamethrower',sequence:p.attackSeq});
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed'||target.id===p.id||!flamethrowerConeContains(originX,originY,angle,target.x,target.y,PLAYER_HIT_RADIUS))continue;
      if(!traceSpaceVisibility({x:originX,y:originY,roomIndex:p.roomIndex},{x:target.x,y:target.y,roomIndex:target.roomIndex},this.map.portals,this.map.visibilityObstacles,3).visible)continue;
      if(this.firstObstacleHitT(originX,originY,target.x,target.y,2)!==null)continue;
      const key=`p:${target.id}`,last=this.flameDamageAt.get(key)??-99;if(now-last<FLAMETHROWER_BALANCE.tickSeconds*.8)continue;this.flameDamageAt.set(key,now);
      this.damage(target,playerDamage,p.id,'화염방사기');
    }
    if(siegeProfile)for(const minion of this.state.coreSiege.minions.values()){
      if(minion.team===p.team||!flamethrowerConeContains(originX,originY,angle,minion.x,minion.y,minion.radius)||this.firstObstacleHitT(originX,originY,minion.x,minion.y,2)!==null)continue;
      const key=`m:${minion.id}`,last=this.flameDamageAt.get(key)??-99;if(now-last<FLAMETHROWER_BALANCE.tickSeconds*.8)continue;this.flameDamageAt.set(key,now);
      this.damageCoreSiegeMinion(minion,playerDamage,p.id);
    }
    if(siegeProfile)for(const structure of this.state.coreSiege.structures.values()){
      if(structure.team===p.team||structure.destroyed||!flamethrowerConeContains(originX,originY,angle,structure.x,structure.y,structure.radius)||this.firstObstacleHitT(originX,originY,structure.x,structure.y,2)!==null)continue;
      const key=`s:${structure.id}`,last=this.flameDamageAt.get(key)??-99;if(now-last<FLAMETHROWER_BALANCE.tickSeconds*.8)continue;this.flameDamageAt.set(key,now);
      this.hitCoreSiegeStructure(structure,siegeProfile.damage*siegeProfile.structureDamageMultiplier*coreSiegeBasicDamageMultiplier(this.coreSiegePlayer(p.id).level),p.id);
    }
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed||vehicle.id===p.vehicleId||!flamethrowerConeContains(originX,originY,angle,vehicle.x,vehicle.y,this.vehicleRadius(vehicle)))continue;
      if(this.firstObstacleHitT(originX,originY,vehicle.x,vehicle.y,2)!==null)continue;
      const key=`v:${vehicle.id}`,last=this.flameDamageAt.get(key)??-99;if(now-last<FLAMETHROWER_BALANCE.tickSeconds*.8)continue;this.flameDamageAt.set(key,now);
      this.damageMotorcycle(vehicle,FLAMETHROWER_BALANCE.vehicleDamagePerTick,p.id,'화염방사기');
    }
  }

  private updateFlameJets(){const now=this.now();for(const [id,jet] of this.state.flameJets)if(now>=jet.expiresAt)this.state.flameJets.delete(id);for(const [key,at] of this.flameDamageAt)if(now-at>1)this.flameDamageAt.delete(key);}


  private fireAdhesiveSprayer(p:PlayerState,magazine:number,now:number,m?:any){
    const source=p.isDriving&&p.vehicleId?this.state.motorcycles.get(p.vehicleId):p;if(!source)return;
    const angle=p.angle,originX=source.x+Math.cos(angle)*ADHESIVE_SPRAYER_BALANCE.muzzleOffset,originY=source.y+Math.sin(angle)*ADHESIVE_SPRAYER_BALANCE.muzzleOffset;
    if(this.firstObstacleHitT(source.x,source.y,originX,originY,2)!==null)return;
    p.attackSeq++;this.setWeaponMagazine(p,'adhesive_sprayer',magazine-ADHESIVE_SPRAYER_BALANCE.chargePerTick);this.revealBushPlayer(p,BUSH_FIRE_REVEAL_SECONDS);this.addAiNoise(source.x,source.y,p.id,'adhesive',430,.35);
    const desired=this.resolveAdhesiveTarget(originX,originY,angle,m),effectiveRange=Math.max(28,distance(originX,originY,desired.x,desired.y)),effectiveAngle=Math.atan2(desired.y-originY,desired.x-originX);
    const jet=new AdhesiveJetState();jet.id=`adhesive-${++this.adhesiveSeq}`;jet.ownerId=p.id;jet.x=originX;jet.y=originY;jet.angle=effectiveAngle;jet.range=effectiveRange;jet.halfAngle=ADHESIVE_SPRAYER_BALANCE.halfAngleRadians;jet.startedAt=now;jet.expiresAt=now+ADHESIVE_SPRAYER_BALANCE.visualDurationSeconds;jet.buildingId=p.buildingId;this.state.adhesiveJets.set(jet.id,jet);
    this.placeAdhesivePuddle(p,originX,originY,effectiveAngle,now,desired);
    this.emitAudioEvent('weapon_fire',{sourceId:p.id,x:source.x,y:source.y,buildingId:p.buildingId,variant:'adhesive_sprayer',sequence:p.attackSeq});
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed||vehicle.id===p.vehicleId||!coneContains(originX,originY,effectiveAngle,effectiveRange,ADHESIVE_SPRAYER_BALANCE.halfAngleRadians,vehicle.x,vehicle.y,this.vehicleRadius(vehicle)))continue;
      if(this.firstObstacleHitT(originX,originY,vehicle.x,vehicle.y,2)!==null)continue;
      const previous=this.adhesiveExposure.get(vehicle.id);
      const continuous=Boolean(previous&&previous.ownerId===p.id&&now-previous.lastHitAt<=ADHESIVE_SPRAYER_BALANCE.exposureBreakSeconds);
      const exposure:AdhesiveExposure=continuous?previous!:{ownerId:p.id,accumulated:0,lastHitAt:now};
      const elapsed=continuous?Math.max(.001,now-exposure.lastHitAt):ADHESIVE_SPRAYER_BALANCE.tickSeconds;
      exposure.accumulated+=Math.min(ADHESIVE_SPRAYER_BALANCE.tickSeconds*1.5,elapsed);
      exposure.lastHitAt=now;this.adhesiveExposure.set(vehicle.id,exposure);
      if(exposure.accumulated+1e-6<ADHESIVE_SPRAYER_BALANCE.exposureThresholdSeconds)continue;
      this.applyVehicleSlow(vehicle,'adhesive',p.id,ADHESIVE_SPRAYER_BALANCE.motorcycle,ADHESIVE_SPRAYER_BALANCE.motorcycle.maxDurationSeconds);
    }
    for(const target of this.state.players.values()){
      if(target.id===p.id||!target.alive||target.phase!=='landed')continue;
      if(!coneContains(originX,originY,effectiveAngle,effectiveRange,ADHESIVE_SPRAYER_BALANCE.halfAngleRadians,target.x,target.y,18))continue;
      if(this.firstObstacleHitT(originX,originY,target.x,target.y,2)!==null)continue;
      const previous=this.adhesivePlayerExposure.get(target.id);
      const continuous=Boolean(previous&&previous.ownerId===p.id&&now-previous.lastHitAt<=ADHESIVE_PLAYER_BALANCE.exposureBreakSeconds);
      const exposure:AdhesiveExposure=continuous?previous!:{ownerId:p.id,accumulated:0,lastHitAt:now};
      const elapsed=continuous?Math.max(.001,now-exposure.lastHitAt):ADHESIVE_SPRAYER_BALANCE.tickSeconds;
      exposure.accumulated+=Math.min(ADHESIVE_SPRAYER_BALANCE.tickSeconds*1.5,elapsed);
      exposure.lastHitAt=now;this.adhesivePlayerExposure.set(target.id,exposure);
      const stage=adhesivePlayerStage(exposure.accumulated),w=target.werewolf;
      w.adhesiveSlowStage=Math.max(w.adhesiveSlowStage,stage);
      w.adhesiveSlowUntil=Math.max(w.adhesiveSlowUntil,now+adhesivePlayerHoldSeconds(w.adhesiveSlowStage));
      w.adhesiveRecoveryUntil=Math.max(w.adhesiveRecoveryUntil,w.adhesiveSlowUntil+ADHESIVE_PLAYER_BALANCE.recoverySeconds);
      if(w.transformed){w.sprinting=false;w.sprintRechargeAt=Math.max(w.sprintRechargeAt,now+1.1);}
    }
  }

  private resolveAdhesiveTarget(originX:number,originY:number,angle:number,m?:any){
    const range=ADHESIVE_SPRAYER_BALANCE.range;
    let targetX=originX+Math.cos(angle)*range,targetY=originY+Math.sin(angle)*range;
    const requestedX=Number(m?.aimWorldX),requestedY=Number(m?.aimWorldY);
    if(Number.isFinite(requestedX)&&Number.isFinite(requestedY)){
      const dx=requestedX-originX,dy=requestedY-originY,length=Math.hypot(dx,dy);
      if(length>.001){
        const clamped=Math.min(range,length);
        targetX=originX+dx/length*clamped;
        targetY=originY+dy/length*clamped;
      }
    }
    const hitT=this.firstObstacleHitT(originX,originY,targetX,targetY,ADHESIVE_SPRAYER_BALANCE.puddle.radius*.15);
    if(hitT!==null){
      const safeT=Math.max(0,hitT-10/Math.max(1,distance(originX,originY,targetX,targetY)));
      targetX=originX+(targetX-originX)*safeT;
      targetY=originY+(targetY-originY)*safeT;
    }
    return{x:clamp(targetX,ADHESIVE_SPRAYER_BALANCE.puddle.radius,this.worldWidth-ADHESIVE_SPRAYER_BALANCE.puddle.radius),y:clamp(targetY,ADHESIVE_SPRAYER_BALANCE.puddle.radius,this.worldHeight-ADHESIVE_SPRAYER_BALANCE.puddle.radius)};
  }

  private placeAdhesivePuddle(p:PlayerState,originX:number,originY:number,angle:number,now:number,target?:Point){
    const balance=ADHESIVE_SPRAYER_BALANCE.puddle;
    if(now<(this.adhesivePuddleAt.get(p.id)??-99))return;
    this.adhesivePuddleAt.set(p.id,now+balance.placeIntervalSeconds);
    const resolved=target??this.resolveAdhesiveTarget(originX,originY,angle);
    const targetX=resolved.x,targetY=resolved.y;
    if(!this.isPositionFree(targetX,targetY,Math.min(PLAYER_BODY_RADIUS,balance.radius*.32)))return;
    const owned=[...this.state.adhesiveJets.values()].filter((puddle)=>puddle.id.startsWith('adhesive-puddle-')&&puddle.ownerId===p.id).sort((a,b)=>a.startedAt-b.startedAt);
    while(owned.length>=balance.maxActivePerOwner){const oldest=owned.shift();if(oldest)this.state.adhesiveJets.delete(oldest.id);}
    const puddle=new AdhesiveJetState();
    puddle.id=`adhesive-puddle-${++this.adhesivePuddleSeq}`;
    puddle.ownerId=p.id;
    puddle.x=targetX;
    puddle.y=targetY;
    puddle.angle=0;
    puddle.range=balance.radius;
    puddle.halfAngle=0;
    puddle.startedAt=now;
    puddle.expiresAt=now+balance.lifetimeSeconds;
    puddle.buildingId=buildingIdAt(targetX,targetY,0,this.map.buildingVisibilityZones);
    this.state.adhesiveJets.set(puddle.id,puddle);
  }

  private applyAdhesivePuddleEffects(now:number){
    const balance=ADHESIVE_SPRAYER_BALANCE.puddle;
    for(const puddle of this.state.adhesiveJets.values()){
      if(!puddle.id.startsWith('adhesive-puddle-'))continue;
      if(now>=puddle.expiresAt)continue;
      const radius=Number(puddle.range||balance.radius);
      for(const target of this.state.players.values()){
        if(!target.alive||target.phase!=='landed'||target.isSwimming||target.isVaulting)continue;
        if((target.buildingId??'')!==(puddle.buildingId??''))continue;
        if(distance(target.x,target.y,puddle.x,puddle.y)>radius+PLAYER_HIT_RADIUS)continue;
        const w=target.werewolf,stage=balance.playerStage;
        w.adhesiveSlowStage=Math.max(w.adhesiveSlowStage,stage);
        w.adhesiveSlowUntil=Math.max(w.adhesiveSlowUntil,now+balance.playerHoldSeconds);
        w.adhesiveRecoveryUntil=Math.max(w.adhesiveRecoveryUntil,w.adhesiveSlowUntil+ADHESIVE_PLAYER_BALANCE.recoverySeconds);
        if(w.transformed){w.sprinting=false;w.sprintRechargeAt=Math.max(w.sprintRechargeAt,now+1.1);}
      }
      for(const vehicle of this.state.motorcycles.values()){
        if(vehicle.destroyed)continue;
        if((vehicle.buildingId??'')!==(puddle.buildingId??''))continue;
        if(distance(vehicle.x,vehicle.y,puddle.x,puddle.y)>radius+this.vehicleTrapRadius(vehicle))continue;
        this.applyVehicleSlow(vehicle,'adhesive',`puddle:${puddle.id}`,balance.vehicle,balance.vehicle.maxDurationSeconds);
      }
    }
  }

  private updateAdhesiveJets(){
    const now=this.now();
    for(const [id,jet] of this.state.adhesiveJets)if(now>=jet.expiresAt)this.state.adhesiveJets.delete(id);
    this.applyAdhesivePuddleEffects(now);
    for(const [vehicleId,exposure] of this.adhesiveExposure)if(now-exposure.lastHitAt>ADHESIVE_SPRAYER_BALANCE.exposureBreakSeconds)this.adhesiveExposure.delete(vehicleId);
    for(const [playerId,exposure] of this.adhesivePlayerExposure)if(now-exposure.lastHitAt>ADHESIVE_PLAYER_BALANCE.exposureBreakSeconds)this.adhesivePlayerExposure.delete(playerId);
    for(const player of this.state.players.values())if(player.werewolf.adhesiveSlowStage>0&&now>=player.werewolf.adhesiveRecoveryUntil){player.werewolf.adhesiveSlowStage=0;player.werewolf.adhesiveSlowUntil=0;player.werewolf.adhesiveRecoveryUntil=0;}
  }

  private applyVehicleSlow(vehicle:MotorcycleState,kind:VehicleSlowKind,sourceId:string,profile:VehicleSlowProfile,maxDurationSeconds?:number){
    const adjusted=this.adjustVehicleSlowForKind(vehicle,kind,profile,maxDurationSeconds);
    this.vehicleStatus.apply(vehicle.id,{kind,sourceId,profile:adjusted.profile,now:this.now(),maxDurationSeconds:adjusted.maxDurationSeconds});
    this.syncVehicleSlowState(vehicle,this.now());
  }

  private adjustVehicleSlowForKind(vehicle:MotorcycleState,kind:VehicleSlowKind,profile:VehicleSlowProfile,maxDurationSeconds?:number){
    if(vehicle.vehicleKind!=='tank')return{profile,maxDurationSeconds};
    if(kind==='strip_trap')return{profile:{speedMultiplier:.18,accelerationMultiplier:.12,steeringMultiplier:.28,durationSeconds:profile.durationSeconds*1.85},maxDurationSeconds:maxDurationSeconds?maxDurationSeconds*1.85:undefined};
    if(kind==='adhesive')return{profile:{speedMultiplier:.24,accelerationMultiplier:.16,steeringMultiplier:.38,durationSeconds:profile.durationSeconds*1.55},maxDurationSeconds:maxDurationSeconds?maxDurationSeconds*1.55:undefined};
    return{profile,maxDurationSeconds};
  }

  private vehicleTrapRadius(vehicle:MotorcycleState){
    return vehicle.vehicleKind==='tank'?MOTORCYCLE_RADIUS+22:this.vehicleRadius(vehicle);
  }

  private vehicleRadius(vehicle:MotorcycleState){
    if(vehicle.vehicleKind==='fusion_robot')return FUSION_ROBOT_BALANCE.collisionRadius;
    return MOTORCYCLE_RADIUS;
  }

  private syncVehicleSlowState(vehicle:MotorcycleState,now:number){
    const aggregate=this.vehicleStatus.aggregate(vehicle.id,now);
    vehicle.slowKind=aggregate.kind;
    vehicle.slowSpeedMultiplier=aggregate.speedMultiplier;
    vehicle.slowAccelerationMultiplier=aggregate.accelerationMultiplier;
    vehicle.slowSteeringMultiplier=aggregate.steeringMultiplier;
    vehicle.slowUntil=aggregate.expiresAt;
    return aggregate;
  }

  private placeStripTrap(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(p)this.placeStripTrapForPlayer(p,c);
  }

  private placeStripTrapForPlayer(p:PlayerState,c?:Client){
    if(this.openArenaRoundLocked())return false;
    this.clearOpenArenaSpawnProtection(p.id);
    if(!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing)return false;
    const tactical=this.tacticalInventory(p.id);
    if(tactical.stripTrapCount<=0){c?.send('notice',{type:'warning',message:'보유한 스트립 트랩이 없습니다.'});return false;}
    const x=p.x+Math.cos(p.angle)*STRIP_TRAP_BALANCE.placementDistance,y=p.y+Math.sin(p.angle)*STRIP_TRAP_BALANCE.placementDistance,angle=p.angle+Math.PI/2;
    if(x<40||y<40||x>this.worldWidth-40||y>this.worldHeight-40){c?.send('notice',{type:'warning',message:'맵 경계에는 설치할 수 없습니다.'});return false;}
    const space=spaceAt(x,y,this.map.buildingVisibilityZones,this.map.rooms,2),terrain=this.terrainKindAt(x,y);
    if(!space.outdoors||!['land','bridge'].includes(terrain)){c?.send('notice',{type:'warning',message:'실외의 단단한 바닥에만 설치할 수 있습니다.'});return false;}
    const samples=9;
    for(let index=0;index<samples;index++){
      const offset=(index/(samples-1)-.5)*STRIP_TRAP_BALANCE.length,px=x+Math.cos(angle)*offset,py=y+Math.sin(angle)*offset;
      if(this.collisionRects().some((rect)=>circleHitsRect(px,py,STRIP_TRAP_BALANCE.width/2+3,rect))){c?.send('notice',{type:'warning',message:'벽이나 장애물과 겹쳐 설치할 수 없습니다.'});return false;}
    }
    const candidate={x,y,angle,length:STRIP_TRAP_BALANCE.length,width:STRIP_TRAP_BALANCE.width};
    if([...this.state.motorcycles.values()].some((vehicle)=>!vehicle.destroyed&&circleHitsStripTrap(vehicle.x,vehicle.y,this.vehicleRadius(vehicle), candidate,4))){c?.send('notice',{type:'warning',message:'차량 바로 아래에는 설치할 수 없습니다.'});return false;}
    if([...this.state.stripTraps.values()].some((trap)=>stripTrapsOverlap(candidate,trap,STRIP_TRAP_BALANCE.overlapPadding))){c?.send('notice',{type:'warning',message:'다른 트랩과 너무 가깝습니다.'});return false;}
    const owned=[...this.state.stripTraps.values()].filter((trap)=>trap.ownerId===p.id).sort((a,b)=>a.placedAt-b.placedAt);
    while(owned.length>=STRIP_TRAP_BALANCE.maxActivePerOwner){const oldest=owned.shift();if(oldest)this.state.stripTraps.delete(oldest.id);}
    const now=this.now(),trap=new StripTrapState();trap.id=`strip-trap-${++this.stripTrapSeq}`;trap.ownerId=p.id;trap.x=x;trap.y=y;trap.angle=angle;trap.length=STRIP_TRAP_BALANCE.length;trap.width=STRIP_TRAP_BALANCE.width;trap.hp=STRIP_TRAP_BALANCE.hp;trap.maxHp=STRIP_TRAP_BALANCE.hp;trap.placedAt=now;trap.activatesAt=now+STRIP_TRAP_BALANCE.activatesAfterSeconds;trap.expiresAt=now+STRIP_TRAP_BALANCE.lifetimeSeconds;trap.active=false;trap.buildingId='';
    this.state.stripTraps.set(trap.id,trap);tactical.stripTrapCount--;this.emitAudioEvent('strip_trap_place',{sourceId:p.id,x,y,buildingId:'',variant:'strip_trap'});return true;
  }

  private removeStripTrapsForOwner(ownerId:string){for(const [id,trap] of this.state.stripTraps)if(trap.ownerId===ownerId)this.state.stripTraps.delete(id);}

  private placeSpiderMine(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(p)this.placeSpiderMineForPlayer(p,c);
  }

  private placeSpiderMineForPlayer(p:PlayerState,c?:Client){
    if(this.openArenaRoundLocked())return false;
    this.clearOpenArenaSpawnProtection(p.id);
    if(!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing)return false;
    const tactical=this.tacticalInventory(p.id);
    if(tactical.spiderMineCount<=0){c?.send('notice',{type:'warning',message:'보유한 스파이더 마인이 없습니다.'});return false;}
    const x=p.x+Math.cos(p.angle)*SPIDER_MINE_BALANCE.placementDistance,y=p.y+Math.sin(p.angle)*SPIDER_MINE_BALANCE.placementDistance;
    if(x<32||y<32||x>this.worldWidth-32||y>this.worldHeight-32||this.terrainKindAt(x,y)==='deep-water'||!this.isPositionFree(x,y,SPIDER_MINE_BALANCE.hitRadius+3)){c?.send('notice',{type:'warning',message:'이 위치에는 스파이더 마인을 설치할 수 없습니다.'});return false;}
    if([...this.state.motorcycles.values()].some((vehicle)=>!vehicle.destroyed&&distance(x,y,vehicle.x,vehicle.y)<this.vehicleRadius(vehicle)+SPIDER_MINE_BALANCE.hitRadius+8)){c?.send('notice',{type:'warning',message:'차량 바로 아래에는 설치할 수 없습니다.'});return false;}
    if(this.spiderMines().some((mine)=>distance(x,y,mine.x,mine.y)<SPIDER_MINE_BALANCE.overlapDistance)){c?.send('notice',{type:'warning',message:'다른 스파이더 마인과 너무 가깝습니다.'});return false;}
    const owned=this.spiderMines().filter((mine)=>mine.ownerId===p.id).sort((a,b)=>a.spawnedAt-b.spawnedAt);
    while(owned.length>=SPIDER_MINE_BALANCE.maxActivePerOwner){const oldest=owned.shift();if(oldest)this.state.thrownObjects.delete(oldest.id);}
    const now=this.now(),space=spaceAt(x,y,this.map.buildingVisibilityZones,this.map.rooms,0),mine=new ThrownObjectState();
    mine.id=`spider-mine-${++this.spiderMineSeq}`;mine.kind='spiderMine';mine.ownerId=p.id;mine.x=x;mine.y=y;mine.z=0;mine.angle=p.angle;mine.hp=SPIDER_MINE_BALANCE.hp;mine.spawnedAt=now;mine.activatesAt=now+SPIDER_MINE_BALANCE.armSeconds;mine.detonateAt=now+SPIDER_MINE_BALANCE.lifetimeSeconds;mine.phase='arming';mine.buildingId=space.buildingId;mine.roomIndex=space.roomIndex;
    this.state.thrownObjects.set(mine.id,mine);tactical.spiderMineCount--;
    this.emitAudioEvent('strip_trap_place',{sourceId:p.id,x,y,buildingId:mine.buildingId,variant:'spider_mine'});return true;
  }

  private spiderMines(){return[...this.state.thrownObjects.values()].filter((object)=>object.kind==='spiderMine');}

  private removeSpiderMinesForOwner(ownerId:string){for(const mine of this.spiderMines())if(mine.ownerId===ownerId)this.state.thrownObjects.delete(mine.id);}

  private acquireSpiderMineTarget(mine:ThrownObjectState){
    const owner=this.state.players.get(mine.ownerId);
    let nearest:PlayerState|undefined,best:number=SPIDER_MINE_BALANCE.detectionRadius;
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed'||target.id===mine.ownerId||this.sameCombatTeam(owner,target)||this.now()<(this.spawnProtectionUntil.get(target.id)??0))continue;
      const d=distance(mine.x,mine.y,target.x,target.y);if(d>=best)continue;
      if(!traceSpaceVisibility({x:mine.x,y:mine.y,roomIndex:mine.roomIndex},{x:target.x,y:target.y,roomIndex:target.roomIndex},this.map.portals,this.map.visibilityObstacles,3).visible)continue;
      if(this.firstObstacleHitT(mine.x,mine.y,target.x,target.y,SPIDER_MINE_BALANCE.hitRadius)!==null)continue;
      nearest=target;best=d;
    }
    if(nearest||this.gameMode!=='coreSiege')return nearest;
    return [...this.state.coreSiege.minions.values()]
      .filter((minion)=>minion.team!==owner?.team&&distance(mine.x,mine.y,minion.x,minion.y)<SPIDER_MINE_BALANCE.detectionRadius&&this.firstObstacleHitT(mine.x,mine.y,minion.x,minion.y,SPIDER_MINE_BALANCE.hitRadius)===null)
      .sort((a,b)=>distance(mine.x,mine.y,a.x,a.y)-distance(mine.x,mine.y,b.x,b.y))[0];
  }

  private updateSpiderMines(dt:number){
    const now=this.now();
    for(const mine of this.spiderMines()){
      if(mine.hp<=0||now>=mine.detonateAt){this.state.thrownObjects.delete(mine.id);continue;}
      if(mine.phase==='arming'&&now>=mine.activatesAt)mine.phase='armed';
      if(mine.phase==='armed'){
        const target=this.acquireSpiderMineTarget(mine);if(!target)continue;
        mine.phase='chasing';mine.targetId=target.id;mine.triggeredAt=now;mine.angle=Math.atan2(target.y-mine.y,target.x-mine.x);
        this.emitAudioEvent('strip_trap_trigger',{sourceId:mine.ownerId,targetId:target.id,x:mine.x,y:mine.y,buildingId:mine.buildingId,variant:'spider_mine'});
      }
      if(mine.phase!=='chasing')continue;
      const playerTarget=this.state.players.get(mine.targetId),minionTarget=this.state.coreSiege.minions.get(mine.targetId),target=playerTarget??minionTarget;
      if(!target||playerTarget&&(!playerTarget.alive||playerTarget.phase!=='landed')||minionTarget&&minionTarget.hp<=0||now-mine.triggeredAt>=SPIDER_MINE_BALANCE.chaseSeconds){this.explodeSpiderMine(mine);continue;}
      const desired=Math.atan2(target.y-mine.y,target.x-mine.x);
      mine.angle=turnAngleToward(mine.angle,desired,SPIDER_MINE_BALANCE.turnResponse*dt);
      mine.vx=Math.cos(mine.angle)*SPIDER_MINE_BALANCE.chaseSpeed;mine.vy=Math.sin(mine.angle)*SPIDER_MINE_BALANCE.chaseSpeed;
      const nextX=clamp(mine.x+mine.vx*dt,SPIDER_MINE_BALANCE.hitRadius,this.worldWidth-SPIDER_MINE_BALANCE.hitRadius),nextY=clamp(mine.y+mine.vy*dt,SPIDER_MINE_BALANCE.hitRadius,this.worldHeight-SPIDER_MINE_BALANCE.hitRadius);
      const obstacleT=this.firstObstacleHitT(mine.x,mine.y,nextX,nextY,SPIDER_MINE_BALANCE.hitRadius);
      if(obstacleT!==null){mine.x+=(nextX-mine.x)*Math.max(0,obstacleT-.05);mine.y+=(nextY-mine.y)*Math.max(0,obstacleT-.05);this.explodeSpiderMine(mine);continue;}
      mine.x=nextX;mine.y=nextY;const space=spaceAt(mine.x,mine.y,this.map.buildingVisibilityZones,this.map.rooms,0);mine.buildingId=space.buildingId;mine.roomIndex=space.roomIndex;
      const targetRadius=playerTarget?PLAYER_HIT_RADIUS:minionTarget?.radius??PLAYER_HIT_RADIUS;
      if(distance(mine.x,mine.y,target.x,target.y)<=SPIDER_MINE_BALANCE.triggerRadius+targetRadius)this.explodeSpiderMine(mine);
    }
  }

  private explodeSpiderMine(mine:ThrownObjectState){
    if(this.state.thrownObjects.get(mine.id)?.kind!=='spiderMine')return;
    this.state.thrownObjects.delete(mine.id);
    const now=this.now(),source={x:mine.x,y:mine.y,buildingId:mine.buildingId},explosion=new ExplosionState();
    explosion.id=`explosion-${++this.explosionSeq}`;explosion.x=mine.x;explosion.y=mine.y;explosion.radius=SPIDER_MINE_BALANCE.effectRadius;explosion.startedAt=now;explosion.duration=.55;explosion.sourceId=mine.id;explosion.ownerId=mine.ownerId;explosion.kind='spiderMine';explosion.attackerId=mine.ownerId;explosion.weaponType='spiderMine';explosion.vehicleDamage=SPIDER_MINE_BALANCE.maxVehicleDamage;explosion.structureDamage=18;explosion.buildingId=mine.buildingId;this.state.explosions.set(explosion.id,explosion);
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed')continue;
      const d=distance(mine.x,mine.y,target.x,target.y),raw=spiderMinePlayerDamage(d,target.id===mine.ownerId);if(raw<=0)continue;
      const exposure=explosionExposureMultiplier(source,target,this.map.visibilityObstacles,this.map.buildingVisibilityZones,PLAYER_HIT_RADIUS),applied=Math.round(raw*exposure);if(applied<=0)continue;
      this.damage(target,applied,mine.ownerId,'스파이더 마인',Math.max(0,145*(1-d/SPIDER_MINE_BALANCE.effectRadius)),Math.atan2(target.y-mine.y,target.x-mine.x),'explosion');
    }
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed)continue;
      const d=distance(mine.x,mine.y,vehicle.x,vehicle.y),raw=spiderMineVehicleDamage(d,vehicle.vehicleKind==='tank');if(raw<=0)continue;
      const exposure=explosionExposureMultiplier(source,vehicle,this.map.visibilityObstacles,this.map.buildingVisibilityZones,this.vehicleRadius(vehicle)),applied=Math.round(raw*exposure);if(applied>0)this.damageMotorcycle(vehicle,applied,mine.ownerId,vehicle.vehicleKind==='tank'?'대전차 스파이더 마인':'스파이더 마인');
    }
    if(this.gameMode==='coreSiege')this.damageCoreSiegeMinionsInRadius(mine.x,mine.y,SPIDER_MINE_BALANCE.effectRadius,74,mine.ownerId,.55);
    this.damageCoreSiegeStructuresInRadius(mine.x,mine.y,SPIDER_MINE_BALANCE.effectRadius,18,mine.ownerId);
    this.emitAudioEvent('frag_explosion',{sourceId:mine.id,ownerId:mine.ownerId,x:mine.x,y:mine.y,buildingId:mine.buildingId,radius:SPIDER_MINE_BALANCE.effectRadius,variant:'spider_mine'});
  }

  private updateStripTraps(){
    const now=this.now();
    for(const [id,trap] of [...this.state.stripTraps]){
      if(now>=trap.expiresAt||trap.hp<=0){this.state.stripTraps.delete(id);continue;}
      trap.active=now>=trap.activatesAt;
      if(!trap.active)continue;
      if(this.gameMode==='coreSiege'){
        const owner=this.state.players.get(trap.ownerId);
        let triggered=false;
        for(const target of this.state.players.values()){
          if(!target.alive||target.id===trap.ownerId||this.sameCombatTeam(owner,target)||!circleHitsStripTrap(target.x,target.y,PLAYER_BODY_RADIUS,trap,6))continue;
          this.applyCoreSiegeCrowdControl(target,CORE_SIEGE_CONFIG.trapPlayerStunSeconds,CORE_SIEGE_CONFIG.trapPlayerStunSeconds+1.4);
          this.damage(target,CORE_SIEGE_CONFIG.trapPlayerDamage,trap.ownerId,'감전 저지선',0,undefined,'bullet');
          this.state.stripTraps.delete(id);
          this.broadcast('coreSiegeEffect',{kind:'shockTrap',ownerId:trap.ownerId,targetId:target.id,x:trap.x,y:trap.y,radius:150,duration:.8});
          this.emitAudioEvent('strip_trap_trigger',{sourceId:trap.ownerId,targetId:target.id,x:trap.x,y:trap.y,buildingId:'',variant:'shock_trap'});
          triggered=true;
          break;
        }
        if(triggered)continue;
      }
      for(const vehicle of this.state.motorcycles.values()){
        if(vehicle.destroyed||!circleHitsStripTrap(vehicle.x,vehicle.y,this.vehicleTrapRadius(vehicle),trap,STRIP_TRAP_BALANCE.motorcycleTriggerPadding))continue;
        this.applyVehicleSlow(vehicle,'strip_trap',trap.id,STRIP_TRAP_VEHICLE_PROFILE.motorcycle);
        if(vehicle.vehicleKind==='tank')this.damageMotorcycle(vehicle,TANK_COUNTER_BALANCE.stripTrapDamage,trap.ownerId,'대전차 EMP 트랩');
        this.state.stripTraps.delete(id);
        this.emitAudioEvent('strip_trap_trigger',{sourceId:trap.ownerId,targetId:vehicle.id,x:trap.x,y:trap.y,buildingId:'',variant:'strip_trap'});
        break;
      }
    }
  }

  private stripTrapBulletHitT(x1:number,y1:number,x2:number,y2:number,radius:number,trap:StripTrapState){
    let closest:number|null=null;
    for(let index=0;index<9;index++){
      const offset=(index/8-.5)*trap.length,px=trap.x+Math.cos(trap.angle)*offset,py=trap.y+Math.sin(trap.angle)*offset;
      const hit=segmentCircleIntersectionT(x1,y1,x2,y2,px,py,trap.width/2+radius);
      if(hit!==null&&(closest===null||hit<closest))closest=hit;
    }
    return closest;
  }

  private melee(c:Client){const p=this.state.players.get(c.sessionId);if(p)this.meleePlayer(p);}

  private meleePlayer(p:PlayerState){
    if(this.openArenaRoundLocked())return;
    this.clearOpenArenaSpawnProtection(p.id);
    if(this.tacticalInventory(p.id).exoActive)return;
    if(p.werewolf.transformed){this.werewolfClaw(p);return;}
    if(this.chickenState(p).chickenTransformed){this.chickenPeck(p);return;}
    if(!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil)return;
    if(this.healUntil.has(p.id)){this.cancelHeal(p);return;}
    if(this.gameMode==='coreSiege'){
      const progress=this.coreSiegePlayer(p.id),heroId=normalizeCoreSiegeHero(progress.heroId);
      if(this.now()<progress.parryRecoveryUntil)return;
      if(heroId==='ironCyclone'){this.meleeCoreSiegeIron(p);return;}
      if(heroId==='earthHammer'||heroId==='chainExecutioner'||heroId==='twinBlade'){this.meleeCoreSiegeHero(p,heroId);return;}
    }
    const melee=p.equipped==='fists'
      ?{name:'주먹',damage:WEAPONS.fists.damage,fireInterval:WEAPONS.fists.fireInterval,range:WEAPONS.fists.range,arc:1.3}
      :MELEE_WEAPONS[p.equipped as MeleeId];
    if(!melee)return;
    const now=this.now();
    if(now-(this.shotAt.get(p.id)??-99)<melee.fireInterval)return;
    this.shotAt.set(p.id,now);
    p.attackSeq++;
    this.revealBushPlayer(p,.7);
    let target:PlayerState|undefined;
    let best=melee.range;
    for(const other of this.state.players.values()){
      if(!other.alive||other.id===p.id||other.phase!=='landed')continue;
      const d=distance(p.x,p.y,other.x,other.y);
      if(d<best&&this.canSeeTarget(p,other)&&Math.abs(this.angleDiff(Math.atan2(other.y-p.y,other.x-p.x),p.angle))<melee.arc){target=other;best=d;}
    }
    if(target){this.damage(target,melee.damage,p.id,p.equipped==='fists'?'주먹':melee.name);return;}
    if(this.gameMode==='coreSiege'){
      const structure=[...this.state.coreSiege.structures.values()]
        .filter((candidate)=>!candidate.destroyed&&candidate.team!==p.team&&distance(p.x,p.y,candidate.x,candidate.y)<=melee.range+candidate.radius&&Math.abs(this.angleDiff(Math.atan2(candidate.y-p.y,candidate.x-p.x),p.angle))<melee.arc)
        .sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0];
      if(structure)this.hitCoreSiegeStructure(structure,melee.damage*.35,p.id);
    }
  }

  private meleeCoreSiegeIron(p:PlayerState){
    const profile=CORE_SIEGE_BASIC_ATTACKS.ironCyclone,now=this.now();
    if(now-(this.shotAt.get(p.id)??-99)<profile.fireInterval)return;
    const previous=this.coreSiegeMeleeCombos.get(p.id),step=previous&&now<previous.expiresAt?previous.step%3+1:1;
    this.coreSiegeMeleeCombos.set(p.id,{step,expiresAt:now+1.15});this.shotAt.set(p.id,now);p.attackSeq++;this.revealBushPlayer(p,.8);
    const progress=this.coreSiegePlayer(p.id),finisher=step===3,range=finisher?128:108,halfArc=finisher?1.25:.78,damage=profile.damage*coreSiegeBasicDamageMultiplier(progress.level)*(finisher?1.35:1)*(now<progress.rampageUntil?1.18:1);
    if(finisher)this.tryMove(p,Math.cos(p.angle)*12,Math.sin(p.angle)*12);
    const players=[...this.state.players.values()].filter((target)=>target.alive&&target.id!==p.id&&!this.sameCombatTeam(p,target)&&distance(p.x,p.y,target.x,target.y)<=range&&Math.abs(this.angleDiff(Math.atan2(target.y-p.y,target.x-p.x),p.angle))<=halfArc).sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y));
    const minions=[...this.state.coreSiege.minions.values()].filter((target)=>target.team!==p.team&&distance(p.x,p.y,target.x,target.y)<=range+target.radius&&Math.abs(this.angleDiff(Math.atan2(target.y-p.y,target.x-p.x),p.angle))<=halfArc).sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y));
    const hitPlayers=finisher?players:players.slice(0,1),hitMinions=finisher?minions:minions.slice(0,hitPlayers.length?0:1);
    for(const target of hitPlayers)this.damage(target,damage,p.id,finisher?'대검 휩쓸기':'대검 베기',finisher?55:18,p.angle,'melee');
    for(const target of hitMinions)this.damageCoreSiegeMinion(target,damage*(finisher?1.4:1.15),p.id);
    const structure=[...this.state.coreSiege.structures.values()].filter((target)=>!target.destroyed&&target.team!==p.team&&distance(p.x,p.y,target.x,target.y)<=range+target.radius&&Math.abs(this.angleDiff(Math.atan2(target.y-p.y,target.x-p.x),p.angle))<=halfArc).sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0];
    if(structure)this.hitCoreSiegeStructure(structure,damage*profile.structureDamageMultiplier,p.id);
    this.broadcast('coreSiegeEffect',{kind:'ironSlash',ownerId:p.id,combo:step,x:p.x,y:p.y,angle:p.angle,radius:range,duration:finisher?.42:.28});
    this.emitAudioEvent('impact_frame',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:finisher?'iron_cleave':'iron_sword'});
  }

  private meleeCoreSiegeHero(p:PlayerState,heroId:'earthHammer'|'chainExecutioner'|'twinBlade'){
    const profile=CORE_SIEGE_BASIC_ATTACKS[heroId],now=this.now();
    if(now-(this.shotAt.get(p.id)??-99)<profile.fireInterval)return;
    const previous=this.coreSiegeMeleeCombos.get(p.id),step=previous&&now<previous.expiresAt?previous.step%3+1:1,finisher=step===3;
    this.coreSiegeMeleeCombos.set(p.id,{step,expiresAt:now+(heroId==='twinBlade'?.8:1.2)});this.shotAt.set(p.id,now);p.attackSeq++;this.revealBushPlayer(p,.8);
    const progress=this.coreSiegePlayer(p.id),range=heroId==='earthHammer'?(finisher?148:116):heroId==='chainExecutioner'?(finisher?158:124):(finisher?132:108),halfArc=finisher?(heroId==='earthHammer'?1.12:1.2):(heroId==='twinBlade'?.72:.82),finisherMultiplier=heroId==='earthHammer'?1.45:heroId==='chainExecutioner'?1.32:1.25,damage=profile.damage*coreSiegeBasicDamageMultiplier(progress.level)*(finisher?finisherMultiplier:1);
    if(finisher)this.tryMove(p,Math.cos(p.angle)*14,Math.sin(p.angle)*14);
    const players=[...this.state.players.values()].filter((target)=>target.alive&&target.id!==p.id&&!this.sameCombatTeam(p,target)&&distance(p.x,p.y,target.x,target.y)<=range&&Math.abs(this.angleDiff(Math.atan2(target.y-p.y,target.x-p.x),p.angle))<=halfArc).sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y));
    const minions=[...this.state.coreSiege.minions.values()].filter((target)=>target.team!==p.team&&distance(p.x,p.y,target.x,target.y)<=range+target.radius&&Math.abs(this.angleDiff(Math.atan2(target.y-p.y,target.x-p.x),p.angle))<=halfArc).sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y));
    const hitPlayers=finisher?players:players.slice(0,1),hitMinions=finisher?minions:minions.slice(0,hitPlayers.length?0:1),reason=heroId==='earthHammer'?(finisher?'망치 충격파':'대형 망치'):heroId==='chainExecutioner'?(finisher?'사슬낫 횡베기':'사슬낫'):finisher?'쌍검 교차 베기':'쌍검 베기';
    for(const target of hitPlayers)this.damage(target,damage,p.id,reason,finisher?75:18,p.angle,'melee');
    for(const target of hitMinions)this.damageCoreSiegeMinion(target,damage*(heroId==='earthHammer'?(finisher?1.75:1.3):finisher?1.4:1.15),p.id);
    const structure=[...this.state.coreSiege.structures.values()].filter((target)=>!target.destroyed&&target.team!==p.team&&distance(p.x,p.y,target.x,target.y)<=range+target.radius&&Math.abs(this.angleDiff(Math.atan2(target.y-p.y,target.x-p.x),p.angle))<=halfArc).sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0];
    if(structure)this.hitCoreSiegeStructure(structure,damage*profile.structureDamageMultiplier,p.id);
    const effectKind=heroId==='earthHammer'?'earthHammerSwing':heroId==='chainExecutioner'?'chainScytheSwing':'twinBladeSlash';
    this.broadcast('coreSiegeEffect',{kind:effectKind,ownerId:p.id,combo:step,x:p.x,y:p.y,angle:p.angle,radius:range,duration:finisher?.48:.3});
    this.emitAudioEvent('impact_frame',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:finisher?`${heroId}_finisher`:heroId});
  }

  private reload(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(!p)return;
    p.isSniperScoped=false;
    if(this.healUntil.has(p.id)){this.cancelHeal(p);return;}
    if(!this.beginReload(p)){
      const id=p.equipped as WeaponId,w=WEAPONS[id];
      if(w&&w.id!=='fists'&&this.getWeaponMagazine(p,id)<w.magazine&&this.getAmmo(p,w.ammoType)<=0)c.send('notice',{type:'warning',message:'재장전할 탄약이 없습니다.'});
    }
  }

  private beginReload(p:PlayerState,weaponId:WeaponId=p.equipped as WeaponId){
    p.isSniperScoped=false;
    this.cancelLaserCannonCharge(p);
    if(!p.alive||p.phase!=='landed'||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil||this.reloadUntil.has(p.id))return false;
    const w=WEAPONS[weaponId];
    if(!w||w.id==='fists'||p.equipped!==weaponId)return false;
    if(weaponId==='boomerang')return false;
    const profile=this.coreSiegeBasicProfile(p,weaponId),capacity=profile?.magazine??w.magazine;
    const magazine=this.getWeaponMagazine(p,weaponId);
    if(magazine>=capacity||this.getAmmo(p,w.ammoType)<=0)return false;
    const startedAt=this.now(),marchFactor=this.gameMode==='coreSiege'&&startedAt<this.coreSiegePlayer(p.id).marchUntil ? .76 : 1,duration=(profile?.reloadSeconds??w.reloadSeconds)*marchFactor;
    this.reloadUntil.set(p.id,{at:startedAt+duration,startedAt,duration,weapon:weaponId});
    p.reloading=true;
    p.reloadWeapon=weaponId;
    p.reloadProgress=0;
    if(p.ai){p.aiState='RELOAD';this.emitAiDialogue(p,pickDialogue('reload',p.id,Math.floor(startedAt*10)),'reload');}
    this.emitAudioEvent('reload_start',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:weaponId});
    return true;
  }

  private cancelReload(p:PlayerState){
    this.reloadUntil.delete(p.id);
    p.reloading=false;
    p.reloadWeapon='';
    p.reloadProgress=0;
  }

  private interact(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(p)this.clearOpenArenaSpawnProtection(p.id);
    if(!p||!p.alive||p.phase!=='landed'||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed)return;
    if(p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing)return;
    if(p.isDriving){this.dismountMotorcycle(c,p);return;}
    if(this.openSilverArmory(p,c))return;
    const season=this.state.werewolfSeason;if(season.curseDropActive&&distance(p.x,p.y,season.curseDropX,season.curseDropY)<=62&&!p.werewolf.hasCurse){const remaining=season.curseDropRemaining;season.curseDropActive=false;this.grantWerewolfCurse(p,remaining);return;}
    if(this.openNearbySupplyDrop(p)){c.send('notice',{type:'success',message:'보급 상자를 열었습니다.'});return;}
    let nearest:MotorcycleState|undefined;
    let best=MOTORCYCLE_MOUNT_DISTANCE;
    for(const motorcycle of this.state.motorcycles.values()){
      if(motorcycle.driverId||motorcycle.exploding||motorcycle.destroyed)continue;
      if(!buildingSpacesInteractable(p,motorcycle))continue;
      const d=distance(p.x,p.y,motorcycle.x,motorcycle.y)-Math.max(0,this.vehicleRadius(motorcycle)-MOTORCYCLE_RADIUS);
      if(d<best){best=d;nearest=motorcycle;}
    }
    if(nearest){this.mountMotorcycle(p,nearest,c);return;}
    this.pickup(c);
  }

  private mountMotorcycle(p:PlayerState,motorcycle:MotorcycleState,c?:Client){
    if(motorcycle.driverId||motorcycle.exploding||motorcycle.destroyed||p.isDriving||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil||!p.alive||p.phase!=='landed')return false;
    if(distance(p.x,p.y,motorcycle.x,motorcycle.y)>MOTORCYCLE_MOUNT_DISTANCE+Math.max(0,this.vehicleRadius(motorcycle)-MOTORCYCLE_RADIUS))return false;
    const mountLockRemaining=motorcycle.mountLockedUntil-this.now();
    if(mountLockRemaining>0){c?.send('notice',{type:'warning',message:`테이저 전기 잠금 · ${mountLockRemaining.toFixed(1)}초 후 탑승 가능`});return false;}
    if(motorcycle.vehicleKind==='tank'&&this.tacticalInventory(p.id).tankKeyCount<=0){c?.send('notice',{type:'warning',message:'탱크 열쇠가 있어야 탑승할 수 있습니다.'});return false;}
    this.cancelHeal(p);this.cancelReload(p);this.cancelThrow(p);p.isSniperScoped=false;
    p.isDriving=true;p.vehicleId=motorcycle.id;motorcycle.driverId=p.id;
    motorcycle.velocityX=0;motorcycle.velocityY=0;motorcycle.speed=0;motorcycle.angularVelocity=0;
    this.vehicleMotionStates.set(motorcycle.id,{movementHeldMs:0,previousInputX:0,previousInputY:0,mountedAt:this.now(),directionPenaltyUntil:-99});
    p.x=motorcycle.x;p.y=motorcycle.y;
    this.knockback.delete(p.id);
    if(p.ai)this.emitAiPersonaDialogue(p,'mount',{casual:true,loggable:false,allowResponse:true});
    return true;
  }

  private findDismountPoint(p:PlayerState,motorcycle:MotorcycleState){
    const right=motorcycle.rotation+Math.PI/2,left=motorcycle.rotation-Math.PI/2,back=motorcycle.rotation+Math.PI;
    const radius=this.vehicleRadius(motorcycle),candidates=[right,left,back,motorcycle.rotation].map((angle)=>({x:motorcycle.x+Math.cos(angle)*(radius+PLAYER_BODY_RADIUS+16),y:motorcycle.y+Math.sin(angle)*(radius+PLAYER_BODY_RADIUS+16)}));
    let point=candidates.find((candidate)=>this.isDismountPositionFree(candidate.x,candidate.y,p.id,motorcycle.id));
    if(!point){
      const nearby=this.findNearestFreePoint(motorcycle.x,motorcycle.y,260,false);
      if(nearby&&this.isDismountPositionFree(nearby.x,nearby.y,p.id,motorcycle.id))point=nearby;
    }
    return point;
  }

  private dismountMotorcycle(c:Client|undefined,p:PlayerState){
    const motorcycle=p.vehicleId?this.state.motorcycles.get(p.vehicleId):undefined;
    if(!motorcycle){p.isDriving=false;p.vehicleId='';p.isSniperScoped=false;return true;}
    const point=this.findDismountPoint(p,motorcycle);
    if(!point){c?.send('notice',{type:'warning',message:'지금은 안전하게 내릴 공간이 없습니다.'});return false;}
    this.cancelThrow(p);
    motorcycle.driverId='';motorcycle.velocityX*=.35;motorcycle.velocityY*=.35;motorcycle.speed=Math.hypot(motorcycle.velocityX,motorcycle.velocityY);motorcycle.angularVelocity=0;this.vehicleMotionStates.delete(motorcycle.id);
    p.isDriving=false;p.vehicleId='';p.isSniperScoped=false;p.x=point.x;p.y=point.y;const dismountSpace=spaceAt(point.x,point.y,this.map.buildingVisibilityZones,this.map.rooms,0);p.buildingId=dismountSpace.buildingId;p.roomIndex=dismountSpace.roomIndex;p.insideBuilding=Boolean(p.buildingId);
    this.lastSafePositions.set(p.id,{x:p.x,y:p.y,mapId:this.map.id,buildingId:p.buildingId,roomIndex:p.roomIndex,recordedAt:this.now()});
    if(p.ai)this.emitAiPersonaDialogue(p,'dismount',{casual:true,loggable:false,allowResponse:false});
    return true;
  }

  private forceDismountMotorcycle(p:PlayerState,motorcycle:MotorcycleState){
    const point=this.findDismountPoint(p,motorcycle)??this.map.emergencySpawnPoints.find((candidate)=>this.isDismountPositionFree(candidate.x,candidate.y,p.id,motorcycle.id));
    this.cancelThrow(p);
    motorcycle.driverId='';motorcycle.velocityX=0;motorcycle.velocityY=0;motorcycle.speed=0;motorcycle.angularVelocity=0;this.vehicleMotionStates.delete(motorcycle.id);
    p.isDriving=false;p.vehicleId='';p.isSniperScoped=false;
    if(point){p.x=point.x;p.y=point.y;const dismountSpace=spaceAt(point.x,point.y,this.map.buildingVisibilityZones,this.map.rooms,0);p.buildingId=dismountSpace.buildingId;p.roomIndex=dismountSpace.roomIndex;p.insideBuilding=Boolean(p.buildingId);this.lastSafePositions.set(p.id,{x:p.x,y:p.y,mapId:this.map.id,buildingId:p.buildingId,roomIndex:p.roomIndex,recordedAt:this.now()});}
  }

  private isDismountPositionFree(x:number,y:number,playerId:string,vehicleId:string){
    if(!this.isPositionFree(x,y)||buildingIdAt(x,y,0,this.map.buildingVisibilityZones))return false;
    for(const motorcycle of this.state.motorcycles.values())if(motorcycle.id!==vehicleId&&distance(x,y,motorcycle.x,motorcycle.y)<this.vehicleRadius(motorcycle)+PLAYER_BODY_RADIUS+8)return false;
    for(const player of this.state.players.values())if(player.id!==playerId&&player.alive&&player.phase==='landed'&&distance(x,y,player.x,player.y)<PLAYER_SEPARATION_RADIUS*2)return false;
    return true;
  }

  private detachPlayerFromVehicle(p:PlayerState){
    this.cancelThrow(p);
    if(p.vehicleId){const motorcycle=this.state.motorcycles.get(p.vehicleId);if(motorcycle?.driverId===p.id){motorcycle.driverId='';motorcycle.velocityX*=.35;motorcycle.velocityY*=.35;motorcycle.speed=Math.hypot(motorcycle.velocityX,motorcycle.velocityY);motorcycle.angularVelocity=0;this.vehicleMotionStates.delete(motorcycle.id);}}
    p.vehicleId='';p.isDriving=false;p.isSniperScoped=false;
  }

  private pickup(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(!p||p.phase!=='landed'||!p.alive||p.isDriving||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing)return;
    if(this.healUntil.has(p.id))this.cancelHeal(p);
    const now=this.now();
    let pick:LootState|undefined;
    let best=72;
    for(const l of this.state.loot.values()){
      if(l.pickupLockedForPlayerId===p.id&&now<l.pickupLockedUntil)continue;
      if(!spaceInteractionAllowed(p,l,this.map.portals))continue;
      const d=distance(p.x,p.y,l.x,l.y);
      if(d<best){best=d;pick=l;}
    }
    if(!pick)return;
    const kind=pick.kind as LootKind;
    const equippedBefore=p.equipped;
    const result=this.applyLoot(p,kind,pick);
    if(!result.success)return;
    c.send('pickupResult',{kind,equipped:p.equipped,autoEquipped:p.equipped!==equippedBefore&&(kind in WEAPONS||kind in MELEE_WEAPONS||isThrowableType(kind)),droppedKind:result.droppedKind??'',droppedMagazine:result.droppedMagazine??-1});
    this.markOpenArenaLootConsumed(pick.id);
    this.state.loot.delete(pick.id);
    this.lootReservations.delete(pick.id);
  }

  private applyLoot(p:PlayerState,k:LootKind,source?:LootState):{success:boolean;droppedKind?:WeaponId;droppedMagazine?:number}{
    if(this.isExoPart(k)){
      const tactical=this.tacticalInventory(p.id),emp=String(k).startsWith('emp_exo_'),part=String(k).endsWith('_head')?'head':String(k).endsWith('_core')?'core':'limbs';
      if(emp){if(part==='head'){if(tactical.empExoHeadCount>=1)return{success:false};tactical.empExoHeadCount=1;}else if(part==='core'){if(tactical.empExoCoreCount>=1)return{success:false};tactical.empExoCoreCount=1;}else{if(tactical.empExoLimbsCount>=1)return{success:false};tactical.empExoLimbsCount=1;}}
      else if(part==='head'){if(tactical.exoHeadCount>=1)return{success:false};tactical.exoHeadCount=1;}else if(part==='core'){if(tactical.exoCoreCount>=1)return{success:false};tactical.exoCoreCount=1;}else{if(tactical.exoLimbsCount>=1)return{success:false};tactical.exoLimbsCount=1;}
      const complete=this.exoPartCounts(tactical,emp?'emp':'assault').every((count)=>count>0),partName=part==='head'?'머리':part==='core'?'코어 몸통':'팔다리',robotName=emp?'청색 EMP 로봇':'강철 엑소슈트';this.playerClient(p.id)?.send('notice',{type:'success',message:complete?`${robotName} 파츠 완성 · ${emp?'C':'Z'}키로 조립하세요.`:`${robotName} ${partName} 파츠 획득`});return{success:true};
    }
    if(k==='tank_key'){const tactical=this.tacticalInventory(p.id);if(tactical.tankKeyCount>=1)return{success:false};tactical.tankKeyCount=1;this.tankKeyRespawnAt=this.now()+90;this.playerClient(p.id)?.send('notice',{type:'success',message:'탱크 열쇠를 획득했습니다. 이제 중앙 탱크에 탑승할 수 있습니다.'});return{success:true};}
    if(k==='spider_mine'){const tactical=this.tacticalInventory(p.id),amount=Math.max(1,Math.floor(source?.stackCount??SPIDER_MINE_BALANCE.pickupAmount));if(tactical.spiderMineCount>=SPIDER_MINE_BALANCE.maxCarry)return{success:false};tactical.spiderMineCount=Math.min(SPIDER_MINE_BALANCE.maxCarry,tactical.spiderMineCount+amount);return{success:true};}
    if(k==='strip_trap'){const tactical=this.tacticalInventory(p.id),amount=Math.max(1,Math.floor(source?.stackCount??STRIP_TRAP_BALANCE.pickupAmount));if(tactical.stripTrapCount>=STRIP_TRAP_BALANCE.maxCarry)return{success:false};tactical.stripTrapCount=Math.min(STRIP_TRAP_BALANCE.maxCarry,tactical.stripTrapCount+amount);return{success:true};}
    if(k==='hunter_drone'){const tactical=this.tacticalInventory(p.id),amount=Math.max(1,Math.floor(source?.stackCount??1));if(tactical.hunterDroneCount>=4)return{success:false};tactical.hunterDroneCount=Math.min(4,tactical.hunterDroneCount+amount);this.emitAudioEvent('throwable_pickup',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'hunter_drone'},this.playerClient(p.id));return{success:true};}
    if(isThrowableType(k))return this.applyThrowableLoot(p,k,source);
    if(k in WEAPONS&&k!=='fists')return this.applyWeaponLoot(p,k as WeaponId,source);
    if(k in MELEE_WEAPONS){p.melee=k;this.setEquipped(p,k as MeleeId,true);return{success:true};}
    const exactAmmo=source&&source.ammoCount>=0?Math.max(0,Math.floor(source.ammoCount)):undefined;
    if(k==='pistol_ammo')p.pistolAmmo+=exactAmmo??30;
    else if(k==='standard_ammo')p.standardAmmo+=exactAmmo??24;
    else if(k==='shotgun_ammo')p.shotgunAmmo+=exactAmmo??12;
    else if(k==='rocket_ammo')p.rocketAmmo=Math.min(BAZOOKA_BALANCE.maxRocketReserve,p.rocketAmmo+(exactAmmo??BAZOOKA_BALANCE.rocketPickupAmount));
    else if(k==='rail_slug'){const tactical=this.tacticalInventory(p.id);tactical.railSlugAmmo=Math.min(RAILGUN_BALANCE.maxReserve,tactical.railSlugAmmo+(exactAmmo??RAILGUN_BALANCE.pickupAmount));}
    else if(k==='laser_cell'){const tactical=this.tacticalInventory(p.id);tactical.laserCellAmmo=Math.min(LASER_CANNON_BALANCE.maxReserve,tactical.laserCellAmmo+(exactAmmo??LASER_CANNON_BALANCE.pickupAmount));}
    else if(k==='chicken_capsule'){const tactical=this.tacticalInventory(p.id);tactical.chickenCapsuleAmmo=Math.min(CHICKEN_BLASTER_BALANCE.maxReserve,tactical.chickenCapsuleAmmo+(exactAmmo??CHICKEN_BLASTER_BALANCE.pickupAmount));}
    else if(k==='fuel_ammo')p.fuelAmmo=Math.min(FLAMETHROWER_BALANCE.maxFuelReserve,p.fuelAmmo+(exactAmmo??FLAMETHROWER_BALANCE.fuelPickupAmount));
    else if(k==='adhesive_charge'){const tactical=this.tacticalInventory(p.id);tactical.adhesiveCharge=Math.min(ADHESIVE_SPRAYER_BALANCE.maxChargeReserve,tactical.adhesiveCharge+(exactAmmo??ADHESIVE_SPRAYER_BALANCE.chargePickupAmount));}
    else if(k==='silver_bolt'){const tactical=this.tacticalInventory(p.id);tactical.silverBoltAmmo=Math.min(SILVER_CROSSBOW_BALANCE.maxReserve,tactical.silverBoltAmmo+(exactAmmo??1));}
    else if(k==='vest')p.armor=Math.max(p.armor,100);
    else if(k==='bandage')p.bandages=Math.min(5,p.bandages+1);
    else if(k==='medkit')p.medkits=Math.min(2,p.medkits+1);
    return{success:true};
  }

  private applyThrowableLoot(p:PlayerState,type:ThrowableType,source?:LootState):{success:boolean}{
    const amount=Math.max(1,Math.floor(source?.stackCount??1));
    const maximum=THROWABLE_CONFIGS[type].maxCount;
    if(p.throwableType===type){
      if(p.throwableCount>=maximum)return{success:false};
      p.throwableCount=Math.min(maximum,p.throwableCount+amount);
      this.emitAudioEvent('throwable_pickup',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:type},this.playerClient(p.id));
      return{success:true};
    }
    if(p.throwableType&&p.throwableCount>0&&isThrowableType(p.throwableType)){
      const point=this.findSeparatedLootPosition(p.x-Math.cos(p.angle)*42,p.y-Math.sin(p.angle)*42,p.throwableType as LootKind,p.buildingId,p.roomIndex);
      if(!point)return{success:false};
      const drop=new LootState();drop.id=`loot-${++this.lootSeq}`;drop.kind=p.throwableType;drop.stackCount=p.throwableCount;drop.x=point.x;drop.y=point.y;drop.buildingId=p.buildingId;drop.roomIndex=p.roomIndex;drop.pickupLockedForPlayerId=p.id;drop.pickupLockedUntil=this.now()+.85;
      this.state.loot.set(drop.id,drop);
    }
    p.throwableType=type;p.throwableCount=Math.min(maximum,amount);
    p.previousEquipped=isThrowableType(p.equipped)?p.previousEquipped:p.equipped;
    this.cancelReload(p);this.cancelHeal(p);this.setEquipped(p,type,true);
    this.emitAudioEvent('throwable_swap',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:type},this.playerClient(p.id));
    return{success:true};
  }

  private applyWeaponLoot(p:PlayerState,id:WeaponId,source?:LootState):{success:boolean;droppedKind?:WeaponId;droppedMagazine?:number}{
    const weapon=WEAPONS[id];
    if(!weapon||id==='fists')return{success:false};
    const alreadyOwned=p.primary===id||p.secondary===id;
    if(alreadyOwned){
      if(source&&source.weaponMagazine>=0)this.setWeaponMagazine(p,id,Math.max(this.getWeaponMagazine(p,id),source.weaponMagazine),false);
      this.grantWeaponPickupAmmo(p,weapon,source);
      this.setEquipped(p,id,true);
      return{success:true};
    }

    const preferred=weapon.slot==='secondary'?'secondary':'primary';
    const alternate=preferred==='primary'?'secondary':'primary';
    let slot:'primary'|'secondary';
    if(!p[preferred])slot=preferred;
    else if(!p[alternate])slot=alternate;
    else if(p.primary===p.equipped)slot='primary';
    else if(p.secondary===p.equipped)slot='secondary';
    else slot=preferred;

    const outgoing=p[slot] as WeaponId|'';
    let drop:LootState|undefined;
    let droppedMagazine=-1;
    if(outgoing){
      const point=this.findWeaponDropPosition(p,outgoing,source?.id??'');
      if(!point)return{success:false};
      droppedMagazine=this.getWeaponMagazine(p,outgoing);
      drop=new LootState();
      drop.id=`loot-${++this.lootSeq}`;
      drop.kind=outgoing;
      drop.x=point.x;
      drop.y=point.y;
      drop.buildingId=p.buildingId;
      drop.roomIndex=p.roomIndex;
      drop.weaponMagazine=droppedMagazine;
      drop.grantsAmmo=false;
      drop.pickupLockedForPlayerId=p.id;
      drop.pickupLockedUntil=this.now()+.85;
    }

    this.cancelReload(p);
    p.isSniperScoped=false;
    p[slot]=id;
    const incomingMagazine=source&&source.weaponMagazine>=0?source.weaponMagazine:weapon.magazine;
    this.setWeaponMagazine(p,id,incomingMagazine,false);
    this.grantWeaponPickupAmmo(p,weapon,source);
    if(drop)this.state.loot.set(drop.id,drop);
    this.setEquipped(p,id,true);
    return{success:true,droppedKind:outgoing||undefined,droppedMagazine:outgoing?droppedMagazine:undefined};
  }

  private grantWeaponPickupAmmo(p:PlayerState,weapon:(typeof WEAPONS)[WeaponId],source?:LootState){
    if(source&&source.grantsAmmo===false)return;
    if(weapon.ammoType==='pistol_ammo')p.pistolAmmo+=weapon.magazine*2;
    if(weapon.ammoType==='standard_ammo')p.standardAmmo+=weapon.magazine*2;
    if(weapon.ammoType==='shotgun_ammo')p.shotgunAmmo+=weapon.magazine*2;
    if(weapon.ammoType==='rocket_ammo')p.rocketAmmo=Math.min(BAZOOKA_BALANCE.maxRocketReserve,p.rocketAmmo+1);
    if(weapon.ammoType==='rail_slug'){const tactical=this.tacticalInventory(p.id);tactical.railSlugAmmo=Math.min(RAILGUN_BALANCE.maxReserve,tactical.railSlugAmmo+RAILGUN_BALANCE.initialReserve);}
    if(weapon.ammoType==='laser_cell'){const tactical=this.tacticalInventory(p.id);tactical.laserCellAmmo=Math.min(LASER_CANNON_BALANCE.maxReserve,tactical.laserCellAmmo+LASER_CANNON_BALANCE.initialReserve);}
    if(weapon.ammoType==='chicken_capsule'){const tactical=this.tacticalInventory(p.id);tactical.chickenCapsuleAmmo=Math.min(CHICKEN_BLASTER_BALANCE.maxReserve,tactical.chickenCapsuleAmmo+CHICKEN_BLASTER_BALANCE.initialReserve);}
    if(weapon.ammoType==='fuel_ammo')p.fuelAmmo=Math.min(FLAMETHROWER_BALANCE.maxFuelReserve,p.fuelAmmo+FLAMETHROWER_BALANCE.fuelPickupAmount);
    if(weapon.ammoType==='adhesive_charge'){const tactical=this.tacticalInventory(p.id);tactical.adhesiveCharge=Math.min(ADHESIVE_SPRAYER_BALANCE.maxChargeReserve,tactical.adhesiveCharge+ADHESIVE_SPRAYER_BALANCE.chargePickupAmount);}
    if(weapon.ammoType==='silver_bolt'){/* 은빛 무기함의 별도 은화살 보급을 사용한다. */}
  }

  private findWeaponDropPosition(p:PlayerState,kind:WeaponId,ignoreId=''):Point|undefined{
    const valid=(x:number,y:number)=>{
      if(x<40||y<40||x>this.worldWidth-40||y>this.worldHeight-40)return false;
      const space=spaceAt(x,y,this.map.buildingVisibilityZones,this.map.rooms,0);
      if(space.buildingId!==p.buildingId||space.roomIndex!==p.roomIndex)return false;
      if(this.collisionRects().some((rect)=>circleHitsRect(x,y,LOOT_WALL_CLEARANCE,rect)))return false;
      if(this.doorCenters().some((door)=>distance(x,y,door.x,door.y)<LOOT_DOOR_CLEARANCE))return false;
      for(const loot of this.state.loot.values()){
        if(loot.id===ignoreId)continue;
        if(distance(x,y,loot.x,loot.y)<30)return false;
      }
      return true;
    };
    const baseAngle=p.angle+Math.PI;
    for(const radius of [34,46,60,78,104,136,176]){
      for(let index=0;index<12;index++){
        const step=Math.ceil(index/2)*(index%2===0?-1:1);
        const offset=index===0?0:step*Math.PI/12;
        const x=clamp(p.x+Math.cos(baseAngle+offset)*radius,40,this.worldWidth-40);
        const y=clamp(p.y+Math.sin(baseAngle+offset)*radius,40,this.worldHeight-40);
        if(valid(x,y))return{x,y};
      }
    }
    return undefined;
  }

  private switchWeapon(c:Client,m:any){
    const p=this.state.players.get(c.sessionId);
    if(!p||p.isVaulting||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil)return;
    const slot=Number(m?.slot);
    const fusion=this.fusionRobotFor(p);
    if(fusion){
      if(slot<1||slot>4)return;
      fusion.fusionWeaponSlot=Math.floor(slot);p.isSniperScoped=false;this.cancelThrow(p);
      c.send('notice',{type:'info',message:`합체 로봇 ${slot}번 · ${FUSION_ROBOT_WEAPON_NAMES[slot as FusionRobotWeaponSlot]}`});return;
    }
    if(slot===4){
      if(!p.throwableType||p.throwableCount<=0||!isThrowableType(p.throwableType)){c.send('notice',{type:'warning',message:'보유한 투척무기가 없습니다.'});return;}
      this.cancelHeal(p);this.cancelReload(p);this.cancelThrow(p);
      if(!isThrowableType(p.equipped))p.previousEquipped=p.equipped;
      this.setEquipped(p,p.throwableType,true);
      this.emitAudioEvent('throwable_select',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:p.throwableType},this.playerClient(p.id));
      return;
    }
    if(slot<1||slot>3)return;
    this.cancelThrow(p);
    const id=(slot===1?p.primary:slot===2?p.secondary:p.melee||'fists') as EquippedId;
    if(!id||(!(id in WEAPONS)&&!(id in MELEE_WEAPONS)))return;
    this.cancelHeal(p);p.isSniperScoped=false;this.setEquipped(p,id,true);
  }

  private swapWeaponSlots(c:Client,m:any){
    const p=this.state.players.get(c.sessionId);
    if(!p||!p.alive||p.phase!=='landed'||p.isVaulting||Boolean(this.fusionRobotFor(p))||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil)return;
    const from=Number(m?.from),to=Number(m?.to);
    if(!((from===1&&to===2)||(from===2&&to===1))){c.send('notice',{type:'warning',message:'교환 가능한 슬롯은 1번과 2번입니다.'});return;}
    this.cancelHeal(p);this.cancelReload(p);this.cancelThrow(p);p.isSniperScoped=false;
    const primary=p.primary; p.primary=p.secondary; p.secondary=primary;
    this.syncMagazine(p);
    c.send('slotSwapResult',{primary:p.primary,secondary:p.secondary,equipped:p.equipped});
  }

  private dropWeapon(c:Client,m:any){
    const p=this.state.players.get(c.sessionId);
    const slot=Number(m?.slot);
    if(!p||!p.alive||p.phase!=='landed'||p.isSwimming||p.isVaulting||p.isDriving||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil||!(slot===1||slot===2))return;
    const key=slot===1?'primary':'secondary';
    const id=p[key] as WeaponId|'';
    if(!id)return;
    const point=this.findWeaponDropPosition(p,id);
    if(!point){c.send('notice',{type:'warning',message:'주변에 무기를 버릴 공간이 없습니다.'});return;}
    this.cancelHeal(p);this.cancelReload(p);this.cancelThrow(p);p.isSniperScoped=false;
    const loot=new LootState();loot.id=`loot-${++this.lootSeq}`;loot.kind=id;loot.x=point.x;loot.y=point.y;loot.buildingId=p.buildingId;loot.roomIndex=p.roomIndex;loot.weaponMagazine=this.getWeaponMagazine(p,id);loot.grantsAmmo=false;loot.pickupLockedForPlayerId=p.id;loot.pickupLockedUntil=this.now()+.85;
    this.state.loot.set(loot.id,loot);p[key]='';this.setWeaponMagazine(p,id,0,false);
    if(p.equipped===id)this.setEquipped(p,(p.primary||p.secondary||p.melee||'fists') as EquippedId,true);else this.syncMagazine(p);
  }

  private setEquipped(p:PlayerState,id:EquippedId,force=false){
    if(p.equipped!==id)p.isSniperScoped=false;
    if(p.equipped!==id)this.cancelLaserCannonCharge(p);
    if(p.equipped===id){this.syncMagazine(p);return;}
    if(!force&&p.ai&&this.now()<(this.aiSwitchAt.get(p.id)??0))return;
    this.cancelReload(p);
    p.equipped=id;
    this.syncMagazine(p);
    if(p.ai)this.aiSwitchAt.set(p.id,this.now()+.8);
  }

  private throwableCarrier(p:PlayerState):MotorcycleState|undefined|null{
    if(!p.isDriving&&!p.vehicleId)return undefined;
    if(!p.isDriving||!p.vehicleId)return null;
    const motorcycle=this.state.motorcycles.get(p.vehicleId);
    if(!motorcycle||motorcycle.driverId!==p.id||motorcycle.exploding||motorcycle.destroyed)return null;
    return motorcycle;
  }

  private prepareThrow(c:Client){
    const p=this.state.players.get(c.sessionId);
    if(!p||p.ai||!p.alive||p.phase!=='landed'||this.mechanicalActionDisabled(p)||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil||!isThrowableType(p.equipped)||p.throwableType!==p.equipped||p.throwableCount<=0)return;
    const carrier=this.throwableCarrier(p);
    if(carrier===null){this.cancelThrow(p);return;}
    this.cancelHeal(p);this.cancelReload(p);p.isSniperScoped=false;p.isPreparingThrow=true;p.throwCharge=0;this.throwPrepareAt.set(p.id,this.now());
    const source=carrier??p;
    this.emitAudioEvent('throwable_prepare',{sourceId:p.id,x:source.x,y:source.y,buildingId:source.buildingId,variant:p.throwableType},this.playerClient(p.id));
  }

  private cancelThrowForClient(c:Client){const p=this.state.players.get(c.sessionId);if(p)this.cancelThrow(p);}
  private cancelThrow(p:PlayerState){p.isPreparingThrow=false;p.throwCharge=0;this.throwPrepareAt.delete(p.id);}

  private throwEquipped(c:Client,m:any){
    if(this.openArenaRoundLocked())return;
    const p=this.state.players.get(c.sessionId),started=p?this.throwPrepareAt.get(p.id):undefined;
    if(p)this.clearOpenArenaSpawnProtection(p.id);
    if(!p||started===undefined||!p.isPreparingThrow||!p.alive||p.phase!=='landed'||this.mechanicalActionDisabled(p)||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil||!isThrowableType(p.equipped)||p.throwableType!==p.equipped||!isThrowableType(p.throwableType)||p.throwableCount<=0){if(p)this.cancelThrow(p);return;}
    this.throwForPlayer(p,m,clamp((this.now()-started)*1000,0,THROWABLE_MAX_CHARGE_MS));
  }

  private throwForPlayer(p:PlayerState,m:any,heldMs:number){
    if(this.openArenaRoundLocked()||!p.alive||p.phase!=='landed'||this.mechanicalActionDisabled(p)||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil||!isThrowableType(p.throwableType)||p.throwableCount<=0){this.cancelThrow(p);return false;}
    this.clearOpenArenaSpawnProtection(p.id);
    const carrier=this.throwableCarrier(p);
    if(carrier===null){this.cancelThrow(p);return false;}
    const input=this.inputs.get(p.id);const rawAimX=Number(m?.aimX??input?.aimX??Math.cos(p.angle)),rawAimY=Number(m?.aimY??input?.aimY??Math.sin(p.angle));
    const aim=normalizeAimVector(rawAimX,rawAimY)??{x:Math.cos(p.angle),y:Math.sin(p.angle)};
    const source=carrier??p;
    const motion=createThrowableMotion(source.x+aim.x*(PLAYER_BODY_RADIUS+8),source.y+aim.y*(PLAYER_BODY_RADIUS+8),aim.x,aim.y,clamp(heldMs,0,THROWABLE_MAX_CHARGE_MS));
    const object=new ThrownObjectState();object.id=`throwable-${++this.throwableSeq}`;object.ownerId=p.id;object.kind=p.throwableType;object.x=motion.x;object.y=motion.y;object.z=motion.z;object.vx=motion.vx;object.vy=motion.vy;object.vz=motion.vz;object.bounces=0;object.phase='flying';object.spawnedAt=this.now();object.detonateAt=p.throwableType==='fragGrenade'?this.now()+THROWABLE_CONFIGS.fragGrenade.fuseMs/1000:0;object.buildingId=source.buildingId;
    this.state.thrownObjects.set(object.id,object);
    p.throwableCount--;this.cancelThrow(p);
    this.emitAudioEvent('throwable_throw',{sourceId:p.id,x:source.x,y:source.y,buildingId:source.buildingId,variant:object.kind});
    if(p.throwableCount<=0){p.throwableCount=0;p.throwableType='';const previous=p.previousEquipped as EquippedId;if(previous&&(previous in WEAPONS||previous in MELEE_WEAPONS))this.setEquipped(p,previous,true);else this.setEquipped(p,p.melee as EquippedId||'fists',true);}return true;
  }

  private heal(c:Client,m:any){
    const p=this.state.players.get(c.sessionId);
    if(!p)return;
    const requested=m?.kind==='medkit'?'medkit':m?.kind==='bandage'?'bandage':'auto';
    if(!this.beginHeal(p,requested))c.send('notice',{type:'warning',message:p.hp>=this.playerMaxHp(p)?'이미 체력이 가득합니다.':'사용할 회복 아이템이 없습니다.'});
  }

  private beginHeal(p:PlayerState,requested:'auto'|HealKind='auto'){
    p.isSniperScoped=false;this.cancelThrow(p);
    if(!p.alive||p.phase!=='landed'||p.isSwimming||p.isVaulting||this.chickenState(p).chickenTransformed||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing||this.now()<p.werewolf.actionLockedUntil||p.hp>=this.playerMaxHp(p)||this.healUntil.has(p.id))return false;
    const missing=this.playerMaxHp(p)-p.hp;
    let kind:HealKind|''='';
    if(requested==='medkit'&&p.medkits>0)kind='medkit';
    else if(requested==='bandage'&&p.bandages>0)kind='bandage';
    else if(requested==='auto'){
      if(p.medkits>0&&(missing>25||p.bandages<=0))kind='medkit';
      else if(p.bandages>0)kind='bandage';
      else if(p.medkits>0)kind='medkit';
    }
    if(!kind)return false;
    const duration=kind==='medkit'?4:2;
    const amount=kind==='medkit'?60:25;
    const startedAt=this.now();
    this.cancelReload(p);
    this.healUntil.set(p.id,{at:startedAt+duration,startedAt,duration,amount,kind});
    p.healingKind=kind;
    p.healingProgress=0;
    if(p.ai)p.aiState='HEAL';
    this.emitAudioEvent('heal_start',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:kind});
    return true;
  }

  private cancelHeal(p:PlayerState){
    if(!this.healUntil.delete(p.id)&&!p.healingKind)return;
    p.healingKind='';
    p.healingProgress=0;
  }

  private chat(c:Client,m:any){
    const p=this.state.players.get(c.sessionId);
    if(!p||p.muted)return;
    const text=sanitizeText(m?.text,80);
    if(!text)return;
    const now=Date.now();
    if(now-(this.chatAt.get(p.id)??0)<650)return;
    this.chatAt.set(p.id,now);
    const base={playerId:p.id,sender:p.name,nickname:p.name,text,time:now,sentAt:now};
    if(this.state.phase==='LOBBY'){
      this.broadcast('chat',{...base,channel:'lobby'});
      return;
    }
    if(!p.alive){
      for(const cl of this.clients){
        const q=this.state.players.get(cl.sessionId);
        if(q&&!q.alive)cl.send('chat',{...base,channel:'spectator'});
      }
      return;
    }
    for(const cl of this.clients){
      const q=this.state.players.get(cl.sessionId);
      if(q?.alive&&distance(p.x,p.y,q.x,q.y)<=CHAT_RADIUS)cl.send('chat',{...base,channel:'nearby'});
    }
  }

  private tick(dt:number){
    if(this.state.phase==='LOBBY'||this.state.phase==='FINISHED')return;
    if(this.arenaLike()&&this.openArenaLifecycle==='emptyGrace'){this.updateOpenArenaLifecycle();if(String(this.openArenaLifecycle)!=='active')return;}
    if(this.arenaLike()&&this.openArenaRoundState!=='active'){this.state.serverTime=this.now();this.updateOpenArenaRound();this.broadcastOpenArenaScoreboard();if(this.now()-this.registryLastSync>=2){this.registryLastSync=this.now();this.syncRoomRegistry();}return;}
    const tickStarted=performance.now();
    this.elapsed+=dt;
    this.state.serverTime=this.now();
    this.updatePlane(dt);
    if(this.gameMode!=='coreSiege')this.updateWerewolfSeason(dt);
    this.updateExoSuits();
    this.updateChickenTransforms();
    const vehicleStarted=performance.now();
    this.updateMotorcycles(dt);
    this.updateVaults();
    this.state.serverVehicleMs=performance.now()-vehicleStarted;
    const collisionStarted=performance.now();
    this.updatePlayers(dt);
    this.resolvePlayerOverlaps();
    this.updateBuildingStates();
    this.updateBushStates();
    this.updateReloads();
    this.updateHeals();
    this.updateBullets(dt);
    this.updateRockets(dt);
    this.updateFlameJets();
    this.updateAdhesiveJets();
    this.updateStripTraps();
    this.updateSpiderMines(dt);
    this.updateSupplyDrops();
    for(const player of this.state.players.values())if(player.isPreparingThrow){const started=this.throwPrepareAt.get(player.id);player.throwCharge=started===undefined?0:clamp((this.now()-started)*1000/THROWABLE_MAX_CHARGE_MS,0,1);}
    this.updateThrowables(dt);
    this.updateThrowableFields();
    if(this.arenaLike()){this.updateOpenArenaRespawns();this.updateOpenArenaWorld();this.broadcastOpenArenaScoreboard();}
    this.state.serverCollisionMs=performance.now()-collisionStarted;
    const zoneStarted=performance.now();
    if(this.gameMode==='battleRoyale')this.updateZone(dt);
    this.state.serverZoneMs=performance.now()-zoneStarted;
    const aiStarted=performance.now();
    this.updateAiAmbientNoises();this.updateAi(dt);
    this.updateDomination(dt);
    this.updateCoreSiege(dt);
    this.state.serverAiMs=performance.now()-aiStarted;
    this.updateBushStates();
    this.noises=this.noises.filter((n)=>this.now()-n.at<3);
    if(this.gameMode==='battleRoyale')this.finishCheck();
    else this.state.aliveCount=[...this.state.players.values()].filter((player)=>player.alive).length;
    if(this.now()-this.registryLastSync>=2){this.registryLastSync=this.now();this.syncRoomRegistry();}
    this.recordTick(performance.now()-tickStarted);
  }

  private recordTick(duration:number){
    this.tickSamples.push(duration);
    if(this.tickSamples.length>300)this.tickSamples.shift();
    const now=this.now();
    if(now-this.perfLastPublish<.5)return;
    this.perfLastPublish=now;
    const sorted=[...this.tickSamples].sort((a,b)=>a-b);
    const total=sorted.reduce((sum,value)=>sum+value,0);
    this.state.serverTickAvg=sorted.length?total/sorted.length:0;
    this.state.serverTickP95=sorted.length?sorted[Math.min(sorted.length-1,Math.floor(sorted.length*.95))]??0:0;
    this.state.serverTickMax=sorted.at(-1)??0;
  }

  private updateThrowables(dt:number){
    const now=this.now();
    for(const object of [...this.state.thrownObjects.values()]){
      if(object.kind==='spiderMine')continue;
      if(object.kind==='hunterDrone'){
        if(now>=object.detonateAt||this.updateHunterDrone(object,dt)){this.explodeHunterDrone(object);this.state.thrownObjects.delete(object.id);}
        continue;
      }
      if(object.kind==='rcCar'){
        if(now>=object.detonateAt||this.updateBombRcCar(object,dt)){this.explodeBombRcCar(object);this.state.thrownObjects.delete(object.id);}
        continue;
      }
      const type=object.kind as ThrowableType;if(!isThrowableType(type)){this.state.thrownObjects.delete(object.id);continue;}
      const next=stepThrowableMotion({x:object.x,y:object.y,z:object.z,vx:object.vx,vy:object.vy,vz:object.vz,bounces:object.bounces,phase:object.phase as 'flying'|'resting'},dt,this.map,THROWABLE_CONFIGS[type]);
      object.x=next.x;object.y=next.y;object.z=next.z;object.vx=next.vx;object.vy=next.vy;object.vz=next.vz;object.bounces=next.bounces;object.phase=next.phase;object.buildingId=buildingIdAt(object.x,object.y,0,this.map.buildingVisibilityZones);
      if(next.collision!=='none')this.emitAudioEvent('throwable_bounce',{sourceId:object.id,x:next.collisionX,y:next.collisionY,buildingId:object.buildingId,variant:type});
      if(type==='incendiaryGrenade'&&(next.collision!=='none'||next.phase==='resting')){
        if(this.terrainKindAt(object.x,object.y)==='deep-water')this.emitAudioEvent('water_extinguish',{sourceId:object.id,x:object.x,y:object.y,buildingId:'',variant:type});
        else this.spawnFireField(object);
        this.state.thrownObjects.delete(object.id);continue;
      }
      if(type==='smokeGrenade'&&next.phase==='resting'&&object.detonateAt<=0)object.detonateAt=now+SMOKE_TIMING.deployDelayMs/1000;
      if(type==='smokeGrenade'&&object.detonateAt>0&&now>=object.detonateAt){
        if(this.terrainKindAt(object.x,object.y)==='deep-water')this.emitAudioEvent('water_steam',{sourceId:object.id,x:object.x,y:object.y,buildingId:'',variant:type});
        else this.spawnSmokeField(object);
        this.state.thrownObjects.delete(object.id);continue;
      }
      if(type==='fragGrenade'&&now>=object.detonateAt){this.explodeFrag(object);this.state.thrownObjects.delete(object.id);}
    }
  }

  private hunterDroneTarget(object:ThrownObjectState){
    const owner=this.state.players.get(object.ownerId);let best:PlayerState|CoreSiegeMinionState|undefined,bestDistance:number=HUNTER_DRONE_BALANCE.searchRadius;
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed'||target.id===object.ownerId||this.sameCombatTeam(owner,target))continue;
      if((target.buildingId??'')!==(object.buildingId??''))continue;
      const d=distance(object.x,object.y,target.x,target.y);
      if(d>=bestDistance)continue;
      const exposure=explosionExposureMultiplier({x:object.x,y:object.y,buildingId:object.buildingId},target,this.map.visibilityObstacles,this.map.buildingVisibilityZones,PLAYER_HIT_RADIUS);
      if(exposure<=0)continue;
      best=target;bestDistance=d;
    }
    if(this.gameMode==='coreSiege')for(const minion of this.state.coreSiege.minions.values()){
      if(minion.team===owner?.team)continue;
      const d=distance(object.x,object.y,minion.x,minion.y);
      if(d>=bestDistance||this.firstObstacleHitT(object.x,object.y,minion.x,minion.y,10)!==null)continue;
      best=minion;bestDistance=d;
    }
    return best;
  }

  private updateHunterDrone(object:ThrownObjectState,dt:number){
    const target=this.hunterDroneTarget(object);
    const safeDt=clamp(dt,0,.05);
    if(target){
      const desiredAngle=Math.atan2(target.y-object.y,target.x-object.x);
      const currentAngle=Math.atan2(object.vy,object.vx);
      const nextAngle=currentAngle+this.angleDiff(desiredAngle,currentAngle)*clamp(HUNTER_DRONE_BALANCE.turnResponse*safeDt,0,1);
      object.vx=Math.cos(nextAngle)*HUNTER_DRONE_BALANCE.speed;
      object.vy=Math.sin(nextAngle)*HUNTER_DRONE_BALANCE.speed;
      const targetRadius=target instanceof CoreSiegeMinionState?target.radius:PLAYER_HIT_RADIUS;
      if(distance(object.x,object.y,target.x,target.y)<=HUNTER_DRONE_BALANCE.triggerRadius+targetRadius)return true;
    }else{
      const len=Math.max(1,Math.hypot(object.vx,object.vy));
      object.vx=object.vx/len*HUNTER_DRONE_BALANCE.speed*.72;
      object.vy=object.vy/len*HUNTER_DRONE_BALANCE.speed*.72;
    }
    const nextX=clamp(object.x+object.vx*safeDt,12,this.worldSize-12);
    const nextY=clamp(object.y+object.vy*safeDt,12,this.worldHeight-12);
    const hitT=this.firstObstacleHitT(object.x,object.y,nextX,nextY,10);
    if(hitT!==null)return true;
    object.x=nextX;object.y=nextY;object.z=0;object.buildingId=buildingIdAt(object.x,object.y,0,this.map.buildingVisibilityZones);
    return false;
  }

  private explodeHunterDrone(object:ThrownObjectState){
    const now=this.now(),source={x:object.x,y:object.y,buildingId:object.buildingId};
    const explosion=new ExplosionState();explosion.id=`explosion-${++this.explosionSeq}`;explosion.x=object.x;explosion.y=object.y;explosion.radius=HUNTER_DRONE_BALANCE.effectRadius;explosion.startedAt=now;explosion.duration=.45;explosion.sourceId=object.id;explosion.ownerId=object.ownerId;explosion.kind='hunterDrone';explosion.attackerId=object.ownerId;explosion.weaponType='hunterDrone';explosion.vehicleDamage=HUNTER_DRONE_BALANCE.maxVehicleDamage;explosion.structureDamage=10;explosion.buildingId=object.buildingId;this.state.explosions.set(explosion.id,explosion);
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed')continue;
      const d=distance(object.x,object.y,target.x,target.y),raw=hunterDronePlayerDamage(d);if(raw<=0)continue;
      const exposure=explosionExposureMultiplier(source,target,this.map.visibilityObstacles,this.map.buildingVisibilityZones,PLAYER_HIT_RADIUS);if(exposure<=0)continue;
      this.damage(target,raw,object.ownerId,'추적폭탄',Math.max(0,90*(1-d/HUNTER_DRONE_BALANCE.effectRadius)),Math.atan2(target.y-object.y,target.x-object.x),'explosion');
    }
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed)continue;
      const d=distance(object.x,object.y,vehicle.x,vehicle.y),raw=hunterDroneVehicleDamage(d);if(raw<=0)continue;
      const exposure=explosionExposureMultiplier(source,vehicle,this.map.visibilityObstacles,this.map.buildingVisibilityZones,this.vehicleRadius(vehicle));
      if(exposure>0)this.damageMotorcycle(vehicle,raw,object.ownerId,'추적폭탄');
    }
    if(this.gameMode==='coreSiege')this.damageCoreSiegeMinionsInRadius(object.x,object.y,HUNTER_DRONE_BALANCE.effectRadius,58,object.ownerId,.6);
    this.damageCoreSiegeStructuresInRadius(object.x,object.y,HUNTER_DRONE_BALANCE.effectRadius,10,object.ownerId);
    this.emitAudioEvent('frag_explosion',{sourceId:object.id,ownerId:object.ownerId,x:object.x,y:object.y,buildingId:object.buildingId,radius:HUNTER_DRONE_BALANCE.effectRadius});
  }

  private explodeFrag(object:ThrownObjectState){
    const now=this.now(),source={x:object.x,y:object.y,buildingId:object.buildingId};
    const explosion=new ExplosionState();explosion.id=`explosion-${++this.explosionSeq}`;explosion.x=object.x;explosion.y=object.y;explosion.radius=THROWABLE_CONFIGS.fragGrenade.effectRadius;explosion.startedAt=now;explosion.duration=.65;explosion.sourceId=object.id;explosion.ownerId=object.ownerId;explosion.kind='fragGrenade';explosion.attackerId=object.ownerId;explosion.weaponType='fragGrenade';explosion.vehicleDamage=fragVehicleDamage(0);explosion.structureDamage=35;explosion.buildingId=object.buildingId;this.state.explosions.set(explosion.id,explosion);
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed')continue;const d=distance(object.x,object.y,target.x,target.y);const raw=fragPlayerDamage(d);if(raw<=0)continue;
      const exposure=explosionExposureMultiplier(source,target,this.map.visibilityObstacles,this.map.buildingVisibilityZones,PLAYER_HIT_RADIUS);if(exposure<=0)continue;
      this.damage(target,raw,object.ownerId,'파편 수류탄',Math.max(0,220*(1-d/180)),Math.atan2(target.y-object.y,target.x-object.x));
    }
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed)continue;const d=distance(object.x,object.y,vehicle.x,vehicle.y);const raw=fragVehicleDamage(d);if(raw<=0)continue;
      const exposure=explosionExposureMultiplier(source,vehicle,this.map.visibilityObstacles,this.map.buildingVisibilityZones,this.vehicleRadius(vehicle));if(exposure>0)this.damageMotorcycle(vehicle,raw,object.ownerId,'파편 수류탄');
    }
    this.damageCoreSiegeStructuresInRadius(object.x,object.y,THROWABLE_CONFIGS.fragGrenade.effectRadius,35,object.ownerId);
    this.emitAudioEvent('frag_explosion',{sourceId:object.id,ownerId:object.ownerId,x:object.x,y:object.y,buildingId:object.buildingId,radius:180});
  }

  private spawnSmokeField(object:ThrownObjectState){
    const now=this.now(),field=new SmokeFieldState();field.id=`smoke-${++this.smokeSeq}`;field.ownerId=object.ownerId;field.x=object.x;field.y=object.y;field.maxRadius=smokeRadiusForBushes(this.map.bushes);field.radius=0;field.startedAt=now;field.expiresAt=now+(SMOKE_TIMING.growMs+SMOKE_TIMING.holdMs+SMOKE_TIMING.fadeMs)/1000;field.buildingId=object.buildingId;this.state.smokeFields.set(field.id,field);
    this.emitAudioEvent('smoke_deploy',{sourceId:field.id,ownerId:field.ownerId,x:field.x,y:field.y,buildingId:field.buildingId,radius:field.maxRadius});
  }

  private spawnFireField(object:ThrownObjectState){
    const now=this.now(),field=new FireFieldState();field.id=`fire-${++this.fireSeq}`;field.ownerId=object.ownerId;field.x=object.x;field.y=object.y;field.radius=THROWABLE_CONFIGS.incendiaryGrenade.effectRadius;field.startedAt=now;field.expiresAt=now+FIRE_TIMING.durationMs/1000;field.nextTickAt=now+FIRE_TIMING.tickMs/1000;field.buildingId=object.buildingId;this.state.fireFields.set(field.id,field);
    for(const target of this.state.players.values())if(target.alive&&fireFieldContains(field,target,this.map.buildingVisibilityZones))this.damage(target,FIRE_TIMING.playerInitialDamage,object.ownerId,'화염탄',0,Math.atan2(target.y-field.y,target.x-field.x));
    for(const vehicle of this.state.motorcycles.values())if(!vehicle.destroyed&&fireFieldContains(field,vehicle,this.map.buildingVisibilityZones))this.damageMotorcycle(vehicle,FIRE_TIMING.vehicleInitialDamage,object.ownerId,'화염탄');
    this.damageCoreSiegeStructuresInRadius(field.x,field.y,field.radius,10,field.ownerId,.25);
    this.emitAudioEvent('fire_ignite',{sourceId:field.id,ownerId:field.ownerId,x:field.x,y:field.y,buildingId:field.buildingId,radius:field.radius});
  }

  private updateThrowableFields(){
    const now=this.now();
    for(const field of [...this.state.smokeFields.values()]){field.radius=smokeRadiusAt(now*1000,field.startedAt*1000,field.maxRadius);if(now>=field.expiresAt)this.state.smokeFields.delete(field.id);}
    for(const field of [...this.state.fireFields.values()])if(now>=field.expiresAt)this.state.fireFields.delete(field.id);
    if(now<this.nextFireTickAt)return;this.nextFireTickAt=now+FIRE_TIMING.tickMs/1000;
    const fields=[...this.state.fireFields.values()];
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed')continue;const field=fields.find((candidate)=>fireFieldContains(candidate,target,this.map.buildingVisibilityZones));if(field)this.damage(target,FIRE_TIMING.playerTickDamage,field.ownerId,'화염탄',0,Math.atan2(target.y-field.y,target.x-field.x));
    }
    const vehicleTick=FIRE_TIMING.vehicleDamagePerSecond*(FIRE_TIMING.tickMs/1000);
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed)continue;const field=fields.find((candidate)=>fireFieldContains(candidate,vehicle,this.map.buildingVisibilityZones));if(field)this.damageMotorcycle(vehicle,vehicleTick,field.ownerId,'화염탄');
    }
    for(const field of fields)this.damageCoreSiegeStructuresInRadius(field.x,field.y,field.radius,3,field.ownerId,.25);
  }

  private updatePlane(_dt:number){
    if(!['PLANE','DROP'].includes(this.state.phase))return;
    this.state.planeProgress=clamp(this.elapsed/(PLANE_DURATION/this.map.planeSpeed),0,1);
    this.state.planeX=this.planeStart.x+(this.planeEnd.x-this.planeStart.x)*this.state.planeProgress;
    this.state.planeY=this.planeStart.y+(this.planeEnd.y-this.planeStart.y)*this.state.planeProgress;
    for(const p of this.state.players.values()){
      if(p.phase==='plane'){
        p.x=this.state.planeX;
        p.y=this.state.planeY;
        if(p.ai&&this.elapsed>=(this.aiThinkAt.get(p.id)??8))this.doJump(p);
        if(this.state.planeProgress>=1)this.doJump(p);
      }
    }
  }

  private selectMotorcycleSpawns(){
    const candidates=[...this.map.motorcycleSpawns];
    if(this.gameMode==='domination'){
      return[
        {id:'dom-bike-blue-1',x:this.worldSize*.14,y:this.worldSize*.36,rotation:0},
        {id:'dom-bike-blue-2',x:this.worldSize*.14,y:this.worldSize*.64,rotation:0},
        {id:'dom-bike-red-1',x:this.worldSize*.86,y:this.worldSize*.36,rotation:Math.PI},
        {id:'dom-bike-red-2',x:this.worldSize*.86,y:this.worldSize*.64,rotation:Math.PI},
      ];
    }
    const budget=Math.min(candidates.length,Math.max(0,this.map.motorcycleBudget??candidates.length));
    if(budget>=candidates.length)return candidates;
    const shuffled=(items:typeof candidates)=>{
      const result=[...items];
      for(let index=result.length-1;index>0;index--){const swap=Math.floor(this.lootRandom()*(index+1));[result[index],result[swap]]=[result[swap]!,result[index]!];}
      return result;
    };
    if(this.map.id!=='dock8')return shuffled(candidates).slice(0,budget);
    const sideOf=(spawn:typeof candidates[number])=>spawn.id.includes('-west-')?'west' as const:'east' as const;
    const west=shuffled(candidates.filter((spawn)=>sideOf(spawn)==='west'));
    const east=shuffled(candidates.filter((spawn)=>sideOf(spawn)==='east'));
    const selected=[...west.slice(0,3),...east.slice(0,3)];
    const sideCount={west:3,east:3};
    if(!selected.some((spawn)=>spawn.id.includes('-central-'))){
      const central=shuffled(candidates.filter((spawn)=>spawn.id.includes('-central-')&&!selected.some((chosen)=>chosen.id===spawn.id))).find((spawn)=>sideCount[sideOf(spawn)]<4);
      if(central){selected.push(central);sideCount[sideOf(central)]++;}
    }
    const remaining=shuffled(candidates.filter((spawn)=>!selected.some((chosen)=>chosen.id===spawn.id)));
    for(const candidate of remaining){
      if(selected.length>=budget)break;
      const side=sideOf(candidate);
      if(sideCount[side]>=4)continue;
      selected.push(candidate);sideCount[side]++;
    }
    return selected.slice(0,budget);
  }

  private spawnMotorcycles(){
    this.state.motorcycles.clear();
    this.vehicleCollisionAt.clear();
    this.vehicleStuckStates.clear();
    if(this.arenaLike())this.arenaVehicleSlots.clear();
    const selectedSpawns=this.selectMotorcycleSpawns();
    for(const spawn of selectedSpawns){
      const point=this.findNearestVehiclePoint(spawn.x,spawn.y,this.gameMode==='domination'?620:260);
      if(!point)continue;
      const motorcycle=new MotorcycleState();
      motorcycle.id=spawn.id;
      motorcycle.x=point.x;
      motorcycle.y=point.y;
      motorcycle.rotation=spawn.rotation;
      motorcycle.lastSafeX=point.x;
      motorcycle.lastSafeY=point.y;
      motorcycle.hp=MOTORCYCLE_DESTRUCTION_BALANCE.maxHp;
      motorcycle.maxHp=MOTORCYCLE_DESTRUCTION_BALANCE.maxHp;
      motorcycle.buildingId=buildingIdAt(point.x,point.y,0,this.map.buildingVisibilityZones);
      this.state.motorcycles.set(motorcycle.id,motorcycle);
      this.vehicleStuckStates.set(motorcycle.id,{lastX:point.x,lastY:point.y,stuckFor:0,lastRecoveryAt:-99});
      if(this.arenaLike())this.arenaVehicleSlots.set(spawn.id,{slotId:`arena-vehicle-slot-${spawn.id}`,spawnId:spawn.id,x:spawn.x,y:spawn.y,rotation:spawn.rotation,currentVehicleId:motorcycle.id,respawnAt:0,generation:0});
    }
    this.spawnCenterTank();
  }

  private spawnCenterTank(){
    if(this.gameMode==='domination'){
      for(const side of [{id:'blue',x:.24,rotation:0},{id:'red',x:.76,rotation:Math.PI}]){
        const point=this.findNearestVehiclePoint(this.worldSize*side.x,this.worldSize*.5,520,MOTORCYCLE_RADIUS+22);if(!point)continue;
        const tank=new MotorcycleState();tank.id=`domination-tank-${side.id}`;tank.vehicleKind='tank';tank.x=point.x;tank.y=point.y;tank.rotation=side.rotation;tank.lastSafeX=point.x;tank.lastSafeY=point.y;tank.hp=TANK_BALANCE.maxHp;tank.maxHp=TANK_BALANCE.maxHp;tank.tankShells=TANK_BALANCE.cannonShells;tank.buildingId=buildingIdAt(point.x,point.y,0,this.map.buildingVisibilityZones);this.state.motorcycles.set(tank.id,tank);this.vehicleStuckStates.set(tank.id,{lastX:point.x,lastY:point.y,stuckFor:0,lastRecoveryAt:-99});
      }
      return;
    }
    const point=this.findNearestVehiclePoint(this.worldSize/2,this.worldSize/2,520);
    if(!point)return;
    const tank=new MotorcycleState();
    tank.id='center-tank';
    tank.vehicleKind='tank';
    tank.x=point.x;tank.y=point.y;tank.rotation=0;tank.lastSafeX=point.x;tank.lastSafeY=point.y;
    tank.hp=TANK_BALANCE.maxHp;tank.maxHp=TANK_BALANCE.maxHp;tank.tankShells=TANK_BALANCE.cannonShells;
    tank.buildingId=buildingIdAt(point.x,point.y,0,this.map.buildingVisibilityZones);
    this.state.motorcycles.set(tank.id,tank);
    this.vehicleStuckStates.set(tank.id,{lastX:point.x,lastY:point.y,stuckFor:0,lastRecoveryAt:-99});
  }

  private isVehiclePositionFree(x:number,y:number,ignoreId='',requestedRadius?:number){
    if(!Number.isFinite(x)||!Number.isFinite(y))return false;
    const ignored=ignoreId?this.state.motorcycles.get(ignoreId):undefined,radius=requestedRadius??(ignored?this.vehicleRadius(ignored):MOTORCYCLE_RADIUS);
    if(x<radius||y<radius||x>this.worldWidth-radius||y>this.worldHeight-radius)return false;
    if(this.collisionRects().some((rect)=>circleHitsRect(x,y,radius,rect)))return false;
    if(this.map.buildingVisibilityZones.some((zone)=>circleHitsRect(x,y,radius+3,zone.roof)))return false;
    const terrain=this.terrainKindAt(x,y);
    if(terrain==='deep-water'||terrain==='ford')return false;
    if(!motorcycleCanOccupyWaterPosition(x,y,this.map.rivers,this.map.landCrossings))return false;
    for(const other of this.state.motorcycles.values()){
      if(other.id===ignoreId)continue;
      if(distance(x,y,other.x,other.y)<radius+this.vehicleRadius(other)+8)return false;
    }
    return true;
  }

  private findNearestVehiclePoint(x:number,y:number,maxRadius=320,vehicleRadius=MOTORCYCLE_RADIUS):Point|undefined{
    if(this.isVehiclePositionFree(x,y,'',vehicleRadius))return{x,y};
    for(const radius of [40,72,104,144,192,256,maxRadius]){
      for(let index=0;index<16;index++){
        const angle=index/16*Math.PI*2;
        const candidate={x:clamp(x+Math.cos(angle)*radius,vehicleRadius,this.worldWidth-vehicleRadius),y:clamp(y+Math.sin(angle)*radius,vehicleRadius,this.worldHeight-vehicleRadius)};
        if(this.isVehiclePositionFree(candidate.x,candidate.y,'',vehicleRadius))return candidate;
      }
    }
    return this.map.emergencySpawnPoints.find((point)=>this.isVehiclePositionFree(point.x,point.y,'',vehicleRadius));
  }

  private playerClearOfMotorcycles(x:number,y:number,ignoreVehicleId=''){
    for(const motorcycle of this.state.motorcycles.values()){
      if(motorcycle.id===ignoreVehicleId)continue;
      if(distance(x,y,motorcycle.x,motorcycle.y)<PLAYER_BODY_RADIUS+this.vehicleRadius(motorcycle)-3)return false;
    }
    return true;
  }

  private updateMotorcycles(dt:number){
    const now=this.now();
    const approach=(value:number,target:number,maxDelta:number)=>value<target?Math.min(target,value+maxDelta):Math.max(target,value-maxDelta);
    const removeIds:string[]=[];
    for(const motorcycle of this.state.motorcycles.values()){
      if(motorcycle.huntMarkUntil>0&&motorcycle.huntMarkUntil<=now){motorcycle.huntMarkedBy='';motorcycle.huntMarkUntil=0;}
      if(motorcycle.destroyed){
        if(now-motorcycle.destroyedAt>=MOTORCYCLE_DESTRUCTION_BALANCE.destroyedFadeMs/1000)removeIds.push(motorcycle.id);
        continue;
      }
      if(motorcycle.exploding){
        motorcycle.velocityX=approach(motorcycle.velocityX,0,MOTORCYCLE_DIRECT_DECELERATION*dt);
        motorcycle.velocityY=approach(motorcycle.velocityY,0,MOTORCYCLE_DIRECT_DECELERATION*dt);
        motorcycle.speed=Math.hypot(motorcycle.velocityX,motorcycle.velocityY);
        motorcycle.angularVelocity=0;
        if(now>=motorcycle.explosionAt)this.explodeMotorcycle(motorcycle);
        continue;
      }
      const slow=this.syncVehicleSlowState(motorcycle,now);
      const driver=motorcycle.driverId?this.state.players.get(motorcycle.driverId):undefined;
      if(!driver?.alive||driver.phase!=='landed'||driver.vehicleId!==motorcycle.id){
        if(driver){driver.isDriving=false;driver.vehicleId='';driver.isSniperScoped=false;}
        motorcycle.driverId='';
        motorcycle.velocityX=approach(motorcycle.velocityX,0,MOTORCYCLE_DIRECT_DECELERATION*dt);
        motorcycle.velocityY=approach(motorcycle.velocityY,0,MOTORCYCLE_DIRECT_DECELERATION*dt);
        motorcycle.speed=Math.hypot(motorcycle.velocityX,motorcycle.velocityY);
        motorcycle.angularVelocity=0;
        motorcycle.buildingId=buildingIdAt(motorcycle.x,motorcycle.y,0,this.map.buildingVisibilityZones);
        this.vehicleMotionStates.delete(motorcycle.id);
        continue;
      }
      if(motorcycle.empDisabledUntil>0&&now>=motorcycle.empDisabledUntil)motorcycle.empDisabledUntil=0;
      if(now<motorcycle.empDisabledUntil){
        motorcycle.velocityX=0;motorcycle.velocityY=0;motorcycle.speed=0;motorcycle.angularVelocity=0;driver.x=motorcycle.x;driver.y=motorcycle.y;driver.isSniperScoped=false;
        const motion=this.vehicleMotionStates.get(motorcycle.id);if(motion){motion.movementHeldMs=0;motion.previousInputX=0;motion.previousInputY=0;}
        continue;
      }
      const input=this.inputs.get(driver.id)??{x:0,y:0,aimX:Math.cos(driver.angle),aimY:Math.sin(driver.angle),angle:driver.angle,seq:0,aiming:false,huntSprint:false,accelerate:false,brake:false,turnLeft:false,turnRight:false};
      driver.angle=input.angle;
      const beforeX=motorcycle.x,beforeY=motorcycle.y;
      const normalizedInput=normalizeMovementInput(input.x,input.y);
      const inputLength=Math.hypot(normalizedInput.x,normalizedInput.y);
      const moveX=normalizedInput.x;
      const moveY=normalizedInput.y;
      const motion=this.vehicleMotionStates.get(motorcycle.id)??{movementHeldMs:0,previousInputX:0,previousInputY:0,mountedAt:now,directionPenaltyUntil:-99};
      const requestedMove=inputLength>.001;

      if(requestedMove){
        const previousLength=Math.hypot(motion.previousInputX,motion.previousInputY);
        if(previousLength>.001){
          const previousAngle=Math.atan2(motion.previousInputY,motion.previousInputX);
          const nextAngle=Math.atan2(moveY,moveX);
          const change=Math.abs(this.angleDiff(nextAngle,previousAngle));
          const baseRetention=motorcycleDirectionRetention(change);
          const retained=1-(1-baseRetention)*slow.steeringMultiplier;
          if(retained<1){
            motorcycle.velocityX*=retained;
            motorcycle.velocityY*=retained;
            motion.movementHeldMs*=retained<=.5?.2:retained<=.72?.48:.76;
            motion.directionPenaltyUntil=now+MOTORCYCLE_BALANCE.directionChangePenaltyMs/1000;
          }
        }
        motion.movementHeldMs=Math.min(MOTORCYCLE_BALANCE.timeToMaxSpeedMs,motion.movementHeldMs+dt*1000);
        motion.previousInputX=moveX;
        motion.previousInputY=moveY;
      }else{
        motion.movementHeldMs=0;
        motion.previousInputX=0;
        motion.previousInputY=0;
      }

      const baseTargetSpeed=requestedMove?Math.max(MOTORCYCLE_LAUNCH_SPEED,PLAYER_SPEED*motorcycleSpeedMultiplier(motion.movementHeldMs)):0;
      const isTank=motorcycle.vehicleKind==='tank',isFusion=motorcycle.vehicleKind==='fusion_robot';
      const vehicleSpeedMultiplier=isTank?TANK_BALANCE.speedMultiplier:isFusion?FUSION_ROBOT_BALANCE.speedMultiplier:1;
      const vehicleAccelerationMultiplier=isTank?TANK_BALANCE.accelerationMultiplier:isFusion?FUSION_ROBOT_BALANCE.accelerationMultiplier:1;
      const targetSpeed=baseTargetSpeed*slow.speedMultiplier*vehicleSpeedMultiplier;
      const currentSpeed=Math.hypot(motorcycle.velocityX,motorcycle.velocityY);
      const currentDirection=currentSpeed>1?{x:motorcycle.velocityX/currentSpeed,y:motorcycle.velocityY/currentSpeed}:{x:moveX,y:moveY};
      const directionDot=requestedMove?currentDirection.x*moveX+currentDirection.y*moveY:1;
      const steeringFactor=requestedMove&&directionDot<.985?slow.steeringMultiplier:1;
      const acceleration=(requestedMove?MOTORCYCLE_DIRECT_ACCELERATION*slow.accelerationMultiplier*steeringFactor:MOTORCYCLE_DIRECT_DECELERATION)*vehicleAccelerationMultiplier;
      motorcycle.velocityX=approach(motorcycle.velocityX,moveX*targetSpeed,acceleration*dt);
      motorcycle.velocityY=approach(motorcycle.velocityY,moveY*targetSpeed,acceleration*dt);

      const impactVX=motorcycle.velocityX,impactVY=motorcycle.velocityY,impactSpeed=Math.hypot(impactVX,impactVY);
      let xBlocked=false,yBlocked=false;
      const nextX=motorcycle.x+motorcycle.velocityX*dt;
      if(this.isVehiclePositionFree(nextX,motorcycle.y,motorcycle.id))motorcycle.x=nextX;
      else{xBlocked=true;motorcycle.velocityX=0;motorcycle.velocityY*=.74;}
      const nextY=motorcycle.y+motorcycle.velocityY*dt;
      if(this.isVehiclePositionFree(motorcycle.x,nextY,motorcycle.id))motorcycle.y=nextY;
      else{yBlocked=true;motorcycle.velocityY=0;motorcycle.velocityX*=.74;}
      if(xBlocked||yBlocked){
        motion.movementHeldMs*=xBlocked&&yBlocked ? .25 : .58;
        motion.directionPenaltyUntil=now+MOTORCYCLE_BALANCE.directionChangePenaltyMs/1000;
        if(now-(this.vehicleWallDamageAt.get(motorcycle.id)??-99)>=MOTORCYCLE_DESTRUCTION_BALANCE.wallCollisionDamageCooldownMs/1000){
          const dominantX=Math.abs(impactVX)>=Math.abs(impactVY);
          const frontal=(xBlocked&&yBlocked)||(xBlocked&&dominantX)||(yBlocked&&!dominantX);
          const durabilityDamage=motorcycleWallCollisionDamage(impactSpeed,MOTORCYCLE_MAX_SPEED,frontal);
          if(durabilityDamage>0){this.vehicleWallDamageAt.set(motorcycle.id,now);this.damageMotorcycle(motorcycle,durabilityDamage,'','벽 충돌');}
        }
      }
      if(motorcycle.exploding)continue;

      const actualSpeed=Math.hypot(motorcycle.velocityX,motorcycle.velocityY);
      const previousRotation=motorcycle.rotation;
      if(actualSpeed>8){
        const targetRotation=Math.atan2(motorcycle.velocityY,motorcycle.velocityX);
        const rotationFactor=1-Math.exp(-MOTORCYCLE_ROTATION_RESPONSE*slow.steeringMultiplier*dt);
        motorcycle.rotation+=this.angleDiff(targetRotation,motorcycle.rotation)*rotationFactor;
      }
      motorcycle.angularVelocity=dt>0?this.angleDiff(motorcycle.rotation,previousRotation)/dt:0;
      motorcycle.speed=actualSpeed;
      motorcycle.buildingId=buildingIdAt(motorcycle.x,motorcycle.y,0,this.map.buildingVisibilityZones);
      if(this.isVehiclePositionFree(motorcycle.x,motorcycle.y,motorcycle.id)){
        motorcycle.lastSafeX=motorcycle.x;motorcycle.lastSafeY=motorcycle.y;
      }

      const stuck=this.vehicleStuckStates.get(motorcycle.id)??{lastX:motorcycle.x,lastY:motorcycle.y,stuckFor:0,lastRecoveryAt:-99};
      const progress=distance(beforeX,beforeY,motorcycle.x,motorcycle.y);
      stuck.stuckFor=requestedMove&&progress<.5?stuck.stuckFor+dt:Math.max(0,stuck.stuckFor-dt*2);
      if((!this.isVehiclePositionFree(motorcycle.x,motorcycle.y,motorcycle.id)||stuck.stuckFor>1.7)&&now-stuck.lastRecoveryAt>1.5){
        const point=this.isVehiclePositionFree(motorcycle.lastSafeX,motorcycle.lastSafeY,motorcycle.id)?{x:motorcycle.lastSafeX,y:motorcycle.lastSafeY}:this.findNearestVehiclePoint(motorcycle.x,motorcycle.y,360);
        if(point){motorcycle.x=point.x;motorcycle.y=point.y;motorcycle.velocityX=0;motorcycle.velocityY=0;motorcycle.speed=0;motorcycle.angularVelocity=0;motion.movementHeldMs=0;motion.previousInputX=0;motion.previousInputY=0;stuck.stuckFor=0;stuck.lastRecoveryAt=now;this.state.vehicleRecoveryCount++;const client=this.clients.find((candidate)=>candidate.sessionId===driver.id);client?.send('vehicleRecovery',{x:point.x,y:point.y});}
      }
      stuck.lastX=motorcycle.x;stuck.lastY=motorcycle.y;this.vehicleStuckStates.set(motorcycle.id,stuck);
      this.vehicleMotionStates.set(motorcycle.id,motion);
      driver.x=motorcycle.x;driver.y=motorcycle.y;
      const speedRatio=clamp(actualSpeed/MOTORCYCLE_MAX_SPEED,0,1);
      if(speedRatio>MOTORCYCLE_SCOPE_SPEED_RATIO||requestedMove)driver.isSniperScoped=false;
      this.applyMotorcycleCollisions(motorcycle,driver,now);
    }
    for(const id of removeIds){this.markOpenArenaVehicleDestroyed(id);this.state.motorcycles.delete(id);this.vehicleStuckStates.delete(id);this.vehicleMotionStates.delete(id);this.vehicleWallDamageAt.delete(id);this.vehicleAttackerAt.delete(id);this.tankCannonAt.delete(id);this.tankEmptyNoticeAt.delete(id);this.vehicleStatus.deleteVehicle(id);this.adhesiveExposure.delete(id);}
    for(const [key,time] of this.vehicleCollisionAt)if(now-time>3)this.vehicleCollisionAt.delete(key);
    for(const [key,record] of this.vehicleShotDamage)if(now>record.expiresAt)this.vehicleShotDamage.delete(key);
    for(const [id,explosion] of this.state.explosions)if(now-explosion.startedAt>explosion.duration)this.state.explosions.delete(id);
  }

  private applyMotorcycleCollisions(motorcycle:MotorcycleState,driver:PlayerState,now:number){
    const absoluteSpeed=Math.hypot(motorcycle.velocityX,motorcycle.velocityY);
    const motion=this.vehicleMotionStates.get(motorcycle.id);
    if(motion&&now-motion.mountedAt<MOTORCYCLE_BALANCE.mountCollisionGraceMs/1000)return;
    if(absoluteSpeed<MOTORCYCLE_MAX_SPEED*MOTORCYCLE_BALANCE.collisionDamageMinSpeedRatio)return;
    const forwardX=motorcycle.velocityX/absoluteSpeed,forwardY=motorcycle.velocityY/absoluteSpeed;
    const travelAngle=Math.atan2(forwardY,forwardX);
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed'||target.id===driver.id||target.isDriving||this.sameCombatTeam(driver,target))continue;
      const dx=target.x-motorcycle.x,dy=target.y-motorcycle.y,d=Math.hypot(dx,dy)||1;
      if(d>this.vehicleRadius(motorcycle)+PLAYER_HIT_RADIUS+8)continue;
      if((dx/d)*forwardX+(dy/d)*forwardY<.18)continue;
      const key=`${motorcycle.id}:${target.id}`;
      if(now-(this.vehicleCollisionAt.get(key)??-99)<MOTORCYCLE_COLLISION_COOLDOWN)continue;
      const damage=motorcycleCollisionDamage(absoluteSpeed,MOTORCYCLE_MAX_SPEED,false);
      if(damage<=0)continue;
      this.vehicleCollisionAt.set(key,now);
      const ratio=clamp(absoluteSpeed/MOTORCYCLE_MAX_SPEED,0,1);
      this.damage(target,damage,driver.id,'오토바이',130+ratio*235,travelAngle);
      const vehicleDamage=motorcyclePlayerCollisionDamage(absoluteSpeed,MOTORCYCLE_MAX_SPEED);
      if(vehicleDamage>0)this.damageMotorcycle(motorcycle,vehicleDamage,driver.id,'플레이어 충돌');
      const retained=ratio>=.8?.38:ratio>=.6?.56:.8;
      motorcycle.velocityX*=retained;
      motorcycle.velocityY*=retained;
      motorcycle.speed=Math.hypot(motorcycle.velocityX,motorcycle.velocityY);
      if(motion){motion.movementHeldMs*=retained;motion.directionPenaltyUntil=now+MOTORCYCLE_BALANCE.directionChangePenaltyMs/1000;}
    }
  }

  private damageMotorcycle(motorcycle:MotorcycleState,amount:number,attackerId:string,reason:string){
    if(motorcycle.destroyed||motorcycle.exploding||amount<=0)return 0;
    const attacker=this.state.players.get(attackerId),driver=this.state.players.get(motorcycle.driverId);
    if(this.sameCombatTeam(attacker,driver))return 0;
    const durabilityScale=motorcycle.vehicleKind==='tank'&&!reason.includes('대전차') ? .42 : 1;
    const applied=Math.min(motorcycle.hp,Math.max(0,amount*durabilityScale));
    if(applied<=0)return 0;
    const wasCritical=motorcycle.critical;
    motorcycle.hp=Math.max(0,motorcycle.hp-applied);
    motorcycle.lastDamagedAt=this.now();
    if(attackerId){motorcycle.lastDamagedBy=attackerId;this.vehicleAttackerAt.set(motorcycle.id,this.now());}
    motorcycle.critical=motorcycle.hp<=motorcycle.maxHp*MOTORCYCLE_DESTRUCTION_BALANCE.criticalHpRatio;
    this.emitAudioEvent(reason.includes('충돌')?'motorcycle_collision':'motorcycle_hit',{sourceId:motorcycle.id,x:motorcycle.x,y:motorcycle.y,buildingId:motorcycle.buildingId,variant:reason});
    if(motorcycle.critical&&!wasCritical)this.emitAudioEvent('motorcycle_critical',{sourceId:motorcycle.id,x:motorcycle.x,y:motorcycle.y,buildingId:motorcycle.buildingId});
    if(motorcycle.critical&&!wasCritical&&motorcycle.driverId){
      this.clients.find((client)=>client.sessionId===motorcycle.driverId)?.send('notice',{type:'warning',message:'오토바이가 심하게 손상되었습니다.'});
    }
    if(motorcycle.hp<=0)this.beginMotorcycleExplosion(motorcycle,reason);
    return applied;
  }

  private beginMotorcycleExplosion(motorcycle:MotorcycleState,_reason:string){
    if(motorcycle.destroyed||motorcycle.exploding)return;
    const now=this.now(),driverId=motorcycle.driverId;
    motorcycle.hp=0;
    this.vehicleStatus.deleteVehicle(motorcycle.id);this.adhesiveExposure.delete(motorcycle.id);
    motorcycle.slowKind='';motorcycle.slowSpeedMultiplier=1;motorcycle.slowAccelerationMultiplier=1;motorcycle.slowSteeringMultiplier=1;motorcycle.slowUntil=0;
    motorcycle.critical=true;
    motorcycle.exploding=true;
    motorcycle.explosionAt=now+MOTORCYCLE_DESTRUCTION_BALANCE.explosionFuseMs/1000;
    motorcycle.velocityX=0;motorcycle.velocityY=0;motorcycle.speed=0;motorcycle.angularVelocity=0;
    if(driverId){
      const driver=this.state.players.get(driverId);
      if(driver)this.forceDismountMotorcycle(driver,motorcycle);
      this.clients.find((client)=>client.sessionId===driverId)?.send('notice',{type:'warning',message:'차량 파괴 · 폭발 위험',duration:2200});
    }
  }

  private explodeMotorcycle(motorcycle:MotorcycleState){
    if(motorcycle.destroyed||!motorcycle.exploding)return;
    const now=this.now();
    motorcycle.exploding=false;
    motorcycle.destroyed=true;
    motorcycle.destroyedAt=now;
    motorcycle.driverId='';
    motorcycle.velocityX=0;motorcycle.velocityY=0;motorcycle.speed=0;motorcycle.angularVelocity=0;
    if(motorcycle.vehicleKind==='fusion_robot'){
      this.scatterExoParts('assault');this.scatterExoParts('emp');
      this.system('합체 로봇이 파괴되어 적색·청색 파츠가 다시 흩어졌습니다.');
    }
    const explosion=new ExplosionState();
    explosion.id=`explosion-${++this.explosionSeq}`;
    explosion.x=motorcycle.x;explosion.y=motorcycle.y;
    explosion.radius=MOTORCYCLE_DESTRUCTION_BALANCE.explosionRadius;
    explosion.startedAt=now;explosion.duration=.82;explosion.sourceId=motorcycle.id;explosion.kind='motorcycle';
    this.state.explosions.set(explosion.id,explosion);
    const attackerAt=this.vehicleAttackerAt.get(motorcycle.id)??-Infinity;
    const attackerId=motorcycle.lastDamagedBy&&now-attackerAt<=MOTORCYCLE_DESTRUCTION_BALANCE.recentAttackerCreditMs/1000?motorcycle.lastDamagedBy:'';
    explosion.ownerId=attackerId;explosion.attackerId=attackerId;explosion.weaponType='motorcycle_explosion';explosion.vehicleDamage=MOTORCYCLE_DESTRUCTION_BALANCE.maxExplosionDamage;explosion.structureDamage=60;explosion.buildingId=motorcycle.buildingId;
    const source={x:motorcycle.x,y:motorcycle.y,buildingId:motorcycle.buildingId};
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed')continue;
      const d=distance(motorcycle.x,motorcycle.y,target.x,target.y);
      if(d>MOTORCYCLE_DESTRUCTION_BALANCE.explosionRadius)continue;
      const exposure=explosionExposureMultiplier(source,target,this.map.visibilityObstacles,this.map.buildingVisibilityZones,PLAYER_HIT_RADIUS);
      if(exposure<=0)continue;
      const damage=Math.round(motorcycleExplosionDamage(d)*exposure);
      if(damage<=0)continue;
      const ratio=clamp(1-d/MOTORCYCLE_DESTRUCTION_BALANCE.explosionRadius,0,1);
      const angle=d>1?Math.atan2(target.y-motorcycle.y,target.x-motorcycle.x):0;
      this.damage(target,damage,attackerId,'오토바이 폭발',MOTORCYCLE_DESTRUCTION_BALANCE.maxExplosionKnockback*ratio,angle);
    }
    for(const other of this.state.motorcycles.values()){
      if(other.id===motorcycle.id||other.destroyed)continue;
      const d=distance(motorcycle.x,motorcycle.y,other.x,other.y);
      if(d>MOTORCYCLE_DESTRUCTION_BALANCE.explosionRadius)continue;
      const exposure=explosionExposureMultiplier(source,other,this.map.visibilityObstacles,this.map.buildingVisibilityZones,this.vehicleRadius(other));
      if(exposure<=0)continue;
      const damage=Math.round(motorcycleExplosionDamage(d)*exposure);
      if(damage>0)this.damageMotorcycle(other,damage,attackerId,'폭발');
    }
  }

  private vehicleDamageForBullet(b:BulletState,motorcycle:MotorcycleState){
    if(b.weaponId==='emp_exo_machine_gun')return EMP_EXO_SUIT_BALANCE.machineGunMechanicalDamage;
    const raw=motorcycleProjectileDamage(b.weaponId as WeaponId,b.damage);
    if(raw<=0)return 0;
    if(b.weaponId!=='shotgun')return raw;
    const key=`${motorcycle.id}:${b.owner}:${b.shotSeq}`;
    const now=this.now(),record=this.vehicleShotDamage.get(key)??{damage:0,expiresAt:now+.5};
    const allowed=Math.max(0,Math.min(raw,MOTORCYCLE_DESTRUCTION_BALANCE.shotgunShotDamageCap-record.damage));
    record.damage+=allowed;record.expiresAt=now+.5;this.vehicleShotDamage.set(key,record);
    return allowed;
  }

  private terrainKindAt(x:number,y:number){
    return terrainAt(x,y,{
      buildings:this.map.buildings,
      rooms:this.map.rooms,
      rivers:this.map.rivers,
      shallowWaterZones:this.map.shallowWaterZones,
      crossings:this.map.landCrossings,
      shoreExits:this.map.shoreExits,
    });
  }


  private setSwimming(p:PlayerState,value:boolean){
    if(p.isSwimming===value)return;
    p.isSwimming=value;
    p.isSniperScoped=false;
    if(value){
      this.cancelReload(p);this.cancelHeal(p);this.cancelThrow(p);this.knockback.delete(p.id);
      const input=this.inputs.get(p.id);if(input){input.aiming=false;input.accelerate=false;input.brake=false;}
      this.emitAudioEvent('water_enter',{sourceId:p.id,x:p.x,y:p.y,buildingId:'',variant:'swim'});
    }else this.emitAudioEvent('water_exit',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'swim'});
  }

  private updateSwimmingState(p:PlayerState){
    if(!this.map.rivers.length||p.phase!=='landed'||!p.alive||p.isDriving){if(p.isSwimming)this.setSwimming(p,false);return;}
    const kind=this.terrainKindAt(p.x,p.y);
    const depth=waterSignedDepthAt(p.x,p.y,this.map.rivers,this.map.landCrossings);
    if(p.isSwimming){
      if(kind!=='deep-water'||depth<=-SWIM_EXIT_MARGIN)this.setSwimming(p,false);
    }else if(kind==='deep-water'&&depth>=SWIM_ENTER_MARGIN)this.setSwimming(p,true);
    if(p.isSwimming){p.buildingId='';p.roomIndex=0;p.insideBuilding=false;}
  }

  private playerMovementPositionFree(p:PlayerState,x:number,y:number){
    if(!this.isPositionFree(x,y)||!this.playerClearOfMotorcycles(x,y,p.vehicleId))return false;
    if([...this.state.stripTraps.values()].some((trap)=>circleHitsStripTrap(x,y,PLAYER_BODY_RADIUS,trap,2)))return false;
    if(!this.map.rivers.length)return true;
    const crossing=crossingAt(x,y,this.map.landCrossings);
    if(crossing)return crossing.allowsPlayer;
    return true;
  }

  private updatePlayers(dt:number){
    for(const p of this.state.players.values()){
      if(!p.alive)continue;
      const input=this.inputs.get(p.id)??{x:0,y:0,aimX:Math.cos(p.angle),aimY:Math.sin(p.angle),angle:p.angle,seq:0,aiming:false,huntSprint:false,accelerate:false,brake:false,turnLeft:false,turnRight:false};
      if(!p.ai)p.angle=input.angle;
      if(p.phase==='falling'||p.phase==='parachute'){
        const parachute=p.altitude<300;
        p.phase=parachute?'parachute':'falling';
        if(p.ai)p.aiState=parachute?'PARACHUTE':'FALLING';
        const speed=parachute?145:260;
        const driftX=p.ai?Math.cos(p.angle)*.55:input.x;
        const driftY=p.ai?Math.sin(p.angle)*.55:input.y;
        this.tryMove(p,driftX*speed*dt,driftY*speed*dt);
        p.altitude=Math.max(0,p.altitude-(parachute?120:260)*dt);
        if(p.altitude<=0){
          this.resolveLanding(p);
          p.phase='landed';
          if(p.ai){p.aiState='EARLY_LOOT';this.aiLandedAt.set(p.id,this.now());}
          this.system(`${p.name} 착지`);
        }
        continue;
      }
      if(p.phase!=='landed')continue;
      this.updateSwimmingState(p);
      if(p.isVaulting)continue;

      if(p.isDriving){
        const motorcycle=this.state.motorcycles.get(p.vehicleId);
        if(motorcycle?.driverId===p.id){p.x=motorcycle.x;p.y=motorcycle.y;continue;}
        p.isDriving=false;p.vehicleId='';p.isSniperScoped=false;
      }
      if(this.coreSiegeDashJobs.has(p.id))continue;

      const kick=this.knockback.get(p.id);
      if(kick){
        this.tryMove(p,kick.vx*dt,kick.vy*dt);
        const damping=Math.pow(.035,dt);
        kick.vx*=damping;
        kick.vy*=damping;
        if(Math.hypot(kick.vx,kick.vy)<8)this.knockback.delete(p.id);
      }

      if(p.ai)continue;
      const tactical=this.tacticalInventory(p.id),now=this.now();
      if(tactical.exoAssembling||(tactical.exoActive&&now<tactical.empDisabledUntil)||p.werewolf.ritualizing||p.werewolf.transformPreparing||now<p.werewolf.actionLockedUntil)continue;
      if(this.healUntil.has(p.id)&&Math.hypot(input.x,input.y)>.08)this.cancelHeal(p);
      if(this.healUntil.has(p.id))continue;
      const ranged=WEAPONS[(p.equipped||'fists') as WeaponId];
      const melee=MELEE_WEAPONS[p.equipped as MeleeId];
      const equipmentMultiplier=p.isSwimming?1:(ranged?.moveMultiplier??melee?.moveMultiplier??1)*(p.isSniperScoped?SNIPER_SCOPE_MOVE_MULTIPLIER:1);
      const terrainMultiplier=movementMultiplierAt(p.x,p.y,this.map.shallowWaterZones,this.map.landCrossings);
      const movementSlowed=now<p.werewolf.silverSlowUntil;
      const progress=this.gameMode==='coreSiege'?this.coreSiegePlayer(p.id):undefined,heroId=progress?normalizeCoreSiegeHero(progress.heroId):undefined,spinning=heroId==='ironCyclone'&&now<(progress?.spinUntil??0),slowResistance=heroId?coreSiegeHeroSlowResistance(heroId,spinning):0;
      const rawAdhesiveMultiplier=adhesivePlayerSpeedMultiplier(p.werewolf.adhesiveSlowStage,now,p.werewolf.adhesiveSlowUntil,p.werewolf.adhesiveRecoveryUntil),cappedAdhesiveMultiplier=this.gameMode==='coreSiege'?Math.max(1-CORE_SIEGE_CONFIG.maxSlowRatio,rawAdhesiveMultiplier):rawAdhesiveMultiplier,adhesiveMultiplier=cappedAdhesiveMultiplier+(1-cappedAdhesiveMultiplier)*slowResistance;
      const exoSpeed=tactical.exoActive?(tactical.exoKind==='emp'?EMP_EXO_SUIT_BALANCE.speedMultiplier:EXO_SUIT_BALANCE.speedMultiplier):1;
      const chickenSpeed=this.chickenState(p).chickenTransformed?CHICKEN_BLASTER_BALANCE.movementMultiplier:1;
      const siegeHaste=progress&&now<progress.hasteUntil?1.12:1,march=progress&&now<progress.marchUntil?1.1:1,heroSpeed=heroId?coreSiegeHeroMoveMultiplier(heroId,p.werewolf.transformed,spinning,Boolean(progress&&now<progress.rampageUntil)):1,chase=progress&&now<progress.meleeChaseUntil?CORE_SIEGE_CONFIG.meleeChaseMoveMultiplier:1,actionSpeed=progress&&now<progress.anchoredUntil?0:progress&&now<progress.parryRecoveryUntil?.45:1;
      const siegeSpeed=(heroId==='ironCyclone'?Math.min(CORE_SIEGE_CONFIG.ironMaxMoveMultiplier,heroSpeed*siegeHaste*march*chase):heroSpeed*siegeHaste*march*chase)*actionSpeed;
      const slowMultiplier=movementSlowed?.6+.4*slowResistance:1;
      const movementSpeed=(p.werewolf.transformed?werewolfSpeed(MOTORCYCLE_MAX_SPEED,p.werewolf.sprinting,p.insideBuilding,false,adhesiveMultiplier)*slowMultiplier:(p.isSwimming?SWIM_SPEED:PLAYER_SPEED)*equipmentMultiplier*terrainMultiplier*slowMultiplier*adhesiveMultiplier)*exoSpeed*chickenSpeed*siegeSpeed;
      const rawMagnitude=Math.hypot(input.x,input.y);
      const wantsMove=rawMagnitude>.08;
      let moveX=wantsMove?input.x/Math.max(1,rawMagnitude):0;
      let moveY=wantsMove?input.y/Math.max(1,rawMagnitude):0;
      if(p.werewolf.transformed){
        if(!wantsMove)this.werewolfMoveVectors.delete(p.id);
        else if(p.werewolf.sprinting){
          const previous=this.werewolfMoveVectors.get(p.id)??{x:moveX,y:moveY};
          const previousAngle=Math.atan2(previous.y,previous.x),desiredAngle=Math.atan2(moveY,moveX);
          const maxTurn=MOTORCYCLE_MAX_TURN_RATE*3.1*WEREWOLF_BALANCE.sprintSteeringMultiplier*dt;
          const nextAngle=previousAngle+clamp(this.angleDiff(desiredAngle,previousAngle),-maxTurn,maxTurn);
          moveX=Math.cos(nextAngle);moveY=Math.sin(nextAngle);this.werewolfMoveVectors.set(p.id,{x:moveX,y:moveY});
        }else this.werewolfMoveVectors.set(p.id,{x:moveX,y:moveY});
      }
      const moved=this.tryMove(p,moveX*movementSpeed*dt,moveY*movementSpeed*dt);
      this.updateSwimmingState(p);
      this.trackStuck(p,wantsMove,moved);
    }
  }

  private tryMove(p:PlayerState,dx:number,dy:number){
    const beforeX=p.x;
    const beforeY=p.y;
    this.ensurePlayerFree(p);
    const free=(x:number,y:number)=>this.playerMovementPositionFree(p,x,y);
    const total=Math.hypot(dx,dy);
    const steps=Math.max(1,Math.ceil(total/6));
    const sx=dx/steps;
    const sy=dy/steps;
    for(let i=0;i<steps;i++){
      const nx=clamp(p.x+sx,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS);
      const ny=clamp(p.y+sy,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
      if(free(nx,ny)){p.x=nx;p.y=ny;continue;}
      if(free(nx,p.y)){p.x=nx;continue;}
      if(free(p.x,ny)){p.y=ny;continue;}
      const length=Math.hypot(sx,sy)||1;
      const slideX=-sy/length*Math.min(6,length);
      const slideY=sx/length*Math.min(6,length);
      if(free(p.x+slideX,p.y+slideY)){p.x+=slideX;p.y+=slideY;continue;}
      if(free(p.x-slideX,p.y-slideY)){p.x-=slideX;p.y-=slideY;continue;}
      break;
    }
    this.ensurePlayerFree(p);
    if(!p.isSwimming&&this.isPositionFree(p.x,p.y,PLAYER_BODY_RADIUS+2)&&this.playerClearOfMotorcycles(p.x,p.y,p.vehicleId))this.lastSafePositions.set(p.id,{x:p.x,y:p.y,mapId:this.map.id,buildingId:p.buildingId,roomIndex:p.roomIndex,recordedAt:this.now()});
    return Math.hypot(p.x-beforeX,p.y-beforeY)>.05;
  }

  private isPositionFree(x:number,y:number,radius=PLAYER_BODY_RADIUS){
    if(!Number.isFinite(x)||!Number.isFinite(y))return false;
    if(x<radius||y<radius||x>this.worldWidth-radius||y>this.worldHeight-radius)return false;
    return !this.collisionRects().some((rect)=>circleHitsRect(x,y,radius,rect));
  }

  private isLandingPositionValid(x:number,y:number){
    if(!this.isPositionFree(x,y,PLAYER_BODY_RADIUS+2))return false;
    if(buildingIdAt(x,y,0,this.map.buildingVisibilityZones))return false;
    for(const other of this.state.players.values()){
      if(!other.alive||other.phase==='plane'||other.phase==='falling'||other.phase==='parachute')continue;
      if(distance(x,y,other.x,other.y)<PLAYER_SEPARATION_RADIUS*1.5)return false;
    }
    return true;
  }

  private bushAt(x:number,y:number,padding=0){return this.map.bushes.find((bush)=>distance(x,y,bush.x,bush.y)<=Math.max(1,bush.radius-padding));}

  private nearestDoorOutsidePoint(x:number,y:number):Point|undefined{
    let best:Point|undefined;let bestDistance=Number.POSITIVE_INFINITY;
    for(const zone of this.map.buildingVisibilityZones){
      const roof=zone.roof;
      const near=x>=roof.x-160&&x<=roof.x+roof.w+160&&y>=roof.y-160&&y<=roof.y+roof.h+160;
      if(!near)continue;
      const cx=roof.x+roof.w/2,cy=roof.y+roof.h/2;
      for(const door of zone.doors){
        const dx=door.x+door.width/2,dy=door.y+door.height/2;
        const length=Math.hypot(dx-cx,dy-cy)||1;
        const candidate={x:dx+(dx-cx)/length*58,y:dy+(dy-cy)/length*58};
        const d=distance(x,y,candidate.x,candidate.y);
        if(d<bestDistance&&this.isLandingPositionValid(candidate.x,candidate.y)){best=candidate;bestDistance=d;}
      }
    }
    return best;
  }

  private resolveLanding(p:PlayerState){
    if(this.isLandingPositionValid(p.x,p.y)){
      p.buildingId='';p.insideBuilding=false;
      this.lastSafePositions.set(p.id,{x:p.x,y:p.y,mapId:this.map.id,buildingId:'',roomIndex:0,recordedAt:this.now()});
      return;
    }
    const point=this.nearestDoorOutsidePoint(p.x,p.y)??this.findNearestFreePoint(p.x,p.y,320,true)??this.map.emergencySpawnPoints.find((candidate)=>this.isLandingPositionValid(candidate.x,candidate.y));
    if(point){
      p.x=point.x;p.y=point.y;p.buildingId='';p.insideBuilding=false;
      this.lastSafePositions.set(p.id,{x:p.x,y:p.y,mapId:this.map.id,buildingId:'',roomIndex:0,recordedAt:this.now()});
      this.state.recoveryCount++;
      const client=this.clients.find((candidate)=>candidate.sessionId===p.id);
      client?.send('positionRecovery',{x:p.x,y:p.y,reason:'landing'});
    }
  }

  private recoverPlayer(p:PlayerState,reason:'collision'|'stuck'|'invalid'){
    const state=this.stuckStates.get(p.id)??{lastX:p.x,lastY:p.y,movingSince:0,lastRecoveryAt:-99};
    if(this.now()-state.lastRecoveryAt<1.5)return false;
    const previous=this.lastSafePositions.get(p.id);
    const point=this.findNearestFreePoint(p.x,p.y,320,false)
      ??(previous&&previous.mapId===this.map.id&&this.isPositionFree(previous.x,previous.y)?previous:undefined)
      ??this.map.emergencySpawnPoints.find((candidate)=>this.isPositionFree(candidate.x,candidate.y));
    if(!point)return false;
    p.x=point.x;p.y=point.y;
    state.lastX=p.x;state.lastY=p.y;state.movingSince=0;state.lastRecoveryAt=this.now();
    this.stuckStates.set(p.id,state);
    this.lastSafePositions.set(p.id,{x:p.x,y:p.y,mapId:this.map.id,buildingId:p.buildingId,roomIndex:p.roomIndex,recordedAt:this.now()});
    this.state.recoveryCount++;
    const client=this.clients.find((candidate)=>candidate.sessionId===p.id);
    client?.send('positionRecovery',{x:p.x,y:p.y,reason});
    const intent=this.aiIntent.get(p.id);if(intent){intent.route=[];intent.repathAt=0;intent.stuckFor=0;intent.lastX=p.x;intent.lastY=p.y;}
    return true;
  }

  private trackStuck(p:PlayerState,wantsMove:boolean,moved:boolean){
    const now=this.now();
    const state=this.stuckStates.get(p.id)??{lastX:p.x,lastY:p.y,movingSince:0,lastRecoveryAt:-99};
    if(!wantsMove||moved){state.lastX=p.x;state.lastY=p.y;state.movingSince=0;this.stuckStates.set(p.id,state);return;}
    if(!state.movingSince)state.movingSince=now;
    if(now-state.movingSince>=1&&this.collisionRects().some((rect)=>circleHitsRect(p.x,p.y,PLAYER_BODY_RADIUS+8,rect)))this.recoverPlayer(p,'stuck');
    this.stuckStates.set(p.id,state);
  }

  private resolvePlayerOverlaps(){
    const players=[...this.state.players.values()].filter((p)=>p.alive&&p.phase==='landed'&&!p.isDriving&&!p.isVaulting);
    for(let i=0;i<players.length;i++)for(let j=i+1;j<players.length;j++){
      const a=players[i]!,b=players[j]!;let dx=b.x-a.x,dy=b.y-a.y;let d=Math.hypot(dx,dy);
      if(d>=PLAYER_SEPARATION_RADIUS*2)continue;
      if(d<.001){let hash=0;for(const char of `${a.id}:${b.id}`)hash=(hash*31+char.charCodeAt(0))>>>0;const angle=(hash%360)*Math.PI/180;dx=Math.cos(angle);dy=Math.sin(angle);d=1;}
      const push=Math.min(5,(PLAYER_SEPARATION_RADIUS*2-d)/2),nx=dx/d,ny=dy/d;
      const ax=a.x-nx*push,ay=a.y-ny*push,bx=b.x+nx*push,by=b.y+ny*push;
      if(this.isPositionFree(ax,ay)){a.x=ax;a.y=ay;}
      if(this.isPositionFree(bx,by)){b.x=bx;b.y=by;}
    }
  }

  private firstObstacleHitT(x1:number,y1:number,x2:number,y2:number,padding=0){
    let closest:number|null=null;
    for(const rect of this.bulletRects()){const t=segmentRectIntersectionT(x1,y1,x2,y2,rect,padding);if(t!==null&&(closest===null||t<closest))closest=t;}
    return closest;
  }

  private firstVisibilityObstacleHitT(x1:number,y1:number,x2:number,y2:number,padding=0){
    let closest:number|null=null;
    for(const rect of this.map.visibilityObstacles){const t=segmentRectIntersectionT(x1,y1,x2,y2,rect,padding);if(t!==null&&(closest===null||t<closest))closest=t;}
    return closest;
  }

  private revealBushPlayer(p:PlayerState,seconds:number){
    if(!p.alive||p.phase!=='landed')return;
    if(!p.inBush&&!this.bushAt(p.x,p.y,4))return;
    this.bushRevealUntil.set(p.id,Math.max(this.bushRevealUntil.get(p.id)??0,this.now()+seconds));
    p.inBush=true;
    p.bushRevealed=true;
  }

  private updateBushStates(){
    const now=this.now();
    for(const p of this.state.players.values()){
      if(!p.alive||p.phase!=='landed'){
        p.inBush=false;
        p.bushRevealed=false;
        this.bushRevealUntil.delete(p.id);
        continue;
      }
      p.inBush=Boolean(this.bushAt(p.x,p.y,4));
      if(!p.inBush){p.bushRevealed=false;this.bushRevealUntil.delete(p.id);continue;}
      const revealUntil=this.bushRevealUntil.get(p.id)??0;
      p.bushRevealed=now<revealUntil;
      if(now>=revealUntil)this.bushRevealUntil.delete(p.id);
    }
  }

  private ensurePlayerFree(p:PlayerState){
    if(this.isPositionFree(p.x,p.y)){
      if(this.isPositionFree(p.x,p.y,PLAYER_BODY_RADIUS+2))this.lastSafePositions.set(p.id,{x:p.x,y:p.y,mapId:this.map.id,buildingId:p.buildingId,roomIndex:p.roomIndex,recordedAt:this.now()});
      return true;
    }
    return this.recoverPlayer(p,'collision');
  }

  private ensureAiFree(p:PlayerState){return this.ensurePlayerFree(p);}

  private findNearestFreePoint(x:number,y:number,maxRadius=360,landing=false):Point|undefined{
    const valid=(px:number,py:number)=>landing?this.isLandingPositionValid(px,py):this.isPositionFree(px,py);
    if(valid(x,y))return{x,y};
    for(let radius=32;radius<=maxRadius;radius+=24){
      const samples=Math.max(16,Math.ceil(radius/8));
      for(let i=0;i<samples;i++){
        const angle=i/samples*Math.PI*2;
        const px=clamp(x+Math.cos(angle)*radius,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS);
        const py=clamp(y+Math.sin(angle)*radius,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
        if(valid(px,py))return{x:px,y:py};
      }
    }
    return undefined;
  }

  private updateReloads(){
    const now=this.now();
    for(const [id,job] of [...this.reloadUntil]){
      const p=this.state.players.get(id);
      if(!p?.alive||p.phase!=='landed'||p.isSwimming||p.equipped!==job.weapon){if(p)this.cancelReload(p);else this.reloadUntil.delete(id);continue;}
      p.reloading=true;
      p.reloadWeapon=job.weapon;
      p.reloadProgress=clamp((now-job.startedAt)/job.duration,0,1);
      if(now<job.at)continue;
      const w=WEAPONS[job.weapon]!;
      const profile=this.coreSiegeBasicProfile(p,job.weapon),capacity=profile?.magazine??w.magazine;
      const current=this.getWeaponMagazine(p,job.weapon);
      const need=capacity-current;
      const reserve=this.getAmmo(p,w.ammoType);
      const load=Math.min(need,reserve);
      this.setWeaponMagazine(p,job.weapon,current+load,false);
      if(this.gameMode!=='coreSiege')this.setAmmo(p,w.ammoType,reserve-load);
      this.syncMagazine(p);
      if(p.ai)p.aiState='COMBAT_READY';
      this.emitAudioEvent('reload_complete',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:job.weapon});
      this.cancelReload(p);
    }
  }

  private updateHeals(){
    const now=this.now();
    for(const [id,h] of [...this.healUntil]){
      const p=this.state.players.get(id);
      if(!p?.alive||p.isSwimming){if(p)this.cancelHeal(p);else this.healUntil.delete(id);continue;}
      p.healingProgress=clamp((now-h.startedAt)/h.duration,0,1);
      if(now<h.at)continue;
      const available=h.kind==='medkit'?p.medkits:p.bandages;
      if(available>0){
        if(h.kind==='medkit')p.medkits--;
        else p.bandages--;
        this.healPlayer(p,h.amount);
      }
      this.emitAudioEvent('heal_complete',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:h.kind});
      this.cancelHeal(p);
      if(p.ai)p.aiState='PATROL';
    }
  }

  private spawnBazookaRocket(p:PlayerState,baseSpread:number){
    const a=p.angle+(Math.random()*2-1)*baseSpread,muzzleOffset=PLAYER_HIT_RADIUS+18;
    const muzzleX=p.x+Math.cos(a)*muzzleOffset,muzzleY=p.y+Math.sin(a)*muzzleOffset;
    if(this.firstObstacleHitT(p.x,p.y,muzzleX,muzzleY,BAZOOKA_BALANCE.projectileRadius)!==null){
      const blocked=new RocketState();blocked.id=`rocket-${++this.rocketSeq}`;blocked.ownerId=p.id;blocked.x=p.x;blocked.y=p.y;blocked.buildingId=p.buildingId;this.explodeBazookaRocket(blocked);return;
    }
    const rocket=new RocketState();rocket.id=`rocket-${++this.rocketSeq}`;rocket.ownerId=p.id;rocket.x=muzzleX;rocket.y=muzzleY;rocket.prevX=muzzleX;rocket.prevY=muzzleY;rocket.vx=Math.cos(a)*WEAPONS.bazooka.projectileSpeed;rocket.vy=Math.sin(a)*WEAPONS.bazooka.projectileSpeed;rocket.life=WEAPONS.bazooka.range/WEAPONS.bazooka.projectileSpeed+.25;rocket.radius=BAZOOKA_BALANCE.projectileRadius;rocket.buildingId=p.buildingId;this.state.rockets.set(rocket.id,rocket);
  }

  private fireTankCannon(driver:PlayerState,tank:MotorcycleState,m?:any){
    if(tank.destroyed||tank.exploding)return;
    const now=this.now(),last=this.tankCannonAt.get(tank.id)??-99;
    if(now<tank.empDisabledUntil)return;
    if(now<Number(tank.slowUntil||0)&&['strip_trap','stun','mixed'].includes(String(tank.slowKind||'')))return;
    if(tank.tankShells<=0){const lastNotice=this.tankEmptyNoticeAt.get(tank.id)??-99;if(now-lastNotice>=1){this.tankEmptyNoticeAt.set(tank.id,now);this.playerClient(driver.id)?.send('notice',{type:'warning',message:'탱크 주포 탄약이 모두 소진되었습니다.'});}return;}
    if(now-last<TANK_CANNON_BALANCE.cooldownSeconds)return;
    const requestedX=Number(m?.aimWorldX),requestedY=Number(m?.aimWorldY),input=this.inputs.get(driver.id);
    const angle=Number.isFinite(requestedX)&&Number.isFinite(requestedY)?Math.atan2(requestedY-tank.y,requestedX-tank.x):input?.angle??driver.angle;
    tank.turretAngle=angle;
    const muzzleX=tank.x+Math.cos(angle)*TANK_CANNON_BALANCE.muzzleOffset,muzzleY=tank.y+Math.sin(angle)*TANK_CANNON_BALANCE.muzzleOffset;
    this.tankCannonAt.set(tank.id,now);tank.tankShells=Math.max(0,Math.floor(tank.tankShells)-1);
    driver.attackSeq++;
    this.revealBushPlayer(driver,BUSH_FIRE_REVEAL_SECONDS);
    this.addAiNoise(tank.x,tank.y,driver.id,'explosion',1350,1);
    this.emitAudioEvent('weapon_fire',{sourceId:tank.id,ownerId:driver.id,x:tank.x,y:tank.y,buildingId:tank.buildingId,variant:'tank_cannon',sequence:driver.attackSeq});
    if(tank.tankShells===0)this.playerClient(driver.id)?.send('notice',{type:'warning',message:'마지막 주포탄 발사 · 남은 탄약 0발'});
    if(this.firstObstacleHitT(tank.x,tank.y,muzzleX,muzzleY,TANK_CANNON_BALANCE.projectileRadius)!==null){
      const blocked=new RocketState();blocked.id=`rocket-${++this.rocketSeq}`;blocked.ownerId=driver.id;blocked.weaponId='tank_cannon';blocked.x=tank.x;blocked.y=tank.y;blocked.buildingId=tank.buildingId;this.explodeBazookaRocket(blocked);return;
    }
    const rocket=new RocketState();rocket.id=`rocket-${++this.rocketSeq}`;rocket.ownerId=driver.id;rocket.weaponId='tank_cannon';rocket.x=muzzleX;rocket.y=muzzleY;rocket.prevX=muzzleX;rocket.prevY=muzzleY;rocket.vx=Math.cos(angle)*TANK_CANNON_BALANCE.projectileSpeed;rocket.vy=Math.sin(angle)*TANK_CANNON_BALANCE.projectileSpeed;rocket.life=TANK_CANNON_BALANCE.range/TANK_CANNON_BALANCE.projectileSpeed+.2;rocket.radius=TANK_CANNON_BALANCE.projectileRadius;rocket.buildingId=tank.buildingId;this.state.rockets.set(rocket.id,rocket);
  }

  private updateRockets(dt:number){
    for(const [id,rocket] of [...this.state.rockets]){
      const ox=rocket.x,oy=rocket.y,nx=ox+rocket.vx*dt,ny=oy+rocket.vy*dt;rocket.prevX=ox;rocket.prevY=oy;rocket.life-=dt;rocket.traveled+=distance(ox,oy,nx,ny);
      const rocketOwner=this.state.players.get(rocket.ownerId);
      let closest=Number.POSITIVE_INFINITY,hitPlayer:PlayerState|undefined,hitMotorcycle:MotorcycleState|undefined;
      const obstacle=this.firstObstacleHitT(ox,oy,nx,ny,rocket.radius);if(obstacle!==null)closest=obstacle;
      for(const player of this.state.players.values()){
        if(!player.alive||player.phase!=='landed'||this.sameCombatTeam(rocketOwner,player)||(player.id===rocket.ownerId&&rocket.traveled<80))continue;
        const t=segmentCircleIntersectionT(ox,oy,nx,ny,player.x,player.y,PLAYER_HIT_RADIUS+rocket.radius);if(t!==null&&t<closest){closest=t;hitPlayer=player;hitMotorcycle=undefined;}
      }
      for(const motorcycle of this.state.motorcycles.values()){
        if(motorcycle.destroyed||this.sameCombatTeam(rocketOwner,this.state.players.get(motorcycle.driverId))||(motorcycle.driverId===rocket.ownerId&&rocket.traveled<80))continue;
        const t=segmentCircleIntersectionT(ox,oy,nx,ny,motorcycle.x,motorcycle.y,this.vehicleRadius(motorcycle)+rocket.radius);if(t!==null&&t<closest){closest=t;hitMotorcycle=motorcycle;hitPlayer=undefined;}
      }
      if(this.gameMode==='coreSiege'){
        for(const structure of this.state.coreSiege.structures.values()){
          if(structure.destroyed||structure.team===rocketOwner?.team)continue;
          const t=segmentCircleIntersectionT(ox,oy,nx,ny,structure.x,structure.y,structure.radius+rocket.radius);if(t!==null&&t<closest){closest=t;hitMotorcycle=undefined;hitPlayer=undefined;}
        }
      }
      const terrainHit=nx<0||ny<0||nx>this.worldWidth||ny>this.worldHeight;
      if(closest<Number.POSITIVE_INFINITY){rocket.x=ox+(nx-ox)*closest;rocket.y=oy+(ny-oy)*closest;if(rocket.weaponId==='exo_missile')this.explodeExoMissile(rocket,hitMotorcycle);else this.explodeBazookaRocket(rocket,hitMotorcycle,hitPlayer);this.state.rockets.delete(id);continue;}
      rocket.x=nx;rocket.y=ny;rocket.buildingId=buildingIdAt(nx,ny,0,this.map.buildingVisibilityZones);
      const maxRange=rocket.weaponId==='tank_cannon'?TANK_CANNON_BALANCE.range:rocket.weaponId==='exo_missile'?EXO_SUIT_BALANCE.bombRange:WEAPONS.bazooka.range;
      if(terrainHit||rocket.life<=0||rocket.traveled>=maxRange){if(rocket.weaponId==='exo_missile')this.explodeExoMissile(rocket);else this.explodeBazookaRocket(rocket);this.state.rockets.delete(id);}
    }
  }

  private explodeBazookaRocket(rocket:RocketState,directMotorcycle?:MotorcycleState,_directPlayer?:PlayerState){
    const now=this.now(),buildingId=buildingIdAt(rocket.x,rocket.y,0,this.map.buildingVisibilityZones),source={x:rocket.x,y:rocket.y,buildingId};
    const tankShell=rocket.weaponId==='tank_cannon',explosionRadius=tankShell?TANK_CANNON_BALANCE.explosionRadius:BAZOOKA_BALANCE.explosionRadius,directVehicleDamage=tankShell?TANK_CANNON_BALANCE.directVehicleDamage:BAZOOKA_BALANCE.directVehicleDamage,structureDamage=tankShell?TANK_CANNON_BALANCE.structureDamage:BAZOOKA_BALANCE.structureDamage,weaponType=tankShell?'tank_cannon':'bazooka';
    const explosion=new ExplosionState();explosion.id=`explosion-${++this.explosionSeq}`;explosion.x=rocket.x;explosion.y=rocket.y;explosion.radius=explosionRadius;explosion.startedAt=now;explosion.duration=tankShell ? .86 : .74;explosion.sourceId=rocket.id;explosion.ownerId=rocket.ownerId;explosion.kind=weaponType;explosion.attackerId=rocket.ownerId;explosion.weaponType=weaponType;explosion.vehicleDamage=directVehicleDamage;explosion.structureDamage=structureDamage;explosion.buildingId=buildingId;this.state.explosions.set(explosion.id,explosion);
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed')continue;const d=distance(rocket.x,rocket.y,target.x,target.y),coreDemolitionist=this.gameMode==='coreSiege'&&!tankShell&&normalizeCoreSiegeHero(this.coreSiegePlayer(rocket.ownerId).heroId)==='demolitionist';let raw=tankShell?this.tankCannonPlayerDamage(d,target.id===rocket.ownerId):bazookaPlayerDamage(d,target.id===rocket.ownerId);if(coreDemolitionist)raw=Math.min(raw,58*coreSiegeBasicDamageMultiplier(this.coreSiegePlayer(rocket.ownerId).level));if(raw<=0)continue;
      const exposure=explosionExposureMultiplier(source,target,this.map.visibilityObstacles,this.map.buildingVisibilityZones,PLAYER_HIT_RADIUS);const applied=Math.round(raw*exposure);if(applied<=0)continue;
      this.damage(target,applied,rocket.ownerId,'바주카포',Math.max(0,310*(1-d/BAZOOKA_BALANCE.explosionRadius)),Math.atan2(target.y-rocket.y,target.x-rocket.x),'explosion');
    }
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed)continue;const d=distance(rocket.x,rocket.y,vehicle.x,vehicle.y),direct=vehicle.id===directMotorcycle?.id;const raw=tankShell?this.tankCannonVehicleDamage(d,direct):bazookaVehicleDamage(d,direct);if(raw<=0)continue;
      const exposure=direct?1:explosionExposureMultiplier(source,vehicle,this.map.visibilityObstacles,this.map.buildingVisibilityZones,this.vehicleRadius(vehicle));const applied=Math.round(raw*exposure);if(applied>0)this.damageMotorcycle(vehicle,applied,rocket.ownerId,'바주카포');
    }
    if(this.gameMode==='coreSiege')this.damageCoreSiegeMinionsInRadius(rocket.x,rocket.y,explosionRadius,tankShell?95:82,rocket.ownerId,.6);
    const owner=this.state.players.get(rocket.ownerId),profile=owner&&!tankShell?this.coreSiegeBasicProfile(owner,'bazooka'):undefined;
    const coreStructureDamage=profile?profile.damage*profile.structureDamageMultiplier*coreSiegeBasicDamageMultiplier(this.coreSiegePlayer(owner!.id).level):structureDamage;
    this.damageCoreSiegeStructuresInRadius(rocket.x,rocket.y,explosionRadius,coreStructureDamage,rocket.ownerId);
    this.emitAudioEvent('bazooka_explosion',{sourceId:rocket.id,ownerId:rocket.ownerId,x:rocket.x,y:rocket.y,buildingId,radius:explosionRadius,weaponType,vehicleDamage:directVehicleDamage,structureDamage});
  }

  private tankCannonPlayerDamage(d:number,owner:boolean){
    if(d>TANK_CANNON_BALANCE.explosionRadius)return 0;
    const ratio=clamp(1-d/TANK_CANNON_BALANCE.explosionRadius,0,1),max=owner?TANK_CANNON_BALANCE.ownerMaxDamage:TANK_CANNON_BALANCE.directPlayerDamage;
    return Math.round(TANK_CANNON_BALANCE.splashPlayerMinDamage+(max-TANK_CANNON_BALANCE.splashPlayerMinDamage)*ratio);
  }

  private tankCannonVehicleDamage(d:number,direct:boolean){
    if(d>TANK_CANNON_BALANCE.explosionRadius)return 0;
    if(direct)return TANK_CANNON_BALANCE.directVehicleDamage;
    const ratio=clamp(1-d/TANK_CANNON_BALANCE.explosionRadius,0,1);
    return Math.round(TANK_CANNON_BALANCE.splashVehicleMinDamage+(TANK_CANNON_BALANCE.directVehicleDamage-TANK_CANNON_BALANCE.splashVehicleMinDamage)*ratio);
  }

  private bombRcCarTarget(object:ThrownObjectState){
    const owner=this.state.players.get(object.ownerId);let best:PlayerState|CoreSiegeMinionState|undefined,bestDistance:number=RC_CAR_BALANCE.searchRadius;
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed'||target.id===object.ownerId||this.sameCombatTeam(owner,target)||(target.buildingId??'')!==(object.buildingId??''))continue;
      const d=distance(object.x,object.y,target.x,target.y);if(d>=bestDistance||this.firstObstacleHitT(object.x,object.y,target.x,target.y,RC_CAR_BALANCE.hitRadius)!==null)continue;
      best=target;bestDistance=d;
    }
    if(this.gameMode==='coreSiege')for(const minion of this.state.coreSiege.minions.values()){
      if(minion.team===owner?.team)continue;
      const d=distance(object.x,object.y,minion.x,minion.y);
      if(d>=bestDistance||this.firstObstacleHitT(object.x,object.y,minion.x,minion.y,RC_CAR_BALANCE.hitRadius)!==null)continue;
      best=minion;bestDistance=d;
    }
    return best;
  }

  private updateBombRcCar(object:ThrownObjectState,dt:number){
    const target=this.bombRcCarTarget(object),safeDt=clamp(dt,0,.05),current=Math.atan2(object.vy,object.vx);
    let angle=current;
    if(target){const desired=Math.atan2(target.y-object.y,target.x-object.x),targetRadius=target instanceof CoreSiegeMinionState?target.radius:PLAYER_HIT_RADIUS;angle=turnAngleToward(current,desired,RC_CAR_BALANCE.turnResponse*safeDt);object.targetId=target.id;if(distance(object.x,object.y,target.x,target.y)<=RC_CAR_BALANCE.triggerRadius+targetRadius)return true;}
    else object.targetId='';
    object.angle=angle;object.vx=Math.cos(angle)*RC_CAR_BALANCE.speed;object.vy=Math.sin(angle)*RC_CAR_BALANCE.speed;
    const nextX=clamp(object.x+object.vx*safeDt,RC_CAR_BALANCE.hitRadius,this.worldWidth-RC_CAR_BALANCE.hitRadius),nextY=clamp(object.y+object.vy*safeDt,RC_CAR_BALANCE.hitRadius,this.worldHeight-RC_CAR_BALANCE.hitRadius);
    if(this.firstObstacleHitT(object.x,object.y,nextX,nextY,RC_CAR_BALANCE.hitRadius)!==null)return true;
    object.x=nextX;object.y=nextY;object.z=0;object.buildingId=buildingIdAt(object.x,object.y,0,this.map.buildingVisibilityZones);return false;
  }

  private explodeBombRcCar(object:ThrownObjectState){
    const now=this.now(),owner=this.state.players.get(object.ownerId),source={x:object.x,y:object.y,buildingId:object.buildingId};
    const explosion=new ExplosionState();explosion.id=`explosion-${++this.explosionSeq}`;explosion.x=object.x;explosion.y=object.y;explosion.radius=RC_CAR_BALANCE.explosionRadius;explosion.startedAt=now;explosion.duration=.7;explosion.sourceId=object.id;explosion.ownerId=object.ownerId;explosion.kind='rcCar';explosion.attackerId=object.ownerId;explosion.weaponType='rcCar';explosion.vehicleDamage=RC_CAR_BALANCE.maxVehicleDamage;explosion.structureDamage=95;explosion.buildingId=object.buildingId;this.state.explosions.set(explosion.id,explosion);
    for(const target of this.state.players.values()){
      if(!target.alive||target.phase!=='landed'||this.sameCombatTeam(owner,target))continue;const d=distance(object.x,object.y,target.x,target.y),raw=rcCarPlayerDamage(d,target.id===object.ownerId);if(raw<=0)continue;const exposure=explosionExposureMultiplier(source,target,this.map.visibilityObstacles,this.map.buildingVisibilityZones,PLAYER_HIT_RADIUS);if(exposure<=0)continue;
      const amount=raw*exposure,knockback=Math.max(0,180*(1-d/RC_CAR_BALANCE.explosionRadius)),angle=Math.atan2(target.y-object.y,target.x-object.x);
      if(this.gameMode==='coreSiege')this.damageCoreSiegeAreaPlayer(target,amount,object.ownerId,'폭탄 RC카','rcCar',knockback,angle);
      else this.damage(target,amount,object.ownerId,'폭탄 RC카',knockback,angle,'explosion');
    }
    for(const vehicle of this.state.motorcycles.values()){
      if(vehicle.destroyed)continue;const driver=this.state.players.get(vehicle.driverId);if(this.sameCombatTeam(owner,driver))continue;const d=distance(object.x,object.y,vehicle.x,vehicle.y),raw=rcCarVehicleDamage(d);if(raw<=0)continue;const exposure=explosionExposureMultiplier(source,vehicle,this.map.visibilityObstacles,this.map.buildingVisibilityZones,this.vehicleRadius(vehicle));if(exposure>0)this.damageMotorcycle(vehicle,raw*exposure,object.ownerId,'폭탄 RC카');
    }
    if(this.gameMode==='coreSiege')this.damageCoreSiegeMinionsInRadius(object.x,object.y,RC_CAR_BALANCE.explosionRadius,105,object.ownerId,.6);
    this.damageCoreSiegeStructuresInRadius(object.x,object.y,RC_CAR_BALANCE.explosionRadius,95,object.ownerId);
    this.emitAudioEvent('bazooka_explosion',{sourceId:object.id,ownerId:object.ownerId,x:object.x,y:object.y,buildingId:object.buildingId,radius:RC_CAR_BALANCE.explosionRadius,weaponType:'rcCar'});
  }

  private spawnBombRcCar(p:PlayerState){
    const angle=p.angle,x=p.x+Math.cos(angle)*(PLAYER_HIT_RADIUS+22),y=p.y+Math.sin(angle)*(PLAYER_HIT_RADIUS+22);
    if(this.firstObstacleHitT(p.x,p.y,x,y,RC_CAR_BALANCE.hitRadius)!==null)return;
    const object=new ThrownObjectState();object.id=`rc-car-${++this.throwableSeq}`;object.ownerId=p.id;object.kind='rcCar';object.x=x;object.y=y;object.z=0;object.vx=Math.cos(angle)*RC_CAR_BALANCE.speed;object.vy=Math.sin(angle)*RC_CAR_BALANCE.speed;object.vz=0;object.phase='seeking';object.spawnedAt=this.now();object.detonateAt=this.now()+RC_CAR_BALANCE.lifetimeSeconds;object.buildingId=p.buildingId;object.angle=angle;object.hp=RC_CAR_BALANCE.maxHp;this.state.thrownObjects.set(object.id,object);
    this.emitAudioEvent('throwable_throw',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'rc_car'});
  }

  private redirectBoomerang(b:BulletState,flight:BoomerangFlight){
    const owner=this.state.players.get(b.owner);
    if(!flight.returning&&flight.hitIds.size<BOOMERANG_BALANCE.maxChainTargets){
      const candidates=[...this.state.players.values()].filter((target)=>target.alive&&target.phase==='landed'&&target.id!==b.owner&&!flight.hitIds.has(target.id)&&!this.sameCombatTeam(owner,target)&&distance(b.x,b.y,target.x,target.y)<=BOOMERANG_BALANCE.chainAcquireRadius&&this.firstObstacleHitT(b.x,b.y,target.x,target.y,b.radius)===null).sort((a,c)=>distance(b.x,b.y,a.x,a.y)-distance(b.x,b.y,c.x,c.y));
      const next=candidates[0];
      if(next){flight.targetId=next.id;const angle=Math.atan2(next.y-b.y,next.x-b.x);b.vx=Math.cos(angle)*WEAPONS.boomerang.projectileSpeed;b.vy=Math.sin(angle)*WEAPONS.boomerang.projectileSpeed;b.traveled=0;return;}
    }
    flight.returning=true;flight.targetId=b.owner;
    if(owner){const angle=Math.atan2(owner.y-b.y,owner.x-b.x),speed=WEAPONS.boomerang.projectileSpeed*BOOMERANG_BALANCE.returnSpeedMultiplier;b.vx=Math.cos(angle)*speed;b.vy=Math.sin(angle)*speed;b.traveled=0;}
  }

  private updateBullets(dt:number){
    this.bulletRemoveQueue.clear();
    for(const [id,b] of this.state.bullets){
      if(this.bulletRemoveQueue.has(id))continue;
      const ox=b.x,oy=b.y;
      const boomerang=b.weaponId==='boomerang'?this.boomerangFlights.get(id):undefined;
      if(boomerang){
        const target=this.state.players.get(boomerang.targetId);
        if(boomerang.targetId&&(!target||!target.alive||target.phase!=='landed')){boomerang.targetId='';this.redirectBoomerang(b,boomerang);}
        const guided=this.state.players.get(boomerang.targetId);
        if(guided){const speed=WEAPONS.boomerang.projectileSpeed*(boomerang.returning?BOOMERANG_BALANCE.returnSpeedMultiplier:1),current=Math.atan2(b.vy,b.vx),desired=Math.atan2(guided.y-b.y,guided.x-b.x),angle=turnAngleToward(current,desired,BOOMERANG_BALANCE.turnRateRadians*dt);b.vx=Math.cos(angle)*speed;b.vy=Math.sin(angle)*speed;}
      }
      if(b.weaponId==='silver_crossbow'){
        const speed=Math.hypot(b.vx,b.vy);
        if(speed>0){
          const currentAngle=Math.atan2(b.vy,b.vx),acquireRange=480,acquireCone=Math.PI/9,maxTurnRate=2.1;
          let target:PlayerState|undefined,bestDistance=Number.POSITIVE_INFINITY;
          for(const candidate of this.state.players.values()){
            if(!candidate.alive||candidate.phase!=='landed'||!candidate.werewolf.transformed)continue;
            const dx=candidate.x-b.x,dy=candidate.y-b.y,d=Math.hypot(dx,dy);
            if(d>acquireRange||d>=bestDistance)continue;
            const desiredAngle=Math.atan2(dy,dx),delta=Math.atan2(Math.sin(desiredAngle-currentAngle),Math.cos(desiredAngle-currentAngle));
            if(Math.abs(delta)>acquireCone||this.firstObstacleHitT(b.x,b.y,candidate.x,candidate.y,b.radius)!==null)continue;
            target=candidate;bestDistance=d;
          }
          if(target){
            const desiredAngle=Math.atan2(target.y-b.y,target.x-b.x),delta=Math.atan2(Math.sin(desiredAngle-currentAngle),Math.cos(desiredAngle-currentAngle)),maxTurn=maxTurnRate*dt,turn=Math.max(-maxTurn,Math.min(maxTurn,delta)),guidedAngle=currentAngle+turn;
            b.vx=Math.cos(guidedAngle)*speed;b.vy=Math.sin(guidedAngle)*speed;
          }
        }
      }
      const nx=ox+b.vx*dt,ny=oy+b.vy*dt;
      b.prevX=ox;b.prevY=oy;
      const stepDistance=distance(ox,oy,nx,ny);
      b.life-=dt;
      b.traveled+=stepDistance;
      const weapon=WEAPONS[b.weaponId as WeaponId];
      const maxRange=b.weaponId==='emp_exo_machine_gun'?EMP_EXO_SUIT_BALANCE.machineGunRange:weapon?.range??Math.max(1,stepDistance);
      let closestT=Number.POSITIVE_INFINITY;
      let hitPlayer:PlayerState|undefined;
      let hitMotorcycle:MotorcycleState|undefined;
      let hitTrap:StripTrapState|undefined;
      let hitMine:ThrownObjectState|undefined;
      let shieldPlayer:PlayerState|undefined;
      let hitSiegeStructure:CoreSiegeStructureState|undefined;
      let hitSiegeMinion:CoreSiegeMinionState|undefined;
      let hitSiegeCamp:CoreSiegeCampState|undefined;
      let hitSiegeDevice:CoreSiegeDeviceState|undefined;
      const bulletOwner=this.state.players.get(b.owner);
      const obstacleT=boomerang?.returning?null:this.firstObstacleHitT(ox,oy,nx,ny,b.radius);
      if(obstacleT!==null)closestT=obstacleT;
      if(boomerang?.returning){
        const owner=this.state.players.get(b.owner),returnT=owner?segmentCircleIntersectionT(ox,oy,nx,ny,owner.x,owner.y,PLAYER_HIT_RADIUS+14):null;
        if(!owner||returnT!==null){if(owner)this.emitAudioEvent('impact_frame',{sourceId:b.owner,targetId:owner.id,x:owner.x,y:owner.y,buildingId:owner.buildingId,variant:'boomerang_return'});this.bulletRemoveQueue.add(id);continue;}
      }
      for(const player of this.state.players.values()){
        if(!player.alive||player.id===b.owner||player.phase!=='landed'||boomerang?.hitIds.has(player.id)||this.sameCombatTeam(bulletOwner,player))continue;
        const tactical=this.tacticalInventory(player.id);
        const droneCount=clamp(Math.floor(tactical.hunterDroneCount),0,4);
        if(droneCount<=0||this.now()<tactical.empDisabledUntil||this.now()<(this.hunterDroneShieldAt.get(player.id)??0))continue;
        const t=segmentCircleIntersectionT(ox,oy,nx,ny,player.x,player.y,HUNTER_DRONE_BALANCE.shieldRadius+b.radius);
        if(t!==null&&t<closestT){closestT=t;shieldPlayer=player;hitPlayer=undefined;hitMotorcycle=undefined;hitTrap=undefined;hitMine=undefined;}
      }
      for(const player of this.state.players.values()){
        if(!player.alive||player.id===b.owner||player.phase!=='landed'||boomerang?.hitIds.has(player.id)||this.sameCombatTeam(bulletOwner,player))continue;
        const t=segmentCircleIntersectionT(ox,oy,nx,ny,player.x,player.y,PLAYER_HIT_RADIUS+b.radius);
        if(t!==null&&t<closestT){closestT=t;hitPlayer=player;hitMotorcycle=undefined;hitTrap=undefined;hitMine=undefined;shieldPlayer=undefined;}
      }
      for(const motorcycle of this.state.motorcycles.values()){
        const vehicleDriver=this.state.players.get(motorcycle.driverId);
        if(motorcycle.destroyed||motorcycle.driverId===b.owner||this.sameCombatTeam(bulletOwner,vehicleDriver))continue;
        const t=segmentCircleIntersectionT(ox,oy,nx,ny,motorcycle.x,motorcycle.y,this.vehicleRadius(motorcycle)+b.radius);
        if(t!==null&&t<closestT){closestT=t;hitMotorcycle=motorcycle;hitPlayer=undefined;hitTrap=undefined;hitMine=undefined;shieldPlayer=undefined;}
      }
      for(const trap of this.state.stripTraps.values()){
        const t=this.stripTrapBulletHitT(ox,oy,nx,ny,b.radius,trap);
        if(t!==null&&t<closestT){closestT=t;hitTrap=trap;hitMotorcycle=undefined;hitPlayer=undefined;hitMine=undefined;shieldPlayer=undefined;}
      }
      for(const mine of this.spiderMines()){
        if(mine.phase!=='chasing')continue;
        const t=segmentCircleIntersectionT(ox,oy,nx,ny,mine.x,mine.y,SPIDER_MINE_BALANCE.hitRadius+b.radius);
        if(t!==null&&t<closestT){closestT=t;hitMine=mine;hitTrap=undefined;hitMotorcycle=undefined;hitPlayer=undefined;shieldPlayer=undefined;}
      }
      for(const car of this.state.thrownObjects.values()){
        if(car.kind!=='rcCar'||car.ownerId===b.owner)continue;
        const t=segmentCircleIntersectionT(ox,oy,nx,ny,car.x,car.y,RC_CAR_BALANCE.hitRadius+b.radius);
        if(t!==null&&t<closestT){closestT=t;hitMine=car;hitTrap=undefined;hitMotorcycle=undefined;hitPlayer=undefined;shieldPlayer=undefined;}
      }
      if(this.gameMode==='coreSiege'){
        for(const device of this.state.coreSiege.devices.values()){
          if(device.team===bulletOwner?.team)continue;
          const t=device.kind==='shieldField'?this.coreSiegeShieldDeviceIntersectionT(device,ox,oy,nx,ny,b.radius):segmentCircleIntersectionT(ox,oy,nx,ny,device.x,device.y,Math.max(24,device.radius*.42)+b.radius);
          if(t!==null&&t<closestT){closestT=t;hitSiegeDevice=device;hitSiegeStructure=undefined;hitSiegeMinion=undefined;hitSiegeCamp=undefined;hitMine=undefined;hitTrap=undefined;hitMotorcycle=undefined;hitPlayer=undefined;shieldPlayer=undefined;}
        }
        for(const structure of this.state.coreSiege.structures.values()){
          if(structure.destroyed||structure.team===bulletOwner?.team)continue;
          const t=segmentCircleIntersectionT(ox,oy,nx,ny,structure.x,structure.y,structure.radius+b.radius);
          if(t!==null&&t<closestT){closestT=t;hitSiegeStructure=structure;hitSiegeMinion=undefined;hitSiegeCamp=undefined;hitMine=undefined;hitTrap=undefined;hitMotorcycle=undefined;hitPlayer=undefined;shieldPlayer=undefined;}
        }
        for(const minion of this.state.coreSiege.minions.values()){
          if(minion.team===bulletOwner?.team)continue;
          const t=segmentCircleIntersectionT(ox,oy,nx,ny,minion.x,minion.y,minion.radius+b.radius);
          if(t!==null&&t<closestT){closestT=t;hitSiegeMinion=minion;hitSiegeStructure=undefined;hitSiegeCamp=undefined;hitMine=undefined;hitTrap=undefined;hitMotorcycle=undefined;hitPlayer=undefined;shieldPlayer=undefined;}
        }
        for(const camp of this.state.coreSiege.camps.values()){
          if(!camp.alive)continue;
          const t=segmentCircleIntersectionT(ox,oy,nx,ny,camp.x,camp.y,camp.radius+b.radius);
          if(t!==null&&t<closestT){closestT=t;hitSiegeCamp=camp;hitSiegeMinion=undefined;hitSiegeStructure=undefined;hitMine=undefined;hitTrap=undefined;hitMotorcycle=undefined;hitPlayer=undefined;shieldPlayer=undefined;}
        }
      }
      if(hitSiegeDevice){
        b.x=ox+(nx-ox)*closestT;b.y=oy+(ny-oy)*closestT;
        this.markCoreSiegeSummonTarget(b.owner,hitSiegeDevice.id,hitSiegeDevice.x,hitSiegeDevice.y);
        hitSiegeDevice.hp=Math.max(0,hitSiegeDevice.hp-b.damage);
        this.broadcast('coreSiegeEffect',{kind:'deviceHit',effectId:hitSiegeDevice.id,ownerId:b.owner,x:b.x,y:b.y,radius:50,duration:.14});
        this.emitAudioEvent('impact_wall',{sourceId:b.owner,targetId:hitSiegeDevice.id,x:b.x,y:b.y,buildingId:'',variant:'core_siege_device'});
        this.bulletRemoveQueue.add(id);continue;
      }
      if(hitSiegeStructure){
        b.x=ox+(nx-ox)*closestT;b.y=oy+(ny-oy)*closestT;
        this.markCoreSiegeSummonTarget(b.owner,hitSiegeStructure.id,hitSiegeStructure.x,hitSiegeStructure.y);
        const profile=bulletOwner?this.coreSiegeBasicProfile(bulletOwner,b.weaponId as WeaponId):undefined;
        this.hitCoreSiegeStructure(hitSiegeStructure,b.damage*(profile?.structureDamageMultiplier??1),b.owner,b.x,b.y);
        this.bulletRemoveQueue.add(id);continue;
      }
      if(hitSiegeMinion){
        b.x=ox+(nx-ox)*closestT;b.y=oy+(ny-oy)*closestT;
        this.markCoreSiegeSummonTarget(b.owner,hitSiegeMinion.id,hitSiegeMinion.x,hitSiegeMinion.y);
        this.damageCoreSiegeMinion(hitSiegeMinion,b.damage,b.owner);
        this.broadcast('coreSiegeEffect',{kind:'minionHit',minionId:hitSiegeMinion.id,ownerId:b.owner,x:b.x,y:b.y,radius:42,duration:.12});
        this.emitAudioEvent('impact_player',{sourceId:b.owner,targetId:hitSiegeMinion.id,x:b.x,y:b.y,buildingId:'',variant:'core_siege_minion'});
        this.bulletRemoveQueue.add(id);continue;
      }
      if(hitSiegeCamp){
        b.x=ox+(nx-ox)*closestT;b.y=oy+(ny-oy)*closestT;
        this.damageCoreSiegeCamp(hitSiegeCamp,b.damage,b.owner);
        this.broadcast('coreSiegeEffect',{kind:'campHit',campId:hitSiegeCamp.id,ownerId:b.owner,x:b.x,y:b.y,radius:55,duration:.14});
        this.emitAudioEvent('impact_player',{sourceId:b.owner,targetId:hitSiegeCamp.id,x:b.x,y:b.y,buildingId:'',variant:'core_siege_camp'});
        this.bulletRemoveQueue.add(id);continue;
      }
      if(shieldPlayer){
        b.x=ox+(nx-ox)*closestT;b.y=oy+(ny-oy)*closestT;
        const droneCount=clamp(Math.floor(this.tacticalInventory(shieldPlayer.id).hunterDroneCount),1,4);
        const cooldown=Math.max(HUNTER_DRONE_BALANCE.shieldMinCooldownSeconds,HUNTER_DRONE_BALANCE.shieldBaseCooldownSeconds-HUNTER_DRONE_BALANCE.shieldCooldownReductionPerDrone*(droneCount-1));
        this.hunterDroneShieldAt.set(shieldPlayer.id,this.now()+cooldown);
        this.emitAudioEvent('impact_frame',{sourceId:b.owner,targetId:shieldPlayer.id,x:b.x,y:b.y,buildingId:shieldPlayer.buildingId,variant:'hunter_drone'});
        this.bulletRemoveQueue.add(id);continue;
      }
      if(hitTrap){
        b.x=ox+(nx-ox)*closestT;b.y=oy+(ny-oy)*closestT;hitTrap.hp=Math.max(0,hitTrap.hp-Math.max(1,b.damage));
        this.emitAudioEvent('impact_wall',{sourceId:b.owner,x:b.x,y:b.y,buildingId:'',variant:'strip_trap'});
        if(hitTrap.hp<=0){this.state.stripTraps.delete(hitTrap.id);this.emitAudioEvent('strip_trap_break',{sourceId:b.owner,x:b.x,y:b.y,buildingId:'',variant:'strip_trap'});}
        this.bulletRemoveQueue.add(id);continue;
      }
      if(hitMine){
        b.x=ox+(nx-ox)*closestT;b.y=oy+(ny-oy)*closestT;hitMine.hp=Math.max(0,hitMine.hp-Math.max(1,b.damage));
        this.emitAudioEvent('impact_wall',{sourceId:b.owner,x:b.x,y:b.y,buildingId:hitMine.buildingId,variant:'spider_mine'});
        if(hitMine.hp<=0){if(hitMine.kind==='rcCar'){this.explodeBombRcCar(hitMine);this.state.thrownObjects.delete(hitMine.id);}else this.explodeSpiderMine(hitMine);}
        this.bulletRemoveQueue.add(id);continue;
      }
      if(hitMotorcycle){
        b.x=ox+(nx-ox)*closestT;
        b.y=oy+(ny-oy)*closestT;
        if(b.weaponId==='stun_gun')this.applyStunGunVehicleHit(hitMotorcycle,b.owner);
        const vehicleDamage=this.vehicleDamageForBullet(b,hitMotorcycle);
        if(vehicleDamage>0)this.damageMotorcycle(hitMotorcycle,vehicleDamage,b.owner,b.weaponId==='emp_exo_machine_gun'?'EMP 로봇 대전차 기관총':'총기');
        this.emitAudioEvent('impact_vehicle',{sourceId:b.owner,x:b.x,y:b.y,buildingId:hitMotorcycle.buildingId,variant:b.weaponId});
        if(vehicleDamage>0||b.weaponId==='stun_gun')this.emitAudioEvent('hit_confirm',{sourceId:b.owner,targetId:hitMotorcycle.id,variant:'vehicle'},this.playerClient(b.owner));
        if(boomerang){this.redirectBoomerang(b,boomerang);continue;}
        this.bulletRemoveQueue.add(id);
        continue;
      }
      if(hitPlayer){
        b.x=ox+(nx-ox)*closestT;
        b.y=oy+(ny-oy)*closestT;
        this.markCoreSiegeSummonTarget(b.owner,hitPlayer.id,hitPlayer.x,hitPlayer.y);
        if(b.weaponId==='silver_crossbow'&&hitPlayer.werewolf.transformed){hitPlayer.werewolf.sprinting=false;hitPlayer.werewolf.silverSlowUntil=this.now()+WEREWOLF_BALANCE.silverSlowSeconds;hitPlayer.werewolf.sprintRechargeAt=this.now()+WEREWOLF_BALANCE.sprintRechargeDelaySeconds;this.damage(hitPlayer,WEREWOLF_BALANCE.silverBoltDamage,b.owner,'은화살',0,undefined,'silver');}
        else if(b.weaponId==='stun_gun'){this.applyStunGunHit(hitPlayer,b.owner);this.damage(hitPlayer,b.damage,b.owner,'스턴건',0,undefined,'bullet');}
        else if(b.weaponId==='chicken_blaster'){this.applyChickenTransform(hitPlayer,b.owner);this.damage(hitPlayer,b.damage,b.owner,'꼬꼬 변환총',0,undefined,'bullet');}
        else{const mechanicalDamage=b.weaponId==='emp_exo_machine_gun'&&this.tacticalInventory(hitPlayer.id).exoActive?EMP_EXO_SUIT_BALANCE.machineGunMechanicalDamage:b.damage;this.damage(hitPlayer,mechanicalDamage,b.owner,b.weaponId==='emp_exo_machine_gun'?'EMP 로봇 기관총':b.weaponId==='boomerang'?'연쇄 부메랑':'총기',0,undefined,'bullet');}
        this.emitAudioEvent('impact_player',{sourceId:b.owner,targetId:hitPlayer.id,x:b.x,y:b.y,buildingId:hitPlayer.buildingId,variant:b.weaponId});
        this.emitAudioEvent('hit_confirm',{sourceId:b.owner,targetId:hitPlayer.id,variant:b.weaponId},this.playerClient(b.owner));
        if(boomerang){boomerang.hitIds.add(hitPlayer.id);b.damage=Math.max(10,b.damage*BOOMERANG_BALANCE.damageRetention);this.redirectBoomerang(b,boomerang);continue;}
        this.bulletRemoveQueue.add(id);
        continue;
      }
      if(obstacleT!==null){
        b.x=ox+(nx-ox)*obstacleT;
        b.y=oy+(ny-oy)*obstacleT;
        this.emitAudioEvent('impact_wall',{sourceId:b.owner,x:b.x,y:b.y,buildingId:b.buildingId,variant:b.weaponId});
        if(boomerang){this.redirectBoomerang(b,boomerang);continue;}
        this.bulletRemoveQueue.add(id);
        continue;
      }
      b.x=nx;b.y=ny;
      if(boomerang&&!boomerang.returning&&b.traveled>=maxRange)this.redirectBoomerang(b,boomerang);
      else if(b.life<=0||(!boomerang&&b.traveled>=maxRange)||b.x<0||b.y<0||b.x>this.worldWidth||b.y>this.worldHeight)this.bulletRemoveQueue.add(id);
    }
    for(const id of this.bulletRemoveQueue){const bullet=this.state.bullets.get(id);if(bullet?.weaponId==='boomerang'){const owner=this.state.players.get(bullet.owner);if(owner&&(owner.primary==='boomerang'||owner.secondary==='boomerang'))this.setWeaponMagazine(owner,'boomerang',1);}this.state.bullets.delete(id);this.boomerangFlights.delete(id);}
    for(const id of this.boomerangFlights.keys())if(!this.state.bullets.has(id))this.boomerangFlights.delete(id);
  }

  private applyStunGunHit(target:PlayerState,attackerId:string){
    const now=this.now(),wolf=target.werewolf,stunSeconds=wolf.transformed?STUN_GUN_BALANCE.werewolfStunSeconds:STUN_GUN_BALANCE.humanStunSeconds,slowSeconds=wolf.transformed?STUN_GUN_BALANCE.werewolfSlowSeconds:STUN_GUN_BALANCE.humanSlowSeconds;
    const targetExo=this.tacticalInventory(target.id);
    if(this.gameMode==='coreSiege'&&targetExo.exoActive)targetExo.empDisabledUntil=Math.max(targetExo.empDisabledUntil,now+1);
    if(this.gameMode==='coreSiege')this.applyCoreSiegeCrowdControl(target,stunSeconds,stunSeconds+slowSeconds);
    else{wolf.actionLockedUntil=Math.max(wolf.actionLockedUntil,now+stunSeconds);wolf.silverSlowUntil=Math.max(wolf.silverSlowUntil,now+stunSeconds+slowSeconds);}
    wolf.sprinting=false;
    wolf.sprintRechargeAt=Math.max(wolf.sprintRechargeAt,now+1);
    const input=this.inputs.get(target.id);
    if(input){input.x=0;input.y=0;input.huntSprint=false;input.aiming=false;}
    this.knockback.delete(target.id);this.cancelHeal(target);this.cancelReload(target);this.cancelThrow(target);target.isSniperScoped=false;
    if(target.isDriving&&target.vehicleId){
      const vehicle=this.state.motorcycles.get(target.vehicleId);
      if(vehicle)this.applyStunGunVehicleHit(vehicle,attackerId);
    }
  }

  private canChickenTransform(target:PlayerState,now=this.now()){
    const tactical=this.tacticalInventory(target.id);
    return target.alive&&target.phase==='landed'&&!tactical.chickenTransformed&&now>=tactical.chickenImmuneUntil&&!target.isDriving&&!target.isSwimming&&!target.isVaulting&&!target.werewolf.transformed&&!target.werewolf.transformPreparing&&!target.werewolf.ritualizing&&!tactical.exoActive&&!tactical.exoAssembling;
  }

  private applyChickenTransform(target:PlayerState,attackerId:string){
    const now=this.now();
    if(!this.canChickenTransform(target,now))return false;
    const chicken=this.chickenState(target);chicken.chickenTransformed=true;
    chicken.chickenUntil=now+CHICKEN_BLASTER_BALANCE.transformSeconds;
    chicken.chickenSourceId=attackerId;
    target.isSniperScoped=false;
    this.cancelLaserCannonCharge(target);this.cancelReload(target);this.cancelHeal(target);this.cancelThrow(target);this.knockback.delete(target.id);
    const input=this.inputs.get(target.id);if(input){input.aiming=false;input.huntSprint=false;}
    this.emitAudioEvent('chicken_transform',{sourceId:attackerId,targetId:target.id,x:target.x,y:target.y,buildingId:target.buildingId,variant:'chicken'});
    this.playerClient(target.id)?.send('notice',{type:'warning',message:`꼬꼬 변신! ${CHICKEN_BLASTER_BALANCE.transformSeconds}초 동안 이동과 부리 공격만 가능합니다.`});
    return true;
  }

  private clearChickenTransform(target:PlayerState,grantImmunity=true){
    const chicken=this.chickenState(target);if(!chicken.chickenTransformed&&!chicken.chickenUntil&&!chicken.chickenSourceId)return;
    chicken.chickenTransformed=false;chicken.chickenUntil=0;chicken.chickenSourceId='';
    if(grantImmunity)chicken.chickenImmuneUntil=Math.max(chicken.chickenImmuneUntil,this.now()+CHICKEN_BLASTER_BALANCE.recoveryImmunitySeconds);
  }

  private updateChickenTransforms(){
    const now=this.now();
    for(const player of this.state.players.values()){
      const chicken=this.chickenState(player);if(chicken.chickenTransformed&&(!player.alive||now>=chicken.chickenUntil)){
        const recovered=player.alive;this.clearChickenTransform(player,recovered);
        if(recovered){this.emitAudioEvent('chicken_recover',{sourceId:player.id,targetId:player.id,x:player.x,y:player.y,buildingId:player.buildingId,variant:'chicken'});this.playerClient(player.id)?.send('notice',{type:'success',message:`원래 모습으로 돌아왔습니다. ${CHICKEN_BLASTER_BALANCE.recoveryImmunitySeconds}초 동안 재변신에 면역입니다.`});}
      }
      if(!chicken.chickenTransformed&&chicken.chickenImmuneUntil>0&&now>=chicken.chickenImmuneUntil)chicken.chickenImmuneUntil=0;
    }
  }

  private chickenPeck(p:PlayerState){
    if(!this.chickenState(p).chickenTransformed||!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting)return false;
    const now=this.now();if(now-(this.shotAt.get(p.id)??-99)<CHICKEN_BLASTER_BALANCE.peckCooldownSeconds)return false;
    this.shotAt.set(p.id,now);p.attackSeq++;this.revealBushPlayer(p,.55);
    let target:PlayerState|undefined,best:number=CHICKEN_BLASTER_BALANCE.peckRange;
    for(const other of this.state.players.values()){
      if(!other.alive||other.id===p.id||other.phase!=='landed')continue;
      const d=distance(p.x,p.y,other.x,other.y),delta=Math.abs(this.angleDiff(Math.atan2(other.y-p.y,other.x-p.x),p.angle));
      if(d<best&&delta<CHICKEN_BLASTER_BALANCE.peckArc&&this.canSeeTarget(p,other)){target=other;best=d;}
    }
    if(target)this.damage(target,CHICKEN_BLASTER_BALANCE.peckDamage,p.id,'닭 부리 공격',0,undefined,'melee');
    this.emitAudioEvent('chicken_peck',{sourceId:p.id,x:p.x,y:p.y,buildingId:p.buildingId,variant:'chicken'});
    return true;
  }

  private applyStunGunVehicleHit(vehicle:MotorcycleState,attackerId:string){
    if(vehicle.destroyed||vehicle.exploding)return;
    const now=this.now(),disabledUntil=now+STUN_GUN_BALANCE.vehicleDisableSeconds,lockedUntil=now+STUN_GUN_BALANCE.vehicleMountLockSeconds;
    vehicle.empDisabledUntil=Math.max(vehicle.empDisabledUntil,disabledUntil);
    vehicle.mountLockedUntil=Math.max(vehicle.mountLockedUntil,lockedUntil);
    vehicle.velocityX=0;vehicle.velocityY=0;vehicle.speed=0;vehicle.angularVelocity=0;
    this.applyVehicleSlow(vehicle,'stun',`stun:${attackerId}`,STUN_GUN_BALANCE.vehicleSlow,STUN_GUN_BALANCE.vehicleMountLockSeconds);
    const driver=vehicle.driverId?this.state.players.get(vehicle.driverId):undefined;
    if(!driver)return;
    this.forceDismountMotorcycle(driver,vehicle);
    this.applyStunGunHit(driver,attackerId);
    this.playerClient(driver.id)?.send('notice',{type:'warning',message:`테이저 피격 · 강제 하차 · ${STUN_GUN_BALANCE.vehicleMountLockSeconds.toFixed(1)}초 탑승 불가`});
  }

  private updateSupplyDrops(){
    const now=this.now();for(const drop of this.state.supplyDrops.values()){
      if(!drop.landed){const remaining=Math.max(0,drop.landedAt-now),progress=1-remaining/SUPPLY_DROP_BALANCE.descentSeconds;drop.altitude=Math.max(0,SUPPLY_DROP_BALANCE.initialAltitude*(1-progress));if(now>=drop.landedAt){drop.altitude=0;drop.landed=true;this.emitAudioEvent('supply_land',{sourceId:drop.id,x:drop.x,y:drop.y,buildingId:'',variant:drop.specialWeapon});this.system('보급 상자가 착지했습니다.');}}
      if(drop.opened&&now-drop.openedAt>SUPPLY_DROP_BALANCE.openCleanupSeconds)this.state.supplyDrops.delete(drop.id);
    }
  }

  private isSupplyPositionValid(x:number,y:number,requirePlayerClearance=true){
    const b=SUPPLY_DROP_BALANCE;if(x<b.edgeMargin||y<b.edgeMargin||x>this.worldWidth-b.edgeMargin||y>this.worldHeight-b.edgeMargin)return false;
    const terrain=this.terrainKindAt(x,y);if(!['land','bridge','ford','shore'].includes(terrain))return false;
    if(buildingIdAt(x,y,0,this.map.buildingVisibilityZones))return false;
    if(distance(x,y,this.state.zoneX,this.state.zoneY)>Math.max(0,this.state.zoneRadius-b.edgeMargin))return false;
    if(this.collisionRects().some((rect)=>circleHitsRect(x,y,b.obstacleClearance,rect)))return false;
    if(requirePlayerClearance)for(const player of this.state.players.values())if(player.alive&&player.phase==='landed'&&distance(x,y,player.x,player.y)<b.playerClearance)return false;
    for(const drop of this.state.supplyDrops.values())if(distance(x,y,drop.x,drop.y)<b.playerClearance)return false;
    return true;
  }

  private findSupplyPosition(){
    const b=SUPPLY_DROP_BALANCE,radius=Math.max(120,this.state.zoneRadius-b.edgeMargin),candidate=(requirePlayerClearance:boolean)=>{
      for(let i=0;i<b.maxPlacementAttempts;i++){const a=this.lootRandom()*Math.PI*2,r=Math.sqrt(this.lootRandom())*radius,x=clamp(this.state.zoneX+Math.cos(a)*r,b.edgeMargin,this.worldWidth-b.edgeMargin),y=clamp(this.state.zoneY+Math.sin(a)*r,b.edgeMargin,this.worldHeight-b.edgeMargin);if(this.isSupplyPositionValid(x,y,requirePlayerClearance))return{x,y};}
      for(const point of this.map.emergencySpawnPoints)if(this.isSupplyPositionValid(point.x,point.y,requirePlayerClearance))return{x:point.x,y:point.y};
      for(const region of this.map.regions){const x=region.x+region.w/2,y=region.y+region.h/2;if(this.isSupplyPositionValid(x,y,requirePlayerClearance))return{x,y};}
      return undefined;
    };
    return candidate(true)??candidate(false);
  }

  private activeSupplyDropCount(){let count=0;for(const drop of this.state.supplyDrops.values())if(!drop.opened)count++;return count;}

  private spawnSupplyDrop(options:{allowMultiple?:boolean;openArenaRecurring?:boolean}={}){
    const recurring=Boolean(options.allowMultiple),openArenaRecurring=Boolean(options.openArenaRecurring&&this.arenaLike());if(!recurring&&this.state.supplySpawned)return false;if(recurring&&this.activeSupplyDropCount()>=this.arenaMaxActiveSupplyDrops())return false;
    const pos=this.findSupplyPosition();if(!pos)return false;
    const now=this.now(),drop=new SupplyDropState();drop.id=`supply-${++this.supplySeq}`;drop.x=pos.x;drop.y=pos.y;drop.altitude=SUPPLY_DROP_BALANCE.initialAltitude;drop.spawnedAt=now;drop.landedAt=now+SUPPLY_DROP_BALANCE.descentSeconds;drop.landed=false;drop.opened=false;const specialRoll=this.lootRandom()*100;drop.specialWeapon=specialRoll<SUPPLY_DROP_BALANCE.railgunWeight?'railgun':specialRoll<SUPPLY_DROP_BALANCE.railgunWeight+SUPPLY_DROP_BALANCE.flamethrowerWeight?'flamethrower':'bazooka';drop.mapId=this.map.id;drop.zoneStage=this.state.zoneStage;if(openArenaRecurring)drop.openArenaSequence=++this.openArenaSupplyDropCount;
    this.state.supplyDrops.set(drop.id,drop);if(!recurring)this.state.supplySpawned=true;this.state.supplyDropId=drop.id;this.emitAudioEvent('supply_incoming',{sourceId:drop.id,x:drop.x,y:drop.y,buildingId:'',variant:drop.specialWeapon});
    this.system(drop.openArenaSequence===OPEN_ARENA_FUSION_PARTS_SUPPLY_SEQUENCE?'세 번째 상시 전장 보급에 합체 로봇 6파츠가 실려 옵니다.':openArenaRecurring?'상시 전장 보급상자가 투하되었습니다.':'보급 상자가 투하되었습니다.');return true;
  }

  private updateOpenArenaRecurringSupplyDrops(now=this.now()){
    if(!this.arenaLike()||this.state.phase!=='ACTIVE'||this.openArenaRoundState!=='active')return;
    if(this.openArenaNextSupplyDropAt<=0)this.openArenaNextSupplyDropAt=now+this.arenaSupplyFirstDelay();
    if(now<this.openArenaNextSupplyDropAt)return;
    if(this.activeSupplyDropCount()>=this.arenaMaxActiveSupplyDrops()){this.openArenaNextSupplyDropAt=now+this.arenaSupplyInterval();return;}
    const spawned=this.spawnSupplyDrop({allowMultiple:true,openArenaRecurring:true});this.openArenaNextSupplyDropAt=now+(spawned?this.arenaSupplyInterval():this.arenaSupplyRetry());
  }

  private openNearbySupplyDrop(p:PlayerState){
    let nearest:SupplyDropState|undefined,best:number=SUPPLY_DROP_BALANCE.interactionDistance;for(const drop of this.state.supplyDrops.values()){if(!drop.landed||drop.opened)continue;const d=distance(p.x,p.y,drop.x,drop.y);if(d<best){best=d;nearest=drop;}}
    if(!nearest)return false;nearest.opened=true;nearest.openedAt=this.now();nearest.openedBy=p.id;this.spawnSupplyContents(nearest);this.emitAudioEvent('supply_open',{sourceId:nearest.id,x:nearest.x,y:nearest.y,buildingId:'',variant:nearest.specialWeapon});return true;
  }

  private spawnSupplyContents(drop:SupplyDropState){
    const weapon:WeaponId=drop.specialWeapon==='railgun'?'railgun':drop.specialWeapon==='flamethrower'?'flamethrower':'bazooka',ammo:LootKind=weapon==='railgun'?'rail_slug':weapon==='flamethrower'?'fuel_ammo':'rocket_ammo';
    const items:Array<{kind:LootKind;ammoCount?:number;weaponMagazine?:number;grantsAmmo?:boolean;stackCount?:number}>=[{kind:weapon,weaponMagazine:WEAPONS[weapon].magazine,grantsAmmo:false}];
    for(let i=0;i<SUPPLY_DROP_BALANCE.weaponAmmoBundles;i++)items.push({kind:ammo,ammoCount:weapon==='railgun'?RAILGUN_BALANCE.pickupAmount:weapon==='flamethrower'?FLAMETHROWER_BALANCE.fuelPickupAmount:BAZOOKA_BALANCE.rocketPickupAmount});items.push({kind:'hunter_drone',stackCount:4,grantsAmmo:false},{kind:'spider_mine',stackCount:2,grantsAmmo:false},{kind:this.lootRandom()<.5?'medkit':'bandage'},{kind:'standard_ammo',ammoCount:24});
    const fusionParts=drop.openArenaSequence===OPEN_ARENA_FUSION_PARTS_SUPPLY_SEQUENCE;if(fusionParts)for(const kind of ['exo_head','exo_core','exo_limbs','emp_exo_head','emp_exo_core','emp_exo_limbs'] as LootKind[])items.push({kind,grantsAmmo:false});
    items.forEach((item,index)=>{const a=index/items.length*Math.PI*2,r=56+(index%2)*24,baseX=drop.x+Math.cos(a)*r,baseY=drop.y+Math.sin(a)*r,pos=this.findSeparatedLootPosition(baseX,baseY,item.kind,'',0)??{x:baseX,y:baseY};const loot=new LootState();loot.id=`loot-${++this.lootSeq}`;loot.kind=item.kind;loot.x=pos.x;loot.y=pos.y;loot.buildingId='';loot.roomIndex=0;if(item.ammoCount!==undefined)loot.ammoCount=item.ammoCount;if(item.weaponMagazine!==undefined)loot.weaponMagazine=item.weaponMagazine;if(item.grantsAmmo!==undefined)loot.grantsAmmo=item.grantsAmmo;if(item.stackCount!==undefined)loot.stackCount=item.stackCount;this.state.loot.set(loot.id,loot);});
    if(fusionParts)this.system('세 번째 보급이 열렸습니다. 합체 로봇 6파츠를 확보하세요.');
  }

  private prepareInitialZone(){
    const requiredCrossings=this.map.id==='dock8'?this.map.landCrossings.filter((crossing)=>crossing.allowsPlayer).map((crossing)=>({x:crossing.rect.x+crossing.rect.w/2,y:crossing.rect.y+crossing.rect.h/2})):[];
    const target=createInitialZone(this.lootRandom,this.map.initialZoneRadius,this.worldWidth,28,requiredCrossings,this.worldHeight);
    this.state.nextZoneX=target.x;
    this.state.nextZoneY=target.y;
    this.state.nextZoneRadius=target.radius;
  }

  private prepareNextZone(){
    if(this.state.zoneStage>=6){
      this.state.nextZoneX=this.state.zoneX;
      this.state.nextZoneY=this.state.zoneY;
      this.state.nextZoneRadius=this.state.zoneRadius;
      this.state.zoneState='FINAL';
      this.state.zoneProgress=1;
      return;
    }
    const ratios=[.72,.68,.62,.55,.5,.45];
    const ratio=ratios[Math.min(this.state.zoneStage,ratios.length-1)]??.5;
    const nextRadius=Math.max(120,this.state.zoneRadius*ratio);
    const target=createNextZone(this.lootRandom,this.state.zoneX,this.state.zoneY,this.state.zoneRadius,nextRadius,this.state.zoneStage,28,this.worldWidth,this.worldHeight);
    this.state.nextZoneX=target.x;
    this.state.nextZoneY=target.y;
    this.state.nextZoneRadius=target.radius;
  }

  private zoneWaitSeconds(){return (this.state.zoneStage===0?30:Math.max(10,24-this.state.zoneStage*2))*this.map.zoneWaitScale;}
  private zoneShrinkSeconds(){return Math.max(12,30-this.state.zoneStage*2.5)*this.map.zoneShrinkScale;}

  private updateZone(dt:number){
    const landed=[...this.state.players.values()].some((p)=>p.phase==='landed');
    if(!landed)return;
    const mult=this.state.zoneSpeed==='fast'?1.35:this.state.zoneSpeed==='slow'?.8:1;
    if(this.state.zoneState==='FREE'){
      this.state.zoneTimer=Math.max(0,this.state.zoneTimer-dt);
      this.state.zoneProgress=0;
      this.state.zoneActive=false;
      if(this.state.zoneTimer<=0){
        this.prepareInitialZone();
        this.state.zoneTimer=this.firstZoneAnnouncementSeconds;
        this.state.zoneState='ANNOUNCING';
      }
      return;
    }
    if(this.state.zoneState==='ANNOUNCING'){
      this.state.zoneTimer=Math.max(0,this.state.zoneTimer-dt);
      this.state.zoneProgress=0;
      this.state.zoneActive=false;
      if(this.state.zoneTimer<=0){
        this.state.zoneX=this.state.nextZoneX;
        this.state.zoneY=this.state.nextZoneY;
        this.state.zoneRadius=this.state.nextZoneRadius;
        this.state.zoneStartX=this.state.zoneX;
        this.state.zoneStartY=this.state.zoneY;
        this.state.zoneStartRadius=this.state.zoneRadius;
        this.state.zoneActive=true;
        this.prepareNextZone();
        this.state.zoneState='WAITING';
        this.state.zoneTimer=this.zoneWaitSeconds();
      }
      return;
    }
    this.state.zoneActive=true;
    if(this.state.zoneState==='WAITING'){
      this.state.zoneTimer-=dt*mult;
      this.state.zoneProgress=0;
      if(this.state.zoneTimer<=0){
        this.state.zoneStartX=this.state.zoneX;
        this.state.zoneStartY=this.state.zoneY;
        this.state.zoneStartRadius=this.state.zoneRadius;
        this.zoneShrinkDuration=this.zoneShrinkSeconds();
        this.state.zoneTimer=this.zoneShrinkDuration;
        this.state.zoneState='SHRINKING';
        if(this.state.zoneStage===SUPPLY_DROP_BALANCE.triggerZoneStage&&!this.state.supplySpawned)this.spawnSupplyDrop();
      }
    }else if(this.state.zoneState==='SHRINKING'){
      this.state.zoneTimer-=dt*mult;
      const progress=clamp(1-Math.max(0,this.state.zoneTimer)/this.zoneShrinkDuration,0,1);
      this.state.zoneProgress=progress;
      this.state.zoneX=this.state.zoneStartX+(this.state.nextZoneX-this.state.zoneStartX)*progress;
      this.state.zoneY=this.state.zoneStartY+(this.state.nextZoneY-this.state.zoneStartY)*progress;
      this.state.zoneRadius=this.state.zoneStartRadius+(this.state.nextZoneRadius-this.state.zoneStartRadius)*progress;
      if(progress>=1){
        this.state.zoneX=this.state.nextZoneX;
        this.state.zoneY=this.state.nextZoneY;
        this.state.zoneRadius=this.state.nextZoneRadius;
        this.state.zoneStage++;
        if(this.state.zoneStage>=6){
          this.state.zoneState='FINAL';
          this.state.zoneTimer=0;
          this.state.zoneProgress=1;
        }else{
          this.prepareNextZone();
          this.state.zoneState='WAITING';
          this.state.zoneTimer=this.zoneWaitSeconds();
          this.state.zoneProgress=0;
        }
      }
    }
    if(!this.state.zoneActive)return;
    for(const p of this.state.players.values()){
      if(p.alive&&p.phase==='landed'&&distance(p.x,p.y,this.state.zoneX,this.state.zoneY)>this.state.zoneRadius)this.damage(p,(2+this.state.zoneStage*1.8)*dt,'','자기장');
    }
  }

  private ensureAiProfile(p:PlayerState){let profile=this.aiProfiles.get(p.id);if(!profile){profile=createAiProfile(p.id,this.state.difficulty as Difficulty,p.name);this.aiProfiles.set(p.id,profile);}return profile;}

  private ensureAiMemory(p:PlayerState){let memory=this.aiMemories.get(p.id);if(!memory){memory=createAiMemory(p.x,p.y,p.buildingId,p.roomIndex,this.now());this.aiMemories.set(p.id,memory);}return memory;}

  private ensureAiCombatBrain(aiId:string){let memory=this.aiCombatBrains.get(aiId);if(!memory){memory=createAiCombatMemory();this.aiCombatBrains.set(aiId,memory);}return memory;}

  private ensureAiTacticalBrain(aiId:string){let memory=this.aiTacticalBrains.get(aiId);if(!memory){memory=createAiTacticalMemory();this.aiTacticalBrains.set(aiId,memory);}return memory;}

  private ensureAiResourceBrain(aiId:string){let memory=this.aiResourceBrains.get(aiId);if(!memory){memory=createAiResourceMemory();this.aiResourceBrains.set(aiId,memory);}return memory;}

  private ensureAiExperienceBrain(aiId:string){let memory=this.aiExperienceBrains.get(aiId);if(!memory){memory=createAiExperienceMemory();this.aiExperienceBrains.set(aiId,memory);}return memory;}

  private ensureAiLocomotionBrain(p:PlayerState){let memory=this.aiLocomotionBrains.get(p.id);if(!memory){memory=createAiLocomotionMemory(Math.cos(p.angle),Math.sin(p.angle));this.aiLocomotionBrains.set(p.id,memory);}return memory;}

  private aiResourceCategory(k:LootKind):AiResourceCategory{
    if(this.isExoPart(k))return'robot';
    if(k==='tank_key')return'vehicle';
    if(k in WEAPONS||k in MELEE_WEAPONS)return'weapon';
    if(['pistol_ammo','standard_ammo','shotgun_ammo','rocket_ammo','rail_slug','laser_cell','fuel_ammo','adhesive_charge','silver_bolt'].includes(k))return'ammo';
    if(k==='bandage'||k==='medkit')return'healing';
    if(k==='vest')return'armor';
    if(k==='hunter_drone'||k==='spider_mine'||k==='strip_trap'||isThrowableType(k))return'tactical';
    return'other';
  }

  private aiResourceContext(p:PlayerState):AiResourceContext{
    const tactical=this.tacticalInventory(p.id),held=[p.primary,p.secondary].filter((id):id is WeaponId=>Boolean(id&&WEAPONS[id as WeaponId])),ammoRatios=held.map((id)=>{const weapon=WEAPONS[id]!;return clamp((this.getWeaponMagazine(p,id)+this.getAmmo(p,weapon.ammoType))/Math.max(1,weapon.magazine*4),0,1);}),partCounts=[...this.exoPartCounts(tactical,'assault'),...this.exoPartCounts(tactical,'emp')],assaultParts=partCounts.slice(0,3).filter((count)=>count>0).length,empParts=partCounts.slice(3).filter((count)=>count>0).length,profile=this.ensureAiProfile(p);
    return{now:this.now(),hp:p.hp,armor:p.armor,hasUsableGun:this.aiHasUsableGun(p),combatReady:this.aiCombatReady(p),ammoRatio:ammoRatios.length?ammoRatios.reduce((sum,value)=>sum+value,0)/ammoRatios.length:0,healingCount:p.bandages+p.medkits,robotParts:partCounts.filter((count)=>count>0).length,closestRobotSetParts:Math.max(assaultParts,empParts),hasTankKey:tactical.tankKeyCount>0,tankAvailable:[...this.state.motorcycles.values()].some((vehicle)=>vehicle.vehicleKind==='tank'&&!vehicle.driverId&&!vehicle.destroyed&&!vehicle.exploding&&!vehicle.critical),tacticalCount:tactical.hunterDroneCount+tactical.spiderMineCount+tactical.stripTrapCount+p.throwableCount,lootPreference:profile.lootPreference,riskAvoidance:profile.riskAvoidance};
  }

  private addAiNoise(x:number,y:number,owner:string,kind:AiSoundKind,radius:number,danger=.5){const now=this.now();const duplicate=this.noises.find((noise)=>noise.owner===owner&&noise.kind===kind&&now-noise.at<.08);if(duplicate){duplicate.x=x;duplicate.y=y;duplicate.at=now;duplicate.radius=Math.max(duplicate.radius,radius);return;}this.noises.push({id:`noise-${++this.aiNoiseSeq}`,x,y,at:now,owner,kind,radius,danger});if(this.noises.length>96)this.noises.splice(0,this.noises.length-96);}

  private aiWeaponSoundKind(id:WeaponId):AiSoundKind{return id==='flamethrower'?'flame':id==='adhesive_sprayer'?'adhesive':id==='bazooka'?'explosion':'gun';}

  private aiWeaponHearingRadius(id:WeaponId){return id==='silver_crossbow'?240:id==='stun_gun'?360:id==='pistol'?520:id==='smg'?650:id==='rifle'?850:id==='shotgun'?760:id==='sniper'?1180:id==='railgun'?1500:id==='laser_cannon'?1250:id==='bazooka'?1450:id==='flamethrower'?720:id==='adhesive_sprayer'?430:500;}

  private updateAiAmbientNoises(){const now=this.now();if(now<this.aiMovementNoiseAt)return;this.aiMovementNoiseAt=now+.32;for(const player of this.state.players.values()){if(!player.alive||player.phase!=='landed')continue;const previous=this.aiMovementSamples.get(player.id);this.aiMovementSamples.set(player.id,{x:player.x,y:player.y,at:now});if(!previous)continue;const elapsed=Math.max(.05,now-previous.at),moved=distance(previous.x,previous.y,player.x,player.y),speed=moved/elapsed;if(player.isDriving)continue;if(moved>16){const kind:AiSoundKind=speed>210?'running':'footstep';this.addAiNoise(player.x,player.y,player.id,kind,kind==='running'?330:210,kind==='running'?.35:.2);}}for(const vehicle of this.state.motorcycles.values()){if(vehicle.destroyed||Math.hypot(vehicle.velocityX,vehicle.velocityY)<55)continue;this.addAiNoise(vehicle.x,vehicle.y,vehicle.driverId||vehicle.id,'vehicle',980,.65);}}

  private aiVisualState(intent:AiIntent,memory:AiHumanMemory){return awarenessForState(intent.state,memory.confidence>15||memory.searchUntil>this.now());}

  private aiCanVisuallyAcquire(viewer:PlayerState,target:PlayerState,intent:AiIntent){const memory=this.ensureAiMemory(viewer),profile=this.ensureAiProfile(viewer),state=this.aiVisualState(intent,memory),d=distance(viewer.x,viewer.y,target.x,target.y),max=aiVisionDistance(state,viewer.insideBuilding,profile.focus);if(d>max)return false;const targetAngle=Math.atan2(target.y-viewer.y,target.x-viewer.x);if(d>AI_HUMANIZATION.hiddenBushDistance&&Math.abs(this.angleDiff(targetAngle,viewer.angle))>aiVisionFovRadians(state,profile.focus)/2)return false;if(target.inBush&&!target.bushRevealed&&d>AI_HUMANIZATION.hiddenBushDistance)return false;if(!this.canSeeTarget(viewer,target))return false;if(this.bulletRects().some((rect)=>this.segmentRect(viewer.x,viewer.y,target.x,target.y,rect)))return false;return true;}

  private rememberAiTarget(viewer:PlayerState,target:PlayerState,intent:AiIntent){
    const now=this.now(),memory=this.ensureAiMemory(viewer),profile=this.ensureAiProfile(viewer),combat=this.ensureAiCombatBrain(viewer.id),reacquire=memory.targetId===target.id&&memory.targetVisible===false;
    const newlyAcquired=memory.targetId!==target.id||!memory.targetVisible;
    if(newlyAcquired){
      prepareAiReaction(memory,profile,viewer.id+target.id,now,distance(viewer.x,viewer.y,target.x,target.y),Math.abs(this.angleDiff(Math.atan2(target.y-viewer.y,target.x-viewer.x),viewer.angle)),reacquire);
      memory.targetLockedUntil=now+AI_COMBAT_TACTICS.targetLockSeconds*(.85+profile.focus*.15);
    }
    if(combat.targetId&&combat.targetId!==target.id)clearAiCombatCover(combat);
    const targetVehicle=target.vehicleId?this.state.motorcycles.get(target.vehicleId):undefined,targetTactical=this.tacticalInventory(target.id),recentAttacker=memory.damagedById===target.id&&now-memory.damagedAt<=AI_COMBAT_TACTICS.recentAttackerSeconds,mechanical=Boolean(targetTactical.exoActive||targetVehicle&&targetVehicle.vehicleKind!=='motorcycle');
    if(newlyAcquired||combat.targetId!==target.id)commitAiCombatTarget(combat,target.id,now,aiCombatTargetCommitSeconds({recentAttacker,mechanical,focus:profile.focus}));memory.targetLockedUntil=Math.max(memory.targetLockedUntil,combat.targetCommittedUntil);
    const dt=Math.max(.05,now-memory.previousSeenAt);
    memory.lastSeenVx=(target.x-memory.previousSeenX)/dt;memory.lastSeenVy=(target.y-memory.previousSeenY)/dt;memory.previousSeenX=target.x;memory.previousSeenY=target.y;memory.previousSeenAt=now;
    memory.targetId=target.id;memory.source='visual';memory.confidence=100;memory.targetVisible=true;memory.lastSeenX=target.x;memory.lastSeenY=target.y;memory.lastSeenAt=now;memory.searchUntil=now+AI_HUMANIZATION.targetMemorySeconds;
    intent.lastSeenX=target.x;intent.lastSeenY=target.y;intent.lastSeenUntil=memory.searchUntil;
    if(newlyAcquired){if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI HUMAN] acquire',{ai:viewer.id,target:target.id,distance:Math.round(distance(viewer.x,viewer.y,target.x,target.y)),reactionReadyAt:memory.reactionReadyAt});this.emitAiDialogue(viewer,this.contactDialogueLine(viewer,target),'contact');this.emitDangerDialogue(viewer,target);}
    return memory;
  }

  private contactDialogueLine(viewer:PlayerState,target:PlayerState):AiDialogueLineId{if(target.equipped==='bazooka')return'danger_bazooka';if(target.equipped==='flamethrower')return'danger_flame';if(target.equipped==='sniper')return'danger_sniper';if(target.insideBuilding&&!viewer.insideBuilding)return'contact_entrance';return Math.abs(this.angleDiff(Math.atan2(target.y-viewer.y,target.x-viewer.x),viewer.angle))<.45?'contact_front':'contact_enemy';}

  private emitDangerDialogue(viewer:PlayerState,target:PlayerState){if(target.equipped==='bazooka')this.emitAiDialogue(viewer,'danger_bazooka','danger');else if(target.equipped==='flamethrower')this.emitAiDialogue(viewer,'danger_flame','danger');else if(target.equipped==='sniper')this.emitAiDialogue(viewer,'danger_sniper','danger');}

  private markAiTargetLost(p:PlayerState,intent:AiIntent,target?:PlayerState){const memory=this.ensureAiMemory(p);if(!memory.targetVisible)return;memory.targetVisible=false;memory.source='visual';memory.confidence=Math.min(memory.confidence,72);memory.searchUntil=Math.max(memory.searchUntil,this.now()+3.2);intent.lastSeenX=memory.lastSeenX;intent.lastSeenY=memory.lastSeenY;intent.lastSeenUntil=memory.searchUntil;intent.targetId='';const line:AiDialogueLineId=target?.inBush?'lost_bush':target?.insideBuilding?'lost_building':pickDialogue('lost',p.id,Math.floor(this.now()*10));if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI HUMAN] lost',{ai:p.id,target:memory.targetId,lastSeenX:Math.round(memory.lastSeenX),lastSeenY:Math.round(memory.lastSeenY),searchUntil:memory.searchUntil});this.emitAiDialogue(p,line,'lost');}

  private aiDialogueDurationMs(text:string){return clamp(900+text.length*42,900,3000);}

  private aiDialogueBlockedIds(now:number){const blocked=new Set<string>();for(const [lineId,usedAt] of this.aiLineCooldown)if(now-usedAt<40)blocked.add(lineId);return blocked;}

  private sendAiPersonaLine(p:PlayerState,line:AiPersonaLine,event:AiPersonaEvent,options:AiDialogueEmitOptions={}){
    if(!p.ai||!p.alive||this.state.phase==='LOBBY'||this.state.phase==='FINISHED')return false;
    const now=this.now(),memory=this.ensureAiMemory(p),profile=aiDialogueProfileForName(p.name);
    if(!profile)return false;
    const tacticalCooldown=profile.tacticalSpeechCooldownSeconds;
    const personalCooldown=options.casual?Math.max(1.8,profile.idleSpeechIntervalMinSeconds*.58):tacticalCooldown;
    const globalCooldown=options.force?.35:1.05;
    if(!options.force&&(now-memory.lastDialogueAt<personalCooldown||now-this.aiGlobalDialogueAt<globalCooldown))return false;
    if(!options.force&&now-(this.aiLineCooldown.get(line.id)??-99)<40)return false;
    memory.lastDialogueAt=now;if(options.casual)memory.lastCasualDialogueAt=now;memory.lastLineId=line.id;memory.lastLineAt=now;memory.lastDialogueEvent=event;
    memory.recentDialogueIds.push(line.id);if(memory.recentDialogueIds.length>15)memory.recentDialogueIds.splice(0,memory.recentDialogueIds.length-15);
    this.aiGlobalDialogueAt=now;this.aiLineCooldown.set(line.id,now);
    const payload={playerId:p.id,speakerId:p.id,sender:p.name,nickname:p.name,lineId:line.id,category:event,text:line.text,channel:'ai',time:Date.now(),sentAt:Date.now(),durationMs:this.aiDialogueDurationMs(line.text),loggable:options.loggable??!options.casual};
    for(const client of this.clients){
      const listener=this.state.players.get(client.sessionId);
      const audience=aiDialogueAudience(listener,listener?distance(p.x,p.y,listener.x,listener.y):Number.POSITIVE_INFINITY,AI_HUMANIZATION.dialogueRadius,this.arenaSpectators.has(client.sessionId));
      if(audience==='player')client.send('aiDialogue',payload);
      else if(audience==='spectator')client.send('aiDialogue',{...payload,loggable:false});
    }
    if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI PERSONA]',{ai:p.id,name:p.name,event,lineId:line.id,text:line.text});
    this.addAiNoise(p.x,p.y,p.id,'voice',360,.15);
    if(options.allowResponse)this.scheduleAiDialogueResponse(p);
    return true;
  }

  private emitAiPersonaDialogue(p:PlayerState,event:AiPersonaEvent,options:AiDialogueEmitOptions={}){
    const now=this.now(),memory=this.ensureAiMemory(p),blocked=this.aiDialogueBlockedIds(now);
    const line=selectAiPersonaLine(p.name,event,`${p.id}:${event}:${Math.floor(now*10)}:${++this.aiDialogueSequence}`,memory.recentDialogueIds,blocked);
    return line?this.sendAiPersonaLine(p,line,event,options):false;
  }

  private emitAiDialogue(p:PlayerState,lineId:AiDialogueLineId,category:AiDialogueCategory,casual=false){
    const event=aiPersonaEventFromLegacy(lineId,category);
    const allowResponse=['uncertain','lost','exit','stuck'].includes(category);
    return this.emitAiPersonaDialogue(p,event,{casual,loggable:!casual,allowResponse});
  }

  private scheduleAiDialogueResponse(speaker:PlayerState){
    const speakerProfile=aiDialogueProfileForName(speaker.name);if(!speakerProfile)return;
    let responder:PlayerState|undefined,best=430;
    for(const candidate of this.state.players.values()){
      if(!candidate.ai||!candidate.alive||candidate.id===speaker.id||candidate.phase!=='landed')continue;
      const d=distance(speaker.x,speaker.y,candidate.x,candidate.y);if(d>=best)continue;
      const blocked=this.firstObstacleHitT(speaker.x,speaker.y,candidate.x,candidate.y,4)!==null;
      if(blocked&&d>260)continue;
      const profile=aiDialogueProfileForName(candidate.name),memory=this.ensureAiMemory(candidate);
      if(!profile||this.now()-memory.lastDialogueAt<Math.max(1.6,profile.tacticalSpeechCooldownSeconds))continue;
      best=d;responder=candidate;
    }
    if(!responder)return;
    const responderProfile=aiDialogueProfileForName(responder.name);if(!responderProfile||this.lootRandom()>responderProfile.responseChance)return;
    this.aiDialogueResponses.push({at:this.now()+.4+this.lootRandom()*1.1,speakerId:speaker.id,responderId:responder.id,depth:1});
    if(this.aiDialogueResponses.length>12)this.aiDialogueResponses.splice(0,this.aiDialogueResponses.length-12);
  }

  private processAiDialogueResponses(){
    const now=this.now(),pending=this.aiDialogueResponses.filter((job)=>job.at<=now);this.aiDialogueResponses=this.aiDialogueResponses.filter((job)=>job.at>now);
    for(const job of pending){
      const speaker=this.state.players.get(job.speakerId),responder=this.state.players.get(job.responderId);if(!speaker?.alive||!responder?.alive||distance(speaker.x,speaker.y,responder.x,responder.y)>500)continue;
      const memory=this.ensureAiMemory(responder),line=selectAiPersonaResponse(speaker.name,responder.name,`${speaker.id}:${responder.id}:${Math.floor(now*10)}:${++this.aiDialogueSequence}`,memory.recentDialogueIds,this.aiDialogueBlockedIds(now));
      if(line)this.sendAiPersonaLine(responder,line,'response',{casual:true,loggable:false,allowResponse:false});
    }
  }

  private aiCasualEvent(p:PlayerState,intent:AiIntent):AiPersonaEvent{
    if(p.isDriving)return'move';
    if(intent.lootId)return'loot';
    if(intent.state==='EXIT_BUILDING')return'exit';
    if(intent.state==='INVESTIGATE_SOUND')return'sound';
    if(intent.state==='SEARCH_LAST_SEEN')return'lost';
    if(intent.state==='RELOAD')return'reload';
    if(intent.state==='RETREAT')return'retreat';
    if(p.insideBuilding)return this.lootRandom()<.32?'empty_room':'move';
    return this.lootRandom()<.45?'idle':'move';
  }

  private maybeAiCasualDialogue(p:PlayerState,intent:AiIntent){
    const now=this.now(),memory=this.ensureAiMemory(p),profile=aiDialogueProfileForName(p.name);if(!profile)return;
    if(memory.nextCasualDialogueAt<=0){memory.nextCasualDialogueAt=now+.5+(this.aiDialogueSequence++%7)*.42;return;}
    if(now<memory.nextCasualDialogueAt)return;
    const combat=['ENGAGE','DEFEND','RETREAT','BAZOOKA_SAFE_DISTANCE','EVADE_GRENADE','AVOID_FIRE'].includes(intent.state)||memory.targetVisible;
    if(combat){memory.nextCasualDialogueAt=now+1.2;return;}
    const event=this.aiCasualEvent(p,intent),spoken=this.emitAiPersonaDialogue(p,event,{casual:true,loggable:false,allowResponse:true});
    const span=profile.idleSpeechIntervalMaxSeconds-profile.idleSpeechIntervalMinSeconds;
    memory.nextCasualDialogueAt=now+(spoken?profile.idleSpeechIntervalMinSeconds+this.lootRandom()*span:.65+this.lootRandom()*.65);
  }

  private updateAiRoomMemory(p:PlayerState,memory:AiHumanMemory){
    const now=this.now();
    if(memory.buildingId!==p.buildingId){
      const wasInside=Boolean(memory.buildingId);memory.buildingId=p.buildingId;memory.buildingEnteredAt=now;memory.roomIndex=p.roomIndex;memory.roomEnteredAt=now;memory.visitedRooms.clear();if(p.buildingId)memory.visitedRooms.add(`${p.buildingId}:${p.roomIndex}`);memory.exitRequestedAt=0;
      if(p.ai&&p.phase==='landed'){if(p.buildingId)this.emitAiPersonaDialogue(p,'building_enter',{casual:true,loggable:false,allowResponse:true});else if(wasInside)this.emitAiPersonaDialogue(p,'exit',{casual:true,loggable:false,allowResponse:true});}
    }else if(memory.roomIndex!==p.roomIndex){
      memory.roomIndex=p.roomIndex;memory.roomEnteredAt=now;if(p.buildingId)memory.visitedRooms.add(`${p.buildingId}:${p.roomIndex}`);
      if(p.ai&&p.buildingId)this.emitAiPersonaDialogue(p,'empty_room',{casual:true,loggable:false,allowResponse:false});
    }
  }

  private findAiBuildingExitPoint(p:PlayerState,_memory:AiHumanMemory){if(!p.buildingId)return undefined;const index=this.map.buildingVisibilityZones.findIndex((zone)=>zone.id===p.buildingId),building=index>=0?this.map.buildings[index]:undefined;if(!building)return undefined;const door=this.doorPoints(building).outside;if(this.isPositionFree(door.x,door.y))return door;let selected:Point|undefined,best=Number.POSITIVE_INFINITY;for(const portal of this.map.portals){if(portal.buildingId!==p.buildingId)continue;for(const point of [portal.approachA,portal.approachB,portal.landingA,portal.landingB]){const space=spaceAt(point.x,point.y,this.map.buildingVisibilityZones,this.map.rooms,12);if(!space.outdoors||!this.isPositionFree(point.x,point.y))continue;const d=distance(p.x,p.y,point.x,point.y);if(d<best){best=d;selected={x:point.x,y:point.y};}}}return selected;}

  private findAiCoverPoint(p:PlayerState,target:PlayerState){let selected:Point|undefined,best=-Infinity;const away=Math.atan2(p.y-target.y,p.x-target.x);for(const radius of [100,150,210])for(let i=-3;i<=3;i++){const angle=away+i*Math.PI/8,x=clamp(p.x+Math.cos(angle)*radius,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS),y=clamp(p.y+Math.sin(angle)*radius,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);if(!this.isPositionFree(x,y)||this.segmentBlocked(p.x,p.y,x,y,PLAYER_BODY_RADIUS))continue;const trace=traceSpaceVisibility({x,y,roomIndex:spaceAt(x,y,this.map.buildingVisibilityZones,this.map.rooms,12).roomIndex},{x:target.x,y:target.y,roomIndex:target.roomIndex},this.map.portals,this.map.visibilityObstacles,3);const blocked=!trace.visible||!visibilitySampleResult(x,y,target.x,target.y,this.map.visibilityObstacles,PLAYER_HIT_RADIUS,2).characterVisible;const score=(blocked?500:0)+distance(x,y,target.x,target.y)*.2-distance(p.x,p.y,x,y);if(score>best){best=score;selected={x,y};}}return selected;}

  private aiCombatTargetThreat(target:PlayerState){
    const weapon=WEAPONS[target.equipped as WeaponId],tactical=this.tacticalInventory(target.id),vehicle=target.vehicleId?this.state.motorcycles.get(target.vehicleId):undefined;
    return(weapon?this.weaponBaseScore(weapon.id):18)+(target.werewolf.transformed?95:0)+(tactical.exoActive?105:0)+(vehicle?.vehicleKind==='tank'?120:vehicle?.vehicleKind==='fusion_robot'?135:vehicle?55:0);
  }

  private aiCombatOutnumberedBy(p:PlayerState,target:PlayerState){
    let additionalThreats=0;
    for(const candidate of this.state.players.values()){
      if(candidate.id===p.id||candidate.id===target.id||!candidate.alive||candidate.phase!=='landed'||this.sameCombatTeam(p,candidate)||distance(p.x,p.y,candidate.x,candidate.y)>680)continue;
      if(this.canSeeTarget(p,candidate))additionalThreats++;
    }
    return additionalThreats;
  }

  private bestAiLoadedAlternate(p:PlayerState,currentId:EquippedId,targetDistance:number){
    const candidates:EquippedId[]=['fists'];if(p.melee&&p.melee!=='fists')candidates.push(p.melee as MeleeId);if(p.secondary)candidates.push(p.secondary as WeaponId);if(p.primary)candidates.push(p.primary as WeaponId);
    let selected:EquippedId|undefined,best=Number.NEGATIVE_INFINITY;
    for(const id of candidates){
      if(id===currentId)continue;
      const loaded=id==='fists'?targetDistance<=72:id in MELEE_WEAPONS?targetDistance<=(MELEE_WEAPONS[id as MeleeId]?.range??0)+24:this.getWeaponMagazine(p,id as WeaponId)>0;
      if(!loaded)continue;
      const score=this.aiWeaponScore(p,id,targetDistance);if(score>best){best=score;selected=id;}
    }
    return selected;
  }

  private aiCombatCoverPoint(p:PlayerState,target:PlayerState,allowSearch=true){
    const now=this.now(),combat=this.ensureAiCombatBrain(p.id),cached=recallAiCombatCover(combat,target.id,now);
    if(cached)return cached;
    if(!allowSearch)return undefined;
    const cover=this.findAiCoverPoint(p,target);if(cover)rememberAiCombatCover(combat,target.id,cover,now);return cover;
  }

  private moveAiToCombatCover(p:PlayerState,intent:AiIntent,cover:Point|undefined,state:string,target?:PlayerState){
    p.aiState=state;intent.state=state;
    if(cover&&distance(p.x,p.y,cover.x,cover.y)>48){intent.mode='move';if(intent.route.length===0||distance(intent.routeGoalX,intent.routeGoalY,cover.x,cover.y)>45)this.setAiDestination(p,intent,cover.x,cover.y);return;}
    if(cover){intent.mode='hold';intent.route=[];intent.tx=cover.x;intent.ty=cover.y;return;}
    if(target){const dx=p.x-target.x,dy=p.y-target.y,length=Math.hypot(dx,dy)||1;intent.mode='retreat';this.setAiDestination(p,intent,p.x+dx/length*360,p.y+dy/length*360);return;}
    intent.mode='hold';intent.route=[];
  }

  private planAiCombatEngagement(p:PlayerState,intent:AiIntent,target:PlayerState,targetDistance:number){
    const now=this.now(),profile=this.ensureAiProfile(p),humanMemory=this.rememberAiTarget(p,target,intent),combat=this.ensureAiCombatBrain(p.id);intent.targetId=target.id;
    this.chooseAiWeapon(p,targetDistance);
    let equipped=p.equipped as EquippedId,weapon=WEAPONS[equipped as WeaponId],melee=equipped==='fists'||equipped in MELEE_WEAPONS,magazine=melee?1:this.getWeaponMagazine(p,weapon?.id??'pistol'),reserveAmmo=melee?0:this.getAmmo(p,weapon?.ammoType??'pistol');
    let alternate=this.bestAiLoadedAlternate(p,equipped,targetDistance);
    const recentlyDamaged=humanMemory.damagedAt+AI_COMBAT_TACTICS.recentAttackerSeconds>now;
    if(!melee&&magazine<=0&&alternate&&(recentlyDamaged||targetDistance<this.desiredRange(equipped)*.95)){
      this.setEquipped(p,alternate,true);equipped=p.equipped as EquippedId;weapon=WEAPONS[equipped as WeaponId];melee=equipped==='fists'||equipped in MELEE_WEAPONS;magazine=melee?1:this.getWeaponMagazine(p,weapon?.id??'pistol');reserveAmmo=melee?0:this.getAmmo(p,weapon?.ammoType??'pistol');alternate=this.bestAiLoadedAlternate(p,equipped,targetDistance);
    }
    const siegeRange=this.gameMode==='coreSiege'?this.coreSiegeAiRangeMultiplier(p):1;
    const desired=this.desiredRange(equipped)*aiRolePlan(profile.personality).combatRangeMultiplier*siegeRange,outnumberedBy=this.aiCombatOutnumberedBy(p,target),lowMagazine=!melee&&weapon&&magazine<=Math.max(1,Math.ceil(weapon.magazine*.22)),needsCover=p.hp/this.playerMaxHp(p)<.55||this.reloadUntil.has(p.id)||Boolean(lowMagazine)||outnumberedBy>0||this.aiCombatTargetThreat(target)>=100;
    const cover=this.aiCombatCoverPoint(p,target,needsCover),decision=decideAiCombatPosture({hp:p.hp,maxHp:this.playerMaxHp(p),armor:p.armor,magazine,magazineSize:melee?1:weapon?.magazine??1,reserveAmmo,isReloading:this.reloadUntil.has(p.id),hasLoadedAlternate:Boolean(alternate),melee,distance:targetDistance,desiredRange:desired,targetHp:target.hp,targetThreat:this.aiCombatTargetThreat(target),recentlyDamaged,outnumberedBy,hasCover:Boolean(cover),aggression:profile.aggression,riskAvoidance:profile.riskAvoidance},combat.posture,combat.postureTargetId===target.id&&now<combat.postureUntil);
    const previousPosture=combat.posture;commitAiCombatPosture(combat,target.id,decision,now);
    if(decision.posture==='reload'){
      if(!melee&&!this.reloadUntil.has(p.id)&&reserveAmmo>0)this.beginReload(p,weapon.id);
      this.moveAiToCombatCover(p,intent,cover,'RELOAD',target);return;
    }
    if(decision.posture==='disengage'){
      this.moveAiToCombatCover(p,intent,cover,'RETREAT',target);if(previousPosture!=='disengage')this.emitAiDialogue(p,p.hp<22?'retreat_hurt':'retreat_back','retreat');return;
    }
    if(decision.posture==='cover'){this.moveAiToCombatCover(p,intent,cover,'TAKE_COVER',target);return;}
    if(decision.posture==='kite'){
      const dx=p.x-target.x,dy=p.y-target.y,length=Math.hypot(dx,dy)||1;p.aiState='RETREAT';intent.state='RETREAT';intent.mode='retreat';this.setAiDestination(p,intent,p.x+dx/length*260,p.y+dy/length*260);return;
    }
    p.aiState='ENGAGE';intent.state='ENGAGE';
    if(decision.posture==='push'){
      const formation=this.gameMode==='coreSiege'?this.coreSiegeAiFormationOffset(p)*(this.coreSiegeAiRole(p)==='front'?.2:.35):0;
      const chaseY=clamp(target.y+formation,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
      intent.mode='move';const chaseGoalMoved=distance(intent.routeGoalX,intent.routeGoalY,target.x,chaseY)>150;if(intent.route.length===0||chaseGoalMoved||intent.stuckFor>.65)this.setAiDestination(p,intent,target.x,chaseY);return;
    }
    intent.mode='hold';intent.route=[];intent.tx=target.x;intent.ty=target.y;if(intent.combatHoldStartedAt<=0)intent.combatHoldStartedAt=now;
  }

  private continueAiCombatRecovery(p:PlayerState,intent:AiIntent){
    const now=this.now(),combat=this.ensureAiCombatBrain(p.id);
    if(now>=combat.postureUntil||!['cover','reload','disengage'].includes(combat.posture))return false;
    if(combat.posture==='reload'&&!this.reloadUntil.has(p.id))return false;
    const state=combat.posture==='reload'?'RELOAD':combat.posture==='cover'?'TAKE_COVER':'RETREAT',cover=recallAiCombatCover(combat,combat.postureTargetId,now);
    if(!cover&&intent.route.length>0){p.aiState=state;intent.state=state;intent.mode='move';return true;}
    this.moveAiToCombatCover(p,intent,cover,state);return true;
  }

  private aiObjectiveRoll(id:string,salt:string){
    let hash=2166136261;
    for(const char of `${id}:${salt}`){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}
    return (hash>>>0)/0xffffffff;
  }

  private setAiNeutralInput(p:PlayerState,moveX=0,moveY=0,angle=p.angle,huntSprint=false){
    this.inputs.set(p.id,{x:moveX,y:moveY,aimX:Math.cos(angle),aimY:Math.sin(angle),angle,seq:0,aiming:false,huntSprint,accelerate:false,brake:false,turnLeft:false,turnRight:false});
  }

  private currentAiWorldObjective(p:PlayerState){
    const objective=this.aiWorldObjectives.get(p.id);
    if(!objective)return undefined;
    if(this.now()>=objective.expiresAt){this.aiWorldObjectives.delete(p.id);return undefined;}
    if(objective.kind==='supply'){
      const drop=this.state.supplyDrops.get(objective.id);
      if(!drop?.landed||drop.opened){this.aiWorldObjectives.delete(p.id);return undefined;}
      objective.x=drop.x;objective.y=drop.y;
    }else{
      if(this.arenaLike()){this.aiWorldObjectives.delete(p.id);return undefined;}
      const season=this.state.werewolfSeason;
      if(season.altarPhase!=='active'||season.curseOwnerId||season.werewolfPlayerId){this.aiWorldObjectives.delete(p.id);return undefined;}
      objective.x=season.altarX;objective.y=season.altarY;
    }
    return objective;
  }

  private tryAssignAiWorldObjective(p:PlayerState,intent:AiIntent,profile:AiPersonalityProfile){
    const now=this.now(),existing=this.currentAiWorldObjective(p);
    if(existing){
      if(!this.startAiGoal(intent,'objective',`objective:${existing.kind}:${existing.id}`,4.5,false,false,'continue-world-objective'))return false;
      p.aiState=existing.kind==='altar'?'SEEK_ALTAR':'SEEK_SUPPLY';
      intent.state=p.aiState;intent.mode='move';intent.targetId='';intent.lootId='';
      if(intent.route.length===0||distance(intent.routeGoalX,intent.routeGoalY,existing.x,existing.y)>90)this.setAiDestination(p,intent,existing.x,existing.y);
      return true;
    }
    if(now<(this.aiObjectiveCooldown.get(p.id)??0)||p.hp<42||p.werewolf.hasCurse||p.werewolf.transformed||p.werewolf.transformPreparing)return false;
    this.aiObjectiveCooldown.set(p.id,now+2.4+this.lootRandom()*1.8);
    const candidates:Array<{score:number;objective:AiWorldObjective}>=[],resourceContext=this.aiResourceContext(p);
    for(const drop of this.state.supplyDrops.values()){
      if(!drop.landed||drop.opened)continue;
      const d=distance(p.x,p.y,drop.x,drop.y);
      if(d>1850)continue;
      const dangerPenalty=(this.state.zoneActive&&distance(drop.x,drop.y,this.state.zoneX,this.state.zoneY)>this.state.zoneRadius-100?90:0)+aiDangerScoreAt(this.ensureAiExperienceBrain(p.id),drop.x,drop.y,now);
      const competition=[...this.state.players.values()].filter((other)=>other.ai&&other.id!==p.id&&other.alive&&distance(other.x,other.y,drop.x,drop.y)<520).length;
      const score=scoreAiSupplyObjective(resourceContext,d,dangerPenalty,competition)+aiRoleObjectiveBonus(profile.personality,'supply');
      if(score>35)candidates.push({score,objective:{kind:'supply',id:drop.id,x:drop.x,y:drop.y,expiresAt:now+22}});
    }
    const season=this.state.werewolfSeason;
    if(this.gameMode!=='openArena'&&season.altarPhase==='active'&&!season.curseOwnerId&&!season.werewolfPlayerId){
      const d=distance(p.x,p.y,season.altarX,season.altarY);
      const threshold=.22+profile.aggression*.26+(1-profile.riskAvoidance)*.08;
      const interested=this.aiObjectiveRoll(p.id,`altar-${season.cycle}`)<threshold;
      if(interested&&d<2100){
        const score=126+profile.aggression*42-profile.riskAvoidance*25-d*.045+aiRoleObjectiveBonus(profile.personality,'altar');
        if(score>35)candidates.push({score,objective:{kind:'altar',id:`altar-${season.cycle}`,x:season.altarX,y:season.altarY,expiresAt:now+24}});
      }
    }
    candidates.sort((a,b)=>b.score-a.score);
    const selected=candidates[0];
    if(!selected)return false;
    if(!this.startAiGoal(intent,'objective',`objective:${selected.objective.kind}:${selected.objective.id}`,4.5,false,false,'world-objective'))return false;
    this.aiWorldObjectives.set(p.id,selected.objective);
    p.aiState=selected.objective.kind==='altar'?'SEEK_ALTAR':'SEEK_SUPPLY';
    intent.state=p.aiState;intent.mode='move';intent.targetId='';intent.lootId='';
    this.setAiDestination(p,intent,selected.objective.x,selected.objective.y,true);
    if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI OBJECTIVE] select',{ai:p.id,kind:selected.objective.kind,id:selected.objective.id,score:Math.round(selected.score)});
    return true;
  }

  private beginAiWerewolfRitual(p:PlayerState){
    const season=this.state.werewolfSeason,w=p.werewolf;
    if(this.gameMode==='openArena'||!p.ai||!p.alive||p.phase!=='landed'||p.isDriving||p.isSwimming||p.isVaulting||w.hasCurse||w.transformed||w.transformPreparing||w.ritualizing)return false;
    if(season.altarPhase!=='active'||season.curseOwnerId||season.werewolfPlayerId||distance(p.x,p.y,season.altarX,season.altarY)>WEREWOLF_BALANCE.ritualRadius)return false;
    this.cancelHeal(p);this.cancelReload(p);this.cancelThrow(p);p.isSniperScoped=false;
    const now=this.now(),ritualSeconds=this.gameMode==='domination'?this.arenaRitualCompletionSeconds():WEREWOLF_BALANCE.ritualSeconds;w.ritualizing=true;w.ritualStartedAt=now;w.ritualCompletesAt=now+ritualSeconds;w.ritualOriginX=p.x;w.ritualOriginY=p.y;
    p.aiState='ALTAR_RITUAL';this.setAiNeutralInput(p);
    if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI OBJECTIVE] altar-ritual',{ai:p.id,completesAt:w.ritualCompletesAt});
    return true;
  }

  private handleAiWorldObjectiveAtPosition(p:PlayerState,intent:AiIntent){
    const objective=this.currentAiWorldObjective(p);
    if(!objective)return false;
    const d=distance(p.x,p.y,objective.x,objective.y);
    if(objective.kind==='altar'){
      if(d<=WEREWOLF_BALANCE.ritualRadius&&this.beginAiWerewolfRitual(p)){
        const plan=this.aiVehiclePlans.get(p.id);if(plan)plan.phase='ritual';
        return true;
      }
      return false;
    }
    if(d<=SUPPLY_DROP_BALANCE.interactionDistance&&this.openNearbySupplyDrop(p)){
      if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI OBJECTIVE] supply-open',{ai:p.id,id:objective.id});
      this.aiWorldObjectives.delete(p.id);
      if(intent.goalKind==='objective')this.clearAiGoal(intent,'completed','supply-opened');
      const nearby=this.findBestLoot(p,intent);
      if(nearby&&distance(p.x,p.y,nearby.x,nearby.y)<360){
        const plan=this.aiVehiclePlans.get(p.id);
        if(plan){plan.phase='walk';plan.objectiveKind='loot';plan.objectiveId=nearby.id;plan.targetX=nearby.x;plan.targetY=nearby.y;plan.expiresAt=this.now()+10;}
        this.assignLootIntent(p,intent,nearby,false);
      }else this.finishAiVehicleObjective(p,intent);
      return false;
    }
    return false;
  }

  private aiVehicleObjectiveFor(p:PlayerState,intent:AiIntent):{kind:AiObjectiveKind;id:string;x:number;y:number}|undefined{
    const world=this.currentAiWorldObjective(p);
    if(world)return{kind:world.kind,id:world.id,x:world.x,y:world.y};
    if(intent.lootId){
      const loot=this.state.loot.get(intent.lootId);
      if(loot)return{kind:'loot',id:loot.id,x:loot.x,y:loot.y};
    }
    if(intent.state==='ZONE_ESCAPE')return{kind:'zone',id:'zone',x:intent.routeGoalX,y:intent.routeGoalY};
    if(intent.state==='PATROL'||intent.state==='COMBAT_READY')return{kind:'patrol',id:'patrol',x:intent.routeGoalX,y:intent.routeGoalY};
    return undefined;
  }

  private ensureAiVehicleMemory(aiId:string){
    let memory=this.aiVehicleMemories.get(aiId);
    if(!memory){memory=createAiVehicleMemory();this.aiVehicleMemories.set(aiId,memory);}
    pruneAiVehicleMemory(memory,this.now());
    return memory;
  }

  private normalizeAiVehiclePlan(plan:AiVehiclePlan,now=this.now()){
    plan.phaseStartedAt??=plan.startedAt||now;
    plan.mountedAt??=plan.phase==='drive'?(this.vehicleMotionStates.get(plan.vehicleId)?.mountedAt??plan.startedAt??now):0;
    plan.recoveryAttempts??=0;
    plan.lastRecoveryAt??=-99;
    plan.braking??=false;
    plan.patrolGeneration??=0;
    return plan;
  }

  private setAiVehiclePhase(plan:AiVehiclePlan,phase:AiVehiclePhase,now=this.now()){
    plan.phase=phase;plan.phaseStartedAt=now;plan.braking=false;
  }

  private endAiVehiclePlan(p:PlayerState,intent:AiIntent,reason:AiVehicleExitReason,options:{dismount?:boolean;forceDismount?:boolean;escape?:boolean}={}){
    const plan=this.aiVehiclePlans.get(p.id);
    if(!plan)return true;
    const now=this.now(),vehicleId=plan.vehicleId||p.vehicleId,bike=vehicleId?this.state.motorcycles.get(vehicleId):undefined;
    const wasMounted=Boolean(p.isDriving&&p.vehicleId===vehicleId);
    if(options.dismount&&wasMounted){
      if(bike){
        if(options.forceDismount)this.forceDismountMotorcycle(p,bike);
        else if(!this.dismountMotorcycle(undefined,p))return false;
      }else this.detachPlayerFromVehicle(p);
    }
    if(vehicleId)recordAiVehicleExit(this.ensureAiVehicleMemory(p.id),vehicleId,now,reason,wasMounted);
    this.aiVehiclePlans.delete(p.id);this.aiThinkAt.set(p.id,0);
    if(options.escape){
      const angle=bike?bike.rotation+Math.PI:Math.atan2(p.y-plan.targetY,p.x-plan.targetX),escapeDistance=220;
      this.startAiGoal(intent,'escape',`vehicle-escape:${vehicleId}:${reason}`,1.8,true,false,`vehicle-${reason}`);
      p.aiState='VEHICLE_ABANDON';intent.state='VEHICLE_ABANDON';intent.mode='move';intent.targetId='';
      this.setAiDestination(p,intent,p.x+Math.cos(angle)*escapeDistance,p.y+Math.sin(angle)*escapeDistance,true);
    }
    return true;
  }

  private nextAiVehiclePatrolPoint(p:PlayerState,plan:AiVehiclePlan,bike:MotorcycleState){
    const generation=(plan.patrolGeneration??0)+1;plan.patrolGeneration=generation;
    const radius=this.vehicleRadius(bike),candidates:Point[]=[];
    if(this.state.zoneActive){
      const safeRadius=Math.max(80,this.state.zoneRadius-radius-48);
      for(let attempt=0;attempt<5;attempt++){
        const key=`vehicle-patrol:${generation}:${attempt}`,angle=this.aiObjectiveRoll(p.id,`${key}:angle`)*Math.PI*2,ring=safeRadius*(.38+this.aiObjectiveRoll(p.id,`${key}:ring`)*.5);
        candidates.push({x:clamp(this.state.zoneX+Math.cos(angle)*ring,radius,this.worldWidth-radius),y:clamp(this.state.zoneY+Math.sin(angle)*ring,radius,this.worldHeight-radius)});
      }
    }else for(let attempt=0;attempt<5;attempt++)candidates.push(this.aiPatrolPoint());
    const viable=candidates.filter((candidate)=>this.isVehiclePositionFree(candidate.x,candidate.y,bike.id));
    return (viable.length?viable:candidates).sort((a,b)=>distance(bike.x,bike.y,b.x,b.y)-distance(bike.x,bike.y,a.x,a.y))[0]??{x:bike.x,y:bike.y};
  }

  private retargetAiMechanicalPatrol(p:PlayerState,intent:AiIntent,plan:AiVehiclePlan,bike:MotorcycleState,now=this.now()){
    const patrol=this.nextAiVehiclePatrolPoint(p,plan,bike);
    this.setAiVehiclePhase(plan,'drive',now);plan.objectiveKind='patrol';plan.objectiveId=`${bike.vehicleKind}-patrol`;plan.targetX=patrol.x;plan.targetY=patrol.y;plan.expiresAt=now+AI_VEHICLE_BRAIN.patrolRetargetSeconds;plan.lastX=bike.x;plan.lastY=bike.y;plan.stuckFor=0;plan.recoveryAttempts=0;plan.lastRecoveryAt=-99;
    p.aiState=bike.vehicleKind==='fusion_robot'?'FUSION_PATROL':'DRIVE_TO_OBJECTIVE';intent.state=p.aiState;intent.mode='move';this.setAiNeutralInput(p,0,0,bike.rotation);
  }

  private maybeStartAiVehiclePlan(p:PlayerState,intent:AiIntent){
    if(this.aiVehiclePlans.has(p.id)||p.isDriving||p.insideBuilding||p.isSwimming||p.isVaulting||p.hp<35||p.werewolf.hasCurse||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing)return false;
    const now=this.now(),memory=this.ensureAiVehicleMemory(p.id);
    if(!canStartAiVehiclePlan(memory,now))return false;
    const tactical=this.tacticalInventory(p.id),profile=this.ensureAiProfile(p),role=aiRolePlan(profile.personality);
    const keyTank=tactical.tankKeyCount>0?[...this.state.motorcycles.values()].filter((vehicle)=>vehicle.vehicleKind==='tank'&&!vehicle.driverId&&!vehicle.destroyed&&!vehicle.exploding&&!vehicle.critical&&vehicle.hp>=vehicle.maxHp*.25&&canUseAiVehicle(memory,vehicle.id,now)).sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0]:undefined;
    const objective=keyTank?{kind:'tank' as const,id:keyTank.id,x:keyTank.x,y:keyTank.y}:this.aiVehicleObjectiveFor(p,intent);
    if(!objective||objective.kind!=='tank'&&distance(p.x,p.y,objective.x,objective.y)<role.vehicleMinimumTripDistance)return false;
    let selected:MotorcycleState|undefined,best=Number.POSITIVE_INFINITY;
    for(const bike of this.state.motorcycles.values()){
      if(bike.driverId||bike.destroyed||bike.exploding||bike.critical||bike.hp<bike.maxHp*.35)continue;
      if(!canUseAiVehicle(memory,bike.id,now))continue;
      if(objective.kind==='tank'&&bike.id!==objective.id)continue;
      if(bike.vehicleKind==='tank'&&tactical.tankKeyCount<=0)continue;
      const toBike=distance(p.x,p.y,bike.x,bike.y);
      if(toBike>(objective.kind==='tank'?1800:760)||buildingIdAt(bike.x,bike.y,0,this.map.buildingVisibilityZones))continue;
      const score=toBike+distance(bike.x,bike.y,objective.x,objective.y)*.42-(bike.vehicleKind==='tank'?objective.kind==='tank'?900:80:0)-role.vehicleScoreBonus;
      if(score<best){best=score;selected=bike;}
    }
    if(!selected)return false;
    const plan:AiVehiclePlan={vehicleId:selected.id,preferredVehicleId:selected.id,phase:'seek',objectiveKind:objective.kind,objectiveId:objective.id,targetX:objective.x,targetY:objective.y,startedAt:now,expiresAt:now+28,avoidSign:this.aiObjectiveRoll(p.id,selected.id)<.5?-1:1,stuckFor:0,reverseUntil:0,lastX:p.x,lastY:p.y,phaseStartedAt:now,mountedAt:0,recoveryAttempts:0,lastRecoveryAt:-99,braking:false,patrolGeneration:0};
    this.aiVehiclePlans.set(p.id,plan);
    p.aiState='SEEK_VEHICLE';intent.state='SEEK_VEHICLE';intent.mode='move';intent.targetId='';
    this.setAiDestination(p,intent,selected.x,selected.y,true);
    if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI VEHICLE] seek',{ai:p.id,vehicle:selected.id,objective:objective.kind,objectiveId:objective.id});
    return true;
  }

  private refreshAiVehicleTarget(p:PlayerState,plan:AiVehiclePlan){
    if(plan.objectiveKind==='loot'){
      const loot=this.state.loot.get(plan.objectiveId);if(!loot)return false;plan.targetX=loot.x;plan.targetY=loot.y;return true;
    }
    if(plan.objectiveKind==='supply'){
      const drop=this.state.supplyDrops.get(plan.objectiveId);if(!drop?.landed||drop.opened)return false;plan.targetX=drop.x;plan.targetY=drop.y;return true;
    }
    if(plan.objectiveKind==='altar'){
      const objective=this.currentAiWorldObjective(p);if(!objective||objective.kind!=='altar')return false;plan.targetX=objective.x;plan.targetY=objective.y;return true;
    }
    if(plan.objectiveKind==='tank'){
      const tank=this.state.motorcycles.get(plan.objectiveId);if(!tank||tank.destroyed||tank.exploding)return false;plan.targetX=tank.x;plan.targetY=tank.y;return true;
    }
    return true;
  }

  private finishAiVehicleObjective(p:PlayerState,intent:AiIntent){
    const plan=this.aiVehiclePlans.get(p.id);
    if(!plan)return;
    const now=this.now();this.normalizeAiVehiclePlan(plan,now);
    const bike=this.state.motorcycles.get(plan.preferredVehicleId);
    if(bike&&!bike.driverId&&!bike.destroyed&&!bike.exploding&&canUseAiVehicle(this.ensureAiVehicleMemory(p.id),bike.id,now)&&distance(p.x,p.y,bike.x,bike.y)<900){
      this.setAiVehiclePhase(plan,'return',now);plan.vehicleId=bike.id;plan.targetX=bike.x;plan.targetY=bike.y;plan.expiresAt=now+AI_VEHICLE_BRAIN.returnTimeoutSeconds;
      p.aiState='RETURN_TO_VEHICLE';intent.state='RETURN_TO_VEHICLE';intent.mode='move';intent.lootId='';
      this.setAiDestination(p,intent,bike.x,bike.y,true);
      if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI VEHICLE] return',{ai:p.id,vehicle:bike.id});
      return;
    }
    this.endAiVehiclePlan(p,intent,'completed');
  }

  private aiVehicleDriveInput(p:PlayerState,plan:AiVehiclePlan,dt:number){
    const bike=this.state.motorcycles.get(plan.vehicleId);
    if(!bike)return false;
    const now=this.now(),progress=distance(bike.x,bike.y,plan.lastX,plan.lastY);
    this.normalizeAiVehiclePlan(plan,now);
    plan.stuckFor=progress<.45?plan.stuckFor+dt:Math.max(0,plan.stuckFor-dt*2.5);
    if(progress>=1.25&&now-(plan.lastRecoveryAt??-99)>=AI_VEHICLE_BRAIN.recoveryResetSeconds)plan.recoveryAttempts=0;
    plan.lastX=bike.x;plan.lastY=bike.y;
    const beginRecovery=()=>{
      if(aiVehicleRecoveryDecision(plan.recoveryAttempts??0)==='abandon')return false;
      plan.recoveryAttempts=(plan.recoveryAttempts??0)+1;plan.lastRecoveryAt=now;plan.reverseUntil=now+AI_VEHICLE_BRAIN.reverseDurationSeconds;plan.avoidSign*=-1;plan.stuckFor=0;
      recordAiVehicleRecovery(this.ensureAiVehicleMemory(p.id));
      if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI VEHICLE] reverse-recovery',{ai:p.id,vehicle:bike.id,attempt:plan.recoveryAttempts});
      return true;
    };
    if(plan.stuckFor>AI_VEHICLE_BRAIN.reverseTriggerSeconds&&now>=plan.reverseUntil&&!beginRecovery())return false;
    if(now<plan.reverseUntil){
      const reverse=bike.rotation+Math.PI;
      this.setAiNeutralInput(p,Math.cos(reverse),Math.sin(reverse),reverse);
      return true;
    }
    const desired=Math.atan2(plan.targetY-bike.y,plan.targetX-bike.x),probe=100+Math.min(150,bike.speed*.32),sign=plan.avoidSign||1;
    const offsets=[0,sign*.34,sign*.68,sign*1.04,-sign*.34,-sign*.68,-sign*1.04,Math.PI];
    let chosen:number|undefined,best=Number.NEGATIVE_INFINITY;const vehicleRadius=this.vehicleRadius(bike);
    for(const offset of offsets){
      const angle=desired+offset,x=clamp(bike.x+Math.cos(angle)*probe,vehicleRadius,this.worldWidth-vehicleRadius),y=clamp(bike.y+Math.sin(angle)*probe,vehicleRadius,this.worldHeight-vehicleRadius);
      if(!this.isVehiclePositionFree(x,y,bike.id)||this.segmentBlocked(bike.x,bike.y,x,y,vehicleRadius+4))continue;
      const gain=distance(bike.x,bike.y,plan.targetX,plan.targetY)-distance(x,y,plan.targetX,plan.targetY);
      const score=gain*4-Math.abs(offset)*28-(offset===Math.PI?150:0);
      if(score>best){best=score;chosen=angle;}
    }
    if(chosen===undefined){
      if(!beginRecovery())return false;
      this.setAiNeutralInput(p,-Math.cos(bike.rotation),-Math.sin(bike.rotation),bike.rotation+Math.PI);return true;
    }
    p.angle=chosen;this.setAiNeutralInput(p,Math.cos(chosen),Math.sin(chosen),chosen);
    return true;
  }

  private runAiVehicleCombat(p:PlayerState,vehicle:MotorcycleState,target:PlayerState){
    if(vehicle.vehicleKind!=='tank'&&vehicle.vehicleKind!=='fusion_robot')return false;
    const d=distance(vehicle.x,vehicle.y,target.x,target.y),aim={aimWorldX:target.x,aimWorldY:target.y},angle=Math.atan2(target.y-vehicle.y,target.x-vehicle.x);
    p.angle=angle;vehicle.turretAngle=angle;
    if(vehicle.vehicleKind==='tank'){
      if(d<=TANK_CANNON_BALANCE.range+40)this.fireTankCannon(p,vehicle,aim);
      return d<=TANK_CANNON_BALANCE.range*.78;
    }
    const targetMechanical=this.tacticalInventory(target.id).exoActive||Boolean(target.isDriving&&target.vehicleId);
    if(targetMechanical&&d<=EMP_EXO_SUIT_BALANCE.empRadius&&this.now()>=vehicle.fusionEmpReadyAt)vehicle.fusionWeaponSlot=4;
    else if(d>460)vehicle.fusionWeaponSlot=1;
    else if(d>250)vehicle.fusionWeaponSlot=2;
    else vehicle.fusionWeaponSlot=3;
    this.fireFusionRobotWeapon(p,vehicle,aim);
    return d<=Math.min(EXO_SUIT_BALANCE.bombRange,680);
  }

  private updateAiVehiclePlan(p:PlayerState,intent:AiIntent,dt:number){
    const plan=this.aiVehiclePlans.get(p.id);
    if(!plan)return false;
    const now=this.now();this.normalizeAiVehiclePlan(plan,now);
    if(now>=plan.expiresAt){
      const bike=this.state.motorcycles.get(plan.vehicleId);
      if(bike&&p.isDriving&&p.vehicleId===bike.id&&shouldAiVehicleKeepPatrolling(bike.vehicleKind,plan.objectiveKind)){this.retargetAiMechanicalPatrol(p,intent,plan,bike,now);return true;}
      if(!this.endAiVehiclePlan(p,intent,'expired',{dismount:true})){plan.expiresAt=now+.6;this.setAiNeutralInput(p);return true;}
      return false;
    }
    if(plan.phase==='ritual'){
      this.setAiNeutralInput(p);
      if(p.werewolf.hasCurse){this.endAiVehiclePlan(p,intent,'completed');this.aiWorldObjectives.delete(p.id);this.beginWerewolfTransform(p);}
      else if(!p.werewolf.ritualizing)this.endAiVehiclePlan(p,intent,'completed');
      return true;
    }
    const objectiveValid=this.refreshAiVehicleTarget(p,plan);
    if(!objectiveValid&&plan.phase!=='return'){this.finishAiVehicleObjective(p,intent);return false;}
    if(plan.phase==='seek'){
      const bike=this.state.motorcycles.get(plan.vehicleId);
      if(now-(plan.phaseStartedAt??plan.startedAt)>=AI_VEHICLE_BRAIN.seekTimeoutSeconds){this.endAiVehiclePlan(p,intent,'lost');return false;}
      if(!bike||bike.destroyed||bike.exploding||bike.driverId&&bike.driverId!==p.id){
        if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI RIVALRY] vehicle-lost',{ai:p.id,vehicle:plan.vehicleId,driver:bike?.driverId??''});
        this.endAiVehiclePlan(p,intent,'lost');return false;
      }
      if(distance(p.x,p.y,bike.x,bike.y)<=MOTORCYCLE_MOUNT_DISTANCE&&this.mountMotorcycle(p,bike)){
        this.setAiVehiclePhase(plan,'drive',now);plan.mountedAt=now;plan.lastX=bike.x;plan.lastY=bike.y;plan.stuckFor=0;plan.recoveryAttempts=0;plan.lastRecoveryAt=-99;recordAiVehicleMount(this.ensureAiVehicleMemory(p.id),bike.id,now);
        if(plan.objectiveKind==='tank'){
          this.retargetAiMechanicalPatrol(p,intent,plan,bike,now);
        }else{p.aiState='DRIVE_TO_OBJECTIVE';intent.state='DRIVE_TO_OBJECTIVE';intent.mode='move';this.setAiNeutralInput(p);}
        if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI VEHICLE] mounted',{ai:p.id,vehicle:bike.id,objective:plan.objectiveKind});
        return true;
      }
      p.aiState='SEEK_VEHICLE';intent.state='SEEK_VEHICLE';intent.mode='move';
      if(intent.route.length===0||distance(intent.routeGoalX,intent.routeGoalY,bike.x,bike.y)>55)this.setAiDestination(p,intent,bike.x,bike.y);
      return false;
    }
    if(plan.phase==='drive'){
      const bike=this.state.motorcycles.get(plan.vehicleId);
      if(!bike||!p.isDriving||p.vehicleId!==bike.id||bike.driverId!==p.id){
        if(p.isDriving)this.detachPlayerFromVehicle(p);
        const disabled=Boolean(bike&&(now<bike.empDisabledUntil||now<bike.mountLockedUntil));
        this.endAiVehiclePlan(p,intent,disabled?'disabled':'lost',{escape:disabled});return false;
      }
      const target=this.findVisibleTarget(p,intent);
      if(target&&this.runAiVehicleCombat(p,bike,target)){
        p.aiState=bike.vehicleKind==='tank'?'TANK_COMBAT':'FUSION_COMBAT';intent.state=p.aiState;intent.mode='hold';this.setAiNeutralInput(p,0,0,p.angle);return true;
      }
      const mountedAt=plan.mountedAt??this.vehicleMotionStates.get(bike.id)?.mountedAt??now;
      if(target&&bike.vehicleKind!=='tank'&&bike.vehicleKind!=='fusion_robot'&&canAiVehicleCombatDismount(mountedAt,now,distance(p.x,p.y,target.x,target.y))){
        if(this.endAiVehiclePlan(p,intent,'combat',{dismount:true})){if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI VEHICLE] dismount-combat',{ai:p.id,target:target.id});return false;}
      }
      if(bike.critical||bike.hp<bike.maxHp*.25){
        this.endAiVehiclePlan(p,intent,'critical',{dismount:true,forceDismount:true,escape:true});return false;
      }
      const targetDistance=distance(bike.x,bike.y,plan.targetX,plan.targetY),arrivalRadius=aiVehicleArrivalRadius(bike.vehicleKind,plan.objectiveKind),speed=Math.max(bike.speed,Math.hypot(bike.velocityX,bike.velocityY));
      if(targetDistance<=arrivalRadius){
        if(shouldAiVehicleKeepPatrolling(bike.vehicleKind,plan.objectiveKind)){this.retargetAiMechanicalPatrol(p,intent,plan,bike,now);return true;}
        if(speed>AI_VEHICLE_BRAIN.arrivalSpeedThreshold){plan.braking=true;p.aiState='VEHICLE_BRAKE';intent.state='VEHICLE_BRAKE';intent.mode='hold';this.setAiNeutralInput(p,0,0,bike.rotation);return true;}
        if(this.dismountMotorcycle(undefined,p)){
          recordAiVehicleExit(this.ensureAiVehicleMemory(p.id),bike.id,now,'objective',true);
          this.setAiVehiclePhase(plan,'walk',now);plan.lastX=p.x;plan.lastY=p.y;p.aiState='DISMOUNT_FOR_OBJECTIVE';intent.state='DISMOUNT_FOR_OBJECTIVE';intent.mode='move';
          this.setAiDestination(p,intent,plan.targetX,plan.targetY,true);
          if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI VEHICLE] dismount-objective',{ai:p.id,kind:plan.objectiveKind,id:plan.objectiveId});
          return false;
        }
        this.setAiNeutralInput(p,0,0,bike.rotation);return true;
      }
      if(aiVehicleShouldBrake(targetDistance,speed,arrivalRadius,MOTORCYCLE_DIRECT_DECELERATION)){plan.braking=true;p.aiState='VEHICLE_BRAKE';intent.state='VEHICLE_BRAKE';intent.mode='hold';this.setAiNeutralInput(p,0,0,bike.rotation);return true;}
      plan.braking=false;
      p.aiState='DRIVE_TO_OBJECTIVE';intent.state='DRIVE_TO_OBJECTIVE';
      if(!this.aiVehicleDriveInput(p,plan,dt)){this.endAiVehiclePlan(p,intent,'stuck',{dismount:true,forceDismount:true,escape:true});return false;}
      return true;
    }
    if(plan.phase==='walk'){
      if((plan.objectiveKind==='zone'||plan.objectiveKind==='patrol')&&distance(p.x,p.y,plan.targetX,plan.targetY)<90){
        this.endAiVehiclePlan(p,intent,'completed');return false;
      }
      p.aiState=plan.objectiveKind==='altar'?'SEEK_ALTAR':plan.objectiveKind==='supply'?'SEEK_SUPPLY':plan.objectiveKind==='loot'?'LOOT_ON_FOOT':'PATROL';
      intent.state=p.aiState;intent.mode='move';
      if(plan.objectiveKind==='loot'){
        const loot=this.state.loot.get(plan.objectiveId);
        if(!loot){this.finishAiVehicleObjective(p,intent);return false;}
        intent.lootId=loot.id;
      }
      if(intent.route.length===0||distance(intent.routeGoalX,intent.routeGoalY,plan.targetX,plan.targetY)>55)this.setAiDestination(p,intent,plan.targetX,plan.targetY);
      return false;
    }
    if(plan.phase==='return'){
      const bike=this.state.motorcycles.get(plan.vehicleId);
      if(now-(plan.phaseStartedAt??now)>=AI_VEHICLE_BRAIN.returnTimeoutSeconds||!bike||bike.driverId||bike.destroyed||bike.exploding||!canUseAiVehicle(this.ensureAiVehicleMemory(p.id),plan.vehicleId,now)){this.endAiVehiclePlan(p,intent,'lost');return false;}
      plan.targetX=bike.x;plan.targetY=bike.y;
      if(distance(p.x,p.y,bike.x,bike.y)<=MOTORCYCLE_MOUNT_DISTANCE&&this.mountMotorcycle(p,bike)){
        plan.mountedAt=now;recordAiVehicleMount(this.ensureAiVehicleMemory(p.id),bike.id,now);this.retargetAiMechanicalPatrol(p,intent,plan,bike,now);
        this.aiWorldObjectives.delete(p.id);
        return true;
      }
      p.aiState='RETURN_TO_VEHICLE';intent.state='RETURN_TO_VEHICLE';intent.mode='move';
      if(intent.route.length===0||distance(intent.routeGoalX,intent.routeGoalY,bike.x,bike.y)>55)this.setAiDestination(p,intent,bike.x,bike.y);
      return false;
    }
    return false;
  }

  private aiRobotDecisionFor(p:PlayerState){
    const existing=this.aiRobotDecision.get(p.id);if(existing)return existing;
    const roll=this.aiObjectiveRoll(p.id,'robot-role'),personality=this.ensureAiProfile(p).personality,decision=personality==='aggressive'?(roll<.58?'assault':roll<.78?'fusion':'emp'):personality==='support'?(roll<.52?'emp':roll<.78?'fusion':'assault'):personality==='scavenger'?(roll<.56?'fusion':roll<.78?'emp':'assault'):roll<.32?'assault':roll<.64?'emp':'fusion';
    this.aiRobotDecision.set(p.id,decision);return decision;
  }

  private maybeActivateAiRobot(p:PlayerState,intent:AiIntent){
    const tactical=this.tacticalInventory(p.id);
    if(tactical.exoActive||tactical.exoAssembling||p.isDriving||p.insideBuilding||p.isSwimming||p.isVaulting||p.werewolf.hasCurse||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing)return false;
    const assaultReady=this.exoPartCounts(tactical,'assault').every((count)=>count>0),empReady=this.exoPartCounts(tactical,'emp').every((count)=>count>0),decision=this.aiRobotDecisionFor(p);
    if(assaultReady&&empReady&&this.activateFusionRobotForPlayer(p)){
      const robot=p.vehicleId?this.state.motorcycles.get(p.vehicleId):undefined;
      if(robot){
        const now=this.now(),plan:AiVehiclePlan={vehicleId:robot.id,preferredVehicleId:robot.id,phase:'drive',objectiveKind:'patrol',objectiveId:'fusion-patrol',targetX:robot.x,targetY:robot.y,startedAt:now,expiresAt:now+40,avoidSign:this.aiObjectiveRoll(p.id,robot.id)<.5?-1:1,stuckFor:0,reverseUntil:0,lastX:robot.x,lastY:robot.y,phaseStartedAt:now,mountedAt:now,recoveryAttempts:0,lastRecoveryAt:-99,braking:false,patrolGeneration:0};
        this.aiVehiclePlans.set(p.id,plan);recordAiVehicleMount(this.ensureAiVehicleMemory(p.id),robot.id,now);this.retargetAiMechanicalPatrol(p,intent,plan,robot,now);
      }
      return true;
    }
    const threatened=p.hp<45||Boolean(intent.targetId);
    if((decision==='assault'||decision==='fusion'&&threatened)&&assaultReady)return this.activateExoSuitForPlayer(p,'assault');
    if((decision==='emp'||decision==='fusion'&&threatened)&&empReady)return this.activateExoSuitForPlayer(p,'emp');
    return false;
  }

  private runAiTacticalActions(p:PlayerState,target?:PlayerState){
    const now=this.now();if(now<(this.aiTacticalAt.get(p.id)??0)||!target?.alive||p.isDriving||p.werewolf.transformed||p.werewolf.transformPreparing||p.werewolf.ritualizing)return false;
    const d=distance(p.x,p.y,target.x,target.y);if(d>900||this.firstObstacleHitT(p.x,p.y,target.x,target.y,3)!==null)return false;
    const enemyVehicle=target.isDriving&&target.vehicleId?this.state.motorcycles.get(target.vehicleId):undefined;
    const tactical=this.tacticalInventory(p.id),profile=this.ensureAiProfile(p),humanMemory=this.ensureAiMemory(p),targetInput=this.inputs.get(target.id),toAiX=(p.x-target.x)/Math.max(1,d),toAiY=(p.y-target.y)/Math.max(1,d),targetClosing=Boolean(targetInput&&(targetInput.x*toAiX+targetInput.y*toAiY)>.35),brain=this.ensureAiTacticalBrain(p.id);
    const decision=decideAiTacticalAction(brain,{now,targetId:target.id,distance:d,targetMounted:Boolean(enemyVehicle),targetMechanical:Boolean(enemyVehicle&&enemyVehicle.vehicleKind!=='motorcycle'||this.tacticalInventory(target.id).exoActive),targetClosing,recentlyDamaged:humanMemory.damagedAt>=now-3,selfHp:p.hp,outnumberedBy:this.aiCombatOutnumberedBy(p,target),reloading:this.reloadUntil.has(p.id),hunterDroneCount:tactical.hunterDroneCount,spiderMineCount:tactical.spiderMineCount,stripTrapCount:tactical.stripTrapCount,throwableType:p.throwableType,throwableCount:p.throwableCount,ownActiveMines:this.spiderMines().filter((mine)=>mine.ownerId===p.id).length,ownActiveStripTraps:[...this.state.stripTraps.values()].filter((trap)=>trap.ownerId===p.id).length,personality:profile.personality,aggression:profile.aggression,riskAvoidance:profile.riskAvoidance,droneSearchRadius:HUNTER_DRONE_BALANCE.searchRadius,fragSafeDistance:THROWABLE_CONFIGS.fragGrenade.effectRadius*1.25});
    if(decision.action==='none')return false;
    const aim=Math.atan2(target.y-p.y,target.x-p.x);p.angle=aim;
    let used=false;
    if(decision.action==='launch_drones')used=Boolean(this.launchHunterDronesForPlayer(p,undefined,decision.deployCount));
    else if(decision.action==='throw_frag'||decision.action==='throw_smoke'||decision.action==='throw_incendiary')used=this.throwForPlayer(p,{aimX:Math.cos(aim),aimY:Math.sin(aim)},clamp((d-120)/360*THROWABLE_MAX_CHARGE_MS,120,THROWABLE_MAX_CHARGE_MS));
    else if(decision.action==='place_spider_mine')used=this.placeSpiderMineForPlayer(p);
    else if(decision.action==='place_strip_trap')used=this.placeStripTrapForPlayer(p);
    if(!used){this.aiTacticalAt.set(p.id,now+.35);return false;}
    recordAiTacticalAction(brain,decision,now,target.id);this.aiTacticalAt.set(p.id,brain.actionLockedUntil);
    if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI TACTICAL]',{ai:p.id,target:target.id,action:decision.action,reason:decision.reason,score:Math.round(decision.score),count:decision.deployCount});
    return true;
  }

  private runAiExoCombat(p:PlayerState,target:PlayerState,intent:AiIntent,dt:number){
    const exo=this.tacticalInventory(p.id),memory=this.ensureAiMemory(p),profile=this.ensureAiProfile(p),now=this.now();if(!exo.exoActive)return false;
    if(now>=memory.nextVisionCheckAt){memory.nextVisionCheckAt=now+AI_HUMANIZATION.visualRefreshSeconds;memory.targetVisible=this.aiCanVisuallyAcquire(p,target,intent);if(memory.targetVisible)this.rememberAiTarget(p,target,intent);else this.markAiTargetLost(p,intent,target);}
    if(!memory.targetVisible)return true;
    const d=distance(p.x,p.y,target.x,target.y),desiredAngle=Math.atan2(target.y-p.y,target.x-p.x);p.angle=turnAngleToward(p.angle,desiredAngle,profile.turnRate*1.12*dt);if(Math.abs(this.angleDiff(desiredAngle,p.angle))>.18)return true;
    const aim={aimWorldX:target.x,aimWorldY:target.y},targetMechanical=target.isDriving||this.tacticalInventory(target.id).exoActive;
    p.aiState=exo.exoKind==='emp'?'EMP_ROBOT_COMBAT':'ASSAULT_ROBOT_COMBAT';intent.state=p.aiState;
    if(exo.exoKind==='emp'){
      if(targetMechanical&&d<=EMP_EXO_SUIT_BALANCE.empRadius*.92)this.fireEmpExoPulseForPlayer(p);
      this.fireEmpExoMachineGunForPlayer(p,aim);
    }else if((targetMechanical||d>320)&&d<=EXO_SUIT_BALANCE.bombRange)this.fireExoBombForPlayer(p,aim);
    else this.fireExoLaserForPlayer(p,aim);
    return true;
  }

  private runAiWerewolfCombat(p:PlayerState,target:PlayerState,intent:AiIntent,dt:number){
    if(!p.werewolf.transformed)return false;
    const memory=this.ensureAiMemory(p),profile=this.ensureAiProfile(p),now=this.now();if(now>=memory.nextVisionCheckAt){memory.nextVisionCheckAt=now+AI_HUMANIZATION.visualRefreshSeconds;memory.targetVisible=this.aiCanVisuallyAcquire(p,target,intent);if(memory.targetVisible)this.rememberAiTarget(p,target,intent);else this.markAiTargetLost(p,intent,target);}
    if(!memory.targetVisible){this.setAiNeutralInput(p);return true;}
    const d=distance(p.x,p.y,target.x,target.y),desiredAngle=Math.atan2(target.y-p.y,target.x-p.x);p.angle=turnAngleToward(p.angle,desiredAngle,profile.turnRate*1.35*dt);p.aiState='WEREWOLF_HUNT';intent.state='WEREWOLF_HUNT';
    const sprint=d>WEREWOLF_BALANCE.clawRange*.9&&p.werewolf.sprintGauge>.08;this.setAiNeutralInput(p,Math.cos(p.angle),Math.sin(p.angle),p.angle,sprint);
    if(d<=WEREWOLF_BALANCE.clawRange+PLAYER_HIT_RADIUS+8){intent.mode='hold';intent.route=[];this.werewolfClaw(p);}else{intent.mode='move';if(intent.route.length===0||distance(intent.routeGoalX,intent.routeGoalY,target.x,target.y)>90)this.setAiDestination(p,intent,target.x,target.y);}
    return true;
  }

  private updateAi(dt:number){
    const tickStartedAt=performance.now(),now=this.now();
    this.cleanupLootReservations(now);
    this.processAiDialogueResponses();
    for(const p of this.state.players.values()){
      if(!p.ai||!p.alive||p.phase!=='landed')continue;
      if(this.practiceMode&&p.id==='core-siege-practice-target')continue;
      if(p.isVaulting){
        if(!this.vaultJobs.has(p.id))this.clearVault(p);
        else continue;
      }
      let intent=this.aiIntent.get(p.id);
      if(!intent){intent=this.newAiIntent(p);this.aiIntent.set(p.id,intent);}
      if(now<p.werewolf.actionLockedUntil){intent.mode='hold';intent.route=[];intent.targetId='';p.aiState='STUNNED';this.setAiNeutralInput(p);continue;}
      const tactical=this.tacticalInventory(p.id);
      if(tactical.exoActive&&now<tactical.empDisabledUntil){intent.mode='hold';intent.route=[];intent.targetId='';p.aiState='EMP_DISABLED';this.setAiNeutralInput(p);continue;}
      const memory=this.ensureAiMemory(p);this.ensureAiProfile(p);this.updateAiRoomMemory(p,memory);this.maybeAiCasualDialogue(p,intent);
      if(!this.aiLandedAt.has(p.id))this.aiLandedAt.set(p.id,now);
      if(p.werewolf.ritualizing){
        const plan=this.aiVehiclePlans.get(p.id);if(plan)plan.phase='ritual';
        this.setAiNeutralInput(p);continue;
      }
      if(p.werewolf.hasCurse&&!p.werewolf.transformPreparing&&!p.werewolf.transformed){
        if(p.isDriving){const bike=this.state.motorcycles.get(p.vehicleId);if(bike)this.forceDismountMotorcycle(p,bike);}
        this.aiVehiclePlans.delete(p.id);this.aiWorldObjectives.delete(p.id);this.beginWerewolfTransform(p);this.setAiNeutralInput(p);continue;
      }
      if(this.maybeActivateAiRobot(p,intent)){this.setAiNeutralInput(p);continue;}
      const activePlan=this.aiVehiclePlans.get(p.id);
      if(!activePlan&&now>=(this.aiThinkAt.get(p.id)??0)){
        this.aiThinkAt.set(p.id,now+(this.state.difficulty==='hard'?.14:this.state.difficulty==='easy'?.34:.22));
        this.planAi(p,intent);
        this.maybeStartAiVehiclePlan(p,intent);
      }
      if(this.updateAiVehiclePlan(p,intent,dt))continue;
      if(this.handleAiWorldObjectiveAtPosition(p,intent))continue;
      this.runCoreSiegeAiObjective(p,intent,dt);
      this.runAi(p,intent,dt);
    }
    this.recordAiBrainTick(performance.now()-tickStartedAt,now);
  }

  private recordAiBrainTick(elapsedMs:number,now=this.now()){
    this.aiBrainTickSamples.push(elapsedMs);
    if(this.aiBrainTickSamples.length>240)this.aiBrainTickSamples.splice(0,this.aiBrainTickSamples.length-240);
    if(AI_HUMAN_DEBUG&&now>=this.aiBrainTelemetryAt){this.aiBrainTelemetryAt=now+10;console.debug('[DROP8 AI BRAIN]',this.aiBrainTelemetrySnapshot(now));}
  }

  private aiBrainTelemetrySnapshot(now=this.now()){
    return{...summarizeAiExecutives([...this.aiIntent.values()].map((intent)=>this.ensureAiExecutive(intent)),this.aiBrainTickSamples,now),locomotion:aiLocomotionSummary(this.aiLocomotionBrains.values(),now),experience:aiExperienceSummary(this.aiExperienceBrains.values(),now),director:aiArenaDirectorSummary(this.aiArenaDirector,now)};
  }

  private applyAiArenaDirector(p:PlayerState,intent:AiIntent){
    if(this.gameMode!=='openArena'||this.openArenaRoundState!=='active'||this.state.phase!=='ACTIVE'||!this.aiCombatReady(p)||p.hp<55)return false;
    const now=this.now(),combatants=[...this.state.players.values()].filter((player)=>player.alive&&player.phase==='landed'),aiCount=combatants.filter((player)=>player.ai).length,humanCombatants=combatants.length-aiCount,engagedAi=[...this.aiIntent.values()].filter((candidate)=>candidate.targetId&&this.state.players.get(candidate.targetId)?.alive).length,observerArena=this.arenaSpectators.size>0||this.openArenaConfig?.maxHumans===0;
    maybeStartAiArenaIntervention(this.aiArenaDirector,{now,active:observerArena,aiCount,humanCombatants,engagedAi,centerX:this.state.zoneActive?this.state.zoneX:this.worldSize/2,centerY:this.state.zoneActive?this.state.zoneY:this.worldSize/2});
    if(!isAiArenaInterventionActive(this.aiArenaDirector,now))return false;
    const role=aiRolePlan(this.ensureAiProfile(p).personality);if(!shouldAiJoinArenaIntervention(p.id,this.aiArenaDirector.generation,role))return false;
    const raw=aiArenaDirectorWaypoint(this.aiArenaDirector,p.id,role),clamped={x:clamp(raw.x,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS),y:clamp(raw.y,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS)},target=this.isPositionFree(clamped.x,clamped.y)?clamped:this.findNearestFreePoint(clamped.x,clamped.y,260)??clamped,key=`director:${this.aiArenaDirector.generation}`;
    if(!this.startAiGoal(intent,'patrol',key,1.2,false,false,'arena-director'))return false;
    intent.itemDetourActive=false;intent.lootId='';intent.targetId='';p.aiState='DIRECTED_PATROL';intent.state='DIRECTED_PATROL';intent.mode='move';
    if(intent.route.length===0||distance(intent.routeGoalX,intent.routeGoalY,target.x,target.y)>60)this.setAiDestination(p,intent,target.x,target.y);
    return true;
  }

  private aiZoneTarget(p:PlayerState,cx:number,cy:number,radius:number):Point{
    let hash=0;
    for(const char of p.id)hash=(hash*31+char.charCodeAt(0))>>>0;
    const angle=(hash%360)/180*Math.PI;
    const ring=radius*(.18+((hash>>>8)%28)/100);
    const x=clamp(cx+Math.cos(angle)*ring,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS);
    const y=clamp(cy+Math.sin(angle)*ring,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
    return this.isPositionFree(x,y)?{x,y}:this.findNearestFreePoint(x,y,260)??{x:cx,y:cy};
  }

  private aiHasUsableGun(p:PlayerState){
    for(const id of [p.primary,p.secondary]){
      if(!id)continue;
      const weapon=WEAPONS[id as WeaponId];
      if(weapon&&this.getWeaponMagazine(p,weapon.id)+this.getAmmo(p,weapon.ammoType)>0)return true;
    }
    return false;
  }

  private aiCombatReady(p:PlayerState){
    if(p.hp<50)return false;
    for(const id of [p.primary,p.secondary]){
      if(!id)continue;
      const weapon=WEAPONS[id as WeaponId];
      if(weapon&&this.getWeaponMagazine(p,weapon.id)>0)return true;
    }
    return false;
  }

  private releaseLootReservation(aiId:string,lootId=''){
    for(const [id,reservation] of [...this.lootReservations]){
      if(reservation.aiId===aiId&&(!lootId||lootId===id))this.lootReservations.delete(id);
    }
  }

  private reserveLoot(p:PlayerState,loot:LootState){
    this.releaseLootReservation(p.id);
    this.lootReservations.set(loot.id,{aiId:p.id,expiresAt:this.now()+3,lastDistance:distance(p.x,p.y,loot.x,loot.y)});
  }

  private cleanupLootReservations(now=this.now()){
    for(const [lootId,reservation] of [...this.lootReservations]){
      const ai=this.state.players.get(reservation.aiId);
      const loot=this.state.loot.get(lootId);
      if(!ai?.alive||!loot||now>=reservation.expiresAt){this.lootReservations.delete(lootId);continue;}
      const current=distance(ai.x,ai.y,loot.x,loot.y);
      if(current>1100||current>reservation.lastDistance+180){this.lootReservations.delete(lootId);continue;}
      if(current<reservation.lastDistance-8){reservation.lastDistance=current;reservation.expiresAt=now+3;}
    }
  }

  private ensureAiExecutive(intent:AiIntent){
    if(!intent.executive)intent.executive=createAiExecutiveMemory(this.now());
    return intent.executive;
  }

  private clearAiGoal(intent:AiIntent,outcome:AiGoalOutcome='invalid',reason='goal-cleared'){
    if(intent.goalKind!=='none')finishAiExecutiveGoal(this.ensureAiExecutive(intent),outcome,reason);
    intent.goalKind='none';intent.goalKey='';intent.goalLockedUntil=0;
  }

  private refreshAiGoalValidity(p:PlayerState,intent:AiIntent,now=this.now()){
    const executive=this.ensureAiExecutive(intent);pruneAiExecutiveMemory(executive,now);
    if(intent.failedGoalUntil<=now){intent.failedGoalKey='';intent.failedGoalUntil=0;}
    if(intent.failedShoreExitUntil<=now){intent.failedShoreExitId='';intent.failedShoreExitUntil=0;}
    if(intent.goalKind==='combat'&&!this.state.players.get(intent.goalKey.replace(/^combat:/,''))?.alive)this.clearAiGoal(intent,'completed','combat-target-gone');
    else if(intent.goalKind==='loot'&&!this.state.loot.has(intent.goalKey))this.clearAiGoal(intent,'completed','loot-gone');
    else if(intent.goalKind==='objective'&&!this.currentAiWorldObjective(p))this.clearAiGoal(intent,'invalid','world-objective-gone');
    else if(intent.goalKind==='heal'&&!this.healUntil.has(p.id))this.clearAiGoal(intent,'completed','heal-ended');
    else if(intent.goalKind==='swim-exit'&&!p.isSwimming)this.clearAiGoal(intent,'completed','shore-reached');
    else if(intent.goalKind==='zone'&&!this.state.zoneActive)this.clearAiGoal(intent,'completed','zone-safe');
    if(intent.goalKey&&(intent.failedGoalKey===intent.goalKey&&intent.failedGoalUntil>now||isAiExecutiveGoalBlocked(executive,intent.goalKind,intent.goalKey,now)))this.clearAiGoal(intent,'failed','goal-blocked');
  }

  private startAiGoal(intent:AiIntent,kind:AiGoalKind,key:string,lockSeconds:number,force=false,emergency=false,reason=''){
    const now=this.now();
    const previousKind=intent.goalKind,previousKey=intent.goalKey;
    const executive=this.ensureAiExecutive(intent),decision=requestAiGoalTransition(executive,{currentKind:previousKind,currentKey:previousKey,lockedUntil:intent.goalLockedUntil,nextKind:kind,nextKey:key,now,force,emergency,reason});
    if(!decision.allowed)return false;
    const changed=intent.goalKind!==kind||intent.goalKey!==key;
    if(changed&&previousKind!=='none')finishAiExecutiveGoal(executive,'interrupted',`replaced:${previousKind}`);
    intent.goalKind=kind;intent.goalKey=key;if(changed||force&&now>=intent.goalLockedUntil)intent.goalLockedUntil=now+aiGoalContractSeconds(kind,lockSeconds);
    if(changed){intent.progressSamples=[];intent.lastProgressSampleAt=0;intent.oscillationCount=0;intent.lastGoalDistance=distance(intent.lastX,intent.lastY,intent.tx,intent.ty);if(kind==='combat'){intent.combatHoldStartedAt=0;intent.combatBlockedFor=0;}}
    return true;
  }

  private failAiGoal(intent:AiIntent,key:string,cooldown:number=AI_NAVIGATION_RECOVERY.failedGoalCooldownSeconds,kind:AiGoalKind=intent.goalKey===key?intent.goalKind:'loot'){
    const now=this.now(),effectiveCooldown=aiGoalFailureCooldownSeconds(kind,cooldown);
    intent.failedGoalKey=key;intent.failedGoalUntil=now+effectiveCooldown;
    blockAiExecutiveGoal(this.ensureAiExecutive(intent),kind,key,now+effectiveCooldown,'failed');
    if(intent.goalKey===key)this.clearAiGoal(intent,'failed','goal-progress-failed');
  }

  private selectAiShoreExit(p:PlayerState,intent:AiIntent){
    const now=this.now();
    if(intent.swimExitId&&now<intent.swimExitLockedUntil){
      const existing=this.map.shoreExits.find((exit)=>exit.id===intent.swimExitId);
      if(existing&&!(intent.failedShoreExitId===existing.id&&now<intent.failedShoreExitUntil))return existing;
    }
    let selected:(typeof this.map.shoreExits)[number]|undefined,best=Number.POSITIVE_INFINITY;
    for(const exit of this.map.shoreExits){
      if(intent.failedShoreExitId===exit.id&&now<intent.failedShoreExitUntil)continue;
      const entryX=exit.entry.x+exit.entry.w/2,entryY=exit.entry.y+exit.entry.h/2;
      const blocked=this.segmentBlocked(p.x,p.y,entryX,entryY,PLAYER_BODY_RADIUS*.55);
      let score=distance(p.x,p.y,entryX,entryY)+(blocked?320:0);
      if(this.state.zoneActive){
        const outside=distance(exit.landingPoint.x,exit.landingPoint.y,this.state.zoneX,this.state.zoneY)-this.state.zoneRadius;
        score+=Math.max(0,outside)*1.8;
      }
      if(intent.goalKind==='zone')score+=distance(exit.landingPoint.x,exit.landingPoint.y,intent.tx,intent.ty)*.18;
      if(score<best){best=score;selected=exit;}
    }
    if(selected){intent.swimExitId=selected.id;intent.swimExitLockedUntil=now+AI_NAVIGATION_RECOVERY.swimExitLockSeconds;}
    return selected;
  }

  private planAiSwimEscape(p:PlayerState,intent:AiIntent){
    const exit=this.selectAiShoreExit(p,intent);
    if(!exit)return false;
    const key=`swim:${exit.id}`;
    this.startAiGoal(intent,'swim-exit',key,AI_NAVIGATION_RECOVERY.swimExitLockSeconds,true,true,'swim-escape');
    intent.targetId='';intent.lootId='';intent.mode='move';intent.state='SWIM_ESCAPE';p.aiState='SWIM_ESCAPE';
    const entry={x:exit.entry.x+exit.entry.w/2,y:exit.entry.y+exit.entry.h/2};
    const route=[...this.buildRoute(p.x,p.y,entry.x,entry.y,intent),exit.landingPoint].filter((point,index,array)=>index===0||distance(point.x,point.y,array[index-1]!.x,array[index-1]!.y)>8);
    const routeChanged=intent.route.length===0||intent.swimExitId!==exit.id||distance(intent.routeGoalX,intent.routeGoalY,exit.landingPoint.x,exit.landingPoint.y)>18;
    intent.tx=exit.landingPoint.x;intent.ty=exit.landingPoint.y;intent.routeGoalX=intent.tx;intent.routeGoalY=intent.ty;
    if(routeChanged)intent.route=route;
    intent.repathAt=this.now()+.8;intent.lastRepathReason='swim-exit';
    return true;
  }

  private segmentCrossesDeepWater(x1:number,y1:number,x2:number,y2:number){
    const length=distance(x1,y1,x2,y2),steps=Math.max(2,Math.ceil(length/AI_NAVIGATION_RECOVERY.waterProbeStep));
    for(let index=1;index<steps;index++){
      const t=index/steps,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t;
      if(this.terrainKindAt(x,y)==='deep-water')return true;
    }
    return false;
  }

  private sameSideWaterDetour(sx:number,sy:number,tx:number,ty:number,side:'west'|'east',intent?:AiIntent){
    const points:Point[]=[];
    for(const crossing of this.map.landCrossings){
      if(!crossing.allowsPlayer)continue;
      points.push(side==='west'?{x:crossing.rect.x-42,y:crossing.rect.y+crossing.rect.h/2}:{x:crossing.rect.x+crossing.rect.w+42,y:crossing.rect.y+crossing.rect.h/2});
    }
    for(const exit of this.map.shoreExits)if((exit.normal.x<0?'west':'east')===side)points.push(exit.landingPoint);
    let selected:Point|undefined,best=Number.POSITIVE_INFINITY;
    for(const point of points){
      if(this.segmentCrossesDeepWater(sx,sy,point.x,point.y)||this.segmentCrossesDeepWater(point.x,point.y,tx,ty))continue;
      const score=distance(sx,sy,point.x,point.y)+distance(point.x,point.y,tx,ty);
      if(score<best){best=score;selected=point;}
    }
    if(!selected)return undefined;
    const first=this.buildRoute(sx,sy,selected.x,selected.y,intent),second=this.buildRoute(selected.x,selected.y,tx,ty,intent);
    return[...first,...second].filter((point,index,array)=>index===0||distance(point.x,point.y,array[index-1]!.x,array[index-1]!.y)>8);
  }

  private updateAiProgress(p:PlayerState,intent:AiIntent,dt:number,beforeWaypoint:number,beforeGoal:number,waypoint:Point){
    const actualMove=distance(p.x,p.y,intent.lastX,intent.lastY),waypointGain=beforeWaypoint-distance(p.x,p.y,waypoint.x,waypoint.y),goalGain=beforeGoal-distance(p.x,p.y,intent.routeGoalX,intent.routeGoalY);
    intent.stuckFor=nextAiStallSeconds(intent.stuckFor,dt,actualMove,waypointGain,goalGain);
    if(Math.max(waypointGain,goalGain)>AI_NAVIGATION_RECOVERY.healthyGoalGain)intent.stuckCount=Math.max(0,intent.stuckCount-1);
    const now=this.now();
    if(now-intent.lastProgressSampleAt>=AI_NAVIGATION_RECOVERY.progressSampleSeconds){
      intent.progressSamples=pushAiProgressSample(intent.progressSamples,{x:p.x,y:p.y,goalDistance:distance(p.x,p.y,intent.routeGoalX,intent.routeGoalY),at:now});intent.lastProgressSampleAt=now;
      if(detectAiOscillation(intent.progressSamples)){intent.oscillationCount++;intent.stuckFor=Math.max(intent.stuckFor,AI_NAVIGATION_RECOVERY.oscillationStallSeconds);}
    }
  }

  private aiMovementCrowdingAt(p:PlayerState,targetId:string,x:number,y:number){
    let pressure=0;
    for(const other of this.state.players.values()){
      if(other.id===p.id||other.id===targetId||!other.alive||other.phase!=='landed')continue;
      if(this.matchFormat==='teams'&&!this.sameCombatTeam(p,other))continue;
      const spacing=this.gameMode==='coreSiege'?CORE_SIEGE_CONFIG.aiFormationSpacing:96;
      const gap=distance(x,y,other.x,other.y);if(gap<spacing)pressure+=(spacing-gap)*1.6;
    }
    return pressure;
  }

  private runAiCombatHold(p:PlayerState,intent:AiIntent,target:PlayerState,dt:number){
    const now=this.now(),memory=this.ensureAiMemory(p),profile=this.ensureAiProfile(p),locomotion=this.ensureAiLocomotionBrain(p),weaponId=p.equipped as WeaponId;
    recordAiLocomotionPosition(locomotion,p.x,p.y,now);
    const blocked=!memory.targetVisible||this.bulletRects().some((rect)=>this.segmentRect(p.x,p.y,target.x,target.y,rect));
    intent.combatBlockedFor=blocked?intent.combatBlockedFor+dt:Math.max(0,intent.combatBlockedFor-dt*3);
    if(blocked&&intent.combatBlockedFor>AI_NAVIGATION_RECOVERY.blockedCombatRepathSeconds){
      const escape=this.findAiEscapePoint(p,intent);
      if(escape){intent.mode='move';intent.route=[escape];intent.repathAt=now+1;intent.lastRepathReason='combat-wall-flank';intent.combatBlockedFor=0;this.aiThinkAt.set(p.id,now+.65);return true;}
      if(intent.combatBlockedFor>AI_NAVIGATION_RECOVERY.blockedCombatGiveUpSeconds){this.failAiGoal(intent,`combat:${target.id}`,1.6);intent.targetId='';intent.mode='move';intent.route=[];intent.combatBlockedFor=0;this.aiThinkAt.set(p.id,0);return true;}
    }
    if(intent.combatHoldStartedAt<=0)intent.combatHoldStartedAt=now;
    const settle=weaponId==='sniper'?.85:weaponId==='bazooka'?.7:.28;
    if(now-intent.combatHoldStartedAt<settle)return true;
    const d=distance(p.x,p.y,target.x,target.y),desired=this.desiredRange(p.equipped as EquippedId)*aiRolePlan(profile.personality).combatRangeMultiplier,base=Math.atan2(target.y-p.y,target.x-p.x),towardX=Math.cos(base),towardY=Math.sin(base),movementEfficiency=aiLocomotionEfficiency(locomotion,now);
    const stride=weaponId==='sniper'?42:weaponId==='bazooka'?50:72,preferredSign=intent.avoidSign||1,rangeError=d-desired,rangeDirection=rangeError>=0?1:-1,rangeBlend=clamp(Math.abs(rangeError)/Math.max(90,desired*.42),0,.8);
    const currentDanger=aiDangerScoreAt(this.ensureAiExperienceBrain(p.id),p.x,p.y,now),currentCrowding=this.aiMovementCrowdingAt(p,target.id,p.x,p.y),recentlyDamaged=memory.damagedAt>=now-AI_COMBAT_TACTICS.recentAttackerSeconds;
    const hpRatio=p.hp/this.playerMaxHp(p),emergency=currentDanger>70||recentlyDamaged&&hpRatio<.38,urgency=clamp(.12+Math.abs(rangeError)/Math.max(1,desired)*.55+(1-hpRatio)*.45+currentDanger/180*.65,0,1),needsCover=hpRatio<.55||this.reloadUntil.has(p.id);
    const strafeBias=weaponId==='sniper'?2:weaponId==='bazooka'?4:8+profile.aggression*4,holdBias=(weaponId==='sniper'?5:weaponId==='bazooka'?3:1)+Math.max(0,.5-movementEfficiency)*70+(this.reloadUntil.has(p.id)?35:0);
    const specs:Array<{key:string;directionX:number;directionY:number;baseBias:number}>=[{key:'hold',directionX:0,directionY:0,baseBias:holdBias}];
    for(const sign of [preferredSign,-preferredSign])specs.push({key:sign>0?'left':'right',directionX:-towardY*sign+towardX*rangeDirection*rangeBlend,directionY:towardX*sign+towardY*rangeDirection*rangeBlend,baseBias:strafeBias+(sign===preferredSign?1.5:0)});
    if(Math.abs(rangeError)>Math.max(55,desired*.13))specs.push({key:rangeDirection>0?'approach':'retreat',directionX:towardX*rangeDirection,directionY:towardY*rangeDirection,baseBias:5});
    const candidates:AiMovementCandidate[]=[];
    for(const spec of specs){
      const length=Math.hypot(spec.directionX,spec.directionY),directionX=length>0?spec.directionX/length:0,directionY=length>0?spec.directionY/length:0;
      const x=clamp(p.x+directionX*stride,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS),y=clamp(p.y+directionY*stride,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
      if(length>0&&distance(p.x,p.y,x,y)<stride*.25)continue;
      if(length>0&&(this.terrainKindAt(x,y)==='deep-water'||!this.playerMovementPositionFree(p,x,y)||this.segmentBlocked(p.x,p.y,x,y,PLAYER_BODY_RADIUS)))continue;
      const candidateDistance=distance(x,y,target.x,target.y),rangeGain=Math.abs(d-desired)-Math.abs(candidateDistance-desired),candidateDanger=aiDangerScoreAt(this.ensureAiExperienceBrain(p.id),x,y,now),candidateCrowding=this.aiMovementCrowdingAt(p,target.id,x,y);
      const lineBlocked=length>0&&this.bulletRects().some((rect)=>this.segmentRect(x,y,target.x,target.y,rect)),movementAngle=length>0?Math.atan2(directionY,directionX):base,weaponAimWeight=weaponId==='sniper'?4:weaponId==='bazooka'?3:1.8;
      candidates.push({key:spec.key,directionX,directionY,rangeGain,coverGain:lineBlocked?(needsCover?4:-7):0,dangerAvoidance:currentDanger-candidateDanger,separationGain:currentCrowding-candidateCrowding,aimInstability:length>0?Math.abs(this.angleDiff(base,movementAngle))*weaponAimWeight:0,baseBias:spec.baseBias});
    }
    const decision=chooseAiMovement(locomotion,candidates,{context:'combat',now,urgency,emergency});
    if(!decision||Math.hypot(decision.directionX,decision.directionY)<.001)return true;
    const cross=towardX*decision.directionY-towardY*decision.directionX;if(Math.abs(cross)>.12){intent.combatStrafeSign=cross>0?1:-1;intent.avoidSign=intent.combatStrafeSign;}
    const step=(this.state.difficulty==='hard'?185:this.state.difficulty==='easy'?125:155)*dt;
    if(!this.tryMove(p,decision.directionX*step,decision.directionY*step))locomotion.selectedKey='';
    this.updateSwimmingState(p);
    return true;
  }

  private assignLootIntent(p:PlayerState,intent:AiIntent,loot:LootState,early=false){
    const now=this.now();
    if(intent.failedGoalKey===loot.id&&now<intent.failedGoalUntil||isAiExecutiveGoalBlocked(this.ensureAiExecutive(intent),'loot',loot.id,now))return false;
    const resumingSweep=this.hasActiveAiSafeSweep(intent);
    if(!this.startAiGoal(intent,'loot',loot.id,early?1.8:2.6,false,false,early?'early-loot':'loot'))return false;
    this.reserveLoot(p,loot);
    intent.lootId=loot.id;
    intent.targetId='';
    intent.itemDetourActive=resumingSweep;
    p.aiState=early?'EARLY_LOOT':this.aiLootState(loot.kind as LootKind);
    intent.state=p.aiState;
    intent.mode='move';
    this.setAiDestination(p,intent,loot.x,loot.y);
    return true;
  }

  private aiSweepZone():AiSweepZone{
    if(!this.state.zoneActive)return{active:false,centerX:this.worldWidth/2,centerY:this.worldHeight/2,radius:Math.max(this.worldWidth,this.worldHeight)*.42,signature:'free'};
    const advancing=['ANNOUNCING','WAITING','SHRINKING'].includes(this.state.zoneState);
    const centerX=advancing?this.state.nextZoneX:this.state.zoneX,centerY=advancing?this.state.nextZoneY:this.state.zoneY,radius=advancing?this.state.nextZoneRadius:this.state.zoneRadius;
    const signature=`${this.state.zoneStage}:${this.state.zoneState}:${Math.round(centerX/80)}:${Math.round(centerY/80)}:${Math.round(radius/120)}`;
    return{active:true,centerX,centerY,radius,signature};
  }

  private hasActiveAiSafeSweep(intent:AiIntent,now=this.now()){
    return Boolean(intent.sweepKey&&intent.sweepExpiresAt>now&&intent.sweepZoneSignature===this.aiSweepZone().signature);
  }

  private ensureAiSafeSweepTarget(p:PlayerState,intent:AiIntent){
    const now=this.now(),zone=this.aiSweepZone();
    const arrived=distance(p.x,p.y,intent.sweepTargetX,intent.sweepTargetY)<=AI_SAFE_ZONE_SWEEP.arrivalDistance;
    const failed=intent.failedGoalKey===intent.sweepKey&&intent.failedGoalUntil>now;
    const expired=intent.sweepExpiresAt<=now,zoneChanged=intent.sweepZoneSignature!==zone.signature;
    if(intent.sweepKey&&intent.goalKind==='patrol'&&intent.goalKey===intent.sweepKey&&(arrived||expired||zoneChanged||failed)){
      if(failed)this.clearAiGoal(intent,'failed','safe-sweep-failed');
      else if(arrived)this.clearAiGoal(intent,'completed','safe-sweep-arrived');
      else this.clearAiGoal(intent,'invalid',zoneChanged?'safe-sweep-zone-changed':'safe-sweep-expired');
    }
    if(!intent.sweepKey||expired||zoneChanged||arrived||failed){
      const generated=createAiSafeZoneSweepTarget({aiId:p.id,x:p.x,y:p.y,worldSize:this.worldSize,generation:intent.sweepGeneration+1,zone});
      const free=this.isPositionFree(generated.x,generated.y)?generated:this.findNearestFreePoint(generated.x,generated.y,360)??generated;
      intent.sweepTargetX=free.x;intent.sweepTargetY=free.y;intent.sweepStartedAt=now;intent.sweepExpiresAt=now+AI_SAFE_ZONE_SWEEP.targetLifetimeSeconds;
      intent.sweepZoneSignature=zone.signature;intent.sweepGeneration=generated.generation;intent.sweepKey=generated.key;intent.sweepSector=generated.sector;
    }
    return{x:intent.sweepTargetX,y:intent.sweepTargetY,key:intent.sweepKey};
  }

  private applyAiSafeSweep(p:PlayerState,intent:AiIntent,force=false){
    const sweep=this.ensureAiSafeSweepTarget(p,intent);
    const sweepChanged=intent.goalKind==='patrol'&&intent.goalKey!==sweep.key;
    if(!this.startAiGoal(intent,'patrol',sweep.key,AI_SAFE_ZONE_SWEEP.targetLifetimeSeconds,force||sweepChanged,false,'safe-sweep'))return false;
    intent.itemDetourActive=false;p.aiState='SAFE_SWEEP';intent.state='SAFE_SWEEP';intent.mode='move';
    const needsRoute=intent.route.length===0||distance(intent.routeGoalX,intent.routeGoalY,sweep.x,sweep.y)>48||intent.stuckFor>.55;
    if(needsRoute)this.setAiDestination(p,intent,sweep.x,sweep.y,force);
    else{intent.tx=sweep.x;intent.ty=sweep.y;}
    return true;
  }

  private resumeAiSafeSweep(p:PlayerState,intent:AiIntent){
    if(!intent.itemDetourActive||!this.hasActiveAiSafeSweep(intent))return false;
    intent.itemDetourActive=false;this.clearAiGoal(intent);intent.route=[];
    return this.applyAiSafeSweep(p,intent,true);
  }

  private aiPatrolPoint(){
    const region=this.map.regions[Math.floor(this.lootRandom()*Math.max(1,this.map.regions.length))];
    if(!region)return{x:this.worldWidth/2,y:this.worldHeight/2};
    return{
      x:clamp(region.x+region.w*(.2+this.lootRandom()*.6),60,this.worldWidth-60),
      y:clamp(region.y+region.h*(.2+this.lootRandom()*.6),60,this.worldHeight-60),
    };
  }

  private planAi(p:PlayerState,intent:AiIntent){
    const memory=this.ensureAiMemory(p),profile=this.ensureAiProfile(p),now=this.now();this.updateAiRoomMemory(p,memory);this.refreshAiGoalValidity(p,intent,now);
    const siegeHazard=this.gameMode==='coreSiege'?this.coreSiegeHazardForAi(p):undefined;
    const fire=[...this.state.fireFields.values()].find((field)=>fireFieldContains(field,p,this.map.buildingVisibilityZones));
    const grenade=[...this.state.thrownObjects.values()].find((object)=>object.kind==='fragGrenade'&&object.detonateAt-now<1.1&&distance(p.x,p.y,object.x,object.y)<220);
    const hazard=siegeHazard??fire??grenade;
    if(hazard){const dx=p.x-hazard.x,dy=p.y-hazard.y,length=Math.hypot(dx,dy)||1;const hazardKey=siegeHazard?`siege:${siegeHazard.id}`:fire?`fire:${fire.id}`:`grenade:${grenade?.id??'near'}`;this.startAiGoal(intent,'hazard',hazardKey,.8,true,true,'nearby-hazard');intent.targetId='';intent.lootId='';intent.mode='retreat';intent.state=siegeHazard?'EVADE_SIEGE_SKILL':fire?'AVOID_FIRE':'EVADE_GRENADE';const side=this.dominationAiHash(p)%2===0?1:-1,escapeX=p.x+dx/length*240-dy/length*80*side,escapeY=p.y+dy/length*240+dx/length*80*side;this.setAiDestination(p,intent,escapeX,escapeY,true);intent.lastRepathReason=intent.state;this.emitAiDialogue(p,'retreat_back','retreat');return;}
    const previousLoot=intent.lootId;
    if(p.isSwimming){this.releaseLootReservation(p.id,previousLoot);this.cancelHeal(p);if(this.planAiSwimEscape(p,intent))return;}
    intent.targetId='';intent.mode='move';
    const zoneActive=Boolean(this.state.zoneActive),outside=zoneActive&&distance(p.x,p.y,this.state.zoneX,this.state.zoneY)>this.state.zoneRadius-180,nextUrgent=zoneActive&&(this.state.zoneState==='SHRINKING'||this.state.zoneTimer<14),outsideNext=zoneActive&&distance(p.x,p.y,this.state.nextZoneX,this.state.nextZoneY)>this.state.nextZoneRadius-120;
    if(outside||(nextUrgent&&outsideNext)){this.startAiGoal(intent,'zone','zone',1.4,true,true,'zone-escape');this.releaseLootReservation(p.id,previousLoot);intent.lootId='';this.cancelHeal(p);p.aiState='ZONE_ESCAPE';intent.state='ZONE_ESCAPE';const safe=this.aiZoneTarget(p,outside?this.state.zoneX:this.state.nextZoneX,outside?this.state.zoneY:this.state.nextZoneY,outside?this.state.zoneRadius:this.state.nextZoneRadius);this.setAiDestination(p,intent,safe.x,safe.y);return;}
    const target=this.findVisibleTarget(p,intent),targetDistance=target?distance(p.x,p.y,target.x,target.y):Number.POSITIVE_INFINITY,recentlyAttacked=now<(this.aiDefendUntil.get(p.id)??0),combatReady=this.aiCombatReady(p),early=now-(this.aiLandedAt.get(p.id)??now)<15&&!combatReady,danger=Boolean(target&&targetDistance<430);
    if(p.werewolf.transformed){
      this.releaseLootReservation(p.id,previousLoot);intent.lootId='';this.cancelHeal(p);this.cancelReload(p);this.cancelThrow(p);
      if(target){this.startAiGoal(intent,'combat',`combat:${target.id}`,1.2,true,false,'werewolf-hunt');this.rememberAiTarget(p,target,intent);intent.targetId=target.id;p.aiState='WEREWOLF_HUNT';intent.state='WEREWOLF_HUNT';if(targetDistance<=WEREWOLF_BALANCE.clawRange+PLAYER_HIT_RADIUS){intent.mode='hold';intent.route=[];}else{intent.mode='move';this.setAiDestination(p,intent,target.x,target.y);}return;}
      const patrol=this.aiPatrolPoint();p.aiState='WEREWOLF_SEARCH';intent.state='WEREWOLF_SEARCH';intent.mode='move';this.setAiDestination(p,intent,patrol.x,patrol.y);return;
    }
    const activeExo=this.tacticalInventory(p.id).exoActive;
    if(activeExo&&target){this.releaseLootReservation(p.id,previousLoot);intent.lootId='';this.startAiGoal(intent,'combat',`combat:${target.id}`,1.1,true,false,'robot-combat');this.rememberAiTarget(p,target,intent);intent.targetId=target.id;p.aiState='ROBOT_COMBAT';intent.state='ROBOT_COMBAT';if(targetDistance>520){intent.mode='move';this.setAiDestination(p,intent,target.x,target.y);}else if(targetDistance<145){intent.mode='retreat';this.setAiDestination(p,intent,p.x-(target.x-p.x),p.y-(target.y-p.y));}else{intent.mode='hold';intent.route=[];}return;}
    if(this.healUntil.has(p.id)){this.startAiGoal(intent,'heal',`heal:${p.id}`,2.5,false,false,'continue-heal');this.releaseLootReservation(p.id,previousLoot);intent.lootId='';p.aiState='HEAL';intent.state='HEAL';intent.mode='hold';return;}
    if(p.hp/this.playerMaxHp(p)<=.46&&(p.bandages>0||p.medkits>0)&&!danger){if(this.beginHeal(p,'auto')){this.startAiGoal(intent,'heal',`heal:${p.id}`,2.5,false,false,'begin-heal');this.releaseLootReservation(p.id,previousLoot);intent.lootId='';intent.state='HEAL';intent.mode='hold';this.emitAiDialogue(p,'heal_need','heal');return;}}
    if(early){
      this.ensureAiSafeSweepTarget(p,intent);
      const loot=this.findBestLoot(p,intent);
      if(loot&&(!target||targetDistance>65||!recentlyAttacked)&&this.assignLootIntent(p,intent,loot,true))return;
      this.releaseLootReservation(p.id,previousLoot);intent.lootId='';intent.itemDetourActive=false;
      if(target){this.rememberAiTarget(p,target,intent);const dx=p.x-target.x,dy=p.y-target.y,len=Math.hypot(dx,dy)||1;if(targetDistance<=65&&p.hp>35){intent.targetId=target.id;p.aiState='DEFEND';intent.state='DEFEND';intent.mode='hold';this.setEquipped(p,p.melee&&p.melee!=='fists'?p.melee as MeleeId:'fists',true);}else{p.aiState='RETREAT';intent.state='RETREAT';intent.mode='retreat';this.setAiDestination(p,intent,p.x+dx/len*320,p.y+dy/len*320);}return;}
      this.applyAiSafeSweep(p,intent);return;
    }
    if(target&&!this.startAiGoal(intent,'combat',`combat:${target.id}`,1.15,false,false,'visible-enemy'))return;
    this.releaseLootReservation(p.id,previousLoot);intent.lootId='';
    if(target){this.planAiCombatEngagement(p,intent,target,targetDistance);return;}
    if(this.planCoreSiegeAi(p,intent))return;
    if(memory.targetVisible)this.markAiTargetLost(p,intent,this.state.players.get(memory.targetId));
    if(this.planDominationAiLoot(p,intent))return;
    if(this.planDominationAi(p,intent))return;
    if(this.continueAiCombatRecovery(p,intent))return;
    if(memory.searchUntil>now&&memory.confidence>10){if(!this.startAiGoal(intent,'search',`search:${memory.targetId}`,1.25,false,false,'last-seen-search'))return;memory.confidence=Math.max(0,memory.confidence-(now-memory.lastSeenAt)*.6);p.aiState='SEARCH_LAST_SEEN';intent.state='SEARCH_LAST_SEEN';this.setAiDestination(p,intent,memory.lastSeenX,memory.lastSeenY);return;}
    const noise=this.findRecentNoise(p);if(noise){if(!this.startAiGoal(intent,'sound',`sound:${noise.id}`,1.1,false,false,'heard-noise'))return;p.aiState='INVESTIGATE_SOUND';intent.state='INVESTIGATE_SOUND';this.setAiDestination(p,intent,noise.x,noise.y);this.emitAiDialogue(p,noise.kind==='vehicle'?'vehicle_heard':noise.kind==='footstep'||noise.kind==='running'?'uncertain_steps':'uncertain_sound',noise.kind==='vehicle'?'vehicle':'uncertain');return;}
    if(p.insideBuilding&&(now-memory.buildingEnteredAt>(AI_HUMANIZATION.buildingDwellSeconds[0]+(1-profile.lootPreference)*(AI_HUMANIZATION.buildingDwellSeconds[1]-AI_HUMANIZATION.buildingDwellSeconds[0]))||now-memory.roomEnteredAt>AI_HUMANIZATION.roomIdleSeconds&&intent.stuckCount>=2)){const exit=this.findAiBuildingExitPoint(p,memory);if(exit){p.aiState='EXIT_BUILDING';intent.state='EXIT_BUILDING';intent.mode='move';memory.exitRequestedAt=now;this.setAiDestination(p,intent,exit.x,exit.y,true);this.emitAiDialogue(p,pickDialogue('exit',p.id,Math.floor(now*5)),'exit',true);return;}}
    if(this.tryAssignAiWorldObjective(p,intent,profile))return;
    this.chooseAiWeapon(p);const current=WEAPONS[p.equipped as WeaponId];if(current&&current.id!=='fists'&&this.getWeaponMagazine(p,current.id)<=0&&this.getAmmo(p,current.ammoType)>0)this.beginReload(p,current.id);
    this.ensureAiSafeSweepTarget(p,intent);
    if(this.applyAiArenaDirector(p,intent))return;
    const loot=this.findBestLoot(p,intent);if(loot&&this.assignLootIntent(p,intent,loot,false))return;
    this.applyAiSafeSweep(p,intent);
  }

  private coreSiegeAiTarget(p:PlayerState):CoreSiegeAiTarget|undefined{
    if(this.gameMode!=='coreSiege'||this.openArenaRoundState!=='active')return;
    const state=this.state.coreSiege;
    const pickup=[...state.pickups.values()]
      .filter((item)=>item.active&&(item.kind==='supply'||p.hp<=62)&&distance(p.x,p.y,item.x,item.y)<=540)
      .sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0];
    if(pickup)return{kind:'pickup',id:pickup.id,x:pickup.x,y:pickup.y,radius:pickup.radius};

    const enemyTeam=this.coreSiegeEnemyTeam(p.team);
    const enemySummon=[...state.devices.values()]
      .filter((device)=>device.hp>0&&this.isCoreSiegeSummon(device)&&device.team===enemyTeam&&distance(p.x,p.y,device.x,device.y)<=560)
      .sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0];
    if(enemySummon)return{kind:'summon',id:enemySummon.id,x:enemySummon.x,y:enemySummon.y,radius:enemySummon.radius};
    const enemyMinions=[...state.minions.values()]
      .filter((minion)=>minion.team===enemyTeam)
      .sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y));
    if(enemyMinions[0]&&distance(p.x,p.y,enemyMinions[0].x,enemyMinions[0].y)<=820){
      const minion=enemyMinions[0];
      return{kind:'minion',id:minion.id,x:minion.x,y:minion.y,radius:minion.radius};
    }

    if(enemyMinions[0]){
      const minion=enemyMinions[0];
      return{kind:'minion',id:minion.id,x:minion.x,y:minion.y,radius:minion.radius};
    }
    const structure=[...state.structures.values()]
      .filter((candidate)=>candidate.team===enemyTeam&&!candidate.destroyed&&candidate.vulnerable)
      .sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0];
    if(structure)return{kind:'structure',id:structure.id,x:structure.x,y:structure.y,radius:structure.radius};
    return;
  }

  private coreSiegeAiTargetFromIntent(intent:AiIntent):CoreSiegeAiTarget|undefined{
    if(!intent.goalKey.startsWith('core-siege:'))return;
    const [,kind,id]=intent.goalKey.split(':') as [string,CoreSiegeAiTarget['kind'],string];
    if(kind==='minion'){
      const target=this.state.coreSiege.minions.get(id);
      return target?{kind,id,x:target.x,y:target.y,radius:target.radius}:undefined;
    }
    if(kind==='structure'){
      const target=this.state.coreSiege.structures.get(id);
      return target&&!target.destroyed&&target.vulnerable?{kind,id,x:target.x,y:target.y,radius:target.radius}:undefined;
    }
    if(kind==='summon'){
      const target=this.state.coreSiege.devices.get(id);
      return target&&target.hp>0&&this.isCoreSiegeSummon(target)?{kind,id,x:target.x,y:target.y,radius:target.radius}:undefined;
    }
    const target=this.state.coreSiege.pickups.get(id);
    return target?.active?{kind:'pickup',id,x:target.x,y:target.y,radius:target.radius}:undefined;
  }

  private coreSiegeStructureEscorted(p:PlayerState,target:CoreSiegeAiTarget){
    if(target.kind!=='structure')return true;
    return [...this.state.coreSiege.minions.values()].some((minion)=>minion.team===p.team&&distance(minion.x,minion.y,target.x,target.y)<=CORE_SIEGE_CONFIG.minionProtectionRadius);
  }

  private planCoreSiegeAi(p:PlayerState,intent:AiIntent){
    const target=this.coreSiegeAiTarget(p);if(!target)return false;
    const key=`core-siege:${target.kind}:${target.id}`;
    if(!this.startAiGoal(intent,'patrol',key,1.25,true,false,'core-siege-objective'))return true;
    this.releaseLootReservation(p.id,intent.lootId);intent.lootId='';intent.targetId='';intent.itemDetourActive=false;
    const direction=p.team==='blue'?1:-1;
    const layout=coreSiegeLayout(this.worldWidth,this.worldHeight);
    if(p.hp/this.playerMaxHp(p)<=.28){
      const fallback=[...this.state.coreSiege.structures.values()]
        .filter((structure)=>structure.team===p.team&&!structure.destroyed)
        .sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0];
      const retreatX=fallback?fallback.x-direction*90:this.worldWidth*(p.team==='blue'?.1:.9);
      p.aiState='SIEGE_RETREAT';intent.state=p.aiState;intent.mode='retreat';this.setAiDestination(p,intent,retreatX,fallback?.y??layout.laneY,true);return true;
    }
    let goalX=target.x,goalY=target.y;
    if(target.kind!=='pickup'){
      this.chooseAiWeapon(p,distance(p.x,p.y,target.x,target.y));
      const desired=Math.max(120,this.desiredRange(p.equipped as EquippedId)*.72*this.coreSiegeAiRangeMultiplier(p));
      goalX=target.x-direction*(desired+target.radius);
      goalY=clamp(target.y+this.coreSiegeAiFormationOffset(p),layout.laneY-CORE_SIEGE_CONFIG.sideLaneOffset,layout.laneY+CORE_SIEGE_CONFIG.sideLaneOffset);
      if(target.kind==='structure'&&!this.coreSiegeStructureEscorted(p,target)){
        const escort=[...this.state.coreSiege.minions.values()]
          .filter((minion)=>minion.team===p.team)
          .sort((a,b)=>distance(a.x,a.y,target.x,target.y)-distance(b.x,b.y,target.x,target.y))[0];
        goalX=escort?escort.x-direction*105:this.worldWidth*(p.team==='blue'?.31:.69);
        goalY=escort?.y??layout.laneY;
      }
      const flankRole=this.coreSiegeAiRole(p)==='flank',enemyCluster=[...this.state.players.values()].filter((candidate)=>candidate.alive&&candidate.team!==p.team&&distance(candidate.x,candidate.y,target.x,target.y)<360).length;
      if(flankRole&&enemyCluster>=2)goalY=layout.laneY+(this.dominationAiHash(p)%2===0?-CORE_SIEGE_CONFIG.sideLaneOffset:CORE_SIEGE_CONFIG.sideLaneOffset);
    }
    const goalDistance=distance(p.x,p.y,goalX,goalY),attackDistance=distance(p.x,p.y,target.x,target.y)-target.radius;
    p.aiState=target.kind==='pickup'?'SIEGE_SUPPLY':target.kind==='minion'?'SIEGE_CLEAR':'SIEGE_PUSH';
    intent.state=p.aiState;
    const desiredRange=this.desiredRange(p.equipped as EquippedId);
    if(target.kind!=='pickup'&&attackDistance<=desiredRange*.92&&this.coreSiegeStructureEscorted(p,target)){
      intent.mode='hold';intent.route=[];intent.tx=goalX;intent.ty=goalY;
    }else if(goalDistance<=34){
      intent.mode='hold';intent.route=[];intent.tx=goalX;intent.ty=goalY;
    }else{
      intent.mode='move';
      if(intent.route.length===0||distance(intent.routeGoalX,intent.routeGoalY,goalX,goalY)>48)this.setAiDestination(p,intent,goalX,goalY);
    }
    return true;
  }

  private runCoreSiegeAiObjective(p:PlayerState,intent:AiIntent,dt:number){
    if(this.gameMode!=='coreSiege'||intent.targetId)return false;
    const target=this.coreSiegeAiTargetFromIntent(intent);
    if(!target){
      if(intent.goalKey.startsWith('core-siege:')){this.clearAiGoal(intent,'completed','core-siege-target-gone');intent.route=[];this.aiThinkAt.set(p.id,0);}
      return false;
    }
    if(target.kind==='pickup'||!this.coreSiegeStructureEscorted(p,target))return false;
    const targetDistance=distance(p.x,p.y,target.x,target.y)-target.radius;
    this.chooseAiWeapon(p,targetDistance);
    const weapon=WEAPONS[p.equipped as WeaponId];
    if(!weapon||targetDistance>this.desiredRange(weapon.id)*1.06)return false;
    const desiredAngle=Math.atan2(target.y-p.y,target.x-p.x),profile=this.ensureAiProfile(p);
    p.angle=turnAngleToward(p.angle,desiredAngle,profile.turnRate*1.15*dt);
    if(Math.abs(this.angleDiff(desiredAngle,p.angle))>.16||this.firstObstacleHitT(p.x,p.y,target.x,target.y,3)!==null)return false;
    if(weapon.id==='fists'){if(['ironCyclone','earthHammer','chainExecutioner','twinBlade'].includes(normalizeCoreSiegeHero(this.coreSiegePlayer(p.id).heroId)))this.meleePlayer(p);return true;}
    if(this.getWeaponMagazine(p,weapon.id)>0)this.firePlayer(p);
    else if(this.getAmmo(p,weapon.ammoType)>0)this.beginReload(p,weapon.id);
    return true;
  }

  private dominationAiHash(p:PlayerState){let hash=0;for(const char of p.id)hash=(hash*31+char.charCodeAt(0))>>>0;return hash;}

  private dominationAiRole(p:PlayerState){
    const slot=this.dominationAiHash(p)%8;
    return slot<2?'loot':slot<4?'defend':slot<7?'assault':'flank';
  }

  private planDominationAiLoot(p:PlayerState,intent:AiIntent){
    if(this.gameMode!=='domination'||this.openArenaRoundState!=='active')return false;
    const context=this.aiResourceContext(p),role=this.dominationAiRole(p);
    const urgentDefense=[...this.state.domination.sites.values()].some((site)=>site.owner==='ai'&&site.humanCount>0);
    const mustRearm=!context.hasUsableGun||context.ammoRatio<.2;
    const roleFarm=role==='loot'&&!urgentDefense&&(context.ammoRatio<.65||context.healingCount<1||context.tacticalCount<1);
    if(!mustRearm&&!roleFarm)return false;
    const loot=this.findBestLoot(p,intent);
    return Boolean(loot&&this.assignLootIntent(p,intent,loot,mustRearm));
  }

  private planDominationAi(p:PlayerState,intent:AiIntent){
    if(this.gameMode!=='domination'||this.openArenaRoundState!=='active')return false;
    const sites=[...this.state.domination.sites.values()];if(!sites.length)return false;
    const hash=this.dominationAiHash(p),role=this.dominationAiRole(p);
    const threatened=sites.filter((site)=>site.owner==='ai'&&site.humanCount>0).sort((a,b)=>b.humanCount-a.humanCount||a.id.localeCompare(b.id));
    const attackable=sites.filter((site)=>site.owner!=='ai').sort((a,b)=>a.id.localeCompare(b.id));
    const owned=sites.filter((site)=>site.owner==='ai').sort((a,b)=>a.id.localeCompare(b.id));
    const pool=role==='defend'?(threatened.length?threatened:owned.length?owned:attackable):attackable.length?attackable:threatened.length?threatened:sites,site=pool[hash%pool.length]!;
    if(!this.startAiGoal(intent,'patrol',`domination:${role}:${site.id}`,1.6,false,false,'domination-objective'))return true;
    this.releaseLootReservation(p.id,intent.lootId);intent.lootId='';intent.targetId='';intent.itemDetourActive=false;
    const angle=(hash%24)/24*Math.PI*2,ring=role==='flank'?site.radius*.68:role==='defend'?site.radius*.48:site.radius*.28;
    const goalX=site.x+Math.cos(angle)*ring,goalY=site.y+Math.sin(angle)*ring,d=distance(p.x,p.y,site.x,site.y),goalDistance=distance(p.x,p.y,goalX,goalY);
    p.aiState=d<=site.radius*.82?`CAPTURE_${site.id}`:`ASSAULT_${site.id}`;intent.state=p.aiState;
    if(goalDistance<=28){intent.mode='hold';intent.route=[];intent.tx=goalX;intent.ty=goalY;}
    else{intent.mode='move';if(intent.route.length===0||distance(intent.routeGoalX,intent.routeGoalY,goalX,goalY)>42)this.setAiDestination(p,intent,goalX,goalY);}
    return true;
  }

  private runAi(p:PlayerState,intent:AiIntent,dt:number){
    const now=this.now();
    if(now<p.werewolf.actionLockedUntil){intent.mode='hold';intent.route=[];intent.targetId='';p.aiState='STUNNED';return;}
    if(this.healUntil.has(p.id))return;
    const memory=this.ensureAiMemory(p),profile=this.ensureAiProfile(p),target=intent.targetId?this.state.players.get(intent.targetId):undefined,tactical=this.tacticalInventory(p.id);
    const specialCombat=Boolean(target?.alive&&(tactical.chickenTransformed?(distance(p.x,p.y,target.x,target.y)<=CHICKEN_BLASTER_BALANCE.peckRange+8&&this.chickenPeck(p),true):p.werewolf.transformed?this.runAiWerewolfCombat(p,target,intent,dt):tactical.exoActive?this.runAiExoCombat(p,target,intent,dt):false));
    if(!specialCombat&&target?.alive){if(now>=memory.nextVisionCheckAt){memory.nextVisionCheckAt=now+AI_HUMANIZATION.visualRefreshSeconds;memory.targetVisible=this.aiCanVisuallyAcquire(p,target,intent);if(memory.targetVisible)this.rememberAiTarget(p,target,intent);else this.markAiTargetLost(p,intent,target);}if(memory.targetVisible){const d=distance(p.x,p.y,target.x,target.y);this.chooseAiWeapon(p,d);const weaponId=p.equipped as WeaponId,movementRatio=intent.mode==='hold'?.3:1;refreshAiAim(memory,profile,p.id+target.id,now,d,movementRatio,weaponId);const aimX=target.x+memory.aimOffsetX,aimY=target.y+memory.aimOffsetY,desiredAngle=Math.atan2(aimY-p.y,aimX-p.x),weaponTurn=weaponId==='pistol'||weaponId==='smg'?1.18:weaponId==='sniper'||weaponId==='bazooka'||weaponId==='silver_crossbow'?.72:1,previousAngle=p.angle;p.angle=turnAngleToward(p.angle,desiredAngle,profile.turnRate*weaponTurn*dt);const aimDelta=Math.abs(this.angleDiff(desiredAngle,p.angle));if(Math.abs(this.angleDiff(p.angle,previousAngle))>.08)memory.reactionReadyAt=Math.max(memory.reactionReadyAt,now+.08);const shotPathBlocked=this.bulletRects().some((rect)=>this.segmentRect(p.x,p.y,aimX,aimY,rect));const canShoot=[now>=memory.reactionReadyAt,aimDelta<(weaponId==='shotgun'?.22:.14),now>=memory.burstCooldownUntil,!shotPathBlocked].every(Boolean);if(canShoot){if(p.equipped==='fists'||p.equipped in MELEE_WEAPONS){const melee=p.equipped==='fists'?WEAPONS.fists:MELEE_WEAPONS[p.equipped as MeleeId];if(d<=melee.range+4)this.meleePlayer(p);}else{const weapon=WEAPONS[weaponId]!;if(weapon.id==='bazooka'&&d<BAZOOKA_BALANCE.aiMinimumRange){intent.mode='retreat';p.aiState='BAZOOKA_SAFE_DISTANCE';}else if(this.getWeaponMagazine(p,weapon.id)>0){prepareAiBurst(memory,p.id,weapon.id,now);const attackBefore=p.attackSeq;this.firePlayer(p);if(p.attackSeq!==attackBefore){finishAiBurstShot(memory,p.id,weapon.id,now);this.emitAiPersonaDialogue(p,'fire',{casual:false,loggable:false,allowResponse:false});}}else if(this.getAmmo(p,weapon.ammoType)>0)this.beginReload(p,weapon.id);}}}}
    if(target?.alive&&memory.targetVisible)this.runAiTacticalActions(p,target);

    const loot=intent.lootId?this.state.loot.get(intent.lootId):undefined;
    if(loot&&distance(p.x,p.y,loot.x,loot.y)<72&&spaceInteractionAllowed(p,loot,this.map.portals)){
      const completedLootId=loot.id;
      let picked=false;
      if(this.aiLootScore(p,loot.kind as LootKind)>0){
        const result=this.applyLoot(p,loot.kind as LootKind,loot);
        if(result.success){picked=true;recordAiResourcePickup(this.ensureAiResourceBrain(p.id),this.aiResourceCategory(loot.kind as LootKind),now);const event:AiPersonaEvent=loot.kind==='bazooka'?'loot_bazooka':loot.kind==='sniper'?'loot_sniper':loot.kind==='flamethrower'?'loot_flame':loot.kind==='pipe'?'loot_pipe':'loot';this.emitAiPersonaDialogue(p,event,{casual:true,loggable:false,allowResponse:true});this.markOpenArenaLootConsumed(loot.id);this.state.loot.delete(loot.id);this.lootReservations.delete(loot.id);}
      }
      this.releaseLootReservation(p.id,completedLootId);
      intent.lootId='';
      if(picked&&intent.goalKind==='loot'&&intent.goalKey===completedLootId)this.clearAiGoal(intent,'completed','loot-picked');
      const vehiclePlan=this.aiVehiclePlans.get(p.id);
      if(picked&&vehiclePlan?.objectiveKind==='loot'&&vehiclePlan.objectiveId===completedLootId){
        const nextLoot=this.findBestLoot(p,intent);
        if(nextLoot&&distance(p.x,p.y,nextLoot.x,nextLoot.y)<360){
          vehiclePlan.phase='walk';vehiclePlan.objectiveId=nextLoot.id;vehiclePlan.targetX=nextLoot.x;vehiclePlan.targetY=nextLoot.y;vehiclePlan.expiresAt=now+10;
          this.assignLootIntent(p,intent,nextLoot,false);
        }else this.finishAiVehicleObjective(p,intent);
      }else if(!this.aiVehiclePlans.has(p.id)||this.aiVehiclePlans.get(p.id)?.phase!=='return'){
        if(!picked)this.failAiGoal(intent,completedLootId,1.8);
        if(!this.resumeAiSafeSweep(p,intent))intent.route=[];
      }
      this.aiThinkAt.set(p.id,0);
    }

    if(intent.mode==='hold'){
      // DROP8_REFACTOR_022_COMBAT_STRAFE_RECOVERY
      if(target)this.runAiCombatHold(p,intent,target,dt);
      intent.stuckFor=0;intent.lastX=p.x;intent.lastY=p.y;
      return;
    }

    intent.combatHoldStartedAt=0;
    if(this.advanceAiRoute(p,intent)||p.isVaulting)return;
    const waypoint=intent.route[0]??{x:intent.tx,y:intent.ty};
    const beforeWaypoint=distance(p.x,p.y,waypoint.x,waypoint.y),beforeGoal=distance(p.x,p.y,intent.routeGoalX,intent.routeGoalY);
    let angle=Math.atan2(waypoint.y-p.y,waypoint.x-p.x);
    if(intent.mode==='retreat'&&target)angle=Math.atan2(p.y-target.y,p.x-target.x);
    if(!target)p.angle=angle;
    const movementProfile=this.ensureAiProfile(p),baseLandSpeed=this.state.difficulty==='hard'?235:this.state.difficulty==='easy'?175:205,landSpeed=baseLandSpeed*(.93+movementProfile.aggression*.1);
    const aiNow=this.now(),aiMovementSlowed=aiNow<p.werewolf.silverSlowUntil,aiProgress=this.gameMode==='coreSiege'?this.coreSiegePlayer(p.id):undefined,aiHero=aiProgress?normalizeCoreSiegeHero(aiProgress.heroId):undefined,aiSpinning=aiHero==='ironCyclone'&&aiNow<(aiProgress?.spinUntil??0),aiSlowResistance=aiHero?coreSiegeHeroSlowResistance(aiHero,aiSpinning):0,rawAiAdhesiveMultiplier=adhesivePlayerSpeedMultiplier(p.werewolf.adhesiveSlowStage,aiNow,p.werewolf.adhesiveSlowUntil,p.werewolf.adhesiveRecoveryUntil),aiAdhesiveBase=this.gameMode==='coreSiege'?Math.max(1-CORE_SIEGE_CONFIG.maxSlowRatio,rawAiAdhesiveMultiplier):rawAiAdhesiveMultiplier,aiAdhesiveMultiplier=aiAdhesiveBase+(1-aiAdhesiveBase)*aiSlowResistance,aiExoSpeed=tactical.exoActive?(tactical.exoKind==='emp'?EMP_EXO_SUIT_BALANCE.speedMultiplier:EXO_SUIT_BALANCE.speedMultiplier):1,aiChickenSpeed=tactical.chickenTransformed?CHICKEN_BLASTER_BALANCE.movementMultiplier:1,aiHeroSpeed=aiHero?coreSiegeHeroMoveMultiplier(aiHero,p.werewolf.transformed,aiSpinning,Boolean(aiProgress&&aiNow<aiProgress.rampageUntil)):1,aiHaste=aiProgress&&aiNow<aiProgress.hasteUntil?1.12:1,aiMarch=aiProgress&&aiNow<aiProgress.marchUntil?1.1:1,aiChase=aiProgress&&aiNow<aiProgress.meleeChaseUntil?CORE_SIEGE_CONFIG.meleeChaseMoveMultiplier:1,aiActionSpeed=aiProgress&&aiNow<aiProgress.anchoredUntil?0:aiProgress&&aiNow<aiProgress.parryRecoveryUntil?.45:1,aiSlowMultiplier=aiMovementSlowed?.6+.4*aiSlowResistance:1,aiSiegeSpeed=(aiHero==='ironCyclone'?Math.min(CORE_SIEGE_CONFIG.ironMaxMoveMultiplier,aiHeroSpeed*aiHaste*aiMarch*aiChase):aiHeroSpeed*aiHaste*aiMarch*aiChase)*aiActionSpeed;const speed=(p.werewolf.transformed?werewolfSpeed(MOTORCYCLE_MAX_SPEED,p.werewolf.sprinting,p.insideBuilding,false,aiAdhesiveMultiplier)*aiSlowMultiplier:(p.isSwimming?landSpeed*(SWIM_SPEED/PLAYER_SPEED):landSpeed*movementMultiplierAt(p.x,p.y,this.map.shallowWaterZones,this.map.landCrossings))*aiSlowMultiplier*aiAdhesiveMultiplier*aiExoSpeed*aiChickenSpeed)*aiSiegeSpeed;
    this.moveAiWithAvoidance(p,intent,waypoint,angle,speed,dt);
    this.updateSwimmingState(p);

    this.updateAiProgress(p,intent,dt,beforeWaypoint,beforeGoal,waypoint);
    const unstuckThreshold=Math.min(1.35,AI_HUMANIZATION.unstuckStageSeconds[Math.min(2,intent.stuckCount)]??3);
    if(intent.stuckFor>unstuckThreshold){
      recordAiDanger(this.ensureAiExperienceBrain(p.id),{x:p.x,y:p.y,now,kind:'stuck',severity:Math.min(1.5,.7+intent.stuckCount*.2)});
      if(!this.isPositionFree(p.x,p.y))this.ensureAiFree(p);
      const blockedWindow=intent.route[0]?.kind==='window'?intent.route[0].windowId??'':'';
      if(blockedWindow){intent.failedWindowId=blockedWindow;intent.failedWindowUntil=this.now()+2.5;}
      if(p.isSwimming&&intent.swimExitId){intent.failedShoreExitId=intent.swimExitId;intent.failedShoreExitUntil=this.now()+AI_NAVIGATION_RECOVERY.failedShoreExitCooldownSeconds;intent.swimExitId='';intent.swimExitLockedUntil=0;intent.route=[];intent.stuckFor=0;intent.oscillationCount++;intent.lastRepathReason='swim-exit-stuck';this.aiThinkAt.set(p.id,0);intent.lastX=p.x;intent.lastY=p.y;return;}
      intent.avoidSign*=-1;
      intent.stuckCount++;
      const locomotion=this.ensureAiLocomotionBrain(p);locomotion.context='';locomotion.selectedKey='';locomotion.positionSamples=[{x:p.x,y:p.y,at:now}];locomotion.switchTimes=[];locomotion.reversalTimes=[];
      if(intent.goalKey&&intent.stuckCount>=2&&['loot','search','sound'].includes(intent.goalKind)){
        const failedKind=intent.goalKind,failedKey=intent.goalKey;if(failedKind==='loot'){this.releaseLootReservation(p.id,intent.lootId);intent.lootId='';}
        this.failAiGoal(intent,failedKey,AI_NAVIGATION_RECOVERY.failedGoalCooldownSeconds,failedKind);intent.route=[];intent.stuckFor=0;intent.lastRepathReason='low-efficiency-goal';p.aiState='REASSESS';intent.state='REASSESS';this.aiThinkAt.set(p.id,0);intent.lastX=p.x;intent.lastY=p.y;return;
      }
      if(intent.goalKind==='patrol'&&intent.goalKey===intent.sweepKey&&intent.stuckCount>=2){
        this.failAiGoal(intent,intent.sweepKey,AI_NAVIGATION_RECOVERY.failedGoalCooldownSeconds);intent.sweepExpiresAt=0;intent.route=[];intent.stuckFor=0;intent.lastRepathReason='safe-sweep-failed';this.aiThinkAt.set(p.id,0);intent.lastX=p.x;intent.lastY=p.y;return;
      }
      intent.repathAt=0;
      const memory=this.ensureAiMemory(p);memory.unstuckStage=Math.min(4,memory.unstuckStage+1);const buildingExit=intent.stuckCount>=2?this.findAiBuildingExitPoint(p,memory):undefined;
      const escape=buildingExit??this.findAiEscapePoint(p,intent);
      const rebuilt=escape?this.buildRoute(escape.x,escape.y,intent.tx,intent.ty,intent):this.buildAiRoute(p,intent.tx,intent.ty,intent);
      intent.route=escape?[escape,...rebuilt]:rebuilt;
      intent.lastRepathReason=blockedWindow?'window-stuck':'collision-stuck';
      intent.stuckFor=0;intent.progressSamples=[];intent.lastProgressSampleAt=0;
      if(intent.stuckCount>=2)this.emitAiDialogue(p,'stuck_blocked','stuck');
      if(AI_NAV_DEBUG)console.debug('[DROP8 AI NAV]',p.id,intent.lastRepathReason,intent.stuckCount);
      this.aiThinkAt.set(p.id,now+1.35);
    }
    intent.lastX=p.x;
    intent.lastY=p.y;
  }

  private moveAiWithAvoidance(p:PlayerState,intent:AiIntent,waypoint:AiRoutePoint,angle:number,speed:number,dt:number){
    // DROP8_REFACTOR_055_AI_LOCOMOTION_UTILITY_BRAIN
    const now=this.now(),step=speed*dt,sign=intent.avoidSign||1,locomotion=this.ensureAiLocomotionBrain(p),experience=this.ensureAiExperienceBrain(p.id);
    recordAiLocomotionPosition(locomotion,p.x,p.y,now);
    const before=distance(p.x,p.y,waypoint.x,waypoint.y),efficiency=aiLocomotionEfficiency(locomotion,now),emergency=['hazard','swim-exit','zone','escape'].includes(intent.goalKind);
    if(before<=Math.max(32,step*2.5)){
      if(before<.5)return true;
      const directionX=(waypoint.x-p.x)/before,directionY=(waypoint.y-p.y)/before;
      locomotion.context=`route:${intent.mode}`;locomotion.selectedKey='arrival';locomotion.selectedSince=now;locomotion.headingX=directionX;locomotion.headingY=directionY;
      return this.tryMove(p,directionX*Math.min(step,before),directionY*Math.min(step,before));
    }
    const offsets=[0,sign*Math.PI/8,-sign*Math.PI/8,sign*Math.PI/4,-sign*Math.PI/4,sign*Math.PI/2,-sign*Math.PI/2];
    if(intent.stuckFor>1.15)offsets.push(Math.PI);
    const currentDanger=aiDangerScoreAt(experience,p.x,p.y,now),currentCrowding=this.aiMovementCrowdingAt(p,intent.targetId,p.x,p.y);
    const probes=offsets.map((offset)=>({key:`offset:${Math.round(offset*1000)}`,angle:angle+offset,offset,directionX:Math.cos(angle+offset),directionY:Math.sin(angle+offset),baseBias:offset!==0&&Math.abs(offset)<Math.PI&&Math.sign(offset)===sign?2.5:offset===Math.PI?-45:0}));
    const headingLength=Math.hypot(locomotion.headingX,locomotion.headingY),headingAngle=headingLength>0?Math.atan2(locomotion.headingY,locomotion.headingX):angle,headingOffset=Math.atan2(Math.sin(headingAngle-angle),Math.cos(headingAngle-angle));
    if(headingLength>0&&Math.abs(headingOffset)>.12)probes.push({key:'momentum',angle:headingAngle,offset:headingOffset,directionX:locomotion.headingX/headingLength,directionY:locomotion.headingY/headingLength,baseBias:4+(1-efficiency)*10});
    if(!emergency&&efficiency<.48)probes.push({key:'reassess',angle:p.angle,offset:0,directionX:0,directionY:0,baseBias:(.58-efficiency)*105+locomotion.reversalTimes.length*4});
    const candidates:Array<AiMovementCandidate&{angle:number;offset:number}>=[];
    for(const probe of probes){
      const moving=Math.hypot(probe.directionX,probe.directionY)>.001,x=clamp(p.x+probe.directionX*step,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS),y=clamp(p.y+probe.directionY*step,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
      if(moving&&distance(p.x,p.y,x,y)<step*.25||moving&&!this.playerMovementPositionFree(p,x,y))continue;
      const after=distance(x,y,waypoint.x,waypoint.y);
      let firePenalty=0;
      const candidateSpace={x,y,buildingId:buildingIdAt(x,y,12,this.map.buildingVisibilityZones)};
      for(const field of this.state.fireFields.values())if(fireFieldContains(field,candidateSpace,this.map.buildingVisibilityZones))firePenalty+=500;
      const crowding=this.aiMovementCrowdingAt(p,intent.targetId,x,y),danger=aiDangerScoreAt(experience,x,y,now);
      candidates.push({key:probe.key,angle:probe.angle,offset:probe.offset,directionX:probe.directionX,directionY:probe.directionY,progressGain:(before-after)*(.3+efficiency*.7),dangerAvoidance:currentDanger-danger,separationGain:currentCrowding-crowding,collisionRisk:firePenalty/2.2,aimInstability:moving?Math.abs(probe.offset)*8:0,baseBias:probe.baseBias});
    }
    const urgency=clamp(.2+intent.stuckFor*.55+(emergency?.35:0),0,1),decision=chooseAiMovement(locomotion,candidates,{context:`route:${intent.mode}`,now,urgency,emergency});
    if(!decision)return false;
    const selected=candidates.find((candidate)=>candidate.key===decision.key);if(selected&&Math.abs(selected.offset)>.01&&Math.abs(selected.offset)<Math.PI*.75)intent.avoidSign=Math.sign(selected.offset);
    if(Math.hypot(decision.directionX,decision.directionY)<.001)return true;
    const moved=this.tryMove(p,decision.directionX*step,decision.directionY*step);if(!moved)locomotion.selectedKey='';return moved;
  }

  private findAiEscapePoint(p:PlayerState,intent:AiIntent):Point|undefined{
    // DROP8_AI_PATROL_STABILITY_ESCAPE
    let selected:Point|undefined;
    let best=Number.NEGATIVE_INFINITY;
    const goalAngle=Math.atan2(intent.ty-p.y,intent.tx-p.x);
    const preferredSign=intent.avoidSign||1;
    const currentGoalDistance=distance(p.x,p.y,intent.tx,intent.ty);
    for(const radius of [84,140,220,320]){
      for(let i=0;i<25;i++){
        const ring=Math.ceil(i/2);
        const direction=i===0?0:(i%2===1?preferredSign:-preferredSign);
        const offset=direction*ring*(Math.PI/12);
        const angle=goalAngle+offset;
        const x=clamp(p.x+Math.cos(angle)*radius,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS);
        const y=clamp(p.y+Math.sin(angle)*radius,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
        if(!this.playerMovementPositionFree(p,x,y)||this.segmentBlocked(p.x,p.y,x,y,PLAYER_BODY_RADIUS))continue;
        const goalGain=currentGoalDistance-distance(x,y,intent.tx,intent.ty);
        const preferredBonus=offset!==0&&Math.sign(offset)===preferredSign?26:0;
        const score=goalGain*2-distance(x,y,intent.tx,intent.ty)*.05-Math.abs(offset)*14+preferredBonus;
        if(score>best){best=score;selected={x,y};}
      }
      if(selected)break;
    }
    return selected;
  }

  private findVisibleTarget(p:PlayerState,intentOrRange:AiIntent|number){
    const intent=typeof intentOrRange==='number'?this.aiIntent.get(p.id)??this.newAiIntent(p):intentOrRange,maxDistance=typeof intentOrRange==='number'?intentOrRange:Number.POSITIVE_INFINITY;
    const now=this.now(),memory=this.ensureAiMemory(p),combat=this.ensureAiCombatBrain(p.id);
    const executive=this.ensureAiExecutive(intent);pruneAiExecutiveMemory(executive,now);
    const candidates:Array<{player:PlayerState;score:number}>=[];
    for(const candidate of this.state.players.values()){
      if(candidate.id===p.id||!candidate.alive||candidate.phase!=='landed'||this.sameCombatTeam(p,candidate)||intent.failedGoalKey===`combat:${candidate.id}`&&now<intent.failedGoalUntil||executive.blockedGoals.some((goal)=>goal.kind==='combat'&&goal.key===`combat:${candidate.id}`&&goal.until>now))continue;
      if(!this.aiCanVisuallyAcquire(p,candidate,intent))continue;
      const d=distance(p.x,p.y,candidate.x,candidate.y),vehicle=candidate.vehicleId?this.state.motorcycles.get(candidate.vehicleId):undefined,tactical=this.tacticalInventory(candidate.id);
      if(d>maxDistance)continue;
      let focusCount=0;for(const [aiId,otherIntent] of this.aiIntent)if(aiId!==p.id&&otherIntent.targetId===candidate.id)focusCount++;
      const targetThreat=this.aiCombatTargetThreat(candidate);
      const currentTarget=memory.targetId===candidate.id;
      const score=aiCombatTargetScore({distance:d,targetHp:candidate.hp,targetThreat,focusCount,currentTarget,recentAttacker:memory.damagedById===candidate.id&&now-memory.damagedAt<=AI_COMBAT_TACTICS.recentAttackerSeconds,targetInVehicle:Boolean(candidate.isDriving),targetMechanical:Boolean(tactical.exoActive||vehicle&&vehicle.vehicleKind!=='motorcycle')});
      candidates.push({player:candidate,score});
    }
    if(!candidates.length)return undefined;
    candidates.sort((a,b)=>b.score-a.score||a.player.id.localeCompare(b.player.id));
    const best=candidates[0]!,current=candidates.find((candidate)=>candidate.player.id===memory.targetId);
    const recentAttackerOverride=Boolean(current&&best.player.id!==current.player.id&&memory.damagedById===best.player.id&&now-memory.damagedAt<=AI_COMBAT_TACTICS.recentAttackerSeconds&&best.score>=current.score+AI_COMBAT_TACTICS.targetSwitchMargin);
    const targetLocked=Boolean(current&&(now<memory.targetLockedUntil||isAiCombatTargetCommitted(combat,current.player.id,now))&&!recentAttackerOverride);
    const selected=current&&!shouldSwitchAiTarget(current.score,best.score,targetLocked)?current:best;
    memory.targetScore=selected.score;
    return selected.player;
  }

  private findRecentNoise(p:PlayerState){
    const now=this.now(),memory=this.ensureAiMemory(p);let selected:Noise|undefined,best=Number.POSITIVE_INFINITY;
    for(const noise of this.noises){if(noise.owner===p.id||now-noise.at>2.8)continue;const d=distance(p.x,p.y,noise.x,noise.y);if(d>noise.radius||d>=best)continue;best=d;selected=noise;}
    if(!selected)return undefined;if(memory.heardEventId!==selected.id){const estimate=estimateSoundPoint(p.id,selected.id,selected.x,selected.y,best);memory.heardEventId=selected.id;memory.heardX=clamp(estimate.x,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS);memory.heardY=clamp(estimate.y,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);memory.heardAt=now;memory.heardKind=selected.kind;memory.source='sound';memory.confidence=Math.max(memory.confidence,selected.danger*55+(1-best/Math.max(1,selected.radius))*25);if(AI_HUMAN_DEBUG)console.debug('[DROP8 AI HUMAN] sound',{ai:p.id,kind:selected.kind,source:selected.owner,estimatedX:Math.round(memory.heardX),estimatedY:Math.round(memory.heardY),error:Math.round(distance(memory.heardX,memory.heardY,selected.x,selected.y))});}return{...selected,x:memory.heardX,y:memory.heardY};
  }

  private findBestLoot(p:PlayerState,intent?:AiIntent){
    let selected:LootState|undefined;
    let selectedCategory:AiResourceCategory='other';
    let best=0;
    const now=this.now(),sweepActive=Boolean(intent&&this.hasActiveAiSafeSweep(intent,now)),resourceProfile=this.ensureAiProfile(p),resourceContext=this.aiResourceContext(p),resourceMemory=this.ensureAiResourceBrain(p.id),resourceFocus=chooseAiResourceFocus(resourceMemory,resourceContext);
    const executive=intent?this.ensureAiExecutive(intent):undefined;
    if(executive)pruneAiExecutiveMemory(executive,now);
    for(const l of this.state.loot.values()){
      if(l.pickupLockedForPlayerId===p.id&&now<l.pickupLockedUntil)continue;
      if(executive?.blockedGoals.some((goal)=>goal.kind==='loot'&&goal.key===l.id&&goal.until>now))continue;
      const reservation=this.lootReservations.get(l.id);
      if(reservation&&reservation.aiId!==p.id)continue;
      const d=distance(p.x,p.y,l.x,l.y);
      if(d>950)continue;
      const kind=l.kind as LootKind,baseScore=this.aiLootScore(p,kind),category=this.aiResourceCategory(kind),urgent=isAiResourceUrgent(category,resourceContext);
      if(baseScore<=0)continue;
      let sweepPenalty=0;
      if(sweepActive&&intent){
        const metrics=aiSweepDetourMetrics({x:p.x,y:p.y},{x:intent.sweepTargetX,y:intent.sweepTargetY},{x:l.x,y:l.y});
        if(!shouldTakeAiSweepLoot(metrics,urgent))continue;
        sweepPenalty=metrics.extraDistance*.08+metrics.corridorDistance*.035;
      }
      const zoneRisk=this.state.zoneActive&&distance(l.x,l.y,this.state.zoneX,this.state.zoneY)>this.state.zoneRadius-100?55:0;
      let enemyRisk=0;const humanMemory=this.ensureAiMemory(p);if(humanMemory.confidence>15){const knownX=humanMemory.source==='visual'?humanMemory.lastSeenX:humanMemory.heardX,knownY=humanMemory.source==='visual'?humanMemory.lastSeenY:humanMemory.heardY,enemyDistance=distance(l.x,l.y,knownX,knownY);if(enemyDistance<180)enemyRisk=55;else if(enemyDistance<360)enemyRisk=22;}
      const commitmentBonus=(intent&&executive?aiLootCommitmentBonus(executive,intent,l.id,now):0)+aiResourceTargetCommitment(resourceMemory,l.id,category,now),dangerRisk=aiDangerScoreAt(this.ensureAiExperienceBrain(p.id),l.x,l.y,now),score=scoreAiResourceCandidate({baseScore:baseScore+aiRoleResourceBonus(resourceProfile.personality,category),distance:d,category,focus:resourceFocus,zoneRisk,enemyRisk,routeRisk:sweepPenalty,dangerRisk,competition:0,commitmentBonus,urgent,lootPreference:resourceContext.lootPreference,riskAvoidance:resourceContext.riskAvoidance});
      if(score>best){best=score;selected=l;selectedCategory=category;}
    }
    if(selected)commitAiResourceTarget(resourceMemory,selected.id,selectedCategory,now);
    return selected;
  }

  private aiLootScore(p:PlayerState,k:LootKind){
    if(this.isExoPart(k)){
      const tactical=this.tacticalInventory(p.id);
      const emp=String(k).startsWith('emp_exo_'),counts=this.exoPartCounts(tactical,emp?'emp':'assault'),partIndex=String(k).endsWith('_head')?0:String(k).endsWith('_core')?1:2;
      if((counts[partIndex]??0)>0)return 0;
      const collected=counts.filter((count)=>count>0).length,otherComplete=this.exoPartCounts(tactical,emp?'assault':'emp').every((count)=>count>0);
      return 92+collected*22+(collected===2?34:0)+(otherComplete?44:0);
    }
    if(k==='tank_key'){
      const tactical=this.tacticalInventory(p.id);
      if(tactical.tankKeyCount>0)return 0;
      const tank=[...this.state.motorcycles.values()].filter((vehicle)=>vehicle.vehicleKind==='tank'&&!vehicle.driverId&&!vehicle.destroyed&&!vehicle.exploding&&!vehicle.critical&&vehicle.hp>=vehicle.maxHp*.25).sort((a,b)=>distance(p.x,p.y,a.x,a.y)-distance(p.x,p.y,b.x,b.y))[0];
      return tank?148-Math.min(36,distance(p.x,p.y,tank.x,tank.y)*.012):0;
    }
    if(k==='hunter_drone'){const tactical=this.tacticalInventory(p.id);return tactical.hunterDroneCount<4?74+(4-tactical.hunterDroneCount)*8:0;}
    if(k==='spider_mine'){const tactical=this.tacticalInventory(p.id);return tactical.spiderMineCount<SPIDER_MINE_BALANCE.maxCarry?88-tactical.spiderMineCount*8:0;}
    if(k==='strip_trap'){const tactical=this.tacticalInventory(p.id);return tactical.stripTrapCount<STRIP_TRAP_BALANCE.maxCarry?72-tactical.stripTrapCount*7:0;}
    if(isThrowableType(k)){
      if(p.throwableType&&p.throwableType!==k)return 0;
      return p.throwableCount<THROWABLE_CONFIGS[k].maxCount?(k==='fragGrenade'?76:k==='incendiaryGrenade'?70:58)-p.throwableCount*8:0;
    }
    if(k in WEAPONS&&k!=='fists'){
      const id=k as WeaponId;
      const incoming=this.weaponBaseScore(id);
      const held=Math.max(0,...[p.primary,p.secondary].filter(Boolean).map((heldId)=>this.weaponBaseScore(heldId as WeaponId)));
      return incoming>held+4?95+(incoming-held):0;
    }
    if(k in MELEE_WEAPONS){
      const held=p.melee==='fists'?0:this.meleeScore(p.melee as MeleeId);
      const incoming=this.meleeScore(k as MeleeId);
      return incoming>held?42+(incoming-held):0;
    }
    if(k==='pistol_ammo')return [p.primary,p.secondary].some((id)=>id==='pistol'||id==='stun_gun')&&p.pistolAmmo<90?62-p.pistolAmmo*.25:0;
    if(k==='standard_ammo')return [p.primary,p.secondary].some((id)=>['smg','rifle','sniper','boomerang'].includes(id))&&p.standardAmmo<96?70-p.standardAmmo*.3:0;
    if(k==='shotgun_ammo')return [p.primary,p.secondary].includes('shotgun')&&p.shotgunAmmo<28?64-p.shotgunAmmo*.8:0;
    if(k==='rocket_ammo')return [p.primary,p.secondary].includes('bazooka')&&p.rocketAmmo<4?78-p.rocketAmmo*14:0;
    if(k==='rail_slug'){const tactical=this.tacticalInventory(p.id);return [p.primary,p.secondary].includes('railgun')&&tactical.railSlugAmmo<RAILGUN_BALANCE.maxReserve?84-tactical.railSlugAmmo*1.8:0;}
    if(k==='laser_cell'){const tactical=this.tacticalInventory(p.id);return [p.primary,p.secondary].includes('laser_cannon')&&tactical.laserCellAmmo<LASER_CANNON_BALANCE.maxReserve?82-tactical.laserCellAmmo*1.5:0;}
    if(k==='fuel_ammo')return [p.primary,p.secondary].includes('flamethrower')&&p.fuelAmmo<FLAMETHROWER_BALANCE.maxFuelReserve?70-p.fuelAmmo*.08:0;
    if(k==='adhesive_charge'){const tactical=this.tacticalInventory(p.id);return [p.primary,p.secondary].includes('adhesive_sprayer')&&tactical.adhesiveCharge<ADHESIVE_SPRAYER_BALANCE.maxChargeReserve?72-tactical.adhesiveCharge*.08:0;}
    if(k==='silver_bolt'){const tactical=this.tacticalInventory(p.id);return [p.primary,p.secondary].includes('silver_crossbow')&&tactical.silverBoltAmmo<SILVER_CROSSBOW_BALANCE.maxReserve?82-tactical.silverBoltAmmo*8:0;}
    if(k==='vest')return p.armor<70?72-p.armor*.4:0;
    if(k==='bandage')return p.bandages<3?55-p.bandages*12:0;
    if(k==='medkit')return p.medkits<2?68-p.medkits*20:0;
    return 0;
  }

  private aiLootState(k:LootKind){
    if(k in WEAPONS)return'SEEK_WEAPON';
    if(k==='pistol_ammo'||k==='standard_ammo'||k==='shotgun_ammo'||k==='rocket_ammo'||k==='rail_slug'||k==='laser_cell'||k==='fuel_ammo'||k==='adhesive_charge')return'SEEK_AMMO';
    if(this.isExoPart(k))return'SEEK_ROBOT_PART';
    if(k==='tank_key')return'SEEK_TANK_KEY';
    if(k==='hunter_drone'||k==='spider_mine'||k==='strip_trap'||isThrowableType(k))return'SEEK_TACTICAL';
    if(k==='vest')return'SEEK_ARMOR';
    if(k==='bandage'||k==='medkit')return'SEEK_HEAL';
    return'LOOT';
  }

  private chooseAiWeapon(p:PlayerState,targetDistance=350,force=false){
    const candidates:EquippedId[]=['fists'];
    if(p.melee&&p.melee!=='fists')candidates.push(p.melee as MeleeId);
    if(p.secondary)candidates.push(p.secondary as WeaponId);
    if(p.primary)candidates.push(p.primary as WeaponId);
    let bestId:EquippedId='fists';
    let best=-999;
    for(const id of candidates){
      const score=this.aiWeaponScore(p,id,targetDistance);
      if(score>best){best=score;bestId=id;}
    }
    const currentScore=this.aiWeaponScore(p,p.equipped as EquippedId,targetDistance);
    const currentUsable=currentScore>-500;
    if(force||!currentUsable||best>currentScore+7)this.setEquipped(p,bestId,force||!currentUsable);
    else this.syncMagazine(p);
  }

  private aiWeaponScore(p:PlayerState,id:EquippedId,d:number){
    if(id==='fists')return d<=70?35:-700;
    if(id in MELEE_WEAPONS){const melee=MELEE_WEAPONS[id as MeleeId]!;return d<=melee.range+18?58+this.meleeScore(id as MeleeId):-650;}
    const w=WEAPONS[id as WeaponId];
    if(!w)return-999;
    const ammo=this.getWeaponMagazine(p,w.id)+this.getAmmo(p,w.ammoType);
    if(ammo<=0)return-800;
    let score=this.weaponBaseScore(w.id);
    if(w.id==='shotgun')score+=d<220?55:d>500?-65:8;
    if(w.id==='smg')score+=d>=90&&d<=420?38:d>650?-35:5;
    if(w.id==='rifle')score+=d>260?44:d<120?-28:12;
    if(w.id==='sniper')score+=d>620?72:d<240?-70:18;
    if(w.id==='railgun')score+=d>500?86:d<220?-85:24;
    if(w.id==='laser_cannon')score+=d>440?70:d<140?-35:28;
    if(w.id==='boomerang')score+=d>=160&&d<=760?62:d>980?-80:12;
    if(w.id==='rc_car')score+=d>=240&&d<=900?74:d<150?-120:-20;
    if(w.id==='bazooka')score+=d>=BAZOOKA_BALANCE.aiMinimumRange&&d<=900?84:-140;
    if(w.id==='flamethrower')score+=d<=FLAMETHROWER_BALANCE.range?78:-180;
    if(w.id==='adhesive_sprayer'){
      const werewolfThreat=[...this.state.players.values()].some((target)=>target.id!==p.id&&target.alive&&target.werewolf.transformed&&distance(p.x,p.y,target.x,target.y)<900),vehicleThreat=[...this.state.motorcycles.values()].some((vehicle)=>vehicle.driverId&&vehicle.driverId!==p.id&&!vehicle.destroyed&&distance(p.x,p.y,vehicle.x,vehicle.y)<900);
      score+=werewolfThreat||vehicleThreat?d<=ADHESIVE_SPRAYER_BALANCE.range?96:-90:-55;
    }
    if(w.id==='silver_crossbow'){
      const werewolfThreat=[...this.state.players.values()].some((target)=>target.id!==p.id&&target.alive&&target.werewolf.transformed&&distance(p.x,p.y,target.x,target.y)<900);
      score+=werewolfThreat?d<=SILVER_CROSSBOW_BALANCE.range?128:-80:-42;
    }
    if(w.id==='stun_gun')score+=d<=WEAPONS.stun_gun.range?34:-120;
    if(w.id==='pistol')score+=d>650?12:4;
    if(this.getWeaponMagazine(p,w.id)<=0)score-=52;
    return score;
  }

  private desiredRange(id:EquippedId):number{
    if(id==='fists')return 58;
    if(id in MELEE_WEAPONS)return MELEE_WEAPONS[id as MeleeId]!.range*.82;
    if(id==='shotgun')return 175;
    if(id==='smg')return 260;
    if(id==='rifle')return 410;
    if(id==='sniper')return 780;
    if(id==='railgun')return 850;
    if(id==='laser_cannon')return 680;
    if(id==='boomerang')return 520;
    if(id==='rc_car')return 640;
    if(id==='bazooka')return 620;
    if(id==='flamethrower')return 230;
    if(id==='adhesive_sprayer')return 210;
    if(id==='stun_gun')return 160;
    return 330;
  }

  private weaponBaseScore(id:WeaponId):number{return id==='railgun'?110:id==='laser_cannon'?105:id==='bazooka'?104:id==='rc_car'?102:id==='boomerang'?100:id==='flamethrower'?96:id==='adhesive_sprayer'?74:id==='silver_crossbow'?82:id==='sniper'?98:id==='rifle'?90:id==='smg'?82:id==='shotgun'?78:id==='stun_gun'?64:id==='pistol'?52:0;}
  private meleeScore(id:MeleeId):number{return id==='pan'?30:id==='bat'?27:id==='pipe'?24:19;}

  private setAiDestination(p:PlayerState,intent:AiIntent,x:number,y:number,force=false){
    const tx=clamp(x,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS);
    const ty=clamp(y,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
    const changed=distance(intent.routeGoalX,intent.routeGoalY,tx,ty)>84;
    const now=this.now();
    intent.tx=tx;
    intent.ty=ty;
    const periodicDue=now>=intent.repathAt;
    const shouldRepath=force||changed||intent.route.length===0||(periodicDue&&intent.stuckFor>.35);
    if(shouldRepath){
      const previous=intent.route;
      const rebuilt=this.buildAiRoute(p,tx,ty,intent);
      const rebuiltBlocked=rebuilt.length===1&&this.segmentBlocked(p.x,p.y,rebuilt[0]!.x,rebuilt[0]!.y);
      if(!force&&!changed&&previous.length>0&&rebuiltBlocked){
        intent.route=previous;
        intent.lastRepathReason='preserve-valid-route';
      }else{
        intent.route=rebuilt;
        intent.lastRepathReason=force?'forced':changed?'goal-change':intent.route.length===0?'route-empty':'stuck-repath';
      }
      intent.routeGoalX=tx;
      intent.routeGoalY=ty;
      intent.repathAt=now+1.05+Math.random()*.35;
    }else if(periodicDue){
      // Static walls do not invalidate a healthy route. Periodic timers are only
      // a health check; real replanning is driven by goal changes or measured stalls.
      intent.repathAt=now+1.05+Math.random()*.35;
      intent.lastRepathReason='route-healthy';
    }
  }

  private buildAiRoute(p:PlayerState,tx:number,ty:number,intent?:AiIntent):AiRoutePoint[]{
    const river=this.map.rivers[0];
    if(!river)return this.buildRoute(p.x,p.y,tx,ty,intent);
    if(p.isSwimming){
      const exit=this.selectAiShoreExit(p,intent??this.newAiIntent(p));
      if(exit)return[{x:exit.entry.x+exit.entry.w/2,y:exit.entry.y+exit.entry.h/2},exit.landingPoint];
      return this.buildRoute(p.x,p.y,tx,ty,intent);
    }
    const startTerrain=this.terrainKindAt(p.x,p.y),targetTerrain=this.terrainKindAt(tx,ty);
    const startSide=startTerrain==='deep-water'?'water':riverLandSideAt(p.x,p.y,river),targetSide=targetTerrain==='deep-water'?'water':riverLandSideAt(tx,ty,river);
    const directCrossesWater=this.segmentCrossesDeepWater(p.x,p.y,tx,ty);
    if(startSide!=='water'&&targetSide!=='water'&&startSide===targetSide){
      if(!directCrossesWater)return this.buildRoute(p.x,p.y,tx,ty,intent);
      return this.sameSideWaterDetour(p.x,p.y,tx,ty,startSide,intent)??this.buildRoute(p.x,p.y,tx,ty,intent);
    }
    if(startSide==='water'||targetSide==='water')return this.buildRoute(p.x,p.y,tx,ty,intent);
    const candidates:Array<{entry:Point;exit:Point;cost:number;mode:'crossing'|'swim'}>=[];
    for(const crossing of this.map.landCrossings){
      if(!crossing.allowsPlayer)continue;
      const west={x:crossing.rect.x-42,y:crossing.rect.y+crossing.rect.h/2},east={x:crossing.rect.x+crossing.rect.w+42,y:crossing.rect.y+crossing.rect.h/2};
      const entry=startSide==='west'?west:east,exit=startSide==='west'?east:west;
      const crossingCost=crossing.rect.w/Math.max(.25,crossing.movementMultiplier);
      candidates.push({entry,exit,cost:distance(p.x,p.y,entry.x,entry.y)+crossingCost+distance(exit.x,exit.y,tx,ty),mode:'crossing'});
    }
    if(p.hp>65){
      const west=this.map.shoreExits.filter((exit)=>exit.normal.x<0),east=this.map.shoreExits.filter((exit)=>exit.normal.x>0);
      for(const a of west){
        const b=east.reduce<typeof east[number]|undefined>((best,candidate)=>!best||Math.abs(candidate.landingPoint.y-a.landingPoint.y)<Math.abs(best.landingPoint.y-a.landingPoint.y)?candidate:best,undefined);if(!b)continue;
        const entry=startSide==='west'?a.landingPoint:b.landingPoint,exit=startSide==='west'?b.landingPoint:a.landingPoint,swimDistance=distance(entry.x,entry.y,exit.x,exit.y);
        candidates.push({entry,exit,cost:distance(p.x,p.y,entry.x,entry.y)+swimDistance*(PLAYER_SPEED/SWIM_SPEED)+distance(exit.x,exit.y,tx,ty)+AI_NAVIGATION_RECOVERY.voluntarySwimPenalty,mode:'swim'});
      }
    }
    candidates.sort((a,b)=>a.cost-b.cost);const selected=candidates[0];
    if(!selected)return this.buildRoute(p.x,p.y,tx,ty,intent);
    const toEntry=this.buildRoute(p.x,p.y,selected.entry.x,selected.entry.y,intent),fromExit=this.buildRoute(selected.exit.x,selected.exit.y,tx,ty,intent);
    return[...toEntry,selected.exit,...fromExit].filter((point,index,array)=>index===0||distance(point.x,point.y,array[index-1]!.x,array[index-1]!.y)>8);
  }

  private buildRoute(sx:number,sy:number,tx:number,ty:number,intent?:AiIntent):AiRoutePoint[]{
    const startPoint=this.isPositionFree(sx,sy)?{x:sx,y:sy}:this.findNearestFreePoint(sx,sy)??{x:sx,y:sy};
    const goalPoint=this.isPositionFree(tx,ty)?{x:tx,y:ty}:this.findNearestFreePoint(tx,ty)??{x:tx,y:ty};
    if(!this.segmentBlocked(startPoint.x,startPoint.y,goalPoint.x,goalPoint.y))return[goalPoint];

    const clearance=PLAYER_BODY_RADIUS+12;
    const buildingDetour=clearance+44;
    const source=this.buildingAt(startPoint.x,startPoint.y);
    const target=this.buildingAt(goalPoint.x,goalPoint.y);
    const sourceSpace=spaceAt(startPoint.x,startPoint.y,this.map.buildingVisibilityZones,this.map.rooms,12);
    const targetSpace=spaceAt(goalPoint.x,goalPoint.y,this.map.buildingVisibilityZones,this.map.rooms,12);
    const sourceId=sourceSpace.buildingId;
    const targetId=targetSpace.buildingId;
    const relevant=this.map.buildings.filter((building)=>{
      if(building===source||building===target)return true;
      return this.segmentRect(startPoint.x,startPoint.y,goalPoint.x,goalPoint.y,{
        x:building.x-clearance-90,
        y:building.y-clearance-90,
        w:building.w+(clearance+90)*2,
        h:building.h+(clearance+90)*2,
      });
    });

    const nodes:AiRoutePoint[]=[startPoint,goalPoint];
    const add=(point:Point)=>{
      const x=clamp(point.x,PLAYER_BODY_RADIUS,this.worldWidth-PLAYER_BODY_RADIUS);
      const y=clamp(point.y,PLAYER_BODY_RADIUS,this.worldHeight-PLAYER_BODY_RADIUS);
      if(!this.isPositionFree(x,y,PLAYER_BODY_RADIUS+1))return-1;
      const existing=nodes.findIndex((node)=>distance(node.x,node.y,x,y)<12);
      if(existing>=0)return existing;
      nodes.push({x,y});
      return nodes.length-1;
    };
    const windowPairs:Array<{a:number;b:number;windowId:string;aBuildingId:string;bBuildingId:string;aRoomIndex:number;bRoomIndex:number}>=[];
    for(const building of relevant){
      const left=building.x-buildingDetour;
      const right=building.x+building.w+buildingDetour;
      const top=building.y-buildingDetour;
      const bottom=building.y+building.h+buildingDetour;
      add({x:left,y:top});
      add({x:right,y:top});
      add({x:left,y:bottom});
      add({x:right,y:bottom});
      for(const ratio of [.25,.5,.75]){
        add({x:building.x+building.w*ratio,y:top});
        add({x:building.x+building.w*ratio,y:bottom});
        add({x:left,y:building.y+building.h*ratio});
        add({x:right,y:building.y+building.h*ratio});
      }
      const door=this.doorPoints(building);
      add(door.outside);
      add(door.inside);
    }
    const relevantBuildingIds=new Set(relevant.map((building)=>this.map.buildingVisibilityZones[this.map.buildings.indexOf(building)]?.id).filter((id):id is string=>Boolean(id)));
    for(const portal of this.map.portals){
      if(portal.kind!=='window'||!portal.vaultable)continue;
      if(!relevantBuildingIds.has(portal.buildingId)&&portal.buildingId!==sourceId&&portal.buildingId!==targetId)continue;
      if(intent?.failedWindowId===portal.id&&this.now()<(intent.failedWindowUntil??0))continue;
      const a=add(portal.approachA),b=add(portal.approachB);
      if(a<0||b<0)continue;
      windowPairs.push({a,b,windowId:portal.id,aBuildingId:portalBuildingIdForSide(portal,'A'),bBuildingId:portalBuildingIdForSide(portal,'B'),aRoomIndex:portal.sideARoomIndex,bRoomIndex:portal.sideBRoomIndex});
    }
    const routeObstacles=[...this.map.propObstacles,...this.map.obstacles,...this.dominationWalls()];
    for(const prop of routeObstacles){
      if(!this.segmentRect(startPoint.x,startPoint.y,goalPoint.x,goalPoint.y,{x:prop.x-clearance-48,y:prop.y-clearance-48,w:prop.w+(clearance+48)*2,h:prop.h+(clearance+48)*2}))continue;
      add({x:prop.x-clearance,y:prop.y-clearance});
      add({x:prop.x+prop.w+clearance,y:prop.y-clearance});
      add({x:prop.x-clearance,y:prop.y+prop.h+clearance});
      add({x:prop.x+prop.w+clearance,y:prop.y+prop.h+clearance});
    }

    const edges=new Map<number,AiRouteEdge[]>();
    for(let i=0;i<nodes.length;i++)edges.set(i,[]);
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i]!;
        const b=nodes[j]!;
        if(this.segmentBlocked(a.x,a.y,b.x,b.y))continue;
        const cost=distance(a.x,a.y,b.x,b.y);
        edges.get(i)!.push({to:j,cost,kind:'move'});
        edges.get(j)!.push({to:i,cost,kind:'move'});
      }
    }
    for(const pair of windowPairs){
      const crossingCost=distance(nodes[pair.a]!.x,nodes[pair.a]!.y,nodes[pair.b]!.x,nodes[pair.b]!.y)+70;
      edges.get(pair.a)!.push({to:pair.b,cost:crossingCost,kind:'window',windowId:pair.windowId,targetBuildingId:pair.bBuildingId,targetRoomIndex:pair.bRoomIndex});
      edges.get(pair.b)!.push({to:pair.a,cost:crossingCost,kind:'window',windowId:pair.windowId,targetBuildingId:pair.aBuildingId,targetRoomIndex:pair.aRoomIndex});
    }

    const distances=new Array<number>(nodes.length).fill(Number.POSITIVE_INFINITY);
    const previous=new Array<number>(nodes.length).fill(-1);
    const previousEdge=new Array<AiRouteEdge|undefined>(nodes.length);
    const visited=new Set<number>();
    distances[0]=0;
    for(let count=0;count<nodes.length;count++){
      let current=-1;
      let best=Number.POSITIVE_INFINITY;
      for(let i=0;i<nodes.length;i++){
        if(!visited.has(i)&&distances[i]<best){best=distances[i];current=i;}
      }
      if(current<0||current===1)break;
      visited.add(current);
      for(const edge of edges.get(current)??[]){
        const next=best+edge.cost;
        if(next<distances[edge.to]){distances[edge.to]=next;previous[edge.to]=current;previousEdge[edge.to]=edge;}
      }
    }
    if(!Number.isFinite(distances[1]))return this.fallbackRoute(startPoint,goalPoint,relevant);
    const indices:number[]=[];
    for(let cursor=1;cursor>=0;cursor=previous[cursor]){
      indices.push(cursor);
      if(cursor===0)break;
    }
    indices.reverse();
    const route:AiRoutePoint[]=[];
    for(let index=1;index<indices.length;index++){
      const fromIndex=indices[index-1]!,toIndex=indices[index]!;
      const edge=previousEdge[toIndex];
      if(edge?.kind==='window'){
        const from=nodes[fromIndex]!,to=nodes[toIndex]!;
        const action:AiRoutePoint={x:from.x,y:from.y,kind:'window',windowId:edge.windowId,targetX:to.x,targetY:to.y,targetBuildingId:edge.targetBuildingId,targetRoomIndex:edge.targetRoomIndex};
        const previousPoint=route.at(-1);
        if(previousPoint&&previousPoint.kind===undefined&&distance(previousPoint.x,previousPoint.y,action.x,action.y)<12)route[route.length-1]=action;
        else route.push(action);
      }else route.push(nodes[toIndex]!);
    }
    return route;
  }

  private fallbackRoute(start:Point,goal:Point,buildings:Building[]):Point[]{
    const candidates:Point[]=[];
    const clearance=PLAYER_BODY_RADIUS+16;
    for(const building of buildings){
      candidates.push(
        {x:building.x-clearance,y:building.y-clearance},
        {x:building.x+building.w+clearance,y:building.y-clearance},
        {x:building.x-clearance,y:building.y+building.h+clearance},
        {x:building.x+building.w+clearance,y:building.y+building.h+clearance},
      );
      const door=this.doorPoints(building);
      candidates.push(door.outside,door.inside);
    }
    let best:Point|undefined;
    let bestScore=Number.POSITIVE_INFINITY;
    for(const point of candidates){
      if(!this.isPositionFree(point.x,point.y)||this.segmentBlocked(start.x,start.y,point.x,point.y))continue;
      const score=distance(start.x,start.y,point.x,point.y)+distance(point.x,point.y,goal.x,goal.y);
      if(score<bestScore){bestScore=score;best=point;}
    }
    return best?[best,goal]:[goal];
  }

  private segmentBlocked(x1:number,y1:number,x2:number,y2:number,clearance=PLAYER_BODY_RADIUS+3){
    return this.collisionRects().some((rect)=>this.segmentRect(x1,y1,x2,y2,{
      x:rect.x-clearance,
      y:rect.y-clearance,
      w:rect.w+clearance*2,
      h:rect.h+clearance*2,
    }));
  }

  private buildingAt(x:number,y:number){return this.map.buildings.find((b)=>x>b.x+18&&x<b.x+b.w-18&&y>b.y+18&&y<b.y+b.h-18);}

  private doorPoints(b:Building){
    const margin=PLAYER_BODY_RADIUS+14;
    const wall=18;
    if(b.doorSide==='north'){
      const x=b.x+b.w*b.doorOffset;
      return{outside:{x,y:b.y-margin},inside:{x,y:b.y+wall+margin}};
    }
    if(b.doorSide==='south'){
      const x=b.x+b.w*b.doorOffset;
      return{outside:{x,y:b.y+b.h+margin},inside:{x,y:b.y+b.h-wall-margin}};
    }
    if(b.doorSide==='west'){
      const y=b.y+b.h*b.doorOffset;
      return{outside:{x:b.x-margin,y},inside:{x:b.x+wall+margin,y}};
    }
    const y=b.y+b.h*b.doorOffset;
    return{outside:{x:b.x+b.w+margin,y},inside:{x:b.x+b.w-wall-margin,y}};
  }

  private advanceAiRoute(p:PlayerState,intent:AiIntent){
    while(intent.route.length){
      const waypoint=intent.route[0]!;
      const threshold=waypoint.kind==='window'?34:28;
      if(distance(p.x,p.y,waypoint.x,waypoint.y)>=threshold)return false;
      if(waypoint.kind!=='window'){intent.route.shift();continue;}
      const candidate=waypoint.windowId?this.aiWindowVaultCandidate(p,waypoint.windowId):undefined;
      if(candidate&&this.beginWindowVault(p,candidate)){
        intent.route.shift();
        intent.stuckFor=0;
        intent.stuckCount=0;
        intent.lastRepathReason='window-vault';
        return true;
      }
      intent.failedWindowId=waypoint.windowId??'';
      intent.failedWindowUntil=this.now()+2.5;
      intent.route=this.buildRoute(p.x,p.y,intent.tx,intent.ty,intent);
      intent.repathAt=this.now()+.7;
      intent.lastRepathReason='window-rejected';
      if(AI_NAV_DEBUG)console.debug('[DROP8 AI NAV]',p.id,intent.lastRepathReason,intent.failedWindowId);
      return false;
    }
    return false;
  }

  private clearOpenArenaSpawnProtection(playerId:string){
    if(!this.arenaLike())return;
    const removed=this.spawnProtectionUntil.delete(playerId);
    if(removed)this.playerClient(playerId)?.send('spawnProtection',{playerId,protectedUntil:0});
  }

  private scheduleOpenArenaRespawn(p:PlayerState){
    const delay=this.practiceMode&&p.id==='core-siege-practice-target'?1:this.gameMode==='coreSiege'?coreSiegeRespawnSeconds(this.coreSiegePlayer(p.id).level):this.gameMode==='domination'?DOMINATION_CONFIG.respawnSeconds:p.ai?6:5;
    const respawnAt=this.now()+delay;
    this.spawnProtectionUntil.delete(p.id);
    if(p.ai){
      const slot=this.openArenaAiSlots.get(p.id);
      if(slot){slot.state='respawnWait';slot.respawnAt=respawnAt;slot.generation++;}
    }else{
      this.humanRespawnAt.set(p.id,respawnAt);
      this.playerClient(p.id)?.send('respawnScheduled',{playerId:p.id,respawnAt,delaySeconds:delay});
    }
  }

  private giveOpenArenaStarterKit(p:PlayerState){
    if(this.gameMode==='coreSiege'){
      const progress=this.coreSiegePlayer(p.id);
      const heroId=normalizeCoreSiegeHero(progress.heroId),hero=CORE_SIEGE_HEROES[heroId];
      this.syncCoreSiegeHeroHealth(p,true);
      p.primary=hero.primaryWeapon;
      p.secondary=hero.secondaryWeapon;
      p.equipped=hero.primaryWeapon;
      p.previousEquipped='fists';
      p.pistolAmmo=0;
      p.standardAmmo=0;
      p.shotgunAmmo=0;
      p.rocketAmmo=0;
      p.fuelAmmo=0;
      const profile=CORE_SIEGE_BASIC_ATTACKS[normalizeCoreSiegeHero(progress.heroId)];
      this.setWeaponMagazine(p,hero.primaryWeapon as WeaponId,profile.magazine);
      if(hero.secondaryWeapon!==hero.primaryWeapon)this.setWeaponMagazine(p,hero.secondaryWeapon as WeaponId,WEAPONS[hero.secondaryWeapon as WeaponId]?.magazine??1);
      progress.medicalGel=CORE_SIEGE_CONFIG.medicalGelMax;
      progress.heat=0;
      p.armor=Math.max(p.armor,progress.guardStacks*CORE_SIEGE_CONFIG.guardArmorPerStack);
      this.syncMagazine(p);
      return;
    }
    p.secondary='pistol';p.equipped='pistol';p.previousEquipped='fists';p.pistolMagazine=WEAPONS.pistol.magazine;p.pistolAmmo=24;this.syncMagazine(p);
  }

  private respawnOpenArenaCombatant(p:PlayerState){
    const index=[...this.state.players.keys()].indexOf(p.id);
    this.resetOpenArenaCombatant(p,Math.max(0,index),false);
    this.giveOpenArenaStarterKit(p);
    const protectedUntil=this.now()+2;
    this.spawnProtectionUntil.set(p.id,protectedUntil);
    if(p.ai){
      const slot=this.openArenaAiSlots.get(p.id);
      if(slot){slot.state='alive';slot.respawnAt=0;}
    }else{
      this.humanRespawnAt.delete(p.id);
      const client=this.playerClient(p.id);
      client?.send('respawned',{playerId:p.id,x:p.x,y:p.y});
      client?.send('spawnProtection',{playerId:p.id,protectedUntil});
    }
    this.broadcast('arenaStatus',this.arenaStatusPayload());
  }

  private updateOpenArenaRespawns(){
    const now=this.now();
    for(const [playerId,respawnAt] of [...this.humanRespawnAt]){
      const player=this.state.players.get(playerId);
      if(!player){this.humanRespawnAt.delete(playerId);continue;}
      if(player.alive){this.humanRespawnAt.delete(playerId);continue;}
      if(now>=respawnAt)this.respawnOpenArenaCombatant(player);
    }
    for(const slot of this.openArenaAiSlots.values()){
      if(slot.state!=='respawnWait'||now<slot.respawnAt)continue;
      const player=this.state.players.get(slot.playerId);
      if(player)this.respawnOpenArenaCombatant(player);
    }
    for(const [playerId,until] of [...this.spawnProtectionUntil])if(now>=until){this.spawnProtectionUntil.delete(playerId);this.playerClient(playerId)?.send('spawnProtection',{playerId,protectedUntil:0});}
  }

  private damage(p:PlayerState,amount:number,attackerId:string,reason:string,knockbackOverride=0,hitAngleOverride?:number,kind:DamageKind='other'){
    if(this.openArenaRoundLocked()||!p.alive)return;
    if(this.arenaLike()&&this.now()<(this.spawnProtectionUntil.get(p.id)??0))return;
    const teamAttacker=this.state.players.get(attackerId);
    if(this.sameCombatTeam(teamAttacker,p))return;
    const now=this.now(),resolvedKind:DamageKind=kind!=='other'?kind:reason==='총기'?'bullet':reason==='바주카포'||reason==='파편 수류탄'||reason==='오토바이 폭발'?'explosion':reason==='화염방사기'||reason==='화염탄'?'fire':reason==='자기장'?'zone':reason==='오토바이'?'vehicle':reason==='늑대 할퀴기'?'melee':'other',siegeProgress=this.gameMode==='coreSiege'?this.coreSiegePlayer(p.id):undefined;
    if(this.gameMode==='coreSiege'&&teamAttacker&&resolvedKind==='melee'){
      const attackerProgress=this.coreSiegePlayer(teamAttacker.id);
      if(isCoreSiegeMeleeHero(normalizeCoreSiegeHero(attackerProgress.heroId)))attackerProgress.meleeChaseUntil=Math.max(attackerProgress.meleeChaseUntil,now+CORE_SIEGE_CONFIG.meleeChaseSeconds);
    }
    if(siegeProgress&&normalizeCoreSiegeHero(siegeProgress.heroId)==='twinBlade'&&now<siegeProgress.parryUntil&&reason!=='방어 포탑'&&(resolvedKind==='bullet'||resolvedKind==='melee')){
      siegeProgress.parryUntil=0;siegeProgress.parryRecoveryUntil=0;siegeProgress.ability1ReadyAt=Math.max(now,siegeProgress.ability1ReadyAt-2.5);
      this.broadcast('coreSiegeEffect',{kind:'bladeCounter',ownerId:p.id,targetId:teamAttacker?.id??'',x:p.x,y:p.y,x1:p.x,y1:p.y,x2:teamAttacker?.x??p.x+Math.cos(p.angle)*130,y2:teamAttacker?.y??p.y+Math.sin(p.angle)*130,angle:p.angle,radius:125,duration:.5});
      if(teamAttacker?.alive&&distance(p.x,p.y,teamAttacker.x,teamAttacker.y)<=150)this.damage(teamAttacker,(28+this.coreSiegeAbilityRank(siegeProgress,2)*4),p.id,'쌍검 반격',80,Math.atan2(teamAttacker.y-p.y,teamAttacker.x-p.x),'melee');
      return;
    }
    const zoneTickDamage=kind==='zone'||reason==='자기장';
    if(!zoneTickDamage){
      this.cancelHeal(p);
      if(p.werewolf.ritualizing)this.cancelWerewolfRitual(p);
      this.revealBushPlayer(p,BUSH_HIT_REVEAL_SECONDS);
    }
    let actual=amount*(attackerId&&this.gameMode==='coreSiege'?coreSiegePowerMultiplier(this.coreSiegePlayer(attackerId).powerStacks):1);
    if(this.gameMode==='coreSiege'&&teamAttacker){const mark=this.coreSiegeHuntMarks.get(teamAttacker.id);if(mark&&this.now()>=mark.expiresAt)this.coreSiegeHuntMarks.delete(teamAttacker.id);else if(mark?.targetId===p.id){const rear=Math.abs(this.angleDiff(Math.atan2(teamAttacker.y-p.y,teamAttacker.x-p.x),p.angle))>2.15;actual*=rear?1.28:1.1;}}
    if(p.werewolf.transformed)actual=werewolfDamage(actual,resolvedKind);
    if(siegeProgress&&this.now()<siegeProgress.markedUntil)actual*=1.12;
    if(this.gameMode==='coreSiege'&&reason==='방어 포탑'&&this.tacticalInventory(p.id).exoActive)actual*=.72;
    const exo=this.tacticalInventory(p.id);
    if(this.gameMode==='coreSiege'&&!zoneTickDamage&&!exo.exoActive){
      actual*=CORE_SIEGE_CONFIG.heroDamageTakenMultiplier;
      const heroId=normalizeCoreSiegeHero(this.coreSiegePlayer(p.id).heroId);
      if(heroId==='ironCyclone')actual*=CORE_SIEGE_CONFIG.ironDamageTakenMultiplier;
      else if(heroId==='earthHammer')actual*=CORE_SIEGE_CONFIG.earthDamageTakenMultiplier;
      else if(heroId==='chainExecutioner')actual*=CORE_SIEGE_CONFIG.chainDamageTakenMultiplier;
      else if(heroId==='twinBlade')actual*=CORE_SIEGE_CONFIG.bladeDamageTakenMultiplier;
    }
    if(siegeProgress&&siegeProgress.temporaryShield>0&&actual>0){
      const absorbed=Math.min(siegeProgress.temporaryShield,actual);
      siegeProgress.temporaryShield-=absorbed;
      actual-=absorbed;
    }
    if(p.armor>0&&resolvedKind==='bullet'&&kind!=='silver'){
      const absorbed=actual*.3;
      actual-=absorbed;
      p.armor=Math.max(0,p.armor-absorbed*1.5);
    }
    if(exo.exoActive&&actual>0){const absorbed=Math.min(exo.exoHp,actual);exo.exoHp=Math.max(0,exo.exoHp-absorbed);actual-=absorbed;if(exo.exoHp<=0)this.endExoSuit(p,'destroyed');}
    if(this.practiceMode&&p.id==='core-siege-practice-target'&&this.practiceTargetInvulnerable)actual=Math.min(actual,Math.max(0,p.hp-1));
    if(this.gameMode==='coreSiege'&&actual>0&&teamAttacker&&resolvedKind==='melee'){
      const attackerProgress=this.coreSiegePlayer(teamAttacker.id),heroId=normalizeCoreSiegeHero(attackerProgress.heroId),readyAt=this.coreSiegeMeleeShieldReadyAt.get(teamAttacker.id)??0;
      if(isCoreSiegeMeleeHero(heroId)&&now>=readyAt){
        attackerProgress.temporaryShield=Math.max(attackerProgress.temporaryShield,CORE_SIEGE_CONFIG.meleeContactShield);
        attackerProgress.temporaryShieldEndsAt=Math.max(attackerProgress.temporaryShieldEndsAt,now+CORE_SIEGE_CONFIG.meleeContactShieldSeconds);
        this.coreSiegeMeleeShieldReadyAt.set(teamAttacker.id,now+CORE_SIEGE_CONFIG.meleeContactShieldCooldownSeconds);
        this.broadcast('coreSiegeEffect',{kind:'meleeGuard',playerId:teamAttacker.id,x:teamAttacker.x,y:teamAttacker.y,radius:64,duration:.45});
      }
    }
    if(this.gameMode==='coreSiege'&&teamAttacker&&resolvedKind==='melee'&&normalizeCoreSiegeHero(this.coreSiegePlayer(teamAttacker.id).heroId)==='ironCyclone'&&this.now()<this.coreSiegePlayer(teamAttacker.id).rampageUntil)this.healPlayer(teamAttacker,actual*.16);
    if(this.gameMode==='coreSiege'&&teamAttacker?.werewolf.transformed&&resolvedKind==='melee'&&normalizeCoreSiegeHero(this.coreSiegePlayer(teamAttacker.id).heroId)==='wolfWarrior'){
      const ratio=teamAttacker.hp/Math.max(1,this.playerMaxHp(teamAttacker))<=.35?.27:.22,healed=Math.min(16,actual*ratio);
      this.healPlayer(teamAttacker,healed);
      if(healed>=1)this.broadcast('coreSiegeEffect',{kind:'wolfLifesteal',ownerId:teamAttacker.id,targetId:p.id,x:teamAttacker.x,y:teamAttacker.y,x2:p.x,y2:p.y,radius:68,duration:.45,amount:healed});
    }
    if(p.ai&&!zoneTickDamage&&amount>0){const dangerKind:AiDangerKind=resolvedKind==='silver'?'bullet':resolvedKind==='zone'?'other':resolvedKind;recordAiDanger(this.ensureAiExperienceBrain(p.id),{x:p.x,y:p.y,now:this.now(),kind:dangerKind,severity:clamp(amount/42,.25,1.8),radius:resolvedKind==='explosion'||resolvedKind==='fire'?250:205});}
    if(this.arenaLike()&&!zoneTickDamage&&attackerId&&attackerId!==p.id&&amount>0)recordAiArenaCombat(this.aiArenaDirector,p.x,p.y,this.now());
    const attacker=this.state.players.get(attackerId);
    if(p.ai&&attackerId&&attackerId!==p.id){
      const now=this.now();this.aiDefendUntil.set(p.id,now+3);
      const memory=this.ensureAiMemory(p);memory.lastThreatAt=now;memory.damagedById=attackerId;memory.damagedAt=now;
      const attackerPlayer=this.state.players.get(attackerId);
      if(attackerPlayer){memory.source='damage';memory.confidence=Math.max(memory.confidence,55);memory.heardX=attackerPlayer.x+(this.lootRandom()-.5)*120;memory.heardY=attackerPlayer.y+(this.lootRandom()-.5)*120;memory.heardAt=now;memory.heardKind='gun';}
    }
    const hitAngle=Number.isFinite(hitAngleOverride)?Number(hitAngleOverride):attacker?Math.atan2(p.y-attacker.y,p.x-attacker.x):p.lastHitAngle;
    p.hitSeq++;
    p.lastHitAngle=hitAngle;
    p.lastHitDamage=actual;
    if(attacker&&reason!=='자기장'){
      const power=knockbackOverride>0?knockbackOverride:this.knockbackPower(attacker,reason);
      if(power>0){
        const current=this.knockback.get(p.id)??{vx:0,vy:0};
        let effectivePower=p.werewolf.transformed&&resolvedKind==='explosion'?power*WEREWOLF_BALANCE.explosionKnockbackMultiplier:power;
        if(siegeProgress&&now<siegeProgress.anchoredUntil)effectivePower*=.5;
        current.vx+=Math.cos(hitAngle)*effectivePower;
        current.vy+=Math.sin(hitAngle)*effectivePower;
        const max=this.gameMode==='coreSiege'?CORE_SIEGE_CONFIG.maxKnockback:420;
        const len=Math.hypot(current.vx,current.vy);
        if(len>max){current.vx=current.vx/len*max;current.vy=current.vy/len*max;}
        this.knockback.set(p.id,current);
      }
    }
    p.hp-=actual;
    if(siegeProgress?.deathGuardReady&&this.now()<siegeProgress.deathGuardUntil&&p.hp<=0){
      siegeProgress.deathGuardReady=false;
      siegeProgress.deathGuardUntil=0;
      p.hp=1;
      this.broadcast('coreSiegeEffect',{kind:'deathGuard',playerId:p.id,x:p.x,y:p.y,radius:82,duration:.8});
    }
    if(p.ai&&!zoneTickDamage)this.emitAiPersonaDialogue(p,p.hp<=35?'low_hp':'hit',{casual:false,loggable:false,allowResponse:false});
    if(attacker)attacker.damageDone+=actual;
    if(p.hp<=0){
      this.cancelLaserCannonCharge(p);
      this.clearChickenTransform(p,false);this.chickenState(p).chickenImmuneUntil=0;
      if(p.ai)recordAiDanger(this.ensureAiExperienceBrain(p.id),{x:p.x,y:p.y,now:this.now(),kind:'death',severity:1.25,radius:285});
      if(exo.exoActive)this.endExoSuit(p,'death');
      if(p.werewolf.transformed)this.endWerewolfCycle(p,'death');
      else if(p.werewolf.hasCurse)this.handleCurseHolderDeath(p,attacker);
      p.hp=0;
      p.alive=false;
      p.phase='dead';
      p.aiState='DEAD';
      p.isSniperScoped=false;
      const cause=reason==='자기장'?'zone':reason==='오토바이 충돌'?'motorcycle_collision':reason==='오토바이 폭발'?'motorcycle_explosion':reason==='파편 수류탄'?'frag_grenade':reason==='화염탄'?'incendiary':attacker?.equipped==='sniper'?'sniper':attacker?.equipped==='shotgun'?'shotgun':reason==='총기'?'bullet':'other';
      this.broadcast('characterDeath',{
        entityId:p.id,entityType:p.ai?'ai':'player',x:p.x,y:p.y,angle:p.angle,buildingId:p.buildingId,
        displayName:p.name,ai:p.ai,equipped:p.equipped,killerId:attackerId,cause,
        hitDirectionX:Math.cos(hitAngle),hitDirectionY:Math.sin(hitAngle),inBush:p.inBush,bushRevealed:p.bushRevealed,diedAt:this.now(),
      });
      this.clearVault(p);this.cancelThrow(p);
      this.detachPlayerFromVehicle(p);
      this.knockback.delete(p.id);
      this.aiIntent.delete(p.id);
      this.releaseLootReservation(p.id);
      this.aiLandedAt.delete(p.id);
      this.aiDefendUntil.delete(p.id);
      this.aiMemories.delete(p.id);
      this.aiProfiles.delete(p.id);
      this.aiTacticalBrains.delete(p.id);
      this.aiResourceBrains.delete(p.id);
      this.aiDialogueResponses=this.aiDialogueResponses.filter((job)=>job.speakerId!==p.id&&job.responderId!==p.id);
      this.aiMovementSamples.delete(p.id);
      this.aiLocomotionBrains.delete(p.id);
      this.bushRevealUntil.delete(p.id);
      p.inBush=false;
      p.bushRevealed=false;
      this.cancelReload(p);
      this.lastSafePositions.delete(p.id);
      if(this.gameMode==='battleRoyale')this.state.placements.unshift(p.name);
      else{this.openArenaDeaths.set(p.id,(this.openArenaDeaths.get(p.id)??0)+1);this.arenaKillStreak.set(p.id,0);}
      if(attacker&&attacker.id!==p.id){
        attacker.kills++;
        if(this.gameMode==='coreSiege'&&attacker.team)this.awardCoreSiegeTeamXp(attacker.team,p.x,p.y,CORE_SIEGE_CONFIG.heroXp,attacker.id);
        if(this.gameMode==='openArena')this.recordOpenArenaKill(attacker,p);
        if(attacker.ai)this.emitAiPersonaDialogue(attacker,'kill',{casual:false,loggable:false,allowResponse:true,force:true});
        this.emitAudioEvent('kill_confirm',{sourceId:attacker.id,targetId:p.id,variant:cause},this.playerClient(attacker.id));
        this.broadcast('killfeed',{killer:attacker.name,victim:p.name,reason});
      }else this.broadcast('killfeed',{killer:reason,victim:p.name,reason});
      if(this.arenaLike()){if(this.openArenaRoundState==='active'){if(this.gameMode!=='coreSiege')this.dropOpenArenaDeathLoot(p);this.scheduleOpenArenaRespawn(p);}this.broadcastOpenArenaScoreboard(true);}
      else this.dropInventory(p);
    }
  }

  private openArenaRoundLocked(){return this.arenaLike()&&this.openArenaRoundState!=='active';}

  private clearOpenArenaRoundScores(){
    this.openArenaDeaths.clear();this.arenaKillStreak.clear();this.arenaBestStreak.clear();this.arenaHumanKills.clear();this.arenaAiKills.clear();this.arenaKillReachedAt.clear();
    this.openArenaTeamKills={blue:0,red:0};
    for(const player of this.state.players.values()){player.kills=0;player.damageDone=0;}
  }

  private openArenaHumanRows():ArenaScoreRow[]{
    const rows=[...this.state.players.values()].map((player)=>{const deaths=this.openArenaDeaths.get(player.id)??0;return{id:player.id,name:player.name,ai:player.ai,team:normalizeCombatTeam(player.team),kills:player.kills,deaths,kd:deaths>0?Number((player.kills/deaths).toFixed(2)):player.kills,streak:this.arenaKillStreak.get(player.id)??0,bestStreak:this.arenaBestStreak.get(player.id)??0,humanKills:this.arenaHumanKills.get(player.id)??0,aiKills:this.arenaAiKills.get(player.id)??0,damageDone:Number(player.damageDone??0),alive:player.alive,reachedAt:this.arenaKillReachedAt.get(player.id)??Number.MAX_SAFE_INTEGER};});
    return(this.openArenaConfig?.spectatorOnly?sortOpenArenaRows(rows,true):sortOpenArenaHumanRows(rows)).slice(0,20);
  }

  private recordOpenArenaKill(attacker:PlayerState,victim:PlayerState){
    if(attacker.id===victim.id)return;
    const streak=(this.arenaKillStreak.get(attacker.id)??0)+1;this.arenaKillStreak.set(attacker.id,streak);this.arenaBestStreak.set(attacker.id,Math.max(streak,this.arenaBestStreak.get(attacker.id)??0));
    const targetMap=victim.ai?this.arenaAiKills:this.arenaHumanKills;targetMap.set(attacker.id,(targetMap.get(attacker.id)??0)+1);this.arenaKillReachedAt.set(attacker.id,this.now());
    if(this.matchFormat==='teams'&&(attacker.team==='blue'||attacker.team==='red')){
      this.openArenaTeamKills[attacker.team]++;
      const limit=this.openArenaConfig?.killLimit??0;
      if(limit>0&&this.openArenaTeamKills[attacker.team]>=limit){this.finishOpenArenaTeamRound(attacker.team,attacker);return;}
    }
    const row=this.openArenaHumanRows().find((candidate)=>candidate.id===attacker.id);if(row&&shouldFinishOpenArenaRound(this.openArenaConfig?.killLimit??0,row,Boolean(this.openArenaConfig?.spectatorOnly)))this.finishOpenArenaRound(attacker,row);
  }

  private openArenaRoundPayload(){const winner=this.state.players.get(this.openArenaRoundWinnerId),objectiveWinner=this.gameMode==='coreSiege'?this.state.coreSiege.winner:this.state.domination.winner,teamWinner=objectiveWinner==='blue'?'파랑팀':objectiveWinner==='red'?'빨강팀':this.matchFormat==='teams'&&winner?.team==='blue'?'파랑팀':this.matchFormat==='teams'&&winner?.team==='red'?'빨강팀':'';return{roundState:this.openArenaRoundState,roundEndsAt:this.openArenaRoundEndsAt,resettingAt:this.openArenaRoundResettingAt,roundGeneration:this.openArenaRoundGeneration,killLimit:this.openArenaConfig?.killLimit??0,winnerId:this.openArenaRoundWinnerId,winnerName:teamWinner||winner?.name||'',teamKills:{...this.openArenaTeamKills},rows:this.openArenaRoundRows};}

  private finishOpenArenaTeamRound(team:'blue'|'red',representative:PlayerState){
    const row=this.openArenaHumanRows().find((candidate)=>candidate.id===representative.id);if(!row)return;
    this.finishOpenArenaRound(representative,row,team);
  }

  private finishOpenArenaRound(winner:PlayerState,winnerRow:ArenaScoreRow,winnerTeam:'blue'|'red'|null=null){
    if(this.gameMode!=='openArena'||this.openArenaRoundState!=='active')return;
    const now=this.now();this.openArenaRoundState='result';this.openArenaRoundEndsAt=now+OPEN_ARENA_ROUND_TOTAL_SECONDS;this.openArenaRoundResettingAt=this.openArenaRoundEndsAt-OPEN_ARENA_ROUND_COUNTDOWN_SECONDS;this.openArenaRoundWinnerId=winner.id;this.openArenaRoundRows=this.openArenaHumanRows();this.openArenaRoundGeneration++;
    this.humanRespawnAt.clear();this.spawnProtectionUntil.clear();this.inputs.clear();for(const slot of this.openArenaAiSlots.values()){slot.respawnAt=0;slot.generation++;}for(const player of this.state.players.values()){this.cancelHeal(player);this.cancelReload(player);this.cancelThrow(player);player.isSniperScoped=false;}this.disableWerewolfSeason();this.openArenaNextRitualWarningAt=0;this.openArenaRitualActiveEndsAt=0;
    const winnerName=winnerTeam?(winnerTeam==='blue'?'파랑팀':'빨강팀'):winner.name;
    const payload={...this.openArenaRoundPayload(),winnerName,winner:winnerRow};this.broadcast('arenaRoundResult',payload);this.system(`${winnerName}이 ${this.openArenaConfig?.killLimit??0}킬을 달성했습니다. 8초 후 다음 라운드가 시작됩니다.`);this.syncRoomRegistry();
  }

  private updateOpenArenaRound(){
    if(this.openArenaRoundState==='active')return;const now=this.now();
    if(this.openArenaRoundState==='result'&&now>=this.openArenaRoundResettingAt){this.openArenaRoundState='resetting';this.broadcast('arenaStatus',this.arenaStatusPayload());this.syncRoomRegistry();}
    if(now>=this.openArenaRoundEndsAt)this.resetOpenArenaRound();
  }

  private resetOpenArenaRound(){
    if(!this.arenaLike())return;this.openArenaRoundGeneration++;this.clearTransient();this.humanRespawnAt.clear();this.spawnProtectionUntil.clear();this.clearOpenArenaRoundScores();this.openArenaRoundWinnerId='';this.openArenaRoundRows=[];this.openArenaRoundEndsAt=0;this.openArenaRoundResettingAt=0;this.openArenaNextSupplyDropAt=this.now()+this.arenaSupplyFirstDelay();this.openArenaNextRitualWarningAt=this.now()+this.arenaRitualFirstDelay();this.openArenaRitualActiveEndsAt=0;this.openArenaLastRitualPoint=null;
    if(this.gameMode==='coreSiege')this.initializeCoreSiege();
    let index=0;for(const player of this.state.players.values()){this.resetOpenArenaCombatant(player,index++,true);this.giveOpenArenaStarterKit(player);if(player.ai){const slot=this.openArenaAiSlots.get(player.id);if(slot){slot.state='alive';slot.respawnAt=0;slot.generation++;}}}
    this.state.aliveCount=[...this.state.players.values()].filter((player)=>player.alive).length;if(this.gameMode!=='coreSiege'){this.spawnLoot();this.spawnMotorcycles();}this.initializeDomination();this.openArenaRoundState='active';this.broadcast('arenaRoundStarted',{roundGeneration:this.openArenaRoundGeneration,startedAt:this.now(),killLimit:this.openArenaConfig?.killLimit??0});this.broadcast('arenaStatus',this.arenaStatusPayload());this.broadcastOpenArenaScoreboard(true);this.system(this.gameMode==='coreSiege'?'다음 코어 공성전이 시작되었습니다.':this.gameMode==='domination'?'다음 AI 점령전 라운드가 시작되었습니다.':'다음 상시 전장 라운드가 시작되었습니다.');this.syncRoomRegistry();
  }

  private openArenaScoreboardPayload(){
    const rows=this.openArenaRoundState==='active'?this.openArenaHumanRows():this.openArenaRoundRows;
    return{generatedAt:this.now(),rows,status:this.arenaStatusPayload(),round:this.openArenaRoundPayload()};
  }

  private broadcastOpenArenaScoreboard(force=false){
    if(!this.arenaLike())return;const now=this.now();if(!force&&now<this.arenaScoreboardAt)return;this.arenaScoreboardAt=now+1;this.broadcast('arenaScoreboard',this.openArenaScoreboardPayload());
  }

  private markOpenArenaLootConsumed(lootId:string){
    if(!this.arenaLike())return;
    const slotId=this.arenaLootToSlot.get(lootId);if(!slotId)return;
    const slot=this.arenaLootSlots.get(slotId);this.arenaLootToSlot.delete(lootId);
    if(!slot)return;
    const spawn=this.map.lootSpawns[slot.spawnIndex],category=spawn?.category??'misc';
    const delay=this.gameMode!=='domination'?arenaLootRespawnSeconds(category):category==='weapon'?DOMINATION_CONFIG.weaponRespawnSeconds:category==='ammo'?DOMINATION_CONFIG.ammoRespawnSeconds:category==='heal'?DOMINATION_CONFIG.healRespawnSeconds:category==='throwable'?DOMINATION_CONFIG.throwableRespawnSeconds:DOMINATION_CONFIG.miscRespawnSeconds;
    slot.currentLootId='';slot.respawnAt=this.now()+delay;slot.generation++;
  }

  private createOpenArenaTimedDrop(kind:LootKind,x:number,y:number,configure?:(loot:LootState)=>void){
    const pos=this.findSeparatedLootPosition(x,y,kind,'',0)??this.findNearestFreePoint(x,y,160);if(!pos)return;
    const loot=new LootState();loot.id=`loot-${++this.lootSeq}`;loot.kind=kind;loot.x=pos.x;loot.y=pos.y;const lootSpace=spaceAt(pos.x,pos.y,this.map.buildingVisibilityZones,this.map.rooms,0);loot.buildingId=lootSpace.buildingId;loot.roomIndex=lootSpace.roomIndex;configure?.(loot);this.state.loot.set(loot.id,loot);this.arenaDropExpiresAt.set(loot.id,this.now()+OPEN_ARENA_DROP_TTL_SECONDS);
  }

  private dropOpenArenaDeathLoot(p:PlayerState){
    const weapon=(p.equipped in WEAPONS&&p.equipped!=='fists'?p.equipped:p.primary||p.secondary) as WeaponId|'';
    if(weapon&&weapon in WEAPONS){const magazine=this.getWeaponMagazine(p,weapon);this.createOpenArenaTimedDrop(weapon as LootKind,p.x+28,p.y,(loot)=>{loot.weaponMagazine=magazine;loot.grantsAmmo=false;});const ammo=WEAPONS[weapon].ammoType;const ammoKind=ammo==='pistol_ammo'?'pistol_ammo':ammo==='standard_ammo'?'standard_ammo':ammo==='shotgun_ammo'?'shotgun_ammo':ammo==='rocket_ammo'?'rocket_ammo':ammo==='rail_slug'?'rail_slug':ammo==='laser_cell'?'laser_cell':ammo==='chicken_capsule'?'chicken_capsule':ammo==='fuel_ammo'?'fuel_ammo':'';if(ammoKind)this.createOpenArenaTimedDrop(ammoKind as LootKind,p.x-24,p.y,(loot)=>{loot.ammoCount=Math.max(1,Math.min(24,this.getAmmo(p,ammo)));});}
    if(p.medkits>0)this.createOpenArenaTimedDrop('medkit',p.x,p.y+32);else if(p.bandages>0)this.createOpenArenaTimedDrop('bandage',p.x,p.y+32);
    const tactical=this.tacticalInventory(p.id);
    if(tactical.spiderMineCount>0){this.createOpenArenaTimedDrop('spider_mine',p.x-38,p.y+18,(loot)=>{loot.stackCount=tactical.spiderMineCount;});tactical.spiderMineCount=0;}
    if(tactical.tankKeyCount>0){this.createOpenArenaTimedDrop('tank_key',p.x+38,p.y+18);tactical.tankKeyCount=0;this.tankKeyRespawnAt=this.now()+90;}
    if(tactical.exoHeadCount>0){this.createExoPartLoot('exo_head',p.x-42,p.y);tactical.exoHeadCount=0;}if(tactical.exoCoreCount>0){this.createExoPartLoot('exo_core',p.x,p.y+42);tactical.exoCoreCount=0;}if(tactical.exoLimbsCount>0){this.createExoPartLoot('exo_limbs',p.x+42,p.y);tactical.exoLimbsCount=0;}
    if(tactical.empExoHeadCount>0){this.createExoPartLoot('emp_exo_head',p.x-58,p.y-26);tactical.empExoHeadCount=0;}if(tactical.empExoCoreCount>0){this.createExoPartLoot('emp_exo_core',p.x,p.y-58);tactical.empExoCoreCount=0;}if(tactical.empExoLimbsCount>0){this.createExoPartLoot('emp_exo_limbs',p.x+58,p.y-26);tactical.empExoLimbsCount=0;}
  }

  private markOpenArenaVehicleDestroyed(vehicleId:string){
    if(!this.arenaLike())return;
    for(const slot of this.arenaVehicleSlots.values())if(slot.currentVehicleId===vehicleId){slot.currentVehicleId='';slot.respawnAt=this.now()+OPEN_ARENA_VEHICLE_RESPAWN_SECONDS;slot.generation++;return;}
  }

  private respawnOpenArenaVehicle(slot:ArenaVehicleSlot){
    if(slot.currentVehicleId&&this.state.motorcycles.has(slot.currentVehicleId))return;
    const point=this.findNearestVehiclePoint(slot.x,slot.y,260);if(!point){slot.respawnAt=this.now()+5;return;}
    const motorcycle=new MotorcycleState();motorcycle.id=slot.spawnId;motorcycle.x=point.x;motorcycle.y=point.y;motorcycle.rotation=slot.rotation;motorcycle.lastSafeX=point.x;motorcycle.lastSafeY=point.y;motorcycle.hp=MOTORCYCLE_DESTRUCTION_BALANCE.maxHp;motorcycle.maxHp=MOTORCYCLE_DESTRUCTION_BALANCE.maxHp;motorcycle.buildingId=buildingIdAt(point.x,point.y,0,this.map.buildingVisibilityZones);this.state.motorcycles.set(motorcycle.id,motorcycle);this.vehicleStuckStates.set(motorcycle.id,{lastX:point.x,lastY:point.y,stuckFor:0,lastRecoveryAt:-99});slot.currentVehicleId=motorcycle.id;slot.respawnAt=0;
  }

  private updateOpenArenaWorld(){
    if(this.gameMode==='coreSiege')return;
    const now=this.now();if(now<this.arenaWorldCleanupAt)return;this.arenaWorldCleanupAt=now+OPEN_ARENA_WORLD_CLEANUP_INTERVAL_SECONDS;this.updateOpenArenaRecurringSupplyDrops(now);
    for(const [lootId,loot] of this.state.loot)if(!this.isExoPart(loot.kind as LootKind)&&!this.arenaLootToSlot.has(lootId)&&!this.arenaDropExpiresAt.has(lootId))this.arenaDropExpiresAt.set(lootId,now+OPEN_ARENA_DROP_TTL_SECONDS);
    for(const [lootId,expiresAt] of [...this.arenaDropExpiresAt])if(now>=expiresAt){this.state.loot.delete(lootId);this.lootReservations.delete(lootId);this.arenaDropExpiresAt.delete(lootId);}
    for(const slot of this.arenaLootSlots.values()){
      if(slot.currentLootId&&this.state.loot.has(slot.currentLootId))continue;
      if(slot.currentLootId){this.arenaLootToSlot.delete(slot.currentLootId);slot.currentLootId='';slot.respawnAt=Math.max(slot.respawnAt,now+5);}
      if(now<slot.respawnAt)continue;
      const spawn=this.map.lootSpawns[slot.spawnIndex];if(!spawn)continue;const kind=this.lootKindForSpawn(spawn);const expectedSpace=spaceAt(spawn.x,spawn.y,this.map.buildingVisibilityZones,this.map.rooms,0);const expectedBuildingId=spawn.buildingId??expectedSpace.buildingId,expectedRoomIndex=spawn.roomIndex??expectedSpace.roomIndex;const pos=this.findSeparatedLootPosition(spawn.x,spawn.y,kind,expectedBuildingId,expectedRoomIndex);if(!pos){slot.respawnAt=now+4;continue;}const loot=new LootState();loot.id=`loot-${++this.lootSeq}`;loot.kind=kind;loot.x=pos.x;loot.y=pos.y;const lootSpace=spaceAt(pos.x,pos.y,this.map.buildingVisibilityZones,this.map.rooms,0);loot.buildingId=lootSpace.buildingId;loot.roomIndex=lootSpace.roomIndex;this.state.loot.set(loot.id,loot);slot.currentLootId=loot.id;slot.respawnAt=0;this.arenaLootToSlot.set(loot.id,slot.slotId);
    }
    for(const slot of this.arenaVehicleSlots.values())if(!slot.currentVehicleId&&now>=slot.respawnAt)this.respawnOpenArenaVehicle(slot);
    if(now>=this.tankKeyRespawnAt)this.spawnTankKeyLoot();
  }

  private knockbackPower(attacker:PlayerState,reason:string):number{
    if(reason==='주먹')return 115;
    if(reason==='야구방망이')return 180;
    if(reason==='프라이팬')return 230;
    if(reason==='쇠파이프')return 180;
    if(reason==='식칼')return 90;
    if(reason==='총기')return attacker.equipped==='sniper'?310:attacker.equipped==='shotgun'?120:attacker.equipped==='rifle'?90:attacker.equipped==='pistol'?72:38;
    return 0;
  }

  private dropInventory(p:PlayerState){
    const drops:Array<{kind:LootKind;weaponMagazine?:number;ammoCount?:number;stackCount?:number}>=[];
    if(p.primary)drops.push({kind:p.primary as LootKind,weaponMagazine:this.getWeaponMagazine(p,p.primary as WeaponId)});
    if(p.secondary)drops.push({kind:p.secondary as LootKind,weaponMagazine:this.getWeaponMagazine(p,p.secondary as WeaponId)});
    if(p.melee!=='fists')drops.push({kind:p.melee as LootKind});
    if(p.throwableType&&p.throwableCount>0&&isThrowableType(p.throwableType))drops.push({kind:p.throwableType,stackCount:p.throwableCount});
    if(p.pistolAmmo>0)drops.push({kind:'pistol_ammo',ammoCount:p.pistolAmmo});
    if(p.standardAmmo>0)drops.push({kind:'standard_ammo',ammoCount:p.standardAmmo});
    if(p.shotgunAmmo>0)drops.push({kind:'shotgun_ammo',ammoCount:p.shotgunAmmo});
    if(p.rocketAmmo>0)drops.push({kind:'rocket_ammo',ammoCount:p.rocketAmmo});
    if(p.fuelAmmo>0)drops.push({kind:'fuel_ammo',ammoCount:p.fuelAmmo});
    const tactical=this.tacticalInventory(p.id);
    if(tactical.railSlugAmmo>0)drops.push({kind:'rail_slug',ammoCount:tactical.railSlugAmmo});
    if(tactical.laserCellAmmo>0)drops.push({kind:'laser_cell',ammoCount:tactical.laserCellAmmo});
    if(tactical.chickenCapsuleAmmo>0)drops.push({kind:'chicken_capsule',ammoCount:tactical.chickenCapsuleAmmo});
    if(tactical.adhesiveCharge>0)drops.push({kind:'adhesive_charge',ammoCount:tactical.adhesiveCharge});
    if(tactical.silverBoltAmmo>0)drops.push({kind:'silver_bolt',ammoCount:tactical.silverBoltAmmo});
    if(tactical.stripTrapCount>0)drops.push({kind:'strip_trap',stackCount:tactical.stripTrapCount});
    if(tactical.hunterDroneCount>0)drops.push({kind:'hunter_drone',stackCount:tactical.hunterDroneCount});
    if(tactical.spiderMineCount>0)drops.push({kind:'spider_mine',stackCount:tactical.spiderMineCount});
    if(tactical.tankKeyCount>0)drops.push({kind:'tank_key'});
    if(tactical.exoHeadCount>0)drops.push({kind:'exo_head'});if(tactical.exoCoreCount>0)drops.push({kind:'exo_core'});if(tactical.exoLimbsCount>0)drops.push({kind:'exo_limbs'});
    if(tactical.empExoHeadCount>0)drops.push({kind:'emp_exo_head'});if(tactical.empExoCoreCount>0)drops.push({kind:'emp_exo_core'});if(tactical.empExoLimbsCount>0)drops.push({kind:'emp_exo_limbs'});
    if(p.armor>0)drops.push({kind:'vest'});if(p.bandages>0)drops.push({kind:'bandage'});if(p.medkits>0)drops.push({kind:'medkit'});
    const total=Math.max(1,drops.length);
    drops.forEach((drop,index)=>{
      const kind=drop.kind,ring=kind==='vest'?70:kind==='bandage'||kind==='medkit'?58:kind.includes('ammo')?45:kind in WEAPONS?30:38;
      const angle=index/total*Math.PI*2,baseX=p.x+Math.cos(angle)*ring,baseY=p.y+Math.sin(angle)*ring;
      const pos=this.findSeparatedLootPosition(baseX,baseY,kind,p.buildingId,p.roomIndex)??this.findNearestFreePoint(baseX,baseY,180);if(!pos)return;
      const loot=new LootState();loot.id=`loot-${++this.lootSeq}`;loot.kind=kind;loot.x=pos.x;loot.y=pos.y;const lootSpace=spaceAt(loot.x,loot.y,this.map.buildingVisibilityZones,this.map.rooms,0);loot.buildingId=lootSpace.buildingId;loot.roomIndex=lootSpace.roomIndex;
      if(drop.weaponMagazine!==undefined){loot.weaponMagazine=drop.weaponMagazine;loot.grantsAmmo=false;}if(drop.stackCount!==undefined)loot.stackCount=drop.stackCount;if(drop.ammoCount!==undefined)loot.ammoCount=drop.ammoCount;
      this.state.loot.set(loot.id,loot);
    });
  }

  private finishCheck(){
    const alive=[...this.state.players.values()].filter((p)=>p.alive);
    this.state.aliveCount=alive.length;
    const survivingTeams=new Set(alive.map((player)=>player.team).filter((team)=>team==='blue'||team==='red'));
    const teamFinished=this.matchFormat==='teams'&&survivingTeams.size<=1;
    if((this.matchFormat==='teams'?teamFinished:alive.length<=1)&&this.state.players.size>1&&this.state.phase!=='FINISHED'){
      this.state.phase='FINISHED';
      for(const p of this.state.players.values())if(p.werewolf.transformed)this.endWerewolfCycle(p,'round_end');
      this.disableWerewolfSeason();
      const winningTeam=alive[0]?.team;
      this.state.winner=this.matchFormat==='teams'?(winningTeam==='blue'?'파랑팀':winningTeam==='red'?'빨강팀':'없음'):alive[0]?.name??'없음';
      if(this.matchFormat==='teams')for(const survivor of alive)this.state.placements.unshift(survivor.name);else if(alive[0])this.state.placements.unshift(alive[0].name);
      this.clearCountermeasureState();
      this.syncRoomRegistry();
      this.broadcast('result',{winner:this.state.winner,placements:[...this.state.placements]});
    }
  }

  private resetLobby(){
    this.clearTransient();
    for(const [id,p] of [...this.state.players]){
      if(p.ai){this.state.players.delete(id);this.state.tacticalInventories.delete(id);this.state.coreSiege.players.delete(id);}
      else{
        p.ready=false;
        p.alive=true;
        p.maxHp=100;
        p.hp=p.maxHp;
        p.phase='lobby';
        p.primary='';
        p.secondary='';
        p.melee='fists';
        p.equipped='fists';p.previousEquipped='fists';p.throwableType='';p.throwableCount=0;p.isPreparingThrow=false;p.throwCharge=0;
        p.magazine=0;
        p.pistolMagazine=0;
        p.smgMagazine=0;
        p.rifleMagazine=0;
        p.shotgunMagazine=0;
        p.sniperMagazine=0;
        p.bazookaMagazine=0;
        p.flamethrowerMagazine=0;
        p.pistolAmmo=0;
        p.standardAmmo=0;
        p.shotgunAmmo=0;
        p.rocketAmmo=0;
        p.fuelAmmo=0;
        this.tacticalInventory(p.id).boomerangMagazine=0;
        this.tacticalInventory(p.id).rcCarMagazine=0;
      this.resetWerewolfPlayer(p);this.resetChickenPlayer(p);
      {const tactical=this.tacticalInventory(p.id);tactical.adhesiveSprayerMagazine=0;tactical.adhesiveCharge=0;tactical.stripTrapCount=0;tactical.silverCrossbowMagazine=0;tactical.silverBoltAmmo=0;tactical.railgunMagazine=0;tactical.railSlugAmmo=0;tactical.laserCannonMagazine=0;tactical.laserCellAmmo=0;tactical.laserCannonCharging=false;tactical.laserCannonChargeStartedAt=0;tactical.stunGunMagazine=0;tactical.hunterDroneCount=0;tactical.spiderMineCount=0;tactical.tankKeyCount=0;this.resetChickenInventory(tactical);this.resetExoInventory(tactical);}
        p.bandages=0;
        p.medkits=0;
        p.healingKind='';
        p.healingProgress=0;
        p.reloading=false;
        p.reloadWeapon='';
        p.reloadProgress=0;
        p.attackSeq=0;
        p.hitSeq=0;
        p.lastHitAngle=0;
        p.lastHitDamage=0;
        p.inBush=false;
        p.bushRevealed=false;
        p.buildingId='';
        p.roomIndex=0;
        p.insideBuilding=false;
        p.isSwimming=false;
        p.buildingTransitionSeq=0;
        p.isSniperScoped=false;
        p.isDriving=false;
        p.vehicleId='';
        p.isVaulting=false;
        p.vaultProgress=0;
        p.vaultWindowId='';
        p.aiState='';
      }
    }
    this.state.coreSiege.enabled=false;this.state.coreSiege.structures.clear();this.state.coreSiege.minions.clear();this.state.coreSiege.camps.clear();this.state.coreSiege.upgrades.clear();this.state.coreSiege.winner='';
    this.state.phase='LOBBY';
    this.state.winner='';
    this.state.placements.clear();
    this.state.aliveCount=this.state.players.size;
    this.syncRoomRegistry();
  }

  private updateBuildingStates(){
    for(const player of this.state.players.values()){
      if(player.phase!=='landed'||player.isSwimming){
        if(player.buildingId||player.roomIndex){player.buildingId='';player.roomIndex=0;player.insideBuilding=false;player.buildingTransitionSeq++;}
        continue;
      }
      if(player.isVaulting)continue;
      const next=spaceAt(player.x,player.y,this.map.buildingVisibilityZones,this.map.rooms,12);
      if(next.buildingId!==player.buildingId||next.roomIndex!==player.roomIndex){
        player.buildingId=next.buildingId;
        player.roomIndex=next.roomIndex;
        player.insideBuilding=!next.outdoors;
        player.buildingTransitionSeq++;
      }
    }
  }

  private canSeeTarget(viewer:PlayerState,target:PlayerState){
    const roomTrace=traceSpaceVisibility(viewer,target,this.map.portals,this.map.visibilityObstacles,3);
    if(!roomTrace.visible)return false;
    const smokeFields=[...this.state.smokeFields.values()];
    if(coreSiegeSmokeTrackerConcealed(target,viewer,smokeFields,this.now()))return false;
    if(smokeVisibilityBetween(viewer,target,smokeFields,this.now())!=='clear')return false;
    return visibilitySampleResult(
      viewer.x,viewer.y,target.x,target.y,
      this.map.visibilityObstacles,PLAYER_HIT_RADIUS,2,
    ).characterVisible;
  }

  private syncRoomRegistry(){
    const humans=[...this.state.players.values()].filter((player)=>!player.ai);
    const host=this.state.players.get(this.state.hostId)??humans[0];
    const firstSpectator=[...this.arenaSpectators.values()].sort((a,b)=>a.joinedAt-b.joinedAt)[0];
    const metadata:Drop8RoomMetadata={
      roomCode:this.state.roomCode,
      hostName:host?.name??firstSpectator?.name??'AI 자동전투',
      players:this.state.players.size,
      humans:humans.length,
      spectators:this.arenaSpectators.size,
      phase:this.state.phase as Drop8RoomMetadata['phase'],
      fillAi:this.state.fillAi,
      publicRoom:this.state.publicRoom,
      mapSizeMode:this.state.mapId as MapSizeMode,
      mapDisplayName:this.map.displayName,
      createdAt:this.createdAt,
      updatedAt:Date.now(),
      gameMode:this.gameMode,
      matchFormat:this.matchFormat,
      maxHumans:this.openArenaConfig?.maxHumans??MAX_PLAYERS,
      configuredAiCount:this.openArenaConfig?.configuredAiCount??0,
      spectatorOnly:Boolean(this.openArenaConfig?.spectatorOnly),
      joinInProgress:this.arenaLike()&&this.state.phase==='ACTIVE'&&this.openArenaLifecycle==='active',
      lifecycle:this.arenaLike()?this.openArenaLifecycle:this.state.phase==='LOBBY'?'lobby':'active',
      killLimit:this.openArenaConfig?.killLimit??0,
      roundState:this.openArenaRoundState,
      quickStart:this.quickStart,
      quickMatchKey:this.quickMatchKey,
    };
    const arenaHidden=this.arenaLike()&&this.openArenaLifecycle!=='active';
    const settings={metadata,private:!this.state.publicRoom||arenaHidden,unlisted:!this.state.publicRoom||arenaHidden,maxClients:this.maxClients};
    this.registrySyncQueue=this.registrySyncQueue
      .then(async()=>{await this.setMatchmaking(settings);})
      .catch((error)=>{console.error('[DROP8 Refactor 017] room metadata sync failed',error);});
  }

  private tacticalInventory(playerId:string){
    let inventory=this.state.tacticalInventories.get(playerId);
    if(!inventory){inventory=new TacticalInventoryState();inventory.id=playerId;this.state.tacticalInventories.set(playerId,inventory);}
    return inventory;
  }

  private chickenState(p:PlayerState){return this.tacticalInventory(p.id);}

  private getWeaponMagazine(p:PlayerState,id:WeaponId):number{
    if(id==='pistol')return p.pistolMagazine;
    if(id==='stun_gun')return this.tacticalInventory(p.id).stunGunMagazine;
    if(id==='smg')return p.smgMagazine;
    if(id==='rifle')return p.rifleMagazine;
    if(id==='shotgun')return p.shotgunMagazine;
    if(id==='sniper')return p.sniperMagazine;
    if(id==='boomerang')return this.tacticalInventory(p.id).boomerangMagazine;
    if(id==='rc_car')return this.tacticalInventory(p.id).rcCarMagazine;
    if(id==='railgun')return this.tacticalInventory(p.id).railgunMagazine;
    if(id==='laser_cannon')return this.tacticalInventory(p.id).laserCannonMagazine;
    if(id==='chicken_blaster')return this.tacticalInventory(p.id).chickenBlasterMagazine;
    if(id==='bazooka')return p.bazookaMagazine;
    if(id==='flamethrower')return p.flamethrowerMagazine;
    if(id==='adhesive_sprayer')return this.tacticalInventory(p.id).adhesiveSprayerMagazine;
    if(id==='silver_crossbow')return this.tacticalInventory(p.id).silverCrossbowMagazine;
    return 0;
  }

  private setWeaponMagazine(p:PlayerState,id:WeaponId,value:number,sync=true){
    const amount=Math.max(0,Math.floor(value));
    if(id==='pistol')p.pistolMagazine=amount;
    else if(id==='stun_gun')this.tacticalInventory(p.id).stunGunMagazine=amount;
    else if(id==='smg')p.smgMagazine=amount;
    else if(id==='rifle')p.rifleMagazine=amount;
    else if(id==='shotgun')p.shotgunMagazine=amount;
    else if(id==='sniper')p.sniperMagazine=amount;
    else if(id==='boomerang')this.tacticalInventory(p.id).boomerangMagazine=amount;
    else if(id==='rc_car')this.tacticalInventory(p.id).rcCarMagazine=amount;
    else if(id==='railgun')this.tacticalInventory(p.id).railgunMagazine=amount;
    else if(id==='laser_cannon')this.tacticalInventory(p.id).laserCannonMagazine=amount;
    else if(id==='chicken_blaster')this.tacticalInventory(p.id).chickenBlasterMagazine=amount;
    else if(id==='bazooka')p.bazookaMagazine=amount;
    else if(id==='flamethrower')p.flamethrowerMagazine=amount;
    else if(id==='adhesive_sprayer')this.tacticalInventory(p.id).adhesiveSprayerMagazine=amount;
    else if(id==='silver_crossbow')this.tacticalInventory(p.id).silverCrossbowMagazine=amount;
    if(sync&&p.equipped===id)p.magazine=amount;
  }

  private syncMagazine(p:PlayerState){
    const id=p.equipped as WeaponId;
    p.magazine=id in WEAPONS&&id!=='fists'?this.getWeaponMagazine(p,id):0;
  }

  private getAmmo(p:PlayerState,t:AmmoType){if(this.gameMode==='coreSiege'&&t!=='none')return Number.MAX_SAFE_INTEGER;return t==='pistol_ammo'?p.pistolAmmo:t==='standard_ammo'?p.standardAmmo:t==='shotgun_ammo'?p.shotgunAmmo:t==='rocket_ammo'?p.rocketAmmo:t==='rail_slug'?this.tacticalInventory(p.id).railSlugAmmo:t==='laser_cell'?this.tacticalInventory(p.id).laserCellAmmo:t==='chicken_capsule'?this.tacticalInventory(p.id).chickenCapsuleAmmo:t==='fuel_ammo'?p.fuelAmmo:t==='adhesive_charge'?this.tacticalInventory(p.id).adhesiveCharge:t==='silver_bolt'?this.tacticalInventory(p.id).silverBoltAmmo:0;}
  private setAmmo(p:PlayerState,t:AmmoType,v:number){const amount=Math.max(0,Math.floor(v));if(t==='pistol_ammo')p.pistolAmmo=amount;else if(t==='standard_ammo')p.standardAmmo=amount;else if(t==='shotgun_ammo')p.shotgunAmmo=amount;else if(t==='rocket_ammo')p.rocketAmmo=Math.min(BAZOOKA_BALANCE.maxRocketReserve,amount);else if(t==='rail_slug')this.tacticalInventory(p.id).railSlugAmmo=Math.min(RAILGUN_BALANCE.maxReserve,amount);else if(t==='laser_cell')this.tacticalInventory(p.id).laserCellAmmo=Math.min(LASER_CANNON_BALANCE.maxReserve,amount);else if(t==='chicken_capsule')this.tacticalInventory(p.id).chickenCapsuleAmmo=Math.min(CHICKEN_BLASTER_BALANCE.maxReserve,amount);else if(t==='fuel_ammo')p.fuelAmmo=Math.min(FLAMETHROWER_BALANCE.maxFuelReserve,amount);else if(t==='adhesive_charge')this.tacticalInventory(p.id).adhesiveCharge=Math.min(ADHESIVE_SPRAYER_BALANCE.maxChargeReserve,amount);else if(t==='silver_bolt')this.tacticalInventory(p.id).silverBoltAmmo=Math.min(SILVER_CROSSBOW_BALANCE.maxReserve,amount);}
  private now(){return this.clock.elapsedTime/1000;}
  private angleDiff(a:number,b:number){return Math.atan2(Math.sin(a-b),Math.cos(a-b));}

  private segmentRect(x1:number,y1:number,x2:number,y2:number,r:{x:number;y:number;w:number;h:number}){
    return segmentRectIntersectionT(x1,y1,x2,y2,r)!==null;
  }
}
