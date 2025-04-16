/*Window_Help.prototype.drawBattler = function(battler) {
    const battlerName = battler.name();
    const currentAndMax = `${TextManager.hp}: ${battler.hp}/${battler.mhp}`;

    const width = this.contents.width;
    const height = this.contents.height;
    const x = 0;
    const y = (height - this.lineHeight() * 2) / 2;

    this.drawText(battlerName, x, y, width, 'center');
    this.drawText(currentAndMax, x, y + this.lineHeight(), width, 'center');
};*/

Window_Help.prototype.drawBattler = function(battler) {
    const width = this.contents.width;
    const height = this.contents.height;
    const x = 0;
    const y = (height - this.lineHeight() * 2) / 2;

    this.drawBattlerName(battler, x, y, width);
    this.drawBattlerHealth(battler, x, y, width);
};

Window_Help.prototype.drawBattlerName = function(battler, x, y, width) {
    this.drawText(battler.name(), x, y, width, 'center');
};

Window_Help.prototype.drawBattlerHealth = function(battler, x, y, width) {
    //const y2 = y + this.lineHeight();
    const currentHp = battler.hp;
    const valueWidth = this.textWidth('000000');
    this.drawText(currentHp, x, y, valueWidth, 'right');
    //this.drawActorHp(battler, width / 3 + 36, y, width / 4);
};

/*Window_Help.prototype.drawBattlerHp = function(battler) {
	const hpTerm = TextManager.hp;
	const nowHp = battler.hp;
	const maxHp = battler.mhp;
    const currentAndMax = `${hpTerm}: ${nowHp}/${maxHp}`;

    const width = this.contents.width;
    const height = this.contents.height;
    const x = 0;
    const y = (height - this.lineHeight() * 2) / 2  + this.lineHeight();

    this.drawText(currentAndMax, x, y, width, 'center');
};*/

/*
Window_Help.prototype.drawBattler = function(battler) {
    var battlerName = battler.name();
    var wx = 0;
    var wy = (this.contents.height - this.lineHeight() * 2) / 2;
    this.drawText(battlerName, wx, wy, this.contents.width, 'center');
    const text2 = `${TextManager.hp
}: ${battler.hp}/${battler.mhp}`;
    this.drawText(text2, 0, wy + this.lineHeight(), this.contents.width, 'center');
};
*/

/*
Window_Help.prototype.drawBattler = function(battler) {
    var battlerName = battler.name();
    var wx = 0;
    var wy = (this.contents.height - this.lineHeight() * 2) / 2;
    var width = this.contents.width;
    this.drawText(battlerName, wx, wy, this.contents.width, 'center');
    this.drawActorHp(battler, width / 3 + 36, wy + this.lineHeight(), this.contents.width / 4);
};
*/
