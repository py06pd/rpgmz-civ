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
 * @help PDA_Unit.js
 */

var PDA = PDA || {};
PDA.Unit = PDA.Unit || {};

PDA.Unit.vocabBuildCity = "Build City";
PDA.Unit.vocabWait = "Wait";

PDA.Unit.Units = [
    { name: "settler", label: "Settler", requires: "", characterIndex: 5, characterName: "Vehicle", attack: 0, defence: 1, move: 1, construct: 40, price: 320, buildRoads: true, buildMines: true, buildIrrigation: true, buildFortresses: true, cleanPollution: true, buildCity: true, populationCost: 1 },
    { name: "militia", label: "Militia", requires: "", characterIndex: 2, characterName: "People1", attack: 1, defence: 1, move: 1, construct: 10, price: 50, obsolete: "gunpowder" },
    { name: "cavalry", label: "Cavalry", requires: "horseback", characterIndex: 2, characterName: "People4", attack: 2, defence: 1, move: 2, construct: 20, price: 120, obsolete: "conscription" },
    { name: "legion", label: "Legion", requires: "iron", characterIndex: 6, characterName: "People4", attack: 3, defence: 1, move: 3, construct: 20, price: 120, obsolete: "conscription" },
    { name: "phalanx", label: "Phalanx", requires: "bronze", characterIndex: 4, characterName: "People1", attack: 1, defence: 2, move: 1, construct: 20, price: 120, obsolete: "gunpowder" },
    { name: "diplomat", label: "Diplomat", requires: "writing", characterIndex: 5, characterName: "People3", attack: 0, defence: 0, move: 2, construct: 30, price: 210, ignoreAdjacent: true },
    { name: "musketeer", label: "Musketeer", requires: "gunpowder", characterIndex: 4, characterName: "Actor2", attack: 2, defence: 3, move: 1, construct: 30, price: 210, obsolete: "conscription" },
    { name: "rifleman", label: "Rifleman", requires: "conscription", characterIndex: 4, characterName: "Actor1", attack: 3, defence: 5, move: 1, construct: 30, price: 210 },
    { name: "cannon", label: "Cannon", requires: "metallurgy", characterIndex: 2, characterName: "Actor1", attack: 8, defence: 1, move: 1, construct: 40, price: 320, obsolete: "robotics" },
    { name: "catapult", label: "Catapult", requires: "mathematics", characterIndex: 6, characterName: "Actor1", attack: 6, defence: 1, move: 1, construct: 40, price: 320, obsolete: "metallurgy" },
    { name: "chariot", label: "Chariot", requires: "wheel", characterIndex: 4, characterName: "Vehicle", attack: 4, defence: 1, move: 2, construct: 40, price: 320, obsolete: "chivalry" },
    { name: "knight", label: "Knight", requires: "chivalry", characterIndex: 6, characterName: "Actor3", attack: 4, defence: 2, move: 2, construct: 40, price: 320, obsolete: "automobile" },
    { name: "caravan", label: "Caravan", requires: "trade", characterIndex: 4, characterName: "People4", attack: 0, defence: 1, move: 1, construct: 50, price: 450, ignoreAdjacent: true, tradeRoutes: true },
    { name: "mech", label: "Mech. Infantry", requires: "unions", characterIndex: 0, characterName: "SF_Vehicle", attack: 6, defence: 6, move: 3, construct: 50, price: 450 },
    { name: "artillery", label: "Artillery", requires: "robotics", characterIndex: 3, characterName: "SF_Vehicle", attack: 12, defence: 2, move: 2, construct: 60, price: 600, ignoreWalls: true },
    { name: "armour", label: "Armour", requires: "automobile", characterIndex: 6, characterName: "SF_Vehicle", attack: 10, defence: 5, move: 3, construct: 80, price: 960 },
    { name: "trireme", label: "Trireme", requires: "maps", characterIndex: 0, characterName: "Vehicle", attack: 1, defence: 0, move: 3, construct: 40, price: 320, sea: true, cargo: 2 },
    { name: "sail", label: "Sail", requires: "navigation", characterIndex: 7, characterName: "Vehicle", attack: 1, defence: 1, move: 3, construct: 40, price: 320, sea: true, cargo: 3 },
    { name: "frigate", label: "Frigate", requires: "magnetism", characterIndex: 1, characterName: "Vehicle", attack: 2, defence: 2, move: 3, construct: 40, price: 320, sea: true, cargo: 4 },
    { name: "transport", label: "Transport", requires: "industry", characterIndex: 7, characterName: "SF_Vehicle", attack: 0, defence: 3, move: 4, construct: 50, price: 450, sea: true, cargo: 8 },
    { name: "submarine", label: "Submarine", requires: "mass", characterIndex: 3, characterName: "Vehicle", attack: 8, defence: 2, move: 3, construct: 50, price: 450, sea: true, sight: 2, cannotAttackLand: true, invisibleOnLand: true, onlyVisibleAdjacent: true },
    { name: "ironclad", label: "Ironclad", requires: "steam", characterIndex: 7, characterName: "SF_Vehicle", attack: 4, defence: 4, move: 4, construct: 60, price: 600, sea: true, obsolete: "combustion" },
    { name: "cruiser", label: "Cruiser", requires: "combustion", characterIndex: 3, characterName: "Vehicle", attack: 6, defence: 6, move: 6, construct: 80, price: 960, sea: true, sight: 2 },
    { name: "carrier", label: "Carrier", requires: "advanced", characterIndex: 3, characterName: "Vehicle", attack: 1, defence: 12, move: 5, construct: 160, price: 3200, sea: true, sight: 2, airCargo: 8 },
    { name: "battleship", label: "Battleship", requires: "steel", characterIndex: 3, characterName: "Vehicle", attack: 18, defence: 12, move: 4, construct: 160, price: 3200, sea: true, sight: 2 },
    { name: "fighter", label: "Fighter", requires: "flight", characterIndex: 2, characterName: "SF_Vehicle", attack: 4, defence: 2, move: 10, construct: 60, price: 600, air: true },
    { name: "bomber", label: "Bomber", requires: "advanced", characterIndex: 2, characterName: "SF_Vehicle", attack: 12, defence: 1, move: 8, construct: 120, price: 1920, air: true, ignoreWalls: true, sight: 2, attackEndsTurn: true },
    { name: "nuclear", label: "Nuclear", requires: "rocketry", characterIndex: 2, characterName: "SF_Vehicle", attack: 99, defence: 0, move: 16, construct: 160, price: 3200, air: true, invisibleUntilAttack: true, ignoreZoneControl: true, causeLandPollution: true, wonder: "manhattan" }
];

(function() {

//=============================================================================
// Game_Map
//=============================================================================

    PDA.Unit.Game_Map_civSprites = Game_Map.prototype.civSprites;
    Game_Map.prototype.civSprites = function() {
        return PDA.Unit.Game_Map_civSprites.call(this)
            .concat(this._empires.reduce((all, emp) => all.concat(emp.units()
                .map(unit => new Sprite_Character(unit))), []));
    };

//=============================================================================
// Game_Empire
//=============================================================================

    PDA.Unit.Game_Empire_initialize = Game_Empire.prototype.initialize;
    Game_Empire.prototype.initialize = function(name) {
        PDA.Unit.Game_Empire_initialize.call(this, name);
        this._units = [];
    };

//=============================================================================
// Game_Player
//=============================================================================

    Game_Player.prototype.characterName = function() {
        return "cursor";
    };

    Game_Player.prototype.isObjectCharacter = function() {
        return true;
    };

//=============================================================================
// Scene_CivSetup
//=============================================================================

    PDA.Unit.Scene_CivSetup_setupGame = Scene_CivSetup.prototype.setupGame;
    Scene_CivSetup.prototype.setupGame = function() {
        PDA.Unit.Scene_CivSetup_setupGame.call(this);

        $gameMap.empire().addUnit("settler", $gamePlayer.x, $gamePlayer.y);
    };

//=============================================================================
// Scene_Map
//=============================================================================

    PDA.Unit.Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        PDA.Unit.Scene_Map_initialize.call(this);
        this._selectedUnit = null;
    };

    PDA.Unit.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createUnitCommandWindow();
        PDA.Unit.Scene_Map_createAllWindows.call(this);
    };

    PDA.Unit.Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
    Scene_Map.prototype.isMenuEnabled = function() {
        return PDA.Unit.Scene_Map_isMenuEnabled.call(this) && !this._selectedUnit;
    };

    PDA.Unit.Scene_Map_isPlayerActive = Scene_Map.prototype.isPlayerActive;
    Scene_Map.prototype.isPlayerActive = function() {
        return PDA.Unit.Scene_Map_isPlayerActive.call(this) && !this._selectedUnit;
    };

    PDA.Unit.Scene_Map_updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function() {
        PDA.Unit.Scene_Map_updateScene.call(this);

        if (this._selectedUnit && !this._unitCommandWindow.active) {
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

    PDA.Unit.Scene_Map_endTurn = Scene_Map.prototype.endTurn;
    Scene_Map.prototype.endTurn = function() {
        PDA.Unit.Scene_Map_endTurn.call(this);

        $gameMap.empire().units().forEach(unit => {
            unit.setMoved(false);
        });
    };

    PDA.Unit.Scene_Map_processBack = Scene_Map.prototype.processBack;
    Scene_Map.prototype.processBack = function() {
        let consumed = PDA.Unit.Scene_Map_processBack.call(this);
        if (!consumed && this._selectedUnit && !this._selectedUnit.isMoving()) {
            this.clearUnit();
            return true;
        }

        return consumed;
    };

    PDA.Unit.Scene_Map_processOk = Scene_Map.prototype.processOk;
    Scene_Map.prototype.processOk = function(x, y) {
        let consumed = PDA.Unit.Scene_Map_processOk.call(this, x, y);
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
// Sprite_Character
//=============================================================================

    PDA.Unit.Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
    Sprite_Character.prototype.setCharacterBitmap = function() {
        if (this._characterName === "cursor") {
            this.bitmap = ImageManager.loadSystem("cursor");
        } else {
            PDA.Unit.Sprite_Character_setCharacterBitmap.call(this);
        }
    };

    PDA.Unit.Sprite_Character_updateCharacterFrame = Sprite_Character.prototype.updateCharacterFrame;
    Sprite_Character.prototype.updateCharacterFrame = function() {
        if (this._characterName === "cursor") {
            this.setFrame(0, 0, $gameMap.tileWidth(), $gameMap.tileHeight());
        } else {
            PDA.Unit.Sprite_Character_updateCharacterFrame.call(this);
        }
    };

//=============================================================================
// Window_TileInfo
//=============================================================================

    PDA.Unit.Window_TileInfo_refresh = Window_TileInfo.prototype.refresh;
    Window_TileInfo.prototype.refresh = function() {
        PDA.Unit.Window_TileInfo_refresh.call(this);
        const rect = this.baseTextRect();
        this.drawUnitInfo(rect.x, rect.y + this.lineHeight() * this._lines, rect.width);
    };

})(); // IIFE

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

        if (PDA.CityBuilder && target.city()) {
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
        PDA.CityBuilder && !attacker.unit().ignoreWalls && !unit.air && this.city() &&
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
    return PDA.Unit.Units.find(unit => unit.name === this._name);
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
// Scene_Map
//=============================================================================

Scene_Map.prototype.createUnitCommandWindow = function() {
    const rect = this.unitCommandWindowRect();
    const commandWindow = new Window_UnitCommand(rect);
    commandWindow.y = Graphics.boxHeight - commandWindow.height;
    commandWindow.setHandler("buildCity", this.commandBuildCity.bind(this));
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

Scene_Map.prototype.commandBuildCity = function() {
    $gameMap.empire().removeUnit(this._selectedUnit);
    if (PDA.Setup && PDA.CityBuilder) {
        const next = $gameMap.empire().nextCityName();
        $gameMap.empire().addCity(new Game_City(next, this._selectedUnit.x, this._selectedUnit.y));
    }
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
        this.addWaitCommands();
    }
};

Window_UnitCommand.prototype.addBuildCityCommand = function() {
    this.addCommand(PDA.Unit.vocabBuildCity, "buildCity", true);
};

Window_UnitCommand.prototype.addWaitCommands = function() {
    this.addCommand(PDA.Unit.vocabWait, "wait", true);
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
