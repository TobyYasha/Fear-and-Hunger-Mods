//==========================================================
	// VERSION 1.1.0 -- by Toby Yasha
//==========================================================

/*
	This mod has been made possible 
	thanks to the YEP_BattleEngineCore.js
	- by Yanfly -
*/

// This mod requires "YEP_BattleEngineCore.js" in order to function.

var TY = TY || {};
TY.fnhShowLimbHp = TY.fnhShowLimbHp || {};

var Imported = Imported || {};
Imported.TY_FnHShowLimbHP = true;

(function(_) {
	
//==========================================================
	// Mod Configurations
//==========================================================
	
// The following settings are meant to be edited by users:
	
_.valueDrawMode = 1; // 0 | 1 | 2 -- DEFAULT: 1

/*
	EXPLANATION:

	_.valueDrawMode - 
		This setting determines the way the health number is shown.
		Replace the number inside the "_.valueDrawMode" setting with
		the option you want:
		
		Options:
			0 - Draw no health number
	
			1 - Draw health number
	
			2 - Draw health as percentage

		How to change the setting, example:
		_.valueDrawMode = 2;

		NOTE: If the setting doesn't contain one of the options
		mentioned above, then option no. 1 will be used by default.
*/

//==========================================================
	// Mod Constants -- Do not edit
//==========================================================

_.VALUE_DRAW_NONE = 0;
_.VALUE_DRAW_WHOLE = 1;
_.VALUE_DRAW_PERCENT = 2;

// Since the "textRightBuffer" isn't exposed globally by "PrettySleekGauges"
// we must create it here so that we reference it for the mod.
//
// This is mostly useful for the "percent mode" display.
// See "Special_Gauge.prototype.drawTextAsPercent" for implementation.
let textRightBuffer = 0;

if (Imported.PrettySleekGauges) {
	let _p = PluginManager.parameters('PrettySleekGauges');
	textRightBuffer = parseInt(_p['Text Right Buffer'] || 2);
}

//==========================================================
	// Mod Methods -- General
//==========================================================

// Safely get the value of the hp drawing mode.
_.getValueDrawMode = function() {
	if (!_.hasOwnProperty("valueDrawMode")) return _.VALUE_DRAW_WHOLE;
	return _.valueDrawMode;
}

// check if an enemy entity represents the enemy's torso limb
//
// NOTE: To ensure this works with localization options,
// the implementation assumes that the enemy's png file
// contains the word "torso" inside it.
// 
// Example: guard1_torso.png
_.isEnemyTorsoLimb = function(enemy) {
	return enemy && enemy.battlerName().includes("torso");
}

// get the hp percentage threshold at which the enemy's torso is about to die.
// the "hp percentage threshold" is retrieved from the troop page conditions.
//
// Example: Troop > Conditions > Enemy HP > Enemy Instance - 75% or below
_.getTorsoHPRate = function(enemy) {
	const troopData = $gameTroop.troop();

	for (const page of troopData.pages) {
		if (!page && !page.conditions) continue;

		const c = page.conditions;

		if (!c.enemyValid) continue;

		const targetEnemy = $gameTroop.members()[c.enemyIndex];

		if (targetEnemy !== enemy) continue;

		// hp rate at which torso can be defeated
		// Format: enemy_hp <= hp_threshold(%)
		return c.enemyHp / 100;
	}

	// fallback - in case no match was found
	return 0;
}

// Get the arguments necessary to properly display the enemy's torso hp
// - hp => displays the enemy's current health
// - mhp => the enemy's max health(not displayed but still used)
// - hpRate => determines how much the gauge is filled
_.formatTorsoHP = function(enemy) {
	const torsoRate = _.getTorsoHPRate(enemy);
	const hpMod = enemy.hpRate() - torsoRate; // alter current value
	const mhpMod = 1 - torsoRate; // keep value static

	// no decimals
	const hp = Math.trunc(enemy.hp * hpMod);
	const mhp = Math.trunc(enemy.mhp * mhpMod);
	const hpRate = hp / mhp;

	return { hp, mhp, hpRate };
}

// display an error if "YEP_BattleEngineCore.js" is missing.
_.displayDependencyError = function() {
	if (Imported.YEP_BattleEngineCore) return;

	try {
		SceneManager.stop();
		Graphics.printError("Mod Error - TY_FnHShowLimbHP", `The following file is required in order to run the mod: "YEP_BattleEngineCore.js"`);
		AudioManager.stopAll();
	} catch (e) {
		//
	};
}

// run the error check
_.displayDependencyError();

//==========================================================
	// Mod Methods -- Sleek Gauges
//==========================================================

// Check whether to draw the hp term for the gauge.
// In this case, the term should be "Body".
_.canDrawSleekHpTerm = function() {
	return true;
}

// check if drawing the hp number is allowed for the gauge.
_.canDrawSleekHpValue = function() {
	return _.getValueDrawMode() !== _.VALUE_DRAW_NONE;
}

// check if the hp number should be represented as a percentage.
_.isSleekHpPercentMode = function() {
	return _.getValueDrawMode() === _.VALUE_DRAW_PERCENT;
}

//==========================================================
	// Window_Help
//==========================================================

const Window_Help_drawBattler = Window_Help.prototype.drawBattler;
Window_Help.prototype.drawBattler = function(battler) {
	if (!battler) return;

	if (battler.isActor()) {
		Window_Help_drawBattler.call(this, battler);

	} else {
		const width = this.contents.width;
    	const height = this.contents.height;
    	const x = 0;
    	const y = (height - this.lineHeight() * 2) / 2;
	
    	this.drawEnemyName(battler, x, y, width);
    	this.drawEnemyHp(battler, x, y, width);
	}
};

Window_Help.prototype.drawEnemyName = function(enemy, x, y, width) {
    this.drawText(enemy.name(), x, y, width, 'center');
};

Window_Help.prototype.drawEnemyHp = function(enemy, x, y, width) {
    const contentsWidth = width / 4;
    const gaugeWidth = width / 4;
    const gaugeX = x + contentsWidth + gaugeWidth / 2;
    const gaugeY = y + this.lineHeight();

	if (Imported.PrettySleekGauges) {
		this.drawSleekEnemyHp(enemy, gaugeX, gaugeY, gaugeWidth);
	} else {
		this.drawNormalEnemyHp(enemy, gaugeX, gaugeY, gaugeWidth);
	}
};

// Requires "PrettySleekGauges.js"
// NOTE: This should realistically be used only in Termina.
Window_Help.prototype.drawSleekEnemyHp = function(enemy, x, y, width) {
    // handle torso limb
    if (_.isEnemyTorsoLimb(enemy)) {

    	width = width || 186;

    	const args = _.formatTorsoHP(enemy);
    	this.drawAnimatedGauge(x, y, width, args.hpRate, this.hpGaugeColor1(), this.hpGaugeColor2(), "hp");
    	this.configureSleekEnemyGauge(x, y, args.hp, args.mhp);

    // handle normal limb
	} else {
		Window_Base.prototype.drawActorHp.call(this, enemy, x, y, width);
		this.configureSleekEnemyGauge(x, y, enemy.hp, enemy.mhp);
	}
};

// Configure how the hp value will be displayed by the sleek gauge
Window_Help.prototype.configureSleekEnemyGauge = function(gaugeX, gaugeY, hpValue, mhpValue) {
	const drawHpTerm = _.canDrawSleekHpTerm();
    const drawHpNumber = _.canDrawSleekHpValue();

   	// NOTE: If the format is "percent" mode, include the enemy's max hp for calculation reasons.
    const isPercentMode = _.isSleekHpPercentMode();
    const finalMhpValue = isPercentMode ? mhpValue : 0;

	// gauge configurations -- apply to any limb
	const gaugeInstance = this._gauges[this.makeGaugeKey(gaugeX, gaugeY)];
	gaugeInstance.setExtra(TextManager.hpA, hpValue, finalMhpValue);
   	gaugeInstance.setTextVisibility(drawHpTerm, drawHpNumber);
   	gaugeInstance.setPercentMode(isPercentMode);
}

Window_Help.prototype.drawNormalEnemyHp = function(enemy, x, y, width) {
	// handle torso limb
    if (_.isEnemyTorsoLimb(enemy)) {

    	const args = _.formatTorsoHP(enemy);

		width = width || 186;
    	const color1 = this.hpGaugeColor1();
    	const color2 = this.hpGaugeColor2();
    	this.drawGauge(x, y, width, args.hpRate, color1, color2);
    	this.changeTextColor(this.systemColor());
    	this.drawText(TextManager.hpA, x, y, 44); // 44 = width
    	this.drawCurrentAndMax(args.hp, args.mhp, x, y, width,
                           this.hpColor(enemy), this.normalColor());

    // handle normal limb
	} else {
		Window_Base.prototype.drawActorHp.call(this, enemy, x, y, width);
	}
};

// Relevant only for the "drawNormalEnemyHp" method.
Window_Help.prototype.drawCurrentAndMax = function(
	current, max, x, y, width, color1, color2
) {
	switch (_.getValueDrawMode()) {
		case _.VALUE_DRAW_NONE:
			// nothing here
			break;
		case _.VALUE_DRAW_WHOLE:
			this.drawHealthWhole(...arguments);
			break;
		case _.VALUE_DRAW_PERCENT:
			this.drawHealthPercentage(...arguments);
			break;
		default:
			this.drawHealthWhole(...arguments);
			break;
	}
};

// Relevant only for the "drawNormalEnemyHp" method.
Window_Help.prototype.drawHealthWhole = function(
	current, max, x, y, width, color1, color2
) {
    const valueWidth = this.textWidth(max);
    const x1 = x + width - valueWidth;
    this.changeTextColor(color1);
    this.drawText(current, x1, y, valueWidth, 'right');
};

// Relevant only for the "drawNormalEnemyHp" method.
Window_Help.prototype.drawHealthPercentage = function(
	current, max, x, y, width, color1, color2
) {
	// [NOTE] "toFixed" corrects weird looking float values
	let value = 100 * (current / max).toFixed(2);
	    value = Math.trunc(value);
    const valueWidth = this.textWidth(value);

    const percentSymbol = "%";
    const percentWidth = this.textWidth(percentSymbol);

    const text = value + percentSymbol;
    const x1 = x + width - valueWidth - percentWidth;
    const width1 = valueWidth + percentWidth;

    this.changeTextColor(color1);
    this.drawText(text, x1, y, width1, 'right');
};

//==========================================================
	// Special_Gauge
//==========================================================

if (Imported.PrettySleekGauges) { // start of Special_Gauge

// add the "_percentModeActive" property
const Special_Gauge_initialize = Special_Gauge.prototype.initialize;
Special_Gauge.prototype.initialize = function(x, y, w, r, c1, c2, basewindow, h, t) {
	Special_Gauge_initialize.call(this, ...arguments);

	this._percentModeActive = false;
}

// Method added by this mod
// Check whether the hp is displayed as a percentage or not.
Special_Gauge.prototype.isPercentMode = function() {
	return this._percentModeActive;
};

// Method added by this mod
// Set whether the hp value should be displayed as a percentage or not.
Special_Gauge.prototype.setPercentMode = function(value) {
	this._percentModeActive = value;
};

// Don't animate the gauge and numbers with the sleek gauge system.
//
// The reason for this is that it animates whenever a different limb is selected.
// Which doesn't look great at all. 
const Special_Gauge_shouldntAnimate = Special_Gauge.prototype.shouldntAnimate;
Special_Gauge.prototype.shouldntAnimate = function() {
    if (this._window instanceof Window_Help) {
    	return true;
    } else {
    	return Special_Gauge_shouldntAnimate.call(this);
    }
};

// Allow the "_maxVal" to be assigned "0" value as well.
//
// This way it can be included for calculations(for percent mode)
// And can be ignored otherwise(since 0 is the same as "false").
const Special_Gauge_setExtra = Special_Gauge.prototype.setExtra;
Special_Gauge.prototype.setExtra = function(text, val, max, yOffset) {
    if (typeof max === "number") this._maxVal = max;

    Special_Gauge_setExtra.call(this, ...arguments);
}

// Check whether to draw hp normally or as percentage
const Special_Gauge_drawText = Special_Gauge.prototype.drawText;
Special_Gauge.prototype.drawText = function() {
	if (this.isPercentMode()) {
		this.drawTextAsPercent();
	} else {
		Special_Gauge_drawText.call(this);
	}
}

// Mimic the implementation of "Special_Gauge.prototype.drawText".
// NOTE: We only draw the current value of the percentage.
Special_Gauge.prototype.drawTextAsPercent = function() {
    if (this._vocab) {
        var width = this._width;
        var x = this._x;
        var storeFontSize = this._window.contents.fontSize;
        this._window.contents.fontSize = this.fontSize();

        if (this._showEHPHP) {
            this._window.changeTextColor(this._window.systemColor());
            this._window.drawText(this._text, this._x + 1, this._y + this._yOffset);
            width -= this._window.textWidth(this._text);
            x += this._window.textWidth(this._text);
        }

        if (this._showEHPText) {
            width -= textRightBuffer;
            this._window.changeTextColor(this._window.normalColor());
            if (this.critText()) {
                if (this._curVal < this._maxVal / 10) {
                    this._window.changeTextColor(this._window.deathColor());
                } else if (this._curVal < this._maxVal / 4) {
                    this._window.changeTextColor(this._window.crisisColor());
                }
            }

            // draw the percentage value
            const percentSymbol = "%";
            let value = 100 * (this._curVal / this._maxVal).toFixed(2);
                value = Math.trunc(value);

            this._window.drawText(value + percentSymbol, x, this._y + this._yOffset, width, "right");
        }

        this._window.contents.fontSize = storeFontSize;
    }
}

// Fixed gauges not clearing number values when updating.
//
// NOTE: This fix will be already available in a future termina update,
// but for version 1.9.1(which doesn't include "TY_TerminaTweaks.js"), it will be added here.
if (!TY.terminaTweaks) {
    Special_Gauge.prototype.refresh = function() {
        var gy = this._y + this._window.lineHeight() - 2;
        if (this._vocab) {
    		this._window.contents.clearRect(this._x - 1, this._y, this._width + 2, this._window.lineHeight()); // Fixed Here
        } else {
            gy -= this._height;
            this._window.contents.clearRect(this._x, gy, this._width + 2, this._height);
        }
        this.drawGauge();
        this.drawText();
    }
}

} // end of Special_Gauge

//==========================================================
	// End of File
//==========================================================

})(TY.fnhShowLimbHp);
