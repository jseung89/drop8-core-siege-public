import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { LOOT_COLORS, LOOT_LABELS, WEAPONS } from '@drop8/shared';

const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
const sounds=readFileSync(fileURLToPath(new URL('../../client/src/audio/synthSounds.ts',import.meta.url)),'utf8');
const room=readFileSync(fileURLToPath(new URL('../src/rooms/Drop8Room.ts',import.meta.url)),'utf8');

describe('Refactor 035 exo audio and sticky gun identity',()=>{
  it('renames the adhesive weapon and ammunition for players',()=>{expect(WEAPONS.adhesive_sprayer.name).toBe('끈끈이총');expect(LOOT_LABELS.adhesive_sprayer).toBe('끈끈이총');expect(LOOT_LABELS.adhesive_charge).toBe('끈끈이 용액통');});
  it('uses a vivid green weapon palette and field effects',()=>{expect(LOOT_COLORS.adhesive_sprayer).toBe(0x55d86f);expect(LOOT_COLORS.adhesive_charge).toBe(0x72e58b);expect(scene).toContain('0x8cff9f');expect(scene).toContain('0x38bd5c');});
  it('emits staged assembly and final activation sounds',()=>{expect(room).toContain("emitAudioEvent('exo_assembly'");expect(room).toContain("emitAudioEvent('exo_activate'");expect(sounds).toContain("case'exo_assembly'");expect(sounds).toContain("case'exo_activate'");});
});
