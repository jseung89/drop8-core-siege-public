export type SpectatorTarget={id:string;alive:boolean;phase:string};

function availableTargets<T extends SpectatorTarget>(players:readonly T[],excludeId=''){
  return players.filter((player)=>player.id!==excludeId);
}

function activeTargets<T extends SpectatorTarget>(players:readonly T[]){
  const landed=players.filter((player)=>player.alive&&player.phase==='landed');
  if(landed.length)return landed;
  const alive=players.filter((player)=>player.alive);
  return alive.length?alive:[...players];
}

export function resolveSpectatorTarget<T extends SpectatorTarget>(players:readonly T[],currentTargetId:string,excludeId=''){
  const available=availableTargets(players,excludeId);
  const current=available.find((player)=>player.id===currentTargetId);
  if(current)return current;
  return activeTargets(available)[0];
}

export function cycleSpectatorTarget<T extends SpectatorTarget>(players:readonly T[],currentTargetId:string,direction:-1|1,excludeId=''){
  const candidates=activeTargets(availableTargets(players,excludeId));
  if(!candidates.length)return undefined;
  const currentIndex=candidates.findIndex((player)=>player.id===currentTargetId);
  const baseIndex=currentIndex>=0?currentIndex:direction>0?-1:0;
  return candidates[(baseIndex+direction+candidates.length)%candidates.length];
}
