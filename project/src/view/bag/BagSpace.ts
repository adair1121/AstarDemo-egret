class BagSpace extends BaseEuiView {
	public jiaButton:eui.Image;
	public jianbutton:eui.Image;
	public closeButton:eui.Image;
	public quxiao:eui.Label;
	public queding:eui.Label;
	public moneyShow:eui.Label;
	public numShow:eui.Label;
	private type:number;
	private tips:eui.Label;
	private yuanbao:eui.Image;
	private input:egret.TextField;	
	public viewBox:eui.Group;
	public box:eui.Group;
	public constructor() {
		super();
	}

	public open(...param) {
		this.type = param[0];
		this.addInput();
		this.setTypeUI(param[1]);
	}

	public close() {

	}

	private setTypeUI(_data) {
		this.box.x = _data.x;
		this.box.y = _data.y;
		switch (this.type) {
			case 0:
				this.tips.text = "开启背包";
				this.yuanbao.visible = true;
				this.moneyShow.visible = true;
				this.openScene();
				break;
			case 1:
				this.tips.text = "取消熔炼";
				this.yuanbao.visible = false;
				this.moneyShow.visible = false;
				this.setData(_data);
				break;
		}
	}
	
	private num: number = 5;
	private bagMoney:number = 6;
	public openScene() {
		this.viewBox["autoSize"]();
		this.visible = true;
		this.num = 5;
		this.setUI();
		this.jiaButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jiaButtonClick, this);
		this.jianbutton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jianClick, this);
		this.closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeClick, this);
		this.quxiao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.quxiaoClick, this);
		this.queding.addEventListener(egret.TouchEvent.TOUCH_TAP, this.quedingClick, this);
	}

	public closeScene() {
		this.jiaButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.jiaButtonClick, this);
		this.jianbutton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.jianClick, this);
		this.closeButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeClick, this);
		this.quxiao.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.quxiaoClick, this);
		this.queding.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.quedingClick, this);
	}

	private jiaButtonClick() {
		this.num += 1;
		if(this.type == 1) {
			if(this.num > this.numMax) {
				this.num = this.numMax;
			}
		}
		this.setUI();
	}

	private jianClick() {
		if (this.num <= 1) {
			return;
		}
		this.num -= 1;
		this.setUI();
	}

	private closeClick() {
		//关闭界面
		this.removeScene();
	}

	private quxiaoClick() {
		//关闭界面
		this.removeScene();
	}

	private quedingClick() {
		if(this.type == 1) {
			this.equipment();
			return;
		}
		if ((this.num * this.bagMoney) > GameApp.inst().getGoldNum()) {
			if(egret.getOption("recharge"))
			{
				ViewManager.inst().open(RechargeTips);
			}else
			{
				UserTips.inst().showTips("元宝不足！");
			}
			return;
		}
		GameApp.inst().setGoldNum(GameApp.inst().getGoldNum() - (this.num * this.bagMoney));
		BagController.inst().getModel.setKongjain(this.num);
		BagView.instance.refresh();
		this.removeScene();
		//提示扩容成功
		UserTips.inst().showTips("格子X" + this.num);
		TipsBox.showTips2("扩容成功 格子X" + this.num, 50, 1000);
	}

	public setUI() {
		this.numShow.text = "" + this.num;
		this.input.text = "" + this.num;
		this.moneyShow.text = "" + (this.num * this.bagMoney);
	}

	private removeScene() {
		this.closeScene();
		// BagView.instance.sceneBox.removeChild(this);	
		ViewManager.inst().close(BagSpace);
	}

	private id: number;
	private numMax:number
	public setData(_data) {
		this.id = _data.id;
		this.numMax = _data.max;
		this.openScene();
		this.num = 1;
		this.setUI();
	}
	/**熔炼取消装备 确定 */
	private equipment() {
		Smelting.instance.cancelWeapons(this.id, this.num);
		this.removeScene();
	}

	/**输入框 */
	private addInput() {
		this.input = new egret.TextField();
		this.input.textAlign = "center";
        this.input.text = "" + this.numShow.text;
        this.box.addChild(this.input);
        this.input.width = 96;
        this.input.height = 20;
        this.input.x = 80;
		this.input.y = 70;
		this.input.size = this.numShow.size;
		this.input.textColor = this.numShow.textColor;
        // this.input.verticalAlign = egret.VerticalAlign.MIDDLE;
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

ViewManager.inst().reg(BagSpace,LayerManager.UI_Pop)