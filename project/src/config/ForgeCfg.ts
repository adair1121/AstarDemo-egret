interface ForgeCfg
{
	/**锻造id */
	id:number;
	/**锻造下一级id */
	nid:number;
	/**锻造消耗物品id */
	itemId:number;
	/**锻造消耗物品数量 */
	cost:number;
	/**锻造提升的属性 */
	attr:string;
	/**锻造提升的value */
	value:string;
	/**当前锻造的装备部位 */
	equipPos:number;
}