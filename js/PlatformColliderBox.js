"use strict";

window.PlatformColliderBox = (function(){

    function PlatformColliderBox(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    PlatformColliderBox.prototype.draw = function (ctx) {
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    };

    PlatformColliderBox.prototype.collide = function(bullet){
        if(bullet.x + bullet.width > this.x && bullet.x < this.x + this.width &&
           bullet.y + bullet.height > this.y && bullet.y < this.y + this.height)
            return true;

        return false;
    };

    return PlatformColliderBox;
}());