// DROP8_REFACTOR_025_OPEN_ARENA_KILL_LIMIT_MATCH_CYCLE
// DROP8_REFACTOR_024A_OPEN_ARENA_FOUNDATION
export type GameMode='battleRoyale'|'openArena'|'domination'|'coreSiege';
export type MatchFormat='solo'|'teams';
export type CombatTeam='none'|'blue'|'red';
export type OpenArenaLifecycle='active'|'emptyGrace'|'disposed';
export type OpenArenaKillLimit=0|10|20|30|40|60;
export const OPEN_ARENA_KILL_LIMIT_OPTIONS=[10,20,30,40,60,0] as const;

export const OPEN_ARENA_LIMITS={
  minHumans:0,
  maxHumans:8,
  minAi:0,
  maxAi:16,
  defaultHumans:8,
  defaultAi:7,
  maxTotalCombatants:16,
  spectatorSlots:8,
} as const;

export const QUICK_START_CONFIG={
  maxHumans:4,
  aiCount:12,
  killLimit:20,
  defaultMapId:'large',
} as const;

export const PVP_QUICK_START_CONFIG={
  maxHumans:8,
  aiCount:0,
  killLimit:20,
  defaultMapId:'large',
} as const;

export type QuickStartPreset='mixed'|'pvp';

export function normalizeMatchFormat(value:unknown):MatchFormat{return value==='teams'?'teams':'solo';}
export function normalizeCombatTeam(value:unknown):CombatTeam{return value==='blue'||value==='red'?value:'none';}
export function oppositeCombatTeam(team:CombatTeam):CombatTeam{return team==='blue'?'red':team==='red'?'blue':'none';}

export const DOMINATION_CONFIG={
  maxHumans:4,
  aiCount:0,
  minAiCount:0,
  maxAiCount:12,
  scoreToWin:240,
  captureSeconds:7,
  scoreTickSeconds:1,
  captureRadius:165,
  respawnSeconds:5,
  lootBaseBudget:120,
  lootPerCombatant:4,
  lootMaxBudget:180,
  weaponWeightMultiplier:2,
  ammoWeightMultiplier:1.5,
  weaponRespawnSeconds:18,
  ammoRespawnSeconds:12,
  healRespawnSeconds:18,
  throwableRespawnSeconds:25,
  miscRespawnSeconds:35,
  supplyFirstDelaySeconds:45,
  supplyIntervalSeconds:75,
  supplyRetrySeconds:12,
  maxActiveSupplyDrops:2,
  ritualFirstDelaySeconds:75,
  ritualWarningSeconds:12,
  ritualActiveSeconds:40,
  ritualCooldownSeconds:110,
  ritualCompletionSeconds:4,
  mapId:'small',
} as const;

export function quickStartMatchKey(value:unknown,preset:QuickStartPreset='mixed'){
  const mapId=value==='large'?'large':value==='dock8'?'dock8':'small';
  const config=preset==='pvp'?PVP_QUICK_START_CONFIG:QUICK_START_CONFIG;
  const format=preset==='mixed'?'teams':'solo';
  return `openArena:${format}:${mapId}:${config.maxHumans}:${config.aiCount}:${config.killLimit}`;
}

export interface OpenArenaConfig{
  maxHumans:number;
  configuredAiCount:number;
  maxTotalCombatants:number;
  killLimit:OpenArenaKillLimit;
  spectatorOnly:boolean;
}

function finiteInteger(value:unknown,fallback:number){
  const parsed=typeof value==='number'?value:Number(value);
  return Number.isFinite(parsed)?Math.trunc(parsed):fallback;
}

export function normalizeGameMode(value:unknown):GameMode{
  return value==='openArena'||value==='domination'||value==='coreSiege'?value:'battleRoyale';
}

export function normalizeDominationAiCount(value:unknown){
  return Math.max(DOMINATION_CONFIG.minAiCount,Math.min(DOMINATION_CONFIG.maxAiCount,finiteInteger(value,DOMINATION_CONFIG.aiCount)));
}

export function normalizeOpenArenaKillLimit(value:unknown):OpenArenaKillLimit{
  const parsed=finiteInteger(value,20);
  return parsed===0||parsed===10||parsed===20||parsed===30||parsed===40||parsed===60?parsed:20;
}

export function normalizeOpenArenaConfig(maxHumansValue:unknown,aiCountValue:unknown,killLimitValue:unknown=20):OpenArenaConfig{
  const maxHumans=Math.max(OPEN_ARENA_LIMITS.minHumans,Math.min(OPEN_ARENA_LIMITS.maxHumans,finiteInteger(maxHumansValue,OPEN_ARENA_LIMITS.defaultHumans)));
  const configuredAiCount=Math.max(OPEN_ARENA_LIMITS.minAi,Math.min(OPEN_ARENA_LIMITS.maxAi,finiteInteger(aiCountValue,OPEN_ARENA_LIMITS.defaultAi)));
  if(maxHumans+configuredAiCount>OPEN_ARENA_LIMITS.maxTotalCombatants){
    throw new Error(`인간과 AI를 합친 최대 전투 인원은 ${OPEN_ARENA_LIMITS.maxTotalCombatants}명입니다.`);
  }
  const spectatorOnly=maxHumans===0;
  if(spectatorOnly&&configuredAiCount===0)throw new Error('관전 전용 상시 전장에는 AI가 1명 이상 필요합니다.');
  return{maxHumans,configuredAiCount,maxTotalCombatants:OPEN_ARENA_LIMITS.maxTotalCombatants,killLimit:normalizeOpenArenaKillLimit(killLimitValue),spectatorOnly};
}
