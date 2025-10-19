# RPG Maker MZ Civilization-like Game

Create Civ1 like game using RPGMakerMZ

## Plugin order

Code has been separated into different plugins for personal readability, but I have not put much thought into
treating/testing them as discrete plugins.

The order I have tested them in is:
 * PDA_GenerateMap
 * PDA_Setup
 * PDA_TurnCounter
 * PDA_Technology
 * PDA_Unit
 * PDA_CityBuilder

## Progess

 * Map generation
   * Resources
   * Villages
 * Simple technology learning
 * Units
   * Found cities
   * Simple movement
   * Battles
 * City management
   * Build buildings
   * Create units
 * Game setup

## Todo

 * Game setup
   * Leader name
 * Learn technology
   * Select technology to learn
 * City management
   * Buildings
     * Effects
     * Obsolescence
     * Buy
     * Sell
   * Wonders
     * Effects
     * Obsolescence
   * Yields
     * Resource bonuses
   * Citizen BFC assignment
 * Map
   * Better resource graphics
   * Fix resource / hut placement - I think something to do with mods on fractions is causing incorrect patterns, but I don't know how to fix, as from what I've read the common denominator would seem to be 4, but 4^-1 mod 16 has no solution.
   * Village gifts
   * Reveal on explore
   * Fix first and last column tile ids
   * Better river tile graphic
   * Earth
 * Units
   * Found cities
     * Enter name
     * Check tile type / proximity of other cities
   * Battles
     * Unit stack
     * Nuclear
   * Obsolescence
   * Work tiles
   * Zone of control
   * Embark units
   * Move points
 * Victories
   * Space Race
   * Conquest
   * Time
   * Hall of Fame
 * Barbarians
 * Other civs AI
 * Move variables / data to plugin inputs
 * Government types
 * Build palace
 * Build spaceship
 * Happiness
 * Corruption
 * Pollution
 * Volcanoes