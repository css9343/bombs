"use strict";

window.Bomb = (function(){

    function Bomb(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.color = "#FF0000";
        this.active = true;
    }

    var p = Bomb.prototype;

    p.update = function (dt) {

    };

    p.draw = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    p.explode = function (bombBullets) {
        bombBullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, 300, 0, 1));
        bombBullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, 300, 0, -1));
        bombBullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, 300, 1, 0));
        bombBullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, 300, -1, 0));
        this.active = false;
    }
    return Bomb;
}());