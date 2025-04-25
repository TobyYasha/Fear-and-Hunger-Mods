//=============================================================================
/*:
 * @plugindesc v1.1.1 Displays Basic Stats and Element Resistances
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
 * Version 1.1.1: [4/25/2025]
 * - Changed "Hit Rate" display from "value - 1" to "value"
 *   - This means the starting "Hit Rate" will be 
 *     shown as 97% instead of -3%.
 * - Added failsafe in case failing to retrieve stat name.
 *
 * Version 1.1.0: [4/24/2025]
 * - Added a new page section for the following stats:
 *   - Hit Rate
 *   - Crit Rate
 *   - Evasion
 *   - M. Evasion
 *   - Resistance
 *   - M. Resistance
 * - Increased the maximum width for values.
 *   - Previously values such as "-50%" would be squashed.
 *   - Now the only values that get squashed are "-100%".
 * - Page contents wrap around when pressing LEFT / RIGHT
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
	// Constants -- Do not edit these values
//==========================================================

_.STAT_TYPE_PARAM = "param";
_.STAT_TYPE_XPARAM = "xparam";
_.STAT_TYPE_SPARAM = "sparam";
_.STAT_TYPE_ELEMENT = "element";

_.PAGE_TYPE_BASIC = "basic";
_.PAGE_TYPE_RESIST = "resist";
_.PAGE_TYPE_COMPLEX = "complex";

//==========================================================
	// Parameters -- You can edit these values 
//==========================================================

// These parameters determine what stats appear

// BODY, MIND, ATTACK, M.ATTACK, AGILITY
_.statIdsParam = [0, 1, 2, 4, 6];

// HIT RATE, CRIT RATE, PHY EVASION, MAG EVASION
_.statIdsXparam = [0, 2, 1, 4];

// PHY DAMAGE RATE, MAG DAMAGE RATE
_.statIdsSparam = [6, 7];

// BLUNT, SLASH, PIERCE, FIRE, OTHERWORDLY
_.statIdsElement = [1, 2, 3, 4, 6];

// Contains the names of displayed stats
_.statNamesXparam = {
	0: "Hit Rate",
	2: "Crit Rate",
	1: "Evasion",
	4: "M. Evasion",
}

// Contains the names of displayed stats
_.statNamesSparam = {
	6: "Resistance",
	7: "M. Resistance",
}

_.pageOrder = [
	_.PAGE_TYPE_BASIC,
	_.PAGE_TYPE_RESIST,
	_.PAGE_TYPE_COMPLEX
];

_.leftArrowSymbol = "\u2190";

_.rightArrowSymbol = "\u2192";

_.prevPageText = "Prev Page";

_.nextPageText = "Next Page";

//==========================================================
	// Window_StatCompare
//==========================================================

Window_StatCompare.PAGE_DIRECTION_LEFT = "left";
Window_StatCompare.PAGE_DIRECTION_RIGHT = "right";

const TY_Window_StatCompare_initialize = Window_StatCompare.prototype.initialize;
Window_StatCompare.prototype.initialize = function(wx, wy, ww, wh) {
	this._lineIndex = 0;
	this._arrowWidth = 0;
	this._paramNameWidth = 0;
	this._paramValueWidth = 0;
	this._pageType = _.pageOrder[0];
	TY_Window_StatCompare_initialize.call(this, wx, wy, ww, wh);
};

Window_StatCompare.prototype.changePage = function(direction) {
	if (Window_StatCompare.PAGE_DIRECTION_LEFT === direction) {
		this.changeLeftPage();
	} else {
		this.changeRightPage();
	}

	this.createWidths();
	this.refresh();
}

Window_StatCompare.prototype.changeLeftPage = function() {
	const lastIndex = _.pageOrder.length - 1;
	const currentIndex = _.pageOrder.indexOf(this._pageType);
	const newIndex = currentIndex - 1;

	if (newIndex < 0) {
		this._pageType = _.pageOrder[lastIndex];
	} else {
		this._pageType = _.pageOrder[newIndex];
	}
}

Window_StatCompare.prototype.changeRightPage = function() {
	const lastIndex = _.pageOrder.length - 1;
	const currentIndex = _.pageOrder.indexOf(this._pageType);
	const newIndex = currentIndex + 1;

	if (newIndex > lastIndex) {
		this._pageType = _.pageOrder[0];
	} else {
		this._pageType = _.pageOrder[newIndex];
	}
}

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
	let text = null;

	switch (statType) {
		case _.STAT_TYPE_PARAM:   text = TextManager.param(statId); break;
		case _.STAT_TYPE_XPARAM:  text = _.statNamesXparam[statId]; break;
		case _.STAT_TYPE_SPARAM:  text = _.statNamesSparam[statId]; break;
		case _.STAT_TYPE_ELEMENT: text = $dataSystem.elements[statId]; break;
	}

	return text ?? "";
}

Window_StatCompare.prototype.getStatValue = function(statType, statId, tempActor) {
	const actor = tempActor ? this._tempActor : this._actor;

	switch (statType) {
		case _.STAT_TYPE_PARAM:   return actor.param(statId);
		case _.STAT_TYPE_XPARAM:  return actor.xparam(statId);
		case _.STAT_TYPE_SPARAM:  return actor.sparam(statId);
		case _.STAT_TYPE_ELEMENT: return actor.elementRate(statId);
		default: return 0;
	}
}

Window_StatCompare.prototype.getOldStatValue = function(statType, statId) {
	let value = this.getStatValue(statType, statId, false);

	if (this.needsFormattedValue(statType)) {
		value = this.formatStatValue(statType, statId, value);
	}

	return value;
}

Window_StatCompare.prototype.getNewStatValue = function(statType, statId) {
	let value = this.getStatValue(statType, statId, true);

	if (this.needsFormattedValue(statType)) {
		value = this.formatStatValue(statType, statId, value);
	}
	
	return value;
}

Window_StatCompare.prototype.needsFormattedValue = function(statType) {
	return _.STAT_TYPE_PARAM !== statType;
};

Window_StatCompare.prototype.getFormatBaseValue = function(statType, statId, value) {
	if (_.STAT_TYPE_SPARAM === statType || _.STAT_TYPE_ELEMENT === statType) {
		return 1 - value;
	} else {
		return value;
	}
};

Window_StatCompare.prototype.formatStatValue = function(statType, statId, value) {
	const baseValue = this.getFormatBaseValue(statType, statId, value);
	const percentValue = baseValue * 100;
	return Math.round(percentValue.toFixed(2));
};

Window_StatCompare.prototype.getValueSymbol = function(statType) {
	return this.needsFormattedValue(statType) ? "%" : "";
};

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
	// This basically fits both a negative sign and percent symbol
	this._paramValueWidth = this.textWidth("00000");
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
		this.drawPageIndicators();
	}
};

Window_StatCompare.prototype.drawPageContents = function() {
	this._lineIndex = 0;

	const statTypes = this.getPageStatTypes();
	for (const statType of statTypes) {
		this.drawAllStats(statType);
	}
};

Window_StatCompare.prototype.drawAllStats = function(statType) {
	const statIds = this.getStatIds(statType);

	for (const statId of statIds) {
		const y = this.lineHeight() * this._lineIndex;
		this.drawStat(0, y, statType, statId);
		this._lineIndex++;
	}
};

// Replaces "drawItem"
Window_StatCompare.prototype.drawStat = function(x, y, statType, statId) {
	this.drawDarkRect(x, y, this.contents.width, this.lineHeight());
	this.drawStatName(y, statType, statId);
	this.drawOldStatValue(y, statType, statId);
	this.drawRightArrow(y);
	if (!this._tempActor) return;
	this.drawNewStatValue(y, statType, statId);
	this.drawStatDifference(y, statType, statId);
};

Window_StatCompare.prototype.drawStatName = function(y, statType, statId) {
	const statName = this.getStatName(statType, statId);
    const x = this.textPadding();

    this.changeTextColor(this.systemColor());
    this.drawText(statName, x, y, this._paramNameWidth);
};

// Replaces "drawCurrentParam"
Window_StatCompare.prototype.drawOldStatValue = function(y, statType, statId) {
	let x = this.contents.width - this.textPadding();
    x -= this._paramValueWidth * 3 + this._arrowWidth - this.textPadding() * 2;

    const value = this.getOldStatValue(statType, statId);
    const symbol = this.getValueSymbol(statType);

    this.resetTextColor();
    this.drawText(value + symbol, x, y, this._paramValueWidth, 'right');
};

// Overwrites "drawRightArrow"
Window_StatCompare.prototype.drawRightArrow = function(y) {
	let x = this.contents.width - this.textPadding();
    x -= this._paramValueWidth * 2 + this._arrowWidth - this.textPadding() * 2;

    this.changeTextColor(this.systemColor());
    this.drawText(_.rightArrowSymbol, x, y, this._arrowWidth, 'center');
};

// Replaces "drawNewParam"
Window_StatCompare.prototype.drawNewStatValue = function(y, statType, statId) {
    let x = this.contents.width - this.textPadding();
    x -= this._paramValueWidth * 2 - this.textPadding() * 2;

    const newValue = this.getNewStatValue(statType, statId);
    const diffValue = newValue - this.getOldStatValue(statType, statId);
    const symbol = this.getValueSymbol(statType);

    this.changeTextColor(this.paramchangeTextColor(diffValue));
    this.drawText(newValue + symbol, x, y, this._paramValueWidth, 'right');
};

Window_StatCompare.prototype.formatValueDifference = function(value) {
	if (value > 0) {
		return ' (+' + value + ')';
	} else {
		return ' (' + value + ')';
	}
};

// Replaces "drawParamDifference"
Window_StatCompare.prototype.drawStatDifference = function(y, statType, statId) {
    let x = this.contents.width - this.textPadding();
    x -= this._paramValueWidth - this.textPadding();

    const newValue = this.getNewStatValue(statType, statId);
    let diffValue = newValue - this.getOldStatValue(statType, statId);

    if (diffValue === 0) return;
    this.changeTextColor(this.paramchangeTextColor(diffValue));

    diffValue = this.formatValueDifference(diffValue);
    this.drawText(diffValue, x, y, this._paramValueWidth, 'left');
};

Window_StatCompare.prototype.drawPageIndicators = function() {
	this.resetTextColor();

	const rect = {
		y: this.lineHeight() * 6.3,
		width: this.contents.width / 2,
		height: this.lineHeight()
	}

	this.drawIndicator(Window_StatCompare.PAGE_DIRECTION_LEFT, rect);
	this.drawIndicator(Window_StatCompare.PAGE_DIRECTION_RIGHT, rect);
};

Window_StatCompare.prototype.getPageIndicatorText = function(direction) {
	if (Window_StatCompare.PAGE_DIRECTION_LEFT === direction) {
		return _.leftArrowSymbol + " " + _.prevPageText;
	} else {
		return _.nextPageText + " " + _.rightArrowSymbol;
	}
};

Window_StatCompare.prototype.drawIndicator = function(direction, rect) {
	const leftDirection = Window_StatCompare.PAGE_DIRECTION_LEFT;
	const padding = 32;

	const rectX = leftDirection === direction ? 0 : rect.width;
	const textX = leftDirection === direction ? padding / 2 : rect.width + padding;
	const text = this.getPageIndicatorText(direction);

	this.drawDarkRect(rectX, rect.y, rect.width, rect.height);
	this.drawText(text, textX, rect.y, this.textWidth(text), 'center');
};

// Deprecated

Window_StatCompare.prototype.drawItem = function() {};
Window_StatCompare.prototype.drawParamName = function() {};
Window_StatCompare.prototype.drawCurrentParam = function() {};
Window_StatCompare.prototype.drawNewParam = function() {};
Window_StatCompare.prototype.drawParamDifference = function() {};

//==========================================================
	// Scene_Equip
//==========================================================

Scene_Equip.prototype.canChangeComparePage = function() {
	return this._lowerRightVisibility && this._compareWindow;
};

Scene_Equip.prototype.updateLowerRightWindowTriggers = function() {
	if (!this.canChangeComparePage()) return;
	if (Input.isRepeated(Window_StatCompare.PAGE_DIRECTION_LEFT)) {
		this._compareWindow.changePage(Window_StatCompare.PAGE_DIRECTION_LEFT);
	} else if (Input.isRepeated(Window_StatCompare.PAGE_DIRECTION_RIGHT)) {
		this._compareWindow.changePage(Window_StatCompare.PAGE_DIRECTION_RIGHT);
	}
};

//==========================================================
	// Scene_Battle
//==========================================================

// Adds compatibility with commandequip.js by Jeneeus Guruman
const TY_Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
	TY_Scene_Battle_update.call(this);
	this.updateLowerRightWindowTriggers();
};

Scene_Battle.prototype.canChangeComparePage = function() {
	return this._compareWindow && this._compareWindow.visible;
};

Scene_Battle.prototype.updateLowerRightWindowTriggers = function() {
	if (!this.canChangeComparePage()) return;
	if (Input.isRepeated(Window_StatCompare.PAGE_DIRECTION_LEFT)) {
		this._compareWindow.changePage(Window_StatCompare.PAGE_DIRECTION_LEFT);
	} else if (Input.isRepeated(Window_StatCompare.PAGE_DIRECTION_RIGHT)) {
		this._compareWindow.changePage(Window_StatCompare.PAGE_DIRECTION_RIGHT);
	}
};

//==========================================================
	// End of File
//==========================================================

})(TY.detailedEquip);
