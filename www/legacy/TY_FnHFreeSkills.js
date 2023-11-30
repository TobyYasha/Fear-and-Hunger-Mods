(function() {

	//==========================================================
		// VERSION 1.0.0 -- by Toby Yasha
	//==========================================================

	// INSTRUCTIONS
	
	//==========================================================
		// Mod Parameters -- 
	//==========================================================

	// [Note]can ghouls, skeletons, blood golems, learn skills aswell?
	//
	// [Note] Some skills should only be given to the
	// protagonist since they aren't needed for all characters.
	
	const FNH1_SKILLS = [
		{ skillId: 12,  switchIds: [1197] }, // hurting
		{ skillId: 21,  switchIds: [1199] }, // necromancy
		{ skillId: 34,  switchIds: [] }, 	 // suicide
		{ skillId: 48,  switchIds: [1208] }, // locust_swarm
		{ skillId: 51,  switchIds: [1198] }, // necromancy
		{ skillId: 54,  switchIds: [] }, 	 // demon_seed
		{ skillId: 55,  switchIds: [1202] }, // pheromones
		{ skillId: 56,  switchIds: [1207] }, // mastery_over_insects
		{ skillId: 66,  switchIds: [1211] }, // fast_stance
		{ skillId: 67,  switchIds: [1190] }, // counter
		{ skillId: 68,  switchIds: [1189] }, // defense_stance
		{ skillId: 70,  switchIds: [1187] }, // steal
		{ skillId: 71,  switchIds: [1188] }, // dash
		{ skillId: 72,  switchIds: [1185] }, // lockpicking
		{ skillId: 74,  switchIds: [1196] }, // greater_blood_magic
		{ skillId: 78,  switchIds: [1192] }, // devour
		{ skillId: 79,  switchIds: [1194] }, // marksmanship
		{ skillId: 80,  switchIds: [] }, 	 // bloodlust
		{ skillId: 115, switchIds: [1195] }, // counter_magic
		{ skillId: 122, switchIds: [1206] }, // needle_worm
		{ skillId: 136, switchIds: [1191] }, // leg_sweep
		{ skillId: 146, switchIds: [1186] }, // en_garde
		{ skillId: 148, switchIds: [1167, 1205] }, // blood_portal
		{ skillId: 149, switchIds: [1209] }, // flock_of_crows
		{ skillId: 150, switchIds: [1201] }, // black_orb
		{ skillId: 151, switchIds: [1204] }, // healing_whispers
		{ skillId: 188, switchIds: [] }, 	 // walk_on_water
		{ skillId: 189, switchIds: [] }, 	 // simple_transmutation
		{ skillId: 199, switchIds: [1200] }, // pyromancy
		{ skillId: 200, switchIds: [] }, 	 // combustion
		{ skillId: 240, switchIds: [] }, 	 // chains_of_torment
		{ skillId: 283, switchIds: [1193] }, // war_cry
		{ skillId: 290, switchIds: [] }, 	 // rebirth_of_the_beloved
		{ skillId: 291, switchIds: [] }, 	 // escape_plan
		{ skillId: 294, switchIds: [] } 	 // phase_step
	];
	
	// $gameVariables which will be set to the protagonist's actorId
	// I think these are used by the spice forge?
	const FNH2_VARIABLES = [
		1861, // hurting
		1862, // black_smog
		1863, // blood_golem
		1864, // pheromones
		1865, // scorched_earth
		1866, // pyromancy
		1867, // combustion
		1868, // roots_that_reap
		1869, // pheromones
		1870, // loving_whispers
		1871, // healing_whispers
		1872, // blood_sword
		1873, // longinus
		1874, // rot
		1875, // flesh_puppetry
		1876, // mischief_of_rats
		1891, // poison_tip
	]
	
	// $gameItems which are rewarded from acquiring skills,
	// generally used for unlocking crafting recipes.
	const FNH2_ITEMS = [
		248, // weaponcraft
		249, // trapcraft
		250, // explosives
		331, // advanced_botanism
		332, // toxicology
		357, // masterchef -- book 1
		358, // masterchef -- book 2
	]
	
	// actor parameters which are rewarded from acquiring skills,
	const FNH2_PARAMS = [
		{ paramId: 1, value: 25, switchIds: [2091] },			  // change mind param by +25
		{ paramId: 2, value: 3,  switchIds: [1978, 2027, 2028] }, // change attack param by +1
		{ paramId: 3, value: 2,  switchIds: [1980, 2202] },		  // change defense param by +1
		{ paramId: 4, value: 3,  switchIds: [1984, 2039, 2041] }, // change m.attack param by +1
		{ paramId: 5, value: 2,  switchIds: [1982, 2087] },		  // change m.defense param by +1
		{ paramId: 6, value: 2,  switchIds: [1253, 1976] },		  // change agility param by +1
	]
	
	// actor states which are rewarded from acquiring skills,
	// [Note] These are technically given together with the parameter
	// changes above, but i sawed the logic in half for convenience.
	const FNH2_STATES = [
		205, // defense +3
		207, // m.defense +2
	]
	
	// A list of skills which can be acquired,
	// The switches are used to denote the skill was acquired.
	const FNH2_SKILLS = [
		{ skillId: 12,  switchIds: [1239] }, // hurting					
		{ skillId: 21,  switchIds: [1225] }, // necromancy				
		{ skillId: 51,  switchIds: [1241] }, // blood_golem				
		{ skillId: 55,  switchIds: [1231] }, // pheromones				
		{ skillId: 146, switchIds: [1186, 1964] }, // en_garde					
		{ skillId: 150, switchIds: [2024] }, // black_orb				
		{ skillId: 190, switchIds: [1237] }, // combustion 				
		{ skillId: 199, switchIds: [1235] }, // pyromancy 				
		{ skillId: 218, switchIds: [2085] }, // healing_whispers 		
		{ skillId: 238, switchIds: [1233] }, // loving_whispers  		
		{ skillId: 291, switchIds: [1954, 2766] }, // escape_plan 				
		{ skillId: 294, switchIds: [1221] }, // rot 						
		{ skillId: 313, switchIds: [1207, 1223] }, // mastery_over_vermin	
		{ skillId: 314, switchIds: [1227] }, // flesh_puppetry 			
		{ skillId: 315, switchIds: [1229] }, // mind_read 				
		{ skillId: 323, switchIds: [1924] }, // gun_proficiency	
		{ skillId: 324, switchIds: [733] }, // gunslinger	
		{ skillId: 325, switchIds: [732] }, // executioner	
		{ skillId: 326, switchIds: [731] }, // marksmanship	
		{ skillId: 335, switchIds: [1246] }, // engrave 					
		{ skillId: 337, switchIds: [1248] }, // advanced_occultism	
		{ skillId: 338, switchIds: [2006] }, // meditation	
		{ skillId: 366, switchIds: []},		 // organ_harvest 			
		{ skillId: 367, switchIds: [1541] }, // medicinal 				
		{ skillId: 368, switchIds: [1936] }, // magna_medicinal 			
		{ skillId: 371, switchIds: [1549] }, // trapcraft 				
		{ skillId: 372, switchIds: [1551] }, // weaponcraft 				
		{ skillId: 373, switchIds: [1547] }, // shortcircuit	
		{ skillId: 440, switchIds: [1930] }, // greater_occulstism	
		{ skillId: 441, switchIds: [1926] }, // warding_sigil	
		{ skillId: 444, switchIds: [2002] }, // la_danse_macabre	
		{ skillId: 446, switchIds: [2008] }, // greater_meditation	
		{ skillId: 447, switchIds: [2212] }, // spice_forge 				
		{ skillId: 450, switchIds: [1996] }, // blood_sacrifice 			
		{ skillId: 451, switchIds: [1998] }, // masturbation 			
		{ skillId: 454, switchIds: [1938] }, // slow_metabolism	
		{ skillId: 455, switchIds: [1942] }, // masterchef  				
		{ skillId: 456, switchIds: [1940] }, // melee_proficiency
		{ skillId: 459, switchIds: [1948] }, // toxicology  				
		{ skillId: 460, switchIds: [1946] }, // undergrowth_awareness 
		{ skillId: 461, switchIds: [1944] }, // advanced_botanism 		
		{ skillId: 462, switchIds: [2214] }, // poison_tip 				
		{ skillId: 464, switchIds: [1974] }, // fast_stance
		{ skillId: 465, switchIds: [1968] }, // bob_and_weave
		{ skillId: 466, switchIds: [1970] }, // counter_stance
		{ skillId: 467, switchIds: [1972] }, // adrenaline_rush
		{ skillId: 468, switchIds: [1966] }, // bare_fisted
		{ skillId: 470, switchIds: [2010] }, // intimidate 				
		{ skillId: 471, switchIds: [2014] }, // killing_intent 			
		{ skillId: 472, switchIds: [2018] }, // explosives 				
		{ skillId: 473, switchIds: [2012] }, // steal
		{ skillId: 475, switchIds: [1986] }, // burry_the_trauma
		{ skillId: 476, switchIds: [1990] }, // order_charge
		{ skillId: 480, switchIds: [1185, 1952] }, // lockpicking
		{ skillId: 482, switchIds: [1950] }, // persuade
		{ skillId: 483, switchIds: [2210] }, // diplomacy
		{ skillId: 486, switchIds: [1934] }, // precision_stance
		{ skillId: 487, switchIds: [1932] }, // diagnosis 				
		{ skillId: 494, switchIds: [1962] }, // devour
		{ skillId: 495, switchIds: [1960] }, // bloodlust
		{ skillId: 496, switchIds: [1958] }, // war_cry
		{ skillId: 498, switchIds: [2208] }, // sisu
		{ skillId: 500, switchIds: [2022] }, // black_smog  				
		{ skillId: 504, switchIds: [2030] }, // scorched_earth 			
		{ skillId: 505, switchIds: [2032] }, // roots_that_reap 			
		{ skillId: 506, switchIds: [2034] }, // spontaneous				
		{ skillId: 507, switchIds: [2036] }, // photosynthesis
		{ skillId: 508, switchIds: [2038] }, // greater_photosynthesis
		{ skillId: 511, switchIds: [1992, 2043] }, // brainflower 				
		{ skillId: 512, switchIds: [1994, 2045] }, // heartflower 				
		{ skillId: 515, switchIds: [2093] }, // golden_gates 			
		{ skillId: 516, switchIds: [2089] }, // reveal_aura  			
		{ skillId: 519, switchIds: [2095] }, // blood_sword 				
		{ skillId: 521, switchIds: [2099] }, // longinus 				
		{ skillId: 522, switchIds: [2204] }, // inverse_Crown			
		{ skillId: 525, switchIds: [2206] }, // mischief_of_rats 		
		{ skillId: 637, switchIds: [2079] }, // perfect_guard
		{ skillId: 642, switchIds: [1451] }, // lunar_meteorite
		{ skillId: 799, switchIds: [2026] }, // chains_of_torment
		{ skillId: 805, switchIds: [1449] }, // lunar_storm
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
