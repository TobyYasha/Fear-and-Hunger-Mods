(function() { 

	//==========================================================
		// VERSION 1.2.0 -- by Toby Yasha
	//==========================================================
	
		// This mod has been commissioned by s0mthinG.

	//==========================================================
		// Mod Parameters -- 
	//==========================================================

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

	//==========================================================
		// InterpreterHelper
	//==========================================================

	function InterpreterHelper() {
    	throw new Error("This is a static class");
	}

	/**
	 * 
	 */
	InterpreterHelper.POPUP_VISIBILITY_INTERVAL = 120;

	/**
	 * Flag that determines if the system is currently working.
	 * NOTE: The role of this feature is for debugging purposes.
	 * 
	 * @type {boolean}
	 * @private
	 */
	InterpreterHelper._systemEnabled = true;

	/**
	 * Field that stores the Rectangle object for the popup bitmap
	 * so that we don't need to re-create the Rectangle object 
	 * every single time we try to retrieve it.
	 * 
	 * @type {Rectangle}
	 * @private
	 */
	InterpreterHelper._popupBitmapRect = null;

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
	 * Get a dynamically formatted string of the system's current status.
	 * 
	 * @returns {string} The system's current status in a formatted string format.
	 */
	InterpreterHelper.getSystemStatusAsString = function() {
		const systemStatus = InterpreterHelper.isSystemEnabled();
		const statusText = systemStatus ? "Enabled" : "Disabled";
		return `Interpreter Helper Status: ${statusText}`;
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
	 * @see {@link eventId} on the "isMatchingEventId" for more details.
	 * @see {@link commonEventId} on the "isMatchingCommonEventId" for more details.
	 * 
	 * @returns {boolean} True if the Game_Interpreter's command is allowed to run.
	 */
	InterpreterHelper.canInterpreterRunCommand = function(eventId, commonEventId) {
		if (this.isSystemEnabled() && this.isMapInterpreterBusy()) {
			return (
				this.isMatchingEventId(eventId) || 
				this.isMatchingCommonEventId(commonEventId)
			);
		}
		return true;
	}

	InterpreterHelper.createPopupBitmapRect = function() {
		const padding = 16;

		const width = 350; // hardcoded bitmap width
		const height = Window_Base.prototype.lineHeight();
		const x = Graphics.boxWidth - width - padding;
		const y = padding;

		return new Rectangle(x, y, width, height);
	}

	InterpreterHelper.getPopupBitmapRect = function() {
		if (!this._popupBitmapRect) {
			this._popupBitmapRect = this.createPopupBitmapRect();
		} 

		return this._popupBitmapRect;
	}

	//==========================================================
		// Game_Interpreter 
	//==========================================================

	// setupStartingMapEvent

	/**
	 * Define the new "_commonEventId" property.
	 */
	const TY_Game_Interpreter_clear = Game_Interpreter.prototype.clear;
	Game_Interpreter.prototype.clear = function() {
		TY_Game_Interpreter_clear.call(this);

	    this._commonEventId = 0;
	};

	/**
	 * Set the commonEventId used by the 
	 * interpreter when a common event is reserved.
	 * 
	 * NOTE: This doesn't take into account parallel common events
	 * because i didn't see a good reason to also track their ids.
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
	 * Check if an interpreter instance is allowed to change an actor's hp(body).
	 */
	const TY_Game_Interpreter_command311 = Game_Interpreter.prototype.command311;
	Game_Interpreter.prototype.command311 = function() {

		const eventId = this.eventId();
		const commonEventId = this.commonEventId();

		if (InterpreterHelper.canInterpreterRunCommand(eventId, commonEventId)) {
			return TY_Game_Interpreter_command311.call(this);
		}

	    return true;
	};
	
	/**
	 * Check if an interpreter instance is allowed to change an actor's mp(mind).
	 */
	const TY_Game_Interpreter_command312 = Game_Interpreter.prototype.command312;
	Game_Interpreter.prototype.command312 = function() {

		const eventId = this.eventId();
		const commonEventId = this.commonEventId();

		if (InterpreterHelper.canInterpreterRunCommand(eventId, commonEventId)) {
	    	return TY_Game_Interpreter_command312.call(this);
		}

		return true;
	};

	/**
	 * Check if an interpreter instance is allowed to change an actor's exp(hunger).
	 */
	const TY_Game_Interpreter_command315 = Game_Interpreter.prototype.command315;
	Game_Interpreter.prototype.command315 = function() {

		const eventId = this.eventId();
		const commonEventId = this.commonEventId();

		if (InterpreterHelper.canInterpreterRunCommand(eventId, commonEventId)) {
	    	return TY_Game_Interpreter_command315.call(this);
		}

	    return true;
	};

	//==========================================================
		// Sprite_HelperPopup
	//==========================================================

	/*function Sprite() {
	    this.initialize.apply(this, arguments);
	}
	
	Sprite.prototype = Object.create(PIXI.Sprite.prototype);
	Sprite.prototype.constructor = Sprite;*/

	//==========================================================
		// Scene_Map 
	//==========================================================

	const TY_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function() {
		TY_Scene_Map_createDisplayObjects.call(this);

		this.createInterpreterHelperPopup();
	};

	// this._popupVisibilityInterval = 0;

	Scene_Map.prototype.createInterpreterHelperPopup = function() {
		const bitmapRect = InterpreterHelper.getPopupBitmapRect();
		const bitmap = new Bitmap(bitmapRect.width, bitmapRect.height);

	    this._interpreterHelperPopup = new Sprite(bitmap);
	    this._interpreterHelperPopup.x = bitmapRect.x;
	    this._interpreterHelperPopup.y = bitmapRect.y;

	    this.addChild(this._interpreterHelperPopup);
	};

	Scene_Map.prototype.refreshInterpreterHelperPopup = function() {
		const statusText = InterpreterHelper.getSystemStatusAsString();
		const bitmapRect = InterpreterHelper.getPopupBitmapRect();
		const bitmap = this._interpreterHelperPopup.bitmap;

		if (bitmap) {
			bitmap.clear();

			bitmap.paintOpacity = 192;
			bitmap.fillAll("black");
			bitmap.paintOpacity = 255;
			
			bitmap.fontFace = Window_Base.prototype.standardFontFace();
			bitmap.fontSize = Window_Base.prototype.standardFontSize() - 6;
			bitmap.drawText(statusText, 0, 0, bitmapRect.width, bitmapRect.height, "center");
		}

		this._interpreterHelperPopup.opacity = 255;
		this._popupVisibilityInterval = InterpreterHelper.POPUP_VISIBILITY_INTERVAL;
	};

	Scene_Map.prototype.updateInterpreterHelperPopup = function() {
		if (this._popupVisibilityInterval > 0) {

			const fadeInterval = InterpreterHelper.POPUP_VISIBILITY_INTERVAL / 2;

			this._popupVisibilityInterval--;

			if (this._popupVisibilityInterval < fadeInterval) {
				this._interpreterHelperPopup.opacity = 
					255 * this._popupVisibilityInterval / fadeInterval;
			}
		}
	};

	const TY_Scene_Map_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		TY_Scene_Map_update.call(this);
		this.updateInterpreterHelperPopup();
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
    			this._scene.refreshInterpreterHelperPopup();
    		}

	    }

		TY_SceneManager_onKeyDown.call(this, event);
	};

	//==========================================================
		// End of File
	//==========================================================

})();
