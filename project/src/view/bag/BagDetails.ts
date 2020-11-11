class BagDetails extends BaseEuiView {
	public view_group: eui.Group;
	public equip_pos: eui.Label;
	public icon_bg: eui.Image;
	public equip_icon: eui.Image;
	public pinjie_label: eui.Label;
	public xuqiu_label: eui.Label;
	public attrs_label: eui.Label;
	public map_name: eui.Label;
	public melting_label: eui.Label;
	public kongbai: eui.Rect;
	public effect_group:eui.Group;
	private data;
	private type:number = null;
	public constructor() {
		super();
	}
	public open(...param): void {
		console.log("进入o写的物品详情界面,id == ", param);
		if (param[1]) {
			this.type = param[1];
		}

		this.data = BagController.inst().getTableData(param[0]);
		this.view_group["autoSize"]();
		this.setUI();

		this.kongbai.addEventListener(egret.TouchEvent.TOUCH_TAP, this.kongbaiClick, this);
	}

	public close() {
		this.kongbai.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.kongbaiClick, this);
	}

	public setUI() {
		this.equip_pos.text = "" + this.data.itemName;
		// this.icon_bg.source = `role_quality_${this.data.quality}.png`;
		this.equip_icon.source = `item_${this.data.modelId}_png`;
		this.pinjie_label.text = `${this.data.starLev}`;
		this.xuqiu_label.text = `${this.data.wearLevel}`;
		this.melting_label.text = `${this.data.melting}强化石`;
		if(this.data.attrs == "none") {
			this.attrs_label.text = `无`;
		}
		else {
			this.attrs_label.text = `${this.getAttrsTitle(this.data.attrs)}: ${this.data.values}`;
		}
		if(this.type == 1) {
			this.map_name.text = "商城";
		}
		else {
			this.map_name.text = `${this.getEquipMap(this.data.itemId)}`;
		}
		

		if (this.data.quality > 0) {
			this.icon_bg.source = "item_box_" + this.data.quality + "_png";
			// this.icon_bg.source = "effect_" + this.data.quality + "_png";
		}
		else if (this.data.quality == 0) {
			this.icon_bg.source = "itemBox_png";
		}
		if (this.data.quality > 0) {
			let effect = new MovieClip();
			effect.playFile(`${EFFECT}quality_effect_${this.data.quality}`, -1);
			this.effect_group.addChild(effect);
		}
	}

	private getAttrsTitle(str: string): string {
		if (str == "hp") {
			return "生命";
		}
		else if (str == "mp")
		{ return "魔法"; }
		else if (str == "attack")
		{ return "攻击"; }
		else if (str == "def")
		{ return "防御"; }
		else if (str == "cirt")
		{ return "暴击"; }
		else if (str == "kCirk")
		{ return "抗暴"; }
		else if (str == "dodge")
		{ return "闪避"; }
		else if (str == "hit")
		{ return "命中"; }
		else if (str == "none") {
			return "";
		}
	}

	private getEquipMap(id: number): string {
		let str = "";
		for (let i = 0; i < GameApp.inst().monsterData.length; i++) {
			let idVec = GameApp.inst().monsterData[i].dropID.split("_");
			for (let j = 0; j < idVec.length; j++) {
				if (parseInt(idVec[j]) == id) {
					str = GameApp.inst().monsterData[i].sceneName;
				}
			}
		}
		return str;
	}

	private kongbaiClick() {
		ViewManager.inst().close(BagDetails);
	}
}
ViewManager.inst().reg(BagDetails, LayerManager.UI_Pop)