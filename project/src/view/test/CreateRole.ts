class CreateRole extends BaseEuiView{
	private baseGroup: eui.Group;
	private jobNum: number = 3;
	private jobData: Array<number> = [1,2,3];
	private screenScale = (1 - StageUtils.inst().getHeight() / 750) + 1;
	private midJobRolePos: any = {x: 200, y: 170 * this.screenScale};
	private rolePos: Array<any> = [];
	private job1:eui.Image;
	private job2:eui.Image;
	private job3:eui.Image;
	private roleImg1: eui.Image;
	private roleImg2: eui.Image;
	private roleImg3: eui.Image;
	private roleImg:eui.Image;
	private randomBtn:eui.Image;
	private manBtn:eui.Button;
	private womanBtn:eui.Button;
	// private nameLab:eui.TextInput;
	private startBtn:eui.Image;
	private randomName: eui.EditableText;
	private fireGroup: eui.Group;

	private _sex:number=-1;
	private _job:number=0;
	public constructor() {
		super();
	}
	public open(...param):void
	{
		this.baseGroup["autoSize"]();
		// this.fireGroup["autoSize"]();
		this.initRoleData();
		
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
		MessageManager.inst().addListener(CustomEvt.GUIDE_CLICK_INFO,this.onguide,this);
		this.roleImg.source = GameApp.inst().getRoleImg(this.job,this.sex);
		this.setFire();
	}

	private initRoleData(): void{
		this.setJobRolePos();
		this.randomRoleName();
		this.setRoleJobAndSex();
		this.showJobNum(this.jobData);
		this.showSex(false);
		this.createFireEffect();
	}

	private setJobRolePos(): void{
		let midIndex = Math.floor(this.jobNum / 2);
		for (let i = 0; i < this.jobNum; i ++) {
			let posObj: any = {};

			if (i < midIndex) {
				posObj.x = this.midJobRolePos.x - (midIndex - i) * 200;
				posObj.y = this.midJobRolePos.y + 50;
				this.rolePos.push(posObj);
			} else if (i == midIndex){
				posObj = GlobalFun.copyTable(this.midJobRolePos);
				this.rolePos.unshift(posObj);
			} else {
				posObj.x = this.midJobRolePos.x + (i - midIndex) * 200;
				posObj.y = this.midJobRolePos.y + 50;
				this.rolePos.push(posObj);
			}
		}
	}

	private setRoleJobAndSex(): void{
		this.sex = 0;//0男1女
		this.job = Math.ceil(Math.random() * 3);//123战法道
	}

	private onguide(evt:CustomEvt):void
	{
		evt.data.data;
	}
	private onTap(evt:egret.TouchEvent):void
	{
		if (evt.target == this.randomBtn) {
			MessageManager.inst().dispatch(CustomEvt.GUIDE_CLICK_INFO,{data:"click"});
			this.randomRoleName();
		} else if (evt.target == this.startBtn) {
			if(this.randomName.text == "")
			{
				UserTips.inst().showTips("请输入名字");
				return;
			}
			GameApp.inst().loadingRes("main", () => {
					
				// 跳转···
				GameApp.inst().selectRole(this.job,this.randomName.text,this.sex);
				BattleCom.inst().runToScene(FUBEN.FUBEN_WILD);
				ViewManager.inst().close(CreateRole);
				ViewManager.inst().open(MainView)
			})
		} else if (evt.target == this.job1) {
			this.job = 1;
		} else if (evt.target == this.job2) {
			this.job = 2;
		} else if (evt.target == this.job3) {
			this.job = 3;
		} else if (evt.target == this.womanBtn) {
			this.sex = 1;
		} else if (evt.target == this.manBtn) {
			this.sex = 0;
		} else if (evt.target.name.indexOf("roleImg_") > -1) {
			this.job = Number(evt.target.name.split("_")[1]);
		}
		// this.refreshPageData()

	}

	private roleNameCfg: any = RES.getRes("RoleName_json");
	private randomRoleName(): void {
		if (this.roleNameCfg) {
			let rand = Math.floor(Math.random() * this.roleNameCfg.length);
			this.randomName.text = this.roleNameCfg[rand]["(盖世英雄)"];
		}
	}
	
	/**刷新界面数据 */
	private roleGroup: eui.Group;
	
	private roleIdData: Array<number> = [1, 2, 3];
	private refreshPageData():void
	{
		this.roleImg.source = GameApp.inst().getRoleImg(this.job,this.sex);
		this.setShowSelectRole();
	}

	private setShowSelectRole(): void {
		// 新排列的roleId
		
		let index = this.roleIdData.indexOf(this.job);
		let zIndexArr = [3, 2, 1];
		this.roleIdData = this.roleIdData.splice(index, this.roleIdData.length - index).concat(this.roleIdData);
		
		let roleNode = this.roleGroup.$children;
		if (this.roleImgArr.length <= 0) {
			this.initSelectRoleImg();
		} else {
			this.changeSelectRoleState(index);
		}
	}

	private roleImgArr: Array<any> = [];
	private initSelectRoleImg(): void {
		let source = GameApp.inst().getRoleImg(this.job,this.sex);
		for (let i = 0; i < this.jobNum; i ++) {
			let roleImg = new eui.Image(GameApp.inst().getRoleImg(this.roleIdData[i],this.sex));
			roleImg.name = `roleImg_${this.roleIdData[i]}`;
			roleImg.anchorOffsetX = 128;
			roleImg.anchorOffsetY = 256;
			roleImg.x = this.rolePos[i].x;
			roleImg.y = this.rolePos[i].y;
			if (i != 0) {
				roleImg.scaleX = 0.7;
				roleImg.scaleY = 0.7;
			} 
			this.roleGroup.addChild(roleImg);
			this.roleImgArr.push(roleImg);
		}
		// console.log(" 创建 roleImg");
	}

	private changeSelectRoleState(index: number): void{
		for (let i = 0; i < this.roleIdData.length; i++) {
			let roleImg =  this.roleGroup.getChildByName(`roleImg_${this.roleIdData[i]}`) as eui.Image;
			roleImg.source = GameApp.inst().getRoleImg(this.roleIdData[i],this.sex);
			// roleImg["roleImg_index"] = i;
			
			if (index == 1 && i == 1) {
				this.roleGroup.setChildIndex(roleImg, 0);
			} else if (index == 1 && i == 2) {
				this.roleGroup.setChildIndex(roleImg, 1);
			} else {
				this.roleGroup.setChildIndex(roleImg, 2 - i);

			}
			egret.Tween.removeTweens(roleImg);
			if (i == 0) {
				egret.Tween.get(roleImg).to({x: this.rolePos[i].x, y: this.rolePos[i].y, scaleX: 1, scaleY: 1}, 500, egret.Ease.sineOut);
			} else {
				egret.Tween.get(roleImg).to({x: this.rolePos[i].x, y: this.rolePos[i].y, scaleX: 0.7, scaleY: 0.7}, 500, egret.Ease.sineOut);
			}
			// egret.Tween.get(roleImg).to(this.rolePos[i], 500, egret.Ease.sineOut);
		}
	}

	private chengeSelectRoleSex():void {
		if (this.roleGroup.$children.length <= 0) return ;
		for (let i = 0; i < this.roleIdData.length; i++) {
			let roleImg =  this.roleGroup.getChildByName(`roleImg_${this.roleIdData[i]}`) as eui.Image;
			roleImg.source = GameApp.inst().getRoleImg(this.roleIdData[i],this.sex);
		}
	}

	/**
	 * 显示可选择职业 
	 * arg 战法道职业 1，2，3
	*/
	public showJobNum(arg:number[]):void
	{
		for(let i:number = 1;i<=3;i++)
		{
			this[`job${i}`].visible = false;
			if(!!~arg.indexOf(i))
			{
				this[`job${i}`].visible = true;
			}
		}
	}
	/**
	 * 显示是否可选择性别
	 */
	private jobBtnGroup: eui.Group;
	private manBtn_select: eui.Image;
	private womanBtn_select: eui.Image;
	private roleTypeImg: eui.Image;
	private roleTypeTitle: eui.Image;
	public showSex(bool:boolean):void
	{
		// this.manBtn.visible = this.womanBtn.visible = bool;
	}
	/**设置默认的性别 */
	public set sex(value:number){
		if (this._sex == value) return ;
		this._sex = value;
		// this.manBtn.currentState = value == 0?"up":"down";
		// this.womanBtn.currentState = value == 1?"up":"down";
		this.manBtn_select.visible = value == 0;
		this.womanBtn_select.visible = value == 1;
		this.chengeSelectRoleSex();
	}
	/**获取默认的性别 */
	public get sex():number{return this._sex;}
	/**设置默认的职业 */
	public set job(value:number){
		if (this._job == value || value == 0) return;
		this._job = value;
		this.setRoleSeletTab(value);
		this.refreshPageData();
	}

	private setRoleSeletTab(value: number): void{
		this.roleTypeImg.source = `roleType_${value}_png`;
		this.roleTypeTitle.source = `roleTypeTitle_${value}_png`;
		let jobBtns = this.jobBtnGroup.$children;
		for (let i = 0; i < jobBtns.length; i++) {
			let btn = jobBtns[i] as eui.Image;
			if (i + 1 == this._job) {
				btn.source = `job${i + 1}_up_png`;
			} else {
				btn.source = `job${i + 1}_down_png`;
			}
		}
	}

	private fire_0: eui.Group;
	private fire_1: eui.Group;
	private fire_2: eui.Group;
	private fire_3: eui.Group;
	private eye_1: eui.Group;
	private eye_2: eui.Group;
	
	private createFireEffect(): void {
		let scale_x = StageUtils.inst().getWidth() / 1334;
		let scale_y = StageUtils.inst().getHeight() / 750;
		for (let i = 0; i < 4; i++) {
			let effect = new MovieClip();
			effect.playFile(`${EFFECT}createRoleFire`, -1, null, true, (i + 1), null, 12);
			this[`fire_${i}`].addChild(effect);
		}
		for (let i = 1; i <= 2; i ++) {
			let effect = new MovieClip();
			effect.playFile(`${EFFECT}createRoleEye`, -1);
			this[`eye_${i}`].addChild(effect);
		}
	}

	/**获取默认的职业 */
	public get job():number{return this._job;}

	public close():void
	{
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
	}

	//设置火焰位置 动态设置
	private setFire() {
		let nx = (1 / this.baseGroup.scaleX) * (StageUtils.inst().getWidth() / 1334);
		let ny = 1 / this.baseGroup.scaleY * (StageUtils.inst().getHeight() / 750);

		this.fire_0.x = 283 * nx;
		this.fire_0.y = 490 * ny;
		this.fire_1.x = 49 * nx;
		this.fire_1.y = 576 * ny;
		this.fire_2.x = 1061 * nx;
		this.fire_2.y = 491 * ny;
		this.fire_3.x = 1294 * nx;
		this.fire_3.y = 571 * ny;

	}
}
ViewManager.inst().reg(CreateRole,LayerManager.UI_Main);