BasicGame.STAGE1_CONFIG = {
  // Background
  backgroundKey: 'sea',

  // Player
  player: {
    key: 'player',
    animated: true,
    animations: [
      { name: 'fly', frames: [0, 1, 2], fps: 20, loop: true },
      { name: 'ghost', frames: [3, 0, 3, 1], fps: 20, loop: true }
    ],
    defaultAnimation: 'fly',
    hitbox: { width: 20, height: 20, offsetX: 0, offsetY: -5 }
  },

  // Basic enemy
  enemy: {
    key: 'greenEnemy',
    animated: true,
    animations: [
      { name: 'fly', frames: [0, 1, 2], fps: 20, loop: true },
      { name: 'hit', frames: [3, 1, 3, 2], fps: 20, loop: false }
    ],
    defaultAnimation: 'fly'
  },

  // Shooting enemy
  shooter: {
    key: 'whiteEnemy',
    animated: true,
    animations: [
      { name: 'fly', frames: [0, 1, 2], fps: 20, loop: true },
      { name: 'hit', frames: [3, 1, 3, 2], fps: 20, loop: false }
    ],
    defaultAnimation: 'fly'
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

  // Simple assets (no animation config needed)
  bulletKey: 'bullet',
  enemyBulletKey: 'enemyBullet',
  explosionKey: 'explosion',
  powerUpKey: 'powerup1',

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
  nextState: 'Game2'
};

BasicGame.STAGE2_CONFIG = {
  // Background
  backgroundKey: 'sand',

  // Player
  player: {
    key: 'player',
    animated: true,
    animations: [
      { name: 'fly', frames: [0, 1, 2], fps: 20, loop: true },
      { name: 'ghost', frames: [3, 0, 3, 1], fps: 20, loop: true }
    ],
    defaultAnimation: 'fly',
    hitbox: { width: 20, height: 20, offsetX: 0, offsetY: -5 }
  },

  // Basic enemy
  enemy: {
    key: 'greenEnemy',
    animated: true,
    animations: [
      { name: 'fly', frames: [0, 1, 2], fps: 20, loop: true },
      { name: 'hit', frames: [3, 1, 3, 2], fps: 20, loop: false }
    ],
    defaultAnimation: 'fly'
  },

  // Shooting enemy
  shooter: {
    key: 'whiteEnemy',
    animated: true,
    animations: [
      { name: 'fly', frames: [0, 1, 2], fps: 20, loop: true },
      { name: 'hit', frames: [3, 1, 3, 2], fps: 20, loop: false }
    ],
    defaultAnimation: 'fly'
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

  // Simple assets (no animation config needed)
  bulletKey: 'bullet',
  enemyBulletKey: 'enemyBullet',
  explosionKey: 'explosion',
  powerUpKey: 'powerup1',

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
  nextState: null  // final stage — win screen on boss defeat
};
