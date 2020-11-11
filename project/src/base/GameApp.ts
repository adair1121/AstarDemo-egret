/**
 * @author
 */
class GameApp extends BaseClass {

	private _monsterCfg:MonsterCfg[];
	private _titleCfg:TitleCfg[];
	private _upgradeCfg:UpgradeCfg[];
	public curMapId:string = "map001";
	public curMapName:string = "";
	public battleCount:number = 0;

	private _roleAttr:RoleAttr = <RoleAttr>{};
	private _bagData:BagData[] = [];
	private _signData:SignData = <SignData>{};
	private _fubenData:FuBenData = <FuBenData>{};
	private _bossData:BossData = <BossData>{};
	private _initCfg:any = {};
	private _globalData:GlobalData= <GlobalData>{};
	public _allGoods:GoodsData[]=[];
	public _allSkills:SkillData[]=[];
	public _allForges:ForgeSData[]=[];
	private _posData:any[] = [];
	private _taskNumData:any[] = [0,0,0,0,0,0,0,0,0,0,0,0];
	public funEffectState:number[] = [0,1,0,0,0];
	public taskCfg:TaskCfg[] = [];
	public nowTaskID:number[] = [0,0];
	public taskIdMax:number;
	public bagItemData:ItemAttr[] = [];
	public sceneId:number = 0;
	public autoChallenge:boolean = true;

	public current_hp:number=0;
	public current_Mp:number=0;
	public current_total_hp:number=0;
	public current_total_Mp:number=0;
	public music_state:number=1;
	public sound_state:number=1;
	
	public constructor() {
		super();
	}
	// 加载界面 加载groupName资源 - 跳转(finishFunc中实现)
	public async loadingRes(groupName: string, finishFuc?: Function, isShowLoadView: boolean = true) {
    try {
       
        if (isShowLoadView) {
            var loadingUi = LoadingUI.inst();
            loadingUi.setFinishFunc(() => {
            finishFuc ? finishFuc() : null;
                if (loadingUi.parent) {
                    loadingUi.parent.removeChild(loadingUi);
                }
            });
            StageUtils.inst().getStage().addChild(loadingUi);
            await RES.loadGroup(groupName, 0, loadingUi);
        } else {
            await RES.loadGroup(groupName);
        }
    }
    catch (e) {
        console.error(e);
    }
		
	}
	/*
	*是否ipad
	*/
	public isIpadModel():boolean
	{
		if (navigator.userAgent.indexOf("iPad") != -1) {
			return true;
		}else
		{
			return false;
		}	
	}
	preload()
	{
		let str_arr1:string[]=["sound"];
		let str_arr2:string[]=["resource/res/view/common/sound.mp3"];
		mp3play.preloadRes(`${str_arr1[0]}`,`${str_arr2[0]}`,()=>{
		},this);

		let str_arr3:string[]=["music_attack","music_up"];
		let str_arr4:string[]=["resource/res/view/common/music_attack.mp3","resource/res/view/common/music_up.mp3"];
		for(let i=0;i<str_arr3.length;i++)
		{
			mp3play.preloadRes(`${str_arr3[i]}`,`${str_arr4[i]}`,()=>{
			},this);
		}
	}
	public playMusice()
	{
		if(this.music_state==1)
		{
			let str_arr1:string[]=["sound"];
			let str_arr2:string[]=["resource/res/view/common/sound.mp3"];
			mp3play.preloadRes(`${str_arr1[0]}`,`${str_arr2[0]}`,()=>{
					mp3play.play(`${str_arr1[0]}`,-1);
			},this);
		}else
		{
			mp3play.pause(`sound`);
		}
	}
	public playSound(num:number)
	{
		if(this.sound_state==1)
		{
			let str_arr1:string[]=["music_attack","music_up"];
			let str_arr2:string[]=["resource/res/view/common/music_attack.mp3","resource/res/view/common/music_up.mp3"];
			mp3play.preloadRes(`${str_arr1[num]}`,`${str_arr2[num]}`,()=>{
					mp3play.play(`${str_arr1[num]}`,1);
			},this);
		}
	}
	// 开始界面
	public start() {
		// LoadingUI.inst().hide();
		ViewManager.inst().open(StartScene);
	}
	
	public load() {
		GameApp.inst().preload();
		eui.Label.default_fontFamily = "Microsoft YaHei";
		// GlobalConfig.parserData();
		// LoadingUI.inst().hide();
		this._upgradeCfg = RES.getRes("UpgradeCfg_json");
		this._initCfg = RES.getRes("InitCfg_json");
		let roleAttrStr:string = egret.localStorage.getItem(LocalStorageEnum.ROLE_ATTR);
		if(!!roleAttrStr)
		{
			this._roleAttr = JSON.parse(roleAttrStr);
		}else{
			//初始化集合；
			this._roleAttr.roleTitles = [];
			this._roleAttr.roleSkillLevels = [1,1,1,1];
			this._roleAttr.roleForginDatas = [0,0,0,0,0,0,0,0];
			this._roleAttr.roleEquips = [0,0,0,0,0,0,0,0];

			this._roleAttr.roleName = "玩家名字";
			this._roleAttr.roleSex = 0;
			this._roleAttr.roleJob = 1;
			this._roleAttr.roleLevel=1;
			this._roleAttr.roleTitleId = 0;
			this._roleAttr.roleExp = 0;
			this._roleAttr.roleLevel = 1;
			this._roleAttr.roleKillBoss=[ 0 , 0 , 0 , 0 ];
		}
		//背包数据
		let bagDataStr:string = egret.localStorage.getItem(LocalStorageEnum.BAG_DATA);
		if(!!bagDataStr)
		{
			this._bagData = JSON.parse(bagDataStr);
		}else{
			this._bagData = [];
			// let bag:BagData=<BagData>{};
			// bag.bagLevel=1;
			// bag.itemId=602;
			// bag.itemNum=10000;
			// bag.itemTime=new Date().getTime()/1000;
			// this._bagData.push(bag);
		}
		MessageManager.inst().dispatch
		//签到数据
		let signDataStr:string = egret.localStorage.getItem(LocalStorageEnum.SIGN_DATA);
		if(!!signDataStr)
		{
			this._signData = JSON.parse(signDataStr);
		}else{
			this._signData.signDays = [];
			this._signData.currentDay = 0;
		}
		//副本数据
		let fubenDataStr:string = egret.localStorage.getItem(LocalStorageEnum.FUBEN_DATA)
		if(!!fubenDataStr)
		{
			this._fubenData = JSON.parse(fubenDataStr);
		}else{
			this._fubenData.fubenTimes = [1,1,1];
			this._fubenData.fubenPlayDay = 0;
		}
		//挑战boss冷却计时数据
		let bossDataStr:string = egret.localStorage.getItem(LocalStorageEnum.BOSS_DATA)
		if(!!bossDataStr)
		{
			this._bossData = JSON.parse(bossDataStr);
		}else{
			this._bossData.bossCdTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
		}
		//公共数据
		let globalDataStr:string = egret.localStorage.getItem(LocalStorageEnum.GLOBAL_DATA);
		if(!!globalDataStr)
		{
			this._globalData = JSON.parse(globalDataStr);
		}else{
			this._globalData.gold = 0;
			this._globalData.money = 10000;
			this._globalData.level = 10000;
			this._globalData.fubenId = FUBEN.FUBEN_WILD;
			this._globalData.posData = {x:0,y:0};
		}

		this._monsterCfg = RES.getRes("MonsterCfg_json");
		this._titleCfg = RES.getRes("titleCfg_json");
		this.taskCfg = RES.getRes("TaskCfg_json");
		let taskdata:string = egret.localStorage.getItem(LocalStorageEnum.TASK_SCHEDULE);
		if(!!taskdata)
		{
			this._taskNumData = JSON.parse(taskdata);
		}else 
		{
			egret.localStorage.setItem(LocalStorageEnum.TASK_SCHEDULE, JSON.stringify(this._taskNumData));
		}
		let taskID:string = egret.localStorage.getItem(LocalStorageEnum.TASK_ID);
		if(!!taskdata)
		{
			this.nowTaskID = JSON.parse(taskID);
		}else
		{
			this.nowTaskID[0] = this.taskCfg[0].ID;
			this.nowTaskID[1] = this.taskCfg[1].ID;
			this.taskIdMax = this.taskCfg[1].ID;
			egret.localStorage.setItem(LocalStorageEnum.TASK_ID, this.nowTaskID + "");
		}
		let effect:string = egret.localStorage.getItem(LocalStorageEnum.FUN_BTN_EFFECT);
		if(!!effect)
		{
			this.funEffectState = JSON.parse(effect);
			let timeUp = parseInt(egret.localStorage.getItem("TIME_UP"));
			let timeNow = new Date();
			if(timeNow.getDay() > timeUp)
			{
				this.funEffectState = [0,1,0,0,0];
				if(GameApp.inst().roleAttr.roleLevel >= 10)
				{
					this.funEffectState = [0,0,0,0,0];
				}
			}
			egret.localStorage.setItem(LocalStorageEnum.FUN_BTN_EFFECT, JSON.stringify(this.funEffectState));
			egret.localStorage.setItem("TIME_UP", "" + timeNow.getDay());
		}else
		{
			let timeNow = new Date();
			egret.localStorage.setItem(LocalStorageEnum.FUN_BTN_EFFECT, JSON.stringify(this.funEffectState));
			egret.localStorage.setItem("TIME_UP", "" + timeNow.getDay());
		}
		// RES.loadGroup("item");
		/**测试 */
		// this.taskCfg = JSON.parse(RES.getRes("ForgeCfg_json"));
		
		//----------
		this.getAllGoods();
		this.getAllSkills();
		//ViewManager.inst().open(FubenView);
		// ViewManager.inst().open(BagView);		
		ViewManager.inst().open(StartScene);
		if(egret.getOption("role"))
		GameApp.inst()._roleAttr.roleLevel=parseInt(egret.getOption("role"));
	}
	
	public getForgeStone(id:number):number
	{
		let num:number=0;
		for(let i=0;i<this._bagData.length;i++)
		{
			let bagData:BagData=this._bagData[i];
			if(bagData.itemId==id)
			{
				num=bagData.itemNum;
			}
		}
		return num;
	}
	public saveForgeStone(id:number,reduce_num:number)
	{
		for(let i=0;i<this._bagData.length;i++)
		{
			let bagData:BagData=this._bagData[i];
			if(bagData.itemId==id)
			{
				bagData.itemNum-=reduce_num;
				let valuestr:string = JSON.stringify(this._bagData);
				egret.localStorage.setItem(LocalStorageEnum.BAG_DATA,valuestr);
				MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ 'stone' ] );
				break;
			}
		}
	}
	public getSkillLevels():number[]
	{
		return this._roleAttr.roleSkillLevels;
	}
	/**
	 *  获得所有物品信息
	 */
	public getAllGoods():GoodsData[]
	{
		if(this._allGoods.length==0)
		{
			//解析物品配置信息
			let initCfg:any = RES.getRes('Goods_json');
			for(let key in initCfg)
			{
				this._allGoods.push(initCfg[key]);	
			}
		}
		return this._allGoods;
	}
	/**
	 * 获取当前人物立绘形象
	 */
	public getRoleImg(job:number,sex:number):string
	{
		for(let key in this._initCfg)
		{
			if(job == this._initCfg[key].roleJobId)
			{
				return this._initCfg[key].roleImg+`_${sex}_png`;
			}
		}
	}
	/**
	 *  获得所有强化信息
	 */
	public getAllForges():ForgeSData[]
	{
		if(this._allForges.length==0)
		{
			//解析物品配置信息
			let initCfg:any = RES.getRes('Forges_json');
			for(let key in initCfg)
			{
				this._allForges.push(initCfg[key]);	
			}
		}
		return this._allForges;
	}
	/**
	 *  获得所有技能信息
	 */
	public getAllSkills():SkillData[]
	{
		if(this._allSkills.length==0)
		{
			//解析物品配置信息
			let initCfg:any = RES.getRes('Skills_json');
			for(let key in initCfg)
			{
				this._allSkills.push(initCfg[key]);	
			}
		}	
		return this._allSkills;
	}
	/**根据id刷新技能信息 */
	public getSkillById(id:number)
	{
	
		for(let i:number = 0;i<this._allSkills.length;i++)
		{
			if(this._allSkills[i].skillId == id)
			{
				return this.deepObj(this._allSkills[i]);
			}
		}
	}/**根据id获取技能信息 */
	public getSkillDATAById(id:number)
	{
	
		for(let i:number = 0;i<this._allSkills.length;i++)
		{
			if(this._allSkills[i].skillId == id)
			{
				// return this.deepObj(this._allSkills[i]);
				return this._allSkills[i];
			}
		}
	}
	/**
	 * 获取当前已解锁技能
	 */
	public getLockSkills():SkillData[]
	{
		let job:number = this.roleAttr.roleJob;
		let level:number = this.roleAttr.roleLevel;
		let skillArr:SkillData[] = [];
		for(let key in this._allSkills)
		{
			if(this._allSkills[key].roleJobId == job && level >= this._allSkills[key].open && this._allSkills[key].skillLev == 1)
			{
				skillArr.push(this.deepObj(this._allSkills[key]));
			}
		}
		let realSkillData:SkillData[] = [];
		for(let key in skillArr)
		{
			realSkillData.push(this.getSkillCfgByLevel(skillArr[key].skillModelId,this.roleAttr.roleSkillLevels[key]));
		}
		return realSkillData
	}
	/**根据技能等级获取技能配置信息 */
	public getSkillCfgByLevel(modelid:number,level:number):SkillData
	{
		let job:number = this.roleAttr.roleJob;
		for(let key in this._allSkills)
		{
			if(this._allSkills[key].roleJobId == job && level  == this._allSkills[key].skillLev && modelid == this._allSkills[key].skillModelId)
			{
				return this.deepObj(this._allSkills[key]);
			}
		}
	}
	/**
	 *  获得当前强化到的装备槽等级
	 */
	public getForgeArrId():number[]
	{
		return this._roleAttr.roleForginDatas;
	}

	/**
	 * 设置文本字符并设置锚点
	 */
	make_label_center(txt:eui.Label,str:string)
	{
		txt.text=str;
		txt.validateNow();
		txt.anchorOffsetX=txt.textWidth/2;
		txt.anchorOffsetY=txt.textHeight/2;

	}
	/**
	 * 设置任务完成进度
	 * 击杀野怪  1
	 * 挑战boss  2
	 * 人物升级  3
	 * 技能升级  4
	 * 锻造升级  5
	 * 熔炼次数  6
	 * 关卡通关  7
	 * 商城购物  8
	 * 战力指标  9
	 * 击杀元宝怪  10
	 * 击杀经验怪  11
	 * 击杀强化石怪  12
	 */
	public setTaskData(type:number, id:number)
	{
		for(let i = 0; i < GameApp.inst().nowTaskID.length; i++)
		{
			let cfg:TaskCfg = GameApp.inst().getTaskData(GameApp.inst().nowTaskID[i]);
			if(cfg.task_type == type)
			{
				if(id != null)
				{
					if(cfg.checkpointID == id)
					{
						this._taskNumData[type-1]++;
					}
				}else
				{
					this._taskNumData[type-1]++;
				}
			}
			egret.localStorage.setItem(LocalStorageEnum.TASK_SCHEDULE, JSON.stringify(this._taskNumData));
		}
	}
	/**
	 * 根据类型获取任务完成进度
	 */
	public getTaskNum(type:number):number
	{
		return this._taskNumData[type-1];
	}
	/**
	 * 设置文本字符并设置锚点
	 */
	make_label_left(txt:eui.Label,str:string)
	{
		let pos_x:number=txt.x;
		txt.text=str;
		txt.validateNow();
		txt.anchorOffsetX=txt.textWidth/2;
		txt.x=pos_x;
		//txt.anchorOffsetY=txt.textHeight/2;
	}
	/**
	 * 获取元宝数量
	 */
	public getGoldNum(): number {
		return this._globalData.gold;
	}
	/**
	 * 获取玩家等级
	 */
	public getRoleLevel():number
	{
		return this._roleAttr.roleLevel;
	}
	/**
	 * 获取玩家职业
	 */
	public getRoleJob():number
	{
		return this._roleAttr.roleJob;
	}
	/**
	 * 设置元宝数量
	 */
	public setGoldNum(num) {
		this.refreshGlobalData(`gold`, num);
	}

	/**
	 * 修改人物头像
	 */
	public modifyRoleHead (headId)
	{
		this.refreshRoleAttr(`roleHeadId`,headId);
	}

	/**
	 * 根据天数获取签到配置
	 */
	public getSignCfgByDay(time): boolean {
		return this._signData.currentDay == time ? true : false;
	}

	/**
	 * 根据id获取装备基础信息
	 */
	public getItemById(id):Object
	{
		let item_data:Object={};
		for(let key in this._allGoods)
		{
			if(this._allGoods[key].itemId==id)
			{
				item_data=this._allGoods[key];
				break;
			}
		}
		return item_data;
	}

	/**
	 * 根据id获取人物锻造信息
	 */
	public getForginById(id): number {
		return this._roleAttr.roleForginDatas[id];
	}

	/**
	 * 获取人物总战力
	 */
	public getAllPower(id): number {
		return this._roleAttr.roleAttack;
	}

	/**
	 * 根据id获取称号信息
	 */

	public getTitleById(id):TitleCfg
	{
		for(let key in this._titleCfg)
		{
			if(this._titleCfg[key].titleId == id)
			{
				return this.deepObj(this._titleCfg[key]);
			}
		}
	}

	/**
	 * 将物品添加到背包
	 */
	public addItemToBagById(id,num=1)
	{
		if(BagView.instance)
		BagView.instance.bagRefreshItem();
		if(this._bagData.length >= BagController.inst().getModel.getKongjain()){
			//背包满了
			ViewManager.inst().open(BagTips);
			return;
		}
		MessageManager.inst().dispatch(CustomEvt.ADD_BAG, this);
		if( this.getGoodData( id ).equipPos != -1 ) {
			if( this.isShowEquip( this.getGoodData( id ) ) == true ) {
				MessageManager.inst().dispatch( CustomEvt.MAIN_RESET_EQUIP , this.getGoodData( id ) );
			}
		}
		let item_id:number=-1;
		for(let i=0;i<this._bagData.length;i++)
		{
			if(this._bagData[i].itemId==id)
			{
				item_id=id;
				this._bagData[i].itemNum += num;
				break;
			}
		}
		if(item_id==-1)
		{
			let bagData_obj:BagData=<BagData>{};
			bagData_obj.bagLevel=1;
			bagData_obj.itemId=id;
			bagData_obj.itemNum=num;
			bagData_obj.itemTime=new Date().getTime()/1000;
			this._bagData.push(bagData_obj);
		}
		MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ 'bag' ] );
		egret.localStorage.setItem(LocalStorageEnum.BAG_DATA,JSON.stringify(this._bagData));
		
	}

	public isShowEquip( equip: GoodsData ):boolean {
		let pos = equip.equipPos;
		let nowEquipID = GameApp.inst().roleAttr.roleEquips[pos];
		if( nowEquipID != 0 ) {
			let nowEquip = this.getGoodData( nowEquipID );
			if( nowEquip.wearLevel < equip.wearLevel && GameApp.inst().roleAttr.roleLevel >= equip.wearLevel ) {
				return true;
			} else {
				return  false;
			}
		} else {
			return true;
		}
	}


	/**
	 * 将物品移除背包
	 */
	public removeItemFromBag({id, num}) {
		for (let i = 0; i < this._bagData.length; i++) {
			let bagData_obj: BagData = this._bagData[i];
			if (bagData_obj.itemId == id) {
				if (bagData_obj.itemNum >= num) {
					bagData_obj.itemNum -= num;
					if (bagData_obj.itemNum <= 0) {
						this._bagData.splice(i, 1);
					}
					let valuestr: string = JSON.stringify(this._globalData);
					egret.localStorage.setItem(LocalStorageEnum.BAG_DATA, valuestr);
					break;
				}
			}
		}
	}
	private deepObj(obj:any):any
	{
		let newobj = {};
		for(let key in obj)
		{
			newobj[key] = obj[key];
		}
		return newobj;
	}
	//----------------对外部公开使用接口-------------
	/**获取当前人物信息 */
	public getRoleInfo():UpgradeCfg
	{
		let job:number = this.roleAttr.roleJob;
		let level:number = this.roleAttr.roleLevel;
		for(let i:number = 0;i<this._upgradeCfg.length;i++)
		{
			if(this._upgradeCfg[i].roleJob == job && this._upgradeCfg[i].roleLevel == level)
			{
				return this.deepObj(this._upgradeCfg[i]);
			}
		}
		return null;
	}
	/**选择角色 */
	public selectRole(job:number,rolename:string,sex:number):void
	{
		this.roleAttr.roleJob = job;
		this.roleAttr.roleSex = sex;
		this.roleAttr.roleName = rolename;
		
		let cfg:UpgradeCfg = this.getRoleInfo();
		for(let key in cfg)
		{
			this._roleAttr[key] = cfg[key];
			// this.refreshRoleAttr(key,cfg[key]);
		}
		this.refreshRoleAttr("roleMaxExp",this.getNextRoleInfo().roleMaxExp)

		this.calculPower();
		this.setInitData();
	}
	/**设置创建角色初始化背包数据 */
	public setInitData():void
	{
		for(let key in this._initCfg)
		{
			if(this.roleAttr.roleJob == this._initCfg[key].roleJobId)
			{
				let items:string = this._initCfg[key].itemId.split("_");
				let nums:string = this._initCfg[key].itemNum.split("_");
				for(let i = 0;i<items.length;i++)
				{
					if(parseInt(items[i]) == 601)
					{
						this.setGoldNum(parseInt(nums[i]));
					}else{
						this.addItemToBagById(parseInt(items[i]),parseInt(nums[i]));
					}
				}
				break;
			}
		}
	}
	/**获取人物下一级信息 */
	public getNextRoleInfo():UpgradeCfg
	{
		let job:number = this.roleAttr.roleJob;
		let level:number = this.roleAttr.roleLevel;
		for(let i:number = 0;i<this._upgradeCfg.length;i++)
		{
			if(this._upgradeCfg[i].roleJob == job && this._upgradeCfg[i].roleLevel == (level+1))
			{
				return this.deepObj(this._upgradeCfg[i]);
			}
		}
		return null;
	}
	/**人物获得经验 */
	public roleGetExp(exp:number):void
	{
		let nowexp:number = this.roleAttr.roleExp + exp;
		if(nowexp >= this.roleAttr.roleMaxExp)
		{
			let curRoleInfo:UpgradeCfg = this.getRoleInfo();
			let nextRoleInfo:UpgradeCfg = this.getNextRoleInfo();
			let addCfgArr = RoleAttrName.getAdd( nextRoleInfo );
			for( let i = 0 ; i < addCfgArr.length ; i ++ ) {
				UserTips.inst().showTips2( `${addCfgArr[i].name}  +${addCfgArr[i].num}` );
			}
			let promptValues = {
				attr2:nextRoleInfo.roleHp - curRoleInfo.roleHp,
				attr5:nextRoleInfo.roleDef - curRoleInfo.roleDef,
				attr4:nextRoleInfo.roleAttack - curRoleInfo.roleAttack,
				attr3:nextRoleInfo.roleMp - curRoleInfo.roleMp
			};
			//升级;
			let now_power: number = GameApp.inst().getAllPower(0);
			nowexp -= this.roleAttr.roleMaxExp;
			let job:number = this.roleAttr.roleJob;
			let level:number = this.roleAttr.roleLevel;
			for(let i:number = 0;i<this._upgradeCfg.length;i++)
			{
				if(this._upgradeCfg[i].roleJob == job && this._upgradeCfg[i].roleLevel == (level+1))
				{
					for(let key in this._upgradeCfg[i])
					{
						this.refreshRoleAttr(key,this._upgradeCfg[i][key]);
					}
					if(level + 1 < 100)
					{
						this.refreshRoleAttr("roleMaxExp",this._upgradeCfg[i+1].roleMaxExp);
					}
				}
			}
			let next_power: number = GameApp.inst().getAllPower(0);
			if( now_power != next_power ) {
				let add = now_power < next_power ? "+" : "";
				UserTips.inst().showTips1( `战力 ${add}${Math.floor( next_power - now_power )}` );

				// UserTips.inst().showTips2( `角色升级      战斗力 ${add}${Math.floor( next_power - now_power )}` );
				// UserTips.inst().showTips2( `角色升级      战斗力 ${add}${Math.floor( next_power - now_power )}` );
				// UserTips.inst().showTips2( `角色升级      战斗力 ${add}${Math.floor( next_power - now_power )}` );
				// UserTips.inst().showTips2( `角色升级      战斗力 ${add}${Math.floor( next_power - now_power )}` );
				// UserTips.inst().showTips2( `角色升级      战斗力 ${add}${Math.floor( next_power - now_power )}` );
			}
			this.calculPower();
			MapView.inst().upEffect();
			MessageManager.inst().dispatch(CustomEvt.ROLE_SHENGJI, this);
			MessageManager.inst().dispatch( CustomEvt.ROLE_LEVEL_UPGRADE );

		}
		this.refreshRoleAttr("roleExp",nowexp);
		MessageManager.inst().dispatch(CustomEvt.ROLE_EXPCHANGE, this);
	}
	/**人物总战力计算 */
	public calculPower():void
	{	
		let power:number = this.roleAttr.roleHp*2+this.roleAttr.roleMp*0.5+this.roleAttr.roleAttack*2+this.roleAttr.roleDef*1+this.roleAttr.roleHit*0.5+this.roleAttr.roleDodge*1+this.roleAttr.roleCirt*2 + this.roleAttr.role_kCirk*1;
		this.refreshRoleAttr("rolePower",Math.ceil(power));
	}
	/**根据id获取monster信息 */
	public getMonInfoById(id:number):MonsterCfg
	{
		for(let i:number = 0;i<this._monsterCfg.length;i++)
		{
			if(id == this._monsterCfg[i].id)
			{
				let cfg:MonsterCfg = this.deepObj(this._monsterCfg[i]);
				let attrs:string[] = cfg.monterAttrs.split("_");
				let values:string[] = cfg.monterValues.split("_");
				for(let i:number = 0;i<attrs.length;i++)
				{
					cfg[attrs[i]] = parseInt(values[i]);
				}
				return cfg;
			}
		}
	}
	/**根据副本获取所有怪物信息 */
	public getMonInfoByFuBen(fuben:number):MonsterCfg[]
	{
		let arr:MonsterCfg[] = [];
		for(let i:number = 0;i<this._monsterCfg.length;i++)
		{
			if(fuben == this._monsterCfg[i].copy)
			{
				let cfg:MonsterCfg = this.deepObj(this._monsterCfg[i]);
				let attrs:string[] = cfg.monterAttrs.split("_");
				let values:string[] = cfg.monterValues.split("_");
				for(let i:number = 0;i<attrs.length;i++)
				{
					cfg[attrs[i]] = parseInt(values[i]);
				}
				arr.push(cfg);
			}
		}
		return arr;
	}
	/**根据ID获取任务信息 */
	public getTaskData(_id:number):TaskCfg
	{
		if(!this.taskCfg){return;}
		let taskCfg = null;
		for(let i = 0; i < this.taskCfg.length; i++)
		{
			if(this.taskCfg[i].ID == _id)
			{
				taskCfg = this.taskCfg[i];
			}
		}
		return taskCfg;
	}
	/**根据等级获取背包格子信息 */
	public getGridByLevel(level: number): BagAddCfg {
		// 需要背包扩充表
		let cfg: BagAddCfg[] = JSON.parse(RES.getRes("BagAddCfg_json"));
		for (let i: number = 0; i < cfg.length; i++) {
			if (cfg[i].level == level) {
				return cfg[i];
			}
		}
	}
	/**强化装备槽 
	 * return 锻造后的id
	*/
	public forgeById(id: number): number {
		let forgeInfo: ForgeCfg[] = JSON.parse(RES.getRes("ForgeCfg_json"));
		for (let i: number = 0; i < forgeInfo.length; i++) {
			let item: ForgeCfg = forgeInfo[i];
			if (item.id == id) {
				let forgeData: number[] = this.roleAttr.roleForginDatas;
				forgeData[item.equipPos] = (item.nid == 0 ? item.id : item.nid);
				this.refreshRoleAttr("roleForginDatas", forgeData);
				return item.nid == 0 ? item.id : item.nid;
			}
		}
	}
	/**根据id获取锻造信息 */
	public getForgeById(id: number): ForgeCfg {
		let forgeInfo: ForgeCfg[] = JSON.parse(RES.getRes("ForgeCfg_json"));
		for (let i: number = 0; i < forgeInfo.length; i++) {
			let item: ForgeCfg = forgeInfo[i];
			if (item.id == id) {
				return item;
			}
		}
	}
	/**刷新小地图坐标点记录 */
	public refreshMapPos(xy: XY) {
		this.refreshGlobalData("posData", xy);
	}

	/**获取当前副本掉落*/
	public getDropItem(id:number):{id:number,num:number}[]
	{
		if(this.globalData.fubenId == FUBEN.FUBEN_WILD || this.globalData.fubenId == FUBEN.FUBEN_CHALLENGE)
		{ //野外副本 和  挑战boss副本 有掉落数据
			let cfg:MonsterCfg = this.getMonInfoById(id);
			let dropIds:string[] = cfg.dropID.split("_");
			let dropNums:string[] = cfg.dropNum.split("_");
			let dropRates:string[] = cfg.dropRate.split("_");
			let dropArr:{id:number,num:number}[] = [];
			for(let i:number = 0;i<dropIds.length;i++)
			{
				let index:number = Math.random()*100;
				let rate:number = Number(dropRates[i])*100;
				if(index >= (100-rate))
				{
					let num = parseInt(dropNums[i])?parseInt(dropNums[i]):1;
					let obj = {id:parseInt(dropIds[i]),num:num};
					dropArr.push(obj)
				}
			}
			return dropArr;
		}	
		
	}
	/**获取当前副本冷却时间数据 */
	public getFuBenCdTime(fubenIndex): number {
		return this.fubenData.fubenTimes[fubenIndex];
	}
	/**刷新副本冷却时间数据 */
	public refreshFubenCdTime(fubenIndex:number,time:number)
	{
		this._fubenData.fubenTimes[fubenIndex] = time;
		this.refreshFuBenData("fubenTimes",this._fubenData.fubenTimes);
	}
	/**刷新Boss冷却时间数据 */
	public refreshBossCdTime(bossIndex:number,time:number)
	{
		this._bossData.bossCdTimes[bossIndex] = time;
		this.refreshBossData("bossCdTimes",this._bossData.bossCdTimes);
	}
	
	/** 获取称号配置表 */
	public get titlCfg(): TitleCfg[] {
		return this._titleCfg;
	}
	/**技能数据提升 */
	public skillUpgrade(skillId: number): number {
		let skillInfo: any = RES.getRes("SKILL_json");
		for (let i: number = 0; i < skillInfo.length; i++) {
			if (skillInfo[i].id == skillId) {
				let nid = skillInfo[i].nid ? skillInfo[i].nid : skillInfo[i].id;
				for (let j: number = 0; j < this._roleAttr.roleSkillLevels.length; j++) {
					if (skillId == this._roleAttr.roleSkillLevels[j]) {
						this._roleAttr.roleSkillLevels[j] = nid;
						break;
					}
				}
				this.refreshRoleAttr("roleSkillLevels", this._roleAttr.roleSkillLevels);
				return nid;
			}
		}
	}
	/**小地图增加点 state 0怪物 1人物*/
	public addPoint(id:number, state:number, x:number, y:number)
	{
		let any = {state:state, id:id, x:x, y:y};
		this._posData.push(any);
	}
	/**刷新小地图点 */
	public removePosData(id:number):void
	{
		for(let i = 0; i < this._posData.length; i++)
		{
			if(this._posData[i].id == id)
			{
				this._posData.splice(i, 1);
				break;
			}
		}
	}
	//-------------------------------
	/**刷新小地图点 */
	public refreshPosData(id:number, state:number, x:number, y:number):void
	{
		for(let i = 0; i < this._posData.length; i++)
		{
			if(this._posData[i].id == id)
			{
				this._posData[i].x = x;
				this._posData[i].y = y;
			}
		}
	}

	/**刷新副本数据 */
	public refreshFuBenData(key: string, value: number | string | number[] | any): void {
		if (this._fubenData.hasOwnProperty(key)) {
			this._fubenData[key] = value;
			let valuestr: string = JSON.stringify(this._fubenData);
			egret.localStorage.setItem(LocalStorageEnum.FUBEN_DATA, valuestr);
			// MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ key ] );
		}
	}
	/**刷新Boss数据 */
	public refreshBossData(key:string,value:number|string|number[]|any):void
	{
		if(this._bossData.hasOwnProperty(key))
		{
			this._bossData[key] = value;
			let valuestr:string = JSON.stringify(this._bossData);
			// MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ key ] );
			egret.localStorage.setItem(LocalStorageEnum.BOSS_DATA,valuestr);
		}
	}
	/**刷新公共数据属性 */
	public refreshGlobalData(key: string, value: number | string | number[] | any): void {
		if (this._globalData.hasOwnProperty(key)) {
			this._globalData[key] = value;
			let valuestr: string = JSON.stringify(this._globalData);
			MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ key ] );
			egret.localStorage.setItem(LocalStorageEnum.GLOBAL_DATA, valuestr);
		}
	}
	/**刷新人物基础数据属性 */
	public refreshRoleAttr(key:string,value:number|string|number[]|any):void
	{
		// if(this._roleAttr.hasOwnProperty(key))
		// {
			this._roleAttr[key] = value;
			let valuestr:string = JSON.stringify(this._roleAttr);
			egret.localStorage.setItem(LocalStorageEnum.ROLE_ATTR,valuestr);
			MessageManager.inst().dispatch( CustomEvt.RESET_RED_POINT , [ key ] );
			console.log("-------已刷新人物基础属性------"+key+":"+value);
		// }
	}	
	/**获取人物基础数据属性 */
	public getRoleAttr(key:string)
	{
		let num = 0;
		switch(key)
		{
			case "hp":
				num = this._roleAttr.roleHp;
				break;
			case "mp":
				num = this._roleAttr.roleMp;
				break;
			case "attack":
				num = this._roleAttr.roleAttack;
				break;
			case "def":
				num = this._roleAttr.roleDef;
				break;
			case "cirt":
				num = this._roleAttr.roleCirt;
				break;
			case "kcirk":
				num = this._roleAttr.role_kCirk;
				break;
			case "hit":
				num = this._roleAttr.roleHit;
				break;
			case "dodge":
				num = this._roleAttr.roleDodge;
				break;
		}
		return num;
	}	
	/**获取装备信息 */
	public getEquipData(id:number):GoodsData
	{
		let good:GoodsData = null;
		for(let i = 0; i < this._allGoods.length; i++)
		{
			if(this._allGoods[i].equipPos == id)
			{
				good = this._allGoods[i];
			}
		}
		return good;
	}	/**获取装备信息 */
	public getGoodData(id:number):GoodsData
	{
		let good:GoodsData = null;
		for(let i = 0; i < this._allGoods.length; i++)
		{
			if(this._allGoods[i].itemId == id)
			{
				good = this._allGoods[i];
				break;
			}
		}
		return good;
	}
	//------------get 方法-----------------------

	/**获取人物基础属性数据 */
	public get roleAttr(): RoleAttr {
		return this._roleAttr;
	}
	/**获取背包数据 */
	public get bagData(): BagData[] {
		return this._bagData;
	}
	/**获取签到数据 */
	public get signData(): SignData {
		return this._signData;
	}
	/** 获取副本数据*/
	public get fubenData(): FuBenData {
		return this._fubenData;
	}
	/** 获取Boss数据*/
	public get bossData():BossData
	{
		return this._bossData;
	}
	/**获取 全局公共数据*/
	public get globalData(): GlobalData {
		return this._globalData;
	}
	/**获取 小地图点的位置*/
	public get posData():any[]
	{
		return this._posData;
	}
	/**获取 怪物信息*/
	public get monsterData():MonsterCfg[]
	{
		return this._monsterCfg;
	}
	
	//-------------------------------------------


	public static inst(): GameApp {
		let _inst: GameApp = this.single<GameApp>();
		return _inst
	}
	public postPerLoadProgress(itemsLoaded: number, itemsTotal: number): number[] {
		return [itemsLoaded, itemsTotal];
	}
}