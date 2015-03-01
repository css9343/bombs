"use strict";

window.Platform = (function(){

    function Platform(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = "#000000";
        this.topBox = new PlatformColliderBox(this.x, this.y, this.width, 5);
        this.leftBox = new PlatformColliderBox(this.x, this.y, 5, this.height);
        this.bottomBox = new PlatformColliderBox(this.x, this.y + this.height - 5, this.width, 5);
        this.rightBox = new PlatformColliderBox(this.x + this.width - 5, this.y, 5, this.height);
    }

    Platform.prototype.draw = function (ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    };

    Platform.prototype.playerCollide = function (player) {
        if (this.leftBox.collide(player)) {
            player.x -= 5;
        }
        if (this.rightBox.collide(player)) {
            player.x += 5;
        }
    };

    Platform.prototype.bulletHit = function (bullet) {
        //console.log(this.topBox.collide(bullet) + ", " + this.leftBox.collide(bullet) + ", " + this.bottomBox.collide(bullet) + ", " + this.rightBox.collide(bullet));
        if (this.topBox.collide(bullet)) {
            bullet.vy *= -1;
        }
        if (this.leftBox.collide(bullet)) {
            bullet.vx *= -1;
        }
        if (this.bottomBox.collide(bullet)) {
            bullet.vy *= -1;
        }
        if (this.rightBox.collide(bullet)) {
            bullet.vx *= -1;
        }
    };

    return Platform;
}());