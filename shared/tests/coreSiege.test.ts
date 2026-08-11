import { describe, expect, it } from 'vitest';
import {
  CORE_SIEGE_BASIC_ATTACKS,
  CORE_SIEGE_CONFIG,
  CORE_SIEGE_HERO_IDS,
  WEAPONS,
  assistedCoreSiegeTarget,
  clampCoreSiegeTarget,
  coreSiegeAbilityCooldown,
  coreSiegeAbilityPowerMultiplier,
  coreSiegeAreaRepeatMultiplier,
  coreSiegeBasicDamageMultiplier,
  coreSiegeCanUpgradeSkill,
  coreSiegeCooldown,
  coreSiegeCrowdControlMultiplier,
  coreSiegeHeroMaxHp,
  coreSiegeHeroMoveMultiplier,
  coreSiegeHeroSlowResistance,
  coreSiegeLayout,
  coreSiegeLevelForXp,
  coreSiegeLevelXpWindow,
  coreSiegePowerMultiplier,
  coreSiegeRespawnSeconds,
  coreSiegeSkillRankCap,
  coreSiegeSmokeTrackerConcealed,
  coreSiegeStructureVulnerable,
  coreSiegeSustainedDps,
  getMapConfig,
  isCoreSiegeMeleeHero,
  normalizeCoreSiegeHumans,
  normalizeGameMode,
} from '../src/index.js';

describe('core siege rules',()=>{
  it('keeps an enemy smoke tracker fully concealed inside their own active smoke',()=>{
    const tracker={id:'tracker',team:'red',heroId:'smokeTracker',x:100,y:100};
    const smoke=[{ownerId:'tracker',x:110,y:100,radius:80,expiresAt:20}];
    expect(coreSiegeSmokeTrackerConcealed(tracker,{team:'blue'},smoke,10)).toBe(true);
    expect(coreSiegeSmokeTrackerConcealed(tracker,{team:'red'},smoke,10)).toBe(false);
    expect(coreSiegeSmokeTrackerConcealed({...tracker,x:250},{team:'blue'},smoke,10)).toBe(false);
    expect(coreSiegeSmokeTrackerConcealed(tracker,{team:'blue'},smoke,21)).toBe(false);
  });
  it('normalizes the mode and supports 2v2, 3v3, and 4v4 human caps',()=>{
    expect(normalizeGameMode('coreSiege')).toBe('coreSiege');
    expect([4,6,8].map(normalizeCoreSiegeHumans)).toEqual([4,6,8]);
    expect(normalizeCoreSiegeHumans(5)).toBe(CORE_SIEGE_CONFIG.defaultHumans);
  });

  it('builds a symmetric lane with ordered towers and cores',()=>{
    const map=getMapConfig('coreSiege'),layout=coreSiegeLayout(map.width,map.height);
    expect(map.displayName).toBe('코어 전선');
    expect(map.width).toBe(4600);
    expect(map.height).toBe(1800);
    expect(map.bushes.length).toBeGreaterThanOrEqual(8);
    expect(map.collisionObstacles).toHaveLength(12);
    const laneTop=layout.laneY-CORE_SIEGE_CONFIG.laneHalfWidth,laneBottom=layout.laneY+CORE_SIEGE_CONFIG.laneHalfWidth;
    expect(map.collisionObstacles.every((rect)=>rect.y+rect.h<=laneTop||rect.y>=laneBottom)).toBe(true);
    expect(layout.structures).toHaveLength(6);
    expect(layout.structures.find((item)=>item.id==='blue-core')?.x).toBeCloseTo(345);
    expect(layout.structures.find((item)=>item.id==='red-core')?.x).toBeCloseTo(4255);
    expect(layout.camps).toHaveLength(0);
    expect(layout.pickups).toHaveLength(5);
    expect(layout.pickups.every((item)=>item.y>0&&item.y<map.height)).toBe(true);
  });

  it('unlocks the inner tower and core in order',()=>{
    const structures=coreSiegeLayout(4000).structures;
    const blueInner=structures.find((item)=>item.id==='blue-innerTower')!;
    const blueCore=structures.find((item)=>item.id==='blue-core')!;
    expect(coreSiegeStructureVulnerable(blueInner,structures)).toBe(false);
    expect(coreSiegeStructureVulnerable(blueCore,structures)).toBe(false);
    structures.find((item)=>item.id==='blue-outerTower')!.hp=0;
    expect(coreSiegeStructureVulnerable(blueInner,structures)).toBe(true);
    structures.find((item)=>item.id==='blue-innerTower')!.hp=0;
    expect(coreSiegeStructureVulnerable(blueCore,structures)).toBe(true);
  });

  it('clamps ground clicks and only assists near the requested point',()=>{
    expect(clampCoreSiegeTarget({x:0,y:0},{x:1000,y:0})).toEqual({x:CORE_SIEGE_CONFIG.grenadeRange,y:0});
    const candidates=[{id:'near',x:590,y:20},{id:'far',x:300,y:300}];
    expect(assistedCoreSiegeTarget({x:600,y:0},candidates).target?.id).toBe('near');
    expect(assistedCoreSiegeTarget({x:0,y:0},candidates).target).toBeUndefined();
    const assisted=assistedCoreSiegeTarget({x:CORE_SIEGE_CONFIG.grenadeRange,y:0},[{id:'outside',x:700,y:0}]);
    expect(clampCoreSiegeTarget({x:0,y:0},assisted)).toEqual({x:CORE_SIEGE_CONFIG.grenadeRange,y:0});
  });

  it('keeps lane tempo bounded with cooldown and supply stack caps',()=>{
    expect(CORE_SIEGE_CONFIG).toMatchObject({
      waveIntervalSeconds:18,
      startLevel:3,
      startXp:240,
      grenadeTelegraphSeconds:.7,
      grenadeAimAssistRadius:175,
      grenadeMaxDamage:72,
    });
    expect(coreSiegeCooldown(9,0)).toBe(9);
    expect(coreSiegeCooldown(9,3)).toBeCloseTo(7.38);
    expect(coreSiegeCooldown(9,99)).toBeCloseTo(7.38);
    expect(coreSiegePowerMultiplier(3)).toBeCloseTo(1.18);
  });

  it('uses mode-local basic attacks, infinite reserves, and scaling respawns',()=>{
    expect(CORE_SIEGE_HERO_IDS).toHaveLength(20);
    expect(Object.keys(CORE_SIEGE_BASIC_ATTACKS)).toEqual(expect.arrayContaining(CORE_SIEGE_HERO_IDS));
    expect(CORE_SIEGE_BASIC_ATTACKS.vanguard).toMatchObject({weaponId:'rifle',damage:16,magazine:28});
    expect(CORE_SIEGE_BASIC_ATTACKS.earthHammer).toMatchObject({weaponId:'fists',displayName:'대지 망치'});
    expect(CORE_SIEGE_BASIC_ATTACKS.chainExecutioner).toMatchObject({weaponId:'fists',displayName:'사슬낫'});
    expect(CORE_SIEGE_BASIC_ATTACKS.twinBlade).toMatchObject({weaponId:'fists',displayName:'쌍검'});
    expect(coreSiegeBasicDamageMultiplier(1)).toBe(1);
    expect(coreSiegeBasicDamageMultiplier(10)).toBeCloseTo(1.18);
    expect(coreSiegeRespawnSeconds(1)).toBe(5);
    expect(coreSiegeRespawnSeconds(10)).toBe(12);
    expect(WEAPONS.rifle).toMatchObject({damage:17,magazine:24,reloadSeconds:1.7});
    expect(WEAPONS.pistol).toMatchObject({damage:18,magazine:12,reloadSeconds:1.35});
  });

  it('gives every siege role distinct durability and melee pursuit',()=>{
    expect(isCoreSiegeMeleeHero('chainExecutioner')).toBe(true);
    expect(isCoreSiegeMeleeHero('vanguard')).toBe(false);
    expect(coreSiegeHeroMoveMultiplier('wolfWarrior')).toBe(1.2);
    expect(coreSiegeHeroMoveMultiplier('wolfWarrior',true)).toBe(1.32);
    expect(coreSiegeHeroMoveMultiplier('ironCyclone',false,true)).toBe(1.38);
    expect(coreSiegeHeroMoveMultiplier('twinBlade')).toBe(1.3);
    expect(coreSiegeHeroSlowResistance('chainExecutioner')).toBe(.25);
    expect(coreSiegeHeroSlowResistance('earthHammer')).toBe(.35);
    expect(coreSiegeHeroSlowResistance('ironCyclone',true)).toBe(.5);
    expect(coreSiegeHeroMaxHp('orbitalSniper')).toBe(110);
    expect(coreSiegeHeroMaxHp('vanguard')).toBe(120);
    expect(coreSiegeHeroMaxHp('medigel')).toBe(125);
    expect(coreSiegeHeroMaxHp('shieldCaptain')).toBe(160);
    expect(coreSiegeHeroMaxHp('earthHammer')).toBe(190);
    expect(CORE_SIEGE_HERO_IDS.every((heroId)=>coreSiegeHeroMaxHp(heroId)>=110)).toBe(true);
    expect([0,1,2,9].map(coreSiegeAreaRepeatMultiplier)).toEqual([1,.55,.25,.25]);
    expect([0,1,2,9].map(coreSiegeCrowdControlMultiplier)).toEqual([1,.65,.35,.35]);
  });

  it('keeps low-output siege basics useful without buffing burst weapons',()=>{
    expect(coreSiegeSustainedDps('medigel')).toBeCloseTo(50);
    expect(coreSiegeSustainedDps('scrapSummoner')).toBeGreaterThan(55);
    expect(coreSiegeSustainedDps('gravityWarden')).toBeGreaterThan(45);
    expect(CORE_SIEGE_BASIC_ATTACKS.sonicCommander.projectileRadiusMultiplier).toBe(1.6);
    expect(CORE_SIEGE_BASIC_ATTACKS.orbitalSniper.damage).toBe(58);
    expect(CORE_SIEGE_BASIC_ATTACKS.demolitionist.damage).toBe(58);
    expect(CORE_SIEGE_BASIC_ATTACKS.demolitionist).toMatchObject({magazine:2,fireInterval:1.25,reloadSeconds:1.8});
    expect(coreSiegeSustainedDps('demolitionist')*CORE_SIEGE_CONFIG.heroDamageTakenMultiplier).toBeGreaterThan(16);
    for(const heroId of CORE_SIEGE_HERO_IDS){
      const perfectHitTtk=120/(coreSiegeSustainedDps(heroId)*CORE_SIEGE_CONFIG.heroDamageTakenMultiplier);
      expect(perfectHitTtk).toBeLessThanOrEqual(8);
    }
  });

  it('levels from combat XP and gates skill ranks by hero level',()=>{
    expect(coreSiegeLevelForXp(0)).toBe(1);
    expect(coreSiegeLevelForXp(420)).toBe(4);
    expect(coreSiegeLevelForXp(99999)).toBe(10);
    expect(coreSiegeLevelXpWindow(4)).toEqual({current:420,next:650});
    expect(coreSiegeSkillRankCap(1,1)).toBe(1);
    expect(coreSiegeSkillRankCap(4,1)).toBe(2);
    expect(coreSiegeSkillRankCap(4,3)).toBe(0);
    expect(coreSiegeSkillRankCap(5,3)).toBe(1);
    expect(coreSiegeCanUpgradeSkill(2,1,2,0)).toBe(true);
    expect(coreSiegeCanUpgradeSkill(4,0,1,1)).toBe(false);
    expect(coreSiegeAbilityPowerMultiplier(3)).toBeCloseTo(1.3);
    expect(coreSiegeAbilityCooldown(10,0,3)).toBeCloseTo(7.92);
  });
});
