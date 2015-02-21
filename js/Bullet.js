"use strict";

window.Bullet = (function(){

    function Bullet(player, x, y, speed, vx, vy) {
        this.x = x;
        this.y = y;
        this.active = true;
        this.speed = speed;
        this.width = 3;
        this.height = 3;
        if (player) {
            this.color = "#fff";
        }
        else {
            this.color = "#FF0000";
        }
        this.vx = vx;
        this.vy = vy;
        this.bounces = 4;
    }

    var p = Bullet.prototype;

    p.update = function (dt) {
        this.x += this.vx * this.speed * dt;
        this.y += this.vy * this.speed * dt;
        if (this.bounces == 0) {
            this.active = false;
        }
    };

    p.draw = function (ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    };
	return Bullet;
}());