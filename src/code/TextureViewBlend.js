// .js
// given: points <-> camera views; triangle surface
// decides which portions of which 
// combine textures from different views into single triangles - some flat, some blended 
/*
scene
texture
view
orientation
stitch / blend


DECISIONS:
	- surface normal
	- camera normal
	- camera-point distance
	- local image size [effective projected resolution]
	- obstructions
	- 

	- use 3D point neighbors to determine best triangle views to use
	- project triangle onto separate views
	- optimize simultaneous triangle projection 2D points
		- drop views with bad scores
		- drop views with triangle intersections [point / ray] and/or [3d parallelpiped / cylinder]
	
*/
// --------------------------------------------------------------------------------------------------------------------
function TextureViewBlend(){
	this._pointSpace = null;
	this._triangleSpace = null;
	this._views = [];
	this._images = null;
	this._textures = null;
	this._averageTriangleResolution = 10;
	this._maximumTriangleResolution = 128;
}
// --------------------------------------------------------------------------------------------------------------------
TextureViewBlend.prototype.addView = function(viewMatrix, viewSize){
	return viewID;
}
TextureViewBlend.prototype.addPoint = function(point3D,viewList,point2DList){
	//
}
TextureViewBlend.prototype.setTriangles = function(triangleList){
	//
}
TextureViewBlend.prototype.calculateTextureViews = function(){
	this._calculateBestViews();
	this._calculateTriangles();
}
TextureViewBlend.prototype._calculateBestViews = function(){
	// pick best views for each triangle/vertex [list of best target images] w/ some score associated with 'cost' of a view
}
TextureViewBlend.prototype._calculateTriangles = function(){
	// initialize triangle vertices - 
	// patch growing - expand regions to minimize frontier triangles
	// 
}
TextureViewBlend.prototype.combineTextures = function(imageList){ // blending logic / pack
	// 
}
TextureViewBlend.prototype.x = function(){
	
}
