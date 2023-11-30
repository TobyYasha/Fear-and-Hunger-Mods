(function() {

	//==========================================================
		// VERSION 1.0.0 -- by Toby Yasha
	//==========================================================
	
	//==========================================================
		// Mod Parameters -- 
	//==========================================================

	// [Note]can ghouls, skeletons, blood golems, learn skills aswell?
	//
	// [Note] Some skills should only be given to the
	// protagonist since they aren't needed for all characters.
	
	// $gameSwitches to denote whether or not a skill was acquired,
	// or for events which may require them(ex. blood_portal).
	const FNH1_SWITCHES = [
		1185, // lockpicking
		1186, // en_garde
		1187, // steal
		1188, // dash
		1189, // defense_stance
		1190, // counter
		1191, // leg_sweep
		1192, // devour
		1193, // war_cry
		1194, // marksmanship
		1195, // counter_magic
		1196, // greater_blood_magic
		1197, // hurting
		1198, // necromancy
		1199, // necromancy
		1200, // pyromancy
		1201, // black_orb
		1202, // pheromones
		1204, // healing_whispers
		1167, // blood_portal(1)
		1205, // blood_portal(2)
		1206, // needle_worm
		1207, // mastery_over_insects
		1208, // locust_swarm
		1209, // flock_of_crows
		1211, // fast_stance
	]
	
	// A list of skills which can be acquired by the characters
	const FNH1_SKILLS = [
		12,  // hurting
		21,  // necromancy
		34,  // suicide
		48,  // locust_swarm
		51,  // necromancy
		54,  // demon_seed
		55,  // pheromones
		56,  // mastery_over_insects
		66,  // fast_stance
		67,  // counter
		68,  // defense_stance
		70,  // steal
		71,  // dash
		72,  // lockpicking
		74,  // greater_blood_magic
		78,  // devour
		79,  // marksmanship
		80,  // bloodlust
		115, // counter_magic
		122, // needle_worm
		136, // leg_sweep
		146, // en_garde
		148, // blood_portal
		149, // flock_of_crows
		150, // black_orb
		151, // healing_whispers
		188, // walk_on_water
		189, // simple_transmutation
		199, // pyromancy
		200, // combustion
		240, // chains_of_torment
		283, // war_cry
		290, // rebirth_of_the_beloved
		291, // escape_plan
		294, // phase_step
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
	
	// actor states which are rewarded from acquiring skills,
	// [Note] These are technically given together with the parameter
	// changes above, but i sawed the logic in half for convenience.
	const FNH2_STATES = [
		205, // defense +3
		207, // m.defense +2
	]
	
	// actor parameters which are rewarded from acquiring skills,
	const FNH2_PARAMS = [
		{ paramId: 1, value: 25, switchIds: [2091] }, // change mind param by +25
		{ paramId: 2, value: 3,  switchIds: [1978, 2027, 2028] }, // change attack param by +1
		{ paramId: 3, value: 2,  switchIds: [1980, 2202] }, // change defense param by +1
		{ paramId: 4, value: 3,  switchIds: [1984, 2039, 2041] }, // change m.attack param by +1
		{ paramId: 5, value: 2,  switchIds: [1982, 2087] }, // change m.defense param by +1
		{ paramId: 6, value: 2,  switchIds: [1253, 1976] }, // change agility param by +1
	]
	
	// $gameSwitches to denote whether or not a skill was acquired,
	// or for events which may require them(ex. en_garde).
	const FNH2_SWITCHES = [
		731, // marksmanship
		732, // executioner
		733, // gunslinger
		1185, // lockpicking
		1186, // en_garde
		1207, // mastery_over_vermin
		1210, // marksmanship
		1221, // rot
		1223, // mastery_over_vermin
		1225, // necromancy
		1227, // flesh_puppetry
		1229, // mind_read
		1231, // pheromones
		1233, // loving_whispers
		1235, // pyromancy
		1237, // combustion
		1239, // hurting
		1241, // blood_golem
		1246, // engrave
		1248, // advanced_occultism
		1449, // lunar_storm
		1451, // lunar_meteorite
		1541, // medicinal
		1547, // shortcircuit
		1549, // trapcraft
		1551, // weaponcraft
		1930, // greater_occulstism
		1932, // diagnosis
		1934, // precision_stance
		1936, // magna_medicinal
		1938, // slow_metabolism
		1940, // melee_proficiency
		1942, // masterchef
		1944, // advanced_botanism
		1946, // undergrowth_awareness
		1948, // toxicology
		1950, // persuade
		1952, // lockpicking
		1954, // escape_plan
		1958, // war_cry
		1960, // bloodlust
		1962, // devour
		1964, // en_garde
		1966, // bare_fisted
		1968, // bob_and_weave
		1970, // counter_stance
		1972, // adrenaline_rush
		1974, // fast_stance
		1986, // burry_the_trauma
		1990, // order_charge
		1992, // brainflower
		1994, // heartflower
		1996, // blood_sacrifice
		1998, // masturbation
		2002, // la_danse_macabre
		2006, // meditation
		2008, // greater_meditation
		2010, // intimidate
		2012, // steal
		2014, // killing_intent
		2018, // explosives
		2022, // black_smog
		2024, // black_orb
		2026, // chains_of_torment
		2030, // scorched_earth
		2032, // roots_that_reap
		2034, // spontaneous
		2036, // photosynthesis
		2038, // greater_photosynthesis
		2043, // brainflower
		2045, // heartflower
		2079, // perfect_guard
		2085, // healing_whispers
		2089, // reveal_aura
		2093, // golden_gates
		2095, // blood_sword
		2099, // longinus
		2204, // inverse_Crown
		2206, // mischief_of_rats
		2208, // sisu
		2210, // diplomacy
		2212, // spice_forge
		2214, // poison_tip
		2766, // escape_plan
	];
	
	/*
	const FNH2_SWITCHES = [
		1239, // hurting					
		1225, // necromancy				
		1241, // blood_golem				
		1231, // pheromones				
		1186, // en_garde					
		1964, // en_garde					
		2024, // black_orb				
		1237, // combustion 				
		1235, // pyromancy 				
		2085, // healing_whispers 		
		1233, // loving_whispers  		
		1954, // escape_plan 				
		2766, // escape_plan 				
		1221, // rot 						
		1207, // mastery_over_vermin	
		1223, // mastery_over_vermin	
		1227, // flesh_puppetry 			
		1229, // mind_read 				
		1924, // gun_proficiency	
		733,  // gunslinger	
		732,  // executioner	
		731,  // marksmanship	
		1246, // engrave 					
		1248, // advanced_occultism	
		2006, // meditation	
		1541, // medicinal 				
		1936, // magna_medicinal 			
		1549, // trapcraft 				
		1551, // weaponcraft 				
		1547, // shortcircuit	
		1930, // greater_occulstism	
		1926, // warding_sigil	
		2002, // la_danse_macabre	
		2008, // greater_meditation	
		2212, // spice_forge 				
		1996, // blood_sacrifice 			
		1998, // masturbation 			
		1938, // slow_metabolism	
		1942, // masterchef  				
		1940, // melee_proficiency
		1948, // toxicology  				
		1946, // undergrowth_awareness 
		1944, // advanced_botanism 		
		2214, // poison_tip 				
		1974, // fast_stance
		1968, // bob_and_weave
		1970, // counter_stance
		1972, // adrenaline_rush
		1966, // bare_fisted
		2010, // intimidate 				
		2014, // killing_intent 			
		2018, // explosives 				
		2012, // steal
		1986, // burry_the_trauma
		1990, // order_charge
		1185, // lockpicking
		1952, // lockpicking
		1950, // persuade
		2210, // diplomacy
	    1934, // precision_stance
	    1932, // diagnosis 				
	    1962, // devour
	    1960, // bloodlust
	    1958, // war_cry
	    2208, // sisu
	    2022, // black_smog  				
	    2030, // scorched_earth 			
	    2032, // roots_that_reap 			
	    2034, // spontaneous				
	    2036, // photosynthesis
	    2038, // greater_photosynthesis
	    1992, // brainflower 				
	    2043, // brainflower 				
	    1994, // heartflower 				
	    2045, // heartflower 				
	    2093, // golden_gates 			
	    2089, // reveal_aura  			
	    2095, // blood_sword 				
	    2099, // longinus 				
	    2204, // inverse_Crown			
	    2206, // mischief_of_rats 		
	    2079, // perfect_guard
	    1451, // lunar_meteorite
	    2026, // chains_of_torment
	    1449, // lunar_storm
	];
	*/
	
	// A list of skills which can be acquired by the actors
	const FNH2_SKILLS = [
		12,  1239] }, // hurting					
		21,  1225] }, // necromancy				
		51,  1241] }, // blood_golem				
		55,  1231] }, // pheromones				
		146, 1186, 1964] }, // en_garde					
		150, 2024] }, // black_orb				
		190, 1237] }, // combustion 				
		199, 1235] }, // pyromancy 				
		218, 2085] }, // healing_whispers 		
		238, 1233] }, // loving_whispers  		
		291, 1954, 2766] }, // escape_plan 				
		294, 1221] }, // rot 						
		313, 1207, 1223] }, // mastery_over_vermin	
		314, 1227] }, // flesh_puppetry 			
		315, 1229] }, // mind_read 				
		323, 1924] }, // gun_proficiency	
		324, 733] }, // gunslinger	
		325, 732] }, // executioner	
		326, 731] }, // marksmanship	
		335, 1246] }, // engrave 					
		337, 1248] }, // advanced_occultism	
		338, 2006] }, // meditation	
		366, ]}, // organ_harvest 			
		367, 1541] }, // medicinal 				
		368, 1936] }, // magna_medicinal 			
		371, 1549] }, // trapcraft 				
		372, 1551] }, // weaponcraft 				
		373, 1547] }, // shortcircuit	
		440, 1930] }, // greater_occulstism	
		441, 1926] }, // warding_sigil	
		444, 2002] }, // la_danse_macabre	
		446, 2008] }, // greater_meditation	
		447, 2212] }, // spice_forge 				
		450, 1996] }, // blood_sacrifice 			
		451, 1998] }, // masturbation 			
		454, 1938] }, // slow_metabolism	
		455, 1942] }, // masterchef  				
		456, 1940] }, // melee_proficiency
		459, 1948] }, // toxicology  				
		460, 1946] }, // undergrowth_awareness 
		461, 1944] }, // advanced_botanism 		
		462, 2214] }, // poison_tip 				
		464, 1974] }, // fast_stance
		465, 1968] }, // bob_and_weave
		466, 1970] }, // counter_stance
		467, 1972] }, // adrenaline_rush
		468, 1966] }, // bare_fisted
		470, 2010] }, // intimidate 				
		471, 2014] }, // killing_intent 			
		472, 2018] }, // explosives 				
		473, 2012] }, // steal
		475, 1986] }, // burry_the_trauma
		476, 1990] }, // order_charge
		480, 1185, 1952] }, // lockpicking
		482, 1950] }, // persuade
		483, 2210] }, // diplomacy
		486, 1934] }, // precision_stance
		487, 1932] }, // diagnosis 				
		494, 1962] }, // devour
		495, 1960] }, // bloodlust
		496, 1958] }, // war_cry
		498, 2208] }, // sisu
		500, 2022] }, // black_smog  				
		504, 2030] }, // scorched_earth 			
		505, 2032] }, // roots_that_reap 			
		506, 2034] }, // spontaneous				
		507, 2036] }, // photosynthesis
		508, 2038] }, // greater_photosynthesis
		511, 1992, 2043] }, // brainflower 				
		512, 1994, 2045] }, // heartflower 				
		515, 2093] }, // golden_gates 			
		516, 2089] }, // reveal_aura  			
		519, 2095] }, // blood_sword 				
		521, 2099] }, // longinus 				
		522, 2204] }, // inverse_Crown			
		525, 2206] }, // mischief_of_rats 		
		637, 2079] }, // perfect_guard
		642, 1451] }, // lunar_meteorite
		799, 2026] }, // chains_of_torment
		805, 1449] }, // lunar_storm
	];
	
	//==========================================================
		// Mod Configurations -- 
	//==========================================================

	function isGameTermina() {
		return $dataSystem.gameTitle.includes("TERMINA");
	}
	
	function getGameSkills() {
		return isGameTermina() ? FNH2_SKILLS ? FNH1_SKILLS;
	}
	
	//==========================================================
		// Game Configurations -- Game_Actor
	//==========================================================
	
	const Game_Actor_InitMembers = Game_Actor.prototype.initMembers;
	Game_Actor.prototype.initMembers = function() {
		Game_Actor_InitMembers.call(this);
		this._refreshed = false;
	};
	
	// Check if the actor received its skills, states and parameter update
	Game_Actor.prototype.isRefreshed = function() {
		return this._refreshed;
	};
	
	// Flag which is set to confirm the refreshment of this actor
	// [Note] It's important to apply this flag as we don't want
	// actors receiving additional parameter updates.
	Game_Actor.prototype.endRefresh = function() {
		this._refreshed = true;
	};

	//==========================================================
		// Game Configurations -- Game_Party
	//==========================================================
	
	Game_Party.prototype.ensureSkills = function(actor) {
		
	};
	
	Game_Party.prototype.ensureSkills = function(actor) {
		
	};
	
	// Ensure all members have acquired their skills, states and parameter update
	Game_Party.prototype.refreshMembers = function() {
		for (const member of this.members()) {
			if (!member.isRefreshed()) {
				
			}
		}
	};
	
	// Call refresh on the initial $gameParty members
	const Game_Party_SetupStartingMembers = Game_Party.prototype.setupStartingMembers;
	Game_Party.prototype.setupStartingMembers = function() {
		Game_Party_SetupStartingMembers.call(this);
		this.refreshMembers();
	};
		
	// Call refresh on a newly joined $gameParty member
	const Game_Party_AddActor = Game_Party.prototype.addActor;
	Game_Party.prototype.addActor = function(actorId) {
		Game_Party_AddActor.call(this, actorId);
		this.refreshMembers();
	};
	
})();
