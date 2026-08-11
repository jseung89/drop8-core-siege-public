// DROP8_REFACTOR_051_AI_EXPERIENCE_BRAIN
import { describe,expect,it } from 'vitest';
import { MAP_CONFIGS } from '@drop8/shared';
import { AI_EXPERIENCE_BRAIN, aiDangerScoreAt, createAiExperienceMemory, pruneAiExperience, recordAiDanger } from '../src/rooms/aiExperienceBrain.js';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { LootState, PlayerState } from '../src/rooms/schema.js';

describe('Refactor 051 AI experience brain',()=>{
  it('merges repeated danger, decays it and bounds memory size',()=>{
    const memory=createAiExperienceMemory();recordAiDanger(memory,{x:100,y:100,now:10,kind:'bullet',severity:1});recordAiDanger(memory,{x:115,y:105,now:11,kind:'bullet',severity:1});
    expect(memory.dangers).toHaveLength(1);expect(memory.dangers[0]?.hits).toBe(2);expect(aiDangerScoreAt(memory,110,105,11)).toBeGreaterThan(50);
    for(let index=0;index<30;index++)recordAiDanger(memory,{x:index*300,y:800,now:12+index*.01,kind:'explosion',severity:.5});
    expect(memory.dangers.length).toBeLessThanOrEqual(AI_EXPERIENCE_BRAIN.maxDangerRecords);
    pruneAiExperience(memory,80);expect(memory.dangers).toHaveLength(0);
  });

  it('remembers death zones longer than routine damage',()=>{
    const memory=createAiExperienceMemory();recordAiDanger(memory,{x:500,y:500,now:10,kind:'bullet',severity:1});recordAiDanger(memory,{x:900,y:500,now:10,kind:'death',severity:1});
    expect(aiDangerScoreAt(memory,900,500,25)).toBeGreaterThan(aiDangerScoreAt(memory,500,500,25));
    expect(memory.deathsRemembered).toBe(1);
  });
});

function makeRoom(){
  const room=new Drop8Room() as any,map={...MAP_CONFIGS.small,collisionObstacles:[],bulletObstacles:[],visibilityObstacles:[],buildingVisibilityZones:[],rooms:[],portals:[],rivers:[],landCrossings:[],shallowWaterZones:[],bushes:[],propObstacles:[],obstacles:[]};
  Object.defineProperty(room,'map',{value:map});room.now=()=>20;room.state.phase='ACTIVE';room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=map.width;return room;
}
function loot(id:string,x:number){const item=new LootState();item.id=id;item.kind='rifle';item.x=x;item.y=600;return item;}

describe('Refactor 051 experience integration',()=>{
  it('takes a modest detour instead of repeating a remembered death route',()=>{
    const room=makeRoom(),p=new PlayerState();p.id='learning-ai';p.name=p.id;p.ai=true;p.alive=true;p.phase='landed';p.x=600;p.y=600;p.hp=100;p.equipped='fists';p.melee='fists';room.state.players.set(p.id,p);
    const near=loot('near-danger',720),far=loot('far-safe',980);room.state.loot.set(near.id,near);room.state.loot.set(far.id,far);recordAiDanger(room.ensureAiExperienceBrain(p.id),{x:near.x,y:near.y,now:20,kind:'death',severity:1.4,radius:260});
    expect(room.findBestLoot(p)?.id).toBe(far.id);
  });
});
