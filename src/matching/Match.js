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
	this._canvas = new Canvas(null, 400,600, Canvas.STAGE_FIT_FILL, false);
	//this._canvas.addListeners();
	this._stage = new Stage(this._canvas, (1/10)*1000);
	this._stage.start();

	//this.exp();
/*
var root = new DO();
root.graphics().setLine(2,0xFF0000FF);
root.graphics().beginPath();
root.graphics().moveTo(0,0);
root.graphics().lineTo(10,100);
root.graphics().endPath();
root.graphics().strokeLine();

var square = new DO();
	square.graphics().setLine(3.0,0xFFFF0000);
	square.graphics().beginPath();
	square.graphics().setFill(0x99FF0000);
	square.graphics().moveTo(0,0);
	square.graphics().lineTo(100,0);
	square.graphics().lineTo(100,100);
	square.graphics().lineTo(0,100);
	square.graphics().lineTo(0,0);
	square.graphics().endPath();
	square.graphics().fill();
	square.graphics().strokeLine();
var circle = new DO();
	circle.graphics().setLine(3.0,0xFF0000FF);
	circle.graphics().beginPath();
	circle.graphics().setFill(0x990000FF);
	circle.graphics().moveTo(0,0);
	circle.graphics().arc(0,0, 50, 0,Math.PI*3/2, false);
	circle.graphics().endPath();
	circle.graphics().fill();
	circle.graphics().strokeLine();
	circle.matrix().identity();
	circle.matrix().rotate(Math.PI/10);
	circle.matrix().translate(100,100);
	//circle.addFunction(Stage.EVENT_ON_ENTER_FRAME, function(e){ console.log("I HAVE EFF"); }); // this._stage

var triangle = new DO();
	triangle.graphics().setLine(3.0,0xFF00FF00);
	triangle.graphics().beginPath();
	triangle.graphics().setFill(0x9900FF00);
	triangle.graphics().moveTo(-30,30);
	triangle.graphics().lineTo(30,30);
	triangle.graphics().lineTo(0,-30);
	triangle.graphics().lineTo(-30,30);
	triangle.graphics().endPath();
	triangle.graphics().fill();
	triangle.graphics().strokeLine();
	triangle.matrix().identity();
	triangle.matrix().rotate(-Math.PI/10);
	triangle.matrix().translate(50,0);
this._stage.addChild(root);
	root.addChild(square);
		square.addChild(circle);
			circle.addChild(triangle);
*/
	//
	this._imageList = new Array();
	var imageLoader = new ImageLoader("./images/medium/", ["FT.png"], // ["damn.png"], // ["max.png"], //"FT.png","FRB.png","FR.png","FLT2.png","FLT.png","FLB2.png","FLB.png","FL.png","FB.png","BRT.png","BRB.png","BLT.png","BLB.png","BL.png"],
		this,this._imageCompleteFxn,this._imageProgressFxn);
	imageLoader.load();
}
Match.prototype._imageProgressFxn0 = function(o){
}
Match.prototype._imageCompleteFxn1 = function(o){
	var images = o.images;
	var img = images[0];
	//

	Code.copyArray(this._imageList,o.images);
	var image = new DOImage(img);
	image.matrix().identity();
	//image.matrix().rotate(Math.PI/10);
	image.matrix().translate(0,0);
	this._stage.root().getChildAt(0).getChildAt(0).getChildAt(0).getChildAt(0).addChild(image);
	//this._stage.stop();
	console.log("LOADED");

	var x, y, angle, dir, col, base, percent;

	var dirRed = new V2D(1,1); dirRed.norm();
	var dirGrn = new V2D(0.5,1); dirGrn.norm();
	var dirBlu = new V2D(1,-0.5); dirBlu.norm();
	var dirGry = new V2D(1,0); ; dirGry.norm();
	var dirRadius = 20.0;


	// ---------------------------------------------------------------------- gradient orientation
	var direction = new DO();
	dir = dirRed;
	direction.graphics().setLine(1.0,0xFFFF0000);
	direction.graphics().beginPath();
	direction.graphics().moveTo(0,0);
	direction.graphics().lineTo(dirRadius*dir.x,dirRadius*dir.y);
	direction.graphics().endPath();
	direction.graphics().strokeLine();
	dir = dirGrn;
	direction.graphics().setLine(1.0,0xFF00FF00);
	direction.graphics().beginPath();
	direction.graphics().moveTo(0,0);
	direction.graphics().lineTo(dirRadius*dir.x,dirRadius*dir.y);
	direction.graphics().endPath();
	direction.graphics().strokeLine();
	dir = dirBlu;
	direction.graphics().setLine(1.0,0xFF0000FF);
	direction.graphics().beginPath();
	direction.graphics().moveTo(0,0);
	direction.graphics().lineTo(dirRadius*dir.x,dirRadius*dir.y);
	direction.graphics().endPath();
	direction.graphics().strokeLine();
	dir = dirGry;
	direction.graphics().setLine(1.0,0xFFCCCCCC);
	direction.graphics().beginPath();
	direction.graphics().moveTo(0,0);
	direction.graphics().lineTo(dirRadius*dir.x,dirRadius*dir.y);
	direction.graphics().endPath();
	direction.graphics().strokeLine();

	direction.matrix().identity();
	direction.matrix().translate(100,-50);

	// ---------------------------------------------------------------------- gradient intensity


	// ---------------------------------------------------------------------- color intensity
	var colRed = 0.35;
	var colGrn = 0.60;
	var colBlu = 0.95;
	var colGry = (colRed+colGrn+colBlu)/3.0;
	var range = Math.max(colRed,colGrn,colBlu) - Math.min(colRed,colGrn,colBlu);

	var block = 30;
	base = colGry;

	var intensity = new DO();
	x = 0*block;
	col = colRed; percent = (col-base)/range;
	intensity.graphics().beginPath();
	intensity.graphics().setFill(0xCCFF0000);
	intensity.graphics().moveTo(x,0);
	intensity.graphics().lineTo(x+block,0);
	intensity.graphics().lineTo(x+block,block*percent);
	intensity.graphics().lineTo(x,block*percent);
	intensity.graphics().lineTo(x,0);
	intensity.graphics().endPath();
	intensity.graphics().fill();

	x = 1*block;
	col = colGrn; percent = (col-base)/range;
	intensity.graphics().beginPath();
	intensity.graphics().setFill(0xCC00FF00);
	intensity.graphics().moveTo(x,0);
	intensity.graphics().lineTo(x+block,0);
	intensity.graphics().lineTo(x+block,block*percent);
	intensity.graphics().lineTo(x,block*percent);
	intensity.graphics().lineTo(x,0);
	intensity.graphics().endPath();
	intensity.graphics().fill();

	x = 2*block;
	col = colBlu; percent = (col-base)/range;
	intensity.graphics().beginPath();
	intensity.graphics().setFill(0xCC0000FF);
	intensity.graphics().moveTo(x,0);
	intensity.graphics().lineTo(x+block,0);
	intensity.graphics().lineTo(x+block,block*percent);
	intensity.graphics().lineTo(x,block*percent);
	intensity.graphics().lineTo(x,0);
	intensity.graphics().endPath();
	intensity.graphics().fill();


	intensity.matrix().identity();
	intensity.matrix().translate(150,-50);
	//intensity.graphics().strokeLine();
	// ---------------------------------------------------------------------- 

	// circle.graphics().setLine(3.0,0xFF0000FF);
	// circle.graphics().beginPath();
	// circle.graphics().setFill(0x990000FF);
	// circle.graphics().moveTo(0,0);
	// circle.graphics().arc(0,0, 50, 0,Math.PI*3/2, false);
	// circle.graphics().endPath();
	// circle.graphics().fill();
	// circle.graphics().strokeLine();
	


	// 
	image.addChild(direction);
	image.addChild(intensity);
	image.matrix().identity();
	image.matrix().scale(1.5,0.5);

	// console.log(colAN.toString());
	// console.log(colBN.toString());
	// console.log(colCN.toString());
	// // colorful ranking - 
	// console.log(V3D.dot(colAN,colBN));
	// console.log(V3D.dot(colAN,colCN));
	// console.log("-----------------------------");
	// // 0(best) to 3 ranking
	// p = new V3D(colA.x-colB.x, colA.y-colB.y, colA.z-colB.z);
	// console.log(p.toString());
	// console.log(p.length());
	// p = new V3D(colA.x-colC.x, colA.y-colC.y, colA.z-colC.z);
	// console.log(p.toString());
	// console.log(p.length());
}
Match.prototype.getDescriptorParameters = function(originalImage){
	var i, j, dat, img;
	var wid = originalImage.width, hei = originalImage.height;
	var doImage = new DOImage(originalImage);
	dat = this._stage.getDOAsARGB(doImage, wid,hei);
	img = new ImageMat(wid,hei);
	img.setFromArrayARGB(dat);
	var normR = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getRedFloat()) );
	var normG = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getGrnFloat()) );
	var normB = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getBluFloat()) );
	dat = ImageMat.ARGBFromRGBArrays(normR,normG,normB);
	img.setFromArrayARGB(dat);
	var red = img.getRedFloat();
	var grn = img.getGrnFloat();
	var blu = img.getBluFloat();
	img.unset();
	return [wid, hei, red, grn, blu];
}
Match.prototype.scaleImage = function(originalImage, scale){
	var wid = originalImage.width;
	var hei = originalImage.height;
	var doImage = new DOImage(originalImage);
	dat = this._stage.getDOAsARGB(doImage, wid,hei);
	var img = new ImageMat(wid,hei);
	img.setFromArrayARGB(dat);
	var newWid = Math.round(wid*scale);
	var newHei = Math.round(hei*scale);
	img = ImageMat.extractRect(img, 0,0, wid-1,0, wid-1,hei-1, 0,hei-1, newWid,newHei);
	var argb = ImageMat.ARGBFromFloats(img.red(),img.grn(),img.blu());
	var imageElement = this._stage.getRGBAAsImage(argb, img.width(), img.height());

	imageElement.style.zIndex = 99;
	imageElement.style.position = "absolute";
	Code.addChild(document.body, imageElement );
}
Match.prototype._imageCompleteFxn = function(o){
	var images = new Array();
	Code.copyArray(images,o.images);

	var params = this.getDescriptorParameters( images[0] );

	var descriptor = new ImageDescriptor( params[0],params[1], params[2],params[3],params[4] );
	descriptor.processScaleSpace();
	// descriptor.processAffineSpace();
	// descriptor.describeFeatures();
	// 
	// var features = scene.compareDescriptors(0,1);// descriptor.compareFeatures(); //
	var filters = descriptor.getImageDefinition();


// filters = new Array();
var wid = params[0];
var hei = params[1];
var gry = ImageMat.grayFromRGBFloat(params[2],params[3],params[4]);
var src = gry;
var SMM = new Array();
var res = ImageMat.harrisDetector(src,wid,hei, SMM); // , threshold, sigma, kMult
res = ImageMat.addFloat(gry,res);


/*
pick a point
get eigenvectors
display eigenvectors visually
*/

//filters.push( (new ImageMat(wid,hei)).setFromFloats( ImageMat.getNormalFloat01(res),ImageMat.getNormalFloat01(res),ImageMat.getNormalFloat01(res) ) );


	var root = new DO(); this._stage.root().addChild(root);
	root.matrix().identity();
	root.matrix().scale(1.0);//,0.5);

	
	var imgPerRow = 4;
	var i, row, col, len = filters.length;
	row = 0;
	col = 0;
	for(i=0;i<len;++i){
		var img = filters[i];
		var argb = ImageMat.ARGBFromFloats(img.red(),img.grn(),img.blu());
		var src = this._stage.getARGBAsImage(argb, img.width(), img.height());
		var doi = new DOImage( src );
			doi.matrix().identity();
			doi.matrix().translate(col*img.width(), row*img.height());
		root.addChild(doi);
		col++;
		if(col%imgPerRow==0 && col>0){
			row++;
			col = 0;
		}
	}


var pt = new V2D(143,151);

var d = new DO();
var rad = 10;

//main
d.graphics().clear();
d.graphics().setLine(1.0,0xFFFF0000);
d.graphics().beginPath();
d.graphics().setFill(0x22FF0000);
d.graphics().moveTo(rad,0);
d.graphics().arc(0,0, rad, 0,Math.PI*2, false);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
// dot
rad = 1.0;
d.graphics().beginPath();
d.graphics().setFill(0xFFFF0000);
d.graphics().moveTo(rad,0);
d.graphics().arc(0,0, rad, 0,Math.PI*2, false);
d.graphics().endPath();
d.graphics().fill();
// orientation / direction
var smmPt = SMM[pt.y*wid + pt.x];
console.log(smmPt);
var ma = smmPt[0];
var mb = smmPt[1];
var mc = smmPt[2];
var md = smmPt[3];
var M = (new Matrix(2,2)).setFromArray(smmPt);
var eigVals = Matrix.eigenValues2D(ma,mb,mc,md);
var eigVects = Matrix.eigenVectors2D(ma,mb,mc,md);
console.log(eigVals);
console.log(eigVects);

//

d.matrix().identity();
d.matrix().translate(pt.x,pt.y);

root.addChild(d);


return;
	var originalImage = filters.shift();
	//var pt = new V2D(147,135); // OO
	var pt = new V2D(99,215); // EYE
// var ptA = new V2D(245,25); // BOX
// var ptB = new V2D(250,296);
// var ptC = new V2D(63,241);
// var ptD = new V2D(58,58);
// var ptA = new V2D(180,-10); // FUN
// var ptB = new V2D(290,310);
// var ptC = new V2D(63,230);
// var ptD = new V2D(58,150);
	// var ptA = new V2D(160,55); // LOGO
	// var ptB = new V2D(195,215);
	// var ptC = new V2D(145,240);
	// var ptD = new V2D(125,90);
var tlX = 90;
var tlY = 210;
var siX = 15;
var siY = 15;
var ptA = new V2D(tlX,tlY); // TINY
var ptB = new V2D(tlX+siX,tlY);
var ptC = new V2D(tlX+siX,tlY+siY);
var ptD = new V2D(tlX,tlY+siY);

	var doPoint = new DO();
	var xDim = 15;
	doPoint.graphics().clear();
	doPoint.graphics().setLine(1.0,0x99FF0000);
	doPoint.graphics().beginPath();
	doPoint.graphics().setFill(0x9900FF00);
	// doPoint.graphics().moveTo(-xDim,-xDim);
	// doPoint.graphics().lineTo(xDim,-xDim);
	// doPoint.graphics().lineTo(xDim,xDim);
	// doPoint.graphics().lineTo(-xDim,xDim);
	// doPoint.graphics().lineTo(-xDim,-xDim);
doPoint.graphics().moveTo(ptA.x,ptA.y);
doPoint.graphics().lineTo(ptB.x,ptB.y);
doPoint.graphics().lineTo(ptC.x,ptC.y);
doPoint.graphics().lineTo(ptD.x,ptD.y);
doPoint.graphics().lineTo(ptA.x,ptA.y);
	doPoint.graphics().endPath();
	doPoint.graphics().fill();
	doPoint.graphics().strokeLine();
		doPoint.matrix().identity();
		//doPoint.matrix().translate(pt.x,pt.y);
	root.addChild(doPoint);

	var source = originalImage;//filters[0];
	//var result = this.extractRect(source, pt.x-xDim,pt.y-xDim, pt.x+xDim,pt.y-xDim, pt.x+xDim,pt.y+xDim, pt.x-xDim,pt.y+xDim, Math.floor(7*xDim),Math.floor(7*xDim) );
	//var result = this.extractRect(source, ptA.x,ptA.y,ptB.x,ptB.y,ptC.x,ptC.y,ptD.x,ptD.y, 150,200 );
	var result = ImageMat.extractRec01t(source, ptA.x,ptA.y,ptB.x,ptB.y,ptC.x,ptC.y,ptD.x,ptD.y, 150,150 );

	img = result;
	argb = ImageMat.ARGBFromFloats(img.red(),img.grn(),img.blu());
	src = this._stage.getRGBAAsImage(argb, img.width(), img.height());
	doi = new DOImage( src );
		doi.matrix().identity();
		//doi.matrix().translate(source.width(),source.height());
		doi.matrix().translate(source.width()*0.5,source.height()*0.5);
	root.addChild(doi);


	//console.log( (new Array(1,2,3,4,5,6)).shift() )
	
	/*

	var matrix = new Matrix2D();
	var imgDO;
	imgDO = new DOImage( img );
		matrix.identity();
		matrix.translate(-100,-100);
	img = this._stage.renderImage(50,50, imgDO, matrix, Canvas.IMAGE_TYPE_PNG);


	*/
}
Match.prototype.extractRectNoMatrixNotQuiteCorrect = function(source, aX,aY,bX,bY,cX,cY,dX,dY, w,h){
	var destination = new ImageMat(w,h);
	var ab = new V2D(bX-aX,bY-aY);
	var bc = new V2D(cX-bX,cY-bY);
	var dc = new V2D(cX-dX,cY-dY);
	var ad = new V2D(dX-aX,dY-aY);
	var vX = new V2D(), vY = new V2D();
	var i, j, val = new V3D(), pt = new V2D();
	var pI, pJ, pI1, pJ1;
	var wid = w-1, hei = h-1;
	for(j=0;j<=hei;++j){
		for(i=0;i<=wid;++i){
			pI = 1.0*i/wid;
			pI1 = 1.0 - pI;
			pJ = 1.0*j/hei;
			pJ1 = 1.0 - pJ;
			vX.x = pJ1*ab.x + pJ*dc.x; vX.y = pJ1*ab.y + pJ*dc.y;
			vY.x = pI1*ad.x + pI*bc.x; vY.y = pI1*ad.y + pI*bc.y;
			pt.x = aX + pI*vX.x + pJ*vY.x;
			pt.y = aY + pI*vX.y + pJ*vY.y;
			source.getPoint(val, pt.x,pt.y);
			destination.setPoint(i,j, val);
		}
	}
	return destination;
}
Match.prototype.getImageFilters = function(originalImage){
	var i,j, index;
	var wid = originalImage.width, hei = originalImage.height;
	var doImage = new DOImage(originalImage);
	var dat, img;
	var imageOriginal = new ImageMat(wid,hei);
	var imageGradientRGB = new ImageMat(wid,hei);
	var imageGradientGry = new ImageMat(wid,hei);
		var imageGradGradientGry = new ImageMat(wid,hei); // otherwise known as laplacian
	var imagePhaseRGB = new ImageMat(wid,hei);
	var imagePhaseGry = new ImageMat(wid,hei);
	var imageCornerRGB = new ImageMat(wid,hei);
	var imageCornerGry = new ImageMat(wid,hei);
	var imageBestRGB = new ImageMat(wid,hei);
	var imageBestGry = new ImageMat(wid,hei);
	var imageBlobGry = new ImageMat(wid,hei);

 	// original image
 	dat = this._stage.getDOAsARGB(doImage, wid,hei);
 	img = new ImageMat(wid,hei);
 	img.setFromArrayARGB(dat);
 	var normR = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getRedFloat()) );
 	var normG = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getGrnFloat()) );
 	var normB = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getBluFloat()) );
 	dat = ImageMat.ARGBFromRGBArrays(normR,normG,normB);
 	imageOriginal.setFromArrayARGB(dat);
 	var red = imageOriginal.getRedFloat();
 	var grn = imageOriginal.getGrnFloat();
 	var blu = imageOriginal.getBluFloat();
 	var gry = imageOriginal.getGrayFloat();



//var freq = ImageMat.toFrequencyDomain(gry, wid,hei);
//return new Array(imageOriginal);

 	// gradients
 	var dxRed = ImageMat.convolve(red,wid,hei, [-0.5,0,0.5], 3,1);
	var dyRed = ImageMat.convolve(red,wid,hei, [-0.5,0,0.5], 1,3);
	var dxGrn = ImageMat.convolve(grn,wid,hei, [-0.5,0,0.5], 3,1);
	var dyGrn = ImageMat.convolve(grn,wid,hei, [-0.5,0,0.5], 1,3);
	var dxBlu = ImageMat.convolve(blu,wid,hei, [-0.5,0,0.5], 3,1);
	var dyBlu = ImageMat.convolve(blu,wid,hei, [-0.5,0,0.5], 1,3);
	var dxGry = ImageMat.convolve(gry,wid,hei, [-0.5,0,0.5], 3,1);
	var dyGry = ImageMat.convolve(gry,wid,hei, [-0.5,0,0.5], 1,3);
	var dxWinGry = ImageMat.convolve(gry,wid,hei, [-3,0,3, -10,0,10, -3,0,3], 3,3);
	var dyWinGry = ImageMat.convolve(gry,wid,hei, [-3,-10,-3, 0,0,0, 3,10,3], 3,3);
	// second moments
	var dxx = ImageMat.mulFloat( dxWinGry, dxWinGry );
	var dxy = ImageMat.mulFloat( dxWinGry, dyWinGry );
	var dyy = ImageMat.mulFloat( dyWinGry, dyWinGry );
		var gaussWid = 3, gaussHei = 3;
	var gaussian = ImageMat.getGaussianWindow(gaussWid,gaussHei, 1.0);
	var sxx = ImageMat.convolve(dxx,wid,hei, gaussian,gaussWid,gaussHei);
	var sxy = ImageMat.convolve(dxy,wid,hei, gaussian,gaussWid,gaussHei);
	var syy = ImageMat.convolve(dyy,wid,hei, gaussian,gaussWid,gaussHei);
		var harris = new Array(wid*hei);
		var a,b,c,d, R;
		for(j=0;j<hei;++j){
			for(i=0;i<wid;++i){
				index = j*wid + i;
				a = sxx[index];
				b = sxy[index];
				c = b;//sxy[index];
				d = syy[index];
				R = a*d - c*b;
				harris[index] = R;
			}
		}
		ImageMat.normalFloat01(harris);
		// combine
		for(i=0;i<wid*hei;++i){
			harris[i] =  0.75*harris[i] + 0.25*gry[i];
		}
		ImageMat.normalFloat01(harris);

		//var dydyGry = ImageMat.convolve(gry,wid,hei, [0.25,-0.5,0.25], 1,3);
		//var dxdxGry = ImageMat.convolve(gry,wid,hei, [0.25,-0.5,0.25], 1,3);
		// var dydyGry = ImageMat.convolve(dyGry,wid,hei, [-0.5,0,0.5], 1,3);
		// var dxdxGry = ImageMat.convolve(dxGry,wid,hei, [-0.5,0,0.5], 3,1);
	var gradRed = ImageMat.vectorSumFloat(dxRed,dyRed); ImageMat.normalFloat01(gradRed);
	var gradGrn = ImageMat.vectorSumFloat(dxGrn,dyGrn); ImageMat.normalFloat01(gradGrn);
	var gradBlu = ImageMat.vectorSumFloat(dxBlu,dyBlu); ImageMat.normalFloat01(gradBlu);
	var gradGry = ImageMat.vectorSumFloat(dxGry,dyGry); ImageMat.normalFloat01(gradGry);
	//
	imageGradientRGB.setFromFloats( gradRed, gradGrn, gradBlu );
	imageGradientGry.setFromFloats( gradGry, gradGry, gradGry );
	//var gradGradGry = ImageMat.vectorSumFloat(dxdxGry,dydyGry); ImageMat.normalFloat01(gradGradGry);
	//var gradGradGry = ImageMat.vectorSumFloat(dx2Gry,dy2Gry); ImageMat.normalFloat01(gradGradGry);
	//imageGradGradientGry.setFromFloats( gradGradGry, gradGradGry, gradGradGry );
	//imageGradGradientGry.setFromFloats( gradGry, gradGry, gradGry );
	imageGradGradientGry.setFromFloats( harris,harris,harris );
	
	// phase/angles
	var phaseRed = ImageMat.phaseFloat(dxRed,dyRed); ImageMat.normalFloat01(phaseRed);
	var phaseGrn = ImageMat.phaseFloat(dxGrn,dyGrn); ImageMat.normalFloat01(phaseGrn);
	var phaseBlu = ImageMat.phaseFloat(dxBlu,dyBlu); ImageMat.normalFloat01(phaseBlu);
	var phaseGry = ImageMat.phaseFloat(dxGry,dyGry); ImageMat.normalFloat01(phaseGry);
	imagePhaseRGB.setFromFloats(phaseRed, phaseGrn, phaseBlu);
	imagePhaseGry.setFromFloats(phaseGry, phaseGry, phaseGry);

	// corners
	var cornerThreshold = 0.55;
	var cornerMat = [0.25,-0.5,0.25, -0.5,1,-0.5, 0.25,-0.5,0.25];
	var cornerRed = ImageMat.convolve(red,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerRed); ImageMat.applyFxnFloat(cornerRed, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerRed);
	var cornerGrn = ImageMat.convolve(grn,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerGrn); ImageMat.applyFxnFloat(cornerGrn, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerGrn);
	var cornerBlu = ImageMat.convolve(blu,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerBlu); ImageMat.applyFxnFloat(cornerBlu, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerBlu);
	var cornerGry = ImageMat.convolve(gry,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerGry); ImageMat.applyFxnFloat(cornerGry, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerGry);
	imageCornerRGB.setFromFloats(cornerRed, cornerGrn, cornerBlu);
	imageCornerGry.setFromFloats(cornerGry, cornerGry, cornerGry);
	// cornerRedThresh = ImageMat.mulFloat( ImageMat.gtFloat(cornerRed, cornerThreshold), cornerRed ); ImageMat.normalFloat01(cornerRedThresh);
	// cornerGrnThresh = ImageMat.mulFloat( ImageMat.gtFloat(cornerGrn, cornerThreshold), cornerGrn ); ImageMat.normalFloat01(cornerGrnThresh);
	// cornerBluThresh = ImageMat.mulFloat( ImageMat.gtFloat(cornerBlu, cornerThreshold), cornerBlu ); ImageMat.normalFloat01(cornerBluThresh);
	// cornerGryThresh = ImageMat.mulFloat( ImageMat.gtFloat(cornerGry, cornerThreshold), cornerGry ); ImageMat.normalFloat01(cornerGryThresh);
	//imageCornerRGB.setFromFloats(cornerRedThresh, cornerGrnThresh, cornerBluThresh);
	//imageCornerGry.setFromFloats(cornerGryThresh, cornerGryThresh, cornerGryThresh);

 	// flat-gradient
 	var gradFlatMat = [0,-0.5,0, -0.5,0,0.5, 0,0.5,0];
 	var gradFlatRed = ImageMat.convolve(red,wid,hei, gradFlatMat, 3,3); ImageMat.normalFloat01(gradFlatRed);
 	var gradFlatGrn = ImageMat.convolve(grn,wid,hei, gradFlatMat, 3,3); ImageMat.normalFloat01(gradFlatGrn);
 	var gradFlatBlu = ImageMat.convolve(blu,wid,hei, gradFlatMat, 3,3); ImageMat.normalFloat01(gradFlatBlu);
 	var gradFlatGry = ImageMat.convolve(gry,wid,hei, gradFlatMat, 3,3); ImageMat.normalFloat01(gradFlatGry);

	// best matchings
	var addAbsFloatRed = ImageMat.addFloat(ImageMat.absFloat(dxRed),ImageMat.absFloat(dyRed)); ImageMat.normalFloat01(addAbsFloatRed);
	var addAbsFloatGrn = ImageMat.addFloat(ImageMat.absFloat(dxGrn),ImageMat.absFloat(dyGrn)); ImageMat.normalFloat01(addAbsFloatGrn);
	var addAbsFloatBlu = ImageMat.addFloat(ImageMat.absFloat(dxBlu),ImageMat.absFloat(dyBlu)); ImageMat.normalFloat01(addAbsFloatBlu);
	var addAbsFloatGry = ImageMat.addFloat(ImageMat.absFloat(dxGry),ImageMat.absFloat(dyGry)); ImageMat.normalFloat01(addAbsFloatGry);
	var gradEdgeRed = Code.copyArray(new Array(), gradFlatRed); ImageMat.applyFxnFloat(gradEdgeRed,ImageMat.flipAbsFxn); ImageMat.normalFloat01(gradEdgeRed);
	var gradEdgeGrn = Code.copyArray(new Array(), gradFlatGrn); ImageMat.applyFxnFloat(gradEdgeGrn,ImageMat.flipAbsFxn); ImageMat.normalFloat01(gradEdgeGrn);
	var gradEdgeBlu = Code.copyArray(new Array(), gradFlatBlu); ImageMat.applyFxnFloat(gradEdgeBlu,ImageMat.flipAbsFxn); ImageMat.normalFloat01(gradEdgeBlu);
	var gradEdgeGry = Code.copyArray(new Array(), gradFlatGry); ImageMat.applyFxnFloat(gradEdgeGry,ImageMat.flipAbsFxn); ImageMat.normalFloat01(gradEdgeGry);

	// blobs setup
	var bestThreshold = 0.10;

	var bestRed = gradEdgeRed;
	//bestRed = ImageMat.mulFloat(bestRed,gradRed); ImageMat.normalFloat01(bestRed);
	bestRed = ImageMat.mulFloat(bestRed,addAbsFloatRed); ImageMat.normalFloat01(bestRed);
	bestRed = ImageMat.mulFloat(bestRed,cornerRed); ImageMat.normalFloat01(bestRed);
	bestRed = ImageMat.gtFloat(bestRed, bestThreshold); ImageMat.normalFloat01(bestRed);

	var bestGrn = gradEdgeGrn;
	//bestGrn = ImageMat.mulFloat(bestGrn,gradGrn); ImageMat.normalFloat01(bestGrn);
	bestGrn = ImageMat.mulFloat(bestGrn,addAbsFloatGrn); ImageMat.normalFloat01(bestGrn);
	bestGrn = ImageMat.mulFloat(bestGrn,cornerGrn); ImageMat.normalFloat01(bestGrn);
	bestGrn = ImageMat.gtFloat(bestGrn, bestThreshold); ImageMat.normalFloat01(bestGrn);

	var bestBlu = gradEdgeBlu;
	//bestBlu = ImageMat.mulFloat(bestBlu,gradBlu); ImageMat.normalFloat01(bestBlu);
	bestBlu = ImageMat.mulFloat(bestBlu,addAbsFloatBlu); ImageMat.normalFloat01(bestBlu);
	bestBlu = ImageMat.mulFloat(bestBlu,cornerBlu); ImageMat.normalFloat01(bestBlu);
	bestBlu = ImageMat.gtFloat(bestBlu, bestThreshold); ImageMat.normalFloat01(bestBlu);

	var bestGry = gradGry; //cornerGry; // gradGry; gradEdgeGry;
	bestGry = ImageMat.mulFloat(bestGry,cornerGry); ImageMat.normalFloat01(bestGry);
	//bestGry = ImageMat.mulFloat(bestGry,gradGry); ImageMat.normalFloat01(bestGry);
	bestGry = ImageMat.mulFloat(bestGry,addAbsFloatGry); ImageMat.normalFloat01(bestGry);
	ImageMat.normalFloat01(bestGry);
	bestGry = ImageMat.gtFloat(bestGry, bestThreshold);

	// 
 	imageBestRGB.setFromFloats(bestRed, bestGrn, bestBlu);
	//imageBestGry.setFromFloats(bestGry, bestGry, bestGry);

	// find blobs
	var blobGry = bestGry;
	// blobGry = ImageMat.expandBlob(blobGry, wid,hei);
	// blobGry = ImageMat.retractBlob(blobGry, wid,hei);
	//imageBlobGry.setFromFloats(blobGry, blobGry, blobGry);

var blobIndex = 223;
	// find centers
	var blobListGry = ImageMat.findBlobsCOM(blobGry, wid,hei);
	var blobViz = ImageMat.newZeroFloat(wid,hei);
	var blobViz2 = ImageMat.newZeroFloat(wid,hei); // Code.copyArray(new Array(), bestGry);//

	// for(i=0;i<blobViz2.length;++i){
	// 	blobViz2[i] = 1.0;
	// }
	for(i=0;i<blobListGry.length;++i){
		blobViz[wid*Math.round(blobListGry[i].y) + Math.round(blobListGry[i].x)] = 1.0;
		if( i==blobIndex ){
			blobViz2[wid*Math.round(blobListGry[i].y) + Math.round(blobListGry[i].x)] = 1.0;
		}
	}

	// get features from blob points
	var feature, blob;
	var featureList = new Array();
	for(i=0;i<blobListGry.length;++i){
		if( i==blobIndex ){
			blob = blobListGry[i];
			feature = new ImageFeature(blob.x,blob.y, 1.0,1.0, wid,hei, red,grn,blu,gry );
			featureList.push(feature);
		}
	}

	// zisualize best points
	//imageBestGry.setFromFloats(bestGry, blobViz, blobViz2);
	imageBestGry.setFromFloats(bestGry, blobViz2, blobViz);
	//imageBestGry.setFromFloats(blobViz2, bestGry, bestGry);
	//imageBestGry.setFromFloats(blobViz2,blobViz2,blobViz2);

	//console.log("getImageFilters");
	return new Array(imageOriginal, imageGradientGry, imagePhaseGry, imageCornerGry, imageBestGry);
	//return new Array(imageOriginal, imageGradientRGB, imageGradientGry, imagePhaseRGB, imagePhaseGry, imageGradGradientGry, imageCornerRGB, imageCornerGry, imageBestRGB, imageBestGry);
}












Match.prototype.exp1 = function(){
	var font = new Font("arial","../spice/source/fonts/monospice.ttf",null,0.1,0.5,1.0);
	font.load();
	//var angA = new ColorAngle(Math.PI*1/8,Math.PI*7/8,Math.PI*2/8,Math.PI*3/8);
	//var angB = new ColorAngle(angA.red()+0.5,angA.grn()+0.5,angA.blu()+0.5,angA.gry()+0.5);
	var angA = new ColorAngle(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2);
	// viz
	var txt, doA, doB, angB, angC, score;
	var dX = 80, sX = 0, sY = 210, dA = 1.0;
	var i, len = 24;
	angC = new ColorAngle(	Code.zeroTwoPi(angA.red() + Math.random()*dA - dA/2),
							Code.zeroTwoPi(angA.grn() + Math.random()*dA - dA/2),
							Code.zeroTwoPi(angA.blu() + Math.random()*dA - dA/2),
							Code.zeroTwoPi(angA.gry() + Math.random()*dA - dA/2) );
	angB = new ColorAngle(	Code.zeroTwoPi(angA.red() + Math.random()*dA - dA/2),
								Code.zeroTwoPi(angA.grn() + Math.random()*dA - dA/2),
								Code.zeroTwoPi(angA.blu() + Math.random()*dA - dA/2),
								Code.zeroTwoPi(angA.gry() + Math.random()*dA - dA/2) );
	var dA = 0.05;
	var mA = -dA*len/2;
	for(i=0;i<len;++i){
		//angB = new ColorAngle(angC.red()+i*0*dA,angC.grn()+i*0*dA,angC.blu()+i*0*dA,angC.gry()+i*dA);
		//angB = new ColorAngle(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2);
		// angB = new ColorAngle(	Code.zeroTwoPi(angA.red() + Math.random()*dA - dA/2),
		// 						Code.zeroTwoPi(angA.grn() + Math.random()*dA - dA/2),
		// 						Code.zeroTwoPi(angA.blu() + Math.random()*dA - dA/2),
		// 						Code.zeroTwoPi(angA.gry() + Math.random()*dA - dA/2) );
		//score = this.compareAngles(angA,angB);
		off = i*dA + mA;
		score = this.compareAngles(angA,angB, off);
		doB = this.describeAngleDO(angB, dX*0.5);
			doB.matrix().identity();
			doB.matrix().rotate(-angB.gry()-off);
			doB.matrix().translate(sX+(i+1)*dX,sY);
			this._stage.addChild( doB );
		doA = this.describeAngleDO(angA, dX*0.5);
			doA.matrix().identity();
			doA.matrix().rotate(-angA.gry());
			doA.matrix().translate(sX+(i+1)*dX,sY + dX);
			this._stage.addChild( doA );
		txt = new DOText(""+(Math.round(score*1000)/1000)+"("+(Math.round(off*1000)/1000)+")",10,font,0xFFFF0000,DOText.ALIGN_CENTER);
			txt.matrix().identity();
			txt.matrix().rotate(0);
			txt.matrix().translate(sX+(i+1)*dX,sY-dX/2);
		this._stage.addChild( txt );
	}
	
	
	
}

Match.prototype.describeAngleDO = function(ang,rad){
	rad = rad===undefined?35:rad;
	var square = new DO();
		square.graphics().clear();
		square.graphics().setLine(1.0,0x99000000);
		square.graphics().beginPath();
		square.graphics().setFill(0x66000000);
		square.graphics().moveTo(rad,0);
		square.graphics().arc(0,0, rad, 0,Math.PI*2, false);
		square.graphics().endPath();
		square.graphics().fill();
		square.graphics().strokeLine();
	var redA = ang.red();
		square.graphics().setLine(1.0,0xFFFF0000);
		square.graphics().beginPath();
		square.graphics().moveTo(0,0);
		square.graphics().lineTo(rad*Math.cos(redA),rad*Math.sin(redA));
		square.graphics().endPath();
		square.graphics().strokeLine();
	var redG = ang.grn();
		square.graphics().setLine(1.0,0xFF00FF00);
		square.graphics().beginPath();
		square.graphics().moveTo(0,0);
		square.graphics().lineTo(rad*Math.cos(redG),rad*Math.sin(redG));
		square.graphics().endPath();
		square.graphics().strokeLine();
	var redB = ang.blu();
		square.graphics().setLine(1.0,0xFF0000FF);
		square.graphics().beginPath();
		square.graphics().moveTo(0,0);
		square.graphics().lineTo(rad*Math.cos(redB),rad*Math.sin(redB));
		square.graphics().endPath();
		square.graphics().strokeLine();
	var redY = ang.gry();
		square.graphics().setLine(1.0,0xFFCCCCCC);
		square.graphics().beginPath();
		square.graphics().moveTo(0,0);
		square.graphics().lineTo(rad*Math.cos(redY),rad*Math.sin(redY));
		square.graphics().endPath();
		square.graphics().strokeLine();
	return square;
}
Match.prototype.exp0 = function(){

	var p;
	
	//var colA = new V3D(0.5,0.9,0.8);
	// var colB = new V3D(0.4,0.7,0.6);
	// var colC = new V3D(0.5,0.5,0.5);
	var colA = new V3D(Math.random(),Math.random(),Math.random());
	var colB = new V3D(Math.random(),Math.random(),Math.random());
	var colC = new V3D(Math.random(),Math.random(),Math.random());
	// var colB = new V3D(0.036793767008930445,0.08767530764453113,0.0865488569252193); //
	// var colC = new V3D(0.025423486484214664,0.7779278077650815,0.7668401680421084); // CLOSER

	this.makeBlock(colA);
	this.makeBlock(colB);
	this.makeBlock(colC);
	console.log( colA.toString() );
	console.log( colB.toString() );
	console.log( colC.toString() );
	console.log( ".................." );
	// console.log( this.compareColorScale(colA,colB) , this.compareColorScale(colB,colA) );
	// console.log( this.compareColorScale(colA,colC) , this.compareColorScale(colC,colA) );
	// console.log( this.compareColorDifference(colA,colB) , this.compareColorScale(colA,colB), this.compareColorDifference(colA,colB)+this.compareColorScale(colA,colB)*.1 );
	// console.log( this.compareColorDifference(colA,colC) , this.compareColorScale(colA,colC), this.compareColorDifference(colA,colC)+this.compareColorScale(colA,colC)*.1 );
	console.log( this.compareFlatColors(colA,colB) );
	console.log( this.compareFlatColors(colA,colC) );
}
Match.prototype.makeBlock = function(v){
	var r = Math.round(v.x*255.0);
	var g = Math.round(v.y*255.0);
	var b = Math.round(v.z*255.0);
	var col = Code.getColARGB(255,r,g,b);
	col = Code.getJSColorFromARGB(col);
	var div = Code.newDiv("---");
	Code.setStyleBackground(div,col);
	Code.addChild(document.body,div);
}
Match.prototype.compareFlatColors = function(colA, colB){
	return this.compareColorDifference(colA,colB)+this.compareColorScale(colA,colB)*.1;
}
Match.prototype.compareColorDifference = function(colA, colB){ // best [0, inf] 
	//console.log("COMPARE --------------------------- ");
	var a = colA.x-colB.x; a = Math.abs(a) + 1;
	var b = colA.y-colB.y; b = Math.abs(b) + 1;
	var c = colA.z-colB.z; c = Math.abs(c) + 1;
	//console.log(a,b,c);
	var errA = (a*a)-1;
	var errB = (b*b)-1;
	var errC = (c*c)-1;
	score = errA + errB + errC;
	return score;
}
Match.prototype.compareColorScale = function(colA, colB){
	var briA = colA.x + colA.y + colA.z;
	var briB = colB.x + colB.y + colB.z;
	if(briA>briB){
		return this.compareColorScaleSingle(colB,colA);
	}
	return this.compareColorScaleSingle(colA,colB);
}
Match.prototype.compareColorScaleSingle = function(colA, colB){
	var a = colA.x/colB.x - 1; a = Math.min(a, 1000);
	var b = colA.y/colB.y - 1; b = Math.min(b, 1000);
	var c = colA.z/colB.z - 1; c = Math.min(c, 1000);
	var min = Math.min(a,b,c);
	var errA = Math.pow(Math.abs(a-min)+1,2)-1;
	var errB = Math.pow(Math.abs(b-min)+1,2)-1;
	var errC = Math.pow(Math.abs(c-min)+1,2)-1;
	score = errA + errB + errC;
	return score;
}
Match.prototype._imageCompleteFxn3 = function(o){
	var imageDO = new DO();
	//this._stage.stop();
	Code.copyArray(this._imageList,o.images);
	var images = o.images;
	var img = images[0];
	var ox = 0, oy = 0;
	var i, j, len, obj, index;
	var wid = img.width;
	var hei = img.height;
	this._canvas.drawImage2(img, 0,0);

	var matrix = new Matrix2D();
	var imgDO;
	imgDO = new DOImage( img );
		matrix.identity();
		matrix.translate(-100,-100);
	img = this._stage.renderImage(50,50, imgDO, matrix, Canvas.IMAGE_TYPE_PNG);

	imgDO.image( img );
	this._stage.root().addChild(imgDO);
	imgDO.matrix().identity();
	//imgDO.matrix().scale(0.25,0.25);
	imgDO.matrix().translate(10,10);

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

