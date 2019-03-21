// DLT2D.js

function DLT2D(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// import image to work with
	var imageLoader = new ImageLoader("../matching/images/medium/",["BL.png","BLB.png"], this,this.handleImageLoaded,null);
//	var imageLoader = new ImageLoader("./images/",["screen.png"], this,this.handleImageLoaded,null);
	imageLoader.load();
	//this.handleLoaded();
}
DLT2D.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}
DLT2D.prototype.handleImageLoaded = function(e){
	console.log("dlt: "+e.images.length);
	var i, j, a, b, c, d, p, q, x, y, H, img, arr;
	var widths = [];
	var heights = [];
	var images = [];
	// display images
	x = 0;
console.log(e.images.length)
	for(i=0;i<e.images.length;++i){
		img = e.images[i];
		d = new DOImage(img);
		d.matrix().identity();
		d.matrix().translate(x,0);
		this._root.addChild(d);
		images.push(d);
		x += img.width;
		widths.push(img.width);
		heights.push(img.height);
	}
	//
	var points = [];
	points.push([new V2D(234,9), new V2D(199,293)]);
	points.push([new V2D(342,42), new V2D(82,249)]);
	points.push([new V2D(321,285), new V2D(42,17)]);
	points.push([new V2D(208,296), new V2D(181,35)]);
	points.push([new V2D(249,65), new V2D(175,249)]);
	points.push([new V2D(307,202), new V2D(83,115)]);
// var wid = 2100;
// var hei = 700;
// points.push([new V2D(33,61), new V2D(0,0)]);
// points.push([new V2D(958,314), new V2D(wid,0)]);
// points.push([new V2D(966,682), new V2D(wid,hei)]);
// points.push([new V2D(20,962), new V2D(0,hei)]);
	//points.push([new V2D(,), new V2D(,)]);
		// ...
	// show points on screen;
	for(i=0;i<points.length;++i){
		arr = points[i];
		d = new DO();
		d.graphics().clear();
		d.graphics().setFill(0x33FF0000);
		d.graphics().setLine(1.0,0xFF00FF00);
		d.graphics().beginPath();
		x = 0;
		for(j=0;j<arr.length;++j){
			p = arr[j];
			d.graphics().drawCircle(p.x+x,p.y,3.0);
			x += widths[j];
		}
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.graphics().fill();
		this._root.addChild(d);
	}
	// convert to seperate arrays:
	var pointsFr = [];
	var pointsTo = [];
	for(i=0;i<points.length;++i){
		arr = points[i];
		pointsFr.push(arr[0]);
		pointsTo.push(arr[1]);
	}
	// precondition
	var pointsToNormalized = [];
	var transformTo = R3D.normalizePoints2D(pointsTo,pointsToNormalized,null);
	var pointsFrNormalized = [];
	var transformFr = R3D.normalizePoints2D(pointsFr,pointsFrNormalized,null);
	//
	H = R3D.projectiveDLT(pointsFrNormalized,pointsToNormalized);
	//
	transformToInverse = new Matrix2D().inverse(transformTo);
	transformFrInverse = new Matrix2D().inverse(transformFr);
	// convert to Matrix from Matrix2D
	transformTo = new Matrix(3,3).fromArray(transformTo.toArray());
	transformFr = new Matrix(3,3).fromArray(transformFr.toArray());
	transformToInverse = new Matrix(3,3).fromArray(transformToInverse.toArray());
	transformFrInverse = new Matrix(3,3).fromArray(transformFrInverse.toArray());
	// denormalize
	H = Matrix.mult(H,transformFr);
	H = Matrix.mult(transformToInverse,H);
	// need 'inverse' transform for visualization
	H = Matrix.inverse(H);
	console.log(H.toString())
	// test with 2D points
	// test with 3D points
	// show altered image:
	var homography = H;
	var i = 0;
	img = images[i];
	wid = widths[i];
	hei = heights[i];
	var imageARGB = this._stage.getDOAsARGB(img, wid,hei);
	var imageMat = new ImageMat(wid,hei);
	imageMat.setFromArrayARGB(imageARGB);
	var planeWidth = 400;
	var planeHeight = 300;
// var planeWidth = 2100;
// var planeHeight = 700;
	var imagePlaneMat = ImageMat.extractRectWithProjection(imageMat,wid,hei, planeWidth,planeHeight, homography);
	var imagePlaneARGB = ImageMat.ARGBFromFloats(imagePlaneMat.red(),imagePlaneMat.grn(),imagePlaneMat.blu());
	var imagePlane = this._stage.getARGBAsImage(imagePlaneARGB, planeWidth,planeHeight);
	d = new DOImage(imagePlane);
	d.matrix().identity();
	d.matrix().translate(400,000);
	this._root.addChild(d);
	d.graphics().alpha(0.5);
	console.log(".........");
}
DLT2D.prototype.handleEnterFrame = function(e){
	//console.log(e);
}
