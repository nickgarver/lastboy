const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y : 2000}
    }
  },
  scene: [
    GameScene,
    BootScene
  ]
};

var game = new Phaser.Game(config)
