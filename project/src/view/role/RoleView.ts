class RoleView extends BaseEuiView
{
	private role_group:eui.Group;
	private equip_0:eui.Group;
	private equip_1:eui.Group;
	private equip_2:eui.Group;
	private equip_3:eui.Group;
	private equip_4:eui.Group;
	private equip_5:eui.Group;
	private equip_6:eui.Group;
	private equip_7:eui.Group;
	private effect_group:eui.Group;
	private role_img:eui.Image;
	private role_title:eui.Image;
	private exp_tiao:eui.Image;
	private exp_mask:eui.Image;
	private back_btn:eui.Rect;
	private power_label:eui.Label;
	private exp_label:eui.Label;
	private roleHp:eui.Label;
	private roleMp:eui.Label;
	private roleAttack:eui.Label;
	private roleDef:eui.Label;
	private roleCirt:eui.Label;
	private role_kCirk:eui.Label;
	private roleDodge:eui.Label;
	private roleHit:eui.Label;
	private role_name:eui.Label;
	private role_level:eui.Label;
	private nameLab:eui.Label;
	private equip_btn:eui.Button;
	public constructor() 
	{
		super();
	}
	public open(...param):void{
		this.exp_mask.mask = this.exp_tiao;
		this.role_group["autoSize"]();
		if(GameApp.inst().roleAttr.roleEquips.length <= 0)
		{
			GameApp.inst().roleAttr.roleEquips = [0,0,0,0,0,0,0,0];
		}
		for(let i = 0; i < 8; i++)
		{
			let item = new RoleEquipItem(i, GameApp.inst().roleAttr.roleEquips[i]);
			this[`equip_${i}`].addChild(item);
		}
		this.updateData();
		this.addTouchEvent(this.back_btn, this.touchBack, true);
		this.addTouchEvent(this.equip_btn, this.touchEquip, true);
		MessageManager.inst().addListener(CustomEvt.ROLE_ZHUANGBEI_DATA, this.updateData, this);
		MessageManager.inst().addListener(CustomEvt.ROLE_EXPCHANGE, this.updateData, this);
		MessageManager.inst().addListener(CustomEvt.ROLE_SHENGJI, this.updateData, this);
		NoviceGuideView.showGuide( [this.guideCfg] , false , this );
		let eff = new MovieClip();
		eff.playFile( "resource/res/animate/power_fire" , -1 );
		this.effect_group.addChild(eff);
	}
	public close():void{
		this.removeTouchEvent(this.back_btn, this.touchBack);
		this.removeTouchEvent(this.equip_btn, this.touchEquip);
		MessageManager.inst().removeListener(CustomEvt.ROLE_ZHUANGBEI_DATA, this.updateData, this);
		MessageManager.inst().removeListener(CustomEvt.ROLE_EXPCHANGE, this.updateData, this);
		MessageManager.inst().removeListener(CustomEvt.ROLE_SHENGJI, this.updateData, this);
	}
	private touchBack()
	{
		MessageManager.inst().dispatch(CustomEvt.BTN_POS_FUWEI, this);
		ViewManager.inst().close(RoleView);
	}
	private touchEquip()
	{
		if(GameApp.inst().bagData.length > 0)
		{
			MessageManager.inst().dispatch(CustomEvt.ZHUANG_BEI, this);
		}
	}
	public updateData()
	{
		let now_power: number = GameApp.inst().roleAttr.rolePower;
		GameApp.inst().calculPower();
		let next_power: number = GameApp.inst().roleAttr.rolePower;
		if( now_power != next_power ) {
			let add = now_power < next_power ? "+" : "";
			let tip = now_power < next_power ? "" : "成功卸下装备";
			UserTips.inst().showTips2( `${tip}  战斗力 ${add}${Math.floor( next_power - now_power )}` );
		}
		this.role_img.source = `${GameApp.inst().roleAttr.roleModelId}_${GameApp.inst().roleAttr.roleSex}_png`;
		this.power_label.text = "" + Math.ceil(GameApp.inst().roleAttr.rolePower);
		this.role_name.text = GameApp.inst().roleAttr.roleName;
		this.role_level.text = "" + GameApp.inst().roleAttr.roleLevel;
		this.exp_label.text = `${GameApp.inst().roleAttr.roleExp} / ${GameApp.inst().roleAttr.roleMaxExp}`;	
		this.exp_mask.width = GameApp.inst().roleAttr.roleExp * (this.exp_tiao.width / GameApp.inst().roleAttr.roleMaxExp);
		this.roleHp.text = "" + GameApp.inst().roleAttr.roleHp;
		this.roleMp.text = "" + GameApp.inst().roleAttr.roleMp;
		this.roleAttack.text = "" + GameApp.inst().roleAttr.roleAttack;
		this.roleDef.text = "" + GameApp.inst().roleAttr.roleDef;
		this.roleCirt.text = "" + GameApp.inst().roleAttr.roleCirt;
		this.role_kCirk.text = "" + GameApp.inst().roleAttr.role_kCirk;
		this.roleDodge.text = "" + GameApp.inst().roleAttr.roleDodge;
		this.roleHit.text = "" + GameApp.inst().roleAttr.roleHit;

		let titleId:number = GameApp.inst().roleAttr.roleTitleId;
		if(titleId!=0)
		{
			this.nameLab.visible = true;
			this.role_title.visible = true;
			let titleCfg:TitleCfg = GameApp.inst().getTitleById(titleId);
			let index:number = 0;
			for(let i:number = 0;i<GameApp.inst().titlCfg.length;i++)
			{
				if(GameApp.inst().titlCfg[i].titleId == titleId){index = i;break;}
			}
			this.role_title.source = `title_head_${index}_png`;
			this.nameLab.text = titleCfg.titleName;
		}else
		{
			this.nameLab.visible = false;
			this.role_title.visible = false;
		}
	}
	public guideCfg = {
		x: StageUtils.inst().getWidth()/2 - 110*(StageUtils.inst().getWidth()/1334),
		y: StageUtils.inst().getHeight()/2 + 230*(StageUtils.inst().getWidth()/1334),
		info: "此处查看角色详情、佩戴装备",
		bg: 4,
		fun: this.guideHandler.bind( this ),
		target: "role",
		obj: this
	}

	private guideHandler():void {
		// this.confirm_update();
		this.touchEquip();
		NoviceGuideView.setGuideLocal( "role" );
	}
	
}
ViewManager.inst().reg(RoleView,LayerManager.UI_Main);