//=============================================================================
// RPG Maker MZ - Civ Game Menu
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Game menu.
 * @author Peter Dawson
 *
 * Options for:
 * * Tax rate
 * * Luxury rate
 * * End game
 *
 * @help py06pd_CivMenu.js
 */

var py06pd = py06pd || {};
py06pd.CivMenu = py06pd.CivMenu || {};
py06pd.CivMenu.vocabLuxuryRate = "Luxury Rate";
py06pd.CivMenu.vocabLuxuryRateOption = "{luxury}% Luxuries, ({science}% Science)";
py06pd.CivMenu.vocabTaxRate = "Tax Rate";
py06pd.CivMenu.vocabTaxRateOption = "{tax}% Tax, ({science}% Science)";

(function() {

//=============================================================================
// Scene_Map
//=============================================================================

    py06pd.CivMenu.Scene_Map_callMenu = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function() {
        SoundManager.playOk();
        SceneManager.push(Scene_CivMenu);
        Window_MenuCommand.initCommandPosition();
        $gameTemp.clearDestination();
        this._waitCount = 2;
    };

})(); // IIFE

//=============================================================================
// Scene_CivMenu
//=============================================================================

function Scene_CivMenu() {
    this.initialize(...arguments);
}

Scene_CivMenu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_CivMenu.prototype.constructor = Scene_CivMenu;

Scene_CivMenu.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_CivMenu.prototype.helpAreaHeight = function() {
    return 0;
};

Scene_CivMenu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createTaxRateWindow();
    this.createLuxuryRateWindow();
    this.luxuryWindowReset();
    this.taxWindowReset();
};

Scene_CivMenu.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_CivMenuCommand(rect);
    commandWindow.setHandler("tax", this.commandTax.bind(this));
    commandWindow.setHandler("luxury", this.commandLuxury.bind(this));
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow = commandWindow;
};

Scene_CivMenu.prototype.commandWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.mainAreaHeight();
    const wx = Graphics.boxWidth - ww;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivMenu.prototype.createTaxRateWindow = function() {
    const rect = this.taxWindowRect();
    this._taxWindow = new Window_TaxRate(rect);
    this._taxWindow.setHandler("ok", this.onTaxRateOk.bind(this));
    this._taxWindow.setHandler("cancel", this.onTaxRateCancel.bind(this));
    this._taxWindow.forceSelect($gameMap.empire().taxRate() / 10);
    this.addWindow(this._taxWindow);
};

Scene_CivMenu.prototype.taxWindowRect = function() {
    const ww = (Graphics.boxWidth - this.mainCommandWidth()) * 6 / 13;
    const wh = this.calcWindowHeight(11, true); //0;
    const wx = 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivMenu.prototype.taxWindowReset = function() {
    this._taxWindow.move(
        this._taxWindow.x,
        this._taxWindow.y,
        this._taxWindow.width,
        this.calcWindowHeight(this._taxWindow.maxItems(), true)
    );
    this._taxWindow.refresh();
};

Scene_CivMenu.prototype.createLuxuryRateWindow = function() {
    const rect = this.luxuryWindowRect();
    this._luxuryWindow = new Window_LuxuryRate(rect);
    this._luxuryWindow.setHandler("ok", this.onLuxuryRateOk.bind(this));
    this._luxuryWindow.setHandler("cancel", this.onTaxRateCancel.bind(this));
    this._luxuryWindow.forceSelect($gameMap.empire().luxuryRate() / 10);
    this.addWindow(this._luxuryWindow);
};

Scene_CivMenu.prototype.luxuryWindowRect = function() {
    const ww = (Graphics.boxWidth - this.mainCommandWidth()) * 7 / 13;
    const wh = this.calcWindowHeight(11, true); //0;
    const wx = this._taxWindow.width;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivMenu.prototype.luxuryWindowReset = function() {
    this._luxuryWindow.move(
        this._luxuryWindow.x,
        this._luxuryWindow.y,
        this._luxuryWindow.width,
        this.calcWindowHeight(this._luxuryWindow.maxItems(), true)
    );
    this._luxuryWindow.refresh();
};

Scene_CivMenu.prototype.commandTax = function() {
    this._taxWindow.activate();
};

Scene_CivMenu.prototype.commandLuxury = function() {
    this._luxuryWindow.activate();
};

Scene_CivMenu.prototype.commandOptions = function() {
    SceneManager.push(Scene_Options);
};

Scene_CivMenu.prototype.commandSave = function() {
    SceneManager.push(Scene_Save);
};

Scene_CivMenu.prototype.commandGameEnd = function() {
    SceneManager.push(Scene_GameEnd);
};

Scene_CivMenu.prototype.onLuxuryRateOk = function() {
    $gameMap.empire().setLuxuryRate(this._luxuryWindow.index() * 10);
    this.taxWindowReset();
    this._luxuryWindow.activate();
};

Scene_CivMenu.prototype.onTaxRateOk = function() {
    $gameMap.empire().setTaxRate(this._taxWindow.index() * 10);
    this.luxuryWindowReset();
    this._taxWindow.activate();
};

Scene_CivMenu.prototype.onTaxRateCancel = function() {
    this._luxuryWindow.deactivate();
    this._taxWindow.deactivate();
    this._commandWindow.activate();
};

//=============================================================================
// Window_CivMenuCommand
//=============================================================================

function Window_CivMenuCommand() {
    this.initialize(...arguments);
}

Window_CivMenuCommand.prototype = Object.create(Window_Command.prototype);
Window_CivMenuCommand.prototype.constructor = Window_CivMenuCommand;

Window_CivMenuCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.selectLast();
};

Window_CivMenuCommand._lastCommandSymbol = null;

Window_CivMenuCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_CivMenuCommand.prototype.makeCommandList = function() {
    this.addCommand(py06pd.CivMenu.vocabTaxRate, "tax", true);
    this.addCommand(py06pd.CivMenu.vocabLuxuryRate, "luxury", true);
    this.addCommand(TextManager.options, "options", true);
    this.addCommand(TextManager.save, "save", true);
    this.addCommand(TextManager.gameEnd, "gameEnd", true);
};

Window_CivMenuCommand.prototype.processOk = function() {
    Window_CivMenuCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_CivMenuCommand.prototype.selectLast = function() {
    this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
};

//=============================================================================
// Window_LuxuryRate
//=============================================================================

function Window_LuxuryRate() {
    this.initialize(...arguments);
}

Window_LuxuryRate.prototype = Object.create(Window_Selectable.prototype);
Window_LuxuryRate.prototype.constructor = Window_LuxuryRate;

Window_LuxuryRate.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_LuxuryRate.prototype.maxItems = function() {
    return ((100 - $gameMap.empire().taxRate()) / 10) + 1;
};

Window_LuxuryRate.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const rate = index * 10;
    const label = py06pd.CivMenu.vocabLuxuryRateOption
        .replace("{luxury}", rate.toString())
        .replace("{science}", (100 - $gameMap.empire().taxRate() - rate).toString());
    this.drawText(label, rect.x, rect.y, rect.width);
};

//=============================================================================
// Window_TaxRate
//=============================================================================

function Window_TaxRate() {
    this.initialize(...arguments);
}

Window_TaxRate.prototype = Object.create(Window_Selectable.prototype);
Window_TaxRate.prototype.constructor = Window_TaxRate;

Window_TaxRate.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_TaxRate.prototype.maxItems = function() {
    return ((100 - $gameMap.empire().luxuryRate()) / 10) + 1;
};

Window_TaxRate.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const rate = index * 10;
    const label = py06pd.CivMenu.vocabTaxRateOption
        .replace("{tax}", rate.toString())
        .replace("{science}", (100 - $gameMap.empire().luxuryRate() - rate).toString());
    this.drawText(label, rect.x, rect.y, rect.width);
};
