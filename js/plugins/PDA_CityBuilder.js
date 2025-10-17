//=============================================================================
// RPG Maker MZ - City Builder
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Manager for cities.
 * @author Peter Dawson
 *
 * Building stats taken from https://civilization.fandom.com/wiki/Civilization_Games_Wiki
 *
 * @help PDA_CityBuilder.js
 */

var PDA = PDA || {};
PDA.CityBuilder = PDA.CityBuilder || {};
PDA.CityBuilder.TileId = 122;
PDA.CityBuilder.Buildings = [
    { name: "barracks", label: "Barracks", requires: "", construct: 40, maintain: 2, buy: 160, sell: 40 },
    { name: "aqueduct", label: "Aqueduct", requires: "construction", construct: 120, maintain: 2, buy: 480, sell: 120  },
    { name: "bank", label: "Bank", requires: "banking", construct: 120, maintain: 3, buy: 480, sell: 120 },
    { name: "cathedral", label: "Cathedral", requires: "religion", construct: 160, maintain: 3, buy: 640, sell: 160 },
    { name: "walls", label: "City Walls", requires: "masonry", construct: 120, maintain: 2, buy: 480, sell: 120 },
    { name: "colosseum", label: "Colosseum", requires: "construction", construct: 100, maintain: 4, buy: 400, sell: 100 },
    { name: "courthouse", label: "Courthouse", requires: "laws", construct: 80, maintain: 1, buy: 320, sell: 80 },
    { name: "factory", label: "Factory", requires: "industry", construct: 200, maintain: 4, buy: 800, sell: 200 },
    { name: "granary", label: "Granary", requires: "pottery", construct: 60, maintain: 1, buy: 240, sell: 60 },
    { name: "hydro", label: "Hydro Plant", requires: "electronics", construct: 240, maintain: 4, buy: 960, sell: 240 },
    { name: "library", label: "Library", requires: "writing", construct: 80, maintain: 1, buy: 320, sell: 80 },
    { name: "market", label: "Marketplace", requires: "currency", construct: 80, maintain: 1, buy: 320, sell: 80 },
    { name: "transit", label: "Mass Transit", requires: "mass", construct: 160, maintain: 4, buy: 640, sell: 160 },
    { name: "mfg", label: "Mfg. Plant", requires: "robotics", construct: 320, maintain: 6, buy: 1280, sell: 320 },
    { name: "nuclear", label: "Nuclear Plant", requires: "nuclear", construct: 160, maintain: 2, buy: 640, sell: 160 },
    { name: "palace", label: "Palace", requires: "masonry", construct: 200, maintain: 0, buy: 800, sell: 200 },
    { name: "power", label: "Power Plant", requires: "refining", construct: 160, maintain: 4, buy: 640, sell: 160 },
    { name: "recycling", label: "Recycling Centre", requires: "recycling", construct: 200, maintain: 2, buy: 800, sell: 200 },
    { name: "sdi", label: "SDI Defense", requires: "superconductor", construct: 200, maintain: 4, buy: 800, sell: 200 },
    { name: "temple", label: "Temple", requires: "burial", construct: 40, maintain: 1, buy: 160, sell: 40 },
    { name: "university", label: "University", requires: "university", construct: 160, maintain: 3, buy: 640, sell: 160 },
    { name: "apollo", label: "Apollo Program", requires: "space", construct: 600, wonder: true },
    { name: "colossus", label: "Colossus", requires: "bronze", construct: 200, wonder: true },
    { name: "copernicus", label: "Copernicus' Observatory", requires: "astronomy", construct: 300, wonder: true },
    { name: "cancer", label: "Cure for Cancer", requires: "genetics", construct: 600, wonder: true },
    { name: "darwon", label: "Darwin's Voyage", requires: "railroad", construct: 300, wonder: true },
    { name: "glibrary", label: "Great Library", requires: "literacy", construct: 300, wonder: true },
    { name: "gwall", label: "Great Wall", requires: "masonry", construct: 300, wonder: true },
    { name: "gardens", label: "Hanging Gardens", requires: "pottery", construct: 300, wonder: true },
    { name: "hoover", label: "Hoover Dam", requires: "electronics", construct: 600, wonder: true },
    { name: "newton", label: "Isaac Newton's College", requires: "gravity", construct: 400, wonder: true },
    { name: "bach", label: "J.S. Bach's Cathedral", requires: "religion", construct: 400, wonder: true },
    { name: "lighthouse", label: "Great Lighthouse", requires: "maps", construct: 200, wonder: true },
    { name: "magellan", label: "Magellan's Expedition", requires: "navigation", construct: 400, wonder: true },
    { name: "manhattan", label: "Manhattan Project", requires: "fission", construct: 600, wonder: true },
    { name: "michelangelo", label: "Michelangelo's Chapel", requires: "religion", construct: 300, wonder: true },
    { name: "oracle", label: "Oracle", requires: "mysticism", construct: 300, wonder: true },
    { name: "pyramids", label: "Great Pyramid", requires: "masonry", construct: 300, wonder: true },
    { name: "seti", label: "SETI Program", requires: "computers", construct: 600, wonder: true },
    { name: "globe", label: "Globe Theatre", requires: "medicine", construct: 400, wonder: true },
    { name: "united", label: "United Nations", requires: "communism", construct: 600, wonder: true },
    { name: "suffrage", label: "Women's Suffrage", requires: "industry", construct: 600, wonder: true }
];

(function() {

//=============================================================================
// Game_Map
//=============================================================================

    PDA.CityBuilder.Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        PDA.CityBuilder.Game_Map_initialize.call(this);
        this._cities = [];
        this._citySprites = [];
    };

    PDA.CityBuilder.Game_Map_civSprites = Game_Map.prototype.civSprites;
    Game_Map.prototype.civSprites = function() {
        return PDA.CityBuilder.Game_Map_civSprites.call(this)
            .concat(this._citySprites);
    };

    PDA.CityBuilder.Game_Map_scienceYield = Game_Map.prototype.scienceYield;
    Game_Map.prototype.scienceYield = function() {
        PDA.CityBuilder.Game_Map_scienceYield.call(this);
        // Stand-in science yield until it can be got from actual yield
        return this._cities.length;
    };

//=============================================================================
// Scene_Map
//=============================================================================

    PDA.CityBuilder.Scene_Map_launchGame = Scene_Map.prototype.launchGame;
    Scene_Map.prototype.launchGame = function() {
        PDA.CityBuilder.Scene_Map_launchGame.call(this);

        $gameMap.addCity({
            name: "city1",
            label: "Test",
            x: $gamePlayer.x,
            y: $gamePlayer.y - 1,
            buildings: [],
            building: null
        });
    };

    PDA.CityBuilder.Scene_Map_processOk = Scene_Map.prototype.processOk;
    Scene_Map.prototype.processOk = function(x, y) {
        PDA.CityBuilder.Scene_Map_processOk.call(this, x, y);

        $gameMap.cities().forEach(city => {
            if (x === city.x && y === city.y) {
                $gameTemp.setLastTargetActorId(city.name);
                SceneManager.push(Scene_City);
            }
        });
    };

    PDA.CityBuilder.Scene_Map_endTurn = Scene_Map.prototype.endTurn;
    Scene_Map.prototype.endTurn = function() {
        PDA.CityBuilder.Scene_Map_endTurn.call(this);
        $gameMap.cities().forEach(city => {
            if (city.building) {
                let data = PDA.CityBuilder.Buildings;
                if (city.building.type === "unit" && PDA.Unit) {
                    data = PDA.Unit.Units;
                }
                const building = data.find(build => build.name === city.building.name);
                const next = city.building.value + this.productionYield(city);
                if (next >= building.construct) {
                    city.buildings.push(city.building.value);
                    city.building = null;
                } else {
                    city.building.value = next;
                }
            }
        });
    };
})(); // IIFE

//=============================================================================
// Game_Map
//=============================================================================

Game_Map.prototype.addCity = function(city) {
   this._cities.push(city);
   this._citySprites = new Sprite_City(city.x, city.y);
   this._refreshSpriteObjects = true;
};

Game_Map.prototype.cities = function() {
    return this._cities;
};

//=============================================================================
// Scene_City
//=============================================================================

function Scene_City() {
    this.initialize(...arguments);
}

Scene_City.prototype = Object.create(Scene_MenuBase.prototype);
Scene_City.prototype.constructor = Scene_City;

Scene_City.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_City.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameMap.cities().find(city => city.name === $gameTemp.lastActionData(4));
    this.createCommandWindow();
    this.createYieldWindow();
    this.createBuildWindow();
    this.createBFCWindow();
    this.refreshActor();
};

Scene_City.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_CityCommand(rect);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler("build", this.commandBuild.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._commandWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_City.prototype.commandWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_City.prototype.createYieldWindow = function() {
    const rect = this.yieldWindowRect();
    this._yieldWindow = new Window_CityYield(rect);
    this.addWindow(this._yieldWindow);
};

Scene_City.prototype.yieldWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const wx = 0;
    const wy = commandWindowRect.y + commandWindowRect.height;
    const ww = 100;
    const wh = this.mainAreaHeight() - commandWindowRect.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_City.prototype.createBFCWindow = function() {
    const rect = this.BFCWindowRect();
    this._bfcWindow = new Window_CityBFC(rect);
    this.addWindow(this._bfcWindow);
};

Scene_City.prototype.BFCWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const yieldWindowRect = this.yieldWindowRect();
    const wx = yieldWindowRect.width;
    const wy = commandWindowRect.y + commandWindowRect.height;
    const ww = 200;
    const wh = this.mainAreaHeight() - commandWindowRect.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_City.prototype.createBuildWindow = function() {
    const rect = this.buildWindowRect();
    this._buildWindow = new Window_CityBuild(rect);
    this._buildWindow.setHandler("ok", this.onBuildOk.bind(this));
    this._buildWindow.setHandler("cancel", this.onBuildCancel.bind(this));
    this.addWindow(this._buildWindow);
};

Scene_City.prototype.buildWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const yieldWindowRect = this.yieldWindowRect();
    const bfcWindowRect = this.BFCWindowRect();
    const wx = yieldWindowRect.width + bfcWindowRect.width;
    const wy = commandWindowRect.y + commandWindowRect.height;
    const ww = Graphics.boxWidth - wx;
    const wh = this.mainAreaHeight() - commandWindowRect.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_City.prototype.needsPageButtons = function() {
    return $gameMap.cities().length > 1;
};

Scene_City.prototype.refreshActor = function() {
    const city = this.actor();
    this._yieldWindow.setCity(city);
    this._bfcWindow.setCity(city);
    this._buildWindow.setCity(city);
};

Scene_City.prototype.commandBuild = function() {
    this._buildWindow.activate();
    this._buildWindow.select(0);
};

Scene_City.prototype.onBuildOk = function() {
    this._buildWindow.activate();
};

Scene_City.prototype.onBuildCancel = function() {
    this._buildWindow.deselect();
    this._commandWindow.activate();
};

Scene_City.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this._buildWindow.deselect();
    this._buildWindow.deactivate();
    this._commandWindow.activate();
};

Scene_City.prototype.nextActor = function() {
    const index = $gameMap.cities().findIndex(city => city.name === this._actor.name);
    this._actor = $gameMap.cities()[index + 1 === $gameMap.cities().length ? 0 : index + 1];
    this.onActorChange();
};

Scene_City.prototype.previousActor = function() {
    const index = $gameMap.cities().findIndex(city => city.name === this._actor.name);
    this._actor = $gameMap.cities()[index === 0 ? $gameMap.cities().length - 1 : index + 1];
    this.onActorChange();
};

//=============================================================================
// Scene_Map
//=============================================================================

Scene_Map.prototype.productionYield = function(city) {
    return 1;
};

//=============================================================================
// Sprite_City
//=============================================================================

function Sprite_City() {
    this.initialize(...arguments);
}

Sprite_City.prototype = Object.create(Sprite.prototype);
Sprite_City.prototype.constructor = Sprite_City;

Sprite_City.prototype.initialize = function(x, y) {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this._realX = x;
    this._realY = y;
};

Sprite_City.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._tileId = PDA.CityBuilder.TileId;
    const tileset = $gameMap.tileset();
    const setNumber = 5 + Math.floor(this._tileId / 256);
    this.bitmap = ImageManager.loadTileset(tileset.tilesetNames[setNumber]);

    const tileId = this._tileId;
    const pw = $gameMap.tileWidth();
    const ph = $gameMap.tileHeight();
    const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
    const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

Sprite_City.prototype.updatePosition = function() {
    const tw = $gameMap.tileWidth();
    const th = $gameMap.tileHeight();
    this.x = Math.floor($gameMap.adjustX(this._realX) * tw + tw / 2);
    this.y = Math.floor($gameMap.adjustY(this._realY) * th + th);
    this.z = 1;
};

//=============================================================================
// Window_CityCommand
//=============================================================================

function Window_CityCommand() {
    this.initialize(...arguments);
}

Window_CityCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_CityCommand.prototype.constructor = Window_CityCommand;

Window_CityCommand.prototype.initialize = function(rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
};

Window_CityCommand.prototype.maxCols = function() {
    return 1;
};

Window_CityCommand.prototype.makeCommandList = function() {
    this.addCommand("Build", "build");
};

//=============================================================================
// Window_CityYield
//=============================================================================

function Window_CityYield() {
    this.initialize(...arguments);
}

Window_CityYield.prototype = Object.create(Window_StatusBase.prototype);
Window_CityYield.prototype.constructor = Window_CityYield;

Window_CityYield.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._city = null;
    this.refresh();
};

Window_CityYield.prototype.setCity = function(city) {
    if (this._city !== city) {
        this._city = city;
        this.refresh();
    }
};

Window_CityYield.prototype.refresh = function() {
    this.contents.clear();
    if (this._city) {
        // draw yields here
    }
};

//=============================================================================
// Window_CityBFC
//=============================================================================

function Window_CityBFC() {
    this.initialize(...arguments);
}

Window_CityBFC.prototype = Object.create(Window_StatusBase.prototype);
Window_CityBFC.prototype.constructor = Window_CityBFC;

Window_CityBFC.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._city = null;
    this.refresh();
};

Window_CityBFC.prototype.setCity = function(city) {
    if (this._city !== city) {
        this._city = city;
        this.refresh();
    }
};

Window_CityBFC.prototype.refresh = function() {
    this.contents.clear();
    if (this._city) {
        // draw BFC here
    }
};

//=============================================================================
// Window_CityBuild
//=============================================================================

function Window_CityBuild() {
    this.initialize(...arguments);
}

Window_CityBuild.prototype = Object.create(Window_Selectable.prototype);
Window_CityBuild.prototype.constructor = Window_CityBuild;

Window_CityBuild.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._city = null;
    this.refresh();
};

Window_CityBuild.prototype.setCity = function(city) {
    if (this._city !== city) {
        this._city = city;
        this.refresh();
    }
};

Window_CityBuild.prototype.buildable = function() {
    if (this._city) {
        const buildings = PDA.CityBuilder.Buildings.filter(build =>
            (!PDA.Technology || $gameMap.learnedTechnology(build.requires)) &&
            !this._city.buildings.includes(build.name) &&
            (!build.wonder || !$gameMap.cities().some(city => city.buildings.includes(build.name))))
            .sort((a, b) => a.construct === b.construct ?
                (a.label > b.label ? 1 : -1) : (a.construct > b.construct ? 1 : -1));

        let buildable = buildings.filter(build => !build.wonder)
            .concat(buildings.filter(build => build.wonder));

        if (PDA.Unit) {
            const units = PDA.Unit.Units.filter(unit =>
                (!PDA.Technology || $gameMap.learnedTechnology(unit.requires)))
                .sort((a, b) => a.construct === b.construct ?
                    (a.label > b.label ? 1 : -1) : (a.construct > b.construct ? 1 : -1));
            buildable = units.concat(buildable);
        }

        return buildable;
    }

    return this._city ? this.buildable().length : [];
};

Window_CityBuild.prototype.maxItems = function() {
    return this.buildable().length;
};

Window_CityBuild.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_CityBuild.prototype.itemAt = function(index) {
    return this._city ? this.buildable()[index] : null;
};

Window_CityBuild.prototype.drawItem = function(index) {
    if (this._city) {
        const item = this.itemAt(index);
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(true);
        this.resetTextColor();
        this.drawText(item.label, rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
    }
};
