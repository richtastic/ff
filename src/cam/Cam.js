// Cam.js

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
		self.image.src = s;
	}
	this.timerEvent = function(o){
		self.timer.stop();
		self.ajax.post("image.json", self.ajaxCompleteSuccess, self.ajaxCompleteFailure);
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
	}
	this.ajaxCompleteFailure = function(o){
		//console.log("Failure");
	}
	this.kill = function(){
		// 
	}
// --- constructor
	this.constructor();
};
