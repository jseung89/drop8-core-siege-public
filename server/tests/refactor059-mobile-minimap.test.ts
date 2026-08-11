import { describe,expect,it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { fixedHudPoint, resolveFixedHudTransform, resolveMinimapLayout } from '../../client/src/minimapLayout.js';

const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
const css=readFileSync(fileURLToPath(new URL('../../client/src/style.css',import.meta.url)),'utf8');

describe('Refactor 059 mobile minimap interaction',()=>{
  it('keeps the compact mobile map in the upper-right safe area',()=>{
    const layout=resolveMinimapLayout(2048,943,true,false);
    expect(layout).toEqual({x:1910,y:14,size:124,modal:false});
  });

  it('expands the mobile map to nearly the full short edge and centers it',()=>{
    const layout=resolveMinimapLayout(2048,943,true,true);
    expect(layout.modal).toBe(true);
    expect(layout.size).toBeGreaterThan(900);
    expect(layout.x).toBeCloseTo((2048-layout.size)/2);
    expect(layout.y).toBeCloseTo((943-layout.size)/2);
  });

  it('routes a canvas tap through the minimap toggle before combat input',()=>{
    expect(scene).toContain('if(this.handleMinimapPointer(pointer))return');
    expect(scene).toContain("this.mapOpen?'전술 지도 · 터치해서 닫기':'지도 터치'");
    expect(css).toContain('#game.map-open .mobile-controls');
  });

  it('cancels mobile camera zoom so the visible map and tap bounds stay aligned',()=>{
    const transform=resolveFixedHudTransform(1024,480,.8),point=fixedHudPoint(905,10,1024,480,.8);
    expect(transform.x).toBeCloseTo(-128);expect(transform.y).toBeCloseTo(-60);expect(transform.scale).toBe(1.25);
    expect(point.x).toBeCloseTo(1003.25);expect(point.y).toBeCloseTo(-47.5);expect(point.scale).toBe(1.25);
    expect(scene).toContain('resolveFixedHudTransform(this.scale.width,this.scale.height,this.cameras.main.zoom)');
  });

  it('preserves the desktop minimap dimensions',()=>{
    expect(resolveMinimapLayout(1440,900,false,false)).toMatchObject({x:1266,y:82,size:160,modal:false});
    expect(resolveMinimapLayout(1440,900,false,true)).toMatchObject({x:1006,y:70,size:420,modal:false});
  });
});
