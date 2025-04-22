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

//==========================================================
	// Parameters
//==========================================================

/* 
	Name: Value Digits
	Desc: How many digits can a number have before its squashed.
*/
_.valueDigits = 4;

/*
	Name: Value Spacing
	Desc: The spacing added between a stat's old and new value.
	This is used when equipping/unequipping a new equipment.
*/
_.valueSpacing = 65;

/*
	Name: Page Arrows
	Desc: Whether or not to draw arrow symbols next to the page text indicators
	Example: <- Prev Page | Next Page ->
*/
_.drawPageArrows = true;

/*
	Name: Page Text Width
	Desc: How wide the "Previous Page" and "Next Page" can be before its squashed.
*/
_.pageTextWidth = 120;

/*
	Name: Previous Page Text
	Desc: The text used for indicating the previous page.
	This is added at the bottom of the stat display.
*/
_.prevPageText = "Prev Page";

/*
	Name: Next Page Text
	Desc: The text used for indicating the next page.
	This is added at the bottom of the stat display.
*/
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

//==========================================================
	// Window_StatCompare
//==========================================================

const TY_Window_StatCompare_initialize = Window_StatCompare.prototype.initialize;
Window_StatCompare.prototype.initialize = function(wx, wy, ww, wh) {
	this._currentPage = 1;
	TY_Window_StatCompare_initialize.call(this, wx, wy, ww, wh);
};

// Check if the window should draw basic stats
Window_StatCompare.prototype.canDrawParams = function() {
	return this._actor && this._currentPage == 1;
};

// Check if the window should draw element resistances
Window_StatCompare.prototype.canDrawElements = function() {
	return this._actor && this._currentPage == 2;
};

// Check if the window should draw complex stats
Window_StatCompare.prototype.canDrawXSparams = function() {
	return this._actor && this._currentPage == 3;
};

Window_StatCompare.prototype.getStatIds = function(statType) {
	const list = {
		_.STAT_TYPE_PARAM:   _.statIdsParam,
		_.STAT_TYPE_XPARAM:  _.statIdsXparam,
		_.STAT_TYPE_SPARAM:  _.statIdsSparam,
		_.STAT_TYPE_ELEMENT: _.statIdsElement
	}
	return list[statType] || [];
}

Window_StatCompare.prototype.getStatName = function(statType, statId) {
	let text = "";
	switch (statType) {
		case _.STAT_TYPE_PARAM:
			text = TextManager.param(statId);
			break;
		case _.STAT_TYPE_XPARAM:
			text = _.xparamNames[statId];
			break;
		case _.STAT_TYPE_SPARAM:
			text = _.sparamNames[statId];
			break;
		case _.STAT_TYPE_ELEMENT:
			text = $dataSystem.elements[statId];
			break;
	}
	return text || "";
}

// Configurations relating the width of names and values
Window_StatCompare.prototype.createWidths = function() {
	this._paramNameWidth = 0;
	this._bonusValueWidth = _.valueSpacing;

	var valueWidth = ('').padZero(_.valueDigits);
	this._paramValueWidth = this.textWidth(valueWidth);
	this._arrowWidth = this.textWidth('\u2192' + ' ');

	if (this.canDrawParams()) {
		this.getParamWidth();
	} else if (this.canDrawElements()) {
		this.getElementWidth();
	} else if (this.canDrawXSparams()) {
		this.getXSparamWidth();
	}
}

Window_StatCompare.prototype.getMaxStatWidth = function(statType) {
    const statIds = this.getStatIds(statType);
    for (const statId of statIds) {
    	const statName = this.getStatName(statType, statId);
		const nameWidth = this.textWidth(statName);
		this._paramNameWidth = Math.max(nameWidth, this._paramNameWidth);
    }
}

// Get the largest basic stat name width
Window_StatCompare.prototype.getParamWidth = function() {
	var params = this.paramIdArray();
	for (var i = 0; i < params.length; i++) {
		var param = TextManager.param(params[i]);
		var nameWidth = this.textWidth(param);
		this._paramNameWidth = Math.max(nameWidth, this._paramNameWidth);
    }
}

// Get the largest element resistance name width
Window_StatCompare.prototype.getElementWidth = function() {
	var elements = this.elementIdArray();
	for (var i = 0; i < elements.length; i++) {
		var element = $dataSystem.elements[elements[i]];
		var nameWidth = this.textWidth(element);
		this._paramNameWidth = Math.max(nameWidth, this._paramNameWidth);
    }
}

// Get the largest complex stat name width
Window_StatCompare.prototype.getXSparamWidth = function() {
	var xparams = this.xparamIdArray();
	for (var i = 0; i < xparams.length; i++) {
		var xparam = _.xparamNames(xparams[i]) || "";
		var nameWidth = this.textWidth(xparam);
		this._paramNameWidth = Math.max(nameWidth, this._paramNameWidth);
    }

    var sparams = this.sparamIdArray();
	for (var i = 0; i < sparams.length; i++) {
		var sparam = .sparamNames(sparams[i]) || "";
		var nameWidth = this.textWidth(sparam);
		this._paramNameWidth = Math.max(nameWidth, this._paramNameWidth);
    }
}

// Refresh the contents of the window
Window_StatCompare.prototype.refresh = function() {
	this.contents.clear();
	this.drawPageLayout();
	if (this.canDrawParams()) {
		this.drawParamList();
	} else if (this.canDrawElements()) {
		this.drawElementList();
	} else if (this.canDrawXSparams()) {
		this.drawXSparamList();
	}
};

// Makes a list of basic stats to display
Window_StatCompare.prototype.drawParamList = function() {
	var params = this.paramIdArray();
	for (var i = 0; i < params.length; i++) {
		var paramId = params[i];
		var posY = this.lineHeight() * i;
		this.drawParam(0, posY, paramId);
	}
};

// Makes a list of element resistances to display
Window_StatCompare.prototype.drawElementList = function() {
	var elements = this.elementIdArray();
	for (var i = 0; i < elements.length; i++) {
		var elementId = elements[i];
		var posY = this.lineHeight() * i;
		this.drawElement(0, posY, elementId);
	}
};

Window_StatCompare.prototype.drawXSparamList = function() {
	
};

// Draw the names and values of basic stats
// [Note] Alias for the original "drawItem" method
Window_StatCompare.prototype.drawParam = Window_StatCompare.prototype.drawItem;

// Draw the names and values of element resistances
Window_StatCompare.prototype.drawElement = function(x, y, elementId) {
    this.drawDarkRect(x, y, this.contents.width, this.lineHeight());
	this.drawElementName(y, elementId);
	this.drawOldElementValue(y, elementId);
	this.drawRightArrow(y);
	if (!this._tempActor) return;
	this.drawNewElementValue(y, elementId);
	this.drawElementDifference(y, elementId);
};

// Draw the name of an element from the database
Window_StatCompare.prototype.drawElementName = function(y, elementId) {
    var x = this.textPadding();
    this.changeTextColor(this.systemColor());
    this.drawText($dataSystem.elements[elementId], x, y, this._paramNameWidth);
};

// Format the value of an element resistance for better understanding
Window_StatCompare.prototype.formatElementValue = function(elementId, tempActor) {
	var target = tempActor ? this._tempActor : this._actor;
	var value = target.elementRate(elementId);
	return Math.round(((1 - value) * 100).toPrecision(3));
};

// Compares the current value and the new value of an element resistance
Window_StatCompare.prototype.getElementDifference = function(elementId) {
    var newValue = this.formatElementValue(elementId, true);
    var oldValue = this.formatElementValue(elementId, false);
	var diffValue = newValue - oldValue;
	this.applyDifferenceColor(diffValue);
    return [newValue, diffValue];
};

// Reflect a negative or positive difference with its appropriate color
Window_StatCompare.prototype.applyDifferenceColor = function(value) {
	this.changeTextColor(this.paramchangeTextColor(value));
};

// Draw the current value of an element resistance
Window_StatCompare.prototype.drawOldElementValue = function(y, elementId) {
    var x = this.contents.width - this.textPadding();
    x -= this._paramValueWidth * 2 + this._arrowWidth + this._bonusValueWidth;
    this.resetTextColor();
    var value = this.formatElementValue(elementId, false) + '%';
    this.drawText(value, x, y, this._paramValueWidth, 'right');
};

// Draw the new value of an element resistance
Window_StatCompare.prototype.drawNewElementValue = function(y, elementId) {
    var x = this.contents.width - this.textPadding();
    x -= this._paramValueWidth + this._bonusValueWidth;
    var value = this.getElementDifference(elementId)[0] + '%';
    this.drawText(value, x, y, this._paramValueWidth, 'right');
};

// Draws the total gain/loss from changing a piece of equipment
Window_StatCompare.prototype.drawElementDifference = function(y, elementId) {
    var x = this.contents.width - this.textPadding();
    x -= this._bonusValueWidth;
    var value = this.getElementDifference(elementId)[1];
    if (value === 0) return;
    var text = Yanfly.Util.toGroup(value);
    if (value > 0) {
      text = ' (+' + text + ')';
    } else {
      text = ' (' + text + ')';
    }
    this.drawText(text, x, y, this._bonusValueWidth, 'left');
};

// If allowed, will add arrows to the page text
Window_StatCompare.prototype.formatPageText = function(text, facing) {
	if (_.drawPageArrows) {
		return facing == 'left' ? '\u2190 '+ text : text + ' \u2192';
	} else {
		return text;
	}
};

// Display labels indicating the page layout
Window_StatCompare.prototype.drawPageLayout = function() {
	this.resetTextColor();
	var x = this.contents.width / 2;
	var y = this.lineHeight() * 6.3;
	var layoutWidth = _.pageTextWidth;
	var prevPageText = this.formatPageText(_.prevPageText, 'left');
	var nextPageText = this.formatPageText(_.nextPageText, 'right');
    this.drawDarkRect(0, y, this.contents.width / 2, this.lineHeight());
    this.drawDarkRect(x, y, this.contents.width / 2, this.lineHeight());
	this.drawText(prevPageText, 32, y, layoutWidth, 'center');
	this.drawText(nextPageText, this.contents.width / 1.65, y, layoutWidth, 'center');
};

// Set the current displaying page
Window_StatCompare.prototype.setPage = function(value) {
    this._currentPage = value;
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

})();
