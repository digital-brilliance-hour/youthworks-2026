BasicGame.ThanksForPlaying = function (game) {};

BasicGame.ThanksForPlaying.prototype = {

  create: function () {
    // Display the thanks screen image, scaled to fit the game width
    var img = this.add.image(0, 0, 'thanksForPlaying');
    var scaleFactor = this.game.width / img.texture.width;
    img.scale.setTo(scaleFactor, scaleFactor);
    img.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    // Opening white flash — same as MainMenu
    var flash = this.add.graphics(0, 0);
    flash.beginFill(0xFFFFFF);
    flash.drawRect(0, 0, this.game.width, this.game.height);
    flash.endFill();
    var flashTween = this.add.tween(flash).to({ alpha: 0 }, 400, Phaser.Easing.Cubic.Out, true);
    flashTween.onComplete.addOnce(function () { flash.destroy(); }, this);

    this.inputReady = false;
    // Brief delay before accepting input so the flash doesn't fire immediately
    this.time.events.add(600, function () {
      this.inputReady = true;
    }, this);

    // Start looping background music
    this.music = this.add.audio('thanksMusic', 0.55, true);
    this.music.play();
  },

  update: function () {
    if (!this.inputReady) { return; }

    if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
      this.inputReady = false;
      this.fadeToMenu();
    }
  },

  fadeToMenu: function () {
    // Fade to white, then transition to MainMenu
    var fade = this.add.graphics(0, 0);
    fade.beginFill(0xFFFFFF);
    fade.drawRect(0, 0, this.game.width, this.game.height);
    fade.endFill();
    fade.alpha = 0;
    var fadeTween = this.add.tween(fade).to({ alpha: 1 }, 1200, Phaser.Easing.Cubic.In, true);
    fadeTween.onComplete.addOnce(function () {
      this.music.stop();
      this.state.start('MainMenu');
    }, this);
  }

};
