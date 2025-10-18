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
 * Simple technology learning
 * Units
   * Found cities
   * Simple movement
 * Simple city construction
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
   * Create units
   * Citizen BFC assignment
 * Map
   * Generate resources
   * Generate villages
   * Reveal on explore
   * Fix first and last column tile ids
   * Better river tile graphic
   * Earth
 * Units
   * Found cities
     * Enter name
     * Check tile type / proximity of other cities
   * Battles
   * Obsolescence
   * Work tiles
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