// Matching.js

function Matching(){
	var self = this;
	self.imageURLList = new Array();
	self.imageObjectList = new Array();
	self.imageURLDirectory = "./images/";
	self.ajax = new Ajax();
	self.yaml = new YAML();
	//self.blob = null;
	this.handle_ajax_success = function(e){
		console.log("SUCCESS: ");
		self.imageObjectList.push(e);
		self.loadNext();
	}
	this.handle_ajax_failure = function(e){
		console.log("FAIL: "+e);
		self.loadNext();
	}
	this.loadIndex = 0;
	this.loadNext = function(){
		if(self.loadIndex>=self.imageURLList.length){
			self.handleAllImagesLoaded();
		}else{
			self.ajax.get(self.imageURLList[self.loadIndex],self.handle_ajax_success,self.handle_ajax_failure);
			++self.loadIndex;
		}
	}
	this.handleAllImagesLoaded = function(){
		console.log("ALL IMAGES LOADED: "+self.imageURLList.length);
	}
	this.constructor = function(){
		var i, len;
		self.imageURLList.push("image_01.png");
		self.imageURLList.push("image_02.png");
		len = self.imageURLList.length;
		for(i=0;i<len;++i){
			self.imageURLList[i] = self.imageURLDirectory+""+self.imageURLList[i];
		}
		// init loading
		self.loadIndex = 0;
		self.loadNext();
	}
	self.constructor();
}