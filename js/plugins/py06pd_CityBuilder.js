//=============================================================================
// RPG Maker MZ - City Builder
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Manager for cities.
 * @author Peter Dawson
 *
 * @help py06pd_CityBuilder.js
 */

var py06pd = py06pd || {};
py06pd.CityBuilder = py06pd.CityBuilder || {};

(function() {

//=============================================================================
// Scene_CivSetup
//=============================================================================

    py06pd.CityBuilder.Scene_CivSetup_setupGame = Scene_CivSetup.prototype.setupGame;
    Scene_CivSetup.prototype.setupGame = function() {
        py06pd.CityBuilder.Scene_CivSetup_setupGame.call(this);

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

    py06pd.CityBuilder.Scene_Map_processOk = Scene_Map.prototype.processOk;
    Scene_Map.prototype.processOk = function(x, y) {
        let consumed = py06pd.CityBuilder.Scene_Map_processOk.call(this, x, y);
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

    py06pd.CityBuilder.Scene_Map_endTurn = Scene_Map.prototype.endTurn;
    Scene_Map.prototype.endTurn = function() {
        py06pd.CityBuilder.Scene_Map_endTurn.call(this);
        $gameMap.empires().forEach(emp => {
            emp.cities().forEach(city => {
                const obj = city.buildObject();
                if (obj) {
                    const next = city.buildProgress() + city.productionYield();
                    if (next >= obj.construct) {
                        if (city.buildType() === "unit") {
                            if (py06pd.Unit) {
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

    py06pd.CityBuilder.Window_TileInfo_refresh = Window_TileInfo.prototype.refresh;
    Window_TileInfo.prototype.refresh = function() {
        py06pd.CityBuilder.Window_TileInfo_refresh.call(this);
        const rect = this.baseTextRect();
        this.drawCityInfo(rect.x, rect.y + this.lineHeight() * this._lines, rect.width);
    };
})(); // IIFE

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
