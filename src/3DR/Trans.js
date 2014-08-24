// Trans.js

function Trans(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// import image to work with
	var imageLoader = new ImageLoader("./images/",["desktop1.png"], this,this.handleImageLoaded,null);
	imageLoader.load();
}
Trans.prototype.handleImageLoaded = function(e){
	var i, d, p, rad;
	image = e.images[0];
	var imageWidth = image.width;
	var imageHeight = image.height;
	// display image
	d = new DOImage(image);
	this._root.addChild(d);
	// convert to data array for calculations
	var imageARGB = this._stage.getDOAsARGB(d, imageWidth,imageHeight);
	var imageMat = new ImageMat(imageWidth,imageHeight);
	imageMat.setFromArrayARGB(imageARGB);
	// 4 points to make a homography
	var planeWidth = 800;
	var planeHeight = 400;
	var points = [new V2D(159,397), new V2D(544,381), new V2D(601,430.5), new V2D(163,456)];
	var planePoints = [new V2D(0,0), new V2D(planeWidth-1,0), new V2D(planeWidth-1,planeHeight-1,1), new V2D(0,planeHeight-1,1)];

	var lineA = Code.lineEquationFromPoints2D(points[0],points[3]);
	var lineB = Code.lineEquationFromPoints2D(points[1],points[2]);

var pA = new V3D(points[0].x,points[0].y,1.0);
var pB = new V3D(points[3].x,points[3].y,1.0);
var lA = V3D.cross(pA,pB);
console.log(lineA)
console.log(lineA.a/lineA.c,lineA.b/lineA.c,lineA.c/lineA.c)
console.log(lA)
lA.homo();
console.log(lA)
lineA.a = lA.x;
lineA.b = lA.y;
lineA.c = lA.z;

var pC = new V3D(points[1].x,points[1].y,1.0);
var pD = new V3D(points[2].x,points[2].y,1.0);
var lB = V3D.cross(pC,pD);
console.log(lineB)
console.log(lB)
lB.homo();
console.log(lB)
lineB.a = lB.x;
lineB.b = lB.y;
lineB.c = lB.z;

	var intersectionAB = Code.homoIntersectionFromLines2D(lineA.a,lineA.b,lineA.c, lineB.a,lineB.b,lineB.c);
	intersectionAB.homo();

	var lineC = Code.lineEquationFromPoints2D(points[0],points[1]);
	var lineD = Code.lineEquationFromPoints2D(points[2],points[3]);

var lC = V3D.cross(pA,pC);
lC.homo();
lineC.a = lC.x;
lineC.b = lC.y;
lineC.c = lC.z;

var lD = V3D.cross(pD,pB);
lD.homo();
lineD.a = lD.x;
lineD.b = lD.y;
lineD.c = lD.z;

	var intersectionCD = Code.homoIntersectionFromLines2D(lineC.a,lineC.b,lineC.c, lineD.a,lineD.b,lineD.c);
	intersectionCD.homo();

		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0,0xFF00FF00);
		d.graphics().beginPath();
		// AB
		d.graphics().moveTo(points[2].x,points[2].y);
		d.graphics().lineTo(intersectionAB.x,intersectionAB.y);
		d.graphics().moveTo(points[3].x,points[3].y);
		d.graphics().lineTo(intersectionAB.x,intersectionAB.y);
		// CD
		d.graphics().moveTo(points[0].x,points[0].y);
		d.graphics().lineTo(intersectionCD.x,intersectionCD.y);
		d.graphics().moveTo(points[3].x,points[3].y);
		d.graphics().lineTo(intersectionCD.x,intersectionCD.y);

		// AB-CD
		//d.graphics().setLine(1.0,0xFF0000FF);
		d.graphics().moveTo(intersectionAB.x,intersectionAB.y);
		d.graphics().lineTo(intersectionCD.x,intersectionCD.y);

		d.graphics().endPath();
		d.graphics().strokeLine();
		this._root.addChild(d);

	var lineInf = Code.lineEquationFromPoints2D(intersectionAB,intersectionCD);
	console.log("INFINIT LINE: ")
	console.log(lineInf);

	//var lineInf2 = Code.homoLineFromPoints2D (intersectionAB,intersectionCD);
	var lineInf2 = Code.homoLineFromPoints2D (intersectionAB.x,intersectionAB.y,intersectionAB.z, intersectionCD.x,intersectionCD.y,intersectionCD.z);
	console.log("INFINIT LINE:  ... 2:")
	console.log(lineInf2);

lineInf.a = lineInf2.x;
lineInf.b = lineInf2.y;
lineInf.c = lineInf2.z;

	// show points on screen
	rad = 3.0;
	for(i=0;i<points.length;++i){
//console.log(points[i].toString()+"  =>  "+planePoints[i].toString())
		p = points[i];
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().setFill(0x00FF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(p.x,p.y, rad);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
		this._root.addChild(d);
	}
	// create homography (this is the solution looking for) H = Hp * Ha * Hm
	//var homography = Matrix.get2DProjectiveMatrix(planePoints,points);

	// unknown homography
	var homography = new Matrix(3,3).identity(); // current image
	Ha = new Matrix(3,3).identity();
	
	//console.log(homography.toString());
	var lInf = new V3D(lineInf.a,lineInf.b,lineInf.c);
lInf.homo();
// lInf.x = -lInf.x;
// lInf.y = -lInf.y;
	var lineMatrix = (new Matrix(3,3)).setFromArray([1,0,0, 0,1,0, lInf.x,lInf.y,lInf.z]);
	console.log("lineMatrix")
	console.log(lineMatrix.toString())
//	var lmInv = Matrix.inverse(lineMatrix);
//	console.log(lmInv.toString());
//	Ha = Matrix.mult(homography,lmInv);
//	Ha = Matrix.mult(lmInv,homography);
//	console.log(Ha.toString());

	homography = Matrix.mult(Ha,lineMatrix);
	console.log(homography.toString())
/*
// C&#42;' = H&middot;C&#42;&middot;H<sup>T</sup>
var conic = new Matrix();
var dualC = new Matrix();

var affineA = [];


*/

	// 
	//homography = Ha
	//homography = lineMatrix
	//homography = lmInv;
	//homography = Matrix.transpose(lmInv);
	//homography = Matrix.transpose(lineMatrix);

	var pt = new V3D(0,0,1);
	pt = new V3D(159,397);
	homography.multV2DtoV3D(pt,pt)
	console.log( ".........." )
	console.log( pt.toString() )
	pt.homo()
	console.log( pt.toString() )
	console.log( ".........." )




// USE TRANSFORMED CORNERS TO SCALE IT TO FIT IN WINDOW

// this sadly qualifies as affine
//homography = new Matrix(3,3).identity();
//homography = Matrix.inverse(homography);
//homography = Matrix.transpose(homography);
console.log(homography.toString())
//homography = Matrix.transform2DRotate(homography,Math.PI/10.0);
/*
homography = Matrix.transform2DScale(homography,0.05,0.007);
homography = Matrix.transform2DTranslate(homography,100,2200);
*/
//homography = Matrix.transform2DScale(homography,10,0.5);
//homography = Matrix.transform2DScale(homography,0.5);
// homography = Matrix.transform2DTranslate(homography,5000,10);

//homography = Matrix.inverse(homography);
	//homography = Matrix.transform2DTranslate(homography,-pt.x,-pt.y);
	//homography = Matrix.transform2DScale(homography,2);
	//homography = Matrix.transform2DTranslate(homography,-200,-75);
	//homography = Matrix.transform2DTranslate(homography,-30,50);
	//var tX = 0, tY = 0;
	// var tX = -200, tY = -50;
	// //var tX = pt.x, tY = pt.y;
	// var b;
	// b = Matrix._transformTemp.setFromArray([1.0,0.0,tX, 0.0,1.0,tY, 0.0,0.0,1.0]);
	// //homography = Matrix.mult(b,homography);
	// homography = Matrix.mult(homography,b);

	// show transformed block
	//var imagePlaneMat = ImageMat.extractRectWithProjection(imageMat,imageWidth,imageHeight, planeWidth,planeHeight, homography);
	var imagePlaneMat = ImageMat.extractRectWithProjection(imageMat,imageWidth,imageHeight, planeWidth,planeHeight, homography);
	//var imagePlaneMat = ImageMat.applyProjection(imageMat,imageWidth,imageHeight, planeWidth,planeHeight, homography);
	var imagePlaneARGB = ImageMat.ARGBFromFloats(imagePlaneMat.red(),imagePlaneMat.grn(),imagePlaneMat.blu());
	var imagePlane = this._stage.getARGBAsImage(imagePlaneARGB, planeWidth,planeHeight);
	d = new DOImage(imagePlane);
	d.matrix().identity();
	d.matrix().translate(imageWidth,0);
	this._root.addChild(d);
	console.log(",,,");
	/*
	

find line@inf
get affine from projective
	*/
}
Trans.prototype.handleEnterFrame = function(e){
	console.log(e);
}
Trans.prototype.a = function(){
	//
}


