/*:
 * @plugindesc v1.8.1 - Includes a list of QoL and General changes to the game.
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
 * - Fixed Hardened heart and Last Defense reducing damage
 *   by too much.
 * - Fixed select highlight not playing correctly on
 *   enemies when they have a state animation.
 * - Fixed jittering when moving in the overworld.
 * - Fixed 0% state rate to not clear status when
 *   equipping equipment.
 * - Added failsafe measurements to actions if subject doesn't 
 *   exist anymore.
 *   This should hopefully limit or remove crashes caused by actions.
 *
 * YEP_BattleEngineCore Changes:
 * - Added option for enabling/disabling waiting
 *   for reflect animation before applying effect.
 * - Prevents access to the party window(Fight, Run) by any means.
 * - Prevents actor window from changing selected command when pressing cancel.
 * - Fixed crash when unable to retrieve action speed.
 *
 * YEP_X_AnimatedSVEnemies Changes:
 * - Fixed crash when trying to update enemy position.
 *
 * GALV_LayerGraphics Changes:
 * - Fixed crash on hexen scene by preventing the plugin from 
 *   removing non-existing layers.
 *
 * HIME_EnemyReinforcements Changes:
 * - Fixed enemy sprites being on top of actor sprites in battle
 *   when adding reinforcements.
 *
 * VE_BasicModule/VE_FogAndOverlay Changes:
 * - Fixed sprite order in battle being messed up because it was
 *   updated every frame.
 *
 * malcommandequip_edits Changes:
 * - Extra turn label will now be hidden when in the equipment menu.
 * 
 * Galv_ExAgiTurn Changes:
 * - Extra turn label will now be hidden when in the equipment menu.
 *
 * Place below these plugins or as low as possible:
 * - PrettySleekGauges
 * - YEP_BattleEngineCore
 * - YEP_BuffsStatesCore
 * - YEP_X_AnimatedSVEnemies
 * - HIME_EnemyReinforcements
 * - VE_BasicModule
 * - VE_FogAndOverlay
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
 * Version 1.5 - 10/8/2024
 * - Added a fix to a method from VE_BasicModule/VE_FogAndOverlay
 *   which was messing with the order of battle sprites.
 *
 * Version 1.6 - 10/9/2024
 * - Added a fix for crashing due to not being able to retrieve 
 *   action speed from YEP_BattleEngineCore's Game_Action method.
 *
 * Version 1.7 - 10/11/2024
 * - Added a fix for select highlight not playing correctly on
 *   enemies when they have a state animation.
 * - Added a fix Hardened heart and Last Defense reducing damage
 *   by too much.
 * - Added a fix for jittering when moving in the overworld.
 * - Added a fix for 0% state rate to not prevent statuses when
 *   inflicted with certain hits/add state.
 *
 * Version 1.8 - 10/12/2024
 * - Added failsafe measurements to actions if subject doesn't exist
 *   anymore.
 *
 * Version 1.8.1 - 10/15/2024
 * - Removed the fix for jittering in the overworld.
 * - Added checks for the extra turn label so that it gets hidden
 *   when in the Equip menu.
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

// Added member to keep track of battle sprites
// sorts done by VE_BasicModule -- VE_FogAndOverlay
_.Spriteset_Battle_initialize = Spriteset_Battle.prototype.initialize;
Spriteset_Battle.prototype.initialize = function() {
    _.Spriteset_Battle_initialize.call(this);
    this._battleSpritesSorted = false;
}

// Fixes enemy sprites in battle overlaping actor sprites.
if (Imported.EnemyReinforcements) { // HIME_EnemyReinforcements
    _.Spriteset_Battle_refreshEnemyReinforcements = Spriteset_Battle.prototype.refreshEnemyReinforcements;
    Spriteset_Battle.prototype.refreshEnemyReinforcements = function() {
        _.Spriteset_Battle_refreshEnemyReinforcements.call(this);
        this.reorderBattlerSprites();
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

if (Imported['VE - Basic Module']) { // VE_BasicModule -- VE_FogAndOverlay
    // Sort battle sprites only once instead of every frame
    _.Spriteset_Battle_sortBattleSprites = Spriteset_Battle.prototype.sortBattleSprites;
    Spriteset_Battle.prototype.sortBattleSprites = function() {
        if (!this._battleSpritesSorted) {
            _.Spriteset_Battle_sortBattleSprites.call(this);
            this._battleSpritesSorted = true;
        }
    };
}

//===============================================================
    // Sprite_Battler
//===============================================================

// Fix select highlight not playing if the enemy has a state animation which makes their sprite flash
Sprite_Battler.prototype.updateSelectionEffect = function() {
    var target = this._effectTarget;
    if (this._battler.isSelected()) {
        this._selectionEffectCount++;
        if (this._selectionEffectCount % 30 < 15) {
            target._colorTone = [40, 40, 40, 40];
            target.setBlendColor([255, 255, 255, 1]);
        } else {
            target._colorTone = [0, 0, 0, 0];
            target.setBlendColor([0, 0, 0, 0]);
        }
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target._colorTone = [0, 0, 0, 0];
        target.setBlendColor([0, 0, 0, 0]);
    }
};

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

// make the extra turn label hide itself in the equip menu
Scene_Battle.prototype.commandEquipment = function() {
	fEXTURNvisible = false;
	fWINDOWopen = true;
    MalcommandEquipment.call(this);
	BattleManager.actor()._origEquips = [];
	for (i = 0; i < BattleManager.actor()._equips.length; i++ ) {
	   if (BattleManager.actor()._equips[i]) {
	       BattleManager.actor()._origEquips[i] = BattleManager.actor()._equips[i]._itemId;
	   } else {
	       BattleManager.actor()._origEquips[i] = 0;
	   }
	}
};

// above but unhiding after exiting
Scene_Battle.prototype.commandEquipmentCancel = function() {
	fEXTURNvisible = true;
	fWINDOWopen = false;
    MalEquipCancel.call(this);
	if(Mal.Param.coolD != 0) {
	   if(!this.equipCheck()) {
	       BattleManager.actor().addState(Number(Mal.Param.coolD) || 0);
	       BattleManager.queueForceAction(BattleManager.actor(), Number(Mal.Param.coolA), -1);
	       BattleManager.selectNextCommand();
	       this.changeInputWindow();
	       BattleManager._statusWindow.refresh();
	       console.log(BattleManager.actor());
	       if(!BattleManager.actor()) {
	           BattleManager.startTurn();
	           this._actorCommandWindow.deactivate();
	       }
	   }
	}
};

//===============================================================
	// Sprite_ExTurn
//===============================================================

// make the extra turn label not overlap on the larger skill and item windows
Sprite_ExTurn.prototype.update = function() {
	Sprite.prototype.update.call(this);
	z = SceneManager._scene;
	if ((z._skillWindow && (z._skillWindow.active)) || (z._itemWindow && (z._itemWindow.active))) {
		fEXTURNvisible = false;
	} else if (z._actorCommandWindow && (z._actorCommandWindow.active)) {
		fEXTURNvisible = true;
	}
	this.opacity += (Galv.EXTURN.active && fEXTURNvisible) ? Galv.EXTURN.fade : -Galv.EXTURN.fade;
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

// 0% state rate acts similar to state resist now, but does not clear status on equip
Game_Battler.prototype.addState = function(stateId) {
    if (!this.isStatePrevented(stateId) && !(this.stateRate(stateId) == 0)) {
        var affected = this.isStateAffected(stateId);
        Olivia.OctoBattle.Effects.___Game_Battler_addState___.call(this, stateId);
        this.setupBreakDamagePopup(stateId, affected)
        this.setStateMaximumTurns(stateId);
    }
};

//===============================================================
    // Game_Action
//===============================================================

// Fix crash caused by YEP_BattleEngineCore when Subject is undefined
_.Game_Action_speed = Game_Action.prototype.speed;
Game_Action.prototype.speed = function() {
    if (this.subject()) {
        return _.Game_Action_speed.call(this);
    } else {
        let speed = 0;
        if (this.item()) {
            speed += this.item().speed;
        }
        if (this.subject() && this.isAttack()) {
            speed += this.subject().attackSpeed();
        }
        return speed;
    }
};

// Hardened heart and last defense fix
Game_Action.prototype.onReactStateEffects = function(target, value) {
    var states = target.states();
    states = states.reverse();
    var length = states.length;
    var originalValue = value;
    for (var i = 0; i < length; ++i) {
        var state = states[i];
        if (!state) continue;
        value = this.processStProtectEffects(target, state, value, originalValue);
    }
    value = Yanfly.LunStPro.Game_Action_onReact.call(this, target, value);
    return value;
};

// Ensure subject exists before checking for confusion
Game_Action.prototype.prepare = function() {
    if (this.subject() && this.subject().isConfused() && !this._forcing) {
        this.setConfusion();
    }
};

// Ensure subject exists before checking if action can be used
Game_Action.prototype.isValid = function() {
    return (this._forcing && this.item()) || (this.subject() && this.subject().canUse(this.item()));
};

//===============================================================
    // SceneManager
//===============================================================

// This code is to allow dev tools in deployed version
/*SceneManager.onKeyDown = function(event) {
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
};*/

//==========================================================
    // End of File
//==========================================================

})(TY.terminaTweaks);
