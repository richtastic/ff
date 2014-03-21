// V5D.js
function V5D(xP,yP,zP,tP,uP){
	V5D._.constructor.call(this,xP,yP,zP,tP);
	this.u = uP==undefined?0.0:uP;
}
Code.inheritClass(V5D, V4D);
V5D.prototype.copy = function(a){
	this.x = a.x; this.y = a.y; this.z = a.z; this.t = a.t; this.u = a.u;
}
V5D.prototype.set = function(xV,yV,zV,uV){
	this.x = xV;
	this.y = yV;
	this.z = zV;
	this.t = tV;
	this.u = uV;
}
V5D.prototype.toString = function(){
	return "<"+this.x+","+this.y+","+this.z+","+this.t+","+this.u+">";
}
V5D.prototype.kill = function(){
	this.u = undefined;
	V5D._.kill.call(this);
}
