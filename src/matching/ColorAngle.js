// ColorAngle.js
function ColorAngle(rA,gA,bA,yA, rM,gM,bM,yM){
	this._redA = rA;
	this._grnA = gA;
	this._bluA = bA;
	this._gryA = yA;
	this._redM = (rM!==undefined)?rM:1;
	this._grnM = (gM!==undefined)?gM:1;
	this._bluM = (bM!==undefined)?bM:1;
	this._gryM = (yM!==undefined)?yM:1;
	this.normalizeMagnitudes();
}
ColorAngle.prototype.red = function(r){
	if(r!==undefined){ this._redA=r;}
	return this._redA;
}
ColorAngle.prototype.grn = function(g){
	if(g!==undefined){ this._grnA=g;}
	return this._grnA;
}
ColorAngle.prototype.blu = function(b){
	if(b!==undefined){ this._bluA=b;}
	return this._bluA;
}
ColorAngle.prototype.gry = function(g){
	if(g!==undefined){ this._gryA=g;}
	return this._gryA;
}
ColorAngle.prototype.redAng = function(r){
	return this.red(r);
}
ColorAngle.prototype.grnAng = function(g){
	return this.grn(g);
}
ColorAngle.prototype.bluAng = function(b){
	return this.blu(b);
}
ColorAngle.prototype.gryAng = function(g){
	return this.gry(g);
}
ColorAngle.prototype.redMag = function(r){
	if(r!==undefined){ this._redM=r;}
	return this._redM;
}
ColorAngle.prototype.grnMag = function(g){
	if(g!==undefined){ this._grnM=g;}
	return this._grnM;
}
ColorAngle.prototype.bluMag = function(b){
	if(b!==undefined){ this._bluM=b;}
	return this._bluM;
}
ColorAngle.prototype.gryMag = function(g){
	if(g!==undefined){ this._gryM=g;}
	return this._gryM;
}
ColorAngle.prototype.normalizeMagnitudes = function(g){
	var max = Math.max(this._redM,this._grnM,this._bluM,this._gryM);
	this._redM = this._redM/max;
	this._grnM = this._grnM/max;
	this._bluM = this._bluM/max;
	this._gryM = this._gryM/max;
}

ColorAngle.compareAngles = function(angA,angB, ang){ // but is this the LOWEST POSSIBLE SCORE => NO, use binary search, etc...
	ang = ang===undefined?0:ang;
	var aGry = angA.gry(), bGry = angB.gry();
	var angA_grayRed = Code.minAngle(aGry,angA.red());
	var angA_grayGrn = Code.minAngle(aGry,angA.grn());
	var angA_grayBlu = Code.minAngle(aGry,angA.blu());
	var angB_grayRed = Code.minAngle(bGry,angB.red());
	var angB_grayGrn = Code.minAngle(bGry,angB.grn());
	var angB_grayBlu = Code.minAngle(bGry,angB.blu());
	var diffRed = angA_grayRed - angB_grayRed + ang;
	var diffGrn = angA_grayGrn - angB_grayGrn + ang;
	var diffBlu = angA_grayBlu - angB_grayBlu + ang;
	var diffGry = ang;
	var score = Math.abs(diffRed)*angA.redMag()*angB.redMag()
			  + Math.abs(diffBlu)*angA.grnMag()*angB.grnMag()
			  + Math.abs(diffGrn)*angA.bluMag()*angB.bluMag()
			  + Math.abs(diffGry)*angA.gryMag()*angB.gryMag();
	return score;
}

ColorAngle._temp = new ColorAngle();
ColorAngle.optimumAngle = function(angA,angB){
	var ang = 0, dir = 1, i, len=100, delta = .1;
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