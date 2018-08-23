var play = false;
var dx = 100, dy = 100;
var mx = 4, my = 0;
var myvar, rdnx, rdny;
var score = 0, swidth = 50;

function moveSnake(){
  var $myCanvas = $("#myCanvas");
  $myCanvas.clearCanvas();
  $myCanvas.drawRect({
    fillStyle: "Black",
    x: dx, y: dy,
    fromCenter: false,
    width: swidth,
    height: 10
  });
  $myCanvas.drawArc({
    fillStyle: "Grey",
    strokeStyle: "black",
    strokeWidth: 2,
    x: rdnx, y: rdny,
    radius: 5 
  });
  if(dx<0 || dx >400)
    mx = -mx;
  if(dy<0 || dy>450)
    my = -my;
  
  dx += mx;
  dy += my;
  point();
}

function draw() {

if(play === false) {
  $(".scoreBox").show();
  play = true;
  $("body").on("keypress",function(event){
   //if(dx>0 && dx<600 && dy>0 && dy<600)
    switch (event.keyCode) {
      case 56: {
        mx = 0;
        my = -4;
        break;
      }
      case 52: {
        mx = -4;
        my = 0;
        break;
      }
      case 54: {
        mx = 4;
        my = 0;
        break;
      }
      case 50: {
        mx = 0;
        my = 4;
        break;
      }      
    }
  });
 randomize();
 myvar = setInterval(moveSnake,100);
 
}
  else {
    play = false;
    $(".scoreBox").hide();
    $("body").off("keypress");
    clearInterval(myvar);
  }
}

function help() {
  $(".helpBox").toggle();
}

function randomize(){
  rdnx = Math.floor(Math.random()*450);
  rdny = Math.floor(Math.random()*450);
}

function point(){
  if((dx<= rdnx+10 && dx>=rdnx-10) && (dy >= rdny-50 && dy<=rdny+50))
    {
      score++;
      randomize();
      $(".scoreBox").html("Score: " + score);
    }
}