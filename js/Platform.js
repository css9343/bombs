"use strict";

window.Platform = (function(){

    function Platform(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = "#000000";
    }

    var p = Platform.prototype;

    p.update = function (dt) {

    };

    p.draw = function (ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    };

    return Bomb;
}());