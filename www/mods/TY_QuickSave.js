//=============================================================================
/*:
 * @plugindesc v1.0 A system which handles temporary saves.
 * @author Toby Yasha
 *
 * @param General Configurations
 *
 * @param Quick Load Text
 * @parent General Configurations
 * @desc The text used for the 'Quick Load' command on the title screen.
 * @default Quick Load
 *
 * @param To Desktop Text
 * @parent General Configurations
 * @desc The text used for the 'To Desktop' command on the game quit menu.
 * @default To Desktop
 *
 * @param Quick Save Variable
 * @parent General Configurations
 * @type variable
 * @desc The variable which will store the quick save data.
 * @default 0
 *
 * @param Quick Save Time
 * @parent General Configurations
 * @type number
 * @desc The time in minutes before a new save can be made again.
 * This is only considered if a Quick Save has been loaded.
 * @default 5
 * @min 0
 *
 * @param Window Configurations
 *
 * @param Game Save Text
 * @parent Window Configurations
 * @desc The text used for when that the game has been saved.
 * @default Game Saved!
 *
 * @param Fail Save Text
 * @parent Window Configurations
 * @desc The text used for when that the game hasn't been saved.
 * Use 'SAVETIME' to reference the time until the next save.
 * @default Time Left: SAVETIME Minutes!
 *
 * @param Save Text Fade
 * @parent Window Configurations
 * @desc How fast the 'Game Save Text' appears/disappears.
 * @default 16
 *
 * @param Save Text Duration
 * @parent Window Configurations
 * @desc How long the 'Game Save Text' will stay before disappearing.
 * @default 120
 *
 * @param Window Duration
 * @parent Window Configurations
 * @desc How long the window with the text will stay open before disappearing.
 * @default 32
 *
 * @help
 *
 * VERY IMPORTANT!
 * This plugin requires the Olivia_MetaControls plugin in order to function!
 * Must be placed anywhere below Olivia_MetaControls.
 * 
 * The variable which will store the Quick Save data
 * must contain <Global Meta> in its name.
 * Example: <Global Meta> My Variable 1
 * 
 * As a bonus you can now close game from the last command inside the game's menu.
 * 
 * 
*/

var TY = TY || {};
TY.Utils = TY.Utils || {};
TY.Param = TY.Param || {};
TY.Parameters = PluginManager.parameters("TY_QuickSave");

TY.Param.QuickLoadText = TY.Parameters["Quick Load Text"];
TY.Param.ToDesktopText = TY.Parameters["To Desktop Text"];
TY.Param.SaveVariableId = Number(TY.Parameters["Quick Save Variable"]);
TY.Param.GameSaveText = TY.Parameters["Game Save Text"];
TY.Param.FailSaveText = TY.Parameters["Fail Save Text"];
TY.Param.TextFadeSpeed = Number(TY.Parameters["Save Text Fade"]);
TY.Param.TextDuration = Number(TY.Parameters["Save Text Duration"]);
TY.Param.WindowDuration = Number(TY.Parameters["Window Duration"]);

TY.Utils.SaveTimer = 0;
TY.Utils.HasSaveLoaded = false;
TY.Param.QuickSaveTime = Number(TY.Parameters["Quick Save Time"]);

//==========================================================
	// SceneManager -- 
//==========================================================

SceneManager.updateSaveTimer = function() {
	var sceneName = this._scene.constructor.name;
	var isSaveAllowed = DataManager.canCreateQuickSave();
	if (!isSaveAllowed && sceneName == 'Scene_Map') {
		TY.Utils.SaveTimer++;
	} else if (isSaveAllowed) {
		TY.Utils.HasSaveLoaded = false;
	}
};

var TY_RenderScene = SceneManager.renderScene;
SceneManager.renderScene = function() {
	TY_RenderScene.call(this); 
	var hasSaveLoaded = TY.Utils.HasSaveLoaded;
	if (this.isCurrentSceneStarted() && hasSaveLoaded) {
		this.updateSaveTimer();
	}
};

//==========================================================
	// DataManager -- 
//==========================================================

DataManager.getSaveTime = function() {
	var time = Math.floor(TY.Utils.SaveTimer / 60);
	return TY.Param.QuickSaveTime - Math.floor(time / 60) % 60;
};

DataManager.canCreateQuickSave = function() {
	var hasSaveLoaded = TY.Utils.HasSaveLoaded;
	if (hasSaveLoaded) {
		var timeLeft = this.getSaveTime();
		return timeLeft <= 0;
	} else {
		return true
	}
};

DataManager.hasQuickSaveData = function() {
	return !!this.getQuickSaveData();
};

DataManager.getQuickSaveData = function() {
	var variableId = TY.Param.SaveVariableId;
	var saveData = $gameVariables.value(variableId);
	return saveData;
};
	
/*DataManager.makeQuickSave = function() {
	var variableId = TY.Param.SaveVariableId;
	if (variableId > 0) {
		$gameVariables.setValue(variableId, 0);
		var saveData = DataManager.makeSaveContents();
		var compressedData = JsonEx.stringify(saveData);
		$gameVariables.setValue(variableId, compressedData);
	}
};*/

DataManager.makeQuickSave = function() {
	var variableId = TY.Param.SaveVariableId;
	if (variableId > 0) {
		$gameVariables.setValue(variableId, 0);
		var saveData = DataManager.makeSaveContents();
		var jsonData = JsonEx.stringify(saveData);
		var compressedData = LZString.compressToBase64(jsonData);
		$gameVariables.setValue(variableId, compressedData);
	}
};

DataManager.loadQuickSave = function() {
	var jsonData = this.getQuickSaveData();
	var uncompressedData = LZString.decompressFromBase64(jsonData);
	this.onQuickLoad();
	this.createGameObjects();
	this.extractSaveContents(JsonEx.parse(uncompressedData));
};

DataManager.onQuickLoad = function() {
	var variableId = TY.Param.SaveVariableId;
	$gameVariables.setValue(variableId, 0);
	TY.Utils.HasSaveLoaded = true;
};

//==========================================================
	// Window_TitleCommand -- 
//==========================================================

Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.newGame,   'newGame');
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
	this.addQuickSaveCommand();
};

Window_TitleCommand.prototype.addQuickSaveCommand = function() {
	var enabled = DataManager.hasQuickSaveData();
	this.addCommand(TY.Param.QuickLoadText, 'quickSave', enabled);
};

//==========================================================
	// Window_GameEnd -- 
//==========================================================

Window_GameEnd.prototype.makeCommandList = function() {
    this.addCommand(TextManager.toTitle, 'toTitle');
    this.addCommand(TY.Param.ToDesktopText, 'toDesktop');
    this.addCommand(TextManager.cancel,  'cancel');
};

//==========================================================
	// Window_QuickSave -- Inspired by Yanfly's Auto Save
//==========================================================

function Window_QuickSave() {
    this.initialize.apply(this, arguments);
}

Window_QuickSave.prototype = Object.create(Window_Base.prototype);
Window_QuickSave.prototype.constructor = Window_QuickSave;

Window_QuickSave.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
	this._showCount = 0;
	this._closeCount = 0;
	this.close();
};

Window_QuickSave.prototype.windowWidth = function() {
    return 240;
};

Window_QuickSave.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_QuickSave.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	this.updateFading();
	this.updateClosing();
};

Window_QuickSave.prototype.updateFading = function() {
	if (this._showCount > 0) {
		this.updateFadeIn();
		this._showCount--;
	} else {
		this.updateFadeOut();
	}
};

Window_QuickSave.prototype.updateClosing = function() {
	if (this._showCount <= 0) {
		if (this._closeCount > 0) {
			this._closeCount--;
		} else {
			this.close();
		}
	}
};

Window_QuickSave.prototype.updateFadeIn = function() {
	this.contentsOpacity += TY.Param.TextFadeSpeed;
};

Window_QuickSave.prototype.updateFadeOut = function() {
	this.contentsOpacity -= TY.Param.TextFadeSpeed;
};

Window_QuickSave.prototype.open = function() {
	Window_Base.prototype.open.call(this);
	this.contentsOpacity = 0;
	this._showCount = TY.Param.TextDuration;
	this._closeCount = TY.Param.WindowDuration;
	this.refresh();
};

Window_QuickSave.prototype.getFailSaveText = function() {
	var failText = TY.Param.FailSaveText;
	if (failText.contains('SAVETIME')) {
		failText = failText.replace(/SAVETIME/g, DataManager.getSaveTime());
	}
	return failText;
};

Window_QuickSave.prototype.message = function() {
	if (DataManager.canCreateQuickSave()) {
		return TY.Param.GameSaveText;
	} else {
		return this.getFailSaveText();
	}
};

Window_QuickSave.prototype.refresh = function() {
    var x = this.textPadding();
    var width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();
	this.drawText(this.message(), x, 0, width, 'center');
};

//==========================================================
	// Scene_Title -- 
//==========================================================

Scene_Title.prototype.loadQuickSave = function() {
	DataManager.loadQuickSave();
    SoundManager.playLoad();
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
};

Scene_Title.prototype.reloadMapIfUpdated = function() {
	Scene_Load.prototype.reloadMapIfUpdated.call(this);
};

var TY_CreateCommandWindow1 = Scene_Title.prototype.createCommandWindow
Scene_Title.prototype.createCommandWindow = function() {
	TY_CreateCommandWindow1.call(this);
	this._commandWindow.setHandler('quickSave', this.loadQuickSave.bind(this));
};

//==========================================================
	// Scene_Menu -- 
//==========================================================

var TY_Scene_Menu_Create = Scene_Menu.prototype.create;
Scene_Menu.prototype.create = function() {
    TY_Scene_Menu_Create.call(this);
	this._quickSaving = false;
    this.createSaveWindow();
};

var TY_Scene_Menu_Update = Scene_Menu.prototype.update;
Scene_Menu.prototype.update = function() {
    TY_Scene_Menu_Update.call(this);
	this.isQuickSaving();
};

Scene_Menu.prototype.createSaveWindow = function() {
	this._saveWindow = new Window_QuickSave(0, 0);
	this._saveWindow.x = Graphics.boxWidth - this._saveWindow.width;
	this._saveWindow.y = Graphics.boxHeight - this._saveWindow.height;
	this.addWindow(this._saveWindow);
};

Scene_Menu.prototype.createQuickSave = function() {
	if (!this._quickSaving) {
		this._quickSaving = true;
		this._saveWindow.open();
	}
	this._commandWindow.activate();
};

Scene_Menu.prototype.isQuickSaving = function() {
	if (this._quickSaving) {
		var windowOpen = this._saveWindow.isOpen();
		var saveAllowed = DataManager.canCreateQuickSave();
		if (windowOpen && saveAllowed) {
			DataManager.makeQuickSave();
			this._quickSaving = false;
		} else if (windowOpen && !saveAllowed) {
			this._quickSaving = false;
		}
	}
};

//==========================================================
	// Scene_GameEnd -- 
//==========================================================

Scene_GameEnd.prototype.commandToDesktop = function() {
	this.fadeOutAll();
	SceneManager.exit();
};

var TY_CreateCommandWindow2 = Scene_GameEnd.prototype.createCommandWindow
Scene_GameEnd.prototype.createCommandWindow = function() {
	TY_CreateCommandWindow2.call(this);
    this._commandWindow.setHandler('toDesktop',  this.commandToDesktop.bind(this));
};

// TODO: Try fixing bugs from previous reports
// TODO: Add data compression/decompression algorithm to quick saves
// TODO: Compare size of variable without compression and with compression method.
// TODO: Check if compression reduces lag when quick saving