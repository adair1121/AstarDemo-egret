class MainLittleMap extends BaseView
{
	private map_group:eui.Group;
	private posVec:eui.Rect[] = [];
	private player:eui.Rect;
	private map_label:eui.Label;
	private map_kuang:eui.Image;
	private map_img:eui.Image;
	private map_mask:eui.Rect;
	private last_x:number = 0;
	private last_y:number = 0;
	private any:any = {
		map001:{
			w0:2615,
			h:169
		},
		map002:{
			w0:2076,
			h:245
		},
		map003:{
			w0:2800,
			h:176
		},
		map004:{
			w0:2125,
			h:197
		},
		map005:{
			w0:2800,
			h:176
		},
		map006:{
			w0:2864,
			h:162
		},
		map007:{
			w0:2082,
			h:163
		},
		map008:{
			w0:1787,
			h:246
		},
		map009:{
			w0:2048,
			h:161
		},
		map010:{
			w0:2112,
			h:247
		},
		map011:{
			w0:1660,
			h:179
		}
	}
	public constructor() 
	{
		super();
		this.skinName = "MainLittleMapSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage()
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.map_img.mask = this.map_mask;
		this.map_group.mask=this.map_mask;
		this.map_group.x = this.map_mask.x;
		this.map_group.y = this.map_mask.y;
		
		this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
	}
	private onRemoveFromStage()
	{
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
	}
	private update()
	{
		this.map_label.text = GameApp.inst().curMapName;
		this.map_img.source = `little_${GameApp.inst().curMapId}_png`;
		if( GameApp.inst().curMapId == 'map009' )
		{
			this.map_group.y = 18;
		}
		let w0 = 246 / this.any[GameApp.inst().getMonInfoById(GameApp.inst().globalData.level).mapID].w0;
		this.map_group.width = 246;
		this.map_group.height = this.any[GameApp.inst().getMonInfoById(GameApp.inst().globalData.level).mapID].h;
		if(this.posVec.length < GameApp.inst().posData.length)
		{
			let num = GameApp.inst().posData.length-this.posVec.length;
			for(let i = 0; i < num; i++)
			{
				let rect = new eui.Rect();
				rect.width = 6;
				rect.height = 6;
				rect.anchorOffsetX = rect.width/2;
				rect.anchorOffsetY = rect.height/2;
				this.posVec.push(rect);
				this.map_group.addChild(rect);
			}
		}else
		{
			let num = this.posVec.length-GameApp.inst().posData.length;
			for(let i = 0; i < num; i++)
			{
				this.map_group.removeChild(this.posVec[i]);
			}
			this.posVec.splice(0, num);
		}
		for(let i = 0; i < this.posVec.length; i++)
		{
			this.posVec[i].x = GameApp.inst().posData[i].x * w0;
			this.posVec[i].y = GameApp.inst().posData[i].y * w0;
			if(GameApp.inst().posData[i].state == 0)
			{
				this.posVec[i].fillColor = 0xF20909;
			}else if(GameApp.inst().posData[i].state == 1)
			{
				this.posVec[i].fillColor = 0x5ADD13;
				this.player = this.posVec[i];
				if(this.last_x == 0)
				{
					this.last_x = this.posVec[i].x;
				}
				if(this.last_y == 0)
				{
					this.last_y = this.posVec[i].y;
				}

				if(this.last_x != 0 && this.last_y != 0)
				{
					let chay = this.posVec[i].y - this.last_y;
					if(chay >= 0 && this.map_group.y + this.posVec[i].y >= this.map_mask.y + this.map_mask.height/2 - 5)
					{
						let posy = this.map_group.y - chay;
						if(posy <= this.map_mask.y - (this.map_group.height - this.map_mask.height))
						{
							posy = this.map_mask.y - (this.map_group.height - this.map_mask.height);
						}
						this.map_group.y = posy;
					}else if(chay< 0)
					{
						let posy = this.map_group.y - chay;
						if(posy >= this.map_mask.y)
						{
							posy = this.map_mask.y;
						}
						this.map_group.y = posy;
					}
					this.last_x = this.posVec[i].x;
					this.last_y = this.posVec[i].y;
				}
			}
		}
	}
}