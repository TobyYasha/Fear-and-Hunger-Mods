(function() { 

	//==========================================================
		// VERSION 2.0.0 -- by Toby Yasha
	//==========================================================

	/**
	 * [QUICK-SUMMARY]:
	 * 
	 * Stops certain parellel map events and common events 
	 * from running their commands when dialogue is being displayed.
	 * 
	 * This in turn may prevent losing/gaining:
	 * - Body
	 * - Mind
	 * - Hunger
	 * 
	 * The mod may also potentially improve the game's
	 * performance while dialogue is being displayed.
	 * 
	 * [SPECIAL-THANKS]:
	 * 
	 * This mod has been commissioned by s0mthinG.
	 */

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
		// Mod Parameters -- Edge Case Handling
	//==========================================================

	/**
	 * The ids of Game Switches that are found in the page
	 * conditions of certain Game_Event instance.
	 * 
	 * This is used to dynamically retrieve the name of
	 * events that do not have a naming convention and
	 * instead use the default RPG Maker event naming.
	 * (ex: "EV176")
	 * 
	 * (See "EventHelper" class for use case)
	 * 
	 * This is for Fear and Hunger 1.
	 * 
	 * @type {number[]}
	 */
	const fnh1RestrictedSwitchIds = [343]; // Yellow Mage Dance

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
	 * Get a list of restricted Parallel Map Events by their name.
	 * 
	 * @returns {string[]} A list with the names of the restricted
	 * Parallel Map Events based on the Fear and Hunger game.
	 */
	function getRestrictedMapEvents() {
		const eventNames = isGameTermina() ? restrictedMapEvents : fnh1RestrictedMapEvents;
		return eventNames.concat(EventHelper.getRestrictedMapEvents());
	}

	/**
	 * Get a list of restricted Parallel Common Events by their name.
	 * 
	 * @returns {string[]} A list with the names of the restricted
	 * Parallel Common Events based on the Fear and Hunger game.
	 */
	function getRestrictedCommonEvents() {
		return isGameTermina() ? fnh2RestrictedCommonEvents : fnh1RestrictedCommonEvents;
	}

	/**
	 * Get a list of restricted Game Switches by their id.
	 * 
	 * @returns {number[]} A list with the ids of the restricted
	 * Game Switches based on the Fear and Hunger game.
	 */
	function getRestrictedSwitches() {
		return isGameTermina() ? [] : fnh1RestrictedSwitchIds;
	}

	/**
	 * Check if a Game_Event should be treated as a restricted event.
	 * 
	 * @param {Game_Event} gameEvent - The Game_Event instance to verify.
	 * @returns {boolean} True if the Game_Event is going to be a restricted event.
	 */
	function isRestrictedMapEvent(gameEvent) {
		const eventNames = getRestrictedMapEvents();
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
		const commonEventNames = getRestrictedCommonEvents();
		const commonEventData = commonEvent.event();
		return commonEventNames.includes(commonEventData.name);
	}

	/**
	 * Check if a Game_Event needs to have their update cycles
	 * delayed after the Map Interpreter is no longer busy.
	 * 
	 * @see {@link gameEvent} in the "isRestrictedMapEvent" method for more details.
	 * @returns {boolean} True if the Game_Event interpreter will resume running its
	 * commands after a certain delay interval.
	 */
	function needsDelayedInterpreterUpdates(gameEvent) {
		const eventNames = EventHelper.getRestrictedMapEvents();
		const eventData = gameEvent.event();
		return eventNames.includes(eventData.name); 
 	}

	//==========================================================
		// EventHelper
	//==========================================================

	function EventHelper() {
		throw new Error("This is a static class");
	}

	/**
	 * A container for restricted Parallel Map Events.
	 * This is used to store/retrieve event names based on a given map id.
	 * 
	 * @type {Object<{ mapId: string[] }>}
	 * @private
	 */
	EventHelper._restrictedMapEvents = {};

	/**
	 * Check if the page conditions of a Game_Event instance uses a given 
	 * restricted switch id as a condition and that switch must be ON.
	 * 
	 * @param {Object} page - The page object of a Game_Event instance.
	 * @param {number} targetSwitchId - The restricted switch id to look for.
	 * 
	 * @returns {boolean} True if the current page of a 
	 * Game_Event uses a restricted switch id.
	 */
	EventHelper.checkPageHasSwitchId = function(page, targetSwitchId) {
		const c = page.conditions;
		return (
			(c.switch1Id === targetSwitchId && c.switch1Valid) ||
			(c.switch2Id === targetSwitchId && c.switch2Valid)
		)
	}

	/**
	 * Check if a Game_Event instance uses a given restricted switch id in
	 * any of their page conditions.
	 * 
	 * @param {Game_Event} gameEvent - The Game_Event instance to inspect.
	 * @see {@link targetSwitchId} in the "checkPageHasSwitchId" method for more details.
	 * 
	 * @returns {boolean} True if any of the Game_Event's 
	 * page conditions use a restricted switch id.
	 */
	EventHelper.checkEventHasSwitchId = function(gameEvent, targetSwitchId) {
		const eventData = gameEvent.event();
		return eventData.pages.some(page => 
			this.checkPageHasSwitchId(page, targetSwitchId)
		);
	}

	/**
	 * Search a Game_Event instance from the current Game_Map to
	 * see if it uses any restricted switch ids.
	 * 
	 * If the Game_Event uses any restricted switch ids, it will
	 * be stored and referenced any time the current Game_Map is
	 * loaded into the game.
	 * 
	 * @see {@link gameEvent} in the "checkEventHasSwitchId" method for more details.
	 */
	EventHelper.searchForRestrictedSwitches = function(gameEvent) {
		const switchIds = getRestrictedSwitches();

		if (!switchIds.length) return;
		if (this.isRestrictedMapEvent(gameEvent)) return;

		for (const id of switchIds) {
			if (this.checkEventHasSwitchId(gameEvent, id)) {
				this.addRestrictedMapEvent(gameEvent);
			}
		}
	}

	/**
	 * Store the name of a Game_Event instance into the container for
	 * restricted map events based on the current Game_Map map id.
	 * 
	 * @see {@link gameEvent} in the "checkEventHasSwitchId" method for more details.
	 */
	EventHelper.addRestrictedMapEvent = function(gameEvent) {
		const mapId = $gameMap.mapId();
		const eventName = gameEvent.event().name;

		this._restrictedMapEvents[mapId] = this._restrictedMapEvents[mapId] || [];
		this._restrictedMapEvents[mapId].push(eventName);
	}

	/**
	 * Check if a Game_Event instance is already considered
	 * to be a restricted map event, so that we don't add it again.
	 * 
	 * @see {@link gameEvent} in the "checkEventHasSwitchId" method for more details.
	 * @returns {boolean} True if the Game_Event instance is already stored internally.
	 */
	EventHelper.isRestrictedMapEvent = function(gameEvent) {
		const mapId = $gameMap.mapId();
		const eventName = gameEvent.event().name;
		const restrictedEvents = this._restrictedMapEvents[mapId] || [];

		return restrictedEvents.includes(eventName);
	}

	/**
	 * Get all Game_Event instances that are considered
	 * restricted events based on the current map.
	 * 
	 * @returns {string[]} A list of Game_Event instance names 
	 * that are considered restricted.
	 */
	EventHelper.getRestrictedMapEvents = function() {
		const mapId = $gameMap.mapId();
		return this._restrictedMapEvents[mapId] || [];
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
	InterpreterHelper._eventEmitter = new PIXI.utils.EventEmitter();

	/**
	 * 
	 */
	InterpreterHelper.EVENTS = {
		MAP_BUSY: "mapBusy",
		MAP_IDLE: "mapIdle"
	}

	/**
	 * The amount of frames to delay the interpreter by 
	 * before it can resume its updates cycles.
	 * 
	 * NOTE: This will only be taken into consideration
	 * if the following Interpreter flags are enabled:
	 * - Restricted Updates
	 * - Delayed Updates
	 * 
	 * @type {number}
	 */
	InterpreterHelper.UPDATE_DELAY_INTERVAL = 120;

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
	 * @see {@link eventId} in the "isMatchingEventId" method for more details.
	 * @see {@link commonEventId} in the "isMatchingCommonEventId" method for more details.
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

	/*InterpreterHelper.updateMapInterpreterState = function() {
		this._wasInterpreterBusy = this._wasInterpreterBusy || this.isMapInterpreterBusy();
		const isInterpreterBusy = this.isMapInterpreterBusy();

		if (!this._wasInterpreterBusy && isInterpreterBusy) {
			this._eventEmitter.emit(this.EVENTS.MAP_BUSY);
		} else if (this._wasInterpreterBusy && !isInterpreterBusy) {
			this._eventEmitter.emit(this.EVENTS.MAP_IDLE);
		}
	}*/

	InterpreterHelper.updateMapInterpreterState = function() {

		this._isMapInterpreterBusy = this._isMapInterpreterBusy || null;

		if (this._isMapInterpreterBusy === this.isMapInterpreterBusy()) return;

		//console.log("trigger count");
		
		this._isMapInterpreterBusy = this.isMapInterpreterBusy();

		if (this._isMapInterpreterBusy) {
			this._eventEmitter.emit(this.EVENTS.MAP_BUSY);
		} else {
			this._eventEmitter.emit(this.EVENTS.MAP_IDLE);
		}

	}

	/*var value1 = null;
	var value2 = true;

	if (value1 === value2) return;

	value1 = value2 // value1 = true;

	if (value1) {
		// code 1
	} else {
		// code 2
	}*/

	//==========================================================
		// Game_Map 
	//==========================================================

	/**
	 * Search all Game_Event for restricted switches and convert
	 * the events that use them into restricted map events. 
	 */
	/*const TY_Game_Map_setupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
	    TY_Game_Map_setupEvents.call(this);

	    for (const event of this.events()) {
	    	EventHelper.searchForRestrictedSwitches(event);
	    }

	};*/

	const TY_Game_Map_refresh = Game_Map.prototype.refresh;
	Game_Map.prototype.refresh = function() {
	    TY_Game_Map_refresh.call(this);

	    this._restrictedSystemInit = this._restrictedSystemInit || null;
	    if (this._restrictedSystemInit) return;

	    const restrictedEvents = getRestrictedMapEvents();
	    const restrictedCommonEvents = getRestrictedCommonEvents();

	    for (const event of this.events()) {
	    	if (!!event._interpreter && isRestrictedMapEvent(event)) {
	    		event._interpreter.initRestrictedUpdates();
	    	}
	    }

	    for (const event of this._commonEvents) {
	    	if (!!event && !!event._interpreter && isRestrictedCommonEvent(event)) {
	    		event._interpreter.initRestrictedUpdates();
	    	}
	    }

	    this._restrictedSystemInit = true;

	};

	const TY_Game_Map_updateInterpreter = Game_Map.prototype.updateInterpreter;
	Game_Map.prototype.updateInterpreter = function() {
		TY_Game_Map_updateInterpreter.call(this);

		InterpreterHelper.updateMapInterpreterState();

		/*this._wasInterpreterBusy = this._wasInterpreterBusy || InterpreterHelper.isMapInterpreterBusy();
		const isInterpreterBusy = InterpreterHelper.isMapInterpreterBusy();

		if (!this._wasInterpreterBusy && isInterpreterBusy) {
			InterpreterHelper._eventEmitter.emit(InterpreterHelper.EVENTS.MAP_BUSY);
		} else if (this._wasInterpreterBusy && !isInterpreterBusy) {
			InterpreterHelper._eventEmitter.emit(InterpreterHelper.EVENTS.MAP_IDLE);
		}*/

	};

	//==========================================================
		// Game_CommonEvent 
	//==========================================================

	/**
	 * Ensure that the interpreter exists before 
	 * putting restricting the updates of a parallel common event.
	 * 
	 * NOTE: Doing this in the "Game_Map.prototype.setupEvents" 
	 * method means the interpreter is not yet available since 
	 * no "refresh" called by the game just yet.
	 */
	/*const TY_Game_CommonEvent_refresh = Game_CommonEvent.prototype.refresh;
	Game_CommonEvent.prototype.refresh = function() {
		TY_Game_CommonEvent_refresh.call(this);

		if (this._interpreter && isRestrictedCommonEvent(this)) {
			this._interpreter.setRestrictedUpdates(true);
		}

	};*/

	const TY_Game_CommonEvent_refresh = Game_CommonEvent.prototype.refresh;
	Game_CommonEvent.prototype.refresh = function() {
		TY_Game_CommonEvent_refresh.call(this);

		if (this._interpreter && this._interpreter._commonEventId === 0) {
			this._interpreter._commonEventId = this._commonEventId;
		}

	};

	//==========================================================
		// Game_Event 
	//==========================================================

	/**
	 * Ensure that the interpreter exists before 
	 * putting restricting the updates of a parallel map event.
	 * 
	 * 
	 * 
	 * NOTE: Doing this in the "Game_Map.prototype.setupEvents" 
	 * method means the interpreter is not yet available since 
	 * no "refresh" called by the game just yet.
	 */
	/*const TY_Game_Event_refresh = Game_Event.prototype.refresh;
	Game_Event.prototype.refresh = function() {
	    TY_Game_Event_refresh.call(this);

	    if (!this._interpreter) return;
	    if (!isRestrictedMapEvent(this)) return;

		this._interpreter.setRestrictedUpdates(true);

		if (needsDelayedInterpreterUpdates(this)) {
			this._interpreter.setDelayedUpdates(true);
		}

	};*/

	//==========================================================
		// Game_Interpreter 
	//==========================================================

	Game_Interpreter.prototype.initRestrictedUpdates = function() {

		console.log(`Interpreter with EVENT ID: ${this._eventId} and COMMON EVENT ID: ${this._commonEventId} got subbed`);

		InterpreterHelper._eventEmitter.on(InterpreterHelper.EVENTS.MAP_BUSY, () => {
			console.log(`Interpreter with EVENT ID: ${this._eventId} and COMMON EVENT ID: ${this._commonEventId} got locked`);
			this._updateLocked = true;
		});

		InterpreterHelper._eventEmitter.on(InterpreterHelper.EVENTS.MAP_IDLE, () => {
			console.log(`Interpreter with EVENT ID: ${this._eventId} and COMMON EVENT ID: ${this._commonEventId} got unlocked`);
			this._updateLocked = false;
		});	

	};

	/**
	 * Define new properties for the Game_Interpreter class.
	 */
	const TY_Game_Interpreter_clear = Game_Interpreter.prototype.clear;
	Game_Interpreter.prototype.clear = function() {
		TY_Game_Interpreter_clear.call(this);

	    this._commonEventId = 0;
	    this._updateLocked = false;
	    //this._updatesRestricted = false;
	    //this._updatesDelayed = false;

	    //this._updateDelayInterval = 0;
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
	/*Game_Interpreter.prototype.setRestrictedUpdates = function(isRestricted) {
		this._updatesRestricted = isRestricted;
	}*/

	/**
	 * Check if an interpreter's update cycles are restricted.
	 * 
	 * @returns {boolean} True if the current interpreter instance
	 * has restricted update cycles.
	 */
	/*Game_Interpreter.prototype.areUpdatesRestricted = function() {
		return this._updatesRestricted;
	}*/

	/**
	 * 
	 */
	/*Game_Interpreter.prototype.setDelayedUpdates = function(isDelayed) {
		this._updatesDelayed = isDelayed;
	}*/

	/*Game_Interpreter.prototype.areUpdatesDelayed = function() {
		return this._updatesDelayed;
	}*/

	/**
	 * Check if an interpreter is allowed to run its commands,
	 * if the current interpreter is set to have restricted update cycles.
	 * 
	 * @returns {boolean} True if the interpreter can run its commands normally.
	 */
	/*Game_Interpreter.prototype.canRunCommands = function() {
		if (!this.areUpdatesRestricted()) return true;
		return InterpreterHelper.canInterpreterRun(this.eventId(), this.commonEventId());
	}*/

	/**
	 * Adds conditional interpreter updates for parallel events in order to prevent
	 * unecessary update cycles from being run and potentially improve performance
	 * while parallel events are stopped.
	 * 
	 * But the primary goal of conditional interpreter updates besides the potential
	 * performance benefits, is to prevent some events from running
	 * (ex: Blood Trails, Hounds, Mahabre Timer, etc).
	 */
	/*const TY_Game_Interpreter_update = Game_Interpreter.prototype.update;
	Game_Interpreter.prototype.update = function() {
		if (!this.canRunCommands() && this.areUpdatesDelayed() && this._updateDelayInterval <= 0) {
			this._updateDelayInterval = InterpreterHelper.UPDATE_DELAY_INTERVAL;
			return;
		}

		if (this.canRunCommands() && this._updateDelayInterval > 0) {
			this._updateDelayInterval--;
			return;
		}

		if (this.canRunCommands()) {
			TY_Game_Interpreter_update.call(this);
		}
	};*/

	const TY_Game_Interpreter_update = Game_Interpreter.prototype.update;
	Game_Interpreter.prototype.update = function() {
		if (this._updateLocked) return;

		TY_Game_Interpreter_update.call(this);
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

		if (!event.ctrlKey && !event.altKey && event.keyCode === 117) { // F6
			// Teleport to the mines near the Yellow Mage
			$gamePlayer.reserveTransfer(11, 30, 24, 0, 0);
		}

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
