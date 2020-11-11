interface ItemAttr{
	/**id */
	id:number;
	/**基础售价 */
	baseCost:number;
	/**类型 0为物品 1为装备 */
	type:number;
	/**装备的等级 */
	elevel:number;
	/**icon图标 */
	iconRes:string;
	/**质量 */
	quality:number;
	/**部位 */
	pos:number;
	/**攻击装备战力 */
	atk:number;
	/**数量 */
	ownnum:number;
	/**生命 */
	hp:number;
	/**名称 */
	name:string
	/**描述 */
	desc?:string,
	/**增加的序价值 */
	addValue?:number;
	/**增加的属性id 0防御 1:破甲 2:暴击 3:抗爆 4:闪避 5:命中 */
	addindex?:number;
	/**唯一实例id */
	insId?:string;
}