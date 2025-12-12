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
		// End of File
	//==========================================================

})();
