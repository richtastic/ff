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
	var map = new TextureMap.Mapping(size2D, data);
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
	throw "turn into textures ?"
}

TextureAtlas.prototype.addTriangleTexture = function(imageSource){
	// 
}



// --------------------------------------------------------------------------------------------------------------------
TextureAtlas.TextureImage = function(){
	this._id = null;
	this._filePath = null;
	this._source = null;
	this._loading = false;
	this._elements = [];
}
TextureAtlas.addElement = function(){

}




// --------------------------------------------------------------------------------------------------------------------
TextureAtlas.Mapping = function(size2D, data){
	// this._atlas = null;
	// this._tri3D = tri3D;
	// this._tris2D = tris2D;
	// this._triImage = triImage;
	this._data = data;
	var rect = new Rect(0,0, image.width(),image.height());
	rect.data(this);
	this._rect = rect;
}
TextureAtlas.Mapping.prototype.rect = function(rect){
	return this._rect;
}
TextureAtlas.Mapping.prototype.data = function(data){
	return this._data;
}



