class FubenView extends BaseEuiView {
    private itemScroller: eui.Scroller;
    private itemGroup: eui.Group;
    private closeImg: eui.Rect;

    private show_group: eui.Group;

    public static playCfg = {
        open:false,
        openIndex:0
    }

    public constructor() {
        super();
    }

    open( ...param ):void {
        this.show_group["autoSize"]();
        this.init();
        this.addTouchEvent( this.closeImg , this.closeBtnHandler , true );
    }

    close():void {
        this.removeTouchEvent( this.closeImg , this.closeBtnHandler );
    }

    private init():void {
        this.initDay();
        let columns = 3;
        // let roleTitles = GameApp.inst().roleAttr.roleTitles;
        console.log("time",GameApp.inst().fubenData.fubenTimes);
        
        for( let i = 0 ; i < 3 ; i ++ ) {
            let item = new FubenItem( i );
            this.itemGroup.addChild( item );
            item.x = item.width * ( i % columns );
            item.y = item.height * Math.floor( i / columns );
        }
    }


    private initDay():void {
        let day = GameApp.inst().fubenData.fubenPlayDay;
        let nowDay = Math.floor( this.getSecond() / 60 / 60 / 24 );
        if( day < nowDay ) {
            GameApp.inst().refreshFuBenData( "fubenPlayDay" , nowDay );
            GameApp.inst().refreshFuBenData( "fubenTimes" , [ 1800 , 1800 , 1800 ] );
        }
    }

    private getSecond():number {
        let date = new Date();
        let time = date.getTime();
        let second = Math.floor( time / 1000 );
        return second;
    }

    private closeBtnHandler( event: egret.TouchEvent ):void {
        MessageManager.inst().dispatch(CustomEvt.BTN_POS_FUWEI, this);
        ViewManager.inst().close( FubenView );
    }

}
ViewManager.inst().reg( FubenView , LayerManager.UI_Main );