import { describe,expect,it } from 'vitest';
import { cycleSpectatorTarget,resolveSpectatorTarget,type SpectatorTarget } from '../../client/src/spectatorTarget.js';

const player=(id:string,alive=true,phase='landed'):SpectatorTarget=>({id,alive,phase});

describe('Refactor 046 sticky spectator camera',()=>{
  it('keeps following the same player id when ordering and life state change',()=>{
    const first=[player('ai-a'),player('ai-b'),player('ai-c')];
    expect(resolveSpectatorTarget(first,'ai-b')?.id).toBe('ai-b');
    const reordered=[player('ai-c'),player('ai-a'),player('ai-b',false,'dead')];
    expect(resolveSpectatorTarget(reordered,'ai-b')?.id).toBe('ai-b');
  });

  it('changes targets only through an explicit cycle request',()=>{
    const players=[player('ai-a'),player('ai-b'),player('ai-c')];
    expect(cycleSpectatorTarget(players,'ai-b',1)?.id).toBe('ai-c');
    expect(cycleSpectatorTarget(players,'ai-b',-1)?.id).toBe('ai-a');
    expect(resolveSpectatorTarget([...players].reverse(),'ai-b')?.id).toBe('ai-b');
  });

  it('selects a safe fallback only after the followed player is removed',()=>{
    const remaining=[player('ai-a',false,'dead'),player('ai-c',true,'landed')];
    expect(resolveSpectatorTarget(remaining,'ai-b')?.id).toBe('ai-c');
  });
});
