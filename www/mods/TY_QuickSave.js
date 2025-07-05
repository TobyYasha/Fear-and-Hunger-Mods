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
 * [!] VERY IMPORTANT
 * This plugin requires the Olivia_MetaControls plugin in order to function!
 * Must be placed anywhere below Olivia_MetaControls.
 * 
 * [!] WARNING
 * Just like with regular save files, the "Quick Save" may break if trying
 * to load a "Quick Save" from an older version into a newer version.
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
 * - Added Base64 compression/decompression for "Quick Save" data.
 * - Fixed quick save window appearing briefly in the bottom
 *   right corner when opening the menu.
 * - Restore BGM and BGS upon loading a quick save.
 * - Fixed quick saving messing with the play time of regular
 *   save files.
 *
 * Version 1.2 - 7/5/2025
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
 * Dev Comment: On displays with faster refresh rate the cooldown timer was updating too fast.
 *
 * - Changed the patching for following methods from overwrite to aliasing:
 *   - Window_TitleCommand.prototype.makeCommandList
 *   - Window_GameEnd.prototype.makeCommandList
 * Dev Comment: The previous versions had "Window_TitleCommand" 
 * remove the "Options" from the title screen.
 * 
 * - "Quick Save" data is now cleared upon:
 *   - Getting a "Game Over" screen.
 *   - Reloading the game via the "F5" key.
 * Dev Comment: Can you guys stop finding exploits? :(
 * 
 * - The "Quick Save" cooldown timer now persist even after quitting the game.
 * Dev Comment: This has bothering me for a while now, so i'm glad i got it fixed.
 * 
*/

var TY = TY || {};
TY.quickSave = TY.quickSave || {};

(function(_) {

	// NOTE: Be careful not to confuse this "_value" with this "_.value"

//==========================================================
	// Static Private Members
//==========================================================

	/**
	 * Dummy variable used to reference plugin parameters data.
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
	 * "Quick Load" Command symbol on the "Title Scene".
	 * 
	 * @type string
	*/
	const _loadCommandSymbol = "quickLoad";

	/**
	 * "Quit to Desktop" Command name on the "Game End Scene".
	 * 
	 * @type string
	*/
	const _desktopCommandName = params["To Desktop Text"];

	/**
	 * "Quit to Desktop" Command symbol on the "Game End Scene".
	 * 
	 * @type string
	*/
	const _desktopCommandSymbol = "toDesktop";


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
	 * The regexp string keyword used to reference the time remaining 
	 * until the next "Quick Save" can be created.
	 * 
	 * @type regexp
	*/
	const _saveTimeRegexp = /SAVETIME/ig;


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
	const _saveTimeInterval = 15; // TEST ONLY
	//const _saveTimeInterval = Number(params["Quick Save Time"]);

	/**
	 * The reserved local storage key for the "Quick Save" cooldown timer 
	 * 
	 * @type string
	*/
	const _storageTimeElapsedKey = "quickSaveTimeElapsed";

	/**
	 *  The reserved local storage key for the "Quick Save" cooldown active flag
	 * 
	 * @type string
	*/
	const _storageCooldownActiveKey = "quickSaveCooldownActive";

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
	 * Flag that is used to check if the "Quick Save" system is on cooldown or not.
	 * 
	 * @type boolean
	*/
	_.saveCooldownActive = false;

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
			if (typeof value === "string") {
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
			if (typeof value !== "string") {
				trueValue = null
			}

			$gameVariables.setValue(variableId, trueValue);
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
		_.saveCooldownActive = true;
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
		if (_.saveCooldownActive) {
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
		const isCooldownActive = _.saveCooldownActive;
		const isSceneStarted = SceneManager.isCurrentSceneStarted();
		const isMapScene = SceneManager._scene instanceof Scene_Map;
		
		return isCooldownActive && isSceneStarted && isMapScene;
	}

	/**
	 * Updates the "Quick Save" time elapsed timer until the user
	 * can create another "Quick Save" entry.
	*/
	_.updateSaveCooldownTimer = function() {
		_.saveTimeElapsed++;

		if (_.isSavingAllowed()) {
			_.saveCooldownActive = false;
		}
	}

	/**
	 * Store the current "Quick Save" cooldown timer and flag.
	*/
	_.storeSaveCooldownData = function() {
		localStorage.setItem(_storageTimeElapsedKey, _.saveTimeElapsed);
		localStorage.setItem(_storageCooldownActiveKey, _.saveCooldownActive);
	}

	/**
	 * Restore the "Quick Save" cooldown timer and flag(if data available).
	*/
	_.restoreSaveCooldownData = function() {
		_.restoreSaveTimeElapsed();
		_.restoreSaveActiveCooldown();
	}

	/**
	 * 
	*/
	_.restoreSaveTimeElapsed = function() {
		const timeElapsed = localStorage.getItem(_storageTimeElapsedKey);

		if (timeElapsed) {
			_.saveTimeElapsed = Number(timeElapsed);
			localStorage.removeItem(_storageTimeElapsedKey);
		}
		
	}

	/**
	 * 
	*/
	_.restoreSaveActiveCooldown = function() {
		const isActive = localStorage.getItem(_storageCooldownActiveKey);

		if (isActive) {
			_.saveCooldownActive = isActive === "true";
			localStorage.removeItem(_storageCooldownActiveKey);
		}
		
	}

	/**
	 * This method check is only added to ensure compatibility with other 
	 * plugins that might add hooks to the NW.js window "Close" listener.
	 * 
	 * IMPORTANT: Only patch this method if you know what you are doing!
	 * 
	 * @returns {boolean} True if game window can be closed
	*/
	_.canCloseGame = function() {
		return true;
	}

	/**
	 * Adds a hook to the NW.js window "Close" listener so that the timer
	 * can be preserved when quitting the game.
	*/
	_.hookTimerMemorizer = function() {
		nw.Window.get().on("close", function() {

			_.storeSaveCooldownData();

			if (_.canCloseGame()) {
				this.close(true);
			}

		});
	}

	_.hookTimerMemorizer();
	_.restoreSaveCooldownData();

//==========================================================
	// SceneManager 
//==========================================================

	/**
	 * Ensures the "Quick Save" cooldown system is updated(when needed)
	 * 
	 * @alias SceneManager.updateScene
	*/
	const TY_SceneManager_updateScene = SceneManager.updateScene;
	SceneManager.updateScene = function() {
		TY_SceneManager_updateScene.call(this);
		if (_.canUpdateSaveCooldownTimer()) {
			_.updateSaveCooldownTimer();
		}
	};

	/**
	 * Prevents exploits via the F5(Reload) key, 
	 * which would not remove the "Quick Save" data.
	*/
	SceneManager.clearQuickSaveOnReload = function(event) {
		if (!event.ctrlKey && !event.altKey && event.keyCode === 116) { // F5
			_.clearSaveData();
	    }
	};

	/**
	 * Adds a method to prevent "Save & Reload" exploits
	 * 
	 * @alias SceneManager.onKeyDown
	*/
	const TY_SceneManager_onKeyDown = SceneManager.onKeyDown;
	SceneManager.onKeyDown = function(event) {
		this.clearQuickSaveOnReload(event);
		TY_SceneManager_onKeyDown.call(this, event);
	};

//==========================================================
	// Window_TitleCommand 
//==========================================================

	/**
	* Inserts the "Quick Load" command to the "Scene_Title" window commands.
	* 
	* @alias Window_TitleCommand.prototype.makeCommandList
	*/
	const TY_Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
	Window_TitleCommand.prototype.makeCommandList = function() {
		TY_Window_TitleCommand_makeCommandList.call(this);
		this.addQuickLoadCommand();
	};
	
	/**
	 * Adds a "Quick Load" command to the list of commands.
	 * NOTE: The command is only available if there is "Quick Save" data available.
	 * This command can be used to load a "Quick Save" file.
	*/
	Window_TitleCommand.prototype.addQuickLoadCommand = function() {
		const name = _loadCommandName;
		const symbol = _loadCommandSymbol;
		const enabled = _.hasSaveData();
		this.addCommand(name, symbol, enabled);
	};

//==========================================================
	// Window_GameEnd
//==========================================================

	/**
	 * Inserts the "To Desktop" command to the "Scene_GameEnd" window commands.
	 * 
	 * @alias Window_GameEnd.prototype.makeCommandList
	*/
	const TY_Window_GameEnd_makeCommandList = Window_GameEnd.prototype.makeCommandList;
	Window_GameEnd.prototype.makeCommandList = function() {
		TY_Window_GameEnd_makeCommandList.call(this);
	    this.addToDesktopCommand();
	};
	
	/**
	 * Adds a "To Desktop" command to the list of commands.
	 * This command can be used to close the game.
	*/
	Window_GameEnd.prototype.addToDesktopCommand = function() {
		const name = _desktopCommandName;
		const symbol = _desktopCommandSymbol;
	    this.addCommand(name, symbol);
	};

//==========================================================
	// Window_QuickSave -- Inspired by Yanfly's Auto Save
//==========================================================

	/**
	 * The UI window responsible for showing the "Save Message" 
	 * to the user after using the "Quick Save" command.
	 * 
	 * @class
	*/
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
	
	/**
	 * The width at which the window is drawn
	 * 
	 * @returns {number} The width value
	*/
	Window_QuickSave.prototype.windowWidth = function() {
	    return 240;
	};
	
	/**
	 * The height at which the window is drawn
	 * 
	 * @returns {number} The height value
	*/
	Window_QuickSave.prototype.windowHeight = function() {
	    return this.fittingHeight(1);
	};

	/**
	 * The rate at which the "Quick Save" "Success/Fail" message "Fades In/Out".
	 * 
	 * @returns {number} The "Fade In/Out" rate
	*/
	Window_QuickSave.prototype.messageFadeRate = function() {
	    return 16;
	};

	/**
	 * The amount of frames that the "Quick Save" "Success/Fail" message 
	 * stays on screen for after "Fading In".
	 * 
	 * @returns {number} The message duration in frames
	*/
	Window_QuickSave.prototype.messageDuration = function() {
	    return 120;
	};

	/**
	 * The amount of frames to wait before closing the window.
	 * NOTE: This should happen after the window's contents have "Faded Out".
	 * 
	 * @returns {number} The waiting duration in frames
	*/
	Window_QuickSave.prototype.messageWindowDuration = function() {
	    return 32;
	};
	
	/**
	 * Updates the window's "Fading" and "Closing" processes
	*/
	Window_QuickSave.prototype.update = function() {
		Window_Base.prototype.update.call(this);
		this.updateFading();
		this.updateClosing();
	};
	
	/**
	 * Updates the process of "Fading In/Out" of the contents
	*/
	Window_QuickSave.prototype.updateFading = function() {
		if (this._showCount > 0) {
			this.updateFadeIn();
			this._showCount--;
		} else {
			this.updateFadeOut();
		}
	};
	
	/**
	 * Updates the timer that prevents closing the window for a number of frames
	*/
	Window_QuickSave.prototype.updateClosing = function() {
		if (this._showCount <= 0) {
			if (this._closeCount > 0) {
				this._closeCount--;
			} else {
				this.close();
			}
		}
	};
	
	/**
	 * Increments the window's contents's opacity by the "Fading Rate" per frame
	*/
	Window_QuickSave.prototype.updateFadeIn = function() {
		this.contentsOpacity += this.messageFadeRate();
	};
	
	/**
	 * Decrements the window's contents's opacity by the "Fading Rate" per frame
	*/
	Window_QuickSave.prototype.updateFadeOut = function() {
		this.contentsOpacity -= this.messageFadeRate();
	};
	
	/**
	 * Initialize the window's properties for the animation
	*/
	Window_QuickSave.prototype.open = function() {
		Window_Base.prototype.open.call(this);
		this.contentsOpacity = 0;
		this._showCount = this.messageDuration();
		this._closeCount = this.messageWindowDuration();
		this.refresh();
	};
	
	/**
	 * Format and return the "Save Fail Message" string.
	 * 
	 * @returns {string} The formatted "Save Fail Message" string.
	*/
	Window_QuickSave.prototype.getFailMessage = function() {
		let text = _saveFailMessage; 

		if (text.match(_saveTimeRegexp)) {
			let remainingTime = _.getSaveCooldownTimer();
			text = text.replace(_saveTimeRegexp, remainingTime);
		}

		return text;
	};
	
	/**
	 * Gets a "Save Message" based on whether or not "Quick Saving" is currently allowed.
	 * 
	 * @returns {string} The "Save Success Message" or "Save Fail Message" string.
	*/
	Window_QuickSave.prototype.message = function() {
		if (_.isSavingAllowed()) {
			return _saveSuccessMessage;
		} else {
			return this.getFailMessage();
		}
	};
	
	/**
	 * Renders the "Save Message" string.
	*/
	Window_QuickSave.prototype.refresh = function() {
	    const x = this.textPadding();
	    const width = this.contents.width - this.textPadding() * 2;
	    this.contents.clear();
		this.drawText(this.message(), x, 0, width, 'center');
	};

//==========================================================
	// Scene_Title
//==========================================================

	/**
	 * Decompresses the "Quick Save" data and boots the game.
	 * Based on: Scene_Load.prototype.onLoadSuccess
	*/
	Scene_Title.prototype.commandQuickLoad = function() {
		_.decompressSaveData();
	    SoundManager.playLoad();

	    this.fadeOutAll();
	    this.reloadMapIfUpdated();

	    SceneManager.goto(Scene_Map);
	    $gameSystem.onAfterLoad();
	};
	
	/**
	 * Refreshes the current map in case the current game's version id 
	 * doesn't match the version id found in the save file data
	 * $gameSystem.versionId().
	 * 
	 * This may probably not do much, but i wanted to mimic the behavior
	 * of regular save file loading, so it stays.
	*/
	Scene_Title.prototype.reloadMapIfUpdated = function() {
		Scene_Load.prototype.reloadMapIfUpdated.call(this);
	};
	
	/**
	 * Binds a method to the "Quick Load" command handler
	 * 
	 * @alias Scene_Title.prototype.createCommandWindow
	*/
	const TY_Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow
	Scene_Title.prototype.createCommandWindow = function() {
		TY_Scene_Title_createCommandWindow.call(this);
		this._commandWindow.setHandler(_loadCommandSymbol, this.commandQuickLoad.bind(this));
	};

//==========================================================
	// Scene_Menu
//==========================================================

	/**
	 * Initializes additional properties used by the "Quick Save" plugin.
	 * 
	 * @alias Scene_Menu.prototype.initialize
	*/
	const TY_Scene_Menu_initialize = Scene_Menu.prototype.initialize;
	Scene_Menu.prototype.initialize = function() {
		this._quickSaving = false;
		this._quickSaveWindow = null;
	    TY_Scene_Menu_initialize.call(this);
	};

	/**
	 * Inserts the method to create the "Quick Save" popup window.
	 * 
	 * @alias Scene_Menu.prototype.create
	*/
	const TY_Scene_Menu_create = Scene_Menu.prototype.create;
	Scene_Menu.prototype.create = function() {
	    TY_Scene_Menu_create.call(this);
	    this.createQuickSaveWindow();
	};
	
	/**
	 * Creates the "Quick Save" popup window and hides it.
	*/
	Scene_Menu.prototype.createQuickSaveWindow = function() {
		this._quickSaveWindow = new Window_QuickSave(0, 0);
		this._quickSaveWindow.x = Graphics.boxWidth - this._quickSaveWindow.width;
		this._quickSaveWindow.y = Graphics.boxHeight - this._quickSaveWindow.height;
		this._quickSaveWindow.hide();
		this.addWindow(this._quickSaveWindow);
	};

	/**
	 * Updates the "Quick Save" process(if active)
	 * 
	 * @alias Scene_Menu.prototype.update
	*/
	const TY_Scene_Menu_update = Scene_Menu.prototype.update;
	Scene_Menu.prototype.update = function() {
	    TY_Scene_Menu_update.call(this);
		this.updateQuickSaveProcess();
	};

	/**
	 * Creates a "Quick Save" entry if "Quick Saving" is active and the 
	 * "Quick Save" popup window is open.
	*/
	Scene_Menu.prototype.updateQuickSaveProcess = function() {
		if (this._quickSaving) {

			const windowOpen = this._quickSaveWindow.isOpen();
			const saveAllowed = _.isSavingAllowed();

			if (windowOpen && saveAllowed) {
				_.compressSaveData();
				this._quickSaving = false;
			} else if (windowOpen && !saveAllowed) {
				this._quickSaving = false;
			}

		}
	};

	/**
	 * Starts the "Quick Save" process.
	 * 
	 * NOTE: In order to prevent spamming the command, we make sure 
	 * that another "Quick Save" process isn't already underway.
	 * 
	 * NOTE: A better name would have been "startQuickSaveProcess", 
	 * but it will be left as is since it would requiring re-editing 
	 * the entry in Yanfly's Main Menu Manager plugin.
	*/
	Scene_Menu.prototype.createQuickSave = function() {
		if (!this._quickSaving) {
			this._quickSaving = true;
			this._quickSaveWindow.show();
			this._quickSaveWindow.open();
		}

		this._commandWindow.activate();
	};

//==========================================================
	// Scene_GameEnd 
//==========================================================

	/**
	 * Binds a method to the "To Desktop" command handler
	 * 
	 * @alias Scene_GameEnd.prototype.createCommandWindow
	*/
	const TY_Scene_GameEnd_createCommandWindow = Scene_GameEnd.prototype.createCommandWindow;
	Scene_GameEnd.prototype.createCommandWindow = function() {
		TY_Scene_GameEnd_createCommandWindow.call(this);
	    this._commandWindow.setHandler(_desktopCommandSymbol, this.commandToDesktop.bind(this));
	};
	
	/**
	 * Exits the game processing altogether.
	*/
	Scene_GameEnd.prototype.commandToDesktop = function() {
		this.fadeOutAll();
		SceneManager.exit();
	};

//==========================================================
	// Scene_Gameover 
//==========================================================

	/**
	 * Clears any existing "Quick Save" data upon getting a game over.
	 * 
	 * @alias Scene_Gameover.prototype.create
	*/
	const TY_Scene_Gameover_create = Scene_Gameover.prototype.create;
	Scene_Gameover.prototype.create = function() {
	    TY_Scene_Gameover_create.call(this);
	    this.clearQuickSave();
	};
	
	/**
	 * Clears "Quick Save" data.
	*/
	Scene_Gameover.prototype.clearQuickSave = function() {
		_.clearSaveData();
	};

	// SceneManager._scene._commandWindow._list.findIndex(item => item && item.symbol === "options");

//==========================================================
    // End of File
//==========================================================

})(TY.quickSave);
