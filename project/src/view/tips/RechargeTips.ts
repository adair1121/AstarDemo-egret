class RechargeTips extends BaseEuiView {
    private confirmBtn: eui.Button;
    private exitBtn: eui.Button;

    public constructor() {
        super();
    }

    open( ...param ):void {
        this.addTouchEvent( this.confirmBtn , this.touchTapHandler , true );
        this.addTouchEvent( this.exitBtn , this.touchTapHandler , true );
    }

    close():void {
        this.removeTouchEvent( this.confirmBtn , this.touchTapHandler );
        this.removeTouchEvent( this.exitBtn , this.touchTapHandler );
    }

    private touchTapHandler( event: egret.TouchEvent ):void {
        switch( event.target ) {
            case this.confirmBtn:
                ViewManager.inst().close( RechargeTips );
                /** 打开充值界面 */
                
                break;
            case this.exitBtn:
                ViewManager.inst().close( RechargeTips );
                break;
        }
    }
}
ViewManager.inst().reg( RechargeTips , LayerManager.UI_Pop );