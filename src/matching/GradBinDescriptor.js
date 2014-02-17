// GradBinDescriptor.js
GradBinDescriptor.BIN_COUNT = 8;
function GradBinDescriptor(r,g,b){
	this._bin = new Array(GradBinDescriptor.BIN_COUNT);
	this.clearBins();
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
GradBinDescriptor.prototype.clearBins = function(){
	var i, len = this._bin.length;
	for(i=0;i<len;++i){
		this._bin[i] = 0;
	}
}
GradBinDescriptor.prototype.addBin = function(bin){
	this._bin[bin]++;
}
GradBinDescriptor.prototype.addAngleBin = function(angle){
	// offset half of count angle
	angle = Code.zeroTwoPi(angle-GradBinDescriptor.BIN_COUNT/(2.0*Math.PI));
	var bin = Math.floor(GradBinDescriptor.BIN_COUNT*(angle/(2.0*Math.PI)));
	this.addBin(bin);
}
GradBinDescriptor._temp = new V2D();
GradBinDescriptor._xDir = new V2D(1,0);
GradBinDescriptor.prototype.addGradient = function(x,y){
	var dir = GradBinDescriptor._temp, xDir = GradBinDescriptor._xDir;
	dir.set(x,y);
	var angle = V2D.angleDirection(xDir,dir);
	this.addAngleBin(angle);
}

