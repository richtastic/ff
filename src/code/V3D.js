// V3D.js
V3D.dot = function(a,b){
	return a.x*b.x + a.y*b.y + a.z*b.z;
}
V3D.angle = function(a,b){ // check
	var lenA = a.length();
	var lenB = b.length();
	if(lenA!=0 && lenB!=0){
		return Math.acos( Math.max(Math.min( V3D.dot(a,b)/(lenA*lenB),1.0 ),-1.0) );
	}
	return 0;
}
V3D.cross = function(a,b,c){ // axb
	if(c!==undefined){
		a.set(b.y*c.z-b.z*c.y, b.z*c.x-b.x*c.z, b.x*c.y-b.y*c.x);
		return a;
	}
	return new V3D(a.y*b.z-a.z*b.y, a.z*b.x-a.x*b.z, a.x*b.y-a.y*b.x);
}
V3D.diff = function(a,b,c){ // a-b
	if(c!==undefined){
		a.set(b.x-c.x,b.y-c.y,b.z-c.z);
		return a;
	}
	return new V3D(a.x-b.x,a.y-b.y,a.z-b.z);
}
V3D.distance = function(a,b){ // len(a-b)
	return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2));
}
V3D.equal = function(a,b){
	return a.x==b.x && a.y==b.y && a.z==b.z;
}
V3D.midpoint = function(a,b,c){
	if(c!==undefined){
		a.set((b.x+c.x)*0.5,(b.y+c.y)*0.5,(b.z+c.z)*0.5);
		return a;
	}
	return new V2D((a.x+b.x)*0.5,(a.y+b.y)*0.5,(a.z+b.z)*0.5);
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
	this.x = xV; this.y = yV; this.z = zV;
	return this;
}
V3D.prototype.setFromArray = function(a){
	this.set(a[0],a[1],a[2]);
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