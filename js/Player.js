"use strict";

window.Player = (function(){

	function Player(x, y, speed){
		this.x = x;
		this.y = y;
		this.width = 20;
		this.height = 40;
		this.movementSpeed = speed;
		this.movingLeft = false;
		this.movingRight = false;
		this.gunX;
		this.gunY;
	}

	Player.prototype.display = function(ctx){
		ctx.save();
		ctx.fillStyle = "grey";
		ctx.strokeStyle = "black";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.strokeRect(this.x, this.y, this.width, this.height);		
		ctx.restore();
	}

	Player.prototype.moveLeft = function(){
		if(this.x > 0)
			this.x -= this.movementSpeed;
	}

	Player.prototype.moveRight = function(){
		if(this.x < SCREEN_WIDTH - this.width)
			this.x += this.movementSpeed;
	}

	Player.prototype.drawGun = function(ctx, xTo, yTo){
		ctx.save();
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.moveTo(this.x + this.width/2, this.y + this.height/2);
		ctx.lineTo(xTo, yTo);
		ctx.stroke();
		ctx.restore();
	}

	return Player;
}());