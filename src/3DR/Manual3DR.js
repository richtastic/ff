// Manual3DR.js

Manual3DR.KEY_IMAGE_FILE_LOCATION = "imageFileName";
Manual3DR.KEY_IMAGE_SOURCE = "imageSource";

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

// 	this._canvas3D = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,true);
// 	this._stage3D = new StageGL(this._canvas3D, 1000.0/20.0, this.getVertexShaders1(), this.getFragmentShaders1());
//   	this._stage3D.setBackgroundColor(0x00000000);
// 	this._stage3D.frustrumAngle(60);
// 	this._stage3D.enableDepthTest();
// this._stage3D.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this.onEnterFrameFxn3D, this);
// 	// this._stage3D.start();
// 	this._spherePointBegin = null;
// 	this._spherePointEnd = null;
// 	this._sphereMatrix = new Matrix3D();
// 	this._sphereMatrix.identity();
// 	this._userInteractionMatrix = new Matrix3D();
// 	this._userInteractionMatrix.identity();
// 	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_DOWN, this.onMouseDownFxn3D, this);
// 	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_UP, this.onMouseUpFxn3D, this);
// 	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_MOVE, this.onMouseMoveFxn3D, this);
// 	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_WHEEL, this.onMouseWheelFxn3D, this);
// 	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_CLICK, this.onMouseClickFxn3D, this);

	
	this._simulate3D();
	return;


// MANUALLY DETERMINED POINTS
	this._manualData = {
		"entries": {
			"A": {
				"imageFileName": "caseStudy1-0.jpg"
			},
			"B": {
				"imageFileName": "caseStudy1-9.jpg"
			},
			"C": {
				"imageFileName": "caseStudy1-12.jpg"
			},
			"D": {
				"imageFileName": "caseStudy1-14.jpg"
			},
			"E": {
				"imageFileName": "caseStudy1-20.jpg"
			},
			"F": {
				"imageFileName": "caseStudy1-24.jpg"
			},
			"G": {
				"imageFileName": "caseStudy1-29.jpg"
			}
		},
		"points" : [
			{
				"p3D" : {"x":0, "y":0, "z":0},
				"entries" : {
					"A" : { "p2D" : {"x":172, "y":107} },
					"B" : { "p2D" : {"x":212, "y":46.5} },
					"C" : { "p2D" : {"x":89, "y":147} },
					//
					"E" : { "p2D" : {"x":203, "y":150.5} },
					"F" : { "p2D" : {"x":181.5, "y":161.5} },
					"G" : { "p2D" : {"x":144, "y":175} }
				}
			},
			{
				"p3D" : {"x":4, "y":0, "z":0},
				"entries" : {
					"A" : { "p2D" : {"x":203, "y":116} },
					"B" : { "p2D" : {"x":235, "y":68} },
					"C" : { "p2D" : {"x":156, "y":149.5} },
					//
					"E" : { "p2D" : {"x":231, "y":155} },
					"F" : { "p2D" : {"x":215, "y":166} },
					"G" : { "p2D" : {"x":194.5, "y":189} }
				}
			},
			{
				"p3D" : {"x":4, "y":4, "z":0},
				"entries" : {
					"A" : { "p2D" : {"x":204, "y":74.5} },
					"B" : { "p2D" : {"x":239, "y":34} },
					"C" : { "p2D" : {"x":155, "y":80} },
					"D" : { "p2D" : {"x":317, "y":71} },
					"E" : { "p2D" : {"x":232, "y":116} },
					"F" : { "p2D" : {"x":216.5, "y":126.5} },
					"G" : { "p2D" : {"x":197.5, "y":117} }
				}
			},
			{
				"p3D" : {"x":0, "y":4, "z":0},
				"entries" : {
					"A" : { "p2D" : {"x":171, "y":68.5} },
					"B" : { "p2D" : {"x":213, "y":12} },
					"C" : { "p2D" : {"x":83, "y":78} },
					"D" : { "p2D" : {"x":299, "y":64} },
					"E" : { "p2D" : {"x":203, "y":115} },
					"F" : { "p2D" : {"x":183, "y":124} },
					"G" : { "p2D" : {"x":145, "y":110} }
				}
			},
			{
				"p3D" : {"x":0, "y":4, "z":4},
				"entries" : {
					"A" : { "p2D" : {"x":142, "y":76.5} },
					"B" : { "p2D" : {"x":178.5, "y":26} },
					"C" : { "p2D" : {"x":50, "y":87.5} },
					// 
					"E" : { "p2D" : {"x":178, "y":116} },
					"F" : { "p2D" : {"x":162, "y":125} },
					"G" : { "p2D" : {"x":87.5, "y":113} }
				}
			},
			{
				"p3D" : {"x":0, "y":0, "z":4},
				"entries" : {
					"A" : { "p2D" : {"x":144.5, "y":118.5} },
					"B" : { "p2D" : {"x":180, "y":60} },
					"C" : { "p2D" : {"x":58.5, "y":171} },
					//
					"E" : { "p2D" : {"x":177, "y":154.5} },
					"F" : { "p2D" : {"x":160.5, "y":166.5} },
					"G" : { "p2D" : {"x":88, "y":188.5} }
				}
			},
			{
				"p3D" : {"x":4, "y":0, "z":4},
				"entries" : {
					"A" : { "p2D" : {"x":175.5, "y":128} },
					"B" : { "p2D" : {"x":202.5, "y":82.5} },
					"C" : { "p2D" : {"x":140, "y":174.5} },
					//
					"E" : { "p2D" : {"x":204.5, "y":160} },
					"F" : { "p2D" : {"x":195, "y":170.5} },
					"G" : { "p2D" : {"x":140, "y":206.5} }
				}
			},
			// 
			{
				"p3D" : null,
				"entries" : {
					// "A" : { "p2D" : {"x":1, "y":} }
				}
			},
		]
	};

	var i, entries = this._manualData.entries;
	console.log(entries);
	var keys = Code.keys(entries);
	var imageList = [];
	for(i=0; i<keys.length; ++i){
		key = keys[i];
		imageList.push(entries[key][Manual3DR.KEY_IMAGE_FILE_LOCATION]);
	}
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleManualImagesLoaded,null);
	imageLoader.load();
	return;


// PREVIOUS
	//
	var imageList, imageLoader;
	// calibration images:
	// imageList = ["calibration1-0.jpg","calibration1-1.jpg","calibration1-2.jpg"];
	// imageLoader = new ImageLoader("./images/",imageList, this,this.handleCalibrationImagesLoaded,null);
	// imageLoader.load();
	// import image to work with
	imageList = ["caseStudy1-0.jpg","caseStudy1-26.jpg"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleSceneImagesLoaded,null);
	imageLoader.load();
//this.distortionStuff();
}
/*
	fx = 376.10038433315435
	fy = 376.7410755028418
	s  = -0.4399151157738108
	cx = 201.61665699519267
	cy = 152.26370698493383
*/

Manual3DR.prototype._simulate3D = function(){ // FORWARD
	console.log("simulating...");
	// set variable values
	var imageWidth = 400;
	var imageHeight = 300;
	var fx = 100;
	var fy = 100;
	var s = 0.0;
	var cx = imageWidth*0;//.65;
	var cy = imageHeight*0;//.65;
	var camX = 0.5;
	var camY = 0.5;
	var camZ = -1.0;
	var camRotXa = 20.0;
	var camRotYa = 0.0;
	var camRotZa = 30.0;
	var camRotXb = 0.0;
	var camRotYb = -30.0;
	var camRotZb = 0.0;
	// pick 3D points
	var points3D = [
	//new V3D(0,0,1),
						new V3D(0,0,0),
						new V3D(1,0,0),
						new V3D(1,1,0),
						new V3D(0,1,0),
						new V3D(0,0,1),
						new V3D(1,0,1),
						new V3D(1,1,1),
						new V3D(0,1,1),
						new V3D(0,0,2),
					];
	// generate extrinsic camera matrix
	var matrixAForward = new Matrix(4,4).setFromArray([1,0,0,0,  0,1,0,0,  0,0,1,0,  0,0,0,1]);
	matrixAForward = Matrix.transform3DRotateX(matrixAForward,(camRotXa/180.0)*Math.PI);
	matrixAForward = Matrix.transform3DRotateY(matrixAForward,(camRotYa/180.0)*Math.PI);
	matrixAForward = Matrix.transform3DRotateZ(matrixAForward,(camRotZa/180.0)*Math.PI);
	matrixAForward = Matrix.transform3DTranslate(matrixAForward,camX,camY,camZ);
	matrixAForward = Matrix.transform3DRotateX(matrixAForward,(camRotXb/180.0)*Math.PI);
	matrixAForward = Matrix.transform3DRotateY(matrixAForward,(camRotYb/180.0)*Math.PI);
	matrixAForward = Matrix.transform3DRotateZ(matrixAForward,(camRotZb/180.0)*Math.PI);
	
	// move world in opposite direction
	var matrixAReverse = Matrix.inverse(matrixAForward);

	// get actual camera center from forward matrix
	var cameraCenter = matrixAForward.multV3DtoV3D(new V3D(), new V3D(0,0,0));
	console.log("cameraCenter: "+cameraCenter.toString());

	// generate intrinsic camera matrix
	var matrixK = new Matrix(3,3).setFromArray([fx,s,cx,  0,fy,cy,  0,0,1]);
	console.log("Af: \n "+matrixAForward.toString());
	console.log("Ar: \n "+matrixAReverse.toString());
	console.log("K: \n "+matrixK.toString());

	// DRAW POINTS PROJECTED ONTO CAMERA MATRIX
	var imageDO = new DO();
	imageDO.graphics().clear();
	// draw image BG:
	imageDO.graphics().setFill(0xFFCCCCCC);
	imageDO.graphics().beginPath();
	imageDO.graphics().moveTo(0,0);
	imageDO.graphics().lineTo(imageWidth,0);
	imageDO.graphics().lineTo(imageWidth,imageHeight);
	imageDO.graphics().lineTo(0,imageHeight);
	imageDO.graphics().lineTo(0,0);
	imageDO.graphics().endPath();
	imageDO.graphics().fill();
	// draw image border
	imageDO.graphics().setLine(3.0, 0xFF000099);
	imageDO.graphics().beginPath();
	imageDO.graphics().moveTo(0,0);
	imageDO.graphics().lineTo(imageWidth,0);
	imageDO.graphics().lineTo(imageWidth,imageHeight);
	imageDO.graphics().lineTo(0,imageHeight);
	imageDO.graphics().lineTo(0,0);
	imageDO.graphics().endPath();
	imageDO.graphics().strokeLine();
	// draw image reticule
	imageDO.graphics().setLine(1.0, 0x99990000);
	imageDO.graphics().beginPath();
	imageDO.graphics().moveTo(cx,0);
	imageDO.graphics().lineTo(cx,imageHeight);
	imageDO.graphics().moveTo(0,imageHeight-cy); // flip y for image
	imageDO.graphics().lineTo(imageWidth,imageHeight-cy); // flip y for image
	imageDO.graphics().endPath();
	imageDO.graphics().strokeLine();
	// go over all points and render to image
	for(var i=0; i<points3D.length; ++i){
		console.log(i+".....................................");
		var point3D_E = points3D[i];
		console.log("X_E = "+point3D_E.toString());
		// orientate from world 3D point to camera 3D point
		var vector = new Matrix(4,1).setFromArray([point3D_E.x,point3D_E.y,point3D_E.z,1.0]);
		vector = Matrix.mult(matrixAReverse,vector);
		var point3D_A = new V3D().setFromArray(vector.toArray());
		console.log("X_A = "+point3D_A.toString());
		// project onto camera 2D plane
		if(point3D_A.z!=0 && point3D_A.z > 0){ // infinity || behind
			var point2D_a = new V2D( point3D_A.x/point3D_A.z, point3D_A.y/point3D_A.z);
			console.log("x_a_1 = "+point2D_a);
			// orientate 2D plane to image position/scale/skew
			vector = new Matrix(3,1).setFromArray([point2D_a.x,point2D_a.y,1.0]);
			vector = Matrix.mult(matrixK,vector);
			var point2D_a_image = new V2D().setFromArray(vector.toArray());
			// flip y axis for image direction
			point2D_a_image.y = imageHeight - point2D_a_image.y;
			console.log("x_a_2 = "+point2D_a_image);
			if(point2D_a_image.x>=0 || point2D_a_image.x<=imageWidth || point2D_a_image.y>=0 || point2D_a_image.y<=imageHeight){ // inside image rectangle
				// draw point onto image:
				var p = new V2D(point2D_a_image.x,point2D_a_image.y);
				var c = new DO();
				var r = 3.0;
				c.graphics().setLine(1.0, 0xFF990000);
				c.graphics().setFill(0xFFFF6666);
				c.graphics().beginPath();
				c.graphics().drawCircle(p.x,p.y, r);
				c.graphics().endPath();
				c.graphics().strokeLine();
				c.graphics().fill();
				imageDO.addChild(c);
			}
		}else{
			console.log("X_A.z == 0");
		}
	}
	this._root.addChild(imageDO);


	var cameraImage = this._stage.renderImage(imageWidth,imageHeight,imageDO);
	// var d = new DOImage(cameraImage);
	// d.matrix().translate(500,50);
	// this._root.addChild(d);


	// START UP 3D STAGE:
	this._canvas3D = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,true);
	this._stage3D = new StageGL(this._canvas3D, 1000.0/20.0, this.getVertexShaders1(), this.getFragmentShaders1());
  	this._stage3D.setBackgroundColor(0x00000000);
	this._stage3D.frustrumAngle(60);
	this._stage3D.enableDepthTest();
	this._stage3D.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this._eff, this);
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


	// determine camera properties for display:
		var cameraCenterA = matrixAForward.multV3DtoV3D(new V3D(), new V3D(0,0,0));
		var cameraRightA = matrixAForward.multV3DtoV3D(new V3D(), new V3D(1,0,0));
		var cameraUpA = matrixAForward.multV3DtoV3D(new V3D(), new V3D(0,1,0));
		var cameraForwardA = matrixAForward.multV3DtoV3D(new V3D(), new V3D(0,0,1));
		console.log("cameraCenterA: "+matrixAForward.toString());
		var cameraDirectionZA = V3D.sub(cameraForwardA,cameraCenterA);
			cameraDirectionZA.norm();
		var cameraDirectionXA = V3D.sub(cameraRightA,cameraCenterA);
			cameraDirectionXA.norm();
		var cameraDirectionYA = V3D.sub(cameraUpA,cameraCenterA);
			cameraDirectionYA.norm();


	// SET UP POINTS:
	var points = [];
	var colors = [];
	for(var i=0; i<points3D.length; ++i){
		var p = points3D[i];
		points.push(p.x,p.y,p.z);
		colors.push(1.0, 0.0, 0.0, 1.0);
	}
	// camera center
		var p = cameraCenter;
		points.push(p.x,p.y,p.z);
		colors.push(0.0, 0.0, 1.0, 1.0);
	//
	this._stage3D.selectProgram(3);
	this._pointVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._pointVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
	this._pointPointBuffer = this._stage3D.getBufferFloat32Array(points,3);
	this._pointColorBuffer = this._stage3D.getBufferFloat32Array(colors,4);

	// SET UP LINES:
	var prs = [];
	for(var i=0; i<points3D.length; ++i){ // camera-to-point
		var p = points3D[i];
		prs.push([cameraCenter, p]);
	}
	var linPnt = [];
	var linCol = [];
	for(i=0; i<prs.length; ++i){
		p = prs[i];
		u = p[0];
		v = p[1];
		linPnt.push( u.x,u.y,u.z );
		linPnt.push( v.x,v.y,v.z );
		linCol.push(0.0,0.0,1.0,1.0);
		linCol.push(1.0,0.0,1.0,1.0);
	}
	// camera direction
		// X
		var p = cameraCenter;
		linPnt.push(p.x,p.y,p.z);
		linCol.push(1.0, 0.0, 0.0, 1.0);
		p = V3D.add(cameraCenter,cameraDirectionXA);
		linPnt.push(p.x,p.y,p.z);
		linCol.push(0.0, 0.0, 0.0, 1.0);
		// Y
		var p = cameraCenter;
		linPnt.push(p.x,p.y,p.z);cameraCenter.copy();
		linCol.push(0.0, 1.0, 0.0, 1.0);
		p = V3D.add(cameraCenter,cameraDirectionYA);
		linPnt.push(p.x,p.y,p.z);
		linCol.push(0.0, 0.0, 0.0, 1.0);
		// Z
		var p = cameraCenter;
		linPnt.push(p.x,p.y,p.z);
		linCol.push(0.0, 0.0, 1.0, 1.0);
		p = V3D.add(cameraCenter,cameraDirectionZA);
		linPnt.push(p.x,p.y,p.z);
		linCol.push(0.0, 0.0, 0.0, 1.0);
	
	// set globals
	this._renderLinePointsList = linPnt;
	this._renderLineColorsList = linCol;
	// create objects
	this._stage3D.selectProgram(2);
	this._programLineVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._programLineVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
	this._programLinePoints = this._stage3D.getBufferFloat32Array(this._renderLinePointsList, 3);
	this._programLineColors = this._stage3D.getBufferFloat32Array(this._renderLineColorsList, 4);


	// SET UP TEXTURES:
	this._textureUVPoints = [];
	this._textureVertexPoints = [];
	this._renderTextureUVList = [];
	this._renderTexturePointList = [];
	this._textures = [];
	//
	this._stage3D.selectProgram(1);
	this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._textureCoordAttrib = this._stage3D.enableVertexAttribute("aTextureCoord");
	var texture;
	var program = this._canvas3D._program;
	// create textures
	texture = cameraImage;
	var obj = this.textureBase2FromImage(texture);
	texture = obj["texture"];
	var horz = obj["width"];
	var vert = obj["height"];
	this._textures.push( this._canvas3D.bindTextureImageRGBA(texture) );
	// create triangles for camera images
		// visualizing screen
		var scale = 0.003;
		var focZ = scale*fx;
		var widX = scale*imageWidth;
		var heiY = scale*imageHeight;
		var cenX = scale*cx;
		var cenY = scale*(imageHeight-cy); // flip from image
			var dirX = cameraDirectionXA.copy().norm();
			var dirY = cameraDirectionYA.copy().norm();
			var dirZ = cameraDirectionZA.copy().norm();
			console.log("DIRECTIONS:");
			console.log(dirX.toString());
			console.log(dirY.toString());
			console.log(dirZ.toString());
		var lenX = dirX.copy().scale(widX);
		var lenY = dirY.copy().scale(heiY);
		var lenZ = dirZ.copy().scale(focZ);
		// determine corners of projected image
		var pOR = cameraCenter.copy().add(lenZ);
		var pTL = pOR.copy().sub( dirX.copy().scale(cenX) ).add( dirY.copy().scale(cenY) );
		var pTR = V3D.add(pTL,lenX);
		var pBL = V3D.sub(pTL,lenY);
		var pBR = V3D.add(pTL,lenX).sub(lenY);
		console.log("CORNERS:");
		console.log(pBL.toString());
		console.log(pBR.toString());
		console.log(pTR.toString());
		console.log(pTL.toString());
		var uvList = [0,vert, horz,vert, horz,1,  horz,1, 0,1, 0,vert];
		// ORIGINAL:
		var vertList = [pBL.x,pBL.y,pBL.z, pBR.x,pBR.y,pBR.z, pTR.x,pTR.y,pTR.z,   pTR.x,pTR.y,pTR.z, pTL.x,pTL.y,pTL.z, pBL.x,pBL.y,pBL.z];
		// FLIP Y:
		//var vertList = [pTL.x,pTL.y,pTL.z, pTR.x,pTR.y,pTR.z, pBR.x,pBR.y,pBR.z,   pBR.x,pBR.y,pBR.z, pBL.x,pBL.y,pBL.z, pTL.x,pTL.y,pTL.z];
		// FLIP X:
		//var vertList = [pBR.x,pBR.y,pBR.z, pBL.x,pBL.y,pBL.z, pTL.x,pTL.y,pTL.z,   pTL.x,pTL.y,pTL.z, pTR.x,pTR.y,pTR.z, pBR.x,pBR.y,pBR.z];
		// FLIP X & Y:
		//var vertList = [pTR.x,pTR.y,pTR.z, pTL.x,pTL.y,pTL.z, pBL.x,pBL.y,pBL.z,   pBL.x,pBL.y,pBL.z, pBR.x,pBR.y,pBR.z, pTR.x,pTR.y,pTR.z];

	this._renderTextureUVList[0] = uvList;
	this._renderTexturePointList[0] = vertList;



	//Manual3DR.prototype.addCameraVisual = function(matrix, textureUVPoints, textureVertPoints){ /
	//this.addCameraVisual(matrix, this._renderTextureUVList[i], this._renderTexturePointList[i]);
// 	var matrix = matrixA;
// 	this._renderTextureUVList[1] = [];
// 	this._renderTexturePointList[1] = [];
// 	this._textures.push( this._textures[0] );
// 	this._intrinsicK = matrixK;
// this._renderPointsList = [];
// this._renderColorsList = [];
// this._renderLinePointsList = [];
// this._renderLineColorsList = [];
// 	this.addCameraVisual(matrix, this._renderTextureUVList[1], this._renderTexturePointList[1]);
	// buffer creation
	var i, len = this._textures.length;
	for(i=0;i<len;++i){
		var texturePoints = this._renderTextureUVList[i];
		var vertexPoints = this._renderTexturePointList[i];
		this._textureUVPoints[i] = this._stage3D.getBufferFloat32Array(texturePoints, 2);
		this._textureVertexPoints[i] = this._stage3D.getBufferFloat32Array(vertexPoints, 3);
	}
	// START
	this._stage3D.start();
}
Manual3DR.prototype._eff = function(e){
	//console.log(e);
	var e = this.e?this.e:0;
	this.e = e; ++this.e;
	this._stage3D.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);
	this._stage3D.clear();
	this._stage3D.matrixIdentity();
 this._stage3D.matrixTranslate(-0.5,-0.5,-3.0);
// this._stage3D.matrixRotate(e*0.01, 0,1,0);
	//this._stage3D.matrixTranslate(0.0,0.0,-3.0*Math.pow(2,this._userScale) );
//this._stage3D.matrixTranslate(0.0,0.0,-5.0);
//	this._stage3D.matrixRotate(-Math.PI*0.5, 1,0,0);
	//this._stage3D.matrixRotate(Math.PI*0.5, 0,1,0);
//	this._stage3D.matrixRotate(e*0.0, e*0.0,0,1);

this._stage3D.matrixMultM3D(this._sphereMatrix);
this._stage3D.matrixMultM3D(this._userInteractionMatrix);

	// RENDER POINTS
	this._stage3D.selectProgram(3);
	this._stage3D.disableCulling();
	this._stage3D.matrixReset();
	this._stage3D.bindArrayFloatBuffer(this._pointVertexPositionAttrib, this._pointPointBuffer);
	this._stage3D.bindArrayFloatBuffer(this._pointVertexColorAttrib, this._pointColorBuffer);
	this._stage3D.drawPoints(this._pointVertexPositionAttrib, this._pointPointBuffer);
	
	// RENDER LINES
	this._stage3D.selectProgram(2);
	this._stage3D.matrixReset();
	this._stage3D.disableCulling();
	this._stage3D.bindArrayFloatBuffer(this._programLineVertexPositionAttrib, this._programLinePoints);
	this._stage3D.bindArrayFloatBuffer(this._programLineVertexColorAttrib, this._programLineColors);
	this._stage3D.drawLines(this._programLineVertexPositionAttrib, this._programLinePoints);

	// RENDER TEXTURES
	this._stage3D.selectProgram(1);
	this._stage3D.disableCulling();
	this._stage3D.matrixReset();
	for(i=0;i<this._textureUVPoints.length;++i){
		this._stage3D.bindArrayFloatBuffer(this._textureCoordAttrib, this._textureUVPoints[i]);
		this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._textureVertexPoints[i]);
		this._canvas3D._context.activeTexture(this._canvas3D._context.TEXTURE0);
		this._canvas3D._context.bindTexture(this._canvas3D._context.TEXTURE_2D,this._textures[i]);
		this._canvas3D._context.uniform1i(this._canvas3D._program.samplerUniform, 0); // 
		this._stage3D.drawTriangles(this._vertexPositionAttrib, this._textureVertexPoints[i]);
	}
}

Manual3DR.prototype.handleManualImagesLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, list = [];
	var entries = this._manualData.entries;
	var points = this._manualData.points;
	var keys = Code.keys(entries);
	var x = 0;
	var y = 0;
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		for(j=0;j<keys.length;++j){
			key = keys[j];
			var entry = entries[key];
			var str = entry[Manual3DR.KEY_IMAGE_FILE_LOCATION];
			if( file.endsWith(str) ){
				entry[Manual3DR.KEY_IMAGE_SOURCE] = img;
				break;
			}
		}
		
		var d = new DOImage(img);
		this._root.addChild(d);
		d.matrix().translate(x,y);
		for(j=0;j<points.length;++j){
			var point = points[j];
			var pentries = point.entries;
			if(pentries[key]){
				var p = pentries[key]["p2D"];
				var c = new DO();
				var r = 3.0;
				c.graphics().setLine(1.0, 0xFFFF0000);
				c.graphics().beginPath();
				c.graphics().drawCircle(p.x,p.y, r);
				c.graphics().endPath();
				c.graphics().strokeLine();
				d.addChild(c);
			}
		}
		x += img.width;
		if (x>1200.0) {
			x = 0.0;
			y += img.height;
		}
		// if(i==6){
		// 	break;
		// }
	}

	// solve for matrices between each camera
	for(i=0; i<keys.length; ++i){
		var keyA = keys[i];
		var entryA = entries[keyA];
		// for(j=i+1; j<keys.length; ++j){
		// 	var keyB = keys[j];
		// 	var entryB = entries[keyB];
			var common = [];
			for(k=0; k<points.length; ++k){
				point = points[k];
				if(point.entries[keyA]){// && point.entries[keyB]){
					common.push(point);
				}
			}
			//console.log(keyA+"+"+keyB+" = "+common.length);
			if(common.length>5){
				var rows = common.length*2.0;
				var cols = 12;
				//var b = new Matrix(rows,1);
				var A = new Matrix(rows,cols);
				for(k=0; k<common.length; ++k){
					point = common[k];
					var p3D = point["p3D"];
					var p2DA = point.entries[keyA]["p2D"];
					//var p2DB = point.entries[keyB]["p2D"];
					var r = k*2;
					//                            a       b       c     d       e       f       g     h             i             j             k       l 
					A.setRowFromArray(r+0, [ -p3D.x, -p3D.y, -p3D.z, -1.0,    0.0,    0.0,    0.0,  0.0, p2DA.x*p3D.x, p2DA.x*p3D.y, p2DA.x*p3D.z, p2DA.x ]); // -Xa - Yb - Zc - 1d + xXi + xYj + xZk + xl = 0
					A.setRowFromArray(r+1, [   -1.0,    0.0,    0.0,  0.0, -p3D.x, -p3D.y, -p3D.z, -1.0, p2DA.y*p3D.x, p2DA.y*p3D.y, p2DA.y*p3D.z, p2DA.y ]); // -Xe - Yf - Zg - 1h + yXi + yYj + yZk + yl = 0
					// A.setRowFromArray(r+2, [ -p3D.x, -p3D.y, -p3D.z, -1.0,    0.0,    0.0,    0.0,  0.0, p2DB.x*p3D.x, p2DB.x*p3D.y, p2DB.x*p3D.z, p2DB.x ]);
					// A.setRowFromArray(r+3, [   -1.0,    0.0,    0.0,  0.0, -p3D.x, -p3D.y, -p3D.z, -1.0, p2DB.y*p3D.x, p2DB.y*p3D.y, p2DB.y*p3D.z, p2DB.y ]);
				}
				// if common.length == 3 => solve
				//var x = Matrix.solve(A,b);
				var svd = Matrix.SVD(A);
				var U = svd.U;
				var S = svd.S;
				var V = svd.V;
				var x = V.getCol(cols-1); // V.cols() == cols
				//console.log(x.toString())
				var transform = new Matrix(4,4).setFromArray([x.get(0,0),x.get(1,0),x.get(2,0),x.get(3,0), x.get(4,0),x.get(5,0),x.get(6,0),x.get(7,0), x.get(8,0),x.get(9,0),x.get(10,0),x.get(11,0), 0,0,0,1]);
				console.log(transform.toString());
				//var inverse = Matrix.inverse(transform);
				//console.log(inverse.toString());
				// if(!entries[keyA]["transforms"]){
				// 	entries[keyA]["transforms"] = {};
				// }
				// if(!entries[keyB]["transforms"]){
				// 	entries[keyB]["transforms"] = {};
				// }
				entries[keyA]["transform"] = transform.toArray();

				// force to proper camera matrix P
			// }
			// break;
		}
		break;
	}
	//this._stage3D.start();
}


/*

get transform A, B 



*/









Manual3DR.prototype.distortionStuff = function(){
	var d, i, j, k, x, y, img, arr, index, X, Y, u, v, w;
	var wid = 400;
	var hei = 300;
	var dia = Math.sqrt(wid*wid+hei*hei);
	var colLineVer = 0xFFFF0000;
	var colLineHor = 0xFF0000FF;
	var colLineRad = 0xFF00FF00;
	var countVertical = 13;
	var countHorizontal = 11;
	var countRadial = 8;
	// create example image to display
	d = new DO();
	d.graphics().clear();
	// BG
	d.graphics().setFill(0xFFFFFFFF);
	d.graphics().beginPath();
	d.graphics().drawRect(0,0,wid,hei);
	d.graphics().endPath();
	d.graphics().fill();
	// vertical stripes
	for(i=0;i<countVertical;++i){
		x = wid*(i/(countVertical-1));
		d.graphics().setLine(2.0, colLineVer);
		d.graphics().beginPath();
		d.graphics().moveTo(x,0);
		d.graphics().lineTo(x,hei);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	// horizontal stripes
	for(i=0;i<countHorizontal;++i){
		y = hei*(i/(countHorizontal-1));
		d.graphics().setLine(2.0, colLineHor);
		d.graphics().beginPath();
		d.graphics().moveTo(0,y);
		d.graphics().lineTo(wid,y);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	// radial stripes
	for(i=0;i<countRadial;++i){
		r = dia*(i/(countRadial-1))*0.5; // Math.max(wid,hei)
		d.graphics().setLine(2.0, colLineRad);
		d.graphics().beginPath();
		d.graphics().drawCircle(wid*0.5,hei*0.5,r);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	// convert to image
	// img = this._stage.renderImage(wid,hei,d);
	// d = new DOImage(img);
	// convert to pixel array:
	arr = this._stage.getDOAsARGB(d,wid,hei);
	img = this._stage.getARGBAsImage(arr, wid,hei);
	img.setAttribute("style","z-index:9999999; position:relative; top:0; left:0; padding:0; margin:0; border:0;");
	document.body.appendChild(img);
	//
	var disArr = Code.newArrayZeros(wid*hei);
	index = 0;
	var maxDim = Math.max(wid,hei);
	var k0, k1, k2, k3, p1, p2, p3, x2, y2;
	var r2, r4, r6, xc, yc, xP, yP;
xc = 0.20;
yc = 0.30;
k0 = 1.0;
k1 = 1.0;
k2 = 0.0;
k3 = 0.0;
p1 = 0.0;
p2 = 0.0;

var systemPoints = {"original":
						[new V2D(0,0),
						new V2D(wid*0.5,0),
						new V2D(wid,0),
						new V2D(wid*0.5,hei*0.5),
						new V2D(wid*0.5,0),
						new V2D(wid*0.5,hei),
						new V2D(wid,0),
						new V2D(wid,hei*0.5),
						new V2D(wid,hei)],
					"distorted":[]};
	var pts = systemPoints["original"];
	var nxt = systemPoints["distorted"];
	for(i=0;i<pts.length;++i){
		v = pts[i];
		nxt[i] = this.pointFromDistortion(wid,hei,maxDim, v.x,v.y, xc,yc, k0,k1,k2,k3,p1,p2);
	}

var matA = new ImageMat(wid,hei);
matA.setFromArrayARGB(arr);
var col = new V3D();
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i,++index){
			v = this.pointFromDistortion(wid,hei,maxDim, i,j, xc,yc, k0,k1,k2,k3,p1,p2);
			// INTERPOLATE
			matA.getPoint(col, v.x,v.y);
			disArr[index] = Code.getColARGBFromFloat(1.0,col.x,col.y,col.z);
			// NEAREST NEIGHBOR
			// X = Math.round(v.x);
			// Y = Math.round(v.y);
			// if(0<=X && X<wid  && 0<=Y && Y<hei){
			// 	ind = Y*wid + X;
			// 	disArr[index] = arr[ind];
			// }else{
			// 	disArr[index] = 0xFF000000;
			// }
		}
	}
	// index = Math.round(hei*0.5 + (maxDim/hei)*yc)*wid + Math.round(wid*0.5*(wid/maxDim)*xc);
	// disArr[index] = 0xFFFFFF00;
	// disArr[index+1] = 0xFF000000;
	// disArr[index+2] = 0xFF000000;
	//
	//img = this._stage.getARGBAsImage(arr, wid,hei);
	img = this._stage.getARGBAsImage(disArr, wid,hei);
	img.setAttribute("style","z-index:9999999; position:relative; top:0; left:0; padding:0; margin:0; border:0;");
	document.body.appendChild(img);

	// recovery

// TODO: LINEAR STEP TO FIRST APPROXIMATE X VALUES
xc = 0.0;
yc = 0.0;
k0 = 1.0;
k1 = 0.0;
k2 = 0.0;
k3 = 0.0;
p1 = 0.0;
p2 = 0.0;

	var iterations, iterationsMax = 20;
	var error, errorPrev, errorNext, errorMag, delta, dist, result, currentResult, errorMinimum;
	var jacobian, Jinv, epsilon = 1E-8, err = 0, prevErr = 0;
	errorMinimum = 1E-10;
	error = new Matrix();
var unknowns = 8;
var h = new Matrix(unknowns,1); // 
var he = new Matrix(unknowns,1); // 
var jacobian = new Matrix(pts.length,unknowns); // k1,k2,k3
var lambda = 1E10;
var lambdaScale = 10.0;
h.setFromArray([xc,yc,k0,k1,k2,k3,p1,p2]);
	for(i=0;i<iterationsMax;++i){
		// y
		currentResult = this.cameraResultsFromSet(pts,nxt, wid,hei,maxDim, h.toArray()).result;
		// dy = squared error
		error = this.cameraResultsFromSet(pts,nxt, wid,hei,maxDim, h.toArray()).error;
		//console.log("        ??? "+error.toArray());
		errorMag = error.getNorm();
		console.log("ERROR: "+errorMag);
		if(errorMag<errorMinimum){
			console.log("converge");
			break;
		}
		errorPrev = errorMag;
		// dy => jacobian
		for(k=0;k<h.rows();++k){
			he.copy(h); he.set(k,0, he.get(k,0)+epsilon );
			result = this.cameraResultsFromSet(pts,nxt, wid,hei,maxDim, he.toArray()).result;
			var delY = Matrix.sub(result,currentResult);
			jacobian.setColFromCol(k, delY,0);
		}
		jacobian.scale(1.0/epsilon);
		// LM dx = f(jacobian,error,lambda)
		// h += dx
// dx
var jt = Matrix.transpose(jacobian);
var jj = Matrix.mult(jt,jacobian);
var L = new Matrix(jacobian.cols(),jacobian.cols()).identity();
L.scale(lambda);
var ji = Matrix.add(jj,L);
ji = Matrix.inverse(ji);
Jinv = Matrix.mult(ji,jt);
delta = Matrix.mult(Jinv, error);
// x += dx [?]
var potentialH = Matrix.add(h,delta); // putative
//console.log(potentialH.toArray()+" .........");
errorNext = this.cameraResultsFromSet(pts,nxt, wid,hei,maxDim, potentialH.toArray()).error.getNorm();
//console.log("=> "+errorNext);
		// check
		if(errorNext<errorPrev){
			Matrix.add(h, h,delta);
			lambda /= lambdaScale;
		}else{
			lambda *= lambdaScale;
		}
//console.log(h.toArray()+"  ");
	}
/*

*/


console.log("        => "+h.toArray());
xc = h.get(0,0);
yc = h.get(1,0);
k0 = h.get(2,0);
k1 = h.get(3,0);
k2 = h.get(4,0);
k3 = h.get(5,0);
p1 = h.get(6,0);
p2 = h.get(7,0);
	var recArr = Code.newArrayZeros(wid*hei);
matA.setFromArrayARGB(disArr);
	index = 0;
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i,++index){
			v = this.pointFromDistortion(wid,hei,maxDim, i,j, xc,yc, k0,k1,k2,k3,p1,p2);
			// INTERPOLATE
			matA.getPoint(col, v.x,v.y);
			recArr[index] = Code.getColARGBFromFloat(1.0,col.x,col.y,col.z);
			// NEAREST NEIGHBOR
			// X = Math.round(v.x);
			// Y = Math.round(v.y);
			// if(0<=X && X<wid  && 0<=Y && Y<hei){
			// 	ind = Y*wid + X;
			// 	recArr[index] = disArr[ind]; // INTERPOLATE
			// }else{
			// 	recArr[index] = 0xFF000000;
			// }
		}
	}

	img = this._stage.getARGBAsImage(recArr, wid,hei);
	img.setAttribute("style","z-index:9999999; position:relative; top:0; left:0; padding:0; margin:0; border:0;");
	document.body.appendChild(img);

	//d = new DOImage(img);
	//console.log(arr)
	// 
	
	// this._root.addChild(d);
	//
}
Manual3DR.prototype.cameraResultsFromSet = function(fr,to, wid,hei,sca, params){
	var xc = params[0];
	var yc = params[1];
	var k0 = params[2];
	var k1 = params[3];
	var k2 = params[4];
	var k3 = params[5];
	var p1 = params.length>4?params[6] : 0.0;
	var p2 = params.length>5?params[7] : 0.0;
// xc = 0;
// yc = 0;
	var u, v, w, dist;
	var error = new Matrix(fr.length*2,1);
	var result = new Matrix(fr.length*2,1);
	for(j=0;j<fr.length;++j){
		v = fr[j];
		u = to[j];
		w = this.pointFromDistortion(wid,hei,sca, u.x,u.y, xc,yc, k0,k1,k2,k3,p1,p2);
		// error.set(j*2+0,0, (w.x-w.x) );
		// error.set(j*2+1,0, (w.y-w.y) );
		error.set(j*2+0,0, (v.x-w.x) );
		error.set(j*2+1,0, (v.y-w.y) );
		//error.set(j*2+0,0, Math.pow(w.x-v.x,2) );
		//error.set(j*2+1,0, Math.pow(w.y-v.y,2) );
		result.set(j*2+0,0, w.x);
		result.set(j*2+1,0, w.y);
	}
	return {"error":error,"result":result};
}
Manual3DR.prototype.pointFromDistortion = function(wid,hei,sca, x,y, xc,yc, k0,k1,k2,k3,p1,p2){
	p1 = p1!==undefined?p1:0.0;
	p2 = p2!==undefined?p2:0.0;
	x = (x-wid/2)/sca;
	y = (y-hei/2)/sca;
	var xP = x + xc*0.5;
	var yP = y + yc*0.5;
	var x2 = xP*xP;
	var y2 = yP*yP;
	var r2 = xP*xP + yP*yP;
	var r4 = r2*r2;
	var r6 = r4*r2;
	//var r = Math.sqrt(r2);
	 // var X = x/(1.0 + k1*r2 + k2*r4 + k3*r6);// + 2*p1*x*y + p2*(r2 + 2*x2);
	 // var Y = y/(1.0 + k1*r2 + k2*r4 + k3*r6);// + 2*p1*x*y + p2*(r2 + 2*y2);
	var X = x*(1.0 + k1*r2 + k2*r4 + k3*r6);
	var Y = y*(1.0 + k1*r2 + k2*r4 + k3*r6);
	// var X = x*(1.0 + k1*r2 + k2*r4 + k3*r6) + 2*p1*x*y + p2*(r2 + 2*x2);
	// var Y = y*(1.0 + k1*r2 + k2*r4 + k3*r6) + 2*p1*x*y + p2*(r2 + 2*y2);
	X = wid/2 - (X*sca);
	Y = hei/2 - (Y*sca);
	return new V3D(X,Y);
}
Manual3DR.prototype.getVertexShaders1 = function(){
	return ["\
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
    	", // ^ colored triangles
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
		", // ^ textured triangles
		" \
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
		", // ^ lines
		" \
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_PointSize = 4.0; \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
		"]; // ^ points
}
Manual3DR.prototype.getFragmentShaders1 = function(){
    return ["\
		precision highp float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
		", // 
		"\
		precision mediump float; \
		varying vec2 vTextureCoord; \
		uniform sampler2D uSampler; \
		void main(void){ \
			gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); \
		} \
    	", // 
    	"\
		precision highp float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
		", // 
    	"\
		precision highp float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
    	"]; // 
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
Manual3DR.prototype.onMouseClickFxn3D = function(e){
return;
	var wid = 512;//texture.image.width;
	var hei = 512;//texture.image.height;
	var size = 4 * wid * hei;

	var gl = this._canvas3D.context();
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

//
	// CREATE TEXTURE TO HOLD RESULT
	var dataArray = Code.newArrayZeros(size); // 0 rgba array
var i;
for(i=0;i<size;++i){
	dataArray[i] = Math.floor(Math.random()*256.0);
}
	var dataTypedArray = new Uint8Array(dataArray);
	var dataType = gl.RGBA;
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, dataType, wid, hei, 0, dataType, gl.UNSIGNED_BYTE, dataTypedArray);
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, wid, hei, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	console.log(texture);

	// CREATE RENDER BUFFER
	console.log(gl)
	var renderBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, frameBuffer, wid, hei);

	// CREATE FRAME BUFFER TO HOLD CURRENT SCENE
	var frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

 	// RENDER
 	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);



console.log("RENDER HERE");
gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
this.render3DScene();
gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	// COPY OUT FRAME BUFFER INTO DATA CONTAINER
	var data = new Uint8Array(size);
	gl.readPixels(0,0, wid,hei, gl.RGBA, gl.UNSIGNED_BYTE, data);
	// gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.deleteFramebuffer(frameBuffer);

gl.bindRenderbuffer(gl.RENDERBUFFER, null);
//gl.deleteFramebuffer(renderBuffer);

gl.bindTexture(gl.TEXTURE_2D, null);
//gl.deleteTexture(texture);

// capturing a different rect than I think I am
	
	var i, j, index, inde2, temp, wo2=Math.floor(wid/2), ho2=Math.floor(hei/2);
	// // flip horizontal
	// for(j=0;j<hei;++j){
	// 	for(i=0;i<wo2;++i){
	// 		index = j*wid + i;
	// 		inde2 = j*wid + wid-1 - i;
	// 		temp = data[index]; 
	// 		data[index] = data[inde2];
	// 		data[inde2] = temp;
	// 	}
	// }
	// flip vertical
	for(j=0;j<ho2;++j){
		for(i=0;i<wid;++i){
			index = j*wid*4 + i*4;
			inde2 = (hei-1-j)*wid*4 + i*4;
			// R
			temp = data[index]; 
			data[index] = data[inde2];
			data[inde2] = temp;
			// G
			temp = data[index+1]; 
			data[index+1] = data[inde2+1];
			data[inde2+1] = temp;
			// B
			temp = data[index+2]; 
			data[index+2] = data[inde2+2];
			data[inde2+2] = temp;
			// A
			temp = data[index+3]; 
			data[index+3] = data[inde2+3];
			data[inde2+3] = temp;
		}
	}
	// 
	// var context = this._canvas.context();
	// var imageData = context.createImageData(wid,hei);
 //    imageData.data.set(data);
 //    context.putImageData(imageData, 0, 0);

 	// convert to usable array
	var argb = new Array();
	for(index=0;index<size;++index){
		argb[index] = Code.getColARGB(data[index*4+3],data[index*4+0],data[index*4+1],data[index*4+2]);
	}
	// convert to image
	var img = this._stage.getARGBAsImage(argb, wid,hei);
	document.body.appendChild(img);
	//img.style = "z-index:9999999; position:absolute; top:0; left:0; padding:0; margin:0; border:0;";
	img.setAttribute("style","z-index:9999999; position:absolute; top:0; left:0; padding:0; margin:0; border:0;");
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
if(i==0){
		this._root.addChild(d);
}
		d.matrix().translate(0,0);
	}
	var points3D = [];
	for(i=0;i<10;++i){
		for(j=0;j<8;++j){
			points3D.push( new V3D(i,j,1.0) );
		}
	}
	points0 = {	"pos2D": [new V2D(110,225), new V2D(133,224.8), new V2D(156,224.7), new V2D(180,224.5), new V2D(204,224.2), new V2D(230,224.2), new V2D(257,224.2), new V2D(283.5,224.2), new V2D(313,224.2), new V2D(343,224.5)],
				"pos3D": points3D
			};

	/*
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
	*/
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
	var points = points0;
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
this._resource.testImage0 = list[0];
this._resource.testImage1 = list[1];
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
				[new V3D(110,225, 1),
				new V3D(343,224.5, 1),
				new V3D(332,31, 1),
				new V3D(109.5,58, 1),
				new V3D(155.5,174.5, 1),
				new V3D(281.5,169.5, 1),
				new V3D(278,90, 1),
				new V3D(154,101, 1),
				new V3D(204,198.5, 1),
				new V3D(229,197.5, 1),
				new V3D(225,70, 1),
				new V3D(200,72, 1)],
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
				[new V3D(83,184, 1),
				new V3D(232,269.5, 1),
				new V3D(341,163.5, 1),
				new V3D(242,19, 1),
				new V3D(168,168.5, 1),
				new V3D(240.8,223.5, 1),
				new V3D(291,174, 1),
				new V3D(229.8,106, 1),
				new V3D(183,212, 1),
				new V3D(198,222.5, 1),
				new V3D(288.5,132.5, 1),
				new V3D(277,118, 1)],
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
				[new V3D(73.5,245.5, 1),
				new V3D(311.5,219, 1),
				new V3D(366,46.5, 1),
				new V3D(26,58, 1),
				new V3D(127,199, 1),
				new V3D(270.5,185.5, 1),
				new V3D(285,112.5, 1),
				new V3D(118,123, 1),
				new V3D(186,214.5, 1),
				new V3D(214,212, 1),
				new V3D(224,86, 1),
				new V3D(188.5,88, 1)],
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
	// straight up DLT - less accurate
	// H0 = R3D.projectiveDLT(points0.pos3D,points0.pos2D);
	// H1 = R3D.projectiveDLT(points1.pos3D,points1.pos2D);
	// H2 = R3D.projectiveDLT(points2.pos3D,points2.pos2D);

	// normalize points
// points0.norm = R3D.calculateNormalizedPoints([points0.pos2D,points0.pos3D]);
// points1.norm = R3D.calculateNormalizedPoints([points1.pos2D,points1.pos3D]);
// points2.norm = R3D.calculateNormalizedPoints([points2.pos2D,points2.pos3D]);
points0.norm = R3D.calculateNormalizedPoints([points0.pos3D,points0.pos2D]);
points1.norm = R3D.calculateNormalizedPoints([points1.pos3D,points1.pos2D]);
points2.norm = R3D.calculateNormalizedPoints([points2.pos3D,points2.pos2D]);
	H0 = R3D.projectiveDLT(points0.norm.normalized[0],points0.norm.normalized[1]);
	H1 = R3D.projectiveDLT(points1.norm.normalized[0],points1.norm.normalized[1]);
	H2 = R3D.projectiveDLT(points2.norm.normalized[0],points2.norm.normalized[1]);

	// Levenberg Marquardt nonlinear minimization goes here
	var fxn, args, yVals, xVals;
	fxn = this.lmMinProjectionFxn;
	// H0
	xVals = H0.toArray();
	args = [ points0.norm.normalized[0], points0.norm.normalized[1] ];
	yVals = Code.newArrayZeros(args[0].length*4);
	Matrix.lmMinimize( fxn, args, yVals.length,xVals.length, xVals, yVals );
	// H1
	xVals = H1.toArray();
	args = [ points1.norm.normalized[0], points1.norm.normalized[1] ];
	yVals = Code.newArrayZeros(args[0].length*4);
	Matrix.lmMinimize( fxn, args, yVals.length,xVals.length, xVals, yVals );
	// H2
	xVals = H2.toArray();
	args = [ points2.norm.normalized[0], points2.norm.normalized[1] ];
	yVals = Code.newArrayZeros(args[0].length*4);
	Matrix.lmMinimize( fxn, args, yVals.length,xVals.length, xVals, yVals );
	
	// unnormalize:
	var H, forward, reverse;
	// 0
	forward = points0.norm.forward[0];
	reverse = points0.norm.reverse[1];
	H = H0;
	H = Matrix.mult(H,forward);
	H = Matrix.mult(reverse,H);
	H0 = H;
	// 1
	forward = points1.norm.forward[0];
	reverse = points1.norm.reverse[1];
	H = H1;
	H = Matrix.mult(H,forward);
	H = Matrix.mult(reverse,H);
	H1 = H;
	// 2
	forward = points2.norm.forward[0];
	reverse = points2.norm.reverse[1];
	H = H2;
	H = Matrix.mult(H,forward);
	H = Matrix.mult(reverse,H);
	H2 = H;

	// arbitrary scale last element
	H0.scale(1.0/H0.get(2,2));
	H1.scale(1.0/H1.get(2,2));
	H2.scale(1.0/H2.get(2,2));



	var listH = [H0,H1,H2];
	var hCount = listH.length;
	// CONSTRUCT V:
	var V = new Matrix(2*hCount,6);//.setFromArrayMatrix(vArr);
	var h00, h01, h10, h11, h20, h21;
	for(i=0;i<hCount;++i){ // row,col: 0i*0j, 0i*1j + 1i*0j, 1i*1j, 2i*0j + 0i*2j, 2i*1j + 1i*2j, 2i*2j
		H = listH[i];
		h00 = H.get(0,0); // 0
		h01 = H.get(0,1); // 1
		h10 = H.get(1,0); // 3
		h11 = H.get(1,1); // 4
		h20 = H.get(2,0); // 6
		h21 = H.get(2,1); // 7
		// v01
		V.set(i*2+0,0, h00*h01 );
		V.set(i*2+0,1, h00*h11 + h10*h01 );
		V.set(i*2+0,2, h10*h11 );
		V.set(i*2+0,3, h20*h01 + h00*h21 );
		V.set(i*2+0,4, h20*h11 + h10*h21 );
		V.set(i*2+0,5, h20*h21 );
		// v00 - v11
		V.set(i*2+1,0, h00*h00 - h01*h01 );
		V.set(i*2+1,1, 2.0*(h00*h10 - h01*h11) );
		V.set(i*2+1,2, h10*h10 - h11*h11 );
		V.set(i*2+1,3, 2.0*(h20*h00 - h21*h01) );
 		V.set(i*2+1,4, 2.0*(h20*h10 - h21*h11) );
 		V.set(i*2+1,5, h20*h20 - h21*h21 );
// normalize row ? 
	}
	//console.log("V.toString()");
	//console.log(V.toString());
	// SVD: V * b = 0
	var svd = Matrix.SVD(V);
	var coeff = svd.V.colToArray(5);
	//console.log(coeff)
	var b00 = coeff[0];
	var b01 = coeff[1];
	var b11 = coeff[2];
	var b02 = coeff[3];
	var b12 = coeff[4];
	var b22 = coeff[5];
	// compute K properties - requirements: den1!=0, b00!=0, fy>0
		var ratio;
		var num1 = b01*b02 - b00*b12;
		var den1 = b00*b11 - b01*b01;
	var v0 = num1/den1;
	var lambda = b22 - ((b02*b02 + v0*num1)/b00);
		ratio = lambda/b00;
		if(ratio<0){
			ratio = Math.abs( ratio );
			console.log("bad ratio A");
		}
	var fx = Math.sqrt( ratio ); // Math.abs(
		ratio = (lambda*b00)/den1;
		if(ratio<0){
			ratio = Math.abs( ratio );
			console.log("bad ratio B");
		}
	var fy = Math.sqrt( ratio ); // Math.abs(
	var s = -b01*fx*fx*fy/lambda;
	var u0 = ((s*v0)/fx) - ((b02*fx*fx)/lambda);
	//console.log(lambda,b00,den1,fx,fy)
	// construct K
	var K = new Matrix(3,3).setFromArray([fx,s,u0, 0,fy,v0, 0,0,1]);
	console.log("K: ");
	console.log(K.toString());
	this._intrinsicK = K;

	// radial distortion time ....

	/*
	var sizeW = 400;
	var sizeH = 300;
	var cx = sizeW*0.5;
	var cy = sizeH*0.5;
	var s = 0;
	var fx = 480; // 300~500
	var fy = fx;
	var testK = (new Matrix(3,3).setFromArray([fx,s,cx, 0,fy,cy, 0,0,1]));
	// FOUND VALUES:
	fx = 372.76047221810444
	fy = 372.1358082506365
	s = -1.2121641660857738;
	cx = 200.2563459136281;
	cy = 146.6423388412101;

	// NEWEST VALUES:
	fx = 376.10038433315435
	fy = 376.7410755028418
	s  = -0.4399151157738108
	cx = 201.61665699519267
	cy = 152.26370698493383

	this._intrinsicK = testK;
	console.log("estimated example: ");
	console.log( testK.toString() );
	console.log("..........................................");
	*/
/*
* normalize image points: x,y in [-1,1] based on image width/height, image center is origin
* find homography between model points and image points
	* use DLT for initial points
	* use LM for refinement
	* scale homography to last element = 1
* find B
	* find V
	* SVD V*b=0
	* B = [b]
* find K
	* from B coefficients
	* correct K (if need to undo point normalization)

*/
}
Manual3DR.prototype.lmMinProjectionFxn = function(args, xMatrix,yMatrix,eMatrix){ // x:nx1, y:1xm, e:1xm
	var ptsFr = args[0];
	var ptsTo = args[1];
	var unknowns = 9;
	var fr, to, frB=new V3D(), toB=new V3D();
	var Hinv = new Matrix(3,3), H = new Matrix(3,3);
	var i, len = ptsFr.length;
	var rows = 2*2*len;
	// convert unknown list to matrix
	for(i=0;i<unknowns;++i){
		H.set( Math.floor(i/3),i%3, xMatrix.get(i,0) );
	}
	Hinv = Matrix.inverse(H);
	// find forward / reverse transforms
 	for(i=0;i<len;++i){
		fr = ptsFr[i];
		to = ptsTo[i];
		H.multV3DtoV3D(toB,fr);
		Hinv.multV3DtoV3D(frB,to);
		frB.homo();
		toB.homo();
 		if(yMatrix){
 			yMatrix.set(i*4+0,0, frB.x);
 			yMatrix.set(i*4+1,0, frB.y);
 			yMatrix.set(i*4+2,0, toB.x);
 			yMatrix.set(i*4+3,0, toB.y);
 		}
 		if(eMatrix){
 			eMatrix.set(i*4+0,0, Math.pow(frB.x-fr.x,2) );
 			eMatrix.set(i*4+1,0, Math.pow(frB.y-fr.y,2) );
 			eMatrix.set(i*4+2,0, Math.pow(toB.x-to.x,2) );
 			eMatrix.set(i*4+3,0, Math.pow(toB.y-to.y,2) );
 		}
 	}
}
// var v01 = Manual3DR.vRowFromCols(h_0_0,h_0_1,h_0_2, h_1_0,h_1_1,h_1_2);
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
	var Kinv = Matrix.inverse(K);
	var Kt = Matrix.transpose(K);
	// console.log("K")
	// console.log(K.toString())
	// console.log("K^-1")
	// console.log(Kinv.toString())

	// calculate essential matrix
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
	// console.log("t:");
	// console.log(t.toString())
	// console.log(tNeg.toString())

	// one of 4 possible solutions
	var possibleA = Matrix.mult(U,Matrix.mult(W,Vt));
	possibleA = possibleA.appendColFromArray(t.toArray()   ).appendRowFromArray([0,0,0,1]);
	var possibleB = Matrix.mult(U,Matrix.mult(W,Vt));
	possibleB = possibleB.appendColFromArray(tNeg.toArray()).appendRowFromArray([0,0,0,1]);
	var possibleC = Matrix.mult(U,Matrix.mult(Wt,Vt));
	possibleC = possibleC.appendColFromArray(t.toArray()   ).appendRowFromArray([0,0,0,1]);
	var possibleD = Matrix.mult(U,Matrix.mult(Wt,Vt));
	possibleD = possibleD.appendColFromArray(tNeg.toArray()).appendRowFromArray([0,0,0,1]);
	var possibles = new Array();
	possibles.push( possibleA );
	possibles.push( possibleB );
	possibles.push( possibleC );
	possibles.push( possibleD );
	var det;
	for(i=0;i<possibles.length;++i){
		var m = possibles[i];
		det = m.det();
		if(det<0){
			//console.log("FLIP "+i+" : "+det);
			m.scale(-1.0);
		}
	}

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
		P2 = Matrix.mult(M2,P2);
		//console.log(P2.toString());
		var p2Norm = new V4D().setFromArray(P2.toArray());
		//console.log(p2Norm.toString());
		p2Norm.homo();
		//console.log(p1Norm.z+" && "+p2Norm.z);
		if(p1Norm.z>0 && p2Norm.z>0){
			//console.log(".......................>>XXX");
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
Manual3DR.prototype.addCameraVisual = function(matrix, textureUVPoints, textureVertPoints){ // point/direction
	var K = this._intrinsicK;
	console.log(K.toString());
	var fx = K.get(0,0);
	var fy = K.get(1,1);
	var sk = K.get(0,1); // = tan(y-axis-to-x-axis) * fy
	var cx = K.get(0,2);
	var cy = K.get(1,2);
	var imageWidth = 400;
	var imageHeight = 300;
	// 
	var focalLength = 0.00001; // scales universe?
	var px = focalLength/fx;
	var py = focalLength/fy;
	var imgSizeX = px*imageWidth;
	var imgSizeY = py*imageHeight;
	var imgCenX = px*cx;
	var imgCenY = py*cy;
	console.log("params: ",fx,fy,sk,cx,cy)
	console.log("px: "+px+"  py: "+py);
	console.log("size: "+imgSizeX+" x "+imgSizeY);
 	console.log("center: "+imgCenX+","+imgCenY);

 	// calculate physical size
 	var camOrigin = new V3D(0,0,0);
 	var camCenter = new V3D(0,0,focalLength);
 	var camScreenX = new V3D(imgSizeX,0,0);
 	var camScreenY = new V3D(0,-imgSizeY,0);
 	var camScreenTL = new V3D(-imgCenX,imgCenY,focalLength);
 	var camScreenTR = V3D.add(camScreenTL,camScreenX);
 	var camScreenBL = V3D.add(camScreenTL,camScreenY);
 	var camScreenBR = V3D.add(camScreenTR,camScreenY);
 	var imgScreenDistance = 2.2;
 	var imgCamRatio = imgScreenDistance/focalLength;
 	var imgScreenTL = V3D.scale(camScreenTL,imgCamRatio);
 	var imgScreenTR = V3D.scale(camScreenTR,imgCamRatio);
 	var imgScreenBL = V3D.scale(camScreenBL,imgCamRatio);
 	var imgScreenBR = V3D.scale(camScreenBR,imgCamRatio);

	//...
	var pointsL = this._renderPointsList;
	var colorsL = this._renderColorsList;
	var linePoints = this._renderLinePointsList;//[0,0, 5,5];
	var lineColors = this._renderLineColorsList;//[0.5,0,0,1, 0.5,0,0,1];
		// do stuff
	this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._vertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
	// 
	var i, j, len, tri, col;
	var c = [];
	var t = [];
	var lp = [];
	var lc = [];
	var tVert = [];
	var tUV = [];
	c.push(0xFFFF0000);
	t.push(Tri3D.fromPoints(camOrigin, camScreenBR, camScreenBL ));
	c.push(0xFF00CC00);
	t.push(Tri3D.fromPoints(camOrigin, camScreenTR, camScreenBR ));
	c.push(0xFF0000FF);
	t.push(Tri3D.fromPoints(camOrigin, camScreenTL, camScreenTR ));
	c.push(0xFFFFCC00);
	t.push(Tri3D.fromPoints(camOrigin, camScreenBL, camScreenTL ));
	c.push(0xFFCCCCCC);
	t.push(Tri3D.fromPoints(camScreenBR, camScreenTR, camScreenTL ));
	c.push(0xFF999999);
	t.push(Tri3D.fromPoints(camScreenBR, camScreenTL, camScreenBL ));
	// lines
	lp.push(new V3D(0,0,0), new V3D(0,0,10));
	lc.push(0xFF990000, 0xFF990000);
	// textures
	tVert.push(Tri3D.fromPoints(imgScreenBR, imgScreenTR, imgScreenTL ));
	tVert.push(Tri3D.fromPoints(imgScreenBR, imgScreenTL, imgScreenBL ));
var textureWidth = 512.0;
var textureHeight = 512.0;
var endX = imageWidth/textureWidth;
var endY = 1.0 - imageHeight/textureHeight;
var texTL = new V3D(0.0,  1.0, 0);
var texTR = new V3D(endX, 1.0, 0);
var texBL = new V3D(0.0,  endY, 0);
var texBR = new V3D(endX, endY, 0);
	// tUV.push(Tri.fromPoints(texBR, texTR, texTL));
	// tUV.push(Tri.fromPoints(texBR, texTL, texBL));
	// flip left and right to be facing camera
	tUV.push(Tri3D.fromPoints(texBL, texTL, texTR));
	tUV.push(Tri3D.fromPoints(texBL, texTR, texBR));

var v;
	len = c.length;
	for(i=0;i<len;++i){
		col = c[i];
		tri = t[i];
		v = matrix.multV3DtoV3D(new V3D(),tri.A());
		pointsL.push(v.x,v.y,v.z);
		v = matrix.multV3DtoV3D(new V3D(),tri.B());
		pointsL.push(v.x,v.y,v.z);
		v = matrix.multV3DtoV3D(new V3D(),tri.C());
		pointsL.push(v.x,v.y,v.z);
		for(j=0;j<3;++j){
			colorsL.push( Code.getFloatRedARGB(col),Code.getFloatGrnARGB(col),Code.getFloatBluARGB(col),Code.getFloatAlpARGB(col) );
		}
	}
	//

var lineDist = 10.0;
if(this._booleanCam){ // 2 // = test image 0
	lp.push(new V3D(0,0,0), new V3D(-.09,.178,1).scale(lineDist));
	lc.push(0xFF00CC00, 0xFF00CC00);
	// lp.push(new V3D(0,0,0), new V3D(.09,.188,1).scale(lineDist));
	// lc.push(0xFF00CC00, 0xFF0000CC);
}else{ // 1  // = test image 1
	this._booleanCam = true;
	lp.push(new V3D(0,0,0), new V3D(-.265,.20,1).scale(lineDist));
	lc.push(0xFF00CC00, 0xFF00CC00);
	// lp.push(new V3D(0,0,0), new V3D(.265,.21,1).scale(lineDist));
	// lc.push(0xFF00CC00, 0xFF0000CC);
}
	//
	len = lp.length;
	for(i=0;i<len;++i){
		col = lc[i];
		v = lp[i];
		v = matrix.multV3DtoV3D(v,v);
		linePoints.push(v.x,v.y,v.z);
		lineColors.push( Code.getFloatRedARGB(col),Code.getFloatGrnARGB(col),Code.getFloatBluARGB(col),Code.getFloatAlpARGB(col) );
	}
	
	len = tVert.length;
	for(i=0;i<len;++i){
		tri = tVert[i];
		v = new V3D();
		v = matrix.multV3DtoV3D(new V3D(),tri.A());
		textureVertPoints.push(v.x,v.y,v.z);
		v = matrix.multV3DtoV3D(new V3D(),tri.B());
		textureVertPoints.push(v.x,v.y,v.z);
		v = matrix.multV3DtoV3D(new V3D(),tri.C());
		textureVertPoints.push(v.x,v.y,v.z);
		tri = tUV[i];
		v = tri.A();
		textureUVPoints.push(v.x,v.y);
		v = tri.B();
		textureUVPoints.push(v.x,v.y);
		v = tri.C();
		textureUVPoints.push(v.x,v.y);
	}
	
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
/*
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
// RENDER TEXTURES
	for(i=0;i<this._textureUVPoints.length;++i){
		this._stage3D.bindArrayFloatBuffer(this._textureCoordAttrib, this._textureUVPoints[i]);
		this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._textureVertexPoints[i]);

		this._canvas3D._context.activeTexture(this._canvas3D._context.TEXTURE0);
		this._canvas3D._context.bindTexture(this._canvas3D._context.TEXTURE_2D,this._textures[i]);
		this._canvas3D._context.uniform1i(this._canvas3D._program.samplerUniform, 0); // 
		this._stage3D.drawTriangles(this._vertexPositionAttrib, this._textureVertexPoints[i]);
	}
//
*/
// RENDER LINES
this._stage3D.selectProgram(2);
this._stage3D.disableCulling();
this._stage3D.matrixReset();

this._stage3D.bindArrayFloatBuffer(this._programLineVertexPositionAttrib, this._programLinePoints);
this._stage3D.bindArrayFloatBuffer(this._programLineVertexColorAttrib, this._programLineColors);
this._stage3D.drawLines(this._programLineVertexPositionAttrib, this._programLinePoints);


// RENDER POINTS

	this._stage3D.bindArrayFloatBuffer(this._pointVertexPositionAttrib, this._pointPointBuffer);
	this._stage3D.bindArrayFloatBuffer(this._pointVertexColorAttrib, this._pointColorBuffer);
	this._stage3D.drawPoints(this._pointVertexPositionAttrib, this._pointPointBuffer);

//this._stage3D.matrixReset();
	}else{
this._stage3D.selectProgram(0);
this._renderPointsList = [];
this._renderColorsList = [];
this._renderLinePointsList = [];
this._renderLineColorsList = [];
// TEXTURES
this._textureUVPoints = [];
this._textureVertexPoints = [];
this._renderTextureUVList = [];
this._renderTexturePointList = [];
this._textures = [];
		// do stuff
var matrix = new Matrix(4,4);

var i, len = this._cameras.length;
/*
var m = new Matrix3D();
m.identity();
this._cameras[0]["extrinsic"] = Matrix3D.matrixFromMatrix3D(m);//(new Matrix(4,4)).identity();
//console.log(this._cameras[0]["extrinsic"])
m.identity();
m.rotateVector(new V3D(0,1,0).norm(), Math.PI*0.25);
this._cameras[1]["extrinsic"] = Matrix3D.matrixFromMatrix3D(m);//Matrix.transform3DRotateX( Matrix.transform3DTranslate((new Matrix(4,4)).identity(), 0,1,0), Math.PI*0.25);
//console.log(this._cameras[1]["extrinsic"].toString())
*/
for(i=0;i<len;++i){
	// seperate texture lists:
	this._renderTextureUVList[i] = [];
	this._renderTexturePointList[i] = [];
	//
	var camera = this._cameras[i];
	matrix.copy(camera["extrinsic"]);
	this.addCameraVisual(matrix, this._renderTextureUVList[i], this._renderTexturePointList[i]);
}
		// done
		this._planeTriangleVertexList = this._stage3D.getBufferFloat32Array(this._renderPointsList,3);
		this._planeTriangleColorsList = this._stage3D.getBufferFloat32Array(this._renderColorsList,4);
		console.log(this._planeTriangleVertexList)
		console.log(this._planeTriangleColorsList)




//this._planeTriangleVertexList = 1
// TEXTURES
this._stage3D.selectProgram(1);

		var texture;
		var program = this._canvas3D._program;
		var gl = this._canvas3D._context;
// 0
texture = this._resource.testImage0;
var obj = this.textureBase2FromImage(texture);
texture = obj["texture"];
var horz = obj["width"];
var vert = obj["height"];
this._textures[1] = this._canvas3D.bindTextureImageRGBA(texture);

// 1
texture = this._resource.testImage1;
var obj = this.textureBase2FromImage(texture);
texture = obj["texture"];
var horz = obj["width"];
var vert = obj["height"];
this._textures[0] = this._canvas3D.bindTextureImageRGBA(texture);


		// get
		this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
		this._textureCoordAttrib = this._stage3D.enableVertexAttribute("aTextureCoord");
		for(i=0;i<len;++i){
			var texturePoints = this._renderTextureUVList[i];
			var vertexPoints = this._renderTexturePointList[i];
			// set
			this._textureUVPoints[i] = this._stage3D.getBufferFloat32Array(texturePoints, 2);
			this._textureVertexPoints[i] = this._stage3D.getBufferFloat32Array(vertexPoints, 3);
		}
		// test image in middle:
		// texturePoints.push(0,vert, horz,vert, 0,1,        horz,vert, horz,1, 0,1);
		// vertexPoints.push(0,-1,0, 3,-1,0, 0,1,0,  3,-1,0, 3,1,0, 0,1,0);


// POINTS
	this._stage3D.selectProgram(3);
	//
// FROM FEATURE TEST:
// var pts = [];
// pts.push(new V3D(0.00021865275694261103,0.0001256177281193294,0.000001193698305866805));
// pts.push(new V3D(0.0005512399446526004,0.00020640058745192006,0.000002838623020322149));
// pts.push(new V3D(0.0015198909488643077,0.0004484373560545133,0.0000076159091146978815));
// pts.push(new V3D(0.000043421931566463865,0.0001466455909956091,7.738822769630756e-7));
// pts.push(new V3D(0.0000543114688800255,0.00013840491496055772,7.437535155155142e-7));
// pts.push(new V3D(0.000018443791892490515,0.0001386803999344225,8.326332483210025e-7));
// pts.push(new V3D(0.0004867088006893692,0.00020439112938357184,0.0000030639758595871865));
// pts.push(new V3D(0.0004684068439574385,0.00021092153092282308,0.000003548179623871538));
// pts.push(new V3D(0.00022355251761197684,0.00011739786874813588,0.0000010599646583340864));
// pts.push(new V3D(0.00001684017727136176,0.00019863381255558101,8.001914394864113e-7));
// pts.push(new V3D(0.00010658292192119984,0.00009158338177763248,5.916374067133575e-7));


var pts = [];
pts.push(new V3D(181.7759595488257,115.83608626335102,1.0143299751656232));
pts.push(new V3D(505.7469742557165,199.83124534500917,2.594420986932873));
pts.push(new V3D(2167.6016842233757,664.7767195285846,10.825436865195607));
pts.push(new V3D(31.187604547172377,120.51425103118922,0.605587972991312));
pts.push(new V3D(39.22436444209934,123.08876229339911,0.6075745009828019));
pts.push(new V3D(12.456197662831286,102.6941289986451,0.617957851623479));
pts.push(new V3D(445.2029503961679,195.84746142517486,2.823146853210107));
pts.push(new V3D(418.64962874179673,197.18623283863897,3.1881867141571556));
pts.push(new V3D(185.85499406083707,109.62286567142947,0.9010190866671728));
pts.push(new V3D(10.688332275338434,148.06807708139075,0.589085983354743));
pts.push(new V3D(82.95328711861026,107.46232528106832,0.5495820768769595));
pts.push(new V3D(2017.3278491245323,649.2921375217761,11.594563394424792));
pts.push(new V3D(244.74442380953568,136.4191174424548,1.4969789280905532));
pts.push(new V3D(147.60986318643526,117.47043945656532,1.092458391025811));
pts.push(new V3D(894.8404744645912,339.6406435786824,6.306870270634655));
pts.push(new V3D(197.99996483393767,129.97761843291116,1.4476753441129435));
pts.push(new V3D(303.68612020016604,159.754339361098,2.1797153589879077));
pts.push(new V3D(260.87733075780915,143.79496980598387,1.7108730704311286));
pts.push(new V3D(1241.805865411691,435.6391395412944,7.963382839814098));

var prs = [];
prs.push( [11, 12] ); 
prs.push( [14, 15] ); 
prs.push( [11, 14] ); 
prs.push( [12, 15] ); 






	//
	var p, i, u, v;
	var points = [];
	var colors = [];
console.log(pts)
	for(i=0;i<pts.length;++i){
		//p = new V3D(Math.random(),Math.random(),Math.random());
		p = pts[i];
//p.homo(); // doesn't make sense to make all z values = 1
		// p.scale(1.0E4);
		// p.z *= 200;
		p.scale(1.0E-2);
		p.z *= 100;
		console.log(p.x,p.y,p.z)
		points.push(p.x,p.y,p.z);
		//colors.push(Math.random(),Math.random(),Math.random(),1.0);
		colors.push(1.0,Math.random()*0.5,0.0,1.0);
	}

	this._pointVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._pointVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");

	this._pointPointBuffer = this._stage3D.getBufferFloat32Array(points,3);
	this._pointColorBuffer = this._stage3D.getBufferFloat32Array(colors,4);


	// line point-pairs

	var linPnt = this._renderLinePointsList;
	var linCol = this._renderLineColorsList;
 console.log(linPnt);
// console.log(linCol);
// console.log(prs)


	for(i=0; i<prs.length; ++i){
		p = prs[i];
		u = pts[ p[0] ];
		v = pts[ p[1] ];
		linPnt.push( u.x,u.y,u.z );
		linPnt.push( v.x,v.y,v.z );
		linCol.push(0.0,0.0,1.0,1.0);
		linCol.push(1.0,0.0,1.0,1.0);
	}




		// LINES
		this._stage3D.selectProgram(2);
		this._programLineVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
		this._programLineVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
		// ....
		// END OF LINES:
console.log("LENGTH: "+this._renderLinePointsList.length);
		this._programLinePoints = this._stage3D.getBufferFloat32Array(this._renderLinePointsList, 3);
		this._programLineColors = this._stage3D.getBufferFloat32Array(this._renderLineColorsList, 4);


} // if 0

	// put cameras in 3D world
	// put projected images in 2D world
	// 3D world mouse/keyboard navigation



}

Manual3DR.prototype.textureBase2FromImage = function(texture){
	var obj = new DOImage(texture);
	this._root.addChild(obj);
	var wid = texture.width;
	var hei = texture.height;
	var origWid = wid;
	var origHei = hei;
	wid = Math.pow(2.0, Math.ceil(Math.log(wid)/Math.log(2.0)) );
	hei = Math.pow(2.0, Math.ceil(Math.log(hei)/Math.log(2.0)) );
	wid = Math.max(wid,hei);
	hei = wid;
	var origWid = origWid/wid;
	var origHei = origHei/hei;
	texture = this._stage.renderImage(wid,hei,obj, null);
	obj.removeParent();
	var vert = 1-origHei;
	var horz = origWid;
	return {"texture":texture,"width":horz,"height":vert};
}
Manual3DR.prototype.handleEnterFrame = function(e){ // 2D canvas
	//console.log(e);
}




