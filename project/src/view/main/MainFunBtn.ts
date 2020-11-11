class MainFunBtn extends BaseView
{
	private btn_img:eui.Image;
	private btn_name:eui.Label;
	public id:string;
	private effect_group:eui.Group;
	private effect_group0:eui.Group;
	private redImg: eui.Image;
	public constructor(_id:string) 
	{
		super();
		this.id = _id;
		this.skinName = "MainFunBtnSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage()
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
		this.btn_img.source = `main_${this.id}_png`;
		this.btn_name.text = this.getName();
		MessageManager.inst().addListener(CustomEvt.BTN_POS_FUWEI, this.posFuwei, this);
	}
	private onRemoveFromStage()
	{
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
		MessageManager.inst().removeListener(CustomEvt.BTN_POS_FUWEI, this.posFuwei, this);
	}
	private posFuwei()
	{
		this.y = 0;
		switch(this.id)
		{
			case "juese":
				this.effect_group0.visible = false;
				break;
			case "jineng":
				this.effect_group0.visible = false;
				break;
			case "duanzao":
				this.effect_group0.visible = false;
				break;
			case "beibao":
				this.effect_group0.visible = false;
				break;
		}
	}
	private getName():string
	{
		let name:string = "";
		switch(this.id)
		{
			case "fuben":
				this.name = "副本";
				this.addEffect(0);
				this.redImg.visible = false;
				break;
			case "boss":
				this.name = "BOSS";
				this.addEffect(0);
				this.redImg.visible = false;
				break;
			case "shangcheng":
				this.name = "商城";
				this.addEffect(0);
				this.redImg.visible = false;
				break;
			case "chenghao":
				this.name = "称号";
				this.addEffect(0);
				MessageManager.inst().addListener( CustomEvt.RESET_RED_POINT , this.resetTitleRed , this );
				MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ "roleLevel" ] );
				break;
			case "qiandao":
				this.name = "签到";
				this.addEffect(0);
				MessageManager.inst().addListener( CustomEvt.RESET_RED_POINT , this.resetSignRed , this );
				MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ "sign" ] );
				if(GameApp.inst().funEffectState[0] == 0)
				{
					this.addEffect(0);
				}
				break;
			case "boss":
				this.name = "boss";
				if(GameApp.inst().funEffectState[1] == 0)
				{
					this.addEffect(0);
				}
				break;
			case "shangcheng":
				this.name = "商城";
				if(GameApp.inst().funEffectState[2] == 0)
				{
					this.addEffect(0);
				}
				break;
			case "chenghao":
				this.name = "称号";
				if(GameApp.inst().funEffectState[3] == 0)
				{
					this.addEffect(0);
				}
				break;
			case "qiandao":
				this.name = "签到";
				if(GameApp.inst().funEffectState[4] == 0)
				{
					this.addEffect(0);
				}
				break;
			case "juese":
				this.name = "角色";
				MessageManager.inst().addListener( CustomEvt.RESET_RED_POINT , this.resetRoleRed , this );
				MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ "roleEquips" ] );
				this.addEffect(1);
				break;
			case "jineng":
				this.name = "技能";
				MessageManager.inst().addListener( CustomEvt.RESET_RED_POINT , this.resetSkillRed , this );
				MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ "roleLevel" ] );
				this.addEffect(1);
				break;
			case "duanzao":
				this.name = "锻造";
				MessageManager.inst().addListener( CustomEvt.RESET_RED_POINT , this.resetForgeRed , this );
				MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ "roleLevel" ] );
				this.addEffect(1);
				break;
			case "beibao":
				this.name = "背包";
				this.redImg.visible = false;
				this.addEffect(1);
				break;
		}
		return this.name;
	}
	private addEffect(state:number)
	{
		if(state == 0)
		{
			let effect = new MovieClip();
			effect.playFile(`${EFFECT}funBtn_effect`, -1);
			this.effect_group.addChild(effect);
		}else if(state == 1)
		{
			let effect = new MovieClip();
			effect.playFile(`${EFFECT}funchoose_effect`, -1);
			this.effect_group0.scaleX = this.effect_group0.scaleY = 1.2;
			this.effect_group0.x -= 2;
			this.effect_group0.addChild(effect);
			this.effect_group0.visible = false;
		}
	}
	private touchTap(evt:egret.TouchEvent)
	{
		// if(GameApp.inst().sceneId == FUBEN.FUBEN_EXP || GameApp.inst().sceneId == FUBEN.FUBEN_GOLD || GameApp.inst().sceneId == FUBEN.FUBEN_STONE || GameApp.inst().sceneId == FUBEN.FUBEN_CHALLENGE)
		// {
		// 	UserTips.inst().showTips("请返回野外副本");
		// 	return;	
		// }
		MessageManager.inst().dispatch(CustomEvt.OPEN_FUN_VIEW, this.id);
		switch(this.id)
		{
			case "fuben":
				this.name = "副本";
				GameApp.inst().funEffectState[0] = 1;
				this.effect_group.visible = false;
				break;
			case "boss":
				this.name = "boss";
				GameApp.inst().funEffectState[1] = 1;
				this.effect_group.visible = false;
				break;
			case "shangcheng":
				this.name = "商城";
				GameApp.inst().funEffectState[2] = 1;
				this.effect_group.visible = false;
				break;
			case "chenghao":
				this.name = "称号";
				GameApp.inst().funEffectState[3] = 1;
				this.effect_group.visible = false;
				break;
			case "qiandao":
				this.name = "签到";
				GameApp.inst().funEffectState[4] = 1;
				this.effect_group.visible = false;
				break;
			case "juese":
				this.y = 5;
				this.effect_group0.visible = true;
				break;
			case "jineng":
				this.y = 5;
				this.effect_group0.visible = true;
				break;
			case "duanzao":
				this.y = 5;
				this.effect_group0.visible = true;
				break;
			case "beibao":
				this.y = 5;
				this.effect_group0.visible = true;
				break;
		}
		
		egret.localStorage.setItem(LocalStorageEnum.FUN_BTN_EFFECT, JSON.stringify(GameApp.inst().funEffectState));
	}

	private resetTitleRed( event: CustomEvt ):void {
		if( event.data[0] != "roleLevel" && event.data[0] != "roleForginDatas" && event.data[0] != "roleSkillLevels" && event.data[0] != "roleKillBoss" ) return ;
		let isTrue = false;
		TitleView.resetTitles();
		let roleTitles = GameApp.inst().roleAttr.roleTitles;
		let roletitleId = GameApp.inst().roleAttr.roleTitleId;
		for( let i = 0 ; i < roleTitles.length ; i ++ ) {
			if( roleTitles[i] > roletitleId ) {
				isTrue = true;
				break;
			}
		}
		this.redImg.visible = isTrue;
	}

	private resetSignRed( event: CustomEvt ):void {
		if( event.data[0] != "sign" ) return;
		let model = SignInControl.instance.model;
		let isTrue = model.getInDay() == 1 ? false : true;
		this.redImg.visible = isTrue;
	}

	private resetRoleRed( event: CustomEvt ):void {
		if( event.data[0] != "roleEquips" && event.data[0] != "bag" ) return ;
		let equipIdArr = GameApp.inst().roleAttr.roleEquips;
		let bagEquipArr = GameApp.inst().bagData;
		let goodsAllDataArr = GameApp.inst().getAllGoods();
		let isTrue = false;
		if( equipIdArr.length < 8 ) {
			let equipAllIDArr = [ 0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 ];
			for( let i = 0 ; i < equipIdArr.length ; i ++ ) {
				let posID = GameApp.inst().getEquipData( equipIdArr[i] ).equipPos;
				equipAllIDArr.splice( posID );
			}
			for( let i = 0 ; i < equipAllIDArr.length ; i ++ ) {
				for( let j = 0 ; j < bagEquipArr.length ; j ++ ) {
					let bagEquip = this.getGoodById( bagEquipArr[j].itemId );
					if ( bagEquip.equipPos == equipAllIDArr[i] ) {
						isTrue = true;
						break;
					}
				}
			}
		}
		for( let i = 0 ; i < equipIdArr.length ; i ++ ) {
			for( let j = 0 ; j < bagEquipArr.length ; j ++ ) {
				if( equipIdArr[i] == 0 ) return ;
				let bagGood = this.getGoodById( bagEquipArr[j].itemId );
				let equip = this.getGoodById( equipIdArr[i] );
				if( equip.equipPos == bagGood.equipPos && equip.wearLevel < bagGood.wearLevel ) {
					isTrue = true;
					break;
				}
			}
		}
		this.redImg.visible = isTrue;
	}

	private getGoodById( id: number ):GoodsData {
		let allGoods = GameApp.inst().getAllGoods();
		let good = null;
		for( let i = 0 ; i < allGoods.length ; i ++ ) {
			if( allGoods[ i ].itemId == id ) {
				good = allGoods[i];
				break;
			}
		}
		return good;
	}

	private resetSkillRed( event: CustomEvt ):void {
		if( event.data[0] != "gold" && event.data[0] != "roleLevel" ) return;
		let isTrue = false;
		let roleSkillLevels = GameApp.inst().roleAttr.roleSkillLevels;
		let data = GameApp.inst().getLockSkills();
		let skillData = GameApp.inst().getAllSkills();
		for( let i = 0 ; i < data.length ; i ++ ) {
			let nextData = GameApp.inst().getSkillDATAById(data[i].nextid);
			if( GameApp.inst().roleAttr.roleLevel > data[i].skillLev && GameApp.inst().getGoldNum() >= nextData.price ) {
				isTrue = true;
				break;
			}
		}
		// let min_price = 100000;
		// for( let i = 0 ; i < data.length ; i ++ ) {
		// 	if( min_price > data[i].price ) {
		// 		min_price = data[i].price;
		// 	}
		// }
		// isTrue = GameApp.inst().getGoldNum()>= min_price && isTrue == true ? true : false;
		this.redImg.visible = isTrue;
	}

	private resetForgeRed( event: CustomEvt ):void {
		if( event.data[0] != "stone" && event.data[0] != "roleLevel" ) return;
		let isTrue = false;
		let allForges = GameApp.inst().getAllForges();
		let allForgesDataArr = GameApp.inst().getForgeArrId();
		let forgesArr: ForgeSData[] = [];
		for( let i = 0 ; i < allForgesDataArr.length ; i ++ ) {
			for( let j = 0 ; j < allForges.length ; j ++ ) {
				if( i == allForges[j].equipPos && allForgesDataArr[i] == allForges[j].level ) {
					let forge = JSON.parse( JSON.stringify( allForges[i] ) ) as ForgeSData;
					forgesArr.push( forge );
				}
			}
		}
		for( let i = 0 ; i < forgesArr.length ; i ++ ) {
			let nextForgeData = this.getForgeById( forgesArr[i].nid );
			if( nextForgeData.itemCost <= GameApp.inst().getForgeStone( forgesArr[i].itemId ) ) {
				isTrue = true;
				break;
			}
		}
		let min_level = 1000000;
		for( let i = 0 ; i < allForgesDataArr.length ; i ++ ) {
			if( allForgesDataArr[i] < min_level ) {
				min_level = allForgesDataArr[i];
			}
		}
		isTrue = GameApp.inst().roleAttr.roleLevel > min_level && isTrue == true ? true : false;
		this.redImg.visible = isTrue;
	}
	
	private getForgeById( id: number ):ForgeSData {
		let allForges = GameApp.inst().getAllForges();
		for( let i = 0 ; i < allForges.length ; i ++ ) {
			if( allForges[i].id == id ) {
				return  allForges[i];
			}
		}
	}
}