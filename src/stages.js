BasicGame.STAGE1_CONFIG = {
  // Background
  background: {
    key: 'sea',
    type: 'tile'
  },

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
    ],
    defaultAnimation: 'fly'
  },

  // Shooting enemy
  shooter: {
    key: 'whiteEnemy',
    animated: false,
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

   playerBullet: {
    key: 'player1Bullet',
    animated: false
  },

   enemy1Bullet: {
    key: 'enemy1Bullet',
    animated: false
  },
  
 boss1Bullet: {
    key: 'boss1Bullet',
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
  nextState: 'Game2'
};

BasicGame.STAGE2_CONFIG = {
  // Background
  background: {
    key: 'sand',
    type: 'tile'
  },

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
  nextState: null  // final stage — win screen on boss defeat
};
