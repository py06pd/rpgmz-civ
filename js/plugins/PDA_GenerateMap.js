//=============================================================================
// RPG Maker MZ - Generate Map
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Generate a Civ1 map.
 * @author Peter Dawson
 *
 * Civ1 map generation based on logic at https://forums.civfanatics.com/threads/civ1-map-generation-explained.498630/
 *
 * Using Game_Map width and height rather than using hard coded values, but untested for width != 80 and height != 50
 *
 * @help PDA_GenerateMap.js
 */

var PDA = PDA || {};
PDA.GenerateMap = PDA.GenerateMap || {};
PDA.GenerateMap.seaBaseTileId = 2048;
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

(function() {

//=============================================================================
// Game_Map
//=============================================================================

    PDA.GenerateMap.Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        PDA.GenerateMap.Game_Map_initialize.call(this);
        this._geography = [];
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

    PDA.GenerateMap.Game_Map_height = Game_Map.prototype.height;
    Game_Map.prototype.height = function() {
        return $dataMap ? PDA.GenerateMap.Game_Map_height.call(this) : 50;
    };

    PDA.GenerateMap.Game_Map_isLoopHorizontal = Game_Map.prototype.isLoopHorizontal;
    Game_Map.prototype.isLoopHorizontal = function() {
        return $dataMap ? PDA.GenerateMap.Game_Map_isLoopHorizontal.call(this) : true;
    };

    PDA.GenerateMap.Game_Map_isLoopVertical = Game_Map.prototype.isLoopVertical;
    Game_Map.prototype.isLoopVertical = function() {
        return $dataMap ? PDA.GenerateMap.Game_Map_isLoopVertical.call(this) : false;
    };

    PDA.GenerateMap.Game_Map_encounterStep = Game_Map.prototype.encounterStep;
    Game_Map.prototype.encounterStep = function() {
        return $dataMap ? PDA.GenerateMap.Game_Map_encounterStep.call(this) : 0;
    };

    PDA.GenerateMap.Game_Map_width = Game_Map.prototype.width;
    Game_Map.prototype.width = function() {
        return $dataMap ? PDA.GenerateMap.Game_Map_width.call(this) : 80;
    };

    //=============================================================================
    // Game_Player
    //=============================================================================

    PDA.GenerateMap.Game_Player_isMapPassable = Game_Player.prototype.isMapPassable;
    Game_Player.prototype.isMapPassable = function(x, y, z) {
        return true;
    };

})(); // IIFE

//=============================================================================
// Game_Map
//=============================================================================

Game_Map.prototype.geography = function() {
    return this._geography;
};

Game_Map.prototype.generateMap = function(landMass, temperature, climate, age) {
    this._worldLandMass = landMass;
    this._worldTemperature = temperature;
    this._worldClimate = climate;
    this._worldAge = age;
    let geography = this.generateLandMass(this._worldLandMass);
    geography = this.adjustTemperature(geography, this._worldTemperature);
    geography = this.adjustClimate(geography, this._worldClimate);
    geography = this.adjustAge(geography, this._worldAge);
    geography = this.generateRivers(geography, this._worldLandMass, this._worldClimate);
    geography = this.generatePoles(geography);

    const mapData = [];
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

    this._geography = geography;
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
                geography[y + 1][x - 1] !== "sea" &&
                geography[y + 1][x + 1] !== "sea" &&
                geography[y - 1][x + 1] !== "sea" &&
                geography[y - 1][x - 1] !== "sea"
            ) {
                geography[y][x] = "sea";
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
            if (geography[y][x] === "sea") {
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
            if (geography[y][x] === "sea") {
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
                geography[y][x] = "sea";
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
            let seaNearby = null;
            if (geography[tile.y + 1][tile.x] === "sea") {
                seaNearby = { y: tile.y + 1, x: tile.x };
            } else if (geography[tile.y][tile.x + 1] === "sea") {
                seaNearby = { y: tile.y, x: tile.x + 1 };
            } else if (geography[tile.y - 1][tile.x] === "sea") {
                seaNearby = { y: tile.y - 1, x: tile.x };
            } else if (geography[tile.y][tile.x - 1] === "sea") {
                seaNearby = { y: tile.y, x: tile.x - 1 };
            }

            A = ((C - (riverLength % 2)) * 2 + A + 8) % 8;
            riverLength++;
            tile = neighbours[A];
            if (seaNearby || ["sea", "mountain", "river"].includes(geography[tile.y][tile.x])) {
                if ((seaNearby || geography[tile.y][tile.x] === "river") && riverLength >= 5) {
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

                    if (seaNearby) {
                        riverMouths.push(seaNearby);
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
        if (tile === "sea" || tile === "riverMouth") {
            types = ["sea", "riverMouth"];
            tileId = PDA.GenerateMap.seaBaseTileId;
        } else if (tile === "arctic") {
            types = ["arctic"];
            tileId = PDA.GenerateMap.arcticBaseTileId;
        } else if (tile === "tundra") {
            types = ["tundra"];
            tileId = PDA.GenerateMap.tundraBaseTileId;
        } else if (tile === "desert") {
            types = ["desert"];
            tileId = PDA.GenerateMap.desertBaseTileId;
        } else {
            types = ["grassland", "plains", "forest", "swamp", "jungle", "river", "hill", "mountain"];
            tileId = PDA.GenerateMap.plainsBaseTileId;
        }
    } else if (z === 1) {
        if (tile === "grassland") {
            types = ["grassland"];
            tileId = PDA.GenerateMap.grasslandBaseTileId;
        } else if (tile === "river" || tile === "riverMouth") {
            types = ["river", "riverMouth"];
            tileId = PDA.GenerateMap.riverBaseTileId;
        } else if (tile === "hill") {
            types = ["hill"];
            tileId = PDA.GenerateMap.hillBaseTileId;
        } else if (tile === "mountain") {
            types = ["mountain"];
            tileId = PDA.GenerateMap.mountainBaseTileId;
        } else if (tile === "forest") {
            types = ["forest"];
            tileId = PDA.GenerateMap.forestBaseTileId;
        } else if (tile === "jungle") {
            types = ["jungle"];
            tileId = PDA.GenerateMap.jungleBaseTileId;
        }
    }

    if (tileId > 0 && neighbours[0] && neighbours[2] && neighbours[4] && neighbours[6]) {
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
