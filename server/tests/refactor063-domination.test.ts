import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { DOMINATION_CONFIG, MAP_CONFIGS, dominationSitesForMap, dominationWallsForMap, normalizeDominationAiCount, normalizeGameMode } from '@drop8/shared';
import { normalizeOpenArenaConfig } from '@drop8/shared';
import { resolveRoomCreation } from '../../client/src/roomCreation.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { PlayerState } from '../src/rooms/schema.js';

function activeRoom(clock={value:10}){
  const room=new Drop8Room() as any;room.now=()=>clock.value;room.gameMode='domination';room.matchFormat='teams';room.openArenaRoundState='active';room.state.phase='ACTIVE';room.state.mapId='small';room.state.worldSize=MAP_CONFIGS.small.width;room.initializeDomination();return{room,clock};
}

function player(id:string,ai:boolean,x:number,y:number){const value=new PlayerState();value.id=id;value.name=id;value.ai=ai;value.team=ai?'red':'blue';value.alive=true;value.phase='landed';value.hp=100;value.x=x;value.y=y;return value;}

describe('Refactor 063 AI 점령전',()=>{
  it('작은 맵과 인간 4명은 고정하고 AI 수는 1~12명 사이에서 선택한다',()=>{
    expect(normalizeGameMode('domination')).toBe('domination');
    expect(normalizeDominationAiCount(undefined)).toBe(0);expect(normalizeDominationAiCount(-10)).toBe(0);
    expect(resolveRoomCreation({gameMode:'domination',participation:'play',maxHumans:8,aiCount:0,killLimit:30,mapId:'large'})).toEqual(expect.objectContaining({gameMode:'domination',mapId:'small',maxHumans:4,aiCount:0,killLimit:0,totalCombatants:4,spectatorOnly:false}));
    expect(resolveRoomCreation({gameMode:'domination',participation:'spectate',maxHumans:8,aiCount:10,killLimit:30,mapId:'large'})).toEqual(expect.objectContaining({gameMode:'domination',mapId:'small',maxHumans:4,aiCount:10,killLimit:0,totalCombatants:14,spectatorOnly:false}));
    expect(resolveRoomCreation({gameMode:'domination',participation:'play',maxHumans:4,aiCount:99,killLimit:0,mapId:'small'}).aiCount).toBe(12);
    expect(DOMINATION_CONFIG).toMatchObject({scoreToWin:240,captureSeconds:7,captureRadius:165});
  });

  it('멀리 떨어진 대각선 A/B와 네 방향 출입구가 있는 시야 비차단 방벽을 공유한다',()=>{
    const map=MAP_CONFIGS.small,sites=dominationSitesForMap(map.width,map.height),walls=dominationWallsForMap(map.width,map.height);
    expect(sites.map((site)=>site.id)).toEqual(['A','B']);expect(sites[1]!.x-sites[0]!.x).toBeCloseTo(map.width*.32);expect(sites[1]!.y-sites[0]!.y).toBeCloseTo(map.height*.4);expect(Math.hypot(sites[1]!.x-sites[0]!.x,sites[1]!.y-sites[0]!.y)).toBeGreaterThan(map.width*.5);expect(walls).toHaveLength(16);
    expect([...map.collisionObstacles,...map.propObstacles].some((obstacle)=>sites.some((site)=>site.x+165>obstacle.x&&site.x-165<obstacle.x+obstacle.w&&site.y+150>obstacle.y&&site.y-150<obstacle.y+obstacle.h))).toBe(false);
    const {room}=activeRoom();const wall=walls[0]!;expect(room.isPositionFree(wall.x+wall.w/2,wall.y+wall.h/2)).toBe(false);expect(room.firstObstacleHitT(wall.x-20,wall.y+4,wall.x+wall.w+20,wall.y+4)).not.toBeNull();expect(room.firstVisibilityObstacleHitT(wall.x-20,wall.y+4,wall.x+wall.w+20,wall.y+4)).toBeNull();
  });

  it('서버가 점령 진행과 팀 점수를 판정한다',()=>{
    const {room,clock}=activeRoom(),site=room.state.domination.sites.get('A'),human=player('human',false,site.x,site.y);room.state.players.set(human.id,human);
    room.updateDomination(DOMINATION_CONFIG.captureSeconds);expect(site.owner).toBe('blue');expect(site.captureProgress).toBe(1);
    clock.value+=DOMINATION_CONFIG.scoreTickSeconds;room.updateDomination(.1);expect(room.state.domination.humanScore).toBe(1);expect(room.state.domination.aiScore).toBe(0);
  });

  it('인간 참가자와 고정 AI 8명을 같은 팀 전장에 투입한다',()=>{
    const {room}=activeRoom(),human=player('human',false,500,2000);room.openArenaConfig=normalizeOpenArenaConfig(4,8,0);room.state.players.set(human.id,human);room.tacticalInventory(human.id);room.fillOpenArenaAi();
    expect([...room.state.players.values()].filter((candidate:any)=>candidate.ai)).toHaveLength(8);expect(room.openArenaConfig).toMatchObject({maxHumans:4,configuredAiCount:8,killLimit:0});
  });

  it('uses abundant loot and does not force AI into an empty domination slot',()=>{
    const {room}=activeRoom();room.openArenaConfig=normalizeOpenArenaConfig(4,0,0);
    expect(room.activeLootBudget()).toBe(DOMINATION_CONFIG.lootBaseBudget+DOMINATION_CONFIG.lootPerCombatant);
    room.spawnLoot();expect(room.state.loot.size).toBeGreaterThan(MAP_CONFIGS.small.lootBudget);
    room.fillOpenArenaAi();expect([...room.state.players.values()].filter((candidate:any)=>candidate.ai)).toHaveLength(0);
  });

  it('places four motorcycles, two tanks, and four tank keys for team play',()=>{
    const {room}=activeRoom();room.openArenaConfig=normalizeOpenArenaConfig(4,4,0);room.lootRandom=()=>.43;
    room.spawnLoot();room.spawnMotorcycles();
    const vehicles=[...room.state.motorcycles.values()];
    expect(vehicles.filter((vehicle:any)=>vehicle.vehicleKind==='tank')).toHaveLength(2);
    expect(vehicles.filter((vehicle:any)=>vehicle.vehicleKind==='motorcycle')).toHaveLength(4);
    expect([...room.state.loot.values()].filter((loot:any)=>loot.kind==='tank_key')).toHaveLength(4);
  });

  it('runs recurring supply drops and the altar cycle during domination',()=>{
    expect(DOMINATION_CONFIG).toMatchObject({supplyFirstDelaySeconds:45,supplyIntervalSeconds:75,maxActiveSupplyDrops:2,ritualFirstDelaySeconds:75,ritualWarningSeconds:12,ritualActiveSeconds:40});
    const supply=activeRoom(),supplyRoom=supply.room;supplyRoom.openArenaNextSupplyDropAt=supply.clock.value;supplyRoom.updateOpenArenaRecurringSupplyDrops(supply.clock.value);
    expect([...supplyRoom.state.supplyDrops.values()]).toHaveLength(1);expect([...supplyRoom.state.supplyDrops.values()][0]?.openArenaSequence).toBe(1);expect(supplyRoom.openArenaNextSupplyDropAt).toBe(supply.clock.value+DOMINATION_CONFIG.supplyIntervalSeconds);
    const ritual=activeRoom(),ritualRoom=ritual.room;expect(ritualRoom.startOpenArenaRitualWarning(ritual.clock.value)).toBe(true);expect(ritualRoom.state.werewolfSeason.altarPhase).toBe('dormant');
    ritual.clock.value+=DOMINATION_CONFIG.ritualWarningSeconds;ritualRoom.updateWerewolfSeason(.1);expect(ritualRoom.state.werewolfSeason.altarPhase).toBe('active');expect(ritualRoom.openArenaRitualActiveEndsAt).toBe(ritual.clock.value+DOMINATION_CONFIG.ritualActiveSeconds);
  });

  it('서버도 클라이언트가 고른 점령전 AI 수를 권위적으로 검증한다',async()=>{
    const room=new Drop8Room() as any;room.presence={get:vi.fn(async()=>undefined),setex:vi.fn(async()=>undefined)};room.setSimulationInterval=vi.fn();room.onMessage=vi.fn();room.syncRoomRegistry=vi.fn();
    await room.onCreate({gameMode:'domination',maxHumans:4,aiCount:10,mapId:'large'});
    expect(room.state.mapId).toBe('small');expect(room.openArenaConfig).toMatchObject({maxHumans:4,configuredAiCount:10,killLimit:0});
  });

  it('같은 팀 피해를 차단하고 상대 팀 피해만 적용한다',()=>{
    const {room}=activeRoom(),site=room.state.domination.sites.get('A'),human=player('human',false,site.x,site.y),ally=player('ally',false,site.x+40,site.y),enemy=player('enemy',true,site.x+80,site.y);room.state.players.set(human.id,human);room.state.players.set(ally.id,ally);room.state.players.set(enemy.id,enemy);
    room.damage(ally,25,human.id,'총기',0,undefined,'bullet');expect(ally.hp).toBe(100);room.damage(enemy,25,human.id,'총기',0,undefined,'bullet');expect(enemy.hp).toBe(75);
  });
});

const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
const main=readFileSync(fileURLToPath(new URL('../../client/src/main.ts',import.meta.url)),'utf8');
const style=readFileSync(fileURLToPath(new URL('../../client/src/style.css',import.meta.url)),'utf8');
describe('Refactor 063 점령전 클라이언트 표시',()=>{
  it('월드·미니맵·HUD에 대각선 점령지와 선택한 AI 수를 표시한다',()=>{expect(scene).toContain('dominationWallsForMap');expect(scene).toContain('drawDominationLetter');expect(main).toContain('작은 맵 대각선 A/B 점령');expect(main).toContain('net.roomConfig.configuredAiCount');expect(main).toContain('renderDominationHud');expect(main).toContain('A/B 240점');});
  it('로비는 단일 컨테이너로 스크롤되고 실제 게임 화면만 고정한다',()=>{
    expect(style).toContain('body:not(.game-active) #app{height:100%;min-height:0;overflow-x:hidden;overflow-y:auto');
    expect(style).toContain('.touch-ui:not(.game-running) #app{height:100%;min-height:0;overflow-x:hidden;overflow-y:auto');
    expect(style).toContain('body.game-active{position:fixed');
  });
});
