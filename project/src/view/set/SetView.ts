class SetView extends BaseEuiView{
	/**
	 * 关闭按钮
	 */
	private close_btn:eui.Image;
    private group_1:eui.Group;
    private group_11:eui.Group;
    private group_2:eui.Group;
    private group_22:eui.Group;
	/**
	 * 展示人物界面
	 */
    public open(...param):void
	{
		this.addTouchEvent(this.close_btn,this.onTap,true);
        this.addTouchEvent(this.group_1.$children[0],this.onTap,true);
        this.addTouchEvent(this.group_11.$children[0],this.onTap,true);
        this.addTouchEvent(this.group_2.$children[0],this.onTap,true);
        this.addTouchEvent(this.group_22.$children[0],this.onTap,true);
        this.setState();
	}
	setState()
    {
        console.log(GameApp.inst().music_state+"=="+GameApp.inst().sound_state);
        GameApp.inst().music_state==1?this.group_1.$children[1].visible=true:this.group_1.$children[1].visible=false;
        GameApp.inst().music_state==1?this.group_11.$children[1].visible=false:this.group_11.$children[1].visible=true;
        GameApp.inst().sound_state==1?this.group_2.$children[1].visible=true:this.group_2.$children[1].visible=false;
        GameApp.inst().sound_state==1?this.group_22.$children[1].visible=false:this.group_22.$children[1].visible=true;
    }
	private onTap(evt:egret.TouchEvent):void
	{
		switch(evt.target)
		{
			case this.close_btn:
				ViewManager.inst().close(SetView);
			break;
            case this.group_1.$children[0]:
                if(GameApp.inst().music_state==0)
                {
                    GameApp.inst().music_state=1;
                    GameApp.inst().playMusice();
                }
                this.setState();
            break;
            case this.group_11.$children[0]:
                if(GameApp.inst().music_state==1)
                {
                    GameApp.inst().music_state=0;
                    GameApp.inst().playMusice();
                }
                this.setState();
            break;
            case this.group_2.$children[0]:
                if(GameApp.inst().sound_state==0)
                {
                    GameApp.inst().sound_state=1;
                    
                }
                this.setState();
            break;
            case this.group_22.$children[0]:
                if(GameApp.inst().sound_state==1)
                {
                    GameApp.inst().sound_state=0;
                    
                }
                this.setState();
            break
        }
	}
	
	public close():void
	{
		this.removeTouchEvent(this.close_btn,this.onTap);
        this.removeTouchEvent(this.group_1,this.onTap);
        this.removeTouchEvent(this.group_11,this.onTap);
        this.removeTouchEvent(this.group_2,this.onTap);
        this.removeTouchEvent(this.group_2,this.onTap);
	}
	
}
ViewManager.inst().reg(SetView,LayerManager.UI_Pop);