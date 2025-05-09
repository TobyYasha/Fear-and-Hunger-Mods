//==========================================================
      // VERSION 1.0.0 -- By Toby Yasha
//==========================================================

var TY = TY || {};
TY.fnhUnlockCharacterSkills = TY.fnhUnlockCharacterSkills || {};

var Imported = Imported || {};
Imported.TY_FnHUnlockCharacterSkills = true;

(function(_) {

//==========================================================
      // Mod Constants --
//==========================================================

_.FNH_1_HEXEN_MAP_ID = 0; // Not available for now // NOTE: This requires all maps with a hexen table
_.FNH_2_HEXEN_MAP_ID = 31; // NOTE: Might transform both map id constants into arrays

_.FNH_1_CHARACTER_SWITCHES = [
      // Not available for now
];

_.FNH_2_CHARACTER_SWITCHES = [
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

_.lastMapId = 0;

_.characterSwitchesCache = {};

//==========================================================
      // Mod Methods -- 
//==========================================================

// Check if the game is Fear & Hunger 2: Termina
function isGameTermina() {
      return $dataSystem.gameTitle.match(/TERMINA/gi);
}

// Get the id of the hexen map based on the Fear & Hunger game
_.getHexenMapId = function() {
      return isGameTermina() ? _.FNH_2_HEXEN_MAP_ID : _.FNH_1_HEXEN_MAP_ID;
}

// Get the character game switches based on the Fear & Hunger game
_.getCharacterSwitches = function() {
      return isGameTermina() ? _.FNH_2_CHARACTER_SWITCHES : _.FNH_1_CHARACTER_SWITCHES;
}

// Keep track of the last accessed map 
_.setLastMapId = function(mapId) {
      _.lastMapId = mapId;
}

// Get the last accessed map 
_.getLastMapId = function() {
      return _.lastMapId;
}

// Do something with the character game switches
// depending on which map the player is going to
_.onMapTransfer = function(mapId) {
      const hexenMapId = _.getHexenMapId();
      const lastMapId = _.getLastMapId();

      if (hexenMapId === mapId) {
            _.onHexenCurrentTransfer();
      } else if (hexenMapId === lastMapId) {
            _.onHexenPreviousTransfer();
      }
}

// What happens when we the player transfers to the hexen map
_.onHexenCurrentTransfer = function() {
      _.saveCharacterSwitches();
      _.enableCharacterSwitches();
}

// What happens when the player leaves the hexen map 
_.onHexenPreviousTransfer = function() {
      _.restoreCharacterSwitches();
}

// Save the state of the character game switches before going to the hexen map.
// NOTE: This ensures that game switches are not permanently altered.
_.saveCharacterSwitches = function() {
      const switchIds = _.getCharacterSwitches();
      for (const switchId of switchIds) {
            _.characterSwitchesCache[switchId] = $gameSwitches.value(switchId);
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

// Restore the state of the character game switches to normal
// upon leaving the hexen map.
// NOTE: This is done in order to ensure normal game functionality.
_.restoreCharacterSwitches = function() {
      const switchIds = Object.keys(_.characterSwitchesCache);
      for (const switchId of switchIds) {
            const value = _.characterSwitchesCache[switchId];
            $gameSwitches.setValue(switchId, value);
      }
}

//==========================================================
      // Game Configurations -- 
//==========================================================

const TY_Game_Player_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
      TY_Game_Player_reserveTransfer.call(this, mapId, x, y, d, fadeType);
      _.onMapTransfer(mapId);
      _.setLastMapId(mapId);
};

//==========================================================
      // End of File
//==========================================================

})(TY.fnhUnlockCharacterSkills);
