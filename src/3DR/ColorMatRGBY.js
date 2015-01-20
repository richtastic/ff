// ColorMatRGBY.js
function ColorMatRGBY(r,g,b,y, wid,hei){
	this._wid = wid;
	this._hei = hei;
	var i, len = wid*hei;
	this._red = new Array(len);
	this._grn = new Array(len);
	this._blu = new Array(len);
	this._gry = new Array(len);
	for(i=0;i<len;++i){ // is copying necessary?
		this._red[i] = r[i];
		this._grn[i] = g[i];
		this._blu[i] = b[i];
		this._gry[i] = y[i];
	}
}
ColorMatRGBY.prototype.normalize = function(){
	ImageMat.normalFloat01(this._red);
	ImageMat.normalFloat01(this._grn);
	ImageMat.normalFloat01(this._blu);
	ImageMat.normalFloat01(this._gry);
}
ColorMatRGBY.prototype.width = function(){
	return this._wid;
}
ColorMatRGBY.prototype.height = function(){
	return this._hei;
}
ColorMatRGBY.prototype.red = function(){
	return this._red;
}
ColorMatRGBY.prototype.grn = function(){
	return this._grn;
}
ColorMatRGBY.prototype.blu = function(){
	return this._blu;
}
ColorMatRGBY.prototype.gry = function(){
	return this._gry;
}
ColorMatRGBY.prototype.uniqueness = function(){
	return this._ranger(this._red) * this._ranger(this._grn) * this._ranger(this._blu);
}
ColorMatRGBY.prototype._ranger = function(a){
	var maxA = Math.max.apply(this,a);
	var minA = Math.min.apply(this,a);
	var rangeA = (maxA-minA);
	return rangeA;
}
ColorMatRGBY.SSD = function(a,b){
	var rA = a.red(), rB = b.red();
	var gA = a.grn(), gB = b.grn();
	var bA = a.blu(), bB = b.blu();
	var yA = a.gry(), yB = b.gry();
	var ssdR = ColorMatRGBY._SSD(rA,rB);
	var ssdG = ColorMatRGBY._SSD(gA,gB);
	var ssdB = ColorMatRGBY._SSD(bA,bB);
	var ssdY = ColorMatRGBY._SSD(yA,yB);
	return (ssdR + ssdG + ssdB)*(1.0/3.0);
	//return (ssdR + ssdG + ssdB + ssdY)*0.25;
	//return ssdY;
}
ColorMatRGBY._SSD = function(a,b){
	var ssd = 0;
	var maxA = Math.max.apply(this,a);
	var minA = Math.min.apply(this,a);
	var rangeA = 1/(maxA-minA);
	var maxB = Math.max.apply(this,b);
	var minB = Math.min.apply(this,b);
	var rangeB = 1/(maxB-minB);
	for(var i=a.length;i--;){
		ssd += Math.pow( rangeA*(a[i]-minA) - rangeB*(b[i]-minB),2);
		//ssd += Math.pow(a[i]-b[i],2);
	}
	return ssd;
}

ColorMatRGBY.convolution = function(a,b){
	var rA = a.red(), rB = b.red();
	var gA = a.grn(), gB = b.grn();
	var bA = a.blu(), bB = b.blu();
	var yA = a.gry(), yB = b.gry();
	var convR = ColorMatRGBY._conv(rA,rB);
	var convG = ColorMatRGBY._conv(gA,gB);
	var convB = ColorMatRGBY._conv(bA,bB);
	var convY = ColorMatRGBY._conv(yA,yB);
	return (convR + convG + convB + convY)*0.25;
}
ColorMatRGBY._conv = function(a,b){
	var maxA = Math.max.apply(this,a);
	var minA = Math.min.apply(this,a);
	var rangeA = 1/(maxA-minA);
	var maxB = Math.max.apply(this,b);
	var minB = Math.min.apply(this,b);
	var rangeB = 1/(maxB-minB);
	//var maxA=0, maxB=0, sumA=0, sumB=0;
	var conv=0;
	for(var i=a.length;i--;){
		//sumA += a[i]; sumB += b[i];
		//maxA = Math.max(maxA,a[i]); maxB = Math.max(maxB,b[i]);
		conv +=  rangeA*(a[i]-minA) * rangeB*(b[i]-minB);
	}
	return conv;
	//return conv/(maxA*maxB);
	//return conv/(sumA*sumB);
}
