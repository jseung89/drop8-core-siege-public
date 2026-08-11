import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { WEAPONS } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { PlayerState } from '../src/rooms/schema.js';

describe('Refactor 031 stun gun balance',()=>{
  it('forwards fire payload coordinates to the authoritative weapon handler',()=>{
    const source=readFileSync(new URL('../src/rooms/Drop8Room.ts',import.meta.url),'utf8');
    expect(source).toContain("this.onMessage('fire',(c,m)=>this.fire(c,m));");
  });
  it('matches shotgun range and locks a human player for 1.5 seconds',()=>{
    const room=new Drop8Room() as any,clock={value:10},target=new PlayerState();
    room.now=()=>clock.value;target.id='target';target.alive=true;target.phase='landed';target.x=500;target.y=500;room.state.players.set(target.id,target);
    const movement={x:1,y:0,aimX:1,aimY:0,angle:0,seq:1,aiming:true,huntSprint:false,accelerate:false,brake:false,turnLeft:false,turnRight:false};
    room.inputs.set(target.id,movement);room.knockback.set(target.id,{vx:300,vy:0});
    expect(WEAPONS.stun_gun.range).toBe(WEAPONS.shotgun.range);
    room.applyStunGunHit(target,'attacker');
    expect(target.werewolf.actionLockedUntil).toBeCloseTo(11.5);
    expect(movement.x).toBe(0);expect(movement.y).toBe(0);expect(room.knockback.has(target.id)).toBe(false);
    movement.x=1;room.updatePlayers(1);expect(target.x).toBe(500);
    clock.value=11.51;room.updatePlayers(.1);expect(target.x).toBeGreaterThan(500);
  });

  it('keeps the werewolf stun resistance while applying the human buff',()=>{
    const room=new Drop8Room() as any,target=new PlayerState();
    room.now=()=>4;target.id='wolf';target.alive=true;target.phase='landed';target.werewolf.transformed=true;room.state.players.set(target.id,target);
    room.applyStunGunHit(target,'attacker');
    expect(target.werewolf.actionLockedUntil).toBeCloseTo(4.28);
  });

  it('stops AI movement and combat decisions for the full stun duration',()=>{
    const room=new Drop8Room() as any,target=new PlayerState(),intent={mode:'move',route:[{x:700,y:500}],targetId:'enemy'};
    room.now=()=>20;target.id='ai-target';target.ai=true;target.alive=true;target.phase='landed';target.x=500;target.y=500;room.state.players.set(target.id,target);
    room.applyStunGunHit(target,'attacker');room.runAi(target,intent,.5);
    expect(target.x).toBe(500);expect(target.y).toBe(500);expect(target.aiState).toBe('STUNNED');
    expect(intent.mode).toBe('hold');expect(intent.route).toEqual([]);expect(intent.targetId).toBe('');
  });
});
