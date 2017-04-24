// Formats3D.js

function Formats3D(){
	console.log("F3D");
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
	var ajax = new Ajax();
	ajax.binary(true);
	//ajax.binary(false);
	//ajax.get("./image_.1.png",this,this._handleLoaded,null);
	//ajax.get("./image.png",this,this._handleLoaded,null);
//	ajax.get("./apng.apng",this,this._handleLoaded,null);
	ajax.get("./cube.stl",this,this._handleLoaded,null);
	//ajax.();
GLOBALSTAGE = this._stage;
}
Formats3D.prototype.readSTLToTriangles = function(array){
// 10 = newline
// 12 = new page
// 32 = space
// 128 = 0x80
// 191 = 0x8F
// 
//
// FIRST 80 characters ignored
// 
// # of triangles [UINT32]
	console.log(array);
	var i, len = array.length;
	for(i=0;i<len;++i){
		var c = array[i];
		var char = String.fromCharCode(c);
		var hex = Code.getHexNumber(c);
		console.log(Code.postpendFixed(i+"",5)+": "+c+" => "+char+"      ["+hex+"]");
	}
	console.log(",.............");
	var value;
	var start = 80; // ignore first 80 header bytes	


// 	var f = Code.float32LittleEndianFromByteArray([0x00,0x00,0x20,0x3E],0);
// 	console.log(f);
// return;

	var facets = Code.uint32LittleEndianFromByteArray(array,start+0);
	console.log("facets: "+facets);
	start += 4;
	//facets = Math.min(facets, 5);
	for(i=0; i<facets; ++i){
		var facetOffset = start + i*(4*3*4+2);
		var normalX = Code.float32LittleEndianFromByteArray(array,facetOffset + 0);
		var normalY = Code.float32LittleEndianFromByteArray(array,facetOffset + 4);
		var normalZ = Code.float32LittleEndianFromByteArray(array,facetOffset + 8);
		var normal = new V3D(normalX,normalY,normalZ);
		var aX = Code.float32LittleEndianFromByteArray(array,facetOffset + 12);
		var aY = Code.float32LittleEndianFromByteArray(array,facetOffset + 16);
		var aZ = Code.float32LittleEndianFromByteArray(array,facetOffset + 20);
		var bX = Code.float32LittleEndianFromByteArray(array,facetOffset + 24);
		var bY = Code.float32LittleEndianFromByteArray(array,facetOffset + 28);
		var bZ = Code.float32LittleEndianFromByteArray(array,facetOffset + 32);
		var cX = Code.float32LittleEndianFromByteArray(array,facetOffset + 36);
		var cY = Code.float32LittleEndianFromByteArray(array,facetOffset + 40);
		var cZ = Code.float32LittleEndianFromByteArray(array,facetOffset + 44);
		var attr = Code.uint16LittleEndianFromByteArray(array,facetOffset + 48);
		console.log(i+" .............................. ");
		console.log(normalX,normalY,normalZ);
		console.log(aX,aY,aZ);
		console.log(bX,bY,bZ);
		console.log(bX,cY,cZ);
		console.log(attr);
		//console.log("facets: "+facets);
	}
	start += i*50;
	console.log(start);


	// i = 80;
	// c = Code.uint32FromByteArray(array,i+0);

	// //var c = array[i];
	// var char = String.fromCharCode(c);
	// var hex = Code.getHexNumber(c);
	// console.log(Code.postpendFixed(i+"",5)+": "+c+" => "+char+"      ["+hex+"]");

	// float32LittleEndianFromByteArray

// Code.uint32FromByteArray(binaryArray,start+0);
}
Formats3D.prototype._handleLoaded = function(response){
	console.log(response);
	var triangles = this.readSTLToTriangles(response);
return;
	this.writeTrianglesToSTL(triangles);
	//PNG.arrayARGB32ToBinaryArray(image);
// Exported from Blender-2.78 (sub 0)
//
}

Formats3D.prototype._handleKeyboardUp = function(e){
	// 
}
Formats3D.prototype._handleKeyboardDownStill = function(e){
	// 
}
Formats3D.prototype._handleKeyboardDown = function(e){
	// 
}

Formats3D.prototype._handleImagesLoaded = function(imageInfo){
	console.log("loaded");
	var image = imageInfo.images[0];
	console.log(image)
	//console.log(image,src)
	//document.body.appendChild(image);

	var imageBase64 = Code.binaryToBase64String(image);
	console.log(imageBase64)
	/*
	var imageList = imageInfo.images;
	var i, list = [];
	for(i=0;i<imageList.length;++i){
		list[i] = imageList[i];
		var img = list[i];
		var d = new DOImage(img);
		this._root.addChild(d);
	}
	var image = list[0];
	var imageSourceColors = this._stage.getImageAsFloatRGB(image);
	// console.log(imageSourceColors)
	var imageSourceRed = imageSourceColors.red;
	var imageSourceGrn = imageSourceColors.grn;
	var imageSourceBlu = imageSourceColors.blu;
	var imageSourceWidth = imageSourceColors.width;
	var imageSourceHeight = imageSourceColors.height;

	this._imageSource = {
		"red" : imageSourceRed,
		"grn" : imageSourceGrn,
		"blu" : imageSourceBlu,
		"width" : imageSourceWidth,
		"height" : imageSourceHeight,
	}*/
}


// http://www.flexcomm.com/library/ASCII256.htm
// http://www.ascii-code.com/
var asciiList = [];
asciiList.push([0,"Null"]);
asciiList.push([1,"SOH - start of heading "]);
asciiList.push([2,"STX - start of text"]);
asciiList.push([3,"ETX - end of text"]);
asciiList.push([4,"EOT - end of transmit"]);
