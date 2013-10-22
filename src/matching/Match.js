// Match.js
function Match(){
	this._canvas = new Canvas(null, null, 1600,600, Canvas.STAGE_FIT_FIXED, false);
	this._imageList = new Array();
	var imageLoader = new ImageLoader("./images/medium/",["FL.png","FLT.png"],this,this._imageCompleteFxn,this._imageProgressFxn);
	imageLoader.load();
}
Match.prototype._imageProgressFxn = function(o){
}
Match.prototype._imageCompleteFxn = function(o){
	Code.copyArray(this._imageList,o.images);
	var images = o.images;
	var img = images[0];
	var ox = 0;
	var oy = 0;
	var wid = img.width;
	var hei = img.height;
	this._canvas.drawImage2(img, 0,0);
	// 
 	var dat = this._canvas.getColorArrayARGB(ox,oy,wid,hei);
 	var img = new ImageMat(wid,hei);
 	img.setFromArrayARGB(dat);
	 	var normR = ImageMat.historize0255( ImageMat.zero255FromFloat(img.getRedFloat()) );
	 	var normG = ImageMat.historize0255( ImageMat.zero255FromFloat(img.getGrnFloat()) );
	 	var normB = ImageMat.historize0255( ImageMat.zero255FromFloat(img.getBluFloat()) );
	 	// var normR = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getRedFloat()) );
	 	// var normG = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getGrnFloat()) );
	 	// var normB = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getBluFloat()) );
	 	dat = ImageMat.ARGBFromRGBArrays(normR,normG,normB);
 	ImageMat.colorArrayFxnRGB_ARGB(dat,this.colBrightNess);
 	this._canvas.setColorArrayARGB(dat, ox,oy,wid,hei);
 	
 	img.setFromArrayARGB(dat);
 	
 	
	
 	
 	var gray = img.getGrayFloat();
 	var red = img.getRedFloat(); 
 	var grn = img.getGrnFloat(); 
 	var blu = img.getBluFloat(); 
 	ImageMat.normalFloat01(gray);
 	ImageMat.normalFloat01(red);
 	ImageMat.normalFloat01(grn);
 	ImageMat.normalFloat01(blu);
 	//gray = red;
 	//gray = grn;
 	//gray = blu;
 	var grad = ImageMat.convolve(gray,wid,hei, [0,-0.5,0, -0.5,0,0.5, 0,0.5,0], 3,3); // grad
 	var dx = ImageMat.convolve(gray,wid,hei, [-0.5,0,0.5], 3,1); // dx
 	var dy = ImageMat.convolve(gray,wid,hei, [-0.5,0,0.5], 1,3); // dy
 	var corner = ImageMat.convolve(gray,wid,hei, [0.25,-0.5,0.25, -0.5,1,-0.5, 0.25,-0.5,0.25], 1,3); // corner
 		var vectorSum = ImageMat.vectorSumFloat(dx,dy);
 			ImageMat.normalFloat01(vectorSum);
 		var phase = ImageMat.phaseFloat(dx,dy);
 			ImageMat.normalFloat01(phase);
 		var vectorSquare = ImageMat.vectorSquaredSumFloat(dx,dy); // BAD
 			ImageMat.normalFloat01(vectorSquare);
 			//ImageMat.squareFloat(dat);
 		 	//dat = ImageMat.mulFloat(vectorSum,phase);

 	// ImageMat.applyFxnFloat(dat,this.fxnOp1);

 	// 1
 	dat = vectorSum;
 	ImageMat.normalFloat01(dat);
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+wid-150,oy+0,wid,hei);
	
	// 2
	dat = ImageMat.addFloat(ImageMat.absFloat(dx),ImageMat.absFloat(dy));
	ImageMat.normalFloat01(dat);
var r1 = dat;
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+2*(wid-150),oy+0,wid,hei);

 	// 3
	dat = grad;
	ImageMat.normalFloat01(dat);
		//ImageMat.applyFxnFloat(dat,this.fxnOp0);
		//ImageMat.normalFloat01(dat);
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+3*(wid-150),oy+0,wid,hei);
 	
 	// 4
	dat = corner;
	ImageMat.normalFloat01(dat);
		ImageMat.applyFxnFloat(dat,this.fxnOp0);
		ImageMat.normalFloat01(dat);
var r2 = dat;
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+4*(wid-150),oy+0,wid,hei);

 	// 5
	dat = ImageMat.mulFloat(r1,r2);
	ImageMat.normalFloat01(dat);
		// ImageMat.squareFloat(dat);
		// ImageMat.normalFloat01(dat);
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+5*(wid-150),oy+0,wid,hei);
}
Match.prototype.colBrightNess = function(c){ //c = Math.round(c/10)*10;
	return c;
	var rnd = 50;
	return Math.round(Math.round(c/rnd)*rnd);
}

Match.prototype.fxnOp0 = function(f){ 
	return Math.abs(f-0.5);
}
Match.prototype.fxnOp1 = function(f){ 
	return 10000 - Math.pow((f-0.5)*100,2);
}

/*

local maxima
corners
color signatures (gradient/direction)
histogram-equalize (before all)
sharpen
blurr
convolution
sum of squared differences

*/