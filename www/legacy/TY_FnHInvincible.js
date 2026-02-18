(function() { 

	//==========================================================
		// VERSION 1.5.2 -- by Toby Yasha
	//==========================================================

	/**
	 * Below are Configurations meant to be changed by users.
	 * Enjoy!
	 */

	/**
	 * Disables on-map events that can harm the player in any way.
	 * 
	 * OPTIONS: true | false
	 * DEFAULT: true
	 */
	const disableOnMapTraps = true;

	/**
	 * Disables in-battle events that can harm the player in any way.
	 * 
	 * OPTIONS: true | false
	 * DEFAULT: true
	 */
	const disableCoinFlipDeaths = true;
	
	//==========================================================
		// Mod Parameters -- Fear & Hunger
	//==========================================================

	/**
	 * A list of FnH 1 Switch Ids dedicated to 
	 * on-map events that can cause Limb Loss or Death.
	 */
	const fnh1TrapSwitchIds = [
		1035, // PENDULUM BLADES
		1036, // PENDULUM BLADES
		1037, // PENDULUM BLADES
		1264, // PENDULUM BLADES
		1265, // PENDULUM BLADES
		1266, // PENDULUM BLADES
		1810, // GOLDEN TEMPLE FLAME TRAP
		3038, // BOULDER CRASH
		3142, // CAVE IN
		3554, // CAVED IN
		// LIMBS [CAHARA] -- To prevent limb loss from Yellow Mage
		36, // LEFT ARM
		37, // RIGHT ARM
		38, // LEFT LEG
		39, // RIGHT LEG
		// LIMBS [D'ARCE]
		248, // LEFT ARM
		249, // RIGHT ARM
		250, // LEFT LEG
		251, // RIGHT LEG
		// LIMBS [ENKI]
		252, // LEFT ARM
		253, // RIGHT ARM
		254, // LEFT LEG
		255, // RIGHT LEG
		// LIMBS [RAGNVALDR]
		256, // LEFT ARM
		257, // RIGHT ARM
		258, // LEFT LEG
		259, // RIGHT LEG
		// LIMBS [LE'GARDE]
		261, // LEFT ARM
		262, // RIGHT ARM
		263, // LEFT LEG
		264, // RIGHT LEG
		// LIMBS [MARRIAGE]
		385, // LEFT ARM
		386, // RIGHT ARM
		387, // LEFT LEG
		388, // RIGHT LEG
		// LIMBS [FUSION]
		390, // LEFT ARM
		391, // RIGHT ARM
		392, // LEFT LEG
		393, // RIGHT LEG
	]
	
	/**
	 * A list of FnH 1 Switch Ids dedicated to
	 * in-battle events that can cause a Harmful Effect
	 * to happen when the Player fails a Coin Flip check.
	 */
	const fnh1CoinSwitchIds = [ 
		16,  // GUARD BREAK NECK -- used by a lot of enemies
		66,  // PRIEST CHANTING
		149, // CAVE MOTHER
		340, // NIGHT LURCH
		648, // SALMON SNAKE
		794, // HARVEST MAN
		// TRAPS | SPECIAL ATTACK
		337,  // NIGHT LURCH
		338,  // NIGHT LURCH
		339,  // NIGHT LURCH
	];

	/**
	 * A list of FnH 1 Event Names dedicated to
	 * on-map events that can cause Limb Loss, Death
	 * or other Harmful Effects. 
	 */
	const fnh1TrapEventNames = [
		"rusty_nail"
	];

	//==========================================================
		// Mod Parameters -- Fear & Hunger: Termina
	//==========================================================

	/**
	 * A list of FnH 2 Switch Ids dedicated to 
	 * on-map events that can cause Limb Loss or Death.
	 */
	const fnh2TrapSwitchIds = [
		3772, // YELLOW MAGE DANCE
		3775, // YELLOW MAGE HURTING
	];
	
	/**
	 * A list of FnH 2 Switch Ids dedicated to
	 * in-battle events that can cause a Harmful Effect
	 * to happen when the Player fails a Coin Flip check.
	 */
	const fnh2CoinSwitchIds = [
		16,   // GUARD BREAK NECK -- used by a lot of enemies
		2876, // BEARTRAP SET
	];
	
	/**
	 * A list of FnH 2 Variable Ids dedicated to
	 * on-map events that can cause Limb Loss or Death.
	 */
	const fnh2TrapVariableIds = [
		2067, // FALL TRAP 1
		2068  // FALL TRAP 2
	];

	/**
	 * A list of FnH 2 Event Names dedicated to
	 * on-map events that can cause Limb Loss, Death
	 * or other Harmful Effects. 
	 */
	const fnh2TrapEventNames = [
		"mine",
		"nail_trap",
		"bearTrap1_enemy"
	];

	//==========================================================
		// Mod Parameters -- Common on both Fear & Hunger games
	//==========================================================

	/**
	 * A list of FnH(1 and 2) State Ids for 
	 * Harmful Effects that the Player will be immune to.
	 * 
	 * NOTE: The "DEAD" state is now specially handled
	 * inside the "canApplyDeadState" function.
	 */
	const stateImmunityIds = [
		3,   // ARM CUT
		5,   // BLEEDING
		14,  // LEG CUT
		16,  // CONFUSED
		17,  // POISONED
		19,  // FRACTURE
		30,  // SOUL SUCKED
		31,  // HEADLESS
		49,  // BLINDNESS
		55,  // INFECTION LEG
		56,  // INFECTION ARM
		61,  // PARASITES
		90,  // TOXIC
		93,  // BLINDNESS2
		95,  // PARALYZED
		96,  // RUIN1
		97,  // RUIN2
		98,  // RUINED1
		99,  // BRAIN FLOWER
		105, // TENTACLES(STUN)
	];
	
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
	 * Get a list of $gameSwitches Ids dedicated to on-map Traps.
	 * 
	 * @returns {number[]} The $gameSwitches Ids used by the on-map Traps.
	 */
	function getTrapSwitchIds() {
		return isGameTermina() ? fnh2TrapSwitchIds : fnh1TrapSwitchIds;
	}
	
	/**
	 * Get a list of $gameSwitches Ids dedicated to in-battle Coin Flip events.
	 * 
	 * @returns {number[]} The $gameSwitches Ids used by the Coin Flip events in battle.
	 */
	function getCoinSwitchIds() {
		return isGameTermina() ? fnh2CoinSwitchIds : fnh1CoinSwitchIds;
	}
	
	/**
	 * Get a list of $gameVariables Ids dedicated to on-map Traps.
	 * NOTE: Currently only FnH 2 has any relevant traps tied to variables.
	 * 
	 * @returns {number[]} The $gameVariables Ids used by the on-map Traps.
	 */
	function getTrapVariableIds() {
		return isGameTermina() ? fnh2TrapVariableIds : [];
	}
	
	/**
	 * Get a list of $dataMap.events names dedicated to on-map Traps.
	 * 
	 * @returns {string[]} The $dataMap.events names by the on-map Traps.
	 */
	function getTrapEventNames() {
		return isGameTermina() ? fnh2TrapEventNames : fnh1TrapEventNames;
	}

	/**
	 * Checks if a Player Character is immune to a given State.
	 * 
	 * @param {number} stateId - The database id for the State.
	 * @returns {boolean} True if the Player Character will resist the State.
	 */
	function isImmuneToState(stateId) {
		return stateImmunityIds.includes(stateId);
	}

	/**
	 * Disables $gameSwitches based on an array of $gameSwitches Ids.
	 * 
	 * @param {number[]} switchIds - An array of $gameSwitches Ids.
	 */
	function refreshGameSwitches(switchIds) {
		for (const id of switchIds) {
			if ($gameSwitches.value(id)) {
				$gameSwitches.setValue(id, false);
			}
		}
	}

	/**
	 * Disables $gameVariables based on an array of $gameVariables Ids.
	 * 
	 * @param {number[]} variableIds - An array of $gameVariables Ids. 
	 */
	function refreshGameVariables(variableIds) {
		for (const id of variableIds) {
			if ($gameVariables.value(id)) {
				$gameVariables.setValue(id, 0);
			}
		}
	}

	//==========================================================
		// Mod Configurations 
	//==========================================================

	/**
	 * Ensures that the $gameSwitches affecting
	 * the on-map Traps stay disabled.
	 * 
	 * NOTE: This only works if the "disableOnMapTraps" option is set to "true".
	 */
	function refreshTrapSwitches() {
		if (disableOnMapTraps) {
			const switchIds = getTrapSwitchIds();
			refreshGameSwitches(switchIds);
		}
	}
	
	/**
	 * Ensures that the $gameSwitches affecting
	 * the Coin Flip events in-battle stay disabled. 
	 * 
	 * NOTE: This only works if the "disableCoinFlipDeaths" option is set to "true".
	 */
	function refreshCoinSwitches() {
		if (disableCoinFlipDeaths) {
			const switchIds = getCoinSwitchIds();
			refreshGameSwitches(switchIds);
		}
	}

	/**
	 * Ensures that the $gameVariables affecting
	 * the on-map Traps stay disabled.
	 * 
	 * NOTE: This only works if the "disableOnMapTraps" option is set to "true".
	 */
	function refreshTrapVariables() {
		if (disableOnMapTraps) {
			const variableIds = getTrapVariableIds();
			refreshGameVariables(variableIds);
		}
	}

	/**
	 * Filters out the events from the $dataMap.events
	 * object that are considered Traps.
	 * 
	 * NOTE: This only works if the "disableOnMapTraps" option is set to "true".
	 * 
	 * @returns {Object[]} The events that are considered to be Traps.
	 */
	function filterTrapEvents() {
		const dataEvents = $dataMap.events;
		if (!disableOnMapTraps) return [];

		const trapNames = getTrapEventNames();

		return dataEvents.filter(event => 
			!!event && trapNames.includes(event.name)
		);
	}
	
	/**
	 * Checks if an Enemy just activated a Coin Flip event in battle.
	 * 
	 * @returns {boolean} True if any Coin Flip switch id is active.
	 */
	function isCoinFlipEventActive() { 
		const switchIds = getCoinSwitchIds();
		return switchIds.some(switchId => $gameSwitches.value(switchId));
	}
	
	/**
	 * Checks if the Player is allowed to die in battle from Coin Flip events.
	 * 
	 * @returns {boolean} True if the Player is allowed to die.
	 */
	function isCoinFlipDeathAllowed() {
		return !disableCoinFlipDeaths && isCoinFlipEventActive();
	}

	/**
	 * Checks if a Player Character is allowed to die.
	 * 
	 * NOTE: This is allowed only in special cases where HP is 0
	 * or Coin Flip based deaths are involved.
	 * 
	 * @returns {boolean} True if the Dead State Id can 
	 * be applied to the Player Character.
	 */
	function canApplyDeadState(actorHp, stateId) {
		const STATE_ID_DEAD = Game_BattlerBase.prototype.deathStateId();
		return (
			stateId === STATE_ID_DEAD && 
			(actorHp === 0 || isCoinFlipDeathAllowed())
		);
	}
	
	//==========================================================
		// Game_BattlerBase
	//==========================================================
	
	/**
	 * Removes payment check for Player Character skills.
	 */
	const Game_BattlerBase_CanPaySkillCost = 
		Game_BattlerBase.prototype.canPaySkillCost;
	Game_BattlerBase.prototype.canPaySkillCost = function(skill) {

		if (this.isActor()) return true;

		return Game_BattlerBase_CanPaySkillCost.call(this, skill);
	};
	
	/**
	 * Removes REV payment check for Player Character skills.
	 */
	const Game_BattlerBase_MeetsUseBPRequirement = 
		Game_BattlerBase.prototype.meetsUseBPRequirement;
	Game_BattlerBase.prototype.meetsUseBPRequirement = function(item) {

		if (this.isActor()) return true;

		return Game_BattlerBase_MeetsUseBPRequirement.call(this, item);
	}
	
	//==========================================================
		// Game_Actor
	//==========================================================

	/**
	 * Checks if a State is safe to be applied to a Player Character.
	 * 
	 * If a Player Character is allowed to die then the Dead State will apply.
	 * If a Player Character is immune to a State then it will not apply.
	 */
	const TY_Game_Actor_addState = Game_Actor.prototype.addState;
	Game_Actor.prototype.addState = function(stateId) {

		if (
			!canApplyDeadState(this.hp, stateId) || 
			isImmuneToState(stateId)
		) return;

		TY_Game_Actor_addState.call(this, stateId);
	};
	
	/**
	 * Prevent a Player Character from taking damage from any sources.
	 * NOTE: We make an exception if we permit Coin Flip based deaths.
	 */
	const TY_Game_Actor_gainHp = Game_Actor.prototype.gainHp;
	Game_Actor.prototype.gainHp = function(value) {

		if (!isCoinFlipDeathAllowed()) {
			value = Math.max(0, value);
		}

		TY_Game_Actor_gainHp.call(this, value);
	};

	/**
	 * Prevent a Player Character from losing their mind from any sources.
	 */
	const TY_Game_Actor_gainMp = Game_Actor.prototype.gainMp;
	Game_Actor.prototype.gainMp = function(value) {

		value = Math.max(0, value);

		TY_Game_Actor_gainMp.call(this, value);
	};

	/**
	 * Removes the use cost for Player Character skills and items.
	 * (This means skills no longer consume mind or any other resource).
	 */
	Game_Actor.prototype.useItem = function(item) {};

	/**
	 * Prevents the Player Character's hunger value from ever changing.
	 * (Used in 'Game_Interpreter.prototype.gameDataOperand' to get actor hunger).
	 * 
	 * NOTE: Responsability has been shifted from the
	 * 'changeExp' method to 'currentExp'.
	 * 
	 * This is in order to prevent an issue in Fear & Hunger: Termina
	 * where the character would become dizzy and die
	 * (after a couple of frames, even on the 'Character Selection Screen').
	 * 
	 * So we ensure the value always remains at 156 and never goes to 57.
	 */
	Game_Actor.prototype.currentExp = function() {
	    return 156; // This makes the hunger be 1
	};
	
	/**
	 * Prevents the Player Character from gaining/losing hunger.
	 */
	Game_Actor.prototype.changeExp = function(exp, show) {};

	/**
	 * Gives the Player Character full REV points at the start of the battle.
	 */
	const TY_Game_Actor_onBattleStart = Game_Actor.prototype.onBattleStart;
	Game_Actor.prototype.onBattleStart = function(advantageous) {

		this.restoreFullBP();

		TY_Game_Actor_onBattleStart.call(this, advantageous);
	};

	/**
	 * Gives the Player Character full REV points at the end of their turn.
	 */
	const TY_Game_Actor_onTurnEnd = Game_Actor.prototype.onTurnEnd;
	Game_Actor.prototype.onTurnEnd = function() {

		this.restoreFullBP();

		TY_Game_Actor_onTurnEnd.call(this);
	};

	/**
	 * Gives the Player Character full REV points.
	 * 
	 * NOTE: This is a custom method added by this mod,
	 * it is not part of the Olivia_OctoBattle.js plugin.
 	 */
	Game_Actor.prototype.restoreFullBP = function() {
		if (isGameTermina()) this.gainStoredBP(3);
	};
	
	//==========================================================
		// Game_Switches
	//==========================================================
	
	/**
	 * Prevents the value of the $gameSwitches from being easily changed.
	 */
	const Game_Switches_OnChange = Game_Switches.prototype.onChange;
	Game_Switches.prototype.onChange = function() { 

		refreshCoinSwitches();
		refreshTrapSwitches();

		Game_Switches_OnChange.call(this);
	}
	
	//==========================================================
		// Game_Variables
	//==========================================================
	
	/**
	 * Prevents the value of the $gameVariables from being easily changed.
	 */
	const Game_Variables_OnChange = Game_Variables.prototype.onChange;
	Game_Variables.prototype.onChange = function() { 

		refreshTrapVariables();

		Game_Variables_OnChange.call(this);
	}
	
	//==========================================================
		// Game_Map
	//==========================================================
	
	/**
	 * Calls the method for handling Trap removal from the current map.
	 */
	const Game_Map_SetupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
		Game_Map_SetupEvents.call(this);

		this.removeTrapEvents();
	};
	
	/**
	 * If Trap removal is enabled(see "filterTrapEvents"),
	 * then this is where the found Trap Events are removed.
	 */
	Game_Map.prototype.removeTrapEvents = function() {
		const trapEvents = filterTrapEvents();
		for (const event of trapEvents) {
			this._events[event.id] = null;
		}
	};

})();
