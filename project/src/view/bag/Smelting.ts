class Smelting extends BaseEuiView {
	public smeltingList:eui.List;
	public closeButton:eui.Image;
	public ronglian:eui.Image;
	public scrollerSmelting:eui.Scroller;
	private view_group:eui.Group;
	private data = [];
	/**单利模式 */
	public static instance: Smelting;
	public constructor() {
		super();
		Smelting.instance = this;
	}
	public open() {
		this.view_group["autoSize"]();
		this.closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeClick,this);
		this.ronglian.addEventListener(egret.TouchEvent.TOUCH_TAP,this.ronglianClick,this);
		this.init();
	}

	public close() {
		this.closeButton.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.closeClick,this);
		this.ronglian.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.ronglianClick,this);
	}

	private init() {
		this.smeltingList.itemRenderer = itemBag;
		this.refreshListData();
	}

	public refreshListData() {
		let wuyonh = BagController.inst().getLowWeapons();
		if (wuyonh && wuyonh.length > 0) {
			this.data = BagController.inst().weaponsSorting(wuyonh);
			this.refreshList();
		}
		else {
			egret.setTimeout(function () {
				TipsBox.showTips2("没有可熔炼的武器", 50, 1000);
				this.closeClick();
			}, this, 100);
		}
	}

	public refreshList(isA:boolean = false) {
		var value = this.scrollerSmelting.viewport.scrollV;
		let arrCollection: eui.ArrayCollection = new eui.ArrayCollection(this.data);
		this.smeltingList.dataProvider = arrCollection;
		if (isA) {
			this.smeltingList.validateNow();
			this.scrollerSmelting.viewport.scrollV = value;
		}
	}

	private closeClick() {
		ViewManager.inst().close(Smelting);
		// this.scrollerSmelting.viewport.scrollV = this.scrollerSmelting.viewport.contentHeight - this.scrollerSmelting.viewport.height;
	}

	private ronglianClick() {
		if(this.data && this.data.length > 0) {
			let value = this.getQianghuashi(this.data);
			//获取奖励
			GameApp.inst().addItemToBagById(602,value);
			UserTips.inst().showTips("获得强化石x" + value);
			TipsBox.showTips2("熔炼成功 获得强化石x" + value, 50, 1000);
			GameApp.inst().setTaskData(6, null);
		}
		
		this.closeClick();
		BagView.instance.refresh();
	}

	/**获取熔炼的强化石奖励 并移除这些装备 */
	private getQianghuashi(_data) {
		let ronglaingshi = 0;
		for (let i = 0; i < _data.length; i++) {
			let time = BagController.inst().getTableData(_data[i].itemId);
			if (time) {
				GameApp.inst().removeItemFromBag({ id: _data[i].itemId, num: _data[i].itemNum });
				ronglaingshi += time.melting * _data[i].itemNum;
			}
		}
		return ronglaingshi;
	}

	/**取消一个装备的熔炼 */
	public cancelWeapons(_id: number, _num = 1) {
		let data = this.accordingID(_id);
		if (data) {
			data.itemNum -= _num;
			if (data.itemNum <= 0) {
				let index = this.data.indexOf(data);
				if (index != -1) {
					this.data.splice(index, 1);
				}
			}
			this.refreshList(true);
		}
	}

	/**根据ID找数据 */
	private accordingID(_id: number) {
		for (let i = 0; i < this.data.length; i++) {
			if(this.data[i].itemId == _id) {
				return this.data[i];
			}
		}
		return null;
	}

	/**打开设置数量弹窗 */
	public openSetNum(_id: number, _max: number) {
		ViewManager.inst().open(SmeltingChoose,[{x:345,y:167,id:_id,max:_max}]);
	}
}

ViewManager.inst().reg(Smelting,LayerManager.UI_Pop)