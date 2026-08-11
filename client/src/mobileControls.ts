// DROP8_REFACTOR_056_MOBILE_TOUCH_PROTOTYPE
export type MobileAction='reload'|'heal'|'weapon1'|'weapon2'|'weapon3'|'launchDrones'|'placeSpiderMine'|'placeStripTrap'|'robotAssault'|'robotEmp'|'robotFusion'|'siegeAbility1'|'siegeAbility2'|'siegeAbility3';
type MobileButtonAction=MobileAction|'zoomIn'|'zoomOut'|'toggleTactical';
export type MobileSiegeSkillSlot=0|1|2|3;

export interface MobileInputSnapshot{
  enabled:boolean;
  active:boolean;
  moveX:number;
  moveY:number;
  aimX:number;
  aimY:number;
  aimActive:boolean;
  fire:boolean;
  fireReleased:boolean;
  interact:boolean;
  secondary:boolean;
  secondaryReleased:boolean;
  secondaryAimX:number;
  secondaryAimY:number;
  secondaryAimActive:boolean;
  siegeAimX:number;
  siegeAimY:number;
  siegeAimActive:boolean;
  siegeTapSlot:MobileSiegeSkillSlot;
  siegeReleaseSlot:MobileSiegeSkillSlot;
}

function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value));}

export function normalizedTouchStick(dx:number,dy:number,radius:number,deadZone=.14){
  const safeRadius=Math.max(1,radius),distance=Math.hypot(dx,dy),rawMagnitude=clamp(distance/safeRadius,0,1);
  if(rawMagnitude<=deadZone||distance<=.001)return{x:0,y:0,magnitude:0};
  const magnitude=clamp((rawMagnitude-deadZone)/(1-deadZone),0,1),scale=magnitude/distance;
  return{x:dx*scale,y:dy*scale,magnitude};
}

export function mobileTouchRequested(){
  if(typeof window==='undefined'||typeof navigator==='undefined')return false;
  const forced=new URLSearchParams(window.location.search).get('touch');
  if(forced==='1')return true;
  if(forced==='0')return false;
  return navigator.maxTouchPoints>0&&window.matchMedia('(pointer: coarse)').matches;
}

export class MobileControls{
  private root?:HTMLElement;
  private readonly enabledValue=mobileTouchRequested();
  private gameplayActive=false;
  private moveX=0;
  private moveY=0;
  private aimX=1;
  private aimY=0;
  private aimActive=false;
  private fireReleasedPulse=false;
  private interact=false;
  private secondary=false;
  private secondaryReleasedPulse=false;
  private secondaryAimX=1;
  private secondaryAimY=0;
  private secondaryAimActive=false;
  private secondaryMode:'hold'|'position'='hold';
  private siegeSkillSlot:MobileSiegeSkillSlot=0;
  private siegeAimX=1;
  private siegeAimY=0;
  private siegeAimActive=false;
  private siegeTapPulse:MobileSiegeSkillSlot=0;
  private siegeReleasePulse:MobileSiegeSkillSlot=0;
  private actions:MobileAction[]=[];
  private viewZoomValue=this.loadViewZoom();
  private lastTouchEndAt=0;

  get enabled(){return this.enabledValue;}
  get active(){return this.enabledValue&&this.gameplayActive;}
  get viewZoom(){return this.viewZoomValue;}

  mount(root=document.getElementById('mobileControls')??undefined){
    this.root=root;
    document.documentElement.classList.toggle('touch-ui',this.enabledValue);
    if(!root||!this.enabledValue)return;
    this.bindMoveStick(root.querySelector<HTMLElement>('[data-mobile-stick="move"]'));
    this.bindAimStick(root.querySelector<HTMLElement>('[data-mobile-stick="aim"]'));
    for(const button of root.querySelectorAll<HTMLElement>('[data-mobile-action]'))this.bindAction(button);
    for(const button of root.querySelectorAll<HTMLElement>('[data-mobile-hold]'))this.bindHold(button);
    root.addEventListener('contextmenu',(event)=>event.preventDefault());
    document.addEventListener('dblclick',(event)=>{if(this.active)event.preventDefault();},{passive:false});
    document.addEventListener('touchend',(event)=>{
      if(!this.active)return;
      const now=performance.now();
      if(now-this.lastTouchEndAt<340)event.preventDefault();
      this.lastTouchEndAt=now;
    },{passive:false});
    for(const type of ['gesturestart','gesturechange','gestureend'])document.addEventListener(type,(event)=>{if(this.active)event.preventDefault();},{passive:false});
    window.addEventListener('blur',()=>this.reset());
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.reset();});
    this.updateViewZoomLabel();
  }

  setGameplayActive(active:boolean){
    this.gameplayActive=active;
    this.root?.classList.toggle('active',this.active);
    this.root?.setAttribute('aria-hidden',String(!this.active));
    if(!this.active)this.reset();
  }

  setContext(context:{interactLabel?:string;interactEnabled?:boolean;secondaryLabel?:string;secondaryMode?:'hold'|'position';aimLabel?:string;aimMode?:'hold'|'release'|'throw'}){
    const interact=this.root?.querySelector<HTMLElement>('[data-mobile-hold="interact"] .mobile-action-label');
    const interactButton=this.root?.querySelector<HTMLButtonElement>('[data-mobile-hold="interact"]');
    const secondary=this.root?.querySelector<HTMLElement>('[data-mobile-hold="secondary"] .mobile-action-label');
    if(interact&&context.interactLabel)interact.textContent=context.interactLabel;
    if(interactButton&&context.interactEnabled!==undefined)interactButton.disabled=!context.interactEnabled;
    if(secondary&&context.secondaryLabel)secondary.textContent=context.secondaryLabel;
    if(context.secondaryMode)this.secondaryMode=context.secondaryMode;
    const aimLabel=this.root?.querySelector<HTMLElement>('#mobileAimHint');if(aimLabel&&context.aimLabel)aimLabel.textContent=context.aimLabel;
    if(this.root&&context.aimMode)this.root.dataset.aimMode=context.aimMode;
  }

  snapshot():MobileInputSnapshot{
    const fireReleased=this.fireReleasedPulse,secondaryReleased=this.secondaryReleasedPulse,secondaryAimActive=this.secondaryAimActive,siegeTapSlot=this.siegeTapPulse,siegeReleaseSlot=this.siegeReleasePulse;
    this.fireReleasedPulse=false;this.secondaryReleasedPulse=false;if(secondaryReleased)this.secondaryAimActive=false;this.siegeTapPulse=0;this.siegeReleasePulse=0;
    return{enabled:this.enabledValue,active:this.active,moveX:this.moveX,moveY:this.moveY,aimX:this.aimX,aimY:this.aimY,aimActive:this.active&&this.aimActive,fire:this.active&&this.aimActive,fireReleased:this.active&&fireReleased,interact:this.active&&this.interact,secondary:this.active&&this.secondary,secondaryReleased:this.active&&secondaryReleased,secondaryAimX:this.secondaryAimX,secondaryAimY:this.secondaryAimY,secondaryAimActive:this.active&&secondaryAimActive,siegeAimX:this.siegeAimX,siegeAimY:this.siegeAimY,siegeAimActive:this.active&&this.siegeAimActive,siegeTapSlot:this.active?siegeTapSlot:0,siegeReleaseSlot:this.active?siegeReleaseSlot:0};
  }

  consumeActions(){const queued=this.actions;this.actions=[];return queued;}

  reset(){
    this.moveX=0;this.moveY=0;this.aimX=1;this.aimY=0;this.aimActive=false;this.fireReleasedPulse=false;this.interact=false;this.secondary=false;this.secondaryReleasedPulse=false;this.secondaryAimX=1;this.secondaryAimY=0;this.secondaryAimActive=false;this.actions=[];this.siegeSkillSlot=0;this.siegeAimX=1;this.siegeAimY=0;this.siegeAimActive=false;this.siegeTapPulse=0;this.siegeReleasePulse=0;
    for(const stick of this.root?.querySelectorAll<HTMLElement>('[data-mobile-stick]')??[]){stick.style.setProperty('--stick-x','0px');stick.style.setProperty('--stick-y','0px');stick.classList.remove('engaged','canceling');}
    for(const button of this.root?.querySelectorAll<HTMLElement>('[data-mobile-hold]')??[])button.classList.remove('pressed');
    for(const button of this.root?.querySelectorAll<HTMLElement>('[data-mobile-action^="siegeAbility"]')??[]){button.classList.remove('pressed','dragging');button.style.setProperty('--skill-x','0px');button.style.setProperty('--skill-y','0px');}
    this.root?.classList.remove('tactical-open');
  }

  private bindMoveStick(element:HTMLElement|null){
    if(!element)return;
    let pointerId:number|undefined;
    const update=(event:PointerEvent)=>{
      const rect=element.getBoundingClientRect(),radius=Math.max(1,Math.min(rect.width,rect.height)*.34),dx=event.clientX-(rect.left+rect.width/2),dy=event.clientY-(rect.top+rect.height/2),value=normalizedTouchStick(dx,dy,radius);
      element.style.setProperty('--stick-x',`${value.x*radius}px`);element.style.setProperty('--stick-y',`${value.y*radius}px`);
      this.moveX=value.x;this.moveY=value.y;
    };
    const finish=(event:PointerEvent)=>{
      if(pointerId!==event.pointerId)return;
      event.preventDefault();event.stopPropagation();pointerId=undefined;element.classList.remove('engaged');element.style.setProperty('--stick-x','0px');element.style.setProperty('--stick-y','0px');
      this.moveX=0;this.moveY=0;
    };
    element.addEventListener('pointerdown',(event)=>{if(!this.active||pointerId!==undefined)return;event.preventDefault();event.stopPropagation();pointerId=event.pointerId;element.classList.add('engaged');element.setPointerCapture(event.pointerId);update(event);});
    element.addEventListener('pointermove',(event)=>{if(pointerId!==event.pointerId)return;event.preventDefault();event.stopPropagation();update(event);});
    element.addEventListener('pointerup',finish);element.addEventListener('pointercancel',finish);element.addEventListener('lostpointercapture',finish);
  }

  private bindAimStick(element:HTMLElement|null){
    if(!element)return;
    let pointerId:number|undefined;
    const update=(event:PointerEvent)=>{
      const rect=element.getBoundingClientRect(),radius=Math.max(1,Math.min(rect.width,rect.height)*.34),dx=event.clientX-(rect.left+rect.width/2),dy=event.clientY-(rect.top+rect.height/2),value=normalizedTouchStick(dx,dy,radius,.10);
      element.style.setProperty('--stick-x',`${value.x*radius}px`);element.style.setProperty('--stick-y',`${value.y*radius}px`);
      this.aimActive=value.magnitude>=.08;
      element.classList.toggle('canceling',!this.aimActive);
      if(this.aimActive){this.aimX=value.x/value.magnitude;this.aimY=value.y/value.magnitude;}
    };
    const finish=(event:PointerEvent,releaseShot:boolean)=>{
      if(pointerId!==event.pointerId)return;
      event.preventDefault();event.stopPropagation();
      if(releaseShot&&this.aimActive)this.fireReleasedPulse=true;
      pointerId=undefined;this.aimActive=false;element.classList.remove('engaged','canceling');element.style.setProperty('--stick-x','0px');element.style.setProperty('--stick-y','0px');
    };
    element.addEventListener('pointerdown',(event)=>{
      if(!this.active||pointerId!==undefined)return;
      event.preventDefault();event.stopPropagation();pointerId=event.pointerId;element.classList.add('engaged');element.setPointerCapture(event.pointerId);update(event);
    });
    element.addEventListener('pointermove',(event)=>{if(pointerId!==event.pointerId)return;event.preventDefault();event.stopPropagation();update(event);});
    element.addEventListener('pointerup',(event)=>finish(event,true));element.addEventListener('pointercancel',(event)=>finish(event,false));element.addEventListener('lostpointercapture',(event)=>finish(event,false));
  }

  private bindAction(button:HTMLElement){
    const action=button.dataset.mobileAction as MobileButtonAction|undefined;
    if(!action)return;
    if(action.startsWith('siegeAbility')){this.bindSiegeSkill(button,Number(action.slice(-1)) as MobileSiegeSkillSlot);return;}
    button.addEventListener('pointerdown',(event)=>{if(!this.active||button instanceof HTMLButtonElement&&button.disabled)return;event.preventDefault();event.stopPropagation();button.setPointerCapture(event.pointerId);button.classList.add('pressed');if(action==='zoomIn')this.adjustViewZoom(.1);else if(action==='zoomOut')this.adjustViewZoom(-.1);else if(action==='toggleTactical')this.root?.classList.toggle('tactical-open');else{this.actions.push(action);this.root?.classList.remove('tactical-open');}});
    const release=(event:PointerEvent)=>{event.preventDefault();event.stopPropagation();button.classList.remove('pressed');};
    button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
  }

  private bindSiegeSkill(button:HTMLElement,slot:MobileSiegeSkillSlot){
    if(!(slot===1||slot===2||slot===3))return;
    let pointerId:number|undefined,startX=0,startY=0;
    const update=(event:PointerEvent)=>{
      const value=normalizedTouchStick(event.clientX-startX,event.clientY-startY,48,.16),travel=13;
      this.siegeAimActive=value.magnitude>0;
      button.classList.toggle('dragging',this.siegeAimActive);
      button.style.setProperty('--skill-x',`${value.x*travel}px`);button.style.setProperty('--skill-y',`${value.y*travel}px`);
      if(this.siegeAimActive){this.siegeAimX=value.x/value.magnitude;this.siegeAimY=value.y/value.magnitude;}
    };
    const finish=(event:PointerEvent,cast:boolean)=>{
      if(pointerId!==event.pointerId)return;
      event.preventDefault();event.stopPropagation();
      if(cast){if(this.siegeAimActive)this.siegeReleasePulse=slot;else this.siegeTapPulse=slot;}
      pointerId=undefined;this.siegeSkillSlot=0;this.siegeAimActive=false;button.classList.remove('pressed','dragging');button.style.setProperty('--skill-x','0px');button.style.setProperty('--skill-y','0px');
    };
    button.addEventListener('pointerdown',(event)=>{
      if(!this.active||this.siegeSkillSlot||button instanceof HTMLButtonElement&&button.disabled)return;
      event.preventDefault();event.stopPropagation();pointerId=event.pointerId;startX=event.clientX;startY=event.clientY;this.siegeSkillSlot=slot;this.siegeAimActive=false;button.classList.add('pressed');button.setPointerCapture(event.pointerId);this.actions.push(`siegeAbility${slot}` as MobileAction);
    });
    button.addEventListener('pointermove',(event)=>{if(pointerId!==event.pointerId)return;event.preventDefault();event.stopPropagation();update(event);});
    button.addEventListener('pointerup',(event)=>finish(event,true));button.addEventListener('pointercancel',(event)=>finish(event,false));button.addEventListener('lostpointercapture',(event)=>finish(event,false));
    window.addEventListener('pointerup',(event)=>finish(event,true),true);window.addEventListener('pointercancel',(event)=>finish(event,false),true);
  }

  private loadViewZoom(){
    if(typeof window==='undefined')return .8;
    const stored=Number(window.localStorage.getItem('drop8-mobile-view-zoom'));
    return Number.isFinite(stored)&&stored>=.65&&stored<=1.05?stored:.8;
  }

  private adjustViewZoom(delta:number){
    this.viewZoomValue=Math.round(clamp(this.viewZoomValue+delta,.65,1.05)*20)/20;
    try{window.localStorage.setItem('drop8-mobile-view-zoom',String(this.viewZoomValue));}catch{/* Private browsing may disable storage. */}
    this.updateViewZoomLabel();
  }

  private updateViewZoomLabel(){
    const label=this.root?.querySelector<HTMLElement>('#mobileViewValue');
    if(label)label.textContent=`${Math.round(this.viewZoomValue*100)}%`;
  }

  private bindHold(button:HTMLElement){
    const hold=button.dataset.mobileHold as 'interact'|'secondary'|undefined;
    if(!hold)return;
    let startX=0,startY=0;
    const set=(pressed:boolean)=>{if(hold==='interact')this.interact=pressed;else this.secondary=pressed;button.classList.toggle('pressed',pressed);};
    button.addEventListener('pointerdown',(event)=>{if(!this.active||button instanceof HTMLButtonElement&&button.disabled)return;event.preventDefault();event.stopPropagation();startX=event.clientX;startY=event.clientY;button.setPointerCapture(event.pointerId);set(hold==='secondary'&&this.secondaryMode==='position'?false:true);if(hold==='secondary'&&this.secondaryMode==='position')button.classList.add('pressed');});
    button.addEventListener('pointermove',(event)=>{if(hold!=='secondary'||this.secondaryMode!=='position'||!button.hasPointerCapture(event.pointerId))return;const value=normalizedTouchStick(event.clientX-startX,event.clientY-startY,48,.16);this.secondaryAimActive=value.magnitude>0;if(this.secondaryAimActive){this.secondaryAimX=value.x/value.magnitude;this.secondaryAimY=value.y/value.magnitude;}button.classList.toggle('dragging',this.secondaryAimActive);});
    const release=(event:PointerEvent)=>{event.preventDefault();event.stopPropagation();if(hold==='secondary'&&this.secondaryMode==='position')this.secondaryReleasedPulse=true;set(false);button.classList.remove('dragging');};
    button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
  }
}

export const mobileControls=new MobileControls();
