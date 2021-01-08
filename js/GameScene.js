class GameScene extends Phaser.Scene {
  constructor() {
      super({key: "GameScene"});
  }

  preload(){
    //load init game stuff
    this.load.spritesheet('lastboy',
        'assets/lastboy.png',
        { frameWidth: 80, frameHeight: 100 }
    );
    this.load.spritesheet('fire',
        'assets/lava-ani.png',
        {frameWidth: 200, frameHeight: 54}
    );
    this.load.spritesheet('clouds-ani',
        'assets/clouds-ani.png',
        {frameWidth: 800, frameHeight: 200}
    );
    this.load.spritesheet('ghosty',
        'assets/ghosty.png',
        {frameWidth: 150, frameHeight: 179}
    );
    this.load.spritesheet('gloop',
        'assets/gloop-small.png',
        {frameWidth: 439, frameHeight: 348}
    );
    this.load.spritesheet('shell',
        'assets/shell.png',
        {frameWidth: 202, frameHeight: 202}
    );
    this.load.image('ground', 'assets/platform.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('clouds', 'assets/black-clouds.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('planet1', 'assets/alien-planet.png');
    this.load.image('planet2', 'assets/sand-planet.png');
    this.load.image('background', 'assets/night.png');
    this.load.audio('jump', 'assets/jump.wav', {
        instances: 1
    });
    this.load.audio('lava', 'assets/lavaDeath.wav', {
        instances: 1
    });
    this.load.audio('theme', 'assets/theme.wav', {
        instances: 1
    });
  }

  create(){
    //load main game
    this.platforms = this.add.group();
    this.hotLava = this.add.group();
    this.stars = this.add.group();
    this.monsters = this.add.group();
    this.add.image(0, 0, 'background').setOrigin(0, 0)
    this.add.image(600, 100, 'planet1').setScale(.6)
    this.add.image(200, 200, 'planet2').setScale(.4)
    this.stars[0] = this.add.image(360,163, 'star').setScale(.5)
    this.stars[1] = this.add.image(210,303, 'star').setScale(.5)
    this.stars[2] = this.add.image(400,36, 'star').setScale(.5)
    this.stars[3] = this.add.image(70,233, 'star').setScale(.5)
    this.stars[4] = this.add.image(670,263, 'star').setScale(.5)
    this.stars[5] = this.add.image(290,139, 'star').setScale(.5)
    this.stars[6] = this.add.image(200,70, 'star').setScale(.5)
    this.stars[7] = this.add.image(503,360, 'star').setScale(.5)
    this.stars[8] = this.add.image(250,373, 'star').setScale(.5)
    this.stars[9] = this.add.image(370,263, 'star').setScale(.5)
    this.clouds = this.physics.add.sprite(0, 70, 'clouds-ani').setOrigin(0, 0)
    this.clouds.body.immovable = true;
    this.clouds.body.allowGravity = false;
    this.clouds.alpha = 0.8;
    this.clouds.setVelocityX(-10);
    this.score = 0;
    this.currentDirection = 'right';
    this.sound.add('jump');
    this.sound.add('lava');
    this.sound.add('theme');
    this.sound.play('theme');
    var style = {
      font: "25px myFont",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    //y = 0.1633906 + (15300770 - 0.1633906)/(1 + (x/0.1048003)^1.00024)
    //speed --> x
    //wait time --> y
    this.speed = 400; //x
    this.labelScore = this.add.text(20, 20, "Score: 0",
        { style });
    this.finalScore = this.add.text(230, 280, "",
        { fontSize: '32px', fill: '#fff' });

    this.player = this.physics.add.sprite(400, 90, 'lastboy')
    this.player.body.setSize(80, 100, 0, 0);
    // this.debug.body.this.player;
    this.player.setBounce(.3);
    // this.player.setCollideWorldBounds(true);
    this.player.checkWorldBounds = true;
    this.player.outOfBoundsKill = true;
    this.player.alive = true;
    this.anims.create({
        key: 'sparkle',
        frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('lastboy', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('lastboy', { start: 2, end: 3 }),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key: 'left-crouch',
        frames: this.anims.generateFrameNumbers('lastboy', { start: 6, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right-crouch',
        frames: this.anims.generateFrameNumbers('lastboy', { start: 4, end: 5 }),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key: 'right-freeze',
        frames: this.anims.generateFrameNumbers('lastboy', { start: 3, end: 3 }),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'left-freeze',
        frames: this.anims.generateFrameNumbers('lastboy', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'right-jump',
        frames: this.anims.generateFrameNumbers('lastboy', { start: 2, end: 2 }),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'left-jump',
        frames: this.anims.generateFrameNumbers('lastboy', { start: 1, end: 1 }),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'cloud-move',
        frames: this.anims.generateFrameNumbers('clouds-ani', { start: 0, end: 2 }),
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key: 'ghost-hover',
        frames: this.anims.generateFrameNumbers('ghosty', { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'shell-slide',
        frames: this.anims.generateFrameNumbers('shell', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'gloop-gang',
        frames: this.anims.generateFrameNumbers('gloop', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    });

    this.player.anims.play('right', true);
    this.clouds.anims.play('cloud-move', true);

    this.createInitRow()
    this.platformTimer = this.time.addEvent({
      delay: (0.1633906+(15300770 - 0.1633906)/(1 + Math.pow((this.speed/0.1048003),1.00024))),
      callback: this.createRow,
      callbackScope: this,
      loop: true
    });
    this.scoreTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateScore,
      callbackScope: this,
      loop: true
    });
    this.starTimer = this.time.addEvent({
      delay: 250,
      callback: this.twinkleTwinkle,
      callbackScope: this,
      loop: true
    });

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.monsters);
    this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update(){
    if (this.keyEnter.isDown && this.player.alive == false) {
      console.log('reset!');
      this.resetGame();
    }
    // if (this.keyDown.isDown) {
    //   this.player.body.setSize(80, 50, -300, -300); //width, height, offsetX, offsetY
    // } else {
    //   this.player.body.setSize(80, 100, 0, 0); //width, height, offsetX, offsetY
    // }
    if (this.player.body.position.x < 0) {
      this.player.body.position.x = 0;
      if (this.currentDirection == 'right') {
        this.player.anims.play('right', true);
      } else if (this.currentDirection == 'left') {
        this.player.anims.play('left', true);
      } else {
        console.log('error');
      }
    }
    if (this.player.body.position.x > 740) {
      this.player.body.position.x = 740;
    }
    // Create an empty group
    if (this.keyUp.isDown && this.player.body.touching.down && this.player.alive == true) {
      if (this.player.alive == false)
          return;
      this.player.setVelocityY(-720);
      this.sound.play('jump');
      if (this.currentDirection == 'right') {
        this.player.anims.play('right-jump', false);
      } else if (this.currentDirection == 'left') {
        this.player.anims.play('left-jump', false);
      }
    }
    else if (this.keyDown.isDown && this.player.alive == true) {
      if (this.currentDirection == 'right' && this.player.body.touching.down) {
        this.player.anims.play('right-crouch', true);
      } else if (this.currentDirection == 'left' && this.player.body.touching.down) {
        this.player.anims.play('left-crouch', true);
      }
      // this.player.setVelocityY(2000);
    }
    else if (this.keyLeft.isDown && this.player.alive == true) {
      this.currentDirection = 'left';
      this.player.anims.play('left', true);
      this.player.setVelocityX(-400);
    }
    else if (this.keyRight.isDown && this.player.alive == true) {
      this.currentDirection = 'right';
      this.player.anims.play('right', true);
      this.player.setVelocityX(this.speed);
    } else {
      if (!this.player.body.touching.down) {
        return;
      }
      this.player.setVelocityX(0);
      if (this.currentDirection == 'right') {
        this.player.anims.play('right-freeze', false);
      } else if (this.currentDirection == 'left') {
        this.player.anims.play('left-freeze', false);
      } else {
        console.log('error');
      }
    }
    if (this.keySpace.isDown) {
      //shoot?
    }
    this.physics.add.overlap(
    this.player, this.hotLava, this.hitLava, null, this);
    this.physics.add.overlap(
    this.player, this.monsters, this.hitLava, null, this);
  }

  createPlatform(world,xDist,yDist,kind) {
    var platform = world.physics.add.sprite(xDist, yDist, kind);
    //velocity = pixels per second, 800 pixels wide,
    platform.setVelocityX(-this.speed);
    // console.log(platform.body.velocity.x);
    platform.body.immovable = true;
    platform.body.allowGravity = false;
    platform.checkWorldBounds = true;
    platform.outOfBoundsKill = true;
    if (kind == 'fire') {
      platform.anims.play('sparkle', true);
      this.hotLava.add(platform)
      return;
    }
    // platform.setBounce(5)

    this.platforms.add(platform)
    // console.log(this.platforms);
  }

  createMonster(world,xDist,yDist,kind) {
    var monster = world.physics.add.sprite(xDist, yDist, kind)
    //velocity = pixels per second, 800 pixels wide,
    monster.setVelocityX(-this.speed);
    // console.log(platform.body.velocity.x);
    monster.body.immovable = true;
    monster.body.allowGravity = false;
    monster.checkWorldBounds = true;
    monster.outOfBoundsKill = true;
    if (kind == 'ghosty') {
      monster.setScale(.5);
      monster.anims.play('ghost-hover', true);
    } else if(kind == 'shell'){
      monster.setScale(.2);
      monster.anims.play('shell-slide', true);
    } else if(kind == 'gloop'){
      monster.setScale(.2);
      monster.anims.play('gloop-gang', true);
    }
    this.monsters.add(monster)
    // console.log(this.platforms);
  }

  createRow() {
    this.speed = this.speed + 10;
    var tempSpeed = this.speed
    this.platforms.children.iterate(function (child) {
      child.body.velocity.x = -tempSpeed;
    });
    this.hotLava.children.iterate(function (child) {
      child.body.velocity.x = -tempSpeed;
    });
    this.platformTimer.delay = (0.1633906+(15300770 - 0.1633906)/(1 + Math.pow((this.speed/0.1048003),1.00024)));

    var hole = Math.floor(Math.random() * 10) + 1;
    var monster = null;
    // console.log('create row');
    // Add the 6 pipes
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++){
      if (hole == i){
        this.createPlatform(this,900+(i*200),618,'fire');
      } else {
        if (hole+1 == i) {
          this.createPlatform(this,900+(i*200),573,'ground');
        }
        monster = Math.floor(Math.random() * 30) + 1;
        if (monster == 6) {
          this.createMonster(this,900+(i*200),320,'ghosty');
        } else if(monster == 7) {
          this.createMonster(this,900+(i*200),530,'shell');
        } else if(monster == 8) {
          this.createMonster(this,900+(i*200),513,'gloop');
        }
        this.createPlatform(this,900+(i*200),573,'ground');
      }
    }
  }
  createInitRow() {
    for (var i = 0; i < 11; i++){
        this.createPlatform(this,100+(i*200),573,'ground');
    }
    this.createPlatform(this,100+(11*200),618,'fire');
  }

  updateScore(){
    this.starLucky = Math.floor(Math.random() * 10);
    this.starBright = (Math.floor(Math.random() * 10))/10;
    this.stars[this.starLucky].alpha = this.starBright;

    this.score += 1;
    this.labelScore.setText('Score: ' + this.score);
  }
  twinkleTwinkle(){
    this.starLucky = Math.floor(Math.random() * 10);
    this.starBright = (Math.floor(Math.random() * 10))/10;
    this.stars[this.starLucky].alpha = this.starBright;
  }

  hitLava(){
    this.finalScore.setText("GAME OVER, Score: " + this.score);
    if (this.player.alive == false)
        return;
    this.player.alive = false;
    // this.sound.pause('theme');
    this.player.anims.play('die', true);
    this.sound.play('lava');
    this.player.setTint(0xff0000);
    this.physics.pause();
    this.scoreTimer.paused = true;
    this.platformTimer.paused = true;
  }
  resetGame(){
    this.platforms.children.iterate(function (child) {
      child.alive = false;
      child.exists = false;
      child.visible = false;
    });
    this.monsters.children.iterate(function (child) {
      child.alive = false;
      child.exists = false;
      child.visible = false;
    });
    this.hotLava.children.iterate(function (child) {
      child.alive = false;
      child.exists = false;
      child.visible = false;
    });
    // this.finalScore.text.destroy();
    this.score = 0;
    this.player.setTint(0xffffff);
    this.player.body.position.x = 400;
    this.player.body.position.y = 90;
    this.clouds.body.position.x = 70;
    this.clouds.body.position.y = 0;
    this.player.alive = true;
    this.speed = 400; //x
    this.physics.resume();
    this.labelScore.setText('Score: ' + this.score);
    this.finalScore.setText("");
    this.scoreTimer.paused = false;
    this.platformTimer.paused = false;
    this.createInitRow();
  }
}
