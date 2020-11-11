interface RoleAttr {
    /**
     * 玩家名字
     */
    roleName:string; 
    /**
     * 玩家性别
     */
    roleSex:number;
    /**
     * 玩家职业
     */
    roleJob:number;
    /**
     * 玩家形象资源id
     */
    roleModelId:number;
    /**
     * 玩家武器资源id
     */
    roleWeaponId:number;
    /**
     * 玩家翅膀id
     */
    roleWingId:number;
    /**
     * 玩家使用称号id
     */
    roleTitleId :number;
    /**
     * 人物已拥有称号id
     */
    roleTitles:number[];
    /**
     * 玩家等级
     */
    roleLevel:number;
    /**
     * 玩家蓝量
     */
    roleMp:number;
    /**
     * 玩家血量
     */
    roleHp:number;
    /**
     * 玩家攻击力
     */
    roleAttack:number;
    /**
     * 玩家防御值
     */
    roleDef:number;
    /**
     * 玩家暴击值
     */
    roleCirt:number;
    /**
     * 玩家抗爆
     */
    role_kCirk:number;
    /**
     * 玩家闪避
     */
    roleDodge:number;
    /**
     * 玩家命中
     */
    roleHit:number;
    /**
     * 人物当前经验值
     */
    roleExp:number;
    /**
     * 当前人物最大经验值
     */
    roleMaxExp:number;
    /**
     * 人物头像资源id
     */
    roleHeadId:number;
    /**
     * 人物战力值
     */
    rolePower:number;
    /**
     * 人物技能等级集合(当前技能强化到的等级id)
     */
    roleSkillLevels:number[];

    /**
     * 人物锻造数据集合(当前强化到的装备槽等级id)
     */
    roleForginDatas:number[];
    /**
     * 人物装备(当前人物装备id)
     */
    roleEquips:number[];
    /**
     * 玩家击杀boss记录
     */
    roleKillBoss: number[];
}
