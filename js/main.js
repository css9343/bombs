var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;

var ctx;
var player;
var bullet;
var targetX;
var targetY;
var bombs = [];
var bombBullets = [];

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
	console.log(clickPos);
	var dx = clickPos[0] - player.x;
	var dy = clickPos[1] - player.y;
	var mag = Math.sqrt(dx * dx + dy * dy);
	while (!bullet.active) {
	    bullet = new Bullet(player.x + player.width / 2, player.y, 500, dx / mag, dy / mag);
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

    //Crappy first level
	bombs.push(new Bomb(760, 450));
	bombs.push(new Bomb(20, 450));
	bombs.push(new Bomb(20, 40));
	bombs.push(new Bomb(412, 350));
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

function runGameLoop(){
	draw();
	update();
	window.requestAnimationFrame(runGameLoop);
}

function update() {
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
	    if (bullet.y < 0 || bullet.y > SCREEN_HEIGHT) {
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
}

function draw(){
	//Background
	ctx.fillStyle = "#2e2e2e";
	ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	//Player
	player.display(ctx);
	player.drawGun(ctx, targetX, targetY);

	//Ground
	ctx.fillStyle = "#cdcdcd";
	ctx.fillRect(0, SCREEN_HEIGHT - 25, SCREEN_WIDTH, 25);

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
}

function collisionTest(a, b) {
    var ax = a.x - a.width / 2;
    var ay = a.y - a.height / 2;
    var bx = b.x - b.width / 2;
    var by = b.y - b.height / 2;

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