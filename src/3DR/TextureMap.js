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
	console.log("PACKING ...");
	// go thru individual triangles & combine into texture
	var maxTextureSize = 512;
	var textureWidth = maxTextureSize;
	var textureHeight = maxTextureSize;
	var bounds = new Rect(0,0, textureWidth, textureHeight);
console.log(" 0 ");
	var mappings = this._mappings;
	var rects = [];
	for(i=0; i<mappings.length; ++i){
		var map = mappings[i];
		var rect = map.rect();
		rects.push(rect);
//console.log(map)
//console.log(i+": "+rect.width()+" x "+rect.height()+" = "+rect.area())
	}
	// TODO: separate textures into multiple atlases
	//var packed = Rect.pack(rects, bounds);
	var packing = Rect.pack(rects, bounds, true);
console.log(packing);
	var dead = packing["invalid"]; // TODO: something with unmapped tris => convert to multiple tris ? do this beforehand ?
	var bins = packing["bins"];
	var textures = [];
	for(i=0; i<bins.length; ++i){
		var bin = bins[i];
//console.log("bin: "+i)
		for(j=0; j<bin.length; ++j){
			var rect = bin[j];
			rect.data(i);
//console.log("rect: "+j+" / "+rect.data());
		}
		var texture = new ImageMat(textureWidth, textureHeight);
		textures[i] = texture;
	}
	//var atlas = [];
	// packing into single texture:
	
	for(i=0; i<mappings.length; ++i){
		var map = mappings[i];
		var rect = map.rect();
		var index = rect.data();
		//console.log(index);
		if(!Code.isNumber(index)){//if(index===undefined || index===null){
			continue;
		}
		var image = map.image();
		var origin = rect.min();
		var texture = textures[index];
		//console.log(texture)
		// copy to texture
		texture.insert(image, origin.x,origin.y);
		// replace
		map.image(texture);
		map.triImage().translate(origin);
	}

	// TODO: GET STAGE FROM SOMEWHERE ???
	var images = [];
	for(i=0; i<textures.length; ++i){
		var texture = textures[i];
		var img = GLOBALSTAGE.getFloatRGBAsImage(texture.red(),texture.grn(),texture.blu(), texture.width(),texture.height());
		images[i] = img;
		Code.addChild( Code.getBody(), img);
		Code.setStyleDisplay(img, "none");
	}

	for(i=0; i<mappings.length; ++i){
		var map = mappings[i];
		var rect = map.rect();
		var index = rect.data();
		var img = images[index];
		map.imageDOM(img);
	}


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