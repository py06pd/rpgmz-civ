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

    PDA.CityBuilder.Game_Map_civSprites = Game_Map.prototype.civSprites;
    Game_Map.prototype.civSprites = function() {
        return PDA.CityBuilder.Game_Map_civSprites.call(this)
            .concat(this._empires.reduce((all, emp) => all.concat(emp.cities()
                .map(city => new Sprite_City(city.x, city.y))), []));
    };

//=============================================================================
// Game_Empire
//=============================================================================

    PDA.CityBuilder.Game_Empire_initialize = Game_Empire.prototype.initialize;
    Game_Empire.prototype.initialize = function(name) {
        PDA.CityBuilder.Game_Empire_initialize.call(this, name);
        this._cities = [];
    };

    PDA.CityBuilder.Game_Empire_scienceYield = Game_Empire.prototype.scienceYield;
    Game_Empire.prototype.scienceYield = function() {
        return PDA.CityBuilder.Game_Empire_scienceYield.call(this) +
            this._cities.reduce((sum, city) => sum + city.scienceYield(), 0);
    };

//=============================================================================
// Scene_CivSetup
//=============================================================================

    PDA.CityBuilder.Scene_CivSetup_setupGame = Scene_CivSetup.prototype.setupGame;
    Scene_CivSetup.prototype.setupGame = function() {
        PDA.CityBuilder.Scene_CivSetup_setupGame.call(this);

        // Add city for all non-player empires
        const positions = $gameMap.startingPositions();
        const used = $gameMap.empire().cities().map(city => ({ x: city.x, y: city.y }));
        $gameMap.empires().forEach((emp, index) => {
            const start = positions[Math.randomInt(positions.length)];
            if (index > 0 && !used.includes(start)) {
                emp.addCity(new Game_City(emp.nextCityName(), start.x, start.y));
                used.push(start);
            }
        });
    };

//=============================================================================
// Scene_Map
//=============================================================================

    PDA.CityBuilder.Scene_Map_processOk = Scene_Map.prototype.processOk;
    Scene_Map.prototype.processOk = function(x, y) {
        let consumed = PDA.CityBuilder.Scene_Map_processOk.call(this, x, y);
        if (!consumed && this.isPlayerActive()) {
            $gameMap.empire().cities().forEach((city, index) => {
                if (x === city.x && y === city.y) {
                    $gameTemp.setLastTargetActorId(index);
                    SceneManager.push(Scene_City);
                }
            });
        }

        return consumed;
    };

    PDA.CityBuilder.Scene_Map_endTurn = Scene_Map.prototype.endTurn;
    Scene_Map.prototype.endTurn = function() {
        PDA.CityBuilder.Scene_Map_endTurn.call(this);
        $gameMap.empires().forEach(emp => {
            emp.cities().forEach(city => {
                const obj = city.buildObject();
                if (obj) {
                    const next = city.buildProgress() + city.productionYield();
                    if (next >= obj.construct) {
                        if (city.buildType() === "unit") {
                            if (PDA.Unit) {
                                emp.addUnit(obj.name, city.x, city.y);
                            }
                        } else {
                            city.addBuilding(obj.name);
                        }
                        city.setBuild(null);
                    } else {
                        city.setBuildProgress(next);
                    }
                }
            });
        });
    };

//=============================================================================
// Window_TileInfo
//=============================================================================

    PDA.CityBuilder.Window_TileInfo_refresh = Window_TileInfo.prototype.refresh;
    Window_TileInfo.prototype.refresh = function() {
        PDA.CityBuilder.Window_TileInfo_refresh.call(this);
        const rect = this.baseTextRect();
        this.drawCityInfo(rect.x, rect.y + this.lineHeight() * this._lines, rect.width);
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

Game_City.prototype.initialize = function(name, x, y) {
    this._name = name;
    this._x = x;
    this._y = y;
    this._buildings = [];
    this._build = null;
};

Game_City.prototype.addBuilding = function(name) {
    this._buildings.push(name);
};

Game_City.prototype.buildable = function() {
    const buildings = PDA.CityBuilder.Buildings.filter(build =>
        (!PDA.Technology || $gameMap.empire().learnedTechnology(build.requires)) &&
        !this.hasBuilt(build.name) &&
        (!build.wonder || !$gameMap.empires().some(emp => emp.hasBuilt(build.name))))
        .sort((a, b) => a.construct === b.construct ?
            (a.label > b.label ? 1 : -1) : (a.construct > b.construct ? 1 : -1));

    return this.buildableUnits()
        .concat(buildings.filter(build => !build.wonder))
        .concat(buildings.filter(build => build.wonder));
};

Game_City.prototype.buildableUnits = function() {
    if (PDA.Unit) {
        return PDA.Unit.Units.filter(unit =>
            (!PDA.Technology || $gameMap.empire().learnedTechnology(unit.requires)))
            .sort((a, b) => a.construct === b.construct ?
                (a.label > b.label ? 1 : -1) : (a.construct > b.construct ? 1 : -1));
    }

    return [];
};

Game_City.prototype.buildObject = function() {
    if (this._build) {
        let data = PDA.CityBuilder.Buildings;
        if (this._build.type === "unit" && PDA.Unit) {
            data = PDA.Unit.Units;
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

Game_City.prototype.name = function() {
    return this._name;
};

Game_City.prototype.productionYield = function() {
    // Stand-in production yield until it can be got from actual yield
    return 1;
};

Game_City.prototype.scienceYield = function() {
    // Stand-in science yield until it can be got from actual yield
    return 1;
};

Game_City.prototype.setBuild = function(value) {
    this._build = value;
};

Game_City.prototype.setBuildProgress = function(value) {
    this._build.value = value;
};

//=============================================================================
// Game_Empire
//=============================================================================

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
    this._index = $gameTemp.lastActionData(4);
    this.createNameWindow();
    this.createCommandWindow();
    this.createYieldWindow();
    this.createBFCWindow();
    this.createBuildingsWindow();
    this.createBuildWindow();
    this.refreshActor();
};

Scene_City.prototype.createNameWindow = function() {
    const rect = this.nameWindowRect();
    this._nameWindow = new Window_CityName(rect);
    this.addWindow(this._nameWindow);
};

Scene_City.prototype.nameWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth / 2;
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
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
    const wx = this._nameWindow.width;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth / 2;
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

Scene_City.prototype.createBuildingsWindow = function() {
    const rect = this.buildingsWindowRect();
    this._buildingsWindow = new Window_CityBuildings(rect);
    this._buildingsWindow.setHandler("ok", this.onBuildOk.bind(this));
    this._buildingsWindow.setHandler("cancel", this.onBuildCancel.bind(this));
    this.addWindow(this._buildingsWindow);
};

Scene_City.prototype.buildingsWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const yieldWindowRect = this.yieldWindowRect();
    const bfcWindowRect = this.BFCWindowRect();
    const wx = yieldWindowRect.width + bfcWindowRect.width;
    const wy = commandWindowRect.y + commandWindowRect.height;
    const ww = Graphics.boxWidth - wx;
    const wh = this.mainAreaHeight() - commandWindowRect.height - this.calcWindowHeight(1, false);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_City.prototype.createBuildWindow = function() {
    const rect = this.buildWindowRect();
    this._buildWindow = new Window_CityBuild(rect);
    this.addWindow(this._buildWindow);
};

Scene_City.prototype.buildWindowRect = function() {
    const buildingsWindowRect = this.buildingsWindowRect();
    const wx = buildingsWindowRect.x;
    const wy = buildingsWindowRect.y + buildingsWindowRect.height;
    const ww = buildingsWindowRect.width;
    const wh = this.calcWindowHeight(1, false);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_City.prototype.needsPageButtons = function() {
    return $gameMap.empire().cities().length > 1;
};

Scene_City.prototype.refreshActor = function() {
    const city = $gameMap.empire().cities()[this._index];
    this._nameWindow.setText(city.name());
    this._yieldWindow.setCity(city);
    this._bfcWindow.setCity(city);
    this._buildingsWindow.setCity(city);
    this._buildWindow.setCity(city);
};

Scene_City.prototype.commandBuild = function() {
    this._buildingsWindow.activate();
    this._buildingsWindow.select(0);
};

Scene_City.prototype.onBuildOk = function() {
    const build = this._buildingsWindow.item();
    $gameMap.empire().cities()[this._index].setBuild({ type: build.characterIndex ? 'unit' : 'building', name: build.name, value: 0 })
    this._buildWindow.refresh();
    this._buildingsWindow.activate();
};

Scene_City.prototype.onBuildCancel = function() {
    this._buildingsWindow.deselect();
    this._commandWindow.activate();
};

Scene_City.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this._buildingsWindow.deselect();
    this._buildingsWindow.deactivate();
    this._commandWindow.activate();
};

Scene_City.prototype.nextActor = function() {
    this._index = this._index + 1 === $gameMap.empire().cities().length ? 0 : this._index + 1;
    this.onActorChange();
};

Scene_City.prototype.previousActor = function() {
    this._index = this._index === 0 ? $gameMap.empire().cities().length - 1 : this._index - 1;
    this.onActorChange();
};

Scene_City.prototype.helpAreaHeight = function() {
    return 0;
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

Sprite_City.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updatePosition();
};

Sprite_City.prototype.updatePosition = function() {
    const tw = $gameMap.tileWidth();
    const th = $gameMap.tileHeight();
    this.x = Math.floor($gameMap.adjustX(this._realX) * tw + tw / 2);
    this.y = Math.floor($gameMap.adjustY(this._realY) * th + th);
    this.z = 1;
};

//=============================================================================
// Window_CityName
//=============================================================================

function Window_CityName() {
    this.initialize(...arguments);
}

Window_CityName.prototype = Object.create(Window_Base.prototype);
Window_CityName.prototype.constructor = Window_CityName;

Window_CityName.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._text = "";
};

Window_CityName.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_CityName.prototype.refresh = function() {
    const rect = this.baseTextRect();
    this.contents.clear();
    if (this._text) {
        this.drawText(this._text, rect.x, rect.y, rect.width);
    }
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
// Window_CityBuildings
//=============================================================================

function Window_CityBuildings() {
    this.initialize(...arguments);
}

Window_CityBuildings.prototype = Object.create(Window_Selectable.prototype);
Window_CityBuildings.prototype.constructor = Window_CityBuildings;

Window_CityBuildings.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._city = null;
    this.refresh();
};

Window_CityBuildings.prototype.setCity = function(city) {
    if (this._city !== city) {
        this._city = city;
        this.refresh();
    }
};

Window_CityBuildings.prototype.maxItems = function() {
    return this._city ? this._city.buildable().length : 0;
};

Window_CityBuildings.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_CityBuildings.prototype.itemAt = function(index) {
    return this._city ? this._city.buildable()[index] : null;
};

Window_CityBuildings.prototype.drawItem = function(index) {
    if (this._city) {
        const item = this.itemAt(index);
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(true);
        this.resetTextColor();
        const cost = item.construct;
        const textWidth = this.textWidth(cost);
        this.drawText(item.label, rect.x, rect.y, rect.width - textWidth);
        this.drawText(cost, rect.x, rect.y, rect.width, "right");
        this.changePaintOpacity(true);
    }
};

//=============================================================================
// Window_CityBuild
//=============================================================================

function Window_CityBuild() {
    this.initialize(...arguments);
}

Window_CityBuild.prototype = Object.create(Window_Base.prototype);
Window_CityBuild.prototype.constructor = Window_CityBuild;

Window_CityBuild.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._city = null;
};

Window_CityBuild.prototype.setCity = function(city) {
    if (this._city !== city) {
        this._city = city;
        this.refresh();
    }
};

Window_CityBuild.prototype.refresh = function() {
    const rect = this.baseTextRect();
    this.contents.clear();
    const unit = this._city.buildObject();
    if (unit) {
        const progress = this._city.buildProgress() + "/" + unit.construct;
        const textWidth = this.textWidth(progress);
        this.drawText(this._city.buildObject().label, rect.x, rect.y, rect.width - textWidth);
        this.drawText(progress, rect.x, rect.y, rect.width, "right");
    }
};

//=============================================================================
// Window_TileInfo
//=============================================================================

Window_TileInfo.prototype.drawCityInfo = function(x, y, width) {
    $gameMap.empires().forEach(emp => {
        const found = emp.city(this._x, this._y);
        if (found) {
            const label = found.name() + " (" + emp.empire().label + ")";
            this.drawText(label, x, y, width);
        }
    });
};
