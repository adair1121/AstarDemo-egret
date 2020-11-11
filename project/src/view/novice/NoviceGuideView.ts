class NoviceGuideView extends BaseView {
    private myCfg: guideCfg[]=[];

    private rectMask: eui.Rect;

    private item_arr: GuideItem[]=[];

    public constructor( cfg: guideCfg[] , free:boolean ) {
        super();
        this.skinName = "NoviceGuideViewSkin";
        this.myCfg = cfg;
        this.rectMask.visible = free == true ? false : true;
        this.addEventListener( egret.Event.ADDED_TO_STAGE , this.addViewHandler , this );
    }

    private addViewHandler( event: egret.Event ):void {
        MessageManager.inst().addListener( CustomEvt.REMOVE_GUIDE_MASK , this.removeGuideMask , this );
        this.init();
        this.removeEventListener( egret.Event.ADDED_TO_STAGE , this.addViewHandler , this );
        this.addEventListener( egret.Event.REMOVED_FROM_STAGE , this.removeViewHandler , this );
        MessageManager.inst().addListener( CustomEvt.GUIDE_CLICK_INFO , this.touchGuideHandler , this );
    }

    private removeViewHandler( event: egret.Event ):void {
        this.removeEventListener( egret.Event.REMOVED_FROM_STAGE , this.removeViewHandler , this );
        MessageManager.inst().removeListener( CustomEvt.GUIDE_CLICK_INFO , this.touchGuideHandler , this );
        MessageManager.inst().removeListener( CustomEvt.REMOVE_GUIDE_MASK , this.removeGuideMask , this );
    }

    private removeGuideMask( event: CustomEvt ):void {
        this.rectMask.alpha = 0;
    }

    private init():void {
        this.adapter();
        for( let i = 0 ; i < this.myCfg.length ; i ++ ) {
            let item = new GuideItem( this.myCfg[i] );
            this.addChild( item );
            this.item_arr.push( item );
        }
    }

    private touchGuideHandler( event: CustomEvt ):void {
        for( let i = 0 ; i < this.item_arr.length ; i ++ ) {
            if( this.item_arr[i] == event.data[0] ) {
                this.removeChild( this.item_arr[i] );
                this.item_arr.splice( i , 1 );
                i --;
            }
        }
        if( this.item_arr.length <= 0 ) {
            this.removeMyself();
        }
    }

    private removeMyself():void {
        if( this.parent ) {
            if( this.parent.contains( this ) ) {
                this.parent.removeChild( this );
            }
        }
    }

    public static showGuide( cfg: guideCfg[] , free: boolean , obj: any ):void {
        let guideData = NoviceGuideView.getGuideLocal();
        for( let i = 0 ; i < cfg.length ; i ++ ) {
            if( guideData[ `${cfg[i].target}` ] == true  ) {
                cfg.splice( i , 1 );
                i --;
            }
        }
        if( cfg.length <= 0 ) return ;
        let guide = new NoviceGuideView( cfg , free );
        obj.addChild( guide );
    }

    public static getGuideLocal():any {
        let guideStr = egret.localStorage.getItem( LocalStorageEnum.GUIDE_DATA );
        if( !guideStr ) {
            let guide = {
                task: false,
                sign: false,
                role: false,
                skill: false,
                forge: false,
                start: false,
            }
            guideStr = JSON.stringify( guide );
            egret.localStorage.setItem( LocalStorageEnum.GUIDE_DATA , guideStr );
        }
        return JSON.parse( guideStr );
    }

    private adapter():void {
        this.width = StageUtils.inst().getWidth();
        this.height = StageUtils.inst().getHeight();
    }

    public static setGuideLocal( str: string ):void {
        let guideStr = egret.localStorage.getItem( LocalStorageEnum.GUIDE_DATA );
        let guide = JSON.parse( guideStr );
        guide[`${str}`] = true;
        egret.localStorage.setItem( LocalStorageEnum.GUIDE_DATA , JSON.stringify(guide) );
		let progress = this.getProgress();
        if( NoviceGuideView.getPr( str ) <= progress ) {
            MessageManager.inst().dispatch( CustomEvt.GUIDE_LOCAL_CHANGE );
        }
    }

	public static getProgress():number {
		let progress:number = null;
		let local = NoviceGuideView.getGuideLocal();
		for( let i = 0 ; i < this.guideOrder.length; i ++ ) {
			if( local[ this.guideOrder[i] ] == false ) {
				progress = i;
				break;
			}
		}
		return progress;
	}
	public static guideOrder: string[] = [
		"task" , "sign" , "role" , "skill" , "forge"
	]

    public static getPr( str: string ):number {
        for( let i = 0 ; i < NoviceGuideView.guideOrder.length ; i ++ ) {
            if( str == NoviceGuideView.guideOrder[i] ) {
                return i;
            }
        }
    }
}
interface guideCfg {
    x: number; //引导x坐标
    y: number; //引导x坐标
    width?: number; //引导点击宽度
    height?: number; //引导点击高度
    info: string; //引导显示信息
    bg: number; //引导信息背景
    fun: Function; //点击回调方法
    target: String; //引导目标
    obj: any; 
}