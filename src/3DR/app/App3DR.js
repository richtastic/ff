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
	
	
	var projectManager = new App3DR.ProjectManager("/projects/0", this._stage);
	console.log(projectManager);
	this._projectManager = projectManager;
	// this._projectManager = new App3DR.ProjectManager("/projects/0");
	this._projectManager.startBackgroundTasks();
	// this._projectManager


	var fxn = function(){
		console.log("resources loaded");
	}
	var resource = new App3DR.Resource(fxn);
	resource.load();
	
	this._resource = resource;



	// this._projectManager

	// this._activeView = this._projectManager.views()[0];
	// console.log(this._activeView);


var app = new App3DR.App.ImageEditor(this._resource);
this.setupAppActive(app);
// app.setActiveImage(null);
// app.setActiveMask(null);

this._imageEditor = app;
app.addFunction(App3DR.App.ImageEditor.EVENT_MASK_UPDATE, this._handleImageEditorMaskUpdate, this);
this._setupImageEditorProjectManager();


	
// var app = new App3DR.App.ImageUploader(this._resource, this._projectManager);
// this.setupAppActive(app);
	
	
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._keyboard.addListeners();


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

App3DR.prototype._setupImageEditorProjectManager = function(){
	var manager = this._projectManager;
	if(manager.isLoaded()){
		
		var views = manager.views();
		console.log("is loaded: "+views.length);
		if(views.length>0){
			//var view = views[0];
			var view = views[1];
			this._activeView = view;
			var app = this._imageEditor;
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
				console.log(features);
				var expanded = [];
				var img = view.featuresImage();
				var width = img.width;
				var height = img.height;
				for(var i=0; i<features.length; ++i){
					var f = features[i];
					var p = new V3D();
					p.x = f.x * width;
					p.y = f.y * height;
					p.z = f.z * width;
					expanded.push(p);
				}
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

App3DR.App.ImageUploader = function(resource, manager){
	App3DR.App.ImageUploader._.constructor.call(this, resource, manager);

	var client = new ClientFile();
	this._clientFile = client;
	
	//this._fileQueue = new PriorityQueue();
	this._fileQueue = [];
	this._processingFile = null;
	// this._pictureQueue = [];
	// this._processingPicture = null;
	// this._viewQueue = [];
	// this._processingView = null;

	this._displayDropArea = new DO();

	this._root.addChild(this._displayDropArea);

	var d;

	var domUploadDiv = Code.newDiv();
		Code.setStylePosition(domUploadDiv, "absolute");
		//Code.setStyleBackgroundColor(domUploadDiv, Code.getJSColorFromARGB(0x9900FF00));
		Code.setStyleBackgroundColor(domUploadDiv, Code.getJSColorFromARGB(0x00000000));
	this._domUploadDiv = domUploadDiv;
	var body = Code.getBody();
		//Code.addChild(domUploadDiv, body);
		Code.addChild(body, domUploadDiv);

		// LISTNERS
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
	DO.pointLocalDown(topLeftRoot,topLeftMe,this._displayDropArea,null);//this._root);
	
	var topLeft = topLeftRoot.copy().scale(-1).scale(downScale);
	var divSize = size.copy().scale(downScale);

	d = this._domUploadDiv;
	Code.setStylePadding(d, "0px");
	Code.setStyleMargin(d, "0px");
	Code.setStyleLeft(d, topLeft.x+"px");
	Code.setStyleTop(d, topLeft.y+"0px");
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
			this._addFileToQueue(file);
		}
	}
}
App3DR.App.ImageUploader.prototype.isBusy = function(){
	var val = this._processingFile; // || this._processingPicture || this._processingView;
	return val!=null;
}

App3DR.App.ImageUploader.prototype._addFileToQueue = function(file){
	console.log("_checkFileQueue");
	this._fileQueue.push(file);
	this._checkFileQueue();
}
App3DR.App.ImageUploader.prototype._checkFileQueue = function(){
	console.log("_checkFileQueue");
	if(this.isBusy()){
		return;
	}
	if(this._fileQueue.length==0){
		return;
	}
	this._processingFile = this._fileQueue.shift();
	this._processCurrentFile();
}
App3DR.App.ImageUploader.prototype._processCurrentFile = function(){
	console.log("_processCurrentFile");
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
/*
	file
		new view
			new picture
			new picture
			new picture
			...
	file
		new view
			...
*/
App3DR.App.ImageUploader.prototype._processPictures = function(image, extension, sizes){
	var canvas = this._canvas;
	var stage = this._stage;
	var client = this._clientFile;
	console.log("_processPictures");
	var self = this;

var viewReady = function(view){
	console.log("view ready");
	console.log(arguments);
	console.log(view);
	var i;
	var pictureList = [];
	var d = new DOImage(image);
	for(i=0; i<sizes.length; ++i){
		size = sizes[i];
		var width = size.x;
		var height = size.y;
		var scale = size.z;
			d.matrix().identity();
			d.matrix().scale(scale);
		var img2 = stage.renderImage(width,height,d, null);
//		Code.addChild(Code.getBody(), img2);
		var imageBase64 = img2.src;
		var imageBinary = Code.base64StringToBinary(imageBase64);
var w = img2.width;
var h = img2.height;
console.log(w+"x"+h+" | "+size+" ? ");

		var filename = (scale*100)+""+"."+extension; // Math.round
		console.log(filename+" ... <");
		var object = {};
			object["filename"] = filename;
			object["size"] = size;
			object["binary"] = imageBinary;
			object["scale"] = scale;
			object["view"] = view;
		pictureList.push(object);
	}
	self._uploadedViewPicture(view, pictureList);
	// function(size, scale, binary,  callback, context){
	//this._processingFile = null;
	//this._checkFileQueue();
}
this._projectManager.addView(viewReady, viewReady, this);
}
App3DR.App.ImageUploader.prototype._uploadedViewPicture = function(view, pictureList){
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
/*
App3DR.App.ImageUploader.prototype.uploadFile = function(file){
	var filename = file.name;
	var filetype = file.type;
	var reader = new FileReader();
	var canvas = this._canvas;
	var stage = this._stage;
	var root = this._root;
	var client = this._clientFile;

	reader.onload = function(progressEvent){
		//console.log(progressEvent)
		var binary = reader.result;
		if(binary){
			
			var base64 = Code.arrayBufferToBase64(binary);
			//console.log(base64);
			//var data = Code.base64StringToBinary(base64);
			//data = [data];
			//var type = "image/png";
			//var blob = new Blob(data,{"type":type});
			//var url = window.URL.createObjectURL(blob);
			var src = "data:image/png;base64,"+base64;
			var image = new Image();
			image.onload = function(e){
				console.log(e);
//				console.log(image);
//				Code.addChild(Code.getBody(), image);
				var width = image.width;
				var height = image.height;
				var scale = 1.0;
				console.log(width+"x"+height);
				var widScale = width*scale;
				var heiScale = height*scale;
				var d = new DOImage(image);
					d.matrix().scale(scale);
				console.log(stage);
				console.log(canvas.presentationScale());
				var img2 = stage.renderImage(widScale,heiScale,d, null);
//				console.log(img2);
				//Code.addChild(Code.getBody(), img2);
				var imageBase64 = img2.src;
				var imageBinary = Code.base64StringToBinary(imageBase64);
				client.set("p100.png", imageBinary);
//root.addChild(d);

				client
			}
			//image.src = url;
			image.src = src;
		}
      };
	reader.readAsArrayBuffer(file);
}
*/
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
		siz = Math.min(size.x,size.y);
		size.set(siz,siz);
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
	var maxCount = 500;
	if(features.length>maxCount){
		features = Code.copyArray(features, 0,maxCount-1);
	}
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
//	console.log("RENDER");
	var canvas = this._canvas;
	var size = this.size();
	// var size = canvas.size();
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
//d.newGraphicsIntersection();
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
	this._root.mask(true);

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
			d.graphics().setLine(line,0xFFFF00FF);
			d.graphics().setFill(0x22FF00FF);



		// TODO: GET FEATURES ONLY INSIDE LOCAL WINDOW:
			// origin + 
		var features = this._featuresSource;
		var f = new V3D();
		for(i=0; i<features.length; ++i){
			var feature = features[i];
			//f.set(feature.x+0.5, feature.y+0.5);
			f.set(feature.x+0.5, feature.y+0.5, feature.z);
			var siz = f.z;
				siz = siz * scaling;
				var p = this._explorer.toScreenPoint(f);
				d.graphics().beginPath();
				d.graphics().drawCircle(p.x,p.y, siz);
				d.graphics().endPath();
				d.graphics().fill();
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
	var cen = new V2D(size.x*0.5,size.y*0.5);
	var min = new V2D(cen.x-siz*0.5,cen.y-siz*0.5);
	var max = new V2D(min.x+siz,min.y+siz);
	// Code.sizeToFitInside = function(containerWidth,containerHeight, contentsWidth,contentsHeight){
	app.setActive(this._canvas, this._stage, this._root, min,max);
}


App3DR.prototype._handleCanvasResizeFxn = function(r){
	if(this._activeApp){
		return;
	}


	


	this._updateBackground();
	
	var screenSize = new V2D( this._canvas.width(), this._canvas.height() );
	console.log("screenSize: "+screenSize);
	var screenCenter = screenSize.copy().scale(0.5);

	var grid = this._grid;
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
		views/
			0/
				features.yaml 			all possible feature points w/ score
				pictures/
					100.png
					50.png
					25.png
					12.5.png
		pairs/
			0/
				matching.yaml 			x,y,z,t[,u,v] <=> ; F
				sparse.yaml 			x,y+transform <=>; F
				medium.yaml 			sparse (more)
				dense.yaml 				x,y, relScale,relAng @ density ; F
				triangulation.yaml 		x,y <=> x,y <=> X,Y,Z ; K ; F ; P ;

				???? dense_5x5_800x600.yaml  high dense [after some other process?]

		triples/ tuples
			0/
				matches,yaml 			x,y <=> pixel matches among 3 views
		cameras/
			0/
				info.yaml 				computed intrinsic properties
				pictures/
					0.png
					1.png
					...
		reconstruction/
			WORKING YAML FILE

			points3d.yaml 				3d points found from pixels
			surface.yaml 				triangle soup of approximated surface
			textures/
				tex0.png
				tex1.png
				...
		scene/
			info.yaml 					scene info [cameras, background, model(if altered)]
			textures/
				tex01.png
				...

	*/
App3DR.ProjectManager = function(relativePath, operatingStage){ // very async heavy
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
	this._cameras = [];
	this._loading = true;
	this._stage = operatingStage;
	this._ticker = new Ticker();
	this._isBackgroundTasks = false;
	this.loadProjectFile();
}
Code.inheritClass(App3DR.ProjectManager,Dispatchable);

App3DR.ProjectManager.EVENT_LOADED = "pm.loaded";


App3DR.ProjectManager.INFO_FILE_NAME = "info.yaml";
App3DR.ProjectManager.FEATURES_FILE_NAME = "features.yaml";
App3DR.ProjectManager.VIEWS_DIRECTORY = "views";
App3DR.ProjectManager.PICTURES_DIRECTORY = "pictures";
App3DR.ProjectManager.PICTURE_MASK_FILE_NAME = "mask.png"; 
App3DR.ProjectManager.CAMERAS_DIRECTORY = "cameras";
App3DR.ProjectManager.PAIRS_DIRECTORY = "pairs";
App3DR.ProjectManager.INITIAL_MATCHES_FILE_NAME = "matches.yaml"; // points
App3DR.ProjectManager.SPARSE_MATCHES_FILE_NAME = "sparse.yaml"; // sparse points + transform
App3DR.ProjectManager.MEDIUM_MATCHES_FILE_NAME = "medium.yaml"; 
App3DR.ProjectManager.DENSE_MATCHES_FILE_NAME = "dense.yaml"; 
App3DR.ProjectManager.TRIPLES_DIRECTORY = "triples";

App3DR.ProjectManager.prototype.isLoaded = function(){
	return !this._loading;
}
App3DR.ProjectManager.prototype.views = function(){
	return this._views;
}
App3DR.ProjectManager.prototype.infoPath = function(){
	var infoPath = Code.appendToPath(this._workingPath,App3DR.ProjectManager.INFO_FILE_NAME);
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
	//console.log("checkOperations");
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
	var cameras = object["cameras"];
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
	this._cameras = [];
	if(cameras){
		len = cameras.length;
		for(i=0; i<len; ++i){
			var c = cameras[i];
			console.log(c);
			// var pair = new App3DR.ProjectManager.Pair(this);
			// pair.readFromObject(p);
			// this._pairs.push(pair);
		}
	}
}
App3DR.ProjectManager.prototype.saveToYAML = function(){
	var modified = Code.getTimeStampFromMilliseconds();
	this._modifiedTimestamp = modified;
	var i;
	var yaml = new YAML();
	yaml.writeComment("3DR Project File 0");
	yaml.writeBlank();
	yaml.writeString("title", this._titleName);
	yaml.writeString("created", this._createdTimestamp);
	yaml.writeString("modified", this._modifiedTimestamp);
// 	null: "title"
// null: "created"
	// views
	len = this._views ? this._views.length : 0;
	yaml.writeArrayStart("views");
	for(i=0; i<len; ++i){
		var view = this._views[i];
		yaml.writeObjectStart();
			view.saveToYAML(yaml);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	// pairs
	len = this._pairs ? this._pairs.length : 0;
	yaml.writeArrayStart("pairs");
	for(i=0; i<len; ++i){
		var pair = this._pairs[i];
		yaml.writeObjectStart();
			pair.saveToYAML(yaml);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	// cameras

	
	//yaml.writeBlank();
	var str = yaml.toString();
	return str;
}
App3DR.ProjectManager.prototype.loadProjectFile = function(){
	console.log("loadProjectFile");
	this._loading = true;
	this._operation = App3DR.ProjectManager.OPERATION_LOAD_PROJECT;
	this.addOperation("GET", {"path":this.infoPath(),"data":null}, this._loadProjectCallback, this, null);
}
App3DR.ProjectManager.prototype.saveProjectFile = function(){
	console.log("saveProjectFile");
	this._operation = App3DR.ProjectManager.OPERATION_SAVE_PROJECT;
	var str = this.saveToYAML();
	var binary = Code.stringToBinary(str);
	this.addOperation("SET", {"path":this.infoPath(),"data":binary}, this._saveProjectCallback, this, null);
}
App3DR.ProjectManager.ID_LENGTH = 8;
App3DR.ProjectManager.prototype._randomID = function(){
	return Code.randomID(App3DR.ProjectManager.ID_LENGTH);
}
App3DR.ProjectManager.prototype._uniqueViewID = function(){
	return this._uniqueArrayItemID( this._views, function(v){ return v.id(); } );
}
App3DR.ProjectManager.prototype._uniquePairID = function(){
	return this._uniqueArrayItemID( this._pairs, function(p){ return p.id(); } );
}
App3DR.ProjectManager.prototype._uniqueCameraID = function(){
	return this._uniqueArrayItemID( this._cameras, function(c){ return c.id(); } );
}
App3DR.ProjectManager.prototype._uniqueArrayItemID = function(array, fxn){
	var i, len = array.length;
	var duplicate = true;
	while(duplicate){
		var randomID = this._randomID();
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
	var path = Code.appendToPath(this._workingPath, directory);
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
		var path = Code.appendToPath(this._workingPath, view.directory());
		var object = {"view":view, };
		this.addOperation("DEL", {"path":path}, callback, context, object);
		this.saveProjectFile();
		return true;
	}
	return false;
}
App3DR.ProjectManager.prototype.addPictureForView = function(view, filename, size, scale, binary, callback, context, object){
	console.log("doing");
	var path = Code.appendToPath(this._workingPath, view.directory(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log(path);
	this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
}
App3DR.ProjectManager.prototype.saveFeaturesForView = function(view, features, filename, callback, context, object){
	console.log("saveFeaturesForView");
	var path = Code.appendToPath(this._workingPath, view.directory(), filename);
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
	var path = Code.appendToPath(this._workingPath, view.directory(), filename);
	console.log(path);
	this.addOperation("GET", {"path":path}, callback, context, object);
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
	this._taskBusy = true;
return; // TODO: uncomment this
	var i, j, k, len;
	console.log("next task?");
	var views = this._views;
	var pairs = this._pairs;
	// do all views have images sized down to 150x100?
		// ASSUMED DONE ...
	// do all views have features detected?
	len = views.length;
	for(i=0; i<len; ++i){
		var view = views[i];
		var hasFeatures = view.hasFeatures();
		if(!hasFeatures){
			this.calculateFeatures(view);
			return;
		}
	}
	// does a feature-match pair exist (even a bad match) between every view?
	console.log("check pairs");
	len = views.length;
	var foundPair = null;
	for(i=0; i<len; ++i){
		var viewA = views[i];
		var idA = viewA.id();
		for(j=i+1; j<len; ++j){
			var viewB = views[j];
			var idB = viewB.id();
			console.log("pair: ? "+idA+" & "+idB+" ? ");
			var found = false;
			// 1) feature match
			// 2) sparse match
			// 3) medium match
			// 4) dense match
			for(k=0; k<pairs.length; ++k){
				var pair = pairs[i];
				if(pair.isPair(idA,idB)){
					if(pair.hasMatch()){
						foundPair = pair;
						found = true;
					}
					break;
				}
			}
			if(!found){
				console.log("need to match pair ... ");
				this.calculatePairMatch(viewA,viewB, foundPair);
			}
		}
	}
	// does a triple exist (even a bad one) for all pairs ...
	HERE
	var pairs = [];
	for(i=0; i<pairs.length; ++i){
		// 
	}

/*
	for each view
		for each other view
			for each pair
				pair.is A & B
	var pairs = this._pairs;
	len = pairs.length;
	for(i=0; i<len; ++i){
		var pair = pairs[i];
		//var features = view.hasFeatures();
		
	}
*/
	// 
	// does a camera calibration exist?
	// does each (good) pair have a camera estimation?
	// does each (good) pair have a camera transform?

	// does each (good) pair have a low-q dense depth match? [sort by best feature match count/score]

	// TODO: 3-view-bundle adjust

	// does each (good) pair have a high-q dense depth match?
	console.log("NO TASKS TO PERFORM");
	this._taskBusy = false;
}
App3DR.ProjectManager.prototype.calculateFeatures = function(view){
	console.log("calculateFeatures");
	view.loadFeaturesImage(this._calculateFeaturesLoaded, this);
}
App3DR.ProjectManager.prototype._calculateFeaturesLoaded = function(view){
	console.log("with image loaded, can calculate");
	var image = view.featuresImage();
	//console.log(image);
	var imageMatrix = R3D.imageMatrixFromImage(image, this._stage);
	console.log(imageMatrix);
	var features = R3D.testExtract1(imageMatrix, null, 1E4);
	console.log(features); // 2284
	normalizedFeatures = [];
	var i;
	var width = imageMatrix.width();
	var height = imageMatrix.height();
	var scaleX = 1.0/width;
	var scaleY = 1.0/height;
	var scaleZ = 1.0/width;
	for(i=0; i<features.length; ++i){
		var feature = features[i];
		var normal = new V3D();
		normal.copy(feature);
		normal.scale(scaleX,scaleY,scaleZ);
		normalizedFeatures.push(normal);
	}
	view.setFeatures(normalizedFeatures, this._calculateFeaturesComplete, this);
}
App3DR.ProjectManager.prototype._calculateFeaturesComplete = function(view){
	console.log("_calculateFeaturesComplete");
	console.log(view);
	//this._taskBusy = false;
	this.checkPerformNextTask();
}
App3DR.ProjectManager.prototype.loadImageForView = function(view, filename, callback, context, object){
	var path = Code.appendToPath(this._workingPath, view.directory(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	console.log("IMAGE PATH: "+path);
	this.addOperation("GET", {"path":path}, callback, context, object);
}
App3DR.ProjectManager.prototype._denormalizeFeatures = function(features, width, height){
	var i;
	var fixed = [];
	for(i=0; i<features.length; ++i){
		fixed[i] = features[i].copy().scale(width, height, width);
	}
	return fixed;
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
	var fxnA = function(){ // load features A
		viewA.loadFeatures(fxnB, self);
	}
	var fxnB = function(v){ // load features B
		featuresA = viewA.features();
		viewB.loadFeatures(fxnC, self);
	}
	var fxnC = function(){ // load matching Image A
		featuresB = viewB.features();
		viewA.loadMatchingImage(fxnD, self);
	}
	var fxnD = function(){// load matching Image B
		imageA = viewA.matchingImage();
		viewB.loadMatchingImage(fxnF, self);
	}
	
	var fxnF = function(){
		console.log("fxnF");
		imageB = viewB.matchingImage();
		// 
		var imageAWidth = imageA.width;
		var imageAHeight = imageA.height;
		var imageBWidth = imageB.width;
		var imageBHeight = imageB.height;

		// console.log(featuresA);
		// console.log(featuresB);
		// console.log(imageA);
		// console.log(imageB);

		
		featuresA = self._denormalizeFeatures(featuresA, imageAWidth, imageAHeight);
		featuresB = self._denormalizeFeatures(featuresB, imageBWidth, imageBHeight);
		//var maxFeatures = 500;
		var maxFeatures = 200;
		featuresA = Code.copyArray(featuresA, 0,maxFeatures-1);
		featuresB = Code.copyArray(featuresB, 0,maxFeatures-1);

		//throw "de-normalize feature points";
		console.log(featuresA);

		// create imageMatrix from image A
		var imageMatrixA = R3D.imageMatrixFromImage(imageA, stage);
		// create imageMatrix from image B
		var imageMatrixB = R3D.imageMatrixFromImage(imageB, stage);
		// create SIFTs from features A
		var objectsA = R3D.generateSIFTObjects(featuresA, imageMatrixA);
		// create SIFTs from features B
		var objectsB = R3D.generateSIFTObjects(featuresB, imageMatrixB);
		// fat matching (no prior knowledge)
console.log("START");
		var matchData = R3D.fullMatchesForObjects(objectsA, imageMatrixA, objectsB, imageMatrixB);
		var F = matchData["F"];
		var matches = matchData["matches"];
console.log("END");
		// ...
		matchCount = matches.length;
		console.log(matches);
//throw " ??? ";
		var str = self._matchesToYAML(matches, F, viewA, viewB);
		var binary = Code.stringToBinary(str);
		yamlBinary = binary;
		if(pair){
			fxnG(pair);
		}else{
			self.addPair(viewA, viewB, fxnG, self);
		}
		// App3DR.ProjectManager.prototype.addPair = function(viewA, viewB, callback, context){
	}
	var yamlBinary = null;
	var matchCount = -1;
	var fxnG = function(pair){
		console.log("fxnG");
		console.log(yamlBinary!==null);
		var path = Code.appendToPath(self._workingPath, App3DR.ProjectManager.PAIRS_DIRECTORY, pair.directory(), App3DR.ProjectManager.INITIAL_MATCHES_FILE_NAME);
		pair.setMatchInfo(matchCount);//, App3DR.ProjectManager.SPARSE_MATCHES_FILE_NAME);
		self.addOperation("SET", {"path":path, "data":yamlBinary}, fxnH, self, pair);
	}
	var fxnH = function(object, data){
		console.log("fxnH");
		console.log(object);
		console.log(data);
		self.saveProjectFile();
	}
	fxnA();
}
/*
SPARSE

refineFromSIFT


transformFromSiftRefine


var info = R3D.refinedMatchPoints(imageMatrixA,imageMatrixB, pointsA,pointsB);
var transforms = info["transforms"];
var pointsA = info["pointsA"];
var pointsB = info["pointsB"];



var yaml = R3D.outputSparsePoints(imageMatrixA,imageMatrixB, pointsA,pointsB, transforms);
console.log(yaml);



*/
App3DR.ProjectManager.prototype._matchesToYAML = function(matches, F, viewA, viewB){
	var timestampNow = Code.getTimeStampFromMilliseconds();

	var yaml = new YAML();
	yaml.writeComment("3DR Features File 0");
	yaml.writeBlank();
	yaml.writeString("title", "features");
	yaml.writeString("created", timestampNow);

	yaml.writeString("from", viewA.id());
	yaml.writeString("to", viewB.id());


//	TODO: INCLUDE SIZE DATA WITH VIEWS

	yaml.writeObjectStart("F");
		F.saveToYAML(yaml);
	yaml.writeObjectEnd();

	yaml.writeNumber("count", matches.length);
	yaml.writeArrayStart("matches");
	var i, len=matches.length;
	for(i=0; i<len; ++i){
		var match = matches[i];
		var fr = match["A"];
		var to = match["B"];
		yaml.writeObjectStart("from");
			fr.saveToYAML(yaml);
		yaml.writeObjectEnd();
		yaml.writeObjectStart("to");
			to.saveToYAML(yaml);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	return yaml.toString();
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
		yaml.writeObjectStart();
			feature.saveToYAML(yaml);
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
			//console.log(feature);
			var point = new V3D().loadFromObject(feature);
			list.push(point);
		}
	}
	return list;
}
App3DR.ProjectManager.prototype.x = function(){
	//
}
App3DR.ProjectManager.prototype.x = function(){

}

// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.View = function(manager, name, directory){
	this._manager = manager;
	this._title = name ? name : "dunno1";
	this._directory = directory ? directory : "dunno2";
	this._pictureInfo = []; // 
	//this._pictures = null; // actual data when loaded --- maybe only specific sizes ? [icon, denseLo, features, denseHi, texture, original]
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
}
App3DR.ProjectManager.View.prototype.hasFeatures = function(){
	return this._featureInfo != null;
}
App3DR.ProjectManager.View.prototype.saveToYAML = function(yaml){
	var i, len;
	yaml.writeString("title", this._title);
	yaml.writeString("directory", this._directory);
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
	// len = this._featureInfo ? this._featureInfo.length : 0;
	// yaml.writeArrayStart("pictures");
	// for(i=0; i<len; ++i){
	// 	var feature = this._featureInfo[i];
	// 	yaml.writeObjectStart();
	// 		yaml.writeString("file", feature["file"]);
	// 		yaml.writeNumber("width", picture["width"]);
	// 		yaml.writeNumber("height", picture["height"]);
	// 		yaml.writeNumber("scale", picture["scale"]);
	// 	yaml.writeObjectEnd();
	// }
	// yaml.writeArrayEnd();
	
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
	this._title = title;
	this._directory = directory;
	this._pictureInfo = [];
	this._featureInfo = [];
	// this._pairInfo = [];
	this._cameraID = camera;
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
	// console.log("doing");
	// var path = Code.appendToPath(this._workingPath, view.directory(), App3DR.ProjectManager.PICTURES_DIRECTORY, filename);
	// console.log(path);
	// this.addOperation("SET", {"path":path,"data":binary}, callback, context, object);
}
App3DR.ProjectManager.View.prototype._saveMaskPictureComplete = function(object, data){
	console.log("_saveMaskPictureComplete");
}
App3DR.ProjectManager.View.prototype.addPicture = function(size, scale, binary,  callback, context, returnObject){
	console.log(callback);
	console.log(context);
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
App3DR.ProjectManager.View.prototype.directory = function(){
	return this._directory;
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
	// console.log(object);
	// console.log(data);
		var callback = object["callback"];
		var context = object["context"];
		var returnObject = object["object"];
	var yamlObject = Code.binaryToYAMLObject(data);
	var features = this._manager._featuresFromObject(yamlObject);
	this._features = features;
	// 
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
App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MASK = 100;
App3DR.ProjectManager.View.prototype._loadImage = function(type, callback, context){
	var i;
	var pictures = this._pictureInfo.sort(App3DR.ProjectManager.View.sortSizeIncreasing);
	var desiredPixelCount = 600*400;
	var maximumPixelCount = 1000*750;
	if(true){//loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_ICON){
		desiredPixelCount = 400*300;
		maximumPixelCount = 500*350;
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
	var object = {};
		object["callback"] = callback;
		object["context"] = context;
		object["type"] = type;
	this._manager.loadImageForView(this, picture["file"], this._loadImageComplete, this, object);
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
		}else if(loadType==App3DR.ProjectManager.View.IMAGE_LOAD_TYPE_MASK){
			self._pictureSourceMask = image;
		}else{
			console.log("UNKNOWN LOAD TYPE");
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

// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.Pair = function(manager, directory, viewA, viewB){
	this._manager = manager;
	this._directory = directory;
	this._viewAID = viewA;
	this._viewBID = viewB;
	this._matchFeatureScore = null; // median / average of feature scores [some distribution of good scores metric]
	this._matchFeatureCount = null; // total matched features [above minimum]
}
App3DR.ProjectManager.Pair.prototype.directory = function(){
	return this._directory;
}
App3DR.ProjectManager.Pair.prototype.id = function(){
	return this.directory();
}
App3DR.ProjectManager.Pair.prototype.setMatchInfo = function(count, dir){
	this._matchFeatureCount = count;
	// TODO: DIR
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
	//return this._matchFeatureCount != null && this._matchFeatureCount >= 0;
	return false; // ?
}
App3DR.ProjectManager.Pair.prototype.saveToYAML = function(yaml){
	yaml.writeString("directory", this._directory);
	yaml.writeString("viewA", this._viewAID);
	yaml.writeString("viewB", this._viewBID);
	yaml.writeNumber("featureScore", this._matchFeatureScore);
	yaml.writeNumber("featureCount", this._matchFeatureCount);
}
App3DR.ProjectManager.Pair.prototype.readFromObject = function(object){
	this._directory = object["directory"];
	this._viewAID = object["viewA"];
	this._viewBID = object["viewB"];
	this._matchFeatureScore = object["featureScore"];
	this._matchFeatureCount = object["featureCount"];
}
// ------------------------------------------------------------------------------------------------------------
App3DR.ProjectManager.Camera = function(manager, directory){
	this._manager = manager;
	this._directory = directory;
	this._K = null;
	this._distortions = null;
	this._pictureInfo = null;
	this._pictures = null;
}
App3DR.ProjectManager.Camera.prototype.saveToYAML = function(yaml){
	yaml.writeString("directory", this._directory);
}
App3DR.ProjectManager.Camera.prototype.readFromObject = function(object){
	this._directory = object["directory"];
}







