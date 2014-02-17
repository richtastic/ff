// ImageDescriptor.js

function ImageDescriptor(wid,hei, origR,origG,origB, filename){
	var i, len, len = wid*hei;
	// stored data
	this._filename = filename;
	this._features = new Array();
	//
	this._width = wid;
	this._height = hei;
	this._flatRed = origR;
	this._flatGrn = origG;
	this._flatBlu = origB;
	this._flatGry = new Array();
	for(i=0;i<len;++i){
		this._flatGry[i] = (this._flatRed[i]+this._flatGrn[i]+this._flatBlu[i])/3.0;
	}
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

ImageDescriptor.prototype.saveToYAML = function(yaml){
	console.log("SAVE TO YAML..");
	console.log(yaml);
}
ImageDescriptor.prototype.loadFromYAML = function(yaml){
	console.log("LOAD FROM YAML..");
	console.log(yaml);
}

ImageDescriptor.prototype.getFeatureList = function(){
	return this._features;
}
ImageDescriptor.prototype.getScaleSpaceExtrema = function(){
	return this._scaleSpaceExtrema;
}
ImageDescriptor.prototype.getImageDefinition = function(){ // LEGACY
	var wid = this._width, hei = this._height;
	var arr = new Array();
	arr.push( (new ImageMat(wid,hei)).setFromFloats( ImageMat.getNormalFloat01(this._flatRed),ImageMat.getNormalFloat01(this._flatGrn),ImageMat.getNormalFloat01(this._flatBlu) ) );
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
			//console.log(i + "  " + j + "   " + sigma +"    "+Math.pow(kConstant,j)+"   "+sig);
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
//			console.log( "-------------------------" + Math.pow(2,i+((j)/(dogList.length-2))) );
			// console.log( 0.5*( j + (dogList.length-1)*(-1+1)/(dogList.length-2) ) );
			// console.log( 0.5*( j + (dogList.length-1)*(1+1)/(dogList.length-2) ) );
			// console.log( "-------------------------" + Math.pow(2,i+((j)/(dogList.length-2))) );
			// console.log( Math.pow(2,i+(j/(dogList.length-2)) + 0.5*(1-1)/(dogList.length-2) ) );
			// console.log( Math.pow(2,i+(j/(dogList.length-2)) + 0.5*(1+1)/(dogList.length-2) ) );
			//console.log( Math.pow(2,i), Math.pow(2,i+1) );
// var cScale = Math.pow(2, i + (j/(dogList.length-2)) + 0.5*(-1.0000+1.0)/(dogList.length-2) );
// var cExponent = Math.log(cScale)/Math.log(2);
// var cSigma = sigma*Math.pow(kConstant,(cExponent*2)%2);
// console.log( cScale, cExponent, cSigma );
			for(k=0;k<ext.length;++k){ // set sigma to absolute position based on relative position + iteration IN LINEAR SPACE
				//ext[k].a = sigma*Math.pow(2,     (j/(dogList.length-2)) + 0.5*(ext[k].z+1.0)/(dogList.length-2) );
				ext[k].z = Math.pow(2, i + (j/(dogList.length-2)) + 0.5*(ext[k].z+1.0)/(dogList.length-2) );
// var cScale = ext[k].z;
// var cExponent = Math.log(cScale)/Math.log(2);
// var cSigma = sigma*Math.pow(kConstant,(cExponent*2)%2);
// console.log(ext[k].a, cSigma);
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
	// ALSO COPY REMAINING POINTS THAT FIT CRITERIA
	len = temp.length;
	for(;i<len;++i){
		if( Math.abs(temp[i].t) >= minThresholdIntensity ){
			this._scaleSpaceExtrema.push(temp[i]);
		}else{
			break;
		}
	}
	//this._scaleSpaceExtrema.sort(function(a,b){ if(a.z>b.z){return 1;}else if(a.z<b.z){return -1;} return 0; });
	Code.emptyArray(extremaList);
}
ImageDescriptor.prototype.sigmaFromScale = function(cScale){
	var cExponent = Math.log(cScale)/Math.log(2);
	var cSigma = this._sourceImageSigma*Math.pow(this._sourceImageConstant,(cExponent*2)%2);
	return cSigma;
}

ImageDescriptor.prototype.getScaleSpacePoint = function(x,y,s,u, w,h, matrix){ // return scale-space image with width:w and height:h, centered at x,y, transformed by matrix if present
	return ImageMat.extractRectFromFloatImage(x,y,s,u, w,h, this._flatGry,this._width,this._height, matrix);
	//return ImageMat.extractRectFromFloatImage(x,y,s,u, w,h, this._sourceImageMaximum,this._sourceImageWidth,this._sourceImageHeight, matrix);
}










ImageDescriptor.prototype.harrisMatrix = function(img,wid,hei, sigmaI,sigmaD){
	var ptLx, ptLy, u00, u01, u10, u11, det, tra, alpha, harris;
	var i, j, len, gaussSize, gauss1D, padding=0;
	// blurr with sigmaD
	imgPad = img;
//imgPad = ImageMat.mulConst(imgPad,1000);
	if(sigmaD!==undefined){
		gaussSize = Math.round(5 + sigmaD*2)*2+1;
		gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigmaD);
		padding = Math.floor(gaussSize/2.0);
		imgPad = ImageMat.padFloat(imgPad, wid,hei, padding,padding,padding,padding);
	}
	widPad = wid+padding*2;
	heiPad = hei+padding*2;
	if(sigmaD!==undefined){
		imgPad = ImageMat.gaussian2DFrom1DFloat(imgPad, widPad,heiPad, gauss1D);
	}
	// take derivatives
	var Lx = ImageMat.derivativeX(imgPad,widPad,heiPad);
	var Ly = ImageMat.derivativeY(imgPad,widPad,heiPad);
	// blurr with sigmaI
	LxPad = Lx; LyPad = Ly;
	if(sigmaI!==undefined){
		gaussSize = Math.round(5 + sigmaI*2)*2+1;
		gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigmaI);
		if(padding<=0){ // not already padded
			padding = Math.floor(gaussSize/2.0);
			LxPad = ImageMat.padFloat(Lx, widPad,heiPad, padding,padding,padding,padding);
			LyPad = ImageMat.padFloat(Ly, widPad,heiPad, padding,padding,padding,padding);
			widPad = wid+padding*2;
			heiPad = hei+padding*2;
		}
		LxPad = ImageMat.gaussian2DFrom1DFloat(LxPad, widPad,heiPad, gauss1D);
		LyPad = ImageMat.gaussian2DFrom1DFloat(LyPad, widPad,heiPad, gauss1D);
	}
	// original size
	if(padding>0){
		Lx = ImageMat.unpadFloat(LxPad, widPad,heiPad, padding,padding,padding,padding);
		Ly = ImageMat.unpadFloat(LyPad, widPad,heiPad, padding,padding,padding,padding);
	}else{
		Lx = LxPad;
		Ly = LyPad;
	}
	// harris matrix & measure
	len = wid*hei;
	u = new Array(len);
	harris = new Array(len);
var e,e1,e2;
eigMin = new Array(len);
eigMax = new Array(len);
var sD = (sigmaD===undefined)?1:sigmaD;
//sD *= 100000;
sD = sD*sD;
	alpha = 0.01;
	for(i=0;i<len;++i){
		ptLx = Lx[i]; ptLy = Ly[i];
		u00 = ptLx*ptLx;
		u01 = ptLx*ptLy;
		u10 = ptLx*ptLy;
		u11 = ptLy*ptLy;
		det = u00*u11 - u01*u10;
		tra = u00+u11;
		u[i] = [sD*u00,sD*u01,sD*u10,sD*u11];
e = Matrix.eigenValuesAndVectors2D( u00, u01, u10, u11 );
e1 = Math.abs(e.values[0]);
e2 = Math.abs(e.values[1]);
eigMax[i] = Math.max(e1,e2);
eigMin[i] = Math.min(e1,e2);
		harris[i] = Math.abs(det-alpha*tra*tra);
	}
	return {matrix:u, harris:harris, e:eigMax, f:eigMin, b:Lx, c:Ly};
}
ImageDescriptor.prototype.getStableAffinePoint = function(inPoint){ // 15|.25|1.6  25|0.1|4.0
	var unstableMax = 25.0;
	var inScale = inPoint.z;
	var inSigma = this.sigmaFromScale(inScale);
	var currentWid = 15, currentHei = 15;
	var currentScale = 0.125*( inScale );
	var currentSigma = 1.6;
	var currentImage;
	var originalMinimum = null;
	var i, SMM, smm, ang, amt;
	var eig, lA, lB, temp, eA, eB;
	var eigRatio, convergeMin = 1E-6;
	var bestIteration = -1, bestRatio = 666;
	var bestTransform = new Matrix(3,3);
	// var wid = this._sourceImageWidth, hei = this._sourceImageHeight;
	// var gray = this._sourceImageMaximum;
	var wid = this._width, hei = this._height;
	var gray = this._flatGry;
	var mat = new Matrix(2,2), rot = new Matrix(3,3), sca = new Matrix(3,3), cum = new Matrix(3,3);
	var transform = new Matrix(3,3); transform.identity();
	var scaledTotal = 1.0;
var list = new Array();
	for(i=0;i<10;++i){
		currentImage = ImageMat.extractRectFromFloatImage(inPoint.x,inPoint.y,currentScale,null, currentWid,currentHei, gray,wid,hei, transform);
list.push(currentImage);
		SMM = ImageMat.harrisDetectorSMM(currentImage,currentWid,currentHei, currentSigma);
		var centerX = Math.floor(currentWid*0.5), centerY = Math.floor(currentHei*0.5);
		var centerIndex = currentWid*centerY+centerX;
		smm = SMM[centerIndex];
		// get eigen values/vectors
		mat.setFromArray(smm);
		eig = Matrix.eigenValuesAndVectors(mat);
		lA = Math.max(eig.values[0],eig.values[1]);
		lB = Math.min(eig.values[0],eig.values[1]);
		if(lA>lB){
			eigRatio = lA/lB;
			eA = [eig.vectors[0].get(0,0), eig.vectors[0].get(1,0)];
			eB = [eig.vectors[1].get(0,0), eig.vectors[1].get(1,0)];
		}else{
			temp = lA; lA = lB; lB = temp;
			eigRatio = lA/lB;
			eA = [eig.vectors[0].get(0,0), eig.vectors[0].get(1,0)];
			eB = [eig.vectors[1].get(0,0), eig.vectors[1].get(1,0)];
		}
		//console.log("eigenValue ratio: "+eigRatio+"      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< "+i);
		// check stability
		if(eigRatio>unstableMax){
			return null;
		}
		// form useful vectors
		var eigVecA = new V2D(eA[0],eA[1]);
		var eigVecB = new V2D(eA[0],eB[1]);
		var vectorX = new V2D(1,0), vectorY = new V2D(0,1);
		var angleYVecA = V2D.angleDirection(vectorY,eigVecA);
		var angleYVecB = V2D.angleDirection(vectorY,eigVecB);
		// first record of direction of minima
		if(originalMinimum==null){
			originalMinimum = new V2D(eigVecA.x,eigVecA.y);
		}
		// keep best transform
		if(eigRatio<bestRatio){
			bestIteration = i
			bestRatio = eigRatio;
			bestTransform.copy(transform);
		}
		// convergence criteria
		if( (eigRatio-1.0)<convergeMin ){
			break;
		}
		// non-proportional scaling
		cum.identity();
		ang = -angleYVecA;
		rot.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1.0]);
		cum = Matrix.mult(cum,rot);
		amt = Math.pow(eigRatio,0.25);
		sca.setFromArray([1/amt,0,0, 0,1.0,0, 0,0,1.0]);
scaledTotal*=amt;
		cum = Matrix.mult(cum,sca);
		ang = angleYVecA;
		rot.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1.0]);
		cum = Matrix.mult(cum,rot);
		transform = Matrix.mult(transform,cum);
		// recheck on scale
		var t = new V2D();
		transform.multV2DtoV2D(t,originalMinimum);
		var correctScale = t.length();
scaledTotal*=correctScale;
		correctScale = 1/correctScale;
		sca.setFromArray([correctScale,0,0, 0,correctScale,0, 0,0,1]);
		transform = Matrix.mult(sca,transform);
		// check stability 2
		if(scaledTotal>unstableMax){
			return null;
		}
	}
	var W0 = ImageMat.extractRectFromFloatImage(inPoint.x,inPoint.y,currentScale*4.0,null, currentWid,currentHei, gray,wid,hei, transform);
	return {matrix:transform, window:W0, windowWidth:currentWid, windowHeight:currentHei, list:list};
}
ImageDescriptor.prototype.getStableAffinePointOLD = function(inPoint){ // 
	var countMax = 10;
	var transform = new Matrix(3,3); transform.identity();
	var i, xWin, vals, ratio, lambdaMax, lambdaMin, epsilon = 1E-6;
	var scale, sigma, sigmaI, sigmaD, u, W;
	var windowWid = 75; windowHei = 75;
	var centerX = Math.floor(windowWid*0.5), centerY = Math.floor(windowHei*0.5);
	var harris;
	var U = new Matrix(2,2); U.identity();
	var u = new Matrix(2,2); u.identity();
	var xNext = new V4D(), xPrev = new V4D();
	xPrev.copy(inPoint);


var vectorX = new V2D(1,0), vectorY = new V2D(0,1);
var com=new Matrix(3,3), rot=new Matrix(3,3), sca=new Matrix(3,3);
var mat=new Matrix(2,2);
var Ix, Iy, SMM, W0, W1, ang, s, eig, l0, l1, e0, e1;
var list = new Array(), IxList = new Array(), IyList = new Array(), smmList = new Array();
var thisScale = 1.25;
var prevTransform = transform;
var prevRatio = null;
var originalMinimum=null;
for(i=0;i<countMax;++i){
// SHOULD ALSO TRY TO LOCALIZE THE POINT INSIDE THE BLOB - AT SOME LOCAL MAXIMA/MINIMA OF BLOBNESS ... SCALE SPACE AGAIN?
// APPARENTLY ALSO NEED TO CHECK IF TRANSFORMATION IS OUTRAGOUS
	var centerIndex = windowWid*centerY+centerX;
	scale = xPrev.z; scale *= 0.5;
	sigma = this.sigmaFromScale(scale);	
	//console.log("scale: "+scale+"  sigma: "+sigma);
	// 2. normalize window
	W0 = this.getScaleSpacePoint(xPrev.x,xPrev.y,scale,sigma, windowWid, windowHei, transform);
	list.push(W0);
	// 3. select integration scale
	sigmaI = sigma;
	// 4. select differentation scale
	sigmaD = 0.7*sigmaI;
	var gauss1D = ImageMat.getGaussianWindow(15,1, 1.6*2);//sigma);
	// ...
	W1 = ImageMat.gaussian2DFrom1DFloat(W0, windowWid,windowHei, gauss1D);
W1 = W0;
	list.push(W1);
	Ix = ImageMat.derivativeX(W1, windowWid,windowHei);
	Iy = ImageMat.derivativeY(W1, windowWid,windowHei);
	IxList.push(Ix);
	IyList.push(Iy);
	IxIx = ImageMat.mulFloat(Ix,Ix);
	IxIy = ImageMat.mulFloat(Ix,Iy);
	IyIy = ImageMat.mulFloat(Iy,Iy);
	Imag = ImageMat.sqrtFloat( ImageMat.addFloat(IxIx,IyIy) );
	Sxx = ImageMat.gaussian2DFrom1DFloat(IxIx, windowWid,windowHei, gauss1D);
	Sxy = ImageMat.gaussian2DFrom1DFloat(IxIy, windowWid,windowHei, gauss1D);
	Syy = ImageMat.gaussian2DFrom1DFloat(IyIy, windowWid,windowHei, gauss1D);
	SMM = new Array();
	len = Ix.length;
	for(k=0;k<len;++k){
		if(i%2==0){
			s = 11600.0;
		}else{
			s = 40000.0;
		}
		SMM[k] = [ s*Sxx[k], s*Sxy[k], s*Sxy[k], s*Syy[k] ];
		mat.setFromArray(SMM[k]);
		eig = Matrix.eigenValuesAndVectors(mat);
		if(eig.values[0]>eig.values[1]){
			SMM[k].push(eig.values[0]);
			SMM[k].push(eig.values[1]);
			SMM[k].push([eig.vectors[0].get(0,0),eig.vectors[0].get(1,0)]);
			SMM[k].push([eig.vectors[1].get(0,0),eig.vectors[1].get(1,0)]);
		}else{
			SMM[k].push(eig.values[1]);
			SMM[k].push(eig.values[0]);
			SMM[k].push([eig.vectors[1].get(0,0),eig.vectors[1].get(1,0)]);
			SMM[k].push([eig.vectors[0].get(0,0),eig.vectors[0].get(1,0)]);
		}
	}
	smmList.push(SMM);
	var grad = new V2D(Ix[centerIndex],Iy[centerIndex]);
	grad.norm();
	var angleYGrad = V2D.angleDirection(vectorY,grad);
	//console.log("grad: "+grad.toString()+"  grad-to-y: "+angleYGrad*180/Math.PI);
	l0 = SMM[centerIndex][4];
	l1 = SMM[centerIndex][5];
	e0 = SMM[centerIndex][6];
	e1 = SMM[centerIndex][7];
	var eigVecA = new V2D(e0[0],e0[1]);
	var eigVecB = new V2D(e1[0],e1[1]);
	var angleYVecA = V2D.angleDirection(vectorY,eigVecA);
	var angleYVecB = V2D.angleDirection(vectorY,eigVecB);
	var eigRatio = l0/l1;
	console.log(" ratio: "+eigRatio+"    -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- "+ i);//+"  A: "+eigVecA.toString()+"  B:"+eigVecB.toString());

var eigenMinimaDim = 10;
if(originalMinimum==null){
	originalMinimum = new V2D(eigVecA.x*eigenMinimaDim,eigVecA.y*eigenMinimaDim);
}
	// 4. - cont
	// u.setFromArray([SMM[centerIndex][0],SMM[centerIndex][1],SMM[centerIndex][2],SMM[centerIndex][3]]);
	// 5. spatial localization
		// ?
	// 6. compute u^-1/2
	// u = Matrix.power(u,-0.5);
	// 7. concatenate transform
	// U = Matrix.mult(U,u);
	//U = Matrix.mult(u,U);
	// 7. - cont normalize lambda_max = 1
	// var svd = Matrix.SVD(U);
	// 	lambdaMax = Math.max(svd.S.get(0,0),svd.S.get(1,1));
	// 	lambdaMin = Math.min(svd.S.get(0,0),svd.S.get(1,1));
	// 		if(lambdaMax==svd.S.get(0,0)){
	// 			svd.S.set(0,0, 1.0);
	// 		}else{
	// 			svd.S.set(1,1, 1.0);
	// 		}
	// 		// svd.S.set(0,0, svd.S.get(0,0)/lambdaMax);
	// 		// svd.S.set(1,1, svd.S.get(1,1)/lambdaMax);
	// 		U = Matrix.fromSVD(svd.U,svd.S,svd.V);
/*
	transform.set(0,0, U.get(0,0));
	transform.set(0,1, U.get(0,1));
	transform.set(1,0, U.get(1,0));
	transform.set(1,1, U.get(1,1));
*/

/*
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
*/

	com.identity();
	s = Math.pow(eigRatio,0.25);
	ang = angleYGrad;
	rot.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1.0]);
	com = Matrix.mult(com,rot);
	sca.setFromArray([1.0/s,0,0, 0,1.0,0, 0,0,1.0]);
	com = Matrix.mult(com,sca);
	ang = -ang;
	rot.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1.0]);
	com = Matrix.mult(com,rot);
	transform = Matrix.mult(transform,com);

	// recheck on scale
	var t = new V2D();
	transform.multV2DtoV2D(t,originalMinimum);
	var correctScale = ( (t.length()/eigenMinimaDim) );
	correctScale = 1/correctScale;
	sca.setFromArray([correctScale,0,0, 0,correctScale,0, 0,0,1]);
	transform = Matrix.mult(sca,transform);
	

prevTransform = transform;

	// 
	// W2 = this.getScaleSpacePoint(xPrev.x,xPrev.y,scale,sigma, windowWid, windowHei, prevTransform);
	// list.push(W2);
// Ix = ImageMat.derivativeX(W2, windowWid,windowHei);
// Iy = ImageMat.derivativeY(W2, windowWid,windowHei);
// IxList.push(Ix);
// IyList.push(Iy);
	// W = this.getScaleSpacePoint(xPrev.x,xPrev.y,scale,sigma, windowWid, windowHei, transform);
// Imag = ImageMat.normalFloat01(Imag);
// list.push(Imag);
// Ix = ImageMat.derivativeX(Imag, windowWid,windowHei);
// Iy = ImageMat.derivativeY(Imag, windowWid,windowHei);
// Ix = ImageMat.normalFloat01(Ix);
// Iy = ImageMat.normalFloat01(Iy);
// list.push(Ix);
// list.push(Iy);
// IxIx = ImageMat.mulFloat(Ix,Ix);
// IxIy = ImageMat.mulFloat(Ix,Iy);
// IyIy = ImageMat.mulFloat(Iy,Iy);
// Imag = ImageMat.sqrtFloat( ImageMat.addFloat(IxIx,IyIy) );
// Imag = ImageMat.normalFloat01(Imag);
// list.push(Imag);
}
transform = prevTransform;
W0 = this.getScaleSpacePoint(xPrev.x,xPrev.y,scale,sigma, windowWid, windowHei, transform);
return {matrix:transform, window:W0, windowWidth:windowWid, windowHeight:windowHei, list:list, Ix:IxList, Iy:IyList, smmList:smmList}



// var list = new Array();
// for(i=0;i<10;++i){
// console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- "+ i);
// 		scale = xPrev.z;
// scale *= 0.5;
// 		sigma = this.sigmaFromScale(scale);
// 		//console.log(xPrev.x,xPrev.y,scale,sigma);
// 		W = this.getScaleSpacePoint(xPrev.x,xPrev.y,scale,sigma, windowWid, windowHei, transform);
// list.push(W);
// 		var gauss1D = ImageMat.getGaussianWindow(10,1, 1.6);
// 		//W = ImageMat.gaussian2DFrom1DFloat(W, windowWid,windowHei, gauss1D);
// 		var SMM = new Array();
// 		var response = ImageMat.harrisDetector(W,windowWid,windowHei, SMM);
// 		var mat = new Matrix(2,2).setFromArray( SMM[windowWid*centerY+centerX] );
// var Lx = response.Lx[windowWid*centerY+centerX];
// var Ly = response.Ly[windowWid*centerY+centerX];
// // mat = new Matrix(2,2).setFromArray( [Lx,0, 0,Ly] );
// 		//console.log(mat.toString());
// 		var obj = Matrix.eigenValuesAndVectors(mat);
// 		var val = obj.values;
// 		var vecs = obj.vectors;
// 		var eigValueA = Math.max(val[0],val[1]);
// 		var eigValueB = Math.min(val[0],val[1]);
// 		var eigRatio = eigValueA/eigValueB;
// 		var eigVectorA, eigVectorB;
// 		if(eigValueA==val[0]){
// 			eigVectorA = vecs[0];
// 			eigVectorB = vecs[1];
// 		}else{
// 			eigVectorA = vecs[1];
// 			eigVectorB = vecs[0];
// 		}
// console.log( Matrix.eigenValuesAndVectors2D(mat.get(0,0),mat.get(0,1),mat.get(1,0),mat.get(1,1)) );
// 		// console.log(eigVectorA.toString());
// 		// console.log(eigVectorB.toString());
// 		var eigV2DA = new V2D(eigVectorA.get(0,0),eigVectorA.get(1,0));
// 		var eigV2DB = new V2D(eigVectorB.get(0,0),eigVectorB.get(1,0));
// 		var vectorX = new V2D(1,0);
// 		var vectorY = new V2D(0,1);
// 		console.log( eigRatio );
// 		var vectorGrad = new V2D(Lx,Ly);
// 		vectorGrad.norm();
// 		// console.log( eigValueA );
// 		// console.log( eigVectorA.toString() );
// 		// console.log( eigValueB );
// 		// console.log( eigVectorB.toString() );
// 		console.log( vectorGrad.toString() )
// 		var angleXA = V2D.angleDirection(vectorX,eigV2DA);
// 		var angleYA = V2D.angleDirection(vectorY,eigV2DA);
// 		//console.log(angleXA*180/Math.PI, angleYA*180/Math.PI);
// 		var angleXB = V2D.angleDirection(vectorX,eigV2DB);
// 		var angleYB = V2D.angleDirection(vectorY,eigV2DB);
// 		//console.log(angleXB*180/Math.PI, angleYB*180/Math.PI);
// 		var angleXG = V2D.angleDirection(vectorX,vectorGrad);
// 		var angleYG = V2D.angleDirection(vectorY,vectorGrad);
// console.log(angleYG*180/Math.PI+" deg");
// ang = -angleYG;
// var trans = new Matrix(3,3);
// trans.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1]);
// W2 = this.getScaleSpacePoint(xPrev.x,xPrev.y,scale,sigma, windowWid, windowHei, trans);
// //list.push(W2);
// var smm = new Array();
// var r2 = ImageMat.harrisDetector(W2,windowWid,windowHei, smm);
// var Lx2 = r2.Lx[windowWid*centerY+centerX];
// var Ly2 = r2.Ly[windowWid*centerY+centerX];
// var vectorGrad2 = new V2D(Lx2,Ly2);
// //vectorGrad2.norm();
// console.log("GRAD2: "+vectorGrad2.toString());
// 		// 
// 		var ang;
// 		var s = Math.min(eigRatio,2.0);//eigRatio*0.1;//*(1/(i+1)); //Math.min(eigRatio,3.0);
// 		s = Math.abs(s);
// 		s = Math.max(s,1.0);
// 		s = 1+((s-1)*0.5);
// 		var com=new Matrix(2,2), rot=new Matrix(2,2), sca=new Matrix(2,2);
// 		//com.identity();
// 		com.setFromArray([transform.get(0,0),transform.get(0,1),transform.get(1,0),transform.get(1,1)]);
// 		// +y
// 		// ang = -angleYA;
// 		// rot.setFromArray([Math.cos(ang),Math.sin(ang), -Math.sin(ang),Math.cos(ang)]);
// 		// sca.setFromArray([1,0, 0,1/s]); // *((i%2==0)?1.0:1.1)
// 		// com = Matrix.mult(rot,com);
// 		// com = Matrix.mult(sca,com);
// 		// ang = -ang;
// 		// rot.setFromArray([Math.cos(ang),Math.sin(ang), -Math.sin(ang),Math.cos(ang)]);
// 		// com = Matrix.mult(rot,com);
// 		// // -y
// 		// ang = -angleYB;
// 		// rot.setFromArray([Math.cos(ang),Math.sin(ang), -Math.sin(ang),Math.cos(ang)]);
// 		// sca.setFromArray([1,0, 0,s]); // *((i%2==1)?1.0:1.1))
// 		// com = Matrix.mult(rot,com);
// 		// com = Matrix.mult(sca,com);
// 		// ang = -ang;
// 		// rot.setFromArray([Math.cos(ang),Math.sin(ang), -Math.sin(ang),Math.cos(ang)]);
// 		// com = Matrix.mult(rot,com);

// 		// +y grad
// 		// s = Math.abs( vectorGrad2.x/vectorGrad2.y );
// 		// if(s<0){
// 		// 	s = 1/s;
// 		// }
// 		// console.log("SCALE: "+s);
// 		// ang = -angleYG;
// 		// rot.setFromArray([Math.cos(ang),Math.sin(ang), -Math.sin(ang),Math.cos(ang)]);
// 		// sca.setFromArray([s,0, 0,1/s]);
// 		// com = Matrix.mult(rot,com);
// 		// com = Matrix.mult(sca,com);
// 		// ang = -ang;
// 		// rot.setFromArray([Math.cos(ang),Math.sin(ang), -Math.sin(ang),Math.cos(ang)]);
// 		// com = Matrix.mult(rot,com);

// 		// set SVD = 1
// 		// var svd = Matrix.SVD(com);
// 		// var lambdaMax = Math.max(svd.S.get(0,0),svd.S.get(1,1));
// 		// var lambdaMin = Math.min(svd.S.get(0,0),svd.S.get(1,1));
// 		// svd.S.set(0,0, svd.S.get(0,0)/lambdaMax);
// 		// svd.S.set(1,1, svd.S.get(1,1)/lambdaMax);
// 		// com = Matrix.fromSVD(svd.U,svd.S,svd.V);
// 		// copy
// 		transform.set(0,0, com.get(0,0));
// 		transform.set(0,1, com.get(0,1));
// 		transform.set(1,0, com.get(1,0));
// 		transform.set(1,1, com.get(1,1));
// }
// W = this.getScaleSpacePoint(xPrev.x,xPrev.y,scale,sigma, windowWid, windowHei, transform);
// list.push(W);

// console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
// return {matrix:transform, window:W, windowWidth:windowWid, windowHeight:windowHei, list:list}



var harrisMaxima;
	for(i=countMax; i--; ){
		console.log("i: "+(countMax-i-1));
		transform.set(0,0, U.get(0,0)); // copy rotation/scale matrix to full 2D matrix
		transform.set(0,1, U.get(0,1));
		transform.set(1,0, U.get(1,0));
		transform.set(1,1, U.get(1,1));
		// normalize window on x<x,y,s>
		scale = xPrev.z;
//scale *= 0.4;
console.log("A");
		sigma = this.sigmaFromScale(scale);
		console.log(xPrev.x,xPrev.y,scale,sigma);
		W = this.getScaleSpacePoint(xPrev.x,xPrev.y,scale,sigma, windowWid, windowHei, transform);
var gauss1D = ImageMat.getGaussianWindow(10,1, 1.6);
//W = ImageMat.gaussian2DFrom1DFloat(W, windowWid,windowHei, gauss1D);
var SMM = new Array();
var response = ImageMat.harrisDetector(W,windowWid,windowHei, SMM);
var mat = new Matrix(2,2).setFromArray( SMM[windowWid*centerY+centerX] );
console.log("===============");
console.log(mat.toString());
var obj = Matrix.eigenValuesAndVectors(mat);
var val = obj.values;
var vecs = obj.vectors;
console.log( val.toString() );
console.log( val[0]/val[1] );
console.log( vecs[0].toString() );
console.log( vecs[1].toString() );
console.log("===============");
// var gauss1D = ImageMat.getGaussianWindow(10,1, 1.6);
// W = ImageMat.gaussian2DFrom1DFloat(W, windowWid,windowHei, gauss1D);
// var Lx = ImageMat.derivativeX(W,windowWid,windowHei);
// var Ly = ImageMat.derivativeY(W,windowWid,windowHei);
// console.log(Lx);
// var lx = Lx[windowWid*centerY+centerX];
// var ly = Ly[windowWid*centerY+centerX];
// var mat = new Matrix(2,2).setFromArray( [lx*lx,lx*ly,lx*ly,ly*ly] );
// console.log("===============");
// console.log(mat.toString());
// var obj = Matrix.eigenValuesAndVectors(mat);
// var val = obj.values;
// var vecs = obj.vectors;
// console.log( val.toString() );
// console.log( vecs[0].toString() );
// console.log( vecs[1].toString() );
// console.log("===============");
		// select integration scale
console.log("B");
		sigmaI = sigma;
			sigmaD = 0.7*sigmaI;
			harris = this.harrisMatrix(W,windowWid,windowHei, sigmaI,sigmaD);
harris.harris = response;
//console.log( harris.matrix[windowWid*centerY+centerX] );
// var mat = new Matrix(2,2).setFromArray( harris.matrix[windowWid*centerY+centerX] );
// console.log("===============");
// console.log(mat.toString());
// var obj = Matrix.eigenValuesAndVectors(mat);
// var val = obj.values;
// var vecs = obj.vectors;
// console.log( val.toString() );
// console.log( vecs[0].toString() );
// console.log( vecs[1].toString() );
// console.log("===============");
			u.setFromArray( harris.matrix[windowWid*centerY+centerX] );
		// select differentiation scale: maximize lmin/lmax
		//vals = Matrix.eigenValuesAndVectors2D( u.get(0,0),u.get(0,1), u.get(1,0), u.get(1,1) );
		vals = Matrix.eigenValuesAndVectors(u);
		lambdaMax = Code.maxArray(vals.values);
		lambdaMin = Code.minArray(vals.values);
		ratio = lambdaMin/lambdaMax;
		console.log(lambdaMax+" "+lambdaMin+" ratio: "+ratio);
		sigmaD = 0.7*sigmaI;
		// find location of local maximum of harris
// harris.harris = ImageMat.normalFloat01(harris.harris);
// harris.harris = ImageMat.addConst(harris.harris,-1.0);
// harris.harris = ImageMat.absFloat(harris.harris);
// harris.harris = ImageMat.dropBelow(harris.harris,0.95);
			var maxs = ImageMat.getPeaks(harris.harris, windowWid,windowHei); // ImageMat.normalFloat01(harris.harris)
			var lens = maxs.length;
//console.log(maxs);
			var l;
			harrisMaxima = ImageMat.newZeroFloat(windowWid,windowHei);
//harris.harris = ImageMat.normalFloat01(harris.harris);
			for(l=0;l<lens;++l){
				//console.log(maxs[l].x,maxs[l].y);
				harrisMaxima[windowWid*maxs[l].y + maxs[l].x] = 1;
//harris.harris[windowWid*maxs[l].y + maxs[l].x] += .24;
			}
			// harris measure ... 
			// displacement vector for xNext
		// compuate newest mu
		//u = 0;
		// accumulate transform
//console.log(u.toString());
		u = Matrix.power(u,0.5);
//console.log(u.toString());
		U = Matrix.mult(u,U);
		// normalize eigenvalues: U_lmax = 1
		var svd = Matrix.SVD(U);
		lambdaMax = Math.max(svd.S.get(0,0),svd.S.get(1,1));
		lambdaMin = Math.min(svd.S.get(0,0),svd.S.get(1,1));
			svd.S.set(0,0, svd.S.get(0,0)/lambdaMax);
			svd.S.set(1,1, svd.S.get(1,1)/lambdaMax);
			U = Matrix.fromSVD(svd.U,svd.S,svd.V);
console.log( Matrix.SVD(U).S.toString() );
		// check limit criteria
		if(false){ // (1-lambdaMin/lambdaMax) < epsilon
			console.log("reached criteria");
			break;
		}
		// next iteration
		//xPrev.copy(xNext);
		break;
	}
	// 
	transform.set(0,0, U.get(0,0)); // copy rotation/scale matrix to full 2D matrix
	transform.set(0,1, U.get(0,1));
	transform.set(1,0, U.get(1,0));
	transform.set(1,1, U.get(1,1));
	//transform.copy(U);
var a = ImageMat.normalFloat01(harris.harris);
var b = ImageMat.normalFloat01(harris.b);
var c = ImageMat.normalFloat01(harris.c);
var d = ImageMat.normalFloat01(harrisMaxima);
var e = ImageMat.normalFloat01(harris.e);
var f = ImageMat.normalFloat01(harris.f);
	var output = {matrix:transform, point:xNext,
		window:W, windowWidth:windowWid, windowHeight:windowHei,
		a:a,
		b:b,
		c:c,
		d:d,
		e:e,
		f:f};
	return output;
}
ImageDescriptor.prototype.processAffineSpace = function(){
// need to merge points that are real close to eachoter
	// dropping
	// merging to nearby harris maxima

	// this finds the most affine-invariant transformation to compare the points
	var i, j, k, len, len2, pt, obj;
	var startPoints = this._scaleSpaceExtrema;
	var endPoints = new Array();
	len = startPoints.length;
	for(k=0;k<len;++k){
		pt = startPoints[k]; // initial interest point
		obj = this.getStableAffinePoint(pt);
		if(obj){
			endPoints.push(obj);
		}
// store affine along with points
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
