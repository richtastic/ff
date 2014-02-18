// ImageFeature.js
ImageFeature.MAX_POINT_LIST = 5;
ImageFeature.DESCRIPTOR_SIZE_P4 = 12; // before gradient
ImageFeature.DESCRIPTOR_SIZE = 8; // 8x8=64, 4x4=16 after gradient
ImageFeature.SQUARE_SIZE_SELECT = 9; // before gauss
ImageFeature.SSD_SIZE = 7; // flat
ImageFeature.YAML = {
	X:"x",
	Y:"y",
	SCALE:"scale",
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
		if(this._affine!=null){
			yaml.writeObjectStart(DATA.AFFINE);
				yaml.writeNumber(DATA.A,this._affine.get(0,0));
				yaml.writeNumber(DATA.B,this._affine.get(0,1));
				yaml.writeNumber(DATA.C,this._affine.get(1,0));
				yaml.writeNumber(DATA.D,this._affine.get(1,1));
			yaml.writeObjectEnd();
			// yaml.writeObjectStart(DATA.AFFINE);
			// 	this._affine.saveToYAML(yaml);
			// yaml.writeObjectEnd();
		}else{
			yaml.writeNull(DATA.AFFINE);
		}
	//yaml.writeNumber(DATA.AFFINE, this._scale );
}
ImageFeature.prototype.loadFromYAML = function(yaml){
	console.log("LOAD FROM YAML..");
	console.log(yaml);
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
	var rectRed, rectGrn, rectBlu, rectGry;
	var gradRedX, gradGrnX, gradBluX, gradGryX, gradRedY, gradGrnY, gradBluY, gradGryY;
	var Ix, Iy, src, mag, ang, sigma, g = new V2D(), x = new V2D(1,0);
	var w = ImageFeature.SQUARE_SIZE_SELECT, h = ImageFeature.SQUARE_SIZE_SELECT;
	var cenX = Math.floor(w*0.5), cenY = Math.floor(h*0.5);


	// find gradient
	sigma = undefined;
	rectGry = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*ImageDescriptor.SCALE_MULTIPLIER,sigma, w,h, origY,wid,hei, this.transform());
	sigma = 1.0;
	var gauss1D = ImageMat.getGaussianWindow(7,1, sigma);
	src = ImageMat.gaussian2DFrom1DFloat(rectGry, w,h, gauss1D);
	//src = rectGry;
	Ix = ImageMat.derivativeX(src, w,h);
	Iy = ImageMat.derivativeY(src, w,h);
	g.set(Ix[w*cenY + cenX], Iy[w*cenY + cenX]);
	// angle with x-axis
	mag = g.length()
	ang = V2D.angleDirection(x,g);
	//console.log(ang*180/Math.PI);


	// bins
	w = ImageFeature.DESCRIPTOR_SIZE_P4; h = ImageFeature.DESCRIPTOR_SIZE_P4;
	cenX = Math.floor(w*0.5); cenY = Math.floor(h*0.5);
	rectGry = ImageMat.extractRectFromFloatImage(this.x(),this.y(),this.scale()*ImageDescriptor.SCALE_MULTIPLIER,sigma, w,h, origY,wid,hei);
	src = rectGry;
	Ix = ImageMat.derivativeX(src, w,h);
	Iy = ImageMat.derivativeY(src, w,h);
	
	this._bins = new SIFTDescriptor();
	this._bins.fromGradients(Ix,Iy,w,h);
//	console.log(this._bins.toString());

return;

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
// ImageFeature.prototype._collectBins = function(Ix,Iy,w,h){
// 	console.log( "---------------------------------------------------------" );
// 	var i, j, bin, cenX = Math.floor(w*0.5), cenY = Math.floor(h*0.5), v = new V2D(), x = new V2D(1,0);
// 	bin = new GradBinDescriptor(); bin.clear();
// 	for(i=cenX-4;i<cenX;++i){ // TL
// 		for(j=cenY-4;j<cenY;++j){
// 			v.set(Ix[w*j + i], Iy[w*j + i]);
// 			ang = V2D.angleDirection(x,v);
// 			bin.addAngle(ang);
// 		}
// 	}
// 	console.log( bin.toString() );
// 	bin = new GradBinDescriptor(); bin.clear();
// 	for(i=cenX;i<cenX+4;++i){ // TR
// 		for(j=cenY-4;j<cenY;++j){
// 			v.set(Ix[w*j + i], Iy[w*j + i]);
// 			ang = V2D.angleDirection(x,v);
// 			bin.addAngle(ang);
// 		}
// 	}
// 	console.log( bin.toString() );
// 	bin = new GradBinDescriptor(); bin.clear();
// 	for(i=cenX-4;i<cenX;++i){ // BL
// 		for(j=cenY;j<cenY+4;++j){
// 			v.set(Ix[w*j + i], Iy[w*j + i]);
// 			ang = V2D.angleDirection(x,v);
// 			bin.addAngle(ang);
// 		}
// 	}
// 	console.log( bin.toString() );
// 	bin = new GradBinDescriptor(); bin.clear();
// 	for(i=cenX;i<cenX+4;++i){ // BR
// 		for(j=cenY;j<cenY+4;++j){
// 			v.set(Ix[w*j + i], Iy[w*j + i]);
// 			ang = V2D.angleDirection(x,v);
// 			bin.addAngle(ang);
// 		}
// 	}
// 	console.log( bin.toString() );
// }
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




