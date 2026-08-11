// DROP8_REFACTOR_028_RECURRING_WEREWOLF_RITUAL_CYCLE
// DROP8_REFACTOR_025A_OPEN_ARENA_HUD_LAYOUT_HOTFIX
// DROP8_REFACTOR_024C_OPEN_ARENA_RESPAWN
// DROP8_REFACTOR_023_AI_SAFE_ZONE_SWEEP_LIVE_SPECTATOR_DIALOGUE
// DROP8_REFACTOR_021_AI_PERSONA_DIALOGUE
// DROP8_REFACTOR_020_WEREWOLF_PREDATOR_ADHESIVE_BALANCE
// DROP8_REFACTOR_019_AI_HUMANIZATION
// DROP8_REFACTOR_018_WEREWOLF_SEASON
// DROP8_REFACTOR_017_ADHESIVE_STRIP_LOBBY_BAZOOKA_WATER
// DROP8_REFACTOR_015A_SUPPLY_DROP_FLAMETHROWER
// DROP8_REFACTOR_014_PLANE_VISIBILITY_BAZOOKA_SLOT_SWAP
// DROP8_REFACTOR_013H_FIXED_V3_VISIBILITY_ROOF_RIVER_ZONE_SNIPER_AI
// DROP8_REFACTOR_013H_VISIBILITY_ROOF_RIVER_ZONE_SNIPER
// DROP8_REFACTOR_013G_DOCK8_RECOVERY
// DROP8_REFACTOR_013H1_LARGE_NESTED_ROOM_WINDOW_DOCK8_TERRAIN_LOOT
import Phaser from 'phaser';
import {
// DROP8_REFACTOR_013_INTERIOR_RIVER_DOCK8
  AI_DIALOGUE_LINES, BAZOOKA_BALANCE, LASER_CANNON_BALANCE, BUSH_HIDE_DISTANCE, CORE_SIEGE_CONFIG, CORE_SIEGE_HEROES, CORE_SIEGE_POSITIONING, EMP_EXO_SUIT_BALANCE, EXO_SUIT_BALANCE, FUSION_ROBOT_BALANCE, LOOT_COLORS, LOOT_LABELS, MELEE_WEAPONS, SPIDER_MINE_BALANCE, TANK_BALANCE, THROWABLE_CONFIGS, THROWABLE_MAX_CHARGE_MS, MOTORCYCLE_BALANCE, MOTORCYCLE_DESTRUCTION_BALANCE, MOTORCYCLE_DIRECT_ACCELERATION, MOTORCYCLE_DIRECT_DECELERATION, MOTORCYCLE_LAUNCH_SPEED, MOTORCYCLE_MAX_SPEED, MOTORCYCLE_MOUNT_DISTANCE, MOTORCYCLE_RADIUS, MOTORCYCLE_ROTATION_RESPONSE, MOTORCYCLE_MAX_TURN_RATE, MOTORCYCLE_SCOPE_SPEED_RATIO, PLAYER_BODY_RADIUS, PLAYER_HIT_RADIUS, PLAYER_SEPARATION_RADIUS, PLAYER_SPEED, SNIPER_SCOPE_MOVE_MULTIPLIER,
  REGION_THEMES, RENDER_DEPTH, WEAPONS, WEREWOLF_BALANCE, adhesivePlayerSpeedMultiplier, werewolfSpeed, PORTAL_SELECTION_BALANCE, WINDOW_PORTAL_FEATHER, angleAwarePortalPolygon, buildingIdAt, buildingSpacesInteractable, buildingZoneById, buildingZonesAt, circleHitsRect, clamp, coreSiegeHeroMoveMultiplier, coreSiegeHeroSlowResistance, coreSiegeLayout, coreSiegeSmokeTrackerConcealed, createThrowableMotion, crossSpaceOpening, distance, dominationWallsForMap, doorPortalOpening, findPortalVaultCandidate, getMapConfig, motorcycleDirectionRetention, motorcycleSpeedMultiplier, isThrowableType, motorcycleSpreadRadians, normalizeAimVector, predictThrowableTrajectory, normalizeMovementInput, pointInDirectionalScope, regionAt, segmentClearOfRects, segmentRectIntersectionT, selectActivePortal, smokeVisibilityBetween, spaceAt, spaceInteractionAllowed, traceSpaceVisibility, movementMultiplierAt, terrainAt, SWIM_SPEED, soundOcclusionBetween, targetVisibilitySamples, throwableEffectRadius,
  type CoreSiegeAbilitySlot, type CoreSiegeHeroId, type DecorKind, type EquippedId, type FusionRobotWeaponSlot, type LootKind, type MapConfig, type MapId, type WeaponId, type MeleeId, type ThrowableType, type WindowOpening
} from '@drop8/shared';
import { CHICKEN_BLASTER_BALANCE } from '@drop8/shared';
import type { Network } from './network';
import { pushPositionSnapshot, samplePosition, zoneDirection, type PositionSnapshot, type VisibilityResult } from './interpolation';
import { audio, soundIdForWeapon, type AudioEventMessage, type SoundId } from './audio';
import { cycleSpectatorTarget, resolveSpectatorTarget } from './spectatorTarget';
import { mobileControls } from './mobileControls';
import { fixedHudPoint, resolveFixedHudTransform, resolveMinimapLayout } from './minimapLayout';

type DisplayPoint={x:number;y:number};
type MobileAimAssistResult={x:number;y:number;targetId:string};
type MobileSmartAction={label:string;action:'none'|'interact'|'jump'|'vault'|'ritual'|'werewolfTransform'};
type TargetVisibilityResult=VisibilityResult&{nameplateVisible:boolean;vehicleVisible:boolean;portalKind:'same'|'door'|'window'|'none';portalOpeningId:string;portalViewMode:'front'|'side'|'peripheral'|'none';revealStrength:number};
type CharacterDeathPayload={entityId?:string;entityType?:'player'|'ai';x?:number;y?:number;angle?:number;buildingId?:string;displayName?:string;ai?:boolean;equipped?:EquippedId;killerId?:string;cause?:string;hitDirectionX?:number;hitDirectionY?:number;inBush?:boolean;bushRevealed?:boolean;diedAt?:number};
type DeathVisual={entityId:string;x:number;y:number;angle:number;buildingId:string;ai:boolean;equipped:EquippedId;cause:string;hitDirectionX:number;hitDirectionY:number;startedAt:number;duration:number;pushDistance:number;inBush:boolean;bushRevealed:boolean;local:boolean};
type AiDialoguePayload={playerId?:string;speakerId?:string;sender?:string;lineId?:string;text?:string;category?:string;channel?:string;time?:number;sentAt?:number;durationMs?:number;loggable?:boolean};
type ChatPayload={playerId?:string;sender?:string;nickname?:string;text?:string;channel?:string;time?:number;sentAt?:number;durationMs?:number};
type EmpAffectedTargetVisual={id:string;x:number;y:number;velocityX:number;velocityY:number;kind:string};
type EmpPulseVisual={x:number;y:number;radius:number;born:number;shockUntil:number;until:number;affectedTargets:EmpAffectedTargetVisual[]};
type CoreSiegeEffectVisual={kind:string;effectId:string;born:number;until:number;payload:any};
type PlayerOverlay={
  container:Phaser.GameObjects.Container;
  name:Phaser.GameObjects.Text;
  bubbleBg:Phaser.GameObjects.Graphics;
  bubbleText:Phaser.GameObjects.Text;
  bubbleExpiresAt:number;
  displayName:string;
};

export class GameScene extends Phaser.Scene {
  private staticG!:Phaser.GameObjects.Graphics;
  private dynamicG!:Phaser.GameObjects.Graphics;
  private windowRevealG!:Phaser.GameObjects.Graphics;
  private planeShadowG!:Phaser.GameObjects.Graphics;
  private planeG!:Phaser.GameObjects.Graphics;
  private debugG!:Phaser.GameObjects.Graphics;
  private slowG!:Phaser.GameObjects.Graphics;
  private hitG!:Phaser.GameObjects.Graphics;
  private crosshairG!:Phaser.GameObjects.Graphics;
  private throwGuideG!:Phaser.GameObjects.Graphics;
  private abilityGuideG!:Phaser.GameObjects.Graphics;
  private foliageG!:Phaser.GameObjects.Graphics;
  private mini!:Phaser.GameObjects.Graphics;
  private miniStatic!:Phaser.GameObjects.Graphics;
  private miniStaticKey='';
  private indoorMaskG!:Phaser.GameObjects.Graphics;
  private terrainDebugText?:Phaser.GameObjects.Text;
  private terrainDebugEnabled=false;
  private buildingRoofs=new Map<string,Phaser.GameObjects.Graphics>();
  private mapLabels:Phaser.GameObjects.Text[]=[];
  private mapConfig:MapConfig=getMapConfig('small');
  private mapRevision=-1;
  private practiceMapRendered=false;
  private pickupText!:Phaser.GameObjects.Text;
  private fpsText!:Phaser.GameObjects.Text;
  private perfText!:Phaser.GameObjects.Text;
  private regionText!:Phaser.GameObjects.Text;
  private keys!:Record<string,Phaser.Input.Keyboard.Key>;
  private seq=0;
  private lastInput=0;
  private lastSentAimAngle=0;
  private lastFire=0;
  private lastMiniDraw=0;
  private lastSlowDraw=0;
  private lastFpsDraw=0;
  private mapOpen=false;
  private miniBounds?:{x:number;y:number;w:number;h:number};
  private spectateTargetId='';
  private displayPlayers=new Map<string,DisplayPoint>();
  private remoteBuffers=new Map<string,PositionSnapshot[]>();
  private lastVisibility=new Map<string,boolean>();
  private revealStartedAt=new Map<string,number>();
  private framePositions=new Map<string,{x:number;y:number;angle:number}>();
  private frameVisibility=new Map<string,TargetVisibilityResult>();
  private resolvedSpaceCache?:{id:string;x:number;y:number;phase:string;buildingId:string;roomIndex:number;result:{buildingId:string;roomIndex:number;outdoors:boolean}};
  private perfVisible=false;
  private debugWorldVisible=false;
  private snapCorrections=0;
  private bufferMisses=0;
  private frameTimeSamples:number[]=[];
  private lastFoliageDraw=0;
  private displayBullets=new Map<string,DisplayPoint>();
  private displayMotorcycles=new Map<string,{x:number;y:number;rotation:number;speed:number;velocityX:number;velocityY:number}>();
  private lastAttackSeq=new Map<string,number>();
  private attackStartedAt=new Map<string,number>();
  private lastHitSeq=new Map<string,number>();
  private hitStartedAt=new Map<string,number>();
  private predictedLocal:DisplayPoint|null=null;
  private werewolfPredictionVector:DisplayPoint|null=null;
  private localAimAngle=0;
  private localAimX=1;
  private localAimY=0;
  private scopeRequested=false;
  private secondaryWasDown=false;
  private mobileAimWasActive=false;
  private mobileFireWasActive=false;
  private laserCannonInputHeld=false;
  private laserCannonInputStartedAt=0;
  private laserCannonChargeCueSent=false;
  private mobileInteractWasHeld=false;
  private mobileAimGuideActive=false;
  private mobilePrecisionRelease=false;
  private mobileAimAssistTargetId='';
  private mobileAimAssistActive=false;
  private scopeBlend=0;
  private scopeCanvas?:HTMLCanvasElement;
  private scopeContext?:CanvasRenderingContext2D;
  private windowVisionCanvas?:HTMLCanvasElement;
  private windowVisionContext?:CanvasRenderingContext2D;
  private pointerScreenX=0;
  private pointerScreenY=0;
  private crosshairKick=0;
  private localVehicleHeldMs=0;
  private localVehicleInputX=0;
  private localVehicleInputY=0;
  private localVehicleTurnPenaltyUntil=0;
  private localHitUntil=0;
  private localHitDuration=220;
  private localHitSeverity=0;
  private localHitAngle=0;
  private lastScopeNoticeAt=0;
  private seenExplosionIds=new Set<string>();
  // DROP8_REFACTOR_012A_SMOKE_MOTORCYCLE_AI_NAV
  private localThrowStartedAt=0;
  private localThrowPreparing=false;
  private localThrowVehicleId='';
  private coreSiegeTargetingSlot:CoreSiegeAbilitySlot|0=0;
  private coreSiegeTargetingStartedAt=0;
  private coreSiegeSuppressFireUntil=0;
  private coreSiegeEffects:CoreSiegeEffectVisual[]=[];
  private coreSiegeSkillLabRate=1;
  private coreSiegeSkillLabRateHandler=(event:Event)=>{const rate=Number((event as CustomEvent<{rate?:number}>).detail?.rate);this.coreSiegeSkillLabRate=rate===0||rate===.5?rate:1;};
  private deathVisuals:DeathVisual[]=[];
  private localDeathPoint:DisplayPoint|null=null;
  private localDeathCameraUntil=0;
  private portalRevealKeys=new Set<string>();
  private viewerPoint:DisplayPoint|null=null;
  private viewerPlayer:any=null;
  private activeBuildingId='';
  private activePortalId='';
  private activePortalBuildingId='';
  private activePortalKind:''|'door'|'window'='';
  private activePortalSelectedAt=0;
  private currentRegionId='';
  private chatBlocked=false;
  private playerOverlays=new Map<string,PlayerOverlay>();
  private movementAudio=new Map<string,{x:number;y:number;distance:number;lastStepAt:number;lastBushAt:number;vaulting:boolean}>();
  private vehicleAudioLoops=new Map<string,string>();
  private vehicleAudioState=new Map<string,{hp:number;critical:boolean;exploding:boolean;driverId:string}>();
  private vehicleWarningAt=new Map<string,number>();
  private lastLowHealthAt=0;
  private lastZoneState='';
  private zoneWarningStage='';
  private lastPhase='';
  private exoLasers:Array<{x1:number;y1:number;x2:number;y2:number;born:number;until:number}>=[];
  private laserCannonBeams:Array<{x1:number;y1:number;x2:number;y2:number;born:number;until:number;travelMs:number;impacts:Array<{x:number;y:number;t:number}>}>=[];
  private empPulses:EmpPulseVisual[]=[];
  private lastExoLaser=0;
  private chatMessageHandler=(type:string,payload:any)=>{
    if(type==='chat')this.receiveChat(payload as ChatPayload);
    if(type==='aiDialogue')this.receiveAiDialogue(payload as AiDialoguePayload);
    if(type==='positionRecovery')this.receivePositionRecovery(payload);
    if(type==='vehicleRecovery')this.receiveVehicleRecovery(payload);
    if(type==='characterDeath')this.receiveCharacterDeath(payload as CharacterDeathPayload);
    if(type==='respawned')this.receiveOpenArenaRespawn(payload);
    if(type==='audioEvent')this.receiveAudioEvent(payload as AudioEventMessage);
    if(type==='exoLaser'){const born=this.time.now;this.exoLasers.push({x1:Number(payload?.x1),y1:Number(payload?.y1),x2:Number(payload?.x2),y2:Number(payload?.y2),born,until:born+Math.max(180,Number(payload?.duration??.28)*1000)});}
    if(type==='laserCannonShot'){const born=this.time.now,travelMs=Math.max(120,Number(payload?.travelSeconds??.2)*1000),impacts=Array.isArray(payload?.impacts)?payload.impacts.slice(0,LASER_CANNON_BALANCE.maxPenetrationTargets).map((hit:any)=>({x:Number(hit?.x),y:Number(hit?.y),t:clamp(Number(hit?.t),0,1)})).filter((hit:any)=>Number.isFinite(hit.x)&&Number.isFinite(hit.y)&&Number.isFinite(hit.t)):[];this.laserCannonBeams.push({x1:Number(payload?.x1),y1:Number(payload?.y1),x2:Number(payload?.x2),y2:Number(payload?.y2),born,travelMs,until:born+Math.max(travelMs+LASER_CANNON_BALANCE.impactSeconds*1000,Number(payload?.duration??.3)*1000),impacts});}
    if(type==='empPulse')this.receiveEmpPulse(payload);
    if(type==='coreSiegeEffect')this.receiveCoreSiegeEffect(payload);
  };
  private chatStateHandler=(event:Event)=>{
    const open=Boolean((event as CustomEvent<{open?:boolean}>).detail?.open);
    this.chatBlocked=open;
    if(this.input.keyboard)this.input.keyboard.enabled=!open;
    if(open){
      for(const key of Object.values(this.keys??{}))key.reset();
      this.scopeRequested=false;this.cancelLocalThrow();
      this.net.send('input',{x:0,y:0,aimX:this.localAimX,aimY:this.localAimY,angle:this.localAimAngle,seq:++this.seq,aiming:false,huntSprint:false,accelerate:false,brake:false,turnLeft:false,turnRight:false});
    }
  };
  private coreSiegeTargetRequestHandler=(event:Event)=>{
    const slot=Number((event as CustomEvent<{slot?:number}>).detail?.slot) as CoreSiegeAbilitySlot;
    if(slot===1||slot===2||slot===3)this.beginCoreSiegeTargeting(slot);
  };

  constructor(private net:Network){super('game');}

  private receiveEmpPulse(payload:any){
    const born=this.time.now,x=Number(payload?.x),y=Number(payload?.y),radius=Math.max(80,Number(payload?.radius??EMP_EXO_SUIT_BALANCE.empRadius));
    if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(radius))return;
    const rawTargets=Array.isArray(payload?.affectedTargets)?payload.affectedTargets:[];
    const affectedTargets:EmpAffectedTargetVisual[]=rawTargets.map((target:any)=>({id:String(target?.id??''),x:Number(target?.x),y:Number(target?.y),velocityX:Number(target?.velocityX??0),velocityY:Number(target?.velocityY??0),kind:String(target?.kind??'mechanical')})).filter((target:EmpAffectedTargetVisual)=>target.id&&Number.isFinite(target.x)&&Number.isFinite(target.y));
    if(!affectedTargets.length&&Array.isArray(payload?.affectedIds)){
      for(const rawId of payload.affectedIds){
        const id=String(rawId??''),vehicle=this.net.snapshot?.motorcycles?.find((item:any)=>item.id===id),player=this.net.snapshot?.players?.find((item:any)=>item.id===id),target=vehicle??player;if(!id||!target)continue;
        affectedTargets.push({id,x:Number(target.x),y:Number(target.y),velocityX:Number(target.velocityX??0),velocityY:Number(target.velocityY??0),kind:String(vehicle?.vehicleKind??'robot')});
      }
    }
    const shockDuration=Math.max(650,Number(payload?.duration??.9)*1000),fieldDuration=Math.max(shockDuration+900,Number(payload?.fieldDuration??3.2)*1000);
    this.empPulses.push({x,y,radius,born,shockUntil:born+shockDuration,until:born+fieldDuration,affectedTargets});
    if(this.empPulses.length>8)this.empPulses.splice(0,this.empPulses.length-8);
  }

  private receiveCoreSiegeEffect(payload:any){
    const kind=String(payload?.kind??''),effectId=String(payload?.effectId??`${kind}:${this.time.now}:${Math.random()}`);
    if(!kind)return;
    if(kind==='areaEnd'){this.coreSiegeEffects=this.coreSiegeEffects.filter((effect)=>effect.effectId!==effectId);return;}
    const defaults:Record<string,number>={siegeProjectile:.45,siegeProjectileHit:.32,minionMelee:.28,campAttack:.3,structureHit:.22,structureBlocked:.3,minionHit:.18,campHit:.2,wave:1,structureDestroyed:1.5,upgradePickup:.75,levelUp:1.15,skillUpgrade:.7,grenadeTelegraph:.7,grenadeExplosion:.9,adhesiveArea:5,empPulse:1.1,piercingBeam:.65,chickenVolley:.65,rcSwarm:.8,shockTrap:.8};
    const duration=Math.max(.12,Number(payload?.duration??defaults[kind]??.6)),born=this.time.now;
    this.coreSiegeEffects.push({kind,effectId,born,until:born+duration*1000,payload});
    if(this.coreSiegeEffects.length>80)this.coreSiegeEffects.splice(0,this.coreSiegeEffects.length-80);
    const x=Number(payload?.x??payload?.x2),y=Number(payload?.y??payload?.y2),viewer=this.viewerPoint??this.local();
    if(viewer&&Number.isFinite(x)&&Number.isFinite(y)&&distance(viewer.x,viewer.y,x,y)<560){
      if(kind==='grenadeExplosion')this.cameras.main.shake(150,.006);
      else if(kind==='structureDestroyed')this.cameras.main.shake(220,.009);
      else if(kind==='executionStrike'||kind==='hammerLanding'||kind==='gravityExplosion')this.cameras.main.shake(160,.005);
      else if(kind==='heroAbilityCast'&&Number(payload?.abilitySlot)===3)this.cameras.main.shake(90,.0025);
    }
    if(kind==='stunApplied'&&Number.isFinite(x)&&Number.isFinite(y)){
      const label=this.add.text(x,y-54,'기절!',{fontFamily:'sans-serif',fontSize:'17px',fontStyle:'bold',color:'#fff2a1',stroke:'#3b2200',strokeThickness:5}).setOrigin(.5).setDepth(RENDER_DEPTH.HUD-1);
      this.tweens.add({targets:label,y:y-68,alpha:0,duration:Math.max(420,duration*1000),ease:'Sine.easeOut',onComplete:()=>label.destroy()});
    }
  }

  create(){
    this.mapConfig=getMapConfig((this.net.snapshot?.mapId??this.net.snapshot?.mapSizeMode) as MapId);
    this.mapRevision=Number(this.net.snapshot?.mapRevision??0);
    this.cameras.main.setBounds(0,0,this.mapConfig.width,this.mapConfig.height);
    this.cameras.main.setBackgroundColor('#153424');
    const debugParams=new URLSearchParams(window.location.search);
    this.terrainDebugEnabled=debugParams.get('debugTerrain')==='1';
    this.debugWorldVisible=debugParams.get('debugWorld')==='1';
    this.staticG=this.add.graphics().setDepth(RENDER_DEPTH.GROUND);
    this.slowG=this.add.graphics().setDepth(RENDER_DEPTH.GROUND_ITEM);
    this.dynamicG=this.add.graphics().setDepth(RENDER_DEPTH.PLAYER);
    this.windowRevealG=this.add.graphics().setDepth(RENDER_DEPTH.BUILDING_ROOF+2);
    this.foliageG=this.add.graphics().setDepth(RENDER_DEPTH.WORLD_PROP+8);
    this.planeShadowG=this.add.graphics().setDepth(RENDER_DEPTH.PLANE_SHADOW);
    this.planeG=this.add.graphics().setDepth(RENDER_DEPTH.TRANSPORT_PLANE);
    this.debugG=this.add.graphics().setDepth(RENDER_DEPTH.PLANE_EFFECT);
    this.hitG=this.add.graphics().setScrollFactor(0).setDepth(RENDER_DEPTH.HUD+5);
    this.crosshairG=this.add.graphics().setScrollFactor(0).setDepth(RENDER_DEPTH.HUD+20);
    this.throwGuideG=this.add.graphics().setDepth(RENDER_DEPTH.WORLD_EFFECT+2);
    this.abilityGuideG=this.add.graphics().setDepth(RENDER_DEPTH.WORLD_EFFECT+3);
    this.miniStatic=this.add.graphics().setScrollFactor(0).setDepth(RENDER_DEPTH.HUD);
    this.mini=this.add.graphics().setScrollFactor(0).setDepth(RENDER_DEPTH.HUD+1);
    this.indoorMaskG=this.add.graphics().setScrollFactor(0).setDepth(RENDER_DEPTH.PLAYER-1);
    this.scopeCanvas=document.getElementById('scopeOverlay') as HTMLCanvasElement|undefined;
    this.scopeContext=this.scopeCanvas?.getContext('2d')??undefined;
    this.windowVisionCanvas=document.getElementById('windowVisibilityOverlay') as HTMLCanvasElement|undefined;
    this.windowVisionContext=this.windowVisionCanvas?.getContext('2d')??undefined;
    this.resizeOverlayCanvases();
    this.pickupText=this.add.text(this.scale.width/2,this.scale.height-118,'',{fontFamily:'sans-serif',fontSize:'18px',fontStyle:'bold',color:'#ffffff',backgroundColor:'#071018dd',padding:{x:12,y:8}}).setOrigin(.5).setScrollFactor(0).setDepth(RENDER_DEPTH.HUD+10).setVisible(false);
    this.fpsText=this.add.text(12,12,'',{fontFamily:'monospace',fontSize:'12px',color:'#9fb2bf',backgroundColor:'#071018aa',padding:{x:6,y:4}}).setScrollFactor(0).setDepth(RENDER_DEPTH.HUD+10).setVisible(!mobileControls.enabled);
    this.perfText=this.add.text(this.scale.width-12,this.scale.height-104,'',{fontFamily:'monospace',fontSize:'12px',color:'#d9edf8',backgroundColor:'#061018ee',padding:{x:8,y:7}}).setOrigin(1,1).setScrollFactor(0).setDepth(RENDER_DEPTH.HUD+12).setVisible(false);
    this.regionText=this.add.text(12,46,'',{fontFamily:'sans-serif',fontSize:'13px',fontStyle:'bold',color:'#f4f7ef',backgroundColor:'#071018cc',padding:{x:9,y:6}}).setScrollFactor(0).setDepth(RENDER_DEPTH.HUD+10).setVisible(false);
    this.keys=this.input.keyboard!.addKeys('W,A,S,D,E,F,Q,R,V,Z,X,C,SHIFT,ONE,TWO,THREE,FOUR,FIVE,M,F3,F8,SPACE,ENTER,LEFT,RIGHT') as Record<string,Phaser.Input.Keyboard.Key>;
    this.input.mouse?.disableContextMenu();
    this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{
      if(this.handleMinimapPointer(pointer))return;
      if(mobileControls.active)return;
      void audio.unlock();
      const me=this.local();
      if(this.isTyping()||!me)return;
      if(pointer.rightButtonDown()&&this.coreSiegeTargetingSlot){this.cancelCoreSiegeTargeting();this.coreSiegeSuppressFireUntil=this.time.now+150;return;}
      if(pointer.leftButtonDown()&&this.coreSiegeTargetingSlot){
        const target=this.cameras.main.getWorldPoint(pointer.x,pointer.y);
        this.confirmCoreSiegeAbility(target.x,target.y);
        return;
      }
      if(pointer.rightButtonDown()&&this.localThrowPreparing){this.cancelLocalThrow();return;}
      if(pointer.leftButtonDown()&&me.alive&&me.phase==='landed'&&!me.isSwimming&&!me.isVaulting&&isThrowableType(me.equipped)&&me.throwableCount>0){this.localThrowPreparing=true;this.localThrowStartedAt=this.time.now;this.localThrowVehicleId=me.isDriving?String(me.vehicleId??''):'';this.net.send('throwPrepare');}
    });
    this.input.on('pointerup',(pointer:Phaser.Input.Pointer)=>{if(mobileControls.active)return;const me=this.local();if(pointer.button!==0||!this.localThrowPreparing||!me)return;if(me.isSwimming){this.cancelLocalThrow();return;}this.net.send('throw',{aimX:this.localAimX,aimY:this.localAimY});this.localThrowPreparing=false;this.localThrowStartedAt=0;this.localThrowVehicleId='';});
    this.keys.LEFT.on('down',()=>this.cycleSpectateTarget(-1));
    this.keys.RIGHT.on('down',()=>this.cycleSpectateTarget(1));
    this.keys.E.on('down',()=>{const me=this.local();if(this.isTyping())return;if(this.isCoreSiege()){this.beginCoreSiegeTargeting(2);return;}if(!me?.isSwimming){this.cancelLocalThrow();const season=this.net.snapshot?.werewolfSeason,nearAltar=season?.altarPhase==='active'&&me&&Math.hypot(Number(season.altarX)-me.x,Number(season.altarY)-me.y)<=WEREWOLF_BALANCE.ritualRadius+8;if(nearAltar)this.net.send('werewolfRitualStart');else this.net.send('interact');}});
    this.keys.E.on('up',()=>{if(!this.isTyping()&&!this.isCoreSiege())this.net.send('werewolfRitualCancel');});
    this.keys.F.on('down',()=>{if(this.isTyping())return;if(this.isCoreSiege()){this.beginCoreSiegeTargeting(3);return;}this.net.send('werewolfTransform');});
    this.keys.R.on('down',()=>{const me=this.local();if(!this.isTyping()&&!me?.isSwimming)this.net.send('reload');});
    this.keys.ONE.on('down',()=>{if(!this.isTyping()){this.cancelLocalThrow();this.net.send('switch',{slot:1});}});
    this.keys.TWO.on('down',()=>{if(!this.isTyping()){this.cancelLocalThrow();this.net.send('switch',{slot:2});}});
    this.keys.THREE.on('down',()=>{if(!this.isTyping()){this.cancelLocalThrow();this.net.send('switch',{slot:3});}});
    this.keys.FOUR.on('down',()=>{if(!this.isTyping()){this.cancelLocalThrow();this.net.send('switch',{slot:4});}});
    this.keys.FIVE.on('down',()=>{const me=this.local();if(!this.isTyping()&&me?.alive&&me.phase==='landed'&&!me.isDriving&&!me.isSwimming&&!me.isVaulting){this.cancelLocalThrow();this.net.send('launchHunterDrones');}});
    this.keys.X.on('down',()=>{const me=this.local();if(!this.isTyping()&&me?.alive&&me.phase==='landed'&&!me.isDriving&&!me.isSwimming&&!me.isVaulting){this.cancelLocalThrow();const useMine=this.keys.SHIFT.isDown||Number(me.stripTrapCount??0)<=0&&Number(me.spiderMineCount??0)>0;this.net.send(useMine?'placeSpiderMine':'placeStripTrap');}});
    this.keys.Z.on('down',()=>{const me=this.local();if(!this.isTyping()&&me?.alive&&!me.exoActive)this.net.send('activateExoSuit');});
    this.keys.C.on('down',()=>{const me=this.local();if(!this.isTyping()&&me?.alive&&!me.exoActive)this.net.send('activateEmpExoSuit');});
    this.keys.V.on('down',()=>{const me=this.local();if(!this.isTyping()&&me?.alive&&!me.exoActive&&!me.isDriving)this.net.send('activateFusionRobot');});
    this.keys.Q.on('down',()=>{const me=this.local();if(this.isTyping())return;if(this.isCoreSiege()){this.beginCoreSiegeTargeting(1);return;}if(!me?.isSwimming){this.cancelLocalThrow();this.net.send('heal',{kind:'auto'});}});
    this.keys.SPACE.on('down',()=>{if(this.isTyping())return;const me=this.local();if(me?.isSwimming)return;this.net.send(me?.phase==='landed'?'vaultWindow':'jump');});
    this.keys.M.on('down',()=>this.toggleMapOpen());
    this.keys.F3.on('down',()=>{if(this.isTyping())return;this.perfVisible=!this.perfVisible;this.perfText.setVisible(this.perfVisible);});
    this.keys.F8.on('down',()=>{const me=this.local();if(!this.isTyping()&&me?.host)this.net.send('spawnRobotPartsCheat');});
    this.scale.on('resize',(size:Phaser.Structs.Size)=>{
      this.pickupText.setPosition(size.width/2,size.height-118);
      this.perfText.setPosition(size.width-12,size.height-104);
      this.resizeOverlayCanvases();
      this.lastMiniDraw=0;this.miniStaticKey='';
    });
    this.net.messages.add(this.chatMessageHandler);
    window.addEventListener('drop8-chat-state',this.chatStateHandler as EventListener);
    window.addEventListener('drop8-core-siege-target',this.coreSiegeTargetRequestHandler as EventListener);
    window.addEventListener('drop8-core-siege-lab-rate',this.coreSiegeSkillLabRateHandler as EventListener);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
      this.net.messages.delete(this.chatMessageHandler);
      window.removeEventListener('drop8-chat-state',this.chatStateHandler as EventListener);
      window.removeEventListener('drop8-core-siege-target',this.coreSiegeTargetRequestHandler as EventListener);
      window.removeEventListener('drop8-core-siege-lab-rate',this.coreSiegeSkillLabRateHandler as EventListener);
      document.getElementById('game')?.classList.remove('map-open');
      this.mapOpen=false;this.miniBounds=undefined;this.miniHint?.destroy();this.miniHint=undefined;
      mobileControls.reset();this.mobileAimWasActive=false;this.mobileFireWasActive=false;this.laserCannonInputHeld=false;this.laserCannonInputStartedAt=0;this.laserCannonChargeCueSent=false;this.mobileInteractWasHeld=false;
      this.mobileAimAssistTargetId='';this.mobileAimAssistActive=false;
      for(const overlay of this.playerOverlays.values())overlay.container.destroy(true);
      this.playerOverlays.clear();
      this.crosshairG.clear();this.throwGuideG.clear();this.abilityGuideG.clear();this.cancelLocalThrow();this.cancelCoreSiegeTargeting();
      if(this.scopeCanvas){this.scopeCanvas.classList.add('hidden');const context=this.scopeContext;context?.clearRect(0,0,this.scopeCanvas.width,this.scopeCanvas.height);}
      if(this.windowVisionCanvas){this.windowVisionCanvas.classList.add('hidden');const context=this.windowVisionContext;context?.clearRect(0,0,this.windowVisionCanvas.width,this.windowVisionCanvas.height);}
      this.deathVisuals=[];this.localDeathPoint=null;this.localDeathCameraUntil=0;
      this.activePortalId='';this.activePortalBuildingId='';this.activePortalKind='';this.activePortalSelectedAt=0;
      this.remoteBuffers.clear();
      this.displayMotorcycles.clear();
      this.lastVisibility.clear();
      this.frameVisibility.clear();
      this.seenExplosionIds.clear();
      this.coreSiegeEffects=[];
      for(const handle of this.vehicleAudioLoops.values())audio.stopLoop(handle,60);
      this.vehicleAudioLoops.clear();this.vehicleAudioState.clear();this.vehicleWarningAt.clear();this.movementAudio.clear();
      this.revealStartedAt.clear();
      for(const label of this.mapLabels)label.destroy();
      this.mapLabels=[];
      for(const roof of this.buildingRoofs.values())roof.destroy();
      this.buildingRoofs.clear();
    });
    this.drawStaticMap();
    this.createBuildingRoofs();
    this.drawFoliage();
  }

  update(time:number){
    const s=this.net.snapshot;
    if(!s)return;
    this.ensureMapState(s);
    if(this.practiceMapRendered!==Boolean(this.net.roomConfig.practiceMode)){this.practiceMapRendered=Boolean(this.net.roomConfig.practiceMode);this.drawStaticMap();}
    const me=this.local();
    const dt=Math.min(.04,Math.max(0,this.game.loop.delta/1000));
    if(this.coreSiegeSkillLabRate<1){const delay=this.game.loop.delta*(1-this.coreSiegeSkillLabRate);for(const effect of this.coreSiegeEffects){effect.born+=delay;effect.until+=delay;}}
    this.frameTimeSamples.push(this.game.loop.delta);if(this.frameTimeSamples.length>240)this.frameTimeSamples.shift();
    this.trackRemotePlayers(s);
    this.trackMotorcycles(s);
    if(me){
      const typing=this.isTyping(),mobile=mobileControls.snapshot(),mobileActive=mobile.active;
      const wolf=me.werewolf??{};
      const siegeHeroId=(me.heroId??'vanguard') as CoreSiegeHeroId,positioningProfile=CORE_SIEGE_POSITIONING[siegeHeroId]??CORE_SIEGE_POSITIONING.vanguard;
      const currentVehicleState=me.vehicleId?s.motorcycles.find((motorcycle:any)=>motorcycle.id===me.vehicleId):undefined;
      const tankDriving=Boolean(me.isDriving&&currentVehicleState?.vehicleKind==='tank'),fusionDriving=Boolean(me.isDriving&&currentVehicleState?.vehicleKind==='fusion_robot'),fusionWeaponSlot=Math.max(1,Math.min(4,Math.floor(Number(currentVehicleState?.fusionWeaponSlot||1))));
      const precisionReleaseWeapon=tankDriving||(fusionDriving?fusionWeaponSlot===1:me.exoActive?me.exoKind!=='emp':me.equipped==='sniper'||me.equipped==='bazooka'||me.equipped==='laser_cannon');
      const mobileSkillAimIntent=mobileActive&&(mobile.siegeAimActive||mobile.siegeReleaseSlot>0),mobileAimIntent=mobileActive&&(mobileSkillAimIntent||mobile.aimActive||mobile.fireReleased);
      this.mobileAimGuideActive=mobileActive&&(mobile.aimActive||mobile.siegeAimActive);this.mobilePrecisionRelease=mobileActive&&precisionReleaseWeapon;
      const serverTime=Number(s.serverTime??0),mechanicalLocked=Boolean(me.exoActive&&serverTime<Number(me.empDisabledUntil??0)||me.isDriving&&serverTime<Number(currentVehicleState?.empDisabledUntil??0));
      const actionLocked=Boolean(wolf.ritualizing||wolf.transformPreparing||serverTime<Number(wolf.actionLockedUntil??0)||mechanicalLocked);
      const currentThrowVehicleId=me.isDriving?String(me.vehicleId??''):'';
      if(this.localThrowPreparing&&(typing||!me.alive||me.phase!=='landed'||me.isSwimming||me.isVaulting||me.chickenTransformed||wolf.transformed||actionLocked||!isThrowableType(me.equipped)||me.throwableCount<=0||currentThrowVehicleId!==this.localThrowVehicleId))this.cancelLocalThrow();
      if(this.coreSiegeTargetingSlot&&(!this.isCoreSiege()||typing||!me.alive||me.phase!=='landed'||me.isSwimming||me.isVaulting||me.isDriving||actionLocked))this.cancelCoreSiegeTargeting();
      const smartAction=this.mobileSmartActionContext(me,s);
      if(mobileActive)mobileControls.setContext({interactLabel:smartAction.label,interactEnabled:smartAction.action!=='none',aimLabel:this.coreSiegeTargetingSlot?'스킬 버튼 드래그 · 놓아 시전':undefined,aimMode:this.coreSiegeTargetingSlot?'release':undefined});
      const interactPressed=mobileActive&&mobile.interact&&!this.mobileInteractWasHeld,interactReleased=(!mobileActive||!mobile.interact)&&this.mobileInteractWasHeld;
      if(!typing&&interactPressed&&!me.isSwimming){
        this.cancelLocalThrow();
        if(smartAction.action==='ritual')this.net.send('werewolfRitualStart');
        else if(smartAction.action==='jump')this.net.send('jump');
        else if(smartAction.action==='vault')this.net.send('vaultWindow');
        else if(smartAction.action==='werewolfTransform')this.net.send('werewolfTransform');
        else if(smartAction.action==='interact')this.net.send('interact');
      }
      if(interactReleased)this.net.send('werewolfRitualCancel');
      this.mobileInteractWasHeld=mobileActive&&mobile.interact;
      for(const action of mobileControls.consumeActions()){
        if(typing)continue;
        if(action==='reload'&&!me.isSwimming){this.cancelLocalThrow();this.net.send('reload');}
        else if(action==='heal'&&!me.isSwimming){this.cancelLocalThrow();this.net.send('heal',{kind:'auto'});}
        else if(action.startsWith('weapon')){this.cancelLocalThrow();this.net.send('switch',{slot:Number(action.slice(-1))});}
        else if(action==='launchDrones'){this.cancelLocalThrow();this.net.send('launchHunterDrones');}
        else if(action==='placeSpiderMine'){this.cancelLocalThrow();this.net.send('placeSpiderMine');}
        else if(action==='placeStripTrap'){this.cancelLocalThrow();this.net.send('placeStripTrap');}
        else if(action==='robotAssault'){this.cancelLocalThrow();this.net.send('activateExoSuit');}
        else if(action==='robotEmp'){this.cancelLocalThrow();this.net.send('activateEmpExoSuit');}
        else if(action==='robotFusion'){this.cancelLocalThrow();this.net.send('activateFusionRobot');}
        else if(action==='siegeAbility1')this.beginCoreSiegeTargeting(1);
        else if(action==='siegeAbility2')this.beginCoreSiegeTargeting(2);
        else if(action==='siegeAbility3')this.beginCoreSiegeTargeting(3);
      }
      const rawX=typing||me.isVaulting||actionLocked?0:mobileActive?mobile.moveX:(this.keys.D.isDown?1:0)-(this.keys.A.isDown?1:0);
      const rawY=typing||me.isVaulting||actionLocked?0:mobileActive?mobile.moveY:(this.keys.S.isDown?1:0)-(this.keys.W.isDown?1:0);
      const normalizedInput=normalizeMovementInput(rawX,rawY);
      const x=normalizedInput.x,y=normalizedInput.y;
      const pointer=this.input.activePointer;
      if(mobileActive){
        const screenRadius=Math.min(this.scale.width,this.scale.height)*.34,moveLength=Math.hypot(mobile.moveX,mobile.moveY),activeAimX=mobileSkillAimIntent?mobile.siegeAimX:mobile.aimX,activeAimY=mobileSkillAimIntent?mobile.siegeAimY:mobile.aimY;
        if(mobile.aimActive||mobileSkillAimIntent){this.pointerScreenX=clamp(this.scale.width/2+activeAimX*screenRadius,0,this.scale.width);this.pointerScreenY=clamp(this.scale.height/2+activeAimY*screenRadius,0,this.scale.height);}
        else{
          const displayAimX=moveLength>.08?mobile.moveX/moveLength:this.localAimX,displayAimY=moveLength>.08?mobile.moveY/moveLength:this.localAimY;
          this.pointerScreenX=clamp(this.scale.width/2+displayAimX*screenRadius,0,this.scale.width);
          this.pointerScreenY=clamp(this.scale.height/2+displayAimY*screenRadius,0,this.scale.height);
        }
      }else{
        this.pointerScreenX=clamp(pointer.x,0,this.scale.width);
        this.pointerScreenY=clamp(pointer.y,0,this.scale.height);
      }
      const rawPrimaryDown=mobileActive?(precisionReleaseWeapon?mobile.fireReleased:mobile.fire):pointer.leftButtonDown(),primaryDown=rawPrimaryDown&&!this.coreSiegeTargetingSlot&&time>=this.coreSiegeSuppressFireUntil,secondaryDown=mobileActive?mobile.secondary:pointer.rightButtonDown(),mobileAimPressed=mobileActive&&mobile.aimActive&&!this.mobileAimWasActive,mobileFirePressed=mobileActive&&mobile.fire&&!this.mobileFireWasActive,mobileFireReleased=mobileActive&&mobile.fireReleased;
      if(mobileFirePressed&&!this.coreSiegeTargetingSlot&&!tankDriving&&!fusionDriving&&me.alive&&me.phase==='landed'&&!me.isSwimming&&!me.isVaulting&&isThrowableType(me.equipped)&&me.throwableCount>0){this.localThrowPreparing=true;this.localThrowStartedAt=time;this.localThrowVehicleId=currentThrowVehicleId;this.net.send('throwPrepare');}
      const localVehicle=currentVehicleState;
      if(me.isDriving&&localVehicle)this.predictLocalMotorcycle(localVehicle.id,x,y,dt,time);
      else{this.localVehicleHeldMs=0;this.localVehicleInputX=0;this.localVehicleInputY=0;}
      if(me.isVaulting||actionLocked)this.predictedLocal={x:me.x,y:me.y};
      else if(me.alive&&me.phase==='landed')this.updateLocalPrediction(me,x,y,dt);
      else this.predictedLocal={x:me.x,y:me.y};

      const holdingDeathCamera=!me.alive&&Boolean(this.localDeathPoint)&&time<this.localDeathCameraUntil;
      const target=me.alive||holdingDeathCamera?me:this.currentSpectateTarget(s.players,me.id)??me;
      const shown=holdingDeathCamera&&this.localDeathPoint?this.localDeathPoint:target.id===me.id&&this.predictedLocal?this.predictedLocal:this.remotePosition(target,time);
      const vehicleDisplay=localVehicle?this.displayMotorcycles.get(localVehicle.id):undefined;
      const localVehicleMaxSpeed=MOTORCYCLE_MAX_SPEED*(localVehicle?.vehicleKind==='tank'?TANK_BALANCE.speedMultiplier:localVehicle?.vehicleKind==='fusion_robot'?FUSION_ROBOT_BALANCE.speedMultiplier:1);
      const vehicleSpeedRatio=localVehicle?Math.abs(Number(vehicleDisplay?.speed??localVehicle.speed??0))/localVehicleMaxSpeed:0;
      const canScope=Boolean(!typing&&!me.chickenTransformed&&!me.exoActive&&localVehicle?.vehicleKind!=='fusion_robot'&&!wolf.transformed&&!wolf.transformPreparing&&!me.isSwimming&&!me.isVaulting&&me.alive&&me.phase==='landed'&&me.equipped==='sniper'&&(!this.isCoreSiege()||positioningProfile.kind==='scope')&&!me.reloading&&!me.healingKind&&(!me.isDriving||(vehicleSpeedRatio<=MOTORCYCLE_SCOPE_SPEED_RATIO&&rawX===0&&rawY===0)));
      if(!canScope&&secondaryDown&&me.equipped==='sniper'&&me.isDriving&&time-this.lastScopeNoticeAt>900){this.lastScopeNoticeAt=time;this.dispatchNotice('속도를 줄이고 이동키를 놓아야 스코프를 사용할 수 있습니다.','warning');}
      this.scopeRequested=canScope&&secondaryDown;

      // Camera settles first; the screen pointer is then converted through that exact camera state.
      this.updateCameraForWeapon(me,shown,this.scopeRequested,dt);
      const aimBase=vehicleDisplay??this.predictedLocal??{x:me.x,y:me.y};
      const worldAim=this.cameras.main.getWorldPoint(this.pointerScreenX,this.pointerScreenY);
      const rawAim=mobileActive?(mobileAimIntent?normalizeAimVector(mobileSkillAimIntent?mobile.siegeAimX:mobile.aimX,mobileSkillAimIntent?mobile.siegeAimY:mobile.aimY):{x:this.localAimX,y:this.localAimY}):normalizeAimVector(worldAim.x-aimBase.x,worldAim.y-aimBase.y);
      const mobileAssistRequested=mobileAimIntent;
      const aim=mobileAssistRequested&&rawAim?this.mobileAimAssist(me,aimBase,rawAim,currentVehicleState):rawAim;
      if(!mobileAssistRequested){this.mobileAimAssistTargetId='';this.mobileAimAssistActive=false;}
      if(aim){this.localAimX=aim.x;this.localAimY=aim.y;this.localAimAngle=Math.atan2(aim.y,aim.x);}
      if(mobileActive){
        const camera=this.cameras.main,screenRadius=Math.min(this.scale.width,this.scale.height)*.34;
        const baseScreenX=(aimBase.x-camera.worldView.x)*camera.zoom,baseScreenY=(aimBase.y-camera.worldView.y)*camera.zoom;
        this.pointerScreenX=clamp(baseScreenX+this.localAimX*screenRadius,0,this.scale.width);
        this.pointerScreenY=clamp(baseScreenY+this.localAimY*screenRadius,0,this.scale.height);
      }
      const shotAimWorld=mobileActive?{x:aimBase.x+this.localAimX*1800,y:aimBase.y+this.localAimY*1800}:this.cameras.main.getWorldPoint(this.pointerScreenX,this.pointerScreenY);
      const desktopPositionPressed=!mobileActive&&secondaryDown&&!this.secondaryWasDown,mobilePositionReleased=mobileActive&&mobile.secondaryReleased,positioningPressed=desktopPositionPressed||mobilePositionReleased;
      if(positioningPressed&&this.isCoreSiege()&&positioningProfile.kind==='move'&&!typing&&!actionLocked&&!me.exoActive&&!me.isDriving&&!me.isSwimming&&!me.isVaulting&&!this.coreSiegeTargetingSlot&&time>=this.coreSiegeSuppressFireUntil){
        const direction=mobilePositionReleased&&mobile.secondaryAimActive?{x:mobile.secondaryAimX,y:mobile.secondaryAimY}:{x:this.localAimX,y:this.localAimY};
        this.net.send('useCoreSiegePositioning',{aimWorldX:aimBase.x+direction.x*positioningProfile.distance,aimWorldY:aimBase.y+direction.y*positioningProfile.distance});
      }
      this.secondaryWasDown=secondaryDown;
      if(mobile.siegeTapSlot&&this.coreSiegeTargetingSlot===mobile.siegeTapSlot)this.smartCastCoreSiegeAbility(mobile.siegeTapSlot);
      else if(mobile.siegeReleaseSlot&&this.coreSiegeTargetingSlot===mobile.siegeReleaseSlot)this.confirmCoreSiegeAbility(shotAimWorld.x,shotAimWorld.y);
      else if(mobileFireReleased&&this.coreSiegeTargetingSlot)this.confirmCoreSiegeAbility(shotAimWorld.x,shotAimWorld.y);
      else if(mobileFireReleased&&this.localThrowPreparing&&!me.isSwimming){this.net.send('throw',{aimX:this.localAimX,aimY:this.localAimY});this.localThrowPreparing=false;this.localThrowStartedAt=0;this.localThrowVehicleId='';}
      this.mobileAimWasActive=mobileActive&&mobile.aimActive;
      this.mobileFireWasActive=mobileActive&&mobile.fire;

      this.viewerPoint={x:shown.x,y:shown.y};
      this.viewerPlayer=target;
      this.updateActivePortal(target,shown,time);
      this.updateBuildingPresentation(target);
      this.updateRegionLabel(shown.x,shown.y);
      this.updateTerrainDebug(shown.x,shown.y,Boolean(target?.isSwimming));
      const mobileAimDelta=Math.abs(Math.atan2(Math.sin(this.localAimAngle-this.lastSentAimAngle),Math.cos(this.localAimAngle-this.lastSentAimAngle)));
      const urgentMobileAim=mobileActive&&(mobileAimPressed||mobileFirePressed||mobile.fireReleased||mobile.siegeAimActive||mobile.siegeReleaseSlot>0||mobileAimIntent&&mobileAimDelta>.035&&time-this.lastInput>=18);
      if(time-this.lastInput>=50||urgentMobileAim){
        this.net.send('input',{x,y,aimX:this.localAimX,aimY:this.localAimY,angle:this.localAimAngle,seq:++this.seq,aiming:this.scopeRequested,huntSprint:Boolean(wolf.transformed)&&secondaryDown,accelerate:false,brake:false,turnLeft:false,turnRight:false});
        this.lastInput=time;this.lastSentAimAngle=this.localAimAngle;
      }
      const empExo=Boolean(me.exoActive&&me.exoKind==='emp');
      const laserTriggerHeld=(mobileActive?mobile.fire:pointer.leftButtonDown())&&!this.coreSiegeTargetingSlot&&time>=this.coreSiegeSuppressFireUntil,laserEligible=me.equipped==='laser_cannon'&&!me.chickenTransformed&&!typing&&!actionLocked&&!me.isSwimming&&!me.isVaulting&&me.alive&&me.phase==='landed';
      if(laserEligible&&laserTriggerHeld&&!this.laserCannonInputHeld){this.net.send('laserCannonChargeStart');this.laserCannonInputHeld=true;this.laserCannonInputStartedAt=time;this.laserCannonChargeCueSent=false;}
      if(this.laserCannonInputHeld&&laserEligible&&laserTriggerHeld&&!this.laserCannonChargeCueSent&&time-this.laserCannonInputStartedAt>=180){this.net.send('laserCannonChargeCue');this.laserCannonChargeCueSent=true;}
      if(this.laserCannonInputHeld&&laserEligible&&(!laserTriggerHeld||mobileFireReleased)){this.net.send('laserCannonChargeRelease',{aimWorldX:shotAimWorld.x,aimWorldY:shotAimWorld.y});this.laserCannonInputHeld=false;this.laserCannonInputStartedAt=0;this.laserCannonChargeCueSent=false;this.crosshairKick=Math.min(18,this.crosshairKick+8);}
      else if(this.laserCannonInputHeld&&!laserEligible){this.net.send('laserCannonChargeCancel');this.laserCannonInputHeld=false;this.laserCannonInputStartedAt=0;this.laserCannonChargeCueSent=false;}
      if(!typing&&!actionLocked&&!me.isSwimming&&!me.isVaulting&&me.equipped!=='laser_cannon'&&(!isThrowableType(me.equipped)||tankDriving||fusionDriving)&&primaryDown&&time-this.lastFire>=55){
        if((tankDriving||fusionDriving)&&this.localThrowPreparing)this.cancelLocalThrow();
        this.net.send(empExo?'empExoMachineGun':me.exoActive?'exoBomb':tankDriving||fusionDriving?'fire':Boolean(me.chickenTransformed)||Boolean(wolf.transformed)||me.equipped==='fists'||me.equipped in MELEE_WEAPONS?'melee':'fire',{aimWorldX:shotAimWorld.x,aimWorldY:shotAimWorld.y});
        if(tankDriving)this.crosshairKick=Math.min(18,this.crosshairKick+11);
        else if(fusionDriving){const slot=Number(localVehicle?.fusionWeaponSlot||1);this.crosshairKick=Math.min(18,this.crosshairKick+(slot===1?9:slot===2?4:slot===3?2:0));}
        else if(me.equipped in WEAPONS&&me.equipped!=='fists')this.crosshairKick=Math.min(18,this.crosshairKick+((me.equipped==='shotgun'||me.equipped==='silver_crossbow')?9:me.equipped==='sniper'?5:3));
        this.lastFire=time;
      }
      if(!typing&&!actionLocked&&me.exoActive&&secondaryDown&&time-this.lastExoLaser>=90){this.net.send(empExo?'empExoPulse':'exoLaser',{aimWorldX:shotAimWorld.x,aimWorldY:shotAimWorld.y});this.lastExoLaser=time;}
      this.updateCombatHud(me,vehicleDisplay??localVehicle,typing,dt);
    }else{
      this.mobileAimWasActive=false;this.mobileFireWasActive=false;this.secondaryWasDown=false;this.laserCannonInputHeld=false;this.laserCannonInputStartedAt=0;this.laserCannonChargeCueSent=false;this.mobileInteractWasHeld=false;this.mobileAimGuideActive=false;this.mobilePrecisionRelease=false;this.cancelCoreSiegeTargeting();mobileControls.consumeActions();
      this.scopeRequested=false;
      this.crosshairG.clear();
      this.updateScopeOverlay(undefined,dt);
      const target=this.currentSpectateTarget(s.players);
      if(target){
        const shown=this.remotePosition(target,time);
        this.viewerPoint={x:shown.x,y:shown.y};this.viewerPlayer=target;
        this.updateCameraForWeapon(target,shown,false,dt);
        this.updateActivePortal(target,shown,time);this.updateBuildingPresentation(target);
        this.updateRegionLabel(shown.x,shown.y);this.updateTerrainDebug(shown.x,shown.y,Boolean(target.isSwimming));
      }else{
        this.viewerPoint=null;this.viewerPlayer=null;
        this.activePortalId='';this.activePortalBuildingId='';this.activePortalKind='';this.activePortalSelectedAt=0;
      }
    }
    this.updateHitState(s,time);
    if(time-this.lastSlowDraw>=100){this.drawSlowLayers(s);this.lastSlowDraw=time;}
    this.drawDynamic(time);
    if(time-this.lastFoliageDraw>=250){this.drawFoliage();this.lastFoliageDraw=time;}
    this.drawThrowableGuide(time,me);
    this.drawCoreSiegeAbilityGuide(me);
    this.updateAudioState(s,time);
    this.drawDebug(s);
    this.drawHitEffects(time);
    this.updatePickupPrompt();
    if(time-this.lastFpsDraw>=500){
      this.fpsText.setText(`FPS ${Math.round(this.game.loop.actualFps)}`);
      if(this.perfVisible)this.updatePerfText(s);
      this.lastFpsDraw=time;
    }
  }

  private cancelLocalThrow(){if(this.localThrowPreparing)this.net.send('throwCancel');this.localThrowPreparing=false;this.localThrowStartedAt=0;this.localThrowVehicleId='';this.throwGuideG?.clear();}

  private isCoreSiege(){return this.net.roomConfig.gameMode==='coreSiege'&&Boolean(this.net.snapshot?.coreSiege?.enabled);}

  private beginCoreSiegeTargeting(slot:CoreSiegeAbilitySlot){
    const me=this.local(),serverTime=Number(this.net.snapshot?.serverTime??0);
    if(!this.isCoreSiege()||!me?.alive||me.phase!=='landed'||me.isDriving||me.isSwimming||me.isVaulting)return;
    const readyAt=slot===1?Number(me.ability1ReadyAt??0):slot===2?Number(me.ability2ReadyAt??0):Number(me.ultimateReadyAt??0);
    if(readyAt>serverTime){this.dispatchNotice(`스킬 재사용까지 ${Math.max(.1,readyAt-serverTime).toFixed(1)}초`,'warning');return;}
    this.cancelLocalThrow();
    this.coreSiegeTargetingSlot=this.coreSiegeTargetingSlot===slot?0:slot;
    this.coreSiegeTargetingStartedAt=this.coreSiegeTargetingSlot?this.time.now:0;
    this.coreSiegeSuppressFireUntil=this.time.now+120;
    this.syncCoreSiegeTargetingUi();
  }

  private cancelCoreSiegeTargeting(){
    this.coreSiegeTargetingSlot=0;
    this.coreSiegeTargetingStartedAt=0;
    this.abilityGuideG?.clear();
    this.syncCoreSiegeTargetingUi();
  }

  private confirmCoreSiegeAbility(aimWorldX:number,aimWorldY:number){
    const slot=this.coreSiegeTargetingSlot;
    if(!slot)return;
    this.net.send('useCoreSiegeAbility',{slot,aimWorldX,aimWorldY,chargeSeconds:clamp((this.time.now-this.coreSiegeTargetingStartedAt)/1000,0,1.2)});
    this.coreSiegeTargetingSlot=0;
    this.coreSiegeTargetingStartedAt=0;
    this.coreSiegeSuppressFireUntil=this.time.now+180;
    this.abilityGuideG?.clear();
    this.syncCoreSiegeTargetingUi();
  }

  private coreSiegeAbilitySelfCentered(heroId:CoreSiegeHeroId,slot:CoreSiegeAbilitySlot){
    return heroId==='technician'&&slot===2||heroId==='trapper'&&(slot===1||slot===2)||heroId==='fireEngineer'&&slot===3||heroId==='orbitalSniper'&&slot===2||heroId==='wolfWarrior'&&(slot===2||slot===3)||heroId==='shieldCaptain'&&slot===3||heroId==='steelPilot'&&slot===3||heroId==='empPilot'&&(slot===2||slot===3)||heroId==='ironCyclone'&&(slot===1||slot===3)||heroId==='scrapSummoner'&&(slot===1||slot===3)||heroId==='sonicCommander'&&slot===2||heroId==='chainExecutioner'&&slot===2||heroId==='twinBlade'&&slot===2;
  }

  private smartCastCoreSiegeAbility(slot:CoreSiegeAbilitySlot){
    const me=this.local();
    if(!me||this.coreSiegeTargetingSlot!==slot)return;
    const heroId=(String(me.heroId??'vanguard') in CORE_SIEGE_HEROES?String(me.heroId):'vanguard') as CoreSiegeHeroId,origin=this.predictedLocal??{x:Number(me.x),y:Number(me.y)};
    if(this.coreSiegeAbilitySelfCentered(heroId,slot)){this.confirmCoreSiegeAbility(origin.x,origin.y);return;}
    const range=heroId==='medigel'&&slot===3?700:slot===3?900:CORE_SIEGE_CONFIG.grenadeRange,team=String(me.team??'none');
    if(heroId==='medigel'){
      const allies=[...(this.net.snapshot?.players??[])]
        .filter((candidate:any)=>candidate.alive&&!candidate.exoActive&&String(candidate.team??'none')===team&&Number(candidate.hp)<Number(candidate.maxHp??100)&&distance(origin.x,origin.y,Number(candidate.x),Number(candidate.y))<=range)
        .map((candidate:any)=>({candidate,distance:distance(origin.x,origin.y,Number(candidate.x),Number(candidate.y))}))
        .sort((a:any,b:any)=>Number(a.candidate.hp)-Number(b.candidate.hp)||a.distance-b.distance);
      const ally=allies[0]?.candidate??me;this.confirmCoreSiegeAbility(Number(ally.x),Number(ally.y));return;
    }
    const targets:Array<{x:number;y:number;distance:number}>=[];
    for(const candidate of this.net.snapshot?.players??[]){
      if(!candidate.alive||candidate.id===me.id||String(candidate.team??'none')===team||this.frameVisibility.get(candidate.id)?.visibleInWorld===false)continue;
      const point=this.framePositions.get(candidate.id)??candidate,d=distance(origin.x,origin.y,Number(point.x),Number(point.y));if(d<=range)targets.push({x:Number(point.x),y:Number(point.y),distance:d});
    }
    for(const candidate of this.net.snapshot?.coreSiege?.minions??[]){const d=distance(origin.x,origin.y,Number(candidate.x),Number(candidate.y));if(candidate.team!==me.team&&Number(candidate.hp)>0&&d<=range)targets.push({x:Number(candidate.x),y:Number(candidate.y),distance:d});}
    for(const candidate of this.net.snapshot?.coreSiege?.structures??[]){const d=distance(origin.x,origin.y,Number(candidate.x),Number(candidate.y));if(candidate.team!==me.team&&!candidate.destroyed&&d<=range)targets.push({x:Number(candidate.x),y:Number(candidate.y),distance:d});}
    targets.sort((a,b)=>a.distance-b.distance);
    const target=targets[0]??{x:origin.x+this.localAimX*range,y:origin.y+this.localAimY*range};
    this.confirmCoreSiegeAbility(target.x,target.y);
  }

  private syncCoreSiegeTargetingUi(){
    document.getElementById('mobileControls')?.classList.toggle('siege-targeting',Boolean(this.coreSiegeTargetingSlot));
    for(let index=1;index<=3;index++){
      document.getElementById(`mobileSiegeSkill${index}`)?.classList.toggle('targeting',this.coreSiegeTargetingSlot===index);
      document.querySelector(`.core-siege-skill-card[data-slot="${index}"]`)?.classList.toggle('targeting',this.coreSiegeTargetingSlot===index);
    }
  }

  private coreSiegeAbilityPreview(me:any){
    const slot=this.coreSiegeTargetingSlot;
    if(!slot)return undefined;
    const heroId=(String(me.heroId??'vanguard') in CORE_SIEGE_HEROES?String(me.heroId):'vanguard') as CoreSiegeHeroId;
    const origin=this.predictedLocal??{x:Number(me.x),y:Number(me.y)},range=heroId==='medigel'&&slot===3?700:slot===3?900:CORE_SIEGE_CONFIG.grenadeRange;
    let rawTarget:DisplayPoint;
    if(mobileControls.active)rawTarget={x:origin.x+this.localAimX*range,y:origin.y+this.localAimY*range};
    else{const point=this.cameras.main.getWorldPoint(this.pointerScreenX,this.pointerScreenY);rawTarget={x:point.x,y:point.y};}
    const dx=rawTarget.x-origin.x,dy=rawTarget.y-origin.y,length=Math.hypot(dx,dy);
    let target=length>range&&length>0?{x:origin.x+dx/length*range,y:origin.y+dy/length*range}:rawTarget;
    const selfCentered=this.coreSiegeAbilitySelfCentered(heroId,slot);
    if(selfCentered)target={...origin};
    const assistRadius=slot===1?CORE_SIEGE_CONFIG.grenadeAimAssistRadius:115;
    if(!selfCentered){
      let bestDistance=assistRadius;
      for(const candidate of this.net.snapshot?.players??[]){
        const ally=String(candidate.team??'none')===String(me.team??'none');
        if(!candidate.alive||heroId==='medigel'?!ally||candidate.exoActive||candidate.hp>=Number(candidate.maxHp??100):candidate.id===me.id||ally)continue;
        const candidatePoint=this.framePositions.get(candidate.id)??candidate,candidateDistance=distance(target.x,target.y,Number(candidatePoint.x),Number(candidatePoint.y));
        if(candidateDistance<=bestDistance){bestDistance=candidateDistance;target={x:Number(candidatePoint.x),y:Number(candidatePoint.y)};}
      }
      const assistedDx=target.x-origin.x,assistedDy=target.y-origin.y,assistedLength=Math.hypot(assistedDx,assistedDy);
      if(assistedLength>range)target={x:origin.x+assistedDx/assistedLength*range,y:origin.y+assistedDy/assistedLength*range};
    }
    const rank=Math.max(1,Number(slot===1?me.ability1Rank:slot===2?me.ability2Rank:me.ultimateRank)||1);
    const radius=
      heroId==='vanguard'&&slot===1?CORE_SIEGE_CONFIG.grenadeRadius*(1+(rank-1)*.04):
      heroId==='technician'&&slot===1?215*(1+(rank-1)*.035):
      heroId==='technician'&&slot===2?390+(rank-1)*18:
      heroId==='trapper'&&slot===1?90:
      heroId==='trapper'&&slot===2?150:
      heroId==='trickster'&&slot===3?430+rank*18:
      heroId==='medigel'&&slot===2?185+rank*8:
      heroId==='medigel'&&slot===3?285+rank*15:
      heroId==='fireEngineer'?slot===1?150+rank*8:slot===2?235+rank*10:340+rank*15:
      heroId==='wolfWarrior'&&slot===2?420+rank*15:
      heroId==='shieldCaptain'&&slot===1?175+rank*10:
      heroId==='shieldCaptain'&&slot===3?430:
      heroId==='empPilot'&&slot===2?285+rank*18:
      heroId==='ironCyclone'?slot===1?112:slot===2?70:125:
      heroId==='scrapSummoner'?slot===1?55:slot===2?150:85:
      heroId==='gravityWarden'?slot===1?180+rank*10:slot===2?245:245+rank*15:
      heroId==='smokeTracker'?slot===1?45:slot===2?210+rank*10:75:
      heroId==='sonicCommander'?slot===1?210:slot===2?400+rank*15:190:
      heroId==='earthHammer'?slot===1?205+rank*11:slot===2?170+rank*8:178:
      heroId==='chainExecutioner'?slot===1?55:slot===2?170:225+rank*8:
      heroId==='twinBlade'?slot===1?115:slot===2?92:165:
      heroId==='demolitionist'&&(slot===1||slot===3)?CORE_SIEGE_CONFIG.grenadeRadius:
      slot===1?55:75;
    return{slot,heroId,origin,target,range,radius,selfCentered};
  }

  private drawCoreSiegeAbilityGuide(me:any){
    const g=this.abilityGuideG;
    g.clear();
    if(!me||!this.isCoreSiege()||!this.coreSiegeTargetingSlot||!me.alive||me.phase!=='landed'||this.isTyping())return;
    const preview=this.coreSiegeAbilityPreview(me);
    if(!preview)return;
    const {slot,heroId,origin,target,range,radius,selfCentered}=preview,color=slot===3?0xffc857:slot===2?0x69d5ff:0xffe18a;
    if(!selfCentered){
      g.lineStyle(3,color,.72).lineBetween(origin.x,origin.y,target.x,target.y);
      const dx=target.x-origin.x,dy=target.y-origin.y,len=Math.hypot(dx,dy)||1,nx=dx/len,ny=dy/len;
      for(let distanceAlong=30;distanceAlong<len;distanceAlong+=44)g.fillStyle(color,.85).fillCircle(origin.x+nx*distanceAlong,origin.y+ny*distanceAlong,3);
      g.lineStyle(2,color,.24).strokeCircle(origin.x,origin.y,range);
    }
    if(heroId==='earthHammer'&&slot===1){
      const aim=Math.atan2(target.y-origin.y,target.x-origin.x),charge=clamp((this.time.now-this.coreSiegeTargetingStartedAt)/1200,0,1),slamRange=radius*(.68+charge*.32);
      g.fillStyle(color,.14+.08*charge).slice(origin.x,origin.y,slamRange,aim-.88,aim+.88,true).fillPath();g.lineStyle(4,color,.75+.2*charge).beginPath().arc(origin.x,origin.y,slamRange,aim-.88,aim+.88).strokePath();
      g.fillStyle(0x071018,.82).fillRoundedRect(origin.x-46,origin.y+38,92,9,3);g.fillStyle(color,.92).fillRoundedRect(origin.x-45,origin.y+39,90*charge,7,2);
    }else if(heroId==='twinBlade'&&(slot===1||slot===3)){
      const aim=Math.atan2(target.y-origin.y,target.x-origin.x),sx=-Math.sin(aim),sy=Math.cos(aim),offset=slot===3?105:72;
      g.lineStyle(12,color,.16).lineBetween(origin.x,origin.y,target.x+sx*offset,target.y+sy*offset).lineBetween(target.x+sx*offset,target.y+sy*offset,target.x-sx*offset,target.y-sy*offset);
      g.lineStyle(3,0xffffff,.86).lineBetween(origin.x,origin.y,target.x+sx*offset,target.y+sy*offset).lineBetween(target.x+sx*offset,target.y+sy*offset,target.x-sx*offset,target.y-sy*offset);
      if(slot===3)g.lineStyle(3,color,.85).lineBetween(target.x-sx*offset,target.y-sy*offset,target.x+Math.cos(aim)*135,target.y+Math.sin(aim)*135);
    }else if((heroId==='vanguard'||heroId==='orbitalSniper')&&slot===3){
      const dx=target.x-origin.x,dy=target.y-origin.y,len=Math.hypot(dx,dy)||1;
      g.lineStyle(18,0xffd45c,.12).lineBetween(origin.x,origin.y,origin.x+dx/len*1050,origin.y+dy/len*1050);
      g.lineStyle(3,0xfff0a5,.9).lineBetween(origin.x,origin.y,origin.x+dx/len*1050,origin.y+dy/len*1050);
    }else{
      g.fillStyle(color,.12).fillCircle(target.x,target.y,radius);
      g.lineStyle(4,color,.88).strokeCircle(target.x,target.y,radius);
      g.lineStyle(2,0xffffff,.85).strokeCircle(target.x,target.y,8);
    }
  }

  private drawThrowableGuide(time:number,me:any){
    const g=this.throwGuideG;g.clear();
    if(!me||!me.alive||me.phase!=='landed'||me.isSwimming||this.isTyping()||!this.localThrowPreparing||!isThrowableType(me.equipped))return;
    const heldMs=clamp(time-this.localThrowStartedAt,0,THROWABLE_MAX_CHARGE_MS);
    let origin:any=this.predictedLocal??{x:me.x,y:me.y};
    if(me.isDriving&&me.vehicleId)origin=this.displayMotorcycles.get(String(me.vehicleId))??this.net.snapshot?.motorcycles.find((motorcycle:any)=>motorcycle.id===me.vehicleId)??origin;
    const start=createThrowableMotion(Number(origin.x)+this.localAimX*(PLAYER_BODY_RADIUS+8),Number(origin.y)+this.localAimY*(PLAYER_BODY_RADIUS+8),this.localAimX,this.localAimY,heldMs);
    const type=me.equipped as ThrowableType,trajectory=predictThrowableTrajectory(start,this.mapConfig,THROWABLE_CONFIGS[type]);
    const color=trajectory.blockedImmediately?0xff5564:trajectory.firstCollision==='none'?0x68f09a:0xffd45c;
    const charge=heldMs/THROWABLE_MAX_CHARGE_MS;
    const barX=start.x-38,barY=start.y+34;g.fillStyle(0x071018,.72).fillRoundedRect(barX,barY,76,8,3);g.fillStyle(color,.92).fillRoundedRect(barX+1,barY+1,74*charge,6,2);
    for(let index=1;index<trajectory.points.length;index++){
      const a=trajectory.points[index-1]!,b=trajectory.points[index]!;if(index%2===0)continue;
      g.lineStyle(index<10?3:2,color,index<10?.9:.55).lineBetween(a.x,a.y-a.z*.25,b.x,b.y-b.z*.25);
    }
    for(const point of trajectory.points.filter((item)=>item.collision!=='none'))g.fillStyle(color,.92).fillCircle(point.x,point.y-point.z*.25,5);
    const radius=throwableEffectRadius(type,this.mapConfig.bushes),landing=trajectory.landing;
    g.fillStyle(color,.16).fillCircle(landing.x,landing.y,radius);g.lineStyle(3,color,.84).strokeCircle(landing.x,landing.y,radius);g.fillStyle(color,.95).fillCircle(landing.x,landing.y,6);
  }

  private local(){return this.net.snapshot?.players.find(p=>p.id===this.net.sessionId);}

  private currentSpectateTarget<T extends {id:string;alive:boolean;phase:string}>(players:readonly T[],excludeId=''){
    const target=resolveSpectatorTarget(players,this.spectateTargetId,excludeId);
    if(target)this.spectateTargetId=target.id;
    return target;
  }

  private cycleSpectateTarget(direction:-1|1){
    if(this.isTyping())return;
    const players=this.net.snapshot?.players??[],me=this.local();
    if(me?.alive)return;
    const target=cycleSpectatorTarget(players,this.spectateTargetId,direction,me?.id??'');
    if(target)this.spectateTargetId=target.id;
  }

  private isTyping(){
    const active=document.activeElement;
    return this.chatBlocked||active instanceof HTMLInputElement||active instanceof HTMLTextAreaElement;
  }

  private ensureMapState(snapshot:any){
    const mode=(snapshot?.mapId??snapshot?.mapSizeMode??'small') as MapId;
    const revision=Number(snapshot?.mapRevision??0);
    if(this.mapConfig.id===mode&&this.mapRevision===revision)return;
    this.mapConfig=getMapConfig(mode);
    this.mapRevision=revision;
    this.cameras.main.setBounds(0,0,this.mapConfig.width,this.mapConfig.height);
    this.predictedLocal=null;
    this.displayPlayers.clear();
    this.displayBullets.clear();
    this.remoteBuffers.clear();
    this.displayMotorcycles.clear();
    this.localVehicleHeldMs=0;this.localVehicleInputX=0;this.localVehicleInputY=0;
    this.lastVisibility.clear();
    this.revealStartedAt.clear();
    this.currentRegionId='';
    this.activeBuildingId='';
    this.activePortalId='';this.activePortalBuildingId='';this.activePortalKind='';this.activePortalSelectedAt=0;
    this.deathVisuals=[];this.cancelLocalThrow();this.throwGuideG.clear();this.cancelCoreSiegeTargeting();this.abilityGuideG.clear();this.coreSiegeEffects=[];
    this.localDeathPoint=null;
    this.localDeathCameraUntil=0;
    this.portalRevealKeys.clear();
    if(this.windowVisionCanvas){this.windowVisionCanvas.classList.add('hidden');this.windowVisionContext?.clearRect(0,0,this.windowVisionCanvas.width,this.windowVisionCanvas.height);}
    this.drawStaticMap();
    this.createBuildingRoofs();
    this.drawFoliage();
    this.lastMiniDraw=0;this.miniStaticKey='';
    this.lastSlowDraw=0;
  }

  private mobileSmartActionContext(me:any,s:any):MobileSmartAction{
    if(!me?.alive)return{label:'행동',action:'none'};
    if(me.phase==='plane')return{label:'낙하',action:'jump'};
    if(me.phase!=='landed'||me.isSwimming||me.isVaulting||me.exoAssembling||me.werewolf?.transformPreparing||me.werewolf?.transformed)return{label:'행동',action:'none'};
    if(me.isDriving)return{label:'내리기',action:'interact'};
    const season=s?.werewolfSeason;
    if(season?.altarPhase==='active'&&Math.hypot(Number(season.altarX)-me.x,Number(season.altarY)-me.y)<=WEREWOLF_BALANCE.ritualRadius+8)return{label:'의식 유지',action:'ritual'};
    if(season?.armoryActive&&!season.armoryOpened&&Math.hypot(Number(season.armoryX)-me.x,Number(season.armoryY)-me.y)<=100)return{label:'무기고 열기',action:'interact'};
    if(season?.curseDropActive&&!me.werewolf?.hasCurse&&Math.hypot(Number(season.curseDropX)-me.x,Number(season.curseDropY)-me.y)<=62)return{label:'저주 획득',action:'interact'};
    for(const drop of s?.supplyDrops??[])if(drop.landed&&!drop.opened&&Math.hypot(Number(drop.x)-me.x,Number(drop.y)-me.y)<=88)return{label:'보급 열기',action:'interact'};
    for(const vehicle of s?.motorcycles??[]){
      if(vehicle.driverId||vehicle.destroyed||vehicle.exploding||!buildingSpacesInteractable(me,vehicle))continue;
      const extra=vehicle.vehicleKind==='fusion_robot'?FUSION_ROBOT_BALANCE.collisionRadius-MOTORCYCLE_RADIUS:0;
      if(Math.hypot(Number(vehicle.x)-me.x,Number(vehicle.y)-me.y)-extra<MOTORCYCLE_MOUNT_DISTANCE)return{label:vehicle.vehicleKind==='tank'?'탱크 탑승':vehicle.vehicleKind==='fusion_robot'?'로봇 탑승':'오토바이 탑승',action:'interact'};
    }
    const now=Number(s?.serverTime??0);
    for(const loot of s?.loot??[]){
      if(loot.pickupLockedForPlayerId===me.id&&now<Number(loot.pickupLockedUntil??0)||!spaceInteractionAllowed(me,loot,this.mapConfig.portals))continue;
      if(Math.hypot(Number(loot.x)-me.x,Number(loot.y)-me.y)<72)return{label:'아이템 획득',action:'interact'};
    }
    if(me.werewolf?.hasCurse)return{label:'늑대 변신',action:'werewolfTransform'};
    const vault=findPortalVaultCandidate(me.x,me.y,String(me.buildingId??''),Number(me.roomIndex??0),this.mapConfig.portals);
    if(vault)return{label:'창문 넘기',action:'vault'};
    return{label:'행동',action:'none'};
  }

  private mobileAimAssist(me:any,origin:DisplayPoint,rawAim:{x:number;y:number},vehicle:any):MobileAimAssistResult{
    const weaponId=String(me?.equipped??'') as WeaponId;
    const weapon=WEAPONS[weaponId];
    const vehicleKind=String(vehicle?.vehicleKind??'');
    const mechanical=vehicleKind==='tank'||vehicleKind==='fusion_robot'||Boolean(me?.exoActive);
    const melee=mechanical?undefined:weaponId==='fists'?WEAPONS.fists:MELEE_WEAPONS[weaponId as MeleeId];
    const meleeMode=Boolean(!mechanical&&(melee||me?.werewolf?.transformed));
    if((!weapon&&!mechanical&&!meleeMode)||weaponId==='adhesive_sprayer'||isThrowableType(weaponId as EquippedId)){
      this.mobileAimAssistTargetId='';this.mobileAimAssistActive=false;return{...rawAim,targetId:''};
    }
    const meleeRange=me?.werewolf?.transformed?WEREWOLF_BALANCE.clawRange+PLAYER_HIT_RADIUS+8:Number(melee?.range??60)+PLAYER_HIT_RADIUS+14;
    const maxRange=meleeMode?meleeRange:vehicleKind==='tank'?1250:vehicleKind==='fusion_robot'?1050:me?.exoActive?950:Math.max(180,Number(weapon?.range??800));
    const closeLockRange=meleeMode?maxRange:0;
    let cone=.17,baseStrength=.28;
    if(mechanical){cone=.14;baseStrength=.25;}
    else if(weaponId==='stun_gun'){cone=.21;baseStrength=.42;}
    else if(weaponId==='pistol'||weaponId==='smg'){cone=.19;baseStrength=.35;}
    else if(weaponId==='rifle'){cone=.16;baseStrength=.30;}
    else if(weaponId==='boomerang'){cone=.18;baseStrength=.38;}
    else if(weaponId==='shotgun'){cone=.22;baseStrength=.40;}
    else if(weaponId==='flamethrower'){cone=.21;baseStrength=.34;}
    else if(weaponId==='sniper'){cone=.052;baseStrength=.15;}
    else if(weaponId==='bazooka'){cone=.07;baseStrength=.15;}
    let selected:{id:string;x:number;y:number;angle:number;score:number;close:boolean}|undefined;
    for(const target of this.net.snapshot?.players??[]){
      if(target.id===me.id||!target.alive||target.phase!=='landed'||(this.net.roomConfig.gameMode==='domination'||this.net.roomConfig.gameMode==='coreSiege')&&String(target.team??'none')===String(me.team??'none'))continue;
      const point=this.framePositions.get(target.id)??target,dx=Number(point.x)-origin.x,dy=Number(point.y)-origin.y,range=Math.hypot(dx,dy);
      if(this.isCoreSiege()&&(this.net.snapshot?.smokeFields??[]).some((field:any)=>Number(this.net.snapshot?.serverTime??0)<Number(field.expiresAt??Infinity)&&distance(Number(point.x),Number(point.y),Number(field.x),Number(field.y))<=Number(field.radius)))continue;
      if(range<1||range>maxRange+(target.isDriving?70:PLAYER_HIT_RADIUS)||!mechanical&&weaponId==='bazooka'&&range<190)continue;
      const directionX=dx/range,directionY=dy/range,angle=Math.acos(clamp(rawAim.x*directionX+rawAim.y*directionY,-1,1));
      const locked=target.id===this.mobileAimAssistTargetId,allowedCone=cone*(locked?1.35:1);
      const closeCone=meleeMode?.95:0;
      const close=closeLockRange>0&&range<=closeLockRange*(locked?1.16:1)+(target.isDriving?70:PLAYER_HIT_RADIUS)&&angle<=closeCone*(locked?1.15:1);
      if(!close&&angle>allowedCone||!this.getPlayerVisibility(target).visibleInWorld||!segmentClearOfRects(origin.x,origin.y,Number(point.x),Number(point.y),this.mapConfig.bulletObstacles))continue;
      const score=(close?0:angle/allowedCone*.72)+range/Math.max(1,close?closeLockRange:maxRange)*.28-(locked?.12:0);
      if(!selected||score<selected.score)selected={id:target.id,x:directionX,y:directionY,angle,score,close};
    }
    if(!selected){this.mobileAimAssistTargetId='';this.mobileAimAssistActive=false;return{...rawAim,targetId:''};}
    this.mobileAimAssistTargetId=selected.id;this.mobileAimAssistActive=true;
    const centerBias=clamp(1-selected.angle/(cone*1.2),0,1),strength=selected.close?1:baseStrength*(.55+centerBias*.45);
    const assisted=normalizeAimVector(rawAim.x*(1-strength)+selected.x*strength,rawAim.y*(1-strength)+selected.y*strength)??rawAim;
    return{...assisted,targetId:selected.id};
  }

  private updateCameraForWeapon(me:any,shown:DisplayPoint,aiming:boolean,dt:number){
    const sniper=Boolean(me?.alive&&me?.equipped==='sniper');
    const mobileViewZoom=mobileControls.active?mobileControls.viewZoom:1;
    const targetZoom=aiming?.82:sniper?.92*mobileViewZoom:mobileViewZoom;
    const camera=this.cameras.main;
    const zoomAlpha=1-Math.exp(-(aiming?8:10)*dt);
    camera.setZoom(Phaser.Math.Linear(camera.zoom,targetZoom,zoomAlpha));
    const pointerDistance=Math.hypot(this.pointerScreenX-this.scale.width/2,this.pointerScreenY-this.scale.height/2)/Math.max(.1,camera.zoom);
    const lead=aiming?Math.min(220,pointerDistance*.45):0;
    const halfW=this.scale.width/(2*Math.max(.1,camera.zoom)),halfH=this.scale.height/(2*Math.max(.1,camera.zoom));
    const targetX=clamp(shown.x+this.localAimX*lead,halfW,Math.max(halfW,this.mapConfig.width-halfW));
    const targetY=clamp(shown.y+this.localAimY*lead,halfH,Math.max(halfH,this.mapConfig.height-halfH));
    const center=camera.midPoint;
    const cameraAlpha=1-Math.exp(-(aiming?7:11)*dt);
    camera.centerOn(Phaser.Math.Linear(center.x,targetX,cameraAlpha),Phaser.Math.Linear(center.y,targetY,cameraAlpha));
  }

  private resizeOverlayCanvases(){
    const dpr=Math.max(1,window.devicePixelRatio||1);
    const width=Math.max(1,Math.round(this.scale.width*dpr));
    const height=Math.max(1,Math.round(this.scale.height*dpr));
    for(const canvas of [this.scopeCanvas,this.windowVisionCanvas]){
      if(!canvas)continue;
      if(canvas.width!==width)canvas.width=width;
      if(canvas.height!==height)canvas.height=height;
      canvas.style.width=`${this.scale.width}px`;
      canvas.style.height=`${this.scale.height}px`;
    }
  }

  private drawMobileAimGuide(me:any,motorcycle:any,g:Phaser.GameObjects.Graphics){
    const source=motorcycle??this.predictedLocal??me,camera=this.cameras.main,weaponId=String(me?.equipped??'') as WeaponId,weapon=WEAPONS[weaponId],fusionSlot=Math.max(1,Math.min(4,Math.floor(Number(motorcycle?.fusionWeaponSlot||1))));
    let weaponRange=Number(weapon?.range??MELEE_WEAPONS[weaponId as MeleeId]?.range??110),explosionRadius=0;
    if(motorcycle?.vehicleKind==='tank'){weaponRange=760;explosionRadius=172;}
    else if(motorcycle?.vehicleKind==='fusion_robot'){
      weaponRange=fusionSlot===1?EXO_SUIT_BALANCE.bombRange:fusionSlot===2?EXO_SUIT_BALANCE.laserRange:fusionSlot===3?EMP_EXO_SUIT_BALANCE.machineGunRange:EMP_EXO_SUIT_BALANCE.empRadius;
      if(fusionSlot===1)explosionRadius=EXO_SUIT_BALANCE.bombRadius;
    }else if(me?.exoActive){weaponRange=me.exoKind==='emp'?EMP_EXO_SUIT_BALANCE.machineGunRange:EXO_SUIT_BALANCE.bombRange;if(me.exoKind!=='emp')explosionRadius=EXO_SUIT_BALANCE.bombRadius;}
    else if(weaponId==='bazooka')explosionRadius=BAZOOKA_BALANCE.explosionRadius;
    const maxScreenLength=this.mobileAimGuideActive?Math.min(this.scale.width*.46,this.scale.height*.72):Math.min(104,this.scale.height*.30),worldLength=this.mobileAimGuideActive&&this.mobilePrecisionRelease?weaponRange:Math.max(36,Math.min(weaponRange,maxScreenLength/Math.max(.1,camera.zoom)));
    const sourceX=Number(source.x),sourceY=Number(source.y),targetX=sourceX+this.localAimX*worldLength,targetY=sourceY+this.localAimY*worldLength;
    let hitT=1;
    for(const rect of this.mapConfig.bulletObstacles){const t=segmentRectIntersectionT(sourceX,sourceY,targetX,targetY,rect);if(t!==null&&t>.015)hitT=Math.min(hitT,t);}
    const hitX=sourceX+(targetX-sourceX)*hitT,hitY=sourceY+(targetY-sourceY)*hitT,start=this.worldToScreen(sourceX,sourceY),end=this.worldToScreen(hitX,hitY),blocked=hitT<.999,hitDistance=worldLength*hitT,selfDanger=this.mobileAimGuideActive&&explosionRadius>0&&hitDistance<explosionRadius*1.15;
    const color=blocked||selfDanger?0xff7474:this.mobileAimAssistActive?0x67e8ff:0xffd565,alpha=this.mobileAimGuideActive?.82:.25,lineWidth=this.mobileAimGuideActive?2:1;
    const screenDx=end.x-start.x,screenDy=end.y-start.y,screenDistance=Math.hypot(screenDx,screenDy)||1,startPadding=Math.min(15,screenDistance*.18);
    g.lineStyle(lineWidth,color,alpha).lineBetween(start.x+screenDx/screenDistance*startPadding,start.y+screenDy/screenDistance*startPadding,end.x,end.y);
    if(!this.mobileAimGuideActive)return;
    g.fillStyle(color,.92).fillCircle(end.x,end.y,3);
    if(!this.mobilePrecisionRelease)return;
    g.lineStyle(2,color,.85).strokeCircle(end.x,end.y,8).lineBetween(end.x-13,end.y,end.x-7,end.y).lineBetween(end.x+7,end.y,end.x+13,end.y).lineBetween(end.x,end.y-13,end.x,end.y-7).lineBetween(end.x,end.y+7,end.x,end.y+13);
    if(explosionRadius>0){const radius=clamp(explosionRadius*camera.zoom,18,86);g.lineStyle(1,color,selfDanger?.72:.42).strokeCircle(end.x,end.y,radius);}
  }

  private updateCombatHud(me:any,motorcycle:any,typing:boolean,dt:number){
    this.crosshairKick=Math.max(0,this.crosshairKick-dt*24);
    this.updateScopeOverlay(me,dt);
    const g=this.crosshairG;g.clear();
    if(typing||!me?.alive||me.phase!=='landed'||me.isSwimming||me.werewolf?.transformed&&!mobileControls.active||this.scopeBlend>.05)return;
    if(mobileControls.active)this.drawMobileAimGuide(me,motorcycle,g);
    if(this.mobileAimAssistActive)g.lineStyle(2,0x67e8ff,.88).strokeCircle(this.pointerScreenX,this.pointerScreenY,5+Math.sin(this.time.now*.018));
    if(motorcycle?.vehicleKind==='fusion_robot'){
      const x=this.pointerScreenX,y=this.pointerScreenY,slot=Math.max(1,Math.min(4,Math.floor(Number(motorcycle.fusionWeaponSlot||1)))) as FusionRobotWeaponSlot,disabled=Number(motorcycle.empDisabledUntil??0)>Number(this.net.snapshot?.serverTime??0),colors={1:0xff5b55,2:0xffd45a,3:0x75d9ff,4:0x55a8ff} as const,color=disabled?0x70808a:colors[slot],gap=10+this.crosshairKick*.35;
      g.lineStyle(3,color,disabled?.42:.96).strokeCircle(x,y,gap);for(let index=0;index<4;index++){const angle=index*Math.PI/2,inner=gap+5,outer=gap+13+(index===slot-1?5:0);g.lineBetween(x+Math.cos(angle)*inner,y+Math.sin(angle)*inner,x+Math.cos(angle)*outer,y+Math.sin(angle)*outer);}g.fillStyle(color,disabled?.45:.96).fillCircle(x,y,2);return;
    }
    if(me.exoActive){const x=this.pointerScreenX,y=this.pointerScreenY,emp=me.exoKind==='emp',disabled=Number(me.empDisabledUntil??0)>Number(this.net.snapshot?.serverTime??0),color=disabled?0x70808a:emp?0x69ddff:0xf4fbff,gap=emp?10:8;g.lineStyle(2,color,disabled ? .45 : .95).strokeCircle(x,y,gap);for(let index=0;index<4;index++){const angle=index*Math.PI/2,inner=gap+4,outer=gap+(emp?11:8);g.lineBetween(x+Math.cos(angle)*inner,y+Math.sin(angle)*inner,x+Math.cos(angle)*outer,y+Math.sin(angle)*outer);}g.fillStyle(color,disabled ? .5 : .95).fillCircle(x,y,2);return;}
    const id=me.equipped as WeaponId;
    const weapon=WEAPONS[id];
    if(!weapon||id==='fists'){
      if(mobileControls.active){const x=this.pointerScreenX,y=this.pointerScreenY,color=this.mobileAimAssistActive?0x67e8ff:0xffd565;g.lineStyle(2,color,.88).strokeCircle(x,y,7).lineBetween(x-12,y,x-6,y).lineBetween(x+6,y,x+12,y).lineBetween(x,y-12,x,y-6).lineBetween(x,y+6,x,y+12);}
      return;
    }
    const moving=Boolean(this.keys.W.isDown||this.keys.A.isDown||this.keys.S.isDown||this.keys.D.isDown);
    const vehicleMaxSpeed=MOTORCYCLE_MAX_SPEED*(motorcycle?.vehicleKind==='tank'?TANK_BALANCE.speedMultiplier:motorcycle?.vehicleKind==='fusion_robot'?FUSION_ROBOT_BALANCE.speedMultiplier:1);
    const speedRatio=motorcycle?clamp(Math.abs(Number(motorcycle.speed||0))/vehicleMaxSpeed,0,1):0;
    const spread=motorcycle?motorcycleSpreadRadians(id,weapon.spread,speedRatio,this.time.now<this.localVehicleTurnPenaltyUntil?1:0):weapon.spread;
    const gap=clamp(5+spread*105+this.crosshairKick+(moving&&!motorcycle?3:0),5,46);
    const x=this.pointerScreenX,y=this.pointerScreenY;
    g.lineStyle(id==='sniper'?1.5:2,0xf4fbff,.94);
    if(id==='shotgun'){
      g.strokeCircle(x,y,gap+10);
      g.fillStyle(0xf4fbff,.92).fillCircle(x,y,2);
      return;
    }
    const arm=id==='pistol'||id==='sniper'?6:8;
    g.lineBetween(x-gap-arm,y,x-gap,y).lineBetween(x+gap,y,x+gap+arm,y).lineBetween(x,y-gap-arm,x,y-gap).lineBetween(x,y+gap,x,y+gap+arm);
    if(id==='sniper')g.fillStyle(0xf4fbff,.9).fillCircle(x,y,1.5);
    else g.lineStyle(1,0x071018,.7).strokeCircle(x,y,2.5);
  }

  private updateScopeOverlay(me:any,dt:number){
    const target=this.scopeRequested&&Boolean(me?.alive)&&me?.equipped==='sniper'?1:0;
    const duration=target>.5?.23:.19;
    const step=duration>0?dt/duration:1;
    this.scopeBlend=target>this.scopeBlend?Math.min(target,this.scopeBlend+step):Math.max(target,this.scopeBlend-step);
    const canvas=this.scopeCanvas,context=this.scopeContext;
    if(!canvas||!context)return;
    if(this.scopeBlend<=.001){context.setTransform(1,0,0,1,0,0);context.clearRect(0,0,canvas.width,canvas.height);canvas.classList.add('hidden');return;}
    canvas.classList.remove('hidden');
    this.resizeOverlayCanvases();
    const dpr=Math.max(1,window.devicePixelRatio||1),width=this.scale.width,height=this.scale.height;
    context.setTransform(dpr,0,0,dpr,0,0);
    context.clearRect(0,0,width,height);
    const lensWidth=clamp(width*.27,300,430),lensHeight=clamp(height*.32,230,320);
    const lensX=clamp(this.pointerScreenX,lensWidth*.5+8,width-lensWidth*.5-8);
    const lensY=clamp(this.pointerScreenY,lensHeight*.5+8,height-lensHeight*.5-8);
    const localPoint=this.predictedLocal??(me?{x:me.x,y:me.y}:undefined);
    const playerScreen=localPoint?this.worldToScreen(localPoint.x,localPoint.y):{x:width/2,y:height/2};
    const angle=Math.atan2(lensY-playerScreen.y,lensX-playerScreen.x);
    const normalX=-Math.sin(angle),normalY=Math.cos(angle);
    const startHalf=16,endHalf=lensHeight*.33;

    context.fillStyle=`rgba(1,7,12,${.86*this.scopeBlend})`;
    context.fillRect(0,0,width,height);
    context.save();
    context.globalCompositeOperation='destination-out';
    context.fillStyle=`rgba(0,0,0,${.96*this.scopeBlend})`;
    context.beginPath();
    context.moveTo(playerScreen.x+normalX*startHalf,playerScreen.y+normalY*startHalf);
    context.lineTo(lensX+normalX*endHalf,lensY+normalY*endHalf);
    context.lineTo(lensX-normalX*endHalf,lensY-normalY*endHalf);
    context.lineTo(playerScreen.x-normalX*startHalf,playerScreen.y-normalY*startHalf);
    context.closePath();
    context.fill();
    context.beginPath();
    context.ellipse(lensX,lensY,lensWidth*.5,lensHeight*.5,0,0,Math.PI*2);
    context.fill();
    context.restore();

    context.globalAlpha=this.scopeBlend;
    context.strokeStyle='rgba(225,242,246,.82)';
    context.lineWidth=2;
    context.beginPath();context.ellipse(lensX,lensY,lensWidth*.5,lensHeight*.5,0,0,Math.PI*2);context.stroke();
    context.strokeStyle='rgba(238,250,252,.92)';context.lineWidth=1;
    context.beginPath();context.moveTo(lensX-28,lensY);context.lineTo(lensX-5,lensY);context.moveTo(lensX+5,lensY);context.lineTo(lensX+28,lensY);context.moveTo(lensX,lensY-28);context.lineTo(lensX,lensY-5);context.moveTo(lensX,lensY+5);context.lineTo(lensX,lensY+28);context.stroke();
    context.fillStyle='rgba(238,250,252,.95)';context.beginPath();context.arc(lensX,lensY,2,0,Math.PI*2);context.fill();
    context.font='800 12px sans-serif';context.textAlign='center';context.fillStyle='rgba(225,240,244,.9)';context.fillText('좌클릭 발사 · 우클릭 해제',width/2,height-104);
    context.globalAlpha=1;
  }

  private worldToScreen(x:number,y:number){
    const camera=this.cameras.main;
    return{x:(x-camera.worldView.x)*camera.zoom,y:(y-camera.worldView.y)*camera.zoom};
  }

  private pointInsideScopeView(x:number,y:number){
    if(!this.scopeRequested)return true;
    const viewer=this.viewerPoint??this.local();
    if(!viewer)return false;
    const directional=pointInDirectionalScope(viewer.x,viewer.y,this.localAimX,this.localAimY,x,y,WEAPONS.sniper.range,Math.PI/13.5);
    const screen=this.worldToScreen(x,y);
    const lensWidth=clamp(this.scale.width*.27,300,430),lensHeight=clamp(this.scale.height*.32,230,320);
    const lensX=clamp(this.pointerScreenX,lensWidth*.5+8,this.scale.width-lensWidth*.5-8);
    const lensY=clamp(this.pointerScreenY,lensHeight*.5+8,this.scale.height-lensHeight*.5-8);
    const ellipse=((screen.x-lensX)/(lensWidth*.5))**2+((screen.y-lensY)/(lensHeight*.5))**2<=1;
    return directional||ellipse;
  }

  private receiveVehicleRecovery(payload:any){
    const x=Number(payload?.x),y=Number(payload?.y);
    if(!Number.isFinite(x)||!Number.isFinite(y))return;
    this.predictedLocal={x,y};
    this.cameras.main.fadeOut(55,4,8,12);
    this.time.delayedCall(60,()=>this.cameras.main.fadeIn(90,4,8,12));
  }

  private receivePositionRecovery(payload:any){
    const x=Number(payload?.x),y=Number(payload?.y);
    if(!Number.isFinite(x)||!Number.isFinite(y))return;
    this.predictedLocal={x,y};
    this.cameras.main.fadeOut(70,4,8,12);
    this.time.delayedCall(75,()=>this.cameras.main.fadeIn(110,4,8,12));
  }

  private receiveOpenArenaRespawn(payload:any){
    if(String(payload?.playerId??'')!==this.net.sessionId)return;
    const x=Number(payload?.x),y=Number(payload?.y);
    this.spectateTargetId='';this.localDeathPoint=null;this.localDeathCameraUntil=0;this.deathVisuals=this.deathVisuals.filter((item)=>item.entityId!==this.net.sessionId);
    if(Number.isFinite(x)&&Number.isFinite(y))this.predictedLocal={x,y};
    this.scopeRequested=false;this.cameras.main.fadeOut(70,4,8,12);this.time.delayedCall(75,()=>this.cameras.main.fadeIn(120,4,8,12));
    this.dispatchNotice('전장에 다시 투입되었습니다.','info',1500);
  }

  private receiveCharacterDeath(payload:CharacterDeathPayload){
    const entityId=String(payload.entityId??''),x=Number(payload.x),y=Number(payload.y);
    if(!entityId||!Number.isFinite(x)||!Number.isFinite(y))return;
    const local=entityId===this.net.sessionId;
    const wasVisible=local||Boolean(this.frameVisibility.get(entityId)?.visibleInWorld??this.lastVisibility.get(entityId));
    if(local)audio.playLocal('player_death',1,`death:${entityId}:${payload.diedAt??0}`);
    else if(wasVisible)this.playWorldAudio('player_death',{id:`death:${entityId}:${payload.diedAt??0}`,x,y,buildingId:String(payload.buildingId??''),sourceId:entityId},760);
    if(!wasVisible)return;
    const rawX=Number(payload.hitDirectionX),rawY=Number(payload.hitDirectionY),length=Math.hypot(rawX,rawY);
    const hitDirectionX=length>.001?rawX/length:Math.cos(Number(payload.angle)||0);
    const hitDirectionY=length>.001?rawY/length:Math.sin(Number(payload.angle)||0);
    const cause=String(payload.cause??'other');
    const pushDistance=cause==='frag_grenade'?28:cause==='incendiary'?18:cause==='motorcycle_explosion'?30:cause==='motorcycle_collision'?26:cause==='sniper'?20:cause==='shotgun'?16:cause==='zone'?2:12;
    const duration=cause==='zone'?1150:1000;
    const visual:DeathVisual={
      entityId,x,y,angle:Number(payload.angle)||0,buildingId:String(payload.buildingId??''),ai:Boolean(payload.ai),
      equipped:(payload.equipped??'fists') as EquippedId,cause,hitDirectionX,hitDirectionY,startedAt:this.time.now,duration,pushDistance:this.safeDeathPushDistance(x,y,hitDirectionX,hitDirectionY,pushDistance),
      inBush:Boolean(payload.inBush),bushRevealed:Boolean(payload.bushRevealed),local,
    };
    this.deathVisuals=this.deathVisuals.filter((item)=>item.entityId!==entityId);
    this.deathVisuals.push(visual);
    if(local){
      this.localDeathPoint={x,y};
      this.localDeathCameraUntil=this.time.now+700;
      this.scopeRequested=false;
      this.dispatchNotice(this.net.roomConfig.gameMode!=='battleRoyale'?'잠시 후 다시 투입됩니다.':'탈락했습니다.','warning',1600);
    }
  }

  private safeDeathPushDistance(x:number,y:number,dx:number,dy:number,requested:number){
    let safe=0;
    for(let step=1;step<=8;step++){
      const distanceOut=requested*step/8,px=x+dx*distanceOut,py=y+dy*distanceOut;
      if(px<PLAYER_BODY_RADIUS||py<PLAYER_BODY_RADIUS||px>this.mapConfig.width-PLAYER_BODY_RADIUS||py>this.mapConfig.height-PLAYER_BODY_RADIUS)break;
      if(this.mapConfig.collisionObstacles.some((rect)=>circleHitsRect(px,py,PLAYER_BODY_RADIUS*.72,rect)))break;
      safe=distanceOut;
    }
    return safe;
  }

  private drawDebug(snapshot:any){
    const g=this.debugG;g.clear();
    if(!this.perfVisible||!this.debugWorldVisible)return;
    const view=this.cameras.main.worldView;
    const inView=(x:number,y:number,m=80)=>x>=view.x-m&&x<=view.right+m&&y>=view.y-m&&y<=view.bottom+m;
    for(const player of snapshot.players??[]){
      if(!player.alive)continue;
      const point=this.framePositions.get(player.id)??{x:player.x,y:player.y};
      if(!inView(point.x,point.y))continue;
      g.lineStyle(1,0x55d6ff,.72).strokeCircle(point.x,point.y,PLAYER_BODY_RADIUS);
      g.lineStyle(1,0xff595f,.75).strokeCircle(point.x,point.y,PLAYER_HIT_RADIUS);
      g.lineStyle(1,0xffd64f,.45).strokeCircle(point.x,point.y,PLAYER_SEPARATION_RADIUS);
    }
    const local=this.predictedLocal??this.local();
    if(local){const length=WEAPONS.sniper.range;g.lineStyle(1,0xff5bc8,.7).lineBetween(local.x,local.y,local.x+this.localAimX*length,local.y+this.localAimY*length);}
    for(const zone of this.mapConfig.buildingVisibilityZones)for(const window of zone.windows){
      if(!inView(window.x+window.width/2,window.y+window.height/2,80))continue;
      g.lineStyle(2,0x63e6ff,.82).strokeRect(window.x,window.y,window.width,window.height);
      g.fillStyle(0x63e6ff,.9).fillCircle(window.x+window.width/2,window.y+window.height/2,3);
    }
    for(const bullet of snapshot.bullets??[]){
      if(!inView(bullet.x,bullet.y,120))continue;
      const px=Number.isFinite(bullet.prevX)?bullet.prevX:bullet.x-Number(bullet.vx||0)*.033;
      const py=Number.isFinite(bullet.prevY)?bullet.prevY:bullet.y-Number(bullet.vy||0)*.033;
      const rail=bullet.weaponId==='railgun';g.lineStyle(rail?3:1,rail?0x67e8ff:bullet.weaponId==='sniper'?0xff4f5f:0xffffff,.75).lineBetween(px,py,bullet.x,bullet.y);
      g.fillStyle(rail?0xd8fbff:0xffffff,.8).fillCircle(bullet.x,bullet.y,rail?3:2);
    }
  }

  private drawStaticMap(){
    const g=this.staticG;
    g.clear();
    for(const label of this.mapLabels)label.destroy();
    this.mapLabels=[];
    g.fillStyle(0x153424).fillRect(0,0,this.mapConfig.width,this.mapConfig.height);
    if(this.net.roomConfig.practiceMode){const width=1400,height=900,x=(this.mapConfig.width-width)/2,y=(this.mapConfig.height-height)/2;g.fillStyle(0x202d31,.98).fillRect(x,y,width,height);g.lineStyle(8,0x4b6c70,.8).strokeRect(x,y,width,height);g.lineStyle(3,0x83a7a8,.18).lineBetween(x+width/2,y,x+width/2,y+height).lineBetween(x,y+height/2,x+width,y+height/2);for(let marker=1;marker<7;marker++){g.fillStyle(marker%2?0x34484a:0x2b3d40,.75).fillRect(x+marker*width/7-2,y,4,height);}this.mapLabels.push(this.add.text(x+width/2,y+35,'영웅 연구소',{fontFamily:'sans-serif',fontSize:'28px',fontStyle:'bold',color:'#b8d9d7'}).setOrigin(.5).setDepth(RENDER_DEPTH.FLOOR_DECORATION));return;}
    for(const r of this.mapConfig.regions){
      const theme=REGION_THEMES[r.id];
      g.fillStyle(theme.ground,.7).fillRoundedRect(r.x,r.y,r.w,r.h,28);
      g.lineStyle(4,theme.groundAccent,.32).strokeRoundedRect(r.x,r.y,r.w,r.h,28);
      for(let stripe=0;stripe<5;stripe++){
        const sy=r.y+90+stripe*Math.max(90,(r.h-180)/5);
        g.lineStyle(2,theme.groundAccent,.08).lineBetween(r.x+30,sy,r.x+r.w-30,sy);
      }
      this.mapLabels.push(this.add.text(r.x+20,r.y+18,r.name,{fontFamily:'sans-serif',fontSize:'30px',fontStyle:'bold',color:'#ffffff88'}).setDepth(RENDER_DEPTH.FLOOR_DECORATION));
    }
    if(this.mapConfig.id==='coreSiege')this.drawCoreSiegeMapFoundation(g);
    for(const river of this.mapConfig.rivers){
      const segmentWidth=(index:number)=>{
        const a=river.widths[index]??river.widths.at(-1)??760;
        const b=river.widths[index+1]??a;
        return(a+b)/2;
      };
      if(this.mapConfig.id==='dock8'){
        const drawJoinedLayer=(extra:number,color:number,alpha:number)=>{
          for(let index=0;index<river.points.length-1;index++){
            const a=river.points[index]!,b=river.points[index+1]!,width=segmentWidth(index)+extra;
            g.lineStyle(width,color,alpha).lineBetween(a.x,a.y,b.x,b.y);
            g.fillStyle(color,alpha).fillCircle(a.x,a.y,width/2).fillCircle(b.x,b.y,width/2);
          }
        };
        drawJoinedLayer(160,0x9f9278,.72);
        drawJoinedLayer(96,0x5aa5b1,.84);
        drawJoinedLayer(0,0x1f668c,.97);
      }else{
        for(let index=0;index<river.points.length-1;index++){
          const a=river.points[index]!,b=river.points[index+1]!,width=segmentWidth(index);
          g.lineStyle(width+160,0x9f9278,.72).lineBetween(a.x,a.y,b.x,b.y);
          g.lineStyle(width+96,0x5aa5b1,.84).lineBetween(a.x,a.y,b.x,b.y);
          g.lineStyle(width,0x1f668c,.97).lineBetween(a.x,a.y,b.x,b.y);
        }
      }
      for(let index=0;index<river.points.length-1;index++){
        const a=river.points[index]!,b=river.points[index+1]!,width=segmentWidth(index);
        g.lineStyle(Math.max(16,width*.055),0x78c3d7,.2).lineBetween(a.x,a.y,b.x,b.y);
        const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1,nx=-dy/length,ny=dx/length;
        for(let step=45;step<length;step+=90){
          const t=step/length,cx=a.x+dx*t,cy=a.y+dy*t,half=width/2;
          g.fillStyle(0xd6f5f4,.48).fillCircle(cx+nx*half,cy+ny*half,4).fillCircle(cx-nx*half,cy-ny*half,4);
        }
      }
    }
    for(const zone of this.mapConfig.shallowWaterZones){
      g.fillStyle(0x4a9bb2,.72).fillRect(zone.x,zone.y,zone.w,zone.h);
      g.lineStyle(2,0xa6dce8,.3).strokeRect(zone.x,zone.y,zone.w,zone.h);
    }
    for(const crossing of this.mapConfig.landCrossings){
      const color=crossing.kind==='ford'?0x91a77d:crossing.kind==='foot_bridge'?0x8b765c:0x555c61;
      g.fillStyle(color,.98).fillRect(crossing.rect.x,crossing.rect.y,crossing.rect.w,crossing.rect.h);
      g.lineStyle(3,crossing.kind==='ford'?0xd8e5bc:0xd5d2c4,.48).strokeRect(crossing.rect.x,crossing.rect.y,crossing.rect.w,crossing.rect.h);
      if(crossing.kind==='ford')for(let x=crossing.rect.x+40;x<crossing.rect.x+crossing.rect.w;x+=80)g.fillStyle(0xd5c89f,.42).fillCircle(x,crossing.rect.y+crossing.rect.h/2+(x%160?22:-22),9);
    }
    for(const exit of this.mapConfig.shoreExits){
      g.fillStyle(0xc7d59a,.45).fillCircle(exit.landingPoint.x,exit.landingPoint.y,18);
      g.lineStyle(3,0xeaf1ca,.35).strokeCircle(exit.landingPoint.x,exit.landingPoint.y,24);
    }
    for(const b of this.mapConfig.buildings){
      const theme=REGION_THEMES[b.regionId];
      g.fillStyle(theme.groundAccent,.28).fillRect(b.x+18,b.y+18,Math.max(1,b.w-36),Math.max(1,b.h-36));
      g.lineStyle(2,theme.accent,.14).strokeRect(b.x+18,b.y+18,Math.max(1,b.w-36),Math.max(1,b.h-36));
      for(let lineY=b.y+42;lineY<b.y+b.h-24;lineY+=42)g.lineStyle(1,0xffffff,.045).lineBetween(b.x+24,lineY,b.x+b.w-24,lineY);
    }
    for(const decoration of this.mapConfig.decorations)this.drawDecoration(g,decoration.kind,decoration.x,decoration.y,decoration.w,decoration.h,decoration.rotation??0);
    for(const wall of this.mapConfig.obstacles){
      const building=this.mapConfig.buildings.find((item)=>wall.x>=item.x-1&&wall.x<=item.x+item.w+1&&wall.y>=item.y-1&&wall.y<=item.y+item.h+1);
      const theme=building?REGION_THEMES[building.regionId]:this.mapConfig.id==='coreSiege'?REGION_THEMES.military:REGION_THEMES.residential;
      g.fillStyle(theme.wall).fillRect(wall.x,wall.y,wall.w,wall.h);
      g.lineStyle(2,0x10181d,.82).strokeRect(wall.x,wall.y,wall.w,wall.h);
    }
    for(const zone of this.mapConfig.buildingVisibilityZones)for(const window of zone.windows){
      g.fillStyle(0x07131b,.96).fillRect(window.x,window.y,window.width,window.height);
      g.lineStyle(3,0x8ac9d9,.74).strokeRect(window.x,window.y,window.width,window.height);
      if(window.side==='north'||window.side==='south')g.lineStyle(2,0xd4f4ff,.45).lineBetween(window.x+8,window.y+window.height/2,window.x+window.width-8,window.y+window.height/2);
      else g.lineStyle(2,0xd4f4ff,.45).lineBetween(window.x+window.width/2,window.y+8,window.x+window.width/2,window.y+window.height-8);
    }
  }

  private createBuildingRoofs(){
    for(const roof of this.buildingRoofs.values())roof.destroy();
    this.buildingRoofs.clear();
    const seen=new Set<string>();
    for(const zone of this.mapConfig.buildingVisibilityZones){
      if(seen.has(zone.id))throw new Error(`Duplicate roof for building: ${zone.id}`);
      seen.add(zone.id);
      const building=this.mapConfig.buildings[zone.buildingIndex]!;
      const theme=REGION_THEMES[building.regionId];
      const roof=this.add.graphics().setDepth(RENDER_DEPTH.BUILDING_ROOF);
      roof.fillStyle(theme.roof,.97).fillRect(zone.roof.x,zone.roof.y,zone.roof.w,zone.roof.h);
      roof.lineStyle(3,theme.accent,.34).strokeRect(zone.roof.x,zone.roof.y,zone.roof.w,zone.roof.h);
      if(building.regionId==='hospital'){
        const cx=building.x+building.w/2,cy=building.y+building.h/2;
        roof.fillStyle(0xffffff,.82).fillRect(cx-22,cy-7,44,14).fillRect(cx-7,cy-22,14,44);
      }else if(building.regionId==='military'){
        roof.lineStyle(2,theme.accent,.28).strokeRect(building.x+30,building.y+30,Math.max(1,building.w-60),Math.max(1,building.h-60));
      }
      this.buildingRoofs.set(zone.id,roof);
    }
  }

  private updateActivePortal(viewer:any,point:DisplayPoint,time:number){
    const selected=selectActivePortal(
      {x:point.x,y:point.y,buildingId:String(viewer?.buildingId??'')},
      this.localAimX,this.localAimY,this.activePortalId,this.scopeRequested,this.mapConfig.buildingVisibilityZones,
    );
    if(selected){
      this.activePortalId=selected.openingId;
      this.activePortalBuildingId=selected.buildingId;
      this.activePortalKind=selected.kind;
      this.activePortalSelectedAt=time;
      return;
    }
    if(this.activePortalId&&time-this.activePortalSelectedAt<=PORTAL_SELECTION_BALANCE.passageHoldMs)return;
    this.activePortalId='';this.activePortalBuildingId='';this.activePortalKind='';this.activePortalSelectedAt=0;
  }

  private resolvedViewerSpace(viewer:any){
    if(viewer?.phase!=='landed')return{buildingId:'',roomIndex:0,outdoors:true};
    const x=Number(viewer?.x??0),y=Number(viewer?.y??0);
    const id=String(viewer?.id??''),phase=String(viewer?.phase??''),networkBuildingId=String(viewer?.buildingId??''),networkRoomIndex=Number(viewer?.roomIndex??0),cached=this.resolvedSpaceCache;
    if(cached&&cached.id===id&&cached.x===x&&cached.y===y&&cached.phase===phase&&cached.buildingId===networkBuildingId&&cached.roomIndex===networkRoomIndex)return cached.result;
    let result:{buildingId:string;roomIndex:number;outdoors:boolean};
    const inferred=spaceAt(x,y,this.mapConfig.buildingVisibilityZones,this.mapConfig.rooms,0);if(inferred.buildingId){const roomIndex=inferred.roomIndex||(networkBuildingId===inferred.buildingId?networkRoomIndex:0);result={buildingId:inferred.buildingId,roomIndex,outdoors:false};}else if(Boolean(viewer?.isVaulting)&&networkBuildingId)result={buildingId:networkBuildingId,roomIndex:networkRoomIndex,outdoors:false};else result=inferred;
    this.resolvedSpaceCache={id,x,y,phase,buildingId:networkBuildingId,roomIndex:networkRoomIndex,result};return result;
  }

  private updateBuildingPresentation(viewer:any){
    if(!viewer?.alive||viewer?.phase!=='landed'){this.activeBuildingId='';this.activePortalId='';this.activePortalBuildingId='';this.activePortalKind='';for(const roof of this.buildingRoofs.values())roof.setAlpha(1);this.indoorMaskG.clear();const canvas=this.windowVisionCanvas,context=this.windowVisionContext;if(canvas&&context){context.clearRect(0,0,canvas.width,canvas.height);canvas.classList.add('hidden');}return;}
    const resolved=this.resolvedViewerSpace(viewer);
    const roomIndex=resolved.roomIndex;
    const currentRoom=this.mapConfig.rooms.find((candidate)=>candidate.index===roomIndex);
    const buildingId=currentRoom?.buildingId||resolved.buildingId;
    this.activeBuildingId=buildingId;
    const containingIds=new Set(buildingZonesAt(Number(viewer?.x??0),Number(viewer?.y??0),this.mapConfig.buildingVisibilityZones,0).map((zone)=>zone.id));
    if(buildingId)containingIds.add(buildingId);
    for(const [id,roof] of this.buildingRoofs)roof.setAlpha(containingIds.has(id)?0:1);
    this.indoorMaskG.clear();
    this.updateWindowVisionOverlay({...viewer,buildingId,roomIndex});
  }

  private fillCanvasPolygon(context:CanvasRenderingContext2D,points:Array<{x:number;y:number}>,alpha=1){
    if(points.length<3)return;
    context.globalAlpha=alpha;
    context.beginPath();
    context.moveTo(points[0]!.x,points[0]!.y);
    for(let index=1;index<points.length;index++)context.lineTo(points[index]!.x,points[index]!.y);
    context.closePath();
    context.fill();
  }

  private clippedRoomRect(room:{rect:{x:number;y:number;w:number;h:number}},zone:{interior:{x:number;y:number;w:number;h:number}}){
    const x=Math.max(room.rect.x,zone.interior.x),y=Math.max(room.rect.y,zone.interior.y);
    const right=Math.min(room.rect.x+room.rect.w,zone.interior.x+zone.interior.w);
    const bottom=Math.min(room.rect.y+room.rect.h,zone.interior.y+zone.interior.h);
    if(right<=x||bottom<=y)return zone.interior;
    return{x,y,w:right-x,h:bottom-y};
  }

  private cutRectFromVisionOverlay(context:CanvasRenderingContext2D,rect:{x:number;y:number;w:number;h:number},alpha=1){
    const topLeft=this.worldToScreen(rect.x-3,rect.y-3);
    const bottomRight=this.worldToScreen(rect.x+rect.w+3,rect.y+rect.h+3);
    context.globalAlpha=alpha;
    context.fillRect(topLeft.x,topLeft.y,bottomRight.x-topLeft.x,bottomRight.y-topLeft.y);
  }

  private cutViewerFromVisionOverlay(context:CanvasRenderingContext2D,viewer:{x:number;y:number}){
    const point=this.worldToScreen(viewer.x,viewer.y);
    context.globalAlpha=1;
    context.beginPath();
    context.arc(point.x,point.y,PLAYER_BODY_RADIUS+10,0,Math.PI*2);
    context.fill();
  }

  private updateWindowVisionOverlay(viewer:any){
    const canvas=this.windowVisionCanvas,context=this.windowVisionContext;
    if(!canvas||!context)return;
    this.resizeOverlayCanvases();
    const dpr=Math.max(1,window.devicePixelRatio||1),width=this.scale.width,height=this.scale.height;
    context.setTransform(dpr,0,0,dpr,0,0);
    context.clearRect(0,0,width,height);
    const resolved=this.resolvedViewerSpace(viewer);
    const roomIndex=resolved.roomIndex;
    const room=this.mapConfig.rooms.find((candidate)=>candidate.index===roomIndex);
    const buildingId=room?.buildingId||resolved.buildingId;
    const zone=buildingId?buildingZoneById(buildingId,this.mapConfig.buildingVisibilityZones):undefined;
    if(!buildingId||!zone){canvas.classList.add('hidden');return;}
    canvas.classList.remove('hidden');
    context.globalCompositeOperation='source-over';
    context.globalAlpha=1;
    context.fillStyle='rgba(2,7,11,.80)';
    context.fillRect(0,0,width,height);
    context.globalCompositeOperation='destination-out';
    context.fillStyle='rgba(0,0,0,1)';
    this.cutRectFromVisionOverlay(context,room?this.clippedRoomRect(room,zone):zone.interior,1);
    this.cutViewerFromVisionOverlay(context,{x:Number(viewer?.x??0),y:Number(viewer?.y??0)});

    if(room){
      const adjacentRooms=new Set<number>();
      for(const portal of this.mapConfig.portals){
        if(!portal.allowsVision||portal.buildingId!==buildingId)continue;
        if(portal.sideARoomIndex===roomIndex&&portal.sideBRoomIndex>0)adjacentRooms.add(portal.sideBRoomIndex);
        else if(portal.sideBRoomIndex===roomIndex&&portal.sideARoomIndex>0)adjacentRooms.add(portal.sideARoomIndex);
      }
      for(const adjacentIndex of adjacentRooms){
        const adjacent=this.mapConfig.rooms.find((candidate)=>candidate.index===adjacentIndex&&candidate.buildingId===buildingId);
        if(adjacent)this.cutRectFromVisionOverlay(context,this.clippedRoomRect(adjacent,zone),.24);
      }
    }

    const selected=this.openingById(this.activePortalBuildingId,this.activePortalId);
    const viewerPoint=this.viewerPoint??this.local();
    if(viewerPoint&&selected.zone?.id===zone.id&&selected.opening&&selected.kind){
      const featherView=angleAwarePortalPolygon(selected.opening,selected.kind,viewerPoint,'outside',this.scopeRequested,this.localAimX,this.localAimY,WINDOW_PORTAL_FEATHER);
      const innerView=angleAwarePortalPolygon(selected.opening,selected.kind,viewerPoint,'outside',this.scopeRequested,this.localAimX,this.localAimY,-WINDOW_PORTAL_FEATHER);
      this.fillCanvasPolygon(context,featherView.polygon.map((point)=>this.worldToScreen(point.x,point.y)),.10*featherView.revealStrength);
      this.fillCanvasPolygon(context,innerView.polygon.map((point)=>this.worldToScreen(point.x,point.y)),.62*innerView.revealStrength);
    }
    context.globalAlpha=1;
    context.globalCompositeOperation='source-over';
  }

  private viewerEntity(){return this.viewerPlayer??this.local();}

  private dispatchNotice(message:string,type:'info'|'warning'|'error'='warning',duration?:number){window.dispatchEvent(new CustomEvent('drop8-game-notice',{detail:{message,type,duration}}));}

  private worldEntityVisible(x:number,y:number,targetBuildingId?:string,targetRoomIndex?:number){
    const viewer=this.viewerPoint??this.viewerEntity();
    const viewerEntity=this.viewerEntity();
    if(!viewer||!viewerEntity)return false;
    const viewerResolved=this.resolvedViewerSpace({...viewerEntity,x:viewer.x,y:viewer.y});
    const viewerBuildingId=viewerResolved.buildingId;
    const viewerRoomIndex=viewerResolved.roomIndex;
    const targetSpace=targetRoomIndex===undefined?spaceAt(x,y,this.mapConfig.buildingVisibilityZones,this.mapConfig.rooms,0):{buildingId:targetBuildingId??'',roomIndex:targetRoomIndex,outdoors:!targetBuildingId};
    if(viewerBuildingId!==targetSpace.buildingId){
      const opening=crossSpaceOpening(
        {x:viewer.x,y:viewer.y,buildingId:viewerBuildingId},
        {x,y,buildingId:targetSpace.buildingId},
        this.scopeRequested,this.mapConfig.buildingVisibilityZones,this.activePortalId,{x:this.localAimX,y:this.localAimY},
      );
      if(!opening)return false;
    }
    const trace=traceSpaceVisibility(
      {x:viewer.x,y:viewer.y,roomIndex:viewerRoomIndex},
      {x,y,roomIndex:targetSpace.roomIndex},
      this.mapConfig.portals,this.mapConfig.visibilityObstacles,3,
    );
    return trace.visible&&this.pointInsideScopeView(x,y);
  }

  private spaceVisible(entity:any){return this.worldEntityVisible(Number(entity?.x)||0,Number(entity?.y)||0,String(entity?.buildingId??''),Number(entity?.roomIndex??spaceAt(Number(entity?.x)||0,Number(entity?.y)||0,this.mapConfig.buildingVisibilityZones,this.mapConfig.rooms,0).roomIndex));}

  private drawDecoration(g:Phaser.GameObjects.Graphics,kind:DecorKind,x:number,y:number,w:number,h:number,rotation:number){
    const cx=x+w/2,cy=y+h/2;
    if(kind==='machine'||kind==='tank'){
      g.fillStyle(kind==='tank'?0x69777d:0x303a40,.92).fillRoundedRect(x,y,w,h,8);
      g.lineStyle(3,0xb7c2c7,.35).strokeRoundedRect(x,y,w,h,8);
      for(let i=1;i<4;i++)g.fillStyle(0xf1a64b,.8).fillCircle(x+w*i/4,y+h/2,4);
    }else if(kind==='container'){
      g.fillStyle(0x9a583f,.9).fillRoundedRect(x,y,w,h,5);
      for(let px=x+15;px<x+w;px+=24)g.lineStyle(2,0x4d2b24,.45).lineBetween(px,y+4,px,y+h-4);
    }else if(kind==='yard'){
      g.fillStyle(0x64804d,.55).fillRect(x,y,w,h);g.lineStyle(2,0xe5d0aa,.35).strokeRect(x,y,w,h);
    }else if(kind==='fence'){
      g.lineStyle(5,0xc2b08b,.7).lineBetween(x,y+h/2,x+w,y+h/2);
      for(let px=x;px<=x+w;px+=24)g.lineStyle(3,0xe0cfaa,.65).lineBetween(px,y,px,y+h);
    }else if(kind==='medicalCross'){
      g.fillStyle(0xffffff,.85).fillRoundedRect(x,y,w,h,8);g.fillStyle(0xff4f5e,.95).fillRect(cx-w*.32,cy-h*.1,w*.64,h*.2).fillRect(cx-w*.1,cy-h*.32,w*.2,h*.64);
    }else if(kind==='bed'){
      g.fillStyle(0xddeeed,.9).fillRoundedRect(x,y,w,h,6);g.fillStyle(0x68a7aa,.9).fillRect(x,y+h-7,w,7);g.fillStyle(0xffffff,.85).fillCircle(x+14,cy,9);
    }else if(kind==='ambulance'){
      g.fillStyle(0xe9f3f2,.92).fillRoundedRect(x,y,w,h,10);g.fillStyle(0xff5360,.9).fillRect(x+10,cy-4,w-20,8);g.fillStyle(0x25343a).fillCircle(x+24,y+h,10).fillCircle(x+w-24,y+h,10);
    }else if(kind==='crate'){
      g.fillStyle(0x8b603c,.9).fillRect(x,y,w,h);g.lineStyle(3,0xd0a16b,.5).strokeRect(x,y,w,h).lineBetween(x,y,x+w,y+h).lineBetween(x+w,y,x,y+h);
    }else if(kind==='forklift'){
      g.fillStyle(0xe8a638,.9).fillRoundedRect(x,y,w*.65,h,7);g.lineStyle(5,0x2e3438,1).lineBetween(x+w*.68,y,x+w*.68,y+h).lineBetween(x+w*.68,y+h,x+w,y+h);g.fillStyle(0x263139).fillCircle(x+20,y+h,10).fillCircle(x+w*.55,y+h,10);
    }else if(kind==='sandbag'){
      for(let px=x;px<x+w;px+=26)g.fillStyle(0xb1a074,.88).fillEllipse(px+13,cy,30,h*.78);
    }else if(kind==='helipad'){
      g.lineStyle(5,0xd7d17a,.62).strokeCircle(cx,cy,Math.min(w,h)/2);g.lineStyle(8,0xe9e39a,.7).lineBetween(cx-w*.18,cy-h*.28,cx-w*.18,cy+h*.28).lineBetween(cx+w*.18,cy-h*.28,cx+w*.18,cy+h*.28).lineBetween(cx-w*.18,cy,cx+w*.18,cy);
    }else if(kind==='tent'){
      g.fillStyle(0x87704a,.92).fillTriangle(x, y+h, cx, y, x+w, y+h);g.lineStyle(3,0xd6bf82,.6).lineBetween(cx,y,cx,y+h);
    }else if(kind==='campfire'){
      g.lineStyle(6,0x6e4930,.9).lineBetween(x+8,y+h-8,x+w-8,y+8).lineBetween(x+w-8,y+h-8,x+8,y+8);g.fillStyle(0xff8738,.85).fillTriangle(cx,y,cx-13,y+h-10,cx+13,y+h-10);g.fillStyle(0xffd052,.9).fillTriangle(cx,y+10,cx-7,y+h-10,cx+7,y+h-10);
    }else if(kind==='log'){
      const dx=Math.cos(rotation)*w/2,dy=Math.sin(rotation)*w/2;g.lineStyle(h,0x755033,.9).lineBetween(cx-dx,cy-dy,cx+dx,cy+dy);g.fillStyle(0xb48757).fillCircle(cx-dx,cy-dy,h/2).fillCircle(cx+dx,cy+dy,h/2);
    }else if(kind==='tree'){
      g.fillStyle(0x6f4b31,.95).fillCircle(cx,cy,9);g.fillStyle(0x2b673d,.92).fillCircle(cx-12,cy-8,w*.34).fillCircle(cx+12,cy-7,w*.34).fillCircle(cx,cy-18,w*.36);
    }
  }

  private drawBushBase(g:Phaser.GameObjects.Graphics,x:number,y:number,radius:number,density:number){
    g.fillStyle(0x1f542f,.6*density).fillCircle(x,y,radius*.8);
    for(let i=0;i<7;i++){
      const angle=i/7*Math.PI*2,r=radius*(.34+(i%3)*.1);
      g.fillStyle(i%2?0x377c45:0x2d6b3b,.72*density).fillCircle(x+Math.cos(angle)*r,y+Math.sin(angle)*r,radius*.37);
    }
  }

  private drawFoliage(){
    const g=this.foliageG,view=this.cameras.main.worldView,visible=(x:number,y:number,r:number)=>x+r>=view.x-80&&x-r<=view.right+80&&y+r>=view.y-80&&y-r<=view.bottom+80;g.clear();
    for(const bush of this.mapConfig.bushes){
      if(!visible(bush.x,bush.y,bush.radius))continue;
      this.drawBushBase(g,bush.x,bush.y,bush.radius,bush.density);
      for(let i=0;i<9;i++){
        const angle=(i*.78+bush.x*.001)%(Math.PI*2),r=bush.radius*(.18+(i%4)*.13);
        g.fillStyle(i%3===0?0x4b9655:0x367a44,.32+bush.density*.28).fillCircle(bush.x+Math.cos(angle)*r,bush.y+Math.sin(angle)*r,bush.radius*(.25+(i%2)*.07));
      }
      g.lineStyle(2,0x8fc36e,.12).strokeCircle(bush.x,bush.y,bush.radius*.9);
    }
  }

  private drawDynamic(time:number){
    const s=this.net.snapshot;
    if(!s)return;
    const g=this.dynamicG;
    g.clear();
    this.windowRevealG.clear();
    this.portalRevealKeys.clear();
    this.planeShadowG.clear();
    this.planeG.clear();
    const view=this.cameras.main.worldView;
    const visible=(x:number,y:number,m=120)=>x>=view.x-m&&x<=view.right+m&&y>=view.y-m&&y<=view.bottom+m;
    this.exoLasers=this.exoLasers.filter((laser)=>laser.until>time);for(const laser of this.exoLasers){const life=clamp((laser.until-time)/Math.max(1,laser.until-laser.born),0,1),pulse=.72+.28*Math.sin(time*.08),dx=laser.x2-laser.x1,dy=laser.y2-laser.y1,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;g.lineStyle(28,0x1cbddd,.07*life).lineBetween(laser.x1,laser.y1,laser.x2,laser.y2);g.lineStyle(16,0x35d9ff,.22*life*pulse).lineBetween(laser.x1,laser.y1,laser.x2,laser.y2);g.lineStyle(7,0xbff8ff,.9*life).lineBetween(laser.x1,laser.y1,laser.x2,laser.y2);g.lineStyle(2,0xffffff,life).lineBetween(laser.x1,laser.y1,laser.x2,laser.y2);for(const side of [-1,1])g.lineStyle(2,0x62d9ff,.35*life).lineBetween(laser.x1+nx*side*7,laser.y1+ny*side*7,laser.x2+nx*side*3,laser.y2+ny*side*3);g.fillStyle(0x35d9ff,.18*life).fillCircle(laser.x2,laser.y2,22);g.lineStyle(4,0xeaffff,.8*life).strokeCircle(laser.x2,laser.y2,7+4*(1-life));g.fillStyle(0xffffff,.95*life).fillCircle(laser.x2,laser.y2,4);}
    this.laserCannonBeams=this.laserCannonBeams.filter((beam)=>beam.until>time);for(const beam of this.laserCannonBeams){
      const elapsed=time-beam.born,travel=clamp(elapsed/beam.travelMs,0,1),impactLife=clamp((beam.until-time)/Math.max(1,beam.until-beam.born-beam.travelMs),0,1),life=travel<1?1:impactLife,dx=beam.x2-beam.x1,dy=beam.y2-beam.y1,len=Math.hypot(dx,dy)||1,trailRatio=Math.min(1,LASER_CANNON_BALANCE.pulseLength/len),headX=beam.x1+dx*travel,headY=beam.y1+dy*travel,tailT=Math.max(0,travel-trailRatio),tailX=beam.x1+dx*tailT,tailY=beam.y1+dy*tailT,pulse=.82+.18*Math.sin(time*.05);
      g.lineStyle(8,0xc12cff,.08*life).lineBetween(beam.x1,beam.y1,headX,headY);
      g.lineStyle(LASER_CANNON_BALANCE.pulseGlowWidth,0xa82bff,.13*life*pulse).lineBetween(tailX,tailY,headX,headY);
      g.lineStyle(22,0xf16dff,.42*life).lineBetween(tailX,tailY,headX,headY);
      g.lineStyle(LASER_CANNON_BALANCE.pulseCoreWidth,0xffc8ff,.96*life).lineBetween(tailX,tailY,headX,headY);
      g.lineStyle(4,0xffffff,life).lineBetween(tailX,tailY,headX,headY);
      g.fillStyle(0xa82bff,.18*life).fillCircle(headX,headY,22);g.fillStyle(0xf16dff,.65*life).fillCircle(headX,headY,12);g.fillStyle(0xffffff,life).fillCircle(headX,headY,5);
      for(const impact of beam.impacts){const impactTravel=impact.t*len/Math.max(1,LASER_CANNON_BALANCE.pulseSpeed)*1000,impactAge=elapsed-impactTravel;if(impactAge<0||impactAge>LASER_CANNON_BALANCE.impactSeconds*1000)continue;const ringLife=1-impactAge/(LASER_CANNON_BALANCE.impactSeconds*1000);g.fillStyle(0xf16dff,.28*ringLife).fillCircle(impact.x,impact.y,24-8*ringLife);g.lineStyle(4,0xffdcff,.9*ringLife).strokeCircle(impact.x,impact.y,7+16*(1-ringLife));g.fillStyle(0xffffff,ringLife).fillCircle(impact.x,impact.y,4);}
      if(travel>=1){g.fillStyle(0xf16dff,.22*impactLife).fillCircle(beam.x2,beam.y2,34-10*impactLife);g.lineStyle(5,0xffd9ff,.8*impactLife).strokeCircle(beam.x2,beam.y2,9+18*(1-impactLife));g.fillStyle(0xffffff,.95*impactLife).fillCircle(beam.x2,beam.y2,6);}
    }
    for(const player of s.players){if(!player.alive||!player.laserCannonCharging)continue;const held=Math.max(0,Number(s.serverTime??0)-Number(player.laserCannonChargeStartedAt??0)),charge=clamp(held/LASER_CANNON_BALANCE.chargeSeconds,0,1),angle=player.id===this.net.sessionId?this.localAimAngle:Number(player.angle??0),sx=Number(player.x)+Math.cos(angle)*(PLAYER_HIT_RADIUS+12),sy=Number(player.y)+Math.sin(angle)*(PLAYER_HIT_RADIUS+12),rx=sx+Math.cos(angle)*LASER_CANNON_BALANCE.guideRange,ry=sy+Math.sin(angle)*LASER_CANNON_BALANCE.guideRange;let stop=1;for(const rect of this.mapConfig.bulletObstacles){const hit=segmentRectIntersectionT(sx,sy,rx,ry,rect,2);if(hit!==null&&hit<stop)stop=hit;}const ex=sx+(rx-sx)*stop,ey=sy+(ry-sy)*stop,pulse=.65+.35*Math.sin(time*.02);g.lineStyle(2,0xf16dff,(.3+.5*charge)*pulse).lineBetween(sx,sy,ex,ey);g.lineStyle(1,0xffffff,.2+.5*charge).lineBetween(sx,sy,ex,ey);g.fillStyle(0xf16dff,.18+.25*charge).fillCircle(sx,sy,10+10*charge);g.lineStyle(3,0xffd9ff,.55+.4*charge).strokeCircle(sx,sy,5+7*charge);}
    this.empPulses=this.empPulses.filter((pulse)=>pulse.until>time);for(const pulse of this.empPulses)if(visible(pulse.x,pulse.y,pulse.radius+80))this.drawEmpPulseVisual(g,pulse,time);
    if(s.coreSiege?.enabled)this.drawCoreSiegeDynamic(g,s,time,visible);

    const season=s.werewolfSeason;
    if(season?.enabled){
      if(visible(Number(season.altarX),Number(season.altarY),180)){
        const ax=Number(season.altarX),ay=Number(season.altarY),active=season.altarPhase==='active',recharging=season.altarPhase==='recharging';
        const pulse=.5+.5*Math.sin(time*.004);
        g.fillStyle(0x101013,.9).fillEllipse(ax,ay+8,78,30);
        g.fillStyle(0x383239,.96).fillRoundedRect(ax-30,ay-8,60,20,5);
        g.fillStyle(0x55505a,.94).fillTriangle(ax-22,ay-8,ax,ay-43,ax+22,ay-8);
        if(active||recharging){g.lineStyle(4,active?0xc63246:0x6f2835,.42+.35*pulse).strokeCircle(ax,ay,45+8*pulse);g.fillStyle(active?0xd5354e:0x782c3b,.08+.1*pulse).fillCircle(ax,ay,70+12*pulse);g.lineStyle(5,active?0xdf4058:0x72313d,.28+.25*pulse).lineBetween(ax,ay-38,ax,ay-150);}
      }
      if(season.armoryActive&&!season.armoryOpened&&visible(Number(season.armoryX),Number(season.armoryY),130)){
        const bx=Number(season.armoryX),by=Number(season.armoryY),pulse=.45+.22*Math.sin(time*.005);
        g.fillStyle(0x273039,.95).fillRoundedRect(bx-25,by-16,50,32,5);g.lineStyle(3,0xdce6ec,.65).strokeRoundedRect(bx-25,by-16,50,32,5);g.lineStyle(3,0xbecbd3,.55).lineBetween(bx,by-16,bx,by+16);
        g.lineStyle(3,0xd9e5eb,pulse).strokeCircle(bx,by,38+4*pulse);
      }
      if(season.curseDropActive&&visible(Number(season.curseDropX),Number(season.curseDropY),100)){
        const cx=Number(season.curseDropX),cy=Number(season.curseDropY),pulse=.5+.4*Math.sin(time*.008);
        g.fillStyle(0xa51d3c,.22+.18*pulse).fillCircle(cx,cy,25+8*pulse);g.fillStyle(0xd93a5b,.95).fillCircle(cx,cy,8);g.lineStyle(2,0xff9aae,.8).strokeCircle(cx,cy,14);
      }
    }

    for(const rocket of s.rockets??[]){
      if(!visible(rocket.x,rocket.y,80)||!this.spaceVisible(rocket))continue;
      const angle=Math.atan2(Number(rocket.vy||0),Number(rocket.vx||0));
      const cos=Math.cos(angle),sin=Math.sin(angle),sideX=-sin,sideY=cos;
      if(rocket.weaponId==='exo_missile'){const noseX=rocket.x+cos*9,noseY=rocket.y+sin*9,tailX=rocket.x-cos*7,tailY=rocket.y-sin*7;g.fillStyle(0x35d9ff,.16).fillCircle(rocket.x,rocket.y,15);g.fillStyle(0xff6a32,.55).fillTriangle(tailX+sideX*4,tailY+sideY*4,tailX-sideX*4,tailY-sideY*4,rocket.x-cos*22,rocket.y-sin*22);g.lineStyle(7,0x303a42,1).lineBetween(tailX,tailY,noseX,noseY);g.fillStyle(0x9daab2,1).fillTriangle(noseX+cos*5,noseY+sin*5,noseX+sideX*4,noseY+sideY*4,noseX-sideX*4,noseY-sideY*4);continue;}
      if(rocket.weaponId==='tank_cannon'){
        const noseX=rocket.x+cos*18,noseY=rocket.y+sin*18,tailX=rocket.x-cos*18,tailY=rocket.y-sin*18;
        g.fillStyle(0xffd17a,.22).fillCircle(rocket.x,rocket.y,26);
        g.lineStyle(14,0x232a24,1).lineBetween(tailX,tailY,noseX,noseY);
        g.lineStyle(7,0x7d8c70,1).lineBetween(tailX,tailY,noseX,noseY);
        g.fillStyle(0xe8d7a4,1).fillCircle(noseX,noseY,5);
        g.fillStyle(0xff8d3c,.42).fillTriangle(tailX+sideX*7,tailY+sideY*7,tailX-sideX*7,tailY-sideY*7,rocket.x-cos*34,rocket.y-sin*34);
        continue;
      }
      const noseX=rocket.x+cos*13,noseY=rocket.y+sin*13;
      const tailX=rocket.x-cos*10,tailY=rocket.y-sin*10;
      const flameX=rocket.x-cos*27,flameY=rocket.y-sin*27;
      g.fillStyle(0xff7a2f,.45).fillTriangle(tailX+sideX*5,tailY+sideY*5,tailX-sideX*5,tailY-sideY*5,flameX,flameY);
      g.fillStyle(0xffe083,.95).fillTriangle(tailX+sideX*2.5,tailY+sideY*2.5,tailX-sideX*2.5,tailY-sideY*2.5,rocket.x-cos*22,rocket.y-sin*22);
      g.lineStyle(10,0x4d6651,1).lineBetween(tailX,tailY,rocket.x+cos*7,rocket.y+sin*7);
      g.fillStyle(0xc7d3c4,1).fillTriangle(noseX,noseY,rocket.x+cos*4+sideX*5,rocket.y+sin*4+sideY*5,rocket.x+cos*4-sideX*5,rocket.y+sin*4-sideY*5);
      g.fillStyle(0x29353a,1).fillTriangle(tailX+sideX*3,tailY+sideY*3,tailX-cos*7+sideX*9,tailY-sin*7+sideY*9,tailX-cos*4+sideX*2,tailY-sin*4+sideY*2);
      g.fillStyle(0x29353a,1).fillTriangle(tailX-sideX*3,tailY-sideY*3,tailX-cos*7-sideX*9,tailY-sin*7-sideY*9,tailX-cos*4-sideX*2,tailY-sin*4-sideY*2);
    }


    for(const drop of s.supplyDrops??[]){
      if(!visible(drop.x,drop.y,180))continue;const altitude=Number(drop.altitude||0),shadowScale=1+altitude/900;
      g.fillStyle(0x000000,.22).fillEllipse(drop.x,drop.y,54*shadowScale,22*shadowScale);
      const drawY=drop.y-altitude*.18;
      if(!drop.landed){g.lineStyle(3,0xe9edf0,.8).lineBetween(drop.x-24,drawY-26,drop.x-11,drawY-4).lineBetween(drop.x+24,drawY-26,drop.x+11,drawY-4);g.fillStyle(0xe8ecef,.85).fillEllipse(drop.x,drawY-28,60,26);}
      g.fillStyle(drop.opened?0x704a2d:0xb34a32,.96).fillRoundedRect(drop.x-22,drawY-14,44,28,5);g.lineStyle(3,0xf0d08d,.8).strokeRoundedRect(drop.x-22,drawY-14,44,28,5);g.lineStyle(3,0xf0d08d,.7).lineBetween(drop.x,drawY-14,drop.x,drawY+14);
      if(drop.landed&&!drop.opened){const pulse=.45+.25*Math.sin(time*.006);g.lineStyle(4,0xff5b3d,pulse).lineBetween(drop.x,drop.y-18,drop.x,drop.y-180);g.fillStyle(0xff7048,.15).fillCircle(drop.x,drop.y,48);}
    }
    for(const jet of s.flameJets??[]){
      if(!visible(jet.x,jet.y,Number(jet.range||320)+80)||!this.worldEntityVisible(jet.x,jet.y,String(jet.buildingId??'')))continue;const age=Math.max(0,Number(s.serverTime||0)-Number(jet.startedAt||0)),life=Math.max(.01,Number(jet.expiresAt||0)-Number(jet.startedAt||0)),alpha=clamp(1-age/life,0,1),a=Number(jet.angle||0),range=Number(jet.range||320),half=Number(jet.halfAngle||.28),leftX=jet.x+Math.cos(a-half)*range,leftY=jet.y+Math.sin(a-half)*range,rightX=jet.x+Math.cos(a+half)*range,rightY=jet.y+Math.sin(a+half)*range;
      g.fillStyle(0xff3d1f,.18*alpha).fillTriangle(jet.x,jet.y,leftX,leftY,rightX,rightY);g.fillStyle(0xff8b2d,.30*alpha).fillTriangle(jet.x,jet.y,jet.x+Math.cos(a-half*.62)*range*.78,jet.y+Math.sin(a-half*.62)*range*.78,jet.x+Math.cos(a+half*.62)*range*.78,jet.y+Math.sin(a+half*.62)*range*.78);g.fillStyle(0xffe36a,.72*alpha).fillTriangle(jet.x,jet.y,jet.x+Math.cos(a-half*.28)*range*.52,jet.y+Math.sin(a-half*.28)*range*.52,jet.x+Math.cos(a+half*.28)*range*.52,jet.y+Math.sin(a+half*.28)*range*.52);
      for(let i=0;i<8;i++){const t=(i+1)/9,r=range*t,side=Math.sin(time*.02+i*2.3)*r*Math.tan(half)*.45;g.fillStyle(i%2?0xffd34f:0xff6a24,.55*alpha).fillCircle(jet.x+Math.cos(a)*r-Math.sin(a)*side,jet.y+Math.sin(a)*r+Math.cos(a)*side,4+(i%3)*2);}
    }

    for(const jet of s.adhesiveJets??[]){
      if(!visible(jet.x,jet.y,Number(jet.range||315)+80)||!this.worldEntityVisible(jet.x,jet.y,String(jet.buildingId??'')))continue;
      const age=Math.max(0,Number(s.serverTime||0)-Number(jet.startedAt||0)),life=Math.max(.01,Number(jet.expiresAt||0)-Number(jet.startedAt||0)),alpha=clamp(1-age/life,0,1),a=Number(jet.angle||0),range=Number(jet.range||315),half=Number(jet.halfAngle||0);
      if(String(jet.id??'').startsWith('adhesive-puddle-')||half<=0){
        const pulse=.5+.18*Math.sin(time*.009+Number(jet.x||0)*.01);
        g.fillStyle(0x32c85a,.18*alpha).fillCircle(jet.x,jet.y,range);
        g.fillStyle(0x238c43,.28*alpha).fillEllipse(jet.x,jet.y,range*1.45,range*.78);
        g.lineStyle(3,0x8cff9f,(.34+pulse*.18)*alpha).strokeCircle(jet.x,jet.y,range);
        for(let i=0;i<9;i++){const pa=i/9*Math.PI*2+time*.0012,r=range*(.18+(i%4)*.17);g.fillStyle(i%2?0x72e58b:0x258d45,.42*alpha).fillCircle(jet.x+Math.cos(pa)*r,jet.y+Math.sin(pa)*r*.72,4+(i%3));}
        continue;
      }
      const leftX=jet.x+Math.cos(a-half)*range,leftY=jet.y+Math.sin(a-half)*range,rightX=jet.x+Math.cos(a+half)*range,rightY=jet.y+Math.sin(a+half)*range;
      g.fillStyle(0x43dc68,.16*alpha).fillTriangle(jet.x,jet.y,leftX,leftY,rightX,rightY);
      g.fillStyle(0x229344,.30*alpha).fillTriangle(jet.x,jet.y,jet.x+Math.cos(a-half*.62)*range*.78,jet.y+Math.sin(a-half*.62)*range*.78,jet.x+Math.cos(a+half*.62)*range*.78,jet.y+Math.sin(a+half*.62)*range*.78);
      for(let i=0;i<10;i++){const t=(i+1)/11,r=range*t,side=Math.sin(time*.016+i*2.1)*r*Math.tan(half)*.48;g.fillStyle(i%2?0x8cff9f:0x38bd5c,.65*alpha).fillCircle(jet.x+Math.cos(a)*r-Math.sin(a)*side,jet.y+Math.sin(a)*r+Math.cos(a)*side,3+(i%3)*1.5);}
    }

    for(const trap of s.stripTraps??[]){
      if(!visible(trap.x,trap.y,90)||!this.worldEntityVisible(trap.x,trap.y,String(trap.buildingId??'')))continue;
      const half=Number(trap.length||100)/2,a=Number(trap.angle||0),dx=Math.cos(a)*half,dy=Math.sin(a)*half,owner=String(trap.ownerId??'')===this.net.sessionId;
      const active=Boolean(trap.active),alpha=active ? .72 : .42;
      g.lineStyle(Math.max(5,Number(trap.width||14)),active?0x22272b:0x343a3f,alpha).lineBetween(trap.x-dx,trap.y-dy,trap.x+dx,trap.y+dy);
      g.lineStyle(2,0x70777c,.42).lineBetween(trap.x-dx,trap.y-dy,trap.x+dx,trap.y+dy);
      for(let i=-4;i<=4;i++){const t=i/4,x=trap.x+dx*t,y=trap.y+dy*t,px=-Math.sin(a)*4,py=Math.cos(a)*4;g.lineStyle(1,0xa0a5a8,.34).lineBetween(x-px,y-py,x+px,y+py);}
      if(owner){const pulse=.18+.08*Math.sin(time*.006);g.lineStyle(2,0x93bdc9,pulse).strokeEllipse(trap.x,trap.y,Number(trap.length||100)+12,Number(trap.width||14)+13);}
    }

    const activeBulletIds=new Set<string>();
    for(const b of s.bullets){
      activeBulletIds.add(b.id);
      if(!visible(b.x,b.y,40)||!this.spaceVisible(b))continue;
      const d=this.getDisplayBullet(b.id,b.x,b.y);
      const bulletHero=String(s.players.find((player:any)=>player.id===b.ownerId)?.heroId??'');
      const silver=b.weaponId==='silver_crossbow';
      const stun=b.weaponId==='stun_gun';
      const empMachineGun=b.weaponId==='emp_exo_machine_gun';
      const rail=b.weaponId==='railgun';
      const laser=b.weaponId==='laser_cannon';
      const chicken=b.weaponId==='chicken_blaster';
      const boomerang=b.weaponId==='boomerang';
      if(boomerang){
        const spin=time*.018+Number(String(b.id).replace(/\D/g,''))*.7,r=11;
        g.lineStyle(8,0xffd34f,.20).strokeCircle(d.x,d.y,16);
        g.lineStyle(5,0xffd34f,1).beginPath().moveTo(d.x+Math.cos(spin)*r,d.y+Math.sin(spin)*r).lineTo(d.x,d.y).lineTo(d.x+Math.cos(spin+2.2)*r,d.y+Math.sin(spin+2.2)*r).strokePath();
        g.fillStyle(0xfff2a6,.9).fillCircle(d.x,d.y,3);continue;
      }
      if(bulletHero==='scrapSummoner'){
        const angle=Math.atan2(Number(b.vy),Number(b.vx)),fx=Math.cos(angle),fy=Math.sin(angle),sx=-fy,sy=fx;g.fillStyle(0x77816c,.98).fillRect(d.x-5,d.y-5,10,10);g.lineStyle(2,0xdfff9f,.85).lineBetween(d.x-sx*7,d.y-sy*7,d.x+sx*7,d.y+sy*7);g.lineStyle(3,0xb6e36a,.35).lineBetween(d.x-fx*22,d.y-fy*22,d.x,d.y);continue;
      }
      if(bulletHero==='gravityWarden'){
        const pulse=7+2*Math.sin(time*.03);g.fillStyle(0x9b8cff,.18).fillCircle(d.x,d.y,pulse+8);g.lineStyle(3,0xd9d2ff,.86).strokeCircle(d.x,d.y,pulse);g.fillStyle(0x16152a,.98).fillCircle(d.x,d.y,4);continue;
      }
      if(bulletHero==='smokeTracker'){
        const speed=Math.hypot(Number(b.vx),Number(b.vy))||1,fx=Number(b.vx)/speed,fy=Number(b.vy)/speed;g.lineStyle(5,0x8ac7b4,.28).lineBetween(d.x-fx*24,d.y-fy*24,d.x,d.y);g.fillStyle(0xc6eee2,.95).fillRoundedRect(d.x-5,d.y-2,10,4,2);continue;
      }
      if(bulletHero==='sonicCommander'){
        const speed=Math.hypot(Number(b.vx),Number(b.vy))||1,fx=Number(b.vx)/speed,fy=Number(b.vy)/speed,sx=-fy,sy=fx;for(let band=1;band<=3;band++){const back=band*8;g.lineStyle(5-band,0xffa5d2,.65).lineBetween(d.x-fx*back+sx*band*5,d.y-fy*back+sy*band*5,d.x-fx*back-sx*band*5,d.y-fy*back-sy*band*5);}continue;
      }
      if(stun){
        const sx=d.x-b.vx*.018,sy=d.y-b.vy*.018,ex=d.x,ey=d.y,dx=ex-sx,dy=ey-sy,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,phase=(Number(String(b.id).replace(/\D/g,''))%7)*1.7+time*.055;
        g.lineStyle(6,0x54dfff,.22).lineBetween(sx,sy,ex,ey);
        g.lineStyle(3,0xbdf6ff,.95).beginPath().moveTo(sx,sy);
        for(let i=1;i<=4;i++){const t=i/4,jitter=Math.sin(phase+i*2.4)*5;g.lineTo(sx+dx*t+nx*jitter,sy+dy*t+ny*jitter);}
        g.strokePath();
        g.fillStyle(0xeaffff,.95).fillCircle(d.x,d.y,4.2);
        continue;
      }
      if(chicken){
        const speed=Math.hypot(Number(b.vx||0),Number(b.vy||0))||1,nx=Number(b.vx||0)/speed,ny=Number(b.vy||0)/speed,sx=d.x-nx*22,sy=d.y-ny*22;
        g.lineStyle(9,0xffd84a,.18).lineBetween(sx,sy,d.x,d.y);g.lineStyle(4,0xffffff,.72).lineBetween(sx+nx*7,sy+ny*7,d.x,d.y);
        g.fillStyle(0xfff7cf,.98).fillEllipse(d.x,d.y,13,9);g.lineStyle(2,0xffb62d,.95).strokeEllipse(d.x,d.y,13,9);g.fillStyle(0xffb62d,.9).fillCircle(d.x+nx*3,d.y+ny*3,2.2);
        continue;
      }
      if(rail)g.lineStyle(9,0x39dfff,.18).lineBetween(d.x-b.vx*.026,d.y-b.vy*.026,d.x,d.y);
      if(laser)g.lineStyle(16,0xc12cff,.24).lineBetween(d.x-b.vx*.05,d.y-b.vy*.05,d.x,d.y);
      g.lineStyle(rail?4:laser?7:silver?4:empMachineGun?5:3,rail?0xbff8ff:laser?0xffc9ff:silver?0xdce8ef:empMachineGun?0x56c8ff:0xffef9a,.9).lineBetween(d.x-b.vx*(rail?.026:laser?.05:empMachineGun?.016:.012),d.y-b.vy*(rail?.026:laser?.05:empMachineGun?.016:.012),d.x,d.y);
      g.fillStyle(rail||laser?0xffffff:silver?0xf4fbff:empMachineGun?0xd9f7ff:0xfff6bd).fillCircle(d.x,d.y,rail?4:laser?7:silver?3.5:empMachineGun?3.8:3);
    }
    for(const id of this.displayBullets.keys())if(!activeBulletIds.has(id))this.displayBullets.delete(id);

    if(['PLANE','DROP'].includes(s.phase)){
      g.lineStyle(4,0xffffff,.16).lineBetween(s.planeStartX,s.planeStartY,s.planeEndX,s.planeEndY);
      this.drawTransportPlane(this.planeShadowG,s.planeX,s.planeY,s.planeAngle,1,'shadow');
      this.drawTransportPlane(this.planeG,s.planeX,s.planeY,s.planeAngle,1,'body');
    }

    this.framePositions.clear();
    this.frameVisibility.clear();
    const existingIds=new Set<string>();
    for(const p of s.players){
      existingIds.add(p.id);
      if(!p.alive)continue;
      const local=p.id===this.net.sessionId;
      const pos=local&&this.predictedLocal?{...this.predictedLocal,angle:this.localAimAngle}:this.remotePosition(p,time);
      this.framePositions.set(p.id,pos);
    }
    for(const field of s.fireFields??[]){
      if(!visible(field.x,field.y,field.radius+50)||!this.worldEntityVisible(field.x,field.y,String(field.buildingId??'')))continue;
      const pulse=.82+Math.sin(time*.018+field.x*.01)*.12;g.fillStyle(0xff4d24,.22).fillCircle(field.x,field.y,field.radius);g.lineStyle(3,0xffa23d,.5).strokeCircle(field.x,field.y,field.radius);
      for(let index=0;index<12;index++){const angle=index/12*Math.PI*2+time*.0015,indexRadius=field.radius*(.2+(index%4)*.18);g.fillStyle(index%2?0xffd34f:0xff6a24,.62).fillCircle(field.x+Math.cos(angle)*indexRadius,field.y+Math.sin(angle)*indexRadius,8*pulse);}
    }
    for(const field of s.smokeFields??[]){
      if(!visible(field.x,field.y,field.radius+60)||!this.worldEntityVisible(field.x,field.y,String(field.buildingId??'')))continue;
      const radius=Number(field.radius||0);if(radius<=1)continue;g.fillStyle(0x9aa4aa,.42).fillCircle(field.x,field.y,radius);
      for(let index=0;index<11;index++){const angle=index/11*Math.PI*2+time*.00018,indexRadius=radius*(.18+(index%4)*.18);g.fillStyle(index%2?0xc2c8cc:0x7f8a91,.25).fillCircle(field.x+Math.cos(angle)*indexRadius,field.y+Math.sin(angle)*indexRadius,radius*(.22+(index%3)*.04));}
    }
    for(const object of s.thrownObjects??[]){
      if(!visible(object.x,object.y,60)||!this.worldEntityVisible(object.x,object.y,String(object.buildingId??'')))continue;
      const z=Number(object.z||0),isHunter=object.kind==='hunterDrone',isSpider=object.kind==='spiderMine',isRcCar=object.kind==='rcCar',type=object.kind as ThrowableType;if(!isHunter&&!isSpider&&!isRcCar&&!isThrowableType(type))continue;
      if(isRcCar){
        const x=Number(object.x),y=Number(object.y),a=Number(object.angle||Math.atan2(Number(object.vy||0),Number(object.vx||0))),cos=Math.cos(a),sin=Math.sin(a),sideX=-sin,sideY=cos,pulse=.55+.45*Math.sin(time*.02);
        g.fillStyle(0x000000,.28).fillEllipse(x,y+7,34,13);g.fillStyle(0x29333a,1).fillRoundedRect(x-14,y-9,28,18,5);g.fillStyle(0xff5b45,.92).fillRoundedRect(x-9,y-7,18,12,4);
        for(const side of [-1,1])for(const forward of [-9,9])g.fillStyle(0x10161a,1).fillCircle(x+cos*forward+sideX*side*10,y+sin*forward+sideY*side*10,4);
        g.fillStyle(0xffd34f,.45+.5*pulse).fillCircle(x+cos*9,y+sin*9,4);g.lineStyle(2,0xff5b45,.18+.22*pulse).strokeCircle(x,y,22);continue;
      }
      if(isSpider){
        const owner=String(object.ownerId??'')===this.net.sessionId,chasing=object.phase==='chasing';if(!owner&&!chasing)continue;
        const x=Number(object.x),y=Number(object.y),angle=Number(object.angle||0),pulse=.5+.5*Math.sin(time*(chasing ? .022 : .008));
        const alpha=chasing ? .96 : .30,cos=Math.cos(angle),sin=Math.sin(angle),sideX=-sin,sideY=cos;
        g.fillStyle(0x000000,.20*alpha).fillEllipse(x,y+5,28,11);g.fillStyle(chasing?0x3b2528:0x20272b,alpha).fillEllipse(x,y,22,15);g.fillStyle(chasing?0xff655c:0x7bdcff,(.42+.5*pulse)*alpha).fillCircle(x+cos*7,y+sin*7,4);
        for(const side of [-1,1])for(const forward of [-7,0,7]){const jointX=x+cos*forward+sideX*side*7,jointY=y+sin*forward+sideY*side*7;g.lineStyle(2,chasing?0xffa06b:0x77858c,alpha).lineBetween(jointX,jointY,jointX+sideX*side*8-cos*3,jointY+sideY*side*8-sin*3);}
        if(chasing)g.lineStyle(2,0xff5b55,.25+.35*pulse).strokeCircle(x,y,SPIDER_MINE_BALANCE.triggerRadius+5);else if(owner)g.lineStyle(2,0x7bdcff,.10+.12*pulse).strokeCircle(x,y,SPIDER_MINE_BALANCE.detectionRadius);
        continue;
      }
      const color=isHunter?0x7bdcff:THROWABLE_CONFIGS[type].color;
      if(isHunter){
        const a=Math.atan2(Number(object.vy||0),Number(object.vx||0)),x=Number(object.x),y=Number(object.y-z*.25),pulse=.55+.3*Math.sin(time*.018);
        g.fillStyle(0x000000,.22).fillEllipse(object.x,object.y+5,24,9);
        g.fillStyle(0x26323a,.95).fillEllipse(x,y,20,13);
        g.lineStyle(3,color,.9).lineBetween(x-Math.cos(a)*12,y-Math.sin(a)*12,x+Math.cos(a)*14,y+Math.sin(a)*14);
        g.fillStyle(color,.6*pulse).fillCircle(x+Math.cos(a)*12,y+Math.sin(a)*12,6);
        g.fillStyle(0xe9fbff,.95).fillCircle(x+Math.cos(a)*6-Math.sin(a)*5,y+Math.sin(a)*6+Math.cos(a)*5,2.5);
        g.fillStyle(0xe9fbff,.95).fillCircle(x+Math.cos(a)*6+Math.sin(a)*5,y+Math.sin(a)*6-Math.cos(a)*5,2.5);
        continue;
      }
      g.fillStyle(0x000000,.22).fillEllipse(object.x,object.y+4,18,7);g.fillStyle(color,1).fillCircle(object.x,object.y-z*.25,7);g.lineStyle(2,0xffffff,.5).strokeCircle(object.x,object.y-z*.25,7);
    }

    for(const explosion of s.explosions??[]){
      const inView=visible(explosion.x,explosion.y,Number(explosion.radius||150)+80),canSee=inView&&this.worldEntityVisible(explosion.x,explosion.y);
      if(canSee)this.drawExplosion(g,explosion,s.serverTime);
      if(!this.seenExplosionIds.has(explosion.id)){
        this.seenExplosionIds.add(explosion.id);
        const viewer=this.viewerPoint??this.local();
        if(viewer){const d=distance(viewer.x,viewer.y,explosion.x,explosion.y);this.playWorldAudio(explosion.kind==='fragGrenade'||explosion.kind==='hunterDrone'||explosion.kind==='spiderMine'?'frag_explosion':explosion.kind==='rcCar'||explosion.kind==='bazooka'||explosion.kind==='tank_cannon'?'bazooka_explosion':'motorcycle_explosion',{id:`explosion:${explosion.id}`,x:explosion.x,y:explosion.y,buildingId:buildingIdAt(explosion.x,explosion.y,0,this.mapConfig.buildingVisibilityZones)},1600);if(d<230)audio.applyTemporaryMuffle(320);}
        if(viewer&&distance(viewer.x,viewer.y,explosion.x,explosion.y)<430)this.cameras.main.shake(130,.0045);
      }
    }

    for(const motorcycle of s.motorcycles??[]){
      const point=this.displayMotorcycles.get(motorcycle.id)??motorcycle;
      if(!visible(point.x,point.y,120))continue;
      let motorcycleVisible=false;
      if(motorcycle.driverId){
        const driver=s.players.find((player:any)=>player.id===motorcycle.driverId);
        motorcycleVisible=driver?Boolean(this.getPlayerVisibility(driver).vehicleVisible):false;
      }else motorcycleVisible=this.worldEntityVisible(point.x,point.y,String(motorcycle.buildingId??''));
      if(!motorcycleVisible)continue;
      this.drawMotorcycle(g,motorcycle,point,time,Number(s.serverTime||0));
    }

    this.drawDeathVisuals(time);

    const visibleIds=new Set<string>();
    for(const p of s.players){
      if(!p.alive)continue;
      const local=p.id===this.net.sessionId;
      const pos=this.framePositions.get(p.id)??p;
      const inView=visible(pos.x,pos.y,100);
      if(!inView){this.lastVisibility.set(p.id,false);continue;}
      const visibility=this.getPlayerVisibility(p);
      const previouslyVisible=this.lastVisibility.get(p.id)??visibility.visibleInWorld;
      if(visibility.visibleInWorld&&!previouslyVisible)this.revealStartedAt.set(p.id,time);
      this.lastVisibility.set(p.id,visibility.visibleInWorld);
      if(!visibility.visibleInWorld)continue;
      if(visibility.nameplateVisible)visibleIds.add(p.id);
      const fadeStart=this.revealStartedAt.get(p.id)??time-200;
      const alpha=local?1:clamp((time-fadeStart)/160,0,1)*clamp(visibility.revealStrength,.22,1);
      const shown=local?{...p,angle:this.localAimAngle}:p;
      const vaultLift=shown.isVaulting?Math.sin(clamp(Number(shown.vaultProgress)||0,0,1)*Math.PI)*14:0;
      const viewerBuildingId=String(this.viewerEntity()?.buildingId??'');
      const throughOpening=(visibility.portalKind==='window'||visibility.portalKind==='door')&&!viewerBuildingId&&Boolean(p.buildingId);
      if(throughOpening)this.drawWindowInteriorReveal(String(p.buildingId),visibility.portalOpeningId);
      const drivenVehicle=p.isDriving&&p.vehicleId?s.motorcycles.find((vehicle:any)=>vehicle.id===p.vehicleId):undefined,fusionMounted=drivenVehicle?.vehicleKind==='fusion_robot';
      this.drawEscortDrones(throughOpening?this.windowRevealG:g,shown,pos.x,pos.y-vaultLift,time,alpha);
      if(!fusionMounted)this.drawPlayer(throughOpening?this.windowRevealG:g,shown,pos.x,pos.y-vaultLift,time,alpha);
      this.updatePlayerOverlay(shown,pos.x,pos.y-vaultLift-(fusionMounted?45:0),time,visibility.nameplateVisible,alpha,throughOpening);
    }
    for(const [id,overlay] of this.playerOverlays){
      if(!existingIds.has(id)||!s.players.find(p=>p.id===id)?.alive){overlay.container.destroy(true);this.playerOverlays.delete(id);continue;}
      if(!visibleIds.has(id))overlay.container.setVisible(false);
    }
    for(const id of this.displayPlayers.keys())if(!existingIds.has(id))this.displayPlayers.delete(id);
    for(const id of this.remoteBuffers.keys())if(!existingIds.has(id)){this.remoteBuffers.delete(id);this.lastVisibility.delete(id);this.revealStartedAt.delete(id);}

    if(time-this.lastMiniDraw>=100){
      this.drawMini(s);
      this.lastMiniDraw=time;
    }
  }

  private getPlayerVisibility(player:any):TargetVisibilityResult{
    const cached=this.frameVisibility.get(player.id);if(cached)return cached;
    const viewer=this.viewerPoint??this.local();
    const viewerEntity=this.viewerEntity()??viewer;
    const isViewer=player.id===this.net.sessionId||player.id===this.viewerPlayer?.id;
    if(isViewer){const own={visibleInWorld:true,visibleOnMinimap:true,revealedByShot:false,revealedByHit:false,nameplateVisible:true,vehicleVisible:true,portalKind:'same' as const,portalOpeningId:'',portalViewMode:'front' as const,revealStrength:1};this.frameVisibility.set(player.id,own);return own;}
    const hidden={visibleInWorld:false,visibleOnMinimap:false,revealedByShot:false,revealedByHit:false,nameplateVisible:false,vehicleVisible:false,portalKind:'none' as const,portalOpeningId:'',portalViewMode:'none' as const,revealStrength:0};
    if(!viewer||!viewerEntity){this.frameVisibility.set(player.id,hidden);return hidden;}
    const target=this.framePositions.get(player.id)??player;
    const resolvedViewerSpace=this.resolvedViewerSpace({...viewerEntity,x:viewer.x,y:viewer.y});
    const viewerSpace={x:viewer.x,y:viewer.y,buildingId:resolvedViewerSpace.buildingId,roomIndex:resolvedViewerSpace.roomIndex};
    const targetSpace={x:target.x,y:target.y,buildingId:String(player.buildingId??''),roomIndex:Number(player.roomIndex??0)};
    const smokeFields=this.net.snapshot?.smokeFields??[],serverTime=Number(this.net.snapshot?.serverTime??0);
    if(this.isCoreSiege()&&coreSiegeSmokeTrackerConcealed({...player,x:target.x,y:target.y},viewerEntity,smokeFields,serverTime)){this.frameVisibility.set(player.id,hidden);return hidden;}
    const smokeVisibility=smokeVisibilityBetween(viewerSpace,targetSpace,smokeFields,serverTime);
    if(smokeVisibility==='hidden'){this.frameVisibility.set(player.id,hidden);return hidden;}
    let visibleCount=0,centerVisible=false,portalKind:'same'|'door'|'window'|'none'='none',portalOpeningId='';
    for(const sample of targetVisibilitySamples(viewer.x,viewer.y,target.x,target.y,PLAYER_HIT_RADIUS)){
      let boundaryOpening:ReturnType<typeof crossSpaceOpening>|null=null;
      if(viewerSpace.buildingId!==targetSpace.buildingId){
        boundaryOpening=crossSpaceOpening(
          viewerSpace,
          {...targetSpace,x:sample.x,y:sample.y},
          this.scopeRequested,this.mapConfig.buildingVisibilityZones,this.activePortalId,{x:this.localAimX,y:this.localAimY},
        );
        if(!boundaryOpening)continue;
      }
      const trace=traceSpaceVisibility(viewerSpace,{...targetSpace,x:sample.x,y:sample.y},this.mapConfig.portals,this.mapConfig.visibilityObstacles,3);
      if(!trace.visible||!this.pointInsideScopeView(sample.x,sample.y))continue;
      visibleCount++;
      if(sample.kind==='center')centerVisible=true;
      if(boundaryOpening){
        portalKind=boundaryOpening.kind;
        portalOpeningId=boundaryOpening.openingId;
      }else{
        const lastPortalId=trace.crossedPortalIds.at(-1)??'';
        const portal=this.mapConfig.portals.find((candidate)=>candidate.id===lastPortalId);
        portalKind=portal?.kind??'same';
        portalOpeningId=lastPortalId;
      }
    }
    const nearby=distance(viewer.x,viewer.y,target.x,target.y)<=BUSH_HIDE_DISTANCE;
    const concealed=Boolean(player.inBush&&!player.bushRevealed&&!nearby);
    const characterVisible=visibleCount>0&&!concealed;
    const fullInformation=centerVisible||visibleCount>=2;
    const revealStrength=smokeVisibility==='near'?.38:characterVisible?1:0;
    const nameplateVisible=smokeVisibility!=='near'&&fullInformation&&!concealed;
    const result={visibleInWorld:characterVisible,visibleOnMinimap:characterVisible,revealedByShot:Boolean(player.bushRevealed),revealedByHit:Boolean(player.bushRevealed),nameplateVisible,vehicleVisible:characterVisible,portalKind:characterVisible?portalKind:'none' as const,portalOpeningId:characterVisible?portalOpeningId:'',portalViewMode:characterVisible?'front' as const:'none' as const,revealStrength};
    this.frameVisibility.set(player.id,result);
    return result;
  }

  private openingById(buildingId:string,openingId:string){
    const zone=buildingZoneById(buildingId,this.mapConfig.buildingVisibilityZones);
    if(!zone)return{zone,opening:undefined as WindowOpening|undefined,kind:'' as const};
    const window=zone.windows.find((opening)=>opening.id===openingId);
    if(window)return{zone,opening:window,kind:'window' as const};
    const door=zone.doors.find((opening)=>opening.id===openingId);
    return{zone,opening:door?doorPortalOpening(zone,door):undefined,kind:door?'door' as const:'' as const};
  }

  private drawWindowInteriorReveal(buildingId:string,openingId:string){
    const key=`${buildingId}:${openingId}:${this.scopeRequested?'scope':'normal'}`;
    if(this.portalRevealKeys.has(key))return;
    const {zone,opening,kind}=this.openingById(buildingId,openingId);
    if(!zone||!opening||!kind)return;
    this.portalRevealKeys.add(key);
    const theme=REGION_THEMES[zone.regionId];
    const viewer=this.viewerPoint??this.local();
    if(!viewer)return;
    const clampToInterior=(point:{x:number;y:number})=>({x:clamp(point.x,zone.interior.x,zone.interior.x+zone.interior.w),y:clamp(point.y,zone.interior.y,zone.interior.y+zone.interior.h)});
    const outerView=angleAwarePortalPolygon(opening,kind,viewer,'inside',this.scopeRequested,this.localAimX,this.localAimY,WINDOW_PORTAL_FEATHER);
    const innerView=angleAwarePortalPolygon(opening,kind,viewer,'inside',this.scopeRequested,this.localAimX,this.localAimY,-WINDOW_PORTAL_FEATHER);
    if(outerView.polygon.length<3||innerView.polygon.length<3)return;
    const outer=outerView.polygon.map(clampToInterior);
    const inner=innerView.polygon.map(clampToInterior);
    const vectors=(points:Array<{x:number;y:number}>)=>points.map((point)=>new Phaser.Math.Vector2(point.x,point.y));
    this.windowRevealG.fillStyle(theme.roof,.30*outerView.revealStrength).fillPoints(vectors(outer),true);
    this.windowRevealG.fillStyle(theme.ground,.76*innerView.revealStrength).fillPoints(vectors(inner),true);
    this.windowRevealG.fillStyle(0x07131b,.92).fillRect(opening.x,opening.y,opening.width,opening.height);
    this.windowRevealG.lineStyle(2,0x8ac9d9,.78).strokeRect(opening.x,opening.y,opening.width,opening.height);
  }

  private deathVisibility(visual:DeathVisual){
    if(visual.local)return{visible:true,portalKind:'same' as const,portalOpeningId:'',revealStrength:1};
    const viewer=this.viewerPoint??this.local(),viewerEntity=this.viewerEntity();
    if(!viewer||!viewerEntity)return{visible:false,portalKind:'none' as const,portalOpeningId:'',revealStrength:0};
    const nearby=distance(viewer.x,viewer.y,visual.x,visual.y)<=BUSH_HIDE_DISTANCE;
    if(visual.inBush&&!visual.bushRevealed&&!nearby)return{visible:false,portalKind:'none' as const,portalOpeningId:'',revealStrength:0};
    let portalKind:'same'|'door'|'window'|'none'='none',portalOpeningId='';
    for(const sample of targetVisibilitySamples(viewer.x,viewer.y,visual.x,visual.y,PLAYER_HIT_RADIUS)){
      const opening=crossSpaceOpening({x:viewer.x,y:viewer.y,buildingId:String(viewerEntity.buildingId??'')},{x:sample.x,y:sample.y,buildingId:visual.buildingId},this.scopeRequested,this.mapConfig.buildingVisibilityZones,this.activePortalId,{x:this.localAimX,y:this.localAimY});
      if(!opening)continue;
      if(!segmentClearOfRects(viewer.x,viewer.y,sample.x,sample.y,this.mapConfig.visibilityObstacles))continue;
      if(!this.pointInsideScopeView(sample.x,sample.y))continue;
      portalKind=opening.kind;portalOpeningId=opening.openingId;
      return{visible:opening.revealStrength>.08,portalKind,portalOpeningId,revealStrength:opening.revealStrength};
    }
    return{visible:false,portalKind:'none' as const,portalOpeningId:'',revealStrength:0};
  }

  private drawDeathVisuals(time:number){
    const next:DeathVisual[]=[];
    const viewerBuildingId=String(this.viewerEntity()?.buildingId??'');
    for(const visual of this.deathVisuals){
      const progress=clamp((time-visual.startedAt)/visual.duration,0,1);
      if(progress>=1)continue;
      next.push(visual);
      const visibility=this.deathVisibility(visual);
      if(!visibility.visible)continue;
      const throughOpening=(visibility.portalKind==='window'||visibility.portalKind==='door')&&!viewerBuildingId&&Boolean(visual.buildingId);
      if(throughOpening)this.drawWindowInteriorReveal(visual.buildingId,visibility.portalOpeningId);
      this.drawDeathVisual(throughOpening?this.windowRevealG:this.dynamicG,visual,progress,visibility.revealStrength);
    }
    this.deathVisuals=next;
    if(this.localDeathPoint&&time>=this.localDeathCameraUntil)this.localDeathPoint=null;
  }

  private drawDeathVisual(g:Phaser.GameObjects.Graphics,visual:DeathVisual,progress:number,visibilityAlpha=1){
    const ease=1-(1-progress)*(1-progress);
    const x=visual.x+visual.hitDirectionX*visual.pushDistance*ease;
    const y=visual.y+visual.hitDirectionY*visual.pushDistance*ease;
    const fade=(progress<.55?1:clamp(1-(progress-.55)/.45,0,1))*clamp(visibilityAlpha,.22,1);
    const flash=progress<.10&&Math.floor(progress*100)%2===0;
    const flatten=Phaser.Math.Linear(1,.55,clamp((progress-.12)/.55,0,1));
    const widen=Phaser.Math.Linear(1,1.14,clamp((progress-.12)/.55,0,1));
    const color=visual.local?0x45d7ff:visual.ai?0xff8b5f:0xf06dba;
    g.fillStyle(0x000000,.24*fade).fillEllipse(x,y+17,46*widen,15+7*(1-flatten));
    g.fillStyle(flash?0xffffff:color,fade).fillEllipse(x,y,40*widen,40*flatten);
    g.lineStyle(3,0xffffff,.34*fade).strokeEllipse(x,y,40*widen,40*flatten);
    const fallAngle=visual.angle+(visual.hitDirectionY>=0?1:-1)*progress*.48;
    const armLength=18+progress*7;
    for(const side of [-1,1]){
      const angle=fallAngle+side*(1.15+progress*.35);
      g.lineStyle(5,0xf0b28d,.9*fade).lineBetween(x+Math.cos(angle)*8,y+Math.sin(angle)*8,x+Math.cos(angle)*armLength,y+Math.sin(angle)*armLength);
    }
    if(visual.cause==='motorcycle_explosion'){
      g.fillStyle(0x4d5559,.30*fade).fillCircle(x-8,y-18,6+progress*5).fillCircle(x+5,y-25,8+progress*6);
      g.fillStyle(0xff8b45,.32*fade).fillCircle(x+visual.hitDirectionX*10,y+visual.hitDirectionY*10,5);
    }else if(visual.cause==='sniper'&&progress<.22){
      g.lineStyle(3,0xffe9a6,(1-progress/.22)*.75).lineBetween(x-visual.hitDirectionX*26,y-visual.hitDirectionY*26,x,y);
    }
  }

  private segmentOccluded(x1:number,y1:number,x2:number,y2:number){return !segmentClearOfRects(x1,y1,x2,y2,this.mapConfig.visibilityObstacles);}

  private trackRemotePlayers(s:any){
    const receivedAt=Number(s.receivedAt)||performance.now();
    for(const player of s.players){
      if(player.id===this.net.sessionId)continue;
      const buffer=this.remoteBuffers.get(player.id)??[];
      pushPositionSnapshot(buffer,{x:player.x,y:player.y,angle:player.angle,receivedAt});
      this.remoteBuffers.set(player.id,buffer);
    }
  }

  private trackMotorcycles(s:any){
    const active=new Set<string>();
    for(const motorcycle of s.motorcycles??[]){
      active.add(motorcycle.id);
      const current=this.displayMotorcycles.get(motorcycle.id)??{x:motorcycle.x,y:motorcycle.y,rotation:motorcycle.rotation,speed:motorcycle.speed,velocityX:Number(motorcycle.velocityX||0),velocityY:Number(motorcycle.velocityY||0)};
      const distanceToServer=Math.hypot(current.x-motorcycle.x,current.y-motorcycle.y);
      const alpha=distanceToServer>240?1:.28;
      current.x=Phaser.Math.Linear(current.x,motorcycle.x,alpha);
      current.y=Phaser.Math.Linear(current.y,motorcycle.y,alpha);
      const delta=Math.atan2(Math.sin(motorcycle.rotation-current.rotation),Math.cos(motorcycle.rotation-current.rotation));
      current.rotation+=delta*.32;
      current.velocityX=Phaser.Math.Linear(current.velocityX,Number(motorcycle.velocityX||0),.32);
      current.velocityY=Phaser.Math.Linear(current.velocityY,Number(motorcycle.velocityY||0),.32);
      current.speed=Phaser.Math.Linear(current.speed,Number(motorcycle.speed||0),.3);
      this.displayMotorcycles.set(motorcycle.id,current);
    }
    for(const id of this.displayMotorcycles.keys())if(!active.has(id))this.displayMotorcycles.delete(id);
  }

  private predictLocalMotorcycle(id:string,inputX:number,inputY:number,dt:number,time:number){
    const motorcycle=this.displayMotorcycles.get(id);
    if(!motorcycle)return;
    const vehicleState=this.net.snapshot?.motorcycles.find((item:any)=>item.id===id),isTank=vehicleState?.vehicleKind==='tank',isFusion=vehicleState?.vehicleKind==='fusion_robot',vehicleRadius=isFusion?FUSION_ROBOT_BALANCE.collisionRadius:MOTORCYCLE_RADIUS;
    const frameDt=Math.min(.04,Math.max(0,dt));
    const length=Math.hypot(inputX,inputY);
    const moveX=length>.001?inputX/length:0;
    const moveY=length>.001?inputY/length:0;
    if(length>.001){
      const previousLength=Math.hypot(this.localVehicleInputX,this.localVehicleInputY);
      if(previousLength>.001){
        const previousAngle=Math.atan2(this.localVehicleInputY,this.localVehicleInputX);
        const nextAngle=Math.atan2(moveY,moveX);
        const change=Math.abs(Math.atan2(Math.sin(nextAngle-previousAngle),Math.cos(nextAngle-previousAngle)));
        const retained=motorcycleDirectionRetention(change);
        if(retained<1){
          motorcycle.velocityX*=retained;motorcycle.velocityY*=retained;
          this.localVehicleHeldMs*=retained<=.5?.2:retained<=.72?.48:.76;
          this.localVehicleTurnPenaltyUntil=time+MOTORCYCLE_BALANCE.directionChangePenaltyMs;
        }
      }
      this.localVehicleHeldMs=Math.min(MOTORCYCLE_BALANCE.timeToMaxSpeedMs,this.localVehicleHeldMs+frameDt*1000);
      this.localVehicleInputX=moveX;this.localVehicleInputY=moveY;
    }else{
      this.localVehicleHeldMs=0;this.localVehicleInputX=0;this.localVehicleInputY=0;
    }
    const targetSpeed=(length>.001?Math.max(MOTORCYCLE_LAUNCH_SPEED,PLAYER_SPEED*motorcycleSpeedMultiplier(this.localVehicleHeldMs)):0)*(isTank?TANK_BALANCE.speedMultiplier:isFusion?FUSION_ROBOT_BALANCE.speedMultiplier:1);
    const maxDelta=(length>.001?MOTORCYCLE_DIRECT_ACCELERATION:MOTORCYCLE_DIRECT_DECELERATION)*frameDt*(isTank?TANK_BALANCE.accelerationMultiplier:isFusion?FUSION_ROBOT_BALANCE.accelerationMultiplier:1);
    const approach=(value:number,target:number)=>value<target?Math.min(target,value+maxDelta):Math.max(target,value-maxDelta);
    motorcycle.velocityX=approach(motorcycle.velocityX,moveX*targetSpeed);
    motorcycle.velocityY=approach(motorcycle.velocityY,moveY*targetSpeed);
    const blocked=(x:number,y:number)=>this.mapConfig.collisionObstacles.some((rect)=>circleHitsRect(x,y,vehicleRadius,rect))||this.mapConfig.buildingVisibilityZones.some((zone)=>circleHitsRect(x,y,vehicleRadius+3,zone.roof));
    let xBlocked=false,yBlocked=false;
    const nextX=clamp(motorcycle.x+motorcycle.velocityX*frameDt,vehicleRadius,this.mapConfig.width-vehicleRadius);
    if(!blocked(nextX,motorcycle.y))motorcycle.x=nextX;else{xBlocked=true;motorcycle.velocityX=0;motorcycle.velocityY*=.74;}
    const nextY=clamp(motorcycle.y+motorcycle.velocityY*frameDt,vehicleRadius,this.mapConfig.height-vehicleRadius);
    if(!blocked(motorcycle.x,nextY))motorcycle.y=nextY;else{yBlocked=true;motorcycle.velocityY=0;motorcycle.velocityX*=.74;}
    if(xBlocked||yBlocked){this.localVehicleHeldMs*=xBlocked&&yBlocked?.25:.58;this.localVehicleTurnPenaltyUntil=time+MOTORCYCLE_BALANCE.directionChangePenaltyMs;}
    const speed=Math.hypot(motorcycle.velocityX,motorcycle.velocityY);
    motorcycle.speed=speed;
    if(speed>8){
      const targetRotation=Math.atan2(motorcycle.velocityY,motorcycle.velocityX);
      const rotationDelta=Math.atan2(Math.sin(targetRotation-motorcycle.rotation),Math.cos(targetRotation-motorcycle.rotation));
      motorcycle.rotation+=rotationDelta*(1-Math.exp(-MOTORCYCLE_ROTATION_RESPONSE*frameDt));
    }
  }

  private remotePosition(player:any,_time:number){
    if(player.id===this.net.sessionId)return{x:player.x,y:player.y,angle:player.angle};
    const sampled=samplePosition(this.remoteBuffers.get(player.id)??[],performance.now()-100);
    if(!sampled){this.bufferMisses++;return{x:player.x,y:player.y,angle:player.angle};}
    if(Math.hypot(sampled.x-player.x,sampled.y-player.y)>260)this.snapCorrections++;
    return{x:sampled.x,y:sampled.y,angle:sampled.angle};
  }


  private receiveAiDialogue(payload:AiDialoguePayload){
    const lineId=String(payload?.lineId??'');
    const legacyText=lineId?(AI_DIALOGUE_LINES as Record<string,string>)[lineId]:undefined;
    const text=legacyText??String(payload?.text??'');
    if(!text)return;
    this.receiveChat({playerId:payload.playerId??payload.speakerId,sender:payload.sender,text,channel:'ai',time:payload.time,sentAt:payload.sentAt,durationMs:payload.durationMs});
  }

  private receiveChat(payload:ChatPayload){
    if(!payload?.playerId||!payload.text||payload.channel==='system'||payload.channel==='lobby')return;
    const player=this.net.snapshot?.players.find((item)=>item.id===payload.playerId);
    if(!player)return;
    if(payload.channel==='ai'&&!this.local()?.alive){
      const existing=this.playerOverlays.get(player.id),view=this.cameras.main.worldView;
      if(!existing?.container.visible||!view.contains(player.x,player.y))return;
    }
    const overlay=this.getOrCreatePlayerOverlay(player);
    overlay.bubbleText.setText(String(payload.text).slice(0,80));
    const width=Math.min(196,Math.max(72,overlay.bubbleText.width+22));
    const height=Math.min(58,Math.max(34,overlay.bubbleText.height+16));
    overlay.bubbleBg.clear().fillStyle(0x071018,.94).fillRoundedRect(-width/2,-height/2,width,height,9);
    overlay.bubbleBg.lineStyle(2,player.id===this.net.sessionId?0x54dcff:0xffffff,.42).strokeRoundedRect(-width/2,-height/2,width,height,9);
    const bubbleDuration=payload.durationMs?clamp(Number(payload.durationMs),900,3000):4000;
    overlay.bubbleExpiresAt=this.time.now+bubbleDuration;
  }

  private getOrCreatePlayerOverlay(player:any){
    const existing=this.playerOverlays.get(player.id);
    if(existing)return existing;
    const bubbleBg=this.add.graphics();
    const bubbleText=this.add.text(0,-82,'',{fontFamily:'sans-serif',fontSize:'13px',fontStyle:'bold',color:'#ffffff',align:'center',wordWrap:{width:174,useAdvancedWrap:true}}).setOrigin(.5);
    bubbleBg.setPosition(0,-82);
    const name=this.add.text(0,-50,'',{fontFamily:'sans-serif',fontSize:'13px',fontStyle:'bold',color:'#ffffff',stroke:'#071018',strokeThickness:4}).setOrigin(.5);
    const container=this.add.container(player.x,player.y,[bubbleBg,bubbleText,name]).setDepth(RENDER_DEPTH.PLAYER_OVERLAY);
    bubbleBg.setVisible(false);bubbleText.setVisible(false);
    const overlay={container,name,bubbleBg,bubbleText,bubbleExpiresAt:0,displayName:''};
    this.playerOverlays.set(player.id,overlay);
    return overlay;
  }

  private displayPlayerName(player:any){
    const raw=String(player.name??'').trim()||'이름 없음';
    const aiName=(raw.replace(/^AI\s*(?:-|·|\uCA0C)\s*/,'').slice(0,16)||'이름 없음');
    const base=player.ai?`AI · ${aiName}`:raw.slice(0,16);
    return player.id===this.net.sessionId?`${base} (나)`:base;
  }

  private updatePlayerOverlay(player:any,x:number,y:number,time:number,visible:boolean,alpha=1,aboveRoof=false){
    const overlay=this.getOrCreatePlayerOverlay(player);
    overlay.container.setDepth(aboveRoof?RENDER_DEPTH.BUILDING_ROOF+3:RENDER_DEPTH.PLAYER_OVERLAY).setPosition(x,y).setVisible(visible).setAlpha(alpha);
    const displayName=this.displayPlayerName(player);
    if(overlay.displayName!==displayName){
      overlay.displayName=displayName;
      overlay.name.setText(displayName);
    }
    const remaining=overlay.bubbleExpiresAt-time;
    const showBubble=visible&&remaining>0;
    overlay.bubbleBg.setVisible(showBubble);
    overlay.bubbleText.setVisible(showBubble);
    if(showBubble){
      const bubbleAlpha=remaining<1000?clamp(remaining/1000,0,1):1;
      overlay.bubbleBg.setAlpha(bubbleAlpha);
      overlay.bubbleText.setAlpha(bubbleAlpha);
    }
  }

  private updateRegionLabel(x:number,y:number){
    if(this.net.roomConfig.practiceMode){this.currentRegionId='';this.regionText.setVisible(false);return;}
    const region=regionAt(x,y,this.mapConfig.regions);
    const id=region?.id??'';
    if(id===this.currentRegionId)return;
    this.currentRegionId=id;
    if(!region){this.regionText.setVisible(false);return;}
    const theme=REGION_THEMES[region.id];
    this.regionText.setText(`${region.name} · ${theme.trait}`).setVisible(true);
  }

  private updateTerrainDebug(x:number,y:number,isSwimming:boolean){
    if(!this.terrainDebugEnabled){
      this.terrainDebugText?.setVisible(false);
      return;
    }
    const kind=terrainAt(x,y,{
      buildings:this.mapConfig.buildings,
      rooms:this.mapConfig.rooms,
      rivers:this.mapConfig.rivers,
      shallowWaterZones:this.mapConfig.shallowWaterZones,
      crossings:this.mapConfig.landCrossings,
      shoreExits:this.mapConfig.shoreExits,
    });
    if(!this.terrainDebugText)this.terrainDebugText=this.add.text(12,118,'',{fontFamily:'monospace',fontSize:'13px',color:'#dffcff',backgroundColor:'#061018dd',padding:{x:8,y:6}}).setScrollFactor(0).setDepth(RENDER_DEPTH.HUD+5);
    this.terrainDebugText.setText(`terrain=${kind}\nswimming=${isSwimming?'true':'false'}\nx=${Math.round(x)} y=${Math.round(y)}`).setVisible(true);
  }

  private drawSlowLayers(s:any){
    const g=this.slowG;
    g.clear();
    const view=this.cameras.main.worldView;
    const visible=(x:number,y:number,m=120)=>x>=view.x-m&&x<=view.right+m&&y>=view.y-m&&y<=view.bottom+m;
    const arena=this.net.roomConfig.gameMode!=='battleRoyale';
    if(!arena&&s.zoneActive)g.lineStyle(6,0x4db5ff,.72).strokeCircle(s.zoneX,s.zoneY,s.zoneRadius);
    if(!arena&&(s.zoneActive||s.zoneState==='ANNOUNCING'))g.lineStyle(3,0xffffff,.36).strokeCircle(s.nextZoneX,s.nextZoneY,s.nextZoneRadius);
    if(s.domination?.enabled){
      for(const wall of dominationWallsForMap(this.mapConfig.width,this.mapConfig.height))if(visible(wall.x+wall.w/2,wall.y+wall.h/2,180)){g.fillStyle(0x7fe7ff,.18).fillRect(wall.x,wall.y,wall.w,wall.h);g.lineStyle(2,0xbff4ff,.72).strokeRect(wall.x,wall.y,wall.w,wall.h);}
      for(const site of s.domination.sites??[]){const color=site.owner==='blue'?0x45a8ff:site.owner==='red'?0xff5263:0xd9e5ea;g.fillStyle(color,.1).fillCircle(site.x,site.y,site.radius);g.lineStyle(site.contested?6:4,color,.92).strokeCircle(site.x,site.y,site.radius);const progress=Math.max(0,Math.min(1,Number(site.captureProgress??0)));if(progress>0){g.lineStyle(8,site.capturingTeam==='red'?0xff5263:0x45a8ff,.95);g.beginPath();g.arc(site.x,site.y,site.radius+10,-Math.PI/2,-Math.PI/2+Math.PI*2*progress);g.strokePath();}this.drawDominationLetter(g,String(site.id),site.x,site.y,color,1);}
    }
    if(s.coreSiege?.enabled)this.drawCoreSiegeSlow(g,s,visible);
    for(const drop of s.supplyDrops??[])if(drop.landed&&visible(drop.x,drop.y,100))g.lineStyle(3,drop.opened?0x8c755f:0xff6b4a,.9).strokeRect(drop.x-25,drop.y-17,50,34);
    const viewer=this.viewerEntity();if(viewer?.alive&&viewer?.phase==='landed')for(const l of s.loot){if(visible(l.x,l.y,80)&&this.spaceVisible(l)&&this.pointInsideScopeView(l.x,l.y))this.drawLootIcon(g,l.kind as LootKind,l.x,l.y,1);}
  }

  private drawCoreSiegeSlow(g:Phaser.GameObjects.Graphics,s:any,visible:(x:number,y:number,m?:number)=>boolean){
    const siege=s.coreSiege,laneY=this.mapConfig.height*CORE_SIEGE_CONFIG.laneYRatio,laneHalf=CORE_SIEGE_CONFIG.laneHalfWidth;
    g.fillStyle(0x1a2d28,.42).fillRect(0,laneY-laneHalf,this.mapConfig.width,laneHalf*2);
    g.lineStyle(3,0xc8d8cf,.12).lineBetween(0,laneY-laneHalf, this.mapConfig.width,laneY-laneHalf).lineBetween(0,laneY+laneHalf,this.mapConfig.width,laneY+laneHalf);
    for(const structure of siege.structures??[]){
      const x=Number(structure.x),y=Number(structure.y),radius=Number(structure.radius),teamColor=structure.team==='blue'?0x4aa8ff:0xff5367,accent=structure.team==='blue'?0xa9ddff:0xffb2ba;
      if(!visible(x,y,radius+80))continue;
      if(structure.destroyed){
        g.fillStyle(0x101518,.7).fillCircle(x,y,radius*.72);
        for(let index=0;index<7;index++){const angle=index/7*Math.PI*2+.3,r=radius*(.22+(index%3)*.2);g.fillStyle(0x586067,.62).fillRect(x+Math.cos(angle)*r-7,y+Math.sin(angle)*r-5,14,10);}
        continue;
      }
      g.fillStyle(0x000000,.25).fillEllipse(x,y+radius*.55,radius*2.1,radius*.75);
      if(structure.kind==='core'){
        const pulse=.62+.18*Math.sin(this.time.now*.006);
        g.fillStyle(0x1b252b,.98).fillRoundedRect(x-radius*.82,y-radius*.5,radius*1.64,radius,10);g.lineStyle(6,teamColor,.9).strokeRoundedRect(x-radius*.82,y-radius*.5,radius*1.64,radius,10);
        for(const side of [-1,1]){g.fillStyle(0x303c43,.98).fillRoundedRect(x+side*radius*.72-radius*.18,y-radius*.72,radius*.36,radius*1.44,6);g.lineStyle(3,accent,.65).strokeRoundedRect(x+side*radius*.72-radius*.18,y-radius*.72,radius*.36,radius*1.44,6);}
        g.fillStyle(teamColor,.22+pulse*.12).fillRoundedRect(x-radius*.42,y-radius*.3,radius*.84,radius*.6,6);g.lineStyle(5,accent,.82).strokeRoundedRect(x-radius*.42,y-radius*.3,radius*.84,radius*.6,6);g.fillStyle(teamColor,.92).fillRect(x-radius*.27,y-5,radius*.54,10);
        for(let vent=-2;vent<=2;vent++)g.fillStyle(0x0b1216,.9).fillRect(x+vent*radius*.15-3,y+radius*.38,6,radius*.3);
      }else{
        g.fillStyle(0x263038,.96).fillCircle(x,y,radius);
        g.lineStyle(5,teamColor,.95).strokeCircle(x,y,radius);
        g.fillStyle(teamColor,.88).fillRoundedRect(x-radius*.34,y-radius*.78,radius*.68,radius*1.05,7);
        g.fillStyle(accent,.85).fillCircle(x,y-radius*.35,radius*.18);
        g.lineStyle(8,0x202a31,.95).lineBetween(x,y-radius*.2,x+(structure.team==='blue'?1:-1)*radius*.9,y-radius*.2);
      }
      const maxHp=Math.max(1,Number(structure.maxHp??structure.hp??1)),ratio=clamp(Number(structure.hp)/maxHp,0,1),barWidth=radius*2.1;
      g.fillStyle(0x061018,.88).fillRoundedRect(x-barWidth/2,y-radius-21,barWidth,10,4);
      g.fillStyle(teamColor,.96).fillRoundedRect(x-barWidth/2+2,y-radius-19,(barWidth-4)*ratio,6,3);
      if(!structure.vulnerable){g.fillStyle(0x071018,.38).fillCircle(x,y,radius+5);g.lineStyle(4,0xcbd6dc,.58).strokeCircle(x,y,radius+8);}
    }
    for(const pickup of siege.pickups??[]){
      if(!pickup.active)continue;
      const x=Number(pickup.x),y=Number(pickup.y),radius=Number(pickup.radius),healing=pickup.kind==='healing',color=healing?0x65f29a:0xffd25f,pulse=.62+.22*Math.sin(this.time.now*.01+x*.004);
      if(!visible(x,y,radius+55))continue;
      g.fillStyle(color,.1+.07*pulse).fillCircle(x,y,radius+12+4*pulse);
      g.fillStyle(0x111b20,.96).fillRoundedRect(x-radius,y-radius*.72,radius*2,radius*1.44,8);
      g.lineStyle(4,color,.88).strokeRoundedRect(x-radius,y-radius*.72,radius*2,radius*1.44,8);
      if(healing){
        g.fillStyle(color,.95).fillRect(x-5,y-17,10,34);g.fillRect(x-17,y-5,34,10);
      }else{
        g.fillStyle(color,.95).fillCircle(x,y,11);g.lineStyle(3,0xffffff,.75).strokeCircle(x,y,18);
      }
    }
    for(const device of siege.devices??[]){
      const x=Number(device.x),y=Number(device.y),radius=Number(device.radius),friendly=device.team==='blue',color=friendly?0x5db9ff:0xff6677;
      if(!visible(x,y,radius+55))continue;
      const angle=Number(device.angle??0),fx=Math.cos(angle),fy=Math.sin(angle),sx=-fy,sy=fx,pulse=.65+.25*Math.sin(this.time.now*.012+x*.003);
      if(device.kind==='fireCapsule'){
        for(let index=0;index<9;index++){const a=index/9*Math.PI*2+index*.7,r=radius*(.15+(index%4)*.18),px=x+Math.cos(a)*r,py=y+Math.sin(a)*r*.72;g.fillStyle(index%2?0xff7a32:0xffb348,.13+.1*pulse).fillCircle(px,py,18+(index%3)*5);g.fillStyle(0xffe180,.55).fillTriangle(px-6,py+8,px+7,py+8,px+Math.sin(this.time.now*.01+index)*5,py-13-(index%2)*6);}
      }else if(device.kind==='fireWall'){
        const half=radius*.95;g.lineStyle(34,0x7b271f,.18).lineBetween(x+sx*half,y+sy*half,x-sx*half,y-sy*half);g.lineStyle(8,0xff7b36,.82).lineBetween(x+sx*half,y+sy*half,x-sx*half,y-sy*half);
        for(let index=-4;index<=4;index++){const offset=half*index/4,px=x+sx*offset,py=y+sy*offset,tip=18+10*((index+6)%3)+9*pulse;g.fillStyle(index%2?0xffd05d:0xff7138,.78).fillTriangle(px-fx*10,py-fy*10,px+fx*10,py+fy*10,px+fx*tip,py+fy*tip);}
      }else if(device.kind==='fireStorm'){
        g.fillStyle(0xff4f2d,.09).fillCircle(x,y,radius);g.lineStyle(5,0xffa33f,.38+.2*pulse).strokeCircle(x,y,radius*(.76+.08*pulse));
        for(let arm=0;arm<4;arm++)for(let step=1;step<=5;step++){const a=this.time.now*.004+arm*Math.PI/2+step*.32,r=radius*step/6,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;g.fillStyle(step%2?0xff6a32:0xffd05a,.72).fillTriangle(px-7,py+8,px+7,py+8,px+Math.cos(a)*12,py+Math.sin(a)*12-11);}
      }else if(device.kind==='regenFoam'){
        g.fillStyle(0x67e9b1,.08).fillCircle(x,y,radius);for(let index=0;index<14;index++){const a=index/14*Math.PI*2,r=radius*(.2+(index%4)*.18);g.fillStyle(index%2?0xbaffda:0x63dba5,.12+.08*pulse).fillCircle(x+Math.cos(a)*r,y+Math.sin(a)*r*.72,12+(index%3)*5);g.lineStyle(2,0xcffff0,.35).strokeCircle(x+Math.cos(a)*r,y+Math.sin(a)*r*.72,12+(index%3)*5);}
      }else if(device.kind==='lifeSupport'){
        g.lineStyle(4,0x75f0ae,.45).strokeCircle(x,y,radius*.72);for(let index=0;index<8;index++){const a=index/8*Math.PI*2;g.lineStyle(index%2?3:6,0x75f0ae,.45+.2*pulse).lineBetween(x+Math.cos(a)*32,y+Math.sin(a)*32,x+Math.cos(a)*radius*.72,y+Math.sin(a)*radius*.72);}
        g.fillStyle(0x172c25,.96).fillRoundedRect(x-24,y-35,48,70,8);g.fillStyle(0xcaffde,.95).fillRect(x-5,y-23,10,46);g.fillRect(x-18,y-6,36,12);
      }else if(device.kind==='shieldField'){
        const half=radius/2,plateWidth=radius/5;g.fillStyle(color,.12).fillPoints([new Phaser.Math.Vector2(x+sx*half+fx*12,y+sy*half+fy*12),new Phaser.Math.Vector2(x-sx*half+fx*12,y-sy*half+fy*12),new Phaser.Math.Vector2(x-sx*half-fx*12,y-sy*half-fy*12),new Phaser.Math.Vector2(x+sx*half-fx*12,y+sy*half-fy*12)],true);
        for(let plate=-2;plate<=2;plate++){const side=plate*plateWidth,px=x+sx*side,py=y+sy*side,corners=[new Phaser.Math.Vector2(px+sx*(plateWidth*.45)+fx*11,py+sy*(plateWidth*.45)+fy*11),new Phaser.Math.Vector2(px-sx*(plateWidth*.45)+fx*11,py-sy*(plateWidth*.45)+fy*11),new Phaser.Math.Vector2(px-sx*(plateWidth*.45)-fx*11,py-sy*(plateWidth*.45)-fy*11),new Phaser.Math.Vector2(px+sx*(plateWidth*.45)-fx*11,py+sy*(plateWidth*.45)-fy*11)];g.fillStyle(plate%2?0x294c5e:0x355e6d,.82).fillPoints(corners,true);g.lineStyle(4,plate%2?0x9ee6ff:color,.78+.14*pulse).strokePoints(corners,true);g.fillStyle(0xd9f7ff,.75).fillCircle(px,py,3);}
      }else if(device.kind==='gearling'){
        g.fillStyle(0x303a31,.98).fillRoundedRect(x-17,y-13,34,26,6);for(const side of [-1,1]){g.fillStyle(0x111713,.95).fillCircle(x+sx*side*15,y+sy*side*15,7);g.lineStyle(3,0xb6e36a,.82).strokeCircle(x+sx*side*15,y+sy*side*15,7);}g.lineStyle(5,0xe5ffc0,.88).lineBetween(x,y,x+fx*27,y+fy*27);
      }else if(device.kind==='scrapGiant'){
        g.fillStyle(0x343d35,.98).fillRoundedRect(x-radius*.64,y-radius*.48,radius*1.28,radius*.96,9);g.lineStyle(7,0xb6e36a,.88).strokeRoundedRect(x-radius*.64,y-radius*.48,radius*1.28,radius*.96,9);for(const side of [-1,1])g.fillStyle(0x151a16,.98).fillCircle(x+sx*side*radius*.56,y+sy*side*radius*.56,radius*.23);g.lineStyle(9,0xe5ffc0,.8).lineBetween(x,y,x+fx*radius*.9,y+fy*radius*.9);
      }else if(device.kind==='gravityAnchor'||device.kind==='gravityCollapse'){
        g.fillStyle(0x151427,.24).fillCircle(x,y,radius);g.fillStyle(0x11101d,.98).fillCircle(x,y,24);g.lineStyle(5,0x9b8cff,.9).strokeCircle(x,y,24);for(let chunk=0;chunk<16;chunk++){const a=chunk/16*Math.PI*2+this.time.now*.003*(device.kind==='gravityCollapse'?-1:1),inward=(this.time.now*.0009+chunk*.17)%1,r=radius*(1-inward*.82),size=5+(chunk%4)*2,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;g.fillStyle(chunk%3?0x74688f:0xd9d2ff,.46+.3*inward).fillRect(px-size/2,py-size/2,size,size);g.lineStyle(2,0x9b8cff,.18+.24*inward).lineBetween(px,py,x,y);}if(device.kind==='gravityCollapse')g.fillStyle(0x08070e,.38+.15*pulse).fillEllipse(x,y+8,radius*1.28,radius*.52);
      }else if(device.kind==='seismicStake'){
        for(let ring=1;ring<=3;ring++){const wave=radius*ring/3*(.88+.06*pulse);for(let segment=0;segment<6;segment++){const a=segment/6*Math.PI*2+.14*ring,b=a+.55;g.lineStyle(5-ring,ring%2?0xd6a85b:0xffd888,.34+.1*pulse).beginPath().arc(x,y,wave,a,b).strokePath();}}
        g.fillStyle(0x3b3229,.98).fillRect(x-8,y-34,16,55);g.fillStyle(0xb98b4d,.98).fillRoundedRect(x-24,y-39,48,18,4);g.lineStyle(4,0xffdda0,.76).lineBetween(x-15,y+20,x-38,y+43).lineBetween(x+14,y+20,x+42,y+37);
      }else if(device.kind==='executionStake'){
        for(let link=0;link<12;link++){const a=link/12*Math.PI*2,px=x+Math.cos(a)*radius*.73,py=y+Math.sin(a)*radius*.73;g.lineStyle(4,link%2?0xd65c6a:0xb9c0c4,.62+.12*pulse).strokeEllipse(px,py,18,9);}
        g.fillStyle(0x22181d,.98).fillTriangle(x,y-45,x-13,y+25,x+13,y+25);g.lineStyle(5,0xd65c6a,.9).lineBetween(x,y-35,x,y+27);g.fillStyle(0xf0c7cb,.9).fillCircle(x,y-42,6);
      }
      if(!['lifeSupport','gearling','scrapGiant','gravityAnchor','gravityCollapse','seismicStake','executionStake'].includes(String(device.kind))){g.fillStyle(0x17222a,.96).fillCircle(x,y,22);g.lineStyle(4,device.kind?.startsWith('fire')?0xffa34d:color,.9).strokeCircle(x,y,22);}
      const hp=clamp(Number(device.hp)/Math.max(1,Number(device.maxHp??device.hp)),0,1);
      g.fillStyle(0x061018,.85).fillRect(x-28,y-34,56,6);g.fillStyle(color,.92).fillRect(x-27,y-33,54*hp,4);
    }
  }

  private drawCoreSiegeMapFoundation(g:Phaser.GameObjects.Graphics){
    const width=this.mapConfig.width,height=this.mapConfig.height,{laneY}=coreSiegeLayout(width,height);
    const baseTop=120,baseHeight=height-240;
    g.fillStyle(0x173047,.72).fillRoundedRect(70,baseTop,720,baseHeight,64);
    g.lineStyle(12,0x4da9ee,.36).strokeRoundedRect(70,baseTop,720,baseHeight,64);
    g.fillStyle(0x3d2029,.72).fillRoundedRect(width-790,baseTop,720,baseHeight,64);
    g.lineStyle(12,0xee5b6d,.36).strokeRoundedRect(width-790,baseTop,720,baseHeight,64);
    g.fillStyle(0x273a35,.76).fillRect(0,laneY-305,width,610);
    g.lineStyle(9,0xd6dfd8,.13).lineBetween(0,laneY-305,width,laneY-305).lineBetween(0,laneY+305,width,laneY+305);
    g.lineStyle(5,0xe4d781,.16);
    for(let x=820;x<width-820;x+=230)g.lineBetween(x,laneY,x+110,laneY);
    const trail=(points:Array<{x:number;y:number}>)=>{
      g.lineStyle(118,0x31483a,.56);
      for(let index=0;index<points.length-1;index++)g.lineBetween(points[index]!.x,points[index]!.y,points[index+1]!.x,points[index+1]!.y);
      g.lineStyle(4,0x93a97d,.13);
      for(let index=0;index<points.length-1;index++)g.lineBetween(points[index]!.x,points[index]!.y,points[index+1]!.x,points[index+1]!.y);
    };
    const sideOffset=CORE_SIEGE_CONFIG.sideLaneOffset;
    trail([{x:720,y:laneY-190},{x:1320,y:laneY-sideOffset},{x:width/2,y:laneY-sideOffset},{x:width-1320,y:laneY-sideOffset},{x:width-720,y:laneY-190}]);
    trail([{x:720,y:laneY+190},{x:1320,y:laneY+sideOffset},{x:width/2,y:laneY+sideOffset},{x:width-1320,y:laneY+sideOffset},{x:width-720,y:laneY+190}]);
    g.fillStyle(0xd9cc6b,.1).fillCircle(width/2,laneY,250);
    g.lineStyle(10,0xd9cc6b,.28).strokeCircle(width/2,laneY,194);
    g.lineStyle(7,0xf3e795,.22).strokeRect(width/2-92,laneY-92,184,184);
  }

  private drawCoreSiegeAbilityCast(g:Phaser.GameObjects.Graphics,p:any,progress:number,life:number){
    const heroId=String(p.heroId??'vanguard') as CoreSiegeHeroId,slot=clamp(Number(p.abilitySlot??1),1,3),x=Number(p.x1??p.x),y=Number(p.y1??p.y),tx=Number(p.x2??x),ty=Number(p.y2??y);
    const aim=Math.atan2(ty-y,tx-x),fx=Math.cos(aim),fy=Math.sin(aim),sx=-fy,sy=fx,travel=Math.min(Math.hypot(tx-x,ty-y),520),scale=slot===3?1.25:slot===2?1.05:.9;
    const pt=(forward:number,side=0)=>({x:x+fx*forward+sx*side,y:y+fy*forward+sy*side});
    const line=(forward1:number,side1:number,forward2:number,side2:number,width:number,color:number,alpha=.85)=>{const a=pt(forward1,side1),b=pt(forward2,side2);g.lineStyle(width,color,alpha*life).lineBetween(a.x,a.y,b.x,b.y);};
    const dot=(forward:number,side:number,radius:number,color:number,alpha=.82)=>{const a=pt(forward,side);g.fillStyle(color,alpha*life).fillCircle(a.x,a.y,radius);};
    const wedge=(forward:number,side:number,length:number,width:number,color:number,alpha=.82)=>{const tip=pt(forward+length,side),left=pt(forward,side-width),right=pt(forward,side+width);g.fillStyle(color,alpha*life).fillTriangle(tip.x,tip.y,left.x,left.y,right.x,right.y);};
    const targetRing=(radius:number,color:number,width=4)=>{g.lineStyle(width,color,.82*life).strokeCircle(tx,ty,radius);};
    switch(heroId){
      case 'vanguard':
        if(slot===1)for(let i=0;i<6;i++)wedge(travel*(.12+i*.12)*progress,(i-2.5)*9,18,5,i%2?0xffd36a:0xffffff);
        else if(slot===2)for(let i=-2;i<=2;i++)line(20,i*8,travel*(.55+.35*progress),i*28,3,i===0?0xe7ffff:0x72ddff,.9-Math.abs(i)*.1);
        else{for(let i=0;i<3;i++){const f=18+i*22+progress*38;line(f,-25,f+18,0,5,0xffc34f);line(f+18,0,f,25,5,0xffc34f);}line(18,0,travel,0,8,0xfff1a1,.72);}
        break;
      case 'technician':
        if(slot===1){for(let i=0;i<7;i++){const f=travel*(i+1)/8;dot(f,Math.sin(i*2.4)*18,5+(i%2)*3,0x66e0cb);if(i)line(travel*i/8,Math.sin((i-1)*2.4)*18,f,Math.sin(i*2.4)*18,2,0xb9fff4,.55);}}
        else if(slot===2){for(let i=0;i<4;i++){const size=(28+i*24)*(1-progress*.5);g.lineStyle(3,0x73e7ff,(.9-i*.14)*life).strokeRect(x-size,y-size,size*2,size*2);}for(let i=-2;i<=2;i++)line(-70,i*17,70,i*17,2,0xbfffff,.35);}
        else{for(let i=0;i<4;i++){const a=progress*4+i*Math.PI/2,r=42+progress*72,dx=Math.cos(a)*r,dy=Math.sin(a)*r;g.fillStyle(0x67e6d9,.82*life).fillTriangle(x+dx,y+dy-8,x+dx+8,y+dy,x+dx,y+dy+8);line(0,0,dx*fx+dy*fy,dx*sx+dy*sy,2,0x8affef,.4);}}
        break;
      case 'trapper':
        if(slot===1){targetRing(32+progress*22,0x9eea79,5);for(let i=0;i<6;i++){const a=i/6*Math.PI*2,inner=22+progress*10,outer=54-progress*12;g.lineStyle(5,0x263d2b,.9*life).lineBetween(tx+Math.cos(a)*inner,ty+Math.sin(a)*inner,tx+Math.cos(a)*outer,ty+Math.sin(a)*outer);}}
        else if(slot===2){const center=pt(travel*.55);for(const rail of [-24,24])g.lineStyle(5,0x78d96e,.82*life).lineBetween(center.x+fx*-90+sx*rail,center.y+fy*-90+sy*rail,center.x+fx*90+sx*rail,center.y+fy*90+sy*rail);for(let i=-3;i<=3;i++){const f=i*28;g.lineStyle(3,0xc9ffb7,.72*life).lineBetween(center.x+fx*f+sx*-28,center.y+fy*f+sy*-28,center.x+fx*f+sx*28,center.y+fy*f+sy*28);}}
        else for(let i=-2;i<=2;i++){const f=25+progress*(90+Math.abs(i)*18),side=i*24,car=pt(f,side);g.fillStyle(0x20292c,.95*life).fillRoundedRect(car.x-10,car.y-7,20,14,3);g.fillStyle(0xff6c4a,.9*life).fillCircle(car.x+fx*9,car.y+fy*9,4);}
        break;
      case 'trickster':
        if(slot===1){wedge(24+travel*.72*progress,0,34,14,0xffa13c);dot(18+travel*.72*progress,-6,4,0xfff3a0);}
        else if(slot===2){const center=pt(55+travel*.55*progress),spin=progress*Math.PI*4,a1={x:center.x+Math.cos(spin)*28,y:center.y+Math.sin(spin)*28},a2={x:center.x+Math.cos(spin+2.2)*28,y:center.y+Math.sin(spin+2.2)*28};g.lineStyle(9,0xffd94d,.9*life).lineBetween(center.x,center.y,a1.x,a1.y).lineBetween(center.x,center.y,a2.x,a2.y);}
        else for(let i=-4;i<=4;i++){const side=i*13,forward=35+progress*(130-Math.abs(i)*5);wedge(forward,side,22,6,i%2?0xffd84c:0xff8f3d,.78);}
        break;
      case 'medigel':
        if(slot===1){const size=16+18*progress;g.fillStyle(0xafffd1,.9*life).fillRect(tx-size*.24,ty-size,size*.48,size*2);g.fillRect(tx-size,ty-size*.24,size*2,size*.48);targetRing(size+8,0x6ff0ab,3);}
        else if(slot===2)for(let i=0;i<10;i++){const f=travel*(i+1)/11,side=Math.sin(i*1.9)*24,r=7+(i%3)*4;dot(f,side,r,i%2?0xc5ffe0:0x61dba1,.48+.04*i);}
        else{const wave=48+progress*76;for(let i=0;i<8;i++){const a=i/8*Math.PI*2;g.lineStyle(i%2?3:6,0x79f2ad,.7*life).lineBetween(x+Math.cos(a)*25,y+Math.sin(a)*25,x+Math.cos(a)*wave,y+Math.sin(a)*wave);}g.fillStyle(0xe5fff0,.9*life).fillRect(x-6,y-31,12,62);g.fillRect(x-25,y-6,50,12);}
        break;
      case 'fireEngineer':
        if(slot===1)for(let i=0;i<8;i++){const t=(i+1)/8*progress,f=travel*t,side=Math.sin(t*Math.PI)*-70;dot(f,side,7+(i%3)*3,i%2?0xff6a32:0xffd15b,.68);}
        else if(slot===2){const center=pt(travel*.72),half=100*scale;g.lineStyle(15,0x8e2f24,.35*life).lineBetween(center.x+sx*half,center.y+sy*half,center.x-sx*half,center.y-sy*half);for(let i=-4;i<=4;i++){const side=half*i/4,base={x:center.x+sx*side,y:center.y+sy*side};g.fillStyle(i%2?0xff6b32:0xffd052,.85*life).fillTriangle(base.x-8,base.y+8,base.x+8,base.y+8,base.x+fx*(25+10*progress),base.y+fy*(25+10*progress));}}
        else for(let arm=0;arm<4;arm++)for(let step=1;step<=4;step++){const a=progress*5+arm*Math.PI/2+step*.38,r=step*23*scale;g.fillStyle(step%2?0xff7135:0xffd05b,.8*life).fillTriangle(x+Math.cos(a)*r-7,y+Math.sin(a)*r+8,x+Math.cos(a)*r+7,y+Math.sin(a)*r+8,x+Math.cos(a)*(r+18),y+Math.sin(a)*(r+18));}
        break;
      case 'orbitalSniper':
        if(slot===1){line(20,0,travel,0,2,0xc9f6ff,.9);const gap=22-progress*9;g.lineStyle(4,0x83e6ff,.9*life).lineBetween(tx-gap-16,ty-gap,tx-gap,ty-gap).lineBetween(tx+gap,ty-gap,tx+gap+16,ty-gap).lineBetween(tx-gap-16,ty+gap,tx-gap,ty+gap).lineBetween(tx+gap,ty+gap,tx+gap+16,ty+gap);}
        else if(slot===2){const gap=72-progress*48;g.lineStyle(4,0xa9efff,.85*life).lineBetween(x-gap-30,y,x-gap,y).lineBetween(x+gap,y,x+gap+30,y).lineBetween(x,y-gap-30,x,y-gap).lineBetween(x,y+gap,x,y+gap+30);dot(0,0,5,0xffffff);}
        else{line(10,0,travel,0,3,0xd6f8ff,.92);for(let i=1;i<=4;i++){const f=travel*i/5,size=7+i*2;const c=pt(f);g.lineStyle(3,0x68dfff,.75*life).strokeRect(c.x-size,c.y-size,size*2,size*2);}}
        break;
      case 'wolfWarrior':
        if(slot===1)for(let claw=-1;claw<=1;claw++)line(16,claw*12,travel*(.35+.6*progress),claw*12-18,5,claw===0?0xffe5e8:0xe35d68,.84);
        else if(slot===2)for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r1=34+progress*18,r2=72+progress*55+(i%2)*18;g.lineStyle(4,0xff786e,.72*life).lineBetween(x+Math.cos(a)*r1,y+Math.sin(a)*r1,x+Math.cos(a+.13)*r2,y+Math.sin(a+.13)*r2);}
        else{const ear=45+progress*25;g.fillStyle(0x3a222b,.88*life).fillTriangle(x-34,y-15,x-18,y-ear,x-4,y-20).fillTriangle(x+34,y-15,x+18,y-ear,x+4,y-20);for(let claw=-1;claw<=1;claw++)line(8,claw*14,95+progress*30,claw*20,6,0xff5968,.75);}
        break;
      case 'shieldCaptain':
        if(slot===1){const front=pt(55+progress*30);for(let i=-3;i<=3;i++){const side=i*22,bulge=(3-Math.abs(i))*12;g.lineStyle(i===0?9:6,0xf0c95c,.85*life).lineBetween(front.x+sx*side,front.y+sy*side,front.x+fx*bulge+sx*side,front.y+fy*bulge+sy*side);}}
        else if(slot===2){const nose=pt(70+travel*.55*progress),rear=pt(18);g.fillStyle(0xe0bd54,.26*life).fillTriangle(nose.x,nose.y,rear.x+sx*45,rear.y+sy*45,rear.x-sx*45,rear.y-sy*45);line(12,-34,70+travel*.55*progress,-12,8,0xffe596,.82);line(12,34,70+travel*.55*progress,12,8,0xffe596,.82);}
        else for(let i=0;i<8;i++){const a=i/8*Math.PI*2,r=58+progress*70,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;g.fillStyle(0xf2ca5b,.24*life).fillRoundedRect(px-15,py-20,30,40,5);g.lineStyle(4,0xffe8a1,.7*life).strokeRoundedRect(px-15,py-20,30,40,5);}
        break;
      case 'demolitionist':
        if(slot===1){for(let i=0;i<5;i++)dot(travel*(.18+i*.13)*progress,(i%2?1:-1)*8,6,0xffc74f,.68);targetRing(18+progress*14,0xff6945,5);dot(travel,0,7,0x282d30);}
        else if(slot===2){wedge(28+travel*.7*progress,0,32,12,0xffc74f);for(let i=0;i<5;i++)dot(20+travel*.7*progress-i*16,Math.sin(i*2)*8,7+i*2,i%2?0x8c9295:0xd7d9d8,.35);}
        else{targetRing(48+progress*55,0xffc44f,4);g.lineStyle(3,0xff6d4b,.72*life).lineBetween(tx-85,ty,tx+85,ty).lineBetween(tx,ty-85,tx,ty+85);for(let i=0;i<6;i++){const a=i/6*Math.PI*2+progress,px=tx+Math.cos(a)*72,py=ty+Math.sin(a)*72;g.fillStyle(0xffd25c,.82*life).fillCircle(px,py,8);}}
        break;
      case 'steelPilot':
        if(slot===1)for(const side of [-1,1]){line(18,side*14,travel*(.25+.65*progress),side*14,7,0xff646b,.8);wedge(travel*(.25+.65*progress),side*14,20,7,0xd9e0e3);}
        else if(slot===2)for(const side of [-1,1]){line(0,side*18,travel*.78*progress,side*18,10,0x7d343c,.34);for(let i=0;i<4;i++)dot(travel*.78*progress-i*18,side*18,7-i,side<0?0xff7a50:0x8be8ff,.62);}
        else for(let i=0;i<8;i++){const a=i/8*Math.PI*2,r=95*(1-progress)+22,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;g.fillStyle(i%2?0x9e343d:0x343e44,.85*life).fillRoundedRect(px-13,py-10,26,20,4);g.lineStyle(3,0xff7077,.62*life).lineBetween(px,py,x,y);}
        break;
      case 'empPilot':
        if(slot===1){let last={x,y};for(let i=1;i<=7;i++){const f=travel*i/7,side=(i%2?1:-1)*(12+i*2),next=pt(f,side);g.lineStyle(i%2?4:2,i%2?0x6de5ff:0xe3fbff,.9*life).lineBetween(last.x,last.y,next.x,next.y);last=next;}}
        else if(slot===2){const sides=6,r=40+progress*65;for(let i=0;i<sides;i++){const a=i/sides*Math.PI*2,b=(i+1)/sides*Math.PI*2;g.lineStyle(5,i%2?0x6ce6ff:0xd8fbff,.78*life).lineBetween(x+Math.cos(a)*r,y+Math.sin(a)*r,x+Math.cos(b)*r,y+Math.sin(b)*r);}for(let i=0;i<6;i++){const a=i/6*Math.PI*2;g.lineStyle(2,0x8eeeff,.55*life).lineBetween(x+Math.cos(a)*18,y+Math.sin(a)*18,x+Math.cos(a)*r,y+Math.sin(a)*r);}}
        else{for(let ring=1;ring<=3;ring++){const size=(28+ring*20)*(1+progress*.35);g.lineStyle(5-ring,0x68dfff,(.9-ring*.15)*life).strokeRect(x-size,y-size,size*2,size*2);}for(let i=0;i<4;i++){const a=i*Math.PI/2+progress*2,r=100;dot(Math.cos(a)*r,Math.sin(a)*r,6,0xd9fbff,.75);}}
        break;
      case 'ironCyclone':
        if(slot===1)for(let blade=0;blade<3;blade++){const a=progress*Math.PI*5+blade*Math.PI*2/3,r=48+progress*42;g.lineStyle(12,0xd7dfe0,.86*life).lineBetween(x+Math.cos(a)*20,y+Math.sin(a)*20,x+Math.cos(a)*r,y+Math.sin(a)*r);g.lineStyle(4,0xe7b85d,.78*life).lineBetween(x+Math.cos(a)*r,y+Math.sin(a)*r,x+Math.cos(a+.42)*(r+22),y+Math.sin(a+.42)*(r+22));}
        else if(slot===2){const end=pt(travel*.72*progress);g.fillStyle(0xb3985c,.22*life).fillTriangle(end.x+fx*34,end.y+fy*34,end.x-fx*26+sx*34,end.y-fy*26+sy*34,end.x-fx*26-sx*34,end.y-fy*26-sy*34);for(const side of [-1,1])line(8,side*22,travel*.72*progress,side*12,8,0xd7dfe0,.72);}
        else for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=42+progress*72;g.fillStyle(i%2?0xe7b85d:0x697277,.72*life).fillRect(x+Math.cos(a)*r-5,y+Math.sin(a)*r-5,10,10);}
        break;
      case 'scrapSummoner':
        if(slot===1){for(let i=0;i<6;i++){const a=i/6*Math.PI*2+progress*2,r=38-progress*18;g.fillStyle(i%2?0xb6e36a:0x697261,.8*life).fillRect(x+Math.cos(a)*r-6,y+Math.sin(a)*r-6,12,12);}g.lineStyle(4,0xe5ffc0,.72*life).strokeRoundedRect(x-20,y-14,40,28,5);}
        else if(slot===2){line(8,0,travel*.72,0,2,0xd9ff9b,.72);for(let i=1;i<=4;i++){const c=pt(travel*.72*i/4,(i%2?1:-1)*10);g.fillStyle(0xb6e36a,.78*life).fillTriangle(c.x+fx*13,c.y+fy*13,c.x-fx*8+sx*8,c.y-fy*8+sy*8,c.x-fx*8-sx*8,c.y-fy*8-sy*8);}}
        else{const size=18+progress*34;g.fillStyle(0x343c33,.9*life).fillRoundedRect(x-size,y-size*.72,size*2,size*1.44,7);for(const side of [-1,1])g.fillStyle(0xb6e36a,.82*life).fillCircle(x+side*size*.72,y,size*.22);g.lineStyle(5,0xe5ffc0,.7*life).strokeRoundedRect(x-size,y-size*.72,size*2,size*1.44,7);}
        break;
      case 'gravityWarden':
        if(slot===1){targetRing(34+progress*76,0x9b8cff,5);for(let i=0;i<8;i++){const a=i/8*Math.PI*2,r=82-progress*48;g.fillStyle(0xd9d2ff,.8*life).fillCircle(tx+Math.cos(a)*r,ty+Math.sin(a)*r,5);g.lineStyle(2,0x9b8cff,.5*life).lineBetween(tx+Math.cos(a)*r,ty+Math.sin(a)*r,tx,ty);}}
        else if(slot===2)for(let i=-4;i<=4;i++){const a=aim+i*.13,r=38+progress*(95+Math.abs(i)*8);g.lineStyle(5,0xbeb4ff,.72*life).lineBetween(x+Math.cos(a)*24,y+Math.sin(a)*24,x+Math.cos(a)*r,y+Math.sin(a)*r);}
        else{const r=90*(1-progress)+18;g.fillStyle(0x17162b,.72*life).fillCircle(tx,ty,r);for(let i=0;i<3;i++){const orbit=18+i*14,a=progress*5+i*Math.PI*2/3;g.lineStyle(6-i,0x9b8cff,.8*life).strokeCircle(tx,ty,orbit);g.fillStyle(0xd9d2ff,.8*life).fillCircle(tx+Math.cos(a)*orbit,ty+Math.sin(a)*orbit,4);}}
        break;
      case 'smokeTracker':
        if(slot===1){line(12,0,travel*.82*progress,0,3,0xc6eee2,.78);const hook=pt(travel*.82*progress);g.lineStyle(5,0x8ac7b4,.9*life).beginPath().arc(hook.x,hook.y,15,aim-.5,aim+2.2).strokePath();}
        else if(slot===2){targetRing(35+progress*80,0x8ac7b4,3);for(let i=0;i<10;i++){const a=i/10*Math.PI*2+progress,r=(18+i%4*13)*(1+progress);g.fillStyle(i%2?0x778781:0xbed2cc,.18+.05*i).fillCircle(tx+Math.cos(a)*r,ty+Math.sin(a)*r,12+i%3*5);}}
        else{line(12,0,travel,0,2,0xff6767,.7);g.lineStyle(4,0xff6767,.9*life).strokeCircle(tx,ty,22-progress*7);for(let i=0;i<4;i++){const a=i*Math.PI/2;g.lineStyle(4,0xffb0a8,.72*life).lineBetween(tx+Math.cos(a)*28,ty+Math.sin(a)*28,tx+Math.cos(a)*44,ty+Math.sin(a)*44);}}
        break;
      case 'sonicCommander':
        if(slot===1)for(let band=1;band<=4;band++){const r=(20+band*25)*progress,half=.45+band*.03;g.lineStyle(8-band,band%2?0xff8fc8:0xffd2e9,.82*life).beginPath().arc(x,y,r,aim-half,aim+half).strokePath();}
        else if(slot===2)for(let i=0;i<8;i++){const a=i/8*Math.PI*2,r=38+progress*110;g.fillStyle(i%2?0xff8fc8:0xffd2e9,.74*life).fillRect(x+Math.cos(a)*r-4,y+Math.sin(a)*r-12,8,24);}
        else for(let wave=1;wave<=4;wave++){const center=pt(progress*travel*.72-wave*16);g.lineStyle(9-wave,0xffa5d2,.74*life).strokeEllipse(center.x,center.y,28+wave*26,56+wave*42);}
        break;
      case 'earthHammer':
        if(slot===1){const impact=pt(70+travel*.45),head=pt(42+travel*.18);g.lineStyle(12,0x473b30,.88*life).lineBetween(x,y,head.x,head.y);g.fillStyle(0xc59a55,.9*life).fillRoundedRect(head.x-30,head.y-15,60,30,5);for(let crack=-3;crack<=3;crack++){const side=crack*22,tip=pt(90+progress*(90-Math.abs(crack)*8),side);g.lineStyle(crack===0?7:4,crack%2?0xffd68a:0xd6a85b,.78*life).lineBetween(impact.x+sx*side*.35,impact.y+sy*side*.35,tip.x,tip.y);}}
        else if(slot===2){targetRing(28+progress*26,0xd6a85b,5);g.fillStyle(0x493b2f,.9*life).fillTriangle(tx,ty-38,tx-13,ty+24,tx+13,ty+24);for(let side=-2;side<=2;side++)g.lineStyle(3,0xffd790,.58*life).lineBetween(tx+side*12,ty+20,tx+side*25,ty+50);}
        else{for(let step=1;step<=7;step++){const t=step/7*progress,forward=travel*t,height=Math.sin(t*Math.PI)*70;dot(forward,-height,7+(step%2)*3,step%2?0xd6a85b:0x78634a,.72);}targetRing(34+progress*62,0xffd588,6);}
        break;
      case 'chainExecutioner':
        if(slot===1){for(let link=1;link<=10;link++){const t=link/10*progress,linkPoint=pt(travel*t,(link%2?1:-1)*5);g.lineStyle(3,link%2?0xd65c6a:0xd5dadd,.86*life).strokeEllipse(linkPoint.x,linkPoint.y,16,8);}const hook=pt(travel*progress);g.lineStyle(6,0xe8eef0,.9*life).beginPath().arc(hook.x,hook.y,19,aim-.5,aim+2.35).strokePath();}
        else if(slot===2){for(let spoke=0;spoke<6;spoke++){const a=spoke/6*Math.PI*2,r=35+progress*45;g.lineStyle(5,spoke%2?0xd65c6a:0xabb3b7,.75*life).lineBetween(x+Math.cos(a)*18,y+Math.sin(a)*18,x+Math.cos(a)*r,y+Math.sin(a)*r);}g.fillStyle(0x2b2025,.9*life).fillTriangle(x,y-34,x-13,y+20,x+13,y+20);}
        else{const cage=48+progress*75;for(let link=0;link<12;link++){const a=link/12*Math.PI*2,px=tx+Math.cos(a)*cage,py=ty+Math.sin(a)*cage;g.lineStyle(4,link%2?0xd65c6a:0xd8dee0,.8*life).strokeEllipse(px,py,18,9);g.lineStyle(2,0x8d3946,.55*life).lineBetween(px,py,tx,ty);}g.fillStyle(0xf0c7cb,.86*life).fillCircle(tx,ty,7);}
        break;
      case 'twinBlade':
        if(slot===1){for(const side of [-1,1]){const end=pt(travel*.72*progress,side*(68-50*progress));g.lineStyle(11,side<0?0x66e0c5:0xd9fff5,.2*life).lineBetween(x,y,end.x,end.y);g.lineStyle(4,side<0?0x66e0c5:0xffffff,.92*life).lineBetween(x-sx*side*18,y-sy*side*18,end.x,end.y);}}
        else if(slot===2){const guard=22+progress*18;g.lineStyle(7,0xe9fffa,.86*life).lineBetween(x-guard,y-guard,x+guard,y+guard).lineBetween(x+guard,y-guard,x-guard,y+guard);g.lineStyle(3,0x66e0c5,.68*life).strokeRect(x-guard-8,y-guard-8,(guard+8)*2,(guard+8)*2);}
        else for(let path=0;path<3;path++){const side=(path-1)*72,forward=travel*(.35+path*.24)*progress;line(10,-side*.35,forward,side,12,0x66e0c5,.2);line(10,-side*.35,forward,side,4,path===1?0xffffff:0x8effe5,.9);const end=pt(forward,side);g.fillStyle(0xcafff2,.72*life).fillTriangle(end.x+fx*18,end.y+fy*18,end.x-fx*10+sx*9,end.y-fy*10+sy*9,end.x-fx*10-sx*9,end.y-fy*10-sy*9);}
        break;
    }
  }

  private drawCoreSiegeDynamic(g:Phaser.GameObjects.Graphics,s:any,time:number,visible:(x:number,y:number,m?:number)=>boolean){
    for(const minion of s.coreSiege.minions??[]){
      const x=Number(minion.x),y=Number(minion.y),radius=Number(minion.radius),color=minion.team==='blue'?0x55adff:0xff5b68,accent=minion.team==='blue'?0xc4e9ff:0xffcad0;
      if(!visible(x,y,radius+45))continue;
      g.fillStyle(0x000000,.23).fillEllipse(x,y+radius*.65,radius*2.1,radius*.75);
      if(minion.kind==='siege'){
        g.fillStyle(0x202a31,.96).fillRoundedRect(x-radius,y-radius*.66,radius*2,radius*1.32,6);
        g.lineStyle(4,color,.92).strokeRoundedRect(x-radius,y-radius*.66,radius*2,radius*1.32,6);
        g.lineStyle(7,accent,.88).lineBetween(x,y,x+(minion.team==='blue'?1:-1)*radius*1.25,y);
      }else{
        g.fillStyle(color,.92).fillCircle(x,y,radius);
        g.lineStyle(3,accent,.72).strokeCircle(x,y,radius);
        if(minion.kind==='ranged')g.lineStyle(4,0x162027,.92).lineBetween(x,y,x+(minion.team==='blue'?1:-1)*radius*1.45,y);
      }
      const ratio=clamp(Number(minion.hp)/Math.max(1,Number(minion.maxHp)),0,1);
      g.fillStyle(0x061018,.84).fillRect(x-radius,y-radius-10,radius*2,5);g.fillStyle(color,.96).fillRect(x-radius,y-radius-10,radius*2*ratio,5);
    }
    this.coreSiegeEffects=this.coreSiegeEffects.filter((effect)=>effect.until>time);
    for(const effect of this.coreSiegeEffects){
      const p=effect.payload,life=clamp((effect.until-time)/Math.max(1,effect.until-effect.born),0,1),progress=1-life,x=Number(p.x),y=Number(p.y),radius=Math.max(12,Number(p.radius??80));
      if(effect.kind==='campAttack'){
        g.lineStyle(3,0x91f0ac,.9*life).lineBetween(Number(p.x1),Number(p.y1),Number(p.x2),Number(p.y2));g.fillStyle(0x91f0ac,.75*life).fillCircle(Number(p.x2),Number(p.y2),5+9*progress);
        continue;
      }
      if(effect.kind==='siegeProjectile'){
        const x1=Number(p.x1),y1=Number(p.y1),x2=Number(p.x2),y2=Number(p.y2),shell=p.projectileKind!=='minionBullet',color=p.team==='blue'?0x72c9ff:0xff7680,px=Phaser.Math.Linear(x1,x2,progress),baseY=Phaser.Math.Linear(y1,y2,progress),arc=shell?Math.sin(progress*Math.PI)*(p.projectileKind==='towerShell'?76:48):0,py=baseY-arc,angle=Math.atan2(y2-y1,x2-x1);
        g.fillStyle(0xfff2b0,.9*life).fillCircle(x1+Math.cos(angle)*20,y1+Math.sin(angle)*20,shell?9:6);g.fillStyle(color,.22*life).fillCircle(x1,y1,shell?24:15);
        if(shell){g.fillStyle(0x30383c,.95).fillEllipse(px,py,p.projectileKind==='towerShell'?24:18,p.projectileKind==='towerShell'?14:11);g.lineStyle(4,color,.85).lineBetween(px-Math.cos(angle)*22,py-Math.sin(angle)*22,px-Math.cos(angle)*5,py-Math.sin(angle)*5);}
        else{g.fillStyle(0xffec9b,.95).fillCircle(px,py,5);g.lineStyle(3,color,.42*life).lineBetween(Phaser.Math.Linear(x1,x2,Math.max(0,progress-.16)),Phaser.Math.Linear(y1,y2,Math.max(0,progress-.16)),px,py);}
        continue;
      }
      if(effect.kind==='siegeProjectileHit'){
        const color=p.team==='blue'?0x72c9ff:0xff7680,wave=radius*(.25+.7*progress);g.fillStyle(color,.2*life).fillCircle(x,y,wave);for(let shard=0;shard<8;shard++){const angle=shard/8*Math.PI*2+progress,r=wave*(.5+(shard%2)*.5);g.fillStyle(shard%2?0xffe6a1:color,.8*life).fillRect(x+Math.cos(angle)*r-3,y+Math.sin(angle)*r-3,6,6);}continue;
      }
      if(effect.kind==='minionMelee'){
        const x1=Number(p.x1),y1=Number(p.y1),x2=Number(p.x2),y2=Number(p.y2),angle=Math.atan2(y2-y1,x2-x1),swing=angle-.9+progress*1.8;g.lineStyle(8,p.team==='blue'?0x72c9ff:0xff7680,.85*life).beginPath().arc(x1,y1,34,swing-.55,swing+.55).strokePath();g.fillStyle(0xffe9ad,.8*life).fillCircle(x2,y2,5+8*progress);
        continue;
      }
      if(effect.kind==='heroAbilityCast'){
        this.drawCoreSiegeAbilityCast(g,p,progress,life);continue;
      }
      if(effect.kind==='carpetBombing'){
        const x1=Number(p.x1),y1=Number(p.y1),x2=Number(p.x2),y2=Number(p.y2),angle=Number(p.angle??Math.atan2(y2-y1,x2-x1)),elapsed=(time-effect.born)/1000,warning=Number(p.warning??1.05),planeDuration=Number(p.planeDuration??.65),width=Number(p.width??300),bombCount=Number(p.bombCount??7),bombInterval=Number(p.bombInterval??.16),fx=Math.cos(angle),fy=Math.sin(angle),sx=-fy,sy=fx;
        if(elapsed<warning){const warningPulse=.45+.3*Math.sin(time*.025);g.fillStyle(0xff5b47,.08+.05*warningPulse).fillPoints([new Phaser.Math.Vector2(x1+sx*width/2,y1+sy*width/2),new Phaser.Math.Vector2(x2+sx*width/2,y2+sy*width/2),new Phaser.Math.Vector2(x2-sx*width/2,y2-sy*width/2),new Phaser.Math.Vector2(x1-sx*width/2,y1-sy*width/2)],true);g.lineStyle(5,0xffb04e,.62+warningPulse*.25).lineBetween(x1+sx*width/2,y1+sy*width/2,x2+sx*width/2,y2+sy*width/2).lineBetween(x1-sx*width/2,y1-sy*width/2,x2-sx*width/2,y2-sy*width/2);for(let marker=0;marker<7;marker++){const t=marker/6,cx=Phaser.Math.Linear(x1,x2,t),cy=Phaser.Math.Linear(y1,y2,t);g.lineStyle(3,0xffd27b,.72).strokeCircle(cx,cy,radius*.72);}}
        if(elapsed>=warning&&elapsed<=warning+planeDuration){const planeProgress=clamp((elapsed-warning)/planeDuration,0,1),planeX=Phaser.Math.Linear(x1-fx*260,x2+fx*260,planeProgress),planeY=Phaser.Math.Linear(y1-fy*260,y2+fy*260,planeProgress);this.drawTransportPlane(g,planeX+16,planeY+20,angle,.62,'shadow');this.drawTransportPlane(g,planeX,planeY,angle,.62,'body');}
        for(let index=0;index<bombCount;index++){const dropAt=warning+index*bombInterval,fall=clamp((elapsed-dropAt)/.28,0,1);if(elapsed<dropAt||fall>=1)continue;const t=index/Math.max(1,bombCount-1),bx=Phaser.Math.Linear(x1,x2,t),by=Phaser.Math.Linear(y1,y2,t),height=(1-fall)*95;g.fillStyle(0x000000,.24).fillEllipse(bx,by,26+fall*18,12+fall*8);g.fillStyle(0x343a3e,.95).fillEllipse(bx,by-height,18,28);g.fillStyle(0xffcb66,.72).fillTriangle(bx-7,by-height-10,bx+7,by-height-10,bx,by-height-28);}
        continue;
      }
      if(effect.kind==='grenadeTelegraph'){
        if(!visible(x,y,radius+40))continue;
        if(p.variant==='sticky'){
          g.fillStyle(0x4b161d,.12+.08*progress).fillCircle(x,y,radius);for(let index=0;index<4;index++){const angle=progress*Math.PI*2+index*Math.PI/2,px=x+Math.cos(angle)*radius*.72,py=y+Math.sin(angle)*radius*.72;g.fillStyle(0xffca54,.84).fillRoundedRect(px-7,py-7,14,14,3);g.lineStyle(3,0xff684f,.72).lineBetween(px,py,x,y);}g.lineStyle(5,0xffb345,.7).strokeRect(x-13-progress*5,y-13-progress*5,26+progress*10,26+progress*10);
        }else{
          g.fillStyle(0xff5448,.08+.09*progress).fillCircle(x,y,radius);g.lineStyle(5,0xff725f,.55+.35*Math.sin(time*.035)).strokeCircle(x,y,radius);for(let index=0;index<8;index++){const angle=index/8*Math.PI*2;g.lineStyle(3,0xffb46f,.62).lineBetween(x+Math.cos(angle)*radius*.55,y+Math.sin(angle)*radius*.55,x+Math.cos(angle)*radius,y+Math.sin(angle)*radius);}
        }
        g.lineStyle(2,0xffffff,.76).strokeCircle(x,y,9+5*Math.sin(time*.025));
        continue;
      }
      if(effect.kind==='grenadeExplosion'){
        const wave=radius*(.25+.85*progress);
        if(p.variant==='sticky'){
          g.fillStyle(0xff502f,.22*life).fillCircle(x,y,wave*.7);for(let index=0;index<8;index++){const angle=index/8*Math.PI*2+.3,r=wave*(.5+(index%2)*.34),px=x+Math.cos(angle)*r,py=y+Math.sin(angle)*r;g.fillStyle(index%2?0xffce55:0xff6848,.78*life).fillRect(px-7,py-7,14,14);g.lineStyle(4,0xffae52,.55*life).lineBetween(x,y,px,py);}
        }else{
          g.fillStyle(0xff7a32,.3*life).fillCircle(x,y,wave*.82);g.lineStyle(9,0xffe29a,.92*life).strokeCircle(x,y,wave);g.lineStyle(4,0xff5b3e,.72*life).strokeCircle(x,y,wave*.68);for(let index=0;index<9;index++){const angle=index/9*Math.PI*2+progress*1.4,r=wave*(.35+(index%3)*.2);g.fillStyle(index%2?0xffd45f:0xff6540,.72*life).fillTriangle(x+Math.cos(angle)*r,y+Math.sin(angle)*r-10,x+Math.cos(angle)*r-8,y+Math.sin(angle)*r+7,x+Math.cos(angle)*r+8,y+Math.sin(angle)*r+7);}
        }
        continue;
      }
      if(effect.kind==='adhesiveArea'){
        if(!visible(x,y,radius+35))continue;
        g.fillStyle(0x2ecb5a,.15*life).fillCircle(x,y,radius);g.lineStyle(4,0x8cff9f,.5*life).strokeCircle(x,y,radius);
        for(let index=0;index<12;index++){const angle=index/12*Math.PI*2+time*.0008,r=radius*(.18+(index%4)*.18);g.fillStyle(index%2?0x76e88d:0x248f47,.35*life).fillCircle(x+Math.cos(angle)*r,y+Math.sin(angle)*r*.7,7+(index%3)*2);}
        continue;
      }
      if(effect.kind==='empPulse'){
        const wave=radius*(.12+.88*progress);
        if(p.empStyle==='grenade'){
          for(let index=0;index<6;index++){const a=index/6*Math.PI*2,b=(index+1)/6*Math.PI*2;g.lineStyle(6,index%2?0x7de9ff:0xe6fcff,.76*life).lineBetween(x+Math.cos(a)*wave,y+Math.sin(a)*wave,x+Math.cos(b)*wave,y+Math.sin(b)*wave);}for(let index=0;index<6;index++){const a=index/6*Math.PI*2;g.lineStyle(3,0x5bcfff,.6*life).lineBetween(x+Math.cos(a)*wave*.35,y+Math.sin(a)*wave*.35,x+Math.cos(a)*wave,y+Math.sin(a)*wave);}
        }else{
          g.fillStyle(0x45c8ff,.08*life).fillCircle(x,y,wave);for(let index=0;index<4;index++){const size=wave*(.45+index*.16);g.lineStyle(5-index,0x77e2ff,(.82-index*.13)*life).strokeRect(x-size,y-size,size*2,size*2);}for(let bar=-2;bar<=2;bar++)g.lineStyle(2,0xffffff,.36*life).lineBetween(x-wave,y+bar*14,x+wave,y+bar*14);
        }
        continue;
      }
      if(effect.kind==='lifeSupportDeploy'){
        const ring=radius*(.38+.62*progress);g.fillStyle(0x52e692,.08*life).fillCircle(x,y,ring);g.lineStyle(6,0xb9ffcf,.78*life).strokeCircle(x,y,ring);
        for(let part=0;part<10;part++){const a=part/10*Math.PI*2+progress*.8,start=radius*(1-progress*.72),px=x+Math.cos(a)*start,py=y+Math.sin(a)*start,w=part%2?12:18,h=part%2?8:12;g.fillStyle(part%2?0x64d99a:0xdfffea,.86*life).fillRoundedRect(px-w/2,py-h/2,w,h,3);g.lineStyle(2,0xeffff5,.5*life).lineBetween(px,py,x,y);}
        const mast=18+progress*34;g.fillStyle(0x173c31,.92*life).fillRoundedRect(x-12,y-mast,24,mast*1.55,5);g.fillStyle(0xdfffea,.94*life).fillRect(x-4,y-mast+7,8,28);g.fillRect(x-14,y-mast+17,28,8);continue;
      }
      if(effect.kind==='droneFormation'){
        const count=clamp(Number(p.count??4),1,4),angle=Number(p.angle??0),fx=Math.cos(angle),fy=Math.sin(angle),sx=-fy,sy=fx;
        for(let index=0;index<count;index++){const row=Math.floor(index/2),side=index%2===0?-1:1,forward=40+row*34+progress*115,lateral=side*(34+row*12),px=x+fx*forward+sx*lateral,py=y+fy*forward+sy*lateral;g.fillStyle(0x173c3c,.92*life).fillTriangle(px+fx*15,py+fy*15,px-fx*10+sx*10,py-fy*10+sy*10,px-fx*10-sx*10,py-fy*10-sy*10);g.lineStyle(3,0x8affef,.86*life).strokeCircle(px,py,9);g.lineStyle(2,0x8affef,.35*life).lineBetween(x,y,px,py);}continue;
      }
      if(effect.kind==='medigelSpray'||effect.kind==='medigelHeal'||effect.kind==='medigelHit'){
        const x1=Number(p.x1),y1=Number(p.y1),x2=Number(p.x2),y2=Number(p.y2),dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1,nx=dx/len,ny=dy/len,sx=-ny,sy=nx,heal=effect.kind==='medigelHeal',color=heal?0x83ffc0:effect.kind==='medigelHit'?0x9be85d:0x69e5aa;
        g.lineStyle(heal?13:10,color,.16*life).lineBetween(x1,y1,x2,y2);g.lineStyle(heal?5:4,heal?0xe2fff0:0xd9ffae,.84*life).lineBetween(x1,y1,x2,y2);
        for(let drop=0;drop<8;drop++){const t=(drop/8+progress*.8)%1,side=Math.sin(drop*2.7+time*.03)*(heal?8:12)*(1-t),px=x1+dx*t+sx*side,py=y1+dy*t+sy*side;g.fillStyle(drop%2?color:0xedffe5,.72*life).fillCircle(px,py,3+(drop%3));}
        if(effect.kind!=='medigelSpray'){const impact=18+progress*16;g.fillStyle(color,.18*life).fillCircle(x2,y2,impact);for(let splash=0;splash<6;splash++){const a=splash/6*Math.PI*2+progress,r=impact*(.55+(splash%2)*.45);g.fillStyle(color,.72*life).fillCircle(x2+Math.cos(a)*r,y2+Math.sin(a)*r,3+(splash%2)*2);}}
        continue;
      }
      if(effect.kind==='healingPickup'||effect.kind==='emergencyGel'){
        const wave=radius*(.45+.65*progress);
        g.fillStyle(0x62f19a,.14*life).fillCircle(x,y,wave);g.lineStyle(6,0xa6ffc5,.86*life).strokeCircle(x,y,wave);
        g.fillStyle(0xd9ffe5,.9*life).fillRect(x-4,y-18,8,36);g.fillRect(x-18,y-4,36,8);continue;
      }
      if(effect.kind==='supplyPickup'){
        const wave=radius*(.35+.7*progress);g.lineStyle(6,0xffd25f,.82*life).strokeCircle(x,y,wave);g.fillStyle(0xffd25f,.12*life).fillCircle(x,y,wave*.75);continue;
      }
      if(effect.kind==='orbitalFocus'){
        const gap=radius*(1-progress*.62);g.lineStyle(5,0x8ceaff,.8*life).lineBetween(x-gap-28,y,x-gap,y).lineBetween(x+gap,y,x+gap+28,y).lineBetween(x,y-gap-28,x,y-gap).lineBetween(x,y+gap,x,y+gap+28);g.fillStyle(0xd9faff,.8*life).fillCircle(x,y,4+progress*5);continue;
      }
      if(effect.kind==='hunterHowl'){
        const wave=radius*(.28+.72*progress);for(let index=0;index<12;index++){const angle=index/12*Math.PI*2,inner=wave*(index%2?.52:.7);g.lineStyle(index%2?4:7,index%2?0xffb076:0xff665d,.72*life).lineBetween(x+Math.cos(angle)*inner,y+Math.sin(angle)*inner,x+Math.cos(angle)*wave,y+Math.sin(angle)*wave);}continue;
      }
      if(effect.kind==='earthHammerSwing'||effect.kind==='hammerSlam'||effect.kind==='hammerLanding'){
        const angle=Number(p.angle??0),wave=radius*(.35+.65*progress),fx=Math.cos(angle),fy=Math.sin(angle),sx=-fy,sy=fx;
        if(effect.kind==='earthHammerSwing'){const combo=Number(p.combo??1),swing=angle-1+progress*2;g.lineStyle(combo===3?15:10,combo===3?0xffd486:0xc59a55,.86*life).beginPath().arc(x,y,wave*.68,swing-.72,swing+.72).strokePath();g.fillStyle(0x483a2e,.9*life).fillRoundedRect(x+Math.cos(swing)*wave*.66-18,y+Math.sin(swing)*wave*.66-12,36,24,4);}
        else if(effect.kind==='hammerSlam'){g.fillStyle(0xd6a85b,.12*life).fillTriangle(x+fx*wave,y+fy*wave,x+sx*wave*.7,y+sy*wave*.7,x-sx*wave*.7,y-sy*wave*.7);for(let crack=-4;crack<=4;crack++){const side=crack*wave*.09,endX=x+fx*wave*(.62+Math.abs(crack%2)*.22)+sx*side,endY=y+fy*wave*(.62+Math.abs(crack%2)*.22)+sy*side;g.lineStyle(crack===0?7:4,crack%2?0xffd88d:0xb7894d,.76*life).lineBetween(x+fx*20+sx*side*.2,y+fy*20+sy*side*.2,endX,endY);}}
        else{g.fillStyle(0x7a5d38,.14*life).fillCircle(x,y,wave);for(let crack=0;crack<10;crack++){const a=crack/10*Math.PI*2+.12,r=wave*(.65+(crack%2)*.28);g.lineStyle(crack%2?4:7,crack%2?0xffd58a:0xb78a4f,.82*life).lineBetween(x+Math.cos(a)*18,y+Math.sin(a)*18,x+Math.cos(a)*r,y+Math.sin(a)*r);}}
        continue;
      }
      if(effect.kind==='chainScytheSwing'||effect.kind==='chainHook'||effect.kind==='chainLatch'||effect.kind==='chainPull'||effect.kind==='chainPullEnd'||effect.kind==='chainAnchor'||effect.kind==='chainStake'||effect.kind==='executionZone'||effect.kind==='executionStrike'||effect.kind==='chainBreak'){
        if(effect.kind==='chainScytheSwing'){const angle=Number(p.angle??0),combo=Number(p.combo??1),arc=angle-.9+progress*1.8;g.lineStyle(combo===3?12:7,combo===3?0xf4c3c8:0xd65c6a,.84*life).beginPath().arc(x,y,radius*(.6+.25*progress),arc-.7,arc+.7).strokePath();for(let link=0;link<4;link++){const a=arc-.45+link*.3,r=radius*(.48+link*.08);g.lineStyle(3,0xbcc4c8,.7*life).strokeEllipse(x+Math.cos(a)*r,y+Math.sin(a)*r,15,8);}}
        else if(effect.kind==='chainHook'){const x1=Number(p.x1),y1=Number(p.y1),x2=Number(p.x2),y2=Number(p.y2),dx=x2-x1,dy=y2-y1,outbound=p.hit?progress:progress<.55?progress/.55:(1-progress)/.45,headT=clamp(outbound,0,1);for(let link=0;link<=10;link++){const t=Math.min(headT,link/10),px=x1+dx*t,py=y1+dy*t;g.lineStyle(4,link%2?0xd65c6a:0xd9dfe2,.9*life).strokeEllipse(px,py,16,8);}const hx=x1+dx*headT,hy=y1+dy*headT;g.lineStyle(8,0xe8edef,.92*life).beginPath().arc(hx,hy,19,Math.atan2(dy,dx)-.5,Math.atan2(dy,dx)+2.4).strokePath();}
        else if(effect.kind==='chainLatch'){const wave=radius*(.3+.7*progress);g.fillStyle(0xf4c3c8,.2*life).fillCircle(x,y,wave);for(let spike=0;spike<8;spike++){const a=spike/8*Math.PI*2;g.lineStyle(5,spike%2?0xd65c6a:0xffffff,.8*life).lineBetween(x+Math.cos(a)*10,y+Math.sin(a)*10,x+Math.cos(a)*wave,y+Math.sin(a)*wave);}}
        else if(effect.kind==='chainPull'){const owner=(s.players??[]).find((item:any)=>String(item.id)===String(p.ownerId)),target=p.targetKind==='minion'?(s.coreSiege.minions??[]).find((item:any)=>String(item.id)===String(p.targetId)):(s.players??[]).find((item:any)=>String(item.id)===String(p.targetId)),x1=Number(owner?.x??p.x1),y1=Number(owner?.y??p.y1),x2=Number(target?.x??p.x2),y2=Number(target?.y??p.y2),dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1;for(let link=1;link<12;link++){const t=link/12,px=x1+dx*t,py=y1+dy*t;g.lineStyle(4,link%2?0xd65c6a:0xe0e4e6,.9*life).strokeEllipse(px,py,16,8);}for(let trail=0;trail<4;trail++)g.fillStyle(0xd65c6a,.28*life).fillCircle(x2-dx/len*trail*14,y2-dy/len*trail*14,8-trail);}
        else if(effect.kind==='chainPullEnd'){const wave=radius*(.35+.65*progress);g.lineStyle(7,0xf4c3c8,.84*life).strokeCircle(x,y,wave);g.lineStyle(3,0xd65c6a,.65*life).strokeCircle(x,y,wave*.65);}
        else if(effect.kind==='chainAnchor'){for(let spoke=0;spoke<8;spoke++){const a=spoke/8*Math.PI*2,r=radius*(.45+.35*progress);g.lineStyle(4,spoke%2?0xd65c6a:0xb9c0c4,.72*life).lineBetween(x+Math.cos(a)*18,y+Math.sin(a)*18,x+Math.cos(a)*r,y+Math.sin(a)*r);}}
        else if(effect.kind==='chainStake'){g.fillStyle(0x24171c,.96*life).fillTriangle(x,y-58,x-18,y+28,x+18,y+28);g.lineStyle(8,0xd65c6a,.9*life).lineBetween(x,y-48,x,y+34);for(let shard=0;shard<7;shard++){const a=shard/7*Math.PI*2,r=radius*(.35+.5*progress);g.fillStyle(shard%2?0xe7d6d8:0x9b3948,.78*life).fillTriangle(x+Math.cos(a)*r,y+Math.sin(a)*r,x+Math.cos(a+.2)*(r+18),y+Math.sin(a+.2)*(r+18),x+Math.cos(a-.2)*(r+18),y+Math.sin(a-.2)*(r+18));}}
        else if(effect.kind==='executionZone'){const owner=(s.players??[]).find((item:any)=>String(item.id)===String(p.ownerId)),target=(s.players??[]).find((item:any)=>String(item.id)===String(p.targetId)),x1=Number(owner?.x??p.x1??x),y1=Number(owner?.y??p.y1??y),x2=Number(target?.x??p.x2??x),y2=Number(target?.y??p.y2??y),dx=x2-x1,dy=y2-y1,zoneRadius=radius*(.72+.08*Math.sin(time*.018));g.fillStyle(0x541821,.1*life).fillCircle(x2,y2,zoneRadius);for(let link=0;link<16;link++){const a=link/16*Math.PI*2-time*.0014,px=x2+Math.cos(a)*zoneRadius,py=y2+Math.sin(a)*zoneRadius;g.lineStyle(4,link%2?0xd65c6a:0xd5dadd,.78*life).strokeEllipse(px,py,18,9);}for(let link=1;link<10;link++){const t=link/10,px=x1+dx*t,py=y1+dy*t;g.lineStyle(4,link%2?0xd65c6a:0xd5dadd,.82*life).strokeEllipse(px,py,16,8);}const warning=Math.max(0,(progress-.62)/.38);if(warning>0){g.lineStyle(7,0xffd3d7,.32+.5*warning).strokeCircle(x2,y2,zoneRadius*(1-warning*.22));g.fillStyle(0xd65c6a,.12+.12*warning).fillCircle(x2,y2,zoneRadius*.7);}}
        else if(effect.kind==='executionStrike'){g.fillStyle(0xd65c6a,.16*life).fillCircle(x,y,radius*.7);for(let slash=-1;slash<=1;slash++)g.lineStyle(12,slash?0xd65c6a:0xffffff,.82*life).lineBetween(x-radius*.45,y+slash*16,x+radius*.45,y-slash*16);}
        else{const wave=radius*(1-progress*.55);for(let link=0;link<12;link++){const a=link/12*Math.PI*2,px=x+Math.cos(a)*wave,py=y+Math.sin(a)*wave;g.lineStyle(4,link%2?0xd65c6a:0xc9d0d3,.74*life).strokeEllipse(px,py,18,9);}}
        continue;
      }
      if(effect.kind==='twinBladeSlash'||effect.kind==='bladeParry'||effect.kind==='bladeCounter'||effect.kind==='bladeCrossGuide'||effect.kind==='bladeDanceGuide'){
        if(effect.kind==='twinBladeSlash'||effect.kind==='bladeCounter'){const angle=Number(p.angle??0),reach=radius*(.5+.45*progress),width=effect.kind==='bladeCounter'?11:7;for(const side of [-1,1]){const a=angle+side*(.62-.8*progress);g.lineStyle(width,side<0?0x66e0c5:0xe5fff8,.9*life).lineBetween(x-Math.cos(a)*20,y-Math.sin(a)*20,x+Math.cos(a)*reach,y+Math.sin(a)*reach);}}
        else if(effect.kind==='bladeParry'){const guard=radius*(.3+.25*progress);g.lineStyle(8,0xe8fff9,.88*life).lineBetween(x-guard,y-guard,x+guard,y+guard).lineBetween(x+guard,y-guard,x-guard,y+guard);g.lineStyle(3,0x66e0c5,.68*life).strokeRect(x-guard-8,y-guard-8,(guard+8)*2,(guard+8)*2);}
        else{const x1=Number(p.x1),y1=Number(p.y1),x2=Number(p.x2),y2=Number(p.y2),angle=Number(p.angle??Math.atan2(y2-y1,x2-x1)),fx=Math.cos(angle),fy=Math.sin(angle),sx=-fy,sy=fx,paths=effect.kind==='bladeDanceGuide'?3:2;for(let path=0;path<paths;path++){const side=(path-(paths-1)/2)*radius*.9,endX=x2+sx*side+fx*path*30,endY=y2+sy*side+fy*path*30;g.lineStyle(10,0x66e0c5,.16*life).lineBetween(x1,y1,endX,endY);g.lineStyle(3,path%2?0xffffff:0x86ffe2,.84*life).lineBetween(x1,y1,endX,endY);}}
        continue;
      }
      if(effect.kind==='dashBlocked'){
        for(let bar=-2;bar<=2;bar++)g.lineStyle(5,0xffd487,.72*life).lineBetween(x-radius*.45,y+bar*11,x+radius*.45,y+bar*11);continue;
      }
      if(effect.kind==='ironSpin'||effect.kind==='ironSpinTick'||effect.kind==='ironRampage'){
        const wave=radius*(effect.kind==='ironSpinTick' ? .72 : .35+.65*progress),blades=effect.kind==='ironRampage'?8:4;for(let index=0;index<blades;index++){const angle=progress*Math.PI*6+index/blades*Math.PI*2,r1=wave*.35,r2=wave;g.lineStyle(index%2?6:10,index%2?0xe7b85d:0xd7dfe0,.75*life).lineBetween(x+Math.cos(angle)*r1,y+Math.sin(angle)*r1,x+Math.cos(angle+.25)*r2,y+Math.sin(angle+.25)*r2);}if(effect.kind==='ironRampage'){for(let plate=0;plate<6;plate++){const a=plate/6*Math.PI*2-progress*.7,r=34+Math.sin(time*.014+plate)*4,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;g.fillStyle(plate%2?0x343b3f:0xb3985c,.84*life).fillRoundedRect(px-10,py-7,20,14,3);g.lineStyle(3,0xffe5a4,.55*life).lineBetween(px,py,x+Math.cos(a)*wave,y+Math.sin(a)*wave);}g.lineStyle(5,0xffd36a,.48*life).strokeCircle(x,y,45+8*Math.sin(time*.018));}continue;
      }
      if(effect.kind==='ironSlash'){
        const angle=Number(p.angle??0),combo=Number(p.combo??1),arcRadius=radius*(.55+.35*progress);g.lineStyle(combo===3?13:8,combo===3?0xe7b85d:0xd7dfe0,.86*life).beginPath().arc(x,y,arcRadius,angle-.75,angle+.75).strokePath();if(combo===3)g.lineStyle(4,0xffefba,.7*life).beginPath().arc(x,y,arcRadius+15,angle-.95,angle+.95).strokePath();continue;
      }
      if(effect.kind==='summonCommand'){
        const wave=radius*(.25+.75*progress);g.lineStyle(4,0xb6e36a,.75*life).strokeCircle(x,y,wave);for(let index=0;index<6;index++){const angle=index/6*Math.PI*2;g.fillStyle(0xe5ffc0,.8*life).fillTriangle(x+Math.cos(angle)*wave,y+Math.sin(angle)*wave,x+Math.cos(angle+.18)*(wave-16),y+Math.sin(angle+.18)*(wave-16),x+Math.cos(angle-.18)*(wave-16),y+Math.sin(angle-.18)*(wave-16));}continue;
      }
      if(effect.kind==='summonAssemble'){
        const giant=p.deviceKind==='scrapGiant',parts=giant?12:6,spread=radius*(giant?3.2:2.4)*(1-progress);g.fillStyle(0xb6e36a,.08*life).fillCircle(x,y,radius*(.6+progress*.7));for(let index=0;index<parts;index++){const angle=index/parts*Math.PI*2+progress*2.4,px=x+Math.cos(angle)*spread,py=y+Math.sin(angle)*spread;g.fillStyle(index%3===0?0xe5ffc0:index%2?0x66715f:0x303a31,.88*life).fillRect(px-(giant?8:5),py-(giant?6:4),giant?16:10,giant?12:8);g.lineStyle(2,0xb6e36a,.6*life).lineBetween(px,py,x,y);}if(giant&&progress>.72){const impact=(progress-.72)/.28;g.lineStyle(9,0xe5ffc0,.62*(1-impact)).strokeCircle(x,y,radius*(.8+impact*2.1));for(let ray=0;ray<8;ray++){const a=ray/8*Math.PI*2;g.lineStyle(5,0xb6e36a,.55*(1-impact)).lineBetween(x+Math.cos(a)*radius*.5,y+Math.sin(a)*radius*.5,x+Math.cos(a)*radius*(1.2+impact),y+Math.sin(a)*radius*(1.2+impact));}}continue;
      }
      if(effect.kind==='summonAttack'){
        const x1=Number(p.x1),y1=Number(p.y1),x2=Number(p.x2),y2=Number(p.y2);g.lineStyle(p.deviceKind==='scrapGiant'?9:4,0xb6e36a,.72*life).lineBetween(x1,y1,x2,y2);for(let index=1;index<=3;index++){const px=Phaser.Math.Linear(x1,x2,index/4),py=Phaser.Math.Linear(y1,y2,index/4);g.fillStyle(0xe5ffc0,.8*life).fillRect(px-4,py-4,8,8);}continue;
      }
      if(effect.kind==='gravityRepulse'||effect.kind==='gravityExplosion'||effect.kind==='gravityCollapse'){
        const angle=Number(p.angle??0),wave=radius*(effect.kind==='gravityCollapse'?1-progress*.72:.25+.75*progress),fx=Math.cos(angle),fy=Math.sin(angle),sx=-fy,sy=fx;g.fillStyle(0x171329,.18*life).fillEllipse(x,y,wave*1.8,wave*.7);
        if(effect.kind==='gravityRepulse'){const frontX=x+fx*wave*.58,frontY=y+fy*wave*.58;g.fillStyle(0x8f82ed,.15*life).fillPoints([new Phaser.Math.Vector2(frontX+sx*wave*.55,frontY+sy*wave*.55),new Phaser.Math.Vector2(frontX-sx*wave*.55,frontY-sy*wave*.55),new Phaser.Math.Vector2(x-sx*wave*.25,y-sy*wave*.25),new Phaser.Math.Vector2(x+sx*wave*.25,y+sy*wave*.25)],true);for(let chunk=-4;chunk<=4;chunk++){const side=chunk*wave*.1,px=frontX+sx*side,py=frontY+sy*side;g.fillStyle(chunk%2?0xd9d2ff:0x6f648f,.72*life).fillRect(px-5,py-5,10,10);}}
        else for(let chunk=0;chunk<14;chunk++){const a=chunk/14*Math.PI*2+progress*(effect.kind==='gravityCollapse'?-3:2),r=wave*(.35+(chunk%3)*.25),px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;g.fillStyle(chunk%3?0x73698f:0xd9d2ff,.72*life).fillRect(px-4-(chunk%2)*2,py-4,8+(chunk%2)*4,8);g.lineStyle(2,0x9b8cff,.32*life).lineBetween(px,py,x,y);}continue;
      }
      if(effect.kind==='sonicCone'||effect.kind==='sonicWave'||effect.kind==='marchBeat'){
        const angle=Number(p.angle??0);
        if(effect.kind==='sonicWave'){
          const travel=Number(p.speed??520)*((effect.until-effect.born)/1000)*progress,cx=x+Math.cos(angle)*travel,cy=y+Math.sin(angle)*travel,sx=-Math.sin(angle),sy=Math.cos(angle),half=radius*(.85+.2*Math.sin(time*.02)),fx=Math.cos(angle),fy=Math.sin(angle);g.fillStyle(0xff8fc8,.13*life).fillPoints([new Phaser.Math.Vector2(cx+sx*half+fx*18,cy+sy*half+fy*18),new Phaser.Math.Vector2(cx-sx*half+fx*18,cy-sy*half+fy*18),new Phaser.Math.Vector2(cx-sx*half-fx*18,cy-sy*half-fy*18),new Phaser.Math.Vector2(cx+sx*half-fx*18,cy+sy*half-fy*18)],true);for(let band=-2;band<=2;band++){const forward=band*13;g.lineStyle(7-Math.abs(band),band%2?0xff8fc8:0xffd2e9,(.82-Math.abs(band)*.1)*life).lineBetween(cx+fx*forward+sx*half,cy+fy*forward+sy*half,cx+fx*forward-sx*half,cy+fy*forward-sy*half);}for(let dust=-4;dust<=4;dust++)g.fillStyle(dust%2?0xf0c4dc:0xb991aa,.42*life).fillCircle(cx-fx*28+sx*dust*half/5,cy-fy*28+sy*dust*half/5,5+Math.abs(dust%3));g.fillStyle(0xffd2e9,.55*life).fillTriangle(cx+fx*26,cy+fy*26,cx-fx*12+sx*18,cy-fy*12+sy*18,cx-fx*12-sx*18,cy-fy*12-sy*18);
        }else{const waves=effect.kind==='marchBeat'?8:4;for(let index=1;index<=waves;index++){const localProgress=(progress+index/waves)%1,radiusNow=radius*localProgress;if(effect.kind==='marchBeat'){const a=index/waves*Math.PI*2;g.fillStyle(index%2?0xff8fc8:0xffd2e9,.72*life).fillRect(x+Math.cos(a)*radiusNow-4,y+Math.sin(a)*radiusNow-10,8,20);}else g.lineStyle(7-index,0xffa5d2,.72*life).beginPath().arc(x,y,radiusNow,angle-.55,angle+.55).strokePath();}}
        continue;
      }
      if(effect.kind==='tacticalSmoke'){
        const wave=radius*(.25+.75*progress);for(let index=0;index<10;index++){const angle=index/10*Math.PI*2+progress,r=wave*(.35+(index%3)*.2);g.fillStyle(index%2?0x81908b:0xc2d0cc,.22*life).fillCircle(x+Math.cos(angle)*r,y+Math.sin(angle)*r,15+(index%3)*6);}continue;
      }
      if(effect.kind==='huntMark'){
        const gap=radius*(.75-.4*progress),owner=(s.players??[]).find((item:any)=>String(item.id)===String(p.ownerId));g.lineStyle(4,0xff675f,.9*life).strokeCircle(x,y,gap);for(let index=0;index<4;index++){const angle=index*Math.PI/2;g.lineStyle(5,0xffb0a8,.82*life).lineBetween(x+Math.cos(angle)*(gap+8),y+Math.sin(angle)*(gap+8),x+Math.cos(angle)*(gap+25),y+Math.sin(angle)*(gap+25));const tipX=x+Math.cos(angle)*(gap-5),tipY=y+Math.sin(angle)*(gap-5);g.fillStyle(0xff675f,.72*life).fillTriangle(tipX,tipY,x+Math.cos(angle+.35)*(gap+12),y+Math.sin(angle+.35)*(gap+12),x+Math.cos(angle-.35)*(gap+12),y+Math.sin(angle-.35)*(gap+12));}if(owner){g.lineStyle(3,0xff675f,.22*life).lineBetween(Number(owner.x),Number(owner.y),x,y);}continue;
      }
      if(effect.kind==='devicePulse'){
        const wave=radius*(.5+.5*progress);
        if(p.deviceKind==='fireWall'){g.lineStyle(8,0xff7a3d,.55*life).lineBetween(x-radius,y,x+radius,y);for(let i=-3;i<=3;i++)g.fillStyle(0xffd059,.65*life).fillTriangle(x+i*radius/3-8,y+6,x+i*radius/3+8,y+6,x+i*radius/3,y-18-progress*16);}
        else if(p.deviceKind==='fireStorm'){for(let i=0;i<4;i++){const a=progress*4+i*Math.PI/2;g.lineStyle(7,0xff8a37,.6*life).lineBetween(x,y,x+Math.cos(a)*wave,y+Math.sin(a)*wave);}}
        else if(p.deviceKind==='fireCapsule'){for(let i=0;i<7;i++){const a=i/7*Math.PI*2+.4,r=wave*(.35+(i%2)*.45);g.fillStyle(0xff9b43,.55*life).fillCircle(x+Math.cos(a)*r,y+Math.sin(a)*r,9);}}
        else if(p.deviceKind==='lifeSupport'){g.lineStyle(5,0x66f6a1,.65*life).strokeCircle(x,y,wave);g.fillStyle(0xdfffea,.78*life).fillRect(x-4,y-16,8,32);g.fillRect(x-16,y-4,32,8);for(const targetId of Array.isArray(p.linkedTargetIds)?p.linkedTargetIds:[]){const target=(s.players??[]).find((item:any)=>String(item.id)===String(targetId));if(!target)continue;const tx=Number(target.x),ty=Number(target.y),dx=tx-x,dy=ty-y,len=Math.hypot(dx,dy)||1,sx=-dy/len,sy=dx/len;g.lineStyle(8,0x66f6a1,.12*life).lineBetween(x,y,tx,ty);g.lineStyle(3,0xc8ffe0,.72*life).lineBetween(x,y,tx,ty);for(let bead=1;bead<=3;bead++){const t=(bead/4+progress*.35)%1;g.fillStyle(0xe8fff1,.8*life).fillCircle(x+dx*t+sx*Math.sin(bead+time*.02)*4,y+dy*t+sy*Math.sin(bead+time*.02)*4,4);}}}
        else if(p.deviceKind==='regenFoam'){for(let i=0;i<9;i++){const a=i/9*Math.PI*2,r=wave*(.45+(i%2)*.35);g.lineStyle(3,0x82f1bd,.55*life).strokeCircle(x+Math.cos(a)*r,y+Math.sin(a)*r,8+(i%3)*3);}}
        else{for(let i=-3;i<=3;i++)g.lineStyle(5,0x63cfff,.58*life).lineBetween(x-wave*.3,y+i*13,x+wave*.75,y+i*18);}
        continue;
      }
      if(effect.kind==='heroDash'){
        const x1=Number(p.x1),y1=Number(p.y1),x2=Number(p.x2),y2=Number(p.y2),dashX=Phaser.Math.Linear(x1,x2,progress),dashY=Phaser.Math.Linear(y1,y2,progress);
        if([x1,y1,x2,y2].every(Number.isFinite)){
          const a=Math.atan2(y2-y1,x2-x1),fx=Math.cos(a),fy=Math.sin(a),sx=-fy,sy=fx;
          if(p.dashStyle==='position'){
            const style=String(p.positionStyle??'combatRoll'),roll=style.includes('Roll')||style.includes('Hop')||style.includes('Step')||style.includes('Sidestep'),recoil=style.includes('Recoil'),chain=style.includes('chain')||style.includes('scrap'),gravity=style.includes('gravity'),shield=style.includes('shield'),hammer=style.includes('hammer');
            if(roll){g.lineStyle(5,style==='bloodChase'?0xef5b72:0xe7f2ef,.75*life).strokeCircle(dashX,dashY,24+Math.sin(progress*Math.PI)*8);for(let i=0;i<4;i++){const t=Math.max(0,progress-i*.12);g.fillStyle(hammer?0x9b7448:0xb7c5bd,.38*life).fillCircle(Phaser.Math.Linear(x1,x2,t)-fx*18+sx*(i%2?10:-10),Phaser.Math.Linear(y1,y2,t)-fy*18+sy*(i%2?10:-10),4+i);}}
            else if(recoil){for(let i=-1;i<=1;i++)g.fillStyle(style==='flameRecoil'?0xff7a35:0x82dfff,.55*life).fillTriangle(dashX+fx*28+sx*i*12,dashY+fy*28+sy*i*12,dashX+fx*64+sx*(i*15-8),dashY+fy*64+sy*(i*15-8),dashX+fx*64+sx*(i*15+8),dashY+fy*64+sy*(i*15+8));}
            else if(chain){g.lineStyle(5,0xc8b485,.72*life);for(let i=0;i<6;i++){const t=Math.max(0,progress-i*.08),px=Phaser.Math.Linear(x1,x2,t),py=Phaser.Math.Linear(y1,y2,t);g.strokeCircle(px,py,7);}}
            else if(gravity){for(let i=0;i<3;i++){g.lineStyle(4,0xa998ff,(.65-i*.14)*life).strokeEllipse(dashX,dashY,54+i*18,20+i*7);g.fillStyle(0xc8bcff,.6*life).fillRect(dashX-fx*25+sx*(i-1)*15-3,dashY-fy*25+sy*(i-1)*15-3,6,6);}}
            else if(shield){g.fillStyle(0x6db6e8,.2*life).fillTriangle(dashX+fx*38,dashY+fy*38,dashX-fx*18+sx*42,dashY-fy*18+sy*42,dashX-fx*18-sx*42,dashY-fy*18-sy*42);g.lineStyle(7,0xbde8ff,.8*life).lineBetween(dashX+sx*40,dashY+sy*40,dashX-sx*40,dashY-sy*40);}
            else{g.lineStyle(12,style.includes('emp')?0x57dcff:style.includes('steel')?0xff6c58:0xf0d06c,.2*life).lineBetween(x1,y1,dashX,dashY);for(let i=0;i<5;i++){const t=Math.max(0,progress-i*.1),px=Phaser.Math.Linear(x1,x2,t),py=Phaser.Math.Linear(y1,y2,t);g.fillStyle(0xf7fbff,.55*life).fillCircle(px+sx*(i%2?12:-12),py+sy*(i%2?12:-12),3+i%2);}}
          }else if(p.dashStyle==='wolf')for(let claw=-1;claw<=1;claw++)g.lineStyle(5,claw===0?0xffe7e8:0xe85968,.82*life).lineBetween(x1+sx*claw*13,y1+sy*claw*13,dashX+sx*(claw*13-18),dashY+sy*(claw*13-18));
          else if(p.dashStyle==='shield'){g.fillStyle(0xe1bd54,.18*life).fillTriangle(dashX+fx*45,dashY+fy*45,dashX-fx*32+sx*48,dashY-fy*32+sy*48,dashX-fx*32-sx*48,dashY-fy*32-sy*48);for(const side of [-1,1])g.lineStyle(8,0xffe598,.78*life).lineBetween(x1+sx*side*30,y1+sy*side*30,dashX+sx*side*22,dashY+sy*side*22);}
          else if(p.dashStyle==='hammer'){g.lineStyle(18,0x80603b,.17*life).lineBetween(x1,y1,dashX,dashY);for(let chunk=0;chunk<6;chunk++){const t=Math.max(0,progress-chunk*.1),px=Phaser.Math.Linear(x1,x2,t)+sx*(chunk%2?18:-18),py=Phaser.Math.Linear(y1,y2,t)+sy*(chunk%2?18:-18);g.fillStyle(chunk%2?0xd6a85b:0x6d5943,.65*life).fillRect(px-6,py-6,12,12);}}
          else if(p.dashStyle==='blade'||p.dashStyle==='bladeUltimate'){for(const side of [-1,1]){g.lineStyle(p.dashStyle==='bladeUltimate'?13:10,0x66e0c5,.16*life).lineBetween(x1-sx*side*18,y1-sy*side*18,dashX+sx*side*24,dashY+sy*side*24);g.lineStyle(4,side<0?0x76ffe0:0xffffff,.9*life).lineBetween(x1-sx*side*18,y1-sy*side*18,dashX+sx*side*24,dashY+sy*side*24);}}
          else{for(const side of [-1,1]){g.lineStyle(10,side<0?0xff6c5e:0x7ce8ff,.46*life).lineBetween(x1+sx*side*18,y1+sy*side*18,dashX+sx*side*18,dashY+sy*side*18);for(let index=0;index<4;index++){const ghostProgress=Math.max(0,progress-index*.12),gx=Phaser.Math.Linear(x1,x2,ghostProgress)+sx*side*18,gy=Phaser.Math.Linear(y1,y2,ghostProgress)+sy*side*18;g.fillStyle(0x4b5660,.35*life).fillRect(gx-7,gy-7,14,14);}}}
        }
        continue;
      }
      if(effect.kind==='wolfLifesteal'){
        const x=Number(p.x),y=Number(p.y),x2=Number(p.x2),y2=Number(p.y2),pulse=18+progress*48;
        if([x,y,x2,y2].every(Number.isFinite)){g.lineStyle(5,0xe94b65,.72*life).lineBetween(x2,y2,Phaser.Math.Linear(x2,x,progress),Phaser.Math.Linear(y2,y,progress));g.lineStyle(4,0xff9aaa,.68*life).strokeCircle(x,y,pulse);}
        continue;
      }
      if(effect.kind==='robotActivate'||effect.kind==='werewolfTransform'){
        if(effect.kind==='werewolfTransform'){
          const wave=radius*(.55+.65*progress);for(let index=0;index<10;index++){const a=index/10*Math.PI*2,r1=wave*.48,r2=wave*(index%2?.78:1);g.lineStyle(index%2?4:8,index%2?0x922a42:0xe74f63,.72*life).lineBetween(x+Math.cos(a)*r1,y+Math.sin(a)*r1,x+Math.cos(a+.12)*r2,y+Math.sin(a+.12)*r2);}g.fillStyle(0x39242c,.5*life).fillTriangle(x-35,y-8,x-17,y-68,x-2,y-15).fillTriangle(x+35,y-8,x+17,y-68,x+2,y-15);
        }else if(p.robotKind==='emp'){
          const wave=radius*(.5+.5*progress);for(let ring=1;ring<=3;ring++){const size=wave*ring/3;g.lineStyle(6-ring,0x67dcff,(.86-ring*.13)*life).strokeRect(x-size,y-size,size*2,size*2);}for(let i=0;i<8;i++){const a=i/8*Math.PI*2;g.lineStyle(2,0xd9fbff,.52*life).lineBetween(x+Math.cos(a)*20,y+Math.sin(a)*20,x+Math.cos(a)*wave,y+Math.sin(a)*wave);}
        }else{
          for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=radius*(1-progress*.7),px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;g.fillStyle(i%2?0x9c3039:0x313b41,.84*life).fillRoundedRect(px-13,py-10,26,20,4);g.lineStyle(3,0xff6c72,.55*life).lineBetween(px,py,x,y);}g.lineStyle(8,0xff5c4f,.78*life).strokeCircle(x,y,32+progress*18);
        }
        continue;
      }
      if(effect.kind==='piercingBeam'){
        const x1=Number(p.x1),y1=Number(p.y1),x2=Number(p.x2),y2=Number(p.y2),dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1,nx=dx/len,ny=dy/len,sx=-ny,sy=nx;
        if(p.beamStyle==='railgun'){g.lineStyle(16,0x75dcff,.08*life).lineBetween(x1,y1,x2,y2);g.lineStyle(3,0xe7fcff,.96*life).lineBetween(x1,y1,x2,y2);for(let i=1;i<=5;i++){const px=x1+dx*i/6,py=y1+dy*i/6,size=7+i;g.lineStyle(2,0x72e5ff,.72*life).lineBetween(px+sx*size,py+sy*size,px+nx*size,py+ny*size).lineBetween(px+nx*size,py+ny*size,px-sx*size,py-sy*size);}}
        else{g.lineStyle(30,0xffb23f,.12*life).lineBetween(x1,y1,x2,y2);g.lineStyle(9,0xffdf74,.72*life).lineBetween(x1,y1,x2,y2);g.lineStyle(3,0xffffff,.95*life).lineBetween(x1,y1,x2,y2);for(let i=0;i<7;i++){const px=x1+dx*i/7,py=y1+dy*i/7;g.fillStyle(0xffc34d,.58*life).fillTriangle(px+nx*25,py+ny*25,px-nx*12+sx*18,py-ny*12+sy*18,px-nx*12-sx*18,py-ny*12-sy*18);}}
        continue;
      }
      if(effect.kind==='meleeGuard'||effect.kind==='deathGuard'){
        const wave=radius*(.65+.45*progress),segments=effect.kind==='deathGuard'?8:6,color=effect.kind==='deathGuard'?0x7dffb3:0x72e7ff;
        for(let segment=0;segment<segments;segment++){const start=segment/segments*Math.PI*2-progress*.8+.08;g.lineStyle(effect.kind==='deathGuard'?7:5,color,(.85-segment*.025)*life).beginPath().arc(x,y,wave,start,start+Math.PI*1.3/segments).strokePath();}
        continue;
      }
      if(effect.kind==='shieldFormation'){
        const wave=radius*(.35+.65*progress);for(let i=0;i<10;i++){const a=i/10*Math.PI*2,px=x+Math.cos(a)*wave,py=y+Math.sin(a)*wave;g.fillStyle(0xf0ca62,.16*life).fillRoundedRect(px-13,py-18,26,36,5);g.lineStyle(4,0xffe7a0,.62*life).strokeRoundedRect(px-13,py-18,26,36,5);}continue;
      }
      if(effect.kind==='structureDestroyed'){
        for(let index=0;index<12;index++){const angle=index/12*Math.PI*2+.5,r=radius*progress*(.4+(index%3)*.22);g.fillStyle(index%2?0xffd565:0xb7c3c9,.75*life).fillRect(x+Math.cos(angle)*r-5,y+Math.sin(angle)*r-5,10,10);}
        g.lineStyle(8,0xffffff,.72*life).strokeCircle(x,y,radius*progress);continue;
      }
      if(effect.kind==='structureHit'||effect.kind==='structureBlocked'||effect.kind==='minionHit'||effect.kind==='campHit'){
        const color=effect.kind==='structureBlocked'?0xbce8ff:0xffe17f,wave=radius*(.35+.65*progress);g.lineStyle(5,color,.8*life).strokeCircle(x,y,wave);if(effect.kind==='minionHit')for(let shard=0;shard<6;shard++){const angle=shard/6*Math.PI*2+.4,r=wave*(.55+(shard%2)*.4);g.fillStyle(shard%2?0xfff3c2:0xd18a45,.82*life).fillRect(x+Math.cos(angle)*r-3,y+Math.sin(angle)*r-3,6,6);}continue;
      }
      if(effect.kind==='shieldBlock'){
        const wave=radius*(.12+.28*progress);g.fillStyle(0x9ee6ff,.18*life).fillCircle(x,y,wave);for(let spark=0;spark<9;spark++){const angle=spark/9*Math.PI*2,r=wave*(.6+(spark%3)*.35);g.lineStyle(spark%2?3:5,0xdff8ff,.82*life).lineBetween(x+Math.cos(angle)*8,y+Math.sin(angle)*8,x+Math.cos(angle)*r,y+Math.sin(angle)*r);}continue;
      }
      if(effect.kind==='stunApplied'){
        for(let star=0;star<5;star++){const angle=star/5*Math.PI*2+time*.006,r=28+6*Math.sin(time*.012+star);const px=x+Math.cos(angle)*r,py=y-34+Math.sin(angle)*r*.35;g.fillStyle(0xffe36a,.9*life).fillTriangle(px,py-6,px-5,py+5,px+5,py+5);}continue;
      }
      if(effect.kind==='upgradePickup'){
        const color=p.upgradeKind==='power'?0xff6c57:p.upgradeKind==='guard'?0x67b8ff:0x7ee39a;
        g.lineStyle(5,color,.86*life).strokeCircle(x,y,radius*progress);g.fillStyle(color,.2*life).fillCircle(x,y,radius*.7*progress);continue;
      }
      if(effect.kind==='levelUp'||effect.kind==='skillUpgrade'){
        const color=effect.kind==='levelUp'?0xffe56b:0x7ee9ff,wave=radius*(.45+.65*progress);
        g.fillStyle(color,.12*life).fillCircle(x,y,wave);
        g.lineStyle(effect.kind==='levelUp'?8:5,color,.9*life).strokeCircle(x,y,wave);
        for(let index=0;index<6;index++){const angle=index/6*Math.PI*2-time*.0015;g.fillStyle(color,.78*life).fillCircle(x+Math.cos(angle)*wave*.72,y+Math.sin(angle)*wave*.72,5);}
        continue;
      }
      if(effect.kind==='chickenVolley'||effect.kind==='rcSwarm'||effect.kind==='shockTrap'){
        if(effect.kind==='chickenVolley')for(let index=-4;index<=4;index++){const a=Number(p.angle??0)+index*.12,range=radius*(.45+.55*progress);g.lineStyle(4,index%2?0xff9c3c:0xffdc55,.72*life).lineBetween(x+Math.cos(a)*26,y+Math.sin(a)*26,x+Math.cos(a)*range,y+Math.sin(a)*range);}
        else if(effect.kind==='rcSwarm')for(let index=-2;index<=2;index++){const a=Number(p.angle??0)+index*.18,px=x+Math.cos(a)*radius*progress,py=y+Math.sin(a)*radius*progress;g.fillStyle(0x252c30,.9*life).fillRoundedRect(px-10,py-7,20,14,3);g.fillStyle(0xff6a4b,.86*life).fillCircle(px+Math.cos(a)*8,py+Math.sin(a)*8,4);}
        else{const wave=radius*(.55+.45*progress);for(let index=0;index<8;index++){const a=index/8*Math.PI*2,r1=wave*.4,r2=wave;g.lineStyle(index%2?2:5,0x70ddff,.72*life).lineBetween(x+Math.cos(a)*r1,y+Math.sin(a)*r1,x+Math.cos(a+.2)*r2,y+Math.sin(a+.2)*r2);}}
      }
    }
  }

  private updateLocalPrediction(me:any,x:number,y:number,dt:number){
    if(me.isDriving&&me.vehicleId){
      const motorcycle=this.displayMotorcycles.get(me.vehicleId)??this.net.snapshot?.motorcycles.find((item:any)=>item.id===me.vehicleId);
      this.predictedLocal=motorcycle?{x:motorcycle.x,y:motorcycle.y}:{x:me.x,y:me.y};
      return;
    }
    const dash=this.coreSiegeEffects.find((effect)=>effect.kind==='heroDash'&&String(effect.payload?.ownerId)===String(me.id)&&effect.until>this.time.now);
    if(dash){
      const p=dash.payload,x1=Number(p.x1),y1=Number(p.y1),x2=Number(p.x2),y2=Number(p.y2),progress=clamp((this.time.now-dash.born)/Math.max(1,dash.until-dash.born),0,1);
      if([x1,y1,x2,y2].every(Number.isFinite)){this.predictedLocal={x:Phaser.Math.Linear(x1,x2,progress),y:Phaser.Math.Linear(y1,y2,progress)};return;}
    }
    if(!this.predictedLocal)this.predictedLocal={x:me.x,y:me.y};
    const error=Math.hypot(this.predictedLocal.x-me.x,this.predictedLocal.y-me.y);
    if(error>130){this.predictedLocal.x=me.x;this.predictedLocal.y=me.y;}
    else if(error>16){this.predictedLocal.x=Phaser.Math.Linear(this.predictedLocal.x,me.x,.085);this.predictedLocal.y=Phaser.Math.Linear(this.predictedLocal.y,me.y,.085);}
    const ranged=WEAPONS[(me.equipped||'fists') as WeaponId];
    const melee=MELEE_WEAPONS[me.equipped as MeleeId];
    const aimingPenalty=this.scopeRequested?SNIPER_SCOPE_MOVE_MULTIPLIER:1;
    const multiplier=me.isSwimming?1:(ranged?.moveMultiplier??melee?.moveMultiplier??1)*aimingPenalty;
    const terrain=movementMultiplierAt(this.predictedLocal.x,this.predictedLocal.y,this.mapConfig.shallowWaterZones,this.mapConfig.landCrossings);
    const wolf=me.werewolf??{};
    const serverNow=Number(this.net.snapshot?.serverTime??0),playerMovementSlowed=serverNow<Number(wolf.silverSlowUntil??0),progress=me,heroId=(String(me.heroId??'') in CORE_SIEGE_HEROES?String(me.heroId):'vanguard') as CoreSiegeHeroId,spin=heroId==='ironCyclone'&&serverNow<Number(progress.spinUntil??0),slowResistance=coreSiegeHeroSlowResistance(heroId,spin),rawAdhesiveBase=adhesivePlayerSpeedMultiplier(Number(wolf.adhesiveSlowStage??0),serverNow,Number(wolf.adhesiveSlowUntil??0),Number(wolf.adhesiveRecoveryUntil??0)),adhesiveBase=Math.max(1-CORE_SIEGE_CONFIG.maxSlowRatio,rawAdhesiveBase),adhesiveMultiplier=1-(1-adhesiveBase)*(1-slowResistance),heroSpeed=coreSiegeHeroMoveMultiplier(heroId,Boolean(wolf.transformed),spin,serverNow<Number(progress.rampageUntil??0)),siegeHaste=serverNow<Number(progress.hasteUntil??0)?1.12:1,march=serverNow<Number(progress.marchUntil??0)?1.1:1,chase=serverNow<Number(progress.meleeChaseUntil??0)?CORE_SIEGE_CONFIG.meleeChaseMoveMultiplier:1,actionSpeed=serverNow<Number(progress.anchoredUntil??0)?0:serverNow<Number(progress.parryRecoveryUntil??0)?.45:1,slowMultiplier=playerMovementSlowed?.6+.4*slowResistance:1,siegeSpeed=Math.min(heroId==='ironCyclone'?CORE_SIEGE_CONFIG.ironMaxMoveMultiplier:Infinity,heroSpeed*siegeHaste*march*chase)*actionSpeed;const baseSpeed=(wolf.transformed?werewolfSpeed(MOTORCYCLE_MAX_SPEED,Boolean(wolf.sprinting),Boolean(me.insideBuilding),false,adhesiveMultiplier)*slowMultiplier:(me.isSwimming?SWIM_SPEED:PLAYER_SPEED)*multiplier*terrain*slowMultiplier*adhesiveMultiplier)*siegeSpeed;
    const safeDt=Math.min(.04,Math.max(0,dt));
    let moveX=x,moveY=y;
    if(wolf.transformed){
      const magnitude=Math.hypot(x,y);
      if(magnitude<=.08)this.werewolfPredictionVector=null;
      else if(wolf.sprinting){
        const desiredX=x/magnitude,desiredY=y/magnitude,previous=this.werewolfPredictionVector??{x:desiredX,y:desiredY};
        const previousAngle=Math.atan2(previous.y,previous.x),desiredAngle=Math.atan2(desiredY,desiredX);
        const delta=Math.atan2(Math.sin(desiredAngle-previousAngle),Math.cos(desiredAngle-previousAngle));
        const maxTurn=MOTORCYCLE_MAX_TURN_RATE*3.1*WEREWOLF_BALANCE.sprintSteeringMultiplier*safeDt;
        const nextAngle=previousAngle+clamp(delta,-maxTurn,maxTurn);
        moveX=Math.cos(nextAngle);moveY=Math.sin(nextAngle);this.werewolfPredictionVector={x:moveX,y:moveY};
      }else this.werewolfPredictionVector={x:moveX,y:moveY};
    }else this.werewolfPredictionVector=null;
    const exoSpeed=me.exoActive?(me.exoKind==='emp'?EMP_EXO_SUIT_BALANCE.speedMultiplier:EXO_SUIT_BALANCE.speedMultiplier):1;
    const chickenSpeed=me.chickenTransformed?CHICKEN_BLASTER_BALANCE.movementMultiplier:1;
    const step=safeDt*baseSpeed*exoSpeed*chickenSpeed;
    this.movePredicted(moveX*step,moveY*step);
  }

  private movePredicted(dx:number,dy:number){
    if(!this.predictedLocal)return;
    const dominationWalls=this.net.roomConfig.gameMode==='domination'?dominationWallsForMap(this.mapConfig.width,this.mapConfig.height):[];
    const siegeStructures=this.isCoreSiege()?this.net.snapshot?.coreSiege?.structures??[]:[];
    const blocked=(x:number,y:number)=>[...this.mapConfig.collisionObstacles,...dominationWalls].some(r=>circleHitsRect(x,y,PLAYER_BODY_RADIUS,r))||siegeStructures.some((structure:any)=>!structure.destroyed&&distance(x,y,Number(structure.x),Number(structure.y))<PLAYER_BODY_RADIUS+Number(structure.radius));
    const me=this.local();
    if(blocked(this.predictedLocal.x,this.predictedLocal.y)&&me&&!blocked(me.x,me.y))this.predictedLocal={x:me.x,y:me.y};
    const total=Math.hypot(dx,dy),steps=Math.max(1,Math.ceil(total/6)),sx=dx/steps,sy=dy/steps;
    for(let i=0;i<steps;i++){
      const nx=clamp(this.predictedLocal.x+sx,PLAYER_BODY_RADIUS,this.mapConfig.width-PLAYER_BODY_RADIUS);
      const ny=clamp(this.predictedLocal.y+sy,PLAYER_BODY_RADIUS,this.mapConfig.height-PLAYER_BODY_RADIUS);
      if(!blocked(nx,ny)){this.predictedLocal.x=nx;this.predictedLocal.y=ny;continue;}
      if(!blocked(nx,this.predictedLocal.y)){this.predictedLocal.x=nx;continue;}
      if(!blocked(this.predictedLocal.x,ny)){this.predictedLocal.y=ny;continue;}
      break;
    }
  }

  private updateHitState(s:any,time:number){
    const active=new Set<string>();
    for(const p of s.players){
      active.add(p.id);
      const seq=Number(p.hitSeq??0),prev=this.lastHitSeq.get(p.id);
      if(prev===undefined)this.lastHitSeq.set(p.id,seq);
      else if(prev!==seq){
        this.lastHitSeq.set(p.id,seq);this.hitStartedAt.set(p.id,time);
        if(p.id===this.net.sessionId){const maxHp=Math.max(1,Number(p.maxHp??100)),damageRatio=clamp(Number(p.lastHitDamage??0)/maxHp,0,1);this.localHitSeverity=damageRatio;this.localHitDuration=220+Math.min(180,damageRatio*700);this.localHitUntil=time+this.localHitDuration;this.localHitAngle=Number(p.lastHitAngle??0);this.cameras.main.shake(95+damageRatio*90,Math.min(.014,.003+damageRatio*.018));audio.playLocal(Boolean(s.zoneActive)&&distance(Number(p.x),Number(p.y),Number(s.zoneX),Number(s.zoneY))>Number(s.zoneRadius)?'zone_damage':'local_damage',1,`damage:${p.id}:${seq}`);}
      }
    }
    for(const id of this.lastHitSeq.keys())if(!active.has(id)){this.lastHitSeq.delete(id);this.hitStartedAt.delete(id);}
  }

  private drawHitEffects(time:number){
    const g=this.hitG;g.clear();
    if(time>=this.localHitUntil)return;
    const pulse=clamp((this.localHitUntil-time)/Math.max(1,this.localHitDuration),0,1),severity=this.localHitSeverity,w=this.scale.width,h=this.scale.height;
    g.fillStyle(0xff2538,.04+(.08+severity*.12)*pulse).fillRect(0,0,w,h);
    g.lineStyle(6+severity*7,0xff3348,.18+.48*pulse).strokeRect(4,4,w-8,h-8);
    const cx=w/2,cy=h/2,r=72;
    const sourceAngle=this.localHitAngle+Math.PI,ax=cx+Math.cos(sourceAngle)*r,ay=cy+Math.sin(sourceAngle)*r;
    g.lineStyle(6,0xff5968,.85*pulse).lineBetween(cx,cy,ax,ay);
    g.fillStyle(0xff5968,.9*pulse).fillTriangle(ax+Math.cos(sourceAngle)*9,ay+Math.sin(sourceAngle)*9,ax+Math.cos(sourceAngle+2.35)*9,ay+Math.sin(sourceAngle+2.35)*9,ax+Math.cos(sourceAngle-2.35)*9,ay+Math.sin(sourceAngle-2.35)*9);
  }

  private drawPlayerHealthBar(g:Phaser.GameObjects.Graphics,p:any,x:number,y:number,hitPulse:number,alpha=1,width=50,height=5){
    const maxHp=Math.max(1,Number(p.maxHp??100)),hpRatio=clamp(Number(p.hp)/maxHp,0,1),damageRatio=clamp(Number(p.lastHitDamage??0)/maxHp,0,1);
    g.fillStyle(0x091117,.88*alpha).fillRect(x-width/2,y,width,height);
    if(hitPulse>0&&damageRatio>0)g.fillStyle(damageRatio>=.2?0xff5d46:0xffb052,.75*hitPulse*alpha).fillRect(x-width/2+width*hpRatio,y,width*Math.min(damageRatio,1-hpRatio),height);
    g.fillStyle(hpRatio>.4?0x55dd8c:0xff5f67,alpha).fillRect(x-width/2,y,width*hpRatio,height);
  }

  private drawCoreSiegeCombatStatus(g:Phaser.GameObjects.Graphics,p:any,x:number,y:number,time:number,alpha=1,radius=28){
    if(!this.isCoreSiege())return;
    const serverTime=Number(this.net.snapshot?.serverTime??0),shield=Number(p.temporaryShield??0),shieldActive=shield>0&&Number(p.temporaryShieldEndsAt??0)>serverTime;
    if(shieldActive){const turn=time*.0025,pulse=.65+.2*Math.sin(time*.018);for(let segment=0;segment<6;segment++){const start=turn+segment*Math.PI/3+.08;g.lineStyle(4,0x72e7ff,pulse*alpha).beginPath().arc(x,y,radius+6,start,start+.72).strokePath();}}
    const silverUntil=Number(p.werewolf?.silverSlowUntil??0),adhesiveUntil=Number(p.werewolf?.adhesiveRecoveryUntil??0),slowed=Math.max(silverUntil,adhesiveUntil)>serverTime;
    if(slowed){for(let band=0;band<3;band++){const spread=radius+4+band*7,offset=Math.sin(time*.008+band)*3;g.lineStyle(3-band*.5,0xb6e8ef,(.56-band*.1)*alpha).beginPath().arc(x,y+10+offset,spread,.2+band*.18,Math.PI-.2-band*.18).strokePath();}}
    const lockedUntil=Number(p.werewolf?.actionLockedUntil??0);
    if(lockedUntil>serverTime){const sparkAlpha=clamp((lockedUntil-serverTime)/.6,0,1)*alpha;for(let i=0;i<5;i++){const angle=time*.012+i*1.25,r=radius+(i%2)*5,sx=x+Math.cos(angle)*r,sy=y+Math.sin(angle)*r*.82,ex=x+Math.cos(angle+.55)*(r+6),ey=y+Math.sin(angle+.55)*(r+6)*.82;g.lineStyle(i%2?2:3,i%2?0xeaffff:0x7ce6ff,(.45+.18*Math.sin(time*.05+i))*sparkAlpha).lineBetween(sx,sy,(sx+ex)/2+Math.sin(time*.04+i)*6,(sy+ey)/2).lineBetween((sx+ex)/2+Math.sin(time*.04+i)*6,(sy+ey)/2,ex,ey);}g.lineStyle(3,0x7ce6ff,.35*sparkAlpha).strokeCircle(x,y,radius+2+Math.sin(time*.03)*3);}
  }

  private drawCoreSiegeHeroDetails(g:Phaser.GameObjects.Graphics,heroId:CoreSiegeHeroId,x:number,y:number,a:number,scale:number,time:number,alpha:number,attackProgress=1,attackSeq=0){
    const fx=Math.cos(a),fy=Math.sin(a),sx=-fy,sy=fx;
    const pt=(forward:number,side:number)=>({x:x+fx*forward*scale+sx*side*scale,y:y+fy*forward*scale+sy*side*scale});
    const line=(width:number,color:number,from:[number,number],to:[number,number],lineAlpha=1)=>{const start=pt(...from),end=pt(...to);g.lineStyle(width*scale,color,lineAlpha*alpha).lineBetween(start.x,start.y,end.x,end.y);};
    const dot=(color:number,forward:number,side:number,radius:number,dotAlpha=1)=>{const point=pt(forward,side);g.fillStyle(color,dotAlpha*alpha).fillCircle(point.x,point.y,radius*scale);};
    switch(heroId){
      case 'vanguard':
        dot(0x48555d,-1,-19,6);dot(0x48555d,-1,19,6);
        line(4,0xf2b84b,[5,-12],[12,-7]);line(4,0xf2b84b,[12,-7],[12,7]);line(4,0xf2b84b,[12,7],[5,12]);
        line(3,0xc8d0d5,[-12,0],[-2,0],.8);break;
      case 'technician':{
        line(3,0x68d9d0,[-10,-14],[-20,-23]);dot(0xb6fff6,-21,-24,4);
        dot(0x55c7be,-2,-23,5);dot(0x55c7be,-2,23,5);
        line(2,0xa7fff4,[-2,-18],[10,-8],.8);line(2,0xa7fff4,[-2,18],[10,8],.8);dot(0x68d9d0,10,0,3,.9);break;
      }
      case 'trapper':
        for(const side of [-1,1]){line(3,0x4d5b50,[-7,side*13],[-17,side*27]);line(3,0x88d36c,[2,side*16],[10,side*27],.8);}
        line(4,0x29332c,[8,-14],[15,0]);line(4,0x29332c,[15,0],[8,14]);dot(0x9cff7f,13,0,3);break;
      case 'trickster':{
        const beak=pt(29,0),beakL=pt(18,-7),beakR=pt(18,7);g.fillStyle(0xff9635,alpha).fillTriangle(beak.x,beak.y,beakL.x,beakL.y,beakR.x,beakR.y);
        dot(0xe94c45,-3,-21,5);dot(0xe94c45,3,-23,4.5);dot(0xe94c45,8,-21,4);
        dot(0x17130d,10,-8,2.5);dot(0xffffff,10,-8,1);break;
      }
      case 'medigel':
        dot(0x42b982,-2,-23,7);dot(0x42b982,-2,23,7);line(2,0xdffcf0,[-10,-23],[6,-23]);line(2,0xdffcf0,[-10,23],[6,23]);
        line(5,0xeffff8,[-6,0],[7,0]);line(5,0xeffff8,[.5,-6],[.5,6]);dot(0x73eba8,12,0,3,.9);break;
      case 'fireEngineer':
        dot(0xd45b32,-17,-15,8);dot(0xd45b32,-17,15,8);line(3,0x4a3730,[-22,-15],[-11,-15]);line(3,0x4a3730,[-22,15],[-11,15]);
        for(const side of [-1,0,1])line(3,side===0?0xffd177:0xff9148,[5,side*7],[16,side*7],.9);break;
      case 'orbitalSniper':
        line(7,0x193440,[1,-14],[13,14]);line(3,0x92e8ff,[2,-12],[13,12]);dot(0xdaf9ff,12,11,4);
        line(2,0x8fa6af,[-15,-9],[-23,-18],.75);line(2,0x8fa6af,[-15,9],[-23,18],.75);break;
      case 'wolfWarrior':{
        const earL=pt(4,-16),earLTip=pt(4,-29),earLBase=pt(-8,-19),earR=pt(4,16),earRTip=pt(4,29),earRBase=pt(-8,19);g.fillStyle(0x59626b,alpha).fillTriangle(earL.x,earL.y,earLTip.x,earLTip.y,earLBase.x,earLBase.y).fillTriangle(earR.x,earR.y,earRTip.x,earRTip.y,earRBase.x,earRBase.y);
        dot(0xe45865,12,-7,3);dot(0xe45865,12,7,3);line(3,0xb8c0c5,[-12,-13],[-18,0],.7);line(3,0xb8c0c5,[-18,0],[-12,13],.7);break;
      }
      case 'shieldCaptain':
        line(7,0x59666c,[10,-20],[24,-14]);line(7,0xd4b451,[24,-14],[27,0]);line(7,0xd4b451,[27,0],[24,14]);line(7,0x59666c,[24,14],[10,20]);
        line(3,0xf3d982,[-10,0],[10,0]);dot(0xf1c45a,7,0,3);break;
      case 'demolitionist':
        dot(0x252d31,-16,-17,8);dot(0x252d31,-16,17,8);dot(0xffcb55,-17,-17,4);dot(0xffcb55,-17,17,4);
        for(let side=-10;side<=10;side+=10)line(4,side===0?0xffcb55:0x272e32,[0,side-3],[10,side+3],.9);dot(0xff735c,15,0,3,.8+.2*Math.sin(time*.02));break;
      case 'steelPilot':
        dot(0x9b3039,-1,-21,7);dot(0x9b3039,-1,21,7);line(5,0x303a40,[7,-12],[15,-7]);line(5,0xff646b,[15,-7],[15,7]);line(5,0x303a40,[15,7],[7,12]);
        line(3,0xb7c2c7,[-12,-10],[-17,0]);line(3,0xb7c2c7,[-17,0],[-12,10]);break;
      case 'empPilot':{
        const pulse=.55+.25*Math.sin(time*.014);g.lineStyle(2*scale,0x67dfff,pulse*alpha).strokeCircle(x,y,25*scale);
        line(3,0x83ebff,[-9,-14],[-18,-23]);dot(0xd8fbff,-19,-24,4);
        for(const side of [-1,1]){dot(0x67dfff,1,side*19,4,pulse);line(2,0xb9f6ff,[1,side*15],[10,side*8],pulse);}
        break;
      }
      case 'ironCyclone':
        for(const side of [-1,1]){dot(0x8a7346,-1,side*22,9);line(5,0x343b3f,[-6,side*15],[-3,side*27]);}
        line(7,0xd7dfe0,[-11,-12],[17,10]);line(3,0xe7b85d,[-13,-14],[19,8]);dot(0xb3985c,-15,-15,5);break;
      case 'scrapSummoner':{
        const gear=.55+.25*Math.sin(time*.012);for(const side of [-1,1]){const wheel=pt(-4,side*23);g.lineStyle(3*scale,0xb6e36a,gear*alpha).strokeCircle(wheel.x,wheel.y,7*scale);line(2,0x728064,[-4,side*16],[-4,side*26]);}
        dot(0xe5ffc0,10,0,4);line(3,0x697261,[-14,-10],[-21,-17]);line(3,0x697261,[-14,10],[-21,17]);break;
      }
      case 'gravityWarden':{
        const orbit=24+3*Math.sin(time*.01);g.lineStyle(3*scale,0x9b8cff,.72*alpha).strokeEllipse(x,y,orbit*2*scale,orbit*1.25*scale);dot(0xd9d2ff,10,0,4);line(4,0x5c548f,[-14,-12],[-22,0]);line(4,0x5c548f,[-22,0],[-14,12]);break;
      }
      case 'smokeTracker':{
        const hook=pt(18,-28);line(5,0x657a74,[-10,-15],[-19,0]);line(5,0x657a74,[-19,0],[-10,15]);line(3,0xc6eee2,[0,-18],[17,-27]);g.lineStyle(3*scale,0x8ac7b4,.85*alpha).strokeCircle(hook.x,hook.y,6*scale);dot(0x8ac7b4,10,0,3);break;
      }
      case 'sonicCommander':{
        const pulse=.65+.25*Math.sin(time*.016),speaker=pt(10,0);for(const side of [-1,1]){const driver=pt(-1,side*23);dot(0x3e2e3b,-1,side*23,9);g.lineStyle(3*scale,0xff8fc8,pulse*alpha).strokeCircle(driver.x,driver.y,5*scale);}
        for(let band=1;band<=2;band++)g.lineStyle((4-band)*scale,0xffd2e9,(.7-band*.15)*alpha).beginPath().arc(speaker.x,speaker.y,(8+band*7)*scale,a-.45,a+.45).strokePath();break;
      }
      case 'earthHammer':
        for(const side of [-1,1]){dot(0x695b46,-2,side*23,10);line(6,0x30383a,[-7,side*16],[3,side*29]);}
        line(8,0x6f5436,[-12,-8],[19,9]);{const head=pt(22,11);g.fillStyle(0xb79a66,alpha).fillRoundedRect(head.x-12*scale,head.y-17*scale,24*scale,34*scale,3*scale);g.lineStyle(4*scale,0x3b4141,.9*alpha).strokeRoundedRect(head.x-12*scale,head.y-17*scale,24*scale,34*scale,3*scale);}break;
      case 'chainExecutioner':{
        for(const side of [-1,1])dot(0x6b323b,-2,side*22,8);for(let index=0;index<5;index++){const link=pt(2+index*6,-15-index*3);g.lineStyle(3*scale,index%2?0xd0b9a4:0x85776c,.9*alpha).strokeEllipse(link.x,link.y,8*scale,5*scale);}const blade=pt(32,-30);g.lineStyle(7*scale,0xd7d0c5,.95*alpha).beginPath().arc(blade.x,blade.y,15*scale,a-1.3,a+.65).strokePath();line(4,0x4d2027,[-12,10],[12,12]);break;
      }
      case 'twinBlade':{
        const combo=(Math.max(1,attackSeq)-1)%3+1,crossing=combo===3&&attackProgress<.72,crossSide=crossing?18*(1-clamp((attackProgress-.12)/.48,0,1)):0;
        for(const side of [-1,1]){const bladeSide=crossing?-side*crossSide:side*22;line(5,side<0?0xbfffee:0x75d9cb,[0,side*12],[28,bladeSide]);line(2,0xffffff,[24,bladeSide],[38,bladeSide-side*5]);dot(side<0?0x214b49:0x163c3a,-5,side*20,6);}
        line(3,0x65e0c5,[-15,-10],[-22,0]);line(3,0x65e0c5,[-22,0],[-15,10]);break;
      }
    }
  }

  private drawPlayer(g:Phaser.GameObjects.Graphics,p:any,x:number,y:number,time:number,alpha=1){
    const teamMode=this.net.roomConfig.gameMode==='domination'||this.net.roomConfig.gameMode==='coreSiege';
    const color=p.id===this.net.sessionId?0x45d7ff:teamMode?(p.team==='blue'?0x5b9fff:0xff665f):p.ai?0xff8b5f:0xf06dba;
    const hitAt=this.hitStartedAt.get(p.id)??-999;
    const hitPulse=Math.max(0,1-(time-hitAt)/180);
    const bodyColor=hitPulse>0&&Math.floor((time-hitAt)/45)%2===0?0xffffff:color;
    const scale=p.phase==='falling'?1.7:p.phase==='parachute'?1.35:1;
    const altitudeOffset=20+Math.min(50,p.altitude/15);
    g.fillStyle(0x000000,.22*alpha).fillEllipse(x,y+altitudeOffset,40,18);
    if(p.chickenTransformed){this.drawChicken(g,p,x,y,time,alpha,hitPulse);return;}
    if(p.exoAssembling){this.drawExoAssembly(g,p,x,y,time,alpha,bodyColor);return;}
    if(p.exoActive){
      const empExo=p.exoKind==='emp',primaryColor=empExo?0x287fd1:0x8f2630,accentColor=empExo?0x67dcff:0x35d9ff,maxHp=empExo?EMP_EXO_SUIT_BALANCE.maxHp:EXO_SUIT_BALANCE.maxHp;
      const a=Number(p.angle||0),fx=Math.cos(a),fy=Math.sin(a),sx=-fy,sy=fx,idle=Math.sin(time*.018+String(p.id).length)*1.2;
      const attackSeq=Number(p.attackSeq??0),previous=this.lastAttackSeq.get(p.id);if(previous===undefined)this.lastAttackSeq.set(p.id,attackSeq);else if(previous!==attackSeq){this.lastAttackSeq.set(p.id,attackSeq);this.attackStartedAt.set(p.id,time);}
      const attackAge=time-(this.attackStartedAt.get(p.id)??-999),recoil=attackAge<170?Math.sin(clamp(attackAge/170,0,1)*Math.PI)*7:0,bx=x-fx*recoil*.35,by=y-fy*recoil*.35+idle*.25;
      const point=(forward:number,side:number)=>({x:bx+fx*forward+sx*side,y:by+fy*forward+sy*side});
      const rear=point(-30,0),leftFront=point(20,-27),rightFront=point(20,27),leftRear=point(-20,-31),rightRear=point(-20,31);
      g.fillStyle(0x02070b,.35*alpha).fillEllipse(bx-fx*5,by-fy*5+18,86,38);
      g.fillStyle(0x202a31,.98*alpha).fillTriangle(rear.x,rear.y,leftRear.x,leftRear.y,leftFront.x,leftFront.y).fillTriangle(rear.x,rear.y,rightRear.x,rightRear.y,rightFront.x,rightFront.y);
      g.fillStyle(primaryColor,.98*alpha).fillRoundedRect(bx-31,by-27,62,54,12);
      g.lineStyle(4,0x303a42,alpha).strokeRoundedRect(bx-31,by-27,62,54,12);
      g.lineStyle(3,0x171f25,.9*alpha).lineBetween(leftRear.x,leftRear.y,leftFront.x,leftFront.y).lineBetween(rightRear.x,rightRear.y,rightFront.x,rightFront.y);
      for(const side of [-1,1]){const shoulder=point(2,side*35),armEnd=point(22-recoil,side*42);g.fillStyle(0x303a42,alpha).fillRoundedRect(shoulder.x-10,shoulder.y-12,20,24,5);g.lineStyle(10,0x252f36,alpha).lineBetween(shoulder.x,shoulder.y,armEnd.x,armEnd.y);g.fillStyle(primaryColor,alpha).fillRoundedRect(armEnd.x-8,armEnd.y-8,16,16,4);}
      if(empExo){const gunBase=point(18,36),gunTip=point(55-recoil,36),gunTip2=point(55-recoil,43);g.lineStyle(10,0x17242d,alpha).lineBetween(gunBase.x,gunBase.y,gunTip.x,gunTip.y);g.lineStyle(4,accentColor,alpha).lineBetween(point(29,34).x,point(29,34).y,gunTip.x,gunTip.y).lineBetween(point(29,41).x,point(29,41).y,gunTip2.x,gunTip2.y);const antenna=point(-8,-33);g.lineStyle(3,0x9beaff,.8*alpha).lineBetween(antenna.x,antenna.y,point(-14,-48).x,point(-14,-48).y);g.fillStyle(accentColor,.9*alpha).fillCircle(point(-14,-48).x,point(-14,-48).y,4);}
      const core=point(0,0),corePulse=.72+.22*Math.sin(time*.014);g.fillStyle(accentColor,.12*alpha).fillCircle(core.x,core.y,19+corePulse*3);g.lineStyle(4,0x202a31,alpha).strokeCircle(core.x,core.y,15);g.fillStyle(accentColor,corePulse*alpha).fillCircle(core.x,core.y,10);g.fillStyle(0xd9fbff,.9*alpha).fillEllipse(core.x+fx*2,core.y+fy*2,8,5);
      const sensor=point(28,0),sensorL=point(23,-13),sensorR=point(23,13);g.lineStyle(7,0x202a31,alpha).lineBetween(sensorL.x,sensorL.y,sensorR.x,sensorR.y);g.lineStyle(3,accentColor,(attackAge<170?1:.65)*alpha).lineBetween(point(28,-9).x,point(28,-9).y,point(28,9).x,point(28,9).y);g.fillStyle(accentColor,.25*alpha).fillCircle(sensor.x,sensor.y,8);
      const boosterL=point(-30,-15),boosterR=point(-30,15);for(const booster of [boosterL,boosterR]){g.fillStyle(0x171f25,alpha).fillRoundedRect(booster.x-7,booster.y-7,14,14,3);g.fillStyle(accentColor,.35+.18*Math.sin(time*.025)*alpha).fillCircle(booster.x-fx*5,booster.y-fy*5,4);}
      if(Number(p.empDisabledUntil??0)>Number(this.net.snapshot?.serverTime??0)){const pulse=.55+.35*Math.sin(time*.04);g.fillStyle(0x071018,.30*alpha).fillCircle(bx,by,42);g.lineStyle(4,0x7ce6ff,pulse*alpha).strokeCircle(bx,by,43+Math.sin(time*.025)*3);for(let index=0;index<7;index++){const sparkAngle=time*.015+index*.9,r=31+(index%3)*8;g.lineStyle(3,index%2?0xeaffff:0x44bcff,(.45+.25*pulse)*alpha).lineBetween(bx+Math.cos(sparkAngle)*r,by+Math.sin(sparkAngle)*r,bx+Math.cos(sparkAngle+.48)*(r+10),by+Math.sin(sparkAngle+.48)*(r+10));}}
      g.fillStyle(0x11181d,.94).fillRect(bx-36,by-43,72,7);g.fillStyle(accentColor,alpha).fillRect(bx-36,by-43,72*clamp(Number(p.exoHp||0)/maxHp,0,1),7);return;
    }
    if(p.isSwimming){
      const wave=2+Math.sin(time*.012+p.x*.01)*2;
      g.lineStyle(3,0xa8e7f2,.55*alpha).strokeEllipse(x,y+8,48+wave,20+wave*.5);
      g.fillStyle(bodyColor,.92*alpha).fillEllipse(x,y-2,34,25);
      g.lineStyle(3,0xffffff,(p.id===this.net.sessionId?1:.42)*alpha).strokeEllipse(x,y-2,34,25);
      if(hitPulse>0)g.lineStyle(4,0xff4c57,hitPulse*alpha).strokeCircle(x,y,27+8*(1-hitPulse));
      this.drawCoreSiegeCombatStatus(g,p,x,y,time,alpha,27);this.drawPlayerHealthBar(g,p,x,y-37,hitPulse,alpha);
      return;
    }
    if(p.werewolf?.transformed){
      const a=Number(p.angle||0),fx=Math.cos(a),fy=Math.sin(a),sx=-fy,sy=fx,pulse=p.werewolf.sprinting?3+Math.sin(time*.02)*2:0;
      const wolfAttackSeq=Number(p.attackSeq??0),wolfPrevious=this.lastAttackSeq.get(p.id);
      if(wolfPrevious===undefined)this.lastAttackSeq.set(p.id,wolfAttackSeq);
      else if(wolfPrevious!==wolfAttackSeq){this.lastAttackSeq.set(p.id,wolfAttackSeq);this.attackStartedAt.set(p.id,time);}
      const wolfAttackStarted=this.attackStartedAt.get(p.id)??-999,wolfAttackProgress=Math.max(0,Math.min(1,(time-wolfAttackStarted)/260)),wolfAttackActive=wolfAttackProgress<1,wolfAttackSide=wolfAttackSeq%2===0?1:-1,wolfWindup=wolfAttackActive?Math.min(1,wolfAttackProgress/.28):0,wolfSweepT=wolfAttackActive?Math.max(0,Math.min(1,(wolfAttackProgress-.22)/.58)):0,wolfRecover=wolfAttackActive?Math.max(0,1-Math.max(0,(wolfAttackProgress-.8)/.2)):0;
      const auraPulse=.5+.5*Math.sin(time*.009+Number(p.x||0)*.004);g.fillStyle(0x6d1522,.10*alpha).fillCircle(x,y,WEREWOLF_BALANCE.auraRadius*(.92+auraPulse*.08));g.lineStyle(4,0xff5c45,(.28+auraPulse*.24)*alpha).strokeCircle(x,y,WEREWOLF_BALANCE.auraRadius*(.92+auraPulse*.08));
      g.fillStyle(0x08090c,.25*alpha).fillEllipse(x,y+25,56+pulse*2,22);
      g.fillStyle(0x242832,.98*alpha).fillEllipse(x,y,44,50);
      g.fillStyle(0x303640,.98*alpha).fillCircle(x+fx*13,y+fy*13,20);
      g.fillStyle(0x303640,.98*alpha).fillTriangle(x+fx*4+sx*13,y+fy*4+sy*13,x+fx*5+sx*27,y+fy*5+sy*27,x+fx*16+sx*15,y+fy*16+sy*15);
      g.fillStyle(0x303640,.98*alpha).fillTriangle(x+fx*4-sx*13,y+fy*4-sy*13,x+fx*5-sx*27,y+fy*5-sy*27,x+fx*16-sx*15,y+fy*16-sy*15);
      g.fillStyle(0x171a20,.98*alpha).fillEllipse(x+fx*30,y+fy*30,24,15);
      g.fillStyle(0xff334f,.95*alpha).fillCircle(x+fx*18+sx*7,y+fy*18+sy*7,3).fillCircle(x+fx*18-sx*7,y+fy*18-sy*7,3);
      for(const side of [-1,1]){const striking=side===wolfAttackSide,restSide=side*24,attackSide=wolfAttackSide*(32-64*wolfSweepT),handSide=striking?attackSide*wolfRecover+restSide*(1-wolfRecover):restSide,handForward=34+pulse+(striking?15*wolfWindup*wolfRecover:0),hx=x+fx*10+sx*side*18,hy=y+fy*10+sy*side*18,ex=x+fx*handForward+sx*handSide,ey=y+fy*handForward+sy*handSide;g.lineStyle(8,0x303640,.95*alpha).lineBetween(hx,hy,ex,ey);for(let claw=-1;claw<=1;claw++)g.lineStyle(2,0xe2e5e8,.8*alpha).lineBetween(ex,ey,ex+fx*10+sx*claw*3,ey+fy*10+sy*claw*3);}
      if(wolfAttackActive&&wolfSweepT>0){const slashStartSide=wolfAttackSide*38,slashEndSide=wolfAttackSide*(38-76*wolfSweepT),slashAlpha=Math.sin(Math.min(1,wolfSweepT)*Math.PI);for(let claw=-1;claw<=1;claw++){const slashForward=53+claw*7,startX=x+fx*slashForward+sx*(slashStartSide+claw*2),startY=y+fy*slashForward+sy*(slashStartSide+claw*2),endX=x+fx*slashForward+sx*(slashEndSide+claw*2),endY=y+fy*slashForward+sy*(slashEndSide+claw*2);g.lineStyle(14,0x7b1625,.22*slashAlpha*alpha).lineBetween(startX,startY,endX,endY);g.lineStyle(6,0xffd7dc,(.4+.55*slashAlpha)*alpha).lineBetween(startX,startY,endX,endY);}}
      const wolfAdhesiveStage=Number(p.werewolf.adhesiveSlowStage??0);if(wolfAdhesiveStage>0&&Number(p.werewolf.adhesiveRecoveryUntil??0)>Number(this.net.snapshot?.serverTime??0)){g.lineStyle(3+wolfAdhesiveStage,0x72e58b,.72*alpha).strokeEllipse(x,y+8,52+wolfAdhesiveStage*6,34+wolfAdhesiveStage*4);}
      if(p.inBush)g.lineStyle(3,p.bushRevealed?0xffd45a:0x7ddf7f,(p.id===this.net.sessionId ? .88 : .45)*alpha).strokeCircle(x,y,30);
      if(hitPulse>0)g.lineStyle(4,0xff4c57,hitPulse*alpha).strokeCircle(x,y,34+8*(1-hitPulse));
      this.drawCoreSiegeCombatStatus(g,p,x,y,time,alpha,34);this.drawPlayerHealthBar(g,p,x,y-42,hitPulse,alpha);
      return;
    }
    const concealAlpha=p.inBush&&!p.bushRevealed&&p.id!==this.net.sessionId ? .72 : 1;
    const siegeHeroId=this.isCoreSiege()?(String(p.heroId??'vanguard') in CORE_SIEGE_HEROES?String(p.heroId):'vanguard') as CoreSiegeHeroId:undefined;
    const attackSeq=Number(p.attackSeq??0),previous=this.lastAttackSeq.get(p.id);
    if(previous===undefined)this.lastAttackSeq.set(p.id,attackSeq);
    else if(previous!==attackSeq){this.lastAttackSeq.set(p.id,attackSeq);this.attackStartedAt.set(p.id,time);}
    const started=this.attackStartedAt.get(p.id)??-999,meleeDuration=siegeHeroId==='earthHammer'?460:siegeHeroId==='chainExecutioner'?390:siegeHeroId==='ironCyclone'?360:siegeHeroId==='twinBlade'?270:170,attackProgress=Math.max(0,Math.min(1,(time-started)/meleeDuration)),attackPulse=attackProgress<1?Math.sin(attackProgress*Math.PI):0;
    const ironSpinning=siegeHeroId==='ironCyclone'&&Number(p.spinUntil??0)>Number(this.net.snapshot?.serverTime??0),visualAngle=ironSpinning?time*.022:Number(p.angle||0);
    let bodyX=x,bodyY=y,detailAngle=visualAngle;
    if(!ironSpinning&&attackProgress<1&&['ironCyclone','earthHammer','chainExecutioner','twinBlade'].includes(String(siegeHeroId))){
      const combo=(Math.max(1,attackSeq)-1)%3+1,startAngle=combo===1?-.95:combo===2?.95:siegeHeroId==='ironCyclone'?-1.25:siegeHeroId==='chainExecutioner'?-1.4:-.72,endAngle=combo===1?.72:combo===2?-.72:siegeHeroId==='ironCyclone'?1.7:siegeHeroId==='chainExecutioner'?1.4:.72,pose=attackProgress<.18?startAngle*(attackProgress/.18):attackProgress<.7?startAngle+(endAngle-startAngle)*((attackProgress-.18)/.52):endAngle*(1-(attackProgress-.7)/.3),lunge=Math.sin(clamp((attackProgress-.12)/.78,0,1)*Math.PI)*(combo===3?9:4);
      detailAngle+=pose;bodyX+=Math.cos(visualAngle)*lunge;bodyY+=Math.sin(visualAngle)*lunge;
    }
    if(ironSpinning){for(let ring=0;ring<3;ring++){const start=visualAngle+ring*Math.PI*2/3;g.lineStyle(8-ring*2,ring===1?0xe7b85d:0xd7dfe0,(.68-ring*.12)*alpha).beginPath().arc(x,y,28+ring*9,start,start+1.25).strokePath();}}
    g.fillStyle(bodyColor,concealAlpha*alpha).fillCircle(bodyX,bodyY,20*scale);
    if(siegeHeroId)this.drawCoreSiegeHeroDetails(g,siegeHeroId,bodyX,bodyY,detailAngle,scale,time,concealAlpha*alpha,attackProgress,attackSeq);
    const adhesiveStage=Number(p.werewolf?.adhesiveSlowStage??0),adhesiveSlowActive=adhesiveStage>0&&Number(p.werewolf?.adhesiveRecoveryUntil??0)>Number(this.net.snapshot?.serverTime??0);
    if(adhesiveSlowActive){const adhesivePulse=.5+.18*Math.sin(time*.012+Number(p.x||0)*.01),blobCount=4+adhesiveStage*3;g.lineStyle(3+adhesiveStage,0x72e58b,(.48+adhesivePulse*.28)*alpha).strokeEllipse(x,y+9,(46+adhesiveStage*5)*scale,(29+adhesiveStage*3)*scale);for(let i=0;i<blobCount;i++){const a=i/blobCount*Math.PI*2+time*.0014,r=17+(i%2)*5;g.fillStyle(0x38bd5c,(.34+adhesivePulse*.3)*alpha).fillCircle(x+Math.cos(a)*r,y+9+Math.sin(a)*r*.55,3+(i%3));}}
    this.drawCoreSiegeCombatStatus(g,p,x,y,time,alpha,28);
    if(p.inBush)g.lineStyle(3,p.bushRevealed?0xffd45a:0x7ddf7f,(p.id===this.net.sessionId ? .88 : .45)*alpha).strokeCircle(x,y,25*scale);
    if(hitPulse>0)g.lineStyle(4,0xff4c57,hitPulse*alpha).strokeCircle(x,y,27+8*(1-hitPulse));
    g.lineStyle(4,0xffffff,(p.id===this.net.sessionId?1:.38)*alpha).strokeCircle(x,y,20*scale);

    const reloadProgress=clamp(Number(p.reloadProgress??0),0,1);
    const heldAngle=p.reloading?visualAngle+Math.sin(reloadProgress*Math.PI)*.5:visualAngle;
    if(!['ironCyclone','earthHammer','chainExecutioner','twinBlade'].includes(String(siegeHeroId)))this.drawHeldItem(g,p.equipped as EquippedId,x,y,heldAngle,attackPulse,attackSeq,alpha);
    if(p.reloading){
      g.lineStyle(4,0x24323b,.95*alpha).strokeCircle(x,y-52,12);
      g.lineStyle(4,0xffd34f,alpha).beginPath().arc(x,y-52,12,-Math.PI/2,-Math.PI/2+Math.PI*2*reloadProgress,false).strokePath();
      g.fillStyle(0xffd34f,.95*alpha).fillTriangle(x-4,y-55,x+5,y-55,x,y-47);
    }

    this.drawPlayerHealthBar(g,p,x,y-37,hitPulse,alpha);
  }

  private drawChicken(g:Phaser.GameObjects.Graphics,p:any,x:number,y:number,time:number,alpha:number,hitPulse:number){
    const a=Number(p.angle||0),fx=Math.cos(a),fy=Math.sin(a),sx=-fy,sy=fx,idle=Math.sin(time*.018+String(p.id).length)*1.5;
    const attackSeq=Number(p.attackSeq??0),previous=this.lastAttackSeq.get(p.id);if(previous===undefined)this.lastAttackSeq.set(p.id,attackSeq);else if(previous!==attackSeq){this.lastAttackSeq.set(p.id,attackSeq);this.attackStartedAt.set(p.id,time);}
    const attackAge=time-(this.attackStartedAt.get(p.id)??-999),peck=attackAge<180?Math.sin(clamp(attackAge/180,0,1)*Math.PI)*13:0,bx=x+fx*peck,by=y+fy*peck+idle*.25;
    const pt=(forward:number,side:number)=>({x:bx+fx*forward+sx*side,y:by+fy*forward+sy*side});
    g.fillStyle(0x000000,.28*alpha).fillEllipse(bx-fx*5,by-fy*5+16,43,17);
    const tail=pt(-18,0),tailL=pt(-27,-8),tailR=pt(-27,8);g.fillStyle(0xf6e5a5,.98*alpha).fillTriangle(tail.x,tail.y,tailL.x,tailL.y,tailR.x,tailR.y);
    g.fillStyle(0xf4d35e,.98*alpha).fillEllipse(bx,by,38,33);g.lineStyle(3,p.id===this.net.sessionId?0xffffff:0xb88724,(p.id===this.net.sessionId?1:.7)*alpha).strokeEllipse(bx,by,38,33);
    for(const side of [-1,1]){const wing=pt(-1,side*13),tip=pt(-9,side*22);g.fillStyle(0xdba83e,.95*alpha).fillTriangle(pt(9,side*10).x,pt(9,side*10).y,wing.x,wing.y,tip.x,tip.y);}
    const head=pt(16,0);g.fillStyle(0xffec8a,.98*alpha).fillCircle(head.x,head.y,12);g.lineStyle(2,0xc58a24,.8*alpha).strokeCircle(head.x,head.y,12);
    const beak=pt(30,0),beakL=pt(21,-6),beakR=pt(21,6);g.fillStyle(0xff922b,.98*alpha).fillTriangle(beak.x,beak.y,beakL.x,beakL.y,beakR.x,beakR.y);
    const eye=pt(19,-5);g.fillStyle(0x17130d,.95*alpha).fillCircle(eye.x,eye.y,2.4);g.fillStyle(0xffffff,.9*alpha).fillCircle(eye.x+fx*.8,eye.y+fy*.8,1);
    const combA=pt(8,-3),combB=pt(12,0),combC=pt(8,4);g.fillStyle(0xe84b3c,.98*alpha).fillCircle(combA.x,combA.y,4).fillCircle(combB.x,combB.y,4.3).fillCircle(combC.x,combC.y,4);
    if(hitPulse>0)g.lineStyle(4,0xff4c57,hitPulse*alpha).strokeCircle(bx,by,29+8*(1-hitPulse));
    const serverTime=Number(this.net.snapshot?.serverTime??0),left=Math.max(0,Number(p.chickenUntil??0)-serverTime),ratio=clamp(left/CHICKEN_BLASTER_BALANCE.transformSeconds,0,1);g.fillStyle(0x11181d,.92*alpha).fillRect(bx-25,by-39,50,5);g.fillStyle(0xffd84a,alpha).fillRect(bx-25,by-39,50*ratio,5);this.drawCoreSiegeCombatStatus(g,p,bx,by,time,alpha,29);this.drawPlayerHealthBar(g,p,bx,by-32,hitPulse,alpha,50,4);
  }

  private drawHeldItem(g:Phaser.GameObjects.Graphics,id:EquippedId,x:number,y:number,a:number,pulse:number,seq:number,alpha=1){
    const pt=(forward:number,side:number)=>({x:x+Math.cos(a)*forward-Math.sin(a)*side,y:y+Math.sin(a)*forward+Math.cos(a)*side});
    if(id==='fists'){
      const side=seq%2===0?1:-1;
      for(const hand of [-1,1]){
        const extend=hand===side?22*pulse:0;
        const elbow=pt(14+extend*.35,hand*12);
        const fist=pt(24+extend,hand*12);
        g.lineStyle(6,0xf0b28d,alpha).lineBetween(elbow.x,elbow.y,fist.x,fist.y);
        g.fillStyle(0xffc39d,alpha).fillCircle(fist.x,fist.y,6);
      }
      return;
    }

    if(id in MELEE_WEAPONS){
      const swing=a-.7+1.4*pulse;
      const hand=pt(15,0);
      const length=id==='knife'?34:id==='pan'?45:54;
      const end={x:hand.x+Math.cos(swing)*length,y:hand.y+Math.sin(swing)*length};
      g.lineStyle(id==='bat'?9:id==='pipe'?7:5,id==='bat'?0xc98b55:id==='pipe'?0x9eb1bb:0xd9e4ea,alpha).lineBetween(hand.x,hand.y,end.x,end.y);
      if(id==='pan')g.fillStyle(0x9aaab4,alpha).fillCircle(end.x,end.y,13);
      if(id==='knife')g.fillStyle(0xe9f1f5,alpha).fillTriangle(end.x,end.y,end.x-Math.cos(swing-.55)*15,end.y-Math.sin(swing-.55)*15,end.x-Math.cos(swing+.55)*15,end.y-Math.sin(swing+.55)*15);
      return;
    }

    if(isThrowableType(id)){
      const hand=pt(22,0),color=THROWABLE_CONFIGS[id].color;g.fillStyle(color,alpha).fillCircle(hand.x,hand.y,8);g.lineStyle(2,0xffffff,.55*alpha).strokeCircle(hand.x,hand.y,8);return;
    }

    const recoil=4*pulse;
    const hand=pt(15-recoil,0);
    if(id==='pistol'){
      const muzzle=pt(40-recoil,0),grip=pt(23-recoil,9);
      g.lineStyle(7,0x222a31,alpha).lineBetween(hand.x,hand.y,muzzle.x,muzzle.y);
      g.lineStyle(6,0x39454d,alpha).lineBetween(pt(23-recoil,1).x,pt(23-recoil,1).y,grip.x,grip.y);
      g.fillStyle(0xffd451,alpha).fillCircle(muzzle.x,muzzle.y,3);
    }else if(id==='stun_gun'){
      const muzzle=pt(35-recoil,0),grip=pt(20-recoil,10),prongA=pt(46-recoil,-5),prongB=pt(46-recoil,5);
      g.lineStyle(8,0x1d3440,alpha).lineBetween(hand.x,hand.y,muzzle.x,muzzle.y);
      g.lineStyle(5,0x2b5666,alpha).lineBetween(pt(20-recoil,1).x,pt(20-recoil,1).y,grip.x,grip.y);
      g.lineStyle(3,0x7ce6ff,.9*alpha).lineBetween(muzzle.x,muzzle.y,prongA.x,prongA.y).lineBetween(muzzle.x,muzzle.y,prongB.x,prongB.y);
      g.fillStyle(0xbdf6ff,.88*alpha).fillCircle(muzzle.x,muzzle.y,3.5);
      if(pulse>0){for(const side of [-1,0,1]){const end=pt(58-recoil,side*9),mid=pt(51-recoil,side*5+Math.sin(seq+side)*4);g.lineStyle(2,0xbdf6ff,pulse*alpha).lineBetween(muzzle.x,muzzle.y,mid.x,mid.y).lineBetween(mid.x,mid.y,end.x,end.y);}}
    }else if(id==='chicken_blaster'){
      const rear=pt(-5-recoil,0),body=pt(22-recoil,0),muzzle=pt(48-recoil,0),grip=pt(20-recoil,13);g.lineStyle(12,0x5d4b2d,alpha).lineBetween(rear.x,rear.y,muzzle.x,muzzle.y);g.lineStyle(7,0xffd84a,alpha).lineBetween(pt(4-recoil,-6).x,pt(4-recoil,-6).y,pt(37-recoil,-6).x,pt(37-recoil,-6).y);g.fillStyle(0xfff7cf,.95*alpha).fillEllipse(body.x,body.y,18,13);g.lineStyle(3,0x3a3022,alpha).lineBetween(pt(20-recoil,4).x,pt(20-recoil,4).y,grip.x,grip.y);g.fillStyle(0xff9a2e,.95*alpha).fillTriangle(muzzle.x+9*Math.cos(a),muzzle.y+9*Math.sin(a),muzzle.x+5*Math.cos(a-.55),muzzle.y+5*Math.sin(a-.55),muzzle.x+5*Math.cos(a+.55),muzzle.y+5*Math.sin(a+.55));
    }else if(id==='smg'){
      const end=pt(46-recoil,0),stock=pt(7-recoil,0),mag=pt(29-recoil,11);
      g.lineStyle(10,0x303a42,alpha).lineBetween(stock.x,stock.y,end.x,end.y);
      g.lineStyle(7,0x1e252b,alpha).lineBetween(pt(28-recoil,2).x,pt(28-recoil,2).y,mag.x,mag.y);
      g.fillStyle(0xffb84d,alpha).fillCircle(end.x,end.y,3);
    }else if(id==='rifle'){
      const end=pt(58-recoil,0),stockTop=pt(4-recoil,-7),stockBottom=pt(4-recoil,7),stockBack=pt(-5-recoil,0),mag=pt(32-recoil,12);
      g.lineStyle(7,0x303940,alpha).lineBetween(hand.x,hand.y,end.x,end.y);
      g.lineStyle(5,0x4a3427,alpha).lineBetween(stockTop.x,stockTop.y,stockBack.x,stockBack.y).lineBetween(stockBack.x,stockBack.y,stockBottom.x,stockBottom.y);
      g.lineStyle(6,0x1c2429,alpha).lineBetween(pt(31-recoil,2).x,pt(31-recoil,2).y,mag.x,mag.y);
      g.fillStyle(0xff8f4d,alpha).fillCircle(end.x,end.y,3);
    }else if(id==='sniper'){
      const end=pt(72-recoil,0),stock=pt(-7-recoil,0),scopeA=pt(22-recoil,-5),scopeB=pt(38-recoil,-5);
      g.lineStyle(6,0x34434c,alpha).lineBetween(stock.x,stock.y,end.x,end.y);
      g.lineStyle(5,0x7a5b3f,alpha).lineBetween(pt(4-recoil,0).x,pt(4-recoil,0).y,pt(24-recoil,0).x,pt(24-recoil,0).y);
      g.lineStyle(5,0x111920,alpha).lineBetween(scopeA.x,scopeA.y,scopeB.x,scopeB.y);
      g.fillStyle(0xff4858,alpha).fillCircle(end.x,end.y,3.5);
    }else if(id==='railgun'){
      const rear=pt(-10-recoil,0),end=pt(70-recoil,0),coilA=pt(20-recoil,-7),coilB=pt(47-recoil,-7),grip=pt(28-recoil,13);g.lineStyle(11,0x263943,alpha).lineBetween(rear.x,rear.y,end.x,end.y);g.lineStyle(5,0x67e8ff,.9*alpha).lineBetween(coilA.x,coilA.y,coilB.x,coilB.y);g.lineStyle(5,0x16252c,alpha).lineBetween(pt(28-recoil,3).x,pt(28-recoil,3).y,grip.x,grip.y);g.fillStyle(0xc9f8ff,.95*alpha).fillCircle(end.x,end.y,4);g.lineStyle(2,0x67e8ff,.8*alpha).strokeCircle(end.x,end.y,7);
    }else if(id==='laser_cannon'){
      const rear=pt(-8-recoil,0),end=pt(64-recoil,0),core=pt(24-recoil,0),grip=pt(30-recoil,14);g.lineStyle(13,0x382842,alpha).lineBetween(rear.x,rear.y,end.x,end.y);g.lineStyle(6,0x6d3b78,alpha).lineBetween(pt(5-recoil,-7).x,pt(5-recoil,-7).y,pt(51-recoil,-7).x,pt(51-recoil,-7).y);g.fillStyle(0xf16dff,.85*alpha).fillCircle(core.x,core.y,8);g.fillStyle(0xffd9ff,.95*alpha).fillCircle(core.x,core.y,4);g.lineStyle(5,0x211927,alpha).lineBetween(pt(30-recoil,4).x,pt(30-recoil,4).y,grip.x,grip.y);g.lineStyle(3,0xf16dff,.9*alpha).strokeCircle(end.x,end.y,7);g.fillStyle(0xffffff,.95*alpha).fillCircle(end.x,end.y,3.5);
    }else if(id==='silver_crossbow'){
      const rear=pt(-8-recoil,0),front=pt(52-recoil,0),left=pt(25-recoil,-18),right=pt(25-recoil,18);
      g.lineStyle(6,0x5a4636,alpha).lineBetween(rear.x,rear.y,front.x,front.y);
      g.lineStyle(4,0xcbd6dc,alpha).lineBetween(left.x,left.y,front.x,front.y).lineBetween(front.x,front.y,right.x,right.y).lineBetween(right.x,right.y,left.x,left.y);
      g.fillStyle(0xeaf4f8,alpha).fillTriangle(front.x,front.y,front.x-Math.cos(a-.45)*11,front.y-Math.sin(a-.45)*11,front.x-Math.cos(a+.45)*11,front.y-Math.sin(a+.45)*11);
    }else if(id==='bazooka'){
      const rear=pt(-12-recoil,0),end=pt(66-recoil,0),grip=pt(22-recoil,12);g.lineStyle(12,0x4d6651,alpha).lineBetween(rear.x,rear.y,end.x,end.y);g.lineStyle(5,0x20282b,alpha).lineBetween(pt(20-recoil,3).x,pt(20-recoil,3).y,grip.x,grip.y);g.fillStyle(0x9de27d,alpha).fillCircle(end.x,end.y,5);g.fillStyle(0x2d3438,alpha).fillCircle(rear.x,rear.y,7);
    }else if(id==='adhesive_sprayer'){
      const body=pt(8-recoil,0),barrel=pt(46-recoil,0),nozzle=pt(61-recoil,0),tank=pt(2-recoil,14),grip=pt(24-recoil,13),hoseA=pt(9-recoil,8),hoseB=pt(34-recoil,5);
      g.lineStyle(12,0x245a35,alpha).lineBetween(body.x,body.y,barrel.x,barrel.y);g.lineStyle(7,0x55d86f,alpha).lineBetween(barrel.x,barrel.y,nozzle.x,nozzle.y);g.fillStyle(0x2f9e4d,alpha).fillCircle(tank.x,tank.y,11);g.lineStyle(3,0x173d24,alpha).strokeCircle(tank.x,tank.y,11);g.lineStyle(4,0x173d24,alpha).lineBetween(hoseA.x,hoseA.y,hoseB.x,hoseB.y);g.lineStyle(5,0x15331f,alpha).lineBetween(pt(24-recoil,3).x,pt(24-recoil,3).y,grip.x,grip.y);g.fillStyle(0x8cff9f,.9*alpha).fillTriangle(pt(62-recoil,-4).x,pt(62-recoil,-4).y,pt(70-recoil,0).x,pt(70-recoil,0).y,pt(62-recoil,4).x,pt(62-recoil,4).y);
    }else if(id==='flamethrower'){
      const flameBody=pt(8-recoil,0),flameBarrel=pt(46-recoil,0),flameNozzle=pt(61-recoil,0),flameTank=pt(2-recoil,14),flameGrip=pt(24-recoil,13),hoseA=pt(9-recoil,8),hoseB=pt(34-recoil,5);
      g.lineStyle(12,0x39454a,alpha).lineBetween(flameBody.x,flameBody.y,flameBarrel.x,flameBarrel.y);
      g.lineStyle(7,0xb9c3c9,alpha).lineBetween(flameBarrel.x,flameBarrel.y,flameNozzle.x,flameNozzle.y);
      g.fillStyle(0xb43e25,alpha).fillCircle(flameTank.x,flameTank.y,11);
      g.lineStyle(3,0x252d31,alpha).strokeCircle(flameTank.x,flameTank.y,11);
      g.lineStyle(4,0x252d31,alpha).lineBetween(hoseA.x,hoseA.y,hoseB.x,hoseB.y);
      g.lineStyle(5,0x20282b,alpha).lineBetween(pt(24-recoil,3).x,pt(24-recoil,3).y,flameGrip.x,flameGrip.y);
      g.fillStyle(0xffa13a,alpha).fillTriangle(pt(62-recoil,-5).x,pt(62-recoil,-5).y,pt(70-recoil,0).x,pt(70-recoil,0).y,pt(62-recoil,5).x,pt(62-recoil,5).y);
    }else if(id==='shotgun'){
      const endA=pt(58-recoil,-3),endB=pt(58-recoil,3),pump=pt(36-recoil,0);
      g.lineStyle(5,0x30383e,alpha).lineBetween(hand.x,hand.y,endA.x,endA.y).lineBetween(hand.x,hand.y,endB.x,endB.y);
      g.fillStyle(0x8b5b38,alpha).fillCircle(pump.x,pump.y,6);
      g.fillStyle(0xff6b55,alpha).fillCircle(endA.x,endA.y,3).fillCircle(endB.x,endB.y,3);
    }
  }

  private drawEscortDrones(g:Phaser.GameObjects.Graphics,p:any,x:number,y:number,time:number,alpha=1){
    const count=clamp(Math.floor(this.hunterDroneCountFor(p)),0,4);
    if(count<=0||!p.alive)return;
    const disabled=Number(p.empDisabledUntil??0)>Number(this.net.snapshot?.serverTime??0),droneAlpha=disabled ? .48 : 1;
    g.lineStyle(1.5,disabled?0x60717a:0x7bdcff,(disabled ? .08 : .14)*alpha).strokeEllipse(x,y-8,86,48);
    for(let i=0;i<count;i++){
      const a=(disabled?0:time*.0022)+i*Math.PI*2/count+Number(p.id?.length||0)*.17,r=40+(i%2)*6,dx=Math.cos(a)*r,dy=Math.sin(a)*r*.64,px=x+dx,py=y+dy-10,pulse=.55+.28*Math.sin(time*.014+i*1.7),tilt=Math.sin(a),visibleAlpha=alpha*droneAlpha;
      g.fillStyle(0x000000,.2*visibleAlpha).fillEllipse(px,py+11,25,8);
      g.lineStyle(4,disabled?0x647680:0x7bdcff,(.16+pulse*.18)*visibleAlpha).strokeCircle(px,py,18);
      g.lineStyle(2,disabled?0x9aa8ad:0xe9fbff,(.32+pulse*.3)*visibleAlpha).strokeCircle(px,py,11);
      g.fillStyle(0x18242d,.94*visibleAlpha).fillEllipse(px,py,22,14);
      g.fillStyle(0x2f3d48,.92*visibleAlpha).fillEllipse(px-2,py,13,10);
      g.lineStyle(3,disabled?0x657780:0x7bdcff,.72*visibleAlpha).lineBetween(px-18,py+tilt*3,px-9,py).lineBetween(px+9,py,px+18,py-tilt*3);
      g.fillStyle(disabled?0x51636b:0xbdf6ff,(.82+pulse*.18)*visibleAlpha).fillCircle(px+6,py-3,2.8).fillCircle(px+6,py+3,2.8);
      g.fillStyle(0xffffff,.55*visibleAlpha).fillCircle(px+8,py,1.4);
      if(disabled){const sparkAngle=time*.03+i;g.lineStyle(2,0x7ce6ff,.75*alpha).lineBetween(px+Math.cos(sparkAngle)*9,py+Math.sin(sparkAngle)*7,px+Math.cos(sparkAngle+.7)*15,py+Math.sin(sparkAngle+.7)*12);}
    }
  }

  private hunterDroneCountFor(p:any){
    const direct=Number(p?.hunterDroneCount);
    if(Number.isFinite(direct)&&direct>0)return direct;
    const tactical=this.net.snapshot?.tacticalInventories?.find((item:any)=>String(item.id??'')===String(p?.id??''));
    return Number(tactical?.hunterDroneCount??0);
  }

  private drawLootIcon(g:Phaser.GameObjects.Graphics,kind:LootKind,x:number,y:number,scale:number){
    const c=LOOT_COLORS[kind]??0xffffff;
    g.fillStyle(0x061018,.72).fillCircle(x,y,16*scale);
    g.lineStyle(2,c,1);
    const line=(x1:number,y1:number,x2:number,y2:number,w=3)=>{g.lineStyle(w,c,1).lineBetween(x+x1*scale,y+y1*scale,x+x2*scale,y+y2*scale);};
    if(kind==='pistol'){line(-8,-2,8,-2,4);line(1,0,1,8,4);g.fillStyle(c).fillCircle(x+9*scale,y-2*scale,2.5*scale);}
    else if(kind==='stun_gun'){line(-9,0,8,0,5);line(0,2,0,9,4);line(9,-5,15,-7,2);line(9,5,15,7,2);g.fillStyle(0xbdf6ff).fillCircle(x+9*scale,y,3*scale);}
    else if(kind==='chicken_blaster'){line(-13,0,13,0,7);line(0,3,0,11,4);g.fillStyle(0xfff7cf).fillEllipse(x,y,14*scale,10*scale);g.fillStyle(0xff9a2e).fillTriangle(x+20*scale,y,x+12*scale,y-5*scale,x+12*scale,y+5*scale);}
    else if(kind==='smg'){line(-10,0,10,0,6);line(1,2,1,10,4);line(-10,0,-14,5,3);g.fillStyle(c).fillCircle(x+11*scale,y,2.5*scale);}
    else if(kind==='rifle'){line(-13,0,13,0,4);line(-13,0,-18,-6,3);line(2,1,2,10,4);g.fillStyle(c).fillCircle(x+14*scale,y,2.5*scale);}
    else if(kind==='shotgun'){line(-14,-3,14,-3,3);line(-14,3,14,3,3);g.fillStyle(c).fillCircle(x+15*scale,y-3*scale,2).fillCircle(x+15*scale,y+3*scale,2);}
    else if(kind==='sniper'){line(-15,0,15,0,3);line(-5,-5,5,-5,3);line(-12,0,-16,6,3);g.fillStyle(c).fillCircle(x+16*scale,y,2.5*scale);}
    else if(kind==='railgun'){line(-16,0,16,0,7);line(-7,-6,7,-6,3);line(-2,3,-2,11,4);g.fillStyle(0xc9f8ff).fillCircle(x+17*scale,y,3.5*scale);g.lineStyle(2*scale,c,1).strokeCircle(x+17*scale,y,6*scale);}
    else if(kind==='laser_cannon'){line(-16,0,16,0,8);line(-10,-7,9,-7,3);line(-2,3,-2,11,4);g.fillStyle(c,.7).fillCircle(x,y,7*scale);g.fillStyle(0xffffff).fillCircle(x,y,3*scale);g.lineStyle(2*scale,c,1).strokeCircle(x+17*scale,y,6*scale);}
    else if(kind==='boomerang'){g.lineStyle(6*scale,c,1).beginPath().moveTo(x-14*scale,y-9*scale).lineTo(x,y).lineTo(x+14*scale,y-9*scale).strokePath();g.fillStyle(0xfff2a6).fillCircle(x,y,3*scale);}
    else if(kind==='rc_car'){g.fillStyle(0x29333a).fillRoundedRect(x-14*scale,y-8*scale,28*scale,16*scale,4*scale);g.fillStyle(c).fillRoundedRect(x-8*scale,y-6*scale,16*scale,10*scale,3*scale);for(const dx of [-10,10])for(const dy of [-9,9])g.fillStyle(0x10161a).fillCircle(x+dx*scale,y+dy*scale,3*scale);g.fillStyle(0xffd34f).fillCircle(x+8*scale,y,3*scale);}
    else if(kind==='bazooka'){line(-16,0,15,0,8);g.fillStyle(c).fillCircle(x+15*scale,y,5*scale);line(-3,2,-3,10,4); }
    else if(kind==='silver_crossbow'){line(-14,0,14,0,4);line(2,-12,14,0,3);line(14,0,2,12,3);line(2,-12,2,12,2);g.fillStyle(0xeaf4f8).fillTriangle(x+16*scale,y,x+9*scale,y-4*scale,x+9*scale,y+4*scale);}
    else if(kind==='adhesive_sprayer'){g.lineStyle(7*scale,0x245a35).lineBetween(x-14*scale,y+2*scale,x+9*scale,y-4*scale);g.fillStyle(0x2f9e4d).fillRoundedRect(x-13*scale,y-2*scale,13*scale,15*scale,3*scale);g.fillStyle(0x8cff9f,.9).fillTriangle(x+12*scale,y-8*scale,x+23*scale,y-3*scale,x+12*scale,y+2*scale);}
    else if(kind==='flamethrower'){line(-14,2,9,-4,7);g.fillStyle(0xb43e25).fillRoundedRect(x-13*scale,y-2*scale,13*scale,15*scale,3*scale);g.fillStyle(0xff9a39,.9).fillTriangle(x+12*scale,y-8*scale,x+23*scale,y-3*scale,x+12*scale,y+2*scale);}
    else if(kind==='hunter_drone'){g.fillStyle(0x26323a).fillEllipse(x,y,22*scale,14*scale);g.lineStyle(2*scale,0x7bdcff,1).strokeEllipse(x,y,27*scale,18*scale);g.fillStyle(0xe9fbff).fillCircle(x+6*scale,y-3*scale,2.5*scale).fillCircle(x+6*scale,y+3*scale,2.5*scale);}
    else if(kind==='spider_mine'){g.fillStyle(0x2b3034).fillEllipse(x,y,18*scale,13*scale);g.fillStyle(c).fillCircle(x+5*scale,y,3*scale);for(const side of [-1,1])for(const dy of [-6,0,6])line(-2,dy,side*14,dy+side*4,2);}
    else if(kind==='tank_key'){g.lineStyle(5*scale,c,1).strokeCircle(x-7*scale,y-3*scale,6*scale);line(-2,1,13,10,5);line(7,6,4,11,3);line(12,9,9,14,3);}
    else if(kind==='exo_head'||kind==='emp_exo_head'){g.fillStyle(0x303a42).fillRoundedRect(x-13*scale,y-10*scale,26*scale,20*scale,5*scale);g.fillStyle(c).fillRoundedRect(x-10*scale,y-8*scale,20*scale,14*scale,4*scale);g.lineStyle(3*scale,0x171f25).lineBetween(x-8*scale,y-1*scale,x+8*scale,y-1*scale);g.lineStyle(2*scale,kind==='emp_exo_head'?0x8ee8ff:0x35d9ff,.95).lineBetween(x-6*scale,y-2*scale,x+7*scale,y-2*scale);g.fillStyle(0x303a42).fillRect(x-3*scale,y-15*scale,6*scale,6*scale);}
    else if(kind==='exo_core'||kind==='emp_exo_core'){const accent=kind==='emp_exo_core'?0x8ee8ff:0x35d9ff;g.fillStyle(0x303a42).fillRoundedRect(x-15*scale,y-13*scale,30*scale,26*scale,7*scale);g.fillStyle(c).fillRoundedRect(x-11*scale,y-10*scale,22*scale,20*scale,6*scale);g.fillStyle(0x171f25).fillCircle(x,y,8*scale);g.fillStyle(accent,.3).fillCircle(x,y,7*scale);g.fillStyle(accent).fillCircle(x,y,4.5*scale);}
    else if(kind==='exo_limbs'||kind==='emp_exo_limbs'){g.fillStyle(0x303a42).fillRoundedRect(x-8*scale,y-8*scale,16*scale,16*scale,4*scale);for(const side of [-1,1]){g.lineStyle(7*scale,0x303a42).lineBetween(x+side*6*scale,y-3*scale,x+side*16*scale,y+7*scale);g.fillStyle(c).fillRoundedRect(x+(side<0?-20:-1)*scale,y+3*scale,9*scale,12*scale,3*scale);g.fillStyle(0x171f25).fillRect(x+(side<0?-17:12)*scale,y+14*scale,5*scale,6*scale);}g.fillStyle(kind==='emp_exo_limbs'?0x8ee8ff:0x35d9ff,.8).fillCircle(x,y,3*scale);}
    else if(isThrowableType(kind)){g.fillStyle(c).fillCircle(x,y,8*scale);g.lineStyle(2,0xffffff,.65).strokeCircle(x,y,8*scale);if(kind==='incendiaryGrenade')line(-3,-10,3,-15,2);else line(0,-8,5,-13,2);}
    else if(kind==='pistol_ammo'||kind==='standard_ammo'||kind==='shotgun_ammo'||kind==='rocket_ammo'||kind==='rail_slug'||kind==='laser_cell'||kind==='silver_bolt'){for(const dx of [-6,0,6]){line(dx,-7,dx,6,3);g.fillStyle(c).fillCircle(x+dx*scale,y-7*scale,2*scale);}}
    else if(kind==='chicken_capsule'){g.fillStyle(0xfff7cf).fillEllipse(x,y,18*scale,24*scale);g.lineStyle(2*scale,c,1).strokeEllipse(x,y,18*scale,24*scale);g.fillStyle(0xffb62d).fillCircle(x+2*scale,y+4*scale,3*scale);}
    else if(kind==='adhesive_charge'){g.fillStyle(c).fillRoundedRect(x-9*scale,y-12*scale,18*scale,24*scale,6*scale);g.lineStyle(2*scale,0xf4f6f7,.8).strokeRoundedRect(x-9*scale,y-12*scale,18*scale,24*scale,6*scale);}
    else if(kind==='strip_trap'){line(-15,0,15,0,6);for(const dx of [-10,-5,0,5,10])line(dx,-5,dx,5,1);}
    else if(kind==='fuel_ammo'){g.fillStyle(c).fillRoundedRect(x-9*scale,y-12*scale,18*scale,24*scale,3*scale);g.lineStyle(2*scale,0xffd27d,.8).strokeRoundedRect(x-9*scale,y-12*scale,18*scale,24*scale,3*scale);}
    else if(kind==='vest'){g.fillStyle(c).fillTriangle(x-10*scale,y-9*scale,x+10*scale,y-9*scale,x,y+12*scale);g.fillStyle(0x061018).fillCircle(x,y-2*scale,4*scale);}
    else if(kind==='bandage'){g.fillStyle(c).fillRoundedRect(x-11*scale,y-5*scale,22*scale,10*scale,4*scale);g.fillStyle(0xffffff).fillCircle(x,y,3*scale);}
    else if(kind==='medkit'){g.fillStyle(c).fillRoundedRect(x-11*scale,y-11*scale,22*scale,22*scale,4*scale);g.lineStyle(4,0xffffff,1).lineBetween(x-6*scale,y,x+6*scale,y).lineBetween(x,y-6*scale,x,y+6*scale);}
    else if(kind==='bat'){line(-11,8,11,-9,7);}
    else if(kind==='pipe'){line(-11,8,11,-9,5);g.fillStyle(c).fillCircle(x+11*scale,y-9*scale,3*scale);}
    else if(kind==='knife'){line(-10,8,2,-3,4);g.fillStyle(c).fillTriangle(x+2*scale,y-3*scale,x+13*scale,y-10*scale,x+7*scale,y+2*scale);}
    else if(kind==='pan'){line(-11,10,3,-4,4);g.fillStyle(c).fillCircle(x+8*scale,y-9*scale,8*scale);}
  }

  private updatePickupPrompt(){
    const s=this.net.snapshot,me=this.local();
    if(!s||!me||!me.alive||me.phase!=='landed'){this.pickupText.setVisible(false);return;}
    if(me.isSwimming){this.pickupText.setText('수영 중 · 공격과 상호작용 불가').setVisible(true);return;}
    if(me.isVaulting){this.pickupText.setText('창문 넘는 중').setVisible(true);return;}
    if(me.isDriving){this.pickupText.setVisible(false);return;}
    if(me.chickenTransformed){const left=Math.max(0,Number(me.chickenUntil??0)-Number(s.serverTime??0));this.pickupText.setText(`꼬꼬 변신 ${left.toFixed(1)}초 · 좌클릭 부리 공격 · 이동속도 +15%`).setVisible(true);return;}
    if(me.werewolf?.ritualizing){this.pickupText.setText('제단 의식 중 · E 유지').setVisible(true);return;}
    if(me.werewolf?.transformPreparing){this.pickupText.setText('늑대인간으로 변신 중...').setVisible(true);return;}
    if(me.werewolf?.transformed){this.pickupText.setText('좌클릭 물어뜯기 · 우클릭 사냥 질주').setVisible(true);return;}
    if(me.exoAssembling){this.pickupText.setText(`${me.exoKind==='emp'?'청색 EMP 로봇':'강철 엑소슈트'} 결합 중 · 이동 및 공격 잠금`).setVisible(true);return;}
    if(me.exoActive){
      const emp=me.exoKind==='emp',serverTime=Number(s.serverTime??0),disabledLeft=Math.max(0,Number(me.empDisabledUntil??0)-serverTime),maxHp=emp?EMP_EXO_SUIT_BALANCE.maxHp:EXO_SUIT_BALANCE.maxHp;
      if(emp){const cooldown=Math.max(0,Number(me.empPulseReadyAt??0)-serverTime);this.pickupText.setText(disabledLeft>0?`청색 EMP 로봇 정지 · ${disabledLeft.toFixed(1)}초`:`청색 EMP 로봇 ${Math.ceil(Number(me.exoHp||0))}/${maxHp} · 좌클릭 대기계 기관총 · 우클릭 EMP ${cooldown>0?`${cooldown.toFixed(1)}초`:'준비'}`).setVisible(true);}
      else this.pickupText.setText(disabledLeft>0?`강철 엑소슈트 정지 · ${disabledLeft.toFixed(1)}초`:`강철 엑소슈트 ${Math.ceil(Number(me.exoHp||0))}/${maxHp} · 좌클릭 폭발탄 · 우클릭 레이저`).setVisible(true);
      return;
    }
    const season=s.werewolfSeason;
    if(season?.curseDropActive&&Math.hypot(Number(season.curseDropX)-me.x,Number(season.curseDropY)-me.y)<=72){this.pickupText.setText('E  늑대 저주 획득').setVisible(true);return;}
    if(season?.altarPhase==='active'&&Math.hypot(Number(season.altarX)-me.x,Number(season.altarY)-me.y)<=WEREWOLF_BALANCE.ritualRadius+8){this.pickupText.setText('E 유지  늑대의 제단 의식').setVisible(true);return;}
    if(season?.armoryActive&&!season.armoryOpened&&Math.hypot(Number(season.armoryX)-me.x,Number(season.armoryY)-me.y)<=100){this.pickupText.setText('E  대비 무기고 열기').setVisible(true);return;}
    let nearestSupply:any;let supplyDistance=88*88;for(const drop of s.supplyDrops??[]){if(!drop.landed||drop.opened)continue;const dx=drop.x-me.x,dy=drop.y-me.y,d=dx*dx+dy*dy;if(d<supplyDistance){supplyDistance=d;nearestSupply=drop;}}if(nearestSupply){this.pickupText.setText('E  보급 상자 열기').setVisible(true);return;}
    let nearestMotorcycle:any;let motorcycleDistance=MOTORCYCLE_MOUNT_DISTANCE;
    for(const motorcycle of s.motorcycles??[]){if(motorcycle.driverId)continue;const extra=motorcycle.vehicleKind==='fusion_robot'?FUSION_ROBOT_BALANCE.collisionRadius-MOTORCYCLE_RADIUS:0,d=Math.hypot(motorcycle.x-me.x,motorcycle.y-me.y)-extra;if(d>=motorcycleDistance||!buildingSpacesInteractable(me,motorcycle))continue;motorcycleDistance=d;nearestMotorcycle=motorcycle;}
    if(nearestMotorcycle){const tank=nearestMotorcycle.vehicleKind==='tank',fusion=nearestMotorcycle.vehicleKind==='fusion_robot',hasKey=Number(me.tankKeyCount||0)>0,lockRemaining=Math.max(0,Number(nearestMotorcycle.mountLockedUntil||0)-Number(s.serverTime||0)),vehicleName=fusion?'합체 로봇':tank?'탱크':'오토바이';this.pickupText.setText(lockRemaining>0?`${vehicleName} 전기 잠금 · ${lockRemaining.toFixed(1)}초`:fusion?'E  합체 로봇 탑승':tank?(hasKey?'E  탱크 탑승 · 열쇠 보유':'탱크 잠김 · 탱크 열쇠 필요'):'E  오토바이 탑승').setVisible(true);return;}
    let nearest:any;let best=105*105;
    for(const l of s.loot){if(l.pickupLockedForPlayerId===me.id&&Number(s.serverTime||0)<Number(l.pickupLockedUntil||0))continue;const dx=l.x-me.x,dy=l.y-me.y,d=dx*dx+dy*dy;if(d>=best)continue;if(!spaceInteractionAllowed(me,l,this.mapConfig.portals))continue;best=d;nearest=l;}
    if(!nearest){
      if(me.werewolf?.hasCurse){this.pickupText.setText('F  늑대인간 변신').setVisible(true);return;}
      const fusionReady=[me.exoHeadCount,me.exoCoreCount,me.exoLimbsCount,me.empExoHeadCount,me.empExoCoreCount,me.empExoLimbsCount].every((count)=>Number(count)>0);
      if(fusionReady){this.pickupText.setText('V  합체 로봇 결합 · 영구 탈것 · 1~4 무기 전환').setVisible(true);return;}
      const vault=findPortalVaultCandidate(me.x,me.y,String(me.buildingId??''),Number(me.roomIndex??0),this.mapConfig.portals);
      if(vault){this.pickupText.setText('Space  창문 넘기').setVisible(true);return;}
      this.pickupText.setVisible(false);return;
    }
    const kind=nearest.kind as LootKind;
    const label=LOOT_LABELS[kind]??kind;
    const magazine=kind in WEAPONS&&kind!=='fists'&&Number(nearest.weaponMagazine)>=0?` · 탄창 ${Number(nearest.weaponMagazine)}`:'';
    const lines=[`E  획득 · ${label}${magazine}`,...this.itemComparison(me,kind,nearest)];
    this.pickupText.setText(lines.join('\n')).setVisible(true);
  }

  private itemComparison(me:any,kind:LootKind,loot?:any){
    if(isThrowableType(kind)){const current=isThrowableType(me.throwableType)?LOOT_LABELS[me.throwableType as LootKind]:'없음';return[me.throwableType===kind?`같은 종류 · ${Math.min(3,Number(me.throwableCount||0)+1)}/3`:`현재 투척물 ${current} · 교체`];}
    if(kind==='tank_key')return[Number(me.tankKeyCount||0)>0?'이미 탱크 열쇠 보유 중':'중앙 탱크 탑승 가능'];
    if(kind==='exo_head'||kind==='exo_core'||kind==='exo_limbs'){const owned=Number(kind==='exo_head'?me.exoHeadCount:kind==='exo_core'?me.exoCoreCount:me.exoLimbsCount)>0;return[owned?'이미 보유 중':'적색 3개는 Z · 적색+청색 6개는 V'];}
    if(kind==='emp_exo_head'||kind==='emp_exo_core'||kind==='emp_exo_limbs'){const owned=Number(kind==='emp_exo_head'?me.empExoHeadCount:kind==='emp_exo_core'?me.empExoCoreCount:me.empExoLimbsCount)>0;return[owned?'이미 보유 중':'청색 3개는 C · 적색+청색 6개는 V','합체 시 1~4 무기 전환'];}
    if(kind==='spider_mine')return[`스파이더 마인 · ${Math.min(SPIDER_MINE_BALANCE.maxCarry,Number(me.spiderMineCount||0)+Number(loot?.stackCount||1))}/${SPIDER_MINE_BALANCE.maxCarry}`,'X · 트랩도 보유 시 Shift+X'];
    if(kind==='hunter_drone')return[`호위 드론 · ${Math.min(4,this.hunterDroneCountFor(me)+Number(loot?.stackCount||1))}/4`,'공격 시 하나씩 출격'];
    if(kind in WEAPONS&&kind!=='fists'){
      const incoming=WEAPONS[kind as WeaponId]!;
      const currentId=!me.primary?'':!me.secondary?'':me.equipped===me.primary?me.primary:me.equipped===me.secondary?me.secondary:incoming.slot==='primary'?me.primary:me.secondary;
      if(!currentId)return['추천 · 빈 슬롯'];
      if(currentId===kind)return['보유 중'];
      const current=WEAPONS[currentId as WeaponId];
      if(!current)return['추천'];
      const arrows=(a:number,b:number,reverse=false)=>{
        const better=reverse?a<b:a>b;const equal=Math.abs(a-b)<.001;return equal?'=':better?'↑':'↓';
      };
      const power=`화력 ${arrows(incoming.damage*incoming.pellets,current.damage*current.pellets)}`;
      const range=`사거리 ${arrows(incoming.range,current.range)}`;
      const fire=`연사 ${arrows(incoming.fireInterval,current.fireInterval,true)}`;
      const score=incoming.damage*incoming.pellets+incoming.range*.025+1/incoming.fireInterval*3;
      const oldScore=current.damage*current.pellets+current.range*.025+1/current.fireInterval*3;
      return[`${score>oldScore*1.08?'추천 · ':''}현재: ${current.name}`,`${power}  ${range}  ${fire}`];
    }
    if(kind in MELEE_WEAPONS){
      const current=me.melee&&me.melee!=='fists'?MELEE_WEAPONS[me.melee as MeleeId]:undefined;
      if(!current)return['추천 · 현재: 주먹'];
      if(me.melee===kind)return['보유 중'];
      const incoming=MELEE_WEAPONS[kind as MeleeId]!;
      return[`현재: ${current.name}`,`화력 ${incoming.damage>current.damage?'↑':'↓'}  사거리 ${incoming.range>current.range?'↑':'↓'}  속도 ${incoming.fireInterval<current.fireInterval?'↑':'↓'}`];
    }
    if(kind==='vest')return[me.armor>0?`현재 조끼 ${Math.ceil(me.armor)}%`:'추천 · 조끼 없음'];
    if(kind==='bandage')return[`현재 보유 ${me.bandages??0}개`];
    if(kind==='medkit')return[`현재 보유 ${me.medkits??0}개`];
    if(kind==='pistol_ammo')return[`권총탄 보유 ${me.pistolAmmo??0}발`];
    if(kind==='standard_ammo')return[`일반 총알 보유 ${me.standardAmmo??0}발`];
    if(kind==='shotgun_ammo')return[`샷건탄 보유 ${me.shotgunAmmo??0}발`];
    if(kind==='rocket_ammo')return[`로켓탄 보유 ${me.rocketAmmo??0}발`];
    return[];
  }

  private drawMotorcycle(g:Phaser.GameObjects.Graphics,motorcycle:any,point:{x:number;y:number;rotation:number},time:number,serverTime:number){
    const x=point.x,y=point.y,rotation=point.rotation,occupied=Boolean(motorcycle.driverId);
    const localMobileTurret=mobileControls.active&&motorcycle.driverId===this.net.sessionId?this.localAimAngle:undefined;
    const pointAt=(forward:number,side:number)=>({x:x+Math.cos(rotation)*forward-Math.sin(rotation)*side,y:y+Math.sin(rotation)*forward+Math.cos(rotation)*side});
    const flash=motorcycle.exploding&&Math.floor(time/110)%2===0;
    const alpha=motorcycle.destroyed?clamp(1-(serverTime-Number(motorcycle.destroyedAt||serverTime))/(MOTORCYCLE_DESTRUCTION_BALANCE.destroyedFadeMs/1000),0,1):1;
    if(motorcycle.vehicleKind==='fusion_robot'){
      const turretRotation=localMobileTurret??(Number.isFinite(Number(motorcycle.turretAngle))?Number(motorcycle.turretAngle):rotation),aimAt=(forward:number,side:number)=>({x:x+Math.cos(turretRotation)*forward-Math.sin(turretRotation)*side,y:y+Math.sin(turretRotation)*forward+Math.cos(turretRotation)*side}),slot=Math.max(1,Math.min(4,Math.floor(Number(motorcycle.fusionWeaponSlot||1)))) as FusionRobotWeaponSlot;
      const lowerPoly=(points:Array<[number,number]>)=>points.map(([forward,side])=>{const p=pointAt(forward,side);return new Phaser.Math.Vector2(p.x,p.y);}),upperPoly=(points:Array<[number,number]>)=>points.map(([forward,side])=>{const p=aimAt(forward,side);return new Phaser.Math.Vector2(p.x,p.y);});
      const speedRatio=clamp(Math.abs(Number(motorcycle.speed||0))/(MOTORCYCLE_MAX_SPEED*FUSION_ROBOT_BALANCE.speedMultiplier),0,1),stride=Math.sin(time*.012)*5*speedRatio,energyPulse=.72+.22*Math.sin(time*.014),red=flash?0xffb06a:0xb53242,blue=flash?0xa9edff:0x287fc1,dark=0x111a21,steel=0x26343d;
      g.fillStyle(0x000000,.34*alpha).fillEllipse(x,y+27,148,74);
      const leftFoot=pointAt(-58+stride,-28),rightFoot=pointAt(-58-stride,28),leftHip=pointAt(-15,-13),rightHip=pointAt(-15,13),leftKnee=pointAt(-38+stride*.55,-22),rightKnee=pointAt(-38-stride*.55,22);
      g.lineStyle(22,dark,alpha).lineBetween(leftHip.x,leftHip.y,leftKnee.x,leftKnee.y).lineBetween(leftKnee.x,leftKnee.y,leftFoot.x,leftFoot.y).lineBetween(rightHip.x,rightHip.y,rightKnee.x,rightKnee.y).lineBetween(rightKnee.x,rightKnee.y,rightFoot.x,rightFoot.y);
      g.lineStyle(13,red,alpha).lineBetween(leftHip.x,leftHip.y,leftKnee.x,leftKnee.y).lineBetween(leftKnee.x,leftKnee.y,leftFoot.x,leftFoot.y);g.lineStyle(13,blue,alpha).lineBetween(rightHip.x,rightHip.y,rightKnee.x,rightKnee.y).lineBetween(rightKnee.x,rightKnee.y,rightFoot.x,rightFoot.y);
      g.fillStyle(dark,alpha).fillPoints(lowerPoly([[-68+stride,-39],[-50+stride,-42],[-43+stride,-25],[-61+stride,-18],[-73+stride,-27]]),true).fillPoints(lowerPoly([[-68-stride,39],[-50-stride,42],[-43-stride,25],[-61-stride,18],[-73-stride,27]]),true);
      const boosterGlow=.35+.28*speedRatio+.12*Math.sin(time*.026);for(const side of [-13,13]){const booster=pointAt(-45,side),flare=pointAt(-57-speedRatio*7,side);g.lineStyle(10,steel,alpha).lineBetween(pointAt(-28,side).x,pointAt(-28,side).y,booster.x,booster.y);g.fillStyle(0x65e7ff,boosterGlow*alpha).fillCircle(flare.x,flare.y,5+speedRatio*3);}
      g.fillStyle(dark,alpha).fillPoints(lowerPoly([[-31,-29],[-5,-36],[12,-22],[12,22],[-5,36],[-31,29],[-40,0]]),true);g.lineStyle(3,0x60717b,.8*alpha).strokePoints(lowerPoly([[-31,-29],[-5,-36],[12,-22],[12,22],[-5,36],[-31,29],[-40,0]]),true);
      const torso=upperPoly([[-29,-25],[-8,-40],[13,-56],[34,-50],[48,-31],[43,-8],[35,0],[43,8],[48,31],[34,50],[13,56],[-8,40],[-29,25],[-36,0]]),redArmor=upperPoly([[-29,0],[-29,-25],[-8,-40],[13,-56],[34,-50],[48,-31],[43,-8],[30,-3],[8,0]]),blueArmor=upperPoly([[-29,0],[-29,25],[-8,40],[13,56],[34,50],[48,31],[43,8],[30,3],[8,0]]);
      g.fillStyle(dark,alpha).fillPoints(torso,true);g.lineStyle(5,0x080d11,.95*alpha).strokePoints(torso,true);g.fillStyle(red,.98*alpha).fillPoints(redArmor,true);g.fillStyle(blue,.98*alpha).fillPoints(blueArmor,true);
      g.lineStyle(3,0xff7b72,.52*alpha).lineBetween(aimAt(-15,-24).x,aimAt(-15,-24).y,aimAt(28,-43).x,aimAt(28,-43).y);g.lineStyle(3,0x71d9ff,.58*alpha).lineBetween(aimAt(-15,24).x,aimAt(-15,24).y,aimAt(28,43).x,aimAt(28,43).y);
      const redShoulder=upperPoly([[-3,-38],[5,-59],[27,-63],[41,-50],[34,-34],[13,-32]]),blueShoulder=upperPoly([[-3,38],[5,59],[27,63],[41,50],[34,34],[13,32]]);g.fillStyle(0x7d202f,alpha).fillPoints(redShoulder,true);g.fillStyle(0x18598f,alpha).fillPoints(blueShoulder,true);g.lineStyle(3,dark,alpha).strokePoints(redShoulder,true).strokePoints(blueShoulder,true);
      const redElbow=aimAt(39,-48),redHand=aimAt(54,-39),blueElbow=aimAt(39,48),blueHand=aimAt(54,39);g.lineStyle(20,dark,alpha).lineBetween(aimAt(18,-45).x,aimAt(18,-45).y,redElbow.x,redElbow.y).lineBetween(redElbow.x,redElbow.y,redHand.x,redHand.y).lineBetween(aimAt(18,45).x,aimAt(18,45).y,blueElbow.x,blueElbow.y).lineBetween(blueElbow.x,blueElbow.y,blueHand.x,blueHand.y);g.lineStyle(11,red,alpha).lineBetween(aimAt(18,-45).x,aimAt(18,-45).y,redElbow.x,redElbow.y).lineBetween(redElbow.x,redElbow.y,redHand.x,redHand.y);g.lineStyle(11,blue,alpha).lineBetween(aimAt(18,45).x,aimAt(18,45).y,blueElbow.x,blueElbow.y).lineBetween(blueElbow.x,blueElbow.y,blueHand.x,blueHand.y);
      const missilePod=upperPoly([[-1,-61],[28,-65],[36,-52],[27,-43],[-3,-47]]);g.fillStyle(0x4c1720,alpha).fillPoints(missilePod,true);for(const [forward,side] of [[8,-57],[18,-58],[28,-56]] as Array<[number,number]>){const missile=aimAt(forward,side);g.fillStyle(0xffbd4b,.96*alpha).fillCircle(missile.x,missile.y,4);}
      const laserBase=aimAt(46,-39),laserTip=aimAt(78,-39);g.lineStyle(12,dark,alpha).lineBetween(laserBase.x,laserBase.y,laserTip.x,laserTip.y);g.lineStyle(5,0xffd45a,alpha).lineBetween(aimAt(53,-39).x,aimAt(53,-39).y,laserTip.x,laserTip.y);
      const gunBase=aimAt(48,39);for(const side of [34,39,44]){const tip=aimAt(77,side);g.lineStyle(6,dark,alpha).lineBetween(gunBase.x,gunBase.y,tip.x,tip.y);g.lineStyle(2,0x8cecff,alpha).lineBetween(aimAt(56,side).x,aimAt(56,side).y,tip.x,tip.y);}
      const empCoil=aimAt(-5,46);g.fillStyle(0x102b43,alpha).fillCircle(empCoil.x,empCoil.y,13);g.lineStyle(4,0x62dfff,(.52+energyPulse*.4)*alpha).strokeCircle(empCoil.x,empCoil.y,10).strokeCircle(empCoil.x,empCoil.y,15);
      const coreShape=upperPoly([[-12,-14],[7,-17],[20,-9],[24,0],[20,9],[7,17],[-12,14],[-19,0]]),core=aimAt(4,0);g.fillStyle(steel,alpha).fillPoints(coreShape,true);g.lineStyle(4,0x9bb5c1,.9*alpha).strokePoints(coreShape,true);g.fillStyle(slot<=2?0xff766c:0x67e1ff,.13*alpha).fillCircle(core.x,core.y,17);g.fillStyle(slot<=2?0xff766c:0x67e1ff,energyPulse*alpha).fillCircle(core.x,core.y,8);g.fillStyle(0xe9fdff,.92*alpha).fillCircle(core.x+Math.cos(turretRotation)*2,core.y+Math.sin(turretRotation)*2,3);
      const head=upperPoly([[20,-15],[39,-12],[50,0],[39,12],[20,15],[13,0]]);g.fillStyle(0x202c34,alpha).fillPoints(head,true);g.lineStyle(4,0x0b1116,alpha).strokePoints(head,true);const visorA=aimAt(38,-8),visorB=aimAt(38,8);g.lineStyle(6,occupied?0x8ff3ff:0x426b79,.96*alpha).lineBetween(visorA.x,visorA.y,visorB.x,visorB.y);g.lineStyle(2,0xeaffff,.82*alpha).lineBetween(aimAt(41,-6).x,aimAt(41,-6).y,aimAt(41,6).x,aimAt(41,6).y);
      const antennaBase=aimAt(24,-14),antennaTip=aimAt(19,-29);g.lineStyle(3,0x8fa5af,alpha).lineBetween(antennaBase.x,antennaBase.y,antennaTip.x,antennaTip.y);g.fillStyle(0x6ee8ff,.9*alpha).fillCircle(antennaTip.x,antennaTip.y,3);
      const slotColors=[0xff655d,0xffd45a,0x75dfff,0x4fa9ff],hardpoints=[aimAt(17,-57),laserTip,aimAt(77,39),empCoil],active=hardpoints[slot-1]!,activeColor=slotColors[slot-1]!,activePulse=.58+.36*Math.sin(time*.022);g.fillStyle(activeColor,.10*alpha).fillCircle(active.x,active.y,22);g.lineStyle(3,activeColor,activePulse*alpha).strokeCircle(active.x,active.y,16+Math.sin(time*.018)*2);
      if(motorcycle.critical||motorcycle.exploding){const smoke=.28+.14*Math.sin(time*.009);for(const offset of [-18,4,22]){const vent=aimAt(-22,offset);g.fillStyle(0x69747a,smoke*alpha).fillCircle(vent.x,vent.y-15-(offset%3)*2,7+Math.abs(offset%4));}}
      if(Number(motorcycle.slowUntil||0)>serverTime){const slowKind=String(motorcycle.slowKind||''),pulse=.42+.18*Math.sin(time*.018);if(slowKind==='adhesive'||slowKind==='mixed')for(let i=0;i<14;i++){const a=i/14*Math.PI*2+time*.0012,r=48+(i%3)*9;g.fillStyle(0x55d86f,.38*alpha).fillCircle(x+Math.cos(a)*r,y+Math.sin(a)*r*.75,4+(i%3));}if(slowKind==='strip_trap'||slowKind==='stun'||slowKind==='mixed')g.lineStyle(4,0x7ce6ff,(.45+pulse*.4)*alpha).strokeCircle(x,y,70+Math.sin(time*.02)*4);if(slowKind==='werewolf_hunt'||slowKind==='mixed'){g.lineStyle(4,0xff5064,(.58+pulse*.42)*alpha).strokeCircle(x,y,82+Math.sin(time*.02)*4);for(const side of [-28,0,28]){const start=aimAt(-34,side+12),end=aimAt(34,side-12);g.lineStyle(6,0x5c101b,.62*alpha).lineBetween(start.x,start.y,end.x,end.y);g.lineStyle(2,0xff8a98,.92*alpha).lineBetween(start.x,start.y,end.x,end.y);}}}
      if(motorcycle.exploding){const remaining=Math.max(0,Number(motorcycle.explosionAt||serverTime)-serverTime),urgency=clamp(1-remaining/(MOTORCYCLE_DESTRUCTION_BALANCE.explosionFuseMs/1000),0,1);g.lineStyle(4,0xff6f55,(.14+urgency*.38)*alpha).strokeCircle(x,y,MOTORCYCLE_DESTRUCTION_BALANCE.explosionRadius);}
      this.drawEmpDisabledEffect(g,x,y,76,time,serverTime,Number(motorcycle.empDisabledUntil??0),alpha);this.drawVehicleDamageHud(g,motorcycle,x,y,serverTime,alpha,80);return;
    }
    if(motorcycle.vehicleKind==='tank'){
      const turretRotation=localMobileTurret??(Number.isFinite(Number(motorcycle.turretAngle))?Number(motorcycle.turretAngle):rotation);
      const turretPointAt=(forward:number,side:number)=>({x:x+Math.cos(turretRotation)*forward-Math.sin(turretRotation)*side,y:y+Math.sin(turretRotation)*forward+Math.cos(turretRotation)*side});
      const corners=[pointAt(-36,-24),pointAt(30,-24),pointAt(42,-12),pointAt(42,12),pointAt(30,24),pointAt(-36,24),pointAt(-44,12),pointAt(-44,-12)].map((p)=>new Phaser.Math.Vector2(p.x,p.y));
      const barrelA=turretPointAt(8,0),barrelB=turretPointAt(66,0),turret=pointAt(0,0);
      g.fillStyle(0x000000,.28*alpha).fillEllipse(x,y+18,96,38);
      g.lineStyle(9,0x151a18,alpha).lineBetween(pointAt(-36,-29).x,pointAt(-36,-29).y,pointAt(34,-29).x,pointAt(34,-29).y).lineBetween(pointAt(-36,29).x,pointAt(-36,29).y,pointAt(34,29).x,pointAt(34,29).y);
      for(const side of [-28,28])for(let f=-30;f<=28;f+=14){const p=pointAt(f,side);g.fillStyle(0x4a5148,.9*alpha).fillCircle(p.x,p.y,4);}
      g.fillStyle(flash?0xffe087:0x4f6045,.98*alpha).fillPoints(corners,true);
      g.lineStyle(3,0x1d241e,.9*alpha).strokePoints(corners,true);
      g.lineStyle(12,0x303a32,alpha).lineBetween(barrelA.x,barrelA.y,barrelB.x,barrelB.y);
      g.lineStyle(4,0x111714,alpha).lineBetween(barrelA.x,barrelA.y,barrelB.x,barrelB.y);
      g.fillStyle(0x65785a,alpha).fillCircle(turret.x,turret.y,20);
      g.lineStyle(3,0x20271f,alpha).strokeCircle(turret.x,turret.y,20);
      const sight=turretPointAt(18,-10);g.fillStyle(occupied?0xffc247:0x8ba17d,.95*alpha).fillCircle(sight.x,sight.y,4);
      if(Number(motorcycle.slowUntil||0)>serverTime){
        const slowKind=String(motorcycle.slowKind||''),pulse=.42+.18*Math.sin(time*.018);
        if(slowKind==='adhesive'||slowKind==='mixed'){for(let i=0;i<10;i++){const a=i/10*Math.PI*2+time*.0012,r=24+(i%3)*7;g.fillStyle(0x55d86f,.40*alpha).fillCircle(x+Math.cos(a)*r,y+Math.sin(a)*r*.72,4+(i%3));}}
        if(slowKind==='strip_trap'||slowKind==='stun'||slowKind==='mixed'){g.lineStyle(4,0x7ce6ff,(.48+pulse*.42)*alpha).strokeCircle(x,y,46+Math.sin(time*.02)*4);for(let i=0;i<6;i++){const a=time*.014+i*Math.PI/3,r=28+(i%2)*13;g.lineStyle(3,i%2?0xeaffff:0x7ce6ff,(.44+pulse*.35)*alpha).lineBetween(x+Math.cos(a)*r,y+Math.sin(a)*r,x+Math.cos(a+.62)*(r+15),y+Math.sin(a+.62)*(r+15));}}
      }
      this.drawEmpDisabledEffect(g,x,y,52,time,serverTime,Number(motorcycle.empDisabledUntil??0),alpha);
      this.drawVehicleDamageHud(g,motorcycle,x,y,serverTime,alpha,42);
      return;
    }
    const rear=pointAt(-19,0),front=pointAt(22,0),bodyA=pointAt(-10,-7),bodyB=pointAt(13,7),handleA=pointAt(13,-13),handleB=pointAt(13,13);
    g.lineStyle(8,0x171b20,alpha).lineBetween(rear.x,rear.y,front.x,front.y);
    g.fillStyle(0x0d1115,alpha).fillCircle(rear.x,rear.y,10).fillCircle(front.x,front.y,10);
    g.lineStyle(4,0x8897a2,alpha).lineBetween(bodyA.x,bodyA.y,bodyB.x,bodyB.y);
    g.lineStyle(3,0xbcc8ce,alpha).lineBetween(handleA.x,handleA.y,handleB.x,handleB.y);
    const center=pointAt(0,0);g.fillStyle(flash?0xfff1a6:occupied?0xffc247:0xe34b4f,alpha).fillRoundedRect(center.x-15,center.y-8,30,16,5);
    const light=pointAt(29,0);g.fillStyle(0xfff0a6,.95*alpha).fillCircle(light.x,light.y,4);
    this.drawVehicleDamageHud(g,motorcycle,x,y,serverTime,alpha,38);
    if(motorcycle.exploding){
      const remaining=Math.max(0,Number(motorcycle.explosionAt||serverTime)-serverTime);
      const urgency=clamp(1-remaining/(MOTORCYCLE_DESTRUCTION_BALANCE.explosionFuseMs/1000),0,1);
      g.lineStyle(2,0xff6f55,(.10+urgency*.24)*alpha).strokeCircle(x,y,MOTORCYCLE_DESTRUCTION_BALANCE.explosionRadius);
    }
    if(Number(motorcycle.slowUntil||0)>serverTime){
      const slowKind=String(motorcycle.slowKind||''),pulse=.36+.12*Math.sin(time*.014);
      if(slowKind==='adhesive'||slowKind==='mixed'){for(let i=0;i<7;i++){const a=i/7*Math.PI*2+time*.001,r=16+(i%2)*6;g.fillStyle(0x55d86f,.40*alpha).fillCircle(x+Math.cos(a)*r,y+Math.sin(a)*r,3+(i%3));}}
      if(slowKind==='strip_trap'||slowKind==='mixed'){g.lineStyle(3,0xc6c9cb,pulse*alpha).lineBetween(rear.x-4,rear.y-5,rear.x+4,rear.y+5).lineBetween(front.x-4,front.y-5,front.x+4,front.y+5);}
      if(slowKind==='stun'||slowKind==='mixed'){for(let i=0;i<4;i++){const a=time*.018+i*Math.PI/2,r=18+(i%2)*7;g.lineStyle(2,0x7ce6ff,(.45+pulse*.35)*alpha).lineBetween(x+Math.cos(a)*r,y+Math.sin(a)*r,x+Math.cos(a+.45)*(r+8),y+Math.sin(a+.45)*(r+8));}}
      if(slowKind==='werewolf_hunt'||slowKind==='mixed'||(motorcycle.huntMarkedBy&&Number(motorcycle.huntMarkUntil||0)>serverTime)){
        g.lineStyle(3,0xff4f5f,(.42+.22*Math.sin(time*.018))*alpha).strokeCircle(x,y,25);
        g.lineBetween(x-10,y-14,x-3,y+7).lineBetween(x,y-17,x+5,y+7).lineBetween(x+10,y-14,x+13,y+5);
      }
    }
    if(motorcycle.critical||motorcycle.exploding){
      const pulse=.35+.25*Math.sin(time*.012);
      g.fillStyle(0x4d5559,pulse*alpha).fillCircle(x-8,y-22,7).fillCircle(x+2,y-29,9).fillCircle(x+9,y-38,6);
    }
    this.drawEmpDisabledEffect(g,x,y,31,time,serverTime,Number(motorcycle.empDisabledUntil??0),alpha);
  }

  private drawEmpPulseVisual(g:Phaser.GameObjects.Graphics,pulse:EmpPulseVisual,time:number){
    const age=Math.max(0,time-pulse.born),fieldFade=clamp((pulse.until-time)/850,0,1),fieldAlpha=clamp(age/180,0,1)*fieldFade,rotation=time*.00028;
    g.fillStyle(0x168fd7,.026*fieldAlpha).fillCircle(pulse.x,pulse.y,pulse.radius);
    for(let ringIndex=0;ringIndex<3;ringIndex++){
      const ringRadius=pulse.radius*(.34+ringIndex*.25),direction=ringIndex%2===0?1:-1,segments=18;
      for(let segment=0;segment<segments;segment++){
        const start=rotation*direction+segment/segments*Math.PI*2,end=start+Math.PI*2/segments*.58;
        g.lineStyle(ringIndex===1?3:2,ringIndex===2?0x8fe8ff:0x2aaeff,(.12+ringIndex*.045)*fieldAlpha).lineBetween(pulse.x+Math.cos(start)*ringRadius,pulse.y+Math.sin(start)*ringRadius,pulse.x+Math.cos(end)*ringRadius,pulse.y+Math.sin(end)*ringRadius);
      }
    }
    for(let index=0;index<10;index++){
      const angle=index/10*Math.PI*2-rotation*.7,start=pulse.radius*(.13+(index%2)*.08),end=pulse.radius*(.68+(index%3)*.075);
      g.lineStyle(index%3===0?3:2,index%2?0x37b7ff:0x83e5ff,(.09+(index%3)*.025)*fieldAlpha).lineBetween(pulse.x+Math.cos(angle)*start,pulse.y+Math.sin(angle)*start,pulse.x+Math.cos(angle)*end,pulse.y+Math.sin(angle)*end);
      const nodeX=pulse.x+Math.cos(angle)*end,nodeY=pulse.y+Math.sin(angle)*end;g.fillStyle(index%2?0x4fc4ff:0xc4f5ff,.28*fieldAlpha).fillCircle(nodeX,nodeY,3+(index%2));
    }
    const shockProgress=clamp(age/Math.max(1,pulse.shockUntil-pulse.born),0,1),shockAlpha=1-shockProgress,wave=pulse.radius*(1-Math.pow(1-shockProgress,3));
    if(shockAlpha>0){
      g.fillStyle(0x148cff,.05*shockAlpha).fillCircle(pulse.x,pulse.y,wave);g.lineStyle(14,0x159dff,.11*shockAlpha).strokeCircle(pulse.x,pulse.y,wave);g.lineStyle(5,0x83e5ff,.88*shockAlpha).strokeCircle(pulse.x,pulse.y,wave);g.lineStyle(2,0xeaffff,.72*shockAlpha).strokeCircle(pulse.x,pulse.y,wave*.74);
    }
    const corePulse=.68+.28*Math.sin(time*.028);g.fillStyle(0x113e64,.35*fieldAlpha).fillCircle(pulse.x,pulse.y,29+corePulse*7);g.lineStyle(4,0x6ddcff,corePulse*fieldAlpha).strokeCircle(pulse.x,pulse.y,22+corePulse*5);g.fillStyle(0xe7fbff,.82*fieldAlpha).fillCircle(pulse.x,pulse.y,7);
    const arrestAlpha=clamp(1-age/1650,0,1);
    for(let index=0;index<pulse.affectedTargets.length;index++){
      const target=pulse.affectedTargets[index]!,vehicle=this.displayMotorcycles.get(target.id)??this.net.snapshot?.motorcycles?.find((item:any)=>item.id===target.id),player=this.framePositions.get(target.id)??this.net.snapshot?.players?.find((item:any)=>item.id===target.id),point=vehicle??player??target,x=Number(point.x),y=Number(point.y);
      if(!Number.isFinite(x)||!Number.isFinite(y))continue;
      if(shockAlpha>0){const dx=x-pulse.x,dy=y-pulse.y,length=Math.hypot(dx,dy)||1,normalX=-dy/length,normalY=dx/length,bend=Math.sin(time*.032+index*2.7)*13,midX=(pulse.x+x)*.5+normalX*bend,midY=(pulse.y+y)*.5+normalY*bend;g.lineStyle(5,0x159dff,.09*shockAlpha).lineBetween(pulse.x,pulse.y,midX,midY).lineBetween(midX,midY,x,y);g.lineStyle(2,0xcaf7ff,.56*shockAlpha).lineBetween(pulse.x,pulse.y,midX,midY).lineBetween(midX,midY,x,y);}
      if(arrestAlpha<=0)continue;
      const speed=Math.hypot(target.velocityX,target.velocityY);
      if(speed>8){const directionX=target.velocityX/speed,directionY=target.velocityY/speed,trailLength=clamp(speed*.18,24,105);g.lineStyle(7,0x3ebdff,.16*arrestAlpha).lineBetween(x-directionX*trailLength,y-directionY*trailLength,x,y);for(let step=1;step<=4;step++){const ratio=step/4,ghostAlpha=(1-ratio*.72)*arrestAlpha;g.fillStyle(0x73dcff,.08*ghostAlpha).fillCircle(x-directionX*trailLength*ratio,y-directionY*trailLength*ratio,12-step);}}
      const lockProgress=1-Math.pow(1-clamp(age/700,0,1),3),lockRadius=52-25*lockProgress;g.lineStyle(3,0xd9fbff,.72*arrestAlpha).strokeCircle(x,y,lockRadius);
      for(let side=0;side<4;side++){const angle=side*Math.PI/2,cos=Math.cos(angle),sin=Math.sin(angle),inner=lockRadius-7,outer=lockRadius+8,barX=x+cos*inner,barY=y+sin*inner;g.lineStyle(4,side%2?0x59caff:0xaeefff,.78*arrestAlpha).lineBetween(x+cos*outer,y+sin*outer,barX,barY).lineBetween(barX-sin*8,barY+cos*8,barX+sin*8,barY-cos*8);}
    }
  }

  private drawEmpDisabledEffect(g:Phaser.GameObjects.Graphics,x:number,y:number,radius:number,time:number,serverTime:number,disabledUntil:number,alpha:number){
    if(disabledUntil<=serverTime)return;const pulse=.55+.35*Math.sin(time*.04);g.fillStyle(0x0c7fc4,.08*alpha).fillCircle(x,y,radius+8);g.lineStyle(4,0x6edcff,pulse*alpha).strokeCircle(x,y,radius+Math.sin(time*.026)*3);for(let index=0;index<6;index++){const angle=time*.017+index*Math.PI/3,r=radius*(.55+(index%2)*.25),end=r+9+(index%3)*4;g.lineStyle(3,index%2?0xeaffff:0x46bdff,(.42+.32*pulse)*alpha).lineBetween(x+Math.cos(angle)*r,y+Math.sin(angle)*r,x+Math.cos(angle+.52)*end,y+Math.sin(angle+.52)*end);}
  }

  private drawVehicleDamageHud(g:Phaser.GameObjects.Graphics,motorcycle:any,x:number,y:number,serverTime:number,alpha:number,offsetY:number){
    const hp=Math.max(0,Number(motorcycle.hp??0)),maxHp=Math.max(1,Number(motorcycle.maxHp??180)),ratio=clamp(hp/maxHp,0,1);
    const recentlyDamaged=serverTime-Number(motorcycle.lastDamagedAt||-99)<1.8;
    if(recentlyDamaged||motorcycle.critical||motorcycle.exploding){
      g.fillStyle(0x071018,.88*alpha).fillRoundedRect(x-30,y-offsetY,60,8,3);
      g.fillStyle(ratio<=.3?0xff6f77:ratio<=.6?0xffc247:0x5fe29a,.95*alpha).fillRoundedRect(x-28,y-offsetY+2,56*ratio,4,2);
    }
  }

  private drawExplosion(g:Phaser.GameObjects.Graphics,explosion:any,serverTime:number){
    const duration=Math.max(.1,Number(explosion.duration||.8)),progress=clamp((serverTime-Number(explosion.startedAt||serverTime))/duration,0,1),radius=Number(explosion.radius||150);
    const wave=radius*(.18+.82*progress),alpha=1-progress,spider=explosion.kind==='spiderMine',siegeGrenade=explosion.kind==='coreSiegeGrenade';
    g.fillStyle(spider?0xff5c4d:siegeGrenade?0xff623d:0xffa338,(siegeGrenade ? .42 : .34)*alpha).fillCircle(explosion.x,explosion.y,wave*.7);
    g.lineStyle(siegeGrenade?10:7,spider?0x9eeeff:siegeGrenade?0xfff0ad:0xffe28a,.85*alpha).strokeCircle(explosion.x,explosion.y,wave);
    g.lineStyle(siegeGrenade?5:3,spider?0xff4f58:0xff7048,.55*alpha).strokeCircle(explosion.x,explosion.y,wave*.72);
    const particles=siegeGrenade?10:6;
    for(let index=0;index<particles;index++){const angle=index/particles*Math.PI*2+progress;const distanceOut=wave*(.35+(index%3)*.14);g.fillStyle(spider?(index%2?0x7ce6ff:0xff6257):(index%2?0xffd066:0xff6c3d),.72*alpha).fillCircle(explosion.x+Math.cos(angle)*distanceOut,explosion.y+Math.sin(angle)*distanceOut,(siegeGrenade?10:8)+index%3*3);}
  }

  private receiveAudioEvent(payload:AudioEventMessage){
    const type=String(payload?.type??''),local=payload.sourceId===this.net.sessionId,eventId=String(payload.id??'');
    const localMap:Record<string,SoundId>={weapon_dry_fire:'weapon_dry_fire',reload_start:'reload_start',reload_complete:'reload_complete',heal_start:'heal_start',heal_complete:'heal_complete',hit_confirm:'hit_confirm',kill_confirm:'kill_confirm',throwable_select:'throwable_select',throwable_prepare:'throwable_prepare',throwable_pickup:'throwable_pickup',throwable_swap:'throwable_swap'};
    if(type==='weapon_fire'){
      const sound=soundIdForWeapon(String(payload.variant??''));if(!sound)return;
      if(local)audio.playLocal(sound,1,eventId);else this.playWorldAudio(sound,payload,undefined,eventId);return;
    }
    if(type==='chicken_transform'||type==='chicken_recover'||type==='chicken_peck'){const sound=type as SoundId;if(local)audio.playLocal(sound,1,eventId);else this.playWorldAudio(sound,payload,undefined,eventId);return;}
    const localSound=localMap[type];if(localSound&&local){audio.playLocal(localSound,1,eventId);return;}if(type==='exo_assembly'||type==='exo_activate'||type==='emp_pulse'||type==='laser_charge'){const sound=type as SoundId;if(local)audio.playLocal(sound,1,eventId);else this.playWorldAudio(sound,payload,undefined,eventId);return;}
    const worldMap:Record<string,SoundId>={strip_trap_place:'strip_trap_place',strip_trap_trigger:'strip_trap_trigger',strip_trap_break:'strip_trap_break',werewolf_altar_wake:'werewolf_altar_wake',werewolf_transform:'werewolf_transform',werewolf_claw:'werewolf_claw',reload_start:'reload_start',reload_complete:'reload_complete',heal_start:'heal_start',heal_complete:'heal_complete',impact_wall:'impact_wall',impact_ground:'impact_ground',impact_frame:'impact_frame',impact_vehicle:'impact_vehicle',impact_player:'impact_player',motorcycle_collision:'motorcycle_collision',motorcycle_hit:'motorcycle_hit',motorcycle_critical:'motorcycle_critical',throwable_throw:'throwable_throw',throwable_bounce:'throwable_bounce',frag_explosion:'frag_explosion',bazooka_explosion:'bazooka_explosion',smoke_deploy:'smoke_deploy',fire_ignite:'fire_ignite',water_enter:'water_enter',water_exit:'water_exit',water_steam:'water_steam',water_extinguish:'water_extinguish',supply_incoming:'supply_incoming',supply_land:'supply_land',supply_open:'supply_open'};
    const worldSound=worldMap[type];if(worldSound)this.playWorldAudio(worldSound,payload,undefined,eventId);
  }

  private playWorldAudio(soundId:SoundId,payload:{x?:number;y?:number;buildingId?:string;sourceId?:string;id?:string},maxDistance?:number,eventId=''){
    const x=Number(payload.x),y=Number(payload.y),viewer=this.viewerPlayer;
    if(!Number.isFinite(x)||!Number.isFinite(y)||!viewer)return;
    const sourceBuilding=String(payload.buildingId??buildingIdAt(x,y,0,this.mapConfig.buildingVisibilityZones));
    const occlusion=soundOcclusionBetween({x,y,buildingId:sourceBuilding},{x:viewer.x,y:viewer.y,buildingId:viewer.buildingId},this.mapConfig.visibilityObstacles,this.mapConfig.buildingVisibilityZones,1);
    audio.playWorld(soundId,{x,y,maxDistance,sourceId:payload.sourceId,eventId:eventId||String(payload.id??''),occlusion});
  }

  private updateAudioState(s:any,time:number){
    const viewer=this.viewerPlayer;if(viewer)audio.setListenerPosition(Number(viewer.x),Number(viewer.y));
    if(s.phase!==this.lastPhase){if(this.lastPhase&&s.phase==='PLANE')audio.playLocal('match_start');this.lastPhase=s.phase;}
    this.updateMovementAudio(s,time);this.updateVehicleAudio(s,time);this.updateZoneAudio(s,time);
  }

  private updateMovementAudio(s:any,time:number){
    const active=new Set<string>();
    for(const p of s.players){
      active.add(p.id);const position=this.framePositions.get(p.id)??{x:Number(p.x),y:Number(p.y),angle:Number(p.angle)};
      const state=this.movementAudio.get(p.id)??{x:position.x,y:position.y,distance:0,lastStepAt:0,lastBushAt:0,vaulting:Boolean(p.isVaulting)};
      const moved=Math.hypot(position.x-state.x,position.y-state.y);state.x=position.x;state.y=position.y;
      if(p.alive&&p.phase==='landed'&&!p.isDriving&&!p.isVaulting&&moved<80)state.distance+=moved;else if(!p.isVaulting)state.distance=0;
      if(Boolean(p.isVaulting)!==state.vaulting){
        const vaulting=Boolean(p.isVaulting);
        if(vaulting){if(p.id===this.net.sessionId)audio.playLocal('window_vault_start');else this.playWorldAudio('window_vault_start',{x:position.x,y:position.y,buildingId:p.buildingId,sourceId:p.id});}
        else if(state.vaulting){if(p.id===this.net.sessionId)audio.playLocal('window_vault_land');else this.playWorldAudio('window_vault_land',{x:position.x,y:position.y,buildingId:p.buildingId,sourceId:p.id});}
        state.vaulting=Boolean(p.isVaulting);
      }
      const threshold=64;if(state.distance>=threshold&&time-state.lastStepAt>180){
        state.distance=0;state.lastStepAt=time;const foot=String(p.buildingId??'')?'footstep_indoor':'footstep_outdoor';
        if(p.id===this.net.sessionId)audio.playLocal(foot,.70);else this.playWorldAudio(foot,{x:position.x,y:position.y,buildingId:p.buildingId,sourceId:p.id});
        if(p.inBush&&time-state.lastBushAt>220){state.lastBushAt=time;if(p.id===this.net.sessionId)audio.playLocal('bush_move',.72);else this.playWorldAudio('bush_move',{x:position.x,y:position.y,buildingId:p.buildingId,sourceId:p.id});}
      }
      this.movementAudio.set(p.id,state);
    }
    for(const id of this.movementAudio.keys())if(!active.has(id))this.movementAudio.delete(id);
  }

  private updateVehicleAudio(s:any,time:number){
    const active=new Set<string>();
    for(const motorcycle of s.motorcycles??[]){
      if(motorcycle.destroyed)continue;active.add(motorcycle.id);
      const shown=this.displayMotorcycles.get(motorcycle.id)??motorcycle;
      const maxSpeed=MOTORCYCLE_MAX_SPEED*(motorcycle.vehicleKind==='tank'?TANK_BALANCE.speedMultiplier:motorcycle.vehicleKind==='fusion_robot'?FUSION_ROBOT_BALANCE.speedMultiplier:1);
      const speedRatio=clamp(Math.abs(Number(shown.speed??motorcycle.speed??0))/maxSpeed,0,1);
      const source={x:Number(shown.x),y:Number(shown.y),buildingId:String(motorcycle.buildingId??''),sourceId:String(motorcycle.id)};
      let handle=this.vehicleAudioLoops.get(motorcycle.id);
      if(!handle&&audio.isUnlocked()){handle=audio.startLoop(speedRatio<.03?'motorcycle_idle':'motorcycle_engine',{...source,pitch:.72+speedRatio*.76,volume:.22+speedRatio*.66,maxDistance:1100,occlusion:this.audioOcclusion(source)});if(handle)this.vehicleAudioLoops.set(motorcycle.id,handle);}
      if(handle)audio.updateLoop(handle,{...source,pitch:.72+speedRatio*.76,volume:.22+speedRatio*.66,maxDistance:1100,occlusion:this.audioOcclusion(source)});
      const previous=this.vehicleAudioState.get(motorcycle.id);
      if(previous&&previous.driverId!==motorcycle.driverId&&motorcycle.driverId===this.net.sessionId)audio.playLocal('motorcycle_mount');
      if(motorcycle.exploding&&time-(this.vehicleWarningAt.get(motorcycle.id)??0)>(Number(motorcycle.explosionAt??0)-Number(s.serverTime??0)<.3?105:210)){this.vehicleWarningAt.set(motorcycle.id,time);this.playWorldAudio('motorcycle_warning',source,1000);}
      this.vehicleAudioState.set(motorcycle.id,{hp:Number(motorcycle.hp),critical:Boolean(motorcycle.critical),exploding:Boolean(motorcycle.exploding),driverId:String(motorcycle.driverId??'')});
    }
    for(const [id,handle] of this.vehicleAudioLoops)if(!active.has(id)){audio.stopLoop(handle,120);this.vehicleAudioLoops.delete(id);this.vehicleAudioState.delete(id);this.vehicleWarningAt.delete(id);}
  }

  private audioOcclusion(source:{x:number;y:number;buildingId?:string}){
    const viewer=this.viewerPlayer;if(!viewer)return'direct' as const;
    return soundOcclusionBetween(source,{x:viewer.x,y:viewer.y,buildingId:viewer.buildingId},this.mapConfig.visibilityObstacles,this.mapConfig.buildingVisibilityZones,1);
  }

  private updateZoneAudio(s:any,time:number){
    const me=this.local();if(!me)return;
    const playLowHealth=()=>{const hp=Number(me.hp??0);if(hp<=25&&hp>0&&time-this.lastLowHealthAt>1400){this.lastLowHealthAt=time;audio.playLocal('low_health');}};
    if(this.net.roomConfig.gameMode!=='battleRoyale'){this.lastZoneState='';this.zoneWarningStage='';playLowHealth();return;}
    const zoneState=String(s.zoneState??'');if(zoneState!==this.lastZoneState){if(this.lastZoneState&&zoneState==='SHRINKING')audio.playLocal('zone_start');if(zoneState==='ANNOUNCING')audio.playLocal('zone_warning');if(zoneState==='FINAL')audio.playLocal('zone_final');this.lastZoneState=zoneState;this.zoneWarningStage='';}
    if(zoneState==='WAITING'||zoneState==='ANNOUNCING'){
      const timer=Math.ceil(Number(s.zoneTimer??0)),stage=timer<=3?'3':timer<=10?'10':'';
      if(stage&&stage!==this.zoneWarningStage){this.zoneWarningStage=stage;audio.playLocal('zone_warning');}
    }
    playLowHealth();
  }

  private drawTransportPlane(g:Phaser.GameObjects.Graphics,x:number,y:number,angle:number,scale:number,layer:'shadow'|'body'='body'){
    const point=(forward:number,side:number,offsetX=0,offsetY=0)=>({x:x+offsetX+Math.cos(angle)*forward*scale-Math.sin(angle)*side*scale,y:y+offsetY+Math.sin(angle)*forward*scale+Math.cos(angle)*side*scale});
    const polygon=(points:Array<[number,number]>,color:number,alpha=1,ox=0,oy=0)=>g.fillStyle(color,alpha).fillPoints(points.map(([f,s])=>{const p=point(f,s,ox,oy);return new Phaser.Math.Vector2(p.x,p.y);}),true);
    if(layer==='shadow'){
      polygon([[128,0],[72,-24],[20,-30],[-48,-28],[-118,-12],[-132,0],[-118,12],[-48,28],[20,30],[72,24]],0x000000,.24,12,14);
      return;
    }
    polygon([[132,0],[76,-18],[30,-22],[-82,-19],[-126,-8],[-138,0],[-126,8],[-82,19],[30,22],[76,18]],0xc6d0d5,1);
    polygon([[38,-18],[-22,-92],[-62,-92],[-40,-17],[-40,17],[-62,92],[-22,92],[38,18]],0xaebac1,1);
    polygon([[-76,-17],[-112,-50],[-132,-48],[-119,-10],[-119,10],[-132,48],[-112,50],[-76,17]],0x8f9da5,1);
    const nose=point(118,0);g.fillStyle(0xe5edf0).fillCircle(nose.x,nose.y,16*scale);
    for(const side of [-52,52]){const engine=point(2,side);g.fillStyle(0x4a5962).fillEllipse(engine.x,engine.y,34*scale,17*scale);}
    const left=point(-24,-88),right=point(-24,88);g.fillStyle(0xff4d55,.72+.28*Math.sin(this.time.now*.012)).fillCircle(left.x,left.y,5*scale);g.fillStyle(0x5bff91,.72+.28*Math.sin(this.time.now*.012+Math.PI)).fillCircle(right.x,right.y,5*scale);
  }


  private updatePerfText(s:any){
    const players=s.players.length,ai=s.players.filter((p:any)=>p.ai).length,frames=[...this.frameTimeSamples].sort((a,b)=>a-b),frameP95=frames[Math.floor(Math.max(0,frames.length-1)*.95)]??0,frameMax=frames.length?frames[frames.length-1]!:0;
    this.perfText.setText([
      `F3 성능  FPS ${Math.round(this.game.loop.actualFps)}  RTT ${Math.round(this.net.rtt)}ms`,
      `프레임 p95 ${frameP95.toFixed(1)}  최대 ${frameMax.toFixed(1)}ms`,
      `패치 평균 ${this.net.patchInterval.toFixed(1)}  p95 ${this.net.patchIntervalP95.toFixed(1)}  최대 ${this.net.patchIntervalMax.toFixed(1)}ms`,
      `스냅 변환 p95 ${this.net.snapshotProcessP95.toFixed(2)}  최대 ${this.net.snapshotProcessMax.toFixed(2)}ms · 수신 ${(this.net.incomingBytesPerSecond/1024).toFixed(1)}KB/s`,
      `서버 tick 평균 ${Number(s.serverTickAvg||0).toFixed(1)}  p95 ${Number(s.serverTickP95||0).toFixed(1)}  max ${Number(s.serverTickMax||0).toFixed(1)}ms`,
      `AI ${Number(s.serverAiMs||0).toFixed(1)}  충돌 ${Number(s.serverCollisionMs||0).toFixed(1)}  차량 ${Number(s.serverVehicleMs||0).toFixed(1)}  자기장 ${Number(s.serverZoneMs||0).toFixed(1)}ms`,
      `맵 ${this.mapConfig.displayName} ${this.mapConfig.width}x${this.mapConfig.height}`,
      `플레이어 ${players} / AI ${ai} / 오토바이 ${(s.motorcycles??[]).length} / 총알 ${s.bullets.length}/${Number(s.activeBulletLimit||0)} · 로켓 ${(s.rockets??[]).length} / 아이템 ${s.loot.length}`,
      `차량 복구 ${Number(s.vehicleRecoveryCount||0)} / 플레이어 복구 ${Number(s.recoveryCount||0)}`,
      `보간 버퍼 ${this.remoteBuffers.size} / 스냅 ${this.snapCorrections} / 누락 ${this.bufferMisses}`,
    ].join('\n'));
  }

  private getDisplayPlayer(id:string,x:number,y:number,alpha:number){
    const current=this.displayPlayers.get(id)??{x,y};
    current.x=Phaser.Math.Linear(current.x,x,alpha);
    current.y=Phaser.Math.Linear(current.y,y,alpha);
    this.displayPlayers.set(id,current);
    return current;
  }

  private getDisplayBullet(id:string,x:number,y:number){
    const current=this.displayBullets.get(id)??{x,y};
    current.x=Phaser.Math.Linear(current.x,x,.55);
    current.y=Phaser.Math.Linear(current.y,y,.55);
    this.displayBullets.set(id,current);
    return current;
  }

  private drawDominationLetter(g:Phaser.GameObjects.Graphics,id:string,x:number,y:number,color:number,scale:number){
    g.lineStyle(5*scale,color,.95);
    if(id==='A')g.lineBetween(x-10*scale,y+12*scale,x,y-12*scale).lineBetween(x,y-12*scale,x+10*scale,y+12*scale).lineBetween(x-6*scale,y+3*scale,x+6*scale,y+3*scale);
    else{g.lineBetween(x-8*scale,y-13*scale,x-8*scale,y+13*scale);g.beginPath();g.arc(x-7*scale,y-6*scale,7*scale,-Math.PI/2,Math.PI/2);g.strokePath();g.beginPath();g.arc(x-7*scale,y+7*scale,7*scale,-Math.PI/2,Math.PI/2);g.strokePath();}
  }

  private drawMini(s:any){
    const g=this.mini;
    g.clear();
    if(this.scopeRequested||this.net.roomConfig.practiceMode){this.miniBounds=undefined;this.miniStatic.setVisible(false);this.miniLabel?.setVisible(false);this.miniHint?.setVisible(false);return;}
    const mobile=mobileControls.enabled,layout=resolveMinimapLayout(this.scale.width,this.scale.height,mobile,this.mapOpen),siege=Boolean(s.coreSiege?.enabled);
    let w=layout.size,h=w,x=layout.x,y=layout.y;
    if(siege){
      w=this.mapOpen?Math.min(this.scale.width-(mobile?24:80),mobile?720:760):Math.min(210,layout.size*1.35);
      h=w*this.mapConfig.height/this.mapConfig.width;
      x=this.mapOpen?(this.scale.width-w)/2:this.scale.width-w-(mobile?10:14);
      y=this.mapOpen?(this.scale.height-h)/2:layout.y;
    }
    const sc=w/this.mapConfig.width;
    const hudTransform=resolveFixedHudTransform(this.scale.width,this.scale.height,this.cameras.main.zoom);this.mini.setPosition(hudTransform.x,hudTransform.y).setScale(hudTransform.scale);this.miniStatic.setPosition(hudTransform.x,hudTransform.y).setScale(hudTransform.scale);
    this.miniBounds={x,y,w,h};
    this.miniStatic.setVisible(true);this.drawMiniStatic(x,y,w,h,sc,layout.modal);
    const arena=this.net.roomConfig.gameMode!=='battleRoyale';
    if(!arena&&s.zoneActive)g.lineStyle(2,0x4db5ff,.95).strokeCircle(x+s.zoneX*sc,y+s.zoneY*sc,s.zoneRadius*sc);
    if(!arena&&(s.zoneActive||s.zoneState==='ANNOUNCING'))g.lineStyle(2,0xffffff,.72).strokeCircle(x+s.nextZoneX*sc,y+s.nextZoneY*sc,s.nextZoneRadius*sc);
    if(['PLANE','DROP'].includes(s.phase)){
      g.lineStyle(2,0xffffff,.35).lineBetween(x+s.planeStartX*sc,y+s.planeStartY*sc,x+s.planeEndX*sc,y+s.planeEndY*sc);
      const px=x+s.planeX*sc,py=y+s.planeY*sc,a=s.planeAngle;
      const f=(forward:number,side:number)=>({x:px+Math.cos(a)*forward-Math.sin(a)*side,y:py+Math.sin(a)*forward+Math.cos(a)*side});
      const nose=f(9,0),tail=f(-8,0),wl=f(0,-8),wr=f(0,8),tl=f(-6,-4),tr=f(-6,4);
      g.lineStyle(3,0xe6edf0,1).lineBetween(tail.x,tail.y,nose.x,nose.y).lineBetween(wl.x,wl.y,wr.x,wr.y).lineBetween(tl.x,tl.y,tr.x,tr.y);
      g.fillStyle(0xe6edf0).fillCircle(nose.x,nose.y,2);
    }
    for(const drop of s.supplyDrops??[]){const sx=x+drop.x*sc,sy=y+drop.y*sc;g.fillStyle(drop.opened?0x8a725e:0xff5d45,.95).fillRect(sx-4,sy-4,8,8);g.lineStyle(1,0xffe8b0,.9).strokeRect(sx-5,sy-5,10,10);}
    const season=s.werewolfSeason;
    if(season?.enabled&&season.altarPhase!=='dormant'&&season.altarPhase!=='disabled'){const ax=x+Number(season.altarX)*sc,ay=y+Number(season.altarY)*sc;g.fillStyle(season.altarPhase==='active'?0xd72f4a:0x792737,.95).fillCircle(ax,ay,5);g.lineStyle(2,0xff9aad,.85).strokeCircle(ax,ay,7);}
    if(season?.armoryActive&&!season.armoryOpened){const bx=x+Number(season.armoryX)*sc,by=y+Number(season.armoryY)*sc;g.fillStyle(0xdce7ec,.95).fillRect(bx-4,by-4,8,8);g.lineStyle(1,0xffffff,.9).strokeRect(bx-5,by-5,10,10);}
    if(s.domination?.enabled)for(const site of s.domination.sites??[]){const sx=x+Number(site.x)*sc,sy=y+Number(site.y)*sc,color=site.owner==='blue'?0x45a8ff:site.owner==='red'?0xff5263:0xe6edf0;g.fillStyle(color,.38).fillCircle(sx,sy,Math.max(5,Number(site.radius)*sc));g.lineStyle(2,color,.95).strokeCircle(sx,sy,Math.max(5,Number(site.radius)*sc));this.drawDominationLetter(g,String(site.id),sx,sy,color,.45);}
    if(s.coreSiege?.enabled){
      for(const structure of s.coreSiege.structures??[]){
        const sx=x+Number(structure.x)*sc,sy=y+Number(structure.y)*sc,color=structure.team==='blue'?0x55aaff:0xff5868,size=structure.kind==='core'?7:4;
        if(structure.destroyed){g.lineStyle(2,0x68747a,.55).lineBetween(sx-size,sy-size,sx+size,sy+size).lineBetween(sx+size,sy-size,sx-size,sy+size);continue;}
        g.fillStyle(color,.9).fillCircle(sx,sy,size);g.lineStyle(structure.vulnerable?2:1,structure.vulnerable?0xffffff:0x56636a,structure.vulnerable?.85:.6).strokeCircle(sx,sy,size+2);
      }
      for(const pickup of s.coreSiege.pickups??[]){
        if(!pickup.active)continue;
        const sx=x+Number(pickup.x)*sc,sy=y+Number(pickup.y)*sc,color=pickup.kind==='healing'?0x65f29a:0xffd25f;
        g.fillStyle(color,.92).fillRect(sx-3,sy-3,6,6);g.lineStyle(1,0xffffff,.72).strokeRect(sx-4,sy-4,8,8);
      }
      for(const minion of s.coreSiege.minions??[]){
        const sx=x+Number(minion.x)*sc,sy=y+Number(minion.y)*sc,color=minion.team==='blue'?0x55aaff:0xff5868;
        g.fillStyle(color,.72).fillCircle(sx,sy,1.8);
      }
    }
    for(const p of s.players){
      if(!p.alive)continue;
      const visibility=this.getPlayerVisibility(p);
      if(p.id!==this.net.sessionId&&!visibility.visibleOnMinimap)continue;
      const position=this.framePositions.get(p.id)??{x:p.x,y:p.y};
      const teamMode=this.net.roomConfig.gameMode==='domination'||this.net.roomConfig.gameMode==='coreSiege';
      const color=p.id===this.net.sessionId?0x54dcff:teamMode?(p.team==='blue'?0x55aaff:0xff5868):p.bushRevealed?0xff424f:0xff686e;
      g.fillStyle(color).fillCircle(x+position.x*sc,y+position.y*sc,p.id===this.net.sessionId?5:3);
    }
    this.drawMiniHint(x,y,w,h,mobile);
    if(arena){this.miniLabel?.setVisible(false);return;}
    const direction=zoneDirection(s.nextZoneX-s.zoneX,s.nextZoneY-s.zoneY);
    const zoneLabel=s.zoneState==='FREE'
      ?`안전구역 생성까지 · ${Math.max(0,Math.ceil(s.zoneTimer))}초`
      :s.zoneState==='ANNOUNCING'
        ?`첫 안전구역 예고 · ${Math.max(0,Math.ceil(s.zoneTimer))}초`
        :`다음 원 ${direction} · ${Math.max(0,Math.ceil(s.zoneTimer))}초`;
    g.fillStyle(0x061018,.82).fillRoundedRect(x,y+h+6,w,22,7);
    this.addOrUpdateMiniLabel(x+w/2,y+h+17,zoneLabel);
  }

  private drawExoAssembly(g:Phaser.GameObjects.Graphics,p:any,x:number,y:number,time:number,alpha:number,bodyColor:number){
    const emp=p.exoKind==='emp',accent=emp?0x67dcff:0x35d9ff,assemblySeconds=emp?EMP_EXO_SUIT_BALANCE.assemblySeconds:EXO_SUIT_BALANCE.assemblySeconds;
    const serverTime=Number(this.net.snapshot?.serverTime??0),started=Number(p.exoAssemblyStartedAt??serverTime),ends=Number(p.exoAssemblyEndsAt??started+assemblySeconds),progress=clamp((serverTime-started)/Math.max(.01,ends-started),0,1),ease=(value:number)=>1-Math.pow(1-clamp(value,0,1),3),a=Number(p.angle||0),fx=Math.cos(a),fy=Math.sin(a),sx=-fy,sy=fx;
    g.fillStyle(bodyColor,.94*alpha).fillCircle(x,y,22);g.lineStyle(3,0xffffff,.7*alpha).strokeCircle(x,y,24);const pulse=.45+.3*Math.sin(time*.025);g.lineStyle(3,accent,pulse*alpha).strokeCircle(x,y,35+5*pulse);
    const fly=(kind:LootKind,startAt:number,endAt:number,startForward:number,startSide:number,targetForward:number,targetSide:number)=>{if(progress<startAt)return;const t=ease((progress-startAt)/(endAt-startAt)),px=x+fx*(startForward+(targetForward-startForward)*t)+sx*(startSide+(targetSide-startSide)*t),py=y+fy*(startForward+(targetForward-startForward)*t)+sy*(startSide+(targetSide-startSide)*t);this.drawLootIcon(g,kind,px,py,1.05);if(t<1){g.lineStyle(3,accent,.25*alpha).lineBetween(px,py,x+fx*targetForward+sx*targetSide,y+fy*targetForward+sy*targetSide);}else g.fillStyle(accent,.18*alpha).fillCircle(px,py,15*(1-clamp((progress-endAt)/.18,0,1)));};
    if(emp){fly('emp_exo_core',0,.34,-145,0,0,0);fly('emp_exo_limbs',.25,.64,-50,155,-2,0);fly('emp_exo_head',.52,.88,150,-45,23,0);}else{fly('exo_core',0,.34,-145,0,0,0);fly('exo_limbs',.25,.64,-50,155,-2,0);fly('exo_head',.52,.88,150,-45,23,0);}
    if(progress>.86){const flash=1-clamp((progress-.86)/.14,0,1);g.lineStyle(6,0xd9fbff,flash*alpha).strokeCircle(x,y,38+35*(1-flash));g.fillStyle(accent,.18*flash*alpha).fillCircle(x,y,52);}
  }

  private drawMiniStatic(x:number,y:number,w:number,h:number,sc:number,modal=false){
    const key=`${this.mapConfig.id}:${x}:${y}:${w}:${h}:${modal}:${this.scale.width}:${this.scale.height}`;if(this.miniStaticKey===key)return;this.miniStaticKey=key;
    const g=this.miniStatic;g.clear();if(modal)g.fillStyle(0x02080d,.78).fillRect(0,0,this.scale.width,this.scale.height);g.fillStyle(0x061018,.96).fillRoundedRect(x,y,w,h,12);g.lineStyle(modal?3:2,modal?0xffd565:0xffffff,modal?.72:.18).strokeRoundedRect(x,y,w,h,12);
    for(const r of this.mapConfig.regions)g.fillStyle(REGION_THEMES[r.id].ground,.62).fillRect(x+r.x*sc,y+r.y*sc,r.w*sc,r.h*sc);
    for(const river of this.mapConfig.rivers)for(let index=0;index<river.points.length-1;index++){const a=river.points[index]!,b=river.points[index+1]!,width=((river.widths[index]??760)+(river.widths[index+1]??river.widths[index]??760))/2,stroke=Math.max(2,width*sc);g.lineStyle(stroke,0x2b82a8,.82).lineBetween(x+a.x*sc,y+a.y*sc,x+b.x*sc,y+b.y*sc);if(this.mapConfig.id==='dock8')g.fillStyle(0x2b82a8,.82).fillCircle(x+a.x*sc,y+a.y*sc,stroke/2).fillCircle(x+b.x*sc,y+b.y*sc,stroke/2);}
    for(const crossing of this.mapConfig.landCrossings)g.fillStyle(crossing.kind==='ford'?0x7c9276:0x77736d,.95).fillRect(x+crossing.rect.x*sc,y+crossing.rect.y*sc,Math.max(1,crossing.rect.w*sc),Math.max(1,crossing.rect.h*sc));
    for(const exit of this.mapConfig.shoreExits)g.fillStyle(0xcfe4a8,.7).fillCircle(x+exit.landingPoint.x*sc,y+exit.landingPoint.y*sc,Math.max(1.2,4*sc));
    for(const b of this.mapConfig.buildings)g.fillStyle(REGION_THEMES[b.regionId].roof,.68).fillRect(x+b.x*sc,y+b.y*sc,Math.max(1,b.w*sc),Math.max(1,b.h*sc));
    for(const bush of this.mapConfig.bushes)g.fillStyle(0x3f8c4c,.42).fillCircle(x+bush.x*sc,y+bush.y*sc,Math.max(1.5,bush.radius*sc));
  }

  private miniLabel?:Phaser.GameObjects.Text;
  private miniHint?:Phaser.GameObjects.Text;

  private toggleMapOpen(force?:boolean){
    this.mapOpen=force??!this.mapOpen;this.lastMiniDraw=0;this.miniStaticKey='';
    document.getElementById('game')?.classList.toggle('map-open',this.mapOpen);
  }

  private handleMinimapPointer(pointer:Phaser.Input.Pointer){
    const bounds=this.miniBounds;if(!bounds||pointer.button!==0)return false;
    const inside=pointer.x>=bounds.x&&pointer.x<=bounds.x+bounds.w&&pointer.y>=bounds.y&&pointer.y<=bounds.y+bounds.h;
    if(!inside)return false;
    this.toggleMapOpen();
    return true;
  }

  private drawMiniHint(x:number,y:number,w:number,h:number,mobile:boolean){
    if(!mobile){this.miniHint?.setVisible(false);return;}
    const text=this.mapOpen?'전술 지도 · 터치해서 닫기':'지도 터치';
    if(!this.miniHint)this.miniHint=this.add.text(0,0,text,{fontFamily:'sans-serif',fontSize:this.mapOpen?'14px':'10px',fontStyle:'bold',color:'#ffe49a',backgroundColor:'#061018cc',padding:{x:this.mapOpen?10:6,y:this.mapOpen?6:3}}).setOrigin(.5,1).setScrollFactor(0).setDepth(RENDER_DEPTH.HUD+3);
    const point=fixedHudPoint(x+w/2,y+h-(this.mapOpen?10:4),this.scale.width,this.scale.height,this.cameras.main.zoom);
    this.miniHint.setText(text).setFontSize(this.mapOpen?14:10).setPadding(this.mapOpen?10:6,this.mapOpen?6:3).setPosition(point.x,point.y).setScale(point.scale).setVisible(true);
  }

  private addOrUpdateMiniLabel(x:number,y:number,text:string){
    if(!this.miniLabel)this.miniLabel=this.add.text(x,y,text,{fontFamily:'sans-serif',fontSize:'11px',fontStyle:'bold',color:'#e7f2f7'}).setOrigin(.5).setScrollFactor(0).setDepth(RENDER_DEPTH.HUD+1);
    const point=fixedHudPoint(x,y,this.scale.width,this.scale.height,this.cameras.main.zoom);
    this.miniLabel.setPosition(point.x,point.y).setScale(point.scale).setText(text).setVisible(true);
  }

}
