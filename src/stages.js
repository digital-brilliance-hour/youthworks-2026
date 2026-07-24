BasicGame.STAGE1_CONFIG = {
  // Background
  background: {
    key: 'bg1',
    type: 'image',
    scrollSpeed: 300,
    loop: false,
    crisp: true
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
    hitbox: { width: 20, height: 20, offsetX: 0, offsetY: -5 },
    health: 1
  },

  // Basic enemy
  enemy: {
    key: 'enemy2',
    animated: true,
    scale: 1.5,
    crisp: true,
    health: 2,
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
    health: 4
  },

  // Boss
  boss: {
    key: 'boss1',
    scale: 2.0,
    crisp: true,
    animated: false,
    health: 500
  },

  // Player Bullet Config
  bullet: {
    key: 'playerBullet',
    animated: false,
    scale: 0.2,
    crisp: true,
    damage: 1,
    angle: -90,
    hitbox: { width: 8, height: 32, offsetX: 0, offsetY: -12 }
  },

  playerBullet: {
    key: 'playerBullet',
    animated: false,
    scale: 0.2,
    crisp: true,
    damage: 1,
    angle: -90,
    hitbox: { width: 8, height: 32, offsetX: 0, offsetY: -12 }
  },

  // Shooter Enemy Bullet Config
  enemyBullet: {
    key: 'enemy1Bullet',
    animated: true,
    animations: [
      { name: 'fire', frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: true }
    ],
    defaultAnimation: 'fire',
    damage: 1
  },

  // Basic Enemy Bullet Config
  enemy2Bullet: {
    key: 'enemy1Bullet',
    animated: false,
    damage: 1
  },

  // Boss Bullet Config
  boss1Bullet: {
    key: 'boss1Bullet',
    animated: false,
    damage: 2
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
  explosionSFX: {
    key: 'explosion',
    volume: 0.2,
    loop: false
  },
  playerExplosionSFX: {
    key: 'playerExplosion',
    volume: 0.2,
    loop: false
  },
  enemyFireSFX: {
    key: 'enemyFire',
    volume: 0.4,
    loop: false
  },
  playerFireSFX: {
    key: 'playerFire',
    volume: 0.2,
    loop: false
  },
  powerUpSFX: {
    key: 'powerUp',
    volume: 0.4,
    loop: false
  },
  stageMusic: {
    key: 'stageMusic',
    volume: 0.55,
    loop: true
  },
  bossMusic: {
    key: 'bossMusic',
    volume: 0.55,
    play: 'intro',        // which marker to start with
    markers: [
        {
        name: 'intro',
        start: 0,         // seconds from start of file
        duration: 24,      // how long this segment plays
        loop: false       // plays once then stops
        },
        {
        name: 'loop',
        start: 24,         // picks up at 24 seconds
        duration: 48.5,     // plays for 49 seconds
        loop: true        // loops back to second 24 when it ends
        }
    ]
  },
  gameOverMusic: {
    key: 'gameOverMusic',
    volume: 0.8,
    loop: false
  },

  // Next stage
  nextState: 'ThanksForPlaying',

  // Boss spawn trigger: 'scrollEnd' or 'score'
  bossSpawnTrigger: 'scrollEnd',

  // Debug
  debug: false
};

BasicGame.STAGE2_CONFIG = {
  // Background
  background: {
    key: 'sand',
    type: 'tile',
    crisp: true
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
    hitbox: { width: 20, height: 20, offsetX: 0, offsetY: -5 },
    health: 2
  },

  // Basic enemy
  enemy: {
    key: 'enemy2',
    animated: true,
    scale: 1,
    crisp: true,
    health: 2,
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
    health: 4
  },

  // Boss
  boss: {
    key: 'boss',
    animated: true,
    health: 500,
    animations: [
      { name: 'fly', frames: [0, 1, 2], fps: 20, loop: true },
      { name: 'hit', frames: [3, 1, 3, 2], fps: 20, loop: false }
    ],
    defaultAnimation: 'fly'
  },

  // Player Bullet
  bullet: {
    key: 'bullet',
    animated: false,
    damage: 1
  },

  playerBullet: {
    key: 'bullet',
    animated: false,
    damage: 1
  },

  // Enemy bullet
  enemyBullet: {
    key: 'enemyBullet',
    animated: false,
    damage: 1
  },

  enemy2Bullet: {
    key: 'enemyBullet',
    animated: false,
    damage: 1
  },

  boss1Bullet: {
    key: 'enemyBullet',
    animated: false,
    damage: 2
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
  explosionSFX: {
    key: 'explosion',
    volume: 0.2,
    loop: false
  },
  playerExplosionSFX: {
    key: 'playerExplosion',
    volume: 0.2,
    loop: false
  },
  enemyFireSFX: {
    key: 'enemyFire',
    volume: 0.4,
    loop: false
  },
  playerFireSFX: {
    key: 'playerFire',
    volume: 0.2,
    loop: false
  },
  powerUpSFX: {
    key: 'powerUp',
    volume: 0.4,
    loop: false
  },
  stageMusic: {
    key: 'stageMusic',
    volume: 0.55,
    loop: true
  },
  bossMusic: {
    key: 'bossMusic',
    volume: 0.55,
    loop: true
  },
  gameOverMusic: {
    key: 'gameOverMusic',
    volume: 0.8,
    loop: false
  },

  // Next stage
  nextState: null,  // final stage — win screen on boss defeat

  // Boss spawn trigger: 'scrollEnd' or 'score'
  bossSpawnTrigger: 'score'
};
