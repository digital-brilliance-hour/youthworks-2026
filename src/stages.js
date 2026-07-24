BasicGame.STAGE1_CONFIG = {
  // Background
  background: {
    key: 'bg1',
    type: 'image',
    scrollSpeed: 300,
    loop: false
  },

  // Player
  player: {
    key: 'ship-P',
    animated: true,
    animations: [
      { name: 'fly', frames: [2], fps: 20, loop: true },
      { name: 'leanLeft', frames: [1, 0], fps: 3, loop: true },
      { name: 'leanRight', frames: [3, 4], fps: 3, loop: true },
    ],
    defaultAnimation: 'fly',
    scale: 2.25,
    crisp: true,
    leanLeft: 'leanLeft',
    leanRight: 'leanRight',
    hitbox: { width: 20, height: 20, offsetX: 0, offsetY: -5 }
  },


  // Basic enemy
  enemy: {
    key: 'enemy2',
    animated: true,
    scale: 1.5,
    crisp: true,
    animations: [
      { name: 'fly', frames: [0, 1], fps: 20, loop: true },
    ],
    defaultAnimation: 'fly'
  },

  // Shooting enemy
  shooter: {
    key: 'enemy1',
    animated: false,
    scale: 1,
    crisp: true,
  },

  // Boss
  boss: {
    key: 'boss1',
    scale: 2.0,
    crisp: true,
    animated: false,
  },

  // Bullet
  bullet: {
    key: 'playerBullet',
    animated: false,
    scale: 0.2,
    crisp: true,
    angle: -90,
    hitbox: { width: 8, height: 32, offsetX: 0, offsetY: -12 }
  },

  playerBullet: {
    key: 'player1Bullet',
    animated: false
  },



  boss1Bullet: {
    key: 'boss1Bullet',
    animated: false
  },
  // Enemy bullet
  enemyBullet: {
    key: 'enemy1Bullet',
    animated: true,
    animations: [
      { name: 'fire', frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: true }
    ],
    defaultAnimation: 'fire'
  },
  // Explosion
  explosion: {
    key: 'shipexplosion',
    animated: true,
    animations: [
      { name: 'boom', frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], fps: 15, loop: false }
    ],
    defaultAnimation: 'boom',
    destroyOnComplete: true
  },


  enemy1Explosion: {
    key: 'explosion3',
    animated: true,
    animations: [
      { name: 'boom', frames: [0, 1, 2, 3, 4, 5, 6, 7, 8], fps: 15, loop: false }
    ],
    defaultAnimation: 'boom',
    destroyOnComplete: true
  },
  enemy2Explosion: {
    key: 'explosion2',
    animated: true,
    animations: [
      { name: 'boom', frames: [0, 1, 2, 3, 4, 5, 6], fps: 15, loop: false }
    ],
    defaultAnimation: 'boom',
    destroyOnComplete: true
  },

  bossExplosion: {
    key: 'explosion1',
    animated: true,
    animations: [
      { name: 'boom', frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 15, loop: false }
    ],
    defaultAnimation: 'boom',
    destroyOnComplete: true
  },


  // Power-up
  powerUp: {
    key: 'powerup1',
    animated: false
  },

  // Audio
  explosionSFX: 'explosion',
  playerExplosionSFX: 'playerExplosion',
  enemyFireSFX: 'enemyFire',
  playerFireSFX: 'playerFire',
  powerUpSFX: 'powerUp',
  stageMusic: 'stageMusic',
  bossMusic: 'bossMusic',
  gameOverMusic: 'gameOverMusic',

  // Next stage
  nextState: null,

  // Boss spawn trigger: 'scrollEnd' or 'score'
  bossSpawnTrigger: 'scrollEnd',

  // Debug
  debug: false
};

BasicGame.STAGE2_CONFIG = {
  // Background
  background: {
    key: 'sand',
    type: 'tile'
  },

  // Player
  player: {
    key: 'ship-P',
    animated: true,
    animations: [
      { name: 'fly', frames: [2], fps: 20, loop: true },
      { name: 'leanLeft', frames: [1, 0], fps: 3, loop: true },
      { name: 'leanRight', frames: [3, 4], fps: 3, loop: true },
    ],
    defaultAnimation: 'fly',
    scale: 2.25,
    crisp: true,
    leanLeft: 'leanLeft',
    leanRight: 'leanRight',
    hitbox: { width: 20, height: 20, offsetX: 0, offsetY: -5 }
  },

  // Basic enemy
  enemy: {
    key: 'enemy2',
    animated: true,
    scale: 1,
    crisp: true,
    animations: [
      { name: 'fly', frames: [0, 1, 2], fps: 20, loop: true },
    ],
    defaultAnimation: 'fly'
  },

  // Shooting enemy
  shooter: {
    key: 'enemy1',
    animated: false,
    scale: 1,
    crisp: true,
  },

  // Boss
  boss: {
    key: 'boss',
    animated: true,
    animations: [
      { name: 'fly', frames: [0, 1, 2], fps: 20, loop: true },
      { name: 'hit', frames: [3, 1, 3, 2], fps: 20, loop: false }
    ],
    defaultAnimation: 'fly'
  },

  // Bullet
  bullet: {
    key: 'bullet',
    animated: false
  },

  // Enemy bullet
  enemyBullet: {
    key: 'enemyBullet',
    animated: false
  },

  // Explosion
  explosion: {
    key: 'explosion',
    animated: true,
    animations: [
      { name: 'boom', frames: null, fps: 15, loop: false }
    ],
    defaultAnimation: 'boom',
    destroyOnComplete: true
  },

  // Power-up
  powerUp: {
    key: 'powerup1',
    animated: false
  },

  // Audio
  explosionSFX: 'explosion',
  playerExplosionSFX: 'playerExplosion',
  enemyFireSFX: 'enemyFire',
  playerFireSFX: 'playerFire',
  powerUpSFX: 'powerUp',
  stageMusic: 'stageMusic',
  bossMusic: 'bossMusic',
  gameOverMusic: 'gameOverMusic',

  // Next stage
  nextState: null,  // final stage — win screen on boss defeat

  // Boss spawn trigger: 'scrollEnd' or 'score'
  bossSpawnTrigger: 'score'
};
