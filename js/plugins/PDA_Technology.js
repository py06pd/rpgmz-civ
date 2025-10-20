//=============================================================================
// RPG Maker MZ - Technology
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Learn technologies.
 * @author Peter Dawson
 *
 * Science cost is calculated based on Lightbulb formula at
 * https://civfanatics.com/civ1/faq/section-d-tips-and-information/
 *
 * @help PDA_Technology.js
 */

var PDA = PDA || {};
PDA.Technology = PDA.Technology || {};

PDA.Technology.Technologies = [
    { name: 'horseback', label: 'Horseback Riding', requires: [] },
    { name: 'burial', label: 'Ceremonial Burial', requires: [] },
    { name: 'pottery', label: 'Pottery', requires: [] },
    { name: 'alphabet', label: 'Alphabet', requires: [] },
    { name: 'wheel', label: 'The Wheel', requires: [] },
    { name: 'masonry', label: 'Masonry', requires: [] },
    { name: 'bronze', label: 'Bronze Working', requires: [] },
    { name: 'chivalry', label: 'Chivalry', requires: ["horseback", "feudalism"] },
    { name: 'mysticism', label: 'Mysticism', requires: ["burial"] },
    { name: 'laws', label: 'Code Of Laws', requires: ["alphabet"] },
    { name: 'maps', label: 'Map Making', requires: ["alphabet"] },
    { name: 'writing', label: 'Writing', requires: ["alphabet"] },
    { name: 'construction', label: 'Construction', requires: ["currency", "masonry"] },
    { name: 'iron', label: 'Iron Working', requires: ["bronze"] },
    { name: 'currency', label: 'Currency', requires: ["bronze"] },
    { name: 'astronomy', label: 'Astronomy', requires: ["mysticism", "mathematics"] },
    { name: 'monarchy', label: 'Monarchy', requires: ["laws", "burial"] },
    { name: 'republic', label: 'The Republic', requires: ["laws", "literacy"] },
    { name: 'literacy', label: 'Literacy', requires: ["laws", "writing"] },
    { name: 'mathematics', label: 'Mathematics', requires: ["alphabet", "masonry"] },
    { name: 'bridges', label: 'Bridge Building', requires: ["iron", "construction"] },
    { name: 'engineering', label: 'Engineering', requires: ["wheel", "construction"] },
    { name: 'trade', label: 'Trade', requires: ["laws", "currency"] },
    { name: 'navigation', label: 'Navigation', requires: ["astronomy", "maps"] },
    { name: 'physics', label: 'Physics', requires: ["navigation", "mathematics"] },
    { name: 'feudalism', label: 'Feudalism', requires: ["monarchy", "masonry"] },
    { name: 'banking', label: 'Banking', requires: ["republic", "trade"] },
    { name: 'philosophy', label: 'Philosophy', requires: ["mysticism", "literacy"] },
    { name: 'university', label: 'University', requires: ["philosophy", "mathematics"] },
    { name: 'railroad', label: 'Railroad', requires: ["bridges", "steam"] },
    { name: 'invention', label: 'Invention', requires: ["engineering", "literacy"] },
    { name: 'medicine', label: 'Medicine', requires: ["philosophy", "trade"] },
    { name: 'magnetism', label: 'Magnetism', requires: ["navigation", "physics"] },
    { name: 'steam', label: 'Steam Engine', requires: ["invention", "physics"] },
    { name: 'religion', label: 'Religion', requires: ["philosophy", "writing"] },
    { name: 'democracy', label: 'Democracy', requires: ["philosophy", "literacy"] },
    { name: 'gravity', label: 'Theory Of Gravity', requires: ["astronomy", "university"] },
    { name: 'gunpowder', label: 'Gunpowder', requires: ["iron", "invention"] },
    { name: 'chemistry', label: 'Chemistry', requires: ["medicine", "university"] },
    { name: 'electricity', label: 'Electricity', requires: ["metallurgy", "magnetism"] },
    { name: 'flight', label: 'Flight', requires: ["combustion", "physics"] },
    { name: 'atomic', label: 'Atomic Theory', requires: ["gravity", "physics"] },
    { name: 'industry', label: 'Industrialisation', requires: ["banking", "railroad"] },
    { name: 'metallurgy', label: 'Metallurgy', requires: ["gunpowder", "university"] },
    { name: 'explosives', label: 'Explosives', requires: ["gunpowder", "chemistry"] },
    { name: 'electronics', label: 'Electronics', requires: ["engineering", "electricity"] },
    { name: 'advanced', label: 'Advanced Flight', requires: ["flight", "electricity"] },
    { name: 'communism', label: 'Communism', requires: ["philosophy", "industry"] },
    { name: 'corporation', label: 'The Corporation', requires: ["banking", "industry"] },
    { name: 'steel', label: 'Steel', requires: ["metallurgy", "industry"] },
    { name: 'conscription', label: 'Conscription', requires: ["republic", "explosives"] },
    { name: 'computers', label: 'Computers', requires: ["electronics", "mathematics"] },
    { name: 'rocketry', label: 'Rocketry', requires: ["electronics", "advanced"] },
    { name: 'unions', label: 'Labour Union', requires: ["mass", "communism"] },
    { name: 'genetics', label: 'Genetic Engineering', requires: ["corporation", "medicine"] },
    { name: 'refining', label: 'Refining', requires: ["corporation", "chemistry"] },
    { name: 'automobile', label: 'Automobile', requires: ["combustion", "steel"] },
    { name: 'space', label: 'Space Flight', requires: ["computers", "rocketry"] },
    { name: 'plastics', label: 'Plastics', requires: ["refining", "space"] },
    { name: 'combustion', label: 'Combustion', requires: ["refining", "explosives"] },
    { name: 'mass', label: 'Mass Production', requires: ["corporation", "automobile"] },
    { name: 'robotics', label: 'Robotics', requires: ["computers", "plastics"] },
    { name: 'superconductor', label: 'Superconductor', requires: ["mass", "plastics"] },
    { name: 'fission', label: 'Nuclear Fission', requires: ["mass", "atomic"] },
    { name: 'recycling', label: 'Recycling', requires: ["mass", "democracy"] },
    { name: 'nuclear', label: 'Nuclear Power', requires: ["electronics", "fission"] },
    { name: 'fusion', label: 'Fusion Power', requires: ["nuclear", "superconductor"] },
    { name: 'future', label: 'Future Tech', requires: ["fusion"] }
];

(function() {

//=============================================================================
// Game_Empire
//=============================================================================

    PDA.Technology.Game_Empire_initialize = Game_Empire.prototype.initialize;
    Game_Empire.prototype.initialize = function(name) {
        PDA.Technology.Game_Empire_initialize.call(this, name);
        this._learnedTechnologies = [];
        this._technologyProgress = {};
        this._learningTechnology = null;
    };

//=============================================================================
// Scene_Map
//=============================================================================

    PDA.Technology.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createLearningTechnologyWindow();
        this.createSelectTechnologyWindow();
        PDA.Technology.Scene_Map_createAllWindows.call(this);
    };

    PDA.Technology.Scene_Map_createMapNameWindow = Scene_Map.prototype.createMapNameWindow;
    Scene_Map.prototype.createMapNameWindow = function() {
    };

    PDA.Technology.Scene_Map_onTransferEnd = Scene_Map.prototype.onTransferEnd;
    Scene_Map.prototype.onTransferEnd = function() {
        if (this._mapNameWindow) {
            PDA.Technology.Scene_Map_onTransferEnd.call(this);
        } else {
            $gameMap.autoplay();
            if (this.shouldAutosave()) {
                this.requestAutosave();
            }
        }
    };

    PDA.Technology.Scene_Map_updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function() {
        PDA.Technology.Scene_Map_updateScene.call(this);

        this._learningTechnologyWindow.open();
        if (
            !$gameMap.empire().learningTechnology() && $gameMap.empire().scienceYield() > 0 &&
            !this._selectTechnologyWindow.active
        ) {
            this._selectTechnologyWindow.open();
        }
    };

    PDA.Technology.Scene_Map_endTurn = Scene_Map.prototype.endTurn;
    Scene_Map.prototype.endTurn = function() {
        PDA.Technology.Scene_Map_endTurn.call(this);
        $gameMap.empires().forEach(emp => emp.applyYield());
    };

    PDA.Technology.Scene_Map_isPlayerActive = Scene_Map.prototype.isPlayerActive;
    Scene_Map.prototype.isPlayerActive = function() {
        return PDA.Technology.Scene_Map_isPlayerActive.call(this) && !this._selectTechnologyWindow.active;
    };

})(); // IIFE

//=============================================================================
// Game_Empire
//=============================================================================

Game_Empire.prototype.addTechnology = function(name) {
    this._learnedTechnologies.push(name);
};

Game_Empire.prototype.applyYield = function() {
    let science = this.science() + this.scienceYield();
    const tech = this.learningTechnology();
    if (science >= this.scienceCost()) {
        science = science - this.scienceCost();
        this.addTechnology(tech.name);
        this.setLearningTechnology(null);
    }

    this.setScience(science);
};

Game_Empire.prototype.learnedTechnology = function(name) {
    if (name === "") {
        return true;
    }

    return this._learnedTechnologies.includes(name);
};

Game_Empire.prototype.learningTechnology = function() {
    return this._learningTechnology ?
        PDA.Technology.Technologies.find(tech => tech.name === this._learningTechnology) :
        null;
};

Game_Empire.prototype.setLearningTechnology = function(name) {
    this._learningTechnology = name;
};

Game_Empire.prototype.science = function() {
    return this.scienceProgress(this._learningTechnology);
};

Game_Empire.prototype.scienceProgress = function(name) {
    return this._technologyProgress[name] ?? 0;
};

Game_Empire.prototype.scienceCost = function() {
    if (this._learnedTechnologies.length === 0) {
        return 10;
    }

    const mod = [6, 8, 10, 12, 14];
    const timeMod = $gameMap.turnCount() > 200 ? 2 : 1;
    return this._learnedTechnologies.length * mod[$gameMap.difficulty()] * timeMod;
}

Game_Empire.prototype.scienceYield = function() {
    return 0;
};

Game_Empire.prototype.setScience = function(value) {
    this._technologyProgress[this._learningTechnology] = value;
};

//=============================================================================
// Scene_Map
//=============================================================================

Scene_Map.prototype.createLearningTechnologyWindow = function() {
    this._learningTechnologyWindow = new Window_LearningTechnology(this.learningTechnologyWindowRect());
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
    this._data = PDA.Technology.Technologies.filter(tech =>
        !tech.requires.some(req => !$gameMap.empire().learnedTechnology(req)) &&
        !$gameMap.empire().learnedTechnology(tech.name));
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
