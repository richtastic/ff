// TextureViewBlend.js
// given: points <-> camera views; triangle surface
// decides which portions of which 
// combine textures from different views into single triangles - some flat, some blended 
/*
scene
texture
view
orientation
stitch / blend


DECISIONS:
	- surface normal
	- camera normal
	- camera-point distance
	- local image size [effective projected resolution]
	- obstructions
	- 

	- use 3D point neighbors to determine best triangle views to use
	- project triangle onto separate views
	- optimize simultaneous triangle projection 2D points
		- drop views with bad scores
		- drop views with triangle intersections [point / ray] and/or [3d parallelpiped / cylinder]

	- VIEW VALIDATION
		- triangulated vertices may only have 2 views assigned to them, but are actually visible in more
		- model vertices can use local vertices as starting place
		- search possibly avail cameras (relative normal directions, distances)
			- ignore cameras resulting from intersections
			- ignore cameras sufficiently further away than closest cameras
		- ignore silhouette images [vertex is visible but at least 1 connected triangle is not]
		- VALID IMAGE SET
			- visible
		- TARGET IMAGE
		=> COULD HAVE AN EMPTY SET, OR SINGLE IMAGE => forcing other vertices to bend to their demands
			=> blank areas of no/faded texture

	- VIEW RANKING:
		- area ~ 1/distance^2
		- orthogonality of normals
			(normal dot product [cosine theta]) * (projected image area OR 1/distance^2)
				- image area is only really appropriate with triangles, not vertexes

	- FRONTIER-FACE-MINIMIZING
		- keep a set of potentially-changing frontier faces
		iterate:
			- on an update add in any potentially changing faces
			- change any remaining faces if it reduces the total count
				- use a cost-based priority flipping

	- frontier-face local registration [could do it for all vertices]
		- projection is only accurate to ~pixel
		- for each vertex, locally try to match (up to) 3 textures at a time at ~sub-pixel level
		- use homography transform from triangle projection

	- TEXTURE SIZING:
		- maximum and minimum triangle sizes in 3D space
		- total area of the scene in 3D space
			- a triangle might have a sized resolution larger than the available resolution
				=> avoid wasting space by only using available resolution size

	- DIFFUSE TEXTURE OBTAINING
		- get median of a pixel value [requires multiple viewpoints of same pixel]
	
*/
// --------------------------------------------------------------------------------------------------------------------
function TextureViewBlend(){
	// this._pointSpace = null;
	this._triangleSpace = new OctTree();
	this._vertexSpace = new OctTree();
	this._views = [];
	// this._images = null;
	// this._textures = null; //
	this._textureAtlas = null;
	this._averageTriangleResolution = 10; // ?
	this._maximumTextureAtlasSize = 512; 
	this._maximumTriangleResolution = 128; // allowed resolution pixel size before subdividing triangle
	this._outputResolutionPercent = TextureViewBlend.OUTPUT_RESOLUTION_HI;
}
TextureViewBlend.OUTPUT_RESOLUTION_HI = 1.0;
TextureViewBlend.OUTPUT_RESOLUTION_ME = 0.5;
TextureViewBlend.OUTPUT_RESOLUTION_LO = 0.25;
// --------------------------------------------------------------------------------------------------------------------
TextureViewBlend.prototype.addView = function(viewMatrix, viewK, viewResolution){
	var viewID = this._views.length;
	var view = new TextureViewBlend.View3D(viewID, viewMatrix, viewK, viewResolution);
	this._push(view);
	return viewID;
}
// TextureViewBlend.prototype.addVertex = function(point3D){//,viewList,point2DList){
// 	//
// }
TextureViewBlend.prototype.setTriangles = function(triangleList){
	// setup spaces
	var minPoint = null;
	var maxPoint = null;
	var vetexes = [];
	for(var i=0; i<triangleList.length; ++i){
		var tri = triangleList;
		var A = tri.A();
		var B = tri.B();
		var C = tri.C();
		if(!minPoint){
			minPoint = A.copy();
			maxPoint = A.copy();
		}
		V3D.min(minPoint,minPoint,A);
		V3D.min(minPoint,minPoint,B);
		V3D.min(minPoint,minPoint,C);
		V3D.max(maxPoint,maxPoint,A);
		V3D.max(maxPoint,maxPoint,B);
		V3D.max(maxPoint,maxPoint,C);
	}
	var size = V3D.sub(maxPoint,minPoint);
	size.scale(2);
	var center = V3D.avg(maxPoint,minPoint);
	this._vertexSpace.initWithDimensions(center, size);
	// create local objects
	for(var i=0; i<triangleList.length; ++i){
		var tri = triangleList;
		var A = tri.A();
		var B = tri.B();
		var C = tri.C();
		A = this._findOrCreateVertex(A);
		B = this._findOrCreateVertex(B);
		C = this._findOrCreateVertex(C);
		var localTri = new TextureViewBlend.Tri3D(A,B,C);
		A.addTri(localTri);
		B.addTri(localTri);
		C.addTri(localTri);
		this._triangleSpace.addObject(localTri);
	}
	// init vertexes
	var vertexes = this._vertexSpace.toArray();
	for(var i=0; i<vertexes; ++i){
		var vertex = vertexes[i];
		vertex.calculateNormal();
	}
}
TextureViewBlend.prototype._findOrCreateVertex = function(point){
	var epsilon = 1E-12;
	var vertex = null;
	var closest = this._vertexSpace.closestObject(point);
	if(closest){
		if(V3D.equal(closest.point(),point,epsilon)){
			vertex = closest;
		}
	}
	if(!vertex){
		vertex = new TextureViewBlend.Vertex3D(point);
		this._vertexSpace.addObject(vertex);
	}
	return vertex;
}
TextureViewBlend.prototype.calculateTextureViews = function(){
	this._calculateBestViews();
	this._calculateTriangles();
	this._calculateProjections();
	this._calculatePacking();
}
TextureViewBlend.prototype._calculateBestViews = function(){
	// pick best views for each triangle/vertex [list of best target images] w/ some score associated with 'cost' of a view
	var maximumBehindAngle = Math.radians(90); // 45->90
	var maximumObscureAngle = Math.radians(84.2609); // 45->90 [0.1]
	var maximumDistanceRatio = 8.0; // views that are more than 8x as far away as 
	var vertexes = this._vertexSpace.toArray();
	var views = this._views;
	var angle;
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var vertexPoint = vertex.point();
		var vertexNormal = vertex.normal();
		var keep = [];
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var viewCenter = view.center();
			// ignore cameras behind
			var vertexToView = V3D.sub(viewCenter,vertexPoint);
			angle = V3D.angle(vertexToView,vertexNormal);
			if(angle<maximumBehindAngle){
				// ignore cameras obsecure
				var viewNormal = view.normal();
				var viewReverseNormal = viewNormal.copy().scale(-1);
				angle = V3D.angle(vertexToView,vertexNormal);
				if(angle<maximumObscureAngle){
					// ignore obstruction
					var tris = this._triangleSpace.objectsInsideRay(vertexPoint,vertexToView);
					var intersection = null;
					for(var k=0; k<tris.length; ++k){
						var tri = tris[k];
						if(tri.hasVertex(vertex)){ // ignore tris sharing this vertex [self intersection]
							continue;
						}
						var a = tri.A();
						var b = tri.B();
						var c = tri.C();
						var n = tri.normal();
						var intersect = Code.intersectRayTri(vertexPoint,vertexToView, a,b,c,n);
						if(intersect){
							intersection = intersect;
							break;
						}
					}
					if(!intersection){
						var distance = vertexToView.length();
							vertexToView.norm();
						var dot = V3D.dot(vertexToView,viewReverseNormal);
						var dis = Math.pow(distance,-1); // 1/dist, 1/sqrt(dist)
						var cost = dot*dis;
						keep.push([view,cost,distance]);
					}
				}
			}
		}
		keep.sort(function(a,b){ // nearer objects closer
			return a[2] < b[2] ? -1 : 1;
		});
		// ignore far views
		if(keep.length>1){
			var minDistance = keep[0][2];
			for(var j=keep.length-1; j>0; --j){
				var info = keep[j];
				if(info[2]>maximumDistanceRatio*minDistance){
					keep.pop(); // remove this last item
				}else{ // done
					break;
				}
			}
		}
		for(var j=0; j<keep.length; ++j){
			var info = keep[j];
			var view = info[0];
			var cost = info[1];
			vertex.addView(view.id(),cost);
		}
	}
}
TextureViewBlend.prototype._calculateTriangles = function(){ // minimize frontier triangles
	// assign best views
	var vertexes = this._vertexSpace.toArray();
	for(var i=0; i<vertexes; ++i){
		var vertex = vertexes[i];
		vertex.clearFlips();
		vertex.pickBestView();
	}
	// setup queue
	var queue = new PriorityQueue(TextureViewBlend._sortFlipEvent);
	for(var i=0; i<vertexes; ++i){
		var vertex = vertexes[i];
		var flips = vertex.flipsFromCurrentTarget();
		for(var j=0; j<flips.length; ++j){
			var flip = flips[j];
			vertex.addFlip(flip);
			queue.push(flip);
		}
	}
	// patch growing - expand regions to minimize frontier triangles
var iter = 0;
	while(!queue.isEmpty()){
		console.log(" ------ Q: "+queue.length());
		var flip = queue.pop();
		var vertex = flip.vertex();
		var target = flip.targetView();
		// do flip
		vertex.setTarget(target);
		var adjacent = vertex.adjacentVertexes();
		adjacent.push(vertex);
		// remove old
		for(var i=0; i<adjacent.length; ++i){
			var adj = adjacent[i];
			var flips = adj.flips();
			for(var j=0; j<vertexes; ++j){
				var flip = flips[j];
				queue.removeObject(flip);
			}
			adj.clearFlips();
		}
		// add new
		for(var i=0; i<adjacent.length; ++i){
			var adj = adjacent[i];
			var flips = adj.flipsFromCurrentTarget();
			for(var j=0; j<flips.length; ++j){
				var flip = flips[j];
				adj.addFlip(flip);
				queue.push(flip);
			}
		}
		// ...
++iter;
if(iter>1000){
throw "whoopse";
}
	}
}

TextureViewBlend.prototype._calculateProjections = function(){ // use top ~3 views for each vertex to find average optimal location
	var vertexes = this._vertexSpace.toArray();

	// keep only necessary views
	for(var i=0; i<vertexes; ++i){
		var vertex = vertexes[i];
		vertex.dropUnnecessaryViews();
	}

	// find optimal locations for each vertex / or / just frontier vertexes
	for(var i=0; i<vertexes; ++i){
		var vertex = vertexes[i];
		var point3D = vertex.point();
		// project to view
		var point2D = R3D.projectPoint3D(point3D);
		// find best placement
		// needle / haystack for all 
	}

}
TextureViewBlend.prototype._calculatePacking = function(){ // keep triangles under maximum size for packing & pack
	var triangles = this._triangleSpace.toArray();
	var normals = [];
	for(var i=0; i<triangles.length; ++i){
		tri = triangles[i];
		// var vertexA = tri.vertexA();
		// var vertexB = tri.vertexB();
		// var vertexC = tri.vertexC();

		var targetViews = tri.targetViews();		
		for(var j=0; j<targetViews.length; ++j){
			var view = targetViews[j];
			var point2DA = view.projectPoint3D(point3DA);
		}
		// subdivide triangles if necessary

	}
	
	// calculate packing
	var atlas = new TextureAtlas(this._maximumTextureAtlasSize);
	for(var i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var A = tri.A();
		var B = tri.B();
		var C = tri.C();
		var sizeAB = Code.triSizeWithBase(A,B,C);
		var sizeBC = Code.triSizeWithBase(B,C,A);
		var sizeAC = Code.triSizeWithBase(C,A,B);
		var areaAB = sizeAB.lengthSquare();
		var areaBC = sizeBC.lengthSquare();
		var areaAC = sizeAC.lengthSquare();
		// pick smallest size
		var size2D = sizeAB;
		var area2D = areaAB;
		if(area2D>areaBC){
			size2D = sizeBC;
			area2D = areaBC;
		}
		if(area2D>areaAC){
			size2D = sizeAC;
			area2D = areaAC;
		}
		tri.
		var map = atlas.addRectMapping(size2D, {});
		tri.temp(map);
	}
	atlas.pack();

	this._textureAtlas = atlas;
}
TextureViewBlend.prototype.renderWithTexture = function(viewID, imageMatrix){ // update the final textures using the source textures one at a time
	// determine if a given triangle needs texture, & apply barycentric filling
	var triangles = this._triangleSpace.toArray();
	var normals = [];
	for(var i=0; i<triangles.length; ++i){
		tri = triangles[i];
		var vertexes = tri.vertexes();

	}
}

TextureViewBlend.prototype.subdivideTriangle = function(tri){
	var maxAngle = Code.maxTriAngle(tri.A(),tri.B(),tri.C());
	var newTris = [];
	if(maxAngle>Math.PI*0.5){ // 90 degrees = 1 split
		throw ">90";
	}else{ // more equalateral-like = 3 splits
		throw "<=90";
	}
	return newTris;
}


// --------------------------------------------------------------------------------------------------------------------
TextureViewBlend.View3D = function(i, P, K, R){
	this._id = i;
	this._up = null;
	this._right = null;
	this._extrinsic = P;
	this._resolution = R;
		this._K = R3D.cameraFromScaledImageSize(K, R);
		this._Kinv = Matrix.inverse(this._K);
	var twist = Code.vectorTwistFromMatrix3D(P);
	this._center = twist["offset"];
	this._normal = twist["direction"];
	this._twist = twist["angle"];

	// center
	var org = new V3D(0,0,0);
	trans.multV3DtoV3D(org,org);
	// up
	var up = new V3D(0,1,0);
	trans.multV3DtoV3D(up,up);
	up.sub(org);
	up.norm();
	// right
	var right = new V3D(1,0,0);
	trans.multV3DtoV3D(right,right);
	right.sub(org);
	right.norm();
	this._right = right;
	this._up = up;
}
TextureViewBlend.View3D.prototype.normal = function(){
	return this._normal;
}
TextureViewBlend.View3D.prototype.center = function(){
	return this._center;
}
TextureViewBlend.View3D.prototype.up = function(){
	return this._up;
}
TextureViewBlend.View3D.prototype.right = function(){
	return this._right;
}
TextureViewBlend.View3D.prototype.width = function(){
	return this._resolution.width();
}
TextureViewBlend.View3D.prototype.height = function(){
	return this._resolution.height();
}
TextureViewBlend.View3D.prototype.projectPoint3D = function(point3D){
	var K = this._K;
	var distortions = null;
	var absoluteTransform = this._extrinsic;
	var projected2D = R3D.projectPoint3DToCamera2DForward(point3D, absoluteTransform, K, distortions);
	return projected2D;
}

// --------------------------------------------------------------------------------------------------------------------
TextureViewBlend.Tri3D = function(a,b,c){
	this._vertexA = a;
	this._vertexB = b;
	this._vertexC = c;
	TextureViewBlend.Tri3D._.constructor.call(this,a.point(),b.point(),c.point());
}
Code.inheritClass(TextureViewBlend.Tri3D, Tri3D);
TextureViewBlend.Tri3D.prototype.isFrontier = function(){ // internal == all same
	return !(this._vertexA.targetView()==this._vertexB.targetView()==this._vertexC.targetView());
}
TextureViewBlend.Tri3D.prototype.hasVertex = function(v){
	return this._vertexA==v || this._vertexB==v || this._vertexC==v;
}
TextureViewBlend.Tri3D.prototype.vertexA = function(){
	return this._vertexA
}
TextureViewBlend.Tri3D.prototype.vertexB = function(){
	return this._vertexB;
}
TextureViewBlend.Tri3D.prototype.vertexC = function(){
	return this._vertexC;
}
TextureViewBlend.Tri3D.prototype.vertexes = function(v){
	return [this._vertexA,this._vertexB,this._vertexC];
}
TextureViewBlend.Tri3D.prototype.oppositeVertexes = function(v){
	var list = [];
	if(v!=this._vertexA){
		list.push(this._vertexA);
	}
	if(v!=this._vertexB){
		list.push(this._vertexB);
	}
	if(v!=this._vertexC){
		list.push(this._vertexC);
	}
	return list;
}

// --------------------------------------------------------------------------------------------------------------------
TextureViewBlend.Vertex3D = function(point){
	this._id = TextureViewBlend.Vertex3D._count++;
	this._triangleList = null;
	this._normal = null;
	this._viewList = [];
	this._targetView = null;
	this._targetCost = null;
	this._flips = [];
	this._point3D = null;
	this._texturePoint = null; // final
	this.point(point);
}
TextureViewBlend.Vertex3D._count = 0;
TextureViewBlend.Vertex3D.prototype.id = function(){
	return this._id;
}
TextureViewBlend.Vertex3D.prototype.point = function(point){
	if(point!==undefined){
		this._point3D = point.copy();
	}
	return this._point3D;
}
TextureViewBlend.Vertex3D.prototype.flips = function(){
	return this._flips;
}
TextureViewBlend.Vertex3D.prototype.clearFlips = function(){
	Code.emptyArray(this._flips);
}
TextureViewBlend.Vertex3D.prototype.addFlip = function(flip){
	this._flips.push(flip);
}
TextureViewBlend.Vertex3D.prototype.addView = function(viewID, cost, point){
	var obj = new TextureViewBlend.VertexViewMap(viewID, cost, point);
	this._viewList.push(obj);
}
TextureViewBlend.Vertex3D.prototype.addTri = function(tri){
	this._triangleList.push(tri);
}
TextureViewBlend.Vertex3D.prototype.calculateNormal = function(){
	var triangles = this._triangleList;
	var normals = [];
	for(var i=0; i<triangles.length; ++i){
		tri = triangles[i];
		normals.push(tri.normal());
	}
	this._normal = Code.averageAngleVector3D(normals);
}
TextureViewBlend.Vertex3D.prototype.pickBestView = function(){
	if(this._viewList.length>0){
		this._targetView = this._viewList[0]["id"];
		this._targetCost = this._viewList[0]["cost"];
		return true;
	}
	return false;
}
TextureViewBlend.Vertex3D.prototype.targetView = function(){
	return this._targetView;
}
TextureViewBlend.Vertex3D.prototype.setTarget = function(){
	return this._targetView;
}
TextureViewBlend.Vertex3D.prototype.targetCost = function(){
	return this._targetCost;
}

TextureViewBlend.Vertex3D.prototype.dropUnnecessaryViews = function(){
	// need all views used by neighbor targets
	// need minimum of 3

	HERE

}
TextureViewBlend.Vertex3D.prototype.targetViews = function(){ // list of only top target views of vertices
	HERE


}



TextureViewBlend.Vertex3D.prototype.adjacentVertexes = function(){
	var triangles = this._triangleList;
	var target = this._targetView;
	var views = this._viewList;
	var neighbors = {};
	for(var i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var vA = tri.vertexA();
		var vB = tri.vertexB();
		var vC = tri.vertexC();
		if(vA!=this){
			neighbors[vA.id()+""] = vA;
		}
		if(vB!=this){
			neighbors[vB.id()+""] = vB;
		}
		if(vC!=this){
			neighbors[vC.id()+""] = vC;
		}
	}
	var list = [];
	var keys = Code.keys();
	for(var i=0; i<keys.length; ++i){
		list.push(neighbors[keys[i]]);
		delete neighbors[keys[i]]; // cleanup
	}
	return list;
}
TextureViewBlend.Vertex3D.prototype.flipsFromCurrentTarget = function(){
	var triangles = this._triangleList;
	var flips = [];
	var isFrontier = false;
	// need to be touching at least 1 frontier 
	for(var i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var vA = tri.vertexA();
		var vB = tri.vertexB();
		var vC = tri.vertexC();
		if(tri.isFrontier()){
			isFrontier = true;
			break;
		}
	}
	if(isFrontier){
		var vC = this;
		var tC = vC.targetView();
		var targetCost = vC.targetCost();
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var viewID = view.id();
			var viewCost = view.cost();
			var flipCount = 0;
			if(viewID!=tC){ // can flip too
				// find the number of switches
				for(var i=0; i<triangles.length; ++i){
					var tri = triangles[i];
					var opposites = tri.oppositeVertexes(vC);
					var vA = opposites[0];
					var vB = opposites[1];
					var tA = vA.targetView();
					var tB = vB.targetView();
					if(tA==tC && tB==tC){
						flipCount += 1;
					}
				}
			}
			if(flipCount>0){
				var deltaCost = targetCost - viewCost;
				totalCost = deltaCost/flipCount;
				var flip = new TextureViewBlend.FlipEvent(vC,totalCost);
			}
		}
	}
	return flips;
}
// --------------------------------------------------------------------------------------------------------------------
TextureViewBlend.VertexViewMap = function(viewID, cost, point){
	this._id = null;
	this._cost = null;
	this._point = null;
	this.id(id);
	this.cost(cost);
	this.point(point);
}
TextureViewBlend.VertexViewMap.prototype.id = function(id){
	if(id!==undefined){
		this._id = id;
	}
	return this._id;
}
TextureViewBlend.VertexViewMap.prototype.cost = function(cost){
	if(cost!==undefined){
		this._cost = cost;
	}
	return this._cost;
}
TextureViewBlend.VertexViewMap.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
}
// --------------------------------------------------------------------------------------------------------------------
TextureViewBlend._sortFlipEvent = function(a,b){
	if(a===b){
		return 0;
	}
	return a.cost()<b.cost() ? -1 : 1;
}
TextureViewBlend.FlipEvent = function(vertex, cost, target){
	this._vertex = vertex;
	this._cost = cost;
	this._targetView = target;
}
TextureViewBlend.FlipEvent.prototype.vertex = function(){
	return this._vertex;
}
TextureViewBlend.FlipEvent.prototype.cost = function(){
	return this._cost;
}
TextureViewBlend.FlipEvent.prototype.targetView = function(){
	return this._targetView;
}
// --------------------------------------------------------------------------------------------------------------------








