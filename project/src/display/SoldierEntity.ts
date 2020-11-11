class SoldierEntity extends BaseEntity{
	private _atkTar:MonsterEntity;
	public _mc:MovieClip;
	public _weaponMc:MovieClip;
	private _res:string;
	private _weaponRes:string;
	private _direc:number;
	//移动速度 s为单位 。 v*t = d 
	public curState:string = ActionState.STAND;
	private _barimg:eui.Image;
	private _mpbarimg:eui.Image;
	private _watcher:eui.Watcher;
	private _watcher2:eui.Watcher;
	private _watcher3:eui.Watcher;
	private progressGroup:eui.Group;
	public ObjectPoolKey:string = "SoldierEntity";

	public soldierAttr:RoleVo;

	public general:boolean = false;

	public w:number;
	public h:number;
	private _typeId:number;

	private soldierCampImg:eui.Image;

	public camp:number = 1;

	public atkState:boolean = false;

	public isInAtk:boolean = false;

	// private buffIcon:eui.Image;
	// private buffEffect:MovieClip;
	private bodyId:number;
	private titleImg:eui.Image;
	private titleLab:eui.Label;
	public constructor() {
		super();
	}
	protected initialize():void{

	}
	public setSoldierData(camp:number):void{
		this._camp = camp;
		this.camp = camp;
		this._direc = this._camp == 1?1:-1;
		let rolecfg:UpgradeCfg = GameApp.inst().getRoleInfo();
		this._res = rolecfg.roleModelId;
		this._weaponRes = rolecfg.roleWeaponId;
		// this.bodyId = GameApp.inst().roleAttr.roleModelId;
		// let bodyres:string = `${BODY}${res}_${this.dic}${this.curState}`
		// this._weaponRes = weaponRes;
		// let weapon:string = `${WEAPON}${weaponRes}_${this.dic}${this.curState}`

		this._mc = new MovieClip();
		this.addChild(this._mc);
		// this._mc.playFile(bodyres,-1);

		this._hp = this._thp = GameApp.inst().roleAttr.roleHp;
		this._mp = this._tmp = GameApp.inst().roleAttr.roleMp;

		this._weaponMc = new MovieClip();
		this.addChild(this._weaponMc);
		
		

		this.progressGroup = new eui.Group();
		this.progressGroup.width = 80;
		this.addChild(this.progressGroup);
		this.progressGroup.anchorOffsetX = 40;
		// this.progressGroup.x = -40;
		this.progressGroup.y = -120;

		// let levelLab:eui.Label = new eui.Label();
		// this.progressGroup.addChild(levelLab);
		// levelLab.fontFamily = "yt";
		// levelLab.size = 20;
		// levelLab.text = this.soldierAttr.level .toString()+"级";
		// levelLab.horizontalCenter = 0;
		// levelLab.top = -23;
		let shadow:eui.Image = new eui.Image();
		shadow.source="shadow_png";
		this.addChild(shadow);
		shadow.anchorOffsetX = shadow.anchorOffsetY= 256>>1;
		shadow.scaleX = shadow.scaleY = 0.5;
		shadow.x = -15;
		shadow.y = -10;

		let hpbarimg:eui.Image = new eui.Image();
		hpbarimg.source = "entity_hp_bg_png";
		this.progressGroup.addChild(hpbarimg);
		hpbarimg.y = -15;

		let hpimg:eui.Image = new eui.Image();
		hpimg.source = "entity_hp_bar_png";
		this.progressGroup.addChild(hpimg)
		this._barimg = hpimg;
		hpimg.y = -15;

		let mpbarimg:eui.Image = new eui.Image();
		mpbarimg.source = "entity_hp_bg_png";
		this.progressGroup.addChild(mpbarimg);
		mpbarimg.y = -7;

		let mpimg:eui.Image = new eui.Image();
		mpimg.source = "entity_mp_bar_png";
		this.progressGroup.addChild(mpimg)
		this._mpbarimg = mpimg;
		mpimg.y = -7;

		let nameLab:eui.Label = new eui.Label;
		nameLab.text = GameApp.inst().roleAttr.roleName;
		this.progressGroup.addChild(nameLab);
		nameLab.y = -40;
		nameLab.horizontalCenter = 0;
		nameLab.size = 16;
		nameLab.stroke = 1;
		nameLab.strokeColor = 0x000000;
		// nameLab.fontFamily = "yt";

		this.titleImg = new eui.Image();
		this.titleImg.scaleX = this.titleImg.scaleY = 0.8;
		this.progressGroup.addChild(this.titleImg);
		this.titleImg.x = -60;
		this.titleImg.y = -100;
		
		// this.titleLab
		this.titleLab = new eui.Label();
		this.progressGroup.addChild(this.titleLab);
		this.titleLab.size = 16;
		this.titleLab.width = 185;
		this.titleLab.textAlign = egret.HorizontalAlign.CENTER;
		this.titleLab.textColor = 0xFFEE02;
		this.titleLab.stroke = 1;
		this.refreshTitle();

		this.changeRoleAction();
		
		this._watcher = eui.Binding.bindHandler(this,["_hp"],this.onHpChange,this);	
		eui.Binding.bindHandler(this,["_mp"],this.onMpChange,this);
		eui.Binding.bindHandler(this,["scaleX"],this.onDicChange,this);
		MessageManager.inst().addListener( CustomEvt.ROLE_LEVEL_UPGRADE , this.roleLevelUpgrade , this );
	}
	private ownTitleId:number = -1;
	/**刷新称号 */
	private refreshTitle():void
	{
		let titleId:number = GameApp.inst().roleAttr.roleTitleId;
		if(titleId && this.ownTitleId != titleId)
		{
			this.ownTitleId = titleId;
			let titleCfg:TitleCfg = GameApp.inst().getTitleById(titleId);
			let index:number = 0;

			
			for(let i:number = 0;i<GameApp.inst().titlCfg.length;i++)
			{
				if(GameApp.inst().titlCfg[i].titleId == titleId){index = i;break;}
			}
			this.titleImg.source = `title_head_${index}_png`;

			
			this.titleLab.text = titleCfg.titleName;
			this.titleLab.x = this.titleImg.x;
			this.titleLab.y = this.titleImg.y + this.titleImg.height/2 - this.titleLab.textHeight/2-2;
			this.titleImg.visible=true;
			this.titleLab.visible=true;
		}else if(titleId==0)
		{
			this.titleImg.visible=false;
			this.titleLab.visible=false;
		}else if(titleId!=0)
		{
			this.titleImg.visible=true;
			this.titleLab.visible=true;
		}
		
	}
	/**人物升级属性刷新 */
	public refreshAttr():void
	{
		let rolecfg:UpgradeCfg = GameApp.inst().getRoleInfo();
		this._res = rolecfg.roleModelId;
		this._weaponRes = rolecfg.roleWeaponId;
		this._hp = this._thp = GameApp.inst().roleAttr.roleHp;
		this._mp = this._tmp = GameApp.inst().roleAttr.roleMp;
	}
	private onDicChange():void
	{
		this.progressGroup.scaleX = this.scaleX
	}
	private onHpChange(value:number):void{
		if(!isNaN(value)){
			let percent:number = this._hp/this._thp;
			GameApp.inst().current_hp=this._hp;
			GameApp.inst().current_total_hp=this._thp;
			// if(percent <= 0.3){
			// 	MessageManager.inst().dispatch(CustomEvt.DMGSHOW);
			// }else{
			// 	MessageManager.inst().dispatch(CustomEvt.DMGHIDE);
			// }
			if(this._barimg){
				this._barimg.width = percent*90
			}
			console.log("RoleHP ++++++ " + this._hp);
			MessageManager.inst().dispatch(CustomEvt.ROLE_HP_UPDATA, this._hp);
		}
	}
	private onMpChange(value:number):void{
		if(!isNaN(value)){
			MessageManager.inst().dispatch(CustomEvt.ROLE_MP_UPDATA, this._mp);
			let percent:number = this._mp/this._tmp;
			GameApp.inst().current_Mp=this._mp;
			GameApp.inst().current_total_Mp=this._tmp;
			// MessageManager.inst().dispatch(CustomEvt.DMGSHOW);
			if(this._mpbarimg){
				this._mpbarimg.width = percent*90;
			}
		}
	}

	private roleLevelUpgrade():void {
		this._hp = this._thp = GameApp.inst().roleAttr.roleHp;
		this._mp = this._tmp = GameApp.inst().roleAttr.roleMp;
	}
	public addHp(value:number):void{
		let hp = this._hp;
		hp += value;
		if(hp >= this._thp){
			hp = this._thp;
		}
		this._hp = hp;
		let buffmc:MovieClip = new MovieClip();
		this.addChild(buffmc);
		// buffmc.x = this.x;
		// buffmc.y = this.y;
		buffmc.playFile(`${EFFECT}upstate`,3,null,true);
	}
	public playUp():void{
		let mc:MovieClip = new MovieClip();
		mc.playFile(`${EFFECT}upgrade`,1);
		this.addChild(mc);
		GameApp.inst().playSound(1);
	}
	public resetHp(value?:number):void{
		if(value){
			this._hp = this._thp = value;
			this._mp = this._tmp = value;
		}else{
			this._hp = this._thp;
			this._mp = this._tmp;
		}
	}
	private transBoo:boolean;
	public showTrans():void{
		if(this.transBoo){return}
		let transImg:eui.Image = new eui.Image();
		transImg.name = "trans";
		transImg.source = "trasnIcon_png";
		transImg.anchorOffsetX = 376>>1;
		transImg.scaleX = transImg.scaleY = 0.4;
		// this._mc.y -=  20;
		this.curState = ActionState.STAND;
		this.changeRoleAction();
		this.transBoo = true;
		this.addChild(transImg);
		this.swapChildren(this._mc,transImg)
	}
	public hideTrans():void{
		let trans:eui.Image = this.getChildByName("trans") as eui.Image;
		if(trans && trans.parent){
			trans.parent.removeChild(trans);
			this.transBoo = false;
		}
	}
	
	private frameRate:number = 0;
	public changeRoleAction(state:string = "",tarPoint:egret.Point = null):void{
		if(this.transBoo){return;}
		let dic:number = this.dic;
		if(tarPoint){
			let angle:number = Math.atan2(tarPoint.y - this.y,tarPoint.x-this.x)*180/Math.PI;
			this.calculEntityDic(angle);
		}else{
			if(this.atkTar && !this.atkTar.isDead){
				let angle:number = Math.atan2(this.atkTar.y - this.y,this.atkTar.x-this.x)*180/Math.PI;
				this.calculEntityDic(angle);
			}
		}
		if(this.scaleX == -1){
			this.progressGroup.scaleX = -1;
		}else{
			this.progressGroup.scaleX = 1;
		}
		// if(this._atkTar && !this._atkTar.isDead){
		// 	let angle:number = Math.atan2(this._atkTar.y - this.y,this._atkTar.x-this.x)*180/Math.PI;
		// 	this.calculEntityDic(angle);
		// }
		if(!!state){
			if(this.curState == state && dic == this.dic){
				return;
			}
			this.curState = state;
		}
		if(this.curState == ActionState.RUN)
		{
			this.frameRate = 20;
		}
		let rolecfg:UpgradeCfg = GameApp.inst().getRoleInfo();
		this._res = rolecfg.roleModelId;
		this._weaponRes = rolecfg.roleWeaponId;
		this.refreshTitle();
		// let weapon:string = `${WEAPON}${this._weaponRes}_${GameApp.inst().r}_${this.dic}${this.curState}`
		if(this._mc){
			// let frameRate:number = (this.curState == ActionState.ATTACK?this.frameRate?this.frameRate:null:15)
			this._mc.playFile(`${BODY}${this._res}_${GameApp.inst().roleAttr.roleSex}_${this.dic}${this.curState}`,-1,null,false,null,null,this.frameRate?this.frameRate:null);
			this._weaponMc.playFile(`${WEAPON}${this._weaponRes}_${GameApp.inst().roleAttr.roleSex}_${this.dic}${this.curState}`,-1,null,false,null,null,this.frameRate?this.frameRate:null);
		}
		
	}
	//克制攻击力
	private restriceAtk:number = 0;
	/**执行攻击动作 */
	public execAtkAction(isReleaseSkill?:boolean,skillId?:number):boolean{
		// if(GameApp.battleState == false){return}
		let skillBoo = false;
		if(isReleaseSkill)
		{
			skillBoo = SkillComponent.inst().releaseSkill(this.atkTar,skillId);
		}
		if((this.isInAtkDis() )  ){
			
			if(this.curState != ActionState.ATTACK){
				let time:number = 700;
				if(this.frameRate){
					time = 200;
				}
				
				this.curState = ActionState.ATTACK;
				egret.Tween.removeTweens(this);
				// if(this._atkTar && !this._atkTar.isDead){
				// 	let angle:number = Math.atan2(this._atkTar.y - this.y,this._atkTar.x-this.x)*180/Math.PI;
				// 	this.calculEntityDic(angle);
				// }
				// this._res = `${EFFECT}${this.soldierAttr.model}_${this.curState}`;
				// this._mc.playFile(this._res,1,null,false,this._dic.toString());
				this.changeRoleAction();
				this.atkState = true;
				let self = this;
				let timeout = setTimeout(function() {
					clearTimeout(timeout);
					if(self && self._mc){
						self.curState = ActionState.STAND;
						// self._res = `${EFFECT}${self.soldierAttr.model}_${self.curState}`;
						// self._mc.playFile(self._res,-1,null,false,self._dic.toString());
						self.changeRoleAction();
					}
					if(self && self._atkTar){
						let critRate:number = (GameApp.inst().roleAttr.roleCirt - self._atkTar.monsterAttr.kcirk)/100 + 0.1;
						let hitRate:number = (GameApp.inst().roleAttr.roleHit - self._atkTar.monsterAttr.dodge)+0.3;
						let dmg:number = (GameApp.inst().roleAttr.roleAttack*(1-self._atkTar.monsterAttr.def/10000)+1)*(1+1*critRate)*hitRate;

						self._atkTar.reduceHp(Math.floor(dmg));
						let skillEff:MovieClip = new MovieClip();
						LayerManager.UNIT_LAYER.addChild(skillEff);
						skillEff.scaleX = skillEff.scaleY = 0.5;
						skillEff.x = self._atkTar.x;
						skillEff.y = self._atkTar.y;
						GameApp.inst().playSound(0);
						skillEff.playFile(`${EFFECT}skill404`,1,null,true)
					}
					let timeout2 = setTimeout(function() {
						//
						clearTimeout(timeout2);
						self.atkState = false;
					}, time);	
				}, 200);
			}
		}
		return skillBoo;
	}
	public changeRoleMp(value:number):void{
		this.changeMp(value);
	}
	private createArrow():void{
		let img:eui.Image = new eui.Image();
		img.source = "arrow_png";
		this.parent.addChild(img);
		img.anchorOffsetX = 20;
		img.scaleX = -this.camp;
		let angle:number = Math.atan2(this.atkTar.y - this.y,this.atkTar.x - this.x)*180/Math.PI;
		img.rotation = angle;
		img.x = this.x;
		img.y = this.y - (this.h>>1);
		egret.Tween.get(img).to({x:this._atkTar.x,y:this._atkTar.y},400).call(()=>{
			egret.Tween.removeTweens(img);
			img.parent.removeChild(img);
		},this)
	}
	/**执行站立 */
	public execAction(action:string):void
	{
		if(this.curState == action && this.dic == this.prevDic){return}
		this.atkState = false;
		this.curState = action;
		this._mc.playFile(`${BODY}${this._res}_${GameApp.inst().roleAttr.roleSex}_${this.dic}${this.curState}`,-1,null,false,null,null,this.frameRate?this.frameRate:null);
		this._weaponMc.playFile(`${WEAPON}${this._weaponRes}_${GameApp.inst().roleAttr.roleSex}_${this.dic}${this.curState}`,-1,null,false,null,null,this.frameRate?this.frameRate:null);
	}
	/**执行前往目标附近位置 */
	public execMoveAction(xy?:XY,cb?:()=>void,thisarg?:any,frameFun?:()=>void):void{
		this.atkState = false;
		if(xy){
			if(this.curState != ActionState.RUN){
				this.curState = ActionState.RUN;
				// this._res = `${EFFECT}${this.soldierAttr.model}_${this.curState}`;
				// this._mc.playFile(this._res,-1,null,false,this._dic.toString());
				this.changeRoleAction();
			}
			let startP:egret.Point = new egret.Point(this.x,this.y);
			let endP:egret.Point = new egret.Point(xy.x,xy.y);
			let distance:number = Math.sqrt(Math.pow(startP.x-endP.x,2) + Math.pow(startP.y-endP.y,2));
			let time:number = distance/140;
			// let useTime:number = time*1000;
			// if(!this.general && isquick){
			// 	useTime = time*500;
			// }
			egret.Tween.get(this,{loop:false,onChange:()=>{
				if(frameFun && thisarg)
				{
					frameFun.call(thisarg);
				}
				GameApp.inst().refreshPosData(this.hashCode,1,this.x,this.y);
			},onChangeObj:this}).to({x:xy.x,y:xy.y},time*1000).call(()=>{
				egret.Tween.removeTweens(this);
				if(this._mc){
					this.curState = ActionState.STAND;
					// this._res = `${EFFECT}${this.soldierAttr.model}_${this.curState}`;
					// this._mc.playFile(this._res,-1,null,false,this._dic.toString());
					this.changeRoleAction();
					if(cb && thisarg){cb.call(thisarg);}
				}
			},this)
		}else{
			if(this && this._atkTar && !this._atkTar.isDead){
				// let angle:number = Math.atan2(this._atkTar.y - this.y,this._atkTar.x-this.x)*180/Math.PI;
				// this.calculEntityDic(angle);
				if(this.curState != ActionState.RUN){
					this.curState = ActionState.RUN;
					// this._res = `${EFFECT}${this.soldierAttr.model}_${this.curState}`;
					// this._mc.playFile(this._res,-1,null,false,this._dic.toString());
					this.changeRoleAction();
				}
				let startP:egret.Point = new egret.Point(this.x,this.y);
				let endP:egret.Point = new egret.Point(this._atkTar.x,this._atkTar.y);
				let distance:number = Math.sqrt(Math.pow(startP.x-endP.x,2) + Math.pow(startP.y-endP.y,2));
				egret.Tween.removeTweens(this);
				let time:number = distance/this.soldierAttr.spd;
				egret.Tween.get(this,{loop:false,onChange:()=>{
					if(this.isInAtkDis()){
						egret.Tween.removeTweens(this)
					}
				},onChangeObj:this}).to({x:this._atkTar.x,y:this._atkTar.y},time*1000).call(()=>{
					GameApp.inst().refreshPosData(this.hashCode,1,this.x,this.y);
					egret.Tween.removeTweens(this);
				},this)
			}
		}
		
	}
	// /**执行站立状态 */
	// public execStandAction():void{
	// 	this.atkState = false;
	// 	this.curState = ActionState.STAND;
	// 	this._res = `${EFFECT}${this.soldierAttr.model}_${this.curState}`;
	// 	this._mc.playFile(this._res,-1,null,false,this._dic.toString());
	// }
	
	/**获取到目标位置的距离 是否达到攻击距离 */
	public isInAtkDis():boolean{
		// if(!this._atkTar){
		// 	return this.isInAtk;
		// }
		if(this && this._atkTar && !this._atkTar.isDead){
			let startP:egret.Point = new egret.Point(this.x,this.y);
			let endP:egret.Point = new egret.Point(this._atkTar.x,this._atkTar.y);
			let distance:number = Math.sqrt(Math.pow(endP.x - startP.x,2) + Math.pow(endP.y - startP.y,2));
			return  Math.abs(distance) <= this.soldierAttr.atkDis;
		}
		
	}
	/**锁定目标 */
	public lookAt(_atkTar:MonsterEntity,isNew:boolean = false):void{
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
	public get isDead():boolean{
		return this._isDead;
	}
	public get isnoMp():boolean{
		return this._isnoMp;
	}
	public dispose():void{
		// ObjectPool.push(this);
		
		
		this.curState = ActionState.STAND;
		this.changeRoleAction();
		// this._res = `${EFFECT}${this.soldierAttr.model}_${this.curState}`;
		// this._mc.playFile(this._res,1,null,true,this._dic.toString());
		if(this._watcher){
			this._watcher.unwatch();
		}
		if(this._watcher2){
			this._watcher2.unwatch();
		}
		if(this._watcher3){
			this._watcher3.unwatch();
		}
		let self = this;
		let timeout = setTimeout(function() {
			clearTimeout(timeout)
			self._atkTar = null;
			if(self && self._mc){
				self.removeChild(self._mc);
				self._mc = null;
			}
			if(self && self.parent){
				self.parent.removeChild(self);
			}
		}, 600);
	}
	// private addAttrRestrict():void{
	// 	if(!this._atkTar){return}
	// 	if(this._typeId == SoldierType.ARROW){
	// 		//当前我是弓箭手 克制盾 被克制骑兵
	// 		if(this._atkTar._typeId == SoldierType.QI){
	// 			this.restriceAtk = 50;
	// 		}else if(this._atkTar._typeId == SoldierType.SHIELD){
	// 			this.restriceAtk = -50;
	// 		}else{
	// 			this.restriceAtk = 0;
	// 		}
	// 	}else if(this._typeId == SoldierType.QI){
	// 		//当前我是骑兵
	// 		if(this._atkTar._typeId == SoldierType.ARROW){
	// 			this.restriceAtk = -50;
	// 		}else if(this._atkTar._typeId == SoldierType.SHIELD){
	// 			this.restriceAtk = 50;
	// 		}else{
	// 			this.restriceAtk = 0;
	// 		}
	// 	}else if(this._typeId == SoldierType.SHIELD){
	// 		if(this._atkTar._typeId == SoldierType.ARROW){
	// 			this.restriceAtk = 50;
	// 		}else if(this._atkTar._typeId == SoldierType.QI){
	// 			this.restriceAtk = -50;
	// 		}else{
	// 			this.restriceAtk = 0;
	// 		}
	// 	}
	// }
	public set hp(value:number){
		this._hp = value;
	}
	public set thp(value:number){
		this._thp = value;
	}
	public get atkTar():MonsterEntity{
		return this._atkTar;
	}
	public set buffAtk(value){
		this.buffAttack = value;
	}
	public set buffHP(value){
		this.buffHp = value;
	}
	// public set buffDefense(value:number){
	// 	this.buffDef = value;
	// }
}
