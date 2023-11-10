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

// don't forget to add the global variables to all mods
// if TY.Scope.modLoader is non existent throw an error

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
	version: "2.0.0",
	description: `
		A mod loader which can be used to add
		modded content to the Fear & Hunger games.
	`,
	compatibility: "fnh-any",
	dependencies: [],
	loaded: true
}

// dependencies: ["modLoader",] this is the format
// compatibility: "fnh-any", "fnh-1", "fnh-2"
//
// if a mod does not have info still allow it but
// consider it a "SecurityError".
//
// at most dependencies are important but i'm sure
// most unsafe mods won't really need those.
//
// default value should always be false "loaded: true"

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
	this._modWindow = new TY.Scope.modLoader.interface();
	this.addWindow(this._modWindow);
};

//==========================================================
	// Mod Interface
//==========================================================

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
