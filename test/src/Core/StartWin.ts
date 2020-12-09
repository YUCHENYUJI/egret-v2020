class StartWin extends eui.Component implements eui.UIComponent {
    constructor() {
        super();
        this.skinName = "resource/eui_skins/StartPageSkin.exml";
    }
    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
    }

    private _isInit: boolean = false;
    private LastServerView: eui.Group; //最近登录视图group
    protected childrenCreated(): void {
        super.childrenCreated();
        this.Init();
    }
    private Btn_Music: eui.Image;
    private Btn_Start: eui.Button;
    private ViewContainer: eui.Group;
    private tips: eui.Label;
    private Init() {
        this.ViewContainer.visible = false;
        this.tips.visible = false;
        this.Btn_Start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToGameView, this);
        this.Btn_Music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.IsOpenMusic, this);
    }
    private IsOpen: boolean = false;//是否开启音乐
    private IsOpenMusic(): void {
        this.BtnChange(this.Btn_Music);
        this.tips.visible = true;
        if (this.IsOpen) {
            this.Btn_Music.texture = RES.getRes("sound_off_btn_png");
            this.IsOpen = false;
        } else {
            this.Btn_Music.texture = RES.getRes("sound_on_btn_png");
            this.IsOpen = true;
        }
    }
    private BtnChange(obj: any): void {
        egret.Tween.removeTweens(obj);
        egret.Tween.get(obj)
            .to({ scaleY: 1.1, scaleX: 1.1 }, 150)
            .to({ scaleY: 1, scaleX: 1 }, 150);
    }
    private gameView: GameWin;
    private ToGameView(): void {
        this.ViewContainer.visible = true;
        this.ViewContainer.addChild(new GameWin());
    }
}
