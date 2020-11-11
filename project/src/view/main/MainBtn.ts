class MainBtn extends egret.Sprite
{
	private btnName:any[] = [];
	private btnVec:MainFunBtn[] = [];
	public constructor(name:any[]) 
	{
		super();
		this.btnName = name;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage()
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.init();
		
	}
	private onRemoveFromStage()
	{
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		
	}
	private init()
	{
		for(let i = 0; i < this.btnName.length; i++)
		{
			let img = new MainFunBtn(this.btnName[i]);
			this.addChild(img);
			img.y = 0;
			img.x = i*85;
			img.name = `${this.btnName[i]}`;
			this.btnVec.push(img);
		}
	}
	
	
}