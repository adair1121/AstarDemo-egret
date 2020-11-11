class MainSkillBtn extends BaseView
{
	private skill_0:eui.Group;
	private skill_1:eui.Group;
	private skill_3:eui.Group;
	private skill_4:eui.Group;
	private attack_btn:eui.Image;
	private btnVec:SkillBtn[] = [];
	private state:number = 0;
	public constructor() 
	{
		super();
		this.skinName = "MainSkillBtnSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		
	}
	private onAddToStage()
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.addTouchEvent(this.attack_btn, this.touchTap, true);
		
		this.init();

		this.update(null);
		MessageManager.inst().addListener(CustomEvt.ROLE_SHENGJI, this.update, this);

	}
	private onRemoveFromStage()
	{
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.removeTouchEvent(this.attack_btn, this.touchTap);
	}
	private update(evt:CustomEvt)
	{
		// (MapView.inst().roles[0] as SoldierEntity).refreshAttr();
		//刷新数据
		for(let i = 0; i < GameApp.inst().getLockSkills().length; i++)
		{
			this.btnVec[i].setSkillData(GameApp.inst().getLockSkills()[i].skillId);
		}
	}
	private init()
	{
		for(let i = 0; i < 4; i++)
		{
			var btn = new SkillBtn(0, i);
			this[`skill_${i}`].addChild(btn);
			this.btnVec.push(btn);
		}
	}
	private touchTap(evt:egret.TouchEvent)
	{
		console.log("普通攻击");
		BattleCom.inst().execNormalAtk();
	}
	
}