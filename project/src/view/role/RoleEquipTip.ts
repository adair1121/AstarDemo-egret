class RoleEquipTip extends BaseEuiView
{
	private touch_rect:eui.Rect;
	private tip_group:eui.Group;
	private equip_pos:eui.Label;
	private pinjie_label:eui.Label;
	private xuqiu_label:eui.Label;
	private attrs_label:eui.Label;
	private map_name:eui.Label;
	private melting_label:eui.Label;
	private icon_bg:eui.Image;
	private equip_icon:eui.Image;
	private unload_btn:eui.Button;
	private item:GoodsData;
	private effect_group:eui.Group;
	public constructor() 
	{
		super();
	}
	public open(...param):void{
		this.item = BagController.inst().getTableData(param[0]);
		this.addTouchEvent(this, this.touchTap);
		this.icon_bg.source = `item_box_${this.item.quality}_png`;
		this.equip_icon.source = `item_${this.item.modelId}_png`;
		this.pinjie_label.text = `${this.item.starLev}`;
		this.xuqiu_label.text = `${this.item.wearLevel}`;
		this.melting_label.text = `${this.item.melting}强化石`;
		this.attrs_label.text = `${this.getAttrsTitle(this.item.attrs)}: ${this.item.values}`;
		this.map_name.text = `${this.getEquipMap(this.item.itemId)}`;
		let effect = new MovieClip();
		effect.playFile(`${EFFECT}quality_effect_${this.item.quality}`, -1);
		this.effect_group.addChild(effect);
		
	}
	public close():void{
		this.removeTouchEvent(this, this.touchTap);
	}
	private touchTap(evt:egret.TouchEvent)
	{
		switch(evt.target)
		{
			case this.touch_rect:
				ViewManager.inst().close(RoleEquipTip);
				break;
			case this.unload_btn:
				ViewManager.inst().close(RoleEquipTip);
				MessageManager.inst().dispatch("REMOVE_EQUIP", this.item.itemId);
				break;
		}
	}
	private getAttrsTitle(str:string):string
	{
		if(str == "hp")
		{
			return "生命";
		}	
		else if(str == "mp")
		{	return "魔法";}
		else if(str == "attack")
		{	return "攻击";}
		else if(str == "def")
		{	return "防御";}
		else if(str == "cirt")
		{	return "暴击";}
		else if(str == "kCirk")
		{	return "抗暴";}
		else if(str == "dodge")
		{	return "闪避";}
		else if(str == "hit")
		{	return "命中";}
	}

	private getEquipMap(id:number):string
	{
		let str = "";
		for(let i = 0; i < GameApp.inst().monsterData.length; i++)
		{
			let idVec = GameApp.inst().monsterData[i].dropID.split("_");
			for(let j = 0; j < idVec.length; j++)
			{
				if(parseInt(idVec[j])==id)
				{
					str = GameApp.inst().monsterData[i].sceneName;
				}
			}
		}
		return str;
	}
}
ViewManager.inst().reg(RoleEquipTip,LayerManager.UI_Pop);