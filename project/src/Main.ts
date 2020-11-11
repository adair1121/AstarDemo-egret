//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();
        StageUtils.init();
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        if (egret.Capabilities.runtimeType == egret.RuntimeType.RUNTIME2) {
            egret.TextField.default_fontFamily = `${DEFAULT_FONT}`
        }
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        // this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            RES.loadGroup("loading", -1);
            RES.loadGroup("skill");
            RES.loadGroup("forge");
            
            // var loadingUi = LoadingUI.inst();
            // loadingUi.setFinishFunc(() => {
            //     // 跳转···
            //     this.createGameScene();
            //     // 移除加载layer
            //     this.stage.removeChild(loadingUi);
            // })
            // this.stage.addChild(loadingUi);
            // await RES.loadGroup("preload", 0,loadingUi);
        }
        catch (e) {
            console.error(e);
        }
        // GameApp.inst().loadingRes("preload", () => {
            // 跳转···
            this.createGameScene();
        // })
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this); 

        })
    }
    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        console.log(Dragon.dragon);
        //开发功能测试
		egret.localStorage.clear();
        eui.Group.prototype["autoSize"] =eui.Label.prototype["autoSize"]= function(){
            let precentw:number = StageUtils.inst().getWidth()/1334;
            let precenth:number = StageUtils.inst().getHeight()/750;
            this.scaleX = this.scaleY = precentw;
            this.x *= precentw;
            this.y *= precenth;
        }
		//
       LayerManager.inst().iniaizlize(this);
       this.startTimer();
       MessageManager.inst().addListener(CustomEvt.BOSS_KILLED,this.killBossHandler , this );
       RES.addEventListener( RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this );
       //GameApp.inst().load();
    }
    onResourceLoadComplete(event: RES.ResourceEvent)
    {
        if(event.groupName=="loading") {
            GameApp.inst().start();
        }
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
       
    }

    private killBossHandler( event: CustomEvt ):void {
        let id = event.data.id;
        // let monster = GameApp.inst().getMonInfoById(id);
        let bossIndex: number = parseInt(id) - 10200;
        let bossIDArr = [ 5 , 6 , 7 , 8 ];
        let addID = null;
        for( let i = 0 ; i < bossIDArr.length ; i ++ ) {
            if( bossIndex == bossIDArr[i] ) {
                addID = i;
                break;
            }
        }
        if( addID != null ) {
            let roleKillBoss = GameApp.inst().roleAttr.roleKillBoss;
            roleKillBoss[addID] ++;
            GameApp.inst().refreshRoleAttr( "roleKillBoss" , roleKillBoss );
        }

    }

    private startTimer():void {
       let timer = new egret.Timer( 1000 );
       timer.addEventListener( egret.TimerEvent.TIMER , this.timerHandler , this );
       timer.start();
    }

    private timerHandler( event: egret.TimerEvent ):void {
        this.bossCD();
    }

    private bossCD():void {
        if( FubenView.playCfg.open == true ) {
            let fubenTimes = GameApp.inst().fubenData.fubenTimes;
            if( fubenTimes[FubenView.playCfg.openIndex] > 0 ) {
                fubenTimes[FubenView.playCfg.openIndex] --;
                GameApp.inst().refreshFuBenData( "fubenTimes" , fubenTimes );
            } else {
                FubenView.playCfg.open = false;
                MessageManager.inst().dispatch( CustomEvt.FUBEN_TIME_OVER );
                BattleCom.inst().runToScene(FUBEN.FUBEN_WILD);
            }
        }
    }
}
