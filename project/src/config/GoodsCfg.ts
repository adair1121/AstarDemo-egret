interface GoodsData
{
	/**物品ID */
	itemId:number;
	/**模型id*/
	modelId:number;
	/**物品名称 */
	itemName:string;
	/**品质 */
	quality:number;
	/**阶位 */
	starLev:string;
	/**物品类型 */
	itemType:string;
	/**装备位置 */
	equipPos:number;
    /**佩戴等级 */
	wearLevel:number;
    /**拥有数量 */
	ownNum:number;
    /**装备属性 */
	attrs:string;
    /**属性对应值 */
	values:number;
    /**回收费用 */
	melting:number;
    /**商会出售数量 */
	number:number;
    /**商会元宝价格 */
	price:number;
}