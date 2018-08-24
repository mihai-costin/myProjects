var play = false; // bool variable to know when to stop the myvar interval
var dx = 100,
  dy = 100; // where to draw the snake (which is represented as a rectangular)
var mx = 4,
  my = 0; // how many px to move the snake
var myvar, rdnx, rdny, speed = 100; // rdnx , rdny -- random generated points for the point position that needs to be catch
// speed -- the time for setInterval
var score = 0,
  swidth = 50; // var for score and swidth for the width of the snake that will increase with score
var angle = 270,
  ang = 0,
  wid = 0,
  tempwidth = swidth;

function moveSnake() {
  var $myCanvas = $("#myCanvas");
  $myCanvas.clearCanvas(); // clear the canvas
  $myCanvas.drawVector({
    strokeStyle: "Black",
    strokeWidth: 4,
    x: dx,
    y: dy,
    a1: angle,
    l1: swidth,
    a2: ang,
    l2: wid,
    startArrow: true,
    arrowRadius: 15
  }); // draw the snake
  $myCanvas.drawArc({
    fillStyle: "Grey",
    strokeStyle: "black",
    strokeWidth: 2,
    x: rdnx,
    y: rdny,
    radius: 5
  }); // draw the point that needs to be catch by the snake
  // check if the limits of the canvas are not passed
  if (dx < 0 || dx > 450)
    mx = -mx;
  if (dy < 0 || dy > 450)
    my = -my;

  dx += mx; // move
  dy += my;
  if (swidth != tempwidth) {
    swidth += 10;
    wid -= 10;
  }
  point(); // check if another point needs to be draw
  // if the current point was catch
}

function draw() {
  if (play === false) {
    play = true; // able to play if the play/pause button was pressed
    // controls for the snake
    $("body").on("keypress", function(event) {
      switch (event.keyCode) {
        case 56: // up direction
          {
            mx = 0;
            my = -4;
            ang = angle;
            angle = 180;
            wid = tempwidth;
            swidth = 0;
            break;
          }
        case 52: // left direction
          {
            mx = -4;
            my = 0;
            ang = angle;
            angle = 90;
            wid = tempwidth;
            swidth = 0;
            break;
          }
        case 54: // right direction
          {
            mx = 4;
            my = 0;
            ang = angle;
            angle = 270;
            wid = tempwidth;
            swidth = 0;
            break;
          }
        case 50: // down direction
          {
            mx = 0;
            my = 4;
            ang = angle;
            angle = 360;
            wid = tempwidth;
            swidth = 0;
            break;
          }
      }
    });
    randomize(); // randomize rdnx rdny the values where the point needs to be draw
    myvar = setInterval(moveSnake, speed); // start the game

  } else {
    play = false;
    $("body").off("keypress"); // disable the controls
    clearInterval(myvar); // stop the game
  }
}

function help() {
  $(".helpBox").toggle(); // hide & show the help box
}

function randomize() { // randomize the position of the point that needs to be catch
  rdnx = Math.floor(Math.random() * 450);
  rdny = Math.floor(Math.random() * 450);
}

function point() {
  // in this function we check to see if the point was catch
  // if we reach near the point
  if ((dx <= rdnx + 10 && dx >= rdnx - 10) && (dy >= rdny - 10 && dy <= rdny + 10)) {
    if (score % 10 === 0) {
      swidth += 20; // increase size of snake if score is a multiple of 10
      tempwidth = swidth;
    }
    if (speed > 10) { // increase speed
      speed--;
      clearInterval(myvar);
      myvar = setInterval(moveSnake, speed);
    }
    score++; // up the score
    randomize(); // new point values
    $(".scoreBox").html("Score: " + score); // display the score
  }
}