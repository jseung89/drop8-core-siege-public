import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { CORE_SIEGE_BASIC_ATTACKS, CORE_SIEGE_CONFIG, CORE_SIEGE_HERO_IDS, MAP_CONFIGS, WEAPONS, normalizeOpenArenaConfig } from '@drop8/shared';
import { publicRoomInfoFromListing } from '../src/roomRegistry.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { PlayerState } from '../src/rooms/schema.js';

function activeRoom(){
  const clock={value:100};
  const room=new Drop8Room() as any;
  room.now=()=>clock.value;
  room.gameMode='coreSiege';
  room.matchFormat='teams';
  room.openArenaRoundState='active';
  room.state.phase='ACTIVE';
  room.state.mapId='coreSiege';
  room.state.worldSize=MAP_CONFIGS.coreSiege.width;
  room.initializeCoreSiege();
  return{room,clock};
}

function combatant(id:string,team:'blue'|'red',x:number,y:number){
  const player=new PlayerState();
  player.id=id;player.name=id;player.team=team;player.alive=true;player.phase='landed';player.hp=100;player.x=x;player.y=y;
  return player;
}

describe('Refactor 064 core siege MVP',()=>{
  it('keeps active core siege rooms joinable in the public room registry',()=>{
    const room=publicRoomInfoFromListing({roomId:'SIEGE1',clients:2,maxClients:4,metadata:{roomCode:'SIEGE1',hostName:'host',players:4,humans:2,phase:'ACTIVE',fillAi:true,publicRoom:true,mapSizeMode:'small',mapDisplayName:'작은 맵',createdAt:1,updatedAt:2,gameMode:'coreSiege',matchFormat:'teams',maxHumans:4,configuredAiCount:2,spectatorOnly:false,joinInProgress:true,lifecycle:'active',killLimit:0,roundState:'active'}} as any);
    expect(room).toMatchObject({gameMode:'coreSiege',joinInProgress:true,lifecycle:'active',maxHumans:4});
  });

  it('spawns symmetric minion waves and a siege minion every third wave',()=>{
    const {room,clock}=activeRoom();
    room.spawnCoreSiegeWave();
    expect(room.state.coreSiege.minions.size).toBe(10);
    const blue=[...room.state.coreSiege.minions.values()].filter((minion:any)=>minion.team==='blue');
    expect(new Set(blue.map((minion:any)=>minion.y)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(blue.map((minion:any)=>minion.x)).size).toBeGreaterThanOrEqual(4);
    const before=new Map(blue.map((minion:any)=>[minion.id,{x:minion.x,y:minion.y}]));
    clock.value+=.5;room.updateCoreSiegeMinions(.5);
    expect(new Set(blue.map((minion:any)=>Math.round(minion.x-before.get(minion.id)!.x))).size).toBeGreaterThan(1);
    expect(blue.filter((minion:any)=>Math.abs(minion.y-before.get(minion.id)!.y)>1)).toHaveLength(blue.length);
    room.state.coreSiege.minions.clear();
    room.spawnCoreSiegeWave();room.state.coreSiege.minions.clear();room.spawnCoreSiegeWave();
    expect([...room.state.coreSiege.minions.values()].filter((minion:any)=>minion.kind==='siege')).toHaveLength(2);
  });

  it('delays ranged minion damage until the visible projectile arrives',()=>{
    const {room,clock}=activeRoom();room.spawnCoreSiegeWave();const ranged=[...room.state.coreSiege.minions.values()].find((item:any)=>item.team==='blue'&&item.kind==='ranged') as any,target=[...room.state.coreSiege.minions.values()].find((item:any)=>item.team==='red'&&item.kind==='melee') as any;
    for(const minion of [...room.state.coreSiege.minions.values()])if(minion.id!==ranged.id&&minion.id!==target.id)room.state.coreSiege.minions.delete(minion.id);
    ranged.x=1000;ranged.y=900;ranged.attackReadyAt=clock.value;target.x=1190;target.y=900;const before=target.hp;room.updateCoreSiegeMinions(.01);expect(target.hp).toBe(before);expect(room.coreSiegeAttackProjectiles.size).toBe(1);
    clock.value+=1;room.updateCoreSiegeAttackProjectiles();expect(target.hp).toBeLessThan(before);expect(room.coreSiegeAttackProjectiles.size).toBe(0);
  });

  it('enforces outer tower, inner tower, then core vulnerability',()=>{
    const {room}=activeRoom(),attacker=combatant('red-player','red',1800,900);
    room.state.players.set(attacker.id,attacker);
    const outer=room.state.coreSiege.structures.get('blue-outerTower'),inner=room.state.coreSiege.structures.get('blue-innerTower'),core=room.state.coreSiege.structures.get('blue-core');
    expect(outer.vulnerable).toBe(true);expect(inner.vulnerable).toBe(false);expect(core.vulnerable).toBe(false);
    room.damageCoreSiegeStructure(outer,10000,attacker.id);
    expect(outer.destroyed).toBe(true);expect(inner.vulnerable).toBe(true);expect(core.vulnerable).toBe(false);
    room.damageCoreSiegeStructure(inner,10000,attacker.id);
    expect(inner.destroyed).toBe(true);expect(core.vulnerable).toBe(true);
  });

  it('turns an exposed core into a final defensive turret',()=>{
    const {room,clock}=activeRoom(),core=room.state.coreSiege.structures.get('blue-core'),outer=room.state.coreSiege.structures.get('blue-outerTower'),inner=room.state.coreSiege.structures.get('blue-innerTower');
    const attacker=combatant('core-raider','red',core.x+260,core.y);room.state.players.set(attacker.id,attacker);
    room.updateCoreSiegeStructures();
    expect([...room.coreSiegeAttackProjectiles.values()].some((job:any)=>job.sourceId===core.id)).toBe(false);
    room.damageCoreSiegeStructure(outer,10000,attacker.id);room.damageCoreSiegeStructure(inner,10000,attacker.id);
    room.updateCoreSiegeStructures();
    const shot=[...room.coreSiegeAttackProjectiles.values()].find((job:any)=>job.sourceId===core.id) as any;
    expect(shot?.targetId).toBe(attacker.id);expect(shot?.damage).toBe(CORE_SIEGE_CONFIG.coreDefensePlayerDamage);
    const before=attacker.hp;clock.value+=1;room.updateCoreSiegeAttackProjectiles();expect(attacker.hp).toBeLessThan(before);
  });

  it('adds siege-only hero durability without strengthening robots or other modes',()=>{
    const {room}=activeRoom(),attacker=combatant('damage-blue','blue',1000,900),target=combatant('damage-red','red',1200,900);
    room.state.players.set(attacker.id,attacker);room.state.players.set(target.id,target);
    room.damage(target,40,attacker.id,'총기',0,0,'bullet');
    expect(target.hp).toBeCloseTo(100-40*CORE_SIEGE_CONFIG.heroDamageTakenMultiplier);

    target.hp=100;
    const exo=room.tacticalInventory(target.id);exo.exoActive=true;exo.exoHp=100;
    room.damage(target,40,attacker.id,'총기',0,0,'bullet');
    expect(exo.exoHp).toBe(60);expect(target.hp).toBe(100);

    exo.exoActive=false;target.hp=100;room.gameMode='domination';
    room.damage(target,40,attacker.id,'총기',0,0,'bullet');
    expect(target.hp).toBe(60);
  });

  it('separates siege area burst from minion clear and reduces repeated hits',()=>{
    const {room}=activeRoom(),attacker=combatant('area-blue','blue',1000,900),target=combatant('area-red','red',1040,900);
    room.state.players.set(attacker.id,attacker);room.state.players.set(target.id,target);
    room.coreSiegePlayer(attacker.id).heroId='vanguard';room.coreSiegePlayer(target.id).heroId='vanguard';room.giveOpenArenaStarterKit(attacker);room.giveOpenArenaStarterKit(target);
    const before=target.hp;room.damageCoreSiegeAreaPlayer(target,72,attacker.id,'test area','grenade');const first=before-target.hp;
    const afterFirst=target.hp;room.damageCoreSiegeAreaPlayer(target,72,attacker.id,'test area','grenade');const second=afterFirst-target.hp;
    expect(first).toBeCloseTo(72*CORE_SIEGE_CONFIG.areaHeroDamageMultiplier*CORE_SIEGE_CONFIG.heroDamageTakenMultiplier);
    expect(second).toBeCloseTo(first*.55);expect(first).toBeLessThan(target.maxHp*.35);

    room.spawnCoreSiegeWave();const minion=[...room.state.coreSiege.minions.values()].find((item:any)=>item.team==='red') as any;minion.x=1000;minion.y=900;
    const minionBefore=minion.hp;room.damageCoreSiegeMinionsInRadius(1000,900,120,72,attacker.id);expect(minionBefore-minion.hp).toBe(72);
  });

  it('grants melee contact shielding only once per cooldown',()=>{
    const {room,clock}=activeRoom(),iron=combatant('guard-blue','blue',1000,900),target=combatant('guard-red','red',1080,900);
    room.state.players.set(iron.id,iron);room.state.players.set(target.id,target);room.coreSiegePlayer(iron.id).heroId='ironCyclone';room.giveOpenArenaStarterKit(iron);room.giveOpenArenaStarterKit(target);
    const progress=room.coreSiegePlayer(iron.id);room.damage(target,20,iron.id,'대검 베기',0,0,'melee');expect(progress.temporaryShield).toBe(CORE_SIEGE_CONFIG.meleeContactShield);
    progress.temporaryShield=0;clock.value+=1;room.damage(target,20,iron.id,'대검 베기',0,0,'melee');expect(progress.temporaryShield).toBe(0);
    clock.value+=CORE_SIEGE_CONFIG.meleeContactShieldCooldownSeconds;room.damage(target,20,iron.id,'대검 베기',0,0,'melee');expect(progress.temporaryShield).toBe(CORE_SIEGE_CONFIG.meleeContactShield);
  });

  it('reduces repeated siege crowd control without changing the first hit',()=>{
    const {room,clock}=activeRoom(),target=combatant('cc-red','red',1000,900);room.state.players.set(target.id,target);
    expect(room.applyCoreSiegeCrowdControl(target,1,2)).toBe(1);expect(target.werewolf.actionLockedUntil-clock.value).toBeCloseTo(1);
    clock.value=101.1;expect(room.applyCoreSiegeCrowdControl(target,1,2)).toBe(.65);expect(target.werewolf.actionLockedUntil-clock.value).toBeCloseTo(.65);
    clock.value=102;expect(room.applyCoreSiegeCrowdControl(target,1,2)).toBe(.35);expect(target.werewolf.actionLockedUntil-clock.value).toBeCloseTo(.35);
    clock.value+=CORE_SIEGE_CONFIG.crowdControlWindowSeconds+.1;expect(room.applyCoreSiegeCrowdControl(target,1,2)).toBe(1);
  });

  it('lets flame, medigel, and bazooka primary attacks damage the outer tower',()=>{
    const {room,clock}=activeRoom(),tower=room.state.coreSiege.structures.get('red-outerTower');

    const fire=combatant('fire-blue','blue',tower.x-190,tower.y);fire.angle=0;room.state.players.set(fire.id,fire);room.coreSiegePlayer(fire.id).heroId='fireEngineer';room.giveOpenArenaStarterKit(fire);
    const beforeFlame=tower.hp;room.fireFlamethrower(fire,room.getWeaponMagazine(fire,'flamethrower'),clock.value);
    expect(tower.hp).toBeLessThan(beforeFlame);

    const medic=combatant('medic-blue','blue',tower.x-220,tower.y);medic.angle=0;room.state.players.set(medic.id,medic);room.coreSiegePlayer(medic.id).heroId='medigel';room.giveOpenArenaStarterKit(medic);
    const beforeGel=tower.hp;clock.value+=.2;room.fireCoreSiegeMedigel(medic,clock.value);
    expect(tower.hp).toBeLessThan(beforeGel);

    const demo=combatant('demo-blue','blue',tower.x-300,tower.y);demo.angle=0;room.state.players.set(demo.id,demo);room.coreSiegePlayer(demo.id).heroId='demolitionist';room.giveOpenArenaStarterKit(demo);
    const beforeRocket=tower.hp;room.spawnBazookaRocket(demo,0);room.updateRockets(.4);
    expect(tower.hp).toBeLessThan(beforeRocket);expect(room.state.rockets.size).toBe(0);
  });

  it('casts the grenade at a clicked point, assists nearby enemies, and starts cooldown',()=>{
    const {room,clock}=activeRoom(),attacker=combatant('blue-player','blue',1000,900),enemy=combatant('red-player','red',1550,910);
    room.state.players.set(attacker.id,attacker);room.state.players.set(enemy.id,enemy);
    const progress=room.coreSiegePlayer(attacker.id);progress.heroId='vanguard';
    expect(room.castCoreSiegeAbility(attacker,1,{aimWorldX:1530,aimWorldY:900})).toBe(true);
    expect(progress.ability1ReadyAt).toBeCloseTo(clock.value+7.524);
    const job=[...room.coreSiegeAreaJobs.values()][0];
    expect(job.x).toBe(enemy.x);expect(job.y).toBe(enemy.y);expect(job.radius).toBeCloseTo(CORE_SIEGE_CONFIG.grenadeRadius*1.04);
    clock.value+=CORE_SIEGE_CONFIG.grenadeTelegraphSeconds+.01;
    room.updateCoreSiegeAreaJobs();
    expect(enemy.hp).toBeLessThan(100);
  });

  it('makes the demolitionist Q a proximity sticky bomb that clears minions',()=>{
    const {room,clock}=activeRoom(),attacker=combatant('demo-blue','blue',1000,900);
    room.state.players.set(attacker.id,attacker);room.spawnCoreSiegeWave();
    const minion=[...room.state.coreSiege.minions.values()].find((item:any)=>item.team==='red') as any;
    minion.x=1500;minion.y=900;
    const progress=room.coreSiegePlayer(attacker.id);progress.heroId='demolitionist';
    expect(room.castCoreSiegeAbility(attacker,1,{aimWorldX:1500,aimWorldY:900})).toBe(true);
    const job=[...room.coreSiegeAreaJobs.values()][0];
    expect(job.kind).toBe('sticky');expect(job.expiresAt-job.detonatesAt).toBeGreaterThan(3);
    const before=minion.hp;clock.value+=.5;room.updateCoreSiegeAreaJobs();
    expect(minion.hp).toBeLessThan(before);
    expect(room.coreSiegeAreaJobs.size).toBe(0);
  });

  it('lets dash and spider-mine skills damage enemy minions',()=>{
    const {room,clock}=activeRoom(),wolf=combatant('wolf-blue','blue',1000,900);
    room.state.players.set(wolf.id,wolf);room.spawnCoreSiegeWave();
    const minion=[...room.state.coreSiege.minions.values()].find((item:any)=>item.team==='red') as any;
    minion.x=1120;minion.y=900;
    room.coreSiegePlayer(wolf.id).heroId='wolfWarrior';
    const beforeDash=minion.hp;
    expect(room.castCoreSiegeAbility(wolf,1,{aimWorldX:1240,aimWorldY:900})).toBe(true);
    expect(wolf.x).toBe(1000);
    clock.value+=.12;room.updateCoreSiegeDashes();
    expect(wolf.x).toBeGreaterThan(1000);expect(wolf.x).toBeLessThan(1240);
    expect(minion.hp).toBeLessThan(beforeDash);
    clock.value+=.3;room.updateCoreSiegeDashes();
    expect(wolf.x).toBeCloseTo(1240);expect(room.coreSiegeDashJobs.size).toBe(0);

    const trapper=combatant('trapper-blue','blue',1500,900);trapper.angle=0;room.state.players.set(trapper.id,trapper);
    room.tacticalInventory(trapper.id).spiderMineCount=1;
    expect(room.placeSpiderMineForPlayer(trapper)).toBe(true);
    const mine=room.spiderMines()[0];minion.x=mine.x+90;minion.y=mine.y;
    clock.value+=2;room.updateSpiderMines(.05);
    expect(mine.targetId).toBe(minion.id);
    const beforeMine=minion.hp;mine.x=minion.x;mine.y=minion.y;room.updateSpiderMines(.05);
    expect(minion.hp).toBeLessThan(beforeMine);
  });

  it('broadcasts distinct cast, dash, EMP, beam, and fire-device styles',()=>{
    const {room}=activeRoom(),events:Array<{type:string;payload:any}>=[];
    room.broadcast=(type:string,payload:any)=>events.push({type,payload});
    const player=combatant('visual-blue','blue',1000,900);room.state.players.set(player.id,player);
    const progress=room.coreSiegePlayer(player.id);progress.heroId='wolfWarrior';
    expect(room.castCoreSiegeAbility(player,1,{aimWorldX:1220,aimWorldY:900})).toBe(true);
    expect(events.some((event)=>event.type==='coreSiegeEffect'&&event.payload.kind==='heroAbilityCast'&&event.payload.heroId==='wolfWarrior'&&event.payload.abilitySlot===1)).toBe(true);
    expect(events.some((event)=>event.payload.kind==='heroDash'&&event.payload.dashStyle==='wolf')).toBe(true);

    room.castCoreSiegeEmp(player,220,10,1,'wave');room.castCoreSiegeEmp(player,220,10,1,'grenade');
    room.castCoreSiegePiercingBeam(player,1500,900,1,'vanguard');room.castCoreSiegePiercingBeam(player,1500,900,1,'railgun');
    expect(events.filter((event)=>event.payload.kind==='empPulse').map((event)=>event.payload.empStyle)).toEqual(['wave','grenade']);
    expect(events.filter((event)=>event.payload.kind==='piercingBeam').map((event)=>event.payload.beamStyle)).toEqual(['vanguard','railgun']);

    progress.heroId='fireEngineer';progress.ability1ReadyAt=0;progress.ability2ReadyAt=0;progress.ultimateReadyAt=0;progress.ultimateRank=1;
    expect(room.castCoreSiegeAbility(player,1,{aimWorldX:1300,aimWorldY:900})).toBe(true);
    expect(room.castCoreSiegeAbility(player,2,{aimWorldX:1300,aimWorldY:900})).toBe(true);
    expect(room.castCoreSiegeAbility(player,3,{aimWorldX:1300,aimWorldY:900})).toBe(true);
    expect(new Set([...room.state.coreSiege.devices.values()].map((device:any)=>device.kind))).toEqual(new Set(['fireCapsule','fireWall','fireStorm']));
  });

  it('makes an amplified piercing ultimate threatening without one-shotting a full-health hero',()=>{
    const {room,clock}=activeRoom(),attacker=combatant('beam-blue','blue',1000,900),target=combatant('beam-red','red',1380,900);
    room.state.players.set(attacker.id,attacker);room.state.players.set(target.id,target);
    room.coreSiegePlayer(attacker.id).heroId='vanguard';room.coreSiegePlayer(target.id).heroId='orbitalSniper';room.giveOpenArenaStarterKit(attacker);room.giveOpenArenaStarterKit(target);
    room.coreSiegePlayer(target.id).markedUntil=clock.value+2;
    const before=target.hp;room.castCoreSiegePiercingBeam(attacker,target.x,target.y,1.3*1.18,'vanguard');const damage=before-target.hp;
    expect(damage).toBeGreaterThanOrEqual(target.maxHp*.7);expect(damage).toBeLessThan(target.maxHp);
  });

  it('gives carpet bombing seven sequential impacts and a readable flight path',()=>{
    const {room,clock}=activeRoom(),demo=combatant('barrage-blue','blue',1000,900),events:Array<{type:string;payload:any}>=[];room.state.players.set(demo.id,demo);room.broadcast=(type:string,payload:any)=>events.push({type,payload});
    const progress=room.coreSiegePlayer(demo.id);progress.heroId='demolitionist';progress.level=5;progress.ultimateRank=1;
    expect(room.castCoreSiegeAbility(demo,3,{aimWorldX:1450,aimWorldY:900})).toBe(true);
    const jobs=[...room.coreSiegeAreaJobs.values()];expect(jobs).toHaveLength(7);
    expect(Math.min(...jobs.map((job:any)=>job.detonatesAt-clock.value))).toBeCloseTo(1.05);
    expect(Math.max(...jobs.map((job:any)=>job.detonatesAt))-Math.min(...jobs.map((job:any)=>job.detonatesAt))).toBeCloseTo(.96);
    expect(new Set(jobs.map((job:any)=>job.radius))).toHaveLength(1);
    expect(jobs[0]?.power).toBeCloseTo(CORE_SIEGE_CONFIG.carpetBombingPower);
    expect(jobs[0]?.radius).toBeCloseTo(CORE_SIEGE_CONFIG.grenadeRadius*CORE_SIEGE_CONFIG.carpetBombingRadiusMultiplier);
    expect(events.some((event)=>event.payload.kind==='carpetBombing'&&event.payload.bombCount===7&&event.payload.width===300)).toBe(true);
  });

  it('lets fire, drone, and RC-car attacks engage enemy lane minions',()=>{
    const {room,clock}=activeRoom(),fire=combatant('fire-blue','blue',1000,900);
    fire.angle=0;room.state.players.set(fire.id,fire);room.coreSiegePlayer(fire.id).heroId='fireEngineer';room.giveOpenArenaStarterKit(fire);room.spawnCoreSiegeWave();
    const minion=[...room.state.coreSiege.minions.values()].find((item:any)=>item.team==='red') as any;
    minion.x=1170;minion.y=900;
    const beforeFlame=minion.hp;room.fireFlamethrower(fire,room.getWeaponMagazine(fire,'flamethrower'),clock.value);
    expect(minion.hp).toBeLessThan(beforeFlame);

    const technician=combatant('tech-blue','blue',900,900);technician.angle=0;room.state.players.set(technician.id,technician);room.tacticalInventory(technician.id).hunterDroneCount=1;
    room.launchHunterDronesForPlayer(technician,undefined,1);
    const drone=[...room.state.thrownObjects.values()].find((item:any)=>item.kind==='hunterDrone');
    expect(room.hunterDroneTarget(drone)?.id).toBe(minion.id);

    const trapper=combatant('rc-blue','blue',900,900);trapper.angle=0;room.state.players.set(trapper.id,trapper);room.spawnBombRcCar(trapper);
    const rcCar=[...room.state.thrownObjects.values()].find((item:any)=>item.kind==='rcCar');
    expect(room.bombRcCarTarget(rcCar)?.id).toBe(minion.id);
  });

  it('gives AI a lane objective and keeps basic attacks flowing between abilities',()=>{
    const {room}=activeRoom(),ai=combatant('blue-ai','blue',1200,MAP_CONFIGS.coreSiege.height*CORE_SIEGE_CONFIG.laneYRatio);
    ai.ai=true;room.state.players.set(ai.id,ai);room.giveOpenArenaStarterKit(ai);
    room.spawnCoreSiegeWave();
    const intent=room.newAiIntent(ai);
    expect(room.planCoreSiegeAi(ai,intent)).toBe(true);
    expect(intent.goalKey).toMatch(/^core-siege:minion:/);
    const target=room.coreSiegeAiTargetFromIntent(intent);
    expect(target?.kind).toBe('minion');
    ai.x=target.x-180;ai.y=target.y;ai.angle=0;
    intent.mode='hold';
    room.runCoreSiegeAiObjective(ai,intent,.2);
    expect(room.state.bullets.size).toBeGreaterThan(0);
  });

  it('equips a late-joining core siege player with the selected hero starter kit',()=>{
    const {room}=activeRoom(),player=combatant('late-blue','blue',0,0);
    room.state.players.set(player.id,player);
    room.coreSiegePlayer(player.id).heroId='trapper';
    room.resetOpenArenaCombatant(player,0,false);
    room.giveOpenArenaStarterKit(player);
    expect(player.primary).toBe('shotgun');
    expect(player.secondary).toBe('pistol');
    expect(player.equipped).toBe('shotgun');
    expect(player.shotgunMagazine).toBeGreaterThan(0);
    expect(room.getAmmo(player,WEAPONS.shotgun.ammoType)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('starts at level three, then levels heroes and spends new skill points',()=>{
    const {room}=activeRoom(),player=combatant('level-blue','blue',1000,900);
    room.state.players.set(player.id,player);
    const progress=room.coreSiegePlayer(player.id);
    expect(progress).toMatchObject({level:3,xp:240,ability1Rank:2,ability2Rank:1,ultimateRank:0});
    room.awardCoreSiegeXp(player,180);
    expect(progress.level).toBe(4);
    expect(progress.skillPoints).toBe(1);
    expect(room.spendCoreSiegeSkillPoint(player,2)).toBe(true);
    expect(progress.ability2Rank).toBe(2);
    expect(progress.skillPoints).toBe(0);
  });

  it('teaches AI newly unlocked skills before improving its preferred skill',()=>{
    const {room}=activeRoom(),ai=combatant('level-ai','red',3200,900);
    ai.ai=true;room.state.players.set(ai.id,ai);
    const progress=room.coreSiegePlayer(ai.id);
    room.awardCoreSiegeXp(ai,650);
    expect(progress.level).toBe(5);
    expect(progress.skillPoints).toBe(0);
    expect(progress.ability2Rank).toBeGreaterThanOrEqual(1);
    expect(progress.ultimateRank).toBe(1);
  });

  it('initializes the rectangular battlefield with central supplies and no jungle camps',()=>{
    const {room}=activeRoom();
    expect(room.state.coreSiege.camps.size).toBe(0);
    expect(room.state.coreSiege.pickups.size).toBe(5);
    expect([...room.state.coreSiege.pickups.values()].every((pickup:any)=>pickup.y>0&&pickup.y<MAP_CONFIGS.coreSiege.height)).toBe(true);
    expect(room.state.coreSiege.nextWaveAt).toBe(105);
  });

  it('supports 2v2, 3v3, and 4v4 combatant initialization',()=>{
    for(const teamSize of [2,3,4]){
      const {room}=activeRoom();
      for(const team of ['blue','red'] as const)for(let index=0;index<teamSize;index++){
        const player=combatant(`${team}-${teamSize}-${index}`,team,team==='blue'?500:4100,760+index*70);
        player.ai=true;room.state.players.set(player.id,player);
      }
      room.initializeCoreSiege();
      expect([...room.state.players.values()].filter((player:any)=>player.team==='blue')).toHaveLength(teamSize);
      expect([...room.state.players.values()].filter((player:any)=>player.team==='red')).toHaveLength(teamSize);
      expect([...room.state.coreSiege.players.values()].every((progress:any)=>progress.level===3&&progress.ability1Rank===2&&progress.ability2Rank===1)).toBe(true);
    }
  });

  it('spreads siege AI into role-aware lane positions',()=>{
    const {room}=activeRoom(),laneY=MAP_CONFIGS.coreSiege.height*CORE_SIEGE_CONFIG.laneYRatio;
    const heroes=[['front','ironCyclone'],['support','medigel'],['back','orbitalSniper'],['flank','twinBlade']] as const;
    const players=heroes.map(([id,heroId])=>{const ai=combatant(id,'blue',900,laneY);ai.ai=true;room.state.players.set(ai.id,ai);room.coreSiegePlayer(ai.id).heroId=heroId;return ai;});
    const offsets=players.map((player:any)=>room.coreSiegeAiFormationOffset(player));
    expect(new Set(offsets)).toHaveLength(4);expect(Math.min(...offsets)).toBeLessThan(0);expect(Math.max(...offsets)).toBeGreaterThan(0);
    expect(room.coreSiegeAiRangeMultiplier(players[0])).toBeLessThan(1);
    expect(room.coreSiegeAiRangeMultiplier(players[1])).toBeGreaterThan(1);

    room.spawnCoreSiegeWave();
    const goals=players.map((player:any)=>{const intent=room.newAiIntent(player);room.planCoreSiegeAi(player,intent);return intent.routeGoalY;});
    expect(new Set(goals.map((value:number)=>Math.round(value)))).toHaveLength(4);
  });

  it('evades enemy siege hazards and spaces team ultimate casts',()=>{
    const {room,clock}=activeRoom(),blue=combatant('hazard-blue','blue',1000,900),red=combatant('hazard-red','red',1060,900);
    blue.ai=true;red.ai=true;room.state.players.set(blue.id,blue);room.state.players.set(red.id,red);
    room.coreSiegeAreaJobs.set('danger',{id:'danger',ownerId:red.id,kind:'grenade',x:blue.x,y:blue.y,radius:180,detonatesAt:clock.value+.5,expiresAt:clock.value+2,nextTickAt:0,power:1,damageGroup:'grenade'});
    expect(room.coreSiegeHazardForAi(blue)?.id).toBe('danger');
    const intent=room.newAiIntent(blue);room.planAi(blue,intent);
    expect(intent.state).toBe('EVADE_SIEGE_SKILL');expect(intent.mode).toBe('retreat');

    expect(room.coreSiegeAiUltimateAvailable(blue,clock.value)).toBe(true);
    room.reserveCoreSiegeAiUltimate(blue,clock.value);
    expect(room.coreSiegeAiUltimateAvailable(blue,clock.value+1)).toBe(false);
    clock.value+=CORE_SIEGE_CONFIG.aiUltimateTeamLockSeconds+.1;
    expect(room.coreSiegeAiUltimateAvailable(blue,clock.value)).toBe(true);
  });

  it('fills both teams with the configured core siege AI roster',()=>{
    const {room}=activeRoom();
    room.openArenaConfig=normalizeOpenArenaConfig(6,5,0);
    room.teamAiBlue=2;room.teamAiRed=3;
    room.fillOpenArenaAi();
    const ai=[...room.state.players.values()].filter((player:any)=>player.ai);
    expect(ai.filter((player:any)=>player.team==='blue')).toHaveLength(2);
    expect(ai.filter((player:any)=>player.team==='red')).toHaveLength(3);
    expect(ai.every((player:any)=>CORE_SIEGE_HERO_IDS.includes(room.coreSiegePlayer(player.id).heroId))).toBe(true);
  });

  it('lets medigel heal flesh but not an active robot',()=>{
    const {room}=activeRoom(),medic=combatant('medic','blue',1000,900),ally=combatant('ally','blue',1180,900);
    medic.angle=0;ally.hp=50;room.state.players.set(medic.id,medic);room.state.players.set(ally.id,ally);
    room.coreSiegePlayer(medic.id).heroId='medigel';room.giveOpenArenaStarterKit(medic);
    room.fireCoreSiegeMedigel(medic,room.now());
    expect(ally.hp).toBeGreaterThan(50);
    const healed=ally.hp;room.tacticalInventory(ally.id).exoActive=true;
    room.fireCoreSiegeMedigel(medic,room.now()+.2);
    expect(ally.hp).toBe(healed);
  });

  it('fires medigel through the real input path without an adhesive magazine',()=>{
    const {room}=activeRoom(),medic=combatant('medic-input','blue',1000,900),ally=combatant('ally-input','blue',1180,900),events:Array<{type:string;payload:any}>=[];
    medic.angle=0;ally.hp=50;room.state.players.set(medic.id,medic);room.state.players.set(ally.id,ally);room.coreSiegePlayer(medic.id).heroId='medigel';room.giveOpenArenaStarterKit(medic);room.setWeaponMagazine(medic,'adhesive_sprayer',0);room.broadcast=(type:string,payload:any)=>events.push({type,payload});
    room.firePlayer(medic);
    expect(ally.hp).toBeGreaterThan(50);expect(room.coreSiegePlayer(medic.id).medicalGel).toBeLessThan(CORE_SIEGE_CONFIG.medicalGelMax);expect(events.some((event)=>event.payload.kind==='medigelHeal')).toBe(true);
  });

  it('activates both pilot robots and hides pilot abilities while mounted',()=>{
    for(const [heroId,kind] of [['steelPilot','assault'],['empPilot','emp']] as const){
      const {room}=activeRoom(),pilot=combatant(`${heroId}-pilot`,'blue',1000,900);
      room.state.players.set(pilot.id,pilot);
      const progress=room.coreSiegePlayer(pilot.id);progress.heroId=heroId;progress.level=5;progress.ultimateRank=1;
      expect(room.castCoreSiegeAbility(pilot,3,{aimWorldX:1400,aimWorldY:900})).toBe(true);
      expect(room.tacticalInventory(pilot.id)).toMatchObject({exoActive:true,exoKind:kind});
      expect(room.castCoreSiegeAbility(pilot,1,{aimWorldX:1400,aimWorldY:900})).toBe(false);
    }
  });

  it('gives the iron cyclone a three-hit cleave and a capped moving spin',()=>{
    const {room,clock}=activeRoom(),iron=combatant('iron-blue','blue',1000,900),front=combatant('front-red','red',1080,900),side=combatant('side-red','red',1080,950);
    iron.angle=0;room.state.players.set(iron.id,iron);room.state.players.set(front.id,front);room.state.players.set(side.id,side);
    const progress=room.coreSiegePlayer(iron.id);progress.heroId='ironCyclone';room.giveOpenArenaStarterKit(iron);
    room.meleePlayer(iron);clock.value+=.5;room.meleePlayer(iron);expect(side.hp).toBe(100);clock.value+=.5;const beforeFinisherX=iron.x;room.meleePlayer(iron);
    expect(room.coreSiegeMeleeCombos.get(iron.id).step).toBe(3);expect(side.hp).toBeLessThan(100);expect(iron.x).toBeGreaterThan(beforeFinisherX);

    room.spawnCoreSiegeWave();const minion=[...room.state.coreSiege.minions.values()].find((item:any)=>item.team==='red') as any;minion.x=iron.x+80;minion.y=iron.y;
    const before=minion.hp;expect(room.castCoreSiegeAbility(iron,1,{aimWorldX:minion.x,aimWorldY:minion.y})).toBe(true);room.updateCoreSiegeIronSpins();
    expect(progress.spinUntil).toBeGreaterThan(clock.value);expect(minion.hp).toBeLessThan(before);
  });

  it('charges earth hammer attacks, leaves a breakable stake, and lands instead of teleporting',()=>{
    const {room,clock}=activeRoom(),hammer=combatant('hammer-blue','blue',2100,900),enemy=combatant('hammer-red','red',2240,900);
    hammer.angle=0;room.state.players.set(hammer.id,hammer);room.state.players.set(enemy.id,enemy);room.spawnCoreSiegeWave();
    const minion=[...room.state.coreSiege.minions.values()].find((item:any)=>item.team==='red') as any;minion.x=2200;minion.y=950;
    const progress=room.coreSiegePlayer(hammer.id);progress.heroId='earthHammer';progress.level=5;progress.ultimateRank=1;room.giveOpenArenaStarterKit(hammer);
    expect(hammer.maxHp).toBe(190);expect(hammer.hp).toBe(190);
    const enemyBefore=enemy.hp,minionBefore=minion.hp;
    expect(room.castCoreSiegeAbility(hammer,1,{aimWorldX:2300,aimWorldY:900,chargeSeconds:1.2})).toBe(true);
    expect(enemy.hp).toBeLessThan(enemyBefore);expect(minion.hp).toBeLessThan(minionBefore);
    expect(room.castCoreSiegeAbility(hammer,2,{aimWorldX:2380,aimWorldY:900})).toBe(true);
    expect([...room.state.coreSiege.devices.values()].some((device:any)=>device.kind==='seismicStake'&&device.hp>0)).toBe(true);
    const startX=hammer.x;expect(room.castCoreSiegeAbility(hammer,3,{aimWorldX:2460,aimWorldY:900})).toBe(true);expect(hammer.x).toBe(startX);
    clock.value+=.1;room.updateCoreSiegeDashes();expect(hammer.x).toBeGreaterThan(startX);expect(hammer.x).toBeLessThan(2460);
    clock.value+=.4;room.updateCoreSiegeDashes();expect(room.coreSiegeDashJobs.size).toBe(0);
  });

  it('pulls a chain target safely, stakes the combo target, and resolves a delayed execution zone',()=>{
    const {room,clock}=activeRoom(),chain=combatant('chain-blue','blue',2100,900),enemy=combatant('chain-red','red',2420,900),events:Array<{type:string;payload:any}>=[];
    chain.angle=0;room.state.players.set(chain.id,chain);room.state.players.set(enemy.id,enemy);
    const progress=room.coreSiegePlayer(chain.id);progress.heroId='chainExecutioner';progress.level=5;progress.ultimateRank=1;room.giveOpenArenaStarterKit(chain);
    room.broadcast=(type:string,payload:any)=>events.push({type,payload});
    const oldX=enemy.x;expect(room.castCoreSiegeAbility(chain,1,{aimWorldX:2550,aimWorldY:900})).toBe(true);
    expect(enemy.x).toBe(oldX);expect(events.some((event)=>event.payload.kind==='chainHook'&&event.payload.phase==='flight')).toBe(true);
    clock.value+=.21;room.updateCoreSiegeChainPulls();expect(events.some((event)=>event.payload.kind==='chainLatch')).toBe(true);expect(enemy.x).toBe(oldX);
    clock.value+=.25;room.updateCoreSiegeChainPulls();expect(enemy.x).toBeLessThan(oldX);expect(enemy.x).toBeGreaterThan(chain.x+80);
    clock.value+=.3;room.updateCoreSiegeChainPulls();expect(Math.hypot(enemy.x-chain.x,enemy.y-chain.y)).toBeLessThanOrEqual(85);expect(progress.meleeChaseUntil).toBeGreaterThan(100);
    expect(events.some((event)=>event.payload.kind==='chainPull')).toBe(true);expect(events.some((event)=>event.payload.kind==='chainPullEnd')).toBe(true);
    expect(room.castCoreSiegeAbility(chain,2,{aimWorldX:chain.x,aimWorldY:chain.y})).toBe(true);
    expect(enemy.werewolf.actionLockedUntil).toBeGreaterThan(clock.value);expect(events.some((event)=>event.payload.kind==='chainStake')).toBe(true);expect(events.some((event)=>event.payload.kind==='stunApplied'&&event.payload.targetId===enemy.id)).toBe(true);
    const before=enemy.hp;expect(room.castCoreSiegeAbility(chain,3,{aimWorldX:enemy.x,aimWorldY:enemy.y})).toBe(true);
    const stake=[...room.state.coreSiege.devices.values()].find((device:any)=>device.kind==='executionStake') as any;expect(stake).toBeTruthy();
    clock.value=stake.expiresAt+.01;room.updateCoreSiegeDevices(.1);
    expect(enemy.hp).toBeLessThan(before);expect(room.state.coreSiege.devices.has(stake.id)).toBe(false);
  });

  it('keeps three distinct melee combo beats for every custom melee hero',()=>{
    for(const [heroId,effectKind] of [['ironCyclone','ironSlash'],['earthHammer','earthHammerSwing'],['chainExecutioner','chainScytheSwing'],['twinBlade','twinBladeSlash']] as const){
      const {room,clock}=activeRoom(),hero=combatant(`${heroId}-blue`,'blue',2100,900),enemy=combatant(`${heroId}-red`,'red',2180,900),events:Array<{type:string;payload:any}>=[];
      hero.angle=0;room.state.players.set(hero.id,hero);room.state.players.set(enemy.id,enemy);room.coreSiegePlayer(hero.id).heroId=heroId;room.giveOpenArenaStarterKit(hero);room.broadcast=(type:string,payload:any)=>events.push({type,payload});
      for(let hit=0;hit<3;hit++){room.meleePlayer(hero);clock.value+=CORE_SIEGE_BASIC_ATTACKS[heroId].fireInterval+.01;}
      expect(events.filter((event)=>event.payload.kind===effectKind).map((event)=>event.payload.combo)).toEqual([1,2,3]);
    }
  });

  it('runs twin-blade paths in segments and parries exactly one close attack',()=>{
    const {room,clock}=activeRoom(),blade=combatant('blade-blue','blue',2100,900),enemy=combatant('blade-red','red',2220,900);
    blade.angle=0;room.state.players.set(blade.id,blade);room.state.players.set(enemy.id,enemy);
    const progress=room.coreSiegePlayer(blade.id);progress.heroId='twinBlade';progress.level=5;progress.ultimateRank=1;room.giveOpenArenaStarterKit(blade);
    const startX=blade.x;expect(room.castCoreSiegeAbility(blade,1,{aimWorldX:2420,aimWorldY:900})).toBe(true);expect(blade.x).toBe(startX);
    clock.value+=.1;room.updateCoreSiegeDashes();expect(blade.x).not.toBe(startX);
    for(let step=0;step<4&&room.coreSiegeDashJobs.size;step++){clock.value+=.3;room.updateCoreSiegeDashes();}
    expect(room.coreSiegeDashJobs.size).toBe(0);
    enemy.x=blade.x+80;enemy.y=blade.y;const hpBefore=blade.hp,enemyBefore=enemy.hp,qReadyBefore=progress.ability1ReadyAt;
    expect(room.castCoreSiegeAbility(blade,2,{aimWorldX:enemy.x,aimWorldY:enemy.y})).toBe(true);
    room.damage(blade,35,enemy.id,'총기',0,0,'bullet');expect(blade.hp).toBe(hpBefore);expect(enemy.hp).toBeLessThan(enemyBefore);expect(progress.ability1ReadyAt).toBeLessThan(qReadyBefore);
    const shieldBefore=progress.temporaryShield;room.damage(blade,10,enemy.id,'총기',0,0,'bullet');expect(progress.temporaryShield).toBeLessThan(shieldBefore);expect(blade.hp).toBe(hpBefore);
    room.damage(blade,40,enemy.id,'총기',0,0,'bullet');expect(blade.hp).toBeLessThan(hpBefore);
    expect(room.castCoreSiegeAbility(blade,3,{aimWorldX:blade.x+460,aimWorldY:blade.y})).toBe(true);expect(room.coreSiegeDashJobs.get(blade.id).remaining).toHaveLength(2);
  });

  it('caps gearlings, obeys summon orders, and creates one scrap giant',()=>{
    const {room,clock}=activeRoom(),summoner=combatant('summoner-blue','blue',1000,900),enemy=combatant('summon-red','red',1110,900),events:Array<{type:string;payload:any}>=[];
    summoner.angle=0;room.state.players.set(summoner.id,summoner);room.state.players.set(enemy.id,enemy);const progress=room.coreSiegePlayer(summoner.id);progress.heroId='scrapSummoner';progress.level=5;progress.ultimateRank=1;room.broadcast=(type:string,payload:any)=>events.push({type,payload});
    expect(room.castCoreSiegeAbility(summoner,1,{aimWorldX:1100,aimWorldY:900})).toBe(true);
    expect([...room.state.coreSiege.devices.values()].filter((device:any)=>device.kind==='gearling')).toHaveLength(2);
    expect(room.spawnCoreSiegeSummon(summoner,'gearling',1,2)).toBe(true);
    expect(room.spawnCoreSiegeSummon(summoner,'gearling',1,2)).toBe(false);
    expect([...room.state.coreSiege.devices.values()].filter((device:any)=>device.kind==='gearling')).toHaveLength(CORE_SIEGE_CONFIG.summonPerHeroLimit);
    expect(events.filter((event)=>event.payload.kind==='summonAssemble'&&event.payload.deviceKind==='gearling')).toHaveLength(4);
    expect(new Set([...room.state.coreSiege.devices.values()].filter((device:any)=>device.kind==='gearling').map((device:any)=>`${Math.round(device.x)},${Math.round(device.y)}`)).size).toBe(4);
    expect(room.castCoreSiegeAbility(summoner,2,{aimWorldX:enemy.x,aimWorldY:enemy.y})).toBe(true);expect(room.coreSiegeSummonOrders.get(summoner.id).targetId).toBe(enemy.id);
    clock.value+=.4;room.updateCoreSiegeDevices(.1);expect(enemy.hp).toBeLessThan(100);
    expect(room.castCoreSiegeAbility(summoner,3,{aimWorldX:enemy.x,aimWorldY:enemy.y})).toBe(true);expect([...room.state.coreSiege.devices.values()].filter((device:any)=>device.kind==='scrapGiant')).toHaveLength(1);expect(events.some((event)=>event.payload.kind==='summonAssemble'&&event.payload.deviceKind==='scrapGiant')).toBe(true);
  });

  it('runs gravity control, sonic support, and smoke tracking as distinct systems',()=>{
    const gravityMatch=activeRoom(),gravity=combatant('gravity-blue','blue',1000,900),gravityEnemy=combatant('gravity-red','red',1140,900);gravity.angle=0;gravityMatch.room.state.players.set(gravity.id,gravity);gravityMatch.room.state.players.set(gravityEnemy.id,gravityEnemy);const gravityProgress=gravityMatch.room.coreSiegePlayer(gravity.id);gravityProgress.heroId='gravityWarden';
    const oldX=gravityEnemy.x;expect(gravityMatch.room.castCoreSiegeAbility(gravity,2,{aimWorldX:gravityEnemy.x,aimWorldY:gravityEnemy.y})).toBe(true);expect(gravityEnemy.x).toBeGreaterThan(oldX);expect(gravityEnemy.hp).toBeLessThan(100);

    const sonicMatch=activeRoom(),sonic=combatant('sonic-blue','blue',1000,900),ally=combatant('sonic-ally','blue',1050,900),sonicEnemy=combatant('sonic-red','red',1120,900);sonic.angle=0;sonicMatch.room.state.players.set(sonic.id,sonic);sonicMatch.room.state.players.set(ally.id,ally);sonicMatch.room.state.players.set(sonicEnemy.id,sonicEnemy);const sonicProgress=sonicMatch.room.coreSiegePlayer(sonic.id);sonicProgress.heroId='sonicCommander';sonicProgress.level=5;sonicProgress.ultimateRank=1;
    expect(sonicMatch.room.castCoreSiegeAbility(sonic,2,{aimWorldX:sonic.x,aimWorldY:sonic.y})).toBe(true);expect(sonicMatch.room.coreSiegePlayer(ally.id).marchUntil).toBeGreaterThan(sonicMatch.clock.value);
    expect(sonicMatch.room.castCoreSiegeAbility(sonic,3,{aimWorldX:sonicEnemy.x,aimWorldY:sonicEnemy.y})).toBe(true);sonicMatch.room.updateCoreSiegeWaves(.15);expect(sonicEnemy.hp).toBeLessThan(100);

    const smokeMatch=activeRoom(),tracker=combatant('smoke-blue','blue',1000,900),smokeEnemy=combatant('smoke-red','red',1260,900);tracker.angle=0;smokeMatch.room.state.players.set(tracker.id,tracker);smokeMatch.room.state.players.set(smokeEnemy.id,smokeEnemy);const smokeProgress=smokeMatch.room.coreSiegePlayer(tracker.id);smokeProgress.heroId='smokeTracker';smokeProgress.level=5;smokeProgress.ultimateRank=1;
    expect(smokeMatch.room.castCoreSiegeAbility(tracker,2,{aimWorldX:1200,aimWorldY:900})).toBe(true);expect(smokeMatch.room.state.smokeFields.size).toBe(1);
    expect(smokeMatch.room.castCoreSiegeAbility(tracker,3,{aimWorldX:smokeEnemy.x,aimWorldY:smokeEnemy.y})).toBe(true);expect(smokeMatch.room.coreSiegeHuntMarks.get(tracker.id)?.targetId).toBe(smokeEnemy.id);
  });

  it('defines every planned hero for the AI roster',()=>{
    expect(CORE_SIEGE_HERO_IDS).toHaveLength(20);
    const {room}=activeRoom();
    const assigned=CORE_SIEGE_HERO_IDS.map((heroId,index)=>{
      const ai=combatant(`hero-${index}`,index%2?'red':'blue',900+index*230,900);ai.ai=true;room.state.players.set(ai.id,ai);
      room.coreSiegePlayer(ai.id).heroId=heroId;
      return room.coreSiegePlayer(ai.id).heroId;
    });
    expect(new Set(assigned).size).toBe(20);
  });

  it('keeps the skill inspection lab host-only and uses real siege actions',()=>{
    const {room}=activeRoom(),host=combatant('lab-host','blue',2100,900),send=vi.fn();host.host=true;room.state.players.set(host.id,host);room.coreSiegePlayer(host.id).heroId='vanguard';
    const client={sessionId:host.id,send};expect(room.coreSiegeSkillLab(client,{action:'targets'})).toBe(false);expect(room.state.players.has('siege-lab-enemy')).toBe(false);
    vi.stubEnv('DROP8_TEST_CHEATS','1');expect(room.coreSiegeSkillLab(client,{action:'targets'})).toBe(true);expect(room.state.players.has('siege-lab-enemy')).toBe(true);expect(room.state.coreSiege.minions.has('siege-lab-minion')).toBe(true);
    expect(room.coreSiegeSkillLab(client,{action:'hero',heroId:'medigel'})).toBe(true);expect(room.coreSiegePlayer(host.id)).toMatchObject({heroId:'medigel',level:10,ultimateRank:1});
    expect(room.coreSiegeSkillLab(client,{action:'basic'})).toBe(true);expect(room.coreSiegeSkillLab(client,{action:'cast',slot:3})).toBe(true);vi.unstubAllEnvs();
  });

  it('keeps the public hero practice path separate from test cheats',()=>{
    const {room}=activeRoom(),host=combatant('practice-host','blue',2040,900),target=combatant('core-siege-practice-target','red',2560,900);host.host=true;target.ai=true;room.practiceMode=true;room.state.players.set(host.id,host);room.state.players.set(target.id,target);room.coreSiegePlayer(host.id).heroId='vanguard';room.coreSiegePlayer(target.id).heroId='vanguard';
    const client={sessionId:host.id,send:vi.fn()};expect(room.coreSiegePractice(client,{action:'hero',heroId:'medigel'})).toBe(true);expect(room.coreSiegePlayer(host.id).heroId).toBe('medigel');expect(room.coreSiegePractice(client,{action:'targetMode',mode:'move'})).toBe(true);expect(room.practiceTargetMode).toBe('move');expect(room.coreSiegePractice(client,{action:'basic'})).toBe(true);
  });
});

const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
const main=readFileSync(fileURLToPath(new URL('../../client/src/main.ts',import.meta.url)),'utf8');
const network=readFileSync(fileURLToPath(new URL('../../client/src/network.ts',import.meta.url)),'utf8');
const style=readFileSync(fileURLToPath(new URL('../../client/src/style.css',import.meta.url)),'utf8');
describe('Refactor 064 core siege client controls',()=>{
  it('uses select, guide, and ground-confirm input without replacing sustained basic fire',()=>{
    expect(scene).toContain('beginCoreSiegeTargeting');
    expect(scene).toContain('confirmCoreSiegeAbility');
    expect(scene).toContain("this.net.send('useCoreSiegeAbility'");
    expect(scene).toContain('drawCoreSiegeAbilityGuide');
    expect(scene).toContain("this.net.send(empExo?'empExoMachineGun'");
  });

  it('renders structures, minions, supplies, devices, cooldowns, and mobile skill buttons',()=>{
    expect(scene).toContain('drawCoreSiegeSlow');
    expect(scene).toContain('drawCoreSiegeDynamic');
    expect(scene).toContain('siege.pickups');
    expect(scene).toContain('siege.devices');
    expect(main).toContain('renderCoreSiegeHud');
    expect(main).toContain('mobileSiegeSkills');
    expect(main).toContain('mobileSiegeSkill${index+1}');
    expect(main).toContain("$('inventoryHud').append(coreSiegeSkills)");
    expect(main).toContain("$<HTMLSelectElement>('lobbyTeamAiBlue').value='2'");
    expect(main).toContain("$<HTMLSelectElement>('lobbyTeamAiRed').value='3'");
    expect(network).toContain('coreSiege.pickups=this.syncCollection');
    expect(network).toContain('coreSiege.devices=this.syncCollection');
    expect(main).toContain("siege?'∞'");
  });

  it('renders hero-specific ability signatures instead of recolored shared circles',()=>{
    expect(scene).toContain('drawCoreSiegeAbilityCast');
    expect(scene).toContain("effect.kind==='heroAbilityCast'");
    for(const heroId of CORE_SIEGE_HERO_IDS)expect(scene).toContain(`case '${heroId}'`);
    for(const style of ['fireCapsule','fireWall','fireStorm','wave','grenade','vanguard','railgun','wolf','shield','steel'])expect(scene).toContain(style);
    for(const heroId of ['earthHammer','chainExecutioner','twinBlade'])expect(style).toContain(`[data-hero=${heroId}]`);
    for(const effect of ['hammerSlam','chainHook','bladeParry'])expect(scene).toContain(effect);
    expect(main).toContain('profile.displayName');
    expect(scene).toContain('bodyX+=Math.cos(visualAngle)*lunge');expect(scene).toContain('attackProgress,attackSeq');
    for(const effect of ['lifeSupportDeploy','droneFormation','executionZone','ironRampage','sonicWave'])expect(scene).toContain(effect);
    expect(scene).toContain('linkedTargetIds');expect(scene).toContain("Number(payload?.abilitySlot)===3");
    expect(main).toContain("get('siegeSkillLab')==='1'");expect(main).toContain("net.send('coreSiegeSkillLab'");expect(scene).toContain('coreSiegeSkillLabRate');
  });

  it('rotates the iron cyclone body details while its spin is active',()=>{
    expect(scene).toContain("siegeHeroId==='ironCyclone'&&Number(p.spinUntil");
    expect(scene).toContain('this.drawCoreSiegeHeroDetails(g,siegeHeroId,bodyX,bodyY,detailAngle');
  });

  it('renders distinct damage, shield, stun, and slow combat feedback',()=>{
    expect(scene).toContain('drawPlayerHealthBar');
    expect(scene).toContain('drawCoreSiegeCombatStatus');
    expect(scene).toContain("effect.kind==='meleeGuard'||effect.kind==='deathGuard'");
    expect(scene).toContain('sourceAngle=this.localHitAngle+Math.PI');
  });

  it('exposes the public hero laboratory and real practice controls',()=>{
    expect(main).toContain("heroLabButton.id='heroLabBtn'");expect(main).toContain("practiceMode:true");expect(main).toContain("net.send('coreSiegePractice'");expect(main).toContain('hero.abilityDescriptions');expect(network).toContain('practiceMode?:boolean');
    for(const effect of ['siegeProjectile','siegeProjectileHit','carpetBombing','shieldBlock','stunApplied','chainStake'])expect(scene).toContain(effect);
  });
});
