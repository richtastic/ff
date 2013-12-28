// V4D.js
V4D.dot = function(a,b){
	return a.x*b.x + a.y*b.y + a.z*b.z + a.t*b.t;
}
function V4D(xP,yP,zP,tP){
	V4D._.constructor.call(this,xP,yP,zP);
	this.t = tP==undefined?0.0:tP;
}
Code.inheritClass(V4D, V3D);
V4D.prototype.set = function(xV,yV,zV,tV){
	this.x = xV;
	this.y = yV;
	this.z = zV;
	this.t = tV;
}
V4D.prototype.toString = function(){
	return "<"+this.x+","+this.y+","+this.z+","+this.t+">";
}
V4D.prototype.kill = function(){
	this.t = undefined;
	V4D._.kill.call(this);
}
