/*:
 * @plugindesc v1.0.1 - Calls common events for items without going to the map.
 * @author Toby Yasha
 *
 * @param optAutoActorClose
 * @text Auto Close Actor Window
 * @type boolean
 * @desc Automatically close the select actor window in the
 * item scene if you don't have any items to consume anymore.
 * @default true
 *
 * @param optCallItemCateg
 * @text Call By Item Category
 * @desc [Requires YEP_X_ItemCategories] Call the common event
 * of an item in the item scene based on the item's category.
 * @default food, healing
 *
 * @help
 *
 * ----------------------- HOW TO USE -----------------------------
 *
 * If you want the common event to be called in the item scene you
 * have to use one of the following methods:
 *
 * 1. Add the following notetag in the item's notebox:
 * <commonEventMenu>
 *
 * 2. Use the "Call By Item Category" parameter and add the
 * menu category of items you want to call.
 * example: food, healing
 *
 * NOTE: The menu category is based on the
 * notetag used by YEP_X_ItemCategories.
 * example: <Menu Category: Food>
 *
 * [!] IMPORTANT
 * If you used method 2 and want to omit an item from calling the
 * common event in the menu then add the following notetag in the
 * item's notebox:
 * <ignoreCommonEventMenu>
 *
 * [!] IMPORTANT
 * Be careful with how you write the notetags.
 * This does not apply to the menu category names
 * inside the "Call By Item Category" parameter.
 *
 * ----------------------- COMPATIBILITY --------------------------
 *
 * You should place this plugin below any plugin that interacts with
 * the item scene, like the YEP_ItemCore and YEP_X_ItemCategories.
 *
 * ------------------------ UPDATES -------------------------------
 *
 * Version 1.0 - 10/8/2024
 * - Released.
 *
 * Version 1.0.1 - 10/9/2024
 * - Fixed actor gauges not being properly updated after being
 *   automatically kicked out of the select actor window when
 *   the "Auto Close Actor Window" paramater is enabled.
 *   
 * - Fixed common events potentially being called because the
 *   "checkItemCategory" method would always return true if 
 *   YEP_X_ItemCategories wasn't imported.
 *
 */

var TY = TY || {};
TY.commonEventMenu = TY.commonEventMenu || {};
 
(function(_) {

//===============================================================
    // Parameters
//===============================================================

var params = PluginManager.parameters("TY_CommonEventMenu");
_.optAutoActorClose = params.optAutoActorClose === "true";
if (params.optCallItemCateg !== "") {
	_.optCallItemCateg = params.optCallItemCateg.split(",")
	.map(categ => categ.trimStart())
	.map(categ => categ.toLowerCase());
} else {
	_.optCallItemCateg = [];
}

//===============================================================
    // Scene_ItemBase
//===============================================================

_.Scene_ItemBase_initialize = Scene_ItemBase.prototype.initialize;
Scene_ItemBase.prototype.initialize = function() {
	_.Scene_ItemBase_initialize.call(this);
    this._interpreter = new Game_Interpreter();
    this._needsActorRefresh = false;
};

_.Scene_ItemBase_update = Scene_ItemBase.prototype.update;
Scene_ItemBase.prototype.update = function() {
    _.Scene_ItemBase_update.call(this);
    this._interpreter.update();
    this.updateActorRefresh();
};

// Check if an item should call a common event based on its menu category
Scene_ItemBase.prototype.checkItemCategory = function(item) {
	if (Imported.YEP_X_ItemCategories) {
		if (item && item.itemCategory) {
			const categories = item.itemCategory
			.map(categ => categ.trimStart())
			.map(categ => categ.toLowerCase());
			for (category of _.optCallItemCateg) {
				if (categories.includes(category)) {
					return true;
				}
			}
		}
	}
	return false;
};

// Check if the item should call the common event inside
// the item scene instead of the map scene
Scene_ItemBase.prototype.isCommonEventMenu = function() {
	const item = this.item();
	return (
		item && 
		item.meta.commonEventMenu || 
		(
			!item.meta.ignoreCommonEventMenu &&
			this.checkItemCategory(item)
		)
	);
};

// If no items are left to use just close the window
Scene_ItemBase.prototype.canHideActorWindow = function() {
	const item = this.item();
	return item && $gameParty.numItems(item) === 0 && _.optAutoActorClose;
};

// Because gauges don't get updated after using an item with a
// common event we need to force them to do so
// Bonus: If no more items are left to use just close the window
Scene_ItemBase.prototype.updateActorRefresh = function() {
	if (!this._interpreter.isRunning() && this._needsActorRefresh) {
		this._actorWindow.refresh();
		if (this.canHideActorWindow()) {
			this.hideSubWindow(this._actorWindow);
		}
		this._needsActorRefresh = false;
	}
};

_.Scene_ItemBase_checkCommonEvent = Scene_ItemBase.prototype.checkCommonEvent;
Scene_ItemBase.prototype.checkCommonEvent = function() {
	if (this.isCommonEventMenu()) {
		this._interpreter.setupReservedCommonEvent();
		this._needsActorRefresh = true;
	} else {
		_.Scene_ItemBase_checkCommonEvent.call(this);
	}
};

//==========================================================
    // End of File
//==========================================================

})(TY.commonEventMenu);
