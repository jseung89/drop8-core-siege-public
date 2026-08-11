import { describe,expect,it } from 'vitest';
import { GAME_MODE_CHOICES,gameModeChoice,roomsForGameMode } from '../../client/src/gameModeBrowser.js';

describe('Refactor 066 game mode browser',()=>{
  it('offers each supported game mode once',()=>{
    expect(GAME_MODE_CHOICES.map((mode)=>mode.id)).toEqual(['battleRoyale','openArena','domination','coreSiege']);
    expect(new Set(GAME_MODE_CHOICES.map((mode)=>mode.id)).size).toBe(GAME_MODE_CHOICES.length);
  });

  it('keeps core siege room defaults together with its mode choice',()=>{
    expect(gameModeChoice('coreSiege')).toMatchObject({mapId:'coreSiege',maxHumans:6,aiCount:4,matchFormat:'teams',teamAiBlue:2,teamAiRed:2});
  });

  it('shows only rooms belonging to the selected mode',()=>{
    const rooms=[{roomCode:'A',gameMode:'battleRoyale'},{roomCode:'B',gameMode:'coreSiege'},{roomCode:'C',gameMode:'coreSiege'}];
    expect(roomsForGameMode(rooms,'coreSiege').map((room)=>room.roomCode)).toEqual(['B','C']);
    expect(roomsForGameMode(rooms,null)).toEqual([]);
  });
});
