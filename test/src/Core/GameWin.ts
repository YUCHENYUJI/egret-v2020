class GameWin extends eui.Component implements eui.UIComponent {
    constructor() {
        super();
        this.skinName = "resource/eui_skins/gameViewSkin.exml";
    }
    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        this.Init();
    }
    private Btnhome: eui.Image;//回主页
    private hard_text: eui.Label;//难度信息
    private Btnpause: eui.Image;//暂停
    private BtnReplay: eui.Image;//重玩
    private BtnAddLevel: eui.Image;//加难度
    private t_score: eui.Label;//分值
    private t_target_score: eui.Label;//目标分值
    private Tips: eui.Label;//
    private TipGroup: eui.Group;//tipsGroup==》
    private BgClose: eui.Rect;
    private RectContainer: eui.Group;//方块容器
    private Init(): void {
        this.t_score.text = "0";
        this.TipGroup.visible = false;
        this.Btnhome.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.Btnpause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.BgClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.BtnReplay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.BtnAddLevel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.RectContainer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.CheckRect, this);
        let num = Number(egret.localStorage.getItem('LastStarNum')) ? Number(egret.localStorage.getItem('LastStarNum')) : 0;
        this.InitGame(num);
    }
    private Level: number = 0;//游戏难度
    private totalScore = 0;  //分数
    private level = new egret.Sprite(); //分数精灵
    private levelNo = 1;  //关卡
    private stageW: number = 640;
    private stageH: number = 800;
    private matrixArr: any = []; //位置矩阵
    private alreadyRet: any = []; //已经遍历过
    private retrievalOk: any = []; //选中项
    /**关卡配置*/
    private hardLevelArr: { w: number, h: number }[] = [{ w: 9, h: 8 }, { w: 10, h: 9 }, { w: 11, h: 10 }, { w: 12, h: 11 }, { w: 13, h: 12 }, { w: 14, h: 13 },
    { w: 15, h: 14 }, { w: 15, h: 15 }, { w: 15, h: 16 }, { w: 15, h: 17 }, { w: 15, h: 18 }, { w: 15, h: 19 }, { w: 15, h: 20 }];
    /**初始化游戏*/
    private InitGame(level: number): void {
        this.Level = level;
        let w: number = 9;
        let h: number = 8;
        if (this.hardLevelArr[level]) {
            w = this.hardLevelArr[level].w;
            h = this.hardLevelArr[level].h;
        } else {
            this.Level = 0;
        }
        egret.localStorage.setItem('LastStarNum', String(this.Level));
        this.hard_text.text = String("难度：" + this.Level + "级");
        this.t_score.text = String("0");

        this.t_target_score.text = String("目标分值:" + (this.hardLevelArr[this.Level].w * this.hardLevelArr[this.Level].h - 20));
        this.RectContainer.width = w * 41 + 4;
        this.RectContainer.removeChildren();
        //初始化方块
        for (let j = 0; j < w; j++) {
            this.matrixArr[j] = [];
            this.alreadyRet[j] = [], this.retrievalOk[j] = [];
            for (let i = 0; i < h; i++) {
                let index = Math.floor(Math.random() * 5);
                let bl = this.createBitmapByName(`bl${index}`);
                this.matrixArr[j].push(bl);
                this.retrievalOk[j][i] = false;
                this.RectContainer.addChild(bl);
                bl.name = index.toString();
                bl.width = 41;
                bl.height = 41;
                bl.x = 4 + 41 * j;
                bl.y = this.stageH - 3 - 41 * (i + 1);
            }
        }
        this.RectContainer.x = (this.stageW - this.RectContainer.width) / 2;
    }
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: eui.Image = new eui.Image();
        result.texture = RES.getRes(name + "_png");
        return result;
    }
    private CheckRect(e: egret.TouchEvent): void {
        let position = this.getPosition(e); //通过点击坐标确定点击的方块
        console.log("点击坐标：", position.x, position.y);
        if (this.matrixArr[position.x][position.y]) {
            this.retrieval(position, this.matrixArr, this.alreadyRet, this.retrievalOk); //遍历矩阵
        } else {
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
            }
            egret.Tween.get(score)
                .to({ alpha: 0 }, 1)
                .to({ alpha: 1, y: 100 }, 200)
                .wait(400)
                .call(() => {
                    this.removeChild(score);
                });
            //移除操作
            for (let key = 0, len = this.retrievalOk.length; key < len; key++) {
                let dIndex: number = -1;
                let num: number = 0;
                for (let i = 0, len = this.retrievalOk[key].length; i < len; i++) {
                    if (this.retrievalOk[key][i]) {
                        num++;
                        dIndex = i;
                    }
                    else {
                        if (dIndex !== -1)
                            moveDown.push({ x: key, y: i, num: num });
                    }
                }
                for (let j = 0, len = this.retrievalOk[key].length; j < len; j++) {
                    if (this.retrievalOk[key][j]) {
                        //闪烁效果
                        let block = this.createBitmapByName("bling");
                        block.x = this.RectContainer.x + 4 + 41 * key;
                        block.y = this.stageH - 3 - 41 * (j + 1) + 336;
                        block.width = 41;
                        block.height = 41;
                        this.addChild(block);
                        egret.Tween.get(block)
                            .to({ alpha: 0 }, 50)
                            .to({ alpha: 1 }, 50)
                            .call(() => {
                                this.removeChild(block);
                            });
                        this.RectContainer.removeChild(this.matrixArr[key][j]);
                    }
                }
            }
            //方块下落，填充位置
            for (let key = moveDown.length - 1; key >= 0; key--) {
                egret.Tween.get(this.matrixArr[moveDown[key].x][moveDown[key].y])
                    .to({ y: this.matrixArr[moveDown[key].x][moveDown[key].y].y + 41 * moveDown[key].num }, 180);
            }
            for (let i in this.retrievalOk)
                for (let j = this.retrievalOk[i].length - 1; j >= 0; j--) {
                    if (this.retrievalOk[i][j])
                        this.matrixArr[i].splice(j, 1);
                }

            //下一关
            this.t_score.text = String(this.totalScore);
            if (this.totalScore >= (this.hardLevelArr[this.Level].w * this.hardLevelArr[this.Level].h - 20)) {
                this.totalScore = 0;
                egret.Tween.get(this.RectContainer)
                    .to({ y: this.stageH }, 500)
                    .call(() => {
                        this.Level++;
                        this.InitGame(this.Level);
                    });
            }
        }
        //方块纵向空出，向中心填充位置
        this.MoveCount = 1;
        this.SetVerticalChange();
        //重新初始化遍历记录矩阵
        this.alreadyRet = [];
        this.retrievalOk = [];
        this.count = 0;
        for (let i in this.matrixArr) {
            this.alreadyRet[i] = [];
            this.retrievalOk[i] = [];
            for (let j in this.matrixArr[i]) {
                this.alreadyRet[i][j] = false;
                this.retrievalOk[i][j] = false;
            }
        }
    }
    private MoveCount: number = 1;
    private HideCount: number = 0;
    private SetVerticalChange(): void {
        let w: number = 9;
        let h: number = 8;
        let moveMildle = []; // 记录移除信息
        if (this.hardLevelArr[this.Level]) {
            w = this.hardLevelArr[this.Level].w;
            h = this.hardLevelArr[this.Level].h;
        }
        let index = -1;
        let empty: number = 0;
        let tempArr: any = [];
        let tempIndex: number = 0;
        for (let j = 0; j < w; j++) {
            if (this.matrixArr[j].length == 0) {
                index = j; empty++;
                for (let i = index; i < w; i++) {
                    for (let k = 0; k < this.matrixArr[i].length; k++) {
                        egret.Tween.get(this.matrixArr[i][k])
                            .to({ x: this.matrixArr[i][k].x - 41 * this.MoveCount }, 180);
                    }
                }
            } else {
                tempArr[tempIndex] = [];
                tempArr[tempIndex] = this.matrixArr[j];
                tempIndex++;
            }
        }
        for (let j = 0; j < w; j++) {
            if (tempArr[j]) {
                this.matrixArr[j] = tempArr[j];
            } else {
                this.matrixArr[j] = [];
            }
        }
        if (this.HideCount == 0) {
            this.HideCount = empty;
            if (empty > 1) {
                for (let i = index; i < w; i++) {
                    for (let k = 0; k < this.matrixArr[i].length; k++) {
                        egret.Tween.removeTweens(this.matrixArr[i][k]);
                    }
                }
                this.Tips.alpha = 1;
                egret.Tween.get(this.Tips).to({ alpha: 0 }, 2000);
            }
        }
        else {
            if (empty - this.HideCount > 1) {
                this.HideCount = empty;
                for (let i = index; i < w; i++) {
                    for (let k = 0; k < this.matrixArr[i].length; k++) {
                        egret.Tween.removeTweens(this.matrixArr[i][k]);
                    }
                }
                this.Tips.alpha = 1;
                egret.Tween.get(this.Tips).to({ alpha: 0 }, 2000);
            }
            this.HideCount = empty;
        }
        let TempmatrixArr = this.matrixArr;
        this.RectContainer.removeChildren();
        //初始化方块
        for (let j = 0; j < TempmatrixArr.length; j++) {
            for (let i = 0; i < TempmatrixArr[j].length; i++) {
                let bl = this.matrixArr[j][i];
                this.RectContainer.addChild(bl);
                bl.x = 4 + 41 * j;
                bl.y = this.stageH - 3 - 41 * (i + 1);
            }
        }
        this.matrixArr = TempmatrixArr;
        this.RectContainer.width = tempArr.length * 41 + 4;
        this.RectContainer.x = (this.stageW - this.RectContainer.width) / 2;
    }
    //获取点击位置
    private getPosition(e: egret.TouchEvent): any {
        let stageH = this.stage.stageHeight;
        let position = { x: 0, y: 0 };
        position.x = Math.floor((e.$stageX - 4 - this.RectContainer.x) / 41);
        position.y = Math.floor(-(e.$stageY - stageH + 3) / 41);
        return position;
    }
    private count: number = 0;
    //遍历矩阵
    private retrieval(position: { x: number, y: number }, matrix: any, alreadyRet: any, retrievalOk: any) {
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
        if (position.x < this.hardLevelArr[this.Level].w - 1 && matrix[position.x + 1][position.y] != undefined && matrix[position.x][position.y].name === matrix[position.x + 1][position.y].name) {
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
    private touch(e: egret.Event): void {
        switch (e.currentTarget) {
            case this.Btnhome:
                let parent = this.parent;
                parent.visible = false;
                parent.removeChild(this);
                break;
            case this.Btnpause:
                this.TipGroup.visible = true;
                break;
            case this.BgClose:
                this.TipGroup.visible = false;
                break;
            case this.BtnReplay:
                this.totalScore = 0;
                this.InitGame(this.Level);
                break;
            case this.BtnAddLevel:
                this.totalScore = 0;
                this.Level++;
                this.InitGame(this.Level);
                break;
            default:
                break;
        }
    }
}