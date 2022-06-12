function Bricks() {
}

Bricks.prototype.status = false;
Bricks.prototype.width = 60;
Bricks.prototype.height = 30;
Bricks.prototype.extra = false;


function Brick(x, y) {
    this.x = x;
    this.y = y;
    this.wr = this.x + this.width;
    this.wl = this.x;
    this.wt = this.y;
    this.wb = this.y + this.height;
}

Brick.prototype = Object.create(Bricks.prototype)
Brick.prototype.DrawBrick = function () {
    if (this.status === true) {
        if (this.extra) {
            ctx.beginPath();
            ctx.fillStyle = "red"
            ctx.rect(this.x - 2, this.y - 2, this.width + 3, this.height + 3)
            ctx.fill()
            ctx.closePath()
        }
        ctx.beginPath()
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#00305a";
        ctx.fill();
        ctx.closePath();
    }
}
