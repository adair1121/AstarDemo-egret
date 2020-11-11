interface MonsterCfg
{
	/**关卡id */
	id:number;
	/**序列帧id */
	sequence:string;
	/**怪物名字 */
	monsterName:string;
	/**怪物等级 */
	monterLev:number;
	/**怪物属性 */
	monterAttrs:string;
	/**怪物属性值 */
	monterValues:string;
	/**怪物数量*/
	monNum:number;
	/**bossID */
	bossID:number;
	/**副本类型 */
	copy:number;
	/**场景名称 */
	sceneName:string;
	/**地图ID */
	mapID:string;
	/**经验值 */
	exp:string;
	/**元宝掉落区间 */
	gold:string;
	/**强化石掉落区间 */
	stone:string;
	/**掉落装备ID */
	dropID:string;
	/**数量 */
	dropNum:string;
	/**装备掉率 */
	dropRate:string;
	/**血量值 */
	hp:number;
	/**蓝量值 */
	 sp:number;
	/**攻击值 */
	 attack:number;
	/**防御值 */
	 def:number;
	/**暴击值 */
	 cirt:number;
	/**抗暴值 */
	 kcirk:number;
	/**命中值 */
	 hit:number;
	/**闪避值 */
	 dodge:number;
	/**视野距离 */
	 viewPortDis?:number
	/**攻击距离 */
	 atkDis:number;
	/**移动速度 */
	 spd:number;

}