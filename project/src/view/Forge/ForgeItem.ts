class ForgeItem extends BaseView {
    private _current_id:number=0;
    private _level_label:eui.Label;
    private forge_down:eui.Image;
    private forge_up:eui.Image;
    private image_item:eui.Image;
    private _level:number=0;
	constructor(current_id:number,level:number) {	
		super();
        this._current_id=current_id;
        this._level=level;
		this.skinName = `${egret.getQualifiedClassName(this)}Skin`;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.initData,this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.remove,this);
        this.image_item.source=RES.getRes(`forgeicon_${this._current_id+1}_png`);
        this.addTouchEvent(this.forge_down,this.touch_tap,true);
	}
    touch_tap()
    {
        MessageManager.inst().dispatch(CustomEvt.FORGE_CLICK_INFO,{id3:this._current_id});
    }
    setTouch(touch:boolean)
    {
        touch?this.forge_up.visible=true:this.forge_up.visible=false;
    }
    initData()
    {
        this._level==0?this._level_label.text=``:this._level_label.text=`${this._level}`;
    }

    refreshInitData(level:number)
    {
        this._level=level;
        this._level==0?this._level_label.text=``:this._level_label.text=`${this._level}`;
    }

    remove()
    {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.initData,this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.remove,this);
    }
}