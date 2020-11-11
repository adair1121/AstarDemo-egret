class SkillView extends BaseEuiView{
	/**
	 * 关闭按钮
	 */
	private close_btn:eui.Rect;
	/**
	 * 滑动条Group
	 */
	private content_group:eui.Group;
	/**
	 * 描述文本
	 */
	private describe_label:eui.Label;
	/**
	 * 所需金钱
	 */
	private view_group:eui.Group;
	private money_label:eui.Label;

	private skillItemArr:SKILLItem[]=[];

	private ok_btn:SkillButton;

	private arr1_group:eui.Group;
	private arr2_group:eui.Group;

	private current_id:number=-1;
	private current_price:number=0;
	private timer:egret.Timer;
	public open(...param):void
	{
		this.view_group["autoSize"]();
		this.addTouchEvent(this.close_btn,this.onTap,true);
		this.initData();
		MessageManager.inst().addListener(CustomEvt.SKILL_CLICK_INFO,this.skill_info,this);
		MessageManager.inst().dispatch(CustomEvt.SKILL_CLICK_INFO,{id:0});
		NoviceGuideView.showGuide( [this.guideCfg] , false , this );
		this.timer= new egret.Timer(500,0);
        //注册事件侦听器
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.update,this);
        //开始计时
        this.timer.start();
	}

	private update()
	{
		this.refreshData(this.current_id);
	}
	/**
	 * 设置文本字符并设置锚点
	 */
	make_label_center(txt:eui.Label,str:string)
	{
		txt.text=str;
		txt.validateNow();
		txt.anchorOffsetX=txt.textWidth/2;
		// txt.anchorOffsetY=txt.textHeight/2;
	}
	private skill_info(evt:CustomEvt):void
	{
		if(evt.data.id==this.current_id&&(!evt.data.id2))
		return;
		this.current_id=evt.data.id;
		let skill1:SkillData=<SkillData>{};
		let skill2:SkillData=<SkillData>{};
		for(let i=0;i<GameApp.inst().getAllSkills().length;i++)
        {
			let skill:SkillData=GameApp.inst().getAllSkills()[i];
			// if(((GameApp.inst().getRoleJob()-1)*4+this.current_id+1)>=10)
			// {
				if((parseInt(skill.iconId.substr(skill.iconId.length-2,2))-1)%4==this.current_id&&(skill.skillLev==(GameApp.inst().getSkillLevels()[this.current_id]))&&skill.roleJobId==GameApp.inst().getRoleJob())
				{
					skill1=skill;
					break;
				}
			// }else
			// {
			// 	if(parseInt(skill.iconId.substr(skill.iconId.length-1,1))==parseInt(`${(GameApp.inst().getRoleJob()-1)*4+this.current_id+1}}`)&&(skill.skillLev==(GameApp.inst().getSkillLevels()[this.current_id])))
			// 	{
			// 		skill1=skill;
			// 		break;
			// 	}
			// }
        }
		for(let i=0;i<GameApp.inst().getAllSkills().length;i++)
        {
			let skill:SkillData=GameApp.inst().getAllSkills()[i];
			// if(((GameApp.inst().getRoleJob()-1)*4+this.current_id+1)>=10)
			// {
				if((parseInt(skill.iconId.substr(skill.iconId.length-2,2))-1)%4==this.current_id&&(skill.skillLev==((GameApp.inst().getSkillLevels()[this.current_id])+1))&&skill.roleJobId==GameApp.inst().getRoleJob())
				{
					skill2=skill;
					break;
				}
			// }else
			// {
			// 	if(parseInt(skill.iconId.substr(skill.iconId.length-1,1))==parseInt(`${(GameApp.inst().getRoleJob()-1)*4+this.current_id+1}}`)&&(skill.skillLev==((GameApp.inst().getSkillLevels()[this.current_id])+1)))
			// 	{
			// 		skill2=skill;
			// 		break;
			// 	}
			// }
        }
		this.describe_label.text=`${skill1.skillDes}`;
		for(let i=0;i<this.arr1_group.$children.length;i++)
		{
			this.setLabel(i,<eui.Label>this.arr1_group.$children[i],skill1);
		}
		/**
		 * 到达顶级
		 */
		if(skill2.open)
		{
			this.ok_btn.visible=true;
			this.arr2_group.visible=true;
			for(let i=0;i<this.arr2_group.$children.length;i++)
			{
				this.setLabel(i,<eui.Label>this.arr2_group.$children[i],skill2);
			}
		}else
		{
			this.ok_btn.visible=false;
			skill2=<SkillData>{price:0};
			this.arr2_group.visible=false;
		}
		
		this.money_label.text=`${skill2.price}`;
		this.current_price=skill2.price;
		this.refreshData(this.current_id);
	}
	setLabel(id:number,label:eui.Label,skill:SkillData)
	{
		switch(id)
		{
			case 0:
				this.make_label_center(label,`${skill.skillAtk}`);
			break;
			case 1:
				this.make_label_center(label,`${skill.skillCD}`);
			break;
			case 2:
				this.make_label_center(label,`${skill.skillMP}`);
			break;
		}
	}
	confirm_update()
	{
		if(GameApp.inst().getGoldNum()>=this.current_price)
		{
			let skills:number[]=GameApp.inst().getSkillLevels();
			if(skills[this.current_id]>=GameApp.inst().getRoleLevel())
			{
				//UserTips.inst().showTips("请提升人物等级");
				TipsBox.showTips2( `请提升人物等级` , -1 , 1000 );
				return;
			}
			let now_power: number = GameApp.inst().getAllPower(0);
			GameApp.inst().calculPower();
			GameApp.inst().setGoldNum(GameApp.inst().getGoldNum()-this.current_price);
			skills[this.current_id]++;
			GameApp.inst().refreshRoleAttr("roleSkillLevels",skills);
			MessageManager.inst().dispatch(CustomEvt.SKILL_CLICK_INFO,{id:this.current_id,id2:1});
			this.refreshData(this.current_id);
			MessageManager.inst().dispatch(CustomEvt.ZHUANG_BEI, this);
			let next_power: number = GameApp.inst().getAllPower(0);
			// if( now_power != next_power ) {
			// 	let add = now_power < next_power ? "+" : "";
				//UserTips.inst().showTips( `升级成功    战斗力 ${add}${Math.floor( next_power - now_power )}` );
				TipsBox.showTips2( `升级成功` , -1 , 1000 );
			// }
			GameApp.inst().setTaskData(4, null);
			MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ "roleLevel" ] );
		}else
		{
			//UserTips.inst().showTips("金币不足");
			if(egret.getOption("recharge"))
			{
				ViewManager.inst().open(RechargeTips);
			}else
			{
				TipsBox.showTips2( `金币不足` , -1 , 1000 );
			}
		}
	}
	initData()
	{
		this.ok_btn.setCallBack(this.confirm_update.bind(this),"升 级","forge_btn2_png");
		let skillLevels:number[]=GameApp.inst().getSkillLevels();
		for(let i=0;i<skillLevels.length; i++)
		{
			let skillItem:SKILLItem=new SKILLItem(i);
			this.content_group.addChild(skillItem);
			skillItem.y=10+(skillItem.height+10)*i;
			skillItem.x=0;
			if((i+1)==skillLevels.length)
			{
				this.content_group.height=(skillItem.height+10)*skillLevels.length;
			}
			this.skillItemArr.push(skillItem);
		}
	}
	refreshData(id:number)
	{
		for(let i=0;i<this.skillItemArr.length;i++)
		{
			this.skillItemArr[i].initData(id);
		}
	}
	private onTap(evt:egret.TouchEvent):void
	{
		switch(evt.target)
		{
			case this.close_btn:
				MessageManager.inst().dispatch(CustomEvt.BTN_POS_FUWEI, this);
				ViewManager.inst().close(SkillView);
			break;
		}

	}

	public close():void
	{
		this.timer.stop();
		this.removeTouchEvent(this.close_btn,this.onTap);
		MessageManager.inst().removeListener(CustomEvt.SKILL_CLICK_INFO,this.skill_info,this);
	}

	public guideCfg = {
		x: StageUtils.inst().getWidth()/2 + 230*(StageUtils.inst().getWidth()/1334),
		y: StageUtils.inst().getHeight()/2 + 230*(StageUtils.inst().getWidth()/1334),
		info: "在此升级技能，提升战斗实力",
		bg: 4,
		fun: this.guideHandler.bind( this ),
		target: "skill",
		obj: this
	}

	private guideHandler():void {
		this.confirm_update();
		NoviceGuideView.setGuideLocal( "skill" );
	}
}
ViewManager.inst().reg(SkillView,LayerManager.UI_Pop);