(function() {
	
	//==========================================================
		// VERSION 1.0.1 -- by Toby Yasha
	//==========================================================
		
	// The following settings are meant to be edited by users:
		
	const allowFogOverlay = false;        // true | false -- DEFAULT: false
	const allowVisibilityOverlay = false; // true | false -- DEFAULT: false
	
	//==========================================================
		// Game Configurations -- Spriteset_Map
	//==========================================================
	
	const TY_Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
	Spriteset_Map.prototype.initialize = function() {
		TY_Spriteset_Map_initialize.call(this, ...arguments);
		this.disableFogOverlay();
	};
	
	// Check if there are any fog layers on the map
	Spriteset_Map.prototype.canDisableFogOverlay = function() {
		return !allowFogOverlay && Object.keys(this.layerGraphics).length > 0;
	}
	
	// GALV_LayerGraphics.js
	Spriteset_Map.prototype.disableFogOverlay = function() {
		if (this.canDisableFogOverlay()) {
			if (this.layerGraphics[1]) {
				this.layerGraphics[1].visible = false;
			}
			if (this.layerGraphics[2]) {
				this.layerGraphics[2].visible = false;
			}
		}
	}
	
	// GALV_VisibilityRange.js
	const TY_Spriteset_Map_setVisibilityRange = Spriteset_Map.prototype.setVisibilityRange;
	Spriteset_Map.prototype.setVisibilityRange = function(image) {
		if (allowVisibilityOverlay) {
			TY_Spriteset_Map_setVisibilityRange.call(this, ...arguments);
		}
	};
	
})();
