// DROP8_REFACTOR_013H_FIXED_V3_VISIBILITY_ROOF_RIVER_ZONE_SNIPER_AI
// DROP8_REFACTOR_013H_VISIBILITY_ROOF_RIVER_ZONE_SNIPER
import type { LandCrossing, MapPoint, MapRect, RiverBand, RoomZone, ShoreExit, TerrainKind, WaterZone } from './types.js';

export const SWIM_SPEED=165;
export const SWIM_ENTER_MARGIN=12;
export const SWIM_EXIT_MARGIN=18;


export interface TerrainQuery{
  buildings?:readonly MapRect[];
  rooms?:readonly RoomZone[];
  landOverrides?:readonly MapRect[];
  rivers:readonly RiverBand[];
  shallowWaterZones?:readonly WaterZone[];
  crossings?:readonly LandCrossing[];
  shoreExits?:readonly ShoreExit[];
}


export function pointInRect(x:number,y:number,rect:{x:number;y:number;w:number;h:number},padding=0){
  return x>=rect.x-padding&&x<=rect.x+rect.w+padding&&y>=rect.y-padding&&y<=rect.y+rect.h+padding;
}

export function pointSegmentDistance(x:number,y:number,a:MapPoint,b:MapPoint){
  const dx=b.x-a.x,dy=b.y-a.y,lengthSquared=dx*dx+dy*dy;
  if(lengthSquared<=1e-9)return Math.hypot(x-a.x,y-a.y);
  const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/lengthSquared));
  return Math.hypot(x-(a.x+dx*t),y-(a.y+dy*t));
}

function segmentWidth(river:RiverBand,index:number){
  const a=river.widths[index]??river.widths.at(-1)??0;
  const b=river.widths[index+1]??a;
  return(a+b)/2;
}

export function riverSignedDepth(x:number,y:number,river:RiverBand){
  let best=Number.NEGATIVE_INFINITY;
  for(let index=0;index<river.points.length-1;index++){
    const a=river.points[index]!,b=river.points[index+1]!;
    const margin=segmentWidth(river,index)/2-pointSegmentDistance(x,y,a,b);
    if(margin>best)best=margin;
  }
  return best;
}

function firstContainingRect<T extends MapRect>(x:number,y:number,rects:readonly T[]=[]){
  return rects.find((rect)=>pointInRect(x,y,rect));
}

export function terrainAt(x:number,y:number,query:TerrainQuery):TerrainKind{
  const rooms=query.rooms??[];
  if(rooms.some((room)=>pointInRect(x,y,room.rect)))return'building';
  if(firstContainingRect(x,y,query.buildings??[]))return'building';
  if(firstContainingRect(x,y,query.landOverrides??[]))return'land';
  const crossing=crossingAt(x,y,query.crossings??[]);
  if(crossing){
    if(crossing.kind==='ford')return'ford';
    return'bridge';
  }
  if((query.shoreExits??[]).some((exit)=>pointInRect(x,y,exit.entry)))return'shore';
  if(shallowWaterAt(x,y,query.shallowWaterZones??[]))return'shallow-water';
  if(isDeepWaterAt(x,y,query.rivers,query.crossings??[],0))return'deep-water';
  return'land';
}

export function terrainAllowsSwimming(kind:TerrainKind){return kind==='deep-water';}
export function terrainIsWalkable(kind:TerrainKind){return kind!=='deep-water';}

export function crossingAt(x:number,y:number,crossings:readonly LandCrossing[]){
  return crossings.find((crossing)=>pointInRect(x,y,crossing.rect));
}

export function shallowWaterAt(x:number,y:number,zones:readonly WaterZone[]){
  return zones.find((zone)=>pointInRect(x,y,zone));
}

export function waterSignedDepthAt(x:number,y:number,rivers:readonly RiverBand[],crossings:readonly LandCrossing[]=[]){
  const crossing=crossingAt(x,y,crossings);
  if(crossing)return Number.NEGATIVE_INFINITY;
  let best=Number.NEGATIVE_INFINITY;
  for(const river of rivers)best=Math.max(best,riverSignedDepth(x,y,river));
  return best;
}

export function isDeepWaterAt(x:number,y:number,rivers:readonly RiverBand[],crossings:readonly LandCrossing[]=[],margin=0){
  return waterSignedDepthAt(x,y,rivers,crossings)>=margin;
}

export function isShallowWaterAt(x:number,y:number,zones:readonly WaterZone[],crossings:readonly LandCrossing[]=[]){
  const crossing=crossingAt(x,y,crossings);
  return crossing?.kind==='ford'||Boolean(shallowWaterAt(x,y,zones));
}

export function movementMultiplierAt(x:number,y:number,zones:readonly WaterZone[],crossings:readonly LandCrossing[]=[]){
  const crossing=crossingAt(x,y,crossings);
  if(crossing)return crossing.movementMultiplier;
  return shallowWaterAt(x,y,zones)?.movementMultiplier??1;
}

export function motorcycleCanOccupyWaterPosition(x:number,y:number,rivers:readonly RiverBand[],crossings:readonly LandCrossing[]){
  const crossing=crossingAt(x,y,crossings);
  if(crossing)return crossing.allowsMotorcycle;
  return !isDeepWaterAt(x,y,rivers,crossings,0);
}

export function nearestShoreExit(x:number,y:number,exits:readonly ShoreExit[],blockedIds:ReadonlySet<string>=new Set()){
  let best:ShoreExit|undefined,bestDistance=Number.POSITIVE_INFINITY;
  for(const exit of exits){
    if(blockedIds.has(exit.id))continue;
    const d=Math.hypot(exit.entry.x+exit.entry.w/2-x,exit.entry.y+exit.entry.h/2-y);
    if(d<bestDistance){best=exit;bestDistance=d;}
  }
  return best;
}

export function riverLandSideAt(x:number,y:number,river:RiverBand):'west'|'east'{
  let bestIndex=0,bestDistance=Number.POSITIVE_INFINITY;
  for(let index=0;index<river.points.length-1;index++){
    const distance=pointSegmentDistance(x,y,river.points[index]!,river.points[index+1]!);
    if(distance<bestDistance){bestDistance=distance;bestIndex=index;}
  }
  const a=river.points[bestIndex]!,b=river.points[bestIndex+1]!;
  const t=Math.max(0,Math.min(1,(y-a.y)/Math.max(1,b.y-a.y)));
  const centerX=a.x+(b.x-a.x)*t;
  return x<centerX?'west':'east';
}

export function riverSideAt(x:number,y:number,river:RiverBand):'west'|'east'|'water'{
  if(isDeepWaterAt(x,y,[river]))return'water';
  return riverLandSideAt(x,y,river);
}
