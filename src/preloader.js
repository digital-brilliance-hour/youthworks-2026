
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
    this.load.image('enemyBullet', 'assets/enemy-bullet.png');
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
    this.load.spritesheet('explosion3' , 'assets/explosion3-sheet62x64.png' , 62, 64);
    this.load.spritesheet('explosion2' , 'assets/explosion2-sheet39x40.png', 39, 40);
    this.load.spritesheet('shipexplosion' , 'assets/shipexplosion-sheet49x42.png' , 49 , 42);
    this.load.spritesheet('explosion1' , 'assets/explosion1-sheet32x32.png' , 32 , 32);
    this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']);
    this.load.audio('playerExplosion', ['assets/player-explosion.ogg', 'assets/player-explsion.wav']);
    this.load.audio('enemyFire', ['assets/enemy-fire.ogg', 'assets/enemy-fire.wav']);
    this.load.audio('playerFire', ['assets/player-fire.ogg', 'assets/player-fire.wav']);
    this.load.audio('powerUp', ['assets/powerup.ogg', 'assets/powerup.wav']);
    this.load.audio('titleMusic', ['assets/bgm/titlemusic.ogg']);
    this.load.audio('stageMusic', ['assets/bgm/stageonemusic.ogg']);
    this.load.audio('bossMusic', ['assets/bgm/bossmusic.ogg']);
    this.load.audio('gameOverMusic', ['assets/bgm/gameovermusic.mp3']);
    //  + lots of other required assets here
 this.load.image('playerBullet', 'asessts/playerBullet.png');
    this.load.spritesheet('enemy1Bullet', 'asessts/enemy1Bullet.png', 13,13);
    this.load.spritesheet('Boss1Bullet','assets/Boss1Bullet.png', 13,13);
    this.load.image('bg1','assets/stage1-back.png');
    this.load.image('bg1','assets/stage2-back.png');

  },

  create: function () {

    //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;

  },

  update: function () {

    //  You don't actually need to do this, but I find it gives a much smoother game experience.
    //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
    //  You can jump right into the menu if you want and still play the music, but you'll have a few
    //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
    //  it's best to wait for it to decode here first, then carry on.
    
    //  If you don't have any music in your game then put the game.state.start line into the create function and delete
    //  the update function completely.
    
    //if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
    //{
    //  this.ready = true;
      this.state.start('MainMenu');
    //}

  }

};
