const btnStart = document.getElementById('start-btn');
const btnNext = document.getElementById('next-btn');
const btnRestart = document.getElementById('restart-btn');

const startContainer = document.getElementById('start-container');
const gameContainer = document.getElementById('game-container');
const endContainer = document.getElementById('end-container');
const roundContainer = document.getElementById('round');

const won = document.getElementById('won');
const loss = document.getElementById('loss');

const gameArea = document.getElementById('gameArea');
const balls = [
  { element: document.getElementById('ballOne'), velocity: { x: 0, y: 0 } },
  { element: document.getElementById('ballTwo'), velocity: { x: 0, y: 0 } },
  { element: document.getElementById('ballThree'), velocity: { x: 0, y: 0 } },
  { element: document.getElementById('ballFour'), velocity: { x: 0, y: 0 } },
  { element: document.getElementById('ballFive'), velocity: { x: 0, y: 0 } }
];

let selectedBall = null;
let movingInterval = null;
const radius = 25;
let round = 1;
let time = 1000;

function setInitialPositions() {
  const gameBound = gameArea.getBoundingClientRect();
  const centerX = gameBound.width / 2 - radius;
  const centerY = gameBound.height / 2 - radius;

  balls.forEach((ball, index) => {
    ball.element.style.top = `${centerY}px`;
    ball.element.style.left = `${75 + (index - 1) * 55.0}px`;
  });
}

function getRandomVelocity() {
  let velocity;
  do {
    velocity = Math.random() * 16 - 8;
  } while (Math.abs(velocity) < 0.1);
  return velocity;
}

function move() {
  const gameBound = gameArea.getBoundingClientRect();

  balls.forEach(ball => {
    let ballTop = parseFloat(ball.element.style.top);
    let ballLeft = parseFloat(ball.element.style.left);

    ballTop += ball.velocity.y;
    ballLeft += ball.velocity.x;

    if (ballTop <= 0 || ballTop >= gameBound.height - radius * 2) {
      ball.velocity.y = -ball.velocity.y;
      ballTop = Math.max(0, Math.min(ballTop, gameBound.height - radius * 2));
    }

    if (ballLeft <= 0 || ballLeft >= gameBound.width - radius * 2) {
      ball.velocity.x = -ball.velocity.x;
      ballLeft = Math.max(0, Math.min(ballLeft, gameBound.width - radius * 2));
    }

    ball.element.style.top = ballTop + 'px';
    ball.element.style.left = ballLeft + 'px';
  });

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      checkCollision(balls[i], balls[j]);
    }
  }
}

function checkCollision(ball1, ball2) {
  const ball1Pos = ball1.element.getBoundingClientRect();
  const ball2Pos = ball2.element.getBoundingClientRect();

  const dx = ball2Pos.left - ball1Pos.left;
  const dy = ball2Pos.top - ball1Pos.top;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 2 * radius) {
    const nx = dx / distance;
    const ny = dy / distance;

    const v1x = ball1.velocity.x;
    const v1y = ball1.velocity.y;
    const v2x = ball2.velocity.x;
    const v2y = ball2.velocity.y;

    const dotProduct = (v1x * nx + v1y * ny) - (v2x * nx + v2y * ny);

    const e = 1;
    const j = (-(1 + e) * dotProduct) / 2;

    ball1.velocity.x += j * nx;
    ball1.velocity.y += j * ny;
    ball2.velocity.x -= j * nx;
    ball2.velocity.y -= j * ny;
  }
}

function startMoving() {
  balls.forEach(ball => {
    ball.velocity.x = getRandomVelocity();
    ball.velocity.y = getRandomVelocity();
    ball.element.classList.add('moving');
  });

  movingInterval = setInterval(() => {
    move();
  }, 1000 / 90);

  setTimeout(() => {
    stopMoving();
  }, time);
}

function stopMoving() {
  clearInterval(movingInterval);
  balls.forEach(ball => {
    ball.element.classList.remove('moving');
    ball.velocity.x = 0;
    ball.velocity.y = 0;
  });
}

function insertAd() {
  const adContainer = document.getElementById('ad-container');
  adContainer.innerHTML = '';
  
  const adScript = document.createElement('script');
  adScript.type = 'text/javascript';
  adScript.innerHTML = `
    atOptions = {
      'key' : '5a325ef4713d98f5a1c77c16db16924a',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    };
  `;
  const invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.src = '//www.topcreativeformat.com/5a325ef4713d98f5a1c77c16db16924a/invoke.js';
  
  adContainer.appendChild(adScript);
  adContainer.appendChild(invokeScript);
}

balls.forEach(ball => {
  ball.element.addEventListener('click', () => {
    if (!selectedBall) {
      selectedBall = ball;
      startMoving();
    } else {
      endContainer.style.display = 'flex';
      gameContainer.style.display = 'none';

      if (selectedBall === ball) {
        won.style.display = 'block';
        loss.style.display = 'none';
        btnRestart.style.display = 'none';
        
        setTimeout(()=>{
        btnNext.style.display = 'block';
        },3000)
      } else {
        won.style.display = 'none';
        loss.style.display = 'block';
        
        setTimeout(()=>{
        btnRestart.style.display = 'block';
        },3000)
        btnNext.style.display = 'none';
      }
      
      insertAd();
      selectedBall = null;
    }
  });
});

btnStart.addEventListener('click', () => {
  gameContainer.style.display = 'flex';
  startContainer.style.display = 'none';
  setInitialPositions();
});

btnRestart.addEventListener('click', () => {
  gameContainer.style.display = 'flex';
  endContainer.style.display = 'none';
  setInitialPositions();
  round = 1;
  time = 1000;
  roundContainer.innerHTML = `round-${round}`;
});

btnNext.addEventListener('click', () => {
  round++;
  time = round*1000;
  gameContainer.style.display = 'flex';
  endContainer.style.display = 'none';
  setInitialPositions();
  roundContainer.innerHTML = `round-${round}`;
});