let config = {
    type: Phaser.AUTO,
    width: 800,
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
    }
};

const game = new Phaser.Game(config);
let shipSpeed , enemySpeed, missileSpeed;
let spacebar;
let missiles, bullets;
let groundenemy
let speedBulletMultiplier = 100;
let numberOfBullets;

let gameState;


function init() {
    shipSpeed = 100;
    enemySpeed = 150;
    missileSpeed = 100;
    numberOfBullets = 5;
    gameState = "startScreen";

}



/////////////       PRELOAD      ////////////////

function preload() { 
    this.load.image('space', './assets/images/space.png');
    this.load.image('start','./assets/images/start.png');
    this.load.image('gameOver','./assets/images/gameOver.png');
    this.load.image('restart','./assets/images/restart.png');
    this.load.image('rTypeLogo','./assets/images/rTypeLogo.png');
    this.load.image('boss','./assets/images/boss.gif');



    this.load.image('player', './assets/images/ship.png');
    this.load.image('enemy', './assets/images/ennemy.png');
    this.load.image('simplebullets','./assets/images/star2.png');
    this.load.image('groundenemy','./assets/images/groundennemy.png');


    this.load.spritesheet('exAnim', './assets/animations/explosion.png',{
         frameWidth: 128, frameHeight: 128 });

    this.load.audio('explosionSound', './assets/audio/explosion.wav');
     

    this.load.image('tiles', './assets/images/tiles.png');
    this.load.tilemapTiledJSON('backgroundMap','./assets/tiled/lvl1.json'); //ref au lvl2
}


/////////////       CREATE      ////////////////

function create() {
    

    // let spacebgImage = this.add.image(0,0, 'backImage');

    const map = this.make.tilemap({ key: 'backgroundMap' });
    let sciti = map.addTilesetImage('Sci-Fi', 'tiles', 16, 16, 0, 0);
    let layer = map.createStaticLayer(0, sciti, 0, 0);
    layer.setCollisionBetween(1, 55000);//ds le layer tout les tiles a l'indice 1 a 55000 entre en colision


    //player
    playerShip = this.physics.add.image(200,200,'player');
    enemy = this.physics.add.image(900,100,'enemy');


    
    let tweenenemy = this.tweens.add({
        targets: enemy,
        angle: 360,
        duration: 2000,
        ease: 'linear',
        loop: -1,//loop a linfini
        });
        
    groundenemy = this.add.image(450,280,'groundenemy');
    
    bossImage = this.physics.add.image(3200-131,160, 'boss');
    bossImage.setImmovable(true);

    bullets = this.physics.add.group({
        defaultKey: 'simplebullets', //little star shining bright like you
        maxSize: numberOfBullets
    });
    
    //missiles player
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    missiles = this.physics.add.group({
        defaultKey: 'simplebullets', //little star shining bright like you
        maxSize: 50
    });
    this.physics.add.collider(playerShip, bullets, collisionPlayerShipBullet, null, this);
    this.physics.add.collider(enemy, missiles, collisionEnemyMissile, null, this);
    this.physics.add.collider(playerShip, layer, collisionPlayerShipLayer, null, this);
    


    let explosionAnimation = this.anims.create({
    key: 'explode',
    frames: this.anims.generateFrameNumbers('exAnim'),
    frameRate: 20,
    repeat: 0,
    hideOnComplete: true
    });

    //SOUND//

    explosionSound = this.sound.add('explosionSound');
    

    let spaceImage = this.add.image(0,0,'space');
    spaceImage.setOrigin (0,0);
    let rTypeLogoImage = this.add.image(400,60,'rTypeLogo');
    let startImage = this.add.image(400,200,'start').setInteractive();
    startImage.setScale(0.7);
    startImage.on('pointerdown', ()=>{
        spaceImage.setVisible(false);
        rTypeLogoImage.setVisible(false);
        startImage.setVisible(false);
        gameState = "scrollGame";
        playerShip.setVelocity(100,0);
        enemy.setVelocity(-enemySpeed,0);

        //timer missiles ground enemy
        let timerBulletGroundEnemy = this.time.addEvent({
            delay: 600,
            callback: groundEnemyShootBullet,
            callbackScope: this,
            repeat: numberOfBullets-1
            });
    })
}


/////////////       UPDATE      ////////////////

function update() {

    //****************************************************************
    ///// STARTSCREEN ************************************************
    //****************************************************************
    if(gameState === "startScreen"){
    ///////AJOUTER UNE MUSIQUE ICI 

    }

    //****************************************************************
    ///// SCROLLGAME *************************************************
    //****************************************************************
    if(gameState === "scrollGame"){
        this.cameras.main.scrollX +=1;


        //direct the PlayerShip
        let cursors = this.input.keyboard.createCursorKeys();
        if (cursors.right.isDown) playerShip.setVelocity(shipSpeed,0);
        if (cursors.left.isDown) playerShip.setVelocity(-shipSpeed,0);
        if (cursors.up.isDown) playerShip.setVelocityY(-shipSpeed);
        if (cursors.down.isDown) playerShip.setVelocityY(shipSpeed);

    if (Phaser.Input.Keyboard.JustDown(spacebar)) {
        //lancer un missile
        let missile = missiles.get();
        if (missile) {
            missile.setPosition(playerShip.x + 17, playerShip.y + 6);
            missile.setVelocity(shipSpeed + missileSpeed, 0);
        }
    }

    //repositioner l'enemie si y sort de l'ecran a gauche

    // Respawn enemy randomly
    if (enemy.x < this.cameras.main.scrollX) enemy.setPosition(this.cameras.main.scrollX + config.width+50, Phaser.Math.Between(120,200));

    if (playerShip.x > this.cameras.main.scrollX+config.width) playerShip.x= this.cameras.main.scrollX+config.width;
    if (playerShip.x < this.cameras.main.scrollX)playerShip.x= this.cameras.main.scrollX;




    // enemy restart when we hit the enemy
    if (Phaser.Geom.Intersects.RectangleToRectangle(
        enemy.getBounds(),
        playerShip.getBounds()
    )) {
        let explosionAnimation = this.add.sprite(playerShip.x, playerShip.y,'exAnim');
        explosionAnimation.play('explode');
        playerShip.setPosition(-1000,-1000);
        enemy.destroy();
        explosionSound.play();
        
        }
    if (this.cameras.main.scrollX >= 2400) gameState = "bossGame";
    }



    //****************************************************************
    ///// BOSSGAME ***************************************************
    //****************************************************************
    if(gameState === "bossGame"){

        //direct the PlayerShip
        let cursors = this.input.keyboard.createCursorKeys();
        if (cursors.right.isDown) playerShip.setVelocity(shipSpeed,0);
        if (cursors.left.isDown) playerShip.setVelocity(-shipSpeed,0);
        if (cursors.up.isDown) playerShip.setVelocityY(-shipSpeed);
        if (cursors.down.isDown) playerShip.setVelocityY(shipSpeed);

        if (Phaser.Input.Keyboard.JustDown(spacebar)) {
            //lancer un missile
            let missile = missiles.get();
            if (missile) {
                missile.setPosition(playerShip.x + 17, playerShip.y + 6);
                missile.setVelocity(shipSpeed + missileSpeed, 0);
            }
        }

    //maintenir le joueur dans la camera
        if (playerShip.x < this.cameras.main.scrollX)playerShip.x= this.cameras.main.scrollX;


        // Game restart when we hit the enemy
        if (Phaser.Geom.Intersects.RectangleToRectangle(
            enemy.getBounds(),
            playerShip.getBounds()
        )) {
                let explosionAnimation = this.add.sprite(playerShip.x, playerShip.y,'exAnim');
                explosionAnimation.play('explode');
                playerShip.setPosition(-1000,-1000);
                enemy.destroy();
                explosionSound.play();
                
            }

    }

    //********************************************************************
    ///// WINGAME ********************************************************
    //********************************************************************
    if(gameState === "winGame"){

    }

        //********************************************************************
    ///// GAMEOVER ********************************************************
    //********************************************************************
    if(gameState === "gameOver"){

    }


   
}












function collisionEnemyMissile(_enemy, _missile)//enemy qui rentre en collision avec missile
    {
    let explosionAnimation = this.add.sprite(_enemy.x, _enemy.y,'exAnim');
    explosionAnimation.play('explode');
    if (gameState = "scrollGame"){
        _enemy.setPosition(this.cameras.main.scrollX + config.width+50, Phaser.Math.Between(120,200));
        _enemy.setVelocity(-enemySpeed,0);
    }
    else{
        _enemy.setPosition(-1000, -1000);
    }
    _missile.destroy();
    explosionSound.play();
    }

function collisionPlayerShipBullet(_playerShip, _bullet)
    {
    _bullet.destroy();
    //explosion
    let explosionAnim = this.add.sprite(_playerShip.x, _playerShip.y,'exAnim');
    explosionAnim.play('explode');
    explosionSound.play();
    _playerShip.setPosition(-1000,-1000);
    }
  

function groundEnemyShootBullet(){
    let bullet = bullets.get();
    if (bullet) {
        bullet.setPosition(groundenemy.x, groundenemy.y-6);
        let shootX = playerShip.x-groundenemy.x;
        let shootY = playerShip.y-groundenemy.y;
        vectorLength = Math.sqrt(shootY*shootY + shootX*shootX);
        bullet.setVelocity(speedBulletMultiplier * shootX/vectorLength, speedBulletMultiplier * shootY/vectorLength);

    }
}

function collisionPlayerShipLayer(_playerShip, _layer){
    let explosionAnim = this.add.sprite(_playerShip.x, _playerShip.y,'exAnim');
    explosionAnim.play('explode');
    explosionSound.play();
    _playerShip.setPosition(-1000,-1000);

}

function collisionBossMissile(_boss, _missile){
    _missile.destroy();

}