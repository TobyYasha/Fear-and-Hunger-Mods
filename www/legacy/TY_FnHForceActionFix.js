// Code based on RPG Maker MZ 1.7.0 Force Action Fix, this is just an import of that for MV
// Quote: "Fixed issue that when Enemy Count is 0 but Forced Battle Action is executed,
// the system will show TypeError: Cannot read property 'scope' of null."

(() => {

const TY_BattleManager_forceAction = BattleManager.forceAction;
BattleManager.forceAction = function(battler) {
	if (battler && battler.numActions() > 0) {
		TY_BattleManager_forceAction.call(this, battler);
	}
};

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

})();