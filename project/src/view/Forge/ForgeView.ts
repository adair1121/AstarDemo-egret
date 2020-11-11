class ForgeView extends BaseEuiView{
	/**
	 * 关闭按钮
	 */
	private close_btn:eui.Rect;
	/**
	 * 展示人物界面
	 */
	private show_group:eui.Group;
	private view_group:eui.Group;
	private skillButton:SkillButton;
	private smeltingButton:SkillButton;
	private ForgeItemNumArr:number[]=[];
	private attack_font:eui.BitmapLabel;
	private attack_hp1_font:eui.Label;
	private attack_hp2_font:eui.Label;
	private attack_hp11_font:eui.Label;
	private attack_hp22_font:eui.Label;
	private ForgeItemArr:ForgeItem[]=[];

	private fireGroup: eui.Group;

	private text_flow:eui.Label;
	private text_flow2:eui.Label;
	private touch_id:number=-1;
	private str_all:string[]=["attack","def","hit","mp","kCirk","hp","cirt","dodge"];
	private ch_all:string[]=["攻击:","防御:","命中:","魔法:","抗暴:","生命:","暴击:","闪避:"];
	private attack_all:number[]=[2,1,0.5,0.5,1,2,2,1];
	private current_num:number=0;
	private current_itemid:number=0;

	private text2_label:eui.Label;
	private text22_label:eui.Label;
	private text11_label:eui.Label;
	private text1_label:eui.Label;
	private text_bg:eui.Image;
	private width_length:number;
    public open(...param):void
	{
		this.view_group["autoSize"]();
		this.width_length=this.text_bg.width;
		this.showGroup(8);
		this.skillButton.setCallBack(this.confirm_forge.bind(this),"强 化","forge_btn2_png");
		this.smeltingButton.setCallBack(this.confirm2_forge.bind(this),"熔炼装备","forge_btn1_png");
		this.addTouchEvent(this.close_btn,this.onTap,true);
		MessageManager.inst().addListener(CustomEvt.FORGE_CLICK_INFO,this.getForgeInfo,this);
		this.makeTouchId();
		this.setTouch();
		NoviceGuideView.showGuide( [this.guideCfg] , false , this );
        let eff = new MovieClip();
		eff.playFile( "resource/res/animate/power_fire" , -1 );
		this.fireGroup.addChild( eff );
		this.add_movie();
	}
	current_eff:MovieClip;
	add_movie()
	{
		this.current_eff = new MovieClip();
		this.current_eff.playFile( "resource/res/view/forge/forge_mc2" , -1);
		this.ForgeItemArr[this.touch_id].parent.addChild(this.current_eff);
		this.ForgeItemArr[this.touch_id].parent.setChildIndex(this.current_eff,100);
		this.current_eff.x=this.ForgeItemArr[this.touch_id].x;
		this.current_eff.y=this.ForgeItemArr[this.touch_id].y;
	}
	makeTouchId()
	{
		let id:number=0;
		let current_lev:number=0;
		this.ForgeItemNumArr=GameApp.inst().getForgeArrId();
		for(let i=0;i<this.ForgeItemNumArr.length;i++)
		{
			if(i==0)
			{
				current_lev=this.ForgeItemNumArr[i];
			}else
			{
				if(this.ForgeItemNumArr[i]<current_lev)
				{
					id=i;
				}
			}
		}
		this.touch_id=id;
	}
	makeTouchId2()
	{
		if(this.touch_id==0)
		{
			this.touch_id=7;
		}else
		{
			this.touch_id--;
		}
	}
	private touchState:boolean=true;
	private time:number=0;
	private time2:number=0;
	moveForge()
	{
		this.touchState=false;
		this.current_eff.visible=false;
		this.time2++;
		for(let i=0;i<this.ForgeItemArr.length;i++)
		{
			if((i+1)!=this.ForgeItemArr.length)
			{
				egret.Tween.get(this.ForgeItemArr[i]).to({x:this.ForgeItemArr[i+1].x,y:this.ForgeItemArr[i+1].y},250).to({},50).call(function(){
					if(this.time2==this.time)
					{	
						setTimeout(function(){
							this.touchState=true;
							this.current_eff.visible=true;
						}.bind(this),300);
						
						for(let i=0;i<this.ForgeItemArr.length;i++)
						{
							let forgeItem:ForgeItem=this.ForgeItemArr[i];
							this.touch_id==i?forgeItem.setTouch(true):forgeItem.setTouch(false);
						}
					}else
					{
						if(i==7)
						this.moveForge();
					}
				}.bind(this));
			}else
			{
				egret.Tween.get(this.ForgeItemArr[i]).to({x:this.ForgeItemArr[0].x,y:this.ForgeItemArr[0].y},250).to({},50).call(function(){
					if(this.time2==this.time)
					{	
						setTimeout(function(){
							this.touchState=true;
							this.current_eff.visible=true;
						}.bind(this),300);
						for(let i=0;i<this.ForgeItemArr.length;i++)
						{
							let forgeItem:ForgeItem=this.ForgeItemArr[i];
							this.touch_id==i?forgeItem.setTouch(true):forgeItem.setTouch(false);
						}
					}else
					{
						if(i==7)
						this.moveForge();
					}
				}.bind(this));;
			}
			
		}
	}
	moveForge2()
	{
		this.touchState=false;
		this.current_eff.visible=false;
		this.time2++;
		for(let i=0;i<this.ForgeItemArr.length;i++)
		{
			if(i!=0)
			{
				egret.Tween.get(this.ForgeItemArr[i]).to({x:this.ForgeItemArr[i-1].x,y:this.ForgeItemArr[i-1].y},250).to({},50).call(function(){
					if(this.time2==this.time)
					{	
						setTimeout(function(){
							this.touchState=true;
							this.current_eff.visible=true;
						}.bind(this),300);
						
						for(let i=0;i<this.ForgeItemArr.length;i++)
						{
							let forgeItem:ForgeItem=this.ForgeItemArr[i];
							this.touch_id==i?forgeItem.setTouch(true):forgeItem.setTouch(false);
						}
					}else
					{
						if(i==7)
						this.moveForge2();
					}
				}.bind(this));
			}else
			{
				egret.Tween.get(this.ForgeItemArr[i]).to({x:this.ForgeItemArr[7].x,y:this.ForgeItemArr[7].y},250).to({},50).call(function(){
					if(this.time2==this.time)
					{	
						setTimeout(function(){
							this.touchState=true;
							this.current_eff.visible=true;
						}.bind(this),300);
						for(let i=0;i<this.ForgeItemArr.length;i++)
						{
							let forgeItem:ForgeItem=this.ForgeItemArr[i];
							this.touch_id==i?forgeItem.setTouch(true):forgeItem.setTouch(false);
						}
					}else
					{
						if(i==7)
						this.moveForge2();
					}
				}.bind(this));;
			}
			
		}
	}
	setTouch()
	{
		for(let i=0;i<this.ForgeItemArr.length;i++)
		{
			let forgeItem:ForgeItem=this.ForgeItemArr[i];
			this.touch_id==i?forgeItem.setTouch(true):forgeItem.setTouch(false);
			if(i>=this.touch_id)
			{
				this.setPos(i-this.touch_id,this.ForgeItemArr[i]);
			}else
			{
				this.setPos(i-this.touch_id+8,this.ForgeItemArr[i]);
			}
		}
		let forge1:ForgeSData=<ForgeSData>{};
		let forge2:ForgeSData=<ForgeSData>{};
		
		for(let i=0;i<GameApp.inst().getAllForges().length;i++)
		{
			let forge:ForgeSData=GameApp.inst().getAllForges()[i];
			if(forge.equipPos==this.touch_id&&forge.level==GameApp.inst().getForgeArrId()[this.touch_id])
			{
				forge1=forge;
				break;
			}
		}
		for(let i=0;i<GameApp.inst().getAllForges().length;i++)
		{
			let forge:ForgeSData=GameApp.inst().getAllForges()[i];
			if(forge.equipPos==this.touch_id&&forge.level==(GameApp.inst().getForgeArrId()[this.touch_id]+1))
			{
				forge2=forge;
				break;
			}
		}
		this.current_num=forge1.itemCost;
		this.current_itemid=forge1.itemId;
		if(forge2.attrs)
		{
			this.skillButton.visible=true;
		}else
		{
			this.skillButton.visible=false;
			forge2=<ForgeSData>{values:forge1.values,itemCost:0};
		}
		this.attack_font.text=`${Math.floor(this.getAllForge())}`;
		this.text1_label.text=`${this.ch_all[this.str_all.indexOf(forge1.attrs.split("_")[0])]}`;
		this.text11_label.text=`${this.ch_all[this.str_all.indexOf(forge1.attrs.split("_")[1])]}`;
		this.text2_label.text=`${this.ch_all[this.str_all.indexOf(forge2.attrs.split("_")[0])]}`;
		this.text22_label.text=`${this.ch_all[this.str_all.indexOf(forge2.attrs.split("_")[1])]}`;
		this.attack_hp1_font.text=`${forge1.values.split("_")[0]}`;
		this.attack_hp11_font.text=`${forge1.values.split("_")[1]}`;
		this.attack_hp2_font.text=`${forge2.values.split("_")[0]}`;
		this.attack_hp22_font.text=`${forge2.values.split("_")[1]}`;
		this.text_flow2.text=`${GameApp.inst().getForgeStone(forge1.itemId)}/${forge1.itemCost}`;
		this.text_flow2.validateNow();
		this.text_bg.width=this.text_flow2.width+this.width_length;
		this.refresh();
	}
	/**
	 * 移动
	 */
	getForgeInfo(customEvt:CustomEvt)
	{
		if(!this.touchState)return;
		if(customEvt.data.id3)
		{ 
			if(customEvt.data.id3==this.touch_id)return;
			if(customEvt.data.id3>this.touch_id)
			{
				this.time=this.touch_id-customEvt.data.id3+8;
			}else
			{
				this.time=this.touch_id-customEvt.data.id3;
			}
			this.touch_id=customEvt.data.id3;
			this.time2=0;
			for(let i=0;i<this.ForgeItemArr.length;i++)
			{
				let forgeItem:ForgeItem=this.ForgeItemArr[i];
				forgeItem.setTouch(false);
			}
			if(this.time>4)
			{
				this.time=8-this.time;
				this.moveForge2();
			}else
			{
				this.moveForge();
			}
			console.log("this.time"+this.time);
		}else if(customEvt.data.id3==0)
		{
			if(customEvt.data.id3==this.touch_id)return;
			if(customEvt.data.id3>this.touch_id)
			{
				this.time=this.touch_id-customEvt.data.id3+8;
			}else
			{
				this.time=this.touch_id-customEvt.data.id3;
			}
			this.touch_id=customEvt.data.id3;
			this.time2=0;
			for(let i=0;i<this.ForgeItemArr.length;i++)
			{
				let forgeItem:ForgeItem=this.ForgeItemArr[i];
				forgeItem.setTouch(false);
			}
			if(this.time>4)
			{
				this.time=8-this.time;
				this.moveForge2();
			}else
			{
				this.moveForge();
			}
			console.log("this.time"+this.time);
		}else
		{
			if(this.touch_id==0)
			{
				this.time=8-customEvt.data.id;
			}else
			{
				this.time=this.touch_id-customEvt.data.id;
			}
			this.time2=0;
			this.moveForge();
		}
		// if(this.touch_id==customEvt)
		
		let forge1:ForgeSData=<ForgeSData>{};
		let forge2:ForgeSData=<ForgeSData>{};
		
		for(let i=0;i<GameApp.inst().getAllForges().length;i++)
		{
			let forge:ForgeSData=GameApp.inst().getAllForges()[i];
			if(forge.equipPos==this.touch_id&&forge.level==GameApp.inst().getForgeArrId()[this.touch_id])
			{
				forge1=forge;
				break;
			}
		}
		for(let i=0;i<GameApp.inst().getAllForges().length;i++)
		{
			let forge:ForgeSData=GameApp.inst().getAllForges()[i];
			if(forge.equipPos==this.touch_id&&forge.level==(GameApp.inst().getForgeArrId()[this.touch_id]+1))
			{
				forge2=forge;
				break;
			}
		}
		this.current_num=forge1.itemCost;
		this.current_itemid=forge1.itemId;
		if(forge2.attrs)
		{
			this.skillButton.visible=true;
		}else
		{
			this.skillButton.visible=false;
			forge2=<ForgeSData>{values:forge1.values,itemCost:0};
		}
		this.attack_font.text=`${Math.floor(this.getAllForge())}`;
		this.text1_label.text=`${this.ch_all[this.str_all.indexOf(forge1.attrs.split("_")[0])]}`;
		this.text11_label.text=`${this.ch_all[this.str_all.indexOf(forge1.attrs.split("_")[1])]}`;
		this.text2_label.text=`${this.ch_all[this.str_all.indexOf(forge2.attrs.split("_")[0])]}`;
		this.text22_label.text=`${this.ch_all[this.str_all.indexOf(forge2.attrs.split("_")[1])]}`;
		this.attack_hp1_font.text=`${forge1.values.split("_")[0]}`;
		this.attack_hp11_font.text=`${forge1.values.split("_")[1]}`;
		this.attack_hp2_font.text=`${forge2.values.split("_")[0]}`;
		this.attack_hp22_font.text=`${forge2.values.split("_")[1]}`;
		this.text_flow2.text=`${GameApp.inst().getForgeStone(forge1.itemId)}/${forge1.itemCost}`;
		this.text_flow2.validateNow();
		this.text_bg.width=this.text_flow2.width+this.width_length;
		
		this.refresh();
	}
	getAllForge()
	{
		let num:number=0;
		for(let k=0;k<GameApp.inst().getForgeArrId().length;k++)
		{
			for(let i=0;i<GameApp.inst().getAllForges().length;i++)
			{
				let forge:ForgeSData=GameApp.inst().getAllForges()[i];
				if(forge.equipPos==k&&forge.level==(GameApp.inst().getForgeArrId()[k]))
				{
					num+=this.attack_all[this.str_all.indexOf(forge.attrs.split("_")[0])]*parseInt(forge.values.split("_")[0])+this.attack_all[this.str_all.indexOf(forge.attrs.split("_")[1])]*parseInt(forge.values.split("_")[1]);
					break;
				}
			}
		}
		return num;
	}
	refresh()
	{
		for(let i=0;i<this.ForgeItemArr.length;i++)
		{
			this.ForgeItemArr[i].refreshInitData(GameApp.inst().getForgeArrId()[i]);
		}
	}
	playMC()
	{
		let eff = new MovieClip();
		eff.playFile( "resource/res/view/forge/forge_mc3" , 1 ,function(){
			this.touchState=true;
			if(this.touch_id==0)
			{
				MessageManager.inst().dispatch(CustomEvt.FORGE_CLICK_INFO,{id:7});
			}else
			{
				MessageManager.inst().dispatch(CustomEvt.FORGE_CLICK_INFO,{id:this.touch_id-1});
			}
		}.bind(this),true);
		eff.scaleX=0.7;
		eff.scaleY=0.7;
		this.ForgeItemArr[this.touch_id].addChild(eff);
		eff.x=this.ForgeItemArr[this.touch_id].width/2;
		eff.y=this.ForgeItemArr[this.touch_id].height/2;
		for(let i=0;i<this.ForgeItemArr.length;i++)
		{
			let forgeItem:ForgeItem=this.ForgeItemArr[i];
			forgeItem.setTouch(false);
		}
	}
	confirm_forge()
	{
		if(!this.touchState)
		{
			return;
		}
		this.touchState=false;
		if(GameApp.inst().getForgeStone(this.current_itemid)>=this.current_num)
		{
			let level_arr:number[]=GameApp.inst().getForgeArrId();
			if(level_arr[this.touch_id]>=GameApp.inst().getRoleLevel())
			{
				//UserTips.inst().showTips("请提升人物等级");
				TipsBox.showTips2( `请提升人物等级` , -1 , 1000 );
				return;
			}
			let now_power: number = GameApp.inst().getAllPower(0);
			GameApp.inst().calculPower();
			this.playMC();
			level_arr[this.touch_id]++;
			GameApp.inst().refreshRoleAttr("roleForginDatas",level_arr);
			GameApp.inst().saveForgeStone(this.current_itemid,this.current_num);
			//MessageManager.inst().dispatch(CustomEvt.FORGE_CLICK_INFO,{id:this.touch_id,id2:1});
			this.makeTouchId2();
			GameApp.inst().setTaskData(5, null);
			let next_power: number = GameApp.inst().getAllPower(0);
			// if( now_power != next_power ) {
				let add = now_power < next_power ? "+" : "";
				//UserTips.inst().showTips( `锻造成功     战斗力 ${add}${Math.floor( next_power - now_power )}` );
				TipsBox.showTips2( `锻造成功` , -1 , 1000 );
			// }
			MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ "roleLevel" ] );
			// UserTips.inst().showTips( "锻造成功！" );
		}else
		{
			//UserTips.inst().showTips("强化石不足");
			TipsBox.showTips2( `强化石不足` , -1 , 1000 );
		}
	}
	confirm2_forge()
	{
		ViewManager.inst().close(ForgeView);
		ViewManager.inst().open(Smelting);
	}
	/**
	 * 显示锻造
	 */
	showGroup(num_arr:number)
	{
		this.ForgeItemNumArr=GameApp.inst().getForgeArrId();
		for(let i=0;i<this.ForgeItemNumArr.length;i++)
		{
			let forgeItem:ForgeItem=new ForgeItem(i,this.ForgeItemNumArr[i]);
			this.show_group.addChild(forgeItem);
			forgeItem.anchorOffsetX=forgeItem.width/2;
			forgeItem.anchorOffsetY=forgeItem.height/2;
			//this.setPos(i,forgeItem);
			this.touch_id==i?forgeItem.setTouch(true):forgeItem.setTouch(false);
			this.ForgeItemArr.push(forgeItem);
		}
	}
	hypotenuse(long,angle){
    //获得弧度
    var radian = 2*Math.PI/360*angle;
		return {
			a:Math.sin(radian) * long,//邻边
			b:Math.cos(radian) * long//对边
		};
	}
	setPos(id:number,forgeItem:ForgeItem)
	{
		let distance:number=30;
		switch((id+2)%8)
		{
			case 0:
				forgeItem.x=distance+forgeItem.width/2;
				forgeItem.y=this.show_group.height/2;
			break;
			case 1:
				forgeItem.x=this.show_group.width/2-this.hypotenuse(this.show_group.height/2-distance-forgeItem.width/2,45).a;
				forgeItem.y=this.show_group.height/2-this.hypotenuse(this.show_group.height/2-distance-forgeItem.width/2,45).b;
			break;
			case 2:
				forgeItem.x=this.show_group.width/2;
				forgeItem.y=distance+forgeItem.width/2;
			break;
			case 3:
				forgeItem.x=this.show_group.width/2+this.hypotenuse(this.show_group.height/2-distance-forgeItem.width/2,45).a;
				forgeItem.y=this.show_group.height/2-this.hypotenuse(this.show_group.height/2-distance-forgeItem.width/2,45).b;
			break;
			case 4:
				forgeItem.x=this.show_group.width-(distance+forgeItem.width/2);
				forgeItem.y=this.show_group.height/2;
			break;
			case 5:
				forgeItem.x=this.show_group.width/2+this.hypotenuse(this.show_group.height/2-distance-forgeItem.width/2,45).a;
				forgeItem.y=this.show_group.height/2+this.hypotenuse(this.show_group.height/2-distance-forgeItem.width/2,45).b;
			break;
			case 6:
				forgeItem.x=this.show_group.width/2;
				forgeItem.y=this.show_group.height-(distance+forgeItem.width/2);
			break;
			case 7:
				forgeItem.x=this.show_group.width/2-this.hypotenuse(this.show_group.height/2-distance-forgeItem.width/2,45).a;
				forgeItem.y=this.show_group.height/2+this.hypotenuse(this.show_group.height/2-distance-forgeItem.width/2,45).b;
			break;
		}
	}
	private onTap(evt:egret.TouchEvent):void
	{
		switch(evt.target)
		{
			case this.close_btn:
				MessageManager.inst().dispatch(CustomEvt.BTN_POS_FUWEI, this);
				ViewManager.inst().close(ForgeView);
			break;
        	}
	}
	

	public close():void
	{
		this.removeTouchEvent(this.close_btn,this.onTap);
		MessageManager.inst().removeListener(CustomEvt.FORGE_CLICK_INFO,this.getForgeInfo,this);
	}
	private guideCfg = {
		x: StageUtils.inst().getWidth()/2 + 230*(StageUtils.inst().getWidth()/1334),
		y: StageUtils.inst().getHeight()/2 + 230*(StageUtils.inst().getWidth()/1334),
		info: "通过消耗强化石对装备槽进行强化，在熔炼装备、强化石副本中可获取大量石材。",
		bg: 4,
		fun: this.guideHandler.bind( this ),
		target: "forge",
		obj: this
	}

	private guideHandler():void {
		this.confirm_forge();
		NoviceGuideView.setGuideLocal( "forge" );
	}
}
ViewManager.inst().reg(ForgeView,LayerManager.UI_Pop);