//=============================================================================
// RPG Maker MZ - Technology
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Learn technologies.
 * @author Peter Dawson
 *
 * @help py06pd_Technology.js
 */

var py06pd = py06pd || {};
py06pd.Technology = py06pd.Technology || {};

(function() {

//=============================================================================
// Scene_Map
//=============================================================================

    py06pd.Technology.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createLearningTechnologyWindow();
        this.createSelectTechnologyWindow();
        py06pd.Technology.Scene_Map_createAllWindows.call(this);
    };

    py06pd.Technology.Scene_Map_updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function() {
        py06pd.Technology.Scene_Map_updateScene.call(this);
        if (
            !$gameMap.empire().learningTechnology() && $gameMap.empire().scienceYield() > 0 &&
            !this.isAnyInputWindowActive()
        ) {
            this._selectTechnologyWindow.open();
        }
    };

    py06pd.Technology.Scene_Map_isAnyInputWindowActive = Scene_Map.prototype.isAnyInputWindowActive;
    Scene_Map.prototype.isAnyInputWindowActive = function() {
        return py06pd.Technology.Scene_Map_isAnyInputWindowActive.call(this) || this._selectTechnologyWindow.active ||
            this._selectTechnologyWindow.isClosing();
    };

    py06pd.Technology.Window_MapName_update = Window_MapName.prototype.update;
    Window_MapName.prototype.update = function() {
        this.hide();
    };

})(); // IIFE

//=============================================================================
// Scene_Map
//=============================================================================

Scene_Map.prototype.createLearningTechnologyWindow = function() {
    this._learningTechnologyWindow = new Window_LearningTechnology(this.learningTechnologyWindowRect());
    this._learningTechnologyWindow.close();
    this.addWindow(this._learningTechnologyWindow);
};

Scene_Map.prototype.learningTechnologyWindowRect = function() {
    const ww = 170;
    const wh = this.calcWindowHeight(2, false);
    return new Rectangle(0, 0, ww, wh);
};

Scene_Map.prototype.createSelectTechnologyWindow = function() {
    this._selectTechnologyWindow = new Window_SelectTechnology(this.selectTechnologyWindowRect());
    this._selectTechnologyWindow.setHandler("ok", this.onTechnologyOk.bind(this));
    this._selectTechnologyWindow.close();
    this.addWindow(this._selectTechnologyWindow);
};

Scene_Map.prototype.selectTechnologyWindowRect = function() {
    const ww = 240;
    const wh = this.calcWindowHeight(6, true);
    const x = (Graphics.boxWidth - ww) / 2;
    const y = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(x, y, ww, wh);
};

Scene_Map.prototype.onTechnologyOk = function() {
    $gameMap.empire().setLearningTechnology(this._selectTechnologyWindow.item().name);
    this._selectTechnologyWindow.close();
    this._learningTechnologyWindow.open();
};

//=============================================================================
// Window_LearningTechnology
//=============================================================================

function Window_LearningTechnology() {
    this.initialize(...arguments);
}

Window_LearningTechnology.prototype = Object.create(Window_Selectable.prototype);
Window_LearningTechnology.prototype.constructor = Window_LearningTechnology;

Window_LearningTechnology.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_LearningTechnology.prototype.colSpacing = function() {
    return 0;
};

Window_LearningTechnology.prototype.maxItems = function() {
    return 2;
};

Window_LearningTechnology.prototype.itemHeight = function() {
    return Math.floor(this.innerHeight / this.maxItems());
};

Window_LearningTechnology.prototype.refresh = function() {
    let rect = this.itemLineRect(0);
    this.contents.clear();
    this.resetFontSettings();
    this.contents.fontSize -= 6;
    const tech = $gameMap.empire().learningTechnology();
    if (tech) {
        this.drawText(tech.label, rect.x, rect.y, rect.width);

        rect = this.itemLineRect(1);

        const progress = $gameMap.empire().science() + "/" + $gameMap.empire().scienceCost();
        this.drawText(progress, rect.x, rect.y, rect.width);
    }
};

Window_LearningTechnology.prototype.open = function() {
    this.refresh();
    Window_Selectable.prototype.open.call(this);
};

//=============================================================================
// Window_SelectTechnology
//=============================================================================

function Window_SelectTechnology() {
    this.initialize(...arguments);
}

Window_SelectTechnology.prototype = Object.create(Window_Selectable.prototype);
Window_SelectTechnology.prototype.constructor = Window_SelectTechnology;

Window_SelectTechnology.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._data = [];
};

Window_SelectTechnology.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_SelectTechnology.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_SelectTechnology.prototype.itemAt = function(index) {
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_SelectTechnology.prototype.makeItemList = function() {
    this._data = $gameMap.empire().learnableTechnologies();
};

Window_SelectTechnology.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawText(item.label, rect.x, rect.y, rect.width);
    }
};

Window_SelectTechnology.prototype.open = function() {
    this.makeItemList();
    const height = this.fittingHeight(this.maxItems());
    const y = (Graphics.boxHeight - height) / 2;
    this.move(this.x, y, this.width, height);
    this.createContents();
    this.refresh();
    this.forceSelect(0);
    this.activate();
    Window_Selectable.prototype.open.call(this);
};
