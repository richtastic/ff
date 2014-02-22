// GradBinDescriptor.js
GradBinDescriptor.BIN_COUNT = 8;
function GradBinDescriptor(count){
	count = (count!==undefined)?count:GradBinDescriptor.BIN_COUNT;
	this._bin = new Array(count);
	this.clear();
}
GradBinDescriptor.compare = function(binA,binB){
	var i, len=GradBinDescriptor.BIN_COUNT;
	var max = 0;
	for(i=0;i<len;++i){
		max = Math.max(binA._bin[i],max);
		max = Math.max(binB._bin[i],max);
	}
	var score = 0;
	for(i=0;i<len;++i){
		score += binA._bin[i]*binB._bin[i];
	}
	score *= 1.0/(max*max);
	return score;
}
GradBinDescriptor.prototype.clear = function(){
	var i, len = this._bin.length;
	for(i=0;i<len;++i){
		this._bin[i] = 0;
	}
}
GradBinDescriptor.prototype.addBin = function(bin){
	this._bin[bin]++;
}
GradBinDescriptor.prototype.addAngleBin = function(angle){
	//angle = Code.angleZeroTwoPi(angle-GradBinDescriptor.BIN_COUNT/(2.0*Math.PI));
	var bin = Math.floor(GradBinDescriptor.BIN_COUNT*(angle/(2.0*Math.PI)));
	this.addBin(bin);
}
GradBinDescriptor._temp = new V2D();
GradBinDescriptor._xDir = new V2D(1,0);
GradBinDescriptor.prototype.addAngle = function(angle){
	this.addAngleBin(angle);
}
GradBinDescriptor.prototype.addVector = function(x,y){
	var dir = GradBinDescriptor._temp, xDir = GradBinDescriptor._xDir;
	dir.set(x,y);
	var angle = V2D.angleDirection(xDir,dir);
	this.addAngleBin(angle);
}
GradBinDescriptor.prototype.toString = function(){
	var i, len=this._bin.length, str = "";
	str += "-------\n";
	for(i=0;i<len;++i){
		str += "|"+Code.prependFixed(" "+(i*360.0/(len))+" "," ",5);
		str += "|"+Code.prependFixed("","*",this._bin[i]);
		str += "\n";
	}
	str += "-------\n";
	return str;
}
