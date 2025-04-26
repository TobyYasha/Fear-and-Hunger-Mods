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

    const LAYER_GRAPHICS_FOG = ["fog1", "fog2"];

    // Check if the "layerNote" includes any word from "LAYER_GRAPHICS_FOG".
	function isFogMapLayer(layerNote) {
		return LAYER_GRAPHICS_FOG.some(graphic => layerNote.includes(graphic));
	}

	function removeFogNoteLayers() {
		const layerNotes = $dataMap.note.match(/[^\r\n]+/g);
		if (!layerNotes) return;
	
		for (const layerNote of layerNotes) {
			const isLayer = layerNote.indexOf("LAYER ") >= 0;
			if (isLayer && isFogMapLayer(layerNote)) {
				$dataMap.note = $dataMap.note.replace(layerNote, "");
			};
		}
	}

	// GALV_LayerGraphics.js -- Disable fog on map in F&H 2
	const TY_Game_Map_createNoteLayers = Game_Map.prototype.createNoteLayers;
	Game_Map.prototype.createNoteLayers = function(mapId) {
		
		if (!allowFogOverlay) {
			removeFogNoteLayers();
		}

		TY_Game_Map_createNoteLayers.call(this, mapId);
	};

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
		// Spriteset_Battle
	//==========================================================

	// Check if layer is valid and the layer's graphic 
	// name matches the names found in "LAYER_GRAPHICS_FOG"
	function isFogBattleLayer(layer) {
		return layer && LAYER_GRAPHICS_FOG.includes(layer.graphic);
	}

	// GALV_LayerGraphics.js -- Disable fog in battle in F&H 2
	const TY_Spriteset_Battle_createLayerGraphics = Spriteset_Battle.prototype.createLayerGraphics;
	Spriteset_Battle.prototype.createLayerGraphics = function() {
		const layers = {...$gameSystem._bLayers};

		for (const layerId in layers) {
			const targetLayer = $gameSystem._bLayers[layerId]
			if (isFogBattleLayer(targetLayer)) {
				delete $gameSystem._bLayers[layerId];
			}
		}

		TY_Spriteset_Battle_createLayerGraphics.call(this);
	};

    //==========================================================
		// End of File
	//==========================================================
	
})();
