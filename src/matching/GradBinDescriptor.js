// GradBinDescriptor.js
GradBinDescriptor.BIN_COUNT = 8;
function GradBinDescriptor(count){
	count = (count!==undefined)?count:GradBinDescriptor.BIN_COUNT;
	this._bins = new Array(count);
	this.clear();
}
GradBinDescriptor.compare = function(binA,binB){ //////////////////////////////////////////////////// ?
	var i, len = Math.min(binA.binLength(),binB.binLength());
	var score = 0, sumA = binA.area(), sumB = binA.area();
	sumA = sumA>0?sumA:1.0;
	sumB = sumB>0?sumB:1.0;
	for(i=0;i<len;++i){
		score += binA._bin[i]*binB._bin[i];
	}
	score *= 1.0/(sumA,sumB);
	return score;
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

