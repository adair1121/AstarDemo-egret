class BossHpCom extends eui.Component{
	private monBar:eui.Image;
	private monRect:eui.Rect;
	private monHead:eui.Image;
	private proLab:eui.Label;
	private _cfg:MonsterCfg;
	private monName:eui.Label;
	private levelLab:eui.Label;
	private hp:number = 0;
	public constructor() {
		super();
		this.skinName = "BossHpComSkin";
		
	}
	public setCfg(cfg:MonsterCfg)
	{
		this._cfg = cfg;
		this.hp = this._cfg.hp;
		this.monHead.source = `${this._cfg.sequence}_head_png`;
		this.monName.text = this._cfg.monsterName;
		this.levelLab.text = this._cfg.monterLev.toString();
		this.setHp(this.hp)
	}
	protected childrenCreated():void
	{
		this.monBar.mask = this.monRect;
	}
	public setHp(hp):void
	{
		if(this._cfg && GameApp.inst().globalData.fubenId == FUBEN.FUBEN_CHALLENGE)
		{
			this.hp = hp;
			this.proLab.text = this.hp+"/"+this._cfg.hp;
			let percentW:number = this.hp/this._cfg.hp*193;
			this.monRect.width = percentW;
		}
	}
}