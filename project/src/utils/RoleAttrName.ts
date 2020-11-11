class RoleAttrName {

    public static attrToName( attr: any ): string {
        return RoleAttrName.attrInfoName[attr];
    }

    public static attrName = [
        "roleHp",
        "roleMp",
        "roleAttack",
        "roleDef",
        "roleCirt",
        "role_kCirk",
        "roleDodge",
        "roleHit",
    ]

    public static attrInfoName = {
        "roleHp":"生命",
        "roleMp":"魔法",
        "roleAttack":"攻击",
        "roleDef":"防御",
        "roleCirt":"暴击",
        "role_kCirk":"抗暴",
        "roleDodge":"闪避",
        "roleHit":"命中",
    };

    public static getAdd( upgradeCfg: UpgradeCfg ):any[] {
        let cfgArr = [];
        for( let i = 0 ; i < RoleAttrName.attrName.length ; i ++ ) {
            let attrName = RoleAttrName.attrName[i];
            let cfg = {
                name: RoleAttrName.attrInfoName[attrName],
                num:upgradeCfg[attrName] - GameApp.inst().roleAttr[attrName]
            }
            cfgArr.push( cfg );
        }
        return  cfgArr;
    }
}