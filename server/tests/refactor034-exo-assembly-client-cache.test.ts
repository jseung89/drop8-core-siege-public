import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { EXO_SUIT_BALANCE, LOOT_COLORS } from '@drop8/shared';

const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');

describe('Refactor 034 exo assembly and client cache',()=>{
  it('uses one combat palette for all exo parts',()=>{
    expect(LOOT_COLORS.exo_head).toBe(0x8f2630);expect(LOOT_COLORS.exo_core).toBe(0x8f2630);expect(LOOT_COLORS.exo_limbs).toBe(0x8f2630);
  });
  it('runs a deliberate three-stage assembly',()=>{
    expect(EXO_SUIT_BALANCE.assemblySeconds).toBe(1.2);
    expect(scene).toContain("fly('exo_core',0,.34");expect(scene).toContain("fly('exo_limbs',.25,.64");expect(scene).toContain("fly('exo_head',.52,.88");
  });
  it('caches static minimap terrain separately from dynamic markers',()=>{
    expect(scene).toContain('private miniStaticKey');expect(scene).toContain('private drawMiniStatic');expect(scene).toContain('if(this.miniStaticKey===key)return');
  });
  it('camera-culls flame jets before tracing world visibility',()=>{
    expect(scene).toContain("if(!visible(jet.x,jet.y,Number(jet.range||320)+80)||!this.worldEntityVisible");
  });
});
