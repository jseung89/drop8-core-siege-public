// DROP8_REFACTOR_054_ROOM_CREATION_MODE_MAP
import { CORE_SIEGE_CONFIG, DOMINATION_CONFIG, OPEN_ARENA_LIMITS, normalizeCoreSiegeHumans, normalizeDominationAiCount, normalizeGameMode, normalizeMapId, normalizeOpenArenaKillLimit, type GameMode, type MapId, type OpenArenaKillLimit } from '@drop8/shared';

export type ArenaParticipation='play'|'spectate';

export interface RoomCreationInput{
  gameMode:unknown;
  participation:unknown;
  maxHumans:unknown;
  aiCount:unknown;
  killLimit:unknown;
  mapId:unknown;
}

export interface RoomCreationSelection{
  gameMode:GameMode;
  participation:ArenaParticipation;
  maxHumans:number;
  aiCount:number;
  killLimit:OpenArenaKillLimit;
  mapId:MapId;
  spectatorOnly:boolean;
  totalCombatants:number;
}

function integer(value:unknown,fallback:number){const parsed=Number(value);return Number.isFinite(parsed)?Math.trunc(parsed):fallback;}

export function playableArenaAiLimit(maxHumansValue:unknown){
  const humans=Math.max(1,Math.min(OPEN_ARENA_LIMITS.maxHumans,integer(maxHumansValue,OPEN_ARENA_LIMITS.defaultHumans)));
  return OPEN_ARENA_LIMITS.maxTotalCombatants-humans;
}

export function resolveRoomCreation(input:RoomCreationInput):RoomCreationSelection{
  const gameMode=normalizeGameMode(input.gameMode),mapId=normalizeMapId(input.mapId),killLimit=normalizeOpenArenaKillLimit(input.killLimit);
  if(gameMode==='battleRoyale')return{gameMode,participation:'play',maxHumans:OPEN_ARENA_LIMITS.defaultHumans,aiCount:0,killLimit,mapId,spectatorOnly:false,totalCombatants:OPEN_ARENA_LIMITS.defaultHumans};
  if(gameMode==='domination'){const aiCount=normalizeDominationAiCount(input.aiCount);return{gameMode,participation:'play',maxHumans:DOMINATION_CONFIG.maxHumans,aiCount,killLimit:0,mapId:DOMINATION_CONFIG.mapId,spectatorOnly:false,totalCombatants:DOMINATION_CONFIG.maxHumans+aiCount};}
  if(gameMode==='coreSiege'){const maxHumans=normalizeCoreSiegeHumans(input.maxHumans),aiCount=Math.max(0,Math.min(OPEN_ARENA_LIMITS.maxAi,integer(input.aiCount,CORE_SIEGE_CONFIG.defaultAiPerTeam*2)));return{gameMode,participation:'play',maxHumans,aiCount,killLimit:0,mapId:CORE_SIEGE_CONFIG.mapId,spectatorOnly:false,totalCombatants:maxHumans+aiCount};}
  const participation:ArenaParticipation=input.participation==='spectate'?'spectate':'play';
  if(participation==='spectate')return{gameMode,participation,maxHumans:0,aiCount:OPEN_ARENA_LIMITS.maxAi,killLimit,mapId,spectatorOnly:true,totalCombatants:OPEN_ARENA_LIMITS.maxAi};
  const maxHumans=Math.max(1,Math.min(OPEN_ARENA_LIMITS.maxHumans,integer(input.maxHumans,OPEN_ARENA_LIMITS.defaultHumans))),aiCount=Math.max(OPEN_ARENA_LIMITS.minAi,Math.min(playableArenaAiLimit(maxHumans),integer(input.aiCount,OPEN_ARENA_LIMITS.defaultAi)));
  return{gameMode,participation,maxHumans,aiCount,killLimit,mapId,spectatorOnly:false,totalCombatants:maxHumans+aiCount};
}
