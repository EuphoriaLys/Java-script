let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    audio: {         
        disableWebAudio: true     
    },
    autoCenter: true
};

// Déclaration de nos variables globales
let game = new Phaser.Game(config);
let tileSize;
let MumfrogImage, BabyfrogImage;
let down, up, left, right;
let heartImage;
let carImages = [];
let carNumberInARow;
let carSpeed;
let countDown;
let score = 0;
//
function init() {
    tileSize = 16;
    carNumberInARow = 8;//you can change that number to higher the difficulty
    carSpeed = 60; //changer la vitesse des voitures
    countDown = 60;
}

function preload() {
    this.load.image('background', './assets/images/FroggerBackground.png');
    this.load.image('Mumfrog', './assets/images/MumFrog.png');
    this.load.image('Babyfrog','./assets/images/Frog.png');
    this.load.image('heart','./assets/images/heart.png');
    this.load.image('deadFrog','./assets/images/deadFrog.png');
    this.load.image('car1','./assets/images/car.png');
    this.load.image('car2','./assets/images/snowCar.png');
    this.load.image('car3','./assets/images/F1-1.png');
    this.load.image('TitleScreen','./assets/images/TitleScreen.png');

}

function create() {

    TitleScreenImage = this.add.image(0, 0, 'TitleScreen');
    TitleScreenImage.setOrigin(0,0);

    backImage = this.add.image(0, 0, 'background');
    backImage.setOrigin(0, 0);

    MumfrogImage = this.add.image(Phaser.Math.Between(0, 29)*tileSize,0, 'Mumfrog');
    MumfrogImage.setOrigin(0, 0);
    
    BabyfrogImage = this.add.image(Phaser.Math.Between(0, 29)*tileSize+tileSize/2, 
    config.height-tileSize/2, 'Babyfrog');

    //HEART
    heartImage = this.add.image(240,160, 'heart');
    heartImage.alpha = 0 ;
    
    //CAR going left to right
    let gap = config.width/ carNumberInARow;
    const maxRandomOffset = (gap - tileSize)/2;
    //(gap - tileSize)/2 = 
    for (let j=0; j<3; j++){
        for (let i=0; i<carNumberInARow; i++){
            carImages[i+j*carNumberInARow] = this.physics.add.image(i*gap+Phaser.Math.Between(-maxRandomOffset,maxRandomOffset),64+ j*tileSize*2,'car'+Phaser.Math.Between(1,3));
            carImages[i+j*carNumberInARow].setOrigin(0,0);
            carImages[i+j*carNumberInARow].setVelocity(carSpeed,0);
        }
    }
    //CAR going right to left
    for (let j=3; j<6; j++){
        for (let i=0; i<carNumberInARow; i++){
            carImages[i+j*carNumberInARow] = this.physics.add.image(i*gap+Phaser.Math.Between(-maxRandomOffset,maxRandomOffset),96+ j*tileSize*2,'car'+Phaser.Math.Between(1,3));
            carImages[i+j*carNumberInARow].setOrigin(0,0);
            carImages[i+j*carNumberInARow].angle = 180;
            carImages[i+j*carNumberInARow].setVelocity(-carSpeed,0);
        }
    }
    
    // TIME COUNTER 
    let countDownText = this.add.text(220,300, countDown,{fontFamily: 'Arial', fontSize:18, color:'#00ff00'});
    let countDownTimer = this.time.addEvent({
        delay:1000,
        callback: ()=>{
            countDown--;
            countDownText.text = countDown;
        },
        repeat: countDown-1
    })

    // DEAD FROG
    deadFromImage = this.add.image(1000,1000,"deadFrog");

    //TOUCHES 
    down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    
    scoreText = this.add.text(405, 16, 'Score: 0', {
        fontFamily: 'Arial',
        fontSize: 18,
        color: '#00ff00',
        fontStyle: 'bold'
    });

}

function update() {
    if (Phaser.Input.Keyboard.JustDown(up)&&(BabyfrogImage.y > tileSize/2)) {
        BabyfrogImage.angle = 0;
        BabyfrogImage.y -= tileSize};

    if (Phaser.Input.Keyboard.JustDown(down)&&(BabyfrogImage.y< config.height-tileSize/2 )){
        BabyfrogImage.angle = 180;
        BabyfrogImage.y += tileSize};

    if (Phaser.Input.Keyboard.JustDown(left)&&(BabyfrogImage.x > tileSize/2 )) { 
        BabyfrogImage.angle = -90;
        BabyfrogImage.x -= tileSize};
    if (Phaser.Input.Keyboard.JustDown(right)&&(BabyfrogImage.x< config.width-tileSize/2 )){ 
        BabyfrogImage.angle = 90;
        BabyfrogImage.x += tileSize};






    for (let i=0; i<carImages.length; i++){
        if((carImages[i].x>480)&&(carImages[i].y<160)) carImages[i].x=- tileSize;
        if((carImages[i].x<0)&&(carImages[i].y>160)) carImages[i].x=config.width+tileSize;//le tilesize fais en sorte que les car spawn avant de passer devant l'ecran
        if(Phaser.Geom.Intersects.RectangleToRectangle(
            BabyfrogImage.getBounds(), carImages[i].getBounds())){
                deadFromImage.setPosition(BabyfrogImage.x, BabyfrogImage.y);
                BabyfrogImage.x = 1000;
                let timer = this.time.addEvent({
                    delay: 2500, // ms
                    callback: ()=>{
                       BabyfrogImage.setPosition(Phaser.Math.Between(0, 29) * tileSize + tileSize / 2, config.height - tileSize / 2);
                       BabyfrogImage.angle = 0;
                       deadFromImage.setPosition(1000,1000);
                    }
                });
        }
    }
    if (Phaser.Geom.Intersects.RectangleToRectangle(
        BabyfrogImage.getBounds(), MumfrogImage.getBounds())) {
        heartImage.alpha = 1;
        let tweenHeart = this.tweens.add({
            targets: heartImage,
            scaleX: 3.5,
            scaleY: 3.5,
            duration: 3000,
            ease: 'Linear',
            yoyo : false,
            loop: 0,
            onComplete: ()=>{
                BabyfrogImage.setPosition(Phaser.Math.Between(0, 29) * tileSize + tileSize / 2, config.height - tileSize / 2);
                BabyfrogImage.angle = 0;
                heartImage.setScale (0.1);
                heartImage.alpha= 0.1;
                score++;
                scoreText.setText('Score: ' + score);
            }
            });
                // tweenHeart.on('Complete',()=>{this.scene.restart();});
        BabyfrogImage.x = 1000
    }  
}