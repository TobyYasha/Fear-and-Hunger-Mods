//==========================================================
	// TY_ModLoader -- By Toby Yasha
//==========================================================

// 11/10/2023 - 3:36 PM
// [Note] This version of the mod loader will no longer be in use.
// A new version is currently being made from the ground up.
// You can view an early build inside the "mods" folder in the repository.

//==========================================================
	// How to use
//==========================================================

// NOTE: You will know if you are in the "www" folder if there's an "index.html" file inside.

// How to enable this plugin -->
// 1. Inside the "index.html" file paste the following:
// <script type="text/javascript" src="mods/TY_ModLoader.js"></script>
// 2. Attention! Make sure the pasted text is below the following:
// <script type="text/javascript" src="js/main.js"></script>
// 3. Create a new folder inside the "www" folder called "mods".
// 4. Place the "TY_ModLoader.js" inside of the newly create "mods" folder.
// 5. Done, now you can load mods!

// How to add a mod -->
// 1. Place your mod file inside the newly create "mods" folder.
// 2. Insert mod's file name without the js extension inside "TY.MOD_LIST"
// 3. After inserting the name you must also place it between quotation marks
// 4. ???
// 5. profit

// How to add more than 1 mod -->
// 1. Mods must be separated by a comma
// 2. You can't have the same mod loaded twice or more times
// 3. Please do not include the "//" double slashes if you decide to copy the example
// EXAMPLE:
// 
// var TY.MOD_LIST = [
// 	'TY_YEP_ItemCore',
// 	'TY_DetailedEquip',
// ];
//

//==========================================================
	// Functional aspect
//==========================================================

var TY = {};
TY.MOD_FILEPATH = 'mods/';

TY.MOD_LIST = [];

// Check if the mod was already added in the game
TY.isModAdded = function(modName) {
	return PluginManager._scripts.contains(modName);
}

// Check if the mod was already added in the game
TY.loadGameMods = function() {
	var defaultPath = PluginManager._path;
	if (this.MOD_LIST.length > 0) {
		PluginManager._path = TY.MOD_FILEPATH;
		this.MOD_LIST.forEach(function(gameMod) {
			if (!this.isModAdded(gameMod)) {
				PluginManager.loadScript(gameMod + '.js');
				PluginManager._scripts.push(gameMod);
			}
		}, this);
	}
	PluginManager._path = defaultPath;
}

TY.loadGameMods();
