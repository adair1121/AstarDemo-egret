class MainTask extends BaseView
{
	private task_title0:eui.Label;
	private task_title1:eui.Label;
	private cfg:TaskCfg[] = [];
	private lingqu0:boolean = false;
	private lingqu1:boolean = false;
	private task_btn:eui.Image;
	private state:number = 0;
	private task_btn0:eui.Rect;
	private effect_group:eui.Group;
	public constructor() 
	{
		super();
		this.skinName = "MainTaskSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage()
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.init();
		this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
		this.addTouchEvent(this, this.touchTap);
	}
	private onRemoveFromStage()
	{
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
		this.removeTouchEvent(this, this.touchTap);
	}
	private init()
	{
		this.effect_group.visible = false;
		let effect = new MovieClip();
		effect.playFile(`${EFFECT}chongzhi`, -1);
		this.effect_group.addChild(effect);
		this.effect_group.scaleX = 2.8;
		this.effect_group.scaleY = 1.6;
		effect.y = 25;
		this.cfg = [];
		for(let i = 0; i < GameApp.inst().nowTaskID.length; i++)
		{
			this.cfg.push(GameApp.inst().getTaskData(GameApp.inst().nowTaskID[i]));
		}
	}
	private update()
	{
		if(this.lingqu0 == true || this.lingqu1 == true)
		{
			this.effect_group.visible = true;
		}else
		{
			this.effect_group.visible = false;
		}
		for(let i = 0; i < this.cfg.length; i++)
		{
			switch(this.cfg[i].task_type)
			{
				case 1:
				case 2:
				case 4:
				case 5:
				case 6:
				case 8:
				case 10:
				case 11:
				case 12:
					if(GameApp.inst().getTaskNum(this.cfg[i].task_type)>=this.cfg[i].task_num)
					{
						this["lingqu" + i] = true;
						this["task_title" + i].textFlow = new egret.HtmlTextParser().parser(`<font color=0xFFD39A>${this.cfg[i].task_name}</font><font color=0x78EF0B>（${this.cfg[i].task_num} / ${this.cfg[i].task_num}）</font>`);
					}else 
					{
						this["task_title" + i].textFlow = new egret.HtmlTextParser().parser(`<font color=0xFFD39A>${this.cfg[i].task_name}</font><font color=0xED2D0B>（${GameApp.inst().getTaskNum(this.cfg[i].task_type)} / ${this.cfg[i].task_num}）</font>`);
					}
					break;
				case 3://人物升级
					if(GameApp.inst().roleAttr.roleLevel>=this.cfg[i].task_num)
					{
						this["lingqu" + i] = true;
						this["task_title" + i].textFlow = new egret.HtmlTextParser().parser(`<font color=0xFFD39A>${this.cfg[i].task_name}</font><font color=0x78EF0B>（${this.cfg[i].task_num} / ${this.cfg[i].task_num}）</font>`);
					}else 
					{
						this["task_title" + i].textFlow = new egret.HtmlTextParser().parser(`<font color=0xFFD39A>${this.cfg[i].task_name}</font><font color=0xED2D0B>（${GameApp.inst().roleAttr.roleLevel} / ${this.cfg[i].task_num}）</font>`);
					}
					break;
				case 7://通关关卡
					if(GameApp.inst().globalData.level > this.cfg[i].checkpointID)
					{
						this["lingqu" + i] = true;
						this["task_title" + i].textFlow = new egret.HtmlTextParser().parser(`<font color=0xFFD39A>${this.cfg[i].task_name}</font><font color=0x78EF0B>（${GameApp.inst().getMonInfoById(this.cfg[i].checkpointID).sceneName}）</font>`);
					}else
					{
						this["task_title" + i].textFlow = new egret.HtmlTextParser().parser(`<font color=0xFFD39A>${this.cfg[i].task_name}</font><font color=0xED2D0B>（${GameApp.inst().getMonInfoById(this.cfg[i].checkpointID).sceneName}）</font>`);
					}
					break;
				case 9:
					if(GameApp.inst().getAllPower(0)>=this.cfg[i].task_num)
					{
						this["lingqu" + i] = true;
						this["task_title" + i].textFlow = new egret.HtmlTextParser().parser(`<font color=0xFFD39A>${this.cfg[i].task_name}</font><font color=0x78EF0B>（${this.cfg[i].task_num} / ${this.cfg[i].task_num}）</font>`);
					}else 
					{
						this["task_title" + i].textFlow = new egret.HtmlTextParser().parser(`<font color=0xFFD39A>${this.cfg[i].task_name}</font><font color=0xED2D0B>（${GameApp.inst().getAllPower(0)} / ${this.cfg[i].task_num}）</font>`);
					}
					break;
			}
		}
		
	}
	private touchTap(evt:egret.TouchEvent)
	{
		let progress = NoviceGuideView.getProgress();
		switch(evt.target)
		{
			case this.task_btn:
				if(this.state == 0)
				{
					this.state = 1;
					
					egret.Tween.get(this)
					.to({x:this.x - 173}, 300)
					.call(()=>{
						this.task_title0.visible = false;
						this.task_title1.visible = false;
						egret.Tween.removeTweens(this);
					});
				}
				break;
			case this.task_btn0:
				if(this.state == 1)
				{
					this.state = 0;
					
					egret.Tween.get(this)
					.to({x:this.x + 173}, 300)
					.call(()=>{
						this.task_title0.visible = true;
						this.task_title1.visible = true;
						egret.Tween.removeTweens(this);
					});
				}
				break;
			case this.task_title0:
				this.taskOk(0);
				break;
			case this.task_title1:
				this.taskOk(1);
				break;
		}
		
	}

	private taskOk(_id:number)
	{
		if(this["lingqu" + _id])
		{
			//奖励
			GameApp.inst().roleGetExp(this.cfg[_id].task_exp);
			UserTips.inst().showTips1("恭喜获得 经验x" + this.cfg[_id].task_exp);
			GameApp.inst().setGoldNum((GameApp.inst().getGoldNum()+this.cfg[_id].reward_num));
			UserTips.inst().showTips1("恭喜获得 元宝x" + this.cfg[_id].reward_num);
			this["lingqu" + _id] = false;
			GameApp.inst().setTaskData(this.cfg[_id].task_type, -this.cfg[_id].task_num);
			GameApp.inst().nowTaskID[_id] = GameApp.inst().taskIdMax + 1;
			GameApp.inst().taskIdMax += 1;
			egret.localStorage.setItem(LocalStorageEnum.TASK_ID, JSON.stringify(GameApp.inst().nowTaskID));
			this.init();
		}else
		{
			UserTips.inst().showTips1("任务未完成");
		}
	}
}