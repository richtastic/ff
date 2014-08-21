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
	var planeWidth = 600;
	var planeHeight = 150;
	var points = [new V2D(159,397), new V2D(544,381), new V2D(601,430.5), new V2D(163,456)];
	var planePoints = [new V2D(0,0), new V2D(planeWidth-1,0), new V2D(planeWidth-1,planeHeight-1,1), new V2D(0,planeHeight-1,1)];

	var lineA = Code.lineEquationFromPoints2D(points[0],points[3]);
	var lineB = Code.lineEquationFromPoints2D(points[1],points[2]);
	// console.log(lineA);
	// console.log(lineB);
	var intersectionAB = Code.homoIntersectionFromLines2D(lineA.a,lineA.b,lineA.c, lineB.a,lineB.b,lineB.c);
	//var intersectionAB = Code.homoIntersectionFromLines2D(lineB.a,lineB.b,lineB.c, lineA.a,lineA.b,lineA.c);
	// console.log(intersectionAB.toString());
	intersectionAB.homo();
	// console.log(intersectionAB.toString());

	var lineC = Code.lineEquationFromPoints2D(points[0],points[1]);
	var lineD = Code.lineEquationFromPoints2D(points[2],points[3]);
	// console.log(lineC);
	// console.log(lineD);
	var intersectionCD = Code.homoIntersectionFromLines2D(lineC.a,lineC.b,lineC.c, lineD.a,lineD.b,lineD.c);
	//var intersectionCD = Code.homoIntersectionFromLines2D(lineD.a,lineD.b,lineD.c, lineC.a,lineC.b,lineC.c);
	// console.log(intersectionCD.toString());
	intersectionCD.homo();
	// console.log(intersectionCD.toString());

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
	// create homography 
	var homography = Matrix.get2DProjectiveMatrix(planePoints,points);

	// unknown homography
	//var homography = new Matrix(3,3).identity(); // current image
	
	console.log(homography.toString());
	// find Ha
	var lInf = new V3D(lineInf.a,lineInf.b,lineInf.c);
	var lineMatrix = (new Matrix(3,3)).setFromArray([1,0,0, 0,1,0, lInf.x,lInf.y,lInf.z]);
	console.log(lineMatrix.toString())
	var lmInv = Matrix.inverse(lineMatrix);
	console.log(lmInv.toString());
	Ha = Matrix.mult(homography,lmInv);
	//Ha = Matrix.mult(lmInv,homography);
	console.log(Ha.toString());

	// 
	homography = Ha
	//homography = lineMatrix
	//homography = lmInv;

	var pt = new V3D(0,0,1);
	pt = new V3D(159,397);
	homography.multV2DtoV3D(pt,pt)
	console.log( ".........." )
	console.log( pt.toString() )
	pt.homo()
	console.log( pt.toString() )
	console.log( ".........." )

//homography = Matrix.inverse(homography);

	//homography = Matrix.transform2DScale(homography,2);
	//homography = Matrix.transform2DTranslate(homography,-200,-75);
	//homography = Matrix.transform2DTranslate(homography,-pt.x,-pt.y);
	//homography = Matrix.transform2DTranslate(homography,-30,50);
	//var tX = 0, tY = 0;
	// var tX = -200, tY = -50;
	// //var tX = pt.x, tY = pt.y;
	// var b;
	// b = Matrix._transformTemp.setFromArray([1.0,0.0,tX, 0.0,1.0,tY, 0.0,0.0,1.0]);
	// //homography = Matrix.mult(b,homography);
	// homography = Matrix.mult(homography,b);

	// show transformed block
	var imagePlaneMat = ImageMat.extractRectWithProjection(imageMat,imageWidth,imageHeight, planeWidth,planeHeight, homography);
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


