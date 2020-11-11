class BaseEntity extends eui.Component{
	//阵营
	protected _camp:number;
	//entityid值
	protected _id:number;
	//方向
	protected _dic:number = 4;

	protected _hp:number = 40;
	protected _thp:number = 40;
	protected _mp:number = 40;
	protected _tmp:number = 40;
	protected _attack:number = 20;
	protected _changeValue:number = 0.1;
	protected _isDead:boolean = false;

	protected buffAttack:number = 0;
	protected buffHp:number = 0;
	protected buffDef:number = 0;
	protected _scale:number = 1;
	protected _crit:number = 0.4;
	protected _isnoMp:boolean = false;
	protected _type:number;
	public constructor() {
		super();
		this.initialize();
	}
	protected initialize():void{}

	public get camp():number{
		return this._camp;
	}
	public get instId():number{
		return this._id;
	}
	public set dic(value:number){
		this._dic = value;
	}
	public get dic():number{
		return this._dic;
	}
	public get scale():number
	{
		return this.scaleX;
	}
	public get attack():number{
		let index:number = (Math.random()*100)>>0;
		let dic:number = index >= 50?1:-1;
		return (this._attack+this.buffAttack) + dic*((this._attack+this.buffAttack)*this._changeValue);
	}
	public set attack(value:number){
		this._attack = value;
	}
	public reduceHp(dmg:number,critValue?:number,current_id:number=0,current_id2:number=0):void{
		if(this.buffHp > 0){
			this.buffHp -= dmg;
		}else{
			// let cirt:boolean = false;
			// if(this._camp == -1){
			// 	let index:number = (Math.random()*100)>>0;
			// 	if(index >= 60){
			// 		cirt = true;
			// 		dmg += ((dmg*this._crit)>>0);
			// 	}
			// }
			dmg = Math.abs(dmg);
			
			let rhp = critValue?dmg+critValue:dmg;
			
			this._hp-=rhp;
			if(GameApp.inst().globalData.fubenId == FUBEN.FUBEN_CHALLENGE && this.camp == -1)
			{
				MessageManager.inst().dispatch(CustomEvt.BOSS_DMG,{hp:this._hp});
			}
			let dmgfont:eui.BitmapLabel = new eui.BitmapLabel();
			dmgfont.scaleX = dmgfont.scaleY = 0.7;
			if(current_id==0)
			{
				dmgfont.font = "dmg_fnt";
				dmgfont.text = critValue?"c-"+(dmg+critValue):"-"+dmg;
			}else if(current_id==1)
			{
				dmgfont.font = "dmg2_fnt";
				dmgfont.text = critValue?"c-"+(dmg+critValue):"-"+dmg;
			}else if(current_id==2)
			{
				dmgfont.font = "dmg_fnt";
				dmgfont.text = critValue?"c-"+(dmg+critValue):"s-"+dmg;
			}
			

			if(this.parent){
				this.parent.addChildAt(dmgfont,this.parent.numChildren - 1);
			}
			// if(current_id2==1)
			// {
			// 	dmgfont.text = critValue?"c-"+(dmg+critValue):"sha-"+dmg;
			// }else
			// {
			// 	dmgfont.text = critValue?"c-"+(dmg+critValue):"-"+dmg;
			// }
			
			dmgfont.x = this.x;
			dmgfont.y = this.y + -100 + ((Math.random()*50)>>0);
			// if(this.scaleX < 0){
			// 	dmgfont.scaleX = -0.7;
			// }else{
			// 	dmgfont.scaleX = 0.7;
			// }
			egret.Tween.get(dmgfont).to({y:this.y-200},1200+((Math.random()*400)>>0),egret.Ease.circIn).call(()=>{
				egret.Tween.removeTweens(dmgfont);
				if(dmgfont && dmgfont.parent){
					dmgfont.parent.removeChild(dmgfont);
				}
			},this)
			if(this._hp<=0){
				this._hp = 0;
				this._isDead = true;
				// if(GameApp.fuben == FuBenEnum.BOSS && this._camp == -1){
				// 	MessageManager.inst().dispatch(CustomEvt.BOSS_DEAD);
				// }
				if(this._camp == -1){
					let exp:number =  15 + ((Math.random()*10)>>0);
					GameApp.inst().roleAttr.roleExp += exp;
					UserTips.inst().showTips("经验+"+exp);
				}
				this.dispose();
			}
		}
	}
	public changeMp(dmg:number):void{
		if(dmg){
			this._mp -= dmg;
		}
		if(this._mp >= this._tmp){
			this._mp = this._tmp;
		}
		if(this._mp <= 0){
			this._mp = 0;
			this._isnoMp = true;
		}else{
			this._isnoMp = false;
		}
	}
	public prevDic:number;
	//计算方向
	public calculEntityDic(angle:number,cb?:()=>void,arg?:this):void{
		// let pervDic = this._dic;
		this.prevDic = this._dic;
		if(angle >= -20 && angle <= 20){
			this._dic = DirectionEnum.RIGHT;
			this.scaleX = this._scale;
		}else if(angle < -20 && angle >= -70){
			this._dic = DirectionEnum.TR;
			this.scaleX = this._scale;
		}else if(angle < -70 && angle > -110){
			this._dic = DirectionEnum.TOP;
			this.scaleX = this._scale;
		}else if(angle >20 && angle <= 70){
			this._dic = DirectionEnum.RB
			this.scaleX = this._scale;
		}else if(angle >70&& angle<=110){
			this._dic = DirectionEnum.BOTTOM;
			this.scaleX = this._scale;
		}else if(angle > 110 && angle <= 160){
			this._dic = DirectionEnum.RB;
			this.scaleX = -this._scale;
		}else if((angle > 160 && angle <= 180) || (angle >= -180 && angle <= -160)){
			this._dic = DirectionEnum.RIGHT;
			this.scaleX = -this._scale;
		}else if(angle >-160 && angle <= -110){
			this._dic = DirectionEnum.TR;
			this.scaleX = -this._scale;
		}
		if(this.prevDic != this._dic && cb)
		{
			cb();
		}
	}
	protected dispose():void{
		
	}
}