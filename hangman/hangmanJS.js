var count = 0,
    win = 0; // count for mistakes, win for matching letters
var obj = [
    {
        guess: "red",
        hint: "color"
    },
    {
        guess: "europe",
        hint: "continent"
     }, {
        guess: "mistake",
        hint: "when get a letter wrong"

     }, {
        guess: "hangman",
        hint: "a game"
     }, {
        guess: "meteor",
        hint: "from cosmos"
     }, {
        guess: "saint petersburg",
        hint: "city from russia"
     }, {
        guess: "red blue",
        hint: "colors"
     }, {
        guess: "football",
        hint: "sport"
     }, {
        guess: "mathematics",
        hint: "some people hate it"
     }, {
        guess: "argentina",
        hint: "country"
     }, {
        guess: "no more",
        hint: "when you had enough"
     }, {
        guess: "lichtenstein",
        hint: "country from europe"
     }, {
        guess: "try again",
        hint: "when you have done a mistake"
     }, {
        guess: "cristiano ronaldo",
        hint: "athlete"
     }, {
        guess: "farctate",
        hint: "opposite to hollow"
    }];
// an array of objects which contains the words for guessing and a hint
var rdn, choice, play = false,
    size;
var verify = []; // binary array to verify if a letter was already pressed

// draw the hang structure
function draw() {
    var myCanvas = document.getElementById("myCanvas");
    var ctx = myCanvas.getContext("2d");
    ctx.clearRect(0, 0, 200, 300);
    ctx.beginPath();
    ctx.moveTo(25, 50);
    ctx.lineTo(25, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(25, 50);
    ctx.lineTo(100, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(25, 200);
    ctx.lineTo(40, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(25, 200);
    ctx.lineTo(-30, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(100, 70);
    ctx.stroke();
}

// draw the mistake inside myCanvas  
function mistake(ctx) {
    count++;

    switch (count) {

        case 1:
            {
                ctx.beginPath();
                ctx.arc(100, 90, 20, 0, Math.PI * 2);
                ctx.stroke();
                break;
            }
        case 2:
            {
                ctx.beginPath();
                ctx.moveTo(100, 110);
                ctx.lineTo(100, 200);
                ctx.stroke();
                break;
            }
        case 3:
            {
                ctx.beginPath();
                ctx.moveTo(100, 140);
                ctx.lineTo(120, 170);
                ctx.stroke();
                break;
            }
        case 4:
            {
                ctx.beginPath();
                ctx.moveTo(100, 140);
                ctx.lineTo(80, 170);
                ctx.stroke();
                break;
            }
        case 5:
            {
                ctx.beginPath();
                ctx.moveTo(100, 200);
                ctx.lineTo(120, 240);
                ctx.stroke();
                break;
            }
        case 6:
            {
                ctx.beginPath();
                ctx.moveTo(100, 200);
                ctx.lineTo(80, 240);
                ctx.stroke();
                alert("Game Over!");
                play = false; // disabled the input when the user has lost
                document.getElementsByTagName("body")[0].removeEventListener("keypress", keyPressed);
                break;
            }
    }

}

// draw underlines inside canvas text
function underLine(ctx2, x) {
    ctx2.beginPath();
    ctx2.moveTo(x - 15, 75);
    ctx2.lineTo(x + 30, 75);
    ctx2.stroke();
}

// called when a new game is created
function newGame() {
    draw(); //structure
    count = 0; // mistakes
    win = 0; // matched letters
    play = true; // able to play
    document.getElementsByTagName("body")[0].addEventListener("keypress", keyPressed);
    rdn = Math.floor(Math.random() * obj.length); // randomize a number in the range of the object length
    choice = obj[rdn].guess; // get the random string
    document.getElementById("hitted").innerHTML = "Pressed letters:<br/>";
    var myCanvas2 = document.getElementById("text");
    var ctx2 = myCanvas2.getContext("2d");
    var hit = document.getElementById("hint");
    hit.innerHTML = "";
    ctx2.clearRect(0, 0, 1000, 100); // clear canvas for drawing

    for (var j = 0; j < 25; j++)
        verify[j] = 0;

    var x = 30;
    size = choice.length; // numbers of letter needed to be matched for winning the game
    for (var i = 0; i < choice.length; i++) {
        if (choice[i] != " ")
            underLine(ctx2, x); // draw underline inside canvas text
        else size--; // a space does not need to be guessed

        x += 50;
    }
}

// display a hint from the object
function getHint() {
    var hit = document.getElementById("hint");
    hit.innerHTML = "A simple hint: " + "<br/>" + obj[rdn].hint;
}

// check the input
function check(clicked) {
    var bool = 0,
        x = 30;
    var myCanvas2 = document.getElementById("text");
    var ctx2 = myCanvas2.getContext("2d");

    for (var i = 0; i < choice.length; i++) {
        if (clicked === choice[i]) { // if it's matching 
            // write inside the canvas
            ctx2.font = "2em Times New Roman"
            ctx2.fillStyle = "coral";
            ctx2.textAlign = "center";
            ctx2.fillText(choice[i], x, 70);
            bool = 1; // matched
            win++; // +1 matched letter

        }
        x += 50;
    }

    if (bool === 0) return 0; // no matching
    return 1;
}

// when a key is pressed trigger this
function keyPressed(event) {
    event.preventDefault();
    var key = event.keyCode;
    var myCanvas = document.getElementById("myCanvas");
    var ctx = myCanvas.getContext("2d");

    // if it's a letter and was not pressed before
    if (key >= 97 && key <= 122) {
        if (verify[key - 97] === 0) {
            var myTry = check(String.fromCharCode(key)); // check for matching

            // verify if there are more tries
            if (myTry === 0 && count < 6) mistake(ctx);
            else if (win === size) {
                // winnning case
                alert("You Win!");
                play = false;
                document.getElementsByTagName("body")[0].removeEventListener("keypress", keyPressed);
            }
            verify[key - 97] = 1;
            //display the pressed letter
            document.getElementById("hitted").innerHTML = document.getElementById("hitted").innerHTML + "&nbsp;" + String.fromCharCode(key);
        }
    } else alert("Please press a letter from a to z!")
}
