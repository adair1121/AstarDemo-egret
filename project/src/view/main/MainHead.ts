class MainHead extends BaseView
{
	private hp_tiao:eui.Image;
	private hp_mask:eui.Image;
	private mp_tiao:eui.Image;
	private mp_mask:eui.Image;

	private role_level:eui.Label;//人物等级
	private gold_label:eui.Label;//元宝
	private hp_numLabel:eui.Label;//血量显示
	private mp_numLabel:eui.Label;//法力显示
	private zhanli_label:eui.BitmapLabel;//战斗力数值
	private icon_img:eui.Image;
	private gold_add:eui.Image;

	private fireGroup: eui.Group;
	public constructor() 
	{
		super();
		this.skinName = "MainHeadSkin";
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	public add_glod()
	{
		console.log("chongzhi");
	}
	private onAddToStage()
	{
		if(egret.getOption("recharge"))
		{this.gold_add.visible=true;}else
		{
			this.gold_add.visible=false;
		}
		this.gold_add.addEventListener(egret.TouchEvent.TOUCH_TAP,this.add_glod,this);
		this.icon_img.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
			ViewManager.inst().open(RoleView);
		}.bind(this),this);
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.init();
		this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
		MessageManager.inst().addListener(CustomEvt.ROLE_HP_UPDATA, this.setHp, this);
		MessageManager.inst().addListener(CustomEvt.ROLE_MP_UPDATA, this.setMp, this);
	}
	private onRemoveFromStage()
	{
		this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
		this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
		MessageManager.inst().removeListener(CustomEvt.ROLE_HP_UPDATA, this.setHp, this);
		MessageManager.inst().removeListener(CustomEvt.ROLE_MP_UPDATA, this.setMp, this);
	}
	private init()
	{
		this.hp_mask.mask = this.hp_tiao;
		this.mp_mask.mask = this.mp_tiao;
		this.icon_img.source = `main_head_${GameApp.inst().roleAttr.roleJob}_${GameApp.inst().roleAttr.roleSex}_png`;
		this.hp_numLabel.text = GameApp.inst().roleAttr.roleHp + " / " + GameApp.inst().roleAttr.roleHp;;
		this.mp_numLabel.text = GameApp.inst().roleAttr.roleMp + " / " + GameApp.inst().roleAttr.roleMp;
		GameApp.inst().current_hp=GameApp.inst().roleAttr.roleHp;
		GameApp.inst().current_Mp=GameApp.inst().roleAttr.roleMp;
		GameApp.inst().current_total_hp=GameApp.inst().roleAttr.roleHp;
		GameApp.inst().current_total_Mp=GameApp.inst().roleAttr.roleMp;
		let eff = new MovieClip();
		eff.playFile( "resource/res/animate/power_fire" , -1 );
		eff.scaleX = eff.scaleY = 0.5;
		this.fireGroup.addChild( eff );
	}
	private update()
	{
		this.zhanli_label.text = "" + Math.ceil(GameApp.inst().roleAttr.rolePower);
		this.gold_label.text = "" + GameApp.inst().getGoldNum();
		this.role_level.text = "" + GameApp.inst().roleAttr.roleLevel;	
		this.gold_label.validateNow();
		this.gold_add.x=this.gold_label.x+this.gold_label.textWidth+5;	

		this.hp_numLabel.text = GameApp.inst().current_hp + " / " + GameApp.inst().current_total_hp;
		this.hp_mask.width = GameApp.inst().current_hp*(this.hp_tiao.width/GameApp.inst().current_total_hp);

		this.mp_numLabel.text = GameApp.inst().current_Mp + " / " + GameApp.inst().current_total_Mp;
		this.mp_mask.width = GameApp.inst().current_Mp*(this.mp_tiao.width/GameApp.inst().current_total_Mp);
	}
	private setHp(data:any)
	{		
		// this.hp_numLabel.text = data.data + " / " + GameApp.inst().roleAttr.roleHp;
		// this.hp_mask.width = data.data*(this.hp_tiao.width/GameApp.inst().roleAttr.roleHp);
	}
	private setMp(data:any)
	{
		// this.mp_numLabel.text = data.data + " / " + GameApp.inst().roleAttr.roleMp;
		// this.mp_mask.width = data.data*(this.mp_tiao.width/GameApp.inst().roleAttr.roleMp);
	}
}