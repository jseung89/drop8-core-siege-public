import type { CombatTeam } from './gameModes.js';

export type CoreSiegeHeroId=
  |'vanguard'
  |'technician'
  |'trapper'
  |'trickster'
  |'medigel'
  |'fireEngineer'
  |'orbitalSniper'
  |'wolfWarrior'
  |'shieldCaptain'
  |'demolitionist'
  |'steelPilot'
  |'empPilot'
  |'ironCyclone'
  |'scrapSummoner'
  |'gravityWarden'
  |'smokeTracker'
  |'sonicCommander'
  |'earthHammer'
  |'chainExecutioner'
  |'twinBlade'
  |'burstTrooper'
  |'phaseMarksman'
  |'opticArtillerist'
  |'impactDriller'
  |'spotterGunner'
  |'jetstreamBlade'
  |'blackoutAssassin';
export type CoreSiegeStructureKind='core'|'outerTower'|'innerTower';
export type CoreSiegeMinionKind='melee'|'ranged'|'siege';
export type CoreSiegeUpgradeKind='power'|'guard'|'haste';
export type CoreSiegePickupKind='supply'|'healing';
export type CoreSiegeAbilitySlot=1|2|3;

export interface CoreSiegeHeroDefinition{
  id:CoreSiegeHeroId;
  name:string;
  role:string;
  primaryWeapon:string;
  secondaryWeapon:string;
  abilityIcons:readonly[string,string,string];
  abilityNames:readonly[string,string,string];
  abilityDescriptions:readonly[string,string,string];
  abilityGrowthDescriptions:readonly[string,string,string];
  cooldowns:readonly[number,number,number];
}

export interface CoreSiegeBasicAttackProfile{
  weaponId:string;
  displayName?:string;
  damage:number;
  magazine:number;
  fireInterval:number;
  reloadSeconds:number;
  spread:number;
  pellets:number;
  structureDamageMultiplier:number;
  heatPerShot?:number;
  coolPerSecond?:number;
  projectileRadiusMultiplier?:number;
}

export interface CoreSiegePositioningProfile{
  name:string;
  icon:string;
  description:string;
  kind:'move'|'scope';
  distance:number;
  cooldown:number;
  direction:'forward'|'backward';
  style:string;
}

export interface CoreSiegeStructureLayout{
  id:string;
  team:Exclude<CombatTeam,'none'>;
  kind:CoreSiegeStructureKind;
  order:number;
  x:number;
  y:number;
  radius:number;
  hp:number;
}

export interface CoreSiegePickupLayout{
  id:string;
  kind:CoreSiegePickupKind;
  x:number;
  y:number;
  radius:number;
  respawnSeconds:number;
}

export const CORE_SIEGE_CONFIG={
  mapId:'coreSiege',
  worldWidth:4600,
  worldHeight:1800,
  humanOptions:[4,6,8] as const,
  defaultHumans:6,
  defaultAiPerTeam:0,
  respawnMinSeconds:5,
  respawnMaxSeconds:12,
  roundSeconds:780,
  startLevel:3,
  startXp:240,
  laneYRatio:.5,
  laneHalfWidth:270,
  sideLaneOffset:430,
  waveIntervalSeconds:18,
  firstWaveDelaySeconds:5,
  meleePerWave:3,
  rangedPerWave:2,
  siegeEveryWaves:3,
  minionMoveSpeed:102,
  towerRange:590,
  towerFireIntervalSeconds:1.15,
  towerPlayerDamage:23,
  towerMinionDamage:46,
  coreDefenseRange:650,
  coreDefenseFireIntervalSeconds:1.35,
  coreDefensePlayerDamage:26,
  coreDefenseMinionDamage:52,
  heroDamageTakenMultiplier:.6,
  backdoorDamageMultiplier:.16,
  minionProtectionRadius:285,
  maxUpgradeStacks:3,
  powerDamagePerStack:.06,
  hasteCooldownReductionPerStack:.06,
  guardArmorPerStack:20,
  upgradeLifetimeSeconds:35,
  campRespawnSeconds:42,
  campXp:90,
  supplyRespawnSeconds:24,
  healingRespawnSeconds:18,
  supplyXp:65,
  healingAmount:32,
  grenadeRange:620,
  grenadeAimAssistRadius:175,
  grenadeTelegraphSeconds:.7,
  largeAreaTelegraphSeconds:.8,
  grenadeRadius:245,
  grenadeMaxDamage:72,
  grenadeMinDamage:22,
  maxLevel:10,
  basicDamagePerLevel:.02,
  sharedXpRadius:860,
  minionXp:{melee:27,ranged:23,siege:52},
  heroXp:145,
  structureXp:210,
  skillDamagePerRank:.15,
  skillCooldownReductionPerRank:.05,
  abilityCooldownMultiplier:.88,
  trapPlayerDamage:20,
  trapPlayerStunSeconds:1.15,
  medicalGelMax:100,
  medicalGelRechargePerSecond:18,
  medicalGelHealPerSecond:11,
  medicalGelDamagePerSecond:50,
  medicalGelSustainFalloff:.72,
  robotRedDurationSeconds:14,
  robotEmpDurationSeconds:13,
  robotMaxHp:420,
  robotDestroyedPilotHp:25,
  areaHeroDamageMultiplier:.5,
  areaRepeatWindowSeconds:2.5,
  areaRepeatDamageMultipliers:[1,.55,.25] as const,
  persistentDamageIntervalSeconds:.45,
  meleeContactShield:15,
  meleeContactShieldSeconds:2.4,
  meleeContactShieldCooldownSeconds:3,
  crowdControlWindowSeconds:4,
  crowdControlMultipliers:[1,.65,.35] as const,
  crowdControlRecoverySeconds:.8,
  maxSlowRatio:.4,
  maxKnockback:160,
  piercingBeamHeroDamage:78,
  piercingBeamRailgunMultiplier:1.1,
  piercingBeamFalloff:.9,
  carpetBombingPower:.9,
  carpetBombingHeroDamageMultiplier:.85,
  carpetBombingRadiusMultiplier:.82,
  aiFormationSpacing:105,
  aiHazardMargin:60,
  aiUltimateTeamLockSeconds:2.4,
  meleeChaseMoveMultiplier:1.08,
  meleeChaseSeconds:1,
  meleeSlowResistance:.25,
  wolfMoveMultiplier:1.2,
  wolfTransformedMoveMultiplier:1.32,
  shieldMoveMultiplier:1.14,
  ironMoveMultiplier:1.22,
  ironSpinMoveMultiplier:1.38,
  ironRampageMoveMultiplier:1.3,
  ironMaxMoveMultiplier:1.62,
  ironSpinSlowResistance:.5,
  ironDamageTakenMultiplier:.78,
  earthMoveMultiplier:1.12,
  earthSlowResistance:.35,
  earthDamageTakenMultiplier:.83,
  chainMoveMultiplier:1.18,
  chainDamageTakenMultiplier:.88,
  bladeMoveMultiplier:1.3,
  bladeDamageTakenMultiplier:1.11,
  summonPerHeroLimit:4,
  summonPerTeamLimit:8,
} as const;

export const CORE_SIEGE_HERO_MAX_HP:Record<CoreSiegeHeroId,number>={
  vanguard:120,
  technician:125,
  trapper:125,
  trickster:120,
  medigel:125,
  fireEngineer:125,
  orbitalSniper:110,
  wolfWarrior:140,
  shieldCaptain:160,
  demolitionist:120,
  steelPilot:120,
  empPilot:120,
  ironCyclone:150,
  scrapSummoner:125,
  gravityWarden:125,
  smokeTracker:110,
  sonicCommander:125,
  earthHammer:190,
  chainExecutioner:145,
  twinBlade:115,
  burstTrooper:120,
  phaseMarksman:115,
  opticArtillerist:115,
  impactDriller:135,
  spotterGunner:110,
  jetstreamBlade:125,
  blackoutAssassin:140,
};

export const CORE_SIEGE_POSITIONING:Record<CoreSiegeHeroId,CoreSiegePositioningProfile>={
  vanguard:{name:'전술 구르기',icon:'RMB',description:'조준 방향으로 빠르게 굴러 사격 위치를 바꿉니다.',kind:'move',distance:190,cooldown:7,direction:'forward',style:'combatRoll'},
  technician:{name:'추진 부츠',icon:'RMB',description:'추진기로 조준 방향을 향해 짧게 미끄러집니다.',kind:'move',distance:180,cooldown:7.5,direction:'forward',style:'techSlide'},
  trapper:{name:'사냥꾼 도약',icon:'RMB',description:'시선을 유지한 채 조준 반대 방향으로 뛰어납니다.',kind:'move',distance:185,cooldown:7,direction:'backward',style:'hunterHop'},
  trickster:{name:'꼬꼬 뜀박질',icon:'RMB',description:'조준 방향으로 재빠르게 튀어 오릅니다.',kind:'move',distance:205,cooldown:6.5,direction:'forward',style:'chickenHop'},
  medigel:{name:'구조 슬라이드',icon:'RMB',description:'조준 방향으로 미끄러져 아군에게 접근합니다.',kind:'move',distance:190,cooldown:7,direction:'forward',style:'rescueSlide'},
  fireEngineer:{name:'역분사',icon:'RMB',description:'화염 반동으로 조준 반대 방향으로 물러납니다.',kind:'move',distance:175,cooldown:7.5,direction:'backward',style:'flameRecoil'},
  orbitalSniper:{name:'정밀 스코프',icon:'RMB',description:'누르는 동안 시야를 확대하고 정밀 조준합니다.',kind:'scope',distance:0,cooldown:0,direction:'forward',style:'scope'},
  wolfWarrior:{name:'피의 추격',icon:'RMB',description:'조준 방향으로 사냥 질주합니다. 변신 중 더 멀리 이동합니다.',kind:'move',distance:210,cooldown:7,direction:'forward',style:'bloodChase'},
  shieldCaptain:{name:'방패 전진',icon:'RMB',description:'방패를 앞세워 조준 방향으로 짧게 전진합니다.',kind:'move',distance:160,cooldown:8,direction:'forward',style:'shieldAdvance'},
  demolitionist:{name:'폭발 도약',icon:'RMB',description:'발밑 반동으로 조준 반대 방향으로 뛰어납니다.',kind:'move',distance:195,cooldown:8,direction:'backward',style:'blastHop'},
  steelPilot:{name:'기계 추진',icon:'RMB',description:'보조 추진기로 조준 방향을 향해 돌진합니다.',kind:'move',distance:205,cooldown:7.5,direction:'forward',style:'steelBoost'},
  empPilot:{name:'전자 도약',icon:'RMB',description:'전기 잔상을 남기며 조준 방향으로 이동합니다.',kind:'move',distance:195,cooldown:7.5,direction:'forward',style:'empBlink'},
  ironCyclone:{name:'회전 발걸음',icon:'RMB',description:'대검의 회전력을 이용해 조준 방향으로 파고듭니다.',kind:'move',distance:170,cooldown:7,direction:'forward',style:'ironStep'},
  scrapSummoner:{name:'톱니 견인',icon:'RMB',description:'톱니 와이어에 끌려 조준 방향으로 이동합니다.',kind:'move',distance:180,cooldown:8,direction:'forward',style:'scrapTow'},
  gravityWarden:{name:'중력 도약',icon:'RMB',description:'중력을 낮춰 조준 방향으로 부드럽게 이동합니다.',kind:'move',distance:205,cooldown:8,direction:'forward',style:'gravityDrift'},
  smokeTracker:{name:'그림자 구르기',icon:'RMB',description:'낮은 자세로 빠르게 굴러 측면을 잡습니다.',kind:'move',distance:230,cooldown:6,direction:'forward',style:'shadowRoll'},
  sonicCommander:{name:'반동 박자',icon:'RMB',description:'음파 반동으로 조준 반대 방향으로 이동합니다.',kind:'move',distance:180,cooldown:7,direction:'backward',style:'sonicRecoil'},
  earthHammer:{name:'지면 돌진',icon:'RMB',description:'망치를 끌며 조준 방향으로 묵직하게 전진합니다.',kind:'move',distance:155,cooldown:8.5,direction:'forward',style:'hammerRush'},
  chainExecutioner:{name:'사슬 접근',icon:'RMB',description:'사슬을 당겨 조준 방향으로 빠르게 접근합니다.',kind:'move',distance:190,cooldown:7.5,direction:'forward',style:'chainApproach'},
  twinBlade:{name:'측면 질주',icon:'RMB',description:'쌍검을 낮추고 조준 방향으로 빠르게 질주합니다.',kind:'move',distance:235,cooldown:5.5,direction:'forward',style:'bladeSidestep'},
  burstTrooper:{name:'전투 슬라이드',icon:'RMB',description:'사격 방향을 유지하며 빠르게 미끄러집니다.',kind:'move',distance:220,cooldown:7,direction:'forward',style:'burstSlide'},
  phaseMarksman:{name:'위상 미끄럼',icon:'RMB',description:'짧은 위상 추진으로 조준 방향을 재배치합니다.',kind:'move',distance:170,cooldown:9,direction:'forward',style:'phaseSlide'},
  opticArtillerist:{name:'프리즘 반동',icon:'RMB',description:'광학 반동으로 조준 반대 방향으로 물러납니다.',kind:'move',distance:175,cooldown:8,direction:'backward',style:'prismRecoil'},
  impactDriller:{name:'굴착 스텝',icon:'RMB',description:'착암 장비로 조준 방향을 짧게 파고듭니다.',kind:'move',distance:150,cooldown:8,direction:'forward',style:'drillStep'},
  spotterGunner:{name:'정밀 스코프',icon:'RMB',description:'누르는 동안 관측총 시야를 확대합니다.',kind:'scope',distance:0,cooldown:0,direction:'forward',style:'scope'},
  jetstreamBlade:{name:'기류 발걸음',icon:'RMB',description:'압축 기류를 타고 조준 방향으로 이동합니다.',kind:'move',distance:155,cooldown:8,direction:'forward',style:'jetStep'},
  blackoutAssassin:{name:'정전 질주',icon:'RMB',description:'센서 잔상을 남기며 조준 방향으로 질주합니다.',kind:'move',distance:190,cooldown:9,direction:'forward',style:'blackoutRush'},
};

export const CORE_SIEGE_MELEE_HERO_IDS=[
  'wolfWarrior','shieldCaptain','ironCyclone','earthHammer','chainExecutioner','twinBlade','impactDriller','jetstreamBlade','blackoutAssassin',
] as const satisfies readonly CoreSiegeHeroId[];

export function isCoreSiegeMeleeHero(heroId:unknown):heroId is typeof CORE_SIEGE_MELEE_HERO_IDS[number]{
  return CORE_SIEGE_MELEE_HERO_IDS.includes(heroId as typeof CORE_SIEGE_MELEE_HERO_IDS[number]);
}

export function coreSiegeHeroMoveMultiplier(heroId:CoreSiegeHeroId,transformed=false,spinning=false,rampaging=false){
  if(heroId==='wolfWarrior')return transformed?CORE_SIEGE_CONFIG.wolfTransformedMoveMultiplier:CORE_SIEGE_CONFIG.wolfMoveMultiplier;
  if(heroId==='shieldCaptain')return CORE_SIEGE_CONFIG.shieldMoveMultiplier;
  if(heroId==='ironCyclone')return spinning?CORE_SIEGE_CONFIG.ironSpinMoveMultiplier:rampaging?CORE_SIEGE_CONFIG.ironRampageMoveMultiplier:CORE_SIEGE_CONFIG.ironMoveMultiplier;
  if(heroId==='earthHammer')return CORE_SIEGE_CONFIG.earthMoveMultiplier;
  if(heroId==='chainExecutioner')return CORE_SIEGE_CONFIG.chainMoveMultiplier;
  if(heroId==='twinBlade')return CORE_SIEGE_CONFIG.bladeMoveMultiplier;
  if(heroId==='impactDriller')return 1.15;
  if(heroId==='jetstreamBlade')return 1.24;
  if(heroId==='blackoutAssassin')return 1.16;
  return 1;
}

export function coreSiegeHeroSlowResistance(heroId:CoreSiegeHeroId,spinning=false){
  if(heroId==='ironCyclone'&&spinning)return CORE_SIEGE_CONFIG.ironSpinSlowResistance;
  if(heroId==='earthHammer')return CORE_SIEGE_CONFIG.earthSlowResistance;
  return isCoreSiegeMeleeHero(heroId)?CORE_SIEGE_CONFIG.meleeSlowResistance:0;
}

export function coreSiegeHeroMaxHp(heroId:CoreSiegeHeroId){
  return CORE_SIEGE_HERO_MAX_HP[heroId];
}

export function coreSiegeAreaRepeatMultiplier(hitCount:number){
  const index=Math.max(0,Math.min(CORE_SIEGE_CONFIG.areaRepeatDamageMultipliers.length-1,Math.trunc(hitCount)));
  return CORE_SIEGE_CONFIG.areaRepeatDamageMultipliers[index]!;
}

export function coreSiegeSmokeTrackerConcealed(
  target:{id:string;team?:string;heroId?:string;x:number;y:number},
  viewer:{team?:string},
  fields:readonly {ownerId?:string;x:number;y:number;radius:number;expiresAt?:number}[],
  nowSeconds=Date.now()/1000,
){
  if(target.heroId!=='smokeTracker'||target.team===viewer.team)return false;
  return fields.some((field)=>field.ownerId===target.id&&(!field.expiresAt||nowSeconds<field.expiresAt)&&field.radius>0&&Math.hypot(target.x-field.x,target.y-field.y)<=field.radius);
}

export function coreSiegeCrowdControlMultiplier(hitCount:number){
  const index=Math.max(0,Math.min(CORE_SIEGE_CONFIG.crowdControlMultipliers.length-1,Math.trunc(hitCount)));
  return CORE_SIEGE_CONFIG.crowdControlMultipliers[index]!;
}

export function coreSiegeSustainedDps(heroId:CoreSiegeHeroId){
  const profile=CORE_SIEGE_BASIC_ATTACKS[heroId],damage=profile.damage*profile.pellets;
  if(profile.reloadSeconds<=0)return damage/profile.fireInterval;
  return damage*profile.magazine/(profile.magazine*profile.fireInterval+profile.reloadSeconds);
}

export const CORE_SIEGE_BASIC_ATTACKS:Record<CoreSiegeHeroId,CoreSiegeBasicAttackProfile>={
  vanguard:{weaponId:'rifle',damage:16,magazine:28,fireInterval:.13,reloadSeconds:1.7,spread:.038,pellets:1,structureDamageMultiplier:.72},
  technician:{weaponId:'smg',damage:10,magazine:34,fireInterval:.085,reloadSeconds:1.55,spread:.075,pellets:1,structureDamageMultiplier:.6},
  trapper:{weaponId:'shotgun',damage:10,magazine:6,fireInterval:.7,reloadSeconds:1.9,spread:.18,pellets:8,structureDamageMultiplier:.56},
  trickster:{weaponId:'boomerang',damage:38,magazine:1,fireInterval:.72,reloadSeconds:0,spread:.008,pellets:1,structureDamageMultiplier:.58},
  medigel:{weaponId:'adhesive_sprayer',damage:5,magazine:100,fireInterval:.1,reloadSeconds:0,spread:.025,pellets:1,structureDamageMultiplier:.18},
  fireEngineer:{weaponId:'flamethrower',damage:8,magazine:100,fireInterval:.1,reloadSeconds:2.8,spread:0,pellets:1,structureDamageMultiplier:.42},
  orbitalSniper:{weaponId:'sniper',damage:58,magazine:4,fireInterval:1.15,reloadSeconds:2.5,spread:.006,pellets:1,structureDamageMultiplier:.74},
  wolfWarrior:{weaponId:'silver_crossbow',damage:12,magazine:5,fireInterval:.42,reloadSeconds:1.3,spread:.13,pellets:5,structureDamageMultiplier:.62},
  shieldCaptain:{weaponId:'pistol',damage:20,magazine:14,fireInterval:.27,reloadSeconds:1.25,spread:.022,pellets:1,structureDamageMultiplier:.65},
  demolitionist:{weaponId:'bazooka',damage:58,magazine:2,fireInterval:1.25,reloadSeconds:1.8,spread:.012,pellets:1,structureDamageMultiplier:.82},
  steelPilot:{weaponId:'smg',damage:11,magazine:36,fireInterval:.09,reloadSeconds:1.5,spread:.065,pellets:1,structureDamageMultiplier:.64,heatPerShot:4,coolPerSecond:28},
  empPilot:{weaponId:'pistol',damage:19,magazine:15,fireInterval:.25,reloadSeconds:1.3,spread:.02,pellets:1,structureDamageMultiplier:.58,heatPerShot:5,coolPerSecond:30},
  ironCyclone:{weaponId:'fists',displayName:'양손 대검',damage:34,magazine:1,fireInterval:.48,reloadSeconds:0,spread:0,pellets:1,structureDamageMultiplier:.35},
  scrapSummoner:{weaponId:'pistol',damage:19,magazine:18,fireInterval:.26,reloadSeconds:1.3,spread:.025,pellets:1,structureDamageMultiplier:.48},
  gravityWarden:{weaponId:'railgun',damage:28,magazine:8,fireInterval:.38,reloadSeconds:1.8,spread:.01,pellets:1,structureDamageMultiplier:.46},
  smokeTracker:{weaponId:'smg',damage:9,magazine:27,fireInterval:.36,reloadSeconds:1.5,spread:.07,pellets:3,structureDamageMultiplier:.5},
  sonicCommander:{weaponId:'shotgun',damage:6,magazine:20,fireInterval:.42,reloadSeconds:1.6,spread:.14,pellets:5,structureDamageMultiplier:.34,projectileRadiusMultiplier:1.6},
  earthHammer:{weaponId:'fists',displayName:'대지 망치',damage:38,magazine:1,fireInterval:.62,reloadSeconds:0,spread:0,pellets:1,structureDamageMultiplier:.46},
  chainExecutioner:{weaponId:'fists',displayName:'사슬낫',damage:32,magazine:1,fireInterval:.5,reloadSeconds:0,spread:0,pellets:1,structureDamageMultiplier:.38},
  twinBlade:{weaponId:'fists',displayName:'쌍검',damage:26,magazine:1,fireInterval:.29,reloadSeconds:0,spread:0,pellets:1,structureDamageMultiplier:.3},
  burstTrooper:{weaponId:'smg',displayName:'쌍열 기관단총',damage:13,magazine:24,fireInterval:.115,reloadSeconds:1.35,spread:.055,pellets:1,structureDamageMultiplier:.6},
  phaseMarksman:{weaponId:'railgun',displayName:'위상 사격기',damage:26,magazine:10,fireInterval:.26,reloadSeconds:1.35,spread:.012,pellets:1,structureDamageMultiplier:.52},
  opticArtillerist:{weaponId:'laser_cannon',displayName:'집속 광학포',damage:29,magazine:10,fireInterval:.34,reloadSeconds:1.8,spread:.01,pellets:1,structureDamageMultiplier:.5},
  impactDriller:{weaponId:'fists',displayName:'착암 건틀릿',damage:27,magazine:1,fireInterval:.46,reloadSeconds:0,spread:0,pellets:1,structureDamageMultiplier:.42},
  spotterGunner:{weaponId:'sniper',displayName:'대물 관측총',damage:52,magazine:4,fireInterval:1,reloadSeconds:2.2,spread:.004,pellets:1,structureDamageMultiplier:.78},
  jetstreamBlade:{weaponId:'fists',displayName:'고압 절단날',damage:21,magazine:1,fireInterval:.36,reloadSeconds:0,spread:0,pellets:1,structureDamageMultiplier:.38},
  blackoutAssassin:{weaponId:'fists',displayName:'전류 절단기',damage:30,magazine:1,fireInterval:.5,reloadSeconds:0,spread:0,pellets:1,structureDamageMultiplier:.4},
};

export const CORE_SIEGE_HEROES:Record<CoreSiegeHeroId,CoreSiegeHeroDefinition>={
  vanguard:{
    id:'vanguard',name:'강습병',role:'돌파와 광역 화력',primaryWeapon:'rifle',secondaryWeapon:'pistol',
    abilityIcons:['✦','ϟ','━'],
    abilityNames:['파편탄','테이저 산탄','충전 관통포'],
    abilityDescriptions:['지정 지점에 예고 후 폭발하는 파편탄을 발사합니다.','넓게 퍼지는 전기탄으로 적의 움직임을 끊습니다.','직선상의 여러 적과 미니언을 관통합니다.'],
    abilityGrowthDescriptions:['피해와 폭발 범위 증가','피해 증가와 재사용 대기시간 감소','관통 피해 증가와 재사용 대기시간 감소'],cooldowns:[9,13,38],
  },
  technician:{
    id:'technician',name:'제어 기술병',role:'지역 제어와 드론',primaryWeapon:'smg',secondaryWeapon:'pistol',
    abilityIcons:['⌁','◎','◇'],
    abilityNames:['점착 지대','EMP 파동','드론 편대'],
    abilityDescriptions:['감속과 지속 피해를 주는 점착 지대를 만듭니다.','주변 적과 기계 장비를 일시 정지시킵니다.','호위 드론 편대를 유도탄으로 출격시킵니다.'],
    abilityGrowthDescriptions:['피해와 장판 범위 증가','피해와 EMP 범위 증가','출격 드론 수 증가'],cooldowns:[10,15,40],
  },
  trapper:{
    id:'trapper',name:'함정 사냥꾼',role:'매복과 진입 차단',primaryWeapon:'shotgun',secondaryWeapon:'pistol',
    abilityIcons:['◉','╫','▱'],
    abilityNames:['스파이더 마인','감전 저지선','폭탄 RC 편대'],
    abilityDescriptions:['접근한 적을 추적하는 스파이더 마인을 설치합니다.','좁은 길목에 감전 저지선을 설치합니다.','폭탄 RC카 여러 대를 조준 방향으로 보냅니다.'],
    abilityGrowthDescriptions:['고랭크에서 마인 2개 설치','고랭크에서 저지선 2개 설치','RC카 수와 폭발 압박 증가'],cooldowns:[8,11,36],
  },
  trickster:{
    id:'trickster',name:'꼬꼬 장난꾼',role:'연쇄 공격과 교란',primaryWeapon:'boomerang',secondaryWeapon:'pistol',
    abilityIcons:['•','↻','≋'],
    abilityNames:['꼬꼬 직격','연쇄 부메랑','꼬꼬 탄막'],
    abilityDescriptions:['빠른 꼬꼬 탄환으로 조준 방향의 적을 견제합니다.','여러 적 사이를 튕긴 뒤 돌아오는 부메랑을 던집니다.','넓은 부채꼴로 꼬꼬 탄막을 발사합니다.'],
    abilityGrowthDescriptions:['직격 피해 증가','연쇄 피해 증가와 재사용 대기시간 감소','탄환 수와 탄막 피해 증가'],cooldowns:[8,7,34],
  },
  medigel:{
    id:'medigel',name:'메디젤 요원',role:'지속 치료와 전선 유지',primaryWeapon:'adhesive_sprayer',secondaryWeapon:'pistol',
    abilityIcons:['+','▰','✚'],
    abilityNames:['응급 젤 캡슐','재생 폼 장벽','생명 유지 장치'],
    abilityDescriptions:['아군을 즉시 치료하고 상태 이상 하나를 제거합니다.','아군에게 보호막을 주고 적을 감속하는 폼 장벽을 만듭니다.','파괴 가능한 장치가 범위 아군을 치료하고 치명상을 한 번 막습니다.'],
    abilityGrowthDescriptions:['즉시 회복량 증가','보호막과 지속시간 증가','회복량과 장치 내구도 증가'],cooldowns:[10,16,44],
  },
  fireEngineer:{
    id:'fireEngineer',name:'화염 공병',role:'근거리 지역 봉쇄',primaryWeapon:'flamethrower',secondaryWeapon:'pistol',
    abilityIcons:['▲','▥','◌'],
    abilityNames:['소이 캡슐','화염 장벽','과열 폭풍'],
    abilityDescriptions:['지정 지역을 불태우는 소이 캡슐을 투척합니다.','적의 진입을 막는 긴 화염 장벽을 펼칩니다.','주변을 회전하며 강한 화염을 연속 분사합니다.'],
    abilityGrowthDescriptions:['지속 피해 증가','장벽 폭과 지속시간 증가','회전 수와 피해 증가'],cooldowns:[9,14,39],
  },
  orbitalSniper:{
    id:'orbitalSniper',name:'궤도 저격수',role:'장거리 처형과 관통',primaryWeapon:'sniper',secondaryWeapon:'pistol',
    abilityIcons:['⌖','◈','━'],
    abilityNames:['표식탄','궤도 조준','관통 레일건'],
    abilityDescriptions:['적을 표식해 아군의 후속 공격을 돕습니다.','짧게 집중해 다음 기본 공격의 명중을 보정합니다.','긴 직선의 적들을 관통하는 레일건을 발사합니다.'],
    abilityGrowthDescriptions:['표식 지속시간 증가','집중 시간 감소','관통 피해 증가'],cooldowns:[8,12,40],
  },
  wolfWarrior:{
    id:'wolfWarrior',name:'늑대 전사',role:'추격과 근접 돌파',primaryWeapon:'silver_crossbow',secondaryWeapon:'pistol',
    abilityIcons:['↗',')))','◢'],
    abilityNames:['은빛 도약','사냥의 울음','늑대인간 변신'],
    abilityDescriptions:['조준 방향으로 도약하며 적을 베어냅니다.','주변 적을 드러내고 이동 속도를 얻습니다.','늑대인간으로 변신해 근접 전투력을 크게 높입니다.'],
    abilityGrowthDescriptions:['도약 피해 증가','효과 범위와 지속시간 증가','변신 지속시간 증가'],cooldowns:[8,14,42],
  },
  shieldCaptain:{
    id:'shieldCaptain',name:'방패 대장',role:'전방 보호와 밀어내기',primaryWeapon:'pistol',secondaryWeapon:'pistol',
    abilityIcons:['◒','▶','⬡'],
    abilityNames:['이동식 방패','방패 돌진','철벽 진형'],
    abilityDescriptions:['전방 투사체를 막는 이동식 방패를 전개합니다.','조준 방향으로 돌진해 적을 밀어냅니다.','주변 아군에게 강한 임시 보호막을 부여합니다.'],
    abilityGrowthDescriptions:['방패 내구도 증가','돌진 피해와 거리 증가','보호막과 지속시간 증가'],cooldowns:[9,11,40],
  },
  demolitionist:{
    id:'demolitionist',name:'폭파 전문가',role:'원거리 광역 압박',primaryWeapon:'bazooka',secondaryWeapon:'pistol',
    abilityIcons:['◆','➤','✦'],
    abilityNames:['점착 폭탄','충격 로켓','융단 폭격'],
    abilityDescriptions:['지정 지점에 설치되어 적이나 미니언이 접근하면 폭발하는 점착 폭탄입니다.','적을 밀어내는 저위력 로켓을 발사합니다.','비행기가 지정 방향을 가로지르며 일곱 발의 폭탄을 순차 투하합니다.'],
    abilityGrowthDescriptions:['폭발 피해와 범위 증가','밀치기와 피해 증가','폭격 피해와 미니언 제압력 증가'],cooldowns:[10,13,42],
  },
  steelPilot:{
    id:'steelPilot',name:'강철 돌격 파일럿',role:'로봇 돌파와 압박',primaryWeapon:'smg',secondaryWeapon:'pistol',
    abilityIcons:['➤','»','▣'],
    abilityNames:['소형 미사일','기계 돌진','강철 로봇 호출'],
    abilityDescriptions:['작은 폭발을 일으키는 미사일을 발사합니다.','짧고 빠르게 돌진합니다.','빨간 강철 로봇을 호출해 자동 탑승합니다.'],
    abilityGrowthDescriptions:['미사일 피해 증가','돌진 거리와 피해 증가','로봇 내구도와 지속시간 증가'],cooldowns:[8,11,46],
  },
  empPilot:{
    id:'empPilot',name:'EMP 파일럿',role:'기계 장비 무력화',primaryWeapon:'pistol',secondaryWeapon:'pistol',
    abilityIcons:['ϟ','◎','▣'],
    abilityNames:['연쇄 전기탄','EMP 수류탄','EMP 로봇 호출'],
    abilityDescriptions:['가까운 적에게 연쇄되는 전기탄을 발사합니다.','작은 범위의 장비와 적을 정지시킵니다.','파란 EMP 로봇을 호출해 자동 탑승합니다.'],
    abilityGrowthDescriptions:['연쇄 수와 피해 증가','정지 시간과 범위 증가','로봇 내구도와 지속시간 증가'],cooldowns:[8,13,46],
  },
  ironCyclone:{
    id:'ironCyclone',name:'철갑 회전병',role:'고속 근접과 회전 돌파',primaryWeapon:'fists',secondaryWeapon:'fists',
    abilityIcons:['↻','➤','⚙'],
    abilityNames:['회전 강습','철벽 전진','철갑 폭주'],
    abilityDescriptions:['빠르게 이동하며 대검으로 주변 적과 미니언을 연속 공격합니다.','보호막을 얻고 조준 방향으로 몸을 부딪치며 전진합니다.','공격 범위와 이동 속도를 높이고 근접 피해 일부를 회복합니다.'],
    abilityGrowthDescriptions:['피해와 지속시간 증가','보호막과 돌진 거리 증가','지속시간과 흡혈 증가'],cooldowns:[8,11,40],
  },
  scrapSummoner:{
    id:'scrapSummoner',name:'고철 소환사',role:'소환과 라인 압박',primaryWeapon:'pistol',secondaryWeapon:'pistol',
    abilityIcons:['⚙','⌖','▣'],
    abilityNames:['톱니봇','지휘 신호기','폐품 거인'],
    abilityDescriptions:['적을 추적하는 근접 톱니봇을 최대 두 기까지 조립합니다.','지정 위치나 적에게 모든 소환수의 공격을 집중합니다.','짧은 시간 전선을 밀어내는 대형 폐품 거인을 조립합니다.'],
    abilityGrowthDescriptions:['소환수 내구도와 피해 증가','지휘 강화 지속시간 증가','거인 내구도와 공격력 증가'],cooldowns:[8,6,42],
  },
  gravityWarden:{
    id:'gravityWarden',name:'중력 견인사',role:'끌어당김과 진형 붕괴',primaryWeapon:'railgun',secondaryWeapon:'pistol',
    abilityIcons:['◎','↔','◉'],
    abilityNames:['중력 닻','반발 충격','붕괴 지대'],
    abilityDescriptions:['주변 적을 중심으로 끌어당기는 중력 장치를 설치합니다.','전방의 적과 적 투사체를 강하게 밀어냅니다.','예고된 범위의 적을 모은 뒤 중력 폭발을 일으킵니다.'],
    abilityGrowthDescriptions:['범위와 지속 피해 증가','밀치기와 피해 증가','폭발 범위와 피해 증가'],cooldowns:[10,12,40],
  },
  smokeTracker:{
    id:'smokeTracker',name:'연막 추적자',role:'측면 침투와 표적 사냥',primaryWeapon:'smg',secondaryWeapon:'pistol',
    abilityIcons:['⌁','☁','⌖'],
    abilityNames:['갈고리 이동','전술 연막','사냥 표식'],
    abilityDescriptions:['갈고리를 걸고 실제 경로를 따라 빠르게 이동합니다.','자동 조준과 시야를 방해하는 연막을 전개합니다.','적 한 명을 추적하고 측후방 공격 피해를 높입니다.'],
    abilityGrowthDescriptions:['이동 거리와 충돌 피해 증가','연막 범위와 지속시간 증가','표식 지속시간과 추가 피해 증가'],cooldowns:[8,13,38],
  },
  sonicCommander:{
    id:'sonicCommander',name:'음파 지휘관',role:'아군 가속과 밀어내기',primaryWeapon:'shotgun',secondaryWeapon:'pistol',
    abilityIcons:[')))','♫','▰'],
    abilityNames:['저음 폭발','행진 박자','공명 행진'],
    abilityDescriptions:['부채꼴 음파로 적과 미니언을 밀어냅니다.','주변 아군의 이동과 재장전 속도를 높입니다.','전진하는 거대한 음파 벽으로 적과 투사체를 밀어냅니다.'],
    abilityGrowthDescriptions:['피해와 밀치기 증가','효과 범위와 지속시간 증가','음파 폭과 피해 증가'],cooldowns:[8,14,40],
  },
  earthHammer:{
    id:'earthHammer',name:'대지 망치병',role:'중장갑 진형 붕괴와 미니언 정리',primaryWeapon:'fists',secondaryWeapon:'fists',
    abilityIcons:['▾','⌑','◆'],
    abilityNames:['균열 강타','진동 말뚝','대지 분쇄'],
    abilityDescriptions:['충전한 망치로 전방 부채꼴 지면을 내려찍습니다.','파괴 가능한 말뚝으로 적을 감속하고 돌진을 차단합니다.','실제 궤적을 따라 도약한 뒤 균열과 밀치기를 일으킵니다.'],
    abilityGrowthDescriptions:['충전 피해와 미니언 피해 증가','말뚝 내구도와 지속시간 증가','착지 피해와 균열 범위 증가'],cooldowns:[9,13,42],
  },
  chainExecutioner:{
    id:'chainExecutioner',name:'사슬 처형자',role:'단일 표적 포획과 전선 고정',primaryWeapon:'fists',secondaryWeapon:'fists',
    abilityIcons:['⌁','⚓','⌾'],
    abilityNames:['사슬 포획','형장의 말뚝','처형 구역'],
    abilityDescriptions:['직선으로 사슬을 던져 첫 번째 적을 안전하게 끌어옵니다.','자신을 고정하고 보호막과 밀치기 저항을 얻습니다.','파괴 가능한 사슬 구역에 적 하나를 묶고 지연 강타합니다.'],
    abilityGrowthDescriptions:['사거리와 당기는 거리 증가','보호막과 고정 시간 증가','구역 내구도와 마무리 피해 증가'],cooldowns:[9,14,40],
  },
  twinBlade:{
    id:'twinBlade',name:'쌍검 질주자',role:'후방 침투와 일대일 결투',primaryWeapon:'fists',secondaryWeapon:'fists',
    abilityIcons:['⨯','◇','彡'],
    abilityNames:['교차 질주','찰나의 반격','잔영 난무'],
    abilityDescriptions:['두 개의 실제 이동 경로를 연속으로 베고 지나갑니다.','짧은 시간 공격 하나를 막고 전방 교차 베기로 반격합니다.','미리 표시한 세 경로를 차례로 질주하며 공격합니다.'],
    abilityGrowthDescriptions:['질주 피해와 거리 증가','반격 피해와 Q 대기시간 감소','경로 폭과 난무 피해 증가'],cooldowns:[7,12,38],
  },
  burstTrooper:{
    id:'burstTrooper',name:'연사 특무병',role:'기동 연사와 전선 압박',primaryWeapon:'smg',secondaryWeapon:'pistol',
    abilityIcons:['═','»','≋'],abilityNames:['이중 관통 사격','전술 회피','전탄 난사'],
    abilityDescriptions:['두 발의 관통탄을 짧은 간격으로 발사합니다.','실제 경로로 회피한 뒤 잠시 공격 속도가 증가합니다.','이동하며 전방 부채꼴에 연속 사격합니다.'],
    abilityGrowthDescriptions:['관통 피해 증가','공격 가속 지속시간 증가','난사 피해와 지속시간 증가'],cooldowns:[7,10,40],
  },
  phaseMarksman:{
    id:'phaseMarksman',name:'위상 사격수',role:'장거리 포킹과 빠른 스킬 순환',primaryWeapon:'railgun',secondaryWeapon:'pistol',
    abilityIcons:['•','◇','━'],abilityNames:['정밀 사격','위상 도약','위상 관통포'],
    abilityDescriptions:['명중하면 자신의 기술 재사용 시간을 줄이는 위상탄입니다.','조준 방향으로 이동한 뒤 자동 사격합니다.','매우 긴 직선을 관통하는 위상포를 발사합니다.'],
    abilityGrowthDescriptions:['피해 증가','도약 피해 증가','관통 피해 증가'],cooldowns:[5.5,14,38],
  },
  opticArtillerist:{
    id:'opticArtillerist',name:'광학 포격수',role:'구속과 장거리 마무리',primaryWeapon:'laser_cannon',secondaryWeapon:'pistol',
    abilityIcons:['▰','◉','━'],abilityNames:['응결 광선','광학 지뢰장','집속 광선'],
    abilityDescriptions:['최대 두 적을 관통해 이동을 구속합니다.','지연 폭발 후 감속 지대를 남기는 광학 장치입니다.','넓고 긴 집속 광선을 예고 후 발사합니다.'],
    abilityGrowthDescriptions:['피해와 구속 지속시간 증가','폭발 피해 증가','집속 피해 증가'],cooldowns:[11,13,40],
  },
  impactDriller:{
    id:'impactDriller',name:'충격 굴착병',role:'표식 추격과 아군 연계',primaryWeapon:'fists',secondaryWeapon:'fists',
    abilityIcons:['⚓','磁','▶'],abilityNames:['공진 앵커','자기 견인','충격 강타'],
    abilityDescriptions:['앵커를 맞힌 뒤 다시 사용해 대상에게 돌진합니다.','아군에게 견인된 뒤 재사용해 충격을 배출합니다.','적 하나를 강하게 차서 뒤쪽 전열까지 무너뜨립니다.'],
    abilityGrowthDescriptions:['앵커와 돌진 피해 증가','보호막과 배출 피해 증가','충격 피해 증가'],cooldowns:[9,11,40],
  },
  spotterGunner:{
    id:'spotterGunner',name:'관측 포수',role:'고정 저격과 길목 통제',primaryWeapon:'sniper',secondaryWeapon:'pistol',
    abilityIcons:['↗','⌑','⌖'],abilityNames:['연쇄 파열탄','압력 감지 덫','고정 사격'],
    abilityDescriptions:['미니언을 처치하면 다음 대상으로 연쇄되는 관통탄입니다.','적에게 보이는 이동 구속 덫을 설치합니다.','자리를 고정하고 초장거리 탄환 네 발을 조준합니다.'],
    abilityGrowthDescriptions:['관통 피해 증가','덫 피해와 지속시간 증가','거치 탄환 피해 증가'],cooldowns:[8,12,42],
  },
  jetstreamBlade:{
    id:'jetstreamBlade',name:'기류 검사',role:'대상 관통과 공중 연계',primaryWeapon:'fists',secondaryWeapon:'fists',
    abilityIcons:['⌁','»','彡'],abilityNames:['압축 베기','관통 질주','제트 강습'],
    abilityDescriptions:['세 번째 사용이 적을 띄우는 상승기류로 바뀝니다.','적이나 미니언을 관통해 안전한 반대편에 착지합니다.','띄워진 적에게 도약해 연속으로 베어냅니다.'],
    abilityGrowthDescriptions:['베기와 상승기류 피해 증가','질주 피해 증가','강습 피해 증가'],cooldowns:[4,12,44],
  },
  blackoutAssassin:{
    id:'blackoutAssassin',name:'정전 암살자',role:'센서 방해와 후방 급습',primaryWeapon:'fists',secondaryWeapon:'fists',
    abilityIcons:['ϟ','⌁','▼'],abilityNames:['전류 사슬','구속 케이블','정전 강하'],
    abilityDescriptions:['명중하면 이동 속도가 증가하는 전류 투사체입니다.','연결을 끊지 못한 적의 이동을 구속합니다.','적 센서를 제한하고 먼 거리의 적에게 강하합니다.'],
    abilityGrowthDescriptions:['피해 증가','구속 피해 증가','강하 피해 증가'],cooldowns:[8,15,46],
  },
};

export const CORE_SIEGE_HERO_IDS=Object.keys(CORE_SIEGE_HEROES) as CoreSiegeHeroId[];
export const CORE_SIEGE_LEVEL_XP=[0,100,240,420,650,930,1260,1640,2070,2550] as const;
export const CORE_SIEGE_SKILL_MAX_RANKS=[5,5,3] as const;

export function normalizeCoreSiegeHero(value:unknown):CoreSiegeHeroId{
  return typeof value==='string'&&value in CORE_SIEGE_HEROES?value as CoreSiegeHeroId:'vanguard';
}

export function normalizeCoreSiegeHumans(value:unknown){
  const parsed=Number(value);
  return CORE_SIEGE_CONFIG.humanOptions.includes(parsed as 4|6|8)?parsed:CORE_SIEGE_CONFIG.defaultHumans;
}

export function coreSiegeLayout(worldWidth:number,worldHeight:number=worldWidth){
  const laneY=worldHeight*CORE_SIEGE_CONFIG.laneYRatio;
  const structure=(team:Exclude<CombatTeam,'none'>,kind:CoreSiegeStructureKind,order:number,xRatio:number,radius:number,hp:number):CoreSiegeStructureLayout=>({
    id:`${team}-${kind}`,team,kind,order,x:worldWidth*xRatio,y:laneY,radius,hp,
  });
  const structures=[
    structure('blue','core',0,.075,84,1650),
    structure('blue','innerTower',1,.19,54,760),
    structure('blue','outerTower',2,.33,50,640),
    structure('red','outerTower',2,.67,50,640),
    structure('red','innerTower',1,.81,54,760),
    structure('red','core',0,.925,84,1650),
  ];
  const pickups:CoreSiegePickupLayout[]=[
    {id:'center-supply',kind:'supply',x:worldWidth*.5,y:laneY,radius:34,respawnSeconds:CORE_SIEGE_CONFIG.supplyRespawnSeconds},
    {id:'upper-heal',kind:'healing',x:worldWidth*.5,y:laneY-CORE_SIEGE_CONFIG.sideLaneOffset,radius:30,respawnSeconds:CORE_SIEGE_CONFIG.healingRespawnSeconds},
    {id:'lower-heal',kind:'healing',x:worldWidth*.5,y:laneY+CORE_SIEGE_CONFIG.sideLaneOffset,radius:30,respawnSeconds:CORE_SIEGE_CONFIG.healingRespawnSeconds},
    {id:'blue-heal',kind:'healing',x:worldWidth*.285,y:laneY,radius:28,respawnSeconds:CORE_SIEGE_CONFIG.healingRespawnSeconds},
    {id:'red-heal',kind:'healing',x:worldWidth*.715,y:laneY,radius:28,respawnSeconds:CORE_SIEGE_CONFIG.healingRespawnSeconds},
  ];
  return{laneY,structures,pickups,camps:[] as const};
}

export function coreSiegeStructureVulnerable(
  target:Pick<CoreSiegeStructureLayout,'team'|'kind'>,
  structures:readonly Pick<CoreSiegeStructureLayout,'team'|'kind'|'hp'>[],
){
  if(target.kind==='outerTower')return true;
  const sameTeam=structures.filter((candidate)=>candidate.team===target.team&&candidate.hp>0);
  if(target.kind==='innerTower')return !sameTeam.some((candidate)=>candidate.kind==='outerTower');
  return !sameTeam.some((candidate)=>candidate.kind==='outerTower'||candidate.kind==='innerTower');
}

export function coreSiegeCooldown(baseSeconds:number,hasteStacks:number){
  const stacks=Math.max(0,Math.min(CORE_SIEGE_CONFIG.maxUpgradeStacks,Math.trunc(hasteStacks)));
  return baseSeconds*(1-stacks*CORE_SIEGE_CONFIG.hasteCooldownReductionPerStack);
}

export function coreSiegePowerMultiplier(powerStacks:number){
  const stacks=Math.max(0,Math.min(CORE_SIEGE_CONFIG.maxUpgradeStacks,Math.trunc(powerStacks)));
  return 1+stacks*CORE_SIEGE_CONFIG.powerDamagePerStack;
}

export function coreSiegeBasicDamageMultiplier(level:number){
  const safe=Math.max(1,Math.min(CORE_SIEGE_CONFIG.maxLevel,Math.trunc(level)));
  return 1+(safe-1)*CORE_SIEGE_CONFIG.basicDamagePerLevel;
}

export function coreSiegeRespawnSeconds(level:number){
  const safe=Math.max(1,Math.min(CORE_SIEGE_CONFIG.maxLevel,Math.trunc(level)));
  const ratio=(safe-1)/(CORE_SIEGE_CONFIG.maxLevel-1);
  return CORE_SIEGE_CONFIG.respawnMinSeconds+(CORE_SIEGE_CONFIG.respawnMaxSeconds-CORE_SIEGE_CONFIG.respawnMinSeconds)*ratio;
}

export function coreSiegeLevelForXp(xp:number){
  const safe=Math.max(0,Number.isFinite(xp)?xp:0);
  let level=1;
  for(let index=1;index<CORE_SIEGE_LEVEL_XP.length;index++)if(safe>=CORE_SIEGE_LEVEL_XP[index]!)level=index+1;
  return Math.min(CORE_SIEGE_CONFIG.maxLevel,level);
}

export function coreSiegeLevelXpWindow(level:number){
  const safe=Math.max(1,Math.min(CORE_SIEGE_CONFIG.maxLevel,Math.trunc(level)));
  const current=CORE_SIEGE_LEVEL_XP[safe-1]??0;
  const next=safe>=CORE_SIEGE_CONFIG.maxLevel?current:CORE_SIEGE_LEVEL_XP[safe]??current;
  return{current,next};
}

export function coreSiegeSkillRankCap(level:number,slot:CoreSiegeAbilitySlot){
  const safe=Math.max(1,Math.min(CORE_SIEGE_CONFIG.maxLevel,Math.trunc(level)));
  if(slot===3)return safe>=10?3:safe>=8?2:safe>=5?1:0;
  return Math.min(CORE_SIEGE_SKILL_MAX_RANKS[slot-1],Math.ceil(safe/2));
}

export function coreSiegeCanUpgradeSkill(level:number,skillPoints:number,slot:CoreSiegeAbilitySlot,currentRank:number){
  return skillPoints>0&&currentRank<coreSiegeSkillRankCap(level,slot)&&currentRank<CORE_SIEGE_SKILL_MAX_RANKS[slot-1];
}

export function coreSiegeAbilityPowerMultiplier(rank:number){
  const safe=Math.max(1,Math.trunc(rank));
  return 1+(safe-1)*CORE_SIEGE_CONFIG.skillDamagePerRank;
}

export function coreSiegeAbilityCooldown(baseSeconds:number,hasteStacks:number,rank:number){
  const safe=Math.max(1,Math.trunc(rank));
  return coreSiegeCooldown(baseSeconds,hasteStacks)*CORE_SIEGE_CONFIG.abilityCooldownMultiplier*(1-(safe-1)*CORE_SIEGE_CONFIG.skillCooldownReductionPerRank);
}

export function clampCoreSiegeTarget(
  origin:{x:number;y:number},
  aim:{x:number;y:number},
  range:number=CORE_SIEGE_CONFIG.grenadeRange,
){
  const dx=aim.x-origin.x;
  const dy=aim.y-origin.y;
  const distance=Math.hypot(dx,dy);
  if(distance<=range||distance===0)return{x:aim.x,y:aim.y};
  return{x:origin.x+dx/distance*range,y:origin.y+dy/distance*range};
}

export function assistedCoreSiegeTarget<T extends {x:number;y:number}>(
  desired:{x:number;y:number},
  candidates:readonly T[],
  radius:number=CORE_SIEGE_CONFIG.grenadeAimAssistRadius,
){
  let selected:T|undefined;
  let selectedDistance:number=radius;
  for(const candidate of candidates){
    const distance=Math.hypot(candidate.x-desired.x,candidate.y-desired.y);
    if(distance>selectedDistance)continue;
    selected=candidate;
    selectedDistance=distance;
  }
  return selected?{x:selected.x,y:selected.y,target:selected}:{x:desired.x,y:desired.y};
}
