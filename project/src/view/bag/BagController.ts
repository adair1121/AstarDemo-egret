class BagController {
	/**单利模式 */
	private static _instance: BagController;
	public static inst(): BagController {
		if (BagController._instance == null) {
			BagController._instance = new BagController();
			BagController._instance.initScene();
		}
		return BagController._instance;
	}
	public constructor() {
	}
	private model: BagModel;
	private view: BagView;
	private initScene() {
		this.view = new BagView();
		this.model = new BagModel();
		this.model.setData(RES.getRes("itemData_json"));
	}

	public open(...param) {
		console.log("打开背包2");
		this.view.open();
	}

	public close(...param) {
		this.view.close();
	}

	/**将物品添加到背包 */
	private addItemToBagById(_id: number) {

	}

	/**将物品移除背包 */
	private removeItemFromBag(_obj: { id, num }) {

	}

	/**根据等级获取背包格子数量 */
	public getGridByLevel(_level: number) {

	}

	/**获取背包模型数据*/
	public getBagData(): BagModel {
		return this.model;
	}

	/**根据id获取表数据 */
	public getTableData(_id: number) {
		let data = this.model.getData();
		for (let i = 0; i < data.length; i++) {
			if (data[i].itemId == (_id + "")) {
				return data[i];
			}
		}
		return null;
	}

	public get getModel() {
		return this.model;
	}

	/**获取无用武器 */
	public getLowWeapons(): { itemId, itemNum, type }[] {
		let arr = [];
		var bagData = GameApp.inst().bagData;
		var role = [];
		let a = GameApp.inst().roleAttr.roleEquips;
		for (let n = 0; n < a.length; n++) {
			if (a[n] && a[n] != 0)
				role.push(a[n]);
		}
		role = this.getMostSevere(role);
		for (let i = 0; i < bagData.length; i++) {
			let bagData1 = this.getTableData(bagData[i].itemId);
			if (bagData1) {
				for (let j = 0; j < role.length; j++) {
					let roleData = this.getTableData(role[j]);
					if (roleData && roleData.equipPos == bagData1.equipPos) { //判断装备位置是否相等
						if (roleData.quality > bagData1.quality) { // 判断品质大小 背包品质小
							arr.push({ itemId: bagData[i].itemId, itemNum: bagData[i].itemNum, type: 1 });
							break;
						}
						else if (roleData.quality == bagData1.quality) {
							if (roleData.starLev > bagData1.starLev) {// 判断阶位大小 背包阶位小
								arr.push({ itemId: bagData[i].itemId, itemNum: bagData[i].itemNum, type: 1 });
								break;
							}
							else if (roleData.starLev == bagData1.starLev && bagData[i].itemNum > 1) {
								arr.push({ itemId: bagData[i].itemId, itemNum: bagData[i].itemNum - 1, type: 1 });
								break;
							}
						}
					}
				}
			}
		}
		return arr;
	}

	/**比较两个武器的优劣 1:参数1优 2:参数2优 0:相等*/
	private prosAndCons(_weapons1, _weapons2) {
		if (_weapons1) {
			if (_weapons1.quality > _weapons2.quality) { // 判断品质大小 背包品质小
				return 1;
			}
			else if (_weapons1.quality == _weapons2.quality) {
				if (_weapons1.starLev > _weapons2.starLev) {// 判断阶位大小 背包阶位小
					return 1;
				}
				else if (_weapons1.starLev == _weapons2.starLev) {
					return 0;
				}
				else {
					return 2;
				}
			}
			else {
				return 2;
			}
		}
		return null;
	}

	/**判断如果人物没有装备武器 获取最厉害的武器 用于熔炼比较*/
	private getMostSevere(role) {
		let arr = role;
		let zhuangbei = [0, 1, 2, 3, 4, 5, 6, 7];
		var bagData = GameApp.inst().bagData;
		for (let i = 0; i < zhuangbei.length; i++) {
			if (this.isArr(role, zhuangbei[i]) == false) {
				let item = null;
				for (let j = 0; j < bagData.length; j++) {
					let bagData1 = this.getTableData(bagData[j].itemId);
					if (bagData1 && zhuangbei[i]== bagData1.equipPos) {
						if (item) {
							let itemData = this.getTableData(item.itemId);
							if (this.prosAndCons(itemData, bagData1) == 2) {
								item = bagData[j];
							}
						}
						else {
							item = bagData[j];
						}
					}
				}
				if (item) {
					arr.push(item.itemId);
					item = null;
				}
				
			}
		}
		return arr;
	}
	private isArr(_role, equipPos: number) {
		for (let i = 0; i < _role.length; i++) {
			let roleData = this.getTableData(_role[i]);
			if(roleData.equipPos == equipPos) {
				return true;
			}
		}
		return false;
	}

	/**解析背包数据 衣服类物品不可叠加 equipPos*/
	public bagData(_data) {
		let arr = [];
		for (let i = 0; i < _data.length; i++) {
			let uiData = BagController.inst().getTableData(_data[i].itemId);
			if (uiData.equipPos != -1) {
				for (let j = 0; j < _data[i].itemNum; j++) {
					arr.push(_data[i]);
				}
			}
			else {
				arr.push(_data[i]);
			}
		}
		return arr;
	}

	/**根据装备优劣排序 */
	public weaponsSorting(_data) {
		// this.fangzhi(_data);
		for (let i = 0; i < _data.length - 1; i++) {
			let bagData1 = this.getTableData(_data[i].itemId);
			for (let j = i + 1; j < _data.length; j++) {
				let bagData2 = this.getTableData(_data[j].itemId);
				if (this.prosAndCons(bagData1, bagData2) == 2) {
					let item = _data[i];
					_data[i] = _data[j];
					_data[j] = item;
				}
			}
		}
		return _data;
	}

	//如果不是装备 则放入最下面
	private fangzhi(_data) {
		for (let i = 0; i < _data.length - 1; i++) {
			let bagData1 = this.getTableData(_data[i].itemId);
			if (bagData1.itemType != 1) {
				for (let n = _data.length - 1; n >= 0; n--) {
					let bagData3 = this.getTableData(_data[n].itemId);
					if (bagData3.itemType == 1) {
						let item = _data[i];
						_data[i] = _data[n];
						_data[n] = item;
						// for (let j = _data.length - 1; j > n; j--) {
						// 	let bagData2 = this.getTableData(_data[j].itemId);
						// 	if(bagData2.itemId == bagData1.itemId && _data[n].itemNum < _data[j].itemNum) {
						// 		let item = _data[j];
						// 		_data[j] = _data[n];
						// 		_data[n] = item;
						// 		break;
						// 	}
						// }
						break;
					}
				}
			}
		}
	}

	/**数据处理 装备数量最大99 */
	public weaponsNum(_data) {
		let arr = [];
		for (let i = 0; i < _data.length; i++) {
			let bagData1 = this.getTableData(_data[i].itemId);
			if(bagData1.itemType != 1) {
				arr.push({ itemId: _data[i].itemId, itemNum: _data[i].itemNum, type: 0 });
				continue;
			}
			let yushu = Math.ceil(_data[i].itemNum / 99);
			for (let j = yushu-1; j >= 0; j--) {
				if (yushu == j + 1) {
					arr.push({ itemId: _data[i].itemId, itemNum: _data[i].itemNum - (j * 99), type: 0 });
				}
				else {
					arr.push({ itemId: _data[i].itemId, itemNum: 99, type: 0 });
				}
			}
		}
		return arr;
	}

}