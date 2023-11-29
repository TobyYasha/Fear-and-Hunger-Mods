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
		{ skillId: 476, switchIds: [1990] }, // Order, charge!
		{ skillId: 446, switchIds: [2008] }, // Greater meditation
		{ skillId: 338, switchIds: [2006] }, // meditation
		{ skillId: 447, switchIds: [2212] }, // spice forge
		{ skillId: 444, switchIds: [2002] }, // La danse macabre
		{ skillId: 472, switchIds: [2018] }, // Explosives -- gain item 250 for recipe
		{ skillId: 471, switchIds: [2014] }, // Killing intent
		{ skillId: 470, switchIds: [2010] }, // intimidate
		{ skillId: 473, switchIds: [2012] }, // steal
		{ skillId: 798, switchIds: [1455] }, // red arc
		{ skillId: 335, switchIds: [1246] }, // engrave
		{ skillId: 323, switchIds: [1924] }, // gunproficiency
		{ skillId: 441, switchIds: [1926] }, // warding_sigil
		{ skillId: 487, switchIds: [1932] }, // diagnosis
		{ skillId: 337, switchIds: [1248] }, // advanced_occultism
		{ skillId: 367, switchIds: [1541] }, // medicinal
		{ skillId: 366, switchIds: [] }, // organ harvest(with medicinal)
		{ skillId: 454, switchIds: [1938] }, // slow_metabolism
		{ skillId: 461, switchIds: [1944] }, // advanced_botanism -- gain item 331 for recipe
		{ skillId: 324, switchIds: [733] }, // gunslinger
		{ skillId: 554, switchIds: [1545] }, // wrenchtoss
		{ skillId: 325, switchIds: [732] }, // executioner
		{ skillId: 373, switchIds: [1547] }, // shortcircuit
		{ skillId: 482, switchIds: [1950] }, // persuade
		{ skillId: 326, switchIds: [731] }, // marksmanship
		{ skillId: 371, switchIds: [1549] }, // trapcraft -- gain item 249 for recipe
		{ skillId: 480, switchIds: [1185, 1952] }, // lockpicking
		{ skillId: 464, switchIds: [1974] }, // fast_stance
		{ skillId: 467, switchIds: [1972] }, // adrenaline_rush
		{ skillId: 466, switchIds: [1970] }, // counter_stance
		{ skillId: 637, switchIds: [2079] }, // perfect_guard
		{ skillId: 637, switchIds: [2079] }, // perfect_guard
		// TO DO: Make the below skills work
		/*
		{ skillId: 0,   switchIds: [1982] }, // state m.defense +1 -- 206 | state m.defense +2 -- 207
		{ skillId: 0,   switchIds: [1984] }, // change m.attack param by +1
 		 */
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
