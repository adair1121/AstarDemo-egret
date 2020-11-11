interface SkillData {
    /**
     * 技能ID
     */
    skillId:number; 
    /**
     * 技能模型id
     */
    skillModelId:number;
    /**
     * 技能类别
     */
    skillType:number;
    /**
     * 下一级id
     */
    nextid:number;
    /**
     * 人物开启等级
     */
    open:number;
    /**
     * 技能等级
     */
    skillLev:number;
    /**
     * 技能图标id
     */
    iconId:string;
    /**
     * 职业ID
     */
    roleJobId:number;
    /**
     * 技能名字
     */
    skillName:string;
    /**
     * 技能描述
     */
    skillDes:string;
    /**
     * 技能攻击力
     */
    skillAtk:number;
    /**
     * 技能冷却时间
     */
    skillCD:number;
    /**
     * 技能消耗蓝量
     */
    skillMP:number;
    /**
     * 技能升级价格
     */
    price:number;
}