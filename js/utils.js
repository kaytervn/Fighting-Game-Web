function isColliding({ attackBox, hitBox }) {
  return !(
    attackBox.position.x + attackBox.width < hitBox.position.x ||
    hitBox.position.x + hitBox.width < attackBox.position.x ||
    attackBox.position.y + attackBox.height < hitBox.position.y ||
    hitBox.position.y + hitBox.height < attackBox.position.y
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.getElementById("displayText").style.display = "flex";
  if (player.health == enemy.health) {
    document.getElementById("displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.getElementById("displayText").innerHTML = "Player 1 Wins";
  } else {
    document.getElementById("displayText").innerHTML = "Player 2 Wins";
  }
}

let timer = 60;
let timerId;

function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.getElementById("timer").innerHTML = timer;
  }

  if (timer == 0) {
    determineWinner({ player, enemy, timerId });
  }
}
