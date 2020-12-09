var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var playingPage = (function (_super) {
    __extends(playingPage, _super);
    function playingPage() {
        var _this = _super.call(this) || this;
        _this.totalScore = 0; //分数
        _this.level = new egret.Sprite(); //分数精灵
        _this.levelNo = 1; //关卡
        _this.count = 0; //消除数量
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.init, _this);
        return _this;
    }
    playingPage.prototype.init = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        //顶栏背景
        var title = this.createBitmapByName("hud_bg");
        this.addChild(title);
        title.width = stageW;
        title.height = 40;
        //关卡
        this.createNumber(1, this.level, 20, 22, 30, 9);
        this.addChild(this.level);
        //分数背景
        var bar1_bg = this.createBitmapByName("bar1_bg");
        this.addChild(bar1_bg);
        bar1_bg.width = 120;
        bar1_bg.height = 28;
        bar1_bg.x = 53;
        bar1_bg.y = 6;
        //push
        var push_btn = this.createBitmapByName("push_btn");
        this.addChild(push_btn);
        push_btn.width = 35;
        push_btn.height = 35;
        push_btn.x = 183;
        push_btn.y = 4;
        //剩余时间栏背景
        var bar2_bg = this.createBitmapByName("bar2_bg");
        this.addChild(bar2_bg);
        bar2_bg.width = 80;
        bar2_bg.height = 28;
        bar2_bg.x = 228;
        bar2_bg.y = 6;
        //剩余时间栏前景
        var bar2_fill = this.createBitmapByName("bar2_fill");
        this.addChild(bar2_fill);
        bar2_fill.width = 80;
        bar2_fill.height = 28;
        bar2_fill.x = 228;
        bar2_fill.y = 6;
        //暂停按钮
        var pause_btn = this.createBitmapByName("pause_btn");
        this.addChild(pause_btn);
        pause_btn.width = 35;
        pause_btn.height = 35;
        pause_btn.x = 318;
        pause_btn.y = 4;
        //spikes_block
        var spikes_block = this.createBitmapByName("spikes_block");
        this.addChild(spikes_block);
        spikes_block.width = stageW;
        spikes_block.height = 38;
        spikes_block.y = 37;
        spikes_block.x = 9;
        this.createBlock();
    };
    //创建方块
    playingPage.prototype.createBlock = function () {
        var stageH = this.stage.stageHeight;
        var stageW = this.stage.stageWidth;
        var position; //储存点击矩阵位置
        var matrix = []; //位置矩阵
        var alreadyRet = []; //已经遍历过
        var retrievalOk = []; //选中项
        var scoreBox = new egret.Sprite();
        var bg = this.parent.parent.getChildAt(0); //获取背景精灵
        var bling = this.createBitmapByName("bling");
        var Matrix = new egret.Sprite();
        this.createNumber(this.totalScore, scoreBox, 23, 23, 113, 10);
        this.addChild(scoreBox);
        bling.width = 40;
        bling.height = 41;
        //初始化9*8方块
        this.addChild(Matrix);
        for (var j = 0; j < 9; j++) {
            matrix[j] = [];
            alreadyRet[j] = [], retrievalOk[j] = [];
            for (var i = 0; i < 8; i++) {
                var index = Math.floor(Math.random() * 5);
                var bl = this.createBitmapByName("bl" + index);
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
            var _this = this;
            position = this.getPosition(e); //通过点击坐标确定点击的方块
            if (matrix[position.x][position.y]) {
                this.retrieval(position, matrix, alreadyRet, retrievalOk); //遍历矩阵
            }
            else {
                console.log("方块不存在");
                return;
            }
            if (this.count >= 2) {
                var score_1 = new egret.Sprite();
                var moveDown = []; // 记录移除信息
                this.addChild(score_1);
                //提示分数
                this.totalScore += this.count; //分数
                if (this.totalScore >= 30) {
                    this.levelNo++; //关卡
                    this.createNumber(this.levelNo, this.level, 20, 22, 30, 9);
                }
                this.createNumber(this.count, score_1, 100, 100, stageW / 2, -20);
                this.createNumber(this.totalScore, scoreBox, 23, 23, 113, 10);
                egret.Tween.get(score_1)
                    .to({ alpha: 0 }, 1)
                    .to({ alpha: 1, y: 100 }, 200)
                    .wait(400)
                    .call(function () {
                    _this.removeChild(score_1);
                });
                //移除操作
                for (var key = 0, len = retrievalOk.length; key < len; key++) {
                    var dIndex = -1;
                    var num = 0;
                    for (var i = 0, len_1 = retrievalOk[key].length; i < len_1; i++) {
                        if (retrievalOk[key][i]) {
                            num++;
                            dIndex = i;
                        }
                        else {
                            if (dIndex !== -1)
                                moveDown.push({ x: key, y: i, num: num });
                        }
                    }
                    var _loop_1 = function (j, len_2) {
                        if (retrievalOk[key][j]) {
                            //闪烁效果
                            var block_1 = this_1.createBitmapByName("bling");
                            block_1.x = 4 + 41 * key;
                            block_1.y = stageH - 3 - 41 * (j + 1);
                            block_1.width = 41;
                            block_1.height = 41;
                            this_1.addChild(block_1);
                            egret.Tween.get(block_1)
                                .to({ alpha: 0 }, 50)
                                .to({ alpha: 1 }, 50)
                                .call(function () {
                                _this.removeChild(block_1);
                            });
                            Matrix.removeChild(matrix[key][j]);
                        }
                    };
                    var this_1 = this;
                    for (var j = 0, len_2 = retrievalOk[key].length; j < len_2; j++) {
                        _loop_1(j, len_2);
                    }
                }
                //方块下落，填充位置
                for (var key = moveDown.length - 1; key >= 0; key--) {
                    egret.Tween.get(matrix[moveDown[key].x][moveDown[key].y])
                        .to({ y: matrix[moveDown[key].x][moveDown[key].y].y + 41 * moveDown[key].num }, 180);
                }
                for (var i in retrievalOk)
                    for (var j = retrievalOk[i].length - 1; j >= 0; j--) {
                        if (retrievalOk[i][j])
                            matrix[i].splice(j, 1);
                    }
                //下一关
                if (this.totalScore >= 30) {
                    this.totalScore = 0;
                    egret.Tween.get(Matrix)
                        .to({ y: stageH }, 500)
                        .call(function () {
                        bg.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, click, _this);
                        _this.removeChild(scoreBox);
                        _this.removeChild(Matrix);
                        _this.createBlock();
                    });
                }
            }
            //重新初始化遍历记录矩阵
            alreadyRet = [];
            retrievalOk = [];
            this.count = 0;
            for (var i in matrix) {
                alreadyRet[i] = [];
                retrievalOk[i] = [];
                for (var j in matrix[i]) {
                    alreadyRet[i][j] = false;
                    retrievalOk[i][j] = false;
                }
            }
        }
    };
    //获取点击位置
    playingPage.prototype.getPosition = function (e) {
        var stageH = this.stage.stageHeight;
        var position = { x: 0, y: 0 };
        position.x = Math.floor((e.$stageX - 4) / 41);
        position.y = Math.floor(-(e.$stageY - stageH + 3) / 41);
        return position;
    };
    //遍历矩阵
    playingPage.prototype.retrieval = function (position, matrix, alreadyRet, retrievalOk) {
        if (alreadyRet[position.x][position.y])
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
    };
    playingPage.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name + "_png");
        result.texture = texture;
        return result;
    };
    /**
     * 几乎每个游戏都要用到数字，复用率高，写一个创建数字的方法
     * num：要显示的数字
     * sprite：精灵（Sprite），把所有的数字都加入到他的子对象，方便整体操作
     * width：单个数字的宽度
     * height：单个数字的宽度
     * x:数字x坐标，锚点为width/2,就是中间点横坐标。
     * y：最上方点的纵坐标，为了与其他元素保持一致，方便计算。
     */
    playingPage.prototype.createNumber = function (num, sprite, width, height, x, y) {
        var number = num.toString();
        var len = number.length;
        var anchorX = width / 2 * len;
        sprite.removeChildren();
        for (var i = 0; i < len; i++) {
            var item = void 0;
            item = new egret.Bitmap();
            item.texture = RES.getRes("number." + number.charAt(i) + "_png");
            item.width = width;
            item.height = height;
            item.anchorOffsetX = anchorX - width * i;
            item.x = x;
            item.y = y;
            sprite.addChild(item);
        }
    };
    return playingPage;
}(egret.Sprite));
__reflect(playingPage.prototype, "playingPage");
//# sourceMappingURL=playingPage.js.map