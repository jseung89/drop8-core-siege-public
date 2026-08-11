// DROP8_REFACTOR_052_AI_ROLE_BRAIN
import { describe,expect,it } from 'vitest';
import { HUNTER_DRONE_BALANCE, MAP_CONFIGS } from '@drop8/shared';
import { aiRolePlan, aiRoleResourceBonus } from '../src/rooms/aiRoleBrain.js';
import { createAiTacticalMemory, decideAiTacticalAction, type AiTacticalDecisionInput } from '../src/rooms/aiTacticalBrain.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { LootState, MotorcycleState, PlayerState } from '../src/rooms/schema.js';

describe('Refactor 052 AI role brain',()=>{
  it('gives each role a materially different battlefield contract',()=>{
    expect(aiRolePlan('aggressive').combatRangeMultiplier).toBeLessThan(1);
    expect(aiRolePlan('cautious').combatRangeMultiplier).toBeGreaterThan(1);
    expect(aiRolePlan('driver').vehicleMinimumTripDistance).toBeLessThan(aiRolePlan('aggressive').vehicleMinimumTripDistance);
    expect(aiRoleResourceBonus('scavenger','robot')).toBeGreaterThan(aiRoleResourceBonus('aggressive','robot'));
    expect(aiRoleResourceBonus('support','tactical')).toBeGreaterThan(aiRoleResourceBonus('driver','tactical'));
  });

  it('makes aggressive AI lead with a grenade while cautious AI blocks pursuit',()=>{
    const base:AiTacticalDecisionInput={now:10,targetId:'enemy',distance:300,targetMounted:false,targetMechanical:false,targetClosing:false,recentlyDamaged:false,selfHp:100,outnumberedBy:0,reloading:false,hunterDroneCount:0,spiderMineCount:1,stripTrapCount:0,throwableType:'fragGrenade',throwableCount:1,ownActiveMines:0,ownActiveStripTraps:0,personality:'aggressive',aggression:.8,riskAvoidance:.2,droneSearchRadius:HUNTER_DRONE_BALANCE.searchRadius,fragSafeDistance:160};
    expect(decideAiTacticalAction(createAiTacticalMemory(),base).action).toBe('throw_frag');
    expect(decideAiTacticalAction(createAiTacticalMemory(),{...base,personality:'cautious',aggression:.3,riskAvoidance:.8}).action).toBe('place_spider_mine');
  });
});

function makeRoom(){
  const room=new Drop8Room() as any,map={...MAP_CONFIGS.small,collisionObstacles:[],bulletObstacles:[],visibilityObstacles:[],buildingVisibilityZones:[],rooms:[],portals:[],rivers:[],landCrossings:[],shallowWaterZones:[],bushes:[],propObstacles:[],obstacles:[]};
  Object.defineProperty(room,'map',{value:map});room.now=()=>10;room.state.phase='ACTIVE';room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=map.width;return room;
}

function vehiclePlanFor(personality:'aggressive'|'driver'){
  const room=makeRoom(),p=new PlayerState();p.id=`${personality}-ai`;p.name=p.id;p.ai=true;p.alive=true;p.phase='landed';p.x=600;p.y=600;p.hp=100;p.equipped='pistol';p.secondary='pistol';p.pistolMagazine=8;p.pistolAmmo=24;room.state.players.set(p.id,p);room.ensureAiProfile(p).personality=personality;
  const target=new LootState();target.id='loot';target.kind='standard_ammo';target.x=1150;target.y=600;room.state.loot.set(target.id,target);
  const bike=new MotorcycleState();bike.id='bike';bike.vehicleKind='motorcycle';bike.x=650;bike.y=600;bike.hp=180;bike.maxHp=180;room.state.motorcycles.set(bike.id,bike);
  const intent=room.newAiIntent(p);intent.lootId=target.id;return room.maybeStartAiVehiclePlan(p,intent);
}

describe('Refactor 052 role integration',()=>{
  it('lets the driver use a vehicle for a medium trip without making every role mount it',()=>{
    expect(vehiclePlanFor('driver')).toBe(true);
    expect(vehiclePlanFor('aggressive')).toBe(false);
  });
});
