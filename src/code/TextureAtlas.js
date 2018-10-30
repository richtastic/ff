// TextureAtlas.js
/*
triangle 3D -> texture image -> texture 2D
loading / saving
*/
// --------------------------------------------------------------------------------------------------------------------
function TextureAtlas(){
	this._textures = [];
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


TextureAtlas.prototype.addRectMapping = function(size2D, data){
	var map = new TextureAtlas.Mapping(size2D, data);
	this.addMapping(map);
	return map;
}
TextureAtlas.prototype.pack = function(){
	console.log("PACKING ...");
	// go thru individual triangles & combine into texture
	var maxTextureSize = this._maximumTextureSize;
	var textureWidth = maxTextureSize;
	var textureHeight = maxTextureSize;
	var bounds = new Rect(0,0, textureWidth, textureHeight);
console.log(" bounds: "+bounds);
	var mappings = this._mappings;
	var rects = [];
	for(i=0; i<mappings.length; ++i){
		var map = mappings[i];
		var rect = map.rect();
		rects.push(rect);
	}
	var packing = Rect.pack(rects, bounds, true);

	console.log(packing);

	var invalid = packing["invalid"];
	var bins = packing["bins"];

	console.log(invalid);
	console.log(bins);

	var objects = [];
	for(var i=0; i<bins.length; ++i){
		var bin = bins[i];
		for(var j=0; j<bin.length; ++j){
			var rect = bin[j];
			var mapping = rect.data();
			var item = mapping.data();
			var object = {"rect":rect, "object":object, "sheet":i};
			objects.push(object);
		}
	}
	if(invalid.length>0){
		throw "invalid ?";
	}
	// /return {"objects":objects, "rects":rects, "pages"};
	return {"sheets":bins.length, "objects":objects};
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
	// this._atlas = null;
	// this._tri3D = tri3D;
	// this._tris2D = tris2D;
	// this._triImage = triImage;
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



