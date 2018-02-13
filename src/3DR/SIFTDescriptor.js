// SIFTDescriptor.js
SIFTDescriptor.BIN_COUNT = 8;
SIFTDescriptor.BIN_COUNT_OVERALL = 36;
//SIFTDescriptor.BIN_NORMALIZE_MAX = 0.50; // 0.20
//SIFTDescriptor.BIN_OVERALL_THRESHOLD_MAX = 0.80; // 0.80
SIFTDescriptor.GAUSSIAN_BLUR_GRADIENT = 1.0;
SIFTDescriptor.DESCRIPTOR_SCALE = 8.0; // increase window to N * radius

function SIFTDescriptor(){
	this._cellCountSize = 4; // 4 x 4 cells
	this._cellPixelSize = 4; // 4 x 4 pixels
	var perCell = this._cellCountSize;
	var perPixel = this._cellPixelSize;
	var totalPixels = perPixel*perPixel * perCell*perCell;
	var totalBins = SIFTDescriptor.BIN_COUNT * perCell * perCell;
	this._vector = Code.newArrayZeros(totalPixels);
	this._orientationAngle = 0.0;
	this._matches = [];
	this._scaleRadius = null;
}
SIFTDescriptor.prototype.orientation = function(){
	return this._orientationAngle;
}
SIFTDescriptor.prototype.scale = function(){
	return this._overallScale;
}
SIFTDescriptor.prototype.skewAngle = function(){
	return this._covarianceAngle;
}
SIFTDescriptor.prototype.skewScale = function(){
	return this._covarianceScale;
}
SIFTDescriptor.prototype.toPoint = function(width,height){
	var point = this.point();
		point.x*=width;
		point.y*=height;
	var scale = this.scale();
	var angle = this.orientation();
	v = new V4D(point.x,point.y, scale, angle);
	v.u = this.skewScale();
	v.v = this.skewAngle();
	return v;
}
//SIFTDescriptor._gauss = null;
// SIFTDescriptor.gaussian = function(){
// 	if(!SIFTDescriptor._gauss){
// 		SIFTDescriptor._gauss = ImageMat.getGaussianWindowSimple(16,16, 1.6);
// 	}
// 	return SIFTDescriptor._gauss;
// }

SIFTDescriptor.compare = function(descA,descB){
	var vectorA = descA.vector();
	var vectorB = descB.vector();
	return SIFTDescriptor.compareVector(vectorA,vectorB);
}
SIFTDescriptor.compareVector = function(vectorA,vectorB){ // L1 distance
	var i, score = 0;
	var len = vectorA.length;
	for(i=0; i<len; ++i){
//		score += Math.abs(vectorA[i] - vectorB[i]); // L1
		score += Math.pow(Math.abs(vectorA[i] - vectorB[i]),2); // L2
	}
	score = Math.sqrt(score);
	// if(len>0){
	// 	score *= len;
	// }
	// CONV
	// for(i=0; i<vectorA.length; ++i){
	// 	score += (vectorA[i]*vectorB[i]);
	// }
	// score = -score;
	return score;
}

SIFTDescriptor._sortMatch = function(a, b){
	return a.score < b.score ? -1 : 1;
}
SIFTDescriptor.matchSubset = function(listA,putativeA, listB,putativeB){ // putatives are lists of best candidates for each sift in list
	console.log("matchSubset...");
	var i, j, k;
	var matches = [];
	var matchesA = Code.newArrayArrays(listA.length);
	var matchesB = Code.newArrayArrays(listB.length);
	// A to putative B
	for(i=0; i<listA.length; ++i){
		var descA = listA[i];
		var putative = putativeA[i];
		for(j=0; j<putative.length; ++j){
			var descB = putative[j];
			var score = SIFTDescriptor.compare(descA, descB);
			var index = Code.indexOfElement(listB,descB); // TODO: SLOW
			if(index){
				var match = {"A":descA, "B":descB, "score":score, "a":i, "b":index};
				matchesA[i].push(match);
				matchesB[index].push(match);
				matches.push(match);
			}
		}
	}
	// TODO: CHECK TO SEE IF A HAS ALREADY MACHED B BEFORE RE-COMPARE
	// B to putative A
	for(i=0; i<listB.length; ++i){
		var descB = listB[i];
		var putative = putativeB[i];
		for(j=0; j<putative.length; ++j){
			var descA = putative[j];
			var score = SIFTDescriptor.compare(descA, descB);
			var index = Code.indexOfElement(listA,descA); // TODO: SLOW
			if(index){
				var match = {"A":descA, "B":descB, "score":score, "a":index, "b":i};
				matchesA[index].push(match);
				matchesB[i].push(match);
				matches.push(match);
			}
		}
	}

	//
	// TODO: prevent / remove duplicates ... [a->b && b->a]
	// 
	var k;
	matches = matches.sort(SIFTDescriptor._sortMatch);
	for(i=0; i<listA.length; ++i){
		// REMOVE DUPLICATES:
		var list = matchesA[i];
		for(j=0; j<list.length; ++j){
			var m = list[j];
			for(k=j+1; k<list.length; ++k){
				var n = list[k];
				if(n["a"]==m["a"] && n["b"]==m["b"]){
					list[k] = list[list.length-1];
					list.pop();
					--j;
				}
			}
		}
		// SORT
		matchesA[i] = matchesA[i].sort(SIFTDescriptor._sortMatch);
	}
	for(i=0; i<listB.length; ++i){
		// REMOVE DUPLICATES:
		var list = matchesB[i];
		for(j=0; j<list.length; ++j){
			var m = list[j];
			for(k=j+1; k<list.length; ++k){
				var n = list[k];
				if(n["a"]==m["a"] && n["b"]==m["b"]){
					list[k] = list[list.length-1];
					list.pop();
					--j;
				}
			}
		}
		// SORT
		matchesB[i] = matchesB[i].sort(SIFTDescriptor._sortMatch);
	}


	// check to see if top match comparrisions:
	var bestMatches = [];
	for(i=0; i<matchesA.length; ++i){
		var lA = matchesA[i];
		if(lA.length>0){
			var mA = lA[0];
			var aA = mA["a"];
			var aB = mA["b"];
			var lB = matchesB[aB];
			if(lB && lB.length>0){
				var mB = lB[0];
				var bA = mB["a"];
				var bB = mB["b"];
				if(aA==bA && aB == bB){
					//console.log("MATCHING PAIR: "+aA+" & "+aB);
					bestMatches.push(mA);
				}
			}
		}
	}
	bestMatches = bestMatches.sort(function(a,b){
		return a["score"] < b["score"] ? -1 : 1;
	});

	return {"matches":matches, "A":matchesA, "B":matchesB, "best":bestMatches};
}
SIFTDescriptor.match = function(listA, listB){
	console.log("matching...");
	var i, j;
	var matches = [];
	var matchesA = [];
	var matchesB = [];
	for(i=0; i<listA.length; ++i){
		matchesA[i] = [];
	}
	for(i=0; i<listB.length; ++i){
		matchesB[i] = [];
	}
	for(i=0; i<listA.length; ++i){
		var descA = listA[i];
		for(j=0; j<listB.length; ++j){
			var descB = listB[j];
			var score = SIFTDescriptor.compare(descA, descB);
			var match = {"A":descA, "B":descB, "score":score, "a":i, "b":j};
			matchesA[i].push(match);
			matchesB[j].push(match);
			matches.push(match);
		}
	}
	matches = matches.sort(SIFTDescriptor._sortMatch);
	for(i=0; i<listA.length; ++i){
		matchesA[i] = matchesA[i].sort(SIFTDescriptor._sortMatch);
	}
	for(i=0; i<listB.length; ++i){
		matchesB[i] = matchesB[i].sort(SIFTDescriptor._sortMatch);
	}
	return {"matches":matches, "A":matchesA, "B":matchesB};
	var i, j;
	var matches = [];
	var matchesA = [];
	var matchesB = [];
	for(i=0; i<listA.length; ++i){
		matchesA[i] = [];
	}
	for(i=0; i<listB.length; ++i){
		matchesB[i] = [];
	}
	for(i=0; i<listA.length; ++i){
		var descA = listA[i];
		for(j=0; j<listB.length; ++j){
			var descB = listB[j];
			var score = SIFTDescriptor.compare(descA, descB);
			var match = {"A":descA, "B":descB, "score":score, "a":i, "b":j};
			matchesA[i].push(match);
			matchesB[j].push(match);
			matches.push(match);
		}
	}
	matches = matches.sort(SIFTDescriptor._sortMatch);
	for(i=0; i<listA.length; ++i){
		matchesA[i] = matchesA[i].sort(SIFTDescriptor._sortMatch);
	}
	for(i=0; i<listB.length; ++i){
		matchesB[i] = matchesB[i].sort(SIFTDescriptor._sortMatch);
	}
	return {"matches":matches, "A":matchesA, "B":matchesB};
}

SIFTDescriptor.matchF = function(listA, listB,  imageMatrixA,imageMatrixB, matrixFfwd, matrixFrev, lineMaxDistance){
	lineMaxDistance = lineMaxDistance!==undefined ? lineMaxDistance : 1.0;//25;//50; // ~0.25 is about minimum accuracy
	console.log("matching...");
	var i, j;
	var matches = [];
	var matchesA = [];
	var matchesB = [];
	for(i=0; i<listA.length; ++i){
		matchesA[i] = [];
	}
	for(i=0; i<listB.length; ++i){
		matchesB[i] = [];
	}
	var orgA = new V2D();
	var dirA = new V2D();
	var orgB = new V2D();
	var dirB = new V2D();
	for(i=0; i<listA.length; ++i){
		var descA = listA[i];
		var pointA = descA.point();
			pointA = new V3D(pointA.x,pointA.y,1.0);
			pointA.scale(imageMatrixA.width(), imageMatrixA.height(), 1.0);
		var lineB = matrixFfwd.multV3DtoV3D(new V3D(), pointA);
			Code.lineOriginAndDirection2DFromEquation(orgA,dirA, lineB.x,lineB.y,lineB.z);
		for(j=0; j<listB.length; ++j){
			var descB = listB[j];
			var pointB = descB.point();
				var pointB = new V3D(pointB.x,pointB.y,1.0);
				pointB.scale(imageMatrixB.width(), imageMatrixB.height(), 1.0);
				var lineA = matrixFrev.multV3DtoV3D(new V3D(), pointB);
			Code.lineOriginAndDirection2DFromEquation(orgB,dirB, lineA.x,lineA.y,lineA.z);

			var distanceA = Code.distancePointRay2D(orgA,dirA, pointB);
			var distanceB = Code.distancePointRay2D(orgB,dirB, pointA);
			if(distanceA<lineMaxDistance && distanceB<lineMaxDistance){
				//console.log(distanceA+" | "+distanceB);
				var score = SIFTDescriptor.compare(descA, descB);
				var match = {"A":descA, "B":descB, "score":score, "a":i, "b":j};
				matchesA[i].push(match);
				matchesB[j].push(match);
				matches.push(match);
			}else{
				//console.log("cant use");
			}
		}
		
	}
	matches = matches.sort(SIFTDescriptor._sortMatch);
	for(i=0; i<listA.length; ++i){
		matchesA[i] = matchesA[i].sort(SIFTDescriptor._sortMatch);
	}
	for(i=0; i<listB.length; ++i){
		matchesB[i] = matchesB[i].sort(SIFTDescriptor._sortMatch);
	}
	return {"matches":matches, "A":matchesA, "B":matchesB};
}

SIFTDescriptor.confidences = function(matchesA, matchesB){ // matches belonging to each feature
	console.log("confidences...");
	var totalMatches = [];
	var i;
	for(i=0; i<matchesA.length; ++i){
		totalMatches.push({"feature":matchesA[i][0]["A"], "matches":matchesA[i], "confidence":SIFTDescriptor.confidence(matchesA[i]) });
	}
	for(i=0; i<matchesB.length; ++i){
		totalMatches.push({"feature":matchesB[i][0]["B"], "matches":matchesB[i], "confidence":SIFTDescriptor.confidence(matchesB[i]) });
	}
	totalMatches = totalMatches.sort(SIFTDescriptor._sortConfidence);
	return totalMatches;
}
SIFTDescriptor.matchesFromConfidences = function(confidences){
	var i;
	var matches = [];
	var minimumConfidenceScore = 1.05;
	for(i=0; i<confidences.length; ++i){
		var confidence = confidences[i];
		var feature = confidence["feature"];
		var score = confidence["confidence"];

		if(i>50 || score < minimumConfidenceScore){
			break;
		}

		var matchings = confidence["matches"];
		var match = matchings[0];
		var featureA = null;
		var featureB = null;
		if(match["A"]==feature){
			featureA = feature;
			featureB = match["B"];
		}else{
			featureA = match["A"];
			featureB = feature;
		}

		//var confA = 

		var match = {"A":featureA, "B":featureB, "confidence":score};
		matches.push(match);
		
	}
	return matches;
}
SIFTDescriptor._sortConfidence = function(a, b){
	return a["confidence"] > b["confidence"] ? -1 : 1;
	//return SIFTDescriptor.confidence(a) > SIFTDescriptor.confidence(b);
}
// TODO: mutual confidence -- lowest of the 2, or some ratio ?
SIFTDescriptor.confidence = function(matches){ // sorted matches list, higher confidence is better
	if(matches.length>=2){
		var match0 = matches[0];
		var match1 = matches[1];
		//console.log(match0.score,match1.score)
		if(match0.score==0){
			return 100;
		}
		return match1.score / match0.score; // smaller score is better, eg: 100/90
	}
	return 0;
}


SIFT_CALL = -1;
SIFTDescriptor.fromPointGray = function(source, point){
++SIFT_CALL;
	var overallSize = 21;
	var width = source.width();
	var height = source.height();
	var red = source.red();
	var grn = source.grn();
	var blu = source.blu();
	var location = new V2D(point.x*width, point.y*height);
	var radius = point.z;
	var ratioSize = SIFTDescriptor.DESCRIPTOR_SCALE*(radius/2.0);
	var overallScale = overallSize/ratioSize;
	//var area = ImageMat.extractRectFromPointSimple(source, width,height, location.x,location.y,overallScale, overallSize,overallSize);
	var area = R3D.imageFromParameters(source, location,overallScale,0.0,0.0,0.0, overallSize,overallSize);
	var circleMask = ImageMat.circleMask(overallSize,overallSize);
/*
	// BLUR IMAGE
	var blurred = ImageMat.getBlurredImage(area, overallSize,overallSize, SIFTDescriptor.GAUSSIAN_BLUR_GRADIENT);
	// GET DERIVATIVES
	var gradients = ImageMat.gradientVector(blurred, overallSize,overallSize);
	//

// var show = area;
// img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, overallSize, overallSize);
// d = new DOImage(img);
// d.matrix().translate((SIFT_CALL%20)*(overallSize+2),Math.floor(SIFT_CALL/20)*(overallSize+2)+350);
// GLOBALSTAGE.addChild(d);

	var circleMask = ImageMat.circleMask(overallSize,overallSize);
	var i, j, k;
	var count = 0;
	var mask;
	var totalBinCount = SIFTDescriptor.BIN_COUNT_OVERALL;
	var bins = Code.newArrayZeros(totalBinCount);
	for(i=0; i<circleMask.length; ++i){
		count += circleMask[i];
		mask = circleMask[i];
		if(mask!=0.0){
			var v = gradients[i];
			var m = v.length();
			var a = V2D.angleDirection(V2D.DIRX,v);
			a = Code.angleZeroTwoPi(a);
			var bin = Math.min(Math.floor((a/Math.PI2)*totalBinCount),totalBinCount-1);
			bins[bin] += m;
		}
	}
	// // find peak direction
	var info = Code.infoArray(bins);
	var binMaxIndex = info["indexMax"];

	var optimalOrientation = R3D.interpolateAngleMaxima(bins, binMaxIndex);
*/
var optimalOrientations = R3D.angleImageRGB(area,circleMask);
var i, k;
var sifts = [];
	for(k=0; k<optimalOrientations.length; ++k){
		var optimalOrientation = optimalOrientations[k];
		//console.log(k+": "+optimalOrientation);
		// asymmetric scaling
		//var circleMask = ImageMat.circleMask(overallSize,overallSize);
		var areaCenter = new V2D( (overallSize-1)*0.5, (overallSize-1)*0.5 );
		var covariance = ImageMat.calculateCovariance(area, overallSize,overallSize, areaCenter, circleMask);
		var covarianceRatio = covariance[0].z/covariance[1].z;
		var covarianceAngle = V2D.angleDirection(V2D.DIRX, covariance[0]);
		var covarianceScale = Math.pow(covarianceRatio,1.0);
		//var vector = SIFTDescriptor.vectorFromImage(source, width,height, location,overallScale, optimalOrientation);
		//var vector = null;
		//var vectorScales = [0.8,1.0,1.25];
		//var vectorScales = [.6666,1.0,1.5];
		//var vectorScales = [.5,1.0,2.0];
		//var vectorScales = Code.divSpace(-1, 1, 4); // 0.5...2.0
		var vectorScales = Code.divSpace(-.5, .5, 3); // 0.707...1.414
		var gry = source;
		var vector = [];
		for(i=0; i<vectorScales.length; ++i){
			var scale = vectorScales[i];
				scale = Math.pow(2,scale);
			// TODO: OVERALL SCALE NEEDS TO CONSIDER  vectorFromImage's scale in
			var vectorR = SIFTDescriptor.vectorFromImage(red, width,height, location,overallScale*scale, optimalOrientation, covarianceAngle, covarianceScale);
			var vectorG = SIFTDescriptor.vectorFromImage(grn, width,height, location,overallScale*scale, optimalOrientation, covarianceAngle, covarianceScale);
			var vectorB = SIFTDescriptor.vectorFromImage(blu, width,height, location,overallScale*scale, optimalOrientation, covarianceAngle, covarianceScale);
			//var vectorY = SIFTDescriptor.vectorFromImage(gry, width,height, location,overallScale*scale, optimalOrientation, covarianceAngle, covarianceScale);
			Code.arrayPushArray(vector,vectorR);
			Code.arrayPushArray(vector,vectorG);
			Code.arrayPushArray(vector,vectorB);
			//Code.arrayPushArray(vector,vectorY);
		}
		if(vector){
			var s = new SIFTDescriptor();
			s.vector(vector);
			s.point(point);
			s._orientationAngle = optimalOrientation;
			s._overallScale = ratioSize;
			s._scaleRadius = radius;
			s._covarianceAngle = covarianceAngle;
			s._covarianceScale = covarianceScale;
			sifts.push(s);
		}
	}
	return sifts;
}
SIFTDescriptor.flatFromImage = function(source, width,height, location,optimalScale,optimalOrientation,covarianceAngle,covarianceScale){
// TODO: 11 | 15 | 21 ?
	var insideSet = 11;
	optimalScale = optimalScale!==undefined ? optimalScale : 1.0;
	optimalOrientation = optimalOrientation!==undefined ? optimalOrientation : 0.0;
	covarianceAngle = covarianceAngle!==undefined ? covarianceAngle : 0.0;
	covarianceScale = covarianceScale!==undefined ? covarianceScale : 1.0;
	
	
	var mask = ImageMat.circleMask(insideSet);
	// extract image at new orientation
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, (-location.x) , (-location.y) );
		// asymm scale
		matrix = Matrix.transform2DRotate(matrix, -covarianceAngle);
		matrix = Matrix.transform2DScale(matrix, covarianceScale,1.0/covarianceScale);
		matrix = Matrix.transform2DRotate(matrix, covarianceAngle);
		// scaling
		matrix = Matrix.transform2DScale(matrix, optimalScale);
		matrix = Matrix.transform2DRotate(matrix, -optimalOrientation);
		matrix = Matrix.transform2DTranslate(matrix, (insideSet*0.5) , (insideSet*0.5) );
		matrix = Matrix.inverse(matrix);
	// GET IMAGE
	var area = ImageMat.extractRectFromMatrix(source, width,height, insideSet,insideSet, matrix);
	var inside = [];
	for(var i=0; i<area.length; ++i){
		// if(mask[i]>0){
			inside.push(area[i]);
		// }
	}
	return inside;
}
SIFTDescriptor.vectorFromImage = function(source, width,height, location,optimalScale,optimalOrientation,covarianceAngle,covarianceScale){
	optimalScale = optimalScale!==undefined ? optimalScale : 1.0;
	optimalOrientation = optimalOrientation!==undefined ? optimalOrientation : 0.0;
	covarianceAngle = covarianceAngle!==undefined ? covarianceAngle : 0.0;
	covarianceScale = covarianceScale!==undefined ? covarianceScale : 1.0;

	var i, j, ii, jj;
	var insideSet = 16;
	var padding = 2;
	var outsideSet = insideSet + 2*padding;
	// extract image at new orientation
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, (-location.x) , (-location.y) );
		// asymm scale
		matrix = Matrix.transform2DRotate(matrix, -covarianceAngle);
		matrix = Matrix.transform2DScale(matrix, covarianceScale,1.0/covarianceScale);
		matrix = Matrix.transform2DRotate(matrix, covarianceAngle);
		// scaling
		matrix = Matrix.transform2DScale(matrix, optimalScale);
		matrix = Matrix.transform2DRotate(matrix, -optimalOrientation);
		matrix = Matrix.transform2DTranslate(matrix, (outsideSet*0.5) , (outsideSet*0.5) );
		matrix = Matrix.inverse(matrix);
	// GET IMAGE
	var area = ImageMat.extractRectFromMatrix(source, width,height, outsideSet,outsideSet, matrix);
	// BLUR IMAGE
	var blurred = ImageMat.getBlurredImage(area, outsideSet,outsideSet, SIFTDescriptor.GAUSSIAN_BLUR_GRADIENT);
	// GET DERIVATIVES
	var gradients = ImageMat.gradientVector(blurred, outsideSet,outsideSet).value;
	// UNPAD
	gradients = ImageMat.unpadFloat(gradients,outsideSet,outsideSet, padding,padding,padding,padding);
	//area = ImageMat.unpadFloat(area,outsideSet,outsideSet, padding,padding,padding,padding);
	// get 16 separate bins
	// circleMask = ImageMat.circleMask(insideSet,insideSet);
	var sigma = insideSet * 2.0; // TODO: EXTERNALIZE THIS
	var gaussianMask = ImageMat.gaussianMask(insideSet,insideSet, sigma);
	var bins = [];
	var binCount = 8;
	// for each grid component: 4x4 = 16
	for(j=0; j<4; ++j){
		for(i=0; i<4; ++i){
			var bin = Code.newArrayZeros(binCount);
			bins.push(bin);
			for(jj=0; jj<4; ++jj){
				for(ii=0; ii<4; ++ii){
					var index = (j*4+jj)*insideSet + (i*4+ii);
					var gradient = gradients[index];
					var m = gradient.length();
					var a = V2D.angleDirection(V2D.DIRX,gradient);
						a = Code.angleZeroTwoPi(a);
					var w = gaussianMask[index];// weight on gaussian
					//w = 1.0;
					// SINGLE BIN:
					var b = Math.min(Math.floor((a/Math.PI2)*binCount),binCount-1);
					bin[b] += m*w;
					// // DUAL BINS: -- TO HELP WITH TRUNCATION ROUNDING
					// b = Math.min(Math.floor(( Code.angleZeroTwoPi(a+0.5*Math.PI2/binCount) / Math.PI2)*binCount),binCount-1);
					// bin[b] += m*w;
				}
			}
		}
	}
	// convert bins into vector
	var vector = [];
	for(i=0; i<bins.length; ++i){
		var bin = bins[i];
		for(j=0; j<bin.length; ++j){
			var value = bin[j];
			vector.push(value);
		}
	}
	var vectorSize = vector.length;
	if(vectorSize>0){
		
		// subtract min vector
		var min = Code.minArray(vector);
		Code.arraySub(vector, min);
		
		// normalize vector ||m||
		Code.normalizeArray(vector);

		// clip high-value vector components
		vector = ImageMat.pow(vector,0.25); // little better than clipping

		// Code.arrayClip(vector, 0.0, 0.2);
		// Code.normalizeArray(vector);
		return vector;
	}
	return null;
}
SIFTDescriptor.prototype.imageFromFeature = function(imageSource, displaySize, offsetScale){
	offsetScale = offsetScale!==undefined? offsetScale : 1.0;
	var sourceWidth = imageSource.width();
	var sourceHeight = imageSource.height();
	var size = this._overallScale;
	var angle = this._orientationAngle;
	var point = this.point();
	var location = new V2D(point.x*sourceWidth, point.y*sourceHeight);
	var overallScale = displaySize/size;
	//console.log("overallScale: "+overallScale);
	var halfSize = displaySize*0.5;
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, (-location.x) , (-location.y) );
		matrix = Matrix.transform2DScale(matrix, overallScale/offsetScale);
		matrix = Matrix.transform2DRotate(matrix, -angle);
		matrix = Matrix.transform2DTranslate(matrix, halfSize, halfSize);
		matrix = Matrix.inverse(matrix);
	// GET IMAGE
	// var source = imageSource.gry();
	// var width = imageSource.width();
	// var height = imageSource.height();
	var area = imageSource.extractRectFromMatrix(displaySize,displaySize, matrix);
	return area;
}
SIFTDescriptor.prototype.visualizeInSitu = function(imageSource, offset){
	offset = offset!==undefined ? offset : new V2D(0,0);
	var sourceWidth = imageSource.width();
	var sourceHeight = imageSource.height();
	var size = this._overallScale;
	var angle = this._orientationAngle;
	var point = this.point();
	var location = new V2D(point.x*sourceWidth, point.y*sourceHeight);
	//var overallScale = displaySize/size;
	//var radius = 2.0*size/SIFTDescriptor.DESCRIPTOR_SCALE;
	var radius = 2.0*this._scaleRadius;


	// var covariance = this._covariance;
	// var covarianceRatio = covariance[0].z/covariance[1].z;
	// var angleMaximum = V2D.angleDirection(V2D.DIRX, covariance[0]);
	// var angleMinimum = V2D.angleDirection(V2D.DIRX, covariance[1]);
	// console.log(covarianceRatio,angleMaximum,angleMinimum,Code.minAngle(angleMaximum,angleMinimum));
	// var covarianceScale = Math.pow(covarianceRatio,0.5);
	var covarianceAngle = this._covarianceAngle;
	var covarianceScale = this._covarianceScale;

	var displaySize = size;
	var c, d;
	
	var display = new DO();
	var outline = new DO();
		display.addChild(outline);
	var color = 0xFFFF00FF;
	c = new DO();
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(0,0, radius*0.5);
		c.graphics().strokeLine();
		c.graphics().endPath();
		outline.addChild(c);
	color = 0xFF00FF00;
	c = new DO();
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(0,0, displaySize*0.5);
		c.graphics().strokeLine();
		c.graphics().endPath();
		outline.addChild(c);
	d = new DO();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(Math.cos(angle)*displaySize*0.5,Math.sin(angle)*displaySize*0.5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		outline.addChild(d);
	display.matrix().identity();
		display.matrix().rotate(-covarianceAngle);
		//display.matrix().scale(1.0/covarianceScale,covarianceScale);
		display.matrix().scale(covarianceScale,1.0/covarianceScale);
		display.matrix().rotate(covarianceAngle);
	display.matrix().translate(offset.x+location.x, offset.y+location.y);
	return display;
}
SIFTDescriptor.prototype.visualize = function(imageSource, displaySize){
	// var sourceWidth = imageSource.width();
	// var sourceHeight = imageSource.height();
	// var size = this._overallScale;
	var angle = this._orientationAngle;
	var point = this.point();
	// var location = new V2D(point.x*sourceWidth, point.y*sourceHeight);
	// var overallScale = displaySize/size;
	// //console.log("overallScale: "+overallScale);
	// var halfSize = displaySize*0.5;
	// var matrix = new Matrix(3,3).identity();
	// 	matrix = Matrix.transform2DTranslate(matrix, (-location.x) , (-location.y) );
	// 	matrix = Matrix.transform2DScale(matrix, overallScale);
	// 	matrix = Matrix.transform2DRotate(matrix, -angle);
	// 	matrix = Matrix.transform2DTranslate(matrix, halfSize, halfSize);
	// 	matrix = Matrix.inverse(matrix);
	// // GET IMAGE
	// var source = imageSource.gry();
	// var width = imageSource.width();
	// var height = imageSource.height();
	// var area = ImageMat.extractRectFromMatrix(source, width,height, displaySize,displaySize, matrix);
	// var show = area;
	// img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, displaySize, displaySize);
	var show = this.imageFromFeature(imageSource,displaySize);
	img = GLOBALSTAGE.getFloatRGBAsImage(show.red(), show.grn(), show.blu(), displaySize, displaySize);
	
	var display = new DO();
	var image = new DOImage(img);
	var outline = new DO();
		display.addChild(image);
		display.addChild(outline);
	var color = 0xFF00FF00;
	var c = new DO();
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(0,0, displaySize*0.5);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(displaySize*0.5,displaySize*0.5);
		outline.addChild(c);
	var d = new DO();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(Math.cos(angle)*displaySize*0.5,Math.sin(angle)*displaySize*0.5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(displaySize*0.5,displaySize*0.5);
		outline.addChild(d);
	return display;
}

SIFTDescriptor.prototype.vector = function(v){
	if(v!==undefined){
		this._vector = v;
	}
	return this._vector;
}

SIFTDescriptor.prototype.point = function(p){
	if(p!==undefined){
		this._point = new V2D(p.x,p.y);
	}
	return this._point.copy();
}

SIFTDescriptor.prototype.normalize = function(){
	var i, len = this._vector.length;
	var total = 0;
	for(i=0; i<len ;++i){
		total += this._vector[i]*this._vector[i];
	}
	if(total>0){
		total = 1.0/total;
		for(i=0; i<len;++i){
			this._vector[i] = this._vector[i] * total;
		}
	}
}

SIFTDescriptor.crossMatches = function(featuresA,featuresB, allMatches, matchesA,matchesB, minConfidence, maxNeeded){
	console.log("crossMatches");
	minConfidence = (minConfidence!==undefined && minConfidence!==null) ? minConfidence : 1.01;
	maxNeeded = (maxNeeded!==undefined && maxNeeded!==null) ? maxNeeded : 150; // need more if confidence quality is poor
	var same = [];
	var i, j;
	for(i=0; i<allMatches.length; ++i){
		var match = allMatches[i];
		var a = match["a"];
		var b = match["b"];
		var A = featuresA[a];
		var B = featuresB[b];
		var matchedA = matchesA[a];
		var matchedB = matchesB[b];
		var matchA0 = matchedA[0];
		var matchB0 = matchedB[0];
		if(matchA0["b"]==b && matchB0["a"]==a){ // if each are the top choice of the other
// a = featuresA[a];
// b = featuresB[b];
// var aa = featuresA[matchB0["a"]];
// var bb = featuresB[matchA0["b"]];		
// var pSA = a;//a.point();
// var pMA = aa;//matchB0["a"].point();
// var pSB = b;//b.point();
// var pMB = bb;//matchA0["b"].point();
// var lim = 0.01;
// //console.log(pSA+" | "+pMA);
// if(V2D.distance(pSB,pMB)<lim && V2D.distance(pSA,pMA)){ // if each are the top choice of the other



			var confidenceA = SIFTDescriptor.confidence(matchedA);
			var confidenceB = SIFTDescriptor.confidence(matchedB);
			var confidence = (confidenceA + confidenceB) * 0.5;
			if(confidenceA>=minConfidence && confidenceB >= minConfidence){
				match["confidence"] = Math.min(confidenceA,confidenceB);
				same.push(match);
			}
		}




	}
	same = same.sort(function(a,b){
		return a["confidence"] > b["confidence"] ? -1 : 1;
	});
	if(same.length>maxNeeded){
		same = Code.copyArray(same,0,maxNeeded-1);
	}
	return same;
}
