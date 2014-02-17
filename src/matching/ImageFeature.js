// ImageFeature.js
ImageFeature.MAX_POINT_LIST = 5;
function ImageFeature(x,y,scale, matrix){
	this._x = x;
	this._y = y;
	this._scale = s;
	this._affine = matrix;
	this._pointList = []; // ordered list of other points [BEST,..,WORST] [{point:ptX,score:0}]
	// this._bitmap = new ColorMatRGBY(x,y, wid,hei, origR,origG,origB,origY, ImageFeature.SQUARE_SIZE_SELECT,ImageFeature.SQUARE_SIZE_SELECT); // NxN bitmap of original point
	// this._colorBase = new ColorFloat();
	// this._colorGradient = new ColorGradient(); // R,G,B,A -inf,+inf
	// this._colorAngles = new ColorAngle(); // red,grn,blu,gry [0,2pi]
	// this._colorScale = 0.0; // scale at which is is most comperable? most corner like?
	// this._score = this._calculateScore(); // uniqueness/usefulness score
}
// --------------------------------------------------------------------------------------------------------- GETTER/SETTER
ImageFeature.prototype.x = function(x){
	if(x!==undefined){ this._x = x; }
	return this._x;
}
ImageFeature.prototype.y = function(y){
	if(y!==undefined){ this._y = y; }
	return this._y;
}
ImageFeature.prototype.scale = function(scale){
	if(scale!==undefined){ this._scale = scale; }
	return this._scale;
}
ImageFeature.prototype.transform = function(trans){
	if(trans!==undefined){ this._affine = trans; }
	return this._affine;
}
// --------------------------------------------------------------------------------------------------------- OPERATIONAL
ImageFeature.prototype.addPointList = function(feature,score){
	this._pointList.push([feature,score]);
	this._pointList.sort(this._sortPointList);
	if(this._pointList.length>ImageFeature.MAX_POINT_LIST){
		this._pointList.pop();
	}
}
ImageFeature.prototype._sortPointList = function(a,b){
	return a[1]-b[1];
}
ImageFeature.prototype._calculateScore = function(){
	return 0.0;
	var score = base + gradient + angle + scale; // large gradient = better, large color volume, ...
	return score;
}
// --------------------------------------------------------------------------------------------------------- CLASS
ImageFeature.compareFeatures = function(featureA, featureB){
	// calculate their relative score and place features in respective list
	var score = 0;
	return score;
	/*
	* relative orientation
		- eg is red CCW or CW from gray
	* relative color intensities
		- eg is red brighter than green
	if initial scores are obviously bad, don't bother detailed comparrison
	* orientation [-1,0,1]
	* scale [0.9,1.0,1.1]
	* SoSD [4x4,5x5,6x6]
	* correlation [4x4,5x5,6x6]
	* other?
	*/
}




