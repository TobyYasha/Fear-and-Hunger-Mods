(function() { 

	//==========================================================
		// VERSION 1.0.0 -- by Toby Yasha
	//==========================================================
	
		// This mod has been commissioned by s0mthinG.
	
	//==========================================================
		// Mod Parameters -- 
	//==========================================================

		// keep an eye on common event number 89-91 (crow mauler)

		// MISC COMMON EVENTS IN FnH1
		// 82 - Demon Baby Growing
		// 148 - Le Garde Timer
		// 231 - Buckman Timer
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

	//==========================================================
		// Mod Configurations -- 
	//==========================================================

		// MapId 1 - level1_A
		// MapId 3 - level1_3_A
		// MapId 4 - level1_2_A
		// MapId 5 - level2_A
		// MapId 6 - level3_A
		// MapId 7 - toilet
		// MapId 8 - level4_A
		// MapId 9 - level1_4_A
		// MapId 11 - level5_A
		// MapId 14 - tree_of_the_depths
		// MapId 16 - level6_1A
		// MapId 17 - god_of_the_depths
		// MapId 18 - thicket_1_A
		// MapId 19 - thicket_2_A
		// MapId 20 - level6_2A
		// MapId 21 - thicket_3_A
		// MapId 22 - huts_village
		// MapId 23 - Staircase
		// MapId 24 - level7_A
		// MapId 29 - level1_B
		// MapId 30 - level6_2_Crash
		// MapId 31 - Level1_3_B
		// MapId 32 - toilet (yes, there are 2 of these maps)
		// MapId 37 - level3_B
		// MapId 38 - level4_B
		// MapId 39 - level5_B
		// MapId 44 - thicket_1_B
		// MapId 45 - thicket_2_B
		// MapId 46 - thicket_3_B
		// MapId 51 - level1_C
		// MapId 53 - Level1_3_C
		// MapId 54 - toilet (was there a need for 3 identical maps?)
		// MapId 59 - level3_C
		// MapId 60 - thicket_4_A (not sure if used in-game)
		// MapId 62 - Smash_pit
		// MapId 65 - Level8_2_A
		// MapId 66 - thicket_1_C
		// MapId 67 - thicket_2_C
		// MapId 68 - thicket_3_C
		// MapId 71 - Staircase
		// MapId 74 - Fortress
		// MapId 75 - Level3_Basement_A
		// MapId 76 - Level1_Basement_A
		// MapId 77 - Level2_Basement_A
		// MapId 78 - Temple of Torment
		// MapId 79 - Temple of Torment_merc
		// MapId 81 - Temple of Torment_out
		// MapId 82 - Temple of Torment_knight
		// MapId 83 - Temple of Torment_dark
		// MapId 84 - Temple of Torment_captain
		// MapId 85 - Temple of Torment_empty
		// MapId 93 - Level8_A
		// MapId 96 - golden_temple
		// MapId 104 - Grand_library
		// MapId 105 - Grand_library_inner
		// MapId 122 - Ancient_Temple of Torment
		// MapId 123 - Temple of Torment_level2
		// MapId 124 - Flipside_Basement_A
		// MapId 126 - Ancient_Golden_temple
		// MapId 127 - Golden_temple_inside
		// MapId 128 - level1_2_B
		// MapId 141 - deeper_thicket
		// MapId 142 - Level 9
		// MapId 145 - Level9_trap
		// MapId 163 - Level3_Basement_Corridor
		// MapId 182 - Level2_Basement_B
		// MapId 183 - level1_D
		// MapId 184 - level5_C

		function getMiscMapEvents() { // ONLY FNH1 FOR NOW
			const mapEvents = [
				{ mapId: 1, eventId: 27  }, // Blood
				{ mapId: 1, eventId: 29  }, // Bleeding
				{ mapId: 1, eventId: 131 }, // Sanity Loss
				{ mapId: 1, eventId: 133 }, // Sanity Gain

				{ mapId: 3, eventId: 9   }, // Blood
				{ mapId: 3, eventId: 13  }, // Bleeding
				{ mapId: 3, eventId: 138 }, // Sanity Loss
				{ mapId: 3, eventId: 148 }, // Sanity Gain

				{ mapId: 4, eventId: 26  }, // Blood
				{ mapId: 4, eventId: 23  }, // Bleeding
				{ mapId: 4, eventId: 28  }, // Sanity Gain

				{ mapId: 5, eventId: 24  }, // Blood
				{ mapId: 5, eventId: 20  }, // Bleeding
				{ mapId: 5, eventId: 26  }, // Sanity Loss

				{ mapId: 6, eventId: 28  }, // Blood
				{ mapId: 6, eventId: 25  }, // Bleeding
				{ mapId: 6, eventId: 54  }, // Sanity Loss
				{ mapId: 6, eventId: 58  }, // Sanity Gain
				{ mapId: 6, eventId: 156 }, // Arrow Check

				{ mapId: 7, eventId: 10  }, // Blood
				{ mapId: 7, eventId: 7   }, // Bleeding
				{ mapId: 7, eventId: 6   }, // Sanity Loss

				{ mapId: 8, eventId: 22  }, // Blood
				{ mapId: 8, eventId: 19  }, // Bleeding
				{ mapId: 8, eventId: 98  }, // Sanity Loss

				{ mapId: 9, eventId: 24  }, // Blood
				{ mapId: 9, eventId: 21  }, // Bleeding
				{ mapId: 9, eventId: 99  }, // Sanity Gain

				{ mapId: 11, eventId: 36  }, // Blood
				{ mapId: 11, eventId: 33  }, // Bleeding
				{ mapId: 11, eventId: 60  }, // Sanity Loss
				{ mapId: 11, eventId: 61  }, // Sanity Gain
				{ mapId: 11, eventId: 176 }, // Yellow Mage Dance

				{ mapId: 14, eventId: 24  }, // Blood
				{ mapId: 14, eventId: 21  }, // Bleeding
				{ mapId: 14, eventId: 26  }, // Sanity Gain

				{ mapId: 16, eventId: 51  }, // Blood
				{ mapId: 16, eventId: 53  }, // Bleeding
				{ mapId: 16, eventId: 66  }, // Sanity Loss
				{ mapId: 16, eventId: 67  }, // Sanity Gain
				{ mapId: 16, eventId: 172 }, // Yellow Mage Dance

				{ mapId: 17, eventId: 26  }, // Blood
				{ mapId: 17, eventId: 23  }, // Bleeding
				{ mapId: 17, eventId: 14  }, // Sanity Loss

				{ mapId: 18, eventId: 26  }, // Blood
				{ mapId: 18, eventId: 23  }, // Bleeding
				{ mapId: 18, eventId: 65  }, // Sanity Loss

				{ mapId: 19, eventId: 26  }, // Blood
				{ mapId: 19, eventId: 23  }, // Bleeding
				{ mapId: 19, eventId: 153 }, // Sanity Loss

				{ mapId: 20, eventId: 51  }, // Blood
				{ mapId: 20, eventId: 53  }, // Bleeding
				{ mapId: 20, eventId: 66  }, // Sanity Loss
				{ mapId: 20, eventId: 67  }, // Sanity Gain

				{ mapId: 21, eventId: 26  }, // Blood
				{ mapId: 21, eventId: 23  }, // Bleeding
				{ mapId: 21, eventId: 104 }, // Sanity Loss

				{ mapId: 22, eventId: 24  }, // Blood
				{ mapId: 22, eventId: 21  }, // Bleeding
				{ mapId: 22, eventId: 26  }, // Sanity Loss

				{ mapId: 23, eventId: 24  }, // Blood
				{ mapId: 23, eventId: 21  }, // Bleeding
				{ mapId: 23, eventId: 26  }, // Sanity Loss

				{ mapId: 24, eventId: 26  }, // Blood
				{ mapId: 24, eventId: 23  }, // Bleeding
				{ mapId: 24, eventId: 17  }, // Sanity Loss
				{ mapId: 24, eventId: 98  }, // Sanity Gain

				{ mapId: 29, eventId: 27  }, // Blood
				{ mapId: 29, eventId: 29  }, // Bleeding
				{ mapId: 29, eventId: 131 }, // Sanity Loss
				{ mapId: 29, eventId: 133 }, // Sanity Gain

				{ mapId: 30, eventId: 51  }, // Blood
				{ mapId: 30, eventId: 53  }, // Bleeding
				{ mapId: 30, eventId: 66  }, // Sanity Loss
				{ mapId: 30, eventId: 67  }, // Sanity Gain

				{ mapId: 31, eventId: 9   }, // Blood
				{ mapId: 31, eventId: 13  }, // Bleeding
				{ mapId: 31, eventId: 138 }, // Sanity Loss
				{ mapId: 31, eventId: 148 }, // Sanity Gain

				{ mapId: 32, eventId: 10  }, // Blood
				{ mapId: 32, eventId: 7   }, // Bleeding
				{ mapId: 32, eventId: 6   }, // Sanity Loss

				{ mapId: 37, eventId: 28  }, // Blood
				{ mapId: 37, eventId: 25  }, // Bleeding
				{ mapId: 37, eventId: 54  }, // Sanity Loss
				{ mapId: 37, eventId: 58  }, // Sanity Gain
				{ mapId: 37, eventId: 156 }, // Arrow Check

				{ mapId: 38, eventId: 22  }, // Blood
				{ mapId: 38, eventId: 19  }, // Bleeding
				{ mapId: 38, eventId: 98  }, // Sanity Loss

				{ mapId: 39, eventId: 36  }, // Blood
				{ mapId: 39, eventId: 33  }, // Bleeding
				{ mapId: 39, eventId: 60  }, // Sanity Loss
				{ mapId: 39, eventId: 61  }, // Sanity Gain
				{ mapId: 39, eventId: 176 }, // Yellow Mage Dance

				{ mapId: 44, eventId: 26  }, // Blood
				{ mapId: 44, eventId: 23  }, // Bleeding
				{ mapId: 44, eventId: 28  }, // Sanity Loss

				{ mapId: 45, eventId: 26  }, // Blood
				{ mapId: 45, eventId: 23  }, // Bleeding
				{ mapId: 45, eventId: 163 }, // Sanity Loss

				{ mapId: 46, eventId: 26  }, // Blood
				{ mapId: 46, eventId: 23  }, // Bleeding
				{ mapId: 46, eventId: 109 }, // Sanity Loss

				{ mapId: 51, eventId: 27  }, // Blood
				{ mapId: 51, eventId: 29  }, // Bleeding
				{ mapId: 51, eventId: 131 }, // Sanity Loss
				{ mapId: 51, eventId: 133 }, // Sanity Gain

				{ mapId: 53, eventId: 9   }, // Blood
				{ mapId: 53, eventId: 13  }, // Bleeding
				{ mapId: 53, eventId: 138 }, // Sanity Loss
				{ mapId: 53, eventId: 148 }, // Sanity Gain

				{ mapId: 54, eventId: 10  }, // Blood
				{ mapId: 54, eventId: 7   }, // Bleeding
				{ mapId: 54, eventId: 6   }, // Sanity Loss

				{ mapId: 59, eventId: 28  }, // Blood
				{ mapId: 59, eventId: 25  }, // Bleeding
				{ mapId: 59, eventId: 54  }, // Sanity Loss
				{ mapId: 59, eventId: 58  }, // Sanity Gain
				{ mapId: 59, eventId: 156 }, // Arrow Check

				{ mapId: 60, eventId: 26  }, // Blood
				{ mapId: 60, eventId: 23  }, // Bleeding
				{ mapId: 60, eventId: 153 }, // Sanity Loss

				{ mapId: 62, eventId: 28  }, // Blood
				{ mapId: 62, eventId: 25  }, // Bleeding
				{ mapId: 62, eventId: 54  }, // Sanity Loss
				{ mapId: 62, eventId: 58  }, // Sanity Gain

				{ mapId: 65, eventId: 9   }, // Blood
				{ mapId: 65, eventId: 13  }, // Bleeding
				{ mapId: 65, eventId: 148 }, // Sanity Loss
				{ mapId: 65, eventId: 88  }, // Gas Trap Control
				{ mapId: 65, eventId: 105 }, // Gas Trap Poison
				{ mapId: 65, eventId: 245 }, // Gas Trap Control
				{ mapId: 65, eventId: 246 }, // Gas Trap Poison
				{ mapId: 65, eventId: 300 }, // Yellow Mage Dance

				{ mapId: 66, eventId: 26  }, // Blood
				{ mapId: 66, eventId: 23  }, // Bleeding
				{ mapId: 66, eventId: 28  }, // Sanity Loss

				{ mapId: 67, eventId: 26  }, // Blood
				{ mapId: 67, eventId: 23  }, // Bleeding
				{ mapId: 67, eventId: 28  }, // Sanity Loss

				{ mapId: 68, eventId: 26  }, // Blood
				{ mapId: 68, eventId: 23  }, // Bleeding
				{ mapId: 68, eventId: 17  }, // Sanity Loss

				{ mapId: 71, eventId: 24  }, // Blood
				{ mapId: 71, eventId: 21  }, // Bleeding
				{ mapId: 71, eventId: 26  }, // Sanity Loss

				{ mapId: 74, eventId: 26  }, // Blood
				{ mapId: 74, eventId: 23  }, // Bleeding
				{ mapId: 74, eventId: 111 }, // Hound Timer 1
				{ mapId: 74, eventId: 112 }, // Hound Timer 2

				{ mapId: 75, eventId: 26  }, // Blood
				{ mapId: 75, eventId: 23  }, // Bleeding
				{ mapId: 75, eventId: 151 }, // Sanity Gain

				{ mapId: 76, eventId: 26  }, // Blood
				{ mapId: 76, eventId: 23  }, // Bleeding
				{ mapId: 76, eventId: 12  }, // Sanity Loss

				{ mapId: 77, eventId: 26  }, // Blood
				{ mapId: 77, eventId: 23  }, // Bleeding
				{ mapId: 77, eventId: 147 }, // Sanity Loss

				{ mapId: 78, eventId: 26  }, // Blood
				{ mapId: 78, eventId: 23  }, // Bleeding
				{ mapId: 78, eventId: 147 }, // Sanity Loss

				{ mapId: 79, eventId: 26  }, // Blood
				{ mapId: 79, eventId: 23  }, // Bleeding
				{ mapId: 79, eventId: 147 }, // Sanity Loss

				{ mapId: 81, eventId: 26  }, // Blood
				{ mapId: 81, eventId: 23  }, // Bleeding
				{ mapId: 81, eventId: 147 }, // Sanity Loss

				{ mapId: 82, eventId: 26  }, // Blood
				{ mapId: 82, eventId: 23  }, // Bleeding
				{ mapId: 82, eventId: 147 }, // Sanity Loss

				{ mapId: 83, eventId: 26  }, // Blood
				{ mapId: 83, eventId: 23  }, // Bleeding
				{ mapId: 83, eventId: 147 }, // Sanity Loss

				{ mapId: 84, eventId: 26  }, // Blood
				{ mapId: 84, eventId: 23  }, // Bleeding
				{ mapId: 84, eventId: 147 }, // Sanity Loss

				{ mapId: 85, eventId: 26  }, // Blood
				{ mapId: 85, eventId: 23  }, // Bleeding
				{ mapId: 85, eventId: 147 }, // Sanity Loss

				{ mapId: 93, eventId: 9   }, // Blood
				{ mapId: 93, eventId: 13  }, // Bleeding
				{ mapId: 93, eventId: 148 }, // Sanity Loss

				{ mapId: 96, eventId: 26  }, // Blood
				{ mapId: 96, eventId: 23  }, // Bleeding
				{ mapId: 96, eventId: 28  }, // Sanity Gain

				{ mapId: 104, eventId: 9   }, // Blood
				{ mapId: 104, eventId: 13  }, // Bleeding
				{ mapId: 104, eventId: 148 }, // Sanity Loss

				{ mapId: 105, eventId: 9   }, // Blood
				{ mapId: 105, eventId: 13  }, // Bleeding
				{ mapId: 105, eventId: 148 }, // Sanity Loss

				{ mapId: 122, eventId: 26  }, // Blood
				{ mapId: 122, eventId: 23  }, // Bleeding
				{ mapId: 122, eventId: 147 }, // Sanity Loss

				{ mapId: 123, eventId: 26  }, // Blood
				{ mapId: 123, eventId: 23  }, // Bleeding
				{ mapId: 123, eventId: 147 }, // Sanity Loss

				{ mapId: 124, eventId: 26  }, // Blood
				{ mapId: 124, eventId: 23  }, // Bleeding
				{ mapId: 124, eventId: 147 }, // Sanity Loss

				{ mapId: 126, eventId: 9   }, // Blood
				{ mapId: 126, eventId: 13  }, // Bleeding
				{ mapId: 126, eventId: 138 }, // Sanity Loss

				{ mapId: 127, eventId: 9   }, // Blood
				{ mapId: 127, eventId: 13  }, // Bleeding
				{ mapId: 127, eventId: 138 }, // Sanity Loss

				{ mapId: 128, eventId: 26  }, // Blood
				{ mapId: 128, eventId: 23  }, // Bleeding
				{ mapId: 128, eventId: 28  }, // Sanity Gain

				{ mapId: 141, eventId: 26  }, // Blood
				{ mapId: 141, eventId: 23  }, // Bleeding
				{ mapId: 141, eventId: 104 }, // Sanity Loss

				{ mapId: 142, eventId: 9   }, // Blood
				{ mapId: 142, eventId: 13  }, // Bleeding
				{ mapId: 142, eventId: 148 }, // Sanity Loss

				{ mapId: 145, eventId: 9   }, // Blood
				{ mapId: 145, eventId: 13  }, // Bleeding
				{ mapId: 145, eventId: 148 }, // Sanity Loss

				{ mapId: 163, eventId: 26  }, // Blood
				{ mapId: 163, eventId: 23  }, // Bleeding
				{ mapId: 163, eventId: 151 }, // Sanity Loss

				{ mapId: 182, eventId: 26  }, // Blood
				{ mapId: 182, eventId: 23  }, // Bleeding
				{ mapId: 182, eventId: 147 }, // Sanity Loss

				{ mapId: 183, eventId: 27  }, // Blood
				{ mapId: 183, eventId: 29  }, // Bleeding
				{ mapId: 183, eventId: 131 }, // Sanity Loss
				{ mapId: 183, eventId: 133 }, // Sanity Gain

				{ mapId: 184, eventId: 36  }, // Blood
				{ mapId: 184, eventId: 33  }, // Bleeding
				{ mapId: 184, eventId: 60  }, // Sanity Loss
				{ mapId: 184, eventId: 61  }, // Sanity Gain
				{ mapId: 184, eventId: 176 }, // Yellow Mage Dance

			]

			return mapEvents;
		}

		function isMapEventPaused(eventId) {
			/*const mapEventList = this.makeCommonEventList();
			return $gameMessage.isBusy() && mapEventList.includes(eventId);*/
		}

		function getMiscCommonEvents() { // ONLY FNH1 FOR NOW
			const commonEventIds = [
				82, 148, 231, 288, 304
			];

			return commonEventIds;
		}

		function getHungerCommonEvents() { // ONLY FNH1 FOR NOW
			const commonEventIds = [
				124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137
			];

			return commonEventIds;
		}

		function makeCommonEventList() {
			const list1 = this.getMiscCommonEvents();
			const list2 = this.getHungerCommonEvents();
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
