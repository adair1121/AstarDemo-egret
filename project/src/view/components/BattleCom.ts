class BattleCom extends BaseClass{
	private singleFrame:number = 16.7;
	private curXunLuoTime:number = 0;
	private execXunLuoTime:number = 5000;
	private gameframe:number = 300;
	private curGameFrame:number = 0;
	private timeCount = 0;

	private challengeId:number;
	private roleControl:boolean = false;
	/**
	 * syy 移动距离
	 */
	private move_distance:number=500;
	public constructor() {
		super();
	}
	public static inst():BattleCom{
		let _inst:BattleCom = super.single<BattleCom>();
		return _inst
	}
	/**
	 * 切换场景 
	 * scene FUBEN scene;
	 */
	public runToScene(scene:number,challengeId?:number):void
	{
		GameApp.inst().sceneId = scene;
		MessageManager.inst().dispatch(CustomEvt.SWITCH_SCENE, this);
		MessageManager.inst().removeListener(CustomEvt.CHALLENGE_FINISH,this.onChallengeFinish,this);
		MessageManager.inst().removeListener(CustomEvt.REBIRTH,this.onRebirth,this);
		this.stopAtkAi();
		if(scene == FUBEN.FUBEN_WILD)
		{//野外副本
			let cfg:MonsterCfg = GameApp.inst().getMonInfoById(GameApp.inst().globalData.level);
			GameApp.inst().curMapId = cfg.mapID;
			GameApp.inst().curMapName = cfg.sceneName;
			MessageManager.inst().dispatch(CustomEvt.CHALLENGE_FINISH,null);
		}else if(scene == FUBEN.FUBEN_CHALLENGE)
		{//挑战boss副本
			let cfg:MonsterCfg = GameApp.inst().getMonInfoById(challengeId);
			GameApp.inst().curMapId = cfg.mapID;
			GameApp.inst().curMapName = cfg.sceneName;
			MessageManager.inst().addListener(CustomEvt.REBIRTH,this.onRebirth,this);
		}else if(scene == FUBEN.FUBEN_EXP || scene == FUBEN.FUBEN_GOLD || scene == FUBEN.FUBEN_STONE)
		{   //经验，元宝，强化石 ------资源本
			let cfgs:MonsterCfg[] = GameApp.inst().getMonInfoByFuBen(scene);
			GameApp.inst().curMapId = cfgs[0].mapID;
			GameApp.inst().curMapName = cfgs[0].sceneName;
		}
		
		GameApp.inst().globalData.fubenId = scene;
		GameMap.init(RES.getRes(`${GameApp.inst().curMapId}_json`));
		MapView.inst().clearMapUnit();
		SkillComponent.inst().clearSkillEff();
		MapView.inst().initMap();
		TimerManager.inst().removeAll(this);
		this.timeCount = 0;
		
		if(scene == FUBEN.FUBEN_WILD)
		{//野外副本
			MapView.inst().initLevelMonster();
		}else if(scene == FUBEN.FUBEN_CHALLENGE)
		{//挑战boss副本
			this.challengeId = challengeId;
			MapView.inst().initChallengeMon(challengeId);
			let self = this;
			let timeout = setTimeout(function() {
				//避免副本切换间出现的血条数据为空问题
				clearTimeout(timeout)
				MessageManager.inst().dispatch(CustomEvt.CHALLENGE_BOSS,{id:self.challengeId});
			}, 400);
			
		}else if(scene == FUBEN.FUBEN_EXP || scene == FUBEN.FUBEN_GOLD || scene == FUBEN.FUBEN_STONE)
		{//经验，元宝，强化石 ------资源本
			MapView.inst().initAssetsMon(scene);
			TimerManager.inst().doTimer(1000,0,this.doTimerHandler,this);
		}
		// MessageManager.inst().addListener(CustomEvt.CHALLENGE_FINISH,this.onChallengeFinish,this);      
		this.execAtkAi();
	}
	private onRebirth(evt:CustomEvt):void
	{
		MapView.inst().rebirthWithData();
		this.execAtkAi();
	}
	//挑战boss成功
	public onChallengeFinish():void
	{
		this.stopAtkAi();
		MessageManager.inst().dispatch(CustomEvt.CHALLENGE_FINISH);
		//显示结算;
		ViewManager.inst().open(ResultCom,[{state:1,monId:this.challengeId}]);
	}
	private doTimerHandler():void
	{
		this.timeCount+=1;
		if(this.timeCount >= 0.5*60)
		{
			//创建资源boss 	/**创建额外的boss */
			MapView.inst().createAssetsBoss();
			console.log("-------创建资源boss------")
			this.timeCount = 0;
		}
	}
	/**人物死亡 */
	private gameEnd():void
	{
		MessageManager.inst().removeListener(CustomEvt.CHALLENGE_FINISH,this.onChallengeFinish,this);
		//判断如果当前在野外副本直接重置到出生点 在别的副本需要提示被击败
		if(GameApp.inst().globalData.fubenId == FUBEN.FUBEN_WILD || GameApp.inst().globalData.fubenId == FUBEN.FUBEN_EXP || 
		GameApp.inst().globalData.fubenId == FUBEN.FUBEN_GOLD || GameApp.inst().globalData.fubenId == FUBEN.FUBEN_STONE)
		{
			//当前在野外 。在出生点复活
			MapView.inst().rebirth();
		}else{
			// MessageManager.inst().dispatch(CustomEvt.CHALLENGE_FINISH);
			this.stopAtkAi();
			ViewManager.inst().open(BattlFailTip);
		}
	}
	/**执行攻击怪物ai */
	public execAtkAi():void{
		egret.startTick(this.execAction,this);
	}
	/**暂停攻击 */
	public stopAtkAi():void{
		egret.stopTick(this.execAction,this);
	}
	/**挑战关卡boss */
	public challengeLevBoss():void
	{
		if(GameApp.inst().battleCount < 10)
		{
			UserTips.inst().showTips(`还差${10-GameApp.inst().battleCount}个怪可挑战关卡boss`);
		}else{
			MapView.inst().challengeBoss();
		}
	}
	private execAction():boolean{
		this.curGameFrame += this.singleFrame;
		// if(GameApp.inst().globalData.fubenId == FUBEN.FUBEN_WILD)
		// {
		// 	this.curXunLuoTime += this.singleFrame;
		// 	if(this.curXunLuoTime >= this.execXunLuoTime){
		// 		//怪物自由巡逻
		// 		this.curXunLuoTime = 0;
		// 		for(let key in MapView.inst().monsters){
		// 			let item:MonsterEntity = MapView.inst().monsters[key];
		// 			let grid:XY = GameMap.point2Grid(item.x,item.y);
					
		// 		}
		// 	}
		// }
		if(this.curGameFrame >= this.gameframe){
			this.curGameFrame = 0;
			let monsters:any[] = MapView.inst().monsters;
			let roles:any[] = MapView.inst().roles;
			if((roles[0] && roles[0].isDead) || roles.length <= 0){
				//人物已经死亡
				this.gameEnd();
				return;
			}
			let roleItem:SoldierEntity = roles[0];
			for(let i:number = 0;i<monsters.length;i++){
				let monItem:MonsterEntity = monsters[i];
				if(monItem && monItem.isDead){
					monsters.splice(i,1);
					if(monItem.parent){monItem.parent.removeChild(monItem)}
					break;
				}
				monItem.lookAt(roleItem);
				let point1:egret.Point = new egret.Point(monItem.x,monItem.y);
				let point2:egret.Point = new egret.Point(roleItem.x,roleItem.y);
				let distance:number = egret.Point.distance(point1,point2);
				if(distance <= monItem.monsterAttr.viewPortDis)
				{	
					//到达了怪物的视野距离
					if(distance <= monItem.monsterAttr.atkDis){
					//人物与怪之间的距离 小于 怪物视野距离
						monItem.execAtkAction();
					}else {
						monItem.execMoveAction({x:roleItem.x ,y:roleItem.y});
					}
				}else{
					if(monItem.rangeArea.length && !monItem.atkState && !monItem.xunluoState){
						let stateIndex:number = Math.random()*100;
						if(stateIndex >= 70 && monItem.type != 1)
						{
							let moveIndex:number = (Math.random()*monItem.rangeArea.length)>>0;
							let birthXY:{row:number,col:number} = monItem.rangeArea[moveIndex];
							let xy:XY = GameMap.grid2Point(birthXY.col,birthXY.row);
							monItem.execXunluoMove(xy);
						}
						
					}
				}
				
			}
			// if(MapView.inst().mapClick && roleItem.atkTar){
			// 	roleItem.atkTar.atkState = false;
			// }
			if(this.roleControl){return;}
			let nearbyMon:MonsterEntity = this.getNearByEntity(roleItem);
			roleItem.lookAt(nearbyMon);
			if(!roleItem.atkTar || (roleItem.atkTar && roleItem.atkTar.isDead)){return}
			let dis:number = egret.Point.distance(new egret.Point(roleItem.x,roleItem.y),new egret.Point(roleItem.atkTar.x,roleItem.atkTar.y));
			if(GameApp.inst().autoChallenge)
			{
				if(dis <= roleItem.soldierAttr.atkDis){
					egret.Tween.removeTweens(roleItem);
					MapView.inst().moveEnd = true;
					roleItem.execAtkAction(true)
				}else{
					// let tg:XY = this.returnGrid(roleItem.atkTar.gx,roleItem.atkTar.gy);
					//第一个角色 。为主人公
					MapView.inst().execMoveAction({x:roleItem.atkTar.x,y:roleItem.atkTar.y});
				}
			}
			
		}
		this.dealLayerRelation();
		return false;
	}
	/**执行普通攻击动作 */
	public execNormalAtk():void
	{
		if(MapView.inst().roles.length)
		{
			(MapView.inst().roles[0] as SoldierEntity).execAtkAction();
		}
	}
	/**执行手动释放技能 */
	public execSkill(skillId:number):boolean
	{
		if(MapView.inst().roles.length)
		{
			let boo:boolean = (MapView.inst().roles[0] as SoldierEntity).execAtkAction(true,skillId);

			return boo;
		}
	}
	private prevAuto;
	public startControl():void
	{
		egret.Tween.removeTweens(MapView.inst().roles[0]);
		this.prevAuto = GameApp.inst().autoChallenge;
		GameApp.inst().autoChallenge = false;
		MapView.inst().clearRolePath();
		this.roleControl = true;
	}
	public controlRoleMove(pos:XY):void
	{
		let offx = pos.x - MapView.inst().roles[0].x;
		let offy = pos.y - MapView.inst().roles[0].y;
		let angle:number = Math.atan2(offy,offx)*180/Math.PI;
		(MapView.inst().roles[0] as SoldierEntity).calculEntityDic(angle);
		(MapView.inst().roles[0] as SoldierEntity).execAction(ActionState.RUN)
		MapView.inst().roles[0].x = pos.x;
		MapView.inst().roles[0].y = pos.y;
		GameApp.inst().refreshPosData(MapView.inst().roles[0].hashCode,1,pos.x,pos.y);
		MapView.inst().refreshMapPos();
		// let angle = Math.atan2(pos.y - MapView.inst().roles[0].y,pos.x - MapView.inst().roles[0].x)
		// (MapView.inst().roles[0] as SoldierEntity).calculEntityDic(angle);
		// MapView.inst().roles[0].x = pos.x;
		// MapView.inst().roles[0].y = pos.y;
	    // // (MapView.inst().roles[0] as SoldierEntity).changeRoleAction(ActionState.RUN);
		// MapView.inst().refreshMapPos();
	}
	public stopControl():void
	{
		(MapView.inst().roles[0] as SoldierEntity).execAction(ActionState.STAND);
		this.roleControl = false;
		if(this.prevAuto)
		{
			GameApp.inst().autoChallenge = true;
		}
		this.prevAuto = null;

	}
	/**处理层级显示关系 */
	private dealLayerRelation():void{
		let monsters:any[] = MapView.inst().monsters
		let entitys:any[] = monsters.concat(MapView.inst().roles)
		entitys.sort(this.sortFun);
		for(let i:number = 0;i<entitys.length;i++){
			if(entitys[i] && entitys[i].parent){
				entitys[i].parent.setChildIndex(entitys[i],3+i + MapView.inst().drops.length);
			}
		}
	}
	/**获取最近攻击单位 */
	private getNearByEntity(atkEntity:any):MonsterEntity{
		let mons:MonsterEntity[] = MapView.inst().monsters;
		let minEntity:any = mons[0]; 
		if(minEntity){
			let dis:number = Math.sqrt(Math.pow(minEntity.x - atkEntity.x,2)+Math.pow(minEntity.y -atkEntity.y,2));
			for(let i:number = 0;i<mons.length;i++){
				let item1:any = mons[i];
				let dis2:number = Math.sqrt(Math.pow(item1.x - atkEntity.x,2)+Math.pow(item1.y -atkEntity.y,2));
				if(dis2 <= dis){
					minEntity = item1;
					dis = dis2;
				}
			}
		}
		return minEntity;
	}
	private sortFun(param1,param2):number{
		let s1y:number = param1.y;
		let s2y:number = param2.y;
		if(s1y > s2y){
			return 1;
		}else if(s1y < s2y){
			return -1;
		}else{
			return 0;
		}
	}
	
}