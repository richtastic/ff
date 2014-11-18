// Similarity.js
function Similarity(){
	console.log("create");
	this.handleLoaded();
}
Similarity.prototype.addListeners = function(){
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	// internal
	//this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.handleCanvasResizeFxn,this);
	//this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleStageEnterFrameFxn,this);
	this._stage.start();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.handleKeyUpFxn,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.handleKeyDownFxn,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.handleKeyDown2Fxn,this);
	//
}
Similarity.prototype.handleLoaded = function(){
	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, 1000/20);
	this._keyboard = new Keyboard();
	this._root = new DO();
	this._stage.addChild(this._root);
	this._imageLoader = new ImageLoader();
	console.log("loaded");
	this.addListeners();
	this.main();
}
Similarity.prototype.main = function(){
	var i, len;
	//			0			1 			2			3		4			5
	metrics = ["fierce","adventurous","charming","funny","mischievous","dependable"];
	// system personalities
	var primary = 2;
	var secondary = 1;
	// example comparitors
	var smoothOperator = [0,0,primary,0,secondary,0];
	var rogue = [0,0,secondary,0,primary,0];
	var closer = [primary,0,0,0,0,secondary];
	// set
	var systemSet = [smoothOperator,rogue,closer];
	// example users
	var userA = [0,1,2,3,4,5];
	//var userB = [4,4,5,1,6,1];
	var userB = [4,4,5,9,6,9];
		//       0 0 1 0 2 0 - rogue
		//       2 0 0 0 0 1 - closer
	var userC = [1,2,3,2,1,1];
	//
	var scoresA = this.getScores(userA, systemSet, this.getScoreSSD);
	var scoresB = this.getScores(userB, systemSet, this.getScoreSSD);
	var scoresC = this.getScores(userC, systemSet, this.getScoreSSD);
	//
	//console.log(systemSet);
	console.log("----------------- systems");
	len = systemSet.length;
	for(i=0;i<len;++i){
		console.log(i+" : = "+systemSet[i]);
	}
	console.log("----------------- users");
	console.log(userA);
	console.log(userB);
	console.log(userC);
	console.log("----------------- scores SSD");
	console.log(scoresA); // best matches 1 = rogue
	console.log(scoresB); // best matches 1 = rogue | 1+2
	console.log(scoresC); // best matches 0 = smooth
	//
	scoresA = this.getScores(userA, systemSet, this.getScoreConv);
	scoresB = this.getScores(userB, systemSet, this.getScoreConv);
	scoresC = this.getScores(userC, systemSet, this.getScoreConv);
	console.log("----------------- scores");
	console.log(scoresA); // best matches 1 = rogue
	console.log(scoresB); // best matches 1 = rogue | 1+2
	console.log(scoresC); // best matches 0 = smooth
}
Similarity.prototype.getScores = function(user,set, getScore){
	var scores=[], i, len=set.length;
	for(i=0;i<len;++i){
		scores[i] = getScore.call(this, user,set[i]);
	}
	return scores;
}
Similarity.prototype.normalized = function(arr){
	var i, len=arr.length, norm=[], max=0;
	for(i=0;i<len;++i){
		max = Math.max(arr[i],max);
	}
	max = max>0?max:1;
	for(i=0;i<len;++i){
		norm[i] = arr[i]/max;
	}
	return norm;
}
Similarity.prototype.getScoreSSD = function(userA,userB){
	var diff, diff2, sum, i, len = userA.length;
	// normalized versions
	var normA = this.normalized(userA);
	var normB = this.normalized(userB);
	// SoSD
	sum = 0;
	for(i=0;i<len;++i){
		diff = normA[i]-normB[i];
		diff2 = diff*diff;
		sum += diff2;
	}
	return sum;
}

Similarity.prototype.getScoreConv = function(userA,userB){
	var diff, diff2, sum, i, len = userA.length;
	// normalized versions
	var normA = this.normalized(userA);
	var normB = this.normalized(userB);
	// conv 0-offset
	sum = 0;
	for(i=0;i<len;++i){
		sum += normA[i]*normB[i];
	}
	return sum;
}
























