// Cam.js
// http://stackoverflow.com/questions/246801/how-can-you-encode-to-base64-using-javascript
function Cam(){
	var self = this;
	this.ajax = null;
	this.timer = null;
	this.image = null;
	this.output = null;
	this.monthList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	this.constructor = function(){
		self.image = document.createElement("img");
		document.body.appendChild(self.image);
		self.output = document.createElement("div");
		document.body.appendChild(self.output);
		self.ajax = new Ajax();
		self.timer = new Ticker(1000);
		self.timer.addFunction(Ticker.EVENT_TICK,self.timerEvent);
		self.timerEvent();
	}
	this.setOutput = function(s){
		self.output.innerHTML = s;
	}
	this.setImageSource = function(s){
		self.image.src = s;//+"?"+Math.floor(Math.random()*10000000);
	}
	this.timerEvent = function(o){
		self.timer.stop();
		//console.log("tick");
		//self.ajax.setHeader("Cache-Control","no-cache");
		//self.ajax.setHeader("Content-Type","image/jpeg");
		//self.ajax.setHeader("Content-Type","application/octet-stream");
		//self.ajax.setHeader("Response-Type","arraybuffer");
		self.ajax.post("image.json", self.ajaxCompleteSuccess, self.ajaxCompleteFailure);
//self.ajax.get("image.jpg", self.ajaxImageCompleteSuccess);
	}
this.ajaxImageCompleteSuccess = function(o){
	//var reader = new FileReader();
	console.log(o);
	var b64 = btoa(o);
	//var b64 = atob(o);
	//var b64 = ConvertToBase64(o);
	console.log( b64 );
	//reader.onload = function(e){ console.log("reader loaded"); console.log(e); }
	//console.log(reader.readAsDataURL);
	//reader.readAsDataURL(o);
	//console.log(reader);
	self.setImageSource( "data:image/jpg;base64,"+b64 );
	if(o){
		
	}
	self.timer.start();
}
	this.ajaxCompleteSuccess = function(o){
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
			var out = self.monthList[dat.getMonth()]+" "+dat.getDate()+", "+dat.getFullYear()+"  "+hr+":"+dat.getMinutes()+":"+dat.getSeconds()+"."+dat.getMilliseconds()+" "+ampm;
			self.setOutput(out);
		}
		if(src){
			self.setImageSource( src );
		}
		self.timer.start();
	}
	this.ajaxCompleteFailure = function(o){
		//console.log("Failure");
		self.timer.start();
	}
	this.kill = function(){
		// 
	}
// --- constructor
	this.constructor();
};
