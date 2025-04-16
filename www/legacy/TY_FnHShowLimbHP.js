TY_FnHShowLimbHP.js

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
    const contentsWidth = width / 4;
    const gaugeWidth = width / 4;
    const gaugeX = x + contentsWidth + (gaugeWidth) / 2;
    const gaugeY = y + this.lineHeight();
    this.drawActorHp(battler, gaugeX, gaugeY, gaugeWidth);
};

Window_Help.prototype.drawCurrentAndMax = function(
	current, max, x, y, width, color1, color2
) {
    const valueWidth = this.textWidth(max);
    const x1 = x + width - valueWidth;
    this.changeTextColor(color1);
    this.drawText(current, x1, y, valueWidth, 'right');
};

/*Window_Help.prototype.drawCurrentAndMax = function(
	current, max, x, y, width, color1, color2
) {
    const valueWidth = this.textWidth(max);
    const x1 = x + width - valueWidth;
    this.changeTextColor(color1);
    this.drawText(current, x1, y, valueWidth, 'right');
};*/

/*Window_Help.prototype.drawCurrentAndMax = function(
	current, max, x, y, width, color1, color2
) {
	Window_BattleStatus.prototype.drawCurrentAndMax.call(this, ...arguments);
};*/

/*Window_Help.prototype.drawBattlerHealth = function(battler, x, y, width) {
    y += this.lineHeight();

    const value = battler.hp;
    const valueWidth = this.textWidth('000000');

    const color1 = this.hpGaugeColor1();
    const color2 = this.hpGaugeColor2();

    const gaugeWidth = width / 4;
    const gaugeX = gaugeWidth + 100;

    this.drawGauge(gaugeX, y, gaugeWidth, battler.hpRate(), color1, color2);

    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x + gaugeX, y, 44);

    this.changeTextColor(this.normalColor());
    this.drawText(value, x + gaugeX + gaugeWidth / 2, y, valueWidth, 'right');
};*/
