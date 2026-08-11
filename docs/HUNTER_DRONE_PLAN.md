# Hunter Drone Plan

## Priority

1. Adhesive sprayer floor puddles
2. Stun gun
3. Hunter drone throwable

The hunter drone should come after the adhesive and stun changes because it needs new moving state, target selection, collision, explosion, rendering, audio, and tests.

## Gameplay Role

Hunter drone is a low-damage pressure throwable. It follows a nearby visible enemy, forces movement, and can finish very low-health targets, but it should not replace frag grenades or guns.

## First Version Spec

- Type: throwable
- Carry limit: 1
- Activation: thrown object lands, then arms after 0.4 seconds
- Targeting: nearest alive enemy in 460 range
- Line of sight: no target lock through solid walls
- Chase duration: 4.5 seconds
- Movement speed: 230
- Explosion radius: 80
- Damage: 24 max, 8 min by distance
- Vehicle damage: 12 max
- Counterplay: can be shot, expires after chase duration, water slows or disables it
- AI: do not use in first version

## Implementation Notes

- Add `hunterDrone` to `ThrowableType`, `LOOT_LABELS`, `LOOT_COLORS`, and loot tables.
- Add a `HunterDroneState` server schema map instead of overloading `ThrownObjectState`.
- Convert a landed `hunterDrone` thrown object into `HunterDroneState`.
- Each tick, pick or maintain a visible target and steer toward it.
- Explode on contact, expiration, or destruction.
- Render as a small blinking drone with a faint targeting ring.
- Add focused tests for spawn, target selection, expiry, damage, and wall blocking.
