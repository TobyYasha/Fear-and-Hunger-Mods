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
		{skillId: 802, switchIds: []},
		802, // Moth swarm
		451, // Masturbation
		450, // Blood sacrifice
		146, // En garde
		475, // Burry the trauma
		476, // Order, charge!
		446, // Greater meditation
		338, // meditation
		447, // spice forge
		444, // La danse macabre
		472, // Explosives
		471, // Killing intent
		470, // intimidate
		473, // steal
		798, // red arc
	];
	/*
	const FNH2_SKILLS = [
		802, // Moth swarm
		451, // Masturbation
		450, // Blood sacrifice
		146, // En garde
		475, // Burry the trauma
		476, // Order, charge!
		446, // Greater meditation
		338, // meditation
		447, // spice forge
		444, // La danse macabre
		472, // Explosives
		471, // Killing intent
		470, // intimidate
		473, // steal
		798, // red arc
	];
	*/
	/*
	const FNH2_SKILL_SWITCHES = [
		1453, // Moth swarm
		1998, // Masturbation
		1996, // Blood sacrifice
		1186, // En garde(backstab) 1
		1964, // En garde 2
		1986, // Burry the trauma
		476, // Order, charge!
		446, // Greater meditation
		338, // meditation
		447, // spice forge
		444, // La danse macabre
		472, // Explosives
		471, // Killing intent
		470, // intimidate
		473, // steal
		798, // red arc
		
	];
	*/
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
