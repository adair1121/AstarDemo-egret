
class ShopView extends BaseEuiView {

    private baseGroup: eui.Group;
    public constructor() {
        super();
        this.initOnMsg();
        this.initBuyConfirmGroup();
        this.showClose(ShopView);
        this.initShopData();
        this.initShopView();
    }

    public open(...param):void {
        this.baseGroup["autoSize"]();
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        
    }

    public close(): void {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        MessageManager.inst().removeListener(CustomEvt.SHOP_CLICK_BUYBTN, this.showBuyConfirm, this);
    }

    private onTap(event: egret.TouchEvent): void{
        // console.log('click ===>? ', event.target.name.indexOf("tab"));
        let name = event.target.name;
        if (name && name.indexOf("tab") > -1) {
            let tabIndex = name.split("_");
            tabIndex = tabIndex[tabIndex.length - 1];
            this.changeBtnTabSkin(tabIndex);
        }

    }

    public initOnMsg(): void{
        MessageManager.inst().addListener(CustomEvt.SHOP_CLICK_BUYBTN, this.showBuyConfirm, this);
    }

    // 初始化商城数据
    private shopCfg: any = {};
    private qulityConfig = ["全部", "绿装", "蓝装", "紫装", "橙装", "红装"];
    private initShopData(): void{
        let shopTable = RES.getRes("Goods_json");
        this.shopCfg[this.qulityConfig[0]] = [];
        for (let i = 0; i < shopTable.length; i++) {
            let shopData = shopTable[i];
            if (shopData && shopData.quality > 0 && shopData.starLev >= 10) {
                this.shopCfg[this.qulityConfig[shopData.quality]] = this.shopCfg[this.qulityConfig[shopData.quality]] || [];
                this.shopCfg[this.qulityConfig[shopData.quality]].push(shopData);
                this.shopCfg[this.qulityConfig[0]].push(shopData);
            }
        }
        
        
        console.log("商城数据列表 ==> " ,this.shopCfg)
    }

    private btnGroup: eui.Group;
    // 初始化界面
    private initShopView(): void{
        this.createQulityTab();
    }

    private btnTabList = [];
    private btnTabNameList = [];
    private createQulityTab(): void{
        let btnNum = 0;
        for (let key in this.shopCfg) {
            let dBtn = new eui.Image();
            dBtn.source = "select_tap_0_png";
            dBtn.name = "tab_" + btnNum;
            dBtn.width = 100;
            dBtn.height = 38;
            dBtn.anchorOffsetX = 50;
            dBtn.y = 10 + btnNum * 50;
            dBtn.x = 70;
            this.btnGroup.addChild(dBtn);
            this.btnTabList.push(dBtn);

            let dLab = new eui.Label();
            dLab.name = "tab_lab_" + btnNum;
            dLab.fontFamily = 'fzksFont';
            dLab.textColor = 0xa4a582;
            dLab.stroke = 2;
            dLab.strokeColor = 0x2c0d08;
            dLab.text = key;
            dLab.size = 20;
            dLab.width = 100;
            dLab.y = 20 + btnNum * 50;
            dLab.x = 100;
            dLab.anchorOffsetX = 50;
            this.btnGroup.addChild(dLab);
            this.btnTabNameList.push(dLab);

            this.createShopItem(this.shopCfg[key], btnNum);

		    btnNum ++;
        }
        this.changeBtnTabSkin(0);
    }

    // create shop item
    private listGroup: eui.Group;
    private createShopItem(itemDatas: Array<Object>, index: number): void{
        let listData: Array<Object> = itemDatas;
        let shopList = ((this.listGroup.getChildAt(index) as eui.Scroller).getChildAt(0)) as eui.List;
        // console.log("shop item data ==> " , shopList);
        // 设置数据显示item
        shopList.itemRenderer = ShopViewItem;
        // 设置item数据源
        // shopList.dataProvider = new eui.ArrayCollection(listData);
    }

    private changeBtnTabSkin(index: number): void {
        let shopList = ((this.listGroup.getChildAt(index) as eui.Scroller).getChildAt(0)) as eui.List;
        if (!shopList.dataProvider || shopList.dataProvider.length <= 0) {
            shopList.dataProvider = new eui.ArrayCollection(this.shopCfg[this.qulityConfig[index]]);
        }

        for (let i = 0; i < this.btnTabList.length; i++) {
            let btn = this.btnTabList[i];
            let btnLab = this.btnTabNameList[i];
            let list = this.listGroup.getChildAt(i) as eui.Scroller;
            if (btn.name.indexOf(index) > -1) {
                btn.source = "select_tap_0_png";
                btnLab.textColor = 0xf8f485;
                list.visible = true;
            } else {
                btn.source = "select_tap_1_png";
                btnLab.textColor = 0xa4a582;
                list.visible = false;
            }
        }
    }

//------------------------------------------ 确认购买界面相关 ----------------------------------------
    private buyGroup: eui.Group;
    private shopIcon: eui.Image;
    private shopAttribe: eui.Label;
    private shopName: eui.Label;
    private payNum: eui.Label;
    private goldIcon: eui.Image;
    private buyCloseBtn: eui.Image;
    private cancleBtn: eui.Image;
    private cancleLabel: eui.Label;
    private confirmBtn: eui.Image;
    private confirmLabel: eui.Label;
    private shopIconBg: eui.Image;
    private starLev: eui.Label;
    private effect_group:eui.Group;

    private buyShopData: any;
    private gameApp: GameApp = GameApp.inst();

    private initBuyConfirmGroup(): void{
        
        this.confirmBtn.addEventListener('touchEnd', this.buyShopEvent, this);
        this.confirmLabel.addEventListener('touchEnd', this.buyShopEvent, this);
        this.cancleBtn.addEventListener('touchEnd', this.cancleBuyEvent, this);
        this.cancleLabel.addEventListener('touchEnd', this.cancleBuyEvent, this);
        this.buyCloseBtn.addEventListener('touchEnd', this.cancleBuyEvent, this);
    }

    /** 购买商品 数据处理 */
    private buySeccessTips: eui.Group;
    private buyLabelTips: eui.Label;
    private effect:MovieClip;
    private buyShopEvent(): void {
        if (this.gameApp.getGoldNum() < this.buyShopData.price) {
            if(egret.getOption("recharge"))
			{
				ViewManager.inst().open(RechargeTips);
			}else
			{
                TipsBox.showTips2("元宝数量不足", 50, 2000);
            }
            return;
        }

        // 购买成功 ····· 或者弹出提示框
        this.gameApp.addItemToBagById(this.buyShopData.itemId);
        let goldNum = this.gameApp.getGoldNum() - this.buyShopData.price;
        this.gameApp.setGoldNum(goldNum);
        this.cancleBuyEvent();
        // UserTips.inst().showTips(`恭喜您成功购买 ${this.buyShopData.itemName}`);
        GameApp.inst().setTaskData(8, null);

        // this.buyLabelTips.text = `恭喜您成功购买 ${this.buyShopData.itemName}`;
        // this.buySeccessTips.visible = true;
        // this.buySeccessTips.alpha = 1;
        // egret.Tween.removeTweens(this.buySeccessTips);
        // egret.Tween.get(this.buySeccessTips).wait(3000).to({alpha: 0}, 1000)
        TipsBox.showTips2(`恭喜您成功购买 ${this.buyShopData.itemName}`, 50, 2000);

    }

    private cancleBuyEvent(): void{
        this.buyGroup.visible = false;
    }
    // 打开确认购买按钮
    private showBuyConfirm(itemData: any): void {
        itemData = itemData._data;
        // console.log("打开确认购买界面==> ", itemData);
        this.buyShopData = itemData;
        this.setBuyData(itemData);
        this.buyGroup.visible = true;
    }
    private setBuyData(itemData: any): void{
        this.shopIconBg.source = `item_box_${itemData.quality}_png`;
        this.starLev.text = itemData.starLev + "阶";
        this.shopIcon.source = "item_" + itemData.modelId + "_png";
        this.shopName.text = itemData.itemName;
        this.payNum.text = itemData.price;
        this.shopAttribe.text = ShopViewItem.inst().rowString2Col(ShopAttribeType[itemData.attrs]);
        this.goldIcon.x = this.payNum.width + this.payNum.x;


        if (itemData.quality > 0) {
            if(!this.effect)
			this.effect = new MovieClip();
			this.effect.playFile(`${EFFECT}quality_effect_${itemData.quality}`, -1);
			this.effect_group.addChild(this.effect);
		}
    }


}
ViewManager.inst().reg(ShopView,LayerManager.UI_Main);