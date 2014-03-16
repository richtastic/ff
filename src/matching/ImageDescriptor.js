// ImageDescriptor.js
ImageDescriptor.SCALE_MULTIPLIER = 0.125;
ImageDescriptor.YAML = {
	FILENAME: "filename",
	CREATED: "created",
	FEATURES: "features",
	}
function ImageDescriptor(wid,hei, origR,origG,origB, filename){
	var i, len = wid*hei;
	// stored data
	this._filename = (filename!==undefined)?filename:null;
	this._features = new Array();
	this._width = (wid!==undefined)?wid:0;
	this._height = (hei!==undefined)?hei:0;
	this._flatRed = (origR!==undefined)?origR:null;
	this._flatGrn = (origG!==undefined)?origG:null;
	this._flatBlu = (origB!==undefined)?origB:null;
	this._flatGry = new Array();
	for(i=0;i<len;++i){
		this._flatGry[i] = (this._flatRed[i]+this._flatGrn[i]+this._flatBlu[i])/3.0;
	}
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
}
ImageDescriptor.prototype.imageFileName = function(){
	return this._filename;
}
ImageDescriptor.prototype.width = function(){
	return this._width;
}
ImageDescriptor.prototype.height = function(){
	return this._height;
}
ImageDescriptor.prototype.clearData = function(){
	this._filename = null;
	this._features = new Array(); // properly kill and release
	this._width = null;
	this._height = null;
}
ImageDescriptor.prototype.setImageData = function(wid,hei,red,grn,blu){
	var i, len = wid*hei;
	this._width = wid;
	this._height = hei;
	this._flatRed = red;
	this._flatGrn = grn;
	this._flatBlu = blu;
	this._flatGry = new Array();
	for(i=0;i<len;++i){
		this._flatGry[i] = (this._flatRed[i]+this._flatGrn[i]+this._flatBlu[i])/3.0;
	}
	// this._flatRed = ImageMat.normalFloat01(this._flatRed);
	// this._flatGrn = ImageMat.normalFloat01(this._flatGrn);
	// this._flatBlu = ImageMat.normalFloat01(this._flatBlu);
	// this._flatGry = ImageMat.normalFloat01(this._flatGry);
}
ImageDescriptor.prototype.redFlat = function(){
	return this._flatRed;
}
ImageDescriptor.prototype.greenFlat = function(){
	return this._flatGrn;
}
ImageDescriptor.prototype.blueFlat = function(){
	return this._flatBlu;
}
ImageDescriptor.prototype.grayFlat = function(){
	return this._flatGry;
}
ImageDescriptor.prototype.saveToYAML = function(yaml){
	var i, len, feature, DATA = ImageDescriptor.YAML;
	yaml.writeString(DATA.FILENAME,this._filename);
	yaml.writeString(DATA.CREATED,""+Code.getTimeStamp());
	yaml.writeArrayStart(DATA.FEATURES);
		len = this._features.length;
		for(i=0;i<len;++i){
			feature = this._features[i];
			yaml.writeObjectStart();
				feature.saveToYAML(yaml);
			yaml.writeObjectEnd();
		}
	yaml.writeArrayEnd();
}
// ImageDescriptor.prototype.imageLoadedCompleteFxn = function(obj){
// 	console.log(obj.images);
// 	console.log(obj.files);
// }
ImageDescriptor.prototype.loadFromYAML = function(yaml){
	this.clearData();
	var i, len, feature, DATA = ImageDescriptor.YAML
	this._filename = yaml[DATA.FILENAME];
	var timestamp = yaml[DATA.CREATED];
	// var imageLoader = new ImageLoader();//"",[this._filename], this,this.imageLoadedCompleteFxn,null);
	// imageLoader.setLoadList("",[this._filename], this,this.imageLoadedCompleteFxn,null);
	// imageLoader.load();
	var arr = yaml[DATA.FEATURES];
	len = arr.length;
	for(i=0;i<len;++i){
		feature = new ImageFeature();
		feature.loadFromYAML(arr[i]);
		this._features.push(feature);
	}
}

ImageDescriptor.prototype._clearFeatureList = function(){
	Code.emptyArray(this._features);
}
ImageDescriptor.prototype.getFeatureList = function(){
	return this._features;
}
ImageDescriptor.prototype.getScaleSpaceExtrema = function(){
	var list = new Array(), arr = this._features;
	var i, len = arr.length;
	for(i=0;i<len;++i){
		list.push( new V3D(arr[i].x(),arr[i].y(),arr[i].scale()) );
	}
	return list;
}
ImageDescriptor.prototype.getImageDefinition = function(){ // LEGACY
	var wid = this._width, hei = this._height;
	var arr = new Array();
	arr.push( (new ImageMat(wid,hei)).setFromFloats( ImageMat.getNormalFloat01(this._flatRed),ImageMat.getNormalFloat01(this._flatGrn),ImageMat.getNormalFloat01(this._flatBlu) ) );
	return arr;
}
ImageDescriptor.prototype.processScaleSpace = function(){ // this generates a list of potential scale-space points: _scaleSpaceExtrema
	Code.timerStart();
	var i, j, k, ss, len, len2, pt;
	var wid = this._width, hei = this._height;
	var sigma = 1.6; // 1.6
	var scalesPerOctave = 5; // 5
	var sConstant = scalesPerOctave-3;
	var kConstant = Math.pow(2.0,2.0/(scalesPerOctave-1)); // var kConstant = Math.pow(2.0,1/sConstant);
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
	var nextImage, dog, img, ext, sig, padding, tmp;
	for(i=0;i<totalOctaves;++i){
		console.log( "octave: "+(i+1)+"/"+totalOctaves+" ... size "+currentWid+", "+currentHei+" . . . . . . . . . . . . . . . . . . . . . . . . . . .");
		Code.emptyArray( dogList );
		for(j=0;j<scalesPerOctave-1;++j){
			// calculate gaussian settings 
			sig = sigma*Math.pow(kConstant,j);
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
			for(k=0;k<ext.length;++k){ // set sigma to absolute position based on relative position + iteration IN LINEAR SPACE
				ext[k].z = Math.pow(2, i + (j/(dogList.length-2)) + 0.5*(ext[k].z+1.0)/(dogList.length-2) );
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
	this._clearFeatureList();
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
	//temp.sort(function(a,b){ if(a.u<b.u){return 1;}else if(a.u>b.u){return -1;} return 0; });
	//temp.sort(function(a,b){ if(a.u>b.u){return 1;}else if(a.u<b.u){return -1;} return 0; });
	len = Math.min(100,temp.length);
	for(i=0;i<len;++i){
		this._features.push( new ImageFeature(temp[i].x,temp[i].y,temp[i].z,temp[i].t,null) );
	}
	// ALSO COPY REMAINING POINTS THAT FIT CRITERIA
	len = temp.length;
	for(;i<len;++i){
break; // just keep 100
		if( Math.abs(temp[i].t) >= minThresholdIntensity ){
			this._features.push( new ImageFeature(temp[i].x,temp[i].y,temp[i].z,temp[i].t,null) );
		}else{
			break;
		}
	}
	console.log("scale space count: "+this._features.length);
	Code.emptyArray(extremaList);
	Code.timerStop();
	console.log( "time: "+Code.timerDifferenceSeconds() );
}

ImageDescriptor.prototype.processAffineSpace = function(){ // this finds the most affine-invariant transformation to compare points
	Code.timerStart();
// need to merge points that are real close to eachother
	// dropping
	// merging/localizing to nearby harris maxima
	var i, j, k, len, len2, pt, obj, feature;
	var startPoints = this._features;
	var newFeatures = new Array();
	var endPoints = new Array();
	len = startPoints.length;
	for(k=0;k<len;++k){
		pt = new V3D(startPoints[k].x(),startPoints[k].y(),startPoints[k].scale()); // initial interest point
		obj = this.getStableAffinePoint(pt);
		if(obj){
			feature = new ImageFeature(obj.x,obj.y,obj.scale, startPoints[k].scaleSpaceCornerness(), obj.matrix);
			endPoints.push(feature);
		}
	}
	this._features = endPoints;
	Code.timerStop();
	console.log( "time: "+Code.timerDifferenceSeconds() );
}
ImageDescriptor.prototype.describeFeatures = function(){ // features are now fully defined on a point-by-point basis
	Code.timerStart();
	var list = this._features;
	var feature, i, len=list.length;
	for(i=0;i<len;++i){
		feature = list[i];
		feature.findDescriptorData(this._flatRed,this._flatGrn,this._flatBlu,this._flatGry, this._width,this._height);
	}
	Code.timerStop();
	console.log( "time: "+Code.timerDifferenceSeconds() );
}
ImageDescriptor.prototype.compareFeatures = function(){ // this finds best-matching lists for each featuring
	var list = this._features;
	var i, len=list.length;
	for(i=0;i<len;++i){
		for(j=i+1;j<len;++j){
			ImageFeature.compareFeatures(list[i],list[j]);
		}
	}
}



// ImageDescriptor.prototype.sigmaFromScale = function(scale){
// 	var sigma = 1.6;
// 	var exp = Math.log(scale)/Math.log(2);
// 	var expPrev = Math.floor(exp);
// 	var expNext = Math.ceil(exp);
// 	//console.log(scale, exp,"oooooooooooooooooooooooooooooooo", exp, expPrev, expNext);
// 	var pos = 1.0 + (exp-expPrev);
// 	return sigma*pos;
// }
// ImageDescriptor.prototype.sigmaFromScaleOLD = function(cScale){
// 	var cExponent = Math.log(cScale)/Math.log(2);
// 	this._sourceImageSigma = 1.6;
// 	this._sourceImageConstant = 2; //  ???
// 	var cSigma = this._sourceImageSigma*Math.pow(this._sourceImageConstant,(cExponent*2)%2);
// 	return cSigma;
// }

ImageDescriptor.prototype.getScaleSpacePoint = function(x,y,s,u, w,h, matrix){ // return scale-space image with width:w and height:h, centered at x,y, transformed by matrix if present
	return ImageMat.extractRectFromFloatImage(x,y,s,u, w,h, this._flatGry,this._width,this._height, matrix);
}








ImageDescriptor.prototype.doesPointHaveScaleExtrema = function(x,y,s){ // only care about x and y position => scale space is determined around s
	s = (s!==undefined)?s:1.0;
	var w, prevW, diff, i, len, scale, cen;
	var gray = this._flatGry, wid = this._width, hei = this._height;
	var transform = new Matrix(3,3).identity();
	var windowWid = windowHei = 75;
	var cenW = Math.floor(windowWid*0.5), cenH = Math.floor(windowHei*0.5);
	var center = windowWid*cenH + cenW;
	var scales = [], sigmas = [], values = [], images = [];
	/*
	for(i=0;i<scales.length;++i){
		scale = scales[i];
		w = ImageMat.extractRectFromFloatImage(x,y,scale,null, windowWid,windowHei, gray,wid,hei, transform);
		if(prevW){
			diff = ImageMat.subFloat(w,prevW);
			cen = diff[center];
			console.log(center);
			console.log(cen);
			values.push(cen);
			diff = ImageMat.normalFloat01(diff);
			images.push(diff);
		}
		prevW = w;
	}*/
	var startScale = 0.25;
	var sigma = 1.6; // input - blur
	var scalesPerOctave = 5; // input - divisions
	var totalOctaves = 5; // input - count
	var kConstant = Math.pow(2.0,1.0/(scalesPerOctave-1));
	var gaussSizeBase = 5, gaussSizeIncrement = 1.5, gauss1D, gaussSize;
	var sig, sca, tmp, prevTmp, prevSca;


	for(i=0;i<totalOctaves;++i){
		sca = startScale*Math.pow(2,i);
		//console.log(sca+"..........");
		w = ImageMat.extractRectFromFloatImage(x,y,sca,null, windowWid,windowHei, gray,wid,hei, transform);
		prevTmp = null;
		prevSca = null;
		for(j=0;j<scalesPerOctave;++j){
			sca = startScale*Math.pow(2,i)*Math.pow(kConstant,j); // current actual scale
			//console.log(j,sca);
			sig = sigma*Math.pow(kConstant,j);
			gaussSize = Math.round(gaussSizeBase + j*gaussSizeIncrement)*2+1;
			gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sig);
			tmp = ImageMat.gaussian2DFrom1DFloat(w, windowWid,windowHei, gauss1D);
			if(prevTmp!=null){
				cen = tmp[center]-prevTmp[center];
				values.push(cen);
				diff = ImageMat.subFloat(tmp,prevTmp);
				diff = ImageMat.normalFloat01(diff);
var peaks = ImageMat.getPeaks(diff, windowWid,windowHei);
var d2 = ImageMat.showPeaks(diff, windowWid,windowHei, peaks);
d2[windowWid*cenH + cenW] += 5.0;
var d3 = ImageMat.addFloat(diff,d2);
var d4 = ImageMat.getNormalFloat01(d3);
images.push(d4);
				//images.push(diff);
				scales.push( (sca+prevSca)*0.5 );
				sigmas.push( sigma*Math.pow(kConstant,j-0.5) );
			}
			prevSca = sca;
			prevTmp = tmp;
		}
	}
	var max=values[0], min=values[0];//var max = Math.max.apply(this,values), min = Math.min.apply(this,values);
	var maxIndex=0; minIndex=0, maxScale=scales[0], minScale=scales[0];
	var maxSigma=sigmas[0];
	// want: global maxima that:
	// has only a [single - tricky with noise...] peak, that is NOT the ends
	// OR ditto minima
	// can look at relative intensities for peak: walk the value left/rigth until there is another peak and record the difference in VALUE or in POINTS 
	// can exclude start/end points of first loop - that seems to tbe where the most noise is
	// diffs: 0.00015, 0.002, 0.003, 
	for(i=1;i<values.length;++i){
		if(values[i]>max){
			max = values[i];
			maxIndex = i;
			maxScale = scales[i];
			maxSigma = sigmas[i];
		}
		if(values[i]<min){
			min = values[i];
			minIndex = i;
			minScale = scales[i];
		}
	}
var octA = "values = [";
var octB = "scales = [";
for(i=0;i<values.length;++i){
	octA += values[i]+" ";
	octB += scales[i]+" ";
}
octA += "];";
octB += "];";
	// ignore end extrema
	if(max==values[0] || max==values[values.length-1]){ max=null; maxIndex=null; maxScale=null; }
	if(min==values[0] || min==values[values.length-1]){ min=null; minIndex=null; minScale=null; }
	// interpolation of extrema
	var v;
	if(maxIndex){
		v = Code.locateExtrema1D(scales[maxIndex-1],values[maxIndex-1], scales[maxIndex],values[maxIndex], scales[maxIndex+1],values[maxIndex+1]);
		maxScale = v.x;
	}else if(minIndex){
		v = Code.locateExtrema1D(scales[minIndex-1],values[minIndex-1], scales[minIndex],values[minIndex], scales[minIndex+1],values[minIndex+1]);
		minScale = v.x;
	}
	// console.log(max);
	// console.log(min);
	return {values:values, scales:scales, images:images, width:windowWid, height:windowHei, max:max, maxIndex:maxIndex, maxScale:maxScale, maxSigma:maxSigma, min:min, minIndex:minIndex, minScale:minScale,
		octave:(octA+"\n"+octB)};
}


ImageDescriptor.prototype.pointHarrisExtrema = function(x,y,s,sig, extrema, transform){/// THIS USES OLD FUNCTONS - WANT TO REMOVE
	var sigma = undefined;
	var kMult = undefined;
	if(s===undefined){
		var obj = this.doesPointHaveScaleExtrema(x,y);
		if(obj.max!==null){
			s = obj.maxScale;
			sigma = obj.maxSigma;
		}else{
			s = 1.0;
		}
	}
	var sca = s;
	var gray = this._flatGry, wid = this._width, hei = this._height;
	var transform = transform?transform:new Matrix(3,3).identity();
	var windowWid = windowHei = 75;
	var cenW = Math.floor(windowWid*0.5), cenH = Math.floor(windowHei*0.5);
	var center = windowWid*cenH + cenW;
	var w = ImageMat.extractRectFromFloatImage(x,y,sca,sigma, windowWid,windowHei, gray,wid,hei, transform);

	var SMM = new Array();
	var threshold = 0;
	sigma = undefined; kMult = undefined;
	var harris = ImageMat.harrisDetector(w,windowWid,windowHei, SMM, threshold, sigma, kMult);
	var har = harris.response;
	var peaks = ImageMat.findExtrema2DFloat(har, windowWid,windowHei, 1.0,1.0, 1E-10);
// sigma = 1.6;
// gaussSize = 7;
// gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
// tmp = ImageMat.gaussian2DFrom1DFloat(w, windowWid,windowHei, gauss1D);
//var peaks = ImageMat.findExtrema2DFloat(tmp, windowWid,windowHei);
//console.log("peaks: "+peaks.length);
	var minX=0, minY=0, dist, i, len=peaks.length, minDist = null;//windowWid*windowWid;
	var pX,pY;
	for(i=0;i<len;++i){ // normalize to 'pixel' size (of window)
		peaks[i].x*=windowWid;
		peaks[i].y*=windowHei;
	}
var extremaMaxValue = extrema;//!==null?extrema:peaks[i].z-1;
var extremaMinValue = extrema;//!==null?extrema:peaks[i].z+1; // IGNORING RIGHT NOW...
	for(i=0;i<len;++i){ // peaks outside of image window should not be considered (0<x>1, 0<y>1)
		pX = peaks[i].x - cenW;
		pY = peaks[i].y - cenH;
		dist = Math.sqrt(pX*pX+pY*pY);
		if((dist<minDist || minDist===null) ){// && (peaks[i].z>extremaMaxValue || extremaMaxValue===null)){ // || peaks[i].z<extremaMinValue
			minDist = dist;
			minX = pX;
			minY = pY;
			extremaMaxValue = peaks[i].z;
		}
	}
//console.log( extremaMaxValue );
	// absolute relative coords (relative excluding scale)
// POINT HAS TO BE REVERSE-LOCATED VIA TRANSFORM
	minX = minX/sca/wid;
	minY = minY/sca/hei;
var tinv = Matrix.inverse(transform);
var pt = new V2D(minX,minY);
tinv.multV2DtoV2D(pt,pt);
minX = pt.x;
minY = pt.y;
	var har2 = ImageMat.showPeaks(har, windowWid,windowHei, peaks);
	w = ImageMat.addFloat(har,har2);
	w[windowWid*cenH + cenW] += 1.0;
	w = ImageMat.getNormalFloat01(w);
//w = ImageMat.getNormalFloat01(tmp);
	return {image:w, width:windowWid, height:windowHei, closestX:minX, closestY:minY, closestDistance:minDist, closestExtrema:extremaMaxValue};
}


ImageDescriptor.prototype.detectPoint = function(inPoint){
inPoint.z = 1.0;
	var i, j, len, sigma, val;
	var sourceGry = this._flatGry;
	var sourceWid = this._width;
	var sourceHei = this._height;
	var v = new V2D(), x = new V3D(); x.copy(inPoint);
	var winWid = winHei = 75;
	var u = new Matrix(2,2);
	var transformInverse, transform = new Matrix(3,3); transform.identity();
	var maxIterations = 18;
	var winList = new Array(), pointList = new Array(), eigenList = new Array();
	var sigmaI = 1.6, sigmaD = 1.6;
	var decay = 1.0, decayRate = 0.99;
	var ratio = 2.0, prevRatio = 2.0;
console.log("............ detect point");
var taves = ['r--','g--','b--','m--','k--','r-*','g-*','b-*','m-*','k-*','r-^','g-^','b-^','m-^','k-^','r-o','g-o','b-o','m-o','k-o'];
var octave = "hold off;\n";
var octave2 = "hold off;\n";
var octave3 = "hold off;\n";
octC = "iterations = [";
octD = "ratios = [";
	// 1. initialize U_0 to identity matrix
	for(i=0;i<maxIterations;++i){
//console.log(x.z);
//console.log(x.x,x.y,x.z);//," ",sourceWid,sourceHei);
pointList.push( new V3D(x.x,x.y,x.z) );
if(x.x<0 || x.x>1 || x.y<0 || x.y>1){
	console.log("POINT IS OUT OF RANGE");
}
		transformInverse = Matrix.inverse(transform);
		// 2. normalize window W(x_w) = I(x) centered on U_k-1 * x_w_k-1 = x_w_k-1
		sigma = null;
		W = ImageMat.extractRectFromFloatImage(x.x,x.y,x.z,sigma, winWid,winHei, sourceGry,sourceWid,sourceHei, transform);
//winList.push(W);
		// 3. select integration scale sigma_I at point x_w_k-1 [characteristic scale]
		val = this.getScaleSpaceInfo(x.x,x.y,x.z, transform);
for(j=0;j<val.images.length;++j){
	winList.push(val.images[j]);
}
//console.log(val.maxScale);
var octA = "values = [";
var octB = "scales = [";
for(j=0;j<val.values.length;++j){
	octA += val.values[j]+" ";
	octB += val.scales[j]+" ";
}
octA += "];";
octB += "];";
octave += octA+"\n";
octave += octB+"\n";
octave += "plot(scales,values,\""+taves[i]+"\");\n";
octave += "hold on;\n";
if(val.maxScale!==null && val.maxScale>0.01){
	x.z = val.maxScale;
	sigmaI = val.maxSigma;
}
//console.log(transform.toString());
		// 4. select differentiation scale sigma_D = s*sigma_I, which maximizes (lambda_min(u)/lambda_max(u)) with s in [0.5,...0.75] and u = u(x_w_k-1,sigma_I,sigma_D)
//console.log(x.z,sigmaI);
		val = this.getEigenMaxDiffScale(W,winWid,winHei, sigmaI, 0.25,0.75,5); // 0.5,10.0,30);// 0.5,0.7,4
		sigmaD = val.sigmaD;
//sigmaD = 0.7*sigmaI;
octA = "scales = [";
octB = "ratios = [";
for(j=0;j<val.ratios.length;++j){
	octA += val.scales[j]+" ";
	octB += val.ratios[j]+" ";
}
octA += "];";
octB += "];";
octave2 += octA+"\n";
octave2 += octB+"\n";
octave2 += "plot(scales,ratios,\""+taves[i]+"\");\n";
octave2 += "hold on;\n";
		// 5. detect spatial localization x_w_k of a maximum of the Harris measure [det(u(x,sI,sD))-alpha*tra^2(u(x,sI,sD))], nearest to x_w_k-1 and compute the location of the interest point x_k
		val = this.getClosestHarrisMaxima(W,winWid,winHei, sigmaI, sigmaD);
		// WANT LARGEST EXTREMA IN WINDOW
//if(i%2==0){
winList.push(val.image);
//}
		var off = val.offset;
		if(off==null){ // no maxima nearby ...
			//break;
		}else{

			transformInverse.multV2DtoV2D(v, off); // reverse transform to actual (zoomed) image location
	//		console.log(off.toString()+" => "+v.toString());
			v.x /= x.z; v.y /= x.z; // scale to window scale
			x.x += v.x/sourceWid; x.y += v.y/sourceHei; // goto next position
		}
//		console.log(" + "+v.toString()+" == "+x.toString());
		// 6. compute u_i_k = [u(x_w_k,sI,sD)]^(-1/2)
		u = this.getMewFromWin(W,winWid,winHei, sigmaI, sigmaD);
		// 7. concatenate transformation U_k = u_i_k * U_k-1 and normalize U_k to lambaMax(U_k) = 
		val = this.getAffineIncrementFromMew(u,transform, decay,decayRate, eigenList);
		transform = val.affine;
		decay = val.decay;
		prevRatio = ratio;
		ratio = val.ratio;
		//console.log(ratio);
		console.log(x.z/val.scale, x.z,val.scale);
octC += i+" ";
octD += ratio+" ";
		// 8. go to step 2 if 1 - lambdaMin(u_i_k)/lambdaMax(u_i_k) >= epsilonC
		if( (ratio-1.0)<=1E-3 ){ // converged
			console.log("converged");
			break;
		}
	}
console.log("............");
octC += "];";
octD += "];";
octave3 += octC+"\n";
octave3 += octD+"\n";
octave3 += "plot(iterations,ratios,\""+"r--"+"\");\n";
octave3 += "hold on;\n";
Code.copyToClipboardPrompt(octave);
//Code.copyToClipboardPrompt(octave2);
//Code.copyToClipboardPrompt(octave3);
//winList.push(W);

// NEED TO EXTRACT ACTUAL SCALE FOR POINT
// => AFFINE WILL CONTAIN ALL TRANSFORMATION (non-translational)


	return {windows:winList, width:winWid, height:winHei, points:pointList, eigens:eigenList,   affine:transform, point:x };
}
ImageDescriptor.prototype.getClosestHarrisMaxima = function(win,winWid,winHei, sigmaI, sigmaD, alpha){
	alpha = alpha!==undefined?alpha:0.05;
	var cenX = Math.floor(winWid*0.5);
	var cenY = Math.floor(winHei*0.5);
	var smm = this.getMewFromWin(win,winWid,winHei, sigmaI, sigmaD, true);
	var i, det, tra, len = smm.length;
	var measure = new Array(len);
	for(i=0;i<len;++i){ // edges are trash
		tra = smm[i][0] + smm[i][3];
		det = smm[i][0]*smm[i][3] - smm[i][1]*smm[i][2];
		measure[i] = det - alpha*tra*tra;
		var locX = i%winWid;
		var locY = Math.floor(i/winWid);
		if(locX<10||locX>(winWid-10)||locY<10||locY>(winHei-10)){
			measure[i] = 0;
		}
	}
	// get peaks
	var peaks = ImageMat.findExtrema2DFloat(measure, winWid,winHei, 1.0,1.0, 1E-11); // this doesn't work as expected
	//	var peaks = ImageMat.getPeaks(measure, winWid,winHei);
	len = peaks.length;
	//console.log("PEAKS: "+len);
	var pX,pY, dist, minDist=null, closest = new V2D();
	for(i=0;i<len;++i){
		pX = peaks[i].x*winWid - cenX; // + 0.5?
		pY = peaks[i].y*winHei - cenY; // + 0.5?
		// pX = peaks[i].x - cenX;
		// pY = peaks[i].y - cenY;
		dist = Math.sqrt(pX*pX+pY*pY);
		if(minDist===null || dist<minDist){
			minDist = dist;
			closest.x = pX; closest.y = pY;
		}
		// for show:
		peaks[i].x = peaks[i].x*winWid;
		peaks[i].y = peaks[i].y*winHei;
	}
	var image = null;
	// image = ImageMat.showPeaks(measure,winWid,winHei, peaks);
	image = ImageMat.showPeaks(measure,winWid,winHei, peaks);
	image = ImageMat.addFloat(ImageMat.getNormalFloat01(measure),image);
	//image = ImageMat.addFloat(measure,image);
	image = ImageMat.getNormalFloat01(image);
	image = ImageMat.addFloat(ImageMat.scaleFloat(0.9995,win),image);
	image = ImageMat.getNormalFloat01(image);
	if(minDist>Math.min(winWid,winHei)*0.5*0.25){
		//console.log("TOO FAR AWAY: "+minDist+" "+closest.toString());
		closest = null;
	}
	return {offset:closest, image:image};
}
ImageDescriptor.prototype.getEigenMaxDiffScale = function(win,winWid,winHei, sigmaI, startScale,stopScale,divisions){ // maximize lambdaMin/lambdaMax
	var diffScale = stopScale - startScale;
	var scales = [];
	var ratios = [];
	var i, len, scale, ratio, eigen, eigA, eigB, sigmaD;
	var u = new Matrix(2,2);
	for(i=0;i<=divisions;++i){
		scale = startScale + diffScale*(i/divisions);
		sigmaD = scale*sigmaI;
		u = this.getMewFromWin(win,winWid,winHei, sigmaI, sigmaD);
		// find u eigenvalues
		eigen = Matrix.eigenValuesAndVectors(u);
		eigA = Math.max(eigen.values[0],eigen.values[1]);
		eigB = Math.min(eigen.values[0],eigen.values[1]);
		ratio = eigB/eigA;
		scales.push(sigmaD);
		ratios.push(ratio);
	}
	var max = Code.interpolateExtrema(scales,ratios).max;
	return {scales:scales, ratios:ratios, sigmaD:max.x};
}
ImageDescriptor.prototype.getMewFromWin = function(win,winWid,winHei, sigmaI, sigmaD, all){ // centered at x,y, scaled at z, un-blurred
	var center = winWid*Math.floor(winHei*0.5) + Math.floor(winWid*0.5);
	var gauss1D, smm, sDD = sigmaD*sigmaD;
	gauss1D = ImageMat.gaussianWindow1DFromSigma(sigmaD);
	var blurredI = ImageMat.gaussian2DFrom1DFloat(win,winWid,winHei, gauss1D);
	var Lx = ImageMat.derivativeX(blurredI,winWid,winHei);
	var Ly = ImageMat.derivativeY(blurredI,winWid,winHei);
	var LxLx = ImageMat.mulFloat(Lx,Lx);
	var LyLy = ImageMat.mulFloat(Ly,Ly);
	var LxLy = ImageMat.mulFloat(Lx,Ly);
	gauss1D = ImageMat.gaussianWindow1DFromSigma(sigmaI);
	var blurredLxLx = ImageMat.gaussian2DFrom1DFloat(LxLx, winWid,winHei, gauss1D);
	var blurredLyLy = ImageMat.gaussian2DFrom1DFloat(LyLy, winWid,winHei, gauss1D);
	var blurredLxLy = ImageMat.gaussian2DFrom1DFloat(LxLy, winWid,winHei, gauss1D);
	if(all===true){
		var i, len = winWid*winHei;
		smm = new Array(len);
		for(i=0;i<len;++i){
			smm[i] = [sDD*blurredLxLx[i], sDD*blurredLxLy[i], sDD*blurredLxLy[i], sDD*blurredLyLy[i]];
		}
		return smm;
	}
	i = center;
	smm = [sDD*blurredLxLx[i], sDD*blurredLxLy[i], sDD*blurredLxLy[i], sDD*blurredLyLy[i]]; 
	var u = (new Matrix(2,2)).setFromArray(smm);
	return u;
}

ImageDescriptor.prototype.getScaleSpaceInfo = function(x,y,s, transform){ // basic from mikolajczyk
	var gray = this._flatGry, wid = this._width, hei = this._height;
	var values = [], scales = [], images = [];
	var minScale = 0.125, maxScale = 8.0, exponent = 2; // 0.25, 4.0
	var divisions = 24; // 16-32
	var minExp = Math.log(minScale)/Math.log(exponent);
	var maxExp = Math.log(maxScale)/Math.log(exponent);
	var diffExp = maxExp - minExp;
	var win, windowWid, windowHei;
	var sca = 1.0, sigma = 1.6;
	var sigmaSquare = sigma*sigma;
	var gaussSize = Math.round(5 + sigma*2.0)*2+1;
	var cenX, cenY, Lxx, Lyy, value;
	var i;
	for(i=0;i<=divisions;++i){
		sca = Math.pow(2, minExp + diffExp*(i/divisions) );
		windowHei = windowWid = Math.floor(gaussSize*2); // 2-3
		if(windowHei%2==0){ windowHei++; windowWid++; } // odd sized
		win = ImageMat.extractRectFromFloatImage(x,y,sca,sigma, windowWid,windowHei, gray,wid,hei, transform);
		//win = ImageMat.gaussian2DFrom1DFloat(win, windowWid,windowHei, gauss1D);
		cenX = Math.floor(windowWid*0.5);
		cenY = Math.floor(windowHei*0.5);
		win = Code.subArray2D(win,windowWid,windowHei, cenX-1,cenX+1, cenY-1,cenY+1);
		Lxx = ImageMat.secondDerivativeX(win, 3,3); // Lxx = ImageMat.secondDerivativeX(win, windowWid,windowHei);
		Lyy = ImageMat.secondDerivativeY(win, 3,3); // Lyy = ImageMat.secondDerivativeY(win, windowWid,windowHei);
		// cenX = Math.floor(windowWid*0.5);
		// cenY = Math.floor(windowHei*0.5);
		// center = windowWid*cenY + cenX;
		// if(false){
		// for(var j=0;j<win.length;++j){
		// 	win[j] = sigma*sigma*Math.abs(Lxx[j] + Lyy[j]);
		// }
		// win = ImageMat.getNormalFloat01(win);
		// win[center] = 1.0;
		// images.push(win);
		// }
		Lxx = Lxx[4]; // Lxx = Lxx[center];
		Lyy = Lyy[4]; // Lyy = Lyy[center];
		value = sigmaSquare*Math.abs(Lxx + Lyy);
		scales.push(sca);
		values.push(value);
	}
	value = Code.interpolateExtrema(scales,values, true);
	value = value.max;
	if(!value){
		value = new V2D(0,1.6);
	}
	return {values:values, scales:scales, images:images, width:windowWid, height:windowHei, max:value.x, maxIndex:-1, maxScale:value.x, maxSigma:sigma};
}


ImageDescriptor.prototype.getAffineIncrementFromMew = function(u,transform, scaler,decayRate, eigenList){
	var cum = new Matrix(3,3), rot = new Matrix(3,3), sca = new Matrix(3,3);
	var eig = Matrix.eigenValuesAndVectors(u);
	var vectorY = new V2D(0,1), vectorMin = new V2D(0,0), vectorMax = new V2D(0,0);
	// if(eig.values[0]>eig.values[1]){
	var lambdaMax = eig.values[0];
	var lambdaMin = eig.values[1];
	vectorMin.set(eig.vectors[0].get(0,0),eig.vectors[0].get(1,0));
	vectorMax.set(eig.vectors[1].get(0,0),eig.vectors[1].get(1,0));
	// }else{
	// 	console.log("B");
	// 	lambdaMax = eig.values[1];
	// 	lambdaMin = eig.values[0];
	// 	vectorMin.set(eig.vectors[1].get(0,0),eig.vectors[1].get(1,0));
	// 	vectorMax.set(eig.vectors[0].get(0,0),eig.vectors[0].get(1,0));
	// }
	eigenList.push( [new V2D().copy(vectorMin),new V2D().copy(vectorMax),lambdaMin,lambdaMax] );
	var angleYMax = V2D.angleDirection(vectorY,vectorMax);
	var angleYMin = V2D.angleDirection(vectorY,vectorMin);
	var ang, amt, tra = transform;
	var ratio = lambdaMax/lambdaMin;
	// non-proportional scaling
	cum.identity();
	ang = -angleYMax;
	rot.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1.0]);
	cum = Matrix.mult(cum,rot);
	// amt = Math.pow(ratio,0.25*scaler); // stable points
	amt = Math.pow(Math.pow(ratio,0.5),0.5*scaler); // unstable points
	scaler *= decayRate;
	sca.setFromArray([amt,0,0, 0,1.0,0, 0,0,1.0]);
	cum = Matrix.mult(cum,sca);
	ang = angleYMax;
	rot.setFromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1.0]);
	cum = Matrix.mult(cum,rot);
	transform = Matrix.mult(tra,cum);
	// preoportional scalre restoring
	var separation = Code.separateAffine2D( transform.get(0,0),transform.get(0,1),transform.get(1,0),transform.get(1,1), transform.get(1,2),transform.get(1,2) );
	//console.log("SEPARATED: "+separation.scaleX+" "+separation.scaleY);
	if(separation.scaleX<separation.scaleY){
		amt = 1/separation.scaleX;
		sca.setFromArray([amt,0,0, 0,1.0,0, 0,0,1]);
	}else{
		amt = 1/separation.scaleY;
		sca.setFromArray([1.0,0,0, 0,amt,0, 0,0,1]);
	}
	amt = 1.0/(separation.scaleX+separation.scaleY)*0.5;
	//amt = Math.max(1.0/separation.scaleX,1.0/separation.scaleY);
	sca.setFromArray([amt,0,0, 0,amt,0, 0,0,1]);
	transform = Matrix.mult(sca,transform);
	return {affine:transform, decay:scaler, ratio:ratio, scale:((separation.scaleX+separation.scaleY)*0.5)};
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



