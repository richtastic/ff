// Tri3D.js
function Tri3D(a,b,c){ // CCW+
	Tri3D._.constructor.call(this,a,b,c);
}
Code.inheritClass(Tri3D, Tri2D);
Tri3D.fromPoints = function(a,b,c){
	return (new Tri3D(a,b,c));
}
Tri3D.fromList = function(ax,ay,az, bx,by,bz, cx,cy,cz){
	return new Tri3D(new V3D(ax,ay,az), new V3D(bx,by,bz), new V3D(cx,cy,cz));
}
Tri3D.prototype.min = function(){
	var v = this.A().copy();
	V3D.min(v, v,this.B());
	V3D.min(v, v,this.C());
	return v;
}
Tri3D.prototype.max = function(){
	var v = this.A().copy();
	V3D.max(v, v,this.B());
	V3D.max(v, v,this.C());
	return v;
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri3D.prototype.isEqual = function(tri){
	var a1 = tri.A();
	var b1 = tri.B();
	var c1 = tri.C();
	var a2 = this.A();
	var b2 = this.B();
	var c2 = this.C();
	if( ( V3D.equalToEpsilon(a1,a2) && V3D.equalToEpsilon(b1,b2) && V3D.equalToEpsilon(c1,c2) ) ||
		( V3D.equalToEpsilon(a1,a2) && V3D.equalToEpsilon(c1,b2) && V3D.equalToEpsilon(b1,c2) ) ||
		( V3D.equalToEpsilon(b1,a2) && V3D.equalToEpsilon(a1,b2) && V3D.equalToEpsilon(c1,c2) ) ||
		( V3D.equalToEpsilon(b1,a2) && V3D.equalToEpsilon(c1,b2) && V3D.equalToEpsilon(a1,c2) ) ||
		( V3D.equalToEpsilon(c1,a2) && V3D.equalToEpsilon(a1,b2) && V3D.equalToEpsilon(b1,c2) ) ||
		( V3D.equalToEpsilon(c1,a2) && V3D.equalToEpsilon(b1,b2) && V3D.equalToEpsilon(a1,c2) )
		){
		return true;
	}
	return false;
}
Tri3D.prototype.opposite = function(a,b){
	if( V3D.equalToEpsilon(a,this._a) ){
		if( V3D.equalToEpsilon(b,this._b) ){
			return this._c;
		}else if( V3D.equalToEpsilon(b,this._c) ){
			return this._b;
		}
	}if( V3D.equalToEpsilon(a,this._b) ){
		if( V3D.equalToEpsilon(b,this._a) ){
			return this._c;
		}else if( V3D.equalToEpsilon(b,this._c) ){
			return this._a;
		}
	}if( V3D.equalToEpsilon(a,this._c) ){
		if( V3D.equalToEpsilon(b,this._a) ){
			return this._b;
		}else if( V3D.equalToEpsilon(b,this._b) ){
			return this._a;
		}
	}
	return null;
}
Tri3D.prototype.normal = function(){
	var AB = V3D.sub(this._b,this._a);
	var AC = V3D.sub(this._c,this._a);
	V3D.cross(AB, AB,AC);
	AB.norm();
	return AB;
}
Tri3D.prototype.area = function(){
	var AB = V3D.sub(this._b,this._a);
	var AC = V3D.sub(this._c,this._a);
	V3D.cross(AB, AB,AC);
	return AB.length() * 0.5; // ?
}
Tri3D.prototype.center = function(){ // barycenter
	return new V3D((this._a.x+this._b.x+this._c.x)/3.0, (this._a.y+this._b.y+this._c.y)/3.0, (this._a.z+this._b.z+this._c.z)/3.0);
}
Tri3D.prototype.boundingBox = function(){
	var min = null;
	var min = new V3D();
	var max = new V3D();
	var size = new V3D();
	return {"min":min, "max":max, "size":size};
}
Tri3D.prototype.copy = function(a){
	if(a===undefined){ return new Tri2D(this.A().copy(),this.B().copy(),this.C().copy()); }
	this.A(a.A().copy());
	this.B(a.B().copy());
	this.C(a.C().copy());
	return this;
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri3D.prototype.jitter = function(amplitude){
	this._a = this._a.copy();
	this._b = this._b.copy();
	this._c = this._c.copy();
	this._a.x += Math.random()*amplitude - amplitude*0.5;
	this._a.y += Math.random()*amplitude - amplitude*0.5;
	this._a.z += Math.random()*amplitude - amplitude*0.5;
	this._b.x += Math.random()*amplitude - amplitude*0.5;
	this._b.y += Math.random()*amplitude - amplitude*0.5;
	this._b.z += Math.random()*amplitude - amplitude*0.5;
	this._c.x += Math.random()*amplitude - amplitude*0.5;
	this._c.y += Math.random()*amplitude - amplitude*0.5;
	this._c.z += Math.random()*amplitude - amplitude*0.5;
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri3D.prototype.toString = function(){
	var str = "";
	str += "[Tri3D: ";
	str += this._a?(this._a.toString()):("[null]");
	str += ", ";
	str += this._b?(this._b.toString()):("[null]");
	str += ", ";
	str += this._c?(this._c.toString()):("[null]");
	str += "]";
	return str;
}

Tri3D.copy = function(a){
	return (new Tri2D()).copy(a);
}

Tri3D.extremaFromArray = function(triangles){
	var min = null;
	var max = null;
	for(var i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var A = tri.A();
		var B = tri.B();
		var C = tri.C();
		if(min==null){
			min = A.copy();
		}
		if(max==null){
			max = A.copy();
		}
		V3D.min(min, min,A);
		V3D.min(min, min,B);
		V3D.min(min, min,C);
		V3D.max(max, max,A);
		V3D.max(max, max,B);
		V3D.max(max, max,C);
	}
	var size = V3D.sub(max,min);
	return {"min":min, "max":max, "size":size};
}



Tri3D.generateSphere = function(radius, latNum, lonNum){ // latitude=up/down, longitude=around
	latNum = latNum!==undefined ? latNum : 6;
	lonNum = lonNum!==undefined ? lonNum : 10;
	var i, j, tri, tris = [];
	for(i=0; i<latNum; ++i){ // latitude
		var aA = ((i+0)/latNum) * Math.PI;
		var aB = ((i+1)/latNum) * Math.PI;
		var zA = radius*Math.cos(aA);
		var zB = radius*Math.cos(aB);
		// var zA = (zA-0.5)*radius*2.0;
		// var zB = (zB-0.5)*radius*2.0;
		var rA = Math.sqrt(Math.max(0,radius*radius - zA*zA));
		var rB =  Math.sqrt(Math.max(0,radius*radius - zB*zB));
//console.log(i+" = "+rA+" | "+rB+"   "+zA+" | "+zB);
		for(j=0; j<lonNum; ++j){ // longitude
			var tA = (j/lonNum)*Math.PI*2.0;
			var tB = ((j+1)/lonNum)*Math.PI*2.0;
			var xAA = rA*Math.cos(tA);
			var xAB = rA*Math.cos(tB);
			var xBA = rB*Math.cos(tA);
			var xBB = rB*Math.cos(tB);
			var yAA = rA*Math.sin(tA);
			var yAB = rA*Math.sin(tB);
			var yBA = rB*Math.sin(tA);
			var yBB = rB*Math.sin(tB);
			var a,b,c,d;
			a = new V3D(xAA,yAA,zA);
			b = new V3D(xAB,yAB,zA);
			c = new V3D(xBA,yBA,zB);
			d = new V3D(xBB,yBB,zB);
			if(i==0){ // top
				tri = new Tri3D(a,c,d);
				tris.push(tri);
			}else if(i==latNum-1){ // bot
				tri = new Tri3D(a,d,b);
				tris.push(tri);
			}else{ // mid
				tri = new Tri3D(a,c,d);
				tris.push(tri);
				tri = new Tri3D(a,d,b);
				tris.push(tri);
			}
		}
	}
	return tris;
}


Tri3D.applyTransform = function(list, matrix){
	for(var i=0; i<list.length; ++i){
		var tri = list[i];
		tri.A( matrix.multV3DtoV3D(tri.A()) );
		tri.B( matrix.multV3DtoV3D(tri.B()) );
		tri.C( matrix.multV3DtoV3D(tri.C()) );
	}
	return list;
}


