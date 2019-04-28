var imagini = ["imagini/img1.jpg", "imagini/img2.jpg", "imagini/img3.jpg"];
var i = 0,
  j = 0,
  k = 0,
  myvar, bool = true;
var dx = 4, //distanta parcursa pe x
  dy = 4, //distanta parcursa pe y
  mx = 0,
  my = 150;
var def = 20, // radius
  col = "green"; // culoare cerc
var audio = ["audio/formula1.mp3", "audio/racecar.mp3"],
  video = ["video/UsainBolt.webm", "video/UsainBolt_958.mp4"];
var upBar;

// control pt meniu
$(document).ready(() => {
  $(".menuButton").click(() => {
    $(".menuButton").toggleClass("buttonActive");
    $(".navMenu").fadeToggle(500);
  });
});

// schimbare imagine
function nextImage() {

  i = (i === imagini.length - 1) ? 0 : i + 1;
  $("#img").attr("src", imagini[i]);
}

function previousImage() {

  i = (i <= 0) ? imagini.length - 1 : i - 1;
  $("#img").attr("src", imagini[i]);
}

// pentru spinner/loader
function show() {
  $("#spinner").css("display", "none");
  $(".hide").css("display", "block");
}

//desenare cerc
function desen() {
  $myCanvas = $("#myCanvas");
  $myCanvas.clearCanvas();
  $myCanvas.drawArc({
    fillStyle: col,
    x: mx,
    y: my,
    radius: def
  });

  // depasire limite canvas
  if (mx < 0 || mx > 600)
    dx = -dx; // negativ
  if (my < 0 || my > 600)
    dy = -dy;
  mx += dx;
  my += dy;
}

// audio change
function prevAudio() {
  j = (j <= 0) ? audio.length - 1 : j - 1;
  $("#ad").attr("src", audio[j]);
  $("#ad").attr("type", "audio/mpeg");
}

function nextAudio() {
  j = (j === audio.length - 1) ? 0 : j + 1;
  $("#ad").attr("src", audio[j]);
  $("#ad").attr("type", "audio/mpeg");
}

// video change
function nextVideo() {
  k = (k === video.length - 1) ? 0 : k + 1;
  if (k === 1) $("#vd").attr("type", "video/mp4");
  else $("#vd").attr("type", "video/webm");
  $("#vd").attr("src", video[k]);
  $("#pp").html("Play");
  $("#bar").css("width", "0px");
}

function prevVideo() {
  k = (k <= 0) ? video.length - 1 : k - 1;
  if (k === 1) $("#vd").attr("type", "video/mp4");
  else $("#vd").attr("type", "video/webm");
  $("#vd").attr("src", video[k])
  $("#pp").html("Play");
  $("#bar").css("width", "0px");
  //reload progress bar -- just in case    
}

// play/pause event pentru video
function playPause() {
  if ($("#vd").get(0).paused) {
    $("#vd").get(0).play();
    $("#pp").html("Pause");
    clearInterval(myvar);
    upBar = setInterval(updateBar, 500);
  } else {
    $("#vd").get(0).pause();
    $("#pp").html("Play");
    window.clearInterval(upBar);
  }
}

function Volume() {
  var vol = $("#vd").get(0).volume;
  if (vol === 1.0) {
    $("#vd").prop("volume", 0.0);
    $("#mm").html("Unmute");
  } else {
    $("#vd").prop("volume", 1.0);
    $("#mm").html("Mute");
  }
}

function updateBar() {
  var mp = document.getElementById("vd");
  if (!mp.ended) {
    var size = parseInt(mp.currentTime * 600 / mp.duration); // dimensiunea barei
    $("#bar").css("width", size + "px");
  } else {
    $("#bar").css("width", "0px"); // 'reload' bar
    $("#pp").html("play");
    window.clearInterval(upBar);
  }
}

function operations(mp, e) {
  var pos = e.pageX - document.getElementById("bar").offsetLeft;
  var timp = pos * mp.duration / 600; // timpul de unde trebuie sa ruleze
  mp.currentTime = timp; // setare timpul ales
  $("#bar").css("width", pos + "px"); // update progress bar
}

// pentru onclick event
function changeBar(event) {
  var mp = document.getElementById("vd");
  if (!mp.paused && !mp.ended && mp.readyState > 2 && mp.currentTime > 0) {
    operations(mp, event);
  } else {
    playPause();
    operations(mp, event);
  }
}
