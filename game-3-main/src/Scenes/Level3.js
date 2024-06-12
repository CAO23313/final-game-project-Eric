class Level3 extends Phaser.Scene {
    constructor() {
        super("Level3");
      }
    init() {
        this.physics.world.gravity.y = 500;
        this.PARTICLE_VELOCITY = 500;
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.image('tiles4', 'tilesets/level3_packed.png');
        this.load.image('ground_damage', 'tilesets/hurt.png');
        this.load.tilemapTiledJSON('mapL3', 'tilemaps/level3.json');
        this.load.image('coin','images/coinL2.png');
        this.load.image('keyL2','images/keyL2.png');
        this.load.image('tiles2', 'images/box.png');
        this.load.image('heart','images/tile_0044.png');
        this.load.image('p1', 'dirt_01.png');
        this.load.image('p2', 'smoke_10.png');
        this.load.atlas("platformer_characters", "images/tilemap-characters-packed.png", "images/tilemap-characters-packed.json");
        this.load.audio("box_sound", "confirmation_001.ogg");
        this.load.audio("water_coll", "laserSmall_000.ogg");
        this.load.audio("key_sound", "handleCoins2.ogg");
        this.load.audio("coin_sound", "confirmation_002.ogg");
        this.load.audio("heart_sound", "toggle_002.ogg");
        this.load.audio("enemy_sound", "laserLarge_001.ogg");
        this.load.audio("bad_end_sound", "jingles_PIZZI07.ogg");
        this.load.audio("good_end_sound", "jingles_PIZZI10.ogg");
    }
    create() {
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        let healthText = this.add.text(16, 64, 'Health: ' + health, { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        this.physics.world.setBounds(0, 0, 2160, 900);
        backgroundImage.setScale(4, 1);

        const map = this.make.tilemap({ key: 'mapL3' });
        const tileset3 = map.addTilesetImage('level3_packed', 'tiles4');
        const tileset3_damage = map.addTilesetImage('tile_0068', 'ground_damage');
        const ground = map.createStaticLayer('groundL3', tileset3, 0, 240);
        const buildingL3 = map.createStaticLayer('backgroundL3', tileset3, 0, 240);
        const ground_hit = map.createStaticLayer('damage', tileset3_damage, 0, 240);

        this.heartL3 = this.physics.add.group();

        const heartObjects = map.getObjectLayer('Objects4').objects;
        heartObjects.forEach(heartObjects => {
            const hearts = this.add.sprite(heartObjects.x, heartObjects.y + 230, 'heart');
            this.physics.add.existing(hearts);
            hearts.body.setImmovable(true);
            hearts.body.moves = false;
            this.heartL3.add(hearts);
        });

        this.keysL3 = this.physics.add.group();

        const keysObjects = map.getObjectLayer('Objects3').objects;
        keysObjects.forEach(keysObjects => {
            const keys = this.add.sprite(keysObjects.x, keysObjects.y + 230, 'keyL2');
            this.physics.add.existing(keys);
            keys.body.setImmovable(true);
            keys.body.moves = false;
            this.keysL3.add(keys);
        });

        this.coinL3 = this.physics.add.group();

        const coinObjects = map.getObjectLayer('Objects2').objects;
        coinObjects.forEach(coinObjects => {
            const coin = this.add.sprite(coinObjects.x, coinObjects.y + 230, 'coin');
            this.physics.add.existing(coin);
            coin.body.setImmovable(true);
            coin.body.moves = false;
            this.coinL3.add(coin);
        });

        this.boxes = this.physics.add.group();

        const boxObjects = map.getObjectLayer('Objects1').objects;
        boxObjects.forEach(boxObject => {
            const box = this.add.sprite(boxObject.x, boxObject.y + 230, 'tiles2');
            this.physics.add.existing(box);
            box.body.setImmovable(true);
            box.body.moves = false;
            this.boxes.add(box);
        });

        ground.setCollisionByExclusion(-1, true);
        ground_hit.setCollisionByExclusion(-1, true);

        this.player = this.physics.add.sprite(50, 400, 'platformer_characters', "tile_0006.png");
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, ground);

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
            if(coinScore == 18 && keyScore == 5 && score == 5) {
              this.sound.play("good_end_sound");
                this.scene.start('Goodend');
                coinScore = 0;
                keyScore = 0;
                score = 0;
            }
        };
        
        this.physics.add.collider(this.player, this.keysL3, playerCollideKeys, null, this);
        
        let coinScoreText = this.add.text(16, 16, 'Coins: 0 / 18', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        const playerCollideCoins = (player, coin) => {
            this.sound.play("coin_sound");
            coin.destroy();
            coinScore += 1;
            console.log(coinScore);
            coinScoreText.setText('Coins: ' + coinScore + ' / 18');
            /*if(score + 1) {
              this.sound.play("box_sound");
            }   */
            if(coinScore == 18 && keyScore == 5 && score == 5) {
              this.sound.play("good_end_sound");
                this.scene.start('Goodend');
                coinScore = 0;
                keyScore = 0;
                score = 0;
            }
        };

        this.physics.add.collider(this.player, this.coinL3, playerCollideCoins, null, this);

        let scoreText = this.add.text(550, 16, 'Box: 0 / 5', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        const playerCollideBox = (player, box) => {
          this.sound.play("box_sound");
            box.destroy();
            score += 1;
            console.log(score);
            scoreText.setText('Box: ' + score + ' / 5');
            /*if(score + 1) {
              this.sound.play("box_sound");
            }
            if (score >= 13) {
              this.scene.start('Level2');
            }   */
            if(coinScore == 18 && keyScore == 5 && score == 5) {
              this.sound.play("good_end_sound");
                this.scene.start('Goodend');
                coinScore = 0;
                keyScore = 0;
                score = 0;
            }
          };

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

        this.physics.add.collider(this.player, this.heartL3, playerCollideHeart, null, this);


        this.physics.add.collider(this.player, this.boxes, playerCollideBox, null, this);

        const playerHit = (player, ground_hit) => {
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

        this.cursors = this.input.keyboard.createCursorKeys();

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

        this.enemy = this.physics.add.sprite(570, 400, 'platformer_characters', "tile_0004.png");
        this.enemy.setFlipX(true);
        this.enemy.play('enemyWalk');
        this.physics.add.collider(this.enemy, ground);
        let tween1 = this.tweens.add({
            targets: this.enemy,
            x: 640,
            duration: 2000,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
        this.physics.add.collider(this.player, this.enemy, enemyHit, null, this);

        this.enemy1 = this.physics.add.sprite(720, 500, 'platformer_characters', "tile_0004.png");
        this.enemy1.setFlipX(true);
        this.enemy1.play('enemyWalk');
        this.physics.add.collider(this.enemy1, ground);
        let tween2 = this.tweens.add({
            targets: this.enemy1,
            x: 920,
            duration: 3000,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
        this.physics.add.collider(this.player, this.enemy1, enemyHit, null, this);

        this.enemy2 = this.physics.add.sprite(1250, 300, 'platformer_characters', "tile_0004.png");
        this.enemy2.setFlipX(true);
        this.enemy2.play('enemyWalk');
        this.physics.add.collider(this.enemy2, ground);
        let tween3 = this.tweens.add({
            targets: this.enemy2,
            x: 1400,
            duration: 3000,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
        this.physics.add.collider(this.player, this.enemy2, enemyHit, null, this);
        
        this.physics.add.collider(this.player, ground_hit, playerHit, null, this);

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