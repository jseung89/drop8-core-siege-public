import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { boot, type ColyseusTestServer } from '@colyseus/testing';
import app from '../src/app.config.js';
import { BulletState, FireFieldState, LootState, MotorcycleState, PlayerState, ThrownObjectState, type Drop8State } from '../src/rooms/schema.js';

describe('Refactor 012 throwable server authority', () => {
  let server: ColyseusTestServer<typeof app>;

  beforeAll(async () => { server = await boot(app); });
  afterAll(async () => { await server.shutdown(); });
  beforeEach(async () => { await server.cleanup(); });

  async function landedPlayer(){
    const room:any=await server.createRoom<Drop8State>('drop8',{fillAi:false});
    const client=await server.connectTo(room,{nickname:'Thrower'});
    client.onMessage('audioEvent',()=>undefined);client.onMessage('notice',()=>undefined);client.onMessage('chat',()=>undefined);
    room.state.phase='ACTIVE';room.state.serverTime=0;
    const player=room.state.players.get(client.sessionId)!;
    player.phase='landed';player.alive=true;player.x=1300;player.y=1800;player.buildingId='';player.angle=0;player.primary='rifle';player.equipped='rifle';player.previousEquipped='rifle';
    return{room,client,player};
  }

  it('rejects a throw when the authoritative inventory is empty', async () => {
    const {room,client,player}=await landedPlayer();
    client.send('switch',{slot:4});client.send('throwPrepare');client.send('throw',{aimX:1,aimY:0});
    await new Promise((resolve)=>setTimeout(resolve,100));
    expect(player.throwableCount).toBe(0);
    expect([...room.state.thrownObjects.values()].filter((object)=>object.ownerId===player.id)).toHaveLength(0);
  });

  it('spawns one server-owned projectile, consumes one item and restores the previous weapon at zero', async () => {
    const {room,client,player}=await landedPlayer();
    player.throwableType='fragGrenade';player.throwableCount=1;
    client.send('switch',{slot:4});await new Promise((resolve)=>setTimeout(resolve,35));
    client.send('throwPrepare');await new Promise((resolve)=>setTimeout(resolve,90));
    client.send('throw',{aimX:1,aimY:0});await new Promise((resolve)=>setTimeout(resolve,100));
    const owned=[...room.state.thrownObjects.values()].filter((object)=>object.ownerId===player.id);expect(owned).toHaveLength(1);
    const object=owned[0]!;
    expect(object.ownerId).toBe(player.id);
    expect(object.kind).toBe('fragGrenade');
    expect(player.throwableCount).toBe(0);
    expect(player.throwableType).toBe('');
    expect(player.equipped).toBe('rifle');
  });

  it('throws from the authoritative motorcycle position while driving', async () => {
    const {room,client,player}=await landedPlayer();
    const motorcycle=new MotorcycleState();motorcycle.id='bike-throw';motorcycle.x=2100;motorcycle.y=2200;motorcycle.driverId=player.id;motorcycle.buildingId='';
    room.state.motorcycles.set(motorcycle.id,motorcycle);
    player.isDriving=true;player.vehicleId=motorcycle.id;player.x=motorcycle.x;player.y=motorcycle.y;player.throwableType='smokeGrenade';player.throwableCount=2;
    client.send('switch',{slot:4});await new Promise((resolve)=>setTimeout(resolve,35));
    client.send('throwPrepare');await new Promise((resolve)=>setTimeout(resolve,80));
    client.send('throw',{aimX:1,aimY:0});await new Promise((resolve)=>setTimeout(resolve,100));
    const owned=[...room.state.thrownObjects.values()].filter((object)=>object.ownerId===player.id);expect(owned).toHaveLength(1);
    const object=owned[0]!;
    expect(object.ownerId).toBe(player.id);
    expect(object.x).toBeGreaterThan(motorcycle.x);
    expect(Math.abs(object.y-motorcycle.y)).toBeLessThan(2);
    expect(player.throwableCount).toBe(1);
  });

  it('rejects motorcycle throws when driver ownership is inconsistent', async () => {
    const {room,client,player}=await landedPlayer();
    const motorcycle=new MotorcycleState();motorcycle.id='bike-invalid';motorcycle.x=2100;motorcycle.y=2200;motorcycle.driverId='someone-else';
    room.state.motorcycles.set(motorcycle.id,motorcycle);
    player.isDriving=true;player.vehicleId=motorcycle.id;player.throwableType='fragGrenade';player.throwableCount=1;player.equipped='fragGrenade';
    const authority=room as unknown as {prepareThrow:(source:{sessionId:string})=>void;throwEquipped:(source:{sessionId:string},message:{aimX:number;aimY:number})=>void};
    authority.prepareThrow({sessionId:client.sessionId});authority.throwEquipped({sessionId:client.sessionId},{aimX:1,aimY:0});
    expect([...room.state.thrownObjects.values()].filter((object)=>object.ownerId===player.id)).toHaveLength(0);
    expect(player.throwableCount).toBe(1);
    expect(player.isPreparingThrow).toBe(false);
  });

  it('converts resting smoke and incendiary projectiles into synchronized fields', async () => {
    const {room,player}=await landedPlayer();
    const smoke=new ThrownObjectState();smoke.id='smoke-test';smoke.ownerId=player.id;smoke.kind='smokeGrenade';smoke.x=2050;smoke.y=2050;smoke.phase='resting';smoke.detonateAt=.001;
    const fire=new ThrownObjectState();fire.id='fire-test';fire.ownerId=player.id;fire.kind='incendiaryGrenade';fire.x=2250;fire.y=2050;fire.phase='resting';
    room.state.thrownObjects.set(smoke.id,smoke);room.state.thrownObjects.set(fire.id,fire);
    await new Promise((resolve)=>setTimeout(resolve,110));
    expect(room.state.smokeFields.size).toBe(1);
    expect(room.state.fireFields.size).toBe(1);
    expect(room.state.thrownObjects.has(smoke.id)).toBe(false);
    expect(room.state.thrownObjects.has(fire.id)).toBe(false);
  });

  it('arms a hunter drone, tracks a nearby enemy, and explodes for low damage', async () => {
    const {room,player}=await landedPlayer();
    const target=new PlayerState();
    target.id='target';target.name='Target';target.alive=true;target.phase='landed';target.x=player.x+160;target.y=player.y;target.buildingId='';target.hp=100;
    room.state.players.set(target.id,target);
    const drone=new ThrownObjectState();drone.id='hunter-test';drone.ownerId=player.id;drone.kind='hunterDrone';drone.x=player.x+20;drone.y=player.y;drone.vx=220;drone.vy=0;drone.phase='seeking';drone.spawnedAt=0;drone.detonateAt=999;drone.buildingId='';
    room.state.thrownObjects.set(drone.id,drone);
    await new Promise((resolve)=>setTimeout(resolve,430));
    expect(room.state.thrownObjects.has(drone.id)).toBe(false);
    expect(room.state.explosions.size).toBeGreaterThan(0);
    expect(target.hp).toBeLessThan(100);
    expect(target.hp).toBeGreaterThanOrEqual(72);
  });

  it('stores hunter drones as escort inventory and launches all only on command', async () => {
    const {room,client,player}=await landedPlayer();
    const loot=new LootState();loot.id='escort-pack';loot.kind='hunter_drone';loot.stackCount=4;loot.x=player.x+10;loot.y=player.y;loot.buildingId='';
    room.state.loot.set(loot.id,loot);
    client.send('pickup');await new Promise((resolve)=>setTimeout(resolve,80));
    expect(room.tacticalInventory(player.id).hunterDroneCount).toBe(4);
    player.rifleMagazine=1;player.equipped='rifle';
    client.send('fire');await new Promise((resolve)=>setTimeout(resolve,80));
    expect(room.tacticalInventory(player.id).hunterDroneCount).toBe(4);
    expect([...room.state.thrownObjects.values()].some((object)=>object.kind==='hunterDrone'&&object.ownerId===player.id)).toBe(false);
    client.send('launchHunterDrones');await new Promise((resolve)=>setTimeout(resolve,80));
    expect(room.tacticalInventory(player.id).hunterDroneCount).toBe(0);
    expect([...room.state.thrownObjects.values()].filter((object)=>object.kind==='hunterDrone'&&object.ownerId===player.id)).toHaveLength(4);
  });

  it('uses escort drones as a bullet shield before launch', async () => {
    const {room,player}=await landedPlayer();
    room.tacticalInventory(player.id).hunterDroneCount=1;
    const bullet=new BulletState();bullet.id='shield-test';bullet.owner='enemy';bullet.weaponId='rifle';bullet.x=player.x-180;bullet.y=player.y;bullet.prevX=bullet.x;bullet.prevY=bullet.y;bullet.vx=1200;bullet.vy=0;bullet.life=1;bullet.damage=20;bullet.radius=2.4;bullet.buildingId='';
    room.state.bullets.set(bullet.id,bullet);
    await new Promise((resolve)=>setTimeout(resolve,260));
    expect(room.state.bullets.has(bullet.id)).toBe(false);
    expect(room.tacticalInventory(player.id).hunterDroneCount).toBe(1);
    expect(player.hp).toBe(100);
  });

  it('keeps escort shield on cooldown instead of making the player invulnerable', async () => {
    const {room,player}=await landedPlayer();
    room.tacticalInventory(player.id).hunterDroneCount=1;
    for(const [id,offset] of [['shield-a',-180],['shield-b',-182]] as const){
      const bullet=new BulletState();bullet.id=id;bullet.owner='enemy';bullet.weaponId='rifle';bullet.x=player.x+offset;bullet.y=player.y;bullet.prevX=bullet.x;bullet.prevY=bullet.y;bullet.vx=1200;bullet.vy=0;bullet.life=1;bullet.damage=20;bullet.radius=2.4;bullet.buildingId='';
      room.state.bullets.set(bullet.id,bullet);
    }
    await new Promise((resolve)=>setTimeout(resolve,260));
    expect(room.tacticalInventory(player.id).hunterDroneCount).toBe(1);
    expect(player.hp).toBeLessThan(100);
  });

  it('does not stack periodic fire damage from overlapping fields', async () => {
    const {room,player}=await landedPlayer();
    player.hp=100;player.armor=0;
    for(const id of ['fire-a','fire-b']){
      const field=new FireFieldState();field.id=id;field.ownerId='enemy';field.x=player.x;field.y=player.y;field.radius=115;field.expiresAt=9999;field.buildingId='';room.state.fireFields.set(id,field);
    }
    await new Promise((resolve)=>setTimeout(resolve,310));
    expect(player.hp).toBeGreaterThanOrEqual(92);
    expect(player.hp).toBeLessThanOrEqual(96);
  });
});
