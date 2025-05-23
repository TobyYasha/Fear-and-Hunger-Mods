//==========================================================
	// TY_FnH_ModLoader.js -- Author: Toby Yasha
//==========================================================

//==========================================================
	// Global Variables
//==========================================================

var TY = TY || {};
TY.Utils = TY.Utils || {};
TY.Alias = TY.Alias || {};
TY.Scope = TY.Scope || {};

// TY:
// The namespace used by Toby Yasha for his mods.

// TY.Utils:
// Global object which stores utility methods

// TY.Alias:
// Global object storing aliased methods used for modifying RPG Maker methods.

// TY.Scope:
// Global object storing mod methods and data, used for declaring mods

//==========================================================
	// Mod Parameters
//==========================================================

// TY.ModLoader = TY.ModLoader || {};
// TY.ModLoader.ModList = [];
// TY.ModLoader.ModPath = "mods/";
// TY.ModLoader.ModTerm = "Mods";
// TY.ModLoader.ModInfo = {}; // Nothing, this will be removed and converted to JSON format, see bottom of this file for more details.
// TY.ModLoader.MOD_LIST = [];

// Note: Consider adding the Screen Freeze Fix in a QoL mod Graphics.render if (this._skipCount <= 0) {
// Note: Consider adding a fix for the F&H1 enemy cursor in battle not moving if hovering the enemy with your mouse.
// Note: Consider adding a fix for bitmap snapping for menu background(sometimes it crashes, see more info in the F&H Discord)


// Note: Some users are trying to enter the game via index.html instead of game.exe, leaving this here so i don't forget the cause of the following errors:
// F&H:         Failed to load: data/Actors.json
// F&H Termina: Failed to load: img/SumRndmDde/menu/menu.png


// Mechanic idea for F&H 1:
// Cave mother soul or Crow mauler soul
// Guarantee 1 crit per battle on first hit, but the critical damage is reduced to x2 instead of x3(Thanks Jaspie) <- Cavemother soul
// Guarantee 1 crit per battle on first hit <- Crowmauler soul

// Mechanic idea for F&H (Maybe not the greatest idea since if you were to break the legs the head becomes vulnerable aka you won the battle)
// Chopping enemy legs increases running chance by a % (will involve reworking the running mechanic and accounting for escape plan).
// 40%(base amount) + 15%(per leg max 30% or divided equally between all enemy legs)
// escape plan adds another 30% to the base amount
// FORMULA: 40% + 30% + 30%

// Mechanic idea for F&H:
// Make DoTs scale based on formulas and with a stack limit

TY.Scope.modLoader = TY.Scope.modLoader || {};
TY.Scope.modLoader.MOD_LIST = [];
TY.Scope.modLoader.MOD_PATH = "mods/";
TY.Scope.modLoader.MOD_TERM = "Mods";
TY.Scope.modLoader.MOD_INFO = { // check line 360 and below for more comments
	name: "Fear & Hunger - Mod Loader",
	author: "Toby Yasha",
	version: "1.0.0",
	description: `
		A mod loader which can be used to add
		modded content to the Fear & Hunger games.
	`,
	key: "modLoader", 
	compatibility: "fnh-any",
	dependencies: [],
	status: false
}

// debug only
TY.Scope.modLoader.MOD_LIST.push(TY.Scope.modLoader.MOD_INFO);

// TY.Scope.modLoader:
// Declares a mod in the "TY.Scope" object.

// TY.Scope.modLoader.MOD_LIST: 
// Array to store mods for in-game loading.

// TY.Scope.modLoader.MOD_PATH:
// Folder path for storing and loading mods, and mod configurations.

// TY.Scope.modLoader.MOD_TERM:
// String representing the "Mods" command on the title scene.

// TY.Scope.modLoader.MOD_INFO:
// Object containing mod information data.
// Properties: [name, author, version, description] (optional).

// Properties: [key, compatibility, dependencies, loaded].

// key: Quick access string for the mod's scope in TY.Scope.
// Used for dependencies in the "dependencies" array.

// compatibility: String indicating the intended game version (e.g., "fnh-any", "fnh-1", "fnh-2").
// Used to check if a mod should be loaded based on the game version.

// dependencies: Array of mods required for the mod to function.

// status: Indicates if the mod has loaded successfully.
// We use this to avoid executing the entire mod's code; we just fetch its global "MOD_INFO."

//==========================================================
	// Utility Methods
//==========================================================

// Checks if the user is using MattieFM's Mod Manager 
TY.Utils.isMattieModManager = function() {
	return typeof MATTIE_ModManager !== "undefined";
}

// Checks if the current game version is termina or not
TY.Utils.isGameTermina = function() {
	return $dataSystem.gameTitle.includes("TERMINA");
}

TY.Utils.isModCompatible = function(mod) {
	// if mod compatible with any f&h version return true
	// if game is fnh 1 and trying to load termina mod return false
	// if game is termina and trying to load fnh 1 mod return false
}

//==========================================================
	// Game_Switches
//==========================================================

// You can add parameters like this to the invincibility mod.
// All you'll need to do is add a way to configure the mod(even in-game).
// And have methods for each parameter which is linked to the configuration.
// "Allow Limb Loss"
// "Instant Rev Refill"

// Make sure we have an array to store locked switches
TY.Alias.Game_Switches_clear = (
	Game_Switches.prototype.clear;
)
Game_Switches.prototype.clear = function() {
    TY.Alias.Game_Switches_clear.call(this);
	this._lockedData = [];
};

// Check if a switch is currently locked
Game_Switches.prototype.isLocked = function(switchId) {
    return this._lockedData.includes(switchId);
};

// Locks a switch, preventing its value from changing.
// Unlocks a locked switch, allowing for its value to be changed.
Game_Switches.prototype.setLock = function(switchId, isLocking) {
	if (!this.isLocked(switchId) && isLocking) {
		this._lockedData.push(switchId);
	} else if (this.isLocked(switchId) && !isLocking) {
		this._lockedData.remove(switchId);
	}
};

// Checks if the switch is locked before changing its value
TY.Alias.Game_Switches_setValue = (
	Game_Switches.prototype.setValue;
)
Game_Switches.prototype.setValue = function(switchId, value) {
    if (!this.isLocked(switchId)) {
		TY.Alias.Game_Switches_setValue.call(this, switchId, value);
	}
};

// $gameSwitches.setLock(7, true);

//==========================================================
	// Game_Variables
//==========================================================

// Make sure we have an array to store locked variables
TY.Alias.Game_Variables_clear = (
	Game_Switches.prototype.clear;
)
Game_Variables.prototype.clear = function() {
    TY.Alias.Game_Variables_clear.call(this);
	this._lockedData = [];
};

// Check if a variable is currently locked
Game_Variables.prototype.isLocked = function(variableId) {
    return this._lockedData.includes(variableId);
};

// Locks a variable, preventing its value from changing.
// Unlocks a locked variable, allowing for its value to be changed.
Game_Variables.prototype.setLock = function(variableId, isLocking) {
	if (!this.isLocked(variableId) && isLocking) {
		this._lockedData.push(variableId);
	} else if (this.isLocked(variableId) && !isLocking) {
		this._lockedData.remove(variableId);
	}
};

// Checks if the variable is locked before changing its value
TY.Alias.Game_Variables_setValue = (
	Game_Variables.prototype.setValue
)
Game_Variables.prototype.setValue = function(variableId, value) {
    if (!this.isLocked(variableId)) {
		TY.Alias.Game_Variables_setValue.call(this, variableId, value);
	}
};

// $gameVariables.setLock(7, true);

//==========================================================
	// Window_TitleCommand
//==========================================================

TY.Alias.Window_TitleCommand_makeCommandList = (
	Window_TitleCommand.prototype.makeCommandList;
)
Window_TitleCommand.prototype.makeCommandList = function() {
	TY.Alias.Window_TitleCommand_makeCommandList.call(this);
	this.addModsCommand();
};

Window_TitleCommand.prototype.addModsCommand = function() {
	if (!TY.Utils.isMattieModManager()) {
		this.addCommand(TY.Scope.modLoader.MOD_TERM, "mods");
	}
};

//==========================================================
	// Scene_Title
//==========================================================

TY.Alias.Scene_Title_createCommandWindow = (
	Scene_Title.prototype.createCommandWindow;
)
Scene_Title.prototype.createCommandWindow = function() {
	TY.Alias.Scene_Title_createCommandWindow.call(this);
	this.addModsCommand();
};

Scene_Title.prototype.addModsCommand = function() {
	if (!TY.Utils.isMattieModManager()) {
		this._commandWindow.setHandler("mods", this.commandMods.bind(this));
	}
};

Scene_Title.prototype.commandMods = function() {
	// [Note] May or not leave this as a window,
	//	initially i was planning of using a separate scene for this.
	this._modWindow = new TY.Scope.modLoader.interface();
	this.addWindow(this._modWindow);
};

//==========================================================
	// Mod Interface
//==========================================================

// window hierarchy
// lobby -- [commands] configure mods, load mods, settings, close
	// configure mods -> configure mods interface
	// load mods      -> initializes the mod loading process(accept / decline)
	// settings		  -> configure stuff such as auto-mod loading?(
	//	actually since you can just configure which mods to load...
	//  i'll need to do some tests regarding what happens if you get an error
	//  from a mod with "auto-loading" on.
	//)

// Creates a mod manager interface similar to MattieFM's.
// [Note] Due to compatibility reasons and the fact that
// MattieFM's mod manager interface is way better we only
// allow this interface only if not using MattieFM's.

// 11/11/2023 - 6:40 PM
// First you need to integrate mod configuration options
// before ensuring compatibility.

TY.Scope.modLoader.interface = function() {
    this.initialize(...arguments);
}

TY.Scope.modLoader.interface.prototype = Object.create(Window_Command.prototype);
TY.Scope.modLoader.interface.prototype.constructor = TY.Scope.modLoader.interface;

TY.Scope.modLoader.interface.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 50, 50);
}

// We basically offset the cursor by 1 index with "this.lineHeight()".
TY.Scope.modLoader.interface.prototype.itemY = function(index) {
    return Math.floor(index / this.maxCols()) * this.itemHeight() + this.lineHeight();
};

// Then we make sure that it doesn't go beyond the limit of "maxPageRows".
TY.Scope.modLoader.interface.prototype.itemRect = function(index) {
	const rect = Window_Command.prototype.itemRect.call(this, index);
    rect.y = Math.min(this.itemY(index), this.lineHeight() * this.maxPageRows());
	return rect;
};

TY.Scope.modLoader.interface.prototype.maxItems = function() {
    return 20; // we can base this off of TY.Scope.modLoader.MOD_LIST.length;
};

TY.Scope.modLoader.interface.prototype.maxPageRows = function() {
    return 10;
};

TY.Scope.modLoader.interface.prototype.windowWidth = function() {
    return Graphics.boxWidth - 100;
};

TY.Scope.modLoader.interface.prototype.windowHeight = function() {
    return Graphics.boxHeight - 100;
};

TY.Scope.modLoader.interface.prototype.processOk = function() {
    Window_Command.prototype.processOk.call(this);
	console.log(`Current mod index is ${this.index()}`);
};

TY.Scope.modLoader.interface.prototype.drawTitle = function() {
	this.contents.fontSize = 32;
	this.drawText("Mod Loader", 0, 0, 700, "center"); // draw in the top middle
};

// [Note] This is way better than using drawItem
// [Note] For now this will be left in 1 method until i can better
// figure out how i want everything to work but so far this is promising.
TY.Scope.modLoader.interface.prototype.drawAllItems = function() {
	this.createContents(); // remove all text so it doesn't overlap
	this.contents.fontSize = 21;
	const startIndex = this.topIndex() + 1;
	for (let i = 0; i < 10; i++) {
		const yOffset = this.itemHeight() * (i + 1);
		// this.textWidth(text);
		this.drawText(`${startIndex + i}. Fear & Hunger - Mod Loader`, 10, yOffset, 700, "left");
		this.drawText("Status:", 540, yOffset, 700, "left");
		if (Math.random() < 0.5) { // simulate a list of mods
			//this.changeTextColor(this.textColor(3));
			//this.changeTextColor("#baeb34");
			this.changeTextColor("#26b5fc"); // blue
			this.drawText("ON", 602, yOffset, 700, "left");
		} else {
			//this.changeTextColor(this.textColor(10));
			//this.changeTextColor("#eb8034");
			this.changeTextColor("#fc5126"); // orange
			this.drawText("OFF", 602, yOffset, 700, "left");
		}
		this.resetTextColor();
	}
	//
	this.drawTitle();
	//
};

//==========================================================
	// Mod Scene
//==========================================================

TY.Scope.modLoader.scene = function() {
    this.initialize(...arguments);
}

TY.Scope.modLoader.scene.prototype = Object.create(Scene_Base.prototype);
TY.Scope.modLoader.scene.prototype.constructor = TY.Scope.modLoader.scene;

TY.Scope.modLoader.scene.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
}

TY.Scope.modLoader.scene.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
}

// have the mod loader run in 2 different loading modes
// direct mode - compatibility mode
// 
// Direct Mode ->
// Checks out each file for 

// [1/15/2024] -> 
// What stops you from having metadata inside the mod itself (ex: version, description)
// And what stops you from using the json as a way to tell which mods to load and stuff?

// Actually maybe it's just better to use a JSON approach similar to MATTIE + this way we ensure better compatibility.
// P.S for compatibility reasons you should add the mod loader as a dependency to the mods(although we ignore this if we load it in our way).
/*{
	"name": "modLoader",
    "status": false,
	"danger": false,
	"parameters": {},
	"dependencies": [ // path inside "mods" folder
        "_multiplayer/peerjs.min",
	]
}*/


// Separate the mod loader into 2, the main mod loader file and mod utils file
// Ensure better compatibility with MattieFM's Mod Manager

// [4/19/2025] ->
// I think it would be better if you don't create an overly complex Mod Loading system.
// Reason being, if orange wants to add the mod to the game, it will be much harder for him to do so.
// All i really want is to have customizeable parameters in-game for the mods. That's all.
// And a way to manually load the mods in-game. That's all.

// [4/26/2025] ->
/* 
* And so these are not really needed if i don't want to create dependencies between the mod files and mod loader
* TY.Utils = TY.Utils || {}; // This could be rarely used if i want to add some utility methods (like checking if the game is F&H 1 or F&H 2)
* TY.Alias = TY.Alias || {}; // Don't store aliases in a global object
* TY.Scope = TY.Scope || {}; // Might be better named TY.modsData or something like that.
* Example:
*
* TY = TY || {};
* TY.modsData = TY.modsData || {};
* TY.modsData.quickSave = {
*   key: "quickSave",
*   name: "Quick Save",
*   desc: "This is an example",
*   version: "1.0.0",
*   scope: TY.MOD_SCOPE_FNH_1,
* };
* 
*/

/* Managing mod activation / deactivation in live game
* const key = TY.modsData.quickSave.key;
* TY.modsImported = TY.modsImported || [];
* TY.modsImported.push({ key, status: true });
*
* NOTE: You could even have methods for this, like so:
*
* TY.Utils.setModStatus = function(key, newStatus) {
*  if (TY.modsImported[key]) { 
*    TY.modsImported[key].status = newStatus; 
*  }
* 
*/
