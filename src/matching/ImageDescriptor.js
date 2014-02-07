// ImageDescriptor.js

function ImageDescriptor(wid,hei, origR,origG,origB){
	var i, len, len = wid*hei;
	this._width = wid;
	this._height = hei;
	this._flatRed = origR;
	this._flatGrn = origG;
	this._flatBlu = origB;
	this._flatGry = new Array();
	for(i=0;i<len;++i){
		this._flatGry[i] = (this._flatRed[i]+this._flatGrn[i]+this._flatBlu[i])/3.0;
	}
	//ImageMat.printBadData(this._flatGry);
	this._features = new Array();
	this._dxRed = null;
	this._dyRed = null;
	this._dxGrn = null;
	this._dyGrn = null;
	this._dxBlu = null;
	this._dyBlu = null;
	this._dxGry = null;
	this._dyGry = null;
	this._gradRed = null;
	this._gradGrn = null;
	this._gradBlu = null;
	this._gradGry = null;
	this._sxxGry = null;
	this._sxyGry = null;
	this._syyGry = null;
	this._harrisGry = null;
	this._cornerRed = null;
	this._cornerGrn = null;
	this._cornerBlu = null;
	this._cornerGry = null;
	this._scaleSpaceExtrema = new Array(); //  x=x, y=y, z=sigma, t=value
	//this._extremaList = new Array();
}
ImageDescriptor.prototype.getScaleSpaceExtrema = function(){
	return this._scaleSpaceExtrema;
}
ImageDescriptor.prototype.getImageDefinition = function(){
	var wid = this._width, hei = this._height;
	var arr = new Array();
	arr.push( (new ImageMat(wid,hei)).setFromFloats( ImageMat.getNormalFloat01(this._flatRed),ImageMat.getNormalFloat01(this._flatGrn),ImageMat.getNormalFloat01(this._flatBlu) ) );

	/*
	// dog
	var i, j, w, h, s, len = this._dogList.length;
	len = Math.min(len,4);
	for(i=0;i<len;++i){
		//w = Math.floor(wid*Math.pow(0.5,i));
		//h = Math.floor(hei*Math.pow(0.5,i));
		s = this._dogList[i].length/(wid*hei);
		s = Math.sqrt(s);
		w = Math.round( s*wid ); h = Math.round( s*hei);
// console.log( Math.min.apply(this,this._dogList[i]), Math.max.apply(this,this._dogList[i]) );
// this._dogList[i] = ImageMat.absFloat( this._dogList[i] );
		arr.push( (new ImageMat(w,h)).setFromFloats(
			ImageMat.getNormalFloat01(this._dogList[i]),
			ImageMat.getNormalFloat01(this._dogList[i]),
			ImageMat.getNormalFloat01(this._dogList[i]) ) );
			// this._dogList[i],
			// this._dogList[i],
			// this._dogList[i]));
	}
	*/
	// 
	var extremaBase =  ImageMat.getNormalFloat01(this._flatGry);
	var ar = this._scaleSpaceExtrema;
	console.log(" remaining: "+ar.length);
	for(j=0;j<ar.length;++j){
		ar[j].y = Math.max(Math.min(ar[j].y,hei-1),0);
		ar[j].x = Math.max(Math.min(ar[j].x,wid-1),0);
		extremaBase[ Math.round(ar[j].y*hei)*wid + Math.round(ar[j].x*wid) ] += 1.0;
		//console.log(Math.round(ar[j].y) + " " + Math.round(ar[j].x));
	}
//	arr.push( (new ImageMat(wid,hei)).setFromFloats( ImageMat.getNormalFloat01(extremaBase),ImageMat.getNormalFloat01(extremaBase),ImageMat.getNormalFloat01(extremaBase) ) );
	//arr.push( (new ImageMat(wid,hei)).setFromFloats( ImageMat.getNormalFloat01(this._bestPoints),ImageMat.getNormalFloat01(this._bestPoints),ImageMat.getNormalFloat01(this._bestPoints) ) );
	return arr;
}
ImageDescriptor.prototype.processScaleSpace = function(){ // this generates a list of potential scale-space points: _scaleSpaceExtrema
	var i, j, k, ss, len, len2, pt;
	var wid = this._width, hei = this._height;
	var sigma = 1.6; // 1.6
	var scalesPerOctave = 5; // 5
	var sConstant = scalesPerOctave-3;
	var kConstant = Math.pow(2.0,1/sConstant);
// 9 :=> Math.pow(2.0,1/4) NOT 1/(9-3) = 1/6
	var totalOctaves = 4; // 4
	var startScale = 2.0; // 2.0
	var minThresholdIntensity = 0.03; // 0.03
	var edgeResponseEigenRatioR = 12.0; // 10.0
	edgeResponseEigenRatioR = (edgeResponseEigenRatioR + 1)*(edgeResponseEigenRatioR + 1)/edgeResponseEigenRatioR; // convert to lowe equation // 12.1
	var gaussSizeBase = 5;
	var gaussSizeIncrement = 1.5;
	var gauss1D, gaussSize;
	var dogList = new Array();
	var extremaList = new Array();
	var currentWid = Math.round(startScale*wid), currentHei = Math.round(startScale*hei); //  first double size of image for +sized 
	var nextWid, nextHei;
	var currentImage = ImageMat.extractRect(this._flatGry, 0,0, wid-1,0, wid-1,hei-1, 0,hei-1, currentWid,currentHei, wid,hei);
this._sourceImageMaximum = Code.copyArray(new Array(),currentImage);//currentImage;
this._sourceImageWidth = currentWid;
this._sourceImageHeight = currentHei;
this._sourceImageConstant = kConstant;
this._sourceImageSigma = sigma;
	var nextImage, dog, img, ext, sig, padding, tmp;
	for(i=0;i<totalOctaves;++i){
		console.log( "octave: "+(i+1)+"/"+totalOctaves+" ... size "+currentWid+", "+currentHei+" . . . . . . . . . . . . . . . . . . . . . . . . . . .");
		Code.emptyArray( dogList );
		for(j=0;j<scalesPerOctave-1;++j){
			// calculate gaussian settings 
			sig = sigma*Math.pow(kConstant,j);
			console.log(j, Math.pow(kConstant,j));
			//console.log(sig + "  " + j + "   " + sigma +"    "+Math.pow(kConstant,j));
			//sig = sigma*Math.sqrt( Math.pow(kConstant,(j+1))-Math.pow(kConstant,j) );
			gaussSize = Math.round(gaussSizeBase + j*gaussSizeIncrement)*2+1;
			gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sig);
			// add padding for blur, then remove
			padding = Math.floor(gaussSize/2.0);
			tmp = ImageMat.padFloat(currentImage, currentWid,currentHei, padding,padding,padding,padding);
			tmp = ImageMat.gaussian2DFrom1DFloat(tmp, currentWid+2.0*padding,currentHei+2.0*padding, gauss1D);
			nextImage = ImageMat.unpadFloat(tmp, currentWid+2.0*padding,currentHei+2.0*padding, padding,padding,padding,padding);
			// difference of images
			dog = ImageMat.subFloat(currentImage, nextImage);
			dogList.push(dog);
			currentImage = nextImage;
			if(j==scalesPerOctave-1-2){ ss = nextImage; }
		}
		// find local extrema
		for(j=0;j<dogList.length-2;++j){ // interpolate exact location of extrema and throw away data below threshold
			ext = ImageMat.findExtrema3DFloat(dogList[j],dogList[j+1],dogList[j+2], currentWid,currentHei, 1.0,1.0,1.0, edgeResponseEigenRatioR);
			console.log( "-------------------------" + Math.pow(2,i+((j)/(dogList.length-2))) );
			// console.log( 0.5*( j + (dogList.length-1)*(-1+1)/(dogList.length-2) ) );
			// console.log( 0.5*( j + (dogList.length-1)*(1+1)/(dogList.length-2) ) );
			// console.log( "-------------------------" + Math.pow(2,i+((j)/(dogList.length-2))) );
			// console.log( Math.pow(2,i+(j/(dogList.length-2)) + 0.5*(1-1)/(dogList.length-2) ) );
			// console.log( Math.pow(2,i+(j/(dogList.length-2)) + 0.5*(1+1)/(dogList.length-2) ) );
			//console.log( Math.pow(2,i), Math.pow(2,i+1) );
			for(k=0;k<ext.length;++k){ // set sigma to absolute position based on relative position + iteration IN LINEAR SPACE
				ext[k].a = sigma*Math.pow(2,     (j/(dogList.length-2)) + 0.5*(ext[k].z+1.0)/(dogList.length-2) ); // Math.pow( kConstant, 0.5*(j + (dogList.length-1)*(ext[k].z+1)/(dogList.length-2)) );
				ext[k].z = Math.pow(2, i + (j/(dogList.length-2)) + 0.5*(ext[k].z+1.0)/(dogList.length-2) );
				//ext[k].z = (1 + i*sConstant + j + ext[k].z);
				//ext[k].z = Math.pow(2,ext[k].z);
				//ext[k].t = Math.pow(2,ext[k].z);//Math.pow(kConstant,ext[k].z);
				//ext[k].z = Math.pow(kConstant,ext[k].z);
			}
			extremaList.push(ext);
		}
		// subsample image for next octave
		if(i<totalOctaves-1){
			nextWid = Math.floor(currentWid*0.5); nextHei = Math.floor(currentHei*0.5);
			currentImage = ImageMat.extractRect(ss, 0,0, currentWid-1,0, currentWid-1,currentHei-1, 0,currentHei-1, nextWid,nextHei, currentWid,currentHei);
			currentWid = nextWid; currentHei = nextHei;
		}
	}
	Code.emptyArray(this._scaleSpaceExtrema);
	len = extremaList.length;
	var temp = new Array();
	for(i=0;i<len;++i){
		arr = extremaList[i];
		len2 = arr.length;
		for(j=0;j<len2;++j){
			pt = arr[j];
			// if( Math.abs(pt.t) >= minThresholdIntensity ){
			// 	this._scaleSpaceExtrema.push(pt);
			// }
			pt.t = Math.abs(pt.t);
			temp.push(pt);
		}
		Code.emptyArray(arr);
	}
	//temp.sort(function(a,b){ if(a.t>b.t){return 1;}else if(a.t<b.t){return -1;} return 0; });
	temp.sort(function(a,b){ if(a.t<b.t){return 1;}else if(a.t>b.t){return -1;} return 0; });
	len = Math.min(100,temp.length);
	for(i=0;i<len;++i){
		this._scaleSpaceExtrema.push(temp[i]);
	}
	//this._scaleSpaceExtrema.sort(function(a,b){ if(a.z>b.z){return 1;}else if(a.z<b.z){return -1;} return 0; });
	Code.emptyArray(extremaList);
}
ImageDescriptor.prototype.getScaleSpacePoint = function(x,y,s,u, w,h, matrix){ // return scale-space image with width:w and height:h, centered at x,y, transformed by matrix if present
	//console.log(Math.log(s)/Math.log(2));
	var img = new Array();
	// FIND REMAINDER GAUSSIAN BLUR
	var scale = s;
	var sca = u; //var sca = Math.pow(this._sourceImageConstant,s);
	// while( sca>4.0 ){
	// 	sca /= 4.0;
	// 	scale *= 2.0;
	// }
scale = 1.0;
//scale *= 0.5;
//sca = 1.0;
	var sigma = this._sourceImageSigma*Math.pow(this._sourceImageConstant,sca); // adjust s based on possible scale
	var gaussSize = Math.round(5 + sigma*2)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	var padding = Math.floor(gaussSize/2.0);
	// console.log("s: "+s);
	// console.log("sca: "+sca);
	 console.log("scale: "+scale);
	// console.log("sigma: "+sigma);
	// console.log("padding: "+padding);
	// SCALE IMAGE UP and pad
	//scale = 1/scale;
	var left = (this._sourceImageWidth*x) - (w*0.5)*scale - padding*scale;
	var right = (this._sourceImageWidth*x) + (w*0.5)*scale + padding*scale;
	var top = (this._sourceImageHeight*y) - (h*0.5)*scale - padding*scale;
	var bot = (this._sourceImageHeight*y) + (h*0.5)*scale + padding*scale;
	var O = new V2D(0,0);
	var TL = new V2D(left,top);
	var TR = new V2D(right,top);
	var BR = new V2D(right,bot);
	var BL = new V2D(left,bot);
	if(matrix){
		matrix = matrix.copy();
		var m;
fuuuuuuuuuuuuuu
		m = new Matrix(3,3); m.setFromArray([1,0, -(w*0.5)*scale, 0,1, -(h*0.5)*scale, 0,0,1]);
		//matrix = Matrix.mult(matrix,m);
		matrix = Matrix.mult(m,matrix);
		m = new Matrix(3,3); m.setFromArray([1,0, (w*0.5)*scale, 0,1, (h*0.5)*scale, 0,0,1]);
		matrix = Matrix.mult(m,matrix);
		//matrix = Matrix.mult(matrix,m);

		matrix.multV2DtoV2D(TL,TL);
		matrix.multV2DtoV2D(TR,TR);
		matrix.multV2DtoV2D(BR,BR);
		matrix.multV2DtoV2D(BL,BL);

		
	}
	// EXTRACT AROUND SOURCE POINT
	var wid = w+2*padding;
	var hei = h+2*padding;
	img = ImageMat.extractRect(this._sourceImageMaximum, TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y, wid,hei, this._sourceImageWidth,this._sourceImageHeight);
	// BLUR IMAGE
	//img = ImageMat.gaussian2DFrom1DFloat(img, wid,hei, gauss1D);
	// DE-PAD IMAGE
	img = ImageMat.unpadFloat(img, wid,hei, padding,padding,padding,padding);
	return img;
}
ImageDescriptor.prototype.getStableAffinePoint = function(inPoint){ // 
	var transform = new Matrix(3,3); transform.identity();
	var outPoint = new V4D(); outPoint.copy(inPoint);
	var countMax = 10;
	//
	var i, xNext, xPrev, xWin, lambdaMax, lambdaMin, epsilon = 1E-6;
	var sigmaI, sigmaD, mu;
	var windowWid = 25; windowHei = 25;
	var U = new Matrix(3,3); U.identity();
	for(i=countMax; i--; ){
		console.log("i: "+i);
		lambdaMax = 1.0;
		lambdaMin = 1.0;

		//this.getScaleSpacePoint(pt.x,pt.y,pt.z,pt.a, windowWid, windowHei, matrix);
		
		if(false){ // (1-lambdaMin/lambdaMax) < epsilon
			console.log("reached criteria");
			break;
		}
	}
	// 
	//transform.copy(U);
	var output = {matrix:transform, point:outPoint};
	return output;
}
ImageDescriptor.prototype.processAffineSpace = function(){
	// this finds the most affine-invariant transformation to compare the points
	var i, j, k, len, len2, pt;
	var startPoints = this._scaleSpaceExtrema;
	len = startPoints.length;
	for(k=0;k<len;++k){
		pt = startPoints[k]; // initial interest point
		/*
		DETECTION ALGORITHM
		* initial interest point x0 (via multi-scale Harris detector)
		1) U(0) = I
		2) normalize window W(x(w)) = I(X) centered on U(k-1)*x(w) = x(k-1)
		3) select integration scale oi at x(w)(k-1)
		4) select differentiation scale od = s*si that maximizes min(eig)/max(eig) ; s in [0.5,0.75] ; u = u(x(w)(k-1),oi,od)
		5) detect spatial localization x(w)(k) of a maximum of harris measure nearest to x(w)(k-1)
			and compute location of interest point x(k)
		6) compute ui(k) = u^-(1/2) (x(w)(k),oi,od)
		7) concatenate transformation U(k) = u(i)(k) * U(k-1)
			and normalize U(k) to max(eig)(U(k)) = 1
		8) goto (2) if 1 - min(eig)(u(i)(k))/max(eig)(u(i)(k)) >= epsilon
		*/
	}
}
ImageDescriptor.prototype.describeFeatures = function(){
	// this uses the scale-space and affine-transformation to pin-point the features in space
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
	// the features are now fully defined on a point-by-point basis
}
ImageDescriptor.prototype.compareFeatures = function(){
	// this finds best-matching lists for each featuring
}
















ImageDescriptor.prototype.processFilters = function(){ //////////////////////////// these should be done on a point-basis
	var i, j, index, wid = this._width, hei = this._height;
	this._dxRed = ImageMat.convolve(this._flatRed,wid,hei, [-0.5,0,0.5], 3,1);
	this._dyRed = ImageMat.convolve(this._flatRed,wid,hei, [-0.5,0,0.5], 1,3);
	this._dxGrn = ImageMat.convolve(this._flatGrn,wid,hei, [-0.5,0,0.5], 3,1);
	this._dyGrn = ImageMat.convolve(this._flatGrn,wid,hei, [-0.5,0,0.5], 1,3);
	this._dxBlu = ImageMat.convolve(this._flatBlu,wid,hei, [-0.5,0,0.5], 3,1);
	this._dyBlu = ImageMat.convolve(this._flatBlu,wid,hei, [-0.5,0,0.5], 1,3);
	this._dxGry = ImageMat.convolve(this._flatGry,wid,hei, [-0.5,0,0.5], 3,1);
	this._dyGry = ImageMat.convolve(this._flatGry,wid,hei, [-0.5,0,0.5], 1,3);
	// gradient magnitudes
	this._gradRed = ImageMat.vectorSumFloat(this._dxRed,this._dyRed);
	this._gradGrn = ImageMat.vectorSumFloat(this._dxGrn,this._dyGrn);
	this._gradBlu = ImageMat.vectorSumFloat(this._dxBlu,this._dyBlu);
	this._gradGry = ImageMat.vectorSumFloat(this._dxGry,this._dyGry);
	//var dxWinGry = ImageMat.convolve(gry,wid,hei, [-3,0,3, -10,0,10, -3,0,3], 3,3);
	//var dyWinGry = ImageMat.convolve(gry,wid,hei, [-3,-10,-3, 0,0,0, 3,10,3], 3,3);
	// phase/angles
	this._phaseRed = ImageMat.phaseFloat(this._dxRed,this._dyRed);
	this._phaseGrn = ImageMat.phaseFloat(this._dxGrn,this._dyGrn);
	this._phaseBlu = ImageMat.phaseFloat(this._dxBlu,this._dyBlu);
	this._phaseGry = ImageMat.phaseFloat(this._dxGry,this._dyGry);
	// second moments
	this._dxxGry = ImageMat.mulFloat( this._dxGry, this._dxGry );
	this._dxyGry = ImageMat.mulFloat( this._dxGry, this._dyGry );
	this._dyyGry = ImageMat.mulFloat( this._dyGry, this._dyGry );
	// ?
	var gaussWid = 3, gaussHei = 3;
	var gaussian = ImageMat.getGaussianWindow(gaussWid,gaussHei, 1.0);
	this._sxxGry = ImageMat.convolve(this._dxxGry, wid,hei, gaussian,gaussWid,gaussHei);
	this._sxyGry = ImageMat.convolve(this._dxyGry, wid,hei, gaussian,gaussWid,gaussHei);
	this._syyGry = ImageMat.convolve(this._dyyGry, wid,hei, gaussian,gaussWid,gaussHei);
	// harris
	this._harrisGry = new Array(wid*hei);
	var sxx = this._sxxGry, sxy = this._sxyGry, syy = this._syyGry;
	var harris = this._harrisGry;
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i){
			index = j*wid + i;
			harris[index] = sxx[index]*syy[index] - sxy[index]*sxy[index];
		}
	}
	// corners
	var cornerThreshold = 0.55;
	var cornerMat = [0.25,-0.5,0.25, -0.5,1,-0.5, 0.25,-0.5,0.25];
	this._cornerRed = ImageMat.convolve(this._flatRed, wid,hei, cornerMat, 3,3);
	this._cornerGrn = ImageMat.convolve(this._flatGrn, wid,hei, cornerMat, 3,3);
	this._cornerBlu = ImageMat.convolve(this._flatBlu, wid,hei, cornerMat, 3,3);
	this._cornerGry = ImageMat.convolve(this._flatGry, wid,hei, cornerMat, 3,3);
}
ImageDescriptor.prototype.findFeatures = function(){
	var i, j, wid = this._width, hei = this._height;
	// best matchings
	var cornerGry = Code.copyArray(new Array(), this._cornerGry);
		ImageMat.normalFloat01(cornerGry);
		ImageMat.applyFxnFloat(cornerGry, ImageMat.flipAbsFxn);
		ImageMat.normalFloat01(cornerGry);
	var absGry = ImageMat.absFloat(this._gradGry);
		ImageMat.normalFloat01(absGry);
	var addAbsFloatGry = ImageMat.addFloat(absGry,absGry);
		ImageMat.normalFloat01(addAbsFloatGry);

	// create best matching image
	var bestThreshold = 0.10;
	var bestGry = Code.copyArray(new Array(), cornerGry);//ImageMat.newZeroFloat(wid,hei);
	bestGry = ImageMat.mulFloat(bestGry,cornerGry);
		ImageMat.normalFloat01(bestGry);
	bestGry = ImageMat.mulFloat(bestGry,addAbsFloatGry);
		ImageMat.normalFloat01(bestGry);
	bestGry = ImageMat.gtFloat(bestGry, bestThreshold);
	// find blobs
	var blobGry = bestGry;
	// blobGry = ImageMat.expandBlob(blobGry, wid,hei);
	// blobGry = ImageMat.retractBlob(blobGry, wid,hei);
	//imageBlobGry.setFromFloats(blobGry, blobGry, blobGry);
	// find centers
	var blobListGry = ImageMat.findBlobsCOM(blobGry, wid,hei);
this._bestPoints = ImageMat.newZeroFloat(wid,hei);
	console.log("FOUND: "+blobListGry.length+" FEATURE POINTS");
	// get features from blob points
	var feature, blob;
	var featureList = new Array();
	for(i=0;i<blobListGry.length;++i){
		blob = blobListGry[i];
		feature = new ImageFeature(this, blob.x,blob.y, blob.count, 1.0,1.0);
		featureList.push(feature);
		this._bestPoints[wid*blob.y+blob.x] = 1.0;
	}
	this._features = featureList;
}

ImageDescriptor.prototype.descriptorFromImage = function(sourceImage){

 
}



// -----------------------------
