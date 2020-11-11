class GuideItem extends BaseView {
    private myCfg: guideCfg;
    private infoLab: eui.Label;
    private touchRect: eui.Rect;

    private showGroup: eui.Group;
    private arrowImg: eui.Image;

    private myAni: MovieClip;
    private myIndex: number = 0;

    private arrowMovePos = [
        { x:0 , y:-20 },
        { x:0 , y:20 },
        { x:-20 , y:0 },
        { x:20 , y:0 },
        { x:0 , y:0 },
    ]

    public constructor( cfg: guideCfg ) {
        super();
        this.skinName = `GuideItemSkin${cfg.bg == 4 ? cfg.bg : 0}`;
        this.myIndex = cfg.bg;
        this.myCfg = cfg;
        this.addEventListener( egret.Event.ADDED_TO_STAGE , this.addViewHandler , this );
    }

    private addViewHandler( event: egret.Event ):void {
        this.init();
        this.removeEventListener( egret.Event.ADDED_TO_STAGE , this.addViewHandler , this );
        this.addEventListener( egret.Event.REMOVED_FROM_STAGE , this.removeViewHandler , this );
    }

    private removeViewHandler( event: egret.Event ):void {
        this.removeEventListener( egret.Event.REMOVED_FROM_STAGE , this.removeViewHandler , this );
    }

    private init():void {
        this.adapter();
        this.infoLab.text = this.myCfg.info;
        if( this.myIndex <= 3 ) {
            let myPos = this.arrowMovePos[this.myCfg.bg];
            let dir = {
                x:myPos.x == 0 ? myPos.x : (myPos.x / Math.abs( myPos.x )),
                y:myPos.y == 0 ? myPos.y : (myPos.y / Math.abs( myPos.y )),
            }
            // this.showGroup.anchorOffsetX = this.touchRect.x;
            // this.showGroup.anchorOffsetY = this.touchRect.y;
            // this.showGroup.x = this.myCfg.x;
            // this.showGroup.y = this.myCfg.y;
            this.myAni = new MovieClip();
            this.addChild( this.myAni );
            this.myAni.x = this.myCfg.x;
            this.myAni.y = this.myCfg.y;
            // this.showGroup.visible = false;
            this.arrowImg.rotation = this.arrowDir[this.myCfg.bg];
            this.arrowImg.x = (myPos.x * 5);
            this.arrowImg.y = (myPos.y * 3);
            this.touchRect.x = this.myCfg.x;
            this.touchRect.y = this.myCfg.y;
            this.showGroup.x = (this.myCfg.x - dir.x * 120 - 82 * dir.x);
            this.showGroup.y = (this.myCfg.y - dir.y * 120 - 30 * dir.y);
            // TipsBox.showTips( this.myCfg.info , 
            // (this.myCfg.x - dir.x * 120 - 82 * dir.x) , 
            // (this.myCfg.y - dir.y * 120 - 40 * dir.y) , this );
            TipsBox.showTips( this.myCfg.info , 0 , 0 , this.showGroup );
        } else {
            this.touchRect.x = this.myCfg.x;
            this.touchRect.y = this.myCfg.y;
            this.myAni = new MovieClip();
            this.addChild( this.myAni );
            let s = this.touchRect.y > StageUtils.inst().getHeight()/2 ? -1 : 1;
            this.showGroup.y = this.touchRect.y + 150 * s;
            this.showGroup.visible = this.myCfg.target == "role" || this.myCfg.target == "skill" ? false : true;
            if( this.myCfg.target == "role" || this.myCfg.target == "skill" ) {
                MessageManager.inst().dispatch( CustomEvt.REMOVE_GUIDE_MASK );
            }
        }
        this.arrowAni();
        this.myAni.playFile( `resource/res/animate/guide` , -1 );
        this.myAni.x = this.touchRect.x;
        this.myAni.y = this.touchRect.y;
        this.myAni.touchEnabled = true;
        this.myAni.addEventListener( egret.TouchEvent.TOUCH_TAP , this.touchTapHandler , this );
    }

    private arrowDir = [
        0 , 180 , -90 , 90 , 0
    ];

    private touchNum: number = 0;
    private touchTapHandler( event: egret.TouchEvent ):void {
        switch( this.touchNum ) {
            case 0:
                if( this.myIndex == 4 && this.myCfg.target != "role" && this.myCfg.target != "skill" ) {
                    this.showGroup.visible = false;
                    MessageManager.inst().dispatch( CustomEvt.REMOVE_GUIDE_MASK );
                } else {
                    MessageManager.inst().dispatch( CustomEvt.GUIDE_CLICK_INFO , [ this ] );
                    this.myCfg.fun();
                }
                break;
            case 1:
                MessageManager.inst().dispatch( CustomEvt.GUIDE_CLICK_INFO , [ this ] );
                this.myCfg.fun();
                break;
        }
        this.touchNum ++;
    }

    private adapter():void {
        this.width = StageUtils.inst().getWidth();
        this.height = StageUtils.inst().getHeight();
    }

    private arrowAni():void {
        let pos = { x:this.showGroup.x , y: this.showGroup.y };
        let movePos = this.arrowMovePos[this.myIndex]
        egret.Tween.get( this.showGroup , { loop:true } )
        .to( { x:this.showGroup.x + movePos.x , y: this.showGroup.y + movePos.y } , 300 )
        .to( { x:pos.x , y: pos.y } , 300 );
    }
}