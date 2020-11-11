class MainGuanQia extends BaseView
{
	private gk_icon:eui.Image;//关卡图标
	private gk_exp_tiao:eui.Image;//关卡经验
	private gk_exp_mask:eui.Rect;
	private effect:MovieClip;
	private effect_group:eui.Group;
	public constructor() 
	{
		super();
		this.skinName = "MainGuanQiaSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage()
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
		this.init();
		eui.Binding.bindHandler(GameApp.inst(),["battleCount"],this.update,this);
	}
	private onRemoveFromStage()
	{
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
	}
	private touchTap()
	{
		
		BattleCom.inst().challengeLevBoss();
	}
	private init()
	{
		this.effect = new MovieClip();
		this.effect.playFile(`${EFFECT}gk_effect`, -1);
		this.effect.scaleX = 1.5;
		this.effect.scaleY = 1.5;
		this.effect_group.addChild(this.effect);
	}
	private update()
	{
		this.gk_exp_tiao.mask = this.gk_exp_mask;
		if(GameApp.inst().battleCount >= 10)
		{
			this.effect_group.visible =true;
			GameApp.inst().battleCount = 10;
		}else
		{
			this.effect_group.visible = false;
		}
		this.gk_exp_mask.width = (GameApp.inst().battleCount/10)*this.gk_exp_tiao.width;
	}
}