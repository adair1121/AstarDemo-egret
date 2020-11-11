class TipsBox extends BaseView {
    private strLab: eui.Label;

    public constructor() {
        super();
        this.skinName = "TipsBoxSkin";
        this.addEventListener( egret.Event.ADDED_TO_STAGE , this.add_view_handler , this );
    }

    private add_view_handler( event: egret.Event ):void {
        this.removeEventListener( egret.Event.ADDED_TO_STAGE , this.add_view_handler , this );
        this.addEventListener( egret.Event.REMOVED_FROM_STAGE , this.remove_view_handler , this );
    }

    private remove_view_handler( event: egret.Event ):void {
        this.removeEventListener( egret.Event.REMOVED_FROM_STAGE , this.remove_view_handler , this );
    }

    private init( str: string , x: number , y: number , newLine: number = 8 , callBack: Function = null , removeTime: number = -1 , isAni: boolean = false ):void {
        if( isAni ) {
            this.alpha = 0;
            egret.Tween.get( this )
            .to( { alpha:1 } , 300 );
        }
        newLine = newLine == -1 ? 100000 : newLine;
        this.strLab.text = str;
        let strArr = str.split("");
        let myWid = strArr.length < newLine ? strArr.length : newLine;
        let ls = this.strLab.lineSpacing + this.strLab.size;
        let height = Math.ceil(strArr.length / newLine) * ls;
        let width = myWid * this.strLab.size;
        this.height = height;
        this.width = width;
        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2;
        this.x = x;
        this.y = y;
        if( removeTime != -1  ) {
            egret.Tween.get( this )
            .wait( removeTime )
            .call( function(){
                if( callBack ) {
                    callBack();
                }
                isAni ? this.removeMe() : this.removeMyself();
                // if( isAni ) {
                //     this.removeMe();
                // } else {
                //     this.removeMyself();
                // }
            }.bind( this ) );
        }
    }

    public setCenter():void {
        this.strLab.textAlign = "center";
    }

    private removeMe():void {
        egret.Tween.get( this )
        .to( { alpha:0 } , 300 )
        .call( this.removeMyself , this );
    }

    private removeMyself():void {
        if( this.parent ) {
            if( this.parent.contains( this ) ) {
                this.parent.removeChild( this );
            }
        }
    }

    /**
     * 显示提示信息
     * @param str 显示消息
     * @param x 坐标x
     * @param y 坐标y
     * @param obj 消息所在物体
     * @param callBack 消息移除调用方法，消息盒子移除后调用
     * @param removeTime 消息存在时间
     */
    public static showTips( str: string , x: number , y: number , obj: any , callBack: Function = null , removeTime: number = -1 ):void {
        let tips = new TipsBox();
        tips.init( str , x , y , 8 , callBack , removeTime );
        obj.addChild( tips );
    }
    /**
     * 显示提示信息2
     * @param str 显示消息
     * @param newLine 每行达到多少字换行，-1为不换行
     * @param removeTime 消息存在时间
     */
    public static showTips2( str: string , newLine: number = -1 , removeTime: number = 1000 ):void {
        let tips = new TipsBox();
        tips.init( str , StageUtils.inst().getWidth()/2 , StageUtils.inst().getHeight()/2 , newLine , null , removeTime , true );
        tips.setCenter();
        LayerManager.UI_Pop.addChild( tips );
    }
}