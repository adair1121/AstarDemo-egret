
// 商品属性对应表
let ShopAttribeType = {
    hp: "生命",
    mp: "魔法",
    attack: "攻击",
    def: "防御",
    cirt: "暴击",
    kCirk: "抗暴",
    hit: "命中",
    dodge: "闪避"
}

class ShopViewItem extends eui.ItemRenderer {

    private static _inst = null;
    public static inst(): ShopViewItem{
        if (!this._inst) {
            this._inst = new ShopViewItem();
        }
        return  this._inst;
    }
    
    public constructor() {
        super();
        this.skinName=`${egret.getQualifiedClassName(this)}Skin`;
    }

    public dataChanged():void {
        // console.log(this.data);

        this.setItemData();    
    }

    private useLv: eui.Label;
    private buyBtn: eui.Button;
    private buyBtnLabel: eui.Label;
    private shopIcon: eui.Image;
    private shopAttribe: eui.Label;
    private goldIcon: eui.Image;
    private payNum: eui.Label;
    private shopIconBg: eui.Image;
    private starLev: eui.Label;
    private effect_group:eui.Group;
    private clickButton:eui.Button;
    
    private setItemData(): void{
        this.useLv.text = this.data.wearLevel + "级";
        this.buyBtn.addEventListener('touchEnd', this.buyShopEvent, this);
        this.buyBtnLabel.addEventListener('touchEnd', this.buyShopEvent, this);
        this.clickButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        
        this.shopIconBg.source = `item_box_${this.data.quality}_png`;

        this.starLev.text = this.data.starLev + "阶";

        this.shopIcon.source = "item_" + this.data.modelId + "_png";
        
        this.shopAttribe.text = this.rowString2Col(ShopAttribeType[this.data.attrs]);

        this.goldIcon.x = this.payNum.x + this.payNum.width;

        if (this.data.quality > 0) {
			let effect = new MovieClip();
			effect.playFile(`${EFFECT}quality_effect_${this.data.quality}`, -1);
			this.effect_group.addChild(effect);
		}
    }

    private buyShopEvent(): void {
        console.log("想要购买的商品是 ==> " ,`${this.data.itemId}-${this.data.itemName}`);
        let goldNum = GameApp.inst().getGoldNum();
        // if (goldNum >= this.data.price) {
            // Todo 弹出购买确认框 发送消息 让父节点处理
            MessageManager.inst().dispatch(CustomEvt.SHOP_CLICK_BUYBTN, this.data);
        // } else {
        //     console.log("元宝数量不足=-=请充值");
        //     // 元宝数量不足 无法购买
        //     UserTips.inst().showTips(`元宝数量不足=-=`);
        // }

    }

    public rowString2Col(a: string): string {
        if (!a || a == "") {
            console.log('字符串为空');
            return ;;
        }
        let s = "";
        for (let i = 0; i < a.length; i++) {
            s += a[i];
            if (i != a.length - 1) {
                s += '\n';
            }
        }
        return  s;
    }

    private click() {
        ViewManager.inst().open(BagDetails, [this.data.itemId,1]);
    }


}