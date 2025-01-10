import { saveScore } from '/games/main.js';

let tiles;
let gameSpeed = 2;
let baseGameSpeed = 2;
let speedIncrement = 0.1;
let lastSpeedIncrease = 0;
let tileSize = 100;
let columns = 3;
let targetLine;
const PHONE_RATIO = 2;
const TOTAL_TILES = 200;
let tilesCreated = 0;
let gameEnded = false;
let keepImages = [];
let deleteImages = [];
let score = 0;
let keepTilesCount = 0;

// Fonction pour mettre à jour le score dans le HTML
function updateScoreDisplay() {
    const scoreElement = document.querySelector('.score-value');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

window.preload = function () {
    keepImages = [
        loadImage('https://picsum.photos/' + tileSize + '?random=1'),
        loadImage('https://picsum.photos/' + tileSize + '?random=2'),
        loadImage('https://picsum.photos/' + tileSize + '?random=3'),
        loadImage('https://picsum.photos/' + tileSize + '?random=4'),
        loadImage('https://picsum.photos/' + tileSize + '?random=5'),
        loadImage('https://picsum.photos/' + tileSize + '?random=6'),
        loadImage('https://picsum.photos/' + tileSize + '?random=7'),
        loadImage('https://picsum.photos/' + tileSize + '?random=8'),
        loadImage('https://picsum.photos/' + tileSize + '?random=9'),
        loadImage('https://picsum.photos/' + tileSize + '?random=10'),
        loadImage('https://picsum.photos/' + tileSize + '?random=11'),
        loadImage('https://picsum.photos/' + tileSize + '?random=12'),
        loadImage('https://picsum.photos/' + tileSize + '?random=13'),
        loadImage('https://picsum.photos/' + tileSize + '?random=14'),
        loadImage('https://picsum.photos/' + tileSize + '?random=15'),
        loadImage('https://picsum.photos/' + tileSize + '?random=16'),
        loadImage('https://picsum.photos/' + tileSize + '?random=17'),
        loadImage('https://picsum.photos/' + tileSize + '?random=18'),
        loadImage('https://picsum.photos/' + tileSize + '?random=19'),
    ];

    deleteImages = [
        loadImage('https://picsum.photos/' + tileSize + '?blur=10&random=6'),
        loadImage('https://picsum.photos/' + tileSize + '?blur=10&random=7'),
        loadImage('https://picsum.photos/' + tileSize + '?blur=10&random=8'),
        loadImage('https://picsum.photos/' + tileSize + '?blur=10&random=9'),
        loadImage('https://picsum.photos/' + tileSize + '?blur=10&random=10')
    ];
}

window.setup = function () {
    const canvas = createCanvas(columns * tileSize, columns * tileSize * PHONE_RATIO);
    const container = document.getElementById('game-container');
    if (container) {
        canvas.parent(container);
    }
    noStroke();

    tiles = new Group();
    tiles.collider = 'none';

    targetLine = {
        y: height - 50,
        height: 5
    };

    for (let i = 0; i < Math.min(5, TOTAL_TILES / columns); i++) {
        createTileRow(-i * tileSize);
        tilesCreated += columns;
    }

    updateScoreDisplay();
}

function getRandomImage(type) {
    const images = type === 'keep' ? keepImages : deleteImages;
    return images[Math.floor(Math.random() * images.length)];
}

function createTileRow(yPos) {
    let types = [];
    for (let i = 0; i < columns; i++) {
        types.push(Math.random() < 0.7 ? 'keep' : 'delete');
    }
    types.sort(() => Math.random() - 0.5);

    for (let i = 0; i < columns; i++) {
        let tile = new Sprite();
        tile.width = tileSize;
        tile.height = tileSize;
        tile.x = i * tileSize + tileSize / 2;
        tile.y = yPos;
        tile.collider = 'none';

        const type = types[i];
        const imageInfo = getRandomImage(type);
        tile.type = type;
        tile.column = i;
        tile.img = imageInfo;
        tiles.add(tile);

        if (type === 'keep') {
            keepTilesCount++;
        }
    }
}

function checkKeyPress() {
    if (gameEnded) return;

    let targetColumn = -1;
    if (keyIsDown(LEFT_ARROW)) {
        targetColumn = 0;
    } else if (keyIsDown(RIGHT_ARROW)) {
        targetColumn = columns - 1;
    } else if (keyIsDown(DOWN_ARROW)) {
        targetColumn = 1;
    }

    if (targetColumn !== -1) {
        let closestTile = null;
        let minDistance = Infinity;

        for (let tile of tiles) {
            if (tile.column === targetColumn) {
                let distance = Math.abs(tile.y - targetLine.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestTile = tile;
                }
            }
        }

        if (closestTile && minDistance < tileSize / 2) {
            if (closestTile.type === 'delete') {
                score += 100;
                updateScoreDisplay();
            } else {
                score = Math.max(0, score - 50);
                updateScoreDisplay();
                gameSpeed = baseGameSpeed;
                lastSpeedIncrease = millis();
            }
            closestTile.remove();
        }
    }
}

window.draw = function () {
    background('#FFE5AE');

    if (millis() - lastSpeedIncrease >= 1000) {
        gameSpeed += speedIncrement;
        lastSpeedIncrease = millis();
    }

    push();
    textSize(32);
    textAlign(LEFT, TOP);
    fill(0);
    pop();

    fill('red');
    rect(0, targetLine.y, width, targetLine.height);

    for (let tile of tiles) {
        tile.y += gameSpeed;

        imageMode(CENTER);
        image(tile.img, tile.x, tile.y, tile.width, tile.height);

        if (tile.y > height + tileSize) {
            if (tile.type === 'delete') {
                score = Math.max(0, score - 50);
                updateScoreDisplay();
                gameSpeed = baseGameSpeed;
                lastSpeedIncrease = millis();
            }
            tile.remove();
        }
    }

    if (!gameEnded && tilesCreated < TOTAL_TILES) {
        let shouldCreateNewRow = true;
        for (let tile of tiles) {
            if (tile.y < 0) {
                shouldCreateNewRow = false;
                break;
            }
        }
        if (shouldCreateNewRow) {
            createTileRow(-tileSize);
            tilesCreated += columns;
        }
    }

    if (!gameEnded && tilesCreated >= TOTAL_TILES && tiles.length === 0) {
        gameEnded = true;
        saveScore(score);
    }

    checkKeyPress();

    if (gameEnded) {
        drawGameEnd();
    }
}

function drawGameEnd() {
    push();
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(0);
    text('Well done!', width / 2, height / 2);
    pop();

    // Créer le lien vers la page d'accueil s'il n'existe pas déjà
    if (!document.getElementById('home-link')) {
        const homeLink = document.createElement('a');
        homeLink.id = 'home-link';
        homeLink.href = '../../index.html';
        homeLink.innerHTML = 'Return Home';
        homeLink.style.cssText = `
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px 40px;
            background-color: #D8A32D;
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
        `;
        document.body.appendChild(homeLink);
    }
}
