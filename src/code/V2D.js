// V2D.js
function V2D(xP,yP){ // input is debug HTML object
    var self = this;
	this.x = xP; this.y = yP;
	this.length = function(){
		return Math.sqrt(x*x+y*y);
	}
	this.norm = function(){
		dist = Math.sqrt(self.x*self.x+self.y*self.y);
		self.x = self.x/dist; self.y = self.y/dist;
	}
	this.kill = function(){
		self.x = undefined; self.y = undefined;
		//this = null; FF does not like
	}
}

