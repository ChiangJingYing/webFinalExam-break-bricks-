# 網頁期末project
### 物件

1. 球

    - 位置( x,y )

        ``` x = canvas.width / 2```

        ```y = canvas.height - 30```

    - 移動方向( dirx,diry )

        1.  第一顆球

            ```dirx = 1```

            ```diry = 1```

        2.  第二顆球

            ``` dirx = 1.05```

            ```diry = 1```

    - 速度( BallSpeed )

        1.  default 

            ```BallSpeed = 3```

        2.  1000分

            ```BallSpeed += 0.65```

        3.  2200分

            ```BallSpeed += 1.35```

    - 半徑( radius )

        ```radius = 10```

    - 是否為存在(status)

        碰撞到***下面牆壁***時將 status 轉為***false***

        ```status = true```

2. 磚塊

    - 位置( x,y )

        ```x = num_col * 65```

        ```y = num_row * 35```

    - 長度

        ```width = 60```

    - 寬度

        ```height = 30```

    - 是否為特殊磚( extra )

        設計時將***extra***轉為***true***

        ```extra = false```

    - 是否為實體( status )

        設計時將 ***status*** 轉為 ***true***

        ```status = false```

3. 平台

    - 位置(x,y)

    - 寬度
    - 高度

### 畫圖相關函式

1.  畫出球(  *DrawBall( balls )*  )

    -   確認是否已經擊中特殊磚( 倒數計時***time***不為預設值 )

    ```javascript
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
    ```

2.  畫出磚塊(  *DrawBrick*  )

    -   確定是否為特殊磚( ***extra***屬性是否為true )
    -   會出磚塊

    ```javascript
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
    ```

3.  畫出平台(  *DrawPlatform*  )

    ```javascript
    	ctx.clearRect(0, 0, canvas.width, canvas.height)
    	ctx.beginPath();
    	ctx.rect(this.x, this.y, this.width, this.height);
    	ctx.fillStyle = "#aa8400"
    	ctx.fill();
    	ctx.closePath();
    	for (let i = 0; i < level1[count_level-1].length; i++) {
    			level1[count_level - 1][i].DrawBrick()
    	}
    	DrawBall(balls)
    ```

### 移動相關函式

1.  移動球(  *MoveBall*  )

    -   計算位移後的座標( afx,afy )
    -   以*DetectCollision( Ball, afx, afy )*檢查是否碰撞

    ```javascript
    		let afx = this.x + this.dirx
      	let afy = this.y + this.diry
    		if (!DetectCollision(this, afx, afy))
    				return false
    		this.x += (this.dirx) * this.BallSpeed;
    		this.y += (this.diry) * this.BallSpeed;
    		return true;
    ```

2.  移動平板(  *MovePlatform*  )

    -   *addEventListener( 'mousemove', handle )*監聽滑鼠移動

    ```javascript
    	addEventListener('mousemove', e => {
    		if (e.movementX !== 0) {
    				if (e.clientX < canvas.width - this.width / 2 && e.clientX >= this.width / 2)
    						this.x = e.clientX - this.width / 2;
    				}
    		}, false)
    ```

### 雜項函示

1.  檢查碰撞( *DetectCollision* )

    -   碰到上面 -> 計算反彈方向

    -   碰到左右 -> 計算反彈方向 -> 相反( 左右為垂直 )

    -   碰到下面 -> 回傳*false*表示該球失效

    -   碰到磚塊

        ​										 		 ->是：計算反彈方向 

        ​		 -> 確認是否為能力時間 													    -> 更新磚塊狀態( *status* ) -> 更新分數

        ​										  		->否：呼叫*extra( )*開始能力倒數

    -   碰到平台 -> 計算反提方向

    ```javascript
    function DetectCollision(Ball, afx, afy) {
        if (afy > canvas.height - Ball.radius) {
            console.log("loss")
            return false;
        }
      	// collision at brick ans rebound
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
    
    ```

2.  計算反彈方向( *CountVector* )

    -   旋轉矩陣          (1)
    -   Degrees -> Radian(2)
    -   Radian -> Degrees(3)
    -   旋轉角ø'          (4)
    $$\left[\begin{array}{l}x^{\prime} \\y^{\prime}\end{array}\right]=\left[\begin{array}{cc}\cos \theta & -\sin \theta \\\sin \theta & \cos \theta\end{array}\right]\left[\begin{array}{l}x \\y\end{array}\right]\tag{1}$$
    $$
    \text { radian }=\operatorname{deg} \times \frac{\pi}{180}\tag{2}
    $$
    $$
    \text { degrees }=\operatorname{radian} \times \frac{180}{\pi}\tag{3}
    $$
    $$
    \theta^{\prime}=180-2 \times \theta \tag{4}
    $$
    
    
    * 通過*Math.atan( tan ø )*求入射角 ø 的**弧度**
    

```javascript
        CountVector() {
            let radian = Math.atan(this.diry / this.dirx);
            let deg = -((radian * (180 / Math.PI)));
            radian = (180 - 2 * (deg)) * (Math.PI / 180);
            this.dirx = (Math.cos(radian) * this.dirx - Math.sin(radian) * this.diry);
            this.diry = (Math.sin(radian) * this.dirx + Math.cos(radian) * this.diry);
        }
```


​    

3.  檢查畫面大小(  *windowSetting*  )

    -   window.addEventListener( 'resize', handle )監聽**畫面大小更動**
    -   是否符合大小規定若
        1.  符合且為一開始( score = 0 )
            -   關閉畫面大小更動監聽
            -   開始遊戲( 初始化 )
        2.  不符合
            -   提示需求及目前大小

    ```javascript
    function windowSetting(score) {
        window.addEventListener('resize', function detect() {
            let width = window.innerWidth
            let height = window.innerHeight
            if (width < 800 || height < 700) {
                swal("視窗太小", "請調整你的視窗以由玩遊戲\n" +
                    "需求寬度：750" + "需求高度：650\n" +
                    "目前寬度： " + window.innerWidth + "\n" +
                    "目前高度： " + window.innerHeight + "\n"
                    , 'warning'
                ).then((value) => {
                        if (value === true && width >= 750 && height >= 650) {
                            if (score === 0)
                                window.removeEventListener('resize',detect)
                                init()
                        } else {
                            swal("視窗太小", "請調整你的視窗以由玩遊戲\n" +
                                "需求寬度：750" + "需求高度：650\n" +
                                "目前寬度： " + window.innerWidth + "\n" +
                                "目前高度： " + window.innerHeight + "\n"
                                , 'warning', {
                                    button: false,
                                    closeOnClickOutside: false,
                                    closeOnEsc: false,
                                })
                        }
                    })
            }
        })
    }
    ```

4.  重置

    -   頁面重新整理

        ```window.location.reload( )```

5.  初始化

    -   建立磚塊物件
    -   設計關卡
    -   變數重置
    -   開始遊戲

    ```javascript
    function init() {
      	// 建立磚塊物件
        for (let k = 0; k < 4; k++) {
            level1[k] = []
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 10; j++) {
                    level1[k].push(new Brick(65 * j, i * 35));
                }
            }
        }
      	// 設計關卡，部分略過
        level1[0][15].status = true;
        level1[0][15].extra = true;
        level1[0][14].status = true;
        level1[1][1].status = true;
        // 重置變數
        count_level = 1;
        time = 11;
        score = 0;
        extra_time = 0
        count_ball = 1
        balls = []
        document.querySelector("#score").innerHTML = "score:0"
        document.querySelector('#level').innerHTML = "level:1"
      	// 開始遊戲
        game_start(count_ball)
    }
    ```

6.  能力倒數(  *extra*  )

    -   開始倒數
    -   顯示提示
    -   檢測是否倒數結束
        -   若結束 -> 關閉提示、倒數***time***回歸初始值 -> 關閉***Interval***

    ```javascript
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
    ```

    

7.  偵測失敗( 球碰到下面牆壁 )

    1.  還有其他球在場上
    2.  沒有球了

    ```javascript
    if (!Ball.MoveBall()) {
    		count_ball -= 1
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
    ```

8.  偵測贏了( 所有磚塊都被擊中 )

    1.  還有下一關
    2.  全部通關

    ```javascript
    
    if (score === levelScore[count_level - 1]) {
    		count_level += 1
      	// 全部通關
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
    		// 更改球的數量
    		if (count_level === 3 || count_level === 4)
    				count_ball = 2
    				// there is next level remain hint user and start next level
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
    ```

9.  球的加速

    ```javascript
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
    ```

    

### Ｗorkflow

1.  檢查畫面大小( windowSetting )

2.  初始化遊戲( init )

    1.  關卡建立
    2.  目前分數設置( html, JS )
    3.  目前關卡設置( html, JS )

3.  開始遊戲

    1.  關閉 reset 按鈕並隱藏
    2.  依據關卡設置的數量**建立球**
    3.  設置**球的Interval**
        1.  移動球
            1.  偵測是否撞擊( DetectCollision )
                1.  上面
                2.  下面
                3.  左右邊
                4.  磚塊
                    1.  判斷是否為特殊磚
                        -   執行*extra( )*
                    2.  更新磚塊狀態( status )
                    3.  更新分數( html , JS)
            2.  更新球的位置( x,y )
        2.  偵測失敗
            1.  刪除球
            2.  場上還有球
            3.  場上無球
                -   關閉所有*Interval*
                -   關閉能力倒數
                -   開啟*reset*按鈕
        3.  偵測通關
            1.  完全通關
                -   關閉所有*interval*
                -   提示玩家
            2.  還有下一關
                -   關閉所有*Interval*
                -   提示玩家
                -   更新球的數量
                -   更新目前關卡數( html, JS )
                -   開始下一關
        4.  更改球速( 若符合條件 )
            1.  default
            2.  1000 p
            3.  2200 p

    4.   設置**平台的Interval**
         1.  移動平台( MovePlatform )
             1.  監聽滑鼠移動
             2.  偵測是否超出邊界
             3.  更新平台的位置( x,y )
         2.  畫出平台( DrawPlatform )
             1.  平台
             2.  磚塊( DrawBrick )
                 -   判斷是否為特殊磚
             3.  球( DrawBall )
                 -   判斷是否為能力時間















