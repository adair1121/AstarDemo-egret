class WelcomeView extends BaseEuiView {
    private startBtn: eui.Image;
    private showGroup: eui.Group;

    public constructor() {
        super();
    }

    open( ...param ):void {
        this.showGroup["autoSize"]();
        this.alpha = 0;
        egret.Tween.get( this )
        .wait( 1000 )
        .to( { alpha:1 } , 300 );
        let startY = this.startBtn.y;
        egret.Tween.get( this.startBtn , { loop: true } )
        .to( { y: startY + 10 } , 500 )
        .to( { y: startY } , 500 );
        this.addTouchEvent( this.startBtn , this.touchTapHandler , true );
    }

    close():void {
        this.removeTouchEvent( this.startBtn , this.touchTapHandler );
    }

    private touchTapHandler( event: egret.TouchEvent ):void {
        MessageManager.inst().dispatch( CustomEvt.WELCOME_CLOSE );
        ViewManager.inst().close( WelcomeView );
    }
}
ViewManager.inst().reg( WelcomeView , LayerManager.UI_Main );