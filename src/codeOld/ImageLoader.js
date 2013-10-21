// ImageLoader.js

function ImageLoader(base,arr){
	var self = this;
	self._files = new Array();
	self._images = new Array();
	self._index = 0;
	self.fxnComplete = null;
	self.setLoadList = function(base,arr){
		if(!base || !arr){ return; }
		Code.emptyArray(self._files);
		Code.emptyArray(self._images);
		for(var i=0;i<arr.length;++i){
			self._files.push(base+""+arr[i]);
		}
	};
	self.load = function(){
		self._index = -1;
		self.next(null);
	};
	self.next = function(e){
		++self._index;
		if(self._index>=self._files.length){
			if(self.fxnComplete!=null){
				self.fxnComplete(self._images);
			}
			Code.emptyArray(self._images);
			return;
		}
		var img = new Image();
		img.addEventListener("load",self.next,false);
		//img.crossOrigin = '';
		img.src = self._files[self._index];
		self._images[self._index] = img;
		if(self.verbose){
            console.log("loading image: "+self._files[self._index]);
        }
	};
	self.setFxnComplete = function(fxn){
		self.fxnComplete = fxn;
	};
	self.kill = function(){
		// 
	};
	self.images = function(){
		return self._images;
	}
	// constructor
	self.setLoadList(base,arr);
}



