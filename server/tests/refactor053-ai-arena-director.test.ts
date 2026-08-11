// DROP8_REFACTOR_053_AI_ARENA_DIRECTOR
import { describe,expect,it } from 'vitest';
import { MAP_CONFIGS, normalizeOpenArenaConfig } from '@drop8/shared';
import { aiArenaDirectorWaypoint, createAiArenaDirectorMemory, isAiArenaInterventionActive, maybeStartAiArenaIntervention, recordAiArenaCombat, shouldAiJoinArenaIntervention } from '../src/rooms/aiArenaDirector.js';
import { aiRolePlan } from '../src/rooms/aiRoleBrain.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { PlayerState } from '../src/rooms/schema.js';

describe('Refactor 053 AI arena director',()=>{
  it('waits for a stale AI-only arena and stops directing as soon as combat resumes',()=>{
    const memory=createAiArenaDirectorMemory(0,1000,1000),base={active:true,aiCount:16,humanCombatants:0,engagedAi:0,centerX:1000,centerY:1000};
    expect(maybeStartAiArenaIntervention(memory,{...base,now:8})).toBe(false);
    expect(maybeStartAiArenaIntervention(memory,{...base,now:10,humanCombatants:1})).toBe(false);
    expect(maybeStartAiArenaIntervention(memory,{...base,now:10})).toBe(true);expect(isAiArenaInterventionActive(memory,10)).toBe(true);
    recordAiArenaCombat(memory,1200,900,11);expect(isAiArenaInterventionActive(memory,11)).toBe(false);expect(memory.combatEvents).toBe(1);
  });

  it('creates stable, role-shaped gathering lanes instead of one shared point',()=>{
    const memory=createAiArenaDirectorMemory(0,1000,1000);maybeStartAiArenaIntervention(memory,{now:10,active:true,aiCount:16,humanCombatants:0,engagedAi:0,centerX:1000,centerY:1000});
    const aggressive=aiArenaDirectorWaypoint(memory,'aggressive-ai',aiRolePlan('aggressive')),cautious=aiArenaDirectorWaypoint(memory,'cautious-ai',aiRolePlan('cautious'));
    expect(aggressive).toEqual(aiArenaDirectorWaypoint(memory,'aggressive-ai',aiRolePlan('aggressive')));expect(aggressive).not.toEqual(cautious);
    expect(Math.hypot(cautious.x-memory.hotspotX,cautious.y-memory.hotspotY)).toBeGreaterThan(Math.hypot(aggressive.x-memory.hotspotX,aggressive.y-memory.hotspotY)*.7);
  });
});

function makeRoom(){
  const room=new Drop8Room() as any,map={...MAP_CONFIGS.small,collisionObstacles:[],bulletObstacles:[],visibilityObstacles:[],buildingVisibilityZones:[],rooms:[],portals:[],rivers:[],landCrossings:[],shallowWaterZones:[],bushes:[],propObstacles:[],obstacles:[]};
  Object.defineProperty(room,'map',{value:map});room.now=()=>20;room.gameMode='openArena';room.openArenaConfig=normalizeOpenArenaConfig(0,16,20);room.openArenaRoundState='active';room.state.phase='ACTIVE';room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=map.width;room.aiArenaDirector=createAiArenaDirectorMemory(0,map.width/2,map.height/2);return room;
}
function armedAi(id:string){const p=new PlayerState();p.id=id;p.name=id;p.ai=true;p.alive=true;p.phase='landed';p.x=500;p.y=500;p.hp=100;p.secondary='pistol';p.equipped='pistol';p.pistolMagazine=8;p.pistolAmmo=24;return p;}

describe('Refactor 053 director integration',()=>{
  it('assigns an armed observer-arena AI a bounded directed patrol goal',()=>{
    const room=makeRoom(),joinId=Array.from({length:32},(_,index)=>`director-ai-${index}`).find((id)=>shouldAiJoinArenaIntervention(id,1,aiRolePlan('aggressive')))!;
    const selected=armedAi(joinId);room.state.players.set(selected.id,selected);room.ensureAiProfile(selected).personality='aggressive';
    for(let index=0;index<3;index++){const other=armedAi(`other-ai-${index}`);other.x=700+index*80;room.state.players.set(other.id,other);}
    const intent=room.newAiIntent(selected);room.aiIntent.set(selected.id,intent);
    expect(room.applyAiArenaDirector(selected,intent)).toBe(true);expect(selected.aiState).toBe('DIRECTED_PATROL');expect(intent.goalKey).toBe('director:1');expect(intent.mode).toBe('move');expect(intent.routeGoalX).toBeGreaterThan(0);
  });
});
