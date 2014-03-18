// Match.js
/*
NEW POINT-MATCHING STEPS:

A) find points of most uniqueness - use corners, edges, colors, (find local maxima if clustered): 100~1000 points

B) find scale-space of image: (100~200)
	find maxima for eatch feature in scale space
		- use this as characteristic scale
	discard features that don't have a maxima(minima?) in scale-space or have repeated extrema

C) find affine transformation of each point/area
	iterative method mikaokovichk
	matrix := skew and non-proportional 2D scale
	rotation = primary direction of gradient

D) describe each point as some combination of: (50~100)
	gray(base)/red/green/blue orientations
	gray(base)/red/green/blue relative intensities (local/global)?
	histogram of orientations (SIFT)
	* if too many points, discard points that
		dont have large gradients (more edge/corner-like)
		don't have large color volume [sum of intensities: minima to maxima] - high variation in color
		are fairly bland in each/all r/g/b/y

E) compare points from seperate pictures and assign comparrison score:
	compare in small number of combinations and use best score
	* relative orientation
		- eg is red CCW or CW from gray
	* relative color intensities
		- eg is red brighter than green
	if initial scores are obviously bad, don't bother detailed comparrison
		* best orientation [-1,0,1]
		* SoSD
		* correlation

F) decide best matches for each point by sorting by best match (pt.matchest[0].score), and going down list as posibilities dwindle
	ptA.matches = [{ptX,score},{ptY,score},..{ptZ,score}]
	ptB.matches = [{ptI,score},{ptJ,score},..,{ptA,score}]
	* if a point point group is found (set of point match eachother well)
		A: half (or less - zoom out) each of these characteristic-scales to better separate eachother
		B: discard each point, as they cannot be told apart

-----------
3D SPARSE POINT LOCALIZATION

* need to find 3D location of cameras

A) ass-load of projective geometry reduction to affine to metric

* find 3D location of several feature points

=> refinement of camera matrices

-----------
DENSE 3D POINT LOCALIZATION

searching along epipolar-type lines? => 1D searching

-----------
TRIANGULATION

use point cloud to figure out triangle mapping

-----------
TEXTURING

blend images from different perspectives to get best
- best images have largest area 


*/

Match.YAML = {
	DESCRIPTORS: "descriptors",
	DESCRIPTOR: "descriptor",
}

function Match(){
	this._canvas = new Canvas(null, 400,600, Canvas.STAGE_FIT_FILL, false);
	//this._canvas.addListeners();
	this._stage = new Stage(this._canvas, (1/10)*1000);
	this._stage.start();
	this._root = new DO(); this._stage.root().addChild(this._root);
	//
	this._imageList = new Array();
	//var imageLoader = new ImageLoader("./images/medium/", ["BLT.png", "BLB.png"], // ["damn.png"], // ["max.png"], //"FT.png","FRB.png","FR.png","FLT2.png","FLT.png","FLB2.png","FLB.png","FL.png","FB.png","BRT.png","BRB.png","BLT.png","BLB.png","BL.png"],
		//this,this._imageCompleteFxn,this._imageProgressFxn);
// BLT.png
	var list = [];
	list.push("original.png");
	//list.push("scalexy.png");
	//list.push("scalex.png");
	list.push("scalexrotateskew.png");
	var imageLoader = new ImageLoader("./images/test/", list, this,this._imageCompleteFxn,this._imageProgressFxn);
	imageLoader.load();
}
Match.prototype._imageProgressFxn0 = function(o){
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
	return {width:wid, height:hei, red:red, grn:grn, blu:blu};
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
Match.prototype.drawDot = function(pt, v1,v2, e1,e2, rad){
	var d = new DO();
	rad = rad!==undefined?rad:10.0;
	var ratioA = 1.0, ratioB = 1.0;
	if(e1!==undefined && e2!==undefined){
		if(e1>e2){
			ratioA = e1/e2;
		}else{
			ratioB = e2/e1;
		}
	}
	var angle = 0;
	if(v1!==undefined && v2!==undefined){
		angle = V2D.angleDirection(v2,new V2D(1,0));
		//angle = Math.PI/2 + V2D.angle(v2,new V2D(1,0));
		//if(Math.abs(angle)>Math.PI*0.5){
		//if(ratioA>ratioB){
		if(e2>e1){
			//console.log("REVERSE");
		 	angle = Math.PI + V2D.angleDirection(v1,new V2D(-1,0));
		}else{
			//console.log("FORWARD");
		}
		//console.log((angle)*180/Math.PI);
	}
	//main
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().setFill(0x33FF0000);
	d.graphics().moveTo(rad,0);
	//d.graphics().arc(0,0, rad*Math.max(ratioA,ratioB), 0,Math.PI*2, false);
	ratioA = Math.min(Math.abs(ratioA),10);
	ratioB = Math.min(Math.abs(ratioB),10);
	d.graphics().drawEllipse(0,0, rad*2*ratioA,rad*2*ratioB, angle);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	// dot
	rad2 = 1.0;
	d.graphics().beginPath();
	d.graphics().setFill(0xFFFF0000);
	d.graphics().moveTo(rad2,0);
	d.graphics().arc(0,0, rad2, 0,Math.PI*2, false);
	d.graphics().endPath();
	d.graphics().fill();
	if(v1!==undefined && v2!==undefined){
		d.graphics().setLine(1.0,0xFF00FF00);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(rad*ratioA*v1.x,rad*ratioA*v1.y);
		//d.graphics().lineTo(rad,0);
		d.graphics().endPath();
		d.graphics().strokeLine();
		// EV B
		d.graphics().setLine(1.0,0xFF0000FF);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(rad*ratioB*v2.x,rad*ratioB*v2.y);
		//d.graphics().lineTo(0,rad);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	// var container = new DO();
	// container.addChild(d);
	var container = d;
	container.matrix().identity();
	container.matrix().translate(pt.x,pt.y);
	return container;
}
Match.prototype._imageCompleteFxnOLD = function(o){
	var root = this._root;
	root.matrix().identity();
	root.matrix().scale(1.0);//,0.5);
// NEW TESTING ...
	var i, d, rad, wid, hei, img, rMin, rMax, eccentricity, radGrad;
	// 1. draw gradient oval @ angle
	wid = 201; hei = 201;
	rMin = 10; rMax = 100;
	ang = 1*Math.PI*(1/8);
	radGrad = this._canvas.createRadialGradient(0,0,0, 0,0,rMax, 0.0,0xFF000000, 1.0,0x00000000); //  0.5,0x66000000,
	eccentricity = Math.sqrt(rMax*rMax-rMin*rMin)/rMax;
	console.log(rMax/rMin,eccentricity);
	var dBG = new DO();
	d = dBG;
	d.graphics().clear();
	d.graphics().setLine(1.0,0x00000000);
	d.graphics().beginPath();
	d.graphics().setFill(0xFFFFFFFF);
	d.graphics().drawRect(0,0,wid,hei);
	d.graphics().endPath();
	d.graphics().fill();
	var dOval = new DO();
	d = dOval;
	d.graphics().clear();
	d.graphics().setLine(1.0,0x00000000);
	d.graphics().beginPath();
	d.graphics().setFill(radGrad);
	d.graphics().moveTo(0,0);
	d.graphics().arc(0,0, rMax, 0,Math.PI*2, false);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	d.matrix().identity();
	d.matrix().scale(rMin/rMax,1);
	d.matrix().rotate(ang);
	d.matrix().translate(wid/2,hei/2);
	//
	var dTrash1 = new DO();
	d = dTrash1;
	d.graphics().clear();
	d.graphics().setLine(1.0,0x00000000);
	d.graphics().beginPath();
	radGrad2 = this._canvas.createRadialGradient(0,0,0, 0,0,50, 0.0,0xFF000000, 1.0,0x00000000);
	d.graphics().setFill(radGrad2);
	d.graphics().moveTo(0,0);
	d.graphics().arc(0,0, 50, 0,Math.PI*2, false);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	d.matrix().identity();
	d.matrix().scale(2,1);
	d.matrix().rotate(Math.PI/8);
	d.matrix().translate(wid/2,35);
	//
	root.addChild(dBG);
	root.addChild(dTrash1);
	root.addChild(dOval);
	// 2. convert to image float
	var matrix = new Matrix2D(); matrix.identity();
	// img = this._stage.renderImage(wid,hei,d, matrix, Canvas.IMAGE_TYPE_PNG);
	// d = new DOImage(img);
	// root.addChild(d);
	var colargb = this._stage.getDOAsARGB(root, wid,hei, matrix);
		dBG.removeParent();
		dOval.removeParent();
	var imgMat = new ImageMat(wid,hei);
	imgMat.setFromArrayARGB(colargb);
	var gray = imgMat.getGrayFloat();// gray = ImageMat.normalFloat01(gray);
	// NOISE
var noiseMax = 1.0;
var noiseOff = noiseMax*0.5;
	gray = ImageMat.randomAdd(gray,noiseMax,noiseOff);
	gray = ImageMat.normalFloat01(gray);

	var argb = ImageMat.ARGBFromFloat(gray);
	var src = this._stage.getARGBAsImage(argb, wid,hei);
	var doi = new DOImage( src );
		doi.matrix().identity();
	root.addChild(doi);

	var transform = new Matrix(3,3);
	transform.identity();
	// recursive time ... 
	var currentWid = 75;
	var currentHei = 75;
	var eigenMinimaDim = 75; // .. end of scale-space-edge - this actually doesn't seem to matter at all...
	var currentScale = 1.0;
	var currentSigma = 5.0; // bigger is better .. to a point
	var currentImage; //= ImageDescriptor.exRect(wid/2/wid,hei/2/hei,currentScale,currentSigma, currentWid,currentHei, gray,wid,hei, transform);
	//console.log(currentImage);
	//var currentImage = ImageMat.extractRect(this._flatGry, 0,0, wid-1,0, wid-1,hei-1, 0,hei-1, currentWid,currentHei, wid,hei);
var originalMinimum = null;
var totalScale = 1.0;
var i, len;
var bestIteration = -1;
var bestRatio = 666;
var bestTransform = new Matrix(3,3);



// LAST STEP - CONVERGE TO LOCAL GAUSSIAN MAXIMA POINT
// maximum distance tolerance?
var badOffsetX = 0; var badOffsetY = 0;

for(i=0;i<10;++i){
	currentImage = ImageMat.extractRectFromFloatImage(wid/2/wid,hei/2/hei,currentScale,null, currentWid,currentHei, gray,wid,hei, transform);
	
	
	// get SMM
	var eigRatio;
	var SMM = new Array();
var gaussSize = Math.round(2+currentSigma)*2+1;
//console.log("gauss size: "+gaussSize);
var gaussian = ImageMat.getGaussianWindow(gaussSize,1, currentSigma);
var blurredImage = currentImage; //ImageMat.gaussian2DFrom1DFloat(currentImage, currentWid,currentHei, gaussian);
	var res = ImageMat.harrisDetector(blurredImage,currentWid,currentHei, SMM, undefined, currentSigma); //console.log(res); response Lx Ly
	var centerX = Math.floor(currentWid*0.5) + badOffsetX, centerY = Math.floor(currentHei*0.5) + badOffsetY;
	var centerIndex = currentWid*centerY+centerX;
	var smm = SMM[centerIndex];
	// get eigen values/vectors
	var mat = new Matrix(2,2);
	mat.setFromArray(smm);
	eig = Matrix.eigenValuesAndVectors(mat);
	if(eig.values[0]<eig.values[1]){ console.log("...................................................................BAAAAAAAAAAAAAAAAAAAAAAAA"); }
	l0 = eig.values[0];
	l1 = eig.values[1];
	eigRatio = Math.max(l1,l0)/Math.min(l1,l0);
	e0 = [eig.vectors[0].get(0,0), eig.vectors[0].get(1,0)];
	e1 = [eig.vectors[1].get(0,0), eig.vectors[1].get(1,0)];
	var eigVecA = new V2D(e0[0],e0[1]);
	var eigVecB = new V2D(e1[0],e1[1]);
	//console.log("eigenValue ratio: "+eigRatio+"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< "+i);
	console.log(eigRatio);
	//var antiVariance = Math.sqrt(eigRatio); // Math.sqrt(eigRatio/2);
	//console.log("antiVariance:"+antiVariance+"      "+(Math.sqrt(eigRatio/2)));
	//console.log(l0,eigVecA.toString());
	//console.log(l1,eigVecB.toString());
	if(originalMinimum==null){
		originalMinimum = new V2D(eigVecA.x*eigenMinimaDim,eigVecA.y*eigenMinimaDim);
	}
	//
	// //var matinv = Matrix.power(mat,0.5);//Matrix.inverse(mat);
	// var matinv = Matrix.inverse(mat);
	// // console.log("INVERSE");
	// // console.log(matinv.toString());
	// eig = Matrix.eigenValuesAndVectors(matinv);
	// l0 = eig.values[0];
	// l1 = eig.values[1];
	// eigRatio = Math.max(l1,l0)/Math.min(l1,l0);
	// e0 = [eig.vectors[0].get(0,0), eig.vectors[0].get(1,0)];
	// e1 = [eig.vectors[1].get(0,0), eig.vectors[1].get(1,0)];
	// var eigVecA = new V2D(e0[0],e0[1]);
	// var eigVecB = new V2D(e1[0],e1[1]);
	// console.log(eigRatio);
	// console.log(l0,eigVecA.toString());
	// console.log(l1,eigVecB.toString());

	// // SVD
	// var svd = Matrix.SVD(mat);
	// var lambdaMax = Math.max(svd.S.get(0,0),svd.S.get(1,1));
	// var lambdaMin = Math.min(svd.S.get(0,0),svd.S.get(1,1));
	// console.log(lambdaMax,lambdaMin,lambdaMax/lambdaMin);
	// // if(lambdaMax==svd.S.get(0,0)){
	// // 	svd.S.set(0,0, 1.0);
	// // }else{
	// // 	svd.S.set(1,1, 1.0);
	// // }
	// svd.S.set(0,0, svd.S.get(0,0)/lambdaMax);
	// svd.S.set(1,1, svd.S.get(1,1)/lambdaMax);
	// mat = Matrix.fromSVD(svd.U,svd.S,svd.V);
	// //
	// eig = Matrix.eigenValuesAndVectors(mat);
	// l0 = eig.values[0];
	// l1 = eig.values[1];
	// eigRatio = Math.max(l1,l0)/Math.min(l1,l0);
	// e0 = [eig.vectors[0].get(0,0), eig.vectors[0].get(1,0)];
	// e1 = [eig.vectors[1].get(0,0), eig.vectors[1].get(1,0)];
	// console.log(eigRatio);
	// console.log(l0,eigVecA.toString());
	// console.log(l1,eigVecB.toString());

	// 
	var vectorX = new V2D(1,0), vectorY = new V2D(0,1);
	var angleYVecA = V2D.angleDirection(vectorY,eigVecA);
	var angleYVecB = V2D.angleDirection(vectorY,eigVecB);
	//console.log("AtoY: "+(angleYVecA*180/Math.PI));
	//console.log("BtoY: "+(angleYVecB*180/Math.PI));
	

	// SHOW FOR FUNNESS
	var newArgb, newImg;
	newArgb = ImageMat.ARGBFromFloat(currentImage);
	newImg = this._stage.getARGBAsImage(newArgb, currentWid,currentHei);
	doi = new DOImage( newImg );
	doi.matrix().identity(); doi.matrix().translate(currentWid*(i*1+0),hei);
	root.addChild(doi);

	var rot = new Matrix(3,3);
	var sca = new Matrix(3,3);
	var cum = new Matrix(3,3); cum.identity();
	var ang, amt;
	//
	ang = -angleYVecA;
	rot.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1]);
	cum = Matrix.mult(cum,rot);
	amt = Math.pow(eigRatio,0.25);
	totalScale *= amt;
	amt2 = 1.0;
	sca.setFromArray([1/amt,0,0, 0,amt2,0, 0,0,1]);
	cum = Matrix.mult(cum,sca);
	ang = angleYVecA;
	rot.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1]);
	cum = Matrix.mult(cum,rot);
	transform = Matrix.mult(transform,cum);

	transformImage = ImageMat.extractRectFromFloatImage(wid/2/wid,hei/2/hei,currentScale,currentSigma, currentWid,currentHei, gray,wid,hei, transform);
	newArgb = ImageMat.ARGBFromFloat(transformImage);
	newImg = this._stage.getARGBAsImage(newArgb, currentWid,currentHei);
	doi = new DOImage( newImg );
	doi.matrix().identity(); doi.matrix().translate(currentWid*(i*2+1),hei);
	//root.addChild(doi);

	// recheck on scale
	var t = new V2D();
	transform.multV2DtoV2D(t,originalMinimum);
	var correctScale = ( (t.length()/eigenMinimaDim) );
//	console.log("DIFFERENCE: "+correctScale);
	correctScale = 1/correctScale;
	totalScale *= 1/correctScale;
	// correct to maximum scale
	sca.setFromArray([correctScale,0,0, 0,correctScale,0, 0,0,1]);
	//transform = Matrix.mult(transform,sca);
	transform = Matrix.mult(sca,transform);
	// correct only in 1 direction

	// find transformation to affine
if(eigRatio<bestRatio){
	bestIteration = i
	bestRatio = eigRatio;
	bestTransform.copy(transform);
}


}
//console.log("totalScale: "+totalScale);

console.log(bestRatio+" | "+bestIteration);
transformImage = ImageMat.extractRectFromFloatImage(wid/2/wid,hei/2/hei,currentScale,undefined, currentWid,currentHei, gray,wid,hei, bestTransform);
	newArgb = ImageMat.ARGBFromFloat(transformImage);
	newImg = this._stage.getARGBAsImage(newArgb, currentWid,currentHei);
	doi = new DOImage( newImg );
	doi.matrix().identity(); doi.matrix().translate(currentWid*i,hei);
root.addChild(doi);

	console.log("done");
	return;
}

Match.prototype._onYAMLCompleteFxn = function(o){
	var DATA = Match.YAML;
	var i, j, len, len2, d, f, descriptor, list, img, obj, yaml=new YAML(), hash=new Object();
	var currentWidth = 0, currentHeight = 0;
	var files = o.files;
	var contents = o.contents;
	var descriptors = new Array();
	len = files.length;
	for(i=0;i<len;++i){
		hash[this._fileList[i]] = this._imageList[i];
	}
	for(i=0;i<len;++i){
		obj = yaml.parse(contents[i]); // documents
		descriptor = new ImageDescriptor();
		descriptor.loadFromYAML(obj[0][DATA.DESCRIPTOR]);
		descriptors.push( descriptor );
		img = hash[ descriptor.imageFileName() ];
		obj = this.getDescriptorParameters( img );
		descriptor.setImageData( obj.width,obj.height,obj.red,obj.grn,obj.blu );
	}
	// draw images on screen
	var container = new DO(); this._root.addChild(container);
	container.matrix().identity(); container.matrix().scale(1.0);
	for(i=0;i<len;++i){
		img = hash[ descriptors[i].imageFileName() ];
		d = new DOImage( img );
		d.matrix().identity();
		d.matrix().translate(currentWidth,currentHeight);
		currentWidth += d.width();
		container.addChild(d);
	}
var dA = descriptors[0];
var dB = descriptors[1];

	// draw features on screen
var indexA = 6, indexB = 25; // worst
//var indexA = 52, indexB = 152;
//80&59
//var indexA = 79, indexB = 71; // best
//var indexA = 6, indexB = 25;
var indexA = Math.floor(Math.random()*dA.getFeatureList().length), indexB = Math.floor(Math.random()*dB.getFeatureList().length);
//indexA = 6; // 98 99 115 148 161 184 | 25
indexA = 79; // 117 152
//indexB = 71;
//console.log(indexA,indexB);

indexA = 0; indexB = 146;
	var rad = 2.0, x, y, s, w, h;
	currentWidth = 0; currentHeight = 0;
	for(i=0;i<len;++i){
		img = hash[ descriptors[i].imageFileName() ];
		w = descriptors[i].width(); h = descriptors[i].height();
		list = descriptors[i].getFeatureList();
		len2 = list.length;
		d = new DO();
		d.matrix().identity();
		d.matrix().translate(currentWidth,currentHeight);
		container.addChild(d);
		d.graphics().clear();
		for(j=0;j<len2;++j){
//if(j>145){break;}
			f = list[j];
			x = f.x()*w; y = f.y()*h; s = f.scale();
			d.graphics().setLine(1.0,0xFFFFFF00);
			d.graphics().beginPath();
			d.graphics().setFill(0x66FFFFFF);
			if(i==0&&j==indexA){
				d.graphics().setLine(1.0,0xFF00FF00);
				d.graphics().setFill(0xFFFF00000);
			}else if(i==1&&j==indexB){
				d.graphics().setLine(1.0,0xFF00FF00);
				d.graphics().setFill(0xFFFF00000);
			}
			d.graphics().moveTo(x+rad*s,y);
			d.graphics().arc(x,y, rad*s, 0,Math.PI*2.0, false);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		}
		currentWidth += w;
	}


	var fA = dA.getFeatureList()[indexA];
	var fB = dB.getFeatureList()[indexB];
	fA.descriptor(dA);
	fA.findOrientations(dA.redFlat(),dA.greenFlat(),dA.blueFlat(),dA.grayFlat(),dA.width(),dA.height());
	fB.descriptor(dB);
	fB.findOrientations(dB.redFlat(),dB.greenFlat(),dB.blueFlat(),dB.grayFlat(),dB.width(),dB.height());
	var ang = ImageFeature.bestRotation(fA,fB);
	var grys = fA.colorAngle().gry()-fB.colorAngle().gry();
	console.log(ang*180/Math.PI);
	console.log(grys*180/Math.PI);
	ang = grys+ang;
	console.log(ang*180/Math.PI);
	fA.findDescriptor(dA.redFlat(),dA.greenFlat(),dA.blueFlat(),dA.grayFlat(),dA.width(),dA.height(), 0);
	fB.findDescriptor(dB.redFlat(),dB.greenFlat(),dB.blueFlat(),dB.grayFlat(),dB.width(),dB.height(), ang);
	// console.log(fA._bins.toString());
	// console.log(fB._bins.toString());
	console.log( "SIFT: "+SIFTDescriptor.compare(fA.bins(),fB.bins()) );
	fA.findSurface(dA.redFlat(),dA.greenFlat(),dA.blueFlat(),dA.grayFlat(),dA.width(),dA.height(), 0);
	fB.findSurface(dB.redFlat(),dB.greenFlat(),dB.blueFlat(),dB.grayFlat(),dB.width(),dB.height(), ang);
	// console.log(fA._flat);
	// console.log(fB._flat);
	console.log( "SSD:  "+ColorMatRGBY.SSD(fA.flat(),fB.flat()) );
	console.log( "conv: "+ColorMatRGBY.convolution(fA.flat(),fB.flat()) );
	
i = 0;
d = this._showFeature(fA,null,dA);
this._root.addChild(d);
d.matrix().translate(0 + 125*2*i,0);
d = this._showFeature(fB,fA,dB);
this._root.addChild(d);
d.matrix().translate(125 + 125*2*i,0);

//return;

	// compare features
	var matcher = new ImageMatcher();
	matcher.matchDescriptors(descriptors[0],descriptors[1]);
	matcher.chooseBestMatches();
	matcher.consolidateMatches();
	var best = matcher._matches;
	var fA, fB;
	for(i=0;i<10&&i<best.length;++i){
		fA = best[i][0];
		fB = best[i][1];
		console.log(best[i][2]);
		d = this._showFeature(fA,null,dA);
		this._root.addChild(d);
		d.matrix().translate(0 + 125*2*i,0);
		d = this._showFeature(fB,fA,dB);
		this._root.addChild(d);
		d.matrix().translate(125 + 125*2*i,0);
	}
	//Code.copyToClipboardPrompt(o.contents[0]);
}
Match.prototype._showFeature = function(fB,fA,dB, size){
	var ang = 0;
	if(fA!==undefined&&fA!==null){
		ang = ImageFeature.bestRotation(fA,fB);
		ang += fA.colorAngle().gry()-fB.colorAngle().gry();
	}
	var container = new DO();
	var floatRed, floatGrn, floatBlu, floaGry, argb;
	var imgWid = 125, imgHei = 125;
	if(size!==undefined){
		imgWid = size; imgHei = size;
	}
	var rr = 1.0;
//rr = ()/();
	var sigma = undefined;
	var rad = 20;
	floatRed = ImageMat.extractRectFromFloatImage(fB.x(),fB.y(),fB.scale()*ImageDescriptor.SCALE_MULTIPLIER*rr,sigma, imgWid,imgHei, dB.redFlat(),dB.width(),dB.height(), fB.transform());
	floatGrn = ImageMat.extractRectFromFloatImage(fB.x(),fB.y(),fB.scale()*ImageDescriptor.SCALE_MULTIPLIER*rr,sigma, imgWid,imgHei, dB.greenFlat(),dB.width(),dB.height(), fB.transform());
	floatBlu = ImageMat.extractRectFromFloatImage(fB.x(),fB.y(),fB.scale()*ImageDescriptor.SCALE_MULTIPLIER*rr,sigma, imgWid,imgHei, dB.blueFlat(),dB.width(),dB.height(), fB.transform());
	// floatGry = ImageMat.extractRectFromFloatImage(fB.x(),fB.y(),fB.scale(),undefined, imgWid,imgHei, dB.grayFlat(),dB.width(),dB.height(), fB.affine());
	argb = ImageMat.ARGBFromFloats(floatRed,floatGrn,floatBlu);
	img = this._stage.getARGBAsImage(argb, imgWid,imgHei);
	d = new DOImage(img);
	d.matrix().identity();
	d.matrix().translate(-imgWid*0.5,-imgHei*0.5);
	d.matrix().rotate(ang);
	d.matrix().translate(imgWid*0.5,imgHei*0.5);
	//d.matrix().translate(imgWid,0);
	container.addChild(d);
	d = this.describeAngleDO(fB.colorAngle(),rad);
	d.matrix().rotate(ang);
	d.matrix().translate(imgWid*0.5,imgHei*0.5);
	//d.matrix().translate(imgWid,0);
	container.addChild(d);
	return container;
}


Match.prototype.testA = function(){
	var i, len, j, len2, list, x, y, s;
	var images = this._imageList;
	var files = this._fileList;
	var root = this._root;
root.matrix().scale(1.5);
	var currentWidth = 0, currentHeight = 0;
	len = images.length;
	// find points
	for(i=0;i<len;++i){
		var filename = files[i];
		var params = this.getDescriptorParameters( images[i] );
		var wid = params.width;
		var hei = params.height;
		var imageSourceRed = params.red;
		var imageSourceGrn = params.grn;
		var imageSourceBlu = params.blu;
		var imageSourceGry = ImageMat.grayFromRGBFloat(imageSourceRed,imageSourceGrn,imageSourceBlu);
		var descriptor = new ImageDescriptor(wid,hei, imageSourceRed,imageSourceGrn,imageSourceBlu,imageSourceGry, filename);
		//descriptor.processScaleSpace();
		if(i==0){ // original
/*
0.5770567855797708 0.2688175290822983 - TOUNGE
0.950956238200888 0.27552822907455266 - lOops
- loOps
0.2372146206907928 0.6518329964019358 - red dot
0.18492452520877123 0.8221863184589893 - O
0.7487616746220738 0.3051234376616776 - nosy
0.8936987929046154 0.7520224319305271 - looPS corner
0.46295735728926957 0.7622571864631027 - red-right
*/
//descriptor._features.push(  new ImageFeature(0.1+Math.random()*0.8,0.1+Math.random()*0.8,1.0,0,null) ); // random
			//descriptor._features.push(  new ImageFeature(0.355,0.927,1.5,0,null) ); // purple
			//descriptor._features.push(  new ImageFeature(0.260,0.55,1.2,0,null) ); // yellow	
			//descriptor._features.push(  new ImageFeature(0.330,0.875,1.2,0,null) ); // milky
			//descriptor._features.push(  new ImageFeature(0.50,0.54,1.2,0,null) ); // nose
			//descriptor._features.push(  new ImageFeature(0.65,0.538,0.20,0,null) ); // nose middle
			//descriptor._features.push(  new ImageFeature(0.595,0.885,0.60,0,null) ); // big orange
			descriptor._features.push(  new ImageFeature(0.463,0.762,1.0,0,null) ); // red-right
			//descriptor._features.push(  new ImageFeature(0.79,0.94,1.0, 0,null) ); //
			//descriptor._features.push(  new ImageFeature(0.38,0.70,1.0, 0,null) ); //ss-purple-green
			//descriptor._features.push(  new ImageFeature(0.26,0.555,1.0, 0,null) ); //ss-yellow
			//descriptor._features.push(  new ImageFeature(0.46,0.85,1.0, 0,null) ); //ss-blue-dot
// descriptor._features.push(  new ImageFeature(, 0,null) );
//descriptor._features.push(  new ImageFeature(0.698614107706785 - 0.0,0.22024469633081295,1.2308463075382536, 0,null) );
//descriptor._features.push(  new ImageFeature(0.13988446394875864,0.9826467269202003,1.2334442591633725, 0,null) ); // unstable
//descriptor._features.push(  new ImageFeature(0.786469088791974,0.9729863982323277,1.1145807408953505, 0,null) );
//descriptor._features.push(  new ImageFeature(0.5483375933581802,0.289180176915191,1.285176190288322, 0,null) ); // huge warp
//descriptor._features.push(  new ImageFeature(0.8309661319692764,0.4922512001961615,1.2103175881407138, 0,null) ); 
//descriptor._features.push(  new ImageFeature(0.9807982688350545,0.6764733933804175,2.720872906394579, 0,null) );
//descriptor._features.push(  new ImageFeature(0.4620506522782965,0.12630109420727706,13.810006344812784, 0,null) ); // zoomed too far out
//descriptor._features.push(  new ImageFeature(0.9424575726833312,0.03976487234949018,1.6604275649175595, 0,null) );
//descriptor._features.push(  new ImageFeature(0.9355483285177654,0.02465363081294266,1.5584287925259843, 0,null) ); // huge warp
//descriptor._features.push(  new ImageFeature(0.8694241484516644,0.1373139938548761,1.682136042406485, 0,null) ); // unstable
/*
*/
		}
		// if(i==1){ // scalexy
		// 	descriptor._features.push(  new ImageFeature(0.60,0.89,2.0,0,null) ); // purple
		// }
		// if(i==1){ // scalex
		// 	descriptor._features.push(  new ImageFeature(0.280,0.909,1.2,0,null) ); // purple
		// }
		if(i==1){ // scalexrotateskew
			descriptor._features.push(  new ImageFeature(0.66,0.075,1.5,0,null) ); // purple
			//descriptor._features.push(  new ImageFeature(0.460,0.445,1.3,0,null) ); // yellow
			//descriptor._features.push(  new ImageFeature(0.275,0.46,1.2,0,null) ); // nose ------ unstable
			//descriptor._features.push(  new ImageFeature(0.20,0.44,0.25,0,null) ); // nose middle
			//descriptor._features.push(  new ImageFeature(0.455,0.125,1.4,0,null) ); // big orange
			descriptor._features.push(  new ImageFeature(0.465,0.245,1.0,0,null) ); // red-right
			//descriptor._features.push(  new ImageFeature(0.49,0.30,1.0, 0,null) ); //ss-purple-green
			//descriptor._features.push(  new ImageFeature(0.46,0.44,1.0, 0,null) ); //ss-yellow
			//descriptor._features.push(  new ImageFeature(0.535,0.15,1.0, 0,null) ); //ss-blue-dot
			// XY:
			//descriptor._features.push(  new ImageFeature(0.595,0.885,1.5*1.5,0,null) ); // purple
			// 
		}
		// descriptor.processAffineSpace();
		// descriptor.describeFeatures();
		// show image
		d = new DOImage(images[i]);
		d.matrix().translate(currentWidth,currentHeight);
		root.addChild(d);
		// EACH FEATURE
		list = descriptor.getFeatureList();
		len2 = list.length;
		var container = new DO();
		container.matrix().translate(currentWidth,currentHeight);
		root.addChild(container);
		for(j=0;j<len2;++j){
			var f = list[j];
			console.log( f.x(),f.y(),f.scale() );
			var ret = descriptor.detectPoint( new V3D( f.x(),f.y(),f.scale() ) );
			var points = ret.points;
			var windows = ret.windows;
			var eigens = ret.eigens;
			var rad = 5.0, effR;
			// points
			for(k=0;k<points.length;++k){
				var blu = Math.floor((0xFF)*(points.length-k-1)/(points.length-1)); // START
				var grn = 0x00;//Math.floor((0xFF)*(k)/(points.length-1)); // END
				var red = Math.floor((0xFF)*(k)/(points.length-1)); // END
				d = new DO();
				d.graphics().setLine(1.0,Code.getColARGB(0x66,red,grn,blu));
				d.graphics().beginPath();
				d.graphics().setFill(0x00FFFFFF);
				//effR = rad*(0.5+0.5*(points.length-k) );
				effR = Math.min(Math.abs(rad/(points[k].z)),200);
				d.graphics().moveTo(effR,0);
				d.graphics().arc(0,0, effR, 0,Math.PI*2.0, false);
				d.graphics().endPath();
				d.graphics().fill();
				d.graphics().strokeLine();
				d.matrix().translate(points[k].x*wid,points[k].y*hei);
				container.addChild(d);
			}
			// windows
			for(k=0;k<windows.length;++k){
				// ret.width,ret.height
				var actualWid = Math.sqrt(windows[k].length);
				var actualHei = actualWid;
				d = new DOImage( this._stage.getARGBAsImage(ImageMat.ARGBFromFloat(windows[k]), actualWid, actualHei) );
				d.matrix().translate(k*ret.width*1.0,i*ret.height+hei);
				container.addChild(d);
			}
			// eigens
			for(k=0;k<eigens.length;++k){
				var v1 = eigens[k][0];
				var v2 = eigens[k][1];
				var e1 = eigens[k][2];
				var e2 = eigens[k][3];
				d = this.drawDot(new V2D(0,0), v1,v2, e1,e2, 25.0);
				d.matrix().translate((k+0.5)*ret.width,(i+0.5)*ret.height+hei);
				container.addChild(d);
			}
		}

currentWidth += wid;
continue;
		// show points
		list = descriptor.getFeatureList();
		len2 = list.length;
		var container = new DO();
		var rad = 4.0;
		for(j=0;j<len2;++j){
			d = new DO();
			f = list[j];
			x = f.x()*wid; y = f.y()*hei; s = f.scale();
			d.graphics().setLine(1.0,0xFF000000);
			d.graphics().beginPath();
			d.graphics().setFill(0x66FFFFFF);
			// if(i==0&&j==indexA){
			// 	d.graphics().setLine(1.0,0xFF00FF00);
			// 	d.graphics().setFill(0xFFFF00000);
			// }else if(i==1&&j==indexB){
			// 	d.graphics().setLine(1.0,0xFF00FF00);
			// 	d.graphics().setFill(0xFFFF00000);
			// }
			d.graphics().moveTo(0+rad*s,0);
			d.graphics().arc(0,0, rad*s, 0,Math.PI*2.0, false);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
			//
d.matrix().copy( Matrix2D.matrix2DfromMatrix( Matrix.inverse(f.transform()) ) );
d.matrix().translate(x,y);
			//
			container.addChild(d);
			// show feature

			// show scale space for point
			var val = descriptor.doesPointHaveScaleExtrema(f.x(),f.y());
//			console.log(val);
//			console.log(val.max,val.min);
			var arr = val.images;
			var data = val.values;
			var wi = val.width;
			var he = val.height;
var maxScale = val.maxScale;
			var k;
			var sca = "scales = [";
			var str = "data = [";
			for(k=0;k<arr.length;++k){
				var img = arr[k];
				var argb = ImageMat.ARGBFromFloat(img);
				var src = this._stage.getARGBAsImage(argb, wi,he);
				sca = sca + val.scales[k] + " ";
				str = str + data[k] + " ";
				d = new DOImage(src);
				root.addChild(d);
				d.matrix().translate(currentWidth + k*wi, hei + i*he);
			}
			sca = sca +"];\n";
			str = str +"];\n";
			Code.copyToClipboardPrompt(str+"\n"+sca);

			// show harris maxima
			val = descriptor.pointHarrisExtrema(f.x(),f.y());
			img = val.image;
			argb = ImageMat.ARGBFromFloat(img);
			src = this._stage.getARGBAsImage(argb, val.width,val.height);
			d = new DOImage(src);
			root.addChild(d);
			d.matrix().translate(currentWidth+wid-val.width, hei - val.height);

			// show affine-ness

			//descriptor.getStableAffinePoint(f.x(),f.y());
			//console.log("val.maxScale: "+maxScale);
console.log("getStableAffinePoint-------------------------------------------------------------------- 1");
			val = descriptor.getStableAffinePoint( new V3D( f.x(),f.y(),maxScale ) );
			//val = descriptor.getStableAffinePointOLD( new V3D( f.x(),f.y(),maxScale ) );
console.log("getStableAffinePoint-------------------------------------------------------------------- 2");
 			//console.log(val);
// f.transform( val.matrix );
			arr = val.list;
			for(k=0;k<arr.length;++k){
				img = arr[k];
				argb = ImageMat.ARGBFromFloat(img);
				src = this._stage.getARGBAsImage(argb, val.windowWidth,val.windowHeight);
				d = new DOImage(src);
				root.addChild(d);
				d.matrix().translate(currentWidth+k*val.windowWidth, 500+i*val.windowHeight);
			}

		}
		root.addChild(container);
		container.matrix().translate(currentWidth,currentHeight);
		

var dB = descriptor;
var ang = 0;
f.clearPointList();
f.descriptor(dB);
f.findOrientations(dB.redFlat(),dB.greenFlat(),dB.blueFlat(),dB.grayFlat(),dB.width(),dB.height());
f.findDescriptor(dB.redFlat(),dB.greenFlat(),dB.blueFlat(),dB.grayFlat(),dB.width(),dB.height(), ang);
f.findSurface(dB.redFlat(),dB.greenFlat(),dB.blueFlat(),dB.grayFlat(),dB.width(),dB.height(), ang);
var size = 150;
			d = this._showFeature(f,null,descriptor, size);
			d.matrix().translate(j*size+currentWidth,hei);
			root.addChild(d);

currentWidth += wid;
//break;
	}
}

Match.prototype._imageCompleteFxn = function(o){
	var root = this._root;
	var images = new Array();
	var fileNames = new Array();
	this._fileList = Code.copyArray(fileNames,o.files);
	this._imageList = Code.copyArray(images,o.images);
	

var testing = true;
if(testing){
	this.testA();
	//this.filters();
	return
}


var comparing = false;//true;
if(comparing){
	var fileLoader = new FileLoader();
	fileLoader.setLoadList("./descriptors/",["BLT.yaml","BLB.yaml"], this, this._onYAMLCompleteFxn);
	fileLoader.load();
	return;
}
	var imageFileName = fileNames[0];
	var params = this.getDescriptorParameters( images[0] );
	var wid = params.width;
	var hei = params.height;
	var imageSourceRed = params.red;
	var imageSourceGrn = params.grn;
	var imageSourceBlu = params.blu;
	var imageSourceGray = ImageMat.grayFromRGBFloat(imageSourceRed,imageSourceGrn,imageSourceBlu);

var descriptor = new ImageDescriptor( params.width,params.height, params.red,params.grn,params.blu, imageFileName );
	descriptor.processScaleSpace();
	//descriptor.processAffineSpace();
	//descriptor.describeFeatures();

// SAVE TO YAML FILE
// var yaml = new YAML();
// var DATA = Match.YAML;
// yaml.startWrite();
// yaml.writeComment("Match: "+imageFileName);
// yaml.writeObjectStart("descriptor");
// 	descriptor.saveToYAML(yaml);
// yaml.writeObjectEnd();
// var str = yaml.toString();
// var obj = yaml.parse(str);
// var descriptor = new ImageDescriptor();
// descriptor.loadFromYAML(obj[0][DATA.DESCRIPTOR]);
//Code.copyToClipboardPrompt(str);


/*
* comparing features across multiple image-descriptors
*/

	// var features = scene.compareDescriptors(0,1);// descriptor.compareFeatures(); //
	var filters = descriptor.getImageDefinition();
	
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



// affine space is processed

// var affineList = descriptor.getFeatureList();
// for(i=0;i<affineList.length;++i){
// 	//show point
// }

// return;




var ptList = [];//[new V2D(145,221),new V2D(200,200),new V2D(250,250),new V2D(200,100),new V2D(130,130)];
/*for(i=0;i<12;++i){
	for(j=0;j<9;++j){
		ptList.push( new V2D((i+1)*30,(j+1)*30) );
	}
}*/
var scaleSpace = descriptor.getScaleSpaceExtrema();
// for(i=0;i<scaleSpace.length;++i){
// 	ptList.push( scaleSpace[i] );
// }
//ptList.push( scaleSpace[18] );
//ptList.push( scaleSpace[19] );
//ptList.push( scaleSpace[20] ); // circ
//ptList.push( scaleSpace[23] ); // line
//ptList.push( scaleSpace[1] );
//ptList.push( scaleSpace[3] ); //black dot
//ptList.push( scaleSpace[4] ); // nutrition
//ptList.push( scaleSpace[5] ); // corner
//ptList.push( scaleSpace[7] ); // white corner

//ptList.push( scaleSpace[9] );
len = scaleSpace.length;
//len = 100;
for(i=0;i<len;++i){
	ptList.push( scaleSpace[i] );
}

// BLT: 6 8 9 13 22 25 27 28 32 39 FROOTLOOPS:44
// 11 24 50
// SMALL: 90
// LARGE: 80
// UNSTABLE: 70, 21

for(i=0;i<ptList.length;++i){
	var pt = ptList[i];
	// var object = descriptor.getStableAffinePoint(pt);
// var affine = object.matrix;
// var newPoint = object.point;
// var windowPic = object.window;
// var windowHei = object.windowHeight;
// var windowWid = object.windowWidth;
// this.qweasd = 300;
// this.addFloatPic(windowPic,windowWid,windowHei);
// for(var xx=0;xx<object.list.length;++xx){
// 	this.addFloatPic(object.list[xx],windowWid,windowHei);
// }
// this.qweasdY += windowHei;

// //
pt = new V3D(ptList[i].x*wid,ptList[i].y*hei,ptList[i].z);
console.log(pt.x/params.width,pt.y/params.height,pt.z);

var d = new DO();
var rad;
rad = 2.0;
rad *= pt.z;

//main
d.graphics().clear();
d.graphics().setLine(1.0,0xFFFFFF00);
d.graphics().beginPath();
d.graphics().setFill(0x22FF0000);
d.graphics().moveTo(rad,0);
d.graphics().arc(0,0, rad, 0,Math.PI*2, false);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
// dot
rad2 = 1.0;
d.graphics().beginPath();
d.graphics().setFill(0xFF00FF00);
d.graphics().moveTo(rad2,0);
d.graphics().arc(0,0, rad2, 0,Math.PI*2, false);
d.graphics().endPath();
d.graphics().fill();
//
d.matrix().identity();
d.matrix().translate(pt.x,pt.y);

root.addChild(d);

var d = new DO();
d.graphics().clear();
d.graphics().setLine(1.0,0xFFFF0000);
d.graphics().beginPath();
d.graphics().setFill(0x660000FF);
d.graphics().moveTo(rad,0);
d.graphics().arc(0,0, rad, 0,Math.PI*2, false);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
// var aInv = Matrix.inverse(affine);
// var m2D = Matrix2D.matrix2DfromMatrix(aInv);
// d.matrix().copy(m2D);
d.matrix().translate(pt.x,pt.y);
root.addChild(d);



// orientation / direction
// var smmPt = SMM[pt.y*wid + pt.x];
// console.log("-------------------------------------------------------");
// console.log(smmPt);
// var ma = smmPt[0];
// var mb = smmPt[1];
// var mc = smmPt[2];
// var md = smmPt[3];
// var M = (new Matrix(2,2)).setFromArray(smmPt);
// var vAv = Matrix.eigenValuesAndVectors(M);
// var eigValues = vAv.values;
// var eigVectors = vAv.vectors;

// var eigenValueA = eigValues[0];
// var eigenValueB = eigValues[1];
// var eigenVectorA = eigVectors[0]._rows[0];
// var eigenVectorB = eigVectors[1]._rows[0];
// var Q = eigenValueA/eigenValueB;
// console.log(eigenValueA);
// console.log(eigenVectorA);
// console.log(eigenValueB);
// console.log(eigenVectorB);
// console.log(Q);


// // EV A
// d.graphics().setLine(1.0,0xFF00FF00);
// d.graphics().beginPath();
// d.graphics().moveTo(0,0);
// d.graphics().lineTo(rad*eigenVectorA[0],rad*eigenVectorA[1]);
// d.graphics().endPath();
// d.graphics().strokeLine();
// // EV B
// d.graphics().setLine(1.0,0xFF0000FF);
// d.graphics().beginPath();
// d.graphics().moveTo(0,0);
// d.graphics().lineTo(rad*eigenVectorB[0],rad*eigenVectorB[1]);
// d.graphics().endPath();
// d.graphics().strokeLine();





/*
// GET IMAGE AT POINT GAUSSIAN SPACE
pt = ptList[i];
console.log(pt.z);
var w = 100;
var h = 100;
var matrix = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,1]);
// call feature to get image a described point:
var imgFloat = descriptor.getScaleSpacePoint(pt.x,pt.y,pt.z, w,h, matrix);
var imgARGB = ImageMat.ARGBFromFloat(imgFloat);
var imgImage = this._stage.getARGBAsImage(imgARGB, w,h);

doImage = new DOImage(imgImage);
doImage.matrix().translate(400,200);
root.addChild(doImage);
*/

}


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
	var result = ImageMat.extractRect(source, ptA.x,ptA.y,ptB.x,ptB.y,ptC.x,ptC.y,ptD.x,ptD.y, 150,150 );

	img = result;
	argb = ImageMat.ARGBFromFloats(img.red(),img.grn(),img.blu());
	src = this._stage.getARGBAsImage(argb, img.width(), img.height());
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

Match.prototype.addFloatPic = function(windowPic, windowWid, windowHei){
	if(this.qweasd!==undefined){
		this.qweasd += windowWid;
	}else{
		this.qweasd = 0;
	}
	if(this.qweasdY===undefined){
		this.qweasdY = 0;
	}
	var argb = ImageMat.ARGBFromFloats(windowPic,windowPic,windowPic);
	var src = this._stage.getARGBAsImage(argb, windowWid,windowHei);
	var doi = new DOImage( src );
	doi.matrix().identity();
	doi.matrix().scale(1.0);
	doi.matrix().translate(this.qweasd,this.qweasdY);
	//doi.matrix().translate(source.width(),source.height());
	//doi.matrix().translate(source.width()*0.5,source.height()*0.5);
	this._root.addChild(doi);
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
	var rr;
	var max = Math.max(ang._redM,ang._grnM,ang._bluM,ang._gryM);
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
	rr = ang.redMag()/max;
		square.graphics().setLine(1.0,0xFFFF0000);
		square.graphics().beginPath();
		square.graphics().moveTo(0,0);
		square.graphics().lineTo(rad*Math.cos(redA)*rr,rad*Math.sin(redA)*rr);
		square.graphics().endPath();
		square.graphics().strokeLine();
	var redG = ang.grn();
	rr = ang.grnMag()/max;
		square.graphics().setLine(1.0,0xFF00FF00);
		square.graphics().beginPath();
		square.graphics().moveTo(0,0);
		square.graphics().lineTo(rad*Math.cos(redG)*rr,rad*Math.sin(redG)*rr);
		square.graphics().endPath();
		square.graphics().strokeLine();
	var redB = ang.blu();
	rr = ang.bluMag()/max;
		square.graphics().setLine(1.0,0xFF0000FF);
		square.graphics().beginPath();
		square.graphics().moveTo(0,0);
		square.graphics().lineTo(rad*Math.cos(redB)*rr,rad*Math.sin(redB)*rr);
		square.graphics().endPath();
		square.graphics().strokeLine();
	var redY = ang.gry();
	rr = ang.gryMag()/max;
		square.graphics().setLine(1.0,0xFFCCCCCC);
		square.graphics().beginPath();
		square.graphics().moveTo(0,0);
		square.graphics().lineTo(rad*Math.cos(redY)*rr,rad*Math.sin(redY)*rr);
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

Match.prototype.addFloatImageHTML = function(img,wid,hei){
	var argb = ImageMat.ARGBFromFloat(img);
	var src = this._stage.getARGBAsImage(argb, wid,hei);
	Code.setStyleZIndex(src,"999");
	Code.setStylePosition(src,"absolute");
	document.body.appendChild(src);
}

Match.prototype.filters = function(){
	var i, len, j, len2, list, x, y, s;
	var images = this._imageList;
	var files = this._fileList;
	var root = this._root;
	//
	var img = images[0];
	var params = this.getDescriptorParameters( img );
	var wid = params.width;
	var hei = params.height;
	var imageSourceRed = params.red;
	var imageSourceGrn = params.grn;
	var imageSourceBlu = params.blu;
	// original
	var imageSourceGry = ImageMat.grayFromRGBFloat(imageSourceRed,imageSourceGrn,imageSourceBlu);
	// gradient
	var gradX = ImageMat.derivativeX(imageSourceGry, wid,hei);
	var gradY = ImageMat.derivativeY(imageSourceGry, wid,hei);
	// second derivative
	var grad2X = ImageMat.secondDerivativeX(imageSourceGry, wid,hei);
	var grad2Y = ImageMat.secondDerivativeY(imageSourceGry, wid,hei);
	// gradient magnitude
	var gradMag = ImageMat.sqrtFloat( ImageMat.vectorSquaredSumFloat(gradX,gradY) );
	// gradient angle
	var gradAng = ImageMat.phaseFloat(gradX,gradY);
	// gauss
	var gauss1D = ImageMat.getGaussianWindow(7,1, 1.6);
	var gauss = ImageMat.gaussian2DFrom1DFloat(imageSourceGry, wid,hei, gauss1D);
	// laplacian
	var laplacian = ImageMat.laplacian(imageSourceGry, wid,hei);
	// sharpen
	var sharp = ImageMat.addFloat( gauss, ImageMat.scaleFloat(0.25,laplacian) );
	// LoG
	var sig = 1.6;
	var w = h = Math.ceil(1+sig*3)*2+1;
	var log = ImageMat.laplaceOfGaussian(imageSourceGry, wid,hei, sig, w,h);
	// DoG
	// 
	// eigen vectors? direction? magnitude? eigenvalues?
	// 
	// SMM
	var smm = ImageMat.harrisDetectorSMM(imageSourceGry, wid,hei, 1.6);
	//var smm = ImageMat.harrisDetector(imageSourceGry, wid,hei, 1.6);
	var SMM = smm.SMM;
	//var SMM = smm.response;
	var det, tra, a, alpha = 0.5;
	var mat = new Matrix(2,2);
	smm = new Array();
	for(i=0;i<SMM.length;++i){
		a = SMM[i];
		//console.log(SMM[i]);
		//break;
		//  harris measure = det^2(A) - alpha*trace^2(A)
		det = a[0]*a[3] - a[1]*a[2];
		tra = a[0]*a[3];
		//smm[i] = tra;
		//smm[i] = det;
		// smm[i] = (det*det - alpha*tra*tra);
		//var val = Matrix.eigenValuesAndVectors2D(a[0],a[1],a[2],a[3]);
		mat.setFromArray([a[0],a[1],a[2],a[3]]);
		var val = Matrix.eigenValuesAndVectors(mat);

		//smm[i] = val.values[0];
		//smm[i] = val.values[1];
		smm[i] = val.values[0] + val.values[1];
		
		// if(val.values[1]!=0){
		// 	smm[i] = Math.pow(val.values[0]/val.values[1], 0.01);
		// if(val.values[0]!=0){
		// 	smm[i] = Math.pow(val.values[1]/val.values[0], 0.25);
		// }else{
		// 	smm[i] = 0.0;
		// }
		//smm[i] = (isNaN(smm[i])||smm[i]===undefined)?0.0:smm;
		//val.values[1]/val.values[0];
	}
	// scaleSpace @ 1.0 scaling
	console.log("...");
	var sigma = 1.6;
	var sigmaSquare = sigma*sigma;
	var scale = 0.125;
	var newWid = Math.floor(scale*wid);
	var newHei = Math.floor(scale*hei);
	var ssSrc = ImageMat.extractRect(imageSourceGry, 0,0, wid-1,0, wid-1,hei-1, 0,hei-1, newWid,newHei, wid,hei);

	var descriptor = new ImageDescriptor(newWid,newHei, ssSrc,ssSrc,ssSrc, "unknown");
	var val;
	var transform = new Matrix(3,3).identity();
Code.timerStart();
	var ssOne = new Array();
	for(j=0;j<newHei;++j){
		for(i=0;i<newWid;++i){
			val = descriptor.getScaleSpaceInfo(i*1.0/newWid,j*1.0/newHei,1.0, transform);
			ssOne[newWid*j + i] = val.maxScale;//val.max;
			//ssOne[newWid*j + i] = val.max;
		}
		console.log((j+1)*1.0/newHei, Code.timerQuickDifferenceSeconds());
	}
Code.timerStop();
console.log( Code.timerDifferenceSeconds() );
	//var sca = 1.0; var ssSrc = ImageMat.extractRect(imageSourceGry, 0,0, (wid/sca)-1,0, (wid/sca)-1,(hei/sca)-1, 0,(hei/sca)-1, newWid,newHei, wid,hei);
	//var sca = 2.0; var ssSrc = ImageMat.extractRect(imageSourceGry, Math.floor(wid*0.25),Math.floor(hei*0.5), Math.floor(wid*0.75),Math.floor(hei*0.5), Math.floor(wid*0.75),Math.floor(hei*1.0), Math.floor(wid*0.25),Math.floor(hei*1.0), newWid,newHei, wid,hei);
	// var sca = 4.0; var ssSrc = ImageMat.extractRect(imageSourceGry, Math.floor(wid*0.375),Math.floor(hei*0.625), Math.floor(wid*0.625),Math.floor(hei*0.625), Math.floor(wid*0.625),Math.floor(hei*1.0), Math.floor(wid*0.375),Math.floor(hei*1.0), newWid,newHei, wid,hei);
	// var gauss1D = ImageMat.getGaussianWindow(11,1, sigma);
	// var ssSrc = ImageMat.gaussian2DFrom1DFloat(ssSrc, newWid,newHei, gauss1D);
	// var ssG2X = ImageMat.secondDerivativeX(ssSrc, newWid,newHei);
	// var ssG2Y = ImageMat.secondDerivativeY(ssSrc, newWid,newHei);
	// len = ssG2X.length;
	// ssOne = new Array(len);
	// for(i=0;i<len;++i){
	// 	ssOne[i] = sigmaSquare*Math.abs(ssG2X[i]+ssG2Y[i]);
	// 	var locX = i%newWid;
	// 	var locY = Math.floor(i/newWid);
	// 	if(locX<6||locX>(newWid-6)||locY<6||locY>(newHei-6)){
	// 		ssOne[i] = 0.0;
	// 	}
	// }
	// // INVERT:
	// ssOne = ImageMat.normalFloat01(ssOne);
	// ssOne = ImageMat.scaleFloat(-1.0,ssOne);
	ssOne = ImageMat.normalFloat01(ssOne);
	// 
	gradX = ImageMat.normalFloat01(gradX);
	gradY = ImageMat.normalFloat01(gradY);
	grad2X = ImageMat.normalFloat01(grad2X);
	grad2Y = ImageMat.normalFloat01(grad2Y);
	gradMag = ImageMat.normalFloat01(gradMag);
	gradAng = ImageMat.normalFloat01(gradAng);
	laplacian = ImageMat.normalFloat01(laplacian);
	gauss = ImageMat.normalFloat01(gauss);
	sharp = ImageMat.normalFloat01(sharp);
	log = ImageMat.normalFloat01(log);
	smm = ImageMat.normalFloat01(smm);
	ssOne = ImageMat.normalFloat01(ssOne);
	//this.addFloatImageHTML(imageSourceGry, wid,hei);
	//this.addFloatImageHTML(gradX, wid,hei);
	//this.addFloatImageHTML(gradY, wid,hei);
	//this.addFloatImageHTML(grad2X, wid,hei);
	//this.addFloatImageHTML(grad2Y, wid,hei);
	//this.addFloatImageHTML(gradMag, wid,hei);
	//this.addFloatImageHTML(gradAng, wid,hei);
	//this.addFloatImageHTML(laplacian, wid,hei);
	//this.addFloatImageHTML(gauss, wid,hei);
	//this.addFloatImageHTML(sharp, wid,hei);
	//this.addFloatImageHTML(log, wid,hei);
	//this.addFloatImageHTML(smm, wid,hei);
	this.addFloatImageHTML(ssOne, newWid,newHei);
	//d = new DOImage(src);
	//root.addChild(d);
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

/*


	//this.exp();
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
*/