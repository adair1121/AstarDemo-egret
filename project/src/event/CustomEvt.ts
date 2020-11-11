class CustomEvt extends egret.Event{

	/**游戏loading完成 */
	public static readonly GAMELOADINGEND:string = 'gameLoadingEnd';

	/**引导点击帮助 */
	public static GUIDE_CLICK_INFO:string = "guide_click_info";

	/**挑战boss完成 */
	public static CHALLENGE_FINISH:string = "challenge_finish";
	/**挑战boss */
	public static CHALLENGE_BOSS:string = "challenge_boss";
	/**boss  伤害*/
	public static BOSS_DMG:string = "boss_dmg";
	/**boss 被击杀 */
	public static BOSS_KILLED:string = "boss_killed";
	/**复活 */
	public static REBIRTH:string = "rebirth";

	/**技能信息 */
	public static SKILL_CLICK_INFO:string = "SKILL_CLICK_INFO";

	/**技能信息 */
	public static FORGE_CLICK_INFO:string = "FORGE_CLICK_INFO";
	/**技能伤害 */
	public static SKILL_DMG:string = "SKILL_DMG";
	/**技能cd */
	public static SKILL_CD:string = "skill_cd";

	/**摇杆操作 */
	public static VJ_START:string = "vj_start";
	public static VJ_MOVE:string = "vj_move";
	public static VJ_END:string = "vj_end";

	/**打开功能模块 */
	public static OPEN_FUN_VIEW:string = 'OPEN_FUN_VIEW';
	/**一键换装 */
	public static ZHUANG_BEI:string = 'ZHUANG_BEI';
	/**查看装备信息 */
	public static ZHUANGBEI_TIP:string = 'ZHUANGBEI_TIP';
	/**人物升级 */
	public static ROLE_SHENGJI:string = 'ROLE_SHENGJI';
	/**人物经验刷新 */
	public static ROLE_EXPCHANGE:string = 'ROLE_EXPCHANGE';
	/**人物属性变化 */
	public static ROLE_ZHUANGBEI_DATA:string = `ROLE_ZHUANGBEI_DATA`;
	/**头像血量变化 */
	public static ROLE_HP_UPDATA:string = `ROLE_HP_UPDATA`;
	/**头像蓝量变化 */
	public static ROLE_MP_UPDATA:string = `ROLE_MP_UPDATA`;
	/**新手引导 */
	public static GUIDE_DATA:string = 'GUIDE_DATA';

	/**商城点击item购买 */
	public static SHOP_CLICK_BUYBTN:string = "shop_click_buyBtn";
	private _data:any;
	public constructor(type: string,data:any = null, bubbles: boolean = false, cancelable: boolean = false) {
		super(type, bubbles, cancelable);
		this._data = data;
	}
	public get data():any{
		return this._data;
	}

	/**称号界面选择 */
	public static TITLE_SELECT:string = "TITLE_SELECT";

	/**Boss界面选择 */
	public static BOSS_SELECT:string = "BOSS_SELECT";

	/** 副本时间用尽 */
	public static FUBEN_TIME_OVER:string = "FUBEN_TIME_OVER";

	/** 引导存储改变 */
	public static GUIDE_LOCAL_CHANGE:string = "GUIDE_LOCAL_CHANGE";

	/** 欢迎界面关闭 */
	public static WELCOME_CLOSE:string = "WELCOME_CLOSE";

	/** 数据发生改变，设置红点提示 */
	public static RESET_RED_POINT: string = "SELECT_RED_POINT";
	/**切换场景 */
	public static SWITCH_SCENE:string = "SWITCH_SCENE";
	/**添加背包检测 */
	public static ADD_BAG:string = 'ADD_BAG';
	/**功能按钮复位 */
	public static BTN_POS_FUWEI:string = 'BTN_POS_FUWEI';
	/**去除引导遮罩 */
	public static REMOVE_GUIDE_MASK:string = 'REMOVE_GUIDE_MASK';
	/**角色等级提升 */
	public static ROLE_LEVEL_UPGRADE:string = 'ROLE_LEVEL_UPGRADE';
	/**可更换装备 */
	public static MAIN_RESET_EQUIP:string = 'MAIN_RESET_EQUIP';
}