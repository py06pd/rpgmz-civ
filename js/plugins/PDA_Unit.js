//=============================================================================
// RPG Maker MZ - Units
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Units.
 * @author Peter Dawson
 *
 * @help PDA_Unit.js
 */

var PDA = PDA || {};
PDA.Unit = PDA.Unit || {};

PDA.Unit.Units = [
    { name: "settler", label: "Settler", requires: "", characterIndex: 5, characterName: "Vehicle", attack: 0, defence: 1, move: 1, production: 40, price: 320, buildRoads: true, buildMines: true, buildIrrigation: true, buildFortresses: true, cleanPollution: true, foundCity: true, populationCost: 1 },
    { name: "militia", label: "Militia", requires: "", characterIndex: 2, characterName: "People1", attack: 1, defence: 1, move: 1, production: 10, price: 50, obsolete: "gunpowder" },
    { name: "cavalry", label: "Cavalry", requires: "horseback", characterIndex: 2, characterName: "People4", attack: 2, defence: 1, move: 2, production: 20, price: 120, obsolete: "conscription" },
    { name: "legion", label: "Legion", requires: "iron", characterIndex: 6, characterName: "People4", attack: 3, defence: 1, move: 3, production: 20, price: 120, obsolete: "conscription" },
    { name: "phalanx", label: "Phalanx", requires: "bronze", characterIndex: 4, characterName: "People1", attack: 1, defence: 2, move: 1, production: 20, price: 120, obsolete: "gunpowder" },
    { name: "diplomat", label: "Diplomat", requires: "writing", characterIndex: 5, characterName: "People3", attack: 0, defence: 0, move: 2, production: 30, price: 210, ignoreAdjacent: true },
    { name: "musketeer", label: "Musketeer", requires: "gunpowder", characterIndex: 4, characterName: "Actor2", attack: 2, defence: 3, move: 1, production: 30, price: 210, obsolete: "conscription" },
    { name: "rifleman", label: "Rifleman", requires: "conscription", characterIndex: 4, characterName: "Actor1", attack: 3, defence: 5, move: 1, production: 30, price: 210 },
    { name: "cannon", label: "Cannon", requires: "metallurgy", characterIndex: 2, characterName: "Actor1", attack: 8, defence: 1, move: 1, production: 40, price: 320, obsolete: "robotics" },
    { name: "catapult", label: "Catapult", requires: "mathematics", characterIndex: 6, characterName: "Actor1", attack: 6, defence: 1, move: 1, production: 40, price: 320, obsolete: "metallurgy" },
    { name: "chariot", label: "Chariot", requires: "wheel", characterIndex: 4, characterName: "Vehicle", attack: 4, defence: 1, move: 2, production: 40, price: 320, obsolete: "chivalry" },
    { name: "knight", label: "Knight", requires: "chivalry", characterIndex: 6, characterName: "Actor3", attack: 4, defence: 2, move: 2, production: 40, price: 320, obsolete: "automobile" },
    { name: "caravan", label: "Caravan", requires: "trade", characterIndex: 4, characterName: "People4", attack: 0, defence: 1, move: 1, production: 50, price: 450, ignoreAdjacent: true, tradeRoutes: true },
    { name: "mech", label: "Mech. Infantry", requires: "unions", characterIndex: 0, characterName: "SF_Vehicle", attack: 6, defence: 6, move: 3, production: 50, price: 450 },
    { name: "artillery", label: "Artillery", requires: "robotics", characterIndex: 3, characterName: "SF_Vehicle", attack: 12, defence: 2, move: 2, production: 60, price: 600, ignoreWalls: true },
    { name: "armour", label: "Armour", requires: "automobile", characterIndex: 6, characterName: "SF_Vehicle", attack: 10, defence: 5, move: 3, production: 80, price: 960 },
    { name: "trireme", label: "Trireme", requires: "maps", characterIndex: 0, characterName: "Vehicle", attack: 1, defence: 0, move: 3, production: 40, price: 320, cargo: 2 },
    { name: "sail", label: "Sail", requires: "navigation", characterIndex: 7, characterName: "Vehicle", attack: 1, defence: 1, move: 3, production: 40, price: 320, cargo: 3 },
    { name: "frigate", label: "Frigate", requires: "magnetism", characterIndex: 1, characterName: "Vehicle", attack: 2, defence: 2, move: 3, production: 40, price: 320, cargo: 4 },
    { name: "transport", label: "Transport", requires: "industry", characterIndex: 7, characterName: "SF_Vehicle", attack: 0, defence: 3, move: 4, production: 50, price: 450, cargo: 8 },
    { name: "submarine", label: "Submarine", requires: "mass", characterIndex: 3, characterName: "Vehicle", attack: 8, defence: 2, move: 3, production: 50, price: 450, sight: 2, cannotAttackLand: true, invisibleOnLand: true, onlyVisibleAdjacent: true },
    { name: "ironclad", label: "Ironclad", requires: "steam", characterIndex: 7, characterName: "SF_Vehicle", attack: 4, defence: 4, move: 4, production: 60, price: 600, obsolete: "combustion" },
    { name: "cruiser", label: "Cruiser", requires: "combustion", characterIndex: 3, characterName: "Vehicle", attack: 6, defence: 6, move: 6, production: 80, price: 960, sight: 2 },
    { name: "carrier", label: "Carrier", requires: "advanced", characterIndex: 3, characterName: "Vehicle", attack: 1, defence: 12, move: 5, production: 160, price: 3200, sight: 2, airCargo: 8 },
    { name: "battleship", label: "Battleship", requires: "steel", characterIndex: 3, characterName: "Vehicle", attack: 18, defence: 12, move: 4, production: 160, price: 3200, sight: 2 },
    { name: "fighter", label: "Fighter", requires: "flight", characterIndex: 2, characterName: "SF_Vehicle", attack: 4, defence: 2, move: 10, production: 60, price: 600 },
    { name: "bomber", label: "Bomber", requires: "advanced", characterIndex: 2, characterName: "SF_Vehicle", attack: 12, defence: 1, move: 8, production: 120, price: 1920, ignoreWalls: true, sight: 2, attackEndsTurn: true },
    { name: "nuclear", label: "Nuclear", requires: "rocketry", characterIndex: 2, characterName: "SF_Vehicle", attack: 99, defence: 0, move: 16, production: 160, price: 3200, invisibleUntilAttack: true, ignoreZoneControl: true, causeLandPollution: true, wonder: "manhattan" }
];

(function() {

//=============================================================================
// Game_Map
//=============================================================================

    PDA.Unit.Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        PDA.Unit.Game_Map_initialize.call(this);
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
// Scene_Map
//=============================================================================

    PDA.Unit.Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        PDA.Unit.Scene_Map_initialize.call(this);
        this._selectedUnit = null;
    };

    PDA.Unit.Scene_Map_launchGame = Scene_Map.prototype.launchGame;
    Scene_Map.prototype.launchGame = function() {
        PDA.Unit.Scene_Map_launchGame.call(this);

        const unit = $gameMap.addUnit("settler");
        unit.locate($gamePlayer.x, $gamePlayer.y);
    };

    PDA.Unit.Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
    Scene_Map.prototype.isMenuEnabled = function() {
        return PDA.Unit.Scene_Map_isMenuEnabled.call(this) && !this._selectedUnit;
    };

    PDA.Unit.Scene_Map_isPlayerActive = Scene_Map.prototype.isPlayerActive;
    Scene_Map.prototype.isPlayerActive = function() {
        return PDA.Unit.Scene_Map_isPlayerActive.call(this) && !this._selectedUnit;
    };

    PDA.Unit.Scene_Map_updateTurn = Scene_Map.prototype.updateTurn;
    Scene_Map.prototype.updateTurn = function() {
        PDA.Unit.Scene_Map_updateTurn.call(this);

        $gameMap.units().forEach(unit => {
            if (!unit.hasSprite()) {
                this._spriteset.addUnit(unit);
                unit.setHasSprite(true);
            }

            if (Input.isRepeated("ok") && !this._selectedUnit && $gamePlayer.x === unit.x && $gamePlayer.y === unit.y) {
                this._selectedUnit = unit;
                $gamePlayer.setTransparent(true);
                unit.setStepAnime(true);
            }

            if (this._selectedUnit && this.isMenuCalled()) {
                this.clearUnit();
            }
        });

        if (this._selectedUnit) {
            this._selectedUnit.update(true);
            if (this._selectedUnit.moved() && !this._selectedUnit.isMoving()) {
                this.clearUnit();
            }
        }

        if (this._endTurn) {
            $gameMap.units().forEach(unit => {
                unit.setMoved(false);
            });
        }
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
// Spriteset_Map
//=============================================================================

    PDA.Unit.Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        PDA.Unit.Spriteset_Map_createCharacters.call(this);
        $gameMap.units().forEach(unit => {
            this.addUnit(unit);
        });
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

Game_CivUnit.prototype.initialize = function(name) {
    Game_CharacterBase.prototype.initialize.call(this);
    this._hasSprite = false;
    this._name = name;
    this._moved = false;
    const unit = this.unit();
    this.setImage(unit.characterName, unit.characterIndex);
};

Game_CivUnit.prototype.unit = function() {
    return PDA.Unit.Units.find(unit => unit.name === this._name);
};

Game_CivUnit.prototype.hasSprite = function() {
    return this._hasSprite;
};

Game_CivUnit.prototype.setHasSprite = function(hasSprite) {
    this._hasSprite = hasSprite;
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

//=============================================================================
// Game_Map
//=============================================================================

Game_Map.prototype.addUnit = function(name) {
    const unit = new Game_CivUnit(name);
    this._units.push(unit);
    return unit;
};

Game_Map.prototype.units = function() {
    return this._units;
};

//=============================================================================
// Scene_Map
//=============================================================================

Scene_Map.prototype.clearUnit = function() {
    this._selectedUnit.setStepAnime(false);
    this._selectedUnit = null;
    $gamePlayer.setTransparent(false);
};

//=============================================================================
// Spriteset_Map
//=============================================================================

Spriteset_Map.prototype.addUnit = function(unit) {
    const sprite = new Sprite_Character(unit);
    this._characterSprites.push(sprite);
    this._tilemap.addChild(sprite);
};
