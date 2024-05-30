const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nameDisplay = document.getElementById('nameDisplay');

canvas.width = 1000;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    dx: 0,
    dy: 0,
    speed: 5,
    gravity: 0.2,
    jumpPower: -10,
    color: 'red',
    jumping: false
};

const keys = {
    right: false,
    left: false,
    up: false
};

const levels = ["M", "y", " ", "T", "e", "x", "t"];
let currentLevel = 0;
let scrollOffset = 0;
let lettersRevealed = '';

let platforms = [];
const platformWidth = 100;
const platformHeight = 10;
const platformSpacing = 200;

function createPlatforms() {
    platforms = [
        {x: 0, y: 520, width: 1000, height: 10, color: '#FFF'}, // Random rainbow color
        {x: 820.258587888021, y: 343, width: 100, height: 10, color: '#D3D3D3'}, // Level 1 - Light grey
        {x: 400.21154398989323, y: 143, width: 100, height: 10, color: '#CCC'}, // Level 2 - Slightly darker grey
        {x: 56.54696454713171, y: -57, width: 100, height: 10, color: '#BBB'}, // Level 3 - Darker grey
        {x: 364.6596628815427, y: -257, width: 100, height: 10, color: '#AAA'}, // Level 4 - Dark grey
        {x: 32.46046841753938, y: -457, width: 100, height: 10, color: '#999'}, // Level 5 - Slate blue
        {x: 446.4374968992856, y: -657, width: 100, height: 10, color: '#888'}, // Level 6 - Slate blue
        {x: 22.113466168296547, y: -857, width: 100, height: 10, color: '#777'}, // Level 7 - Slate blue
        {x: 294.74925428527075, y: -1057, width: 100, height: 10, color: '#666'}, // Level 8 - Slate blue
        {x: 721.9920440947534, y: -1257, width: 100, height: 10, color: '#555'}, // Level 9 - Slate blue
        {x: 766.1013663964306, y: -1457, width: 100, height: 10, color: '#444'}, // Level 10 - Black
        {x: 630.7522046752704, y: -1657, width: 100, height: 10, color: '#333'}, // Random rainbow color
        {x: 204.73859541261152, y: -1857, width: 100, height: 10, color: '#222'}, // Random rainbow color
        {x: 29.277561533187303, y: -2057, width: 100, height: 10, color: '#111'}, // Random rainbow color
        {x: 183.17418310881408, y: -2257, width: 100, height: 10, color: '#000'}, // Random rainbow color
        {x: 365.2347233604346, y: -2457, width: 100, height: 10, color:  'hsl(28deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 803.6435419172379, y: -2657, width: 100, height: 10, color:  'hsl(56deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 559.9650024343357, y: -2857, width: 100, height: 10, color:  'hsl(84deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 544.0464963011494, y: -3057, width: 100, height: 10, color:  'hsl(112deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 810.9737156187504, y: -3257, width: 100, height: 10, color:  'hsl(140deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 300.37726766681851, y: -3457, width: 100, height: 10, color: 'hsl(168deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 810.003384869913, y: -3657, width: 100, height: 10, color:   'hsl(175deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 433.06899547132537, y: -3857, width: 100, height: 10, color: 'hsl(224deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 267.7471001252172, y: -4057, width: 100, height: 10, color:  'hsl(252deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 127.78205491397236, y: -4257, width: 100, height: 10, color: 'hsl(280deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 404.69535546568386, y: -4457, width: 100, height: 10, color: 'hsl(308deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 404.69535546568386, y: -4657, width: 100, height: 10, color: 'hsl(336deg 71.43% 72.55%)'}, // Random rainbow color
        {x: 0, y: -4857, width: 1000, height: 10, color: 'red'} // Random rainbow color
    ];
    // for (let i = 0; i < 27; i++) {
    //
    //     let platform = {
    //         x: Math.random() * (canvas.width - platformWidth),
    //         y: canvas.height - (i * platformSpacing),
    //         width: platformWidth,
    //         height: platformHeight,
    //         color: 'green'
    //     };
    //
    //     console.log(platform)
    //
    //     platforms.push(platform);
    // }
}

function jump() {
    if (!player.jumping) {
        player.dy = player.jumpPower;
        player.jumping = true;
    }
}

function update() {
    // Horizontal movement
    if (keys.right) {
        player.dx = player.speed;
    } else if (keys.left) {
        player.dx = -player.speed;
    } else {
        player.dx = 0;
    }

    player.x += player.dx;

    // Prevent player from going out of bounds horizontally
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // Vertical movement and gravity
    player.dy += player.gravity;
    player.y += player.dy;

    // Platform collision detection
    platforms.forEach(platform => {
        if (player.dy > 0 &&
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height < platform.y + platform.height &&
            player.y + player.height + player.dy > platform.y
        ) {
            player.y = platform.y - player.height;
            player.dy = 0;
            player.jumping = false;

            // if (currentLevel < levels.length) {
            //     lettersRevealed += levels[currentLevel];
            //     currentLevel++;
            //     nameDisplay.innerText = lettersRevealed;
            // }

        }
    });

    // Update the name display
    let numBerOfLettersToDisplay = Math.max(0, Math.floor((player.y - 516) / -platformSpacing))
    //nameDisplay.innerText = levels.slice(0, numBerOfLettersToDisplay).join('');
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

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
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
    if (e.code === 'Minus' && e.shiftKey) {
        player.dy = Math.min(-10, player.dy + 1);
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
update();
