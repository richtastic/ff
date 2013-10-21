// ImageMat.js
function ImageMat(wid, hei){
	this._width = wid;
	this._height = hei;
	this._r = new Array(wid*hei);
	this._g = new Array(wid*hei);
	this._b = new Array(wid*hei);
}
ImageMat.prototype.setFromArrayARGB = function(data){
	var i, len = this._r.length;
	for(i=0;i<len;++i){
		this._r[i] = Code.getRedARGB(data[i]);
		this._g[i] = Code.getGrnARGB(data[i]);
		this._b[i] = Code.getBluARGB(data[i]);
	}
}
ImageMat.prototype.getArrayARGB = function(){
	var i, len = this._r.length;
	var data = new Array(len);
	for(i=0;i<len;++i){
		data[i] = Code.getColARGB( 0xFF, this._r[i], this._g[i], this._b[i] );
	}
	return data;
}
// ------------------------------------------------------------------------------------------------------------------------ utilities
ImageMat.colorArrayFxnRGB_ARGB = function(data, fxn){
	var i, len=data.length, col, r,g,b,a;
	for(i=0;i<data.length;++i){
		col = data[i];
		r = Code.getRedARGB(col); g = Code.getGrnARGB(col); b = Code.getBluARGB(col); a = Code.getAlpARGB(col);
		r = fxn(r);
		g = fxn(g);
		b = fxn(b);
		data[i] = Code.getColARGB(a,r,g,b);
	}
}
ImageMat.colorArrayFxnARGB_ARGB = function(data, fxnA, fxnR, fxnG, fxnB){
	var i, len=data.length, col, r,g,b,a;
	for(i=0;i<data.length;++i){
		col = data[i];
		r = Code.getRedARGB(col); g = Code.getGrnARGB(col); b = Code.getBluARGB(col); a = Code.getAlpARGB(col);
		data[i] = Code.getColARGB(fxnA(a),fxnR(r),fxnG(g),fxnB(b));
	}
}
// ------------------------------------------------------------------------------------------------------------------------ image operations
ImageMat.colorize = function(c){
	var rnd = 50;
	return Math.round(Math.round(c/rnd)*rnd);
}

