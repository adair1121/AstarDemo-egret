/**
 * 音频url预加载
 * 
 * ** 为了修正自研项目因加载音频导致项目运行停止问题
 * ** 出现的问题是因为 egret开启了 默认并发加载为4
 * ** 为了保证并发加载的情况以及解决加载卡顿和不修改音频格式的情况下 采用httpRequest方法
 * 
 * *******注意事项：音频文件不能保存在配置中（default.res.json）
 * 
 * ** 可以自己补充方法 或者修改 然后群里同步一下 --
 * 
 * eg(使用方法):
 * mp3play.preloadRes("bg_music","resource/res/bg_music.mp3",()=>{
        mp3play.play("bg_music",-1);
        mp3play.volume("bg_music",1);
   },this);
 * 
 * public:
 * 	 preloadRes -- 预加载音频资源
 * 	 play       -- 音频播放
 * 	 stop       -- 停止
 * 	 pause      -- 暂停
 * 	 destory    -- 销毁
 *   volume     -- 音量设置
 * 
 */
namespace mp3play
{
	let _audioList:any = {};
	let _request = new egret.HttpRequest();
	let _curKey:string = "";
	let _curRes:string = "";
	let _loadSingleCom:()=>void;
	let _loadSinglearg:any;
	let _loadList:any[] = [];
	let _loading:boolean = false;
	_request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
	_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	_request.addEventListener(egret.Event.COMPLETE,loadComplete,mp3play);
	function loadComplete(e:egret.Event):void
	{
		let _audio = document.createElement("audio");
		var t = e.currentTarget;
		var r = new Blob([t.response], { type: "audio/mp3" });
		let src = URL.createObjectURL(r);
		_audio.src = src;
		let keys = Object.keys(_audioList);
		if(!~keys.indexOf(_curKey))
		{
			_audioList[_curKey] = _audio;
		}else{
			let newkey = `${_curKey}${keys.length}`;
			console.warn("存储的音频key值重复--执行修改--key:"+newkey+"---res:"+_curRes);
			_audioList[newkey] = _audio;
		}
		if(_loadSingleCom && _loadSinglearg)
		{
			_loadSingleCom.call(_loadSinglearg);
		}
		_loading = false;
		if(_loadList.length)
		{
			loadSingleRes();
		}
		
	}
	function loadSingleRes():void
	{
		if(_loading){return;}
		let obj = _loadList.shift();
		_loading = true;
		_curKey = obj.key;
		_curRes = obj.res;
		_loadSingleCom = obj.loadCom;
		_loadSinglearg = obj.arg;
		_request.open(_curRes,egret.HttpMethod.GET);
		_request.send();
	}
	/**
	 * 预加载音频资源
	 * @param key 存放的键值
	 * @param res 音频资源相对路径
	 */
	export function preloadRes(key:string,res:string,loadCom:()=>void,arg:any):void
	{
		for(let i:number = 0;i<_loadList.length;i++)
		{
			if(_loadList[i].res == res)
			{
				return;
			}
		}
		let keys = Object.keys(_audioList);
		if(!~keys.indexOf(key))
		{
			_loadList.push({key:key,res:res,loadCom:loadCom,arg:arg});
			loadSingleRes();
		}else{
			if(loadCom && arg)
			{
				loadCom.call(arg);
			}
		}
	}
	/**音频播放 
	 * -1 为循环播放
	*/
	export function play(key:string,count?:number):void
	{
		if(_audioList[key])
		{
			_audioList[key].play();
			if(count && count == -1)
			{
				_audioList[key].setAttribute("loop","")	
			}
		}
	}
	/**音频停止 */
	export function stop(key:string):void
	{
		if(_audioList[key])
		{
			_audioList[key].stop();
		}
	}
	/**音频销毁 */
	export function destory(key:string):void
	{
		if(_audioList[key])
		{
			_audioList[key].stop();
			delete _audioList[key];
		}
	}
	/**音量设置
	 * range 0-1
	 */
	export function volume(key:string,value:number)
	{
		if(_audioList[key])
		{
			_audioList[key].volume = value;
		}
	}
	/**音频暂停 */
	export function pause(key:string)
	{
		if(_audioList[key])
		{
			_audioList[key].pause();
		}
	}
	
}