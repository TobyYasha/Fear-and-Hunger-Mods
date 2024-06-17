// NOTE: Currently postponed because i don't know how to make giving items only once work

// Because if you start a new run and then load a save file you won't gain the items

(function() {

	//==========================================================
		// VERSION 1.0.0 -- by Toby Yasha
	//==========================================================

		// Gives you every item in the game

	//==========================================================
		// Mod Configurations -- 
	//==========================================================

		let oneTimeGain = false;

		let itemsGained = false;
		const itemQuantity = 99;

		/*
			oneTimeGain - 
		*/

	//==========================================================
		// Mod Configurations -- 
	//==========================================================

		// Makes a list of all items in the game
		function makeItemList() {
			return [...$dataItems, ...$dataArmors, ...$dataWeapons];
		}

		// Check if we can gain the items or if we can only gain them once
		function canGainItems() {
			return !oneTimeGain || (oneTimeGain && !itemsGained);
		}

		function gainAllItems() {
			const itemList = makeItemList();
			for (const item of itemList) {
				if (item && item.name) {
					$gameParty.gainItem(item, itemQuantity);
				}
			}
		}

	//==========================================================
		// Game Configurations -- DataManager
	//==========================================================

		// Gives you the items when starting a new game
		// NOTE: When starting a new run ensure we can get the items again
		const DataManager_setupNewGame = DataManager.setupNewGame;
		DataManager.setupNewGame = function() {
			DataManager_setupNewGame.call(this);
			itemsGained = false;
			if (canGainItems()) {
				gainAllItems();
				itemsGained = true;
			}
		};

	//==========================================================
		// Game Configurations -- Scene_Load
	//==========================================================

		const Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
		Scene_Load.prototype.onLoadSuccess = function() {
			Scene_Load_onLoadSuccess.call(this);
			if (canGainItems()) {
				gainAllItems();
				itemsGained = true;
			}
		}

	//==========================================================
		// Game Configurations -- Scene_Map
	//==========================================================

		// Gives you the items every time you join the map
		const Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
		Scene_Map.prototype.onMapLoaded = function() {
			Scene_Map_onMapLoaded.call(this);
			if (canGainItems()) {
				gainAllItems();
				itemsGained = true;
			}
		};

})();
