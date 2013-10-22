// ImageMat.js
function ImageMat(wid, hei){
	this._width = wid;
	this._height = hei;
	this._r = new Array(wid*hei);
	this._g = new Array(wid*hei);
	this._b = new Array(wid*hei);
}
// ------------------------------------------------------------------------------------------------------------------------ get
ImageMat.prototype.getRedFloat = function(){
	return Code.copyArray(new Array(), this._r);
}
ImageMat.prototype.getGrnFloat = function(){
	return Code.copyArray(new Array(), this._g);
}
ImageMat.prototype.getBluFloat = function(){
	return Code.copyArray(new Array(), this._b);
}
ImageMat.prototype.getGrayFloat = function(){
	var i, len = this._r.length;
	var a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = (this._r[i]+this._g[i]+this._b[i])/3.0;
	}
	return a;
}
ImageMat.prototype.getArrayARGB = function(){
	var i, len = this._r.length;
	var data = new Array(len);
	for(i=0;i<len;++i){
		data[i] = Code.getColARGB( 0xFF, Math.round(this._r[i]*255.0), Math.round(this._g[i]*255.0), Math.round(this._b[i]*255.0) );
	}
	return data;
}
// ------------------------------------------------------------------------------------------------------------------------ set
ImageMat.prototype.setFromArrayARGB = function(data){
	var i, len = this._r.length;
	for(i=0;i<len;++i){
		this._r[i] = Code.getRedARGB(data[i])/255.0;
		this._g[i] = Code.getGrnARGB(data[i])/255.0;
		this._b[i] = Code.getBluARGB(data[i])/255.0;
	}
}
ImageMat.prototype.setRedFromFloat = function(a){
	var i, len1=Math.min(this._r.length,a.length), len2=this._r.length;
	for(i=0;i<len1;++i){ this._r[i] = a[i]; }
	for(;i<len2;++i){ this._r[i] = 0.0; }
}
ImageMat.prototype.setGrnFromFloat = function(a){
	var i, len1=Math.min(this._g.length,a.length), len2=this._g.length;
	for(i=0;i<len1;++i){ this._g[i] = a[i]; }
	for(;i<len2;++i){ this._g[i] = 0.0; }
}
ImageMat.prototype.setBluFromFloat = function(a){
	var i, len1=Math.min(this._b.length,a.length), len2=this._b.length;
	for(i=0;i<len1;++i){ this._b[i] = a[i]; }
	for(;i<len2;++i){ this._b[i] = 0.0; }
}
ImageMat.prototype.setFromFloats = function(r,g,b){
	this.setRedFromFloat(r);
	this.setGrbFromFloat(g);
	this.setBluFromFloat(b);
}
// ------------------------------------------------------------------------------------------------------------------------ utilities
ImageMat.zero255FromFloat = function(data){
	var i, len = data.length;
	var col, a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = Math.round(data[i]*255.0);
	}
	return a;
}
ImageMat.ARGBFromFloat = function(data){
	var i, len = data.length;
	var col, a = new Array(len);
	for(i=0;i<len;++i){
		col = Math.round(data[i]*255.0);
		a[i] = Code.getColARGB( 0xFF, col, col, col);
	}
	return a;
}
ImageMat.ARGBFromRGBArrays = function(r,g,b){
	var i, len = r.length;
	var col, a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = Code.getColARGB( 0xFF, r[i], g[i], b[i]);
	}
	return a;
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
ImageMat.colorize = function(c, rnd){ // var rnd = 50;
	return Math.round(Math.round(c/rnd)*rnd);
}


// ------------------------------------------------------------------------------------------------------------------------ fxns
ImageMat.convolve = function(image,imageWidth,imageHeight, operator,operatorWidth,operatorHeight){
	var total = imageWidth*imageHeight;
	var i, j, n, m, sum;
	var result = new Array(total);
	for(i=0;i<total;++i){
		result[i] = 0.0;
	}
	for(i=operatorWidth;i<imageWidth-operatorWidth;++i){
		for(j=operatorHeight;j<imageHeight-operatorHeight;++j){
			sum = 0.0;
			for(n=0;n<operatorWidth;++n){
				for(m=0;m<operatorHeight;++m){
					sum += image[(j-m)*imageWidth+(i+n)]*operator[m*operatorWidth+n];
				}
			}
			result[j*imageWidth+i] = sum;
		}
	}
	return result;
}
ImageMat.historize0255 = function(data){
	var i, len = data.length;
	var bins = new Array(256);
	var result = new Array(len);
	for(i=0;i<256;++i){ bins[i]=0; }
	for(i=0;i<len;++i){ bins[data[i]]++; } // pdf
	for(i=1;i<256;++i){ bins[i] += bins[i-1]; } // cdf
	var min = bins[0], max = bins[255];
	var range = max - min;
	for(i=0;i<256;++i){
		bins[i] = Math.round(255.0*(bins[i]-min)/range);
	}
	for(i=0;i<len;++i){ 
		result[i] = bins[ data[i] ];
	}
	return result;
}
ImageMat.rangeStretch0255 = function(data){
	var i, len = data.length;
	var result = new Array(len);
	var min = data[0], max = data[0];
	for(i=1;i<len;++i){
		min = Math.min(min,data[i]);
		max = Math.max(max,data[i]);
	}
	var range = max-min;
	for(i=0;i<len;++i){ 
		result[i] = Math.round(255.0*(data[i]-min)/range);
	}
	return result;
}
// ------------------------------------------------------------------------------------------------------------------------ maths
ImageMat.squareFloat = function(data){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = data[i]*data[i];
	}
}
ImageMat.vectorSumFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = Math.sqrt(a[i]*a[i],b[i]*b[i]);
	}
	return result;
}
ImageMat.vectorSquaredSumFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = a[i]*a[i],b[i]*b[i];
	}
	return result;
}
ImageMat.absFloat = function(a){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = Math.abs(a[i]);
	}
	return result;
}
ImageMat.addFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = a[i]+b[i];
	}
	return result;
}
ImageMat.mulFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = a[i]*b[i];
	}
	return result;
}
ImageMat.phaseFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = Math.atan2(b[i],a[i]);
	}
	return result;
}
ImageMat.normalFloat01 = function(data){
	var i, len = data.length;
	var max = data[0], min = data[0];
	for(i=1;i<len;++i){
		max = Math.max(max,data[i]);
		min = Math.min(min,data[i]);
	}
	var range = max - min;
	for(i=0;i<len;++i){
		data[i] = (data[i]-min)/range;
	}
}
ImageMat.applyFxnFloat = function(data,fxn){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = fxn(data[i]);
	}
}





