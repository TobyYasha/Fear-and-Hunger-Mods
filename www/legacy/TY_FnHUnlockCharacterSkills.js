//==========================================================
      // VERSION 1.1.0 -- By Toby Yasha
//==========================================================

var TY = TY || {};
TY.fnhUnlockCharacterSkills = TY.fnhUnlockCharacterSkills || {};

var Imported = Imported || {};
Imported.TY_FnHUnlockCharacterSkills = true;

(function(_) {

//==========================================================
      // Mod Constants --
//==========================================================

// The id of the map used for the hexen.
// Used Exclusively for Fear and hunger 2.
_.FNH_2_HEXEN_MAP_ID = 31;

// The switch ids of the character souls
// Used in Fear and hunger 1.
_.FNH_1_CHARACTER_SOUL_SWITCH_IDS = [
      1181, // Domination_soul -- D'arce
      1182, // Endless_soul -- Cahara
      1183, // tormented_soul -- Ragnvaldr
      1184, // Enlightened_soul -- Enki
];

// The switch ids of the character souls
// Used in Fear and hunger 2.
_.FNH_2_CHARACTER_SOUL_SWITCH_IDS = [
      493, // botanist_SOUL -- Olivia
      494, // exsoldier_SOUL -- Levi
      495, // Occultist_SOUL -- Marina
      496, // doctor_SOUL -- Daan
      497, // mechanic_SOUL -- Abela
      498, // journalist_SOUL -- Karin
      499, // fighter_SOUL -- Marcoh
      500, // yellow_mage_SOUL -- Osaa
      734, // apprentice_SOUL -- Samarie
      735, // hunter_SOUL -- August
      736, // chef_SOUL -- Henryk
      737, // mobster_SOUL -- Caligura
      738, // salaryman_SOUL -- Tanaka
      739, // lieutenant_SOUL -- Pav
];

//==========================================================
      // Mod Members --
//==========================================================

// the previous map visited by the player.
// Used Exclusively for Fear and hunger 2.
let _lastMapId = 0;

// check if the hexen event is currently ongoing
// Used Exclusively for Fear and hunger 1.
let _hexenEventActive = false;

// this is a container for the character soul switches
// it is used to preserve the state of the switches before
// going to the hexen scene.
_.characterSoulCache = {};

//==========================================================
      // Mod Methods -- Common
//==========================================================

// Check if the game is Fear & Hunger 2: Termina
function isGameTermina() {
      return $dataSystem.gameTitle.match(/TERMINA/gi);
}

// Get the character game switches based on the Fear & Hunger game
_.getCharacterSwitches = function() {
      return isGameTermina() ? _.FNH_2_CHARACTER_SOUL_SWITCH_IDS : _.FNH_1_CHARACTER_SOUL_SWITCH_IDS;
}

// Save the state of the character game switches before any hexen interactions.
// NOTE: This ensures that game switches are not permanently altered.
_.saveCharacterSwitches = function() {
      const switchIds = _.getCharacterSwitches();
      for (const switchId of switchIds) {
            _.characterSoulCache[switchId] = $gameSwitches.value(switchId);
      }
}

// Forcefully enable the character game switches.
// This is so that you can access any of their skills without killing them.
_.enableCharacterSwitches = function() {
      const switchIds = _.getCharacterSwitches();
      for (const switchId of switchIds) {
            $gameSwitches.setValue(switchId, true);
      }
}

// Restore the state of the character game switches to their original values.
// NOTE: This is done in order to ensure normal game functionality.
_.restoreCharacterSwitches = function() {
      const switchIds = Object.keys(_.characterSoulCache);
      for (const switchId of switchIds) {
            const value = _.characterSoulCache[switchId];
            $gameSwitches.setValue(switchId, value);
      }
}

// Triggered when the player activates the hexen table(in fear and hunger 1)
// Triggered when the player goes to the hexen map(in fear and hunger 2)
_.prepareHexenInteraction = function() {
      _.saveCharacterSwitches();
      _.enableCharacterSwitches();
}

// Triggered when the player deactivates the hexen table(in fear and hunger 1)
// Triggered when the player leaves to the hexen map(in fear and hunger 2)
_.concludeHexenInteraction = function() {
      _.restoreCharacterSwitches();
}

//==========================================================
      // Mod Methods -- Fear and Hunger 1
//==========================================================

// Check if the current event mentions variable 167 in its list of commands.
// May or not be the best approach for this, but it will have to do.
_.isHexenTableEvent = function(interpreterList) {
      // Code 122 = Control Variables
      // Parameter Index 0 - Variable 167 - HEXEN_soul_gem - Amount of "lesser soul" items
      return interpreterList && interpreterList.some(command => 
            command && command.code === 122 && command.parameters[0] === 167);
}

//==========================================================
      // Game Configurations -- Game_Interpreter
//==========================================================

// Check if the map event / common event is the hexen table event
const TY_Game_Interpreter_setup = Game_Interpreter.prototype.setup;
Game_Interpreter.prototype.setup = function(list, eventId) {
      TY_Game_Interpreter_setup.call(this, list, eventId);

      if (!_hexenEventActive && _.isHexenTableEvent(list)) {
            _.prepareHexenInteraction();
            _hexenEventActive = true;
      }
};

// conclude the hexen table event, if it was active
const TY_Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
Game_Interpreter.prototype.terminate = function() {
      TY_Game_Interpreter_terminate.call(this);

      if (_hexenEventActive) {
            _.concludeHexenInteraction();
            _hexenEventActive = false;
      }
};

const TY_Game_Switches_onChange = Game_Switches.prototype.onChange;
Game_Switches.prototype.onChange = function() {
      Game_Switches.prototype.onChange.call(this);

      
};

//==========================================================
      // Mod Methods -- Fear and Hunger 2
//==========================================================

// Get the id of the hexen map based on the Fear & Hunger game
_.getHexenMapId = function() {
      return isGameTermina() ? _.FNH_2_HEXEN_MAP_ID : 0;
}

// Do something with the character game switches
// depending on which map the player is going to
_.onMapTransfer = function(mapId) {
      const hexenMapId = _.getHexenMapId();

      // going to hexen
      if (hexenMapId === mapId) {
            _.prepareHexenInteraction();

      // leaving the hexen
      } else if (hexenMapId === _lastMapId) {
            _.concludeHexenInteraction();
      }

      _lastMapId = mapId;
}

//==========================================================
      // Game Configurations -- Game_Player
//==========================================================

// check if the player is going to or leaving the hexen map.
// Used Exclusively for Fear and hunger 2.
const TY_Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
      TY_Game_Player_reserveTransfer.call(this, mapId, x, y, d, fadeType);

      if (!isGameTermina()) return;

      _.onMapTransfer(mapId);
};

//==========================================================
      // End of File
//==========================================================

})(TY.fnhUnlockCharacterSkills);
