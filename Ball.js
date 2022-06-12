class Ball {
    x = 0
    y = 0
    dirx = 1
    diry = -1
    status = true
    radius = 10
    BallSpeed = 3

    constructor(canvas_width, canvas_height, dirx, diry, id) {
        let canvas = document.getElementById("myCanvas");
        this.id = id
        this.x = canvas.width / 2
        this.y = canvas.height - 30
        this.dirx = dirx
        this.diry = diry
    }

    CountVector() {
        let radian = Math.atan(this.diry / this.dirx);
        let deg = -((radian * (180 / Math.PI)));
        radian = (180 - 2 * (deg)) * (Math.PI / 180);
        this.dirx = (Math.cos(radian) * this.dirx - Math.sin(radian) * this.diry);
        this.diry = (Math.sin(radian) * this.dirx + Math.cos(radian) * this.diry);
    }

    MoveBall() {
        // loss the game
        let afx = this.x + this.dirx
        let afy = this.y + this.diry
        if (!DetectCollision(this, afx, afy))
            return false
        // move the ball
        this.x += (this.dirx) * this.BallSpeed;
        this.y += (this.diry) * this.BallSpeed;
        return true;
    }
}
