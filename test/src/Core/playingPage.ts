class playingPage extends egret.Sprite {
  private totalScore = 0;  //分数
  private level = new egret.Sprite(); //分数精灵
  private levelNo = 1;  //关卡
  private count = 0;  //消除数量

  public constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
  }
  private init(): void {
    let stageW = this.stage.stageWidth;
    let stageH = this.stage.stageHeight;

    //顶栏背景
    let title = this.createBitmapByName("hud_bg");
    this.addChild(title);
    title.width = stageW;
    title.height = 40;
    //关卡
    this.createNumber(1, this.level, 20, 22, 30, 9);
    this.addChild(this.level);
    //分数背景
    let bar1_bg = this.createBitmapByName("bar1_bg");
    this.addChild(bar1_bg);
    bar1_bg.width = 120;
    bar1_bg.height = 28;
    bar1_bg.x = 53;
    bar1_bg.y = 6;
    //push
    let push_btn = this.createBitmapByName("push_btn");
    this.addChild(push_btn);
    push_btn.width = 35;
    push_btn.height = 35;
    push_btn.x = 183;
    push_btn.y = 4;
    //剩余时间栏背景
    let bar2_bg = this.createBitmapByName("bar2_bg");
    this.addChild(bar2_bg);
    bar2_bg.width = 80;
    bar2_bg.height = 28;
    bar2_bg.x = 228;
    bar2_bg.y = 6;
    //剩余时间栏前景
    let bar2_fill = this.createBitmapByName("bar2_fill");
    this.addChild(bar2_fill);
    bar2_fill.width = 80;
    bar2_fill.height = 28;
    bar2_fill.x = 228;
    bar2_fill.y = 6;
    //暂停按钮
    let pause_btn = this.createBitmapByName("pause_btn");
    this.addChild(pause_btn);
    pause_btn.width = 35;
    pause_btn.height = 35;
    pause_btn.x = 318;
    pause_btn.y = 4;
    //spikes_block
    let spikes_block = this.createBitmapByName("spikes_block");
    this.addChild(spikes_block);
    spikes_block.width = stageW;
    spikes_block.height = 38;
    spikes_block.y = 37;
    spikes_block.x = 9;

    this.createBlock();
  }
  //创建方块
  private createBlock(): void {
    let stageH = this.stage.stageHeight;
    let stageW = this.stage.stageWidth;
    let position; //储存点击矩阵位置
    let matrix = []; //位置矩阵
    let alreadyRet = []; //已经遍历过
    let retrievalOk = []; //选中项
    let scoreBox = new egret.Sprite();
    let bg = this.parent.parent.getChildAt(0); //获取背景精灵
    let bling = this.createBitmapByName("bling");
    let Matrix = new egret.Sprite();

    this.createNumber(this.totalScore, scoreBox, 23, 23, 113, 10);
    this.addChild(scoreBox);
    bling.width = 40;
    bling.height = 41;
    //初始化9*8方块
    this.addChild(Matrix);
    for (let j = 0; j < 9; j++) {
      matrix[j] = [];
      alreadyRet[j] = [], retrievalOk[j] = [];
      for (let i = 0; i < 8; i++) {
        let index = Math.floor(Math.random() * 5);
        let bl = this.createBitmapByName(`bl${index}`);
        matrix[j].push(bl);
        retrievalOk[j][i] = false;
        bl.name = index.toString();
        bl.width = 41;
        bl.height = 41;
        bl.x = 4 + 41 * j;
        bl.y = stageH - 3 - 41 * (i + 1);
        Matrix.addChild(bl);
      }
    }
    //把点击事件绑定到背景层
    bg.touchEnabled = true;
    bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, click, this);
    function click(e) {
      position = this.getPosition(e); //通过点击坐标确定点击的方块
      if (matrix[position.x][position.y]) {
        this.retrieval(position, matrix, alreadyRet, retrievalOk); //遍历矩阵
      }
      else {
        console.log("方块不存在");
        return;
      }
      if (this.count >= 2) {
        let score = new egret.Sprite();
        let moveDown = []; // 记录移除信息
        this.addChild(score);
        //提示分数
        this.totalScore += this.count; //分数
        if (this.totalScore >= 30) {
          this.levelNo++;  //关卡
          this.createNumber(this.levelNo, this.level, 20, 22, 30, 9);
        }
        this.createNumber(this.count, score, 100, 100, stageW / 2, -20);
        this.createNumber(this.totalScore, scoreBox, 23, 23, 113, 10);
        egret.Tween.get(score)
          .to({ alpha: 0 }, 1)
          .to({ alpha: 1, y: 100 }, 200)
          .wait(400)
          .call(() => {
            this.removeChild(score);
          });
        //移除操作
        for (let key = 0, len = retrievalOk.length; key < len; key++) {
          let dIndex: number = -1;
          let num: number = 0;
          for (let i = 0, len = retrievalOk[key].length; i < len; i++) {
            if (retrievalOk[key][i]) {
              num++;
              dIndex = i;
            }
            else {
              if (dIndex !== -1)
                moveDown.push({ x: key, y: i, num: num });
            }
          }
          for (let j = 0, len = retrievalOk[key].length; j < len; j++) {
            if (retrievalOk[key][j]) {
              //闪烁效果
              let block = this.createBitmapByName("bling");
              block.x = 4 + 41 * key;
              block.y = stageH - 3 - 41 * (j + 1);
              block.width = 41;
              block.height = 41;
              this.addChild(block);
              egret.Tween.get(block)
                .to({ alpha: 0 }, 50)
                .to({ alpha: 1 }, 50)
                .call(() => {
                  this.removeChild(block);
                });
              Matrix.removeChild(matrix[key][j]);
            }
          }
        }
        //方块下落，填充位置
        for (let key = moveDown.length - 1; key >= 0; key--) {
          egret.Tween.get(matrix[moveDown[key].x][moveDown[key].y])
            .to({ y: matrix[moveDown[key].x][moveDown[key].y].y + 41 * moveDown[key].num }, 180);
        }
        for (let i in retrievalOk)
          for (let j = retrievalOk[i].length - 1; j >= 0; j--) {
            if (retrievalOk[i][j])
              matrix[i].splice(j, 1);
          }
        //下一关
        if (this.totalScore >= 30) {
          this.totalScore = 0;
          egret.Tween.get(Matrix)
            .to({ y: stageH }, 500)
            .call(() => {
              bg.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, click, this);
              this.removeChild(scoreBox);
              this.removeChild(Matrix);
              this.createBlock();
            });
        }
      }
      //重新初始化遍历记录矩阵
      alreadyRet = [];
      retrievalOk = [];
      this.count = 0;
      for (let i in matrix) {
        alreadyRet[i] = [];
        retrievalOk[i] = [];
        for (let j in matrix[i]) {
          alreadyRet[i][j] = false;
          retrievalOk[i][j] = false;
        }
      }
    }
  }
  //获取点击位置
  private getPosition(e): any {
    let stageH = this.stage.stageHeight;
    let position = { x: 0, y: 0 };
    position.x = Math.floor((e.$stageX - 4) / 41);
    position.y = Math.floor(-(e.$stageY - stageH + 3) / 41);
    return position;
  }
  //遍历矩阵
  private retrieval(position: { x: number, y: number }, matrix: any, alreadyRet: any, retrievalOk) {
    if (alreadyRet[position.x][position.y])//已遍历过的位置
      return;
    //记录相同的颜色位置
    retrievalOk[position.x][position.y] = true;
    alreadyRet[position.x][position.y] = true;
    this.count++;
    //往左
    if (position.x > 0 && matrix[position.x - 1][position.y] != undefined && matrix[position.x][position.y].name === matrix[position.x - 1][position.y].name) {
      this.retrieval({ x: position.x - 1, y: position.y }, matrix, alreadyRet, retrievalOk);
    }
    //往右
    if (position.x < 8 && matrix[position.x + 1][position.y] != undefined && matrix[position.x][position.y].name === matrix[position.x + 1][position.y].name) {
      this.retrieval({ x: position.x + 1, y: position.y }, matrix, alreadyRet, retrievalOk);
    }
    //往上
    if (position.y + 1 < matrix[position.x].length && matrix[position.x][position.y + 1] != undefined && matrix[position.x][position.y].name === matrix[position.x][position.y + 1].name) {
      this.retrieval({ x: position.x, y: position.y + 1 }, matrix, alreadyRet, retrievalOk);
    }
    //往下
    if (position.y > 0 && matrix[position.x][position.y - 1] != undefined && matrix[position.x][position.y].name === matrix[position.x][position.y - 1].name) {
      this.retrieval({ x: position.x, y: position.y - 1 }, matrix, alreadyRet, retrievalOk);
    }
    return retrievalOk;
  }
  private createBitmapByName(name: string) {
    let result = new egret.Bitmap();
    let texture: egret.Texture = RES.getRes(name + "_png");
    result.texture = texture;
    return result;
  }

  /**
   * 几乎每个游戏都要用到数字，复用率高，写一个创建数字的方法
   * num：要显示的数字
   * sprite：精灵（Sprite），把所有的数字都加入到他的子对象，方便整体操作
   * width：单个数字的宽度
   * height：单个数字的宽度
   * x:数字x坐标，锚点为width/2,就是中间点横坐标。
   * y：最上方点的纵坐标，为了与其他元素保持一致，方便计算。
   */
  private createNumber(num: number, sprite, width: number, height: number, x: number, y: number) {
    let number = num.toString();
    let len = number.length;
    let anchorX = width / 2 * len;
    sprite.removeChildren();
    for (let i = 0; i < len; i++) {
      let item;
      item = new egret.Bitmap();
      item.texture = RES.getRes(`number.${number.charAt(i)}_png`);
      item.width = width;
      item.height = height;
      item.anchorOffsetX = anchorX - width * i;
      item.x = x;
      item.y = y;
      sprite.addChild(item);
    }
  }
}
