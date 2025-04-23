//IMAGES
let BackgroundSquare;
let Brainthing;
let Controlboard;
let Movingwire;
let Pupilimage;
let GameoverImage;
let Titlescreen
let Brainjar;
let Pausebutton;
let Playbutton;
let Shocks

// OTHER STUFF
const imgWidth = 1200;
const imgHeight = 600;
const floatAmount = 15;
const floatSpeed = 0.015;
let angle = 0;
let bars = [];
let decayRate;
let gameOver = false;
let gameOverAlpha = 0;
let gameStarted = false;
let btnX, btnY, btnW = 1200, btnH = 600;
let bjw = 200, bjh = 200;
let hoverTint = 0;
let gameOverTime = 0;
let gameOverDelay = 1000;

// SPECIFIC TO EYEBALL
let eyeballRelX = 1025 / 1200;
let eyeballRelY = 443 / 600;
let ex, ey;

// SPECIFIC TO BRAINJAR
const titleRelX = 0.465;
const titleRelY = 0.45;
const titleImgW = 1200;
const titleImgH = 600;

// PLAY PAUSE
let paused = false;
let pauseX = 0.84;
let pauseY = 0.015;
let pauseW = 60;
let pauseH = 60;
let btnBrightness = 200;

function preload(){
  BackgroundSquare = loadImage("backgroundsquare.png");
  Brainthing = loadImage("bigbrain.png")
  Controlboard = loadImage("controlboard.png")
  Movingwire = loadImage("movingwire.gif")
  Pupilimage = loadImage("pupilguy.png")
  GameoverImage = loadImage("Gameover.png")
  Titlescreen = loadImage("titlescreen.png");
  Brainjar = loadImage("brainjar.png");
  Pausebutton = loadImage("Pausebutton.png");
  Playbutton = loadImage("Playbutton.png");
  Shocks = loadImage("Shockselec.gif");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //AMNT FOR BARS
  decayRate = 1 / (60 * 10);
  //RELATIVE TO CONTROLBOARD
  let barPositions = [
    { relX: 0.1440, relY: 0.1000 },
    { relX: 0.1440, relY: 0.8805 },
    { relX: 0.7580, relY: 0.8805 },
  ];
  for (let pos of barPositions) {
    bars.push({ relX: pos.relX, relY: pos.relY, level: 1 });
  }
}

function draw() {
  
  background(19, 17, 55);
  ex = (width - imgWidth) / 2;
  ey = (height - imgHeight) / 2;

  if (!gameStarted) {
    imageMode(CENTER);
    btnX = width / 2 + titleRelX * titleImgW - titleImgW / 2;
    btnY = height / 2 + titleRelY * titleImgH - titleImgH / 2;
    image(Titlescreen, width / 2, height / 2, titleImgW, titleImgH);

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
    image(Shocks, ex, ey, 1200, 600);

    let pauseBtnX = ex + pauseX * imgWidth;
    let pauseBtnY = ey + pauseY * imgHeight;
    let btnImage = paused ? Playbutton : Pausebutton;
    
    //DIM BTN 
    let isHoveringPause = (
      mouseX > pauseBtnX &&
      mouseX < pauseBtnX + pauseW &&
      mouseY > pauseBtnY &&
      mouseY < pauseBtnY + pauseH
    );
    let targetBrightness = isHoveringPause ? 160 : 255;
    let ease = 0.1;
    btnBrightness = lerp(btnBrightness, targetBrightness, ease);
    tint(btnBrightness);
    image(btnImage, pauseBtnX, pauseBtnY, pauseW, pauseH);
    noTint();

 //PUPIL AND EYE
let eyeballX = ex + eyeballRelX * imgWidth;
let eyeballY = ey + eyeballRelY * imgHeight;
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
  let barX = ex + bar.relX * imgWidth;
  let barY = ey + bar.relY * imgHeight;
  let barWidth = 135;
  let barHeight = 16;
  let fillWidth = barWidth * bar.level;

  
  if (!paused) {
    bar.level -= decayRate;
    bar.level = constrain(bar.level, 0, 1);
  }
  let isLow = bar.level < 0.2;
  let flashing = isLow && (frameCount % 20 < 10); 
  let blinkingPaused = paused && (frameCount % 20 < 10);
  if (blinkingPaused) {
    fill(255, 0, 150); 
  } else if (flashing) {
    fill(250, 240, 255); 
  } else {
    fill(207, 72, 10); 
  }

  noStroke();
  rect(barX, barY, fillWidth, barHeight);
  noFill();
  stroke(38, 26, 97);
  rect(barX, barY, barWidth, barHeight);
  if (
    !paused &&
    mouseIsPressed &&
    mouseX > barX &&
    mouseX < barX + barWidth &&
    mouseY > barY &&
    mouseY < barY + barHeight
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

  //DEBUG TOOL TO CHECK MOUSE X Y LOCATION
  /*if (gameStarted && !gameOver) {
    let relX = (mouseX - ex) / imgWidth;
    let relY = (mouseY - ey) / imgHeight;
    console.log(`{ relX: ${relX.toFixed(4)}, relY: ${relY.toFixed(4)} },`);
  }*/

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

  if (gameStarted && !gameOver) {
    let pauseBtnX = ex + pauseX * imgWidth;
    let pauseBtnY = ey + pauseY * imgHeight;
    if (
      mouseX > pauseBtnX &&
      mouseX < pauseBtnX + pauseW &&
      mouseY > pauseBtnY &&
      mouseY < pauseBtnY + pauseH
    ) {
      paused = !paused;
      return; 
    }
  }
}