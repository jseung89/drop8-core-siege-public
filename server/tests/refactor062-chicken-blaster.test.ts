import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { CHICKEN_BLASTER_BALANCE, WEAPONS } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { PlayerState } from '../src/rooms/schema.js';

function activePlayer(id:string){const player=new PlayerState();player.id=id;player.name=id;player.alive=true;player.phase='landed';player.x=900;player.y=900;player.angle=0;return player;}
function roomAt(clock:{value:number}){const room=new Drop8Room() as any;room.now=()=>clock.value;room.state.phase='ACTIVE';return room;}

describe('Refactor 062 chicken blaster',()=>{
  it('defines a low-damage capsule weapon with a server-authoritative timed form',()=>{
    expect(WEAPONS.chicken_blaster).toMatchObject({name:'꼬꼬 변환총',damage:2,magazine:3,ammoType:'chicken_capsule'});
    expect(CHICKEN_BLASTER_BALANCE).toMatchObject({transformSeconds:6,recoveryImmunitySeconds:10,movementMultiplier:1.15,peckDamage:12});
  });

  it('transforms a human, expires safely, and blocks immediate re-transformation',()=>{
    const clock={value:10},room=roomAt(clock),attacker=activePlayer('attacker'),target=activePlayer('target');room.state.players.set(attacker.id,attacker);room.state.players.set(target.id,target);
    expect(room.applyChickenTransform(target,attacker.id)).toBe(true);expect(room.tacticalInventory(target.id).chickenTransformed).toBe(true);expect(room.tacticalInventory(target.id).chickenUntil).toBe(16);
    expect(room.applyChickenTransform(target,attacker.id)).toBe(false);
    clock.value=16.01;room.updateChickenTransforms();expect(room.tacticalInventory(target.id).chickenTransformed).toBe(false);expect(room.tacticalInventory(target.id).chickenImmuneUntil).toBeCloseTo(26.01);
    expect(room.applyChickenTransform(target,attacker.id)).toBe(false);clock.value=26.02;room.updateChickenTransforms();expect(room.applyChickenTransform(target,attacker.id)).toBe(true);
  });

  it('keeps vehicles, werewolves and robots immune and gives the chicken a real peck attack',()=>{
    const clock={value:20},room=roomAt(clock),attacker=activePlayer('attacker'),target=activePlayer('target');room.state.players.set(attacker.id,attacker);room.state.players.set(target.id,target);
    target.isDriving=true;expect(room.applyChickenTransform(target,attacker.id)).toBe(false);target.isDriving=false;target.werewolf.transformed=true;expect(room.applyChickenTransform(target,attacker.id)).toBe(false);target.werewolf.transformed=false;
    room.tacticalInventory(target.id).exoActive=true;expect(room.applyChickenTransform(target,attacker.id)).toBe(false);room.tacticalInventory(target.id).exoActive=false;
    room.tacticalInventory(attacker.id).chickenTransformed=true;room.tacticalInventory(attacker.id).chickenUntil=30;target.x=940;const damage=vi.spyOn(room,'damage');expect(room.chickenPeck(attacker)).toBe(true);expect(damage).toHaveBeenCalledWith(target,CHICKEN_BLASTER_BALANCE.peckDamage,attacker.id,'닭 부리 공격',0,undefined,'melee');
  });
});

const scene=readFileSync(fileURLToPath(new URL('../../client/src/GameScene.ts',import.meta.url)),'utf8');
const hud=readFileSync(fileURLToPath(new URL('../../client/src/main.ts',import.meta.url)),'utf8');
describe('Refactor 062 client presentation',()=>{
  it('renders the egg projectile, chicken form, status guide, ammo and F8 weapon',()=>{
    expect(scene).toContain("b.weaponId==='chicken_blaster'");expect(scene).toContain('private drawChicken(');expect(scene).toContain('좌클릭 부리 공격');expect(scene).toContain("type==='chicken_transform'");
    expect(hud).toContain("ammoType==='chicken_capsule'");expect(hud).toContain("id==='chicken_blaster'");
  });
});
