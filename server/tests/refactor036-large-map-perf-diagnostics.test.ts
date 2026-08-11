import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
const network=readFileSync(fileURLToPath(new URL('../../client/src/network.ts',import.meta.url)),'utf8');

describe('Refactor 036 large-map performance diagnostics',()=>{
  it('places the F3 panel away from the open-arena scoreboard',()=>{expect(scene).toContain("this.scale.width-12,this.scale.height-104");expect(scene).toContain("setOrigin(1,1)");});
  it('shows frame, patch, and snapshot processing spikes',()=>{expect(scene).toContain('프레임 p95');expect(scene).toContain('patchIntervalP95');expect(scene).toContain('snapshotProcessP95');expect(network).toContain('snapshotProcessSamples');expect(network).toContain('patchIntervalMax');});
  it('only draws foliage near the current camera',()=>{expect(scene).toContain('if(!visible(bush.x,bush.y,bush.radius))continue');expect(scene).not.toContain('for(const bush of this.mapConfig.bushes)this.drawBushBase');});
});
