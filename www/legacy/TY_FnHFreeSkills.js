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
		{ skillId: 12,  switchIds: [1239], variableId: 1861 },			// hurting					-- variableId: 1861
		{ skillId: 21,  switchIds: [1225] },							// necromancy				
		{ skillId: 51,  switchIds: [1241], variableId: 1863 },			// blood_golem				-- variableId: 1863
		{ skillId: 55,  switchIds: [1231], variableId: 1869 },			// pheromones				-- variableId: 1869
		{ skillId: 146, switchIds: [1186, 1964] },						// en_garde					-- protagonist only
		{ skillId: 150, switchIds: [2024], variableId: 1864 },			// black_orb				-- variableId: 1864
		{ skillId: 190, switchIds: [1237], variableId: 1867 },			// combustion 				-- variableId: 1867
		{ skillId: 199, switchIds: [1235], variableId: 1866 },			// pyromancy 				-- variableId: 1866
		{ skillId: 218, switchIds: [2085], variableId: 1871 },			// healing_whispers 		-- variableId: 1871
		{ skillId: 238, switchIds: [1233], variableId: 1870 },			// loving_whispers  		-- variableId: 1870
		{ skillId: 291, switchIds: [1954, 2766] },						// escape_plan 				-- protagonist only
		{ skillId: 294, switchIds: [1221], variableId: 1874 },			// rot 						-- variableId: 1874
		{ skillId: 313, switchIds: [1207, 1223] },						// mastery_over_vermin	
		{ skillId: 314, switchIds: [1227], variableId: 1875 },			// flesh_puppetry 			-- variableId: 1875
		{ skillId: 315, switchIds: [1229] },							// mind_read 				-- protagonist only
		{ skillId: 323, switchIds: [1924] },							// gun_proficiency	
		{ skillId: 324, switchIds: [733] },								// gunslinger	
		{ skillId: 325, switchIds: [732] },								// executioner	
		{ skillId: 326, switchIds: [731] },								// marksmanship	
		{ skillId: 335, switchIds: [1246] },							// engrave 					-- protagonist only
		{ skillId: 337, switchIds: [1248] },							// advanced_occultism	
		{ skillId: 338, switchIds: [2006] }, 							// meditation	
		{ skillId: 366 },												// organ_harvest 			-- protagonist only
		{ skillId: 367, switchIds: [1541] },							// medicinal 				-- protagonist only
		{ skillId: 368, switchIds: [1936] },							// magna_medicinal 			-- protagonist only
		{ skillId: 371, switchIds: [1549], itemIds: [249] },			// trapcraft 				-- itemId(recipe): 249 -- protagonist only
		{ skillId: 372, switchIds: [1551], itemIds: [248] },			// weaponcraft 				-- itemId(recipe): 248 -- protagonist only
		{ skillId: 373, switchIds: [1547] },							// shortcircuit	
		{ skillId: 440, switchIds: [1930] },							// greater_occulstism	
		{ skillId: 441, switchIds: [1926] },							// warding_sigil	
		{ skillId: 444, switchIds: [2002] },							// La danse macabre	
		{ skillId: 446, switchIds: [2008] },							// Greater meditation	
		{ skillId: 447, switchIds: [2212] },							// spice forge 				-- protagonist only
		{ skillId: 450, switchIds: [1996] },							// Blood sacrifice 			-- protagonist only
		{ skillId: 451, switchIds: [1998] },							// Masturbation 			-- protagonist only
		{ skillId: 454, switchIds: [1938] },							// slow_metabolism	
		{ skillId: 455, switchIds: [1942], itemIds: [357, 358] },		// masterchef  				-- itemId(recipe): 357, 358
		{ skillId: 456, switchIds: [1940] },							// melee_proficiency
		{ skillId: 459, switchIds: [1948], itemIds: [332] },			// toxicology  				-- itemId(recipe): 332 -- protagonist only
		{ skillId: 460, switchIds: [1946] },							// undergrowth_awareness 	-- protagonist only
		{ skillId: 461, switchIds: [1944], itemIds: [331] },			// advanced_botanism 		-- itemId(recipe): 331 -- protagonist only
		{ skillId: 462, switchIds: [2214], variableId: 1891 },			// poison_tip 				-- variableId: 1891
		{ skillId: 464, switchIds: [1974] },							// fast_stance
		{ skillId: 465, switchIds: [1968] },							// bobandweave
		{ skillId: 466, switchIds: [1970] },							// counter_stance
		{ skillId: 467, switchIds: [1972] },							// adrenaline_rush
		{ skillId: 468, switchIds: [1966] },							// bare-fisted
		{ skillId: 470, switchIds: [2010] },							// intimidate 				-- protagonist only
		{ skillId: 471, switchIds: [2014] },							// Killing intent 			-- protagonist only
		{ skillId: 472, switchIds: [2018], itemIds: [250] },			// Explosives 				-- itemId(recipe): 250 -- protagonist only
		{ skillId: 473, switchIds: [2012] },							// steal
		{ skillId: 475, switchIds: [1986] },							// Burry the trauma
		{ skillId: 476, switchIds: [1990] },							// Order, charge!
		{ skillId: 480, switchIds: [1185, 1952] },						// lockpicking
		{ skillId: 482, switchIds: [1950] },							// persuade
		{ skillId: 483, switchIds: [2210] },							// diplomacy
		{ skillId: 486, switchIds: [1934] },							// precision_stance
		{ skillId: 487, switchIds: [1932] },							// diagnosis 				-- protagonist only
		{ skillId: 494, switchIds: [1962] },							// devour
		{ skillId: 495, switchIds: [1960] },							// bloodlust
		{ skillId: 496, switchIds: [1958] },							// war_cry
		{ skillId: 498, switchIds: [2208] },							// sisu
		{ skillId: 500, switchIds: [2022], variableId: 1862 },			// black_smog  				-- variableId: 1862
		{ skillId: 504, switchIds: [2030], variableId: 1865 },			// scorched_earth 			-- variableId: 1865
		{ skillId: 505, switchIds: [2032], variableId: 1868 },			// roots_that_reap 			-- variableId: 1868
		{ skillId: 506, switchIds: [2034] },							// spontaneous				-- protagonist only
		{ skillId: 507, switchIds: [2036] },							// photosynthesis
		{ skillId: 508, switchIds: [2038] },							// greater_photosynthesis
		{ skillId: 511, switchIds: [1992, 2043] },						// brainflower 				-- protagonist only
		{ skillId: 512, switchIds: [1994, 2045] },						// heartflower 				-- protagonist only
		{ skillId: 515, switchIds: [2093] }, 							// golden_gates 			-- protagonist only
		{ skillId: 516, switchIds: [2089] }, 							// reveal_aura  			-- protagonist only
		{ skillId: 519, switchIds: [2095], variableId: 1872 }, 			// blood_sword 				-- variableId: 1872
		{ skillId: 521, switchIds: [2099], variableId: 1873 }, 			// longinus 				-- variableId: 1873
		{ skillId: 522, switchIds: [2204] }, 							// inverse_Crown			-- protagonist only
		{ skillId: 525, switchIds: [2206], variableId: 1876 }, 			// mischief_of_rats 		-- variableId: 1876
		{ skillId: 637, switchIds: [2079] }, 							// perfect_guard
		{ skillId: 642, switchIds: [1451] }, 							// lunar_meteorite
		{ skillId: 799, switchIds: [2026] }, 							// chains_of_torment
		{ skillId: 805, switchIds: [1449] }, 							// lunar_storm
	];

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
