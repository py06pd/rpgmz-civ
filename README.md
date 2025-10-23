# RPG Maker MZ Civilization-like Game

Create Civ1 like game using RPGMakerMZ

## Plugin order

Code has been separated into different plugins for personal readability, but I have not put much thought into
treating/testing them as discrete plugins.

The order I have tested them in is:
 * py06pd_CivData
 * py06pd_CivCore
 * py06pd_GenerateMap
 * py06pd_Setup
 * py06pd_TurnCounter
 * py06pd_Technology
 * py06pd_Unit
 * py06pd_CityBuilder
 * py06pd_CivMenu

## Progress

 * Map generation
   * Resources
   * Villages
 * Learn technology
 * Units
   * Found cities
   * Simple movement
   * Battles
 * City
   * Build buildings
   * Create units
   * Corruption
 * Menu
   * Tax rate
   * Luxury rate
 * Game setup

## Todo

 * Game setup
   * Occasional fatal error on map generation
 * Learn technology
   * Display tech info eg. leads to, buildings, wonders, units
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
 * Menu
   * Save
   * Load
   * Civilopedia
   * Luxury rate
 * Barbarians
 * Other civs AI
 * Trade technologies
 * Steal technologies
 * Move variables / data to plugin inputs
 * Government types
 * Build palace
 * Build spaceship
 * Happiness
 * Pollution
 * Volcanoes