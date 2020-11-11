/**
 * 网格类
 * @author chenkai
 * @since 2017/11/3
 */
namespace astar{
	export  class Grid {
		private _startNode:Node;    //起点
		private _endNode:Node;      //终点
		private _nodes:Array<any>;  //Node数组
		private _numCols:number;    //网格行列
		private _numRows:number;

		public constructor(numCols:number, numRows:number) {
			//形成格子区域
			this._numCols = numCols;
			this._numRows = numRows;
			this._nodes = [];

			for(let i:number=0;i<numCols;i++){
				this._nodes[i] = [];
				for(let j:number=0;j<numRows;j++){
					this._nodes[i][j] = new Node(i,j);
				}
			}
		}
		/** 
		 * 得到一个点下的所有节点  
		* @param xPos                点的横向位置 
		* @param yPos                点的纵向位置 
		* @param exception        例外格，若其值不为空，则在得到一个点下的所有节点后会排除这些例外格 
		* @return                         共享此点的所有节点 
		*  
		*/                  
		public getNodesUnderPoint( xPos:number, yPos:number, exception:any=null ):any  
		{  
				var result:any = [];  
				var xIsInt:Boolean = xPos % 1 == 0;  
				var yIsInt:Boolean = yPos % 1 == 0;  
								
				//点由四节点共享情况  
				if( xIsInt && yIsInt )  
				{  
						result[0] = this.getNode( xPos - 1, yPos - 1);  
						result[1] = this.getNode( xPos, yPos - 1);  
						result[2] = this.getNode( xPos - 1, yPos);  
						result[3] = this.getNode( xPos, yPos);  
				}  
				//点由2节点共享情况  
				//点落在两节点左右临边上  
				else if( xIsInt && !yIsInt )  
				{  
						result[0] = this.getNode( xPos - 1, (yPos>>0) );  
						result[1] = this.getNode( xPos, (yPos>>0) );  
				}  
				//点落在两节点上下临边上  
				else if( !xIsInt && yIsInt )  
				{  
						result[0] = this.getNode( (xPos>>0), yPos - 1 );  
						result[1] = this.getNode( (xPos>>0), yPos );  
				}  
				//点由一节点独享情况  
				else  
				{  
						result[0] = this.getNode( (xPos>>0), (yPos>>0) );  
				}  
								
				//在返回结果前检查结果中是否包含例外点，若包含则排除掉  
				if( exception && exception.length > 0 )  
				{  
						for( var i:number=0; i<result.length; i++ )  
						{  
								if( exception.indexOf(result[i]) != -1 )  
							{  
									result.splice(i, 1);  
									i--;  
							}  
						}  
				}  
								
				return result;  
		}
		/** 
		* 判断两节点之间是否存在障碍物  
		*  
		*/                  
		public hasBarrier( startX:number, startY:number, endX:number, endY:number ):Boolean  
		{  
				//如果起点终点是同一个点那傻子都知道它们间是没有障碍物的  
				if( startX == endX && startY == endY )return false;  
								
				//两节点中心位置  
				var point1:egret.Point = new egret.Point( startX + 0.5, startY + 0.5 );  
				var point2:egret.Point = new egret.Point( endX + 0.5, endY + 0.5 );  
								
				//根据起点终点间横纵向距离的大小来判断遍历方向  
				var distX:number = Math.abs(endX - startX);  
				var distY:number = Math.abs(endY - startY);                                                                          
								
				/**遍历方向，为true则为横向遍历，否则为纵向遍历*/  
				var loopDirection:Boolean = distX > distY ? true : false;  
								
				/**起始点与终点的连线方程*/  
				var lineFuction:Function;  
								
				/** 循环递增量 */  
				var i:number;  
								
				/** 循环起始值 */  
				var loopStart:number;  
								
				/** 循环终结值 */  
				var loopEnd:number;  
								
				/** 起终点连线所经过的节点 */  
				var passedNodeList:any[] = [];  
				var passedNode:Node;  
								
				//为了运算方便，以下运算全部假设格子尺寸为1，格子坐标就等于它们的行、列号  
				if( loopDirection )  
				{                                  
					lineFuction = MathUtils.getLineFunc(point1, point2, 0);  
									
					loopStart = Math.min( startX, endX );  
					loopEnd = Math.max( startX, endX );  
									
					//开始横向遍历起点与终点间的节点看是否存在障碍(不可移动点)   
					for( i=loopStart; i<=loopEnd; i++ )  
					{  
							//由于线段方程是根据终起点中心点连线算出的，所以对于起始点来说需要根据其中心点  
							//位置来算，而对于其他点则根据左上角来算  
							if( i==loopStart )i += .5;  
							//根据x得到直线上的y值  
							var yPos:number = lineFuction(i);  
											
							//检查经过的节点是否有障碍物，若有则返回true  
							passedNodeList = this.getNodesUnderPoint( i, yPos );  
							for ( let passedNode in passedNodeList )  
							{  
									if( passedNodeList[passedNode].walkable == false )return true;  
							}  
											
							if( i == loopStart + .5 )i -= .5;  
					}  
				}  
				else  
				{  
					lineFuction = MathUtils.getLineFunc(point1, point2, 1);  
									
					loopStart = Math.min( startY, endY );  
					loopEnd = Math.max( startY, endY );  
									
					//开始纵向遍历起点与终点间的节点看是否存在障碍(不可移动点)  
					for( i=loopStart; i<=loopEnd; i++ )  
					{  
							if( i==loopStart )i += .5;  
							//根据y得到直线上的x值  
							var xPos:number = lineFuction(i);  
											
							passedNodeList = this.getNodesUnderPoint( xPos, i );  
											
							for ( let passedNode in passedNodeList )  
							{  
									if( passedNodeList[passedNode].walkable == false )return true;  
							}  
											
							if( i == loopStart + .5 )i -= .5;  
					}  
				}  
		
				return false;                          
		}
		public getNode(x:number , y:number):Node{
			return this._nodes[x][y];
		}

		public setEndNode(x:number, y:number){
			this._endNode = this._nodes[x][y];
		}

		public setStartNode(x:number, y:number){
			this._startNode = this._nodes[x][y];
		}

		public setWalkable(x:number, y:number, value:boolean){
			this._nodes[x][y].walkable = value;
		}

		public get endNode(){
			return this._endNode;
		}

		public get numCols(){
			return this._numCols;
		}

		public get numRows(){
			return this._numRows;
		}

		public get startNode(){
			return this._startNode;
		}
	}
}
