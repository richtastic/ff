// Texturing.js

function Texturing(){
	console.log("Texturing");
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._stage.root().matrix().scale(2.0);
	// resources
	this._resource = {};

	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);



	/*
	// 3D stage
	this._canvas3D = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,true);
	this._stage3D = new StageGL(this._canvas3D, 1000.0/20.0, this.getVertexShaders1(), this.getFragmentShaders1());
  	this._stage3D.setBackgroundColor(0x00000000);
	this._stage3D.frustrumAngle(60);
	this._stage3D.enableDepthTest();
this._stage3D.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this.onEnterFrameFxn3D, this);
	// this._stage3D.start();
	this._spherePointBegin = null;
	this._spherePointEnd = null;
	this._sphereMatrix = new Matrix3D();
	this._sphereMatrix.identity();
	this._userInteractionMatrix = new Matrix3D();
	this._userInteractionMatrix.identity();
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_DOWN, this.onMouseDownFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_UP, this.onMouseUpFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_MOVE, this.onMouseMoveFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_WHEEL, this.onMouseWheelFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_CLICK, this.onMouseClickFxn3D, this);
	*/
	//
GLOBALSTAGE = this._stage;
// GLOBALSTAGE.root().matrix().scale(1.0,-1.0);
// GLOBALSTAGE.root().matrix().translate(300.0,300.0);
/*
	this.triangulate();
	return;
*/
	var imageList, imageLoader;
	// import image to work with
	imageList = ["caseStudy1-0.jpg","caseStudy1-26.jpg"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleSceneImagesLoaded,null);
	imageLoader.load();
}

Texturing.prototype.triangulate = function(){
	console.log("triangulate");

// lookup table for data from point
/*

point - 2d coord + data object
tri - 
*/



	var i, j, k;
	var points = [
		new V2D(1,0),
		//new V2D(0,1),
		new V2D(2,1),
new V2D(0.8,0.8),
		new V2D(1,1),
new V2D(1,-1),
		new V2D(2,-1),
		//new V2D(0.8,0.8),
		new V2D(2,2),
	];
	/*
// random tests
points = [];
var minX = -2;
var maxX = 2;
var minY = -2;
var maxY = 2;
for(i=0; i<15; ++i){
	points[i] = new V2D(Code.randomFloat(minX,maxX),Code.randomFloat(minY,maxY));
}
Triangulator.removeDuplicates(points);
*/


	var matrix = new Matrix2D();
	matrix.identity();
	matrix.scale(1.0);
	for(i=0; i<points.length; ++i){
		points[i] = matrix.multV2D(new V2D(), points[i]);
	}
var matrix = new Matrix2D();
matrix.identity();
// matrix.scale(1.0,-1.0);
// matrix.scale(40.0);
// matrix.translate(140.0,180.0);
matrix.scale(1.0,-1.0);
matrix.scale(3.0);
matrix.translate(100.0,1000.0);
	// show points:
	for(i=0; i<points.length; ++i){
		var point = points[i];
		var color = 0xFFFF0000;
		var rad = 3.0;
		var c = new DO();
		point = matrix.multV2D(new V2D(), point);
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(point.x, point.y, rad);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix();
		GLOBALSTAGE.addChild(c);
	}

		point = matrix.multV2D(new V2D(), new V2D(185,215));
		c.graphics().setLine(1.0, 0xFF000000);
		c.graphics().beginPath();
		c.graphics().drawCircle(point.x, point.y, 4.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix();
		GLOBALSTAGE.addChild(c);


	// ... do triangulation
	var triangulator = new Triangulator();
	var min = new V2D(minX,minY);
	var max = new V2D(maxX,maxY);
	triangulator.setLimits(min,max);
	triangulator.addPoints(points, points);
	var tri = triangulator.triangle( new V2D(0.5,0.25) );
	// console.log(tri);
	// if(tri){
	// 	var ps = tri.points();
	// 	console.log(ps);
	// }
console.log("DONE ..............................");


	var points = triangulator.points();//this._points;
	var datas = triangulator.datas();//this._cells;
	var tris = triangulator.triangles();//this._triangles;
	var perimeter = triangulator.perimeter();//this._datas;
	//var rays = triangulator.rays();
	var rays = Code.rayFromPointPerimeter(points,perimeter);
	console.log("DATA ..............................");
	// console.log(points);
	// console.log(datas);
	// console.log(tris);
	// console.log(perimeter);
	// console.log(rays);

	// console.log(perimeter.length);
	// console.log(rays.length);


	var triangles = triangulator._mesh._tris;//.trianglesAsIs();
	for(i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var pts = tri.points();
		var pointA = pts[0].point();
		var pointB = pts[1].point();
		var pointC = pts[2].point();
		pointA = matrix.multV2D(new V2D(), pointA);
		pointB = matrix.multV2D(new V2D(), pointB);
		pointC = matrix.multV2D(new V2D(), pointC);
		var color = 0xFF00FF00;
		//var color = Code.getColARGBFromFloat(1.0,Math.random(),Math.random(),Math.random());
		var c = new DO();
		console.log()
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		var sc = 0.0;
		var ss = 0.0;
		var offX = (Math.random()-0.5)*ss;
		var offY = (Math.random()-0.5)*ss;
		pointA.x += (Math.random()-0.5)*sc + offX;
		pointA.y += (Math.random()-0.5)*sc + offY;
		pointB.x += (Math.random()-0.5)*sc + offX;
		pointB.y += (Math.random()-0.5)*sc + offY;
		pointC.x += (Math.random()-0.5)*sc + offX;
		pointC.y += (Math.random()-0.5)*sc + offY;

		c.graphics().drawPolygon([pointA,pointB,pointC], true);
		c.graphics().strokeLine();
		c.graphics().endPath();
		GLOBALSTAGE.addChild(c);
	}

	//var points = triangulator.points();
	//var perimeter = triangulator.perimeter();
	for(i=0; i<perimeter.length; ++i){
		var pointA = points[ perimeter[i] ];
		var pointB = points[ perimeter[(i+1)%perimeter.length] ];
		var ray = rays[i];//points[rays[i]];
		ray.scale(10.0);
		console.log(ray);
		var pointC = V2D.add(pointA,ray);
		//ray = matrix.multV2D(new V2D(), ray);
		pointA = matrix.multV2D(new V2D(), pointA);
		pointB = matrix.multV2D(new V2D(), pointB);
		pointC = matrix.multV2D(new V2D(), pointC);
		var wig = 5;
		pointA.wiggle(wig);
		pointB.wiggle(wig);
		// console.log(point); 
		var color = 0xFF0000FF;
		var c = new DO();
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawPolygon([pointA,pointB], true);
		c.graphics().strokeLine();
		c.graphics().endPath();
		GLOBALSTAGE.addChild(c);
		//

		var c = new DO();
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawPolygon([pointA,pointC], true);
		c.graphics().strokeLine();
		c.graphics().endPath();
		GLOBALSTAGE.addChild(c);
	}
}


Texturing.prototype.handleSceneImagesLoaded = function(imageInfo){
	var pointsA = [];
	var pointsB = [];
	var points = [pointsA,pointsB];
	var tris = [];
	var tri;

	// real
	pntO = new V3D(0,0,0);
	pntX = new V3D(1,0,0);
	pntY = new V3D(0,1,0);
	pntZ = new V3D(0,0,1);
	pntXY = new V3D(1,1,0);
	pntXZ = new V3D(1,0,1);
	pntYZ = new V3D(0,1,1);
	// A
	var pntAO = new V2D(172.5,107);
	var pntAX = new V2D(202.5,116);
	var pntAY = new V2D(172,67.5);
	var pntAXY = new V2D(204,76);
	// 1
	tri = new Tri2D( pntAY, pntAO, pntAX );
	tris.push([tri]);
	pointsA.push(tri.A(),tri.B(),tri.C());
	// 2
	tri = new Tri2D( pntAX, pntAXY, pntAY );
	tris.push([tri]);
	pointsA.push(tri.A(),tri.B(),tri.C());
	// B
	var oFF = new V2D(0,0);
	var pntBO = new V2D(191.5,146);
	var pntBX = new V2D(230,151.5);
	var pntBY = new V2D(193,100);
	var pntBXY = new V2D(233,102);


	pntBO.add(oFF);
	pntBX.add(oFF);
	pntBY.add(oFF);
	pntBXY.add(oFF);


	// 1
	tri = new Tri2D( pntBY, pntBO, pntBX );
	tris.push([tri]);
	pointsB.push(tri.A(),tri.B(),tri.C());
	// 2
	tri = new Tri2D( pntBX, pntBXY, pntBY );
	tris.push([tri]);
	pointsB.push(tri.A(),tri.B(),tri.C());
	// 
	var imageList = imageInfo.images;

	var imageSourceA = imageList[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = imageList[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);
// this.imageA = new ImageMatrix(imageList[0];
// this.imageB = imageList[1];
	var i, j, list = [], d, img, x=0, y=0;
	for(i=0;i<imageList.length;++i){
		img = imageList[i];
		//console.log(img)
		list[i] = img;
		d = new DOImage(img);
		d.enableDragging();
		this._root.addChild(d);
		d.matrix().identity();
		d.matrix().translate(x,y);
		//
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawPolygon(points[i]);
		// for(j=0;j<=points[i].length;++j){
		// 	v = points[i][j % points[i].length];
		// 	if(j==0){
		// 		d.graphics().moveTo(v.x,v.y);
		// 	}else{
		// 		d.graphics().lineTo(v.x,v.y);
		// 	}
		// }
		d.graphics().endPath();
		d.graphics().strokeLine();
		//
		x += img.width;
		y += 0;
	}
	/*
this._resource.testImage0 = list[0];
this._resource.testImage1 = list[1];
	this._imageSources = list;
this.calibrateCameraMatrix();
	this.handleLoaded();
	this._stage3D.start();
	*/
	this._tris = tris;
	this._imgs = list;
	this.combineTriangles();



	// if triangle relative sizes are over some ratio (eg 2) then don't consider the smaller one at all
	var maxAreaDifference = 2.0;

	var imageA = this.imageA;
	var imageB = this.imageB;
	// 
	var triSource = new Tri3D(pntO,pntX,pntY);
	var triA = new Tri2D(pntAO, pntAX, pntAY);
	var triB = new Tri2D(pntBO, pntBX, pntBY);
	var sameTriList = [triA,triB];
	var sameImageList = [imageMatrixA,imageMatrixB];
	var mapping = R3D.textureFromTriangles(triSource, sameTriList, sameImageList);
	var textureMatrix = mapping["image"];
	var triOrigin = mapping["tri"];

	console.log(textureMatrix);
	console.log(triOrigin);

	// display texture:
	var img = GLOBALSTAGE.getFloatRGBAsImage(textureMatrix.red(),textureMatrix.grn(),textureMatrix.blu(), textureMatrix.width(),textureMatrix.height());
	var d = new DOImage(img);
	d.matrix().translate(810, 10);
	GLOBALSTAGE.addChild(d);

	//var renderTri = new Tri2D( new V2D(100,100), new V2D(150,100), new V2D(100,150) ); // numerical stability
	//var renderTri = new Tri2D( new V2D(100,100), new V2D(150,100), new V2D(100,50) );
	var renderTri = new Tri2D( new V2D(100,100), new V2D(150,120), new V2D(100,60) );
	//var renderTri = new Tri2D( new V2D(100,100), new V2D(150,100), new V2D(100,150.00001) );

	var d = new DOTri(img, renderTri, triOrigin);
	GLOBALSTAGE.addChild(d);

	//this.graphicsIllustration().drawImage(this._image,this._imageX,this._imageY,this._imageWidth,this._imageHeight);




	// render texture to screen in context
/*

x = [3, 4]; % measurement
w = [2, 1]; % window
N = size(x,2); % sample size
pTot = sum(w); % total window
p = 1 - (w / pTot); % probabilities of x -- smaller window is 'more likely' ?
u = (1/N) * sum( x );
s = (sum( (p.*x).^2 ))^0.5;
N
u
s
*/

	
// minimumRect
/*
			var areaA = V2D.areaTri(texturePoint,triOrigin.B(),triOrigin.C());
			var areaB = V2D.areaTri(texturePoint,triOrigin.A(),triOrigin.C());
			var areaC = V2D.areaTri(texturePoint,triOrigin.A(),triOrigin.B());
			var areaT = V2D.areaTri(triOrigin.A(),triOrigin.B(),triOrigin.C());
				// areaA = Math.max(0,areaA);
				// areaB = Math.max(0,areaB);
				// areaC = Math.max(0,areaC);
				// areaT = areaA + areaB + areaC;
			var pA = areaA/areaT;
			var pB = areaB/areaT;
			var pC = areaC/areaT;
			
			trianglePoint.set(pA*triA.A().x + pB*triA.B().x + pC*triA.C().x, pA*triA.A().y + pB*triA.B().y + pC*triA.C().y);
			*/


}
Texturing.prototype.combineTriangles = function(){
	var triList = this._tris;
	var imgList = this._imgs;
	console.log(triList);
	console.log(imgList);
/*
STEPS:
	MAPPING:
	find where wach triangle is on 
		- discard edge tris
		- discard small surface-area covered tris
		- discard occluded (& near occluded) triangles
	STITCHING:
	find best-set of triangle patch groups	: w = (area of projected triangle onto camera plane) / (area of true triangle)
		- where tri normal dot camera normal is as close to -1 as possible
		- where surface area coverage is large (higher res is better)
	patches with 2+ cameras can be blended together via averaging / median
	border patches need gradient transitioning (where only 2 cameras/patches are conserned)
	ATLAS-PACKING:
	texture-triangles should be mapped as proportionately as possible to a texture atlas
*/
	/*
	var inImgA = [0..1];
	var inTriA = new Tri();
	inputImages = []; // 
	*/
//	R3D.triangulateTexture(inputImages, inputTriangles, outputImage, outputTriangle);
}
Texturing.prototype.cameraResultsFromSet = function(fr,to, wid,hei,sca, params){
	// 
}


Texturing.prototype.textureBase2FromImage = function(texture){
	// var obj = new DOImage(texture);
	// this._root.addChild(obj);
	// var wid = texture.width;
	// var hei = texture.height;
	// var origWid = wid;
	// var origHei = hei;
	// wid = Math.pow(2.0, Math.ceil(Math.log(wid)/Math.log(2.0)) );
	// hei = Math.pow(2.0, Math.ceil(Math.log(hei)/Math.log(2.0)) );
	// wid = Math.max(wid,hei);
	// hei = wid;
	// var origWid = origWid/wid;
	// var origHei = origHei/hei;
	// texture = this._stage.renderImage(wid,hei,obj, null);
	// obj.removeParent();
	// var vert = 1-origHei;
	// var horz = origWid;
	// return {"texture":texture,"width":horz,"height":vert};
}
Texturing.prototype.handleEnterFrame = function(e){ // 2D canvas
	//console.log(e);
}
Texturing.prototype.handleMouseClickFxn = function(e){
	var loc = e["location"];
	console.log(loc.x%400,loc.y)
}



TextureMesh = function(){
	this._triangles = [];
	this._textures = [];
}
TextureMesh.prototype.kill = function(){
	if(this._triangles){
		Code.emptyArray(this._triangles);
	}
	this._triangles = null;
}
TextureMesh.Triangle = function(t,u,m){
	this._tri = new V3D();
	this._uv = new V2D();
	this._mesh = null;
}

TextureMesh.Texture = function(t,u){
	this._url = null;
	this._isLoading = false;
	this._isLoaded = false;
	this._data = null;
}
TextureMesh.Texture.prototype.load = function(){
	// load from file
}
TextureMesh.Texture.prototype.unload = function(){
	// release stucc
}







