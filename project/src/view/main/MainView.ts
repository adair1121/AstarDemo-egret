class MainView extends BaseEuiView
{
	private right_group:eui.Group;
	private map_group:eui.Group;
	private gk_group:eui.Group;
	private di_group:eui.Group;
	private head_group:eui.Group;
	private task_group:eui.Group;
	private dir_group:eui.Group;
	private skill_group:eui.Group;

	private exp_tiao:eui.Image;//关卡经验条

	private map_label:eui.Label;//地图名字

	private exp_mack:eui.Rect;
	private vj:VirtualJoystick;
	private hpCom:BossHpCom;
	private fuben_btn:eui.Image;
	private guanqia:MainGuanQia;
	private guaji_btn:eui.Rect;
	private guaji_img:eui.Image;
	private set_btn:eui.Image;
	private state:number = 0;
	private xunluEffect:MovieClip;
	public constructor() 
	{
		super();
	}
	public open(...param):void{
		GameApp.inst().playMusice();
		this.right_group["autoSize"]();
		this.head_group["autoSize"]();
		this.di_group["autoSize"]();
		this.task_group["autoSize"]();
		this.dir_group["autoSize"]();
		this.skill_group["autoSize"]();
		this.gk_group["autoSize"]();
		this.dir_group.scaleX += 0.2;
		this.dir_group.scaleY += 0.2;
		this.skill_group.scaleY += 0.2;
		this.skill_group.scaleX += 0.2;
		if(StageUtils.isIphone11())
		{
			this.task_group.left = 50;
			// this.gk_group.right = 50;
		}
		MessageManager.inst().addListener(CustomEvt.OPEN_FUN_VIEW, this.openFunView, this);

		this.xunluEffect = new MovieClip();
		this.xunluEffect.x = this.di_group.width/2;
		this.xunluEffect.y = -35;
		this.xunluEffect.playFile(`${EFFECT}zidong_effect`, -1);
		this.xunluEffect.scaleX = this.xunluEffect.scaleY = 0.7;
		this.di_group.addChild(this.xunluEffect);

		var btn0 = new MainBtn(["shangcheng", "chenghao", "qiandao"]);
		btn0.x = 45;
		this.right_group.addChild(btn0)
		var btn2 = new MainBtn(["fuben","boss"]);
		btn2.x = 130;
		btn2.y = 85;
		this.right_group.addChild(btn2)
		var btn1 = new MainBtn(["juese", "jineng", "duanzao", "beibao"]);
		btn1.x = 60;
		this.di_group.addChild(btn1);
		this.exp_tiao.mask = this.exp_mack;
		this.vj.start();
		this.vj.addEventListener(CustomEvt.VJ_START,this.onVjStart, this);
		this.vj.addEventListener(CustomEvt.VJ_MOVE, this.onVjChange, this);
		this.vj.addEventListener(CustomEvt.VJ_END, this.onVjEnd, this);
		this.hpCom.visible = false;
		MessageManager.inst().addListener(CustomEvt.CHALLENGE_BOSS,this.onChallengeBoss,this);
		MessageManager.inst().addListener(CustomEvt.ROLE_EXPCHANGE, this.update, this);
		MessageManager.inst().addListener(CustomEvt.CHALLENGE_FINISH,this.finish,this);     
		MessageManager.inst().addListener(CustomEvt.ROLE_SHENGJI, this.roleAttrChange, this);
		MessageManager.inst().addListener(CustomEvt.BOSS_DMG,this.onBossDmg,this); 
		MessageManager.inst().addListener(CustomEvt.GUIDE_LOCAL_CHANGE,this.guideLocalChange,this);
		MessageManager.inst().addListener( CustomEvt.MAIN_RESET_EQUIP , this.mainResetEquip , this );
		this.addTouchEvent(this.guaji_btn, this.touchGuaji, true);
		let guideLocal = NoviceGuideView.getGuideLocal();
		if( guideLocal.start == false ) {
			// egret.Tween.get( this )
			// .wait( 1000 )
			// .call( function(){
			ViewManager.inst().open( WelcomeView );
			MessageManager.inst().addListener( CustomEvt.WELCOME_CLOSE , this.welcomeViewClose , this );
			// }.bind( this ) );
		} else {
			this.addGuide();
		}
		this.vj.alpha = 0.5;
		eui.Binding.bindHandler(GameApp.inst(),["autoChallenge"],this.onAutoChallenge,this);

		this.addTouchEvent(this.set_btn,this.setView,true);
	}
	private setView()
	{
		ViewManager.inst().open(SetView);
	}
	private touchGuaji()
	{
		GameApp.inst().autoChallenge = !GameApp.inst().autoChallenge;
		this.xunluEffect.visible = GameApp.inst().autoChallenge;
	}
	private onAutoChallenge():void
	{
		this.state = GameApp.inst().autoChallenge?0:1;
		this.guaji_img.source = `hang_up${this.state}_png`;
	}
	private welcomeViewClose( event: CustomEvt ):void {
		this.addGuide();
		MessageManager.inst().removeListener( CustomEvt.WELCOME_CLOSE , this.welcomeViewClose , this );
		MessageManager.inst().addListener(CustomEvt.GUIDE_LOCAL_CHANGE,this.guideLocalChange,this); 
		MessageManager.inst().addListener(CustomEvt.SWITCH_SCENE, this.switchScene, this);
		this.addTouchEvent(this.fuben_btn, this.fubenBack);
	}

	private mainResetEquip( event: CustomEvt ):void {
		let edut = new EquipDressUpTips( event.data );
		edut.scaleX = edut.scaleY = (StageUtils.inst().getWidth()/1334);
		this.addChild( edut );
		edut.right = 180*(StageUtils.inst().getWidth()/1334);
		edut.top = 200;
	}
	private fubenBack()
	{
		FubenView.playCfg.open = false;
		BattleCom.inst().runToScene(FUBEN.FUBEN_WILD);
	}
	private switchScene()
	{
		if(GameApp.inst().sceneId == FUBEN.FUBEN_EXP || GameApp.inst().sceneId == FUBEN.FUBEN_GOLD || GameApp.inst().sceneId == FUBEN.FUBEN_STONE || GameApp.inst().sceneId == FUBEN.FUBEN_CHALLENGE)
		{
			this.fuben_btn.visible = true;
			this.guanqia.visible = false;
		}else 
		{
			this.guanqia.visible = true;
			this.fuben_btn.visible = false;
		}
	}
	private roleAttrChange(evt:CustomEvt):void
	{
		let showprompt = evt.data.prompt;
		let index:number = -1;
		for(let key in showprompt)
		{
			index += 1;
			let group:eui.Group = new eui.Group();
			let img:eui.Image = new eui.Image();
			img.source = `${key}_png`;
			group.addChild(img);
			group.alpha = 0;
			let bitmapLab:eui.BitmapLabel = new eui.BitmapLabel();
			bitmapLab.font = "num_r0_fnt";
			group.addChild(bitmapLab);
			bitmapLab.text = showprompt[key];
			bitmapLab.x = img.x + 83;
			bitmapLab.y = img.y + 15;
			LayerManager.UNIT_LAYER.addChild(group);
			group.x = MapView.inst().roles[0].x - 150;
			group.y = MapView.inst().roles[0].y - 50*index - 100;
			egret.Tween.get(group).wait(index*300).to({x:group.x + 50,alpha:1},300,egret.Ease.backOut).call(()=>{
				egret.Tween.removeTweens(group);
			},this)
		}
	}
	private onBossDmg(evt:CustomEvt):void
	{
		if(evt.data.hp <= 0){evt.data.hp = 0;}
		this.hpCom.setHp(evt.data.hp);
	}
	private onChallengeBoss(evt:CustomEvt):void
	{
		let id:number = evt.data.id;
		this.hpCom.visible = true;
		let cfg:MonsterCfg = GameApp.inst().getMonInfoById(id);
		this.hpCom.setCfg(cfg);
	}
	private finish():void
	{
		this.hpCom.visible = false;
	}
	//------------------vj操作-------------------------
	private onVjStart():void{
		this.vj.alpha = 1;
		BattleCom.inst().startControl();
		this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
	}
	private angle:number;
	private onVjChange(e:egret.Event):void{
		this.angle = e.data
	}
	private moveState:boolean = false;
	private onEnterFrame():void{
		if(this.angle){
			
			this.moveState = true;
			// RoleAI.ins().moveEntity(this.angle);
			let offestX:number = Math.cos(this.angle)*8;
			let offestY:number = Math.sin(this.angle)*8;
			let speedX = MapView.inst().roles[0].x + offestX>>0;
			let speedY = MapView.inst().roles[0].y + offestY>>0;
			// let point: egret.Point = qmr.SceneModel.prototype.mainScene.globalToLocal(evt.stageX, evt.stageY);
			let xy:XY = GameMap.point2Grid(speedX,speedY);
			let moveable = GameMap.walkable(xy.y,xy.x);
			if(GameMap.walkable(xy.y,xy.x))
			{
				if(moveable == 2)
				{
					MapView.inst().roles[0].alpha = 0.5;
				}else{
					MapView.inst().roles[0].alpha = 1;
				}
				BattleCom.inst().controlRoleMove({x:speedX,y:speedY});
			}
		}
	}
	
	private onVjEnd():void{
		this.angle = null;
		this.moveState = false;
		this.vj.alpha = 0.5;
		BattleCom.inst().stopControl();
		// RoleAI.ins().removeMainEntity();
		this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
		this.exp_tiao.mask = this.exp_mack;
		
	}
	//--------------------------------------
	public close():void{
		this.removeTouchEvent(this.set_btn,this.setView);
	}
	public update()
	{
		this.exp_mack.width = (GameApp.inst().roleAttr.roleExp / GameApp.inst().roleAttr.roleMaxExp)*this.exp_tiao.width;
	}
	private openFunView(data:any)
	{
		let progress = this.getProgress();
		switch(data.data)
		{
			case "juese":
				if( this.guideOrder[progress] == "role" ) return ;
				console.log("打开角色");
				ViewManager.inst().open(RoleView);
				break;
			case "jineng":
				if( this.guideOrder[progress] == "skill" ) return ;
				console.log("打开技能");
				ViewManager.inst().open(SkillView);
				break;
			case "duanzao":
				if( this.guideOrder[progress] == "forge" ) return ;
				console.log("打开锻造");
				ViewManager.inst().open(ForgeView);
				break;
			case "beibao":
				console.log("打开背包");
				ViewManager.inst().open(BagView);
				break;
			case "fuben":
				if(GameApp.inst().sceneId == FUBEN.FUBEN_EXP || GameApp.inst().sceneId == FUBEN.FUBEN_GOLD || GameApp.inst().sceneId == FUBEN.FUBEN_STONE || GameApp.inst().sceneId == FUBEN.FUBEN_CHALLENGE)
				{
					UserTips.inst().showTips("请返回野外副本");
					return;	
				}
				ViewManager.inst().open( FubenView );
				break;
			case "boss":
				if(GameApp.inst().sceneId == FUBEN.FUBEN_EXP || GameApp.inst().sceneId == FUBEN.FUBEN_GOLD || GameApp.inst().sceneId == FUBEN.FUBEN_STONE || GameApp.inst().sceneId == FUBEN.FUBEN_CHALLENGE)
				{
					UserTips.inst().showTips("请返回野外副本");
					return;	
				}
				console.log("打开Boss");
				ViewManager.inst().open(BossView);
				break;
			case "shangcheng":
				console.log("打开商城");
				ViewManager.inst().open(ShopView);
				break;
			case "chenghao":
				ViewManager.inst().open( TitleView );
				console.log("打开称号");
				break;
			case "qiandao":
				if( this.guideOrder[progress] == "sign" ) return ;
				console.log("打开签到");
				ViewManager.inst().open( SignInView );
				break;
		}
	}

	private guideHandler():void {
		let progress = this.getProgress();
		switch( this.guideOrder[progress] ) {
			case "task":
				NoviceGuideView.setGuideLocal( "task" );
				break;
			case "sign":
				ViewManager.inst().open( SignInView );
				break;
			case "role":
				ViewManager.inst().open(RoleView);
				break;
			case "skill":
				ViewManager.inst().open(SkillView);
				break;
			case "forge":
				ViewManager.inst().open(ForgeView);
				break;
		}
	}

	private addGuide():void {
		let progress = this.getProgress();
		if( progress == null ) return ;
		let cfg = this.guideCfg[this.guideOrder[progress]];
		NoviceGuideView.showGuide( [cfg] , true , this );
	}

	private guideLocalChange():void {
		this.addGuide();
	}

	private getProgress():number {
		let progress:number = null;
		let local = NoviceGuideView.getGuideLocal();
		for( let i = 0 ; i < this.guideOrder.length; i ++ ) {
			if( local[ this.guideOrder[i] ] == false ) {
				progress = i;
				break;
			}
		}
		return progress;
	}

	private guideCfg = {
		"task":{
			x: 110*(StageUtils.inst().getWidth()/1334) + (StageUtils.inst().getWidth() > 1334 ? 50 : 0),
			y: 310*(StageUtils.inst().getHeight()/750),
			info: "接领任务可获得大量元宝和经验奖励",
			bg: 2,
			fun: this.guideHandler.bind( this ),
			target: "task",
			obj: this
		},
		"sign":{
			x: StageUtils.inst().getWidth()-270*(StageUtils.inst().getWidth()/1334),
			y: 40*(StageUtils.inst().getWidth()/1334),
			info: "每日打卡领取福利",
			bg: 0,
			fun: this.guideHandler.bind( this ),
			target: "sign",
			obj: this
		},
		"role":{
			x: StageUtils.inst().getWidth()/2 - 130*(StageUtils.inst().getWidth()/1334),
			y: StageUtils.inst().getHeight() - 55*(StageUtils.inst().getWidth()/1334),
			info: "此处查看角色详情、佩戴装备",
			bg: 1,
			fun: this.guideHandler.bind( this ),
			target: "role",
			obj: this
		},
		"skill":{
			x: StageUtils.inst().getWidth()/2 - 40*(StageUtils.inst().getWidth()/1334),
			y: StageUtils.inst().getHeight() - 55*(StageUtils.inst().getWidth()/1334),
			info: "在此升级技能,提升战斗实力",
			bg: 1,
			fun: this.guideHandler.bind( this ),
			target: "skill",
			obj: this
		},
		"forge":{
			x: StageUtils.inst().getWidth()/2 + 40*(StageUtils.inst().getWidth()/1334),
			y: StageUtils.inst().getHeight() - 55*(StageUtils.inst().getWidth()/1334),
			info: "锻造升级，提升装备基础属性",
			bg: 1,
			fun: this.guideHandler.bind( this ),
			target: "forge",
			obj: this
		}
	};

	private guideOrder: string[] = [
		"task" , "sign" , "role" , "skill" , "forge"
	]
}
ViewManager.inst().reg(MainView,LayerManager.UI_Main);