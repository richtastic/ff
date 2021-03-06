// ImageDescriptor.js
ImageDescriptor.SCALE_MULTIPLIER = 0.125;
ImageDescriptor.YAML = {
	FILENAME: "filename",
	CREATED: "created",
	FEATURES: "features",
	}
function ImageDescriptor(wid,hei, origR,origG,origB, filename){
	this._features = new Array();
	this._filename = null;
	this._width = 0;
	this._height = 0;
	this._flatRed = null;
	this._flatGrn = null;
	this._flatBlu = null;
	this._flatGry = new Array();
	this._sigma = 1.6;
	this.imageFileName(filename);
	this.setImageData(wid,hei, origR,origG,origB);
}
ImageDescriptor.fromImageFileStage = function(img,file,stage){
	var params = stage.getImageAsFloatRGB(img);
	var wid = params.width;
	var hei = params.height;
	var red = params.red;
	var grn = params.grn;
	var blu = params.blu;
	var gry = ImageMat.grayFromRGBFloat(red,grn,blu);
	var descriptor = new ImageDescriptor(wid,hei, red,grn,blu,gry, file);
	return descriptor;
}
ImageDescriptor.prototype.imageFileName = function(filename){
	if(filename!==undefined){
		this._filename = filename;
	}
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
ImageDescriptor.prototype.toYAML = function(yaml){
	var i, len, feature, DATA = ImageDescriptor.YAML;
	yaml.writeString(DATA.FILENAME,this._filename);
	yaml.writeString(DATA.CREATED,""+Code.getTimeStamp());
	yaml.writeArrayStart(DATA.FEATURES);
		len = this._features.length;
		for(i=0;i<len;++i){
			feature = this._features[i];
			yaml.writeObjectStart();
				feature.toYAML(yaml);
			yaml.writeObjectEnd();
		}
	yaml.writeArrayEnd();
}
ImageDescriptor.prototype.loadFromYAML = function(yaml){
	this.clearData();
	var i, len, feature, DATA = ImageDescriptor.YAML
	this._filename = yaml[DATA.FILENAME];
	var timestamp = yaml[DATA.CREATED];
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
ImageDescriptor.prototype.featureList = function(){
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
	console.log(this);
	var wid = this._width, hei = this._height;
	var arr = new Array();
	arr.push( (new ImageMat(wid,hei)).setFromFloats( ImageMat.getNormalFloat01(this._flatRed),ImageMat.getNormalFloat01(this._flatGrn),ImageMat.getNormalFloat01(this._flatBlu) ) );
	return arr;
}
ImageDescriptor.prototype.processScaleSpace = function(){ // this generates a list of potential scale-space points: _scaleSpaceExtrema
var images = [];
	Code.timerStart();
	var sourceImageData = this._flatGry;
//sourceImageData = this._flatRed;
//sourceImageData = this._flatGrn;
//sourceImageData = this._flatBlu;
	var i, j, k, ss, len, len2, pt, dist;
	var wid = this._width, hei = this._height;
	var sigma = 1.6; // this._sigma;
	var scalesPerOctave = 5; // 5
	var totalOctaves = 4; // 4
	var startScale = 1.0; // 2.0
	var minimumExtremaDistancePixels = 1.0; // single pixel
	var minThresholdIntensity = 0.01; // 0.03
	// var minEdgeDistance = 0.05;
	var edgeResponseEigenRatioR = 10.0; // 10.0
	edgeResponseEigenRatioR = Math.pow(edgeResponseEigenRatioR + 1, 2)/edgeResponseEigenRatioR; // convert to lowe equation // 12.1
	var kConstant = Math.pow(2.0,1.0/scalesPerOctave);
	var gaussSizeBase = 5;
	var gaussSizeIncrement = 1.5;
	var gauss1D, gaussSize;
	var currentWid = Math.round(startScale*wid), currentHei = Math.round(startScale*hei); //  first double size of image for +sized
	var currentImage = ImageMat.extractRect(sourceImageData, 0,0, wid-1,0, wid-1,hei-1, 0,hei-1, currentWid,currentHei, wid,hei);
	var prevImage, nextImage, nextWid, nextHei, dog, img, ext, sig, padding, tmp;
	var temp = new Array();
	var tempSets = new Array();
	var dogList = new Array();

//sigma = sigma * Math.pow(2.0,1.0/scalesPerOctave);

// presmooth
sig = 0.5;
gaussSize = gaussSizeBase*2+1;
gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sig);
padding = Math.floor(gaussSize/2.0);
tmp = ImageMat.padFloat(currentImage, currentWid,currentHei, padding,padding,padding,padding);
tmp = ImageMat.gaussian2DFrom1DFloat(tmp, currentWid+2.0*padding,currentHei+2.0*padding, gauss1D);
currentImage = ImageMat.unpadFloat(tmp, currentWid+2.0*padding,currentHei+2.0*padding, padding,padding,padding,padding);



var _vizWid = Math.floor(currentWid/Math.pow(2,totalOctaves));
var _vizHei = Math.floor(currentHei/Math.pow(2,totalOctaves));
var _vizMin = ImageMat.newZeroFloat(_vizWid,_vizHei);
var _vizMax = ImageMat.newZeroFloat(_vizWid,_vizHei);
ImageMat.addConst(_vizMax,-1E10);
ImageMat.addConst(_vizMin,1E10);
var _vizMinScale = ImageMat.newZeroFloat(_vizWid,_vizHei);
var _vizMaxScale = ImageMat.newZeroFloat(_vizWid,_vizHei);

	for(i=0;i<totalOctaves;++i){
//images.push( {"source":currentImage,"width":currentWid,"height":currentHei} );
		prevImage = currentImage;
		//console.log( "octave: "+(i+1)+"/"+totalOctaves+" ... size "+currentWid+", "+currentHei+" . . . . . . . . . . . . . . . . . . . . . . . . . . .");
		Code.emptyArray( dogList );
		for(j=0;j<scalesPerOctave;++j){
			// gaussian settings
			var currentScale = Math.pow(2, i + j/scalesPerOctave );
//			sig = sigma*Math.pow(kConstant,j);
//sig = sigma*kConstant*Math.pow(kConstant,j); // found A
//sig = sigma*Math.pow(2, j/scalesPerOctave );
//sig = sigma*Math.pow(2, j/(scalesPerOctave-1) );
//sig = sigma*Math.pow(2.0,j/kConstant);// ok
sig = sigma*Math.pow(2,j); //
//sig = sigma*Math.pow(kConstant,j);
//sig = sigma*Math.pow(2.0*kConstant,j);
//sig = sigma*Math.pow(2.0,j/scalesPerOctave); // no results
//sig = sigma*Math.pow(2.0,i+j/scalesPerOctave); // bad
			gaussSize = Math.round(gaussSizeBase + j*gaussSizeIncrement)*2+1;
			gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sig);//,       sig, true);
//console.log("EFFECTIVE SCALE: ("+i+","+j+") = "+currentScale," -- "+sig+"      "+gaussSize);
			// add padding for blur, then remove
			padding = Math.floor(gaussSize/2.0);
			tmp = ImageMat.padFloat(currentImage, currentWid,currentHei, padding,padding,padding,padding);
			tmp = ImageMat.gaussian2DFrom1DFloat(tmp, currentWid+2.0*padding,currentHei+2.0*padding, gauss1D);
			nextImage = ImageMat.unpadFloat(tmp, currentWid+2.0*padding,currentHei+2.0*padding, padding,padding,padding,padding);
			// difference of images
			//dog = ImageMat.subFloat(currentImage, nextImage);
			dog = ImageMat.subFloat(nextImage,prevImage);
//dog = ImageMat.gaussian2DFrom1DFloat(dog, currentWid,currentHei, gauss1D);
//ImageMat.normalFloat01(dog);
			dogList.push(dog);

			prevImage = nextImage
		}
// for(j=0;j<dogList.length;++j){
// 	var k,l;
// 	for(k=0;k<_vizHei;++k){
// 		for(l=0;l<_vizWid;++l){
// 			var index = k*_vizWid + l;
// 			var _i = Math.floor(l*currentWid/_vizWid);
// 			var _j = Math.floor(k*currentHei/_vizHei);
// 			var ind = _j*currentWid + _i;
// 			var val = dogList[j][ind];
// val = 0;
// 			// do actual summation averaging
// 			var count = Math.floor(currentWid/_vizWid);
// 			for(var ii=0;ii<count;++ii){
// 				for(var jj=0;jj<count;++jj){
// 					val += dogList[j][(_j+jj)*currentWid + (_i+ii)];
// 				}
// 			}
// 			val = val / (count*count);
// 			var inder = 0;
// 			var sca = Math.pow(2, i + (j/(dogList.length-2)) + 0.5*(inder+1.0)/(dogList.length-2) );
// val = Math.abs(val);
// 			if(_vizMax[index]<val){
// 				_vizMax[index] = val;
// 				_vizMaxScale[index] = sca;
// 			}
// 			if(_vizMin[index]>val){
// 				_vizMin[index] = val;
// 				_vizMinScale[index] = sca;
// 			}
// 		}
// 	}
// }
if(i==2){
	for(j=0;j<dogList.length;++j){
		var dogNorm = Code.copyArray(dogList[j]);

		dogNorm = ImageMat.normalFloat01(dogNorm);
		images.push( {"source":dogNorm,"width":currentWid,"height":currentHei} );
	}
}
		// find local extrema
		for(j=0;j<dogList.length-2;++j){ // interpolate exact location of extrema and throw away data below threshold
			ext = Code.findExtrema3D(dogList[j],dogList[j+1],dogList[j+2], currentWid,currentHei, 0);

			for(k=0;k<ext.length;++k){ // set sigma to absolute position based on relative position + iteration IN LINEAR SPACE
if(i==2){
	var index = Math.floor(ext[k].y)*currentWid + Math.floor(ext[k].x);
	images[j]["source"][index] += 2.0;
}
				ext[k].x /= currentWid;
				ext[k].y /= currentHei;
				ext[k].z = Math.pow(2, i + j/scalesPerOctave + ext[k].z/scalesPerOctave ) / startScale;
				ext[k].t = Math.abs(ext[k].t); // look at minima and maxima
				var intensity = ext[k].t;
				if(intensity>=minThresholdIntensity){
					temp.push(ext[k]);
				}
			}
		}

		// subsample image for next octave
		if(i<totalOctaves-1){
			nextWid = Math.floor(currentWid*0.5); nextHei = Math.floor(currentHei*0.5);
ss = prevImage; // ss is blurry
//ss = currentImage;
			currentImage = ImageMat.extractRect(ss, 0,0, currentWid-1,0, currentWid-1,currentHei-1, 0,currentHei-1, nextWid,nextHei, currentWid,currentHei);
			currentWid = nextWid; currentHei = nextHei;
		}
	}
	// copy points over to single array
	this._clearFeatureList();
	console.log("     original count: "+temp.length);
	temp.sort( function(a,b){ return Math.abs(b.t) - Math.abs(a.t) ;} );
	// remove duplicates
	for(i=0;i<temp.length;++i){
		for(j=i+1;j<temp.length;++j){
			dist = Code.distancePoints2D(temp[i].x*this._width,temp[i].y*this._height, temp[j].x*this._width,temp[j].y*this._height);
			if(dist < minimumExtremaDistancePixels ){ // keep highest contrast point
				if(temp[i].t>temp[j].t){ // keep j
					temp[i] = temp[j];
				} // keep i
				Code.removeElementAtSimple(temp,j);
				--j;
			}
		}
	}
//	Code.truncateArray(temp,1000);

	console.log("       rm-dup count: "+temp.length);
	// get exact SMM at location and discard low measures
	var Lxx, Lxx, Lxy, tra, det, measure, win, winSize = 25;// (11+1)*2+1
	var featureImageSizeBase = 7;
	var rangeSize;
	var gauss = 1.6;
	var gauss1D = ImageMat.getGaussianWindow(11,1, sigma);
	var center = Math.floor(winSize*0.5);
	var index = center*winSize + center;
	var range, response, intensity;
	var minContrastIntensity = 0.01;
	for(i=0;i<temp.length;++i){
		var s = Math.pow(temp[i].z,0.5);
		// too close to edge
		//
		// low contrast
		rangeSize = Math.floor(featureImageSizeBase*s*sigma);
		win = this.getScaleSpacePoint(temp[i].x,temp[i].y,temp[i].z,null, rangeSize,rangeSize, null);
		range = ImageMat.getRange(win);
		if(range<minContrastIntensity){
			Code.removeElementAtSimple(temp,i);
			--i; continue;
		}
		//
		//win = this.getScaleSpacePoint(temp[i].x,temp[i].y,temp[i].z,null, winSize,winSize, null); // zoom in
		//win = ImageMat.gaussian2DFrom1DFloat(win, winSize,winSize, gauss1D); // gaussian
		Lxx = ImageMat.secondDerivativeX(win,winSize,winSize, center,center);
		Lyy = ImageMat.secondDerivativeY(win,winSize,winSize, center,center);
		Lxy = ImageMat.secondDerivativeXY(win,winSize,winSize, center,center);
		tra = Lxx + Lyy;
		det = Lxx*Lyy - Lxy*Lxy;
		measure = tra*tra/det;
		//intensity = Math.abs(temp[i].t);
		//response = Lxx + Lyy;
//measure = edgeResponseEigenRatioR;
		// low edge response
		if(measure >= edgeResponseEigenRatioR){ // drop if high measure
			Code.removeElementAtSimple(temp,i);
			--i; continue;
		// low LoG response
		}/*else if(intensity<minThresholdIntensity){
			Code.removeElementAtSimple(temp,i);
			--i; continue;
		} // keep*/
		temp[i].t = Math.abs(measure);
	}
	console.log(" contrast/SMM count: "+temp.length);
	// sort on extrema value
	temp.sort(function(a,b){ if(a.t<b.t){return 1;}else if(a.t>b.t){return -1;} return 0; }); //
	len = temp.length;
	//len = Math.min(temp.length,300);
	for(i=0;i<len;++i){
		this._features.push( new ImageFeature(temp[i].x,temp[i].y,temp[i].z,temp[i].t,null) );
	}
	Code.emptyArray(temp);
	Code.timerStop();
	console.log("  scale space count: "+this._features.length);
	console.log( "time: "+Code.timerDifferenceSeconds() );
	//
_zMin = _vizMin;
_zMax = _vizMax;
_vizMin = _vizMinScale;
_vizMax = _vizMaxScale;

var _peaksMin = ImageMat.getPeaks(_vizMin, _vizWid,_vizHei);
var _peaksMax = ImageMat.getPeaks(_vizMax, _vizWid,_vizHei);
var _peaks = [];

/*
this._clearFeatureList();
var scaleX = 1.0/_vizWid;//this._width;///_vizWid;
var scaleY = 1.0/_vizHei;

for(i=0;i<_peaksMin.length;++i){
	index = Math.round(_peaksMin[i].y)*_vizWid + Math.round(_peaksMin[i].x);
	//if(_zMin[index]<-0.03){
	if(true){
		_peaks.push(_peaksMin[i]);
var sca = _vizMin[index]*0.2;
this._features.push( new ImageFeature(_peaksMin[i].x*scaleX,_peaksMin[i].y*scaleY,sca,null) );
	}
}
for(i=0;i<_peaksMax.length;++i){
	index = Math.round(_peaksMax[i].y)*_vizWid + Math.round(_peaksMax[i].x);
	//if(true){//_peaksMax[i].value>0){//_zMax[index]>0.03){
	//if(_zMax[index]>0.03){
	if(true){
		_peaks.push(_peaksMax[i]);
//console.log(_peaksMax[i].x,_peaksMax[i].y);
var sca = _vizMax[index]*0.2;
this._features.push( new ImageFeature(_peaksMax[i].x*scaleX,_peaksMax[i].y*scaleY,sca,null) );
	}
}
for(i=0;i<_peaks.length;++i){
	_peaks[i].x *= 4;
	_peaks[i].y *= 4;
}
*/
	_vizMax = ImageMat.normalFloat01(_vizMax);
	_vizMin = ImageMat.normalFloat01(_vizMin);
	_vizMin = ImageMat.invertFloat01(_vizMin);
// _vizMin = ImageMat.addFloat(_vizMin,_vizMax);
// _vizMin = ImageMat.normalFloat01(_vizMin);
	return {"images":images,"viz":[{"source":_vizMin,"width":_vizWid,"height":_vizHei}, {"source":_vizMax,"width":_vizWid,"height":_vizHei}],
"scalePeaks":_peaks};
}

ImageDescriptor.prototype.processCornerSpace = function(){
	Code.timerStart();
	var i, j, k, ss, len, len2, pt, dist, index, peak;
	var wid = this._width, hei = this._height;
	var gray = this._flatGry;
	//var winSize = 7;
	var sigma = 0.7;
	var k = 0.04; // 0.03 ~ 0.05
	var minThresholdPercent = 0.01; // 0.10
	var minThresh = null;
	var maxThresh = null;
	var gaussWin = ImageMat.gaussianWindow1DFromSigma(sigma);
gray = ImageMat.gaussian2DFrom1DFloat(gray, wid,hei, gaussWin);
	var dx = ImageMat.convolve(gray,wid,hei, [-1,1], 2,1);
	var dy = ImageMat.convolve(gray,wid,hei, [-1,1], 1,2);
	var dxx = ImageMat.mulFloat(dx,dx);
	var dyy = ImageMat.mulFloat(dy,dy);
	var dxy = ImageMat.mulFloat(dx,dy);
	var mxx = ImageMat.gaussian2DFrom1DFloat(dxx, wid,hei, gaussWin);
	var myy = ImageMat.gaussian2DFrom1DFloat(dyy, wid,hei, gaussWin);
	var mxy = ImageMat.gaussian2DFrom1DFloat(dxy, wid,hei, gaussWin);
	//var R = new ImageMat(wid,hei);
	var R = ImageMat.newZeroFloat(wid,hei);//Code.newArrayZero(wid*hei);
	//gaussSource = ImageMat.padFloat(src, wid,hei, padding,padding,padding,padding);
	//gaussSource = ImageMat.gaussian2DFrom1DFloat(gaussSource, wid+2*padding,hei+2*padding, gauss1D);
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i){
			index = j*wid + i;
			var m00 = mxx[index];
			var m01 = mxy[index];
			var m10 = mxy[index];
			var m11 = mxy[index];
			var tra = m00 * m11;
			var det = m00*m11 - m01*m10;
			R[index] = det - k*tra*tra;
		}
	}
	/*
	// peak 1
	var L = [];
	var peaks = ImageMat.newZeroFloat(wid,hei);
	var indexL = 0;
	for(j=1;j<hei-1;++j){
		for(i=1;i<wid-1;++i){
			index = j*wid + i;
			var _a = R[(j-1)*wid + (i-1)];
			var _b = R[(j-1)*wid + (i  )];
			var _c = R[(j-1)*wid + (i+1)];
			var _d = R[(j  )*wid + (i-1)];
			var _e = R[(j  )*wid + (i  )];
			var _f = R[(j  )*wid + (i+1)];
			var _g = R[(j-1)*wid + (i-1)];
			var _h = R[(j-1)*wid + (i  )];
			var _i = R[(j-1)*wid + (i+1)];
			var r = _e;
			if(minThresh==null||r<minThresh){
				minThresh = r;
			}
			if(maxThresh==null||r>maxThresh){
				maxThresh = r;
			}
			if(r==Math.max(_a,_b,_c,_d,_e,_f,_g,_h,_i)){
				L.push({"x":i,"y":j,"value":r});
				++indexL;
			}
			++indexL;
		}
	}
	// group peaks into regions
	*/
	// peak 2
	var peaks = [];
	var L = ImageMat.getPeaks(R, wid,hei);
	for(i=0;i<L.length;++i){
		peak = L[i];
		if( 1<peak.x&&peak.x<wid-1 && 1<peak.y&&peak.y<hei-1){
			r = peak.value;
			if(minThresh==null||r<minThresh){
				minThresh = r;
			}
			if(maxThresh==null||r>maxThresh){
				maxThresh = r;
			}
		}
	}
	var minThresholdValue = maxThresh*minThresholdPercent;
	for(i=0;i<L.length;++i){
		peak = L[i];
		if(peak.value>minThresholdValue && 1<peak.x&&peak.x<wid-1 && 1<peak.y&&peak.y<hei-1){
			peaks.push(peak);
		}
	}

	// for(i=0;i<peaks.length;++i){
	// 	var peak = peaks[i];
	// 	console.log(peak.value);
	// 	if(Math.abs(peak.value)<1E-6){
	// 		Code.removeElementAtSimple(peaks,i);
	// 		--i; continue;
	// 	}
	// }

	Code.timerStop();
	console.log("  corner space count: "+this._features.length);
	console.log( "time: "+Code.timerDifferenceSeconds() );
	//console.log(peaks.length);
	return peaks;
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
try{
		pt = new V3D(startPoints[k].x(),startPoints[k].y(),startPoints[k].scale()); // initial interest point
console.log(pt.toString());
		obj = this.detectPoint(pt);
		console.log(obj)
		if(obj){
			feature = new ImageFeature(obj.point.x,obj.point.y,obj.point.z, 0.0, obj.affine);
			endPoints.push(feature);
		}
}catch(e){
	console.log(e);
}finally{
	//
}
	}
// drop low-contrast points
// drop points at edge of window
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
		feature.findDescriptor(this._flatRed,this._flatGrn,this._flatBlu,this._flatGry, this._width,this._height, 0);
	}
	Code.timerStop();
	console.log( "time: "+Code.timerDifferenceSeconds() );
}
// ImageDescriptor.prototype.compareFeatures = function(){ // this finds best-matching lists for each featuring
// 	var list = this._features;
// 	var i, len=list.length;
// 	for(i=0;i<len;++i){
// 		for(j=i+1;j<len;++j){
// 			ImageFeature.compareFeatures(list[i],list[j]);
// 		}
// 	}
// }
ImageDescriptor.prototype.dropNonUniqueFeatures = function(){
	var matcher = new ImageMatcher();
	matcher.matchDescriptors(this,this);
	var i, j;
	var features = this._features;
	console.log("FEATURE COUNT A: "+features.length);
	// for(i=0;i<features.length;++i){
	// 	var f = features[i];
	// 	var matches = f._pointList;
	// 	for(j=0;j<matches.length;++j){
	// 		var m = matches[j];
	// 		var score = m[1];
	// 		if(score<30){ // should be based on some distribution stdev
	// 			Code.removeElementAtSimple(features,i);
	// 			--i;
	// 			break;
	// 		}
	// 		break;
	// 	}
	// }
	var fiftyPercent = Math.max(Math.round(features.length*0.50),50);
	features.sort( function(a,b){ return b._pointList[0][1] - a._pointList[0][1]; } );
	Code.truncateArray(features,fiftyPercent);
	console.log("FEATURE COUNT B: "+features.length);

	for(i=0;i<features.length;++i){
		// drop low contrast points
		//console.log( features[i].contrastSSDScore() );
		if(features[i].contrastSSDScore() < 0.10){
			Code.removeElementAtSimple(features,i);
			--i;
		}
	}

	matcher.kill();
}


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
	var sigma = this._sigma
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

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ImageDescriptor.prototype.detectPoint1 = function(inPoint){
	// inPoint.z = 1.0;
	var i, j, len, sigma, val;
	var sourceGry = this._flatGry;
	var sourceWid = this._width;
	var sourceHei = this._height;
	var v = new V2D(), x = new V3D(); x.copy(inPoint);
	var winWid = winHei = 51;
	var u = new Matrix(2,2);
	var transformInverse, transform = new Matrix(3,3); transform.identity();
	var maxIterations = 30;
	var winList = new Array(), pointList = new Array(), eigenList = new Array();
	var sigmaI = this._sigma, sigmaD = this._sigma*0.7;
	var decay = 1.0, decayRate = 1.0;//0.95;
	var ratio = 2.0, prevRatio = 2.0;
	// 1. initialize U_0 to identity matrix
	for(i=0;i<maxIterations;++i){
		pointList.push( new V3D(x.x,x.y,x.z) );
		// 2. normalize window W(x_w) = I(x) centered on U_k-1 * x_w_k-1 = x_w_k-1
		sigma = null;
		W = ImageMat.extractRectFromFloatImage(x.x,x.y,x.z,sigma, winWid,winHei, sourceGry,sourceWid,sourceHei, transform);
		winList.push( ImageMat.extractRectFromFloatImage(x.x,x.y,x.z*0.25,sigma, winWid,winHei, sourceGry,sourceWid,sourceHei, transform) );
		// 3. select integration scale sigma_I at point x_w_k-1 [characteristic scale]
		// val = this.getScaleSpaceInfo(x.x,x.y,x.z, transform);
		// if(val.hasMax){
		// 	x.z += (val.maxScale-x.z)*0.5;
		// 	sigmaI += (val.maxSigma-sigmaI)*0.5;
		// }
		// 4. select differentiation scale sigma_D = s*sigma_I, which maximizes (lambda_min(u)/lambda_max(u)) with s in [0.5,...0.75] and u = u(x_w_k-1,sigma_I,sigma_D)
		val = this.getEigenMaxDiffScale(W,winWid,winHei, sigmaI, 0.05,0.75,5); // 0.5,10.0,30);// 0.5,0.7,4
		sigmaD = val.sigmaD;
		// 5. detect spatial localization x_w_k of a maximum of the Harris measure [det(u(x,sI,sD))-alpha*tra^2(u(x,sI,sD))], nearest to x_w_k-1 and compute the location of the interest point x_k
 		//val = this.getClosestHarrisMaxima(W,winWid,winHei, sigmaI, sigmaD);
		// 6. compute u_i_k = [u(x_w_k,sI,sD)]^(-1/2)
		u = this.getMewFromWin(W,winWid,winHei, sigmaI, sigmaD);
		// 7. concatenate transformation U_k = u_i_k * U_k-1 and normalize U_k to lambaMax(U_k) =
		val = this.getAffineIncrementFromMew(u,transform, decay,decayRate, eigenList);
		transform = val.affine;
		decay = val.decay;
		prevRatio = ratio;
		ratio = val.ratio;
		// 5. (spatial localization: immediate neighbor with higher ss-extrema value)
		//val = this.getClosestScaleSpaceMaxima(x.x,x.y,x.s,transform);
		val = this.getClosestHarrisMaxima(W,winWid,winHei, sigmaI,sigmaD);
		var off = val.offset;
		if(ratio<2.0){
			transformInverse = Matrix.inverse(transform);
			off.x *= x.z; off.y *= x.z; // scale to window scale
			transformInverse.multV2DtoV2D(v, off); // reverse transform to actual (zoomed) image location
			v.x = x.x + v.x/sourceWid; v.y = x.y + v.y/sourceHei; // relative sizing
			if(v.x>0 && v.x<1 && v.y>0 && v.y<1){
				x.x = v.x; x.y = v.y; // goto next position
			}
		}
		if( (ratio-1.0)<=1E-4 ){ // converged
			console.log("converged");
			break;
		}
	}
console.log("............");
	return {windows:winList, width:winWid, height:winHei, points:pointList, eigens:eigenList,   affine:transform, point:x };
}
ImageDescriptor.prototype.detectPoint = function(inPoint){
	var i, j, len, sigma, val;
	var sourceGry = this._flatGry;
	var sourceWid = this._width;
	var sourceHei = this._height;
	var v = new V2D(), x = new V3D(); x.copy(inPoint);
	var winWid = winHei = 51;
	var u = new Matrix(2,2);
	var transformInverse, transform = new Matrix(3,3); transform.identity();
	var maxIterations = 30;
	var winList = new Array(), pointList = new Array(), eigenList = new Array();
	var sigmaI = this._sigma, sigmaD = this._sigma*0.7;
	var decay = 1.0, decayRate = 1.0;//0.95;
	var ratio = 1E9, prevRatio = 1E9;
var totalScale = 1.0;
console.log("............ detect point");
var taves = ['r--','g--','b--','m--','k--','r-*','g-*','b-*','m-*','k-*','r-^','g-^','b-^','m-^','k-^','r-o','g-o','b-o','m-o','k-o','r-+','g-+','b-+','m-+','k-+','r-x','g-x','b-x','m-x','k-x','r-@','g-@','b-@','m-@','k-@'];
var octave = "hold off;\n";
var octave2 = "hold off;\n";
var octave3 = "hold off;\n";
octC = "iterations = [";
octD = "ratios = [";
var prevTransform = new Matrix(3,3);
var prevPoint = new V3D();
	// 1. initialize U_0 to identity matrix
	for(i=0;i<maxIterations;++i){
		prevTransform.copy(transform);
		prevPoint.copy(x);
		pointList.push( new V3D(x.x,x.y,x.z) );
		// 2. normalize window W(x_w) = I(x) centered on U_k-1 * x_w_k-1 = x_w_k-1
		sigma = null;
		W = ImageMat.extractRectFromFloatImage(x.x,x.y,x.z,sigma, winWid,winHei, sourceGry,sourceWid,sourceHei, transform);
		winList.push( ImageMat.extractRectFromFloatImage(x.x,x.y,x.z*0.25,sigma, winWid,winHei, sourceGry,sourceWid,sourceHei, transform) );
		// 3. select integration scale sigma_I at point x_w_k-1 [characteristic scale]
		val = this.getScaleSpaceInfo(x.x,x.y,x.z, transform);
		if(val.hasMax){
			x.z += (val.maxScale-x.z)*0.9995;
			sigmaI += (val.maxSigma-sigmaI)*0.9995;
		}
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
octave += "sleep(0.05);\n";
octave += "semilogx(scales,values,\""+taves[i]+"\");\n"; // semilogx
octave += "hold on;\n";
		// 4. select differentiation scale sigma_D = s*sigma_I, which maximizes (lambda_min(u)/lambda_max(u)) with s in [0.5,...0.75] and u = u(x_w_k-1,sigma_I,sigma_D)
		val = this.getEigenMaxDiffScale(W,winWid,winHei, sigmaI, 0.05,0.75,5); // 0.5,10.0,30);// 0.5,0.7,4
		sigmaD = val.sigmaD;
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
octave2 += "plot(scales,ratios,\""+taves[i]+"\");\n"; // semilogx
octave2 += "hold on;\n";
		// 5. detect spatial localization x_w_k of a maximum of the Harris measure [det(u(x,sI,sD))-alpha*tra^2(u(x,sI,sD))], nearest to x_w_k-1 and compute the location of the interest point x_k
// 		val = this.getClosestHarrisMaxima(W,winWid,winHei, sigmaI, sigmaD);
// winList.push(val.image);
// 		var off = val.offset;
// 		if(off!=null && false){ // maxima exists nearby -------- thos shoots it all around depending on the scale
// 			transformInverse = Matrix.inverse(transform);
// 			transformInverse.multV2DtoV2D(v, off); // reverse transform to actual (zoomed) image location
// 			v.x /= x.z; v.y /= x.z; // scale to window scale
// 			v.x = x.x + v.x/sourceWid; v.y = x.y + v.y/sourceHei; // relative sizing
// 			if(v.x>0 && v.x<1 && v.y>0 && v.y<1){
// 				console.log("moving: "+(x.x*sourceWid)+","+(x.y*sourceHei)+"  =>  "+(v.x*sourceWid)+","+(v.y*sourceHei)+" ");
// 				x.x = v.x; x.y = v.y; // goto next position
// 			}
// 		}
		// 6. compute u_i_k = [u(x_w_k,sI,sD)]^(-1/2)
		u = this.getMewFromWin(W,winWid,winHei, sigmaI, sigmaD);
		// 7. concatenate transformation U_k = u_i_k * U_k-1 and normalize U_k to lambaMax(U_k) =
		val = this.getAffineIncrementFromMew(u,transform, decay,decayRate, eigenList);
if(i>0){
transform = val.affine;
}
		// transform = val.affine;
		decay = val.decay;
		prevRatio = ratio;
		ratio = val.ratio;
// if(ratio>prevRatio){
// 	console.log("RATIO CHANGE: "+ratio+"  "+prevRatio);
// 	transform.copy(prevTransform);
// 	x.copy(prevPoint);
// 	ratio = prevRatio;
// 	break;
// }
// 5. (spatial localization: immediate neighbor with higher ss-extrema value)
		//val = this.getClosestScaleSpaceMaxima(x.x,x.y,x.s,transform);
		val = this.getClosestHarrisMaxima(W,winWid,winHei, sigmaI,sigmaD);
		var off = val.offset;
		if(ratio<2.0){
			transformInverse = Matrix.inverse(transform);
			off.x *= x.z; off.y *= x.z; // scale to window scale
			transformInverse.multV2DtoV2D(v, off); // reverse transform to actual (zoomed) image location
			v.x = x.x + v.x/sourceWid; v.y = x.y + v.y/sourceHei; // relative sizing
			if(v.x>0 && v.x<1 && v.y>0 && v.y<1){
				x.x = v.x; x.y = v.y; // goto next position
			}
		}

		//console.log(ratio);
		//console.log(x.z/val.scale, x.z,val.scale);
octC += i+" ";
octD += ratio+" ";
		// 8. go to step 2 if 1 - lambdaMin(u_i_k)/lambdaMax(u_i_k) >= epsilonC
		if( (ratio-1.0)<=1E-4 ){ // converged
		//if( (ratio-1.0)<=0.1 && (prevRatio-1.0)<=0.1 ){ // converged
			console.log("converged");
			break;
		}
if(i>0){
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

// if(ratio>2.0){
// 	return null;
// }
// if(ratio-1.0 > 0.5){
// 	return null;
// }

	// NEED TO EXTRACT ACTUAL SCALE FOR POINT
	var sep = Code.separateAffine2D( transform.get(0,0),transform.get(0,1),transform.get(1,0),transform.get(1,1), transform.get(1,2),transform.get(1,2) );
	transform = Matrix.transform2DScale(transform,1/sep.scale);
	x.z /= sep.scale;
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
		measure[i] = Math.abs(det - alpha*tra*tra);
	}
	var c0,c1,c2,c3,c4,c5,c6,c7,c8;
	c0 = measure[winWid*(cenY-1)+(cenX-1)];
	c1 = measure[winWid*(cenY-1)+(cenX  )];
	c2 = measure[winWid*(cenY-1)+(cenX+1)];
	c3 = measure[winWid*(cenY  )+(cenX-1)];
	c4 = measure[winWid*(cenY  )+(cenX  )];
	c5 = measure[winWid*(cenY  )+(cenX+1)];
	c6 = measure[winWid*(cenY+1)+(cenX-1)];
	c7 = measure[winWid*(cenY+1)+(cenX  )];
	c8 = measure[winWid*(cenY+1)+(cenX+1)];
	var str = "";
	str += (c0>c4)?"+":"-";
	str += " ";
	str += (c1>c4)?"+":"-";
	str += " ";
	str += (c2>c4)?"+":"-";
	str += "\n";
	str += (c3>c4)?"+":"-";
	str += " ";
	str += "x";
	str += " ";
	str += (c5>c4)?"+":"-";
	str += "\n";
	str += (c6>c4)?"+":"-";
	str += " ";
	str += (c7>c4)?"+":"-";
	str += " ";
	str += (c8>c4)?"+":"-";
	str += "\n";
	//console.log(str);
	var o = new V2D(0,0);
	Code.gradient2D(o,c0,c1,c2,c3,c4,c5,c6,c7,c8);
	return {offset:o, delta:(o.x!=0&&o.y!=0)};
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
	var max = Code.findGlobalExtrema1D(ratios).max
	Code.findGlobalExtrema1DSecondary(max,scales);
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
	var u = (new Matrix(2,2)).fromArray(smm);
	return u;
}
ImageDescriptor.prototype.getClosestScaleSpaceMaxima = function(x,y,s, transform){
	transform = transform!==undefined?transform:null;
	var gray = this._flatGry, wid = this._width, hei = this._height;
	var values = [], scales = [], images = [];
	var minScale = 0.0325, maxScale = 2.0, exponent = 2; // 0.25, 4.0
	var divisions = 24; // 16-32
	var minExp = Math.log(minScale)/Math.log(exponent);
	var maxExp = Math.log(maxScale)/Math.log(exponent);
	var diffExp = maxExp - minExp;
	var win, windowWid, windowHei;
	var sca = 1.0, sigma = this._sigma;
	var sigmaSquare = sigma*sigma;
	var gaussSize = Math.round(5 + sigma*2.0)*2+1;
	var cenX, cenY, Lxx, Lyy, value;
	var i;
	var c0,c1,c2,c3,c4,c5,c6,c7,c8;
	for(i=0;i<9;++i){ // datum
		values[i] = [];
	}
	for(i=0;i<=divisions;++i){
		sca = Math.pow(2, minExp + diffExp*(i/divisions) );
		windowHei = windowWid = Math.floor(gaussSize*2.5); // 2-3
		if(windowHei%2==0){ windowHei++; windowWid++; } // odd sized
		win = ImageMat.extractRectFromFloatImage(x,y,sca,sigma, windowWid,windowHei, gray,wid,hei, transform);
		cenX = Math.floor(windowWid*0.5);
		cenY = Math.floor(windowHei*0.5);
		win = Code.subArray2D(win,windowWid,windowHei, cenX-2,cenX+2, cenY-2,cenY+2);
		Lxx = ImageMat.secondDerivativeX(win, 5,5);
		Lyy = ImageMat.secondDerivativeY(win, 5,5);
		scales.push(sca);
		values[0].push( sigmaSquare*Math.abs(Lxx[ 6] + Lyy[ 6]) );
		values[1].push( sigmaSquare*Math.abs(Lxx[ 7] + Lyy[ 7]) );
		values[2].push( sigmaSquare*Math.abs(Lxx[ 8] + Lyy[ 8]) );
		values[3].push( sigmaSquare*Math.abs(Lxx[11] + Lyy[11]) );
		values[4].push( sigmaSquare*Math.abs(Lxx[12] + Lyy[12]) );
		values[5].push( sigmaSquare*Math.abs(Lxx[13] + Lyy[13]) );
		values[6].push( sigmaSquare*Math.abs(Lxx[16] + Lyy[16]) );
		values[7].push( sigmaSquare*Math.abs(Lxx[17] + Lyy[17]) );
		values[8].push( sigmaSquare*Math.abs(Lxx[18] + Lyy[18]) );
	}
	c0 = Code.findGlobalExtrema1D(values[0]).max.y;
	c1 = Code.findGlobalExtrema1D(values[1]).max.y;
	c2 = Code.findGlobalExtrema1D(values[2]).max.y;
	c3 = Code.findGlobalExtrema1D(values[3]).max.y;
	c4 = Code.findGlobalExtrema1D(values[4]).max.y;
	c5 = Code.findGlobalExtrema1D(values[5]).max.y;
	c6 = Code.findGlobalExtrema1D(values[6]).max.y;
	c7 = Code.findGlobalExtrema1D(values[7]).max.y;
	c8 = Code.findGlobalExtrema1D(values[8]).max.y;
	var str = "";
	str += (c0>c4)?"+":"-";
	str += " ";
	str += (c1>c4)?"+":"-";
	str += " ";
	str += (c2>c4)?"+":"-";
	str += "\n";
	str += (c3>c4)?"+":"-";
	str += " ";
	str += "x";
	str += " ";
	str += (c5>c4)?"+":"-";
	str += "\n";
	str += (c6>c4)?"+":"-";
	str += " ";
	str += (c7>c4)?"+":"-";
	str += " ";
	str += (c8>c4)?"+":"-";
	str += "\n";
	//console.log(str);
	var o = new V2D(0,0);
	Code.gradient2D(o,c0,c1,c2,c3,c4,c5,c6,c7,c8);
	return {offset:o, delta:(o.x!=0&&o.y!=0)};
}
/*
@ sca=0.25:
@ sca=0.5:  is basically blurred
@ sca=1.0:  base image
@ sca=2.0:
@ sca=4.0: is sub-sapled


WHAT DOES SIFT scale space translate to ?
	- small single point
	-

*/
/* speed up:
precalculate windows
fewer division
dynamic window - to only search in specified scale
*/
ImageDescriptor.prototype.getScaleSpaceInfo = function(x,y,s, transform){ // basic from mikolajczyk
	transform = transform!==undefined?transform:null;
	var gray = this._flatGry, wid = this._width, hei = this._height;
	var values = [], scales = [], sigmas = [], images = [];
	var minScale = 0.03125, maxScale = 4.0, exponent = 2.0; // 0.25, 4.0 | 0.015625 0.03125 0.0625 0.125 0.25 0.5 1.0 2.0 4.0 8.0
	var sigmaBase = this._sigma;
	var minExp = Math.log(minScale)/Math.log(exponent);
	var maxExp = Math.log(maxScale)/Math.log(exponent);
	var divCount = 4;
	var divisions = (maxExp-minExp)*divCount;
	var diffExp = maxExp - minExp;
	var exp;
	var win, windowWid, windowHei;
	var sca = 1.0, sigma = this._sigma;
	var sigmaSquare = sigma*sigma;
	var gaussSize = Math.round(5 + sigma*2.0)*2+1;
	var cenX, cenY, Lxx, Lyy, Lxy, value;
	var i;
	for(i=0;i<=divisions;++i){
		exp = minExp + diffExp*(i/divisions);
		sca = Math.pow(2, exp );
		sigma = sigmaBase;//*(1.0+0.1*i);//
		// Math.pow(2, minExp + diffExp*(i/divisions) );// * ();
		// (1.0+Code.remainderFloat(exp,1.0)); // remainder
		gaussSize = Math.round(5 + sigma*2.0)*2+1;
		windowHei = windowWid = Math.floor(gaussSize*2) + 1;
//console.log(gaussSize,sigma);
		win = ImageMat.extractRectFromFloatImage(x,y,sca,sigma, windowWid,windowHei, gray,wid,hei, transform);
		//win = ImageMat.gaussian2DFrom1DFloat(win, windowWid,windowHei, gauss1D);
		cenX = Math.floor(windowWid*0.5);
		cenY = Math.floor(windowHei*0.5);
		win = Code.subArray2D(win,windowWid,windowHei, cenX-1,cenX+1, cenY-1,cenY+1);
		Lxx = ImageMat.secondDerivativeX(win, 3,3); // Lxx = ImageMat.secondDerivativeX(win, windowWid,windowHei);
		Lyy = ImageMat.secondDerivativeY(win, 3,3); // Lyy = ImageMat.secondDerivativeY(win, windowWid,windowHei);
		Lxy = ImageMat.secondDerivativeXY(win, 3,3);
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
		Lxy = Lxy[4];

		value = Math.abs(Lxx + Lyy); // sigmaSquare*
var tra = (Lxx+Lyy);
var det = Lxx*Lyy - Lxy*Lxy;
var alpha = 0.05;
//value = Math.abs(tra*tra/det);
//value = Math.abs(det - alpha*tra*tra);
		scales.push(sca);
		sigmas.push(sigma);
		values.push(value);
	}
	// SCALE
	Code.trimMaxEnds(values,scales);
	var value1 = Code.findGlobalExtrema1D(values, true);
	value1 = value1.max;
	var hasMax = value1!=null;
	if(!value1){
		value1 = new V2D(maxScale,0);
	}else{
		Code.findGlobalExtrema1DSecondary(value1,scales);
	}

	// SIGMA
	// Code.trimMaxEnds(values,scales);
	// var value2 = Code.interpolateExtrema(sigmas,values, true);
	// value2 = value2.max;
	// var hasMax = value2!=null;
	// if(!value2){
	// 	value2 = new V2D(sigmaBase,0);
	// }
	return {values:values, scales:scales, images:images, width:windowWid, height:windowHei, maxScale:value1.x, maxSigma:sigma, max:value1.y, hasMax:hasMax}; // constant sigma
	//return {values:values, scales:sigmas, images:images, width:windowWid, height:windowHei, maxScale:sca, maxSigma:value2.x, max:value2.y, hasMax:hasMax}; // constant scale
	//return {values:values, scales:scales, images:images, width:windowWid, height:windowHei, maxScale:value1.x, maxSigma:value2.x, max:value1.y, hasMax:hasMax};
}

ImageDescriptor.prototype.getAffineIncrementFromMew = function(u,transform, scaler,decayRate, eigenList){
	var cum = new Matrix(3,3), rot = new Matrix(3,3), sca = new Matrix(3,3);
	var eig = Matrix.eigenValuesAndVectors(u);
	var vectorY = new V2D(0,1), vectorMin = new V2D(0,0), vectorMax = new V2D(0,0);
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
	rot.fromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1.0]);
	cum = Matrix.mult(cum,rot);
	amt = Math.pow(ratio,0.25*scaler); // stable points



	//amt = Math.pow(ratio,0.10*scaler); // stable points
	//amt = Math.pow(Math.pow(ratio,0.25),0.25*scaler); // unstable points
	//amt = Math.pow(Math.pow(ratio,0.25),0.25*scaler); // unstable points
	console.log("amt: "+amt+"            ("+ratio+")");

	//amt = Math.pow(ratio,0.05*scaler);
	scaler *= decayRate;
	sca.fromArray([amt,0,0, 0,1.0,0, 0,0,1.0]);
	cum = Matrix.mult(cum,sca);
	ang = angleYMax;
	rot.fromArray([Math.cos(ang),Math.sin(ang),0, -Math.sin(ang),Math.cos(ang),0, 0,0,1.0]);
	cum = Matrix.mult(cum,rot);
	transform = Matrix.mult(tra,cum);
	// preoportional scalre restoring
	var separation = Code.separateAffine2D( transform.get(0,0),transform.get(0,1),transform.get(1,0),transform.get(1,1), transform.get(1,2),transform.get(1,2) );
	//console.log("SEPARATED: "+separation.scaleX+" "+separation.scaleY);
	if(separation.scaleX<separation.scaleY){
		amt = 1/separation.scaleX;
		sca.fromArray([amt,0,0, 0,1.0,0, 0,0,1]);
	}else{
		amt = 1/separation.scaleY;
		sca.fromArray([1.0,0,0, 0,amt,0, 0,0,1]);
	}
	amt = 1.0/(separation.scaleX+separation.scaleY)*0.5;
	//amt = Math.max(1.0/separation.scaleX,1.0/separation.scaleY);
	sca.fromArray([amt,0,0, 0,amt,0, 0,0,1]);
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
