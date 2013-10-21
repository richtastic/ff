// Lattice.js

// CLASS VARIABLES
function Lattice(xNum,yNum, obj){
	var self = this;
	this.a = null;
	this.x=0, this.y=0, this.xy=0;
	this.setDims = function(xNum,yNum, obj){
		self.x = xNum; self.y = yNum; self.xy = self.x*self.y;
		if(self.a!=null && self.a!=undefined){
			Code.emptyArray(self.a);
			delete self.a;
		}
		self.a = new Array(self.xy);
		var i;
		if(obj==null || obj==undefined){
			for(i=0;i<self.xy;++i){
				self.a[i] = null;
			}
		}else{
			for(i=0;i<self.xy;++i){
				self.a[i] = new obj();
			}
		}
	}
// -----------------------------------------------
	this.clear = function(){
		var i;
		for(i=0;i<xy;++i){
			a[i].clear();
		}
	}
// -----------------------------------------------
	this.inLimits = function(xN,yN){
		var xF = Math.floor(xN), yF = Math.floor(yN);
		return ( 0<=xF && xF<self.x && 0<=yF && yF<self.y );
	}
	this.getElement = function(xN,yN){
		var xF = Math.floor(xN), yF = Math.floor(yN);
		var i = yF*self.x + xF;
		return self.a[i];
	}
	this.setElement = function(xN,yN, val){
		var xF = Math.floor(xN), yF = Math.floor(yN);
		var i = yF*self.x + xF;
		self.a[i] = val;
	}
	this.getIndex = function(i){
		return self.a[i];
	}
	this.setIndex = function(i, val){
		self.a[i] = val;
	}
	this.getLength = function(){
		return self.xy;
	}
// --------------------------------------------------- constructor
	this.setDims(xNum,yNum, obj);
}



