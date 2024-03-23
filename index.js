const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1366;
canvas.height = 768;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
  scale: 1.34,
});

const shop = new Sprite({
  position: {
    x: 850,
    y: 195,
  },
  imageSrc: "./img/shop.png",
  scale: 3.5,
  framesMax: 6,
});

player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: { x: 0, y: 0 },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 3,
  offset: {
    x: 215,
    y: 210,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: { x: 140, y: 20 },
    width: 200,
    height: 50,
  },
  hitBox: {
    offset: { x: 50, y: 20 },
    width: 70,
    height: 135,
  },
});

enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: { x: 0, y: 0 },
  scale: 3,
  offset: {
    x: 215,
    y: 229,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: { x: -155, y: 40 },
    width: 200,
    height: 50,
  },
  hitBox: {
    offset: { x: 50, y: 0 },
    width: 55,
    height: 155,
  },
});

const key = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);

  background.update();
  shop.update();

  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (key.a.pressed && player.lastKey == "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (key.d.pressed && player.lastKey == "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  if (key.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (key.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  if (player.isAttacking && player.framesCurrent == 4) {
    player.isAttacking = false;
    if (isColliding({ attackBox: player.attackBox, hitBox: enemy.hitBox })) {
      enemy.takeHit();
      gsap.to("#enemyHealth", { width: enemy.health + "%" });
    }
  }

  if (enemy.isAttacking && enemy.framesCurrent == 1) {
    enemy.isAttacking = false;
    if (isColliding({ attackBox: enemy.attackBox, hitBox: player.hitBox })) {
      player.takeHit();
      gsap.to("#playerHealth", { width: player.health + "%" });
    }
  }

  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        key.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        key.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.jump();
        break;
      case "s":
        if (player.isAttacking == false) {
          player.attack();
        }
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowLeft":
        key.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowRight":
        key.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowUp":
        enemy.jump();
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      key.d.pressed = false;
      break;
    case "a":
      key.a.pressed = false;
      break;
    case "ArrowLeft":
      key.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      key.ArrowRight.pressed = false;
      break;
  }
});
