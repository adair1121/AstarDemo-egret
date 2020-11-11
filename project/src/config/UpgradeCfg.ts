interface UpgradeCfg {
	/**ID */
	id:number;
	/**等级 */
	roleLevel:number;
	/**职业 */
	roleJob:number;
	/**生命 */
	roleHp:number;
	/**魔法 */
	roleMp:number;
	/**攻击 */
	roleAttack:number;
	/**防御 */
	roleDef:number;
	/**暴击 */
	roleCirt:number;
	/**抗暴 */
	role_kCirk:number;
	/**命中 */
	roleHit:number;
	/**闪避 */
	roleDodge:number;
	/**升级最大经验 */
	roleMaxExp:number;
	/**人物形象id */
	roleModelId:string;
	/**人物武器形象id */
	roleWeaponId:string;
}