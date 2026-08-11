import type { MapRect } from './types.js';

export const CORE_SIEGE_WORLD_WIDTH=4600;
export const CORE_SIEGE_WORLD_HEIGHT=1800;
export const CORE_SIEGE_WORLD_SIZE=CORE_SIEGE_WORLD_WIDTH;

export const CORE_SIEGE_REGIONS=[
  {id:'hospital',name:'블루 코어 기지',x:0,y:0,w:720,h:1800,color:0x315d78},
  {id:'military',name:'서부 방어선',x:720,y:0,w:1050,h:1800,color:0x425b4e},
  {id:'forestCamp',name:'중앙 교전 광장',x:1770,y:0,w:1060,h:1800,color:0x355944},
  {id:'military',name:'동부 방어선',x:2830,y:0,w:1050,h:1800,color:0x5d514d},
  {id:'residential',name:'레드 코어 기지',x:3880,y:0,w:720,h:1800,color:0x70434d},
] as const;

export const CORE_SIEGE_OBSTACLES:MapRect[]=[
  {x:520,y:360,w:250,h:76},{x:520,y:1364,w:250,h:76},
  {x:930,y:420,w:300,h:72},{x:930,y:1308,w:300,h:72},
  {x:1760,y:250,w:420,h:78},{x:1760,y:1472,w:420,h:78},
  {x:2420,y:250,w:420,h:78},{x:2420,y:1472,w:420,h:78},
  {x:3370,y:420,w:300,h:72},{x:3370,y:1308,w:300,h:72},
  {x:3830,y:360,w:250,h:76},{x:3830,y:1364,w:250,h:76},
];

export const CORE_SIEGE_BUSHES=[
  {id:'siege-blue-upper',regionId:'military',x:1280,y:430,radius:105,density:.95},
  {id:'siege-blue-lower',regionId:'military',x:1280,y:1370,radius:105,density:.95},
  {id:'siege-mid-upper-west',regionId:'forestCamp',x:1960,y:360,radius:110,density:1},
  {id:'siege-mid-upper-east',regionId:'forestCamp',x:2640,y:360,radius:110,density:1},
  {id:'siege-mid-lower-west',regionId:'forestCamp',x:1960,y:1440,radius:110,density:1},
  {id:'siege-mid-lower-east',regionId:'forestCamp',x:2640,y:1440,radius:110,density:1},
  {id:'siege-red-upper',regionId:'military',x:3320,y:430,radius:105,density:.95},
  {id:'siege-red-lower',regionId:'military',x:3320,y:1370,radius:105,density:.95},
] as const;

export const CORE_SIEGE_DECORATIONS=[
  {id:'siege-blue-pad',regionId:'hospital',kind:'helipad',x:110,y:680,w:360,h:360},
  {id:'siege-red-pad',regionId:'residential',kind:'helipad',x:4130,y:680,w:360,h:360},
  {id:'siege-mid-bus-a',regionId:'forestCamp',kind:'container',x:2185,y:560,w:230,h:70},
  {id:'siege-mid-bus-b',regionId:'forestCamp',kind:'container',x:2185,y:1170,w:230,h:70},
  {id:'siege-crate-a',regionId:'military',kind:'crate',x:1590,y:780,w:68,h:68},
  {id:'siege-crate-b',regionId:'military',kind:'crate',x:2942,y:952,w:68,h:68},
  {id:'siege-sandbag-a',regionId:'forestCamp',kind:'sandbag',x:2180,y:720,w:170,h:42},
  {id:'siege-sandbag-b',regionId:'forestCamp',kind:'sandbag',x:2250,y:1038,w:170,h:42},
] as const;

export const CORE_SIEGE_WORLD_PROPS=CORE_SIEGE_OBSTACLES.map((rect,index)=>({
  id:`siege-cover-${index+1}`,
  regionId:rect.x<720?'hospital':rect.x>=3830?'residential':rect.x>=1770&&rect.x<2830?'forestCamp':'military',
  kind:rect.w>=400?'container':'sandbag',
  ...rect,
  collision:'solid',
  blocksBullets:true,
  blocksLoot:true,
}));

export const CORE_SIEGE_EMERGENCY_SPAWNS=[
  {x:430,y:690},{x:430,y:900},{x:430,y:1110},{x:700,y:900},
  {x:4170,y:690},{x:4170,y:900},{x:4170,y:1110},{x:3900,y:900},
] as const;
