// DROP8_REFACTOR_018_WEREWOLF_SEASON
import { describe, expect, it, vi } from 'vitest';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { PlayerState } from '../src/rooms/schema.js';

function makeRoom(clock:{value:number}){const room=new Drop8Room() as any;room.now=()=>clock.value;room.setMatchmaking=vi.fn().mockResolvedValue(undefined);room.registrySyncQueue=Promise.resolve();room.state.phase='ACTIVE';room.state.aliveCount=4;return room;}
function addPlayer(room:any,id:string,x:number,y:number){const p=new PlayerState();p.id=id;p.name=id;p.alive=true;p.phase='landed';p.x=x;p.y=y;p.angle=0;room.state.players.set(id,p);room.tacticalInventory(id);return p;}

describe('Refactor 018 ritual and transformation authority',()=>{
  it('awards only one curse after a three-second stationary ritual and transforms without healing',()=>{
    const clock={value:10},room=makeRoom(clock),p=addPlayer(room,'human',1000,1000);
    for(let i=0;i<3;i++)addPlayer(room,`other-${i}`,1500+i*40,1500);
    const season=room.state.werewolfSeason;season.enabled=true;season.altarPhase='active';season.altarX=1000;season.altarY=1000;
    const client={sessionId:p.id,send:vi.fn()};
    room.werewolfRitualStart(client);
    expect(p.werewolf.ritualizing).toBe(true);
    clock.value=13.01;room.updateWerewolfSeason(.01);
    expect(p.werewolf.hasCurse).toBe(true);expect(season.curseOwnerId).toBe(p.id);expect(season.altarPhase).toBe('claimed');
    p.hp=37;room.werewolfTransform(client);expect(p.werewolf.transformPreparing).toBe(true);
    clock.value=14.22;room.updateWerewolfSeason(.01);
    expect(p.werewolf.transformed).toBe(true);expect(p.hp).toBe(37);expect(season.werewolfPlayerId).toBe(p.id);
  });
  it('cancels the ritual when damage arrives',()=>{
    const clock={value:1},room=makeRoom(clock),p=addPlayer(room,'human',900,900);
    const season=room.state.werewolfSeason;season.enabled=true;season.altarPhase='active';season.altarX=900;season.altarY=900;
    room.werewolfRitualStart({sessionId:p.id,send:vi.fn()});
    room.damage(p,1,'','총기',0,undefined,'bullet');
    expect(p.werewolf.ritualizing).toBe(false);
  });
  it('returns loaded and reserve silver bolts to the field when transformation completes',()=>{
    const clock={value:5},room=makeRoom(clock),p=addPlayer(room,'armed-wolf',1000,1000),tactical=room.tacticalInventory(p.id);
    const season=room.state.werewolfSeason;season.enabled=true;season.altarPhase='claimed';season.curseOwnerId=p.id;
    p.werewolf.hasCurse=true;p.werewolf.curseExpiresAt=30;p.primary='silver_crossbow';p.equipped='silver_crossbow';tactical.silverCrossbowMagazine=3;tactical.silverBoltAmmo=5;
    expect(room.beginWerewolfTransform(p)).toBe(true);
    clock.value+=2;room.completeWerewolfTransform(p);
    expect(p.werewolf.transformed).toBe(true);
    expect(tactical.silverCrossbowMagazine).toBe(0);expect(tactical.silverBoltAmmo).toBe(0);
    const returned=[...room.state.loot.values()].filter((loot:any)=>loot.kind==='silver_bolt');
    expect(returned).toHaveLength(1);expect(returned[0]?.ammoCount).toBe(8);
    const crossbows=[...room.state.loot.values()].filter((loot:any)=>loot.kind==='silver_crossbow');
    expect(crossbows).toHaveLength(1);expect(crossbows[0]?.weaponMagazine).toBe(0);expect(p.primary).toBe('');expect(p.equipped).toBe('fists');
  });
});
