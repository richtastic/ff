// V2D.js
function V2D(xP,yP){ // input is debug HTML object
    var self = this;
	self.x = xP; self.y = yP;
	self.length = function(){
		return Math.sqrt(self.x*self.x+self.y*self.y);
	}
	self.norm = function(){
		dist = Math.sqrt(self.x*self.x+self.y*self.y);
		self.x = self.x/dist; self.y = self.y/dist;
	}
	self.kill = function(){
		self.x = undefined; self.y = undefined;
		//self = null; FF does not like
	}
}

