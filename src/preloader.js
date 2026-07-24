
BasicGame.Preloader = function (game) {

  this.background = null;
  this.preloadBar = null;

  //this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function () {

    //  Show the loading progress bar asset we loaded in boot.js
    this.stage.backgroundColor = '#2d2d2d';

    this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
    this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);

    //  Here we load the rest of the assets our game needs.
    this.load.image('titlepage', 'assets/titlepage.png');
    this.load.image('sea', 'assets/sea.png');
    this.load.image('sand', 'assets/sand.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.spritesheet('enemy1Bullet', 'assets/enemy1Bullet.png', 13, 13);
    this.load.spritesheet('enemyBullet', 'assets/enemy1Bullet.png', 13, 13);
    this.load.image('powerup1', 'assets/powerup1.png');
    this.load.image('enemy1', 'assets/enemy1-fighter.png');
    this.load.spritesheet('enemy2', 'assets/enemy1-sheet24x31.png', 24, 31);
    this.load.image('boss1', 'assets/boss1.png');
    this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
    this.load.spritesheet('whiteEnemy', 'assets/shooting-enemy.png', 32, 32);
    this.load.spritesheet('boss', 'assets/boss.png', 93, 75);
    this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
    this.load.spritesheet('ship-P', 'assets/ship-P.png', 29, 32);
    this.load.spritesheet('player', 'assets/player.png', 64, 64);
    this.load.spritesheet('explosion3', 'assets/explosion3-sheet62x64.png', 62, 64);
    this.load.spritesheet('explosion2', 'assets/explosion2-sheet39x40.png', 39, 40);
    this.load.spritesheet('shipexplosion', 'assets/shipexplosion-sheet49x42.png', 49, 42);
    this.load.spritesheet('explosion1', 'assets/explosion1-sheet32x32.png', 32, 32);
    this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']);
    this.load.audio('playerExplosion', ['assets/player-explosion.ogg', 'assets/player-explsion.wav']);
    this.load.audio('enemyFire', ['assets/enemy-fire.ogg', 'assets/enemy-fire.wav']);
    this.load.audio('playerFire', ['assets/player-fire.ogg', 'assets/player-fire.wav']);
    this.load.audio('powerUp', ['assets/powerup.ogg', 'assets/powerup.wav']);
    this.load.audio('titleMusic', ['assets/bgm/titlemusic.ogg']);
    this.load.audio('stageMusic', ['assets/bgm/stageonemusic.ogg']);
    this.load.audio('bossMusic', ['assets/bgm/bossmusic.ogg']);
    this.load.audio('gameOverMusic', ['assets/bgm/gameovermusic.mp3']);
    this.load.audio('thanksMusic', ['assets/bgm/thanksmusic.ogg']);
    //  + lots of other required assets here
    this.load.image('playerBullet', 'assets/playerBullet.png');

    this.load.spritesheet('boss1Bullet', 'assets/boss1Bullet.png', 13, 13);
    this.load.image('bg1', 'assets/stage1-back.png');
    this.load.image('bg2', 'assets/stage2-back.png');
    this.load.image('menuBack', 'assets/menuBack.png');
    this.load.image('titleOption1', 'assets/titleOption1.png');
    this.load.image('titleOption2', 'assets/titleOption2.png');
    this.load.image('thanksForPlaying', 'assets/thanksForPlaying.png');

    // Listen for any key or pointer tap to proceed
    this.input.keyboard.onDownCallback = this.handleInput.bind(this);
    this.input.onDown.add(this.handleInput, this);
  },

  create: function () {

    //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;

    this.ready = false;
    this.promptText = this.add.text(
      this.game.width / 2, this.game.height / 2 + 50,
      'Press any key or tap to continue',
      { font: '20px monospace', fill: '#fff' }
    );
    this.promptText.anchor.setTo(0.5, 0.5);
    this.add.tween(this.promptText).to({ alpha: 0.3 }, 600, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

  },

  update: function () {

    if (!this.ready) { return; }
    this.state.start('MainMenu');

  },

  // Any key or tap unlocks the Web Audio Context and proceeds to MainMenu
  // Browsers require a user gesture before audio can play — this guarantees it
  handleInput: function () {
    if (!this.ready) {
      this.ready = true;
    }
  }

};
