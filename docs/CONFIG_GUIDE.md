# Game Configuration Guide

This document explains how the game's data-driven configuration system works, how to modify stages, and how the config files relate to the game logic.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & File Structure](#architecture--file-structure)
3. [Game Flow (States)](#game-flow-states)
4. [Stage Config (`stages.js`)](#stage-config-stagesjs)
5. [Global Constants (`boot.js`)](#global-constants-bootjs)
6. [Asset Loading (`preloader.js`)](#asset-loading-preloaderjs)
7. [Config Reference](#config-reference)
8. [Adding a New Stage](#adding-a-new-stage)
9. [Common Pitfalls](#common-pitfalls)

---

## Project Overview

This is a vertical shoot-'em-up (shmup) built with **Phaser CE (v2.x)** using Arcade Physics. The game features:

- Multi-stage gameplay with persistent score/lives/weapon upgrades
- Data-driven stage configuration (sprites, animations, backgrounds, audio)
- Object pooling for bullets, enemies, explosions, and power-ups
- Boss fights with multi-phase attack patterns

---

## Architecture & File Structure

```
src/
├── boot.js        — Global constants & game scaling setup
├── preloader.js   — Asset loading (images, spritesheets, audio)
├── mainMenu.js    — Title screen state
├── stages.js      — Stage configuration objects (STAGE1_CONFIG, STAGE2_CONFIG)
├── game.js        — Stage 1 gameplay logic
├── game2.js       — Stage 2 gameplay logic (mirrors game.js)
├── app.js         — Game initialization & state registration
```

---

## Game Flow (States)

```
Boot → Preloader → MainMenu → Game (Stage 1) → Game2 (Stage 2) → Game Over / Win
```

Each state is a Phaser State object. The game passes configuration between stages:

```javascript
// In game.js stageComplete():
this.state.start('Game2', true, false, BasicGame.STAGE2_CONFIG);

// In game2.js init():
this.config = config || BasicGame.STAGE2_CONFIG;
```

Persistent data (score, lives, weapon level) is stored on `this.game`:
```javascript
this.game.score = this.score;
this.game.lives = this.lives.countLiving();
this.game.weaponLevel = this.weaponLevel;
```

---

## Stage Config (`stages.js`)

Each stage has a config object that controls **what** appears in the game — sprites, animations, backgrounds, and audio. The game logic files (`game.js`, `game2.js`) read from these configs to set everything up.

### How It Works

1. You define a config object (e.g., `BasicGame.STAGE1_CONFIG`)
2. The game state receives it via `init(config)`
3. Setup functions (`setupPlayer`, `setupEnemies`, etc.) read from `this.config`
4. The config determines which assets, animations, scales, and hitboxes are used

### Relationship Between Config and Game Logic

| Config Section | Read By (in game.js) | What It Controls |
|---|---|---|
| `config.background` | `setupBackground()` | Background type, scrolling |
| `config.player` | `setupPlayer()`, `processPlayerInput()` | Player sprite, animations, hitbox |
| `config.enemy` | `setupEnemies()`, `spawnEnemies()` | Basic enemy appearance & behavior |
| `config.shooter` | `setupEnemies()`, `spawnEnemies()` | Shooting enemy appearance |
| `config.boss` | `setupEnemies()`, `spawnBoss()`, `processDelayedEffects()` | Boss appearance & animations |
| `config.bullet` | `setupBullets()`, `fire()` | Player bullet appearance |
| `config.enemyBullet` | `setupBullets()`, `enemyFire()` | Enemy bullet appearance |
| `config.explosion` | `setupExplosions()`, `explode()`, `playerHit()` | Explosion appearance |
| `config.powerUp` | `setupPlayerIcons()`, `spawnPowerUp()` | Power-up appearance |
| Audio keys | `setupAudio()` | All sound effects and music |
| `config.nextState` | `stageComplete()` | Which state to transition to (or `null` for final stage) |

---

## Global Constants (`boot.js`)

These control **gameplay mechanics** that are shared across all stages:

```javascript
var BasicGame = {
  // Movement speeds
  PLAYER_SPEED: 300,
  ENEMY_MIN_Y_VELOCITY: 30,
  ENEMY_MAX_Y_VELOCITY: 60,
  BOSS_X_VELOCITY: 200,
  BULLET_VELOCITY: 500,

  // Spawn timing
  SPAWN_ENEMY_DELAY: Phaser.Timer.SECOND,
  SPAWN_SHOOTER_DELAY: Phaser.Timer.SECOND * 3,

  // Health & damage
  ENEMY_HEALTH: 2,
  BOSS_HEALTH: 500,
  BULLET_DAMAGE: 1,

  // Rewards & drops
  ENEMY_REWARD: 100,
  ENEMY_DROP_RATE: 0.3,

  // Player settings
  PLAYER_EXTRA_LIVES: 3,
  PLAYER_GHOST_TIME: Phaser.Timer.SECOND * 3,
  // ... etc
};
```

> **Key distinction:** `boot.js` controls *how things behave* (speeds, health, timing). `stages.js` controls *what things look like* (sprites, animations, scale).

---

## Asset Loading (`preloader.js`)

All assets must be loaded in `preloader.js` before they can be used in configs.

### Loading Images vs Spritesheets

```javascript
// Static image (no animation frames)
this.load.image('boss1', 'assets/boss1.png');

// Spritesheet (has animation frames) — must specify frame width & height
this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
```

**Critical:** The first argument (the **key**) must exactly match the `key` property in your stage config. If they don't match, you'll see a green box with a diagonal line (Phaser's missing texture placeholder).

### Audio

```javascript
this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']);
```

Provide multiple formats for cross-browser support (OGG for Chrome/Firefox, WAV/MP3 for Safari).

---

## Config Reference

### Background

```javascript
background: {
  key: 'bg1',          // Asset key from preloader
  type: 'tile',        // 'tile' (infinite repeat) or 'image' (finite scroll)
  scrollSpeed: 12,     // Pixels per second (number, NOT a string)
  loop: false          // Boolean — only used with type: 'image'
}
```

| Type | Behavior |
|---|---|
| `'tile'` | Repeats infinitely using `autoScroll`. Great for simple repeating textures. |
| `'image'` | Scrolls a large image downward. When it reaches the end, it stops (or loops if `loop: true`). |

### Player / Enemy / Shooter / Boss

```javascript
player: {
  key: 'ship-P',                    // Asset key (must match preloader)
  animated: true,                    // Whether this sprite uses animations
  animations: [                      // Array of animation definitions
    { name: 'fly', frames: [2], fps: 20, loop: true },
    { name: 'ghost', frames: [3, 0, 3, 1], fps: 20, loop: true },
    { name: 'leanLeft', frames: [0, 1], fps: 3, loop: true },
    { name: 'leanRight', frames: [3, 4], fps: 3, loop: true },
  ],
  defaultAnimation: 'fly',           // Played on spawn and when idle
  leanLeft: 'leanLeft',             // Animation name for moving left (optional)
  leanRight: 'leanRight',           // Animation name for moving right (optional)
  scale: 2.25,                       // Uniform scale (number) or { x, y } object
  crisp: true,                       // Nearest-neighbor scaling (no blur)
  hitbox: {                          // Custom physics body size (optional)
    width: 20,
    height: 20,
    offsetX: 0,
    offsetY: -5
  }
}
```

#### Animation Object

| Property | Type | Description |
|---|---|---|
| `name` | string | Identifier used in `sprite.play('name')` |
| `frames` | number[] | Array of frame indices from the spritesheet |
| `fps` | number | Frames per second |
| `loop` | boolean | `true` = repeats forever, `false` = plays once then stops |

#### Special Animation Names

| Name | Purpose | Required? |
|---|---|---|
| `fly` | Default idle animation | Recommended (use as `defaultAnimation`) |
| `ghost` | Player invincibility after being hit | Optional (guarded by safety check) |
| `hit` | Flash when damaged (enemies/boss) | Optional (guarded by safety check) |
| `leanLeft` | Sprite tilts when moving left | Optional (set via `leanLeft` property) |
| `leanRight` | Sprite tilts when moving right | Optional (set via `leanRight` property) |

#### Scale Options

```javascript
// Uniform scale (same X and Y)
scale: 2.0

// Independent X/Y scale
scale: { x: 1.5, y: 2.0 }
```

> **Note:** Scale does NOT resize the physics body. If you scale a sprite up, also set a `hitbox` to match the new visual size.

#### `crisp: true`

Enables nearest-neighbor texture filtering. Use this for pixel art that gets scaled up — prevents blurriness. Only needed when `scale` is greater than 1.

### Bullets

```javascript
bullet: {
  key: 'playerBullet',
  animated: false,
  scale: 0.50,
  crisp: true
}

enemyBullet: {
  key: 'enemy1Bullet',
  animated: true,
  animations: [
    { name: 'fire', frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: true }
  ],
  defaultAnimation: 'fire'
}
```

### Explosion

```javascript
explosion: {
  key: 'shipexplosion',
  animated: true,
  animations: [
    { name: 'boom', frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], fps: 15, loop: false }
  ],
  defaultAnimation: 'boom',
  destroyOnComplete: true    // Kill the sprite when animation finishes
}
```

> **`destroyOnComplete: true`** — Despite the name, this actually calls Phaser's `killOnComplete`, which returns the sprite to the pool for reuse. Always set this to `true` for explosions.

### Power-Up

```javascript
powerUp: {
  key: 'powerup1',
  animated: false
}
```

### Audio

```javascript
explosionSFX: 'explosion',        // Key from preloader
playerExplosionSFX: 'playerExplosion',
enemyFireSFX: 'enemyFire',
playerFireSFX: 'playerFire',
powerUpSFX: 'powerUp',
stageMusic: 'stageMusic',
bossMusic: 'bossMusic',
gameOverMusic: 'gameOverMusic',
```

### Stage Transition

```javascript
nextState: 'Game2'    // State name to transition to after boss defeat
// or
nextState: null       // null = this is the final stage, show "You Win!"
```

---

## Adding a New Stage

### Step 1: Add assets in `preloader.js`

```javascript
this.load.spritesheet('newEnemy', 'assets/new-enemy.png', 48, 48);
this.load.image('newBg', 'assets/new-background.png');
```

### Step 2: Create a config in `stages.js`

```javascript
BasicGame.STAGE3_CONFIG = {
  background: { key: 'newBg', type: 'tile', scrollSpeed: 15 },
  player: { key: 'ship-P', animated: true, /* ... */ },
  enemy: { key: 'newEnemy', animated: true, /* ... */ },
  shooter: { key: 'whiteEnemy', animated: false },
  boss: { key: 'newBoss', animated: false, scale: 2.0, crisp: true },
  bullet: { key: 'playerBullet', animated: false },
  enemyBullet: { key: 'enemyBullet', animated: false },
  explosion: { key: 'explosion', animated: true, /* ... */, destroyOnComplete: true },
  powerUp: { key: 'powerup1', animated: false },
  // Audio
  explosionSFX: 'explosion',
  playerExplosionSFX: 'playerExplosion',
  enemyFireSFX: 'enemyFire',
  playerFireSFX: 'playerFire',
  powerUpSFX: 'powerUp',
  stageMusic: 'stageMusic',
  bossMusic: 'bossMusic',
  gameOverMusic: 'gameOverMusic',
  // Transition
  nextState: null  // or 'Game4' if there's another stage
};
```

### Step 3: Create a game state file (or reuse)

Duplicate `game2.js` as `game3.js` and register it in `app.js`:
```javascript
this.state.add('Game3', BasicGame.Game3);
```

### Step 4: Link from previous stage

In the previous stage's config, set:
```javascript
nextState: 'Game3'
```

---

## Common Pitfalls

| Problem | Cause | Fix |
|---|---|---|
| Green box with diagonal line | Asset key in config doesn't match preloader key | Check spelling of `key` in both files |
| Green box with diagonal line | File path typo in preloader | Check the path string (watch for `asessts` vs `assets`) |
| Sprite loads but no animation | `animated: false` in config | Set `animated: true` and provide `animations` array |
| Animation plays but looks wrong | Frame dimensions wrong in `load.spritesheet()` | Measure actual frame size in your image editor |
| Sprite is blurry when scaled up | Default bilinear filtering | Add `crisp: true` to the config |
| Hitbox doesn't match visual | Scale changed but no hitbox set | Add a `hitbox` matching the scaled visual size |
| Background loops when it shouldn't | `loop: 'false'` (string) instead of `false` (boolean) | Use boolean `false`, not string `'false'` |
| Scroll speed is wrong | `scrollSpeed: '12'` (string) | Use number `12`, not string `'12'` |
| Boss hit animation doesn't show | Lean logic in `processDelayedEffects` overrides it | Already fixed — checks `currentAnim.loop` before overriding |
| Error on game over screen | Player body is null after `kill()` | Already fixed — `processPlayerInput` checks `player.alive` |
| Can't return to menu after dying | Quit check was inside the alive guard | Already fixed — quit check runs before alive guard |

---

## Quick Reference: Minimum Required Config

The absolute minimum a config needs to avoid errors:

```javascript
BasicGame.STAGE_CONFIG = {
  background: { key: 'sea', type: 'tile' },
  player: { key: 'player', animated: false },
  enemy: { key: 'greenEnemy', animated: false },
  shooter: { key: 'whiteEnemy', animated: false },
  boss: { key: 'boss', animated: false },
  bullet: { key: 'bullet', animated: false },
  enemyBullet: { key: 'enemyBullet', animated: false },
  explosion: { key: 'explosion', animated: false },
  powerUp: { key: 'powerup1', animated: false },
  explosionSFX: 'explosion',
  playerExplosionSFX: 'playerExplosion',
  enemyFireSFX: 'enemyFire',
  playerFireSFX: 'playerFire',
  powerUpSFX: 'powerUp',
  stageMusic: 'stageMusic',
  bossMusic: 'bossMusic',
  gameOverMusic: 'gameOverMusic',
  nextState: null
};
```

Everything else (animations, scale, crisp, hitbox, leanLeft/leanRight, destroyOnComplete) is optional and layered on top.
