//=============================================================================
// RPG Maker MZ - Setup
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Setup.
 * @author Peter Dawson
 *
 * Setup game - choose
 *
 * @help py06pd_Setup.js
 */

var py06pd = py06pd || {};
py06pd.Setup = py06pd.Setup || {};
py06pd.Setup.empireOptions = [[], [], [],
    ["roman", "babylonian", "german", "russian", "zulu", "french"],
    ["roman", "babylonian", "german", "egyptian", "russian", "zulu", "french", "aztec"],
    ["roman", "babylonian", "german", "egyptian", "american", "russian", "zulu", "french", "aztec", "chinese"],
    ["roman", "babylonian", "german", "egyptian", "american", "greek", "russian", "zulu", "french", "aztec", "chinese", "english"],
    ["roman", "babylonian", "german", "egyptian", "american", "greek", "indian", "russian", "zulu", "french", "aztec", "chinese", "english", "mongol"]
];
py06pd.Setup.vocab = {
    map: "Map Options",
    civ: "Game Options",
    start: "Start Game",
    landMass: {
        small: "Small",
        normal: "Normal",
        large: "Large",
        smallDesc: "Small",
        normalDesc: "Normal",
        largeDesc: "Large"
    },
    temperature: {
        cool: "Cool",
        temperate: "Temperate",
        warm: "Warm",
        coolDesc: "Small",
        temperateDesc: "Normal",
        warmDesc: "Large"
    },
    climate: {
        arid: "Arid",
        normal: "Normal",
        wet: "Wet",
        aridDesc: "Small",
        temperateDesc: "Normal",
        wetDesc: "Large"
    },
    age: {
        three: "3 billion years",
        four: "4 billion years",
        five: "5 billion years",
        threeDesc: "Small",
        fourDesc: "Normal",
        fiveDesc: "Large"
    },
    difficulty: {
        chieftain: "Chieftain (easiest)",
        warlord: "Warlord",
        prince: "Prince",
        king: "King",
        emperor: "Emperor (toughest)"
    },
    civilizations: "{amount} Civilizations"
};

(function() {

//=============================================================================
// Scene_Title
//=============================================================================

    py06pd.Setup.Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
    Scene_Title.prototype.commandNewGame = function() {
        DataManager.setupNewGame();
        DataManager.loadMapData($dataSystem.startMapId);
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_CivSetup);
    };
})(); // IIFE

//=============================================================================
// Scene_CivSetup
//=============================================================================

function Scene_CivSetup() {
    this.initialize(...arguments);
}

Scene_CivSetup.prototype = Object.create(Scene_MenuBase.prototype);
Scene_CivSetup.prototype.constructor = Scene_CivSetup;

Scene_CivSetup.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_CivSetup.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    this.createCommandWindow();
    this.createLandMassWindow();
    this.createTemperatureWindow();
    this.createClimateWindow();
    this.createAgeWindow();
    this.createDifficultyWindow();
    this.createCompetitionWindow();
    this.createEmpireWindow();
    this.createLeaderEditWindow();
    this.createLeaderNameInputWindow();
    this._commandWindow.setWindows(
        [this._landMassWindow, this._temperatureWindow, this._climateWindow, this._ageWindow],
        [this._difficultyWindow, this._competitionWindow, this._empireWindow]
    );
};

Scene_CivSetup.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    SceneManager.clearStack();
    this.adjustBackground();
    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
};

Scene_CivSetup.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    SceneManager.snapForBackground();
};

Scene_CivSetup.prototype.createBackground = function() {
    this._backSprite1 = new Sprite(
        ImageManager.loadTitle1($dataSystem.title1Name)
    );
    this._backSprite2 = new Sprite(
        ImageManager.loadTitle2($dataSystem.title2Name)
    );
    this.addChild(this._backSprite1);
    this.addChild(this._backSprite2);
};

Scene_CivSetup.prototype.adjustBackground = function() {
    this.scaleSprite(this._backSprite1);
    this.scaleSprite(this._backSprite2);
    this.centerSprite(this._backSprite1);
    this.centerSprite(this._backSprite2);
};

Scene_CivSetup.prototype.playTitleMusic = function() {
    AudioManager.playBgm($dataSystem.titleBgm);
    AudioManager.stopBgs();
    AudioManager.stopMe();
};

Scene_CivSetup.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_SetupCommand(rect);
    this._commandWindow.setHandler("map", this.commandMap.bind(this));
    this._commandWindow.setHandler("civ", this.commandCiv.bind(this));
    this._commandWindow.setHandler("start", this.commandStart.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_CivSetup.prototype.commandWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, true);
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivSetup.prototype.createLandMassWindow = function() {
    const rect = this.landMassWindowRect();
    this._landMassWindow = new Window_SetupMap(rect);
    this._landMassWindow.setOptions(
        [py06pd.Setup.vocab.landMass.small, py06pd.Setup.vocab.landMass.normal, py06pd.Setup.vocab.landMass.large],
        [py06pd.Setup.vocab.landMass.smallDesc, py06pd.Setup.vocab.landMass.normalDesc, py06pd.Setup.vocab.landMass.largeDesc]
    );
    this._landMassWindow.forceSelect(1);
    this._landMassWindow.setHandler("ok", this.onLandMassOK.bind(this));
    this._landMassWindow.setHandler("cancel", this.onLandMassCancel.bind(this));
    this.addWindow(this._landMassWindow);
};

Scene_CivSetup.prototype.landMassWindowRect = function() {
    const wx = 0;
    const wy = this._commandWindow.y + this._commandWindow.height;
    const ww = Graphics.boxWidth / 4;
    const wh = this.calcWindowHeight(3, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivSetup.prototype.createTemperatureWindow = function() {
    const rect = this.temperatureWindowRect();
    this._temperatureWindow = new Window_SetupMap(rect);
    this._temperatureWindow.forceSelect(1);
    this._temperatureWindow.setHandler("ok", this.onTemperatureOK.bind(this));
    this._temperatureWindow.setHandler("cancel", this.onTemperatureCancel.bind(this));
    this._temperatureWindow.setOptions(
        [py06pd.Setup.vocab.temperature.cool, py06pd.Setup.vocab.temperature.temperate, py06pd.Setup.vocab.temperature.warm],
        [py06pd.Setup.vocab.temperature.coolDesc, py06pd.Setup.vocab.temperature.temperateDesc, py06pd.Setup.vocab.temperature.warmDesc]
    );
    this.addWindow(this._temperatureWindow);
};

Scene_CivSetup.prototype.temperatureWindowRect = function() {
    const wx = this._landMassWindow.x + this._landMassWindow.width;
    const wy = this._commandWindow.y + this._commandWindow.height;
    const ww = Graphics.boxWidth / 4;
    const wh = this.calcWindowHeight(3, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivSetup.prototype.createClimateWindow = function() {
    const rect = this.climateWindowRect();
    this._climateWindow = new Window_SetupMap(rect);
    this._climateWindow.forceSelect(1);
    this._climateWindow.setHandler("ok", this.onClimateOK.bind(this));
    this._climateWindow.setHandler("cancel", this.onClimateCancel.bind(this));
    this._climateWindow.setOptions(
        [py06pd.Setup.vocab.climate.arid, py06pd.Setup.vocab.climate.normal, py06pd.Setup.vocab.climate.wet],
        [py06pd.Setup.vocab.climate.aridDesc, py06pd.Setup.vocab.climate.normalDesc, py06pd.Setup.vocab.climate.wetDesc]
    );
    this.addWindow(this._climateWindow);
};

Scene_CivSetup.prototype.climateWindowRect = function() {
    const wx = this._temperatureWindow.x + this._temperatureWindow.width;
    const wy = this._commandWindow.y + this._commandWindow.height;
    const ww = Graphics.boxWidth / 4;
    const wh = this.calcWindowHeight(3, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivSetup.prototype.createAgeWindow = function() {
    const rect = this.ageWindowRect();
    this._ageWindow = new Window_SetupMap(rect);
    this._ageWindow.forceSelect(1);
    this._ageWindow.setHandler("ok", this.onAgeOK.bind(this));
    this._ageWindow.setHandler("cancel", this.onAgeCancel.bind(this));
    this._ageWindow.setOptions(
        [py06pd.Setup.vocab.age.three, py06pd.Setup.vocab.age.four, py06pd.Setup.vocab.age.five],
        [py06pd.Setup.vocab.age.threeDesc, py06pd.Setup.vocab.age.fourDesc, py06pd.Setup.vocab.age.fiveDesc]
    );
    this.addWindow(this._ageWindow);
};

Scene_CivSetup.prototype.ageWindowRect = function() {
    const wx = this._climateWindow.x + this._climateWindow.width;
    const wy = this._commandWindow.y + this._commandWindow.height;
    const ww = Graphics.boxWidth / 4;
    const wh = this.calcWindowHeight(3, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivSetup.prototype.createDifficultyWindow = function() {
    const rect = this.difficultyWindowRect();
    this._difficultyWindow = new Window_SetupDifficulty(rect);
    this._difficultyWindow.forceSelect(0);
    this._difficultyWindow.close();
    this._difficultyWindow.setHandler("ok", this.onDifficultyOK.bind(this));
    this._difficultyWindow.setHandler("cancel", this.onDifficultyCancel.bind(this));
    this.addWindow(this._difficultyWindow);
};

Scene_CivSetup.prototype.difficultyWindowRect = function() {
    const wx = 0;
    const wy = this._commandWindow.y + this._commandWindow.height;
    const ww = Graphics.boxWidth / 3;
    const wh = this.calcWindowHeight(5, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivSetup.prototype.createCompetitionWindow = function() {
    const rect = this.competitionWindowRect();
    this._competitionWindow = new Window_SetupCompetition(rect);
    this._competitionWindow.forceSelect(0);
    this._competitionWindow.close();
    this._competitionWindow.setHandler("ok", this.onCompetitionOK.bind(this));
    this._competitionWindow.setHandler("cancel", this.onCompetitionCancel.bind(this));
    this.addWindow(this._competitionWindow);
};

Scene_CivSetup.prototype.competitionWindowRect = function() {
    const wx = this._difficultyWindow.x + this._difficultyWindow.width;
    const wy = this._commandWindow.y + this._commandWindow.height;
    const ww = Graphics.boxWidth / 3;
    const wh = this.calcWindowHeight(5, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivSetup.prototype.createEmpireWindow = function() {
    const rect = this.empireWindowRect();
    this._empireWindow = new Window_SetupEmpire(rect);
    this._empireWindow.forceSelect(0);
    this._empireWindow.close();
    this._empireWindow.setHandler("ok", this.onEmpireOK.bind(this));
    this._empireWindow.setHandler("cancel", this.onEmpireCancel.bind(this));
    this._empireWindow.setup(this._competitionWindow.item(), rect.height);
    this.addWindow(this._empireWindow);
};

Scene_CivSetup.prototype.empireWindowRect = function() {
    const wx = this._competitionWindow.x + this._competitionWindow.width;
    const wy = this._commandWindow.y + this._commandWindow.height;
    const ww = Graphics.boxWidth / 3;
    const wh = Graphics.boxHeight - this._commandWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivSetup.prototype.commandMap = function() {
    this._landMassWindow.activate();
};

Scene_CivSetup.prototype.commandCiv = function() {
    this._difficultyWindow.activate();
};

Scene_CivSetup.prototype.commandStart = function() {
    const empire = new Game_Empire(this._empireWindow.item());
    this._leaderEditWindow.setup(empire.empire().leader, 12);
    this._leaderNameInputWindow.open();
    this._leaderNameInputWindow.activate();
};

Scene_CivSetup.prototype.onLandMassOK = function() {
    this._temperatureWindow.activate();
};

Scene_CivSetup.prototype.onLandMassCancel = function() {
    this._commandWindow.activate();
};

Scene_CivSetup.prototype.onTemperatureOK = function() {
    this._climateWindow.activate();
};

Scene_CivSetup.prototype.onTemperatureCancel = function() {
    this._landMassWindow.activate();
};

Scene_CivSetup.prototype.onClimateOK = function() {
    this._ageWindow.activate();
};

Scene_CivSetup.prototype.onClimateCancel = function() {
    this._temperatureWindow.activate();
};

Scene_CivSetup.prototype.onAgeOK = function() {
    this._commandWindow.activate();
};

Scene_CivSetup.prototype.onAgeCancel = function() {
    this._climateWindow.activate();
};

Scene_CivSetup.prototype.onDifficultyOK = function() {
    this._competitionWindow.activate();
};

Scene_CivSetup.prototype.onDifficultyCancel = function() {
    this._ageWindow.activate();
};

Scene_CivSetup.prototype.onCompetitionOK = function() {
    this._empireWindow.setup(this._competitionWindow.item(), Graphics.boxHeight - this._commandWindow.height);
    this._empireWindow.activate();
};

Scene_CivSetup.prototype.onCompetitionCancel = function() {
    this._difficultyWindow.activate();
};

Scene_CivSetup.prototype.onEmpireOK = function() {
    this._commandWindow.activate();
};

Scene_CivSetup.prototype.onEmpireCancel = function() {
    this._competitionWindow.activate();
};

Scene_CivSetup.prototype.setupGame = function() {
    const empire = this._empireWindow.item();
    $gameMap.setDifficulty(this._difficultyWindow.index());
    $gameMap.addEmpire(empire);
    $gameMap.empire().setLeader(this._leaderEditWindow.name());
    alert(1);
    $gameMap.generateMap(
        this._landMassWindow.index(),
        this._temperatureWindow.index(),
        this._climateWindow.index(),
        this._ageWindow.index()
    );
    alert(2);
    const plains = $gameMap.startingPositions();
    const start = plains[Math.randomInt(plains.length)];
    $gamePlayer.locate(start.x, start.y);
    $gamePlayer.reserveTransfer($dataSystem.startMapId, start.x, start.y, 2, 0);

    while ($gameMap.empires().length - 1 < this._competitionWindow.item()) {
        const names = $gameMap.empires().map(emp => emp.name());
        const options = py06pd.Setup.empireOptions[this._competitionWindow.item()]
            .filter(emp => !names.includes(emp));
        const index = Math.randomInt(options.length);
        $gameMap.addEmpire(options[index]);
    }
};

Scene_CivSetup.prototype.createLeaderEditWindow = function() {
    const rect = this.leaderEditWindowRect();
    this._leaderEditWindow = new Window_LeaderNameEdit(rect);
    this._leaderEditWindow.close();
    this.addWindow(this._leaderEditWindow);
};

Scene_CivSetup.prototype.leaderEditWindowRect = function() {
    const ww = 600;
    const wh = this.calcWindowHeight(1, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivSetup.prototype.createLeaderNameInputWindow = function() {
    const rect = this.leaderNameInputWindowRect();
    this._leaderNameInputWindow = new Window_NameInput(rect);
    this._leaderNameInputWindow.setEditWindow(this._leaderEditWindow);
    this._leaderNameInputWindow.setHandler("ok", this.onLeaderNameInputOk.bind(this));
    this._leaderNameInputWindow.close();
    this._leaderNameInputWindow.deactivate();
    this.addWindow(this._leaderNameInputWindow);
};

Scene_CivSetup.prototype.leaderNameInputWindowRect = function() {
    const wx = this._leaderEditWindow.x;
    const wy = this._leaderEditWindow.y + this._leaderEditWindow.height + 8;
    const ww = this._leaderEditWindow.width;
    const wh = this.calcWindowHeight(9, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CivSetup.prototype.onLeaderNameInputOk = function() {
    this.setupGame();
    SceneManager.goto(Scene_Map);
};

//=============================================================================
// Window_LeaderNameEdit
//=============================================================================

function Window_LeaderNameEdit() {
    this.initialize(...arguments);
}

Window_LeaderNameEdit.prototype = Object.create(Window_NameEdit.prototype);
Window_LeaderNameEdit.prototype.constructor = Window_LeaderNameEdit;

Window_LeaderNameEdit.prototype.initialize = function(rect) {
    Window_NameEdit.prototype.initialize.call(this, rect);
};

Window_LeaderNameEdit.prototype.setup = function(name, maxLength) {
    this._maxLength = maxLength;
    this._name = name.slice(0, this._maxLength);
    this._index = this._name.length;
    this._defaultName = this._name;
    this.refresh();
    this.open();
};

Window_LeaderNameEdit.prototype.left = function() {
    const nameWidth = (this._maxLength + 1) * this.charWidth();
    return (this.innerWidth - nameWidth) / 2;
};

Window_LeaderNameEdit.prototype.itemRect = function(index) {
    const x = this.left() + index * this.charWidth();
    const y = 0;
    const width = this.charWidth();
    const height = this.lineHeight();
    return new Rectangle(x, y, width, height);
};

Window_LeaderNameEdit.prototype.drawActorFace = function() {
};

//=============================================================================
// Window_SetupCommand
//=============================================================================

function Window_SetupCommand() {
    this.initialize(...arguments);
}

Window_SetupCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_SetupCommand.prototype.constructor = Window_SetupCommand;

Window_SetupCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this._mapWindows = [];
    this._civWindows = [];
    this._lastSymbol = null;
};

Window_SetupCommand.prototype.maxCols = function() {
    return 3;
};

Window_SetupCommand.prototype.makeCommandList = function() {
    this.addCommand(py06pd.Setup.vocab.map, "map");
    this.addCommand(py06pd.Setup.vocab.civ, "civ");
    this.addCommand(py06pd.Setup.vocab.start, "start");
};

Window_SetupCommand.prototype.setWindows = function(mapWindows, civWindows) {
    this._mapWindows = mapWindows;
    this._civWindows = civWindows;
};

Window_SetupCommand.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
    if (this._lastSymbol !== this.currentSymbol()) {
        if (this.currentSymbol() === "map") {
            this._mapWindows.forEach(window => window.open());
            this._civWindows.forEach(window => window.close());
        }
        if (this.currentSymbol() === "civ") {
            this._mapWindows.forEach(window => window.close());
            this._civWindows.forEach(window => window.open());
        }
    }
};

//=============================================================================
// Window_SetupMap
//=============================================================================

function Window_SetupMap() {
    this.initialize(...arguments);
}

Window_SetupMap.prototype = Object.create(Window_Selectable.prototype);
Window_SetupMap.prototype.constructor = Window_SetupMap;

Window_SetupMap.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._options = [];
    this._help = [];
};

Window_SetupMap.prototype.maxCols = function() {
    return 1;
};

Window_SetupMap.prototype.maxItems = function() {
    return 3;
};

Window_SetupMap.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_SetupMap.prototype.itemAt = function(index) {
    return this._options.length > 0 && index >= 0 ? this._options[index] : null;
};

Window_SetupMap.prototype.setOptions = function(options, help) {
    this._options = options;
    this._help = help;
    this.refresh();
};

Window_SetupMap.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawText(item, rect.x, rect.y, rect.width);
    }
};

Window_SetupMap.prototype.updateHelp = function() {
    let index = this.index();
    this.setHelpWindowItem(this._help.length > 0 && index >= 0 ? { description: this._help[index] } : null);
};

//=============================================================================
// Window_SetupDifficulty
//=============================================================================

function Window_SetupDifficulty() {
    this.initialize(...arguments);
}

Window_SetupDifficulty.prototype = Object.create(Window_Selectable.prototype);
Window_SetupDifficulty.prototype.constructor = Window_SetupDifficulty;

Window_SetupDifficulty.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_SetupDifficulty.prototype.maxCols = function() {
    return 1;
};

Window_SetupDifficulty.prototype.maxItems = function() {
    return 5;
};

Window_SetupDifficulty.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_SetupDifficulty.prototype.itemAt = function(index) {
    const data = [
        py06pd.Setup.vocab.difficulty.chieftain,
        py06pd.Setup.vocab.difficulty.warlord,
        py06pd.Setup.vocab.difficulty.prince,
        py06pd.Setup.vocab.difficulty.king,
        py06pd.Setup.vocab.difficulty.emperor
    ];
    return index >= 0 ? data[index] : null;
};

Window_SetupDifficulty.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawText(item, rect.x, rect.y, rect.width);
    }
};

//=============================================================================
// Window_SetupCompetition
//=============================================================================

function Window_SetupCompetition() {
    this.initialize(...arguments);
}

Window_SetupCompetition.prototype = Object.create(Window_Selectable.prototype);
Window_SetupCompetition.prototype.constructor = Window_SetupCompetition;

Window_SetupCompetition.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_SetupCompetition.prototype.maxCols = function() {
    return 1;
};

Window_SetupCompetition.prototype.maxItems = function() {
    return 5;
};

Window_SetupCompetition.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_SetupCompetition.prototype.itemAt = function(index) {
    const data = [7, 6, 5, 4, 3];
    return index >= 0 ? data[index] : null;
};

Window_SetupCompetition.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const rect = this.itemLineRect(index);
        const label = py06pd.Setup.vocab.civilizations.replace("{amount}", item);
        this.drawText(label, rect.x, rect.y, rect.width);
    }
};

//=============================================================================
// Window_SetupEmpire
//=============================================================================

function Window_SetupEmpire() {
    this.initialize(...arguments);
}

Window_SetupEmpire.prototype = Object.create(Window_Selectable.prototype);
Window_SetupEmpire.prototype.constructor = Window_SetupEmpire;

Window_SetupEmpire.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._data = [];
};

Window_SetupEmpire.prototype.maxCols = function() {
    return 1;
};

Window_SetupEmpire.prototype.maxItems = function() {
    return this._data.length;
};

Window_SetupEmpire.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_SetupEmpire.prototype.itemAt = function(index) {
    return this._data.length > 0 && index >= 0 ? this._data[index] : null;
};

Window_SetupEmpire.prototype.setup = function(competition, maxHeight) {
    this._data = py06pd.Setup.empireOptions[competition];
    if (this._index >= this._data.length) {
        this.forceSelect(0);
    }

    const height = Math.min(this.fittingHeight(this._data.length), maxHeight);
    this.move(this.x, this.y, this.width, height);
    this.createContents();
    this.refresh();
};

Window_SetupEmpire.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const rect = this.itemLineRect(index);
        const empire = py06pd.CivData.Empires.find(emp => emp.name === item);
        this.drawText(empire.label, rect.x, rect.y, rect.width);
    }
};
