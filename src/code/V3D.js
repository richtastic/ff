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
V3D.dotNormal = function(a,b){
	var lenA = a.length();
	var lenB = b.length();
	if(lenA!=0 && lenB!=0){
		return (a.x*b.x + a.y*b.y + a.z*b.z)/(lenA*lenB);
	}
	return 0;
}
V3D.angle = function(a,b){ // check
	var lenA = a.length();
	var lenB = b.length();
	if(lenA!=0 && lenB!=0){
		return Math.acos( Math.max(Math.min( V3D.dot(a,b)/(lenA*lenB),1.0 ),-1.0) );
	}
	return 0;
}
V3D.angleDirection = function(a,b, up){
	throw "angle direction is always positive based on cross-product reference";
	/*
	var ab = V3D.sub(b,a);
	var lenAB = ab.length();
	if(lenAB==0){
		return 0;
	}
	var cross = V3D.cross(a,b).norm();
	//var angle = V3D.angle(a,b);
	var dotAB = V3D.dot(a,b);
	var dotNB = V3D.dot(n,b);
	*/
	var angle = V3D.angle(a,b);
	console.log(" ANGLE:::: "+Code.degrees(angle));
	var n = V3D.cross(a,b).norm();
	var crossNA = V3D.cross(n,a).norm();
	var dot = V3D.dot(crossNA,b);
	console.log("  dot: "+dot+"");
	if(dot>=0){
		return angle;
	}
	return -angle;
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
V3D.areaTri = function(a,b,c){ // 1/2 cross
	return V3D.crossTriMag(a,b,c)*0.5;
}
V3D.normTri = function(a,b,c){
	return V3D.crossTri(a,b,c).norm();
}
V3D.crossTri = function(a,b,c){ // ||ab x bc||
	var abX = b.x-a.x;
	var abY = b.y-a.y;
	var abZ = b.z-a.z;
	var acX = c.x-a.x;
	var acY = c.y-a.y;
	var acZ = c.z-a.z;
	var x = abY*acZ - abZ*acY;
	var y = abZ*acX - abX*acZ;
	var z = abX*acY - abY*acX;
	return new V3D(x,y,z);
}
V3D.crossTriMag = function(a,b,c){ // ||ab x bc||
	return V3D.crossTri(a,b,c).length();
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
V3D.orthogonal = function(v){ // find direction perpendicular to vector
	var d = new V3D(1,1,1);
	var dot = V3D.dot(d,v);
	if(dot==0){
		d.x = 0;
	}
	V3D.cross(d, v,d);
	d.norm();
	return d;
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
V3D.prototype.toYAML = function(yaml){
	var obj = this.toObject();
	yaml.writeObjectLiteral(obj);
	return this;
}
V3D.prototype.toObject = function(){
	var DATA = V3D.YAML;
	var object = {};
	object[DATA.X] = this.x;
	object[DATA.Y] = this.y;
	object[DATA.Z] = this.z;
	return object;
}
V3D.prototype.fromObject = function(obj){
	var DATA = V3D.YAML;
	this.set(obj[DATA.X],obj[DATA.Y],obj[DATA.Z]);
	return this;
}
V3D.prototype.copy = function(a){
	if(!a){  return new V3D(this.x,this.y,this.z); }
	this.x = a.x; this.y = a.y; this.z = a.z;
	return this;
}
V3D.prototype.set = function(xV,yV,zV){
	if(zV===undefined){
// TODO: CHECK IF xV IS A V3D?
//		console.log(xV,yV,zV);
		this.x = xV.x;
		this.y = xV.y;
		this.z = xV.z;
	}else{
		this.x = xV; this.y = yV; this.z = zV;
	}
	return this;
}
V3D.prototype.fromArray = function(a){
	this.set(a[0],a[1],a[2]);
	return this;
}
V3D.prototype.length = function(l){
	if(l!==undefined){
		this.norm();
		this.scale(l);
		return l;
	}
	return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
}
V3D.prototype.lengthSquare = function(){
	return this.x*this.x+this.y*this.y+this.z*this.z;
}
V3D.prototype.norm = function(){
	dist = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	if(dist!=0){
		this.x = this.x/dist; this.y = this.y/dist; this.z = this.z/dist;
	}
	return this;
}
V3D.prototype.scale = function(c,d,e){
	d = d!==undefined ? d : c;
	e = e!==undefined ? e : c;
	this.x *= c; this.y *= d; this.z *= e;
	return this;
}
V3D.prototype.rotate = function(dir,ang){
	return V3D.rotateAngle(this,this, dir,ang);
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
V3D.prototype.random = function(a,b,c){
	return this.wiggle(a,b,c);
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

V3D.removeDuplicates = function(points){
	var i, j, p, l, len=points.length;
	var list = [];
	for(i=0; i<len; ++i){
		p = points[i];
		var found = false;
		for(j=0; j<list.length; ++j){
			l = list[j];
			if(V3D.equal(p,l)){
				found = true;
				break;
			}
		}
		if(!found){
			list.push(p);
		}
	}
	return list;
}
V3D.min = function(out, a,b){
	if(b===undefined){
		b = a;
		a = out;
		out = new V3D();
	}
	out.x = Math.min(a.x,b.x);
	out.y = Math.min(a.y,b.y);
	out.z = Math.min(a.z,b.z);
	return out;
}
V3D.max = function(out, a,b){
	if(b===undefined){
		b = a;
		a = out;
		out = new V3D();
	}
	out.x = Math.max(a.x,b.x);
	out.y = Math.max(a.y,b.y);
	out.z = Math.max(a.z,b.z);
	return out;
}
// HELPERS:
V3D.meanFromArray = function(pointList){
	// var i, len=pointList.length, pt;
	// var mean = new V3D();
	// for(i=0; i<len; ++i){
	// 	pt = pointList[i];
	// 	mean.add(pt);
	// }`
	// mean.scale(1.0/len);
	return V3D.infoFromArray(pointList)["mean"];
}
V3D.mean = function(pointList){
	return V3D.meanFromArray(pointList);
}
V3D.average = function(pointList, weights){
	var N = pointList.length;
	var p = 1.0/N;
	var avg = new V3D(0,0,0);
	for(var i=0; i<N; ++i){
		var v = pointList[i];
		if(weights){
			p = weights[i];
		}
		avg.add(p*v.x,p*v.y,p*v.z);
	}
	return avg;
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
