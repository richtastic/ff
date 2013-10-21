// V2D.js
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
	if(this.x==0&&this.y==0){ return 0; }
	return Math.sqrt(this.x*this.x+this.y*this.y);
}
V2D.prototype.lengthSquared = function(){
	return this.x*this.x+this.y*this.y;
}
V2D.prototype.norm = function(){
	if(this.x==0&&this.y==0){ return; }
	dist = Math.sqrt(this.x*this.x+this.y*this.y);
	this.x = this.x/dist; this.y = this.y/dist;
}
V2D.prototype.toString = function(){
	return "<"+this.x+","+this.y+">";
}
V2D.prototype.kill = function(){
	this.x = undefined;
	this.y = undefined;
}

