// V3D.js
V3D.YAML = {
	X:"x",
	Y:"y",
	Z:"z",
}
V3D.EPSILON = 1E-10;
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
V3D.cosAngle = function(a,b){
	var lenA = a.length();
	var lenB = b.length();
	if(lenA!=0 && lenB!=0){
		return Math.max(Math.min( V3D.dot(a,b)/(lenA*lenB),1.0 ),-1.0);
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
V3D.norm = function(a,b){
	if(b===undefined){
		b = a;
		a = b.copy();
	}
	a.copy(b);
	V3D.prototype.norm.apply(a);
	return a;
}
V3D.rotateAngle = function(b,a,dir,ang){ // b = a.rotate(dir,ang)
	if(ang===undefined){
		ang = dir; dir = a, a = b; b = new V3D();
	}
	return V3D.rotate(b,a, V3D.ZERO,dir,ang); // about same origin
}
V3D.fromV2D = function(a,option){
	return new V3D(a.x,a.y, option!==undefined ? option : 0 );
}
V3D.distanceSquare = function(a,b){
	return Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2);
}
V3D.distance = function(a,b){ // len(a-b)
	return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2));
}
V3D.equal = function(a,b, eps){
	if(eps!==undefined){
		return Math.abs(a.x-b.x)<eps && Math.abs(a.y-b.y)<eps && Math.abs(a.z-b.z)<eps;
	}
	return a.x==b.x && a.y==b.y && a.z==b.z;
}
V3D.equalToEpsilon = function(a,b){
	return (Math.abs(a.x-b.x)<V3D.EPSILON) && (Math.abs(a.y-b.y)<V3D.EPSILON) && (Math.abs(a.z-b.z)<V3D.EPSILON);
}
V3D.copy = function(a){
	return (new V3D()).copy(a);
}
V3D.midpoint = function(a,b,c){
	if(c===undefined){
		c = b; b = a; a = new V3D();
	}
	a.set((b.x+c.x)*0.5,(b.y+c.y)*0.5,(b.z+c.z)*0.5);
	return a;
	//return new V3D((a.x+b.x)*0.5,(a.y+b.y)*0.5,(a.z+b.z)*0.5);
}
V3D.add = function(c,a,b){
	if(b!==undefined){
		c.x = a.x+b.x;
		c.y = a.y+b.y;
		c.z = a.z+b.z;
		return c;
	}
	return new V3D(c.x+a.x,c.y+a.y,c.z+a.z);
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
V3D.avg = function(a,b,c){ // a = average(b,c) === midpoint
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
V3D.pushToArray = function(a,v){
	a.push(v.x,v.y,v.z);
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
V3D.prototype.saveToYAML = function(yaml){
	var DATA = V3D.YAML;
	yaml.writeNumber(DATA.X, this.x);
	yaml.writeNumber(DATA.Y, this.y);
	yaml.writeNumber(DATA.Z, this.z);
}
V3D.prototype.loadFromObject = function(obj){
	var DATA = V3D.YAML;
	this.set(obj[DATA.X],obj[DATA.Y],obj[DATA.Z]);
}
V3D.prototype.copy = function(a){
	if(!a){  return new V3D(this.x,this.y,this.z); }
	this.x = a.x; this.y = a.y; this.z = a.z;
	return this;
}
V3D.prototype.set = function(xV,yV,zV){
	this.x = xV; this.y = yV; this.z = zV;
	return this;
}
V3D.prototype.setFromArray = function(a){
	throw "not this";
}
V3D.prototype.fromArray = function(a){
	this.set(a[0],a[1],a[2]);
	return this;
}
V3D.prototype.length = function(){
	return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
}
V3D.prototype.lengthSquare = function(){
	return this.x*this.x+this.y*this.y+this.z*this.z;
}
V3D.prototype.norm = function(){
	dist = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	if(dist==0){ return; }
	this.x = this.x/dist; this.y = this.y/dist; this.z = this.z/dist;
	return this;
}
V3D.prototype.scale = function(c,d,e){
	d = d!==undefined ? d : c;
	e = e!==undefined ? e : c;
	this.x *= c; this.y *= d; this.z *= e;
	return this;
}
V3D.prototype.setLength = function(l){
	this.norm();
	this.x *= l; this.y *= l;  this.z *= l;
	return this;
}
V3D.prototype.add = function(v,w,u){
	if(u!==undefined){
		this.x += v; this.y += w; this.z += u;
	}else{
		this.x += v.x; this.y += v.y; this.z += v.z;
	}
	return this;
}
V3D.prototype.sub = function(v,w,u){
	if(u!==undefined){
		this.x -= v; this.y -= w; this.z -= u;
	}else{
		this.x -= v.x; this.y -= v.y; this.z -= v.z;
	}
	return this;
}
V3D.prototype.wiggle = function(a,b,c){
	if(b===undefined){ b = a; c = a; }
	this.x += (Math.random()-0.5)*a;
	this.y += (Math.random()-0.5)*b;
	this.z += (Math.random()-0.5)*c;
	return this;
}
V3D.prototype.toArray = function(){
	return Code.newArray(this.x,this.y,this.z);
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



// HELPERS:
V3D.meanFromArray = function(pointList){
	// var i, len=pointList.length, pt;
	// var mean = new V3D();
	// for(i=0; i<len; ++i){
	// 	pt = pointList[i];
	// 	mean.add(pt);
	// }
	// mean.scale(1.0/len);
	return V3D.infoFromArray(pointList)["mean"];
}
V3D.infoFromArray = function(pointList){
	return V3D.extremaFromArray(pointList);
}
V3D.extremaFromArray = function(pointList){
	var i, len=pointList.length, pt;
	var minImageX = pointList[0].x, minImageY = pointList[0].y, minImageZ = pointList[0].z;
	var maxImageX = minImageX, maxImageY = minImageY, maxImageZ = minImageZ;
	var mean = pointList[0].copy();
	for(i=1; i<len; ++i){
		pt = pointList[i];
		mean.add(pt);
		minImageX = pt.x<minImageX ? pt.x : minImageX;
		maxImageX = pt.x>maxImageX ? pt.x : maxImageX;
		minImageY = pt.y<minImageY ? pt.y : minImageY;
		maxImageY = pt.y>maxImageY ? pt.y : maxImageY;
		minImageZ = pt.z<minImageZ ? pt.z : minImageZ;
		maxImageZ = pt.z>maxImageZ ? pt.z : maxImageZ;
	}
	mean.scale(1.0/len);
	var minPoint = new V3D(minImageX, minImageY, minImageZ);
	var maxPoint = new V3D(maxImageX, maxImageY, maxImageZ);
	var size = V3D.sub(maxPoint, minPoint);
	var center = size.copy().scale(0.5).add(minPoint);
	return {"min":minPoint, "max":maxPoint, "size":size, "mean":mean, "center":center };
}


