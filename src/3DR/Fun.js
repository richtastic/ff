// Fun.js

/*

*) Fundamental matrix (14) [ch 10+14+15]
	A) direct reconstruction via measured points
	B) 	a) affine: plane at infinity
		b) metric: image of absolute conic
*) Image Rectification (14+15) [ch ]
*) Disparity map (14+15+16) [ch ]
*) Triangulation (15) [ch 11]
*) trifocal tensor (17) [ch 14+15]
*) repeat. [ch 17]
*) auto calibration [ch 18]
point triplets - define plane
*) () [ch ]
*) () [ch ]
*) () [ch ]
*) () [ch ]
*/



function Fun(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._stage.start();
	this._root = new DO();
//this._root.matrix().translate(50,50);
	this._stage.root().addChild(this._root);
	// load images
	new ImageLoader("./images/",["F_S_1_1.jpg","F_S_1_2.jpg"],this,this.imagesLoadComplete).load();
}
Fun.prototype.imagesLoadComplete = function(o){
	this._inputImages = o.images;
	this._inputFilenames = o.files;
	var data;
	// scene
	this._scene = new Scene3DR();
	var scene = this._scene;
	// view 1
	var viewA = new View3DR();
	viewA.putativePoints([ new V3D(0.235,0.075), new V3D(0.587,0.085), new V3D(0.836,0.0336), new V3D(0.430,0.440), new V3D(0.795,0.330), new V3D(0.805,0.430), new V3D(0.215,0.555), new V3D(0.880,0.580), new V3D(0.750,0.670), new V3D(0.235,0.733) ]);
	data = this._stage.getImageAsFloatRGB(this._inputImages[0]);
	viewA.source(data.red,data.grn,data.blu,data.width,data.height);
	scene.addView(viewA);
	// view 2
	var viewB = new View3DR();
	viewB.putativePoints([ new V3D(0.175,0.113), new V3D(0.525,0.150), new V3D(0.770,0.115), new V3D(0.370,0.490), new V3D(0.730,0.395), new V3D(0.740,0.495), new V3D(0.150,0.600), new V3D(0.820,0.635), new V3D(0.695,0.730), new V3D(0.170,0.790) ]);
	data = this._stage.getImageAsFloatRGB(this._inputImages[1]);
	viewB.source(data.red,data.grn,data.blu,data.width,data.height);
	scene.addView(viewB);
	// link
	scene.addLink(viewA, viewB);
	// 
	this.all();
	this.displayData();
}
Fun.prototype.displayData = function(){
	var d, wid, hei, i, accWid = 0;
	var u, v, w;
	var len = this._inputImages.length;
	// epipolar lines
	var link = this._scene.link(0);
	var A = link.A();
	var B = link.B();
	var inputPoints = [A.resolvedPoints(),B.resolvedPoints()];
	var F = link.FA();
	var Finv = link.FB();
	// visuals
	var linesDO = new DO();
	// display initial images
	for(i=0;i<len;++i){
		d = new DOImage(this._inputImages[i]);
		d.matrix().translate(accWid,0.0);
		this._root.addChild(d);
		wid = d.width();
		hei = d.height();
		// display initial points
		for(j=0;j<inputPoints[i].length;++j){
			v = inputPoints[i][j];
			this._root.addChild( R3D.drawPointAt(accWid + wid*v.x,hei*v.y,   0xFF,0x00,0x00) );
		}
		// display epipolar lines
		var pA, pB, arr, off;
		for(j=0;j<inputPoints[i].length;++j){
			v = inputPoints[i][j];
			if(i==0){
				arr = link.searchLineInBFromPointInA(v);
				off = wid;
			}else{ // i==1
				arr = link.searchLineInAFromPointInB(v);
				off = 0.0;
			}
			if(arr){
				pA = arr[0]; pA.x*= wid; pA.y*= hei;
				pB = arr[1]; pB.x*= wid; pB.y*= hei;
				var d = new DO();
				var colLine = 0xFF00FFFF;
				d.graphics().setLine(1.0, colLine );
				d.graphics().beginPath();
				d.graphics().moveTo(pA.x + off,pA.y);
				d.graphics().lineTo(pB.x + off,pB.y);
				d.graphics().endPath();
				d.graphics().fill();
				d.graphics().strokeLine();
				linesDO.addChild( d );
			}
		}
		// display final points
		
		// ...
		accWid += wid;
	}

link.calculateRectificationTables();

var i, d, r;
	// A
	r = link.rectificationB();
	i = this._stage.getFloatRGBAsImage(r.image.red(),r.image.grn(),r.image.blu(), r.width,r.height);
	d = new DOImage(i);
	d.matrix().translate(0,0);
	this._root.addChild(d);
	// B
	r = link.rectificationA();
	i = this._stage.getFloatRGBAsImage(r.image.red(),r.image.grn(),r.image.blu(), r.width,r.height);
	d = new DOImage(i);
	d.matrix().translate(600,0);
	this._root.addChild(d);


console.log("ACTUALLY.. this needs to be changed to search between two haystacks");

	
for(i=0;i<inputPoints.length;++i){
	r = link.rectificationB();
	var index;
	var searchInfo;
	var offX = 0;
	if(i==1){
		offX = 600;
		r = link.rectificationA();
	}
	for(j=0;j<inputPoints[i].length;++j){
		if(i==0){
			searchInfo = link.searchThetaRadiusInBFromPointInA(inputPoints[i][j]);
		}else{
			searchInfo = link.searchThetaRadiusInAFromPointInB(inputPoints[i][j]);
		}
		var angle = searchInfo.angle;
		var radiusMin = searchInfo.radiusMin;
		var radiusMax = searchInfo.radiusMax;
		radiusMin = Math.floor(radiusMin);
		radiusMax = Math.ceil(radiusMax);
		// convert to lookup-table angle
		angle = R3D.angleInLimits(angle,r.minAngle,r.maxAngle);
		if(r.increasing){
			index = Code.binarySearchArray(r.angles,Code.binarySearchArrayFloatIncreasing, angle);
		}else{
			index = Code.binarySearchArray(r.angles,Code.binarySearchArrayFloatDecreasing, angle);
		}
		if(index.length==1){ // exact match (lolz)
			index = index[0];
		}else{ // interpolate to exact line (probly not necessary)
			index = Code.linear1D(Code.linear1DRatio(angle,r.angles[index[0]],r.angles[index[1]]),index[0],index[1]);
		}
		// line in rectified image
		var imageWidth = (r.radiusMax-r.radiusMin+1);
		var d = new DO();
		var colLine = 0xFF00FF00;
		d.graphics().setLine(1.5, colLine );
		d.graphics().beginPath();
		d.graphics().moveTo(offX+radiusMin-r.radiusMin,index);
		d.graphics().lineTo(offX+radiusMax-r.radiusMin,index);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
		this._root.addChild( d );
	}
}

// SEARCH ALONG EACH LINE TO FIND BEST MATCH - CORRELATION / SSD

var windowSize = 11;
var rect, source, needle, haystack, row;
var img, di;
for(i=0;i<inputPoints.length;++i){
	rect = link.rectificationB();
	source = link.A().source();
	for(j=0;j<inputPoints[i].length;++j){
		point = inputPoints[i][j];
		// needle
// orientation is ambiguous
// needle needs to come from rectified image?
		needle = source.getSubImage(point.x*source.width(),point.y*source.height(), windowSize,windowSize);
		img = this._stage.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
		di = new DOImage(img);
		di.matrix().translate(j*windowSize,i*windowSize);
		di.matrix().scale(3.0);
		this._root.addChild(di);
		// haystack
			searchInfo = link.searchThetaRadiusInBFromPointInA(point);
			row = Link3DR.rectificationAngleIndex(rect,searchInfo.angle);
		haystack = rect.image.getSubImage( (searchInfo.radiusMin+searchInfo.radiusMax)*0.5 - rect.radiusMin,row,Math.floor(searchInfo.radiusMax-searchInfo.radiusMin+1),windowSize);
		img = this._stage.getFloatRGBAsImage(haystack.red(),haystack.grn(),haystack.blu(), haystack.width(),haystack.height());
		di = new DOImage(img);
		di.matrix().translate(0*windowSize,j*windowSize + 50);
		di.matrix().scale(3.0);
		this._root.addChild(di);
	}
	break;
}
// r.image.red(),r.image.grn(),r.image.blu()











// NO DISTORTION:
// convolution angle-to-line on demand: 
// input: point
// grab strip from closest to furthest intersection, separated by n pixels
// memoization?








/*

var F = R3D.fundamentalMatrix(this._normalizedInputPoints[0],this._normalizedInputPoints[1]);
F = Matrix.mult(F,this._forwardTransforms[0]); // a normalized
F = Matrix.mult(Matrix.transpose(this._forwardTransforms[1]),F); // b denormalized
Finv = Matrix.transpose(F);

// epipoles
	var e = R3D.getEpipolesFromF(F);
	
	var rect, data, img;
	img = this._inputImages[0];
var wid = img.width;
var hei = img.height;
img = this._stage.renderImage(wid,hei, this._root);
//document.body.appendChild(img);
	data = this._stage.getImageAsFloatRGB(img);
	rect = R3D.polarRectification(data, new V2D(e.A.x*data.width,e.A.y*data.height));

var i = this._stage.getFloatRGBAsImage(rect.red,rect.grn,rect.blu, rect.width, rect.height);
var d = new DOImage(i);
d.matrix().translate(900,0);
this._stage.addChild(d);
*/
}
Fun.prototype.all = function(){
	this._scene.bundleAdjust();
	

	// ...

/*
convert point in image to point in rectified
	- radius = given
	- theta from lookup table ... 
*/

//for(i=0;i<this._inputImages.length;++i){

	// img = this._inputImages[1];
	// data = this._stage.getImageAsFloatRGB(img);
	// rect = R3D.polarRectification(data, new V2D(e.B.x*data.width,e.B.y*data.height));
	// console.log(rect);

	// image rectification for fine-reconstruction of all X
	
	// search along epipolar line (even better - search along effed F)

	// disparity

	// + camera matrices
	// + Xi
	
	/// 
}
/*
disparity searching:
A) image rectification
	+ all stereo disparity matching
	+ construct single image for each view
	- near epipoles, the location to search is 2D
B) search along rank2+ F line
	+ search location is 1D near epipoles
	- have to do this hundreds of times

*) scale can change (adaptive?)
*/


Fun.prototype.fundementalFromPoints = function(pointsA,pointB){
	// normalize points x, x'
	// solve Af = 0 : Ai = x'*x x'*y x' y'*x y'*y y' x y 1
	// F = [a b c; d e f; g h i]
	// force F to rank 2, while closestly approximating 
		// a) using last column of V in F = USV^T
		// b) iteritively start with (a), minimize geometric distance via L.M. converging f
	//
	var F = new Matrix(3,3);
	return F;
}

// Fun.prototype. = function(){
// 	//
// }

// Fun.prototype. = function(){
// 	//
// }

// Fun.prototype. = function(){
// 	//
// }


