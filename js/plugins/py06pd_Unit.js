//=============================================================================
// RPG Maker MZ - Units
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Units.
 * @author Peter Dawson
 *
 * Civ1 combat mechanics based on logic at https://forums.civfanatics.com/threads/civ1-combat-mechanics-explained.492843/
 *
 * @help py06pd_Unit.js
 */

var py06pd = py06pd || {};
py06pd.Unit = py06pd.Unit || {};

py06pd.Unit.vocabBuildCity = "Build City";
py06pd.Unit.vocabBuildRailroad = "Build Railroad";
py06pd.Unit.vocabBuildRoad = "Build Road";
py06pd.Unit.vocabClearForest = "Clear Forest";
py06pd.Unit.vocabClearJungle = "Clear Jungle";
py06pd.Unit.vocabDisband = "Disband";
py06pd.Unit.vocabDrainSwamp = "Drain Swamp";
py06pd.Unit.vocabForest = "Plant Forest";
py06pd.Unit.vocabFortify = "Fortify";
py06pd.Unit.vocabFortress = "Build Fortress";
py06pd.Unit.vocabIrrigate = "Irrigate";
py06pd.Unit.vocabMine = "Mine";
py06pd.Unit.vocabSentry = "Sentry";
py06pd.Unit.vocabWait = "Wait";

(function() {

//=============================================================================
// Scene_CivSetup
//=============================================================================

    py06pd.Unit.Scene_CivSetup_setupGame = Scene_CivSetup.prototype.setupGame;
    Scene_CivSetup.prototype.setupGame = function() {
        py06pd.Unit.Scene_CivSetup_setupGame.call(this);

        $gameMap.empire().addUnit("settler", $gamePlayer.x, $gamePlayer.y);
    };

//=============================================================================
// Scene_Map
//=============================================================================

    py06pd.Unit.Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        py06pd.Unit.Scene_Map_initialize.call(this);
        this._selectedUnit = null;
    };

    py06pd.Unit.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createCityEditWindow();
        this.createCityNameInputWindow();
        this.createUnitCommandWindow();
        py06pd.Unit.Scene_Map_createAllWindows.call(this);
    };

    py06pd.Unit.Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
    Scene_Map.prototype.isMenuEnabled = function() {
        return py06pd.Unit.Scene_Map_isMenuEnabled.call(this) && !this._selectedUnit;
    };

    py06pd.Unit.Scene_Map_isPlayerActive = Scene_Map.prototype.isPlayerActive;
    Scene_Map.prototype.isPlayerActive = function() {
        return py06pd.Unit.Scene_Map_isPlayerActive.call(this) && !this._selectedUnit;
    };

    py06pd.Unit.Scene_Map_updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function() {
        py06pd.Unit.Scene_Map_updateScene.call(this);

        if (this._selectedUnit && !this.isAnyInputWindowActive()) {
            this._selectedUnit.update(true);
            if (this._selectedUnit.moved() && !this._selectedUnit.isMoving()) {
                $gameMap.empires().forEach((emp, index) => {
                    if (index > 0) {
                        emp.units().forEach(unit => {
                            if (unit.x === this._selectedUnit.x && unit.y === this._selectedUnit.y) {
                                this.performAttack(this._selectedUnit, unit);
                            }
                        });
                    }
                });
                $gamePlayer.locate(this._selectedUnit.x, this._selectedUnit.y);
                this.clearUnit();
            }
        }
    };

    py06pd.Unit.Scene_Map_isAnyInputWindowActive = Scene_Map.prototype.isAnyInputWindowActive;
    Scene_Map.prototype.isAnyInputWindowActive = function() {
        return py06pd.Unit.Scene_Map_isAnyInputWindowActive.call(this) ||
            this._unitCommandWindow.active || this._unitCommandWindow.isClosing() ||
            this._cityNameInputWindow.active || this._cityNameInputWindow.isClosing();
    };

    py06pd.Unit.Scene_Map_processBack = Scene_Map.prototype.processBack;
    Scene_Map.prototype.processBack = function() {
        let consumed = py06pd.Unit.Scene_Map_processBack.call(this);
        if (!consumed && this._selectedUnit && !this._selectedUnit.isMoving()) {
            this.clearUnit();
            return true;
        }

        return consumed;
    };

    py06pd.Unit.Scene_Map_processOk = Scene_Map.prototype.processOk;
    Scene_Map.prototype.processOk = function(x, y) {
        let consumed = py06pd.Unit.Scene_Map_processOk.call(this, x, y);
        if (!consumed) {
            if (this._selectedUnit) {
                if (!this._selectedUnit.isMoving() && !this._selectedUnit.moved()) {
                    this._unitCommandWindow.setup(this._selectedUnit);
                }
            } else if (this.isPlayerActive()) {
                $gameMap.empire().units().forEach(unit => {
                    if (x === unit.x && $gamePlayer.y === unit.y) {
                        this._selectedUnit = unit;
                        $gamePlayer.setTransparent(true);
                        unit.setStepAnime(true);
                        consumed = true;
                    }
                });
            }
        }

        return consumed;
    };

//=============================================================================
// Window_TileInfo
//=============================================================================

    py06pd.Unit.Window_TileInfo_refresh = Window_TileInfo.prototype.refresh;
    Window_TileInfo.prototype.refresh = function() {
        py06pd.Unit.Window_TileInfo_refresh.call(this);
        const rect = this.baseTextRect();
        this.drawUnitInfo(rect.x, rect.y + this.lineHeight() * this._lines, rect.width);
    };

})(); // IIFE

//=============================================================================
// Scene_Map
//=============================================================================

Scene_Map.prototype.createCityEditWindow = function() {
    const rect = this.cityEditWindowRect();
    this._cityEditWindow = new Window_CityNameEdit(rect);
    this._cityEditWindow.close();
    this.addWindow(this._cityEditWindow);
};

Scene_Map.prototype.cityEditWindowRect = function() {
    const ww = 600;
    const wh = this.calcWindowHeight(1, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Map.prototype.createCityNameInputWindow = function() {
    const rect = this.cityNameInputWindowRect();
    this._cityNameInputWindow = new Window_NameInput(rect);
    this._cityNameInputWindow.setEditWindow(this._cityEditWindow);
    this._cityNameInputWindow.setHandler("ok", this.onCityNameInputOk.bind(this));
    this._cityNameInputWindow.close();
    this._cityNameInputWindow.deactivate();
    this.addWindow(this._cityNameInputWindow);
};

Scene_Map.prototype.cityNameInputWindowRect = function() {
    const wx = this._cityEditWindow.x;
    const wy = this._cityEditWindow.y + this._cityEditWindow.height + 8;
    const ww = this._cityEditWindow.width;
    const wh = this.calcWindowHeight(9, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Map.prototype.createUnitCommandWindow = function() {
    const rect = this.unitCommandWindowRect();
    const commandWindow = new Window_UnitCommand(rect);
    commandWindow.y = Graphics.boxHeight - commandWindow.height;
    commandWindow.setHandler("city", this.commandCity.bind(this));
    commandWindow.setHandler("irrigate", this.commandIrrigate.bind(this));
    commandWindow.setHandler("mine", this.commandMine.bind(this));
    commandWindow.setHandler("forest", this.commandForest.bind(this));
    commandWindow.setHandler("fortress", this.commandFortress.bind(this));
    commandWindow.setHandler("road", this.commandRoad.bind(this));
    commandWindow.setHandler("railroad", this.commandRailroad.bind(this));
    commandWindow.setHandler("clearForest", this.commandClearForest.bind(this));
    commandWindow.setHandler("clearJungle", this.commandClearJungle.bind(this));
    commandWindow.setHandler("drainSwamp", this.commandDrainSwamp.bind(this));
    commandWindow.setHandler("sentry", this.commandSentry.bind(this));
    commandWindow.setHandler("disband", this.commandDisband.bind(this));
    commandWindow.setHandler("fortify", this.commandFortify.bind(this));
    commandWindow.setHandler("wait", this.commandWait.bind(this));
    this.addWindow(commandWindow);
    this._unitCommandWindow = commandWindow;
};

Scene_Map.prototype.unitCommandWindowRect = function() {
    const ww = 192;
    const wh = this.calcWindowHeight(4, true);
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Map.prototype.clearUnit = function() {
    this._selectedUnit.setStepAnime(false);
    this._selectedUnit = null;
    $gamePlayer.setTransparent(false);
};

Scene_Map.prototype.commandCity = function() {
    if (py06pd.GenerateMap) {
        this._tileWindow.close();
    }
    if (py06pd.Technology) {
        this._learningTechnologyWindow.close();
    }
    if (py06pd.TurnCounter) {
        this._turnCountWindow.close();
    }
    this._unitCommandWindow.close();
    this._cityEditWindow.setup($gameMap.empire().nextCityName(), 12);
    this._cityNameInputWindow.open();
    this._cityNameInputWindow.activate();
};

Scene_Map.prototype.commandClearForest = function() {
    this._selectedUnit.setWorkType("clearForest");
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandClearJungle = function() {
    this._selectedUnit.setWorkType("clearJungle");
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandDisband = function() {
    this._selectedUnit.empire().removeUnit(this._selectedUnit);
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandDrainSwamp = function() {
    this._selectedUnit.setWorkType("drainSwamp");
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandForest = function() {
    this._selectedUnit.setWorkType("forest");
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandFortify = function() {
    this._selectedUnit.setFortified(true);
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandFortress = function() {
    this._selectedUnit.setWorkType("fortress");
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandIrrigate = function() {
    this._selectedUnit.setWorkType("irrigate");
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandMine = function() {
    this._selectedUnit.setWorkType("mine");
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandRailroad = function() {
    this._selectedUnit.setWorkType("railroad");
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandRoad = function() {
    this._selectedUnit.setWorkType("road");
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandSentry = function() {
    this._selectedUnit.setSentry(true);
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.commandWait = function() {
    this.clearUnit();
    this._unitCommandWindow.close();
};

Scene_Map.prototype.performAttack = function(attacker, defender) {
    let chances = attacker.empire().name() === "barbarian" && defender.city() ? 2 : 1;
    const attack1 = Math.randomInt(attacker.attack(defender));
    const defence1 = Math.randomInt(defender.defence(attacker));
    const attack2 = Math.randomInt(attacker.attack(defender));
    const defence2 = Math.randomInt(defender.defence(attacker));
    let victor;
    if (defence1 >= attack1 || (chances > 1 && defence2 > attack2)) {
        attacker.empire().removeUnit(attacker);
        victor = defender;
    } else {
        defender.empire().removeUnit(defender);
        victor = attacker;
    }

    if (!victor.veteran() && Math.randomInt(2) === 1) {
        victor.setVeteran(true);
    }
};

Scene_Map.prototype.onCityNameInputOk = function() {
    if (this._cityEditWindow.name().length > 3) {
        const empire = $gameMap.empire();
        empire.removeUnit(this._selectedUnit);
        empire.addCity(new Game_City(this._cityEditWindow.name(), empire.name(), this._selectedUnit.x, this._selectedUnit.y));
        this.clearUnit();
        this._cityEditWindow.close();
        this._cityNameInputWindow.close();
        this._cityNameInputWindow.deactivate();
        if (py06pd.GenerateMap) {
            this._tileWindow.open();
        }
        if (py06pd.Technology && $gameMap.empire().learningTechnology()) {
            this._learningTechnologyWindow.open();
        }
        if (py06pd.TurnCounter) {
            this._turnCountWindow.open();
        }
    }
};

//=============================================================================
// Window_CityNameEdit
//=============================================================================

function Window_CityNameEdit() {
    this.initialize(...arguments);
}

Window_CityNameEdit.prototype = Object.create(Window_NameEdit.prototype);
Window_CityNameEdit.prototype.constructor = Window_CityNameEdit;

Window_CityNameEdit.prototype.initialize = function(rect) {
    Window_NameEdit.prototype.initialize.call(this, rect);
};

Window_CityNameEdit.prototype.setup = function(name, maxLength) {
    this._maxLength = maxLength;
    this._name = name.slice(0, this._maxLength);
    this._index = this._name.length;
    this._defaultName = this._name;
    this.refresh();
    this.open();
};

Window_CityNameEdit.prototype.left = function() {
    const nameWidth = (this._maxLength + 1) * this.charWidth();
    return (this.innerWidth - nameWidth) / 2;
};

Window_CityNameEdit.prototype.itemRect = function(index) {
    const x = this.left() + index * this.charWidth();
    const y = 0;
    const width = this.charWidth();
    const height = this.lineHeight();
    return new Rectangle(x, y, width, height);
};

Window_CityNameEdit.prototype.drawActorFace = function() {
};

//=============================================================================
// Window_TileInfo
//=============================================================================

Window_TileInfo.prototype.drawUnitInfo = function(x, y, width) {
    $gameMap.empires().forEach(emp => {
        const found = emp.units().find(unit => unit.x === this._x && unit.y === this._y);
        if (found) {
            const label = found.unit().label + " (" + emp.empire().label + ")";
            this.drawText(label, x, y, width);
        }
    });
};

//=============================================================================
// Window_UnitCommand
//=============================================================================

function Window_UnitCommand() {
    this.initialize(...arguments);
}

Window_UnitCommand.prototype = Object.create(Window_Command.prototype);
Window_UnitCommand.prototype.constructor = Window_UnitCommand;

Window_UnitCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.openness = 0;
    this.deactivate();
    this._unit = null;
};

Window_UnitCommand.prototype.makeCommandList = function() {
    if (this._unit) {
        if (this._unit.canBuildCity()) {
            this.addBuildCityCommand();
        }
        if (this._unit.canClearForest()) {
            this.addClearForestCommand();
        }
        if (this._unit.canClearJungle()) {
            this.addClearJungleCommand();
        }
        if (this._unit.canDrainSwamp()) {
            this.addDrainSwampCommand();
        }
        if (this._unit.canIrrigate()) {
            this.addIrrigateCommand();
        }
        if (this._unit.canMine()) {
            this.addMineCommand();
        }
        if (this._unit.canBuildFortress()) {
            this.addFortressCommand();
        } else if (this._unit.unit().name !== "settler") {
            this.addFortifyCommand();
        }
        if (this._unit.canForest()) {
            this.addForestCommand();
        }
        if (this._unit.canBuildRoad()) {
            this.addBuildRoadCommand();
        }
        if (this._unit.canBuildRailroad()) {
            this.addBuildRailroadCommand();
        }
        this.addSentryCommand();
        this.addDisbandCommand();
        this.addWaitCommand();
    }
};

Window_UnitCommand.prototype.addBuildCityCommand = function() {
    this.addCommand(py06pd.Unit.vocabBuildCity, "city", true);
};

Window_UnitCommand.prototype.addBuildRailroadCommand = function() {
    this.addCommand(py06pd.Unit.vocabBuildRailroad, "railroad", true);
};

Window_UnitCommand.prototype.addBuildRoadCommand = function() {
    this.addCommand(py06pd.Unit.vocabBuildRoad, "road", true);
};

Window_UnitCommand.prototype.addClearForestCommand = function() {
    this.addCommand(py06pd.Unit.vocabClearForest, "clearForest", true);
};

Window_UnitCommand.prototype.addClearJungleCommand = function() {
    this.addCommand(py06pd.Unit.vocabClearJungle, "clearJungle", true);
};

Window_UnitCommand.prototype.addDisbandCommand = function() {
    this.addCommand(py06pd.Unit.vocabDisband, "disband", true);
};

Window_UnitCommand.prototype.addDrainSwampCommand = function() {
    this.addCommand(py06pd.Unit.vocabDrainSwamp, "drainSwamp", true);
};

Window_UnitCommand.prototype.addForestCommand = function() {
    this.addCommand(py06pd.Unit.vocabForest, "forest", true);
};

Window_UnitCommand.prototype.addFortifyCommand = function() {
    this.addCommand(py06pd.Unit.vocabFortify, "fortify", true);
};

Window_UnitCommand.prototype.addFortressCommand = function() {
    this.addCommand(py06pd.Unit.vocabFortress, "fortress", true);
};

Window_UnitCommand.prototype.addIrrigateCommand = function() {
    this.addCommand(py06pd.Unit.vocabIrrigate, "irrigate", true);
};

Window_UnitCommand.prototype.addMineCommand = function() {
    this.addCommand(py06pd.Unit.vocabMine, "mine", true);
};

Window_UnitCommand.prototype.addSentryCommand = function() {
    this.addCommand(py06pd.Unit.vocabSentry, "sentry", true);
};

Window_UnitCommand.prototype.addWaitCommand = function() {
    this.addCommand(py06pd.Unit.vocabWait, "wait", true);
};

Window_UnitCommand.prototype.setup = function(unit) {
    this._unit = unit;
    this.refresh();
    this.activate();
    this.open();
};

Window_UnitCommand.prototype.unit = function() {
    return this._unit;
};
