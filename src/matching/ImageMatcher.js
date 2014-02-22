// ImageMatcher.js
ImageMatcher.YAML = {
	MATCHA: "a",
	MATCHB: "b",
	MATCHES: "matches",
	}
function ImageMatcher(){
	this._descriptorA = null;
	this._descriptorB = null;
	this._matches = new Array();
}
ImageMatcher.prototype.saveToYAML = function(yaml){
	//
}
ImageMatcher.prototype.loadFromYAML = function(yaml){
	//
}
ImageMatcher.prototype.clearMatches = function(){
	Code.emptyArray(this._matches);
}
ImageMatcher.prototype.matchDescriptors = function(dA,dB){
Code.timerStart();
	var i, j, lenA, lenB, listA, listB, fA, fB;
	this.clearMatches();
	this._descriptorA = dA;
	this._descriptorB = dB;
	listA = dA.getFeatureList();
	listB = dB.getFeatureList();
	lenA = listA.length;
	lenB = listB.length;
	// clear any existing matches
// lenA = 10;
// lenB = 10;
	for(i=0;i<lenA;++i){
		listA[i].clearPointList();
		listA[i].descriptor(dA);
		listA[i].findOrientations(dA.redFlat(),dA.greenFlat(),dA.blueFlat(),dA.grayFlat(),dA.width(),dA.height());
	}
	for(j=0;j<lenB;++j){
		listB[j].clearPointList();
		listB[j].descriptor(dB);
		listB[j].findOrientations(dB.redFlat(),dB.greenFlat(),dB.blueFlat(),dB.grayFlat(),dB.width(),dB.height());
	}
	// find all matching scores
	var ang;
var skipped = 0;
	for(i=0;i<lenA;++i){
		fA = listA[i];
		fA.findDescriptor(dA.redFlat(),dA.greenFlat(),dA.blueFlat(),dA.grayFlat(),dA.width(),dA.height(), 0);
		fA.findSurface(dA.redFlat(),dA.greenFlat(),dA.blueFlat(),dA.grayFlat(),dA.width(),dA.height(), 0);

// var u = fA._flat.uniqueness();
// if(u<0.05){
// 	skipped++;
// 	continue;
// }

		for(j=0;j<lenB;++j){
			fB = listB[j];
			// compare features at best possible orientation
			grys = fA.colorAngle().gry()-fB.colorAngle().gry();
			ang = ImageFeature.bestRotation(fA,fB);
			ang = grys+ang;
			fB.findDescriptor(dB.redFlat(),dB.greenFlat(),dB.blueFlat(),dB.grayFlat(),dB.width(),dB.height(), ang);
			fB.findSurface(dB.redFlat(),dB.greenFlat(),dB.blueFlat(),dB.grayFlat(),dB.width(),dB.height(), ang);
// var u = fB._flat.uniqueness();
// if(u<0.05){
// 	//skipped++;
// 	continue;
// }
			ImageFeature.compareFeatures(fA,fB);
		}
	}
console.log("skipped: "+skipped+" / "+lenA+" = "+(skipped/lenA));
Code.timerStop();
console.log( Code.timerDifferenceSeconds() );
}
ImageMatcher._sortPointList = function(a,b){
	return a[2]-b[2];
	//return a[2]-b[2]; // smaller is first
}
ImageMatcher.prototype.chooseBestMatches = function(){
Code.timerStart();
	// check for uniqueness - only single high-scoring match - ignore matches that are all similar to eachother
	// choose the best matches between each feature
	//   - drop features with poor/duplicate matches
	var best = this._matches;
	var i, j, lenA, lenB, listA, listB, fA, fB, pts, len;
	listA = this._descriptorA.getFeatureList();
	listB = this._descriptorB.getFeatureList();
	lenA = listA.length;
	lenB = listB.length;
	// clear any existing matches
	for(i=0;i<lenA;++i){
		pts = listA[i]._pointList;
		len = pts.length;
		for(j=0;j<len;++j){
			best.push([listA[i],pts[j][0],pts[j][1]]);
		}
		// if(pts.length>0){
		// 	best.push([listA[i],pts[0][0],pts[0][1]]); // A,B,score
		// }
	}
	best.sort(ImageMatcher._sortPointList);
	// for(j=0;j<lenB;++j){
	// 	listB[j].clearPointList();
	// }
Code.timerStop();
console.log( Code.timerDifferenceSeconds() );
}

ImageMatcher.prototype.consolidateMatches = function(){
	// pull the data from the features, and store in seperate data structure
}
