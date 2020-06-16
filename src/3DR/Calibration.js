// Calibration.js

function Calibration(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	//var imageList = ["calibrate_0.png","calibrate_2.png","calibrate_4.png","calibrate_5.png"];
	//var imageList = ["calibrate_2.png"];
	//var imageList = ["calibrate_1.png"];
	//var imageList = ["calibrate_5.png"];
	//var directory = "./images/calibration/";
	// 0 is good
	// 1 has glare - x 
	// 2 is good
	// 3 is ok - x => NOT ENOUGH CORNERS
	// 4 is good
	// 5 is small - x => CORNERS NOT CLOSE ENOUGH | MERGE?

	//var directory = "./images/phone6/calibrate/";
	//var imageList = ["calib-1.png","calib-2.png","calib-5.png","calib-6.png"];
	//var imageList = ["calib-6.png"];
//var imageList = ["calib-0.png","calib-1.png","calib-2.png","calib-3.png","calib-4.png","calib-5.png","calib-6.png"];


GLOBALSTAGE = this._stage;


// this.normalizingTest();
// return;
	this.syntheticTest();
	return;
/*


*/



	var directory = "./images/calib_test/";
	//var imageList = ["A.png","B.png","C.png","D.png","E.png","F.png","G.png"];
	var imageList = ["X.png","Y.png","C.png","D.png","E.png","F.png","G.png"];

	//var imageList = ["calib-0.png","calib-1.png","calib-2.png"];
//var imageList = ["calib-0.png"];
	// GOOD: 0 3
	// ? : 1 2 5 6
	var imageLoader = new ImageLoader(directory,imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}



Calibration.prototype.normalizingTest = function(){
	var pointCount = 1000;
	var rangeX = 10;
	var rangeY = 6;
	var rangeZ = 2;
	var offsetX = 2;
	var offsetY = 5;
	var offsetZ = 3;
	var rangeXToY = rangeX/rangeY;
	// var angleX = Code.radians(35);
	// var angleY = Code.radians(50);
	// var angleZ = Code.radians(10);
	var angleX = Code.radians(0);
	var angleY = Code.radians(0);
	var angleZ = Code.radians(0);

	var transform = new Matrix3D();
		transform.rotateX(angleX);
		transform.rotateY(angleY);
		transform.rotateZ(angleZ);

	transform.translate(offsetX,offsetY,offsetZ);

	var points3D = [];

	for(var i=0; i<pointCount; ++i){
		
		// // ring
		// var ratio = 0.75; // skinny
		// // var ratio = 0.5;
		// // var ratio = 0.25; // thick
		// var distance = ratio + Math.random()*(1.0-ratio);
		// var angle = Math.random()*Math.PI2;
		// var point = new V2D(distance,0);
		// point.rotate(angle);
		// point.scale(rangeX,rangeY);
		// point.scale(2);
		// point.rotate(angleX);
		// point.add(offsetX,offsetY);
		// points2D.push(point);
		
		// // sphere
		// var distance = Math.random();
		// var angle = Math.random()*Math.PI2;
		// // var angleY = Math.random()*Math.PI2;
		// // var angleZ = Math.random()*Math.PI2;
		// // var vector
		// var point = new V3D(distance,0,0);
		// point.rotate(angle);
		// point.scale(rangeX,rangeY,rangeZ);
		// point.scale(2);
		// point.rotate(angleX);
		// point.add(offsetX,offsetY);
		// points2D.push(point);
		

		
		// normal distribution
		var dx = Code.randomNormal(rangeX);
		var dy = Code.randomNormal(rangeY);
		// var dz = Code.randomNormal(rangeZ);
		var dz = 0;
		var point = new V3D(dx,dy,dz);
			transform.multV3DtoV3D(point,point);
		// point.add(offsetX,offsetY,offsetZ);
		points3D.push(point);
	}

	console.log(points3D);
	var xList = [];
	var yList = [];
	var zList = [];
	
	for(var i=0; i<points3D.length; ++i){
		var p = points3D[i];
		xList.push(p.x);
		yList.push(p.y);
		zList.push(p.z);
	}

// var str = "";
// str += "\n";
// str += Code.printMatlabArray(xList,"x",true) + "\n";
// str += Code.printMatlabArray(yList,"y",true) + "\n";
// str += Code.printMatlabArray(zList,"z",true) + "\n";
// str += "\n";
// console.log(str);
	// var info = Code.covariance3DInfo(points3D);
	// console.log(info);
	// console.log(info["sigmaX"]);
	// console.log(info["sigmaY"]);
	// console.log(info["sigmaZ"]);
	// console.log(info["directionX"]+"");
	// console.log(info["directionY"]+"");
	// console.log(info["directionZ"]+"");
	var result = Code.normalizedPoints3D(points3D);
	console.log(result);

points3D = result["normalized"];

xList = [];
yList = [];
zList = [];
	for(var i=0; i<points3D.length; ++i){
		var p = points3D[i];
		xList.push(p.x);
		yList.push(p.y);
		zList.push(p.z);
	}

// var str = "";
// str += "\n";
// str += Code.printMatlabArray(xList,"x",true) + "\n";
// str += Code.printMatlabArray(yList,"y",true) + "\n";
// str += Code.printMatlabArray(zList,"z",true) + "\n";
// str += "\n";
// console.log(str);



	throw "points3D"
}

Calibration.prototype.syntheticTest = function(){
	console.log("syntheticTest");



	// parameters
	var imageSizeX = 400;
	var imageSizeY = 300;
	var wm1 = imageSizeX-1;
	var hm1 = imageSizeY-1;

	// var k0 = 0.0;
	// var k1 = 0.0;
	// var k2 = 0.0;
	// var p0 = 0.0;
	// var p1 = 0.0;

	// pincushion
	var k0 = 4.0;
	var k1 = 1.0;
	var k2 = 0.10;
	var p0 = 0.0;
	var p1 = 0.0;

	// barrel
	// var k0 = -4.0;
	// var k1 = -1.0;
	// var k2 = -0.10;
	// var p0 = 0.0;
	// var p1 = 0.0;
	
	var distortion = {"k0":k0, "k1":k1, "k2":k2, "p0":p0, "p1":p1};

	var fx = 1000;
	var fy = 1000;
	var s = 0;
	var cx = (imageSizeX-1) * 0.5;
	var cy = (imageSizeY-1) * 0.5;
	var K = new Matrix(3,3).fromArray([fx, s, cx, 0, fy, cy, 0, 0, 1]);
	// 
	console.log(K+"")
	console.log(Matrix.inverse(K)+"")

	// make grid points
	var points3D = [];
	var minX = -1.0;
	var maxX =  1.0;
	var minY = -1.0;
	var maxY =  1.0;
	var cntX = 10;
	var cntY = 10;

var plane = (new Matrix3D()).rotateX(Code.radians(  45.0)).rotateY(Code.radians(  45.0)).rotateZ(Code.radians(  0.0)).translate(0,1,0).toMatrix();

	for(var i=0; i<cntX; ++i){
		var x = minX + (maxX-minX) * i/(cntX-1);
		for(var j=0; j<cntY; ++j){
			var y = minY + (maxX-minX) * j/(cntY-1);
			// var point3D = new V3D(x,y,Math.random());
			var point3D = new V3D(x,y,1.0);
			// var point3D = new V3D(x,1.0,y);

			// point3D = plane.multV3DtoV3D(point3D);

			points3D.push(point3D);
		}
	}
	console.log(points3D);

	// make various view/camera locations
	var Ps = [];
	Ps.push(  (new Matrix3D()).rotateX(Code.radians(  0.0)).rotateY(Code.radians(  0.0)).rotateZ(Code.radians(  0.0)).translate(0,   0,7).toMatrix() );
	Ps.push(  (new Matrix3D()).rotateX(Code.radians( 10.0)).rotateY(Code.radians(  0.0)).rotateZ(Code.radians(-10.0)).translate(0,   0,5).toMatrix() );
	Ps.push(  (new Matrix3D()).rotateX(Code.radians( 10.0)).rotateY(Code.radians( 10.0)).rotateZ(Code.radians(  0.0)).translate(0,   0,6).toMatrix() );
	Ps.push(  (new Matrix3D()).rotateX(Code.radians( 40.0)).rotateY(Code.radians( 10.0)).rotateZ(Code.radians(  0.0)).translate(0, 0.6,6).toMatrix() );
	Ps.push(  (new Matrix3D()).rotateX(Code.radians( 20.0)).rotateY(Code.radians( 30.0)).rotateZ(Code.radians( 10.0)).translate(0, 0.1,4).toMatrix() );
	Ps.push(  (new Matrix3D()).rotateX(Code.radians(-30.0)).rotateY(Code.radians(-40.0)).rotateZ(Code.radians( 10.0)).translate(1,-0.1,5).toMatrix() );
	console.log(Ps);

	var images = [];
	var projectedPoints = [];

	// project each camera location to screen to create 2D points
	var pixelColor = new V3D(1,1,1);
	var bgColor = new V3D(0,0,0);
	// var pixelColor = new V3D(0,0,0);
	// var bgColor = new V3D(1,1,1);
	for(var i=0; i<Ps.length; ++i){
		var P = Ps[i];
		// extrinsic 3D Pi
		var list = [];
		var image = new ImageMat(imageSizeX,imageSizeY);
			image.fill(bgColor);
		for(var j=0; j<points3D.length; ++j){
			var X0 = points3D[j];
			var X1 = P.multV3DtoV3D(X0);
			// 3D x = X/Z
			if(X1.z!==0 && X1.z>0){
				var x0 = new V2D(X1.x/X1.z, X1.y/X1.z);
				
				// 2D distortion
				var x1 = x0.copy();
				R3D.applyCameraDistortion(x1,x0,distortion);
				// intrinsic
				var x2 = K.multV2DtoV2D(x1);
// console.log(x0+" => "+x2);
// console.log(x0+" => "+x1);
				if(0<=x2.x && x2.x<=wm1 && 0<=x2.y && x2.y<=hm1){
					// list.push([X1, x2]);
					list.push([X0, x2]);
					image.setPoint(Math.round(x2.x), Math.round(x2.y), pixelColor);
				}
			}
		}
		projectedPoints.push(list);
		images.push(image);
	}
	console.log(projectedPoints);
	console.log(images);
// throw "..."
	var display = this._root;
	for(var i=0; i<images.length; ++i){
		var image = images[i];
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
			var d = new DOImage(img);
			// d.matrix().scale(1.0);
			d.matrix().translate(10 + i*(image.width()+10), 10);
			// d.graphics().alpha(0.4);
			display.addChild(d);
	}
	// solve for K initial
	var pointList3D = [];
	var pointList2D = [];
	for(var i=0; i<projectedPoints.length; ++i){
		var list = projectedPoints[i];
		var list3D = [];
		var list2D = [];
		for(var j=0; j<list.length; ++j){
			var item = list[j];
			var p3D = item[0];
			var p2D = item[1];
			list3D.push(p3D);
			list2D.push(p2D);
		}
		pointList3D.push(list3D);
		pointList2D.push(list2D);
	}
	console.log(pointList3D);
	console.log(pointList2D);
	var result = R3D.calibrateCameraK(pointList3D,pointList2D);
	console.log(result);

	throw "..."

	// undistort image2:
	for(var i=0; i<images.length; ++i){
		// break;
		var observed = images[i];
		var undistorted = R3D.undistortCameraImage(observed, K, distortion, null);
		var imageMask = undistorted["mask"];
			undistorted = undistorted["image"];
		// console.log(undistorted);
		// 
var offX = 10 + i*(image.width()+10);
var offY = 10 + (observed.height()+10);
		image = undistorted;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
			var d = new DOImage(img);
			// d.matrix().scale(1.0);
			d.matrix().translate(offX, offY);
			// d.graphics().alpha(0.4);
			display.addChild(d);
		// 
		var img = GLOBALSTAGE.getFloatRGBAsImage(imageMask,imageMask,imageMask, image.width(),image.height());
			var d = new DOImage(img);
			d.matrix().translate(offX, offY);
			d.graphics().alpha(0.25);
			display.addChild(d);
	}

		// create table of forward transforms:
		// get range of undistorted points
		// forr each point (undistorted)
		// A) K * x0 => x1
		// B) D(x1) => x2
		// TABLE ENTRY x2 => x0

	// display.matrix().scale(1.5);
}
//



Calibration.prototype.handleMouseClickFxn = function(e){
	var p = e.location;
	if(p.x>400){
		p.x -= 400;
	}
	console.log(p+"");
}
Calibration.prototype.handleImagesLoaded = function(imageInfo){
GLOBALSTAGE = this._stage;
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0, y = 0;
	var images = [];
	var imageMatrixList = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		d.graphics().alpha(0.10);
		d.matrix().translate(x,y);
		x += img.width;
		//
		var imageSource = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixList.push(imageMatrix);
	}
	/*
	// get checkerboard points
	var pointList2D = [];
	var pointList3D = [];
	for(i=0; i<imageMatrixList.length; ++i){
		var imageMatrix = imageMatrixList[i];
		var pointMatches = R3D.detectCheckerboard(imageMatrix);
		if(pointMatches){
			var points2D = pointMatches["points2D"];
			var points3D = pointMatches["points3D"];
			pointList2D.push(points2D);
			pointList3D.push(points3D);
		}else{
			console.log("pointMatches null "+i);
		}
	}
	//return;
	// console.log(pointList2D+"");
	// console.log(pointList3D+"");
	var result = R3D.calibrateCameraK(pointList3D,pointList2D);
	console.log(result);
	var K = result["K"];
	console.log(K+"");
	*/
	R3D.calibrateFromCheckerboards(imageMatrixList);
}



