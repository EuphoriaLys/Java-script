let config = {
    type: Phaser.AUTO,
    width: 611,
    height: 980,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload : preload,     
        create: create,     
        update : update   
    }
};


let game = new Phaser.Game(config);
let inc = -0.015;
let blinkingStarImage;
let snowflakes;
let timerSnowflakes;
let christmasMusic;
let snowflakeIcon, musicIcon ,ribbonIcon;
let tweenRibbonClear;

function preload() {
    this.load.image('background', './assets/images/back_2.png');
    this.load.image('pannel', './assets/images/button.png');
    this.load.image('tree', './assets/images/tree_1.png');
    this.load.image('ribbon', './assets/images/ribbon.png');
    this.load.image('ribbonClear', './assets/images/ribbonClear.png');
    this.load.image('bauble', './assets/images/obj/obj_21.png');
    this.load.image('star', './assets/images/obj/star.png');
    this.load.image('snowflake', './assets/images/snowflake.png');
    this.load.image('snowflakeIcon', './assets/images/obj/obj_10.png');
    this.load.image('musicIcon', './assets/images/obj/obj_02.png');
    this.load.image('gift', './assets/images/obj/obj_16.png');
    this.load.image('ribbonIcon', './assets/images/obj/obj_20.png');

    this.load.audio('christmasMusic', './assets/audio/christmasMusic.mp3');
}

function create() {
    let backImage = this.add.image(0, 0, 'background');
    backImage.setOrigin(0, 0);
    backImage.setScale(0.5);
    for(let i=0; i<100; i++){
        let starImage = this.add.image(Phaser.Math.Between(3, 608), Phaser.Math.Between(3, 500), 'star');
        //starImage.setScale(Phaser.Math.Between(3, 8)/10);
        starImage.setScale(Phaser.Math.FloatBetween(0.3, 0.8));
    }
    blinkingStarImage = this.add.image(200, 200, 'star');
    let tree = this.add.image(100, 250, 'tree');
    tree.setOrigin(0, 0);
    tree.setScale(0.4);
    let ribbon = this.add.image(160, 350, 'ribbon');
    ribbon.setOrigin(0, 0);
    ribbon.setScale(0.4);
    let ribbonClear = this.add.image(160, 350, 'ribbonClear');
    ribbonClear.setOrigin(0, 0);
    ribbonClear.setScale(0.4);

    tweenRibbonClear = this.tweens.add({
        targets: ribbonClear,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        yoyo: true,
        loop: -1
        });

    let bauble = this.add.image(170, 530, 'bauble');
    bauble.setOrigin(0, 0);
    bauble.setScale(0.4);
    bauble = this.add.image(350, 530, 'bauble');
    bauble.setOrigin(0, 0);
    bauble.setScale(0.4);

    pannel = this.add.image(305, 100, 'pannel');
    pannel.setVisible(false);

    pannelText = this.add.text(210, 72, 'Merry Christmas', { fontFamily: 'Arial', fontSize: 24, color: '#00ff00' });
    pannelText.setVisible(false);

    gift = this.add.image(500, 630, 'gift').setInteractive();
    gift.on('pointerdown', giftControl);
    gift.setScale(0.4);

    snowflakeIcon = this.add.image(90, 880, 'snowflakeIcon').setInteractive();
    snowflakeIcon.setScale(0.5);
    snowflakeIcon.on('pointerdown', snowControl);

    ribbonIcon = this.add.image(300, 880, 'ribbonIcon').setInteractive();
    ribbonIcon.setScale(0.7);
    ribbonIcon.on('pointerdown', ribbonControl);

    musicIcon = this.add.image(511, 870, 'musicIcon').setInteractive();
    musicIcon.setScale(0.6);
    musicIcon.alpha = 0.3;
    musicIcon.on('pointerdown', soundControl);


    snowflakes = this.physics.add.group({
        defaultKey: 'snowflake',
        maxSize: 100
        });

    timerSnowflakes = this.time.addEvent({
        delay: 200, // ms
        callback: spawnSnowflake,
        callbackScope: this,
        repeat: -1
        });

    christmasMusic = this.sound.add('christmasMusic');
}

function update() {
    if(blinkingStarImage.alpha==1) inc=-inc;
    if(blinkingStarImage.alpha<0.2) {
        inc=-inc;
        blinkingStarImage.setPosition(Phaser.Math.Between(3, 608), Phaser.Math.Between(3, 500));
    }
    blinkingStarImage.alpha += inc;
    snowflakes.getChildren().forEach(
        function(snowflake) {
        if (snowflake.y>980) snowflake.destroy();
        }, this);
}

function spawnSnowflake(){
    let snowflake = snowflakes.get();
    if (snowflake) {
        snowflake.setPosition(Phaser.Math.Between(0, 611), 0);
        snowflake.setVelocity(0, 100);
    }
}

function snowControl(){
    timerSnowflakes.paused = ! timerSnowflakes.paused ;

    // timerSnowflakes.paused ? snowflakeIcon.alpha = 0.3 : snowflakeIcon.alpha = 1;

    if(timerSnowflakes.paused) snowflakeIcon.alpha = 0.3;
    else snowflakeIcon.alpha = 1;

}

function soundControl(){
    if(christmasMusic.isPlaying) {
        christmasMusic.pause();
        musicIcon.alpha = 0.3;
    }
    else {
        christmasMusic.play();
        musicIcon.alpha = 1;
    }
}
function giftControl(){
    pannel.setVisible(true);
    pannelText.setVisible(true);
}

function ribbonControl(){
    if(tweenRibbonClear.paused) {
        tweenRibbonClear.resume();
        ribbonIcon.alpha = 1;
    }
    else {
        tweenRibbonClear.pause();
        ribbonIcon.alpha = 0.3;
    }
}