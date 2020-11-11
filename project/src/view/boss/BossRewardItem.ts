class BossRewardItem extends BaseView {
    private headImg: eui.Image;
    private bgImg: eui.Image;
    private starLevLab: eui.Label;

    private effGroup: eui.Group;

    private effAni: MovieClip;

    private myCfg: GoodsData = null;

    public constructor( cfg: any ) {
        super();
        this.skinName = `BossRewardItemSkin`;
        this.myCfg = cfg;
        this.addEventListener( egret.Event.ADDED_TO_STAGE , this.addViewHandler , this );
    }

    private addViewHandler( event: egret.Event ):void {
        this.init();
        this.removeEventListener( egret.Event.ADDED_TO_STAGE , this.addViewHandler , this );
        this.addEventListener( egret.Event.REMOVED_FROM_STAGE , this.removeViewHandler , this );
        this.addTouchEvent( this , this.touchTapHandler , false );
    }

    private removeViewHandler( event: egret.Event ):void {
        this.removeEventListener( egret.Event.REMOVED_FROM_STAGE , this.removeViewHandler , this );
        this.removeTouchEvent( this , this.touchTapHandler );
    }

    private init():void {
        this.effAni = new MovieClip();
        this.effGroup.addChild( this.effAni );
        this.effAni.x = this.width/2;
        this.effAni.y = this.height/2;
    }

    public resetUI( cfg: any ):void {
        this.myCfg = cfg;
        // this.headImg.source = `item_${cfg.modelId}_png`;
        this.bgImg.source = `item_box_${cfg.quality}_png`;
        this.starLevLab.text = `${cfg.starLev}阶`;
        this.effAni.playFile( `resource/res/animate/quality_effect_${cfg.quality}` , -1 );
        this.headImg.source = `item_${cfg.modelId}_png`;
    }

    private touchTapHandler( event: egret.TouchEvent ):void {
        ViewManager.inst().open(BagDetails, [this.myCfg.itemId]);
    }
}