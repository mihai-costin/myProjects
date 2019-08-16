// position of the ball
var x = 95,
    y = 50,
    r = 20;

// position of the player
var px = 300,
    py = 480;

// speed of the ball
var dx = 2,
    dy = 2;

// init color, score
var upTime, fillColor = "#8B0000",
    score = 0,
    hiScore = 0;

$(document).ready(() => {
    $('#btn').click(() => {
        $('#btn').toggleClass('hide');
        $('.reset').on('click', reset);
        $('#myCanvas').on('mousemove', function (e) {
            let $myCanvas = $('#myCanvas')[0];
            if (e.clientX > 0 && e.clientX < $myCanvas.width)
                px = e.clientX;
        });

        upTime = setInterval(update, 10);
    });

    $('.colorChg').on('click', function () {
        fillColor = $('#color').val();
    });
});


// update with every frame
function update() {
    var $myCanvas = $('#myCanvas')[0];
    var ctx = $myCanvas.getContext('2d');
    ctx.clearRect(0, 0, $myCanvas.width, $myCanvas.height);

    // draw ball
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();

    // collide with edges
    if (x < 0 || x > $myCanvas.width)
        dx = -dx; // negativ
    if (y < 0 || y > $myCanvas.height)
        dy = -dy;

    x += dx;
    y += dy;

    // draw player
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.fillRect(px, py, 100, 15);

    // check collision
    if (y === py - 30) {
        if (x >= px - 30 && x <= px + 130) {
            dy = -dy;
            y += dy;

            // update score
            score++;
            document.getElementsByClassName("scoreBox")[0].innerHTML = "Score:" + score;
        } else {
            alert("Game Over");
            clearInterval(upTime);
        }
    }
}

// change position on button hit
function change(pos) {
    let $myCanvas = $('#myCanvas')[0];
    if (pos === 1 && px > 0)
        px -= 100;
    else if (pos === 0 && px < $myCanvas.width)
        px += 100;
}

function reset() {
    clearInterval(upTime);

    // init values
    px = 300;
    py = 480;

    x = 95;
    y = 50;
    r = 20;

    if (score > hiScore) {
        document.getElementsByClassName("scoreBox")[1].innerHTML = "HI-Score:" + score;
        hiScore = score;
    }

    // change score
    score = 0;
    document.getElementsByClassName("scoreBox")[0].innerHTML = "Score:" + score;

    upTime = setInterval(update, 10);
}
