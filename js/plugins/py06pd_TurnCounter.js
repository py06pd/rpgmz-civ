//=============================================================================
// RPG Maker MZ - Turn Counter
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Manager for turn actions.
 * @author Peter Dawson
 *
 * @help py06pd_TurnCounter.js
 */

var py06pd = py06pd || {};
py06pd.TurnCounter = py06pd.TurnCounter || {};
py06pd.TurnCounter.goldIcon = 313;

(function() {

//=============================================================================
// Scene_Map
//=============================================================================

    py06pd.TurnCounter.Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function() {
        py06pd.TurnCounter.Scene_Map_createSpriteset.call(this);
        $gameMap.setRefreshSpriteObjects(true);
    };

    py06pd.TurnCounter.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createTurnCountWindow();
        py06pd.TurnCounter.Scene_Map_createAllWindows.call(this);
    };

    py06pd.TurnCounter.Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
    Scene_Map.prototype.isMenuEnabled = function() {
        return py06pd.TurnCounter.Scene_Map_isMenuEnabled.call(this) && !this.isAnyInputWindowActive();
    };

    py06pd.TurnCounter.Scene_Map_isPlayerActive = Scene_Map.prototype.isPlayerActive;
    Scene_Map.prototype.isPlayerActive = function() {
        return py06pd.TurnCounter.Scene_Map_isPlayerActive.call(this) && !this.isAnyInputWindowActive();
    };

    py06pd.TurnCounter.Scene_Map_updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function() {
        py06pd.TurnCounter.Scene_Map_updateScene.call(this);

        if (!this.isAnyInputWindowActive()) {
            if ($gamePlayer.screenX() > Graphics.boxWidth / 2) {
                this._turnCountWindow.x = 0;
            } else {
                this._turnCountWindow.x = Graphics.boxWidth - this._turnCountWindow.width;
            }

            if (Input.isRepeated("ok")) {
                this.processOk($gamePlayer.x, $gamePlayer.y);
            }

            if (Input.isRepeated("cancel")) {
                this.processBack();
            }

            if (Input.isTriggered("endTurn") && this.isPlayerActive()) {
                this.endTurn();
            }
        }
    };

//=============================================================================
// Spriteset_Map
//=============================================================================

    py06pd.TurnCounter.Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
    Spriteset_Map.prototype.initialize = function() {
        py06pd.TurnCounter.Spriteset_Map_initialize.call(this);
        this._civSprites = [];
    };

    py06pd.TurnCounter.Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        py06pd.TurnCounter.Spriteset_Map_update.call(this);
        this.updateCivSprites();
    };

})(); // IIFE

Input.keyMapper = {
    ...Input.keyMapper,
    84: "endTurn"
};

//=============================================================================
// Scene_Map
//=============================================================================

Scene_Map.prototype.createTurnCountWindow = function() {
    this._turnCountWindow = new Window_TurnCount(this.turnCountWindowRect());
    this.addWindow(this._turnCountWindow);
};

Scene_Map.prototype.endTurn = function() {
    $gameMap.setTurnCount($gameMap.turnCount() + 1);
    this._turnCountWindow.refresh();
    const end = [650, 630, 610, 570, 570];
    if ($gameMap.turnCount() === end[$gameMap.difficulty()]) {
        SceneManager.goto(Scene_Gameover);
    }

    $gameMap.empires().forEach(emp => emp.endTurn());

    // trigger disaster
    const cities = $gameMap.empires().reduce((prev, curr) => prev.concat(curr.cities()), []);
    for (let i = 0; i < 2; i++) {
        const rand = Math.randomInt(128);
        if (cities[rand] && cities[rand].population() >= 5 && cities[rand].empire().cities().length > 1) {
            cities[rand].triggerDisaster();
        }
    }
};

Scene_Map.prototype.isAnyInputWindowActive = function() {
    return false;
};

Scene_Map.prototype.processBack = function() {
    return false;
};

Scene_Map.prototype.processOk = function(x, y) {
    return false;
};

Scene_Map.prototype.turnCountWindowRect = function() {
    const wh = this.calcWindowHeight(2, false);
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(0, wy, 170, wh);
};

//=============================================================================
// updateCivSprites
//=============================================================================

Spriteset_Map.prototype.updateCivSprites = function() {
    if ($gameMap.refreshSpriteObjects()) {
        for (const sprite of this._civSprites) {
            this._tilemap.removeChild(sprite);
            sprite.destroy();
        }
        this._civSprites = [];
        $gameMap.civSprites().forEach(sprite => {
            this._civSprites.push(sprite);
            this._tilemap.addChild(sprite);
        });
        $gameMap.setRefreshSpriteObjects(false);
    }
};

//=============================================================================
// Window_TurnCount
//=============================================================================

function Window_TurnCount() {
    this.initialize(...arguments);
}

Window_TurnCount.prototype = Object.create(Window_Base.prototype);
Window_TurnCount.prototype.constructor = Window_TurnCount;

Window_TurnCount.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._turnCount = -1;
};

Window_TurnCount.prototype.drawYear = function() {
    const rect = this.baseTextRect();

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

    this.drawText(Math.abs(year) + (year >= 0 ? ' AD' : ' BC'), rect.x, rect.y, rect.width);
};

Window_TurnCount.prototype.drawRates = function() {
    const rect = this.baseTextRect();
    const empire = $gameMap.empire();
    this.drawText((empire.taxRate() / 10) + "." + (empire.scienceRate() / 10) + "." + (empire.luxuryRate() / 10), rect.x, rect.y, rect.width, "right");
};

Window_TurnCount.prototype.drawGold = function() {
    const rect = this.baseTextRect();
    const y = rect.y + this.lineHeight();
    const empire = $gameMap.empire();
    this.drawIcon(py06pd.TurnCounter.goldIcon, rect.x, y)
    const offset = ImageManager.iconWidth + 6;
    this.drawText(empire.gold(), rect.x + offset, y + (ImageManager.iconHeight - this.lineHeight()) / 2, rect.width - offset);
};

Window_TurnCount.prototype.refresh = function() {
    this.contents.clear();
    this.resetFontSettings();
    this.contents.fontSize -= 6;
    this.drawYear();
    this.drawRates();
    this.drawGold();
};

Window_TurnCount.prototype.update = function() {
    if (this._turnCount !== $gameMap.turnCount()) {
        this._turnCount = $gameMap.turnCount();
        this.refresh();
    }
};
