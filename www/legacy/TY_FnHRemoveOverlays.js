(function() {
	
	//==========================================================
		// VERSION 1.1.1 -- by Toby Yasha
	//==========================================================
		
	// The following settings are meant to be edited by users:
	
	const allowFogOverlay       = false; // true | false -- DEFAULT: false
	const allowLightingOverlay  = false; // true | false -- DEFAULT: false
	const allowBlindnessOverlay = false; // true | false -- DEFAULT: false

	/*
		EXPLANATION:

		[1] allowFogOverlay -
			Whether or not to draw a fog effect on the map and in battle.

		[2] allowLightingOverlay -
			Whether or not to draw lighting effects such as:
			- Darkness effect
			- Blood portal
			- Torches
			etc
		NOTE: Unfortunately at this moment all lighting effects
		have to be disabled in order to remove the "Darkness effect".

		[3] allowBlindnessOverlay -
			Whether or not to make the screen black when affected by
			the "Blindness" debuff.

	*/
	
	//==========================================================
		// Spriteset_Map
	//==========================================================
	
	// GALV_VisibilityRange.js -- Disable visibility range in F&H 2
	const TY_Spriteset_Map_setVisibilityRange = Spriteset_Map.prototype.setVisibilityRange;
	Spriteset_Map.prototype.setVisibilityRange = function(image) {
		if (allowFogOverlay) {
			TY_Spriteset_Map_setVisibilityRange.call(this, image);
		}
	};

	// TerraxLighting.js -- Disable lighting in F&H 1 and F&H 2
	const TY_Spriteset_Map_createLightmask = Spriteset_Map.prototype.createLightmask;
    Spriteset_Map.prototype.createLightmask = function() {
    	if (allowLightingOverlay) {
    		TY_Spriteset_Map_createLightmask.call(this);
    	}
	};

	//==========================================================
		// Sprite_LayerGraphic
	//==========================================================

	const LAYER_GRAPHIC_FOG = ["fog1", "fog2"];

	function isFogLayerGraphic(graphicName) {
		return LAYER_GRAPHIC_FOG.includes(graphicName);
	}

	const TY_Sprite_LayerGraphic_update = Sprite_LayerGraphic.prototype.update;
	Sprite_LayerGraphic.prototype.update = function() {
		TY_Sprite_LayerGraphic_update.call(this);
		this.updateVisibility();
	};

	// GALV_LayerGraphics.js -- Disable fog on map in F&H 2
	Sprite_LayerGraphic.prototype.updateVisibility = function() {
		if (!allowFogOverlay && isFogLayerGraphic(this.currentGraphic)) {
			this.visible = false;
		}
	};

	//==========================================================
		// Game_Map
	//==========================================================

	const COMMON_EVENTS_BLINDNESS = [108, 109]; // Regular Blindness, Hunger Blindness

	function isBlindnessCommonEvent(entry) {
		if (entry) {
			const id = entry._commonEventId;
			return COMMON_EVENTS_BLINDNESS.includes(id);
		}
		return false;
	}

	function removeBlindnessCommonEvents() {
		const entries = $gameMap._commonEvents;
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			if (isBlindnessCommonEvent(entry)) {
				$gameMap._commonEvents.splice(i, 1);
			}
		}
	}

	// Remove blindness parallel common events
	const TY_Game_Map_SetupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
		TY_Game_Map_SetupEvents.call(this);
		if (!allowBlindnessOverlay) {
			removeBlindnessCommonEvents();
		}
	}

	// VE_FogAndOverlay.js -- Disable fog on map and battle in F&H 1
	const TY_Game_Map_createFog = Game_Map.prototype.createFog;
	Game_Map.prototype.createFog = function(note) {
		if (allowFogOverlay) {
			TY_Game_Map_createFog.call(this, note);
		}
    };

    //==========================================================
		// End of File
	//==========================================================
	
})();
