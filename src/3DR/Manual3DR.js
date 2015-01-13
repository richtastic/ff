// Manual3DR.js

function Manual3DR(){
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
	//
	var imageList, imageLoader;
	// calibration images:
	imageList = ["calibration1-0.jpg","calibration1-1.jpg","calibration1-2.jpg"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleCalibrationImagesLoaded,null);
//	imageLoader.load();
	// import image to work with
	imageList = ["caseStudy1-0.jpg","caseStudy1-26.jpg"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleSceneImagesLoaded,null);
	imageLoader.load();
}
Manual3DR.prototype.getVertexShaders1 = function(){
	return ["\
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_PointSize = 2.0; \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
    	",
    	"\
    	attribute vec3 aVertexPosition; \
		attribute vec2 aTextureCoord; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		varying vec2 vTextureCoord; \
		void main(void) { \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vTextureCoord = aTextureCoord; \
		} \
		",
		" \
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
		"];
}
Manual3DR.prototype.getFragmentShaders1 = function(){
    return ["\
		precision highp float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
		",
		"\
		precision mediump float; \
		varying vec2 vTextureCoord; \
		uniform sampler2D uSampler; \
		void main(void){ \
			gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); \
		} \
    	",
    	"\
		precision highp float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
    "];
}
Manual3DR.prototype.onEnterFrameFxn3D = function(e){
	this.render3DScene();
}
Manual3DR.prototype.onMouseDownFxn3D = function(e){
	var point = e;
	point = this.spherePointFromRectPoint(point);
	this._spherePointBegin = point;
	this._spherePointEnd = point.copy();
}
Manual3DR.prototype.onMouseMoveFxn3D = function(e){
	if(this._spherePointBegin){
		var point = e;
		point = this.spherePointFromRectPoint(point);
		this._spherePointEnd = point;
		this.updateSphereMatrixFromPoints(this._spherePointBegin, this._spherePointEnd);
	}
}
Manual3DR.prototype.onMouseUpFxn3D = function(e){
	// apply
	var point = e;
	point = this.spherePointFromRectPoint(point);
	this._spherePointEnd = point;
	this.updateSphereMatrixFromPoints(this._spherePointBegin, this._spherePointEnd);
	this._userInteractionMatrix.mult(this._userInteractionMatrix, this._sphereMatrix);
	//this._userInteractionMatrix.mult(this._sphereMatrix, this._userInteractionMatrix);
		// reset
	this._spherePointBegin = null;
	this._spherePointEnd = null;
	this._sphereMatrix.identity();
}
Manual3DR.prototype.onMouseWheelFxn3D = function(e){
	//
}

Manual3DR.prototype.spherePointFromRectPoint = function(point){
	var wid = this._canvas3D.width();
	var hei = this._canvas3D.height();
	point = Code.spherePointFrom2DRect(0,0,wid,hei, point.x,point.y);
	return point;
}
Manual3DR.prototype.updateSphereMatrixFromPoints = function(pointA,pointB){
	var angle = V3D.angle(pointA,pointB);
	angle = -angle;
	if(angle!=0){
		var direction = V3D.cross(pointA,pointB);
		direction.norm();
		this._sphereMatrix.identity();
		this._sphereMatrix.rotateVector(direction,angle);
	}
}

//
Manual3DR.prototype.handleCalibrationImagesLoaded = function(imageInfo){
	console.log("calibrated");
	var i, j, len, d, img, imgs, o, obj, p, v;
	var imageSources = imageInfo.images;
	// show image sources
	len = imageSources.length;
	for(i=0;i<len;++i){
		img = imageSources[i];
		if(i==0){
			imagePixelWidth = img.width;
			imagePixelHeight = img.height;
		}
		d = new DOImage(img);
if(i==2){
		this._root.addChild(d);
}
		d.matrix().translate(0,0);
	}
	// 0
	points0 = {	"pos2D":
				[new V2D(110,225),
				new V2D(343,224.5),
				new V2D(332,31),
				new V2D(109.5,58),
				new V2D(155.5,174.5),
				new V2D(281.5,169.5),
				new V2D(278,90),
				new V2D(154,101),
				new V2D(204,198.5),
				new V2D(229,197.5),
				new V2D(225,70),
				new V2D(200,72)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// 1
	points1 = {	"pos2D":
				[new V2D(83,184),
				new V2D(232,269.5),
				new V2D(341,163.5),
				new V2D(242,19),
				new V2D(168,168.5),
				new V2D(240.8,223.5),
				new V2D(291,174),
				new V2D(229.8,106),
				new V2D(183,212),
				new V2D(198,222.5),
				new V2D(288.5,132.5),
				new V2D(277,118)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// 2
	points2 = {	"pos2D":
				[new V2D(73.5,245.5),
				new V2D(311.5,219),
				new V2D(366,46.5),
				new V2D(26,58),
				new V2D(127,199),
				new V2D(270.5,185.5),
				new V2D(285,112.5),
				new V2D(118,123),
				new V2D(186,214.5),
				new V2D(214,212),
				new V2D(224,86),
				new V2D(188.5,88)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// var points = {	"pos2D":
	// 				[new V2D(0,0),
	// 				new V2D(0,0),
	// 				new V2D(0,0),
	// 				new V2D(0,0)],
	// 				"pos3D":
	// 				[new V3D(0,0,0),
	// 				new V3D(0,0,0),
	// 				new V3D(0,0,0),
	// 				new V3D(0,0,0)]
	// 			};
	var points = points2;
	// draw spots on image for verification:
	list = points.pos2D;
	for(i=0;i<list.length;++i){
		v = list[i];
		d = R3D.drawPointAt(v.x,v.y, 0xFF,0x00,0x00);
		this._root.addChild(d);
	}
}
/*
Calibration Image 0:

*/
Manual3DR.prototype.handleSceneImagesLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var i, list = [];
	for(i=0;i<imageList.length;++i){
		list[i] = imageList[i];
	}
this._resource.testImage = list[0];
	this._imageSources = list;
this.calibrateCameraMatrix();
	this.handleLoaded();
	//this.render3DScene();
	this._stage3D.start();
}
Manual3DR.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}
Manual3DR.prototype.calibrateCameraMatrix = function(){
	var i, j, rows, cols;
	var points0, points1, points2, H0, H1, H2;
	// 0
	points0 = {	"pos2D":
				[new V2D(110,225),
				new V2D(343,224.5),
				new V2D(332,31),
				new V2D(109.5,58),
				new V2D(155.5,174.5),
				new V2D(281.5,169.5),
				new V2D(278,90),
				new V2D(154,101),
				new V2D(204,198.5),
				new V2D(229,197.5),
				new V2D(225,70),
				new V2D(200,72)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// 1
	points1 = {	"pos2D":
				[new V2D(83,184),
				new V2D(232,269.5),
				new V2D(341,163.5),
				new V2D(242,19),
				new V2D(168,168.5),
				new V2D(240.8,223.5),
				new V2D(291,174),
				new V2D(229.8,106),
				new V2D(183,212),
				new V2D(198,222.5),
				new V2D(288.5,132.5),
				new V2D(277,118)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// 2
	points2 = {	"pos2D":
				[new V2D(73.5,245.5),
				new V2D(311.5,219),
				new V2D(366,46.5),
				new V2D(26,58),
				new V2D(127,199),
				new V2D(270.5,185.5),
				new V2D(285,112.5),
				new V2D(118,123),
				new V2D(186,214.5),
				new V2D(214,212),
				new V2D(224,86),
				new V2D(188.5,88)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// homography - projection matrices  ----  pointsFr,pointsTo
	H0 = R3D.projectiveDLT(points0.pos3D,points0.pos2D);
	H1 = R3D.projectiveDLT(points1.pos3D,points1.pos2D);
	H2 = R3D.projectiveDLT(points2.pos3D,points2.pos2D);
	// H0 = R3D.projectiveDLT(points0.pos2D,points0.pos3D);
	// H1 = R3D.projectiveDLT(points1.pos2D,points1.pos3D);
	// H2 = R3D.projectiveDLT(points2.pos2D,points2.pos3D);
	// console.log(H0.toString());
	// console.log(H1.toString());
	// console.log(H2.toString());
	// decompose cols of Hi
	var h_0_0 = H0.getCol(0);
	var h_0_1 = H0.getCol(1);
	var h_0_2 = H0.getCol(2);
	var h_1_0 = H1.getCol(0);
	var h_1_1 = H1.getCol(1);
	var h_1_2 = H1.getCol(2);
	var h_2_0 = H2.getCol(0);
	var h_2_1 = H2.getCol(1);
	var h_2_2 = H2.getCol(2);
	//console.log(h_1_1.toString());
	// get rows of V
	var v01 = Manual3DR.vRowFromCols(h_0_0,h_0_1,h_0_2, h_1_0,h_1_1,h_1_2);
	var v02 = Manual3DR.vRowFromCols(h_0_0,h_0_1,h_0_2, h_2_0,h_2_1,h_2_2);
	var v12 = Manual3DR.vRowFromCols(h_1_0,h_1_1,h_1_2, h_2_0,h_2_1,h_2_2);
		var v00 = Manual3DR.vRowFromCols(h_0_0,h_0_1,h_0_2, h_0_0,h_0_1,h_0_2);
		var v11 = Manual3DR.vRowFromCols(h_1_0,h_1_1,h_1_2, h_1_0,h_1_1,h_1_2);
		var v22 = Manual3DR.vRowFromCols(h_2_0,h_2_1,h_2_2, h_2_0,h_2_1,h_2_2);
	var v00_v11 = Matrix.sub(v00,v11);
	var v00_v22 = Matrix.sub(v00,v22);
	var v11_v22 = Matrix.sub(v11,v22);
	// console.log("v01");
	// console.log(v01.toString());
	// construct V matrix
	var vArr = [v01.toArray(),v00_v11.toArray(),
				v02.toArray(),v00_v22.toArray(),
				v12.toArray(),v11_v22.toArray()];
	var V = new Matrix(6,6).setFromArrayMatrix(vArr);
	//console.log(V.toString());
	// SVD: V * b = 0
	var svd = Matrix.SVD(V);
	//console.log(svd)
	// console.log(svd.V)
	// console.log(svd.V.toString())
	var coeff = svd.V.colToArray(5);
	//console.log(coeff)
	var b00 = coeff[0];
	var b01 = coeff[1];
	var b11 = coeff[2];
	var b02 = coeff[3];
	var b12 = coeff[4];
	var b22 = coeff[5];
	// compute K properties
		var num1 = (b01*b02) - (b00*b12);
		var den1 = (b00*b11) - (b01*b01);
	var v0 = num1/den1;
	var lambda = b22 - ((b02*b02 + v0*num1)/b00);
	var fx = Math.sqrt(Math.abs( lambda/b00 ));
	var fy = Math.sqrt(Math.abs( (lambda*b00)/den1 ));
	var s = -b01*fx*fx*fy/lambda;
	var u0 = ((s*v0)/fx) - ((b02*fx*fx)/lambda);
	// construct K
	var K = new Matrix(3,3).setFromArray([fx,s,u0, 0,fy,v0, 0,0,1]);
	console.log("K: ");
	console.log(K.toString());
	this._intrinsicK = K;
	//
	console.log("estimated example: ");
	console.log( (new Matrix(3,3).setFromArray([200,0,100, 0,300,150, 0,0,1])).toString() );
	console.log("..........................................");
}
Manual3DR.vRowFromCols = function(hi0,hi1,hi2, hj0,hj1,hj2){
	var arr = [];
	arr.push( Matrix.dot(hi0,hj0) );
	arr.push( Matrix.dot(hi0,hj1) + Matrix.dot(hi1,hj0) );
	arr.push( Matrix.dot(hi1,hj1) );
	arr.push( Matrix.dot(hi2,hj0) + Matrix.dot(hi0,hj2) );
	arr.push( Matrix.dot(hi2,hj1) + Matrix.dot(hi1,hj2) );
	arr.push( Matrix.dot(hi2,hj2) );
	return new Matrix(1,6).setFromArray(arr);
}
Manual3DR.prototype.handleLoaded = function(){
	var imagePixelWidth, imagePixelHeight;
	var i, j, len, d, img, imgs, o, obj, p, v;
	var imageSources = this._imageSources;
	var offsetX = 0; offsetY = 0;
	// show image sources
	len = imageSources.length;
	/*
	for(i=0;i<len;++i){
		img = imageSources[i];
		if(i==0){
			imagePixelWidth = img.width;
			imagePixelHeight = img.height;
		}
		d = new DOImage(img);
		this._root.addChild(d);
		d.matrix().translate(offsetX,offsetY);
		offsetX += d.image().width;
	}
	*/
	// determined point pairs:
	var pointList = [];
	// origin
	obj = {}
	obj.pos3D = new V3D(0,0,0);
	obj.pos2D = [new V2D(172,107), new V2D(191,145.5)];
	pointList.push(obj);
	// full y
	obj = {}
	obj.pos3D = new V3D(0,4,0);
	obj.pos2D = [new V2D(203,116), new V2D(231.5,152.5)];
	pointList.push(obj);
	// full z
	obj = {}
	obj.pos3D = new V3D(0,0,4);
	obj.pos2D = [new V2D(171.5,69), new V2D(192.5,100.5)];
	pointList.push(obj);
	// full xy
	obj = {}
	obj.pos3D = new V3D(4,4,0);
	obj.pos2D = [new V2D(176,128), new V2D(203,159.5)];
	pointList.push(obj);
	// full yz
	obj = {}
	obj.pos3D = new V3D(0,4,4);
	obj.pos2D = [new V2D(204,75.5), new V2D(234,103.5)];
	pointList.push(obj);
	// mid xz
	obj = {}
	obj.pos3D = new V3D(2,0,2);
	obj.pos2D = [new V2D(158.5,92.5), new V2D(178,124.5)];
	pointList.push(obj);
	// unknown correspondences:
	pointList.push({"pos3D":null,"pos2D":[new V2D(128,94), new V2D(157,99)]});
	pointList.push({"pos3D":null,"pos2D":[new V2D(189.5,180), new V2D(268.5,177)]});
	pointList.push({"pos3D":null,"pos2D":[new V2D(58,158), new V2D(65.5,165)]});
	// display point pairs:
	len = pointList.length;
	/*
	for(i=0;i<len;++i){
		imgs = pointList[i].pos2D;
		for(j=0;j<imgs.length;++j){
			v = imgs[j];
			if(pointList[i].pos3D){
				d = R3D.drawPointAt(v.x,v.y, 0xFF,0x00,0x00);
			}else{
				d = R3D.drawPointAt(v.x,v.y, 0x00,0x00,0xFF);
			}
			d.matrix().translate(j*400,0);
			this._root.addChild(d);
		}
	}
	*/
	// calculate fundamental matrix
	var pointsA = [];
	var pointsB = [];
	len = pointList.length;
	for(i=0;i<len;++i){
		imgs = pointList[i].pos2D;
		v = imgs[0];
		pointsA.push( new V3D(v.x,v.y,1) );
		v = imgs[1];
		pointsB.push( new V3D(v.x,v.y,1) );
	}
	// calculate Fundamental matrix from 2D correspondences
	var fundamental = R3D.fundamentalMatrix(pointsA,pointsB);
	console.log("F:");
	console.log(fundamental.toString())

	// already got intrinsic camera matrix
	var K = this._intrinsicK;
	console.log("K")
	console.log(K.toString())
	var Kinv = Matrix.inverse(K);
	console.log("K^-1")
	console.log(Kinv.toString())

	// calculate essential matrix
	var Kt = Matrix.transpose(K);
	var essential = Matrix.mult(Kt, Matrix.mult(fundamental,K) );
	console.log("E:")
	console.log(essential.toString())

	// need to work in normalized points inv(K) * x'
	var pointsNormA = new Array();
	var pointsNormB = new Array();
	len = pointsA.length;
	for(i=0;i<len;++i){
		v = pointsA[i];
		v = Kinv.multV3DtoV3D(new V3D(), v);
		pointsNormA.push( v );
		v = pointsB[i];
		v = Kinv.multV3DtoV3D(new V3D(), v);
		pointsNormB.push( v );
	}

	// 
	var W = new Matrix(3,3).setFromArray([0,-1,0, 1,0,0, 0,0,1]);
	var Wt = Matrix.transpose(W);
	//var Z = new Matrix(3,3).setFromArray([0,1,0, -1,0,0, 0,0,0]);
	var diag110 = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,0]);

	// force D = 1,1,0
	var svd = Matrix.SVD(essential);
	var U = svd.U;
	var S = svd.S;
	var V = svd.V;
	var Vt = Matrix.transpose(V);
	var t = U.getCol(2);
	var tNeg = t.copy().scale(-1.0);
	console.log("t:");
	console.log(t.toString())
	console.log(tNeg.toString())

	// one of 4 possible solutions
	var det;
	var possibleA = Matrix.mult(U,Matrix.mult(W,Vt));
	det = possibleA.det();
	if(det<0){
		console.log("FLIP1: "+det);
		possibleA.scale(-1.0);
	}
	var possibleB = Matrix.mult(U,Matrix.mult(Wt,Vt));
	det = possibleB.det();
	if(det<0){
		console.log("FLIP2: "+det);
		possibleB.scale(-1.0);
	}

	// 4x4 matrices
	var possibles = new Array();
	m = possibleA.copy().appendColFromArray(t.toArray());//.appendRowFromArray([0,0,0,1]);
	possibles.push( m );
	m = possibleA.copy().appendColFromArray(tNeg.toArray());//.appendRowFromArray([0,0,0,1]);
	possibles.push( m );
	m = possibleB.copy().appendColFromArray(t.toArray());//.appendRowFromArray([0,0,0,1]);
	possibles.push( m );
	m = possibleB.copy().appendColFromArray(tNeg.toArray());//.appendRowFromArray([0,0,0,1]);
	possibles.push( m );

	// find single matrix that results in 3D point in front of both cameras Z>0
	var pA = pointsNormA[0];
	var pB = pointsNormB[0];
	var pAx = Matrix.crossMatrixFromV3D( pA );
	var pBx = Matrix.crossMatrixFromV3D( pB );

var M1 = new Matrix(3,4).setFromArray([1,0,0,0, 0,1,0,0, 0,0,1,0]);
	var projection = null;
	len = possibles.length;
	for(i=0;i<len;++i){
		//var M1 = possibles[i];
		//var M2 = Matrix.inverse(M1);
			var M2 = possibles[i];
		//console.log(M1.toString());
		//console.log(M2.toString());
		var pAM = Matrix.mult(pAx,M1);
		var pBM = Matrix.mult(pBx,M2);
		// console.log(pAM.toString());
		// console.log(pBM.toString());
		// console.log("...");
		var A = pAM.copy().appendMatrixBottom(pBM);
		//console.log("svd");
		svd = Matrix.SVD(A);
		//console.log(svd);
		//console.log(svd.V.toString());
		
		var P1 = svd.V.getCol(3);
		var p1Norm = new V4D().setFromArray(P1.toArray());
		//console.log(p1Norm.toString());
		p1Norm.homo();
		//console.log(p1Norm.toString());
		var P2 = new Matrix(4,1).setFromArray( p1Norm.toArray() );
		//console.log(P2.toString());
M2 = M2.copy().appendRowFromArray([0,0,0,1]);
		P2 = Matrix.mult(M2,P2);
		//console.log(P2.toString());
		var p2Norm = new V4D().setFromArray(P2.toArray());
		//console.log(p2Norm.toString());
		p2Norm.homo();
		console.log(p1Norm.z+" && "+p2Norm.z);
		if(p1Norm.z>0 && p2Norm.z>0){
			console.log(".......................>>XXX");
			projection = M2;
			break;
		}
	}
	if(projection){
		console.log("projection:");
		console.log(projection.toString());
	}
this._cameras = [];
this._cameras.push({"extrinsic":new Matrix(4,4).identity(),
					"center":new V3D(0,0,0), // center of camera on image (not image center)
					"topLeft":new V3D(-1,1,0), // top left corner of image location
					"xAxis":new V3D(1,0,0), // top side of image
					"yAxis":new V3D(0,-1,0), // left side of image
					"points":[], // list of interest points to put lines thru
					"focalLength":1.0000,
					"screenWidth":1.0000,
					"screenHeight":1.0000,
					});
this._cameras.push({"extrinsic":projection
					});

	// // calculate projective camera matrix
	// len = pointList.length;
	// for(i=0;i<len;++i){
	// 	norms = [];
	// 	pointList[i].norm2D = norms;
	// 	imgs = pointList[i].pos2D;
	// 	for(j=0;j<imgs.length;++j){
	// 		v = imgs[j];
	// 		v = R3D.screenNormalizedPointFromPixelPoint(v, imagePixelWidth, imagePixelHeight);
	// 		// R3D.screenNormalizedAspectPointFromPixelPoint
	// 		norms[j] = v;
	// 	}
	// }
	//console.log(norms)

	//R3D.screenNormalizedPointsFromPixelPoints
	// ... - calculate projective reconstuction

	// calculate metric camera matrix
	// ...- upgrade to metric from known 3D position of 5+ points

	// dense back-project
	// ... midpoints

	// generate depth map
	// ... image A/B
}
Manual3DR.prototype.addCameraVisual = function(matrix){ // point/direction
	//...
	var pointsL = this._renderPointsList;
	var colorsL = this._renderColorsList;
	this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._vertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
	//
	// var i;
	// for(i=0;i<300;++i){
	// 	pointsL.push(Math.random()*3.0-1.5,Math.random()*3.0-1.5,Math.random()*3.0-1.5);
	// 	colorsL.push(0.0,Math.random()*1.0,0.50, 1.0);
	// }
	// 
	var i, j, len, tri, col;
	var c = [];
	var t = [];
	c.push(0xFFFF0000);
	t.push(Tri.fromList(0.0,0.0,0.0, 0.5,-0.5,1.0,  -0.5,-0.5,1.0));
	c.push(0xFF00CC00);
	t.push(Tri.fromList(0.0,0.0,0.0, 0.5,0.5,1.0, 0.5,-0.5,1.0));
	c.push(0xFF0000FF);
	t.push(Tri.fromList(0.0,0.0,0.0, -0.5,0.5,1.0, 0.5,0.5,1.0));
	c.push(0xFFFFCC00);
	t.push(Tri.fromList(0.0,0.0,0.0, -0.5,-0.5,1.0, -0.5,0.5,1.0));
	c.push(0xFFCCCCCC);
	t.push(Tri.fromList(0.5,-0.5,1.0, 0.5,0.5,1.0, -0.5,0.5,1.0));
	c.push(0xFF999999);
	t.push(Tri.fromList(0.5,-0.5,1.0, -0.5,0.5,1.0, -0.5,-0.5,1.0));

var v = new V3D();
	len = c.length;
	for(i=0;i<len;++i){
		col = c[i];
		tri = t[i];
		matrix.multV3DtoV3D(v,tri.A());
		console.log(tri.A().toString()+" -> "+v.toString());
		pointsL.push(v.x,v.y,v.z);
		matrix.multV3DtoV3D(v,tri.B());
		pointsL.push(v.x,v.y,v.z);
		matrix.multV3DtoV3D(v,tri.C());
		pointsL.push(v.x,v.y,v.z);
		for(j=0;j<3;++j){
			colorsL.push( Code.getFloatRedARGB(col),Code.getFloatGrnARGB(col),Code.getFloatBluARGB(col),Code.getFloatAlpARGB(col) );
		}
	}
	//
}
Manual3DR.prototype.render3DScene = function(){
	var e = this.e?this.e:0;
	this.e = e; ++this.e;
	this._stage3D.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);
	this._stage3D.clear();
	// 
	//this._userMatrix.rotateY(0.03);
	this._stage3D.matrixIdentity();
	//this._stage3D.matrixRotate(e*0.01, 0,1,0);
	//this._stage3D.matrixTranslate(0.0,0.0,-3.0*Math.pow(2,this._userScale) );
	this._stage3D.matrixTranslate(0.0,0.0,-5.0);
//	this._stage3D.matrixRotate(-Math.PI*0.5, 1,0,0);
	//this._stage3D.matrixRotate(Math.PI*0.5, 0,1,0);
//	this._stage3D.matrixRotate(e*0.0, e*0.0,0,1);

this._stage3D.matrixMultM3D(this._sphereMatrix);
this._stage3D.matrixMultM3D(this._userInteractionMatrix);


//this._stage3D.matrixMultM3DPre(this._sphereMatrix);
//this._sphereMatrix
	//this._stage3D.matrixPush();
	//this._stage3D.matrixMultM3D(this._userMatrixTemp);
	//this._stage3D.matrixMultM3D(this._userMatrix);
	//this._stage3D.matrixRotate(e*0.13, 0,1,0);
	// points
	// if(this._displayPoints){
	// 	this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._spherePointBuffer);
	// 	this._stage3D.bindArrayFloatBuffer(this._vertexColorAttrib, this._sphereColorBuffer);
	// 	this._stage3D.drawPoints(this._vertexPositionAttrib, this._spherePointBuffer);
	// }
	// triangles
	//console.log("rendering");
	if(this._planeTriangleVertexList){
		
// TRIANGLES
this._stage3D.selectProgram(0);
this._stage3D.enableCulling();
this._stage3D.matrixReset();
		//this._canvas3D._context.activeTexture(null);
		this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._planeTriangleVertexList);
		this._stage3D.bindArrayFloatBuffer(this._vertexColorAttrib, this._planeTriangleColorsList);
		this._stage3D.drawTriangles(this._vertexPositionAttrib, this._planeTriangleVertexList);

this._stage3D.disableCulling();

//this._stage3D.enableCulling();
this._stage3D.selectProgram(1);
this._stage3D.matrixReset();
		this._stage3D.bindArrayFloatBuffer(this._textureCoordAttrib, this._texturePoints);
		this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._vertexPoints);

		this._canvas3D._context.activeTexture(this._canvas3D._context.TEXTURE0);
		this._canvas3D._context.bindTexture(this._canvas3D._context.TEXTURE_2D,this._texture);
		this._canvas3D._context.uniform1i(this._canvas3D._program.samplerUniform, 0); // 
		this._stage3D.drawTriangles(this._vertexPositionAttrib, this._vertexPoints);
//

// RENDER LINES
this._stage3D.selectProgram(2);
this._stage3D.disableCulling();
this._stage3D.matrixReset();

this._stage3D.bindArrayFloatBuffer(this._programLineVertexPositionAttrib, this._programLinePoints);
this._stage3D.bindArrayFloatBuffer(this._programLineVertexColorAttrib, this._programLineColors);
this._stage3D.drawLines(this._programLineVertexPositionAttrib, this._programLinePoints);


//this._stage3D.matrixReset();
	}else{
this._stage3D.selectProgram(0);
this._renderPointsList = [];
this._renderColorsList = [];
		// do stuff
var matrix = new Matrix(4,4);

var i, len = this._cameras.length;
for(i=0;i<len;++i){
	var camera = this._cameras[i];
	matrix.copy(camera["extrinsic"]);
	this.addCameraVisual(matrix);
}
/*
matrix.identity();
matrix = Matrix.transform3DTranslate(matrix,0,0,0);
matrix = Matrix.transform3DRotateX(matrix, Math.PI*0.0);
this.addCameraVisual(matrix);
*/
		// done
		this._planeTriangleVertexList = this._stage3D.getBufferFloat32Array(this._renderPointsList,3);
		this._planeTriangleColorsList = this._stage3D.getBufferFloat32Array(this._renderColorsList,4);
		console.log(this._planeTriangleVertexList)
		console.log(this._planeTriangleColorsList)




//this._planeTriangleVertexList = 1
// TEXTURES
this._stage3D.selectProgram(1);

		var texture = this._resource.testImage;
		var program = this._canvas3D._program;
		var gl = this._canvas3D._context;
		//gl.bindTexture(gl.TEXTURE_2D, texture);
console.log("0");

var obj = new DOImage(texture);
this._root.addChild(obj);
var wid = texture.width;
var hei = texture.height;
var origWid = wid;
var origHei = hei;
wid = Math.pow(2, Math.ceil(Math.log(wid)/Math.log(2)) );
hei = Math.pow(2, Math.ceil(Math.log(hei)/Math.log(2)) );
console.log(wid,hei);
wid = Math.max(wid,hei);
hei = wid;
var origWid = origWid/wid;
var origHei = origHei/hei;
texture = this._stage.renderImage(wid,hei,obj, null);
obj.removeParent();

this._texture = this._canvas3D.bindTextureImageRGBA(texture);
var vert = 1-origHei;
var horz = origWid;
		// 
		var texturePoints = [];
		var vertexPoints = [];
		// do stuff
		texturePoints.push(0,vert, horz,vert, 0,1,        horz,vert, horz,1, 0,1);
		vertexPoints.push(0,-1,0, 3,-1,0, 0,1,0,  3,-1,0, 3,1,0, 0,1,0);
		// set
		this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
		this._textureCoordAttrib = this._stage3D.enableVertexAttribute("aTextureCoord");
		this._texturePoints = this._stage3D.getBufferFloat32Array(texturePoints, 2);
		this._vertexPoints = this._stage3D.getBufferFloat32Array(vertexPoints, 3);



		// LINES
		this._stage3D.selectProgram(2);
		this._programLineVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
		this._programLineVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
		var linePoints = [0,0, 5,5];
		var lineColors = [0,1,0,1, 1,1,0,1];
		this._programLinePoints = this._stage3D.getBufferFloat32Array(linePoints, 2);
		this._programLineColors = this._stage3D.getBufferFloat32Array(lineColors, 4);
	}
	// lines
	// put cameras in 3D world
	// put projected images in 2D world
	// 3D world mouse/keyboard navigation

}
Manual3DR.prototype.handleEnterFrame = function(e){ // 2D canvas
	//console.log(e);
}




