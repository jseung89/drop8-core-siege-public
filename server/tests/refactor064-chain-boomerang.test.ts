import { describe,expect,it,vi } from 'vitest';
import { BOOMERANG_BALANCE,LOOT_LABELS,MAP_CONFIGS,PROJECTILE_CONFIGS,WEAPONS } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { PlayerState } from '../src/rooms/schema.js';

function player(id:string,x:number,y:number,ai=false){
  const value=new PlayerState();value.id=id;value.name=id;value.x=x;value.y=y;value.ai=ai;value.alive=true;value.phase='landed';return value;
}

describe('Refactor 064 chain boomerang',()=>{
  it('defines a fast reusable ten-target chain profile and field loot identity',()=>{
    expect(WEAPONS.boomerang).toMatchObject({name:'연쇄 부메랑',damage:42,fireInterval:.8,magazine:1,projectileSpeed:1350,ammoType:'none'});
    expect(BOOMERANG_BALANCE).toMatchObject({maxChainTargets:10,chainAcquireRadius:720,damageRetention:.92});
    expect(PROJECTILE_CONFIGS.boomerang.radius).toBeGreaterThan(PROJECTILE_CONFIGS.rifle.radius);
    expect(LOOT_LABELS.boomerang).toBe('연쇄 부메랑');
  });

  it('chains through distinct nearby enemies with descending damage',()=>{
    const game=new Drop8Room() as any;game.gameMode='openArena';game.openArenaRoundState='active';game.state.phase='ACTIVE';game.state.mapId='small';game.state.worldSize=MAP_CONFIGS.small.width;game.firstObstacleHitT=vi.fn(()=>null);game.emitAudioEvent=vi.fn();game.addAiNoise=vi.fn();game.revealBushPlayer=vi.fn();game.damageMotorcycle=vi.fn();
    const damage=vi.fn();game.damage=damage;
    const shooter=player('shooter',100,100);shooter.equipped='boomerang';shooter.primary='boomerang';shooter.angle=0;game.state.players.set(shooter.id,shooter);game.tacticalInventory(shooter.id).boomerangMagazine=1;
    const targets=[player('one',250,100),player('two',390,185),player('three',540,95),player('four',690,190),player('five',835,100)];
    for(const target of targets)game.state.players.set(target.id,target);
    game.firePlayer(shooter);
    for(let index=0;index<500&&game.state.bullets.size;index++)game.updateBullets(.02);
    const hitIds=damage.mock.calls.map((call:any[])=>call[0].id),amounts=damage.mock.calls.map((call:any[])=>Number(call[1]));
    expect(new Set(hitIds).size).toBe(targets.length);expect(hitIds).toEqual(expect.arrayContaining(targets.map((target)=>target.id)));
    expect(amounts[0]).toBeCloseTo(WEAPONS.boomerang.damage);for(let index=1;index<amounts.length;index++)expect(amounts[index]).toBeLessThan(amounts[index-1]!);
    expect(game.state.bullets.size).toBe(0);expect(game.tacticalInventory(shooter.id).boomerangMagazine).toBe(1);
  });

  it('does not chain into a domination ally',()=>{
    const game=new Drop8Room() as any;game.gameMode='domination';game.matchFormat='teams';game.state.mapId='small';game.state.worldSize=MAP_CONFIGS.small.width;game.firstObstacleHitT=vi.fn(()=>null);game.emitAudioEvent=vi.fn();game.addAiNoise=vi.fn();game.revealBushPlayer=vi.fn();game.damage=vi.fn();
    const shooter=player('human',100,100,false),enemy=player('enemy',250,100,true),ally=player('ally',360,100,false);shooter.team='blue';enemy.team='red';ally.team='blue';shooter.equipped='boomerang';shooter.primary='boomerang';shooter.angle=0;game.state.players.set(shooter.id,shooter);game.tacticalInventory(shooter.id).boomerangMagazine=1;game.state.players.set(enemy.id,enemy);game.state.players.set(ally.id,ally);
    game.firePlayer(shooter);for(let index=0;index<300&&game.state.bullets.size;index++)game.updateBullets(.02);
    expect(game.damage.mock.calls.map((call:any[])=>call[0].id)).toContain('enemy');expect(game.damage.mock.calls.map((call:any[])=>call[0].id)).not.toContain('ally');
  });
});
