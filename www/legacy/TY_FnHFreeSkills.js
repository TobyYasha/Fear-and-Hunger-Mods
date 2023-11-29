(function() {

	//==========================================================
		// VERSION 1.0.0 -- by Toby Yasha
	//==========================================================

	// INSTRUCTIONS
	
	//==========================================================
		// Mod Parameters -- 
	//==========================================================

	// can ghouls, skeletons, blood golems, learn skills aswell?
	
	const FNH1_SKILLS = [
		
		
	];

	const FNH2_SKILLS = [
		{ skillId: 802, switchIds: [1453] }, // Moth swarm
		{ skillId: 451, switchIds: [1998] }, // Masturbation
		{ skillId: 450, switchIds: [1996] }, // Blood sacrifice
		{ skillId: 146, switchIds: [1186, 1964] }, // En garde
		{ skillId: 146, switchIds: [1986] }, // Burry the trauma
		{ skillId: 476, switchIds: [ ] }, // Order, charge!
		{ skillId: 446, switchIds: [ ] }, // Greater meditation
		{ skillId: 338, switchIds: [ ] }, // meditation
		{ skillId: 447, switchIds: [ ] }, // spice forge
		{ skillId: 444, switchIds: [ ] }, // La danse macabre
		{ skillId: 472, switchIds: [ ] }, // Explosives
		{ skillId: 471, switchIds: [ ] }, // Killing intent
		{ skillId: 470, switchIds: [ ] }, // intimidate
		{ skillId: 473, switchIds: [ ] }, // steal
		{ skillId: 798, switchIds: [ ] }, // red arc
	];
	
	//==========================================================
		// Mod Configurations -- 
	//==========================================================

	function isGameTermina() {
		return $dataSystem.gameTitle.includes("TERMINA");
	}

	function getGameSkills() {
		return isGameTermina() ? FNH2_SKILLS : FNH1_SKILLS;
	}

	//==========================================================
		// Game Configurations -- Game_Party
	//==========================================================
		
	const Game_Party_AddActor = Game_Party.prototype.addActor;
	Game_Party.prototype.addActor = function(actorId) {
		Game_Party_AddActor.call(this, actorId);
		for (const skillId of getGameSkills()) {
			$gameActors.actor(actorId).learnSkill(skillId);
		}
	};
})();
