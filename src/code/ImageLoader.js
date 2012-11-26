// ImageLoader.js

function ImageLoader(base,arr,obj){
	var self = this;
	self.files = new Array();
	self.images = new Array();
	self.index = 0;
	self.fxnComplete = null;
	self.setLoadList = function(base,arr){
		Code.emptyArray(self.files);
		Code.emptyArray(self.images);
		for(var i=0;i<arr.length;++i){
			self.files.push(base+""+arr[i]);
		}
	};
	self.load = function(){
		self.index = -1;
		self.next(null);
	};
	self.next = function(e){
		++self.index;
		if(self.index>=self.files.length){
			if(self.fxnComplete!=null){
				self.fxnComplete(self.images);
			}
			Code.emptyArray(self.images);
			return;
		}
		var img = new Image();
		img.addEventListener("load",self.next,false);
		img.src = self.files[self.index];
		self.images[self.index] = img;
		if(self.verbose){
            console.log("loading image: "+self.files[self.index]);
        }
	};
	self.setFxnComplete = function(fxn){
		self.fxnComplete = fxn;
	};
	self.kill = function(){
		// 
	};
	// constructor
	self.setLoadList(base,arr,obj);
}



