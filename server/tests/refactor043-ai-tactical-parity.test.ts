import { describe,expect,it,vi } from 'vitest';
import { EMP_EXO_SUIT_BALANCE, EXO_SUIT_BALANCE, MAP_CONFIGS, SPIDER_MINE_BALANCE, STRIP_TRAP_BALANCE, TANK_BALANCE, THROWABLE_CONFIGS } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import { MotorcycleState, PlayerState } from '../src/rooms/schema.js';

function makeRoom(clock:{value:number}){
  const room=new Drop8Room() as any,map={...MAP_CONFIGS.small,collisionObstacles:[],bulletObstacles:[],visibilityObstacles:[],buildingVisibilityZones:[],rooms:[],portals:[],rivers:[],landCrossings:[],shallowWaterZones:[],bushes:[]};
  Object.defineProperty(room,'map',{value:map});
  room.now=()=>clock.value;room.state.phase='ACTIVE';room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=map.width;room.state.aliveCount=8;
  room.emitAudioEvent=vi.fn();room.broadcast=vi.fn();room.system=vi.fn();room.firstObstacleHitT=()=>null;
  return room;
}

function ai(id:string,x=600,y=600){
  const p=new PlayerState();p.id=id;p.name=id;p.ai=true;p.alive=true;p.phase='landed';p.x=x;p.y=y;p.hp=100;p.angle=0;p.equipped='fists';p.melee='fists';return p;
}

function tank(id:string,x:number,y:number){
  const vehicle=new MotorcycleState();vehicle.id=id;vehicle.vehicleKind='tank';vehicle.x=x;vehicle.y=y;vehicle.lastSafeX=x;vehicle.lastSafeY=y;vehicle.hp=TANK_BALANCE.maxHp;vehicle.maxHp=TANK_BALANCE.maxHp;vehicle.tankShells=TANK_BALANCE.cannonShells;return vehicle;
}

describe('Refactor 043 AI tactical parity',()=>{
  it('values every tactical pickup and stops valuing full inventory',()=>{
    const clock={value:10},room=makeRoom(clock),p=ai('loot-ai'),vehicle=tank('center-tank',1800,1800);room.state.players.set(p.id,p);room.state.motorcycles.set(vehicle.id,vehicle);
    for(const kind of ['tank_key','exo_head','emp_exo_core','hunter_drone','spider_mine','strip_trap','fragGrenade'] as const)expect(room.aiLootScore(p,kind),kind).toBeGreaterThan(0);
    const tactical=room.tacticalInventory(p.id);tactical.tankKeyCount=1;tactical.hunterDroneCount=4;tactical.spiderMineCount=SPIDER_MINE_BALANCE.maxCarry;tactical.stripTrapCount=STRIP_TRAP_BALANCE.maxCarry;tactical.exoHeadCount=1;
    p.throwableType='fragGrenade';p.throwableCount=THROWABLE_CONFIGS.fragGrenade.maxCount;
    for(const kind of ['tank_key','exo_head','hunter_drone','spider_mine','strip_trap','fragGrenade'] as const)expect(room.aiLootScore(p,kind),kind).toBe(0);
  });

  it('turns a tank key into a dedicated seek, mount and cannon combat plan',()=>{
    const clock={value:10},room=makeRoom(clock),p=ai('tank-ai',580,600),vehicle=tank('key-tank',600,600),enemy=ai('tank-enemy',980,600);enemy.ai=false;
    room.state.players.set(p.id,p);room.state.players.set(enemy.id,enemy);room.state.motorcycles.set(vehicle.id,vehicle);room.tacticalInventory(p.id).tankKeyCount=1;
    const intent=room.newAiIntent(p);room.aiIntent.set(p.id,intent);room.aiPatrolPoint=()=>({x:1600,y:600});
    expect(room.maybeStartAiVehiclePlan(p,intent)).toBe(true);expect(room.aiVehiclePlans.get(p.id)?.objectiveKind).toBe('tank');
    expect(room.updateAiVehiclePlan(p,intent,.05)).toBe(true);expect(p.isDriving).toBe(true);expect(vehicle.driverId).toBe(p.id);expect(room.aiVehiclePlans.get(p.id)?.objectiveKind).toBe('patrol');
    room.findVisibleTarget=()=>enemy;clock.value+=2;
    expect(room.updateAiVehiclePlan(p,intent,.05)).toBe(true);expect(p.isDriving).toBe(true);expect(vehicle.tankShells).toBe(TANK_BALANCE.cannonShells-1);expect(room.state.rockets.size).toBe(1);
  });

  it('assembles a preferred three-part robot and a complete six-part fusion robot',()=>{
    const clock={value:10},room=makeRoom(clock),assault=ai('assault-ai',700,700);room.state.players.set(assault.id,assault);room.aiRobotDecision.set(assault.id,'assault');
    const assaultInventory=room.tacticalInventory(assault.id);assaultInventory.exoHeadCount=1;assaultInventory.exoCoreCount=1;assaultInventory.exoLimbsCount=1;
    const assaultIntent=room.newAiIntent(assault);expect(room.maybeActivateAiRobot(assault,assaultIntent)).toBe(true);expect(assaultInventory.exoAssembling).toBe(true);
    clock.value+=EXO_SUIT_BALANCE.assemblySeconds+.01;room.updateExoSuits();expect(assaultInventory.exoActive).toBe(true);expect(assaultInventory.exoKind).toBe('assault');

    const fusion=ai('fusion-ai',1200,1200);room.state.players.set(fusion.id,fusion);room.aiRobotDecision.set(fusion.id,'fusion');room.aiPatrolPoint=()=>({x:1800,y:1200});room.isVehiclePositionFree=()=>true;
    const fusionInventory=room.tacticalInventory(fusion.id);for(const key of ['exoHeadCount','exoCoreCount','exoLimbsCount','empExoHeadCount','empExoCoreCount','empExoLimbsCount'])fusionInventory[key]=1;
    const fusionIntent=room.newAiIntent(fusion);expect(room.maybeActivateAiRobot(fusion,fusionIntent)).toBe(true);expect(fusion.isDriving).toBe(true);
    const robot=room.state.motorcycles.get(fusion.vehicleId);expect(robot?.vehicleKind).toBe('fusion_robot');expect(room.aiVehiclePlans.get(fusion.id)?.phase).toBe('drive');
  });

  it('uses the blue robot EMP and machine gun against a mounted target',()=>{
    const clock={value:20},room=makeRoom(clock),p=ai('emp-ai',800,800),enemy=ai('emp-target',1020,800),vehicle=new MotorcycleState();enemy.ai=false;room.state.players.set(p.id,p);room.state.players.set(enemy.id,enemy);
    const exo=room.tacticalInventory(p.id);exo.exoActive=true;exo.exoKind='emp';exo.exoHp=EMP_EXO_SUIT_BALANCE.maxHp;exo.empPulseReadyAt=0;
    vehicle.id='enemy-bike';vehicle.x=enemy.x;vehicle.y=enemy.y;vehicle.driverId=enemy.id;vehicle.hp=180;vehicle.maxHp=180;enemy.isDriving=true;enemy.vehicleId=vehicle.id;room.state.motorcycles.set(vehicle.id,vehicle);
    const intent=room.newAiIntent(p);intent.targetId=enemy.id;room.aiIntent.set(p.id,intent);room.aiCanVisuallyAcquire=()=>true;
    expect(room.runAiExoCombat(p,enemy,intent,.1)).toBe(true);expect(vehicle.empDisabledUntil).toBe(clock.value+EMP_EXO_SUIT_BALANCE.empDisableSeconds);expect(room.state.bullets.size).toBe(1);
    exo.empDisabledUntil=clock.value+2;room.updateAi(.05);expect(p.aiState).toBe('EMP_DISABLED');expect(room.inputs.get(p.id)?.x).toBe(0);
  });

  it('launches drones, throws grenades and places both tactical traps',()=>{
    const clock={value:30},room=makeRoom(clock),enemy=ai('tactical-target',950,700);enemy.ai=false;room.state.players.set(enemy.id,enemy);

    const droneAi=ai('drone-ai',700,700);room.state.players.set(droneAi.id,droneAi);room.tacticalInventory(droneAi.id).hunterDroneCount=2;
    expect(room.runAiTacticalActions(droneAi,enemy)).toBe(true);expect(room.tacticalInventory(droneAi.id).hunterDroneCount).toBe(0);expect([...room.state.thrownObjects.values()].filter((object:any)=>object.kind==='hunterDrone')).toHaveLength(2);

    const throwAi=ai('throw-ai',700,760);room.state.players.set(throwAi.id,throwAi);throwAi.throwableType='fragGrenade';throwAi.throwableCount=1;
    expect(room.runAiTacticalActions(throwAi,enemy)).toBe(true);expect(throwAi.throwableCount).toBe(0);expect([...room.state.thrownObjects.values()].some((object:any)=>object.kind==='fragGrenade')).toBe(true);

    const mineAi=ai('mine-ai',700,820);room.state.players.set(mineAi.id,mineAi);room.tacticalInventory(mineAi.id).spiderMineCount=1;room.isPositionFree=()=>true;room.terrainKindAt=()=> 'land';
    expect(room.runAiTacticalActions(mineAi,enemy)).toBe(true);expect([...room.state.thrownObjects.values()].some((object:any)=>object.kind==='spiderMine'&&object.ownerId===mineAi.id)).toBe(true);

    const trapAi=ai('trap-ai',700,900),driver=ai('trap-driver',980,900),enemyBike=new MotorcycleState();driver.ai=false;driver.isDriving=true;driver.vehicleId='trap-bike';enemyBike.id=driver.vehicleId;enemyBike.x=driver.x;enemyBike.y=driver.y;enemyBike.driverId=driver.id;enemyBike.hp=180;enemyBike.maxHp=180;room.state.players.set(trapAi.id,trapAi);room.state.players.set(driver.id,driver);room.state.motorcycles.set(enemyBike.id,enemyBike);room.tacticalInventory(trapAi.id).stripTrapCount=1;
    expect(room.runAiTacticalActions(trapAi,driver)).toBe(true);expect([...room.state.stripTraps.values()].some((trap:any)=>trap.ownerId===trapAi.id)).toBe(true);
  });

  it('uses claws at close range and requests sprint while hunting at range',()=>{
    const clock={value:40},room=makeRoom(clock),wolf=ai('wolf-ai',900,900),close=ai('wolf-close',970,900);close.ai=false;wolf.werewolf.transformed=true;room.state.players.set(wolf.id,wolf);room.state.players.set(close.id,close);room.aiCanVisuallyAcquire=()=>true;room.canSeeTarget=()=>true;room.damage=vi.fn();
    const intent=room.newAiIntent(wolf);expect(room.runAiWerewolfCombat(wolf,close,intent,.1)).toBe(true);expect(wolf.attackSeq).toBe(1);expect(room.damage).toHaveBeenCalledWith(close,expect.any(Number),wolf.id,expect.any(String),expect.any(Number),undefined,'melee');
    const far=ai('wolf-far',1300,900);far.ai=false;room.state.players.set(far.id,far);clock.value+=1;const chase=room.newAiIntent(wolf);expect(room.runAiWerewolfCombat(wolf,far,chase,.1)).toBe(true);expect(room.inputs.get(wolf.id)?.huntSprint).toBe(true);expect(chase.state).toBe('WEREWOLF_HUNT');
  });
});
