// V2D.js

V2D.dot = function(a,b){
	return a.x*b.x + a.y*b.y;
}
V2D.cross = function(a,b){ // z direction
	return a.x*b.y-a.y*b.x;
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
V2D.distanceSquare = function(a,b){
	return Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2);
}
V2D.distance = function(a,b){ // len(a-b)
	return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2));
}
V2D.equal = function(a,b){
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
	return new V2D((a.x+b.x)*0.5,(a.y+b.y)*0.5);
}
V2D.add = function(c,a,b){
	if(b!==undefined){
		c.x = a.x+b.x;
		c.y = a.y+b.y;
		return c;
	}
	return new V2D(c.x+a.x,c.y+a.y);
}
V2D.sub = function(c,a,b){ // same as diff
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
V2D.angle = function(a,b){
	var lenA = a.length();
	var lenB = b.length();
	if(lenA!=0 && lenB!=0){
		//return Math.acos(V2D.dot(a,b)/(lenA*lenB));
		return Math.acos( Math.max(Math.min( V2D.dot(a,b)/(lenA*lenB),1.0 ),-1.0) );
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
function V2D(xP,yP){
	this.x = xP==undefined?0.0:xP;
	this.y = yP==undefined?0.0:yP;
}
V2D.prototype.copy = function(a){
	this.x = a.x; this.y = a.y;
	return this;
}
V2D.prototype.set = function(xV,yV){
	this.x = xV; this.y = yV;
	return this;
}
V2D.prototype.flip = function(a){
	this.x = -this.x; this.y = -this.y;
	return this;
}
V2D.prototype.setFromArray = function(a){
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
	dist = Math.sqrt(this.x*this.x+this.y*this.y);
	if(dist==0){ return; }
	this.x = this.x/dist; this.y = this.y/dist;
	return this;
}
V2D.prototype.scale = function(c){
	this.x *= c; this.y *= c;
	return this;
}
V2D.prototype.setLength = function(l){
	this.norm();
	this.x *= l; this.y *= l;
	return this;
}
V2D.prototype.add = function(v){
	this.x += v.x; this.y += v.y;
	return this;
}
V2D.prototype.sub = function(v){
	this.x -= v.x; this.y -= v.y;
	return this;
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

V2D.ZERO = new V2D(0.0,0.0);
V2D.DIRX = new V2D(1.0,0.0);
V2D.DIRY = new V2D(0.0,1.0);

