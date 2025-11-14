(function() {

    /**
     * The maximum allowed value for Physical Evasion(eva) 
     * and Magical Evasion(mev) stats.
     * 
     * NOTE: Keep the value between 0 and 1(floating values allowed).
     * 
     * @type {number}
     */
    const evasionMaxRate = 0.50;

    /**
     * The value that determines how much evasion scales after it reaches the maximum rate.
     * 
     * NOTE: Keep the value above 1(floating values allowed).
     * 
     * @type {number}
     */
    const evasionPenaltyRate = 2;

    /**
     * Determines the current value of the Physical Evasion(eva) and Magical Evasion(mev) stats.
     * 
     * NOTE: Values beyond the "evasionMaxRate" will have diminishing returns.
     */
    function calculateEvasionRate(paramRate) {
        if (paramRate > evasionMaxRate) {
            const bonusRate = (paramRate - evasionMaxRate) / evasionPenaltyRate;
            return evasionMaxRate + bonusRate;
        }
        return paramRate;
    }

    /**
     * Adds a maximum cap for the Physical Evasion(eva) and Magical Evasion(mev) stats.
     */
    const TY_Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
    Game_BattlerBase.prototype.xparam = function(xparamId) {
        const paramRate = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
        switch (xparamId) {
            case 1: // Physical Evasion
            case 4: // Magical Evasion
                return calculateEvasionRate(paramRate);
            default:
                return paramRate;
        };

    };

});