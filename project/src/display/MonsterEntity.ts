class MonsterEntity extends BaseEntity{
	private _atkTar:SoldierEntity;
	private _mc:MovieClip;
	private progressGroup:eui.Group;
	private _watcher:eui.Watcher;
	private curState:string = ActionState.STAND;
	private bossIds:number[] = [1,2,3,4];
	public monsterAttr:MonsterCfg;
	private _res:string;
	public gx:number;
	public gy:number;
	/**攻击状态 */
	public atkState:boolean = false;
	private _barImg:eui.Image;
	private energyBar:egret.Shape;
	private interval;
	public type:number = 0;
	public rangeArea:{row:number,col:number}[] = [];
	public gq:boolean = false;
	public constructor() {
		super();
	}
	public setSoldierData(camp:number,monsterRes:string = "",attr:MonsterCfg,time?:number,scale?:number, gq?:boolean):void{
		this._camp = camp;
		if(gq == true)
		{
			this.gq = gq;
		}
		if(scale){
			this._scale = scale;
		}
		this._res = attr.sequence;
		
		if(GameApp.inst().globalData.fubenId == FUBEN.FUBEN_WILD && this.type == 1)
		{//野外boss需要显示特效
			let mc:MovieClip = new MovieClip();
			this.addChild(mc);
			mc.playFile(`${EFFECT}guardunder`,-1)
		}

		// let bodyres:string = `${this._res}_${this.dic}${this.curState}`;
		this._mc = new MovieClip();
		this.addChild(this._mc);
		// this._mc.playFile(bodyres,-1);

		

		this.monsterAttr = attr;


		this._hp = this._thp = this.monsterAttr.hp;

		this.progressGroup = new eui.Group();
		this.progressGroup.width = 80;
		this.addChild(this.progressGroup);
		this.progressGroup.anchorOffsetX = 40
		// this.progressGroup.x = -40;
		this.progressGroup.y = -110;

		let shadow:eui.Image = new eui.Image();
		shadow.source="shadow_png";
		this.addChild(shadow);
		shadow.anchorOffsetX = shadow.anchorOffsetY= 256>>1;
		shadow.scaleX = shadow.scaleY = 0.5;
		shadow.x = -10;
		shadow.y = -10;

		let nameLab:eui.Label = new eui.Label;
		nameLab.text = this.monsterAttr.monsterName;
		this.progressGroup.addChild(nameLab);
		nameLab.y = -40;
		nameLab.horizontalCenter = 0;
		nameLab.size = 16;
		nameLab.stroke = 1;
		nameLab.strokeColor = 0x000000;
		nameLab.textColor = 0xDC143C;
		// nameLab.fontFamily = "yt";

		// let barRes:number = 0xfc3434;
		// let barimg:egret.Shape = new egret.Shape();
		// barimg.graphics.beginFill(barRes,1);
		// barimg.graphics.drawRect(0,0,90,8);
		// this._barImg = barimg;
		// barimg.graphics.endFill();
		// this.progressGroup.addChild(barimg);
		// if(monsterRes){
			let hpbarimg:eui.Image = new eui.Image();
			hpbarimg.source = "entity_hp_bg_png";
			this.progressGroup.addChild(hpbarimg);
			hpbarimg.y = -15;

			let hpimg:eui.Image = new eui.Image();
			hpimg.source = "entity_hp_bar_png";
			this.progressGroup.addChild(hpimg)
			this._barImg = hpimg;
			hpimg.y = -15;
		// }

		
		this.changeMonsterAction();
		this._watcher = eui.Binding.bindHandler(this,["_hp"],this.onHpChange,this);
		eui.Binding.bindHandler(this,["scaleX"],this.onDicChange,this);
	}
	
	private onDicChange():void
	{
		if(this.type == 1)
		{
			this.progressGroup.scaleX = this.progressGroup.scaleY = 1;
		}
		this.progressGroup.scaleX = this.scaleX < 0?-1:1;

	}
	/**创建活动区域 */
	public createRangeArea():void{
		let xy:XY = GameMap.point2Grid(this.x,this.y);
		let initX:number = xy.x - 1;
		let initY:number = xy.y - 1;
		let maxX:number = xy.x + 1;
		let maxY:number = xy.y + 1;
		for(let i:number = initY;i<=maxY;i++){
			for(let j:number = initX ;j<maxX;j++){
				if(GameMap.walkable(i,j)){
					this.rangeArea.push({row:i,col:j});
				}
			}
		}
	}
	/**更新怪物坐标各自占有值 */
	public refreshPos(gx:number,gy:number):void{
		if(gx != this.gx || gy != this.gy){
			// GameMap.AstarNode.setWalkable(this.gx,this.gy,true);
			this.gx = gx;
			this.gy = gy;
			// GameMap.AstarNode.setWalkable(gx,gy,false);
		}
	}
	public xunluoState:boolean = false;
	/**巡逻移动 */
	public execXunluoMove(xy:XY):void{
		if(this._type == 1){return}
		this.xunluoState = true;
		this.changeMonsterAction(ActionState.RUN,new egret.Point(xy.x,xy.y));
		let startP:egret.Point = new egret.Point(this.x,this.y);
		let endP:egret.Point = new egret.Point(xy.x,xy.y);
		let distance:number = Math.sqrt(Math.pow(startP.x-endP.x,2) + Math.pow(startP.y-endP.y,2));
		let time:number = distance/140;
		egret.Tween.get(this).to({x:xy.x,y:xy.y},time*1000).call(()=>{
			egret.Tween.removeTweens(this);
			this.xunluoState = false;
			if(this._mc){
				this.curState = ActionState.STAND;
				this.changeMonsterAction();
			}
		},this)
	}
	private _path:any[] = [];
	/**执行前往目标附近位置 */
	public execMoveAction(pxy?:XY):void{
		egret.Tween.removeTweens(this);
		this.curState = ActionState.RUN;
		this.changeMonsterAction();
		let gxy:XY = GameMap.point2Grid(pxy.x,pxy.y);
		let _path = this.findPath(gxy.x,gxy.y);
        if(_path){
            this._path = _path;
        }
        if(this._path && this._path.length){
            //去掉第一个格子 。这个格子与人物在一个格子
            this._path.shift();
            if(this._path.length){
                egret.Tween.removeTweens(this);
                this.execMove(this._path.shift());
            }
        }
	}
	/**找寻路径 */
    public findPath(ex:number,ey:number):any[]{
		GameMap.AstarNode.setEndNode(ex,ey);

		let pxy:XY = GameMap.point2Grid(this.x ,this.y);
		GameMap.AstarNode.setStartNode(pxy.x, pxy.y);

		var aStar:astar.AStar = new astar.AStar();
		if(aStar.findPath(GameMap.AstarNode))
		{
			let _path = aStar.path;
			return _path
		}
		return null;
	}
	 private execMove(node:any):void{
        let gx:number = node.x;
        let gy:number = node.y;
        let point:XY = GameMap.grid2Point(gx,gy);
        let dis:number = egret.Point.distance(new egret.Point(point.x,point.y),new egret.Point(this.x,this.y));
        let time:number = dis/140;
        egret.Tween.get(this,{loop:false,onChange:()=>{
            if(GameMap.walkAlpha(gy,gx)){
                this.alpha = 0.7;
            }else{
                this.alpha = 1;
            }
        },onChangeObj:this}).to({x:point.x,y:point.y},time*1000).call(()=>{
			GameApp.inst().refreshPosData(this.hashCode,0,point.x,point.y);
            egret.Tween.removeTweens(this);
            if(this._path && this._path.length){
                this.execMove(this._path.shift())
            }else{
                this.changeMonsterAction(ActionState.STAND);
            }
        })
    }
	/**获取到目标位置的距离 是否达到攻击距离 */
	public isInAtkDis():boolean{
		
		if(this && this._atkTar && !this._atkTar.isDead){
			let startP:egret.Point = new egret.Point(this.x,this.y);
			let endP:egret.Point = new egret.Point(this._atkTar.x,this._atkTar.y);
			let distance:number = Math.sqrt(Math.pow(endP.x - startP.x,2) + Math.pow(endP.y - startP.y,2));
			return  Math.abs(distance) <= this.monsterAttr.atkDis;
		}
		
	}
	/**执行攻击动作 */
	public execAtkAction():void{
		// if(GameApp.battleState == false){return}
		if( !this.atkState){
			if(this.curState != ActionState.ATTACK){
				this.curState = ActionState.ATTACK;
				egret.Tween.removeTweens(this);
				this.changeMonsterAction();
				this.atkState = true;
				let self = this;
				let timeout = setTimeout(function() {
					clearTimeout(timeout);
					if(self && self._mc){
						self.curState = ActionState.STAND;
						self.changeMonsterAction();
					}
					if(self && self._atkTar){
						
						let critRate:number = (self.monsterAttr.cirt - GameApp.inst().roleAttr.role_kCirk)/100 + 0.1;
						let hitRate:number = (self.monsterAttr.hit - GameApp.inst().roleAttr.roleDodge)+0.3;
						let dmg:number = (self.monsterAttr.attack*(1-GameApp.inst().roleAttr.roleDef/10000)+1)*(1+1*critRate)*hitRate;

						self._atkTar.reduceHp(Math.floor(dmg),null,1);
						// let skillEff:MovieClip = new MovieClip();
						// self._atkTar.addChild(skillEff);
						// skillEff.x = 0;
						// skillEff.y = 50;
					}
					let timeout2 = setTimeout(function() {
						//
						clearTimeout(timeout2);
						self.atkState = false;
					}, 600);	
				}, 600);
			}
		}
	}
	public changeMonsterAction(state:string = "",tarPoint:egret.Point = null):void{
		let dic:number = this.dic;
		if(tarPoint){
			let angle:number = Math.atan2(tarPoint.y - this.y,tarPoint.x-this.x)*180/Math.PI;
			this.calculEntityDic(angle);
		}else{
			if(this._atkTar && !this._atkTar.isDead){
				let angle:number = Math.atan2(this._atkTar.y - this.y,this._atkTar.x-this.x)*180/Math.PI;
				this.calculEntityDic(angle);
			}
		}
		// if(this.scaleX == -1){
		// 	this.progressGroup.scaleX = -1;
		// }else{
		// 	this.progressGroup.scaleX = 1;
		// }
		if(!!state){
			if(this.curState == state && dic == this.dic){
				return;
			}
			this.curState = state;
		}
		let bodyres:string = `${MONSTER}${this._res}_${this.dic}${this.curState}`
		if(this._mc){
			this._mc.playFile(bodyres,-1);
		}
	}
	/**锁定目标 */
	public lookAt(_atkTar:SoldierEntity,isNew:boolean = false):void{
		// this.addAttrRestrict();
		if(isNew){
			this._atkTar = _atkTar;
			return;
		}
		if(!this._atkTar ||(this._atkTar && this._atkTar.isDead)){
			//重新锁定目标
			this._atkTar = _atkTar;
		}else{
			return;
		}
	}
	/**解除锁定 */
	public unLookAt():void{
		this._atkTar = null;
	}
	private timeout;
	private onHpChange(value:number):void{
		// if(!isNaN(value)){
			let percent:number = this._hp/this._thp;
			if(this._barImg){
				this._barImg.width = percent*90
			}
			if(this._hp<=0 && this.gq == true)
			{
				this.gq = false;
				GameApp.inst().refreshGlobalData("level", GameApp.inst().globalData.level+1);
			}
		// }
		// this.atkState = true;
		// if(!this.timeout){
		// 	let self = this;
		// 	this.timeout = setTimeout(function() {
		// 		self.atkState = false;
		// 		clearTimeout(self.timeout);
		// 		self.timeout = null;
		// 	}, 3000);
		// }
	}
	public get isDead():boolean{
		return this._isDead;
	}
	public dispose():void{
		// ObjectPool.push(this);
		// this.curState = ActionState.DEAD;
		// this.changeMonsterAction();
		// this._res = `${EFFECT}${this.soldierAttr.model}_${this.curState}`;
		// this._mc.playFile(this._res,1,null,true,this._dic.toString());
		egret.Tween.removeTweens(this);
		MapView.inst().refreshMonItem(this);
		if(this._watcher){
			this._watcher.unwatch();
		}
		let self = this;
		if(this.interval){
			clearInterval(this.interval);
		}
		egret.Tween.get(this).to({alpha:0},300).call(()=>{
			egret.Tween.removeTweens(this);
			if(this && this.parent){
				this.parent.removeChild(this);
			}
			
		},this)
		
	}
	public set hp(value:number){
		this._hp = value;
	}
	public set thp(value:number){
		this._thp = value;
	}
	public get atkTar():SoldierEntity{
		return this._atkTar;
	}
	public set buffAtk(value){
		this.buffAttack = value;
	}
	public set buffHP(value){
		this.buffHp = value;
	}

}