//=============================================================================
// RPG Maker MZ - Civ Core
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Core object library.
 * @author Peter Dawson
 *
 * Core objects library
 * Civ1 unit attack/defence from https://forums.civfanatics.com/threads/civ1-combat-mechanics-explained.492843/
 *
 * Science cost and corruption from https://civfanatics.com/civ1/faq/section-d-tips-and-information/
 *
 * @help py06pd_CivCore.js
 */

var py06pd = py06pd || {};
py06pd.CivCore = py06pd.CivCore || {};
py06pd.CivCore.TileId = 122;

(function() {

//=============================================================================
// Game_Map
//=============================================================================

    py06pd.CivCore.Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        py06pd.CivCore.Game_Map_initialize.call(this);
        this._difficulty = 0;
        this._empires = [];
        this._geography = [];
        this._mapData = [];
        this._refreshSpriteObjects = false;
        this._turnCount = 0;
        // 0 = Small (islands), 1 = Normal (balanced), 2 = Large (pangaea)
        this._worldLandMass = 1;
        // 0 = Cool (more arctic/tundra), 1 = Temperate (balanced), 2 = Warm (more desert)
        this._worldTemperature = 1;
        // 0 = Arid (more deserts), 1 = Normal (balanced), 2 = Wet (more jungle/swamp)
        this._worldClimate = 1;
        // 0 = 3 billion (more mountains), 1 = 4 billion (balanced), 2 = 5 billion (more hills/lakes)
        this._worldAge = 1;
    };

    py06pd.CivCore.Game_Map_data = Game_Map.prototype.data;
    Game_Map.prototype.data = function() {
        return this._mapData;
    };

    py06pd.CivCore.Game_Map_tileId = Game_Map.prototype.tileId;
    Game_Map.prototype.tileId = function(x, y, z) {
        return this._mapData[(z * this.height() + y) * this.width() + x] || 0;
    };

    py06pd.CivCore.Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        this._tilemap.addChild(new Sprite_Cursor($gamePlayer));
    };
})(); // IIFE

//=============================================================================
// Game_City
//=============================================================================

function Game_City() {
    this.initialize(...arguments);
}

Object.defineProperties(Game_City.prototype, {
    x: {
        get: function() {
            return this._x;
        },
        configurable: true
    },
    y: {
        get: function() {
            return this._y;
        },
        configurable: true
    }
});

Game_City.prototype.initialize = function(name, empire, x, y) {
    this._name = name;
    this._empire = empire;
    this._x = x;
    this._y = y;
    this._buildings = [];
    this._build = null;
    this._population = 1;
    this._workTiles = [{ x, y }];
    this._foodStorage = 0;
    const tile = $gameMap.geography(x, y);
    tile.setIrrigation(true);
    tile.setRoad(true);
    this.autoAddWorkTile();
};

Game_City.prototype.addBuilding = function(name) {
    this._buildings.push(name);
};

Game_City.prototype.buildable = function() {
    const buildings = py06pd.CivData.Buildings.filter(build =>
        $gameMap.empire().learnedTechnology(build.requires) &&
        !this.hasBuilt(build.name) &&
        (!build.wonder || !$gameMap.empires().some(emp => emp.hasBuilt(build.name))))
        .sort((a, b) => a.construct === b.construct ?
            (a.label > b.label ? 1 : -1) : (a.construct > b.construct ? 1 : -1));

    return this.buildableUnits()
        .concat(buildings.filter(build => !build.wonder))
        .concat(buildings.filter(build => build.wonder));
};

Game_City.prototype.buildableUnits = function() {
    return py06pd.CivData.Units.filter(unit =>
        $gameMap.empire().learnedTechnology(unit.requires))
        .sort((a, b) => a.construct === b.construct ?
            (a.label > b.label ? 1 : -1) : (a.construct > b.construct ? 1 : -1));
};

Game_City.prototype.buildObject = function() {
    if (this._build) {
        let data = py06pd.CivData.Buildings;
        if (this._build.type === "unit") {
            data = py06pd.CivData.Units;
        }
        return data.find(build => build.name === this._build.name);
    }

    return null;
};

Game_City.prototype.buildProgress = function() {
    return this._build ? this._build.value : 0;
};

Game_City.prototype.buildType = function() {
    return this._build ? this._build.type : "";
};

Game_City.prototype.hasBuilt = function(name) {
    return this._buildings.includes(name);
};

Game_City.prototype.corruption = function() {
    const gov = this.empire().government();
    if (gov === "democracy") {
        return 0;
    }

    let distance = 32;
    const capital = this.empire().cities().find(city => city.hasBuilt("palace"));
    if (capital) {
        distance = 10;
        if (gov !== "communism") {
            distance = Math.abs(this.x - capital.x) + Math.abs(this.y - capital.y);
        }
    }

    const mod = { despotism: 8, anarchy: 12, monarchy: 16, communism: 20, republic: 24 };
    let corruption = (this.tradeBase() * distance * 3) / (10 * mod[gov]);
    if (this.hasBuilt("courthouse") || this.hasBuilt("palace")) {
        corruption = corruption / 2;
    }

    return corruption;
};

Game_City.prototype.empire = function() {
    return $gameMap.empires().find(emp => emp.name() === this._empire);
};

Game_City.prototype.endTurn = function() {
    // construction
    const obj = this.buildObject();
    if (obj) {
        const next = this._build.value + this.productionYield();
        if (next >= obj.construct) {
            if (this._build.type === "unit") {
                this.empire().addUnit(obj.name, this.x, this.y);
            } else {
                this._buildings.push(obj.name);
            }
            this._build = null;
        } else {
            this._build.value = next;
        }
    }

    // growth
    const maxStorage = this.maxFoodStorage();
    this._foodStorage += this.foodYield() - (this._population * 2);
    if (this._foodStorage > maxStorage) {
        this._population += 1;
        this._foodStorage = this._foodStorage - maxStorage;
        this.autoAddWorkTile();
    }
};

Game_City.prototype.name = function() {
    return this._name;
};

Game_City.prototype.foodStorage = function() {
    return this._foodStorage;
};

Game_City.prototype.maxFoodStorage = function() {
    return (this._population + 1) * 10;
};

Game_City.prototype.foodYield = function() {
    return this._workTiles.reduce((prev, curr) =>
        prev + $gameMap.geography(curr.x, curr.y).food(this.empire().government()), 0);
};

Game_City.prototype.goldYield = function() {
    return Math.round(this.tradeYield() * this.empire().taxRate() / 100);
};

Game_City.prototype.population = function() {
    return this._population;
};

Game_City.prototype.productionYield = function() {
    return this._workTiles.reduce((prev, curr) =>
        prev + $gameMap.geography(curr.x, curr.y).production(this.empire().government()), 0);
};

Game_City.prototype.scienceYield = function() {
    return this.tradeYield() - this.goldYield();
};

Game_City.prototype.specialists = function() {
    return this._population + 1 - this._workTiles.length;
};

Game_City.prototype.tradeBase = function() {
    return this._workTiles.reduce((prev, curr) =>
        prev + $gameMap.geography(curr.x, curr.y).trade(this.empire().government()), 0);
};

Game_City.prototype.tradeYield = function() {
    return Math.max(0, this.tradeBase() - this.corruption());
};

Game_City.prototype.addWorkTile = function(x, y) {
    this._workTiles.push({ x, y });
};

Game_City.prototype.autoAddWorkTile = function() {
    let selectX = -3;
    let selectY = -3;
    let current = null;
    const gov = this.empire().government();
    for (let y = this.y - 2; y < this.y + 3; y++) {
        for (let x = this.x - 2; x < this.x + 3; x++) {
            const tile = $gameMap.geography(x, y);
            if (
                !this._workTiles.some(t => t.x === x && t.y === y) &&
                (!current || tile.food(gov) > current.food(gov) ||
                    (tile.food(gov) === current.food(gov) &&
                        tile.production(gov) > current.production(gov)) ||
                    (tile.food(gov) === current.food(gov) &&
                        tile.production(gov) === current.production(gov) &&
                        tile.trade(gov) > current.trade(gov)))
            ) {
                current = tile;
                selectX = x;
                selectY = y;
            }
        }
    }

    if (current) {
        this._workTiles.push({ x: selectX, y: selectY });
    }
};

Game_City.prototype.isWorkTile = function(x, y) {
    return this._workTiles.some(tile => tile.x === x && tile.y === y);
};

Game_City.prototype.removeWorkTile = function(x, y) {
    const index = this._workTiles.indexOf(tile => tile.x === x && tile.y === y);
    this._workTiles.splice(index, 1);
};

Game_City.prototype.setBuild = function(value) {
    this._build = value;
};

Game_City.prototype.setBuildProgress = function(value) {
    this._build.value = value;
};

//=============================================================================
// Game_CivTile
//=============================================================================

function Game_CivTile() {
    this.initialize(...arguments);
}

Game_CivTile.prototype.initialize = function(type) {
    this._type = type;
    this._fortress = false;
    this._hut = false;
    this._irrigation = false;
    this._mine = false;
    this._railroad = false;
    this._road = false;
    this._resource = "";
};

Game_CivTile.prototype.canStartOn = function() {
    return ["grassland", "plains", "river"].includes(this._type);
};

Game_CivTile.prototype.defence = function() {
    return py06pd.CivData.Tiles[this._type].defence;
};

Game_CivTile.prototype.food = function(government) {
    let food = py06pd.CivData.Tiles[this._type].food;
    if (["desert", "grassland", "hill", "plains", "river"].includes(this._type) && this._irrigation) {
        food += 1;
        if (["grassland", "river"].includes(this._type) && ["anarchy", "despotism"].includes(government)) {
            food -= 1;
        }
    }
    if (this._resource) {
        if (["arctic", "forest", "ocean", "tundra"].includes(this._type)) {
            food += 2;
        }
        if (this._type === "desert") {
            food += 3;
        }
        if (
            ["desert", "forest", "ocean", "tundra"].includes(this._type) &&
            ["anarchy", "despotism"].includes(government)
        ) {
            food -= 1;
        }
    }

    if (this._railroad) {
        food = Math.floor(food * 1.5);
    }

    return food;
};

Game_CivTile.prototype.fortress = function() {
    return this._fortress;
};

Game_CivTile.prototype.hut = function() {
    return this._hut;
};

Game_CivTile.prototype.setHut = function(value) {
    this._hut = value;
};

Game_CivTile.prototype.setIrrigation = function(value) {
    this._irrigation = value;
};

Game_CivTile.prototype.production = function(government) {
    let production = py06pd.CivData.Tiles[this._type].production;
    if (this._mine) {
        if (["desert", "mountain"].includes(this._type)) {
            production += 1;
        }
        if (this._type === "hill") {
            production += 3;
            if (["anarchy", "despotism"].includes(government)) {
                production -= 1;
            }
        }
    }
    if (this._resource) {
        if (["grassland", "river"].includes(this._type)) {
            production += 1;
        }
        if (["hill", "plains"].includes(this._type)) {
            production += 2;
            if (this._type === "plains" && ["anarchy", "despotism"].includes(government)) {
                production -= 1;
            }
        }
        if (this._type === "swamp") {
            production += 4;
        }
    }

    if (this._railroad) {
        production = Math.floor(production * 1.5);
    }

    return production;
};

Game_CivTile.prototype.resource = function() {
    return this._resource;
};

Game_CivTile.prototype.setResource = function(value) {
    this._resource = value ? py06pd.CivData.Tiles[this._type].resource : '';
};

Game_CivTile.prototype.setRoad = function(value) {
    this._road = value;
};

Game_CivTile.prototype.trade = function(government) {
    let trade = py06pd.CivData.Tiles[this._type].trade;
    if (this._road) {
        if (["desert", "grassland", "plains"].includes(this._type)) {
            trade += 1;
        }
        if (["democracy", "republic"].includes(government)) {
            trade += 1;
        }
    }
    if (this._resource) {
        if (this._type === "jungle") {
            trade += 4;
        }
        if (this._type === "mountain") {
            trade += 6;
        }
        if (["jungle", "mountain"].includes(this._type) && ["anarchy", "despotism"].includes(government)) {
            trade -= 1;
        }
    }
    if (["ocean", "river"].includes(this._type) && ["democracy", "republic"].includes(government)) {
        trade += 1;
    }

    if (this._railroad) {
        trade = Math.floor(trade * 1.5);
    }

    return trade;
};

Game_CivTile.prototype.type = function() {
    return this._type;
};

//=============================================================================
// Game_CivUnit
//=============================================================================

function Game_CivUnit() {
    this.initialize(...arguments);
}

Game_CivUnit.prototype = Object.create(Game_Character.prototype);
Game_CivUnit.prototype.constructor = Game_CivUnit;

Game_CivUnit.prototype.initialize = function(name, empire) {
    Game_CharacterBase.prototype.initialize.call(this);
    this._name = name;
    this._empire = empire;
    this._fortified = false;
    this._moved = false;
    this._veteran = 0;
    const unit = this.unit();
    this._movePoints = unit.move;
    this.setImage(unit.characterName, unit.characterIndex);
};

Game_CivUnit.prototype.attack = function(target) {
    let value = this.unit().attack * 8;
    const attackOnPlayer = target.empire().name() === $gameMap.empire().name();
    if (this._empire === "barbarian") {
        if (attackOnPlayer) {
            value = value * ($gameMap.difficulty() + 1) / 4;
        } else {
            value = value / 2;
        }

        if (target.city()) {
            if (target.empire().cities().length === 1) {
                value = 0;
            }

            if (target.city().hasBuilt("palace")) {
                value = value / 2;
            }
        }
    }

    if (this._veteran) {
        value = value * 1.5;
    }

    if (this._movePoints <= 0.2) {
        value = value * (this._movePoints * 10) / 3;
    }

    if (this._empire === "barbarian" && attackOnPlayer && $gameMap.difficulty() < 2) {
        value = value / 2;
    }

    if (this._empire === $gameMap.empire().name() && $gameMap.difficulty() === 0) {
        value = value * 2;
    }

    return value;
};

Game_CivUnit.prototype.canBuildCity = function() {
    return this.unit().buildCity;
};

Game_CivUnit.prototype.defence = function(attacker) {
    const tile = $gameMap.geography(this.x, this.y);
    const unit = this.unit();
    let value = unit.defence;
    if (!unit.sea && !unit.air) {
        value = value * tile.defence();
    }

    if (
        !attacker.unit().ignoreWalls && !unit.air && this.city() &&
        this.city().hasBuilt("walls")
    ) {
        value = value * 12;
    } else {
        if (unit.sea || unit.air) {
            value = value * 8;
        } else {
            if (tile.fortress()) {
                value = value * 8;
            } else if (this._fortified) {
                value = value * 6;
            } else {
                value = value * 4;
            }
        }
    }

    if (this._veteran) {
        value = value * 1.5;
    }

    return value;
};

Game_CivUnit.prototype.city = function() {
    const empire = this.empire();
    return empire ? empire.city(this.x, this.y) : null;
};

Game_CivUnit.prototype.empire = function() {
    return $gameMap.empires().find(emp => emp.name() === this._empire);
};

Game_CivUnit.prototype.unit = function() {
    return py06pd.CivData.Units.find(unit => unit.name === this._name);
};

Game_CivUnit.prototype.getInputDirection = function() {
    return Input.dir4;
};

Game_CivUnit.prototype.moveByInput = function() {
    let direction = this.getInputDirection();
    if (direction > 0) {
        $gameTemp.clearDestination();
    } else if ($gameTemp.isDestinationValid()) {
        const x = $gameTemp.destinationX();
        const y = $gameTemp.destinationY();
        direction = this.findDirectionTo(x, y);
    }
    if (direction > 0) {
        this.moveStraight(direction);
    }
};

Game_CivUnit.prototype.moved = function() {
    return this._moved;
};

Game_CivUnit.prototype.setMoved = function(moved) {
    this._moved = moved;
};

Game_CivUnit.prototype.update = function(sceneActive) {
    const wasMoving = this.isMoving();
    if (sceneActive && !this._moved) {
        this.moveByInput();
        if (this.isMoving()) {
            this._moved = true;
        }
    }
    Game_Character.prototype.update.call(this);
    if (!this.isMoving() && wasMoving) {
        $gameTemp.clearDestination();
    }
};

Game_CivUnit.prototype.veteran = function() {
    return this._veteran;
};

Game_CivUnit.prototype.setVeteran = function(value) {
    this._veteran = value;
};

//=============================================================================
// Game_Empire
//=============================================================================

function Game_Empire() {
    this.initialize(...arguments);
}

Game_Empire.prototype.initialize = function(name) {
    this._name = name;
    this._cities = [];
    this._government = "despotism";
    this._leader = this.empire().leader;
    this._luxuryRate = 0;
    this._taxRate = 50;
    this._units = []
    this._learnedTechnologies = [];
    this._technologyProgress = {};
    this._learningTechnology = null;
};

Game_Empire.prototype.addCity = function(city) {
    this._cities.push(city);
    $gameMap.setRefreshSpriteObjects(true);
};

Game_Empire.prototype.city = function(x, y) {
    return this._cities.find(city => city.x === x && city.y === y);
};

Game_Empire.prototype.cities = function() {
    return this._cities;
};

Game_Empire.prototype.hasBuilt = function(name) {
    return this._cities.some(city => city.hasBuilt(name));
};

Game_Empire.prototype.hasCity = function(name) {
    return this._cities.some(city => city.name() === name);
};

Game_Empire.prototype.nextCityName = function() {
    return this.empire().cityNames.find(name => !$gameMap.empires().some(emp => emp.hasCity(name)));
};

Game_Empire.prototype.empire = function() {
    return py06pd.CivData.Empires.find(emp => emp.name === this._name);
};

Game_Empire.prototype.endTurn = function() {
    // science
    const tech = this.learningTechnology();
    if (tech) {
        let science = this.science() + this.scienceYield();
        if (science >= this.scienceCost()) {
            science = science - this.scienceCost();
            this.addTechnology(tech.name);
            this.setLearningTechnology(null);
        }

        this.setScience(science);
    }

    this._cities.forEach(city => city.endTurn());

    return this._name;
};

Game_Empire.prototype.government = function() {
    return this._government;
};

Game_Empire.prototype.setLeader = function(name) {
    this._leader = name;
};

Game_Empire.prototype.luxuryRate = function() {
    return this._luxuryRate;
};

Game_Empire.prototype.setLuxuryRate = function(rate) {
    this._luxuryRate = rate;
};

Game_Empire.prototype.name = function() {
    return this._name;
};

Game_Empire.prototype.taxRate = function() {
    return this._taxRate;
};

Game_Empire.prototype.setTaxRate = function(rate) {
    this._taxRate = rate;
};

Game_Empire.prototype.addTechnology = function(name) {
    this._learnedTechnologies.push(name);
};

Game_Empire.prototype.learnableTechnologies = function() {
    return py06pd.CivData.Technologies.filter(tech =>
        !tech.requires.some(req => !this.learnedTechnology(req)) &&
        !this.learnedTechnology(tech.name));
};

Game_Empire.prototype.learnedTechnology = function(name) {
    if (name === "") {
        return true;
    }

    return this._learnedTechnologies.includes(name);
};

Game_Empire.prototype.learningTechnology = function() {
    return this._learningTechnology ?
        py06pd.CivData.Technologies.find(tech => tech.name === this._learningTechnology) :
        null;
};

Game_Empire.prototype.setLearningTechnology = function(name) {
    this._learningTechnology = name;
};

Game_Empire.prototype.science = function() {
    return this.scienceProgress(this._learningTechnology);
};

Game_Empire.prototype.scienceCost = function() {
    if (this._learnedTechnologies.length === 0) {
        return 10;
    }

    const mod = [6, 8, 10, 12, 14];
    const timeMod = $gameMap.turnCount() > 200 ? 2 : 1;
    return this._learnedTechnologies.length * mod[$gameMap.difficulty()] * timeMod;
};

Game_Empire.prototype.setScience = function(value) {
    this._technologyProgress[this._learningTechnology] = value;
};

Game_Empire.prototype.scienceProgress = function(name) {
    return this._technologyProgress[name] ?? 0;
};

Game_Empire.prototype.scienceYield = function() {
    return this._cities.reduce((sum, city) => sum + city.scienceYield(), 0);
};

Game_Empire.prototype.addUnit = function(name, x, y) {
    const unit = new Game_CivUnit(name, this._name);
    unit.locate(x, y);
    this._units.push(unit);
    $gameMap.setRefreshSpriteObjects(true);
    return unit;
};

Game_Empire.prototype.removeUnit = function(unit) {
    this._units.splice(this._units.indexOf(unit), 1);
    $gameMap.setRefreshSpriteObjects(true);
};

Game_Empire.prototype.units = function() {
    return this._units;
};

//=============================================================================
// Game_Map
//=============================================================================

Game_Map.prototype.civSprites = function() {
    return this._empires
        .reduce((all, emp) => all.concat(emp.cities().map(city => new Sprite_City(city, false))), [])
        .concat(this._empires.reduce((all, emp) => all.concat(emp.units()
            .map(unit => new Sprite_Character(unit))), []));
};

Game_Map.prototype.difficulty = function() {
    return this._difficulty;
};

Game_Map.prototype.setDifficulty = function(difficulty) {
    this._difficulty = difficulty;
};

Game_Map.prototype.addEmpire = function(empire) {
    this._empires.push(new Game_Empire(empire));
};

Game_Map.prototype.empire = function() {
    return this._empires[0];
};

Game_Map.prototype.empires = function() {
    return this._empires;
};

Game_Map.prototype.geography = function(x, y) {
    return this._geography[y][x];
};

Game_Map.prototype.refreshSpriteObjects = function() {
    return this._refreshSpriteObjects;
};

Game_Map.prototype.setRefreshSpriteObjects = function(refresh) {
    this._refreshSpriteObjects = refresh;
};

Game_Map.prototype.startingPositions = function() {
    const positions = [];
    for (let y = 0; y < $gameMap.height(); y++) {
        for (let x = 0; x < $gameMap.width(); x++) {
            if ($gameMap.geography(x, y).canStartOn()) {
                positions.push({ x, y });
            }
        }
    }

    return positions;
};

Game_Map.prototype.turnCount = function() {
    return this._turnCount;
};

Game_Map.prototype.setTurnCount = function(count) {
    this._turnCount = count;
};

//=============================================================================
// Sprite_City
//=============================================================================

function Sprite_City() {
    this.initialize(...arguments);
}

Sprite_City.prototype = Object.create(Sprite.prototype);
Sprite_City.prototype.constructor = Sprite_City;

Sprite_City.prototype.initialize = function(city, inMenu) {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this._city = city;
    this._inMenu =  inMenu;
    this._population = 0;
    if (this._inMenu) {
        this.redraw();
    }
};

Sprite_City.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._tileId = py06pd.CivCore.TileId;
};

Sprite_City.prototype.drawCity = function() {
    const tileset = $gameMap.tileset();
    const setNumber = 5 + Math.floor(this._tileId / 256);
    const filename = Utils.encodeURI(tileset.tilesetNames[setNumber]) + ".png";
    this.bitmap = Bitmap.load("img/tilesets/" + filename);
};

Sprite_City.prototype.drawPopulation = function(x, y, width, height) {
    const text = this._population;
    const textWidth = this.bitmap.measureTextWidth(text);
    const textHeight = this.textHeight();
    x += Math.max((width - textWidth) / 2, 0);
    y += Math.max((height - textHeight) / 2, 0);
    this.setupLabelFont();
    this.bitmap.drawText(text, x, y, width, textHeight, "left");
};

Sprite_City.prototype.labelOutlineWidth = function() {
    return 3;
};

Sprite_City.prototype.redraw = function() {
    if (this.bitmap) {
        this.bitmap.clear();
    }

    const tileId = this._tileId;
    const pw = $gameMap.tileWidth();
    const ph = $gameMap.tileHeight();
    const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
    const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
    this.drawCity(sx, sy ,pw, ph);
    if (!this._inMenu) {
        this.drawPopulation(sx, sy, pw, ph);
    }
    this.setFrame(sx, sy, pw, ph);
};

Sprite_City.prototype.setupLabelFont = function() {
    this.bitmap.fontFace = $gameSystem.mainFontFace();
    this.bitmap.fontSize = $gameSystem.mainFontSize() - 2;
    this.bitmap.textColor = ColorManager.normalColor();
    this.bitmap.outlineColor = ColorManager.outlineColor();
    this.bitmap.outlineWidth = this.labelOutlineWidth();
};

Sprite_City.prototype.textHeight = function() {
    return 24;
};

Sprite_City.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this._inMenu && this._population !== this._city.population()) {
        this._population = this._city.population();
        this.redraw();
    }
    this.updatePosition();
};

Sprite_City.prototype.updatePosition = function() {
    const tw = $gameMap.tileWidth();
    const th = $gameMap.tileHeight();
    const realX = this._inMenu ? this._city.x : $gameMap.adjustX(this._city.x);
    const realY = this._inMenu ? this._city.y : $gameMap.adjustY(this._city.y);
    this.x = Math.floor(realX * tw + tw / 2);
    this.y = Math.floor(realY * th + th);
    this.z = 1;
};

//=============================================================================
// Sprite_Cursor
//=============================================================================

function Sprite_Cursor() {
    this.initialize(...arguments);
}

Sprite_Cursor.prototype = Object.create(Sprite.prototype);
Sprite_Cursor.prototype.constructor = Sprite_Cursor;

Sprite_Cursor.prototype.initialize = function(cursor) {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.bitmap = ImageManager.loadSystem("cursor");
    this._cursor = cursor;
};

Sprite_Cursor.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.setFrame(0, 0, $gameMap.tileWidth(), $gameMap.tileHeight());
    this.updatePosition();
    this.updateVisibility();
};

Sprite_Cursor.prototype.updateVisibility = function() {
    Sprite.prototype.updateVisibility.call(this);
    if (this._cursor.isTransparent()) {
        this.visible = false;
    }
};

Sprite_Cursor.prototype.updatePosition = function() {
    this.x = this._cursor.screenX();
    this.y = this._cursor.screenY() + 6;
    this.z = this._cursor.screenZ();
};
