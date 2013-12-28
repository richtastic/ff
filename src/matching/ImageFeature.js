// ImageFeature.js
// ImageFeature.MAX_ = 0;
// ImageFeature.SQUARE_SIZE = 5; // NxN comparable point
// ImageFeature.SQUARE_SIZE_SELECT = Math.ceil(ImageFeature.SQUARE_SIZE*2);//1.414); // NxN before rotation

function ImageFeature(img, x,y,w, matrix){
	this._image = img;
	this._x = x;
	this._y = y;
	this._weight = w;
	this._matrix = matrix;
	this._pointList = []; // ordered list of other points [BEST,..,WORST] [{point:ptX,score:0}]
	return;
	// this._bitmap = new ColorMatRGBY(x,y, wid,hei, origR,origG,origB,origY, ImageFeature.SQUARE_SIZE_SELECT,ImageFeature.SQUARE_SIZE_SELECT); // NxN bitmap of original point
	// this._colorBase = new ColorFloat();
	// this._colorGradient = new ColorGradient(); // R,G,B,A -inf,+inf
	// this._colorAngles = new ColorAngle(); // red,grn,blu,gry [0,2pi]
	// this._colorScale = 0.0; // scale at which is is most comperable? most corner like?
	// this._score = this._calculateScore(); // uniqueness/usefulness score
}
ImageFeature.prototype._calculateScore = function(){
	return 0.0;
	var score = base + gradient + angle + scale ; // large gradient = better, large color volume, ...
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

