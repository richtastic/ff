// ColorAngle.js
function ColorAngle(r,g,b,y){
	this._red = r;
	this._grn = g;
	this._blu = b;
	this._gry = y;
}
ColorAngle.prototype.red = function(r){
	if(arguments.length>0){
		this._red = r;
	}
	return this._red;
}
ColorAngle.prototype.grn = function(){
	return this._grn;
}
ColorAngle.prototype.blu = function(){
	return this._blu;
}
ColorAngle.prototype.gry = function(){
	return this._gry;
}

ColorAngle.compareAngles = function(angA,angB, ang){ // but is this the LOWEST POSSIBLE SCORE => NO, use binary search, etc...
	ang = ang===undefined?0:ang;
	var angA_grayRed = Code.minAngle(angA.gry(),angA.red());
	var angA_grayGrn = Code.minAngle(angA.gry(),angA.grn());
	var angA_grayBlu = Code.minAngle(angA.gry(),angA.blu());
	var angB_grayRed = Code.minAngle(angB.gry(),angB.red());
	var angB_grayGrn = Code.minAngle(angB.gry(),angB.grn());
	var angB_grayBlu = Code.minAngle(angB.gry(),angB.blu());
	var diffRed = angA_grayRed - angB_grayRed - ang;
	var diffGrn = angA_grayGrn - angB_grayGrn - ang;
	var diffBlu = angA_grayBlu - angB_grayBlu - ang;
	var diffGry = ang;
	var score = Math.abs(diffRed) + Math.abs(diffBlu) + Math.abs(diffGrn) + Math.abs(diffGry);
	return score;
}

ColorAngle._temp = new ColorAngle();
ColorAngle.optimumAngle = function(angA,angB){
	var ang = 0, dir = 1, i, len=1000, delta = .1;
	var scoreA, scoreB = ColorAngle.compareAngles(angA,angB, ang);
	for(i=0;i<len;++i){
		scoreA = ColorAngle.compareAngles(angA,angB, ang+delta*dir);
		//console.log(scoreA,scoreB);
		if(scoreA<scoreB){ // continue this way
			scoreB = scoreA;
			ang += delta*dir;
		}else{ // switch direction and half delta
			delta = delta*0.5;
			dir = -dir;
		}
		if(delta<1E-5){
			break;
		}
	}
	return ang;
}
/*
var maxScore = 1E10, maxAng=0, score, ang;
	var i=0, len=10000;
	var delta = 0.01;
	var sta = len*delta*0.5;
	for(i=0;i<len;++i){
		ang = i*delta - sta;
		score = ColorAngle.compareAngles(angA,angB, ang);
		if(score<maxScore){
			maxScore = score;
			maxAng = ang;
		}
	}
	return ang;
*/