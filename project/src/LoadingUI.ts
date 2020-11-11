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

class LoadingUI extends eui.UILayer implements RES.PromiseTaskReporter {

    // 加载提示语
    private LoadingTips: Array<string> = [
        "正在给城主雕像上色",
        "正在翻找BOSS巢穴里的宝物",
        "正在擦拭屠龙刀",
        "正在给倚天剑镀金",
        "正在偷偷调低BOSS的攻击",
        "正在和英雄讨论战术",
        "程序员正在给关公上香",
        "美术画了你的画像，藏在了主城的某一个角落",
        "正在给魔法盾抛光",
    ]

    private progressBg:eui.Image;
    private progressBar:eui.Image;
    private progressPanel:eui.Group;
    private progressMask:eui.Rect
    private static _instance:LoadingUI;
    private _loadHorse:MovieClip;
    private _w:number;
    private _total:number = 33.5;
    public constructor() {
        super();
        RES.addEventListener( RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadErr, this );
        this.createView();
        this.initLoadTips();
    }
    public static inst():LoadingUI{
        if(!this._instance){
            this._instance = new LoadingUI();
        }
        return this._instance;
    }
    public hide():void{
        if(this.parent){
            this.parent.removeChild(this);
        }
    }

    private finishFunc: Function = null;
    public setFinishFunc(func: Function): void {

        this.finishFunc = () => {
            func ? func() : null;
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
            this.timer = null;
            console.log("loading finished");
        }

    }

    private bgName: string = "loading_bg_png";
    public loadingBgName(name: string): void{
        this.bgName = name;
    }
    private textField: eui.Label;

    private createView(): void {
        // 适配
        let precentw:number = StageUtils.inst().getWidth()/1334;
        let precenth:number = StageUtils.inst().getHeight()/750;

        // create loading bg
        var loadingBg = new eui.Image();
        loadingBg.source = this.bgName;
        this.addChild(loadingBg);
        loadingBg.width = StageUtils.inst().getWidth();
        loadingBg.height = StageUtils.inst().getHeight();
        console.log("create loading bg");

        this.progressPanel = new eui.Group();
        this.addChild(this.progressPanel);
        this._w = (StageUtils.inst().getWidth());
        this.progressPanel.horizontalCenter = 0;
        this.progressPanel.left = 0;
        this.progressPanel.right = 0;
        this.progressPanel.bottom = 0;


        this.progressBg = new eui.Image();
        this.progressBg.source = "progress_bg_png";
        this.progressPanel.addChild(this.progressBg);
        this.progressBg.left = 130;
        this.progressBg.right = 130;
        this.progressBg.bottom = 50;

        this.progressBar = new eui.Image();
        this.progressBar.source = "progress_pro_png";
        this.progressBar.left = 130;
        this.progressBar.right = 130;
        this.progressBar.bottom = 50;
        this.progressPanel.addChild(this.progressBar);

        // this._loadHorse = new MovieClip();
        // this.progressPanel.addChild(this._loadHorse);
        // this._loadHorse.playFile(`${EFFECT}loading_horse`,-1);

        this.progressMask = new eui.Rect;
        this.progressMask.height = 37;
        this.progressMask.width=0;
        this.progressPanel.addChild(this.progressMask);
        // this._loadHorse.y = this.progressMask.y;
        // this._loadHorse.x = this.progressMask.x + this.progressMask.width;

        this.progressBar.mask = this.progressMask;

        this.textField = new eui.Label();
        this.progressPanel.addChild(this.textField);
        this.textField.fontFamily = `fzksFont`
        this.textField.size = 16;
        // this.textField.y = 80;
        this.textField.bottom = 70;
        this.textField.horizontalCenter = 0;

        let cText = new eui.Label();
        this.progressPanel.addChild(cText);
        cText.horizontalCenter = 0;
        cText.text = '抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。';
        cText.textColor = 0xeedbbf;
        cText.strokeColor = 0x38261c;
        cText.stroke = 2;
        cText.fontFamily = "fzksFont";
        cText.size = 16;
        cText.bottom = 10;
        cText.scaleX = cText.scaleY = precentw;
        cText.x *= precentw;
        cText.y *= precenth;

        // cText.left = 200;
        // cText.right = 200;
    }

    public onProgress(current: number, total: number): void {
        let cutsize:string = (current/total*this._total).toFixed(1)
        
        let w:number = (current/total)*this._w
        if(w >= this._w){w = this._w,cutsize=this._total.toString()}
        // this.textField.text = `正在加载游戏资源...请稍候(${current}/${total})-(${cutsize}MB/${this._total}MB)`;
        this.progressMask.width = w;
        // this._loadHorse.x = this.progressMask.width;

        // test resLoad err
        // if (w >= this._w/2) {
        //     this.onResourceLoadErrTest("preload");
        //     return ;
        // }

        if (w >= this._w) {
            console.log('资源加载完成')
            this.finishFunc ? this.finishFunc() : null;
            this.finishFunc = null;
        }
    }

    private onResourceLoadErr (event: RES.ResourceEvent): void {
        console.log(`加载${event.groupName}资源出错`)
        RES.loadGroup(event.groupName);
    }

    private timer: egret.Timer = null;
    private loadingTips: Array<string>;
    private tipsRandTime: number = 3;
    private initLoadTips(): void {
        if (this.timer) return ;
        this.loadingTips = GlobalFun.copyTable(this.LoadingTips);
        this.timer = new egret.Timer(this.tipsRandTime * 1000, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this.timer.start();
        this.randLoadingTips();
    }

    private timerFunc(): void {
        if (this.loadingTips.length <= 0) {
            this.loadingTips = GlobalFun.copyTable(this.LoadingTips);            
        }
        this.randLoadingTips();
        
    }

    private randLoadingTips(): void{
        let randIndex = Math.floor(Math.random() * this.loadingTips.length);
        let tips = this.loadingTips[randIndex];
        console.log("rand loading tips ,,, " , tips)
        this.textField.text = tips;
        this.loadingTips.splice(randIndex, 1);
    }

    // private onResourceLoadErrTest (groupName: string): void {
    //     console.log(`加载${groupName}资源出错`);
    //     RES.loadGroup(groupName);
    // }
}
