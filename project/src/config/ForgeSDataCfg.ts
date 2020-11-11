interface ForgeSData
{
	/**锻造id */
	id:number;
	/**等级显示 */
	level:number;
	/**下一锻造id */
	nid:number;
    /** 部位 */
    equipPos:number;
	/**强化石ID */
	itemId:number;
	/**消耗强化石量 */
    itemCost:number;
    /**增加属性 */
	attrs:string;
	/**锻造提升的value */
	values:string;
}