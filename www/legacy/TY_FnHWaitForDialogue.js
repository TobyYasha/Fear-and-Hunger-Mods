(function() { 

	//==========================================================
		// VERSION 1.0.0 -- by Toby Yasha
	//==========================================================
	
	// This mod has been commissioned by s0mthinG.
	
	//==========================================================
		// Mod Parameters -- 
	//==========================================================

		// MISC COMMON EVENTS IN FnH1
		// 82 - Demon Baby Growing
		// 288 - Torch Timer
		// 304 - Miasma

		// HUNGER COMMON EVENTS IN FnH1
		// 124 - Girl
		// 125 - Knight
		// 126 - Mercenary
		// 127 - Dark Priest
		// 128 - Outlander
		// 129 - Le Garde
		// 130 - Moonless
		// 131 - Kid Demon
		// 132 - Marriage
		// 133 - Fusion
		// 134 - Baby Demon
		// 135 - Ghoul 1
		// 136 - Ghoul 2
		// 137 - Ghoul 3

		// SANITY COMMON EVENTS IN FnH1
		// 291 - Mahabre
		// 292 - Dark

		// keep an eye on common event number 89-91 (crow mauler)
		// keep an eye on common event number 148 (game timer)
		// keep an eye on common event number 231 (timer buckman)
		// keep an eye on common event number 288 (torch timer)
		// keep an eye on common event number 291-292 (sanity)

		// keep in mind the bleeding event on the map

	//==========================================================
		// Mod Configurations -- 
	//==========================================================

		function getMiscCommonEvents() { // ONLY FNH1 FOR NOW
			const commonEventIds = [
				82, 288, 304
			];

			return commonEventIds;
		}

		function getHungerCommonEvents() { // ONLY FNH1 FOR NOW
			const commonEventIds = [
				124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137
			];

			return commonEventIds;
		}

		function getSanityCommonEvents() { // ONLY FNH1 FOR NOW
			const commonEventIds = [291, 292];

			return commonEventIds;
		}

		function makeCommonEventList() {
			const list1 = this.getHungerCommonEvents();
			const list2 = this.getSanityCommonEvents();
			return [...list1, ...list2];
		}

		function isCommonEventPaused(commonEventId) {
			const commonEventList = this.makeCommonEventList();
			return $gameMessage.isBusy() && commonEventList.includes(commonEventId);
		}

	//==========================================================
		// Game Configurations -- Game_CommonEvent
	//==========================================================
		
		const Game_CommonEvent_isActive = Game_CommonEvent.prototype.isActive;
		Game_CommonEvent.prototype.isActive = function() {
			const event = this.event();
			const condition = Game_CommonEvent_isActive.call(this);
		    return condition && isCommonEventPaused(this.event.id);
		};

})();
