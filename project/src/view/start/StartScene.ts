// TypeScript file
class StartScene extends BaseEuiView {
    // ui
    private baseGroup: eui.Group;
    private startBg: eui.Image;
    private startBtn: eui.Button;
    private txt_label:eui.Label;
    public constructor() {
        super();
    }

    public open(...param):void {
        GameApp.inst().loadingRes("preload", () => {}, false)
        this.baseGroup["autoSize"]();
        this.bottomGroup["autoSize"]();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this)
        this.initStartGameBtn();

        this.showStartAction();
        this.showTestParticle();

        // console.log('open start skin', this.touchEnabled);
       
    }

    public close(): void {
        // this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
    }

    public test (): void{
        
    }

    private onTap(evt:egret.TouchEvent): void {
        // console.log(evt.target, " ===== touych")
        if (evt.target == this.btnGroup) {
            console.log("开始按钮");
            this.setStartBtnScale(1);

            // 跳转···
            GameApp.inst().load();
            ViewManager.inst().close(StartScene);
            ViewManager.inst().open(CreateRole);
        }
    }

    private touchFlag: boolean = false;
    private _startBtn: egret.MovieClip = null;
    private initStartGameBtn(): void{
        // (<eui.Label>this.startBtn.labelDisplay).size = 40;
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        var data = RES.getRes("startGameMc_json");
        var txtr = RES.getRes("startGameMc_png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        var startBtn: egret.MovieClip = new egret.MovieClip( mcFactory.generateMovieClipData( "startGameMc" ) );
        startBtn.x = 0;
        startBtn.y = 0;
        this.btnGroup.addChild( startBtn );
        startBtn.gotoAndPlay( 1 ,-1);

    }

    private bottomGroup: eui.Group;
    private role_right: eui.Image;
    private role_left: eui.Image;
    private role_rect: eui.Image;
    private title: eui.Image;
    private roleLeftPos: eui.Group;
    private roleRightPos: eui.Group;
    private showStartAction(): void{
        this.role_right.x = -this.role_right.width;
        this.role_right.y = this.role_right.height;
        this.role_left.x = StageUtils.inst().getWidth();
        this.role_left.y = -this.role_left.height;
        
        this.title.y = -this.title.height;
        egret.Tween.get(this.role_right).to({x: this.roleRightPos.x, y: this.roleRightPos.y}, 800, egret.Ease.backOut);
        egret.Tween.get(this.role_left).to({x: this.roleLeftPos.x, y: this.roleLeftPos.y}, 800, egret.Ease.backOut);
        egret.Tween.get(this.title).to({y: 25}, 800, egret.Ease.sineInOut);
        egret.setTimeout(() => {
            this.role_rect.visible = true;
        }, this, 800)

        this.bottomGroup.y = StageUtils.inst().getHeight() + 200;
        egret.Tween.get( this.bottomGroup )
            .to( {y: StageUtils.inst().getHeight()}, 800, egret.Ease.sineInOut);
        
    }

    private setStartBtnScale(scale: number): void{
        this.startBtn.scaleX = scale;
        this.startBtn.scaleY = scale;
    }

    private startTouchBegin(event: egret.TouchEvent): void {
        if (!this.touchFlag) {
            this.setStartBtnScale(0.9);
            this.touchFlag = true;
        }
    }

    private startTouchEnd(event: egret.TouchEvent): void{
        if (this.touchFlag) {
            this.setStartBtnScale(1);

            // 跳转···
            GameApp.inst().load();
            ViewManager.inst().close(StartScene);
            ViewManager.inst().open(CreateRole);
            this.touchFlag = false;
        }
    }

    private startTouchCancle(): void{
        if (this.touchFlag) {
            this.setStartBtnScale(1);

            this.touchFlag = false;
        }
    }

    private btnGroup: eui.Group;
    showTestParticle() {
        //粒子效果
        RES.addEventListener( RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this );
        RES.addEventListener( RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this );
        RES.loadGroup("particle");
    }

    private particleNode_r: eui.Group;
    private particleNode_l: eui.Group;
    private onResourceLoadComplete(event: RES.ResourceEvent):void {

        if (event.groupName == "particle") {
            // var particleSys1 = new particle.GravityParticleSystem(RES.getRes("newParticle_png"),RES.getRes("newParticle_json"));
            // this.particleNode_r.addChild(particleSys1);
            // particleSys1.start();

            var particleSys_r = new particle.GravityParticleSystem(RES.getRes("particle_r_png"),RES.getRes("particle_r_json"));
            this.particleNode_r.addChild(particleSys_r);
            particleSys_r.start();
            particleSys_r.rotation = -25;

            var particleSys_top = new particle.GravityParticleSystem(RES.getRes("particle_t_png"),RES.getRes("particle_t_json"));
            this.particleNode_l.addChild(particleSys_top);
            particleSys_top.start();
        }
    }

    private loadErrNum: number = 0;
    private onResourceLoadErr(): void{
        if (this.loadErrNum < 3) {
            RES.loadGroup("particle");
        } else {
            UserTips.inst().showTips("网络异常，请检查网络重新登录！")
        }
        this.loadErrNum ++;
    }
}
ViewManager.inst().reg(StartScene,LayerManager.UI_Main);