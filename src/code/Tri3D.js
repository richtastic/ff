// Tri3D.js
Tri3D.YAML = {
	A:"a",
	B:"b",
	C:"c"
};

function Tri3D(a,b,c){ // CCW+
	Tri3D._.constructor.call(this,a,b,c);
	this._norm = null; // if manual vs derived ?
}
Code.inheritClass(Tri3D, Tri2D);
Tri3D.fromPoints = function(a,b,c){
	return (new Tri3D(a,b,c));
}
Tri3D.fromList = function(ax,ay,az, bx,by,bz, cx,cy,cz){
	return new Tri3D(new V3D(ax,ay,az), new V3D(bx,by,bz), new V3D(cx,cy,cz));
}
Tri3D.prototype.toObject = function(){
	var DATA = Tri3D.YAML;
	var object = {};
	object[DATA.A] = this.A().toObject();
	object[DATA.B] = this.B().toObject();
	object[DATA.C] = this.C().toObject();
	return object;
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
	if(this._norm){
		return this._norm;
	}
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
Tri3D.prototype.lengthAB = function(){
	return V3D.distance(this._b,this._a);
}
Tri3D.prototype.lengthBC = function(){
	return V3D.distance(this._c,this._b);
}
Tri3D.prototype.lengthCA = function(){
	return V3D.distance(this._a,this._c);
}
Tri3D.prototype.center = function(){ // barycenter
	return new V3D((this._a.x+this._b.x+this._c.x)/3.0, (this._a.y+this._b.y+this._c.y)/3.0, (this._a.z+this._b.z+this._c.z)/3.0);
}
Tri3D.prototype.radius = function(){
	var center = this.center();
	var ca = V3D.sub(this._a,center).length();
	var cb = V3D.sub(this._b,center).length();
	var cc = V3D.sub(this._c,center).length();
	var radius = Math.max(ca,cb,cc);
	return radius;
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
	return this;
}
Tri3D.prototype.wiggle = function(amplitude){
	return this.jitter(amplitude);
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
Tri3D.generateTetrahedraSphere = function(radius, subdivisions, offset, invertNormals){
// tet: 0=0, 1=4
// dub: 0=0, 1=?
// oct: 0=0, 1=8, 2=32, 3=72, 4=128, 5=200, 6=288, 7=392, 8=512, 9=648, 10=800, 11=968, 12=1152
// squ: 0=0, 1=? 
// regular tetrahedron - 4
// triangle double tetrahedra - 6
// square double pyriamid - 8
// cube - 12


	radius = radius!==undefined ? radius : 1;
	subdivisions = subdivisions!==undefined ? subdivisions : 0;
	offset = offset!==undefined ? offset : V3D.ZERO;



	var mode = 2;
	var sides = null;
	if(mode==0){
		// create tetrahedra - side length = 1
		var angle60 = Code.radians(60.0);
		var l = 0.5/Math.cos(angle60*0.5);
		var m = Math.sin(angle60);
		var k = 0.5*Math.tan(angle60*0.5);
		var h = Math.sqrt(m*m-k*k);
		var dirZ = new V3D(0,0,1);
		var a = new V3D(l,0,0);
		var b = V3D.rotateAngle(new V3D(),a,dirZ, 2*angle60);
		var c = V3D.rotateAngle(new V3D(),a,dirZ, -2*angle60);
		var d = new V3D(0,0,h);
		// find sphere center: a/b/c cancel, only z-movement
		// var centroid = V3D.average([a,b,c,d]);
		var centroid = d.copy().scale(0.25);
		// to zero center:
		a.sub(centroid);
		b.sub(centroid);
		c.sub(centroid);
		d.sub(centroid);
		// to unit sphere:
		a.length(1.0);
		b.length(1.0);
		c.length(1.0);
		d.length(1.0);
		var A = new Tri3D(a,c,b);
		var B = new Tri3D(a,b,d);
		var C = new Tri3D(b,c,d);
		var D = new Tri3D(c,a,d);
		sides = [A,B,C,D];
	}else if(mode==1){
		// double triangle pyramid
		throw "todo";
	}else if(mode==2){
		// double pyramid (octahedron):
		var a = new V3D( 1, 0, 0);
		var b = new V3D( 0, 1, 0);
		var c = new V3D(-1, 0, 0);
		var d = new V3D( 0,-1, 0);
		var e = new V3D( 0, 0, 1);
		var f = new V3D( 0, 0,-1);

		var sides = [];
		sides.push(new Tri3D(a,b,e)); // top
		sides.push(new Tri3D(b,c,e));
		sides.push(new Tri3D(c,d,e));
		sides.push(new Tri3D(d,a,e));
		sides.push(new Tri3D(a,d,f)); // bot
		sides.push(new Tri3D(d,c,f));
		sides.push(new Tri3D(c,b,f));
		sides.push(new Tri3D(b,a,f));
	}else if(mode==3){
		// cube
		throw "todo";
	}

	// console.log(sides);

	if(invertNormals){
		console.log("invertNormals");
		for(var i=0; i<sides.length; ++i){
			var side = sides[i];
			// var a = side.A();
			var b = side.B();
			var c = side.C();
			side.B(c);
			side.C(b);
		}
	}

	// for each side: divide into separate triangles:
	var triangles = [];
	for(var i=0; i<sides.length; ++i){
		var side = sides[i];
		var a = side.A();
		var b = side.B();
		var c = side.C();
		var ab = V3D.sub(b,a);
		var bc = V3D.sub(c,b);
		var u = bc.copy().scale(1.0/(subdivisions+1));
		// for each row (subdivision)
		for(var r=0; r<subdivisions; ++r){
			var stripCount = r + 1;
			var last = stripCount-1;
			var o = ab.copy().scale((r+0)/stripCount).add(a);
			var p = ab.copy().scale((r+1)/stripCount).add(a);
			// for each strip
			for(var s=0; s<stripCount; ++s){
				// first:
				var ta = u.copy().scale(s+0).add(o);
				var tb = u.copy().scale(s+0).add(p);
				var tc = u.copy().scale(s+1).add(p);
				var t = new Tri3D(ta,tb,tc);
				triangles.push(t);
				if(s!=last){ // single tri
					ta = ta.copy();
					tb = tc.copy();
					tc = u.copy().scale(s+1).add(o);
					var t = new Tri3D(ta,tb,tc);
					triangles.push(t);
				}
			}
		}
	}
	// project to circle center
	for(var i=0; i<triangles.length; ++i){
		var triangle = triangles[i];
		var a = triangle.A();
		var b = triangle.B();
		var c = triangle.C();
		a.length(radius);
		b.length(radius);
		c.length(radius);
		if(offset){
			a.add(offset);
			b.add(offset);
			c.add(offset);
		}
	}
	// console.log(triangles);
	// throw "..."
	return {"triangles":triangles};
}


Tri3D.generateSphere = function(radius, latNum, lonNum, offset){ // latitude=up/down, longitude=around
	latNum = latNum!==undefined ? latNum : 6;
	lonNum = lonNum!==undefined ? lonNum : 10;
	offset = offset!==undefined ? offset : V3D.ZERO;
	// offset = V3D.ZERO;
	var i, j, tri, tris = [];
	for(i=0; i<latNum; ++i){ // latitude
		var aA = ((i+0)/latNum) * Math.PI;
		var aB = ((i+1)/latNum) * Math.PI;
		var zA = radius*Math.cos(aA);
		var zB = radius*Math.cos(aB);
			
		var rA = Math.sqrt(Math.max(0,radius*radius - zA*zA));
		var rB =  Math.sqrt(Math.max(0,radius*radius - zB*zB));
//console.log(i+" = "+rA+" | "+rB+"   "+zA+" | "+zB);
			zA += offset.z;
			zB += offset.z;
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
				xAA += offset.x;
				xAB += offset.x;
				xBA += offset.x;
				xBB += offset.x;
				yAA += offset.y;
				yAB += offset.y;
				yBA += offset.y;
				yBB += offset.y;
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
Tri3D.arrayToPointList = function(tris3D){
	var points = [];
	var len = tris3D.length;
	for(var i=0; i<len; ++i){
		var tri3D = tris3D[i];
		points.push(tri3D.A().copy());
		points.push(tri3D.B().copy());
		points.push(tri3D.C().copy());
	}
	return {"points":points};
}
Tri3D.arrayToNormalList = function(tris3D){
	var points = [];
	var len = tris3D.length;
	for(var i=0; i<len; ++i){
		var tri3D = tris3D[i];
		var n = tri3D.normal().copy();
		points.push(n);
	}
	return {"normals":points};
}
Tri3D.arrayToUniquePointList = function(tris3D){
	var triObjects = []; // list of indexes = 3 * tris3D.length
	var points = []; // list of unique points
	var indexes = [];
	var pointLookup = [];
	// find unique points
	for(var i=0; i<tris3D.length; ++i){
		var tri = tris3D[i];
		var a = tri.A();
		var b = tri.B();
		var c = tri.C();
		var points = [a,b,c];
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			var index = point.x+"_"+point.y+"_"+point.z;
			pointLookup[index] = point;
		}
	}
	// convert to index lookup
	var keys = Code.keys(pointLookup);
	var points = [];
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var val = pointLookup[key];
		pointLookup[key] = i;
		points.push(val.copy());
	}
	// convert to objects
	for(var i=0; i<tris3D.length; ++i){
		var tri = tris3D[i];
		var a = tri.A();
		var b = tri.B();
		var c = tri.C();
			a = pointLookup[a.x+"_"+a.y+"_"+a.z];
			b = pointLookup[b.x+"_"+b.y+"_"+b.z];
			c = pointLookup[c.x+"_"+c.y+"_"+c.z];
		var object = {"A":a,"B":b,"C":c};
		triObjects.push(object);
	}
	return {"points":points, "triangles":triObjects};
}
Tri3D.uniquePointListToTriangles = function(vertexes,triangles){
	// local copy for changing
	vertexes = Code.copyArray(vertexes);
	triangles = Code.copyArray(triangles);
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var x = vertex["X"];
		var y = vertex["Y"];
		var z = vertex["Z"];
		if(x===undefined){
			x = vertex["x"];
			y = vertex["y"];
			z = vertex["z"];
		}
		vertexes[i] = new V3D(x,y,z);
	}
	for(var i=0; i<triangles.length; ++i){
		var triangle = triangles[i];
		var a = triangle["A"];
		var b = triangle["B"];
		var c = triangle["C"];
		if(Code.isObject(a)){
			a = a["i"];
			b = b["i"];
			c = c["i"];
		}
		triangles[i] = [a,b,c];
	}
	var triangles3D = [];
	for(var i=0; i<triangles.length; ++i){
		var triangle = triangles[i];
		var a = triangle[0];
		var b = triangle[1];
		var c = triangle[2];
		a = vertexes[a];
		b = vertexes[b];
		c = vertexes[c];
		var t = new Tri3D(a.copy(),b.copy(),c.copy());
		triangles3D.push(t);
	}
	console.log("TRIANGLES START: "+triangles3D.length);
	return triangles3D;
}
