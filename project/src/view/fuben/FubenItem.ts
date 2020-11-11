class FubenItem extends BaseView {
    private bgImg: eui.Image;
    private nameLab: eui.Label;
    private syTitleLab: eui.Label;
    private syLab: eui.Label;
    private cdLab: eui.Label;
    private titleImg: eui.Image;

    private myIndex: number = 0;
    private myCfg = null;

    public constructor( index: number ) {
        super();
        this.skinName = `FubenItemSkin`;
        this.myIndex = index;
        this.myCfg = this.cfg_arr[index];
        this.addEventListener( egret.Event.ADDED_TO_STAGE , this.add_view_handler , this );
    }

    private add_view_handler( event: egret.Event ):void {
        this.init();
        this.removeEventListener( egret.Event.ADDED_TO_STAGE , this.add_view_handler , this );
        this.addEventListener( egret.Event.REMOVED_FROM_STAGE , this.remove_view_handler , this );
        this.addEventListener( egret.Event.ENTER_FRAME , this.enterFrameHandler , this );
        this.addTouchEvent( this , this.touchTapHandler , true );
    }

    private remove_view_handler( event: egret.Event ):void {
        this.removeEventListener( egret.Event.REMOVED_FROM_STAGE , this.remove_view_handler , this );
        this.removeEventListener( egret.Event.ENTER_FRAME , this.enterFrameHandler , this );
        this.removeTouchEvent( this , this.touchTapHandler );
    }

    private init():void {
        let cfg = this.cfg_arr[this.myIndex];
        let roleLevel = GameApp.inst().roleAttr.roleLevel;
        this.bgImg.source = `fuben_item_bg_${this.myIndex}_png`;
        this.titleImg.source = `fuben_item_title_${this.myIndex}_png`;
        // this.nameLab.text = `${cfg.name}`;
        // this.syTitleLab.text = `${roleLevel}级收益效率:`;
        // this.syLab.text = `${cfg.sy * roleLevel}/10分钟`;
        
    }

    private touchTapHandler():void {
        if( this.getCD() <= 0 ) {
            UserTips.inst().showTips( "今日时间已经用尽！" );
        } else {
            // let fubenTimes = GameApp.inst().fubenData.fubenTimes;
            // let second = this.getSecond();
            // fubenTimes[this.myIndex] = second;
            // GameApp.inst().refreshFuBenData("fubenTimes",fubenTimes);
            // GameApp.inst().refreshFubenCdTime( this.myIndex , this.getSecond() );
            FubenView.playCfg.openIndex = this.myIndex;
            FubenView.playCfg.open = true;
            BattleCom.inst().runToScene(this.sceneState[this.myIndex]);
            ViewManager.inst().close( FubenView );
        }
    }

    private sceneState = [
        FUBEN.FUBEN_GOLD,
        FUBEN.FUBEN_EXP,
        FUBEN.FUBEN_STONE
    ]

    private enterFrameHandler( event: egret.Event ):void {
        let cd = this.getCD();
        this.cdLab.visible = cd > 0 ? true : false;
        this.cdLab.text = "今日剩余: " + DateUtils.getFormatTimeByStyle( cd < 0 ? 0 : cd , DateUtils.STYLE_4);
    }

    private getSecond():number {
        let date = new Date();
        let time = date.getTime();
        let second = Math.floor( time / 1000 );
        return second;
    }

    private getCD():number {
        let cd = GameApp.inst().fubenData.fubenTimes[this.myIndex];
        return cd;
    }

    private cfg_arr = [
        {
            name:"元宝",
            sy:55,
            cd:86400
        },
        {
            name:"经验",
            sy:555,
            cd:86400
        },
        {
            name:"强化石",
            sy:5,
            cd:86400
        },
    ]
}