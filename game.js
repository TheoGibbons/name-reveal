const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    dx: 0,
    dy: 0,
    dxDir: 0,
    speed: 600, // pixels per second
    gravity: 2500, // pixels per second squared
    jumpPower: -1100, // pixels per second
    color: 'red',
    jumping: false,
    images: {
        0: (function () {
            let f = new Image();
            f.src = 'dinosaur.png';
            return f;
        })(),
        1: (function () {
            let f = new Image();
            f.src = 'dinosaur-left.png';
            return f;
        })()
    }
};

const keys = {
    right: false,
    left: false,
    up: false
};

let scrollOffset = 0;
let platforms = [];
const platformSpacing = 200;
let lastTimestamp = 0;

// Load texture images
const textures = {
    'white': (function () {
        let img = new Image();
        img.src = 'texture1.png';
        return img;
    })(),
    'grey': (function () {
        let img = new Image();
        img.src = 'texture2.png';
        return img;
    })(),
    // Add more textures as needed
    // 'colorName': (function () {
    //     let img = new Image();
    //     img.src = 'textureN.png';
    //     return img;
    // })()
};

function createPlatforms() {
    platforms = [
        {x: 0, y: 520, width: 1000, height: 10, color: 'white'},
        {x: 820.258587888021, y: 343, width: 100, height: 10, color: 'grey'},
        {x: 400.21154398989323, y: 143, width: 100, height: 10, color: 'grey'},
        {x: 56.54696454713171, y: -57, width: 100, height: 10, color: 'grey'},
        {x: 364.6596628815427, y: -257, width: 100, height: 10, color: 'grey'},
        {x: 32.46046841753938, y: -457, width: 100, height: 10, color: 'grey'},
        {x: 446.4374968992856, y: -657, width: 100, height: 10, color: 'grey'},
        {x: 22.113466168296547, y: -857, width: 100, height: 10, color: 'grey'},
        {x: 294.74925428527075, y: -1057, width: 100, height: 10, color: 'grey'},
        {x: 721.9920440947534, y: -1257, width: 100, height: 10, color: 'grey'},
        {x: 766.1013663964306, y: -1457, width: 100, height: 10, color: 'grey'},
        {x: 630.7522046752704, y: -1657, width: 100, height: 10, color: 'grey'},
        {x: 204.73859541261152, y: -1857, width: 100, height: 10, color: 'grey'},
        {x: 29.277561533187303, y: -2057, width: 100, height: 10, color: 'grey'},
        {x: 183.17418310881408, y: -2257, width: 100, height: 10, color: 'grey'},
        {x: 365.2347233604346, y: -2457, width: 100, height: 10, color: 'grey'},
        {x: 803.6435419172379, y: -2657, width: 100, height: 10, color: 'grey'},
        {x: 559.9650024343357, y: -2857, width: 100, height: 10, color: 'grey'},
        {x: 544.0464963011494, y: -3057, width: 100, height: 10, color: 'grey'},
        {x: 810.9737156187504, y: -3257, width: 100, height: 10, color: 'grey'},
        {x: 300.37726766681851, y: -3457, width: 100, height: 10, color: 'grey'},
        {x: 810.003384869913, y: -3657, width: 100, height: 10, color: 'grey'},
        {x: 433.06899547132537, y: -3857, width: 100, height: 10, color: 'grey'},
        {x: 267.7471001252172, y: -4057, width: 100, height: 10, color: 'grey'},
        {x: 127.78205491397236, y: -4257, width: 100, height: 10, color: 'grey'},
        {x: 404.69535546568386, y: -4457, width: 100, height: 10, color: 'grey'},
        {x: 404.69535546568386, y: -4657, width: 100, height: 10, color: 'grey'},
        {x: 0, y: -4857, width: 1000, height: 10, color: 'red'}
    ];
}

function jump() {
    if (!player.jumping) {
        player.dy = player.jumpPower;
        player.jumping = true;
    }
}


let fireworks = [];
let showFireworks = false;

function update(timestamp) {
    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }
    const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert time to seconds
    lastTimestamp = timestamp;

    // If the game has ended, update and draw fireworks only
    if (showFireworks) {
        fireworks.forEach((firework, index) => {
            firework.update();
            if (firework.isFinished()) {
                fireworks.splice(index, 1);
            }
        });
        //draw();
        //requestAnimationFrame(update);
        //return;
    }

    // Horizontal movement
    if (keys.right) {
        player.dx = player.speed;
    } else if (keys.left) {
        player.dx = -player.speed;
    } else {
        player.dx = 0;
    }

    player.x += player.dx * deltaTime;

    // Prevent player from going out of bounds horizontally
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // Vertical movement and gravity
    player.dy += player.gravity * deltaTime;
    player.y += player.dy * deltaTime;

    // Platform collision detection
    platforms.forEach(platform => {
        if (player.dy > 0 &&
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height < platform.y + platform.height &&
            player.y + player.height + player.dy * deltaTime > platform.y
        ) {
            player.y = platform.y - player.height;
            player.dy = 0;
            player.jumping = false;
        }
    });

    // Check if the player has reached the end platform
    if (player.y <= platforms[platforms.length - 1].y - 50) {
        showFireworks = true;
        for (let i = 0; i < 10; i++) {
            fireworks.push(new Firework(player.x + player.width / 2, player.y + player.height / 2));
        }
    }

    // Update the name display
    let numBerOfLettersToDisplay = Math.max(0, Math.floor((player.y - 516) / -platformSpacing));
    for (let i = 0; i < document.getElementsByClassName('letter').length; i++) {
        document.getElementById('letter_' + i).style.visibility = i < numBerOfLettersToDisplay ? 'visible' : 'hidden';
    }

    // Prevent player from falling below the canvas
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.jumping = false;
    }

    // Scroll the screen up
    if (player.y < canvas.height / 2) {
        scrollOffset = canvas.height / 2 - player.y;
    } else {
        scrollOffset = 0;
    }

    // Some screens a so big the player starts to far from the first platform to reach it
    player.y = Math.min(player.y, 490);

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(0, scrollOffset);

    // What direction is the player facing?
    player.dxDir = player.dx < 0 ? 1 : (player.dx > 0 ? 0 : player.dxDir);

    // Draw player
    if (player.images[player.dxDir].complete) {
        ctx.drawImage(player.images[player.dxDir], player.x, player.y, player.width, player.height);
    } else {
        player.images[player.dxDir].onload = () => {
            ctx.drawImage(player.images[player.dxDir], player.x, player.y, player.width, player.height);
        };
    }

    // Draw platforms with textures
    platforms.forEach(platform => {
        if (textures[platform.color] && textures[platform.color].complete) {
            ctx.drawImage(textures[platform.color], platform.x, platform.y, platform.width, platform.height);
        } else {
            ctx.fillStyle = platform.color;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
    });

    // Draw fireworks
    fireworks.forEach(firework => {
        firework.draw(ctx);
    });

    ctx.restore();
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        jump();
    }
    if (e.code === 'ArrowRight') {
        keys.right = true;
    }
    if (e.code === 'ArrowLeft') {
        keys.left = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') {
        keys.right = false;
    }
    if (e.code === 'ArrowLeft') {
        keys.left = false;
    }
});

createPlatforms();
requestAnimationFrame(update);
