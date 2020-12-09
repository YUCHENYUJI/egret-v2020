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
var StartPage = (function (_super) {
    __extends(StartPage, _super);
    function StartPage() {
        var _this = _super.call(this) || this;
        _this.platingPage = new playingPage();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.create, _this);
        return _this;
    }
    StartPage.prototype.create = function () {
        var _this = this;
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        //标题
        var title = this.createBitmapByName("game_title");
        this.addChild(title);
        title.width = 300;
        title.height = 210;
        title.anchorOffsetX = 150;
        title.x = stageW * .5;
        title.y = stageH * .2;
        //开始按钮
        var starBtn = this.createBitmapByName("play_btn");
        this.addChild(starBtn);
        starBtn.width = 110;
        starBtn.height = 110;
        starBtn.anchorOffsetX = 55;
        starBtn.x = stageW * .5;
        starBtn.y = stageH * .6;
        starBtn.touchEnabled = true;
        starBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.removeChildren();
            _this.addChild(tip);
        }, this);
        //tip
        var tip = this.createBitmapByName("help_info");
        tip.width = stageW * .9;
        tip.height = stageH * .55;
        tip.x = stageW * .05;
        tip.y = 120;
        tip.touchEnabled = true;
        tip.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.removeChild(tip);
            _this.addChild(_this.platingPage);
        }, this);
        //音乐按钮
        var sound = this.createBitmapByName("sound_on_btn");
        var soundSwitch = true;
        this.addChild(sound);
        sound.width = 60;
        sound.height = 60;
        sound.anchorOffsetX = 60;
        sound.x = stageW - 12;
        sound.y = 17;
        sound.touchEnabled = true;
        sound.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            if (soundSwitch) {
                egret.Tween.get(sound)
                    .to({ scaleY: 1.1, scaleX: 1.1 }, 150)
                    .to({ scaleY: 1, scaleX: 1 }, 150);
                sound.texture = RES.getRes("sound_off_btn");
                soundSwitch = !soundSwitch;
            }
            else {
                egret.Tween.get(sound)
                    .to({ scaleY: 1.1, scaleX: 1.1 }, 150)
                    .to({ scaleY: 1, scaleX: 1 }, 150);
                sound.texture = RES.getRes("sound_on_btn");
                soundSwitch = !soundSwitch;
            }
        }, this);
    };
    StartPage.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name + "_png");
        result.texture = texture;
        return result;
    };
    return StartPage;
}(egret.DisplayObjectContainer));
__reflect(StartPage.prototype, "StartPage");
//# sourceMappingURL=StartPage.js.map