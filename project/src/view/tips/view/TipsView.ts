class TipsView extends BaseEuiView {
	constructor() {
		super();
		this.initUI();
	}
	public close():void{

	}
	public initUI(): void {

		this.touchChildren = false;
		this.touchEnabled = false;

	}

	private labCount: number = 0;

	private list: TipsItem[] = [];

	private list1:TipsItem[] = [];

	private list2:TipsItem[] = [];


	public open(...param: any[]): void {

	}

	/**
	 * 显示tips
	 * @param str
	 */
	public showTips(str: string, any?:any): void {
		let tips: TipsItem = ObjectPool.pop("TipsItem");
		let bottomNum:number = 0;
		tips.left = 10;
		tips.bottom = 10;
		this.addChild(tips);
		tips.labelText = str;
		this.list.unshift(tips);
		tips.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTipsItem, this);
		for (let i: number = this.list.length - 1; i >= 0; i--) {
			egret.Tween.removeTweens(this.list[i]);
			let t: egret.Tween = egret.Tween.get(this.list[i]);
			t.to({"bottom": bottomNum + (i * 30)}, 300);
		}
	}
	private removeTipsItem(e: egret.Event): void {
		let tips = e.currentTarget;
		tips.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTipsItem, this);
		tips.left = NaN;
		tips.bottom = NaN;
		let index: number = this.list.indexOf(tips);
		this.list.splice(index, 1);
		ObjectPool.push(tips);
	}

	/**
	 * 显示tips
	 * @param str
	 */
	public showTips1(str: string, any?:any): void {
		let tips: TipsItem = ObjectPool.pop("TipsItem1");
		tips.horizontalCenter = 0;
		let bottomNum:number = (StageUtils.inst().getHeight()/5*4);
		tips.bottom = bottomNum;
		this.addChild(tips);
		tips.labelText = str;
		this.list1.unshift(tips);
		tips.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTipsItem, this);
		for (let i: number = this.list1.length - 1; i >= 0; i--) {
			egret.Tween.removeTweens(this.list1[i]);
			let t: egret.Tween = egret.Tween.get(this.list1[i]);
			t.to({"bottom": bottomNum + (i * 30)}, 300);
		}
	}
	public showTips2(str: string, any?:any): void {
		let tips: TipsItem = ObjectPool.pop("TipsItem2");
		// tips.horizontalCenter = 0;
		tips.labelText = str;
		tips.left = StageUtils.inst().getWidth()/2 - 80;
		let bottomNum:number = (StageUtils.inst().getHeight()/2-50);
		tips.bottom = bottomNum;
		this.addChild(tips);
		this.list2.unshift(tips);
		tips.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTipsItem2, this);
		for (let i: number = this.list2.length - 1; i >= 0; i--) {
			egret.Tween.removeTweens(this.list2[i]);
			let t: egret.Tween = egret.Tween.get(this.list2[i]);
			t.to({"bottom": bottomNum + (i * 24)}, 300);
		}
	}
	private removeTipsItem2(e: egret.Event): void {
		let tips = e.currentTarget;
		tips.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTipsItem, this);
		tips.left = NaN;
		tips.bottom = NaN;
		let index: number = this.list1.indexOf(tips);
		this.list1.splice(index, 1);
		ObjectPool.push(tips);
	}
	private removeTipsItem1(e: egret.Event): void {
		let tips = e.currentTarget;
		tips.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeTipsItem1, this);
		tips.left = NaN;
		tips.bottom = NaN;
		let index: number = this.list1.indexOf(tips);
		this.list1.splice(index, 1);
		ObjectPool.push(tips);
	}
}

ViewManager.inst().reg(TipsView, LayerManager.TIPS_LAYER);
