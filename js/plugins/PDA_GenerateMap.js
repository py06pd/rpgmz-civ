//=============================================================================
// RPG Maker MZ - Generate Map
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Generate a Civ1 map.
 * @author Peter Dawson
 *
 * Civ1 map generation based on logic at https://forums.civfanatics.com/threads/civ1-map-generation-explained.498630/
 * Civ1 resource and hut generation based on logic at https://forums.civfanatics.com/threads/modding-civilization-i-patterns-for-huts-and-special-resources.339049/
 *
 * Using Game_Map width and height rather than using hard coded values, but untested for width != 80 and height != 50
 *
 * @help PDA_GenerateMap.js
 */

var PDA = PDA || {};
PDA.GenerateMap = PDA.GenerateMap || {};
PDA.GenerateMap.oceanBaseTileId = 2048;
PDA.GenerateMap.arcticBaseTileId = 2528;
PDA.GenerateMap.tundraBaseTileId = 3968;
PDA.GenerateMap.desertBaseTileId = 3584;
PDA.GenerateMap.plainsBaseTileId = 2816;
PDA.GenerateMap.grasslandBaseTileId = 2864;
PDA.GenerateMap.riverBaseTileId = 2096;
PDA.GenerateMap.hillBaseTileId = 3104;
PDA.GenerateMap.mountainBaseTileId = 3872;
PDA.GenerateMap.forestBaseTileId = 3056;
PDA.GenerateMap.jungleBaseTileId = 3776;
PDA.GenerateMap.tileIds = {
    arctic: 2528,
    coal: 10,
    desert: 3584,
    fish: 10,
    forest: 3056,
    game1: 10,
    game2: 10,
    gem: 10,
    gold: 10,
    grassland: 2864,
    horse: 10,
    hill: 3104,
    hut: 8,
    jungle: 3776,
    mountain: 3872,
    oasis: 5,
    ocean: 2048,
    oil: 10,
    plains: 2816,
    river: 2096,
    seal: 10,
    shield: 10,
    swamp: 4,
    tundra: 3968,
};
PDA.GenerateMap.resources = {
    arctic: "seal",
    desert: "oasis",
    forest: "game1",
    grassland: "shield",
    hill: "coal",
    jungle: "gem",
    mountain: "gold",
    ocean: "fish",
    plains: "horse",
    river: "shield",
    swamp: "oil",
    tundra: "game2"
};
PDA.GenerateMap.tiles = {
    arctic: { defence: 2, food: 0, moveCost: 2, production: 0, resource: "seal", trade: 0, resourceFood: 2, resourceProduction: 0, resourceTrade: 0 },
    desert: { defence: 2, food: 0, moveCost: 1, production: 1, resource: "oasis", trade: 0, resourceFood: 3, resourceProduction: 0, resourceTrade: 0 },
    forest: { defence: 3, food: 1, moveCost: 2, production: 2, resource: "game1", trade: 0, resourceFood: 2, resourceProduction: 0, resourceTrade: 0 },
    grassland: { defence: 2, food: 2, moveCost: 1, production: 0, resource: "shield", trade: 0, resourceFood: 0, resourceProduction: 1, resourceTrade: 0 },
    hill: { defence: 4, food: 1, moveCost: 2, production: 0, resource: "coal", trade: 0, resourceFood: 0, resourceProduction: 2, resourceTrade: 0 },
    jungle: { defence: 3, food: 1, moveCost: 2, production: 0, resource: "gem", trade: 0, resourceFood: 0, resourceProduction: 0, resourceTrade: 4 },
    mountain: { defence: 6, food: 0, moveCost: 3, production: 1, resource: "gold", trade: 0, resourceFood: 0, resourceProduction: 0, resourceTrade: 6 },
    ocean: { defence: 2, food: 1, moveCost: 1, production: 0, resource: "fish", trade: 0, resourceFood: 2, resourceProduction: 0, resourceTrade: 0 },
    plains: { defence: 2, food: 1, moveCost: 1, production: 1, resource: "horse", trade: 0, resourceFood: 0, resourceProduction: 2, resourceTrade: 0 },
    river: { defence: 3, food: 2, moveCost: 1, production: 0, resource: "shield", trade: 0, resourceFood: 0, resourceProduction: 1, resourceTrade: 0 },
    riverMouth: { defence: 2, food: 1, moveCost: 1, production: 0, resource: "fish", trade: 0, resourceFood: 2, resourceProduction: 0, resourceTrade: 0 },
    swamp: { defence: 3, food: ``, moveCost: 2, production: 0, resource: "oil", trade: 0 , resourceFood: 0, resourceProduction: 4, resourceTrade: 0 },
    tundra: { defence: 2, food: 1, moveCost: 1, production: 0, resource: "game2", trade: 0, resourceFood: 3, resourceProduction: 0, resourceTrade: 0 }
};
PDA.GenerateMap.vocab = {
    arctic: "Arctic",
    coal: "Coal",
    desert: "Desert",
    fish: "Fish",
    forest: "Forest",
    game1: "Game",
    game2: "Game",
    gem: "Gems",
    gold: "Gold",
    grassland: "Grassland",
    horse: "Horses",
    hill: "Hills",
    hut: "Village",
    jungle: "Jungle",
    mountain: "Mountain",
    oasis: "Oasis",
    ocean: "Ocean",
    oil: "Oil",
    plains: "Plains",
    river: "River",
    riverMouth: "Ocean",
    seal: "Seal",
    shield: "Shield",
    swamp: "Swamp",
    tundra: "Tundra"
};

(function() {

//=============================================================================
// Game_Map
//=============================================================================

    PDA.GenerateMap.Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        PDA.GenerateMap.Game_Map_initialize.call(this);
        this._geography = [];
        this._resources = [];
        this._huts = [];
        this._mapData = [];
        // 0 = Small (islands), 1 = Normal (balanced), 2 = Large (pangaea)
        this._worldLandMass = 1;
        // 0 = Cool (more arctic/tundra), 1 = Temperate (balanced), 2 = Warm (more desert)
        this._worldTemperature = 1;
        // 0 = Arid (more deserts), 1 = Normal (balanced), 2 = Wet (more jungle/swamp)
        this._worldClimate = 1;
        // 0 = 3 billion (more mountains), 1 = 4 billion (balanced), 2 = 5 billion (more hills/lakes)
        this._worldAge = 1;
    };

    PDA.GenerateMap.Game_Map_data = Game_Map.prototype.data;
    Game_Map.prototype.data = function() {
        return this._mapData;
    };

    PDA.GenerateMap.Game_Map_tileId = Game_Map.prototype.tileId;
    Game_Map.prototype.tileId = function(x, y, z) {
        return this._mapData[(z * this.height() + y) * this.width() + x] || 0;
    };

    //=============================================================================
    // Game_Player
    //=============================================================================

    PDA.GenerateMap.Game_Player_isMapPassable = Game_Player.prototype.isMapPassable;
    Game_Player.prototype.isMapPassable = function(x, y, z) {
        return true;
    };

//=============================================================================
// Scene_Map
//=============================================================================

    PDA.GenerateMap.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createTileInfoWindow();
        PDA.GenerateMap.Scene_Map_createAllWindows.call(this);
    };

})(); // IIFE

//=============================================================================
// Game_Map
//=============================================================================

Game_Map.prototype.geography = function(x, y) {
    return this._geography[y][x];
};

Game_Map.prototype.generateMap = function(landMass, temperature, climate, age) {
    this._worldLandMass = landMass;
    this._worldTemperature = temperature;
    this._worldClimate = climate;
    this._worldAge = age;
    this._geography = this.emptyLandMass();
    let geography = this.generateLandMass(this._worldLandMass);
    geography = this.adjustTemperature(geography, this._worldTemperature);
    geography = this.adjustClimate(geography, this._worldClimate);
    geography = this.adjustAge(geography, this._worldAge);
    geography = this.generateRivers(geography, this._worldLandMass, this._worldClimate);
    geography = this.generatePoles(geography);

    const mapData = [];
    const resourceSeed = Math.randomInt(16);
    for (let z = 0; z < 2; z++) {
        for (let y = 0; y < this.height(); y++) {
            for (let x = 0; x < this.width(); x++) {
                const neighbours = [
                    y > 0 ? geography[y - 1][x] : null,
                    x < (this.width() - 1) && y > 0 ? geography[y - 1][x + 1] : null,
                    x < (this.width() - 1) ? geography[y][x + 1] : null,
                    x < (this.width() - 1) && y < (this.height() - 1) ? geography[y + 1][x + 1] : null,
                    y < (this.height() - 1) ? geography[y + 1][x] : null,
                    x > 0 && y < (this.height() - 1) ? geography[y + 1][x - 1] : null,
                    x > 0 ? geography[y][x - 1] : null,
                    x > 0 && y > 0 ? geography[y - 1][x - 1] : null
                ];

                mapData.push(this.generatedTileId(geography[y][x], neighbours, z));
            }
        }
    }

    for (let y = 0; y < this.height(); y++) {
        for (let x = 0; x < this.width(); x++) {
            const tile = new Game_CivTile(geography[y][x]);
            const val1 = (x * 13 / 4) + (y * 11 / 4) + resourceSeed;
            const val2 = ((x % 4) * 4 + (y % 4));
            if ((val1 % 16) === val2) {
                tile.setResource(true);
                mapData.push(PDA.GenerateMap.tileIds[tile.resource()]);
            } else {
                mapData.push(0);
            }

            this._geography[y][x] = tile;
        }
    }

    for (let y = 0; y < this.height(); y++) {
        for (let x = 0; x < this.width(); x++) {
            const val1 = (x * 13 / 4) + (y * 11 / 4) + resourceSeed;
            const val2 = ((x % 4) * 4 + (y % 4));
            if (((val1 + 8) % 32) === val2 && !["ocean", "riverMouth"].includes(geography[y][x])) {
                this._geography[y][x].setHut(true);
                mapData.push(PDA.GenerateMap.tileIds.hut);
            } else {
                mapData.push(0);
            }
        }
    }

    this._mapData = mapData;
};

Game_Map.prototype.generateLandChuck = function() {
    const stencil = this.emptyLandMass();

    let x = Math.randomInt(this.width() - 12) + 4;
    let y = Math.randomInt(this.height() - 24) + 8;
    let pathLength = Math.randomInt(64) + 1;

    while (pathLength > 0 && (x >= 3 && x <= (this.width() - 4)) && (y >= 3 && y <= (this.height() - 5))) {
        stencil[y][x] = 15;
        stencil[y][x + 1] = 15;
        stencil[y + 1][x] = 15;
        pathLength = pathLength - 1;

        const dir = Math.randomInt(4);
        if (dir === 0) {
            y = y - 1;
        } else if (dir === 1) {
            x = x + 1;
        } else if (dir === 2) {
            y = y + 1;
        } else {
            x = x - 1;
        }
    }

    return stencil;
};

Game_Map.prototype.emptyLandMass = function() {
    const land = [];

    for (let y = 0; y < this.height(); y++) {
        land.push([]);
        for (let x = 0; x < this.width(); x++) {
            land[y].push(0);
        }
    }

    return land;
};

Game_Map.prototype.generateLandMass = function(landMass) {
    const geography = this.emptyLandMass();

    let totalLandMass = 0;
    while (totalLandMass < ((landMass + 2) * 320)) {
        const chunk = this.generateLandChuck();

        totalLandMass = 0;
        for (let y = 0; y < this.height(); y++) {
            for (let x = 0; x < this.width(); x++) {
                if (chunk[y][x] > 0) {
                    if (geography[y][x] > 0) {
                        geography[y][x]++;
                    } else {
                        geography[y][x] = 1;
                    }
                }
                if (geography[y][x] > 0) {
                    totalLandMass++;
                }
            }
        }
    }

    // Correct narrow passages
    for (let y = 0; y < (this.height() - 1); y++) {
        for (let x = 0; x < (this.width() - 1); x++) {
            if (
                geography[y][x] > 0 && geography[y + 1][x] === 0 &&
                geography[y][x + 1] === 0 && geography[y + 1][x + 1] > 0
            ) {
                geography[y + 1][x] = 1;
                geography[y][x + 1] = 1;
            }
            if (
                geography[y][x] === 0 && geography[y + 1][x] > 0 &&
                geography[y][x + 1] > 0 && geography[y + 1][x + 1] === 0
            ) {
                geography[y + 1][x + 1] = 1;
            }
        }
    }

    return geography;
};

Game_Map.prototype.adjustAge = function(geography, age) {
    const loopCount = 800 * (1 + age);
    let x = 0;
    let y = 0;

    for (let i = 0; i < loopCount; i++) {
        if ((i % 2) === 0) {
            x = Math.randomInt(this.width() - 2) + 1;
            y = Math.randomInt(this.height() - 2) + 1;
        } else {
            const dir = Math.randomInt(4);
            if (dir === 0) {
                y = y - 1;
            } else if (dir === 1) {
                x = x + 1;
            } else if (dir === 2) {
                y = y + 1;
            } else {
                x = x - 1;
            }
        }

        if (geography[y][x] === "forest") {
            geography[y][x] = "jungle";
        } else if (geography[y][x] === "swamp") {
            geography[y][x] = "grassland";
        } else if (geography[y][x] === "plains") {
            geography[y][x] = "hill";
        } else if (geography[y][x] === "tundra") {
            geography[y][x] = "hill";
        } else if (geography[y][x] === "grassland") {
            geography[y][x] = "forest";
        } else if (geography[y][x] === "jungle") {
            geography[y][x] = "swamp";
        } else if (geography[y][x] === "hill") {
            geography[y][x] = "mountain";
        } else if (geography[y][x] === "mountain") {
            if (
                x > 0 && x < (this.width() - 1) && y > 0 && y < (this.height() - 1) &&
                geography[y + 1][x - 1] !== "ocean" &&
                geography[y + 1][x + 1] !== "ocean" &&
                geography[y - 1][x + 1] !== "ocean" &&
                geography[y - 1][x - 1] !== "ocean"
            ) {
                geography[y][x] = "ocean";
            }
        } else if (geography[y][x] === "desert") {
            geography[y][x] = "plains";
        } else if (geography[y][x] === "arctic") {
            geography[y][x] = "mountain";
        }
    }

    return geography;
};

Game_Map.prototype.adjustClimate = function(geography, climate) {
    for (let y = 0; y < this.height(); y++) {
        let wetness = 0;
        let latitude = Math.abs(Math.floor(this.height() / 2) - y);
        for (let x = 0; x < this.width(); x++) {
            if (geography[y][x] === "ocean") {
                const tileYield = Math.abs(latitude - Math.floor(this.height() / 4)) + (climate * 4);
                if (tileYield > wetness) {
                    wetness++;
                }
            } else if (wetness > 0) {
                const rainfall = Math.randomInt(8 - (climate * 2));
                wetness = Math.max(wetness - rainfall, 0);
                if (geography[y][x] === "tundra") {
                    geography[y][x] = "arctic";
                } else if (geography[y][x] === "plains") {
                    geography[y][x] = "grassland";
                } else if (geography[y][x] === "desert") {
                    geography[y][x] = "plains";
                } else if (geography[y][x] === "hill") {
                    geography[y][x] = "forest";
                } else if (geography[y][x] === "mountain") {
                    wetness = Math.max(wetness - 3, 0);
                }
            }
        }

        wetness = 0;
        for (let x = (this.width() - 1); x >= 0; x--) {
            if (geography[y][x] === "ocean") {
                const tileYield = (latitude / 2) + climate;
                if (tileYield > wetness) {
                    wetness++;
                }
            } else if (wetness > 0) {
                const rainfall = Math.randomInt(8 - (climate * 2));
                wetness = Math.max(wetness - rainfall, 0);
                if (geography[y][x] === "plains") {
                    geography[y][x] = "grassland";
                } else if (geography[y][x] === "desert") {
                    geography[y][x] = "plains";
                } else if (geography[y][x] === "grassland") {
                    geography[y][x] = latitude >= 10 ? "swamp" : "jungle";
                    wetness = Math.max(wetness - 2, 0);
                } else if (geography[y][x] === "hill") {
                    geography[y][x] = "forest";
                } else if (geography[y][x] === "mountain") {
                    geography[y][x] = "forest";
                    wetness = Math.max(wetness - 3, 0);
                }
            }
        }
    }

    return geography;
};

Game_Map.prototype.adjustTemperature = function(geography, temperature) {
    for (let y = 0; y < this.height(); y++) {
        for (let x = 0; x < this.width(); x++) {
            if (geography[y][x] > 2) {
                geography[y][x] = "hill";
            } else if (geography[y][x] === 2) {
                geography[y][x] = "mountain";
            } else if (geography[y][x] === 1) {
                geography[y][x] = "desert";
                const lat = 1 + ((Math.abs(y + Math.randomInt(8) - ((this.height() / 2) + 4)) + 1 - temperature) / 6);
                if (lat >= 6) {
                    geography[y][x] = "arctic";
                } else if (lat >= 4) {
                    geography[y][x] = "tundra";
                } else if (lat >= 2) {
                    geography[y][x] = "plains";
                }
            } else {
                geography[y][x] = "ocean";
            }
        }
    }

    return geography;
};

Game_Map.prototype.generateRivers = function(geography, landMass, climate) {
    let riverCount = 0;
    let loopCount = 0;
    const maxRivers = ((climate + landMass) * 2) + 6;
    const hills = [];
    const riverMouths = [];
    for (let y = 0; y < this.height(); y++) {
        for (let x = 0; x < this.width(); x++) {
            if (geography[y][x] === "hill") {
                hills.push({ y, x });
            }
        }
    }

    while (loopCount < 256 || riverCount > maxRivers) {
        const backup = JSON.parse(JSON.stringify(geography));
        let riverLength = 0;
        let tile = hills[Math.randomInt(hills.length)];
        let A = Math.randomInt(4) * 2;
        while (true) {
            const C = Math.randomInt(2);
            const neighbours = [
                { y: tile.y - 1, x: tile.x },
                { y: tile.y - 1, x: tile.x + 1 },
                { y: tile.y, x: tile.x + 1 },
                { y: tile.y + 1, x: tile.x + 1 },
                { y: tile.y + 1, x: tile.x },
                { y: tile.y + 1, x: tile.x - 1 },
                { y: tile.y, x: tile.x - 1 },
                { y: tile.y - 1, x: tile.x - 1 },
            ];
            geography[tile.y][tile.x] = "river";
            let oceanNearby = null;
            if (geography[tile.y + 1][tile.x] === "ocean") {
                oceanNearby = { y: tile.y + 1, x: tile.x };
            } else if (geography[tile.y][tile.x + 1] === "ocean") {
                oceanNearby = { y: tile.y, x: tile.x + 1 };
            } else if (geography[tile.y - 1][tile.x] === "ocean") {
                oceanNearby = { y: tile.y - 1, x: tile.x };
            } else if (geography[tile.y][tile.x - 1] === "ocean") {
                oceanNearby = { y: tile.y, x: tile.x - 1 };
            }

            A = ((C - (riverLength % 2)) * 2 + A + 8) % 8;
            riverLength++;
            tile = neighbours[A];
            if (oceanNearby || ["ocean", "mountain", "river"].includes(geography[tile.y][tile.x])) {
                if ((oceanNearby || geography[tile.y][tile.x] === "river") && riverLength >= 5) {
                    riverCount++;
                    for (let y = -3; y < 4; y++) {
                        for (let x = -3; x < 4; x++) {
                            if (
                                tile.x + x >= 0 && tile.x + x < this.width() &&
                                tile.y + y >= 0 && tile.y + y < this.height() &&
                                geography[tile.y + y][tile.x + x] === "forest"
                            ) {
                                geography[tile.y + y][tile.x + x] = "jungle";
                            }
                        }
                    }

                    if (oceanNearby) {
                        riverMouths.push(oceanNearby);
                    }
                } else {
                    geography = backup;
                }

                break;
            }
        }

        loopCount++;
    }

    riverMouths.forEach(tile => {
        geography[tile.y][tile.x] = "riverMouth";
    });

    return geography;
};


Game_Map.prototype.generatePoles = function(geography) {
    for (let x = 0; x < this.width(); x++) {
        [0, this.height() - 1].forEach(lat => {
            geography[lat][x] = "arctic";
        });
    }

    let loopCount = 0;
    while (loopCount < 20) {
        [0, 1, this.height() - 2, this.height() - 1].forEach(lat => {
            const rand = Math.randomInt(this.width());
            geography[lat][rand] = "tundra";
        });

        loopCount++;
    }

    return geography;
};

Game_Map.prototype.generatedTileId = function(tile, neighbours, z) {
    let tileId = 0;
    let types = [];
    if (z === 0) {
        if (tile === "ocean" || tile === "riverMouth") {
            types = ["ocean", "riverMouth"];
            tileId = PDA.GenerateMap.tileIds.ocean;
        } else if (["grassland", "plains", "forest", "swamp", "jungle", "river", "hill", "mountain"].includes(tile)) {
            types = ["grassland", "plains", "forest", "swamp", "jungle", "river", "hill", "mountain"];
            tileId = PDA.GenerateMap.tileIds.plains;
        } else {
            types = [tile];
            tileId = PDA.GenerateMap.tileIds[tile];
        }
    } else if (z === 1) {
        if (tile === "river" || tile === "riverMouth") {
            types = ["river", "riverMouth"];
            tileId = PDA.GenerateMap.tileIds.river;
        } else if (["grassland", "hill", "mountain", "forest", "swamp", "jungle"].includes(tile)) {
            types = [tile];
            tileId = PDA.GenerateMap.tileIds[tile];
        }
    }

    if (tileId > 0 && neighbours[0] && neighbours[2] && neighbours[4] && neighbours[6] && tile !== "swamp") {
        if (
            !types.includes(neighbours[6]) &&
            !types.includes(neighbours[0]) &&
            !types.includes(neighbours[2]) &&
            !types.includes(neighbours[4])
        ) {
            tileId += 46;
        } else if (
            !types.includes(neighbours[6]) &&
            !types.includes(neighbours[0]) &&
            !types.includes(neighbours[2])
        ) {
            tileId += 42;
        } else if (
            !types.includes(neighbours[6]) &&
            !types.includes(neighbours[0]) &&
            !types.includes(neighbours[4])
        ) {
            tileId += 43;
        } else if (
            !types.includes(neighbours[6]) &&
            !types.includes(neighbours[2]) &&
            !types.includes(neighbours[4])
        ) {
            tileId += 44;
        } else if (
            !types.includes(neighbours[0]) &&
            !types.includes(neighbours[2]) &&
            !types.includes(neighbours[4])
        ) {
            tileId += 45;
        } else if (!types.includes(neighbours[6]) && !types.includes(neighbours[2])) {
            tileId += 32;
        } else if (!types.includes(neighbours[0]) && !types.includes(neighbours[4])) {
            tileId += 33;
        } else if (!types.includes(neighbours[6]) && !types.includes(neighbours[0])) {
            tileId += 34;
            if (!types.includes(neighbours[3])) {
                tileId += 1;
            }
        } else if (!types.includes(neighbours[0]) && !types.includes(neighbours[2])) {
            tileId += 36;
            if (!types.includes(neighbours[5])) {
                tileId += 1;
            }
        } else if (!types.includes(neighbours[2]) && !types.includes(neighbours[4])) {
            tileId += 38;
            if (!types.includes(neighbours[7])) {
                tileId += 1;
            }
        } else if (!types.includes(neighbours[4]) && !types.includes(neighbours[6])) {
            tileId += 40;
            if (!types.includes(neighbours[1])) {
                tileId += 1;
            }
        } else if (!types.includes(neighbours[6])) {
            tileId += 16;
            if (!types.includes(neighbours[1])) {
                tileId += 1;
            }
            if (!types.includes(neighbours[3])) {
                tileId += 2;
            }
        } else if (!types.includes(neighbours[0])) {
            tileId += 20;
            if (!types.includes(neighbours[3])) {
                tileId += 1;
            }
            if (!types.includes(neighbours[5])) {
                tileId += 2;
            }
        } else if (!types.includes(neighbours[2])) {
            tileId += 24;
            if (!types.includes(neighbours[5])) {
                tileId += 1;
            }
            if (!types.includes(neighbours[7])) {
                tileId += 2;
            }
        } else if (!types.includes(neighbours[4])) {
            tileId += 28;
            if (!types.includes(neighbours[7])) {
                tileId += 1;
            }
            if (!types.includes(neighbours[1])) {
                tileId += 2;
            }
        } else {
            if (!types.includes(neighbours[7])) {
                tileId += 1;
            }
            if (!types.includes(neighbours[1])) {
                tileId += 2;
            }
            if (!types.includes(neighbours[3])) {
                tileId += 4;
            }
            if (!types.includes(neighbours[5])) {
                tileId += 8;
            }
        }
    }

    return tileId;
};

//=============================================================================
// Game_CivTile
//=============================================================================

function Game_CivTile() {
    this.initialize(...arguments);
}

Game_CivTile.prototype.initialize = function(type) {
    this._type = type;
    this._hut = false;
    this._improvements = [];
    this._resource = "";
};

Game_CivTile.prototype.canStartOn = function() {
    return ["grassland", "plains", "river"].includes(this._type);
};

Game_CivTile.prototype.defence = function() {
    return PDA.GenerateMap.tiles[this._type].defence;
};

Game_CivTile.prototype.fortress = function() {
    return this._improvements.includes("fortress");
};

Game_CivTile.prototype.hut = function() {
    return this._hut;
};

Game_CivTile.prototype.setHut = function(value) {
    this._hut = value;
};

Game_CivTile.prototype.resource = function() {
    return this._resource;
};

Game_CivTile.prototype.setResource = function(value) {
    this._resource = value ? PDA.GenerateMap.tiles[this._type].resource : '';
};

Game_CivTile.prototype.type = function() {
    return this._type;
};

//=============================================================================
// Scene_Map
//=============================================================================

Scene_Map.prototype.createTileInfoWindow = function() {
    const rect = this.tileInfoWindowRect();
    this._tileWindow = new Window_TileInfo(rect);
    this.addWindow(this._tileWindow);
};

Scene_Map.prototype.tileInfoWindowRect = function() {
    const wx = 0;
    const wy = this.calcWindowHeight(2, false);
    const ww = 170;
    const wh = Graphics.boxHeight - this.calcWindowHeight(2, false) - this.calcWindowHeight(1, false);
    return new Rectangle(wx, wy, ww, wh);
};

//=============================================================================
// Window_TileInfo
//=============================================================================

function Window_TileInfo() {
    this.initialize(...arguments);
}

Window_TileInfo.prototype = Object.create(Window_Base.prototype);
Window_TileInfo.prototype.constructor = Window_TileInfo;

Window_TileInfo.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._x = -1;
    this._y = -1;
};

Window_TileInfo.prototype.refresh = function() {
    this.contents.clear();
    const rect = this.baseTextRect();
    this._lines = 0;
    this.drawTileInfo(rect.x, rect.y, rect.width);
};

Window_TileInfo.prototype.drawTileInfo = function(x, y, width) {
    const tile = $gameMap.geography(this._x, this._y);
    const type = PDA.GenerateMap.vocab[tile.type()];

    this.drawText(type, x, y, width);
    this._lines++;

    if (tile.resource() !== "") {
        this.drawText(PDA.GenerateMap.vocab[tile.resource()], x, y + this.lineHeight(), width);
        this._lines++;
    }

    if (tile.hut()) {
        this.drawText(PDA.GenerateMap.vocab.hut, x, y + (this.lineHeight() * this._lines), width);
        this._lines++;
    }
};

Window_TileInfo.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if ($gamePlayer.x !== this._x || $gamePlayer.y !== this._y) {
        this._x = $gamePlayer.x;
        this._y = $gamePlayer.y;
        this.refresh();
    }
};
