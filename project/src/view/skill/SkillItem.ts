class SKILLItem extends BaseView {
    private _skill_id:number=0;
    private skill_icon:eui.Image;
    private skill_bg:eui.Image;
    private skill_name:eui.Label;
    private skill_lev:eui.Label;
    private open_state:boolean=false;
    private skill_up:eui.Image;
    private red_icon:eui.Image;
	constructor(skill_id:number) {	
		super();
        this._skill_id=skill_id;
		this.skinName = `${egret.getQualifiedClassName(this)}Skin`;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.initData,this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.remove,this);
        this.make_suo();
	}
    refresh_Red(money:number)
    {
        if(this.open_state)
        GameApp.inst().getGoldNum()>=money?this.red_icon.visible=true:this.red_icon.visible=false;
    }
    /**
     * 处理显示是否解锁
     */
    make_suo()
    {
        for(let i=0;i<GameApp.inst().getAllSkills().length;i++)
        {
            let skill:SkillData=GameApp.inst().getAllSkills()[i];
            if((this._skill_id+1+(GameApp.inst().getRoleJob()-1)*4)>=10)
            {
                if(skill.iconId==`kill0${this._skill_id+1+(GameApp.inst().getRoleJob()-1)*4}`&&skill.skillLev==1)
                {
                    let level:number=GameApp.inst().getRoleLevel();
                    if(level>=skill.open)
                    {
                        this.open_state=true;
                        this.setOpenState(true);
                        this.initData(this._skill_id);
                        break;
                    }
                }
            }else
            {
                if(skill.iconId==`kill00${this._skill_id+1+(GameApp.inst().getRoleJob()-1)*4}`&&skill.skillLev==1)
                {
                    let level:number=GameApp.inst().getRoleLevel();
                    if(level>=skill.open)
                    {
                        this.open_state=true;
                        this.setOpenState(true);
                        this.initData(this._skill_id);
                        break;
                    }
                }
            }
        }
    }
    setOpenState(state:boolean)
    {
        if(state)
        this.addTouchEvent(this.skill_bg,this.click_btn,true);
    }

    initData(id:number)
    {
        if(id==this._skill_id)
        {
            this.skill_up.visible=true;
        }else
        {
            this.skill_up.visible=false;
        }
        if(this.open_state)
        {
            for(let i=0;i<GameApp.inst().getAllSkills().length;i++)
            {
                let skill:SkillData=GameApp.inst().getAllSkills()[i];
                let level:number[]=GameApp.inst().getSkillLevels();
                // if(parseInt(skill.iconId.substr(skill.iconId.length-2,2))%4=10)
                // {
                    if((parseInt(skill.iconId.substr(skill.iconId.length-2,2))-1)%4==this._skill_id&&level[this._skill_id]==skill.skillLev&&skill.roleJobId==GameApp.inst().getRoleJob())
                    {
                        this.skill_name.text=skill.skillName;
                        this.skill_icon.source=RES.getRes(`skillicon${parseInt(skill.iconId.substr(skill.iconId.length-2,2))}_png`);
                        this.skill_lev.text=`技能等级：${skill.skillLev}级`;
                        let skill2:SkillData=GameApp.inst().getAllSkills()[i+1];
                        if(GameApp.inst().getRoleLevel()>skill.skillLev)
                        {
                            this.refresh_Red(skill2.price);
                        }else
                        {
                            this.red_icon.visible=false;
                        }
                        break;
                    }
                // }else
                // {
                //     if(parseInt(skill.iconId.substr(skill.iconId.length-1,1))==parseInt(`${(GameApp.inst().getRoleJob()-1)*4+this._skill_id+1}}`)&&level[this._skill_id]==skill.skillLev)
                //     {
                //         this.skill_name.text=skill.skillName;
                //         this.skill_icon.source=RES.getRes(`skillicon${skill.iconId.substr(skill.iconId.length-1,1)}_png`);
                //         this.skill_lev.text=`技能等级：${skill.skillLev}级`;
                //         break;
                //     }
                // }
            }
        }else
        {
            this.skill_icon.source=RES.getRes(`skill_suo_png`);
            for(let i=0;i<GameApp.inst().getAllSkills().length;i++)
            {
                let skill:SkillData=GameApp.inst().getAllSkills()[i];
                let level:number[]=GameApp.inst().getSkillLevels();
                // if(((GameApp.inst().getRoleJob()-1)*4+this._skill_id+1)>=10)
                // {
                    if((parseInt(skill.iconId.substr(skill.iconId.length-2,2))-1)%4==this._skill_id&&level[this._skill_id]==skill.skillLev&&skill.roleJobId==GameApp.inst().getRoleJob())
                    {
                        this.skill_name.text=skill.skillName;
                        this.skill_lev.text=`未开启`;
                        this.red_icon.visible=false;
                        break;
                    }
                // }else
                // {
                //     if(parseInt(skill.iconId.substr(skill.iconId.length-1,1))==parseInt(`${(GameApp.inst().getRoleJob()-1)*4+this._skill_id+1}}`)&&level[this._skill_id]==skill.skillLev)
                //     {
                //         this.skill_name.text=skill.skillName;
                //         this.skill_lev.text=`未开启`;
                //         break;
                //     }
                // }
            }
        }
    }

    click_btn()
    {
        MessageManager.inst().dispatch(CustomEvt.SKILL_CLICK_INFO,{id:this._skill_id});
    }
    remove()
    {
        this.removeTouchEvent(this.skill_bg,this.click_btn);
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.initData,this);
    }
}