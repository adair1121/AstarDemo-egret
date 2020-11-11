class ResultCom extends BaseEuiView{
	private winGroup:eui.Group;
	private bg:eui.Image;
	private list:eui.List;
	private sureBtn:eui.Button;
	private sureBtn2:eui.Button;
	private failGroup:eui.Group;
	private arrayCollect:eui.ArrayCollection;
	private tipLab:eui.Label;
	public constructor() {
		super();
	}
	public open(...param):void
	{
		this.arrayCollect = new eui.ArrayCollection();
		this.list.itemRenderer = Item;
		this.list.dataProvider = this.arrayCollect;
		this.winGroup.visible = param[0].state == 1;
		this.failGroup.visible = param[0].state == 0;
		if(param[0].state == 1)
		{
			//获取掉落数据
			let drops:{id:number,num:number}[] = GameApp.inst().getDropItem(param[0].monId);
			if(drops.length > 0)
			{
				this.arrayCollect.source = drops;
			}else{
				this.list.visible = false;
				this.tipLab.visible = true;
			}
		}
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSure,this);
		this.sureBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSure,this);
	}
	private onSure():void
	{
		ViewManager.inst().close(ResultCom);
		BattleCom.inst().runToScene(FUBEN.FUBEN_WILD);
	}
	public close():void
	{
		this.sureBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSure,this);
		this.sureBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onSure,this);
	}
}
ViewManager.inst().reg(ResultCom,LayerManager.UI_Pop);