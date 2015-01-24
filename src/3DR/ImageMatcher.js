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
ImageMatcher.prototype.matches = function(){
	return this._matches;
}
ImageMatcher.prototype.matchDescriptors = function(dA,dB){
Code.timerStart();
	var i, j, lenA, lenB, listA, listB, fA, fB;
	this.clearMatches();
	this._descriptorA = dA;
	this._descriptorB = dB;
	listA = dA.featureList();
	listB = dB.featureList();
	lenA = listA.length;
	lenB = listB.length;
	// clear any existing matches
	for(i=0;i<lenA;++i){
		listA[i].clearPointList();
		listA[i].findOrientations(dA.redFlat(),dA.greenFlat(),dA.blueFlat(),dA.grayFlat(),dA.width(),dA.height());
	}
	if(dA!=dB){
		for(j=0;j<lenB;++j){
			listB[j].clearPointList();
			listB[j].findOrientations(dB.redFlat(),dB.greenFlat(),dB.blueFlat(),dB.grayFlat(),dB.width(),dB.height());
		}
	}
	// find all matching scores
	var skipped = 0;
	for(i=0;i<lenA;++i){
		fA = listA[i];
// var u = fA._flat.uniqueness();
// if(u<0.05){
// 	skipped++;
// 	continue;
// }
		if(dA==dB){
			j = i+1;
		}else{
			j = 0;
		}
		for(;j<lenB;++j){
			fB = listB[j];
			var score = ImageFeature.compareFeatures(fA,fB);
			fA.addFeatureMatch(fB,score);
			fB.addFeatureMatch(fA,score);
		}
	}
//console.log("skipped: "+skipped+" / "+lenA+" = "+(skipped/lenA));
Code.timerStop();
console.log( Code.timerDifferenceSeconds() );
}
ImageMatcher._sortPointList = function(a,b){
	return a[2]-b[2];
	//return a[2]-b[2]; // smaller is first
}
ImageMatcher.prototype.chooseBestMatches = function(){
Code.timerStart();

// if fA's top is fB and fB's top match is fA

	// check for uniqueness - only single high-scoring match - ignore matches that are all similar to eachother
	// choose the best matches between each feature
	//   - drop features with poor/duplicate matches
	this.clearMatches();
	var best = this._matches;
	var i, j, lenA, lenB, listA, listB, fA, fB, fC, pts, len;
	listA = this._descriptorA.featureList();
	listB = this._descriptorB.featureList();
	lenA = listA.length;
	lenB = listB.length;
	var lA, lB;
	// clear any existing matches
	for(i=0;i<lenA;++i){
		fA = listA[i];
		lA = fA._pointList;
		if(lA.length>0){
			fB = lA[0][0];
			
			lB = fB._pointList;
			if(lB.length>0){
				fC = lB[0][0];
				if(fC==fA){
					score = lB[0][1];
					console.log("TWO TOP MATCHES");
					this._matches.push([fA,fB,score]);
				}
			}
		}
	}
	// SAME IN FB'S DIRECTION IF NOT SYMMETRIC
	//...
	// DROP BAD IN SET
	this._matches.sort(this._sortMatches);
	for(i=0;i<this._matches.length;++i){
		var m = this._matches;
		// if(m[i][2]>10){
		// 	Code.truncateArray(this._matches,i);
		// 	break;
		// }
	}
//	Code.truncateArray(this._matches,40); // for sho
	console.log("matches: "+this._matches.length);
Code.timerStop();
console.log( "time: "+Code.timerDifferenceSeconds() );
}
ImageMatcher.prototype.dropNonUniqueMatches = function(){
	// remove elements in list that have a close 1st and 2nd place
	// eg score[0]/score[1] >0.95
	// then remove the opposite element that was the same match
}
ImageMatcher.prototype._sortMatches = function(a,b){
	return a[2]-b[2];
}
ImageMatcher.prototype.consolidateMatches = function(){
	// pull the data from the features, and store in seperate data structure
}
ImageMatcher.prototype.kill = function(){
	//...
}
