// Formats3D.js

function Formats3D(){
	console.log("F3D");
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this._handleEnterFrameFxn,this);

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
	ajax.get("./cube.stl",this,this._handleLoaded,null);
	//ajax.get("./cube.ply",this,this._handleLoaded,null);
	//ajax.();
GLOBALSTAGE = this._stage;
}
Formats3D.prototype._handleEnterFrameFxn = function(e){
	// console.log(e);
	var cam = new Cam3D();
		cam.translate(1, 2, -3);
		cam.rotate(0, 0, 0);
		// console.log(cam._pos)
		// console.log(cam._rot)
	var mat = cam.reverseMatrix();


	// transform coordinates into local space
	// offset by size
	// 

	var triangles = this._triangles;
	var i, len;
	for(i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var A = mat.multV3D(tri.A());
		var B = mat.multV3D(tri.B());
		var C = mat.multV3D(tri.C());
		// clipping ?
		console.log(A+"");
	}

	// CLIP to area


}
Formats3D.prototype.readSTLToTriangles = function(array){
	var i, c;
	var triangles = [];
	if(array.length<84){ // no data
		return triangles;
	}
	// FIRST 80 byte/characters ignored [optional info header]
	var header = "";
	for(i=0;i<80;++i){
		c = array[i];
		if(c!=0){
			c = String.fromCharCode(c);
			header = header + "" + c;
		}
	}
	// console.log("STL HEADER: "+header);
	var start = 80; // ignore first 80 header bytes
	var facets = Code.uint32LittleEndianFromByteArray(array,start+0);
	// console.log("facets: "+facets);
	start += 4;
	if(array.length < start + facets*50){ // incorrect number of facets
		return triangles;
	}
	
	//facets = Math.min(facets, 5);
	for(i=0; i<facets; ++i){
		var facetOffset = start + i*(4*3*4+2); // each iteration is 50 bytes
		var nX = Code.float32LittleEndianFromByteArray(array,facetOffset + 0);
		var nY = Code.float32LittleEndianFromByteArray(array,facetOffset + 4);
		var nZ = Code.float32LittleEndianFromByteArray(array,facetOffset + 8);
		var normal = new V3D(nX,nY,nZ);
		var aX = Code.float32LittleEndianFromByteArray(array,facetOffset + 12);
		var aY = Code.float32LittleEndianFromByteArray(array,facetOffset + 16);
		var aZ = Code.float32LittleEndianFromByteArray(array,facetOffset + 20);
		var bX = Code.float32LittleEndianFromByteArray(array,facetOffset + 24);
		var bY = Code.float32LittleEndianFromByteArray(array,facetOffset + 28);
		var bZ = Code.float32LittleEndianFromByteArray(array,facetOffset + 32);
		var cX = Code.float32LittleEndianFromByteArray(array,facetOffset + 36);
		var cY = Code.float32LittleEndianFromByteArray(array,facetOffset + 40);
		var cZ = Code.float32LittleEndianFromByteArray(array,facetOffset + 44);
		var att = Code.uint16LittleEndianFromByteArray(array,facetOffset + 48); // ignore
		tri = new Tri3D( new V3D(aX,aY,aZ), new V3D(bX,bY,bZ), new V3D(cX,cY,cZ) );
		// ignore triangles with little area
		if(tri.isPoint()){
			continue;
		}
		// reverse trianges with opposide normals
		var norm = tri.normal();
		var dot = V3D.dot(normal,norm);
		if(dot<0){
			var A = tri.A();
			tri.A(tri.B());
			tri.B(A);
		}
		triangles.push(tri);
	}
	start += i*50; // end
	return triangles;
}
Formats3D.prototype.writeTrianglesToSTL = function(triangles){
	//
}
Formats3D.prototype.readPLYToTriangles = function(array){
	// console.log(array);
	// console.log(array.length);
	var i, j, k, l, c, value, words;
	var triangles = [];
	for(i=0;i<array.length;++i){
		c = array[i];
		var char = String.fromCharCode(c);
		var hex = Code.getHexNumber(c);
	//	console.log(Code.postpendFixed(i+"",5)+": "+c+" => "+char+"      ["+hex+"]");
	}
	var lineFeed = String.fromCharCode(0x0A);
	var start = 0;
	// starts with ply
	var value = Code.charStringFromByteArray(array, start, lineFeed);
	start += value.count;
	var filetype = value.value;
	if(filetype!=="ply"){
		return triangles;
	}
	// ascii format
	var value = Code.charStringFromByteArray(array, start, lineFeed);
	start += value.count;
	var format = value.value;
	if(format=="format ascii 1.0"){
		// do
	}else if(format=="format binary_little_endian 1.0"){
		console.log("TODO");
	}else if(format=="format binary_big_endian 1.0"){
		console.log("TODO");
		return triangles;
	}else{
		console.log("unkown type");
		return triangles;
	}
	// header elements
	var elements = [];
	while(start<array.length){ // each line
		var line = Code.charStringFromByteArray(array, start, lineFeed);
		start += line.count;
		//console.log(""+line.value+"   | "+line.count);
		if(Code.stringStartsWith(line.value, "comment")){
			// ignore
		}else{
			words = line.value.split(" ");
			if(words.length>0){
				if(words[0]=="element"){
					var element = {};
					element["name"] = words[1];
					element["count"] = parseInt(words[2]);
					element["properties"] = [];
					element["objects"] = [];
					elements.push(element);
				}else if(words[0]=="property"){
					var element = elements[elements.length-1];
					var properties = element["properties"];
					var property = {};

					if(words[1]=="list"){
						property["isList"] = true;
						property["type"] = words[3];
						property["count"] = words[2];
						property["name"] = words[4];
					}else{
						property["isList"] = false;
						property["type"] = words[1];
						property["name"] = words[2];
					}
					properties.push(property);
				}else if(words[0]=="end_header"){
					break;
				}
			}
		}
	}
	// read in object elements   |  char uchar short ushort int uint float double, or one of int8 uint8 int16 uint16 int32 uint32 float32 float64
	for(i=0; i<elements.length; ++i){
		var element = elements[i];
		var objects = element["objects"];
		var properties = element["properties"];
		var elementCount = element["count"];
		for(j=0; j<elementCount; ++j){
			var line = Code.charStringFromByteArray(array, start, lineFeed);
			start += line.count;
			var words = line.value.split(" ");
			var object = {};
			objects.push(object);
			var len = Math.min(properties.length, words.length);
			for(k=0; k<len; ++k){
				var property = properties[k];
				var propertyName = property["name"];
				var propertyType = property["type"];
				var isList = property["isList"];
				if(isList){
					var propertyCount = property["count"]; // assuming int
					var count = parseInt(words[0]);
					var list = [];
					for(l=1; l<count+1; ++l){
						value = words[l];
						if(propertyType=="float" || propertyType=="double" || propertyType=="float32" || propertyType=="float64"){
							value = parseFloat(value);
						}else{
							value = parseInt(value);
						}
						list.push(value);
					}
					object[propertyName] = list;
				}else{
					var value = words[k];
					if(propertyType=="float" || propertyType=="double" || propertyType=="float32" || propertyType=="float64"){
						value = parseFloat(value);
					}else{
						value = parseInt(value);
					}
					object[propertyName] = value;
				}
			}
		}
	}
	// convert to objects into triangles
	var vertexes = null;
	var faces = null;
	for(i=0; i<elements.length; ++i){
		var element = elements[i];
		var name = element["name"]
		var objects = element["objects"];
		if(name=="vertex"){
			vertexes = objects;
		}else if(name=="face"){
			faces = objects;
		}
	}
	if(faces && vertexes){
		for(i=0; i<faces.length;++i){
			var face = faces[i];
			var keys = Code.keys(face);
			if(keys.length==1){
				var indexes = face[keys[0]];
				var A = null, B = null, C = null;
				var jump = 1;
				for(j=0; j<indexes.length+2;j+=jump){
					var index = indexes[j%indexes.length];
					var vertex = vertexes[index];
					C = new V3D(vertex["x"],vertex["y"],vertex["z"]);
					if(A && B && C){
						tri = new Tri3D(A,B,C);
						triangles.push(tri);
						jump = 2; // next tri
						A = null; B = C; C = null;
					}else{
						jump = 1; // fill this tri
						A = B; B = C; C = null;
					}
					
				}
			}
		}
	}
	return triangles;
}

Formats3D.prototype._handleLoaded = function(response){
	console.log(response);
	var triangles = this.readSTLToTriangles(response);
	//var triangles = this.readPLYToTriangles(response);
	console.log(triangles);
	//this.writeTrianglesToSTL(triangles);
	//this.writeTrianglesToSPLY(triangles);
	// SHOW RENDER
	this._triangles = triangles;
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
asciiList.push([0  ,"Null"]);
asciiList.push([1  ,"SOH - start of heading "]);
asciiList.push([2  ,"STX - start of text"]);
asciiList.push([3  ,"ETX - end of text"]);
asciiList.push([4  ,"EOT - end of transmit"]);
asciiList.push([5  ,""]);
asciiList.push([6  ,""]);
asciiList.push([7  ,""]);
asciiList.push([8  ,""]);
asciiList.push([9  ,""]);
asciiList.push([10 ,""]);
asciiList.push([11 ,""]);
asciiList.push([12 ,""]);
asciiList.push([13 ,""]);
asciiList.push([14 ,""]);
asciiList.push([15 ,""]);
asciiList.push([16 ,""]);
asciiList.push([17 ,""]);
asciiList.push([18 ,""]);
asciiList.push([19 ,""]);
asciiList.push([20 ,""]);
asciiList.push([21 ,""]);
asciiList.push([22 ,""]);
asciiList.push([23 ,""]);
// 10 = newline
// 12 = new page
// 32 = space
// 128 = 0x80
// 191 = 0x8F
// 
//



