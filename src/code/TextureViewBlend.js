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
	this._maximumTextureAtlasSize = 1024; 
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
	var maximumDistanceRatio = 8.0; // views that are more than 8x as far away not worth averaging ~ (1/2)^3 ~ 1/8 = 0.125 area
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
TextureViewBlend.prototype._calculateOptimumVertexLocation = function(vertex){
	// find optimal locations for each vertex / or / just frontier vertexes
	var needleSize = 11;
	var haystackSize = needleSize*3;
	// ...
	var point3D = vertex.point();
	// project to view
	var views = vertex.targetViews();
	var points = [];
	for(var j=0; j<views.length; ++j){
		var view = views[j];
		var point2D = view.projectPoint3D(point3D);
		view.point(point2D); // default in middle
	}
	if(views.length==1){
		return;
	}
	// find best placement = average over all optimum locations:

	// project from vertex onto each view until average size of project patch is haystack size

	// extract needle / haystack for all 
	var needles = [];
	var haystacks = [];
	for(var j=0; j<views.length; ++j){
		var view = views[j];
		// view.point(points[j]);
	}

	// find best needle location in each haystack

	// ...

// IF SCORE == 0 ... it is A) added point B) nonexistant / guessed
}
TextureViewBlend.prototype._calculateProjections = function(){ // use top ~3 views for each vertex to find average optimal location
	var vertexes = this._vertexSpace.toArray();
	var triangles = this._triangleSpace.toArray();
	// clear accumulators
	for(var i=0; i<vertexes; ++i){
		var vertex = vertexes[i];
		vertex.resetRequiredViews();
	}
	// calculate necessary views
	for(var i=0; i<triangles; ++i){
		var tri = triangles[i];
		tri.calculateNecessaryViews();
	}
	// keep only necessary views
	for(var i=0; i<vertexes; ++i){
		var vertex = vertexes[i];
		vertex.dropUnnecessaryViews(); // and add necessary ones
	}
	// project points for views & optimize
	for(var i=0; i<vertexes; ++i){
		var vertex = vertexes[i];
		this._calculateOptimumVertexLocation(vertex);
	}
	// center points are separate:
	for(var i=0; i<triangles; ++i){
		var tri = triangles[i];
		vertex = tri.vertexD();
		this._calculateOptimumVertexLocation(vertex);
	}
}
TextureViewBlend.prototype._calculatePacking = function(){ // keep triangles under maximum size for packing & pack
	var triSpace = this._triangleSpace;
	var triangles = triSpace.toArray();
	var padding = 1;
	var padding2 = 2*padding;
	var totalMaxLength = this._maximumTriangleResolution - padding2; // allow for padding ..
	var normals = [];
	console.log("check max length");
	for(var i=0; i<triangles.length; ++i){
		tri = triangles[i];
		if(tri.removed()){
			continue;
		}
		var vertexA = tri.vertexA();
		var vertexB = tri.vertexB();
		var vertexC = tri.vertexC();
		var point3DA = vertexA.point();
		var point3DB = vertexB.point();
		var point3DC = vertexC.point();
		var targetViews = tri.targetViews();
		var lengthAB = V3D.distance(point3DA,point3DB);
		var lengthBC = V3D.distance(point3DB,point3DC);
		var lengthCA = V3D.distance(point3DC,point3DA);
		var maxResolutionDimension = null;
		var maxResolutionScale = null;
		var maxLengthTri3D = Math.max(lengthAB,lengthBC,lengthCA);
		for(var j=0; j<targetViews.length; ++j){
			var view = targetViews[j];
			var point2DA = vertexA.targetViewWithID(view.id()).point();
			var point2DB = vertexB.targetViewWithID(view.id()).point();
			var point2DC = vertexC.targetViewWithID(view.id()).point();
			var lenAB = V2D.distance(point2DA,point2DB);
			var lenBC = V2D.distance(point2DB,point2DC);
			var lenCA = V2D.distance(point2DC,point2DA);
			var scaleAB = lenAB/lengthAB;
			var scaleBC = lenBC/lengthBC;
			var scaleCA = lenCA/lengthCA;
			var maxSca = Math.max(scaleAB,scaleBC,scaleCA);
			var maxLen = maxSca*maxLengthTri3D;
			if(!maxResolutionDimension || maxResolutionDimension<maxLen){
				maxResolutionDimension = maxLen;
				maxResolutionScale = maxSca;
			}
		}
		// subdivide triangles if necessary
		if(maxResolutionDimension>totalMaxLength){
			var result = this.subdivideTriangle(tri);
			// var removed = result["removed"]; // dead triangles already ignored
			var added = result["added"];
			for(var j=0; j<added.length; ++j){
				var t = added[j];
				triSpace.addObject(t);
				triangles.push(t);
			}
		}else{
			triangle.maxProjectedScale(maxResolutionScale);
		}
	}
	
	// calculate packing
	console.log("calculate packing min size");
	var atlas = new TextureAtlas(this._maximumTextureAtlasSize);
	for(var i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var A = tri.A();
		var B = tri.B();
		var C = tri.C();
		var scale = tri.maxProjectedScale();
		if(!scale){
			throw "no max proj scale";
		}
		// size with lowest area: (could result in too-long edge ?)
		var sizeAB = Code.triSizeWithBase(A,B,C);
		var sizeBC = Code.triSizeWithBase(B,C,A);
		var sizeAC = Code.triSizeWithBase(C,A,B);
		// restrict chosen area to maximum length sides
			sizeAB.scale(maxProjectedScale);
			sizeBC.scale(maxProjectedScale);
			sizeAC.scale(maxProjectedScale);
			if(sizeAB.x>totalMaxLength || sizeAB.y>totalMaxLength){
				sizeAB = null;
			}
			if(sizeBC.x>totalMaxLength || sizeBC.y>totalMaxLength){
				sizeBC = null;
			}
			if(sizeAC.x>totalMaxLength || sizeAC.y>totalMaxLength){
				sizeAC = null;
			}
		var areaAB = sizeAB ? sizeAB.lengthSquare() : 0;
		var areaBC = sizeBC ? sizeBC.lengthSquare() : 0;
		var areaAC = sizeAC ? sizeAC.lengthSquare() : 0;
		// pick smallest size
		var vA = tri.vertexA();
		var vB = tri.vertexB();
		var vC = tri.vertexC();
		var size2D = sizeAB;
		var area2D = areaAB;
		if(!size2D || area2D>areaBC){
			size2D = sizeBC;
			area2D = areaBC;
			vA = tri.vertexB();
			vB = tri.vertexC();
			vC = tri.vertexA();
		}
		if(!size2D || area2D>areaAC){
			size2D = sizeAC;
			area2D = areaAC;
			vA = tri.vertexC();
			vB = tri.vertexA();
			vC = tri.vertexB();
		}
		// map triangle 3D space to 2D texture
		size2D.x += padding2;
		size2D.y += padding2;
		size2D.x = Math.floor(size2D.x);
		size2D.y = Math.floor(size2D.y);
		var info = {"A":vA,"B":vB,"C":vC,"tri":tri};
		var map = atlas.addRectMapping(size2D, info);
		tri.temp(map);
	}
	result = atlas.pack();
	var objects = result["objects"];
	var pages = result["sheets"];

	// mapping to texture UV locations
	console.log("calculate final UV");
	// var matrix3D = new Matrix(3,3);
	for(var i=0; i<objects.length; ++i){
		var object = objects[i];
		var rect = object["rect"];
		var page = object["sheet"];
		var item = object["object"];
		var tri = item["tri"];
		var vA = item["A"];
		var vB = item["B"];
		var vC = item["C"];
		var tri = item["tri"];
		var scale = tri.maxProjectedScale();
		// transform to 2D
		var A = vA.point();
		var B = vB.point();
		var C = vC.point();
		var AB = V3D.sub(B,A);
		var AC = V3D.sub(C,A);
		var dot = V3D.dot(AB,AC);
		var dirZ = V3D.cross(AB,BC).norm();
		// move to origin
		var dirX = AB.copy().norm();
		var dirY = V3D.cross(dirZ,dirX).norm();
		var dotX = V3D.dot(dirX,AC);
		var dotY = V3D.dot(dirY,AC);
		var lenAB = AB.length();
		// var lenAC = AC.length();
		var a = new V2D(0,0);
		var b = new V2D(scale*lenAB,0);
		var c = new V2D(scale*dotX,scale*dotY);
		// if c is left of a:
		if(dotX<0){
			var shiftX = c.x;
			a.add(shiftX,0);
			b.add(shiftX,0);
			c.add(shiftX,0);
		}
		// add final padding 
		a.add(padding,padding);
		b.add(padding,padding);
		c.add(padding,padding);
		// save texture uv locations
		tri.texturePoint2D(vA,a);
		tri.texturePoint2D(vB,b);
		tri.texturePoint2D(vC,c);
		tri.textureIndex(page);
		tri.textureRect(rect);
	}
	var textureSize = this._maximumTextureAtlasSize;
	for(var i=0; i<pages; ++i){
		var tex = atlas.addTexture(null, textureSize,textureSize);
	}
	this._textureAtlas = atlas;
}
TextureViewBlend.prototype.renderWithTexture = function(viewID, imageMatrix){ // update the final textures using the source textures one at a time
	// determine if a given triangle needs texture, & apply barycentric filling
	var padding = 1;
	var triangles = this._triangleSpace.toArray();
	// sort on texture index for in-order loading/unloading
	triangles.sort(function(a,b){
		return a.textureIndex() < b.textureIndex() ? -1 : 1;
	});
	var atlas = this._textureAtlas;
	for(var i=0; i<triangles.length; ++i){
		tri = triangles[i];
		var views = tri.requiredViews();
		var foundView = null;
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			if(view==viewID){
				foundView = view;
				break;
			}
		}
		if(foundView===null){
			continue;
		}
		var viewCount = views.length;
		var parent = tri.parent();
		var parentRoot = parent;
		while(parentRoot && parentRoot.parent()){
			parentRoot = parentRoot.parent();
		}
		var vertexA = tri.vertexA();
		var vertexB = tri.vertexB();
		var vertexC = tri.vertexC();
		var vertexD = tri.vertexD();
		// views
		var viewMapA = vertexA.viewFromID(viewID);
		var viewMapB = vertexB.viewFromID(viewID);
		var viewMapC = vertexC.viewFromID(viewID);
		var viewMapD = vertexD.viewFromID(viewID);
		// 3D
		var A = vertexA.point();
		var B = vertexB.point();
		var C = vertexC.point();
		var D = vertexD.point(); // 3D center
		// view image
		var local2DA = viewMapA.point();
		var local2DB = viewMapB.point();
		var local2DC = viewMapC.point();
		var local2DD = viewMapD.point(); // projected center in view_i
		// final texture
		var textureA = tri.textureA();
		var textureB = tri.textureB();
		var textureC = tri.textureC();
		var textureD = tri.textureD(); // V2D.average([textureA,textureB,textureC]); // 2D center
		var index = tri.textureIndex();
		// texture image
		var texture = atlas.texture(index);
		var source = texture.source();
		// rect
		var rect2D = tri.textureRect();
		// 
		var fromPoints = [textureA,textureB,textureC,textureD]; // from final image
		var toPoints = [local2DA,local2DB,local2DC,local2DD]; // to source
		var homography = Matrix.get2DProjectiveMatrix(fromPoints,toPoints);
		// extract solid rect area:
		var image = ImageMat.extractRectWithProjection(imageMatrix,null,null, rect2D.width(),rect2D.height(), homography);
		// multiply by barycenter coords
		if(viewCount>1){
			// var alpha, beta, gamma;
			var multA = 0.0;
			var multB = 0.0;
			var multC = 0.0;
			if(viewMapA.id()==viewID){
				multA = 1.0;
			}
			if(viewMapB.id()==viewID){
				multB = 1.0;
			}
			if(viewMapC.id()==viewID){
				multC = 1.0;
			}
			var transform = null;
			var tA = textureA;
			var tB = textureB;
			var tC = textureC;
			if(parentRoot){ // need parent for barycentric coords
				// use parent triangle texture
				tA = parentRoot.textureA();
				tB = parentRoot.textureB();
				tC = parentRoot.textureC();
				// transform from child 2d location to parent2D location
				transform = R3D.affineMatrixExact([textureA,textureB,textureC],[tA,tB,tC]);
			} // else // use self barycentric
			// want final percentage of current texture image:
			var destWidth = rect.width();
			var destHeight = rect.height();
			var location = new V2D();
			var value = new V3D();
			var coord = new V3D();
			for(var destJ=0; destJ<destHeight; ++destJ){
				for(var destI=0; destI<destWidth; ++destI){
					location.set(destI,destJ);
					if(transform){
						transform.multV2DtoV2D(location,location);
					}
					Code.triBarycentricCoordinate2D(coord, location, tA,tB,tC);
					var percent = coord.x*multA + coord.y*multB + coord.z*multC;
					image.get(destI,destJ, v);
					v.scale(percent);
					image.set(destI,destJ, v);
				}
			}
		}

		// var image = new ImageMat(size2D.x,size2D.y);
		// for each pixel in local image rect
		// var dest = new V2D();
		// var source = new V2D();
		// for(var destJ=0; destJ<destHeight; ++destJ){
		// 	for(var destI=0; destI<destWidth; ++destI){
		// 		dest.set(destI,destJ);
		// 	}
		// }
		// append to texture
		texture.insertAdd(image, rect2D.x(),origin2D.y());
	}
}

TextureViewBlend.prototype.subdivideTriangle = function(tri){
	var triSpace = this._triangleSpace;
	var vertexSpace = this._vertexSpace;
	// var maxAngle = Code.maxTriAngle(tri.A(),tri.B(),tri.C());
	// if(maxAngle>Math.PI*0.5){ // 90 degrees = 1 split
	// 	throw ">90";
	// }else{ // more equalateral-like = 3 splits
	// 	throw "<=90";
	// }
// NEED TO MAKE NEW 3D PROJECTION MAPPING VALUES / COPIES


	
	
	var vA = tri.vertexA();
	var vB = tri.vertexB();
	var vC = tri.vertexC();
	var adjacent = tri.neighborTriangles();
	var neighborAB = TextureViewBlend.triangleWithSameTwoVertexes(adjacent,vA,vB);
	var neighborBC = TextureViewBlend.triangleWithSameTwoVertexes(adjacent,vB,vC);
	var neighborCA = TextureViewBlend.triangleWithSameTwoVertexes(adjacent,vC,vA);
	var A = vA.point();
	var B = vB.point();
	var C = vC.point();
	// mids
	var mpAB = V3D.midpoint(A,B);
	var mpBC = V3D.midpoint(B,C);
	var mpCA = V3D.midpoint(C,A);
	var vAB = new TextureViewBlend.Vertex3D(mpAB);
	var vBC = new TextureViewBlend.Vertex3D(mpBC);
	var vCA = new TextureViewBlend.Vertex3D(mpCA);
		
		
		// vAB:
		tri, neighborAB
		vAB.addView(viewID, 0, null);

		// vBC


		// vCA



		// - oAB, A, B, C



		this._calculateOptimumVertexLocation(vAB);
		this._calculateOptimumVertexLocation(vBC);
		this._calculateOptimumVertexLocation(vCA);





	vertexSpace.addObject(vAB);
	vertexSpace.addObject(vBC);
	vertexSpace.addObject(vCA);
	// main triangle:
	var tri0 = new TextureViewBlend.Tri3D(vAB,vBC,vCA, tri);
	var tri1 = new TextureViewBlend.Tri3D(vAB,vBC,vCA, tri);
	var tri2 = new TextureViewBlend.Tri3D(vAB,vBC,vCA, tri);
	var tri3 = new TextureViewBlend.Tri3D(vAB,vBC,vCA, tri);
	var result = [];
	var added = [];
	var removed = [];
	// remove old
	vA.removeTri(tri);
	vB.removeTri(tri);
	vC.removeTri(tri);
	removed.push(tri);
	// add new
	vA.addTri(tri1);
	vB.addTri(tri2);
	vC.addTri(tri3);
	vAB.addTri(tri0);
	vAB.addTri(tri1);
	vAB.addTri(tri2);
	vBC.addTri(tri0);
	vBC.addTri(tri2);
	vBC.addTri(tri3);
	vCA.addTri(tri0);
	vCA.addTri(tri3);
	vCA.addTri(tri1);
	added.push(tri0);
	added.push(tri1);
	added.push(tri2);
	added.push(tri3);
	// adjacent triangles
	if(neighborAB){
		result = TextureViewBlend._splitBaseTriangle(neighborAB, vA,vB,vAB);
		Code.arrayAppendArray(added,result["added"]);
		Code.arrayAppendArray(removed,result["removed"]);
	}
	if(neighborBC){
		result = TextureViewBlend._splitBaseTriangle(neighborBC, vB,vC,vBC);
		Code.arrayAppendArray(added,result["added"]);
		Code.arrayAppendArray(removed,result["removed"]);
	}
	if(neighborCA){
		result = TextureViewBlend._splitBaseTriangle(neighborCA, vC,vA,vCA);
		Code.arrayAppendArray(added,result["added"]);
		Code.arrayAppendArray(removed,result["removed"]);
	}
	// space
	for(var j=0; j<removed.length; ++j){
		var t = removed[j];
		triSpace.removeObject(t);
		// t.kill();
	}
	for(var j=0; j<added.length; ++j){
		var t = added[j];
		triSpace.addObject(t);
	}
	return {"added":added, "removed":removed};
}
TextureViewBlend._splitBaseTriangle = function(tri,vA,vB, vAB){
	var vC = tri.oppositeVertex(vA,vB);
	if(!tri.sameOrder(vA,vB,vC)){
		var temp = vB;
		vB = vA;
		vA = temp;
	}
	var tri1 = new TextureViewBlend.Tri3D(vA,vAB,vC);
	var tri2 = new TextureViewBlend.Tri3D(vAB,vB,vC);
	// remove from current
	vA.removeTri(tri);
	vB.removeTri(tri);
	vC.removeTri(tri);
	// add to new
	vA.addTri(tri1);
	vB.addTri(tri1);
	vAB.addTri(tri1);
	vAB.addTri(tri2);
	vC.addTri(tri1);
	vC.addTri(tri2);
	return {"added":[tri1,tri2], "removed":[tri]};
}

TextureViewBlend.triangleWithSameTwoVertexes = function(tris,A,B){
	var points = [A,B];
	for(var i=0; i<tris.length; ++i){
		var tri = tris[i];
		var vertexes = tri.vertexes();
		var count = 0;
		for(var j=0; j<vertexes.length; ++j){
			var vertex = vertexes[j];
			for(var k=0; k<points.length; ++k){
				var point = points[k];
				if(point==vertex){
					++count;
				}
			}
		}
		if(count==2){
			return tri;
		}
	}
	return null;
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
TextureViewBlend.Tri3D = function(a,b,c, parent){
	parent = parent!==undefined ? parent : null;
	this._id = TextureViewBlend.Tri3D._count++;
	this._removed = false;
	var pA = a.point();
	var pB = b.point();
	var pC = c.point();
	this._vertexA = a;
	this._vertexB = b;
	this._vertexC = c;
	this._vertexD = new TextureViewBlend.Vertex3D(Code.average([pA,pB,pC]));
	this._parent = parent;
	this._textureA = null;
	this._textureB = null;
	this._textureC = null;
	this._textureD = null; // projected center => used to create homography
	this._maxResolutionScale = null;
	this._textureRect = null;
	this._requiredViews = null;
	TextureViewBlend.Tri3D._.constructor.call(this,pA,pB,pC);
}
Code.inheritClass(TextureViewBlend.Tri3D, Tri3D);
TextureViewBlend.Tri3D._count = 0;
TextureViewBlend.Tri3D.prototype.id = function(){
	return this._id;
}
TextureViewBlend.Tri3D.prototype.removed = function(r){
	if(r!==undefined){
		this._removed = r;
	}
	return this._removed;
}
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
TextureViewBlend.Tri3D.prototype.vertexD = function(){
	return this._vertexD;
}
TextureViewBlend.Tri3D.prototype.vertexes = function(v){
	return [this._vertexA,this._vertexB,this._vertexC];
}
TextureViewBlend.Tri3D.prototype.oppositeVertex = function(vA,vB){
	if(this._vertexA==vA){
		if(this._vertexB==vB){
			return this._vertexC;
		}else if(this._vertexC==vB){
			return this._vertexB;
		}
	}else if(this._vertexB==vA){
		if(this._vertexA==vB){
			return this._vertexC;
		}else if(this._vertexC==vB){
			return this._vertexA;
		}
	}else if(this._vertexC==vA){
		if(this._vertexA==vB){
			return this._vertexB;
		}else if(this._vertexB==vB){
			return this._vertexA;
		}
	}
	return null;
}
TextureViewBlend.Tri3D.prototype.requiredViews = function(){
	return this._requiredViews
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
TextureViewBlend.Tri3D.prototype.sameOrder = function(vA,vB,vC){
	if(this._vertexA==vA && this._vertexB==vB && this._vertexC==vC){
		return true;
	}else if(this._vertexB==vA && this._vertexC==vB && this._vertexA==vC){
		return true;
	}else if(this._vertexC==vA && this._vertexA==vB && this._vertexB==vC){
		return true;
	}
	return false;
}
TextureViewBlend.Tri3D.prototype.maxProjectedScale = function(scale){
	if(scale!==undefined){
		this._maxResolutionScale = scale;
	}
	return this._maxResolutionScale;
}
TextureViewBlend.Tri3D.prototype.calculateNecessaryViews = function(){
	var required = {};
	var viewA = this._vertexA.targetView();
	var viewB = this._vertexB.targetView();
	var viewC = this._vertexC.targetView();
	if(viewA){
		required[viewA.id()+""] = viewA.id();
	}
	if(viewB){
		required[viewB.id()+""] = viewB.id();
	}
	if(viewC){
		required[viewC.id()+""] = viewC.id();
	}
	// var count = Code.keys(required).length;
	var requiredIDs = Code.objectToArray(required);
	var count = requiredIDs;
	this._requiredViews = requiredIDs;
	// want up to 3
	var equalFxn = function(a,b){
		return a.id()==b.id();
	}
	var combineFxn = function(a,b){
		return new TextureViewBlend.VertexViewMap(a.id(), b.cost()*a.cost(), null);
	}
	var minimumCount = 3;
	var viewsA = this._vertexA.targetViews();
	var viewsB = this._vertexB.targetViews();
	var viewsC = this._vertexC.targetViews();
	var arr = Code.arrayIntersect(viewsA,viewsB, equalFxn, combineFxn);
		arr = Code.arrayIntersect(arr,viewsC, equalFxn, combineFxn);
	arr.sort(function(a,b){
		return a.cost()<b.cost() ? a : b;
	});
	var len = Math.min(minimumCount-count,arr.length);
	for(var i=0; i<len; ++i){
		var value = arr[i];
		var viewID = value.id();
		required[viewID+""] = viewID;
	}
	// convert to values & send to vertexes
	required = Code.objectToArray(required);
	var vertexes = this.vertexes();
		vertexes.push(this._vertexD);
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		for(var j=0; j<required.length; ++j){
			var viewID = required[j];
			vertex.addRequiredView(viewID);
		}
	}
	// NEED TO STORE THIS SOMEWHERE?
}
TextureViewBlend.Tri3D.prototype.texturePoint2D = function(vertex,point2D){
	if(vertex==this._vertexA){
		this._textureA = point2D;
	}else if(vertex==this._vertexB){
		this._textureB = point2D;
	}else if(vertex==this._vertexC){
		this._textureC = point2D;
	}
}
TextureViewBlend.Tri3D.prototype.textureIndex = function(i){
	if(i!==undefined){
		this._textureIndex = i;
	}
	return this._textureIndex;
}
TextureViewBlend.Tri3D.prototype.textureRect = function(r){
	if(r!==undefined){
		this._textureRect = r;
	}
	return this._textureRect;
}
TextureViewBlend.Tri3D.prototype.textureA = function(){
	return this._textureA;
}
TextureViewBlend.Tri3D.prototype.textureB = function(){
	return this._textureB;
}
TextureViewBlend.Tri3D.prototype.textureC = function(){
	return this._textureC;
}
TextureViewBlend.Tri3D.prototype.textureD = function(){
	return this._textureD;
}
TextureViewBlend.Tri3D.prototype.adjacentTriangles = function(){ // all neighbors
	// all neighbors
}

TextureViewBlend.Tri3D.prototype.neighborTriangles = function(){ // up to 3
	var found = {};
	var vertexes = this.vertexes();
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertex[i];
		var tris = vertex.triangles();
		for(var j=0; j<tris.length; ++j){
			var tri = tris[j];
			if(tri!=this){
				if(TextureViewBlend.Tri3D.shareTwoVertexes(this,tri)){
					found[tri.id()] = tri;
				}
			}
		}
	}
	var list = Code.objectToArray(found);
	return list;
}
TextureViewBlend.Tri3D.shareTwoVertexes = function(triA,triB){
	var vertexesA = triA.vertexes();
	var vertexesB = triB.vertexes();
	var count = 0;
	for(var i=0; i<vertexesA.length; ++i){
		var vA = vertexesA[i];
		for(var j=0; j<vertexesB.length; ++j){
			var vB = vertexesB[j];
			if(vA==vB){
				++count;
			}
		}
	}
	return count==2;
}

// --------------------------------------------------------------------------------------------------------------------
TextureViewBlend.Vertex3D = function(point){
	this._id = TextureViewBlend.Vertex3D._count++;
	this._triangleList = null;
	this._normal = null;
	this._viewList = [];
	this._targetView = null;
	this._flips = [];
	this._point3D = null;
	this._texturePoint = null; // final
	this._required = null;
	this.point(point);
}
TextureViewBlend.Vertex3D._count = 0;
TextureViewBlend.Vertex3D.prototype.id = function(){
	return this._id;
}
TextureViewBlend.Vertex3D.prototype.resetRequiredViews = function(){
	this._required = {};
}
TextureViewBlend.Vertex3D.prototype.addRequiredView = function(viewID){
	this._required[viewID+""] = viewID;
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
TextureViewBlend.Vertex3D.prototype.triangles = function(){
	return this._triangleList;
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
		this._targetView = this._viewList[0]; // already sorted on cost
		return true;
	}
	return false;
}
TextureViewBlend.Vertex3D.prototype.targetViewWithID = function(viewID){
	var views = this._viewList[i];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		if(view.id()==viewID){
			return view;
		}
	}
	return null;
}
TextureViewBlend.Vertex3D.prototype.targetView = function(){
	return this._targetView;
}
// TextureViewBlend.Vertex3D.prototype.setTarget = function(){
// 	return this._targetView;
// }
// TextureViewBlend.Vertex3D.prototype.targetCost = function(){
// 	return this._targetCost;
// }

TextureViewBlend.Vertex3D.prototype.dropUnnecessaryViews = function(){
	var required = Code.objectToArray(this._required);
	var views = this._viewList[i];
	// remove unused views
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view.id();
		var found = false;
		for(var j=0; j<required.length; ++j){
			var req = required[j];
			if(req==viewID){
				found = true;
			}
		}
		if(!found){
			Code.removeElementAt(views,i);
			--i;
		}
	}
	// add missing views:
	for(var j=0; j<required.length; ++j){
		var req = required[j];
		var found = false;
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var viewID = view.id();
			if(req==viewID){
				found = true;
			}
		}
		if(!found){
			this.addView(req, 0, null);
		}
	}
}
TextureViewBlend.Vertex3D.prototype.targetViews = function(){ // list of only top target views of vertices
	return this._viewList;

}
TextureViewBlend.Vertex3D.prototype.viewFromID = function(id){
	var views = this._targetViews;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		if(view.id()==i){
			return view;
		}
	}
	return null;
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
		var tvC = vC.targetView();
		var idC = tvC.id();
		var targetCost = tvC.cost();
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var viewID = view.id();
			var viewCost = view.cost();
			var flipCount = 0;
			if(viewID!=idC){ // can flip too
				// find the number of switches
				for(var i=0; i<triangles.length; ++i){
					var tri = triangles[i];
					var opposites = tri.oppositeVertexes(vC);
					var vA = opposites[0];
					var vB = opposites[1];
					var tvA = vA.targetView();
					var tvB = vB.targetView();
					var idA = tvA.id();
					var idB = tvB.id();
					if(idA==idC && idB==idC){
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








