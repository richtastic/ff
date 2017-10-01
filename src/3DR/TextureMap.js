// TextureMap.js

function TextureMap(){
	this._atlas = []; // list of textures
	//this._textures = []; // ?
	this._mappings = []; // list of all texture triangles
}

TextureMap.prototype.addTriangle = function(tri3D, triList, imageList){
	var i,j, k;

	var mapping = R3D.textureFromTriangles(tri3D, triList, imageList);
	var textureMatrix = mapping["image"];
	var triOrigin = mapping["tri"];
	var map = new TextureMap.Mapping(tri3D, triList, triOrigin, textureMatrix);
	this.addMapping(map);
	// console.log(textureMatrix);
	// console.log(triOrigin);

	return map;
}
TextureMap.prototype.pack = function(){
	var i, j, k;
	// go thru individual triangles & combine into texture
	var maxTextureSize = 512;
	var textureWidth = maxTextureSize;
	var textureHeight = maxTextureSize;
	var bounds = new Rect(0,0, textureWidth, textureHeight);

	var mappings = this._mappings;
	var rects = [];
	for(i=0; i<mappings.length; ++i){
		var map = mappings[i];
		var rect = map.rect();
		rects.push(rect);
	}
	// TODO: separate textures into multiple atlases
	var packed = Rect.pack(rects, bounds);

	// packing into single texture:
	var texture = new ImageMat(textureWidth, textureHeight);
	for(i=0; i<mappings.length; ++i){
		var map = mappings[i];
		var image = map.image();
		var rect = map.rect();
		var origin = rect.min();
		// copy to texture
		texture.insert(image, origin.x,origin.y);
		// replace
		map.image(texture);
		map.triImage().translate(origin);
	}


	// TODO: GET STAGE FROM SOMEWHERE ???
	var img = GLOBALSTAGE.getFloatRGBAsImage(texture.red(),texture.grn(),texture.blu(), texture.width(),texture.height());
	for(i=0; i<mappings.length; ++i){
		var map = mappings[i];
		map.imageDOM(img);
	}

	Code.addChild( Code.getBody(), img);

	//var texture = new ImageMat(textureWidth, textureHeight);
}

TextureMap.prototype.save = function(){
	// save all data to files
}

TextureMap.prototype.load = function(filename){
	// load all data from file
}


TextureMap.prototype.addMapping = function(m){
	this._mappings.push(m);
}


TextureMap.Mapping = function(tri3D, tris2D, triImage, image){
	this._atlas = null;
	this._tri3D = tri3D;
	this._tris2D = tris2D;
	this._triImage = triImage;
	this._image = image;
	var rect = new Rect(0,0, image.width(),image.height());
	rect.data(this);
	this._rect = rect;
}
TextureMap.Mapping.prototype.rect = function(r){
	return this._rect;
}
TextureMap.Mapping.prototype.image = function(i){
	return this._image;
}
TextureMap.Mapping.prototype.triImage = function(t){
	return this._triImage;
}
TextureMap.Mapping.prototype.tri3D = function(t){
	return this._tri3D;
}
TextureMap.Mapping.prototype.imageDOM = function(i){
	if(i!==undefined){
		this._imageDOM = i;
	}
	return this._imageDOM;
}
//