// DROP8_REFACTOR_025A_OPEN_ARENA_HUD_LAYOUT_HOTFIX
// DROP8_REFACTOR_025_OPEN_ARENA_KILL_LIMIT_MATCH_CYCLE
// DROP8_REFACTOR_024E_OPEN_ARENA_SCOREBOARD_UX
// DROP8_REFACTOR_024C_OPEN_ARENA_RESPAWN
// DROP8_REFACTOR_024B_OPEN_ARENA_LIFECYCLE_HOST_MIGRATION
// DROP8_REFACTOR_024A_OPEN_ARENA_FOUNDATION
// DROP8_REFACTOR_021_AI_PERSONA_DIALOGUE
// DROP8_REFACTOR_019_AI_HUMANIZATION
// DROP8_REFACTOR_018_WEREWOLF_SEASON
// DROP8_REFACTOR_017_ADHESIVE_STRIP_LOBBY_BAZOOKA_WATER
// DROP8_REFACTOR_015A_SUPPLY_DROP_FLAMETHROWER
// DROP8_REFACTOR_014_PLANE_VISIBILITY_BAZOOKA_SLOT_SWAP
// DROP8_REFACTOR_013H_FIXED_V3_VISIBILITY_ROOF_RIVER_ZONE_SNIPER_AI
// DROP8_REFACTOR_013H_VISIBILITY_ROOF_RIVER_ZONE_SNIPER
import Phaser from 'phaser';
import { AI_DIALOGUE_LINES, AMMO_DISPLAY_NAMES, CORE_SIEGE_BASIC_ATTACKS, CORE_SIEGE_HEROES, CORE_SIEGE_POSITIONING, FUSION_ROBOT_BALANCE, FUSION_ROBOT_WEAPON_NAMES, GAME_NAME, LOOT_LABELS, MAX_PLAYERS, MELEE_WEAPONS, MOTORCYCLE_MAX_SPEED, MOTORCYCLE_SCOPE_SPEED_RATIO, TANK_BALANCE, WEAPONS, coreSiegeCanUpgradeSkill, coreSiegeLevelXpWindow, isThrowableType, type AmmoType, type CoreSiegeAbilitySlot, type CoreSiegeHeroId, type FusionRobotWeaponSlot, type GameMode, type WeaponId, type ThrowableType } from '@drop8/shared';
import { GameScene } from './GameScene';
import { Network } from './network';
import { normalizeChatText, shouldSubmitChatKey } from './chatInput';
import { audio } from './audio';
import { playableArenaAiLimit, resolveRoomCreation } from './roomCreation';
import { normalizeQuickStartMap, normalizeQuickStartPreset, quickStartRoomOptions, rankQuickStartRooms } from './quickStart';
import { GAME_MODE_CHOICES, gameModeChoice, roomsForGameMode } from './gameModeBrowser';
import { mobileControls } from './mobileControls';
import './style.css';
// DROP8_REFACTOR_013_INTERIOR_RIVER_DOCK8

const $=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const net=new Network();
mobileControls.mount();
let game:Phaser.Game|null=null;
let chatting=false;
let lastHudAt=0;
let inventoryOpen=false;
const inventoryHelp=document.querySelector<HTMLElement>('#inventoryPanel>p');
if(inventoryHelp)inventoryHelp.textContent='클릭으로 선택 · 1/2번 드래그 교환 · 우클릭 버리기 · 4 투척무기 · 5 호위 드론 · Z 강철 로봇 · C EMP 로봇 · V 합체 로봇 · X 설치류 · Shift+X 스파이더 마인 · Q 자동 회복 · E 상호작용 · R 재장전 · F 변신';
let chatComposing=false;
let lobbyChatComposing=false;
let roomListTimer=0;
let roomListRequestSeq=0;
let roomListAbort:AbortController|null=null;
let pickupToastTimer=0;
let fieldChatCollapsed=localStorage.getItem('drop8-field-chat-collapsed')!=='false';
let fieldChatUnread=0;
let cachedRooms:PublicRoomInfo[]=[];
type GameNoticeType='info'|'warning'|'error';
const noticeLastShown=new Map<string,number>();
const pendingConfirmations=new Map<string,number>();

const audioUnlockHint=document.getElementById('audioUnlockHint');
async function unlockAudio(){if(await audio.unlock())audioUnlockHint?.classList.add('hidden');}
window.addEventListener('pointerdown',()=>void unlockAudio(),{once:true,capture:true});
window.addEventListener('keydown',()=>void unlockAudio(),{once:true,capture:true});
function setupAudioSettings(){
  const master=$<HTMLInputElement>('audioMaster'),effects=$<HTMLInputElement>('audioEffects'),environment=$<HTMLInputElement>('audioEnvironment'),music=$<HTMLInputElement>('audioMusic'),muted=$<HTMLInputElement>('audioMute');
  const settings=audio.getSettings();master.value=String(Math.round(settings.master*100));effects.value=String(Math.round(settings.effects*100));environment.value=String(Math.round(settings.environment*100));music.value=String(Math.round(settings.music*100));muted.checked=settings.muted;
  const apply=()=>{audio.updateSettings({master:Number(master.value)/100,effects:Number(effects.value)/100,environment:Number(environment.value)/100,music:Number(music.value)/100,muted:muted.checked});void unlockAudio();audio.playUi('ui_click');};
  for(const input of [master,effects,environment,music])input.addEventListener('input',apply);muted.addEventListener('change',apply);
}

function showGameNotice(message:unknown,type:GameNoticeType='warning',duration?:number){
  const text=String(message??'').trim();
  if(!text)return;
  if(type==='error')audio.playUi('ui_error');
  const now=performance.now(),key=`${type}:${text}`;
  if(now-(noticeLastShown.get(key)??-9999)<900)return;
  noticeLastShown.set(key,now);
  const container=document.getElementById('gameNotices');
  if(!container)return;
  while(container.children.length>=3)container.firstElementChild?.remove();
  const item=document.createElement('div');
  item.className=`game-notice ${type}`;
  item.textContent=text;
  container.append(item);
  window.setTimeout(()=>{item.classList.add('leaving');window.setTimeout(()=>item.remove(),190);},duration??(type==='error'?2400:1600));
}

function confirmWithoutPopup(key:string,message:string){
  const now=performance.now(),deadline=pendingConfirmations.get(key)??0;
  if(now<=deadline){pendingConfirmations.delete(key);return true;}
  pendingConfirmations.set(key,now+2200);
  showGameNotice(`${message} · 2초 안에 한 번 더 누르세요.`,'warning',2200);
  return false;
}

window.addEventListener('drop8-game-notice',(event)=>{
  const detail=(event as CustomEvent<{message?:unknown;type?:GameNoticeType;duration?:number}>).detail;
  showGameNotice(detail?.message,detail?.type??'warning',detail?.duration);
});
const home=$('home');
const lobby=$('lobby');
const gameEl=$('game');
const heroIds=Object.keys(CORE_SIEGE_HEROES) as CoreSiegeHeroId[];
let selectedPracticeHero=(localStorage.getItem('drop8-practice-hero') as CoreSiegeHeroId)||'vanguard';
if(!CORE_SIEGE_HEROES[selectedPracticeHero])selectedPracticeHero='vanguard';
const heroLabButton=document.createElement('button');heroLabButton.id='heroLabBtn';heroLabButton.className='home-hero-lab-button';heroLabButton.type='button';heroLabButton.innerHTML='<b>영웅 연구소</b><span>20명 기술 보기 · 즉시 연습</span>';document.querySelector('.home-primary-actions')?.append(heroLabButton);
const heroLabScreen=document.createElement('section');heroLabScreen.id='heroLabScreen';heroLabScreen.className='hero-lab-screen hidden';heroLabScreen.innerHTML=`<header><button id="heroLabBack" type="button" aria-label="돌아가기">←</button><div><small>공성전 훈련</small><h2>영웅 연구소</h2><p>영웅을 고르고 실제 판정으로 기술을 시험합니다.</p></div><button id="heroLabStart" class="primary" type="button">연습 시작</button></header><div class="hero-lab-layout"><nav id="heroLabRoster" aria-label="영웅 목록"></nav><article class="hero-lab-detail"><div id="heroLabPortrait" class="hero-lab-portrait" aria-hidden="true"></div><div class="hero-lab-summary"><small id="heroLabRole"></small><h3 id="heroLabName"></h3><p id="heroLabBasic"></p></div><div id="heroLabAbilities" class="hero-lab-abilities"></div></article></div>`;document.querySelector('.home-content')?.append(heroLabScreen);
const homeStartPanel=$('homeStartPanel');
function renderHeroLab(heroId=selectedPracticeHero){
  selectedPracticeHero=heroId;localStorage.setItem('drop8-practice-hero',heroId);const hero=CORE_SIEGE_HEROES[heroId],basic=CORE_SIEGE_BASIC_ATTACKS[heroId];
  $('heroLabName').textContent=hero.name;$('heroLabRole').textContent=hero.role;$('heroLabBasic').textContent=`기본 공격 · ${basic.displayName??WEAPONS[basic.weaponId as WeaponId]?.name??'전용 무기'} · 탄창 ${basic.magazine} / ∞`;
  $('heroLabPortrait').setAttribute('data-hero',heroId);$('heroLabPortrait').textContent=hero.abilityIcons[2];
  $('heroLabAbilities').innerHTML=hero.abilityNames.map((name,index)=>`<section><i>${hero.abilityIcons[index]}</i><div><small>${['Q','E','F'][index]} · ${index===2?'궁극기':'일반 기술'} · ${hero.cooldowns[index]}초</small><h4>${name}</h4><p>${hero.abilityDescriptions[index]}</p></div></section>`).join('');
  document.querySelectorAll<HTMLElement>('#heroLabRoster [data-hero]').forEach((item)=>item.classList.toggle('selected',item.dataset.hero===heroId));
}
$('heroLabRoster').innerHTML=heroIds.map((id)=>{const hero=CORE_SIEGE_HEROES[id];return`<button type="button" data-hero="${id}"><i>${hero.abilityIcons[2]}</i><span><b>${hero.name}</b><small>${hero.role}</small></span></button>`;}).join('');
for(const button of Array.from(document.querySelectorAll<HTMLButtonElement>('#heroLabRoster [data-hero]')))button.onclick=()=>renderHeroLab(button.dataset.hero as CoreSiegeHeroId);
heroLabButton.onclick=()=>{homeStartPanel.classList.add('hidden');$('modePicker').classList.add('hidden');$('modeRooms').classList.add('hidden');heroLabScreen.classList.remove('hidden');document.body.classList.add('hero-lab-active');renderHeroLab();};
$('heroLabBack').onclick=()=>{heroLabScreen.classList.add('hidden');homeStartPanel.classList.remove('hidden');document.body.classList.remove('hero-lab-active');};
$('heroLabStart').onclick=async()=>{const button=$<HTMLButtonElement>('heroLabStart');button.disabled=true;button.textContent='연구소 여는 중...';error.textContent='';try{await net.create({nickname:nick(),gameMode:'coreSiege',practiceMode:true,heroId:selectedPracticeHero,publicRoom:false,maxHumans:1,aiCount:0,teamAiBlue:0,teamAiRed:0});finishRoomConnection();}catch(cause){error.textContent=cause instanceof Error?cause.message:'영웅 연구소를 열지 못했습니다.';}finally{button.disabled=false;button.textContent='연습 시작';}};
renderHeroLab();
const dominationHud=document.createElement('aside');dominationHud.id='dominationHud';dominationHud.className='domination-hud hidden';dominationHud.innerHTML='<b id="dominationMatchup">점령전 · 파랑팀 : 빨강팀</b><div><span id="dominationHumanScore">파랑 0</span><i id="dominationTargetScore">/ 240</i><span id="dominationAiScore">빨강 0</span></div><p id="dominationSitesText">A 중립 · B 중립</p>';gameEl.append(dominationHud);
const coreSiegeHud=document.createElement('aside');coreSiegeHud.id='coreSiegeHud';coreSiegeHud.className='core-siege-hud hidden';coreSiegeHud.innerHTML=`
  <div class="core-siege-score"><span id="blueCoreText">블루 코어 1500</span><b id="coreSiegeTimer">15:00</b><span id="redCoreText">레드 코어 1500</span></div>
  <div class="core-siege-level">
    <b id="coreSiegeHeroText">강습병</b><span id="coreSiegeLevelText">Lv.3</span>
    <div class="core-siege-xp"><i id="coreSiegeXpFill"></i></div><em id="coreSiegeXpText">0 / 100 XP</em>
    <strong id="coreSiegeSkillPointText">스킬 포인트 0</strong>
  </div>
  <div id="coreSiegeSkills" class="core-siege-skills">
    ${(['Q','E','F'] as const).map((key,index)=>`<article class="core-siege-skill-card" data-slot="${index+1}">
      <button class="core-siege-skill-cast" data-skill-cast="${index+1}" type="button"><span class="core-siege-skill-key" data-key="${key}">◇</span><span class="core-siege-skill-copy"><b>스킬</b><small>스킬 설명</small><em>잠김</em></span></button>
      <button class="core-siege-skill-upgrade" data-skill-upgrade="${index+1}" type="button" aria-label="${key} 스킬 강화">+</button>
    </article>`).join('')}
  </div>
  <small id="coreSiegeUpgradeText">공격 0 · 방어 0 · 쿨감 0</small>`;
gameEl.append(coreSiegeHud);
const coreSiegeSkills=$<HTMLElement>('coreSiegeSkills');$('inventoryHud').append(coreSiegeSkills);
for(const button of Array.from(coreSiegeSkills.querySelectorAll<HTMLButtonElement>('[data-skill-cast]')))button.onclick=()=>window.dispatchEvent(new CustomEvent('drop8-core-siege-target',{detail:{slot:Number(button.dataset.skillCast)}}));
for(const button of Array.from(coreSiegeSkills.querySelectorAll<HTMLButtonElement>('[data-skill-upgrade]')))button.onclick=()=>net.send('upgradeCoreSiegeAbility',{slot:Number(button.dataset.skillUpgrade)});
const coreSiegeSkillLabEnabled=new URLSearchParams(location.search).get('siegeSkillLab')==='1';
const coreSiegeSkillLab=document.createElement('aside');coreSiegeSkillLab.id='coreSiegeSkillLab';coreSiegeSkillLab.className='core-siege-skill-lab hidden';coreSiegeSkillLab.innerHTML=`<header><b>공성전 스킬 검수장</b><span id="skillLabHero">영웅 대기</span></header><div class="skill-lab-row"><button data-lab-action="hero" data-delta="-1" type="button" title="이전 영웅">‹</button><button data-lab-action="hero" data-delta="1" type="button" title="다음 영웅">›</button><button data-lab-action="targets" type="button">표적</button><button data-lab-action="reset" type="button">초기화</button></div><div class="skill-lab-row"><button data-lab-action="basic" type="button">평타</button><button data-lab-action="cast" data-slot="1" type="button">Q</button><button data-lab-action="cast" data-slot="2" type="button">E</button><button data-lab-action="cast" data-slot="3" type="button">F</button></div><div class="skill-lab-row"><button data-lab-rate="1" type="button">1×</button><button data-lab-rate="0.5" type="button">0.5×</button><button data-lab-rate="0" type="button">정지</button></div><code id="skillLabEvent">서버 판정 이벤트 대기</code>`;gameEl.append(coreSiegeSkillLab);
for(const button of Array.from(coreSiegeSkillLab.querySelectorAll<HTMLButtonElement>('[data-lab-action]')))button.onclick=()=>net.send('coreSiegeSkillLab',{action:button.dataset.labAction,delta:Number(button.dataset.delta??0),slot:Number(button.dataset.slot??0)});
for(const button of Array.from(coreSiegeSkillLab.querySelectorAll<HTMLButtonElement>('[data-lab-rate]')))button.onclick=()=>{const rate=Number(button.dataset.labRate);window.dispatchEvent(new CustomEvent('drop8-core-siege-lab-rate',{detail:{rate}}));coreSiegeSkillLab.querySelectorAll('[data-lab-rate]').forEach((item)=>item.classList.toggle('active',item===button));};
if(coreSiegeSkillLabEnabled){net.listeners.add(()=>{const local=net.snapshot?.players.find((player:any)=>String(player.id)===net.sessionId),active=net.roomConfig.gameMode==='coreSiege'&&net.snapshot?.phase==='ACTIVE';coreSiegeSkillLab.classList.toggle('hidden',!active);const hero=CORE_SIEGE_HEROES[(local?.heroId??'vanguard') as CoreSiegeHeroId]??CORE_SIEGE_HEROES.vanguard;$<HTMLElement>('skillLabHero').textContent=`${hero.name} · ${hero.role}`;});net.messages.add((type,payload)=>{if(type==='coreSiegeEffect')$<HTMLElement>('skillLabEvent').textContent=`${String(payload?.kind??'effect')} · ${Number(payload?.duration??0).toFixed(2)}초`;});}
const heroPracticePanel=document.createElement('aside');heroPracticePanel.id='heroPracticePanel';heroPracticePanel.className='hero-practice-panel hidden';heroPracticePanel.innerHTML=`<header><div><small>영웅 연구소</small><b id="practiceHeroName">강습병</b></div><button data-practice-action="reset" type="button">초기화</button></header><label>내 영웅<select id="practiceHeroSelect">${heroIds.map((id)=>`<option value="${id}">${CORE_SIEGE_HEROES[id].name}</option>`).join('')}</select></label><label>연습 상대<select id="practiceTargetSelect">${heroIds.map((id)=>`<option value="${id}">${CORE_SIEGE_HEROES[id].name}</option>`).join('')}</select></label><div class="practice-target-modes"><button data-practice-mode="hold" class="active" type="button">정지</button><button data-practice-mode="move" type="button">이동</button><button data-practice-mode="attack" type="button">공격</button><label><input id="practiceInvulnerable" type="checkbox"> 무적</label></div><div id="practiceSkillDetail" class="practice-skill-detail"></div><div class="practice-cast-row"><button data-practice-action="basic" type="button"><kbd>A</kbd><span>기본 공격</span></button>${(['Q','E','F'] as const).map((key,index)=>`<button data-practice-action="cast" data-slot="${index+1}" type="button"><kbd>${key}</kbd><span>기술</span></button>`).join('')}</div><output id="practiceResult">연습 상대를 공격해 보세요.</output>`;gameEl.append(heroPracticePanel);
function refreshPracticePanel(){
  const snapshot=net.snapshot,me=snapshot?.players.find((player:any)=>player.id===net.sessionId),target=snapshot?.players.find((player:any)=>player.id==='core-siege-practice-target'),heroId=(me?.heroId??selectedPracticeHero) as CoreSiegeHeroId,hero=CORE_SIEGE_HEROES[heroId]??CORE_SIEGE_HEROES.vanguard,active=Boolean(net.roomConfig.practiceMode&&snapshot?.phase==='ACTIVE');
  heroPracticePanel.classList.toggle('hidden',!active);gameEl.classList.toggle('practice-layout',active);if(!active)return;
  $<HTMLSelectElement>('practiceHeroSelect').value=heroId;$('practiceHeroName').textContent=`${hero.name} · ${hero.role}`;
  $('practiceSkillDetail').innerHTML=`<b>${CORE_SIEGE_BASIC_ATTACKS[heroId].displayName??WEAPONS[CORE_SIEGE_BASIC_ATTACKS[heroId].weaponId as WeaponId]?.name??'기본 공격'}</b><span>예비 탄약 ∞</span>${hero.abilityNames.map((name,index)=>`<p><i>${hero.abilityIcons[index]}</i><strong>${['Q','E','F'][index]} ${name}</strong><small>${hero.abilityDescriptions[index]}</small></p>`).join('')}`;
  $('practiceResult').textContent=target?`최근 ${Math.ceil(Number(target.lastHitDamage??0))} 피해 · 상대 HP ${Math.ceil(Number(target.hp??0))} / ${Math.ceil(Number(target.maxHp??0))}`:'연습 상대 준비 중...';
  for(const [index,button] of Array.from(heroPracticePanel.querySelectorAll<HTMLButtonElement>('[data-practice-action="cast"]')).entries())button.querySelector('span')!.textContent=hero.abilityNames[index]??'기술';
}
$<HTMLSelectElement>('practiceHeroSelect').onchange=(event)=>net.send('coreSiegePractice',{action:'hero',heroId:(event.target as HTMLSelectElement).value});
$<HTMLSelectElement>('practiceTargetSelect').onchange=(event)=>net.send('coreSiegePractice',{action:'targetHero',heroId:(event.target as HTMLSelectElement).value});
$<HTMLInputElement>('practiceInvulnerable').onchange=(event)=>net.send('coreSiegePractice',{action:'invulnerable',enabled:(event.target as HTMLInputElement).checked});
for(const button of Array.from(heroPracticePanel.querySelectorAll<HTMLButtonElement>('[data-practice-mode]')))button.onclick=()=>{heroPracticePanel.querySelectorAll('[data-practice-mode]').forEach((item)=>item.classList.toggle('active',item===button));net.send('coreSiegePractice',{action:'targetMode',mode:button.dataset.practiceMode});};
for(const button of Array.from(heroPracticePanel.querySelectorAll<HTMLButtonElement>('[data-practice-action]')))button.onclick=()=>net.send('coreSiegePractice',{action:button.dataset.practiceAction,slot:Number(button.dataset.slot??0)});
net.listeners.add(refreshPracticePanel);
type InstallPromptEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};
let pendingInstallPrompt:InstallPromptEvent|undefined;
let fullscreenPromptDismissed=false;
let fullscreenGameWasActive=false;

function installedDisplayMode(){return window.matchMedia('(display-mode: standalone)').matches||window.matchMedia('(display-mode: fullscreen)').matches||Boolean((navigator as Navigator&{standalone?:boolean}).standalone);}
function updateMobileFullscreenUi(){
  const gameActive=document.body.classList.contains('game-active');
  if(!gameActive&&fullscreenGameWasActive)fullscreenPromptDismissed=false;
  fullscreenGameWasActive=gameActive;
  const fullscreen=Boolean(document.fullscreenElement),installed=installedDisplayMode(),showPrompt=mobileControls.enabled&&gameActive&&!fullscreen&&!installed&&!fullscreenPromptDismissed;
  const prompt=$('mobileFullscreenPrompt'),reenter=$('mobileFullscreenReenter');
  prompt.classList.toggle('active',showPrompt);prompt.setAttribute('aria-hidden',String(!showPrompt));
  reenter.classList.toggle('active',mobileControls.enabled&&gameActive&&!fullscreen&&!installed&&!showPrompt);
}
async function enterMobileFullscreen(){
  if(!document.documentElement.requestFullscreen){fullscreenPromptDismissed=true;showGameNotice('이 브라우저에서는 전체화면 전환을 지원하지 않습니다.','warning');updateMobileFullscreenUi();return;}
  try{
    await document.documentElement.requestFullscreen({navigationUI:'hide'});
    try{await (screen.orientation as ScreenOrientation&{lock?:(orientation:string)=>Promise<void>}).lock?.('landscape');}catch{/* Browser or OS orientation policy may refuse the lock. */}
  }catch{fullscreenPromptDismissed=true;showGameNotice('전체화면 전환이 차단되었습니다. 화면 버튼으로 다시 시도할 수 있습니다.','warning');}
  syncGameViewport();updateMobileFullscreenUi();
}
$('mobileFullscreenStart').addEventListener('click',()=>void enterMobileFullscreen());
$('mobileFullscreenSkip').addEventListener('click',()=>{fullscreenPromptDismissed=true;updateMobileFullscreenUi();});
$('mobileFullscreenReenter').addEventListener('click',()=>void enterMobileFullscreen());
document.addEventListener('fullscreenchange',()=>{syncGameViewport();updateMobileFullscreenUi();});

window.addEventListener('beforeinstallprompt',(event)=>{
  event.preventDefault();pendingInstallPrompt=event as InstallPromptEvent;
  if(mobileControls.enabled&&!installedDisplayMode())$('mobileInstallBtn').classList.remove('hidden');
});
$('mobileInstallBtn').addEventListener('click',async()=>{
  if(!pendingInstallPrompt)return;
  await pendingInstallPrompt['prompt']();await pendingInstallPrompt.userChoice;pendingInstallPrompt=undefined;$('mobileInstallBtn').classList.add('hidden');
});
const iosMobile=/iPad|iPhone|iPod/.test(navigator.userAgent);
if(mobileControls.enabled&&iosMobile&&!installedDisplayMode())$('mobileInstallHint').classList.remove('hidden');
if('serviceWorker'in navigator&&(window.isSecureContext||['localhost','127.0.0.1'].includes(location.hostname)))window.addEventListener('load',()=>void navigator.serviceWorker.register('/sw.js'));
const error=$('homeError');
const nickname=$<HTMLInputElement>('nickname');
const roomCode=$<HTMLInputElement>('roomCode');
const password=$<HTMLInputElement>('password');
let selectedHomeMode:GameMode|null=null;

nickname.value=localStorage.getItem('drop8-nick')??'';
roomCode.value=new URLSearchParams(location.search).get('room')??'';

function nick(){
  const n=nickname.value.trim()||`유저${Math.floor(Math.random()*99)+1}`;
  localStorage.setItem('drop8-nick',n);
  return n;
}

function finishRoomConnection(){
  home.classList.add('hidden');
  lobby.classList.remove('hidden');
  history.replaceState(null,'',`?room=${net.room?.roomId}`);
  error.textContent='';
  stopRoomListPolling();
  audio.playUi('ui_confirm');
  render();
}

async function connect(create:boolean){
  error.textContent='연결 중...';
  try{
    const selection=resolveRoomCreation({gameMode:$<HTMLSelectElement>('gameMode').value,participation:$<HTMLSelectElement>('arenaParticipation').value,maxHumans:$<HTMLSelectElement>('maxHumans').value,aiCount:$<HTMLSelectElement>('arenaAiCount').value,killLimit:$<HTMLSelectElement>('arenaKillLimit').value,mapId:$<HTMLSelectElement>('createMapId').value});
    const mode=gameModeChoice(selection.gameMode),opts={nickname:nick(),password:password.value,roomPassword:password.value,publicRoom:$<HTMLInputElement>('publicRoom').checked,fillAi:selection.aiCount>0,difficulty:'normal',zoneSpeed:'normal',mapSizeMode:selection.mapId,mapId:selection.mapId,gameMode:selection.gameMode,matchFormat:mode.matchFormat,teamAiBlue:mode.teamAiBlue,teamAiRed:mode.teamAiRed,maxHumans:selection.maxHumans,aiCount:selection.aiCount,killLimit:selection.killLimit};
    if(create)await net.create(opts);
    else await net.join(roomCode.value.trim(),opts);
    finishRoomConnection();
  }catch(e){
    audio.playUi('ui_error');
    error.textContent=e instanceof Error?e.message:'방 연결 실패';
  }
}

let quickStartBusy=false;
let selectedQuickMap=normalizeQuickStartMap(localStorage.getItem('drop8-quick-map'));
let selectedQuickMode=normalizeQuickStartPreset(localStorage.getItem('drop8-quick-mode'));
const quickMapButtons=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-quick-map]'));
const quickModeSelector=document.createElement('div');
quickModeSelector.className='quick-mode-selector';quickModeSelector.setAttribute('role','group');quickModeSelector.setAttribute('aria-label','빠른 시작 전투 방식');
quickModeSelector.innerHTML='<button type="button" data-quick-mode="mixed">혼합전</button><button type="button" data-quick-mode="pvp">PvP</button>';
$('quickMapSelector').before(quickModeSelector);
const quickModeButtons=Array.from(quickModeSelector.querySelectorAll<HTMLButtonElement>('[data-quick-mode]'));
function refreshQuickStartCopy(){
  const pvp=selectedQuickMode==='pvp';
  const summary=document.querySelector<HTMLElement>('.quick-start-heading span');
  if(summary)summary.textContent=pvp?'진행 중인 PvP 우선 · 인간 8 · AI 없음':'진행 중인 전장 우선 · 인간 4 + AI 12';
  $('quickStartStatus').textContent=pvp?'선택한 맵의 PvP 방을 찾고, 없으면 새 PvP 전장을 엽니다.':'선택한 맵의 전장을 찾고, 없으면 새 전장을 엽니다.';
  $<HTMLButtonElement>('quickStartBtn').innerHTML=pvp?'<b>PvP 빠른 시작</b><span>선택한 맵 즉시 참가</span>':'<b>빠른 시작</b><span>추천 전장 즉시 참가</span>';
}
function selectQuickMode(value:unknown){
  selectedQuickMode=normalizeQuickStartPreset(value);localStorage.setItem('drop8-quick-mode',selectedQuickMode);
  for(const button of quickModeButtons){const selected=button.dataset.quickMode===selectedQuickMode;button.setAttribute('aria-pressed',String(selected));button.classList.toggle('selected',selected);}
  refreshQuickStartCopy();
}
function selectQuickMap(value:unknown){
  selectedQuickMap=normalizeQuickStartMap(value);
  localStorage.setItem('drop8-quick-map',selectedQuickMap);
  for(const button of quickMapButtons){const selected=button.dataset.quickMap===selectedQuickMap;button.setAttribute('aria-pressed',String(selected));button.classList.toggle('selected',selected);}
}
for(const button of quickMapButtons)button.onclick=()=>{selectQuickMap(button.dataset.quickMap);audio.playUi('ui_click');};
for(const button of quickModeButtons)button.onclick=()=>{selectQuickMode(button.dataset.quickMode);audio.playUi('ui_click');};
selectQuickMap(selectedQuickMap);
selectQuickMode(selectedQuickMode);

async function quickStart(){
  if(quickStartBusy)return;
  quickStartBusy=true;
  const button=$<HTMLButtonElement>('quickStartBtn'),status=$('quickStartStatus'),options=quickStartRoomOptions(nick(),selectedQuickMap,selectedQuickMode),pvp=selectedQuickMode==='pvp';
  button.disabled=true;button.textContent=pvp?'PvP 찾는 중...':'전장 찾는 중...';status.textContent=pvp?'선택한 맵의 진행 중인 PvP 방을 확인하고 있습니다.':'선택한 맵의 진행 중인 전장을 확인하고 있습니다.';error.textContent='';
  try{
    let rooms:PublicRoomInfo[]=[];
    try{
      const response=await fetch('/api/rooms',{cache:'no-store'});
      if(response.ok){const data=await response.json() as {rooms?:PublicRoomInfo[]};rooms=Array.isArray(data.rooms)?data.rooms:[];}
    }catch{/* The atomic quick pool remains available when the room list is temporarily unavailable. */}
    const candidates=rankQuickStartRooms(rooms,selectedQuickMap,selectedQuickMode);
    for(const candidate of candidates){
      try{
        status.textContent=`#${candidate.roomCode} 전장에 참가하는 중...`;
        await net.join(candidate.roomId||candidate.roomCode,options);
        finishRoomConnection();
        return;
      }catch{/* A room may fill between listing and seat reservation. Try the next room. */}
    }
    status.textContent=pvp?'참가 가능한 방이 없어 새 PvP 전장을 준비합니다.':'참가 가능한 방이 없어 새 전장을 준비합니다.';
    await net.joinOrCreate(options);
    finishRoomConnection();
  }catch(cause){
    audio.playUi('ui_error');
    const message=cause instanceof Error?cause.message:'빠른 시작에 실패했습니다.';
    error.textContent=message;status.textContent='연결하지 못했습니다. 잠시 후 다시 시도해주세요.';
  }finally{
    quickStartBusy=false;button.disabled=false;refreshQuickStartCopy();
  }
}

$('createBtn').onclick=()=>void connect(true);
$('joinBtn').onclick=()=>void connect(false);
$('quickStartBtn').onclick=()=>void quickStart();
$('refreshRoomsBtn').onclick=()=>void refreshRooms();
$('readyBtn').onclick=()=>net.send('ready');
$('startBtn').onclick=()=>net.send('start');
async function copyInvite(){
  const code=net.snapshot?.roomCode;
  if(!code)return;
  await navigator.clipboard.writeText(`${location.origin}?room=${code}`);
  const toast=$('copyToast');toast.classList.remove('hidden');window.setTimeout(()=>toast.classList.add('hidden'),1400);
}
$('copyBtn').onclick=()=>void copyInvite();
$('gameCodeText').onclick=()=>void copyInvite();
$('fieldRoomBadge').onclick=()=>void copyInvite();
$('rematchBtn').onclick=()=>net.send('rematch');
$('fillAi').onchange=sendSettings;
$('difficulty').onchange=sendSettings;
$('zoneSpeed').onchange=sendSettings;
$('mapSizeMode').onchange=sendSettings;
$('roomMapFilter').onchange=()=>renderRoomList(cachedRooms);
const gameModeSelect=$<HTMLSelectElement>('gameMode');
if(!gameModeSelect.querySelector('option[value="domination"]')){const option=document.createElement('option');option.value='domination';option.textContent='점령전';gameModeSelect.append(option);}
if(!gameModeSelect.querySelector('option[value="coreSiege"]')){const option=document.createElement('option');option.value='coreSiege';option.textContent='코어 공성전';gameModeSelect.append(option);}
const createMapSelect=$<HTMLSelectElement>('createMapId');
const arenaParticipationSelect=$<HTMLSelectElement>('arenaParticipation');
const maxHumansSelect=$<HTMLSelectElement>('maxHumans');
const arenaAiCountSelect=$<HTMLSelectElement>('arenaAiCount');
const arenaKillLimitSelect=$<HTMLSelectElement>('arenaKillLimit');
const arenaCreateHint=$('arenaCreateHint');
let previousCreateMode=gameModeSelect.value;
function updateCreateModeUi(){
  const arena=gameModeSelect.value==='openArena';
  const domination=gameModeSelect.value==='domination';
  const siege=gameModeSelect.value==='coreSiege';
  const spectator=arena&&arenaParticipationSelect.value==='spectate';
  arenaParticipationSelect.disabled=!arena;maxHumansSelect.disabled=!(arena||siege)||spectator;arenaAiCountSelect.disabled=!(arena||domination||siege)||spectator;arenaKillLimitSelect.disabled=!arena;createMapSelect.disabled=domination||siege;
  for(const option of arenaAiCountSelect.options)option.disabled=domination&&Number(option.value)>12;
  if(domination){createMapSelect.value='small';maxHumansSelect.value='4';if(previousCreateMode!=='domination'||Number(arenaAiCountSelect.value)<0||Number(arenaAiCountSelect.value)>12)arenaAiCountSelect.value='0';}
  if(spectator)arenaAiCountSelect.value='16';
  else if(arena){const limit=playableArenaAiLimit(maxHumansSelect.value);if(Number(arenaAiCountSelect.value)>limit)arenaAiCountSelect.value=String(limit);}
  const selection=resolveRoomCreation({gameMode:gameModeSelect.value,participation:arenaParticipationSelect.value,maxHumans:maxHumansSelect.value,aiCount:arenaAiCountSelect.value,killLimit:arenaKillLimitSelect.value,mapId:createMapSelect.value}),killLabel=selection.killLimit===0?'무제한':`${selection.killLimit}킬`,mapLabel=selection.mapId==='coreSiege'?'코어 전선':selection.mapId==='large'?'큰 맵':selection.mapId==='dock8'?'8번 부두':'작은 맵',createButton=$<HTMLButtonElement>('createBtn');
  const pvp=arena&&!selection.spectatorOnly&&selection.aiCount===0;
  createButton.disabled=false;createButton.textContent=selection.spectatorOnly?'관전방 만들기':siege?'공성전 새 방':domination?'점령전 새 방':pvp?'PvP 새 방':arena?'상시 전장 새 방':'배틀로얄 새 방';
  arenaCreateHint.textContent=selection.spectatorOnly?`AI 자동전투 관전 · ${mapLabel} · AI 16명 · ${killLabel} · 캐릭터 없음`:siege?`코어 전선 · 인간 ${selection.maxHumans}명 · AI ${selection.aiCount}명`:domination?`작은 맵 대각선 A/B 점령 · 인간 최대 4명 · ${selection.aiCount===0?'상대 AI 없음':`AI ${selection.aiCount}명`} · 풍부한 무기 · 240점 승리`:pvp?`PvP 개인전 · ${mapLabel} · 인간 최대 ${selection.maxHumans}명 · AI 없음 · ${killLabel}`:arena?`직접 플레이 · ${mapLabel} · 인간 ${selection.maxHumans}명 + AI ${selection.aiCount}명 = 총 ${selection.totalCombatants}명 · ${killLabel}`:`배틀로얄 · ${mapLabel} · 비행기 · 자기장 · 최후 생존`;
  previousCreateMode=gameModeSelect.value;
}
gameModeSelect.onchange=updateCreateModeUi;createMapSelect.onchange=updateCreateModeUi;arenaParticipationSelect.onchange=()=>{if(arenaParticipationSelect.value==='spectate'&&createMapSelect.value==='small')createMapSelect.value='large';updateCreateModeUi();};maxHumansSelect.onchange=updateCreateModeUi;arenaAiCountSelect.onchange=updateCreateModeUi;arenaKillLimitSelect.onchange=updateCreateModeUi;updateCreateModeUi();

type HomeStep='start'|'modes'|'rooms';
function showHomeStep(step:HomeStep){
  heroLabScreen.classList.add('hidden');
  document.body.classList.remove('hero-lab-active');
  $('homeStartPanel').classList.toggle('hidden',step!=='start');
  $('modePicker').classList.toggle('hidden',step!=='modes');
  $('modeRooms').classList.toggle('hidden',step!=='rooms');
  if(step==='rooms')void refreshRooms();
}
function selectHomeGameMode(value:unknown){
  const mode=gameModeChoice(value);selectedHomeMode=mode.id;
  gameModeSelect.value=mode.id;createMapSelect.value=mode.mapId;maxHumansSelect.value=String(mode.maxHumans);arenaAiCountSelect.value=String(mode.aiCount);arenaKillLimitSelect.value=String(mode.killLimit);arenaParticipationSelect.value='play';
  $('modeRoomsTag').textContent=mode.tag;$('modeRoomsTitle').textContent=mode.name;$('modeRoomsSummary').textContent=mode.summary;
  $<HTMLSelectElement>('roomMapFilter').value='all';document.querySelector<HTMLElement>('.room-filter-row')?.classList.toggle('hidden',mode.id==='domination'||mode.id==='coreSiege');
  updateCreateModeUi();renderRoomList(cachedRooms);showHomeStep('rooms');audio.playUi('ui_confirm');
}
const gameModeCards=$('gameModeCards');
for(const mode of GAME_MODE_CHOICES){const button=document.createElement('button');button.type='button';button.className=`game-mode-card mode-${mode.id}`;button.dataset.gameMode=mode.id;button.innerHTML=`<span>${mode.tag}</span><b>${mode.name}</b><small>${mode.summary}</small><i aria-hidden="true">→</i>`;button.onclick=()=>selectHomeGameMode(mode.id);gameModeCards.append(button);}
$('browseModesBtn').onclick=()=>{showHomeStep('modes');audio.playUi('ui_click');};
$('modePickerBackBtn').onclick=()=>showHomeStep('start');
$('modeRoomsBackBtn').onclick=()=>showHomeStep('modes');
showHomeStep('start');

const lobbyRules=document.createElement('div');lobbyRules.id='lobbyRules';lobbyRules.className='lobby-rules';
lobbyRules.innerHTML='<label>게임<select id="lobbyGameMode" disabled><option value="battleRoyale">배틀로얄</option><option value="openArena">상시 전투</option><option value="domination">점령전</option><option value="coreSiege">코어 공성전</option></select></label><label>방식<select id="lobbyMatchFormat"><option value="solo">개인전</option><option value="teams">팀전</option></select></label><label>인간<select id="lobbyMaxHumans"><option value="4">4명 · 2대2</option><option value="6">6명 · 3대3</option><option value="8" selected>8명 · 4대4</option></select></label><label class="solo-ai-setting">AI<select id="lobbyAiCount"><option value="0">0명</option><option value="4">4명</option><option value="8">8명</option><option value="12">12명</option></select></label><label class="team-ai-setting">파랑 AI<select id="lobbyTeamAiBlue"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label class="team-ai-setting">빨강 AI<select id="lobbyTeamAiRed"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label><label class="arena-kill-setting">목표 킬<select id="lobbyKillLimit"><option value="20">20</option><option value="40">40</option><option value="60">60</option><option value="0">무제한</option></select></label>';
$('hostSettings').prepend(lobbyRules);
const teamChooser=document.createElement('div');teamChooser.id='teamChooser';teamChooser.className='team-chooser hidden';teamChooser.innerHTML='<b>팀 선택</b><button type="button" data-team="blue">파랑팀 참가</button><button type="button" data-team="red">빨강팀 참가</button>';$('slots').before(teamChooser);
for(const button of Array.from(teamChooser.querySelectorAll<HTMLButtonElement>('[data-team]')))button.onclick=()=>net.send('selectTeam',{team:button.dataset.team});
const heroChooser=document.createElement('div');heroChooser.id='heroChooser';heroChooser.className='hero-chooser hidden';heroChooser.innerHTML=(Object.values(CORE_SIEGE_HEROES) as Array<(typeof CORE_SIEGE_HEROES)[CoreSiegeHeroId]>).map((hero)=>`<button type="button" data-hero="${hero.id}"><span class="hero-portrait" aria-hidden="true"><i class="hero-portrait-body"></i><i class="hero-portrait-mark">${hero.abilityIcons[2]}</i><i class="hero-portrait-gear"></i></span><span class="hero-choice-copy"><b>${hero.name}</b><em>${hero.role.replace(/[와과]/,' · ')}</em></span><small>${hero.abilityNames.map((name,index)=>`<strong><kbd>${['Q','E','F'][index]}</kbd>${name}</strong>`).join('')}</small></button>`).join('');teamChooser.after(heroChooser);
for(const button of Array.from(heroChooser.querySelectorAll<HTMLButtonElement>('[data-hero]')))button.onclick=()=>net.send('selectSiegeHero',{heroId:button.dataset.hero});
function syncLobbyRuleVisibility(){const mode=$<HTMLSelectElement>('lobbyGameMode').value,format=$<HTMLSelectElement>('lobbyMatchFormat'),siege=mode==='coreSiege';if(mode==='domination'||siege)format.value='teams';format.disabled=mode==='domination'||siege;const teams=format.value==='teams';lobbyRules.classList.toggle('team-format',teams);lobbyRules.classList.toggle('domination-mode',mode==='domination');lobbyRules.classList.toggle('core-siege-mode',siege);lobbyRules.classList.toggle('open-arena-mode',mode==='openArena');$<HTMLSelectElement>('mapSizeMode').disabled=siege;if(siege)$<HTMLSelectElement>('mapSizeMode').value='coreSiege';}

function sendSettings(){
  net.send('settings',{
    fillAi:$<HTMLInputElement>('fillAi').checked,
    difficulty:$<HTMLSelectElement>('difficulty').value,
    zoneSpeed:$<HTMLSelectElement>('zoneSpeed').value,
    mapSizeMode:$<HTMLSelectElement>('mapSizeMode').value,
    mapId:$<HTMLSelectElement>('mapSizeMode').value,
    gameMode:$<HTMLSelectElement>('lobbyGameMode').value,
    matchFormat:$<HTMLSelectElement>('lobbyMatchFormat').value,
    maxHumans:$<HTMLSelectElement>('lobbyMaxHumans').value,
    aiCount:$<HTMLSelectElement>('lobbyAiCount').value,
    teamAiBlue:$<HTMLSelectElement>('lobbyTeamAiBlue').value,
    teamAiRed:$<HTMLSelectElement>('lobbyTeamAiRed').value,
    killLimit:$<HTMLSelectElement>('lobbyKillLimit').value,
  });
}
for(const id of ['lobbyMatchFormat','lobbyMaxHumans','lobbyAiCount','lobbyTeamAiBlue','lobbyTeamAiRed','lobbyKillLimit'])$<HTMLSelectElement>(id).onchange=()=>{syncLobbyRuleVisibility();sendSettings();};
$<HTMLSelectElement>('lobbyGameMode').onchange=()=>{
  if($<HTMLSelectElement>('lobbyGameMode').value==='coreSiege'){
    $<HTMLSelectElement>('lobbyMaxHumans').value='6';
    $<HTMLSelectElement>('lobbyTeamAiBlue').value='2';
    $<HTMLSelectElement>('lobbyTeamAiRed').value='3';
  }
  syncLobbyRuleVisibility();sendSettings();
};
syncLobbyRuleVisibility();

const lobbyChatForm=$<HTMLFormElement>('lobbyChat');
const lobbyChatInput=$<HTMLInputElement>('lobbyChatInput');
function submitLobbyChat(){
  const text=normalizeChatText(lobbyChatInput.value);
  if(text){net.send('chat',{text});audio.playUi('chat_send');}
  lobbyChatInput.value='';
}
lobbyChatForm.onsubmit=(event)=>{event.preventDefault();event.stopPropagation();submitLobbyChat();};
lobbyChatInput.addEventListener('compositionstart',()=>{lobbyChatComposing=true;});
lobbyChatInput.addEventListener('compositionend',()=>{lobbyChatComposing=false;});
lobbyChatInput.addEventListener('keydown',(event)=>{
  event.stopPropagation();
  if(shouldSubmitChatKey(event,lobbyChatComposing)){event.preventDefault();submitLobbyChat();return;}
  if(event.key==='Escape'&&!event.repeat){event.preventDefault();lobbyChatInput.value='';lobbyChatInput.blur();}
});
lobbyChatInput.addEventListener('keyup',(event)=>event.stopPropagation());

const gameChatForm=$<HTMLFormElement>('gameChat');
const gameChatInput=$<HTMLInputElement>('gameChatInput');

function dispatchChatState(open:boolean){
  window.dispatchEvent(new CustomEvent('drop8-chat-state',{detail:{open}}));
}

function openChat(){
  if(chatting)return;
  chatting=true;
  setFieldChatCollapsed(false);
  inventoryOpen=false;
  $('inventoryPanel').classList.add('hidden');
  $('quickChat').classList.add('hidden');
  gameChatForm.classList.remove('hidden');
  gameChatInput.value='';
  dispatchChatState(true);
  requestAnimationFrame(()=>gameChatInput.focus());
}

function closeChat(clear=true){
  if(clear)gameChatInput.value='';
  chatting=false;
  chatComposing=false;
  gameChatInput.blur();
  gameChatForm.classList.add('hidden');
  dispatchChatState(false);
}

function submitChat(){
  const text=normalizeChatText(gameChatInput.value);
  if(text){net.send('chat',{text});audio.playUi('chat_send');}
  closeChat();
}

function cancelChat(){closeChat();}

gameChatForm.onsubmit=(e)=>{
  e.preventDefault();
  e.stopPropagation();
  submitChat();
};

gameChatInput.addEventListener('compositionstart',()=>{chatComposing=true;});
gameChatInput.addEventListener('compositionend',()=>{chatComposing=false;});
gameChatInput.addEventListener('keydown',(e)=>{
  e.stopPropagation();
  if(shouldSubmitChatKey(e,chatComposing)){
    e.preventDefault();
    submitChat();
    return;
  }
  if(e.key==='Escape'&&!e.repeat){
    e.preventDefault();
    cancelChat();
  }
});
gameChatInput.addEventListener('keyup',(e)=>e.stopPropagation());

function isEditableTarget(target:EventTarget|null){
  return target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement||target instanceof HTMLSelectElement||(target instanceof HTMLElement&&target.isContentEditable);
}

window.addEventListener('keydown',(e)=>{
  if(e.repeat||isEditableTarget(e.target))return;
  if(e.key==='Enter'&&!lobby.classList.contains('hidden')){e.preventDefault();lobbyChatInput.focus();return;}
  if(e.key==='Enter'&&!gameEl.classList.contains('hidden')&&!chatting){
    e.preventDefault();
    openChat();
    return;
  }
  if(e.key==='Tab'&&!gameEl.classList.contains('hidden')&&!chatting){
    e.preventDefault();inventoryOpen=!inventoryOpen;$('inventoryPanel').classList.toggle('hidden',!inventoryOpen);return;
  }
  if((e.key==='t'||e.key==='T')&&!gameEl.classList.contains('hidden')&&!chatting){
    e.preventDefault();$('quickChat').classList.toggle('hidden');
  }
});

for(const button of Array.from(document.querySelectorAll<HTMLButtonElement>('#quickChat button'))){
  button.onclick=()=>{
    net.send('chat',{text:button.dataset.msg??''});
    $('quickChat').classList.add('hidden');
  };
}

net.listeners.add(render);
net.messages.add((type,p)=>{
  if(type==='chat')addMessage(p);
  if(type==='aiDialogue'&&p?.loggable!==false){const lineId=String(p?.lineId??'');const legacy=(AI_DIALOGUE_LINES as Record<string,string>)[lineId];addMessage({...p,channel:'ai',sender:p?.sender??'AI',text:legacy??String(p?.text??'')});}
  if(type==='killfeed')addKill(p);
  if(type==='result'){
    $('result').classList.remove('hidden');
    $('resultTitle').textContent=p.winner?`${p.winner} 승리!`:'게임 종료';
    $('resultStats').textContent=(p.placements??[]).map((n:string,i:number)=>`${i+1}위 ${n}`).join(' · ');
    const me=net.snapshot?.players.find((player)=>player.id===net.sessionId);audio.playLocal(p.winner&&p.winner===me?.name?'victory':'defeat');
  }
  if(type==='pickupResult')showPickupResult(p);
  if(type==='kicked')void exitRoom(String(p?.message??'방장에 의해 방에서 나갔습니다.'),false);
  if(type==='notice')showGameNotice(p?.message??p,p?.type??'warning',Number(p?.duration)||undefined);
  if(type==='hostChanged')showGameNotice(`${String(p?.hostName??'다른 플레이어')}님이 새로운 방장이 되었습니다.`,'info',2200);
  if(type==='respawned')showGameNotice('상시 전장에 다시 투입되었습니다.','info',1500);
  if(type==='arenaRoundResult'){const me=net.snapshot?.players.find((player)=>player.id===net.sessionId);audio.playLocal(net.roomConfig.spectatorOnly?'victory':p?.winnerId===me?.id?'victory':'defeat');}
  if(type==='error'){const message=String(p?.message??p??'오류가 발생했습니다.');if(gameEl.classList.contains('hidden')&&lobby.classList.contains('hidden'))error.textContent=message;else showGameNotice(message,'error');}
});

function addMessage(p:any){
  const lobbyChannel=p.channel==='lobby'||(p.channel==='system'&&net.snapshot?.phase==='LOBBY');
  const box=lobbyChannel?$('lobbyMessages'):$('gameMessages');
  const d=document.createElement('div');
  d.className=`message ${p.channel==='system'?'system':p.channel==='ai'?'ai':''}`;
  const channel=p.channel==='nearby'?'근거리':p.channel==='spectator'?'관전':p.channel==='system'?'시스템':p.channel==='ai'?'AI':'';
  d.textContent=`${channel?`[${channel}] `:''}${p.sender}: ${p.text}`;
  box.append(d);
  const limit=box.id==='gameMessages'?8:30;
  while(box.children.length>limit)box.firstChild?.remove();
  box.scrollTop=box.scrollHeight;
  if(box.id==='gameMessages'&&fieldChatCollapsed&&!chatting){fieldChatUnread++;updateFieldChatToggle();}
}

function addKill(p:any){
  const d=document.createElement('div');
  d.className='kill';
  d.textContent=`${p.killer} 처치 ${p.victim}`;
  $('killfeed').append(d);
  setTimeout(()=>d.remove(),6000);
}

function createGame(){
  const viewport=gameViewportSize();
  game=new Phaser.Game({
    type:Phaser.WEBGL,
    parent:'gameCanvas',
    width:viewport.width,
    height:viewport.height,
    backgroundColor:'#153424',
    render:{antialias:true,antialiasGL:true,roundPixels:false,powerPreference:'high-performance'},
    fps:{target:60,smoothStep:true},
    input:{activePointers:4,smoothFactor:.15},
    scene:new GameScene(net),
    scale:{mode:Phaser.Scale.RESIZE,width:viewport.width,height:viewport.height,autoRound:true,resizeInterval:50},
  });
  syncGameViewport();
}

function gameViewportSize(){
  const viewport=window.visualViewport;
  return{width:Math.max(320,Math.round(viewport?.width??window.innerWidth)),height:Math.max(240,Math.round(viewport?.height??window.innerHeight))};
}

let viewportSyncFrame=0;
function syncGameViewport(){
  cancelAnimationFrame(viewportSyncFrame);
  viewportSyncFrame=requestAnimationFrame(()=>{
    const viewport=gameViewportSize();
    document.documentElement.style.setProperty('--drop8-viewport-height',`${viewport.height}px`);
    if(game&&!gameEl.classList.contains('hidden'))game.scale.resize(viewport.width,viewport.height);
  });
}
window.addEventListener('resize',syncGameViewport,{passive:true});
window.visualViewport?.addEventListener('resize',syncGameViewport,{passive:true});
window.addEventListener('orientationchange',()=>{
  syncGameViewport();
  window.setTimeout(syncGameViewport,120);
  window.setTimeout(syncGameViewport,360);
},{passive:true});
syncGameViewport();

function reserveAmmo(me:any,equipped:string){
  const ammoType=WEAPONS[equipped as WeaponId]?.ammoType as AmmoType|undefined;
  if(ammoType==='pistol_ammo')return me?.pistolAmmo??0;
  if(ammoType==='standard_ammo')return me?.standardAmmo??0;
  if(ammoType==='shotgun_ammo')return me?.shotgunAmmo??0;
  if(ammoType==='rocket_ammo')return me?.rocketAmmo??0;
  if(ammoType==='rail_slug')return me?.railSlugAmmo??0;
  if(ammoType==='laser_cell')return me?.laserCellAmmo??0;
  if(ammoType==='chicken_capsule')return me?.chickenCapsuleAmmo??0;
  if(ammoType==='fuel_ammo')return me?.fuelAmmo??0;
  if(ammoType==='adhesive_charge')return me?.adhesiveCharge??0;
  if(ammoType==='silver_bolt')return me?.silverBoltAmmo??0;
  return 0;
}
function ammoLabel(equipped:string){const type=WEAPONS[equipped as WeaponId]?.ammoType as Exclude<AmmoType,'none'>|undefined;return type?AMMO_DISPLAY_NAMES[type]:'';}

function magazineFor(me:any,id:string){
  if(id==='pistol')return me?.pistolMagazine??0;
  if(id==='stun_gun')return me?.stunGunMagazine??0;
  if(id==='smg')return me?.smgMagazine??0;
  if(id==='rifle')return me?.rifleMagazine??0;
  if(id==='shotgun')return me?.shotgunMagazine??0;
  if(id==='sniper')return me?.sniperMagazine??0;
  if(id==='railgun')return me?.railgunMagazine??0;
  if(id==='laser_cannon')return me?.laserCannonMagazine??0;
  if(id==='boomerang')return me?.boomerangMagazine??0;
  if(id==='rc_car')return me?.rcCarMagazine??0;
  if(id==='chicken_blaster')return me?.chickenBlasterMagazine??0;
  if(id==='bazooka')return me?.bazookaMagazine??0;
  if(id==='flamethrower')return me?.flamethrowerMagazine??0;
  if(id==='adhesive_sprayer')return me?.adhesiveSprayerMagazine??0;
  if(id==='silver_crossbow')return me?.silverCrossbowMagazine??0;
  return 0;
}

function weaponName(id:string){return WEAPONS[id as WeaponId]?.name??MELEE_WEAPONS[id as keyof typeof MELEE_WEAPONS]?.name??'비어 있음';}
function displayedWeaponName(me:any,id:string){
  const profile=net.roomConfig.gameMode==='coreSiege'?CORE_SIEGE_BASIC_ATTACKS[(me?.heroId??'vanguard') as CoreSiegeHeroId]:undefined;
  return profile?.weaponId===id&&profile.displayName?profile.displayName:weaponName(id);
}

function weaponAmmoText(me:any,id:string,withLabel=true){
  if(!id)return'';
  const siege=net.roomConfig.gameMode==='coreSiege';
  const heroId=(me?.heroId??'vanguard') as CoreSiegeHeroId,profile=CORE_SIEGE_BASIC_ATTACKS[heroId]??CORE_SIEGE_BASIC_ATTACKS.vanguard;
  if(siege&&heroId==='medigel'&&id===profile.weaponId)return`${Math.ceil(Number(me?.medicalGel??0))}/100 의료액`;
  const label=withLabel&&ammoLabel(id)?` · ${ammoLabel(id)}`:'';
  return`${magazineFor(me,id)} / ${siege?'∞':reserveAmmo(me,id)}발${label}`;
}

function setSlot(id:string,name:string,sub:string,active:boolean,empty:boolean,icon?:string){
  const slot=$(id);slot.classList.toggle('active',active);slot.classList.toggle('empty',empty);
  const b=slot.querySelector('b');const small=slot.querySelector('small');if(b)b.textContent=name;if(small)small.textContent=sub;
  const iconElement=slot.querySelector<HTMLElement>('.slot-icon');if(iconElement&&icon!==undefined)iconElement.textContent=icon;
  const mobileSlotNumber={slotPrimary:1,slotSecondary:2,slotMelee:3}[id as 'slotPrimary'|'slotSecondary'|'slotMelee'];
  const mobileButton=mobileSlotNumber?document.querySelector<HTMLElement>(`[data-mobile-action="weapon${mobileSlotNumber}"]`):null;
  if(mobileButton){
    mobileButton.classList.toggle('active',active);mobileButton.classList.toggle('empty',empty);
    const mobileIcon=mobileButton.querySelector<HTMLElement>('.mobile-weapon-icon');if(mobileIcon&&icon!==undefined)mobileIcon.textContent=icon;
    mobileButton.title=name;mobileButton.setAttribute('aria-label',`${mobileSlotNumber}번 ${name}${active?' 선택됨':''}`);
  }
}

function mountedFusionRobot(me:any){
  if(!me?.isDriving||!me?.vehicleId)return undefined;
  return net.snapshot?.motorcycles?.find((vehicle:any)=>vehicle.id===me.vehicleId&&vehicle.vehicleKind==='fusion_robot');
}

function localFusionRobot(){return mountedFusionRobot(net.snapshot?.players?.find((player:any)=>player.id===net.sessionId));}

let weaponSlotDragFrom=0;
let suppressWeaponSlotClickUntil=0;
const weaponSlotElements=Array.from(document.querySelectorAll<HTMLElement>('.weapon-slot'));
for(const slot of weaponSlotElements){
  const slotNumber=Number(slot.dataset.weaponSlot);
  slot.addEventListener('click',()=>{if(performance.now()<suppressWeaponSlotClickUntil)return;net.send('switch',{slot:slotNumber});slot.blur();});
  slot.addEventListener('keydown',(event)=>{if(event.key==='Enter'){event.preventDefault();net.send('switch',{slot:slotNumber});slot.blur();}});
  slot.addEventListener('dragstart',(event)=>{if(localFusionRobot()){event.preventDefault();return;}weaponSlotDragFrom=slotNumber;slot.classList.add('dragging');event.dataTransfer?.setData('text/plain',String(slotNumber));if(event.dataTransfer)event.dataTransfer.effectAllowed='move';});
  slot.addEventListener('dragover',(event)=>{event.preventDefault();if(localFusionRobot())return;if(weaponSlotDragFrom&&weaponSlotDragFrom!==slotNumber)slot.classList.add('drop-target');if(event.dataTransfer)event.dataTransfer.dropEffect='move';});
  slot.addEventListener('dragleave',()=>slot.classList.remove('drop-target'));
  slot.addEventListener('drop',(event)=>{event.preventDefault();const from=Number(event.dataTransfer?.getData('text/plain')||weaponSlotDragFrom);slot.classList.remove('drop-target');if(!localFusionRobot()&&(from===1||from===2)&&from!==slotNumber){net.send('swapWeaponSlots',{from,to:slotNumber});suppressWeaponSlotClickUntil=performance.now()+350;}weaponSlotDragFrom=0;weaponSlotElements.forEach((item)=>item.classList.remove('dragging','drop-target'));});
  slot.addEventListener('dragend',()=>{weaponSlotDragFrom=0;suppressWeaponSlotClickUntil=performance.now()+250;weaponSlotElements.forEach((item)=>item.classList.remove('dragging','drop-target'));});
  slot.addEventListener('contextmenu',(event)=>{event.preventDefault();if(!localFusionRobot())net.send('dropWeapon',{slot:slotNumber});});
}

for(const slot of Array.from(document.querySelectorAll<HTMLElement>('.weapon-select-slot'))){
  const slotNumber=Number(slot.dataset.weaponSlot);
  const select=()=>{net.send('switch',{slot:slotNumber});slot.blur();};
  slot.addEventListener('click',select);slot.addEventListener('keydown',(event)=>{if(event.key==='Enter'){event.preventDefault();select();}});
}

function renderInventory(me:any){
  const primary=me?.primary??'',secondary=me?.secondary??'',melee=me?.melee??'fists',equipped=me?.equipped??'fists';
  const fusionRobot=mountedFusionRobot(me),exoRobot=Boolean(me?.exoActive),fusionSlot=Math.max(1,Math.min(4,Math.floor(Number(fusionRobot?.fusionWeaponSlot||1)))) as FusionRobotWeaponSlot,serverTime=Number(net.snapshot?.serverTime??0),cooldown=(readyAt:any)=>Math.max(0,Number(readyAt??0)-serverTime),readyText=(readyAt:any)=>{const left=cooldown(readyAt);return left>0?`충전 ${left.toFixed(1)}초`:'발사 준비';};
  $('inventoryHud').classList.toggle('fusion-loadout',Boolean(fusionRobot||exoRobot));weaponSlotElements.forEach((slot)=>{slot.draggable=!fusionRobot&&!exoRobot;slot.setAttribute('aria-label',fusionRobot||exoRobot?`${slot.dataset.weaponSlot}번 로봇 무장`:slot.dataset.weaponSlot==='1'?'1번 주무기':'2번 보조무기');});
  if(me?.chickenTransformed){
    const left=Math.max(0,Number(me?.chickenUntil??0)-Number(net.snapshot?.serverTime??0));$('mobileWeaponName').textContent='꼬꼬 변신';$('mobileAmmoText').textContent=`부리 · ${left.toFixed(1)}초`;
  }else if(fusionRobot){
    setSlot('slotPrimary',FUSION_ROBOT_WEAPON_NAMES[1],readyText(fusionRobot.fusionMissileReadyAt),fusionSlot===1,false,'▰');
    setSlot('slotSecondary',FUSION_ROBOT_WEAPON_NAMES[2],readyText(fusionRobot.fusionLaserReadyAt),fusionSlot===2,false,'━');
    setSlot('slotMelee',FUSION_ROBOT_WEAPON_NAMES[3],readyText(fusionRobot.fusionMachineGunReadyAt),fusionSlot===3,false,'≡');
  }else if(exoRobot){
    const emp=me?.exoKind==='emp',heat=Math.ceil(Number(me?.heat??0)),disabled=Math.max(0,Number(me?.empDisabledUntil??0)-serverTime);
    setSlot('slotPrimary',emp?'전기 기관총':'중기관총',disabled>0?`EMP 정지 ${disabled.toFixed(1)}초`:`과열 ${heat}/100`,true,false,'≡');
    setSlot('slotSecondary',emp?'EMP 장판':'전방 충격파',emp?readyText(me?.empPulseReadyAt):'우클릭',false,false,emp?'◎':'━');
    setSlot('slotMelee',emp?'전기 타격':'로켓 주먹','로봇 전용 무장',false,false,'✊');
  }else{
    setSlot('slotPrimary',displayedWeaponName(me,primary),primary?weaponAmmoText(me,primary):'주무기 없음',equipped===primary,!primary,'▰');
    setSlot('slotSecondary',displayedWeaponName(me,secondary),secondary?weaponAmmoText(me,secondary):'보조무기 없음',equipped===secondary,!secondary,'⌐');
    setSlot('slotMelee',displayedWeaponName(me,melee),'근접 무기',equipped===melee||(!melee&&equipped==='fists'),false,'✊');
  }
  for(const [slotId,weaponId] of [['slotPrimary',primary],['slotSecondary',secondary]] as const){
    const slot=$(slotId);const active=Boolean(!fusionRobot&&me?.reloading&&me?.reloadWeapon===weaponId);
    slot.classList.toggle('reloading',active);slot.style.setProperty('--reload-progress',`${Math.round((me?.reloadProgress??0)*100)}%`);
    if(active){const small=slot.querySelector('small');if(small)small.textContent=`재장전 ${Math.round((me.reloadProgress??0)*100)}%`;}
  }
  const missing=Math.max(0,Number(me?.maxHp??100)-Number(me?.hp??100));
  const autoHeal=(me?.medkits??0)>0&&(missing>25||(me?.bandages??0)<=0)?'구급상자':(me?.bandages??0)>0?'붕대':(me?.medkits??0)>0?'구급상자':'회복 없음';
  const throwable:ThrowableType|''=isThrowableType(me?.throwableType)?me.throwableType:'';
  if(fusionRobot)setSlot('slotThrowable',FUSION_ROBOT_WEAPON_NAMES[4],readyText(fusionRobot.fusionEmpReadyAt),fusionSlot===4,false,'◎');
  else if(exoRobot)setSlot('slotThrowable',me?.exoKind==='emp'?'EMP 과부하':'로봇 내구도',`${Math.ceil(Number(me?.exoHp??0))} HP · ${Math.ceil(Math.max(0,Number(me?.exoEndsAt??0)-serverTime))}초`,false,false,'◆');
  else setSlot('slotThrowable',throwable?LOOT_LABELS[throwable]: '투척물 없음',throwable?`수량 ${me?.throwableCount??0}개`:'파편탄 · 연막탄 · 화염탄',equipped===throwable,!throwable,'●');
  if(fusionRobot){
    const readyAt=[0,fusionRobot.fusionMissileReadyAt,fusionRobot.fusionLaserReadyAt,fusionRobot.fusionMachineGunReadyAt,fusionRobot.fusionEmpReadyAt][fusionSlot],left=cooldown(readyAt);
    $('mobileWeaponName').textContent='로봇 무장';
    $('mobileAmmoText').textContent=left>0?`${left.toFixed(1)}초`:'준비';
  }else if(exoRobot){
    $('mobileWeaponName').textContent=me?.exoKind==='emp'?'EMP 로봇':'강철 로봇';
    $('mobileAmmoText').textContent=`열 ${Math.ceil(Number(me?.heat??0))}%`;
  }else if(equipped&&WEAPONS[equipped as WeaponId]?.ammoType!=='none'){
    $('mobileWeaponName').textContent=displayedWeaponName(me,equipped);
    if(me?.reloading&&me?.reloadWeapon===equipped){$('mobileWeaponName').textContent='재장전';$('mobileAmmoText').textContent=`${Math.round((me?.reloadProgress??0)*100)}%`;}
    else $('mobileAmmoText').textContent=weaponAmmoText(me,equipped,false).replace('발','');
  }else if(throwable&&equipped===throwable){
    $('mobileWeaponName').textContent=LOOT_LABELS[throwable];
    $('mobileAmmoText').textContent=`${me?.throwableCount??0}개`;
  }else{
    $('mobileWeaponName').textContent=displayedWeaponName(me,equipped||melee);
    $('mobileAmmoText').textContent='근접';
  }
  const hasTankKey=Number(me?.tankKeyCount??0)>0;
  const exoParts=Number(me?.exoHeadCount??0)+Number(me?.exoCoreCount??0)+Number(me?.exoLimbsCount??0),exoReady=exoParts===3;
  const empExoParts=Number(me?.empExoHeadCount??0)+Number(me?.empExoCoreCount??0)+Number(me?.empExoLimbsCount??0),empExoReady=empExoParts===3,fusionReady=exoReady&&empExoReady,empExo=me?.exoKind==='emp';
  const partCells:[[string,number],[string,number],[string,number],[string,number],[string,number],[string,number]]=[
    ['mobileAssaultHead',Number(me?.exoHeadCount??0)],['mobileAssaultCore',Number(me?.exoCoreCount??0)],['mobileAssaultLimbs',Number(me?.exoLimbsCount??0)],
    ['mobileEmpHead',Number(me?.empExoHeadCount??0)],['mobileEmpCore',Number(me?.empExoCoreCount??0)],['mobileEmpLimbs',Number(me?.empExoLimbsCount??0)],
  ];
  for(const [id,count] of partCells)$(id).classList.toggle('collected',count>0);
  $('mobileAssaultPartsText').textContent=`${exoParts}/3`;$('mobileEmpPartsText').textContent=`${empExoParts}/3`;$('mobileFusionPartsText').textContent=fusionReady?'합체 가능':`합체 ${exoParts+empExoParts}/6`;
  $('mobileRobotParts').classList.toggle('assault-ready',exoReady);$('mobileRobotParts').classList.toggle('emp-ready',empExoReady);$('mobileRobotParts').classList.toggle('fusion-ready',fusionReady);
  const droneCount=Math.max(0,Number(me?.hunterDroneCount??0)),mineCount=Math.max(0,Number(me?.spiderMineCount??0)),trapCount=Math.max(0,Number(me?.stripTrapCount??0)),tacticalTotal=droneCount+mineCount+trapCount;
  $('mobileDroneCount').textContent=`${droneCount}/4`;$('mobileMineCount').textContent=String(mineCount);$('mobileTrapCount').textContent=String(trapCount);$('mobileTacticalCount').textContent=String(tacticalTotal);
  const canDeploy=Boolean(me?.alive&&me?.phase==='landed'&&!me?.isDriving&&!me?.isSwimming&&!me?.isVaulting&&!me?.chickenTransformed&&!me?.werewolf?.transformed&&!me?.werewolf?.transformPreparing&&!me?.werewolf?.ritualizing);
  $<HTMLButtonElement>('mobileDroneAction').disabled=!canDeploy||droneCount<=0;$<HTMLButtonElement>('mobileMineAction').disabled=!canDeploy||mineCount<=0;$<HTMLButtonElement>('mobileTrapAction').disabled=!canDeploy||trapCount<=0;
  const canAssemble=canDeploy&&!me?.exoActive&&!me?.exoAssembling;
  $<HTMLButtonElement>('mobileAssaultRobotAction').disabled=!canAssemble||!exoReady;$<HTMLButtonElement>('mobileEmpRobotAction').disabled=!canAssemble||!empExoReady;$<HTMLButtonElement>('mobileFusionRobotAction').disabled=!canAssemble||!fusionReady;
  setSlot('slotDrone','호위 드론',`${me?.hunterDroneCount??0}/4`,false,(me?.hunterDroneCount??0)<=0);
  setSlot('slotAttachment',me?.exoActive?(empExo?'청색 EMP 로봇':'강철 엑소슈트'):me?.exoAssembling?(empExo?'EMP 로봇 결합 중':'엑소슈트 결합 중'):fusionReady?'합체 로봇 준비':empExoReady?'EMP 로봇 완성':exoReady?'엑소슈트 완성':hasTankKey?'탱크 열쇠':'장착류',me?.exoActive?`HP ${Math.ceil(me.exoHp??0)} · ${Math.max(0,Math.ceil(Number(me.exoEndsAt??0)-Number(net.snapshot?.serverTime??0)))}초`:me?.exoAssembling?`${Math.max(0,Math.ceil((Number(me.exoAssemblyEndsAt??0)-Number(net.snapshot?.serverTime??0))*10)/10)}초`:fusionReady?'V 영구 기체 결합':empExoReady?'C 조립 가능':exoReady?'Z 조립 가능':empExoParts||exoParts?`강철 ${exoParts}/3 · EMP ${empExoParts}/3`:hasTankKey?'중앙 탱크 탑승 가능':'비어 있음',Boolean(me?.exoActive||me?.exoAssembling||fusionReady),!hasTankKey&&exoParts===0&&empExoParts===0&&!me?.exoActive);
  setSlot('slotDeployable','설치류',`트랩 ${me?.stripTrapCount??0} · 마인 ${me?.spiderMineCount??0}`,false,(me?.stripTrapCount??0)<=0&&(me?.spiderMineCount??0)<=0);
  setSlot('slotHeal',autoHeal,`붕대 ${me?.bandages??0} · 키트 ${me?.medkits??0}`,false,autoHeal==='회복 없음');
  const bandages=Math.max(0,Number(me?.bandages??0)),medkits=Math.max(0,Number(me?.medkits??0)),healTotal=bandages+medkits;
  $('mobileHealText').textContent=`붕 ${bandages} · 킷 ${medkits}`;
  const mobileHealCount=$('mobileHealCount');mobileHealCount.textContent=String(healTotal);mobileHealCount.classList.toggle('empty',healTotal<=0);
  $('armorText').textContent=String(Math.ceil(me?.armor??0));
  ($('armorBar') as HTMLElement).style.width=`${Math.max(0,Math.min(100,me?.armor??0))}%`;
  const details=[
    ['주무기',primary?`${displayedWeaponName(me,primary)} · ${weaponAmmoText(me,primary,false)}`:'비어 있음'],
    ['보조무기',secondary?`${displayedWeaponName(me,secondary)} · ${weaponAmmoText(me,secondary,false)}`:'비어 있음'],
    ['근접',displayedWeaponName(me,melee)],['은화살',String(me?.silverBoltAmmo??0)],['끈끈이 용액',String(me?.adhesiveCharge??0)],['호위 드론',`${me?.hunterDroneCount??0}/4`],['스트립 트랩',String(me?.stripTrapCount??0)],['스파이더 마인',`${me?.spiderMineCount??0}/2`],['탱크 열쇠',hasTankKey?'보유':'없음'],['엑소슈트 파츠',`머리 ${me?.exoHeadCount?'O':'X'} · 코어 ${me?.exoCoreCount?'O':'X'} · 팔다리 ${me?.exoLimbsCount?'O':'X'}`],['EMP 로봇 파츠',`머리 ${me?.empExoHeadCount?'O':'X'} · 코어 ${me?.empExoCoreCount?'O':'X'} · 팔다리 ${me?.empExoLimbsCount?'O':'X'}`],
    ['권총탄',String(me?.pistolAmmo??0)],['일반 총알',String(me?.standardAmmo??0)],['샷건탄',String(me?.shotgunAmmo??0)],['로켓탄',String(me?.rocketAmmo??0)],['변이 캡슐',String(me?.chickenCapsuleAmmo??0)],['연료',String(me?.fuelAmmo??0)],
    ['투척무기',throwable?`${LOOT_LABELS[throwable]} x${me?.throwableCount??0}`:'비어 있음'],['방탄조끼',`${Math.ceil(me?.armor??0)}%`],['붕대',String(me?.bandages??0)],['구급상자',String(me?.medkits??0)],
  ];
  $('inventoryDetails').innerHTML=details.map(([label,value])=>`<div class="inventory-detail"><b>${label}</b><span>${value}</span></div>`).join('');
}

function escapeArenaHtml(value:string){return value.replace(/[&<>"']/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]??char));}

function renderArenaScoreboard(){
  const panel=$('arenaScoreboardPanel');
  const arena=net.roomConfig.gameMode!=='battleRoyale';
  const domination=net.roomConfig.gameMode==='domination';
  const siege=net.roomConfig.gameMode==='coreSiege';
  const pvp=net.roomConfig.gameMode==='openArena'&&Number(net.roomConfig.configuredAiCount)===0&&!net.roomConfig.spectatorOnly;
  panel.classList.toggle('hidden',!arena);
  if(!arena){$('arenaRoundResult').classList.add('hidden');return;}
  const status=net.arenaStatus??{};
  const limit=Number(net.roomConfig.killLimit??status.killLimit??0);
  const spectatorOnly=Boolean(net.roomConfig.spectatorOnly);
  panel.querySelector('h3')!.textContent=siege?'코어 공성전 기록':domination?'점령전 전투 기록':pvp?'PvP 전장 순위':'상시 전장 순위';
  $('arenaPopulationText').textContent=siege
    ?`파랑 AI ${net.roomConfig.teamAiBlue}명 · 빨강 AI ${net.roomConfig.teamAiRed}명 · 포탑 돌파 · 코어 파괴`
    :domination
    ?`파랑 AI ${net.roomConfig.teamAiBlue}명 · 빨강 AI ${net.roomConfig.teamAiRed}명 · 아군 피해 없음 · 부활 가능`
    :spectatorOnly
    ?`AI 생존 ${Number(status.aliveAi??0)} / ${net.roomConfig.configuredAiCount} · 관전자 ${Number(status.spectators??0)}명 · ${limit?`${limit}킬 제한`:'무제한'}`
    :pvp
    ?`개인전 · 인간 ${Number(status.humans??0)}/${net.roomConfig.maxHumans} · AI 없음 · ${limit?`${limit}킬 제한`:'무제한'}`
    :`인간 ${Number(status.humans??0)}/${net.roomConfig.maxHumans} · AI ${Number(status.aliveAi??0)} / ${net.roomConfig.configuredAiCount} · ${limit?`${limit}킬 제한`:'무제한'}`;
  const rows=net.arenaScoreboard.slice(0,8);
  const rowHtml=rows.map((row:any,index:number)=>{
    const mine=row.id===net.sessionId?' me':'';
    const name=escapeArenaHtml(String(row.name??''));
    return '<div class="arena-score-row'+mine+'"><b>'+(index+1)+'</b><span>'+name+'</span><em>'+Number(row.kills??0)+'킬 '+Number(row.deaths??0)+'데스 · 인간 '+Number(row.humanKills??0)+' / AI '+Number(row.aiKills??0)+'</em></div>';
  }).join('');
  $('arenaScoreboardRows').innerHTML=rowHtml||'<p class="muted">전투 기록 집계 중</p>';
  const round=net.arenaRound;const overlay=$('arenaRoundResult');const roundState=String(round?.roundState??status.roundState??'active');
  overlay.classList.toggle('hidden',roundState==='active');
  if(roundState!=='active'){
    const serverTime=Number(net.snapshot?.serverTime??0),left=Math.max(0,Math.ceil(Number(round?.roundEndsAt??status.roundEndsAt??0)-serverTime));
    $('arenaRoundTitle').textContent=round?.winnerName?`${String(round.winnerName)} 승리!`:'다음 라운드 준비';
    const resultRows=Array.isArray(round?.rows)?round.rows:rows;
    $('arenaRoundRows').innerHTML=resultRows.map((row:any,index:number)=>'<div class="arena-result-row"><b>'+(index+1)+'위 '+escapeArenaHtml(String(row.name??''))+'</b><span>'+Number(row.kills??0)+'킬 · '+Number(row.deaths??0)+'데스 · K/D '+Number(row.kd??0).toFixed(2)+' · 인간 '+Number(row.humanKills??0)+' / AI '+Number(row.aiKills??0)+' · 피해 '+Math.round(Number(row.damageDone??0))+'</span></div>').join('');
    $('arenaRoundCountdown').textContent=left>0?`다음 전투까지 ${left}초`:'전투 재개';
  }
}

function renderDominationHud(s:any){
  const domination=net.roomConfig.gameMode==='domination'&&Boolean(s.domination?.enabled);dominationHud.classList.toggle('hidden',!domination);if(!domination)return;
  $('dominationMatchup').textContent='점령전 · 파랑팀 : 빨강팀';
  $('dominationHumanScore').textContent=`파랑 ${Number(s.domination.humanScore??0)}`;$('dominationAiScore').textContent=`빨강 ${Number(s.domination.aiScore??0)}`;$('dominationTargetScore').textContent=`/ ${Number(s.domination.scoreToWin??240)}`;
  const label=(site:any)=>{if(!site)return'?';if(site.contested)return`${site.id} 교전 중`;const owner=site.owner==='blue'?'파랑':site.owner==='red'?'빨강':'중립';const progress=Math.round(Number(site.captureProgress??0)*100);return`${site.id} ${owner}${site.owner==='neutral'&&progress?` ${progress}%`:''}`;};
  $('dominationSitesText').textContent=(s.domination.sites??[]).map(label).join(' · ');
}

function renderCoreSiegeHud(s:any){
  const active=net.roomConfig.gameMode==='coreSiege'&&Boolean(s.coreSiege?.enabled);
  coreSiegeHud.classList.toggle('hidden',!active);
  coreSiegeSkills.classList.toggle('active',active);
  $('mobileSiegeSkills').classList.toggle('active',active);
  if(!active)return;
  const me=s.players.find((player:any)=>player.id===net.sessionId),hero=CORE_SIEGE_HEROES[(me?.heroId??'vanguard') as CoreSiegeHeroId]??CORE_SIEGE_HEROES.vanguard;
  const heroAccents:Record<CoreSiegeHeroId,string>={vanguard:'#ffb65c',technician:'#64dcff',trapper:'#8de47a',trickster:'#ffe16a',medigel:'#69efa0',fireEngineer:'#ff7048',orbitalSniper:'#a4d8ff',wolfWarrior:'#d88cff',shieldCaptain:'#74b6ff',demolitionist:'#ff9a57',steelPilot:'#ff6258',empPilot:'#54d8ff',ironCyclone:'#e7b85d',scrapSummoner:'#b6e36a',gravityWarden:'#9b8cff',smokeTracker:'#8ac7b4',sonicCommander:'#ff8fc8',earthHammer:'#d6a85b',chainExecutioner:'#d65c6a',twinBlade:'#66e0c5',burstTrooper:'#ffd15c',phaseMarksman:'#65e1ff',opticArtillerist:'#f2c6ff',impactDriller:'#e09a55',spotterGunner:'#c5d2df',jetstreamBlade:'#70e8d1',blackoutAssassin:'#7884a8'};
  coreSiegeHud.style.setProperty('--siege-accent',heroAccents[hero.id]);coreSiegeSkills.style.setProperty('--siege-accent',heroAccents[hero.id]);$('mobileSiegeSkills').style.setProperty('--siege-accent',heroAccents[hero.id]);
  const blue=(s.coreSiege.structures??[]).find((structure:any)=>structure.id==='blue-core'),red=(s.coreSiege.structures??[]).find((structure:any)=>structure.id==='red-core');
  $('blueCoreText').textContent=`블루 코어 ${Math.ceil(Number(blue?.hp??0))}`;$('redCoreText').textContent=`레드 코어 ${Math.ceil(Number(red?.hp??0))}`;
  const left=Math.max(0,Number(s.coreSiege.roundEndsAt??0)-Number(s.serverTime??0)),minutes=Math.floor(left/60),seconds=Math.floor(left%60);$('coreSiegeTimer').textContent=`${minutes}:${String(seconds).padStart(2,'0')}`;
  const level=Math.max(1,Number(me?.level??3)),xp=Math.max(0,Number(me?.xp??240)),skillPoints=Math.max(0,Number(me?.skillPoints??0)),xpWindow=coreSiegeLevelXpWindow(level),xpSpan=Math.max(1,xpWindow.next-xpWindow.current),xpRatio=level>=10?1:Math.max(0,Math.min(1,(xp-xpWindow.current)/xpSpan)),exoRobot=Boolean(me?.exoActive);
  $('coreSiegeHeroText').textContent=exoRobot?(me?.exoKind==='emp'?'EMP 로봇':'강철 로봇'):hero.name;$('coreSiegeLevelText').textContent=`Lv.${level}`;$<HTMLElement>('coreSiegeXpFill').style.width=`${Math.round(xpRatio*100)}%`;
  const positioning=CORE_SIEGE_POSITIONING[hero.id],positioningCooldown=Math.max(0,Number(me?.positioningReadyAt??0)-Number(s.serverTime??0));
  $('coreSiegeXpText').textContent=level>=10?'MAX LEVEL':`${xp-xpWindow.current} / ${xpSpan} XP`;$('coreSiegeSkillPointText').textContent=`스킬 포인트 ${skillPoints} · 우클릭 ${positioning.name}${positioningCooldown>0?` ${positioningCooldown.toFixed(1)}초`:''}`;
  $('coreSiegeSkillPointText').title=positioning.description;
  const readyAt=[Number(me?.ability1ReadyAt??0),Number(me?.ability2ReadyAt??0),Number(me?.ultimateReadyAt??0)],ranks=[Number(me?.ability1Rank??1),Number(me?.ability2Rank??0),Number(me?.ultimateRank??0)],keys=['Q','E','F'];
  const skillSlots=Array.from(coreSiegeSkills.querySelectorAll<HTMLElement>('.core-siege-skill-card'));
  for(let index=0;index<3;index++){
    const slot=(index+1) as CoreSiegeAbilitySlot,rank=ranks[index]!,locked=rank<=0,cooldown=Math.max(0,readyAt[index]!-Number(s.serverTime??0)),label=exoRobot?'로봇 전용 조작':locked?(slot===3&&level<5?'Lv.5 해금':'스킬 포인트로 습득'):cooldown>0?`${cooldown.toFixed(1)}초`:'클릭으로 조준';
    const card=skillSlots[index],icon=card?.querySelector<HTMLElement>('.core-siege-skill-key'),name=card?.querySelector<HTMLElement>('.core-siege-skill-copy b'),description=card?.querySelector<HTMLElement>('.core-siege-skill-copy small'),status=card?.querySelector<HTMLElement>('.core-siege-skill-copy em'),cast=card?.querySelector<HTMLButtonElement>('[data-skill-cast]'),upgrade=card?.querySelector<HTMLButtonElement>('[data-skill-upgrade]');
    const robotNames=me?.exoKind==='emp'?['전기 기관총','EMP 장판','기체 상태']:['중기관총','전방 충격파','로켓 주먹'],robotIcons=me?.exoKind==='emp'?['ϟ','◎','▣']:['≡','◉','✦'],robotDescriptions=['왼쪽 발사 조작','오른쪽 보조 조작',`내구도 ${Math.ceil(Number(me?.exoHp??0))}`];
    card?.classList.toggle('locked',locked||exoRobot);card?.setAttribute('data-rank',String(rank));
    if(icon)icon.textContent=exoRobot?robotIcons[index]!:hero.abilityIcons[index]!;
    if(name)name.textContent=exoRobot?robotNames[index]!:`${hero.abilityNames[index]} · Lv.${rank}`;if(description)description.textContent=exoRobot?robotDescriptions[index]!: `${hero.abilityDescriptions[index]} ${hero.abilityGrowthDescriptions[index]}`;if(status)status.textContent=label;
    if(cast){cast.disabled=exoRobot||!me?.alive||locked||cooldown>0;cast.title=exoRobot?robotDescriptions[index]!:hero.abilityDescriptions[index]!;}
    const canUpgrade=!exoRobot&&coreSiegeCanUpgradeSkill(level,skillPoints,slot,rank);if(upgrade){upgrade.disabled=!canUpgrade;upgrade.classList.toggle('available',canUpgrade);}
    const button=$<HTMLButtonElement>(`mobileSiegeSkill${index+1}`),buttonIcon=button.querySelector<HTMLElement>('i'),buttonLabel=button.querySelector<HTMLElement>('span');if(buttonIcon)buttonIcon.textContent=exoRobot?robotIcons[index]!:hero.abilityIcons[index]!;if(buttonLabel)buttonLabel.textContent=exoRobot?robotNames[index]!:hero.abilityNames[index]!;
    const badge=button.querySelector<HTMLElement>('b');if(badge)badge.textContent=exoRobot?'×':locked?'×':cooldown>0?cooldown.toFixed(1):`${keys[index]}${rank}`;
    button.disabled=exoRobot||!me?.alive||locked||cooldown>0;button.title=exoRobot?robotDescriptions[index]!:hero.abilityDescriptions[index]!;
  }
  const shield=Math.ceil(Number(me?.temporaryShield??0));
  $('coreSiegeUpgradeText').textContent=exoRobot
    ?`내구도 ${Math.ceil(Number(me?.exoHp??0))} · 과열 ${Math.ceil(Number(me?.heat??0))}/100 · ${Math.ceil(Math.max(0,Number(me?.exoEndsAt??0)-Number(s.serverTime??0)))}초`
    :`${hero.name} · 공격 ${Number(me?.powerStacks??0)}/3 · 방어 ${Number(me?.guardStacks??0)}/3 · 쿨감 ${Number(me?.hasteStacks??0)}/3${hero.id==='medigel'?` · 의료액 ${Math.ceil(Number(me?.medicalGel??0))}/100`:''}${shield>0?` · 보호막 ${shield}`:''}`;
}

function render(){
  const s=net.snapshot;
  if(!s)return;
  $('codeText').textContent=`#${s.roomCode}`;
  $('gameCodeText').textContent=`#${s.roomCode}`;
  $('fieldRoomCodeText').textContent=`#${s.roomCode}`;
  if(s.phase==='LOBBY'){
    dominationHud.classList.add('hidden');
    coreSiegeHud.classList.add('hidden');
    coreSiegeSkills.classList.remove('active');
    $('mobileSiegeSkills').classList.remove('active');
    document.body.classList.remove('game-active');
    document.documentElement.classList.remove('game-running');
    updateMobileFullscreenUi();
    mobileControls.setGameplayActive(false);
    lobby.classList.remove('hidden');
    gameEl.classList.add('hidden');
    gameEl.classList.remove('open-arena-layout','map-open');
    gameEl.classList.remove('core-siege-layout');
    gameEl.classList.remove('spectator-only');
    renderLobby(s);
    return;
  }

  lobby.classList.add('hidden');
  gameEl.classList.remove('hidden');
  document.body.classList.add('game-active');
  document.documentElement.classList.add('game-running');
  updateMobileFullscreenUi();
  const arena=net.roomConfig.gameMode!=='battleRoyale';
  const domination=net.roomConfig.gameMode==='domination';
  const coreSiege=net.roomConfig.gameMode==='coreSiege';
  const spectatorOnly=arena&&Boolean(net.roomConfig.spectatorOnly);
  gameEl.classList.toggle('open-arena-layout',arena);
  gameEl.classList.toggle('core-siege-layout',coreSiege);
  gameEl.classList.toggle('spectator-only',spectatorOnly);
  if(!arena)gameEl.classList.remove('map-open');
  if(!game)createGame();
  const me=s.players.find((p)=>p.id===net.sessionId);
  mobileControls.setGameplayActive(!spectatorOnly&&Boolean(me?.alive));
  const now=performance.now();
  if(now-lastHudAt<100)return;
  lastHudAt=now;
  const pvp=net.roomConfig.gameMode==='openArena'&&Number(net.roomConfig.configuredAiCount)===0&&!spectatorOnly;
  $('modeText').textContent=net.roomConfig.spectatorOnly?'AI 자동전투 관전':coreSiege?'코어 공성전':domination?'점령전 팀전':pvp?'PvP 개인전':arena?'상시 전장':'배틀로얄';
  renderArenaScoreboard();
  renderDominationHud(s);
  renderCoreSiegeHud(s);
  $('phaseText').textContent=spectatorOnly?'AI 전투 관전 중 · ← → 대상 변경':me&&!me.alive?'관전 중 · 생존자 전환':s.phase;
  $('aliveText').textContent=spectatorOnly?`AI ${Number(net.arenaStatus?.aliveAi??s.players.filter((player:any)=>player.ai&&player.alive).length)} / ${net.roomConfig.configuredAiCount}`:arena?`${Number(net.arenaStatus?.humans??s.players.filter((player:any)=>!player.ai).length)}명 + AI ${Number(net.arenaStatus?.aliveAi??s.players.filter((player:any)=>player.ai&&player.alive).length)}`:String(s.aliveCount);
  $('killsText').textContent=spectatorOnly?'-':String(me?.kills??0);
  const zoneSeconds=Math.max(0,Math.ceil(s.zoneTimer));
  $('zoneHudItem').classList.toggle('hidden',arena);
  $('zoneText').textContent=arena?'없음':s.zoneState==='FREE'?`없음 · ${zoneSeconds}초`:s.zoneState==='ANNOUNCING'?`예고 · ${zoneSeconds}초`:`${zoneSeconds}초`;
  $('hpText').textContent=spectatorOnly?'-':String(Math.ceil(me?.hp??0));
  const respawnHud=$('arenaRespawnHud');
  const respawnLeft=Math.max(0,net.respawnAt-Number(s.serverTime??0));
  const protectionLeft=Math.max(0,net.spawnProtectionUntil-Number(s.serverTime??0));
  respawnHud.classList.toggle('hidden',spectatorOnly||!net.roomConfig.respawnEnabled||(!respawnLeft&&!protectionLeft));
  respawnHud.textContent=respawnLeft>0?`부활까지 ${respawnLeft.toFixed(1)}초 · 관전 중`:protectionLeft>0?`스폰 보호 ${protectionLeft.toFixed(1)}초 · 공격 시 즉시 해제`:'';
  $('mapModeText').textContent=s.mapId==='coreSiege'||s.mapSizeMode==='coreSiege'?'코어 전선':s.mapId==='dock8'||s.mapSizeMode==='dock8'?'8번 부두':s.mapId==='large'||s.mapSizeMode==='large'?'큰 맵':'작은 맵';
  const motorcycle=me?.vehicleId?s.motorcycles.find((item:any)=>item.id===me.vehicleId):undefined;
  const wolf=me?.werewolf;
  const fusionWeaponSlot=Math.max(1,Math.min(4,Math.floor(Number(motorcycle?.fusionWeaponSlot||1)))),fusionDriving=motorcycle?.vehicleKind==='fusion_robot',releaseAim=Boolean(motorcycle?.vehicleKind==='tank'||(fusionDriving?fusionWeaponSlot===1:me?.exoActive?me?.exoKind!=='emp':me?.equipped==='sniper'||me?.equipped==='bazooka')),throwAim=!releaseAim&&isThrowableType(me?.equipped);
  const siegeTargeting=$('mobileControls').classList.contains('siege-targeting');
  const siegePositioning=s.coreSiege?.enabled?CORE_SIEGE_POSITIONING[(me?.heroId??'vanguard') as CoreSiegeHeroId]:undefined,positioningLeft=Math.max(0,Number(me?.positioningReadyAt??0)-Number(s.serverTime??0)),positioningMode=Boolean(siegePositioning?.kind==='move'&&!me?.exoActive&&!me?.isDriving);
  mobileControls.setContext({
    secondaryLabel:me?.exoActive?(me?.exoKind==='emp'?'EMP':'레이저'):positioningMode?positioningLeft>0?`${positioningLeft.toFixed(1)}초`:siegePositioning!.name:wolf?.transformed?'질주':me?.equipped==='sniper'?'조준':'보조',
    secondaryMode:positioningMode?'position':'hold',
    aimLabel:siegeTargeting?'드래그 후 놓아 스킬 확정':releaseAim?'놓아 발사':throwAim?'놓아 투척':'드래그 연사',
    aimMode:siegeTargeting?'release':releaseAim?'release':throwAim?'throw':'hold',
  });
  const vehicleHud=$('vehicleHud');
  vehicleHud.classList.toggle('hidden',!me?.isDriving||!motorcycle);
  if(me?.isDriving&&motorcycle){
    const tank=motorcycle.vehicleKind==='tank',fusion=motorcycle.vehicleKind==='fusion_robot',maxSpeed=MOTORCYCLE_MAX_SPEED*(tank?TANK_BALANCE.speedMultiplier:fusion?FUSION_ROBOT_BALANCE.speedMultiplier:1);
    const ratio=Math.min(1,Math.abs(Number(motorcycle.speed||0))/maxSpeed);
    const stage=ratio<.02?'정지':ratio<.28?'출발':ratio<.58?'가속 중':ratio<.82?'주행':'고속';
    const vehicleName=tank?'탱크':fusion?'합체 로봇':'오토바이';
    $('vehicleSpeed').textContent=`${vehicleName} · ${stage} · 속도 ${Math.round(ratio*100)}`;
    const hp=Math.max(0,Math.ceil(Number(motorcycle.hp??0))),maxHp=Math.max(1,Math.ceil(Number(motorcycle.maxHp??180)));
    const tankShells=Math.max(0,Math.floor(Number(motorcycle.tankShells??0)));
    const fusionSlot=Math.max(1,Math.min(4,Math.floor(Number(motorcycle.fusionWeaponSlot||1)))) as FusionRobotWeaponSlot;
    $('vehicleDurability').textContent=`내구도 ${hp} / ${maxHp}${tank?` · 주포 ${tankShells}/${TANK_BALANCE.cannonShells}`:fusion?` · ${fusionSlot} ${FUSION_ROBOT_WEAPON_NAMES[fusionSlot]}`:''}`;
    vehicleHud.classList.toggle('critical',Boolean(motorcycle.critical));
    vehicleHud.classList.toggle('exploding',Boolean(motorcycle.exploding));
    const slowRemaining=Math.max(0,Number(motorcycle.slowUntil??0)-Number(s.serverTime??0));
    const slowKind=String(motorcycle.slowKind??'');
    const slowLabel=slowKind==='strip_trap'?'타이어 손상':slowKind==='werewolf_hunt'?'늑대 사냥 표식':slowKind==='stun'?'전기 충격':slowKind==='mixed'?'복합 감속':'끈끈이 감속';
    const slowText=slowRemaining>0?slowLabel+` · ${slowRemaining.toFixed(1)}초 · 최고속도 ${Math.round(Number(motorcycle.slowSpeedMultiplier??1)*100)}%`:'';
    const empRemaining=Math.max(0,Number(motorcycle.empDisabledUntil??0)-Number(s.serverTime??0)),fusionReadyField=fusionSlot===1?'fusionMissileReadyAt':fusionSlot===2?'fusionLaserReadyAt':fusionSlot===3?'fusionMachineGunReadyAt':'fusionEmpReadyAt',fusionCooldown=Math.max(0,Number(motorcycle[fusionReadyField]??0)-Number(s.serverTime??0));
    const warning=empRemaining>0?`${slowKind==='werewolf_hunt'||slowKind==='mixed'?'늑대 파쇄':'EMP 정지'} · ${empRemaining.toFixed(1)}초`:slowText||(tank&&tankShells<=0?'주포 탄약 소진 · E로 내리기':fusion?`1~4 무기 전환 · 좌클릭 발사 · ${fusionCooldown>0?`${fusionCooldown.toFixed(1)}초`:'발사 준비'} · E 내리기`:me.equipped==='sniper'&&ratio>MOTORCYCLE_SCOPE_SPEED_RATIO?'속도를 줄이고 이동키를 놓아야 스코프 사용 가능':ratio>.8?'고속 이동 중 · 명중률 크게 감소':ratio>.4?'이동 사격 · 명중률 감소':'WASD · 이동 · E · 내리기');
    $('vehicleWarning').textContent=warning;
  }else{$('vehicleWarning').textContent='';vehicleHud.classList.remove('critical','exploding');}
  gameEl.classList.toggle('scope-active',Boolean(me?.isSniperScoped));
  $('inventoryHud').classList.toggle('hidden',spectatorOnly);
  if(!spectatorOnly)renderInventory(me);
  const wolfHud=$('werewolfHud');
  const serverTime=Number(s.serverTime??0);
  wolfHud.classList.toggle('hidden',!wolf?.hasCurse&&!wolf?.ritualizing&&!wolf?.transformPreparing&&!wolf?.transformed);
  if(wolf?.ritualizing){
    const left=Math.max(0,Number(wolf.ritualCompletesAt??0)-serverTime);
    wolfHud.textContent=`제단 의식 ${left.toFixed(1)}초 · E 유지`;
    wolfHud.className='werewolf-hud ritual';
  }else if(wolf?.transformPreparing){
    const left=Math.max(0,Number(wolf.transformReadyAt??0)-serverTime);
    wolfHud.textContent=`늑대인간 변신 준비 ${left.toFixed(1)}초`;
    wolfHud.className='werewolf-hud preparing';
  }else if(wolf?.transformed){
    const left=Math.max(0,Number(wolf.transformEndsAt??0)-serverTime);
    const sprint=Math.round(Math.max(0,Math.min(1,Number(wolf.sprintGauge??0)))*100);
    const silver=Math.max(0,Number(wolf.silverSlowUntil??0)-serverTime);
    wolfHud.textContent=`늑대인간 ${left.toFixed(1)}초 · 질주 ${sprint}%${silver>0?` · 은화살 감속 ${silver.toFixed(1)}초`:''}`;
    wolfHud.className='werewolf-hud transformed';
  }else if(wolf?.hasCurse){
    const left=Math.max(0,Number(wolf.curseExpiresAt??0)-serverTime);
    wolfHud.textContent=`늑대 저주 · 강제 변신까지 ${left.toFixed(1)}초 · F 변신`;
    wolfHud.className='werewolf-hud cursed';
  }else{
    wolfHud.textContent='';
    wolfHud.className='werewolf-hud hidden';
  }
  if(me?.healingKind){
    const name=me.healingKind==='medkit'?'구급상자':'붕대';
    $('healText').textContent=`${name} 회복 중 ${Math.round((me.healingProgress??0)*100)}% · 이동/공격 시 취소`;
  }else $('healText').textContent='';
  if(me?.reloading){
    $('reloadText').textContent=`${weaponName(me.reloadWeapon)} 재장전 중 ${Math.round((me.reloadProgress??0)*100)}%`;
  }else $('reloadText').textContent='';
  if(s.phase==='FINISHED')$('result').classList.remove('hidden');
}

function renderLobby(s:any){
  $('result').classList.add('hidden');
  const me=s.players.find((p:any)=>p.id===net.sessionId);
  const slots=$('slots');
  slots.innerHTML='';
  const lobbyPlayers=[...s.players].sort((a:any,b:any)=>net.roomConfig.matchFormat==='teams'?(a.team==='blue'?0:a.team==='red'?1:2)-(b.team==='blue'?0:b.team==='red'?1:2):0);
  for(let i=0;i<MAX_PLAYERS;i++){
    const player=lobbyPlayers[i];
    const card=document.createElement('div');
    card.className=`slot ${player?'':'empty'} ${player?.team==='blue'?'team-blue':player?.team==='red'?'team-red':''}`;
    if(!player){card.textContent=`빈 슬롯 ${i+1}`;slots.append(card);continue;}
    const badge=document.createElement('span');badge.className='badge';badge.textContent=`${player.host?'방장 · ':''}${player.team==='blue'?'파랑팀 · ':player.team==='red'?'빨강팀 · ':''}${player.ai?'AI':'PLAYER'}`;
    const name=document.createElement('b');name.textContent=String(player.name??'이름 없음');
    const hero=net.roomConfig.gameMode==='coreSiege'?CORE_SIEGE_HEROES[(player.heroId??'vanguard') as CoreSiegeHeroId]:undefined;
    card.append(badge,document.createElement('br'),name,document.createTextNode(` · ${hero?`${hero.name} · `:''}${player.ready?'준비':'대기'}`));
    if(me?.host&&!player.ai&&player.id!==me.id){
      const kick=document.createElement('button');kick.type='button';kick.className='kick-button danger';kick.textContent='강퇴';
      kick.onclick=()=>{if(confirmWithoutPopup(`kick:${player.id}`,`${player.name}님을 방에서 내보낼까요?`))net.send('kick',{targetPlayerId:player.id});};
      card.append(kick);
    }
    slots.append(card);
  }
  $('startBtn').classList.toggle('hidden',!me?.host);
  $('hostSettings').classList.toggle('hidden',!me?.host);
  teamChooser.classList.toggle('hidden',net.roomConfig.matchFormat!=='teams');
  heroChooser.classList.toggle('hidden',net.roomConfig.gameMode!=='coreSiege');
  for(const button of Array.from(teamChooser.querySelectorAll<HTMLButtonElement>('[data-team]')))button.classList.toggle('selected',button.dataset.team===me?.team);
  for(const button of Array.from(heroChooser.querySelectorAll<HTMLButtonElement>('[data-hero]')))button.classList.toggle('selected',button.dataset.hero===(me?.heroId??'vanguard'));
  $<HTMLInputElement>('fillAi').checked=s.fillAi;
  $<HTMLSelectElement>('difficulty').value=s.difficulty;
  $<HTMLSelectElement>('zoneSpeed').value=s.zoneSpeed;
  $<HTMLSelectElement>('mapSizeMode').value=s.mapId??s.mapSizeMode??'small';
  $<HTMLSelectElement>('lobbyGameMode').value=net.roomConfig.gameMode;
  $<HTMLSelectElement>('lobbyMatchFormat').value=net.roomConfig.matchFormat??'solo';
  $<HTMLSelectElement>('lobbyMaxHumans').value=String(net.roomConfig.maxHumans??8);
  $<HTMLSelectElement>('lobbyAiCount').value=String(net.roomConfig.configuredAiCount??0);
  $<HTMLSelectElement>('lobbyTeamAiBlue').value=String(net.roomConfig.teamAiBlue??0);
  $<HTMLSelectElement>('lobbyTeamAiRed').value=String(net.roomConfig.teamAiRed??0);
  $<HTMLSelectElement>('lobbyKillLimit').value=String(net.roomConfig.killLimit??20);
  syncLobbyRuleVisibility();
}

type PublicRoomInfo={roomId:string;roomCode:string;hostName:string;players:number;humans:number;spectators:number;maxPlayers:number;phase:string;fillAi:boolean;publicRoom:boolean;locked:boolean;mapSizeMode:'small'|'large'|'dock8'|'coreSiege';mapDisplayName:string;gameMode:'battleRoyale'|'openArena'|'domination'|'coreSiege';matchFormat?:'solo'|'teams';maxHumans:number;configuredAiCount:number;spectatorOnly:boolean;joinInProgress:boolean;lifecycle:string;killLimit:number;roundState:string};

async function refreshRooms(){
  if(home.classList.contains('hidden'))return;
  const list=$('roomList'),requestSeq=++roomListRequestSeq;
  roomListAbort?.abort();roomListAbort=new AbortController();
  try{
    const response=await fetch('/api/rooms',{cache:'no-store',signal:roomListAbort.signal});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json() as {rooms?:PublicRoomInfo[]};
    if(requestSeq!==roomListRequestSeq||home.classList.contains('hidden'))return;
    const deduplicated=new Map<string,PublicRoomInfo>();
    for(const room of data.rooms??[]){const key=String(room.roomCode||room.roomId).toUpperCase();if(key&&room.publicRoom!==false)deduplicated.set(key,room);}
    cachedRooms=[...deduplicated.values()];renderRoomList(cachedRooms);
  }catch(error){
    if((error as Error)?.name==='AbortError'||requestSeq!==roomListRequestSeq)return;
    list.innerHTML='<p class="empty-note error-note">방 목록을 불러오지 못했습니다. 잠시 후 자동으로 다시 시도합니다.</p>';
  }
}

function renderRoomList(rooms:PublicRoomInfo[]){
  const filter=$<HTMLSelectElement>('roomMapFilter').value;
  const matchingMode=roomsForGameMode(rooms,selectedHomeMode);
  const filtered=filter==='all'?matchingMode:matchingMode.filter((room)=>room.mapSizeMode===filter);
  const list=$('roomList');list.innerHTML='';
  if(!selectedHomeMode){list.innerHTML='<p class="empty-note">게임 모드를 먼저 선택해주세요.</p>';return;}
  if(!filtered.length){list.innerHTML=`<p class="empty-note">현재 참가 가능한 ${escapeText(gameModeChoice(selectedHomeMode).name)} 공개방이 없습니다.<br>새 방을 열어 바로 시작할 수 있습니다.</p>`;return;}
  for(const room of filtered){
    const row=document.createElement('div');row.className='room-row';
    const info=document.createElement('div');
    const arena=room.gameMode!=='battleRoyale',domination=room.gameMode==='domination',siege=room.gameMode==='coreSiege',pvp=room.gameMode==='openArena'&&room.configuredAiCount===0&&!room.spectatorOnly;
    const full=!room.spectatorOnly&&room.humans>=room.maxHumans;
    const status=room.phase==='LOBBY'?(room.locked?'잠금':full?'인원 가득 참':'대기 중'):room.phase==='FINISHED'?'종료 중':arena?'전장 진행 중':'게임 중';
    info.innerHTML=`<b>#${escapeText(room.roomCode)}</b><span>${escapeText(room.hostName)} · ${room.spectatorOnly?'AI 자동전투 관전':siege?'코어 공성전':domination?'점령전':pvp?'PvP 개인전':arena?'상시 전장':'배틀로얄'} · 인간 ${room.humans}/${room.maxHumans}${arena?` · ${pvp?'AI 없음':`AI ${room.configuredAiCount}`}${room.spectatorOnly?` · 관전자 ${room.spectators}`:''}${siege?' · 코어 파괴':domination?' · A/B 240점':` · ${room.killLimit?`${room.killLimit}킬`:'무제한'}`}`:''} · ${escapeText(room.mapDisplayName||'작은 맵')} · ${status}</span>`;
    const join=document.createElement('button');join.type='button';join.textContent='참가';
    join.disabled=room.locked||full||(arena?room.lifecycle!=='active'&&room.phase!=='LOBBY':room.phase!=='LOBBY');
    join.onclick=()=>{roomCode.value=room.roomCode;void connect(false);};
    row.append(info,join);list.append(row);
  }
}

function startRoomListPolling(){
  window.clearInterval(roomListTimer);
  void refreshRooms();
  roomListTimer=window.setInterval(()=>void refreshRooms(),2500);
}
function stopRoomListPolling(){window.clearInterval(roomListTimer);roomListTimer=0;roomListAbort?.abort();roomListAbort=null;roomListRequestSeq++;}

function setFieldChatCollapsed(collapsed:boolean){
  fieldChatCollapsed=collapsed;
  localStorage.setItem('drop8-field-chat-collapsed',String(collapsed));
  $('fieldChatPanel').classList.toggle('collapsed',collapsed);
  if(!collapsed)fieldChatUnread=0;
  updateFieldChatToggle();
}
function updateFieldChatToggle(){
  const button=$<HTMLButtonElement>('toggleFieldChat');
  button.firstChild!.textContent=fieldChatCollapsed?'열기':'접기';
  const unread=$('chatUnread');unread.textContent=String(fieldChatUnread);unread.classList.toggle('hidden',fieldChatUnread<=0);
}
$('toggleFieldChat').onclick=()=>setFieldChatCollapsed(!fieldChatCollapsed);
setFieldChatCollapsed(fieldChatCollapsed);

async function exitRoom(message='',ask=false){
  if(ask&&net.snapshot?.phase!=='LOBBY'&&!confirmWithoutPopup('leave-game',net.roomConfig.spectatorOnly?'AI 자동전투 관전을 종료하시겠습니까?':net.roomConfig.gameMode==='coreSiege'?'코어 공성전에서 나가시겠습니까?':net.roomConfig.gameMode==='domination'?'AI 점령전에서 나가시겠습니까?':net.roomConfig.gameMode==='openArena'?'상시 전장에서 나가시겠습니까? 남은 인간이 없으면 방이 종료됩니다.':'진행 중인 게임에서 나가면 현재 캐릭터가 탈락합니다.'))return;
  closeChat();
  inventoryOpen=false;
  $('inventoryPanel').classList.add('hidden');
  audio.stopAllLoops(80);
  await net.leave(true);
  game?.destroy(true);game=null;
  mobileControls.setGameplayActive(false);document.body.classList.remove('game-active');document.documentElement.classList.remove('game-running');updateMobileFullscreenUi();
  lobby.classList.add('hidden');gameEl.classList.add('hidden');home.classList.remove('hidden');
  $('result').classList.add('hidden');$('arenaRoundResult').classList.add('hidden');dominationHud.classList.add('hidden');coreSiegeHud.classList.add('hidden');coreSiegeSkills.classList.remove('active');$('scopeOverlay').classList.add('hidden');$('vehicleHud').classList.add('hidden');gameEl.classList.remove('scope-active','core-siege-layout');$('lobbyMessages').innerHTML='';$('gameMessages').innerHTML='';$('killfeed').innerHTML='';
  history.replaceState(null,'',location.pathname);
  error.textContent=message;
  showHomeStep(selectedHomeMode?'rooms':'start');
  startRoomListPolling();
}
$('leaveLobbyBtn').onclick=()=>void exitRoom('',false);
$('leaveGameBtn').onclick=()=>void exitRoom('',true);

function showPickupResult(payload:any){
  const kind=String(payload?.kind??'');
  if(kind.includes('ammo'))audio.playUi('ammo_pickup');else if(kind==='vest')audio.playUi('armor_equip');else if(kind in WEAPONS||kind in MELEE_WEAPONS)audio.playUi(payload?.autoEquipped?'weapon_equip':'item_pickup');else audio.playUi('item_pickup');
  if(!payload?.autoEquipped)return;
  const label=weaponName(kind);
  const droppedKind=String(payload?.droppedKind??'');
  const droppedText=droppedKind?` · ${weaponName(droppedKind)} 바닥에 내려놓음`:'';
  const toast=$('pickupToast');toast.textContent=`${label} 획득 · 즉시 장착${droppedText}`;
  toast.classList.remove('hidden');
  window.clearTimeout(pickupToastTimer);
  pickupToastTimer=window.setTimeout(()=>toast.classList.add('hidden'),1600);
  const me=net.snapshot?.players.find((player)=>player.id===net.sessionId);
  const slot=me?.primary===kind?'slotPrimary':me?.secondary===kind?'slotSecondary':'slotMelee';
  const element=$(slot);element.classList.remove('pickup-flash');void element.offsetWidth;element.classList.add('pickup-flash');
  window.setTimeout(()=>element.classList.remove('pickup-flash'),520);
}

function escapeText(v:string){
  const d=document.createElement('div');
  d.textContent=v;
  return d.innerHTML;
}

setupAudioSettings();
document.addEventListener('click',(event)=>{const target=event.target;if(target instanceof HTMLButtonElement){void unlockAudio();audio.playUi('ui_click');}},true);
startRoomListPolling();
document.title=GAME_NAME;

