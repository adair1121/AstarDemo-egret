class SkillBtn extends BaseView
{
	private skill_icon:eui.Image;
	private time_label:eui.Label;
	private name_label:eui.Label;
	private time:number = 0;
	private openLevel:number = 1;
	private skillID:number = 0;
	private skill:SkillData;
	private timeVec:number[] = [1, 8, 18, 28];
	public constructor(_skillID:number, id:number) 
	{
		super();
		this.skillID = _skillID;
		this.openLevel = this.timeVec[id];
		this.skinName = "SkillBtnSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage()
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
		this.init();
		MessageManager.inst().addListener(CustomEvt.SKILL_CD, this.startCd, this);
	}
	private onRemoveFromStage()
	{
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
		MessageManager.inst().removeListener(CustomEvt.SKILL_CD, this.startCd, this);
	}
	private init()
	{
		if(this.skillID == 0)
		{
			this.time_label.visible = false;
			this.skill_icon.visible = false;
			this.name_label.visible = false;
		}else 
		{
			this.skill = GameApp.inst().getSkillById(this.skillID);
			this.name_label.text = this.skill.skillName;
			this.time_label.visible = false;
			this.skill_icon.visible = true;
			this.name_label.visible = true;
			this.skill_icon.source=`main_skillicon${parseInt(this.skill.iconId.substr(this.skill.iconId.length-3,3))}_png`;
		}
	}
	public setSkillData(skillId:number)
	{
		this.skillID = skillId;
		this.init();
	}
	private touchTap()
	{
		if(this.time == 0 && GameApp.inst().roleAttr.roleLevel >= this.openLevel)
		{
			// BattleCom.inst().execSkill()
			//使用技能	
			let bool = BattleCom.inst().execSkill(this.skill.skillId);
			if(bool)
			{
				GlobalFun.filterToGrey(this.skill_icon);
				this.time = this.skill.skillCD;
				this.time_label.text = this.time + "s";
				this.time_label.visible = true;
				egret.Tween.get(this, {loop:true})
				.wait(1000)
				.call(()=>{
					this.time--;
					this.time_label.text = this.time + "s";
					if(this.time <= 0)
					{
						GlobalFun.clearFilters(this.skill_icon);
						this.time = 0;
						this.time_label.visible = false;
						egret.Tween.removeTweens(this);
					}
				});
			}
		}else if(GameApp.inst().roleAttr.roleLevel < this.openLevel)
		{
			ViewManager.inst().open(SkillView);
		}else if(this.time != 0)
		{
			UserTips.inst().showTips1("技能冷却中");
		}
	}
	private startCd(data:any)
	{
		if(data.data.skillId == this.skillID)
		{
			GlobalFun.filterToGrey(this.skill_icon);
			this.time = this.skill.skillCD;
			this.time_label.text = this.time + "s";
			this.time_label.visible = true;
			egret.Tween.get(this, {loop:true})
			.wait(1000)
			.call(()=>{
				this.time--;
				this.time_label.text = this.time + "s";
				if(this.time <= 0)
				{
					GlobalFun.clearFilters(this.skill_icon);
					this.time = 0;
					this.time_label.visible = false;
					egret.Tween.removeTweens(this);
				}
			});
		}
	}
}