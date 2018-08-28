var imagini = ["imagini/img1.jpg", "imagini/img2.jpg", "imagini/img3.jpg"];
var i = 0,
    j = 0,
    k = 0,
    myvar, bool = true;
var dx = 4,
    dy = 4,
    mx = 0,
    my = 150;
var def = 20,
    col = "green";
var audio = ["audio/formula1.mp3", "audio/racecar.mp3"],
    video = ["video/UsainBolt.webm", "video/UsainBolt_958.mp4"];

$(document).ready(() => {
    $('.menuButton').click(() => {
        $('.menuButton').toggleClass('buttonActive');
        $('.navMenu').fadeToggle(1000);
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

function show() {
    $("#spinner").css("display", "none");
    $(".hide").css("display", "block");
}

function desen() {
    $myCanvas = $("#myCanvas");
    $myCanvas.clearCanvas();
    $myCanvas.drawArc({
        fillStyle: col,
        x: mx,
        y: my,
        radius: def
    });

    // depasire limite rectangular
    if (mx < 0 || mx > 600)
        dx = -dx; // negativ
    if (my < 0 || my > 600)
        dy = -dy;
    mx += dx;
    my += dy;
}

function prevAudio() {
    j = (j <= 0) ? audio.length - 1 : j - 1;
    $("#ad").attr("src", audio[j]);
}

function nextAudio() {
    j = (j === audio.length - 1) ? 0 : j + 1;
    $("#ad").attr("src", audio[j]);
}

function nextVideo() {
    k = (k === video.length - 1) ? 0 : k + 1;
    if (k === 1) $("#vd").attr("type", "video/mp4");
    else $("#vd").attr("type", "video/webm");
    $("#vd").attr("src", video[k]);
    $("#pp").html("play");
    $("#bar").css("width", "0px");
}

function prevVideo() {
    k = (k <= 0) ? video.length - 1 : k - 1;
    if (y === 1) $("#vd").attr("type", "video/mp4");
    else $("#vd").attr("type", "video/webm");
    $("#vd").attr("src", video[k])
    document.getElementById("vd").src = video[y];
    $("#pp").html("play");
    $("#bar").css("width", "0px");
    //reload progress bar -- just in case    
}
