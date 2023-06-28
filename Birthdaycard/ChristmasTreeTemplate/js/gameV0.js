let config = {
    type: Phaser.AUTO,
    width: 611,
    height: 980,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let balloons;
let timerballoons;
let timerconfetti;
let balloonIcon;
let musicIcon
let birthdayMusic;

function preload() {
    this.load.image('background', './assets/images/back_1.png');
    this.load.image('cake', './assets/images/cake.png');
    this.load.image('balloon', './assets/images/balloon.png');
    this.load.image('balloonIcon', './assets/images/balloon_2.png');
    this.load.image('confetti', './assets/images/confetti.png');

    
    this.load.image('musicIcon', './assets/images/musicIcon.png');
    this.load.audio('birthdaymusic','./assets/audio/birthdayMusic.mp3');
}










//// CREATE /////

function create() {
    let backImage = this.add.image(0, 0, 'background');
    backImage.setOrigin(0, 0);
    backImage.setScale(0.5);

    cake = this.add.image(70, 500, 'cake');
    cake.setOrigin(0, 0);
    cake.setScale(0.8);


    confetti = this.physics.add.group({
        defaultKey: 'confetti',
        maxSize: 3
    });

    timerconfetti = this.time.addEvent({
        delay: 1500, // ms
        callback: spawnConfetti,
        callbackScope: this,
        loop: true
    });

    // BALLOONS
    balloons = this.physics.add.group({
        defaultKey: 'balloon',
        maxSize: 15
    });

    timerballoons = this.time.addEvent({
        delay: 1000, // ms
        callback: spawnballons,
        callbackScope: this,
        repeat: -1
    });

    balloonIcon = this.add.sprite(511, 900, 'balloonIcon').setInteractive();
    balloonIcon.setScale(0.2);
    balloonIcon.on('pointerdown', balloonControl);

    
    
    musicIcon = this.add.image(511, 870, 'musicIcon').setInteractive();
    musicIcon.setScale(0.06);
    musicIcon.setPosition(570,50);
    musicIcon.alpha = 1;
    musicIcon.on('pointerdown', soundControl);
    

    birthdayMusic = this.sound.add('birthdaymusic',{loop:true});
    birthdayMusic.play();
}










///UPDATE///


function update() {

    balloons.getChildren().forEach(function (balloon) {
        if (balloon.y < 0) {
            balloon.destroy();
        }
    }, this);

    confetti.getChildren().forEach(function (confettiPiece) {
        if (confettiPiece.y > config.height) {
            confettiPiece.destroy();
        }
    }, this);
    
}

function spawnballons() {
    let balloon = balloons.get();
    if (balloon) {
        balloon.setPosition(Phaser.Math.Between(0, 611), 980);
        balloon.setVelocity(0, -100); // Set a negative value for the Y velocity
        balloon.setScale(Phaser.Math.FloatBetween(0.02, 0.15)); // Random scale between 0.3 and 0.7
    }
}

function balloonControl() {
    timerballoons.paused = !timerballoons.paused;

    if (timerballoons.paused) {
        balloonIcon.alpha = 0.3;
    } else {
        balloonIcon.alpha = 1;
    }
}

function soundControl(){
    if(birthdayMusic.isPlaying) {
        birthdayMusic.stop();
        musicIcon.alpha = 0.3;
    }
    else {
        birthdayMusic.play();
        musicIcon.alpha = 1;
    }
}

function spawnConfetti() {
    for (let i = 0; i < 100; i++) {
        let confettiPiece = confetti.get();
        if (confettiPiece) {
            confettiPiece.setPosition(Phaser.Math.Between(0, 611), 0);
            confettiPiece.setVelocity(0, Phaser.Math.Between(0, 200)); // Set a positive value for the Y velocity
            confettiPiece.setScale(Phaser.Math.FloatBetween(2, 2));
        }
    }
}