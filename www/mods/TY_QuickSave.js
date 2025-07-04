//=============================================================================
/*:
 * @plugindesc v1.2 A system which handles temporary saves.
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
 * @help
 *
 * ----------------------- COMPATIBILITY --------------------------
 *
 * VERY IMPORTANT!
 * This plugin requires the Olivia_MetaControls plugin in order to function!
 * Must be placed anywhere below Olivia_MetaControls.
 * 
 * ----------------------- HOW TO USE -----------------------------
 * 
 * The variable which will store the Quick Save data
 * must contain <Global Meta> in its name.
 * Example: <Global Meta> My Variable 1
 * 
 * As a bonus you can now close game from the last command inside the game's menu.
 * 
 * ------------------------ UPDATES ------------------------------
 * 
 * Version 1.1 - 10/12/2024
 * - Reduced size of quick saved data by compressing it.
 * - Fixed quick save window appearing briefly in the bottom
 *   right corner when opening the menu.
 * - Restore BGM and BGS upon loading a quick save.
 * - Fixed quick saving messing with the play time of regular
 *   save files.
 *
 * Version 1.2 - 7/4/2025
 * - Removed "Save Text Fade" plugin parameter.
 * - Removed "Save Text Duration" plugin parameter.
 * - Removed "Window Duration" plugin parameter.
 * Dev Comment: They were pretty niche parameters.
 *
 * - Refactored the code
 * - Added JSDoc style comments for members and methods
 * Dev Comment: The code should be 0.00001% more beautiful now
 *
 * - Changed the method that updated the "Quick Save" cooldown timer from:
 *   - SceneManager.renderScene
 *   to
 *   - SceneManager.updateScene
 * Dev Comment: On faster displays the cooldown timer would update too fast.
 *
 * - Changed the patching for following methods from overwrite to aliasing:
 *   - Window_TitleCommand.prototype.makeCommandList
 *   - Window_GameEnd.prototype.makeCommandList
 * Dev Comment: The previous versions had "Window_TitleCommand" 
 * remove the "Options" from the title screen.
 * 
*/

TY.Param.GameSaveText = TY.Parameters["Game Save Text"];
TY.Param.FailSaveText = TY.Parameters["Fail Save Text"];

var TY = TY || {};
TY.quickSave = TY.quickSave || {};

(function(_) {

	// NOTE: Be careful not to confuse this "_value" with this "_.value"

//==========================================================
	// Parameters | Static Private Members
//==========================================================

	/**
	 * Dummy variable to reference plugin parameters data
	 * 
	 * @type object
	*/
	var params = PluginManager.parameters("TY_QuickSave");


	/**
	 * "Quick Load" Command name on the "Title Scene".
	 * 
	 * @type string
	*/
	const _loadCommandName = params["Quick Load Text"];

	/**
	 * "Quit to Desktop" Command name on the "Game End Scene".
	 * 
	 * @type string
	*/
	const _desktopCommandName = params["To Desktop Text"];


	/**
	 * Message show in the "Menu Scene" when a "Quick Save" was successful.
	 * 
	 * @type string
	*/
	const _saveSuccessMessage = params["Game Save Text"];

	/**
	 * Message show in the "Menu Scene" when a "Quick Save" has failed
	 * (due to cooldown timer).
	 * 
	 * @type string
	*/
	const _saveFailMessage = params["Fail Save Text"];

	/**
	 * How fast the "Quick Save" "Success/Fail" message "Fades In/Out" inside 
	 * the "Quick Save Menu Popup Window".
	 * 
	 * @type number
	*/
	const _messageFadeRate = 16;

	/**
	 * How long the "Quick Save" "Success/Fail" message lingers after appearing.
	 * 
	 * @type number
	*/
	const _messageDuration = 120;

	/**
	 * How long to wait before closing the "Quick Save Menu Popup Window".
	 * 
	 * @type number
	*/
	const _messageWindowDuration = 32;


	/**
	 * The "Game Variable" that is used to store the "Quick Save Data".
	 * NOTE: This is and must be a "Global Variable" via the <Global Meta> tag.
	 * 
	 * @type number
	*/
	const _saveVariableId = Number(params["Quick Save Variable"]);

	/**
	 * The "Time Interval" (in minutes) before a new "Quick Save" can be created.
	 * 
	 * @type number
	*/
	const _saveTimeInterval = Number(params["Quick Save Time"]);

//==========================================================
	// Public Members
//==========================================================

	/**
	 * The "Cooldown Time" (in game frames) that passed since 
	 * the last "Quick Save" was made.
	 * NOTE: 60 Frames = 1 Second
	 * 
	 * @type number
	*/
	_.saveTimeElapsed = 0;

	/**
	 * Flag that is used to check if a "Quick Save" was recently loaded into.
	 * 
	 * @type boolean
	*/
	_.saveLoaded = false;

//==========================================================
	// Methods 
//==========================================================

	/**
	 * Checks whether or not there is "Quick Save" data available.
	 * 
	 * @returns {boolean} True if "Quick Save" game variable is not null.
	*/
	_.hasSaveData = function() {
		return !!_.getSaveData();
	}

	/**
	 * Get the current contents of the game variable designated
	 * to hold the "Quick Save" data.
	 * NOTE: Number types and anything else is treated as null.
	 * 
	 * @returns {object} Output should either be "Compressed Save Data" or null.
	*/
	_.getSaveData = function() {
		const variableId = _saveVariableId;

		if (variableId > 0) {

			const value = $gameVariables.value(variableId);
			if (typeof value === "object") {
				return value;
			}

		}

		return null;
	}

	/**
	 * Set the current contents of the game variable designated
	 * to hold the "Quick Save" data.
	 * 
	 * @param {object} value - "Compressed Save Data" or null.
	 * NOTE: Any other input type will be treated as null.
	*/
	_.setSaveData = function(value) {
		const variableId = _saveVariableId;

		if (variableId > 0) {

			let trueValue = value;
			if (typeof value !== "object") {
				trueValue = null
			}

			$gameVariables.value(variableId, trueValue);
		}
	}

	/**
	 * Clear out the "Compressed Save Data" from the "Quick Save" game variable.
	*/
	_.clearSaveData = function() {
		_.setSaveData(null);
	}

	/**
	 * Clear out old "Quick Save" data and preserve some pre-save data.
	 * NOTE: This is important for preserving music tracks.
	*/
	_.onSaveDataCompressed = function() {
		_.clearSaveData();
		$gameSystem.onBeforeSave();
	}

	/**
	 * Clear out existing "Quick Save" data and set the flag to alert the
	 * system that a "Quick Save" was loaded.
	*/
	_.onSaveDataDecompressed = function() {
		_.clearSaveData();
		_.saveLoaded = true;
	}

	/**
	 * Create and store the "Quick Save" data into the "Quick Save" game variable.
	*/
	_.compressSaveData = function() {
		const variableId = _saveVariableId;

		if (variableId > 0) {

			_.onSaveDataCompressed();

			const saveData = DataManager.makeSaveContents();
			const jsonData = JsonEx.stringify(saveData);
			const compressedData = LZString.compressToBase64(jsonData);

			_.setSaveData(compressedData);

		}
	}

	/**
	 * Retrieve and apply the "Quick Save" data from the "Quick Save" game variable.
	*/
	_.decompressSaveData = function() {
		const saveData = _.getSaveData();

		if (!!saveData) {

			const jsonData = LZString.decompressFromBase64(saveData);
			const decompressedData = JsonEx.parse(jsonData);

			_.onSaveDataDecompressed();

			DataManager.createGameObjects();
			DataManager.extractSaveContents(decompressedData);

		}
	}

	/**
	 * Checks whether a "Quick Save" can be made.
	 * If a "Quick Save" was recently loaded, then we need to wait for the cooldown.
	 * Otherwise "Quick Saving" is allowed.
	 * 
	 * @returns {boolean} True if "Quick Saving" is allowed.
	*/
	_.isSavingAllowed = function() {
		if (_.saveLoaded) {
			return _.getSaveCooldownTimer() <= 0;
		}
		return true;
	}

	/**
	 * Checks whether "Quick Saving" is currently on cooldown
	 * 
	 * @returns {number} A positive number means that "Quick Saving" is on cooldown.
	 * Numbers starting from 0 and below mean that "Quick Saving" is not on cooldown.
	*/
	_.getSaveCooldownTimer = function() {
		const targetMins = _saveTimeInterval;

		let seconds = Math.floor(_.saveTimeElapsed / 60);
		let currentMins = Math.floor(seconds / 60) % 60;

		return targetMins - currentMins;
	}

	/**
	 * Checks whether the "Quick Save" cooldown timer can be updated or not.
	 *  
	 * @returs {boolean} True if:
	 * - a "Quick Save" has been loaded
	 * - The current scene has started(aka is ready)
	 * - The current scene is the map scene(to prevent menu idling)
	*/
	_.canUpdateSaveCooldownTimer = function() {
		const isSaveLoaded = _.saveLoaded;
		const isSceneStarted = SceneManager.isCurrentSceneStarted();
		const isMapScene = this._scene instanceof "Scene_Map";
		
		return isSaveLoaded && isSceneStarted && isMapScene;
	}

	/**
	 * Updates the "Quick Save" time elapsed timer until the user 
	 * can create another "Quick Save" entry.
	*/
	_.updateSaveCooldownTimer = function() {
		_.saveTimeElapsed++;

		if (_.isSavingAllowed()) {
			_.saveLoaded = false;
		}
	}

//==========================================================
	// SceneManager 
//==========================================================

	/**
	 * Ensures the "Quick Save" cooldown system is updated(when needed)
	*/
	const TY_SceneManager_updateScene = SceneManager.updateScene;
	SceneManager.updateScene = function() {
		TY_SceneManager_updateScene.call(this);
		if (_.canUpdateSaveCooldownTimer()) {
			_.updateSaveCooldownTimer();
		}
	};

//==========================================================
	// Window_TitleCommand 
//==========================================================

	/**
	* Inserts the "Quick Load" command to the "Title Scene" window commands.
	* 
	* @alias Window_TitleCommand.prototype.makeCommandList
	*/
	const TY_Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
	Window_TitleCommand.prototype.makeCommandList = function() {
		TY_Window_TitleCommand_makeCommandList.call(this);
		this.addQuickSaveCommand();
	};
	
	/**
	 * Adds a "Quick Load" command to the list of commands.
	 * NOTE: The command is only available if there is "Quick Save" data available.
	*/
	Window_TitleCommand.prototype.addQuickSaveCommand = function() {
		const name = _loadCommandName;
		const symbol = "quickSave";
		const enabled = _.hasSaveData();
		this.addCommand(name, symbol, enabled);
	};

//==========================================================
	// Window_GameEnd
//==========================================================

const TY_Window_GameEnd_makeCommandList = Window_GameEnd.prototype.makeCommandList;
Window_GameEnd.prototype.makeCommandList = function() {
    this.addToDesktopCommand();
};

Window_GameEnd.prototype.addToDesktopCommand = function() {
	const name = _desktopCommandName;
	const symbol = "toDesktop";
    this.addCommand(name, symbol);
};

//==========================================================
	// Window_QuickSave -- Inspired by Yanfly's Auto Save
//==========================================================

window.Window_QuickSave = function() {
    this.initialize.apply(this, arguments);
}

Window_QuickSave.prototype = Object.create(Window_Base.prototype);
Window_QuickSave.prototype.constructor = Window_QuickSave;

Window_QuickSave.prototype.initialize = function(x, y) {
    const width = this.windowWidth();
    const height = this.windowHeight();
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
	this.contentsOpacity += _messageFadeRate;
};

Window_QuickSave.prototype.updateFadeOut = function() {
	this.contentsOpacity -= _messageFadeRate;
};

Window_QuickSave.prototype.open = function() {
	Window_Base.prototype.open.call(this);
	this.contentsOpacity = 0;
	this._showCount = _messageDuration;
	this._closeCount = _messageWindowDuration;
	this.refresh();
};

Window_QuickSave.prototype.getFailSaveText = function() {
	let failText = TY.Param.FailSaveText;
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
    const x = this.textPadding();
    const width = this.contents.width - this.textPadding() * 2;
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
    $gameSystem.onAfterLoad();
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
	this._saveWindow.hide();
	this.addWindow(this._saveWindow);
};

Scene_Menu.prototype.createQuickSave = function() {
	if (!this._quickSaving) {
		this._quickSaving = true;
		this._saveWindow.show();
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

//==========================================================
    // End of File
//==========================================================

})(TY.quickSave);
