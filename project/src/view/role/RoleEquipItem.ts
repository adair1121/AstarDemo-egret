class RoleEquipItem extends BaseView
{
	private equip_bg:eui.Image;
	private equip_icon:eui.Image;
	private pos_label:eui.Label;
	private equipID:number;
	private posID:number;
	private str:string[] = ["武器","宝甲","护腕","戒指","头盔","项链","腰带","鞋子"];
	private effect_group:eui.Group;
	private red_img:eui.Image;
	private pinjie_label:eui.Label;
	private forgeLevelLab: eui.Label;

	public constructor(pos:number, _id:number)
	{
		super();
		this.equipID = _id;
		this.posID = pos;
		this.skinName = "RoleEquipItemSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage()
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.jiance();
		this.init();
		MessageManager.inst().addListener(CustomEvt.ZHUANG_BEI, this.zhuangbei, this);
		MessageManager.inst().addListener("REMOVE_EQUIP", this.removeEquip, this);
		MessageManager.inst().addListener(CustomEvt.ADD_BAG, this.jiance, this);
		this.addTouchEvent(this, this.touchTap);
	}
	private onRemoveFromStage()
	{
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		MessageManager.inst().removeListener(CustomEvt.ZHUANG_BEI, this.zhuangbei, this);
		MessageManager.inst().removeListener("REMOVE_EQUIP", this.removeEquip, this);
		MessageManager.inst().removeListener(CustomEvt.ADD_BAG, this.jiance, this);
		this.removeTouchEvent(this, this.touchTap);
	}
	private init()
	{
		this.pos_label.text = this.str[this.posID];
		let forgeCfg = GameApp.inst().roleAttr.roleForginDatas;
		this.forgeLevelLab.text = `${forgeCfg[this.posID]}`;
		if(this.equipID != 0)
		{
			this.pos_label.visible = false;
			this.equip_icon.visible = true;
			let item:GoodsData = BagController.inst().getTableData(this.equipID);
			this.equip_bg.source = `item_box_${item.quality}_png`;
			this.equip_icon.source = `item_${item.modelId}_png`;
			this.pinjie_label.text = `${item.starLev}阶`;
			this.effect_group.removeChildren();
			let effect = new MovieClip();
			effect.playFile(`${EFFECT}quality_effect_${item.quality}`, -1);
			this.effect_group.addChild(effect);
			this.effect_group.visible = true;
		}else 
		{
			this.equip_bg.source = `role_quality_0_png`;
			this.equip_icon.source = ``;
			this.pos_label.visible = true;
			this.equip_icon.visible = false;
			this.pinjie_label.text = ``;
		}
	}
	private zhuangbei()
	{
		let nowEquipID = this.jiance();
		if(nowEquipID == this.equipID)
		{
			return;
		}
		this.red_img.visible = false;
		/**替换 */
		if(this.equipID == 0)
		{
			MessageManager.inst().dispatch(CustomEvt.ROLE_ZHUANGBEI_DATA, this);
			this.equipID = nowEquipID;
			let item:GoodsData = BagController.inst().getTableData(this.equipID);
			GameApp.inst().refreshRoleAttr(this.getRoleAttr(item.attrs), (GameApp.inst().getRoleAttr(item.attrs) + item.values));
			this.init();
		}else 
		{
			MessageManager.inst().dispatch(CustomEvt.ROLE_ZHUANGBEI_DATA, this);
			let item:GoodsData = BagController.inst().getTableData(this.equipID);
			GameApp.inst().refreshRoleAttr(this.getRoleAttr(item.attrs), (GameApp.inst().getRoleAttr(item.attrs) - item.values));
			this.equipID = nowEquipID;
			let item0:GoodsData = BagController.inst().getTableData(this.equipID);
			GameApp.inst().refreshRoleAttr(this.getRoleAttr(item0.attrs), (GameApp.inst().getRoleAttr(item0.attrs) + item0.values));
			this.init();
		}
		GameApp.inst().roleAttr.roleEquips[this.posID] = this.equipID;
		GameApp.inst().refreshRoleAttr("roleEquips", GameApp.inst().roleAttr.roleEquips);
	}
	private touchTap()
	{
		if(this.equipID == 0)
		{
			UserTips.inst().showTips1("没有装备");
		}else 
		{
			ViewManager.inst().open(RoleEquipTip, [this.equipID]);
		}
	}
	private jiance():number
	{
		/**筛选 */
		let nowEquipID = this.equipID;
		let newEuip;
		let equipVec:GoodsData[] = [];
		for(let i = 0; i < GameApp.inst().bagData.length; i++)
		{
			let equip:GoodsData = BagController.inst().getTableData(GameApp.inst().bagData[i].itemId);
			if(equip.equipPos == this.posID)
			{
				equipVec.push(equip);
			}
		}
		for(let i = 0; i < equipVec.length; i++)
		{
			if(nowEquipID == 0)
			{
				nowEquipID = equipVec[i].itemId;
			}else
			{
				let nowEuip = BagController.inst().getTableData(nowEquipID);
				newEuip = equipVec[i];
				if(newEuip.wearLevel > nowEuip.wearLevel && GameApp.inst().roleAttr.roleLevel >= newEuip.wearLevel)
				{
					nowEquipID = newEuip.itemId;
				}
			}
		}
		if(nowEquipID != this.equipID)
		{
			this.red_img.visible = true;
		}else
		{
			this.red_img.visible = false;
		}
		return nowEquipID;
	}
	private removeEquip(data:any)
	{
		if(data.data == this.equipID)
		{
			this.equipID = 0;
			this.equip_bg.source = `role_quality_0_png`;
			this.effect_group.visible = false;
			GameApp.inst().roleAttr.roleEquips[this.posID] = this.equipID;
			let item:GoodsData = BagController.inst().getTableData(data.data);
			GameApp.inst().refreshRoleAttr(this.getRoleAttr(item.attrs), (GameApp.inst().getRoleAttr(item.attrs) - item.values));
			GameApp.inst().refreshRoleAttr("roleEquips", GameApp.inst().roleAttr.roleEquips);
			this.init();
			MessageManager.inst().dispatch(CustomEvt.ROLE_ZHUANGBEI_DATA, this);
		}
		
	}
	public getRoleAttr(key:string)
	{
		let num = "";
		switch(key)
		{
			case "hp":
				num = "roleHp";
				break;
			case "mp":
				num = "roleMp";
				break;
			case "attack":
				num = "roleAttack";
				break;
			case "def":
				num = "roleDef";
				break;
			case "cirt":
				num = "roleCirt";
				break;
			case "kCirk":
				num = "role_kCirk";
				break;
			case "hit":
				num = "roleHit";
				break;
			case "dodge":
				num = "roleDodge";
				break;
		}
		return num;
	}
}