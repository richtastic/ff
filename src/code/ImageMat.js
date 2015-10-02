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
function ImageMat(wid, hei){
	this.init(wid,hei);
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
	if(x<0||x>wid){ minX=0.0;}
	minY = y - minY;
	if(y<0||y>hei){ minY=0.0;}
	ImageMat.cubicColor(val, minX,minY, colA,colB,colC,colD,colE,colF,colG,colH,colI,colJ,colK,colL,colM,colM,colN,colO,colP);
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
ImageMat.cubicColor = function(colR, x,y, colA,colB,colC,colD,colE,colF,colG,colH,colI,colJ,colK,colL,colM,colM,colN,colO,colP){
	var r = ImageMat.cubic2D(x,y, colA.x,colB.x,colC.x,colD.x,colE.x,colF.x,colG.x,colH.x,colI.x,colJ.x,colK.x,colL.x,colM.x,colM.x,colN.x,colO.x,colP.x);
	var g = ImageMat.cubic2D(x,y, colA.y,colB.y,colC.y,colD.y,colE.y,colF.y,colG.y,colH.y,colI.y,colJ.y,colK.y,colL.y,colM.y,colM.y,colN.y,colO.y,colP.y);
	var b = ImageMat.cubic2D(x,y, colA.z,colB.z,colC.z,colD.z,colE.z,colF.z,colG.z,colH.z,colI.z,colJ.z,colK.z,colL.z,colM.z,colM.z,colN.z,colO.z,colP.z);
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
ImageMat.linear2D = function(colR, x,y, colA,colB,colC,colD){
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
ImageMat.prototype.red = function(){
	return this._r;
}
ImageMat.prototype.grn = function(){
	return this._g;
}
ImageMat.prototype.blu = function(){
	return this._b;
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
ImageMat.grayFromRGBFloat = function(r,g,b){
	var i, len = r.length;
	var a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = (r[i]+g[i]+b[i])/3.0;
	}
	return a;
}
ImageMat.grayFromFloats = function(r,g,b){
	var i, len = r.length;
	var a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = (r[i]+g[i]+b[i])/3.0;
	}
	return a;
}
ImageMat.ARGBFromFloats = function(rF,gF,bF){
	var i, len = rF.length;
	var col, r,g,b,a = new Array(len);
	for(i=0;i<len;++i){
		r = Math.round(rF[i]*255.0);
		g = Math.round(gF[i]*255.0);
		b = Math.round(bF[i]*255.0);
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
ImageMat.getGaussianWindow = function(width,height, sigmaX, sigmaY, normCenter){
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
	}else{
		for(i=0;i<len;++i){ // total == 1.0
			matrix[i] /= sum;
		}
	}
	return matrix;
}
ImageMat.getGaussianWindowSimple = function(width,height, sigma){ // === ImageMat.getGaussianWindow(width,height, sigma,sigma,true)
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
	return ImageMat.convolve( ImageMat.convolve(source,wid,hei, gauss1D,1,gauss1D.length), wid,hei, gauss1D,gauss1D.length,1);
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
	return result;
}
// INNER CONVOLUTION?
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
	val = ImageMat.linear2D(val, minX,minY, colA,colB,colC,colD);
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
	var val = ImageMat.cubic2D(minX,minY, colA,colB,colC,colD,colE,colF,colG,colH,colI,colJ,colK,colL,colM,colM,colN,colO,colP);
	if(isNaN(val)){
		console.log("PT",wid,hei,x,y);
		console.log("IN                ",colA,colB,colC,colD,colE,colF,colG,colH,colI,colJ,colK,colL,colM,colM,colN,colO,colP );
		console.log("colN "+colN+" => "+wasA+","+wasB+"    "+x+","+y);
		return 0;
	}
	return val
}

// projective transform
ImageMat.extractRectWithProjection = function(source,sW,sH, wid,hei, projection){ // projection is 3x3 Matrix
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
				//destination[wid*j+i] = ImageMat.getPointInterpolateCubic(source, sW,sH, fr.x,fr.y);
				destination[wid*j+i] = ImageMat.getPointInterpolateLinear(source, sW,sH, fr.x,fr.y);
			}
		}
	}
	return destination;
}
ImageMat.extractRect = function(source, aX,aY,bX,bY,cX,cY,dX,dY, wid,hei, sW,sH){ // generates homography beforehand
	var fromPoints = [new V2D(0,0), new V2D(wid-1,0), new V2D(wid-1,hei-1), new V2D(0,hei-1)];
	var toPoints = [new V2D(aX,aY), new V2D(bX,bY), new V2D(cX,cY), new V2D(dX,dY)];
	var projection = Matrix.get2DProjectiveMatrix(fromPoints,toPoints);
	return ImageMat.extractRectWithProjection(source,sW,sH, wid,hei, projection);
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
	if(x!==undefined && y!==undefined){
		return 0.25*src[wid*(y-1)+(x-1)] - 0.25*src[wid*(y-1)+(x+1)] - 0.25*src[wid*(y+1)+(x-1)] + 0.25*src[wid*(y+1)+(x+1)];
	}
	return ImageMat.convolve(src,wid,hei, [0.25,0,-0.25, 0,0,0, -0.25,0,0.25], 3,3);
}
ImageMat.laplacian = function(src,wid,hei){
	return ImageMat.convolve(src,wid,hei, [0,-1,0, -1,4,-1, 0,-1,0], 3,3);
	//return ImageMat.convolve(src,wid,hei, [-1,-1,-1, -1,8,-1, -1,-1,-1], 3,3);
	//return ImageMat.convolve(src,wid,hei, [-0.5,-1,-0.5, -1,6,-1, -0.5,-1,-0.5], 3,3);
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
	Ix = ImageMat.derivativeX(gaussSource, wid+2*padding,hei+2*padding);
	Iy = ImageMat.derivativeY(gaussSource, wid+2*padding,hei+2*padding);
	IxIx = ImageMat.mulFloat(Ix,Ix);
	IxIy = ImageMat.mulFloat(Ix,Iy);
	IyIy = ImageMat.mulFloat(Iy,Iy);
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
	IxIx = ImageMat.mulFloat(Ix,Ix);
	IxIy = ImageMat.mulFloat(Ix,Iy);
	IyIy = ImageMat.mulFloat(Iy,Iy);
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

ImageMat.extractRectFromFloatImage = function(x,y,scale,sigma, w,h, imgSource,imgWid,imgHei, matrix){ // scale=opposite behavior, w/h=destination width/height, 
	var blurr = (sigma!==undefined) && (sigma!=null);
	var gaussSize, gauss1D, padding=0, fullX=(imgWid*x), fullY=(imgHei*y); // wtf
	var img;
	if(blurr){
console.log("blurr");
		gaussSize = Math.round(5.0 + sigma*2.0)*2+1;
		gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
		padding = Math.floor(gaussSize/2.0);
	}
	fullX = x; // wtf
	fullY = y; // wtf
	var left = fullX - (w*0.5)*scale - padding*scale;
	var right = fullX + (w*0.5)*scale + padding*scale;
	var top = fullY - (h*0.5)*scale - padding*scale;
	var bot = fullY + (h*0.5)*scale + padding*scale;
	var O = ImageMat._O; O.set(0,0);
	var TL = ImageMat._TL; TL.set(left,top);
	var TR = ImageMat._TR; TR.set(right,top);
	var BR = ImageMat._BR; BR.set(right,bot);
	var BL = ImageMat._BL; BL.set(left,bot);
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


ImageMat.GROUP_UNASSIGNED = -1;
ImageMat.GROUP_START = 0;
ImageMat.watershed = function(heightMap,width,height){
	var h, i, j, p, q, v, len, index, neighbors;
	var wm1 = width-1, hm1 = height-1;
	pixelCount = heightMap.length;
	var gridList = new Array(len);
	var pointList = new PriorityQueue();
	pointList.sorting( ImageMat.watershedSort );
	// assign all pixels to unassigned group
	for(index=0;index<pixelCount;++index){
		i = index % width;
		j = Math.floor(index/width);
		v = heightMap[index];
		p = new ImageMat.WSPoint( new V3D(i,j,v) );
		p.label(ImageMat.GROUP_UNASSIGNED);
		pointList.push(p);
		gridList[index] = p;
	}
	// queue to array: order pixels in height
	pointList = pointList.toArray();
	pixelCount = pointList.length;
	// connect neighbors
	for(index=0;index<pixelCount;++index){
		i = index % width;
		j = Math.floor(index/width);
		p = gridList[index];
		if(j>0 && i>0){ // up & left
			p.addNeighbor( gridList[ (j-1)*width + (i-1) ] );
		}
		if(j>0){ // up
			p.addNeighbor( gridList[ (j-1)*width + i ] );
		}
		if(j>0 && i<wm1){ // up & right
			p.addNeighbor( gridList[ (j-1)*width + (i+1) ] );
		}
		if(i>0){ // left
			p.addNeighbor( gridList[ j*width + (i-1) ] );
		}
		if(i<wm1){ // left & right
			p.addNeighbor( gridList[ j*width + (i+1) ] );
		}
		if(j<hm1 && i>0){ // down & left
			p.addNeighbor( gridList[ (j+1)*width + (i-1) ] );
		}
		if(j<hm1){ // down
			p.addNeighbor( gridList[ j*width + i ] );
		}
		if(j<hm1 && i<wm1){ // down & right
			p.addNeighbor( gridList[ (j+1)*width + (i+1) ] );
		}
	}
	// for each pixel
	var currentGroup = ImageMat.GROUP_START;
	heightIndex=0;
var queue = new PriorityQueue();
queue.sorting( ImageMat.watershedSort );
	while(heightIndex<pixelCount){
		p = pointList[heightIndex];
		h = p.height();
		// assign all unassigned-neighbors to same group, or assign new group
		for(i=heightIndex; i<pixelCount; ++i){
			p = pointList[i];
			if(p.height()==h){
				neighbors = p.neighbors();
				queue.clear();
				for(j=0; j<neighbors.length; ++j){
					q = neighbors[j];
					if(q.label()!=ImageMat.GROUP_UNASSIGNED){
						queue.push(q);
						//p.label( q.label() );
						//break; // just one neighbor is sufficient
					}
				}
				// assign label of lowest/highest h
				//q = queue.popMinimum();
				q = queue.popMaximum();
				if(q){
					p.label( q.label() );
				}
				queue.clear();
				if(p.label()==ImageMat.GROUP_UNASSIGNED){
					p.label(currentGroup);
					currentGroup += 1;
				}
			}else{
				break;
			}
		}
		// goto next height
		heightIndex = i;
	}

	//

	var groupList = new Array(currentGroup);
	len = gridList.length;
	for(i=0; i<len; ++i){
		p = gridList[i];
		label = p.label();
		arr = groupList[label];
		if(!arr){
			groupList[label] = [];
			arr = groupList[label];
		}
		if(p.point().x==undefined || p.point().y==undefined){
			console.log(i+" / "+p);
		}
		v = new V2D( p.point().x, p.point().y );
		arr.push(v);
	}
	return groupList;
}




ImageMat.watershedSort = function(a,b){
	if(a==b){
		return 0;
	}
	a = a.point();
	b = b.point();
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
ImageMat.WSPoint = function(v){
	this._label = ImageMat.LABEL_INIT;
	this._distance = 0;
	this._neighbors = [];
	this._point = new V3D();
	this.point(v);
}
ImageMat.WSPoint.prototype.height = function(){
	return this._point.z;
}
ImageMat.WSPoint.prototype.label = function(l){
	if(l!==undefined){
		this._label = l;
	}
	return this._label;
}
ImageMat.WSPoint.prototype.point = function(v){
	if(v){
		this._point.copy(v);
	}
	return this._point;
}
ImageMat.WSPoint.prototype.distance = function(d){
	if(d!==undefined){
		this._distance = d;
	}
	return this._distance;
}
ImageMat.WSPoint.prototype.addNeighbor = function(n){
	if(n){
		this._neighbors.push(n);
	}
	return n;
}
ImageMat.WSPoint.prototype.neighbors = function(n){
	return this._neighbors;
}
ImageMat.WSPoint.prototype.toString = function(){
	var str = "[WSPoint: "+this.point().x+","+this.point().y+" @ "+this.point().z+" - "+this.label()+"]";
	return str;
}


ImageMat.LABEL_WATERSHED = 0;
ImageMat.LABEL_INIT = -1;
ImageMat.LABEL_MASK = -2;
ImageMat.watershed_1 = function(heightMap,width,height){
	var index, h, i, j, label, u, v, p, q, r, arr, len;
	var wm1 = width-1, hm1=height-1;
	var heightIndex, pixelCount;
	var queue = new PriorityQueue();
	var pointList = new PriorityQueue();
	len = heightMap.length;
	var gridList = new Array(len);
	// create points and sort on height
	pointList.sorting( ImageMat.watershedSort );
	for(index=0;index<len;++index){
		i = index % width;
		j = Math.floor(index/width);
		v = heightMap[index];
		p = new ImageMat.WSPoint(new V3D(i,j,v));
		pointList.push(p);
		gridList[index] = p;
	}
	// queue to array
	pointList = pointList.toArray();
	pixelCount = pointList.length;
	// connect neighbors
	for(index=0;index<len;++index){
		i = index % width;
		j = Math.floor(index/width);
		p = gridList[index];
		if(j>0 && i>0){ // up & left
			p.addNeighbor( gridList[ (j-1)*width + (i-1) ] );
		}
		if(j>0){ // up
			p.addNeighbor( gridList[ (j-1)*width + i ] );
		}
		if(j>0 && i<wm1){ // up & right
			p.addNeighbor( gridList[ (j-1)*width + (i+1) ] );
		}
		if(i>0){ // left
			p.addNeighbor( gridList[ j*width + (i-1) ] );
		}
		if(i<wm1){ // left & right
			p.addNeighbor( gridList[ j*width + (i+1) ] );
		}
		if(j<hm1 && i>0){ // down & left
			p.addNeighbor( gridList[ (j+1)*width + (i-1) ] );
		}
		if(j<hm1){ // down
			p.addNeighbor( gridList[ j*width + i ] );
		}
		if(j<hm1 && i<wm1){ // down & right
			p.addNeighbor( gridList[ (j+1)*width + (i+1) ] );
		}
	}
	//
	var fictitious = new ImageMat.WSPoint(new V3D(-1,-1,-1));
	var currentLabel = ImageMat.LABEL_WATERSHED;
	// start flooding
	heightIndex=0;
	while(heightIndex<pixelCount){
		p = pointList[heightIndex];
		h = p.height();
		// init queue with all p at h with neighbors at h & mask
		for(i=heightIndex; i<pixelCount; ++i){
			p = pointList[i];
			if(p.height()==h){
				p.label(ImageMat.LABEL_MASK);
				neighbors = p.neighbors();
				for(j=0; j<neighbors.length; ++j){
					q = neighbors[j];
					if(q.label()>0 || q.label()==ImageMat.LABEL_WATERSHED){
						p.distance(1);
						queue.push(p);
						break; // just one neighbor is sufficient
					}
				}
			}else{
				break;
			}
		}
		// 
		var currentDistance = 1;
		queue.push(fictitious);
		while( !queue.isEmpty() ){ // extend basins to all neighbors
			p = queue.popMinimum();
			if(p==fictitious){
				if(queue.isEmpty()){
					break;
				}else{
					queue.push(fictitious);
					currentDistance += 1;
					p = queue.popMinimum();
				}
			}
			// label p from neighbors q
			neighbors = p.neighbors();
			for(j=0; j<neighbors.length; ++j){
				q = neighbors[j];
				if(q.distance()<currentDistance && (q.label()>0 || q.label()==ImageMat.LABEL_WATERSHED) ){ // q is member of watershed
					if(q.label()>0){
						if(p.label()==ImageMat.LABEL_MASK || p.label()==ImageMat.LABEL_WATERSHED){
							p.label( q.label() );
						}else if( p.label() != q.label() ){
							p.label( ImageMat.LABEL_WATERSHED );
						}
					}else if( p.label()==ImageMat.LABEL_MASK ){
						p.label( ImageMat.LABEL_WATERSHED );
					}
				}else if( q.label()==ImageMat.LABEL_MASK && q.distance()==0 ){ // q is plateau
					q.distance(currentDistance+1);
					queue.push(q);
				}
			}
		}
		// same height new minima
		for(i=heightIndex; i<pixelCount; ++i){
			p = pointList[i];
			if(p.height()==h){
				p.distance(0);
				if( p.label()==ImageMat.LABEL_MASK ){
//console.log("++ label");
					currentLabel += 1;
					queue.push(p);
					p.label(currentLabel);
					while( !queue.isEmpty() ){
						q = queue.popMinimum();
						neighbors = q.neighbors();
						for(j=0; j<neighbors.length; ++j){
							r = neighbors[j];
							if(r.label()==ImageMat.LABEL_MASK){
								queue.push(r);
								r.label(currentLabel);
							}
						}
					}
				}
			}else{
				break;
			}
		}
		// goto next height
		heightIndex = i;
//console.log("NEXT: "+heightIndex);
	}
	console.log("currentLabel: "+currentLabel);
	// return groups of pixels
	var groupList = new Array(currentLabel+1);
	len = gridList.length;
	for(i=0; i<len; ++i){
		p = gridList[i];
		label = p.label();
		arr = groupList[label];
		if(!arr){
			groupList[label] = [];
			arr = groupList[label];
		}
		if(p.point().x==undefined || p.point().y==undefined){
			console.log(i+" / "+p);
		}
		v = new V2D( p.point().x, p.point().y );
		arr.push(v);
	}
	return groupList;
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

