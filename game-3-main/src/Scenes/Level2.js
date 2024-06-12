class Level2 extends Phaser.Scene {
    constructor() {
        super("Level2");
      }
    init() {
        this.physics.world.gravity.y = 500;
        this.PARTICLE_VELOCITY = 500;
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.image('tiles3', 'tilesets/original_packed.png');
        this.load.tilemapTiledJSON('map', 'tilemaps/level2.json');
        this.load.image('coin','images/coinL2.png');
        this.load.image('keyL2','images/keyL2.png');
        this.load.image('heart','images/tile_0044.png');
        this.load.image('p1', 'dirt_01.png');
        this.load.image('p2', 'smoke_10.png');
        this.load.atlas("platformer_characters", "images/tilemap-characters-packed.png", "images/tilemap-characters-packed.json");
        this.load.audio("water_coll", "laserSmall_000.ogg");
        this.load.audio("key_sound", "handleCoins2.ogg");
        this.load.audio("coin_sound", "confirmation_002.ogg");
        this.load.audio("heart_sound", "toggle_002.ogg");
        this.load.audio("enemy_sound", "laserLarge_001.ogg");
        this.load.audio("bad_end_sound", "jingles_PIZZI07.ogg");
    }
    create() {
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        let healthText = this.add.text(16, 64, 'Health: ' + health, { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        this.physics.world.setBounds(0, 0, 2160, 900);
        backgroundImage.setScale(4, 1);

        const map = this.make.tilemap({ key: 'map' });
        const tileset2 = map.addTilesetImage('original_packed', 'tiles3');
        const ground = map.createStaticLayer('groundL2', tileset2, 0, 240);
        const water = map.createStaticLayer('waterL2', tileset2, 0, 240);
        const buildingL2 = map.createStaticLayer('backgroundL2', tileset2, 0, 240);

        ground.setCollisionByExclusion(-1, true);
        water.setCollisionByExclusion(-1, true);

        this.coinL2 = this.physics.add.group();
  
        const coinObjects = map.getObjectLayer('Objects').objects;
        coinObjects.forEach(coinObjects => {
            const coins = this.add.sprite(coinObjects.x, coinObjects.y + 230, 'coin');
            this.physics.add.existing(coins);
            coins.body.setImmovable(true);
            coins.body.moves = false;
            this.coinL2.add(coins);
        });

        this.keysL2 = this.physics.add.group();

        const keysObjects = map.getObjectLayer('Objects2').objects;
        keysObjects.forEach(keysObjects => {
            const keys = this.add.sprite(keysObjects.x, keysObjects.y + 230, 'keyL2');
            this.physics.add.existing(keys);
            keys.body.setImmovable(true);
            keys.body.moves = false;
            this.keysL2.add(keys);
        });

        this.heartL2 = this.physics.add.group();

        const heartObjects = map.getObjectLayer('Objects3').objects;
        heartObjects.forEach(heartObjects => {
            const hearts = this.add.sprite(heartObjects.x, heartObjects.y + 230, 'heart');
            this.physics.add.existing(hearts);
            hearts.body.setImmovable(true);
            hearts.body.moves = false;
            this.heartL2.add(hearts);
        });


        this.player = this.physics.add.sprite(50, 400, 'platformer_characters', "tile_0006.png");
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, ground);

        let coinScoreText = this.add.text(16, 16, 'Coins: 0 / 20', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        const playerCollideCoins = (player, coins) => {
          this.sound.play("coin_sound");
            coins.destroy();
            coinScore += 1;
            console.log(coinScore);
            coinScoreText.setText('Coins: ' + coinScore + ' / 20');
            /*if(score + 1) {
              this.sound.play("box_sound");
            }   */
            if(coinScore == 20 && keyScore == 5) {
                this.scene.start('Level3');
                coinScore = 0;
                keyScore = 0;
            }
        };

        this.physics.add.collider(this.player, this.coinL2, playerCollideCoins, null, this);
        
        let keyScoreText = this.add.text(1060, 16, 'Keys: 0 / 5', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        const playerCollideKeys = (player, keys) => {
            this.sound.play("key_sound");
            keys.destroy();
            keyScore += 1;
            console.log(keyScore);
            keyScoreText.setText('Keys: ' + keyScore + ' / 5');
            /*if(score + 1) {
              this.sound.play("box_sound");
            }   */
            if(coinScore == 20 && keyScore == 5) {
                this.scene.start('Level3');
                coinScore = 0;
                keyScore = 0;
            }
        };
        
        this.physics.add.collider(this.player, this.keysL2, playerCollideKeys, null, this);

        const playerCollideHeart = (player, hearts_L2) => {
          this.sound.play("heart_sound");
            hearts_L2.destroy();
            if(health < 3) {
                health += 1;
            }
            console.log(health);
            healthText.setText('Health: ' + health);
            /*if(score + 1) {
              this.sound.play("box_sound");
            }   */
        };

        this.physics.add.collider(this.player, this.heartL2, playerCollideHeart, null, this);

        this.anims.create({
            key: 'enemyWalk',
            frames: this.anims.generateFrameNames('platformer_characters', {
              prefix: "tile_",
              start: 4,
              end: 5,
              suffix: ".png",
              zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
              prefix: "tile_",
              start: 6,
              end: 7,
              suffix: ".png",
              zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });
      
        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
              { frame: "tile_0006.png" }
            ],
            repeat: -1
        });
      
        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
              { frame: "tile_0007.png" }
            ],
        });
        
        this.cursors = this.input.keyboard.createCursorKeys();

        const playerHit = (player, water) => {
          this.sound.play("water_coll");
            player.setVelocity(0, 0);
            player.setX(50);
            player.setY(400);
            health -= 1;
            healthText.setText('Health: ' + health);
            console.log(health);
            player.play('idle', true);
            player.setAlpha(0);
            this.tweens.add({
              targets: player,
              alpha: 1,
              duration: 100,
              ease: 'Linear',
              repeat: 5,
            });
            if(health <= 0) {
              this.sound.play("bad_end_sound");
              this.scene.start('Gameover');
            }
        };

        const enemyHit = (player, enemy) => {
          this.sound.play("enemy_sound");
            player.setVelocity(0, 0);
            player.setX(50);
            player.setY(400);
            health -= 1;
            healthText.setText('Health: ' + health);
            console.log(health);
            player.play('idle', true);
            player.setAlpha(0);
            this.tweens.add({
              targets: player,
              alpha: 1,
              duration: 100,
              ease: 'Linear',
              repeat: 5,
            });
            if(health <= 0) {
              this.sound.play("bad_end_sound");
              this.scene.start('Gameover');
            }
        };

        this.enemy = this.physics.add.sprite(510, 400, 'platformer_characters', "tile_0004.png");
        this.enemy.setFlipX(true);
        this.enemy.play('enemyWalk');
        this.physics.add.collider(this.enemy, ground);
        let tween1 = this.tweens.add({
            targets: this.enemy,
            x: 610,
            duration: 2000,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
        this.physics.add.collider(this.player, this.enemy, enemyHit, null, this);

        this.enemy1 = this.physics.add.sprite(920, 400, 'platformer_characters', "tile_0004.png");
        this.enemy1.setFlipX(true);
        this.enemy1.play('enemyWalk');
        this.physics.add.collider(this.enemy1, ground);
        let tween2 = this.tweens.add({
            targets: this.enemy1,
            x: 1220,
            duration: 3000,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
        this.physics.add.collider(this.player, this.enemy1, enemyHit, null, this);

        this.enemy2 = this.physics.add.sprite(1650, 400, 'platformer_characters', "tile_0004.png");
        this.enemy2.setFlipX(true);
        this.enemy2.play('enemyWalk');
        this.physics.add.collider(this.enemy2, ground);
        let tween3 = this.tweens.add({
            targets: this.enemy2,
            x: 1800,
            duration: 3000,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
        this.physics.add.collider(this.player, this.enemy2, enemyHit, null, this);


        this.physics.add.collider(this.player, water, playerHit, null, this);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(1);

        var particles = this.add.particles("p1");
        this.emitter = particles.createEmitter({
            speed: 0,
            scale: {start: 0.03, end: 0.1},
            frequency: 100,
            lifespan: 50
        });
        var on_jump = this.add.particles("p2");
        this.jump_emitter = on_jump.createEmitter({
            speed: 0,
            scale: {start: 0.03, end: 0.1},
            frequency: 100,
            lifespan: 50
        });
    
        this.emitter.stop();
        this.jump_emitter.stop();

    }
    update() {
        if (this.cursors.left.isDown) {
            this.emitter.start();
            this.player.setVelocityX(-200);
            this.emitter.startFollow(this.player, this.player.displayWidth-20, this.player.displayHeight-15, false);
            if (this.player.body.onFloor()) {
              this.player.play('walk', true);
            }
            if (this.player.body.blocked.down) {
              this.emitter.start();
            } else {
              this.emitter.stop();
            }
          } else if (this.cursors.right.isDown) {
            this.emitter.start();
            this.player.setVelocityX(200);
            this.emitter.startFollow(this.player, this.player.displayWidth-30, this.player.displayHeight-15, false);
      
            if (this.player.body.onFloor()) {
              this.player.play('walk', true);
            }
            if (this.player.body.blocked.down) {
              this.emitter.start();
            } else {
              this.emitter.stop();
            }
          } else {
            this.player.setVelocityX(0);
            if (this.player.body.onFloor()) {
              this.emitter.stop();
              this.player.play('idle', true);
            }
          }
      
          if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
            this.jump_emitter.start();
            this.player.setVelocityY(-300);
            this.jump_emitter.startFollow(this.player, this.player.displayWidth-30, this.player.displayHeight-15, false);
            this.player.play('jump', true);
          }
      
          if (!this.player.body.onFloor()) {
            this.jump_emitter.start();
          } else {
            this.jump_emitter.stop();
          }
      
          if (this.player.body.velocity.x < 0) {
            this.player.setFlipX(false);
          } else if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(true);
          }
        
        }
}   