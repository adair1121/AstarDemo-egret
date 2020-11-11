class TitleView extends BaseEuiView {
    private closeImg: eui.Rect;
    private itemScroller: eui.Scroller;
    private itemGroup: eui.Group;
    private propertyLab1: eui.Label;
    private propertyLab2: eui.Label;
    private propertyLab3: eui.Label;
    private explainLab: eui.Label;
    private combatLab: eui.Label;
    private combatBml: eui.BitmapLabel;
    private fireGroup: eui.Group;

    private show_group: eui.Group;

    private infoIndex: number = 0;

    public constructor() {
        super();
    }

    open( ...param ):void {
        this.show_group["autoSize"]();
        this.init();
        this.addTouchEvent( this.closeImg , this.btnTouchHandler , true );
        MessageManager.inst().addListener( CustomEvt.TITLE_SELECT , this.selectHandler , this );
    }

    close():void {
        this.removeTouchEvent( this.closeImg , this.btnTouchHandler );
        MessageManager.inst().removeListener( CustomEvt.TITLE_SELECT , this.selectHandler , this );
    }

    private init():void {
        TitleView.resetTitles();
        this.initInfoUI();
        this.initItem();
        let eff = new MovieClip();
		eff.playFile( "resource/res/animate/power_fire" , -1 );
		// eff.scaleX = eff.scaleY = 0.5;
		this.fireGroup.addChild( eff );
    }

    private initItem():void {
        let columns = 1;
        let roleTitles = GameApp.inst().roleAttr.roleTitles;
        for( let i = 0 ; i < 11 ; i ++ ) {
            let item = new TitleItem( i );
            this.itemGroup.addChild( item );
            item.x = item.width * ( i % columns );
            item.y = item.height * Math.floor( i / columns );
        }
    }

    private initInfoUI():void {
        let cfg = GameApp.inst().titlCfg[this.infoIndex];
        let additionArr = cfg.addition.split("_");
        let valuesArr = cfg.values.split("_");
        for( let i = 0 ; i < 3 ; i ++ ) {
            let addition = additionArr[i];
            let values = valuesArr[i];
            this[`propertyLab${i+1}`].text = `${this.additionName[addition]}: ${values}`;
        }
        this.explainLab.text = `${cfg.explain}`;
        let combat = 0;
        for( let i = 0 ; i < additionArr.length ; i ++ ) {
            let addition = additionArr[i];
            let values = parseInt(valuesArr[i]);
            combat += values * this.additionCombat[addition];
        }
        this.combatLab.text = `${combat}`;
        this.combatBml.text = `${combat}`;
    }

    public additionName = {
        "hp":"生命",
        "attack":"攻击",
        "def":"防御",
    }

    public additionCombat = {
        "hp":2,
        "attack":2,
        "def":1,
    }

    private selectHandler( event: CustomEvt ):void {
        let titleCfg = GameApp.inst().titlCfg;
        for( let i = 0 ; i < titleCfg.length ; i ++ ) {
            if( event.data[0] == titleCfg[i].titleId ) {
                this.infoIndex = i;
                break;
            }
        }
        this.initInfoUI();
    }

    private btnTouchHandler( event: egret.TouchEvent ):void {
        switch( event.target ) {
            case this.closeImg:
                MessageManager.inst().dispatch(CustomEvt.BTN_POS_FUWEI, this);
                ViewManager.inst().close( TitleView );
                break;
        }
    }

    // private allTitles = [];
    public static resetTitles():void {
        let arr = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        let roleAttr = GameApp.inst().roleAttr;
        arr[0] = roleAttr.roleLevel >= 20 ? 1 : 0;
        arr[2] = roleAttr.roleLevel >= 40 ? 1 : 0;
        arr[3] = roleAttr.roleLevel >= 60 ? 1 : 0;
        let forgeMin = 10000;
        for( let i = 0 ; i < roleAttr.roleForginDatas.length ; i ++ ) {
            forgeMin = roleAttr.roleForginDatas[i] < forgeMin ? roleAttr.roleForginDatas[i] : forgeMin;
        }
        arr[7] = forgeMin >= 81 ? 1 : 0;
        arr[9] = forgeMin >= 95 ? 1 : 0;
        let skillMin = 10000;
        for( let i = 0 ; i < roleAttr.roleSkillLevels.length ; i ++ ) {
            skillMin = roleAttr.roleSkillLevels[i] < skillMin ? roleAttr.roleSkillLevels[i] : skillMin;
        }
        arr[8] = skillMin >= 90 ? 1 : 0;
        arr[10] = skillMin >= 100 ? 1 : 0;
        /** 击杀boss判断 */
        // roleAttr.roleTitles
        arr[1] = roleAttr.roleKillBoss[0] >= 18 ? 1 : 0;
        arr[4] = roleAttr.roleKillBoss[1] >= 28 ? 1 : 0;
        arr[5] = roleAttr.roleKillBoss[2] >= 38 ? 1 : 0;
        arr[6] = roleAttr.roleKillBoss[3] >= 48 ? 1 : 0;
        let roleTitles: number[] = [];
        for( let i = 0 ; i < arr.length ; i ++ ) {
            if( arr[i] == 1 ) {
                roleTitles.push( (i + 1) );
            }
        }
        GameApp.inst().refreshRoleAttr( "roleTitles" , roleTitles );
        return ;
    }
}
ViewManager.inst().reg( TitleView , LayerManager.UI_Main );