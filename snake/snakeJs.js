var play = false; // bool variable to know when to stop the myvar interval
var dx = 100,
  dy = 100; // where to draw the snake
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
// angle -- the angle at which the vector is draw
// ang and wid are used when the direction is change --  for creating the effect of a snake
// tempwidth -- keeps the actual width of the snake

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
  }); // draw the snake using a vector
  $myCanvas.drawArc({
    fillStyle: "Grey",
    strokeStyle: "black",
    strokeWidth: 2,
    x: rdnx,
    y: rdny,
    radius: 5
  }); // draw the point that needs to be catch by the snake
  // check if the limits of the canvas are passed
  if (dx < 0 || dx > $myCanvas.width())
    mx = -mx; // push back the snake
  if (dy < 0 || dy > $myCanvas.height())
    my = -my;

  dx += mx; // move
  dy += my;

  // if a change in direction happens
  // swidth increase in the new direction
  // while wid is the old position that will decrease
  if (swidth != tempwidth) {
    swidth += 10;
    wid -= 10;
  }
  point(); // check if another point needs to be draw
  // if the current point was catch
}

// function the update the values when a change in direction happens
function change(x, y, a1, a2, l1, l2) {
  mx = x;
  my = y;
  ang = a1; // old angle
  angle = a2; //  new angle
  wid = l1; // width in the old position
  swidth = l2; // width that will increase in the new position
}

function draw() {
  if (play === false) {
    play = true; // able to play if the play/pause button was pressed
    // controls for the snake
    $("body").on("keypress", function(event) {
      switch (event.keyCode) {
        case 56: case 119: // up direction
          {
            change(0, -4, angle, 180, tempwidth, 0);
            break;
          }
        case 52: case 97: // left direction
          {
            change(-4, 0, angle, 90, tempwidth, 0);
            break;
          }
        case 54: case 100: // right direction
          {
            change(4, 0, angle, 270, tempwidth, 0);
            break;
          }
        case 50: case 115:// down direction
          {
            change(0, 4, angle, 360, tempwidth, 0);
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

function randomize() { // randomize the position of the point that needs to be catch
  var $myCanvas = $("#myCanvas");
  rdnx = Math.floor(Math.random() * $myCanvas.width());
  rdny = Math.floor(Math.random() * $myCanvas.height());
}

function point() {
  // in this function we check to see if the point was catch
  // if we reach near the point then catch it
  if ((dx <= rdnx + 10 && dx >= rdnx - 10) && (dy >= rdny - 10 && dy <= rdny + 10)) {
    if (score % 10 === 0) {
      tempwidth += 20; // increase size of snake if score is a multiple of 10
      // added to tempwidth not to enter in conflict when swdith change value 
      //when a change in direction happens
      swidth = tempwidth; // the new width
      if (wid > 0) wid = 0; // delete the old width
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
