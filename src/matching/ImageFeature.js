// ImageFeature.js
ImageFeature.MAX_POINT_LIST = 10;
// CENTRAL POINT GRADIENT
ImageFeature.SQUARE_SIZE_SELECT = 7;
// SIFT FEATURE 8x8
ImageFeature.DESCRIPTOR_SIZE_P4 = 16; // before gradient
ImageFeature.DESCRIPTOR_SIZE = 8; // 8x8=64, 4x4=16 after gradient [padding=4]
// SSD CENTERED ON POINT
ImageFeature.SSD_SIZE_B4 = 15; // before gauss
ImageFeature.SSD_SIZE = 13; // flat [padding=4]
// ImageFeature.SSD_SIZE_B4 = 15; // before gauss
// ImageFeature.SSD_SIZE = 7; // flat [padding=4]
ImageFeature.YAML = {
	X:"x",
	Y:"y",
	SCALE:"scale",
	VALUE:"value",
	AFFINE:"affine",
		A:"a",
		B:"b",
		C:"c",
		D:"d"
}
function ImageFeature(x,y,scale,ssValue, matrix){
	this._x = x;
	this._y = y;
	this._scale = scale;
	this._ssValue = ssValue;
	this._affine = (matrix!==undefined&&matrix!==null)?matrix:((new Matrix(3,3)).identity());
	this._pointList = []; // ordered list of other points [BEST,..,WORST] [{point:ptX,score:0}]
	this._colorAngles = null; // red,grn,blu,gry [0,2pi]
	this._bins = null; // gradient
	this._flat = null; // flatness
	// non-processed objects:
	this._descriptor = null;
	// this._bitmap = null;
	// this._colorBase = new ColorFloat();
	// this._colorGradient = new ColorGradient(); // R,G,B,A -inf,+inf
}
ImageFeature.prototype.saveToYAML = function(yaml){
	var DATA = ImageFeature.YAML;
	yaml.writeNumber(DATA.X, this._x );
	yaml.writeNumber(DATA.Y, this._y );
	yaml.writeNumber(DATA.SCALE, this._scale );
	yaml.writeNumber(DATA.VALUE, this._ssValue );
	if(this._affine!=null){
		yaml.writeObjectStart(DATA.AFFINE);
			yaml.writeNumber(DATA.A,this._affine.get(0,0));
			yaml.writeNumber(DATA.B,this._affine.get(0,1));
			yaml.writeNumber(DATA.C,this._affine.get(1,0));
			yaml.writeNumber(DATA.D,this._affine.get(1,1));
		yaml.writeObjectEnd();
	}else{
		yaml.writeNull(DATA.AFFINE);
	}
}
ImageFeature.prototype.loadFromYAML = function(yaml){
	var DATA = ImageFeature.YAML;
	this._x = yaml[DATA.X];
	this._y = yaml[DATA.Y];
	this._scale = yaml[DATA.SCALE];
	this._ssValue = yaml[DATA.VALUE];
	var obj = yaml[DATA.AFFINE];
	if(obj!=null){
		this._affine = new Matrix(3,3);
		this._affine.set(0,0, obj[DATA.A]);
		this._affine.set(0,1, obj[DATA.B]);
		this._affine.set(1,0, obj[DATA.C]);
		this._affine.set(1,1, obj[DATA.D]);
		this._affine.set(2,2, 1.0);
this._affine.identity();
	}else{
		this._affine = new Matrix(3,3);
		this._affine.identity();
	}
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
ImageFeature.prototype.angleFromColors = function(color, wid,hei){
	var rect, gradX, gradY;
	var Ix, Iy, src, mag, ang, sigma, scaler, g = new V2D(), x = new V2D(1,0);
	var w = ImageFeature.SQUARE_SIZE_SELECT, h = ImageFeature.SQUARE_SIZE_SELECT;
	var cenX = Math.floor(w*0.5), cenY = Math.floor(h*0.5);
	// get zoomed rectangle
	sigma = undefined;
	scaler = ImageDescriptor.SCALE_MULTIPLIER*1.0; // increase the gaussian effect
	rect = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w,h, color,wid,hei, null); // iso-affine is unstable
	//rect = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w,h, color,wid,hei, this.transform());
	// blur
	sigma = 1.6;
	var gauss1D = ImageMat.getGaussianWindow(7,1, sigma);
	src = ImageMat.gaussian2DFrom1DFloat(rect, w,h, gauss1D);
	//src = rect;
	// find gradient
	Ix = ImageMat.derivativeX(src, w,h);
	Iy = ImageMat.derivativeY(src, w,h);
	g.set(Ix[w*cenY + cenX], Iy[w*cenY + cenX]);
	// angle with x-axis
	mag = g.length();
	ang = V2D.angleDirection(x,g);
	return {angle:ang, magnitude:mag};
}
ImageFeature.prototype.colorAngle = function(){
	return this._colorAngles;
}
ImageFeature.prototype.findOrientations = function(origR,origG,origB,origY, wid,hei){
	var obj, angRed, angGrn, angBlu, angGry;
	obj = this.angleFromColors(origR,wid,hei);
	angRed = obj.angle;
	magRed = obj.magnitude;
	obj = this.angleFromColors(origG,wid,hei);
	angGrn = obj.angle;
	magGrn = obj.magnitude;
	obj = this.angleFromColors(origB,wid,hei);
	angBlu = obj.angle;
	magBlu = obj.magnitude;
	obj = this.angleFromColors(origY,wid,hei);
	angGry = obj.angle;
	magGry = obj.magnitude;
	this._colorAngles = new ColorAngle(angRed,angGrn,angBlu,angGry, magRed,magGrn,magBlu,magGry);
}
ImageFeature.prototype.findDescriptor = function(origR,origG,origB,origY, wid,hei, ang){
	var rectRed, rectGrn, rectBlu, rectGry;
	var gradRedX, gradGrnX, gradBluX, gradGryX, gradRedY, gradGrnY, gradBluY, gradGryY;
	var Ix, Iy, src, mag, sigma, w, h, g=new V2D(), x=new V2D(1,0), rot = new Matrix(3,3); 

// LOOK AT GRADIENT SUMMED - MAGNITUDES
// WOULD THAT BY DEFNITION EQUAL THE GRAY

	// bins
	scaler = ImageDescriptor.SCALE_MULTIPLIER*1.0;
	w = ImageFeature.DESCRIPTOR_SIZE_P4; h = ImageFeature.DESCRIPTOR_SIZE_P4;
	rot.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1.0]);
	rot = Matrix.mult(rot,this.transform());
	sigma = undefined;
	rectGry = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w,h, origY,wid,hei, rot);
	// sigma = 1.6;
	// var gauss1D = ImageMat.getGaussianWindow(7,1, sigma);
	// src = ImageMat.gaussian2DFrom1DFloat(rectGry, w,h, gauss1D);
	src = rectGry;
	Ix = ImageMat.derivativeX(src, w,h);
	Iy = ImageMat.derivativeY(src, w,h);	
	this._bins = new SIFTDescriptor();
	this._bins.fromGradients(Ix,Iy,w,h);
}
ImageFeature.prototype.bins = function(){
	return this._bins;
}
ImageFeature.prototype.findSurface = function(origR,origG,origB,origY, wid,hei, ang){
	var rot = new Matrix(3,3);
	rot.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1.0]);
	rot = Matrix.mult(rot,this.transform());
// WAYS TO FIX: larger scale
	var scaler = ImageDescriptor.SCALE_MULTIPLIER*16.0;
	var sigma = 1.6;
	var gauss1D = ImageMat.getGaussianWindow(7,1, sigma);
	var w1 = ImageFeature.SSD_SIZE_B4, h1 = ImageFeature.SSD_SIZE_B4;
	var w2 = ImageFeature.SSD_SIZE, h2 = ImageFeature.SSD_SIZE;
	var padding = Math.floor((ImageFeature.SSD_SIZE_B4 - ImageFeature.SSD_SIZE)*0.5);
	var rectRed, rectGrn, rectBlu, rectGry;
	sigma = undefined;
	// rectRed = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w1,h1, origR,wid,hei, rot);
	// rectRed = ImageMat.gaussian2DFrom1DFloat(rectRed, w1,h1, gauss1D);
	// rectRed = ImageMat.unpadFloat(rectRed,w1,h1, padding,padding,padding,padding);
	// rectGrn = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w1,h1, origG,wid,hei, rot);
	// rectGrn = ImageMat.gaussian2DFrom1DFloat(rectGrn, w1,h1, gauss1D);
	// rectGrn = ImageMat.unpadFloat(rectGrn,w1,h1, padding,padding,padding,padding);
	// rectBlu = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w1,h1, origB,wid,hei, rot);
	// rectBlu = ImageMat.gaussian2DFrom1DFloat(rectBlu, w1,h1, gauss1D);
	// rectBlu = ImageMat.unpadFloat(rectBlu,w1,h1, padding,padding,padding,padding);
	// rectGry = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w1,h1, origY,wid,hei, rot);
	// rectGry = ImageMat.gaussian2DFrom1DFloat(rectGry, w1,h1, gauss1D);
	// rectGry = ImageMat.unpadFloat(rectGry,w1,h1, padding,padding,padding,padding);
	rectRed = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w2,h2, origR,wid,hei, rot);
	rectGrn = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w2,h2, origG,wid,hei, rot);
	rectBlu = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w2,h2, origB,wid,hei, rot);
	rectGry = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*scaler,sigma, w2,h2, origY,wid,hei, rot);
	this._flat = new ColorMatRGBY(rectRed,rectGrn,rectBlu,rectGry, w2,h2);
}
ImageFeature.prototype.flat = function(){
	return this._flat;
}
// --------------------------------------------------------------------------------------------------------- OPERATIONAL
ImageFeature.prototype.clearPointList = function(){
	Code.emptyArray(this._pointList);
}
ImageFeature.prototype.addPointList = function(feature,score){
	this._pointList.push([feature,score]);
	this._pointList.sort(ImageFeature._sortPointList);
	if(this._pointList.length>ImageFeature.MAX_POINT_LIST){
		this._pointList.pop();
	}
}
ImageFeature._sortPointList = function(a,b){
	return a[1]-b[1];
	//return a[1]-b[1]; //
}
ImageFeature.prototype._calculateScore = function(){
	return 0.0;
	var score = base + gradient + angle + scale; // large gradient = better, large color volume, ...
	return score;
}
ImageFeature.prototype.descriptor = function(d){
	if(d!==undefined){ this._descriptor=d; }
	return this._descriptor;
}
// --------------------------------------------------------------------------------------------------------- CLASS
ImageFeature.bestRotation = function(featureA, featureB){ // how far to rotate B to best match A
	return ColorAngle.optimumAngle( featureA.colorAngle(), featureB.colorAngle() );
}
ImageFeature.compareFeatures = function(featureA, featureB){
	// assume features are already in best comperable orientation
	// console.log( "SIFT: "+SIFTDescriptor.compare(featureA.bins(),featureB.bins()) );
	// console.log( "SSD:  "+ColorMatRGBY.SSD(featureA.flat(),featureB.flat()) );
	// console.log( "conv: "+ColorMatRGBY.convolution(featureA.flat(),featureB.flat()) );
	// calculate their relative score and place features in respective list
//var score = ColorMatRGBY.SSD(featureA.flat(),featureB.flat());
//var score = 1/ColorMatRGBY.convolution(featureA.flat(),featureB.flat());
var score = 16 - SIFTDescriptor.compare(featureA.bins(),featureB.bins());
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




