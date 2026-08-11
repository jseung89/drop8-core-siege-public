// DROP8_REFACTOR_025_OPEN_ARENA_KILL_LIMIT_MATCH_CYCLE
// DROP8_REFACTOR_024E_OPEN_ARENA_SCOREBOARD_UX
// DROP8_REFACTOR_024C_OPEN_ARENA_RESPAWN
// DROP8_REFACTOR_024B_OPEN_ARENA_LIFECYCLE_HOST_MIGRATION
// DROP8_REFACTOR_024A_OPEN_ARENA_FOUNDATION
// DROP8_REFACTOR_019_AI_HUMANIZATION
// DROP8_REFACTOR_018_WEREWOLF_SEASON
// DROP8_REFACTOR_017_ADHESIVE_STRIP_LOBBY_BAZOOKA_WATER
// DROP8_REFACTOR_015A_SUPPLY_DROP_FLAMETHROWER
// DROP8_REFACTOR_014_PLANE_VISIBILITY_BAZOOKA_SLOT_SWAP
// DROP8_REFACTOR_013H_FIXED_V3_VISIBILITY_ROOF_RIVER_ZONE_SNIPER_AI
// DROP8_REFACTOR_013H_VISIBILITY_ROOF_RIVER_ZONE_SNIPER
import { Client, type Room } from '@colyseus/sdk';
// DROP8_REFACTOR_013_INTERIOR_RIVER_DOCK8

export type Snapshot={
  phase:string;roomCode:string;hostId:string;fillAi:boolean;publicRoom:boolean;difficulty:string;zoneSpeed:string;mapId:string;mapSizeMode:string;mapRevision:number;worldSize:number;
  zoneX:number;zoneY:number;zoneRadius:number;zoneStartX:number;zoneStartY:number;zoneStartRadius:number;
  nextZoneX:number;nextZoneY:number;nextZoneRadius:number;zoneTimer:number;zoneStage:number;zoneProgress:number;zoneActive:boolean;zoneState:string;supplySpawned:boolean;supplyDropId:string;
  planeStartX:number;planeStartY:number;planeX:number;planeY:number;planeEndX:number;planeEndY:number;planeAngle:number;planeProgress:number;
  serverTime:number;serverTickAvg:number;serverTickP95:number;serverTickMax:number;serverAiMs:number;serverCollisionMs:number;serverZoneMs:number;serverVehicleMs:number;recoveryCount:number;vehicleRecoveryCount:number;activeBulletLimit:number;
  aliveCount:number;winner:string;werewolfSeason:any;domination:any;coreSiege:any;players:any[];tacticalInventories:any[];bullets:any[];rockets:any[];loot:any[];motorcycles:any[];explosions:any[];thrownObjects:any[];smokeFields:any[];fireFields:any[];flameJets:any[];adhesiveJets:any[];stripTraps:any[];supplyDrops:any[];receivedAt:number;
};

const endpoint=location.origin.replace(/^http/,'ws');

export type RoomConfig={gameMode:'battleRoyale'|'openArena'|'domination'|'coreSiege';matchFormat:'solo'|'teams';teamAiBlue:number;teamAiRed:number;maxHumans:number;configuredAiCount:number;maxTotalCombatants:number;spectatorOnly:boolean;joinInProgress:boolean;zoneEnabled:boolean;respawnEnabled:boolean;practiceMode?:boolean;lifecycle?:string;killLimit:number;roundState?:'active'|'result'|'resetting';domination?:{scoreToWin:number;captureSeconds:number};coreSiege?:any};

export class Network {
  client=new Client(endpoint);
  room:Room<any>|null=null;
  snapshot:Snapshot|null=null;
  roomConfig:RoomConfig={gameMode:'battleRoyale',matchFormat:'solo',teamAiBlue:0,teamAiRed:0,maxHumans:8,configuredAiCount:0,maxTotalCombatants:8,spectatorOnly:false,joinInProgress:false,zoneEnabled:true,respawnEnabled:false,killLimit:0,roundState:'active'};
  respawnAt=0;
  spawnProtectionUntil=0;
  arenaStatus:any=null;
  arenaScoreboard:any[]=[];
  arenaRound:any=null;
  listeners=new Set<()=>void>();
  messages=new Set<(t:string,p:any)=>void>();
  private playerCache=new Map<string,any>();
  private tacticalInventoryCache=new Map<string,any>();
  private bulletCache=new Map<string,any>();
  private lootCache=new Map<string,any>();
  private rocketCache=new Map<string,any>();
  private motorcycleCache=new Map<string,any>();
  private explosionCache=new Map<string,any>();
  private thrownObjectCache=new Map<string,any>();
  private smokeFieldCache=new Map<string,any>();
  private fireFieldCache=new Map<string,any>();
  private flameJetCache=new Map<string,any>();
  private adhesiveJetCache=new Map<string,any>();
  private stripTrapCache=new Map<string,any>();
  private supplyDropCache=new Map<string,any>();
  private coreSiegePlayerCache=new Map<string,any>();
  private coreSiegeStructureCache=new Map<string,any>();
  private coreSiegeMinionCache=new Map<string,any>();
  private coreSiegeCampCache=new Map<string,any>();
  private coreSiegeUpgradeCache=new Map<string,any>();
  private coreSiegePickupCache=new Map<string,any>();
  private coreSiegeDeviceCache=new Map<string,any>();
  private lastPatchAt=0;
  private patchIntervals:number[]=[];
  private receivedBytesWindow=0;
  private bytesPerSecond=0;
  private bytesWindowAt=performance.now();
  private snapshotProcessSamples:number[]=[];
  private pingTimer=0;
  rtt=0;

  async create(options:any){this.room=await this.client.create('drop8',options);this.attach();return this.room;}
  async join(code:string,options:any){this.room=await this.client.joinById(code.toUpperCase(),options);this.attach();return this.room;}
  async joinOrCreate(options:any){this.room=await this.client.joinOrCreate('drop8',options);this.attach();return this.room;}

  private attach(){
    if(!this.room)return;
    const update=(s:any)=>{
      const now=performance.now();
      if(this.lastPatchAt){this.patchIntervals.push(now-this.lastPatchAt);if(this.patchIntervals.length>120)this.patchIntervals.shift();}
      this.lastPatchAt=now;
      const processStarted=performance.now();this.snapshot=this.toSnapshot(s,now);this.snapshotProcessSamples.push(performance.now()-processStarted);if(this.snapshotProcessSamples.length>120)this.snapshotProcessSamples.shift();
      if(now-this.bytesWindowAt>=1000){this.bytesPerSecond=this.receivedBytesWindow;this.receivedBytesWindow=0;this.bytesWindowAt=now;}
      this.listeners.forEach(fn=>fn());
    };
    this.room.onStateChange(update);
    if(this.room.state?.players)update(this.room.state);
    this.room.onMessage('roomConfig',(payload:any)=>{this.roomConfig={...this.roomConfig,...payload};this.listeners.forEach(fn=>fn());});
    for(const type of ['chat','aiDialogue','killfeed','result','error','notice','pong','kicked','pickupResult','slotSwapResult','positionRecovery','vehicleRecovery','characterDeath','audioEvent','exoLaser','laserCannonShot','arenaStatus','coreSiegeEffect','hostChanged','respawnScheduled','respawned','spawnProtection','arenaScoreboard','arenaRoundResult','arenaRoundStarted'])this.room.onMessage(type,(p:any)=>{
      if(type==='pong'&&Number.isFinite(Number(p?.t)))this.rtt=Math.max(0,Date.now()-Number(p.t));
      if(type==='respawnScheduled')this.respawnAt=Number(p?.respawnAt)||0;
      if(type==='respawned')this.respawnAt=0;
      if(type==='spawnProtection')this.spawnProtectionUntil=Number(p?.protectedUntil)||0;
      if(type==='arenaStatus')this.arenaStatus=p??null;
      if(type==='arenaScoreboard'){this.arenaScoreboard=Array.isArray(p?.rows)?p.rows:[];this.arenaStatus=p?.status??this.arenaStatus;this.arenaRound=p?.round??this.arenaRound;this.listeners.forEach(fn=>fn());}
      if(type==='arenaRoundResult'){this.arenaRound=p??null;this.listeners.forEach(fn=>fn());}
      if(type==='arenaRoundStarted'){this.arenaRound=null;this.listeners.forEach(fn=>fn());}
      this.messages.forEach(fn=>fn(type,p));
    });
    window.clearInterval(this.pingTimer);
    this.pingTimer=window.setInterval(()=>this.room?.send('ping',{t:Date.now()}),2000);
    this.room.send('requestRoomConfig');
  }

  private syncCollection(collection:any,cache:Map<string,any>){
    const seen=new Set<string>();
    if(collection&&typeof collection.values==='function'){
      for(const raw of collection.values()){
        const json=raw?.toJSON?.()??({...raw});
        const id=String(json.id??'');
        if(!id)continue;
        seen.add(id);
        const existing=cache.get(id);
        if(existing)Object.assign(existing,json);
        else cache.set(id,json);
      }
    }
    for(const id of cache.keys())if(!seen.has(id))cache.delete(id);
    return [...cache.values()];
  }

  private toSnapshot(s:any,receivedAt:number):Snapshot{
    const tacticalInventories=this.syncCollection(s.tacticalInventories,this.tacticalInventoryCache);
    const tacticalById=new Map(tacticalInventories.map((inventory:any)=>[String(inventory.id??''),inventory]));
    const players=this.syncCollection(s.players,this.playerCache);
    const werewolfSeason=s.werewolfSeason?.toJSON?.()??({...s.werewolfSeason});
    const domination=s.domination?.toJSON?.()??({...s.domination});
    domination.sites=s.domination?.sites&&typeof s.domination.sites.values==='function'?[...s.domination.sites.values()].map((site:any)=>site?.toJSON?.()??({...site})):Object.values(domination.sites??{});
    const coreSiege=s.coreSiege?.toJSON?.()??({...s.coreSiege});
    coreSiege.players=this.syncCollection(s.coreSiege?.players,this.coreSiegePlayerCache);
    coreSiege.structures=this.syncCollection(s.coreSiege?.structures,this.coreSiegeStructureCache);
    coreSiege.minions=this.syncCollection(s.coreSiege?.minions,this.coreSiegeMinionCache);
    coreSiege.camps=this.syncCollection(s.coreSiege?.camps,this.coreSiegeCampCache);
    coreSiege.upgrades=this.syncCollection(s.coreSiege?.upgrades,this.coreSiegeUpgradeCache);
    coreSiege.pickups=this.syncCollection(s.coreSiege?.pickups,this.coreSiegePickupCache);
    coreSiege.devices=this.syncCollection(s.coreSiege?.devices,this.coreSiegeDeviceCache);
    const siegePlayerById=new Map(coreSiege.players.map((progress:any)=>[String(progress.id??''),progress]));
    for(const player of players){const tactical=tacticalById.get(String(player.id??''));if(tactical)Object.assign(player,tactical);const siege=siegePlayerById.get(String(player.id??''));if(siege)Object.assign(player,siege);}
    const snapshot:Snapshot={
      phase:s.phase,roomCode:s.roomCode,hostId:s.hostId,fillAi:s.fillAi,publicRoom:s.publicRoom,difficulty:s.difficulty,zoneSpeed:s.zoneSpeed,mapId:s.mapId,mapSizeMode:s.mapSizeMode,mapRevision:s.mapRevision,worldSize:s.worldSize,
      zoneX:s.zoneX,zoneY:s.zoneY,zoneRadius:s.zoneRadius,zoneStartX:s.zoneStartX,zoneStartY:s.zoneStartY,zoneStartRadius:s.zoneStartRadius,
      nextZoneX:s.nextZoneX, nextZoneY:s.nextZoneY,nextZoneRadius:s.nextZoneRadius,zoneTimer:s.zoneTimer,zoneStage:s.zoneStage,zoneProgress:s.zoneProgress,zoneActive:Boolean(s.zoneActive),zoneState:s.zoneState,supplySpawned:Boolean(s.supplySpawned),supplyDropId:String(s.supplyDropId??''),
      planeStartX:s.planeStartX,planeStartY:s.planeStartY,planeX:s.planeX,planeY:s.planeY,planeEndX:s.planeEndX,planeEndY:s.planeEndY,planeAngle:s.planeAngle,planeProgress:s.planeProgress,
      serverTime:s.serverTime,serverTickAvg:s.serverTickAvg,serverTickP95:s.serverTickP95,serverTickMax:s.serverTickMax,serverAiMs:s.serverAiMs,serverCollisionMs:s.serverCollisionMs,serverZoneMs:s.serverZoneMs,serverVehicleMs:s.serverVehicleMs,recoveryCount:s.recoveryCount,vehicleRecoveryCount:s.vehicleRecoveryCount,activeBulletLimit:s.activeBulletLimit,
      aliveCount:s.aliveCount,winner:s.winner,werewolfSeason,domination,coreSiege,
      players,tacticalInventories,bullets:this.syncCollection(s.bullets,this.bulletCache),rockets:this.syncCollection(s.rockets,this.rocketCache),loot:this.syncCollection(s.loot,this.lootCache),motorcycles:this.syncCollection(s.motorcycles,this.motorcycleCache),explosions:this.syncCollection(s.explosions,this.explosionCache),thrownObjects:this.syncCollection(s.thrownObjects,this.thrownObjectCache),smokeFields:this.syncCollection(s.smokeFields,this.smokeFieldCache),fireFields:this.syncCollection(s.fireFields,this.fireFieldCache),flameJets:this.syncCollection(s.flameJets,this.flameJetCache),adhesiveJets:this.syncCollection(s.adhesiveJets,this.adhesiveJetCache),stripTraps:this.syncCollection(s.stripTraps,this.stripTrapCache),supplyDrops:this.syncCollection(s.supplyDrops,this.supplyDropCache),receivedAt,
    };
    if(receivedAt-this.bytesWindowAt<1000){
      this.receivedBytesWindow+=220+snapshot.players.length*170+snapshot.bullets.length*70+snapshot.rockets.length*85+snapshot.loot.length*55+snapshot.motorcycles.length*120+snapshot.explosions.length*55+snapshot.thrownObjects.length*100+snapshot.smokeFields.length*60+snapshot.fireFields.length*60+snapshot.flameJets.length*70+snapshot.adhesiveJets.length*70+snapshot.stripTraps.length*75+snapshot.supplyDrops.length*85;
    }
    return snapshot;
  }

  async leave(consented=true){
    window.clearInterval(this.pingTimer);
    const room=this.room;
    this.room=null;
    this.snapshot=null;
    this.roomConfig={gameMode:'battleRoyale',matchFormat:'solo',teamAiBlue:0,teamAiRed:0,maxHumans:8,configuredAiCount:0,maxTotalCombatants:8,spectatorOnly:false,joinInProgress:false,zoneEnabled:true,respawnEnabled:false,killLimit:0,roundState:'active'};
    this.respawnAt=0;this.spawnProtectionUntil=0;this.arenaStatus=null;this.arenaScoreboard=[];this.arenaRound=null;
    this.playerCache.clear();
    this.tacticalInventoryCache.clear();
    this.bulletCache.clear();
    this.lootCache.clear();
    this.rocketCache.clear();
    this.motorcycleCache.clear();
    this.explosionCache.clear();
    this.thrownObjectCache.clear();this.smokeFieldCache.clear();this.fireFieldCache.clear();this.flameJetCache.clear();this.adhesiveJetCache.clear();this.stripTrapCache.clear();this.supplyDropCache.clear();this.coreSiegePlayerCache.clear();this.coreSiegeStructureCache.clear();this.coreSiegeMinionCache.clear();this.coreSiegeCampCache.clear();this.coreSiegeUpgradeCache.clear();this.coreSiegePickupCache.clear();this.coreSiegeDeviceCache.clear();
    this.patchIntervals=[];
    this.snapshotProcessSamples=[];
    this.lastPatchAt=0;
    this.receivedBytesWindow=0;
    this.bytesPerSecond=0;
    this.rtt=0;
    if(room){try{await room.leave(consented);}catch{/* connection may already be closed */}}
    this.listeners.forEach((listener)=>listener());
  }

  get patchInterval(){
    if(!this.patchIntervals.length)return 0;
    return this.patchIntervals.reduce((sum,value)=>sum+value,0)/this.patchIntervals.length;
  }
  private percentile(values:number[],ratio:number){if(!values.length)return 0;const sorted=[...values].sort((a,b)=>a-b);return sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*ratio))]??0;}
  get patchIntervalP95(){return this.percentile(this.patchIntervals,.95);}
  get patchIntervalMax(){return this.patchIntervals.length?Math.max(...this.patchIntervals):0;}
  get snapshotProcessP95(){return this.percentile(this.snapshotProcessSamples,.95);}
  get snapshotProcessMax(){return this.snapshotProcessSamples.length?Math.max(...this.snapshotProcessSamples):0;}
  get incomingBytesPerSecond(){return this.bytesPerSecond;}
  send(type:string,payload?:any){this.room?.send(type,payload);}
  get sessionId(){return this.room?.sessionId??'';}
}
