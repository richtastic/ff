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
	var i, j, lenA, lenB, listA, listB, fA, fB;
	this.clearMatches();
	this._descriptorA = dA;
	this._descriptorB = dB;
	listA = dA.getFeatureList();
	listB = dA.getFeatureList();
	lenA = listA.length;
	lenB = listB.length;
	// clear any existing matches
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
	for(i=0;i<lenA;++i){
		fA = listA[i];
		for(j=0;j<lenB;++j){
			fB = listB[j];
			ImageFeature.compareFeatures(fA,fB);
		}
	}
	// ImageFeature.compareFeatures
}

ImageMatcher.prototype.chooseBestMatches = function(){
	// check for uniqueness - only single high-scoring match - ignore matches that are all similar to eachother
	// choose the best matches between each feature
	//   - drop features with poor/duplicate matches
}

ImageMatcher.prototype.consolidateMatches = function(){
	// pull the data from the features, and store in seperate data structure
}
