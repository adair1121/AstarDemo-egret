class TitleItem extends BaseView {
    private headImg: eui.Image;
    private nameLab: eui.Label;
    private lockLab: eui.Label;
    private dressupBtn: eui.Button;
    private selectImg: eui.Image;

    private myIndex: number = 0;

    public constructor( index: number ){
        super();
        this.skinName = `TitleItemSkin`;
        this.myIndex = index;
        this.addEventListener( egret.Event.ADDED_TO_STAGE , this.add_view_handler , this );
    }

    private add_view_handler( event: egret.Event ):void {
        this.init();
        this.removeEventListener( egret.Event.ADDED_TO_STAGE , this.add_view_handler , this );
        this.addEventListener( egret.Event.REMOVED_FROM_STAGE , this.remove_view_handler , this );
        this.addEventListener( egret.TouchEvent.TOUCH_TAP , this.touchTapHandler , this );
        MessageManager.inst().addListener( CustomEvt.TITLE_SELECT , this.selectHandler , this );
    }

    private remove_view_handler( event: egret.Event ):void {
        this.removeEventListener( egret.Event.REMOVED_FROM_STAGE , this.remove_view_handler , this );
        this.removeEventListener( egret.TouchEvent.TOUCH_TAP , this.touchTapHandler , this );
        MessageManager.inst().removeListener( CustomEvt.TITLE_SELECT , this.selectHandler , this );
    }

    private init():void {
        let cfg = GameApp.inst().titlCfg[this.myIndex];
        this.headImg.source = `title_head_${this.myIndex}_png`;
        this.nameLab.text = `${cfg.titleName}`;
        this.selectImg.visible = this.myIndex == 0 ? true : false;
        this.resetUI();
    }

    private touchTapHandler( event: egret.TouchEvent ):void {
        let cfg = GameApp.inst().titlCfg[this.myIndex];
        if( event.target == this.dressupBtn ) {
            if(this.dressupBtn.currentState == "disabled")
            {
                UserTips.inst().showTips("称号未获得");
                return;
            }
            if( cfg.titleId == GameApp.inst().roleAttr.roleTitleId ) {
                GameApp.inst().refreshRoleAttr( "roleTitleId" , 0 );
				MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ "roleLevel" ] );
                TipsBox.showTips2( "已卸下" , -1 , 1000 );
            } else {
                GameApp.inst().refreshRoleAttr( "roleTitleId" , cfg.titleId );
				MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ "roleLevel" ] );
                TipsBox.showTips2( "装备成功" , -1 , 1000 );
            }
        }
        MessageManager.inst().dispatch( CustomEvt.TITLE_SELECT , [ cfg.titleId ] );
    }

    private resetUI():void {
        let cfg = GameApp.inst().titlCfg[this.myIndex];
        let roleTitles = GameApp.inst().roleAttr.roleTitles;
        let roleTitleId = GameApp.inst().roleAttr.roleTitleId;
        let lock = true;
        for( let i = 0 ; i < roleTitles.length ; i ++ ) {
            if( this.myIndex + 1 == roleTitles[i] ) {
                lock = false;
            }
        }
        this.dressupBtn.currentState = lock == true ? "disabled" : "up";
        if( lock == true ) {
            this.dressupBtn.label = "未获得";
        } else {
            this.dressupBtn.label = cfg.titleId == roleTitleId ? "卸下" : "装备";
        }
    }

    private selectHandler( event: CustomEvt ):void {
        let cfg = GameApp.inst().titlCfg[this.myIndex];
        let selectIndex = event.data[0];
        this.selectImg.visible = cfg.titleId == selectIndex ? true : false;
        this.resetUI();
    }
}