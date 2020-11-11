class SkillButton extends BaseView {
    private skill_btn:eui.Image;
    private skill_label:eui.Label;

    private skill_group:eui.Group;

    /**
     * 回调函数
     */
    private _callBack:Function=null;
	constructor() {	
		super();
		this.skinName = `${egret.getQualifiedClassName(this)}Skin`;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.initData,this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.remove,this);
	}
    /**
     * 设置回调
     */
    setCallBack(callBack:Function,str:string,source:string=null)
    {
        this._callBack=callBack;
        //this.skill_btn.source=RES.getRes(`${source}`);
        source? this.skill_btn.source=RES.getRes(`${source}`):null;
        GameApp.inst().make_label_center(this.skill_label,str);
    }

    initData()
    {
        this.addTouchEvent(this.skill_group,this.click_btn,true);
    }

    click_btn()
    {
        this._callBack?this._callBack():null;
    }
    remove()
    {
        this.removeTouchEvent(this.skill_group,this.click_btn);
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.initData,this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.remove,this);
    }
}