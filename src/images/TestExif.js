// TestExif.js

function TestExif(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();

	// KEYBOARD INTERACTION
	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this._handleKeyboardUp,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this._handleKeyboardDownStill,this);
	this._keyboard.addListeners();
	
	// LOAD IMAGES
	/*
	var imageList, imageLoader;
	imageList = ["image.png"];
	imageLoader = new ImageLoader("./",imageList, this,this._handleImagesLoaded,null);
	imageLoader.load();
	*/
	// var ajax = new Ajax();
	// ajax.binary(true);
	//ajax.binary(false);
	//ajax.get("./image_.1.png",this,this._handleLoaded,null);
	//ajax.get("./image.png",this,this._handleLoaded,null);
//	ajax.get("./apng.apng",this,this._handleLoaded,null);
	// ajax.get("./mri.png",this,this._handleLoaded,null);
	//ajax.();
GLOBALSTAGE = this._stage;
	
	var doPNG = false;
	// var doPNG = true;
	
	var domBody = Code.getBody();
	var domImage = Code.newImage(domBody);
	console.log(domImage);
	var source;
	if(doPNG){
		source = "./exif.png";
	}else{
		source = "./exif.jpg";
	}

// source = "";
	Code.setImageSource(domImage, source, function(i){
		console.log("loaded");
		console.log(i)
		console.log(domImage);

		var imageSRC = domImage.src;

		var ajax = new Ajax();
		ajax.binary(true);
		ajax.get(imageSRC, Code, function(data){
			console.log("got");
			console.log(data);
			var mime = Code.mimeTypeFromBinaryData(data);
			console.log(mime);
			if(mime==Code.MIMETYPE_PNG){
				console.log("PNG");
				PNG.METADATA(domImage, function(data){
					console.log(data);
					var orientation = data.metadata()["Orientation"];
					console.log("orientation: "+orientation);
				});
			}else if(mime==Code.MIMETYPE_JPG){
				console.log("JPG");
				JPEG.EXIF(domImage, function(data){
					console.log(data);
					var orientation = data.metadata()["Orientation"];
					console.log("orientation: "+orientation);
				});
			}else{
				console.log("unknown");
			}
			
		});

	});
	
}
TestExif.prototype._handleLoaded = function(response){
	 // ..
}


