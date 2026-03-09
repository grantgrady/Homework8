let gameState = "start"; // "start", "playing", "gameover"
let score = 0;
let health = 5;
const MAX_HEALTH = 5;
let startTime;
let timeLeft = 60;

let characterX = 400;
let characterY = 300;
let characterSpeed = 4;

let movingUp = false;
let movingDown = false;
let movingLeft = false;
let movingRight = false;
let isMoving = false;

let idleFrames = [];
let walkFrames = [];
let currentAnimation = [];
let currentFrame = 0;
let frameCounter = 0;
const ANIMATION_SPEED = 8;

let foods = [];
const NUM_FOODS = 6; // Mix of good and bad

let backgroundMusic;
let goodFoodSound;
let badFoodSound;
let gameOverSound;
let soundsLoaded = false;
let musicStarted = false;

function preload() {
    console.log("Loading sounds...");
    
    try {
        backgroundMusic = loadSound('../sounds/background-music.mp3', 
            () => console.log("Background music loaded"),
            () => console.log("Failed to load background music - using fallback")
        );
        
        goodFoodSound = loadSound('../sounds/good-food.wav',
            () => console.log("Good food sound loaded"),
            () => console.log("Failed to load good food sound")
        );
        
        badFoodSound = loadSound('../sounds/bad-food.wav',
            () => console.log("Bad food sound loaded"),
            () => console.log("Failed to load bad food sound")
        );
        
        gameOverSound = loadSound('../sounds/game-over.wav',
            () => console.log("Game over sound loaded"),
            () => console.log("Failed to load game over sound")
        );
        
        soundsLoaded = true;
    } catch (e) {
        console.log("Error loading sounds:", e);
    }
}

function setup() {
    createCanvas(800, 600);
    
    setupAnimationFrames();
    
    initializeFood();
    
    startTime = millis();
    
    textSize(16);
    textAlign(CENTER);
    
    if (backgroundMusic) {
        backgroundMusic.setVolume(0.04);
        backgroundMusic.loop();
    }
    
    if (goodFoodSound) {
        goodFoodSound.setVolume(0.5);
    }
    
    if (badFoodSound) {
        badFoodSound.setVolume(0.5);
    }
    
    if (gameOverSound) {
        gameOverSound.setVolume(0.7);
    }
}

function setupAnimationFrames() {
    idleFrames = [
        { offset: 0 },
        { offset: 2 },
        { offset: 0 },
        { offset: -2 }
    ];
    
    walkFrames = [
        { offset: 0, legOffset: 3 },
        { offset: 2, legOffset: 0 },
        { offset: 0, legOffset: -3 },
        { offset: -2, legOffset: 0 }
    ];
    
    currentAnimation = idleFrames;
}

function initializeFood() {
    for (let i = 0; i < NUM_FOODS; i++) {
        let x = random(100, 700);
        let y = random(100, 500);
        let size = random(30, 45);
        
        let type = random(1) < 0.7 ? "good" : "bad"; // 70% good, 30% bad
        let color1, color2;
        
        if (type === "good") {
            color1 = color(random(200, 255), random(100, 200), random(100, 200));
            color2 = color(random(150, 255), random(150, 255), random(150, 255));
        } else {
            color1 = color(random(100, 150), random(50, 100), random(100, 150));
            color2 = color(random(50, 100), random(0, 50), random(50, 100));
        }
        
        let shape = floor(random(2));
        
        let food = new Food(x, y, size, color1, color2, shape, type);
        foods.push(food);
    }
}

function draw() {
    if (gameState === "playing") {
        updateTimer();
    }
    
    drawBackground();
    
    if (gameState === "start") {
        drawStartScreen();
    } else if (gameState === "playing") {
        handleMovement();
        
        updateAnimation();
        
        updateFoodPositions();
        
        checkFoodCollection();
        
        if (health <= 0) {
            gameState = "gameover";
            if (gameOverSound && gameOverSound.isLoaded()) {
                gameOverSound.play();
            }
        }
    } else if (gameState === "gameover") {
        drawGameOverScreen();
    }
    
    drawCharacter();
    
    for (let i = 0; i < foods.length; i++) {
        foods[i].display();
    }
    
    drawUI();
    
    drawTextElements();
}

function drawBackground() {
    // Sky gradient based on health
    let healthPercent = health / MAX_HEALTH;
    let skyColor = lerpColor(color(100, 100, 150), color(135, 206, 235), healthPercent);
    
    background(skyColor);
    
    // Ground
    fill(100, 200, 100);
    noStroke();
    rect(0, height - 80, width, 80);
    
    // Simple grass details
    stroke(50, 150, 50);
    strokeWeight(1);
    for (let x = 0; x < width; x += 20) {
        line(x, height - 80, x + random(-5, 5), height - 95);
    }
}

function drawStartScreen() {
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);
    
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("🎮 FOOD COLLECTION GAME 🎮", width/2, height/2 - 100);
    
    textSize(20);
    text("WASD to move • Collect food", width/2, height/2 - 40);
    text("🍎 GOOD food = +1 score", width/2, height/2);
    text("💀 BAD food = -1 health", width/2, height/2 + 30);
    text("Start with 5 health • Survive 60 seconds", width/2, height/2 + 60);
    
    textSize(24);
    fill(255, 255, 0);
    text("CLICK ANYWHERE TO START", width/2, height/2 + 120);
}

function drawGameOverScreen() {
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);
    
    fill(255, 0, 0);
    textSize(48);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2 - 60);
    
    fill(255);
    textSize(24);
    text("Final Score: " + score, width/2, height/2);
    text("Time Survived: " + (60 - timeLeft).toFixed(1) + " seconds", width/2, height/2 + 40);
    
    textSize(20);
    fill(255, 255, 0);
    text("Click to play again", width/2, height/2 + 100);
}

function updateTimer() {
    if (gameState !== "playing") return;
    
    let elapsed = (millis() - startTime) / 1000;
    timeLeft = max(0, 60 - elapsed);
    
    if (timeLeft <= 0 && health > 0) {
        gameState = "gameover";
        if (gameOverSound && gameOverSound.isLoaded()) {
            gameOverSound.play();
        }
    }
}

function handleMovement() {
    isMoving = movingUp || movingDown || movingLeft || movingRight;
    
    currentAnimation = isMoving ? walkFrames : idleFrames;
    
    if (movingUp) characterY -= characterSpeed;
    if (movingDown) characterY += characterSpeed;
    if (movingLeft) characterX -= characterSpeed;
    if (movingRight) characterX += characterSpeed;
    
    characterX = constrain(characterX, 40, width - 40);
    characterY = constrain(characterY, 40, height - 100);
}

function updateAnimation() {
    frameCounter++;
    
    if (frameCounter >= ANIMATION_SPEED) {
        frameCounter = 0;
        currentFrame++;
        
        if (currentFrame >= currentAnimation.length) {
            currentFrame = 0;
        }
    }
}

function updateFoodPositions() {
    for (let i = 0; i < foods.length; i++) {
        if (foods[i].collected) continue;
        foods[i].update();
    }
}

function checkFoodCollection() {
    for (let i = 0; i < foods.length; i++) {
        if (foods[i].collected) continue;
        
        if (foods[i].checkCollection(characterX, characterY, 50)) {
            foods[i].collect();
            
            if (foods[i].type === "good") {
                score++;
                if (goodFoodSound && goodFoodSound.isLoaded() && musicStarted) {
                    goodFoodSound.play();
                }
            } else {
                health = max(0, health - 1);
                if (badFoodSound && badFoodSound.isLoaded() && musicStarted) {
                    badFoodSound.play();
                }
            }
            
            setTimeout((food) => {
                food.respawn();
            }, 500, foods[i]);
        }
    }
}

function drawCharacter() {
    push();
    translate(characterX, characterY);
    
    let frame = currentAnimation[currentFrame];
    let yOffset = frame.offset || 0;
    
    // Body color based on health
    let healthPercent = health / MAX_HEALTH;
    let bodyColor = lerpColor(color(150, 100, 100), color(100, 150, 200), healthPercent);
    
    // Body
    fill(bodyColor);
    noStroke();
    rectMode(CENTER);
    rect(0, 0 + yOffset, 30, 40, 5);
    
    // Head
    fill(255, 220, 180);
    ellipse(0, -25 + yOffset, 25, 25);
    
    // Hat
    fill(150, 100, 50);
    rect(-12, -40 + yOffset, 24, 5);
    rect(-6, -45 + yOffset, 12, 8);
    
    // Eyes (change based on health)
    fill(0);
    if (health <= 2) {
        // Worried eyes when low health
        ellipse(-6, -32 + yOffset, 3, 5);
        ellipse(6, -32 + yOffset, 3, 5);
    } else {
        // Normal eyes
        ellipse(-6, -30 + yOffset, 3, 4);
        ellipse(6, -30 + yOffset, 3, 4);
    }
    
    // Smile (changes based on health)
    stroke(0);
    strokeWeight(1);
    noFill();
    
    if (health <= 2) {
        // Frown when low health
        arc(0, -20 + yOffset, 10, 5, PI, TWO_PI);
    } else {
        // Smile when healthy
        arc(0, -23 + yOffset, 10, 5, 0, PI);
    }
    
    // Legs
    stroke(50, 50, 150);
    strokeWeight(5);
    
    let legOffset = frame.legOffset || 0;
    
    // Left leg
    line(-8, 20 + yOffset, -15, 35 + yOffset + legOffset);
    
    // Right leg
    line(8, 20 + yOffset, 15, 35 + yOffset - legOffset);
    
    pop();
}

function drawUI() {
    // Score display
    fill(255);
    textSize(28);
    textAlign(LEFT);
    text("Score: " + score, 20, 50);
    
    // Health display with hearts
    textAlign(LEFT);
    textSize(20);
    text("Health: ", 20, 90);
    
    for (let i = 0; i < MAX_HEALTH; i++) {
        if (i < health) {
            fill(255, 0, 0); // Red heart
            text("❤️", 100 + i * 30, 90);
        } else {
            fill(100); // Gray heart
            text("🖤", 100 + i * 30, 90);
        }
    }
    
    // Timer display
    textAlign(CENTER);
    let timerColor = timeLeft < 10 ? color(255, 0, 0) : color(255);
    fill(timerColor);
    textSize(32);
    text("Time: " + timeLeft.toFixed(1) + "s", width/2, 50);
    
    // Food counts
    let goodCount = foods.filter(f => f.type === "good" && !f.collected).length;
    let badCount = foods.filter(f => f.type === "bad" && !f.collected).length;
    
    textAlign(RIGHT);
    textSize(16);
    fill(100, 255, 100);
    text("🍎 Good: " + goodCount, width - 20, 70);
    fill(255, 100, 100);
    text("💀 Bad: " + badCount, width - 20, 95);
}

function drawTextElements() {
    fill(255);
    textSize(20);
    textAlign(LEFT);
    text("Sound & Game States", 20, 130);
    
    textSize(12);
    text("Anim: " + (isMoving ? "Walk" : "Idle") + 
         " • Frame: " + (currentFrame + 1), 20, 150);
    
    textSize(14);
    textAlign(RIGHT);
    fill(255);
    text("Created by Grant Grady", width - 20, height - 50);
    
    if (!musicStarted && gameState === "start") {
        fill(255, 255, 0);
        text("🔊 Click to start music", width - 20, height - 70);
    }
}

function mousePressed() {
    if (gameState === "start") {
        gameState = "playing";
        
        if (backgroundMusic && backgroundMusic.isLoaded() && !musicStarted) {
            backgroundMusic.loop();
            musicStarted = true;
            console.log("Background music started");
        }
    } else if (gameState === "gameover") {
        restartGame();
    }
}

function keyPressed() {
    if (gameState !== "playing") return false;
    
    if (key === 'w' || key === 'W') movingUp = true;
    if (key === 's' || key === 'S') movingDown = true;
    if (key === 'a' || key === 'A') movingLeft = true;
    if (key === 'd' || key === 'D') movingRight = true;
    
    return false;
}

function keyReleased() {
    if (key === 'w' || key === 'W') movingUp = false;
    if (key === 's' || key === 'S') movingDown = false;
    if (key === 'a' || key === 'A') movingLeft = false;
    if (key === 'd' || key === 'D') movingRight = false;
    
    return false;
}

function restartGame() {
    gameState = "playing";
    score = 0;
    health = MAX_HEALTH;
    startTime = millis();
    timeLeft = 60;
    characterX = 400;
    characterY = 300;
    
    foods = [];
    initializeFood();
    
    if (backgroundMusic && backgroundMusic.isLoaded() && !backgroundMusic.isPlaying()) {
        backgroundMusic.loop();
    }
}
