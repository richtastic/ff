// V2D.js
function V2D(xP,yP){ // input is debug HTML object
    var self = this;
	this.x = xP==undefined?0.0:xP; this.y = yP==undefined?0.0:yP;
	this.length = function(){
		return Math.sqrt(this.x*this.x+this.y*this.y);
	}
	this.norm = function(){
		dist = Math.sqrt(this.x*this.x+this.y*this.y);
		this.x = this.x/dist; this.y = this.y/dist;
	}
	this.toString = function(){
		return "<"+this.x+","+this.y+">";
	}
	this.kill = function(){
		this.x = undefined; this.y = undefined;
		//self = null; FF does not like
	}
}

