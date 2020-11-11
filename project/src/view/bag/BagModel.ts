class BagModel {
	public constructor() {
	}

	// private bagData = [];
	// public getBagAll() {
	// 	return this.bagData;
	// }
	// /**直接赋值 */
	// public setBagAll(_data) {
	// 	this.bagData = _data;
	// }

	private data = null;
	/**背包数据 */
	public setData(_data) {
		this.data = _data;
	}
	public getData() {
		return this.data;
	}

	/**背包最大空间 */
	public getKongjain() {
		return GameDataManager.instance.getStorage(LocalStorageEnum.BAG_DATA + "kongjian", 80);
	}
	/**背包扩容空间 */
	public setKongjain(_value: number) {
		GameDataManager.instance.setStorage(LocalStorageEnum.BAG_DATA + "kongjian", this.getKongjain() + _value);
	}
}