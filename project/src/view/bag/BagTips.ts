class BagTips extends BaseEuiView {
	private sceneBox:eui.Group;
	public constructor() {
		super();
	}
	public open(): void {
		this.sceneBox["autoSize"]();
		this.x = 780 * (StageUtils.inst().getWidth() / 1334);
		this.y = 580 * (StageUtils.inst().getHeight() / 750);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
	}
	public close() {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
	}

	private click() {
		ViewManager.inst().open(BagView);
	}
}
ViewManager.inst().reg(BagTips, LayerManager.UI_Main)