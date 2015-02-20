"use strict";

window.Bomb = (function(){

    function Bomb(type, x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.color = "#FF0000";
        this.active = true;
        //Type: 0, 1, 2
        //0 = cardinal, 1 = diag, 2 = 8way
        this.type = type;
    }

    var p = Bomb.prototype;

    p.update = function (dt) {

    };

    p.draw = function (ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "black";
        var vert = this.x + this.width / 2;
        var hori = this.y + this.height / 2;
        ctx.beginPath();
        if (this.type == 0 || this.type == 2) {
            ctx.moveTo(vert, this.y);
            ctx.lineTo(vert, this.y + this.height);
            ctx.moveTo(this.x, hori);
            ctx.lineTo(this.x + this.width, hori);
        }
        if (this.type == 1 || this.type == 2) {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.moveTo(this.x + this.width, this.y);
            ctx.lineTo(this.x, this.y + this.height);
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.restore();
    };

    p.explode = function (bombBullets) {
        if (this.type == 0 || this.type == 2) {
            bombBullets.push(new Bullet(false, this.x + this.width / 2, this.y + this.height / 2, 300, 0, 1));
            bombBullets.push(new Bullet(false, this.x + this.width / 2, this.y + this.height / 2, 300, 0, -1));
            bombBullets.push(new Bullet(false, this.x + this.width / 2, this.y + this.height / 2, 300, 1, 0));
            bombBullets.push(new Bullet(false, this.x + this.width / 2, this.y + this.height / 2, 300, -1, 0));
        }
        if (this.type == 1 || this.type == 2) {
            bombBullets.push(new Bullet(false, this.x + this.width / 2, this.y + this.height / 2, 300, 1, 1));
            bombBullets.push(new Bullet(false, this.x + this.width / 2, this.y + this.height / 2, 300, 1, -1));
            bombBullets.push(new Bullet(false, this.x + this.width / 2, this.y + this.height / 2, 300, -1, 1));
            bombBullets.push(new Bullet(false, this.x + this.width / 2, this.y + this.height / 2, 300, -1, -1));
        }
        this.active = false;
    }
    return Bomb;
}());