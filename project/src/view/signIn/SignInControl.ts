class SignInControl {
	/**单利模式 */
	private static _instance: SignInControl;
	public static get instance(): SignInControl {
		if (SignInControl._instance == null) {
			SignInControl._instance = new SignInControl();
			SignInControl._instance.init();
		}
		return SignInControl._instance;
	}
	public constructor() {
	}
	public model:SignInModel;
	private init() {
		this.model = new SignInModel();
		this.model.setSignIn(RES.getRes("SignInData_json"));
	}


}