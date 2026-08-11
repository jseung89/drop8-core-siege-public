// DROP8_REFACTOR_063_DOMINATION_4V8
export type DominationTeam='neutral'|'blue'|'red';
export type DominationSiteId='A'|'B';
export type DominationRect={x:number;y:number;w:number;h:number};
export type DominationSiteLayout={id:DominationSiteId;x:number;y:number;radius:number};

const SITE_RATIOS=[{x:.32,y:.28},{x:.64,y:.68}] as const;
export function dominationSitesForMap(width:number,height:number,radius=165):DominationSiteLayout[]{
  return SITE_RATIOS.map((ratio,index)=>({id:index===0?'A':'B',x:width*ratio.x,y:height*ratio.y,radius}));
}

/** 시야는 가리지 않고 이동과 탄환만 막는 중앙 점령지 방벽이다. */
export function dominationWallsForMap(width:number,height:number,radius=165):DominationRect[]{
  const walls:DominationRect[]=[];
  const halfWidth=Math.round(radius*1.08),halfHeight=Math.round(radius*.97),wallThickness=Math.max(14,Math.round(radius*.09)),entranceHalf=Math.round(radius*.31);
  for(const site of dominationSitesForMap(width,height,radius)){
    const left=site.x-halfWidth,right=site.x+halfWidth,top=site.y-halfHeight,bottom=site.y+halfHeight;
    walls.push(
      {x:left,y:top,w:halfWidth-entranceHalf,h:wallThickness},
      {x:site.x+entranceHalf,y:top,w:halfWidth-entranceHalf,h:wallThickness},
      {x:left,y:bottom-wallThickness,w:halfWidth-entranceHalf,h:wallThickness},
      {x:site.x+entranceHalf,y:bottom-wallThickness,w:halfWidth-entranceHalf,h:wallThickness},
      {x:left,y:top,w:wallThickness,h:halfHeight-entranceHalf},
      {x:left,y:site.y+entranceHalf,w:wallThickness,h:halfHeight-entranceHalf},
      {x:right-wallThickness,y:top,w:wallThickness,h:halfHeight-entranceHalf},
      {x:right-wallThickness,y:site.y+entranceHalf,w:wallThickness,h:halfHeight-entranceHalf},
    );
  }
  return walls;
}
