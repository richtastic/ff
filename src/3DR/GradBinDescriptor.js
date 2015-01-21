// GradBinDescriptor.js
GradBinDescriptor.BIN_COUNT = 8;
function GradBinDescriptor(count){
	count = (count!==undefined)?count:GradBinDescriptor.BIN_COUNT;
	this._bins = new Array(count);
	this.clear();
}
GradBinDescriptor.compare = function(binA,binB){
	//return GradBinDescriptor.compareConv(binA,binB);
	//return GradBinDescriptor.compareCross(binA,binB);
	return GradBinDescriptor.compareSSD(binA,binB);
}
GradBinDescriptor.compareConv = function(binA,binB){
	var i, len = Math.min(binA.binLength(),binB.binLength());
	var score = 0, sumA = binA.area(), sumB = binA.area();
	sumA = sumA>0?sumA:1.0;
	sumB = sumB>0?sumB:1.0;
	for(i=0;i<len;++i){
		score += binA._bins[i]*binB._bins[i];
	}
	return score/(sumA*sumB);
}
GradBinDescriptor.compareCross = function(binA,binB){ // cross correlation
	var i, len = Math.min(binA.binLength(),binB.binLength());
	var score = 0, sumA = 0, sumB = 0;
	for(i=0;i<len;++i){
		score += binA._bins[i]*binB._bins[i];
		sumA += binA._bins[i]*binA._bins[i];
		sumB += binB._bins[i]*binB._bins[i];
	}
	sumA = Math.sqrt(sumA);
	sumB = Math.sqrt(sumB);
	if(sumA==0||sumB==0){ return 0; }
	return score/(sumA*sumB);
}
GradBinDescriptor.compareSSD = function(binA,binB){
	var binA = binA._bins;
	var binB = binB._bins;
	var maxA = Math.max.apply(this,binA);
	var minA = Math.min.apply(this,binA);
	var maxB = Math.max.apply(this,binB);
	var minB = Math.min.apply(this,binB);
	var rangeA = maxA-minA;
	var rangeB = maxB-minB;
	if(rangeA!=0){ rangeA = 1.0/rangeA; }
	if(rangeB!=0){ rangeB = 1.0/rangeB; }
	var i, ssd = 0;
	for(i=binA.length;i--;){
		ssd += Math.pow( rangeA*(binA[i]-minA) - rangeB*(binB[i]-minB),2);
	}
	return ssd;
}
GradBinDescriptor.prototype.binLength = function(){
	return this._bins.length;
}
GradBinDescriptor.prototype.clear = function(){
	var i, len = this._bins.length;
	for(i=0;i<len;++i){
		this._bins[i] = 0.0;
	}
}
GradBinDescriptor.prototype.normalize = function(){
	var i, len = this._bins.length;
	var max = Code.maxArray(this._bins);
	if(max!=0){
		for(i=0;i<len;++i){
			this._bins[i] /= max;
		}
	}
}
GradBinDescriptor.prototype.capPeak = function(peak){
	var i, len = this._bins.length;
	for(i=0;i<len;++i){
		this._bins[i] = Math.min(this._bins[i],peak);
	}
}
GradBinDescriptor.prototype.getPeaks = function(){
	this._bins.push(this._bins[0]); this._bins.push(this._bins[1]); // circular
	var peaks = Code.findMaxima1D( this._bins );
	var linearValues = new Array(this._bins.length);
	var mult = Math.PI2/(linearValues.length-2);
	for(i=0;i<linearValues.length;++i){
		linearValues[i] = i*mult;
	}
	for(i=0;i<peaks.length;++i){
		Code.findExtrema1DSecondary(peaks[i], linearValues);
		peaks[i].x = Code.moduloFloat(peaks[i].x,Math.PI2);
	}
	this._bins.pop(); this._bins.pop();
	return peaks;
}
GradBinDescriptor.prototype.addAngle = function(angle,mag){
	mag = mag!==undefined?mag:1.0;
	angle = Code.angleZeroTwoPi(angle);
	var ratio = this._bins.length*(angle/(2.0*Math.PI));
	var bin1 = Math.floor(ratio)%this._bins.length;
	var bin2 = Math.ceil(ratio)%this._bins.length;
	var per2 = ratio - bin1;
	var per1 = 1.0 - per2;
	this._bins[bin1] += per1*mag;
	this._bins[bin2] += per2*mag;
}
GradBinDescriptor._temp = new V2D();
GradBinDescriptor.prototype.addVector = function(x,y,m){
	if( !Code.isNumber(x) ){
		this.addAngle(V2D.angleDirection(V2D.DIRX,x),y);
	}else{
		GradBinDescriptor._temp.set(x,y);
		this.addAngle(V2D.angleDirection(V2D.DIRX,GradBinDescriptor._temp),m);
	}
}
GradBinDescriptor.prototype.area = function(){
	var sum = 0.0, len = this._bins.length, bins = this._bins;
	for(i=0;i<len;++i){
		sum += bins[i];
	}
	return sum;
}
GradBinDescriptor.prototype.toString = function(){ // console.log( Code.toStringArray2D(this._bins, this._bins.length,1, 6) );
	var i, len=this._bins.length, str = "";
	str += "-------\n";
	for(i=0;i<len;++i){
		str += "|"+Code.prependFixed(" "+(i*360.0/(len))+" "," ",5);
		str += "|"+Code.prependFixed("","*",Math.round(this._bins[i]));
		str += "\n";
	}
	str += "-------\n";
	return str;
}

