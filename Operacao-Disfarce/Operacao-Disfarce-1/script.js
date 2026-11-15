

const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");



const scoreDisplay = document.getElementById("score");

const notesDisplay = document.getElementById("notes");

const statusDisplay = document.getElementById("status");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const GOAL_SCORE = 100;



const startScreen = document.getElementById("startScreen");

const endScreen = document.getElementById("endScreen");



const W = canvas.width;

const H = canvas.height;

const FLOOR = 365;



let running = false;

let animation;

let score = 0;

let notesFound = 0;

let distance = 0;

let speed = 4;

let spawnTimer = 0;

let objects = [];

let particles = [];

let frame = 0;

let messageTimer = 0;



const player = {

  x: 165,

  y: FLOOR - 72,

  velocityY: 0,

  jumping: false,

  sliding: false,

  slideTimer: 0,

  anim: 0

};



const ren = {

  x: 65,

  anim: 0

};



// Mensagens secretas

const messages = [

  "Corre, querida, o boleto emocional chegou!",

  "Você fugiu, mas esqueceu de levar meu juízo.",

  "Ren.exe parou de funcionar ao ver você.",

  "Não é perseguição se eu chamar de caminhada acelerada.",

  "O destino está tentando juntar vocês. Ou é falta de GPS?",

  "Você desbloqueou: fingir que não viu a mensagem.",

  "Alerta: excesso de pensamentos às 3 da manhã.",

  "Era só uma amizade... até o roteiro começar a suspeitar.",

  "Parabéns! Mais um problema que você não pediu.",

  "Se correr resolvesse a vida, você já teria resolvido.",

  "Ren está digitando... há 84 anos.",

  "Cuidado! Sentimentos não identificados à frente.",

  "Você tem 99 problemas e Ren é um deles.",

  "Plot twist: ninguém sabe o que está acontecendo.",

  "Objetivo secundário: manter a pose de plena.",

  "Você disse que ia dormir cedo. São 03:17.",

  "Missão impossível: agir naturalmente.",

  "Ele só queria conversar. Suspeitamente.",

  "A protagonista está fugindo dos próprios pensamentos.",

  "Mensagem subliminar encontrada: saudade talvez?"

];



// Ferramentas de desenho

function roundedRect(x, y, w, h, r, color) {

  ctx.fillStyle = color;

  ctx.beginPath();

  ctx.roundRect(x, y, w, h, r);

  ctx.fill();

}



function circle(x, y, radius, color) {

  ctx.fillStyle = color;

  ctx.beginPath();

  ctx.arc(x, y, radius, 0, Math.PI * 2);

  ctx.fill();

}



function ellipse(x, y, rx, ry, color) {

  ctx.fillStyle = color;

  ctx.beginPath();

  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);

  ctx.fill();

}



// Cenário com movimento em camadas

function drawBackground() {

  // Céu

  const sky = ctx.createLinearGradient(0, 0, 0, H);

  sky.addColorStop(0, "#83d5f4");

  sky.addColorStop(1, "#d8f4f4");



  ctx.fillStyle = sky;

  ctx.fillRect(0, 0, W, H);



  // Sol

  circle(690, 85, 42, "#ffe995");

  circle(690, 85, 35, "#fff2b8");



  // Nuvens

  for (let i = 0; i < 5; i++) {

    const x = ((i * 210 - distance * 0.18) % 1000 + 1000) % 1000 - 80;

    drawCloud(x, 75 + (i % 2) * 35);

  }



  // Montanhas

  ctx.fillStyle = "#a6d6ac";



  for (let i = 0; i < 6; i++) {

    const x = i * 190 - (distance * 0.3 % 190);



    ctx.beginPath();

    ctx.moveTo(x, 320);

    ctx.lineTo(x + 95, 190);

    ctx.lineTo(x + 190, 320);

    ctx.fill();

  }



  // Morros

  ctx.fillStyle = "#80c982";



  for (let i = 0; i < 5; i++) {

    const x = i * 230 - (distance * 0.5 % 230);



    ctx.beginPath();

    ctx.ellipse(x + 100, 325, 145, 50, 0, Math.PI, 0);

    ctx.fill();

  }



  // Chão gramado

  ctx.fillStyle = "#74c56e";

  ctx.fillRect(0, 310, W, 140);



  // Casas

  for (let i = 0; i < 5; i++) {

    const x = ((i * 240 - distance * 0.65) % 1200 + 1200) % 1200 - 130;

    drawHouse(x, 260);

  }



  // Árvores floridas

  for (let i = 0; i < 8; i++) {

    const x = ((i * 135 - distance * 0.85) % 1100 + 1100) % 1100 - 80;

    drawTree(x, 305);

  }



  // Caminho

  ctx.fillStyle = "#eacb9e";

  ctx.fillRect(0, FLOOR, W, 85);



  ctx.fillStyle = "#d3ad7c";



  for (let i = 0; i < 14; i++) {

    const x = ((i * 85 - distance) % 850 + 850) % 850;

    roundedRect(x, FLOOR + 22, 32, 4, 2, "#d3ad7c");

  }

}



function drawCloud(x, y) {

  ellipse(x, y, 23, 16, "#ffffff");

  ellipse(x + 24, y - 10, 28, 20, "#ffffff");

  ellipse(x + 53, y, 23, 16, "#ffffff");

}



function drawHouse(x, y) {

  // Corpo

  roundedRect(x, y, 95, 75, 5, "#ffe2b5");



  // Telhado

  ctx.fillStyle = "#e77c91";

  ctx.beginPath();

  ctx.moveTo(x - 10, y + 5);

  ctx.lineTo(x + 47, y - 38);

  ctx.lineTo(x + 105, y + 5);

  ctx.fill();



  // Porta

  roundedRect(x + 37, y + 35, 23, 40, 5, "#a56a55");



  // Janelas

  roundedRect(x + 9, y + 18, 23, 22, 4, "#8bd9e8");

  roundedRect(x + 65, y + 18, 23, 22, 4, "#8bd9e8");



  ctx.strokeStyle = "#ffffff";

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(x + 20, y + 18);

  ctx.lineTo(x + 20, y + 40);

  ctx.moveTo(x + 9, y + 29);

  ctx.lineTo(x + 32, y + 29);

  ctx.moveTo(x + 76, y + 18);

  ctx.lineTo(x + 76, y + 40);

  ctx.moveTo(x + 65, y + 29);

  ctx.lineTo(x + 88, y + 29);

  ctx.stroke();

}



function drawTree(x, y) {

  roundedRect(x + 13, y - 8, 12, 55, 4, "#916044");



  circle(x + 18, y - 24, 27, "#4ca66b");

  circle(x + 2, y - 10, 18, "#5bb978");

  circle(x + 34, y - 10, 18, "#5bb978");



  // Flores

  circle(x + 5, y - 30, 5, "#ffb7d2");

  circle(x + 30, y - 32, 5, "#ffd2e3");

  circle(x + 17, y - 10, 4, "#ffb7d2");

}



// Spritesheet dos personagens
// Deixe operacao_disfarce_sprites.png na mesma pasta do index.html.
const spriteSheet = new Image();
spriteSheet.src = "operacao_disfarce_sprites.png";
let spritesReady = false;
spriteSheet.onload = () => { spritesReady = true; };
spriteSheet.onerror = () => console.warn("Sprites não carregadas. Confira o nome e a pasta do PNG.");

const CELL_W = 192;
const CELL_H = 256;

function drawSpriteCell(col, row, x, y, width, height) {
  if (!spritesReady) return false;
  ctx.drawImage(
    spriteSheet,
    col * CELL_W, row * CELL_H, CELL_W, CELL_H,
    x, y, width, height
  );
  return true;
}

function drawGirl() {
  const x = player.x;
  const bob = Math.abs(Math.sin(player.anim)) * 2;
  ellipse(x + 35, FLOOR + 3, 29, 5, "#5a9d58");

  if (player.sliding) {
    const slideFrame = Math.min(4, Math.floor(player.anim * 1.4) % 5);
    if (!drawSpriteCell(slideFrame, 1, x - 8, FLOOR - 82, 94, 88)) {
      drawFallbackGirl(x, player.y);
    }
  } else if (player.jumping) {
    if (!drawSpriteCell(5, 0, x - 9, player.y - 16, 100, 118)) {
      drawFallbackGirl(x, player.y);
    }
  } else {
    const runFrame = Math.floor(player.anim * 1.5) % 5;
    if (!drawSpriteCell(runFrame, 0, x - 10, player.y - 25 + bob, 100, 118)) {
      drawFallbackGirl(x, player.y);
    }
  }
}

function drawFallbackGirl(x, y) {
  ellipse(x + 22, y + 18, 17, 19, "#b87955");
  ellipse(x + 22, y + 5, 19, 16, "#299d59");
  circle(x + 4, y - 8, 9, "#279d58");
  circle(x + 40, y - 8, 9, "#279d58");
  roundedRect(x + 10, y + 29, 25, 24, 6, "#e63d70");
  ctx.strokeStyle = "#292238";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 50);
  ctx.lineTo(x + 10, y + 65);
  ctx.moveTo(x + 31, y + 50);
  ctx.lineTo(x + 36, y + 65);
  ctx.stroke();
}

function drawRen() {
  const x = ren.x;
  const y = FLOOR - 94 + Math.abs(Math.sin(ren.anim)) * 2;
  ellipse(x + 35, FLOOR + 3, 28, 5, "#5a9d58");
  const runFrame = Math.floor(ren.anim * 1.5) % 5;

  if (!drawSpriteCell(runFrame, 2, x - 8, y - 4, 98, 118)) {
    roundedRect(x + 5, y + 27, 34, 27, 8, "#292536");
    ellipse(x + 22, y + 18, 17, 19, "#f2c4a8");
    ellipse(x + 22, y + 5, 18, 12, "#211b27");
    roundedRect(x + 5, y + 15, 34, 5, 2, "#211b27");
  }
}

// Objetos

function spawnObject() {
  const roll = Math.random();
  let type;
  if (roll < 0.34) type = "box";
  else if (roll < 0.62) type = "heart";
  else if (roll < 0.91) type = "note";
  else type = "star";

  objects.push({
    x: 850,
    y: type === "box" ? FLOOR - 32 : FLOOR - 60,
    type,
    width: type === "box" ? 32 : 29,
    height: type === "box" ? 32 : 29,
    collected: false,
    message: type === "note" ? messages[Math.floor(Math.random() * messages.length)] : ""
  });
}

function drawObjects() {
  objects.forEach(object => {
    if (object.type === "box") {
      roundedRect(object.x, object.y, 33, 32, 5, "#b77a53");
      roundedRect(object.x + 5, object.y + 5, 23, 22, 3, "#d9a16d");
    } else if (object.type === "heart") {
      ctx.font = "27px Arial";
      ctx.fillText("❤️", object.x, object.y + 25);
    } else if (object.type === "star") {
      ctx.font = "28px Arial";
      ctx.fillText("⭐", object.x, object.y + 25);
    } else {
      ctx.font = "27px Arial";
      ctx.fillText("💌", object.x, object.y + 25);
    }
  });
}

// Interações

function jump() {

  if (!running || player.jumping || player.sliding) return;



  player.velocityY = -13;

  player.jumping = true;

}



function slide() {

  if (!running || player.jumping || player.sliding) return;



  player.sliding = true;

  player.slideTimer = 38;

}



function updateProgress() {
  const current = Math.min(score, GOAL_SCORE);
  scoreDisplay.textContent = current;
  progressText.textContent = `${current} / ${GOAL_SCORE}`;
  progressFill.style.width = `${(current / GOAL_SCORE) * 100}%`;
}

function addPoints(points, message) {
  if (!running) return;
  score = Math.min(GOAL_SCORE, score + points);
  updateProgress();
  if (message) showMessage(message);
  if (score >= GOAL_SCORE) endGame(true);
}

function showMessage(message) {

  statusDisplay.textContent = message;

  messageTimer = 240;

}



function update() {

  if (!running) return;



  frame++;

  distance += speed;



  player.anim += 0.22;

  ren.anim += 0.22;



  if (messageTimer > 0) {

    messageTimer--;

  } else {

    statusDisplay.textContent = "FUGA EM ANDAMENTO!";

  }



  // Gravidade

  player.y += player.velocityY;

  player.velocityY += 0.65;



  if (player.y >= FLOOR - 72) {

    player.y = FLOOR - 72;

    player.velocityY = 0;

    player.jumping = false;

  }



  // Deslizada

  if (player.sliding) {

    player.slideTimer--;



    if (player.slideTimer <= 0) {

      player.sliding = false;

    }

  }



  // Criação de obstáculos

  spawnTimer--;



  if (spawnTimer <= 0) {

    spawnObject();

    spawnTimer = 90 + Math.random() * 55;

  }



  objects.forEach(object => {

    object.x -= speed;

  });



  // Colisões

  const hitbox = {

    x: player.x + 7,

    y: player.sliding ? FLOOR - 35 : player.y + 10,

    width: 32,

    height: player.sliding ? 25 : 54

  };



  objects.forEach(object => {

    if (object.collected) return;



    const hit =

      hitbox.x < object.x + object.width &&

      hitbox.x + hitbox.width > object.x &&

      hitbox.y < object.y + object.height &&

      hitbox.y + hitbox.height > object.y;



    if (!hit) return;



    if (object.type === "box") {

      endGame(false);

      return;

    }



    object.collected = true;



    if (object.type === "heart") {

      score += 10;

      scoreDisplay.textContent = score;

    }



    if (object.type === "note") {

      notesFound++;

      notesDisplay.textContent = notesFound;

      showMessage(object.message);

    }

  });



  objects = objects.filter(object => object.x > -60 && !object.collected);



  // Dificuldade progressiva

  speed = Math.min(7, 4 + distance / 4000);



  if (distance >= 6500) {

    endGame(true);

  }

}



function drawSadRen() {
  const x = 650;
  const y = FLOOR - 4;
  ellipse(x + 5, FLOOR + 3, 45, 7, "#5a9d58");

  // Pernas dobradas
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = 15;
  ctx.strokeStyle = "#211b27";
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 27);
  ctx.lineTo(x - 31, y - 12);
  ctx.lineTo(x - 5, y - 7);
  ctx.moveTo(x + 8, y - 27);
  ctx.lineTo(x + 31, y - 12);
  ctx.lineTo(x + 44, y - 7);
  ctx.stroke();

  // Moletom e cabeça
  roundedRect(x - 21, y - 62, 43, 40, 12, "#292536");
  ellipse(x, y - 80, 22, 24, "#f2c4a8");
  ellipse(x, y - 99, 24, 14, "#211b27");
  circle(x - 17, y - 94, 9, "#211b27");
  circle(x + 2, y - 106, 10, "#211b27");
  circle(x + 18, y - 96, 8, "#211b27");

  // Óculos
  ctx.strokeStyle = "#17131d";
  ctx.lineWidth = 3;
  ctx.strokeRect(x - 18, y - 86, 15, 11);
  ctx.strokeRect(x + 3, y - 86, 15, 11);
  ctx.beginPath();
  ctx.moveTo(x - 3, y - 81);
  ctx.lineTo(x + 3, y - 81);
  ctx.stroke();

  // Olhos caídos, boca triste e lágrima
  circle(x - 10, y - 81, 1.8, "#211b27");
  circle(x + 10, y - 81, 1.8, "#211b27");
  ctx.strokeStyle = "#8d4d61";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y - 64, 6, Math.PI + 0.2, Math.PI * 2 - 0.2);
  ctx.stroke();
  circle(x + 25, y - 75, 3, "#75c9ed");
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Trebuchet MS";
  ctx.fillText("…", x + 37, y - 94);
  ctx.restore();
}

function draw() {

  drawBackground();

  drawObjects();

  drawRen();

  drawGirl();



  // Indicador da perseguição

  roundedRect(15, 12, 210, 27, 12, "#ffffffcc");



  ctx.fillStyle = "#cf4d85";

  ctx.font = "bold 13px Trebuchet MS";

  ctx.fillText("REN ESTÁ ATRÁS DE VOCÊ!", 27, 30);

}



function gameLoop() {

  if (!running) return;



  update();

  draw();



  if (running) {

    animation = requestAnimationFrame(gameLoop);

  }

}



function startGame() {

  cancelAnimationFrame(animation);



  score = 0;

  notesFound = 0;

  distance = 0;

  speed = 4;

  spawnTimer = 60;

  objects = [];

  messageTimer = 0;



  player.y = FLOOR - 72;

  player.velocityY = 0;

  player.jumping = false;

  player.sliding = false;

  player.anim = 0;



  ren.anim = 0;



  scoreDisplay.textContent = "0";

  notesDisplay.textContent = "0";

  statusDisplay.textContent = "FUGA EM ANDAMENTO!";



  startScreen.hidden = true;

  endScreen.hidden = true;



  running = true;

  gameLoop();

}



function endGame(won) {

  if (!running) return;



  running = false;

  cancelAnimationFrame(animation);



  document.getElementById("endTitle").textContent =

    won ? "VOCÊ CONSEGUIU! 💚" : "REN TE ALCANÇOU! 😂";



  document.getElementById("endMessage").textContent =

    won

      ? `Você escapou com ${score} pontos e encontrou ${notesFound} bilhetes!`

      : "Você foi distraída! Ren só queria conversar... aparentemente.";



  endScreen.hidden = false;

}



// Teclado

document.addEventListener("keydown", event => {

  if (["ArrowUp", "ArrowDown", " "].includes(event.key)) {

    event.preventDefault();

  }



  if (event.repeat) return;



  if (event.key === "ArrowUp" || event.key === " ") jump();

  if (event.key === "ArrowDown") slide();

});



// Botões

document.getElementById("startButton")

  .addEventListener("click", startGame);



document.getElementById("restartButton")

  .addEventListener("click", startGame);



document.getElementById("jumpButton")

  .addEventListener("pointerdown", event => {

    event.preventDefault();

    jump();

  });



document.getElementById("slideButton")

  .addEventListener("pointerdown", event => {

    event.preventDefault();

    slide();

  });



// Desenho inicial

drawBackground();

drawRen();

drawGirl();
