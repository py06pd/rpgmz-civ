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
    { name: 'irrigation', label: 'Irrigation', requires: [] },
    { name: 'mining', label: 'Mining', requires: [] },
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
        this._learningTechnology = "";
    };

//=============================================================================
// Scene_CivSetup
//=============================================================================

    PDA.Technology.Scene_CivSetup_setupGame = Scene_CivSetup.prototype.setupGame;
    Scene_CivSetup.prototype.setupGame = function() {
        PDA.Technology.Scene_CivSetup_setupGame.call(this);
        $gameMap.empire().setLearningTechnology($gameMap.empire().canLearn()[0].name);
    };

//=============================================================================
// Scene_Map
//=============================================================================

    PDA.Technology.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createLearningTechnologyWindow();
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
    };

    PDA.Technology.Scene_Map_endTurn = Scene_Map.prototype.endTurn;
    Scene_Map.prototype.endTurn = function() {
        PDA.Technology.Scene_Map_endTurn.call(this);
        $gameMap.empires().forEach(emp => emp.applyYield());
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

        this.setLearningTechnology(this.canLearn()[0].name);
    }

    this.setScience(science);
};

Game_Empire.prototype.canLearn = function() {
    return PDA.Technology.Technologies.filter(tech =>
        !tech.requires.some(req => !this.learnedTechnology(req)) &&
        !this.learnedTechnology(tech.name));
};

Game_Empire.prototype.learnedTechnology = function(name) {
    if (name === "") {
        return true;
    }

    return this._learnedTechnologies.includes(name);
};

Game_Empire.prototype.learningTechnology = function() {
    return PDA.Technology.Technologies.find(tech => tech.name === this._learningTechnology);
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

//=============================================================================
// Window_TurnCount
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
