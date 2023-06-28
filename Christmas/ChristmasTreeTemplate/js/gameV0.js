let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

function preload() {
    
}

function create() {
    
}

function update() {
    
}