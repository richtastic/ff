// ImageFeature.js
ImageFeature.MAX_POINT_LIST = 10;
ImageFeature.DESCRIPTOR_SIZE_P4 = 12; // before gradient
ImageFeature.DESCRIPTOR_SIZE = 8; // 8x8=64, 4x4=16 after gradient
ImageFeature.SQUARE_SIZE_SELECT = 11; // before gauss
ImageFeature.SSD_SIZE = 7; // flat
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
	this._affine = matrix;
	this._pointList = []; // ordered list of other points [BEST,..,WORST] [{point:ptX,score:0}]
	this._colorAngles = null; // red,grn,blu,gry [0,2pi]
	this._bins = null;
	// non-processed objects:
	this._descriptor = null;
	// this._bitmap = null;
	// this._colorBase = new ColorFloat();
	// this._colorGradient = new ColorGradient(); // R,G,B,A -inf,+inf
	// this._colorScale = 0.0; // scale at which is is most comperable? most corner like?
	// this._score = this._calculateScore(); // uniqueness/usefulness score
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
		this._affine = null;
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
	scaler = ImageDescriptor.SCALE_MULTIPLIER*2.0; // increase the gaussian effect
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
	mag = g.length()
	ang = V2D.angleDirection(x,g);
	return ang;
}
ImageFeature.prototype.colorAngle = function(){
	return this._colorAngles;
}
ImageFeature.prototype.findOrientations = function(origR,origG,origB,origY, wid,hei){
	var angRed, angGrn, angBlu, angGry;
	angRed = this.angleFromColors(origR,wid,hei);
	angGrn = this.angleFromColors(origG,wid,hei);
	angBlu = this.angleFromColors(origB,wid,hei);
	angGry = this.angleFromColors(origY,wid,hei);
	this._colorAngles = new ColorAngle(angRed,angGrn,angBlu,angGry);
}
ImageFeature.prototype.findDescriptor = function(origR,origG,origB,origY, wid,hei, ang){
	// findDescriptor - USING ANGLE
	var rectRed, rectGrn, rectBlu, rectGry;
	var gradRedX, gradGrnX, gradBluX, gradGryX, gradRedY, gradGrnY, gradBluY, gradGryY;
	var Ix, Iy, src, mag, ang, sigma, g = new V2D(), x = new V2D(1,0);
	var w = ImageFeature.SQUARE_SIZE_SELECT, h = ImageFeature.SQUARE_SIZE_SELECT;
	var cenX = Math.floor(w*0.5), cenY = Math.floor(h*0.5);

	// bins
	w = ImageFeature.DESCRIPTOR_SIZE_P4; h = ImageFeature.DESCRIPTOR_SIZE_P4;
	cenX = Math.floor(w*0.5); cenY = Math.floor(h*0.5);
	rectGry = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*ImageDescriptor.SCALE_MULTIPLIER,sigma, w,h, origY,wid,hei);
	src = rectGry;
	Ix = ImageMat.derivativeX(src, w,h);
	Iy = ImageMat.derivativeY(src, w,h);	
	this._bins = new SIFTDescriptor();
	this._bins.fromGradients(Ix,Iy,w,h);
	// gradient magnitude?
}
ImageFeature.prototype.findSurface = function(origR,origG,origB,origY, wid,hei, ang){
	// findSurface - USING ANGLE
	var rect = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*ImageDescriptor.SCALE_MULTIPLIER,sigma, w,h, origY,wid,hei);
	//this._bitmap = new ColorMatRGBY(x,y, wid,hei, origR,origG,origB,origY, angle, ImageFeature.SQUARE_SIZE_SELECT,ImageFeature.SQUARE_SIZE_SELECT);
}
// --------------------------------------------------------------------------------------------------------- OPERATIONAL
ImageFeature.prototype.clearPointList = function(){
	Code.clearArrau(this._pointList);
}
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
ImageFeature.prototype.descriptor = function(d){
	if(d!==undefined){ this._descriptor=d; }
	return this._descriptor;
}
// --------------------------------------------------------------------------------------------------------- CLASS
ImageFeature.bestRotation = function(featureA, featureB){ // how far to rotate B to best match A
	return ColorAngle.optimumAngle( featureA.colorAngle(), featureB.colorAngle() );
}
ImageFeature.compareFeatures = function(featureA, featureB){

	featureA.findDescriptorData(origR,origG,origB,origY, wid,hei);



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




