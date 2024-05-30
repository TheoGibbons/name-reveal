const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = window.innerHeight;

function myImage(url) {
    let img = new Image();
    img.src = url;
    return img;
}

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 67,
    height: 94,
    dx: 0,
    dy: 0,
    dxDir: 0,
    speed: 600, // pixels per second
    gravity: 2500, // pixels per second squared
    jumpPower: -1100, // pixels per second
    color: 'red',
    jumping: false,
    images: {
        stand: myImage('images/Player/p1_stand.png'),
        walk: [
            myImage('images/Player/walk/p1_walk01.png'),
            myImage('images/Player/walk/p1_walk02.png'),
            myImage('images/Player/walk/p1_walk03.png'),
            myImage('images/Player/walk/p1_walk04.png'),
            myImage('images/Player/walk/p1_walk05.png'),
            myImage('images/Player/walk/p1_walk06.png'),
            myImage('images/Player/walk/p1_walk07.png'),
            myImage('images/Player/walk/p1_walk08.png'),
            myImage('images/Player/walk/p1_walk09.png'),
            myImage('images/Player/walk/p1_walk10.png'),
            myImage('images/Player/walk/p1_walk11.png'),
        ],
        jump: {
            right: myImage('images/Player/p1_jump_right.png'),
            left: myImage('images/Player/p1_jump_left.png'),
        }
    },
    currentFrame: 0,
    frameCount: 0,
    maxFrames: 10,
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
    'grassLeft': myImage('images/Platforms/grassHalfLeft.png'),
    'grassMid': myImage('images/Platforms/grassHalfMid.png'),
    'grassRight': myImage('images/Platforms/grassHalfRight.png'),
};

function createPlatforms() {
    platforms = [
        {x: 0, y: 520, width: 1000, height: 10, type: 'grassMid'},
        {x: 820, y: 343, width: 70, height: 70, type: 'grassMid'},
        {x: 400, y: 143, width: 70, height: 70, type: 'grassMid'},
        {x: 56, y: -57, width: 70, height: 70, type: 'grassMid'},
        {x: 364, y: -257, width: 70, height: 70, type: 'grassMid'},
        {x: 32, y: -457, width: 70, height: 70, type: 'grassMid'},
        {x: 446, y: -657, width: 70, height: 70, type: 'grassMid'},
        {x: 22, y: -857, width: 70, height: 70, type: 'grassMid'},
        {x: 294, y: -1057, width: 70, height: 70, type: 'grassMid'},
        {x: 721, y: -1257, width: 70, height: 70, type: 'grassMid'},
        {x: 766, y: -1457, width: 70, height: 70, type: 'grassMid'},
        {x: 630, y: -1657, width: 70, height: 70, type: 'grassMid'},
        {x: 204, y: -1857, width: 70, height: 70, type: 'grassMid'},
        {x: 29, y: -2057, width: 70, height: 70, type: 'grassMid'},
        {x: 183, y: -2257, width: 70, height: 70, type: 'grassMid'},
        {x: 365, y: -2457, width: 70, height: 70, type: 'grassMid'},
        {x: 803, y: -2657, width: 70, height: 70, type: 'grassMid'},
        {x: 559, y: -2857, width: 70, height: 70, type: 'grassMid'},
        {x: 544, y: -3057, width: 70, height: 70, type: 'grassMid'},
        {x: 810, y: -3257, width: 70, height: 70, type: 'grassMid'},
        {x: 300, y: -3457, width: 70, height: 70, type: 'grassMid'},
        {x: 810, y: -3657, width: 70, height: 70, type: 'grassMid'},
        {x: 433, y: -3857, width: 70, height: 70, type: 'grassMid'},
        {x: 267, y: -4057, width: 70, height: 70, type: 'grassMid'},
        {x: 127, y: -4257, width: 70, height: 70, type: 'grassMid'},
        {x: 404, y: -4457, width: 70, height: 70, type: 'grassMid'},
        {x: 404, y: -4657, width: 70, height: 70, type: 'grassMid'},
        {x: 0, y: -4857, width: 1000, height: 10, type: 'grassMid'}
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
    }

    // Horizontal movement
    if (keys.right) {
        player.dx = player.speed;
        player.frameCount++;
        if (player.frameCount >= player.maxFrames) {
            player.frameCount = 0;
            player.currentFrame = (player.currentFrame + 1) % player.images.walk.length;
        }
    } else if (keys.left) {
        player.dx = -player.speed;
        player.frameCount++;
        if (player.frameCount >= player.maxFrames) {
            player.frameCount = 0;
            player.currentFrame = (player.currentFrame + 1) % player.images.walk.length;
        }
    } else {
        player.dx = 0;
        player.currentFrame = 0;
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

    // Some screens are so big the player starts too far from the first platform to reach it
    player.y = Math.min(player.y, 520 - 94);

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(0, scrollOffset);

    // Draw player
    let playerImage;
    if (player.jumping) {
        playerImage = player.dx >= 0 ? player.images.jump.right : player.images.jump.left;
    } else if (player.dx !== 0) {
        playerImage = player.images.walk[player.currentFrame];
    } else {
        playerImage = player.images.stand;
    }
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw platforms with textures
    platforms.forEach(platform => {
        if (textures[platform.type] && textures[platform.type].complete) {
            ctx.drawImage(textures[platform.type], platform.x, platform.y, platform.width, platform.height);
        } else {
            ctx.fillStyle = platform.type;
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

// Mobile touch events
document.getElementById('jumpButton').addEventListener('touchstart', jump);
document.getElementById('leftButton').addEventListener('touchstart', () => keys.left = true);
document.getElementById('leftButton').addEventListener('touchend', () => keys.left = false);
document.getElementById('rightButton').addEventListener('touchstart', () => keys.right = true);
document.getElementById('rightButton').addEventListener('touchend', () => keys.right = false);

createPlatforms();
requestAnimationFrame(update);
