// ImageFeature.js
ImageFeature.MAX_POINT_LIST = 10;
// CENTRAL POINT GRADIENT
ImageFeature.SQUARE_SIZE_SELECT = 7;
// SIFT FEATURE 8x8
ImageFeature.DESCRIPTOR_SIZE_P4_B4 = 20; // before gradient
ImageFeature.DESCRIPTOR_SIZE_P4 = 16;
ImageFeature.ORIENTATION_SCALE_MULTIPLIER = 2.0; // 1.0-4.0
// SSD CENTERED ON POINT
ImageFeature.SSD_SIZE_B4 = 15; // before gauss
ImageFeature.SSD_SIZE = 13; // flat [padding=4]
ImageFeature.SURFACE_SCALE_MULTIPLIER = 1.50;
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
	this._sift = null; // gradient
	this._flat = null; // flatness
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
//this._affine.identity();
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
	scaler = ImageFeature.ORIENTATION_SCALE_MULTIPLIER;
	scaler = scaler / this.scale();
	rect = ImageMat.extractRectFromFloatImage(this.x(),this.y(),scaler,sigma, w,h, color,wid,hei, null); // iso-affine is unstable
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
ImageFeature.prototype.findDescriptor = function(origR,origG,origB,origY, wid,hei){
	// find primary stretching direction
		// ...
	// self find primary orientation:
	this.findOrientations(origR,origG,origB,origY, wid,hei);
	var primaryAngle = this._colorAngles.primaryAngle();
	this._affine.identity();
		// de-stretch
	this._affine = Matrix.transform2DRotate(this._affine, -primaryAngle);
	// generate SIFT feature
	var w = ImageFeature.DESCRIPTOR_SIZE_P4_B4;
	var h = w;
	var scaler = ImageFeature.ORIENTATION_SCALE_MULTIPLIER;
	scaler = scaler / this.scale();
	var sigma = 1.6;
	var win;
	win = ImageMat.extractRectFromFloatImage(this.x(),this.y(),scaler,sigma, w,h, origY,wid,hei, this._affine);
	Ix = ImageMat.derivativeX(win, w,h);
	Iy = ImageMat.derivativeY(win, w,h);
	// EACH COLOR
	this._sift = new SIFTDescriptor().fromGradients(Ix,Iy,w,h);
		win = ImageMat.extractRectFromFloatImage(this.x(),this.y(),scaler,sigma, w,h, origR,wid,hei, this._affine);
		Ix = ImageMat.derivativeX(win, w,h); Iy = ImageMat.derivativeY(win, w,h);
		this._siftR = new SIFTDescriptor().fromGradients(Ix,Iy,w,h);
		win = ImageMat.extractRectFromFloatImage(this.x(),this.y(),scaler,sigma, w,h, origG,wid,hei, this._affine);
		Ix = ImageMat.derivativeX(win, w,h); Iy = ImageMat.derivativeY(win, w,h);
		this._siftG = new SIFTDescriptor().fromGradients(Ix,Iy,w,h);
		win = ImageMat.extractRectFromFloatImage(this.x(),this.y(),scaler,sigma, w,h, origB,wid,hei, this._affine);
		Ix = ImageMat.derivativeX(win, w,h); Iy = ImageMat.derivativeY(win, w,h);
		this._siftB = new SIFTDescriptor().fromGradients(Ix,Iy,w,h);

	this.findSurface(origR,origG,origB,origY, wid,hei);
}
ImageFeature.prototype.SIFT = function(){
	return this._sift;
}
ImageFeature.prototype.findSurface = function(origR,origG,origB,origY, wid,hei){
	var rot = this._affine;
	var scaler = ImageFeature.SURFACE_SCALE_MULTIPLIER;
	var sigma = null;//1.6;
	var gauss1D = ImageMat.getGaussianWindow(7,1, sigma);
	//var w1 = ImageFeature.SSD_SIZE_B4, h1 = ImageFeature.SSD_SIZE_B4;
	var w2 = ImageFeature.SSD_SIZE, h2 = ImageFeature.SSD_SIZE;
	//var padding = Math.floor((ImageFeature.SSD_SIZE_B4 - ImageFeature.SSD_SIZE)*0.5);
	var rectRed, rectGrn, rectBlu, rectGry;
	scaler = scaler / this.scale();
	rectRed = ImageMat.extractRectFromFloatImage(this.x(),this.y(),scaler,sigma, w2,h2, origR,wid,hei, rot);
	rectGrn = ImageMat.extractRectFromFloatImage(this.x(),this.y(),scaler,sigma, w2,h2, origG,wid,hei, rot);
	rectBlu = ImageMat.extractRectFromFloatImage(this.x(),this.y(),scaler,sigma, w2,h2, origB,wid,hei, rot);
	rectGry = ImageMat.extractRectFromFloatImage(this.x(),this.y(),scaler,sigma, w2,h2, origY,wid,hei, rot);
	this._flat = new ColorMatRGBY(rectRed,rectGrn,rectBlu,rectGry, w2,h2);
}
ImageFeature.prototype.flat = function(){
	return this._flat;
}
// --------------------------------------------------------------------------------------------------------- OPERATIONAL
ImageFeature.prototype.clearPointList = function(){
	Code.emptyArray(this._pointList);
}
ImageFeature.prototype.addFeatureMatch = function(feature,score){
	if(feature==this){
		console.log("EQUALED");
	}
	this._pointList.push([feature,score]);
	this._pointList.sort(ImageFeature._sortPointList);
	if(this._pointList.length>ImageFeature.MAX_POINT_LIST){
		this._pointList.pop();
	}
}
ImageFeature._sortPointList = function(a,b){
	return a[1]-b[1]; //  smallest to largest
	//return b[1]-a[1]; // largest to smallest
}
ImageFeature.prototype._calculateScore = function(){
	return 0.0;
	var score = base + gradient + angle + scale; // large gradient = better, large color volume, ...
	return score;
}
ImageFeature.prototype.contrastSSDScore = function(){
	return this._flat.rangeAvg();
	//return this._flat.uniqueness();
}
// --------------------------------------------------------------------------------------------------------- CLASS
ImageFeature.bestRotation = function(featureA, featureB){ // how far to rotate B to best match A
	return ColorAngle.optimumAngle( featureA.colorAngle(), featureB.colorAngle() );
}
ImageFeature.compareFeatures = function(featureA, featureB){ // assume features are already in best comperable orientation
	// A
	// var scoreSSD = ColorMatRGBY.SSD(featureA.flat(),featureB.flat());
	// return scoreSSD;
	// B
	// var scoreCon = ColorMatRGBY.convolution(featureA.flat(),featureB.flat());
	// scoreCon = scoreCon==0? Number.MAX_VALUE : 1.0/scoreCon;
	// return scoreCon;
	// C
	// var scoreSIF = SIFTDescriptor.compare(featureA._sift,featureB._sift); // cross
	// scoreSIF = scoreSIF==0? Number.MAX_VALUE : 1.0/scoreSIF;
	// return scoreSIF;
	// D
	// var scoreSIF = SIFTDescriptor.compare(featureA._sift,featureB._sift); // ssd
	// return scoreSIF;
	// E
	// var sR = SIFTDescriptor.compare(featureA._siftR,featureB._siftR);
	// var sG = SIFTDescriptor.compare(featureA._siftG,featureB._siftG);
	// var sB = SIFTDescriptor.compare(featureA._siftB,featureB._siftB);
	// return (sR+sG+sB)*(1.0/3.0);

	var sR = SIFTDescriptor.compare(featureA._siftR,featureB._siftR);
	var sG = SIFTDescriptor.compare(featureA._siftG,featureB._siftG);
	var sB = SIFTDescriptor.compare(featureA._siftB,featureB._siftB);
	var scoreSSD = ColorMatRGBY.SSD(featureA.flat(),featureB.flat());
	return (sR+sG+sB)*(1.0/3.0) + scoreSSD;


	var scoreSSD = ColorMatRGBY.SSD(featureA.flat(),featureB.flat());
	var scoreSIF = SIFTDescriptor.compare(featureA._sift,featureB._sift);
	return scoreSSD + scoreSIF;

//var score = 1/ColorMatRGBY.convolution(featureA.flat(),featureB.flat());
	// var score = 16 - SIFTDescriptor.compare(featureA.bins(),featureB.bins());
	// featureA.addPointList(featureB,score);
	// featureB.addPointList(featureA,score);
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




