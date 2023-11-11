//==========================================================
	// TY_ModLoader.js -- Author: Toby Yasha
//==========================================================

//==========================================================
	// Global Variables
//==========================================================

var TY = TY || {};
TY.Utils = TY.Utils || {};
TY.Alias = TY.Alias || {};
TY.Scope = TY.Scope || {};

//==========================================================
	// Mod Parameters
//==========================================================

TY.Scope.modLoader = TY.Scope.modLoader || {};
TY.Scope.modLoader.MOD_LIST = [];
TY.Scope.modLoader.MOD_PATH = "mods/";
TY.Scope.modLoader.MOD_TERM = "Mods";
TY.Scope.modLoader.MOD_INFO = {
	name: "Fear & Hunger - Mod Loader",
	author: "Toby Yasha",
	version: "1.0.0",
	description: `
		A mod loader which can be used to add
		modded content to the Fear & Hunger games.
	`,
	compatibility: "fnh-any",
	dependencies: [],
	loaded: false
}

// TY.Scope.modLoader.MOD_LIST -> 
// The array which will be used to store the mods to be loaded in-game.

// TY.Scope.modLoader.MOD_PATH ->
// The folder path where mods are stored and loaded from.
// The mods folder may additionally be used to store mod configurations.

// TY.Scope.modLoader.MOD_TERM ->
// The string used to represent the "Mods" command on the title scene.

// TY.Scope.modLoader.MOD_INFO ->
// The object containing the information data of a mod.
// [name, author, version, description] ->
// These properties not mandatory and only used to differentiate the mods from one another.

// [compatibility, dependencies, loaded] ->
// These properties are actually very important and i will explain them below.

// dependencies: ["modLoader",] ->
// This is an array which can be configured to include the mods required for a mod to function.

// compatibility: "fnh-any", "fnh-1", "fnh-2" ->
// This is a string which determines the intended game a mod was made for,
// it can be used to check whether or not a mod should be loaded depending on the game you are playing.



// if a mod does not have info still allow it but
// consider it a "SecurityError".
//
// at most dependencies are important but i'm sure
// most unsafe mods won't really need those.
//
// default value should always be false "loaded: true"
// While the modloader itself won't be loaded into the
// game as a mod i still think it deserves a mod info section.

//==========================================================
	// Utility Methods
//==========================================================

TY.Utils.isMattieModManager = function() {
	return typeof MATTIE_ModManager !== "undefined";
}

TY.Utils.isGameTermina = function() {
	return $dataSystem.gameTitle.includes("TERMINA");
}

TY.Utils.isModCompatible = function(mod) {
	// if mod compatible with any f&h version return true
	// if game is fnh 1 and trying to load termina mod return false
	// if game is termina and trying to load fnh 1 mod return false
}

// Alternatively you can wrap the code with TY.Utils.isMattieModManager here

//==========================================================
	// Game_Switches
//==========================================================

// Make sure we have an array to store locked switches
TY.Alias.switchClear = Game_Switches.prototype.clear;
Game_Switches.prototype.clear = function() {
    TY.Alias.switchClear.call(this);
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
TY.Alias.switchSetValue = Game_Switches.prototype.setValue;
Game_Switches.prototype.setValue = function(switchId, value) {
    if (!this.isLocked(switchId)) {
		TY.Alias.switchSetValue.call(this, switchId, value);
	}
};

// $gameSwitches.setLock(7, true);

//==========================================================
	// Game_Variables
//==========================================================

// Make sure we have an array to store locked variables
TY.Alias.variableClear = Game_Switches.prototype.clear;
Game_Variables.prototype.clear = function() {
    TY.Alias.variableClear.call(this);
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
TY.Alias.variableSetValue = Game_Switches.prototype.setValue;
Game_Variables.prototype.setValue = function(variableId, value) {
    if (!this.isLocked(variableId)) {
		TY.Alias.variableSetValue.call(this, variableId, value);
	}
};

// $gameVariables.setLock(7, true);

//==========================================================
	// Window_TitleCommand
//==========================================================

TY.Alias.makeCommandList = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function() {
	TY.Alias.makeCommandList.call(this);
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

TY.Alias.createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
	TY.Alias.createCommandWindow.call(this);
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

TY.Scope.modLoader.interface.prototype.itemRect = function(index) {
    const rect = new Rectangle();
    const maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    rect.y = Math.min((Math.floor(index / maxCols) * rect.height) + this.lineHeight(), this.lineHeight() * 10); // [Note] please improve or store this somewhere else
    return rect;
};

TY.Scope.modLoader.interface.prototype.maxItems = function() {
    return 20; // we can base this off of TY.Scope.modLoader.MOD_LIST.length;
};

TY.Scope.modLoader.interface.prototype.maxPageRows = function() {
    return 11;
};

TY.Scope.modLoader.interface.prototype.windowWidth = function() {
    return Graphics.boxWidth - 100;
};

TY.Scope.modLoader.interface.prototype.windowHeight = function() {
    return Graphics.boxHeight - 100;
};

TY.Scope.modLoader.interface.prototype.drawItem = function(index) {
	this.contents.fontSize = 21;
	this.drawText(`${index+1}. Fear & Hunger - Mod Loader      Author: Toby Yasha      Status: OFF`, 10, this.itemHeight() * (index % 11), 700, "left");
	//this.drawText(`${index+1}. Fear & Hunger - Mod Loader      Author: Toby Yasha      Status: OFF`, 10, this.itemHeight() * (index % 11), 700, "left");
	//this.drawText(`${index+1}. Fear & Hunger - Mod Loader      Author: Toby Yasha      Status: OFF`, 10, this.itemHeight() * ((index + 1) % 11), 700, "left");
	//this.drawText(`${index+1}. Fear & Hunger - Mod Loader      Author: Toby Yasha      Status: OFF`, 10, this.itemHeight() * Math.min(index, 11), 700, "left");
};

// maybe just overwrite "drawAllItems" so it draws max items - current index

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
