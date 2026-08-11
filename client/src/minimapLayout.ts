export interface MinimapLayout{
  x:number;
  y:number;
  size:number;
  modal:boolean;
}

export interface FixedHudTransform{x:number;y:number;scale:number;}

function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value));}

export function resolveMinimapLayout(viewWidth:number,viewHeight:number,mobile:boolean,expanded:boolean):MinimapLayout{
  const width=Math.max(320,viewWidth),height=Math.max(240,viewHeight);
  if(mobile&&expanded){
    const margin=clamp(Math.min(width,height)*.018,10,18);
    const size=Math.max(180,Math.min(width-margin*2,height-margin*2));
    return{x:(width-size)/2,y:(height-size)/2,size,modal:true};
  }
  if(mobile){
    const size=clamp(height*.23,96,124),margin=clamp(height*.018,8,14);
    return{x:width-size-margin,y:margin,size,modal:false};
  }
  const size=expanded?420:160;
  return{x:width-size-14,y:expanded?70:82,size,modal:false};
}

export function resolveFixedHudTransform(viewWidth:number,viewHeight:number,cameraZoom:number):FixedHudTransform{
  const zoom=clamp(cameraZoom,.25,4),scale=1/zoom;
  return{x:-(viewWidth/2)*(1-zoom)*scale,y:-(viewHeight/2)*(1-zoom)*scale,scale};
}

export function fixedHudPoint(screenX:number,screenY:number,viewWidth:number,viewHeight:number,cameraZoom:number){
  const transform=resolveFixedHudTransform(viewWidth,viewHeight,cameraZoom);
  return{x:screenX*transform.scale+transform.x,y:screenY*transform.scale+transform.y,scale:transform.scale};
}
