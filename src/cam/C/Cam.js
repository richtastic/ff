// Cam.js
// http://stackoverflow.com/questions/246801/how-can-you-encode-to-base64-using-javascript
function Cam(){
	this.ajax = null;
	this.timer = null;
	this.image = null;
	this.tempimage = null;
	this.output = null;
	this.monthList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	this._init();
}
Cam.prototype._init = function(){
	this.image = document.createElement("img");
	document.body.appendChild(this.image);
	this.tempimage = document.createElement("img");
	document.body.appendChild(this.tempimage);
	this.tempimage.width = 0;
	this.tempimage.height = 0;
	this.tempimage.onload = this.tempimageLoadedFxn;
	this.tempimage.context = this;
	this.output = document.createElement("div");
	document.body.appendChild(this.output);
	this.ajax = new Ajax(true);
	this.timer = new Ticker(500);
	this.timer.addFunction(Ticker.EVENT_TICK,this.timerEvent,this);
	//this.timerEvent();
	this.timer.start();
}
Cam.prototype.tempimageLoadedFxn = function(e){
	//console.log("loaded");
	var ctx = this.context;
	ctx.image.src = ctx.tempimage.src;
	//this.timer.start();
}
Cam.prototype.setOutput = function(s){
	this.output.innerHTML = s;
}
Cam.prototype.setImageSource = function(s){
	this.tempimage.src = s;
}
Cam.prototype.timerEvent = function(o){
	this.timer.stop();
	this.ajax.post("image.json", this, this.ajaxCompleteSuccess, this.ajaxCompleteFailure);
}
Cam.prototype.ajaxImageCompleteSuccess = function(o){
	var b64 = btoa(o);
	this.setImageSource( "data:image/jpg;base64,"+b64 );
}
Cam.prototype.ajaxCompleteSuccess = function(o){
	try{
		var obj = eval('('+o+')');
		var src = obj.currentImage;
		var timeSec = obj.currentTimeSeconds;
		var timeMic = obj.currentTimeMicro; 
		if(timeSec&&timeMic){
			timeSec = Number( timeSec );
			timeMic = Number( timeMic );
			while(timeMic>1){ timeMic*=0.1; }
			tim = (timeSec+timeMic)*1000;
			var dat = new Date(tim);
			var hr = dat.getHours(); hr = hr<12? (hr+1) : (hr-12);
			var ampm = dat.getHours()<12 ? "am":"pm";
			var out = this.monthList[dat.getMonth()]+" "+dat.getDate()+", "+dat.getFullYear()+"  "+hr+":"+dat.getMinutes()+":"+dat.getSeconds()+"."+dat.getMilliseconds()+" "+ampm;
			this.setOutput(out);
		}
		if(src){
			this.setImageSource( src );
		}
	}catch(e){
		console.log("o is not a correct object:");
		console.log(o);
	}
	this.timer.start();
}
Cam.prototype.ajaxCompleteFailure = function(o){
	this.timer.start();
}
Cam.prototype.kill = function(){
	// 
}
//this.ajax.setHeader("Cache-Control","no-cache");
//this.ajax.setHeader("Content-Type","image/jpeg");
//this.ajax.setHeader("Content-Type","application/octet-stream");
//this.ajax.setHeader("Response-Type","arraybuffer");