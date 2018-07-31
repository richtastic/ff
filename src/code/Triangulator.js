// Triangulator.js
Triangulator.EPSILON = 1E-10;

function Triangulator(pointsStart){
	this._mesh = new Triangulator.Mesh();
}
Triangulator.prototype.mesh = function(){
	return this._mesh;
}
Triangulator.prototype.setLimits = function(min,max){
	this._mesh.setLimits(min,max);
}
Triangulator.prototype.addPoints = function(points, datas){
	if(!points){return;}
	this._mesh.addPoints(points, datas);
}
Triangulator.prototype.addPoint = function(point, data){
	this._mesh.addPoint(point, data);
}
Triangulator.prototype.removePoint = function(point, data){
	this._mesh.removePoint(point, data);
}
Triangulator.prototype.removePoints = function(points, datas){
	if(!points){return;}
	this._mesh.removePoints(points, datas);
}
Triangulator.prototype.triangle = function(point){
	return this._mesh.triangle(point, true);
}
Triangulator.pointsEqualToEpsilon = function(a,b){
	if(Math.abs(a.x-b.x)<Triangulator.EPSILON && Math.abs(a.y-b.y)<Triangulator.EPSILON){
		return true;
	}
	return false;
}
Triangulator.prototype.points = function(){
	return this._mesh.points();
}
Triangulator.prototype.datas = function(){
	return this._mesh.datas();
}
Triangulator.prototype.triangles = function(){
	return this._mesh.triangles();
}
Triangulator.prototype.perimeter = function(){
	return this._mesh.perimeter();
}

Triangulator.removeDuplicates = function(points, datas){
	var i, j, a, b;
	for(i=0; i<points.length; ++i){
		a = points[i];
		for(j=i+1; j<points.length; ++j){
			b = points[j];
			if(Triangulator.pointsEqualToEpsilon(a,b)){
				console.log("duplicate point: "+a+" | "+b);
				points[j] = points[points.length-1];
				points.pop();
				if(datas){
					datas[j] = datas[points.length-1];
					datas.pop();
				}
				--j;
			}
		}
	}
}

Triangulator.Mesh = function(containingRect){
	this._init();
}
Triangulator.Mesh.prototype._init = function(){
	this._perimeter = [];
	this._tris = [];
	this._edges = [];
	this._points = [];
	// external containment tri
	var pointA = new Triangulator.Point(new V2D(0,0)); // BOT LEFT
	var pointB = new Triangulator.Point(new V2D(0,0)); // BOT RIGHT
	var pointC = new Triangulator.Point(new V2D(0,0)); // TOP
	var edgeA = new Triangulator.Edge(pointA,pointB);
	var edgeB = new Triangulator.Edge(pointB,pointC);
	var edgeC = new Triangulator.Edge(pointC,pointA);
	var tri = new Triangulator.Tri();
	tri.edges(edgeA,edgeB,edgeC);
	edgeA.prev(edgeC);
	edgeA.next(edgeB);
	edgeB.prev(edgeA);
	edgeB.next(edgeC);
	edgeC.prev(edgeB);
	edgeC.next(edgeA);
	edgeA.tri(tri);
	edgeB.tri(tri);
	edgeC.tri(tri);
	this._dummyA = pointA;
	this._dummyB = pointB;
	this._dummyC = pointC;
	this._dummyT = tri;
	//this._tris.push(tri);
	tri.id(this._tris.length);
	this._tris.push(tri);
}
Triangulator.Mesh.prototype.points = function(){
	var points = this._points;
	var internals = [];
	var i, len = points.length;
	for(i=0; i<len; ++i){
		var point = points[i];
		internals[i] = point.point();
	}
	return internals;	return null;
}
Triangulator.Mesh.prototype.datas = function(){
	var points = this._points;
	var internals = [];
	var i, len = points.length;
	for(i=0; i<len; ++i){
		var point = points[i];
		internals[i] = point.data();
		//internals[point.id()] = point.data();
	}
	return internals;	return null;
}

Triangulator.Mesh.prototype._dummyPoints = function(){
	var dummyPoints = [this._dummyA,this._dummyB,this._dummyC];
	return dummyPoints;
}
//Triangulator.Mesh.prototype.triangles = function(dropExternal){
Triangulator.Mesh.prototype.triangles = function(){
	//console.log("triangles")
	var triangles = this._tris;
	//console.log(triangles)
	// remove external-perimeter triangles
	var internals = [];
	var i, len = triangles.length;
	var dummyPoints = this._dummyPoints();
	for(i=0; i<len; ++i){
		//console.log(".  . . . ..  "+i);
		var tri = triangles[i];
		var points = tri.points();
		var a = points[0];
		var b = points[1];
		var c = points[2];
		// console.log(a,b,c);
		// console.log(a+" | "+b+" | "+c+" | ");
		if( !Code.elementExists(dummyPoints, a) && !Code.elementExists(dummyPoints, b) && !Code.elementExists(dummyPoints, c) ){
			internals.push([a.id(),b.id(),c.id()]);
		}
	}
	return internals;
}
Triangulator.Mesh.prototype.perimeter = function(){
	var points = this.points();
	//console.log("PERIMETER POINTS: "+points.length);
	if(points.length<3){
		return [];
	}
	var edges = this._edges;
	var internals = [];
	var i, len = edges.length;
	var dummyPoints = this._dummyPoints();
	for(i=0; i<len; ++i){
		var edge = edges[i];
		var oppo = edge.opposite();
		//var point = edge.next().b(); // tri().opposite(edge);
		var point = oppo.tri().opposite(oppo);
		if( Code.elementExists(dummyPoints, point) && !Code.elementExists(dummyPoints, edge.a()) && !Code.elementExists(dummyPoints, edge.b()) ){
			//if(edge.opposite()){}
			//if(edge.opposite() && edge.opposite().prev().opposite() && edge.opposite().prev().opposite().prev().opposite()){
				internals.push(edge);
			//}
		}
	}
	var sequence = [];
	if(internals.length>0){
		var edge, next;
		//console.log(internals);
		var edgeStart = internals[0];
		//var edgeStart = internals[2];
		var i = 0;
		edge = edgeStart;
		sequence.push(edge.a().id());
		next = Triangulator.nextEdge(edge, dummyPoints);
		//edge = edge.next().opposite().next();
		//sequence.push(edge.a().id());
		while(next && next!=edgeStart){
			edge = next;
			sequence.push(next.a().id());
			next = Triangulator.nextEdge(edge, dummyPoints);
			console.log();
			++i;
			if(i>1000){
				console.log("PERIMETER IS BAD");
				break;
			}
		}
	}
	//return internals;
	return sequence;
}
Triangulator.nextEdge = function(edge, dummyPoints){
	//var next = edge.next().opposite().next();
	var next = edge.opposite().prev().opposite().prev().opposite();
		while( Code.elementExists(dummyPoints, next.b()) ){
			//console.log("hop");
			next = next.prev().opposite();
			// if( Code.elementExists(dummyPoints, next.b()) ){
			// 	console.log("hop 2");
			// 	next = next.opposite().prev().opposite();
			// }
		}
	// }else{
	// 	return null;
	// }
	return next;
}

Triangulator.isCCW = function(a,b,c){
	det = Code.determinant3x3(a.x, a.y, 1.0,  b.x, b.y, 1.0,  c.x, c.y, 1.0);
	return det > 0;
}
// is this a circle or a triangle ?
Triangulator.isInCircle = function(d, a,b,c){ // d inside circle made by a,b,c
	var det = Code.determinant4x4(a.x, a.y, a.x*a.x+a.y*a.y, 1.0,  b.x, b.y, b.x*b.x+b.y*b.y, 1.0,  c.x, c.y, c.x*c.x+c.y*c.y, 1.0,  d.x, d.y, d.x*d.x+d.y*d.y, 1.0);
	return det > 0;
}

Triangulator.Mesh.prototype.addPoints = function(points, datas){
	var i, len = points.length;
	for(i=0; i<len; ++i){
		var point = points[i];
		var data = datas!==undefined ? datas[i] : null;
		this.addPoint(point, data);
	}
}
Triangulator.Mesh.prototype.removePoint = function(point, data){ // don't need data??
	this.removePoints([point],[data]);
}
Triangulator.Mesh.prototype.removePoints = function(points, datas){
	// TODO: MAKE PRETTIER: CURRENTLY BRUTE FORCE
	var i, j;
	var pointList = this._points;
	var dataList = [];
	for(j=0; j<pointList.length; ++j){
		dataList[j] = pointList[j].data();
		console.log(dataList[j])
	}
	for(i=0; i<points.length; ++i){
		var point = points[i];
		for(j=0; j<pointList.length; ++j){
			var p = pointList[i];
			if(p.x==point.x && p.y==point.y){
				pointList[j] = pointList[pointList.length-1];
				pointList.pop();
				dataList[j] = dataList[dataList.length-1];
				dataList.pop();
				break;
			}
		}
	}
	// REDO
	this._init();
	this.addPoints(pointList,dataList);
	// for(j=0; j<pointList.length; ++j){
	// 	var point = pointList[j];
	// 	var data = dataList[j];
	//	this.addPoint(point,data);
	// }
}
Triangulator.Mesh.prototype.addPoint = function(point, data){
	//console.log("addPoint "+point+" --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ");
	var points = this._points;
	var pnt = new Triangulator.Point(point,data);
	this._expandDummyForPoint(point);
	tri = this.triangle(point);
	this.subdivide(tri,pnt,data);
	pnt.id(this._points.length);
	this._points.push(pnt);
}
Triangulator.Mesh.prototype.setLimits = function(minIn,maxIn){
	if(!this._min){ // no max/min yet
		this._min = minIn.copy();
		this._max = maxIn.copy();
	}
	var min = this._min;
	var max = this._max;
	V2D.min(min,min,minIn);
	V2D.max(max,max,maxIn);
	var mul = 10; // should be a lot to stop bad in-circle tests
	var width = max.x - min.x;
	var height = max.y - min.y;
	var center = new V2D(min.x + width*0.5, min.y + height*0.5);
	var size = Math.max(width,height);
	if(size==0){
		size = 1.0;
	}
	this._dummyA.point().set(center.x - mul*size, center.y - mul*size);
	this._dummyB.point().set(center.x + mul*size, center.y - mul*size);
	this._dummyC.point().set(center.x, center.y + mul*size);
}
Triangulator.Mesh.prototype._expandDummyForPoint = function(point){ // expand dummy points to continue to maintain the containing triangles
	this.setLimits(point,point);
}
Triangulator.Mesh.prototype.isExternal = function(tri){
	var a = tri.a();
	var b = tri.b();
	var c = tri.c();
	var dummyPoints = this._dummyPoints();
	if( Code.elementExists(dummyPoints, a) || Code.elementExists(dummyPoints, b) || Code.elementExists(dummyPoints, c) ){
		return true;
	}
	return false;
}
Triangulator.Mesh.prototype.triangle = function(point, dropExternal){
	var i, tri, tris = this._tris;
	var len = tris.length;
	for(i=0; i<len; ++i){
		tri = tris[i];
		var pts = tri.points();
		var a = pts[0].point();
		var b = pts[1].point();
		var c = pts[2].point();
		var isInside = Code.isPointInsideTri2DFast(point, a,b,c);
		//var isInside = Code.isPointInsideTri2D(point, a,b,c);
		if(isInside){
			if(dropExternal){
				if( this.isExternal(tri) ){
					return null;
				}
			}
			return tri;
		}
	}
	return null;
}
//Triangulator.Mesh.prototype.triangleNeighbors = function(point,andSelf){
Triangulator.Mesh.prototype.triangleNeighbors = function(point,andSelf){
	var triangle = null;
	if(Code.isa(point,V2D)){
		//console.log("point: "+point);
		var triangle = this.triangle(point,true);
	}
	//console.log("triangle: "+triangle);
	var neighbors = [];
	if(triangle){
		var i, t;
		// var dummyPoints = this._dummyPoints();
		// neighbors.push( triangle.edgeA().opposite.tri() ); // side direct
		// neighbors.push( triangle.edgeB().opposite.tri() );
		// neighbors.push( triangle.edgeC().opposite.tri() );
		if(andSelf){
			neighbors.push( triangle );
		}
		// neighbors.push( triangle.opposite(triangle.edgeA()) ); // side direct
		// neighbors.push( triangle.opposite(triangle.edgeB()) );
		// neighbors.push( triangle.opposite(triangle.edgeC()) );
		// neighbors.push( triangle.opposite(triangle.a()) ); // point indirect
		// neighbors.push( triangle.opposite(triangle.b()) );
		// neighbors.push( triangle.opposite(triangle.c()) );
		// want triangles:
		neighbors.push( triangle.edgeA().opposite().tri() ); // side direct
		neighbors.push( triangle.edgeB().opposite().tri() );
		neighbors.push( triangle.edgeC().opposite().tri() );
		neighbors.push( triangle.edgeA().opposite().next().opposite().tri() ); // side indirect
		neighbors.push( triangle.edgeB().opposite().next().opposite().tri() );
		neighbors.push( triangle.edgeC().opposite().next().opposite().tri() );

		Code.removeDuplicates(neighbors);
		// convert to point list ?????
		for(i=0; i<neighbors.length; ++i){
			t = neighbors[i];
			//if( Code.elementExists(dummyPoints, a) && !Code.elementExists(dummyPoints, b) && !Code.elementExists(dummyPoints, c) ){
			if(this.isExternal(t)){
				//Code.removeElementSimple(neighbors,i);
				neighbors.splice(i,1);
				--i;
			}
		}
	}
	return neighbors;
}
Triangulator.Mesh.prototype.subdivide = function(tri, point){
	//console.log("subdivide");
	var minDistance = 1E-10;
	//var tris = this._tris;
	//console.log(tri+" @ "+point);
	if(!tri){
		console.log(tri+" @ "+point);
		Code.printPoints(this.points());
		console.log("something wrong -- mising tri: ",tri,"@",point);
return;
		throw "should have try ... intersection code wrong?";
	}
	var edgeA = tri.edgeA();
	var edgeB = tri.edgeB();
	var edgeC = tri.edgeC();
	var p = point.point();
	var pAa = edgeA.a().point();
	var pBa = edgeB.a().point();
	var pCa = edgeC.a().point();
	var pAb = edgeA.b().point();
	var pBb = edgeB.b().point();
	var pCb = edgeC.b().point();
	var dA = V2D.sub(pAb,pAa);
	var dB = V2D.sub(pBb,pBa);
	var dC = V2D.sub(pCb,pCa);
	var distA = Code.distancePointRay2D(pAa, dA, p);
	var distB = Code.distancePointRay2D(pBa, dB, p);
	var distC = Code.distancePointRay2D(pCa, dC, p);
	var isCloseToEdge = (distA<minDistance) || (distB<minDistance) || (distC<minDistance);
	if(isCloseToEdge){ // 4 tris
		//console.log("edge point + + + + + + + + + + + +");
		var split = null;
		if(distA < distB && distA < distC){
			split = edgeA;
		}else if(distB < distA && distB < distC){
			split = edgeB;
		}else{ // if(distC < distA && distC < distB){
			split = edgeC;
		}
		var edgeA = split;
		var edgeB = split.opposite();
		var edgeAPrev = edgeA.prev();
		var edgeANext = edgeA.next();
		var edgeBPrev = edgeB.prev();
		var edgeBNext = edgeB.next();
		var triA = edgeA.tri();
		var triB = edgeB.tri();
		var triC = new Triangulator.Tri();
		var triD = new Triangulator.Tri();
triC.id(this._tris.length);
this._tris.push(triC);
triD.id(this._tris.length);
this._tris.push(triD);
		// points
		var pointA = edgeAPrev.a();
		var pointB = edgeAPrev.b();
		var pointC = edgeBPrev.a();
		var pointD = edgeBPrev.b();
		var pointE = point;
		// edges
		var edgeAC_A = new Triangulator.Edge(pointE,pointA,triA);
		var edgeAC_C = new Triangulator.Edge(pointA,pointE,triC);
		var edgeBD_B = new Triangulator.Edge(pointC,pointE,triB);
		var edgeBD_D = new Triangulator.Edge(pointE,pointC,triD);
		var edgeCD_C = new Triangulator.Edge(pointE,pointD,triC);
		var edgeCD_D = new Triangulator.Edge(pointD,pointE,triD);
		var edgeAB_A = edgeA;
			edgeAB_A.a(pointB); // still same
			edgeAB_A.b(pointE);
			edgeAB_A.tri(triA);
		var edgeAB_B = edgeB;
			edgeAB_B.a(pointE);
			edgeAB_B.b(pointB); // still same
			edgeAB_B.tri(triB);
this._edges.push(edgeAC_A);
this._edges.push(edgeAC_C);
this._edges.push(edgeBD_B);
this._edges.push(edgeBD_D);
this._edges.push(edgeCD_C);
this._edges.push(edgeCD_D);
		edgeAC_A.opposite(edgeAC_C);
		edgeAC_C.opposite(edgeAC_A);
		edgeBD_B.opposite(edgeBD_D);
		edgeBD_D.opposite(edgeBD_B);
		edgeCD_C.opposite(edgeCD_D);
		edgeCD_D.opposite(edgeCD_C);
		// A
		edgeAB_A.prev(edgeAPrev);
		edgeAB_A.next(edgeAC_A);
		edgeAC_A.prev(edgeAB_A);
		edgeAC_A.next(edgeAPrev);
		edgeAPrev.prev(edgeAC_A);
		edgeAPrev.next(edgeAB_A);
		// B
		edgeAB_B.prev(edgeBD_B);
		edgeAB_B.next(edgeBNext);
		edgeBD_B.prev(edgeBNext);
		edgeBD_B.next(edgeAB_B);
		edgeBNext.prev(edgeAB_B);
		edgeBNext.next(edgeBD_B);
		// C
		edgeAC_C.prev(edgeANext);
		edgeAC_C.next(edgeCD_C);
		edgeCD_C.prev(edgeAC_C);
		edgeCD_C.next(edgeANext);
		edgeANext.prev(edgeCD_C);
		edgeANext.next(edgeAC_C);
		// D
		edgeBD_D.prev(edgeCD_D);
		edgeBD_D.next(edgeBPrev);
		edgeCD_D.prev(edgeBPrev);
		edgeCD_D.next(edgeBD_D);
		edgeBPrev.prev(edgeBD_D);
		edgeBPrev.next(edgeCD_D);
		// connect edges + tris
		triA.edges(edgeAPrev,edgeAB_A,edgeAC_A);
		triB.edges(edgeBNext,edgeBD_B,edgeAB_B);
		triC.edges(edgeANext,edgeAC_C,edgeCD_C);
		triD.edges(edgeBPrev,edgeCD_D,edgeBD_D);
		edgeAPrev.tri(triA);
		edgeANext.tri(triC);
		edgeBPrev.tri(triD);
		edgeBNext.tri(triB);
		// tris.push(triC);
		// tris.push(triD);
		this.validateEdge(point,triA);
		this.validateEdge(point,triB);
		this.validateEdge(point,triC);
		this.validateEdge(point,triD);
	}else{ // 3 tris
		//console.log("interrior point + + + + + + + + + + + +");
		var edgeA = tri.edgeA();
		var edgeB = tri.edgeB();
		var edgeC = tri.edgeC();
		var pointA = edgeA.a();
		var pointB = edgeB.a();
		var pointC = edgeC.a();
		var triA = tri;//new Triangulator.Tri();
		var triB = new Triangulator.Tri();
		var triC = new Triangulator.Tri();
		var edgeAB_A = new Triangulator.Edge(pointB,point,triA);
		var edgeAB_B = new Triangulator.Edge(point,pointB,triB);
		var edgeBC_B = new Triangulator.Edge(pointC,point,triB);
		var edgeBC_C = new Triangulator.Edge(point,pointC,triC);
		var edgeAC_A = new Triangulator.Edge(point,pointA,triA);
		var edgeAC_C = new Triangulator.Edge(pointA,point,triC);
this._edges.push(edgeAB_A);
this._edges.push(edgeAB_B);
this._edges.push(edgeBC_B);
this._edges.push(edgeBC_C);
this._edges.push(edgeAC_A);
this._edges.push(edgeAC_C);
		edgeAB_A.opposite(edgeAB_B);
		edgeAB_B.opposite(edgeAB_A);
		edgeBC_B.opposite(edgeBC_C);
		edgeBC_C.opposite(edgeBC_B);
		edgeAC_A.opposite(edgeAC_C);
		edgeAC_C.opposite(edgeAC_A);
		// A
		edgeA.prev(edgeAC_A);
		edgeA.next(edgeAB_A);
		edgeAB_A.prev(edgeA);
		edgeAB_A.next(edgeAC_A);
		edgeAC_A.prev(edgeAB_A);
		edgeAC_A.next(edgeA);
		// B
		edgeB.prev(edgeAB_B);
		edgeB.next(edgeBC_B);
		edgeAB_B.prev(edgeBC_B);
		edgeAB_B.next(edgeB);
		edgeBC_B.prev(edgeB);
		edgeBC_B.next(edgeAB_B);
		// C
		edgeC.prev(edgeBC_C);
		edgeC.next(edgeAC_C);
		edgeBC_C.prev(edgeAC_C);
		edgeBC_C.next(edgeC);
		edgeAC_C.prev(edgeC);
		edgeAC_C.next(edgeBC_C);
		// 
		edgeA.tri(triA);
		edgeB.tri(triB);
		edgeC.tri(triC);
		triA.edges(edgeA,edgeAB_A,edgeAC_A);
		triB.edges(edgeB,edgeBC_B,edgeAB_B);
		triC.edges(edgeC,edgeAC_C,edgeBC_C);
		//var removed = Code.removeElementSimple(tris,tri); // TODO: instead of removing, just copy over from new object
		//console.log("REMOVED:"+tri);
		//tri.kill();
		// tris.push(triA);
		// tris.push(triB);
		// tris.push(triC);
// triA.id(this._tris.length);
// this._tris.push(triA);
triB.id(this._tris.length);
this._tris.push(triB);
triC.id(this._tris.length);
this._tris.push(triC);

		// TODO: only push tris if they don't contain the dummy points
		// console.log("NEW TRI: "+triA+"");
		// console.log("NEW TRI: "+triB+"");
		// console.log("NEW TRI: "+triC+"");
		// console.log("     edges a: "+edgeA+"->"+edgeA.next()+"->"+edgeA.next().next()+" ");
		// console.log("           ?: "+triA.edgeA()+"->"+triA.edgeB()+"->"+triA.edgeC()+" ");
		// console.log("     edges b: "+edgeB+"->"+edgeB.next()+"->"+edgeB.next().next()+" ");
		// console.log("           ?: "+triB.edgeA()+"->"+triB.edgeB()+"->"+triB.edgeC()+" ");
		// console.log("     edges c: "+edgeC+"->"+edgeC.next()+"->"+edgeC.next().next()+" ");
		// console.log("           ?: "+triC.edgeA()+"->"+triC.edgeB()+"->"+triC.edgeC()+" ");
		// console.log("      back a: "+edgeA+"->"+edgeA.prev()+"->"+edgeA.prev().prev()+" ");
		// console.log("      back b: "+edgeB+"->"+edgeB.prev()+"->"+edgeB.prev().prev()+" ");
		// console.log("      back c: "+edgeC+"->"+edgeC.prev()+"->"+edgeC.prev().prev()+" ");


		// this.validateEdge(point,triA,edgeA);
		// this.validateEdge(point,triB,edgeB);
		// this.validateEdge(point,triC,edgeC);
		// var o;
		// o = triA.opposite(point);
		// console.log("  oppo A: "+o);
		// if(o){
		// 	this.validateEdge(point,triA,o);
		// }
		// o = triB.opposite(point);
		// console.log("  oppo B: "+o);
		// if(o){
		// 	this.validateEdge(point,triB,o);
		// }
		// o = triC.opposite(point);
		// console.log("  oppo C: "+o);
		// if(o){
		// 	this.validateEdge(point,triC,o);
		// }
		this.validateEdge(point,triA);
		this.validateEdge(point,triB);
		this.validateEdge(point,triC);
	}
}

Triangulator.isPointInside = function(point, a,b,c){
	var eps = 1E-8;
	var circle = Code.circleFromPoints(a,b,c);
	if(circle){
		var radius = circle.radius;
		var center = circle.center;
		var distance = V2D.distance(center,point);
		if(distance < radius-eps){
			return true;
		}
	}
	return false;
}

Triangulator.Mesh.prototype.validateEdge = function(point,tri){//,edge){
	edge = tri.opposite(point);
	//console.log(edge);
	if(!edge){
		//console.log("NULL OPPOSITE EDGE TO: "+point+"               "+tri);
		return;
	}
	var oppo = edge.opposite();
	if(!oppo){
		//console.log("NULL OPPOSITE OPPO TO: "+oppo+"               "+edge);
		return;
	}
	var adj = oppo.tri();
	//console.log("   ADJ TRI: "+adj+"     @ "+edge+"=>"+oppo);
	var points;
	// 1:
	var adjPoint = adj.opposite(oppo);
	var triPoint = point;

	points = adj.points();
	var pointAdjA = points[0];
	var pointAdjB = points[1];
	var pointAdjC = points[2];

	points = tri.points();
	var pointTriA = points[0];
	var pointTriB = points[1];
	var pointTriC = points[2];
	
	//
	var isInCircleA = Triangulator.isInCircle(triPoint.point(), pointAdjA.point(),pointAdjB.point(),pointAdjC.point());
	var isInCircleB = Triangulator.isInCircle(adjPoint.point(), pointTriA.point(),pointTriB.point(),pointTriC.point());
	//var isInCircle = isInCircleA;
	var isInCircle = isInCircleB;
	//var isInCircle = isInCircleA || isInCircleB;
	//console.log("in circle: "+point.point()+" "+pointA.point()+" "+pointB.point()+" "+pointC.point()+" "+isInCircle);

	// console.log("     1: "+triPoint.point()+" "+pointAdjA.point()+" "+pointAdjB.point()+" "+pointAdjC.point()+" ");
	// console.log("     2: "+adjPoint.point()+" "+pointTriA.point()+" "+pointTriB.point()+" "+pointTriC.point()+" ");
	// 3: 
	// var insideA = Triangulator.isPointInside(triPoint.point(), pointAdjA.point(),pointAdjB.point(),pointAdjC.point());
	// var insideB = Triangulator.isPointInside(adjPoint.point(), pointTriA.point(),pointTriB.point(),pointTriC.point());
	// var isInCircle = insideA || insideB;
	//var isInCircle = insideA;
	//var isInCircle = insideB;
	//console.log("IN CIRCLE: "+isInCircle);
	if(isInCircle){ // invalid
		//console.log("invalid edge => flip");
		var tris = this.flipEdge(tri,adj,edge);
		// this.validateEdge(point,tris[0],edge);
		// this.validateEdge(point,tris[1],oppo);
		//this.validateEdge(point,adj,oppo);
		// console.log(tri)
		// console.log(adj)
		// var o;
		// o = tris[0].opposite(point);
		// console.log("  oppo 1: "+o);
		// if(o){
		// 	this.validateEdge(point,tris[0],o);
		// }
		// o = tris[1].opposite(point);
		// console.log("  oppo 2: "+o);
		// if(o){
		// 	this.validateEdge(point,tris[1],o);
		// }
		this.validateEdge(point,tri);
		this.validateEdge(point,adj);
	}
}
Triangulator.Mesh.prototype.flipEdge = function(triA,triB,edge){
	var edgeA = edge;
	if(edgeA.tri()==triB){
		edgeA = edge.opposite();
	}
	var edgeB = edgeA.opposite();
	var edgeAPrev = edgeA.prev();
	var edgeANext = edgeA.next();
	var edgeBPrev = edgeB.prev();
	var edgeBNext = edgeB.next();
	edgeA.a(edgeBNext.b());
	edgeA.b(edgeANext.b());
	edgeB.a(edgeANext.b());
	edgeB.b(edgeBNext.b());
	edgeA.prev(edgeBNext);
	edgeA.next(edgeAPrev);
	edgeB.prev(edgeANext);
	edgeB.next(edgeBPrev);
	edgeAPrev.prev(edgeA);
	edgeAPrev.next(edgeBNext);
	edgeANext.prev(edgeBPrev);
	edgeANext.next(edgeB);
	edgeBPrev.prev(edgeB);
	edgeBPrev.next(edgeANext);
	edgeBNext.prev(edgeAPrev);
	edgeBNext.next(edgeA);
	edgeBNext.tri(triA);
	edgeANext.tri(triB);
	triA.edges(edgeA.prev(),edgeA,edgeA.next());
	triB.edges(edgeB.prev(),edgeB,edgeB.next());
	return [triA,triB];
}
Triangulator.Tri = function(){
	this._id = null
	this._edges = [];
}
Triangulator.Tri.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Triangulator.Tri.prototype.orientate = function(){
	var a = this._edges[0];
	var b = this._edges[1];
	var c = this._edges[2];
	// TODO ... if not CCW ... fix ?
}
Triangulator.Tri.prototype.opposite = function(point){
	var edges = this._edges;
	var i, len = edges.length;
	if( Code.isa(point,Triangulator.Point) ){
		for(i=0; i<len; ++i){
			var edge = edges[i];
			if(edge.a()!==point && edge.b()!==point){
				return edge;
			}
		}
		return null;
	} // else is a edge
	var edgeIn = point;
	var pointA = edgeIn.a();
	var pointB = edgeIn.b();
	var points = this.points();
	len = points.length;
	for(i=0; i<len; ++i){
		var point = points[i];
		if(point!==pointA && point!==pointB){
			return point;
		}
	}
	return null;
}
Triangulator.Tri.prototype.toString = function(){
	return "[T: "+this.points()+" ]";
}
Triangulator.Tri.prototype.edgeA = function(){
	return this.edges(0);
}
Triangulator.Tri.prototype.edgeB = function(){
	return this.edges(1);
}
Triangulator.Tri.prototype.edgeC = function(){
	return this.edges(2);
}
Triangulator.Tri.prototype.a = function(){
	return this.edgeA().a();
}
Triangulator.Tri.prototype.b = function(){
	return this.edgeB().a();
}
Triangulator.Tri.prototype.c = function(){
	return this.edgeC().a();
}
Triangulator.Tri.prototype.edges = function(a,b,c){
	if(a!==undefined && b!==undefined && c!==undefined){
		this._edges[0] = a;
		this._edges[1] = b;
		this._edges[2] = c;
	}else if(a!==undefined){
		return this._edges[a];
	}
	return this._edges;
}
Triangulator.Tri.prototype.points = function(){
	var a = this._edges[0].a();
	var b = this._edges[1].a();
	var c = this._edges[2].a();
	return [a,b,c];
}
Triangulator.Tri.prototype.kill = function(){
	this.edges(null,null,null);
	this._edges = null;
}
Triangulator.Edge = function(a,b,t,o){
	this._id = null;
	this._a = null;
	this._b = null;
	this._opposite = null;
	this._tri = null;
	this._prev = null;
	this._next = null;
	this.a(a);
	this.b(b);
	this.tri(t);
	this.opposite(o);
}
Triangulator.Edge.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Triangulator.Edge.prototype.a = function(a){
	if(a!==undefined){
		this._a = a;
	}
	return this._a;
}
Triangulator.Edge.prototype.b = function(b){
	if(b!==undefined){
		this._b = b;
	}
	return this._b;
}
Triangulator.Edge.prototype.next = function(n){
	if(n!==undefined){
		this._next = n;
	}
	return this._next;
}
Triangulator.Edge.prototype.prev = function(p){
	if(p!==undefined){
		this._prev = p;
	}
	return this._prev;
}
Triangulator.Edge.prototype.opposite = function(o){
	if(o!==undefined){
		this._opposite = o;
	}
	return this._opposite;
}
Triangulator.Edge.prototype.tri = function(t){
	if(t!==undefined){
		this._tri = t;
	}
	return this._tri;
}
Triangulator.Edge.prototype.toString = function(){
	return "[E: "+this._a+" | "+this._b+" ]";
}
Triangulator.Edge.pair = function(){
	var a = new Triangulator.Edge();
	var b = new Triangulator.Edge();
	a.opposite(b);
	b.opposite(a);
	return [a,b];
}
Triangulator.Point = function(p,d){
	this._id = null;
	this._point = null;
	this._data = null;
	this.point(p);
	this.data(d);
}
Triangulator.Point.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Triangulator.Point.prototype.toString = function(){
	//return "[P: "+this._point+" | "+this._data+" ]";
	return "[P: "+this._point+" ("+this._id+") ]";
}
Triangulator.Point.prototype.point = function(p){
	if(p!==undefined){
		this._point = p;
	}
	return this._point;
}
Triangulator.Point.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}







