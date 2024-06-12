const config = {
    type: Phaser.CANVAS,
    parent: 'game',
    width: 1300,
    height: 600,
    scale: {
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Mainmenu, Gameaction, Level2, Level3, Goodend, Gameover],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y:0 },
        debug: false,
      },
    }
  };
  
  const game = new Phaser.Game(config);
  
  let score = 0;
  let health = 3;
  let coinScore = 0;
  let keyScore = 0;
  var enemy;
  var tween1;
  