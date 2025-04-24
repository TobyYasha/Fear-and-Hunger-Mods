//=============================================================================
/*:
 * @plugindesc v1.1.0 Displays Basic Stats and Element Resistances
 * in the Equipment Scene.
 * @author Toby Yasha & Yanfly
 *
 * @help
 *
 * This plugin is used to display Basic Stats and Element Resistances.
 * Inside the Equip Scene you can toggle between them by pressing the:
 * 
 * A KEY
 * D KEY
 * LEFT ARROW KEY
 * RIGHT ARROW KEY
 *
 * Must be placed below YEP_ItemCore
 * Must be placed below YEP_EquipCore
 * This plugin can replace TY_RemoveLuck_YEP_EquipCore
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.1.0: [4/22/2025]
 * - 
 *
 * Version 1.0.1:
 * - Mod should now work even without editing the plugins.js file.
 * 
*/

var TY = TY || {};
TY.detailedEquip = TY.detailedEquip || {};

var Imported = Imported || {};
Imported.TY_DetailedEquip = true;

(function(_) {

//==========================================================
	// Constants
//==========================================================

_.STAT_TYPE_PARAM = "param";
_.STAT_TYPE_XPARAM = "xparam";
_.STAT_TYPE_SPARAM = "sparam";
_.STAT_TYPE_ELEMENT = "element";

_.PAGE_TYPE_BASIC = "basic";
_.PAGE_TYPE_RESIST = "resist";
_.PAGE_TYPE_COMPLEX = "complex";

//==========================================================
	// Parameters
//==========================================================

_.pageTextWidth = 120;

_.leftArrowSymbol = "\u2190";

_.rightArrowSymbol = "\u2192";

_.prevPageText = "Prev Page";

_.nextPageText = "Next Page";

// BODY, MIND, ATTACK, M.ATTACK, AGILITY
_.statIdsParam = [0, 1, 2, 4, 6];

// HIT RATE, CRIT RATE, PHY EVASION, MAG EVASION
_.statIdsXparam = [0, 2, 1, 4];

// PHY DAMAGE RATE, MAG DAMAGE RATE
_.statIdsSparam = [6, 7];

// BLUNT, SLASH, PIERCE, FIRE, OTHERWORDLY
_.statIdsElement = [1, 2, 3, 4, 6];

_.statNamesXparam = {
	0: "Hit Rate",
	2: "Crit Rate",
	1: "P. Evasion",
	4: "M. Evasion",
}

_.statNamesSparam = {
	6: "P. Resist",
	7: "M. Resist",
}

_.pageOrder = [
	_.PAGE_TYPE_BASIC,
	_.PAGE_TYPE_RESIST,
	_.PAGE_TYPE_COMPLEX
];

//==========================================================
	// Window_StatCompare
//==========================================================

const TY_Window_StatCompare_initialize = Window_StatCompare.prototype.initialize;
Window_StatCompare.prototype.initialize = function(wx, wy, ww, wh) {
	this._pageType = _.pageOrder[0];
	TY_Window_StatCompare_initialize.call(this, wx, wy, ww, wh);
};

Window_StatCompare.prototype.getPageStatTypes = function() {
	switch (this._pageType) {
		case _.PAGE_TYPE_BASIC:   return [_.STAT_TYPE_PARAM];
		case _.PAGE_TYPE_RESIST:  return [_.STAT_TYPE_ELEMENT];
		case _.PAGE_TYPE_COMPLEX: return [_.STAT_TYPE_XPARAM, _.STAT_TYPE_SPARAM];
		default: return [];
	}
}

Window_StatCompare.prototype.getStatIds = function(statType) {
	switch (statType) {
		case _.STAT_TYPE_PARAM:   return _.statIdsParam;
		case _.STAT_TYPE_XPARAM:  return _.statIdsXparam;
		case _.STAT_TYPE_SPARAM:  return _.statIdsSparam;
		case _.STAT_TYPE_ELEMENT: return _.statIdsElement;
		default: return [];
	}
}

Window_StatCompare.prototype.getStatName = function(statType, statId) {
	let text = "";

	switch (statType) {
		case _.STAT_TYPE_PARAM:   text = TextManager.param(statId); break;
		case _.STAT_TYPE_XPARAM:  text = _.statNamesXparam[statId]; break;
		case _.STAT_TYPE_SPARAM:  text = _.statNamesSparam[statId]; break;
		case _.STAT_TYPE_ELEMENT: text = $dataSystem.elements[statId]; break;
	}

	return text;
}

Window_StatCompare.prototype.createWidths = function() {
	this.updateArrowSymbolWidth();
	this.updateStatValueWidth();
	this.refreshStatNameWidth();
}

Window_StatCompare.prototype.updateArrowSymbolWidth = function() {
	const symbolWidth = this.textWidth(_.leftArrowSymbol);
	const padding = this.textWidth(" ");
	this._arrowWidth = symbolWidth + padding;
}

Window_StatCompare.prototype.updateStatValueWidth = function() {
	this._paramValueWidth = this.textWidth("0000");
}

Window_StatCompare.prototype.refreshStatNameWidth = function() {
	const statTypes = this.getPageStatTypes();

	this._paramNameWidth = 0;

	for (const statType of statTypes) {
		this.updateStatNameWidth(statType);
	}
}

Window_StatCompare.prototype.updateStatNameWidth = function(statType) {
    const statIds = this.getStatIds(statType);
    for (const statId of statIds) {
    	const statName = this.getStatName(statType, statId);
		const nameWidth = this.textWidth(statName);
		this._paramNameWidth = Math.max(nameWidth, this._paramNameWidth);
    }
}

Window_StatCompare.prototype.refresh = function() {
	this.contents.clear();
	if (this._actor) {
		this.drawPageContents();
	}
};

Window_StatCompare.prototype.drawPageContents = function() {
	this._lineIndex = 0;

	const statTypes = this.getPageStatTypes();
	for (const statType of statTypes) {
		this.drawPageStats(statType);
	}
};

Window_StatCompare.prototype.drawPageStats = function(statType) {
	const stats = this.getStatIds(statType);
	for (let i = 0; i < stats.length; i++) {

		const statId = stats[i];
		const y = this.lineHeight() * this._lineIndex;

		this.drawStat(0, y, statType, statId);
		this._lineIndex++;
	}
};

Window_StatCompare.prototype.drawStat = function(x, y, statType, statId) {
	this.drawDarkRect(x, y, this.contents.width, this.lineHeight());
	this.drawStatName(y, statType, statId);
	this.drawStatValue(y, statType, statId);
	this.drawRightArrow(y);
};

Window_StatCompare.prototype.drawStatName = function(y, statType, statId) {
	const statName = this.getStatName(statType, statId);
    const x = this.textPadding();

    this.changeTextColor(this.systemColor());
    this.drawText(statName, x, y, this._paramNameWidth);
};

Window_StatCompare.prototype.statValueX = function() {
	const padding = this.textPadding();
	const contentsWidth = this.contents.width;
	const valueWidth = this._paramValueWidth * 3;
	const symbolWidth = this._arrowWidth;
	return (contentsWidth - padding) - valueWidth + symbolWidth;
};

Window_StatCompare.prototype.drawStatValue = function(y, statType, statId) {
	const x = this.statValueX();
    const value = 100;
    this.resetTextColor();
    this.drawText(value, x, y, this._paramValueWidth, 'right');
};

Window_StatCompare.prototype.rightArrowX = function() {
	const padding = this.textPadding();
	const contentsWidth = this.contents.width;
	const valueWidth = this._paramValueWidth * 2;
	const symbolWidth = this._arrowWidth;
	return contentsWidth - padding - valueWidth + symbolWidth;
};

Window_StatCompare.prototype.drawRightArrow = function(y) {
	const x = this.rightArrowX();
    const width = this._arrowWidth;
    this.changeTextColor(this.systemColor());
    this.drawText(TY.detailedEquip.rightArrowSymbol, x, y, width, 'center');
};

//==========================================================
	// Scene_Equip
//==========================================================

// Check if the 'Window_StatCompare' is allowed to change its page
Scene_Equip.prototype.canChangeComparePage = function() {
	return this._lowerRightVisibility && this._compareWindow;
};

// Update the current displaying page information
Scene_Equip.prototype.updateLowerRightWindowTriggers = function() {
	if (!this.canChangeComparePage()) return;
	if (Input.isRepeated('left')) {
		this._compareWindow.setPage(1);
		this._compareWindow.createWidths();
		this._compareWindow.refresh();
	} else if (Input.isRepeated('right')) {
		this._compareWindow.setPage(2);
		this._compareWindow.createWidths();
		this._compareWindow.refresh();
	}
};

//==========================================================
	// End of File
//==========================================================

})(TY.detailedEquip);
