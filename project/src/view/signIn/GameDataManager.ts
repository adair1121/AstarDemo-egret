
/**游戏数据管理
 * 
 */
class GameDataManager {
	/**单利模式 */
	private static _instance: GameDataManager;
	public static get instance(): GameDataManager {
		if (GameDataManager._instance == null) {
			GameDataManager._instance = new GameDataManager();
		}
		return GameDataManager._instance;
	}
	/**
    *存储stage  1标签 2存储的数值
    */
	public setStorage(name: string, Stage: number) {  //存储
		var userStage: number = Stage;
		egret.localStorage.setItem(name, userStage.toString());
		return userStage;
	}

	/**读取数据 1标签 2默认值(如果读不到数据会使用默认值) */
	public getStorage(name: string, initValue: number = 0) {////读取
		var storageStage: string = egret.localStorage.getItem(name);
		var userStage: number = initValue;
		if (storageStage != null && storageStage != "" && storageStage != "NaN") {
			userStage = parseInt(storageStage);
		}
		return userStage;
	}

	/**储存数组 */
	public storageArray(name: string, data) {
		for (let i = 0; i < data.length; i++) {
			this.setStorage(name + i, data[i]);
		}
	}
	/**读取数组 */
	public readArray(name: string, len: number, initValue: number) {
		let arr = [];
		for (let i = 0; i < len; i++) {
			arr.push(this.getStorage(name + i, initValue));
		}
		return arr;
	}

}