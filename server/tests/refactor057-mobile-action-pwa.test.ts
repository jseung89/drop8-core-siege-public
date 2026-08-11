import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe,expect,it } from 'vitest';

const read=(path:string)=>readFileSync(fileURLToPath(new URL(`../../${path}`,import.meta.url)),'utf8').replace(/\r\n/g,'\n');
const html=read('client/index.html');
const main=read('client/src/main.ts');
const scene=read('client/src/GameScene.ts');
const controls=read('client/src/mobileControls.ts');
const css=read('client/src/style.css');
const manifest=JSON.parse(read('client/public/app.webmanifest')) as Record<string,unknown>;

describe('Refactor 057 mobile action and install experience',()=>{
  it('keeps lobby scrolling separate from the locked combat viewport',()=>{
    expect(css).toContain('.touch-ui:not(.game-running)');
    expect(css).toContain('touch-action:pan-y');
    expect(css).toContain('.touch-ui.game-running{height:100%;overflow:hidden');
    expect(main).toContain("document.documentElement.classList.add('game-running')");
    expect(main).toContain("document.documentElement.classList.remove('game-running')");
  });

  it('preserves mobile aim independently of camera position at map edges',()=>{
    expect(scene).toContain('normalizeAimVector(mobileSkillAimIntent?mobile.siegeAimX:mobile.aimX,mobileSkillAimIntent?mobile.siegeAimY:mobile.aimY)');
    expect(scene).toContain('mobileActive?{x:aimBase.x+this.localAimX*1800,y:aimBase.y+this.localAimY*1800}');
    expect(scene).toContain('if(mobileActive){\n        const camera=this.cameras.main');
  });

  it('uses skill buttons as tap-to-smart-cast and drag-to-aim sticks',()=>{
    expect(controls).toContain("if(action.startsWith('siegeAbility')){this.bindSiegeSkill");
    expect(controls).toContain('if(this.siegeAimActive)this.siegeReleasePulse=slot;else this.siegeTapPulse=slot');
    expect(controls).toContain("window.addEventListener('pointerup',(event)=>finish(event,true),true)");
    expect(scene).toContain('this.smartCastCoreSiegeAbility(mobile.siegeTapSlot)');
    expect(scene).toContain('this.confirmCoreSiegeAbility(shotAimWorld.x,shotAimWorld.y)');
    expect(scene).toContain("this.frameVisibility.get(candidate.id)?.visibleInWorld===false");
    expect(css).toContain('.mobile-siege-skills button.dragging');
  });

  it('combines contextual actions and exposes every tactical action on touch',()=>{
    expect(scene).toContain("type MobileSmartAction={label:string;action:'none'|'interact'|'jump'|'vault'|'ritual'|'werewolfTransform'}");
    expect(scene.indexOf("label:'아이템 획득'")).toBeLessThan(scene.indexOf("label:'창문 넘기'"));
    for(const action of ['launchDrones','placeSpiderMine','placeStripTrap','robotAssault','robotEmp','robotFusion']){
      expect(controls).toContain(action);
      expect(html).toContain(`data-mobile-action="${action}"`);
    }
    expect(html).not.toContain('data-mobile-action="jump"');
  });

  it('shows six robot parts and provides fullscreen plus install metadata',()=>{
    for(const id of ['mobileAssaultHead','mobileAssaultCore','mobileAssaultLimbs','mobileEmpHead','mobileEmpCore','mobileEmpLimbs'])expect(html).toContain(`id="${id}"`);
    expect(html).toContain('id="mobileFullscreenStart"');
    expect(html).toContain('rel="manifest" href="/app.webmanifest"');
    expect(manifest.display).toBe('fullscreen');
    expect(manifest.orientation).toBe('landscape');
    expect(Array.isArray(manifest.icons)).toBe(true);
  });
});
