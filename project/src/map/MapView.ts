/**
 * 游戏地图
 * 
 * eg ： 初始化地图模块 。需要调用initMap; 其他方法选择性调用
 * 
 * function:  initMap 初始化地图 
 * 
 * function1 ：resetMapviewPort；重置地图层位置 。默认到00点
 * 
 * function2 : startRoleClickMove 开启人物点击地图移动操作
 */
class MapView extends BaseClass {
    /**地图背景 */
    private _mapImage: MapViewBg;
    ///////////////////////////////对象层////////////////////////////////////
    /**建筑物对象层 */
    private _itemLayer: egret.DisplayObjectContainer;
    private _shapeContainer:egret.DisplayObjectContainer;
    private initia:boolean = false;
    private hero:SoldierEntity;
    private levelMonIds:number[] = [10008];
    public monsters:MonsterEntity[]= [];
    public roles:any[] = [];
    public drops:DropEntity[] = [];
    private timeouts:any[] = [];
    //当前关卡地图 打怪波次 。定位 4个怪物点
    private levelCount:number = 0;
    //关卡每一波怪物数量
    public levelMonNum:number = 5;
    /**
     * syy 怪物范围
     */
    private monster_range:number=5;
    public constructor() {
        super();
    }
    public static inst():MapView{
		let _inst:MapView = super.single<MapView>();
		return _inst
	}
    /**清除地图单位 */
    public clearMapUnit():void{
        for(let key in this.monsters){
            if(this.monsters[key] && this.monsters[key].parent){
                egret.Tween.removeTweens(this.monsters[key]);
                GameApp.inst().removePosData(this.monsters[key].hashCode);
                this.monsters[key].parent.removeChild(this.monsters[key])
            }
        }
        for(let i:number = 0;i<this.timeouts.length;i++)
        {
            clearTimeout(this.timeouts[i]);
        }
        this.timeouts = [];
        this.monsters = [];
        for(let key in this.roles){
            if(this.roles[key] && this.roles[key].parent){
                GameApp.inst().removePosData(this.roles[key].hashCode)
                this.roles[key].parent.removeChild(this.roles[key])
            }
        }
        this.roles = [];
        for(let key in this.drops){
            if(this.drops[key] && this.drops[key].parent){
                this.drops[key].parent.removeChild(this.drops[key])
            }
        }
        this.drops = [];
        if(this._mapImage && this._mapImage.parent){
            this._mapImage.parent.removeChild(this._mapImage);
            this._mapImage = null;
        }
        if(this._itemLayer){
            this._itemLayer.removeChildren();
        }
        
        this.initia = false;
        if(this.hero && this.hero.parent){
            this.hero.parent.removeChild(this.hero);
        }
        LayerManager.MAP_LAYER.removeChildren();
        this._path = [];
        this.mapClick = false;
        this.moveEnd = true;
        if(this.timeout){
            clearTimeout(this.timeout);
        }
        LayerManager.MAP_LAYER.x = 0;
        LayerManager.MAP_LAYER.y = 0;

        LayerManager.UNIT_LAYER.removeChildren();
        LayerManager.UNIT_LAYER.x = 0;
        LayerManager.UNIT_LAYER.y = 0;
    }
    /**boss场景复活数据需要保存*/
    public rebirthWithData():void
    {
        TipsBox.showTips2( `您重生了` , -1 , 1000 );
        let hero:SoldierEntity = new SoldierEntity();
        let roleAttr:RoleAttr = GameApp.inst().roleAttr;
        let vo:RoleVo = {level:roleAttr.roleLevel,atkDis:200,spd:50,atk:roleAttr.roleAttack,hp:roleAttr.roleHp,mp:roleAttr.roleMp}
        hero.soldierAttr = vo;
        
        hero.setSoldierData(1);
        LayerManager.MAP_LAYER.addChild(hero);
        if(this.hero && this.hero.parent){
            this.hero.parent.removeChild(this.hero);
        }
        SkillComponent.inst().clearSkillEff();
        hero.x = this.hero.x;
        hero.y = this.hero.y;
        this.refreshMapPos();
        hero.playUp();

        this.hero = hero;
        this.roles = [];
        this.roles.push(hero);
    }
    public rebirth():void
    {
        TipsBox.showTips2( `您重生了` , -1 , 1000 );
        if(this.hero)
        {
            GameApp.inst().removePosData(this.hero.hashCode);
        }
        this.levelCount = 0;
        for(let key in this.monsters){
            if(this.monsters[key] && this.monsters[key].parent){
                egret.Tween.removeTweens(this.monsters[key]);
                GameApp.inst().removePosData(this.monsters[key].hashCode)
                this.monsters[key].parent.removeChild(this.monsters[key])
            }
        }
        for(let key in this.drops){
            if(this.drops[key] && this.drops[key].parent){
                this.drops[key].parent.removeChild(this.drops[key])
            }
        }
        this.drops = [];
        this.monsters = [];
        let birthGrids:{row:number,col:number}[] = GameMap.roleBirthGrid;
        let index:number = (Math.random()*birthGrids.length)>>0;
        let birthXY:{row:number,col:number} = birthGrids[index];
        let xy:XY = GameMap.grid2Point(birthXY.col,birthXY.row);

        let hero:SoldierEntity = new SoldierEntity();
        let roleAttr:RoleAttr = GameApp.inst().roleAttr;
        let vo:RoleVo = {level:roleAttr.roleLevel,atkDis:200,spd:50,atk:roleAttr.roleAttack,hp:roleAttr.roleHp,mp:roleAttr.roleMp}
        hero.soldierAttr = vo;
        
        hero.setSoldierData(1);
        LayerManager.MAP_LAYER.addChild(hero);
        if(this.hero && this.hero.parent){
            this.hero.parent.removeChild(this.hero);
        }
        SkillComponent.inst().clearSkillEff();
        this.hero = hero;
        this.roles = [];
        this.roles.push(hero);

        this.hero.x = xy.x;
        this.hero.y = xy.y;
        this.refreshMapPos();
        this.hero.playUp();
        
        GameApp.inst().addPoint(this.hero.hashCode,1,this.hero.x,this.hero.y);
        let self = this;
        let timeout = setTimeout(function() {
            clearTimeout(timeout);
            if(GameApp.inst().globalData.fubenId == FUBEN.FUBEN_WILD)
            {
                self.initLevelMonster();
            }else{
                self.initAssetsMon(GameApp.inst().globalData.fubenId);
            }
        }, 2000);
       
    }
    public upEffect()
    {
        this.hero.playUp();
    }
    /**
     * 地图初始化
     * drawGrid 是否绘制测试格子
     */
    public initMap(drawGrid?:boolean): void {
        if(this.initia){return}
        this.initia = true;

        let birthGrids:{row:number,col:number}[] = GameMap.roleBirthGrid;
        let index:number = (Math.random()*birthGrids.length)>>0;
        let birthXY:{row:number,col:number} = birthGrids[index];

        this.levelCount = 0; 
        this._mapImage = new MapViewBg(birthXY);
        LayerManager.MAP_LAYER.addChild(this._mapImage);

        this._itemLayer = new egret.DisplayObjectContainer();
        LayerManager.MAP_LAYER.addChild(this._itemLayer);
        if(drawGrid){this.drawTestGrid()}
        /**测试 */
        let hero:SoldierEntity = new SoldierEntity();
        this.hero = hero;
        let roleAttr:RoleAttr = GameApp.inst().roleAttr;
        let vo:RoleVo = {level:roleAttr.roleLevel,atkDis:200,spd:50,atk:roleAttr.roleAttack,hp:roleAttr.roleHp,mp:roleAttr.roleMp}
        hero.soldierAttr = vo;

        hero.setSoldierData(1);
        LayerManager.MAP_LAYER.addChild(hero);
        this.roles.push(hero);

        
        let xy:XY = GameMap.grid2Point(birthXY.col,birthXY.row);
        hero.x = xy.x;
        hero.y = xy.y;

        GameApp.inst().addPoint(this.hero.hashCode,1,this.hero.x,this.hero.y);
        
        LayerManager.UNIT_LAYER.width = LayerManager.MAP_LAYER.width;
        LayerManager.UNIT_LAYER.height = LayerManager.MAP_LAYER.height;
        // this.startRoleClickMove(hero);
        this.refreshMapPos();
        //------------------
    }
    randomsort(a, b) {
        return Math.random()>.5 ? -1 : 1; //通过随机产生0到1的数，然后判断是否大于0.5从而影响排序，产生随机性的效果。
    }
    /**初始化 关卡怪物 */
    public initLevelMonster(mv:boolean=false):void{
        let cfg:MonsterCfg = GameApp.inst().getMonInfoById(GameApp.inst().globalData.level);
        GameApp.inst().curMapName=cfg.sceneName;
        GameApp.inst().curMapId=cfg.mapID;
        let levelMon:{row:number,col:number}[] = GameMap.monsterGrid;
        levelMon.sort(this.randomsort);
        levelMon.sort(this.randomsort);
        for(let i:number = 0;i<levelMon.length-Math.floor(levelMon.length/4);i++)
        {
            let itemGrid:{row:number,col:number} = levelMon[i];
            let xy:XY = GameMap.grid2Point(itemGrid.col,itemGrid.row);
            if(mv)
            {
                let eff = new MovieClip();
		        eff.playFile( "resource/res/view/common/role_up" , 1 ,function(){
                    this.initBoss(cfg,"",xy);
		        }.bind(this),true);
                LayerManager.MAP_LAYER.addChild(eff);
                eff.x=xy.x;
                eff.y=xy.y;
            }else
            {
                this.initBoss(cfg,"",xy);
            }
        }

        // let count:number = this.levelCount%levelMon.length;
        // let birthGrid:{row:number,col:number} = levelMon[count];
        // let walkGrids:{row:number,col:number}[] = this.returnRangeWalkGrid(birthGrid);
        // let num:number = walkGrids.length > baseMonNum ?baseMonNum:walkGrids.length;
        // for(let i:number = 0;i<num;i++){
        //     let index:number = (Math.random()*walkGrids.length)>>0;
        //     let itemGrid:{row:number,col:number} = walkGrids[index];
        //     walkGrids.splice(index,1);
        //     let xy:XY = null;
        //     if(itemGrid){xy = GameMap.grid2Point(itemGrid.col,itemGrid.row)}
        //     this.initBoss(cfg,"",xy);
        // }
        // this.levelCount += 1;
    }
    private challengeId:number;
    /**初始化 挑战boss场景 */
    public initChallengeMon(challengeId:number):void
    {
        this.challengeId = challengeId;
        let cfg:MonsterCfg = GameApp.inst().getMonInfoById(challengeId);
        let monNum:number = cfg.monNum;
        let monPos:{row:number,col:number}[] = [].concat(GameMap.runGrid);
        for(let i:number = 0;i<monNum;i++)
        {
            // let index:number = (Math.random()*monPos.length)>>0;
            let itemGrid:{row:number,col:number} = GameMap.monsterGrid[0];
            // monPos.splice(index,1);
            let xy:XY = null;
            if(itemGrid){xy = GameMap.grid2Point(itemGrid.col,itemGrid.row)}
            this.initBoss(cfg,"boss_1",xy);
        }
    }
    /**初始化 资源副本场景 */
    public initAssetsMon(scene:number):void
    {
        let cfgs:MonsterCfg[] = GameApp.inst().getMonInfoByFuBen(scene);
        let mons:MonsterCfg[] = [];
        for(let i:number = 0;i<cfgs.length;i++)
        {
            if(cfgs[i].bossID){mons.push(cfgs[i]);}
        }
        for(let i:number =0; i<mons.length;i++)
        {
            let baseMonNum:number = mons[i].monNum;
            let levelMon:{row:number,col:number}[] = GameMap.monsterGrid;
            let count:number = this.levelCount%levelMon.length;
            let birthGrid:{row:number,col:number} = levelMon[count];
            let walkGrids:{row:number,col:number}[] = this.returnRangeWalkGrid(birthGrid);
            let num:number = walkGrids.length > baseMonNum ?baseMonNum:walkGrids.length;
            for(let j:number = 0;j<num;j++){
                let index:number = (Math.random()*walkGrids.length)>>0;
                let itemGrid:{row:number,col:number} = walkGrids[index];
                walkGrids.splice(index,1);
                let xy:XY = null;
                if(itemGrid){xy = GameMap.grid2Point(itemGrid.col,itemGrid.row)}
                this.initBoss(mons[i],"",xy);
            }
            this.levelCount += 1;
        }
        
    }
    /**挑战关卡boss */
    public challengeBoss():void
    {
        for(let i:number = 0;i<this.timeouts.length;i++)
        {
            clearTimeout(this.timeouts[i]);
        }
        this.timeouts = [];
        let cfg:MonsterCfg = GameApp.inst().getMonInfoById(GameApp.inst().globalData.level);
        let bossCfg:MonsterCfg = GameApp.inst().getMonInfoById(cfg.bossID);
        this.roles[0].resetHp();
        for(let key in this.monsters){
            if(this.monsters[key] && this.monsters[key].parent){
                GameApp.inst().removePosData(this.monsters[key].hashCode);
                this.monsters[key].parent.removeChild(this.monsters[key]);
            }
        }
        this.monsters = [];
        this.initBoss(bossCfg,"boss_1", null, true);
        GameApp.inst().battleCount -= 10;
    }
    /**创建资源boss */
    public createAssetsBoss():void
    {
        let cfgs:MonsterCfg[] = GameApp.inst().getMonInfoByFuBen(GameApp.inst().globalData.fubenId);
        let bossIds:number[] = [];
        for(let i:number = 0;i<cfgs.length;i++)
        {
            if(cfgs[i].bossID){bossIds.push(cfgs[i].bossID);}
        }
        for(let i:number = 0;i<bossIds.length;i++)
        {
            let cfg:MonsterCfg = GameApp.inst().getMonInfoById(bossIds[i]);
            this.initBoss(cfg,"boss_1");
        }
    }
    /**返回附近可走的格子 */
    public returnRangeWalkGrid(birthGrid:{row:number,col:number}):{row:number,col:number}[]{
        let initGridX:number = birthGrid.col - this.monster_range;
        let initGridY:number = birthGrid.row - this.monster_range;
        let endGridX:number = birthGrid.col + this.monster_range;
        let endGridY:number = birthGrid.row + this.monster_range;
        let grids:{row:number,col:number}[] = []
        for(let i:number = initGridX;i<=endGridX;i++){
            for(let j:number = initGridY;j<=endGridY;j++){
                let col:number = i;
                let gy:number = j;
                if(GameMap.walkable(j,i)) {
                    grids.push({col:i,row:j});
                }
            }
        }
        return grids;
    }
    endFuben():boolean
    {
        let cfg:MonsterCfg = GameApp.inst().getMonInfoById(GameApp.inst().globalData.level);
        if(GameApp.inst().curMapName.length!=0&&GameApp.inst().curMapName.slice(0,3)==cfg.sceneName.slice(0,3))
        {
            return true;
        }else
        {
            return false;
        }
    }
    /**移除item
     * 
     * @item 移除的monster
     * @leveladd 是否在移除后 一段时间后 添加一个
     */
    public refreshMonItem(item:MonsterEntity):void{
        for(let i:number = 0;i<this.monsters.length;i++){
            if(this.monsters[i] == item){
                let self = this;
                GameApp.inst().removePosData(item.hashCode);
                GameApp.inst().setTaskData(item.type == 0?1:2,item.monsterAttr.id);
                let drops:{id:number,num:number}[] = GameApp.inst().getDropItem(this.monsters[i].monsterAttr.id);
                if(this.monsters[i].type == 1)
                {
                    MessageManager.inst().dispatch(CustomEvt.BOSS_KILLED,{id:this.monsters[i].monsterAttr.id});
                }
                this.monsters.splice(i,1);
                if(GameApp.inst().globalData.fubenId == FUBEN.FUBEN_WILD){
                    //掉落物 ----------需要读取凋落物 。---- mark down----        
                    //野外怪物死亡
                    let self = this;
                    let timeout = setTimeout(function() {
                        clearTimeout(timeout);
                        let xy:XY = GameMap.grid2Point(item.gx,item.gy);
                        for(let t:number = 0;t<self.timeouts.length;t++)
                        {
                            if(self.timeouts[t] == timeout)
                            {
                                self.timeouts.splice(t,1);
                                break;
                            }
                        }
                        self.initBoss(item.monsterAttr,"",xy);
                    }, 20000);
                    this.timeouts.push(timeout);
                    if(drops.length)
                    {
                        
                        let mainRole:SoldierEntity = this.roles[0];
                        for(let j:number = 0;j<drops.length;j++)
                        {
                            let cfg:GoodsData = GameApp.inst().getItemById(drops[j].id) as GoodsData;
                            let randomX = Math.random()*100 > 50?1:-1;
                            let randomY = Math.random()*100 > 50?1:-1;
                            let xx:number = item.x + randomX*50;
                            let yy:number = item.y + randomY*50;
                            let dropItem:DropEntity = new DropEntity(cfg);
                            let index:number = LayerManager.MAP_LAYER.getChildIndex(this.hero);
                            LayerManager.MAP_LAYER.addChildAt(dropItem,index);
                            this.drops.push(dropItem)
                            dropItem.x = xx;
                            dropItem.y = yy;
                            GameApp.inst().addItemToBagById(drops[j].id,drops[j].num);
                            let timeout = setTimeout(function() {
                                clearTimeout(timeout);
                                egret.Tween.get(dropItem).to({x:self.hero.x,y:self.hero.y},300,egret.Ease.circIn).call(()=>{
                                    egret.Tween.removeTweens(dropItem);
                                    for(let k = 0;k<self.drops.length;k++)
                                    {
                                        if(self.drops[k] == dropItem)
                                        {
                                            self.drops.splice(k,1);
                                            break;
                                        }
                                    }
                                    if(dropItem && dropItem.parent){dropItem.parent.removeChild(dropItem)}
                                },self)
                            }, 3000);
                        }                        
                    }
                    this.getAssets(item.monsterAttr,{x:item.x,y:item.y});
                    if(GameApp.inst().battleCount < 10){
                        GameApp.inst().battleCount +=1;
                    }
                    if(this.monsters.length <= 0){
                        let timeout =setTimeout(function(){
                            clearTimeout(timeout);
                            if(this.endFuben())
                            {   
                                this.initLevelMonster(true);
                                this.roles[0].resetHp();
                            }else
                            {
                                BattleCom.inst().runToScene(FUBEN.FUBEN_WILD);
                            }
                        }.bind(this),1000);
                    }
                }else if(GameApp.inst().globalData.fubenId == FUBEN.FUBEN_CHALLENGE)
                {
                    if(this.monsters.length <= 0){//结算
                        let timeout = setTimeout(function() {
                            clearTimeout(timeout);
                            BattleCom.inst().onChallengeFinish();
                            // MessageManager.inst().dispatch(CustomEvt.CHALLENGE_FINISH);
                        }, 1500);
                    }   
                }else{
                    //材料副本
                    this.getAssets(item.monsterAttr);
                    if(this.monsters.length <= 0){//结算
                        this.initAssetsMon(GameApp.inst().globalData.fubenId);
                        this.roles[0].resetHp();
                    } 
                }
                (MapView.inst().roles[0] as SoldierEntity).resetHp();
                break;
            }
        }
    }
    /**获取击杀怪物获得的资源 */
    private getAssets(attr:MonsterCfg,xy?:XY):void
    {
        if(attr.exp && attr.exp != "none")
        {
            let arr = attr.exp.split("_");
            let rewardNum:number = parseInt(arr[0])+((Math.random()*parseInt(arr[1]))>>0);
            UserTips.inst().showTips(`<font color=0x00ff00>获得经验x${rewardNum}<font>`);
            GameApp.inst().roleGetExp(rewardNum);
        }
        if(attr.gold && attr.gold != "none")
        {
            let arr = attr.gold.split("_");
            let rewardNum:number = parseInt(arr[0])+((Math.random()*parseInt(arr[1]))>>0);
            UserTips.inst().showTips(`<font color=0xFFF000>获得元宝x${rewardNum}<font>`);
            GameApp.inst().setGoldNum(GameApp.inst().getGoldNum() + rewardNum);
            if(xy)
            {
                let cfg:GoodsData = GameApp.inst().getItemById(601) as GoodsData;
                cfg.ownNum = rewardNum;
                let goldEntity:DropEntity = new DropEntity(cfg);
                let index:number = LayerManager.MAP_LAYER.getChildIndex(this.hero);
                LayerManager.MAP_LAYER.addChildAt(goldEntity,index-1);
                goldEntity.x = xy.x;
                goldEntity.y = xy.y;
                let self = this;
                let timeout = setTimeout(function() {
                    clearTimeout(timeout);
                    egret.Tween.get(goldEntity).to({x:self.hero.x,y:self.hero.y},300,egret.Ease.circIn).call(()=>{
                        egret.Tween.removeTweens(goldEntity);
                        if(goldEntity && goldEntity.parent)
                        {
                            goldEntity.parent.removeChild(goldEntity);
                        }
                    },self)
                }, 1500);
                
            }
        }
        if(attr.stone && attr.stone != "none")
        {
            let arr = attr.stone.split("_");
            let rewardNum:number = parseInt(arr[0])+((Math.random()*parseInt(arr[1]))>>0);
            let dropId:number = parseInt(attr.dropID.split("_")[0]);
            UserTips.inst().showTips(`获得强化石x<font color=0x00ff00>${rewardNum}<font>`);
            GameApp.inst().addItemToBagById(dropId,rewardNum);
        }
    }
    /**初始化boss关卡 */
    private initBoss(cfg:MonsterCfg,bossMon?:string,birthP?:XY,gq?:boolean):void{

        let bossindex:number = (Math.random()*this.levelMonIds.length)>>0;
        let res:string = "";
        if(GameApp.inst().globalData.fubenId == FUBEN.FUBEN_WILD){
            res = ((Math.random()*6+1)>>0).toString();
        }

        //需要设置boss关卡数据   ----mark down-------
        let boss:MonsterEntity = new MonsterEntity();
        cfg.atkDis = 150;
        cfg.viewPortDis = 300;
        if(!bossMon){
            boss.type = 0;
            boss.setSoldierData(-1,res,cfg);
        }else{
            boss.type = 1;
            cfg.viewPortDis = 200;
            if(gq==true)
            {
                boss.setSoldierData(-1,bossMon,cfg,null,1.5,true);
            }else 
            {
                boss.setSoldierData(-1,bossMon,cfg,null,1.5);
            }
            boss.scaleX = boss.scaleY = 1.5;
        }
        LayerManager.MAP_LAYER.addChild(boss);
        let birthGrids:{row:number,col:number}[] = GameMap.monsterGrid;
        let index:number = (Math.random()*birthGrids.length)>>0;
        let birthXY:{row:number,col:number} = birthGrids[index];
        let xy:XY = GameMap.grid2Point(birthXY.col,birthXY.row);
        if(birthP){
            xy = birthP;
        }
        console.log("xy"+xy);
        boss.x = xy.x;
        boss.y = xy.y;
        birthP = birthP?birthP:xy;
       
        let birthGrid:XY = GameMap.point2Grid(birthP.x,birthP.y);
        boss.gx = birthGrid.x;
        boss.gy = birthGrid.y;
        boss.createRangeArea();
        this.monsters.push(boss);
        GameApp.inst().addPoint(boss.hashCode,0,boss.x,boss.y);
        // GameMap.AstarNode.setWalkable(birthXY.col,birthXY.row,false);
    }
    /**刷新地图位置 */
    public refreshMapPos():void{
        LayerManager.MAP_LAYER.x = - this.hero.x + (StageUtils.inst().getWidth()>>1); 
        LayerManager.MAP_LAYER.y = - this.hero.y + (StageUtils.inst().getHeight()>>1) + StageUtils.inst().getHeight()/5;
        this.judageMapImgX();
        this.judageMapImgY();
        let gridp:XY = GameMap.point2Grid(this.hero.x,this.hero.y);
        if(GameApp.inst().curMapName.indexOf(`(`)!=-1)
        {
            console.log("pos"+GameApp.inst().curMapName.indexOf("(")+1);
            let pos=GameApp.inst().curMapName.indexOf("(");
            GameApp.inst().curMapName=GameApp.inst().curMapName.slice(0,pos)+`(${Math.floor(this.hero.x)},${Math.floor(this.hero.y)})`;
        }else
        {
            GameApp.inst().curMapName+=`(${Math.floor(this.hero.x)},${Math.floor(this.hero.y)})`;
        }
        this._mapImage.refreshViewPort(gridp.x,gridp.y);
        LayerManager.UNIT_LAYER.x = LayerManager.MAP_LAYER.x;
        LayerManager.UNIT_LAYER.y = LayerManager.MAP_LAYER.y;
    }
    /**
     * 开启人物点击地图层移动操作
     * param：roleEntity 需要点击操作的主人物实体对象
     */
    public startRoleClickMove(roleEntity):void{
        this.hero = roleEntity;
       
        // LayerManager.MAP_LAYER.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMapTouch,this);
    }
    private _path:any[];
    public mapClick:boolean = false;
    private timeout;
    /**地图点击操作 */
    private onMapTouch(evt:egret.TouchEvent):void{
         let pxy:egret.Point = LayerManager.MAP_LAYER.globalToLocal(evt.stageX,evt.stageY);
         
         if(this.timeout){clearTimeout(this.timeout),this.timeout = null}
         this.execMoveAction(pxy,true)
    }
    private deepCopy(_path:any[]):any[]{
        let arr:any[] = [];
        for(let i:number = 0;i<_path.length;i++){
            let obj:any = {};
            for(let key in _path[i]){
                obj[key] = _path[i][key];
            }
            arr.push(obj);
        }
        return arr;
    }
    public clearRolePath():void
    {
        this._path = [];
    }
    public execMoveAction(pxy:XY,effect?:boolean):void{
        let gxy:XY = GameMap.point2Grid(pxy.x,pxy.y);
        let _path = this.findPath(gxy.x,gxy.y);
        if(_path){
            this._path = _path;
        }else{
            return;
        }
        if(this._path && this._path.length){
            //去掉第一个格子 。这个格子与人物在一个格子
            this._path.shift();
            this._path.pop();
            if(this._path.length && this.moveEnd){
                egret.Tween.removeTweens(this.hero);
                this.execMove(this._path.shift());
            }
        }
    }
    //移动速度
    private speed:number = 260;
    //当前格子是否移动完毕
    public moveEnd:boolean = true;
    /**执行移动主逻辑 */
    public jumpGrid:XY[] = [];
    public endJump:XY[] = [];
    public guideTips:XY[] = []
    private execMove(node:any):void{
        let gx:number = node.x;
        let gy:number = node.y;
        
        this.moveEnd = false;
        let point:XY = GameMap.grid2Point(gx,gy);
        let _offestX:number = this.hero.x;
        let _offestY:number = this.hero.y;
        this.hero.changeRoleAction(ActionState.RUN,new egret.Point(point.x,point.y));
        let dis:number = egret.Point.distance(new egret.Point(point.x,point.y),new egret.Point(this.hero.x,this.hero.y));
        let time:number = dis/this.speed;
        
        egret.Tween.get(this.hero,{loop:false,onChange:()=>{
            if(GameMap.walkAlpha(gy,gx)){
                this.hero.alpha = 0.7;
            }else{
                this.hero.alpha = 1;
            }
            if(!this.juageIfInXBorder()){
                let xx = this.hero.x - _offestX;
                // LayerManager.MAP_LAYER.x -= xx;
                // _offestX = this.hero.x;
                this.refreshMapPos()
            }
            this.judageMapImgX();
            if(!this.juageIfInYBorder()){
                let yy = this.hero.y - _offestY;
                // LayerManager.MAP_LAYER.y -= yy;
                // _offestY = this.hero.y;
                this.refreshMapPos();
            } 
            this.judageMapImgY();
        },onChangeObj:this}).to({x:point.x,y:point.y},time*1000).call(()=>{
            GameApp.inst().refreshPosData(this.hero.hashCode,1,this.hero.x,this.hero.y);
            egret.Tween.removeTweens(this.hero);
            this.moveEnd = true;
            if(this._path && this._path.length){
                this.execMove(this._path.shift())
            }else{
                this.hero.execAction(ActionState.RUN);
            }
        },this)
    }
    /**找寻路径 */
    public findPath(ex:number,ey:number):any[]{
        let grid:XY = GameMap.point2Grid(this.hero.x,this.hero.y);
        let hasBarrier:Boolean = GameMap.AstarNode.hasBarrier(grid.x, grid.y, ex, ey);  
        if(hasBarrier)
        {
            //有障碍物
            GameMap.AstarNode.setEndNode(ex,ey);

            let pxy:XY = GameMap.point2Grid(this.hero.x ,this.hero.y);
            GameMap.AstarNode.setStartNode(pxy.x, pxy.y);

            var aStar:astar.AStar = new astar.AStar();
            if(aStar.findPath(GameMap.AstarNode))
            {
                let _path = aStar.path;
                return _path
            }
        }else{
            // let _path = [GameMap.AstarNode.getNode(ex, ey)];  
            let point:XY = GameMap.grid2Point(ex,ey);
            this.hero.execMoveAction(point,null,this,this.refreshMapPos);
        }

		
		return null;
	}
    /**初始化地图层位置 */
    public resetMapviewPort():void{
        LayerManager.MAP_LAYER.y = 0;
        LayerManager.MAP_LAYER.x = 0;
        LayerManager.UNIT_LAYER.x = 0;
        LayerManager.UNIT_LAYER.y = 0;
    }
    //判断是否在X边界
    private juageIfInXBorder():boolean{
        return (this.hero.x <= StageUtils.inst().getWidth()>>1) || (this.hero.x >= (GameMap.MAX_WIDTH - (StageUtils.inst().getWidth()>>1)))
    }
    //判断是否在X边界
    private juageIfInYBorder():boolean{
        return (this.hero.y <= StageUtils.inst().getHeight()>>1) || (this.hero.y >= (GameMap.MAX_HEIGHT - (StageUtils.inst().getHeight()>>1)))
    }
    //判断地图x边界移动处理
    private judageMapImgX():void{
        // LayerManager.MAP_LAYER.x -= this._offestX;
        if(LayerManager.MAP_LAYER.x < -(GameMap.MAX_WIDTH - StageUtils.inst().getWidth())){
            LayerManager.MAP_LAYER.x  = -(GameMap.MAX_WIDTH - StageUtils.inst().getWidth());
        }
        if(LayerManager.MAP_LAYER.x > 0){
            LayerManager.MAP_LAYER.x = 0;
        }
    }
    //判断地图y边界移动处理
    private judageMapImgY():void{
        // LayerManager.MAP_LAYER.y -= this._offestY;
        if(LayerManager.MAP_LAYER.y < -(GameMap.MAX_HEIGHT - StageUtils.inst().getHeight())){
            LayerManager.MAP_LAYER.y = -(GameMap.MAX_HEIGHT - StageUtils.inst().getHeight());
        }
        if(LayerManager.MAP_LAYER.y > 0){
           LayerManager.MAP_LAYER.y = 0;
        }
        
    }
    /**
     * 绘制地图节点
     */
    private drawTestGrid():void{
       
        this._shapeContainer = new egret.DisplayObjectContainer();
        this._shapeContainer.cacheAsBitmap = true;
        this._shapeContainer.touchEnabled = false;
        this._shapeContainer.touchChildren = false;
        
        let maxX: number = GameMap.COL;
        let maxY: number = GameMap.ROW;
        for (let i: number = 0; i < maxY; i++) {
            for (let j: number = 0; j < maxX; j++) {
                let color:number;
                if (!GameMap.walkable(i, j)){
                    color = 0xff0000;
                }else{
                    color = 0xf7f7f7
                }
                let rect: egret.Shape = new egret.Shape();
                rect.graphics.clear();
                rect.graphics.lineStyle(0.1);
                rect.graphics.beginFill(color, 0.3);
                rect.graphics.drawRect(j * GameMap.CELL_SIZE, i * GameMap.CELL_SIZE, GameMap.CELL_SIZE, GameMap.CELL_SIZE);
                rect.graphics.endFill();

                let text: eui.Label = new eui.Label();
                text.size = 16;
                text.textColor = 0x000000;
                text.text = `${j},${i}`;
                text.x = j * GameMap.CELL_SIZE;
                text.y = i * GameMap.CELL_SIZE;
                this._shapeContainer.addChild(rect)
                this._shapeContainer.addChild(text);
            }
        }
        LayerManager.MAP_LAYER.addChild(this._shapeContainer);
    }
}

