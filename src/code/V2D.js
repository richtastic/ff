// V2D.js
//V2D.CONST = "";
V2D.dot = function(a,b){
	return a.x*b.x + a.y*b.y;
}
function V2D(xP,yP){
	this.x = xP==undefined?0.0:xP;
	this.y = yP==undefined?0.0:yP;
}
V2D.prototype.set = function(xV,yV){
	this.x = xV; this.y = yV;
}
V2D.prototype.length = function(){
	return Math.sqrt(this.x*this.x+this.y*this.y);
}
V2D.prototype.lengthSquared = function(){
	return this.x*this.x+this.y*this.y;
}
V2D.prototype.norm = function(){
	dist = Math.sqrt(this.x*this.x+this.y*this.y);
	if(dist==0){ return; }
	this.x = this.x/dist; this.y = this.y/dist;
}
V2D.prototype.toString = function(){
	return "<"+this.x+","+this.y+">";
}
V2D.prototype.kill = function(){
	this.x = undefined;
	this.y = undefined;
}

