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
		
	// Check if it's a common event for the stamina bar graphic
	function isStaminaCommonEvent(commonEvent) {
		if (commonEvent) {
			return [573, 574, 575].includes(commonEvent.id);
		} else {
			return false;
		}
	}
	
	//==========================================================
		// Game Configurations -- Game_Map
	//==========================================================
	
	if (allowInfiniteStamina) { // if "true" then don't run out of stamina

		// Reset stamina counter back to 0
		const TY_Game_Map_Update = Game_Map.prototype.update;
		Game_Map.prototype.update = function(sceneActive) {
			TY_Game_Map_Update.call(this, ...arguments);
			$gameVariables.setValue(2714, 0); // HERE
		};
	
	}
	
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
