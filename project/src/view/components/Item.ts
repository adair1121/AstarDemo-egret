class Item extends eui.ItemRenderer{
	private img:eui.Image;
	private star:eui.Label;
	private numLab:eui.Label;
	public constructor() {
		super();
		this.skinName = "ItemSkin"
	}
	protected dataChanged():void
	{
		let cfg:GoodsData = GameApp.inst().getItemById(this.data.id) as GoodsData;
		this.img.source = `item_${cfg.modelId}_png`;
		this.star.text = `${cfg.starLev}阶`;
		this.numLab.text = this.data.num.toString();
		if(cfg.itemType != "1")
		{
			this.star.visible =  false;
		}
	}
}