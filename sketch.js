//IMAGES
let BackgroundSquare;
let Brainthing;
let Controlboard;
let Movingwire;
let Pupilimage;
let GameoverImage;
let Titlescreen
let Brainjar;

//OTHER STF
let floatAmount = 15; 
let floatSpeed = 0.015; 
let angle = 0;
let bars = [];
let decayRate;
let gameOver = false;
let gameOverAlpha = 0;
let gameStarted = false;
let btnX, btnY, btnW = 1200, btnH = 600;
let bjw = 200, bjh = 200
let hoverTint = 0;
let gameOverTime = 0;
let gameOverDelay = 2000;

function preload(){
  BackgroundSquare = loadImage("backgroundsquare.png");
  Brainthing = loadImage("bigbrain.png")
  Controlboard = loadImage("controlboard.png")
  Movingwire = loadImage("movingwire.gif")
  Pupilimage = loadImage("pupilguy.png")
  GameoverImage = loadImage("Gameover.png")
  Titlescreen = loadImage("titlescreen.png");
  Brainjar = loadImage("brainjar.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //AMNT FOR BARS
  decayRate = 1 / (60 * 10);
  bars.push({ x: 265, y: 125, level: 1 });
  bars.push({ x: 265, y: 593, level: 1 });
  bars.push({ x: 1002, y: 593, level: 1 });
}

function draw() {
  background(19, 17, 55);
  let imgWidth = 1200; 
  let imgHeight = 600;
  let ex = (width - imgWidth) / 2;
  let ey = (height - imgHeight) / 2;

  if (!gameStarted) {
    imageMode(CENTER);
    btnX = 650;
    btnY = 330; 
    image(Titlescreen, width / 2, height / 2, btnW, btnH);

    //HOVER
    let hovering = (
      mouseX > btnX - bjw / 2 &&
      mouseX < btnX + bjw / 2 &&
      mouseY > btnY - bjh / 2 &&
      mouseY < btnY + bjh / 2
    );
    let target = hovering ? 1 : 0;
    let ease = 0.1;
    hoverTint += (target - hoverTint) * ease;
    let minBrightness = 180; 
    let maxBrightness = 255; 
    let brightness = lerp(minBrightness, maxBrightness, hoverTint);
    tint(brightness, brightness, brightness);
    image(Brainjar, btnX, btnY, bjw, bjh);
    noTint();
    imageMode(CORNER);
    return;
  }

  //BCK
    image(BackgroundSquare, ex, ey, 1200, 600);

    let yOffset = sin(angle) * floatAmount;
    image(Brainthing, ex, ey + yOffset, 1200, 600);
    angle += floatSpeed;

    image(Controlboard, ex, ey, 1200, 600);
    image(Movingwire, ex, ey, 1200, 600);

 //PUPIL AND EYE
let eyeballX = 1115;
let eyeballY = 505;
let eyeballRadius = 40;
let pupilWidth = 55;  
let pupilHeight = 55;

//CNTR
let dx = mouseX - eyeballX;
let dy = mouseY - eyeballY;
let distance = dist(mouseX, mouseY, eyeballX, eyeballY);
let maxDistance = eyeballRadius - pupilWidth / 2;

if (distance > maxDistance) {
  let angle = atan2(dy, dx);
  dx = cos(angle) * maxDistance;
  dy = sin(angle) * maxDistance;
}

let pupilX = eyeballX + dx - pupilWidth / 2;
let pupilY = eyeballY + dy - pupilHeight / 2;
image(Pupilimage, pupilX, pupilY, pupilWidth, pupilHeight);

if (gameOver) {
  let maxAlpha = 180;
  if (gameOverAlpha < maxAlpha) {
    gameOverAlpha += 5;
  }
  fill(0, gameOverAlpha);
  noStroke();
  rect(0, 0, width, height);
  push();
  tint(255, gameOverAlpha); 
  let scale = 0.5;
  let gameOverW = GameoverImage.width * scale;
  let gameOverH = GameoverImage.height * scale;
  imageMode(CENTER);
  image(GameoverImage, width / 2, height / 2, gameOverW, gameOverH);
  imageMode(CORNER);
  pop();
  return;
}

//BAR DECAY
for (let i = 0; i < bars.length; i++) {
  let bar = bars[i];
  bar.level -= decayRate;
  bar.level = constrain(bar.level, 0, 1);
  let barWidth = 135;
  let barHeight = 16;
  let fillWidth = barWidth * bar.level;

  // FLASH LOGIC
  let isLow = bar.level < 0.2;
  let flashing = isLow && (frameCount % 20 < 10); 
  if (flashing) {
    fill(255, 0, 0); 
  } else {
    fill(255, 120, 0); 
  }

//BAR
  noStroke();
  rect(bar.x, bar.y, fillWidth, barHeight);
  noFill();
  stroke(0);
  rect(bar.x, bar.y, barWidth, barHeight);
  if (
    mouseIsPressed &&
    mouseX > bar.x &&
    mouseX < bar.x + barWidth &&
    mouseY > bar.y &&
    mouseY < bar.y + barHeight
  ) {
    bar.level += 0.01;
    bar.level = constrain(bar.level, 0, 1);
  }
  if (bar.level <= 0) {
    gameOver = true;
    gameOverTime = millis();
}
}
}

function mousePressed() {
  if (!gameStarted) {
    if (
      mouseX > btnX - bjw / 2 &&
      mouseX < btnX + bjw / 2 &&
      mouseY > btnY - bjh / 2 &&
      mouseY < btnY + bjh / 2
    ) {
      gameStarted = true;
    }
    return;
  }
  if (gameOver && millis() - gameOverTime > gameOverDelay) {
    location.reload();
  }
}