function draw() {
  var $myCanvas = $("#myCanvas");

  $myCanvas.drawRect({
    fillStyle: "black",
    strokeStyle: "grey",
    strokeWidth: 4,
    x: 100,
    y: 100,
    fromCenter: false,
    width: 50,
    height: 10
  });
}

// 56. 52. 54. 50
function help() {
  $(".helpBox").toggle();
}