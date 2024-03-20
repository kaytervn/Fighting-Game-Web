const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

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

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.isOnGround = true;
    this.canDoubleJump = false;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    if (
      this.position.x + this.velocity.x >= 0 &&
      this.position.x + this.width + this.velocity.x <= canvas.width
    ) {
      this.position.x += this.velocity.x;
    }
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.isOnGround = true;
    } else {
      this.velocity.y += gravity;
    }
  }

  jump() {
    if (this.isOnGround) {
      this.isOnGround = false;
      this.canDoubleJump = true;
      this.velocity.y = -15;
    } else if (this.canDoubleJump) {
      this.canDoubleJump = false;
      this.velocity.y = -15;
    }
  }
}

player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: { x: 0, y: 0 },
});

enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: { x: 0, y: 0 },
});

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (key.a.pressed && player.lastKey == "a") {
    player.velocity.x = -5;
  } else if (key.d.pressed && player.lastKey == "d") {
    player.velocity.x = 5;
  }

  if (key.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (key.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = 5;
  }
}

animate();

window.addEventListener("keydown", (event) => {
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
