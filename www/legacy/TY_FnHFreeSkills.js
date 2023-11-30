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
	
	// [Note] Some skills should only be given to the
	// protagonist since they aren't needed for all characters.

	const FNH2_SKILLS = [
		{ skillId: 802, switchIds: [1453] }, // Moth swarm
		{ skillId: 451, switchIds: [1998] }, // Masturbation
		{ skillId: 450, switchIds: [1996] }, // Blood sacrifice
		{ skillId: 146, switchIds: [1186, 1964] }, // En garde
		{ skillId: 475, switchIds: [1986] }, // Burry the trauma
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
		{ skillId: 371, switchIds: [1549] }, // trapcraft -- gain item 249 for recipe -- protagonist only
		{ skillId: 480, switchIds: [1185, 1952] }, // lockpicking
		{ skillId: 464, switchIds: [1974] }, // fast_stance
		{ skillId: 467, switchIds: [1972] }, // adrenaline_rush
		{ skillId: 466, switchIds: [1970] }, // counter_stance
		{ skillId: 637, switchIds: [2079] }, // perfect_guard
		{ skillId: 465, switchIds: [1968] }, // bobandweave
		{ skillId: 468, switchIds: [1966] }, // bare-fisted
		{ skillId: 372, switchIds: [1551] }, // weaponcraft -- gain item 248 for recipe -- protagonist only
		{ skillId: 291, switchIds: [1954, 2766] }, // escape_plan -- protagonist only
		{ skillId: 496, switchIds: [1958] }, // war_cry
		{ skillId: 483, switchIds: [2210] }, // diplomacy
		{ skillId: 495, switchIds: [1960] }, // bloodlust
		{ skillId: 314, switchIds: [1227] }, // flesh_puppetry -- variable 1875 stores the actor id of the person who learned it(we will set this to the player actor id then)
		{ skillId: 498, switchIds: [2208] }, // sisu
		{ skillId: 494, switchIds: [1962] }, // devour
		{ skillId: 294, switchIds: [1221] }, // rot -- variable 1874 stores the actor id of the person who learned it(we will set this to the player actor id then)
		{ skillId: 525, switchIds: [2206] }, // mischief_of_rats -- variable 1876 stores...etc.
		{ skillId: 313, switchIds: [1207, 1223] }, // mastery_over_vermin
		{ skillId: 522, switchIds: [2204] }, // inverse_Crown
		{ skillId: 519, switchIds: [2095] }, // blood_sword -- variable 1872 stores...etc.
		{ skillId: 521, switchIds: [2099] }, // longinus -- variable 1873 stores...etc.
		{ skillId: 515, switchIds: [2093] }, // golden_gates -- protagonist only
		{ skillId: 315, switchIds: [1229] }, // mindread -- protagonist only
		{ skillId: 516, switchIds: [2089] }, // reveal_aura  -- protagonist only
		{ skillId: 642, switchIds: [1451] }, // lunar_meteorite
		{ skillId: 805, switchIds: [1449] }, // lunar_storm
		{ skillId: 55,  switchIds: [1231] }, // pheromones -- variable 1869 stores...etc.
		{ skillId: 511, switchIds: [1992, 2043] }, // brainflower -- protagonist only
		{ skillId: 512, switchIds: [1994, 2045] }, // heartflower -- protagonist only
		{ skillId: 238, switchIds: [1233] }, // loving_whispers  -- variable 1870 stores...etc.
		{ skillId: 218, switchIds: [2085] }, // healing_whispers -- variable 1871 stores...etc.
		{ skillId: 508, switchIds: [2038] }, // greater_photosynthesis
		{ skillId: 507, switchIds: [2036] }, // photosynthesis
		{ skillId: 505, switchIds: [2032] }, // roots_that_reap -- variable 1868 stores...etc.
		{ skillId: 199, switchIds: [1235] }, // pyromancy -- variable 1866 stores...etc.
		{ skillId: 190, switchIds: [1237] }, // combustion -- variable 1867 stores...etc.
		{ skillId: 506, switchIds: [2034] }, // spontaneous -- protagonist only
		{ skillId: 504, switchIds: [2030] }, // scorched_earth -- variable 1865 stores...etc.
		{ skillId: 21,  switchIds: [1225] }, // necromancy
		{ skillId: 51,  switchIds: [1241] }, // blood_golem -- variable 1863 stores...etc.
		{ skillId: 150, switchIds: [2024] }, // black_orb   -- variable 1864 stores...etc.
		{ skillId: 12,  switchIds: [1239] }, // hurting     -- variable 1861 stores...etc.
		{ skillId: 500, switchIds: [2022] }, // black_smog  -- variable 1862 stores...etc.
		{ skillId: 459, switchIds: [1948] }, // toxicology  -- gain item 332 for recipe -- protagonist only
		{ skillId: 455, switchIds: [1942] }, // masterchef  -- gain item 357, 358 for recipe
		{ skillId: 368, switchIds: [1936] }, // magna_medicinal -- protagonist only
		{ skillId: 799, switchIds: [2026] }, // chains_of_torment
		{ skillId: 462, switchIds: [2214] }, // poison_tip -- variable 1891 stores...etc.
		{ skillId: 460, switchIds: [1946] }, // undergrowth_awareness -- protagonist only
		{ skillId: 456, switchIds: [1940] }, // melee_proficiency
		{ skillId: 486, switchIds: [1934] }, // precision_stance
		{ skillId: 440, switchIds: [1930] }, // greater_occulstism
		{ skillId: 461, switchIds: [1944] }, // advanced_botanism -- gain item 331 for recipe -- protagonist only 
		// TO DO: Make the below skills work
		/*
		{ skillId: 0,   switchIds: [2027] }, // change attack param by +1
		{ skillId: 0,   switchIds: [2028] }, // change attack param by +1
		{ skillId: 0,   switchIds: [2039] }, // change m.attack param by +1
		{ skillId: 0,   switchIds: [2041] }, // change m.attack param by +1
		{ skillId: 0,   switchIds: [1984] }, // change m.attack param by +1
		{ skillId: 0,   switchIds: [2091] }, // change mana param by +25
		{ skillId: 0,   switchIds: [2202] }, // state defense +3 -- 205 also change defense param by +1
		{ skillId: 0,   switchIds: [1982] }, // state m.defense +1 -- 206 | state m.defense +2 -- 207(we probably just give the stronger variant here)
		{ skillId: 0,   switchIds: [2087] }, // change m.defense param by +1 | state m.defense +2 -- 207 -- yeah we have multiple instances
		{ skillId: 0,   switchIds: [1253] }, // change agility param by +1
		{ skillId: 0,   switchIds: [1976] }, // change agility param by +1
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
	
	// processSkill/s

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
