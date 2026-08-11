// DROP8_REFACTOR_047_AI_VEHICLE_BRAIN
import { describe,expect,it,vi } from 'vitest';
import { MAP_CONFIGS, TANK_BALANCE } from '@drop8/shared';
import { Drop8Room } from '../src/rooms/Drop8Room.js';
import {
  AI_VEHICLE_BRAIN,
  aiVehicleRecoveryDecision,
  aiVehicleShouldBrake,
  canAiVehicleCombatDismount,
  canStartAiVehiclePlan,
  canUseAiVehicle,
  createAiVehicleMemory,
  recordAiVehicleExit,
  recordAiVehicleMount,
  shouldAiVehicleKeepPatrolling,
} from '../src/rooms/aiVehicleBrain.js';
import { MotorcycleState, PlayerState } from '../src/rooms/schema.js';

function makeRoom(clock:{value:number}){
  const room=new Drop8Room() as any;
  const map={...MAP_CONFIGS.small,collisionObstacles:[],bulletObstacles:[],visibilityObstacles:[],buildingVisibilityZones:[],rooms:[],portals:[],rivers:[],landCrossings:[],shallowWaterZones:[],bushes:[]};
  Object.defineProperty(room,'map',{value:map});
  room.now=()=>clock.value;room.state.phase='ACTIVE';room.state.mapId='small';room.state.mapSizeMode='small';room.state.worldSize=map.width;room.state.aliveCount=8;
  room.emitAudioEvent=vi.fn();room.broadcast=vi.fn();room.system=vi.fn();room.firstObstacleHitT=()=>null;
  return room;
}

function ai(id:string,x=600,y=600){
  const p=new PlayerState();p.id=id;p.name=id;p.ai=true;p.alive=true;p.phase='landed';p.x=x;p.y=y;p.hp=100;p.angle=0;p.equipped='fists';p.melee='fists';return p;
}

function vehicle(id:string,x=600,y=600,kind:'motorcycle'|'tank'='motorcycle'){
  const value=new MotorcycleState();value.id=id;value.vehicleKind=kind;value.x=x;value.y=y;value.lastSafeX=x;value.lastSafeY=y;value.hp=kind==='tank'?TANK_BALANCE.maxHp:180;value.maxHp=value.hp;value.tankShells=kind==='tank'?TANK_BALANCE.cannonShells:0;return value;
}

function drivePlan(vehicleId:string,targetX=1600,targetY=600,now=10){
  return{vehicleId,preferredVehicleId:vehicleId,phase:'drive',objectiveKind:'patrol',objectiveId:'patrol',targetX,targetY,startedAt:now,expiresAt:now+30,avoidSign:1,stuckFor:0,reverseUntil:0,lastX:600,lastY:600,phaseStartedAt:now,mountedAt:now,recoveryAttempts:0,lastRecoveryAt:-99,braking:false,patrolGeneration:0};
}

describe('Refactor 047 AI vehicle brain contracts',()=>{
  it('blocks rapid replanning and reuse after a combat dismount',()=>{
    const memory=createAiVehicleMemory();recordAiVehicleMount(memory,'bike-a',10);recordAiVehicleExit(memory,'bike-a',14,'combat');
    expect(canStartAiVehiclePlan(memory,14+AI_VEHICLE_BRAIN.planCooldownSeconds.combat-.01)).toBe(false);
    expect(canStartAiVehiclePlan(memory,14+AI_VEHICLE_BRAIN.planCooldownSeconds.combat)).toBe(true);
    expect(canUseAiVehicle(memory,'bike-a',14+AI_VEHICLE_BRAIN.blockSeconds.combat-.01)).toBe(false);
    expect(canUseAiVehicle(memory,'bike-a',14+AI_VEHICLE_BRAIN.blockSeconds.combat)).toBe(true);
  });

  it('allows an intentional objective stop to return to the same vehicle',()=>{
    const memory=createAiVehicleMemory();recordAiVehicleMount(memory,'bike-a',10);recordAiVehicleExit(memory,'bike-a',14,'objective');
    expect(canStartAiVehiclePlan(memory,14)).toBe(true);expect(canUseAiVehicle(memory,'bike-a',14)).toBe(true);
  });

  it('tries two local recoveries before abandoning a failed direction',()=>{
    expect(aiVehicleRecoveryDecision(0)).toBe('reverse');expect(aiVehicleRecoveryDecision(1)).toBe('reverse');expect(aiVehicleRecoveryDecision(2)).toBe('abandon');
  });

  it('brakes from speed before entering the arrival radius',()=>{
    expect(aiVehicleShouldBrake(205,220,145,400)).toBe(true);
    expect(aiVehicleShouldBrake(520,220,145,400)).toBe(false);
    expect(aiVehicleShouldBrake(205,20,145,400)).toBe(false);
  });

  it('enforces a minimum useful ride and permanent mechanical patrol',()=>{
    expect(canAiVehicleCombatDismount(10,13.99,200)).toBe(false);expect(canAiVehicleCombatDismount(10,14,200)).toBe(true);
    expect(shouldAiVehicleKeepPatrolling('tank','patrol')).toBe(true);expect(shouldAiVehicleKeepPatrolling('fusion_robot','patrol')).toBe(true);expect(shouldAiVehicleKeepPatrolling('motorcycle','patrol')).toBe(false);
  });
});

describe('Refactor 047 AI vehicle brain integration',()=>{
  it('stays mounted during grace, then dismounts for combat without instantly remounting',()=>{
    const clock={value:10},room=makeRoom(clock),driver=ai('driver'),enemy=ai('enemy',820,600),bike=vehicle('bike-a');enemy.ai=false;
    room.state.players.set(driver.id,driver);room.state.players.set(enemy.id,enemy);room.state.motorcycles.set(bike.id,bike);
    const intent=room.newAiIntent(driver);intent.state='PATROL';intent.routeGoalX=1600;intent.routeGoalY=600;room.aiIntent.set(driver.id,intent);room.findVisibleTarget=()=>enemy;room.isDismountPositionFree=()=>true;
    expect(room.maybeStartAiVehiclePlan(driver,intent)).toBe(true);expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(true);expect(driver.isDriving).toBe(true);
    clock.value=13.9;expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(true);expect(driver.isDriving).toBe(true);
    clock.value=14.01;expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(false);expect(driver.isDriving).toBe(false);expect(room.aiVehicleMemories.get(driver.id).lastExitReason).toBe('combat');
    intent.state='PATROL';intent.routeGoalX=1600;intent.routeGoalY=600;
    clock.value=22.02;expect(room.maybeStartAiVehiclePlan(driver,intent)).toBe(false);
    clock.value=24.02;expect(room.maybeStartAiVehiclePlan(driver,intent)).toBe(true);
  });

  it('brakes near an objective before dismounting at low speed',()=>{
    const clock={value:10},room=makeRoom(clock),driver=ai('brake-driver'),bike=vehicle('brake-bike');room.state.players.set(driver.id,driver);room.state.motorcycles.set(bike.id,bike);room.isDismountPositionFree=()=>true;
    expect(room.mountMotorcycle(driver,bike)).toBe(true);const intent=room.newAiIntent(driver);room.aiIntent.set(driver.id,intent);room.aiVehiclePlans.set(driver.id,drivePlan(bike.id,795,600));
    bike.velocityX=220;bike.speed=220;
    expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(true);expect(driver.aiState).toBe('VEHICLE_BRAKE');expect(room.inputs.get(driver.id).x).toBe(0);expect(driver.isDriving).toBe(true);
    bike.x=700;bike.velocityX=0;bike.speed=0;driver.x=bike.x;
    expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(false);expect(driver.isDriving).toBe(false);expect(room.aiVehiclePlans.get(driver.id).phase).toBe('walk');
  });

  it('abandons a blocked vehicle after exactly two reverse recoveries',()=>{
    const clock={value:10},room=makeRoom(clock),driver=ai('stuck-driver'),bike=vehicle('stuck-bike');room.state.players.set(driver.id,driver);room.state.motorcycles.set(bike.id,bike);
    expect(room.mountMotorcycle(driver,bike)).toBe(true);const intent=room.newAiIntent(driver);room.aiIntent.set(driver.id,intent);room.aiVehiclePlans.set(driver.id,drivePlan(bike.id));room.isVehiclePositionFree=()=>false;room.segmentBlocked=()=>true;
    expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(true);expect(room.aiVehiclePlans.get(driver.id).recoveryAttempts).toBe(1);
    clock.value+=AI_VEHICLE_BRAIN.reverseDurationSeconds+.01;expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(true);expect(room.aiVehiclePlans.get(driver.id).recoveryAttempts).toBe(2);
    clock.value+=AI_VEHICLE_BRAIN.reverseDurationSeconds+.01;expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(false);expect(driver.isDriving).toBe(false);expect(room.aiVehiclePlans.has(driver.id)).toBe(false);expect(room.aiVehicleMemories.get(driver.id).recoveryCount).toBe(2);expect(room.aiVehicleMemories.get(driver.id).lastExitReason).toBe('stuck');
  });

  it('retargets a tank patrol without ejecting its driver',()=>{
    const clock={value:10},room=makeRoom(clock),driver=ai('tank-driver'),tank=vehicle('tank-a',600,600,'tank');room.state.players.set(driver.id,driver);room.state.motorcycles.set(tank.id,tank);room.tacticalInventory(driver.id).tankKeyCount=1;
    expect(room.mountMotorcycle(driver,tank)).toBe(true);const intent=room.newAiIntent(driver);room.aiIntent.set(driver.id,intent);room.aiPatrolPoint=()=>({x:1300,y:700});room.aiVehiclePlans.set(driver.id,drivePlan(tank.id,620,600));
    expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(true);expect(driver.isDriving).toBe(true);expect(tank.driverId).toBe(driver.id);expect(room.aiVehiclePlans.get(driver.id).targetX).toBe(1300);expect(room.aiVehiclePlans.get(driver.id).phase).toBe('drive');
  });

  it('cycles mechanical patrol points inside an active safe zone',()=>{
    const clock={value:10},room=makeRoom(clock),driver=ai('zone-tank'),tank=vehicle('zone-tank-a',600,600,'tank');room.state.players.set(driver.id,driver);room.state.motorcycles.set(tank.id,tank);room.tacticalInventory(driver.id).tankKeyCount=1;room.state.zoneActive=true;room.state.zoneX=1600;room.state.zoneY=1600;room.state.zoneRadius=900;
    expect(room.mountMotorcycle(driver,tank)).toBe(true);const intent=room.newAiIntent(driver),plan=drivePlan(tank.id,610,600);room.aiIntent.set(driver.id,intent);room.aiVehiclePlans.set(driver.id,plan);
    expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(true);const first={x:plan.targetX,y:plan.targetY};expect(plan.patrolGeneration).toBe(1);
    tank.x=first.x;tank.y=first.y;tank.velocityX=0;tank.velocityY=0;tank.speed=0;driver.x=tank.x;driver.y=tank.y;clock.value+=.1;
    expect(room.updateAiVehiclePlan(driver,intent,.05)).toBe(true);expect(plan.patrolGeneration).toBe(2);expect(Math.hypot(plan.targetX-first.x,plan.targetY-first.y)).toBeGreaterThan(100);expect(driver.isDriving).toBe(true);
  });
});
