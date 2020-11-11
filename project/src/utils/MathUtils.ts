/**
 * Created by yangsong on 2014/11/22.
 * 数学计算工具类
 */
class MathUtils {

	/**
	 * 弧度制转换为角度值
	 * @param radian 弧度制
	 * @returns {number}
	 */
	public static getAngle(radian: number): number {
		return 180 * radian / Math.PI;

	}

	/**
	 * 角度值转换为弧度制
	 * @param angle
	 */
	public static getRadian(angle: number): number {
		return angle / 180 * Math.PI;
	}
	/** 
	 * 根据两点确定这两点连线的二元一次方程 y = ax + b或者 x = ay + b 
	 * @param ponit1 
	 * @param point2 
	 * @param type                指定返回函数的形式。为0则根据x值得到y，为1则根据y得到x 
	 *  
	 * @return 由参数中两点确定的直线的二元一次函数 
	 */                  
	public static getLineFunc(ponit1:egret.Point, point2:egret.Point, type:number=0):Function  
	{  
			var resultFuc:Function;  
				
			// 先考虑两点在一条垂直于坐标轴直线的情况，此时直线方程为 y = a 或者 x = a 的形式  
			if( ponit1.x == point2.x )  
			{  
					if( type == 0 )  
					{  
							throw new Error("两点所确定直线垂直于y轴，不能根据x值得到y值");  
					}  
					else if( type == 1 )  
					{  
							resultFuc =        function( y:Number ):Number  
													{  
															return ponit1.x;  
													}  
										
					}  
					return resultFuc;  
			}  
			else if( ponit1.y == point2.y )  
			{  
					if( type == 0 )  
					{  
							resultFuc =        function( x:Number ):Number  
							{  
									return ponit1.y;  
							}  
					}  
					else if( type == 1 )  
					{  
							throw new Error("两点所确定直线垂直于y轴，不能根据x值得到y值");  
					}  
					return resultFuc;  
			}  
				
			// 当两点确定直线不垂直于坐标轴时直线方程设为 y = ax + b  
			var a:number;  
				
			// 根据  
			// y1 = ax1 + b  
			// y2 = ax2 + b  
			// 上下两式相减消去b, 得到 a = ( y1 - y2 ) / ( x1 - x2 )   
			a = (ponit1.y - point2.y) / (ponit1.x - point2.x);  
				
			var b:number;  
				
			//将a的值代入任一方程式即可得到b  
			b = ponit1.y - a * ponit1.x;  
				
			//把a,b值代入即可得到结果函数  
			if( type == 0 )  
			{  
				resultFuc = function( x:number ):number  
							{  
									return a * x + b;  
							}  
			}  
			else if( type == 1 )  
			{  
				resultFuc = function( y:number ):number  
				{  
					return (y - b) / a;  
				}  
			}  
				
			return resultFuc;  
	}

	/**
	 * 获取两点间弧度
	 * @param p1X
	 * @param p1Y
	 * @param p2X
	 * @param p2Y
	 * @returns {number}
	 */
	public static getRadian2(p1X: number, p1Y: number, p2X: number, p2Y: number): number {
		let xdis: number = p2X - p1X;
		let ydis: number = p2Y - p1Y;
		return Math.atan2(ydis, xdis);
	}

	/**
	 * 获取两点间距离
	 * @param p1X
	 * @param p1Y
	 * @param p2X
	 * @param p2Y
	 * @returns {number}
	 */
	public static getDistance(p1X: number, p1Y: number, p2X: number, p2Y: number): number {
		let disX: number = p2X - p1X;
		let disY: number = p2Y - p1Y;
		let disQ: number = disX * disX + disY * disY;
		return Math.sqrt(disQ);
	}

	public static getDistanceByObject(s: { x: number, y: number }, t: { x: number, y: number }): number {
		return this.getDistance(s.x, s.y, t.x, t.y);
	}

	/**获取两个点的距离的平方 */
	public static getDistanceX2ByObject(s: { x: number, y: number }, t: { x: number, y: number }): number {
		let disX: number = s.x - t.x;
		let disY: number = s.y - t.y;
		return disX * disX + disY * disY;
	}

	/** 角度移动点 */
	public static getDirMove(angle: number, distance: number, offsetX: number = 0, offsetY: number = 0): { x: number, y: number } {
		let radian = this.getRadian(angle);
		let p = {x: 0, y: 0};
		p.x = Math.cos(radian) * distance + offsetX;
		p.y = Math.sin(radian) * distance + offsetY;
		return p;
	}


	/**
	 * 获取一个区间的随机数
	 * @param $from 最小值
	 * @param $end 最大值
	 * @returns {number}
	 */
	public static limit($from: number, $end: number): number {
		$from = Math.min($from, $end);
		$end = Math.max($from, $end);
		let range: number = $end - $from;
		return $from + Math.random() * range;
	}

	/**
	 * 获取一个区间的随机数(帧数)
	 * @param $from 最小值
	 * @param $end 最大值
	 * @returns {number}
	 */
	public static limitInteger($from: number, $end: number): number {
		return Math.round(this.limit($from, $end));
	}

	/**
	 * 在一个数组中随机获取一个元素
	 * @param arr 数组
	 * @returns {any} 随机出来的结果
	 */
	public static randomArray(arr: Array<any>): any {
		let index: number = Math.floor(Math.random() * arr.length);
		return arr[index];
	}

	/**取整 */
	public static toInteger(value: number): number {
		return value >> 0;
	}
}