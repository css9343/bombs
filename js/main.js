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
var overallScore = 0;
var groundHeight = 25;
var gameScreen = TITLE_SCREEN;
var maxShots = 1;
var currentLevel = 1;
var maxLevel = 6;

var effectAudio;
var bgmAudio;
var explosionSound = "assets/explosion.mp3";

//Screen flash
var flashAlpha = 0.0;
var flashGreyScale = 185;
var flashMax = 0.70;

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
		flashAlpha = 0.0;
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
		if (currentLevel > maxLevel) {
		    //console.log(localStorage.getItem('highscore'));
		    //console.log(overallScore);
		    if (localStorage.getItem('highscore') > overallScore || localStorage.getItem('highscore') == 0 || localStorage.getItem('highscore') == null) {
		        localStorage.setItem('highscore', overallScore.toString());
		    }
		    gameScreen = GAMEOVER_SCREEN;
		    return;
		}
		loadLevel(currentLevel);
		bullet = new Bullet(0, 0, 0, 0, 0);
		bullet.active = false;
		flashAlpha = 0.0;
		gameScreen = GAME_SCREEN;
		return;
	}
	else if(gameScreen == LEVELLOSE_SCREEN){		
		loadLevel(currentLevel);
		score = 0;
		flashAlpha = 0.0;
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
function reset() {
    stopAudio();
    bgmAudio.play();
    overallScore = 0;
	score = 0;
	currentLevel = 1;
	gameScreen = TITLE_SCREEN;
	loadLevel(currentLevel);
}

function init(){
	canvasElement = document.getElementById("main-canvas");
	ctx = canvasElement.getContext("2d");
	
    //Audio
	effectAudio = document.querySelector("#effectAudio");
	effectAudio.volume = 0.7;
	bgmAudio = document.querySelector("#bgmAudio");
	bgmAudio.volume = 0.5;

	//Add event listeners for button clicks and key presses
	canvasElement.addEventListener("click", onCanvasClick);
	canvasElement.addEventListener("mousemove", onMouseMove);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);

	//Init player
	player = new Player(SCREEN_WIDTH / 2 - 200, SCREEN_HEIGHT - 65, 5);
    //Offscreen bullet
	bullet = new Bullet(0, 0, 0, 0, 0);
	bullet.active = false;

	//Load first level
    //loadLevel(currentLevel);
	reset();
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

function loadLevel(level) {
    bullet.active = false;
    bombs = [];
    bombBullets = [];
    platforms = [];
    player.x = levels[level]["start"][0][0];
    player.y = levels[level]["start"][0][1];

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
		        flashAlpha = flashMax;
		    }
		    if (bullet.y < 0 || bullet.y > SCREEN_HEIGHT - groundHeight) {
		        bullet.vy *= -1;
		        bullet.bounces--;
		        flashAlpha = flashMax;
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
		        effectAudio.src = explosionSound;
		        effectAudio.play();
		        bomb.explode(bombBullets);
				bullet.active = false;
		    }
		    bombBullets.forEach(function (bB) {
		        if (bomb.active && collisionTest(bB, bomb)) {
		            effectAudio.src = explosionSound;
		            effectAudio.play();
		            bomb.explode(bombBullets);
		        }
		    });
		});

		//Platform collision
		platforms.forEach(function (p) {
		    p.playerCollide(player);
		    p.bulletHit(bullet);
            //If we wanted bomb bullets to bounce off platforms
		    bombBullets.forEach(function (bB) {
		        p.bulletHit(bB);
		    });
		});

		//Check for level win
		var bombActiveCount = 0;
		bombs.forEach(function(b){
			if(b.active)
				bombActiveCount++;			
		});

		if (bombActiveCount == 0) {
		    //overallScore += score;
			//gameScreen = LEVELWIN_SCREEN;
		}
		
		var bbActive = 0;
		if(bombBullets.length > 0){
			bombBullets.forEach(function(bb){
				if(bb.active)
					bbActive++;
			});		
		}
		
		if(bombActiveCount == 0 && bbActive == 0){
			overallScore += score;
			gameScreen = LEVELWIN_SCREEN;
		}

		//Explosion flash
		if(flashAlpha > 0)
			flashAlpha -= 0.1;
	}
}

function draw(){
	//Background
	ctx.save();
	ctx.fillStyle = "#2e2e2e";
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	ctx.restore();

	if(gameScreen == TITLE_SCREEN){
	    drawText("Bombs", SCREEN_WIDTH / 2 - 50, SCREEN_HEIGHT / 2, 25, "#cb0303");
	    drawText("WASD to move, Click to shoot", SCREEN_WIDTH / 2 - 170, SCREEN_HEIGHT / 2 + 40, 22, "#ffffff")
		drawText("Click anywhere to Start", SCREEN_WIDTH/2 - 130, SCREEN_HEIGHT/2 + 60, 22, "#ffffff")
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
	    //Bounces
		if (bullet.bounces - 1 >= 0) {
		    drawText("Bounces Left: " + (bullet.bounces - 1), 20, 35, 16, "#ddd");
		} else {
		    drawText("Bounces Left: " + 0, 20, 35, 16, "#ddd");
		}

		//Draw bullet bounce flash
		ctx.save();
		//Screen flash
		//ctx.fillStyle = "rgba(" + flashGreyScale + ", " + flashGreyScale + ", " + flashGreyScale + ", " + flashAlpha + ")";		
		//ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT - groundHeight);

		//Border flash
		ctx.strokeStyle = "rgba(255, 0, 0, " + flashAlpha + ")";
		ctx.lineWidth = 15;
		ctx.strokeRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT - groundHeight);

		ctx.restore();
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
	    drawText("You beat the game!", SCREEN_WIDTH / 2 - 100, SCREEN_HEIGHT / 2, 25, "#cb0303");
	    if (localStorage.getItem('highscore') == null) {
	        drawText("Previous Highscore: " + 0, SCREEN_WIDTH / 2 - 100, SCREEN_HEIGHT / 2 + 30, 25, "#cb0303");
	    }
	    else {
	        drawText("Best Score: " + localStorage.getItem('highscore'), SCREEN_WIDTH / 2 - 100, SCREEN_HEIGHT / 2 + 30, 25, "#cb0303");
	    }
		drawText("Click to Play Again", SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 + 60, 22, "#ffffff")		
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
    ctx.font = 'bold ' + size + 'px Helvetica';
    ctx.fillStyle = color;
    ctx.fillText(string, x, y);
}

function stopAudio() {
    if (!bgmAudio.paused) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }
}