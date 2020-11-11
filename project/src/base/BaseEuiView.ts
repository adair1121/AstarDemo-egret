abstract class BaseEuiView extends eui.Component implements IBaseEuiView{
	private static _instance:any;
	private closeBtn:eui.Image;
	protected removed:boolean = false;
	public constructor() {
		super();
		this.skinName = `${egret.getQualifiedClassName(this)}Skin`;
		this.percentHeight = 100;
        this.percentWidth = 100;
	}
	public static ins<T>():T{
		let Class:any = this;
		if(!this._instance){
			this._instance = new Class();
		}
		return this._instance;
	}
	
	// 按钮默认在右上角 
	public showClose(cls, closeCfg: any = {}, callBackFun:()=>void = null,thisArg:any = null):void{
		if (!this.closeBtn) {
			this.closeBtn = new eui.Image();
			this.closeBtn.source = closeCfg.skinName ? closeCfg.skinName : "close_btn_png";
			this.addChild(this.closeBtn);
			// 设置位置 + 适配
			this.closeBtn.top = closeCfg.top ? closeCfg.top : 60;
			this.closeBtn.right = closeCfg.right ? closeCfg.right : 30;
			closeCfg.bottom ? this.closeBtn.bottom = closeCfg.bottom : null;
			closeCfg.left ? this.closeBtn.left = closeCfg.left : null;
		}
		this.addTouchEvent(this.closeBtn,()=>{
			// let removeCls = null;
			// if(this.removed){
			// 	removeCls = StartGameView;
			// }
			MessageManager.inst().dispatch(CustomEvt.BTN_POS_FUWEI, this);
			ViewManager.inst().close(cls);
			if(callBackFun && thisArg){
				callBackFun.call(thisArg);
			}
		},true);
	}
	private onRouteFront(nameOrClass):void{
		
	}
	abstract open(...param):void

	abstract close():void;

	public addToParent(p:eui.UILayer):void{
		p.addChild(this);
	}
	/**路由回界面的刷新方法 */
	public refreshPage():void{}
	/**移除界面 */
	public removeFromeParent():void{
		if(this && this.parent){
			this.close();
			if(this && this.parent)
			{
				this.parent.removeChild(this);
			}
			
		}
	}
	public addTouchEvent(obj: any, func: Function,startEffect:boolean = false) {
		if(startEffect){
			obj.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBeginTouch,this);
			obj.addEventListener(egret.TouchEvent.TOUCH_END,this.onEndTouch,this);
			obj.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onEndTouch,this);
			obj.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onEndTouch,this);
		}
		this.addEvent(egret.TouchEvent.TOUCH_TAP, obj, func);
	}
	private onBeginTouch(evt:egret.TouchEvent):void{
		if(evt.target){
			this.changeFilter(evt.target);
		}
	}
	private onEndTouch(evt:egret.TouchEvent):void{
		if(evt.target && evt.target.filters){
			evt.target.filters = [];
		}
	}
	private changeFilter(obj:egret.DisplayObjectContainer):void{
		var colorMatrix = [
			0.3,0.6,0,0,0,
			0.3,0.6,0,0,0,
			0.3,0.6,0,0,0,
			0,0,0,1,0
		];
		var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
		obj.filters = [colorFlilter];
	}
	public removeTouchEvent(obj: any, func: Function) {
		if (obj) obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, this);
		if(obj && obj.hasEventListener("touchBegin")){
			obj.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onBeginTouch,this);
		}
		if(obj && obj.hasEventListener("touchEnd")){
			obj.removeEventListener(egret.TouchEvent.TOUCH_END,this.onEndTouch,this);
		}
		if(obj && obj.hasEventListener("touchCancel")){
			obj.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,this.onEndTouch,this);
		}
		if(obj && obj.hasEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE)){
			obj.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onEndTouch,this);
		}
	}
	public addEvent(ev: string, obj: any, func: Function) {
		if (!obj) {
			console.log(`不存在绑定对象`);
			return;
		}
		obj.addEventListener(ev, func, this);
	}
}