var x0 = 200,
  y0 = 300; // position of the ship
var sx, sy; // bullets distance
var myShoot,
  shooted = false;
var where = 0; // 1 for options box & 2 for credits -- where in the menu
var ex = 80,
  ey = 15; // enemy position

$(document).ready(function() {

  $(".img1").hover(function() {
    $(".img1").attr("src", "sprite/play_buttons_pressed_blue.png");
  }, function() {
    $(".img1").attr("src", "sprite/play_buttons.png");
  });

  $(".img2").hover(function() {
    $(".img2").attr("src", "sprite/optionst_buttons_pressed.png");
  }, function() {
    $(".img2").attr("src", "sprite/optionst_buttons.png");
  });

  $(".img3").hover(function() {
    $(".img3").attr("src", "sprite/Creditst_buttons_pressed.png");
  }, function() {
    $(".img3").attr("src", "sprite/Creditst_buttons.png");
  });

  $(".exitBtn").hover(function() {
    $(".exitBtn").attr("src", "sprite/exit_buttons_pressed.png");
  }, function() {
    $(".exitBtn").attr("src", "sprite/exit_buttons.png");
  });

});

// travel the distance with ship
function addDistanceX(dis) {
  if ((x0 + dis) > 0 && (x0 + dis) < 390)
    x0 += dis;
}

function addDistanceY(dis) {
  if ((y0 + dis) > 0 && (y0 + dis) < 390)
    y0 += dis;
}

function drawShip() {
  if ((x0 > 0 && x0 < 390) && (y0 > 0 && y0 < 390)) {
    $("#myCanvas").clearCanvas();
    $("#myCanvas").drawImage({
      source: "sprite/alienship_new_2_try.png",
      x: x0, // initial 200
      y: y0, // initial 300
      width: 60,
      height: 70,
      fromCenter: false
    });
  }
}

function random() {
  ex = Math.floor(Math.random() * 390);
  ey = Math.floor(Math.random() * 390);
}

function drawEnemies() {
  $("#myCanvas").drawImage({
    source: "sprite/enemy_spaceship.png",
    x: ex,
    y: ey,
    width: 60,
    height: 70,
    fromCenter: false
  });
}

function newField() { //clear explosion
  drawShip();
  random();
  drawEnemies();
}

// if too close to the enemy then game over
function tooClose() {
  if ((x0 >= (ex - 30) && x0 <= (ex + 28)) && (y0 >= (ey - 30) && y0 <= (ey + 28))) {
    alert("You are too close to the enemy! Beware!");
    if (confirm("Try Again?"))
      play();
    else {
      where = 2;
      exit();
    }
  }
}

function check() {
  console.log(sx + " " + sy);
  if ((sx >= ex && sx <= (ex + 40)) && (sy >= (ey - 35) && sy <= ey)) {
    // bullets reach the enemy ship
    clearInterval(myShoot);
    drawShip();
    $("#myCanvas").drawImage({
      source: "sprite/explosion.png",
      x: ex,
      y: ey,
      width: 60,
      height: 70,
      fromCenter: false
    });
    setTimeout(newField, 200); // clear the explosion
    shooted = false;
  } else if (sy < 0 || sy > 390) {
    clearInterval(myShoot);
    drawShip();
    drawEnemies();
    shooted = false;
  }
}

function shoot() {
  drawShip();
  drawEnemies();
  $("#myCanvas").drawImage({
    source: "sprite/bullet_red.png",
    x: sx,
    y: sy,
    width: 20,
    height: 30,
    fromCenter: false
  });

  sy -= 35;
  check();
}

function credits() {
  where = 2;
  $(".menu").addClass("hide");
  $("#myCanvas").drawText({
    fillStyle: "#0000ff",
    strokeStyle: "#E5E5FF",
    strokeWidth: 2,
    x: 125,
    y: 150,
    fontSize: 16,
    fontFamily: "Times New Roman, sans-serif",
    text: "Art Created By UnLuckY Studio ",
    fromCenter: false,
    maxWidth: 250,
  });
  $(".exitBtn").show();
}

// move function
function action(event) {
  switch (event.keyCode) {
    case 56:
      {
        //up
        addDistanceY(-4);
        drawShip();
        drawEnemies();
        break;
      }
    case 52:
      {
        //left
        addDistanceX(-4);
        drawShip();
        drawEnemies();
        break;
      }
    case 54:
      {
        //right
        addDistanceX(4);
        drawShip();
        drawEnemies();
        break;
      }
    case 50:
      {
        // down
        addDistanceY(4);
        drawShip();
        drawEnemies();
        break;
      }
    case 32:
      {
        if (shooted === false) {
          sx = x0 + 19;
          sy = y0 - 15;
          myShoot = setInterval(shoot, 200);
          shooted = true;
        } else alert("You can shoot only once!\nWait for the bullet to get out of scope!");
        break;
      }
  }

  tooClose(); // alert too close to the enemy
}

function play() {
  $(".menu").addClass("hide");
  $("body").on("keypress", action);
  drawShip();
  random();
  drawEnemies();
}

function options() {
  where = 1;
  $(".menu").addClass("hide");
  $(".optionBox").css("display", "flex");
  $(".exitBtn").show();
}

function exit() {
  $(".exitBtn").hide();
  if (where === 2)
    $("#myCanvas").clearCanvas();
  else if (where === 1)
    $(".optionBox").css("display", "none");
  $(".menu").removeClass("hide");
}