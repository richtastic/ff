// TextureMap.js

function TextureMap(){
	this._atlas = []; // list of textures
	this._mappings = []; // list of all texture triangles
}

TextureMap.prototype.addTriangle = function(tri3D, triList, imageList){
	var i,j, k;
	// for(i=0; i<locals.length; ++i){
	// 	console.log(i)
	// }
	// var triSource = new Tri3D(pntO,pntX,pntY);
	// var triA = new Tri2D(pntAO, pntAX, pntAY);
	// var triB = new Tri2D(pntBO, pntBX, pntBY);
	// var sameTriList = [triA,triB];
	// var sameImageList = [imageMatrixA,imageMatrixB];

	var mapping = R3D.textureFromTriangles(tri3D, triList, imageList);
	var textureMatrix = mapping["image"];
	var triOrigin = mapping["tri"];
	this.addMapping(mapping);

	console.log(textureMatrix);
	console.log(triOrigin);
	return mapping;
}
TextureMap.prototype.pack = function(){
	// go thru individual triangles & combine into texture
}

TextureMap.prototype.save = function(){
	// save all data to files
}

TextureMap.prototype.load = function(filename){
	// load all data from file
}


TextureMap.prototype.addMapping = function(m){
	//
	this._mappings.push(m);
}


TextureMap.Mapping = function(a){
	//
}
//