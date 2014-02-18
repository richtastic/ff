// SIFTDescriptor.js
SIFTDescriptor.BIN_COUNT = 8;
function SIFTDescriptor(r,g,b){
	this._binTL = new GradBinDescriptor(SIFTDescriptor.BIN_COUNT);
	this._binTR = new GradBinDescriptor(SIFTDescriptor.BIN_COUNT);
	this._binBL = new GradBinDescriptor(SIFTDescriptor.BIN_COUNT);
	this._binBR = new GradBinDescriptor(SIFTDescriptor.BIN_COUNT);
}
SIFTDescriptor._dirX = new V2D(1,0);
SIFTDescriptor.prototype.fromGradients = function(Ix,Iy,w,h){
	var i, j, bin, cenX = Math.floor(w*0.5), cenY = Math.floor(h*0.5), v = new V2D(), x = SIFTDescriptor._dirX;
	this.clear();
	for(i=cenX-4;i<cenX+4;++i){ // TL
		for(j=cenY-4;j<cenY+4;++j){
			if(i<cenX){
				if(j<cenX){
					bin = this._binTL;
				}else{
					bin = this._binBL;
				}
			}else{
				if(j<cenX){
					bin = this._binTR;
				}else{
					bin = this._binBR;
				}
			}
			v.set(Ix[w*j + i], Iy[w*j + i]);
			ang = V2D.angleDirection(x,v);
			bin.addAngle(ang);
		}
	}
}
SIFTDescriptor.compare = function(descA,descB){
	var score = 0;
	score += GradBinDescriptor.compare(descA._binTL,descB._binTL);
	score += GradBinDescriptor.compare(descA._binTR,descB._binTR);
	score += GradBinDescriptor.compare(descA._binBL,descB._binBL);
	score += GradBinDescriptor.compare(descA._binBR,descB._binBR);
	return score*0.25;
}
SIFTDescriptor.prototype.clear = function(){
	this._binTL.clear();
	this._binTR.clear();
	this._binBL.clear();
	this._binBR.clear();
}
SIFTDescriptor.prototype.toString = function(){
	var str = "[SIFTDescriptor]++++++++++++++++++++++++++++++++++++++++\n";
	str += this._binTL.toString();
	str += this._binTR.toString();
	str += this._binBL.toString();
	str += this._binBR.toString();
	return str;
}
