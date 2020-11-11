class BagView extends BaseEuiView {
	public bagList: eui.List;
	public zeng: eui.Image;
	public closeButton: eui.Rect;
	public rongliang: eui.Label;
	public sceneBox: eui.Group;
	private ronglian: eui.Label;
	private data = [];
	public static instance: BagView = null;
	public constructor() {
		super();
		BagView.instance = this;
	}

	private isBag:boolean = false;
	public open() {
		this.isBag = true;
		this.sceneBox["autoSize"]();
		BagController.inst();
		this.init();
		this.zeng.addEventListener(egret.TouchEvent.TOUCH_TAP, this.zengClick, this);
		this.closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeClick, this);
		this.ronglian.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rongianClick, this);
		this.setUI();
	}

	public close() {
		this.isBag = false;
		this.zeng.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.zengClick, this);
		this.closeButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeClick, this);
		this.ronglian.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.rongianClick, this);
	}

	private zengClick() {
		ViewManager.inst().open(BagSpace,[0,{x:573,y:361}]);
	}

	private closeClick() {
		MessageManager.inst().dispatch(CustomEvt.BTN_POS_FUWEI, this);
		ViewManager.inst().close(BagView);
	}

	private rongianClick() {
		ViewManager.inst().open(Smelting);
	}

	private init() {
		this.bagList.itemRenderer = itemBag;
		// let data = BagController.inst().getBagData().getBagAll();
		this.refresh();
	}

	private setUI() {
		this.rongliang.text = this.data.length + "/" + BagController.inst().getModel.getKongjain();
	}

	/**刷新 */
	public refresh() {
		this.data = BagController.inst().weaponsSorting(BagController.inst().weaponsNum(GameApp.inst().bagData));
		if (this.data.length > BagController.inst().getModel.getKongjain()) {
			//背包满了
			// this.data.splice(BagController.inst().getModel.getKongjain(), this.data.length - BagController.inst().getModel.getKongjain());
			ViewManager.inst().open(BagTips);
		}
		else {
			ViewManager.inst().close(BagTips);
		}
		let arrCollection: eui.ArrayCollection = new eui.ArrayCollection(this.data);
		this.bagList.dataProvider = arrCollection;
		this.setUI();
	}

	/**告诉背包 物品刷新了 */
	public bagRefreshItem() {
		if (this.isBag) {
			this.refresh();
		}
	}
}

class itemBag extends eui.ItemRenderer {
	public labelDisplay: eui.Label;
	public itemNum: eui.Label;
	public nameShow: eui.Label;
	private uiData;
	private num: number;
	public item: eui.Image;
	public dikaung: eui.Image;
	constructor() {
		super();
		this.skinName = "itemBagSkin";
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
	}

	protected dataChanged(): void {
		//数据改变时，会自动调用 dataChanged 这个方法
		//显示数据中的 label 值
		this.num = this.data.itemNum;
		this.uiData = BagController.inst().getTableData(this.data.itemId);
		this.setUI();
	}

	private setUI() {
		if (this.uiData.starLev == 0) {
			this.labelDisplay.visible = false;
		}
		else {
			this.labelDisplay.visible = true;
		}
		this.labelDisplay.text = this.uiData.starLev + "阶";
		this.itemNum.text = this.num + "";
		// if(this.uiData.equipPos != -1) {
		// 	this.itemNum.visible = false;
		// }
		// else {
		// 	this.itemNum.visible = true;
		// 	this.itemNum.text = this.num + "";
		// }

		this.nameShow.text = "" + this.uiData.itemName;
		this.item.source = "item_" + this.uiData.modelId + "_png";
		if (this.uiData.quality > 0) {
			this.dikaung.source = "item_box_" + this.uiData.quality + "_png";
			// this.dikaung.source = "effect_" + this.uiData.quality + "_png";
		}
		else if (this.uiData.quality == 0) {
			this.dikaung.source = "itemBox_png";
		}

		//元宝 强化石特殊判断
		if (this.uiData.modelId == 601) {
			this.dikaung.source = "sgnIn_12_png";
		}
		if (this.uiData.modelId == 602) {
			this.dikaung.source = "sgnIn_13_png";
		}
	}

	private click() {
		if (this.data.type == 1) {
			//熔炼
			// Smelting.instance.cancelWeapons(this.data.itemId);
			Smelting.instance.openSetNum(this.data.itemId, this.num);
			return;
		}
		//背包
		ViewManager.inst().open(BagDetails, [this.data.itemId]);
	}
}
ViewManager.inst().reg(BagView, LayerManager.UI_Pop)