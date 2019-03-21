// V2D.js
V2D.YAML = {
	X:"x",
	Y:"y",
}

V2D.dot = function(a,b){
	return a.x*b.x + a.y*b.y;
}
V2D.dotNorm = function(a,b){
	return (a.x*b.x + a.y*b.y)/(a.length()*b.length());
}
V2D.cross = function(a,b){ // z direction
	return a.x*b.y-a.y*b.x;
}
V2D.crossOrigin = function(o,a,b){ // cross vectors oa & ob
	return (a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
}
V2D.areaTri = function(a,b,c){
	return V2D.crossTri(a,b,c)*0.5;
}
V2D.crossTri = function(a,b,c){ // ab x bc // - area of a TRIANGLE is 1/2 of this
	return (b.x-a.x)*(c.y-b.y) - (b.y-a.y)*(c.x-b.x);
}
V2D.rotate = function(b, a,ang){ // b = a.rotate(ang)
	if(ang===undefined){
		ang = a; a = b; b = new V2D();
	}
	var cos = Math.cos(ang), sin = Math.sin(ang);
	var x = a.x*cos - a.y*sin;
	b.y = a.x*sin + a.y*cos;
	b.x = x;
	return b;
}
V2D.len = function(v){ // function.length is reserved by JS
	return Math.sqrt(v.x*v.x+v.y*v.y);
}
V2D.distanceSquare = function(a,b){
	return Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2);
}
V2D.distance = function(a,b){ // len(a-b)
	return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2));
}
V2D.equal = function(a,b, eps){
	if(eps!==undefined){
		return Math.abs(a.x-b.x)<eps && Math.abs(a.y-b.y)<eps;
	}
	return a.x==b.x && a.y==b.y;
}
V2D.copy = function(a){
	return (new V2D()).copy(a);
}
V2D.midpoint = function(a,b,c){
	if(c!==undefined){
		a.set((b.x+c.x)*0.5,(b.y+c.y)*0.5);
		return a;
	}
	c = a.copy();
	c.set((a.x+b.x)*0.5,(a.y+b.y)*0.5);
	return c;
}
V2D.pointAtT = function(a,b,c,t){
	var t1;
	if(t!==undefined){
		t1 = 1.0 - t;
		a.set(b.x*t1+c.x*t, b.y*t1+c.y*t);
		return a;
	}
	t = c;
	t1 = 1.0 - t;
	c = new V2D(a.x*t1+b.x*t, a.y*t1+b.y*t);
	return c;
}
V2D.add = function(c,a,b){
	if(b!==undefined){
		c.x = a.x+b.x;
		c.y = a.y+b.y;
		return c;
	}
	return new V2D(c.x+a.x,c.y+a.y);
}
V2D.sub = function(c,a,b){
	if(b!==undefined){
		c.x = a.x-b.x;
		c.y = a.y-b.y;
		return c;
	}
	return new V2D(c.x-a.x,c.y-a.y);
}

V2D.avg = function(a,b,c){ // a = average(b,c) === midpoint
	if(c===undefined){ c = b; b = a; a = new V2D(); }
	a.set( (b.x+c.x)*0.5, (b.y+c.y)*0.5 );
	return a;
}
V2D.scale = function(a,b,c){ // a = b*c
	if(c===undefined){ c = b; b = a; a = new V2D(); }
	a.set( b.x*c, b.y*c );
	return a;
}
V2D.min = function(a,b,c){ // a = min(b,c)
	if(c===undefined){ c = b; b = a; a = new V2D(); }
	a.x = b.x<c.x?b.x:c.x;
	a.y = b.y<c.y?b.y:c.y;
	return a;
}
V2D.max = function(a,b,c){ // a = max(b,c)
	if(c===undefined){ c = b; b = a; a = new V2D(); }
	a.x = b.x>c.x?b.x:c.x;
	a.y = b.y>c.y?b.y:c.y;
	return a;
}
V2D.norm = function(a,b){
	if(b===undefined){
		b = a;
		a = b.copy();
	}
	a.copy(b);
	a.norm();
	return a;
}
V2D.angle = function(a,b){
	var lenA = a.length();
	var lenB = b.length();
	if(lenA!=0 && lenB!=0){
		//return Math.acos(V2D.dot(a,b)/(lenA*lenB));
		return Math.acos( Math.max(Math.min( V2D.dot(a,b)/(lenA*lenB),1.0 ),-1.0) );
	}
	return 0;
}
V2D.cosAngle = function(a,b){
	var lenA = a.length();
	var lenB = b.length();
	if(lenA!=0 && lenB!=0){
		return Math.max(Math.min( V2D.dot(a,b)/(lenA*lenB),1.0 ),-1.0);
	}
	return 0;
}
V2D.angleDirection = function(a,b){
	var angle = V2D.angle(a,b);
	var cross = V2D.cross(a,b);
	if(cross>=0){
		return angle;
	}
	return -angle;
}
V2D.shiftPoints = function(a,b,c){
	if(c===undefined){
		c = b.y;
		b = b.x;
	}
	for(var i=a.length-1; i>=0; --i){
		a[i].x += b;
		a[i].y += c;
	}
}
V2D.fromMagnitudeAndAngle = function(mag, ang){
	var v = new V2D(1,0); // assumed starting from x axis
	v.scale(mag);
	v.rotate(ang);
	return v;
}
V2D.fromArray = function(a){
	v = new V2D(a[0],a[1]);
	return v;
}

function V2D(xP,yP){
	this.x = xP==undefined?0.0:xP;
	this.y = yP==undefined?0.0:yP;
}
V2D.prototype.toYAML = function(yaml){
	var obj = this.toObject();
	yaml.writeObjectLiteral(obj);
	return this;
}
V2D.prototype.toObject = function(){
	var DATA = V2D.YAML;
	var object = {};
	object[DATA.X] = this.x;
	object[DATA.Y] = this.y;
	return object;
}
V2D.prototype.fromObject = function(obj){
	var DATA = V2D.YAML;
	this.set(obj[DATA.X],obj[DATA.Y]);
	return this;
}
V2D.prototype.copy = function(a){
	if(a===undefined){ return new V2D(this.x,this.y); }
	this.x = a.x; this.y = a.y;
	return this;
}
V2D.prototype.wiggle = function(a,b){
	if(b===undefined){ b = a; }
	this.x += (Math.random()-0.5)*a;
	this.y += (Math.random()-0.5)*b;
	return this;
}
V2D.randomRect = function(minX,maxX,minY,maxY){
	if(minY===undefined){
		maxY = maxX;
		maxX = minX;
		minX = 0;
		minY = 0;
	}
	var v = new V2D(Code.randomFloat(minX,maxX),Code.randomFloat(minY,maxY));
	return v;
}
V2D.prototype.set = function(x,y){
	if(y===undefined){
		this.x = x.x;
		this.y = x.y;
	}else{
		this.x = x; this.y = y;
	}
	return this;
}
V2D.prototype.ceil = function(a){
	this.x = Math.ceil(this.x);
	this.y = Math.ceil(this.y);
	return this;
}
V2D.prototype.floor = function(a){
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
	return this;
}
V2D.prototype.flip = function(a){
	this.x = -this.x;
	this.y = -this.y;
	return this;
}
V2D.prototype.min = function(a){
	this.x = Math.min(this.x,a.x);
	this.y = Math.min(this.y,a.y);
	return this;
}
V2D.prototype.max = function(a){
	this.x = Math.max(this.x,a.x);
	this.y = Math.max(this.y,a.y);
	return this;
}
V2D.prototype.rotate = function(a){
	V2D.rotate(this,this,a);
	return this;
}
V2D.prototype.fromArray = function(a){
	this.set(a[0],a[1]);
	return this;
}
V2D.prototype.length = function(){
	return Math.sqrt(this.x*this.x+this.y*this.y);
}
V2D.prototype.lengthSquare = function(){
	return this.x*this.x+this.y*this.y;
}
V2D.prototype.norm = function(){
	var dist = Math.sqrt(this.x*this.x+this.y*this.y);
	if(dist!=0){
		this.x = this.x/dist; this.y = this.y/dist;
	}
	return this;
}
V2D.prototype.scale = function(c,d){
	d = d!==undefined ? d : c;
	this.x *= c; this.y *= d;
	return this;
}
V2D.prototype.setLength = function(l){
	this.norm();
	this.x *= l; this.y *= l;
	return this;
}
V2D.prototype.add = function(v,w){
	if(w!==undefined){
		this.x += v; this.y += w;
	}else{
		this.x += v.x; this.y += v.y;
	}
	return this;
}
V2D.prototype.sub = function(v,w){
	if(w!==undefined){
		this.x -= v; this.y -= w;
	}else{
		this.x -= v.x; this.y -= v.y;
	}
	return this;
}
V2D.prototype.toArray = function(){
	return Code.newArray(this.x,this.y);
}
V2D.prototype.toString = function(){
	return "<"+this.x+","+this.y+">";
}
V2D.prototype.kill = function(){
	this.x = undefined;
	this.y = undefined;
}
V2D.prototype.homo = function(){
	if(this.y!=0){
		this.x /= this.y;
		this.y = 1.0;
	}
}
V2D.prototype.directionToAngle = function(){
	return -V2D.angle(this,V2D.DIRX);
}
V2D.ZERO = new V2D(0.0,0.0);
V2D.DIRX = new V2D(1.0,0.0);
V2D.DIRY = new V2D(0.0,1.0);


// HELPERS:
V2D.min = function(out, a,b){
	if(b===undefined){
		b = a;
		a = out;
		out = new V2D();
	}
	out.x = Math.min(a.x,b.x);
	out.y = Math.min(a.y,b.y);
	return out;
}
V2D.max = function(out, a,b){
	if(b===undefined){
		b = a;
		a = out;
		out = new V2D();
	}
	out.x = Math.max(a.x,b.x);
	out.y = Math.max(a.y,b.y);
	return out;
}
V2D.average = function(pointList, weights){
	var N = pointList.length;
	var p = 1.0/N;
	var avg = new V2D(0,0);
	for(var i=0; i<N; ++i){
		var v = pointList[i];
		if(weights){
			p = weights[i];
		}
		avg.add(p*v.x,p*v.y);
	}
	return avg;
}
V2D.removeDuplicates = function(points){
	var i, j, p, l, len=points.length;
	var list = [];
	for(i=0; i<len; ++i){
		p = points[i];
		var found = false;
		for(j=0; j<list.length; ++j){
			l = list[j];
			if(V2D.equal(p,l)){
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
V2D.meanFromArray = function(pointList, weights){
	var i, len=pointList.length, pt;
	var mean = new V2D();
	var weight = 1.0/len;
	for(i=0; i<len; ++i){
		pt = pointList[i];
		//mean.add(pt);
		if(weights){
			weight = weights[i];
		}
		mean.x += pt.x * weight;
		mean.y += pt.y * weight;
	}
	//mean.scale(1.0/len);
	return mean;
}
V2D.extremaFromArray = function(pointList){
	// if(pointList.length==0){
	// 	return null;
	// }
	var i, len=pointList.length, pt;
	var minImageX = null, minImageY = null;
	var maxImageX = null, maxImageY = null;
	for(i=0; i<len; ++i){
		pt = pointList[i];
		if(minImageX==null || pt.x<minImageX){
			minImageX = pt.x;
		}
		if(maxImageX==null || pt.x>maxImageX){
			maxImageX = pt.x;
		}
		if(minImageY==null || pt.y<minImageY){
			minImageY = pt.y;
		}
		if(maxImageY==null || pt.y>maxImageY){
			maxImageY = pt.y;
		}
	}
	var minPoint = new V2D(minImageX, minImageY);
	var maxPoint = new V2D(maxImageX, maxImageY);
	var size = V2D.sub(maxPoint, minPoint);
	return {"min":minPoint, "max":maxPoint, "size":size};
}
V2D.minX = function(pointList){
	if(pointList.length==0){
		return null;
	}
	var i, p;
	var minP = pointList[0];
	for(i=pointList.length-1; i>=0; i--){
		p = pointList[i];
		if(p.x<minP.x){
			minP = p;
		}
	}
	return minP;
}
V2D.maxX = function(pointList){
	if(pointList.length==0){
		return null;
	}
	var i, p;
	var minP = pointList[0];
	for(i=pointList.length-1; i>=0; i--){
		p = pointList[i];
		if(p.x>minP.x){
			minP = p;
		}
	}
	return minP;
}
V2D.minY = function(pointList){
	if(pointList.length==0){
		return null;
	}
	var i, p;
	var minP = pointList[0];
	for(i=pointList.length-1; i>=0; i--){
		p = pointList[i];
		if(p.y<minP.y){
			minP = p;
		}
	}
	return minP;
}
V2D.maxY = function(pointList){
	if(pointList.length==0){
		return null;
	}
	var i, p;
	var minP = pointList[0];
	for(i=pointList.length-1; i>=0; i--){
		p = pointList[i];
		if(p.y>minP.y){
			minP = p;
		}
	}
	return minP;
}
V2D.infoArray = function(pointList){
	var i, p;
	var min = null;
	var max = null;
	var center = null;
	var size = new V2D(0,0);
	if(pointList.length>0){
		min = pointList[0].copy();
		max = min.copy();
		for(i=pointList.length-1; i>=0; i--){
			p = pointList[i];
			V2D.min(min,min,p);
			V2D.max(max,max,p);
		}
		size = V2D.sub(max,min);
		center = V2D.avg(max,min);
	}
	return {"min":min, "max":max, "size":size, "center":center};
}
