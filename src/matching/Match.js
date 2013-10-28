// Match.js
/*
STEPS:

A) find points/areas of most uniqueness - use corners, edges, colors, and find local maxima: 100~1000 points

B) describe each point as some combination of:
	gray(base)/red/green/blue orientations
	gray(base)/red/green/blue relative intensities (local/global)?
	overall scale - (at what size is it most corner like?)

C) assign some useful/unique-ness score to each point based on all properties, to order obtain final best comparable points: 10~100
	* large gradients (more edge/corner-like)
	* large color volume [sum of intensities: minima to maxima] - high variation in color

D) compare points from seperate pictures and assign comparrison score:
	compare in small number of combinations and use best score
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

E) decide best matches for each point by sorting by best match (pt.matchest[0].score), and going down list as posibilities dwindle
	ptA.matches = [{ptX,score},{ptY,score},..{ptZ,score}]
	ptB.matches = [{ptI,score},{ptJ,score},..,{ptA,score}]
	...


*/
function Match(){
	this._canvas = new Canvas(null, 2400,600, Canvas.STAGE_FIXED, false);
	//this._canvas.addListeners();
	this._stage = new Stage(this._canvas, (1/10)*1000);
	this._stage.start();

var root = new DO();
this._stage.addChild(root);
root.graphics().setLine(2,0xFF0000FF);
root.graphics().beginPath();
root.graphics().moveTo(0,0);
root.graphics().lineTo(10,100);
root.graphics().endPath();
root.graphics().strokeLine();


	//
	this._imageList = new Array();
	var imageLoader = new ImageLoader("./images/medium/",["FT.png"], //"FRB.png","FR.png","FLT2.png","FLT.png","FLB2.png","FLB.png","FL.png","FB.png","BRT.png","BRB.png","BLT.png","BLB.png","BL.png"],
		this,this._imageCompleteFxn,this._imageProgressFxn);
	imageLoader.load();
}
Match.prototype._imageProgressFxn = function(o){
}
Match.prototype._imageCompleteFxn = function(o){
	console.log("LOADED");
}
Match.prototype._imageCompleteFxn2 = function(o){
	Code.copyArray(this._imageList,o.images);
	var images = o.images;
	var img = images[0];
	var ox = 0, oy = 0;
	var i, j, len, obj, index;
	var wid = img.width;
	var hei = img.height;
	this._canvas.drawImage2(img, 0,0);
	// 
 	var dat = this._canvas.getColorArrayARGB(ox,oy,wid,hei);
 	var img = new ImageMat(wid,hei);
var originalImage = img;
 	img.setFromArrayARGB(dat);
 		// historize introduces a lot of noise
	 	// var normR = ImageMat.historize0255( ImageMat.zero255FromFloat(img.getRedFloat()) );
	 	// var normG = ImageMat.historize0255( ImageMat.zero255FromFloat(img.getGrnFloat()) );
	 	// var normB = ImageMat.historize0255( ImageMat.zero255FromFloat(img.getBluFloat()) );
	 	// minimal noise
	 	var normR = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getRedFloat()) );
	 	var normG = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getGrnFloat()) );
	 	var normB = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getBluFloat()) );
	 	// original
	 	// var normR = ImageMat.zero255FromFloat(img.getRedFloat());
	 	// var normG = ImageMat.zero255FromFloat(img.getGrnFloat());
	 	// var normB = ImageMat.zero255FromFloat(img.getBluFloat());
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
 	// var dx = ImageMat.convolve(gray,wid,hei, [-0.5,0.5], 2,1); // dx - 2
 	// var dy = ImageMat.convolve(gray,wid,hei, [-0.5,0.5], 2,1);// dy - 2
	var dx = ImageMat.convolve(gray,wid,hei, [-0.5,0,0.5], 3,1); // dx - 3
	var dy = ImageMat.convolve(gray,wid,hei, [-0.5,0,0.5], 1,3); // dy - 3
 	var corner = ImageMat.convolve(gray,wid,hei, [0.25,-0.5,0.25, -0.5,1,-0.5, 0.25,-0.5,0.25], 1,3); // corner
 	ImageMat.normalFloat01(corner);
 		var vectorSum = ImageMat.vectorSumFloat(dx,dy);
 			ImageMat.normalFloat01(vectorSum);
 		var phase = ImageMat.phaseFloat(dx,dy);
 			ImageMat.normalFloat01(phase);
 		var vectorSquare = ImageMat.vectorSquaredSumFloat(dx,dy); // BAD
 			ImageMat.normalFloat01(vectorSquare);
 			//ImageMat.squareFloat(dat);
 		 	//dat = ImageMat.mulFloat(vectorSum,phase);

 	// ImageMat.applyFxnFloat(dat,this.fxnOp1);
var vectorSumFloat = Code.copyArray(new Array(), vectorSum); ImageMat.normalFloat01(vectorSumFloat);
 	// 1 - ||dx + dy||
 	dat = vectorSum;
 	ImageMat.normalFloat01(dat);
 	ImageMat.applyFxnFloat(dat,this.fxnOpOp);
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+1*wid,oy+0,wid,hei);
	
	// 2 - |dx| + |dy|
	dat = ImageMat.addFloat(ImageMat.absFloat(dx),ImageMat.absFloat(dy));
	ImageMat.normalFloat01(dat);
var addAbsFloat = Code.copyArray(new Array(), dat);
	ImageMat.applyFxnFloat(dat,this.fxnOpOp);
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+2*wid,oy+0,wid,hei);

 	// 3 - gradient
var gradFloat = Code.copyArray(new Array(), grad); ImageMat.normalFloat01(gradFloat);
	dat = grad;
	ImageMat.normalFloat01(dat);
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+3*wid,oy+0,wid,hei);
 	
 	// 4 - corner
var cornerFloat = Code.copyArray(new Array(), corner);
	dat = corner;
	ImageMat.normalFloat01(dat);
		ImageMat.applyFxnFloat(dat,this.fxnOp0);
		ImageMat.normalFloat01(dat);
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+4*wid,oy+0,wid,hei);

 	// 5 - grad normal
	dat = gradFloat;
	ImageMat.applyFxnFloat(dat,this.fxnOp0);
	ImageMat.normalFloat01(dat);
		// ImageMat.squareFloat(dat);
		// ImageMat.normalFloat01(dat);
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+5*wid,oy+0,wid,hei);

 	//
var addAbs255 = ImageMat.zero255FromFloat(addAbsFloat);
	dat = ImageMat.historize0255(addAbs255);
	dat = ImageMat.FloatFromZero255(dat);
	ImageMat.normalFloat01(dat);
var addAbsThresh = ImageMat.gtFloat(dat, 0.50);

var grad255 = ImageMat.zero255FromFloat(grad);
	dat = ImageMat.historize0255(grad255);
	dat = ImageMat.FloatFromZero255(dat);
	ImageMat.normalFloat01(dat);
var gradThresh = ImageMat.gtFloat(dat, 0.50);

var corner255 = ImageMat.zero255FromFloat(corner);
	dat = ImageMat.historize0255(corner255);
	dat = ImageMat.FloatFromZero255(dat);
	ImageMat.normalFloat01(dat);
var cornerThresh = ImageMat.gtFloat(dat, 0.50);

dat = Code.copyArray(new Array(), gradFloat);
ImageMat.applyFxnFloat(dat,this.fxnOp0); ImageMat.normalFloat01(dat);
var gradEdgeFloat = dat;

	dat = ImageMat.mulFloat(gradEdgeFloat,vectorSumFloat);
	dat = ImageMat.mulFloat(addAbsFloat,dat);
	dat = ImageMat.mulFloat(cornerFloat,dat);
//dat = ImageMat.mulFloat(cornerFloat,dat); // double
 	ImageMat.normalFloat01(dat);

 	dat = ImageMat.FloatFromZero255( ImageMat.historize0255( ImageMat.zero255FromFloat(dat) ) );
 //dat = cornerFloat;
//dat = vectorSumFloat;
	ImageMat.normalFloat01(dat);
	dat = ImageMat.gtFloat(dat, 0.50);
var baseBlob = Code.copyArray(new Array(), dat);
	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+0*wid,oy+hei,wid,hei);


 	// 1 - expand
 	dat = ImageMat.retractBlob(baseBlob, wid,hei);
//var pts = Code.copyArray(new Array(), dat);
 	//dat = ImageMat.expandBlob(dat, wid,hei);
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+1*wid,oy+hei,wid,hei);

 	// 2 - retract
 	dat = ImageMat.expandBlob(baseBlob, wid,hei);
var baseBlob = Code.copyArray(new Array(), dat);
 	dat = ImageMat.retractBlob(dat, wid,hei);
var retBlob = Code.copyArray(new Array(), dat);
 	dat = ImageMat.ARGBFromFloat(dat);
 	this._canvas.setColorArrayARGB(dat, ox+2*wid,oy+hei,wid,hei);

var blobs1 = ImageMat.findBlobs(baseBlob, wid,hei); // 457 - 521
var blobs2 = ImageMat.findBlobs2(baseBlob, wid,hei); // 172
var blobs = new Array(); // more correct ...
	len = blobs1.length; for(i=0;i<len;++i){ blobs.push(blobs1[i]);}
	//len = blobs2.length; for(i=0;i<len;++i){ blobs.push(blobs2[i]);}
//console.log(blobs.length+" | "+(100*blobs.length/(wid*hei))+"%");
var maxims = new Array(wid*hei);
len = maxims.length;
for(i=0;i<len;++i){
	maxims[i] = 0;
}
len = blobs.length;
for(i=0;i<len;++i){
	obj = blobs[i];
	index = obj.y*wid + obj.x;
	maxims[index] = (1+obj.value/2)/2;
}

//
var pnt0 = blobs[113];
Code.log(pnt0);
maxims[wid*pnt0.y + pnt0.x] += 3;
//

var dur = baseBlob;
 	// original superimposed with points
var nR = ImageMat.addFloat(red,maxims);
	//nR = ImageMat.addFloat(nR,baseBlob);
	//nR = ImageMat.addFloat(nR,dur);
	ImageMat.normalFloat01(nR);
var nG = ImageMat.addFloat(grn,maxims);
	//nG = ImageMat.addFloat(nG,baseBlob);
	//nG = ImageMat.addFloat(nG,dur);
	ImageMat.normalFloat01(nG);
var nB = ImageMat.addFloat(blu,maxims);1
	//nB = ImageMat.addFloat(nB,baseBlob);
	//nB = ImageMat.addFloat(nB,dur);
	ImageMat.normalFloat01(nB);
var sup = new ImageMat(wid,hei);
	sup.setRedFromFloat(nR);
	sup.setGrnFromFloat(nG);
	sup.setBluFromFloat(nB);
 	dat = sup.getArrayARGB();
 	this._canvas.setColorArrayARGB(dat, ox+0*wid,oy+0*hei,wid,hei);

var feat0 = this.describePoint(pnt0.x,pnt0.y, wid,hei, red,grn,blu,gray);
Code.log(feat0);

dat = ImageMat.ARGBFromFloats( feat0._bitmap.red(), feat0._bitmap.grn(), feat0._bitmap.blu() );
//dat = ImageMat.ARGBFromFloat( feat0._bitmap.gry() );
this._canvas.setColorArrayARGB(dat, 10,10, feat0._bitmap.width(),feat0._bitmap.height());

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

Match.prototype.fxnOpOp = function(f){ 
	return Math.abs(f-1);
}
Match.prototype.describePoint = function(x,y, wid,hei, origR,origG,origB,origY, gradRX,gradRY, gradGX,gradGY, gradBX,gradBY, gradYX,gradYY){
	// HERE
	var feature = new ImageFeature(x,y, wid,hei, origR,origG,origB,origY, gradRX,gradRY, gradGX,gradGY, gradBX,gradBY, gradYX,gradYY);
	return feature;
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

