
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 230,
    y: 150,
    width: 24,
    height: 28,
    speed: 2.5,
    direction: "down",
    moving: false,
    frame: 0
};

const keys = {};

function drawTree(x, y) {
    ctx.fillStyle = "#79543c";
    ctx.fillRect(x + 10, y + 15, 10, 20);

    ctx.fillStyle = "#4e985e";
    ctx.fillRect(x, y, 30, 25);

    ctx.fillStyle = "#69b879";
    ctx.fillRect(x + 5, y - 5, 20, 10);
}

function drawWorld() {
    ctx.fillStyle = "#a9dba0";
    ctx.fillRect(0, 0, 480, 320);

    // Caminho
    ctx.fillStyle = "#dfc49c";
    ctx.fillRect(0, 235, 480, 55);
    ctx.fillRect(200, 0, 65, 320);

    // Flores
    const flowers = [
        [50, 50], [100, 130], [390, 70],
        [430, 180], [70, 195], [350, 290]
    ];

    flowers.forEach(([x, y]) => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, y, 5, 5);

        ctx.fillStyle = "#f28caf";
        ctx.fillRect(x + 2, y + 2, 3, 3);
    });

    // Árvores
    drawTree(80, 75);
    drawTree(390, 240);
}



function drawObjects() {
    objects.forEach(object => {
        // Placa
        if (object.name === "Placa misteriosa") {
            ctx.fillStyle = "#79543c";
            ctx.fillRect(object.x + 8, object.y + 10, 5, 20);

            ctx.fillStyle = "#b98458";
            ctx.fillRect(object.x, object.y, 22, 13);
        }

        // Presente
        if (object.name === "Presente abandonado") {
            ctx.fillStyle = "#d66d91";
            ctx.fillRect(object.x, object.y, 20, 18);

            ctx.fillStyle = "#f5d36c";
            ctx.fillRect(object.x + 8, object.y, 4, 18);
            ctx.fillRect(object.x, object.y + 7, 20, 4);

            ctx.fillRect(object.x + 6, object.y - 4, 5, 5);
            ctx.fillRect(object.x + 11, object.y - 4, 5, 5);
        }

        // Bilhete
        if (object.name === "Bilhete escondido") {
            ctx.fillStyle = "#fff4d9";
            ctx.fillRect(object.x, object.y, 20, 16);

            ctx.fillStyle = "#a88a72";
            ctx.fillRect(object.x + 4, object.y + 5, 12, 2);
            ctx.fillRect(object.x + 4, object.y + 10, 9, 2);
        }
    });
}


const objects = [
    {
        x: 310,
        y: 110,
        name: "Placa misteriosa",
        message: "Uma placa antiga... Está escrito: 'Se você chegou até aqui, sua aventura apenas começou.'"
    },
    {
        x: 95,
        y: 205,
        name: "Presente abandonado",
        message: "Uma pequena caixa de presente. Parece que alguém esqueceu isso aqui. Mas para quem seria?"
    },
    {
        x: 360,
        y: 275,
        name: "Bilhete escondido",
        message: "Você encontrou um bilhete: 'Às vezes, as melhores aventuras começam por acaso.'"
    }
];

let nearbyObject = null;
let currentDialogue = null;


// Desenha o Ren
function drawRen() {
    const bob = player.moving && player.frame % 2 === 0 ? 2 : 0;

    const x = Math.round(player.x);
    const y = Math.round(player.y + bob);

    // Sombra
    ctx.fillStyle = "#71956a";
    ctx.fillRect(x + 3, y + 26 - bob, 19, 4);

    // Mochila
    ctx.fillStyle = "#29212d";
    ctx.fillRect(x + 1, y + 13, 5, 11);

    // Cabelo
    ctx.fillStyle = "#211b27";
    ctx.fillRect(x + 5, y + 1, 15, 9);
    ctx.fillRect(x + 3, y + 4, 5, 7);
    ctx.fillRect(x + 8, y - 2, 5, 5);
    ctx.fillRect(x + 16, y - 1, 5, 6);

    // Rosto
    ctx.fillStyle = "#f2c4a8";
    ctx.fillRect(x + 6, y + 8, 13, 10);

    // Franja
    ctx.fillStyle = "#211b27";
    ctx.fillRect(x + 5, y + 6, 13, 4);
    ctx.fillRect(x + 16, y + 8, 4, 4);

    // Óculos e olhos
    if (player.direction === "down") {
        ctx.fillStyle = "#17131c";
        ctx.fillRect(x + 6, y + 11, 6, 4);
        ctx.fillRect(x + 14, y + 11, 6, 4);

        ctx.fillStyle = "#f2c4a8";
        ctx.fillRect(x + 11, y + 12, 3, 2);
    }

    // Corpo: moletom
    ctx.fillStyle = "#302735";
    ctx.fillRect(x + 3, y + 17, 18, 8);

    // Detalhe do moletom
    ctx.fillStyle = "#6d566f";
    ctx.fillRect(x + 10, y + 19, 4, 3);

    // Pernas
    ctx.fillStyle = "#25202a";
    ctx.fillRect(x + 5, y + 24, 6, 3);
    ctx.fillRect(x + 14, y + 24, 6, 3);

    // Tênis
    ctx.fillStyle = "#ded5dc";
    ctx.fillRect(x + 4, y + 26, 8, 3);
    ctx.fillRect(x + 14, y + 26, 8, 3);
}

function movePlayer() {
    let dx = 0;
    let dy = 0;

    if (keys["ArrowUp"] || keys["w"]) dy -= 1;
    if (keys["ArrowDown"] || keys["s"]) dy += 1;
    if (keys["ArrowLeft"] || keys["a"]) dx -= 1;
    if (keys["ArrowRight"] || keys["d"]) dx += 1;

    player.moving = dx !== 0 || dy !== 0;

    if (dx !== 0 || dy !== 0) {
        if (Math.abs(dx) > Math.abs(dy)) {
            player.direction = dx > 0 ? "right" : "left";
        } else {
            player.direction = dy > 0 ? "down" : "up";
        }

        // Evita andar mais rápido na diagonal
        const length = Math.hypot(dx, dy);
        player.x += (dx / length) * player.speed;
        player.y += (dy / length) * player.speed;

        player.frame++;
    }

    player.x = Math.max(0, Math.min(480 - player.width, player.x));
    player.y = Math.max(0, Math.min(320 - player.height, player.y));
}

// Teclado
document.addEventListener("keydown", (event) => {
    keys[event.key] = true;

    if (event.key.startsWith("Arrow")) {
        event.preventDefault();
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

// Controles para celular
document.querySelectorAll("[data-direction]").forEach(button => {
    const direction = button.dataset.direction;

    const keyMap = {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight"
    };

    const key = keyMap[direction];

    button.addEventListener("pointerdown", event => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        keys[key] = true;
    });

    function release() {
        keys[key] = false;
    }

    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
});

// Loop principal
function gameLoop() {
    movePlayer();

    drawWorld();
    drawObjects();
    drawRen();

    requestAnimationFrame(gameLoop);
}


function checkNearbyObjects() {
    nearbyObject = null;

    objects.forEach(object => {
        const dx = (player.x + player.width / 2) - object.x;
        const dy = (player.y + player.height / 2) - object.y;

        const distance = Math.hypot(dx, dy);

        if (distance < 38) {
            nearbyObject = object;
        }
    });
}

function drawInteractionHint() {
    if (!nearbyObject || currentDialogue) return;

    ctx.fillStyle = "#80536f";
    ctx.fillRect(player.x - 5, player.y - 23, 35, 17);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px Arial";
    ctx.fillText("E", player.x + 8, player.y - 11);
}

const dialogueBox = document.getElementById("dialogueBox");
const dialogueName = document.getElementById("dialogueName");
const dialogueText = document.getElementById("dialogueText");

function interact() {
    if (currentDialogue) {
        currentDialogue = null;
        dialogueBox.hidden = true;
        return;
    }

    if (!nearbyObject) return;

    currentDialogue = nearbyObject;

    dialogueName.textContent = "Ren";
    dialogueText.textContent = nearbyObject.message;

    dialogueBox.hidden = false;
}

// Tecla E
document.addEventListener("keydown", event => {
    if (event.key.toLowerCase() === "e" && !event.repeat) {
        interact();
    }
});

// Botão para celular
document.getElementById("interactButton")
    .addEventListener("click", interact);


function gameLoop() {
    movePlayer();

    checkNearbyObjects();

    drawWorld();
    drawRen();
    drawInteractionHint();

    requestAnimationFrame(gameLoop);
}

gameLoop();