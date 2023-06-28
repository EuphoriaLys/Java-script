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
let inc = -0.02;
let blinkingstar;
let snowflakes;
let snowflakeIcon;
let timerSnowflakes;
let tweenRibbondclear;
let surpriseText;
let christmasMusic;
let musicIcon;
let giftBox;

function preload() {
    this.load.image('tree','./assets/images/tree_2.png');
    this.load.image('boule1','./assets/images/obj/boule_darkorange.png');
    this.load.image('boule2','./assets/images/obj/boule_violet.png');
    this.load.image('ribbon','./assets/images/ribbon.png');
    this.load.image('ribbonClear','./assets/images/ribbonClear.png');
    this.load.image('background','./assets/images/back_2.png');
    this.load.image('star','./assets/images/obj/star.png');
    this.load.image('blinkingstar','./assets/images/obj/star.png');
    this.load.image('snowflake','./assets/images/snowflake.png');
    this.load.image('snowflakeIcon','./assets/images/obj/flocon.png');
    this.load.image('musicIcon', './assets/images/obj/bell.png');
    this.load.image('giftbox', './assets/images/obj/obj_16.png');
    this.load.image('button','./assets/images/button.png');

    this.load.audio('christmasMusic', './assets/audio/christmasMusic.mp3');
    this.load.image('ribbonIcon', './assets/images/obj/obj_20.png' )
}




function create() {


//BACKGROUND
    backImage = this.add.image(0,0,'background');
    backImage.setOrigin(0,0);
    backImage.setScale(0.5);



//STARS 

backImage = this.add.image(0,0,'star');
backImage.setOrigin(0,0);
backImage.setScale(0.5);
for(let i=0; i<100; i++){
    starImage = this.add.image(Phaser.Math.Between(3,608),Phaser.Math.Between(3,480),'star');
    //starImage.setScale(Phaser.Math.Between(3,10)/10); //si on veux juste les faire random
    starImage.setScale(Phaser.Math.FloatBetween(0.3,0.8)); //si on veut avoir les scale en virgule
}



//blinkingstar
    blinkingstarImage = this.add.image(200,200,'blinkingstar');
    blinkingstarImage.setScale(1.5);
    



//blinking effect 

this.tweens.add({
    targets: blinkingstar,
    alpha: 0,
    duration: 1000,
    ease: 'Power2',
    yoyo: true,
    repeat: -1
});



//TREE

    backImage = this.add.image(85,400,'tree');
    backImage.setOrigin(0,0);
    backImage.setScale(0.3);


//RIBBON
    let ribbon = this.add.image(115,455,'ribbon');
    ribbon.setOrigin(0,0);
    ribbon.setScale(0.35);


    let ribbonClear = this.add.image(115,455,'ribbonClear');
    ribbonClear.setOrigin(0,0);
    ribbonClear.setScale(0.35);

    tweenRibbonClear = this.tweens.add({
        targets: ribbonClear,
        alpha: 0,
        duration: 1500,
        ease: 'Power2',
        yoyo: true,
        loop: -1
        });


//BOULES
    
    backImage = this.add.image(205,450,'boule2');
    backImage.setOrigin(0,0)
    backImage.setScale(0.15)

    backImage = this.add.image(230,500,'boule2');
    backImage.setOrigin(0,0)
    backImage.setScale(0.15)

    backImage = this.add.image(185,525,'boule2');
    backImage.setOrigin(0,0)
    backImage.setScale(0.15)

    backImage = this.add.image(190,580,'boule1');
    backImage.setOrigin(0,0)
    backImage.setScale(0.20)

    backImage = this.add.image(250,650,'boule1');
    backImage.setOrigin(0,0)
    backImage.setScale(0.20)

    
    backImage = this.add.image(150,700,'boule1');
    backImage.setOrigin(0,0)
    backImage.setScale(0.20)

    backImage = this.add.image(290,740,'boule1');
    backImage.setOrigin(0,0)
    backImage.setScale(0.20)


//SNOWFLAKE

    snowflakeIcon = this.add.image(90,880,'snowflakeIcon').setInteractive();
    snowflakeIcon.setScale(0.5);
    snowflakeIcon.on('pointerdown',snowControl);

    snowflakes = this.physics.add.group({
        defaultKey: 'snowflake',
        maxSize: 100
    });
    timerSnowflakes = this.time.addEvent({
        delay:250, //ms
        callback: spawnSnowflake,
        callbackScope: this,
        repeat: -1
    });

    christmasMusic = this.sound.add('christmasMusic');

    musicIcon = this.add.sprite(511, 900, 'musicIcon').setInteractive();
    musicIcon.setScale(0.7);
    musicIcon.on('pointerdown', soundControl);

    giftBox = this.add.sprite(250, 820, 'giftbox').setInteractive();
    giftBox.setScale(0.5);
    giftBox.on('pointerdown', giftControl);

    buttonImage = this.add.image(0,0,'button');
    buttonImage.setOrigin(-0.6,-5);
    buttonImage.setScale(0.7);
    buttonImage.visible = 0;


    surpriseText = this.add.image(0, 0, 'button');
    surpriseText.setOrigin(-0.35, -0.4);
    surpriseText.setScale(0.9);
    surpriseText.visible = false;

    surpriseTextFont = this.add.text(0, 0, 'Merry Christmas !', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    surpriseTextFont.setOrigin(-0.70, -1.8);
    surpriseTextFont.setScale(1.5);
    surpriseTextFont.visible = false;

}



///UPDATE///

function update() {
    
    
    if (blinkingstarImage.alpha == 1) inc=-inc;
    if (blinkingstarImage.alpha <0.2) {
        inc=-inc;
        blinkingstarImage.setPosition(Phaser.Math.Between(3, 688),Phaser.Math.Between(3, 500));
    }
    blinkingstarImage.alpha += inc;


    snowflakes.getChildren().forEach(
        function(snowflake){
        if(snowflake.y>900) snowflake.destroy();
        }, this);
    
}


function spawnSnowflake(){
    let snowflake = snowflakes.get();
    if (snowflake) {
        snowflake.setPosition(Phaser.Math.Between(0, 611), 0);
        snowflake.setVelocity(0,100);
    }
}
function snowControl(){
    console.log("Icon is working snow")
    timerSnowflakes.paused = !timerSnowflakes.paused;
    if (timerSnowflakes.paused) snowflakeIcon.alpha = 0.3;
    else snowflakeIcon.alpha = 1;
}

function soundControl(){
    if(christmasMusic.isPlaying) {
        christmasMusic.pause();
        musicIcon.alpha =1;}
    else {christmasMusic.play();
        musicIcon.alpha = 0.3;}
    console.log("Icon is working sound")
}

function giftControl(){
    buttonImage.visible = ! buttonImage.visible;
    if(buttonImage.visible) 
    {
        giftBox.alpha =0.7;
        surpriseText.visible = true;
    }
    else 
    {
        giftBox.alpha = 1; 
        surpriseText.visible = false;
    }
}


function ribbonControl(){
    if(tweenRibbonClear.paused){
        tweenRibbonClear.resume();
        ribbonIcon.alpha = 1;
    }
    else {
        tweenRibbonClear.pause();
        ribbonIcon.alpha = 0.3;
    }
}