
BasicGame.MainMenu = function (game) {

  this.music = null;
  this.playButton = null;

};

BasicGame.MainMenu.prototype = {

  create: function () {

    //  We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //  Here all we're doing is playing some music and adding a picture and button
    //  Naturally I expect you to do something significantly better :)
    this.bg = this.add.image(0, 0, 'menuBack');
    var scaleFactor = this.game.width / this.bg.texture.width;
    this.bg.scale.setTo(scaleFactor, scaleFactor);
    this.bgScaledHeight = this.bg.texture.height * scaleFactor;
    this.bgScrollSpeed = 30; // pixels per second — adjust to taste

    // Second copy stacked directly above the first for seamless looping
    this.bg2 = this.add.image(0, -this.bgScaledHeight, 'menuBack');
    this.bg2.scale.setTo(scaleFactor, scaleFactor);
    var titleSprite = this.add.sprite(this.game.width / 2, -50, 'titleOption1');
    titleSprite.anchor.setTo(0.5, 0);
    titleSprite.scale.setTo(0.75, 0.75);
    titleSprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 140, "Press Z or tap/click game to start", { font: "20px monospace", fill: "#fff" });
    this.loadingText.anchor.setTo(0.5, 0.5);
    this.loadingText.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
    this.add.tween(this.loadingText).to({ alpha: 0.3 }, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
    //this.add.text(this.game.width / 2, this.game.height - 90, "image assets Copyright (c) 2002 Ari Feldman", { font: "12px monospace", fill: "#fff", align: "center"}).anchor.setTo(0.5, 0.5);
    this.add.text(this.game.width / 2, this.game.height - 75, "Developed by Hexagon Games", { font: "12px monospace", fill: "#fff", align: "center"}).anchor.setTo(0.5, 0.5);

    // Flash white on load to draw attention to the screen
    var flash = this.add.graphics(0, 0);
    flash.beginFill(0xFFFFFF);
    flash.drawRect(0, 0, this.game.width, this.game.height);
    flash.endFill();
    var flashTween = this.add.tween(flash).to({ alpha: 0 }, 400, Phaser.Easing.Cubic.Out, true);
    flashTween.onComplete.addOnce(function () { flash.destroy(); }, this);

  },

  update: function () {

    if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
      this.startGame();
    }
    //  Do some nice funky main menu effect here
    // Scroll downward
    this.bg.y += this.bgScrollSpeed * this.time.physicsElapsed;
    this.bg2.y += this.bgScrollSpeed * this.time.physicsElapsed;

    // When the first image scrolls fully below the screen, jump it back above the second
    if (this.bg.y >= this.bgScaledHeight) {
      this.bg.y = this.bg2.y - this.bgScaledHeight;
    }
    // When the second image scrolls fully below the screen, jump it back above the first
    if (this.bg2.y >= this.bgScaledHeight) {
      this.bg2.y = this.bg.y - this.bgScaledHeight;
    }
  },

  startGame: function (pointer) {

    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    // this.music.stop();

    //  Initialize persistent game state
    this.game.score = 0;
    this.game.lives = BasicGame.PLAYER_EXTRA_LIVES;
    this.game.weaponLevel = 0;

    //  And start the actual game
    this.state.start('Game', true, false, BasicGame.STAGE1_CONFIG);

  }

};
