/**
 *
 * 地图网格辅助类
 */
class GameMap {

	/** 当前地图格子大小 */
	public static CELL_SIZE: number;
	/** 当前地图最大宽度 */
	public static MAX_WIDTH: number;
	/** 当前地图最大高度 */
	public static MAX_HEIGHT: number;
	public static COL: number;
	public static ROW: number;
	/** 格子数据 */
	public static buildTouch:boolean = false;
	public static grid = [];
	public static runGrid = [];
	public static AstarNode;
	//怪物出生点
	public static monsterGrid = [];
	//人物出生点
	public static roleBirthGrid = [];
	/** 初始化 */
	static init(data: MapInfo): void {
		let gds = data.grids;
		GameMap.grid = [];
		GameMap.runGrid = [];
		GameMap.roleBirthGrid = [];
		GameMap.monsterGrid = [];
		GameMap.CELL_SIZE = data.gridw;
		GameMap.MAX_WIDTH = data.pixwidth;
		GameMap.MAX_HEIGHT = data.pixheight;
		GameMap.COL = data.cols;
		GameMap.ROW = data.rows;
		this.AstarNode = new astar.Grid(data.cols,data.rows)
		
		for(let i = 0;i<data.rows;i++){
			GameMap.grid[i] = []
			for(let j = 0;j<data.cols;j++){
				GameMap.grid[i][j] = gds[i*data.cols+j]
				if(GameMap.grid[i][j] == 1){
					let obj = {row:i,col:j};
					GameMap.runGrid.push(obj);
				}
				if(GameMap.grid[i][j] == 3){
					//怪物出声点
					let obj = {row:i,col:j};
					GameMap.monsterGrid.push(obj);
				}
				if(GameMap.grid[i][j] == 4){
					//怪物出声点
					let obj = {row:i,col:j};
					GameMap.roleBirthGrid.push(obj);
				}
				if(GameMap.grid[i][j] == 0 ){
					this.AstarNode.setWalkable(j,i,false);
				}
			}
		}
	}
	/**像素转格子坐标 */
	static point2Grid(px:number,py:number):XY{
		let gridXnum = (px/GameMap.CELL_SIZE)>>0;
		let gridYnum = (py/GameMap.CELL_SIZE)>>0;
		return {x:gridXnum,y:gridYnum};
	}
	/**格子位置转像素 */
	static grid2Point(gx:number,gy:number):XY{
		let x = gx * GameMap.CELL_SIZE + (GameMap.CELL_SIZE>>1);
		let y = gy * GameMap.CELL_SIZE + (GameMap.CELL_SIZE>>1);
		return {x:x,y:y}
	}
	/**格子坐标转地图块坐标 */
	static grid2MapBlock(gx:number,gy:number):XY{
		let pixelP:XY = this.grid2Point(gx,gy);
		let x:number = Math.ceil(pixelP.x / 256);
		let y:number = Math.ceil(pixelP.y / 256);
		return {x:x,y:y};
	}
	    
	/**
	 * 计算建筑物所占的格子集合
	 * 返回所占的格子坐标的集合
	 */
	static calculBuildGridArea(rect:egret.Rectangle):XY[]{
		let blockXNum = Math.ceil(rect.width/GameMap.CELL_SIZE);
		let blockYNum = Math.ceil(rect.height/GameMap.CELL_SIZE);
		let xys:XY[] = [];
		let firstGrid:XY = GameMap.point2Grid(rect.x,rect.y);
		for(let i = 0;i<blockXNum;i++){

			for(let j = 0;j<blockYNum;j++){
				let xy = {x:firstGrid.x+i,y:firstGrid.y+j};
				xys.push(xy);
			}
		}
		return xys;
	}
	/**根据格子坐标判断是否处于阻挡点  */
	static walkable(x:number,y:number):number{
		if(!(GameMap.grid[x])){
			return null;
		}
		
		if(isNaN(GameMap.grid[x][y])){
			return null;
		}
		let grid = GameMap.grid[x][y];
		if(grid == 0){
			return null
		}
		return grid;
	}
	/**根据格子坐标判断是否处于穿透 */
	static walkAlpha(x:number,y:number):boolean{
		if(!(GameMap.grid[x])){
			return false;
		}
		if(isNaN(GameMap.grid[x][y])){
			return false;
		}
		let grid = GameMap.grid[x][y];
		if(grid == 2){
			return true
		}
		return false;
	}
	

}
interface MapInfo{
	grids:number[],
	gridw:number,
	gridh:number,
	slicew:number,
	sliceh:number,
	pixwidth:number,
	pixheight:number,
	cols:number,
	rows:number,
}
interface XY{
	x:number,
	y:number
}

