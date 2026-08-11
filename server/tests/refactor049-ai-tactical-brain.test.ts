// DROP8_REFACTOR_049_AI_TACTICAL_BRAIN
import { describe,expect,it,vi } from 'vitest';
import { HUNTER_DRONE_BALANCE, MAP_CONFIGS } from '@drop8/shared';
import { createAiTacticalMemory, decideAiTacticalAction, recordAiTacticalAction, type AiTacticalDecisionInput } from '../src/rooms/aiTacticalBrain.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { MotorcycleState, PlayerState } from '../src/rooms/schema.js';

const baseInput:AiTacticalDecisionInput={now:10,targetId:'target',distance:300,targetMounted:false,targetMechanical:false,targetClosing:false,recentlyDamaged:false,selfHp:100,outnumberedBy:0,reloading:false,hunterDroneCount:0,spiderMineCount:0,stripTrapCount:0,throwableType:'',throwableCount:0,ownActiveMines:0,ownActiveStripTraps:0,personality:'support',aggression:.5,riskAvoidance:.5,droneSearchRadius:HUNTER_DRONE_BALANCE.searchRadius,fragSafeDistance:160};

describe('Refactor 049 AI tactical brain',()=>{
  it('uses smoke for survival and traps for the threat each one counters',()=>{
    expect(decideAiTacticalAction(createAiTacticalMemory(),{...baseInput,selfHp:40,reloading:true,throwableType:'smokeGrenade',throwableCount:1}).action).toBe('throw_smoke');
    expect(decideAiTacticalAction(createAiTacticalMemory(),{...baseInput,targetMounted:true,targetMechanical:true,stripTrapCount:1}).action).toBe('place_strip_trap');
    expect(decideAiTacticalAction(createAiTacticalMemory(),{...baseInput,targetClosing:true,recentlyDamaged:true,spiderMineCount:1}).action).toBe('place_spider_mine');
  });

  it('keeps drone reserves and applies per-action cooldown contracts',()=>{
    const memory=createAiTacticalMemory(),decision=decideAiTacticalAction(memory,{...baseInput,hunterDroneCount:4});
    expect(decision).toMatchObject({action:'launch_drones',deployCount:2});
    recordAiTacticalAction(memory,decision,baseInput.now,baseInput.targetId);
    expect(decideAiTacticalAction(memory,{...baseInput,now:10.8,hunterDroneCount:2}).action).toBe('none');
    expect(decideAiTacticalAction(memory,{...baseInput,now:15.6,hunterDroneCount:2}).action).toBe('launch_drones');
  });

  it('does not throw a frag grenade inside its safe distance',()=>{
    expect(decideAiTacticalAction(createAiTacticalMemory(),{...baseInput,distance:120,throwableType:'fragGrenade',throwableCount:1}).action).toBe('none');
    expect(decideAiTacticalAction(createAiTacticalMemory(),{...baseInput,distance:260,throwableType:'fragGrenade',throwableCount:1}).action).toBe('throw_frag');
  });
});

function makeRoom(){
  const room=new Drop8Room() as any,map={...MAP_CONFIGS.small,collisionObstacles:[],bulletObstacles:[],visibilityObstacles:[],buildingVisibilityZones:[],rooms:[],portals:[],rivers:[],landCrossings:[],shallowWaterZones:[],bushes:[],propObstacles:[],obstacles:[]};
  Object.defineProperty(room,'map',{value:map});room.now=()=>20;room.state.phase='ACTIVE';room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=map.width;room.firstObstacleHitT=()=>null;room.canSeeTarget=()=>true;room.emitAudioEvent=vi.fn();room.broadcast=vi.fn();room.system=vi.fn();return room;
}

function fighter(id:string,x:number,y:number){const p=new PlayerState();p.id=id;p.name=id;p.ai=true;p.alive=true;p.phase='landed';p.x=x;p.y=y;p.hp=100;p.equipped='fists';p.melee='fists';return p;}

describe('Refactor 049 tactical integration',()=>{
  it('launches a bounded drone wave instead of emptying a full escort inventory',()=>{
    const room=makeRoom(),p=fighter('drone-ai',600,600),target=fighter('target',900,600);target.ai=false;room.state.players.set(p.id,p);room.state.players.set(target.id,target);room.tacticalInventory(p.id).hunterDroneCount=4;
    expect(room.runAiTacticalActions(p,target)).toBe(true);
    expect(room.tacticalInventory(p.id).hunterDroneCount).toBe(2);
    expect([...room.state.thrownObjects.values()].filter((object:any)=>object.kind==='hunterDrone')).toHaveLength(2);
  });

  it('prioritizes a strip trap against an approaching tank',()=>{
    const room=makeRoom(),p=fighter('trap-ai',600,600),target=fighter('driver',880,600),tank=new MotorcycleState();target.ai=false;target.isDriving=true;target.vehicleId='tank';tank.id='tank';tank.vehicleKind='tank';tank.driverId=target.id;tank.x=target.x;tank.y=target.y;tank.hp=500;tank.maxHp=500;room.state.players.set(p.id,p);room.state.players.set(target.id,target);room.state.motorcycles.set(tank.id,tank);room.tacticalInventory(p.id).stripTrapCount=1;room.terrainKindAt=()=> 'land';room.isPositionFree=()=>true;
    expect(room.runAiTacticalActions(p,target)).toBe(true);
    expect(room.state.stripTraps.size).toBe(1);
  });
});
