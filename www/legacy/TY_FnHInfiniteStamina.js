(function() {
	
	//==========================================================
			// VERSION 1.1.0 -- by Toby Yasha
	//==========================================================
		
	// The following settings are meant to be edited by users:
		
	const allowInfiniteStamina = true;  // true | false -- DEFAULT: true
	const allowDrawStaminaBar  = false; // true | false -- DEFAULT: false
	const allowLegLossPenalty  = true;  // true | false -- DEFAULT: true

	// TODO: Add feature to prevent speed loss from leg loss
	// Check common event no. 88, disable common event like with
	// the stamina bar graphic and set player dashing to 3 once.

	// NOTE: Actually make sure speed is reset every time player
	// enters the map just to be safe.
	
	//==========================================================
		// Mod Configurations -- 
	//==========================================================

	// If ON then you don't need to hold "Shift" to dash.
	let autoDashToggle = false;

	/*
	SWITCH DEFINITION:
		202 -  Suicide in Process
		203 -  Climbing
		410 -  Cannot Use Bow
		434 -  Pig Death Scene
		2243 - Run Meter Cooldown
		2245 - Double Tap
		2252 - Rifle Equipped
		2253 - Shotgun Equipped
		2254 - Pistol Equipped
		2420 - Hexen GFX
	*/
	function meetsDashSwitchCondition() {
		const switchIds = [202, 203, 410, 434, 2243, 2245, 2252, 2253, 2254, 2420];
		return switchIds.every(switchId => !$gameSwitches.value(switchId));
	}

	/*
	VARIABLE DEFINITION:
		868 -  Burn
		2802 - One leg restriction
	*/
	function meetsDashVariableCondition() {
		const variableIds = [868, 2802];
		return variableIds.every(variableId => $gameVariables.value(variableId) === 0);
	}

	// Check if the player meets the condition to dash
	// NOTE: Dash conditions are based on Common Event No. 576
	function meetsDashConditions() {
		return (
			$gamePlayer.isMoving() &&
			meetsDashSwitchCondition() &&
			meetsDashVariableCondition()
		);
	}

	// Toggle the auto dashing feature ON/OFF
	function updateDashToggle() {
		if (Input.isTriggered("shift")) {
			autoDashToggle = !autoDashToggle;
			updateDashState();
		}
	}

	// Ensures auto dashing state is not
	// lost after equipping/unequipping guns
	function refreshDashState() {
		const value = autoDashToggle;
		$gameSwitches.setValue(1956, value);
	}

	// If auto dashing is ON and 
	// player meets dashing condition
	// then ensure player is always dashing
	function updateDashState() {
		if (autoDashToggle && meetsDashConditions()) {
			$gameSwitches.setValue(1956, true);
		}
	}

	// Check if common event affects the stamina bar graphic
	function isStaminaCommonEvent(commonEvent) {
		const commonEventIds = [573, 574, 575];
		if (commonEvent) {
			return commonEventIds.includes(commonEvent.id);
		} else {
			return false;
		}
	}

	// if "true" then don't run out of stamina
	function updateStaminaMeter() {
		if (allowInfiniteStamina) {
			$gameVariables.setValue(2714, 0);
		}
	}
	
	//==========================================================
		// Game Configurations -- Game_Map
	//==========================================================

	// Clear dash state to ensure compatibility with guns
	const TY_Game_Map_Setup = Game_Map.prototype.setup;
	Game_Map.prototype.setup = function(mapId) {
		TY_Game_Map_Setup.call(this, ...arguments);
		refreshDashState();
	}

	// Update dash and stamina features
	const TY_Game_Map_Update = Game_Map.prototype.update;
	Game_Map.prototype.update = function(sceneActive) {
		TY_Game_Map_Update.call(this, ...arguments);
		updateDashToggle();
		updateDashState();
		updateStaminaMeter();
	};
	
	if (!allowDrawStaminaBar) { // if "false" then don't draw the stamina bar graphic 

		// Call the newly created "filterStaminaCommonEvents" method
		const TY_Game_Map_SetupEvents = Game_Map.prototype.setupEvents;
		Game_Map.prototype.setupEvents = function() {
			TY_Game_Map_SetupEvents.call(this, ...arguments);
			
			const commonEvents = this.filterStaminaCommonEvents();
			this._commonEvents = commonEvents.map(commonEvent => {
				return new Game_CommonEvent(commonEvent.id);
			});
		};

		// Remove common events related to the stamina bar graphic
		Game_Map.prototype.filterStaminaCommonEvents = function() {
			const commonEvents = this.parallelCommonEvents();
			
			for (const commonEvent of [...commonEvents]) {
				if (isStaminaCommonEvent(commonEvent)) {
					const index = commonEvents.indexOf(commonEvent);
					if (index >= 0) {
						commonEvents.splice(index, 1);
					}
				}
			}
			
			return commonEvents;
		};
	
	}

})();
