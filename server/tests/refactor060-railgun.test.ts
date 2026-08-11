import { describe,expect,it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { AMMO_DISPLAY_NAMES,LOOT_COLORS,LOOT_LABELS,RAILGUN_BALANCE,REGION_LOOT_TABLES,WEAPONS } from '@drop8/shared';

const room=readFileSync(fileURLToPath(new URL('../src/rooms/Drop8Room.ts',import.meta.url)),'utf8');
const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
const hud=readFileSync(fileURLToPath(new URL('../../client/src/main.ts',import.meta.url)),'utf8');

describe('Refactor 060 rail machine gun',()=>{
  it('uses the bazooka movement penalty with a strong high-capacity automatic profile',()=>{
    expect(WEAPONS.railgun).toMatchObject({damage:23,fireInterval:.085,magazine:60,reloadSeconds:4.1,projectileSpeed:2400,moveMultiplier:WEAPONS.bazooka.moveMultiplier,ammoType:'rail_slug',range:1400});
    expect(RAILGUN_BALANCE).toMatchObject({pickupAmount:60,initialReserve:120,maxReserve:240,vehicleDamageMultiplier:1.15});
  });

  it('registers the weapon and dedicated ammunition as rare loot',()=>{
    expect(LOOT_LABELS.railgun).toBe('레일건');expect(LOOT_LABELS.rail_slug).toBe('레일 슬러그');expect(AMMO_DISPLAY_NAMES.rail_slug).toBe('레일 슬러그');expect(LOOT_COLORS.railgun).toBe(0x67e8ff);
    expect(REGION_LOOT_TABLES.military.some((entry)=>entry.kind==='railgun')).toBe(true);
    expect(REGION_LOOT_TABLES.military.some((entry)=>entry.kind==='rail_slug')).toBe(true);
  });

  it('uses the normal server-authoritative projectile stream instead of charge hitscan',()=>{
    expect(room).not.toContain("this.onMessage('railgunChargeStart'");expect(room).not.toContain("this.onMessage('railgunChargeRelease'");expect(room).not.toContain("this.broadcast('railgunShot'");
    expect(room).toContain('const config=PROJECTILE_CONFIGS');expect(room).toContain('this.setWeaponMagazine(p,id,magazine-1)');
  });

  it('supports held automatic fire on desktop/mobile and renders bright rail tracers',()=>{
    expect(scene).not.toContain("this.net.send('railgunChargeStart')");expect(scene).toContain("const rail=b.weaponId==='railgun'");expect(scene).toContain('if(rail)g.lineStyle(9,0x39dfff');
    expect(hud).toContain("ammoType==='rail_slug'");expect(hud).toContain("id==='railgun'");
  });

  it('lets AI select and continuously fire the railgun at long range',()=>{
    expect(room).not.toContain("if(id==='railgun'){if(p.ai)");expect(room).toContain("if(w.id==='railgun')score+=d>500");expect(room).toContain("if(id==='railgun')return 850");
  });
});
