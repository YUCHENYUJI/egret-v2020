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
var StartWin = (function (_super) {
    __extends(StartWin, _super);
    function StartWin() {
        var _this = _super.call(this) || this;
        _this._isInit = false;
        _this.IsOpen = false; //是否开启音乐
        _this.skinName = "resource/eui_skins/StartPageSkin.exml";
        return _this;
    }
    StartWin.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    StartWin.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.Init();
    };
    StartWin.prototype.Init = function () {
        this.ViewContainer.visible = false;
        this.Btn_Start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToGameView, this);
        this.Btn_Music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.IsOpenMusic, this);
    };
    StartWin.prototype.IsOpenMusic = function () {
        this.BtnChange(this.Btn_Music);
        if (this.IsOpen) {
            this.Btn_Music.texture = RES.getRes("sound_off_btn_png");
            this.IsOpen = false;
        }
        else {
            this.Btn_Music.texture = RES.getRes("sound_on_btn_png");
            this.IsOpen = true;
        }
    };
    StartWin.prototype.BtnChange = function (obj) {
        egret.Tween.removeTweens(obj);
        egret.Tween.get(obj)
            .to({ scaleY: 1.1, scaleX: 1.1 }, 150)
            .to({ scaleY: 1, scaleX: 1 }, 150);
    };
    StartWin.prototype.ToGameView = function () {
        this.ViewContainer.visible = true;
        this.ViewContainer.addChild(new GameWin());
    };
    return StartWin;
}(eui.Component));
__reflect(StartWin.prototype, "StartWin", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=StartWin.js.map