class SignInModel {
	private signInData = [];
	private cumulativeData = [];
	/**传入表数据 */
	public setSignIn(_data) {
		for (let i = 0; i < _data.length; i++) {
			if(i< 21) {
				this.signInData.push(_data[i]);
			}
			else {
				this.cumulativeData.push(_data[i]);
			}
		}
		return this.signInData;
	}


	/**获取签到基本数据 */
	public getSignInData() {
		return this.signInData;
	}

	/**获取累计签到基本数据 */
	public getCumulativeData() {
		return this.cumulativeData;
	}

	/**获取签到进度 */
	public getSignInProgress() {
		return GameDataManager.instance.getStorage("SignInProgress", 0);
	}
	/**增加签到进度 默认一天 */
	public setSignInProgress(_value: number = 1, isA = false) {
		if (isA) {
			GameDataManager.instance.setStorage("SignInProgress", _value);
			return;
		}
		GameDataManager.instance.setStorage("SignInProgress", this.getSignInProgress() + _value);
	}

	/**查看累计签到是否完成 */
	public getCumulative(_id:number) {
		return GameDataManager.instance.getStorage("SignInCumulative" + _id, 0);
	}
	/**设置累计签到数据 value：默认1 */
	public setCumulative(_id:number,_value:number = 1) {
		GameDataManager.instance.setStorage("SignInCumulative" + _id, _value);
	}

	/**判断是否隔天 */
	public nextDay() {
		let day = new Date().getDate();
		console.log(GameDataManager.instance.getStorage("nexDaySignIn"));
		
		if (GameDataManager.instance.getStorage("nexDaySignIn") != day) {
			GameDataManager.instance.setStorage("nexDaySignIn", day);
			this.setInDay(0);
			if (this.getSignInProgress() >= 28) {
				this.setSignInProgress(0);
				let data = this.getCumulativeData();
				for (let i = 0; i < data.length; i++) {
					this.setCumulative(data[i].id, 0);
				}
			}
		}
	}

	/**读取当天是否签到 */
	public getInDay() {
		return GameDataManager.instance.getStorage("InDaySignIn", 0);
	}
	/**设置当天是否签到 */
	public setInDay(_value: number = 1) {
		GameDataManager.instance.setStorage("InDaySignIn", _value);
	}
}