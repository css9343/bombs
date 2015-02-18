"use strict";

window.Bullet = (function(){

    function Bullet(x, y, speed, vx, vy) {
        this.x = x;
        this.y = y;
        this.active = true;
        this.speed = speed;
        this.width = 3;
        this.height = 3;
        this.color = "#fff";
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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
	return Bullet;
}());