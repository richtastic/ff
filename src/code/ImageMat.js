// ImageMat.js
ImageMat.tempA = new V3D();
ImageMat.tempB = new V3D();
ImageMat.tempC = new V3D();
ImageMat.tempD = new V3D();
ImageMat.tempE = new V3D();
ImageMat.tempF = new V3D();
ImageMat.tempG = new V3D();
ImageMat.tempH = new V3D();
ImageMat.tempI = new V3D();
ImageMat.tempJ = new V3D();
ImageMat.tempK = new V3D();
ImageMat.tempL = new V3D();
ImageMat.tempM = new V3D();
ImageMat.tempN = new V3D();
ImageMat.tempO = new V3D();
ImageMat.tempP = new V3D();
function ImageMat(wid, hei, r,g,b){
	this.init(wid,hei,r,g,b);
}
ImageMat.prototype.init = function(wid,hei,r,g,b){
	this._width = wid;
	this._height = hei;
	if(wid>0 && hei>0){
		var len = wid*hei;
		this._r = new Array(len);
		this._g = new Array(len);
		this._b = new Array(len);
		if(r!=undefined){
			if(g!==undefined && b!==undefined){
				this.setFromFloats(r,g,b);
			}else{
				this.setFromFloats(r,r,r);
			}
		}
	}
}

ImageMat.prototype.zeroAll = function(){
	var i, len = this._width*this._height;
	for(i=0;i<len;++i){
		this._r[i] = 0;
		this._g[i] = 0;
		this._b[i] = 0;
	}
}
ImageMat.prototype.to3Array = function(){
	return [this._r,this._g,this._b, this._width,this._height];
}
ImageMat.prototype.unset = function(){
	this._width = undefined;
	this._height = undefined;
	this._r = null;
	this._g = null;
	this._b = null;
}
ImageMat.prototype.kill = function(){
	Code.emptyArray(this._r);
	Code.emptyArray(this._g);
	Code.emptyArray(this._b);
	this.unset();
}
// ------------------------------------------------------------------------------------------------------------------------ funziez
ImageMat.prototype.setPoint = function(x,y, val){
	var index = y*this.width() + x;
	this._r[index] = val.x;
	this._g[index] = val.y;
	this._b[index] = val.z;
}
ImageMat.prototype.getPoint = function(val, x,y){
	this.getPointInterpolateCubic(val,x,y);
	//return getPointInterpolateNearest(val,x,y);
}
ImageMat.prototype.getPointInterpolateCubic = function(val, x,y){ // 4^2 = 16 points
	var wid = this._width, hei = this._height, r = this._r, g = this._g, b = this._b;
	var hm1 = hei-1, wm1 = wid-1;
	var minX = Math.min( Math.max(Math.floor(x), 0), wm1);
	var minY = Math.min( Math.max(Math.floor(y), 0), hm1);
	var miiX = Math.max(minX-1, 0);
	var miiY = Math.max(minY-1, 0);
	var maxX = Math.max( Math.min(Math.ceil(x), wm1), 0);
	var maxY = Math.max( Math.min(Math.ceil(y), hm1), 0);
	var maaX = Math.min(maxX+1, wm1);
	var maaY = Math.min(maxY+1, hm1);
	var indexA = miiY*wid + miiX; var colA = ImageMat.tempA.set(r[indexA],g[indexA],b[indexA]);
	var indexB = miiY*wid + minX; var colB = ImageMat.tempB.set(r[indexB],g[indexB],b[indexB]);
	var indexC = miiY*wid + maxX; var colC = ImageMat.tempC.set(r[indexC],g[indexC],b[indexC]);
	var indexD = miiY*wid + maaX; var colD = ImageMat.tempD.set(r[indexD],g[indexD],b[indexD]);
	var indexE = minY*wid + miiX; var colE = ImageMat.tempE.set(r[indexE],g[indexE],b[indexE]);
	var indexF = minY*wid + minX; var colF = ImageMat.tempF.set(r[indexF],g[indexF],b[indexF]);
	var indexG = minY*wid + maxX; var colG = ImageMat.tempG.set(r[indexG],g[indexG],b[indexG]);
	var indexH = minY*wid + maaX; var colH = ImageMat.tempH.set(r[indexH],g[indexH],b[indexH]);
	var indexI = maxY*wid + miiX; var colI = ImageMat.tempI.set(r[indexI],g[indexI],b[indexI]);
	var indexJ = maxY*wid + minX; var colJ = ImageMat.tempJ.set(r[indexJ],g[indexJ],b[indexJ]);
	var indexK = maxY*wid + maxX; var colK = ImageMat.tempK.set(r[indexK],g[indexK],b[indexK]);
	var indexL = maxY*wid + maaX; var colL = ImageMat.tempL.set(r[indexL],g[indexL],b[indexL]);
	var indexM = maaY*wid + miiX; var colM = ImageMat.tempM.set(r[indexM],g[indexM],b[indexM]);
	var indexN = maaY*wid + minX; var colN = ImageMat.tempN.set(r[indexN],g[indexN],b[indexN]);
	var indexO = maaY*wid + maxX; var colO = ImageMat.tempO.set(r[indexO],g[indexO],b[indexO]);
	var indexP = maaY*wid + maaX; var colP = ImageMat.tempP.set(r[indexP],g[indexP],b[indexP]);
	if(miiX<0||minX<0||maxX>wm1||maaX>wm1 || miiY<0||minY<0||maxY>hm1||maaY>hm1){
		throw("undefined");
	}
	minX = x - minX;
	minY = y - minY;
	ImageMat.cubicColor(val, minX,minY, colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP);
}
ImageMat.prototype.getPointInterpolateQuadric = function(val, x,y){ // 3^2 = 9 points
	// this maaaaaaaay not be useful
}
ImageMat.prototype.getPointInterpolateLinear = function(val, x,y){ // 2^2 = 4 points [BiLinear]
	var wid = this._width, hei = this._height, r = this._r, g = this._g, b = this._b;
	var hm1 = hei-1, wm1 = wid-1;
	var minX = Math.min( Math.max(Math.floor(x), 0), wm1);
	var minY = Math.min( Math.max(Math.floor(y), 0), hm1);
	var maxX = Math.max( Math.min(Math.ceil(x), wm1), 0);
	var maxY = Math.max( Math.min(Math.ceil(y), hm1), 0);
	var indexA = minY*wid + minX; var colA = ImageMat.tempA.set(r[indexA],g[indexA],b[indexA]);
	var indexB = minY*wid + maxX; var colB = ImageMat.tempB.set(r[indexB],g[indexB],b[indexB]);
	var indexC = maxY*wid + minX; var colC = ImageMat.tempC.set(r[indexC],g[indexC],b[indexC]);
	var indexD = maxY*wid + maxX; var colD = ImageMat.tempD.set(r[indexD],g[indexD],b[indexD]);
	minX = x - minX;
	if(x<0||x>wid){ minX=0.0;}
	minY = y - minY;
	if(y<0||y>hei){ minY=0.0;}
	ImageMat.linearColor(val, minX,minY, colA,colB,colC,colD);
}
ImageMat.prototype.getPointInterpolateNearest = function(val, x,y){ // 1 point
	x = Math.min(Math.max(Math.round(x),0),this._width-1);
	y = Math.min(Math.max(Math.round(y),0),this._height-1);
	index = y*this._width + x;
	val.x = this._r[index];
	val.y = this._g[index];
	val.z = this._b[index];
}
ImageMat.cubicColor = function(colR, x,y, colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP){
	var r = ImageMat.cubic2D(x,y, colA.x,colB.x,colC.x,colD.x,colE.x,colF.x,colG.x,colH.x,colI.x,colJ.x,colK.x,colL.x,colM.x,colN.x,colO.x,colP.x);
	var g = ImageMat.cubic2D(x,y, colA.y,colB.y,colC.y,colD.y,colE.y,colF.y,colG.y,colH.y,colI.y,colJ.y,colK.y,colL.y,colM.y,colN.y,colO.y,colP.y);
	var b = ImageMat.cubic2D(x,y, colA.z,colB.z,colC.z,colD.z,colE.z,colF.z,colG.z,colH.z,colI.z,colJ.z,colK.z,colL.z,colM.z,colN.z,colO.z,colP.z);
	colR.x = Math.min(Math.max(r,0.0),1.0);
	colR.y = Math.min(Math.max(g,0.0),1.0);
	colR.z = Math.min(Math.max(b,0.0),1.0);
}
ImageMat.cubic2D = function(x,y, A,B,C,D, E,F,G,H, I,J,K,L, M,N,O,P){
	var xx = x*x; var xxx = xx*x;
	var yy = y*y; var yyy = yy*y;
	var a = ImageMat.cubic1D(x,xx,xxx, A,B,C,D);
	var b = ImageMat.cubic1D(x,xx,xxx, E,F,G,H);
	var c = ImageMat.cubic1D(x,xx,xxx, I,J,K,L);
	var d = ImageMat.cubic1D(x,xx,xxx, M,N,O,P);
	return ImageMat.cubic1D(y,yy,yyy, a,b,c,d);
}
ImageMat.cubic1D = function(t,tt,ttt,A,B,C,D){
	var a = B;
	var b = 0.5*(C-A);
	var c = A - 2.5*B + 2.0*C - 0.5*D;
	var d = 1.5*(B-C) + 0.5*(D-A);
	return (a + b*t + c*tt + d*ttt);
}
ImageMat.linear2D = function(x,y, colA,colB,colC,colD){
	return Code.linear2D(x,y, colA,colB,colC,colD);
}
ImageMat.linearColor = function(colR, x,y, colA,colB,colC,colD){
	var r = Code.linear2D(x,y, colA.x,colB.x,colC.x,colD.x);
	var g = Code.linear2D(x,y, colA.y,colB.y,colC.y,colD.y);
	var b = Code.linear2D(x,y, colA.z,colB.z,colC.z,colD.z);
	colR.x = Math.min(Math.max(r,0.0),1.0);
	colR.y = Math.min(Math.max(g,0.0),1.0);
	colR.z = Math.min(Math.max(b,0.0),1.0);
}

// ------------------------------------------------------------------------------------------------------------------------ get
ImageMat.prototype.copy = function(){
	var mat = new ImageMat(this.width(), this.height(), this.red(), this.grn(), this.blu());
	return mat;
}
ImageMat.prototype.red = function(r){
	if(r!==undefined){
		Code.copyArray(this._r, r);
	}
	return this._r;
}
ImageMat.prototype.grn = function(g){
	if(g!==undefined){
		Code.copyArray(this._g, g);
	}
	return this._g;
}
ImageMat.prototype.blu = function(b){
	if(b!==undefined){
		Code.copyArray(this._b, b);
	}
	return this._b;
}
ImageMat.prototype.gry = function(){
	return ImageMat.grayFromRGBFloat(this._r,this._g,this._b);
}
ImageMat.prototype.width = function(w){
	// if(w!==undefined){
	// 	this._width = w;
	// }
	return this._width;
}
ImageMat.prototype.height = function(h){
	// if(h!==undefined){
	// 	this._height = h;
	// }
	return this._height;
}
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
	return ImageMat.grayFromRGBFloat(this._r, this._g, this._b);
}
ImageMat.prototype.getArrayARGB = function(){
	var i, len = this._r.length;
	var data = new Array(len);
	for(i=0;i<len;++i){
		data[i] = Code.getColARGB( 0xFF, Math.round(this._r[i]*255.0), Math.round(this._g[i]*255.0), Math.round(this._b[i]*255.0) );
	}
	return data;
}
ImageMat.prototype.getSubImageIndex = function(colSta,colEnd, rowSta,rowEnd){
	var i, j, index, ind;
	var wid = colEnd-colSta+1;
	var hei = colEnd-colSta+1;
	var len = wid*hei;
	var r = new Array(len), g = new Array(len), b = new Array(len);
	for(index=0, j=rowSta;j<=rowEnd;++j){
		for(i=colSta;i<=colEnd;++i,++index){
			ind = j*this._width + i;
			r[index] = this._r[ind];
			g[index] = this._g[ind];
			b[index] = this._b[ind];
		}
	}
	var image = new ImageMat(wid,hei);
	image.setFromFloats(r,g,b);
	return image;
}
ImageMat.prototype.getSubImage = function(px,py, wid,hei){
	return ImageMat.extractRect(this, px-wid/2.0,py-hei/2.0, px+wid/2.0,py-hei/2.0, px+wid/2.0,py+hei/2.0, px-wid/2.0,py+hei/2.0, wid,hei);
}
ImageMat.prototype.getScaledImage = function(scale, sigma){
	var finalWidth = Math.floor(scale*this.width());
	var finalHeight = Math.floor(scale*this.height());
	var centerX = this.width()*0.5;
	var centerY = this.height()*0.5;
	return this.extractRectFromFloatImage(centerX,centerY,1.0/scale,sigma, finalWidth,finalHeight, null);
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
	this.setGrnFromFloat(g);
	this.setBluFromFloat(b);
	return this;
}
// ------------------------------------------------------------------------------------------------------------------------ utilities
ImageMat.newZeroFloat = function(wid,hei){
	var i, len = wid*hei;
	var a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = 0.0;
	}
	return a;
}
ImageMat.zero255FromFloat = function(data){
	var i, len = data.length;
	var col, a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = Math.round(data[i]*255.0);
	}
	return a;
}
ImageMat.FloatFromZero255 = function(data){
	var i, len = data.length;
	var col, a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = data[i]/255.0;
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
ImageMat.HSVFromRGBFloat = function(r,g,b){
	var i, len = r.length;
	var a = new Array(len);
	var hsv = new V3D();
	var rgb = new V3D();
	for(i=0;i<len;++i){
		rgb.set(r[i],g[i],b[i]);
		Code.HSVFromRGB(hsv,rgb);
		a[i] = new V3D(hsv.x,hsv.y,hsv.z);
	}
	return a;
}

ImageMat.grayFromRGBFloat = function(r,g,b){
	var i, len = r.length;
	var a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = (r[i]+g[i]+b[i])/3.0;
	}
	return a;
}

// ImageMat.grayFromFloats = function(r,g,b){
// 	var i, len = r.length;
// 	var a = new Array(len);
// 	for(i=0;i<len;++i){
// 		a[i] = (r[i]+g[i]+b[i])/3.0;
// 	}
// 	return a;
// }

ImageMat.ARGBFromFloats = function(rF,gF,bF){
	var i, len = rF.length;
	var col, r,g,b,a = new Array(len);
	for(i=0;i<len;++i){
		// r = Math.round(rF[i]*255.0);
		// g = Math.round(gF[i]*255.0);
		// b = Math.round(bF[i]*255.0);
		r = Math.min(Math.floor(rF[i]*256.0),255);
		g = Math.min(Math.floor(gF[i]*256.0),255);
		b = Math.min(Math.floor(bF[i]*256.0),255);
		// r = Math.min(Math.floor(rF[i]*256.0),200);
		// g = Math.min(Math.floor(gF[i]*256.0),200);
		// b = Math.min(Math.floor(bF[i]*256.0),200);
		// if(r>255){
		// 	r = 255;
		// }
		// if(g>255){
		// 	g = 255;
		// }
		// if(b>255){
		// 	b = 255;
		// }
		a[i] = Code.getColARGB( 0xFF, r,g,b);
	}
	return a;
}
ImageMat.ARGBFromARGBFloats = function(aF,rF,gF,bF){
	var i, len = rF.length;
	var col, r,g,b,a, aa = new Array(len);
	for(i=0;i<len;++i){
		r = Math.round(rF[i]*255.0);
		g = Math.round(gF[i]*255.0);
		b = Math.round(bF[i]*255.0);
		a = Math.round(aF[i]*255.0);
		aa[i] = Code.getColARGB(a,r,g,b);
	}
	return aa;
}
ImageMat.ARGBFromRGBArrays = function(r,g,b){
	var i, len = r.length;
	var col, a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = Code.getColARGB( 0xFF, r[i], g[i], b[i]);
	}
	return a;
}
ImageMat.getFloats01FromARGB255 = function(argb){
	var i, len = argb.length;
	var a = new Array();
	var r = new Array();
	var g = new Array();
	var b = new Array();
	for(i=0;i<len;++i){
		a[i] = Code.getAlpARGB(argb[i])/255.0;
		r[i] = Code.getRedARGB(argb[i])/255.0;
		g[i] = Code.getGrnARGB(argb[i])/255.0;
		b[i] = Code.getBluARGB(argb[i])/255.0;
	}
	return [a,r,g,b];
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
// ------------------------------------------------------------------------------------------------------------------------ interpolations
ImageMat.rotateImage = function(){
	// ?
}
// ------------------------------------------------------------------------------------------------------------------------ image operations
ImageMat.gaussianWindow1DFromSigma = function(sigma, bas, inc, does){
	bas = bas!==undefined?bas:2;
	inc = inc!==undefined?inc:2;
	var size = Math.round(bas + sigma*inc)*2+1;
	if(does){
		return ImageMat.getGaussianWindow(size,1, sigma,sigma, true);
	}
	return ImageMat.getGaussianWindow(size,1, sigma);
	// SHOULD USE A 1D GENERATOR HERE
}
ImageMat.getGaussianWindow = function(width,height, sigmaX, sigmaY, normCenter, norm2){
	if(sigmaY==undefined){ sigmaY = sigmaX; }
	var len = width*height;
	var matrix = new Array(len);
	var sigSquareX = sigmaX*sigmaX;
	var sigSquareY = sigmaY*sigmaY;
	var cX = 1/(2*sigSquareX);
	var cY = 1/(2*sigSquareY);
	var wo2 = Math.floor(width*0.5);
	var ho2 = Math.floor(height*0.5);
	var i, j, x, y, xx, yy, sum = 0;
	for(j=0;j<height;++j){
		y = ho2 - j; yy = y*y; 
		for(i=0;i<width;++i){
			x = wo2 - i; xx = x*x;
			val = Math.exp(-(xx*cX+yy*cY));
			matrix[j*width + i] = val;
			sum += val;
		}
	}
	if(normCenter){ // maximum == 1.0
		var sigma2 = sigmaX*sigmaY;
		val = 1/(2.0*Math.PI*sigma2);
		for(i=0;i<len;++i){ // total == 1.0
			matrix[i] *= val;
		}
	}else if(!norm2){
		for(i=0;i<len;++i){ // total == 1.0
			matrix[i] /= sum;
		}
	}
	return matrix;
}
ImageMat.getGaussianWindowSimple = function(width,height, sigma){ // === ImageMat.getGaussianWindow(width,height, sigma,sigma,true). --- to simplify: mirror 2ce
	var len = width*height;
	var matrix = new Array(len);
	var c = 1/(2*sigma*sigma);
	var wo2 = Math.floor(width*0.5);
	var ho2 = Math.floor(height*0.5);
	var i, j, x, y, xx, yy, sum = 0;
	for(j=0;j<height;++j){
		y = ho2 - j; yy = y*y; 
		for(i=0;i<width;++i){
			x = wo2 - i; xx = x*x;
			val = Math.exp(-(xx+yy)*c);
			matrix[j*width + i] = val;
			sum += val;
		}
	}
	return matrix;
}
ImageMat.getLaplaceOfGaussianWindow = function(width,height, sigma){
	var len = width*height;
	var matrix = new Array(len);
	var sigSquare = sigma*sigma;
	var c = 1/(2*sigSquare);
	var d = -1/(Math.PI*sigSquare*sigSquare)
	var wo2 = Math.floor(width*0.5);
	var ho2 = Math.floor(height*0.5);
	var i, j, x, y, xx, yy, e, sum = 0;
	for(j=0;j<height;++j){
		y = ho2 - j; yy = y*y;
		for(i=0;i<width;++i){
			x = wo2 - i; xx = x*x;
			e = (xx+yy)*c;
			val = d*(1-e)*Math.exp(-e);
			matrix[j*width + i] = val;
			sum += val;
		}
	}
	for(i=0;i<len;++i){
		matrix[i] /= sum;
	}
	return matrix;
}
ImageMat.gaussian2DFrom1DFloat = function(source, wid,hei, gauss1D){
	return ImageMat.convolve( ImageMat.convolve(source,wid,hei, gauss1D,1,gauss1D.length).value, wid,hei, gauss1D,gauss1D.length,1).value;
}


ImageMat.getCircularWindow = function(width,height, sigmaX, sigmaY){ // circular normal distribution
	return "f(r) = (1/(2*pi*s^2)) * exp(-0.5*(r/s)^2)";
}
ImageMat.toFrequencyDomain = function(image, wid,hei){ // http://homepages.inf.ed.ac.uk/rbf/HIPR2/fourier.htm
	var frequencies = new Array(wid*hei);
	var i, j, k, l, index, val;
	var cmp = new Complex(), a = new Complex(), b = new Complex();
var timeA = Code.getTimeMilliseconds();
	for(l=0;l<=0;++l){ // hei
		for(k=0;k<=0;++k){ // wid
			cmp.set(0,0);
			for(j=0;j<hei;++j){
				for(i=0;i<wid;++i){
					a.set(0, -2*Math.PI*( (i*k/wid) + (j*l/hei)) );
					Complex.mul(a,a,b);
					Complex.exp(a,a);
					b.set( image[j*wid + i] ,0);
					Complex.mul(a,a,b);
			 		Complex.add(cmp, cmp,a);
				}
			}
			console.log( " | " + cmp.toString() );
			frequencies[l*wid + j] = cmp.real(); // magnitude == all real
		}
	}
var timeB = Code.getTimeMilliseconds();
console.log("toFrequencyDomain" + " end "+ ((timeB-timeA)/1000)); // 44 seconds to 4-loop | (0.4s per loop)*300*400 = 48000s = 800min = 13.3hr
	return frequencies;
}
ImageMat.toImageDomain = function(frequencies, wid,hei){ 
	var image = new Array(wid*hei);
	var i, j, k, l;
	var cmp = new Complex(), a = new Complex(), b = new Complex();
	var wh = wid*hei;
	for(j=0;j<=0;++j){
		for(i=0;i<=0;++i){
			cmp.set(0,0);
			for(l=0;l<hei;++l){
				for(k=0;k<wid;++k){
			 		a.set(0, 2*Math.PI*( (i*k/wid) + (j*l/hei)) );
					Complex.exp(a,a);
					b.set( frequencies[l*wid + k] ,0);
					Complex.mul(a,a,b);
			 		Complex.add(cmp, cmp,a);
				}
			}
			image[j*wid + i] = val/wh;
		}
	}
	return image;
}
ImageMat.colorize = function(c, rnd){ // var rnd = 50;
	return Math.round(Math.round(c/rnd)*rnd);
}

ImageMat.expandBlob = function(a,wid,hei){
	var i, j, tl,to,tr, lf,se,ri, bl,bo,br, index;
	var wm1 = wid-1, hm1 = hei-1;
	var len = wid*hei;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = 0;
	}
	for(i=1;i<wid-1;++i){
		for(j=1;j<hei-1;++j){
			index = j*wid + i;
			tl = a[(j-1)*wid + (i-1)];
			to = a[(j-1)*wid + i];
			tr = a[(j-1)*wid + (i+1)];
			lf = a[j*wid + (i-1)];
			se = a[j*wid + i];
			ri = a[j*wid + (i+1)];
			bl = a[(j+1)*wid + (i-1)];
			bo = a[(j+1)*wid + i];
			br = a[(j+1)*wid + (i+1)];
			if( tl||to||tr|| lf||se||ri|| bl||bo||br ){
				result[index] = 1;
			}else{
				result[index] = 0;
			}
		}
	}
	return result;
}
ImageMat.retractBlob = function(a,wid,hei){
	var i, j, tl,to,tr, lf,se,ri, bl,bo,br, index;
	var wm1 = wid-1, hm1 = hei-1;
	var len = wid*hei;
	var result = new Array(len);
	for(i=0;i<wid;++i){
		for(j=0;j<hei;++j){
			index = j*wid + i;
			se = a[index];
			tl=0; to=0; tr=0; lf=0; ri=0; bl=0; bo=0; br=0;
			if(i>0){ // lefts
				lf = a[j*wid + (i-1)];
				if(j>0){
					tl = a[(j-1)*wid + (i-1)];
				}
				if(j<wm1){
					bl = a[(j+1)*wid + (i-1)];
				}
			}
			if(i<wm1){ // rights
				ri = a[j*wid + (i+1)];
				if(j<hm1){
					br = a[(j+1)*wid + (i+1)];
				}
				if(j>0){
					tr = a[(j-1)*wid + (i+1)];
				}
			}
			if(j>0){ // tops
				to = a[(j-1)*wid + i];
			}
			if(j<hm1){ // bots
				bo = a[(j+1)*wid + i];
			}
			if( tl&&to&&tr&& lf&&se&&ri&& bl&&bo&&br ){
				result[index] = 1;
			}else{
				result[index] = 0;
			}
		}
	}
	return result;
}
ImageMat.findBlobs = function(a,wid,hei){ // px,py,area
	var i, j, im1, ip1, jm1, jp1, tl,to,tr, lf,se,ri, bl,bo,br, index;
	var wm1 = wid-1, hm1 = hei-1;
	var len = wid*hei;
	var result = a;
	var loops = 0;
	var reached = 0;
	var count = 0;
	var found = true;
	var sumResult = Code.copyArray(new Array(), a);
	do{
		count = 0;
		reached = 0;
		a = result;
		result = new Array(len);
		found = false;
		for(i=0;i<wid;++i){
			for(j=0;j<hei;++j){
				index = j*wid + i;
				se = a[index];
				tl=0; to=0; tr=0; lf=0; ri=0; bl=0; bo=0; br=0;
				if(i>0){ // lefts
					lf = a[j*wid + (i-1)];
					if(j>0){
						tl = a[(j-1)*wid + (i-1)];
					}
					if(j<wm1){
						bl = a[(j+1)*wid + (i-1)];
					}
				}
				if(i<wm1){ // rights
					ri = a[j*wid + (i+1)];
					if(j<hm1){
						br = a[(j+1)*wid + (i+1)];
					}
					if(j>0){
						tr = a[(j-1)*wid + (i+1)];
					}
				}
				if(j>0){ // tops
					to = a[(j-1)*wid + i];
				}
				if(j<hm1){ // bots
					bo = a[(j+1)*wid + i];
				}
				if( tl&&to&&tr&& lf&&se&&ri&& bl&&bo&&br ){
					++reached;
					result[index] = 1;
				}else{
					result[index] = 0;
				}
			}
		}
		//Code.log(loops+": "+reached);
		++loops;
		if(reached>0){
			sumResult = ImageMat.addFloat(sumResult, result);
		}
	}while(reached>0 && loops<5);
	//console.log(((count/len)*100) + "%");
	// A:
	// count all blobs (init to -1, then go thru using max(tl,to,tr,le,se,ri,bl,bo,br) ), record center of mass
	// shrink until the number of blobs is inside the desired range => remaining blobs will be the biggest
	// B:
	// until there is nothing left:
	// OR when a blob goes to nothing, record point => largest blobs will die off last
	// shrink
	//return new Array();
	return ImageMat.getPeaks(sumResult, wid,hei);
}
ImageMat.findBlobsCOM = function(a,wid,hei){
	var a = Code.copyArray(new Array(), a);
	var blobs = new Array();
	var i, j, im1, ip1, jm1, jp1, tl,to,tr, lf,se,ri, bl,bo,br, index;
	var len = wid*hei, blob, max;
	var wm1 = wid-1, hm1 = hei-1;
	for(i=0;i<len;++i){ // all non-zero => -1, 0 => 2
		a[i] = (a[i]==0) ? -2 : -1;
	}
	blob = 0;
	for(j=0;j<hei;++j){ // assign all blobs to index
		for(i=0;i<wid;++i){
			index = j*wid + i;
			se = a[index];
			tl=-1; to=-1; tr=-1; lf=-1; ri=-1; bl=-1; bo=-1; br=-1;
			if(i>0){ // lefts
				lf = a[j*wid + (i-1)];
				if(j>0){
					tl = a[(j-1)*wid + (i-1)];
				}
				if(j<wm1){
					bl = a[(j+1)*wid + (i-1)];
				}
			}
			if(i<wm1){ // rights
				ri = a[j*wid + (i+1)];
				if(j<hm1){
					br = a[(j+1)*wid + (i+1)];
				}
				if(j>0){
					tr = a[(j-1)*wid + (i+1)];
				}
			}
			if(j>0){ // tops
				to = a[(j-1)*wid + i];
			}
			if(j<hm1){ // bots
				bo = a[(j+1)*wid + i];
			}
			if(se==-1){ // object
				max = Math.max(tl,to,tr, lf,se,ri, bl,bo,br);
				if(max==-1){// new blob
					a[index] = blob;
					blobs.push( {x:i, y:j, count:1} );
					++blob;
				}else{ // part of existing blob
					a[index] = max;
					blobs[max].x += i;
					blobs[max].y += j;
					blobs[max].count++;
				}
			}
		}
	}
	len = blobs.length;
	for(i=0;i<len;++i){
		blobs[i].count *= 1.0;
		blobs[i].x /= blobs[i].count;
		blobs[i].y /= blobs[i].count;
	}
	return blobs;
	//return a;
	/*
pass 3:
for each element, if it is nonzero
	add x,y location and area count to an array 'blobs'

for each blob, calculate com(x) = SUM OF X / TOTAL COUNT





	*/
	// 
}
ImageMat.dropBelow = function(img,value){
	var i, len = img.length;
	var a = new Array(len);
	for(i=0;i<a.length;++i){
		if(img[i]<value){
			a[i] = 0;
		}else{
			a[i] = img[i];
		}
	}
	return a;
}

// visualize peaks
ImageMat.showPeaks = function(har, wid,hei, peaks){
	var result = ImageMat.newZeroFloat(wid,hei);
	var obj, i, len = peaks.length;
	for(i=0;i<len;++i){
		obj = peaks[i];
		result[wid*Math.round(obj.y) + Math.round(obj.x)] += 1.0;//Math.abs(obj.z?obj.z:0.0);
	}
	return result;//ImageMat.normalFloat01(result);
}

ImageMat.getPeaks = function(peaks, wid,hei){ // the problem with this is it misses maxima that are erased by the retracting process - poor resolution (2-3 pixels?)
	var i, j, tl,to,tr, lf,se,ri, bl,bo,br, index;
	var wm1 = wid-1, hm1 = hei-1;
	var len = wid*hei;
	var vals = new Array();
	var max;
	var a = Code.copyArray(new Array(), peaks);
	for(i=0;i<wid;++i){
		for(j=0;j<hei;++j){
			index = j*wid + i;
			se = a[index];
			tl=0; to=0; tr=0; lf=0; ri=0; bl=0; bo=0; br=0;
			if(i>0){ // lefts
				lf = a[j*wid + (i-1)];
				if(j>0){
					tl = a[(j-1)*wid + (i-1)];
				}
				if(j<wm1){
					bl = a[(j+1)*wid + (i-1)];
				}
			}
			if(i<wm1){ // rights
				ri = a[j*wid + (i+1)];
				if(j<hm1){
					br = a[(j+1)*wid + (i+1)];
				}
				if(j>0){
					tr = a[(j-1)*wid + (i+1)];
				}
			}
			if(j>0){ // tops
				to = a[(j-1)*wid + i];
			}
			if(j<hm1){ // bots
				bo = a[(j+1)*wid + i];
			}
			max = Math.max(tl,to,tr, lf,ri, bl,bo,br);
			min = Math.min(tl,to,tr, lf,ri, bl,bo,br);
			if( se>max ){//Code.isUniqueValue(se, tl,to,tr, lf,se,ri, bl,bo,br) ){
				vals.push( {x:i, y:j, value:se } );
			}else if(se==max){// if(se>min){
				//a[index] = Math.min(tl,to,tr, lf,se,ri, bl,bo,br);//Code.secondMax(tl,to,tr, lf,se,rg, bl,bo,br);
				//a[index] = Code.secondMax(tl,to,tr, lf,se,ri, bl,bo,br);
				//a[index] = min;
				a[index] = min;
			}
		}
	}
	return vals;
}

ImageMat.findBlobs2 = function(a,wid,hei){ // px,py,area
	var blobs = new Array();
	var i, j, tl,to,tr, lf,se,rg, bl,bo,br, index;
	var wm1 = wid-1, hm1 = hei-1;
	var len = wid*hei;
	var result = a;
	var loops = 0;
	var reached = 0;
	var count = 0;
	var found = true;
// the problem is that I want the behavior of the , but I'm deleting my object as I go
	do{
		count = 0;
		reached = 0;
		a = result;
		result = new Array(len);
		found = false;
		for(i=0;i<wid-0;++i){
			for(j=0;j<hei-0;++j){
				index = j*wid + i;
				result[index] = a[index];
				se = a[index];
				tl=0; to=0; tr=0; le=0; ri=0; bl=0; bo=0; br=0;
				if(i>0){ // lefts
					le = a[j*wid + (i-1)];
					if(j>0){
						tl = a[(j-1)*wid + (i-1)];
					}
					if(j<wm1){
						bl = a[(j+1)*wid + (i-1)];
					}
				}
				if(i<wm1){ // rights
					ri = a[j*wid + (i+1)];
					if(j<hm1){
						br = a[(j+1)*wid + (i+1)];
					}
					if(j>0){
						tr = a[(j-1)*wid + (i+1)];
					}
				}
				if(j>0){ // tops
					to = a[(j-1)*wid + i];
				}
				if(j<hm1){ // bots
					bo = a[(j+1)*wid + i];
				}
				if( tl&&to&&tr&& le&&se&&ri&& bl&&bo&&br ){ // all
					// stays
				}else if(se){
					result[index] = 0;
					++reached;
					if( !(tl||to||tr|| le||ri|| bl||bo||br) ){ // last one
					//if( !(to||le||ri||bo) ){ // last one
						++count;
						found = true;
						blobs.push( {x:i, y:j, radius:(loops+1)} );
					}
				}
			}
		}
		//console.log(loops+": "+count+" / "+reached);
		++loops;
	}while(found && loops<1);
	//console.log(((count/len)*100) + "%");
	// A:
	// count all blobs (init to -1, then go thru using max(tl,to,tr,le,se,ri,bl,bo,br) ), record center of mass
	// shrink until the number of blobs is inside the desired range => remaining blobs will be the biggest
	// B:
	// until there is nothing left:
	// OR when a blob goes to nothing, record point => largest blobs will die off last
	// shrink
	//return new Array();
	return blobs;
}
ImageMat.printBadData = function(data, wid,hei){
	var i, j, val;
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i){
			val = data[ j*wid+ i ];
			if(isNaN(val)){
				console.log("FOUND BAD DATA: "+i+","+j);
			}
		}
	}
}

// ------------------------------------------------------------------------------------------------------------------------ fxns
ImageMat.cdf = function(data, mask){ // cumulative distribution function | range assumed [0,1]
	var i, len = data.length;
	if(mask){
		var newData = [];
		for(i=0; i<len; ++i){
			if(mask[i] != 0){
				newData.push(data[i]);
			}
		}
		data = newData;
		len = data.length;
	}
	var lm1 = len - 1;
	var sorted = data.sort(function(a,b){
		return a < b ? -1 : 1;
	});
	var division;
	var currentCDF = 0;
	var cdf = [];
	var xValues = [];
	for(i=0; i<=lm1;++i){
		value = sorted[i];
		division = 1;
		while(i<lm1 && sorted[i+1]==value){
			division += 1;
			++i;
		}
		currentCDF += division / len;
		cdf.push(currentCDF);
		xValues.push(value);
	}
	return {"x":xValues, "y":cdf};
}
ImageMat.probabilityFromCDF = function(cdf,value){ 
	var x = cdf["x"];
	var y = cdf["y"];
	var len = x.length;
	var lm1 = len - 1;
	if(len==0){
		return 0;
	}
	var value0 = x[0];
	var valueN = x[lm1];
	if(value < value0){
		return 0;
	}
	if(value > valueN){
		return 1;
	}
	// TODO: faster search to find i
	var i, a, b;
	for(i=0; i<lm1; ++i){
		a = x[i];
		b = x[i+1];
		if(a<=value && value<=b){
			if(i>0){
				return y[i] - y[i-1];
			}else{
				return y[i];
			}
		}
	}
	return 0;
}

ImageMat.valueFromCDF = function(cdf,value){ 
	var x = cdf["x"];
	var y = cdf["y"];
	var len = x.length;
	var lm1 = len - 1;
	if(len==0){
		return 0;
	}
	if(value < x[0]){
		return 0;
	}
	var i, a, b;
	for(i=0; i<lm1; ++i){
		a = x[i];
		b = x[i+1];
		if(a<=value && value<=b){
			return y[i];
		}
	}
	return 1;
}

ImageMat.entropy = function(data, wid, hei, maskOutCenter, bins, bucketOffset){
	return ImageMat.entropySimple(data, wid, hei, bins, maskOutCenter, bucketOffset);
	// var bins = Math.round(3 + Math.log2(data.length) * Math.log(data.length));
	// return ImageMat.entropySimple(data, wid, hei, bins, maskOutCenter);
	// var i, len = wid*hei;
	// var cdf = ImageMat.cdf(data);
	// var entropy = 0;
	// return entropy;
}
ImageMat.histogram = function(data, wid, hei, buckets, maskOutCenter, bucketOffset){// range assumed [0,1]  |  16 => 4  |  100 => 10
	var value, i, bin, len = data.length;
	buckets = (buckets!==undefined && buckets!==null) ? buckets : Math.round(Math.sqrt(len));
	var info = Code.infoArray(data);
	var infoMax = info["max"];
	var infoMin = info["min"];
	var infoRange = info["range"];
		infoMin = 0;
		infoMax = 1;
		infoRange = infoMax - infoMin;

	var bm1 = buckets - 1;
	var histogram = Code.newArrayZeros(buckets);
	var mask = true;
	for(i=0; i<len; ++i){
		if(maskOutCenter){
			mask = maskOutCenter[i] != 0;
		}
		if(mask){
			value = data[i];
			if(bucketOffset){
				value = (value + bucketOffset) % 1.0;
			}
			value = (value - infoMin)/infoRange;
			bin = Math.min(Math.floor( value*buckets ),bm1);
			histogram[bin] += 1;
		}
	}
	return histogram;
}
ImageMat.entropySimple = function(data, wid, hei, buckets, maskOutCenter){ // e = - SUM p_i * log(p_i)
//buckets = 10;
	var i, count, value, p, bin;
	var histogram = ImageMat.histogram(data, wid,hei, buckets, maskOutCenter);
	buckets = histogram.length;
	var bm1 = buckets - 1;
	var entropy = 0;
	var entropyCount = 0;
	var totalCount = Code.sumArray(histogram);
var totalP = 0;
	for(i=0; i<buckets; ++i){
		//value = data[i];
		//bin = Math.min(Math.floor( value*buckets ),bm1);
		//count = histogram[bin];
		// get probability from histogram
		count = histogram[i];
		p = count / totalCount;
		//console.log(i+": "+p);
		totalP += p;
		if(p > 0){
			entropy += p * Math.log2(p); // * dx;
			//entropy += p * Math.log2(1/p); // * dx;
			entropyCount++;
		}
	}
//console.log(totalP);
	var maxE = -Math.log2(1.0/buckets);
//	console.log("MAX:",entropyCount,totalCount,data.length,maxE,histogram);


	// var min = 0; // Math.pow(2,-buckets); // all same color
	// var max = Math.log2(1.0/buckets);////buckets; // uniform buckets
// /entropyCount
	return -entropy/maxE;
	//return -entropy;
	//return -entropy/Math.pow(entropyCount,1/3);
	//return -entropy/Math.pow(wid,1/2);
	// MAX ENTROPY @ ?
	// MIN ENTROPY @ ?
	
	// return -entropy/maxE;
	//return -entropy/wid; // NO
	//return -entropy/entropyCount; // NO
}
ImageMat.entropyResidual = function(data, wid, hei, maskOutCenter){
	var i, count, value, p, bin, len = data.length;
	var histogram = ImageMat.histogram(data, wid,hei, null, maskOutCenter);
	buckets = histogram.length;
	var bm1 = buckets - 1;
	var entropy = 0;
	var currentCount = 0;
	var totalCount = Code.sumArray(histogram);
	var cdf = [];
	count = 0;
	for(i=0; i<buckets; ++i){
		count += histogram[i];
		cdf.push(count);
	}
	var mask = 1;
	for(i=0; i<data.length; ++i){
		value = data[i];
		if(maskOutCenter){
			mask = maskOutCenter[i];
		}
		if(mask!==0){
			bin = Math.min(Math.floor( value*buckets ),bm1);
			p = cdf[i] / totalCount;
			if(p > 0){
				entropy += p * Math.log2(p); // * dx;
			}
		}
	}
	return -entropy;
}
ImageMat.entropyResidualX = function(data, wid, hei, maskOutCenter){
	var i, p, count;
	//var histogram = ImageMat.histogram(data, wid,hei, null, maskOutCenter);
	var cdf = ImageMat.cdf(data, maskOutCenter);
		var cdfX = cdf["x"];
		var cdfY = cdf["y"];
	var len = cdfX.length;
	var lm1 = len-1;
	var entropy = 0;
	var totalCount = cdf[lm1];
	var count = 0;
	var mask = 1;
	for(i=0; i<data.length; ++i){
		if(maskOutCenter){
			mask = maskOutCenter[i];
		}
		if(mask!=0){
			var value = data[i];
			var p = ImageMat.valueFromCDF(cdf,value);
			entropy += p * Math.log2(p);
		}
		//console.log(i+": "+count+" / "+totalCount);
	}
	console.log(-entropy);
	return -entropy;
}

ImageMat.entropyInWindow = function(data, wid,hei, winX,winY, useWin){
	if(winX==undefined || winY==undefined){
		return 
	}
	var testSizeX = winX*2 + 1;
	var testSizeY = winY*2 + 1;
	if(useWin){
		testSizeX = winX;
		testSizeY = winY;
	}

	var mask = ImageMat.circleMask(testSizeX,testSizeY)
	var totalEntropy = Code.newArrayZeros(wid*hei);
	var i, j, nJ, nI, index, range;
	var wm1 = wid-1, hm1 = hei-1;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			index = j*wid + i;
			var d = [];
			var iStart = i - winX;
			var iEnd = i + winX;
			var jStart = j - winY;
			var jEnd = j + winY;
			for(nJ=jStart; nJ<=jEnd; ++nJ){
				for(nI=iStart; nI<=iEnd; ++nI){ 
					var ii = Math.min(Math.max(nI,0),wm1);
					var jj = Math.min(Math.max(nJ,0),hm1);
					var iIndex = jj*wid + ii;
					var value = data[iIndex];
					d.push(value);
				}
			}
			entropy = ImageMat.entropy(d, testSizeX, testSizeY, mask);
			//entropy = ImageMat.entropyResidual(d, testSizeX, testSizeY, mask);
			totalEntropy[index] = entropy;
		}
	}
	return {"value":totalEntropy, "width":wid, "height":hei};
}


ImageMat.entropyInPixelArea = function(data, wid,hei, pointX,pointY, winX,winY, mask, bins){
	if(winX==undefined || winY==undefined){
		return 
	}
	var winXLeft = Math.floor(winX/2.0);
	var winXRight = winX - winXLeft;
	var winYTop = Math.floor(winY/2.0);
	var winYBot = winY - winYTop;
	var wm1 = wid-1, hm1 = hei-1;
	var i, j;
	var entropy = 0;
	var d = [];
	var iStart = pointX - winXLeft;
	var iEnd = pointX + winXRight;
	var jStart = pointY - winY;
	var jEnd = pointY + winY;
	for(j=jStart; j<=jEnd; ++j){
		for(i=iStart; i<=iEnd; ++i){ 
			var ii = Math.min(Math.max(i,0),wm1);
			var jj = Math.min(Math.max(j,0),hm1);
			var index = jj*wid + ii;
			var value = data[index];
			d.push(value);
		}
	}
	if(winX==5){
		console.log("\nimg=["+d+"]; plot(img);\n\n");
	}
	// TRY NORMALIZING
	// var minValue = Code.minArray(d);
	// var maxValue = Code.maxArray(d);
	// var range = maxValue - minValue;
	// range = 1.0/(range!=0 ? range : 1.0);
	// for(i=0; i<d.length; ++i){
	// 	d[i] = d[i] / range;
	// }
	//console.log(d);
	entropy = ImageMat.entropy(d, winX, winY, mask, bins);
	return entropy;
}

ImageMat.rangeInPixelArea = function(data, wid,hei, pointX,pointY, winX,winY, mask){
	if(winX==undefined || winY==undefined){
		return 
	}
	var winXLeft = Math.floor(winX/2.0);
	var winXRight = winX - winXLeft;
	var winYTop = Math.floor(winY/2.0);
	var winYBot = winY - winYTop;
	var wm1 = wid-1, hm1 = hei-1;
	var i, j;
	var entropy = 0;
	var d = [];
	var iStart = pointX - winXLeft;
	var iEnd = pointX + winXRight;
	var jStart = pointY - winY;
	var jEnd = pointY + winY;
	for(j=jStart; j<=jEnd; ++j){
		for(i=iStart; i<=iEnd; ++i){ 
			var ii = Math.min(Math.max(i,0),wm1);
			var jj = Math.min(Math.max(j,0),hm1);
			var index = jj*wid + ii;
			var value = data[index];
			d.push(value);
		}
	}
	var maxValue = Code.maxArray(d);
	var minValue = Code.minArray(d);
	return maxValue - minValue;
}


ImageMat.range = function(data, wid,hei){
	if(wid==0||hei==0){
		return 0;
	}
	var len = wid*hei;
	var minValue = null;
	var maxValue = null;
	for(var i=len-1; i>=0; i--){
		var value = data[i];
		if(minValue==null || value<minValue){
			minValue = value;
		}
		if(maxValue==null || value>maxValue){
			maxValue = value;
		}
	}
	var range = maxValue - minValue;
	return range;
}
ImageMat.rangeInWindow = function(data, wid,hei, winX,winY){ // win = 1/2 actual window
	if(winX==undefined || winY==undefined){
		return 
	}
	var variation = Code.newArrayZeros(wid*hei);
	var i, j, nJ, nI, index, range;
	var wm1 = wid-1, hm1 = hei-1;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			index = j*wid + i;
			var iStart = Math.max(0,i-winX);
			var iEnd = Math.min(wm1,i+winX);
			var jStart = Math.max(0,j-winY);
			var jEnd = Math.min(hm1,j+winY);
			var minValue = null;
			var maxValue = null;
			for(nJ=jStart; nJ<jEnd; ++nJ){
				for(nI=iStart; nI<iEnd; ++nI){ 
					var iIndex = nJ*wid + nI;
					var value = data[iIndex];
					if(minValue==null || value<minValue){
						minValue = value;
					}
					if(maxValue==null || value>maxValue){
						maxValue = value;
					}
				}
			}
			range = maxValue - minValue;
			variation[index] = range;
		}
	}
	return {"value":variation, "width":wid, "height":hei};
}
ImageMat.totalRangeInWindow = function(r,g,b, wid,hei, winX,winY){ 
	var len = wid*hei;
	var total = Code.newArrayZeros(len);
	var i;
	r = ImageMat.rangeInWindow(r,wid,hei,winX,winY).value;
	g = ImageMat.rangeInWindow(g,wid,hei,winX,winY).value;
	b = ImageMat.rangeInWindow(b,wid,hei,winX,winY).value;
	for(i=0; i<len; ++i){
		total[i] = r[i] + g[i] + b[i];
	}
	return {"value":total, "width":wid, "height":hei};
}

ImageMat.totalCostToMoveAny = function(image, g,b,wid,hei){
	var result, red, grn, blu;
	if(wid!==undefined && hei!==undefined){
		red = image;
		grn = g;
		blu = b;
	}else{
		red = image.red();
		grn = image.grn();
		blu = image.blu();
		wid = image.width();
		hei = image.height();
	}
	var red = ImageMat.costToMoveAny(red, wid,hei).value;
	var grn = ImageMat.costToMoveAny(grn, wid,hei).value;
	var blu = ImageMat.costToMoveAny(blu, wid,hei).value;
	var len = wid * hei;
	var sum = Code.newArrayZeros(len);
	var i, den, num;
	for(i=0; i<len; ++i){ // square?
		//sum[i] = red[i] + grn[i] + blu[i];
		//sum[i] = red[i] * grn[i] * blu[i];
		num = (red[i] * grn[i] * blu[i]);
		den = (red[i] + grn[i] + blu[i]);

		sum[i] = den;
		//sum[i] = num;

		// if(den==0){
		// 	den = 1.0;
		// }
		// sum[i] = num / den;

		// if(num==0){
		// 	num = 1.0;
		// }
		// sum[i] = den/num;
		
	}
	//return sum;
	return {"value":sum, "width":wid, "height":hei};
}
ImageMat.costToMoveAny = function(image,wid,hei){ // 4 main directions | +4 diagonal directions
	var result = null;
	if(wid!==undefined && hei!==undefined){
		var r = image;
		result = ImageMat.costToMove(image,wid,hei, 1,0);
		ImageMat.costToMove(image,wid,hei, 0,1, result);
		ImageMat.costToMove(image,wid,hei, -1,0, result);
		ImageMat.costToMove(image,wid,hei, 0,-1, result);
		ImageMat.costToMove(image,wid,hei,-1,-1, result);
		ImageMat.costToMove(image,wid,hei,1,-1, result);
		ImageMat.costToMove(image,wid,hei,-1,1, result);
		ImageMat.costToMove(image,wid,hei,1,1, result);
	}else{
		result = ImageMat.costToMoveImage(image,1,0);
		ImageMat.costToMoveImage(image,0,1, result);
		ImageMat.costToMoveImage(image,-1,0, result);
		ImageMat.costToMoveImage(image,0,-1, result);
		// ImageMat.costToMove(image,-1,-1, result);
		// ImageMat.costToMove(image,1,-1, result);
		// ImageMat.costToMove(image,-1,1, result);
		// ImageMat.costToMove(image,1,1, result);
	}
	return result;
}
ImageMat.costToMoveImage = function(image, dx,dy, sum){
	return ImageMat.costToMove(image.red(),image.grn(),image.blu(),image.width(),image.height(), dx,dy, sum);
}
ImageMat.costToMoveImage = function(red,grn,blu, wid,hei, dx,dy, sum){ // assume image stretches in all directions
	var resultLen = wid * hei;
	var r = sum!==undefined ? sum.red() : Code.newArrayZeros(resultLen);
	var g = sum!==undefined ? sum.grn() : Code.newArrayZeros(resultLen);
	var b = sum!==undefined ? sum.blu() : Code.newArrayZeros(resultLen);
		// var r = sum!==undefined ? sum.red() : Code.newArrayOnes(resultLen);
		// var g = sum!==undefined ? sum.grn() : Code.newArrayOnes(resultLen);
		// var b = sum!==undefined ? sum.blu() : Code.newArrayOnes(resultLen);
	var i, j, x, y;
	var indexA, indexB;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			indexA = j*wid + i;
			x = i + dx;
			y = j + dy;
			x = Math.min(Math.max(0,x),wid-1);
			y = Math.min(Math.max(0,y),hei-1);
			indexB = y*wid + x;
				r[indexA] += Math.abs(red[indexA] - red[indexB]);
				g[indexA] += Math.abs(grn[indexA] - grn[indexB]);
				b[indexA] += Math.abs(blu[indexA] - blu[indexB]);
					// r[indexA] *= Math.abs(red[indexA] - red[indexB]);
					// g[indexA] *= Math.abs(grn[indexA] - grn[indexB]);
					// b[indexA] *= Math.abs(blu[indexA] - blu[indexB]);
				// r[indexA] += Math.pow(red[indexA] - red[indexB],2);
				// g[indexA] += Math.pow(grn[indexA] - grn[indexB],2);
				// b[indexA] += Math.pow(blu[indexA] - blu[indexB],2);
		// (A * B) / (A + B)
		}
	}
	if(sum){
		return sum;
	}
	var result = new ImageMat(wid,hei,r,g,b);
	return result;
}


ImageMat.costToMove = function(channel, wid,hei, dx,dy, sum){ // assume image stretches in all directions
	var resultLen = wid * hei;
	sum = sum!==undefined ? sum : Code.newArrayZeros(resultLen);
	//sum = sum!==undefined ? sum : Code.newArrayOnes(resultLen);
	var i, j, x, y;
	var indexA, indexB;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			indexA = j*wid + i;
			x = i + dx;
			y = j + dy;
			x = Math.min(Math.max(0,x),wid-1);
			y = Math.min(Math.max(0,y),hei-1);
			indexB = y*wid + x;
			sum[indexA] += Math.abs(channel[indexA] - channel[indexB]);
			//sum[indexA] *= Math.abs(channel[indexA] - channel[indexB]);
		// (A * B) / (A + B)
		}
	}
	return {"value":sum, "width":wid, "height":hei};
}


ImageMat.applyGaussianMask = function(image, imageWidth,imageHeight){
	var cX = (imageWidth-1)/2.0;
	var cY = (imageHeight-1)/2.0;
	var sigmaX = cX/2; sigmaX = 2.0*sigmaX*sigmaX; // TODO: THIS LOOKS WRONG
	var sigmaY = cY/2; sigmaY = 2.0*sigmaY*sigmaY;
	var i, j, x, y, index, value;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
			index = j*imageWidth + i;
			value = image[index];
			value = value * Math.exp( -( Math.pow(i-cX,2)/sigmaX  +  Math.pow(j-cY,2)/sigmaY ) );
			image[index] = value;
		}
	}
	return {"value":image, "width":imageWidth, "height":imageHeight};
}

ImageMat.gaussianMask = function(width,height, sigmaX, sigmaY){ // area ~ 1
	if(sigmaX===undefined){ // 3sigma = 99.7%
		sigmaX = Math.min(width,height)*0.5/3.0;
		sigmaX = sigmaX;
	}
	sigmaY = sigmaY!==undefined ? sigmaY : sigmaX;
	var cX = (width-1)*0.5;
	var cY = (height-1)*0.5;
	var prefix = 1.0/(2.0*Math.PI*sigmaX*sigmaY);
	var divX = 2.0*sigmaX*sigmaX;
	var divY = 2.0*sigmaY*sigmaY;
	var i, j, x, y, index, value;
	var image = [];
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			index = j*width + i;
			image[index] = prefix * Math.exp( -( Math.pow(i-cX,2)/divX  +  Math.pow(j-cY,2)/divY ) );
		}
	}
	return image;
}

ImageMat.circleMask = function(imageWidth, imageHeight){ // force circle ?
	var i, j;
	var len = imageWidth * imageHeight;
	var mask = Code.newArrayZeros(len);
	var cx = imageWidth * 0.5;
	var cy = imageHeight * 0.5;
	var rx = imageWidth * 0.5;
	var ry = imageHeight * 0.5;
	cx = Math.floor(cx);
	cy = Math.floor(cy);
	for(i=0; i<imageWidth; ++i){
		for(j=0; j<imageHeight; ++j){
			var d = Math.pow((i-cx)/rx,2) + Math.pow((j-cy)/ry,2);
			if( d <= 1){
				mask[j*imageWidth + i] = 1.0;
			}
		}
	}
	return mask;
}

ImageMat.prototype.applyCircleMask = function(image, imageWidth, imageHeight){
	var i;
	var mask = ImageMat.circleMask(imageWidth, imageHeight);
	var len = imageWidth*imageHeight;
	for(i=0; i<len; ++i){
		image[i] *= mask[i];
	}
	return image;
}
ImageMat.prototype.applyGaussianMask = function(){
	ImageMat.applyGaussianMask(this.red(), this.width(), this.height());
	ImageMat.applyGaussianMask(this.grn(), this.width(), this.height());
	ImageMat.applyGaussianMask(this.blu(), this.width(), this.height());
}
ImageMat.calculateCentroid = function(image, imageWidth,imageHeight){
	var cen = new V2D();
	var length = imageWidth * imageHeight;
	var totalWeight = 0;
	var i, j, index, value;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
			index = j*imageWidth + i;
			value = image[index];
			totalWeight += value;
			cen.x += i*value;
			cen.y += j*value;
		}
	}
	cen.scale(1.0/totalWeight);
	return cen;
}
ImageMat.calculateCovarianceMatrix = function(image, imageWidth,imageHeight, mean, maskOutCenter){ // mean == center
	mean = mean!==undefined ? mean : ImageMat.calculateCentroid(image, imageWidth,imageHeight);
	var i, j, x, y, index, value;
	var covXX = 0 ,covYY = 0, covXY = 0;
		// var covXZ = 0, covYZ = 0, covZZ = 0;
	var totalWeight = 0;
	var mask = 1;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
			index = j*imageWidth + i;
			if(maskOutCenter){
				mask = maskOutCenter[index];
			}
			if(mask==0){
				continue;
			}
			value = mask*image[index];
			totalWeight += value;
			x = i - mean.x;
			y = j - mean.y;
			covXX += value*x*x;
			covYY += value*y*y;
			covXY += value*x*y;
			// covXZ = value*x; covYZ = value*y; covZZ = value;
		}
	}
	if(totalWeight==0){
		totalWeight = 1.0;
	}
	totalWeight = 1.0/totalWeight;
	covXX *= totalWeight;
	covYY *= totalWeight;
	covXY *= totalWeight;
		// covXZ *= size; covYZ *= size; covZZ *= size;
	var cov = Code.inverse2x2([], covXX, covXY, covXY, covYY);
		//var cov = Code.inverse3x3([], covXX, covXY, covXZ,  covXY, covYY, covYZ,  covXZ, covYZ, covZZ);
	return cov;
}

ImageMat.prototype.calculateCentroid = function(){
	var red = ImageMat.calculateCentroid(this.red(), this.width(), this.height());
	var grn = ImageMat.calculateCentroid(this.grn(), this.width(), this.height());
	var blu = ImageMat.calculateCentroid(this.blu(), this.width(), this.height());
	var gry = ImageMat.calculateCentroid(this.gry(), this.width(), this.height());
	return {"red":red, "grn":grn, "blu":blu, "gry":gry, "width":this.width(), "height":this.height()};
}
// THIS IS MORE LIKE THE CENTRAL MOMENT
ImageMat.prototype.calculateCovariance = function(mean, mask){
	return ImageMat.calculateCovarianceMatrix(this.gry(), this.width(), this.height(), mean, mask);
}
ImageMat.calculateCovariance = function(gry, width, height, mean, mask){
	var matrix = ImageMat.calculateCovarianceMatrix(gry, width, height, mean, mask);
	matrix = new Matrix(2,2,matrix);
		//matrix = new Matrix(3,3,matrix);
	var eigens = Matrix.eigenValuesAndVectors(matrix);
	var eigenVectors = eigens.vectors
	eigenVectors[0] = eigenVectors[0].toArray();
	eigenVectors[1] = eigenVectors[1].toArray();
		//eigenVectors[2] = eigenVectors[2].toArray();
	var eigenValues = eigens.values;
	var ev1 = new V3D(eigenVectors[0][0],eigenVectors[0][1],eigenValues[0]);
	var ev2 = new V3D(eigenVectors[1][0],eigenVectors[1][1],eigenValues[1]);
		//var ev3 = new V3D(eigenVectors[2][0],eigenVectors[2][1],eigenValues[2]);
	if(ev1.z<ev2.z){ // show largest first
		var temp = ev2;
		ev2 = ev1;
		ev1 = temp;
	}
	return [ev1,ev2];
	//return [ev1,ev2,ev3];
}
ImageMat.calculateRawMoment = function(image, imageWidth,imageHeight, expX, expY, mean){
	mean = mean!==undefined ? mean : ImageMat.calculateCentroid(image, imageWidth,imageHeight);
	var i, j, x, y, index, value;
	var moment = 0;
	var totalWeight = 0;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
			index = j*imageWidth + i;
			value = image[index];
			totalWeight += value;
			x = i - mean.x;
			y = j - mean.y;
			// x = i;
			// y = j;
			moment += value * Math.pow(x,expX) * Math.pow(y,expY);
		}
	}
	return moment/totalWeight;
}
ImageMat.prototype.calculateMoment = function(mean){
	var gry = this.gry();
	var wid = this.width();
	var hei = this.height();
	mean = mean!==undefined ? mean : ImageMat.calculateCentroid(gry, wid,hei);
	
	//var totalWeight = ImageMat.sumFloat(gry);
	// var m01 = ImageMat.calculateRawMoment(gry,wid,hei,0,1,mean);
	// var m10 = ImageMat.calculateRawMoment(gry,wid,hei,1,0,mean);

	var m11 = ImageMat.calculateRawMoment(gry,wid,hei,1,1,mean);
	var m20 = ImageMat.calculateRawMoment(gry,wid,hei,2,0,mean);
	var m02 = ImageMat.calculateRawMoment(gry,wid,hei,0,2,mean);
	var matrix = new Matrix(2,2,[m20,m11,m11,m02]);

	var eigens = Matrix.eigenValuesAndVectors(matrix);
	var eigenVectors = eigens.vectors
	eigenVectors[0] = eigenVectors[0].toArray();
	eigenVectors[1] = eigenVectors[1].toArray();
	var eigenValues = eigens.values;
	var ev1 = new V3D(eigenVectors[0][0],eigenVectors[0][1],eigenValues[0]);
	var ev2 = new V3D(eigenVectors[1][0],eigenVectors[1][1],eigenValues[1]);
	if(ev1.z<ev2.z){ // show largest first
		var temp = ev2;
		ev2 = ev1;
		ev1 = temp;
	}
	return [ev1,ev2];
}

ImageMat.prototype.calculateX = function(){
	
}
ImageMat.cooccurrenceMatrix = function(image, wid, hei, imageMask, levels, offX, offY, dontNormalize){
	if(offX===undefined || offY===undefined){
		offX = 1; offY = 0; // right
	}
	var lm1 = levels - 1;
	var size = levels*levels;
	var com = Code.newArrayZeros(size);
	var i, j, k, indexU, indexV, u, v;
	var count = 0;
	var mask = 1;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			indexU = j*wid + i;
			if(imageMask){
				mask = imageMask[indexU];
			}
			if(mask==0){
				continue;
			}
			var ii = (i+offX);
			var jj = (j+offY);
			if(ii>=wid || jj>=hei){
				continue;
			}
			indexV = jj*wid + ii;
			u = image[indexU];
			v = image[indexV];
			u = Math.min(Math.floor(u*levels),lm1);
			v = Math.min(Math.floor(v*levels),lm1);
			com[u*levels + v] += 1;
			++count;
		}
	}
	if(!dontNormalize && count>0){
		for(i=0; i<size; ++i){
			com[i] = com[i]/count;
		}
	}
	return com;
}
/*
energy
entropy
contrast
homogeneity
correlation
*/
ImageMat.cooccurrenceMatrixEnergy = function(com, levels){
	var i, value;
	var size = com.length;//levels*levels;
	var result = 0;
	var min = null;
	var max = null;
	for(i=0; i<size; ++i){
		value = com[i];
	}
	var range = max - min;
	var avg = (max+min)*0.5;
	for(i=0; i<size; ++i){
		value = com[i];
		value = value - avg;
		value = Math.abs(value);
		value = value * value;
		result += value;
	}
	return result;
}

ImageMat.cooccurrenceMatrixEntropy = function(com, levels){
	var i, value;
	var size = com.length;//levels*levels;
	var result = 0;
	for(i=0; i<size; ++i){
		value = com[i];
		if(value>0){
			value = value * Math.log2(value);
			result += value;
		}
	}
	//var maxEntropy = -Math.log2(1.0/levels);
	//result = result / maxEntropy;
	result = result / (levels-1);
	return -result;
}

ImageMat.cooccurrenceMatrixHomogeneity = function(com, levels){
	var i, value;
	var size = com.length;
	var result = 0;
	for(j=0; j<levels; ++j){
		for(i=0; i<levels; ++i){
			var index = j*levels + i;
			value = com[index];
			value = value / (1 + Math.abs(i - j));
			result += value;
		}
	}
	return result;
}

ImageMat.cooccurrenceMatrixCorrelation = function(com, levels){
	var i, value;
	var size = com.length;
	var result = 0;
	/*
	var muI = ?;
	var muJ = ?;
	var sigI = ?;
	var sigJ = ?;
	for(j=0; j<levels; ++j){
		for(i=0; i<levels; ++i){
			var index = j*levels + i;
			value = com[index];
			// value = value / (1 + Math.abs(i - j));
			// result += value;
		}
	}
	result = result / ( ? );
	*/
	return result;
}

ImageMat.convolve = function(image,imageWidth,imageHeight, operator,operatorWidth,operatorHeight){
	var total = imageWidth*imageHeight;
	var i, j, n, m, sum, staN, endN, staM, endM;
	var oW2F = Math.floor(operatorWidth/2); oH2F = Math.floor(operatorHeight/2);
	var oW2C = Math.ceil(operatorWidth/2); oH2C = Math.ceil(operatorHeight/2);
	var result = new Array(total);
	for(j=0;j<imageHeight;++j){
		jIW = j*imageWidth;
		for(i=0;i<imageWidth;++i){
			staN = Math.max( oW2F-i, 0);
			endN = Math.min(operatorWidth,oW2F+imageWidth-i);
			staM = Math.max( oH2F-j, 0);
			endM = Math.min(operatorHeight,oH2F+imageHeight-j);
			sum = 0.0;
			for(m=staM;m<endM;++m){
				for(n=staN;n<endN;++n){
					sum += image[(j+m-oH2F)*imageWidth+(i+n-oW2F)]*operator[m*operatorWidth+n];
				}
			}
			result[jIW+i] = sum;
		}
	}
	return {"value":result,"width":imageWidth,"height":imageHeight};
}
// INNER CONVOLUTION?

ImageMat.convolveConvScores = function(haystack,needle) {
	var gry = ImageMat.convolve(haystack.gry(),haystack.width(),haystack.height(), needle.gry(),needle.width(),needle.height());
	var red = ImageMat.convolve(haystack.red(),haystack.width(),haystack.height(), needle.red(),needle.width(),needle.height());
	var grn = ImageMat.convolve(haystack.grn(),haystack.width(),haystack.height(), needle.grn(),needle.width(),needle.height());
	var blu = ImageMat.convolve(haystack.blu(),haystack.width(),haystack.height(), needle.blu(),needle.width(),needle.height());
	var wid = red.width;
	var hei = red.height;
	var count = wid*hei;
		gry = gry.value;
		red = red.value;
		grn = grn.value;
		blu = blu.value;
	var scores = [];
	for(i=0; i<count; ++i){
		//scores[i] = (red[i]+grn[i]+blu[i]);
		//scores[i] = red[i] + grn[i] + blu[i] + gry[i];
		scores[i] = (red[i]+grn[i]+blu[i])/3.0 + gry[i];
		//scores[i] = gry[i];
		//scores[i] = red[i]*grn[i]*blu[i];
		//scores[i] = red[i]*grn[i]*blu[i] + gry[i];
		//scores[i] = Math.abs(red[i]*grn[i]*blu[i]*gry[i]);
		//scores[i] = grn[i]*blu[i]*gry[i];
	}
	//scores = red[i];
	//scores = haystack.gry();
	return {"value":scores, "width":wid, "height":hei};
}

ImageMat.convolveSSDScores = function(haystack,needle) {
	var gry = ImageMat.convolveSSDFloat(haystack.gry(),haystack.width(),haystack.height(), needle.gry(),needle.width(),needle.height());
	var red = ImageMat.convolveSSDFloat(haystack.red(),haystack.width(),haystack.height(), needle.red(),needle.width(),needle.height());
	var grn = ImageMat.convolveSSDFloat(haystack.grn(),haystack.width(),haystack.height(), needle.grn(),needle.width(),needle.height());
	var blu = ImageMat.convolveSSDFloat(haystack.blu(),haystack.width(),haystack.height(), needle.blu(),needle.width(),needle.height());
		gry = gry.value;
		red = red.value;
		grn = grn.value;
		blu = blu.value;
	var wid = haystack.width()-needle.width()+1;
	var hei = haystack.height()-needle.height()+1;
	var count = wid*hei;
	var scores = [];
	for(i=0; i<count; ++i){
		//scores[i] = red[i]+grn[i]+blu[i];
		//scores[i] = red[i] + grn[i] + blu[i] + gry[i];
		//scores[i] = (red[i]+grn[i]+blu[i])/3.0 + gry[i];
		//scores[i] = gry[i];
		//scores[i] = red[i]*grn[i]*blu[i];
		//scores[i] = red[i]*grn[i]*blu[i] + gry[i];
		//scores[i] = red[i]*grn[i]*blu[i]*gry[i];
		scores[i] = red[i]*grn[i]*blu[i]*gry[i];
	}
	return {"value":scores, "width":wid, "height":hei};

}
ImageMat.convolveSSD = function(haystack,needle) {
	var red = ImageMat.convolveSSDFloat(haystack.red(),haystack.width(),haystack.height(), needle.red(),needle.width(),needle.height());
	var grn = ImageMat.convolveSSDFloat(haystack.grn(),haystack.width(),haystack.height(), needle.grn(),needle.width(),needle.height());
	var blu = ImageMat.convolveSSDFloat(haystack.blu(),haystack.width(),haystack.height(), needle.blu(),needle.width(),needle.height());
	return new ImageMat(red.width,red.height, red.value,grn.value,blu.value);
}
ImageMat.convolveConv = function(haystack,needle) {
	var red = ImageMat.convolve(haystack.red(),haystack.width(),haystack.height(), needle.red(),needle.width(),needle.height());
	var grn = ImageMat.convolve(haystack.grn(),haystack.width(),haystack.height(), needle.grn(),needle.width(),needle.height());
	var blu = ImageMat.convolve(haystack.blu(),haystack.width(),haystack.height(), needle.blu(),needle.width(),needle.height());
	return new ImageMat(red.width,red.height, red.value,grn.value,blu.value);
}
ImageMat.convolveSSDFloat = function(haystack,haystackWidth,haystackHeight, needle,needleWidth,needleHeight) { // normalized ssd single channel
	if(needleWidth>haystackWidth || needleHeight>haystackHeight){ // flipped
		console.log("FLIPPED");
		return null;
	}
	var resultWidth = haystackWidth - needleWidth + 1;
	var resultHeight = haystackHeight - needleHeight + 1;
	var resultCount = resultWidth * resultHeight;
	if(resultCount<=0){
		return [];
	}
	
	var minN = Math.min.apply(this,needle);
	var maxN = Math.max.apply(this,needle);
	var rangeN = maxN-minN;
	var midN = minN + rangeN*0.5;
	var invRangeN = rangeN != 0 ? rangeN : 1.0;

	//
	var result = new Array();
	for(var j=0; j<resultHeight; ++j){
		for(var i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var ssd = 0;
			var maxH = null;
			var minH = null;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					var n = needle[nIndex];
					var h = haystack[hIndex];
					maxN = maxN==null || maxN<n ? n : maxN;
					minN = minN==null || minN>n ? n : minN;
				}
			}
			var rangeH = maxH-minH;
			var midH = minH + rangeH*0.5;
			var invRangeH = rangeH != 0 ? rangeH : 1.0;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					var n = needle[nIndex];
					var h = haystack[hIndex];
						// n = (n - midN)*invRangeN;
						// h = (h - midH)*invRangeH;
					//ssd += Math.pow( rangeN*(n-minN) - rangeH*(h-minH),2);
					//ssd += Math.abs( rangeN*(n-minN) - rangeH*(h-minH));
					//ssd += Math.abs( (n-minN) - (h-minH));
					//ssd += Math.abs(n - h);
					ssd += Math.pow(n - h,2);
				}
			}
			result[resultIndex] = ssd;
		}
	}
	return {"value":result,"width":resultWidth,"height":resultHeight};
}
ImageMat.SADFloatAsIsChannels = function(aRed,aGrn,aBlu, bRed,bGrn,bBlu){
	var scoreR = ImageMat.SADFloatAsIs(aRed,bRed);
	var scoreG = ImageMat.SADFloatAsIs(aGrn,bGrn);
	var scoreB = ImageMat.SADFloatAsIs(aBlu,bBlu);
	return (scoreR + scoreG + scoreB) / 3.0;
}
ImageMat.SADFloatAsIs = function(a,b){
	var score = 0;
	var i, len = Math.min(a.length, b.length);
	for(i=0; i<len; ++i){
		score += Math.abs(a[i]-b[i]);
	}
	return score;
}
ImageMat.SADFloatSimpleChannelsRGB = function(aRed,aGrn,aBlu, wid,hei, bRed,bGrn,bBlu){
	var scoreR = ImageMat.SADFloatSimple(aRed,wid,hei,bRed);
	var scoreG = ImageMat.SADFloatSimple(aGrn,wid,hei,bGrn);
	var scoreB = ImageMat.SADFloatSimple(aBlu,wid,hei,bBlu);
	/// WHICH IS EMPIRICALLLY BETTER?
	return scoreR * scoreG * scoreB;
	//return scoreR + scoreG + scoreB;
}
ImageMat.SADFloatSimple = function(imageA,wid,hei, imageB){
	var i, a, b, len = wid*hei;
	var sad = 0;
	var medianA = 0;
	var medianB = 0;
	var rangeA = 0;
	var rangeB = 0;
	var minA = imageA[0];
	var minB = imageB[0];
	var maxA = minA;
	var maxB = minB;
	for(i=0; i<len; ++i){
		a = imageA[i];
		b = imageB[i];
		medianA += a;
		medianB += b;
		minA = Math.min(minA,a);
		minB = Math.min(minB,b);
		maxA = Math.max(maxA,a);
		maxB = Math.max(maxB,b);
	}
	rangeA = maxA - minA;
	rangeB = maxB - minB;
	medianA = medianA / len;
	medianB = medianB / len;
	for(i=0; i<len; ++i){
		a = imageA[i];
		b = imageB[i];
		a -= medianA;
		b -= medianB;
		// a = a / (rangeA!==0.0 ? rangeA : 1.0);
		// b = b / (rangeB!==0.0 ? rangeB : 1.0);
		sad += Math.abs(a - b);
		//sad += Math.pow(a - b,2);
		// more what looking for: 0=>0, 1=>3
		//sad += (Math.pow( 1 + Math.abs(a-b),2) - 1); == x*x + 2x; -- mostly just linear anyway
	}
//	console.log("RANGES: "+rangeA+" | "+rangeB);
	//var range = (rangeA+rangeB)*0.5;
	var range = Math.min(rangeA,rangeB);
//		range = Math.pow(range,2); // too m
		range = range!=0 ? range : 1.0;
//		range = range * range;
//		range = Math.sqrt(range);
//console.log("RANGE: "+range);
//	console.log("RANGE: "+sad+" / "+range+" = "+(sad/range));
// higher range is better score 0---- 
//sad = sad / range; // worse results
	return sad;
}
/*
ImageMat.ssds = function(windowA, windowB){ // TODO: make tihs SSD not conv
	var ssdRed = ImageMat.convolve(windowA.red(),windowA.width(),windowA.height(), windowB.red(),windowB.width(),windowB.height());
	var ssdGrn = ImageMat.convolve(windowA.grn(),windowA.width(),windowA.height(), windowB.grn(),windowB.width(),windowB.height());
	var ssdeBlu = ImageMat.convolve(windowA.blu(),windowA.width(),windowA.height(), windowB.blu(),windowB.width(),windowB.height());
	var wid = windowA.width();
	var hei = windowA.height();
	var scores = [];
	for(var i=0; i<convolveRed.length; ++i){
		scores[i] = convolveRed[i]*convolveGrn[i]*convolveBlu[i];
	}
	var scores  = Code.findExtrema2DFloat(scores,wid,hei);
	scores = scores.sort(function(a,b){
		return Math.abs(a.z)<Math.abs(b.z) ? -1 : 1;
	});
	return scores;
}

ImageMat.convsss = function(windowA, windowB){ // TODO: make tihs SSD not conv
	var convolveRed = ImageMat.convolve(windowA.red(),windowA.width(),windowA.height(), windowB.red(),windowB.width(),windowB.height());
	var convolveGrn = ImageMat.convolve(windowA.grn(),windowA.width(),windowA.height(), windowB.grn(),windowB.width(),windowB.height());
	var convolveBlu = ImageMat.convolve(windowA.blu(),windowA.width(),windowA.height(), windowB.blu(),windowB.width(),windowB.height());
	var wid = windowA.width();
	var hei = windowA.height();
	var scores = [];
	for(var i=0; i<convolveRed.length; ++i){
		//scores[i] = convolveRed[i] + convolveGrn[i] + convolveBlu[i];
		scores[i] = convolveRed[i]*convolveGrn[i] + convolveBlu[i];
	}
	var scores  = Code.findExtrema2DFloat(scores,wid,hei);
	scores = scores.sort(function(a,b){
		return Math.abs(a.z)<Math.abs(b.z) ? -1 : 1;
	});
	return scores;
}
*/
ImageMat.ssdEqual = function(windowA, windowB){
	//var score = ImageMat.ssd(windowA.image,windowA.width,windowA.height, windowB.image,windowB.width,windowB.height);
	var scoreRed = Code.SSDEqual(windowA.red(),windowB.red());
	var scoreGrn = Code.SSDEqual(windowA.grn(),windowB.grn());
	var scoreBlu = Code.SSDEqual(windowA.blu(),windowB.blu());
	var scoreGry = Code.SSDEqual(windowA.gry(),windowB.gry());
	var score = (scoreRed+scoreGrn+scoreBlu)/3.0 + scoreGry;
	return score;
}


ImageMat.ssd = function(image,imageWidth,imageHeight, operator,operatorWidth,operatorHeight){
	var total = imageWidth*imageHeight;
	var i, j, n, m, sum, staN, endN, staM, endM, num;
	var oW2F = Math.floor(operatorWidth/2); oH2F = Math.floor(operatorHeight/2);
	var oW2C = Math.ceil(operatorWidth/2); oH2C = Math.ceil(operatorHeight/2);
	var result = new Array(total);
	for(j=0;j<imageHeight;++j){
		jIW = j*imageWidth;
		for(i=0;i<imageWidth;++i){
			staN = Math.max( oW2F-i, 0);
			endN = Math.min(operatorWidth,oW2F+imageWidth-i);
			staM = Math.max( oH2F-j, 0);
			endM = Math.min(operatorHeight,oH2F+imageHeight-j);
			sum = 0.0;
			for(m=staM;m<endM;++m){
				for(n=staN;n<endN;++n){
					num = image[(j+m-oH2F)*imageWidth+(i+n-oW2F)]-operator[m*operatorWidth+n];
					sum += num*num;
				}
			}
			result[jIW+i] = sum;
		}
	}
	return result;
}
ImageMat.ssdInner = function(image,imageWidth,imageHeight, operator,operatorWidth,operatorHeight){
	var i, j, n, m, sum, staN, endN, staM, endM, num;
	var oW2F = Math.floor(operatorWidth/2); oH2F = Math.floor(operatorHeight/2);
	var oW2C = Math.ceil(operatorWidth/2); oH2C = Math.ceil(operatorHeight/2);
	var resultWidth = imageWidth - operatorWidth;
	var resultHeight = imageHeight - operatorHeight;
	var total = resultWidth*resultHeight;
	var result = new Array(total);
	var iWm1 = imageWidth - oH2F;
	var iHm1 = imageHeight - oH2F;
	var index = 0;
	for(j=oH2F;j<iHm1;++j){
		jIW = j*imageWidth;
		for(i=oW2F;i<iWm1;++i){
			sum = 0.0;
			for(m=0;m<operatorHeight;++m){
				for(n=0;n<operatorWidth;++n){
					num = image[(j+m-oH2F)*imageWidth+(i+n-oW2F)]-operator[m*operatorWidth+n];
					sum += num*num;
				}
			}
			result[index] = sum;
			++index;
		}
	}
	return result;
}
ImageMat.historizeLocalFloat01 = function(data,wid,hei, winWid,winHei){ // weird square-effect
	winWid = winWid!==undefined?winWid:25;
	winHei = winHei!==undefined?winHei:25;
	var result = new Array(wid*hei);
	var wo2 = Math.floor(winWid*0.5);
	var ho2 = Math.floor(winHei*0.5);
	var i,j,ii,jj,index,ind, max,min,range, mI,mJ;
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i){
			index = wid*j+i;
			max = min = data[index];
			mI = Math.min(Math.max(i-wo2,0),wid-winWid);
			mJ = Math.min(Math.max(j-ho2,0),hei-winHei);
			for(jj=0;jj<winHei;++jj){
				for(ii=0;ii<winWid;++ii){
					ind = (mJ+jj)*wid+(mI+ii);
					if(data[ind]>max){ max = data[ind]; }
					if(data[ind]<min){ min = data[ind]; }
				}
			}
			range = max-min;
			if(range!=0){
				result[index] = (data[index]-min)/range;
			}else{
				result[index] = 0.0;
			}
		}
	}
	return result;
}
ImageMat.getRangeEnds = function(data){
	var i, len = data.length;
	var min = data[0], max = data[0];
	// for(i=1;i<len;++i){
	// 	min = Math.min(min,data[i]);
	// 	max = Math.max(max,data[i]);
	// }
	min = Math.min.apply(this,data);
	max = Math.max.apply(this,data);
	return {min:min, max:max};
}
ImageMat.getRange = function(data){
	var range = ImageMat.getRangeEnds(data);
	return range.max - range.min;
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
ImageMat.gtFloat = function(data, val){
	var i, len = data.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = (data[i]>val)?1.0:0.0;
	}
	return result;
}
ImageMat.ltFloat = function(data, val){
	var i, len = data.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = (data[i]<val)?1.0:0.0;
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
ImageMat.sqrtFloat = function(a){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = Math.sqrt(a[i]);
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
ImageMat.sumFloat = function(a){
	var i, len = a.length;
	var result = 0.0;
	for(i=0;i<len;++i){
		result += a[i]
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
ImageMat.maxFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = Math.max(a[i],b[i]);
	}
	return result;
}
ImageMat.addConst = function(a,b){
	var i, len = a.length;
	for(i=0;i<len;++i){
		a[i] += b;
	}
	return a;
}
ImageMat.subFloat = function(a,b){
	var i, len = a.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = a[i] - b[i];
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
ImageMat.mulConst = function(a,b){
	var i, len = a.length;
	for(i=0;i<len;++i){
		a[i] *= b;
	}
	return a;
}
ImageMat.scaleFloat = function(a,b){
	var i, len = b.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = a*b[i];
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
ImageMat.normFloats3D = function(x,y,z){
	var i, len = x.length, length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		length = Math.sqrt(x[i]*x[i]+y[i]*y[i]+z[i]*z[i]);
		if(length!=0){
			x[i] /= length;
			y[i] /= length;
			z[i] /= length;
		}
	}
}
ImageMat.prototype._op = function(fxn){
	fxn(this._r);
	fxn(this._g);
	fxn(this._b);
}
ImageMat.prototype.clipFloat01 = function(){
	this._op(ImageMat.clipFloat01);
}
ImageMat.prototype.normalFloat01 = function(){
	this._op(ImageMat.normalFloat01);
}
ImageMat.prototype.invertFloat01 = function(){
	this._op(ImageMat.invertFloat01);
}
ImageMat.clipFloat01 = function(data){
	var i, len = data.length;
	for(i=1;i<len;++i){
		data[i] = Math.min(Math.max(data[i],0.0),1.0);
	}
	return data;
}
ImageMat.normalFloat01 = function(data){
	var i, len = data.length;
	var max = data[0], min = data[0];
	for(i=1;i<len;++i){
		max = Math.max(max,data[i]);
		min = Math.min(min,data[i]);
	}
	var range = max - min;
	if(range==0){range = 1.0;}
	for(i=0;i<len;++i){
		data[i] = (data[i]-min)/range;
	}
	return data;
}
ImageMat.normalFloatAboutZero = function(data){
	var i, len = data.length;
	var max = data[0], min = data[0];
	for(i=1;i<len;++i){
		max = Math.max(max,data[i]);
		min = Math.min(min,data[i]);
	}
	var range = max - min;
	for(i=0;i<len;++i){
		data[i] = (data[i]-min)/range - 0.5;
	}
	return data;
}

ImageMat.normalFloatNegToOne = function(data){
	var i, len = data.length;
	var max = data[0], min = data[0];
	for(i=1;i<len;++i){
		max = Math.max(max,data[i]);
		min = Math.min(min,data[i]);
	}
	var range;
	if(min<0){
		range = Math.max(max,-min);
	}else{
		range = max;
	}
	if(range==0){
		return;
	}
	for(i=0;i<len;++i){
		data[i] = data[i]/range;
	}
	return data;
}

ImageMat.getNormalFloat01 = function(data){
	return ImageMat.normalFloat01( Code.copyArray(new Array(),data) );
}
ImageMat.applyFxnFloat = function(data,fxn){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = fxn(data[i]);
	}
}
ImageMat.invertFloat01 = function(data){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = 1.0-data[i];
	}
	return data;
}
ImageMat.randomFloat01 = function(data){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = Math.random();
	}
	return data;
}
ImageMat.randomAdd = function(data,mag,off){
	var i, len = data.length;
	var result = new Array();
	for(i=0;i<len;++i){
		result[i] = data[i] + Math.random()*mag - off;
	}
	return result;
}
ImageMat.flipAbsFxn = function(f){ 
	return Math.abs(f-0.5);
}
ImageMat.log = function(data){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = Math.log(data[i]);
	}
	return data;
}
ImageMat.pow = function(data,power){
	var i, len = data.length;
	for(i=0;i<len;++i){
		data[i] = Math.pow(data[i],power);
	}
	return data;
}

ImageMat.getPointInterpolateNearest = function(array, wid,hei, x,y){
	var hm1 = hei-1, wm1 = wid-1;
	x = Math.min(Math.max(Math.round(x),0),wm1);
	y = Math.min(Math.max(Math.round(y),0),hm1);
	index = y*wid + x;
	return array[index];
}

ImageMat.getPointInterpolateLinear = function(array, wid,hei, x,y){
	var hm1 = hei-1, wm1 = wid-1;
	var minX = Math.min( Math.max(Math.floor(x), 0), wm1);
	var minY = Math.min( Math.max(Math.floor(y), 0), hm1);
	var maxX = Math.max( Math.min(Math.ceil(x), wm1), 0);
	var maxY = Math.max( Math.min(Math.ceil(y), hm1), 0);
	var indexA = minY*wid + minX; var colA = array[indexA];
	var indexB = minY*wid + maxX; var colB = array[indexB];
	var indexC = maxY*wid + minX; var colC = array[indexC];
	var indexD = maxY*wid + maxX; var colD = array[indexD];
	minX = x - minX;
	if(x<0||x>wid){ minX=0.0;}
	minY = y - minY;
	if(y<0||y>hei){ minY=0.0;}
	var val = ImageMat.linear2D(minX,minY, colA,colB,colC,colD);
	if(isNaN(val)){
		console.log("PT",wid,hei,x,y);
	}
	return val;
}

ImageMat.getPointInterpolateCubic = function(array, wid,hei, x,y){
	x = Math.max(Math.min(x,wid-1),0);
	y = Math.max(Math.min(y,hei-1),0);
	var minX = Math.max(Math.floor(x), 0);
	var miiX = Math.max(minX-1, 0);
	var maxX = Math.min(Math.ceil(x), wid-1);
	var maaX = Math.min(maxX+1, wid-1);
	var minY = Math.max(Math.floor(y),0);
	var miiY = Math.max(minY-1,0);
	var maxY = Math.min(Math.ceil(y), hei-1);
	var maaY = Math.min(maxY+1, hei-1);
	var colA = array[miiY*wid + miiX];
	var colB = array[miiY*wid + minX];
	var colC = array[miiY*wid + maxX];
	var colD = array[miiY*wid + maaX];
	var colE = array[minY*wid + miiX];
	var colF = array[minY*wid + minX];
	var colG = array[minY*wid + maxX];
	var colH = array[minY*wid + maaX];
	var colI = array[maxY*wid + miiX];
	var colJ = array[maxY*wid + minX];
	var colK = array[maxY*wid + maxX];
	var colL = array[maxY*wid + maaX];
	var colM = array[maaY*wid + miiX];
	var colN = array[maaY*wid + minX];
	var colO = array[maaY*wid + maxX];
	var colP = array[maaY*wid + maaX];
	minX = x - minX;
	minY = y - minY;
	var val = ImageMat.cubic2D(minX,minY, colA,colB,colC,colD,colE,colF,colG,colH,colI,colJ,colK,colL,colM,colN,colO,colP);
	if(isNaN(val)){
		console.log("PT",wid,hei,x,y);
		console.log("IN                ",colA,colB,colC,colD,colE,colF,colG,colH,colI,colJ,colK,colL,colM,colN,colO,colP );
		//console.log("colN "+colN+" => "+wasA+","+wasB+"    "+x+","+y);
		return 0;
	}
	val = Math.min(Math.max(val,0.0),1.0);
	return val
}

// projective transform
ImageMat.extractRectWithProjection = function(source,sW,sH, wid,hei, projection, interpolationType){ // projection is 3x3 Matrix
	// interpolationType : 1=linear, 3=cubic
	var i, j, fr = new V3D(), val = new V3D();
	if( !(source instanceof Array) ){
		var destination = new ImageMat(wid,hei);
		for(j=0;j<hei;++j){
			for(i=0;i<wid;++i){
				fr.x = i; fr.y = j;
				projection.multV2DtoV3D(fr,fr);
				fr.x /= fr.z; fr.y /= fr.z;
				source.getPoint(val, fr.x,fr.y);
				destination.setPoint(i,j, val);
			}
		}
	}else{
		destination = new Array(wid*hei);
		for(j=0;j<hei;++j){
			for(i=0;i<wid;++i){
				fr.x = i; fr.y = j;
				projection.multV2DtoV3D(fr,fr);
				fr.x /= fr.z; fr.y /= fr.z;
				destination[wid*j+i] = ImageMat.getPointInterpolateCubic(source, sW,sH, fr.x,fr.y);
				//destination[wid*j+i] = ImageMat.getPointInterpolateLinear(source, sW,sH, fr.x,fr.y);
				//destination[wid*j+i] = ImageMat.getPointInterpolateNearest(source, sW,sH, fr.x,fr.y);
			}
		}
	}
	return destination;
}
ImageMat.extractRect = function(source, aX,aY,bX,bY,cX,cY,dX,dY, wid,hei, sW,sH){ // generates homography beforehand
	//var fromPoints = [new V2D(0,0), new V2D(wid-1,0), new V2D(wid-1,hei-1), new V2D(0,hei-1)];
	var fromPoints = [new V2D(0,0), new V2D(wid,0), new V2D(wid,hei), new V2D(0,hei)];
	var toPoints = [new V2D(aX,aY), new V2D(bX,bY), new V2D(cX,cY), new V2D(dX,dY)];
	var projection = Matrix.get2DProjectiveMatrix(fromPoints,toPoints);
	return ImageMat.extractRectWithProjection(source,sW,sH, wid,hei, projection);
}



ImageMat.extractRectSimple = function(source, width,height, x,y,w,h, wid,hei){
	var size = wid*hei;
	var destination = Code.newArrayZeros(size);
	var i, j, index, fromX, fromY, value;
	var wm1 = wid - 1;
	var hm1 = hei - 1;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			index = wid*j + i;
			fromX = x + w*(i/wm1);
			fromY = y + h*(j/hm1);
			value = ImageMat.getPointInterpolateCubic(source, width,height, fromX, fromY);
			destination[index] = value;
		}
	}
	return destination;
}
ImageMat.extractRectFromPointSimple = function(source, width,height, x,y,scale, wid,hei){
	var w = wid/scale;
	var h = hei/scale;
	var sX = x - w*0.5;
	var sY = y - h*0.5;
	return ImageMat.extractRectSimple(source, width,height, sX,sY,w,h, wid,hei);
}
ImageMat.extractRectFromMatrix = function(source, width,height, newWidth,newHeight, matrix){
	// TODO: VERIFY ?
	// source,sW,sH, wid,hei, projection, interpolationType
	return ImageMat.extractRectWithProjection(source, width,height, newWidth,newHeight, matrix);
}
ImageMat.padFloat = function(src,wid,hei, left,right,top,bot){
	var newWid = wid+left+right, newHei = hei+top+bot;
	var newLen = newWid*newHei;
	var result = new Array(newLen);
	var i, j, nJ, nJJ, nI;
	for(j=0;j<newHei;++j){
		nJ = Math.min(Math.max(j-top,0),hei-1)*wid;
		nJJ = j*newWid;
		for(i=0;i<newWid;++i){
			nI = Math.min(Math.max(i-left,0),wid-1);
			result[nJJ+i] = src[nJ+nI];
		}
	}
	return result;
}

ImageMat.unpadFloat = function(src,wid,hei, left,right,top,bot){
	var newWid = wid-left-right, newHei = hei-top-bot;
	var newLen = newWid*newHei;
	var result = new Array(newLen);
	var i, j, nJ, nJJ;
	for(j=0;j<newHei;++j){
		nJ = (j+top)*wid;
		nJJ = j*newWid;
		for(i=0;i<newWid;++i){
			result[nJJ+i] = src[nJ + i+left];
		}
	}
	return result;
}
ImageMat.applyGaussianFloat = function(src,wid,hei, sigma){
	var gaussSizeBase = 5;
	var gaussSize = gaussSizeBase*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	var padding = Math.floor(gaussSize/2.0);
	var tmp = ImageMat.padFloat(src, wid,hei, padding,padding,padding,padding);
	var newWid = wid+2.0*padding;
	var newHei = hei+2.0*padding;
	var tmp = ImageMat.gaussian2DFrom1DFloat(tmp, newWid,newHei, gauss1D);
	return ImageMat.unpadFloat(tmp, newWid,newHei, padding,padding,padding,padding);
}
ImageMat.derivativeX = function(src,wid,hei, x,y){
	if(x!==undefined && y!==undefined){
		return -0.5*src[wid*y+(x-1)] + 0.5*src[wid*y+(x+1)];
	}
	return ImageMat.convolve(src,wid,hei, [-0.5,0,0.5], 3,1);
}
ImageMat.derivativeY = function(src,wid,hei, x,y){
	if(x!==undefined && y!==undefined){
		return -0.5*src[wid*(y-1)+x] + 0.5*src[wid*(y+1)+x];
	}
	return ImageMat.convolve(src,wid,hei, [-0.5,0,0.5], 1,3);
}
ImageMat.gradientVector = function(src,wid,hei, x,y){
	var gradX = ImageMat.derivativeX(src,wid,hei, x,y);
	var gradY = ImageMat.derivativeY(src,wid,hei, x,y);
	if(x!==undefined && y!==undefined){
		return new V2D(gradX,gradY);
	}
	var vectors = [];
	gradX = gradX.value;
	gradY = gradY.value;
	for(var i=0; i<gradX.length; ++i){
		vectors[i] = new V2D(gradX[i],gradY[i]);
	}
	return vectors;
}
ImageMat.gradientMagnitude = function(src,wid,hei, x,y){
	var gradX = ImageMat.derivativeX(src,wid,hei, x,y);
	var gradY = ImageMat.derivativeY(src,wid,hei, x,y);
	if(x!==undefined && y!==undefined){
		return gradX+gradY;
	}
	gradX = gradX.value;
	gradY = gradY.value;
	for(var i=gradX.length; i-- > 0;){
		gradX[i] = Math.sqrt(gradX[i]*gradX[i] + gradY[i]*gradY[i]);
	}
	return {"value":gradX, "width":wid, "height":hei};
}
ImageMat.gradientAngle = function(src,wid,hei, x,y){
	var gradX = ImageMat.derivativeX(src,wid,hei, x,y);
	var gradY = ImageMat.derivativeY(src,wid,hei, x,y);
	if(x!==undefined && y!==undefined){
		return gradX+gradY;
	}
	gradX = gradX.value;
	gradY = gradY.value;
	for(var i=gradX.length; i-- > 0;){
		gradX[i] = Math.atan2(gradY[i],gradX[i]);
	}
	return {"value":gradX, "width":wid, "height":hei};
}
ImageMat.secondDerivativeX = function(src,wid,hei, x,y){
	if(x!==undefined && y!==undefined){
		return src[wid*y+(x-1)] - 2.0*src[wid*y+x] + src[wid*y+(x+1)];
	}
	return ImageMat.convolve(src,wid,hei, [1.0,-2,1.0], 3,1);
}
ImageMat.secondDerivativeY = function(src,wid,hei, x,y){
	if(x!==undefined && y!==undefined){
		return src[wid*(y-1)] - 2.0*src[wid*y+x] + src[wid*(y+1)+x];
	}
	return ImageMat.convolve(src,wid,hei, [1.0,-2,1.0], 1,3);
}
ImageMat.secondDerivativeXY = function(src,wid,hei, x,y){ // ?
	//return ImageMat.laplacian(src,wid,hei, x,y);
	if(x!==undefined && y!==undefined){
		return 0.25*src[wid*(y-1)+(x-1)] - 0.25*src[wid*(y-1)+(x+1)] - 0.25*src[wid*(y+1)+(x-1)] + 0.25*src[wid*(y+1)+(x+1)];
	}
	return ImageMat.convolve(src,wid,hei, [0.25,0,-0.25, 0,0,0, -0.25,0,0.25], 3,3);
}
ImageMat.laplacian = function(src,wid,hei, x,y){ // 2nd derivative (spatial)
	if(x!==undefined && y!==undefined){
		return -1.0*src[wid*(y-1)+(x+0)] - 1.0*src[wid*(y+0)+(x-1)] + 4.0*src[wid*(y+0)+(x+0)] - 1.0*src[wid*(y+0)+(x+1)] - 1*src[wid*(y+1)+(x+0)];
	}
	return ImageMat.convolve(src,wid,hei, [0,-1,0, -1,4,-1, 0,-1,0], 3,3);
	//return ImageMat.convolve(src,wid,hei, [-1,-1,-1, -1,8,-1, -1,-1,-1], 3,3);
	//return ImageMat.convolve(src,wid,hei, [-0.5,-1,-0.5, -1,6,-1, -0.5,-1,-0.5], 3,3);
}
ImageMat.prototype.laplacian = function(){
	var width = this.width();
	var height = this.height();
	this.red( ImageMat.laplacian(this.red(), width, height).value );
	this.grn( ImageMat.laplacian(this.grn(), width, height).value );
	this.blu( ImageMat.laplacian(this.blu(), width, height).value );
}
ImageMat.sharpen = function(src,wid,hei){
	var val = ImageMat.convolve(src,wid,hei, [0,-0.25,0, -0.25,2.0,-0.25, 0,-0.25,0], 3,3);
	var arr = val.value;
	ImageMat.clipFloat01(arr);
	return val;
	//return ImageMat.convolve(src,wid,hei, [0,-1,0, -1,5,-1, 0,-1,0], 3,3);
	//return ImageMat.convolve(src,wid,hei, [-1,-1,-1, -1,9,-1, -1,-1,-1], 3,3);
	// create gaussian,
	// sharp = gaussian - image
	// normalize to [+1,-1]
	// add sharp to image
	// [0,0,0, 0,2,0, 0,0,0] - 1/9*[1,1,1, 1,1,1, 1,1,1] (OR GAUSSIAN)
	// TODO
}
ImageMat.sobel = function(src,wid,hei, w,h){
	// 1/8*[-1,0,1, -2,-0,2, -1,0,1] , 1/8*[1,2,1, 0,0,0, -1,-2,-1]
	// TODO
}
ImageMat.meanFilter = function(src,wid,hei, w,h){
	if(w!==undefined && w!==undefined){
		var i, len = w*h;
		var num = 1.0/len;
		var filter = new Array(len);
		for(i=0;i<len;++i){ filter[i] = num; }
		ImageMat.convolve(src,wid,hei, filter, w,h);	
	}
	return ImageMat.convolve(src,wid,hei, [1/9,1/9,1/9, 1/9,1/9,1/9, 1/9,1/9,1/9], 3,3);
}
ImageMat.medianFilter = function(src,wid,hei, w,h){
	// .. nonlinear
	return ImageMat.convolve(src,wid,hei, [0], 1,1);
}

ImageMat.laplaceOfGaussian = function(src,wid,hei, sigma, w,h){
	sigma = sigma!==undefined?sigma:1.6;
	w = w!==undefined?(Math.ceil(1+sigma*3)*2+1):3;
	h = h!==undefined?h:w;
	var log = ImageMat.getLaplaceOfGaussianWindow(w,h,sigma);
	//console.log( ImageMat.floatToOctave(log,w,h) );
	return ImageMat.convolve(src,wid,hei, log, w,h);
	return log;
}
ImageMat.laplaceOfGaussianX = function(src,wid,hei, sigma, w,h){
	sigma = sigma!==undefined?sigma:1.6;
	w = w!==undefined?w:3;
	h = h!==undefined?h:3;
	var log = ImageMat.getLaplaceOfGaussianWindow(w,h,sigma);
	return ImageMat.convolve(src,wid,hei, log, w,h);
}
ImageMat.floatToString = function(src,wid,hei){
	var str = "";
	var i, j, wj;
	for(j=0;j<hei;++j){
		wj = wid*j;
		str += "[ ";
		for(i=0;i<wid;++i){
			str += (src[wj+i])+" ";
		}
		str += "]\n";
	}
	return str;
}
ImageMat.floatToOctave = function(src,wid,hei){
	var str = "";
	str += "tx = linspace(1,"+wid+","+wid+");\n";
	str += "ty = linspace(1,"+hei+","+hei+");\n";
	str += "[xx,yy] = meshgrid(tx,ty);\n";
	str += "tz = [";
	var i, j, wj;
	for(j=0;j<hei;++j){
		wj = wid*j;
		str += " ";
		for(i=0;i<wid;++i){
			str += (src[wj+i])+" ";
		}
		if(j<hei-1){
			str += ";\n";
		}
	}
	str += "]\n";
	str += "mesh(tx,ty,tz);";
	return str;
}
ImageMat.prototype.refineCornerPoints = function(points, distance){ // assuming only a few pixels off ?
	distance = distance!==undefined ? distance : 10;
	var width = this.width();
	var height = this.height();
	var winSize = 2*distance + 1;
	var pointOffset = Math.floor(winSize*0.5);
	var nextPoints = [];
	var i, len = points.length;
	var point, win, next, local;
	for(var i=0; i<len; ++i){
		point = points[i];
		win = this.extractRectFromFloatImage(point.x,point.y, 1.0, null, winSize, winSize, null); // TODO: not efficient if only getting gry
		win = win.gry();
		local = new V2D( pointOffset, pointOffset );
		next = R3D.harrisCornerRefine(win, winSize,winSize, local);
		if(next){
			next = new V2D(point.x + next.x - pointOffset, point.y + next.y - pointOffset);
			nextPoints.push(next);
		}else{
			nextPoints.push(next);
		}
	}
	return nextPoints;
}

ImageMat.prototype.corners = function(){
	var width = this.width();
	var height = this.height();
	// TODO add padding and trim edge corners
	var cornerScores = R3D.harrisCornerDetection(this.gry(), width, height);//, konstant, sigma);
	var corners  = Code.findExtrema2DFloat(cornerScores,width,height);
	corners = corners.sort(function(a,b){
		return Math.abs(a.z)>Math.abs(b.z) ? -1 : 1;
	});
	return corners;
	// // corners
	// var cornerThreshold = 0.55;
	// var cornerMat = [0.25,-0.5,0.25, -0.5,1,-0.5, 0.25,-0.5,0.25];
	// var cornerRed = ImageMat.convolve(red,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerRed); ImageMat.applyFxnFloat(cornerRed, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerRed);
	// var cornerGrn = ImageMat.convolve(grn,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerGrn); ImageMat.applyFxnFloat(cornerGrn, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerGrn);
	// var cornerBlu = ImageMat.convolve(blu,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerBlu); ImageMat.applyFxnFloat(cornerBlu, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerBlu);
	// var cornerGry = ImageMat.convolve(gry,wid,hei, cornerMat, 3,3); ImageMat.normalFloat01(cornerGry); ImageMat.applyFxnFloat(cornerGry, ImageMat.flipAbsFxn); ImageMat.normalFloat01(cornerGry);
	// imageCornerRGB.setFromFloats(cornerRed, cornerGrn, cornerBlu);
	// imageCornerGry.setFromFloats(cornerGry, cornerGry, cornerGry);
}
ImageMat.harrisDetector = function(src,wid,hei, SMM, threshold, sigma, kMult){
	console.log("USE R3D");
	return null;
	// A(x) = autocorrelation = [gaussian window]*[Ixx(x) Ixy(x) ; Ixy(x) Iyy(x)]
	// H(x) = harris measure = det(A) - alpha*trace^2(A)
	var temp, padding, gaussSource, Ix, Iy, IxIx, IxIy, IyIy, Sxx, Sxy, Syy;
	var determinant, trace, result;
	sigma = sigma!==undefined?sigma:1.6;//1.6;
	threshold = threshold!==undefined?threshold:0.1;
	kMult = kMult!==undefined?kMult:0.05; // [0.04,0.06]
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	// padded gaussian source
	padding = Math.floor(gaussSize/2.0);
	gaussSource = ImageMat.padFloat(src, wid,hei, padding,padding,padding,padding);
	gaussSource = ImageMat.gaussian2DFrom1DFloat(gaussSource, wid+2*padding,hei+2*padding, gauss1D); // now it's actually a gaussian
	// image derivatives
	Ix = ImageMat.derivativeX(gaussSource, wid+2*padding,hei+2*padding).value;
	Iy = ImageMat.derivativeY(gaussSource, wid+2*padding,hei+2*padding).value;
	// IxIx = ImageMat.mulFloat(Ix,Ix);
	// IxIy = ImageMat.mulFloat(Ix,Iy);
	// IyIy = ImageMat.mulFloat(Iy,Iy);
	IxIx = ImageMat.derivativeX(Ix,width,height).value;
	IyIy = ImageMat.derivativeY(Iy,width,height).value;
	IxIy = ImageMat.derivativeY(Ix,width,height).value;
	// sum of products - whatever that means
	Sxx = IxIx;
	Sxy = IxIy;
	Syy = IyIy;
	Sxx = ImageMat.gaussian2DFrom1DFloat(Sxx, wid+2*padding,hei+2*padding, gauss1D);
	Sxy = ImageMat.gaussian2DFrom1DFloat(Sxy, wid+2*padding,hei+2*padding, gauss1D);
	Syy = ImageMat.gaussian2DFrom1DFloat(Syy, wid+2*padding,hei+2*padding, gauss1D);
	// unpad results for usage
	//gaussSource = ImageMat.gaussian2DFrom1DFloat(gaussSource, wid+2*padding,hei+2*padding, gauss1D); // now it's actually a gaussian
	gaussSource = ImageMat.unpadFloat(gaussSource, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Sxx = ImageMat.unpadFloat(Sxx, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Sxy = ImageMat.unpadFloat(Sxy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Syy = ImageMat.unpadFloat(Syy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IxIx = ImageMat.unpadFloat(IxIx, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IxIy = ImageMat.unpadFloat(IxIy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IyIy = ImageMat.unpadFloat(IyIy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	// calculate H(x,y) - to get eigenvalues
	var arr, l1,l2, i, len = wid*hei;
response = ImageMat.newZeroFloat(wid,hei);
var A = new Array();
var alpha = 0.01;
var sum = 0;
var minL = 1E-15;
	for(i=0;i<len;++i){
SMM[i] = [ Sxx[i], Sxy[i], Sxy[i], Syy[i] ];
		// arr = Matrix.eigenValues2D(Sxx[i],Sxy[i],Sxy[i],Syy[i]);
		// l1 = arr[0]; l2 = arr[1];
		// //console.log(arr[0],arr[1], " - ", Sxx[i],Sxy[i],Sxy[i],Syy[i] );
		// response[i] = l1*l2 - kMult*Math.pow(l1+l2,2);
		// if(i%10000==0){
		// 	console.log(l1,l2);
		// }
A[i] = [gaussSource[i]*IxIx[i], gaussSource[i]*IxIy[i], gaussSource[i]*IxIy[i], gaussSource[i]*IyIy[i]];
//A[i] = [IxIx[i], IxIy[i], IxIy[i], IyIy[i]];
arr = Matrix.eigenValues2D(A[i][0],A[i][1],A[i][2],A[i][3])
response[i] = (A[i][0]*A[i][3] - A[i][1]*A[i][2]) - alpha*(Math.pow((A[i][0]+A[i][3]),2));//*(IxIx[i]*IyIy[i] - IxIy[i]*IxIy[i]) - kMult*Math.pow(IxIx[i],2);
//response[i] = arr[0]*arr[1] - alpha*Math.pow(arr[0]+arr[1],2);
	if( Math.round(Math.random()*10000)%5000==0 ){
		//console.log(response[i]);
		//console.log( (A[0],A[1],A[2],A[3]) );
		//console.log( Matrix.eigenValues2D(A[i][0],A[i][1],A[i][2],A[i][3]) );
		//console.log(arr);
	}
	if(Math.abs(arr[0])>minL && Math.abs(arr[1])>minL){
		++sum;
	}
//SMM[i] = A[i];
	//response[i] = arr[0]*arr[1];

//		response[i] = (Sxx[i]*Syy[i] - Sxy[i]*Sxy[i]) - kMult*Math.pow(Sxx[i],2);
	}
//console.log(sum);
response = ImageMat.absFloat(response);
//console.log(Math.max.apply(this,response));
response = ImageMat.getNormalFloat01(response);
//response = ImageMat.mulConst(response,5.0);
//response = ImageMat.gtFloat(response,0.143);
//response = ImageMat.gtFloat(response,threshold);
//response = ImageMat.normalFloat01(response);
//return response;
return {response:response,Lx:Ix,Ly:Iy};
	// calculate response at each pixel
	trace = ImageMat.addFloat(Sxx,Syy); // l1 + l2
	determinant = ImageMat.subFloat(ImageMat.mulFloat(Sxx,Syy), ImageMat.mulFloat(Sxy,Sxy)); // l1*l2
// console.log( Math.max.apply(this,determinant) );
// console.log( Math.min.apply(this,determinant) );
// return determinant;
	traceSquareK = ImageMat.scaleFloat(kMult, ImageMat.mulFloat(trace,trace));
	response = ImageMat.subFloat(determinant,traceSquareK);
	// threshold output
console.log( Math.max.apply(this,response) );
console.log( Math.min.apply(this,response) );
	return response;
}


ImageMat.harrisDetectorSMM = function(src,wid,hei, sigma){
	var temp, padding, gaussSource, Ix, Iy, IxIx, IxIy, IyIy, Sxx, Sxy, Syy;
	var determinant, trace, result;
	sigma = sigma!==undefined?sigma:1.6;//1.6;
	kMult = 0.05; // [0.04,0.06]
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	// padded gaussian source
	padding = Math.floor(gaussSize/2.0);
	gaussSource = ImageMat.padFloat(src, wid,hei, padding,padding,padding,padding);
	var w2pad = wid+2*padding, h2pad = hei+2*padding;
	gaussSource = ImageMat.gaussian2DFrom1DFloat(gaussSource, wid+2*padding,hei+2*padding, gauss1D); // now it's actually a gaussian
	// image derivatives
	Ix = ImageMat.derivativeX(gaussSource, wid+2*padding,hei+2*padding);
	Iy = ImageMat.derivativeY(gaussSource, wid+2*padding,hei+2*padding);
	// IxIx = ImageMat.mulFloat(Ix,Ix);
	// IxIy = ImageMat.mulFloat(Ix,Iy);
	// IyIy = ImageMat.mulFloat(Iy,Iy);
	IxIx = ImageMat.derivativeX(Ix,width,height).value;
	IyIy = ImageMat.derivativeY(Iy,width,height).value;
	IxIy = ImageMat.derivativeY(Ix,width,height).value;
	// sum of products - whatever that means
	Sxx = IxIx;
	Sxy = IxIy;
	Syy = IyIy;
	Sxx = ImageMat.gaussian2DFrom1DFloat(Sxx, wid+2*padding,hei+2*padding, gauss1D);
	Sxy = ImageMat.gaussian2DFrom1DFloat(Sxy, wid+2*padding,hei+2*padding, gauss1D);
	Syy = ImageMat.gaussian2DFrom1DFloat(Syy, wid+2*padding,hei+2*padding, gauss1D);
	// unpad results for usage
	//gaussSource = ImageMat.gaussian2DFrom1DFloat(gaussSource, wid+2*padding,hei+2*padding, gauss1D); // now it's actually a gaussian
	gaussSource = ImageMat.unpadFloat(gaussSource, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Sxx = ImageMat.unpadFloat(Sxx, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Sxy = ImageMat.unpadFloat(Sxy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	Syy = ImageMat.unpadFloat(Syy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IxIx = ImageMat.unpadFloat(IxIx, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IxIy = ImageMat.unpadFloat(IxIy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	IyIy = ImageMat.unpadFloat(IyIy, wid+2*padding,hei+2*padding, padding,padding,padding,padding);
	var len = wid*hei;
	var SMM = new Array();
	for(i=0;i<len;++i){
		SMM[i] = [ Sxx[i], Sxy[i], Sxy[i], Syy[i] ];
	}
	var cen = w2pad*Math.floor(h2pad*0.5) + w2pad;
	var ret = {gradientX:Ix[cen] ,gradientY:Iy[cen], SMM:SMM}
	return ret;
}



ImageMat._center1 = new V2D();
ImageMat._center2 = new V2D();
ImageMat._O = new V2D();
ImageMat._TL = new V2D();
ImageMat._TR = new V2D();
ImageMat._BR = new V2D();
ImageMat._BL = new V2D();

ImageMat.extractRectFromFloatImageBasic = function(x,y, outWidth,outHeight, source,sourceWidth,sourceHeight){
	return ImageMat.extractRectFromFloatImage(x,y,1.0,null, outWidth,outHeight, source,sourceWidth,sourceHeight,null);
}
ImageMat.prototype.toImage = function(stage){
	return stage.getFloatRGBAsImage(this.red(),this.grn(),this.blu(), this.width(),this.height());
}
// (point.x,point.y,scale,1.6, size,size, ZFeature.MatrixWithRotation(-this._angle.t, 1.0, 0.25));
ImageMat.prototype.extractRectFromFloatImage = function(x,y,scale,sigma,w,h,matrix){
	var red = ImageMat.extractRectFromFloatImage(x,y,scale,sigma,w,h, this._r,this._width,this._height, matrix);
	var grn = ImageMat.extractRectFromFloatImage(x,y,scale,sigma,w,h, this._g,this._width,this._height, matrix);
	var blu = ImageMat.extractRectFromFloatImage(x,y,scale,sigma,w,h, this._b,this._width,this._height, matrix);
	return new ImageMat(w,h, red,grn,blu);
}

ImageMat.prototype.calculateGradient = function(x,y, blur){
	x = (x!==undefined && x!==null) ? x : Math.floor((this._width-1)*.5);
	y = (y!==undefined && x!==null) ? y : Math.floor((this._height-1)*.5);
	var w = this.width();
	var h = this.height();
	var size = 3;
	var index = Math.floor(size/2);

	var rB, gB, bB;
	if(blur){
		var gaussSize = Math.round(Math.sqrt((w+h)*0.5));
		var sigma = 1.6;
		var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
		var rB = ImageMat.gaussian2DFrom1DFloat(this._r, w,h, gauss1D);
		var gB = ImageMat.gaussian2DFrom1DFloat(this._g, w,h, gauss1D);
		var bB = ImageMat.gaussian2DFrom1DFloat(this._b, w,h, gauss1D);
	}else{
		rB = this._r;
		gB = this._g;
		bB = this._b;
	}
	var r = ImageMat.extractRectFromFloatImageBasic(x,y,size,size, rB,w,h);
	var g = ImageMat.extractRectFromFloatImageBasic(x,y,size,size, gB,w,h);
	var b = ImageMat.extractRectFromFloatImageBasic(x,y,size,size, bB,w,h);
	var y = ImageMat.grayFromRGBFloat(r,g,b);
	var Ix = ImageMat.derivativeX(y, size,size);
	var Iy = ImageMat.derivativeY(y, size,size);
	Ix = Ix.value;
	Iy = Iy.value;
	var dir = new V2D(Ix[index],Iy[index]);
	dir.norm();
	return dir;
}
ImageMat.getScaledImage = function(source,wid,hei, scale, sigma, forceWidth,forceHeight){
	var newWid = Math.round(scale*wid);
	var newHei = Math.round(scale*hei);
	if(forceWidth && forceHeight){
		newWid = forceWidth;
		newHei = forceHeight;
	}
	if(sigma){
		source = ImageMat.getBlurredImage(source, wid,hei, sigma);
	}
	//var x = wid*0.5;
	//var y = hei*0.5;
	//var newImg = ImageMat.extractRectFromFloatImage(x,y,1.0/scale,null, newWid,newHei, source,wid,hei, null);
	var newImg = ImageMat.extractRectSimple(source,wid,hei, 0,0,wid-1,hei-1, newWid,newHei);
	return {"width":newWid, "height":newHei, "value":newImg};
}
ImageMat.getBlurredImage = function(source,wid,hei, sigma){ // does auto padding and unpadding to avoid shadow on image edges
	var x = wid*0.5;
	var y = hei*0.5;
	gaussSize = Math.round(5.0 + sigma*2.0)*2+1;
	//gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma,null,   false, false);
	padding = Math.ceil(gaussSize/2.0);
	var totWid = wid+2*padding;
	var totHei = hei+2*padding;
	//source = ImageMat.extractRectFromFloatImage(x,y,1.0,null, totWid,totHei, source,wid,hei, null);
	source = ImageMat.padFloat(source,wid,hei, padding,padding,padding,padding);
	source = ImageMat.gaussian2DFrom1DFloat(source, totWid,totHei, gauss1D);
	source = ImageMat.unpadFloat(source, totWid,totHei, padding,padding,padding,padding);
	return source;
}
ImageMat.extractRectFromFloatImage = function(x,y,scale,sigma, w,h, imgSource,imgWid,imgHei, matrix){ // scale=opposite behavior, w/h=destination width/height, 
	var blurr = (sigma!==undefined) && (sigma!=null);
	var gaussSize, gauss1D, padding=0;// fullX=(imgWid*x), fullY=(imgHei*y); // wtf
	var img;
	var fullX = x; // wtf
	var fullY = y; // wtf
	// console.log(fullX,fullY)
	// console.log("blurr: "+blurr);
	if(blurr){
		gaussSize = Math.round(5.0 + sigma*2.0)*2+1;
		gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
		padding = Math.ceil(gaussSize/2.0);
	}
	
	var left = fullX - (w*0.5)*scale - padding*scale;
	var right = fullX + (w*0.5)*scale + padding*scale;
	var top = fullY - (h*0.5)*scale - padding*scale;
	var bot = fullY + (h*0.5)*scale + padding*scale;
	var O = ImageMat._O; O.set(0,0);
	var TL = ImageMat._TL; TL.set(left,top);
	var TR = ImageMat._TR; TR.set(right,top);
	var BR = ImageMat._BR; BR.set(right,bot);
	var BL = ImageMat._BL; BL.set(left,bot);
//	console.log(left,right,top,bot)

	if(matrix){
		var matinv = matrix;
		matrix = Matrix.inverse(matrix);
		var center1 = ImageMat._center1; center1.set(fullX,fullY);
		var center2 = ImageMat._center2; center2.set(0,0);
		matinv.multV2DtoV2D(center2,center1);
		// to origin
		var m = new Matrix(3,3);
		m.setFromArray([1,0, -center1.x, 0,1, -center1.y, 0,0,1]);
		matrix = Matrix.mult(matrix,m);
		// to updated center
		m.setFromArray([1,0, center2.x, 0,1, center2.y, 0,0,1]);
		matrix = Matrix.mult(matrix,m);
		// apply to all points
		matrix.multV2DtoV2D(TL,TL);
		matrix.multV2DtoV2D(TR,TR);
		matrix.multV2DtoV2D(BR,BR);
		matrix.multV2DtoV2D(BL,BL);
	}
	// EXTRACT AROUND SOURCE POINT
	var wid = w+2*padding;
	var hei = h+2*padding;
	var img = ImageMat.extractRect(imgSource, TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y, wid,hei, imgWid,imgHei);
	// BLUR IMAGE
	if(blurr){
		img = ImageMat.gaussian2DFrom1DFloat(img, wid,hei, gauss1D);
		// DE-PAD IMAGE
		img = ImageMat.unpadFloat(img, wid,hei, padding,padding,padding,padding);
	}
	return img;
}
ImageMat._watershedPointSort = function(a,b){
	if(a==b){
		return 0;
	}
	if(a.z<b.z){
		return -1;
	}
	if(a.z>b.z){
		return 1;
	}
	if(a.x<b.x){
		return -1;
	}
	if(a.x>b.x){
		return 1;
	}
	if(a.y<b.y){
		return -1;
	}
	if(a.y>b.y){
		return 1;
	}
}

ImageMat._watershed_internal = function(heightMap,width,height, inverseMask){
	// TODO: OPTION TO LET GROUPS THAT ARE ENTIRELY CONTAINED TO BE SUBSUMED BY CONTAINER?
	var i, j, index, h, v;
	var pixelCount = width*height;
	var groupMap = new Array(pixelCount);
	var groupHeights = [];
	var groupLists = [];
	var groupRects = [];
	var group = 0;
	// order all pixels by height
	var pointQueue = new PriorityQueue();
	pointQueue.sorting( ImageMat._watershedPointSort );
	// label all pixels as unknown group
	for(index=0; index<pixelCount; ++index){
		groupMap[index] = -1; // unknown group
		if(inverseMask && inverseMask[index]!=0.0){ // true || !=0
			continue; // only consider if 0
		}
		i = index % width;
		j = Math.floor(index/width);
		h = heightMap[index];
		v = new V3D(i,j,h);
		pointQueue.push(v);
	}
	// assign groups iteratively
	pointQueue = pointQueue.toArray();
	var queueLength = pointQueue.length;
	// for each pixel in height queue
	for(index=0; index<queueLength; ++index){
		v = pointQueue[index];
		i = v.x;
		j = v.y;
		h = v.z;
		var neighbors = ImageMat._watershed_neighbors(groupMap, width, height, i, j, inverseMask);
		var highestGroup = ImageMat._watershed_highest_group(neighbors, groupHeights);
		if(highestGroup==null){ // pixel is only bordered by unknown neighbors
			groupMap[j*width + i] = group; // assign it to new group
			groupLists[group] = [];
			groupHeights[group] = h;
			groupRects[group] = new Rect(i,j,1,1);
			highestGroup = group;
			++group;
		}else{ // pixel borders labeled neighbor(s) 
			groupMap[j*width + i] = highestGroup; // => assign it to group with largest _peak_ height
			groupRects[highestGroup].union(new Rect(i,j,1,1));
		}
		//groupRects[highestGroup] = Rect.union(groupRects[highestGroup], new Rect(i,j,1,1));
		groupLists[highestGroup].push(v);
	}
	return {"pixels":groupMap, // 2d array of pixels with value = groupID
			"groups":groupLists, // array of group arrays of V3Ds
			"heights":groupHeights, // array of group maxHeights
			"rects":groupRects //  array of group rects
			};
}
ImageMat._watershed_highest_group = function(neighbors, groupList){
	var highestGroup = null;
	var highestHeight = null;
	for(var i=neighbors.length; i>0; --i){
		var group = neighbors[i];
		if(group>=0){
			var height = groupList[group];
			if(highestGroup==null || height>highestHeight){
				highestGroup = group;
				highestHeight = height;
			}
		}
	}
	return highestGroup;
}
ImageMat._watershed_neighbors = function(gridList, width, height, i, j, inverseMask){
	var wm1 = width-1;
	var hm1 = height-1;
	var list = [];
	var index;
	if(j>0 && i>0){ // up & left
		index = (j-1)*width + (i-1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(j>0){ // up
		index = (j-1)*width + i;
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(j>0 && i<wm1){ // up & right
		index = (j-1)*width + (i+1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(i>0){ // left
		index = j*width + (i-1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(i<wm1){ // left & right
		index = j*width + (i+1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(j<hm1 && i>0){ // down & left
		index = (j+1)*width + (i-1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(j<hm1){ // down
		index = j*width + i;
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	if(j<hm1 && i<wm1){ // down & right
		index = (j+1)*width + (i+1);
		if( !inverseMask || (inverseMask && inverseMask[index]==0.0) ){
			list.push( gridList[ index ] );
		}
	}
	return list;
}

//ImageMat.watershed = ImageMat.watershed_2;
ImageMat.watershed = ImageMat._watershed_internal;

ImageMat.heatImage = function(image, width, height, inverse){ // expecting normalized greyscale image
	// white, orange, red, green, light-blue, blue, purple, black
	var colors = [0xFFFFFFFF, 0xFFFF9900, 0xFFFF0000, 0xFF00FF00, 0xFF3399FF, 0xFF0000FF, 0xFF330066, 0xFF000000];
	if(inverse===true){
		colors = Code.reverseArray(colors);
	}
	var r = [], g = [], b = [];
	var i, len = image.length;
	for(i=0; i<len; ++i){
		var percent = image[i];
		var color = Code.interpolateColorGradientARGB(percent, colors);
		r[i] = Code.getFloatRedARGB(color);
		g[i] = Code.getFloatGrnARGB(color);
		b[i] = Code.getFloatBluARGB(color);
	}
	return new ImageMat(width, height, r,g,b);
}

/*
this.colorQuadrantCubic = function(colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP, x,y){
	var r = this.quadric2D(x,y, Code.getRedRGBA(colA), Code.getRedRGBA(colB), Code.getRedRGBA(colC), Code.getRedRGBA(colD), 
						Code.getRedRGBA(colE), Code.getRedRGBA(colF), Code.getRedRGBA(colG), Code.getRedRGBA(colH), 
						Code.getRedRGBA(colI), Code.getRedRGBA(colJ), Code.getRedRGBA(colK), Code.getRedRGBA(colL), 
						Code.getRedRGBA(colM), Code.getRedRGBA(colN), Code.getRedRGBA(colO), Code.getRedRGBA(colP) );
	var g = this.quadric2D(x,y, Code.getGrnRGBA(colA), Code.getGrnRGBA(colB), Code.getGrnRGBA(colC), Code.getGrnRGBA(colD), 
						Code.getGrnRGBA(colE), Code.getGrnRGBA(colF), Code.getGrnRGBA(colG), Code.getGrnRGBA(colH), 
						Code.getGrnRGBA(colI), Code.getGrnRGBA(colJ), Code.getGrnRGBA(colK), Code.getGrnRGBA(colL), 
						Code.getGrnRGBA(colM), Code.getGrnRGBA(colN), Code.getGrnRGBA(colO), Code.getGrnRGBA(colP) );
	var b = this.quadric2D(x,y, Code.getBluRGBA(colA), Code.getBluRGBA(colB), Code.getBluRGBA(colC), Code.getBluRGBA(colD), 
						Code.getBluRGBA(colE), Code.getBluRGBA(colF), Code.getBluRGBA(colG), Code.getBluRGBA(colH), 
						Code.getBluRGBA(colI), Code.getBluRGBA(colJ), Code.getBluRGBA(colK), Code.getBluRGBA(colL), 
						Code.getBluRGBA(colM), Code.getBluRGBA(colN), Code.getBluRGBA(colO), Code.getBluRGBA(colP) );
	var a = this.quadric2D(x,y, Code.getAlpRGBA(colA), Code.getAlpRGBA(colB), Code.getAlpRGBA(colC), Code.getAlpRGBA(colD), 
						Code.getAlpRGBA(colE), Code.getAlpRGBA(colF), Code.getAlpRGBA(colG), Code.getAlpRGBA(colH), 
						Code.getAlpRGBA(colI), Code.getAlpRGBA(colJ), Code.getAlpRGBA(colK), Code.getAlpRGBA(colL), 
						Code.getAlpRGBA(colM), Code.getAlpRGBA(colN), Code.getAlpRGBA(colO), Code.getAlpRGBA(colP) );
	r = Code.color255(r); g = Code.color255(g); b = Code.color255(b); a = Code.color255(a);
	return Code.getColRGBA(r,g,b,a);
}
this.quadric2D = function(x,y, A,B,C,D, E,F,G,H, I,J,K,L, M,N,O,P){
	var xx = x*x; var xxx = xx*x;
	var yy = y*y; var yyy = yy*y;
	var a = this.quadric1D(x,xx,xxx, A,B,C,D);
	var b = this.quadric1D(x,xx,xxx, E,F,G,H);
	var c = this.quadric1D(x,xx,xxx, I,J,K,L);
	var d = this.quadric1D(x,xx,xxx, M,N,O,P);
	return this.quadric1D(y,yy,yyy, a,b,c,d);
}
this.quadric1D = function(t,tt,ttt,A,B,C,D){
	var a = 3*B - 3*C + D - A;
	var b = 2*A - 5*B + 4*C - D;
	var c = B - A;
	var d = B;
	return ( a*ttt + b*tt + c*t + d );
}
this.quadric1DBAD = function(t,tt,ttt,A,B,C,D){ // less clear
	var mB = (C-A)/2;
	var mC = (D-B)/2;
	var a = mC + mB - 2*C + 2*B;
	var b = 3*C - mC - 2*mB - 3*B;
	var c = mB;
	var d = B;
	return ( a*ttt + b*tt + c*t + d );
}
*/

