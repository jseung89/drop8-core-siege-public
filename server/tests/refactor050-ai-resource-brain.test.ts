// DROP8_REFACTOR_050_AI_RESOURCE_BRAIN
import { describe,expect,it } from 'vitest';
import { MAP_CONFIGS, TANK_BALANCE } from '@drop8/shared';
import { aiResourceTargetCommitment, chooseAiResourceFocus, commitAiResourceTarget, createAiResourceMemory, scoreAiResourceCandidate, scoreAiSupplyObjective, type AiResourceContext } from '../src/rooms/aiResourceBrain.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { LootState, MotorcycleState, PlayerState } from '../src/rooms/schema.js';

const context:AiResourceContext={now:10,hp:100,armor:70,hasUsableGun:true,combatReady:true,ammoRatio:.8,healingCount:2,robotParts:0,closestRobotSetParts:0,hasTankKey:false,tankAvailable:true,tacticalCount:3,lootPreference:.5,riskAvoidance:.5};

describe('Refactor 050 AI resource brain',()=>{
  it('holds a loadout focus but lets survival emergencies interrupt it',()=>{
    const memory=createAiResourceMemory();
    expect(chooseAiResourceFocus(memory,{...context,closestRobotSetParts:2,robotParts:2})).toBe('robot');
    expect(chooseAiResourceFocus(memory,{...context,now:11,ammoRatio:.2})).toBe('robot');
    expect(chooseAiResourceFocus(memory,{...context,now:11.1,hp:35,healingCount:0})).toBe('healing');
  });

  it('reduces dangerous detours unless the resource is urgent',()=>{
    const base={baseScore:100,distance:300,category:'weapon' as const,focus:'weapon' as const,zoneRisk:50,enemyRisk:45,routeRisk:20,dangerRisk:30,competition:0,commitmentBonus:0,lootPreference:.5,riskAvoidance:.7};
    const safe=scoreAiResourceCandidate({...base,zoneRisk:0,enemyRisk:0,routeRisk:0,dangerRisk:0,urgent:false});
    const risky=scoreAiResourceCandidate({...base,urgent:false});
    const emergency=scoreAiResourceCandidate({...base,urgent:true});
    expect(safe).toBeGreaterThan(emergency);expect(emergency).toBeGreaterThan(risky);
  });

  it('commits to one pickup and values supply more when the loadout is incomplete',()=>{
    const memory=createAiResourceMemory();commitAiResourceTarget(memory,'rifle-a','weapon',10);
    expect(aiResourceTargetCommitment(memory,'rifle-a','weapon',11)).toBeGreaterThan(aiResourceTargetCommitment(memory,'rifle-b','weapon',11));
    expect(scoreAiSupplyObjective({...context,hasUsableGun:false,combatReady:false,ammoRatio:0},600,0,0)).toBeGreaterThan(scoreAiSupplyObjective(context,600,0,0));
  });
});

function makeRoom(){
  const room=new Drop8Room() as any,map={...MAP_CONFIGS.small,collisionObstacles:[],bulletObstacles:[],visibilityObstacles:[],buildingVisibilityZones:[],rooms:[],portals:[],rivers:[],landCrossings:[],shallowWaterZones:[],bushes:[],propObstacles:[],obstacles:[]};
  Object.defineProperty(room,'map',{value:map});room.now=()=>10;room.state.phase='ACTIVE';room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=map.width;return room;
}

function ai(){const p=new PlayerState();p.id='resource-ai';p.name='resource-ai';p.ai=true;p.alive=true;p.phase='landed';p.x=600;p.y=600;p.hp=100;p.equipped='fists';p.melee='fists';return p;}
function loot(id:string,kind:string,x:number,y=600){const item=new LootState();item.id=id;item.kind=kind;item.x=x;item.y=y;return item;}

describe('Refactor 050 resource integration',()=>{
  it('crosses a reasonable detour for a gun before collecting nearby optional gear',()=>{
    const room=makeRoom(),p=ai(),mine=loot('near-mine','spider_mine',680),rifle=loot('far-rifle','rifle',1080);room.state.players.set(p.id,p);room.state.loot.set(mine.id,mine);room.state.loot.set(rifle.id,rifle);
    expect(room.findBestLoot(p)?.id).toBe(rifle.id);
    expect(room.aiResourceBrains.get(p.id).focus).toBe('weapon');
  });

  it('finishes a nearly complete robot set and ignores a key with no usable tank',()=>{
    const room=makeRoom(),p=ai();p.secondary='pistol';p.equipped='pistol';p.pistolMagazine=8;p.pistolAmmo=24;const tactical=room.tacticalInventory(p.id);tactical.exoHeadCount=1;tactical.exoLimbsCount=1;const core=loot('core','exo_core',900),vest=loot('vest','vest',690);room.state.players.set(p.id,p);room.state.loot.set(core.id,core);room.state.loot.set(vest.id,vest);
    expect(room.findBestLoot(p)?.id).toBe(core.id);expect(room.aiLootScore(p,'tank_key')).toBe(0);
    const tank=new MotorcycleState();tank.id='tank';tank.vehicleKind='tank';tank.x=1200;tank.y=600;tank.hp=TANK_BALANCE.maxHp;tank.maxHp=TANK_BALANCE.maxHp;room.state.motorcycles.set(tank.id,tank);
    expect(room.aiLootScore(p,'tank_key')).toBeGreaterThan(0);
  });
});
