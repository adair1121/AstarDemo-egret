class SmeltingChoose extends BaseEuiView {
	public jiaButton:eui.Image;
	public jianbutton:eui.Image;
	public quxiao:eui.Label;
	public queding:eui.Label;
	public numShow:eui.Label;
	private tips:eui.Label;
	public viewBox:eui.Group;
	public box:eui.Group;
	public maxButton:eui.Image;
	public qianghuashi:eui.Label;
	public item:eui.Image;
	public dikaung:eui.Image;
	public pinjie:eui.Label;
	public jibie:eui.Label;
	public effect_group:eui.Group;

	public input:egret.TextField;
	private num:number;
	private id: number;
	private numMax:number
	public constructor() {
		super();
		this.addInput();
	}

	public open(...param) {
		this.viewBox["autoSize"]();
		this.setTypeUI(param[0]);
		this.jiaButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jiaButtonClick, this);
		this.jianbutton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jianClick, this);
		this.quxiao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.quxiaoClick, this);
		this.queding.addEventListener(egret.TouchEvent.TOUCH_TAP, this.quedingClick, this);
		this.maxButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.maxClick, this);
	}

	public close() {
		this.jiaButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.jiaButtonClick, this);
		this.jianbutton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.jianClick, this);
		this.maxButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.maxClick, this);
		this.quxiao.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.quxiaoClick, this);
		this.queding.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.quedingClick, this);
	}

	//点击最大按钮
	private maxClick() {
		this.num = this.numMax;
		this.setUI();
	} 

	private setTypeUI(_data) {
		this.num = 1;
		this.box.x = _data.x;
		this.box.y = _data.y;
		this.id = _data.id;
		this.numMax = _data.max;
		this.setUI();
	}

	//加按钮
	private jiaButtonClick() {
		this.num += 1;
		if(this.num > this.numMax) {
			this.num = this.numMax;
		}
		this.setUI();
	}

	//减按钮
	private jianClick() {
		if (this.num <= 1) {
			return;
		}
		this.num -= 1;
		this.setUI();
	}

	//取消按钮
	private quxiaoClick() {
		//关闭界面
		this.removeScene();
	}

	//熔炼按钮点击
	private quedingClick() {
		let ronglaingshi = 0;
		let time = BagController.inst().getTableData(this.id);
		if (time) {
			Smelting.instance.cancelWeapons(this.id, this.num);
			GameApp.inst().removeItemFromBag({ id: this.id, num: this.num });
			ronglaingshi += time.melting * this.num;
		}
		GameApp.inst().addItemToBagById(602, ronglaingshi);
		UserTips.inst().showTips("获得强化石x" + ronglaingshi);
		TipsBox.showTips2("熔炼成功 获得强化石x" + ronglaingshi, 50, 1000);
		this.removeScene();
	}

	public setUI() {
		let biao = BagController.inst().getTableData(this.id);
		this.numShow.text = "" + this.num;
		this.input.text = "" + this.num;
		let qianghuashiNum = biao.melting * this.num;
		this.qianghuashi.text = "" + qianghuashiNum + "强化石";

		
		this.item.source = "item_" + biao.modelId + "_png";
		// this.dikaung.source = "item_box_" + biao.quality + "_png";
		this.dikaung.source = "effect_" + biao.quality + "_png";
		this.pinjie.text = "" + biao.starLev;
		this.jibie.text = "" + biao.wearLevel + "级";

		if (biao.quality > 0) {
			let effect = new MovieClip();
			effect.playFile(`${EFFECT}quality_effect_${biao.quality}`, -1);
			this.effect_group.addChild(effect);
		}
	}

	private removeScene() {
		ViewManager.inst().close(SmeltingChoose);
	}

	/**输入框 */ 
	private addInput() {
		this.input = new egret.TextField();
		this.input.textAlign = "center";
        this.input.text = "" + this.numShow.text;
        this.box.addChild(this.input);
        this.input.width = 106;
        this.input.height = 25;
        this.input.x = 62.7;
		this.input.y = 163;
		this.input.size = this.numShow.size;
		this.input.textColor = this.numShow.textColor;
        this.input.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.input.type = egret.TextFieldType.INPUT;
       	this.input.addEventListener(egret.FocusEvent.FOCUS_OUT, function (e:egret.FocusEvent) {
			let value = parseInt(this.input.text);
			if (value != NaN) {
				this.num = value;
				if(this.num > this.numMax) {
					this.num = this.numMax;
				}
				this.setUI();
			}
			else {
				this.setUI();
			}

        }, this);
	}
}

ViewManager.inst().reg(SmeltingChoose,LayerManager.UI_Pop)