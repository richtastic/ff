// V3D.js
V3D.dot = function(a,b){
	return a.x*b.x + a.y*b.y + a.z*b.z;
}
V3D.cross = function(a,b,c){ // axb
	if(c!==undefined){ // a = bxc
		a.set(b.y*c.z-b.z*c.y, b.z*c.x-b.x*c.z, b.x*c.y-b.y*c.x);
		return a;
	} // axb
	c = new V3D(a.y*b.z-a.z*b.y, a.z*b.x-a.x*b.z, a.x*b.y-a.y*b.x);
	return c;
}

function V3D(xP,yP,zP){
	V3D._.constructor.call(this,xP,yP);
	// if( Code.isa(xP,V3D) ){
	// 	this.x = xP.x;
	// 	this.y = xP.y;
	// 	this.z = xP.z;
	// }else{
	this.z = zP===undefined?0.0:zP;
	// }
}
Code.inheritClass(V3D, V2D);
V3D.prototype.copy = function(a){
	this.x = a.x; this.y = a.y; this.z = a.z;
	return this;
}
V3D.prototype.set = function(xV,yV,zV){
	this.x = xV;
	this.y = yV;
	this.z = zV;
	return this;
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
V3D.prototype.homo = function(){
	if(this.z!=0){
		this.x /= this.z;
		this.y /= this.z;
		this.z = 1.0;
	}
}