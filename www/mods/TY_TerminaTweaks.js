/*:
 * @plugindesc v1.4 - Includes a list of QoL and General changes to the game.
 * @author Fear & Hunger Group - Toby Yasha, Fokuto, Nemesis, Atlasle
 *
 * @param optAnimWait
 * @text Wait for Animation
 * @type boolean
 * @desc Wait for animations to stop playing before damaging/healing battlers.
 * @default true
 *
 * @param optReflectWait
 * @text Wait for Reflect
 * @type boolean
 * @desc Wait for reflect animation to stop playing before applying effect.
 * @default true
 *
 * @help
 *
 * ------------------------ CHANGES ------------------------------
 *
 * PrettySleekGauges Changes:
 * - Fixed gauges not clearing number values when updating.
 *
 * General Changes:
 * - Fixed battle status window showing status effect icons.
 * - Added option for enabling/disabling waiting for 
 *   animations to complete before applying damage/healing.
 * - Fixed 'scope' of null and hopefully 'action' of null crashes
 *   by porting changes from the RPG Maker MZ 1.7.0 update.
 *
 * YEP_BattleEngineCore Changes:
 * - Added option for enabling/disabling waiting
 *   for reflect animation before applying effect.
 * - Prevents access to the party window(Fight, Run) by any means.
 * - Prevents actor window from changing selected command when pressing cancel.
 *
 * YEP_X_AnimatedSVEnemies Changes:
 * - Fixed crash when trying to update enemy position.
 *
 * GALV_LayerGraphics Changes:
 * - Fixed crash on hexen scene by preventing the plugin from 
 *   removing non-existing layers.
 *
 * HIME_EnemyReinforcements Changes:
 * - Fixed enemy sprites being on top of actor sprites in battle.
 *
 * Place below these plugins or as low as possible:
 * - PrettySleekGauges
 * - YEP_BattleEngineCore
 * - YEP_X_AnimatedSVEnemies
 * - HIME_EnemyReinforcements
 *
 * ------------------------ UPDATES ------------------------------
 *
 * Version 1.1 - 10/1/2024
 * - Added plugin parameters for animation waiting.
 * - Improved code to prevent potential errors if 
 * certain plugins are not present.
 * - Fixed a bug with the party window code that prevented
 *   actors from cancelling their actions.
 * - Added fix for a crash with YEP_X_AnimatedSVEnemies.
 * 
 * Version 1.2 - 10/2/2024
 * - Added fix for crashes related to forced actions in battle:
 *   'scope' of null and hopefully 'action' of null.
 *
 * Version 1.3 - 10/4/2024
 * - Added fix for crashing on hexen due to GALV_LayerGraphics
 *   trying to remove invalid layer.
 *
 * Version 1.3.1 - 10/5/2024
 * - Removed GALV_LayerGraphics fix from this plugin, instead
 *   fix is applied directly on the GALV_LayerGraphics.js plugin.
 *   NOTE: This is done in order to prevent "Sprite_LayerGraphicS
 *   is not defined" from happening.
 *
 * Version 1.4 - 10/6/2024
 * - Added a fix for wrong sprite layering caused by 
 *   HIME_EnemyReinforcements in battle.
 *  
 */

var TY = TY || {};
TY.terminaTweaks = TY.terminaTweaks || {};
 
(function(_) {

//===============================================================
    // Parameters
//===============================================================

var params = PluginManager.parameters("TY_TerminaTweaks");

//===============================================================
	// Special_Gauge
//===============================================================

// Fixed gauges not clearing number values when updating(by Toby Yasha).
if (Imported.PrettySleekGauges) {
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

//===============================================================
	// Window_BattleStatus
//===============================================================

// Fixed battle status window showing status effect icons(by Toby Yasha).
Window_BattleStatus.prototype.drawActorIcons = function() {
	// 
};

//===============================================================
	// Spriteset_Battle
//===============================================================

// Fixed animations delaying damage application(by Fokuto).
if (params.optAnimWait === "false") {
    Spriteset_Battle.prototype.isAnimationPlaying = function() {
        return false;
    };
}

// Fixes enemy sprites in battle overlaping actor sprites.
if (Imported.EnemyReinforcements) { // HIME_EnemyReinforcements
    /*_.Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _.Spriteset_Battle_createLowerLayer.call(this);
        this.reorderBattlerSprites();
    };*/

    _.Spriteset_Battle_refreshEnemyReinforcements = Spriteset_Battle.prototype.refreshEnemyReinforcements;
    Spriteset_Battle.prototype.refreshEnemyReinforcements = function() {
        _.Spriteset_Battle_refreshEnemyReinforcements.call(this);
        //this.reorderBattlerSprites();
    }

    // Get the index of the last enemy, then use it to move
    // the first actor above the enemies in the battlefield container.
    // Then move the rest of the actors based on the index of the previous actor.
    Spriteset_Battle.prototype.reorderBattlerSprites = function() {
        const lastEnemyIndex = this._enemySprites.length - 1;
        if (lastEnemyIndex >= 0) {
            const enemy = this._enemySprites[lastEnemyIndex];
            const enemyIndex = this._battleField.getChildIndex(enemy);
            for (let i = 0; i < this._actorSprites.length; i++) {
                const actor = this._actorSprites[i];
                if (i === 0) {
                    this._battleField.setChildIndex(actor, enemyIndex);
                } else {
                    const prevActor = this._actorSprites[i - 1];
                    const prevIndex = this._battleField.getChildIndex(prevActor);
                    this._battleField.setChildIndex(actor, prevIndex);
                }
            }
        }
    }
}

// Sort battle sprites only once instead of every frame
// VE_BasicModule -- VE_FogAndOverlay
_.Spriteset_Battle_sortBattleSprites = Spriteset_Battle.prototype.sortBattleSprites;
Spriteset_Battle.prototype.sortBattleSprites = function() {
    if (!this._battleSpritesSorted) {
        _.Spriteset_Battle_sortBattleSprites.call(this);
        this._battleSpritesSorted = true;
    }
};

// 1. Check these out, they are messing with the sprite order in battle

// Spriteset_Battle.prototype.sortBattleSprites -- VE_BasicModule
// Spriteset_Battle.prototype.update -- VE_FogAndOverlay


// 2. Afterwards look into adding an interpreter inside the menu to
// call common events, but add the option to still call the map
// interpreter.

// Items will have a notetag to decide which to call.
// The intent is to not have the menu close when consuming food.
// But still be able to access the map if wanting to view the game map for example.

//===============================================================
	// Window_BattleLog
//===============================================================

// Fixed the reflect animation delay(by Toby Yasha).
if (Imported.YEP_BattleEngineCore && params.optReflectWait === "false") {
    Window_BattleLog.prototype.displayReflection = function(target) {
        if (Yanfly.Param.BECShowRflText) {
            this.addText(TextManager.magicReflection.format(target.name()));
        }
        target.performReflection();
        var animationId = BattleManager._action.item().animationId;
        this.showNormalAnimation([BattleManager._subject], animationId);
    };
}

//===============================================================
	// Scene_Battle
//===============================================================

// Revert the cancel method to what it was in the engine originally
// This is because there was a conflict with YEP_BattleEngineCore
_.Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
    _.Scene_Battle_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
};

// Revert the method back to what it was in the engine originally
// This is because there was a conflict with YEP_BattleEngineCore
Scene_Battle.prototype.selectPreviousCommand = function() {
    BattleManager.selectPreviousCommand();
    this.changeInputWindow();
}

// Skip party command window
Scene_Battle.prototype.changeInputWindow = function() {
    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
            this.startActorCommandSelection();
        } else {
            this.selectNextCommand();
        }
    } else {
        this.endCommandSelection();
    }
};

//===============================================================
    // Window_ActorCommand
//===============================================================

// Removes the select method because now when press "cancel"
// we don't go to the party command window anymore so this
// just resets the index back to 0, which is annoying.
Window_ActorCommand.prototype.selectLast = function() {
    if (this._actor && ConfigManager.commandRemember) {
        var symbol = this._actor.lastCommandSymbol();
        this.selectSymbol(symbol);
        if (symbol === 'skill') {
            var skill = this._actor.lastBattleSkill();
            if (skill) {
                this.selectExt(skill.stypeId);
            }
        }
    }
};

//===============================================================
    // Sprite_Animation
//===============================================================

// Fixed crash caused by YEP_X_AnimatedSVEnemies.js at line 2773
// The problem is that "parent" can be null and if "parent._battler" is called
// then that results in an error.
if (Imported.YEP_X_AnimatedSVEnemies) {
    _.Sprite_Animation_updateSvePosition = Sprite_Animation.prototype.updateSvePosition;
    Sprite_Animation.prototype.updateSvePosition = function() {
        if (this._target.parent) {
            _.Sprite_Animation_updateSvePosition.call(this);
        }
    };
}

//===============================================================
    // BattleManager
//===============================================================

// Make sure battler exists and has actions if being forced to act.
// NOTE: This is ported from the RPG Maker MZ 1.7.0 update.
_.BattleManager_forceAction = BattleManager.forceAction;
BattleManager.forceAction = function(battler) {
    if (battler && battler.numActions() > 0) {
        _.BattleManager_forceAction.call(this, battler);
    }
};

//===============================================================
    // Game_Battler
//===============================================================

// Add a new action only if set skill is valid.
// NOTE: This is ported from the RPG Maker MZ 1.7.0 update.
Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
    this.clearActions();
    const action = new Game_Action(this, true);
    action.setSkill(skillId);
    if (targetIndex === -2) {
        action.setTarget(this._lastTargetIndex);
    } else if (targetIndex === -1) {
        action.decideRandomTarget();
    } else {
        action.setTarget(targetIndex);
    }
    if (action.item()) {
        this._actions.push(action);
    }
};

// This code is to allow dev tools in deployed version
SceneManager.onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
        case 116: // F5
            if (Utils.isNwjs()) {
                location.reload();
            }
            break;
        case 119: // F8
            if (Utils.isNwjs()) {
                require('nw.gui').Window.get().showDevTools();
            }
            break;
    case 123: // F12
            if (Utils.isNwjs()) {
                event.preventDefault();
            }
            break;
        }
    }
};

})(TY.terminaTweaks);
