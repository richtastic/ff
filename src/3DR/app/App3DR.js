// App3DR.js

function App3DR(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false, true);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);

	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._handleMouseClickFxn,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_DOWN,this._handleMouseDownFxn,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_UP,this._handleMouseUpFxn,this);

		this._canvas.addFunction(Canvas.EVENT_MOUSE_EXIT,this._handleMouseUpFxn,this);
		// this._canvas.addFunction(Canvas.EVENT_MOUSE_DOWN_OUTSIDE,this._handleMouseUpFxn,this);
		// this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,this._handleMouseUpFxn,this);
		// this._canvas.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,this._handleMouseUpFxn,this);
//Canvas.EVENT_MOUSE_CLICK_OUTSIDE = "canevtmouclkout";
	this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this._handleMouseMoveFxn,this);

	//this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._handleMouseClickFxn,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_START,this._handleMouseDownFxn,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_END,this._handleMouseUpFxn,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_MOVE,this._handleMouseMoveFxn,this);

	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this._handleCanvasResizeFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this._handleEnterFrameFxn,this);
	this._keyboard = new Keyboard();


	this._longPressTime = 500;
	this._longPressTicker = new Ticker(this._longPressTime);
	this._longPressTicker.addFunction(Ticker.EVENT_TICK, this._longPressTrigger, this);


	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this._handleKeyboardUp,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);

	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
//	this.generate();

GLOBALSTAGE = this._stage;

	var self = this;
	var readyFxn = function(){
		self.continueStartup();
	}
	this._projectManager = new App3DR.ProjectManager("/projects/0", this._stage, readyFxn);

}


App3DR.prototype.continueStartup = function(){

	var projectManager = this._projectManager;

	var fxn = function(){
		console.log("resources loaded");
	}
	var resource = new App3DR.Resource(fxn);
	resource.load();

	this._resource = resource;

	// this._projectManager
	// this._activeView = this._projectManager.views()[0];
	// console.log(this._activeView);

// var modeImageEdit = true;
var modeImageEdit = false;

// var modeImageUpload = true; //  uploadImageTypeCamera
var modeImageUpload = false;
	// var modeImageUploadCamera = true;
	var modeImageUploadCamera = false;

// var modeImageCompare = true;
var modeImageCompare = false;


var modeModelReconstruction = false;
//var modeModelReconstruction = true;




// don't A:
// TO SWITCH ON MODELING:
// modeModelReconstruction = true;





	var url = Code.getURL();
	console.log(url);
	var datum = Code.parseURL(url);
	console.log(datum);
	var params = datum["parameters"];

	var mode = params["mode"];

	if(mode!==undefined && mode!==null){
		if(mode=="model"){
			console.log("display model");
			modeModelReconstruction = true;
		}else if(mode=="image"){
			console.log("upload view image");
			modeImageUpload = true;
			modeImageUploadCamera = false;
		}else if(mode=="camera"){
			console.log("upload camera image");
			modeImageUpload = true;
			modeImageUploadCamera = true;
		}
	}




if(modeImageEdit){
	var app = new App3DR.App.ImageEditor(this._resource);
	this.setupAppActive(app);
	app.addFunction(App3DR.App.ImageEditor.EVENT_MASK_UPDATE, this._handleImageEditorMaskUpdate, this);
	this._setupImageEditorProjectManager();
}

if(modeImageUpload){
	var app = new App3DR.App.ImageUploader(this._resource, this._projectManager);
	this.setupAppActive(app);
	this._uploadAdapter = new App3DR.App.UploadAdapterToPictures(this._projectManager, this._stage);
this._uploadAdapter.uploadImageTypeCamera = modeImageUploadCamera;
	app.addFunction(App3DR.App.ImageUploader.EVENT_FILE_ADDED, this._handleImageUploaderFileReady, this);
	this._setupImageUploaderProjectManager();
}

//modeImageCompare = false;
if(modeImageCompare){
	var app = new App3DR.App.MatchCompare(this._resource);
	this.setupAppActive(app);
	// app.addFunction(App3DR.App.ImageEditor.EVENT_MASK_UPDATE, this._handleImageEditorMaskUpdate, this);
	this._setupMatchCompareProjectManager();
}
if(modeModelReconstruction){
	var app = new App3DR.App.Model3D(this._resource);
	this.setupAppActive(app);
	//app.addFunction(App3DR.App.ImageEditor.EVENT_MASK_UPDATE, this._handleImageEditorMaskUpdate, this);
	this._setupModel3DProjectManager(this._projectManager);
}







	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._keyboard.addListeners();


	if(!Code.isa(this._activeApp, App3DR.App.Model3D)){
		this._projectManager.startBackgroundTasks();
	}else{
		console.log("no BG tasks during modeling");
	}



//this.testCams();




/*
var d = new DO();
this._root.addChild(d);
	var gr = d.graphics();
	gr.clear();
	gr.setFill(0x55FF0077);
	gr.setLine(2.0, 0xCCCC0000);
	gr.beginPath();
	gr.drawRect(50,50, 50,60);
	gr.endPath();
	gr.fill();
	gr.strokeLine();
*/


return;


	this._displayBG = new DO();
	this._displayMenu = new DO();
	this._root.addChild(this._displayBG);
	this._root.addChild(this._displayMenu);
	//GLOBALSTAGE = this._stage;

	var grid = new HexSystem(this._displayMenu);
	this._grid = grid;

	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._keyboard.addListeners();

	// var imageLoader = new ImageLoader("./images/",["background.png"], this,this._handleBackgroundImagesLoaded,null);
	// imageLoader.load();

	// mouse stuff
	this._mouseDown = false;
}




App3DR.prototype.testCams = function(){

// camera points in -z direction
// cam AtoB = camB * inv(camA)
// original p3d = inv(camA) * estimated-p3d(in AtoB)
// 	cameras are 'opposite' of their function, are forward of point translation

	var points3D = [];
	// make a cube
	points3D.push(new V3D(-1,-1,-1));
	points3D.push(new V3D( 1,-1,-1));
	points3D.push(new V3D(-1, 1,-1));
	points3D.push(new V3D( 1, 1,-1));
	points3D.push(new V3D(-1,-1, 1));
	points3D.push(new V3D( 1,-1, 1));
	points3D.push(new V3D(-1, 1, 1));
	points3D.push(new V3D( 1, 1, 1));

	points3D.push(new V3D(0,0,0));

	points3D.push(new V3D(0,1,0));
	points3D.push(new V3D(0,2,0));
	points3D.push(new V3D(0,3,0));
	points3D.push(new V3D(0,4,0));

	points3D.push(new V3D(1,0,0));
	points3D.push(new V3D(2,0,0));
	points3D.push(new V3D(3,0,0));
	points3D.push(new V3D(4,0,0));

	// + z
	points3D.push(new V3D(0,0,1));
	points3D.push(new V3D(0,0,2));
	points3D.push(new V3D(0,0,3));
	points3D.push(new V3D(0,0,4));
	points3D.push(new V3D(0,0,5));
	points3D.push(new V3D(0,0,6));

	// circle XY
	var circleCount = 100;
	var circleMag = 1.5;
	for(var i=0; i<circleCount; ++i){
		var p = i/(circleCount);
		var x = circleMag * Math.cos(p*2*Math.PI);
		var y = circleMag * Math.sin(p*2*Math.PI);
		var point = new V3D(x,y,0);
		points3D.push(point);
	}

	// circle xz
	var circleCount = 100;
	var circleMag = 1.5;
	for(var i=0; i<circleCount; ++i){
		var p = i/(circleCount);
		var x = circleMag * Math.cos(p*2*Math.PI);
		var y = circleMag * Math.sin(p*2*Math.PI);
		var point = new V3D(x,0,y);
		points3D.push(point);
	}

	// make a camera - intrinsic
	var imageWidth = 300;
	var imageHeight = 200;
	var fx = 100;
	var fy = 100;
	var cx = imageWidth*0.5;
	var cy = imageHeight*0.5;
	var  s = 0;
	var K = new Matrix(3,3);
	K.identity();
	K.set(0,0, fx);
	K.set(1,1, fy);
	K.set(0,2, cx);
	K.set(1,2, cy);
	K.set(0,1,  s);
	var Kinv = Matrix.inverse(K);
	//console.log("K: \n"+K);

	// position camera - extrinsic
	var camIdentity = new Matrix(4,4);
	camIdentity.identity();

	var camA = new Matrix(4,4);
	camA.identity();
		camA = Matrix.transform3DRotateY(camA, Code.radians(45));
		//camA = Matrix.transform3DRotateY(camA, Code.radians(0));
		//camA = Matrix.transform3DRotateX(camA, Code.radians(-10));
		camA = Matrix.transform3DTranslate(camA, 0,1,3);
	var camB = new Matrix(4,4);
	camB.identity();
		camB = Matrix.transform3DRotateY(camB, Code.radians(15));
		camB = Matrix.transform3DRotateX(camB, Code.radians(15));
		camB = Matrix.transform3DTranslate(camB, -1,0,2);
	// var camInvA = R3D.inverseCameraMatrix(camA);
	// var camInvB = R3D.inverseCameraMatrix(camB);
	var camInvA = Matrix.inverse(camA);
	var camInvB = Matrix.inverse(camB);


	var camAtoB = Matrix.mult(camB,camInvA); // YES



// 	var o = new V3D(0,0,0);
// 	var x = new V3D(1,0,0);
// 	var o2 = camAtoB.multV3DtoV3D(new V3D(), o);
// 	var x2 = camAtoB.multV3DtoV3D(new V3D(), x);
// 	console.log(o2+"");
// 	console.log(x2+"");
// 	var dx = V3D.sub(x2,o2);
// 	console.log(dx+" = "+dx.length());
// return;

	// ...

	var camAtoBInv = R3D.inverseCameraMatrix(camAtoB);

	console.log("A: \n"+camA+"");
	console.log("B: \n"+camB+"");
	console.log("I: \n"+camIdentity+"");
	console.log("AB: \n"+camAtoB+"");

	// project points to screen
	var projected2DA = [];
	var projected2DB = [];
	var errored2DA = [];
	var errored2DB = [];
	var errorPixels = 1.0; //1; //1.0;
	//var errorPixels = 0.1;
	var min = -0.5 * errorPixels;
	var max =  0.5 * errorPixels;
	var keep3D = [];
	for(var i=0; i<points3D.length; ++i){
		var p3D = points3D[i];
		// YES
		var p2DA = R3D.projectPoint3DToCamera2DForward(p3D, camA, K, null, true);
		var p2DB = R3D.projectPoint3DToCamera2DForward(p3D, camB, K, null, true);

		// var p2DA = R3D.projectPoint3DToCamera2DForward(p3D, camIdentity, K, null, true);
		// var p2DB = R3D.projectPoint3DToCamera2DForward(p3D, camAtoB, K, null, true);
		//console.log(p3D+" & "+p2DA+" | "+p2DB);
		if(!p2DA || !p2DB){
			continue;
		}
		var insideA = 0<p2DA.x && p2DA.x<imageWidth && 0<p2DA.y && p2DA.y<imageHeight;
		var insideB = 0<p2DB.x && p2DB.x<imageWidth && 0<p2DB.y && p2DB.y<imageHeight;
		if(!insideA || !insideB){
			continue;
		}
		keep3D.push(p3D);
		projected2DA.push(p2DA);
		projected2DB.push(p2DB);
		var e2DA = p2DA.copy();
		var e2DB = p2DB.copy();
		e2DA.add(new V2D( Code.randomFloat(min,max) ));
		e2DB.add(new V2D( Code.randomFloat(min,max) ));
		errored2DA.push(e2DA);
		errored2DB.push(e2DB);
	}
	points3D = keep3D;

	// get an F
	var F = null;
	F = R3D.fundamentalFromUnnormalized(errored2DA,errored2DB);
	// F = R3D.fundamentalFromUnnormalized(errored2DB,errored2DA);
	console.log("F:\n"+F);
	// F = R3D.fundamentalMatrixNonlinear(F,errored2DA,errored2DB);
	// console.log("F:\n"+F);

	// get a P
	// console.log(errored2DA);
	// console.log(errored2DB);
	var P = null;
	var force = true;
	//var force = false;
	// REVERSED: ?
	//P = R3D.transformFromFundamental(errored2DB, errored2DA, F, K, K, null, force);
	P = R3D.transformFromFundamental2(errored2DA, errored2DB, F, K, K, null, force);
	// P = R3D.inverseCameraMatrix(P);
	console.log("P:\n"+P);
//throw "?";
camAtoB = P;
		var P0 = new Matrix(4,4).identity();
		for(var i=0; i<1; ++i){
			var p3D = R3D.triangulationDLT(errored2DA,errored2DB, P0,P, K, K);
			P = R3D.cameraExtrinsicMatrixFromInitial(errored2DA, errored2DB, p3D, P, F, K, K);
		}
	//console.log("P:\n"+P);



// TEST
// var scaleToNormal = 1.0/0.6443050094821295;
// camAtoB = Matrix.transform3DScale(camAtoB, scaleToNormal);
console.log("camAtoB:\n"+camAtoB);
	// estimate 3D points from errored pixels:
	// var estimated3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
	var estimated3D = [];
	var reprojected2DA = [];
	var reprojected2DB = [];
	for(var i=0; i<projected2DA.length; ++i){
		// actual
		var pA2D = projected2DA[i];
		var pB2D = projected2DB[i];
		// estimated
			pA2D = errored2DA[i];
			pB2D = errored2DB[i];
		// var p3D = R3D.triangulatePointDLT(pA2D,pB2D, camA,camB, Kinv, Kinv); // OK

		var p3D = R3D.triangulatePointDLT(pA2D,pB2D, camIdentity,camAtoB, Kinv, Kinv); // A TO B 1

//		console.log("triangulated: "+p3D);
		estimated3D.push(p3D);

		// reprojection
		var p2DA = R3D.projectPoint3DToCamera2DForward(p3D, camIdentity, K, null, true);
		var p2DB = R3D.projectPoint3DToCamera2DForward(p3D, camAtoB, K, null, true); // A TO B !
		reprojected2DA.push(pA2D);
		reprojected2DB.push(pB2D);
	}
	// REPROJECTION ERROR
	var errorsA = [];
	var errorsB = [];
	var errors = [];
	for(var i=0; i<reprojected2DA.length; ++i){
		var p2DA1 = projected2DA[i];
		var p2DB1 = projected2DB[i];
		var p2DA2 = reprojected2DA[i];
		var p2DB2 = reprojected2DB[i];
		var errorA = V2D.distanceSquare(p2DA1,p2DA2);
		var errorB = V2D.distanceSquare(p2DB1,p2DB2);
		var error = errorA + errorB;
		//console.log(errorA+" | "+errorB+" | "+error+" | ");

		var p3D = estimated3D[i];
		var info = R3D.reprojectionError(p3D, p2DA2,p2DB2, camIdentity, camAtoB, K, K);
		info = info ? info["error"] : null;
		//console.log(info);
	}



	var error = R3D.reprojectionErrorList(estimated3D, reprojected2DA, reprojected2DB, camIdentity,camAtoB, K,K);
	console.log("REPROJECTION TOTAL ERROR");
	console.log(error);



// console.log(" 0- 1: "+V3D.distance(estimated3D[0],estimated3D[1]));
// console.log("13-14: "+V3D.distance(estimated3D[13],estimated3D[14]));
	var ratios = [];
	for(var i=0; i<estimated3D.length-1; ++i){
		var p3D1 = points3D[i];
		var e3D1 = estimated3D[i];
		for(var j=i+1; j<estimated3D.length-1; ++j){
			var p3D2 = points3D[j];
			var e3D2 = estimated3D[j];
			var dp = V3D.distance(p3D1,p3D2);
			var de = V3D.distance(e3D1,e3D2);
			if(dp>0){
				var ratio = de/dp;
				// console.log(ratio);
				ratios.push(ratio);
			}
		}
	}
	var rMean = Code.mean(ratios);
	var rSigma = Code.stdDev(ratios, rMean);
	console.log("ratio error: "+rMean+" +/- "+rSigma);

// var scaleToNormal = 1.0/V3D.distance(estimated3D[13],estimated3D[14]);
// camAtoB = Matrix.transform3DScale(camAtoB,scaleToNormal);
// 0.6443050094821295
//Matrix.transform3DScale(a,sX,sY,sZ)
//console.log(V3D.sub(estimated3D[10],estimated3D[11]).length());
	//console.log(estimated3D);

	for(var i=0; i<estimated3D.length; ++i){
		var p3D = points3D[i];
		var e3D = estimated3D[i];
		//console.log(p3D+"");
		//
		var o3D = camInvA.multV3DtoV3D(new V3D(), e3D); // identity & AtoB
		//var o3D = camA.multV3DtoV3D(new V3D(), e3D);
		//var o3D = camInvB.multV3DtoV3D(new V3D(), e3D);
		//var o3D = camB.multV3DtoV3D(new V3D(), e3D);
		//
		//var o3D = e3D; // camA & camB
		//
//		console.log(i+": "+p3D+" => "+o3D);
	}
	// F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
	// F = R3D.fundamentalMatrixNonlinear(F,bestPointsA,bestPointsB);
	// P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka, Kb, null, force);

	// display projections
	var image = new DO();
	this._root.addChild(image);
	// image.graphics().clear();

	var d = image;
	// camera:
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(0,0);
	d.graphics().lineTo(imageWidth,0);
	d.graphics().lineTo(imageWidth,imageHeight);
	d.graphics().lineTo(0,imageHeight);
	d.graphics().endPath();
	d.graphics().strokeLine();

	// projections
	for(var i=0; i<projected2DA.length; ++i){
		var p2DA = projected2DA[i];
		var p2DB = projected2DB[i];
		p2DA = p2DB;
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(p2DA.x,imageHeight-p2DA.y, 3);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	d.matrix().identity();
	d.matrix().translate(100,100);


// save fake bundle adjustment data for visualization

var yaml = new YAML();
var timestampNow = Code.getTimeStamp();
yaml.writeComment("BA test");
yaml.writeComment("created: "+timestampNow);
yaml.writeBlank();

yaml.writeArrayStart("cameras");
	yaml.writeObjectStart();
		yaml.writeString("id","0");
		yaml.writeObjectStart("K");
			K.toYAML(yaml);
		yaml.writeObjectEnd();
	yaml.writeObjectEnd();
yaml.writeArrayEnd();


yaml.writeArrayStart("views");
	yaml.writeObjectStart();
		yaml.writeString("id","R04ZYF8K");
		yaml.writeString("camera","0");
		yaml.writeObjectStart("transform");
			camIdentity.toYAML(yaml);
		yaml.writeObjectEnd();
	yaml.writeObjectEnd();
	yaml.writeObjectStart();
		yaml.writeString("id","UB2GL8EB");
		yaml.writeString("camera","0");
		yaml.writeObjectStart("transform");
			camAtoB.toYAML(yaml);
		yaml.writeObjectEnd();
	yaml.writeObjectEnd();
yaml.writeArrayEnd();


yaml.writeArrayStart("points");
for(i=0; i<estimated3D.length; ++i){
	var e3D = estimated3D[i];
	yaml.writeObjectStart();
	yaml.writeNumber("X",e3D.x);
	yaml.writeNumber("Y",e3D.y);
	yaml.writeNumber("Z",e3D.z);
	yaml.writeObjectEnd();
}
yaml.writeArrayEnd();

yaml.writeDocument();
var str = yaml.toString();

var fxnZ = function(){
	console.log("saved ....");
}
var pm = this._projectManager;
pm.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
pm.saveBundleAdjust(str, fxnZ, this);
//this.saveProjectFile();


return;


}



// ------------------------------------------------------------------------------------------------------------
App3DR.Resource = function(complete, context){
	App3DR.Resource._.constructor.call(this, complete, context);
	console.log("new")
	var imageBase = "./images/";
	var icons = "icons/"
	var img = [];
		img[App3DR.Resource.TEX_BG_MAIN] = "background.png";
		img[App3DR.Resource.TEX_BG_CHECKERBOARD] = "bg_checkerboard_repeat.png";
		img[App3DR.Resource.TEX_CASE_STUDY_EXAMPLE] = "../../images/caseStudy1-9.jpg";
		img[App3DR.Resource.TEX_BUTTON_HEX_ACTIVE] = "button_base_active.png";
		img[App3DR.Resource.TEX_BUTTON_HEX_INACTIVE] = "button_base_inactive.png";
		img[App3DR.Resource.TEX_BUTTON_HEX_SELECTED] = "button_base_selected.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_LINK] = icons+"icon_button_link.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_PLUS] = icons+"icon_button_plus.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_MINUS] = icons+"icon_button_minus.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_UNDO] = icons+"icon_button_undo.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_GRID] = icons+"icon_button_grid.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_FEATURE] = icons+"icon_button_feature.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_DROP] = icons+"icon_button_drop.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_ARROW_DOWN] = icons+"icon_button_arrow_down_full.png";
		img[App3DR.Resource.TEX_BUTTON_ICON_MOVE] = icons+"icon_button_move.png";
	this._imgLoader.setLoadItems(imageBase,img);
	// this._imgLoader.addLoadItem(imageBase, "background.png");
	// this._imgLoader.addLoadItem(imageBase, "bg_checkerboard_repeat.png");
}
Code.inheritClass(App3DR.Resource,Resource);
App3DR.Resource.TEX_BG_MAIN = 0;
App3DR.Resource.TEX_BG_CHECKERBOARD = 1;
App3DR.Resource.TEX_CASE_STUDY_EXAMPLE = 2;
App3DR.Resource.TEX_BUTTON_HEX_ACTIVE = 3;
App3DR.Resource.TEX_BUTTON_HEX_INACTIVE = 4;
App3DR.Resource.TEX_BUTTON_HEX_SELECTED = 5;
App3DR.Resource.TEX_BUTTON_ICON_LINK = 6;
App3DR.Resource.TEX_BUTTON_ICON_PLUS = 7;
App3DR.Resource.TEX_BUTTON_ICON_MINUS = 8;
App3DR.Resource.TEX_BUTTON_ICON_UNDO = 9;
App3DR.Resource.TEX_BUTTON_ICON_GRID = 10;
App3DR.Resource.TEX_BUTTON_ICON_FEATURE = 11;
App3DR.Resource.TEX_BUTTON_ICON_DROP = 12;
App3DR.Resource.TEX_BUTTON_ICON_ARROW_DOWN = 13;
App3DR.Resource.TEX_BUTTON_ICON_MOVE = 14;

// ------------------------------------------------------------------------------------------------------------

App3DR.App = function(resource, manager){
	App3DR.App._.constructor.call(this, resource, manager);
	this._projectManager = manager;
	this._resource = resource;
	this._root = new DO();
	this._canvas = null;
	this._stage = null;
}
Code.inheritClass(App3DR.App, Dispatchable);

App3DR.App.prototype.size = function(){
	return V2D.sub(this._max,this._min);
}
App3DR.App.prototype.setActive = function(canvas,stage,parent, min,max){
	console.log(canvas,stage,parent);
	this._canvas = canvas;
	this._stage = stage;
	this._min = min;
	this._max = max;
	parent.addChild(this._root);
	this._root.matrix().identity();
	this._root.matrix().translate(min.x,min.y);
	console.log("active");

}
App3DR.App.prototype.handleEnterFrame = function(e){
}
App3DR.App.prototype.handleMouseDown = function(e){
}
App3DR.App.prototype.handleMouseMove = function(e){
}
App3DR.App.prototype.handleMouseUp = function(e){
}
App3DR.App.prototype.handleKeyDown = function(e){
}
App3DR.App.prototype.handleKeyUp = function(e){
}
App3DR.App.prototype.updateSize = function(min,max){
	this._min = min;
	this._max = max;
}
App3DR.prototype._setupMatchCompareProjectManager = function(readyFxn){
	console.log("_setupMatchCompareProjectManager");
compareIndex = 2;
compareIndex = 12;
	var manager = this._projectManager;
	var app = this._activeApp;
	if(manager.isLoaded()){
		var views = manager.views();
		var pairs = manager.pairs();
		var triples = manager.triples();
		if(pairs.length>0){
			var pair1 = pairs[0];
			var pair2 = pairs[1];
			var pair3 = pairs[2];
pair1 = pairs[compareIndex];
			//var pair = pairs[pairs.length-1];
			var viewA = pair1.viewA();
			var viewB = pair1.viewB();
//			var viewC = pair2 ? pair2.viewB() : null;
//			var triple = triples[0];
var pair2 = null;
var pair3 = null;
var viewC = null;
var triple = null;
			var yamlBinary = null;
			var matchCount = null;
var showTriple = false;
			if(viewA && viewB){ // load: imageA | imageB | matching |
				var app = this._activeApp;
				var self = this;
				var imageA, imageB, imageC;
				var matchAB, matchAC, matchBC;
				var fxnA = function(){
					viewA.loadFeaturesImage(fxnB, self);
				}
				var fxnB = function(){
					viewB.loadFeaturesImage(fxnC, self);
				}
				var fxnC = function(){
					pair1.loadMatchingData(fxnD, self);
				}
				var fxnD = function(){
					if(viewC){
						viewC.loadFeaturesImage(fxnE, self);
					}else{
						fxnX();
					}
				}
				var fxnE = function(){
					pair2.loadMatchingData(fxnF, self);
				}
				var fxnF = function(){
					pair3.loadMatchingData(fxnG, self);
				}
				var fxnG = function(){
					console.log(triple);
					triple.loadMatchingData(fxnX, self);
				}
				var fxnH = function(what){
					//
				}
				var fxnX = function(){
					var data = triple ? triple._matchingData : null;
					var matches = triple ? data["matches"] : [];
					var tripleA = [];
					var tripleB = [];
					var tripleC = [];
					for(var i=0; i<matches.length; ++i){
						var match = matches[i];
						var A = match["A"];
						var B = match["B"];
						var C = match["C"];
						tripleA.push( new V2D(A["x"],A["y"]) );
						tripleB.push( new V2D(B["x"],B["y"]) );
						tripleC.push( new V2D(C["x"],C["y"]) );
					}

					imageA = viewA.featuresImage();
					imageB = viewB.featuresImage();
					matchAB = pair1.matchingData();

					/*
					// trim bad matches:
					console.log(matchAB);
					var matches = matchAB["matches"];
					var maxMatch = Math.min(matches.length, 200);
					matchAB["matches"] = Code.copyArray(matches, 0,maxMatch-1);
					console.log(matchAB["matches"])
					*/

					if(pair2){
						matchAC = pair2.matchingData();
						imageC = viewC.featuresImage();
					}
					if(pair3){
						matchBC = pair3.matchingData();
					}

					var stage = self._stage;
					var imageMatrixA = R3D.imageMatrixFromImage(imageA, stage);
					var imageMatrixB = R3D.imageMatrixFromImage(imageB, stage);
					var imageMatrixC = R3D.imageMatrixFromImage(imageC, stage);
					console.log("ALLLLLL LOADED")
					//
					// app.setDisplay([imageA,imageB], [2], [[imageA,imageB,matchAB]]);
					// app.setDisplay([imageA,imageB,imageC], [1,2], [[imageA,imageB,matchAB],[imageA,imageC,matchAC]]);
					//app.setDisplay([imageA,imageB,imageC], [1,2], [[imageA,imageB,matchAB],[imageA,imageC,matchAC],[imageB,imageC,matchBC]]);
					if(showTriple){
						app.setDisplay([imageA,imageB,imageC], [1,2], [], [[tripleA,imageA, tripleB,imageB, tripleC,imageC]]);
					}else{
						app.setDisplay([imageA,imageB], [2], [[imageA,imageB,matchAB]]);
					}
				}
				fxnA();
			}
		}
		if(readyFxn){
			readyFxn();
		}
	}else{
		console.log("not loaded");
		manager.addFunction(App3DR.ProjectManager.EVENT_LOADED, this._setupMatchCompareProjectManager, this);
	}
}
App3DR.prototype._setupImageUploaderProjectManager = function(){
	console.log("_setupImageUploaderProjectManager");
	var manager = this._projectManager;
	if(manager.isLoaded()){
		console.log("is loaded: ");
	}else{
		console.log("not loaded");
		manager.addFunction(App3DR.ProjectManager.EVENT_LOADED, this._setupImageUploaderProjectManager, this);
	}
}
App3DR.prototype._setupImageEditorProjectManager = function(){
	var manager = this._projectManager;
	if(manager.isLoaded()){

		var views = manager.views();
		console.log(views.length)
		console.log("is loaded: "+views.length);
		if(views.length>0){
			//var view = views[0];
			//var view = views[1];
			var view = views[views.length-1];
			this._activeView = view;
			console.lo
			var app = this._activeApp;
			var self = this;

			var fxnA = function(){
				view.loadFeaturesImage(fxnB, self);
			}
			var fxnB = function(){
				app.setActiveImage(view.featuresImage());
				view.loadMaskImage(fxnC, self);
			}
			var fxnC = function(){
				app.setActiveMask(view.maskImage(), true);
				view.loadFeatures(fxnD, self);
			}
			var fxnD = function(){
				var features = view.features();
				var expanded = [];
				var img = view.featuresImage();
				var width = img.width;
				var height = img.height;
				// for(var i=0; i<features.length; ++i){
				// 	var f = features[i];
				// 	var p = new V3D();
				// 	p.x = f.x * width;
				// 	p.y = f.y * height;
				// 	p.z = f.z * width;
				// 	expanded.push(p);
				// }
				console.log("FEATURE SIZE: "+width+"x"+height);
				var expanded = R3D.denormalizeSIFTObjects(features, width, height);
				app.setActiveFeatures(expanded);
			}
			fxnA();
		}
	}else{
		console.log("not loaded");
		manager.addFunction(App3DR.ProjectManager.EVENT_LOADED, this._setupImageEditorProjectManager, this);
	}
}
App3DR.prototype._handleImageEditorMaskUpdate = function(editor){
	console.log("_handleImageEditorMaskUpdate");
	var image = editor.maskSource();
	var view = this._activeView;
	if(view && image){
		view.saveMaskPicture(image);
	}
}
App3DR.prototype._handleImageUploaderFileReady = function(package){
	console.log(package);
	var file = package["file"];
	var uploader = this._activeApp;
	var adapter = this._uploadAdapter;
	adapter._addFileToQueue(file);
}




// --------------------------------------------------------------------------------------------------------------------
App3DR.prototype._setupModel3DProjectManager = function(projectManager){
	console.log("_setupModel3DProjectManager");

	var self = this;
	var manager = projectManager;
	var expectedFeatureImages = 0;
	var currentFeaturesImages = 0;
		var fxnStart = function(){
			var views = manager.views();
			expectedFeatureImages = views.length;
			for(var i=0; i<views.length; ++i){
				var view = views[i];
				//view.loadFeaturesImage(fxnImageLoaded, self);
				view.loadDenseHiImage(fxnImageLoaded, self); // REPLACE 1
			}
		}
		var fxnImageLoaded = function(){
			console.log("fxnImageLoaded")
			currentFeaturesImages++;
			checkDone();
		}
		var checkDone = function(){
			if(currentFeaturesImages<expectedFeatureImages){
				return;
			}
			fxnDone();
		}
		var fxnDone = function(){
			console.log("fxnDone");
			self._projectBALoad(projectManager);
		}

	if(projectManager.isLoaded()){
		fxnStart();
	}else{
		projectManager.addFunction(App3DR.ProjectManager.EVENT_LOADED, fxnStart, this);
	}

}
App3DR.prototype._projectBALoad = function(projectManager){
	projectManager.loadBundleAdjust(this._projectBALoaded,this, null);
}
App3DR.prototype._projectBALoaded = function(object, data){
	console.log("_projectBALoaded")
	console.log(object,data)
	// console.log(data);
	// console.log(object);
	var str = Code.binaryToString(data);
	// console.log(str);

	var object = YAML.parse(str);
	if(Code.isArray(object)){
		object = object[0];
	}

	var cameras = object["cameras"];
	var views = object["views"];
	var points = object["points"];

	var cameraLookup = {};
	var cameraLookupIndex = {};
	if(cameras){
		for(var i=0; i<cameras.length; ++i){
			var c = cameras[i];
			var id = c["id"];
			cameraLookup[id] = c; // TODO: this should be id
			cameraLookupIndex[id] = i;
		}
	}
var min3D = null;
var max3D = new V3D();
	var points3D = [];
	var points2D = Code.newArrayArrays(views.length);
	console.log(views);

	var viewsLookupIndex = {};
	for(var i=0; i<views.length; ++i){
		var v = views[i];
		var id = v["id"];
		viewsLookupIndex[id] = c; // TODO: this should be id
		console.log(id+" = "+i)
		viewsLookupIndex[id] = i;
	}

if(points){
	for(var i=0; i<points.length; ++i){
		var v = points[i];
		var point3D = new V3D(v["X"],v["Y"],v["Z"]);
		if(!min3D){
			min3D = new V3D(point3D.x,point3D.y,point3D.z);
			max3D = new V3D(point3D.x,point3D.y,point3D.z);
		}
		var viewList = v["views"];
		if(viewList){
			for(var j=0; j<viewList.length; ++j){
				var v = viewList[j];
				var indexIn = v["view"];

//				console.log(index);
				var index = viewsLookupIndex[indexIn];
				var p = {"x":v["x"], "y":v["y"], "3D":point3D}; // new V2D(v["x"],v["y"]);
				// var v = views[index];
				// console.log(v)
				// throw "???"
				if(index===undefined){
					console.log(" .............. ");
					// 	// index = views[0]["id"]; // for fake data
					console.log(v);
					console.log(indexIn);
					console.log(viewsLookupIndex);
					throw "no index: "+index;
				}else{
					points2D[index].push(p);
				}
			}
		}
		V3D.min(min3D,min3D,point3D);
		V3D.max(max3D,max3D,point3D);
		points3D.push(point3D);
//console.log("TODO: SCALE ENTIRE SCENE ????? OR INCREASE FRUSTRUM");
//point3D.scale(0.001);
	}
}
var manager = this._projectManager;
console.log(manager);
var projectViews = manager.views();
	var views3D = [];
	for(var i=0; i<views.length; ++i){
		var v = views[i];
console.log(v)
		var transform = v["transform"];
			transform = new Matrix().loadFromObject(transform);
 // extrinsic to camera matrix
var inverse = Matrix.inverse(transform);
transform = inverse;

var o1 = new V3D(0,0,0);
var z1 = new V3D(0,0,1);
// var z1 = new V3D(0,0,-1);
var o2 = transform.multV3DtoV3D(o1);
var z2 = transform.multV3DtoV3D(z1);
z2.sub(o2);

var dot = V3D.dot(z1,z2);
var angle = V3D.angle(z1,z2);

console.log(" -> "+o1+" / "+o2);
console.log(" possible: "+i+" = "+dot+" @ "+Code.degrees(angle)+" : "+o1+"/"+o2);

		var camID = v["camera"]
		var camera = cameraLookup[camID];
		var K = null;
		var distortion = null;
		if(camera){
			K = camera["K"];
			K = new Matrix().loadFromObject(K);
			distortion = camera["distortion"];
		}else{
			K = new Matrix(3,3).fromArray(1,0,0, 0,1,0, 0,0,1);
		}
		var image = null;
		for(var j=0; j<projectViews.length; ++j){
			var pv = projectViews[j];
			if(pv.id()==v["id"]){
			//if(i==j){ // TODO: FIX ID
				//image = pv.featuresImage();
				//image = pv.denseHiImage(); // REPLACE 1
				image = pv.bundleAdjustImage(); // REPLACE 1
				// console.log("bundleAdjustImage");
				// console.log(image);
				// console.log(pv.denseHiImage());
				image = pv.denseHiImage();
				break;
			}
		}
		var view = {"transform":transform, "K":K, "distortion":distortion, "image":image, "id":v["id"]};
		views3D.push(view);
	}

	var app = this._activeApp;
	app._originalPoints = points;
console.log("this._originalPoints");
console.log(app._originalPoints);
console.log(points2D);
	app.setPoints(points3D, points2D);

	app.setViews(views3D);
if(!max3D || !min3D){
	max3D = new V3D(1,1,1);
	min3D = new V3D(-1,-1,-1);
}
console.log(max3D);
console.log(min3D);
var range = V3D.sub(max3D,min3D);

var maxDistance = max3D.length();


// console.log("maxDistance: "+maxDistance);
maxDistance = maxDistance * 2;

maxDistance = Math.max(maxDistance,10);


app._distanceRange = maxDistance * 0.5;


console.log("maxDistance: "+maxDistance);

app._stage3D.frustrumAngle(45);
app._stage3D.distanceNear(0.01);
//app._stage3D.distanceFar(100.0);

app._stage3D.distanceFar(maxDistance);


console.log("DONE");
}




App3DR.App.MatchCompare = function(resource, manager){
	App3DR.App.MatchCompare._.constructor.call(this, resource);
	console.log("MatchCompare");
	this._displayData = null;
	this._display = new DO();
	this._root.addChild(this._display);
//this._displayPairDO.alpha(0.5);
//this._root.graphics().alpha(0.1);
	this._matchingPair = null;
}
Code.inheritClass(App3DR.App.MatchCompare, App3DR.App);

App3DR.App.MatchCompare.prototype.setDisplay = function(imageList,rowList,matchList, tripleList){
	var i, j, k;
	var countTotal = imageList.length;
	var countCurrent = 0;
	var maxWidth = 0;
	var colHeight = 0;

	var largestWidth = 0;
	var largestHeight = 0;
	var imageInfoList = [];
	var matchInfoList = [];
	var tripleInfoList = [];
	var image;
	for(i=0; i<imageList.length; ++i){
		image = imageList[i];
		largestWidth = Math.max(largestWidth,image.width);
		largestHeight = Math.max(largestHeight,image.height);
		imageInfoList[i] = {"image":image};
	}
	var maximumRows = rowList.length;
	var maximumCols = 0;
	for(i=0; i<rowList.length; ++i){
		maximumCols = Math.max(maximumCols, rowList[i]);
	}
//	console.log("maximumRows: "+maximumRows);
//	console.log("maximumCols: "+maximumCols);
	// MATCHES:
	for(i=0; i<matchList.length; ++i){
		var imageA = matchList[i][0];
		var imageB = matchList[i][1];
		var matching = matchList[i][2];
		var match = {};
		match["match"] = matching;
		for(j=0; j<imageInfoList.length; ++j){
			var info = imageInfoList[j];
			if(info["image"]==imageA){
				match["A"] = info;
			}else if(info["image"]==imageB){
				match["B"] = info;
			}
		}
		matchInfoList.push(match);
	}
	this._matchList = matchInfoList;
	// TRIPLES:
	if(tripleList){
		for(i=0; i<tripleList.length; ++i){
			var triple = tripleList[i];
			var pointsA = triple[0];
			var imageA = triple[1];
			var pointsB = triple[2];
			var imageB = triple[3];
			var pointsC = triple[4];
			var imageC = triple[5];
			var trip = {};
				trip["pointsA"] = pointsA;
				trip["pointsB"] = pointsB;
				trip["pointsC"] = pointsC;
			for(j=0; j<imageInfoList.length; ++j){
				var info = imageInfoList[j];
				if(info["image"]==imageA){
					trip["imageA"] = info;
				}else if(info["image"]==imageB){
					trip["imageB"] = info;
				}else if(info["image"]==imageC){
					trip["imageC"] = info;
				}
			}
			tripleInfoList.push(trip);
		}
	}

	var grid = new V2D(maximumCols,maximumRows);
	var objectSize = new V2D(largestWidth,largestHeight);
console.log("objectSize: "+objectSize);
	var fullSize = new V2D(largestWidth*maximumCols,largestHeight*maximumRows);
	// setup display locations:

	for(i=0; i<rowList.length; ++i){
		var rowCount = rowList[i];

		for(j=0; j<rowCount; ++j){
			var info = imageInfoList[countCurrent+j];
			info["column"] = (j + (maximumCols-rowCount)*0.5 );
			info["row"] = i;
			/*
			rowWidth += image.width;
			maxRowHeight = Math.max(maxRowHeight, image.height);
			var match = null;
			// for(k=0; k<matchList.length; ++k){
			// 	if(matchList[k][0]==image){
			// 		match = ;
			// 	}
			// }
			var info = {"image":image, "row":row, "match":match};
			imageInfo.push(info);
			*/
		}
		// row = {"width":rowWidth, "height":maxRowHeight}
		// rowInfo[i] = row;
		// colHeight += maxRowHeight;
		// maxWidth = Math.max(maxWidth, rowWidth);
		countCurrent += rowCount;
	}

	this._displayData = {"images":imageInfoList, "objectSize":objectSize, "fullSize":fullSize, "grid":grid, "matches":matchInfoList, "triples":tripleInfoList};
	this._render();

	// SAVE THE LOCATIONS / SIZES FOR HIT - TESTING
}
App3DR.App.MatchCompare.prototype.handleMouseDown = function(e){
	var display = this._displayData;
	var location = e["location"];
	// console.log(display);
	if(!this._displayPairDO){
		this._displayPairDO = new DO();
		this._root.addChild(this._displayPairDO);
	}
	if(display){
		var imageInfo = display["images"];
		for(var i=0; i<imageInfo.length; ++i){
			var image = imageInfo[i];
			var off = image["offset"];
			var size = image["size"];
			//var rect = new Rect(off.x,off.y,size.x,size.y);
			var a = new V2D().add(off).add(0,0);
			var b = new V2D().add(off).add(size.x,0);
			var c = new V2D().add(off).add(size.x,size.y);
			var d = new V2D().add(off).add(0,size.y);
			var isInside = Code.isPointInsideRect2D(location, a,b,c,d);
			//console.log(isInside);
			if(isInside){
//				console.log(image);
				var local = V2D.sub(location,off);
				var percent = local.copy().scale(1.0/size.x,1.0/size.y);
				var img = image["image"];
				var matrix = image["matrix"];
				if(!matrix){
					matrix = this._stage.getImageAsFloatRGB(img);
					matrix = new ImageMat(matrix["width"], matrix["height"], matrix["red"], matrix["grn"], matrix["blu"]);
					image["matrix"] = matrix;
				}
				// show a rect:

				///console.log(matrix);
				var total = new V2D(matrix.width(),matrix.height());
				total.scale(percent.x,percent.y);

console.log("RANGE PROFILING:");
R3D.rangeProfileImagePoint(matrix, total);

				var compareSize = 21;
				var scale = 1.0;
				var square = matrix.extractRectFromFloatImage(total.x,total.y,scale,null,compareSize,compareSize, null);

					var img = square;
					img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
					var d = new DOImage(img);
					d.matrix().scale(4.0);
					d.matrix().translate(600 + i*100, 10);
					this._displayPairDO.addChild(d);

				var pair = this._matchingPair;
				if(!pair){
					pair = {};
					this._matchingPair = pair;
				}
				pair[""+i] = {"location":total, "image": image};

				//this.checkMatchPairs();
			}
		}
	}
// 	var move = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_MOVE;
// 	if(move){
// 		var data = e["data"];
// 		var location = data["location"];
// 		this._explorer.mouseUp(location);
// 		this.moveAreaCancel();
// 		this._render();
// 	}
// }
}
App3DR.App.MatchCompare.prototype.handleKeyDown = function(e){
	var keyCode = e.keyCode;
	if(keyCode == Keyboard.KEY_ENTER){
		this.checkMatchPairs();
	}else if(keyCode == Keyboard.KEY_SPACE){
		if(this._displayPairDO){
			this._displayPairDO.removeAllChildren();
		}
	}else if(keyCode == Keyboard.KEY_LET_F){
		this.calculateF();
	}else if(keyCode == Keyboard.KEY_LET_M){
		this.findMatchF();
	}
}
App3DR.App.MatchCompare.prototype.findMatchF = function(){
	console.log("findMatchF");
	var pair = this._matchingPair;
	if(pair){
		var keys = Code.keys(pair);
		// console.log(keys);
		// console.log(pair);
		if(keys.length==2){
			var imageA = pair[keys[0]];
			var imageB = pair[keys[1]];
			pair = null;
			var locationA = imageA["location"];
			var locationB = imageB["location"];
			var dataA = imageA["image"];
			var dataB = imageB["image"];
			var matrixA = dataA["matrix"];
			var matrixB = dataB["matrix"];
			var F = this.calculateF(false);
			var Finv = R3D.fundamentalInverse(F);
			console.log(F);
			R3D.findMatchingPointF(matrixA,matrixB,F,Finv, locationA);

		}
	}
	console.log("out");

}
App3DR.App.MatchCompare.prototype.calculateF = function(log){
	log = log!==undefined ? log : true;
	// console.log("calculateF");
	var index = 0;
	var matchList = this._matchList[index]["match"];
	// console.log(matchList);
	var sizeFr = matchList["fromSize"];
	var sizeTo = matchList["toSize"];
	var matches = matchList["matches"];
	// console.log(matches);
	// R3D.fundamentalFromUnnormalized = function(pointsA,pointsB, skipNonlinear){
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		// console.log(match);
		var fr = match["fr"];
		var to = match["to"];
		var pointA = new V2D(fr.x*sizeFr.x,fr.y*sizeFr.y);
		var pointB = new V2D(to.x*sizeTo.x,to.y*sizeTo.y);
		pointsA.push(pointA);
		pointsB.push(pointB);
	}
	var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
	var widA = sizeFr.x;
	var heiA = sizeFr.y;
	var widB = sizeTo.x;
	var heiB = sizeTo.y;
	var Fnorm = R3D.fundamentalNormalize(F, Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widA,1.0/heiA), Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widB,1.0/heiB));
	var yaml = new YAML();
	yaml.writeObjectStart("F");
		Fnorm.toYAML(yaml);
	yaml.writeObjectEnd();
	var str = yaml.toString();
	var Finv = R3D.fundamentalInverse(F);
	var info = R3D.fErrorList(F, Finv, pointsA, pointsB);
	if(log){
		console.log(F);
		console.log("\n"+str+"\n");
		console.log(info);
	}
	return F;
}
App3DR.App.MatchCompare.prototype.checkMatchPairs = function(){
	var pair = this._matchingPair;
	if(pair){
		var keys = Code.keys(pair);
		if(keys.length==2){
			var imageA = pair[keys[0]];
			var imageB = pair[keys[1]];
			pair = null;
			var locationA = imageA["location"];
			var locationB = imageB["location"];
			var dataA = imageA["image"];
			var dataB = imageB["image"];
			var matrixA = dataA["matrix"];
			var matrixB = dataB["matrix"];
			//var checkScale = 2.0;
			var checkScale = 1.0;
			var result = R3D.bestPairMatchExhaustivePoint(matrixA,locationA, matrixB,locationB, checkScale);

			var bestScale = result["scale"];
			var bestAngle = result["angle"];
			var bestOffset = result["offset"];
			console.log("MATCH: "+locationA+" => "+locationB+" @ scale: "+bestScale+", angle: "+bestAngle+", + "+bestOffset);
			//console.log(result);
bestScale = 1.0;
bestAngle = 0.0;
bestOffset = new V2D();

locationB.add(bestOffset);
var lA = locationA.copy().scale(1.0/matrixA.width(),1.0/matrixA.height());
var lB = locationB.copy().scale(1.0/matrixB.width(),1.0/matrixB.height());
		var str = "\n\n\t-\n\t\tfr:\n\t\t\ti: 0\n\t\t\tx: "+lA.x+"\n\t\t\ty: "+lA.y+"\n\t\t\ts: 1.0\n\t\t\ta: 0.0\n\t\tto:\n\t\t\ti: 0\n\t\t\tx: "+lB.x+"\n\t\t\ty: "+lB.y+"\n\t\t\ts: "+bestScale+"\n\t\t\ta: "+bestAngle+"\n\n";
		console.log(str);




// SHOW SAD SCORE:
//var compareSize = 31;
var compareSize = 21;
//var compareSize = 11;
var matrix = new Matrix(3,3).identity();
var needle = matrixA.extractRectFromFloatImage(locationA.x,locationA.y,1.0,null,compareSize,compareSize, matrix);
//
var matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DScale(matrix,bestScale);
	matrix = Matrix.transform2DRotate(matrix,bestAngle);
var haystack = matrixB.extractRectFromFloatImage(locationB.x,locationB.y,1.0,null,compareSize,compareSize, matrix);
//R3D.searchNeedleHaystackImageFlatSADBin
var result = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
var score = result["value"];
console.log("SCORE: "+score);



//var seedTestAngles = Code.lineSpace(-15,15, 15);
var testAngles = Code.lineSpace(-10,10, 10);
var testScales = Code.lineSpace(-.1,.1, .1);
var baseScale = bestScale;
var baseAngle = bestAngle;
var searchSize = null;

var info = R3D.Dense.optimumTransform(matrixA,locationA, matrixB,locationB, compareSize,baseScale,baseAngle, testScales,testAngles, searchSize);
console.log(info);
var scale = info["scale"];
var angle = info["angle"];
var score = info["score"];
var info = R3D.Dense.rankForTransform(matrixA,null,locationA, matrixB,null,locationB, scale,angle,score, compareSize);
if(info){
var rank = info["rank"];
var uniq = info["uniqueness"];
console.log("SCORE: "+score);
console.log("RANK: "+rank);
console.log("UNIQ: "+uniq);



// investigate more

// HERE
// var data = R3D.Dense.comparePathTransforms(imageA,pointA1,pointA2, imageB,pointB1,pointB2, sizeCompare,scaAB, subShow);
// NEED START/END POINT PAIRS




// HERE



}


/*

// interpolationData

var pairs = [];
	// 9:
	// pairs.push([new V2D(1.0,1.0), new V2D( 0.0,1.0), 2.0, 0.0]);
	// pairs.push([new V2D(5.0,1.0), new V2D( 7.0,1.0), 2.0, 1.0]);
	// pairs.push([new V2D(9.0,1.0), new V2D(12.0,1.0), 2.0, 2.0]);
	// pairs.push([new V2D(1.0,5.0), new V2D( 1.0,5.0), 2.0, 0.0]);
	// pairs.push([new V2D(5.0,5.0), new V2D( 6.0,5.0), 2.0, 1.0]);
	// pairs.push([new V2D(9.0,6.0), new V2D(10.0,5.0), 2.0, 2.0]);
	// pairs.push([new V2D(1.0,9.0), new V2D( 3.0,7.0), 2.0, 0.0]);
	// pairs.push([new V2D(5.0,9.0), new V2D( 4.0,8.0), 2.0, 1.0]);
	// pairs.push([new V2D(9.0,9.0), new V2D( 7.0,9.0), 2.0, 2.0]);

	pairs.push([new V2D(1.0,1.0), new V2D( 0.0,1.0), 2.0, 0.0]);
	pairs.push([new V2D(5.0,1.0), new V2D( 6.0,1.0), 2.0, 1.0]);
	pairs.push([new V2D(9.0,1.0), new V2D(12.0,0.0), 2.0, 3.0]);
	pairs.push([new V2D(1.0,5.0), new V2D( 1.0,5.0), 2.0, 0.0]);
	pairs.push([new V2D(5.0,5.0), new V2D( 5.0,5.0), 2.0, 1.0]);
	pairs.push([new V2D(9.0,5.0), new V2D( 9.0,5.0), 2.0, 2.0]);
	pairs.push([new V2D(1.0,9.0), new V2D( 3.0,7.0), 2.0, 0.0]);
	pairs.push([new V2D(5.0,9.0), new V2D( 5.0,9.0), 2.0, 1.0]);
	pairs.push([new V2D(9.0,9.0), new V2D( 8.0,9.0), 2.0, 2.0]);

	// pairs.push([new V2D(0.0,0.0), new V2D(0.0,0.0), 2.0, 0.0]);
	// pairs.push([new V2D(1.0,1.0), new V2D(2.0,3.0), 2.0, 1.0]);
	// pairs.push([new V2D(5.0,0.5), new V2D(3.0,2.0), 2.0, 2.0]);
	// pairs.push([new V2D(0.0,0.0), new V2D( 0.0, 0.0), 2.0, 0.0]);
	// pairs.push([new V2D(1.0,1.0), new V2D( 2.0, 2.0), 2.0, 1.0]);
	// pairs.push([new V2D(5.0,0.5), new V2D( 8.0, 1.5), 2.0, 2.0]);
	//pairs.push([new V2D(5.0,5.0), new V2D(10.0, 8.0), 2.0, 2.0]);
	//pairs.push([new V2D(2.0,6.0), new V2D(4.0,12.0), 2.0, 2.0]);
	// pairs.push([new V2D(0.0,0.0), new V2D(0.0,0.0), 2.0, 0.0]);
	// pairs.push([new V2D(1.0,1.0), new V2D(2.0,2.0), 2.0, 1.0]);
	// pairs.push([new V2D(5.0,0.5), new V2D(10.0,1.0), 2.0, 2.0]);
	// pairs.push([new V2D(0.0,0.0), new V2D(0.0,0.0), 2.0, 0.0]);
	// pairs.push([new V2D(1.0,1.0), new V2D(1.0,1.0), 2.0, 1.0]);
	// pairs.push([new V2D(5.0,0.5), new V2D(5.0,0.5), 2.0, 2.0]);
var world = new R3D.BA.World();
var viewA = world.addView();
var viewB = world.addView();
viewA.image(matrixA);
viewB.image(matrixB);
viewA.size(new V2D(matrixA.width(), matrixA.height()));
viewB.size(new V2D(matrixB.width(), matrixB.height()));
// console.log(viewA,viewB)
var transform = world.transformFromViews(viewA,viewB);
// console.log("PAIRS:"+pairs.length);
for(var p=0; p<pairs.length; ++p){
	var pair = pairs[p];
	var pA = pair[0];
	var pB = pair[1];
	var scaleAB = pair[2];
	var angleAB = pair[3];
	//console.log(pA,pB,scaleAB, angleAB);
	var match = world.addMatchForViews(viewA,pA, viewB,pB, scaleAB,angleAB);

	var point3D = match.point3D();
		point3D.disconnect(world);
	var pointA = match.pointA();
	var pointB = match.pointB();
		pointA.isPutative(false);
		pointB.isPutative(false);
	world.insertNewPoint3D(point3D);
}


//console.log("SIZEA: "+viewA.pointSpace().toArray().length);
var pointA = new V2D(5,5);
var points2D = R3D.BA.World.neighborsForInterpolation(pointA, viewA,viewB, true);
var data = R3D.BA.interpolationData(pointA, points2D, viewA,viewB);
console.log(data["point"]+"");


var OFFX = 1600;
var OFFY = 450;
var ss = 40.0;
for(x=0; x<=10; x+=.5){
	for(y=0; y<=10; y+=.5){
		//var pointA = new V2D(0,0);
		var pointA = new V2D(x,y);
		var points2D = R3D.BA.World.neighborsForInterpolation(pointA, viewA,viewB, true);
		// console.log(points2D);
		var data = R3D.BA.interpolationData(pointA, points2D, viewA,viewB);
		// console.log(data);
		var pt = data["point"];
		var ang = data["angle"];
		var sca = data["scale"];
		// console.log("point:"+pt);
		// console.log("angle:"+ang);
		// console.log("scale:"+sca);
		var base = 5.0;
		var d = new DO();
		d.graphics().clear();
		//d.graphics().setFill(0xFF00FF00);
		d.graphics().setLine(1.0, 0xCCCC0000);
		d.graphics().beginPath();
		//d.graphics().drawCircle(0,0,base*sca);
		d.graphics().drawCircle(0,0,base*sca);
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(base*sca,0);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().rotate(ang);
		//d.matrix().translate(x*ss,y*ss);
		d.matrix().translate(pt.x*ss,-pt.y*ss);
		d.matrix().translate(OFFX,OFFY);
		GLOBALSTAGE.addChild(d);
	}
}

*/




			var compareSize = 21;

			var scale = 1.0;
			var angle = 0.0;
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,scale);
				matrix = Matrix.transform2DRotate(matrix,angle);
			var squareA = matrixA.extractRectFromFloatImage(locationA.x,locationA.y,1.0,null,compareSize,compareSize, matrix);

			var scale = bestScale;
			var angle = bestAngle;
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,bestScale);
				matrix = Matrix.transform2DRotate(matrix,bestAngle);
			var squareB = matrixB.extractRectFromFloatImage(locationB.x,locationB.y,1.0,null,compareSize,compareSize, matrix);

			// display
			this._displayPairDO.removeAllChildren();
			var i = 0;
			var sca = 4.0;
			var img = squareA;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(800 + i*100, 10);
			this._displayPairDO.addChild(d);

			var i = 1;
			var sca = 4.0;
			var img = squareB;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(800 + i*100, 10);
			this._displayPairDO.addChild(d);

		}
		this._matchingPair = null;

	}
}
/*
App3DR.App.prototype.handleEnterFrame = function(e){
}
App3DR.App.prototype.handleMouseDown = function(e){
}
App3DR.App.prototype.handleMouseMove = function(e){
}
App3DR.App.prototype.handleMouseUp = function(e){
}

App3DR.App.prototype.handleKeyUp = function(e){
}
*/
App3DR.App.MatchCompare.prototype._render = function(){
	// ...
	console.log("RENDER");
	this._display.removeAllChildren();
	if(this._displayData){
		var grid = this._displayData["grid"];
		var fullSize = this._displayData["fullSize"];
		var objectSize = this._displayData["objectSize"];
		var imageInfo = this._displayData["images"];
		var matchInfo = this._displayData["matches"];
		var tripleInfo = this._displayData["triples"];
		var containerSize = this.size();

		var fitSize = Code.sizeToFitInside(containerSize.x,containerSize.y, fullSize.x,fullSize.y);
		//console.log(objectSize+"  ... "+fitSize);
		var scale = fitSize.x/fullSize.x;
		//console.log(scale);
		//this._displayData = {"images":imageInfo, "size":objectSize}
		//var diff = V2D.sub(containerSize,fitSize);
		var i, j, k;
		for(i=0; i<imageInfo.length; ++i){
			var info = imageInfo[i];
			var image = info["image"];
			var col = info["column"];
			var row = info["row"];
			var size = objectSize.copy().scale(scale);
			var off = size.copy().scale(col,row);
			var d = new DOImage(image);
			info["offset"] = off;
			info["size"] = size;
			d.size(size.x,size.y);
			this._display.addChild(d);
			d.matrix().identity();
			d.matrix().translate(off.x,off.y);
		}
		// matches after images
		for(i=0; i<matchInfo.length; ++i){
			console.log("matchInfo: "+i);
			var match = matchInfo[i];
			var imageA = match["A"];
			var imageB = match["B"];
			var matches = match["match"];
			var F = matches["F"];
				F = new Matrix().loadFromObject(F);
//console.log(F+"");
// console.log("A: "+imageA["offset"]);
// console.log("B: "+imageB["offset"]);
			var matchingList = matches["matches"];
			if(matchingList){
				var d = new DO();
				this._display.addChild(d);
				console.log(matchingList.length+" .... match length" );
				//d.graphics().setLine(1.0,0x99FF0000);
				for(j=0; j<matchingList.length; ++j){
					var m = matchingList[j];
					var to = m["to"];
					var fr = m["fr"];
						var t = new V2D(to["x"],to["y"]);
						var f = new V2D(fr["x"],fr["y"]);
					var f = f.copy().scale(imageA["size"].x,imageA["size"].y);
					f.add(imageA["offset"]);
					var t = t.copy().scale(imageB["size"].x,imageB["size"].y);
					t.add(imageB["offset"]);
					// console.log(f+" => "+t);
					var colors = [];
					var color = Code.getColARGBFromFloat(1.0,Math.random(),Math.random(),Math.random());
					colors.push(color);
					color = Code.inverseColorARGB(color);
					//colors.push(color);
					for(k=0; k<colors.length; ++k){ // fat to skinny
						//d.graphics().setLine(1.0+(colors.length-1-k)*6,color);
						d.graphics().setLine(1.0,color);
						d.graphics().beginPath();
						d.graphics().moveTo(f.x,f.y+k);
						d.graphics().lineTo(t.x,t.y+k);
						d.graphics().endPath();
						d.graphics().strokeLine();
					}
					// if(j>50){
					// 	break;
					// }
				}
			}
			// var imA = imageA["image"];
			// var imB = imageB["image"];

		}

		// triples
		for(i=0; i<tripleInfo.length; ++i){
			console.log("tripleInfo: "+i);
			var triple = tripleInfo[i];
			console.log(triple);
			var imageA = triple["imageA"];
			var imageB = triple["imageB"];
			var imageC = triple["imageC"];
			var pointsA = triple["pointsA"];
			var pointsB = triple["pointsB"];
			var pointsC = triple["pointsC"];

			var d = new DO();
			this._display.addChild(d);

			for(j=0; j<pointsA.length; ++j){
				var a = pointsA[j];
				var b = pointsB[j];
				var c = pointsC[j];

				a = a.copy().scale(imageA["size"].x,imageA["size"].y);
				a.add(imageA["offset"]);
				b = b.copy().scale(imageB["size"].x,imageB["size"].y);
				b.add(imageB["offset"]);
				c = c.copy().scale(imageC["size"].x,imageC["size"].y);
				c.add(imageC["offset"]);
				var color = 0xFFFF0000;
				//var color = Code.getColARGBFromFloat(1.0,Math.random(),Math.random(),Math.random());
				var connections = [[a,b],[b,c],[a,c]];
				for(k=0; k<connections.length; ++k){
					var f = connections[k][0];
					var t = connections[k][1];
					d.graphics().setLine(1.0,color);
					d.graphics().beginPath();
					d.graphics().moveTo(f.x,f.y);
					d.graphics().lineTo(t.x,t.y);
					d.graphics().endPath();
					d.graphics().strokeLine();
				}
				if(j>50){
					break;
				}
			}
		}

/*


		// var toSizeA = new V2D(imA.width,imA.height);
		// var toSizeB = new V2D(imB.width,imB.height);


		var toSizeA = new V2D(imA.width,imA.height).scale(scale);
		var toSizeB = new V2D(imB.width,imB.height).scale(scale);

		var scaleA = scale;
		var scaleB = scale;
		// F for visualizing
		var Floc = F.copy();
			Floc = Matrix.mult( Floc, Matrix.transform2DScale(new Matrix(3,3).identity(), 1.0/scaleA, 1.0/scaleA) );
			Floc = Matrix.mult( Matrix.transform2DScale(new Matrix(3,3).identity(), 1.0/scaleB, 1.0/scaleB), Floc );

		this.showF(d, Floc, matchingList, imageA["offset"],imageA["size"], imageB["offset"],imageB["size"]);


			var pointsA = [];
			var pointsB = [];
			var matches = match["match"];
			var matchingList = matches["matches"];
			for(i=0; i<matchingList.length; ++i){
				var m = matchingList[i];
				var to = m["to"];
				var fr = m["fr"];
					var t = new V2D(to["x"],to["y"]);
					var f = new V2D(fr["x"],fr["y"]);
					f.scale(imA.width,imA.height);
					t.scale(imB.width,imB.height);
				pointsA[i] = new V3D(f.x,f.y,1.0);
				pointsB[i] = new V3D(t.x,t.y,1.0);
			}
		// var error = R3D._gdFun([pointsA,pointsB], F.toArray(), false);
		// var averageError = error/pointsA.length;
		var error = R3D.fundamentalMatrixError(F, pointsA,pointsB);
		console.log("F AVG ERROR: "+error+" == "+(error/pointsA.length));
		*/
	}


}

App3DR.App.MatchCompare.prototype.showF = function(display, matrixFfwd, matches, offsetA,sizeA, offsetB,sizeB){
	console.log(matches)

	matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	var colors = [0xFFFF0000, 0xFFFF9900, 0xFFFF6699, 0xFFFF00FF, 0xFF9966FF, 0xFF0000FF,  0xFF00FF00 ]; // R O M P B P G
	// var imageWidth = imageMatrixA ? imageMatrixA.width() : 400;
		// var imageHeight = imageMatrixA ? imageMatrixA.height() : 300;
		// var scale = Math.sqrt(imageWidth*imageWidth + imageHeight*imageHeight); // imageWidth + imageHeight;
	var scale = 0.25 * Math.max(sizeA.length(),sizeB.length());

	// SHOW F LINES ON EACH
	for(var k=0; k<matches.length; ++k){
		var percent = k / (matches.length-1);
		var match = matches[k];
		var to = match["to"];
		var fr = match["fr"];
		var pointA = new V2D(fr["x"],fr["y"]);
		var pointB = new V2D(to["x"],to["y"]);
			pointA.scale(sizeA.x,sizeA.y);
			pointB.scale(sizeB.x,sizeB.y);
		pointA = new V3D(pointA.x,pointA.y,1.0);
		pointB = new V3D(pointB.x,pointB.y,1.0);
		var lineA = new V3D();
		var lineB = new V3D();

		matrixFfwd.multV3DtoV3D(lineA, pointA);
		matrixFrev.multV3DtoV3D(lineB, pointB);

		var d, v;
		var dir = new V2D();
		var org = new V2D();

		var rad = 4.0;
		//var color = Code.interpolateColorGradientARGB(percent, colors);
		var color = colors[k%colors.length];
		//
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	var closest = Code.closestPointLine2D(org,dir, pointB);
	var dist = V2D.distance(closest,pointA);
//console.log("DIFF 1: "+dist);
		dir.scale(scale);
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(offsetB.x + closest.x-dir.x, offsetB.y + closest.y-dir.y);
		d.graphics().lineTo(offsetB.x + closest.x+dir.x, offsetB.y + closest.y+dir.y);
		d.graphics().drawCircle(offsetB.x + pointB.x, offsetB.y + pointB.y, rad);
		// d.graphics().drawCircle(offsetB.x + closest.x, offsetB.y + closest.y, rad*0.5);
		d.graphics().moveTo(offsetB.x + pointB.x, offsetB.y + pointB.y);
		d.graphics().lineTo(offsetB.x + closest.x, offsetB.y + closest.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		display.addChild(d);
		//
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
	var closest = Code.closestPointLine2D(org,dir, pointA);
	var dist = V2D.distance(closest,pointA);
//console.log("DIFF 2: "+dist);
		dir.scale(scale);
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(offsetA.x + closest.x-dir.x, offsetA.y + closest.y-dir.y);
		d.graphics().lineTo(offsetA.x + closest.x+dir.x, offsetA.y + closest.y+dir.y);
		d.graphics().drawCircle(offsetA.x + pointA.x, offsetA.y + pointA.y, rad);
		// d.graphics().drawCircle(offsetA.x + closest.x, offsetA.y + closest.y, rad*0.5);
		d.graphics().moveTo(offsetA.x + pointA.x, offsetA.y + pointA.y);
		d.graphics().lineTo(offsetA.x + closest.x, offsetA.y + closest.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		display.addChild(d);

	}
}


// --------------------------------------------------------------------------------------------------------------------



App3DR.App.ImageUploader = function(resource){
	App3DR.App.ImageUploader._.constructor.call(this, resource);
	// var client = new ClientFile();
	// this._clientFile = client;
	this._displayDropArea = new DO();
	this._root.addChild(this._displayDropArea);

	var d;
	var domUploadDiv = Code.newDiv();
		Code.setStylePosition(domUploadDiv, "absolute");
		Code.setStyleBackgroundColor(domUploadDiv, Code.getJSColorFromARGB(0x9900FF00));
		//Code.setStyleBackgroundColor(domUploadDiv, Code.getJSColorFromARGB(0x00000000));
	this._domUploadDiv = domUploadDiv;
	var body = Code.getBody();
		//Code.addChild(domUploadDiv, body);
		Code.addChild(body, domUploadDiv);

		// LISTEinfo["position"] = null;NERS
	this._jsDispatch = new JSDispatch();
	// UPLOAD
	this._jsDispatch.addJSEventListener(domUploadDiv, Code.JS_EVENT_DRAG_OVER, this._handleDragOverUploadFxn, this);
	this._jsDispatch.addJSEventListener(domUploadDiv, Code.JS_EVENT_DRAG_DROP, this._handleDragDropUploadFxn, this);
	this._jsDispatch.addJSEventListener(domUploadDiv, Code.JS_EVENT_DRAG_LEAVE, this._handleDragOutUploadFxn, this);
}
Code.inheritClass(App3DR.App.ImageUploader, App3DR.App);

App3DR.App.ImageUploader.prototype.setActive = function(canvas,stage,parent, min,max){
	App3DR.App.ImageUploader._.setActive.call(this, canvas,stage,parent, min,max);
	this._dropAreaSize = new V2D(200,200);
	this._updateDisplayNormal();
}
App3DR.App.ImageUploader.prototype._updatePosition = function(){
	var canvas = this._canvas;
	var size = this._dropAreaSize;
	var d = this._displayDropArea;
	var containerSize = V2D.sub(this._max,this._min);
	var offset = V2D.sub(containerSize,size).scale(0.5);
	d.matrix().identity();
	d.matrix().translate(offset.x,offset.y);
}
App3DR.App.ImageUploader.prototype._updateDisplayOver = function(){
	this._updatePosition();
	var size = this._dropAreaSize;
	var d = this._displayDropArea;
	d.graphics().clear();
	d.graphics().setFill(0xFF00FF00);
	d.graphics().setLine(5.0,0xFF990000);
	d.graphics().beginPath();
	d.graphics().drawRect(0,0, size.x,size.y);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	this._render();
}
App3DR.App.ImageUploader.prototype._updateDisplayNormal = function(){
	this._updatePosition();
	var size = this._dropAreaSize;
	var d = this._displayDropArea;
	d.graphics().clear();
	d.graphics().setFill(0xFF999999);
	d.graphics().setLine(5.0,0xFF990000);
	d.graphics().beginPath();
	d.graphics().drawRect(0,0, size.x,size.y);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	this._render();
}
App3DR.App.ImageUploader.prototype._render = function(){
	var canvas = this._canvas;

	var d;
	var size = this._dropAreaSize;

	var upScale = canvas.presentationScale();
	var downScale = 1.0/upScale;

	var topLeftMe = new V2D();
	var topLeftRoot = new V2D();
	DO.pointLocalUp(topLeftRoot,topLeftMe,this._displayDropArea,null);//this._root);

	var topLeft = topLeftRoot.copy().scale(-1).scale(downScale);
	var divSize = size.copy().scale(downScale);

	d = this._domUploadDiv;
	Code.setStylePadding(d, "0px");
	Code.setStyleMargin(d, "0px");
	Code.setStyleLeft(d, topLeft.x+"px");
	Code.setStyleTop(d, topLeft.y+"px");
	Code.setStyleWidth(d, divSize.x+"px");
	Code.setStyleHeight(d, divSize.y+"px");
}
App3DR.App.ImageUploader.prototype._fileTypeAcceptable = function(type){
	return true;
}
App3DR.App.ImageUploader.prototype._handleDragOutUploadFxn = function(e){
	e.stopPropagation();
	e.preventDefault();
	this._updateDisplayNormal();
}
App3DR.App.ImageUploader.prototype._handleDragOverUploadFxn = function(e){
	e.stopPropagation();
	e.preventDefault();
	this._updateDisplayOver();
}
App3DR.App.ImageUploader.prototype._handleDragDropUploadFxn = function(e){
	e.stopPropagation();
	e.preventDefault();
	this._updateDisplayNormal();

	var fileList = e.dataTransfer.files;
	var i, len = fileList.length;
	for(i=0; i<len; ++i){
		var file = fileList[i];
		var filename = file.name;
		var filetype = file.type;
		console.log(filename+" "+filetype);
		if(this._fileTypeAcceptable(filetype)){
			var package = {"file":file, "filename":filename, "filetype":filetype};
			this.alertAll(App3DR.App.ImageUploader.EVENT_FILE_ADDED, package);

		}
	}
}










App3DR.App.UploadAdapterToPictures = function(manager, stage){
	this._projectManager = manager;
	this._stage = stage;
	this._fileQueue = [];
	this._processingFile = null;
}
App3DR.App.UploadAdapterToPictures.prototype.isBusy = function(){
	var val = this._processingFile; // || this._processingPicture || this._processingView;
	return val!=null;
}
App3DR.App.UploadAdapterToPictures.prototype._addFileToQueue = function(file){
	this._fileQueue.push(file);
	this._checkFileQueue();
}
App3DR.App.UploadAdapterToPictures.prototype._checkFileQueue = function(){
	if(this.isBusy()){
		return;
	}
	if(this._fileQueue.length==0){
		return;
	}
	this._processingFile = this._fileQueue.shift();
	this._processCurrentFile();
}
App3DR.App.UploadAdapterToPictures.prototype._processCurrentFile = function(){
	var file = this._processingFile;
	var filename = file.name;
	var extension = Code.fileExtensionFromName(filename);
	var filetype = file.type;
	var reader = new FileReader();
	var canvas = this._canvas;
	var stage = this._stage;
	var root = this._root;
	var self = this;

	reader.onload = function(progressEvent){
		var binary = reader.result;
		if(binary){
			var base64 = Code.arrayBufferToBase64(binary);
			var imageSrc = Code.appendHeaderBase64(base64, filetype);
			var image = new Image();
			image.onload = function(e){
				var originalWidth = image.width;
				var originalHeight = image.height;
				var minimumPixelCount = 100*100;
				var sizes = [];
				var i;
				var scale = 1.0;
				var width, height, pixelCount;
				for(i=0; i<10; ++i){
					width = Math.round(scale*originalWidth);
					height = Math.round(scale*originalHeight);
					pixelCount = width*height;
					console.log(width+"x"+height+" = "+pixelCount);
					if(pixelCount<minimumPixelCount){
						break;
					}
					sizes.push( new V3D(width,height, scale) );
					scale = scale*0.5; // all halves
				}
				if(sizes.length==0){ // push original image as default
					sizes.push( new V3D(originalWidth,originalHeight, 1.0) );
				}
				self._processPictures(image, extension, sizes);
			}
			image.src = imageSrc;
		}
	}
	reader.readAsArrayBuffer(file);
}
App3DR.App.UploadAdapterToPictures.prototype._processPicturesLoaded = function(i){
	console.log("_processPicturesLoaded: "+i);
}
App3DR.App.UploadAdapterToPictures.prototype._processPictures = function(image, extension, sizes){
//var uploadImageTypeCamera = true;
//var uploadImageTypeCamera = false;
var uploadImageTypeCamera = this.uploadImageTypeCamera;
	var stage = this._stage;
	console.log("_processPictures");
	var self = this;


	var cameraReady = function(camera){
		var calibration = camera.newCalibrationImage();
		viewReady(calibration);
	}
	var viewReady = function(view){
		var i;
		var pictureList = [];
		var mat = R3D.imageMatrixFromImage(image, stage);
		console.log(view)
		// if(uploadImageTypeCamera){
		// 	view.camera()
		// }else{
			view.aspectRatio(mat.width()/mat.height());
		// }
		var countTotal = sizes.length;
		for(i=0; i<sizes.length; ++i){
			size = sizes[i];
			var width = size.x;
			var height = size.y;
			var scale = size.z;
			var matBlurred;
			if(scale<1.0){
				//var sigma = Math.sqrt(0.25 / scale);
				//matBlurred = mat.getBlurredImage(sigma); // picking right sigma is hard
				matBlurred = mat.getScaledImageInteger(scale);
			}else{
				matBlurred = mat;
			}

			var completeFxn = function(s){
				var self = this;
				this.fxn = function(){
					var size = self.size;
					var pictureList = self.pictureList;
					var app = self.app;
					var scaledImage = self.scaledImage;
					var width = size.x;
					var height = size.y;
					var scale = size.z;
						var d = new DOImage(scaledImage);
						// d.graphics().setLine(4.0,0xFFFF0000);
						// d.graphics().setFill(0x55FF00FF);
						// d.graphics().drawRect(0,0,width,height);
						// d.graphics().strokeLine();
						// d.graphics().fill();
						var doScale = false;
						//var doScale = true;
						d.matrix().identity();
						if(doScale){
							d.matrix().scale(scale);
						}
					var renderedImage = stage.renderImage(width,height,d, null);
					var imageBase64 = renderedImage.src;
					var imageBinary = Code.base64StringToBinary(imageBase64);
					var w = renderedImage.width;
					var h = renderedImage.height;
					var filename = (scale*100)+""+"."+extension; // Math.round
					var object = {};
						object["filename"] = filename;
						object["size"] = size;
						object["binary"] = imageBinary;
						object["scale"] = scale;
						object["view"] = view;
					pictureList.push(object);
					console.log(pictureList.length+" / "+countTotal);
					if(pictureList.length==countTotal){
						//if(uploadImageTypeCamera){
						app._uploadedViewPicture(view, pictureList);
					}
				}
			}
			var temp = new completeFxn();
			temp.size = size;
			temp.pictureList = pictureList;
			temp.app = self;
			var scaledImage = R3D.imageFromImageMatrix(matBlurred, stage, temp.fxn);
			temp.scaledImage = scaledImage;
		}
	}
	if(uploadImageTypeCamera){
		var cameras = this._projectManager.cameras();
		if(cameras.length==0){ // new cam
			this._projectManager.addCamera(cameraReady, this);
		}else{
			cameraReady(cameras[0]);
		}
	}else{
		this._projectManager.addView(viewReady, this);
	}
}
App3DR.App.UploadAdapterToPictures.prototype._uploadedViewPicture = function(view, pictureList){
	if(pictureList.length>0){
		var top = pictureList.shift();
			var size = top["size"];
			var binary = top["binary"];
			var size = top["size"];
			var scale = top["scale"];
console.log("ADD PICTURE: "+size+" ??? ");
		view.addPicture(size, scale, binary, this._uploadedViewPicture, this, pictureList);
	}else{
		console.log("uploaded picture complete");
		// SHOULD ALSO SAVE PROJECT FILE TO DISK
		this._projectManager.saveProjectFile(); // TODO: INTERNALIZE THIS TO PROJECT MANAGER
		this._processingFile = null;
		this._checkFileQueue();
	}
}







// --------------------------------------------------------------------------------------------------------------------




App3DR.App.ImageEditor = function(resource){
	App3DR.App.ImageEditor._.constructor.call(this, resource);
	this._explorer = new App3DR.Explorer2D();
	this._testImageSource = null;
	this._testImageMatrix = null;
	this._imageMaskSource = null;
	this._testImageMaskMatrix = null;
	this._featuresSource = null;
}
Code.inheritClass(App3DR.App.ImageEditor, App3DR.App);

App3DR.App.ImageEditor.EVENT_MASK_UPDATE = "img.update";

App3DR.App.ImageEditor.prototype._handleResourceLoaded = function(){
	var resource = this._resource;
	this._imageCheckerboard = resource.tex(App3DR.Resource.TEX_BG_CHECKERBOARD);


//	console.log(this._imageCheckerboard);
//	this._testImageSource = resource.tex(App3DR.Resource.TEX_CASE_STUDY_EXAMPLE);
/*
}
App3DR.App.ImageEditor.prototype._handleTestImageLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	this._testImageSource = imageList[0];
	*/

	this._displayBackground.image(this._imageCheckerboard);
	this._displayImageAlpha = 0.75;
	this._maskColor = 0x6600FF00;

	this._testButton();

	this._render();
}
App3DR.App.ImageEditor.prototype.maskSource = function(){
	return this._imageMaskSource;
}
App3DR.App.ImageEditor.prototype.setActiveImage = function(imageSource){
	console.log("setActiveImage");
	this._testImageSource = imageSource;
	this._testImageMatrix = R3D.imageMatrixFromImage(imageSource, this._stage);

	if(this._testImageSource){
		var img = this._testImageSource;
		var sourceWidth = img.width;
		var sourceHeight = img.height;
		var canvas = this._canvas;
		var size = canvas.size();
		// siz = Math.min(size.x,size.y);
		// size.set(siz,siz);
		size = this.size();
		this._explorer.setSizes(size, new V2D(sourceWidth,sourceHeight) );
	}
	//this._render();
}
App3DR.App.ImageEditor.prototype.setActiveMask = function(imageSource, force){
	this._imageMaskSource = imageSource;
	this._testImageMaskMatrix = R3D.imageMatrixFromImage(imageSource, this._stage);
	// change from colored to gray:
	if(this._testImageMaskMatrix){
		console.log(this._testImageMaskMatrix)
		var m = this._testImageMaskMatrix;
		var r = m.red();
		var g = m.grn();
		var b = m.blu();
		var l = r.length;
		for(var i=0; i<l; ++i){
			var rr = r[i];
			var gg = g[i];
			var bb = b[i];
			// force all to 1.0;
			if(rr>0 || gg>0 || bb>0){
				r[i] = g[i] = b[i] = 1.0;
			}
		}
	}
	if(!imageSource && force && this._testImageMatrix){
		var mat = this._testImageMatrix;
		this._testImageMaskMatrix = new ImageMat(mat.width(), mat.height());
		this.updateMaskImageFromMatrix(false);
	}
	this._render();
}
App3DR.App.ImageEditor.prototype.setActiveFeatures = function(features){
	var maxCount = 2000;
	if(features.length>maxCount){
		features = Code.copyArray(features, 0,maxCount-1);
	}
	console.log(features)
	this._featuresSource = features;
	this._render();
}
App3DR.App.ImageEditor.prototype.updateMaskImageFromMatrix = function(send){
	console.log("updateMaskImageFromMatrix");
	send = send!==undefined ? send : true;
	var matrix = this._testImageMaskMatrix;
	var stage = this._stage;

	var color = this._maskColor;//0x00FF00;
	var width = matrix.width();
	var height = matrix.height();
	var alp = Code.copyArray(matrix.red()); // any of 3
	var a = Code.getFloatAlpARGB(color);
	var r = Code.getFloatRedARGB(color);
	var g = Code.getFloatGrnARGB(color);
	var b = Code.getFloatBluARGB(color);
	var count = width*height;
	var red = new Array(count);
	var grn = new Array(count);
	var blu = new Array(count);
	var i;
	for(i=0; i<count; ++i){
		var c = alp[i] * a;
		red[i] = r;
		grn[i] = g;
		blu[i] = b;
		alp[i] = c;
	}
	var image = stage.getFloatARGBAsImage(alp,red,grn,blu, width, height);
	//
	this._imageMaskSource = image;
	if(send){
		this._maskUpdate();
	}
}
App3DR.App.ImageEditor.prototype._maskUpdate = function(){
	this.alertAll(App3DR.App.ImageEditor.EVENT_MASK_UPDATE, this);
}
App3DR.App.ImageEditor.prototype.setActive = function(canvas,stage,parent, min,max){
	App3DR.App.ImageEditor._.setActive.call(this, canvas,stage,parent, min,max);

	//this._editingMode = App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	this._editingMode = App3DR.App.ImageEditor.EDIT_MODE_DRAW;

	// setup screen
	this._displayBackground = new DOImage();
	this._displayPixels = new DO();
	this._displayFeatures = new DO();

	this._displayMaskImage = new DOImage();
	this._displayImage = new DOImage();
	this._root.addChild(this._displayBackground);
		this._root.addChild(this._displayImage);
		this._root.addChild(this._displayMaskImage);
	this._root.addChild(this._displayPixels);
	this._root.addChild(this._displayFeatures);


	this._areaInterfaceMove = new DO();
	this._areaInterfaceRotate = new DO();
	this._root.addChild(this._areaInterfaceMove);
	this._root.addChild(this._areaInterfaceRotate);

this._rotationAngle = null;

	this._areaInterfaceMove.addFunction(Canvas.EVENT_MOUSE_UP, this.moveAreaHandleMouseUp, this);
	this._areaInterfaceMove.addFunction(Canvas.EVENT_MOUSE_DOWN, this.moveAreaHandleMouseDown, this);

	this._areaInterfaceRotate.addFunction(Canvas.EVENT_MOUSE_DOWN, this.rotateAreaHandleMouseDown, this);

	this._imageMaskSource = null;


	console.log(this._resource);
	if(!this._resource.loaded()){
		this._resource.addFunction(Resource.EVENT_LOADED, this._handleResourceLoaded, this);
	}else{
		this._handleResourceLoaded();
	}

	console.log("setup screen");
/*
	// UI
	this._displayUI = new DO();
	this._displayScale = new DO();
	this._root.addChild(this._displayUI);
		this._displayUI.addChild(this._displayScale);

	this._gizmoScale = new GizmoSlider(this._displayScale);
	this._render();
*/

//this.testDO();
	/*
	this._gizmoRotate = new GizmoRotate();

	this._gizmoBrush = new GizmoSlider();

	this._gizmoToggle = new GizmoToggle();

	this._gizmoUndo = new GizmoToggle();

	*/
/*
	* slider draw-size
	* undo
	* toggle write/rease/move.   (add/delete)
			image focus ?
	* slider zoom/scale
	* rotate starting point
	* toggle feature pts
	* exit button
	* toggle pixel lines button
	* choose mask color
	* choose image transparancy
*/
}
App3DR.App.generateButtonToggle = function(resource, parent, iconImages){

	var button = new DOButtonToggle();
	parent.addChild(button);
	var pressed = [];
	var unpressed = [];
	var hit = null;
	var inactive = null;
	var i;
	for(i=0; i<iconImages.length; ++i){
		var icon = iconImages[i];
//console.log(icon);
		var displays = App3DR.App.generateButtons(resource, parent, icon);
		pressed.push(displays["active"]);
		unpressed.push(displays["pressed"]);
		if(i==0){
			inactive = displays["inactive"];
			hit = displays["hit"];
		}
	}
//console.log(unpressed,pressed);
	button.setDOHitArea(hit);
	button.setDOInactive(inactive);
	button.setToggleItems(unpressed,pressed);
	return button;
}
App3DR.App.generateButton = function(resource, parent, iconImage){
	var displays = App3DR.App.generateButtons(resource, parent, iconImage);

	var d;

	var hit = displays["hit"];
	var active = displays["active"];
	var notactive = displays["inactive"];
	var pressed = displays["pressed"];

	var button = new DOButton();
	parent.addChild(button);
	button.setDOHitArea(hit);
	button.setDOUnpressed(active);
	button.setDOPressed(pressed);
	button.setDOInactive(notactive);

	button.addFunction(DOButton.EVENT_SHORT_PRESS, function(d){
		console.log("short press");
	});
	button.addFunction(DOButton.EVENT_LONG_PRESS, function(d){
		console.log("long press");
	});
	button.addFunction(DOButton.EVENT_PRESS_START, function(d){
		console.log("do press");
	});
	button.addFunction(DOButton.EVENT_PRESS_END, function(d){
		console.log("un press");
	});
	button.addFunction(DOButton.EVENT_PRESS_CANCEL, function(d){
		console.log("cancel");
	});

	// button.isActive(false);
	// button.isActive(true);

	return button;
}
App3DR.App.generateButtons = function(resource, parent, iconImage){
	var imageActive = resource.tex(App3DR.Resource.TEX_BUTTON_HEX_ACTIVE);
	var imageInactive = resource.tex(App3DR.Resource.TEX_BUTTON_HEX_INACTIVE);
	var imageSelected = resource.tex(App3DR.Resource.TEX_BUTTON_HEX_SELECTED);

	var displays = {};

	var d = new DO();
	var size = new V2D(100,100);
	var gr = d.newGraphicsIntersection();
	//var gr = d.graphics();
	gr.clear();
	gr.setFill(0xFF009900);
	gr.beginPath();
	gr.drawRect(0,0, size.x,size.y);
	gr.endPath();
	gr.fill();
	displays["hit"] = d;


	var active = new DO();
		d = new DOImage();
		d.image(imageActive);
		d.size(size.x,size.y);
		active.addChild(d);
		d = new DOImage();
		d.image(iconImage);
		d.size(size.x,size.y);
		active.addChild(d);
	displays["active"] = active;

	var upscale = 1.2;
	var pressed = new DO();
		d = new DOImage();
		d.image(imageSelected);
		d.size(size.x,size.y);
		pressed.addChild(d);
		d = new DOImage();
		d.image(iconImage);
		d.size(size.x,size.y);
		pressed.addChild(d);
		d.matrix().identity();
		d.matrix().translate(-size.x*0.5,-size.y*0.5);
		d.matrix().scale(upscale);
		d.matrix().translate(size.x*0.5,size.y*0.5);
	displays["pressed"] = pressed;

	var notactive = new DO();
		d = new DOImage();
		d.image(imageInactive);
		d.size(size.x,size.y);
		notactive.addChild(d);
	displays["inactive"] = notactive;

	return displays;
}

App3DR.App.ImageEditor.prototype._testButton = function(){
	var resource = this._resource;
	var imageIconLink = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_LINK);
	var imageIconUndo = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_UNDO);
	var imageIconPlus = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_PLUS);
	var imageIconMinus = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_MINUS);
	var imageIconUndo = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_UNDO);
	var imageIconGrid = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_GRID);
	var imageIconFeature = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_FEATURE);
	var imageIconDrop = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_DROP);
	var imageIconArrow = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_ARROW_DOWN);
	var imageIconMove = resource.tex(App3DR.Resource.TEX_BUTTON_ICON_MOVE);
	//console.log(imageIconArrow)
	/*
	var button;
	var buttons = [];
	button = App3DR.App.generateButton(resource, this._root, imageIconLink);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconUndo);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconPlus);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconMinus);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconDrop);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconArrow);
	buttons.push(button);
	button = App3DR.App.generateButton(resource, this._root, imageIconFeature);
	buttons.push(button);
	var i;
	for(i=0; i<buttons.length; ++i){
		var y = 0;
		var x = i * 100;
		button = buttons[i];
		if(i>=5){
			y = 400;
			x = (i-5)*100;
		}
		button.matrix().translate(x,y);
	}
	*/

	var button = App3DR.App.generateButtonToggle(resource, this._root, [imageIconPlus, imageIconMinus, imageIconMove]);


	button.addFunction(DOButtonToggle.EVENT_TOGGLE_CHANGE, function(d){
		//console.log("toggled: "+d.toggleIndex());
		this.saveImage();
	}, this);

	button.matrix().translate(0,0);
}

// App3DR.App.ImageEditor.prototype._loadActiveViewPictureComplete = function(view){
// 	console.log("_loadActiveViewPictureComplete");
// 	console.log(view);
// 	var image = this._activeView.featuresImage();
// 	console.log(image);

// 	// set local variables
// 		var stage = this._stage;
// 		var imageSource = this._testImageSource;
// 		var imageFloat = stage.getImageAsFloatRGB(imageSource);
// 		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
// 	this._testImageMatrix = imageMatrix;
// 	this._testImageMaskMatrix = new ImageMat(imageMatrix.width(),imageMatrix.height());

// 	console.log("set");

// 	var img = this._testImageSource;
// 	var sourceWidth = img.width;
// 	var sourceHeight = img.height;
// 	var canvas = this._canvas;
// 	var size = canvas.size();
// 	siz = Math.min(size.x,size.y);
// 	size.set(siz,siz);
// 	this._explorer.setSizes(size, new V2D(sourceWidth,sourceHeight) );

// 	this._render();
// }

App3DR.App.ImageEditor.prototype.saveImage = function(){

return;

	var image = this._stage.renderImage(500,101,this._root, this._root.matrix().copy().inverse());
	//var image = this._stage.renderImage(100,100,this._root.parent());
	//var image = this._stage.renderImage(500,100,this._root);
	//var image = this._stage.renderImage(500,100,this._root);
	//var image = this._stage.renderImage(500,100,d.parent());
	//var image = this._stage.renderImage(500,100,this._displayBackground.parent());
	//var image = this._stage.renderImage(600,100,d.parent().parent());
	//var image = this._stage.renderImage(100,100,this._root, this._root.matrix());
//	console.log(image);
/*
	Code.addChild( Code.getBody(), image);
	Code.setStyleWidth( image, "200px");
*/
	var src = image.src;
//	console.log(src);
	//var string = src.replace("data:image/png;base64,","");
	///data:(.*);base64,/"
	var string = src.replace(/data:(.*);base64,/,"");
	console.log(string);
	var data = Code.base64StringToBinary(string);
	console.log(data);
	data = [data];
	// return;
	// console.log(data);

	var type = "image/png";
	//var type = 'application/octet-stream';
	var blob = new Blob(data,{"type":type});
	console.log(blob);

	var url = window.URL.createObjectURL(blob);
	var view = window;
	view.open(url, "newwindow",'width=300,height=300');



// 	next
// App3DR.js:509 toggled: 1
// App3DR.js:518 <img width=​"100" height=​"100" src=​"data:​image/​png;​base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFIklEQVR4Xu3VsRHAMAzEsHj/​pTOBXbB9pFchyLycz0eAwFXgsCFA4C4gEK+DwENAIJ4HAYF4AwSagD9IczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhH4AStUAMmSuOW2AAAAAElFTkSuQmCC">​
// Dispatch.js:37 CAUGHT ERROR FOR EVENT:  dobt.evttgl
// Dispatch.js:38 TypeError: Failed to construct 'Blob': Iterator getter is not callable.
//     at App3DR.App.ImageEditor.saveImage (App3DR.js:520)
//     at App3DR.App.ImageEditor.<anonymous> (App3DR.js:510)
//     at Dispatch.alertAll (Dispatch.js:34)
//     at DOButtonToggle.Dispatchable.alertAll (Dispatchable.js:59)
//     at DOButtonToggle.DO.alertAll (DO.js:229)
//     at DOButtonToggle.toggleIndex (DOButton.js:283)
//     at DOButtonToggle._toggleComplete (DOButton.js:276)
//     at Dispatch.alertAll (Dispatch.js:34)
//     at DOButtonToggle.Dispatchable.alertAll (Dispatchable.js:59)
//     at DOButtonToggle.

	// getARGBAsImage
	/*
	var data = ["teting data blob"];
	var type = "text/plain";

	var blob = new Blob(data,{"type":type});

	console.log(blob);


	var url = window.URL.createObjectURL(blob);
	var view = window;
	//view.open(url, "_blank");

	view.open(url, "newwindow",'width=300,height=300');
	return;
	//view.location.href = url;
	*/
}

App3DR.App.ImageEditor.prototype.testDO = function(){
	console.log("testDO");
	var d = new DO();
		this._root.addChild(d);
	var fxn = function(e){
		//console.log("e");
		console.log(e["target"]==d);
		console.log(e);
	}
	//d.addFunction(DO.EVENT_MOUSE_DOWN, fxn, this);
	//d.addFunction(Canvas.EVENT_MOUSE_DOWN, fxn, this);
	//d.addFunction(Canvas.EVENT_MOUSE_MOVE, fxn, this);
	d.addFunction(Canvas.EVENT_MOUSE_UP, fxn, this,  true);
	//Canvas.EVENT_MOUSE_MOVE


	var size = new V2D(500,500);
	//var gr = d.newGraphicsIntersection();
	var gr = d.graphics();
	gr.clear();
	gr.setFill(0xFF00FF00);
	gr.setLine(2.0, 0xCCCC0000);
	gr.beginPath();
	gr.drawRect(0,0, size.x,size.y);
	gr.endPath();
	gr.fill();
	gr.strokeLine();



}
GizmoToggle = function(root, size){
	// list of option / buttons
	// on tap go to next option / image
	// alert on change
}
GizmoRotate = function(root, size){
	// inverted-circular hit area
	// on start drag: record angle from center
	// on end drag: record final location angle delta
	// alert on changes
}
GizmoSlider = function(root, size){
	// rectangular hit area -- events: down, move, out in local coords
	// only care about up/down
	// round to some percentage of active height
	// display visuals behind hit area:
	//	small at top
	// large at bottom
	// gradient between
	// alert on changes
	this._root = root;
	this._size = size;
	var slider = new DO();
	root.addChild(slider);
	/*
	var fxn = function(){
		console.log("drag start");
	}
	slider.addListener(DO.EVENT_DRAG_BEGIN, fxn, this);

	var size = new V2D(50,50);
	var d = slider;
	d.graphics().clear();
	d.graphics().setFill(0xFF00FF00);
	d.graphics().setLine(2.0, 0xCCCC0000);
	d.graphics().beginPath();
	d.graphics().drawRect(0,0, size.x,size.y);
	//d.graphics().drawPolygon(poly,true);
	//d.graphics().drawCircle(location.x,location.y,2.0);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();

	//
	slider.enableDragging();
	*/
}
App3DR.App.ImageEditor.prototype._render = function(){
	var canvas = this._canvas;
	var size = this.size();

	var d;
	// var d = new DO();
	// 	d.graphics().clear();
	// 	d.graphics().setFill(0x9900FF00);
	// 	d.graphics().setLine(2.0, 0xCCCC0000);
	// 	d.graphics().beginPath();
	// 	d.graphics().drawRect(0,0, size.x,size.y);
	// 	//d.graphics().drawPolygon(poly,true);
	// 	//d.graphics().drawCircle(location.x,location.y,2.0);
	// 	d.graphics().endPath();
	// 	d.graphics().fill();
	// 	d.graphics().strokeLine();
	// this._root.addChild(d);

	var percentHeader = 0.15;
	var percentFooter = 0.15;
	var percentRotate = 0.1;
	var percentMove = 1.0 - percentHeader - percentRotate - percentFooter;

	var moveYStart = percentHeader;
	var moveYEnd = moveYStart+percentMove;
	var rotYStart = moveYEnd;
	var rotYEnd = rotYStart+percentRotate;

	// TODO:

	d = this._areaInterfaceMove;
d.newGraphicsIntersection();
var g = d.graphicsIntersection();
	g.clear();
	g.beginPath();
	g.drawPolygon([
		new V2D(0,size.y*moveYStart),
		new V2D(size.x,size.y*moveYStart),
		new V2D(size.x,size.y*moveYEnd),
		new V2D(0,size.y*moveYEnd)
		]);
	g.endPath();
	g.setFill(0x77FF0000);
	g.fill();

	d = this._areaInterfaceRotate;
d.newGraphicsIntersection();
var g = d.graphicsIntersection();
	g.clear();
	g.beginPath();
	g.drawPolygon([
		new V2D(0,size.y*rotYStart),
		new V2D(size.x,size.y*rotYStart),
		new V2D(size.x,size.y*rotYEnd),
		new V2D(0,size.y*rotYEnd)
		]);
	g.endPath();
	g.setFill(0x7700FF00);
	g.fill();


	var containerSize = this.size();
	var containerClipPoly = [new V2D(0,0),new V2D(size.x,0),new V2D(size.x,size.y),new V2D(0,size.y)];
	//
	d = this._root;
//	this._root.mask(true);

	d.graphics().clear();
	// d.graphics().setFill(0xFF00FF00);
	d.graphics().beginPath();
	d.graphics().drawPolygon(containerClipPoly);
	d.graphics().endPath();
//	d.graphics().fill();

	var d = this._displayBackground;
	d.drawTilePattern(0,0, size.x,size.y);
/*
		d.graphics().clear();
		d.graphics().setFill(0xFF666666);
		d.graphics().setLine(2.0, 0xCCCC0000);
		d.graphics().beginPath();
		d.graphics().drawRect(0,0, containerSize.x,containerSize.y);
		//d.graphics().drawPolygon(poly,true);
		//d.graphics().drawCircle(location.x,location.y,2.0);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
*/
	var img = this._testImageSource;
	if(img){
		var sourceWidth = img.width;
		var sourceHeight = img.height;

		var zoom = this._explorer.scale();
		var d = this._displayPixels;
			d.removeAllChildren();

		var bounds = this._explorer.bounds();
		var axes = this._explorer.axes();
		var axesX = axes["x"];
		var axesY = axes["y"];
		var axesO = axes["o"];
//console.log("bounds: "+bounds)
			// image
			//var polyA = [new V2D(o.x,o.y),new V2D(o.x+sourceWidth,0.0),new V2D(o.x+sourceWidth,o.y+sourceHeight),new V2D(0.0,o.y+sourceHeight)];
			//var polyA = [new V2D(o.x,o.y),new V2D(o.x+s.x,o.y),new V2D(o.x+s.x,o.y+s.y),new V2D(o.x,o.y+s.y)];
			var polyA = bounds;
			// container
			var polyB = containerClipPoly;//[new V2D(0,0),new V2D(size.x,0),new V2D(size.x,size.y),new V2D(0,size.y)];
			var inside = true;
			for(var i=0; i<polyA.length; ++i){
				var p = polyA[i];
				var isIn = Code.isPointInsidePolygon2D(p, polyB);
				if(!isIn){
					inside = false;
					break;
				}
			}
			//console.log("all points inside: "+inside);
			// result
			var polyC = Code.polygonIntersection2D(polyB,polyA);
			if(polyC.length>0){
				polyC = polyC[0];
			}
			// for each intersection point
			var minCoordinate = null;
			var maxCoordinate = null;
			for(var i=0; i<polyC.length; ++i){
				var scnP = polyC[i];
				var imgP = this._explorer.toLocalPoint(scnP);
				if(!minCoordinate){
					minCoordinate = imgP.copy();
					maxCoordinate = imgP.copy();
				}else{
					minCoordinate.min(imgP);
					maxCoordinate.max(imgP);
				}
			}
if(minCoordinate){
//var focusPoint = this._explorer.focusPoint();
			var minX = Math.floor(minCoordinate.x);
			var minY = Math.floor(minCoordinate.y);
			var maxX = Math.ceil(maxCoordinate.x);
			var maxY = Math.ceil(maxCoordinate.y);
			var countX = maxX-minX;
			var countY = maxY-minY;
			var count = countX * countY;
			//console.log(minCoordinate+" - "+maxCoordinate+" = "+count);
			var doSelfPixels = count<=5000 && zoom>=8;

			// do image
			var d;
			var angle = this._explorer.rotation();
			var scale = this._explorer.scale();
			var offset = this._explorer.offset();
			//var size = this._explorer.size();

			var sizeX = scale*countX;
			var sizeY = scale*countY;

// this._imageMaskSource

			// only draw image for zoomed out
			//d.graphics().alpha(0.1);
			if(!doSelfPixels){
				d = this._displayImage;
				d.matrix().identity();
				d.matrix().translate( (minX - sourceWidth*0.5)*scale, (minY - sourceHeight*0.5)*scale);
				// already scaled
				d.matrix().rotate(angle);
				d.matrix().translate(offset.x, offset.y);// center of box
				d.matrix().translate(containerSize.x*0.5, containerSize.y*0.5);
				d = this._displayImage;
				d.image(img);
				d.drawClippedImage(minX,minY,countX,countY, 0,0,sizeX,sizeY);
				d.graphics().alpha(this._displayImageAlpha);

				// MASK
				var e;
				e = this._displayMaskImage;
				if(this._imageMaskSource){
					e.image(this._imageMaskSource);
					e.drawClippedImage(minX,minY,countX,countY, 0,0,sizeX,sizeY);
					e.matrix().copy( d.matrix() );
				}
			}else{
				d = this._displayImage;
				d.matrix().identity();
				d.graphics().clear();
				d = this._displayMaskImage;
				d.matrix().identity();
				d.graphics().clear();
			}
//			d.graphics().alpha(0.1);

			// PIXELS
			d = this._displayPixels;

			d.graphics().clear();

			var dirX = axesX.copy().norm();
			var dirY = axesY.copy().norm();
			var TL = axesO.copy();
			TL.add( axesX.copy().scale(minX/sourceWidth) );
			TL.add( axesY.copy().scale(minY/sourceHeight) );
			var vectorI = dirX.copy().scale(countX*scale);
			var vectorJ = dirY.copy().scale(countY*scale);

			// do pixel colors
			if(this._testImageMatrix && doSelfPixels){ // 9604, 2500
				var imageMatrix = this._testImageMatrix;
				var maskMatrix = this._testImageMaskMatrix;
				d.graphics().setLine(0.0, 0x0);
				for(i=0; i<countX; ++i){
					var pI1 = (i/countX);
					var pI2 = ((i+1)/countX);
					for(j=0; j<countY; ++j){
						var pJ1 = (j/countY);
						var pJ2 = ((j+1)/countY);
						var a = new V2D(pI1*vectorI.x + pJ1*vectorJ.x, pI1*vectorI.y + pJ1*vectorJ.y).add(TL);
						var b = new V2D(pI2*vectorI.x + pJ1*vectorJ.x, pI2*vectorI.y + pJ1*vectorJ.y).add(TL);
						var c = new V2D(pI2*vectorI.x + pJ2*vectorJ.x, pI2*vectorI.y + pJ2*vectorJ.y).add(TL);
						var e = new V2D(pI1*vectorI.x + pJ2*vectorJ.x, pI1*vectorI.y + pJ2*vectorJ.y).add(TL);
						/*
						var isInA = Code.isPointInsidePolygon2D(a, polyB);
						var isInB = Code.isPointInsidePolygon2D(b, polyB);
						var isInC = Code.isPointInsidePolygon2D(c, polyB);
						var isInE = Code.isPointInsidePolygon2D(e, polyB);
						var isIn = isInA || isInB || isInC || isInE;
						if(!isIn){ // save some processing
							continue; // not correct if only an edge is inside -- expand the rect by a pixel length
						}
						*/
						var indI = i+minX;
						var indJ = j+minY;
						var color = imageMatrix.getHex(indI,indJ);
							color = Code.setAlpFloatARGB(color, this._displayImageAlpha);
						var col = new V2D();
						if(maskMatrix){
							maskMatrix.getPoint(col, indI,indJ);
						}
						if(col.x>0){
							col = this._maskColor;
						}else{
							col = 0x00000000;
						}
						var colors = [color,col];
						for(k=0; k<colors.length; ++k){
							var cc = colors[k];
							d.graphics().beginPath();
							d.graphics().setFill(cc);
							d.graphics().moveTo(a.x,a.y);
							d.graphics().lineTo(b.x,b.y);
							d.graphics().lineTo(c.x,c.y);
							d.graphics().lineTo(e.x,e.y);
							d.graphics().endPath();
							d.graphics().fill();
						}
						// var img = this._testImageMaskMatrix;
						var textHei = 12;
						if(zoom>=textHei*3){ // hex
							var text = Code.getHex(color&0x00FFFFFF, true).toUpperCase();
							//var inv = Code.inverseColorARGB(color); // TODO: GRAY
							var brightness = Code.brightnessFromARGB(color);
							var gray = (brightness + 0.5)%1.0;
							var col = Code.getColARGBFromFloat(1.0,gray,gray,gray);
							//var inv = Code.inverseColorARGB(color); // TODO: GRAY
							var t = new DOText(text,textHei,DOText.FONT_ARIAL,col,DOText.ALIGN_CENTER);
							t.matrix().identity();
							t.matrix().translate((a.x+c.x)*0.5 + 0, (a.y+c.y)*0.5 + textHei*0.5);
							d.addChild(t);
							// function DOText(textIN,sizeIN,fontIN,colIN,alignIN,parentDO)
						}
					}
				}
			}

		if(zoom>=4){
			var color;
			var minScale = 4;
			var maxScale = 32;
			var ranScale = (maxScale-minScale);
			var pct = (zoom-minScale)/ranScale;
			pct = Math.pow(pct,.5);//Math.log(1+pct)/Math.log(2);
			var alpha = Math.min(Math.max(pct,0),1);
			color = Code.getColARGBFromFloat(alpha,0,0,0);
			// if(zoom<=4){
			// 	color = 0x66000000;
			// }else if(color<16){
			// 	color = 0x99000000;
			// }else if(color<23){
			// 	color = 0xCC000000;
			// }else{
			// 	color = 0xFF000000;
			// }
			d.graphics().beginPath();
			d.graphics().setLine(1.0, color);
			for(i=0; i<=countX; ++i){
				var pI = (i/countX);
				var a = new V2D(pI*vectorI.x + 0.0*vectorJ.x, pI*vectorI.y + 0.0*vectorJ.y).add(TL);
				var b = new V2D(pI*vectorI.x + 1.0*vectorJ.x, pI*vectorI.y + 1.0*vectorJ.y).add(TL);
				d.graphics().moveTo(a.x,a.y);
				d.graphics().lineTo(b.x,b.y);
			}

			for(j=0; j<=countY; ++j){
				var pJ = (j/countY);
				var a = new V2D(0.0*vectorI.x + pJ*vectorJ.x, 0.0*vectorI.y + pJ*vectorJ.y).add(TL);
				var b = new V2D(1.0*vectorI.x + pJ*vectorJ.x, 1.0*vectorI.y + pJ*vectorJ.y).add(TL);
				d.graphics().moveTo(a.x,a.y);
				d.graphics().lineTo(b.x,b.y);
			}
			d.graphics().endPath();
			d.graphics().strokeLine();
		}
	}

	if(this._featuresSource){
		var scaling = this._explorer.scale();
		var line = 1.0;
		if(scaling>=2.0){
			line = Math.round(Math.sqrt(scaling));
		}
		var d = this._displayFeatures;
		d.graphics().clear();
			d.graphics().setLine(line,0xCCFF00FF);
			d.graphics().setFill(0x22FF00FF);
		d.matrix().identity();
		d.matrix().translate(0,0);

		// TODO: GET FEATURES ONLY INSIDE LOCAL WINDOW:
			// origin +
		var features = this._featuresSource;
		var f = new V2D();
		for(i=0; i<features.length; ++i){
			var feature = features[i];
			var point = feature["point"];
			var size = feature["size"];
size = size * 0.25;
			var angle = feature["angle"];
			f.set(point.x+0.5, point.y+0.5);
				var siz = size * scaling;
				var p = this._explorer.toScreenPoint(f);
				d.graphics().beginPath();
				d.graphics().drawCircle(p.x,p.y, siz);
				d.graphics().endPath();
				d.graphics().fill();
				d.graphics().strokeLine();
				d.graphics().moveTo(p.x,p.y);
				d.graphics().lineTo(p.x+siz*Math.cos(angle), p.y+siz*Math.sin(angle));
				d.graphics().strokeLine();
			// x,y position
			// z size
			// t score [color ?]
		}
	}
}
}
App3DR.App.ImageEditor.prototype._colorMaskImage = function(location, fill, diameter){
	console.log("_colorMaskImage");
	diameter = diameter!==undefined ? diameter : 1.0;
	if(!this._testImageMaskMatrix){
		return;
	}
	var img = this._testImageMaskMatrix;
	var locationX = Math.floor(location.x);
	var locationY = Math.floor(location.y);

	var changed = false;
	// TODO: skip if rect is outside
	var i, j;
	var radius = diameter*0.5;
	var radiusFloor = Math.floor(radius);
	var radiusSquare = radius * radius;
	var startI = locationX - radiusFloor;
	var endI = locationX + radiusFloor;
	var startJ = locationY - radiusFloor;
	var endJ = locationY + radiusFloor;
	for(i=startI; i<=endI; ++i){
		for(j=startJ; j<=endJ; ++j){
			var inside = Math.pow(locationX-i,2) + Math.pow(locationY-j,2) <= radiusSquare;
			if( inside && 0<=i && i<img.width() && 0<=j && j<img.height() ){
				var val = new V3D(0,0,0);
				if(fill){
					val = new V3D(1,1,1);
				}
				img.setPoint(i,j, val);
				changed = true;
			}
		}
	}
	if(changed){
		this.updateMaskImageFromMatrix(); // TODO: only when necessary at zoom-display level
	}
	return changed;
}
App3DR.App.ImageEditor.prototype._zoomIn = function(){
	this._explorer.updateScale( this._explorer.scale()*2.0 );
	this._render();
}
App3DR.App.ImageEditor.prototype._zoomOut = function(){
	this._explorer.updateScale( this._explorer.scale()*0.5 );
	this._render();
}
App3DR.App.ImageEditor.prototype._rotate = function(angle){
	this._explorer.updateRotation( this._explorer.rotation() + angle );
	this._render();
}
App3DR.App.ImageEditor.prototype._move = function(dir){
	this._explorer.updateOffset( this._explorer.offset().copy().add(dir) );
	this._render();
}
App3DR.App.ImageEditor.prototype.handleKeyDown = function(e){
	App3DR.App.ImageEditor._.handleKeyDown.call(this, e);
	var moveSize = 10;
	if(e.keyCode == Keyboard.KEY_LET_Q){
		this._zoomIn();
	}else if(e.keyCode == Keyboard.KEY_LET_W){
		this._zoomOut();
	}else if(e.keyCode == Keyboard.KEY_LET_A){
		this._rotate( Code.radians(10.0) );
	}else if(e.keyCode == Keyboard.KEY_LET_S){
		this._rotate( -Code.radians(10.0) );
	}else if(e.keyCode == Keyboard.KEY_LEFT){
		this._move( new V2D(-moveSize,0) );
	}else if(e.keyCode == Keyboard.KEY_RIGHT){
		this._move( new V2D(moveSize,0) );
	}else if(e.keyCode == Keyboard.KEY_UP){
		this._move( new V2D(0,-moveSize) );
	}else if(e.keyCode == Keyboard.KEY_DOWN){
		this._move( new V2D(0,moveSize) );

// edit mode

	}else if(e.keyCode == Keyboard.KEY_LET_Z){
		this._editingMode = App3DR.App.ImageEditor.EDIT_MODE_ERASE;
	}else if(e.keyCode == Keyboard.KEY_LET_X){
		this._editingMode = App3DR.App.ImageEditor.EDIT_MODE_DRAW;
	}else if(e.keyCode == Keyboard.KEY_LET_C){
		this._editingMode = App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	}else if(e.keyCode == Keyboard.KEY_LET_P){
		var alpha = this._displayBackground.graphics().alpha();
		if(alpha<0.5){
			this._displayBackground.graphics().alpha(1.0);
		}else{
			this._displayBackground.graphics().alpha(0.1);
		}
	}
}
App3DR.App.ImageEditor.prototype.moveAreaHandleMouseUp = function(e){
	var move = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	if(move){
		var data = e["data"];
		var location = data["location"];
		this._explorer.mouseUp(location);
		this.moveAreaCancel();
		this._render();
	}
}
App3DR.App.ImageEditor.prototype.moveAreaHandleMouseDown = function(e){
	var move = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	var data = e["data"];
	var location = data["location"];
	//var move = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	var add = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_DRAW;
	var remove = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_ERASE;
	var edit = add || remove;
	if(move){

		this._explorer.mouseDown(location);
		this._render();
		this._areaInterfaceMove.addFunction(Canvas.EVENT_MOUSE_MOVE, this.moveAreaHandleMouseMove, this, true);
	}else if(edit){
		var target = this._areaInterfaceMove;//e["target"];
		var sourcePoint = location.copy();
		var sourceElement = target;
		var destinationElement = this._stage.root(); //this._root;//this._stage.root(); // this._root; // this._areaInterfaceRotate;
		var destinationPoint = new V2D();
		var local = DO.pointLocalUp(destinationPoint,sourcePoint,sourceElement,destinationElement);
		var imageLocation = this._explorer.toLocalPoint(local);
	//var diameter = 3;
	//var diameter = 4;
	//var diameter = 5;
	//var diameter = 6;
	var diameter = 7; // TODO: MULT BY SCALE & round
		var colored = this._colorMaskImage(imageLocation, add?true:false, diameter);
		if(colored){
			this._render();
		}
	}
}
App3DR.App.ImageEditor.prototype.moveAreaCancel = function(){
	this._areaInterfaceMove.removeFunction(Canvas.EVENT_MOUSE_MOVE, this.moveAreaHandleMouseMove, this, true);
}
App3DR.App.ImageEditor.prototype.moveAreaHandleMouseMove = function(e){
	Code.eventPreventDefault(e);
	var move = this._editingMode === App3DR.App.ImageEditor.EDIT_MODE_MOVE;
	if(move){
		var data = e["data"];
		var location = data["location"];
		var target = e["target"];
		if(target==this._areaInterfaceMove){
			this._explorer.mouseMove(location);
		}else{ // move out = donw
			this._explorer.mouseUp(location);
			this.moveAreaCancel();
		}
		this._render();
	}
}


App3DR.App.ImageEditor.prototype._toRotationAngle = function(location){
	var destinationPoint = new V2D();
	var sourcePoint = location.copy();
	//var sourceElement = target;
	var sourceElement = this._areaInterfaceRotate;
	var destinationElement = null; // this._root; // this._areaInterfaceRotate;
	DO.pointLocalUp(destinationPoint,sourcePoint,sourceElement,destinationElement);
	var point = destinationPoint;

	var size = this._explorer.containerSize();
	var center = size.copy().scale(0.5);
	var oToP = V2D.sub(point,center);
	var angle = V2D.angleDirection(V2D.DIRX,oToP);
	return angle;
}
App3DR.App.ImageEditor.prototype.rotateAreaHandleMouseDown = function(e){
	var rotate = true;
	console.log("rotateAreaHandleMouseDown");
	if(rotate){
		var data = e["data"];
		var location = data["location"];
		var angle = this._toRotationAngle(location);
		var angleA = this._explorer.rotation();
		this._rotationAngle = angle;
		this._rotationAngleStart = angleA;
		this._areaInterfaceRotate.addFunction(Canvas.EVENT_MOUSE_MOVE, this.rotateAreaHandleMouseMove, this, true);
		this._areaInterfaceRotate.addFunction(Canvas.EVENT_MOUSE_UP, this.rotateAreaHandleMouseUp, this, true);
	}
}
// App3DR.App.ImageEditor.prototype.moveAreaCancel = function(){
// 	this._areaInterfaceMove.removeFunction(Canvas.EVENT_MOUSE_MOVE, this.moveAreaHandleMouseMove, this, true);
// }
App3DR.App.ImageEditor.prototype.rotateAreaHandleMouseMove = function(e){
	Code.eventPreventDefault(e);
	var rotate = this._rotationAngleStart!=null;
	if(rotate){
		var data = e["data"];
		var location = data["location"];
		var angle = this._toRotationAngle(location);
		this._updateRotationAngle(angle);
	}
}
App3DR.App.ImageEditor.prototype.rotateAreaHandleMouseUp = function(e){
	var rotate = this._rotationAngleStart!=null;
	if(rotate){
		var data = e["data"];
		var location = data["location"];
		var angle = this._toRotationAngle(location);
		this._updateRotationAngle(angle);
		this._rotationAngleStart = null;
		this._areaInterfaceRotate.removeFunction(Canvas.EVENT_MOUSE_MOVE, this.rotateAreaHandleMouseMove, this, true);
		this._areaInterfaceRotate.removeFunction(Canvas.EVENT_MOUSE_UP, this.rotateAreaHandleMouseUp, this, true);

	}
}
App3DR.App.ImageEditor.prototype._updateRotationAngle = function(angle){
	var angleA = this._rotationAngle;
	var angleB = angle;
	//var diff = Code.minAngle(angleA,angleB);
	var diff = angleB-angleA;
	var fin = this._rotationAngleStart + diff;
	var rounding = Code.radians(15.0);
	var rounded = Math.round(fin/rounding)*rounding;
	fin = rounded;
	this._explorer.updateRotation(fin);
	this._render();
}



App3DR.App.ImageEditor.EDIT_MODE_UNKNOWN = 0;
App3DR.App.ImageEditor.EDIT_MODE_MOVE = 1;
App3DR.App.ImageEditor.EDIT_MODE_ERASE = 2;
App3DR.App.ImageEditor.EDIT_MODE_DRAW = 3;
App3DR.App.ImageEditor.prototype.handleMouseUp = function(e){
	App3DR.App.ImageEditor._.handleMouseUp.call(this, e);
}
App3DR.App.ImageEditor.prototype.handleMouseMove = function(e){
	App3DR.App.ImageEditor._.handleMouseMove.call(this, e);
}
App3DR.App.ImageEditor.prototype.handleMouseDown = function(e){
	App3DR.App.ImageEditor._.handleMouseDown.call(this, e);
}





// ------------------------------------------------------------------


App3DR.App.Model3D = function(resource, manager){
	App3DR.App.Model3D._.constructor.call(this, resource);
	console.log("Model3D");
console.log("TODO: UNDO");
//return; // TODO: REMOVE
	this._displayData = null;
	this._display = new DO();
	this._root.addChild(this._display);

	//this._camera = new App3DR.App.Model3D.Camera();
	this._camera = new Cam3D();
	console.log(this._camera);


	// interaction
	this._sphereMatrix = new Matrix3D();
	this._sphereMatrix.identity();

	this._userInteractionMatrix = new Matrix3D();
	this._userInteractionMatrix.identity();

	// this._siDirection = new V3D(1,0,0);
	// this._upDirection = new V3D(0,1,0);
	// this._inDirection = new V3D(0,0,1);

	//this._camera = new App3DR.App.Model3D.Camera();


	var frameRate = 1000.0/20.0;
	this._canvas3D = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,true);
    this._stage3D = new StageGL(this._canvas3D, frameRate, this.getVertexShaders(), this.getFragmentShaders());
    this._canvas3D.addListeners();
  	this._stage3D.setBackgroundColor(0xFF000000);
  	this._stage3D.frustrumAngle(35);
	this._stage3D.enableDepthTest();
	this._stage3D.setViewport(0,0,this._canvas3D.width(),this._canvas3D.height());
	this._stage3D.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this._eff, this);
	this._stage3D.start();


	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_DOWN, this.onMouseDownFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_UP, this.onMouseUpFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_MOVE, this.onMouseMoveFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_WHEEL, this.onMouseWheelFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_CLICK, this.onMouseClickFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_EXIT, this.onMouseExitFxn3D, this);

	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	this._keyboard.addListeners();


	this._time = 0;
}
Code.inheritClass(App3DR.App.Model3D, App3DR.App);


App3DR.App.Model3D.prototype._loadedViewTexture = function(input){
	var i;
	++this._loadedTextures;
	// console.log("_loadedViewTexture: "+this._loadedTextures+"=="+this._expectedTextures);
	// console.log(this._loadedTextures==this._expectedTexture);

	if(this._loadedTextures!=this._expectedTextures){
		return;
	}
	this._bindAfterTexturesLoaded();
}
App3DR.App.Model3D.prototype._bindAfterTexturesLoaded = function(){
	// console.log("_bindAfterTexturesLoaded");
	this._textures = [];
	var nextIndex = 0;

	this._renderTextureUVList = [];
	this._renderTexturePointList = [];
	this._textureUVPoints = [];
	this._textureVertexPoints = [];

	var lines = [];

	var views = this._views;
	for(i=0; i<views.length; ++i){
		var view = views[i];
		var transform = view["transform"];
		var tx = transform.get(0,3);
		var ty = transform.get(1,3);
		var tz = transform.get(2,3);
		var o = new V3D(0,0,0);
		var x = new V3D(1,0,0);
		var y = new V3D(0,1,0);
		var z = new V3D(0,0,1);
		// var z = new V3D(0,0,-1);
		o = transform.multV3DtoV3D(o);
		x = transform.multV3DtoV3D(x);
		y = transform.multV3DtoV3D(y);
		z = transform.multV3DtoV3D(z);
		var dirX = V3D.sub(x,o);
		var dirY = V3D.sub(y,o);
		var dirZ = V3D.sub(z,o);
		lines.push(o,x);
		lines.push(o,y);
		lines.push(o,z);
//		console.log("VIEW ORIGIN : "+o);


		var K = view["K"];
// console.log(K);
// 		if(!K || K.cols()==0){
// 			K = new Matrix(3,3).fromArray([1,0,0, 0,1,0, 0,0,1]);
// 		}
// console.log(K);
		var image = view["image"];
		var obj = this._viewImages[i];
//console.log(image.width,image.height)
//Code.addChild(Code.getBody(), image);
		if(obj){
			var texture = obj["texture"];
			var original = obj["original"];
//console.log(texture);
console.log(texture.complete+" ? ");
console.log(texture.width,texture.height);
			var horz = obj["width"];
			var vert = obj["height"];
			var bind = this._canvas3D.bindTextureImageRGBA(texture);
			obj["bind"] = bind;
			this._textures.push(bind);

// TODO: PROJECT TL/TR/BR/BL TO RAY & INTERSECT WITH PLANE+NORM*delta
//
//
//console.log(K)
			var wid = image.width;
			var hei = image.height;
			var fx = K.get(0,0);
			var fy = K.get(1,1);
			var cx = K.get(0,2);
			var cy = K.get(1,2);
			var s = K.get(0,1);
			var camWid = 1.0;
camWid = 0.20;
			var camHei = camWid*(hei/wid);
			var fyOfx = fy/fx;
//console.log("CAM WID: "+camWid+" x "+camHei);
//console.log("fyOfx: "+fyOfx);
//s = 0.25;
			var CX = camWid * cx;
			var CY = camHei * cy;
			var SX = camHei * cy * s; // top left offset
			var FX = camHei * s; // full offset

//console.log(dirX.length(),dirY.length(),dirZ.length());


			var off = dirZ.copy().scale(camWid * fx);
			var pBL = o.copy().add( dirX.copy().scale(-CX) ) .add( dirY.copy().scale(CY) )  .add( dirX.copy().scale(SX) );
			pBL.add( off );
			var pBR = pBL.copy().add( dirX.copy().scale(camWid) );
			var pTR = pBL.copy().add( dirX.copy().scale(camWid) ).add( dirY.copy().scale(-camHei) ) .add( dirX.copy().scale(FX) );
			var pTL = pBL.copy().add( dirY.copy().scale(-camHei) ) .add( dirX.copy().scale(FX) );

			var uvList = [0,vert, horz,vert, horz,1,  horz,1, 0,1, 0,vert];
			var vertList = [pBL.x,pBL.y,pBL.z, pBR.x,pBR.y,pBR.z, pTR.x,pTR.y,pTR.z,   pTR.x,pTR.y,pTR.z, pTL.x,pTL.y,pTL.z, pBL.x,pBL.y,pBL.z];

			console.log("SRZ: "+horz+" x "+vert);
		// if(i==0){
		// if(i==1){
		if(false){ // none
		//if(true){ // overlapping
			console.log("CREATE TEXTURES HERE");
			var triangleInfo = this._triangulateSurface(i);
			//console.log(triangleInfo);
			var triangles = triangleInfo["triangles"];
			for(var t=0; t<triangles.length; ++t){
				var tri = triangles[t];
				var p2Ds = tri["2D"];
				var p3Ds = tri["3D"];
				for(var k=0; k<3; ++k){
					var x = p2Ds[k].x;
					var y = p2Ds[k].y;
					x = x / original.width;
					y = y / original.height;
					x = x * horz;

					// y flipped
					// y = y * (1.0 - vert);
					// y = 1 - y;

					// single line
					y = 1 + y*vert - y;

					uvList.push(x,y);
					vertList.push(p3Ds[k].x,p3Ds[k].y,p3Ds[k].z);
				}
			}
			console.log(uvList);
			console.log(vertList);
		}

			this._renderTextureUVList[nextIndex] = uvList;
			this._renderTexturePointList[nextIndex] = vertList;
			++nextIndex;




			// add lines:
			var points = this._points3D;
//			console.log(points)
			for(var j=0; j<points.length; ++j){
				var v = points[j];
				lines.push(o,v);
			}
		}
	}




	// set textures:
	//console.log(this._textures)

	this._stage3D.selectProgram(1);
	this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._textureCoordAttrib = this._stage3D.enableVertexAttribute("aTextureCoord");

	var len = this._textures.length;
	for(i=0; i<len; ++i){
		var texturePoints = this._renderTextureUVList[i];
		var vertexPoints = this._renderTexturePointList[i];
		this._textureUVPoints[i] = this._stage3D.getBufferFloat32Array(texturePoints, 2);
		this._textureVertexPoints[i] = this._stage3D.getBufferFloat32Array(vertexPoints, 3);
	}

console.log("GOT STUFF ?");
	// set lines
	this.setLines(lines);

	// reset points with colors now avail:
	this.setPoints(this._points3D, this._points2D, this._originalPoints);

}

App3DR.App.Model3D.prototype.setViews = function(input){
	console.log("setViews");
	var i;
	this._viewImages = [];
	this._expectedTextures = input.length;
	this._loadedTextures = 0;

	this._views = input;
	for(i=0; i<input.length; ++i){
		var view = input[i];
		console.log(view);
		var image = view["image"];
		var imageMatrix = R3D.imageMatrixFromImage(image, this._stage);
		view["matrix"] = imageMatrix;
		var obj = null;
		if(image){
			var self = this;
			var obj = this._stage.textureBase2FromImage(image, function(e){
				self._loadedViewTexture();
			});
			obj["original"] = image;
		}else{
			++this._loadedTextures;
		}
		this._viewImages[i] = obj;
	}

}
App3DR.App.Model3D.prototype.setTextures = function(input){
	// ...
}
App3DR.App.Model3D.prototype.setLines = function(input){
	// CREATE LINES:
	var points = [];
	var colors = [];
	for(var i=0; i<input.length; ++i){
break;
		var v = input[i];
		points.push(v.x,v.y,v.z);
// NEGATIVE Z:
// points.push(v.x,v.y,-v.z);
		// colors.push(1.0,1.0,1.0,0.05);
		colors.push(0.1,0.1,0.1,0.02);
		// colors.push(0.1,0.1,0.1,0.005);
	}
	// create objects
	this._stage3D.selectProgram(2);
	this._programLineVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._programLineVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
	this._programLinePoints = this._stage3D.getBufferFloat32Array(points, 3);
	this._programLineColors = this._stage3D.getBufferFloat32Array(colors, 4);
}
App3DR.App.Model3D.prototype.setPoints = function(input3D, input2D, hasImages){
	//console.log(this._viewImages);
	var viewTable = {};
	if(this._views) {
		for(var i=0; i<this._views.length; ++i){
			var view = this._views[i];
			var index = view["id"];
			viewTable[index] = view;
		}
	}
	// CREATE POINTS:
	this._points3D = input3D;
	this._points2D = input2D;
	console.log("setPoints ---");
	console.log(input3D);
	console.log(input2D);

	var colors = [];
// ONLY WORKS FOR PAIR OF IMAGES
// var useErrors = true;
var useErrors = false;
	useErrors = useErrors && hasImages;
	if(useErrors ){
		var views = this._views;
// console.log(views);
// throw "?";
		var viewA = views[0];
		var viewB = views[1];
		// ...
		var pointsA = input2D[0];
		var pointsB = input2D[1];
		var points3D = input3D;
		var F = R3D.fundamentalFromLargeDataset(pointsA,pointsB,1000);
		var Finv = R3D.fundamentalInverse(F);
		// var fError = R3D.fErrorList(F, Finv, pointsA, pointsB);
		var cameraA = viewA["transform"];
		var cameraB = viewB["transform"];
		var extrinsicA = R3D.extrinsicMatrixFromCameraMatrix(cameraA);
		var extrinsicB = R3D.extrinsicMatrixFromCameraMatrix(cameraB);

		var imageA = viewA["matrix"];
		var imageB = viewB["matrix"];

		var imageSizeA = imageA.size().copy();
		var imageSizeB = imageB.size().copy();

		var Ka = viewA["K"];
		var Kb = viewB["K"];

			Ka = R3D.cameraFromScaledImageSize(Ka, imageSizeA);
			Kb = R3D.cameraFromScaledImageSize(Kb, imageSizeB);



		var errors = [];
		// console.log(pointsA);
		// throw "?";
		for(var i=0; i<pointsA.length; ++i){
			var pointA = pointsA[i];
			var pointB = pointsB[i];
				pointA = new V2D(pointA.x,pointA.y);
				pointB = new V2D(pointB.x,pointB.y);
				pointA = pointA.copy().scale(imageSizeA.x,imageSizeA.y);
				pointB = pointB.copy().scale(imageSizeB.x,imageSizeB.y);
			var point3D = points3D[i];
			// var error = R3D.fError(F, Finv, pointA, pointB);
			var error = R3D.reprojectionError(point3D, pointA,pointB, extrinsicA, extrinsicB, Ka, Kb);
			// var error = R3D.reprojectionError(point3D, pointA,pointB, cameraA, cameraB, Ka, Kb);
			errors.push(error["error"]);
		}
		// Code.printMatlabArray(errors,"errors");
		// console.log(errors);
		ImageMat.normalFloat01(errors);
		// exaggerate
		// ImageMat.pow(errors, 2); // fewer red
		// ImageMat.pow(errors, 0.5); // more red
		var colorList = [0xFF0000FF, 0xFFFF0000];
		var locationList = [0.0,1.0];
		for(var i=0; i<errors.length; ++i){
			var err = errors[i];
			var col = Code.interpolateColorGradientARGB(err, colorList,locationList);
				col = Code.getFloatARGB(col);
			colors.push(col[1],col[2],col[3],col[0]);
		}
	}
	console.log("COLORED");



	// TRIM SO ONLY POINTS IN 0 & 1 are displayed:

	var points = [];

	for(var i=0; i<input3D.length; ++i){
		var v = input3D[i];
		points.push(v.x,v.y,v.z);


// NEGATIVE Z:
if(useErrors){
}else{
//		points.push(v.x,v.y,-v.z);
		var imageSuccess = false;
		if(hasImages){
			// get color from images
			var vList = hasImages[i]["views"];
			if(vList){
				var item = vList[0]; // just grab 1
				var vIndex = item["view"];
				var view = viewTable[vIndex];
				var image = view["matrix"];
				var pnt = new V2D(item["x"],item["y"]);
				var wid = image.width();
				var hei = image.height();
				pnt.scale(wid, hei);
				var x = Math.min(Math.max(Math.round(pnt.x),0),wid-1);
				var y = Math.min(Math.max(Math.round(pnt.y),0),hei-1);
				var index = y*wid + x;
				var red = image.red()[index];
				var grn = image.grn()[index];
				var blu = image.blu()[index];
				colors.push(red,grn,blu,1.0);
				imageSuccess = true;
			}else{
				// console.log(hasImages);
				// console.log(hasImages[i]);
				// throw "?";
			}
		}
		if(!imageSuccess){
			colors.push(0.5,0.5,0.5,0.5);
		}
}
		// if(i>33){
		// 	console.log(v+"");
		// 	break;
		// }
	}
	this._pointVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._pointVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");

	this._pointPointBuffer = this._stage3D.getBufferFloat32Array(points,3);
	this._pointColorBuffer = this._stage3D.getBufferFloat32Array(colors,4);
}

App3DR.App.Model3D.prototype._triangulateSurface = function(surfaceUse){
	var views = this._views;
	if(views) {
		console.log("TRIANGULATE SURFACE");
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var index = view["id"];
			//viewTable[index] = view;
		}
		//
		// var surfaceUse = 0;
		var view = views[surfaceUse];
		var points2D = this._points2D[surfaceUse];
		var points3D = this._points3D;
		console.log(points2D);

		var images = this._viewImages;
		var image = images[surfaceUse];
		var original = image["original"];
		var texture = image["texture"];
		var bind = image["bind"];
		var width = original.width;
		var height = original.height;
		console.log("scale to: "+width+"x"+height);

		// create:
		var triangulator = new Triangulator();
		for(i=0; i<points2D.length; ++i){
			var point2D = points2D[i];
			var point3D = point2D["3D"];
			var p = new V2D(point2D["x"],point2D["y"]);
			//p.scale(width);
			p.scale(width,height);
			triangulator.addPoint(p,{"data":point2D, "2D":p, "3D":point3D});
			// if(i>=1000){
			// 	break;
			// }
		}

		var tris = triangulator.triangles();
		var datas = triangulator.datas();
		var points = triangulator.points();
		console.log(tris);
		console.log(datas);
		console.log(points);
		var output = [];
		for(var i=0; i<tris.length; ++i){
			var t = tris[i];
			var pA = datas[t[0]];
			var pB = datas[t[1]];
			var pC = datas[t[2]];
			output.push({"2D":[pA["2D"],pB["2D"],pC["2D"]], "3D":[pA["3D"],pB["3D"],pC["3D"]]});
		}
		return {"triangles":output, "texture":bind};
	}
	return null;
	/*
	// create textures
	var pointsA = this._cameraPointsA;
	var pointsB = this._cameraPointsB;
	var points3D = this._cameraPoints3D;

	// create delauny triangulation from one of the images
	var triangulator = new Triangulator();
	for(i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];

		var pointB = pointsB[i];

		var point3 = points3D[i];
		var pointUse = pointB;
		triangulator.addPoint(pointUse,{"A":pointA,"B":pointB,"3":point3});
	}
	var tris = triangulator.triangles();
	var datas = triangulator.datas();
	var points = triangulator.points();
	console.log(tris);
	console.log(datas);
	//
	var triA, triB, tri3D;
	var renderTris = [];
	var mappings = [];
	var textureMap = new TextureMap();
	for(i=0; i<tris.length; ++i){
		var tri = tris[i];
		var a = tri[0];
		var b = tri[1];
		var c = tri[2];
		// a = points[a];
		// b = points[b];
		// c = points[c];
		var aA = datas[a]["A"];
		var aB = datas[b]["A"];
		var aC = datas[c]["A"];
		var bA = datas[a]["B"];
		var bB = datas[b]["B"];
		var bC = datas[c]["B"];
		var cA = datas[a]["3"];
		var cB = datas[b]["3"];
		var cC = datas[c]["3"];
//		console.log(aA+" ? "+bA);
		//
		triA = new Tri2D(aA,aB,aC);
		triB = new Tri2D(bA,bB,bC);
		tri3D = new Tri3D(cA,cB,cC);
		var mapping = textureMap.addTriangle(tri3D, [triA,triB], [imageMatrixA,imageMatrixB]);
		//var mapping = textureMap.addTriangle(tri3D, [triA], [imageMatrixA]);
		//var mapping = textureMap.addTriangle(tri3D, [triB], [imageMatrixB]);
		mappings.push(mapping);
//if(i>100){
//if(i>1000){ // start to slow
//if(i>2000){
//if(i>3000){
if(i>5000){ // arbitrarily large
	break;
}
	}
	console.log(mappings.length);

	textureMap.pack();
	console.log(" packed ");

	for(i=0; i<mappings.length; ++i){
		var mapping = mappings[i];
		var textureMatrix = mapping.image();
		var triOrigin = mapping.triImage();
		var tri3D = mapping.tri3D();
		var img = mapping.imageDOM();
		//console.log(triOrigin)
		//var img = GLOBALSTAGE.getFloatRGBAsImage(textureMatrix.red(),textureMatrix.grn(),textureMatrix.blu(), textureMatrix.width(),textureMatrix.height());
		//Code.addChild(Code.getBody(), img);
		var renderTri = null;//new Tri2D( new V2D(100,100), new V2D(150,120), new V2D(100,60) );
		var tri = new DOTri(img, renderTri, triOrigin);
		renderTris.push([tri,tri3D]);
	}
console.log("mappings "+mappings.length);
	this._renderTris = renderTris;




	????
	*/
}

App3DR.App.Model3D.prototype.onMouseDownFxn3D = function(e){

}
App3DR.App.Model3D.prototype.onMouseUpFxn3D = function(e){

}
App3DR.App.Model3D.prototype.onMouseMoveFxn3D = function(e){
	Code.eventPreventDefault(e);
}
App3DR.App.Model3D.prototype.onMouseWheelFxn3D = function(e){

Code.eventPreventDefault(e);



if(this._keyboard.isKeyDown(Keyboard.KEY_LET_O)){ // left/right
	if(!this._XXX){
		this._XXX = true;
		this._bindAfterTexturesLoaded();
	}
}

	var scroll = e["scroll"];
	var orientation = this._camera.orientation();

	var x = orientation["x"];
	var y = orientation["y"];
	var z = orientation["z"];
	var o = orientation["o"];

	//console.log(this._distanceRange);

	var scaleSize = this._distanceRange * 0.00001;
	//var scaleSize = this._distanceRange * 0.000001; // with a LOT OF ERROR this is better
	var scaleAngle = 0.001;

	if(this._keyboard.isKeyDown(Keyboard.KEY_SHIFT)){
		scaleSize *= 0.1;
		scaleAngle *= 0.25;
	}


// ROTATIONS
	if(this._keyboard.isKeyDown(Keyboard.KEY_LET_Z)){ // left/right
y = new V3D(0,1,0);
		var dirY = y.copy().scale(scroll.x);
		var rot = dirY.copy().norm();
		var mag = dirY.length() * scaleAngle;
		this._camera.rotate(rot, mag);
	}else if(this._keyboard.isKeyDown(Keyboard.KEY_LET_X)){ // up/down
x = new V3D(1,0,0);
		var dirX = x.copy().scale(scroll.y);
		var rot = dirX.copy().norm();
		var mag = dirX.length() * scaleAngle;
		this._camera.rotate(rot, mag);
	}else if(this._keyboard.isKeyDown(Keyboard.KEY_LET_C)){ // around
z = new V3D(0,0,1);
		var dirZ = z.copy().scale(scroll.y);
		var rot = dirZ.copy().norm();
		var mag = dirZ.length() * scaleAngle;
		this._camera.rotate(rot, mag);
// TRANSLATIONS
	}else if(this._keyboard.isKeyDown(Keyboard.KEY_LET_S)){ // up/down
y = new V3D(0,1,0);
		var dirY = y.copy().scale(-scroll.y * scaleSize);
		this._camera.translate(dirY);
	}else if(this._keyboard.isKeyDown(Keyboard.KEY_LET_A)){ // left/right
x = new V3D(1,0,0);
		var dirX = x.copy().scale(scroll.x * scaleSize);
		this._camera.translate(dirX);
	}else{ // in/out
z = new V3D(0,0,1);
		var dirZ = z.copy().scale(scroll.y * scaleSize);
		this._camera.translate(dirZ);
	}

}
App3DR.App.Model3D.prototype.onMouseClickFxn3D = function(e){

}
App3DR.App.Model3D.prototype.onMouseExitFxn3D = function(e){

}

App3DR.App.Model3D.prototype._eff = function(){
	++this._time;

	this.rotateScene();

	// RENDERING:
	this._stage3D.clear();

	this._stage3D.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);

	// RENDER TEXTURES
	if(this._textureUVPoints && this._textureUVPoints.length>0){
		this._stage3D.selectProgram(1);
		this._stage3D.disableCulling();
		this._stage3D.matrixReset();
		//console.log(this._textureUVPoints.length)
		for(var i=0; i<this._textureUVPoints.length; ++i){
			this._stage3D.bindArrayFloatBuffer(this._textureCoordAttrib, this._textureUVPoints[i]);
			this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._textureVertexPoints[i]);
			this._canvas3D._context.activeTexture(this._canvas3D._context.TEXTURE0);
			// console.log( this._canvas3D._context.TEXTURE0 )
			this._canvas3D._context.bindTexture(this._canvas3D._context.TEXTURE_2D,this._textures[i]);
			this._canvas3D._context.uniform1i(this._canvas3D._program.samplerUniform, 0); //
			this._stage3D.drawTriangles(this._vertexPositionAttrib, this._textureVertexPoints[i]);
		}
	}
	// RENDER POINTS

	if(this._pointPointBuffer && this._pointPointBuffer.length>0){
		this._stage3D.selectProgram(3);
		this._stage3D.disableCulling();
		this._stage3D.matrixReset();
		this._stage3D.bindArrayFloatBuffer(this._pointVertexPositionAttrib, this._pointPointBuffer);
		this._stage3D.bindArrayFloatBuffer(this._pointVertexColorAttrib, this._pointColorBuffer);
		this._stage3D.drawPoints(this._pointVertexPositionAttrib, this._pointPointBuffer);
	}

	// RENDER LINES
	if(this._programLinePoints && this._programLinePoints.length>0){
		this._stage3D.selectProgram(2);
		this._stage3D.matrixReset();
		this._stage3D.disableCulling();
		this._stage3D.bindArrayFloatBuffer(this._programLineVertexPositionAttrib, this._programLinePoints);
		this._stage3D.bindArrayFloatBuffer(this._programLineVertexColorAttrib, this._programLineColors);
		this._stage3D.drawLines(this._programLineVertexPositionAttrib, this._programLinePoints);
	}


	/*


	gl.vertexAttribPointer(shaderTexCoordAttribute, obj.texCoordSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
        gl.uniform1i(shaderSamplerUniform, 0);



 gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareTitleVertexPositionBuffer.numItems);




		gl.bindBuffer(gl.ARRAY_BUFFER, squareTextVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareTextVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, squareTextVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareTextVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
	*/
}
App3DR.App.Model3D.prototype.rotateScene = function(){




	var e = this._time;


	this._sphereMatrix.identity();
//	this._sphereMatrix.rotateVector( (new V3D(0,1,0)).norm(), Code.radians(e) );


	var matrix = this._camera.matrix();


	var transform = new Matrix3D();
	transform.identity();
	transform.mult(transform, this._sphereMatrix);
	//transform.mult(transform, this._userInteractionMatrix);

	transform.mult(transform, matrix);


	this._stage3D.matrixSetFromMatrix3D(transform);
}
App3DR.App.Model3D.prototype.what = function(location){
	// POINTS
	this._stage3D.selectProgram(3);
	this._pointVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._pointVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
	this._pointPointBuffer = this._stage3D.getBufferFloat32Array(points,3);
	this._pointColorBuffer = this._stage3D.getBufferFloat32Array(colors,4);

/*

load imageA, imageB
load data: camera centers, 2D points, 3D points, ...



show 3D point dots
show camera center
show camera/image screens [textured rects]
show lines from camera center to dots

show surface triangulation
show surface textures

*/
}
App3DR.App.Model3D.Camera = function(){
	// this._pos = new V3D();
	// this._rot = new V3D();
}

// App3DR.App.Model3D.Camera.prototype.identity = function(){
// 	this._pos.set(0,0,0);
// 	this._rot.set(1,0,0);
// }



App3DR.App.Model3D.prototype.getVertexShaders = function(){
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
App3DR.App.Model3D.prototype.getFragmentShaders = function(){
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

// ------------------------------------------------------------------





App3DR.Explorer2D = function(){
	this._containerSize = new V2D();
	this._subjectSize = new V2D();
	this._subjectCenter = new V2D();
	this._subjectScale = 1.0;
	this._subjectRotation = 0.0;
	//
	this._scaleRangeMin = Math.pow(2,-5); //0.1; 1/32
	this._scaleRangeMax = Math.pow(2,7); //10.0;   64
	this._rotateRangeMin = null;
	this._rotateRangeMax = null;
//	this._focus = new V2D();
}
App3DR.Explorer2D.prototype.containerSize = function(){
	return this._containerSize;
}
App3DR.Explorer2D.prototype.offset = function(){
	return this._subjectCenter;
}
App3DR.Explorer2D.prototype.scale = function(){
	return this._subjectScale;
}
App3DR.Explorer2D.prototype.rotation = function(){
	return this._subjectRotation;
}
App3DR.Explorer2D.prototype.center = function(){
	var center = this._containerSize.copy().scale(0.5);
	center.add(this._subjectCenter);
	return center;
}
App3DR.Explorer2D.prototype.size = function(){
	var size = this._subjectSize.copy().scale(this._subjectScale);
	return size;
}
//App3DR.Explorer2D.prototype.boundingBox = function(){
App3DR.Explorer2D.prototype.axes = function(){
	var bounds = this.bounds();
	var o = bounds[0];
	var x = V2D.sub(bounds[1],bounds[0]);
	var y = V2D.sub(bounds[3],bounds[0]);
	return {"x":x, "y":y, "o":o};
}
App3DR.Explorer2D.prototype.toScreenPoint = function(p){
	var matrix = this._matrix();
	var q = matrix.multV2D(p);
	return q;
}
App3DR.Explorer2D.prototype.toLocalPoint = function(p){
	var matrix = this._matrix();
	var inverse = matrix.copy().inverse();
	var q = inverse.multV2D(p);
	return q;
}
App3DR.Explorer2D.prototype._matrix = function(){
	var container = this._containerSize;
	var subject = this._subjectSize;
	var offset = this._subjectCenter;
	var matrix = new Matrix2D();
		matrix.translate(-subject.x*0.5, -subject.y*0.5); // center to origin
		matrix.scale(this._subjectScale);
		matrix.rotate(this._subjectRotation);
		matrix.translate(container.x*0.5, container.y*0.5); // to center
		matrix.translate(offset.x, offset.y); // to offset
	return matrix;
}
App3DR.Explorer2D.prototype.bounds = function(){
	//var size = this.size();
	var container = this._containerSize;
	var subject = this._subjectSize;
	var offset = this._subjectCenter;
	var matrix = this._matrix();
	var a = new V2D(0,0);
	var b = new V2D(subject.x,0);
	var c = new V2D(subject.x,subject.y);
	var d = new V2D(0,subject.y);
	var array = [a,b,c,d];
	for(var i=0; i<array.length; ++i){
		array[i] = matrix.multV2D(array[i]);
	}
	return array;
}
App3DR.Explorer2D.prototype.setSizes = function(container, subject){
	this._containerSize.copy(container);
	this._subjectSize.copy(subject);
}
App3DR.Explorer2D.prototype.updateScale = function(desired){
	var focus = this.focusPoint();
	var scale = desired;
	if(this._scaleRangeMin){

		// MOVE OFFSET TO ACCOUNT FOR CHANGE IN SCALE ABOUT
		this._focus;
		scale = Code.clamp(scale, this._scaleRangeMin, this._scaleRangeMax);
	}
	this._subjectScale = scale;
	this.toFocusPoint(focus);
	return scale;
}
App3DR.Explorer2D.prototype.updateRotation = function(desired){
	var focus = this.focusPoint();
	var angle = desired;
	if(this._rotateRangeMin){
		this._focus;
		angle = Code.clamp(angle, this._rotateRangeMin, this._rotateRangeMax);
	}
	this._subjectRotation = angle;
	this.toFocusPoint(focus);
	return angle;
}
App3DR.Explorer2D.prototype.updateOffset = function(desired){
	var offset = this._subjectCenter;
	offset.copy(desired);

	// ...
	return offset;
}
App3DR.Explorer2D.prototype.toFocusPoint = function(p){ // focus on pixel
	var center = this._containerSize.copy().scale(0.5);
	var screen = this.toScreenPoint(p);
	var centerToPoint = V2D.sub(screen,center);
	var scaled = centerToPoint.copy().scale(-1);
	this._subjectCenter.add(scaled);
}
App3DR.Explorer2D.prototype.focusPoint = function(p){ // currently focused pixel
	var center = this._containerSize.copy().scale(0.5);
	var f = this.toLocalPoint( center );
	return f;
}
App3DR.Explorer2D.prototype.mouseDown = function(location){
	if(!this._isDragging){
		this._isDragging = true;
		this._dragOrigin = location.copy();
	}
}
App3DR.Explorer2D.prototype.mouseMove = function(location){
	if(this._isDragging){
		this._dragOffset = location.copy();
		var diff = V2D.sub(this._dragOffset,this._dragOrigin)
		this._dragOrigin = this._dragOffset;
		this._subjectCenter.add(diff);
	}
}
App3DR.Explorer2D.prototype.mouseUp = function(location){
	if(this._isDragging){
		this._isDragging = false;
		this._dragOffset = location.copy();
		var diff = V2D.sub(this._dragOffset,this._dragOrigin);
		this._subjectCenter.add(diff);
	}
}







App3DR.prototype.setupAppActive = function(app){
	this._activeApp = app;
	var size = this._canvas.size();
	var siz = Math.min(size.x,size.y);
	var sizX = size.x;
	var sizY = size.y;
	var cen = new V2D(size.x*0.5,size.y*0.5);
	var min = new V2D(cen.x-sizX*0.5,cen.y-sizY*0.5);
	var max = new V2D(min.x+sizX,min.y+sizY);
	// Code.sizeToFitInside = function(containerWidth,containerHeight, contentsWidth,contentsHeight){
	app.setActive(this._canvas, this._stage, this._root, min,max);
}


App3DR.prototype._handleCanvasResizeFxn = function(r){
	if(this._activeApp){
		return;
	}

	this._updateBackground();

	var screenSize = new V2D( this._canvas.width(), this._canvas.height() );
	// console.log("screenSize: "+screenSize);
	var screenCenter = screenSize.copy().scale(0.5);

	var grid = this._grid;
if(grid){
	var cellCount = 4.0;
	//var canvasScale = this._canvas.presentationScale();
	var screenMin = Math.min(screenSize.x,screenSize.y);


	//console.log(this._canvas)
	//var screenSize = this._canvas.size();
	// var iconSize = 0.10 * screenMin//Math.min(screenSize.x,screenSize.y);
	// 	iconSize = Math.round(iconSize);

	var iconSize = screenMin/2.0;//(10 * cellCount);////Math.min(screenSize.x,screenSize.y);
		iconSize = Math.round(iconSize);
	console.log(iconSize);
	grid._iconSize = iconSize;


	grid.viewScale(screenMin/cellCount);
	grid.cellBuffer(Math.ceil( (screenSize.x/screenMin) * (cellCount+2)) , Math.ceil( (screenSize.y/screenMin) * (cellCount*2) ));
	grid.render();
	this._displayMenu.matrix().identity();
	this._displayMenu.matrix().translate(screenCenter.x,screenCenter.y);
}
}
App3DR.prototype._handleKeyboardUp = function(e){
	if(this._activeApp){
		this._activeApp.handleKeyUp(e);
		return;
	}
}
App3DR.prototype._handleKeyboardDown = function(e){
	if(this._activeApp){
		this._activeApp.handleKeyDown(e);
		return;
	}
}
App3DR.prototype._handleEnterFrameFxn = function(t){
	//this.renderMenu(t);
}
App3DR.prototype._handleMouseDownFxn = function(e){
	if(this._activeApp){
		this._activeApp.handleMouseDown(e);
		return;
	}
	if(!this._grid){
		return;
	}
	var location = e["location"];
	this._grid.dragStart(location);
	this._mouseDown = location;

	this._mouseHasMoved = false;
	this._mouseHasPressed = false;
	this.gridUpdate(location, 0);
	this._longPressTicker.start();
	//this._longPressTicker.addFunction(Ticker.EVENT_TICK, this._longPressTrigger, this);
}
App3DR.prototype._longPressTrigger = function(e){
	this._longPressTicker.stop();
	this._mouseHasPressed = true;
	var location = this._mouseDown;
	this.gridUpdate(location, 2);
	this._stopDragging(location);
}
App3DR.prototype.gridUpdate = function(location, type){
	if(type==0){
		// initial down
	}else if(type==1){
		// select over
	}else if(type==2){
		// long press
	}
	if(this._mouseHasMoved){
		return;
	}

	var screenSize = new V2D( this._canvas.width(), this._canvas.height() );
	var screenCenter = screenSize.copy().scale(0.5);
	var offset = screenCenter.copy().scale(-1);
	this._grid.mouseDown(location, offset, type);
}
App3DR.prototype._handleMouseUpFxn = function(e){
	if(this._activeApp){
		this._activeApp.handleMouseUp(e);
		return;
	}



	this._longPressTicker.stop();
	var location = e["location"];
	if(this._mouseDown){ // if already dragging
		this._stopDragging(location);

		if(!this._mouseHasPressed){
			this.gridUpdate(location, 1);
		}
	}
}
App3DR.prototype._handleMouseMoveFxn = function(e){
	Code.eventPreventDefault(e);
	if(this._activeApp){
		this._activeApp.handleMouseMove(e);
		return;
	}



	var location = e["location"];
	if(this._mouseDown){
		this._longPressTicker.stop();
		this._grid.dragContinue(location);
		this._mouseDown = location;
		this._mouseHasMoved = true;
	}
}
App3DR.prototype._stopDragging = function(location){
	this._mouseDown = location;
	this._grid.dragStop(location);
	this._mouseDown = null;
}
App3DR.prototype._handleMouseClickFxn = function(e){
	if(this._activeApp){
		return;
	}



	var location = e["location"];
	//console.log(location);



	/*
	var d = new DO();
	d.graphics().clear();
	d.graphics().setFill(0x9900FF00);
	//d.graphics().setLine(1.0, 0xCCCC0000);
	d.graphics().beginPath();
	//d.graphics().drawPolygon(poly,true);
	d.graphics().drawCircle(location.x,location.y,2.0);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	GLOBALSTAGE.addChild(d);
	*/
}

App3DR.prototype._handleBackgroundImagesLoaded = function(imageInfo){
	if(this._activeApp){
		return;
	}



	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	this._imageBackground = imageList[0];
	this._updateBackground();
}
App3DR.prototype._updateBackground = function(r){
	var size = new V2D(this._canvas.width(), this._canvas.height());
	var bg = this._displayBG;
	if(!bg){
		return;
	}
	bg.graphics().clear();
	// draw image
	var image = this._imageBackground;
	if(image){
		//console.log(image)
		bg.removeAllChildren();
		//var d = new DOImage(image);
		var d = new DO();
		d.graphics().clear();
		//console.log(image.width,image.height)
		var outside = Code.sizeToFitOutside(size.x,size.y, image.width,image.height);
		//var outside = Code.sizeToFitInside(size.x,size.y, image.width,image.height);
		// console.log(size.x,size.y)
		// console.log(outside.x,outside.y)
		var pX = (size.x-outside.x)*0.5;
		var pY = (size.y-outside.y)*0.5;
		d.graphics().drawImage(image, pX,pY,outside.x,outside.y);
		bg.addChild(d);
	}
	// draw cover
	var d = new DO();
	d.graphics().setFill(0xAA000000);
	d.graphics().beginPath();
	//d.graphics().drawPolygon(poly,true);
	d.graphics().drawRect(-1,-1, size.x+2,size.y+2);
	d.graphics().endPath();
	d.graphics().fill();
	bg.addChild(d);
}


// App3DR.prototype.renderMenu = function(t){
// 	...
// }




function HexGrid(){
	this._cellSizeWidth = 5;
	this._cellSizeHeight = 5;
	this._scale = 1.0;
	this._sphereRadius = 10.0;
}
HexGrid.prototype.cellCountX = function(c){
	if(c!==undefined){
		this._cellSizeWidth = c;
	}
	return this._cellSizeWidth;
}
HexGrid.prototype.cellCountY = function(c){
	if(c!==undefined){
		this._cellSizeHeight = c;
	}
	return this._cellSizeHeight;
}
HexGrid.prototype.scale = function(s){
	if(s!==undefined){
		this._scale = s;
	}
	return this._scale;
}
HexGrid.prototype.radius = function(r){
	if(r!==undefined){
		this._sphereRadius = r;
	}
	return this._sphereRadius;
}
HexGrid.prototype.cellsAt = function(offsetX,offsetY){
	var i, j;
	var countI = this._cellSizeWidth;
	var countJ = this._cellSizeHeight;
	var halfSizeX = Math.ceil(countI*0.5);
	var halfSizeY = Math.ceil(countJ*0.5);
	var cells = [];
	var centerX = Math.round(offsetX/HexGrid._HEX_SCALE_X);
	var centerY = Math.round(offsetY);
	///console.log(countI,countJ,halfSizeX,halfSizeY)
	for(j=0; j<countJ; ++j){
		for(i=0; i<countI; ++i){
			var cell = new V2D(i+centerX-halfSizeX,j+centerY-halfSizeY);
			cells.push(cell);
		}
	}
	return cells;
}
HexGrid.prototype.pointInCell = function(offsetX,offsetY, cellX,cellY,cellZ, pX,pY){ // pX&pY in [-0.5, 0.5]
	var point = new V2D();
	var cellPosX = (cellX+pX)*HexGrid._HEX_SCALE_X;
	// point.add(cellX*HexGrid._HEX_SCALE_X,cellY);
	var cellPosY = (cellY+pY);
	if(Math.abs(cellX)%2==1){
		cellPosY += HexGrid._HEX_SHIFT_Y;
	}
	this._pointLocation(point, offsetX,offsetY, cellPosX,cellPosY,cellZ);
	return point;
}
HexGrid.prototype.cellLocation = function(offsetX,offsetY, cellX,cellY,cellZ){
	return this.pointInCell(offsetX,offsetY, cellX,cellY,cellZ,0.0,0.0);
}
HexGrid._HEX_POLYGON_DIAMOND = [];
HexGrid._HEX_POLYGON_RECT = []; // containing
HexGrid._HEX_POLYGON_SQUARE_INNER = []; // inner-square
HexGrid._HEX_POLYGON_SQUARE_OUTER = []; // outer-square
HexGrid._HEX_POLYGON_HEX = [];
HexGrid._HEX_RADIUS = 1.0/Math.sqrt(3);
HexGrid._HEX_SHIFT_Y = -0.5;
HexGrid._HEX_SCALE_X = Math.cos(Math.PI/6.0);

for(var i=0; i<6; ++i){
	var r = HexGrid._HEX_RADIUS;
	var a = i*Code.radians(60.0);
	var x = r*Math.cos(a);
	var y = r*Math.sin(a);
	HexGrid._HEX_POLYGON_HEX[i] = new V2D(x,y);
}
for(var i=0; i<4; ++i){
	var r = HexGrid._HEX_RADIUS * 0.5;
	r = r * 1.0/Math.sin(Code.radians(60.0));
	var a = Code.radians(45.0) + i*Code.radians(90.0);
	var x = r*Math.cos(a);
	var y = r*Math.sin(a);
	HexGrid._HEX_POLYGON_SQUARE_INNER[i] = new V2D(x,y);
}
for(var i=0; i<4; ++i){
	var r = HexGrid._HEX_RADIUS;
	//r = r * Math.SQRT2*Math.sin(Code.radians(60.0));
	r = r * 1.0/Math.sin(Code.radians(60.0));
	var a = Code.radians(45.0) + i*Code.radians(90.0);
	var x = r*Math.cos(a);
	var y = r*Math.sin(a);
	HexGrid._HEX_POLYGON_SQUARE_OUTER[i] = new V2D(x,y);
	//HexGrid._HEX_POLYGON_RECT[i] = new V2D(x,y);
}



HexGrid.prototype.cellPolygon = function(offsetX,offsetY, cellX,cellY,cellZ, scaleIn, poly){
	scaleIn = (scaleIn!==undefined && scaleIn!==null) ? scaleIn : 1.0;
//	var polygon = HexGrid._HEX_POLYGON_HEX;
	//var polygon = HexGrid._HEX_POLYGON_RECT;
	// HexGrid._HEX_POLYGON_SQUARE_INNER;
	var polygon = poly!==undefined ? poly : HexGrid._HEX_POLYGON_HEX;
	var points = [];
	for(var i=0; i<polygon.length; ++i){
		var point = V2D.copy(polygon[i]);
		point.scale(scaleIn);
		point.add(cellX*HexGrid._HEX_SCALE_X,cellY);
		if(Math.abs(cellX)%2==1){
			point.add(0.0, HexGrid._HEX_SHIFT_Y);
		}
		this._pointLocation(point, offsetX,offsetY, point.x,point.y,cellZ);
		points.push(point);
	}
	return points;
}
HexGrid.prototype._pointLocation = function(result, offsetX,offsetY, locX,locY,locZ){
	locZ = locZ!==undefined ? locZ : 0.0;
	var diffX = locX - offsetX;
	var diffY = locY - offsetY;
	var radius = Math.sqrt(diffX*diffX + diffY*diffY);
	var pointScale = this._rbf(radius, locZ, this._scale);
	var resultX = pointScale * diffX;
	var resultY = pointScale * diffY;
	result.x = resultX;
	result.y = resultY;
}
HexGrid.prototype._rbf = function(radius,depth, scale){
	var sphereRadius = this._sphereRadius + depth;
	var limit = 1E6;
	if(radius>=sphereRadius){
		return limit;
	}
	var r = radius/sphereRadius;
	//var rbf = (1.0 - r);
	var rbf = Math.cos( r*Math.PI*0.5 );
		// rbf = rbf * rbf;
	var val = scale * (1.0/rbf);
	if(val>limit){
		return limit;
	}
	return val;

	//return 50.0;
}
/*
HexGrid._rbf2 = function(radius,depth, scale){
	var minLim = 1E-1;
	if(radius<=minLim){
		radius = minLim;
	}
	scale = scale!==undefined ? scale : 1.0;
	depth = depth!==undefined ? depth : 0.0;
	if(depth<0){
		depth = 1.0/depth;
	}
	var depthScale = 1.0;
	var depthCurve = 1.0;
	var depthSize = 1.0;
	//var depthScale = 1.0/(1.0 + depth*0.1);
	//var depthCurve = 1.0/(1.0 + depth*0.10);
	//var depthSize = 1.0 + depth*0.01;

	//var depthScale = 1.0/(1.0 + depth*0.01);
	var depthScale = (1.0 + depth*0.10);
	var depthCurve = 1.0/(1.0 + depth*1.0);
	//var depthCurve = (1.0 + depth*0.10);
	var depthSize = (1.0 + depth*0.10);
	//var depthSize = 1.0/(1.0 + depth*0.05);

	var curviness = 0.10;
	var siziness = 1.0;
	var val = radius + depthCurve*curviness*Math.exp(radius*siziness*depthSize);

	if(val<0){
		val = 0;
	}
	var limit = 1E8;
	if(val>limit){
		val = limit;
	}
	return depthScale * scale * val / (0.1 + radius); // /rad ~ 0 = problematic
}
*/

function HexSystem(parent){
	HexSystem._.constructor.call(this);
	this._display = new DO();
		parent.addChild(this._display);
		this._buttonDisplay = new DO();
		this._display.addChild(this._buttonDisplay);
	this._grid = new HexGrid();
	this._pos = new V2D();
	this._rotation = 0.0;
	this._zoom = 1.0;
	this._isAnimating = false;
	this._scrollDirection = null;
	this._isDragging = false;
	this._dragStart = null;
	this._dragStop = null;
	this._dragTimestamp = null;
	this._offset = new V2D();
	this._scale = 1;
	this._dragScale = 1.0;
	this._momentumTicker = new Ticker(1000/30);
	this._momentumTicker.addFunction(Ticker.EVENT_TICK, this._handleDecayTickerFxn, this);
	this._momentumDecay = 0.8;
	this._momentumVelocity = null;


var fxnHighlight = function(){
	console.log("highlight");
}
var fxnSelect = function(){
	console.log("select");
}
var fxnHold = function(){
	console.log("hold");
}

	var menu = new HexSystem.Menu();
		menu.addItem( new HexSystem.Menu.Item(0,1, fxnHighlight, fxnSelect, fxnHold) );
		menu.addItem( new HexSystem.Menu.Item(1,0, fxnHighlight, fxnSelect, fxnHold) );
		menu.addItem( new HexSystem.Menu.Item(-1,0, fxnHighlight, fxnSelect, fxnHold) );
		// menu.addItem( new HexSystem.Menu.Item(1,0, fxnHighlight, fxnSelect, fxnHold) );
		// menu.addItem( new HexSystem.Menu.Item(2,0, fxnHighlight, fxnSelect, fxnHold) );
		//menu.addItem( new HexSystem.Menu.Item(1,1) );
		//menu.addItem( new HexSystem.Menu.Item(-2,-1) );
	this._menu = menu;
	this._toCenter();
	this._render();
	this._loadResources();
}
Code.inheritClass(HexSystem,Dispatchable);

HexSystem.EVENT_VIEW_UPDATE = "EVENT_VIEW_UPDATE";
HexSystem.EVENT_ANIMATION_START = "EVENT_ANIMATION_START";
HexSystem.EVENT_ANIMATION_END = "EVENT_ANIMATION_END";

HexSystem.prototype._handleDecayTickerFxn = function(){
//	console.log("ticker + "+this._momentumVelocity);
	this._momentumVelocity.scale(this._momentumDecay);
	var len = this._momentumVelocity.length();
	this._offset.add(this._momentumVelocity);
	this._render();
	if(len<0.001){
		this._momentumVelocity = null;
	}
	if(!this._momentumVelocity){
		this._momentumTicker.stop();
	}
}
HexSystem.prototype._loadResources = function(){
	var fxn = function(imageInfo){
		this._resource_image_link = imageInfo.images[0];
	// 	var imageList = imageInfo.images;
	// var fileList = imageInfo.files;
	// this._imageBackground = imageList[0];
	// this._updateBackground();
		this._render();
	}
	var imageLoader = new ImageLoader("./images/icons/",["icon_button_link.png"], this,fxn,null);
	imageLoader.load();
}

HexSystem.prototype.cellBuffer = function(w,h){
	//console.log("cellBuffer: "+w+" "+h);
	this._grid.cellCountX(w);
	this._grid.cellCountY(h);
}
HexSystem.prototype._toCenter = function(){
	var menu = this._menu;
	var max = menu.max();
	var min = menu.min();
	var cen = V2D.avg(min,max);
	this._offset.set(cen);
}
HexSystem.prototype.render = function(){
	this._render(null);
}
HexSystem.prototype._render = function(delta){
	//t = t!==undefined ? t : 0;
	var t = 0;
	var display = this._display;
	display.removeAllChildren();

	var iconSize = this._iconSize;

	var grid = this._grid;
	var offset = this._offset;
	if(delta){
		offset = V2D.add(offset,delta);
	}
	var menu = this._menu;
	if(menu){
		var toleranceX = 0.5;
		var toleranceY = 0.5;
		offset.x = Code.clamp(offset.x, menu.min().x-toleranceX,menu.max().x+toleranceX);
		offset.y = Code.clamp(offset.y, menu.min().y-toleranceY,menu.max().y+toleranceY);
	}

	var cells = grid.cellsAt(offset.x,offset.y);

	var imageIcon = this._resource_image_link;

	var i, j;

	for(i=0; i<cells.length; ++i){
		var cell = cells[i];
		var center = grid.cellLocation(offset.x,offset.y, cell.x,cell.y);
		var centerDisplay = center.copy().scale(1.0,-1.0);

		//var isActive = (Math.abs(cell.x)%2==0 || Math.abs(cell.x)%5==1) && (Math.abs(cell.y)%2==0);

		var isActive = false;
		var items = menu.items();
		var activeItem = null;
		for(j=0; j<items.length; ++j){
			var item = items[j];
			var c = item.cell();
			if(c.x==cell.x && c.y==cell.y){
				isActive = true;
				activeItem = item;
				break;
			}
		}
		//console.log(center+"")
/*
		var d = new DO();
			d.graphics().clear();
			d.graphics().setFill(0x99330000);
			d.graphics().setLine(1.0, 0xCCCC0000);
			d.graphics().beginPath();
			//d.graphics().drawPolygon(poly,true);
			d.graphics().drawCircle(centerDisplay.x,-centerDisplay.y,1.0);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
			display.addChild(d);
*/


		var colorDark = 0x66110000;
		var colorRed = 0xFFFF2211;
		var colorInside = [0.1,0x99FF0000, 0.9,0x66DD0000];
		//var scaleIn = 0.9;

		var colorDarkInactive = 0x33000000;
		var colorRedInactive = 0x66FF2211;
		var colorInsideInactive = [0.1,0x33FF0000, 0.9,0x22DD0000];
		var area = new DO();
		area.graphics().clear();
		display.addChild(area);
		//d.matrix().translate(screenCenter.x,screenCenter.y);
//		for(j=0; j<2; ++j){

			//var colorInside = 0x0;
			//scaleIn = 0.9;
			// if(j==1){
			// 	color = 0xFFFFFFFF;
			// 	scaleIn = 0.5;
			// }
			// var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, 0.0, scaleIn);
			// for(var k=0; k<poly.length; ++k){
			// 	poly[k].y = -poly[k].y;
			// }
			var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, 0.0, 0.93);
			for(var k=0; k<poly.length; ++k){
				poly[k].y = -poly[k].y;
			}
			var polyExterrior = poly;

			var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, 0.0, 0.80);
			for(var k=0; k<poly.length; ++k){
				poly[k].y = -poly[k].y;
			}
			var polyOutline = poly;

			var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, 0.0, 0.70);
			for(var k=0; k<poly.length; ++k){
				poly[k].y = -poly[k].y;
			}
			var polyInline = poly;

			var closestCorner = null;
			var closestDistance = null;
			for(var k=0; k<polyInline.length; ++k){
				var corner = polyInline[k];
				var distance = V2D.distance(centerDisplay,corner);
				if(closestCorner==null || distance>closestDistance){
					closestCorner = corner;
					closestDistance = distance;
				}
			}

			var minRad = 0;//0.1 * closestDistance;
			var maxRad = closestDistance;//1.0 * closestDistance;

			if(imageIcon && isActive){
				// HexGrid.prototype.cellPolygon = function(offsetX,offsetY, cellX,cellY,cellZ, scaleIn, poly
				var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, 0.25, 1.0,  HexGrid._HEX_POLYGON_SQUARE_OUTER);
				var poly2 = [];
				for(var k=0; k<poly.length; ++k){
					poly2[k] = poly[k].copy().scale(1,-1);
				}
				activeItem.hitPolygon(poly2);

				for(var k=0; k<poly.length; ++k){
					poly[k].y = -poly[k].y;
				}
				/*
				var d = new DO();
					d.graphics().setFill(0x66FF00FF);
					d.graphics().beginPath();
					d.graphics().drawPolygon(poly,true);
					d.graphics().endPath();
					d.graphics().fill();
					display.addChild(d);
				*/



//function DOTri(img, triDisplay, triImage, parentDO){
				var a = poly[0];
				var b = poly[1];
				var c = poly[2];
				var d = poly[3];
				// top left:
				var triDisplay = new Tri2D(new V2D(b.x,b.y), new V2D(c.x,c.y), new V2D(d.x,d.y));
				var triImage = new Tri2D(new V2D(0,0), new V2D(0,imageIcon.height), new V2D(imageIcon.width,imageIcon.height));
				var icon = new DOTri(imageIcon, triDisplay, triImage);
				display.addChild(icon);

				// top right:
				var triDisplay = new Tri2D(new V2D(d.x,d.y), new V2D(a.x,a.y), new V2D(b.x,b.y));
				var triImage = new Tri2D(new V2D(imageIcon.width,imageIcon.height), new V2D(imageIcon.width,0.0), new V2D(0,0));
				var icon = new DOTri(imageIcon, triDisplay, triImage);
				display.addChild(icon);
				//icon.matrix().translate(centerDisplay.x,centerDisplay.y);

				// var icon = new DOImage(imageIcon);
				// icon.size(iconSize,iconSize);
				// //icon.matrix().translate(-imageIcon.width*0.5,-imageIcon.height*0.5);
				// icon.matrix().translate(-iconSize*0.5,-iconSize*0.5);
				// icon.matrix().translate(centerDisplay.x,centerDisplay.y);
				// display.addChild(icon);

			}
			var d = area;
			//var polyEnd = Code.arrayPushArray(Code.copyArray(polyInline), Code.copyArray(polyOutline));
			//d.graphics().drawPolygon(polyEnd,true);

			// behind

				color = isActive ? colorDark : colorDarkInactive;
				d.graphics().setFill(color);
				d.graphics().beginPath();
				d.graphics().drawPolygon(polyExterrior,true);
				d.graphics().endPath();
				d.graphics().fill();
			// outline
				//var cellReal = cell.copy().scale(1.0,1.0);
				var dist = 1.0 + centerDisplay.length()* 0.002;//Math.sqrt(1.0 + V2D.distance(centerDisplay,offset));
				var alph = Code.clampRound0255(0x99/dist);
				colorRedInactiveFade = Code.setAlpARGB(colorRedInactive, alph);

				color = isActive ? colorRed : colorRedInactiveFade;
				d.graphics().setFill(color);
				d.graphics().beginPath();
				d.graphics().drawPolygon(polyInline,true);
				d.graphics().drawPolygon(polyOutline,true);
				d.graphics().endPath();
				d.graphics().fillEvenOdd();
			// interrior
				color = isActive ? colorInside : colorInsideInactive;
				//d.graphics().setFill(color);
				d.graphics().setRadialFill(centerDisplay.x,centerDisplay.y,minRad, centerDisplay.x,centerDisplay.y,maxRad, color);
				d.graphics().beginPath();
				d.graphics().drawPolygon(polyInline,true);
				d.graphics().endPath();
				d.graphics().fill();

				// d.graphics().setLine(1.0, 0x0);
				// d.graphics().strokeLine();

//		}
	}
}
HexSystem.Menu = function(){
	this._items = [];
	this._min = null;
	this._max = null;
	this._poly = null;
}
HexSystem.Menu.prototype.items = function(items){
	return this._items;
}
HexSystem.Menu.prototype.addItem = function(item){
	this._items.push(item);
	if(!this._min){
		this._min = item.cell().copy();
		this._max = this._min.copy();
	}else{
		this._min.min(item.cell());
		this._max.max(item.cell());
	}
}
HexSystem.Menu.prototype.min = function(){
	return this._min;
}
HexSystem.Menu.prototype.max = function(){
	return this._max;
}
HexSystem.Menu.Item = function(x,y, foc,sel,det){
	this._cell = new V2D(x,y);
	this._focusFxn = null;
	this._selectFxn = null;
	this._detailFxn = null;
	this.focusFxn(foc);
	this.selectFxn(sel);
	this.detailFxn(det);
}
HexSystem.Menu.Item.prototype.cell = function(){
	return this._cell;
}
HexSystem.Menu.Item.prototype.hitPolygon = function(poly){
	if(poly!==undefined){
		this._poly = poly;
	}
	return this._poly;
}
HexSystem.Menu.Item.prototype.focusFxn = function(f){
	if(f!==undefined){
		this._focusFxn = f;
	}
	return this._focusFxn;
}
HexSystem.Menu.Item.prototype.detailFxn = function(f){
	if(f!==undefined){
		this._detailFxn = f;
	}
	return this._detailFxn;
}
HexSystem.Menu.Item.prototype.selectFxn = function(f){
	if(f!==undefined){
		this._selectFxn = f;
	}
	return this._selectFxn;
}
HexSystem.Menu.Item.prototype.eventFocus = function(){
	if(this._focusFxn){
		this._focusFxn(this);
	}
}
HexSystem.Menu.Item.prototype.eventSelect = function(){
	if(this._selectFxn){
		this._selectFxn(this);
	}
}
HexSystem.Menu.Item.prototype.eventDetail = function(){
	if(this._detailFxn){
		this._detailFxn(this);
	}
}


HexSystem.prototype.viewScale = function(s){
	if(s!==undefined){
		this._scale = s;
		this._grid.scale(s);
	}
	return this._scale;
}
HexSystem.prototype.goToCell = function(cellX,cellY){
	//
	return false;
}
HexSystem.prototype.goToCell = function(cellX,cellY){
	//
	return false;
}
HexSystem.prototype.goToLocation = function(locationX,locationY){
	//
	return false;
}
HexSystem.prototype.animateToCell = function(cellX,cellY, duration){
	//
	return false;
}
HexSystem.prototype.animateToLocation = function(locationX,locationY, duration){
	//
	return false;
}
HexSystem.prototype.restrictScrollDirection = function(dirX,dirY){
	//
	return false;
}
HexSystem.prototype.restrictDragDirection = function(dirX,dirY){
	return false;
	if(dirX===null){
		this._scrollDirection = null;
		return;
	}
	var dir = new V2D(dirX,dirY);
	dir.norm();
	this._scrollDirection = dir;
}
HexSystem.prototype.mouseDown = function(point, offset, type){
	var point2D = V2D.copy(point);
	if(offset){
		point2D.add(offset);
	}
//	console.log("mouse down "+point2D);
	var menu = this._menu;
	var items = menu.items();
	for(var i=0; i<items.length; ++i){
		var item = items[i];
		var poly = item.hitPolygon();
		if(poly){
			var isInside = Code.isPointInsidePolygon2D(point2D, poly);
			if(isInside){
				if(type==0){
					item.eventFocus();
				}else if(type==1){
					item.eventSelect();
				}else if(type==2){
					item.eventDetail();
				}
			}
		}
	}
}
HexSystem.prototype.dragStart = function(point){
	this._dragStart = point;
	this._momentumTicker.stop();
	this._momentumVelocity = null;
	return false;
}
HexSystem.prototype.dragContinue = function(point){
	this._dragStop = point;
	this._dragTimestamp = Code.getTimeMilliseconds();
	this._dragDelta();
	return false;
}
HexSystem.prototype.dragStop = function(point){
	this._dragStop = point;
	var delta = this._dragDelta();
	this._offset.add(delta);
	this._dragStart = null;
	this._dragStop = null;
	var timestamp = Code.getTimeMilliseconds();
	if(this._dragTimestamp){
		var time = timestamp - this._dragTimestamp;
		if(time<100){
			if(time<1){
				time = 1;
			}
			delta.scale(1.0/time);
			if(delta.length()>0.1){
				this._momentumVelocity = delta;
				this._momentumTicker.start();
			}
		}
		this._dragTimestamp = null;
	}
	return false;
}
HexSystem.prototype._dragDelta = function(){
	var delta = V2D.sub(this._dragStop,this._dragStart);
	delta.scale(-1.0,1.0);
	delta.scale( this._dragScale * 1.0/this._scale);
	this._render(delta);
	return delta;
}
HexSystem.prototype.x = function(){
	//
}
HexSystem.prototype._currentCells = function(){
	var cells = cellsAt(this._pos.x,this._pos.y);
	return cells;
}
// passthrough
HexSystem.prototype.cellPolygon = function(cellX,cellY,cellZ){
	return this._grid.cellPolygon(this._pos.x,this._pos.y, cellX,cellY,cellZ);
}


// ------------------------------------------------------------------------------------------------------------


function HexMenu(){
	HexSystem._.constructor.call(this);
	this._grid = new HexSystem();
}
Code.inheritClass(HexSystem,Dispatchable);
HexMenu.EVENT_GET_ICON = "EVENT_GET_ICON";
HexMenu.prototype.gotoCell = function(){
	//
}
HexMenu.prototype.x = function(){
	//
}



// ------------------------------------------------------------------------------------------------------------
	/*
projects/
	0/
		info.yaml
			title: "New Project 11/9/18 9:12AM"
			created: "2018-11-09 09:12:31.9000"
			modified: "2019-03-03 16:59:33.2690"
			cameras:
				-
					directory: "LA8ADU8H"
					title: "New Camera LA8ADU8H"
					calculatedCount: 10					# number of images used to calculate K parameters (if not matching images.length -> needs processing)
					K:
						fx: 0.8565143769157422
						fy: 1.1625998022448123
						s: -0.012439315192795274
						cx: 0.4781381185245835
						cy: 0.4746370298801608
					distortion:
						k1: -0.012203124117497414
						k2: 0.0007660455391699547
						k3: 0.0005320068206907417
						p1: 0.017459785333744926
						p2: 0.014415011981151046
					images:
						-
							directory: "L9THUQ4M"
							matches: 81
							aspectRatio: 1.3333333333333333
							pictures:
								-
									file: "100.png"
									width: 1008
									height: 756
									scale: 1
								...
						...
			views:
				-
					title: "New View 7Z85UKMI"
					directory: "7Z85UKMI"
					camera: null
					aspectRatio: 1.3333333333333333
					mask: null # image file name of mask -- mask.png
					pictures:
						-
							file: "100.png"
							width: 504
							height: 378
							scale: 1
						...
					features:
						file: "features.yaml"	# found features for image

			pairs:
				-
					directory: "KF398BC7"
					viewA: "2DWWPMNZ"
					viewB: "914UQJ51"
					featureCount: 42		# 2D match count
					relativeCount: 29683	# 3D match count
					F: # MATRIX
					R: # MATRIX
					errorFMean: #
					errorFSigma: #
					errorRMean: #
					errorRSigma: #
				...
			triples:
				-
					directory: "KF398BC7"
					viewA: "2DWWPMNZ"
					viewB: "914UQJ51"
					viewC: "CCCCCCCC"
					relativeCount: 29683	# 3D match count
					T: # MATRIX
					errorTMean: #
					errorTSigma: #

					gauge: # - relative scalings between separate pairs -- coordinate system gauge
						AB: 1.0		# ABS SCALE
						AC: 2.2		# ABS SCALE
						BC: 1.1		# ABS SCALE
					# ?
						F-DATA HERE
						R-DATA HERE
				...

		views/
			0/
				features.yaml 			all possible feature points w/ score
					# ?
				pictures/
					100.png
					50.png
					25.png
					12.5.png
		pairs/
			0/
				matches.yaml 			x,y,z,t[,u,v] <=> ; F [initial feature matching]
				relative.yaml 			relative orientation of camera views w/ matches / triangulated points -- medium/high density
					P: (4x4 matrix)
					cellSizeA: 5 		 [start at whatever size ~ 20x20 cells (odd) => 3 pixels]
					cellSizeB: 7
					points:
						a: x,y
						b: x,y
						3D: X,Y,Z
				tracks.yaml 				optimum seed track points [best points]
					views:
						-
							id: "A"
						...
					tracks:
						-
							p:
								v: INDEX-OF-VIEW
								x: [0-1]
								y: [0-1]
						...

		triples/tuples
			0/
				info.yaml 			x,y <=> pixel matches among 3 views
					cameras:
						... # camera data used
					views:
						-
							id: # CAMERA ID
							camera: "0" # INDEX TO CAMERAS
							imageSize:	# SIZE OF IMAGE USED
								x: 504
								y: 378
							cellSize: 3 # SIZE OF CELLS USED
							transform: ABS TRANSFORM

					transforms: # data on view transforms (1:1 parallel array to views) -- SAME AS PAIR
						-
							matches: 21857
							errorRMean: 0.00000103378302308721
							errorRSigma: 0.3029725132265945
							errorFMean: 0.0000018490823274523024
							errorFSigma: 0.24309154400461266
							errorNCCMean: 0.002385297852253665
							errorNCCSigma: 0.1671777117177186
							errorSADMean: 0.004033203176232317
							errorSADSigma: 0.06777955317617489
					points:
						-
							SAME AS PAIR

		cameras/
			0/
				info.yaml 				computed intrinsic properties (K & distortion)
							K: 0,1,2, 3,4,5, 6,7,8
								fx
								fy
								s
								cx
								cy
							p: 1 2 3
								p1
								p2
								p3
							t: 1 2 3
								t1
								t2
							images:
								id: .
								file: .
								width: .
								height: .
								scale: .
								points: bla.yaml
							bla.yaml:
								matches:
									x: .
									y: .
									X: .
									Y: .
									Z: .
				pictures/
					0.png
					1.png
					...
				matches/
					matchA.yaml
							matches:
								2D:
									x
									y
								3D:
									x
									y
									z

		bundle/
A			graph.yaml - view graph of scene - result of global (quasi-local) bundle adjustment iterations on TRACK POINTS -- initialized using PAIR TRANSFORMS & TRIPLE SCALES
				- views
					-
						id: view ID
						T: MATRIX ABSOLUTE TRANSFORM
				- graph
					-
						A: INDEX-OF-VIEW
						B: INDEX-OF-VIEW
				- skeleton --- basic/compressed/critical/backbone/skeletal/central graph
					-
						A: INDEX-OF-VIEW
						B: INDEX-OF-VIEW
				- points:
					v:
						-
							i: INDEX-OF-VIEW
							x: [0,1]
							y: [0,1]
												# THE POINTS ARE BUILD UP VIA 3-WAY ADDITION INITIAL .. MIGHT NOT NEED THSE
						X: # position
						Y:
						Z:
						x: # normal
						y:
						z:
						s: # size
# IS THIS NEEDED? .. just keep tracks in graph ...
B			tracks.yaml - accumulated global track points across images: grows till all pair-seeds are merged
				tracks:
					-
						v:
							-
								i: INDEX-OF-VIEW
								x: [0,1]
								y: [0,1]

C			sparse.yaml -
				global 3D point list - sparse TRACK Data
				sparse point reconstruction info

				cameras:
					-
						id: ID
						fx:
						fy:
						s:
						cx:
						cy:
				views:
					-
						id: ID
						camera: K index
						transform: ABS TRANSFORM
						points: count of all 3D points that project to this view == 2D point count
						errorR: avg reprojection error [over all P3D that project to view]
						deltaErrorR: null / change since last
						updated: timestamp for last update
					...
				pairs:
					-
						A: index
						B: index
						- total/change in 3-way points?
						errorF: avg f error
						errorP: avg 3D reprojection error (for both 2-way 3D matched points)
						deltaErrorF: null / change since last
						deltaErrorP: null / change since last
						updated: timestamp for last update
					... [MIGHT NEED TO ADD NEW PAIRS ON THE FLY?]
				points:
					-
						X: position
						Y
						Z
						x: normal
						y
						z
						s: size (patch - world scale)
						v:
							-
								i: VIEW INDEX
								x: [0-1]
								y: [0-1]
					...

D			dense.yaml - global 3D point list -- SPARSE COPY WITH CURRENT TRACKS KEPT
				cameras:
					...
				views:
					...
				points:			SPARSE POINTS
					...

D			dense/PAIR/dense.yaml - pair optimized dense points with patches
				points:
					...



E			points.yaml - dense point reconstruction info
				cameras:
					...
				views:
					...
				points:
					...
				ACCUMULATED DENSE POINTS


E			triangles.yaml - triangle reconstruction - triangle soup of approximated surface & texture mapping
				points:
					-
						X: ...
						Y: ...
						Z: ...
				triangles:
					-
						A:
							i: # vertex index
							x: # 2D location
							y:
						B:
							i:
							x:
							y:
						C:
							i:
							x:
							y:
						t: "0" # texture atlas id
					...

F			packing.yaml -- bin packing planning for construction of textures
				- views # remaining views to be loaded
					-
						id: ID (to info.yaml)
				- triangles:
					-
						i: # triangle index (to triangles.yaml)
						A: # view ID (to info.yaml)
						B: # view ID

F			textures.yaml
				textures:
					-
						id: "0"
						file: tex0.png
						width: 512
						height: 512
					...
			textures/
				tex0.png
				tex1.png
				...

		scene/
			0/
				info.yaml 														# scene info [cameras, background, model(if altered)]
					cameras:													# copied
						-
							id: ID
							K: fx,fy,s,cx,cy
						...
					views: 														# copied - actual real-world picture image source
						-
							camera: camera index / ID
							transform: ABS TRANS
							preview: image0.png									# preview sized image for visualizing ~ 178x100
						...
					vantages: 													# user-created scene views
						-
							K: fx,fy,s,cx,cy
							transform: ABS TRANS
						...
					snapshots: 													# user-created photos of scene
						-
							id: ID
							name: My Screenshot
							file: snapshot0.png
						...
				surface.yaml													# initially a copy of triangles.yaml
				textures.yaml													# initially a copy of textures.yaml
				textures/
					tex0.png
				snapshots/
					snapshot0.png
				views/
					view0.png





			- format of triangle / texture files

			textures
				-
					- id: "0123"
					- file: "tex_0123.png"
					- width: 1024
					- height: 1024
				- ...

			triangles:
				-
					- t:
					- A
						- i # vertex index
						- x # [0-1]
						- y # [0-1]
					- B
						- ...
					- C
						- ...





	*/
App3DR.ProjectManager = function(relativePath, operatingStage, readyFxn){ // very async heavy
	App3DR.ProjectManager._.constructor.call(this);
	// this._operation = App3DR.ProjectManager.OPERATION_UNKNOWN;
	this._operationQueue = [];
	var timestampNow = Code.getTimeStampFromMilliseconds();
	this._titleName = "New Project "+Code.getHumanReadableDateString(timestampNow);
	this._createdTimestamp = timestampNow;
	this._modifiedTimestamp = timestampNow;
	this._workingPath = relativePath;
	this._clientFile = new ClientFile();
	this._clientFile.addFunction(ClientFile.EVENT_GET_COMPLETE, this._handleFileClientComplete, this);
	this._clientFile.addFunction(ClientFile.EVENT_SET_COMPLETE, this._handleFileClientComplete, this);
	this._clientFile.addFunction(ClientFile.EVENT_DEL_COMPLETE, this._handleFileClientComplete, this);
	this._clientFile.addFunction(ClientFile.EVENT_MOV_COMPLETE, this._handleFileClientComplete, this);
	this._views = [];
	this._pairs = [];
	this._triples = [];
	this._cameras = [];
	this._bundleFilename = null; // TO BE REMOVED
	// reconstruction related:
	this._graphFilename = null;
		this._graphData = null;
	this._tracksFilename = null;
		this._tracksData = null;
	this._trackCount = null;

	this._sparseFilename = null;
		this._sparseData = null;
	this._sparseCount = null;

	this._denseFilename = null;
	this._denseCount = null;

	this._pointsFilename = null;
	this._pointsCount = null;

	// this._sparseInfo = null;
	// this._sparsePoints = null;
	// this._denseInfo = null;
	// this._densePoints = null;
	this._triangles = null;
	this._triangleCount = null;
	this._packing = null;
	this._packingCount = null;
	this._textures = null;
	this._textureCount = null;
	this._packing = null;
	this._scenes = [];
	// operations related
	this._loading = true;
	this._stage = operatingStage;
	this._ticker = new Ticker();
	this._isBackgroundTasks = false;
	this.loadProjectFile(readyFxn);
}
Code.inheritClass(App3DR.ProjectManager,Dispatchable);

App3DR.ProjectManager.EVENT_LOADED = "pm.loaded";


App3DR.ProjectManager.INFO_FILE_NAME = "info.yaml";
App3DR.ProjectManager.FEATURES_FILE_NAME = "features.yaml";
App3DR.ProjectManager.VIEWS_DIRECTORY = "views";
App3DR.ProjectManager.PICTURES_DIRECTORY = "pictures";
App3DR.ProjectManager.PICTURE_MASK_FILE_NAME = "mask.png";
App3DR.ProjectManager.CAMERAS_DIRECTORY = "cameras";
	App3DR.ProjectManager.CAMERA_MATCHES_FILE_NAME = "matches.yaml";
App3DR.ProjectManager.PAIRS_DIRECTORY = "pairs";
	App3DR.ProjectManager.INITIAL_MATCHES_FILE_NAME = "matches.yaml"; // points
	App3DR.ProjectManager.PAIR_RELATIVE_FILE_NAME = "relative.yaml";
	App3DR.ProjectManager.PAIR_TRACKS_FILE_NAME = "tracks.yaml";
App3DR.ProjectManager.TRIPLES_DIRECTORY = "triples";
	// App3DR.ProjectManager.TRIPLE_MATCHES_FILE_NAME = "matches.yaml"; // points
	App3DR.ProjectManager.TRIPLE_RELATIVE_FILE_NAME = "relative.yaml"; // 3D


App3DR.ProjectManager.BUNDLE_ADJUST_DIRECTORY = "bundle";
	App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME = "info.yaml"; // TBD

// TODO:
App3DR.ProjectManager.RECONSTRUCT_DIRECTORY = "reconstruct";
App3DR.ProjectManager.RECONSTRUCT_TRACKS_FILE_NAME = "tracks.yaml";
App3DR.ProjectManager.RECONSTRUCT_GRAPH_FILE_NAME = "graph.yaml";
// App3DR.ProjectManager.BUNDLE_SPARSE_POINTS_FILE_NAME = "points_sparse.yaml";
// App3DR.ProjectManager.BUNDLE_SPARSE_INFO_FILE_NAME = "info_sparse.yaml";
// App3DR.ProjectManager.BUNDLE_DENSE_POINTS_FILE_NAME = "points_dense.yaml";
App3DR.ProjectManager.BUNDLE_SPARSE_FILE_NAME = "sparse.yaml";
App3DR.ProjectManager.BUNDLE_DENSE_FILE_NAME = "dense.yaml";
App3DR.ProjectManager.RECONSTRUCT_DENSE_DIRECTORY = "dense";
App3DR.ProjectManager.RECONSTRUCT_DENSE_FILENAME = "dense.yaml";
App3DR.ProjectManager.RECONSTRUCT_POINTS_FILE_NAME = "points.yaml";
// App3DR.ProjectManager.BUNDLE_DENSE_INFO_FILE_NAME = "info_dense.yaml";
// App3DR.ProjectManager.SPARSE_MATCHES_FILE_NAME = "sparse.yaml"; // sparse points + transform
// App3DR.ProjectManager.MEDIUM_MATCHES_FILE_NAME = "medium.yaml";
// App3DR.ProjectManager.DENSE_MATCHES_FILE_NAME = "dense.yaml";
App3DR.ProjectManager.TRIPLES_DIRECTORY = "triples";

App3DR.ProjectManager.prototype.isLoaded = function(){
	return !this._loading;
}
App3DR.ProjectManager.prototype.views = function(){
	return this._views;
}
App3DR.ProjectManager.prototype.pairs = function(){
	return this._pairs;
}
App3DR.ProjectManager.prototype.allPairsWithViewID = function(viewID){
	var matching = [];
	var pairs = this._pairs;
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var viewA = pair.viewA();
		var viewB = pair.viewB();
		var idA = viewA.id();
		var idB = viewB.id();
		if(idA==viewID || idB==viewID){
			matching.push(pair);
		}
	}
	return matching;
}
App3DR.ProjectManager.prototype.pairFromViewIDs = function(viewAID,viewBID){
	var pairs = this._pairs;
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var viewA = pair.viewA();
		var viewB = pair.viewB();
		var idA = viewA.id();
		var idB = viewB.id();
		if( (idA==viewAID && idB==viewBID) || (idA==viewBID && idB==viewAID) ){
			return pair;
		}
	}
	return null;
}
App3DR.ProjectManager.prototype.triples = function(){
	return this._triples;
}
App3DR.ProjectManager.prototype.cameras = function(){
	return this._cameras;
}
App3DR.ProjectManager.prototype.hasGraph = function(){
	return this._graphFilename != null;
}
App3DR.ProjectManager.prototype.graphFilename = function(){
	return this._graphFilename;
}
App3DR.ProjectManager.prototype.setGraphFilename = function(graph){
	this._graphFilename = graph;
}
App3DR.ProjectManager.prototype.graphData = function(){
	return this._graphData;
}
App3DR.ProjectManager.prototype.tracksDone = function(){
	return this._trackCount != null;
}
App3DR.ProjectManager.prototype.tracksFilename = function(){
	return this._tracksFilename;
}
App3DR.ProjectManager.prototype.setTracksFilename = function(track){
	this._tracksFilename = track;
}
App3DR.ProjectManager.prototype.tracksData = function(){
	return this._tracksData;
}
App3DR.ProjectManager.prototype.setTrackCount = function(count){
	this._trackCount = count;
}

App3DR.ProjectManager.prototype.sparseFilename = function(){
	return this._sparseFilename;
}
App3DR.ProjectManager.prototype.setSparseFilename = function(sparse){
	this._sparseFilename = sparse;
}
App3DR.ProjectManager.prototype.sparseData = function(){
	return this._sparseData;
}
App3DR.ProjectManager.prototype.setSparseCount = function(count){
	this._sparseCount = count;
}
App3DR.ProjectManager.prototype.sparseDone = function(){
	return this._sparseCount != null;
}

App3DR.ProjectManager.prototype.denseFilename = function(){
	return this._denseFilename;
}
App3DR.ProjectManager.prototype.setDenseFilename = function(dense){
	this._denseFilename = dense;
}
App3DR.ProjectManager.prototype.denseData = function(){
	return this._denseData;
}
App3DR.ProjectManager.prototype.setDenseCount = function(count){
	this._denseCount = count;
}
App3DR.ProjectManager.prototype.denseDone = function(){
	return this._denseCount != null;
}

App3DR.ProjectManager.prototype.pointsFilename = function(){
	return this._pointsFilename;
}
App3DR.ProjectManager.prototype.setPointsFilename = function(points){
	this._pointsFilename = points;
}
App3DR.ProjectManager.prototype.pointsData = function(){
	return this._pointsData;
}
App3DR.ProjectManager.prototype.setPointsCount = function(count){
	this._pointsCount = count;
}
App3DR.ProjectManager.prototype.pointsDone = function(){
	return this._pointsCount != null;
}

App3DR.ProjectManager.prototype.bundleFilename = function(file){
	if(file!==undefined){
		this._bundleFilename = file;
	}
	return this._bundleFilename;
}
App3DR.ProjectManager.prototype.infoPath = function(){
	var infoPath = Code.appendToPath(this._workingPath,App3DR.ProjectManager.INFO_FILE_NAME);
	console.log("infoPath: '"+infoPath+"'");
	return infoPath;
}

App3DR.ProjectManager.prototype.addOperation = function(operation, param, callback, context, object){
	var operation = {"operation":operation, "param":param, "callback":callback, "context":context, "object":object};
	this._operationQueue.push(operation);
	this.checkOperations();
}
App3DR.ProjectManager.prototype._handleFileClientComplete = function(data){
	var operation = this._operation;
	this._operation = null;
	if(operation){
		var object = operation["object"];
		var callback = operation["callback"];
		var context = operation["context"];
		// console.log(callback);
		// console.log(context);
		// console.log(object);
		// console.log(data);
		callback.call(context, object, data);
	}
	this.checkOperations();
}
App3DR.ProjectManager.prototype.checkOperations = function(){
	if(this._operation){
		return;
	}
	if(this._operationQueue.length==0){
		return;
	}
	var operation = this._operationQueue.shift();
	var op = operation["operation"];
	var param = operation["param"];
		var path = param["path"];
		var data = param["data"];
	if(op=="GET"){
		this._clientFile.get(path);
	}else if(op=="SET"){
		this._clientFile.set(path,data);
	}else if(op=="DEL"){
		this._clientFile.del(path);
	}else{
		console.log("not implemented");
	}
	this._operation = operation;
}

App3DR.ProjectManager.prototype._loadProjectCallback = function(object, data){
	if(data){
		var str = Code.binaryToString(data);
		var yaml = YAML.parse(str);
		this.setFromYAML(yaml);
		var callback = object["callback"];
		if(callback){
			callback();
		}
	}else{
		console.log("no data, save file");
		this.saveProjectFile();
	}
	this._loading = false;
	this.alertAll(App3DR.ProjectManager.EVENT_LOADED, this);
}
App3DR.ProjectManager.prototype._saveProjectCallback = function(object, data){
	console.log("saved");
}

App3DR.ProjectManager.prototype.setFromYAML = function(object){
	var i, len;
	console.log("from yaml: ");
	console.log(object);
	if(Code.isArray(object)){
		object = object[0];
		console.log(object);
	}
	var title = object["title"];
	var created = object["created"];
	var modified = object["modified"];
	var views = object["views"];
	var pairs = object["pairs"];
	var triples = object["triples"];
	var cameras = object["cameras"];
	var bundle = object["bundle"];
	var graph = object["graph"];
	var tracks = object["tracks"];
	var trackCount = object["trackCount"];
	var sparse = object["sparse"];
	var sparseCount = object["sparseCount"];
	var dense = object["dense"];
	var denseCount = object["denseCount"];
	var pointsCount = object["pointsCount"];
	var points = object["points"];

	this._titleName = title;
	this._createdTimestamp = created;
	this._modifiedTimestamp = modified;
	this._views = [];
	if(views){
		len = views.length;
		for(i=0; i<len; ++i){
			var v = views[i];
			var view = new App3DR.ProjectManager.View(this);
			view.readFromObject(v);
			this._views.push(view);
		}
	}
	this._pairs = [];
	if(pairs){
		len = pairs.length;
		for(i=0; i<len; ++i){
			var p = pairs[i];
			var pair = new App3DR.ProjectManager.Pair(this);
			pair.readFromObject(p);
			this._pairs.push(pair);
		}
	}
	this._triples = [];
	if(triples){
		len = triples.length;
		for(i=0; i<len; ++i){
			var t = triples[i];
			var triple = new App3DR.ProjectManager.Triple(this);
			triple.readFromObject(t);
			this._triples.push(triple);
		}
	}
	this._cameras = [];
	if(cameras){
		len = cameras.length;
		for(i=0; i<len; ++i){
			var c = cameras[i];
			var camera = new App3DR.ProjectManager.Camera(this);
			camera.readFromObject(c);
			this._cameras.push(camera);
		}
	}
	this._bundleFilename = bundle ? bundle : null;
	this._graphFilename = Code.valueOrDefault(graph, null);
	this._tracksFilename = Code.valueOrDefault(tracks, null);
	this._sparseFilename = Code.valueOrDefault(sparse, null);
	this._denseFilename = Code.valueOrDefault(dense, null);
	this._trackCount = Code.valueOrDefault(trackCount, null);
	this._sparseCount = Code.valueOrDefault(sparseCount, null);
	this._denseCount = Code.valueOrDefault(denseCount, null);
	this._pointsFilename = Code.valueOrDefault(points, null);
	this._pointsCount = Code.valueOrDefault(pointsCount, null);
}
App3DR.ProjectManager.prototype.toYAML = function(){
	var modified = Code.getTimeStampFromMilliseconds();
	this._modifiedTimestamp = modified;
	var i, len;
	var yaml = new YAML();
	yaml.writeComment("3DR Project File 0");
	yaml.writeBlank();
	yaml.writeString("title", this._titleName);
	yaml.writeString("created", this._createdTimestamp);
	yaml.writeString("modified", this._modifiedTimestamp);
	yaml.writeBlank();
	// views
	len = this._views ? this._views.length : 0;
	if(len>0){
		yaml.writeArrayStart("views");
		for(i=0; i<len; ++i){
			var view = this._views[i];
			yaml.writeObjectStart();
				view.toYAML(yaml);
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	yaml.writeBlank();
	// pairs
	len = this._pairs ? this._pairs.length : 0;
	if(len>0){
		yaml.writeArrayStart("pairs");
		for(i=0; i<len; ++i){
			var pair = this._pairs[i];
			yaml.writeObjectStart();
				pair.toYAML(yaml);
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	yaml.writeBlank();
	// triples
	len = this._triples ? this._triples.length : 0;
	if(len>0){
		yaml.writeArrayStart("triples");
		for(i=0; i<len; ++i){
			var triple = this._triples[i];
			yaml.writeObjectStart();
				triple.toYAML(yaml);
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	yaml.writeBlank();
	// cameras
	len = this._cameras ? this._cameras.length : 0;
	if(len>0){
		yaml.writeArrayStart("cameras");
		for(i=0; i<len; ++i){
			var camera = this._cameras[i];
			console.log(camera);
			yaml.writeObjectStart();
				camera.toYAML(yaml);
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	yaml.writeBlank();

	// ...


	// reconstruction
	yaml.writeString("graph",this._graphFilename);
	yaml.writeBlank();

	yaml.writeString("tracks",this._tracksFilename); // not using
	yaml.writeNumber("trackCount",this._trackCount);
	yaml.writeBlank();
	// sparse
	yaml.writeString("sparse",this._sparseFilename);
	yaml.writeNumber("sparseCount",this._sparseCount);
	yaml.writeBlank();
	// dense
	yaml.writeString("dense",this._denseFilename);
	yaml.writeNumber("denseCount",this._denseCount);
	yaml.writeBlank();
	// points
	yaml.writeString("points",this._pointsFilename);
	yaml.writeNumber("pointsCount",this._pointsCount);
	yaml.writeBlank();
	// triangles



	// legacy
	yaml.writeString("bundle",this._bundleFilename);
	yaml.writeBlank();


	yaml.writeBlank();

	var str = yaml.toString();
	return str;
}
App3DR.ProjectManager.prototype.loadProjectFile = function(readyFxn){
	console.log("loadProjectFile");
	this._loading = true;
	this._operation = App3DR.ProjectManager.OPERATION_LOAD_PROJECT;
	this.addOperation("GET", {"path":this.infoPath(),"data":null}, this._loadProjectCallback, this, {"callback":readyFxn} );
}
App3DR.ProjectManager.prototype.saveProjectFile = function(){
	console.log("saveProjectFile");
	this._operation = App3DR.ProjectManager.OPERATION_SAVE_PROJECT;
	var str = this.toYAML();
	var binary = Code.stringToBinary(str);
	this.addOperation("SET", {"path":this.infoPath(),"data":binary}, this._saveProjectCallback, this, null);
}
App3DR.ProjectManager.ID_LENGTH = 8;
App3DR.ProjectManager._randomID = function(){
	return Code.randomID(App3DR.ProjectManager.ID_LENGTH);
}
App3DR.ProjectManager.prototype._uniqueViewID = function(){
	return App3DR.ProjectManager._uniqueArrayItemID( this._views, function(v){ return v.id(); } );
}
App3DR.ProjectManager.prototype._uniquePairID = function(){
	return App3DR.ProjectManager._uniqueArrayItemID( this._pairs, function(p){ return p.id(); } );
}
App3DR.ProjectManager.prototype._uniqueTripleID = function(){
	return App3DR.ProjectManager._uniqueArrayItemID( this._triples, function(p){ return p.id(); } );
}
App3DR.ProjectManager.prototype._uniqueCameraID = function(){
	return App3DR.ProjectManager._uniqueArrayItemID( this._cameras, function(c){ return c.id(); } );
}
App3DR.ProjectManager._uniqueArrayItemID = function(array, fxn){
	var i, len = array.length;
	var duplicate = true;
	while(duplicate){
		var randomID = App3DR.ProjectManager._randomID();
		duplicate = false;
		for(i=0; i<len; ++i){
			var itemID = fxn(array[i]);
			if(itemID==randomID){
				duplicate = true;
				break;
			}
		}
	}
	return randomID;
}
App3DR.ProjectManager.prototype.addView = function(callback, context){
	console.log("addView");
	var nextIndex = this._views.length;
	var directory = this._uniqueViewID();
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, directory);
	var view = new App3DR.ProjectManager.View(this, "New View "+directory, directory);
	this._views.push(view);
	this.addOperation("SET", {"path":path}, callback, context, view);
}
App3DR.ProjectManager.prototype.removeView = function(view, callback, context){
	var i, v, len = this._views.length;
	var foundView = -1;
	for(i=0; i<len; i++){
		v = this._views[i];
		if(v==view){
			foundView = i;
			break;
		}
	}
	if(foundView>=0){
		console.log("removeView ... ");
		Code.removeElementAt(this._views,foundView);
		view.unload();
		var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, view.directory());
		var object = {"view":view, };
		this.addOperation("DEL", {"path":path}, callback, context, object);
		this.saveProjectFile();
		return true;
	}
	return false;
}
App3DR.ProjectManager.prototype.addPictureForView = function(view, filename, size, scale, binary, callback, context, object){
	console.log("doing");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, view.directory(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log(path);
	this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
}
App3DR.ProjectManager.prototype.saveFeaturesForView = function(view, features, filename, callback, context, object){
	console.log("saveFeaturesForView");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, view.directory(), filename);
	console.log(path);
	if(features){
		var str = this._featuresToYAML(features);
		var binary = Code.stringToBinary(str);
		this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
	}else{
		this.addOperation("DEL", {"path":path}, callback, context, object);
	}
}
App3DR.ProjectManager.prototype.loadFeaturesForView = function(view, filename, callback, context, object){
	console.log("loadFeaturesForView");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, view.directory(), filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}

App3DR.ProjectManager.prototype.hasBundleInit = function(){
	return this._bundleFilename !== null;
}
App3DR.ProjectManager.prototype.loadBundleAdjust = function(callback, context, object){
	var filename = this._bundleFilename;
	// filename = "info.yaml";
	console.log("loadBundleAdjust: "+filename);
	if(filename){
		var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.BUNDLE_ADJUST_DIRECTORY, filename);
		console.log(path);
		this.addOperation("GET", {"path":path}, callback, context, object);
	}
}
App3DR.ProjectManager.prototype.saveBundleAdjust = function(string, callback, context, object){
	console.log("saveBundleAdjust");
	var filename = this._bundleFilename;

	if(filename){
		var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.BUNDLE_ADJUST_DIRECTORY, filename);
		console.log(path);
		var binary = Code.stringToBinary(string);
		this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
	}
}

App3DR.ProjectManager.prototype.savePairRelative = function(pair, string, callback, context, object){
	console.log("savePairRelative: "+pair.id());
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), App3DR.ProjectManager.PAIR_RELATIVE_FILE_NAME);
	console.log(path+" ... ");
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context, pair);
}

App3DR.ProjectManager.prototype.savePairTracks = function(pair, string, callback, context, object){
	console.log("savePairTracks: "+pair.id());
	console.log(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), App3DR.ProjectManager.PAIR_TRACKS_FILE_NAME)
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), App3DR.ProjectManager.PAIR_TRACKS_FILE_NAME);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context, pair);
}
App3DR.ProjectManager.prototype.pair = function(idA,idB){
	var pairs = this._pairs;
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		if(pair.isPair(idA,idB)){
			return pair;
		}
	}
	return null;
}
App3DR.ProjectManager.prototype.triple = function(idA,idB,idC){
	var triples = this._triples;
	for(var i=0; i<triples.length; ++i){
		var triple = triples[i];
		if(triple.isTriple(idA,idB,idC)){
			return triple;
		}
	}
	return null;
}

App3DR.ProjectManager.prototype.addPair = function(viewA, viewB, callback, context){
	console.log("addPair");
	var viewAID = viewA.id();
	var viewBID = viewB.id();
	var directory = this._uniquePairID();
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, directory);
	var pair = new App3DR.ProjectManager.Pair(this, directory, viewAID, viewBID);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["pair"] = pair;
	this.addOperation("SET", {"path":path}, this._addPairComplete, this, object);
	return pair;
}
App3DR.ProjectManager.prototype._addPairComplete = function(object, data){
	console.log("_addPairComplete");
	var callback = object["callback"];
	var context = object["context"];
	var pair = object["pair"];
	this._pairs.push(pair);
	this.saveProjectFile();
	callback.call(context, pair);
}

App3DR.ProjectManager.prototype.loadMatchingDataForPair = function(pair, filename, callback, context, object){
	console.log("loadMatchingDataForPair");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}
App3DR.ProjectManager.prototype.loadRelativeDataForPair = function(pair, filename, callback, context, object){
	console.log("loadRelativeDataForPair");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}

App3DR.ProjectManager.prototype.loadMatchingDataForTriple = function(triple, filename, callback, context, object){
	console.log("loadMatchingDataForTriple");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.TRIPLES_DIRECTORY, triple.directory(), filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}



App3DR.ProjectManager.prototype.addTriple = function(viewA, viewB, viewC, callback, context){
	console.log("addTriple");
	var viewAID = viewA.id();
	var viewBID = viewB.id();
	var viewCID = viewC.id();
	var directory = this._uniqueTripleID();
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.TRIPLES_DIRECTORY, directory);
	var triple = new App3DR.ProjectManager.Triple(this, directory, viewAID, viewBID, viewCID);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["triple"] = triple;
	this.addOperation("SET", {"path":path}, this._addTripleComplete, this, object);
	return triple;
}
App3DR.ProjectManager.prototype._addTripleComplete = function(object, data){
	var callback = object["callback"];
	var context = object["context"];
	var triple = object["triple"];
	this._triples.push(triple);
	this.saveProjectFile();
	callback.call(context, triple);
}
App3DR.ProjectManager.prototype.saveTripleRelative = function(triple, string, callback, context, object){
	console.log("saveTripleRelative: "+triple.id());
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.TRIPLES_DIRECTORY, triple.directory(), App3DR.ProjectManager.TRIPLE_RELATIVE_FILE_NAME);
	console.log(path+" ... ");
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context, triple);
}


App3DR.ProjectManager.prototype.addCamera = function(callback, context){
	console.log("addCamera");
	var directory = this._uniqueCameraID();
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, directory);
	var camera = new App3DR.ProjectManager.Camera(this, "New Camera "+directory, directory);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["camera"] = camera;
	this.addOperation("SET", {"path":path}, this._addCameraComplete, this, object);
}
App3DR.ProjectManager.prototype._addCameraComplete = function(object, data){
	var callback = object["callback"];
	var context = object["context"];
	var camera = object["camera"];
	this._cameras.push(camera);
	this.saveProjectFile();
	callback.call(context, camera);
}

App3DR.ProjectManager.prototype.addPictureForCamera = function(camera, filename, size, scale, binary, callback, context, object){
	console.log("doing");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, camera.directory(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log(path);
	this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
}
App3DR.ProjectManager.prototype.addMatchesForCamera = function(camera, filename, binary, callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, camera.directory(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log(path);
	this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
}
App3DR.ProjectManager.prototype.loadCalibrationDataForCamera = function(camera, filename, callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, camera.directory(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}




App3DR.ProjectManager.prototype.saveGraph = function(string, filename, callback, context, object){
	console.log("saveGraph: ");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadGraph = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.graphFilename());
	console.log("loadGraph: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadGraphComplete, this, object);
}
App3DR.ProjectManager.prototype._loadGraphComplete = function(object, data){
	console.log("_loadTracksComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._graphData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}



App3DR.ProjectManager.prototype.saveTracks = function(string, filename, callback, context, object){
	console.log("saveTracks: ");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadTracks = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.tracksFilename());
	console.log("loadTracks: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadTracksComplete, this, object);
}
App3DR.ProjectManager.prototype._loadTracksComplete = function(object, data){
	console.log("_loadTracksComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._tracksData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}






App3DR.ProjectManager.prototype.saveSparse = function(string, filename, callback, context, object){
	console.log("saveSparse: ");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadSparse = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.sparseFilename());
	console.log("loadSparse: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadSparseComplete, this, object);
}
App3DR.ProjectManager.prototype._loadSparseComplete = function(object, data){
	console.log("_loadTracksComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._sparseData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}




App3DR.ProjectManager.prototype.saveDense = function(string, filename, callback, context, object){
	console.log("saveDense: ");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadDense = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.denseFilename());
	console.log("loadDense: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadDenseComplete, this, object);
}
App3DR.ProjectManager.prototype._loadDenseComplete = function(object, data){
	console.log("_loadTracksComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._denseData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}



App3DR.ProjectManager.prototype.savePoints = function(string, filename, callback, context, object){
	console.log("savePoints: ");
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, filename);
	var yamlBinary = Code.stringToBinary(string);
	this.addOperation("SET", {"path":path, "data":yamlBinary}, callback, context);
}
App3DR.ProjectManager.prototype.loadPoints = function(callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, this.pointsFilename());
	console.log("loadPoints: "+path);
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this.addOperation("GET", {"path":path}, this._loadPointsComplete, this, object);
}
App3DR.ProjectManager.prototype._loadPointsComplete = function(object, data){
	console.log("_loadPointsComplete");
	var callback = object["callback"];
	var context = object["context"];
	this._pointsData = this.dataToObject(data);
	if(callback && context){
		callback.call(context, this);
	}
}




App3DR.ProjectManager.prototype.dataToObject = function(data){
	var str = Code.binaryToString(data);
	var object = YAML.parse(str);
	if(Code.isArray(object)){
		object = object[0];
	}
	return object;
}


App3DR.ProjectManager.prototype.viewCount = function(){
	return 0;
}
// App3DR.ProjectManager.prototype.createDirectoryForView = function(view, callback){
// 	var path = Code.appendToPath(this._workingPath, directory);
// 	console.log(path);
// 	this._viewDirectoryCallback = callback;
// 	this._clientFile.set(path);
// }
App3DR.ProjectManager.prototype.setMatching = function(indexA,indexB, matches){

}
App3DR.ProjectManager.prototype.pairCount = function(){
	return 0;
}
App3DR.ProjectManager.prototype.setReconstruction = function(points){

}
App3DR.ProjectManager.prototype.setModel = function(stuff){
	// cameras
	// textures
	// background
	//
}
// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.prototype.startBackgroundTasks = function(){
	this._isBackgroundTasks = true;
	this._ticker.addFunction(Ticker.EVENT_TICK, this._backgroundTaskTick, this);
	this._ticker.start();
}
App3DR.ProjectManager.prototype.stopBackgroundTasks = function(){
	this._isBackgroundTasks = false;
	this._ticker.removeFunction(Ticker.EVENT_TICK, this._backgroundTaskTick, this);
	this._ticker.stop();
}
App3DR.ProjectManager.prototype.pauseBackgroundTasks = function(){
	this._ticker.stop();
}
App3DR.ProjectManager.prototype._backgroundTaskTick = function(){
	this.checkPerformNextTask();
}
App3DR.ProjectManager.prototype.checkPerformNextTask = function(){
this.pauseBackgroundTasks();
console.log("checkPerformNextTask");
// don't 1 - run
// return;
	this._taskBusy = true;
	var i, j, k, len;
	console.log("next task?");
	var views = this._views;
	var pairs = this._pairs;
	var triples = this._triples;
	// do all views have images sized down to 150x100?
		// ASSUMED DONE ...
	// do all views have features detected?
	len = views.length;
	console.log(views);
	for(i=0; i<len; ++i){
		var view = views[i];
		var hasFeatures = view.hasFeatures();
		if(!hasFeatures){
			this.calculateFeatures(view);
			return;
		}
	}
// throw "task pair features";
	// does a feature-match pair exist (even a bad match) between every view?
	len = views.length;
	console.log(pairs);
	for(i=0; i<len; ++i){
		var viewA = views[i];
		var idA = viewA.id();
		for(j=i+1; j<len; ++j){
			var viewB = views[j];
			var idB = viewB.id();
			var found = false;
			var foundPair = null;
			for(k=0; k<pairs.length; ++k){
				var pair = pairs[k];
				// console.log(pair.isPair(idA,idB)+" ? "+idA+" "+idB+" = "+pair.id())
				if(pair.isPair(idA,idB)){
					foundPair = pair;
					// console.log(" "+idA+" & "+idB+" has match: "+pair.hasMatch());
					if(pair.hasMatch()){
						found = true;
					}
					break;
				}
			}
			if(!found){
				console.log("need to match pair ... "+idA+" & "+idB);
				this.calculatePairMatch(viewA,viewB, foundPair);
				return;
			}
		}
	}
	// cameras:
	var cameras = this._cameras;
	console.log(cameras)
	len = cameras.length;
	for(i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		var camID = camera.id();
		console.log("CAMERA: "+camID);
		if(camera.needsDetection()){
			this.calculateCameraCheckerboard(camera, null);
			return;
		}
		if(camera.needsCalculation()){
			this.calculateCameraParameters(camera, null);
			return;
		}
	}
	if(views.length<2){
		return;
	}
// throw "...";
// throw "task dense pair";
	// assuming all pair matches have run
	len = views.length;
	for(i=0; i<len; ++i){
		var viewA = views[i];
		var idA = viewA.id();
		for(j=i+1; j<len; ++j){
			var viewB = views[j];
			var idB = viewB.id();
			for(k=0; k<pairs.length; ++k){
				var pair = pairs[k];
				if(pair.isPair(idA,idB)){
					if(!pair.hasRelative()){
						console.log("NEED TO DO A DENSE BA PAIR : "+idA+" & "+idB+" = "+pair.id());
						this.calculateBundleAdjustPair(viewA,viewB);
						return;
					}
					if(!pair.hasTracks()){
						console.log("NEED TO DO A TRACK PAIR : "+idA+" & "+idB+" = "+pair.id());
// throw "...";
						this.calculatePairTracks(viewA,viewB);
						return;
					}
				}
			}
		}
	}

// throw "task triples";
	// assuming all pairs have run
	console.log(triples);
	len = views.length;
	for(i=0; i<len; ++i){
		var viewA = views[i];
		var idA = viewA.id();
		for(j=i+1; j<len; ++j){
			var viewB = views[j];
			var idB = viewB.id();
			for(k=j+1; k<len; ++k){
				var viewC = views[k];
				var idC = viewC.id();
				var found = false;
				var foundTriple = null;
				for(t=0; t<triples.length; ++t){
					var triple = triples[t];
					if(triple.isTriple(idA,idB,idC)){
						found = true;
						if(!triple.hasRelative()){
							foundTriple = triple;
							break;
						}
					}
				}
				if(!found){
					console.log("NEED TO CREATE A TRIPLE : "+idA+" & "+idB+" & "+idC+" ");
					foundTriple = this.addTriple(viewA,viewB,viewC, function(a){
						console.log("triple created");
						this.saveProjectFile();
					}, this);
					return;
				}
				if(foundTriple){
					console.log("NEED TO DO TRIPLE MATCH: "+idA+" & "+idB+" & "+idC+" = "+foundTriple.id());
					this.calculateBundleAdjustTriple(viewA,viewB,viewC);
					return;
				}
			}
		}
	}
// throw "task graph";
	if(!this.hasGraph()){
		console.log("has no graph");
		this.calculateGlobalOrientationInit();
		return;
	}
// throw "task tracks";
	if(!this.tracksDone()){
		console.log("tracks not done");
		this.iterateGraphTracks();
		return;
	}
throw "task sparse";
if(!this.sparseDone()){
	console.log("sparse not done");
	this.iterateSparseTracks();
	return;
}
// throw "task dense";
if(!this.denseDone()){
	console.log("dense not done");
	this.iterateDenseTracks();
	return;
}

// throw "task BA";

if(!this.pointsDone()){
	this.iteratePointsFullBA();
	return;
}


throw "surface - triangles";


throw "textures";

throw "scene";



/*
console.log("need relative sizing - TFT / scale approx");
	var viewA = views[0];
	var viewB = views[1];
	var viewC = views[2];
	this.calculateTripleMatch(viewA,viewB,viewC);
throw "..."
*/
// return;


// don't 3 - run
// return;


	// first run with limited points
	// if(false){
	if(true){
	//if(!this.hasBundleInit()){
		// global relative => absolute initialization
		this.calculateGlobalOrientationInit(); // CREATES info.yaml
		return;
	}
return;
	// increase resolution of BA approx
	if(true){
		this.calculateGlobalOrientationHierarchyLoad(); // UPDATES info.yaml
		return;
	}
return;
	// global absolute finalizing
		// final BA with all data w/o making new points
	// throw "GLOBAL ABS FINALIZING";

	// surface
	if(false){
		// currently done separately in surface.html
		throw "SURFACE"
	}

	// texturing
	if(true){
		// ...
	}


	// dense ?

	//
	// does a camera calibration exist?
	// does each (good) pair have a camera estimation?
	// does each (good) pair have a camera transform?

	// does each (good) pair have a low-q dense depth match? [sort by best feature match count/score]

throw "OTHER ?"

	// does each (good) pair have a high-q dense depth match?
	console.log("NO TASKS TO PERFORM");
	this._taskBusy = false;
}
App3DR.ProjectManager.prototype.calculateFeatures = function(view){
	console.log("calculateFeatures");
	view.loadFeaturesImage(this._calculateFeaturesLoaded, this);
}
App3DR.ProjectManager.prototype._calculateFeaturesLoaded = function(view){
	var image = view.featuresImage();
	var imageMatrix = R3D.imageMatrixFromImage(image, this._stage);
	var maxCount = 2000;
	var features = R3D.calculateScaleCornerFeatures(imageMatrix, maxCount);
	var objects = R3D.generateSIFTObjects(features, imageMatrix);
	var normalizedObjects = R3D.normalizeSIFTObjects(objects, imageMatrix.width(), imageMatrix.height());
	view.setFeatures(normalizedObjects, this._calculateFeaturesComplete, this);
}
App3DR.ProjectManager.prototype._calculateFeaturesComplete = function(view){
	console.log("_calculateFeaturesComplete");
	console.log(view);
	//this._taskBusy = false;
	this.checkPerformNextTask();
}
App3DR.ProjectManager.prototype.loadImageForView = function(view, filename, callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.VIEWS_DIRECTORY, view.directory(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log("IMAGE PATH: "+path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}
App3DR.ProjectManager.prototype.loadImageForCamera = function(camera, filename, callback, context, object){
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.CAMERAS_DIRECTORY, camera.directory(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log("IMAGE PATH: "+path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}
App3DR.ProjectManager.prototype.calculatePairMatch = function(viewA, viewB, pair, callback, context, object){
	console.log("calculatePairMatch");
	// ...
	var featuresA = null;
	var featuresB = null;
	var imageA = null;
	var imageB = null;
	var stage = this._stage;
	var self = this;
	var matchCount = null;
	var fxnA = function(){ // load features A
		viewA.loadFeatures(function(){
			featuresA = viewA.features();
			fxnReadyCheck();
		}, self);
	}
	var fxnB = function(v){ // load features B
		viewB.loadFeatures(function(){
			featuresB = viewB.features();
			fxnReadyCheck();
		}, self);
	}
	var fxnC = function(){ // load matching Image A
		viewA.loadMatchingImage(function(){
			imageA = viewA.matchingImage();
			fxnReadyCheck();
		}, self);
	}
	var fxnD = function(){// load matching Image B
		viewB.loadMatchingImage(function(){
			imageB = viewB.matchingImage();
			fxnReadyCheck();
		}, self);
	}

	var fxnReadyCheck = function(){
		if(!(featuresA && featuresB && imageA && imageB)){
			return;
		}
		console.log("GO");
		var imageAWidth = imageA.width;
		var imageAHeight = imageA.height;
		var imageBWidth = imageB.width;
		var imageBHeight = imageB.height;

		console.log("A: "+featuresA.length+" | "+featuresB.length)

		// drop low score corners:
		// featuresA = R3D.keepGoodCornerFeatures(featuresA);
		// featuresB = R3D.keepGoodCornerFeatures(featuresB);

		console.log("B: "+featuresA.length+" | "+featuresB.length)

		featuresA = R3D.denormalizeSIFTObjects(featuresA, imageAWidth, imageAHeight);
		featuresB = R3D.denormalizeSIFTObjects(featuresB, imageBWidth, imageBHeight);

		var imageMatrixA = R3D.imageMatrixFromImage(imageA, stage);
		var imageMatrixB = R3D.imageMatrixFromImage(imageB, stage);
		// from limited SIFT to points
		// var pointsA = R3D.generatePointsFromSIFTObjects(featuresA);
		// var pointsB = R3D.generatePointsFromSIFTObjects(featuresB);
		// TO SIFT OBJECTS
		var maxFeatures = 2000;
		var objectsA = R3D.generateSIFTObjects(featuresA, imageMatrixA);
		var objectsB = R3D.generateSIFTObjects(featuresB, imageMatrixB);
		console.log("C: "+objectsA.length+" | "+objectsB.length)
		var maxFeaturesCompare = 2000;
		var info = R3D.basicFullMatchingF(objectsA, imageMatrixA, objectsB, imageMatrixB, maxFeaturesCompare);
		var matches = info["matches"];
		var F = info["F"];
		var sigma = info["sigma"];
console.log(matches);
		if(!matches){
			matches = [];
			F = null;
			sigma = 0;
		}else{
			// add affine info:
			R3D.stereoMatchAverageAffine(imageMatrixA,imageMatrixB,matches);
			// convert to R3D formats
			matches = R3D.stereoToMatchPairArray(imageMatrixA,imageMatrixB,matches);
		}
		matchCount = matches.length;
		var str = self._matchesToYAML(matches, F, viewA, viewB, imageMatrixA, imageMatrixB);
		var binary = Code.stringToBinary(str);
		yamlBinary = binary;
		console.log("HAVE PAIR? "+(pair!==null));
		if(pair){
			fxnG(pair);
		}else{
			self.addPair(viewA, viewB, fxnG, self);
		}

	}
	var yamlBinary = null;
	// var matchCount = -1;
	var fxnG = function(pair){
		var path = Code.appendToPath(self._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), App3DR.ProjectManager.INITIAL_MATCHES_FILE_NAME);
		pair.setMatchFeatureCount(matchCount);
		self.addOperation("SET", {"path":path, "data":yamlBinary}, fxnH, self, pair);
	}
	var fxnH = function(object, data){
// throw "HUH";
		self.saveProjectFile(); // TODO: add completion here
		return;
		// return to checking
		// self.startBackgroundTasks();
		// this.checkPerformNextTask();
	}
	fxnA();
	fxnB();
	fxnC();
	fxnD();
}

App3DR.ProjectManager.prototype.calculateTripleMatch = function(viewA, viewB, viewC, triple, callback, context, object){
	console.log("calculateTripleMatch");
	if(viewA && viewB && viewC){
		var imageA = null;
		var imageB = null;
		var imageC = null;
		var stage = this._stage;
		var self = this;
		var views = self.views();
		var pair1 = self.pair(viewA.id(),viewB.id());
		var pair2 = self.pair(viewA.id(),viewC.id());
		var pair3 = self.pair(viewB.id(),viewC.id());
		if(pair1 && pair2 && pair3){
			var yamlBinary = null;
			var matchCount = null;
			var matchAB, matchAC, matchBC;
			var fxnA = function(){
				viewA.loadFeaturesImage(fxnB, self);
			}
			var fxnB = function(){
				viewB.loadFeaturesImage(fxnC, self);
			}
			var fxnC = function(){
				viewC.loadFeaturesImage(fxnD, self);
			}
			var fxnD = function(){
				// pair1.loadMatchingData(fxnD, self);
				pair1.loadRelativeData(fxnE, self);
			}
			var fxnE = function(){
				// pair2.loadMatchingData(fxnF, self);
				pair2.loadRelativeData(fxnF, self);
			}
			var fxnF = function(){
				// pair3.loadMatchingData(fxnX, self);
				pair3.loadRelativeData(fxnX, self);
				// fxnX();
			}
			var fxnX = function(){
				// TODO: if it turns out views down have enough (or any) overlap -- skip ?
				console.log("LOADED ALL DATA");
				var imageA = viewA.featuresImage();
				var imageB = viewB.featuresImage();
				var imageC = viewC.featuresImage();

				var stage = self._stage;
				var imageMatrixA = R3D.imageMatrixFromImage(imageA, stage);
				var imageMatrixB = R3D.imageMatrixFromImage(imageB, stage);
				var imageMatrixC = R3D.imageMatrixFromImage(imageC, stage);

				var matchAB = pair1.relativeData();
				var matchAC = pair2.relativeData();
				var matchBC = pair3.relativeData();
				console.log(matchAB);

				// console.log(viewA.id()+" - "+viewB.id()+" - "+viewC.id());


				var result = App3DR.tripleInfo(imageMatrixA,imageMatrixB,imageMatrixC, viewA,viewB,viewC, matchAB,matchAC,matchBC);
				// viewA.id(),viewB.id(),viewC.id()
				console.log(result);

				/*
					need 3D points w 2d location

				*/



				/*
				var tripleInfo = R3D.triplePointMatches(matchAB,matchAC,matchBC, imageMatrixA,imageMatrixB,imageMatrixC);
				console.log(tripleInfo);
				// TODO: trifocal tensor from best point matches
				// 6 point alg
				// ransac
				// final inliers
				var scores = tripleInfo["scores"];
				matchCount = scores.length;

				var str = self._tripleMatchesToYAML(tripleInfo, viewA, viewB, viewC, imageMatrixA, imageMatrixB, imageMatrixC);
				var binary = Code.stringToBinary(str);
				yamlBinary = binary;
				var triple = null;

				if(triple){
					fxnY(triple);
				}else{
					self.addTriple(viewA,viewB,viewC, fxnY, this);
				}
				*/
			}
			/*
			var fxnY = function(triple){
				console.log("save triple data");
				return;
				var path = Code.appendToPath(self._workingPath, App3DR.ProjectManager.TRIPLES_DIRECTORY, triple.directory(), App3DR.ProjectManager.TRIPLE_MATCHES_FILE_NAME);
				console.log("path: "+path+"");
				triple.setMatchFeatureCount(matchCount);
				self.addOperation("SET", {"path":path, "data":yamlBinary}, fxnZ, self, triple);
			}
			var fxnZ = function(triple){
				console.log("saved triple");
				manager.saveProjectFile();
				this.checkPerformNextTask();
			}
			*/
			fxnA();
		}
	}
}
App3DR.tripleInfo = function(imageMatrixA,imageMatrixB,imageMatrixC, viewA,viewB,viewC, matchAB,matchAC,matchBC){
	var world = new Stereopsis.World();
	world.checkForIntersections(false);
	// console.log(viewA);
	// console.log(matchAB);
	var imageSizeA = imageMatrixA.size();


	var WORLDCAMS = [];
	var WORLDVIEWS = [];

	var camera = matchAB["cameras"][0];
	console.log(camera);
	var K = camera["K"];
		K = Matrix.loadFromObject(K);
		// K = R3D.cameraFromScaledImageSize(K, imageSizeA);
	console.log(K);
	var distortion = null;
	var c = world.addCamera(K, distortion);
	console.log(c);
	// c.data(camera.id()+"");
	// camera.temp(c);
	WORLDCAMS.push(c);

	var views = [viewA,viewB,viewC];
	var images = [imageMatrixA,imageMatrixB,imageMatrixC];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var matrix = images[i];
		var cam = WORLDCAMS[0];

		var K = cam.K();
		var distortion = cam.distortion();
		var v = world.addView(matrix, cam);
		// v.absoluteTransform(transform);
		view.temp(v);
		v.data(view.id());
		WORLDVIEWS.push(v);
	}

	var vA = WORLDVIEWS[0];
	var vB = WORLDVIEWS[1];
	var vC = WORLDVIEWS[2];

	// quick world-view lookup
	var WORLDVIEWSLOOKUP = {};
	for(var i=0; i<WORLDVIEWS.length; ++i){
	    var v = WORLDVIEWS[i];
	    WORLDVIEWSLOOKUP[v.data()] = v;
	}


	// TEMPS
	var o = new V2D(0,0);
	var x1 = new V2D();
	var x2 = new V2D();
	var y1 = new V2D();
	var y2 = new V2D();

	// points for match AB
	var matches = [];

		// matches.push([vA,vB, matchAB["points"]]);
		// matches.push([vA,vC, matchAC["points"]]);

		// matches.push([vA,vB, matchAB["points"]]);
		// matches.push([vB,vC, matchBC["points"]]);

		matches.push([vA,vC, matchAC["points"]]);
		matches.push([vB,vC, matchBC["points"]]);

	var pointCountAdded = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		// var vA = match[0];
		// var vB = match[1];
		var points = match[2];
		for(var p=0; p<points.length; ++p){
			var point = points[p];
			var point3D = new V3D(point["X"],point["Y"],point["Z"]);
			var pointViews = point["views"];

			for(var j=0; j<pointViews.length; ++j){
				var viewJ = pointViews[j];
				var vJ = WORLDVIEWSLOOKUP[viewJ["view"]];
				for(var k=j+1; k<pointViews.length; ++k){
					var viewK = pointViews[k];
					var vK = WORLDVIEWSLOOKUP[viewK["view"]];
					var fr = new V2D(viewJ["x"],viewJ["y"]);
					var to = new V2D(viewK["x"],viewK["y"]);
					x1.set(viewJ["Xx"],viewJ["Xy"]);
					y1.set(viewJ["Yx"],viewJ["Yy"]);
					x2.set(viewK["Xx"],viewK["Xy"]);
					y2.set(viewK["Yx"],viewK["Yy"]);
					// to image plane
					var sizeFr = vJ.size();
					var sizeTo = vK.size();
					fr.scale(sizeFr.x,sizeFr.y);
					to.scale(sizeTo.x,sizeTo.y);
					var affineAB = R3D.affineMatrixExact([o,x1,y1],[o,x2,y2]);
					// add
					world.addMatchFromInfo(vJ,fr, vK,to, affineAB, point3D);
					pointCountAdded++;
				}
			}
// if(pointCountAdded>1000){
// 	break;
// }
		}
	}
	console.log("pointCountAdded: "+pointCountAdded);

	world.printPoint3DTrackCount();


	var completeFxn = function(){
		console.log("completeFxn");
	}
	world.solveTriple(completeFxn, null);

	var result = {};
	return result;
}


App3DR.ProjectManager.prototype.calculateCameraCheckerboard = function(camera, callback, context, object){
	console.log("calculateCameraCheckerboard");
	var image = camera.needsDetectionImage();
	// console.log(image);
	var self = this;
	var fxnA = function(img){
		console.log("LOADED IMAGE");
		var img = image.calibrationImage();
		var stage = self._stage;
		var imageMatrix = R3D.imageMatrixFromImage(img, stage);
		var imageWidth = imageMatrix.width();
		var imageHeight = imageMatrix.height();
		var pointMatches = R3D.detectCheckerboard(imageMatrix, 10,10, true);
console.log(pointMatches);
// return;
		var points2D = [];
		var points3D = [];
var totalCount = 81;
		if(pointMatches){
			console.log(pointMatches);
			points2D = pointMatches["points2D"];
			points3D = pointMatches["points3D"];
		}
if(points2D.length!=totalCount){
	throw "wrong count: "+points2D.length+"!="+totalCount;
}
		for(var i=0; i<points2D.length; ++i){
			points2D[i].scale(1.0/imageWidth, 1.0/imageHeight);
		}
// throw "herp";
 // return; // TODO: REMOVE
		image.setCheckerboardMatches(points2D,points3D, fxnB, self);
	}
	var fxnB = function(){
		console.log("SAVED TO FILE");
		self.saveProjectFile();
	}
	image.loadCalibrationImage(fxnA, this);
}
App3DR.ProjectManager.prototype.calculateCameraParameters = function(camera, callback, context, object){
	console.log("calculateCameraParameters");
	var i;
	var expectedCount = 0;
	var callbackCount = 0;
	var calibrationImages = camera.images();
	var self = this;
	var fxnA = function(){
		++callbackCount;
		if(callbackCount==expectedCount){
			console.log('do');
			// var imageSizeWidth = 816;
			// var imageSizeHeight = 612;
			var pointList2D = [];
			var pointList3D = [];
			for(var i=0; i<calibrationImages.length; ++i){
				var calibrationImage = calibrationImages[i];
				//console.log(calibrationImage);
				var aspect = calibrationImage.aspectRatio();
				var width = 1.0;
				var height = width/aspect;
				console.log(width+"x"+height)
				var calibrationData = calibrationImage.calibrationData();
				if(Code.isArray(calibrationData)){
					calibrationData = calibrationData[0];
				}
				var matches = calibrationData["matches"];
				var points2D = [];
				var points3D = [];
				for(var j=0; j<matches.length; ++j){
					var match = matches[j];
					var point2D = new V2D(match["x"],match["y"]);
					var point3D = new V3D(match["X"],match["Y"],match["Z"]);
					points2D.push(point2D);
					points3D.push(point3D);
					if(j==0){
						console.log(point2D+"");
						console.log(point3D+"");
					}
				}
				pointList2D.push(points2D); // in [0,1], [0,h/w]
				pointList3D.push(points3D);
			}
			console.log(pointList2D)
			console.log(pointList3D)
			// pointList2D are aspect-ratioed points to fill [0,0]->[wid,h2w], eg: [0,0]->[1,0.75]
			var result = R3D.calibrateCameraK(pointList3D,pointList2D);
			console.log(result);

			var distortion = result["distortion"];


			//var result = R3D.calibrateCameraKIteritive(pointList3D,pointList2D,result["H"], result["K"], result["inverted"]);
			// var result = R3D.calibrateCameraKIteritive(pointList3D,pointList2D);
			// console.log(result);


			//var distortion = result["distortion"];
			//var distortion = result["inverted"]; // want to know how to un-distort a given image
			var K = result["K"];
			var fx = K.get(0,0);
			var s = K.get(0,1);
			var cx = K.get(0,2);
			var fy = K.get(1,1);
			var cy = K.get(1,2);
			var k1 = distortion["k1"];
			var k2 = distortion["k2"];
			var k3 = distortion["k3"];
			var p1 = distortion["p1"];
			var p2 = distortion["p2"];
			camera.setK(fx,fy,s,cx,cy);
			camera.setDistortion(k1,k2,k3,p1,p2);
			camera.setCalculatedCount(calibrationImages.length);

/*
var Kmat = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
console.log("\n fx: "+fx+"\n fy:"+fy+"\n cx:"+cx+"\n cy:"+cy+"\n s:"+s+"\n ");
console.log(Kmat);
// example point:
var TL = new V2D(0,0);
var BR = new V2D(1,0.75);
var center = new V2D(0.5,0.375);

console.log(TL+" =?> " + R3D.applyDistortionParameters(new V2D(), TL, Kmat, distortion));
console.log(center+" =?> " + R3D.applyDistortionParameters(new V2D(), center, Kmat, distortion));
console.log(BR+" =?> " + R3D.applyDistortionParameters(new V2D(), BR, Kmat, distortion));


*/

/*
// MOAR TESTING:

console.log("SYNTHETIC:");
var fx = 1;
var fy = 1;
var s = 0;
var cx = 0.5;
var cy = 0.5;
var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
// var k1 = 0.01;
// var k2 = 0.001;
// var k3 = 0.0001;
// var p1 = 0.000002;
// var p2 = 0.000005;
// var k1 = 0.1;
// var k2 = 0.01;
// var k3 = 0.1;
// var p1 = 0.02;
// var p2 = 0.05;
var pointsFrom = [];
var pointsTo = [];
var distortions = {"k1":k1,"k2":k2,"k3":k3,"p1":p1,"p2":p2};
for(var i=0; i<100; ++i){
	var fr = new V2D(Math.random(),Math.random());
	var to = new V2D();
	// var xr = fr.x - cx;
	// var yr = fr.y - cy;
	// var r2 = xr*xr + yr*yr;
	// var r4 = r2*r2;
	// var r6 = r4*r2;
	// to.x = fr.x + k1*xr*r2 + k2*xr*r4 + k3*xr*r6 + p1*(r2 + 2*xr*xr) + p2*2*xr*yr;
	// to.y = fr.y + k1*yr*r2 + k2*yr*r4 + k3*yr*r6 + p2*(r2 + 2*yr*yr) + p1*2*xr*yr;
	// console.log("A: "+to+"");
	to = R3D.applyDistortionParameters(to,fr,K,distortions);
	// console.log("B: "+to+"");
	pointsFrom.push(fr);
	pointsTo.push(to);
}

// FORWARD
var params = R3D.cameraDistortionNonlinear(pointsFrom,pointsTo, K);
console.log(params);
var params = R3D.cameraDistortionNonlinear(pointsTo,pointsFrom, K);
console.log(params);

var params = R3D.linearCameraDistortion(pointsFrom,pointsTo, K);
console.log(params);
// REVERSE
var params = R3D.linearCameraDistortion(pointsTo,pointsFrom, K);
console.log(params);

*/
/*

 fx: 0.8669192317737683
 fy:1.0604266054792268
 cx:0.5214712876202338
 cy:0.4572196553312787
 s:-0.017497693414736247


inverted:
  k1: -0.35677307623147025
  k2: 0.02346095692717931
  k3: 0.005280666195983663
  p1: -0.009931248153710603
  p2: 0.11373938659312022

*/



//R3D.BundleAdjustCameraParameters();

//throw "CALIBRATE YEAH";

			self.saveProjectFile();
		}
	}
	var fxnB = function(){
		// this.checkPerformNextTask();
	}
	for(i=0; i<calibrationImages.length; ++i){
		var calibrationImage = calibrationImages[i];
		console.log(calibrationImage);
		++expectedCount;
	}
	// do loading
	for(i=0; i<calibrationImages.length; ++i){
		var calibrationImage = calibrationImages[i];
		calibrationImage.loadCalibratationData(fxnA, this);
	}

}


App3DR.ProjectManager.prototype.calculateGlobalOrientationInit = function(callback, context, object){
	console.log("calculateGlobalOrientationInit");
	// helpers
	var minimumStringFirst = function(a,b){
		return a < b ? (a+"-"+b) : (b+"-"+a);
	}
	var viewIDsToPairID = function(iA,iB){
		return minimumStringFirst(iA,iB);
	}
	var setOrFlip = function(table,iA,iB,scale, error){
		var key = viewIDsToPairID(iA,iB);
		var edge = table[key];
		// console.log(table);
		// console.log(key);
		// console.log(edge);
		if(edge["A"]==iA && edge["B"]==iB){
			edge["list"].push([scale,error]);
		}else if(edge["A"]==iB && edge["B"]==iA){
			edge["list"].push([1.0/scale,error]);
		}else{
			throw "?";
		}

	}
	// locals
	var views = this._views;
	var pairs = this._pairs;
	var triples = this._triples;
	var viewCount = views.length;
	var edgesTranslate = [];
	var edgesRotate = [];
	// A-B pair lists (transforms and errors): each is of length i-1
	var tableViewIDToIndex = {};
	for(var i=0; i<viewCount; ++i){
		var view = views[i];
		tableViewIDToIndex[view.id()+""] = i;
	}
	//
	var edges = [];
	var tableViewPairToEdge = {};
	var tablePairIDToIndex = {};
	for(var i=0; i<pairs.length; ++i){
		var pairA = pairs[i];
		var idA = pairA.viewA().id();
		var idB = pairA.viewB().id();
		var nodeA = viewIDsToPairID(idA,idB);
		tablePairIDToIndex[nodeA] = i;
		for(var j=i+1; j<pairs.length; ++j){
			var pairB = pairs[j];
			var idC = pairB.viewA().id();
			var idD = pairB.viewB().id();

			var nodeB = viewIDsToPairID(idC,idD);
			var index = viewIDsToPairID(nodeA,nodeB);
			// console.log(" INDEX ... "+index);
			var edge = {"A":nodeA, "B":nodeB, "list":[]};
			edges.push(edge); // directional
			tableViewPairToEdge[index] = edge;
		}
	}

	// go thru all triples and get all possible edges for each pair
	for(var i=0; i<triples.length; ++i){
		var triple = triples[i];
		var viewA = triple.viewA();
		var viewB = triple.viewB();
		var viewC = triple.viewC();
		var idA = viewA.id();
		var idB = viewB.id();
		var idC = viewC.id();
		var relativeCount = triple.relativeCount();
		// console.log(triple.relativeScales())
		if(relativeCount && relativeCount>0){
			var pairAB = this.pairFromViewIDs(idA,idB);
			var pairAC = this.pairFromViewIDs(idA,idC);
			var pairBC = this.pairFromViewIDs(idB,idC);
			var scales = triple.relativeScales();
			var idAB = viewIDsToPairID(idA,idB);
			var idAC = viewIDsToPairID(idA,idC);
			var idBC = viewIDsToPairID(idB,idC);
			var errorAB = pairAB.errorRMean() + pairAB.errorRSigma();
			var errorAC = pairAC.errorRMean() + pairAC.errorRSigma();
			var errorBC = pairBC.errorRMean() + pairBC.errorRSigma();

			var scaleAB = scales["AB"];
			var scaleAC = scales["AC"];
			var scaleBC = scales["BC"];

			// console.log(" "+i+" : "+scaleAB+" | "+scaleAC+" | "+scaleBC+" | "+" - "+idAB+" - "+idAC+" - "+idBC);
			if(scaleAB>0 && scaleAC>0){
				var scaleABtoAC = scaleAC/scaleAB;
				setOrFlip(tableViewPairToEdge,idAB,idAC,scaleABtoAC,errorAB+errorAC);
			}
			if(scaleAC>0 && scaleBC>0){
				var scaleACtoBC = scaleBC/scaleAC;
				setOrFlip(tableViewPairToEdge,idAC,idBC,scaleACtoBC,errorAC+errorBC);
			}
			if(scaleAB>0 && scaleBC>0){
				var scaleBCtoAB = scaleAB/scaleBC;
				setOrFlip(tableViewPairToEdge,idBC,idAB,scaleBCtoAB,errorBC+errorAB);
			}
		}
	}
	// combine every conflicting edge into single edge using error ratios
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var list = edge["list"];
		var values = [];
		var errors = [];
		if(list.length>0){
			for(var j=0; j<list.length; ++j){
				var e = list[j];
				values.push(e[0]);
				errors.push(e[1]);
			}
			var percents = Code.errorsToPercents(errors);
			var error = percents["error"];
				percents = percents["percents"];
			var value = Code.averageNumbers(values, percents);
			edge["value"] = value;
			edge["error"] = error;
		}
	}
	console.log(edges);
	// throw "?"
	// create graph
	var graphEdges = [];
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var list = edge["list"];
		if(list.length>0){
			var idA = edge["A"];
			var idB = edge["B"];
			var value = edge["value"];
			var error = edge["error"];
			var indexA = tablePairIDToIndex[idA];
			var indexB = tablePairIDToIndex[idB];
			graphEdges.push([indexA,indexB, value, error]);
		}
	}
	// prune unused vertexes
	var reachable = [];

	for(var i=0; i<pairs.length; ++i){
		var reached = false;
		for(var j=0; j<graphEdges.length; ++j){
			if(graphEdges[j][0]==i || graphEdges[j][1]==i){
				reached = true;
				break;
			}
		}
		reachable[i] = reached;
	}
	console.log(reachable);


	// TODO: check subgraph reachability - path for all nodes
	console.log(graphEdges);
	var results = R3D.optimumScaling1D(graphEdges);
	console.log(results);
	var absoluteScales = results["absolute"];
	var unused = results["unconnected"];
	// throw "need to do optimum scaling using all triples"

	// get relative transform+error
	var listPairs = [];
	for(var i=0; i<pairs.length; ++i){
		if(!reachable[i]){
			continue;
		}

		var pair = pairs[i];
		var viewA = pair.viewA();
		var viewB = pair.viewB();
		var idA = viewA.id();
		var idB = viewB.id();
		var pairID = viewIDsToPairID(idA,idB);
		var extrinsicAtoB = pair.R();
		// INVERT FROM EXT TO CAM
		var relativeAtoB = Matrix.inverse(extrinsicAtoB);
// console.log(""+extrinsicAtoB);
// console.log(""+relativeAtoB);
		var transformRMean = pair.errorRMean();
		var transformRSigma = pair.errorRSigma();
		var transformMatches = pair.relativeCount();
		var indexPair = tablePairIDToIndex[pairID];
		var scaler = absoluteScales[indexPair];



// HERE

		// scale 'pair' local scale to match universe scale
		console.log("scaler:"+scaler);
		relativeAtoB.set(0,3, relativeAtoB.get(0,3)*scaler);
		relativeAtoB.set(1,3, relativeAtoB.get(1,3)*scaler);
		relativeAtoB.set(2,3, relativeAtoB.get(2,3)*scaler);

		var center = relativeAtoB.multV3DtoV3D(new V3D(0,0,0));
		console.log("     RELATIVE CENTER : "+center+" -> "+center.length());
		// ERROR
		var errorAB = (transformRMean + 1.0*transformRSigma)/transformMatches;
		// set
		var indexA = tableViewIDToIndex[viewA.id()+""];
		var indexB = tableViewIDToIndex[viewB.id()+""];
		listPairs.push([indexA,indexB,relativeAtoB,errorAB]);
	}
	// nonlinear estimate
	var result = R3D.optimumTransform3DFromRelativePairTransforms(listPairs);
	console.log(result);
	var transforms = result["absolute"];
	console.log(transforms);

	// from camera to extrinsic
	for(var i=0; i<transforms.length; ++i){
	   var transform = transforms[i];
	   var matrix = transform;
	   transforms[i] = Matrix.inverse(matrix);
	}

	// TODO: calculate skeletal graph

	// save just views to view scene
console.log("PRINT OUT SCENE WITH JUST VIEWS FOR VISUALIZING");
var world = new Stereopsis.World();
var cam = this.cameras()[0];
var K = cam.K();
if(K["fx"]){
	var fx = K["fx"];
	var fy = K["fy"];
	var s = K["s"];
	var cx = K["cx"];
	var cy = K["cy"];
	var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
}
var distortion = cam.distortion();
var camera = world.addCamera(K, distortion);
for(var i=0; i<transforms.length; ++i){
var v = views[i];
	var transform = transforms[i];
	var view = world.addView(null, camera);
	view.data(v.id());
	view.size(new V2D(1008,756));
	view.cellSize(9);
	view.absoluteTransform(transform);
}
world.relativeTransformsFromAbsoluteTransforms();
var str = world.toYAMLString();
console.log(str);



	// create graph.yaml
	var timestampNow = Code.getTimeStampFromMilliseconds();
	var yaml = new YAML();
	yaml.writeComment("Graph");
	yaml.writeString("created", timestampNow);
	yaml.writeBlank();
	// views
	yaml.writeArrayStart("views");
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var transform = transforms[i];
		yaml.writeObjectStart();
			yaml.writeString("id",view.id());
			yaml.writeObjectStart("R");
				transform.toYAML(yaml);
			yaml.writeObjectEnd();
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeBlank();
	// full graph
	yaml.writeArrayStart("graph");
	for(var i=0; i<listPairs.length; ++i){
		var pair = listPairs[i];
		var fr = pair[0];
		var to = pair[1];
		yaml.writeObjectStart();
			yaml.writeNumber("A", fr);
			yaml.writeNumber("B", to);
			yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeBlank();
	// skeletal
	yaml.writeString("skeleton", null);
	yaml.writeBlank();
	// tracks
	yaml.writeString("points", null);
	yaml.writeBlank();

var graphString = yaml.toString();
console.log(graphString);

this.setGraphFilename(App3DR.ProjectManager.RECONSTRUCT_GRAPH_FILE_NAME);

	// create tracks.yaml
	var yaml = new YAML();
	yaml.writeComment("Tracks");
	yaml.writeString("created", timestampNow);
	yaml.writeBlank();
	// views
	yaml.writeString("views", null);
	yaml.writeBlank();
	// pairs
	yaml.writeString("pairs", null);
	yaml.writeBlank();
	// tracks
	yaml.writeString("points", null);
	yaml.writeBlank();

var tracksString = yaml.toString();
console.log(tracksString);

this.setTracksFilename(App3DR.ProjectManager.RECONSTRUCT_TRACKS_FILE_NAME);

	var fxnSavedProject = function(){
		console.log("fxnSavedProject");
	}

	var fxnSavedTracks = function(){
		console.log("fxnSavedTracks");
		this.saveProjectFile(fxnSavedProject, this);
	}

	var fxnSavedGraph = function(){
		console.log("fxnSavedGraph");
		this.saveTracks(tracksString, this.tracksFilename(), fxnSavedTracks, this);
	}

// SAVE
this.saveGraph(graphString, this.graphFilename(), fxnSavedGraph, this);




return;

/*

	var timestampNow = Code.getTimeStampFromMilliseconds();
	var yaml = new YAML();
	yaml.writeComment("BA Model Grouping");
	yaml.writeString("created", timestampNow);
	yaml.writeBlank();
	// consolidate cameras
	var thisCameras = this._cameras;
	// console.log(thisCameras)
	var allCameras = {};
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var relativeData = pair.relativeData();
		var cameras = relativeData["cameras"];
		for(var j=0; j<cameras.length; ++j){
			var camera = cameras[j];
			allCameras[camera["id"]] = camera;
		}
	}

	// console.log(allCameras);
	// yaml.writeComment("3DR Features File 0");
	//
	// yaml.writeString("title", "features");
	// yaml.writeString("created", timestampNow);
	// yaml.writeString("from", viewA.id());
	// yaml.writeString("to", viewB.id());

	yaml.writeArrayStart("cameras");
	var keys = Code.keys(allCameras);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var cam = allCameras[i];
		// console.log(cam);
		yaml.writeObjectStart();
			yaml.writeString("id", cam["id"]);
			yaml.writeObjectStart("K");
				K = Matrix.loadFromObject(cam["K"]);
				var K = K.toYAML(yaml);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("distortion");
				var distortion = cam["distortion"];
				yaml.writeNumber("k1", distortion["k1"]);
				yaml.writeNumber("k2", distortion["k2"]);
				yaml.writeNumber("k3", distortion["k3"]);
				yaml.writeNumber("p1", distortion["p1"]);
				yaml.writeNumber("p2", distortion["p2"]);
			yaml.writeObjectEnd();
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();

	// resolutions:
	var maxResolutions = {};
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var relativeData = pair.relativeData();
		// console.log(relativeData);
		var vs = relativeData["views"];
		for(var j=0; j<vs.length; ++j){
			var v = vs[j];
			var vid = v["id"];
			var cam = v["camera"];
			var vsz = v["imageSize"];
			var cellSize = v["cellSize"];
			var size = new V2D(vsz["x"],vsz["y"]);
			var existing = maxResolutions[vid];
			if(existing){
				var areaA = existing["imageSize"].x * existing["imageSize"].y;
				var areaB = size.x * size.y;
				if(areaB>areaA){
					existing["imageSize"] = size;
				}
				existing["cellSize"] = Math.max(existing["cellSize"],cellSize);
			}else{
				existing = {"imageSize":size, "cellSize":cellSize, "id":vid, "cameraID":cam};
			}
			maxResolutions[vid] = existing;
		}
	}

	// view - camera sizes
	var keys = Code.keys(maxResolutions);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var entry = maxResolutions[key];
		var imageSize = entry["imageSize"];
		var camID = entry["cameraID"];
		cam = allCameras[camID];
		var K = Matrix.loadFromObject(cam["K"]);
		K = R3D.cameraFromScaledImageSize(K, imageSize);
		// console.log(K);
		var Kinv = Matrix.inverse(K);
		entry["K"] = K;
		entry["Kinv"] = Kinv;
	}
	console.log(maxResolutions);

	// views
	console.log(tableViewIDToIndex);
	yaml.writeArrayStart("views");
	for(var i=0; i<views.length; ++i){
		console.log(view);
		var view = views[i];
		var viewID = view.id()+"";
		var index = tableViewIDToIndex[viewID];
		var transform = transforms[index];
		// console.log(transform);
		var imageSize = maxResolutions[viewID]["imageSize"];
		var cellSize = maxResolutions[viewID]["cellSize"];
		yaml.writeObjectStart();
			yaml.writeString("id",viewID);
			yaml.writeString("camera","0"); // TODO
			yaml.writeObjectStart("imageSize");
				yaml.writeNumber("x",imageSize.x);
				yaml.writeNumber("y",imageSize.y);
			yaml.writeObjectEnd();
			yaml.writeNumber("cellSize",cellSize);
			yaml.writeObjectStart("transform");
				transform.toYAML(yaml);
			yaml.writeObjectEnd();
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();


	// points
	yaml.writeArrayStart("points");
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var relativeData = pair.relativeData();
		// console.log(relativeData);
		var points = relativeData["points"];
		for(var j=0; j<points.length; ++j){
			point = points[j];
			var pointViews = point["views"];
			var pointViewA = pointViews[0];
			var pointViewB = pointViews[1]
			var vA = pointViewA["view"];
			var pA = new V2D(pointViewA["x"],pointViewA["y"]);
			var vB = pointViewB["view"];
			var pB = new V2D(pointViewB["x"],pointViewB["y"]);

			var XxA = pointViewA["Xx"];
			var XyA = pointViewA["Xy"];
			var YxA = pointViewA["Yx"];
			var YyA = pointViewA["Yy"];

			var XxB = pointViewB["Xx"];
			var XyB = pointViewB["Xy"];
			var YxB = pointViewB["Yx"];
			var YyB = pointViewB["Yy"];

			// console.log(vA);
			var iA = tableViewIDToIndex[vA];
			// console.log(iA);
			var tA = transforms[iA];
			var iB = tableViewIDToIndex[vB];
			var tB = transforms[iB];
			//
			var KAInv = maxResolutions[vA]["Kinv"];
			var KBInv = maxResolutions[vB]["Kinv"];
			var imageSizeA = maxResolutions[vA]["imageSize"];
			var imageSizeB = maxResolutions[vB]["imageSize"];
			var point2DA = pA.copy().scale(imageSizeA.x,imageSizeA.y);
			var point2DB = pB.copy().scale(imageSizeB.x,imageSizeB.y);
			var PA = tA;
			var PB = tB;
			// console.log(point2DA,point2DB, PA,PB, KAInv, KBInv)
			var p3D = R3D.triangulatePointDLT(point2DA,point2DB, PA,PB, KAInv, KBInv);
			// console.log(p3D+"");
			if(p3D){
				yaml.writeObjectStart();
					yaml.writeArrayStart("views");
						yaml.writeObjectStart();
							yaml.writeString("view", vA);
							yaml.writeNumber("x", pA.x);
							yaml.writeNumber("y", pA.y);
							yaml.writeNumber("Xx", XxA);
							yaml.writeNumber("Xy", XyA);
							yaml.writeNumber("Yx", YxA);
							yaml.writeNumber("Yy", YyA);
						yaml.writeObjectEnd();
						yaml.writeObjectStart();
							yaml.writeString("view", vB);
							yaml.writeNumber("x", pB.x);
							yaml.writeNumber("y", pB.y);
							yaml.writeNumber("Xx", XxB);
							yaml.writeNumber("Xy", XyB);
							yaml.writeNumber("Yx", YxB);
							yaml.writeNumber("Yy", YyB);
						yaml.writeObjectEnd();
					yaml.writeArrayEnd();
					yaml.writeNumber("X",p3D.x);
					yaml.writeNumber("Y",p3D.y);
					yaml.writeNumber("Z",p3D.z);
				yaml.writeObjectEnd();
			}
		}
		//
	}
	yaml.writeArrayEnd();

	yaml.writeBlank();
	var str = yaml.toString();
	// console.log(str);


	// proceed to optimizing step
	console.log("CALCULATED OPTIMUM STARTING ORIENTATIONS");
	this.calculateGlobalOrientationNonlinear(str);
*/

	/*
	// SAVE --- before actual calculation ?
	var self = this;
	var fxnZ = function(){
		console.log("saved BA Init");
		// SAVE PROJECT
		self.saveProjectFile();
	}
	// SAVE BA
	this.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
	this.saveBundleAdjust(str, fxnZ, this);
	*/



}

App3DR.ProjectManager.prototype.iterateGraphTracks = function(){ // aggregate / accumulate tracks
	console.log("iterateGraphTracks");

	var project = this;
	// backwards:
	// load tracks file
	var fxnGraphLoaded = function(){
		console.log("fxnGraphLoaded");
		// project.loadTracks(fxnTracksLoaded, project);
		project._iterateGraphTracksStart();
	}
	// load graph file
	project.loadGraph(fxnGraphLoaded, project);
}
App3DR.ProjectManager.prototype._iterateGraphTracksStart = function(){
	console.log("_iterateGraphTracksStart");
	// helpers:
	var project = this;
	var sortLargerArray0 = function(a,b){
		return a[0] > b[0] ? -1 : 1;
	}
	var sortSmaller = function(a,b){
		return a < b ? -1 : 1;
	}
	var minimumStringFirst = function(a,b){
		return a < b ? (a+"-"+b) : (b+"-"+a);
	}
	var tripleHash = function(a,b,c){
		var arr = [a,b,c];
		arr.sort(sortSmaller);
		var hash = arr[0]+"-"+arr[1]+"-"+arr[2];
		return hash;
	}

	var pairs = this.pairs();
	var views = this.views();

	// view lookup
	var viewLookup = {};
	for(var i=0; i<views.length; ++i){
		viewLookup[views[i].id()] = views[i];
	}
	var pairLookup = {};
	// var pairLookupIndex = {};
	for(var i=0; i<pairs.length; ++i){
		var idA = pairs[i].viewA().id();
		var idB = pairs[i].viewB().id();
		var idP = minimumStringFirst(idA,idB);
		pairLookup[idP] = pairs[i];
	}
	console.log(viewLookup);
	console.log(pairLookup);

	var graphData = this.graphData();
	console.log(graphData);
	var graphViews = graphData["views"];
	var graphPoints = Code.valueOrDefault(graphData["points"], []);
	console.log("graphPoints: "+graphPoints.length);

	var viewGraphLookupIndex = {};
	var viewGraphLookup = {};
	for(var i=0; i<graphViews.length; ++i){
		viewGraphLookup[graphViews[i]["id"]] = viewLookup[graphViews[i]["id"]];
		viewGraphLookupIndex[graphViews[i]["id"]] = i;
	}
	console.log("viewGraphLookup")
	console.log(viewGraphLookup)

	var previousPair = Code.valueOrDefault(graphData["previousPair"], null);
	var startIndexI = 0;
	var startIndexJ = 0;
	if(previousPair===null){ // if no tracks => use the first pair
		console.log("no previous pair");
	}else{
		startIndexI = previousPair["A"];
		startIndexJ = previousPair["B"];
		// goto next
		if(startIndexJ==graphViews.length-1){
			startIndexI += 1;
			startIndexJ = startIndexI+1;
		}else{
			startIndexJ += 1;
		}
	}
	startIndexJ = Math.max(startIndexJ,startIndexI+1);
console.log("START AT: "+startIndexI+" | "+startIndexJ);
	var foundPair = null;
	var newPreviousPair = null;
	for(var i=startIndexI; i<graphViews.length; ++i){
		var viewI = graphViews[i];
		var idI = viewI["id"];
		var vI = viewLookup[idI];
		for(var j=startIndexJ; j<graphViews.length; ++j){
			var viewJ = graphViews[j];
			var idJ = viewJ["id"];
			var vJ = viewLookup[idJ];
			console.log("check out views: "+i+"-"+j);
			// console.log(vI,vJ)
			var pair = pairLookup[ minimumStringFirst(idI,idJ) ];
			if(pair.hasRelative()){
				foundPair = pair;
				newPreviousPair = [i,j];
				break;
			}
		}
		if(foundPair){
			break;
		}
		startIndexJ = i+2;
	}
	viewPointCounts = [];
	for(var i=0; i<graphViews.length; ++i){
		viewPointCounts[i] = Code.newArrayZeros(graphViews.length);
	}

	console.log(foundPair);
	if(foundPair){
		var pair = foundPair;

		var viewA = pair.viewA();
		var viewB = pair.viewB();
		//
		var indexA = viewGraphLookupIndex[viewA.id()];
		var indexB = viewGraphLookupIndex[viewB.id()];
		var loadViews = this.auxilaryViewsToLoadForSet([indexA,indexB],graphData, 4); // 4-6
		for(var i=0; i<loadViews.length; ++i){
			loadViews[i] = viewLookup[graphViews[loadViews[i]]["id"]];
		}

		graphData["previousPair"] = {"A":newPreviousPair[0], "B":newPreviousPair[1]};

var trackCount = pair.trackCount();
if(trackCount==0){ // noop
	console.log("no track data ...");
	this.saveGraphFromData(graphData);
}else{
		// load the view images
		var fxnViewsLoaded = function(){
			console.log("loaded images");
			console.log(loadViews);
			// also want to add ALL views
			project._iterateGraphTracksTick(pair,loadViews);
		}
		// load the track data for this pair
		var fxnPairLoaded = function(){
			console.log("loaded pair");
			console.log(pair.trackData());
			App3DR.ProjectManager.loadViewsImages(loadViews,fxnViewsLoaded, project);
		}
		App3DR.ProjectManager.loadPairsTrackData([pair], fxnPairLoaded, project);
}
	}else{ // propagate tracks
// throw "propagate tracks";
		var groups = graphData["propagateGroups"]; // triples for
		console.log(groups);
		if(groups){
			// convert to
			propagateIndex = graphData["propagateIndex"];
			var nextGroup = propagateIndex+1;
			if(nextGroup<groups.length){//if(edges.length>0){
				var triple = groups[nextGroup];
				// // make copy of original groups
				triple = Code.copyArray(triple);
				console.log(triple);
// throw "what"
				// get auxilary views
				var loadViews = this.auxilaryViewsToLoadForSet(triple,graphData, 6);
				var views = this.views();
				// view lookup
				var viewLookup = {};
				for(var i=0; i<views.length; ++i){
					viewLookup[views[i].id()] = views[i];
				}
				// var graphViews = graphData["views"];
				for(var i=0; i<triple.length; ++i){
					triple[i] = viewLookup[graphViews[triple[i]]["id"]];
				}
				for(var i=0; i<loadViews.length; ++i){
					loadViews[i] = viewLookup[graphViews[loadViews[i]]["id"]];
				}
				console.log(loadViews);
				//
				//
				// load images and proceed
				var fxnViewsLoaded = function(){
					console.log("loaded images");
					console.log(loadViews);
					project._iterateGraphTracksPropagateTick(triple,loadViews);
				}
				// load the track data for this pair
				App3DR.ProjectManager.loadViewsImages(loadViews,fxnViewsLoaded, project);
			}else{
// throw "done propagating";
				console.log("done loading/propagating tracks");
				var sparseCameras = [];
				var sparseViews = [];
				var sparsePoints = [];
				var sparseCameraLookup = {};
				var cameraLookupIndex = {};
				var sparseViewLookup = {};
				var sparseViewLookupIndex = {};
				var viewLookup = {};
				var graphViews = graphData["views"];
				var graphPoints = graphData["points"];
				var cameras = this.cameras();
				var views = this.views();
				for(var i=0; i<views.length; ++i){
					var v = views[i];
					viewLookup[v.id()] = v;
				}
				for(var i=0; i<cameras.length; ++i){
					var camera = cameras[i];
					console.log(camera);
					var K = camera.K();
					var d = camera.distortion();
					var c = {
						"id":camera.id(),
						"fx":K["fx"],
						"fy":K["fy"],
						"s":K["s"],
						"cx":K["cx"],
						"cy":K["cy"],
						"k1":d["k1"],
						"k2":d["k2"],
						"k3":d["k3"],
						"p1":d["p1"],
						"p2":d["p2"],
					};
					var cid = c["id"];
					sparseCameras.push(c);
					sparseCameraLookup[cid] = c;
					cameraLookupIndex[cid] = i;
				}
				for(var i=0; i<graphViews.length; ++i){
					var view = graphViews[i];
					var v = viewLookup[view["id"]];
					var cid = v.cameraID();
					var cindex = cameraLookupIndex[cid];
					var v = {
						"id":view["id"],
						"size":view["size"],
						"camera":cindex,
						"R":view["R"],
						"updated":"",
					};
					sparseViews.push(v);
					sparseViewLookup[v["id"]] = v;
				}
				for(var i=0; i<graphPoints.length; ++i){
					var p3D = graphPoints[i];
					// var p3D = point.point();
					var vs = p3D["v"];
					var vList = [];
					for(var j=0; j<vs.length; ++j){
						var v = vs[j];
						v = {
							"i":v["i"],
							"x":v["x"],
							"y":v["y"],
						}
						vList.push(v);
					}
					var p = {
						"X":p3D["X"],
						"Y":p3D["Y"],
						"Z":p3D["Z"],
						"x":p3D["x"],
						"y":p3D["y"],
						"z":p3D["z"],
						"s":p3D["s"],
						"v":vList,
					};
					sparsePoints.push(p);
				}
				// console.log(sparsePoints);
				var sparsePairs = this._pairEdgesFromPoints(sparsePoints);
					sparsePairs = this._consolidatePairEdges([],sparsePairs);
				var sparseData = {
					"cameras":sparseCameras,
					"views":sparseViews,
					"pairs":sparsePairs,
					"points":sparsePoints,
					"iterations": 0,
				}
				console.log(sparseData);

				// SAVE PROJECT FILE
				var fxnSavedProject = function(){
					console.log("fxnSavedProject");
				}
				var fxnSavedSparse = function(){
					console.log("fxnSavedSparse");
					this.saveProjectFile(fxnSavedProject, this);
				}
				// SAVE
				console.log(graphPoints.length)
				this.setTrackCount(graphPoints.length);
				this.setSparseFilename(App3DR.ProjectManager.BUNDLE_SPARSE_FILE_NAME);
				this.saveSparseFromData(sparseData, fxnSavedSparse, this);

			}
		}else{ // create edge counts
			console.log("create triple groups to propagate tracks");
			var edgeCount = {};
			var edgeIDs = {};
			for(var i=0; i<graphViews.length; ++i){
				for(var j=i+1; j<graphViews.length; ++j){
					var index = minimumStringFirst(i,j);
					edgeCount[index] = 0;
					edgeIDs[index] = [i,j];
				}
			}
			// sum edge counts
			for(var i=0; i<graphPoints.length; ++i){
				var point = graphPoints[i];
				var vs = point["v"];
				for(var j=0; j<vs.length; ++j){
					var v = vs[j]["i"];
					for(var k=j+1; k<vs.length; ++k){
						var u = vs[k]["i"];
						var index = minimumStringFirst(v,u);
						edgeCount[index] += 1;
					}
				}
			}
			console.log(edgeCount);
			// get list of all existing edges
			var edgeList = [];
			var idList = Code.keys(edgeCount);
			for(var i=0; i<idList.length; ++i){
				var index = idList[i];
				var count = edgeCount[index];
				var ids = edgeIDs[index];
				edgeList.push([count, ids]);
			}
			console.log(edgeList);
			var edgeCount = edgeList.length;
			edgeList.sort(function(a,b){
				return a[0] > b[0] ? -1 : 1;
			});
			// create it
			var usedList = Code.newArrayZeros(edgeCount);
			var triples = [];
			var tripleLookup = {};
			var currentIndex = 0;
			// add triples w/o repeats
			while(currentIndex<edgeCount){
				console.log("                    "+currentIndex);
				if(usedList[currentIndex]==1){
					++currentIndex;
					continue;
				}
				usedList[currentIndex] = 1;
				var edge = edgeList[currentIndex];
				var a = edge[1][0];
				var b = edge[1][1];
				var index = minimumStringFirst(a,b);
				// go thru list to find next shared pattern
				var found = null;
				for(var i=1; i<edgeCount; ++i){
					var ind = (currentIndex+i)%edgeCount;
					var e = edgeList[ind];
					var c = e[1][0];
					var d = e[1][1];
					if(c==a || c==b || d==a || d==b){
						if(c==a || c==b){
							found = d;
						}else if(d==a || d==b){
							found = c;
						}
						usedList[ind] = 1;
						break;
					}
				}
				if(found!==null){
					index = tripleHash(a,b,found);
					var exists = tripleLookup[index];
					if(!exists){
						var arr = [a,b,found];
						triples.push(arr);
						tripleLookup[index] = arr;
					}
				} // else could not find a triple ... ignore - this should have been weeded out in graph init?
				++currentIndex;
			}
			console.log("triples");
			console.log(triples);
			graphData["propagateGroups"] = triples;
			graphData["propagateIndex"] = -1;
			// throw "create list of propagating triples"
			console.log(graphData);
			// save
			this.saveGraphFromData(graphData);
		}
	}
}
App3DR.ProjectManager.prototype._pairEdgesFromPoints = function(sparsePoints){
	var sortSmaller = function(a,b){
		return a < b ? -1 : 1;
	}
	var minimumStringFirst = function(a,b){
		return a < b ? (a+"-"+b) : (b+"-"+a);
	}
	var edges = {};
	for(var i=0; i<sparsePoints.length; ++i){
		var point = sparsePoints[i];
		var vs = point["v"];
		for(var j=0; j<vs.length; ++j){
			var v = vs[j];
			var vi = v["i"];
			for(var k=j+1; k<vs.length; ++k){
				var u = vs[k];
				var ui = u["i"];
				var index = minimumStringFirst(ui,vi);
				var edge = edges[index];
				if(!edge){ // first time
					var minI = Math.min(ui,vi);
					var maxI = Math.max(ui,vi);
					edge = {"count":0, "A":minI, "B":maxI};
					edges[index] = edge;
				}
				edge["count"] += 1;
			}
		}
	}
	return edges;
}
App3DR.ProjectManager.prototype._consolidatePairEdges = function(existing,edges){ // create if not exist, update if exists, remove if not exist
	// helpers:
	var minimumStringFirst = function(a,b){
		return a < b ? (a+"-"+b) : (b+"-"+a);
	}
	// make lookups:
	var lookupExisting = {};
	for(var i=0; i<existing.length; ++i){
		var exist = existing[i];
		var indexA = exist["A"];
		var indexB = exist["B"];
		var index = minimumStringFirst(indexA,indexB);
		lookupExisting[index] = exist;
	}
	var lookupEdges = edges;
		edges = Code.objectToArray(edges);
	// for(var i=0; i<edges.length; ++i){
	// 	var edge = edges[i];
	// 	var indexA = edge["A"];
	// 	var indexB = edge["B"];
	// 	var index = minimumStringFirst(indexA,indexB);
	// 	lookupEdges[index] = exist;
	// }
	// remove nonexistant
	// for(var i=0; i<existing.length; ++i){
	// 	var exist = existing[i];
	// 	var indexA = exist["A"];
	// 	var indexB = exist["B"];
	// 	var index = minimumStringFirst(indexA,indexB);
	// 	var edge = lookupEdges[index];
	// 	if(!edge){ // remove
	// 		throw "DNE";
	// 	}
	// }
	var total = [];
	// add existing
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var indexA = edge["A"];
		var indexB = edge["B"];
		var index = minimumStringFirst(indexA,indexB);
		var exist = lookupExisting[index];
		if(!exist){ // make new
			exist = {};
			exist["A"] = indexA;
			exist["B"] = indexB;
			exist["errorF"] = null;
			exist["errorR"] = null;
			exist["deltaErrorF"] = null;
			exist["deltaErrorR"] = null;
			exist["updated"] = null;
			lookupExisting[index] = exist;
		} // update
		exist["count"] = edge["count"];
		total.push(exist);
	}
	return total;
}
App3DR.ProjectManager.prototype.auxilaryViewsToLoadForSet = function(loadViews,graphData,maximumViews){ // load UP TO limit total views for SET group
	maximumViews = maximumViews!==undefined ? maximumViews : 5;
	var sortLargerArray0 = function(a,b){
		return a[0] > b[0] ? -1 : 1;
	}
	var graphPoints = Code.valueOrDefault(graphData["points"], []);
	var graphViews = graphData["views"];
	viewPointCounts = [];
	for(var i=0; i<graphViews.length; ++i){
		viewPointCounts[i] = Code.newArrayZeros(graphViews.length);
	}
	// find which other views should be loaded
	for(var i=0; i<graphPoints.length; ++i){
		var point3D = graphPoints[i];
		var vs = point3D["v"];
		for(var j=0; j<vs.length; ++j){
			var v = vs[j]["i"];
			for(var k=j+1; k<vs.length; ++k){
				var u = vs[k]["i"];
				viewPointCounts[v][u]++;
				viewPointCounts[u][v]++;
			}
		}
	}
	// get highest counted pair for relevant views
	var selectArrays = [];
	for(var j=0; j<loadViews.length; ++j){
		var index = loadViews[j];
		var points = viewPointCounts[index];
		selectArrays[j] = points;
		for(var i=0; i<graphViews.length; ++i){
			points[i] = [points[i], i];
		}
		points.sort(sortLargerArray0);
	}
	loadViews = Code.copyArray(loadViews);
	var i = 0;
	// console.log("selectArrays");
	// console.log(selectArrays);
	while(loadViews.length<maximumViews && selectArrays.length>0){
		if(i>=selectArrays.length){
			i = 0;
		}
		var currentSelect = selectArrays[i];
		if(currentSelect.length==0){
			Code.removeElementAt(selectArrays,i);
			continue;
		}
		var item = currentSelect.shift();
		var count = item[0];
		var view = item[1];
		if(count==0){ // no more valid edges
			Code.removeElementAt(selectArrays,i);
			continue;
		} // else found valid edge
		Code.addUnique(loadViews, view); // view
		++i; // to next
	}
	console.log(loadViews);
	return loadViews;
}

App3DR.ProjectManager.prototype._iterateGraphTracksPropagateTick = function(triple,viewsLoad){
	console.log("_iterateGraphTracksPropagateTick");
	// throw "_iterateGraphTracksPropagateTick"
	var stage = GLOBALSTAGE;
	var cameras = this.cameras();
	var views = this.views();
	var graphData = this.graphData();
	// console.log(graphData);
	var graphViews = graphData["views"];
	var stage = GLOBALSTAGE;
	//
	var graphViewLookup = {};
	var graphViewLookupIndex = {};
	var graphViewLookupID = {};
	for(var i=0; i<graphViews.length; ++i){
		var vid = graphViews[i]["id"];
		graphViewLookup[vid] = graphViews[i];
		graphViewLookupIndex[vid] = i;
		graphViewLookupID[i] = vid;
	}
	var viewLookup = {};
	for(var i=0; i<views.length; ++i){
		viewLookup[views[i].id()] = views[i];
	}
	console.log("world");
	// create world
	var world = new Stereopsis.World();
	var info = this._addGraphViews(world, graphViewLookup, stage);
	var images = info["images"];
	var transforms = info["transforms"];
	App3DR.ProjectManager.addCamerasToWorld(world, cameras);
	var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);
	var worldViewLookup = {};
	for(var i=0; i<worldViews.length; ++i){
		worldViewLookup[worldViews[i].data()] = worldViews[i];
	}
	// to world triple
	var worldTriple = [];
	for(var i=0; i<triple.length; ++i){
		var view = world.viewFromData(triple[i].id());
		worldTriple.push(view);
	}

	// load existingPoints
	console.log("embed");
	this._embedTrackPoints(world, graphData, graphViewLookupID);//, graphViewLookup);
	var points = world.toPointArray();
	console.log(points);

	// world fxns to:
	world.printPoint3DTrackCount();
		// propagate tracks
		console.log("errors initial");
		world.relativeTransformsFromAbsoluteTransforms();
		// world.relativeFFromSamples();
		world.estimate3DErrors(true);
		console.log("probe3D");


var maxIterations = 5;
var lowestCount = Math.round(0.005*world.point3DCount()); // .1%-1%
console.log(lowestCount);
for(var t=0; t<maxIterations; ++t){
		var count = world.probe3D();
		var averageAdd = count/3;
		// end early if no longer propagating
		if(averageAdd<lowestCount){
			maxIterations = Math.min(maxIterations,t+1);
		}
		world.printPoint3DTrackCount();
		world.averagePoints3DFromMatches(true);
		console.log("errors update");
		world.estimate3DErrors(true);
		world.filterGlobalMatches(null,null, 3.0);
		world.estimate3DPoints();
		world.refineSelectCameraAbsoluteOrientation(worldTriple);
		var listP3D = world.toPointArrayFromViews(worldTriple);
		if(false){
		// if(t==maxIterations-1){
			for(var p=0; p<listP3D.length; ++p){
				if(p%100==0){
					console.log("    "+p+"/"+listP3D.length);
				}
				var p3D = listP3D[p];
				world.updateP3DPatch(p3D, false); // keep at linear location
				// world.updateP3DPatch(p3D, true);
			}
		}
		world.dropNegative3D();
}
	world.printPoint3DTrackCount();
	world.estimate3DErrors(true);


// throw "wut";

	// save points
	var graphPoints = this._getGraphPointsFromWorld(world, graphViewLookupIndex);
	var graphViews = this._updateGraphViewsFromWorld(world, graphData["views"]);
	graphData["views"] = graphViews;
	graphData["points"] = graphPoints;
	graphData["propagateIndex"] += 1;
	console.log(graphData);
	// save
	this.saveGraphFromData(graphData);
}

App3DR.ProjectManager.prototype.iteratePointsFullBA = function(){
	console.log("iteratePointsFullBA");
	var project = this;
	var fxnPointsLoaded = function(){
		console.log("fxnPointsLoaded");
		project._iteratePointsFullBAStart();
	}
	// load points
	project.loadPoints(fxnPointsLoaded, project);
}
App3DR.ProjectManager.prototype._iteratePointsFullBAStart = function(object, data){ // check loaded
	var project = this;
	console.log("_iteratePointsFullBAStart");
	// create world

	var data = this.pointsData();
	console.log(data);
	var denseViews = data["views"];

	// PREP
	var stage = GLOBALSTAGE;
var denseViewLookup = {};
var denseViewLookupIndex = {};
for(var i=0; i<denseViews.length; ++i){
var v = denseViews[i];
var vid = v["id"];
denseViewLookup[vid] = v;
denseViewLookupIndex[vid] = i;

}
	// WORLD
	var world = new Stereopsis.World();
	var cameras = project.cameras();
	var views = project.views();
	var info = project._addGraphViews(world, denseViewLookup, stage);
	var images = info["images"];
	var transforms = info["transforms"];
	var worldCams = App3DR.ProjectManager.addCamerasToWorld(world, cameras);
	var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);
console.log(worldViews);

	var lookupViewFromID = {};
	var lookupIndexFromID = {};
	var lookupViewFromIndex = {};
	for(var i=0; i<worldViews.length; ++i){
		var v = worldViews[i];
		var vid = v.data();
		lookupViewFromID[vid] = v;
		lookupIndexFromID[vid] = i;
		lookupViewFromIndex[i] = v;
	}


	var dataPoints = data["points"];
	console.log(dataPoints);
	project._embedTrackPoints(world, dataPoints, lookupViewFromIndex); // TODO: THIS DOES NOT NEED INTERSECTION CHECKING

	console.log("setup");
	world.relativeTransformsFromAbsoluteTransforms(); // transforms avail
	world.printPoint3DTrackCount();
	world.relativeFFromSamples();
	world.estimate3DErrors(true, true);


	maxIterations = 5;
	// maxIterations = 7;
	var views = world.toViewArray();
	for(var iterations=0; iterations<maxIterations; ++iterations){ // LINEAR until P3D is stable enough to do nonlinear
		// world.estimate3DErrors(true);
		console.log("refine views");
		world.refineCameraAbsoluteOrientation(null,100); // 100-200
/*
		// simgle camera
		for(var i=0; i<views.length; ++i){
			view = views[i];
			world.refineSelectCameraAbsoluteOrientation([view], null, 50); // 10-100
		}
*/

		// world.relativeTransformsFromAbsoluteTransforms(); // SHOULD ALREADY BE DONE
		world.estimate3DErrors(true);
		// world.averagePoints3DFromMatches();
		world.estimate3DPoints();

		// clean
		console.log("clean");
		world.filterGlobalMatches(null,null, 3.0);

		world.printPoint3DTrackCount();
		world.relativeFFromSamples();
		world.estimate3DErrors(true, true);
	}





	// NONLINEAR POINTS3D
	console.log("NONLINEAR POINTS");
	maxIterations = 5;
	for(var iterations=0; iterations<maxIterations; ++iterations){
		// reesimate points
		world.refinePoint3DAbsoluteLocation(null,10);
		world.copyPoint3DToMatchEstimates();
		world.estimate3DErrors(true, true);

		// filter pairwise
		world.filterGlobalMatches(null,null, 3.0,3.0,null,null, false); // 2 = many | 3 = no dropping
		// filter bad points
		world.filterGlobalPoints(4.0); // 3 medium
		world.filterPatch3D(4.0); // 3 medium

		// local
		world.filterLocal3D(4.0); // 3 medium
		//world.filterLocal2D(); 2D neighbor voting: F / R / ...

		// reestimate cameras
			/*
			// single camera
			for(var i=0; i<views.length; ++i){
				view = views[i];
				world.refineSelectCameraAbsoluteOrientation([view], null, 50); // 10-100
			}
			*/
		world.refineCameraAbsoluteOrientation(null,100);

		//
		world.printPoint3DTrackCount();
	}

// throw "...";


	// BA loop
	// view nonlinear
	// point nonlinear

	// patch drop inconsistencies
	// point drop MATCH-BASED R ERROR
	// point drop WORLD-BASED R ERROR


	// var worldPoints = world.toPointArray();
	// console.log(worldPoints);


// return;

	var str = world.toYAMLString();
	// console.log(str);
	var binary = Code.stringToBinary(str);
	var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.BUNDLE_ADJUST_DIRECTORY, "auto.yaml");
	var callback = function(){
		console.log("saved");
	};
	var context = project;
	var object = {};
	console.log("save auto");
	this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
}

App3DR.ProjectManager.prototype.iterateDenseTracks = function(){
	console.log("iterateDenseTracks");
	var project = this;
	// do operations
	var fxnTracksLoaded = function(){
		console.log("fxnTracksLoaded");
		project._iterateDenseTracksStart();
	}
	// load sparse file
	project.loadDense(fxnTracksLoaded, project);
}
App3DR.ProjectManager.prototype._iterateDenseTracksEnd = function(object, data){ // all pair's dense points are loaded
console.log("_iterateDenseTracksEnd");
	var project = this;
	var str = Code.binaryToString(data);
	var yaml = YAML.parse(str);
	if(Code.isArray(yaml)){
		yaml = yaml[0];
	}
	object["datas"].push(yaml);
	object["loadedCount"] += 1;
	if(object["loadedCount"] == object["expectedCount"]){
		console.log("continue");
		var denseData = this.denseData();
		var denseCameras = denseData["cameras"];
		var denseViews = denseData["views"];
		var densePairs = denseData["pairs"];
		var densePoints = denseData["points"];
		var currentPair = denseData["currentPair"];
		var datas = object["datas"];
		// PREP
		var stage = GLOBALSTAGE;
var denseViewLookup = {};
var denseViewLookupIndex = {};
for(var i=0; i<denseViews.length; ++i){
	var v = denseViews[i];
	var vid = v["id"];
	denseViewLookup[vid] = v;
	denseViewLookupIndex[vid] = i;

}
		// WORLD
		var world = new Stereopsis.World();
		var cameras = project.cameras();
		var views = project.views();
		var info = project._addGraphViews(world, denseViewLookup, stage);
		var images = info["images"];
		var transforms = info["transforms"];
		var worldCams = App3DR.ProjectManager.addCamerasToWorld(world, cameras);
		var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);

var lookupViewFromID = {};
var lookupIndexFromID = {};
var lookupViewFromIndex = {};
for(var i=0; i<worldViews.length; ++i){
	var v = worldViews[i];
	var vid = v.data();
	lookupViewFromID[vid] = v;
	lookupIndexFromID[vid] = i;
	lookupViewFromIndex[i] = v;
}

		world.relativeTransformsFromAbsoluteTransforms(); // transforms avail
console.log("COMBINING ALL TRACK POINTS");
world.printPoint3DTrackCount();
		for(var i=0; i<datas.length; ++i){
			var data = datas[i];
			var dataPoints = data["points"];
			console.log(dataPoints.length);
			project._embedTrackPoints(world, dataPoints, lookupViewFromIndex);
world.printPoint3DTrackCount();
		}
		console.log(densePoints.length);
		project._embedTrackPoints(world, densePoints, lookupViewFromIndex);
world.printPoint3DTrackCount();


var worldPoints = world.toPointArray();
console.log("total points: "+worldPoints.length);

		var pointPoints = project._getGraphPointsFromWorld(world, lookupIndexFromID, false);
		console.log(pointPoints);
		var pointData = {};
			pointData["cameras"] = denseCameras;
			pointData["views"] = denseViews;
			pointData["points"] = pointPoints;

		var fxnSavedProject = function(){
			console.log("PROJECT SAVED")
		}
		var fxnSavedPoints = function(){
			console.log("POINT FILE SAVED")
			project.saveProjectFile(fxnSavedProject, project);
		}

		project.setDenseCount(worldPoints.length);
		project.setPointsFilename(App3DR.ProjectManager.RECONSTRUCT_POINTS_FILE_NAME);
		// SAVE
		project.savePointsFromData(pointData, fxnSavedPoints, project);
	}
}
App3DR.ProjectManager.prototype._iterateDenseTracksStart = function(){
	var project = this;
	console.log("Dense");
	console.log(this.denseData());
	var denseData = this.denseData();
	var denseCameras = denseData["cameras"];
	var denseViews = denseData["views"];
	var densePairs = denseData["pairs"];
	var densePoints = denseData["points"];
	var currentPair = denseData["currentPair"];
	currentPair++;
	if(currentPair>=densePairs.length){
// throw "dense about done";
		var loadPairFiles = [];
		for(var i=0; i<densePairs.length; ++i){
			var pair = densePairs[i];
			console.log(pair);
			var pairID = pair["id"];
			var path = Code.appendToPath(project._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, App3DR.ProjectManager.RECONSTRUCT_DENSE_DIRECTORY, pairID, App3DR.ProjectManager.RECONSTRUCT_DENSE_FILENAME);
			loadPairFiles.push(path);
		}
		console.log(loadPairFiles);
		var object = {};
		object["expectedCount"] = loadPairFiles.length;
		object["loadedCount"] = 0;
		object["datas"] = [];
		var callback = project._iterateDenseTracksEnd;
		var context = project;
		for(var i=0; i<loadPairFiles.length; ++i){
			var path = loadPairFiles[i];
			this.addOperation("GET", {"path":path}, callback, context, object);
		}
		return;
	}
	var densePair = densePairs[currentPair];

	var denseViewLookup = {};
	var denseViewLookupIndex = {};
	for(var i=0; i<denseViews.length; ++i){
		var v = denseViews[i];
		var vid = v["id"];
		denseViewLookup[vid] = v;
		denseViewLookupIndex[vid] = i;

	}

	console.log(densePair);
	var densePairID = densePair["id"];
	var pair = this.pairFromID(densePairID);
	var viewA = pair.viewA();
	var viewB = pair.viewB();
	var viewAID = viewA.id();
	var viewBID = viewB.id();
	var viewAIndex = denseViewLookupIndex[viewA.id()];
	var viewBIndex = denseViewLookupIndex[viewB.id()];

	var loadViews = project.auxilaryViewsToLoadForSet([viewAIndex,viewBIndex],denseData, 6);
	console.log(loadViews);
	for(var i=0; i<loadViews.length; ++i){
		loadViews[i] = project.viewFromID(denseViews[loadViews[i]]["id"]);
	}

	// console.log(viewA,viewB);
	var fxnViewsLoaded = function(){
		console.log("fxnViewsLoaded");
		App3DR.ProjectManager.loadPairsRelativeData([pair], fxnPairLoaded, project, null);
	}
	var fxnPairLoaded = function(){
		console.log("fxnPairLoaded");
		var relativeData = pair.relativeData();
		// utils
		var stage = GLOBALSTAGE;
		// create world
		var world = new Stereopsis.World();
		var cameras = project.cameras();
		var views = project.views();
		// ?
		var info = project._addGraphViews(world, denseViewLookup, stage);
		var images = info["images"];
		var transforms = info["transforms"];
		// ?
		App3DR.ProjectManager.addCamerasToWorld(world, cameras);
		var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);
		var denseViewLookupViewFromID = {};
		var denseViewLookupViewFromIndex = {};
		var denseViewLookupIndexFromID = {};
		console.log(worldViews);
		for(var i=0; i<worldViews.length; ++i){
			var v = worldViews[i];
			denseViewLookupViewFromID[v.data()] = v;
			denseViewLookupViewFromIndex[i] = v;
			denseViewLookupIndexFromID[v.data()] = i;
		}
		var worldViewA = world.viewFromData(viewAID);
		var worldViewB = world.viewFromData(viewBID);
		// init
		world.relativeTransformsFromAbsoluteTransforms();
		world.printPoint3DTrackCount();

		// sort dense points on corner score
		//this._embedTrackPoints(world, relativeData, denseViewLookupViewFromID);
		this._embedMatchPoints(world, relativeData, denseViewLookupViewFromID);

		world.relativeFFromSamples();
		world.estimate3DErrors(true);
		// world.averagePoints3DFromMatches(true);

		// optimize location nonlinearly
		world.refinePoint3DAbsoluteLocation();
		// drop the worst error points globally
		world.filterGlobalPoints(3.0);
		// world.filterGlobalPoints(1.0);

		world.estimate3DErrors(true);

		// limit dense points spatially to most prevalent local corners
		// add dense points limited by ~3px distance to nearest existing pixel
		// var distancePixelsTrim = 3;
		// world.trimSpatialCorners(worldViewA, distancePixelsTrim);
		// world.trimSpatialCorners(worldViewB, distancePixelsTrim);

		// remove dense points
		var densePoints3D = world.toPointArray();
		world.disconnectPoints3D(densePoints3D);

		// trim dense points into ones with viewA & viewB in common
		var commonPoints = [];
		for(var i=0; i<densePoints.length; ++i){
			var point = densePoints[i];
			var views = point["v"];
			var keep = false;
			for(var j=0; j<views.length; ++j){
				var view = views[j];
				var index = view["i"];
				if(index==viewAIndex || index==viewBIndex){
					keep = true;
					break;
				}
			}
			if(keep){
				commonPoints.push(point);
			}
		}
		console.log(densePoints);
		console.log(commonPoints);
		// add sparse points that have view A || view B in common
		this._embedTrackPoints(world, commonPoints, denseViewLookupViewFromIndex);

		// init patches for each dense points based on neighbors -- faster than initting patches 1 by 1
		for(var i=0; i<densePoints3D.length; ++i){
			if(i>0 && i%1000==0){
				console.log(i+" / "+densePoints3D.length);
			}
			var densePoint3D = densePoints3D[i];
			var locP3D = densePoint3D.point();
			var densePoints2D = densePoint3D.toPointArray();
			var neighborPoints3D = [];
			for(var j=0; j<densePoints2D.length; ++j){
				var densePoint2D = densePoints2D[j];
				var view = densePoint2D.view();
				var p2D = densePoint2D.point2D();
				var knn = view.kNN(p2D, 3);
				for(var k=0; k<knn.length; ++k){
					var neighbor = knn[k];
					var p3D = neighbor.point3D();
					Code.addUnique(neighborPoints3D,p3D);
				}
			}
			if(neighborPoints3D.length<3){
				console.log(densePoint3D);
				console.log(locP3D);
				console.log(densePoints2D);
				console.log(neighborPoints3D);
				throw "?";
			}
			// console.log(neighborPoints3D);
			var distances = [];
			var normals = [];
			var sizes = [];
			for(var j=0; j<neighborPoints3D.length; ++j){
				var p3D = neighborPoints3D[j];
				var nrm = p3D.normal();
				normals.push(nrm);
				var siz = p3D.size();
				sizes.push(siz);
				var distance = V3D.distance(locP3D,p3D.point());
				distances.push(distance);
			}
			//var percents = Code.countsToPercents(scores);
			var percents = Code.numbersToWindownNormalPercents(distances);
			var nrm = Code.averageAngleVector3D(normals,percents);
			var siz = Code.averageNumbers(sizes,percents);
			// console.log(percents,normals,sizes,nrm,siz)
			densePoint3D.size(siz);
			densePoint3D.normal(nrm);
			densePoint3D.up(V3D.orthogonal(nrm));
			// console.log(distances);
			// console.log(percents);
			// console.log(densePoint3D);
			// throw "...";
		}
		console.log(densePoints3D);

		// remove sparse points
		var sparsePoints3D = world.toPointArray();
		world.disconnectPoints3D(sparsePoints3D);

		// add back dense points:
		world.embedPoints3DNoValidation(densePoints3D);
		// TODO: POSSIBLY ONLY ADD POINTS @ 1-3 pixel radius distance prioritized on corner

		// VERY LONG:
		// console.log("patch updates");
		// world.patchUpdateOnly();
		// TODO: AVERAGING ... ?

		// main loop:
		var maxIterations = 1;
		for(var iteration=0; iteration<maxIterations; ++iteration){
			// add new points
			// console.log("probe3D");
			// world.probe3D();
			// world.refinePoint3DAbsoluteLocation(); // TODO: only update newly added points
			// TODO: LIMIT TO TOP CORNER POINTS ONLY -- with ~3x3 added locations

			// filter patch inconsistencies
			console.log("filterPatch3D");
			world.filterPatch3D();

			// pairs
			// console.log("filter PAIRS");
			// world.estimate3DErrors(true);
			// world.filterGlobalMatches(null,null, 2.0);

			console.log("filter 3D");
			world.filterGlobalPoints(3.0); // 2 - 3

			// just for printing
			world.estimate3DErrors(true);
		}

// throw "dense iteration end";

		// var denseViewLookupViewIndexFromID = {};
		// for(var i=0; i<worldViews.length; ++i){
		// 	var view = worldViews[i];
		// 	denseViewLookupViewIndexFromID[view.id()] = i;
		// 	// denseViewLookupViewIndexFromID[i] = i;
		// }
		// console.log(denseViewLookupViewIndexFromID);

		// var str = world.toYAMLString();
		// console.log(str);

		// save dense file : dense/pair/dense.yaml
		var justPoints = project._getGraphPointsFromWorld(world, denseViewLookupIndexFromID, false);
		console.log(justPoints);
		var justData = [];
		justData["pair"] = densePairID;
		justData["points"] = justPoints;
		console.log(justData);

		var path = Code.appendToPath(this._workingPath, App3DR.ProjectManager.RECONSTRUCT_DIRECTORY, App3DR.ProjectManager.RECONSTRUCT_DENSE_DIRECTORY, densePairID, App3DR.ProjectManager.RECONSTRUCT_DENSE_FILENAME);
		console.log("dense pair: "+densePairID+" = "+path);


		var callback = function(){
			console.log("saved dense data");
		}
		var context = this;
		var object = {};
		var yaml = new YAML();
		yaml.writeComment("Dense");
		yaml.writeObjectLiteral(justData);
		var str = yaml.toString();
		var binary = Code.stringToBinary(str);
		this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);

		// save working file
		denseData["currentPair"] += 1;
		this.saveDenseFromData(denseData);
	}
	App3DR.ProjectManager.loadViewsImages(loadViews,fxnViewsLoaded, project);
}

App3DR.ProjectManager.prototype.iterateSparseTracks = function(){
	console.log("iterateSparseTracks");
	var project = this;
	// backwards:
	// do operations
	var fxnTracksLoaded = function(){
		console.log("fxnTracksLoaded");
		project._iterateSparseTracksStart();
	}
	// load sparse file
	project.loadSparse(fxnTracksLoaded, project);
}
App3DR.ProjectManager.prototype._iterateSparseTracksStart = function(){ // keep going until delta errors are all below some amount
	var project = this;
	var minimumDeltaError = 0.01; // change in pixels
	// var minimumDeltaError = 0.001;
	var sparseData = this.sparseData();
	var sparseEdgeSort = function(a,b){
		var aErrorDelta = a["deltaErrorR"];
		var bErrorDelta = b["deltaErrorR"];
		var aHasDelta = aErrorDelta != null;
		var bHasDelta = bErrorDelta != null;
		if(!aHasDelta && !bHasDelta){
			var aCount = a["count"];
			var bCount = b["count"];
			return aCount > bCount ? -1 : 1;
		}else if (aHasDelta && !bHasDelta){
			return 1; // B
		}else if (!aHasDelta && bHasDelta){
			return -1; // A
		}
		return aErrorDelta > bErrorDelta ? -1 : 1;
	}
	var sparsePoints = sparseData["points"];
	var sparseViews = sparseData["views"];
	var sparsePairs = sparseData["pairs"];
	var sparseIterations = sparseData["iterations"];
	var orderedPairs = Code.copyArray(sparsePairs);
	orderedPairs.sort(sparseEdgeSort);
	// console.log(sparsePairs);
	console.log(orderedPairs);
	// pick edge to load
	var topPair = orderedPairs[0];
	var isDone = false;
	var topError = topPair["deltaErrorR"];
	if(topError!==null){
		isDone = topError < minimumDeltaError;
	}
	var maxSparseIterations = sparseViews.length*10; // ? pairs count ?
	if(sparseIterations>maxSparseIterations){
		isDone = true;
	}
	if(isDone){ // no more
		var pointCount = sparsePoints.length;
// save sparese data over to dense data & start loading dense points
	console.log("FINAL POINTS: "+pointCount);
		// get a list of all pairs dense needs to load
		var pairs = project.pairs();
		console.log(pairs);
		var loadPairList = [];
		for(var i=0; i<pairs.length; ++i){
			var pair = pairs[i];
			var p = {};
			p["id"] = pair.id();
			loadPairList.push(p);
		}
// throw "about to save done";
		// save
		var denseData = {};
		denseData["cameras"] = sparseData["cameras"];
		denseData["views"] = sparseViews;
		denseData["points"] = sparsePoints;
		denseData["pairs"] = loadPairList;
		denseData["currentPair"] = -1;
		console.log(denseData);
		// SAVE PROJECT FILE
		var fxnSavedProject = function(){
			console.log("fxnSavedProject");
		}
		var fxnSavedDense = function(){
			console.log("fxnSavedDense");
			project.saveProjectFile(fxnSavedProject, project);
		}
		// SAVE
		project.setSparseCount(pointCount);
		project.setDenseFilename(App3DR.ProjectManager.BUNDLE_DENSE_FILE_NAME);
		project.saveDenseFromData(denseData, fxnSavedDense, this);
		return;
	} // else
	var viewAIndex = topPair["A"];
	var viewBIndex = topPair["B"];
	var sparseViewA = sparseViews[viewAIndex];
	var sparseViewB = sparseViews[viewBIndex];
	// pick additional views to load
	var loadViews = this.auxilaryViewsToLoadForSet([viewAIndex,viewBIndex],sparseData, 6);
	for(var i=0; i<loadViews.length; ++i){
		loadViews[i] = this.viewFromID(sparseViews[loadViews[i]]["id"]);
	}

	// console.log(viewA,viewB);
	var fxnViewsLoaded = function(){
		console.log("fxnViewsLoaded");
		console.log(sparseData);
		console.log(sparseViews);
		var sparseViewLookup = {};
		for(var i=0; i<sparseViews.length; ++i){
			var vid = sparseViews[i]["id"];
			sparseViewLookup[vid] = sparseViews[i];
		}
		var stage = GLOBALSTAGE;
		// create world
		var world = new Stereopsis.World();
		var cameras = project.cameras();
		var views = project.views();

		var info = project._addGraphViews(world, sparseViewLookup, stage);
		var images = info["images"];
		var transforms = info["transforms"];

		App3DR.ProjectManager.addCamerasToWorld(world, cameras);
		var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);
		console.log(worldViews);

		var sparseViewLookupIndex = [];
		var sparseViewLookupIndexIndex = [];
		var sparseViewLookupIndexToID = {};
		for(var i=0; i<worldViews.length; ++i){
			var view = worldViews[i];
			var index = i;
			// console.log(view);
			sparseViewLookupIndex[index] = view;
			sparseViewLookupIndexToID[index] = view.data();
			sparseViewLookupIndexIndex[index] = index;
			view.data(i);
		}
		// var points3D = this._embedMatchPoints(world, sparseData, sparseViewLookupIndex);
		this._embedTrackPoints(world, sparseData, sparseViewLookupIndex);
		var points3D = world.toPointArray();
		// var viewA = world.viewFromData(sparseViewA["id"]);
		// var viewB = world.viewFromData(sparseViewB["id"]);
		var viewA = world.viewFromData(viewAIndex);
		var viewB = world.viewFromData(viewBIndex);
		var pairWorldViews = [viewA,viewB];

		// do refinement
		console.log("refine");
		world.relativeTransformsFromAbsoluteTransforms();
		world.printPoint3DTrackCount();
		world.relativeFFromSamples();
		world.estimate3DErrors(true);

		// RECORD INITIAL ERROR BETWEEN 2 VIEWS
		var transform = world.transformFromViews(viewA,viewB);
		var errorRStart = transform.rMean() + transform.rSigma();
		var errorFStart = transform.fMean() + transform.fSigma();

		world.averagePoints3DFromMatches(true);
		console.log("errors update");
		for(var iter=0; iter<1; ++iter){
		console.log("ITERATION: "+iter+" ............ ");
				world.relativeFFromSamples();
				// world.estimate3DErrors(true);
				world.estimate3DPoints();
		console.log("refineSelectCameraAbsoluteOrientation");
		// for(var i=0; i<1; ++i){
				world.refineSelectCameraAbsoluteOrientation(pairWorldViews, null, 1000);
				// world.refineCameraAbsoluteOrientation();
		// }
		console.log("probe3D");
			world.probe3D();
			world.estimate3DErrors(true);
			// world.filterGlobalMatches(null,null, 2.0);
			world.filterGlobalMatches(null,null, 3.0);
			world.estimate3DErrors(true);
		}
		// TODO: PATCHES LIKELY NEED UPDATING: LOWER ERROR + DRIFT
		world.printPoint3DTrackCount();

// throw "about to save";
		// update points
		var sparsePoints = project._getGraphPointsFromWorld(world, sparseViewLookupIndexIndex, false);
		sparseData["points"] = sparsePoints;

		// replace is with data:
		for(var i=0; i<worldViews.length; ++i){
			var view = worldViews[i];
			var data = sparseViewLookupIndexToID[i];
			view.data(data);
		}
// check it out
// var str = world.toYAMLString();
// console.log(str);


		// update views
		sparseViews = project._updateGraphViewsFromWorld(world, sparseViews);
		sparseData["views"] = sparseViews;
		sparseData["iterations"] += 1;

		// update selected pair
		var transform = world.transformFromViews(viewA,viewB);
		var errorREnd = transform.rMean() + transform.rSigma();
		var errorFEnd = transform.fMean() + transform.fSigma();

		var deltaR = errorRStart - errorREnd;
		var deltaF = errorFStart - errorFEnd;
		console.log(deltaR,deltaF);
		console.log(topPair);
		topPair["errorR"] = errorREnd;
		topPair["errorF"] = errorFEnd;
		topPair["deltaErrorR"] = deltaR;
		topPair["deltaErrorF"] = deltaF;
		// topPair["updated"] = Code.getTimeStampFromMilliseconds();
		topPair["updated"] = Code.getTimeMilliseconds();
// if R error goes up ... ????
if(deltaR<0){
	console.log("ERROR WENT UP");
	// throw "?";
}
		// save
		console.log(sparseData);
// throw "NO SAVE"
		this.saveSparseFromData(sparseData);
	}

	App3DR.ProjectManager.loadViewsImages(loadViews,fxnViewsLoaded, project);
}

App3DR.ProjectManager.prototype._addGraphViews = function(world, graphViewLookup, stage){
	var views = this.views();
	var images = [];
	var transforms = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];

		var gv = graphViewLookup[view.id()];
		var image = view.bundleAdjustImage();
		var matrix = null;
		if(image){ // try image
			matrix = R3D.imageMatrixFromImage(image, stage);
		}else{ // try size
		 	matrix = gv["size"];
			if(matrix){
				matrix = new V2D(matrix["x"],matrix["y"]);
			}
		}
		var transform = gv["R"];
		if(!transform){
			transform = gv["transform"];
		}
			transform = Matrix.fromObject(transform);
			transforms.push(transform);
		images.push(matrix);
	}
	return {"transforms":transforms, "images":images};
}

App3DR.ProjectManager.prototype._embedMatchPoints = function(world, trackData, worldViewLookup){
	// from model objects to JS instances
	var o = new V2D(0,0);
	var x1 = new V2D();
	var x2 = new V2D();
	var y1 = new V2D();
	var y2 = new V2D();
	//
	var pointCountAdded = 0;
	console.log(trackData);
	var points3D = Code.valueOrDefault(trackData["points"], []);
	console.log("points3D: "+points3D.length);
	for(var i=0; i<points3D.length; ++i){
		var worldP3D = null;
		var p3D = points3D[i];
		var point3D = new V3D(p3D["X"],p3D["Y"],p3D["Z"]);
		var vs = p3D["views"];
		if(!vs){
			vs = p3D["v"];
		}
		var p2Ds = [];
		for(var j=0; j<vs.length; ++j){
			var viewJ = vs[j];
			var viewJID = viewJ["view"];
			if(!viewJID){
				viewJID = viewJ["i"];
			}
			var vJ = worldViewLookup[viewJID];
			if(!viewJ["Xx"]){
				throw "tested?";
				if(!worldP3D){
					var pnt = point3D;
					var nrm = new V3D(p3D["x"],p3D["y"],p3D["z"]);
					var siz = p3D["s"];
					worldP3D = new Stereopsis.P3D(pnt,nrm,siz);
					// var p3D = new Stereopsis.P3D(pnt,nrm,siz);
				}
				var pJ = new V2D(viewJ["x"],viewJ["y"]);
				var sJ = vJ.size();
				pJ.scale(sJ.x,sJ.y);
				var p2D = new Stereopsis.P2D(vJ,pJ,p3D);
				worldP3D.addPoint2D(p2D);
				p2Ds.push(p2D);
			}else{
				for(var k=j+1; k<vs.length; ++k){
					var viewK = vs[k];
					var viewKID = viewK["view"];
					if(!viewKID){
						viewKID = viewK["i"];
					}
					var vK = worldViewLookup[viewKID];
					// if(viewJ["Xx"]){
						var fr = new V2D(viewJ["x"],viewJ["y"]);
						var to = new V2D(viewK["x"],viewK["y"]);
						// to image plane
						var sizeFr = vJ.size();
						var sizeTo = vK.size();
						fr.scale(sizeFr.x,sizeFr.y);
						to.scale(sizeTo.x,sizeTo.y);
						var affineAB = null;
						x1.set(viewJ["Xx"],viewJ["Xy"]);
						y1.set(viewJ["Yx"],viewJ["Yy"]);
						x2.set(viewK["Xx"],viewK["Xy"]);
						y2.set(viewK["Yx"],viewK["Yy"]);
						// console.log(fr+" "+to);
						affineAB = R3D.affineMatrixExact([o,x1,y1],[o,x2,y2]);
						world.addMatchFromInfo(vJ,fr, vK,to, affineAB, point3D);
					// }else{
					// 	// no match data ...
					// }
					pointCountAdded++;
				}
			}
		}
		if(worldP3D && p2Ds.length>0){ // make a P3D at once
			console.log(worldP3D);
			console.log(p2Ds);
			// make matches for each?
			// ???
			throw "HERE ... _embedMatchPoints"
		}
	}
	console.log("pointCountAdded: "+pointCountAdded);
	return points3D;
}

App3DR.ProjectManager.prototype._embedTrackPoints = function(world,graphData, graphViewLookupID){
	console.log("_embedTrackPoints");
	// add existing tracks
	var existingPoints = null;
	if(Code.isArray(graphData)){
		existingPoints = graphData;
	}else{
		existingPoints = Code.valueOrDefault(graphData["points"],[]);
	}
	var dirXJ = new V2D();
	var dirYJ = new V2D();
	var dirXK = new V2D();
	var dirYK = new V2D();
	var dirO = new V2D(0,0);
	for(var i=0; i<existingPoints.length; ++i){
		var existing = existingPoints[i];
		var pnt = new V3D(existing["X"],existing["Y"],existing["Z"]);
		var nrm = new V3D(existing["x"],existing["y"],existing["z"]);
		var siz = existing["s"];
		var vs = existing["v"];
		if(!vs){
			vs = existing["views"];
		}
		var ps = [];
		var ms = [];
		var p3D = new Stereopsis.P3D(pnt,nrm,siz);
		p3D.up(V3D.orthogonal(nrm));
		// create P2Ds
		var p2Ds = [];
		for(var j=0; j<vs.length; ++j){
			var v = vs[j];
			var p2 = new V2D(v["x"],v["y"]);
			var s = v["s"];
			var vI = v["i"];
// console.log(vI);
			// if(vI===null || vI===undefined){
			// 	vI = v["view"];
			// }
// console.log(vI);
				vI = graphViewLookupID[vI];
// console.log(vI);
			if(!Code.ofa(vI, Stereopsis.View)){
				vI = world.viewFromData(vI);
			}
// console.log(vI);
			// scale
			var siz = vI.size();
			s *= siz.x;
			p2.scale(siz.x,siz.y);
			s = null;
			var p2D = new Stereopsis.P2D(vI,p2,p3D,s);
			p3D.addPoint2D(p2D);
			p2Ds.push(p2D);
		}
		// match points
		for(var j=0; j<vs.length; ++j){
			var p2DJ = p2Ds[j];
			var v = vs[j];
			var vI = v["i"];
				vI = graphViewLookupID[vI];
			if(!Code.ofa(vI, Stereopsis.View)){
				vI = world.viewFromData(vI);
			}
			if(v["Xx"]){
				dirXJ.set(v["Xx"],v["Xy"]);
				dirYJ.set(v["Yx"],v["Yy"]);
			}
			for(var k=j+1; k<vs.length; ++k){
				var p2DK = p2Ds[k];
				var u = vs[k];
				var uI = u["i"];
					uI = graphViewLookupID[uI];
					uI = world.viewFromData(uI);
					if(!Code.ofa(uI, Stereopsis.View)){
						uI = world.viewFromData(uI);
					}
				if(u["Xx"]){
					dirXK.set(u["Xx"],u["Xy"]);
					dirYK.set(u["Yx"],u["Yy"]);
				}
				// var aff = R3D.affineMatrixExact([dirO,dirXJ,dirYJ],[dirO,dirXK,dirYK]);
				var aff = null;
	// ...........
	var m = new Stereopsis.Match2D(p2DJ,p2DK,p3D, aff); // , ncc, sad);
		m.transform(world.transformFromViews(p2DJ.view(),p2DK.view()));
	p2DJ.addMatch(m);
	p2DK.addMatch(m);
	p3D.addMatch(m);
			}
		}
	if(!p3D.up()){
	throw "no up"
	}
	// console.log(p3D.toPointArray().length);
	// console.log(p3D);
	// console.log(p3D.toPointArray());
	world.generateMatchAffineFromPatches(p3D);
		// newPoints.push(p3D);
		world.embedPoint3D(p3D, false);
		// TODO: allow for no pre-processing : just trust input data is right -- speed up
		// world.connectPoint3D(point3D); // no questions asked
	}

}

App3DR.ProjectManager.prototype._iterateGraphTracksTick = function(pair,viewsLoad){
	console.log("_iterateGraphTracksTick");
	var stage = GLOBALSTAGE;
	var graphData = this.graphData();
	console.log(graphData);
	var graphViews = graphData["views"];

	var graphViewLookup = {};
	var graphViewLookupIndex = {};
	var graphViewLookupID = {};
	for(var i=0; i<graphViews.length; ++i){
		var vid = graphViews[i]["id"];
		graphViewLookup[vid] = graphViews[i];
		graphViewLookupIndex[vid] = i;
		graphViewLookupID[i] = vid;
	}
	// project view lookup
	var viewLookup = {};
	var views = this.views();
	console.log(views)
	for(var i=0; i<views.length; ++i){
		viewLookup[views[i].id()] = views[i];
	}

	var trackData = pair.trackData();
	console.log("trackData");
	console.log(trackData);

	// create world
	var world = new Stereopsis.World();
	var cameras = this.cameras();
	var views = this.views();

	var info = this._addGraphViews(world, graphViewLookup, stage);
	var images = info["images"];
	var transforms = info["transforms"];

	App3DR.ProjectManager.addCamerasToWorld(world, cameras);
	var worldViews = App3DR.ProjectManager.addViewsToWorld(world, views, images, transforms);
	console.log(views);
// console.log(worldViews);
// console.log("need cell size");
// throw "do these all have pic /size ?"
	var worldViewLookup = {};
	for(var i=0; i<worldViews.length; ++i){
		worldViewLookup[worldViews[i].data()] = worldViews[i];
	}

	var points3D = this._embedMatchPoints(world, trackData, worldViewLookup);

	// initialize world
	world.relativeTransformsFromAbsoluteTransforms();
	world.relativeFFromSamples();
	world.averagePoints3DFromMatches(true);
	world.estimate3DErrors(true);

	// initialize point patches
	console.log("init the patches");
	// world.patchInitOnly();
	world.patchInitBasicSphere(true);

	var newPoints = world.toPointArray();
	// remove new points
	world.disconnectPoints3D(newPoints);
	// for(var i=0; i<newPoints.length; ++i){
	// 	var point3D = newPoints[i];
	// 	world.disconnectPoint3D(point3D);
	// }
	//
	this._embedTrackPoints(world, graphData, graphViewLookupID);
	console.log("EMBED NEW POINTS ...: ");
	world.printPoint3DTrackCount();
	// add back new points
	for(var i=0; i<newPoints.length; ++i){
		var point3D = newPoints[i];
		world.embedPoint3D(point3D, false);
		// world.embedPoint3D(point3D); // these points SHOULD have been validated beforehand
	}
	world.printPoint3DTrackCount();


for(var i=0; i<worldViews.length; ++i){
	var view = worldViews[i];
	var image = view.image();
	var points2D = view.toPointArray();
	console.log(points2D);
	if(!image){
		continue;
	}
var OFFX = 10 + i*image.width();
var OFFY = 10;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	d.matrix().translate(OFFX, OFFY);
	GLOBALSTAGE.addChild(d);
	for(var j=0; j<points2D.length; ++j){
		var point2D = points2D[j];
		var p = point2D.point2D();
		var d = new DO();
		d.graphics().setFill(0xFFFF0066);
		d.graphics().beginPath();
		d.graphics().drawCircle(p.x,p.y,2.0);
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(OFFX, OFFY);
		GLOBALSTAGE.addChild(d);
	}
}


// throw "any merging?"
	// all points to tracks


	var graphPoints = this._getGraphPointsFromWorld(world, graphViewLookupIndex);
	graphData["points"] = graphPoints;
	// graphData["previousPair"] // already updated
	console.log("save / update graph data");
	// . update view transforms:
	console.log(graphViews);
	var graphViews = this._updateGraphViewsFromWorld(world, graphData["views"]);
	graphData["views"] = graphViews;
	world.printPoint3DTrackCount();
	// .
	console.log(graphData);
	// throw "TO SAVE ...";
	this.saveGraphFromData(graphData);
}


App3DR.ProjectManager.prototype._getGraphPointsFromWorld = function(world, graphViewLookupIndex, includeAffine){
	includeAffine = includeAffine!==undefined && includeAffine!==null ? includeAffine : true;
	var allPoints = world.toPointArray();
	console.log("allPoints: "+allPoints.length);
	console.log(allPoints);

	// update points on graph:
	var points3D = allPoints;
	var graphPoints = [];
	var dirX = new V2D();
	var dirY = new V2D();
	var dirO = new V2D();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var loc = point3D.point();
		var nor = point3D.normal();
		var siz = point3D.size();
		var v = [];
		var points2D = point3D.toPointArray();
		var vA = null;
		var vB = null;
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var p = point2D.point2D();
			var s = point2D.size();
			var pv = point2D.view();
			var ps = pv.size();
			dirX.set(1,0);
			dirY.set(0,1);
			if(j==0){
				vA = pv;
			}else{
				vB = pv;
				var match = point3D.matchForViews(vA,vB);
				var affine = match.affineForViews(vA,vB);
				affine.multV2DtoV2D(dirO,dirO);
				affine.multV2DtoV2D(dirX,dirX);
				affine.multV2DtoV2D(dirY,dirY);
				dirX.sub(dirO);
				dirY.sub(dirO);
			}
			var wid = ps.x;
			var hei = ps.y;
			var vID = pv.data();
			var vIndex = graphViewLookupIndex[vID];
			var o = {"i":vIndex,"x":(p.x/wid), "y":(p.y/hei)};
			if(includeAffine){
				o["s"] = (s/wid);
				o["Xx"] = dirX.x;
				o["Xy"] = dirX.y;
				o["Yx"] = dirY.x;
				o["Yy"] = dirY.y;
			}
			v.push(o);
		}
		// console.log(loc,nor,siz);
		if(!nor){
			console.log(point3D);
			throw "nrm";
		}
		var object = {"X":loc.x, "Y":loc.y, "Z":loc.z, "x":nor.x, "y":nor.y, "z":nor.z, "s":siz, "v":v};
		graphPoints.push(object);
	}
	return graphPoints;
}

App3DR.ProjectManager.prototype._updateGraphViewsFromWorld = function(world, graphViews){
	var updatedViews = [];
	for(var i=0; i<graphViews.length; ++i){
		var gv = graphViews[i];
		var gid = gv["id"];
		var view = world.viewFromData(gid);
		var R = view.absoluteTransform();
		var size = view.size();
		updatedViews[i] = {
			"id": gid,
			"R": R.copy(),
			"size": size,
		};
	}
	return updatedViews;
}

App3DR.ProjectManager.prototype.saveGraphFromData = function(graphData, fxn, ctx){
	console.log(graphData);
	var yaml = new YAML();
	var object = graphData;
	var timestampNow = Code.getTimeStampFromMilliseconds();
		graphData["modified"] = timestampNow;
	yaml.writeComment("Graph");
	yaml.writeObjectLiteral(graphData);
	var graphString = yaml.toString();
	var fxnSavedGraph = function(){
		console.log("fxnSavedGraph");
		if(fxn){
			fxn.call(ctx);
		}
	}
	this.saveGraph(graphString, this.graphFilename(), fxnSavedGraph, this);
}

App3DR.ProjectManager.prototype.saveSparseFromData = function(sparseData, fxn, ctx){
	console.log(sparseData);
	var yaml = new YAML();
	var timestampNow = Code.getTimeStampFromMilliseconds();
		sparseData["modified"] = timestampNow;
	yaml.writeComment("Sparse");
	yaml.writeObjectLiteral(sparseData);
	var sparseString = yaml.toString();
	var fxnSavedSparse = function(){
		console.log("fxnSavedSparse");
		if(fxn){
			fxn.call(ctx);
		}
	}
	this.saveSparse(sparseString, this.sparseFilename(), fxnSavedSparse, this);
}

App3DR.ProjectManager.prototype.saveDenseFromData = function(denseData, fxn, ctx){
	console.log(denseData);
	var yaml = new YAML();
	var timestampNow = Code.getTimeStampFromMilliseconds();
		denseData["modified"] = timestampNow;
	yaml.writeComment("Dense Data");
	yaml.writeObjectLiteral(denseData);
	var denseString = yaml.toString();
	var fxnSavedDense = function(){
		console.log("fxnSavedDense");
		if(fxn){
			fxn.call(ctx);
		}
	}
	this.saveDense(denseString, this.denseFilename(), fxnSavedDense, this);
}


App3DR.ProjectManager.prototype.savePointsFromData = function(pointsData, fxn, ctx){
	console.log(pointsData);
	var yaml = new YAML();
	var object = pointsData;
	var timestampNow = Code.getTimeStampFromMilliseconds();
		pointsData["modified"] = timestampNow;
	yaml.writeComment("Points");
	yaml.writeObjectLiteral(pointsData);
	var pointsString = yaml.toString();
	var fxnSavedPoints = function(){
		console.log("fxnSavedPoints");
		if(fxn){
			fxn.call(ctx);
		}
	}
	this.savePoints(pointsString, this.pointsFilename(), fxnSavedPoints, this);
}




App3DR.ProjectManager.prototype.calculateGlobalOrientationNonlinear = function(str){
	// LOAD ALL BA IMAGES
	var views = this._views;
	var expectedViews = views.length;
	var loadedViews = 0;
	var self = this;
	var fxnViewImageLoaded = function(){
		++loadedViews;
		if(loadedViews==expectedViews){
			self._calculateGlobalOrientationNonlinearB(str);
		}
	}
	for(i=0; i<views.length; ++i){
		view = views[i];
		view.loadBundleAdjustImage(fxnViewImageLoaded, this);
	}
}


App3DR.ProjectManager.prototype._calculateGlobalOrientationNonlinearB = function(str){
console.log("_calculateGlobalOrientationNonlinearB");
	var yaml = YAML.parse(str);
	yaml = yaml[0];
	console.log(yaml);

	var views = this._views;
	var pairs = this._pairs;
	var cameras = this._cameras;

	// world
	var world = new Stereopsis.World();

	// cameras
	WORLDCAMS = [];
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		var K = camera.K();
		var distortion = camera.distortion();
		if(K && distortion){
			var fx = K["fx"];
			var fy = K["fy"];
			var s = K["s"];
			var cx = K["cx"];
			var cy = K["cy"];
			var k1 = distortion["k1"];
			var k2 = distortion["k2"];
			var k3 = distortion["k3"];
			var p1 = distortion["p1"];
			var p2 = distortion["p2"];
			var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
			var c = world.addCamera(K, distortion);
			c.data(camera.id()+"");
			camera.temp(c);
			WORLDCAMS.push(c);
		}
	}

	// views
	var WORLDVIEWS = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		//var img = view.featuresImage();
		//var img = view.denseHiImage(); // REPLACE 1
		var img = view.bundleAdjustImage();
		if(!img){
			throw "image not loaded: "+view.id();
		}
		var cam = null;
		var camID = view.cameraID();
		for(var j=0; j<WORLDCAMS.length; ++j){
			var c = WORLDCAMS[j];
			// console.log(c);
			if(c.data()==camID){
				cam = null;
				break;
			}
		}
		if(!cam){
			console.log("not able to find camera, assigning 0th");
			cam = WORLDCAMS[0];
		}
		var K = cam.K();
		var distortion = cam.distortion();
		var matrix = R3D.imageMatrixFromImage(img, this._stage);

		// transform
		var transform = null;
		var yamlViews = yaml["views"];
		for(var j=0; j<yamlViews.length; ++j){
			yamlView = yamlViews[j];
			viewID = yamlView["id"];
			if(viewID==view.id()){
				transform = Matrix.fromObject(yamlView["transform"]);
				break;
			}
		}
		var v = world.addView(matrix, cam);
		v.absoluteTransform(transform);
		view.temp(v);
		v.data(view.id());
		WORLDVIEWS.push(v);
	}

	// quick world-view lookup
	var WORLDVIEWSLOOKUP = {};
	for(var i=0; i<WORLDVIEWS.length; ++i){
		var v = WORLDVIEWS[i];
		WORLDVIEWSLOOKUP[v.data()] = v;
	}

	// matches
	//for(var i=0; i<pairs.length; ++i){
	var points = yaml["points"];
	console.log("adding points from yaml: "+points.length);
	var o = new V2D(0,0);
	var x1 = new V2D();
	var x2 = new V2D();
	var y1 = new V2D();
	var y2 = new V2D();
	var pointCountAdded = 0;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		if(i%1000==0){
			console.log(i+" of "+points.length);
		}
		var point3D = new V3D(point["X"],point["Y"],point["Z"]);
		var pointViews = point["views"];
		for(var j=0; j<pointViews.length; ++j){
			var viewJ = pointViews[j];
			var vJ = WORLDVIEWSLOOKUP[viewJ["view"]];
			for(var k=j+1; k<pointViews.length; ++k){
				var viewK = pointViews[k];
				// console.log(viewJ);
				// console.log(viewK);
				var vK = WORLDVIEWSLOOKUP[viewK["view"]];
				// console.log(vJ,vK);
				var fr = new V2D(viewJ["x"],viewJ["y"]);
				var to = new V2D(viewK["x"],viewK["y"]);
				x1.set(viewJ["Xx"],viewJ["Xy"]);
				y1.set(viewJ["Yx"],viewJ["Yy"]);
				x2.set(viewK["Xx"],viewK["Xy"]);
				y2.set(viewK["Yx"],viewK["Yy"]);
				// to image plane
				var sizeFr = vJ.size();
				var sizeTo = vK.size();
				fr.scale(sizeFr.x,sizeFr.y);
				to.scale(sizeTo.x,sizeTo.y);
				// console.log(fr+" "+to);
				var affineAB = R3D.affineMatrixExact([o,x1,y1],[o,x2,y2]);
				// world.addMatchForViews(vA,fr, vB,to, affineAB);

				world.addMatchFromInfo(vJ,fr, vK,to, affineAB, point3D);
				//throw "?"
				pointCountAdded++;
			}
		}
	}
	console.log("... added points: "+pointCountAdded);

	var fxnZ = function(){
		console.log("saved BA");
	}

	var completeFxn = function(){
		console.log("completeFxn");
		var str = world.toYAMLString();
		this.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
		this.saveBundleAdjust(str, fxnZ, this);
	}

	world.solveGlobalAbsoluteTransform(completeFxn, this,      false);
}
App3DR.ProjectManager.prototype.calculateGlobalOrientationHierarchyLoad = function(){
	console.log("load all necessary BA stuff ...");

	var self = this;
	var views = this._views;
	var expectedViews = views.length;
	var loadedViews = 0;
	var yamlBA = null;

	var checkDone = function(){
		if(loadedViews==expectedViews && yamlBA){
			handleDone();
		}
	}

	var BAImageLoaded = function(){
		++loadedViews;
		checkDone();
	}

	var views = this._views;
	for(i=0; i<views.length; ++i){
		view = views[i];
		view.loadBundleAdjustImage(BAImageLoaded, this);
	}

	var BALoaded = function(object, data){
		var str = Code.binaryToString(data);
		var object = YAML.parse(str);
		if(Code.isArray(object)){
			object = object[0];
		}
		yamlBA = object;
		checkDone();
	}
var world = null;
	var handleDone = function(){
		var object = yamlBA;
		var info = App3DR.bundleAdjustObjectToWorld(object, self);
		//var world = info["world"];
		world = info["world"];
		var canRun = App3DR.bundleAdjustWorldCanDoubleResolution(world);
		console.log(world);
		console.log(canRun);
		if(canRun){
			world.solveGlobalAbsoluteTransform(completeFxn, self, 3);
		}
	}

	var fxnZ = function(){
		console.log("yep");
	}

	var completeFxn = function(){
		console.log("completeFxn");
		var str = world.toYAMLString();
		self.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
		self.saveBundleAdjust(str, fxnZ, self);
	}



	this.loadBundleAdjust(BALoaded,this, null);
}
App3DR.bundleAdjustWorldCanDoubleResolution = function(world){
	var views = world.toViewArray();
	var canDouble = true;
	// var lookup = [];
	console.log(views);
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var cellSize = view.cellSize();
		var nextSize = Math.floor(cellSize/2);
		if(nextSize%2==0){
			nextSize += 1;
		}
		console.log(cellSize+" | "+nextSize)
		// if(nextSize<=3 || nextSize>=cellSize){
		if(nextSize<3 || nextSize>=cellSize){
			canDouble = canDouble & false;
		}else{
// halve cell size = double resolution
			// view.cellSize(nextSize);
		}
	}
	return canDouble;
}
App3DR.bundleAdjustObjectToWorld = function(object, project){
	console.log(object);
	var world = new Stereopsis.World();
	// locals
	var BACAMS = App3DR.bundleAdjustObjectToCameras(world,object["cameras"], project.cameras());
	var BAVIEWS = App3DR.bundleAdjustObjectToViews(world,object["views"], project.views(), project._stage);
	App3DR.bundleAdjustObjectToPoints(world,object["points"]);
	// cameras
	// console.log(cameras);
	return {"world":world, "cameras":BACAMS};
}

App3DR.bundleAdjustObjectToCameras = function(world, cameras, source){
	var BACAMS = [];
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		// TODO: K is sometimes matrix & sometimes components
		var K = camera["K"];
		var distortion = camera["distortion"];
		var camID = camera["id"];
			if(K && distortion){
				if(K["fx"]){
				var fx = K["fx"];
				var fy = K["fy"];
				var s = K["s"];
				var cx = K["cx"];
				var cy = K["cy"];
				var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
			}else{
				K = Matrix.fromObject(K);
			}
			var k1 = distortion["k1"];
			var k2 = distortion["k2"];
			var k3 = distortion["k3"];
			var p1 = distortion["p1"];
			var p2 = distortion["p2"];
			// console.log(K+"");
			var c = world.addCamera(K, distortion);
			c.data(camID);
			BACAMS.push(c);
		}
	}
	return BACAMS;
}
App3DR.bundleAdjustObjectToViews = function(world, views, source, stage){
	var BAVIEWS = [];
	var cameras = world.toCameraArray();
	console.log(cameras);
	// views
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewID = view["id"]
		var match = null;
		for(var j=0; j<source.length; ++j){
			var v = source[j];
			if(viewID==v.id()){
				match = v;
			}
			// console.log(v);
		}
		if(match){
			var img = match.bundleAdjustImage();
			var matrix = R3D.imageMatrixFromImage(img, stage);
			var cam = null;
			for(var j=0; j<cameras.length; ++j){
				var c = cameras[j]
				if(c.data()==view["camera"]){
					cam = c;
				}
			}
			// var imageSize = view["imageSize"];
			var cellSize = view["cellSize"];
			// TODO: CELL SIZE HAS SOMETHING TO DO WITH THE IMAGE SIZE RATIOS OF SOURCE AND ACTUAL
			var v = world.addView(matrix, cam);
				match.temp(v);
				v.data(match.id());
			v.cellSize(cellSize);

			// transform
			var transform = Matrix.fromObject(view["transform"]);
			v.absoluteTransform(transform);

			BAVIEWS.push(v);
		}
	}
	return BAVIEWS;
}


App3DR.bundleAdjustObjectToPoints = function(world, points){
	var WORLDVIEWS = world.toViewArray();
	var WORLDVIEWSLOOKUP = {};
	for(var i=0; i<WORLDVIEWS.length; ++i){
		var v = WORLDVIEWS[i];
		WORLDVIEWSLOOKUP[v.data()] = v;
	}

	var worldViews = world.toViewArray();
	var o = new V2D(0,0);
	var x1 = new V2D();
	var x2 = new V2D();
	var y1 = new V2D();
	var y2 = new V2D();
	var pointCountAdded = 0;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		// console.log(point);
		var point3D = new V3D(point["X"],point["Y"],point["Z"]);
// console.log(point3D+"")
		var pointViews = point["views"];
		pointCountAdded++;
		for(var j=0; j<pointViews.length; ++j){
			var viewJ = pointViews[j];
			var vJ = WORLDVIEWSLOOKUP[viewJ["view"]];
			for(var k=j+1; k<pointViews.length; ++k){
				var viewK = pointViews[k];
				// console.log(viewJ);
				// console.log(viewK);
				var vK = WORLDVIEWSLOOKUP[viewK["view"]];
				// console.log(vJ,vK);
				var fr = new V2D(viewJ["x"],viewJ["y"]);
				var to = new V2D(viewK["x"],viewK["y"]);
				x1.set(viewJ["Xx"],viewJ["Xy"]);
				y1.set(viewJ["Yx"],viewJ["Yy"]);
				x2.set(viewK["Xx"],viewK["Xy"]);
				y2.set(viewK["Yx"],viewK["Yy"]);
				// to image plane
				var sizeFr = vJ.size();
				var sizeTo = vK.size();
				fr.scale(sizeFr.x,sizeFr.y);
				to.scale(sizeTo.x,sizeTo.y);
				// create
				var affineAB = R3D.affineMatrixExact([o,x1,y1],[o,x2,y2]);
// console.log(affineAB);
				world.addMatchFromInfo(vJ,fr, vK,to, affineAB, point3D);
				// pointCountAdded++;
			}
		}
	}
	console.log("... added points: "+pointCountAdded);
}

App3DR.ProjectManager.prototype.calculateGlobalOrientationHierarchy = function(str){ // increase resolution of current YAML BA file
	// increase resolution for each view if possible

	// run iterations

	// save new BA file
}
// App3DR.ProjectManager.prototype.calculateBundleAdjustGlobal = function(callback, context, object){
// 	throw "calculateBundleAdjustGlobal";
// }

App3DR.ProjectManager.prototype.calculateBundleAdjustTriple = function(viewAIn,viewBIn,viewCIn, callback, context, object){
	console.log("calculateBundleAdjustTriple");
	var views = [viewAIn,viewBIn,viewCIn];
	var pairAB = this.pairFromViewIDs(viewAIn.id(),viewBIn.id());
	var pairAC = this.pairFromViewIDs(viewAIn.id(),viewCIn.id());
	var pairBC = this.pairFromViewIDs(viewBIn.id(),viewCIn.id());
	var pairs = [pairAB,pairAC,pairBC];
	var cameras = this.cameras();

	var project = this;
	var world = null;

	// save project file
	var saveTripleCompleted = function(a){
		console.log("saveTripleCompleted");
		project.saveProjectFile();
	}

	// save to track file
	var worldTripleCompleted = function(payload){
		console.log("worldTripleCompleted");
		var scales = payload["scales"]
		var TFT = payload["T"];
		var meanTFT = payload["errorTMean"];
		var sigmaTFT = payload["errorTSigma"];
		// TODO: TFT NEEDS TO BE SCALED TO UNITY BEFORE STORAGE

		var idA = viewAIn.id();
		var idB = viewBIn.id();
		var idC = viewCIn.id();
		var viewA = world.viewFromData(idA);
		var viewB = world.viewFromData(idB);
		var viewC = world.viewFromData(idC);

		console.log(TFT);
		console.log(scales);
		var sAB = scales["AB"];
		var sAC = scales["AC"];
		var sBC = scales["BC"];
		var vA = scales["A"];
		var vB = scales["B"];
		var vC = scales["C"];

		var lookup = {};
			lookup[viewA.data()+"-"+viewB.data()] = sAB;
			lookup[viewB.data()+"-"+viewA.data()] = sAB;
			lookup[viewA.data()+"-"+viewC.data()] = sAC;
			lookup[viewC.data()+"-"+viewA.data()] = sAC;
			lookup[viewB.data()+"-"+viewC.data()] = sBC;
			lookup[viewC.data()+"-"+viewB.data()] = sBC;
		var scaleAB = lookup[idA+"-"+idB];
		var scaleAC = lookup[idA+"-"+idC];
		var scaleBC = lookup[idB+"-"+idC];

		console.log(scaleAB,scaleAC,scaleBC);
		var pointCount = world.point3DCount();

		console.log(viewA,viewB,viewC);

		var triple = project.triple(idA,idB,idC);
		console.log(triple);

		triple.setRelativeScales(scaleAB,scaleAC,scaleBC);
		triple.setTFT(TFT);
		triple.setTFTInfo(meanTFT,sigmaTFT);
		triple.setRelativeCount(pointCount);
		// get all relative transforms:
		var relatives = [];
		var vs = [viewA,viewB,viewC];
		for(var i=0; i<vs.length; ++i){
			var vA = vs[i];
			for(var j=i+1; j<vs.length; ++j){
				var vB = vs[j];
				var transform = world.transformFromViews(vA,vB);
				var errorRSigma = transform.rSigma();
				var errorRMean = transform.rMean();
				var errorFSigma = transform.fSigma();
				var errorFMean = transform.fMean();
				var matchCount = transform.matchCount();
				var F = transform.F(vA,vB);
				var R = transform.R(vA,vB);
				var r = {
					"A": vA.data(),
					"B": vB.data(),
					"relativeCount": matchCount,
					"errorFMean": errorFMean,
					"errorFSigma": errorFSigma,
					"errorRMean": errorRMean,
					"errorRSigma": errorRSigma,
					"R": R,
					"F": F,
				};
				relatives.push(r);
			}
		}
		triple.setRelativeTransforms(relatives);
		console.log(triple);
		// relative file
		var str = world.toYAMLString();
		project.saveTripleRelative(triple, str, saveTripleCompleted, project);
	}

	var worldTripleNull = function(){
		var idA = viewAIn.id();
		var idB = viewBIn.id();
		var idC = viewCIn.id();

		var triple = project.triple(idA,idB,idC);
		console.log(triple);

		triple.setRelativeScales(0,0,0);
		triple.setTFT(null);
		triple.setTFTInfo(0,0);
		triple.setRelativeCount(0);
		var rAB = {
			"A": idA,
			"B": idB,
			"relativeCount": 0,
			"errorFMean": 0,
			"errorFSigma": 0,
			"errorRMean": 0,
			"errorRSigma": 0,
			"R": null,
			"F": null,
		};
		var rAC = {
			"A": idA,
			"B": idC,
			"relativeCount": 0,
			"errorFMean": 0,
			"errorFSigma": 0,
			"errorRMean": 0,
			"errorRSigma": 0,
			"R": null,
			"F": null,
		};
		var rBC = {
			"A": idB,
			"B": idC,
			"relativeCount": 0,
			"errorFMean": 0,
			"errorFSigma": 0,
			"errorRMean": 0,
			"errorRSigma": 0,
			"R": null,
			"F": null,
		};
		var relatives = [rAB,rAC,rBC];
		triple.setRelativeTransforms(relatives);
		// relative file
		var str = "";
		project.saveTripleRelative(triple, str, saveTripleCompleted, project);
	}

	// convert to WORLD objects & find tracks
	var createWorld = function(a){
		console.log("create world ..."+pairs.length);
		// make images:
		var images = [];
		for(var i=0; i<views.length; ++i){
			var image = views[i].bundleAdjustImage();
			images.push(image);
		}
		for(var i=0; i<images.length; ++i){
			var image = images[i];
			var matrix = GLOBALSTAGE.getImageAsFloatRGB(image);
				matrix = new ImageMat(matrix["width"], matrix["height"], matrix["red"], matrix["grn"], matrix["blu"]);
			images[i] = matrix;
		}
		// fill world in
		world = new Stereopsis.World();
		// cameras
		App3DR.ProjectManager.addCamerasToWorld(world, cameras);
		// views
		App3DR.ProjectManager.addViewsToWorld(world, views, images);
		// matching points
console.log(world);
		console.log("add matching points");
		var pointsList = [];
		for(var i=0; i<pairs.length; ++i){
			var pair = pairs[i];
			var relativeData = pair.relativeData();
			App3DR.ProjectManager.addPointsToWorld(world, relativeData["points"]);
			world.patchInitBasicSphere(true);
			var points3D = world.toPointArray();
			world.disconnectPoints3D(points3D);
			pointsList.push(points3D);
			console.log(" "+i+" = "+points3D.length);

			var idA = relativeData["views"][0]["id"];
			var idB = relativeData["views"][1]["id"];
			var transformA = relativeData["views"][0]["transform"];
			var transformB = relativeData["views"][1]["transform"];
				transformA = new Matrix().fromObject(transformA);
				transformB = new Matrix().fromObject(transformB);
			var transformAB = R3D.relativeTransformMatrix2(transformA,transformB);
			App3DR.ProjectManager.addTransformToWorld(world, transformAB, idA, idB);
		}
		// add points in
		console.log("add points with patches");
		for(var i=0; i<pointsList.length; ++i){
			var points3D = pointsList[i];
			// world.embedPoints3D(points3D);
			world.embedPoints3DNoValidation(points3D);
			// world.printPoint3DTrackCount();
		}
		// solve for relative scalings & whatnot
		console.log("solveTriple");
		world.solveTriple(worldTripleCompleted, project, null);

	}

	// done loading
	var fxnPairsLoaded = function(a){
		// viewAIn.id()
		// console.log(pairAB);
		// console.log(pairAC);
		// console.log(pairBC);
		var pairsA = this.allPairsWithViewID(viewAIn.id());
		var pairsB = this.allPairsWithViewID(viewBIn.id());
		var pairsC = this.allPairsWithViewID(viewCIn.id());
		pairsA = App3DR.ProjectManager.Pair.pairsPassingErrorR(pairsA);
		pairsB = App3DR.ProjectManager.Pair.pairsPassingErrorR(pairsB);
		pairsC = App3DR.ProjectManager.Pair.pairsPassingErrorR(pairsC);
		// console.log(pairsA);
		// console.log(pairsB);
		// console.log(pairsC);
		pairs = [];
		var checks = [[pairsA,pairsB],[pairsA,pairsC],[pairsB,pairsC]];
		var potentials = [pairAB,pairAC,pairBC];
		for(var i=0; i<potentials.length; ++i){
			var chk = checks[i];
			var inA = chk[0];
			var inB = chk[1];
			var pot = potentials[i];
			if(Code.elementExists(inA,pot) && Code.elementExists(inB,pot)){
				pairs.push(pot);
			}
		}
		if(pairs.length>=2){

			// need all 3 transforms ? if only have 2 transforms then can only get AB->BC scale ....


			createWorld();
		}else{
			worldTripleNull();
		}
	}

	// load pair data
	var fxnImagesLoaded = function(a){
		console.log("load pairs ...");
		App3DR.ProjectManager.loadPairsRelativeData(pairs, fxnPairsLoaded, this, null);
	};

	// load all view images
	console.log("load images ...");
	App3DR.ProjectManager.loadViewsImages(views, fxnImagesLoaded, this, null);
}
App3DR.ProjectManager.prototype.calculatePairTracks = function(viewAIn,viewBIn, callback, context, object){
	var pair = this.pairFromViewIDs(viewAIn.id(),viewBIn.id());
	var world = null;
	var project = this;
	// backwards order:

	// save project file
	var savePairCompleted = function(a){
		console.log("savePairCompleted");
		project.saveProjectFile();
	}

	// save to track file
	var worldTracksCompleted = function(a){
		console.log("worldTracksCompleted");
		var viewA = world.viewFromData(viewAIn.id());
		var viewB = world.viewFromData(viewBIn.id());
		console.log(viewA,viewB);
		var transform = world.transformFromViews(viewA,viewB);
		var count = transform.matches().length;
		var str = world.toYAMLString();
		var pair = project.pair(viewAIn.id(),viewBIn.id());
		pair.setTrackCount(count);
		console.log("pair track: "+pair.trackCount())
		project.savePairTracks(pair, str, savePairCompleted, project);
	}

	// convert to WORLD objects & find tracks
	var createWorld = function(a){
		// make images:
		var images = [viewAIn.bundleAdjustImage(),viewBIn.bundleAdjustImage()];
		for(var i=0; i<images.length; ++i){
			var image = images[i];
			var matrix = GLOBALSTAGE.getImageAsFloatRGB(image);
				matrix = new ImageMat(matrix["width"], matrix["height"], matrix["red"], matrix["grn"], matrix["blu"]);
			images[i] = matrix;
		}
		// fill world in
		world = new Stereopsis.World();
		var relativeData = pair.relativeData();
		App3DR.ProjectManager.addCamerasToWorld(world, relativeData["cameras"]);
		App3DR.ProjectManager.addViewsToWorld(world, relativeData["views"], images);
		App3DR.ProjectManager.addPointsToWorld(world, relativeData["points"]);
		// solve for tracks
		world.solveForTracks(worldTracksCompleted, project, null);
	}

	// done loading
	var fxnPairsLoaded = function(a){
		console.log("loaded pairs");
		createWorld();
	}

	// load pair data
	var fxnImagesLoaded = function(a){
		console.log("loaded images");
		App3DR.ProjectManager.loadPairsRelativeData([pair], fxnPairsLoaded, this, null);
	};

	// load all view images
	App3DR.ProjectManager.loadViewsImages([viewAIn,viewBIn], fxnImagesLoaded, this, null);
}
App3DR.ProjectManager.addCamerasToWorld = function(world, cameras){
	var WORLDCAMS = [];
	console.log(cameras);
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		var K = null;
		var distortion = null;
		var camID = null;
// console.log(camera);
		if(Code.ofa(camera, App3DR.ProjectManager.Camera)){
			camID = camera.id();
			K = camera.K();
			distortion = camera.distortion();
		}else{ // object
			camID = camera["camera"]; // ...
			K = camera["K"];
			distortion = camera["distortion"];
		}
// console.log(K);
		if(K["fx"]!==undefined){
			K = new Matrix(3,3).fromArray([K["fx"],K["s"],K["cx"], 0,K["fy"],K["cy"], 0,0,1]);
		}else{
			K = Matrix.loadFromObject(K);
		}
// console.log(K);
		var c = world.addCamera(K, distortion);
		c.data(camID);
		// camera.temp(c);
		WORLDCAMS.push(c);
	}
	return WORLDCAMS;
}
App3DR.ProjectManager.addViewsToWorld = function(world, views, images, transforms){
	var WORLDVIEWS = [];
	var cameras = world.toCameraArray();
	var cameraLookup = {};
	for(var i=0; i<cameras.length; ++i){
		var c = cameras[i];
		var temp = c.data(); // id
		cameraLookup[temp] = c;
	}
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var image = images[i];
		var viewID = null;
		var camID = null;
		var transform = null;
		if(Code.ofa(view, App3DR.ProjectManager.View)){
			viewID = view.id();
			camID = view.cameraID();
			transform = new Matrix(4,4).identity();
		}else{
			viewID = view["id"];
			camID = view["camera"];
			transform = view["transform"];
			transform = new Matrix(4,4).fromObject(transform);
		}
		if(transforms){
			transform = transforms[i];
		}
		var cam = cameraLookup[camID];
		if(!cam){
			cam = cameras[0];
		}
		var v = world.addView(null,cam);
		v.absoluteTransform(transform);
		if(image){
			if(Code.isa(image, V2D)){
				v.size(image);
			}else{
				v.image(image);
			}
		}
		v.data(viewID);
// todo
// v.cellSize();
		WORLDVIEWS.push(v);
	}
	return WORLDVIEWS;
}
App3DR.ProjectManager.addTransformToWorld = function(world, matrix, viewAID, viewBID){
	var viewA = world.viewFromData(viewAID);
	var viewB = world.viewFromData(viewBID);
	var transform = world.transformFromViews(viewA,viewB);
	transform.R(viewA,viewB,matrix);
}
App3DR.ProjectManager.addPointsToWorld = function(world, points){
	var viewLookup = {};
	var views = world.toViewArray();
	for(var i=0; i<views.length; ++i){
	    var view = views[i];
	    viewLookup[view.data()] = view;
	}
	var o = new V2D(0,0);
	var x1 = new V2D();
	var x2 = new V2D();
	var y1 = new V2D();
	var y2 = new V2D();
	var arr1 = [o,x1,y1];
	var arr2 = [o,x2,y2];
	var pointCountAdded = 0;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var point3D = new V3D(point["X"],point["Y"],point["Z"]);
		var pointViews = point["views"];
		// connect to view
		for(var j=0; j<pointViews.length; ++j){
			var viewJ = pointViews[j];
			var vJ = viewLookup[viewJ["view"]];
			for(var k=j+1; k<pointViews.length; ++k){
				var viewK = pointViews[k];
				var vK = viewLookup[viewK["view"]];
				var fr = new V2D(viewJ["x"],viewJ["y"]);
				var to = new V2D(viewK["x"],viewK["y"]);
				x1.set(viewJ["Xx"],viewJ["Xy"]);
				y1.set(viewJ["Yx"],viewJ["Yy"]);
				x2.set(viewK["Xx"],viewK["Xy"]);
				y2.set(viewK["Yx"],viewK["Yy"]);
				// to image plane
				var sizeFr = vJ.size();
				var sizeTo = vK.size();
				fr.scale(sizeFr.x,sizeFr.y);
				to.scale(sizeTo.x,sizeTo.y);
				var affineAB = R3D.affineMatrixExact(arr1,arr2);
				// add
				world.addMatchFromInfo(vJ,fr, vK,to, affineAB, point3D);
// viewA,pointA,viewB,pointB, affine, location3D, skipEmbed
				pointCountAdded++;
			}
		}
		// if(pointCountAdded>1000){
		// 	break;
		// }
	}
	console.log("ADDED POINTS: "+pointCountAdded);
}
App3DR.ProjectManager.loadPairsRelativeData = function(pairs, callback, context, object){
	var expectedPairs = pairs.length;
	var pair;
	var loadedPairs = 0;
	var fxnPairLoaded = function(pair){
		++loadedPairs;
		checkLoadedAllPairs();
	}
	var checkLoadedAllPairs = function(){
		if(loadedPairs==expectedPairs){
			callback.call(context, object);
		}
	}
	for(i=0; i<pairs.length; ++i){
		pair = pairs[i];
		pair.loadRelativeData(fxnPairLoaded, this);
	}
}
App3DR.ProjectManager.loadPairsTrackData = function(pairs, callback, context, object){
	var expectedPairs = pairs.length;
	var pair;
	var loadedPairs = 0;
	var fxnPairLoaded = function(pair){
		++loadedPairs;
		checkLoadedAllPairs();
	}
	var checkLoadedAllPairs = function(){
		if(loadedPairs==expectedPairs){
			callback.call(context, object);
		}
	}
	for(i=0; i<pairs.length; ++i){
		pair = pairs[i];
		pair.loadTrackData(fxnPairLoaded, this);
	}
}
App3DR.ProjectManager.loadViewsImages = function(views, callback, context, object){
	var view;
	var expectedViews = views.length;
	var loadedFeatureImages = 0;
	var expectedFeatureImages = views.length;

	var fxnFeatureImageLoaded = function(view){
		++loadedFeatureImages;
		checkLoadedAllImages.call(this);
	}
	var checkLoadedAllImages = function(){
		if(loadedFeatureImages==expectedFeatureImages){
			callback.call(context, object);
		}
	}
	for(i=0; i<views.length; ++i){
		view = views[i];
		view.loadBundleAdjustImage(fxnFeatureImageLoaded, this);
	}
}


App3DR.ProjectManager.prototype.calculateBundleAdjustPair = function(viewAIn,viewBIn, callback, context, object){
	var i, j, k;
	var view, pair, camera;
	var views = [viewAIn,viewBIn];
	var pairs = [this.pair(viewAIn.id(),viewBIn.id())];
	var expectedViews = views.length;
	var expectedPairs = pairs.length;

	var cameras = [];
	for(i=0; i<views.length; ++i){
		view = views[i];
		var cameraID = view.cameraID();
		if(cameraID){
			camera = this.cameraFromID(cameraID);
			if(camera){
				Code.addUnique(cameras, camera);
			}
		}
	}
	cameras = this._cameras;// TODO: hook cameras up
	var expectedCameras = cameras.length;
	var loadedViews = 0;
	var loadedPairs = 0;
	var loadedCameras = 0;
	var loadedFeatureImages = 0;
	var expectedFeatureImages = views.length;
	var fxnA = function(view){
		++loadedViews;
		fxnD.call(this);
	}
	var fxnB = function(pair){
		++loadedPairs;
		fxnD.call(this);
	}
	var fxnC = function(view){
		++loadedFeatureImages;
		fxnD.call(this);
	}
	var fxnZ = function(eh){
		console.log("saved relative BA file");
		this.saveProjectFile();
	}
	var fxnD = function(){
		if(loadedViews==expectedViews && loadedPairs==expectedPairs && loadedFeatureImages==expectedFeatureImages){
			var i, j, k;
//var SHOULD_CORRECT_DISTOTION = true;
var SHOULD_CORRECT_DISTOTION = false;

if(false){
//if(true){
console.log("SHOW UNDISTORTED IMAGE:");

//
//console.log(cameras[0].distortion());

var distortion = cameras[0].distortion();
// distortion["k1"] = 0.0;
// distortion["k2"] = 0.0;
// distortion["k3"] = 0.0;
// distortion["p1"] = 0.0;
// distortion["p2"] = 0.0;

// RADIAL RESULT
// distortion["k1"] = -0.2;
// distortion["k2"] = 0.1;
// distortion["k3"] = -0.1;
// distortion["p1"] = 0.0;
// distortion["p2"] = 0.0;

// PINCUSHIN
// distortion["k1"] = 0.3;
// distortion["k2"] = 0.2;
// distortion["k3"] = 0.1;
// distortion["p1"] = 0.0;
// distortion["p2"] = 0.0;

// crazy
// distortion["k1"] = 0.3;
// distortion["k2"] = -0.2;
// distortion["k3"] = 0.3;
// distortion["p1"] = 0.3;
// distortion["p2"] = -0.2;

// distortion["k1"] = -0.1;
// distortion["k2"] = 0;
// distortion["k3"] = 0;
// distortion["p1"] = 0;
// distortion["p2"] = 0;
var K = cameras[0].K();
	K = new Matrix(3,3).fromArray([K["fx"],K["s"],K["cx"], 0,K["fy"],K["cy"], 0,0,1]);
// distortion["k1"] = 0;
// distortion["k2"] = 0;
// distortion["k3"] = 0;
// distortion["p1"] = 0;
// distortion["p2"] = 0;
// distortion["k1"] = 0;
// distortion["k2"] = 0;
// distortion["k3"] = 0;
// distortion["p1"] = 0;
// distortion["p2"] = 0;
	//var img = views[0].featuresImage();
	var img = views[0].bundleAdjustImage();
	var matrix = R3D.imageMatrixFromImage(img, this._stage);
var source = matrix;
var distortionFwd = distortion;


var randomPoints = [];
for(var i=0; i<=10; ++i){
	//var point = new V2D(Math.random()*source.width(),Math.random()*source.height());
	for(var j=0; j<=10; ++j){
		//var point = new V2D(Math.random()*source.width(),Math.random()*source.height());
		var point = new V2D((i/10)*source.width(),(j/10)*source.height());
		randomPoints.push(point);
	}
}

//var distortionRev = R3D.getInvertedDistortion(distortion, K);
//var distortionRev = distortionFwd;
var distortionRev = null;
var what = R3D.invertImageDistortion(source, K, distortionFwd, true);
console.log(what);
var center = what["center"];
var mini = what["min"];
var deltaCenter = mini.copy().scale(-1);
console.log("center: "+center);
console.log("K: "+K);
var cx = K.get(0,2);
var cy = K.get(1,2);


var image = source;
var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
var d = new DOImage(img);
d.matrix().scale(1.0);
d.matrix().translate(10, 10);
d.graphics().alpha(0.5);
GLOBALSTAGE.addChild(d);
	d = new DO();
	d.graphics().setLine(1.0,0xFFFF0000);

	d.graphics().beginPath();
	d.graphics().moveTo(-10,0);
	d.graphics().lineTo(10,0);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.graphics().beginPath();
	d.graphics().moveTo(0,-10);
	d.graphics().lineTo(0,10);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.matrix().translate(10+cx*image.width(), 10+cy*image.height());
	GLOBALSTAGE.addChild(d);

	for(var i=0; i<randomPoints.length; ++i){
		var point = randomPoints[i];
		d = new DO();
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, 3);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(10+point.x, 10+point.y);
		GLOBALSTAGE.addChild(d);
	}




var image = what["image"];
var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
var d = new DOImage(img);
d.matrix().scale(1.0);
d.matrix().translate(610, 10);
d.graphics().alpha(0.5);
GLOBALSTAGE.addChild(d);

var cx = center.x;
var cy = center.y;

	d = new DO();
	d.graphics().setLine(1.0,0xFFFF0000);

	d.graphics().beginPath();
	d.graphics().moveTo(-10,0);
	d.graphics().lineTo(10,0);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.graphics().beginPath();
	d.graphics().moveTo(0,-10);
	d.graphics().lineTo(0,10);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.matrix().translate(610+cx*image.width(), 10+cy*image.height());
	GLOBALSTAGE.addChild(d);

	var sourceWidth = source.width();
	var sourceHeight = source.height();
	for(var i=0; i<randomPoints.length; ++i){
		var point = randomPoints[i];
		var p1 = point.copy();
		//
		p1.scale(1.0/sourceWidth,1.0/sourceHeight);
		var p2 = R3D.applyDistortionParameters(new V2D(), p1, K, distortionFwd);
		p2.scale(sourceWidth,sourceHeight);
		p2.add(deltaCenter);
		//
		point = p2;
		d = new DO();
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, 3);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(610+point.x, 10+point.y);
		GLOBALSTAGE.addChild(d);
	}


K.set(0,2, center.x);
K.set(1,2, center.y);

} // if false




/*
var maxScale = 1.0;
	var destWidth = sourceWidth * maxScale;
	var destHeight = sourceHeight * maxScale;
	var offX = (destWidth-sourceWidth)*0.5;
	var offY = (sourceHeight-sourceHeight)*0.5;
	var destination = new ImageMat(destWidth,destHeight);
	var min = null;
	var max = null;
	var d = new V2D();
isUnit = true;
var widthToHeightRatio = sourceWidth/sourceHeight;
console.log(sourceWidth+"x"+sourceHeight);
console.log(offX+","+offY);
	for(var j=0; j<destHeight; ++j){
		for(var i=0; i<destWidth; ++i){
			//index = j*destWidth + i;
			undistorted.set(i-offX,j-offY);
			distorted.set(0,0);
			if(isUnit){
				undistorted.scale(1.0/sourceWidth,(1.0/sourceHeight)/widthToHeightRatio);
				//undistorted.scale(1.0/sourceWidth,(1.0/sourceHeight));
			}
			R3D.applyDistortionParameters(distorted, undistorted, K, distortions);
*/



// undistort image sources
// -> this moves K center



if(SHOULD_CORRECT_DISTOTION){
	/// ....
}


// START STEREOPSIS
console.log(" > CREATE WORLD");
// world
var world = new Stereopsis.World();

// locals
var BACAMS = [];
var BAVIEWS = [];
// cameras
console.log(cameras)
var correctedCameras = [];
for(var i=0; i<cameras.length; ++i){
	correctedCameras[i] = false;
	var camera = cameras[i];
	var K = camera.K();
	var distortion = camera.distortion();
	if(K && distortion){
		var fx = K["fx"];
		var fy = K["fy"];
		var s = K["s"];
		var cx = K["cx"];
		var cy = K["cy"];
		var k1 = distortion["k1"];
		var k2 = distortion["k2"];
		var k3 = distortion["k3"];
		var p1 = distortion["p1"];
		var p2 = distortion["p2"];
		var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
		var c = world.addCamera(K, distortion);
		console.log(c);
		// c.K(K);
		// c.distortion(distortion);
		// var inverted = R3D.getInvertedDistortion(K,distortion);
		// c.distortionInverted(inverted);
	}
	BACAMS.push(c);
}


if(BACAMS.length<1){
	throw "need a camera to do BA Pair";
}


var cam = BACAMS[0];
// views
for(var i=0; i<views.length; ++i){
	var view = views[i];
	var img = view.bundleAdjustImage();
	var K = cam.K();
	var distortion = cam.distortion();
		var matrix = R3D.imageMatrixFromImage(img, this._stage);
// correct distortion
// var info = R3D.invertImageDistortion(matrix, K, distortion,true);
// var center = info["center"];
// matrix = info["image"];

	// SIZING ?
	//v.image(matrix);
		// v.images().push(matrix);
	//var imageSize = new V2D(1.0, 1.0/view.aspectRatio());
	// var imageWidth = v.image().width();
	// var imageHeight = v.image().height();
	// var imageSize = new V2D(imageWidth, imageHeight);

	var v = world.addView(matrix, cam, view);

	//v.index(view.id());
	// v.size(imageSize);
	// var corners = R3D.cornerScaleOptimum(matrix.gry(), matrix.width(), matrix.height());
	// v.corners(corners);
	// v.camera(cam);
		view.temp(v);
		v.data(view.id());
//		v.mapping(view.id());
//console.log("MAPPING: "+v.mapping());
	BAVIEWS.push(v);
}

console.log(" > READ/FILTER MATCHES");
// matches
for(var i=0; i<pairs.length; ++i){
	var pair = pairs[i];
	var matchData = pair.matchingData();
	var matches = matchData["matches"];
	var fromSize = matchData["fromSize"];
	var toSize = matchData["toSize"];
	var matches = matchData["matches"];
	var fromViewID = matchData["from"];
	var toViewID = matchData["to"];
	//
	var viewA = this.viewFromID(fromViewID);
	var viewB = this.viewFromID(toViewID);
	var vA = viewA.temp();
	var vB = viewB.temp();
	var imageWidthA = vA.image().width();
	var imageHeightA = vA.image().height();
	var imageWidthB = vB.image().width();
	var imageHeightB = vB.image().height();
		var aspectA = viewA.aspectRatio();
		var aspectB = viewB.aspectRatio();
		var fromImageSize = new V2D(imageWidthA,imageHeightA);
		var toImageSize = new V2D(imageWidthB,imageHeightB);


	// save local copy
	var filteredMatches = [];
	for(var j=0; j<matches.length; ++j){
		var match = matches[j];
		var fr = match["fr"];
		var to = match["to"];
		var relScale = (to["s"]*imageWidthB)/(fr["s"]*imageWidthA);
		var relAngle = to["a"] - fr["a"];

		fr = new V2D(fr.x,fr.y);
		//fr = R3D.undistortPointCamera(fr, K, distortion);
		fr.scale(fromImageSize.x,fromImageSize.y);

		to = new V2D(to.x,to.y);
		//to = R3D.undistortPointCamera(to, K, distortion);
		to.scale(toImageSize.x,toImageSize.y);
		filteredMatches.push([fr,to,relAngle,relScale]);
	}
	//console.log("MATCHES AFTER: "+filteredMatches.length);
	console.log("MATCHES FOR PAIR "+vA.id()+"+"+vB.id()+" == "+filteredMatches.length);

// var skip = true; // SKIP AFFINE SEQUENCE - OK FOR ~1000 not for ~10,000+
var skip = false;
	// copy over
	for(var j=0; j<filteredMatches.length; ++j){
	if(j%1000==0){
		console.log(" "+j+"/"+filteredMatches.length);
	}
		var match = filteredMatches[j];
//		console.log(match);
		var fr = match[0];
		var to = match[1];
		var angleAB = match[2];
		var scaleAB = match[3]; // THIS DEPENDS ON ABSOLUTE SIZE ...
//		console.log(fr+" & "+to+" & "+angleAB+" | "+scaleAB);
		world.addMatchForViews(vA,fr, vB,to, scaleAB,angleAB, skip);
	}
	// initially get 2-sigma points & only add those from match list
}




// check
// world.consistencyCheck();

var completeFxn = function(){
	console.log("completeFxn");
// throw "remove this";
	var viewA = BAVIEWS[0];
	var viewB = BAVIEWS[1];
	var transform = world.transformFromViews(viewA,viewB);
	var count = transform.matches().length; // doesn't count if P has 0 matches
	var str = world.toYAMLString();
	var pair = this.pair(viewAIn.id(),viewBIn.id());
	// update summary
	pair.setRelativeCount(count);
	pair.setF(transform.F(viewA,viewB));
	pair.setFInfo(transform.fMean(),transform.fSigma());
	pair.setR(transform.R(viewA,viewB));
	pair.setRInfo(transform.rMean(),transform.rSigma());
	this.saveProjectFile();

	// create/update pair file
	this.savePairRelative(pair, str, fxnZ, this);

	/*
	this.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
	this.saveBundleAdjust(str, fxnZ, this);
	*/
}
console.log(world);


// set cell size:
for(var i=0; i<BAVIEWS.length; ++i){
	var view = BAVIEWS[i];
	// var size = view.sizeFromPercent(0.03); // 1% = 5 | 2% = 9 | 3% = 13
	var size = view.sizeFromPercent(0.01);
	size = Math.round(size);
	if(size%2==0){ // make odd
		size += 1;
	}
	view.cellSize(size);
	console.log("view cell size: "+size)
}

world.solve(completeFxn, this);
return;
throw "USE NEW BUNDLE ADJUST: R3D.BA";


			var BA = new R3D.BundleAdjust();
			var baViews = [];
			var baCameras = [];
// view = Code.copyArray(views);
// pairs = Code.copyArray(pairs);
// views = [views[0],views[1]];
// pairs = [pairs[0]];
			for(i=0; i<cameras.length; ++i){
				var camera = cameras[i];
				console.log(camera);
				var c = BA.addCamera();
					var K = camera.K();
					var distortion = camera.distortion();
					if(K && distortion){
						var fx = K["fx"];
						var fy = K["fy"];
						var s = K["s"];
						var cx = K["cx"];
						var cy = K["cy"];
						var k1 = distortion["k1"];
						var k2 = distortion["k2"];
						var k3 = distortion["k3"];
						var p1 = distortion["p1"];
						var p2 = distortion["p2"];
						c.index(camera.id());
						c.set(fx,fy,s,cx,cy, k1,k2,k3, p1,p2);
					}
				baCameras.push(c);
			}
			var cam = baCameras[0]; // TODO: connect camera to views
			// console.log("VIEWS");
			for(i=0; i<views.length; ++i){
				var view = views[i];
				var imageSize = new V2D(1.0, 1.0/view.aspectRatio());
				var v = BA.addView(imageSize);
					//var img = view.featuresImage();
					var img = view.denseHiImage();
					var matrix = R3D.imageMatrixFromImage(img, this._stage);
					v.images().push(matrix);
				v.index(view.id());
				v.size(imageSize);
				baViews.push(v);
					v.camera(cam);
					view._temp = v;
				// add all feature points
				var features = view.features();
				features.sort(function(a,b){ return a["score"]<b["score"] ? -1 : 1; });
				var beforeCount = features.length;
				//console.log("FEATURES BEFORE: "+features.length);
				//console.log(features);
				var filteredFeatures = [];
				// save local copy -- assumed orderd by score increasing
				for(j=0; j<features.length; ++j){
					var feature = features[j];
					var pos = feature["point"];
					var size = feature["size"];
					var angle = feature["angle"];
					pos = pos.copy().scale(imageSize.x,imageSize.y);
					size = size * imageSize.x;
					var feature = new V4D(pos.x,pos.y,angle,size);
					filteredFeatures.push(feature);
				}
				// remove duplicate features:
				var eps = 1E-10;
				for(j=0; j<filteredFeatures.length; ++j){
					var featureA = filteredFeatures[j];
					for(k=j+1; k<filteredFeatures.length; ++k){
						var featureB = filteredFeatures[k];
						if( Math.abs(featureA.x-featureB.x)<eps &&  Math.abs(featureA.y-featureB.y)<eps){
							filteredFeatures.splice(j,1);
							--j; // retry
							break;
						}
					}
				}
				//console.log("FEATURES AFTER: "+filteredFeatures.length);
				// copy over
console.log("FEATURES FOR VIEW "+i+" == "+filteredFeatures.length+" / "+beforeCount);
				for(j=0; j<filteredFeatures.length; ++j){
					var pos = filteredFeatures[j];
					var point = v.addPoint2D(pos.x,pos.y,pos.z,pos.t);
				}
			}
			var matchesCount = 0;
			// console.log("PAIRS");
			for(i=0; i<pairs.length; ++i){
				var pair = pairs[i];
				var matchData = pair.matchingData();
				var matches = matchData["matches"];
				var fromSize = matchData["fromSize"];
				var toSize = matchData["toSize"];
				var matches = matchData["matches"];
				var fromViewID = matchData["from"];
				var toViewID = matchData["to"];
				//
				var viewA = this.viewFromID(fromViewID);
				var viewB = this.viewFromID(toViewID);
					var aspectA = viewA.aspectRatio();
					var aspectB = viewB.aspectRatio();
					var fromImageSize = new V2D(1.0,1.0/aspectA);
					var toImageSize = new V2D(1.0,1.0/aspectB);
				var vA = viewA._temp;
				var vB = viewB._temp;
				//console.log("MATCHES BEFORE: "+matches.length);
var beforeCount = matches.length;
				// save local copy
				var filteredMatches = [];
				for(j=0; j<matches.length; ++j){
					var match = matches[j];
					var fr = match["fr"];
					var to = match["to"];
					fr = new V2D(fr.x,fr.y);
					fr.scale(fromImageSize.x,fromImageSize.y);
					to = new V2D(to.x,to.y);
					to.scale(toImageSize.x,toImageSize.y);
					filteredMatches.push([fr,to]);
				}
				// remove duplicates
				// TODO: keep best dups
				var eps = 1E-10;
				for(j=0; j<filteredMatches.length; ++j){
					var matchA = filteredMatches[j];
					for(k=j+1; k<filteredMatches.length; ++k){
						var matchB = filteredMatches[k];
						if( (Math.abs(matchA[0].x-matchB[0].x)<eps && Math.abs(matchA[0].y-matchB[0].y)<eps) ||
						    (Math.abs(matchA[1].x-matchB[1].x)<eps && Math.abs(matchA[1].y-matchB[1].y)<eps) ){
							filteredMatches.splice(j,1);
							--j; // retry
							break;
						}
					}
				}
				//console.log("MATCHES AFTER: "+filteredMatches.length);
				console.log("MATCHES FOR PAIR "+vA.id()+"+"+vB.id()+" == "+filteredMatches.length+" / "+beforeCount);
				// copy over
				for(j=0; j<filteredMatches.length; ++j){
					var match = filteredMatches[j];
					var fr = match[0];
					var to = match[1];
					var pointA = vA.closestPoint2D(fr.x,fr.y);
					var pointB = vB.closestPoint2D(to.x,to.y);
					if(pointA && pointB){
						BA.matchPoints2D(pointA, pointB);
						++matchesCount;
					}
				}
				// initially get 2-sigma points & only add those from match list
			}
			console.log("matchesCount: "+matchesCount);
			BA.process();
			var str = BA.toYAMLString();
//			console.log(str);
			this.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
			this.saveBundleAdjust(str, fxnZ, this);
			this.saveProjectFile();
		}
	}
	for(i=0; i<views.length; ++i){
		view = views[i];
		view.loadFeatures(fxnA, this);
	}
	for(i=0; i<pairs.length; ++i){
		pair = pairs[i];
		pair.loadMatchingData(fxnB, this);
	}
	for(i=0; i<views.length; ++i){
		view = views[i];
		//view.loadFeaturesImage(fxnC, this);
		//view.loadDenseHiImage(fxnC, this); // REPLACE 1
		view.loadBundleAdjustImage(fxnC, this); // REPLACE 1
	}
	for(i=0; i<cameras.length; ++i){
		// camera K is in default camera data
	}
// */
//
// }
// }
}


App3DR.ProjectManager.prototype._matchesToYAML = function(matches, F, viewA, viewB, imageMatrixA, imageMatrixB){
	// imageMatrixA, imageMatrixB, F, matches, additionalParams
	// var parameters = {};
	// 	parameters[""] = null;
	var yaml = new YAML();
	var timestampNow = Code.getTimeStampFromMilliseconds();

	yaml.writeComment("3DR Features File 0");
	yaml.writeBlank();
	yaml.writeString("title", "features");
	yaml.writeString("created", timestampNow);
	yaml.writeString("from", viewA.id());
	yaml.writeString("to", viewB.id());

	return R3D.outputMatchPoints(imageMatrixA, imageMatrixB, F, matches, yaml);
}

// App3DR.ProjectManager.prototype._matchesToYAML = function(matches, F, viewA, viewB, imageMatrixA, imageMatrixB){
// 	var timestampNow = Code.getTimeStampFromMilliseconds();
// 	var widA = imageMatrixA.width();
// 	var heiA = imageMatrixA.height();
// 	var widB = imageMatrixB.width();
// 	var heiB = imageMatrixB.height();

// 	var yaml = new YAML();
// 	yaml.writeComment("3DR Features File 0");
// 	yaml.writeBlank();
// 	yaml.writeString("title", "features");
// 	yaml.writeString("created", timestampNow);

// 	yaml.writeString("from", viewA.id());
// 	yaml.writeString("to", viewB.id());

// 	yaml.writeObjectStart("fromSize");
// 		yaml.writeNumber("x",widA);
// 		yaml.writeNumber("y",heiA);
// 	yaml.writeObjectEnd();
// 	yaml.writeObjectStart("toSize");
// 		yaml.writeNumber("x",widB);
// 		yaml.writeNumber("y",heiB);
// 	yaml.writeObjectEnd();

// 	yaml.writeObjectStart("F");
// 		var Fnorm = F.copy();
// 			Fnorm = Matrix.mult(Fnorm, Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widA,1.0/heiA));
// 			Fnorm = Matrix.mult(Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widB,1.0/heiB), Fnorm);
// 		Fnorm.toYAML(yaml);
// 	yaml.writeObjectEnd();
// 	yaml.writeNumber("count", matches.length);
// 	yaml.writeArrayStart("matches");
// 	var i, len=matches.length;
// 	for(i=0; i<len; ++i){
// 		var match = matches[i];
// 		var score = match["score"];
// 		var fr = match["from"];
// 		var to = match["to"];
// 		yaml.writeObjectStart();
// 			yaml.writeObjectStart("fr");
// 				yaml.writeNumber("i", match["A"]);
// 				yaml.writeNumber("x", fr["point"].x/widA);
// 				yaml.writeNumber("y", fr["point"].y/heiA);
// 				yaml.writeNumber("s", fr["size"]/widA);
// 				yaml.writeNumber("a", fr["angle"]);
// 			yaml.writeObjectEnd();
// 			yaml.writeObjectStart("to");
// 				yaml.writeNumber("i", match["B"]);
// 				yaml.writeNumber("x", to["point"].x/widB);
// 				yaml.writeNumber("y", to["point"].y/heiB);
// 				yaml.writeNumber("s", to["size"]/widB);
// 				yaml.writeNumber("a", to["angle"]);
// 			yaml.writeObjectEnd();
// 		yaml.writeObjectEnd();
// 	}
// 	yaml.writeArrayEnd();
// 	yaml.writeBlank();
// 	return yaml.toString();
// }

App3DR.ProjectManager.prototype._tripleMatchesToYAML = function(tripleInfo, viewA, viewB, viewC, imageMatrixA, imageMatrixB, imageMatrixC){
	var timestampNow = Code.getTimeStampFromMilliseconds();
	var widA = imageMatrixA.width();
	var heiA = imageMatrixA.height();
	var widB = imageMatrixB.width();
	var heiB = imageMatrixB.height();
	var widC = imageMatrixC.width();
	var heiC = imageMatrixC.height();

	var yaml = new YAML();
	yaml.writeComment("3DR Triple Matches File 0");
	yaml.writeBlank();
	yaml.writeString("title", "triple matches");
	yaml.writeString("created", timestampNow);

	yaml.writeString("viewA", viewA.id());
	yaml.writeString("viewB", viewB.id());
	yaml.writeString("viewC", viewC.id());

	yaml.writeObjectStart("ASize");
		yaml.writeNumber("x",widA);
		yaml.writeNumber("y",heiA);
	yaml.writeObjectEnd();
	yaml.writeObjectStart("BSize");
		yaml.writeNumber("x",widB);
		yaml.writeNumber("y",heiB);
	yaml.writeObjectEnd();
	yaml.writeObjectStart("CSize");
		yaml.writeNumber("x",widC);
		yaml.writeNumber("y",heiC);
	yaml.writeObjectEnd();


	var tripleA = tripleInfo["A"];
	var tripleB = tripleInfo["B"];
	var tripleC = tripleInfo["C"];
	var scores = tripleInfo["scores"];


	yaml.writeObjectStart("T");
		// TODO: TRIFOCAL TENSOR
		yaml.writeString("dunno",null);
	yaml.writeObjectEnd();

	yaml.writeNumber("count", scores.length);

	yaml.writeArrayStart("matches");
	var i, len=scores.length;
	for(i=0; i<len; ++i){
		var A = tripleA[i];
		var B = tripleB[i];
		var C = tripleC[i];
		var score = scores[i];
			var pointA = A["point"];
			var pointB = B["point"];
			var pointC = C["point"];
			var sizeA = A["size"];
			var sizeB = B["size"];
			var sizeC = C["size"];
			var angleA = A["angle"];
			var angleB = B["angle"];
			var angleC = C["angle"];
		yaml.writeObjectStart();
			yaml.writeObjectStart("A");
				yaml.writeNumber("x", pointA.x);
				yaml.writeNumber("y", pointA.y);
				yaml.writeNumber("s", sizeA);
				yaml.writeNumber("a", angleA);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("B");
				yaml.writeNumber("x", pointB.x);
				yaml.writeNumber("y", pointB.y);
				yaml.writeNumber("s", sizeB);
				yaml.writeNumber("a", angleB);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("C");
				yaml.writeNumber("x", pointC.x);
				yaml.writeNumber("y", pointC.y);
				yaml.writeNumber("s", sizeC);
				yaml.writeNumber("a", angleC);
			yaml.writeObjectEnd();
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeBlank();
	var str = yaml.toString();
	return str;
}

App3DR.ProjectManager.prototype._featuresToYAML = function(features){
	var timestampNow = Code.getTimeStampFromMilliseconds();
	var i;
	var yaml = new YAML();
	yaml.writeComment("3DR Features File 0");
	yaml.writeBlank();
	yaml.writeString("title", "features");
	yaml.writeString("created", timestampNow);
	yaml.writeNumber("count", features.length);
	len = features.length;
	yaml.writeArrayStart("features");
	for(i=0; i<len; ++i){
		var feature = features[i];
		var point = feature["point"];
		var size = feature["size"];
		var angle = feature["angle"];
		var affine = feature["affine"];
		yaml.writeObjectStart();
			yaml.writeNumber("x",point.x);
			yaml.writeNumber("y",point.y);
			yaml.writeNumber("size",size);
			yaml.writeNumber("angle",angle);
			if(affine){
				yaml.writeArray("affine",affine);
			}
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeDocument();
	return yaml.toString();
}

App3DR.ProjectManager.prototype._featuresFromObject = function(object){
	var title = object["title"];
	var created = object["created"];
	var count = object["count"];
	var features = object["features"];
	var list = [];
	if(features && features.length>0){
		var i, len = features.length;
		for(i=0; i<len; ++i){
			var feature = features[i];
				var object = {};
				var pointX = feature["x"];
				var pointY = feature["y"];
				object["point"] = new V2D(pointX,pointY);
				object["size"] = feature["size"];
				object["angle"] = feature["angle"];
				object["affine"] = feature["affine"];
//				object["vector"] = feature["vector"];
			list.push(object);
		}
	}
	return list;
}
App3DR.ProjectManager.prototype.viewFromID = function(viewID){
	if(viewID){
		var views = this._views;
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			if(view.id()==viewID){
				return view;
			}
		}
	}
	return null;
}
App3DR.ProjectManager.prototype.cameraFromID = function(cameraID){
	if(cameraID){
		var cameras = this._cameras;
		for(var i=0; i<cameras.length; ++i){
			var camera = cameras[i];
			if(camera.id()==cameraID){
				return camera;
			}
		}
	}
	return null;
}
App3DR.ProjectManager.prototype.pairFromID = function(pairID){
	if(pairID){
		var pairs = this._pairs;
		for(var i=0; i<pairs.length; ++i){
			var pair = pairs[i];
			if(pair.id()==pairID){
				return pair;
			}
		}
	}
	return null;
}
App3DR.ProjectManager.prototype.x = function(){

}

// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.View = function(manager, name, directory){
	this._manager = manager;
	this._title = name ? name : "dunno1";
	this._directory = directory ? directory : "dunno2";
	this._pictureInfo = []; //
	this._widthToHeightRatio = null;
	// this._pictures = null; // actual data when loaded --- maybe only specific sizes ? [icon, denseLo, features, denseHi, texture, original]
	this._maskInfo = null; // info
	this._mask = null; // actual data when loaded
	this._featureInfo = null;
	this._features = null; // actual data when loaded
	// this._pairInfo = null;
	this._cameraID = null;
	this._pictureSourceMask = null;
	this._pictureSourceIcon = null;
	this._pictureSourceDenseLo = null;
	this._pictureSourceFeatures = null;
	this._pictureSourceDenseHi = null;
	this._pictureSourceTexture = null;
	this._temp = null;
}
App3DR.ProjectManager.View.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
App3DR.ProjectManager.View.prototype.hasFeatures = function(){
	return this._featureInfo != null;
}
App3DR.ProjectManager.View.prototype.toYAML = function(yaml){
	var i, len;
	yaml.writeString("title", this._title);
	yaml.writeString("directory", this._directory);
	yaml.writeString("camera", this._cameraID);
	yaml.writeNumber("aspectRatio", this._widthToHeightRatio);
	// mask
	if(this._maskInfo){
		var mask = this._maskInfo;
		yaml.writeObjectStart("mask");
			yaml.writeString("file",mask["file"]);
		yaml.writeObjectEnd();
	}else{
		yaml.writeString("mask", null);
	}
	// pictures
	len = this._pictureInfo ? this._pictureInfo.length : 0;
	yaml.writeArrayStart("pictures");
	for(i=0; i<len; ++i){
		var picture = this._pictureInfo[i];
		yaml.writeObjectStart();
			yaml.writeString("file", picture["file"]);
			yaml.writeNumber("width", picture["width"]);
			yaml.writeNumber("height", picture["height"]);
			yaml.writeNumber("scale", picture["scale"]);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	// features
	if(this._featureInfo){
		var features = this._featureInfo;
		yaml.writeObjectStart("features");
			yaml.writeString("file",features["file"]);
		yaml.writeObjectEnd();
	}else{
		yaml.writeString("features", null);
	}
}
App3DR.ProjectManager.View.prototype.readFromObject = function(obj){
	this._mask = null;
	this._pictureSourceIcon = null;
	this._pictureSourceDenseLo = null;
	this._pictureSourceFeatures = null;
	this._pictureSourceDenseHi = null;
	this._pictureSourceTexture = null;
	//this._pictures = [];
	this._features = [];
	var title = obj["title"];
	var directory = obj["directory"];
	var mask = obj["mask"];
	var pictures = obj["pictures"];
	var features = obj["features"];
	var pairs = obj["pairs"];
	var camera = obj["camera"];
	var aspect = obj["aspectRatio"]
	this._title = title;
	this._directory = directory;
	this._pictureInfo = [];
	this._featureInfo = [];
	this._cameraID = camera;
	this._widthToHeightRatio = aspect;
	// mask
	if(mask){
		var m = {};
			m["file"] = mask["file"];
		this._mask = m;
	}else{
		this._maskInfo = null;
	}
	// pictures
	if(pictures){
		for(var i=0; i<pictures.length; ++i){
			var o = pictures[i];
			var picture = {};
				picture["file"] = o["file"];
				picture["width"] = o["width"];
				picture["height"] = o["height"];
				picture["scale"] = o["scale"];
			this._pictureInfo.push(picture);
		}
	}
	// features
	if(features){
		var f = {};
			f["file"] = features["file"];
		this._featureInfo = f;
	}else{
		this._featureInfo = null;
	}
	if(camera){
		this._cameraID = camera;
	}else{
		this._cameraID = null;
	}
	/*
	// pairs
	if(pairs){
		for(var i=0; i<pairs.length; ++i){
			var p = pairs[i];
			var pair = {};
				pair["file"] = o["file"];
				// pair["width"] = o["width"];
				// pair["height"] = o["height"];
				// pair["scale"] = o["scale"];
			this._pairInfo.push(pair);
		}
	}
	*/
}
App3DR.ProjectManager.View.prototype.saveMaskPicture = function(image){
	console.log("saveMaskPicture");
	var filename = App3DR.ProjectManager.PICTURE_MASK_FILE_NAME;
	var size = null;
	var scale = null;
		var imageBase64 = image.src;
		var imageBinary = Code.base64StringToBinary(imageBase64);
	var binary = imageBinary;
	var object = {};
	var info = this._manager.addPictureForView(this, filename, size, scale, binary, this._saveMaskPictureComplete, this, object);
}
App3DR.ProjectManager.View.prototype._saveMaskPictureComplete = function(object, data){
	console.log("_saveMaskPictureComplete");
}
App3DR.ProjectManager.View.prototype.addPicture = function(size, scale, binary,  callback, context, returnObject){
	var filename = (scale*100.0)+"."+"png";
	var object = {};
		object["size"] = size;
		object["scale"] = scale;
		object["binary"] = binary;
		object["filename"] = filename;
		object["callback"] = callback;
		object["context"] = context;
		object["object"] = returnObject;
	var info = this._manager.addPictureForView(this, filename, size, scale, binary, this._callbackAddPicture, this, object);
	// view, filename, size, scale, binary, callback, context, object
}

App3DR.ProjectManager.View.prototype._callbackAddPicture = function(object, data){
	console.log("add picture callback");
	console.log(object);
	var callback = object["callback"];
	var context = object["context"];
	var returnObject = object["object"];
	var size = object["size"];
	var scale = object["scale"];
	var filename = object["filename"];
		var picture = {};
		picture["file"] = filename;
		picture["scale"] = scale;
		picture["width"] = size.x;
		picture["height"] = size.y;
	this._pictureInfo.push(picture);
	callback.call(context, this, returnObject);
}
App3DR.ProjectManager.View.prototype.id = function(){
	return this.directory();
}
App3DR.ProjectManager.View.prototype.cameraID = function(){
	return this._cameraID;
}
App3DR.ProjectManager.View.prototype.directory = function(){
	return this._directory;
}
App3DR.ProjectManager.View.prototype.aspectRatio = function(r){
	if(r!==undefined){
		this._widthToHeightRatio = r;
	}
	return this._widthToHeightRatio;
}
App3DR.ProjectManager.View.prototype.removePicture = function(index){
	//
}
App3DR.ProjectManager.View.prototype.setFeatures = function(normalizedFeatures, callback, context, returnObject){
	console.log("setFeatures");
	this._features = normalizedFeatures;
	var filename = App3DR.ProjectManager.FEATURES_FILE_NAME;
	var object = {};
		object["features"] = normalizedFeatures;
		object["file"] = filename;
		object["callback"] = callback;
		object["context"] = context;
		object["object"] = returnObject;
	this._manager.saveFeaturesForView(this, this._features, filename, this._setFeaturesComplete, this, object);
}
App3DR.ProjectManager.View.prototype._setFeaturesComplete = function(object, data){
	console.log("_setFeaturesComplete");
	var callback = object["callback"];
	var context = object["context"];
	var returnObject = object["object"];
	var features = object["features"];
	var filename = object["file"];
	if(features){
		this._featureInfo = {"file":filename};
		this._features = features;
	}else{
		this._featureInfo = null;
		this._features = [];
	}
	this._manager.saveProjectFile();
	returnObject = this;
	callback.call(context, this, returnObject);
}
App3DR.ProjectManager.View.prototype.features = function(){
	return this._features;
}
App3DR.ProjectManager.View.prototype.loadFeatures = function(callback, context, returnObject){
	// console.log("loadFeatures");
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["object"] = returnObject;
	this._manager.loadFeaturesForView(this, App3DR.ProjectManager.FEATURES_FILE_NAME, this._loadFeaturesComplete, this, object);
}
App3DR.ProjectManager.View.prototype._loadFeaturesComplete = function(object, data){
	// console.log("_loadFeaturesComplete");
	var callback = object["callback"];
	var context = object["context"];
	var returnObject = object["object"];
	var yamlObject = data ? Code.binaryToYAMLObject(data) : null;
	if(yamlObject){
		var features = this._manager._featuresFromObject(yamlObject);
		this._features = features;
	}
	returnObject = this;
	callback.call(context, this, returnObject);
}
App3DR.ProjectManager.View.prototype.setMask = function(index){
	//
}
App3DR.ProjectManager.View.prototype.getMask = function(index){
	//
}
App3DR.ProjectManager.View.prototype.load = function(){
	// load from disk
}
App3DR.ProjectManager.View.prototype.unload = function(){
	// free space
}
// image loading
App3DR.ProjectManager.View.prototype.maskImage = function(){
	return this._pictureSourceMask;
}
App3DR.ProjectManager.View.prototype.iconImage = function(){
	return this._pictureSourceIcon;
}
App3DR.ProjectManager.View.prototype.denseLomage = function(){
	return this._pictureSourceDenseLo;
}
App3DR.ProjectManager.View.prototype.featuresImage = function(){
	return this._pictureSourceFeatures;
}
App3DR.ProjectManager.View.prototype.denseHiImage = function(){
	return this._pictureSourceDenseHi;
}
App3DR.ProjectManager.View.prototype.bundleAdjustImage = function(){
	return this._pictureSourceBundleAdjust;
}
App3DR.ProjectManager.View.prototype.textureImage = function(){
	return this._pictureSourceTexture;
}
App3DR.ProjectManager.View.prototype.loadIconImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_ICON, callback, context);
}
App3DR.ProjectManager.View.prototype.loadDenseLoImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_LO, callback, context);
}
App3DR.ProjectManager.View.prototype.loadFeaturesImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_FEATURES, callback, context);
}
App3DR.ProjectManager.View.prototype.loadDenseHiImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_HI, callback, context);
}
App3DR.ProjectManager.View.prototype.loadTextureImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_TEXTURE, callback, context);
}
App3DR.ProjectManager.View.prototype.loadBundleAdjustImage = function(callback, context){
	this._loadImage(App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_BUNDLE_ADJUST, callback, context);
}
App3DR.ProjectManager.View.prototype.loadMaskImage = function(callback, context){
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["type"] = App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MASK;
	this._manager.loadImageForView(this, App3DR.ProjectManager.PICTURE_MASK_FILE_NAME, this._loadImageComplete, this, object);
}
// synonyms:
App3DR.ProjectManager.View.prototype.matchingImage = function(){
	return this.featuresImage();
}
App3DR.ProjectManager.View.prototype.loadMatchingImage = function(callback, context){
	this.loadFeaturesImage(callback, context);
}


App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_ICON = 0;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_LO = 1;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_FEATURES = 2;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_HI = 3;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_TEXTURE = 4;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_BUNDLE_ADJUST = 5;
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MASK = 100;
App3DR.ProjectManager.View.prototype._loadImage = function(type, callback, context){
	var i;
	var pictures = this._pictureInfo.sort(App3DR.ProjectManager.View.sortSizeIncreasing);
	var desiredPixelCount = 600*400;
	var maximumPixelCount = 1000*750;
	// default
	if(true){//loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_ICON){
		// desiredPixelCount = 400*300;
		// maximumPixelCount = 500*350;
		desiredPixelCount = 500*400;
		maximumPixelCount = 700*650;
	}
	if(type==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_HI){
		desiredPixelCount = 900*600;
		maximumPixelCount = 1000*800;
	}else if(type==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_BUNDLE_ADJUST){
		// large
		// desiredPixelCount = 900*600;
		// maximumPixelCount = 1000*800;
		desiredPixelCount = 600*800;
		maximumPixelCount = 800*1000;
		// medium
		// desiredPixelCount = 400*300;
		// maximumPixelCount = 500*400;
		// tiny
		// desiredPixelCount = 400*300;
		// maximumPixelCount = 400*300;
	}else if(type==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_FEATURES){
		desiredPixelCount = 400*300;
		maximumPixelCount = 500*400;
	}
	// 1306
	var closestPicture = -1;
	var currentPixels = 0;
	for(i=0; i<pictures.length; ++i){
		var picture = pictures[i];
		var width = picture["width"];
		var height = picture["height"];
		var pixels = width*height;
		if(pixels<=maximumPixelCount && pixels>currentPixels){
			closestPicture = i;
			currentPixels = pixels;
		}
	}
	if(closestPicture==null){
		closestPicture = 0;
	}
	var picture = pictures[closestPicture];
console.log("loading picture:")
console.log(picture)
var file = null;
if(picture){
	file = picture["file"];
}
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["type"] = type;
	this._manager.loadImageForView(this, file, this._loadImageComplete, this, object);
}
App3DR.ProjectManager.View.prototype._loadImageComplete = function(object, data){
	// console.log("_loadImageComplete");
	// console.log(object);
	// console.log(data);
	var callback = object["callback"];
	var context = object["context"];
	var loadType = object["type"];
	var self = this;

	if(!data){
		callback.call(context, self);
		return;
	}

	var binary = data;
	var filetype = "png";
	var base64 = Code.arrayBufferToBase64(binary);
	var imageSrc = Code.appendHeaderBase64(base64, filetype);
	var image = new Image();

	image.onload = function(e){
		if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_ICON){
			self._pictureSourceIcon = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_LO){
			self._pictureSourceDenseLo = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_FEATURES){
			self._pictureSourceFeatures = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_DENSE_HI){
			self._pictureSourceDenseHi = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_TEXTURE){
			self._pictureSourceTexture = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_BUNDLE_ADJUST){
			self._pictureSourceBundleAdjust = image;
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MASK){
			self._pictureSourceMask = image;
		}else{
			console.log("UNKNOWN LOAD TYPE: "+loadType);
		}
		callback.call(context, self);
	}
	image.src = imageSrc;
}
/*
	this._pictureSourceIcon = null;
		this._pictureSourceDenseLo = null;
		this._pictureSourceFeatures = null;
		this._pictureSourceDenseHi = null;
		this._pictureSourceTexture = null;
*/
App3DR.ProjectManager.View.prototype.loadLowDenseImage = function(callback, context){
	var desiredPixelCount = 400*300;
	var maximumPixelCount = 800*600;
}
App3DR.ProjectManager.View.prototype.loadTexturingImage = function(callback, context){
	var desiredPixelCount = 1600*1200;
	var maximumPixelCount = 1920*1080;
	// 1632x1224
}
App3DR.ProjectManager.View.sortSizeIncreasing = function(a,b){
	var aWidth = a["width"];
	var aHeight = a["height"];
	var bWidth = b["width"];
	var bHeight = b["height"];
	var aSize = aWidth*aHeight;
	var bSize = bWidth*bHeight;
	return aSize < bSize ? -1 : 1;
}
App3DR.ProjectManager.View.prototype.toString = function(){
	return "[View: "+this.id()+"]";
}

// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.Pair = function(manager, directory, viewA, viewB){
	this._manager = manager;
	this._directory = directory;
	this._viewAID = viewA;
	this._viewBID = viewB;
	// MATCHES 2D
	// this._matchFeatureCount = null; // total matched features [above minimum]
	this._matchFeatureCount = null; // total matched features [above minimum]
	this._relativeCount = null;
	// MATCHES - 3D
	this._matchingData = null;
	this._relativeData = null;
	// TRACKS - 3D
	this._trackCount = null;
	this._trackData = null;
	// INFO
	this._F = null;
	this._R = null;
	this._FerrorMean = null;
	this._FerrorSigma = null;
	this._RerrorMean = null;
	this._RerrorSigma = null;
}


App3DR.ProjectManager.Pair.prototype.toString = function(){
	return "[Pair: "+this._viewAID+" : "+this._viewBID+"]";
}
App3DR.ProjectManager.Pair.prototype.viewA = function(){
	return this._manager.viewFromID(this._viewAID);
}
App3DR.ProjectManager.Pair.prototype.viewB = function(){
	return this._manager.viewFromID(this._viewBID);
}
App3DR.ProjectManager.Pair.prototype.directory = function(){
	return this._directory;
}
App3DR.ProjectManager.Pair.prototype.id = function(){
	return this.directory();
}
App3DR.ProjectManager.Pair.prototype.matchingData = function(){
	return this._matchingData;
}
App3DR.ProjectManager.Pair.prototype.relativeData = function(){
	return this._relativeData;
}
App3DR.ProjectManager.Pair.prototype.setMatchFeatureCount = function(count){
	this._matchFeatureCount = count;
}
App3DR.ProjectManager.Pair.prototype.matchFeatureCount = function(count){
	return this._matchFeatureCount;
}
App3DR.ProjectManager.Pair.prototype.setRelativeCount = function(count){
	this._relativeCount = count;
}
App3DR.ProjectManager.Pair.prototype.relativeCount = function(){
	return this._relativeCount;
}
App3DR.ProjectManager.Pair.prototype.setTrackCount = function(count){
	this._trackCount = count;
}
App3DR.ProjectManager.Pair.prototype.trackCount = function(){
	return this._trackCount;
}
App3DR.ProjectManager.Pair.prototype.trackData = function(){
	return this._trackData;
}
App3DR.ProjectManager.Pair.prototype.setF = function(F){
	if(F){
		this._F = F.copy();
	}else{
		this._F = null;
	}
}
App3DR.ProjectManager.Pair.prototype.setR = function(R){
	if(R){
		this._R = R.copy();
	}else{
		this._R = null;
	}
}
App3DR.ProjectManager.Pair.prototype.setFInfo = function(mean,sigma){
	this._FerrorMean = mean;
	this._FerrorSigma = sigma;
}
App3DR.ProjectManager.Pair.prototype.setRInfo = function(mean,sigma){
	this._RerrorMean = mean;
	this._RerrorSigma = sigma;
}
App3DR.ProjectManager.Pair.prototype.errorRMean = function(){
	return this._RerrorMean;
}
App3DR.ProjectManager.Pair.prototype.errorRSigma = function(){
	return this._RerrorSigma;
}
App3DR.ProjectManager.Pair.prototype.errorFMean = function(){
	return this._FerrorMean;
}
App3DR.ProjectManager.Pair.prototype.errorFSigma = function(){
	return this._FerrorSigma;
}
App3DR.ProjectManager.Pair.prototype.R = function(){
	return this._R;
}
App3DR.ProjectManager.Pair.prototype.F = function(){
	return this._F;
}
App3DR.ProjectManager.Pair.prototype.isPair = function(idA,idB){
	if(idA && idB && this._viewAID && this._viewBID){
		if( (idA==this._viewAID && idB==this._viewBID) || (idB==this._viewAID && idA==this._viewBID) ){
			return true;
		}
	}
	return false;
}
App3DR.ProjectManager.Pair.prototype.hasMatch = function(){
	return this._matchFeatureCount !== null && this._matchFeatureCount !== undefined && this._matchFeatureCount >= 0;
}
App3DR.ProjectManager.Pair.prototype.hasRelative = function(){
	return this._relativeCount !== null && this._relativeCount >= 0;
}
App3DR.ProjectManager.Pair.prototype.hasTracks = function(){
	return this._trackCount !== null && this._trackCount >= 0;
}
App3DR.ProjectManager.Pair.prototype.toYAML = function(yaml){
	yaml.writeString("directory", this._directory);
	yaml.writeString("viewA", this._viewAID);
	yaml.writeString("viewB", this._viewBID);
	yaml.writeNumber("featureCount", this._matchFeatureCount);
	yaml.writeNumber("relativeCount", this._relativeCount);
	yaml.writeNumber("trackCount", this._trackCount);
	yaml.writeNumber("errorFMean", this._FerrorMean);
	yaml.writeNumber("errorFSigma", this._FerrorSigma);
	yaml.writeNumber("errorRMean", this._RerrorMean);
	yaml.writeNumber("errorRSigma", this._RerrorSigma);
	var F = this._F;
	if(F){
		yaml.writeObjectStart("F");
			F.toYAML(yaml);
		yaml.writeObjectEnd();
	}else{
		yaml.writeNumber("F", null);
	}
	var R = this._R;
	if(R){
		yaml.writeObjectStart("R");
			R.toYAML(yaml);
		yaml.writeObjectEnd();
	}else{
		yaml.writeNumber("R", null);
	}
}
App3DR.ProjectManager.Pair.prototype.readFromObject = function(object){
	this._directory = object["directory"];
	this._viewAID = object["viewA"];
	this._viewBID = object["viewB"];
	this._matchFeatureCount = object["featureCount"];
	this._relativeCount = Code.valueOrDefault(object["relativeCount"], null);
	this._trackCount = Code.valueOrDefault(object["trackCount"], null);
	this._FerrorMean = Code.valueOrDefault(object["errorFMean"], null);
	this._FerrorSigma = Code.valueOrDefault(object["errorFSigma"], null);
	this._RerrorMean = Code.valueOrDefault(object["errorRMean"], null);
	this._RerrorSigma = Code.valueOrDefault(object["errorRSigma"], null);
	var F = object["F"];
	if(F){
		this._F = Matrix.fromObject(F);
	}else{
		this._F = null;
	}
	var R = object["R"];
	if(R){
		this._R = Matrix.fromObject(R);
	}else{
		this._R = null;
	}
}
App3DR.ProjectManager.Pair.prototype.loadMatchingData = function(callback, context){
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		// ...
	this._manager.loadMatchingDataForPair(this, App3DR.ProjectManager.INITIAL_MATCHES_FILE_NAME, this._loadMatchingDataComplete, this, object);
}
App3DR.ProjectManager.Pair.prototype._loadMatchingDataComplete = function(object, data){
	// TODO: to internal object
	var yamlObject = Code.binaryToYAMLObject(data);
	this._matchingData = yamlObject;
	var callback = object["callback"];
	var context = object["context"];
	if(callback && context){
		callback.call(context, this);
	}
}
App3DR.ProjectManager.Pair.prototype.loadRelativeData = function(callback, context, returnObject){
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this._manager.loadRelativeDataForPair(this, App3DR.ProjectManager.PAIR_RELATIVE_FILE_NAME, this._loadRelativeDataComplete, this, object);
}
App3DR.ProjectManager.Pair.prototype._loadRelativeDataComplete = function(object, data){
	// TODO: to internal object
	var yamlObject = Code.binaryToYAMLObject(data);
	this._relativeData = yamlObject;
	var callback = object["callback"];
	var context = object["context"];
	if(callback && context){
		callback.call(context, this);
	}
}
App3DR.ProjectManager.Pair.prototype.loadTrackData = function(callback, context, returnObject){
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
	this._manager.loadRelativeDataForPair(this, App3DR.ProjectManager.PAIR_TRACKS_FILE_NAME, this._loadTrackDataComplete, this, object);
}
App3DR.ProjectManager.Pair.prototype._loadTrackDataComplete = function(object, data){
	// TODO: to internal object
	var yamlObject = Code.binaryToYAMLObject(data);
	this._trackData = yamlObject;
	var callback = object["callback"];
	var context = object["context"];
	if(callback && context){
		callback.call(context, this);
	}
}


App3DR.ProjectManager.Pair.pairsPassingErrorR = function(pairs,sig){
	sig = sig!==undefined ? sig : 2.0; // 2-3
	var population = [];
	var keep = [];
	var count = 0;
	for(var i=0; i<pairs.length; ++i){
		var pair = pairs[i];
		var relativeCount = pair.relativeCount();
		var featureCount = pair.matchFeatureCount();
		if(relativeCount>0 && featureCount>0){
			var errorR = pair.errorRSigma();
			var averageR = errorR/relativeCount;
			population.push(averageR);
			++count;
			keep.push(pair);
		}
	}
	var min = Code.min(population);
	var sigma = Code.stdDev(population,min);
	var limit = sigma*sig;
	for(var i=0; i<keep.length; ++i){
		var pair = keep[i];
		var pop = population[i];
		if(pop>limit){
			Code.removeElementAt(keep,i);
			Code.removeElementAt(population,i);
			--i;
		}
	}
	return keep;
}

// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.Triple = function(manager, directory, viewA, viewB, viewC){
	this._manager = manager;
	this._directory = directory;
	this._viewAID = viewA;
	this._viewBID = viewB;
	this._viewCID = viewC;
	this._relativeScales = null;
	// MATCHING - 2D -- not used
	// RELATIVE - 3D
	this._relativeCount = null;
	this._relativeData = null;
	this._TFT = null;
	this._TFTerrorMean = null;
	this._TFTerrorSigma = null;
	// // TRACKS - 3D
	// this._trackCount = null;
	// this._trackData = null;
}
App3DR.ProjectManager.Triple.prototype.toString = function(){
	return "[Triple: "+this._viewAID+" : "+this._viewBID+" : "+this._viewCID+"]";
}
App3DR.ProjectManager.Triple.prototype.viewA = function(){
	return this._manager.viewFromID(this._viewAID);
}
App3DR.ProjectManager.Triple.prototype.viewB = function(){
	return this._manager.viewFromID(this._viewBID);
}
App3DR.ProjectManager.Triple.prototype.viewC = function(){
	return this._manager.viewFromID(this._viewCID);
}
App3DR.ProjectManager.Triple.prototype.directory = function(){
	return this._directory;
}
App3DR.ProjectManager.Triple.prototype.id = function(){
	return this.directory();
}
App3DR.ProjectManager.Triple.prototype.setRelativeCount = function(count){
	this._relativeCount = count;
}
App3DR.ProjectManager.Triple.prototype.relativeCount = function(count){
	return this._relativeCount;
}
App3DR.ProjectManager.Triple.prototype.setRelativeScales = function(scaleAB,scaleAC,scaleBC){
	this._relativeScales = {"AB":scaleAB, "AC":scaleAC, "BC":scaleBC};
}
App3DR.ProjectManager.Triple.prototype.relativeScales = function(){
	return this._relativeScales;
}
App3DR.ProjectManager.Triple.prototype.setTFT = function(TFT){
	if(TFT){
		this._TFT = TFT.copy();
	}else{
		this._TFT = null;
	}
}
App3DR.ProjectManager.Triple.prototype.setTFTInfo = function(mean,sigma){
	this._TFTerrorMean = mean;
	this._TFTerrorSigma = sigma;
}
App3DR.ProjectManager.Triple.prototype.setRelativeTransforms = function(transforms){
	this._relativeTransforms = transforms;
}
App3DR.ProjectManager.Triple.prototype.isTriple = function(idA,idB,idC){
	if(idA && idB && idC && this._viewAID && this._viewBID && this._viewCID){
		if( (idA==this._viewAID && idB==this._viewBID && idC==this._viewCID) ||
			(idB==this._viewAID && idA==this._viewBID && idC==this._viewCID) ||
			(idA==this._viewAID && idC==this._viewBID && idB==this._viewCID) ||
			(idC==this._viewAID && idA==this._viewBID && idB==this._viewCID) ||
			(idB==this._viewAID && idC==this._viewBID && idA==this._viewCID) ||
			(idC==this._viewAID && idB==this._viewBID && idA==this._viewCID)
			){
			return true;
		}
	}
	return false;
}
App3DR.ProjectManager.Triple.prototype.hasMatch = function(){
	return this._matchFeatureCount != null || this._matchFeatureCount >= 0;
}
App3DR.ProjectManager.Triple.prototype.hasRelative = function(){
	return this._relativeCount !== null && this._relativeCount >= 0;
}
App3DR.ProjectManager.Triple.prototype.toYAML = function(yaml){
	yaml.writeString("directory", this._directory);
	yaml.writeString("viewA", this._viewAID);
	yaml.writeString("viewB", this._viewBID);
	yaml.writeString("viewC", this._viewCID);
	// yaml.writeNumber("featureCount", this._matchFeatureCount);
	yaml.writeNumber("relativeCount", this._relativeCount);
	var gauge = this._relativeScales;
	if(gauge){
		yaml.writeObjectStart("gauge");
			yaml.writeNumber("AB", gauge["AB"]);
			yaml.writeNumber("AC", gauge["AC"]);
			yaml.writeNumber("BC", gauge["BC"]);
		yaml.writeObjectEnd();
	}else{
		yaml.writeNumber("gauge", null);
	}
	yaml.writeNumber("errorTMean", this._TFTerrorMean);
	yaml.writeNumber("errorTSigma", this._TFTerrorSigma);
	var T = this._TFT;
	if(T){
		yaml.writeObjectStart("T");
			T.toYAML(yaml);
		yaml.writeObjectEnd();
	}else{
		yaml.writeNumber("T", null);
	}
	// yaml.writeBlank();
	var trans = this._relativeTransforms
	if(trans){
		yaml.writeArrayLiteral("relative", trans);
	}else{
		yaml.writeNull("relative", null);
	}
}
App3DR.ProjectManager.Triple.prototype.readFromObject = function(object){
	this._directory = object["directory"];
	this._viewAID = object["viewA"];
	this._viewBID = object["viewB"];
	this._viewCID = object["viewC"];
	// this._matchFeatureCount = object["featureCount"];
	this._relativeCount = object["relativeCount"];
	this._relativeScales = object["gauge"];
	this._TFTerrorMean = object["errorTMean"];
	this._TFTerrorSigma = object["errorTSigma"];
	var T = object["T"];
	if(T){
		this._TFT = Tensor.fromObject(T);
	}else{
		this._TFT = null;
	}
	var relative = Code.valueOrDefault(object["relative"], []);;
	this._relativeTransforms = relative;
	for(var i=0; i<relative.length; ++i){
		var F = relative[i]["F"];
		if(F){
			relative[i]["F"] = new Matrix().fromObject(F);
		}
		var R = relative[i]["R"];
		if(R){
			relative[i]["R"] = new Matrix().fromObject(R);
		}
	}
}
App3DR.ProjectManager.Triple.prototype.loadMatchingData = function(callback, context){
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		// ...
	this._manager.loadMatchingDataForTriple(this, App3DR.ProjectManager.TRIPLE_MATCHES_FILE_NAME, this._loadMatchingDataComplete, this, object);
}
App3DR.ProjectManager.Triple.prototype._loadMatchingDataComplete = function(object, data){
	if(data){
		var yamlObject = Code.binaryToYAMLObject(data);
		console.log(yamlObject);
		this._matchingData = yamlObject;
	}
	var callback = object["callback"];
	var context = object["context"];
	if(callback && context){
		callback.call(context, this);
	}
}
// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.Camera = function(manager, name, directory){
	this._manager = manager;
	this._directory = directory;
	this._title = name;
	this._K = null; // calculated camera matrix
	this._calculatedCount = 0; // number of images used to calculate
	this._distortion = null; // calculated distortions
	this._images = []; // calibration images
	this._pointsData = null; // calculated image checkerboard points 2D/3D match
	this._temp = null;
}
App3DR.ProjectManager.Camera.prototype.directory = function(){
	return this._directory;
}
App3DR.ProjectManager.Camera.prototype.id = function(){
	return this.directory();
}
App3DR.ProjectManager.Camera.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
App3DR.ProjectManager.Camera.prototype.images = function(){
	return this._images;
}
App3DR.ProjectManager.Camera.prototype.needsDetectionImage = function(){
	var i;
	for(i=0; i<this._images.length; ++i){
		var image = this._images[i];
		var hasMatches = image.hasMatches();
		if(!hasMatches){
			return image;
		}
	}
	return null;
}
App3DR.ProjectManager.Camera.prototype.needsDetection = function(){
	var image = this.needsDetectionImage();
	return image!==null;
}
App3DR.ProjectManager.Camera.prototype.needsCalculation = function(){
// return true;
	var imageCount = this.imageCount();
	var calculated = this._calculatedCount;
	if(imageCount>=3 && calculated!=imageCount){ // at least 3 images, and not calculated with same count
		return true;
	}
	return false;
}
App3DR.ProjectManager.Camera.prototype.imageCount = function(){
	return this._images.length;
}
App3DR.ProjectManager.Camera.prototype._uniqueImageID = function(){
	return App3DR.ProjectManager._uniqueArrayItemID( this._images, function(c){ return c.id(); } );
}
App3DR.ProjectManager.Camera.prototype.newCalibrationImage = function(){
	var directory = this._uniqueImageID();
	var image = new App3DR.ProjectManager.Camera.CalibrationImage(this, directory);
	this._images.push(image);
	return image;
}
App3DR.ProjectManager.Camera.prototype.setCalculatedCount = function(count){
	this._calculatedCount = count;
}
App3DR.ProjectManager.Camera.prototype.setDistortion = function(k1,k2,k3,p1,p2){
	distortion = {};
	distortion["k1"] = k1;
	distortion["k2"] = k2;
	distortion["k3"] = k3;
	distortion["p1"] = p1;
	distortion["p2"] = p2;
	this._distortion = distortion;
	return this._distortion;
}
App3DR.ProjectManager.Camera.prototype.distortion = function(){
	var distortion = null;
	if(this._K){
		distortion = {};
		distortion["k1"] = this._distortion["k1"];
		distortion["k2"] = this._distortion["k2"];
		distortion["k3"] = this._distortion["k3"];
		distortion["p1"] = this._distortion["p1"];
		distortion["p2"] = this._distortion["p2"];
	}
	return distortion;
}
App3DR.ProjectManager.Camera.prototype.setK = function(fx,fy,s,cx,cy){
	K = {};
	K["fx"] = fx;
	K["fy"] = fy;
	K["s"] = s;
	K["cx"] = cx;
	K["cy"] = cy;
	this._K = K;
	return this._K;
}
App3DR.ProjectManager.Camera.prototype.K = function(){
	var K = null;
	if(this._K){
		K = {};
		K["fx"] = this._K["fx"];
		K["fy"] = this._K["fy"];
		K["s"] = this._K["s"];
		K["cx"] = this._K["cx"];
		K["cy"] = this._K["cy"];
	}
	return K;
}

App3DR.ProjectManager.Camera.prototype.toYAML = function(yaml){
	var i, j, len;
	yaml.writeString("directory", this._directory);
	yaml.writeString("title", this._title);
	yaml.writeNumber("calculatedCount", this._calculatedCount);
	// K
	if(this._K){
		var K = this._K;
		yaml.writeObjectStart("K");
			yaml.writeNumber("fx", K["fx"]);
			yaml.writeNumber("fy", K["fy"]);
			yaml.writeNumber("s",  K["s"]);
			yaml.writeNumber("cx", K["cx"]);
			yaml.writeNumber("cy", K["cy"]);
		yaml.writeObjectEnd();
	}
	// distortions
	if(this._distortion){
		var d = this._distortion;
		yaml.writeObjectStart("distortion");
			yaml.writeNumber("k1", d["k1"]);
			yaml.writeNumber("k2", d["k2"]);
			yaml.writeNumber("k3", d["k3"]);
			yaml.writeNumber("p1", d["p1"]);
			yaml.writeNumber("p2", d["p2"]);
		yaml.writeObjectEnd();
	}
	// images
	len = this._images ? this._images.length : 0;
	yaml.writeArrayStart("images");
	for(i=0; i<len; ++i){
		var image = this._images[i];
		yaml.writeObjectStart();
			image.toYAML(yaml);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
}
App3DR.ProjectManager.Camera.prototype.readFromObject = function(object){
	console.log("READ CAMERA FROM OBJECT");
	var directory = object["directory"];
	var title = object["title"];
	var images = object["images"];
	var K = object["K"];
	var distortion = object["distortion"];
	this._directory = directory;
	this._title = title;
	this._calculatedCount = object["calculatedCount"];
	if(!this._calculatedCount){
		this._calculatedCount = 0;
	}
	// images
	this._images = [];
	if(images){
		for(var i=0; i<images.length; ++i){
			var o = images[i];
			var image = new App3DR.ProjectManager.Camera.CalibrationImage(this);
			image.readFromObject(o);
			this._images.push(image);
		}
	}
	//
	this._K = null;
	if(K){
		var fx = K["fx"];
		var fy = K["fy"];
		var s = K["s"];
		var cx = K["cx"];
		var cy = K["cy"];
		this._K = {"fx":fx, "fy":fy, "s":s, "cx":cx, "cy":cy};
	}
	this._distortions = null;
	if(distortion){
		var k1 = distortion["k1"];
		var k2 = distortion["k2"];
		var k3 = distortion["k3"];
		var p1 = distortion["p1"];
		var p2 = distortion["p2"];
		this._distortion = {"k1":k1, "k2":k2, "k3":k3, "p1":p1, "p2":p2};
	}
}

App3DR.ProjectManager.Camera.CalibrationImage = function(camera, directory){
	this._camera = camera;
	this._directory = directory;
	this._pictureInfo = [];
	this._widthToHeightRatio = null;
	this._matchesCount = null;
	this._calibrationData = null;
	self._calibrationImage = null;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.directory = function(){
	return this._directory;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.id = function(){
	return this.directory();
}

App3DR.ProjectManager.Camera.CalibrationImage.prototype.aspectRatio = function(r){
	if(r!==undefined){
		this._widthToHeightRatio = r;
	}
	return this._widthToHeightRatio;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.manager = function(){
	return this._camera._manager;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.hasMatches = function(){
	return this._matchesCount!==null && this._matchesCount > 0;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.calibrationImage = function(){
	return this._calibrationImage;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.calibrationData = function(){
	return this._calibrationData;
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.readFromObject = function(object){
	var pictures = object["pictures"];
	var directory = object["directory"];
	var matches = object["matches"];
	var aspectRatio = object["aspectRatio"];
	this._directory = directory;
	this._widthToHeightRatio = aspectRatio;
	this._matchesCount = (matches!==undefined && matches!==null) ? matches : null;
	this._pictureInfo = [];
	// pictures
	if(pictures){
		for(var i=0; i<pictures.length; ++i){
			var o = pictures[i];
			var picture = {};
				picture["file"] = o["file"];
				picture["width"] = o["width"];
				picture["height"] = o["height"];
				picture["scale"] = o["scale"];
			this._pictureInfo.push(picture);
		}
	}
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.toYAML = function(yaml){
	var i, len;
	yaml.writeString("directory", this._directory);
	yaml.writeNumber("matches", this._matchesCount);
	yaml.writeNumber("aspectRatio", this._widthToHeightRatio);
	// pictures
	len = this._pictureInfo ? this._pictureInfo.length : 0;
	yaml.writeArrayStart("pictures");
	for(i=0; i<len; ++i){
		var picture = this._pictureInfo[i];
		yaml.writeObjectStart();
			yaml.writeString("file", picture["file"]);
			yaml.writeNumber("width", picture["width"]);
			yaml.writeNumber("height", picture["height"]);
			yaml.writeNumber("scale", picture["scale"]);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.addPicture = function(size, scale, binary,  callback, context, returnObject){
	var filename = (scale*100.0)+"."+"png";
	var object = {};
		object["size"] = size;
		object["scale"] = scale;
		object["binary"] = binary;
		object["filename"] = filename;
		object["callback"] = callback;
		object["context"] = context;
		object["object"] = returnObject;
	var path = Code.appendToPath(this.directory(), filename);
	var info = this.manager().addPictureForCamera(this._camera, path, size, scale, binary, this._callbackAddPicture, this, object);
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype._callbackAddPicture = function(object, data){
	console.log("add picture callback");
	console.log(object);
	var callback = object["callback"];
	var context = object["context"];
	var returnObject = object["object"];
	var size = object["size"];
	var scale = object["scale"];
	var filename = object["filename"];
		var picture = {};
		picture["file"] = filename;
		picture["scale"] = scale;
		picture["width"] = size.x;
		picture["height"] = size.y;
	this._pictureInfo.push(picture);
	callback.call(context, this, returnObject);
}


App3DR.ProjectManager.Camera.CalibrationImage.prototype.setCheckerboardMatches = function(points2D, points3D,  callback, context){
	var count = points2D.length;
	this._matchesCount = count;
	console.log("NEW COUNT: "+count);
	var modified = Code.getTimeStampFromMilliseconds();
	var yaml = new YAML();
	yaml.writeComment("3DR Calibration File 0");
	yaml.writeBlank();
	yaml.writeString("camera", this._camera.id());
	yaml.writeString("image", this.id());
	yaml.writeString("created", modified);
	yaml.writeString("modified", modified);
	yaml.writeBlank();
	yaml.writeNumber("count", count);
	if(count>0){
		yaml.writeArrayStart("matches");
		for(var i=0; i<count; ++i){
			var point2D = points2D[i];
			var point3D = points3D[i];
			yaml.writeObjectStart();
				yaml.writeNumber("x", point2D.x);
				yaml.writeNumber("y", point2D.y);
				yaml.writeNumber("X", point3D.x);
				yaml.writeNumber("Y", point3D.y);
				yaml.writeNumber("Z", point3D.z);
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	yaml.writeBlank();

	var str = yaml.toString();
	var binary = Code.stringToBinary(str);
	yamlBinary = binary;

	var path = Code.appendToPath(this.directory(), App3DR.ProjectManager.CAMERA_MATCHES_FILE_NAME);

	var object = {};
	object["context"] = context;
	object["callback"] = callback;

	this.manager().addMatchesForCamera(this._camera, path, yamlBinary, this._setCheckerboardMatchesComplete, this, object);
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype._setCheckerboardMatchesComplete = function(object, data){
	var callback = object["callback"];
	var context = object["context"];
	if(callback && context){
		callback.call(context, self);
	}
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype.loadCalibrationImage = function(callback, context){
	// var desiredPixelCount = 1600*1200;
	// var maximumPixelCount = 1920*1080;
	var desiredPixelCount = 800*600;
	var maximumPixelCount = 1024*800;
	var closest = App3DR.ProjectManager._closestPictureSize(this._pictureInfo, desiredPixelCount, maximumPixelCount);
	console.log(closest);
	if(closest){
		var filename = closest["file"];
		var object = {};
		//object["size"] = size;
		//object["filename"] = filename;
		object["context"] = context;
		object["callback"] = callback;
		var path = Code.appendToPath(this.directory(), filename);
		this.manager().loadImageForCamera(this._camera, path, this._loadCalibrationImageComplete, this, object);
	}
}
App3DR.ProjectManager.Camera.CalibrationImage.prototype._loadCalibrationImageComplete = function(object, data){
	console.log("_loadCalibrationImageComplete");
	var callback = object["callback"];
	var context = object["context"];
	var binary = data;
	var filetype = "png";
	var base64 = Code.arrayBufferToBase64(binary);
	var imageSrc = Code.appendHeaderBase64(base64, filetype);
	var image = new Image();

	var self = this;
	image.onload = function(e){
		self._calibrationImage = image;
		if(callback && context){
			callback.call(context, self);
		}
	}
	image.src = imageSrc;
}

App3DR.ProjectManager.Camera.CalibrationImage.prototype.loadCalibratationData = function(callback, context){
	var object = {};
		object["context"] = context;
		object["callback"] = callback;
	var path = Code.appendToPath(this.directory(), App3DR.ProjectManager.CAMERA_MATCHES_FILE_NAME);
	this.manager().loadCalibrationDataForCamera(this._camera, path, this._loadCalibratationDataComplete, this, object);
}

App3DR.ProjectManager.Camera.CalibrationImage.prototype._loadCalibratationDataComplete = function(object, data){
	var str = Code.binaryToString(data);
	var yaml = YAML.parse(str);
	this._calibrationData = yaml;
	if(object){
		var callback = object["callback"];
		var context = object["context"];
		if(callback && context){
			callback.call(context, self);
		}
	}
}

// sparse approximation | estimate | combine | merge
App3DR.ProjectManager.BundleAdjustment = function(directory){
	this._x;
}

// 3D-triangle-model | textures |
App3DR.ProjectManager.Reconstruction = function(directory){
	this._x;
}

// camera | background | filtered-textures |
App3DR.ProjectManager.Scene = function(name, directory){
	this._x;
}


App3DR.ProjectManager._closestPictureSize = function(pictures, desiredPixelCount, maximumPixelCount){
	var closestPicture = -1;
	var currentPixels = 0;
	for(i=0; i<pictures.length; ++i){
		var picture = pictures[i];
		var width = picture["width"];
		var height = picture["height"];
		var pixels = width*height;
		if(pixels<=maximumPixelCount && pixels>currentPixels){
			closestPicture = i;
			currentPixels = pixels;
		}
	}
	if(closestPicture<0){
		closestPicture = 0;
	}
	return pictures[closestPicture];
}





App3DR.ProjectManager.prototype.testData = function(world){//, completeFxn, completeContext){
	console.log("testData");
	var points3D = [];
	// var siz = new V3D(8,8,0.0);
	// var off = new V3D(-0.5,-0.5,-0.5 - 10);
	// for(var i=0; i<200; ++i){
	// 	var point = new V3D(Math.random()*siz.x+off.x, Math.random()*siz.y+off.y, Math.random()*siz.z+off.z);
	// 	points3D.push(point);
	// }
	// var count = 10;
	// var sca = 0.25;
	// for(var i=0; i<=count; ++i){
	// 	for(var j=0; j<=count; ++j){
	// 		var point = new V3D((i - count*0.5)*sca, (j - count*0.5)*sca, -20 + Math.random()*5);
	// 		points3D.push(point);
	// 	}
	// }
	var tris3D = Code.generateTri3DHemisphere(0,0,-25, 5, 8,8, Math.PI);
	// console.log(tris3D);
	for(var i=0; i<tris3D.length; ++i){
		var tri = tris3D[i];
		// console.log(tri);
		var point = tri.center();
		points3D.push(point);
	}
	console.log(points3D);


	points3D.push(new V3D(0,10, -20));
	points3D.push(new V3D(5,5, -20));
	points3D.push(new V3D(-5,-5, -20));
	points3D.push(new V3D(2,6, -19));
	points3D.push(new V3D(-1,-6, -18));
	points3D.push(new V3D(8,8, -24));
	// throw "?";
	// points3D = Code.generatePoints3DHemisphere(0,0,-20, 5);


	var fx = 1.0;
	var fy = 1.0;
	var s = 0;
	var cx = 0.5;
	var cy = 0.5;
	var distortion = null;
	var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
	var Kinv = Matrix.inverse(K);
	var camera = world.addCamera(K, distortion);
	// var views = [];
var v = ["R04ZYF8K","UB2GL8EB","9I774XQV"];
// R04ZYF8K
// UB2GL8EB
// 9I774XQV
	var imageSize = new V2D(400,300);
	for(var i=0; i<4; ++i){
	// for(var i=0; i<3; ++i){
	// for(var i=0; i<2; ++i){
		var matrix = new ImageMat(imageSize.x,imageSize.y);
		var view = world.addView(matrix, camera, v[i%v.length]);
		// views.push(view);
		if(i==0){
			var mat = new Matrix(4,4).identity();
			view.absoluteTransform(mat);
		}else if(i==1){
			var mat = new Matrix(4,4).identity();
				mat = Matrix.transform3DTranslate(mat, 1,0,0);
				mat = Matrix.transform3DRotateY(mat, Code.radians(10.0));
			view.absoluteTransform(mat);
		}else if(i==2){
			var mat = new Matrix(4,4).identity();
				mat = Matrix.transform3DTranslate(mat, -1,0,0);
				mat = Matrix.transform3DRotateY(mat, Code.radians(-10.0));
			view.absoluteTransform(mat);
		}else if(i==3){
			var mat = new Matrix(4,4).identity();
				mat = Matrix.transform3DTranslate(mat, -2,0,0);
				mat = Matrix.transform3DRotateY(mat, Code.radians(20.0));
			view.absoluteTransform(mat);
		}
	}

	var transforms = world.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var absA = viewA.absoluteTransform();
		var absB = viewB.absoluteTransform();
		var Kab = viewA.K();
		var KabInv = viewA.Kinv();
		// console.log("A:\n"+absA);
		// console.log("B:\n"+absB);
		// YES
		// var invA = Matrix.inverse(absA);
		// var transAB = Matrix.mult(absB,invA);
		//transform.R(viewA,viewB,transAB);

		var invB = Matrix.inverse(absB);
		var transBA = Matrix.mult(absA,invB);
		transform.R(viewA,viewB,transBA);
		// var transBA = Matrix.inverse(transAB);
		// var transBA = R3D.inverseCameraMatrix(transAB);
		//transform.R(viewA,viewB,transAB);


		var Fab = R3D.fundamentalFromCamera(transBA, Kab, KabInv);
		transform.F(viewA,viewB,Fab);

// var Fab = R3D.fundamentalFromCamera(transAB, Kab, KabInv);
// Fab = R3D.fundamentalInverse(Fab);
// transform.F(viewA,viewB,Fab);

	}
	var views = world.toViewArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		for(var j=0; j<views.length; ++j){
			var viewA = views[j];
			var absA = viewA.absoluteTransform();
			var invA = Matrix.inverse(absA);
			var Ka = viewA.K();
			var KaInv = viewA.Kinv();
			for(var k=j+1; k<views.length; ++k){
				var viewB = views[k];
				var absB = viewB.absoluteTransform();
				var invB = Matrix.inverse(absB);
				var Kb = viewB.K();
				var KbInv = viewB.Kinv();
				// var transform = world.transformFromViews(viewA,viewB);
				// var R = transform.R(viewA,viewB);
				// inv_i(p_abs) = p_i
				// var estimated3D = absA.multV3DtoV3D(point3D); // in view A
				// console.log("estimated3D: "+estimated3D);
				// console.log(R+"");
				// var point2DA = viewA.projectPoint3D(point3D);
				// var point2DB = viewB.projectPoint3D(point3D);

				// var cameraA = absA;
				// var cameraB = absB;
				// var cameraA = invA;
				// var cameraB = invB;

				// var point2DA = R3D.projectPoint3DToCamera2DForward(point3D, absA, Ka, null);
				// var point2DB = R3D.projectPoint3DToCamera2DForward(point3D, absB, Kb, null);
				var point2DA = R3D.projectPoint3DToCamera2DForward(point3D, invA, Ka, null);
				var point2DB = R3D.projectPoint3DToCamera2DForward(point3D, invB, Kb, null);

	// 			var K = this._K;
	// var distortions = null;
	// var absoluteTransform = this._absoluteTransform;
	// var projected2D = R3D.projectPoint3DToCamera2DForward(estimated3D, absoluteTransform, K, distortions);
	// return projected2D;

				// var fr = new V2D();
				// var to = new V2D();
				var fr = point2DA;
				var to = point2DB;
				// console.log(point2DA+" & "+point2DB);
				var scaleAB = 1.0;
				var angleAB = 0.0;
				var match = world.addMatchForViews(viewA,fr, viewB,to, scaleAB,angleAB, true);

				//
				// var cameraA = viewA.absoluteTransform();
				// var cameraB = viewB.absoluteTransform();
				// var cameraA = new Matrix(4,4).identity();
				// var cameraB = R;

				var pA = fr;
				var pB = to;
				//var estimated3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
				// var estimated3D = R3D.triangulatePointDLT(pA,pB, invA,invB, KaInv, KbInv);
				var estimated3D = null;
				// console.log("          ..."+estimated3D+" =?= "+point3D);
				var midpoint3D = R3D.triangulatePointMidpoint(pA,pB, absA,absB, KaInv, KbInv);
				if(!estimated3D){
					estimated3D = midpoint3D;
				}
// var error = R3D.reprojectionError(estimated3D, pA,pB, invA, invB, Ka, Kb);
// console.log(". error"+error["error"]);
// fr,to, cameraAInv,cameraBInv, KaInv, KbInv

				//R3D.projectPoint2DToCamera3DRay(in2D, extrinsic, Kinv, distortions){
					// var cameraBInv = R3D.inverseCameraMatrix(cameraB);

					var rayA = R3D.projectPoint2DToCamera3DRay(pA, absA, KaInv, null);
					var rayB = R3D.projectPoint2DToCamera3DRay(pB, absB, KbInv, null);
					// var rayA = R3D.projectPoint2DToCamera3DRay(point2DA, invA, KaInv, null);
					// var rayB = R3D.projectPoint2DToCamera3DRay(point2DB, invB, KbInv, null);

					// var rayB = R3D.projectPoint2DToCamera3DRay(pB, cameraBInv, KbInv, null);
					//console.log(rayA,rayB);
					var closest = Code.closestPointsLines3D(rayA["o"],rayA["d"], rayB["o"],rayB["d"]);
					var avg = V3D.avg(closest[0],closest[1]);
					// console.log(avg+"");
					// console.log(avg.x/point3D.x,avg.y/point3D.y,avg.z/point3D.z);

var distance3D = V3D.distance(estimated3D,point3D);
if(distance3D>1.0){
	console.log(closest)
	console.log(" point2DA: "+point2DA);
	console.log(" point2DB: "+point2DB);
	console.log(" point3D: "+point3D);
	console.log(" midpoint3D: "+midpoint3D);
	console.log(" estimated3D: "+estimated3D);

	// console.log(" 2: "+R3D.triangulatePointDLT(pA,pB, cameraA,cameraBInv, KaInv, KbInv));
	// throw "not match";
}
// triangulatePointDLT
				// console.log(match);
				// match.estimated3D(estimated3D);
			}
		}
	}
	/*
	var transforms = world.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		console.log(matches);
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];

		}
	}
	console.log("....");
	world.estimate3DPoints();
	*/

	console.log("....");
	// world.estimate3DErrors(true);
	world.estimate3DErrors();
	// world.estimate3DViews();
	world.estimate3DPoints();


	// world.filterGlobal();
	world.bundleAdjust();

// throw "??";
	// this.estimate3DErrors();
	// this.estimate3DViews();
	// this.estimate3DPoints();
	//Stereopsis.World.prototype.addMatchForViews = function(viewA,pointA, viewB,pointB, scaleAtoB, angleAtoB){
	//

	// WHEN DONE
	// var completeFxn = function(){
	var str = world.toYAMLString();
	this.bundleFilename(App3DR.ProjectManager.BUNDLE_INFO_FILE_NAME);
	this.saveBundleAdjust(str, null, this);
	this.saveProjectFile();
	// }

	//world.solve(completeFxn, this);
	// completeFxn.call(this);

}
