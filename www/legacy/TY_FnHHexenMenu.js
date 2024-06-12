(function() { 

	//==========================================================
		// VERSION 1.0.0 -- by Toby Yasha
	//==========================================================

		// This mod let's you open the hexen from the menu

	//==========================================================
		// Mod Configurations -- 
	//==========================================================

		const hexenCommandName = "Hexen";
		const hexenCommandIcon = 71;
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
		let hexenMenuMode = false;

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
			const transferArgs = Object.values(hexenMapTransfer);
			SceneManager.pop();
			$gamePlayer.reserveTransfer(...transferArgs);
		};

})();