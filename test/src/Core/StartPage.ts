class StartPage extends egret.DisplayObjectContainer{
  private platingPage = new playingPage();

  public constructor(){
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.create, this);
  }
  public create(): void{
    let stageW = this.stage.stageWidth;
    let stageH = this.stage.stageHeight;

    //标题
    let title = this.createBitmapByName("game_title");
    this.addChild(title);
    title.width = 300;
    title.height = 210;
    title.anchorOffsetX = 150;
    title.x = stageW * .5;
    title.y = stageH * .2;

    //开始按钮
    let starBtn = this.createBitmapByName("play_btn");
    this.addChild(starBtn);
    starBtn.width = 110;
    starBtn.height = 110;
    starBtn.anchorOffsetX = 55;
    starBtn.x = stageW * .5;
    starBtn.y = stageH * .6;
    starBtn.touchEnabled = true;
    starBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=> {
      this.removeChildren();
      this.addChild(tip);
    }, this);

    //tip
    let tip = this.createBitmapByName("help_info");
    tip.width = stageW * .9;
    tip.height = stageH * .55;
    tip.x = stageW * .05;
    tip.y = 120;
    tip.touchEnabled = true;
    tip.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
      this.removeChild(tip);
      this.addChild(this.platingPage);
    }, this);

    //音乐按钮
    let sound = this.createBitmapByName("sound_on_btn");
    let soundSwitch = true;
    this.addChild(sound);
    sound.width = 60;
    sound.height = 60;
    sound.anchorOffsetX = 60;
    sound.x =  stageW - 12;
    sound.y =  17;
    sound.touchEnabled = true;
    sound.addEventListener(egret.TouchEvent.TOUCH_BEGIN, ()=>{
      if(soundSwitch){
        egret.Tween.get(sound)
          .to({scaleY: 1.1, scaleX: 1.1}, 150)
          .to({scaleY: 1, scaleX: 1}, 150);
        sound.texture = RES.getRes("sound_off_btn");
        soundSwitch = !soundSwitch;
      }
      else{
        egret.Tween.get(sound)
          .to({scaleY: 1.1, scaleX: 1.1}, 150)
          .to({scaleY: 1, scaleX: 1}, 150);
        sound.texture = RES.getRes("sound_on_btn");
        soundSwitch = !soundSwitch;
      }
    }, this);
  }

  private createBitmapByName(name: string) {
    let result = new egret.Bitmap();
    let texture: egret.Texture = RES.getRes(name+"_png");
    result.texture = texture;
    return result;
  }
}