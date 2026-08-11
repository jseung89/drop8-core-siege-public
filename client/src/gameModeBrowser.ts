import type { GameMode, MapId } from '@drop8/shared';

export interface GameModeChoice{
  id:GameMode;
  name:string;
  tag:string;
  summary:string;
  mapId:MapId;
  maxHumans:number;
  aiCount:number;
  killLimit:number;
  matchFormat:'solo'|'teams';
  teamAiBlue:number;
  teamAiRed:number;
}

export const GAME_MODE_CHOICES:readonly GameModeChoice[]=[
  {id:'battleRoyale',name:'배틀로얄',tag:'생존',summary:'낙하 · 파밍 · 자기장',mapId:'small',maxHumans:8,aiCount:0,killLimit:0,matchFormat:'solo',teamAiBlue:0,teamAiRed:0},
  {id:'openArena',name:'상시 전장',tag:'난전',summary:'리스폰 · 자유 전투 · 킬 경쟁',mapId:'large',maxHumans:8,aiCount:7,killLimit:20,matchFormat:'solo',teamAiBlue:0,teamAiRed:0},
  {id:'domination',name:'점령전',tag:'거점',summary:'A/B 점령 · 팀전 · 240점',mapId:'small',maxHumans:4,aiCount:0,killLimit:0,matchFormat:'teams',teamAiBlue:0,teamAiRed:0},
  {id:'coreSiege',name:'코어 공성전',tag:'공성',summary:'영웅 · 스킬 · 타워 돌파',mapId:'coreSiege',maxHumans:6,aiCount:4,killLimit:0,matchFormat:'teams',teamAiBlue:2,teamAiRed:2},
] as const;

export function gameModeChoice(value:unknown){return GAME_MODE_CHOICES.find((mode)=>mode.id===value)??GAME_MODE_CHOICES[0]!;}

export function roomsForGameMode<T extends {gameMode:string}>(rooms:readonly T[],mode:GameMode|null){
  return mode?rooms.filter((room)=>room.gameMode===mode):[];
}
