class BossView extends BaseEuiView {
    private closeImg: eui.Rect;
    private selectScroller: eui.Scroller;
    private selectGroup: eui.Group;
    private rewardScroller: eui.Scroller;
    private rewardGroup: eui.Group;
    private challengeBtn: eui.Button;
    private bossImg: eui.Image;
    private mapImg: eui.Image;
    private conditionLab: eui.Label;
    private mapLab: eui.Label;
    private cdLab: eui.Label;
    private levelLab: eui.Label;

    private show_group: eui.Group;

    private aniGroup: eui.Group;
    private monsterAni: MovieClip;

    private selectIndex: number = 0;

    private rewardItemArr: BossRewardItem[]=[];

    public constructor() {
        super();
    }

    open( ...param ):void {
		// TipsBox.showTips2( "啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦阿        拉啦" , -1 , 10000 );
        this.init();
        this.addTouchEvent( this.closeImg , this.touchTapHandler , true );
        this.addTouchEvent( this.challengeBtn , this.touchTapHandler , true );
        MessageManager.inst().addListener( CustomEvt.BOSS_SELECT , this.selecHandler , this );
        this.addEventListener( egret.Event.ENTER_FRAME , this.enterFrameHandler , this );
    }

    close():void {
        this.removeTouchEvent( this.closeImg , this.touchTapHandler );
        this.removeTouchEvent( this.challengeBtn , this.touchTapHandler );
        MessageManager.inst().removeListener( CustomEvt.BOSS_SELECT , this.selecHandler , this );
        this.removeEventListener( egret.Event.ENTER_FRAME , this.enterFrameHandler , this );
    }

    private selecHandler( event: CustomEvt ):void {
        this.selectIndex = event.data[0];
        this.resetUI();
        this.resetBossAni();
    }

    private init():void {
        this.show_group[ "autoSize" ]();
        this.initCfgArr();
        this.initSelectUI();
        this.initRewardUI();
        this.resetUI();
        this.initMonster();
    }

    private initMonster():void {
        this.monsterAni = new MovieClip();
        this.aniGroup.addChild( this.monsterAni );
        this.resetBossAni();
    }

    private resetBossAni( index: number = this.selectIndex ):void {
        let cfg = this.cfgArr[index];
        this.monsterAni.playFile( `resource/res/animate/monster/${cfg.sequence}_4s` , -1 );
        this.monsterAni.scaleX = this.monsterAni.scaleY = this.bossScale[index];
    }

    private bossScale = [
        0.8, 0.8, 0.6, 1, 1, 0.6, 0.6, 0.9, 1.1, 1,
    ]

    private initSelectUI():void {
        let columns = 1;
        let bossNum: number = 10;
        for( let i = 0 ; i < bossNum ; i ++ ) {
            let select = new BossSelectItem( i );
            this.selectGroup.addChild( select );
            select.x = select.width * ( i % columns );
            select.y = select.height * Math.floor( i / columns );
        }
    }

    private initRewardUI():void {
        let columns = 10;
        let rewardIdArr = this.cfgArr[0].dropID.split("_");
        for( let i = 0 ; i < rewardIdArr.length ; i ++ ) {
            let rewardID = parseInt(rewardIdArr[i]);
            let cfg = GameApp.inst().getItemById( rewardID );
            let reward = new BossRewardItem( cfg );
            this.rewardGroup.addChild( reward );
            reward.x = reward.width * ( i % columns );
            reward.y = reward.height * Math.floor( i / columns );
            this.rewardItemArr.push( reward );
        }
    }

    private resetRewardUI():void {
        let rewardIdArr = this.cfgArr[this.selectIndex].dropID.split("_");
        for( let i = 0 ; i < this.rewardItemArr.length ; i ++ ) {
            let rewardID = parseInt(rewardIdArr[i]);
            let cfg = GameApp.inst().getItemById( rewardID );
            this.rewardItemArr[i].resetUI( cfg );
        }
    }

    private resetUI():void {
        this.bossImg.source = `boss_img_${this.selectIndex}_png`;
        if(GameApp.inst().roleAttr.roleLevel >= this.cfgArr[this.selectIndex].monterLev)
        {
            this.conditionLab.textColor = 0x3DFF00;
        }else 
        {
            this.conditionLab.textColor = 0xE82E0D;
        }
        this.conditionLab.text = `进入条件：${(this.cfgArr[this.selectIndex].monterLev)}级`;
        this.mapLab.text = `地图：${this.cfgArr[this.selectIndex].sceneName}`;
        this.levelLab.text = `Boss：${this.cfgArr[this.selectIndex].monsterName}  ${this.cfgArr[this.selectIndex].monterLev}级`
        this.resetRewardUI();
    }

    private touchTapHandler( event: egret.TouchEvent ):void {
        switch( event.target ) {
            case this.closeImg:
                MessageManager.inst().dispatch(CustomEvt.BTN_POS_FUWEI, this);
                ViewManager.inst().close( BossView );
                break;
            case this.challengeBtn:
                if( GameApp.inst().roleAttr.roleLevel >= (this.selectIndex + 1) * 10 ) {
                    let maxCd = this.bossCD[this.selectIndex];
                    let cd = maxCd - (this.getSecond() - GameApp.inst().bossData.bossCdTimes[this.selectIndex]);
                    if( cd < 0 ) {
                        GameApp.inst().refreshBossCdTime( this.selectIndex , this.getSecond() );
                        BattleCom.inst().runToScene( FUBEN.FUBEN_CHALLENGE , this.cfgArr[this.selectIndex].id );
                        ViewManager.inst().close( BossView );
                    } else {
                        UserTips.inst().showTips( "冷却中" );
                    }
                } else {
                    UserTips.inst().showTips( "等级不足" );
                }
                break;
        }
    }

    private enterFrameHandler( event: egret.Event ):void {
        let maxCd = this.bossCD[this.selectIndex];
        console.log(GameApp.inst().bossData.bossCdTimes[this.selectIndex]);
        
        let cd = maxCd - (this.getSecond() - GameApp.inst().bossData.bossCdTimes[this.selectIndex]);
        this.challengeBtn.visible = cd > 0 ? false : true;
        this.cdLab.visible = cd > 0 ? true : false;
        this.cdLab.text = `冷却时间：${DateUtils.getFormatTimeByStyle(cd > 0 ? cd : 0 , DateUtils.STYLE_4)}`;
    }

    private getSecond():number {
        let date = new Date();
        let time = date.getTime();
        let second = Math.floor( time / 1000 );
        return second;
    }

    public initCfgArr():void {
        for( let i = 0 ; i < 10 ; i ++ ) {
            let bossCfg = GameApp.inst().getMonInfoById( 10200 + i );
            this.cfgArr.push( bossCfg );
        }
    }

    private cfgArr = [];
    private bossCD = [
        600,
        600,
        600,
        600,
        600,
        600,
        600,
        600,
        600,
        600,
    ];
}
ViewManager.inst().reg( BossView , LayerManager.UI_Main );