//=============================================================================
// RPG Maker MZ - Turn Counter
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Manager for turn actions.
 * @author Peter Dawson
 *
 * @help PDA_TurnCounter.js
 */

var PDA = PDA || {};
PDA.TurnCounter = PDA.TurnCounter || {};

(function() {

//=============================================================================
// Game_Map
//=============================================================================

    PDA.TurnCounter.Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        PDA.TurnCounter.Game_Map_initialize.call(this);
        this._turnCount = 0;
        // 0 = Chieftain, 1 = Warlord, 2 = King, 3 = Prince, 4 = Emperor
        this._difficulty = 0;
    };

//=============================================================================
// Scene_Map
//=============================================================================

    PDA.TurnCounter.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createTurnCountWindow();
        PDA.TurnCounter.Scene_Map_createAllWindows.call(this);
    };

    PDA.TurnCounter.Scene_Map_updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function() {
        PDA.TurnCounter.Scene_Map_updateScene.call(this);
        this.updateTurn();
    };

})(); // IIFE

Input.keyMapper = {
    ...Input.keyMapper,
    84: "endTurn"
};

//=============================================================================
// Game_Map
//=============================================================================

Game_Map.prototype.difficulty = function() {
    return this._difficulty;
};

Game_Map.prototype.setTurnCount = function(count) {
    this._turnCount = count;
};

Game_Map.prototype.turnCount = function() {
    return this._turnCount;
};

//=============================================================================
// Scene_Map
//=============================================================================

Scene_Map.prototype.createTurnCountWindow = function() {
    this._turnCountWindow = new Window_TurnCount(this.turnCountWindowRect());
    this.addWindow(this._turnCountWindow);
};

Scene_Map.prototype.turnCountWindowRect = function() {
    const wh = this.calcWindowHeight(1, false);
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(0, wy, 128, wh);
};

Scene_Map.prototype.updateTurn = function() {
    if (this._endTurn) {
        this._endTurn = false;
    }

    this._turnCountWindow.open();
    if ($gamePlayer.screenX() > Graphics.boxWidth / 2) {
        this._turnCountWindow.x = 0;
    } else {
        this._turnCountWindow.x = Graphics.boxWidth - this._turnCountWindow.width;
    }

    if (Input.isTriggered("endTurn")) {
        $gameMap.setTurnCount($gameMap.turnCount() + 1);
        const end = [650, 630, 610, 570, 570];
        if ($gameMap.turnCount() === end[$gameMap.difficulty()]) {
            SceneManager.goto(Scene_Gameover);
        }

        this._endTurn = true;
    }
};

//=============================================================================
// Window_TurnCount
//=============================================================================

function Window_TurnCount() {
    this.initialize(...arguments);
}

Window_TurnCount.prototype = Object.create(Window_Selectable.prototype);
Window_TurnCount.prototype.constructor = Window_TurnCount;

Window_TurnCount.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_TurnCount.prototype.colSpacing = function() {
    return 0;
};

Window_TurnCount.prototype.maxItems = function() {
    return 1;
};

Window_TurnCount.prototype.itemHeight = function() {
    return Math.floor(this.innerHeight / this.maxItems());
};

Window_TurnCount.prototype.refresh = function() {
    const rect = this.itemLineRect(0);
    this.contents.clear();
    this.resetFontSettings();
    this.contents.fontSize -= 6;

    let year = -4000;
    let index = 0;
    const turnCount = $gameMap.turnCount();
    while (index < turnCount) {
        if (index < 250) {
            year += 20;
        } else if (index < 300) {
            year += 10;
        } else if (index < 350) {
            year += 5;
        } else if (index < 400) { // && noSpaceships) {
            year += 2;
        } else {
            year += 1;
        }
        index++;
    }

    this.drawText(Math.abs(year) + (year >= 0 ? ' AD' : ' BC'), rect.x, rect.y, rect.width, "center");
};

Window_TurnCount.prototype.open = function() {
    this.refresh();
    Window_Selectable.prototype.open.call(this);
};
