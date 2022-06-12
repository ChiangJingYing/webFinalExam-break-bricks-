let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let count_level = 1; // count now level
let time = 11; // count extra time remain
let score = 0;
let levelScore = [200, 700, 2100, 5000]
let extra_time // HTML object
let count // timeInterval of extra
let count_ball = 1
let level1 = []; // level setting
let balls = [];


function DrawBall(balls) {
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].status === true) {
            ctx.beginPath()
            if (time !== 11) {
                ctx.fillStyle = "red"
                ctx.arc(balls[i].x, balls[i].y, balls[i].radius + 3, 0, Math.PI * 2)
                ctx.fill()
                ctx.closePath()
            }
            ctx.beginPath()
            ctx.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI * 2)
            ctx.fillStyle = "#f2f2f3"
            ctx.fill()
            ctx.closePath()
        }
    }
}


windowSetting(score)
document.querySelector('#reset').addEventListener('click', () => {
    window.location.reload()
})
// intro
document.querySelector('#intro').addEventListener('click', () => {
    swal("遊戲玩法",
        "1. 移動下方板子將小球反彈擊中所有磚塊獲得勝利\n" +
        "2. 小球擊中「上方」、「左右兩邊」將會反彈\n" +
        "3. 若小球掉落至下方邊界即失去一條生命（小球），若生命歸0則失敗\n" +
        "4. 第一二關都只有一顆球，第三關開始會多一顆球\n" +
        "5. 若累積分數達「1000分、2200分」小球將加速移動\n" +
        "6. 若擊中特殊磚塊，將獲得10秒特殊效果\n（小球擊中磚塊將直接貫穿）",
        "info", {
            button: "我了解了",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
})


//create Platform Object
let Platform = {
    width: 150,
    height: 5,
    x: canvas.width / 2,
    y: canvas.height - 10,
    DrawPlatform() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#aa8400"
        ctx.fill();
        ctx.closePath();
        for (let i = 0; i < level1[count_level - 1].length; i++) {
            level1[count_level - 1][i].DrawBrick()
        }
        DrawBall(balls)
    },
    MovePlatform() {
        addEventListener('mousemove', e => {
            if (e.movementX !== 0) {
                if (e.clientX < canvas.width - this.width / 2 && e.clientX >= this.width / 2)
                    this.x = e.clientX - this.width / 2;
            }
        }, false)
    }
}

function DetectCollision(Ball, afx, afy) {
    if (afy > canvas.height - Ball.radius) {
        console.log("loss")
        return false;
    }
    for (let i = 0; i < 50; i++) {
        if (level1[count_level - 1][i].status === true) {
            let black = level1[count_level - 1][i];
            if (afy > black.wt - Ball.radius && afy < black.wb + Ball.radius &&
                afx > black.wl - Ball.radius && afx < black.wr + Ball.radius) {
                if (time === 11) {
                    Ball.CountVector();
                }
                if (black.extra) {
                    extra()
                }
                black.status = false;
                score += 100;
                document.querySelector("#score").innerHTML = "score: " + score
                break
            }
        }
    }
    // collision at platform rebound
    if (afy > Platform.y + Platform.height / 2 - Ball.radius &&
        afx > Platform.x && afx < Platform.x + Platform.width) {
        Ball.CountVector();
    }

    // collision at wall and rebound
    if (afx > canvas.width - Ball.radius || afx - Ball.radius < 0) {
        Ball.dirx = -(Ball.dirx)
        Ball.diry = -(Ball.diry)
        Ball.CountVector()
    }
    if (afy - Ball.radius < 0) {
        Ball.CountVector();
    }
    return true
}

function extra() {
    extra_time = document.querySelector("#extra")
    time -= 1
    extra_time.innerHTML = time.toString()
    extra_time.style.display = "block"
    count = setInterval(function () {
        extra_time.innerHTML = time.toString()
        extra_time.style.display = "block"
        if (time === -1) {
            clearInterval(count);
            extra_time.style.display = "none"
            time = 12
        }
        time -= 1
    }, 1000);
}


function game_start(count_ball) {
    document.querySelector("#reset").style.display = "none"
    document.querySelector("#reset").disabled = true
    let ballsMove = []
    for (let i = 0; i < count_ball; i++) {
        balls.push(new Ball(canvas.width, canvas.height, 1 + i * 0.05, -1, i))
    }
    ballsMove = setInterval(() => {
        for (let i = 0; i < count_ball; i++) {
            let Ball = balls[i]
            if (!Ball.MoveBall()) {
                count_ball -= 1
                // clearInterval(ballsMove[i])
                balls.splice(i, 1)
                Ball.status = false
                if (count_ball === 0) {
                    alert('loss')
                    clearInterval(platformMove)
                    clearInterval(count)
                    time = 11
                    document.querySelector('#extra').style.display = 'none'
                    document.querySelector("#reset").style.display = "block"
                    document.querySelector("#reset").disabled = false
                }
            }
            // detect win
            if (score === levelScore[count_level - 1]) {
                count_level += 1
                if (count_level === 5) {
                    swal("Good job!", "恭喜完成通關!\n如果要重新遊玩請按左上「reset」按鈕", "success")
                    clearInterval(ballsMove)
                    clearInterval(platformMove);
                    clearInterval(count)
                    time = 11
                    document.querySelector('#extra').style.display = 'none'
                    document.querySelector("#reset").style.display = "block"
                    document.querySelector("#reset").disabled = false
                    return
                }
                if (count_level === 3 || count_level === 4)
                    count_ball = 2
                // there is next level remain hit user and start next level
                alert("win")
                alert("第" + count_level + "關")
                document.querySelector("#level").innerHTML = "level:" + count_level
                clearInterval(ballsMove)
                clearInterval(platformMove)
                clearInterval(count)
                time = 11
                document.querySelector('#extra').style.display = 'none'
                balls = []
                game_start(count_ball)
            }
            // speed up ball when get 1000 points
            if (Ball.BallSpeed === 3 && score === 1000) {
                balls.forEach((e) => {
                    e.BallSpeed += 0.65
                })
            }
            if (Ball.BallSpeed === 3 && score === 2200) {
                balls.forEach((e) => {
                    e.BallSpeed += 1.35
                })
            }
        }
    }, 10)
// detect control platform and update
    const platformMove = setInterval(function () {
        Platform.MovePlatform();
        Platform.DrawPlatform();
    }, 1)
}

// reset the game
function init() {
    for (let k = 0; k < 4; k++) {
        level1[k] = []
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 10; j++) {
                level1[k].push(new Brick(65 * j, i * 35));
            }
        }
    }
    level1[0][15].status = true;
    level1[0][15].extra = true;
    level1[0][14].status = true;
    level1[1][1].status = true;
    level1[1][3].status = true;
    level1[1][5].status = true;
    level1[1][7].status = true;
    level1[1][9].status = true;
    level1[2][43].status = true;
    level1[2][42].status = true;
    level1[2][41].status = true;
    level1[2][40].status = true;
    level1[2][6].status = true;
    level1[2][7].status = true;
    level1[2][8].status = true;
    level1[2][9].status = true;
    level1[2][14].status = true;
    level1[2][26].status = true;
    level1[2][15].status = true;
    level1[2][15].extra = true;
    level1[2][14].status = true;
    level1[2][1].status = true;
    level1[2][3].status = true;
    level1[2][5].status = true;
    level1[2][7].status = true;
    level1[2][9].status = true;
    level1[3][0].status = true;
    level1[3][2].status = true;
    level1[3][4].status = true;
    level1[3][6].status = true;
    level1[3][11].status = true;
    level1[3][13].status = true;
    level1[3][15].status = true;
    level1[3][17].status = true;
    level1[3][19].status = true;
    level1[3][20].status = true;
    level1[3][22].status = true;
    level1[3][24].status = true;
    level1[3][26].status = true;
    level1[3][28].status = true;
    level1[3][31].status = true;
    level1[3][33].status = true;
    level1[3][35].status = true;
    level1[3][37].status = true;
    level1[3][39].status = true;
    level1[3][40].status = true;
    level1[3][41].status = true;
    level1[3][42].status = true;
    level1[3][43].status = true;
    level1[3][44].status = true;
    level1[3][45].status = true;
    level1[3][46].status = true;
    level1[3][47].status = true;
    level1[3][48].status = true;
    level1[3][49].status = true;
    level1[3][49].extra = true;
    count_level = 1;
    time = 11;
    score = 0;
    extra_time = 0
    count_ball = 1
    balls = []
    document.querySelector("#score").innerHTML = "score:0"
    document.querySelector('#level').innerHTML = "level:1"
    game_start(count_ball)
}

function start() {
    if (checkOpen) {
        console.log('如遇卡頓，請嘗試關閉開發工具')
    }
    swal("遊戲玩法",
        "1. 移動下方板子將小球反彈擊中所有磚塊獲得勝利\n" +
        "2. 小球擊中「上方」、「左右兩邊」將會反彈\n" +
        "3. 若小球掉落至下方邊界即失去一條生命（小球），若生命歸0則失敗\n" +
        "4. 第一二關都只有一顆球，第三關開始會多一顆球\n" +
        "5. 若累積分數達「1000分、2200分」小球將加速移動\n" +
        "6. 若擊中特殊磚塊，將獲得10秒特殊效果\n（小球擊中磚塊將直接貫穿）",
        "info", {
            button: "開始遊戲",
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then((value) => {
        if (value) {
            if (window.innerHeight >= 650 && window.innerWidth >= 750) {
                init()
            } else {
                swal("視窗太小", "請調整你的視窗已由玩遊戲", 'warning', {
                    button: false,
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                })
            }
        }
    })
}

function checkOpen() {
}

checkOpen.toString = function () {
    this.opened = true;
};
