//Tutorial
//https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Create_the_Canvas_and_draw_on_it


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width - 50;      //starting ball position (x)
var y = 30;                     //starting ball position (y)
var dx = 2;                     //change in x. As this is based on setInterval rate = speed
var dy = -2;                    //change in y. As this is based on setInterval rate = speed
var ballRadius = 10;            //size of ball

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight;
var px = 5;                     //change in x. As this is based on setInterval rate = speed
var py = 5;                    //change in y. As this is based on setInterval rate = speed

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;


var brickRowCount = 26;
var brickColumnCount = 23;
var brickWidth = 30;
var brickHeight = 15;
var brickPadding = 5;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

//Creating a 2D array, where [c]array each having [r]array
//Each of these with brick object {x: , y: , status: }
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status: 1};
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#07496e";
    ctx.fillText("Score: "+score, 8, 20);           //last 2 arguments are the x,y coordinates
}

//draw bricks
//x and y-coordinate based on brick number and size
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#db7c2e";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


//draw ball
function drawBall() {
    ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
    ctx.closePath();
}


function drawPaddle() {
    ctx.beginPath();
        ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
        ctx.fillStyle = "#805233";
        ctx.fill();
    ctx.closePath();
}


//COLLISION detection (ball vs brick)
//For the center of the ball to be inside the brick, all four of the following statements need to be true:
//  The x position of the ball is greater than the x position of the brick.
//  The x position of the ball is less than the x position of the brick plus its width.
//  The y position of the ball is greater than the y position of the brick.
//  The y position of the ball is less than the y position of the brick plus its height.
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                // if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                //     dy = -dy;
                //     b.status = 0;
                // }
                var leftEdge = x - b.x;
                var rightEdge = (b.x + brickWidth) - x;
                var topEdge = y - b.y;
                var bottomEdge = (b.y + brickHeight) - y;
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    //below IF / ELSE compares to see if the ball has hit the top / bottom or the sides of brick first to move accordingly.
                    if ((Math.min(leftEdge , rightEdge))<(Math.min(topEdge , bottomEdge))){
                        dx = -dx;
                        b.status = 0;
                        score++;
                    }
                    else  {
                        dy = -dy;
                        b.status = 0;
                        score++;
                    }
                }
            }
        }
    }
}


//COLLISION detection for paddle and brick
// if paddle touches brick then "Game Over" or paddle slows.
//........



//COLLISION detection for paddle and ball
// if paddle touches brick then "Game Over".
//........



//End Zone
//Set end Zone
//detect if paddle enters end zone
//if yes, then "You win"
//........



function draw() {
    ctx.clearRect(0, 0 , canvas.width, canvas.height);  //this clears the whole canvas before every draw repaint
    drawBricks();
    drawPaddle();
    drawBall();
    drawScore();
    collisionDetection();

    //BALL MOVEMENT
    //ball bouncing off left or right
    if(x  + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    //ball bouncing off top or bottom
    if(y + dy < ballRadius) {
        dy = -dy;
    }

    //ball bouncing off the bottom (check ball is within the paddle)
    if(y + dy > canvas.height - ballRadius - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            alert("GAME OVER");
            document.location.reload();
        }
    }

    x += dx;
    y += dy;

    //PADDLE MOVEMENT
    //paddle left and right
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += px;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= px;
    }

    //paddle top and bottom
    if(upPressed && paddleY > 0 ) {
        paddleY -= py;
    }
    else if (downPressed && paddleY < canvas.height - paddleHeight) {
        paddleY += py;
    }
}



//  <-  37 = left arrow,  39 = right arrow , 38 = up arrow, 40 = down arrow
function keyDownHandler(e) {
    // if(e.keyCode == 39) {
    //     rightPressed = true;
    // }
    // else if(e.keyCode == 37) {
    //     leftPressed = true;
    // }

    switch(e.keyCode) {
        case 37:
            leftPressed = true;
            break;
        case 39:
            rightPressed = true;
            break;
        case 38:
            upPressed = true;
            break;
        case 40:
            downPressed = true;
            break;
        default:
            downPressed = false;            //needs a default
    }
}

function keyUpHandler(e) {
    // if(e.keyCode == 39) {
    //     rightPressed = false;
    // }
    // else if(e.keyCode == 37) {
    //     leftPressed = false;
    // }

    switch(e.keyCode) {
        case 37:
            leftPressed = false;
            break;
        case 39:
            rightPressed = false;
            break;
        case 38:
            upPressed = false;
            break;
        case 40:
            downPressed = false;
            break;
        default:
            downPressed = false;            //should this be true or false????
    }
}

//event listener for paddle
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


//repaint page
//setInterval(draw, 16);
setTimeout(draw, 16);


