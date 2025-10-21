//=============================================================================
// RPG Maker MZ - Civ Data
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Civ1 data.
 * @author Peter Dawson
 *
 * Civ1 data
 *
 * Building list from https://civilization.fandom.com/wiki/List_of_buildings_in_Civ1
 * City list from https://gamefaqs.gamespot.com/pc/564621-sid-meiers-civilization/faqs/1845. Names not updated to modern names.
 * Tech list from https://civilization.fandom.com/wiki/List_of_advances_in_Civ1
 * Unit list from https://civilization.fandom.com/wiki/List_of_units_in_Civ1
 *
 * @help py06pd_CivData.js
 */

var py06pd = py06pd || {};
py06pd.CivData = py06pd.CivData || {};

py06pd.CivData.Buildings = [
    { name: "barracks", label: "Barracks", requires: "", construct: 40, maintain: 2, buy: 160, sell: 40 },
    { name: "aqueduct", label: "Aqueduct", requires: "construction", construct: 120, maintain: 2, buy: 480, sell: 120  },
    { name: "bank", label: "Bank", requires: "banking", construct: 120, maintain: 3, buy: 480, sell: 120 },
    { name: "cathedral", label: "Cathedral", requires: "religion", construct: 160, maintain: 3, buy: 640, sell: 160 },
    { name: "walls", label: "City Walls", requires: "masonry", construct: 120, maintain: 2, buy: 480, sell: 120 },
    { name: "colosseum", label: "Colosseum", requires: "construction", construct: 100, maintain: 4, buy: 400, sell: 100 },
    { name: "courthouse", label: "Courthouse", requires: "laws", construct: 80, maintain: 1, buy: 320, sell: 80 },
    { name: "factory", label: "Factory", requires: "industry", construct: 200, maintain: 4, buy: 800, sell: 200 },
    { name: "granary", label: "Granary", requires: "pottery", construct: 60, maintain: 1, buy: 240, sell: 60 },
    { name: "hydro", label: "Hydro Plant", requires: "electronics", construct: 240, maintain: 4, buy: 960, sell: 240 },
    { name: "library", label: "Library", requires: "writing", construct: 80, maintain: 1, buy: 320, sell: 80 },
    { name: "market", label: "Marketplace", requires: "currency", construct: 80, maintain: 1, buy: 320, sell: 80 },
    { name: "transit", label: "Mass Transit", requires: "mass", construct: 160, maintain: 4, buy: 640, sell: 160 },
    { name: "mfg", label: "Mfg. Plant", requires: "robotics", construct: 320, maintain: 6, buy: 1280, sell: 320 },
    { name: "nuclear", label: "Nuclear Plant", requires: "nuclear", construct: 160, maintain: 2, buy: 640, sell: 160 },
    { name: "palace", label: "Palace", requires: "masonry", construct: 200, maintain: 0, buy: 800, sell: 200 },
    { name: "power", label: "Power Plant", requires: "refining", construct: 160, maintain: 4, buy: 640, sell: 160 },
    { name: "recycling", label: "Recycling Centre", requires: "recycling", construct: 200, maintain: 2, buy: 800, sell: 200 },
    { name: "sdi", label: "SDI Defense", requires: "superconductor", construct: 200, maintain: 4, buy: 800, sell: 200 },
    { name: "temple", label: "Temple", requires: "burial", construct: 40, maintain: 1, buy: 160, sell: 40 },
    { name: "university", label: "University", requires: "university", construct: 160, maintain: 3, buy: 640, sell: 160 },
    { name: "apollo", label: "Apollo Program", requires: "space", construct: 600, wonder: true },
    { name: "colossus", label: "Colossus", requires: "bronze", construct: 200, wonder: true },
    { name: "copernicus", label: "Copernicus' Observatory", requires: "astronomy", construct: 300, wonder: true },
    { name: "cancer", label: "Cure for Cancer", requires: "genetics", construct: 600, wonder: true },
    { name: "darwon", label: "Darwin's Voyage", requires: "railroad", construct: 300, wonder: true },
    { name: "glibrary", label: "Great Library", requires: "literacy", construct: 300, wonder: true },
    { name: "gwall", label: "Great Wall", requires: "masonry", construct: 300, wonder: true },
    { name: "gardens", label: "Hanging Gardens", requires: "pottery", construct: 300, wonder: true },
    { name: "hoover", label: "Hoover Dam", requires: "electronics", construct: 600, wonder: true },
    { name: "newton", label: "Isaac Newton's College", requires: "gravity", construct: 400, wonder: true },
    { name: "bach", label: "J.S. Bach's Cathedral", requires: "religion", construct: 400, wonder: true },
    { name: "lighthouse", label: "Great Lighthouse", requires: "maps", construct: 200, wonder: true },
    { name: "magellan", label: "Magellan's Expedition", requires: "navigation", construct: 400, wonder: true },
    { name: "manhattan", label: "Manhattan Project", requires: "fission", construct: 600, wonder: true },
    { name: "michelangelo", label: "Michelangelo's Chapel", requires: "religion", construct: 300, wonder: true },
    { name: "oracle", label: "Oracle", requires: "mysticism", construct: 300, wonder: true },
    { name: "pyramids", label: "Great Pyramid", requires: "masonry", construct: 300, wonder: true },
    { name: "seti", label: "SETI Program", requires: "computers", construct: 600, wonder: true },
    { name: "globe", label: "Globe Theatre", requires: "medicine", construct: 400, wonder: true },
    { name: "united", label: "United Nations", requires: "communism", construct: 600, wonder: true },
    { name: "suffrage", label: "Women's Suffrage", requires: "industry", construct: 600, wonder: true }
];

py06pd.CivData.Empires = [
    {
        name: "roman",
        label: "Roman",
        cityNames: ["Rome", "Caesarea", "Carthage", "Nicopolis", "Byzantium", "Brundisium", "Syracuse", "Antioch", "Palmyra", "Cyrene", "Gordion", "Tyrus", "Jerusalem", "Seleucia", "Ravenna", "Artaxata"]
    },
    {
        name: "babylonian",
        label: "Babylonian",
        cityNames: ["Babylon", "Sumer", "Uruk", "Ninevah", "Ashur", "Ellipi", "Akkad", "Eridu", "Kish", "Nippur", "Shuruppak", "Zariqum", "Izibia", "Nimrud", "Arbela", "Zamua"]
    },
    {
        name: "german",
        label: "German",
        cityNames: ["Berlin", "Leipzig", "Hamburg", "Bremen", "Frankfurt", "Bonn", "Nuremburg", "Cologne", "Hannover", "Munich", "Stuttgart", "Heidelburg", "Salzburg", "Konigsberg", "Dortmond", "Brandenburg"]
    },
    {
        name: "egyptian",
        label: "Egyptian",
        cityNames: ["Thebes", "Memphis", "Oryx", "Heliopolis", "Gaza", "Alexandria", "Byblos", "Cairo", "Coptos", "Edfu", "Pithom", "Busirus", "Athribus", "Mendes", "Tanis", "Abydos"],
    },
    {
        name: "american",
        label: "American",
        cityNames: ["Washington", "New York", "Boston", "Philedelphia", "Atlanta", "Chicago", "Buffalo", "St. Louis", "Detroit", "New Orleans", "Baltimore", "Denver", "Cincinnati", "Dallas", "Los Angeles", "Las Vegas"],
    },
    {
        name: "greek",
        label: "Greek",
        cityNames: ["Athens", "Sparta", "Corinth", "Delphi", "Eretria", "Pharsalos", "Argos", "Mycenae", "Herakleia", "Antioch", "Ephesos", "Rhodes", "Knossos", "Troy", "Pergamon", "Miletos"],
    },
    {
        name: "indian",
        label: "Indian",
        cityNames: ["Delhi", "Bombay", "Madras", "Bangalore", "Calcutta", "Lahore", "Karachi", "Kolhapur", "Jaipur", "Hyderbad", "Bengal", "Chittagong", "Punjab", "Dacca", "Indus", "Ganges"],
    },
    {
        name: "russian",
        label: "Russian",
        cityNames: ["Moscow", "Leningrad", "Kiev", "Minsk", "Smolensk", "Odessa", "Sevastopol", "Tblisi", "Sverdlovsk", "Yakutsk", "Vladivostok", "Novograd", "Krasnoyarsk", "Riga", "Rostov", "Astrakhan"]
    },
    {
        name: "zulu",
        label: "Zulu",
        cityNames: ["Zimbabwe", "Ulundi", "Bapedi", "Hlobane", "Isandhlwana", "Intombe", "Mpondo", "Ngome", "Swazi", "Tugela", "Umtata", "Umfolozi", "Ibabanago", "Isipezi", "Amatikulu", "Zunquin"]
    },
    {
        name: "french",
        label: "French",
        cityNames: ["Paris", "Orleans", "Lyons", "Tours", "Chartres", "Bordeaux", "Rouen", "Avignon", "Marseilles", "Grenoble", "Dijon", "Amiens", "Cherbourg", "Poitiers", "Toulouse", "Bayonne"]
    },
    {
        name: "aztec",
        label: "Aztec",
        cityNames: ["Tenochtitlan", "Chiauhtia", "Chapultepec", "Coatepec", "Ayotzinco", "Itzapalapa", "Iztapam", "Mitxcoac", "Tucubaya", "Tecamac", "Tepezinco", "Ticoman", "Tlaxcala", "Xaltocan", "Xicalango", "Zumpanco"]
    },
    {
        name: "chinese",
        label: "Chinese",
        cityNames: ["Peking", "Shanghai", "Canton", "Nanking", "Tsingtao", "Hangchow", "Tientsin", "Tatung", "Macao", "Anyang", "Shantung", "Chinan", "Kaifeng", "Ningpo", "Paoting", "Yangchow"]
    },
    {
        name: "english",
        label: "English",
        cityNames: ["London", "Coventry", "Birmingham", "Dover", "Nottingham", "York", "Liverpool", "Brighton", "Oxford", "Reading", "Exeter", "Cambridge", "Hastings", "Canterbury", "Banbury", "Newcastle"]
    },
    {
        name: "mongol",
        label: "Mongol",
        cityNames: ["Samarkand", "Bokhara", "Nishapur", "Karakorum", "Kashgar", "Tabriz", "Aleppo", "Kabul", "Ormuz", "Basra", "Khanbalyk", "Khorasan", "Shangtu", "Kazan", "Quinsay", "Kerman"]
    }
];

py06pd.CivData.Technologies = [
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

py06pd.CivData.Tiles = {
    arctic: { defence: 2, food: 0, moveCost: 2, production: 0, resource: "seal", trade: 0, resourceFood: 2, resourceProduction: 0, resourceTrade: 0 },
    desert: { defence: 2, food: 0, moveCost: 1, production: 1, resource: "oasis", trade: 0, resourceFood: 3, resourceProduction: 0, resourceTrade: 0 },
    forest: { defence: 3, food: 1, moveCost: 2, production: 2, resource: "game1", trade: 0, resourceFood: 2, resourceProduction: 0, resourceTrade: 0 },
    grassland: { defence: 2, food: 2, moveCost: 1, production: 0, resource: "shield", trade: 0, resourceFood: 0, resourceProduction: 1, resourceTrade: 0 },
    hill: { defence: 4, food: 1, moveCost: 2, production: 0, resource: "coal", trade: 0, resourceFood: 0, resourceProduction: 2, resourceTrade: 0 },
    jungle: { defence: 3, food: 1, moveCost: 2, production: 0, resource: "gem", trade: 0, resourceFood: 0, resourceProduction: 0, resourceTrade: 4 },
    mountain: { defence: 6, food: 0, moveCost: 3, production: 1, resource: "gold", trade: 0, resourceFood: 0, resourceProduction: 0, resourceTrade: 6 },
    ocean: { defence: 2, food: 1, moveCost: 1, production: 0, resource: "fish", trade: 0, resourceFood: 2, resourceProduction: 0, resourceTrade: 0 },
    plains: { defence: 2, food: 1, moveCost: 1, production: 1, resource: "horse", trade: 0, resourceFood: 0, resourceProduction: 2, resourceTrade: 0 },
    river: { defence: 3, food: 2, moveCost: 1, production: 0, resource: "shield", trade: 0, resourceFood: 0, resourceProduction: 1, resourceTrade: 0 },
    riverMouth: { defence: 2, food: 1, moveCost: 1, production: 0, resource: "fish", trade: 0, resourceFood: 2, resourceProduction: 0, resourceTrade: 0 },
    swamp: { defence: 3, food: ``, moveCost: 2, production: 0, resource: "oil", trade: 0 , resourceFood: 0, resourceProduction: 4, resourceTrade: 0 },
    tundra: { defence: 2, food: 1, moveCost: 1, production: 0, resource: "game2", trade: 0, resourceFood: 3, resourceProduction: 0, resourceTrade: 0 }
};

py06pd.CivData.Units = [
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
