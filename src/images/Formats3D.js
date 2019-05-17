// Formats3D.js

function Formats3D(){
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
	//ajax.get("./cube.ply",this,this._handleLoaded,null);
	//ajax.get("./cube.stl",this,this._handleLoaded,null);
	ajax.get("../../fb/phone_mount/stl/mount_simple_iphone7.stl",this,this._handleLoaded,null);
	//ajax.get("../../fb/monitor_mount/output/stl/connection_plate.stl ",this,this._handleLoaded,null);
	//ajax.get("../../fb/monitor_mount/output/stl/connection_plate.stl ",this,this._handleLoaded,null);

	//

	//ajax.();
	this._display3D = new DO();
	this._root.addChild(this._display3D);
GLOBALSTAGE = this._stage;
}
Formats3D.prototype._handleEnterFrameFxn = function(e){
	var i, len;
	var triangles = this._triangles;
if(triangles.length==0){
	return;
}

	var screenWidth = this._canvas.width();
	var screenHeight = this._canvas.height();
	var centerX = screenWidth * 0.5;
	var centerY = screenHeight * 0.5;

	// find center & edges of triangles:
	var extremaModel = Tri3D.extremaFromArray(triangles);
	var maxModel = extremaModel.max;
	var minModel = extremaModel.min;
	var sizeModel = extremaModel.size;
	var modelCenter = minModel.copy().add(sizeModel.copy().scale(0.5));
	//modelCenter = maxModel

	var displaySize = Math.min(screenWidth,screenHeight);
	var scale = displaySize / Math.max(sizeModel.x,sizeModel.y,sizeModel.z);

	var cam = new Cam3D();
		//cam.translate(1, 2, -3);
		//cam.translate(0, 0, 0);
		//cam.rotate(0.5*e, 0.1*e, 0);

		cam.translate(modelCenter.x, modelCenter.y, modelCenter.z);
		cam.rotate(0.05*e, 0.01*e, 0);
		cam.scale(scale);
	var mat = cam.reverseMatrix();
	//var mat = cam.forwardMatrix();
	//var mat = new Matrix3D();
	//mat.scale(scale);
	//mat.translate(-modelCenter.x*scale, -modelCenter.y*scale, -modelCenter.z*scale);
	// mat.translate(-modelCenter.x, -modelCenter.y, -modelCenter.z);
	// mat.rotateXYZ(0.5*e, 0.1*e, 0);
	// mat.scale(scale);


	// mat.translate(-modelCenter.x, -modelCenter.y, -modelCenter.z);
	// mat.rotateXYZ(0.5*e, 0.1*e, 0);
	// mat.scale(scale);



	var display = this._display3D;

	// transform coordinates into local space
	// offset by size
	//



var lightSource = new V3D(0,10,10);


	var triangleDO = [];

	for(i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var A = mat.multV3D(tri.A());
		var B = mat.multV3D(tri.B());
		var C = mat.multV3D(tri.C());

		var center = tri.center();
		var centerToLight = V3D.sub(lightSource,center);
			centerToLight.norm();
		var norm = tri.normal();
		var dotLight = V3D.dot(centerToLight,norm);

		var disp = {};
		disp["A"] = A;
		disp["B"] = B;
		disp["C"] = C;
		disp["Z"] = (A.z + B.z + C.z)/3.0;
		disp["light"] = dotLight;
		triangleDO.push(disp);
	}

	triangleDO.sort(function(a,b){
		if(a["Z"] > b["Z"]){
			return 1;
		}
		return -1;
	});



display.matrix().identity();
display.matrix().translate(centerX,centerY);
display.graphics().clear();

	for(i=0; i<triangleDO.length; ++i){
		var disp = triangleDO[i];
		var A = disp["A"];
		var B = disp["B"];
		var C = disp["C"];
		var light = disp["light"];
			var dot = (light+1.0)*0.5;
			var dm1 = 1.0 - dot;
		// clipping ?
		//console.log(A+"");
		if(false){//A.z<0 || B.z<0|| C.z<0){
			//
		}else{
			var colorZero = [0.5,1.0,0.0,0.0];
			var colorOne =  [0.5,0.0,0.0,1.0];
			//display.graphics().setLine(1.0, 0x33000000);
			display.graphics().setLine(1.0, 0x99EECC00);
			//display.graphics().setLine(1.0, 0x00000000);
			//display.graphics().setFill(0xCC667788);
			//display.graphics().setFill(0x99667799);
			var alp = colorZero[0]*dot + colorOne[0]*dm1;
			var red = colorZero[1]*dot + colorOne[1]*dm1;
			var grn = colorZero[2]*dot + colorOne[2]*dm1;
			var blu = colorZero[3]*dot + colorOne[3]*dm1;
			var color = Code.getColARGBFromFloat(alp,red,grn,blu);
			//console.log(color);
			display.graphics().setFill(color);
			display.graphics().beginPath();
			display.graphics().moveTo(A.x,A.y,A.z);
			display.graphics().lineTo(B.x,B.y,B.z);
			display.graphics().lineTo(C.x,C.y,C.z);
			display.graphics().strokeLine();
			display.graphics().endPath();
			display.graphics().fill();
		}
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



Formats3D.DAEtoWorld = function(daeString){
	var xml = new XML();
	xml.parse(daeString);
	// console.log(xml);
	var root = xml.root();
	console.log(root);


	var world = {};
	world["images"] = [];


	return null;
}
Formats3D._daeArrayFromList = function(a){
	var s = "";
	var len = a.length;
	var lm1 = len-1;
	for(var i=0; i<len; ++i){
		if(i<lm1){
			s = s + a[i] + " ";
		}else{
			s = s + a[i];
		}
	}
	return s;
}
Formats3D._daeListObjectToXMLValue = function(xml,object, sid){
	var type = object["type"];
	var val = object["value"];
	var tag = null;
	var value = null;
	if(type=="number"){
		tag = "float";
		value = ""+val;
	}else if(type=="color"){
		tag = "color";
		value = Formats3D._daeArrayFromList(val); // R B G A
	}else if(type=="texture"){
		tag = "texture";
		value = val["id"];
	}else if(type=="matrix"){
		tag = "matrix";
		value = Formats3D._daeArrayFromList(val.toArray());
	}
	// value = "???";
	if(tag && value){
		xml.startElement(tag);
		if(sid){
			xml.setAttribute("sid",sid);
		}
		xml.setValue(value);
	}
}
Formats3D.worldToDAE = function(world){
	console.log(world);
	var worldImages = Code.valueOrDefault(world["images"], []);
	var worldEffects = Code.valueOrDefault(world["effects"], []);
	var worldControllers = Code.valueOrDefault(world["controllers"], []);
	var worldScenes = Code.valueOrDefault(world["scenes"], []);
	var worldLights = Code.valueOrDefault(world["lights"], []);
	var worldMeshes = Code.valueOrDefault(world["meshes"], []);


	var DAE_KEYWORD_COLLADA = "COLLADA";
	var DAE_VALUE_COLLADA_XMLNS = "http://www.collada.org/2005/11/COLLADASchema";
	var DAE_VALUE_COLLADA_XMLNS_XSI = "http://www.w3.org/2001/XMLSchema-instance";
	var DAE_VALUE_COLLADA_VERSION = "1.4.1";

	var contributor = "Blender User";
	var authoringTool = "Blender 2.79.0 commit date:2018-03-22, commit time:14:10, hash:f4dc9f9";
	var exportTime = Code.getTimeStampZulu();
	var units = "meters";
	var axisUp = "Z_UP";

	var xml = new XML();


	// xml pre
	xml.addXMLProlog();

	// collada
	xml.startElement(DAE_KEYWORD_COLLADA);
	xml.setAttribute("version",DAE_VALUE_COLLADA_VERSION);
	xml.setAttribute("xmlns",DAE_VALUE_COLLADA_XMLNS);
	xml.setAttribute("xmlns:xsi",DAE_VALUE_COLLADA_XMLNS_XSI);
	xml.startChildren();

	// info
	xml.startElement("asset");
	xml.startChildren();
		xml.startElement("contributor");
		xml.startChildren();
			xml.startElement("author");
				xml.setValue(contributor);
			xml.startElement("authoring_tool");
				xml.setValue(authoringTool);
		xml.endChildren();
		xml.startElement("created");
			xml.setValue(exportTime);
		xml.startElement("modified");
			xml.setValue(exportTime);
		xml.startElement("unit");
			xml.setAttribute("name",units);
			xml.setAttribute(units,"1");
		xml.startElement("up_axis");
			xml.setValue(axisUp);
	xml.endChildren();

	// images
	xml.startElement("library_images");
	xml.startChildren();
		for(var i=0; i<worldImages.length; ++i){
			var image = worldImages[i];
			var imageID = image["id"];
			var imageFile = image["file"];
			xml.startElement("image");
			xml.setAttribute("id",imageID);
			xml.setAttribute("name",imageID);
			xml.startChildren();
				xml.startElement("init_from");
				xml.setValue(imageFile);
			xml.endChildren();
		}
	xml.endChildren();

	// effects
	xml.startElement("library_effects");
	xml.startChildren();
		for(var i=0; i<worldEffects.length; ++i){
			var effect = worldEffects[i];
			var effectID = effect["id"];
			var surface = effect["surface"];
				var surfaceID = surface["id"];
				var surfaceType = surface["type"];
				var surfaceImageID = surface["image"];
			var sampler = effect["sampler"];
				var samplerID = sampler["id"];
				var samplerSourceID = surfaceID;
			// var imageFile = effect["file"];
			xml.startElement("effect");
			xml.setAttribute("id",effectID);
			xml.startChildren();
				xml.startElement("profile_COMMON");
				xml.startChildren();

					xml.startElement("newparam");
					xml.setAttribute("sid",surfaceID);
					xml.startChildren();
						xml.startElement("surface");
						xml.setAttribute("type",surfaceType);
						xml.startChildren();
							xml.startElement("init_from");
							xml.setValue(surfaceImageID);
						xml.endChildren();
					xml.endChildren();

					xml.startElement("newparam");
					xml.setAttribute("sid",samplerID);
					xml.startChildren();
						xml.startElement("sampler2D");
						xml.startChildren();
							xml.startElement("init_from");
							xml.setValue(samplerSourceID);
						xml.endChildren();
					xml.endChildren();

					var phong = effect["phong"];
					xml.startElement("technique");
					xml.setAttribute("sid","common");
					xml.startChildren();
						xml.startElement("phong");
						xml.startChildren();
							xml.startElement("emission");
							xml.startChildren();
								Formats3D._daeListObjectToXMLValue(xml, phong["emission"], "emission");
							xml.endChildren();
							xml.startElement("ambient");
							xml.startChildren();
								Formats3D._daeListObjectToXMLValue(xml, phong["ambient"], "ambient");
							xml.endChildren();
							xml.startElement("diffuse");
							xml.startChildren();
								Formats3D._daeListObjectToXMLValue(xml, phong["diffuse"], "diffuse");
							xml.endChildren();
							xml.startElement("specular");
							xml.startChildren();
								Formats3D._daeListObjectToXMLValue(xml, phong["specular"], "specular");
							xml.endChildren();
							xml.startElement("shininess");
							xml.startChildren();
								Formats3D._daeListObjectToXMLValue(xml, phong["shininess"], "shininess");
							xml.endChildren();
							xml.startElement("index_of_refraction");
							xml.startChildren();
								Formats3D._daeListObjectToXMLValue(xml, phong["ior"], "index_of_refraction");
							xml.endChildren();

						xml.endChildren();
					xml.endChildren();

				xml.endChildren();
			xml.endChildren();
		}
	xml.endChildren();

	// materials
// FROM EFFECTS?
	xml.startElement("library_materials");
	xml.startChildren();
		xml.startElement("material");
		xml.setAttribute("id","Material-material");
		xml.setAttribute("name","Material");
		xml.startChildren();
			xml.startElement("instance_effect");
			xml.setAttribute("url","#Material-effect");
		xml.endChildren();
	xml.endChildren();

	// geometries
	xml.startElement("library_geometries");
	xml.startChildren();
	for(var i=0; i<worldMeshes.length; ++i){
		var mesh = worldMeshes[i];
		var meshID = mesh["id"];
		var meshName = mesh["name"];
		var tris3D = mesh["triangles3D"];
		var tris2D = mesh["triangles2D"];
		var normals = mesh["normals"];
		if(!normals){
			normals = []; // TODO: from tris3D
		}
		var material = mesh["material"];
		var materialID = material["id"];
		xml.startElement("geometry");
		xml.startChildren();
			xml.startElement("mesh");
			xml.setAttribute("id",meshID);
			xml.setAttribute("name",meshName);
			xml.startChildren();
				var meshPosID = meshID+"-positions";
					var meshPosArrID = meshPosID+"-array";
				var meshNrmID = meshID+"-normals";
					var meshNrmArrID = meshNrmID+"-array";
				var meshMapID = meshID+"-map-"+0;
					var meshMapArrID = meshMapID+"-array";
				var meshVerID = meshID+"-vertices";
				var n3Ds = Tri3D.arrayToNormalList(tris3D);
					n3Ds = n3Ds["normals"];
					n3Ds = V3D.arrayToValueList(n3Ds);
					var n3DsArray = Formats3D._daeArrayFromList(n3Ds);
				var info3D = Tri3D.arrayToPointList(tris3D);
				var p3Ds = info3D["points"];
					p3Ds = V3D.arrayToValueList(p3Ds);
					var p3DsArray = Formats3D._daeArrayFromList(p3Ds);
				var info2D = Tri2D.arrayToPointList(tris2D);
				var p2Ds = info2D["points"];
					p2Ds = V2D.arrayToValueList(p2Ds);
					var p2DsArray = Formats3D._daeArrayFromList(p2Ds);
				// triangle counts
				var combinedVNTArray = [];
				for(var t=0; t<tris3D.length; ++t){  // point index // normal index // texture index
					var iV1 = t*3 + 0;
					var iN1 = t;
					var iT1 = t*3 + 0;
					var iV2 = t*3 + 1;
					var iN2 = t;
					var iT2 = t*3 + 1;
					var iV3 = t*3 + 2;
					var iN3 = t;
					var iT3 = t*3 + 2;
					combinedVNTArray.push(iV1,iN1,iT1);
					combinedVNTArray.push(iV2,iN2,iT2);
					combinedVNTArray.push(iV3,iN3,iT3);
				}
				combinedVNTArray = Formats3D._daeArrayFromList(combinedVNTArray);
				// positions
				xml.startElement("source");
				xml.setAttribute("id",meshPosID);
				xml.startChildren();
					xml.startElement("float_array");
					xml.setAttribute("id",meshPosArrID);
					xml.setAttribute("count",p3Ds.length);
					xml.setValue(p3DsArray);
					xml.startElement("technique_common");
					xml.startChildren();
						xml.startElement("accessor");
						xml.setAttribute("source","#"+meshPosArrID);
						xml.setAttribute("count",p3Ds.length/3);
						xml.setAttribute("stride",3);
						xml.startChildren();
							xml.startElement("param");
							xml.setAttribute("name","X");
							xml.setAttribute("type","float");
							xml.startElement("param");
							xml.setAttribute("name","Y");
							xml.setAttribute("type","float");
							xml.startElement("param");
							xml.setAttribute("name","Z");
							xml.setAttribute("type","float");
						xml.endChildren();
					xml.endChildren();
				xml.endChildren();
				// normals
				xml.startElement("source");
				xml.setAttribute("id",meshNrmID);
				xml.startChildren();
					xml.startElement("float_array");
					xml.setAttribute("id",meshNrmArrID);
					xml.setAttribute("count",n3Ds.length);
					xml.setValue(n3DsArray);
					xml.startElement("technique_common");
					xml.startChildren();
						xml.startElement("accessor");
						xml.setAttribute("source","#"+meshNrmArrID);
						xml.setAttribute("count",n3Ds.length/3);
						xml.setAttribute("stride",3);
						xml.startChildren();
							xml.startElement("param");
							xml.setAttribute("name","X");
							xml.setAttribute("type","float");
							xml.startElement("param");
							xml.setAttribute("name","Y");
							xml.setAttribute("type","float");
							xml.startElement("param");
							xml.setAttribute("name","Z");
							xml.setAttribute("type","float");
						xml.endChildren();
					xml.endChildren();
				// tex coords
				xml.startElement("source");
				xml.setAttribute("id",meshMapID);
				xml.startChildren();
					xml.startElement("float_array");
					xml.setAttribute("id",meshMapArrID);
					xml.setAttribute("count",p2Ds.length);
					xml.setValue(p2DsArray);
					xml.startElement("technique_common");
					xml.startChildren();
						xml.startElement("accessor");
						xml.setAttribute("source","#"+meshMapArrID);
						xml.setAttribute("count",p2Ds.length/2);
						xml.setAttribute("stride",2);
						xml.startChildren();
							xml.startElement("param");
							xml.setAttribute("name","S");
							xml.setAttribute("type","float");
							xml.startElement("param");
							xml.setAttribute("name","T");
							xml.setAttribute("type","float");
						xml.endChildren();
					xml.endChildren();
				xml.endChildren();
				// verts-2
				xml.startElement("vertices");
				xml.setAttribute("id",meshVerID);
				xml.startChildren();
					xml.startElement("input");
					xml.setAttribute("semantic","POSITION");
					xml.setAttribute("source","#"+meshPosID);
				xml.endChildren();
				// triangles
				xml.startElement("triangles");
				xml.setAttribute("material",materialID);
				xml.setAttribute("count",tris3D.length);
				xml.startChildren();
					xml.startElement("input");
					xml.setAttribute("semantic","VERTEX");
					xml.setAttribute("source","#"+meshVerID);
					xml.setAttribute("offset","0");
					xml.startElement("input");
					xml.setAttribute("semantic","NORMAL");
					xml.setAttribute("source","#"+meshNrmID);
					xml.setAttribute("offset","1");
					xml.startElement("input");
					xml.setAttribute("semantic","TEXCOORD");
					xml.setAttribute("source","#"+meshMapID);
					xml.setAttribute("offset","2");
					xml.setAttribute("set","0");
					xml.startElement("p");
					xml.setValue(combinedVNTArray);
				xml.endChildren();
			xml.endChildren();
		xml.endChildren();
	}
	xml.endChildren();

	// controllers
	xml.startElement("library_controllers");
	xml.startChildren();
	for(var i=0; i<worldControllers.length; ++i){
		var controller = worldControllers[i];
	}
	xml.endChildren();

	// lights
	xml.startElement("library_lights");
	xml.startChildren();
	for(var i=0; i<worldLights.length; ++i){
		var light = worldLights[i];
	}
	xml.endChildren();

	// physics

	// scenes
	xml.startElement("library_visual_scenes");
	xml.startChildren();
	var startScene = null;
	for(var i=0; i<worldScenes.length; ++i){
		var scene = worldScenes[i];
		var sceneID = scene["id"];
		var sceneName = scene["name"];
		var isDefault = scene["default"];
		var nodes = scene["nodes"];
		if(isDefault){
			startScene = scene;
		}
		xml.startElement("visual_scene");
		xml.setAttribute("id",sceneID);
		xml.setAttribute("name",sceneName);
		if(nodes.length>0){
			xml.startChildren();
			for(var j=0; j<nodes.length; ++j){
				var node = nodes[j];
				var nodeID = node["id"];
				var nodeName = node["name"];
				var transform = node["transform"];
				var instance = node["instance"];
				var material = node["material"];
				xml.startElement("node");
				xml.setAttribute("id",nodeID);
				xml.setAttribute("name",nodeName);
				xml.setAttribute("type","NODE");

				xml.startChildren();
					// xml.startElement("matrix");
					// xml.setAttribute("sid","transform");
					// xml.setValue(transform);
					var c = {"type":"matrix", "value":transform};
					Formats3D._daeListObjectToXMLValue(xml, c, "transform");

					xml.startElement("instance_geometry");
					xml.setAttribute("url","#"+instance["id"]);
					xml.setAttribute("name",instance["name"]);
					if(material){
						var materialID = material["id"];
					xml.startChildren();
						xml.startElement("bind_material");
						xml.startChildren();
							xml.startElement("technique_common");
							xml.startChildren();
								xml.startElement("instance_material");
								xml.setAttribute("target","#"+materialID);
								xml.setAttribute("symbol",materialID);
							xml.endChildren();
						xml.endChildren();
					xml.endChildren();
					}
				xml.endChildren();

			}
			xml.endChildren();
		}
	}
	xml.endChildren();

	// starting scene
	if(startScene){
		var sceneID = startScene["id"];
		xml.startElement("scene");
		xml.startChildren();
			xml.startElement("instance_visual_scene");
			xml.setAttribute("url","#"+sceneID);
		xml.endChildren();
	}

	// collada - end
	xml.endChildren();

	var str = xml.toString();
	return str;
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
