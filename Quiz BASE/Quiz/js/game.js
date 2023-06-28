let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

let game = new Phaser.Game(config);
let currentIndex = 0;
let answerPanelImage = [];
let questionPanelText = [];
let answerPanelText = [];
let StarImage = [];
let score = 0;
let Isengard;
let Gandalf;

let questionStatus = [];

////////   PRELOAD   ////////
function preload() {
    this.load.image('background', './assets/Sprites/sauron.png');
    this.load.image('questionPanel', './assets/Sprites/Label1.png');
    this.load.image('answerPanel', './assets/Sprites/Label4.png');
    this.load.image('Star', './assets/Sprites/Star2.png');
    this.load.image('Play', './assets/Sprites/Play.png');
    this.load.json('questions', './assets/data/Questions.json');

    this.load.audio('Isengard', './assets/Sound/Isengard.wav');
    this.load.audio('correctanswer', './assets/Sound/good.wav');
    this.load.audio('wronganswer', './assets/Sound/wrong.wav');
    this.load.audio('Gandalf', './assets/Sound/Gandalf.wav');

    this.load.json('questions', './assets/data/Questions.json');
}

//////     CREATE      //////
function create() {
    Isengard = this.sound.add('Isengard');
    Isengard.play();

    Gandalf = this.sound.add('Gandalf');

    questionJSON = this.cache.json.get('questions');

    let backImage = this.add.image(-40, 0, 'background');
    backImage.setOrigin(0, 0);
    backImage.setScale(1.7);

    questionPanelImage = this.add.image(300, 100, 'questionPanel');
    questionPanelImage.setScale(0.5);
    questionPanelText1 = this.add.text(185, 75, questionJSON.questions[currentIndex].title,
        { fontFamily: 'Albertus MT', fontSize: 20, color: '#00ff00' });

    for (let i = 0; i < 3; i++) {
        answerPanelImage[i] = this.add.image(300, 230 + 100 * i, 'answerPanel').setInteractive();
        answerPanelImage[i].on('pointerdown', () => { checkAnswer(i); });
    }

    for (let i = 0; i < 3; i++) {
        questionPanelText[i] = this.add.text(210, 210 + 100 * i, questionJSON.questions[currentIndex].answer[i],
            { fontFamily: 'Albertus MT', fontSize: 36, color: '#355568' });

        questionPanelText[i].setInteractive({ hitArea: new Phaser.Geom.Rectangle(0, 0, questionPanelText[i].width, questionPanelText[i].height) });
        questionPanelText[i].on('pointerdown', () => { checkAnswer(i); });
    }

    for (let i = 0; i < 10; i++) {
        StarImage[i] = this.add.image(30 + i * 60, 600, 'Star');
        StarImage[i].setScale(0.03);
        StarImage[i].alpha = 0;
    }

    PlayButton = this.add.image(300, 520, 'Play').setInteractive();
    PlayButton.setScale(0.3);
    PlayButton.setVisible(false);
    PlayButton.on('pointerdown', nextQuestion);

    scoreText = this.add.text(260, 20, 'Score: 0', {
        fontFamily: 'Arial',
        fontSize: 18,
        color: '#ff461c',
        fontStyle: 'bold'
    });

    correctanswer = this.sound.add('correctanswer');
    wronganswer = this.sound.add('wronganswer');
}

//////    UPDATE     /////
function update() {}

function checkAnswer(answerNumber) {
    for (let i = 0; i < 3; i++) {
        questionPanelText[i].setColor("#FF0000");
    }
    questionPanelText[questionJSON.questions[currentIndex].goodAnswer].setColor("#00FF00");

    if (questionStatus[currentIndex]) {
        // Check if the question has already been answered correctly
        return; // Exit the function if it has
    }

    if (!questionStatus[currentIndex]) {
        // Check if the question has not been answered correctly before
        if (questionJSON.questions[currentIndex].goodAnswer === answerNumber) {
            StarImage[currentIndex].alpha = 1;
            score++;
            scoreText.setText("Score: " + score);
            correctanswer.play();
        } else {
            StarImage[currentIndex].alpha = 0.5;
            wronganswer.play();
        }
        questionStatus[currentIndex] = true;
        PlayButton.setVisible(true);

        for (let i = 0; i < 3; i++) {
            answerPanelImage[i].disableInteractive();
        }
        if (currentIndex === 9) {
            score++;
            scoreText.setText("Score: " + score); // Check if it's the 10th question
            setTimeout(endGame, 1); // Delay 2 seconds and then stop the music
        }
    }
    if (currentIndex === 9 && score <= 9) {
        Gandalf.play();
    } else {
        Gandalf.stop();
    }
}

function endGame() {
    Isengard.stop(); // Stop the Isengard music
    // if (currentIndex === 9 && score === 10) {
    //     Gandalf.stop(); // Stop the Gandalf sound if score is 10
    // }
}

function nextQuestion() {
    currentIndex++;
    questionPanelText1.setText(questionJSON.questions[currentIndex].title);

    for (let i = 0; i < 3; i++) {
        questionPanelText[i].text = questionJSON.questions[currentIndex].answer[i];
        questionPanelText[i].setColor('#0088ff');
        questionPanelText[i].setInteractive();
        answerPanelImage[i].setInteractive();
    }

    PlayButton.setVisible(false);
}
