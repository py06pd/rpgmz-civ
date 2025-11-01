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
py06pd.CityBuilder.FoodIcon = 276;
py06pd.CityBuilder.PopulationIcon = 135;
py06pd.CityBuilder.ProductionIcon = 223;
py06pd.CityBuilder.TradeIcon = 75;
py06pd.CityBuilder.vocabBuild = "Build";
py06pd.CityBuilder.vocabBuilt = "Built";
py06pd.CityBuilder.vocabManage = "Manage";
py06pd.CityBuilder.vocabSell = "Sell";

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
                emp.addCity(new Game_City(emp.nextCityName(), emp.name(), start.x, start.y));
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
    this.createBuiltWindow();
    this.createBuildingsWindow();
    this.createBuildWindow();
    this.createSellWindow();
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
    this._commandWindow.setHandler("manage", this.commandManage.bind(this));
    this._commandWindow.setHandler("build", this.commandBuild.bind(this));
    this._commandWindow.setHandler("built", this.commandBuilt.bind(this));
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
    this._bfcWindow.setHandler("ok", this.onBFCOk.bind(this));
    this._bfcWindow.setHandler("cancel", this.onBuildCancel.bind(this));
    this.addWindow(this._bfcWindow);
};

Scene_City.prototype.BFCWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const yieldWindowRect = this.yieldWindowRect();
    const wx = yieldWindowRect.width;
    const wy = commandWindowRect.y + commandWindowRect.height;
    const ww = $gameMap.tileWidth() * 5;
    const wh = this.mainAreaHeight() - commandWindowRect.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_City.prototype.createBuildingsWindow = function() {
    const rect = this.buildingsWindowRect();
    this._buildingsWindow = new Window_CityBuildings(rect);
    this._buildingsWindow.hide();
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

Scene_City.prototype.createBuiltWindow = function() {
    const rect = this.buildingsWindowRect();
    this._builtWindow = new Window_CityBuilt(rect);
    this._builtWindow.setHandler("ok", this.onBuiltOk.bind(this));
    this._builtWindow.setHandler("cancel", this.onBuildCancel.bind(this));
    this.addWindow(this._builtWindow);
};

Scene_City.prototype.createSellWindow = function() {
    const rect = this.sellWindowRect();
    this._sellWindow = new Window_CitySell(rect);
    this._sellWindow.hide();
    this._sellWindow.setHandler("ok", this.onSellOk.bind(this));
    this._sellWindow.setHandler("cancel", this.onSellCancel.bind(this));
    this.addWindow(this._sellWindow);
};

Scene_City.prototype.sellWindowRect = function() {
    const buildingsWindowRect = this.buildingsWindowRect();
    const ww = buildingsWindowRect.width;
    const wh = this.calcWindowHeight(1, true);
    const wx = buildingsWindowRect.x;
    const wy = Graphics.boxHeight - wh;
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
    this._builtWindow.setCity(city);
};

Scene_City.prototype.commandManage = function() {
    this._bfcWindow.activate();
    this._bfcWindow.select(2, 2);
};

Scene_City.prototype.commandBuild = function() {
    this._buildingsWindow.activate();
    this._buildingsWindow.select(0);
    this._buildingsWindow.show();
    this._builtWindow.hide();
};

Scene_City.prototype.commandBuilt = function() {
    this._builtWindow.activate();
    this._builtWindow.select(0);
};

Scene_City.prototype.onBFCOk = function() {
    const city = $gameMap.empire().cities()[this._index];
    const mapX = this._bfcWindow.mapX();
    const mapY = this._bfcWindow.mapY();
    const workTile = city.isWorkTile(mapX, mapY);
    if ((mapX !== city.x || mapY !== city.y) && workTile) {
        city.removeWorkTile(mapX, mapY);
    } else if (!workTile && city.specialists() > 0) {
        city.addWorkTile(mapX, mapY);
    } else {
        SoundManager.playBuzzer();
    }
    this._bfcWindow.refresh();
    this._bfcWindow.activate();
};

Scene_City.prototype.onBuildOk = function() {
    const build = this._buildingsWindow.item();
    $gameMap.empire().cities()[this._index].setBuild({ type: build.characterIndex ? 'unit' : 'building', name: build.name, value: 0 })
    this._buildWindow.refresh();
    this._buildingsWindow.activate();
};

Scene_City.prototype.onBuiltOk = function() {
    this._sellWindow.setup(this._builtWindow.item().sell);
};

Scene_City.prototype.onBuildCancel = function() {
    this._buildingsWindow.deactivate();
    this._buildingsWindow.deselect();
    this._buildingsWindow.hide();
    this._builtWindow.deactivate();
    this._builtWindow.deselect();
    this._builtWindow.show();
    this._commandWindow.activate();
};

Scene_City.prototype.onSellOk = function() {
    const city = $gameMap.empire().cities()[this._index];
    const item = this._builtWindow.item();
    $gameMap.empire().addGold(item.sell);
    city.removeBuilding(item.name);

    this._sellWindow.hide();
    this._buildingsWindow.refresh();
    this._builtWindow.refresh();
    this._builtWindow.select(0);
    this._builtWindow.activate();
};

Scene_City.prototype.onSellCancel = function() {
    this._sellWindow.hide();
    this._builtWindow.activate();
};

Scene_City.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.onBuildCancel();
    this.refreshActor();
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
// Sprite_Icon
//=============================================================================

function Sprite_Icon() {
    this.initialize(...arguments);
}

Sprite_Icon.prototype = Object.create(Sprite.prototype);
Sprite_Icon.prototype.constructor = Sprite_Icon;

Sprite_Icon.prototype.initialize = function(x, y, icon) {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();

    this.x = x;
    this.y = y;
    const pw = ImageManager.iconWidth / 2;
    const ph = ImageManager.iconHeight / 2;
    const sx = (icon % 16) * pw;
    const sy = Math.floor(icon / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

Sprite_Icon.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

Sprite_Icon.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem("IconSet2");
    this.setFrame(0, 0, 0, 0);
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
    return 3;
};

Window_CityCommand.prototype.makeCommandList = function() {
    this.addCommand(py06pd.CityBuilder.vocabManage, "manage");
    this.addCommand(py06pd.CityBuilder.vocabBuild, "build");
    this.addCommand(py06pd.CityBuilder.vocabBuilt, "built");
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

Window_CityBFC.prototype = Object.create(Window_Selectable.prototype);
Window_CityBFC.prototype.constructor = Window_CityBFC;

Window_CityBFC.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._city = null;
    this._cursorX = 2;
    this._cursorY = 2;
    this.refresh();
};

Window_CityBFC.prototype.setCity = function(city) {
    if (this._city !== city) {
        this._city = city;
        this.refresh();
    }
};

Window_CityBFC.prototype.createTilemap = function() {
    const tilemap = new Tilemap();
    const data = [];
    for (let z = 0; z < 2; z++) {
        for (let y = 0; y < 5; y++) {
            const offsetY = this._city.y + y - 2;
            for (let x = 0; x < 5; x++) {
                const offsetX = this._city.x + x - 2;
                if ((x === 0 && (y === 0 || y === 4)) || (x === 4 && (y === 0 || y === 4))) {
                    data.push(0);
                } else {
                    data.push($gameMap.data()[(z * $gameMap.height() + offsetY) * $gameMap.width() + offsetX])
                }
            }
        }
    }

    tilemap.tileWidth = $gameMap.tileWidth();
    tilemap.tileHeight = $gameMap.tileHeight();
    tilemap.setData(5, 5, data);
    tilemap.horizontalWrap = false;
    tilemap.verticalWrap = false;
    this.addChild(tilemap);
    this._tilemap = tilemap;
    this.loadTileset();
};

Window_CityBFC.prototype.loadTileset = function() {
    const bitmaps = [];
    const tilesetNames = $gameMap.tileset().tilesetNames;
    for (const name of tilesetNames) {
        bitmaps.push(ImageManager.loadTileset(name));
    }
    this._tilemap.setBitmaps(bitmaps);
    this._tilemap.flags = $gameMap.tilesetFlags();
};

Window_CityBFC.prototype.processCursorMove = function() {
    if (this.isOpenAndActive()) {
        const lastX = this.x;
        const lastY = this.y;
        if (Input.isRepeated("down")) {
            this.cursorDown();
        }
        if (Input.isRepeated("up")) {
            this.cursorUp();
        }
        if (Input.isRepeated("right")) {
            this.cursorRight();
        }
        if (Input.isRepeated("left")) {
            this.cursorLeft();
        }
        if (this.x !== lastX || this.y !== lastY) {
            this.playCursorSound();
        }
    }
};

Window_CityBFC.prototype.cursorDown = function() {
    this.select(this._cursorX, this._cursorY + 1);
};

Window_CityBFC.prototype.cursorUp = function() {
    this.select(this._cursorX, this._cursorY - 1);
};

Window_CityBFC.prototype.cursorRight = function() {
    this.select(this._cursorX + 1, this._cursorY);
};

Window_CityBFC.prototype.cursorLeft = function() {
    this.select(this._cursorX - 1, this._cursorY);
};

Window_CityBFC.prototype.mapX = function() {
    return this._city.x + this._cursorX - 2;
};

Window_CityBFC.prototype.mapY = function() {
    return this._city.y + this._cursorY - 2;
};

Window_CityBFC.prototype.reselect = function() {
    this.select(this._cursorX, this._cursorY);
};

Window_CityBFC.prototype.select = function(x, y) {
    let maxX = 4;
    let maxY = 4;
    let minX = 0;
    let minY = 0;
    if (x !== this._cursorX && (y === 0 || y === 4)) {
        maxX = 3;
        minX = 1;
    }
    if (y !== this._cursorY && (x === 0 || x === 4)) {
        maxY = 3;
        minY = 1;
    }
    this._cursorX = x < minX ? maxX : (x > maxX ? minX : x);
    this._cursorY = y < minY ? maxY : (y > maxY ? minY : y);
};

Window_CityBFC.prototype.screenX = function() {
    return this._cursorX * $gameMap.tileWidth() + 24;
};

Window_CityBFC.prototype.screenY = function() {
    return this._cursorY * $gameMap.tileHeight() + 48 - 6;
};

Window_CityBFC.prototype.screenZ = function() {
    return 3;
};

Window_CityBFC.prototype.isTransparent = function() {
    return false;
};

Window_CityBFC.prototype.refresh = function() {
    this.contents.clear();
    if (this._city) {
        this.createTilemap();
        const government = $gameMap.empire().government();
        for (let y = 0; y < 5; y++) {
            const offsetY = this._city.y + y - 2;
            for (let x = 0; x < 5; x++) {
                if ((x !== 0 && x !== 4) || (y !== 0 && y !== 4)) {
                    const offsetX = this._city.x + x - 2;
                    if ($gameMap.empires().some(emp => !!emp.city(offsetX, offsetY))) {
                        this.addChild(new Sprite_City({ x, y }, true));
                    }
                    if (this._city.isWorkTile(offsetX, offsetY)) {
                        const tile = $gameMap.geography(offsetX, offsetY);
                        const food = tile.food(government);
                        const production = tile.production(government);
                        const trade = tile.trade(government);
                        const ax = (x * $gameMap.tileHeight()) + 8;
                        const ay = (y * $gameMap.tileHeight()) + 8;
                        for (let i = 0; i < food; i++) {
                            const bx = ax + (16 * i);
                            this.addChild(new Sprite_Icon(bx, ay, py06pd.CityBuilder.FoodIcon));
                        }
                        for (let i = 0; i < production; i++) {
                            const bx = ax + (16 * i);
                            this.addChild(new Sprite_Icon(bx, ay + 16, py06pd.CityBuilder.ProductionIcon));
                        }
                        for (let i = 0; i < trade; i++) {
                            const bx = ax + (16 * i);
                            this.addChild(new Sprite_Icon(bx, ay + 32, py06pd.CityBuilder.TradeIcon));
                        }
                    }
                }
            }
        }
        this.addChild(new Sprite_Cursor(this));
        const y = $gameMap.tileHeight() * 5;
        const inset = ImageManager.iconWidth + 6;
        const spaceY = ImageManager.iconHeight + 6;
        this.drawIcon(py06pd.CityBuilder.PopulationIcon, 0, y);
        this.drawText(this._city.population(), inset, y, this.contentsWidth());
        this.drawIcon(py06pd.CityBuilder.FoodIcon, 0, y + spaceY);
        this.drawText(this._city.foodYield(), inset, y + spaceY, this.contentsWidth());
        const storage = this._city.foodStorage() + "/" + this._city.maxFoodStorage();
        this.drawText(storage, inset, y + spaceY, this.contentsWidth() - inset, "right");
        this.drawIcon(py06pd.CityBuilder.ProductionIcon, 0, y + spaceY * 2);
        this.drawText(this._city.productionYield(), inset, y + spaceY * 2, this.contentsWidth());
        this.drawIcon(py06pd.CityBuilder.TradeIcon, 0, y + spaceY * 3);
        this.drawText(this._city.tradeBase(), inset, y + spaceY * 3, this.contentsWidth());

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
// Window_CityBuilt
//=============================================================================

function Window_CityBuilt() {
    this.initialize(...arguments);
}

Window_CityBuilt.prototype = Object.create(Window_Selectable.prototype);
Window_CityBuilt.prototype.constructor = Window_CityBuilt;

Window_CityBuilt.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._city = null;
    this.refresh();
};

Window_CityBuilt.prototype.setCity = function(city) {
    if (this._city !== city) {
        this._city = city;
        this.refresh();
    }
};

Window_CityBuilt.prototype.maxItems = function() {
    return this._city ? this._city.buildings().length : 0;
};

Window_CityBuilt.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_CityBuilt.prototype.itemAt = function(index) {
    return this._city ? this._city.buildings()[index] : null;
};

Window_CityBuilt.prototype.drawItem = function(index) {
    if (this._city) {
        const item = this.itemAt(index);
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(true);
        this.resetTextColor();
        let textWidth = 0;
        let width = rect.width;
        if (item.maintain) {
            const cost = item.maintain;
            textWidth = this.textWidth(cost);
            width = rect.width - ImageManager.iconWidth - 6;
            this.drawText(cost, rect.x, rect.y, width, "right");
            this.drawIcon(py06pd.CivCore.GoldIcon, rect.x + width + 6, rect.y + (rect.height - ImageManager.iconHeight) / 2);
        }
        this.drawText(item.label, rect.x, rect.y, width - textWidth);
        this.changePaintOpacity(true);
    }
};

//=============================================================================
// Window_CitySell
//=============================================================================

function Window_CitySell() {
    this.initialize(...arguments);
}

Window_CitySell.prototype = Object.create(Window_Selectable.prototype);
Window_CitySell.prototype.constructor = Window_CitySell;

Window_CitySell.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._price = 0;
    this.refresh();
};

Window_CitySell.prototype.setup = function(price) {
    this._price = price;
    this.select(0);
    this.activate();
    this.show();
    this.refresh();
};

Window_CitySell.prototype.maxItems = function() {
    return 1;
};

Window_CitySell.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    this.changePaintOpacity(true);
    this.resetTextColor();
    const textWidth = this.textWidth(this._price);
    const width = rect.width - ImageManager.iconWidth - 6;
    this.drawText(py06pd.CityBuilder.vocabSell, rect.x, rect.y, width - textWidth);
    this.drawText(this._price, rect.x, rect.y, width, "right");
    this.drawIcon(py06pd.CivCore.GoldIcon, rect.x + width + 6, rect.y + (rect.height - ImageManager.iconHeight) / 2);
    this.changePaintOpacity(true);
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
