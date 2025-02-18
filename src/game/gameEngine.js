import * as Sentry from '@sentry/browser';

export function initGame(canvas, birdColor) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const gravity = 0.5;
  const flapStrength = -8;
  const pipeSpeed = 2;
  const pipeWidth = 50;
  const pipeGap = 150;
  const pipeInterval = 90;

  let gameData = {
    bird: { x: 50, y: canvasHeight / 2, size: 20, velocity: 0 },
    pipes: [],
    frame: 0,
    score: 0,
    gameOver: false,
    highScoreSet: false,
  };

  const flapSound = new Audio('/sounds/flap.mp3');
  const crashSound = new Audio('/sounds/crash.mp3');
  const pointSound = new Audio('/sounds/point.mp3');

  function resetGame() {
    gameData = {
      bird: { x: 50, y: canvasHeight / 2, size: 20, velocity: 0 },
      pipes: [],
      frame: 0,
      score: 0,
      gameOver: false,
      highScoreSet: false,
    };
    console.log("Game restarted");
  }

  function handleFlap() {
    if (gameData.gameOver) {
      resetGame();
    } else {
      gameData.bird.velocity = flapStrength;
      try {
        flapSound.currentTime = 0;
        flapSound.play();
      } catch (error) {
        console.error('Error playing flap sound:', error);
        Sentry.captureException(error);
      }
    }
  }

  function update() {
    gameData.frame++;
    gameData.bird.velocity += gravity;
    gameData.bird.y += gameData.bird.velocity;

    if (gameData.frame % pipeInterval === 0) {
      const gapY = Math.random() * (canvasHeight - pipeGap - 40) + 20;
      gameData.pipes.push({ x: canvasWidth, gapY });
    }
    gameData.pipes.forEach(pipe => {
      pipe.x -= pipeSpeed;
    });
    gameData.pipes = gameData.pipes.filter(pipe => pipe.x + pipeWidth > 0);

    const bird = gameData.bird;
    if (bird.y + bird.size > canvasHeight || bird.y < 0) {
      gameData.gameOver = true;
    }
    gameData.pipes.forEach(pipe => {
      if (
        bird.x + bird.size > pipe.x &&
        bird.x < pipe.x + pipeWidth
      ) {
        if (bird.y < pipe.gapY || bird.y + bird.size > pipe.gapY + pipeGap) {
          gameData.gameOver = true;
        }
      }
      if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
        gameData.score++;
        pipe.scored = true;
        try {
          pointSound.currentTime = 0;
          pointSound.play();
        } catch (error) {
          console.error('Error playing point sound:', error);
          Sentry.captureException(error);
        }
      }
    });

    if (gameData.gameOver && !gameData.highScoreSet) {
      let storedHighScore = Number(localStorage.getItem('flappyBirdHighScore')) || 0;
      if (gameData.score > storedHighScore) {
        localStorage.setItem('flappyBirdHighScore', gameData.score);
      }
      gameData.highScoreSet = true;
    }

    if (gameData.gameOver) {
      try {
        crashSound.play();
      } catch (error) {
        console.error('Error playing crash sound:', error);
        Sentry.captureException(error);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#0f0";
    gameData.pipes.forEach(pipe => {
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapY);
      ctx.fillRect(pipe.x, pipe.gapY + pipeGap, pipeWidth, canvasHeight - pipe.gapY - pipeGap);
    });
    ctx.fillStyle = birdColor;
    ctx.fillRect(gameData.bird.x, gameData.bird.y, gameData.bird.size, gameData.bird.size);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${gameData.score}`, 10, 25);
    if (gameData.gameOver) {
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText("Game Over! Tap to Restart", 20, canvasHeight / 2);
      const highScore = localStorage.getItem('flappyBirdHighScore') || 0;
      ctx.fillText(`High Score: ${highScore}`, 10, 50);
    }
  }

  let requestId;

  function gameLoop() {
    try {
      if (!gameData.gameOver) {
        update();
      }
      draw();
      requestId = requestAnimationFrame(gameLoop);
    } catch (error) {
      console.error('Error in game loop:', error);
      Sentry.captureException(error);
    }
  }

  console.log("Game initialized");
  requestId = requestAnimationFrame(gameLoop);

  const handleUserInput = (e) => {
    e.preventDefault();
    handleFlap();
  };
  canvas.addEventListener('mousedown', handleUserInput);
  canvas.addEventListener('touchstart', handleUserInput);

  return function cleanup() {
    cancelAnimationFrame(requestId);
    canvas.removeEventListener('mousedown', handleUserInput);
    canvas.removeEventListener('touchstart', handleUserInput);
  };
}