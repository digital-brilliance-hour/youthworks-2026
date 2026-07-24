//Game Logic Object
BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {

  init: function (config) {
    this.config = config || BasicGame.STAGE1_CONFIG;
  },

  create: function () {
    this.setupBackground();
    this.setupPlayer();
    this.setupEnemies();
    this.setupBullets();
    this.setupBossRingShot();
    this.setupExplosions();
    this.setupPlayerIcons();
    this.setupText();
    this.setupAudio();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.playerControl = true;
  },

  // 
  // update()- related functions 
  // 
  checkCollisions: function () {
    this.physics.arcade.overlap(
      this.bulletPool, this.enemyPool, this.enemyHit, null, this
    );
    this.physics.arcade.overlap(
      this.bulletPool, this.shooterPool, this.enemyHit, null, this
    );
    this.physics.arcade.overlap(
      this.player, this.enemyPool, this.playerHit, null, this
    );
    this.physics.arcade.overlap(
      this.player, this.shooterPool, this.playerHit, null, this
    );
    this.physics.arcade.overlap(
      this.player, this.enemyBulletPool, this.playerHit, null, this
    );
    this.physics.arcade.overlap(
      this.player, this.bossRingBulletPool, this.playerHit, null, this
    );
    this.physics.arcade.overlap(
      this.player, this.powerUpPool, this.playerPowerUp, null, this
    );
    if (this.bossApproaching === false) {
      this.physics.arcade.overlap(
        this.bulletPool, this.bossPool, this.enemyHit, null, this
      );
      this.physics.arcade.overlap(
        this.player, this.bossPool, this.playerHit, null, this
      );
    }
  },

  playerPowerUp: function (player, powerUp) {
    this.addToScore(powerUp.reward);
    powerUp.kill();
    this.powerUpSFX.play();
    if (this.weaponLevel < 5) {
      this.weaponLevel++;
    }
  },

  setupPlayerIcons: function () {
    var puCfg = this.config.powerUp;
    this.powerUpPool = this.add.group();
    this.powerUpPool.enableBody = true;
    this.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.powerUpPool.createMultiple(5, puCfg.key);
    this.powerUpPool.setAll('anchor.x', 0.5);
    this.powerUpPool.setAll('anchor.y', 0.5);
    this.powerUpPool.setAll('outOfBoundsKill', true);
    this.powerUpPool.setAll('checkWorldBounds', true);
    this.powerUpPool.setAll(
      'reward', BasicGame.POWERUP_REWARD, false, false, 0, true
    );
    if (puCfg.animated) {
      this.powerUpPool.forEach(function (p) {
        for (var i = 0; i < puCfg.animations.length; i++) {
          var anim = puCfg.animations[i];
          p.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
        }
        this.applyScaleAndHitbox(p, puCfg);
      }, this);
    } else if (puCfg.scale || puCfg.hitbox) {
      this.powerUpPool.forEach(function (p) {
        this.applyScaleAndHitbox(p, puCfg);
      }, this);
    }
    this.lives = this.add.group();
    // calculate location of first life icon 
    var livesCount = (this.game.lives !== undefined) ? this.game.lives : BasicGame.PLAYER_EXTRA_LIVES;
    var firstLifeIconX = this.game.width - 10 - (livesCount * 30);
    for (var i = 0; i < livesCount; i++) {
      var life = this.lives.create(firstLifeIconX + (30 * i), 30, this.config.player.key);
      life.scale.setTo(0.5, 0.5);
      life.anchor.setTo(0.5, 0.5);
    }
  },

  spawnEnemies: function () {
    var eCfg = this.config.enemy;
    if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
      this.nextEnemyAt = this.time.now + this.enemyDelay;
      var enemy = this.enemyPool.getFirstExists(false);
      // spawn at a random location top of the screen 
      enemy.reset(
        this.rnd.integerInRange(20, this.game.width - 20), 0,
        BasicGame.ENEMY_HEALTH
      );
      // also randomize the speed 
      enemy.body.velocity.y = this.rnd.integerInRange(
        BasicGame.ENEMY_MIN_Y_VELOCITY, BasicGame.ENEMY_MAX_Y_VELOCITY
      );
      if (eCfg.animated) { enemy.play(eCfg.defaultAnimation); }
    }

    var sCfg = this.config.shooter;
    if (this.nextShooterAt < this.time.now && this.shooterPool.countDead() > 0) {
      this.nextShooterAt = this.time.now + this.shooterDelay;
      var shooter = this.shooterPool.getFirstExists(false);
      // spawn at a random location at the top         
      shooter.reset(this.rnd.integerInRange(20, this.game.width - 20), 0, BasicGame.SHOOTER_HEALTH);
      // choose a random target location at the bottom       
      var target = this.rnd.integerInRange(20, this.game.width - 20);
      // move to target and rotate the sprite accordingly         
      shooter.rotation = this.physics.arcade.moveToXY(
        shooter, target, this.game.height,
        this.rnd.integerInRange(BasicGame.SHOOTER_MIN_VELOCITY, BasicGame.SHOOTER_MAX_VELOCITY)
      ) - Math.PI / 2;
      // Lean or default animation based on horizontal velocity
      if (sCfg.animated) {
        if (shooter.body.velocity.x < 0 && sCfg.leanLeft) {
          shooter.play(sCfg.leanLeft);
        } else if (shooter.body.velocity.x > 0 && sCfg.leanRight) {
          shooter.play(sCfg.leanRight);
        } else {
          shooter.play(sCfg.defaultAnimation);
        }
      }
      // each shooter has their own shot timer        
      shooter.nextShotAt = 0;
    }

  },

  setupAudio: function () {
    this.explosionSFX = this.add.audio(this.config.explosionSFX, 0.2, false);
    this.playerExplosionSFX = this.add.audio(this.config.playerExplosionSFX, 0.2, false);
    this.enemyFireSFX = this.add.audio(this.config.enemyFireSFX, 0.4, false);
    this.playerFireSFX = this.add.audio(this.config.playerFireSFX, 0.2, false);
    this.powerUpSFX = this.add.audio(this.config.powerUpSFX, 0.4, false);
    this.music = this.add.audio(this.config.stageMusic, 0.55, true);
    this.bossMusic = this.add.audio(this.config.bossMusic, 0.55, true);
    this.gameOverMusic = this.add.audio(this.config.gameOverMusic);
    this.music.play();
  },

  processPlayerInput: function () {
    // Always check for quit input, even when player is dead
    if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
      if (this.returnText && this.returnText.exists) {
        this.quitGame();
        return;
      }
    }

    if (!this.playerControl || !this.player.alive || !this.player.body) { return; }
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -this.player.speed;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = this.player.speed;
    }

    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -this.player.speed;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = this.player.speed;
    }

    if (this.input.activePointer.isDown &&
      this.physics.arcade.distanceToPointer(this.player) > 15) {
      this.physics.arcade.moveToPointer(this.player, this.player.speed);
    }

    if (this.input.keyboard.isDown(Phaser.Keyboard.Z) ||
      this.input.activePointer.isDown) {
      this.fire();
    }

    // Lean animations based on horizontal movement
    if (this.config.player.animated && !this.ghostUntil) {
      var pCfg = this.config.player;
      if (this.player.body.velocity.x < 0 && pCfg.leanLeft) {
        this.player.play(pCfg.leanLeft);
      } else if (this.player.body.velocity.x > 0 && pCfg.leanRight) {
        this.player.play(pCfg.leanRight);
      } else {
        this.player.play(pCfg.defaultAnimation);
      }
    }
  },

  processDelayedEffects: function () {
    if (this.instructions.exists && this.time.now > this.instExpire) {
      this.instructions.destroy();
    }

    if (this.ghostUntil && this.ghostUntil < this.time.now) {
      this.ghostUntil = null;
      if (this.config.player.animated) {
        this.player.play(this.config.player.defaultAnimation);
      }
    }

    if (this.showReturn && this.time.now > this.showReturn) {
      this.returnText = this.add.text(
        this.game.width / 2, this.game.height / 2 + 20,
        'Press Z or Tap Game to go back to Main Menu',
        { font: '16px sans-serif', fill: '#fff' }
      );

      this.returnText.anchor.setTo(0.5, 0.5);
      this.showReturn = false;
    }

    if (this.bossApproaching && this.boss.y > 80) {
      this.bossApproaching = false;
      this.boss.nextShotAt = 0;
      this.boss.body.velocity.y = 0;
      this.boss.body.velocity.x = BasicGame.BOSS_X_VELOCITY;
      // allow bouncing off world bounds       
      this.boss.body.bounce.x = 1;
      this.boss.body.collideWorldBounds = true;
    }

    // Boss lean animation based on horizontal movement
    var bCfg = this.config.boss;
    if (this.boss.alive && !this.bossApproaching && bCfg.animated) {
      var currentAnim = this.boss.animations.currentAnim;
      // Only apply lean logic if no animation is playing or current one loops
      if (!currentAnim || currentAnim.loop) {
        if (this.boss.body.velocity.x < 0 && bCfg.leanLeft) {
          this.boss.play(bCfg.leanLeft);
        } else if (this.boss.body.velocity.x > 0 && bCfg.leanRight) {
          this.boss.play(bCfg.leanRight);
        } else {
          this.boss.play(bCfg.defaultAnimation);
        }
      }
    }
  },

  update: function () {
    this.scrollBackground();
    this.checkCollisions();
    this.spawnEnemies();
    this.enemyFire();
    this.processPlayerInput();
    this.processDelayedEffects();
  },

  scrollBackground: function () {
    if (this.bgType !== 'image') { return; }
    this.bg.y += this.bgScrollSpeed * this.time.physicsElapsed;
    if (this.bg.y >= 0) {
      if (this.bgLoop) {
        this.bg.y = -(this.bgScaledHeight - this.game.height);
      } else {
        this.bg.y = 0;
        // Trigger boss spawn when scroll reaches the end
        if (this.config.bossSpawnTrigger === 'scrollEnd' && this.bossPool.countDead() == 1) {
          this.spawnBoss();
        }
      }
    }
  },

  enemyFire: function () {
    var ebCfg = this.config.enemyBullet;
    this.shooterPool.forEachAlive(function (enemy) {
      if (this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) {
        var bullet = this.enemyBulletPool.getFirstExists(false);
        bullet.reset(enemy.x, enemy.y);
        this.physics.arcade.moveToObject(
          bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY
        );
        if (ebCfg.animated) { bullet.play(ebCfg.defaultAnimation); }
        enemy.nextShotAt = this.time.now + BasicGame.SHOOTER_SHOT_DELAY;
        this.enemyFireSFX.play();
      }
    }, this);

    if (this.bossApproaching === false && this.boss.alive &&
      this.boss.nextShotAt < this.time.now &&
      this.enemyBulletPool.countDead() >= 10) {
      this.boss.nextShotAt = this.time.now + BasicGame.BOSS_SHOT_DELAY;
      for (var i = 0; i < 5; i++) {
        // process 2 bullets at a time         
        var leftBullet = this.enemyBulletPool.getFirstExists(false);
        leftBullet.reset(this.boss.x - 10 - i * 10, this.boss.y + 20);
        var rightBullet = this.enemyBulletPool.getFirstExists(false);
        rightBullet.reset(this.boss.x + 10 + i * 10, this.boss.y + 20);

        if (this.boss.health > BasicGame.BOSS_HEALTH / 2) {
          // aim directly at the player           
          this.physics.arcade.moveToObject(
            leftBullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY
          );
          this.physics.arcade.moveToObject(
            rightBullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY
          );
        } else {
          // aim slightly off center of the player           
          this.physics.arcade.moveToXY(
            leftBullet, this.player.x - i * 100, this.player.y,
            BasicGame.ENEMY_BULLET_VELOCITY
          );

          this.physics.arcade.moveToXY(
            rightBullet, this.player.x + i * 100, this.player.y,
            BasicGame.ENEMY_BULLET_VELOCITY
          );
        }
        if (ebCfg.animated) { leftBullet.play(ebCfg.defaultAnimation); }
        if (ebCfg.animated) { rightBullet.play(ebCfg.defaultAnimation); }
        this.enemyFireSFX.play();

      }
    }
  },

  enemyHit: function (bullet, enemy) {
    bullet.kill();
    this.damageEnemy(enemy, BasicGame.BULLET_DAMAGE);
  },

  playerHit: function (player, enemy) {
    // crashing into an enemy only deals 5 damage     
    this.damageEnemy(enemy, BasicGame.CRASH_DAMAGE);
    var exCfg = this.config.explosion;
    var explosion = this.add.sprite(player.x, player.y, exCfg.key);
    explosion.anchor.setTo(0.5, 0.5);
    if (exCfg.animated) {
      var anim = exCfg.animations[0];
      explosion.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
      explosion.play(anim.name, anim.fps, anim.loop, exCfg.destroyOnComplete || false);
    }
    var life = this.lives.getFirstAlive();
    if (life !== null) {
      life.kill();
      this.weaponLevel = 0;
      this.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;
      this.damageFlash(player);
      if (this.player.animations.getAnimation('ghost')) {
        this.player.play('ghost');
      }
    } else {
      this.explode(player);
      player.kill();
      this.displayEnd(false);
    }
  },

  damageEnemy: function (enemy, damage) {
    // If this hit would kill the boss, start the death sequence BEFORE killing it
    // so the boss sprite stays alive and on-screen during Phase 1 explosions
    if (enemy.key === this.config.boss.key && enemy.health <= damage) {
      this.explode(enemy);
      this.spawnPowerUp(enemy);
      this.addToScore(enemy.reward);
      this.enemyPool.destroy();
      this.shooterPool.destroy();
      this.bossRingBulletPool.destroy();
      this.enemyBulletPool.destroy();
      if (this.bossRingShotTimer) {
        this.time.events.remove(this.bossRingShotTimer);
      }
      this.bossDeathSequence();
      return;
    }

    enemy.damage(damage);
    if (enemy.alive) {
      if (enemy.animations.getAnimation('hit')) {
        enemy.play('hit');
      }
      this.damageFlash(enemy);
    } else {
      this.explosionSFX.play();
      this.explode(enemy);
      this.spawnPowerUp(enemy);
      this.addToScore(enemy.reward);
    }
  },

  bossDeathSequence: function () {
    var self = this;
    var boss = this.boss;
    var exCfg = this.config.explosion;
    var bossExCfg = this.config.bossExplosion || this.config.explosion;

    // Freeze the boss in place for the death sequence
    boss.body.velocity.x = 0;
    boss.body.velocity.y = 0;
    boss.body.enable = false;

    var tickCount = 0;
    var totalTicks = 14;

    // Phase 1: rapid random explosions across boss surface (boss still alive and visible)
    var deathTimer = this.time.events.loop(200, function () {
      tickCount++;

      if (self.explosionPool.countDead() > 0) {
        var halfW = boss.width / 2;
        var halfH = boss.height / 2;
        var ex = self.explosionPool.getFirstExists(false);
        var rx = boss.x + self.rnd.integerInRange(-halfW, halfW);
        var ry = boss.y + self.rnd.integerInRange(-halfH, halfH);
        ex.reset(rx, ry);
        var randScale = self.rnd.realInRange(0.5, 1.8);
        ex.scale.setTo(randScale, randScale);
        if (exCfg.animated) {
          var anim = exCfg.animations[0];
          ex.play(anim.name, anim.fps, false, exCfg.destroyOnComplete || false);
        }
        self.explosionSFX.play();
      }

      if (tickCount >= totalTicks) {
        self.time.events.remove(deathTimer);

        // Phase 2: final large explosion — capture position just before killing
        var finalX = boss.x;
        var finalY = boss.y;
        boss.kill();
        self.bossPool.destroy();

        var finalPool = self.bossExplosionPool || self.explosionPool;
        if (finalPool.countDead() > 0) {
          var finalEx = finalPool.getFirstExists(false);
          finalEx.reset(finalX, finalY);
          finalEx.scale.setTo(3, 3);
          if (bossExCfg.animated) {
            var finalAnim = bossExCfg.animations[0];
            finalEx.play(finalAnim.name, finalAnim.fps, false, bossExCfg.destroyOnComplete || false);
          }
          self.explosionSFX.play();
        }

        // Phase 3: white flash that slowly fades back to transparent
        var flash = self.add.graphics(0, 0);
        flash.beginFill(0xFFFFFF);
        flash.drawRect(0, 0, self.game.width, self.game.height);
        flash.endFill();
        var flashTween = self.add.tween(flash).to(
          { alpha: 0 }, 2000, Phaser.Easing.Cubic.Out, true, 300
        );
        flashTween.onComplete.addOnce(function () {
          flash.destroy();
          if (self.config.nextState) {
            self.stageComplete();
          } else {
            self.displayEnd(true);
          }
        }, self);
      }
    }, this);
  },

  spawnPowerUp: function (enemy) {
    if (this.powerUpPool.countDead() === 0 || this.weaponLevel === 5) {
      return;
    }

    if (this.rnd.frac() < enemy.dropRate) {
      var powerUp = this.powerUpPool.getFirstExists(false);
      powerUp.reset(enemy.x, enemy.y);
      powerUp.body.velocity.y = BasicGame.POWERUP_VELOCITY;
      var puCfg = this.config.powerUp;
      if (puCfg.animated) { powerUp.play(puCfg.defaultAnimation); }
    }
  },

  addToScore: function (score) {
    this.score += score;
    this.scoreText.text = this.score;
    // Score-based boss spawn (only when bossSpawnTrigger is 'score' or unset)
    if ((!this.config.bossSpawnTrigger || this.config.bossSpawnTrigger === 'score') &&
        this.score >= 20000 && this.bossPool.countDead() == 1) {
      this.spawnBoss();
    }
  },

  spawnBoss: function () {
    this.bossApproaching = true;
    this.boss.reset(this.game.width / 2, 0, BasicGame.BOSS_HEALTH);
    this.physics.enable(this.boss, Phaser.Physics.ARCADE);
    this.boss.body.velocity.y = BasicGame.BOSS_Y_VELOCITY;
    var bCfg = this.config.boss;
    if (bCfg.animated) {
      this.boss.play(bCfg.defaultAnimation);
    }
    this.music.stop();
    this.bossMusic.play();

    // Start the ring shot repeating timer
    this.bossRingShotTimer = this.time.events.loop(
      BasicGame.BOSS_RING_SHOT_DELAY,
      this.fireRingShot,
      this
    );
  },

  explode: function (sprite) {
    // Determine which explosion pool and config to use based on sprite key
    var exCfg = this.config.explosion;
    var pool = this.explosionPool;

    if (sprite.key === this.config.boss.key && this.bossExplosionPool) {
      exCfg = this.config.bossExplosion;
      pool = this.bossExplosionPool;
    } else if (sprite.key === this.config.enemy.key && this.enemy2ExplosionPool) {
      exCfg = this.config.enemy2Explosion;
      pool = this.enemy2ExplosionPool;
    } else if (sprite.key === this.config.shooter.key && this.enemy1ExplosionPool) {
      exCfg = this.config.enemy1Explosion;
      pool = this.enemy1ExplosionPool;
    }

    if (pool.countDead() === 0) {
      return;
    }
    var explosion = pool.getFirstExists(false);
    explosion.reset(sprite.x, sprite.y);
    if (exCfg.animated) {
      var anim = exCfg.animations[0];
      explosion.play(anim.name, anim.fps, anim.loop, exCfg.destroyOnComplete || false);
    }
    // add the original sprite's velocity to the explosion 
    explosion.body.velocity.x = sprite.body.velocity.x;
    explosion.body.velocity.y = sprite.body.velocity.y;
  },

  fire: function () {
    if (!this.player.alive || this.nextShotAt > this.time.now) {
      return;
    }

    this.nextShotAt = this.time.now + this.shotDelay;
    this.playerFireSFX.play();
    var bCfg = this.config.bullet;

    var bullet;
    if (this.weaponLevel === 0) {
      if (this.bulletPool.countDead() === 0) {
        return;
      }
      bullet = this.bulletPool.getFirstExists(false);
      bullet.reset(this.player.x, this.player.y - 20);
      bullet.body.velocity.y = -BasicGame.BULLET_VELOCITY;
      if (bCfg.animated) { bullet.play(bCfg.defaultAnimation); }
    } else {
      if (this.bulletPool.countDead() < this.weaponLevel * 2) {
        return;
      }
      for (var i = 0; i < this.weaponLevel; i++) {
        bullet = this.bulletPool.getFirstExists(false);
        // spawn left bullet slightly left off center         
        bullet.reset(this.player.x - (10 + i * 6), this.player.y - 20);
        // the left bullets spread from -95 degrees to -135 degrees         
        this.physics.arcade.velocityFromAngle(
          -95 - i * 10, BasicGame.BULLET_VELOCITY, bullet.body.velocity
        );
        if (bCfg.animated) { bullet.play(bCfg.defaultAnimation); }
        bullet = this.bulletPool.getFirstExists(false);
        // spawn right bullet slightly right off center         
        bullet.reset(this.player.x + (10 + i * 6), this.player.y - 20);
        // the right bullets spread from -85 degrees to -45         
        this.physics.arcade.velocityFromAngle(
          -85 + i * 10, BasicGame.BULLET_VELOCITY, bullet.body.velocity
        );
        if (bCfg.animated) { bullet.play(bCfg.defaultAnimation); }
      }
    }

  },

  render: function () {
    if (!this.config.debug) { return; }
    this.game.debug.body(this.player);
    this.game.debug.body(this.boss);
    this.enemyPool.forEachAlive(function (e) { this.game.debug.body(e); }, this);
    this.shooterPool.forEachAlive(function (e) { this.game.debug.body(e); }, this);
    this.bulletPool.forEachAlive(function (b) { this.game.debug.body(b); }, this);
    this.enemyBulletPool.forEachAlive(function (b) { this.game.debug.body(b); }, this);
    this.powerUpPool.forEachAlive(function (p) { this.game.debug.body(p); }, this);
  },

  //  
  // create()- related functions  
  //  
  setupBackground: function () {
    var cfg = this.config.background;
    var speed = cfg.scrollSpeed || BasicGame.SEA_SCROLL_SPEED;

    if (cfg.type === 'tile') {
      this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, cfg.key);
      this.bg.autoScroll(0, speed);
    } else if (cfg.type === 'image') {
      this.bg = this.add.image(0, 0, cfg.key);
      var scaleFactor = this.game.width / this.bg.texture.width;
      this.bg.scale.setTo(scaleFactor, scaleFactor);
      this.bgScaledHeight = this.bg.texture.height * scaleFactor;
      this.bg.y = -(this.bgScaledHeight - this.game.height);
      this.bgScrollSpeed = speed;
      this.bgLoop = cfg.loop || false;
    }
    this.bgType = cfg.type;
  },

  applyScaleAndHitbox: function (sprite, cfg) {
    if (cfg.scale) {
      var sx = (typeof cfg.scale === 'object') ? cfg.scale.x : cfg.scale;
      var sy = (typeof cfg.scale === 'object') ? cfg.scale.y : cfg.scale;
      sprite.scale.setTo(sx, sy);
    }
    if (cfg.crisp) {
      sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    }
    if (cfg.angle !== undefined) {
      sprite.angle = cfg.angle;
    }
    if (cfg.hitbox) {
      sprite.body.setSize(cfg.hitbox.width, cfg.hitbox.height, cfg.hitbox.offsetX || 0, cfg.hitbox.offsetY || 0);
    }
  },

  setupPlayer: function () {
    var cfg = this.config.player;
    this.player = this.add.sprite(this.game.width / 2, this.game.height - 50, cfg.key);
    this.player.anchor.setTo(0.5, 0.5);
    if (cfg.animated) {
      for (var i = 0; i < cfg.animations.length; i++) {
        var anim = cfg.animations[i];
        this.player.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
      }
      this.player.play(cfg.defaultAnimation);
    }
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.speed = BasicGame.PLAYER_SPEED;
    this.player.body.collideWorldBounds = true;
    this.applyScaleAndHitbox(this.player, cfg);
    this.weaponLevel = this.game.weaponLevel || 0;
  },

  setupEnemies: function () {
    var eCfg = this.config.enemy;
    this.enemyPool = this.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyPool.createMultiple(50, eCfg.key);
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.enemyPool.setAll('reward', BasicGame.ENEMY_REWARD, false, false, 0, true);
    this.enemyPool.setAll('dropRate', BasicGame.ENEMY_DROP_RATE, false, false, 0, true);

    // Set the animation for each sprite 
    this.enemyPool.forEach(function (enemy) {
      if (eCfg.animated) {
        for (var i = 0; i < eCfg.animations.length; i++) {
          var anim = eCfg.animations[i];
          enemy.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
        }
        enemy.events.onAnimationComplete.add(function (e) {
          e.play(eCfg.defaultAnimation);
        }, this);
      }
      this.applyScaleAndHitbox(enemy, eCfg);
    }, this);

    this.nextEnemyAt = 0;
    this.enemyDelay = BasicGame.SPAWN_ENEMY_DELAY;

    var sCfg = this.config.shooter;
    this.shooterPool = this.add.group();
    this.shooterPool.enableBody = true;
    this.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.shooterPool.createMultiple(20, sCfg.key);
    this.shooterPool.setAll('anchor.x', 0.5);
    this.shooterPool.setAll('anchor.y', 0.5);
    this.shooterPool.setAll('outOfBoundsKill', true);
    this.shooterPool.setAll('checkWorldBounds', true);
    this.shooterPool.setAll('reward', BasicGame.SHOOTER_REWARD, false, false, 0, true);
    this.shooterPool.setAll('dropRate', BasicGame.SHOOTER_DROP_RATE, false, false, 0, true);
    // Set the animation for each sprite     
    this.shooterPool.forEach(function (enemy) {
      if (sCfg.animated) {
        for (var i = 0; i < sCfg.animations.length; i++) {
          var anim = sCfg.animations[i];
          enemy.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
        }
        enemy.events.onAnimationComplete.add(function (e) {
          e.play(sCfg.defaultAnimation);
        }, this);
      }
      this.applyScaleAndHitbox(enemy, sCfg);
    }, this);
    // start spawning 5 seconds into the game     
    this.nextShooterAt = this.time.now + Phaser.Timer.SECOND * 5;
    this.shooterDelay = BasicGame.SPAWN_SHOOTER_DELAY;

    var bCfg = this.config.boss;
    this.bossPool = this.add.group();
    this.bossPool.enableBody = true;
    this.bossPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.bossPool.createMultiple(1, bCfg.key);
    this.bossPool.setAll('anchor.x', 0.5);
    this.bossPool.setAll('anchor.y', 0.5);
    this.bossPool.setAll('outOfBoundsKill', true);
    this.bossPool.setAll('checkWorldBounds', true);
    this.bossPool.setAll('reward', BasicGame.BOSS_REWARD, false, false, 0, true);
    this.bossPool.setAll(
      'dropRate', BasicGame.BOSS_DROP_RATE, false, false, 0, true
    );
    // Set the animation for each sprite     
    this.bossPool.forEach(function (enemy) {
      if (bCfg.animated) {
        for (var i = 0; i < bCfg.animations.length; i++) {
          var anim = bCfg.animations[i];
          enemy.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
        }
        enemy.events.onAnimationComplete.add(function (e) {
          e.play(bCfg.defaultAnimation);
        }, this);
      }
      this.applyScaleAndHitbox(enemy, bCfg);
    }, this);
    this.boss = this.bossPool.getTop();
    this.bossApproaching = false;
  },

  setupBullets: function () {
    var ebCfg = this.config.enemyBullet;
    this.enemyBulletPool = this.add.group();
    this.enemyBulletPool.enableBody = true;
    this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBulletPool.createMultiple(100, ebCfg.key);
    this.enemyBulletPool.setAll('anchor.x', 0.5);
    this.enemyBulletPool.setAll('anchor.y', 0.5);
    this.enemyBulletPool.setAll('outOfBoundsKill', true);
    this.enemyBulletPool.setAll('checkWorldBounds', true);
    this.enemyBulletPool.setAll('reward', 0, false, false, 0, true);
    if (ebCfg.animated) {
      this.enemyBulletPool.forEach(function (b) {
        for (var i = 0; i < ebCfg.animations.length; i++) {
          var anim = ebCfg.animations[i];
          b.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
        }
        this.applyScaleAndHitbox(b, ebCfg);
      }, this);
    } else if (ebCfg.scale || ebCfg.hitbox) {
      this.enemyBulletPool.forEach(function (b) {
        this.applyScaleAndHitbox(b, ebCfg);
      }, this);
    }

    var bCfg = this.config.bullet;
    // Add an empty sprite group into our game 
    this.bulletPool = this.add.group();

    // Enable physics to the whole sprite group 
    this.bulletPool.enableBody = true;
    this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;

    this.bulletPool.createMultiple(100, bCfg.key);

    // Sets anchors of all sprites 
    this.bulletPool.setAll('anchor.x', 0.5);
    this.bulletPool.setAll('anchor.y', 0.5);

    // Automatically kill the bullet sprites when they go out of bounds 
    this.bulletPool.setAll('outOfBoundsKill', true);
    this.bulletPool.setAll('checkWorldBounds', true);

    if (bCfg.animated) {
      this.bulletPool.forEach(function (b) {
        for (var i = 0; i < bCfg.animations.length; i++) {
          var anim = bCfg.animations[i];
          b.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
        }
        this.applyScaleAndHitbox(b, bCfg);
      }, this);
    } else if (bCfg.scale || bCfg.hitbox) {
      this.bulletPool.forEach(function (b) {
        this.applyScaleAndHitbox(b, bCfg);
      }, this);
    }

    this.nextShotAt = 0;
    this.shotDelay = BasicGame.SHOT_DELAY;
  },

  setupBossRingShot: function () {
    var ebCfg = this.config.enemyBullet;
    // Dedicated pool for ring shot bullets so they don't compete with normal enemy bullets
    this.bossRingBulletPool = this.add.group();
    this.bossRingBulletPool.enableBody = true;
    this.bossRingBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
    this.bossRingBulletPool.createMultiple(BasicGame.BOSS_RING_SHOT_BULLETS * 3, ebCfg.key);
    this.bossRingBulletPool.setAll('anchor.x', 0.5);
    this.bossRingBulletPool.setAll('anchor.y', 0.5);
    this.bossRingBulletPool.setAll('outOfBoundsKill', true);
    this.bossRingBulletPool.setAll('checkWorldBounds', true);
    this.bossRingBulletPool.setAll('reward', 0, false, false, 0, true);
    if (ebCfg.animated) {
      this.bossRingBulletPool.forEach(function (b) {
        for (var i = 0; i < ebCfg.animations.length; i++) {
          var anim = ebCfg.animations[i];
          b.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
        }
        this.applyScaleAndHitbox(b, ebCfg);
      }, this);
    } else if (ebCfg.scale || ebCfg.hitbox) {
      this.bossRingBulletPool.forEach(function (b) {
        this.applyScaleAndHitbox(b, ebCfg);
      }, this);
    }
    this.bossRingShotTimer = null;
  },

  fireRingShot: function () {
    // Only fire when boss is alive and has finished approaching
    if (!this.boss.alive || this.bossApproaching) {
      return;
    }

    var ebCfg = this.config.enemyBullet;
    var numBullets = BasicGame.BOSS_RING_SHOT_BULLETS;
    var angleStep = 360 / numBullets;

    for (var i = 0; i < numBullets; i++) {
      var bullet = this.bossRingBulletPool.getFirstExists(false);
      if (!bullet) { continue; }

      bullet.reset(this.boss.x, this.boss.y);

      var angle = i * angleStep;
      this.physics.arcade.velocityFromAngle(
        angle, BasicGame.BOSS_RING_SHOT_SPEED, bullet.body.velocity
      );

      if (ebCfg.animated) { bullet.play(ebCfg.defaultAnimation); }
    }

    this.enemyFireSFX.play();
  },

  // Helper: creates an explosion pool from any explosion config object
  createExplosionPool: function (exCfg, count) {
    var pool = this.add.group();
    pool.enableBody = true;
    pool.physicsBodyType = Phaser.Physics.ARCADE;
    pool.createMultiple(count, exCfg.key);
    pool.setAll('anchor.x', 0.5);
    pool.setAll('anchor.y', 0.5);
    if (exCfg.animated) {
      pool.forEach(function (explosion) {
        for (var i = 0; i < exCfg.animations.length; i++) {
          var anim = exCfg.animations[i];
          explosion.animations.add(anim.name, anim.frames, anim.fps, anim.loop);
        }
      });
    }
    return pool;
  },

  setupExplosions: function () {
    // Generic / player explosion pool (always exists)
    this.explosionPool = this.createExplosionPool(this.config.explosion, 100);

    // Per-enemy-type explosion pools (only created when the config exists)
    this.enemy1ExplosionPool = this.config.enemy1Explosion
      ? this.createExplosionPool(this.config.enemy1Explosion, 20)
      : null;
    this.enemy2ExplosionPool = this.config.enemy2Explosion
      ? this.createExplosionPool(this.config.enemy2Explosion, 20)
      : null;
    this.bossExplosionPool = this.config.bossExplosion
      ? this.createExplosionPool(this.config.bossExplosion, 5)
      : null;
  },

  setupText: function () {
    this.instructions = this.add.text(this.game.width / 2, this.game.height - 100,
      'Use Arrow Keys to Move, Press Z to Fire\n' +
      'Tapping/clicking does both',
      { font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.instructions.anchor.setTo(0.5, 0.5);
    this.instExpire = this.time.now + BasicGame.INSTRUCTION_EXPIRE;

    this.score = this.game.score || 0;
    this.scoreText = this.add.text(
      this.game.width / 2, 30, '' + this.score,
      { font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.scoreText.anchor.setTo(0.5, 0.5);
  },

  stageComplete: function () {
    // Disable player input
    this.playerControl = false;
    this.bossMusic.stop();

    // Back down slightly then take off
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 50;

    // After a brief drawback, accelerate upward off screen
    this.time.events.add(Phaser.Timer.SECOND * 0.3, function () {
      this.player.body.collideWorldBounds = false;
      this.add.tween(this.player.body.velocity).to(
        { y: -800 }, 1500, Phaser.Easing.Quadratic.In, true
      );
    }, this);

    // After takeoff, fade to black
    this.time.events.add(Phaser.Timer.SECOND * 1.8, function () {
      var fade = this.add.graphics(0, 0);
      fade.beginFill(0x000000);
      fade.drawRect(0, 0, this.game.width, this.game.height);
      fade.endFill();
      fade.alpha = 0;
      var fadeTween = this.add.tween(fade).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
      fadeTween.onComplete.addOnce(function () {
        this.music.stop();
        this.game.score = this.score;
        this.game.lives = this.lives.countLiving();
        this.game.weaponLevel = this.weaponLevel;
        this.state.start(this.config.nextState, true, false, BasicGame.STAGE2_CONFIG);
      }, this);
    }, this);
  },

  damageFlash: function (sprite, duration, color) {
	// Default to 100ms duration and white (ADD blend) if no color specified
	duration = duration || 100;
	if (color) {
		sprite.tint = color;
		this.time.events.add(duration, function () {
		sprite.tint = 0xffffff;
		}, this);
	} else {
		sprite.blendMode = PIXI.blendModes.ADD;
		this.time.events.add(duration, function () {
		sprite.blendMode = PIXI.blendModes.NORMAL;
		}, this);
	}
  },

  displayEnd: function (win) {
    // you can't win and lose at the same time 
    if (this.endText && this.endText.exists) {
      return;
    }
    this.bossMusic.stop();
    this.music.stop();
    this.gameOverMusic.play();
    var msg = win ? 'You Win!!!' : 'Game Over!';
    this.endText = this.add.text(
      this.game.width / 2, this.game.height / 2 - 60, msg,
      { font: '72px serif', fill: '#fff' }
    );
    this.endText.anchor.setTo(0.5, 0);

    this.showReturn = this.time.now + BasicGame.RETURN_MESSAGE_DELAY;
  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    this.bg.destroy();
    this.player.destroy();
    this.enemyPool.destroy();
    this.bulletPool.destroy();
    this.explosionPool.destroy();
    if (this.enemy1ExplosionPool) { this.enemy1ExplosionPool.destroy(); }
    if (this.enemy2ExplosionPool) { this.enemy2ExplosionPool.destroy(); }
    if (this.bossExplosionPool) { this.bossExplosionPool.destroy(); }
    this.bossRingBulletPool.destroy();
    if (this.bossRingShotTimer) {
      this.time.events.remove(this.bossRingShotTimer);
    }
    this.instructions.destroy();
    this.scoreText.destroy();
    this.endText.destroy();
    this.returnText.destroy();
    //  Then let's go back to the main menu.
    this.state.start('MainMenu');
    this.bossMusic.destroy();
    this.music.destroy();
    this.gameOverMusic.destroy();

  }

};
