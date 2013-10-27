// 3D.js
V3D.dot = function(a,b){
	return a.x*b.x + a.y*b.y + a.z*b.z;
}
function V3D(xP,yP,zP){
	V3D._.constructor.call(this,xP,yP);
	this.z = zP==undefined?0.0:zP;
}
Code.inheritClass(V3D, V2D);
V3D.prototype.set = function(xV,yV,zV){
	this.x = xV;
	this.y = yV;
	this.z = zV;
}
V3D.prototype.length = function(){
	return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
}
V3D.prototype.lengthSquared = function(){
	return this.x*this.x+this.y*this.y+this.z*this.z;
}
V3D.prototype.norm = function(){
	dist = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	if(dist==0){ return; }
	this.x = this.x/dist; this.y = this.y/dist; this.z = this.z/dist;
}
V3D.prototype.toString = function(){
	return "<"+this.x+","+this.y+","+this.z+">";
}
V3D.prototype.kill = function(){
	V3D._.kill.call(this);
	this.z = undefined;
}
