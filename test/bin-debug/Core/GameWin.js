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
var GameWin = (function (_super) {
    __extends(GameWin, _super);
    function GameWin() {
        var _this = _super.call(this) || this;
        _this._isInit = false;
        _this.Level = 0; //游戏难度
        _this.totalScore = 0; //分数
        _this.level = new egret.Sprite(); //分数精灵
        _this.levelNo = 1; //关卡
        _this.stageW = 640;
        _this.stageH = 800;
        _this.matrixArr = []; //位置矩阵
        _this.alreadyRet = []; //已经遍历过
        _this.retrievalOk = []; //选中项
        /**关卡配置*/
        _this.hardLevelArr = [{ w: 9, h: 8 }, { w: 10, h: 9 }, { w: 11, h: 10 }, { w: 12, h: 11 }, { w: 13, h: 12 }, { w: 14, h: 13 },
            { w: 15, h: 14 }, { w: 15, h: 15 }, { w: 15, h: 16 }, { w: 15, h: 17 }, { w: 15, h: 18 }, { w: 15, h: 19 }, { w: 15, h: 20 }];
        _this.MoveCount = 1;
        _this.HideCount = 0;
        _this.count = 0;
        _this.skinName = "resource/eui_skins/gameViewSkin.exml";
        return _this;
    }
    GameWin.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    GameWin.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.Init();
    };
    GameWin.prototype.Init = function () {
        this.t_score.text = "0";
        this.Btnhome.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.Btnpause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.BtnReplay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.BtnAddLevel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touch, this);
        this.RectContainer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.CheckRect, this);
        var num = Number(egret.localStorage.getItem('LastStarNum')) ? Number(egret.localStorage.getItem('LastStarNum')) : 0;
        this.InitGame(num);
    };
    /**初始化游戏*/
    GameWin.prototype.InitGame = function (level) {
        egret.localStorage.setItem('LastStarNum', String(level));
        this.hard_text.text = String("难度：" + level + "级");
        this.t_score.text = String("0");
        this.Level = level;
        var w = 9;
        var h = 8;
        if (this.hardLevelArr[level]) {
            w = this.hardLevelArr[level].w;
            h = this.hardLevelArr[level].h;
        }
        else {
            this.Level = 0;
        }
        this.t_target_score.text = String("目标分值:" + (this.hardLevelArr[this.Level].w * this.hardLevelArr[this.Level].h - 20));
        this.RectContainer.width = w * 41 + 4;
        this.RectContainer.removeChildren();
        //初始化方块
        for (var j = 0; j < w; j++) {
            this.matrixArr[j] = [];
            this.alreadyRet[j] = [], this.retrievalOk[j] = [];
            for (var i = 0; i < h; i++) {
                var index = Math.floor(Math.random() * 5);
                var bl = this.createBitmapByName("bl" + index);
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
    };
    GameWin.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = new eui.Image();
        result.texture = RES.getRes(name + "_png");
        return result;
    };
    GameWin.prototype.CheckRect = function (e) {
        var _this = this;
        var position = this.getPosition(e); //通过点击坐标确定点击的方块
        console.log("点击坐标：", position.x, position.y);
        if (this.matrixArr[position.x][position.y]) {
            this.retrieval(position, this.matrixArr, this.alreadyRet, this.retrievalOk); //遍历矩阵
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
            }
            egret.Tween.get(score_1)
                .to({ alpha: 0 }, 1)
                .to({ alpha: 1, y: 100 }, 200)
                .wait(400)
                .call(function () {
                _this.removeChild(score_1);
            });
            //移除操作
            for (var key = 0, len = this.retrievalOk.length; key < len; key++) {
                var dIndex = -1;
                var num = 0;
                for (var i = 0, len_1 = this.retrievalOk[key].length; i < len_1; i++) {
                    if (this.retrievalOk[key][i]) {
                        num++;
                        dIndex = i;
                    }
                    else {
                        if (dIndex !== -1)
                            moveDown.push({ x: key, y: i, num: num });
                    }
                }
                var _loop_1 = function (j, len_2) {
                    if (this_1.retrievalOk[key][j]) {
                        //闪烁效果
                        var block_1 = this_1.createBitmapByName("bling");
                        block_1.x = this_1.RectContainer.x + 4 + 41 * key;
                        block_1.y = this_1.stageH - 3 - 41 * (j + 1) + 336;
                        block_1.width = 41;
                        block_1.height = 41;
                        this_1.addChild(block_1);
                        egret.Tween.get(block_1)
                            .to({ alpha: 0 }, 50)
                            .to({ alpha: 1 }, 50)
                            .call(function () {
                            _this.removeChild(block_1);
                        });
                        this_1.RectContainer.removeChild(this_1.matrixArr[key][j]);
                    }
                };
                var this_1 = this;
                for (var j = 0, len_2 = this.retrievalOk[key].length; j < len_2; j++) {
                    _loop_1(j, len_2);
                }
            }
            //方块下落，填充位置
            for (var key = moveDown.length - 1; key >= 0; key--) {
                egret.Tween.get(this.matrixArr[moveDown[key].x][moveDown[key].y])
                    .to({ y: this.matrixArr[moveDown[key].x][moveDown[key].y].y + 41 * moveDown[key].num }, 180);
            }
            for (var i in this.retrievalOk)
                for (var j = this.retrievalOk[i].length - 1; j >= 0; j--) {
                    if (this.retrievalOk[i][j])
                        this.matrixArr[i].splice(j, 1);
                }
            //下一关
            this.t_score.text = String(this.totalScore);
            if (this.totalScore >= (this.hardLevelArr[this.Level].w * this.hardLevelArr[this.Level].h - 20)) {
                this.totalScore = 0;
                egret.Tween.get(this.RectContainer)
                    .to({ y: this.stageH }, 500)
                    .call(function () {
                    _this.Level++;
                    _this.InitGame(_this.Level);
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
        for (var i in this.matrixArr) {
            this.alreadyRet[i] = [];
            this.retrievalOk[i] = [];
            for (var j in this.matrixArr[i]) {
                this.alreadyRet[i][j] = false;
                this.retrievalOk[i][j] = false;
            }
        }
    };
    GameWin.prototype.SetVerticalChange = function () {
        var w = 9;
        var h = 8;
        var moveMildle = []; // 记录移除信息
        if (this.hardLevelArr[this.Level]) {
            w = this.hardLevelArr[this.Level].w;
            h = this.hardLevelArr[this.Level].h;
        }
        var index = -1;
        var empty = 0;
        var tempArr = [];
        var tempIndex = 0;
        for (var j = 0; j < w; j++) {
            if (this.matrixArr[j].length == 0) {
                index = j;
                empty++;
                for (var i = index; i < w; i++) {
                    for (var k = 0; k < this.matrixArr[i].length; k++) {
                        egret.Tween.get(this.matrixArr[i][k])
                            .to({ x: this.matrixArr[i][k].x - 41 * this.MoveCount }, 180);
                    }
                }
            }
            else {
                tempArr[tempIndex] = [];
                tempArr[tempIndex] = this.matrixArr[j];
                tempIndex++;
            }
        }
        for (var j = 0; j < w; j++) {
            if (tempArr[j]) {
                this.matrixArr[j] = tempArr[j];
            }
            else {
                this.matrixArr[j] = [];
            }
        }
        if (this.HideCount == 0) {
            this.HideCount = empty;
            if (empty > 1) {
                for (var i = index; i < w; i++) {
                    for (var k = 0; k < this.matrixArr[i].length; k++) {
                        egret.Tween.removeTweens(this.matrixArr[i][k]);
                    }
                }
            }
        }
        else {
            if (empty - this.HideCount > 1) {
                this.HideCount = empty;
                for (var i = index; i < w; i++) {
                    for (var k = 0; k < this.matrixArr[i].length; k++) {
                        egret.Tween.removeTweens(this.matrixArr[i][k]);
                    }
                }
            }
            this.HideCount = empty;
        }
        var TempmatrixArr = this.matrixArr;
        this.RectContainer.removeChildren();
        //初始化方块
        for (var j = 0; j < TempmatrixArr.length; j++) {
            for (var i = 0; i < TempmatrixArr[j].length; i++) {
                var bl = this.matrixArr[j][i];
                this.RectContainer.addChild(bl);
                bl.x = 4 + 41 * j;
                bl.y = this.stageH - 3 - 41 * (i + 1);
            }
        }
        this.matrixArr = TempmatrixArr;
        this.RectContainer.width = tempArr.length * 41 + 4;
        this.RectContainer.x = (this.stageW - this.RectContainer.width) / 2;
    };
    //获取点击位置
    GameWin.prototype.getPosition = function (e) {
        var stageH = this.stage.stageHeight;
        var position = { x: 0, y: 0 };
        position.x = Math.floor((e.$stageX - 4 - this.RectContainer.x) / 41);
        position.y = Math.floor(-(e.$stageY - stageH + 3) / 41);
        return position;
    };
    //遍历矩阵
    GameWin.prototype.retrieval = function (position, matrix, alreadyRet, retrievalOk) {
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
    GameWin.prototype.createNumber = function (num, sprite, width, height, x, y) {
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
    GameWin.prototype.touch = function (e) {
        switch (e.currentTarget) {
            case this.Btnhome:
                var parent_1 = this.parent;
                parent_1.visible = false;
                parent_1.removeChild(this);
                break;
            case this.Btnpause:
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
    };
    return GameWin;
}(eui.Component));
__reflect(GameWin.prototype, "GameWin", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=GameWin.js.map