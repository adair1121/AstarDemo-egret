/**
 * 自定义数据类型 以及枚举
 */

interface XY{
	x:number,
	y:number
}
interface ItemData{
	res:string,
	num:number
}

class ActionState{
	public static readonly RUN:string = "r";

	public static readonly ATTACK:string = "a";

	public static readonly CAST:string = "c";

	public static readonly DEAD:string = 'd';

	public static readonly STAND:string = "s";

	public static readonly HIT:string = "h";
}
enum ActionEnum{
	run = 0,
	attack,
	dead,
	stand
}
enum EntityType{
	enemy = 0,
	energy
}
enum SkillType
{
	DIRECT=0,
	NO_DIRECT,
	FLY
}
enum  DirectionEnum{
	TOP = 0,
	TR,
	RIGHT,
	RB,
	BOTTOM
}
enum FUBEN
{
	FUBEN_WILD = 1,
	FUBEN_GOLD,
	FUBEN_STONE,
	FUBEN_EXP,
	FUBEN_CHALLENGE
}
enum EquipPos{
	Weapon,
	Neck,
	Head,
	HuYao,
	Body,
	KuZi,
	Shoe,
	HuBi,
	LeftRing,
	RightRing,
	Item

}

