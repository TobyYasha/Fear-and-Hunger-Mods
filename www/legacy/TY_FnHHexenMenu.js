(function() { 

	//==========================================================
		// VERSION 1.0.0 -- by Toby Yasha
	//==========================================================

		// This mod lets you open the hexen from the menu

	//==========================================================
		// Mod Configurations -- 
	//==========================================================

		// TODO: Create a replacement event for EV001 on hexen map

		let hexenMenuMode = false;
		const hexenCursorImage = "$cursor1";
		const hexenCommandName = "Hexen";
		const hexenCommandIcon = 71;

		//const hexenInterpreter = new Game_Interpreter();
		//hexenInterpreter.wait(10);

		/*
			{
				mapId: 31,
				layerId: 0,
				graphic: "circle_1",
				x: 70,
				y: 406,
				opacity: 0, // 0 or 255 depending on variable value
				z: 0,
				blend: 0,
				xAnchor: 0.5,
				yAnchor: 0.5,
				character: 0,
				rotate: 0
			},
		*/

		/**/

		/*
		const hexenStaticLayers = {
			
			fearAndHunger: {
				layers: [
					{ layerId: 18, graphic: "circle_1", x: 70, y: 406, opacity: getLayerOpacity(261, 1) },
					{ layerId: 19, graphic: "circle_2", x: 72, y: 406, opacity: getLayerOpacity(261, 2) },
					{ layerId: 20, graphic: "circle_3", x: 72, y: 406, opacity: getLayerOpacity(261, 3) },
				]
			}
		}
		*/

		const hexenStaticLayers = {
			fearAndHunger: {
				variableId: 261,
				layers: [
					{ layerId: 18, graphic: "circle_1", x: 70, y: 406 },
					{ layerId: 19, graphic: "circle_2", x: 72, y: 406 },
					{ layerId: 20, graphic: "circle_3", x: 72, y: 406 },
				]
			},
			alllMer: {
				variableId: 262,
				layers: [
					{ layerId: 21, graphic: "circle_1", x: 168, y: 218 },
					{ layerId: 22, graphic: "circle_2", x: 168, y: 220 },
				]
			},
			rher: {
				variableId: 263,
				layers: [
					{ layerId: 23, graphic: "circle_1", x: 407, y: 118 },
					{ layerId: 24, graphic: "circle_2", x: 407, y: 121 },
					{ layerId: 25, graphic: "circle_3", x: 407, y: 121 },
				]
			},
			sylvian: {
				variableId: 264,
				layers: [
					{ layerId: 9,  graphic: "circle_1", x: 600, y: 167 },
					{ layerId: 10, graphic: "circle_2", x: 600, y: 168 },
				]
			},
			vinushka: {
				variableId: 265,
				layers: [
					{ layerId: 11  graphic: "circle_1", x: 746, y: 313 },
					{ layerId: 12, graphic: "circle_2", x: 744, y: 313 },
					{ layerId: 13, graphic: "circle_3", x: 739, y: 311 },
				]
			},
			grogoroth: {
				variableId: 266,
				layers: [
					{ layerId: 14  graphic: "circle_1", x: 746, y: 502 },
					{ layerId: 15, graphic: "circle_2", x: 744, y: 505 },
					{ layerId: 17, graphic: "circle_3", x: 739, y: 501 },
				]
			}
		}

		const hexenMapTransfer = {
			mapId: 31,
			x: 8,
			y: 8,
			direction: 0,
			fadeType: 0
		}

		const originMapTransfer = {
			mapId: 0,
			x: 0,
			y: 0,
			direction: 0,
			fadeType: 0
		}

		function saveOriginMap() {
			originMapTransfer.mapId = $gameMap.mapId();
			originMapTransfer.x = $gamePlayer.x;
			originMapTransfer.y = $gamePlayer.y;
			originMapTransfer.direction = $gamePlayer.direction();
		}

		function setHexenMode(value) {
			hexenMenuMode = value;
		}

		function onHexenStart() {
			const leader = $gameParty.leader();
			leader.setCharacterImage(hexenCursorImage, 0);
			$gamePlayer.setTransparent(false);
			$gamePlayer.setMoveSpeed(5);
			$gamePlayer.hideFollowers();
			$gamePlayer.refresh();
			$gameScreen.startTint([0,0,0,0], 10);
			$gameMap._interpreter.wait(10);
		}

		/*function loadHexenPictures() {
			$gameSwitches.setValue(2420, true); // Hexen GFX
			$gameTemp.reserveCommonEvent(290);  // Soulstone HUD
		}*/

		/*function loadHexenBanner() {
			const pictureArgs = {
				pictureId: 1,
				name: "the_hexen_banner",
				origin: 0,
				scaleX: 100,
				scaleY: 100,
				opacity: 255,
				blendMode: [0,0,0,0],
			} 
			$gameScreen.showPicture(...Object.values(pictureArgs));
		}*/

		/*function loadFearAndHungerLayers() {
			const layerData = [
				createStaticLayer(18, "circle_1", 70, 406),
				createStaticLayer(19, "circle_2", 72, 406),
				createStaticLayer(20, "circle_3", 72, 406),
			];
			Galv.pCmd.LAYER_S(...Object.values(layerArgs));
		}*/

		function getLayerOpacity(variableId, value) {
			return $gameVariables.value(variableId) >= value ? 255 : 0;
		}

		function createStaticLayer(layerId, graphic, x, y, opacity) {
			const layerData = {
				mapId: 31,
				layerId: 0,
				graphic: "",
				x: 0,
				y: 0,
				opacity: 0,
				z: 0,
				blend: 0,
				xAnchor: 0.5,
				yAnchor: 0.5,
				character: 0,
				rotate: 0
			}
			return {...layerData};
		}

		// P.S -- add a function that waits for the map interpreter to stop running

	//==========================================================
		// Game Configurations -- Window_MenuCommand
	//==========================================================

		// Draws the "Hexen" command icon in the menu
		const Window_MenuCommand_drawItem = Window_MenuCommand.prototype.drawItem;
		Window_MenuCommand.prototype.drawItem = function(index) {
			const commandName = this.commandName(index);
			const align = this.itemTextAlign();
			let rect = this.itemRectForText(index);

			if (commandName === hexenCommandName) {
				this.drawIcon(hexenCommandIcon, rect.x - 4, rect.y + 2);
				this.drawText(commandName, rect.x + 30, rect.y, rect.width - 30, align);
			} else {
				Window_MenuCommand_drawItem.call(this, index);
			}

		};

		// Adds the "Hexen" command to the menu
		const Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
		Window_MenuCommand.prototype.makeCommandList = function() {
			Window_MenuCommand_makeCommandList.call(this);

			const enabled = this.areMainCommandsEnabled();
			this.addCommand(hexenCommandName, "hexen", enabled);
		};

	//==========================================================
		// Game Configurations -- Scene_Menu
	//==========================================================

		// Adds a method to the "Hexen" command
		const Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
		Scene_Menu.prototype.createCommandWindow = function() {
			Scene_Menu_createCommandWindow.call(this);
		    this._commandWindow.setHandler('hexen', this.commandHexen.bind(this));
		};

		// Method called upon interacting with the "Hexen" command
		Scene_Menu.prototype.commandHexen = function() {
			SceneManager.pop();
			saveOriginMap();
			setHexenMode(true);
			$gamePlayer.reserveTransfer(...Object.values(hexenMapTransfer));
		};

})();
