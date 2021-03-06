
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width - 60;      //starting ball position (x)
var y = 45;                     //starting ball position (y)
var dx = 6;                     //change in x. As this is based on setInterval rate = speed
var dy = -6;                    //change in y. As this is based on setInterval rate = speed
var ballRadius = 10;            //size of ball

var paddleHeight = 12;
var paddleWidth = 12;
var paddleX = 50;
var paddleY = 35;
var px = 5;                     //change in x. As this is based on setInterval rate = speed
var py = 5;                     //change in y. As this is based on setInterval rate = speed
var paddleLeftBlocked = false;
var paddleRightBlocked = false;
var paddleTopBlocked = false;
var paddleBottomBlocked = false;

var endZoneH = 55;
var endZoneW = 100;
var endZoneX = canvas.width - endZoneW - 5;
var endZoneY = canvas.height - endZoneH - 5 ;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

var brickRowCount = 25;
var brickColumnCount = 25;
var brickWidth = 30;
var brickHeight = 15;
var brickPadding = 5;
var brickOffsetTop = 5;
var brickOffsetLeft = 5;

var speed = 0;

//Creating a 2D array, where [c]array each having [r]array
//Each of these with brick object {x: , y: , status: }
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status: 1};
    }
}

function drawSpeed() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#dd3d38";
    ctx.fillText("Ball Speed: " + speed, 775 , 20);           //last 2 arguments are the x,y coordinates
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
        ctx.fillStyle = "#dd3d38";
        ctx.fill();
    ctx.closePath();
}


function drawPaddle() {
    ctx.beginPath();
        ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
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
                var leftEdge = x + ballRadius - b.x;
                var rightEdge = (b.x + brickWidth) - (x - ballRadius);
                var topEdge = y + ballRadius - b.y;
                var bottomEdge = (b.y + brickHeight) - (y - ballRadius);

                if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
                    //below IF / ELSE compares to see if the ball has hit the top / bottom or the sides of brick first to move accordingly.
                    //change speed of ball upto max of 15px
                    if ((Math.min(leftEdge , rightEdge))<(Math.min(topEdge , bottomEdge))){
                        b.status = 0;
                        dx = -dx;
                        speed++;
                    }
                    else  {
                        b.status = 0;
                        dy = -dy;
                        speed++;
                    }
                }
            }
        }
    }
}


//COLLISION detection for paddle and brick
    // if paddle touches brick then stop movement in brick direction.
    //........
    //use the variables "ballLeftIsBrick", "ballRightIsBrick", "ballTopIsBrick", "ballDownIsBrick" in function keypress
    //ensure that this collision detection is ABOVE the keypress function(S) call

function collisionDetectionPaddelAndBrick() {

    var skip = false;

    for(c=0; c<brickColumnCount; c++) {

        if (skip) {
            return false;
        }

        for(r=0; r<brickRowCount; r++) {

            var b = bricks[c][r];

            //this is to avoid having to check each if statement
            // (the foreach continues but immediately Returns false)
            if (skip) {
                return false;
            }

            //only check against bricks which exist
            if (b.status == 1) {

                //for the left and right movements of the paddle to be blocked...
                //the paddle y OR the paddle y + Paddle Height must be within the brick's height
                if(paddleY > b.y && paddleY < (b.y + brickHeight) || (paddleY + paddleHeight) > b.y && (paddleY + paddleHeight) < (b.y + brickHeight)) {
                    if ((paddleX - px) < (b.x + brickWidth) && (paddleX + paddleWidth) > b.x) {
                        paddleLeftBlocked = true;
                        skip = true;
                        console.log('Left blocked = true');
                    }
                    if ((paddleX + px + paddleWidth) > b.x && paddleX < (b.x + brickWidth)) {
                        paddleRightBlocked = true;
                        skip = true;
                        console.log('Right blocked = true');
                    }
                }

                //for the up and down movements of the paddle to be blocked...
                //the paddle x OR the paddle x + Paddle Width must be within the brick's width
                if(paddleX > b.x && paddleX < (b.x + brickWidth) || (paddleX + paddleWidth) > b.x && (paddleX + paddleWidth) < (b.x + brickWidth)) {
                    if ((paddleY - py) < (b.y + brickHeight) && (paddleY + paddleHeight) > b.y) {
                        paddleTopBlocked = true;
                        skip = true;
                        console.log('Top blocked = true');
                    }
                    if ((paddleY + py + paddleHeight) > b.y && paddleY < (b.y + brickHeight)) {
                        paddleBottomBlocked = true;
                        skip = true;
                        console.log('Bottom blocked = true');
                    }
                }
            }
        }
    }

    return true;
}


//COLLISION detection for paddle and ball... if paddle touches ball then "game over!"
function collisionDetectionPaddelAndBall() {
    if (x + ballRadius > paddleX &&
        x - ballRadius < paddleX + paddleWidth &&
        y + ballRadius > paddleY &&
        y - ballRadius < paddleY + paddleHeight) {

        alert("GAME OVER");
        document.location.reload();
    }
}


//End Zone: Collision detection if paddle enters end zone. If yes, then "You win"
function paddelInEndZone() {
    if (endZoneX < paddleX &&
        endZoneX + endZoneW > paddleX + paddleWidth &&
        endZoneY < paddleY &&
        endZoneY + endZoneH > paddleY + paddleHeight) {
        alert("YOU WIN!");
        document.location.reload();
    }
}



//Bricks[col][row]
function removeBricksForLevel1 () {

    //player starting point
    bricks[0][0].status = 0;
    bricks[0][1].status = 0;
    bricks[0][2].status = 0;
    bricks[1][0].status = 0;
    bricks[1][1].status = 0;
    bricks[1][2].status = 0;
    bricks[2][0].status = 0;
    bricks[2][1].status = 0;
    bricks[2][2].status = 0;

    //ball1 starting point
    bricks[22][0].status = 0;
    bricks[23][0].status = 0;
    bricks[24][0].status = 0;
    bricks[22][1].status = 0;
    bricks[23][1].status = 0;
    bricks[24][1].status = 0;
    bricks[22][2].status = 0;
    bricks[23][2].status = 0;
    bricks[24][2].status = 0;

    //end zone
    bricks[22][22].status = 0;
    bricks[22][23].status = 0;
    bricks[22][24].status = 0;
    bricks[23][22].status = 0;
    bricks[23][23].status = 0;
    bricks[23][24].status = 0;
    bricks[24][22].status = 0;
    bricks[24][23].status = 0;
    bricks[24][24].status = 0;

    //maze path
    bricks[1][3].status = 0;
    bricks[1][4].status = 0;
    bricks[1][5].status = 0;
    bricks[1][13].status = 0;
    bricks[1][14].status = 0;
    bricks[1][15].status = 0;
    bricks[1][16].status = 0;
    bricks[1][17].status = 0;
    bricks[1][18].status = 0;
    bricks[1][19].status = 0;

    bricks[2][5].status = 0;
    bricks[2][6].status = 0;
    bricks[2][7].status = 0;
    bricks[2][8].status = 0;
    bricks[2][9].status = 0;
    bricks[2][13].status = 0;
    bricks[2][19].status = 0;

    bricks[3][1].status = 0;
    bricks[3][9].status = 0;
    bricks[3][13].status = 0;
    bricks[3][19].status = 0;
    bricks[3][18].status = 0;
    bricks[3][17].status = 0;
    bricks[3][16].status = 0;

    bricks[4][1].status = 0;
    bricks[4][9].status = 0;
    bricks[4][10].status = 0;
    bricks[4][11].status = 0;
    bricks[4][12].status = 0;
    bricks[4][13].status = 0;
    bricks[4][16].status = 0;

    bricks[5][1].status = 0;
    bricks[5][2].status = 0;
    bricks[5][3].status = 0;
    bricks[5][16].status = 0;
    bricks[5][17].status = 0;
    bricks[5][18].status = 0;
    bricks[5][19].status = 0;
    bricks[5][20].status = 0;
    bricks[5][21].status = 0;
    bricks[5][22].status = 0;
    bricks[5][23].status = 0;

    bricks[6][3].status = 0;
    bricks[6][23].status = 0;

    bricks[7][3].status = 0;
    bricks[7][23].status = 0;

    bricks[8][3].status = 0;
    bricks[8][2].status = 0;
    bricks[8][19].status = 0;
    bricks[8][20].status = 0;
    bricks[8][21].status = 0;
    bricks[8][22].status = 0;
    bricks[8][23].status = 0;

    bricks[9][2].status = 0;
    bricks[9][19].status = 0;
    bricks[9][18].status = 0;
    bricks[9][17].status = 0;
    bricks[9][16].status = 0;
    bricks[9][15].status = 0;

    bricks[10][2].status = 0;
    bricks[10][6].status = 0;
    bricks[10][7].status = 0;
    bricks[10][8].status = 0;
    bricks[10][9].status = 0;
    bricks[10][10].status = 0;
    bricks[10][11].status = 0;
    bricks[10][12].status = 0;
    bricks[10][13].status = 0;
    bricks[10][14].status = 0;
    bricks[10][15].status = 0;

    bricks[11][15].status = 0;
    bricks[11][2].status = 0;
    bricks[11][6].status = 0;

    bricks[12][2].status = 0;
    bricks[12][3].status = 0;
    bricks[12][4].status = 0;
    bricks[12][5].status = 0;
    bricks[12][6].status = 0;
    bricks[12][15].status = 0;
    bricks[12][18].status = 0;
    bricks[12][19].status = 0;
    bricks[12][20].status = 0;
    bricks[12][21].status = 0;
    bricks[12][22].status = 0;
    bricks[12][23].status = 0;

    bricks[13][6].status = 0;
    bricks[13][12].status = 0;
    bricks[13][13].status = 0;
    bricks[13][14].status = 0;
    bricks[13][15].status = 0;
    bricks[13][16].status = 0;
    bricks[13][17].status = 0;
    bricks[13][18].status = 0;
    bricks[13][23].status = 0;

    bricks[14][6].status = 0;
    bricks[14][15].status = 0;
    bricks[14][18].status = 0;
    bricks[14][23].status = 0;
    bricks[14][12].status = 0;

    bricks[15][6].status = 0;
    bricks[15][7].status = 0;
    bricks[15][8].status = 0;
    bricks[15][12].status = 0;
    bricks[15][15].status = 0;
    bricks[15][18].status = 0;
    bricks[15][19].status = 0;
    bricks[15][23].status = 0;

    bricks[16][8].status = 0;
    bricks[16][12].status = 0;
    bricks[16][15].status = 0;
    bricks[16][16].status = 0;
    bricks[16][19].status = 0;
    bricks[16][20].status = 0;
    bricks[16][21].status = 0;
    bricks[16][22].status = 0;
    bricks[16][23].status = 0;

    bricks[17][8].status = 0;
    bricks[17][12].status = 0;
    bricks[17][16].status = 0;
    bricks[17][22].status = 0;

    bricks[18][4].status = 0;
    bricks[18][5].status = 0;
    bricks[18][6].status = 0;
    bricks[18][8].status = 0;
    bricks[18][7].status = 0;
    bricks[18][12].status = 0;
    bricks[18][16].status = 0;
    bricks[18][22].status = 0;

    bricks[19][4].status = 0;
    bricks[19][12].status = 0;
    bricks[19][16].status = 0;
    bricks[19][17].status = 0;
    bricks[19][18].status = 0;
    bricks[19][22].status = 0;
    bricks[19][23].status = 0;

    bricks[20][2].status = 0;
    bricks[20][3].status = 0;
    bricks[20][4].status = 0;
    bricks[20][12].status = 0;
    bricks[20][18].status = 0;
    // bricks[20][23].status = 0;

    bricks[21][2].status = 0;
    bricks[21][11].status = 0;
    bricks[21][12].status = 0;
    bricks[21][17].status = 0;
    bricks[21][18].status = 0;
    bricks[21][23].status = 0;

    // bricks[22][11].status = 0;
    bricks[22][17].status = 0;

    bricks[23][7].status = 0;
    bricks[23][8].status = 0;
    bricks[23][9].status = 0;
    bricks[23][10].status = 0;
    bricks[23][11].status = 0;
    bricks[23][12].status = 0;
    bricks[23][13].status = 0;
    bricks[23][14].status = 0;
    bricks[23][15].status = 0;
    bricks[23][16].status = 0;
    bricks[23][17].status = 0;
    bricks[23][18].status = 0;
    bricks[23][19].status = 0;
    bricks[23][20].status = 0;
    bricks[23][21].status = 0;

}


function drawEndZone() {
    ctx.beginPath();
        ctx.rect(endZoneX, endZoneY, endZoneW, endZoneH);
        ctx.fillStyle = "#2c8053";
        ctx.fill();
    ctx.closePath();
}


function draw() {
    ctx.clearRect(0, 0 , canvas.width, canvas.height);  //this clears the whole canvas before every draw repaint
    removeBricksForLevel1();                            //removebricks must be before drawbricks()
    drawBricks();
    drawPaddle();
    drawBall();
    drawSpeed();
    collisionDetection();
    collisionDetectionPaddelAndBrick();
    collisionDetectionPaddelAndBall();
    drawEndZone();
    paddelInEndZone();

    //BALL MOVEMENT
    //ball bouncing off left or right
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    //ball bouncing off top
    if(y + dy < ballRadius || y + dy > canvas.height - ballRadius) {
        dy = -dy;
    }

    //ball bouncing off the bottom (check ball is within the paddle)
    // if(y + dy > canvas.height - ballRadius) {
    //     if (x > paddleX && x < paddleX + paddleWidth) {
    //         dy = -dy;
    //     }
    //     else {
    //         alert("GAME OVER");
    //         document.location.reload();
    //     }
    // }

    x += dx;
    y += dy;

    //PADDLE MOVEMENT

    //paddle left and right
    if(rightPressed && paddleX < canvas.width - paddleWidth && !paddleRightBlocked) {
        console.log('move right');
        paddleX += px;
        paddleRightBlocked = false;
    }
    else if(leftPressed && paddleX > 0 && !paddleLeftBlocked) {
        console.log('move left');
        paddleX -= px;
        paddleLeftBlocked = false;
    }

    //paddle top and bottom
    if(upPressed && paddleY > 0 && !paddleTopBlocked) {
        console.log('move up');
        paddleY -= py;
        paddleTopBlocked = false;
    }
    else if (downPressed && paddleY < canvas.height - paddleHeight && !paddleBottomBlocked) {
        console.log('move down');
        paddleY += py;
        paddleBottomBlocked = false;
    }

    paddleLeftBlocked = false;
    paddleRightBlocked = false;
    paddleBottomBlocked = false;
    paddleTopBlocked = false;

}



//  <-  37 = left arrow,  39 = right arrow , 38 = up arrow, 40 = down arrow
function keyDownHandler(e) {
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
    }
}

function keyUpHandler(e) {
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
    }
}

//event listener for player avatar
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


//repaint page
setInterval(draw, 50);
// setTimeout(draw, 30);


