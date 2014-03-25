// SIFTDescriptor.js
SIFTDescriptor.BIN_COUNT = 8;
SIFTDescriptor.BIN_COUNT_OVERALL = 36;
//SIFTDescriptor.GAUSSIAN = ImageMat.getGaussianWindowSimple(16,16, 8);
function SIFTDescriptor(){
	this._width = 4;
	this._height = 4;
	this._bins = new Array(this._width*this._height);
	for(var i=0;i<this._bins.length;++i){
		this._bins[i] = new GradBinDescriptor(SIFTDescriptor.BIN_COUNT);
	}
}

SIFTDescriptor.gaussian = function(){
	return ImageMat.getGaussianWindowSimple(16,16, 8);
}
SIFTDescriptor.compare = function(descA,descB){
	var score = 0;
	for(var i=0;i<this._bins.length;++i){
		score += GradBinDescriptor.compare(descA._bins[i],descB._bins[i]);
	}
	return score;
}
SIFTDescriptor.findMaximumOrientations = function(Ix,Iy,gauss,w,h){
	var bin = new GradBinDescriptor(SIFTDescriptor.BIN_COUNT_OVERALL);
	// 36/64 ~2 per bin
	// - find all maximal orientations (interpolate) - 80% threshold
	return new Array();
}



SIFTDescriptor.prototype.normalize = function(){
	// set all bins to max(bin)=1.0:0
	// cut off any bin maximum to 0.2 - 
	// renormalize
}
SIFTDescriptor.prototype.fromGradients = function(Ix,Iy,gauss,w,h){
	var i, j, x, y, bin, cenX = Math.floor(w*0.5), cenY = Math.floor(h*0.5);
	var cntW = w/this._width, cntH = h/this._height;
	this.clear();
	var index = 0;
	for(j=0;j<h;++j){
		for(i=0;i<w;++i,++index){
			bin = Math.floor(j/cntH)*this._width + Math.floor(i/cntW);
			this._bins[bin].addVector(Ix[index], Iy[index], Math.sqrt( Math.pow(Ix[index],2)+Math.pow(Iy[index],2) )*gauss[index]);
		}
	}
}
SIFTDescriptor.prototype.clear = function(){
	for(var i=0;i<this._bins.length;++i){
		this._bins[i].clear();
	}
}
SIFTDescriptor.prototype.kill = function(){
	for(var i=0;i<this._bins.length;++i){
		this._bins[i].kill();
	}
	Code.emptyArray(this._bins);
	this._bins = null;
	this._width = 0;
	this._height = 0;
}
SIFTDescriptor.prototype.toString = function(){
	var b = this._bins;
	var i, len, j, bin, max = 16;
	var str = "";
	len = b[0]._bins.length;
	for(j=0;j<len;++j){
		str += "|"+Code.prependFixed(" "+(j*360.0/(len))+" "," ",5);
		for(i=0;i<b.length;++i){
			bin = b[i]._bins;
			str += "|";
			str += Code.postpendFixed(Code.prependFixed("","*",bin[j])," ",max);
		}
		str += "\n";
	}
	return str;
}
