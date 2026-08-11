import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source=readFileSync(new URL('../../client/src/GameScene.ts',import.meta.url),'utf8');

describe('Refactor 033 large map client culling',()=>{
  it('culls loot by camera bounds before expensive space visibility tracing',()=>{
    expect(source).toContain('if(visible(l.x,l.y,80)&&this.spaceVisible(l)');
    expect(source).not.toContain('if(this.spaceVisible(l)&&visible(l.x,l.y,80)');
  });

  it('checks pickup distance before portal interaction rules',()=>{
    expect(source).toContain('if(d>=best)continue;if(!spaceInteractionAllowed(me,l,this.mapConfig.portals))continue');
  });

  it('does not eagerly trace every player before screen culling',()=>{
    expect(source).not.toContain('for(const p of s.players)if(p.alive)this.getPlayerVisibility(p)');
    expect(source).toContain('if(!inView){this.lastVisibility.set(p.id,false);continue;}');
  });
});
