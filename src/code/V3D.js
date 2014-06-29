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
V3D.rotate = function(to,from,org,dir,ang){ // to = (from-org).rotate(dir,ang)  (dir better be unit normal)
	var x = from.x, y = from.y, z = from.z;
	var a = org.x, b = org.y, c = org.z;
	var u = dir.x, v = dir.y, w = dir.z;
	var uu = u*u, vv = v*v, ww = w*w; // squares
	var ux_vy_wz = u*x + v*y + w*z; // dot
	var au = a*u, bv = b*v, cw = c*w; // partial dots
	var cos = Math.cos(ang), sin = Math.sin(ang), m1c = 1.0 - cos;
	var X = (a*(vv+ww) - u*(bv+cw-ux_vy_wz))*m1c + x*cos + (b*w - c*v - w*y + v*z)*sin;
	var Y = (b*(uu+ww) - v*(au+cw-ux_vy_wz))*m1c + y*cos - (a*w - c*u - w*x + u*z)*sin;
	var Z = (c*(uu+vv) - w*(au+bv-ux_vy_wz))*m1c + z*cos + (a*v - b*u - v*x + u*y)*sin;
	to.set(X,Y,Z);
	return to;
}
V3D.rotateAngle = function(b,a,dir,ang){ // b = a.rotate(dir,ang)
	if(ang===undefined){
		ang = dir; dir = a, a = b; b = new V3D();
	}
	return V3D.rotate(b,a, V3D.ZERO,dir,ang); // about same origin
}
V3D.diff = function(a,b,c){ // a-b
	if(c!==undefined){
		a.set(b.x-c.x,b.y-c.y,b.z-c.z);
		return a;
	}
	return new V3D(a.x-b.x,a.y-b.y,a.z-b.z);
}
V3D.distanceSquare = function(a,b){
	return Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2);
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
	return new V3D((a.x+b.x)*0.5,(a.y+b.y)*0.5,(a.z+b.z)*0.5);
}
V3D.add = function(c,a,b){
	if(b!==undefined){
		c.x = a.x+b.x;
		c.y = a.y+b.y;
		c.z = a.z+b.z;
		return c;
	}
	return new V3D(c.x+a.x,c.y+a.y);
}
V3D.sub = function(c,a,b){
	if(b!==undefined){
		c.x = a.x-b.x;
		c.y = a.y-b.y;
		c.z = a.z-b.z;
		return c;
	}
	return new V3D(c.x-a.x,c.y-a.y,c.z-a.z);
}
V3D.avg = function(a,b,c){ // a = average(b,c)
	if(c===undefined){ c = b; b = a; a = new V3D(); }
	a.set( (b.x+c.x)*0.5, (b.y+c.y)*0.5, (b.z+c.z)*0.5 );
	return a;
}
V3D.scale = function(a,b,c){ // a = b*c
	if(c===undefined){ c = b; b = a; a = new V3D(); }
	a.set( b.x*c, b.y*c, b.z*c );
	return a;
}
V3D.min = function(a,b,c){ // a = min(b,c)
	if(c===undefined){ c = b; b = a; a = new V3D(); }
	a.x = b.x<c.x?b.x:c.x;
	a.y = b.y<c.y?b.y:c.y;
	a.z = b.z<c.z?b.z:c.z;
	return a;
}
V3D.max = function(a,b,c){ // a = max(b,c)
	if(c===undefined){ c = b; b = a; a = new V3D(); }
	a.x = b.x>c.x?b.x:c.x;
	a.y = b.y>c.y?b.y:c.y;
	a.z = b.z>c.z?b.z:c.z;
	return a;
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
	if(a){
		this.x = a.x; this.y = a.y; this.z = a.z;
		return this;
	}
	return new V3D(this.x,this.y,this.z);
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
	return this;
}
V3D.prototype.scale = function(c){
	this.x *= c; this.y *= c; this.z *= c;
	return this;
}
V3D.prototype.setLength = function(l){
	this.norm();
	this.x *= l; this.y *= l;  this.z *= l;
	return this;
}
V3D.prototype.add = function(v){
	this.x += v.x; this.y += v.y; this.z += v.z;
	return this;
}
V3D.prototype.sub = function(v){
	this.x -= v.x; this.y -= v.y; this.z -= v.z;
	return this;
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
V3D.ZERO = new V3D(0.0,0.0,0.0);
V3D.DIRX = new V3D(1.0,0.0,0.0);
V3D.DIRY = new V3D(0.0,1.0,0.0);
V3D.DIRZ = new V3D(0.0,0.0,1.0);
