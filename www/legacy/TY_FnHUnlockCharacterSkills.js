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

// The id of the switch used by the hexen system cursor.
// This is used to track whether or not the hexen table is in use.
//
// Used Exclusively for Fear and hunger 1.
_.FNH_1_HEXEN_CURSOR_SWITCH_ID = 1210;

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

// Check if an event matches the graphic used by the hexen table
_.isHexenTableEvent = function(eventId) {
      const mapEvent = $gameMap.event(eventId);

      return (
            mapEvent &&
            mapEvent.characterName() === "!blood3" &&
            mapEvent.characterIndex() === 6
      );
}

// Called whenever a map event may be starting
// Check if the event that's about to start is the hexen table event.
_.onMapEventStart = function(eventId, isStarting) {
      if (isGameTermina()) return;

      if (isStarting && _.isHexenTableEvent(eventId)) {
            _.prepareHexenInteraction();
      }
}

// Called whenever a game switch changes its value.
// Check if the hexen cursor switch has been set to OFF.
//
// NOTE: if the hexen cursor switch is OFF that means the hexen interaction has ended.
_.onSwitchUpdated = function(switchId, newValue) {
      if (isGameTermina()) return;
      if (_.FNH_1_HEXEN_CURSOR_SWITCH_ID !== switchId) return;

      if (!newValue) _.concludeHexenInteraction();
}

//==========================================================
      // Game Configurations -- Game_Map
//==========================================================

// Whenever an event is about to start, send a signal
//
// Used Exclusively for Fear and hunger 1.
const TY_Game_Map_setupStartingMapEvent = Game_Map.prototype.setupStartingMapEvent;
Game_Map.prototype.setupStartingMapEvent = function() {
      const isStarting = TY_Game_Map_setupStartingMapEvent.call(this);

      const eventId = this._interpreter.eventId();
      _.onMapEventStart(eventId, isStarting);

      return isStarting;
};

//==========================================================
      // Game Configurations -- Game_Interpreter
//==========================================================

// Whenever a switch's value is changed via eventing, send a signal
//
// Used Exclusively for Fear and hunger 1.
const TY_Game_Interpreter_command121 = Game_Interpreter.prototype.command121;
Game_Interpreter.prototype.command121 = function() {
      
      const switchId = this._params[0];
      const newValue = this._params[2] === 0; // 0 = true, 1 = false

      _.onSwitchUpdated(switchId, newValue);

      return TY_Game_Interpreter_command121.call(this);
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
