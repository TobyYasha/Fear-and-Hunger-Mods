(function() {

	//==========================================================
		// VERSION 1.0.0 -- by Toby Yasha
	//==========================================================
	
	// [Note] can ghouls, skeletons, blood golems, learn skills aswell?
	//
	// [Note] Some skills should only be given to the
	// protagonist since they aren't needed for all characters.
	
	//==========================================================
		// Mod Parameters -- 
	//==========================================================
	
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
		{ paramId: 1, value: 25 }, // change mind param by +25
		{ paramId: 2, value: 3  }, // change attack param by +1
		{ paramId: 3, value: 2  }, // change defense param by +1
		{ paramId: 4, value: 3, }, // change m.attack param by +1
		{ paramId: 5, value: 2, }, // change m.defense param by +1
		{ paramId: 6, value: 2, }, // change agility param by +1
	]
	
	// $gameSwitches to denote whether or not a skill was acquired,
	// or for events which may require them(ex. en_garde).
	const FNH2_SWITCHES = [
		731,  // marksmanship
		732,  // executioner
		733,  // gunslinger
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
		1253, // agility param +1
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
		1976, // agility param +1
		1978, // attack param +1
		1980, // defense param +1
		1982, // m.defense param +1
		1984, // m.attack param +1
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
		2027, // attack param +1
		2028, // attack param +1
		2030, // scorched_earth
		2032, // roots_that_reap
		2034, // spontaneous
		2036, // photosynthesis
		2038, // greater_photosynthesis
		2039, // m.attack param +1
		2041, // m.attack param +1
		2043, // brainflower
		2045, // heartflower
		2079, // perfect_guard
		2085, // healing_whispers
		2087, // m.defense param +1
		2089, // reveal_aura
		2091, // mind param +25 
		2093, // golden_gates
		2095, // blood_sword
		2099, // longinus
		2202, // defense param +1
		2204, // inverse_Crown
		2206, // mischief_of_rats
		2208, // sisu
		2210, // diplomacy
		2212, // spice_forge
		2214, // poison_tip
		2766, // escape_plan
	];
	
	// A list of skills which can be acquired by the characters
	const FNH2_SKILLS = [
		12,  // hurting					
		21,  // necromancy				
		51,  // blood_golem				
		55,  // pheromones				
		146, // en_garde					
		150, // black_orb				
		190, // combustion 				
		199, // pyromancy 				
		218, // healing_whispers 		
		238, // loving_whispers  		
		291, // escape_plan 				
		294, // rot 						
		313, // mastery_over_vermin	
		314, // flesh_puppetry 			
		315, // mind_read 				
		323, // gun_proficiency	
		324, // gunslinger	
		325, // executioner	
		326, // marksmanship
		335, // engrave 					
		337, // advanced_occultism	
		338, // meditation	
		366, // organ_harvest 			
		367, // medicinal 				
		368, // magna_medicinal 			
		371, // trapcraft 				
		372, // weaponcraft 				
		373, // shortcircuit	
		440, // greater_occulstism	
		441, // warding_sigil	
		444, // la_danse_macabre	
		446, // greater_meditation	
		447, // spice_forge 				
		450, // blood_sacrifice 			
		451, // masturbation 			
		454, // slow_metabolism	
		455, // masterchef  				
		456, // melee_proficiency
		459, // toxicology  				
		460, // undergrowth_awareness 
		461, // advanced_botanism 		
		462, // poison_tip 				
		464, // fast_stance
		465, // bob_and_weave
		466, // counter_stance
		467, // adrenaline_rush
		468, // bare_fisted
		470, // intimidate 				
		471, // killing_intent 			
		472, // explosives 				
		473, // steal
		475, // burry_the_trauma
		476, // order_charge
		480, // lockpicking
		482, // persuade
		483, // diplomacy
		486, // precision_stance
		487, // diagnosis 				
		494, // devour
		495, // bloodlust
		496, // war_cry
		498, // sisu
		500, // black_smog  				
		504, // scorched_earth 			
		505, // roots_that_reap 			
		506, // spontaneous				
		507, // photosynthesis
		508, // greater_photosynthesis
		511, // brainflower 				
		512, // heartflower 				
		515, // golden_gates 			
		516, // reveal_aura  			
		519, // blood_sword 				
		521, // longinus 				
		522, // inverse_Crown			
		525, // mischief_of_rats 		
		637, // perfect_guard
		642, // lunar_meteorite
		799, // chains_of_torment
		805, // lunar_storm
	];
	
	//==========================================================
		// Mod Configurations -- 
	//==========================================================

	function isGameTermina() {
		return $dataSystem.gameTitle.includes("TERMINA");
	}
	
	function getGameSwitches() {
		return isGameTermina() ? FNH2_SWITCHES ? FNH1_SWITCHES;
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
	
	// Ensure all variables related to acquired
	// skills are set to the leader's actor id.
	Game_Party.prototype.ensureVariables = function() {
		if (isGameTermina()) {
			const leaderId = this.leader().actorId();
			const variables = FNH2_VARIABLES;
			for (const variableId of variables) {
				$gameVariables.setValue(variableId, leaderId);
			}
		}
	};
	
	// Ensure all switches related to acquired skills are ON
	Game_Party.prototype.ensureSwitches = function() {
		const switches = getGameSwitches();
		for (const switchId of switches) {
			$gameSwitches.setValue(switchId, true);
		}
	};
	
	// Ensure a party member is affected by all required states
	Game_Party.prototype.ensureStates = function(member) {
		if (isGameTermina()) {
			const states = FNH2_STATES;
			for (const stateId of states) {
				member.addState(stateId);
			}
		}
	};
	
	// Ensure a party member has all parameters updated
	Game_Party.prototype.ensureParams = function(member) {
		if (isGameTermina()) {
			const params = FNH2_PARAMS;
			for (const {paramId, value} of params) {
				member.addParam(paramId, value);
			}
		}
	};
	
	// Ensure all items related to acquired skills are gained
	Game_Party.prototype.ensureItems = function() {
		if (isGameTermina()) {
			const items = FNH2_ITEMS;
			for (const itemId of items) {
				this.gainItem(itemId, 1);
			}
		}
	};
	
	// Ensure a party member has learned all the skills
	Game_Party.prototype.ensureSkills = function(member) {
		const skills = getGameSkills();
		for (const skillId of skills) {
			member.learnSkill(skillId);
		}
	};
	
	// Ensure all members have acquired their skills, states and parameter update
	Game_Party.prototype.refreshMembers = function() {
		for (const member of this.members()) {
			if (!member.isRefreshed()) {
				this.ensureStates(member);
				this.ensureParams(member);
				this.ensureSkills(member);
				member.endRefresh();
			}
		}
	};
	
	// Call refresh on the initial $gameParty members
	const Game_Party_SetupStartingMembers = Game_Party.prototype.setupStartingMembers;
	Game_Party.prototype.setupStartingMembers = function() {
		Game_Party_SetupStartingMembers.call(this);
		this.refreshMembers();
		this.ensureSwitches();
		this.ensureItems();
	};
		
	// Call refresh on a newly joined $gameParty member
	const Game_Party_AddActor = Game_Party.prototype.addActor;
	Game_Party.prototype.addActor = function(actorId) {
		Game_Party_AddActor.call(this, actorId);
		this.refreshMembers();
		this.ensureVariables();
	};
	
})();
