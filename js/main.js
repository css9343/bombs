var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var TITLE_SCREEN = 0;
var GAME_SCREEN = 1;
var LEVELLOSE_SCREEN = 2;
var LEVELWIN_SCREEN = 3;
var GAMEOVER_SCREEN = 4;

var ctx;
var player;
var bullet;
var targetX;
var targetY;
var bombs = [];
var bombBullets = [];
var platforms = [];
var score = 0;
var groundHeight = 25;
var gameScreen = TITLE_SCREEN;
var maxShots = 1;
var currentLevel = 1;

//fps
var dt;
var lastTime;

$(document).ready(function(){
	init();	
	runGameLoop();
});

//Handle canvas click events
function onCanvasClick(e){
	var clickPos = getPosition(e, canvasElement);
	//console.log(clickPos);
	if(gameScreen == TITLE_SCREEN){
		gameScreen = GAME_SCREEN;
	}
	else if(gameScreen == GAME_SCREEN){
		var dx = clickPos[0] - player.x - player.width / 2;
		var dy = clickPos[1] - player.y - player.height / 2;
		var mag = Math.sqrt(dx * dx + dy * dy);
		while (!bullet.active) {
		    bullet = new Bullet(true, player.x + player.width / 2, player.y + player.height / 2, 700, dx / mag, dy / mag);
		    score++;
		}
	}
	else if(gameScreen == LEVELWIN_SCREEN){
		currentLevel++;
		score = 0;
		loadLevel(currentLevel);
		gameScreen = GAME_SCREEN;
	}
	else if(gameScreen == LEVELLOSE_SCREEN){		
		loadLevel(currentLevel);
		score = 0;
		gameScreen = GAME_SCREEN;
	}
	else if(gameScreen == GAMEOVER_SCREEN){
		gameScreen = TITLE_SCREEN;
		reset();
	}
}

//Handle mouse movement
function onMouseMove(e){
	var mousePos = getPosition(e, canvasElement);
	//console.log(mousePos);

	targetX = mousePos[0];
	targetY = mousePos[1];
}

//Handle keydown events
function onKeyDown(e){
	//console.log(e.keyCode);

	if(e.keyCode == 37 || e.keyCode == 65){
		player.movingLeft = true;
		player.movingRight = false;
	}

	if(e.keyCode == 39 || e.keyCode == 68){
		player.movingRight = true;
		player.movingLeft = false;
	}
}

//Handle keyup events
function onKeyUp(e){
	//console.log(e.keyCode);

	player.movingLeft = false;
	player.movingRight = false;
}

//Reset
function reset(){
	score = 0;
	currentLevel = 1;
	gameScreen = TITLE_SCREEN;
	loadLevel(1);
}

function init(){
	canvasElement = document.getElementById("main-canvas");
	ctx = canvasElement.getContext("2d");
	
	//Add event listeners for button clicks and key presses
	canvasElement.addEventListener("click", onCanvasClick);
	canvasElement.addEventListener("mousemove", onMouseMove);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);

	//Init player
	player = new Player(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 65, 5);
    //Offscreen bullet
	bullet = new Bullet(0, 0, 0, 0, 0);
	bullet.active = false;

	//Load first level
	loadLevel(1);

    ////Crappy first level
	//bombs.push(new Bomb(0, 760, 450));
	//bombs.push(new Bomb(0, 20, 450));
	//bombs.push(new Bomb(0, 20, 40));
	//bombs.push(new Bomb(0, 412, 350));

	//for (var i = 0; i < 8; i++) {
	//    for (var j = 0; j < 6; j++) {
	//        var x = 80 + 90 * i;
	//        var y = 20 + 90 * j;
	//        bombs.push(new Bomb(2, x, y));
	//    }
    //}

    /*platforms.push(new Platform(100, 50, 150, 20));
    platforms.push(new Platform(SCREEN_WIDTH - 150, 100, 150, 20));

	bombs.push(new Bomb(2, 260, 20));
	bombs.push(new Bomb(1, 710, 20));
	bombs.push(new Bomb(0, 440, 110));
	bombs.push(new Bomb(0, 620, 110));
	bombs.push(new Bomb(0, 350, 200));
	bombs.push(new Bomb(0, 440, 200));
	bombs.push(new Bomb(0, 530, 200));
	bombs.push(new Bomb(0, 80, 290));
	bombs.push(new Bomb(0, 530, 290));
	bombs.push(new Bomb(0, 170, 380));
	bombs.push(new Bomb(0, 260, 380));*/
}

function getPosition(event, canvas){
	var x;
	var y;
	if (event.pageX || event.pageY) { 
	  x = event.pageX;
	  y = event.pageY;
	}
	else { 
	  x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
	  y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	return [x,y];
}

function loadLevel(level){
	bombs = [];
	platforms = [];

	//console.log(levels[level]["bombs"][0][0]);
	for(var i = 0; i < levels[level]["bombs"].length; i++){
		bombs.push(new Bomb(levels[level]["bombs"][i][0], levels[level]["bombs"][i][1], levels[level]["bombs"][i][2]));
	}

	for(var i = 0; i < levels[level]["platforms"].length; i++){
		platforms.push(new Platform(levels[level]["platforms"][i][0], levels[level]["platforms"][i][1], levels[level]["platforms"][i][2], levels[level]["platforms"][i][3]));
	}
}

function runGameLoop(){
	draw();
	update();
	window.requestAnimationFrame(runGameLoop);
}

function update() {
	if(gameScreen == GAME_SCREEN){
	    dt = calculateDeltaTime();

		if(player.movingLeft == true)
			player.moveLeft();

		if(player.movingRight == true)
		    player.moveRight();

		if (bullet && bullet.active) {
		    if (bullet.x < 0 || bullet.x > SCREEN_WIDTH) {
		        bullet.vx *= -1;
		        bullet.bounces--;
		    }
		    if (bullet.y < 0 || bullet.y > SCREEN_HEIGHT - groundHeight) {
		        bullet.vy *= -1;
		        bullet.bounces--;
		    }
		    bullet.update(dt);
		}
		if (bombBullets.length != 0) {
		    for (var i = 0; i < bombBullets.length; i++) {
		        bombBullets[i].update(dt);
		    }
		}

	    //Collision
		bombs.forEach(function (bomb) {
		    if (bomb.active && collisionTest(bomb, bullet)) {
		        //4 way explosion only for now
		        bomb.explode(bombBullets);
		    }
		    bombBullets.forEach(function (bB) {
		        if (bomb.active && collisionTest(bB, bomb)) {
		            bomb.explode(bombBullets);
		        }
		    });
		});

		//Platform collision
		platforms.forEach(function(p){
			p.bulletHit(bullet);
		});
		
		//Check for level win
		var bombActiveCount = 0;
		bombs.forEach(function(b){
			if(b.active)
				bombActiveCount++;			
		});

		if(score >= maxShots && bullet.active == false){
			if(bombActiveCount > 0)
				gameScreen = LEVELLOSE_SCREEN;
			else 
				gameScreen = LEVELWIN_SCREEN;
		}
	}
}

function draw(){
	//Background
	ctx.save();
	ctx.fillStyle = "#2e2e2e";
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	ctx.restore();

	if(gameScreen == TITLE_SCREEN){
		drawText("Bombs", SCREEN_WIDTH/2 - 50, SCREEN_HEIGHT/2, 25, "#cb0303");
		drawText("Click to Start", SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 + 40, 22, "#ffffff")
	}

	if(gameScreen == GAME_SCREEN){
		//Ground
		ctx.save();
		ctx.fillStyle = "#cdcdcd";
		ctx.fillRect(0, SCREEN_HEIGHT - 25, SCREEN_WIDTH, groundHeight);
		ctx.restore();

	    //Bullet
		if (bullet && bullet.active) {
		    bullet.draw(ctx);
		}

	    //Bombs
		for (var i = 0; i < bombs.length; i++) {
		    if (bombs[i].active) {
		        bombs[i].draw(ctx);
		    }
		}

	    //Bomb bullets
		for (var i = 0; i < bombBullets.length; i++) {
		    bombBullets[i].draw(ctx);
		}

		//Platforms
		for(var i = 0; i < platforms.length; i++){
			platforms[i].draw(ctx);
		}

	    //Player
		player.display(ctx);
		player.drawGun(ctx, targetX, targetY);

	    //Score
		drawText("Shots Taken: " + score, 20, 20, 16, "#ddd");
	}

	if(gameScreen == LEVELWIN_SCREEN){
		drawText("You won!", SCREEN_WIDTH/2 - 50, SCREEN_HEIGHT/2, 25, "#cb0303");
		drawText("Click for Next Level", SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 + 40, 22, "#ffffff")
	}

	if(gameScreen == LEVELLOSE_SCREEN){
		drawText("You lost!", SCREEN_WIDTH/2 - 50, SCREEN_HEIGHT/2, 25, "#cb0303");
		drawText("Click to retry", SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 + 40, 22, "#ffffff")
	}

	if(gameScreen == GAMEOVER_SCREEN){
		drawText("You beat the game!", SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2, 25, "#cb0303");
		drawText("Click to Play Again", SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 + 40, 22, "#ffffff")		
	}
}

function collisionTest(a, b) {
    var ax = a.x;
    var ay = a.y;
    var bx = b.x + b.width / 2;
    var by = b.y + b.height / 2;

    return ax < bx + b.width &&
            ax + a.width > bx &&
           ay < by + b.height &&
            ay + a.height > by;
}

function calculateDeltaTime() {
    var now, fps;
    now = (+new Date);
    fps = 1000 / (now - this.lastTime);
    fps = Math.max(fps, Math.min(12, 60));
    this.lastTime = now;
    return 1 / fps;
}

function drawText(string, x, y, size, color) {
    ctx.font = 'bold ' + size + 'px Monospace';
    ctx.fillStyle = color;
    ctx.fillText(string, x, y);
}