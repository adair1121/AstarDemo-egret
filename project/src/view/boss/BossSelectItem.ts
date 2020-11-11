class BossSelectItem extends BaseView {
    private selectBtn: eui.Button;

    private myIndex: number = 0;

    public constructor( index: number ) {
        super();
        this.skinName = `BossSelectItemSkin`;
        this.myIndex = index;
        this.addEventListener( egret.Event.ADDED_TO_STAGE , this.addViewHandler , this );
    }

    private addViewHandler( event: egret.Event ):void {
        this.init();
        this.removeEventListener( egret.Event.ADDED_TO_STAGE , this.addViewHandler , this );
        this.addEventListener( egret.Event.REMOVED_FROM_STAGE , this.removeViewHandler , this );
        this.addTouchEvent( this.selectBtn , this.touchBtnHandler , false );
        MessageManager.inst().addListener( CustomEvt.BOSS_SELECT , this.bossSelectHandler , this );
    }

    private removeViewHandler( event: egret.Event ):void {
        this.removeEventListener( egret.Event.REMOVED_FROM_STAGE , this.removeViewHandler , this );
        this.removeTouchEvent( this.selectBtn , this.touchBtnHandler );
        MessageManager.inst().removeListener( CustomEvt.BOSS_SELECT , this.bossSelectHandler , this );
    }

    private init():void {
        this.selectBtn.label = `${this.cfg_arr[this.myIndex]}`;
        this.selectBtn.currentState = this.myIndex == 0 ? "disabled" : "up";
    }

    private touchBtnHandler( event: egret.TouchEvent ):void {
        MessageManager.inst().dispatch( CustomEvt.BOSS_SELECT , [ this.myIndex ] );
    }

    private bossSelectHandler( event: CustomEvt ):void {
        this.selectBtn.currentState = this.myIndex == event.data[0] ? "disabled" : "up";
    }

    private cfg_arr = [
        "天妖Boss",
        "妖将Boss",
        "妖王Boss",
        "妖皇Boss",
        "妖帝Boss",
        "妖神Boss",
        "魔王Boss",
        "魔皇Boss",
        "魔帝Boss",
        "魔神Boss",
    ]
}