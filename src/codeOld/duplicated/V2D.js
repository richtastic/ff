// V2D.js
V2D.dot = function(a,b){
	return a.x*b.x + a.y*b.y;
}

function V2D(xP,yP){ // input is debug HTML object
    var self = this;
	this.x = xP==undefined?0.0:xP; this.y = yP==undefined?0.0:yP;
	this.set = function(xV,yV){
		this.x = xV; this.y = yV;
	}
	this.length = function(){
		if(self.x==0&&self.y==0){ return 0; }
		return Math.sqrt(self.x*self.x+self.y*self.y);
	}
	this.lengthSquared = function(){
		return self.x*self.x+self.y*self.y;
	}
	this.norm = function(){
		if(self.x==0&&self.y==0){ return; }
		dist = Math.sqrt(self.x*self.x+self.y*self.y);
		self.x = self.x/dist; self.y = self.y/dist;
	}
	this.toString = function(){
		return "<"+self.x+","+self.y+">";
	}
	this.kill = function(){
		self.x = undefined; self.y = undefined;
		//self = null; FF does not like
	}
}

