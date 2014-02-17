// ImageFeature.js
ImageFeature.MAX_POINT_LIST = 5;
ImageFeature.SQUARE_SIZE_SELECT = 9;
ImageFeature.DESCRIPTOR_SIZE = 8; // 8x8=64, 4x4=16
function ImageFeature(x,y,scale,ssValue, matrix){
	this._x = x;
	this._y = y;
	this._scale = scale;
	this._ssValue = ssValue;
	this._affine = matrix;
	this._pointList = []; // ordered list of other points [BEST,..,WORST] [{point:ptX,score:0}]
	this._colorAngles = null; // red,grn,blu,gry [0,2pi]
	this._bins = null;
	// non-processed objects:
	// this._bitmap = null;
	// this._colorBase = new ColorFloat();
	// this._colorGradient = new ColorGradient(); // R,G,B,A -inf,+inf
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
ImageFeature.prototype.scaleSpaceCornerness = function(ssc){
	if(ssc!==undefined){ this._ssValue = ssc; }
	return this._ssValue;
}
ImageFeature.prototype.transform = function(trans){
	if(trans!==undefined){ this._affine = trans; }
	return this._affine;
}
// --------------------------------------------------------------------------------------------------------- DERIVED DATA
ImageFeature.prototype.findDescriptorData = function(origR,origG,origB,origY, wid,hei){
	var rect;
	// extract a square
	var sigma = undefined;
	rect = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*ImageDescriptor.SCALE_MULTIPLIER,sigma,
		ImageFeature.SQUARE_SIZE_SELECT,ImageFeature.SQUARE_SIZE_SELECT, origY,wid,hei, this.transform());
	// find gradient
	// angle with x-axis

	// primary gradients
	this._colorAngles = new ColorAngle(angR,angG,angB,angY);

	// gradient magnitude?


	// descriptor
	this._bins = new GradBinDescriptor();

	// findAnglesRGBY
	// 1) get characteristic window
	//		- scale point up/down to characteristic size
	//		- affine-transform to isotropic-scale
	//		- rotate to primary gradient
	// 2) get gradient descriptor (lowe)
	//		- 3x3
	// 3) R,G,B
	// 		- gradient descriptor, gradient magnitude, gradient angle, 
	// ) 
	// ) 
}

ImageFeature.prototype.findAnglesRGBY = function(origR,origG,origB,origY, wid,hei){
	var angR, angG, angB, angY;
	this._colorAngles = new ColorAngle(angR,angG,angB,angY);
}
ImageFeature.prototype.findDescriptorRGBY = function(origR,origG,origB,origY, wid,hei){
	// rotate to primary direction
	// extract image squares
	// calculate gradient
	// bin gradients into features
}


ImageFeature.prototype.setCompare = function(x,y, wid,hei, origR,origG,origB,origY, angle){
	this._bitmap = new ColorMatRGBY(x,y, wid,hei, origR,origG,origB,origY, angle, ImageFeature.SQUARE_SIZE_SELECT,ImageFeature.SQUARE_SIZE_SELECT);
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
	// 
	featureA.addPointList(featureB,score);
	featureB.addPointList(featureA,score);
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




