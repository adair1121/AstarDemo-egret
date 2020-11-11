class SignInView extends BaseEuiView{
	public signList:eui.List;
	public cumulativeList:eui.List;
	public cumulative:eui.Label;
	public receive:eui.Label;
	public closeButton:eui.Rect;
	public sceneBox:eui.Group;
	public constructor() {
		super();
	}

	public open() {
		this.sceneBox["autoSize"]();
		SignInControl.instance.model.nextDay(); //本地初始数据
		
		this.init();
		this.receive.addEventListener(egret.TouchEvent.TOUCH_TAP,this.receiveClick,this);
		this.closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.closeButtonClick,this);
		this.setUI();
		NoviceGuideView.showGuide( [this.guideCfg] , false , this );
	}

	public close() {
		this.receive.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.receiveClick,this);
		this.closeButton.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.closeButtonClick,this);
	}

	private init() {
		this.signList.itemRenderer = itemSignIn;
		this.cumulativeList.itemRenderer = itemCumulative;

		this.refreshList();
		
	}

	private refreshList() {
		let model = SignInControl.instance.model;
		let data = model.getSignInData();
		let arrCollection: eui.ArrayCollection = new eui.ArrayCollection(data);
		this.signList.dataProvider = arrCollection;

		let data1 = model.getCumulativeData();
		let cumulativeList: eui.ArrayCollection = new eui.ArrayCollection(data1);
		this.cumulativeList.dataProvider = cumulativeList;
		if (model.getInDay() == 1) {
			this.receive.text = "已签到";
		}
		else {
			this.receive.text = "签到";
		}
		this.cumulative.text = "累计签到：" + model.getSignInProgress() + "天";
	}

	private receiveClick() {
		if(SignInControl.instance.model.getInDay() == 1) {
			//今天已经签到过了
			return;
		}
		//获得日签到奖励
		let data = SignInControl.instance.model.getSignInData()[SignInControl.instance.model.getSignInProgress()];
		GameApp.inst().addItemToBagById(data.itemId, data.itemNum);
		let dataSignIn = BagController.inst().getTableData(data.itemId);
		UserTips.inst().showTips("获得" + dataSignIn.itemName + "x" + data.itemNum);
		TipsBox.showTips2("获得" + dataSignIn.itemName + "x" + data.itemNum, 50, 1000);
		SignInControl.instance.model.setSignInProgress();
		SignInControl.instance.model.setInDay();
		MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ "sign" ] );
		
		this.refreshList();
	}

	private closeButtonClick() {
		MessageManager.inst().dispatch(CustomEvt.BTN_POS_FUWEI, this);
		ViewManager.inst().close(SignInView);
	}

	public setUI() {
		this.cumulative.text = "累计签到：" + SignInControl.instance.model.getSignInProgress() + "天";
	}
	public guideCfg = {
		x: StageUtils.inst().getWidth()/2 + 300*(StageUtils.inst().getWidth()/1334),
		y: StageUtils.inst().getHeight()/2 + 230*(StageUtils.inst().getWidth()/1334),
		info: "签到为非持续性签到，分为日签奖励和累计签到奖励，不要忘了哦。",
		bg: 4,
		fun: this.guideHandler.bind( this ),
		target: "sign",
		obj: this
	}

	private guideHandler():void {
		this.receiveClick();
		NoviceGuideView.setGuideLocal( "sign" );
	}
}

class itemSignIn extends eui.ItemRenderer {
	public labelDisplay: eui.Label;
	public stateShow:eui.Group;
	public item:eui.Image;
	public stateText:eui.Label;
	public itemNum:eui.Label;
	public pinzhi:eui.Image;
	public effect_group:eui.Group;
	public labelDisplay0:eui.Label;
	constructor() {
		super();
		this.skinName = "itemSignSkin";
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
	}

	protected dataChanged(): void {
		//数据改变时，会自动调用 dataChanged 这个方法
		//显示数据中的 label 值
		this.labelDisplay.text = "" + (this.data.signId) + "";
		this.setUI();
	}

	public setUI() {
		let model = SignInControl.instance.model;
		let type = 0;
		let id = this.data.signId - 1;
		if (model.getInDay() == 1) {
			//已经签到
			if (model.getSignInProgress() > id) {
				//显示已签到
				type = 0;
			}
			else {
				//显示未签到
				type = 2;
			}
		}
		else {
			//还未签到
			if (model.getSignInProgress() > id) {
				//显示已签到
				type = 0;
			}
			else if (model.getSignInProgress() == id) {
				//显示可签到
				type = 1;
			}
			else {
				//显示未签到
				type = 2;
			}
		}
		this.showUI(type);
		let bagBiaoData = BagController.inst().getTableData(this.data.itemId);
		this.item.source = "item_" + bagBiaoData.modelId + "_png";

		this.itemNum.visible = this.data.itemNum <= 1  ? false :  true;
		this.itemNum.text = "" + this.data.itemNum;
		
		if (bagBiaoData.quality > 0) {
			this.pinzhi.source = "item_box_" + bagBiaoData.quality + "_png";
			let effect = new MovieClip();
			effect.playFile(`${EFFECT}quality_effect_${bagBiaoData.quality}`, -1);
			this.effect_group.addChild(effect);
		}
		else if (bagBiaoData.quality == 0) {
			this.pinzhi.source = "itemBox_png";
		}

		this.labelDisplay0.visible = bagBiaoData.starLev > 0 ? true :  false;
		this.labelDisplay0.text = "" + bagBiaoData.starLev + "阶";
		

		//元宝 强化石特殊判断
		if (bagBiaoData.modelId == 601) {
			this.item.source = "sgnIn_11_png";
			this.pinzhi.source = "sgnIn_12_png";
		}
		if (bagBiaoData.modelId == 602) {
			this.pinzhi.source = "sgnIn_13_png";
		}
	}

	private showUI(_type: number) {
		this.stateShow.visible = false;
		switch (_type) {
			case 0:
				this.stateShow.visible = true;
				this.stateText.text = "已签到";
				break;
			case 1:
				// this.stateShow.text = "可签到";
				break;
			case 2:
				// this.stateShow.text = "未签到";
				break;
		}
	}
	
	private click() {
		ViewManager.inst().open(BagDetails,[this.data.itemId]);
	}
}
//-------------累计签到界面
class itemCumulative extends eui.ItemRenderer {
	public labelDisplay:eui.Label;
	private switchClick:boolean = false;
	private id:number;
	public item:eui.Image;
	public stateShow:eui.Group;
	public stateText:eui.Label;
	public bg:eui.Image;
	public itemNum:eui.Label;
	constructor() {
		super();
		this.skinName = "itmeCumulativeSkin";
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
	}

	protected dataChanged(): void {
		//数据改变时，会自动调用 dataChanged 这个方法
		//显示数据中的 label 值
		this.id = this.data.signFrequency;
		this.labelDisplay.text = "累计"+this.id + "天";
		this.setUI();
	}

	public setUI() {
		let model = SignInControl.instance.model;
		let id = this.id;
		let type = 0;
		if (model.getSignInProgress() >= id) {
			if(model.getCumulative(id) == 0) {
				//显示可领取
				type = 1;
			}
			else {
				//显示已领取
				type = 0;
			}
		}
		else {
			//显示未领取
			type = 2;
		}
		this.showUI(type);
		let itemData = BagController.inst().getTableData(this.data.itemId);
		this.item.source = "item_" + itemData.modelId + "_png";
		this.itemNum.text= "" + this.data.itemNum;

		//特殊更改
		if(itemData.modelId == 601) {
			this.item.source = "sgnIn_11_png";
			this.bg.source = "sgnIn_15_png";
		}
		if (itemData.modelId == 602) {
			this.bg.source = "sgnIn_14_png";
		}
	}

	private showUI(_type: number) {
		this.switchClick = false;
		this.stateShow.visible = false;
		switch (_type) {
			case 0:
				this.stateShow.visible = true;
				this.stateText.text = "已领取";
				break;
			case 1:
				this.switchClick = true;
				break;
			case 2:
				break;
		}
	}

	private click() {
		if(this.switchClick == false) {
			//不可点击
			ViewManager.inst().open(BagDetails,[this.data.itemId]);
			return;
		}
		SignInControl.instance.model.setCumulative(this.id)
		//奖励
		GameApp.inst().addItemToBagById(this.data.itemId,this.data.itemNum);
		let dataSignIn = BagController.inst().getTableData(this.data.itemId);
		UserTips.inst().showTips( "获得"+dataSignIn.itemName+ "x"+this.data.itemNum );
		this.setUI();
	}
}
ViewManager.inst().reg(SignInView,LayerManager.UI_Pop)