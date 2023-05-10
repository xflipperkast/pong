let gameState = 'start';
const SETTINGS = {
  ballSpeed: 2.3,
  paddleSpeed: 0.06
};

const DOM_ELEMENTS = {
  paddles: {
    paddle_1: document.querySelector('.paddle_1'),
    paddle_2: document.querySelector('.paddle_2'),
  },
  board: document.querySelector('.board'),
  ball: document.querySelector('.ball'),
  scores: {
    score_1: document.querySelector('.player_1_score'),
    score_2: document.querySelector('.player_2_score'),
  },
  message: document.querySelector('.message'),
};

const COORDINATES = {
  paddle_1: DOM_ELEMENTS.paddles.paddle_1.getBoundingClientRect(),
  paddle_2: DOM_ELEMENTS.paddles.paddle_2.getBoundingClientRect(),
  initial_ball: DOM_ELEMENTS.ball.getBoundingClientRect(),
  board: DOM_ELEMENTS.board.getBoundingClientRect(),
  paddle_common: document.querySelector('.paddle').getBoundingClientRect(),
};

let ball_coord = COORDINATES.initial_ball;
let { dx, dy, dxd, dyd } = generateRandomDirection();

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'Enter':
      toggleGameState();
      break;
    case 'w':
    case 's':
      movePaddle('paddle_1', e.key);
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      movePaddle('paddle_2', e.key);
      break;
  }
});

function generateRandomDirection() {
  return {
    dx: Math.floor(Math.random() * SETTINGS.ballSpeed) + SETTINGS.ballSpeed,
    dy: Math.floor(Math.random() * SETTINGS.ballSpeed) + SETTINGS.ballSpeed,
    dxd: Math.floor(Math.random() * 2),
    dyd: Math.floor(Math.random() * 2),
  };
}

function toggleGameState() {
  gameState = gameState == 'start' ? 'play' : 'start';
  if (gameState === 'play') {
    startGame();
  }
}

function startGame() {
  DOM_ELEMENTS.message.innerHTML = 'Game Started';
  DOM_ELEMENTS.message.style.left = '42vw';
  requestAnimationFrame(() => {
    let { dx, dy, dxd, dyd } = generateRandomDirection();
    moveBall(dx, dy, dxd, dyd);
  });
}

function movePaddle(paddle, direction) {
  if (gameState !== 'play') return;

  const DIRECTION_MAP = {
    'w': -SETTINGS.paddleSpeed,
    's': SETTINGS.paddleSpeed,
    'ArrowUp': -SETTINGS.paddleSpeed,
    'ArrowDown': SETTINGS.paddleSpeed,
  };
  const move = DIRECTION_MAP[direction] * window.innerHeight;
  const minTop = COORDINATES.board.top;
  const maxTop = COORDINATES.board.bottom - COORDINATES.paddle_common.height;

  let newTop = Math.max(minTop, Math.min(maxTop, COORDINATES[paddle].top + move));

  DOM_ELEMENTS.paddles[paddle].style.top = newTop + 'px';
  COORDINATES[paddle] = DOM_ELEMENTS.paddles[paddle].getBoundingClientRect();
}

function moveBall(dx, dy, dxd, dyd) {
    if (ball_coord.top <= COORDINATES.board.top) {
      dyd = 1;
    }
    if (ball_coord.bottom >= COORDINATES.board.bottom) {
      dyd = 0;
    }
    if (
      ball_coord.left <= COORDINATES.paddle_1.right &&
      ball_coord.top >= COORDINATES.paddle_1.top &&
      ball_coord.bottom <= COORDINATES.paddle_1.bottom
    ) {
      dxd = 1;
      let randomDirection = generateRandomDirection();
      dx = randomDirection.dx;
      dy = randomDirection.dy;
    }
    if (
      ball_coord.right >= COORDINATES.paddle_2.left &&
      ball_coord.top >= COORDINATES.paddle_2.top &&
      ball_coord.bottom <= COORDINATES.paddle_2.bottom
    ) {
      dxd = 0;
      let randomDirection = generateRandomDirection();
      dx = randomDirection.dx;
      dy = randomDirection.dy;
    }
    if (
      ball_coord.left <= COORDINATES.board.left ||
      ball_coord.right >= COORDINATES.board.right
    ) {
      if (ball_coord.left <= COORDINATES.board.left) {
        DOM_ELEMENTS.scores.score_2.innerHTML = +DOM_ELEMENTS.scores.score_2.innerHTML + 1;
      } else {
        DOM_ELEMENTS.scores.score_1.innerHTML = +DOM_ELEMENTS.scores.score_1.innerHTML + 1;
      }
      gameState = 'start';
      ball_coord = COORDINATES.initial_ball;
      DOM_ELEMENTS.ball.style = DOM_ELEMENTS.ball.style;
      DOM_ELEMENTS.message.innerHTML = 'Press Enter to Play Pong';
      DOM_ELEMENTS.message.style.left = '38vw';
      return;
    }
    DOM_ELEMENTS.ball.style.top = ball_coord.top + dy * (dyd == 0 ? -1 : 1) + 'px';
    DOM_ELEMENTS.ball.style.left = ball_coord.left + dx * (dxd == 0 ? -1 : 1) + 'px';
    ball_coord = DOM_ELEMENTS.ball.getBoundingClientRect();
    requestAnimationFrame(() => {
      moveBall(dx, dy, dxd, dyd);
    });
  }
  
