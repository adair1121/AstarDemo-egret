/**
 * MapView
 */
class MapViewBg extends egret.DisplayObjectContainer {

	private maxImagX: number;
	private maxImagY: number;

	private mapName: string;


	private _shape: egret.Shape = new egret.Shape;

	private _imageList: eui.Image[][];

	private lastUpdateX: number = 0;
	private lastUpdateY: number = 0;


	private showImages: eui.Image[];

	private _poolImages:eui.Image[];

	private turn: number = 0;

	private _fileDic:{[key:string]:number};
	// private oldImgs = {};
	private _birthXy:{row:number,col:number};
	private mapShowlish:any = {};
	constructor(birthXY:{row:number,col:number}) {
		super();

		//this.cacheAsBitmap = true;

		this.touchChildren = false;
		this.touchEnabled = false;
		this._birthXy = birthXY;

		

		this._imageList = [];
		this.showImages = [];
		this._poolImages = [];
		this._fileDic = {};
		this.updateHDMap();
	}

	private clearHDMap(): void {
		this._imageList = [];
		this.showImages = [];
		this.removeChildren();
	}

	private getImage(){
		return this._poolImages.pop() || new eui.Image();
	}
	/**动态刷新视线口 */
	public refreshViewPort(gx:number,gy:number):void{
		let imgSize: number = 256;
		
		let blockW:number = Math.ceil(StageUtils.inst().getWidth()/imgSize);
		let blockH:number = Math.ceil(StageUtils.inst().getHeight()/imgSize);
		let blockXY:XY = GameMap.grid2MapBlock(gx,gy);
		let initX:number = blockXY.x - Math.ceil(blockW>>1) -3;
		let initY:number = blockXY.y - Math.ceil(blockH>>1) - 3;
		let maxX:number = Math.ceil(GameMap.MAX_WIDTH / imgSize);
		let maxY:number = Math.ceil(GameMap.MAX_HEIGHT / imgSize);
		initX = initX < 0?0:initX;
		initY = initY < 0?0:initY;
		let endX:number = blockXY.x + Math.ceil(blockW>>1) + 3;
		let endY:number = blockXY.y + Math.ceil(blockH>>1) + 3;
		endX = endX > maxX?maxX:endX;
		endY = endY > maxY?maxY:endY;
		for(let i:number = initX;i<endX;i++){
			for(let j:number = initY;j<endY;j++){
				let key:string = i+"_"+j;
				let sourceName: string = `${MAP_DIR}${GameApp.inst().curMapId}/${i}_${j}.jpg`;
				if(this.mapShowlish[key] && !this.mapShowlish[key].show){
					this.mapShowlish[key].show = true;
					this.mapShowlish[key].img.visible = true;
					this.mapShowlish[key].img.source = sourceName;
				}
			}
		}
	}
	public updateHDMap(): void {
		this.clear();
		let imgSize: number = 256;
		this.maxImagX = Math.ceil(GameMap.MAX_WIDTH / imgSize);
		this.maxImagY = Math.ceil(GameMap.MAX_HEIGHT / imgSize);
		for (let i = 0; i < this.maxImagX; i++) {

			for (let j = 0; j < this.maxImagY; j++) {
				let s: eui.Image = this.getImage();
				s.width = s.height = imgSize;
				s.source = "blur1_png";
				s.visible = false;
				s.x = i * imgSize;
				s.y = j * imgSize;
				this.mapShowlish[i+"_"+j] = {img:s,show:false}
				this.addChild(s);
			}
		}
	}
	public clear():void{
		this.clearHDMap()
	}
}