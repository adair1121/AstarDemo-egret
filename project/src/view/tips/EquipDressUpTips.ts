class EquipDressUpTips extends BaseView {
    private closeImg: eui.Image;
    private effGroup: eui.Group;
    private frameImg: eui.Image;
    private headImg: eui.Image;
    private qualityLab: eui.Label;
    private nameLab: eui.Label;
    private addLab: eui.Label;
    private useBtn: eui.Button;
    private infoRect: eui.Rect;
    private timeLab: eui.Label;

    private myCfg: GoodsData;

    public constructor( cfg: GoodsData ) {
        super();
        this.skinName = "EquipDressUpTipsSkin";
        this.myCfg = cfg;
        this.addEventListener( egret.Event.ADDED_TO_STAGE , this.add_view_handler , this );
    }

    private add_view_handler( event: egret.Event ):void {
        this.init();
        this.removeEventListener( egret.Event.ADDED_TO_STAGE , this.add_view_handler , this );
        this.addEventListener( egret.Event.REMOVED_FROM_STAGE , this.remove_view_handler , this );
        this.addTouchEvent( this.closeImg , this.touchTapHandler , true );
        this.addTouchEvent( this.useBtn , this.touchTapHandler , true );
        this.addTouchEvent( this.infoRect , this.touchTapHandler , true );
    }

    private remove_view_handler( event: egret.Event ):void {
        this.removeEventListener( egret.Event.REMOVED_FROM_STAGE , this.remove_view_handler , this );
        this.removeTouchEvent( this.closeImg , this.touchTapHandler );
        this.removeTouchEvent( this.useBtn , this.touchTapHandler );
        this.removeTouchEvent( this.infoRect , this.touchTapHandler );
    }

    private init():void {
        let roleEquips = GameApp.inst().roleAttr.roleEquips;
        let newEquip = GameApp.inst().getGoodData(this.myCfg.itemId);
        let pos = newEquip.equipPos;
        let nowEquip = GameApp.inst().getGoodData(roleEquips[pos]);
        let nowPower = !nowEquip ? 0 : this.getPower( nowEquip );
        let newPower = this.getPower( newEquip );

        this.headImg.source = `item_${this.myCfg.modelId}_png`;
        this.qualityLab.text = `${this.myCfg.starLev}阶`;
        this.frameImg.source = `item_box_${this.myCfg.quality}_png`;
        this.nameLab.text = `${this.myCfg.itemName}`;
        this.addLab.text = `战力  +${Math.ceil(newPower-nowPower)}`;

        let eff = new MovieClip();
        this.effGroup.addChild( eff );
        eff.x = this.effGroup.width/2;
        eff.y = this.effGroup.height/2;
        eff.playFile( `resource/res/animate/quality_effect_${this.myCfg.quality}` , -1 );
        this.Timing();
    }

    private touchTapHandler( event: egret.TouchEvent ):void {
        switch( event.target ) {
            case this.closeImg:
                this.removeMyself();
                break;
            case this.useBtn:
                let roleEquips = GameApp.inst().roleAttr.roleEquips;
                let newEquip = GameApp.inst().getGoodData(this.myCfg.itemId);
                let pos = newEquip.equipPos;
                let nowEquip = GameApp.inst().getGoodData(roleEquips[pos]);
                let nowPower = !nowEquip ? 0 : this.getPower( nowEquip );
                let newPower = this.getPower( newEquip );
                roleEquips[pos] = newEquip.itemId;
                GameApp.inst().refreshRoleAttr( "roleEquips" , roleEquips );
                TipsBox.showTips2( `装备成功  战力+${newPower - nowPower}` );
                this.removeMyself();
                break;
            case this.infoRect:
                ViewManager.inst().open(BagDetails, [this.myCfg.itemId]);
                break;
        }
    }

    public getPower( equip: GoodsData ):number {
        return this.blArr[equip.attrs] * equip.values;
    }

    private time: number = 4;
    private Timing():void {
        this.time --;
        this.timeLab.text = `${this.time}秒后关闭`;
        if( this.time == 0 ) {
            this.removeMyself();
            return ;
        }
        egret.Tween.get( this )
        .wait( 1000 )
        .call( this.Timing , this );
    }

    public blArr = {
        "hp":2,
        "mp":0.5,
        "attack":2,
        "def":1,
        "hit":0.5,
        "dodge":1,
        "cirt":2,
        "kCirk":1,
    }

    private removeMyself():void {
        if( this.parent ) {
            if( this.parent.contains( this ) ) {
                egret.Tween.removeTweens( this );
                this.parent.removeChild( this );
            }
        }
    }
}