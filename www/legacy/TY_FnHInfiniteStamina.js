(function() {
	
	//==========================================================
			// VERSION 1.0.1 -- by Toby Yasha
	//==========================================================
		
	// The following settings are meant to be edited by users:
		
	const allowInfiniteStamina = true;  // true | false -- DEFAULT: true
	const allowDrawStaminaBar  = false; // true | false -- DEFAULT: false
	
	//==========================================================
		// Mod Configurations -- 
	//==========================================================
		
	let autoDashToggle = false;

	// Check if it's a common event for the stamina bar graphic
	function isStaminaCommonEvent(commonEvent) {
		const commonEventIds = [573, 574, 575];
		if (commonEvent) {
			return commonEventIds.includes(commonEvent.id);
		} else {
			return false;
		}
	}

	/*
	SWITCH DEFINITION:
		202 -  Suicide in Process
		203 -  Climbing
		403 -  Love Dark Priest x Mercenary (Where's this used?)
		434 -  Pig Death Scene
		2420 - Hexen GFX
	*/
	function meetsDashSwitchCondition() {
		const switchIds = [202, 203, 403, 434, 2420];
		return switchIds.every(switchId => !$gameSwitches.value(switchId));
	}

	/*
	VARIABLE DEFINITION:
		868 -  Burn
		2802 - One leg restriction
	*/
	function meetsDashVariableCondition() {
		const variableIds = [868, 2802];
		return variableIds.every(variableId => !$gameVariables.value(variableId));
	}

	function meetsDashConditions() {
		return (
			$gamePlayer.isMoving() &&
			meetsDashSwitchCondition() &&
			meetsDashVariableCondition()
		);
	}

	function updateDashToggle() {
		if (Input.isTriggered("shift")) {
			autoDashToggle = !autoDashToggle;
			updateDashState();
		}
	}

	function updateDashState() {
		if (autoDashToggle && meetsDashConditions()) {
			$gameSwitches.setValue(1956, true);
		}
	}

	// Ensures that stamina doesn't go down
	function updateStaminaMeter() {
		if (allowInfiniteStamina) { // if "true" then don't run out of stamina
			$gameVariables.setValue(2714, 0);
		}
	}
	
	//==========================================================
		// Game Configurations -- Game_Map
	//==========================================================

	// Update dash and stamina features
	const TY_Game_Map_Update = Game_Map.prototype.update;
	Game_Map.prototype.update = function(sceneActive) {
		TY_Game_Map_Update.call(this, ...arguments);
		updateDashToggle();
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
