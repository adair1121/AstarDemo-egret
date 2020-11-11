/**技能组件 */
class SkillComponent extends BaseClass{
	
	public constructor() {
		super();
	}
	public static inst():SkillComponent{
		let _inst:SkillComponent = super.single<SkillComponent>();
		return _inst
	}
	/**清除所有技能特效 */
	public clearSkillEff():void
	{
		for(let i:number = 0;i<LayerManager.MAP_LAYER.numChildren;i++)
		{
			let child = LayerManager.MAP_LAYER.getChildAt(i);
			if(child instanceof MovieClip && child.itemName == "skill")
			{
				if(child && child.parent){child.parent.removeChild(child);i-=1}
			}
		}
	}
	/**释放单个技能 */
	public releaseSingleSkill(skillId:number,_monster?:MonsterEntity):boolean
	{
		if(MapView.inst().roles.length <=0){return;}
		
		let skillCfg:SkillData = GameApp.inst().getSkillById(skillId);
		if(GameApp.inst().roleAttr.roleMp < skillCfg.skillMP)
		{//当前技能蓝量不够
			console.log(skillCfg.skillModelId+"蓝量不足")
			return false
		}


		let mon:MonsterEntity = (MapView.inst().roles[0] as SoldierEntity).atkTar;
		if(_monster)
		{
			mon = _monster;
		}
		if(!mon || (mon && mon.isDead) ){return false}
		console.log("释放技能------>"+skillCfg.skillModelId)
		if(_monster)
		{
			MessageManager.inst().dispatch(CustomEvt.SKILL_CD,{skillId:skillId})
		}
		let angle:number = Math.atan2(mon.y - MapView.inst().roles[0].y,mon.x - MapView.inst().roles[0].x)*180/Math.PI;
		(MapView.inst().roles[0] as SoldierEntity).calculEntityDic(angle);

		SkillItem.inst().setCd(skillCfg.skillModelId);
		let skillAtk:number = skillCfg.skillAtk + ((Math.random()*50)>>0);
		GameApp.inst().playSound(0);
		if(skillCfg.skillType == SkillType.DIRECT)
		{
			//方向性技能
			let dic:number = (MapView.inst().roles[0] as SoldierEntity).dic;
			let mc:MovieClip = new MovieClip();
			mc.playFile(`${SKILL_EFF}skill${skillCfg.skillModelId}${dic}`,1,null,true);
			mc.scaleX = (MapView.inst().roles[0] as SoldierEntity).scale;
			LayerManager.UNIT_LAYER.addChildAt(mc,LayerManager.UNIT_LAYER.numChildren-1);
			mc.x = MapView.inst().roles[0].x;
			mc.y = MapView.inst().roles[0].y;
			let timeout = setTimeout(function() {
				clearTimeout(timeout);
				//mon.reduceHp(skillAtk,null,2);
			}, 600);
			mon.reduceHp(skillAtk,null,2);
		}else if(skillCfg.skillType == SkillType.NO_DIRECT){
			//无方向性技能
			let self = this;
			let mc:MovieClip = new MovieClip();
			mc.playFile(`${SKILL_EFF}skill${skillCfg.skillModelId}`,1,null,true);
			LayerManager.UNIT_LAYER.addChildAt(mc,LayerManager.UNIT_LAYER.numChildren-1);
			mc.x = mon.x;
			mc.y = mon.y;
			let timeout = setTimeout(function() {
				self.judgeDmg(mc,skillAtk);
			}, 600);
			
		}else if(skillCfg.skillType == SkillType.FLY)
		{
			//方向性飞行技能
			let mc:MovieClip = new MovieClip();
			let dic:number = (MapView.inst().roles[0] as SoldierEntity).dic;
			mc.playFile(`${SKILL_EFF}skill${skillCfg.skillModelId}${dic}`,-1,null);
			mc.scaleX = (MapView.inst().roles[0] as SoldierEntity).scale;
			LayerManager.UNIT_LAYER.addChildAt(mc,LayerManager.UNIT_LAYER.numChildren-1);
			mc.x = MapView.inst().roles[0].x;
			mc.y = MapView.inst().roles[0].y;
			egret.Tween.get(mc).to({x:mon.x,y:mon.y},300).call(()=>{
				egret.Tween.removeTweens(mc);
				//mon.reduceHp(skillAtk,null,2);
				if(mc && mc.parent)
				{
					mc.parent.removeChild(mc);
				}
			},this)
			mon.reduceHp(skillAtk,null,2);
		}
		(MapView.inst().roles[0] as SoldierEntity).changeMp(skillCfg.skillMP);
		return true;
	}
	public releaseSkill(mon:MonsterEntity,skillId?:number):boolean{
		
		//---mark down---- 需要根据数据表来获取当前已经开启的技能 以及冷却数据
		let skills:SkillData[] = GameApp.inst().getLockSkills();
		
		for(let i:number = 0;i<skills.length;i++){
			SkillItem.inst().setCdCfg(skills[i].skillModelId,skills[i].skillCD)
			if(!SkillItem.inst().isInCd(skills[i].skillModelId)){
				//当前技能没有在cd中可以使用
				// if(!GameApp.guilding){
				this.releaseSingleSkill(skillId?skillId:skills[i].skillId,mon);
				// this[`playSkillEff${skills[i]}`]();
				return true;
			}
		}
		return false;
	}
	
	private judgeDmg(skill:MovieClip,dmg:number):void{
		let mons:MonsterEntity[] = MapView.inst().monsters;
		for(let i:number = 0;i<mons.length;i++){
			let distance:number = egret.Point.distance(new egret.Point(skill.x,skill.y),new egret.Point(mons[i].x,mons[i].y));
			if(distance <= 150)
			{
				mons[i].reduceHp(dmg,null,2);
			}
		}
	}
}
class SkillItem extends BaseClass{
	private skillCdCfg:any = {}
	private cdState:any = {}
	private skillCd:any = {};
	public constructor() {
		super();
	}
	/**设置cd配置 */
	public setCdCfg(skillModelId,value):void
	{
		if(!this.skillCdCfg[skillModelId])
		{
			this.skillCdCfg[skillModelId] = value;
			this.cdState[skillModelId] = false;
		}
	}
	public static inst():SkillItem{
		
		let _inst:SkillItem = super.single<SkillItem>();
		return _inst
	}
	public setCd(skillId:number):void{
		this.cdState[skillId] = true;
		this.skillCd[skillId] = this.skillCdCfg[skillId];
		let self = this;
		let timeout = setInterval(function(id) {
			self.skillCd[id] -= 1;
			if(self.skillCd[id] <= 0){
				self.skillCd[id] = 0;
				self.cdState[id] = false;
				clearInterval(timeout);
			}
		}, 1000,skillId);
	}
	public isInCd(skillId:number):boolean{
		// if(GameApp.guilding){return false}
		return this.cdState[skillId];
	}
}