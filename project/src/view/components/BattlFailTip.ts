class BattlFailTip extends BaseEuiView{
	private rebirthBtn:eui.Group;
	private timeLab:eui.Label;
	private timenum:number = 10;
	public constructor() {
		super();
		this.skinName = "BattlFailTipSkin";
	}
	public open(...param):void
	{
		this.width = StageUtils.inst().getWidth();
		this.height = StageUtils.inst().getHeight();
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
		TimerManager.inst().doTimer(1000,10,this.onCountDown,this);
	}
	private onCountDown():void
	{
		this.timenum -= 1;
		this.timeLab.text = `(${this.timenum}秒)`;
		if(this.timenum <= 0)
		{
			MessageManager.inst().dispatch(CustomEvt.CHALLENGE_FINISH); 
			BattleCom.inst().runToScene(FUBEN.FUBEN_WILD);
			ViewManager.inst().close(BattlFailTip);
		}
	}
	private onTouch(evt:egret.TouchEvent):void
	{
		if(evt.target == this.rebirthBtn)
		{
			if(GameApp.inst().globalData.gold >= 100)
			{	
				GameApp.inst().globalData.gold -= 100;
				GameApp.inst().setGoldNum(GameApp.inst().globalData.gold);
				MessageManager.inst().dispatch(CustomEvt.REBIRTH);
				ViewManager.inst().close(BattlFailTip);
			}else{
				UserTips.inst().showTips("元宝不足");
			}
		}
	}
	public close():void
	{
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouch,this);
		TimerManager.inst().remove(this.onCountDown,this);
		if(this.parent){this.parent.removeChild(this)}
	}
}
ViewManager.inst().reg(BattlFailTip,LayerManager.UI_Pop);