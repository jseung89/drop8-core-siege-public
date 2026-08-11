import { PVP_QUICK_START_CONFIG, QUICK_START_CONFIG, normalizeMapId, quickStartMatchKey, type MapId, type QuickStartPreset } from '@drop8/shared';

export interface QuickStartRoom{
  roomId:string;
  roomCode:string;
  humans:number;
  maxHumans:number;
  configuredAiCount:number;
  gameMode:'battleRoyale'|'openArena'|'domination'|'coreSiege';
  matchFormat?:'solo'|'teams';
  mapSizeMode:MapId;
  phase:string;
  publicRoom:boolean;
  locked:boolean;
  spectatorOnly:boolean;
  joinInProgress:boolean;
  lifecycle:string;
  updatedAt?:number;
}

export function normalizeQuickStartMap(value:unknown):MapId{
  return normalizeMapId(value??QUICK_START_CONFIG.defaultMapId);
}

export function normalizeQuickStartPreset(value:unknown):QuickStartPreset{return value==='pvp'?'pvp':'mixed';}

export function quickStartRoomOptions(nickname:string,mapValue:unknown,presetValue:unknown='mixed'){
  const mapId=normalizeQuickStartMap(mapValue);
  const quickStartPreset=normalizeQuickStartPreset(presetValue);
  const config=quickStartPreset==='pvp'?PVP_QUICK_START_CONFIG:QUICK_START_CONFIG;
  return{
    nickname,
    password:'',
    roomPassword:'',
    publicRoom:true,
    fillAi:config.aiCount>0,
    difficulty:'normal',
    zoneSpeed:'normal',
    mapSizeMode:mapId,
    mapId,
    gameMode:'openArena',
    matchFormat:quickStartPreset==='mixed'?'teams':'solo',
    teamAiBlue:quickStartPreset==='mixed'?6:0,
    teamAiRed:quickStartPreset==='mixed'?6:0,
    maxHumans:config.maxHumans,
    aiCount:config.aiCount,
    killLimit:config.killLimit,
    quickStart:true,
    quickStartPreset,
    quickMatchKey:quickStartMatchKey(mapId,quickStartPreset),
  } as const;
}

export function rankQuickStartRooms(rooms:QuickStartRoom[],mapValue:unknown,presetValue:unknown='mixed'){
  const mapId=normalizeQuickStartMap(mapValue);
  const preset=normalizeQuickStartPreset(presetValue);
  const config=preset==='pvp'?PVP_QUICK_START_CONFIG:QUICK_START_CONFIG;
  return rooms.filter((room)=>
    room.publicRoom!==false
    &&room.gameMode==='openArena'
    &&room.matchFormat===(preset==='mixed'?'teams':'solo')
    &&room.mapSizeMode===mapId
    &&room.phase==='ACTIVE'
    &&room.lifecycle==='active'
    &&room.joinInProgress
    &&!room.spectatorOnly
    &&!room.locked
    &&room.humans<room.maxHumans
    &&(preset!=='pvp'||(room.maxHumans===config.maxHumans&&room.configuredAiCount===0))
  ).sort((a,b)=>{
    const aExact=a.maxHumans===config.maxHumans&&a.configuredAiCount===config.aiCount?1:0;
    const bExact=b.maxHumans===config.maxHumans&&b.configuredAiCount===config.aiCount?1:0;
    return bExact-aExact||b.humans-a.humans||Number(b.updatedAt??0)-Number(a.updatedAt??0);
  });
}
