class DropEntity extends eui.Component{

	private _vo:GoodsData;

	private cardGroup:eui.Group;
	private colorCfg:any = {0:0xffffff,1:0x00FF28,2:0x50FDFF,3:0xFF5FFD,4:0xFF6325,5:0xfc3434}
	public constructor(vo:GoodsData) {
		super();
		this._vo = vo;

		this.open();
	}
	public open():void{
		this.cardGroup = new eui.Group();
		

		let img:eui.Image = new eui.Image();
		img.source = `item_${this._vo.modelId}_png`;
		this.cardGroup.addChild(img);
		img.alpha=0.5;
		let dropEff:MovieClip = new MovieClip();
		dropEff.visible = true;
		this.addChild(dropEff);
		this.addChild(this.cardGroup);
		dropEff.playFile(`${EFFECT}quality${this._vo.quality == 0?1:this._vo.quality}`,1,function(){
			img.alpha=1;
		}.bind(this),true);
		// this.cardGroup.alpha = 0;
		this.cardGroup.scaleX = this.cardGroup.scaleY = 0.5;
		// this.cardGroup.x = this._pos.x;
		// this.cardGroup.y = this._pos.y;
		dropEff.x = 10;
		dropEff.y = 25;
		

		let itemNameLab:eui.Label = new eui.Label();
		this.cardGroup.addChild(itemNameLab);
		itemNameLab.text = this._vo.itemName;
		itemNameLab.size = 22;
		itemNameLab.stroke = 1;
		itemNameLab.width = 150;
		itemNameLab.textAlign = egret.HorizontalAlign.CENTER;
		itemNameLab.anchorOffsetX = itemNameLab.width>>1;
		itemNameLab.x = img.x + 55*0.5/2 + 10;
		itemNameLab.y = img.y + 55*0.5 + 30;
		itemNameLab.textColor = this.colorCfg[this._vo.quality];

		if(this._vo.itemType == "0")
		{
			itemNameLab.text = this._vo.ownNum + this._vo.itemName;
			return;
		}
		this.showWay2();

		// egret.Tween.get(this.cardGroup).to({alpha:1,scaleX:1,scaleY:1},500,egret.Ease.bounceOut).call(()=>{
		// 	egret.Tween.removeTweens(this.cardGroup);
		// 	if(dropEff && dropEff.parent)
		// 	{
		// 		dropEff.parent.removeChild(dropEff);
		// 	}
		// },self)
		
	}	
	public showani():void
	{
		egret.Tween.get(this.cardGroup).to({alpha:0,scaleX:1.5,scaleY:1.5},500,egret.Ease.bounceOut).call(()=>{
			egret.Tween.removeTweens(this.cardGroup);
			if(this && this.parent)
			{
				this.parent.removeChild(this);
			}
		},this)
	}
	private showWay1():void{
		// let dropMc:MovieClip = new MovieClip();
		// this.addChild(dropMc);
		// dropMc.playFile(`${EFFECT}trans`,-1);
		// dropMc.x = this._pos.x ;
		// dropMc.y = this._pos.y - 200;
		// egret.Tween.get(dropMc).to({y:this._pos.y + 50},200).call(()=>{
		// 	egret.Tween.removeTweens(dropMc);
		// 	dropMc.parent.removeChild(dropMc);
			
		// 	egret.Tween.get(this.cardGroup).to({alpha:1,scaleX:1,scaleY:1},500,egret.Ease.bounceOut).call(()=>{
		// 		egret.Tween.removeTweens(this.cardGroup);
		// 	},this)
		// },this)
	}
	private showWay2():void{
		let boomfireMc:MovieClip = new MovieClip();
		this.addChild(boomfireMc);
		// boomfireMc.x = this._pos.x;
		// boomfireMc.y = this._pos.y;
		boomfireMc.playFile(`${EFFECT}boomeff2`,2,null,true);
	}
	public get DropVo():GoodsData{
		return this._vo;
	}
	public close():void{
	
	}
}