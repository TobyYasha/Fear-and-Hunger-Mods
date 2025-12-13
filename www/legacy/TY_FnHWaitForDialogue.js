(function() { 

	//==========================================================
		// VERSION 2.0.0 -- by Toby Yasha
	//==========================================================
	
		// This mod has been commissioned by s0mthinG.

	//==========================================================
		// Mod Parameters 
	//==========================================================

	/**
	 * The name of Parallel Map Events that are not allowed
	 * to update while a dialogue is being displayed.
	 * 
	 * These are named the same in both games, thankfully.
	 * 
	 * @type {string[]}
	 */
	const restrictedMapEvents = [
		"blood",
		"blood2",
		"bleeding",
		"bleeding2",
		"bleeding3",
		"sanity",
		"regain_sanity"
	]

	/**
	 * The name of Parallel Map Events that are not allowed
	 * to update while a dialogue is being displayed.
	 * 
	 * NOTE(For Users): Feel free to remove the hound timer
	 * from here if you don't like it.
	 * 
	 * This is for Fear and Hunger 1.
	 * 
	 * @type {string[]}
	 */
	const fnh1RestrictedMapEvents = [
		...restrictedMapEvents,
		"hound_TIMER",
		"hound_TIMER2",
		"mahabre_TIMER",
		"mahabre_TIMER2"
	]

	/**
	 * Because the Yellow Mage Dance Parallel Map Events don't
	 * have a proper naming convention, we instead make use
	 * of the switch to determine if the event should update or not.
	 * 
	 * This is for Fear and Hunger 1.
	 * 
	 * @type {number[]}
	 */
	const fnh1RestrictedGameSwitches = [343]; // Yellow Mage Dance

	/**
	 * The name of Parallel Common Events that are not allowed
	 * to update while a dialogue is being displayed.
	 * 
	 * This is for Fear and Hunger 1.
	 * 
	 * @type {string[]}
	 */
	const fnh1RestrictedCommonEvents = [
		"HUNGER_of_GIRL",
		"HUNGER_of_KNIGHT",
		"HUNGER_of_Mercenary",
		"HUNGER_of_DKPRIEST",
		"HUNGER_of_OUTLANDER",
		"HUNGER_of_LEGARDE",
		"HUNGER_of_MOONLESS",
		"HUNGER_of_KIDDEMON",
		"HUNGER_of_MARRIAGE",
		"HUNGER_of_FUSION",
		"HUNGER_of_BABYDEMON",
		"HUNGER_of_Ghoul1",
		"HUNGER_of_Ghoul2",
		"HUNGER_of_Ghoul3"
	]

	/**
	 * The name of Parallel Common Events that are not allowed
	 * to update while a dialogue is being displayed.
	 * 
	 * This is for Fear and Hunger 2.
	 * 
	 * @type {string[]}
	 */
	const fnh2RestrictedCommonEvents = [
		"HUNGER_of_OCCULTIST", // Marina
		"HUNGER_of_MERCENARY", // Levi
		"HUNGER_of_DOCTOR", // Daan
		"HUNGER_of_MECHANIC", // Abella
		"HUNGER_of_YELLOW_PRIEST", // O'saa
		"HUNGER_of_BLACK_KALEV", // Black Kalev
		"HUNGER_of_Ghoul1", // Ghoul
		"HUNGER_of_Ghoul2", // Ghoul
		"HUNGER_of_Ghoul3", // Ghoul
		"HUNGER_of_Thug", // Marcoh
		"HUNGER_of_Journalist", // Karin
		"HUNGER_of_Botanist", // Olivia
		"HUNGER_of_Villager1", // Villager
		"HUNGER_of_Villager2", // Villager
		"HUNGER_of_Villager3" // Villager
	]

	//==========================================================
		// Mod Utility Methods
	//==========================================================

	/**
	 * Checks which FnH game instance is currently being played.
	 * 
	 * @returns {boolean} True if the current FnH instance is Termina.
	 */
	function isGameTermina() {
		return $dataSystem.gameTitle.match(/TERMINA/gi);
	}

	/**
	 * Get the current list of restricted Parallel Map Events by their map name.
	 * 
	 * @returns {string[]} A list with the names of the restricted
	 * Parallel Map Events based on the Fear and Hunger game.
	 */
	function getRestrictedMapEventNames() {
		return isGameTermina() ? restrictedMapEvents : fnh1RestrictedMapEvents;
	}

	/**
	 * Get the current list of restricted Parallel Common Events by their map name.
	 * 
	 * @returns {string[]} A list with the names of the restricted
	 * Parallel Common Events based on the Fear and Hunger game.
	 */
	function getRestrictedCommonEventNames() {
		return isGameTermina() ? fnh2RestrictedCommonEvents : fnh1RestrictedCommonEvents;
	}

	/**
	 * Check if a Game_Event should be treated as a restricted event.
	 * 
	 * @param {Game_Event} gameEvent - The Game_Event instance to verify.
	 * @returns {boolean} True if the Game_Event is going to be a restricted event.
	 */
	function isRestrictedMapEvent(gameEvent) {
		const eventNames = getRestrictedMapEventNames();
		const eventData = gameEvent.event();
		return eventNames.includes(eventData.name);
	}

	/**
	 * Check if a Game_CommonEvent should be treated as a restricted event.
	 * 
	 * @param {Game_CommonEvent} gameEvent - The Game_CommonEvent instance to verify.
	 * @returns {boolean} True if the Game_CommonEvent is going to be a restricted event. 
	 */
	function isRestrictedCommonEvent(commonEvent) {
		const commonEventNames = getRestrictedCommonEventNames();
		const commonEventData = commonEvent.event();
		return commonEventNames.includes(commonEventData.name);
	}

	//==========================================================
		// InterpreterHelper
	//==========================================================

	function InterpreterHelper() {
    	throw new Error("This is a static class");
	}

	/**
	 * Flag that determines if the system is currently working.
	 * NOTE: The role of this feature is for debugging purposes.
	 * 
	 * @type {boolean}
	 * @private
	 */
	InterpreterHelper._systemEnabled = true;

	/**
	 * Check whether the system is currently working or not.
	 * 
	 * @returns {boolean} True if the system is working.
	 */
	InterpreterHelper.isSystemEnabled = function() {
		return this._systemEnabled;
	}

	/**
	 * Set whether the system should be working or not.
	 * 
	 * @param {boolean} isEnabled - Boolean flag to determine
	 * if the system should be working or not.
	 */
	InterpreterHelper.setSystemStatus = function(isEnabled) {
		this._systemEnabled = isEnabled;
	}

	/**
	 * Check if the Map Interpreter's event id matches a given event id.
	 * 
	 * @param {number} eventId - The event id from another "Game_Interpreter" instance.
	 * NOTE: This refers to on-map events. 
	 * 
	 * @returns {boolean} True if the two event ids are the exact same.
	 */
	InterpreterHelper.isMatchingEventId = function(eventId) {
		return $gameMap._interpreter.eventId() === eventId;
	}

	/**
	 * Check if the Map Interpreter's common event id matches a given common event id.
	 * 
	 * @param {number} eventId - The common event id from another "Game_Interpreter" instance.
	 * NOTE: This refers to Common Events from the database.
	 * 
	 * @returns {boolean} True if the two common event ids are the exact same.
	 */
	InterpreterHelper.isMatchingCommonEventId = function(commonEventId) {
		return $gameMap._interpreter.commonEventId() === commonEventId;
	}

	/**
	 * Check if the Map Interpreter is currently running and potentially showing text.
	 * 
	 * NOTE: We will be assuming that if the Message Window
	 * is busy it is because of the Map Interpreter, even
	 * if technically a Parallel Event could in theory ever show text.
	 * 
	 * @returns {boolean} True if the Map Interpreter is busy.
	 */
	InterpreterHelper.isMapInterpreterBusy = function() {
		return $gameMap._interpreter.isRunning() && $gameMessage.isBusy();
	}

	/**
	 * Check if a "Game_Interpreter" instance is allowed to run a given command.
	 * 
	 * NOTE: If the system is enabled, only the Map Interpreter 
	 * will be allowed to run restricted commands freely.
	 * 
	 * @see {@link eventId} on the "isMatchingEventId" for more details.
	 * @see {@link commonEventId} on the "isMatchingCommonEventId" for more details.
	 * 
	 * @returns {boolean} True if the Game_Interpreter's command is allowed to run.
	 */
	InterpreterHelper.canInterpreterRun = function(eventId, commonEventId) {
		if (this.isSystemEnabled() && this.isMapInterpreterBusy()) {
			return (
				this.isMatchingEventId(eventId) && 
				this.isMatchingCommonEventId(commonEventId)
			);
		}
		return true;
	}

	//==========================================================
		// Game_Map 
	//==========================================================

	/**
	 * Call the methods for handling the restricted events when entering on a map.
	 */
	const TY_Game_Map_setupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
	    TY_Game_Map_setupEvents.call(this);

	    this.setupRestrictedMapEvents();
	    this.setupRestrictedCommonEvents();

	};

	/**
	 * Iterate over the Parallel Map Events and check which ones need to have
	 * their updates restricted when the Map Interpreter is running and showing text.
	 */
	Game_Map.prototype.setupRestrictedMapEvents = function() {
	    for (const event of this.events()) {
	    	if (!!event._interpreter && isRestrictedMapEvent(event)) {
	    		event._interpreter.restrictUpdates(true);
	    	}
	    }
	};

	/**
	 * Iterate over the Parallel Common Events and check which ones need to have
	 * their updates restricted when the Map Interpreter is running and showing text. 
	 */
	Game_Map.prototype.setupRestrictedCommonEvents = function() {
	    for (const event of this._commonEvents) {
	    	if (!!event && !!event._interpreter && isRestrictedCommonEvent(event)) {
	    		event._interpreter.restrictUpdates(true);
	    	} else {
	    		console.log(`Couldn't restrict the following event: ${event.event().name}`);
	    		console.log(`Interpreter Status: ${!!event._interpreter}`);
	    	}
	    }
	};

	//==========================================================
		// Game_Interpreter 
	//==========================================================

	/**
	 * Define new properties for the Game_Interpreter class.
	 */
	const TY_Game_Interpreter_clear = Game_Interpreter.prototype.clear;
	Game_Interpreter.prototype.clear = function() {
		TY_Game_Interpreter_clear.call(this);

	    this._commonEventId = 0;
	    this._updatesRestricted = false;
	};

	/**
	 * Set the commonEventId used by the 
	 * interpreter when a common event is reserved.
	 * 
	 * NOTE: This doesn't take into account parallel common events
	 * because the Map Interpreter doesn't even run them.
	 * (see "Game_Map.prototype.setupEvents")
	 * 
	 * But if the "isMapInterpreterBusy" method returns true, then
	 * parallel common events won't be able to run restricted commands.
	 */
	const TY_Game_Interpreter_setupReservedCommonEvent = 
		Game_Interpreter.prototype.setupReservedCommonEvent;
	Game_Interpreter.prototype.setupReservedCommonEvent = function() {

		if ($gameTemp.isCommonEventReserved()) {
			this._commonEventId = $gameTemp.reservedCommonEvent();
		}

		return TY_Game_Interpreter_setupReservedCommonEvent.call(this);
	};

	/**
	 * Get the commonEventId used by the interpreter.
	 * NOTE: A value of 0 means no common event is used.
	 * 
	 * @returns {number} The commonEventId used by the interpreter.
	 */
	Game_Interpreter.prototype.commonEventId = function() {
	    return this._commonEventId;
	};

	/**
	 * Restricts when an interpreter instance is allowed to 
	 * update and run its commands. 
	 * 
	 * @param {boolean} isRestricted - Whether or not the interpreter
	 * should have restricted update cycles.
	 */
	Game_Interpreter.prototype.restrictUpdates = function(isRestricted) {
		this._updatesRestricted = isRestricted;
	}

	/**
	 * Check if an interpreter's update cycles are restricted.
	 * 
	 * @returns {boolean} True if the current interpreter instance
	 * has restricted update cycles.
	 */
	Game_Interpreter.prototype.areUpdatesRestricted = function() {
		return this._updatesRestricted;
	}

	/**
	 * Check if an interpreter is allowed to run its commands,
	 * if the current interpreter is set to have restricted update cycles.
	 * 
	 * @returns {boolean} True if the interpreter can run its commands normally.
	 */
	Game_Interpreter.prototype.canRunCommands = function() {
		if (!this.areUpdatesRestricted()) return true;
		return InterpreterHelper.canInterpreterRun(this.eventId(), this.commonEventId());
	}

	/**
	 * Adds conditional interpreter updates for parallel events in order to prevent
	 * unecessary update cycles from being run and potentially improve performance
	 * while parallel events are stopped.
	 * 
	 * But the primary goal of conditional interpreter updates besides the potential
	 * performance benefits, is to prevent some events from running
	 * (ex: Blood Trails, Hounds, Mahabre Timer, etc).
	 */
	const TY_Game_Interpreter_update = Game_Interpreter.prototype.update;
	Game_Interpreter.prototype.update = function() {
		if (this.canRunCommands()) {
			TY_Game_Interpreter_update.call(this);
		}
	};

	/**
	 * Check if an interpreter instance is allowed to change an actor's hp(body).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const TY_Game_Interpreter_command311 = Game_Interpreter.prototype.command311;
	Game_Interpreter.prototype.command311 = function() {

		const eventId = this.eventId();
		const commonEventId = this.commonEventId();

		if (InterpreterHelper.canInterpreterRun(eventId, commonEventId)) {
			return TY_Game_Interpreter_command311.call(this);
		}

	    return true;
	};
	
	/**
	 * Check if an interpreter instance is allowed to change an actor's mp(mind).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	const TY_Game_Interpreter_command312 = Game_Interpreter.prototype.command312;
	Game_Interpreter.prototype.command312 = function() {

		const eventId = this.eventId();
		const commonEventId = this.commonEventId();

		if (InterpreterHelper.canInterpreterRun(eventId, commonEventId)) {
	    	return TY_Game_Interpreter_command312.call(this);
		}

		return true;
	};

	/**
	 * Check if an interpreter instance is allowed to change an actor's exp(hunger).
	 * 
	 * NOTE: This is a fallback in case a restricted event does not conform to
	 * the naming conventions established in the "Mod Parameters" section of the mod.
	 */
	/*const TY_Game_Interpreter_command315 = Game_Interpreter.prototype.command315;
	Game_Interpreter.prototype.command315 = function() {

		const eventId = this.eventId();
		const commonEventId = this.commonEventId();

		if (InterpreterHelper.canInterpreterRun(eventId, commonEventId)) {
	    	return TY_Game_Interpreter_command315.call(this);
		}

	    return true;
	};*/

	//==========================================================
		// Sprite_HelperPopup
	//==========================================================

	function Sprite_HelperPopup() {
	    this.initialize.apply(this, arguments);
	}
	
	Sprite_HelperPopup.prototype = Object.create(Sprite.prototype);
	Sprite_HelperPopup.prototype.constructor = Sprite_HelperPopup;

	/**
	 * 
	 */
	Sprite_HelperPopup.VISIBILITY_INTERVAL = 120;

	Sprite_HelperPopup.TEXT_DISPLAY = {
		SYSTEM_STATUS: "systemStatus",
		HUNGER_STATUS: "hungerStatus",
	}

	/**
	 * Field that stores the Rectangle object for the popup bitmap
	 * so that we don't need to re-create the Rectangle object 
	 * every single time we try to retrieve it.
	 * 
	 * @type {Rectangle}
	 * @private
	 */
	Sprite_HelperPopup._defaultBitmapRect = null;

	Sprite_HelperPopup.createDefaultBitmapRect = function() {
		const padding = 16;

		const width = 350; // hardcoded bitmap width
		const height = Window_Base.prototype.lineHeight();
		const x = Graphics.boxWidth - width - padding;
		const y = padding;

		return new Rectangle(x, y, width, height);
	}

	Sprite_HelperPopup.getDefaultBitmapRect = function() {
		if (!this._defaultBitmapRect) {
			this._defaultBitmapRect = this.createDefaultBitmapRect();
		} 

		return this._defaultBitmapRect;
	}

	Sprite_HelperPopup.getInterpreterHelperSystemStatus = function() {
		const systemStatus = InterpreterHelper.isSystemEnabled();
		const statusText = systemStatus ? "Enabled" : "Disabled";
		return `Interpreter Helper Status: ${statusText}`;
	}

	Sprite_HelperPopup.getPlayerHungerStatus = function() {
		return `Player Hunger Updated: ${$gameParty.leader().nextRequiredExp()}`;
	}

	Sprite_HelperPopup.getTextDisplay = function(displayKey) {
		const displayEntries = {
			[this.TEXT_DISPLAY.SYSTEM_STATUS]: this.getInterpreterHelperSystemStatus(),
			[this.TEXT_DISPLAY.HUNGER_STATUS]: this.getPlayerHungerStatus()
		}

		return displayEntries[displayKey] || "";
	}

	Sprite_HelperPopup.prototype.initialize = function() {

		this.opacity = 0;

		this._visibilityInterval = 0;

		const bitmapRect = Sprite_HelperPopup.getDefaultBitmapRect();
		const bitmap = new Bitmap(bitmapRect.width, bitmapRect.height);

		Sprite.prototype.initialize.call(this, bitmap);
	}

	Sprite_HelperPopup.prototype.refreshDisplay = function() {
		const text = Sprite_HelperPopup.getTextDisplay(this.mode);
		const bitmapRect = Sprite_HelperPopup.getDefaultBitmapRect();

		const textObject = {
			text,
			x: 0,
			y: 0,
			maxWidth: bitmapRect.width,
			lineHeight: bitmapRect.height,
			align: "center"
		};

		if (this.bitmap) {
			this.bitmap.clear();

			this.bitmap.paintOpacity = 192;
			this.bitmap.fillAll("black");
			this.bitmap.paintOpacity = 255;
			
			this.bitmap.fontFace = Window_Base.prototype.standardFontFace();
			this.bitmap.fontSize = Window_Base.prototype.standardFontSize() - 6;
			this.bitmap.drawText(...Object.values(textObject));
		}

		this.opacity = 255;
		this._visibilityInterval = Sprite_HelperPopup.VISIBILITY_INTERVAL;
	}

	Sprite_HelperPopup.prototype.update = function() {
		Sprite.prototype.update.call(this);
		this.updateVisibility();
	};

	Sprite_HelperPopup.prototype.updateVisibility = function() {
		if (this._visibilityInterval > 0) {

			const fadeInterval = Sprite_HelperPopup.VISIBILITY_INTERVAL / 2;

			this._visibilityInterval--;

			if (this._visibilityInterval < fadeInterval) {
				this.opacity = 255 * this._visibilityInterval / fadeInterval;
			}
		}
	};

	//==========================================================
		// Scene_Map 
	//==========================================================

	const TY_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function() {
		TY_Scene_Map_createDisplayObjects.call(this);

		this.createSystemStatusPopup();
		this.createHungerStatusPopup();
	};

	Scene_Map.prototype.createSystemStatusPopup = function() {
		const bitmapRect = Sprite_HelperPopup.getDefaultBitmapRect();

	    this._systemStatusPopup = new Sprite_HelperPopup();
	    this._systemStatusPopup.mode = Sprite_HelperPopup.TEXT_DISPLAY.SYSTEM_STATUS;
	    this._systemStatusPopup.x = bitmapRect.x;
		this._systemStatusPopup.y = bitmapRect.y;

	    this.addChild(this._systemStatusPopup);
	};

	Scene_Map.prototype.createHungerStatusPopup = function() {
		const bitmapRect = Sprite_HelperPopup.getDefaultBitmapRect();
		const padding = 8;

	    this._hungerStatusPopup = new Sprite_HelperPopup();
	    this._hungerStatusPopup.mode = Sprite_HelperPopup.TEXT_DISPLAY.HUNGER_STATUS;
	    this._hungerStatusPopup.x = bitmapRect.x;
		this._hungerStatusPopup.y = bitmapRect.y + bitmapRect.height + padding;

	    this.addChild(this._hungerStatusPopup);
	};

	Scene_Map.prototype.refreshHelperPopupSprites = function() {
	    this._systemStatusPopup.refreshDisplay();
	};

	const TY_Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		TY_Scene_Map_update.call(this);

		this._playerRequiredExp = this._playerRequiredExp || null;

		if ($gameParty.leader().nextRequiredExp() !== this._playerRequiredExp) {
			this._hungerStatusPopup.refreshDisplay();
			this._playerRequiredExp = $gameParty.leader().nextRequiredExp();
		}
	};

	//==========================================================
		// SceneManager 
	//==========================================================

	const TY_SceneManager_onKeyDown = SceneManager.onKeyDown;
	SceneManager.onKeyDown = function(event) {

    	if (!event.ctrlKey && !event.altKey && event.keyCode === 118) { // F7

    		const systemStatus = InterpreterHelper.isSystemEnabled();
    		InterpreterHelper.setSystemStatus(!systemStatus);

    		if (this._scene instanceof Scene_Map) {
    			this._scene.refreshHelperPopupSprites();
    		}

	    }

		TY_SceneManager_onKeyDown.call(this, event);
	};

	//==========================================================
		// End of File
	//==========================================================

})();
