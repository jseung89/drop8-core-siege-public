# Fusion Robot

## Core Rule

- Collect all six robot parts: red head, core, limbs and blue head, core, limbs.
- Press `V` on open ground to combine them.
- Combination consumes all six parts, creates one `fusion_robot`, and mounts the player immediately.
- The fusion robot has no duration timer. It remains available as a mount until destroyed or the match world resets.
- Any player can remount an empty fusion robot with `E`.

## Vehicle Balance

- Durability: 1,100 HP
- Top speed: 58% of a motorcycle
- Acceleration: 70% of a motorcycle
- Collision radius: 48 units
- EMP, adhesive, strip traps, spider mines, gunfire, explosions, and vehicle destruction all use the normal vehicle systems.
- When destroyed, two complete red sets and two complete blue sets are scattered back into the field.

## Open Arena Acquisition

- Recurring Open Arena supply drops receive an authoritative sequence number.
- The third successfully deployed supply crate contains exactly one red and one blue head, core, and limbs set.
- Later supply crates return to the normal loot table, so the six-part fusion opportunity happens once per persistent arena world.

## Werewolf Counter

- Werewolf claws deal 72 damage to the fusion robot while ordinary vehicle claw damage remains unchanged.
- The werewolf's close aura deals 7 damage per vehicle tick to the fusion robot.
- A second marked claw, or sustained aura contact, force-dismounts the pilot and disables the fusion robot for 2.4 seconds.
- The ejected pilot cannot immediately remount for 1.25 seconds.

## Weapons

| Key | Weapon | Behavior |
| --- | --- | --- |
| `1` | Explosive missile | Red robot missile and splash damage |
| `2` | Energy laser | Red robot hitscan laser |
| `3` | Anti-mechanical machine gun | Blue robot aim assist and triple mechanical damage |
| `4` | EMP pulse | Stops nearby mechanical equipment for 6 seconds; never disables the firing fusion robot |

All four weapons fire with left click. Cooldowns stay on the vehicle, so changing drivers does not reset them.

## Tank Adjustment

- Center tank cannon capacity is increased from 6 to 20 shells.
