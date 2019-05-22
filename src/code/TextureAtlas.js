// TextureAtlas.js
/*
triangle 3D -> texture image -> texture 2D
loading / saving
*/
// --------------------------------------------------------------------------------------------------------------------
function TextureAtlas(size){
	this._maximumTextureSize = size.copy();
	this._textures = [];
	this._mappings = []; // list of all texture triangles
}
// --------------------------------------------------------------------------------------------------------------------
TextureAtlas.prototype.addTexture = function(location){
	var texture = TextureAtlas.TextureImage(location, width,height);
	this._textures.push(texture);
	return texture;
}
TextureAtlas.prototype.texture = function(index, texture){
	if(index!==undefined){
		if(this._textures.length>index){
			//
		}

	}

	return null;
}
// --------------------------------------------------------------------------------------------------------------------
TextureAtlas.prototype.loadTextures = function(){
	var textures = this._textures;
	for(var i=0; i<textures.length; ++i){
		var texture = textures[i];
		texture.load(this._textureLoaded,this);
	}
}
TextureAtlas.prototype._textureLoaded = function(){
	console.log("loaded");
}
TextureAtlas.prototype.addMapping = function(m){
	this._mappings.push(m);
}
TextureAtlas.prototype.addRectMapping = function(size2D, data){
	var map = new TextureAtlas.Mapping(size2D, data);
	this.addMapping(map);
	return map;
}
TextureAtlas.prototype.pack = function(){
	console.log("PACKING ...");
	// go thru individual triangles & combine into texture
	var maxTextureSize = this._maximumTextureSize;
	var textureWidth = maxTextureSize.x;
	var textureHeight = maxTextureSize.y;
	var bounds = new Rect(0,0, textureWidth, textureHeight);
	var mappings = this._mappings;
	var rects = [];
	var area = 0;
	for(i=0; i<mappings.length; ++i){
		var map = mappings[i];
		var rect = map.rect();
		rects.push(rect);
		area += rect.area();
	}
	console.log("areas: "+area+" / "+bounds.area()+" ~ "+(area/bounds.area()));
	var packing = Rect.packBins(rects, bounds);
	var impossible = packing["impossible"];
	var bins = packing["bins"];
	console.log(impossible);
	console.log(bins);
	// wrap & pass back
	var failed = [];
	for(var i=0; i<impossible.length; ++i){
		var rect = impossible[i];
		var mapping = rect.data();
		var item = mapping.data();
		var object = {"rect":rect, "data":item, "page":null};
		failed.push(object);
	}
	var success = [];
	for(var i=0; i<bins.length; ++i){
		var bin = bins[i];
		for(var j=0; j<bin.length; ++j){
			var rect = bin[j];
			var mapping = rect.data();
			var item = mapping.data();
			var object = {"rect":rect, "data":item, "page":i};
			success.push(object);
		}
	}
	return {"pages":bins.length, "success":success, "fail":failed};
}

// TextureAtlas.prototype.addTriangleTexture = function(imageSource){
// 	//
// }



// --------------------------------------------------------------------------------------------------------------------
TextureAtlas.TextureImage = function(location){
	this._id = null;
	this._location = null; // file / path
	this._source = null;
	this._loading = false;
	this._elements = [];
	this.location(location);
	if(width && height){ // create blank
		var image = new ImageMat(width,height);
		this.source(image);
	}
}
TextureAtlas.location = function(location){
	if(location!==undefined){
		this._location = location;
	}
	return this._location;
}
TextureAtlas.source = function(source){
	if(source!==undefined){
		this._source = source;
	}
	return this._source;
}
TextureAtlas.addElement = function(){

}




// --------------------------------------------------------------------------------------------------------------------
TextureAtlas.Mapping = function(size2D, data){
	data = data!==undefined? data : null;
	this._data = data;
	var rect = new Rect(0,0, size2D.x,size2D.y);
	rect.data(this);
	this._rect = rect;
}
TextureAtlas.Mapping.prototype.rect = function(rect){
	return this._rect;
}
TextureAtlas.Mapping.prototype.data = function(data){
	return this._data;
}
