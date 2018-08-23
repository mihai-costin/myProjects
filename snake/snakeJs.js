var play = false;
var dx = 100, dy = 100;
var mx = 4, my = 0;
var myvar;

function moveSnake(){
  var $myCanvas = $("#myCanvas");
  $myCanvas.drawRect({
    fillStyle: "Black",
    x: dx, y: dy,
    fromCenter: false,
    width: 50,
    height: 10
  });
  $myCanvas.drawArc({
    fillStyle: "Grey",
    strokeStyle: "black",
    strokeWidth: 2,
    x: 100, y: 50,
    radius: 5
  });
  $myCanvas.clearCanvas();
  if(dx<0 || dx >600)
    mx = -mx;
  if(dy<0 || dy>600)
    my = -my;
  
  dx += mx;
  dy += my;
}

function draw() {

if(play === false) {
  play = true;
  $("body").on("keypress",function(event){
   if(dx>0 && dx<600 && dy>0 && dy<600)
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
 myvar = setInterval(moveSnake,100);
 
}
  else {
    play = false;
    $("body").off("keypress");
    clearInterval(myvar);
  }
}

function help() {
  $(".helpBox").toggle();
}