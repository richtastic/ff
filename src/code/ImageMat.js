// ImageMat.js
function ImageMat(wid, hei){
	this._width = wid;
	this._height = hei;
	this._r = new Array(wid*hei);
	this._g = new Array(wid*hei);
	this._b = new Array(wid*hei);
}
// ------------------------------------------------------------------------------------------------------------------------ funziez
ImageMat.prototype.setPoint = function(x,y, val){
	var index = y*this.width() + x;
	this._r[index] = val.x;
	this._g[index] = val.y;
	this._b[index] = val.z;
}
ImageMat.prototype.getPoint = function(val, x,y){ // INTERPOLATION MADNESS

	var minX = Math.max(Math.floor(x), 0);
	var miiX = Math.max(minX-1, 0);
	var maxX = Math.min(Math.ceil(x), this._width-1);
	var maaX = Math.min(maxX+1, this._width-1);
	var minY = Math.max(Math.floor(y),0);
	var miiY = Math.max(minY-1,0);
	var maxY = Math.min(Math.ceil(y), this._height-1);
	var maaY = Math.min(maxY+1, this._height-1);
	var indexA = miiY*this._width + miiX; var colA = new V3D(this._r[indexA],this._g[indexA],this._b[indexA]);
	var indexB = miiY*this._width + minX; var colB = new V3D(this._r[indexB],this._g[indexB],this._b[indexB]);
	var indexC = miiY*this._width + maxX; var colC = new V3D(this._r[indexC],this._g[indexC],this._b[indexC]);
	var indexD = miiY*this._width + maaX; var colD = new V3D(this._r[indexD],this._g[indexD],this._b[indexD]);
	var indexE = minY*this._width + miiX; var colE = new V3D(this._r[indexE],this._g[indexE],this._b[indexE]);
	var indexF = minY*this._width + minX; var colF = new V3D(this._r[indexF],this._g[indexF],this._b[indexF]);
	var indexG = minY*this._width + maxX; var colG = new V3D(this._r[indexG],this._g[indexG],this._b[indexG]);
	var indexH = minY*this._width + maaX; var colH = new V3D(this._r[indexH],this._g[indexH],this._b[indexH]);
	var indexI = maxY*this._width + miiX; var colI = new V3D(this._r[indexI],this._g[indexI],this._b[indexI]);
	var indexJ = maxY*this._width + minX; var colJ = new V3D(this._r[indexJ],this._g[indexJ],this._b[indexJ]);
	var indexK = maxY*this._width + maxX; var colK = new V3D(this._r[indexK],this._g[indexK],this._b[indexK]);
	var indexL = maxY*this._width + maaX; var colL = new V3D(this._r[indexL],this._g[indexL],this._b[indexL]);
	var indexM = maaY*this._width + miiX; var colM = new V3D(this._r[indexM],this._g[indexM],this._b[indexM]);
	var indexN = maaY*this._width + minX; var colN = new V3D(this._r[indexN],this._g[indexN],this._b[indexN]);
	var indexO = maaY*this._width + maxX; var colO = new V3D(this._r[indexO],this._g[indexO],this._b[indexO]);
	var indexP = maaY*this._width + maaX; var colP = new V3D(this._r[indexP],this._g[indexP],this._b[indexP]);
	minX = x - minX;
	minY = y - minY;
	this.quadricColor(val, minX,minY, colA,colB,colC,colD,colE,colF,colG,colH,colI,colJ,colK,colL,colM,colM,colN,colO,colP);
	return;

	// rounding
	x = Math.min(Math.max(Math.round(x),0),this._width-1);
	y = Math.min(Math.max(Math.round(y),0),this._height-1);
	index = y*this._width + x;
	val.x = this._r[index];
	val.y = this._g[index];
	val.z = this._b[index];
}
ImageMat.prototype.quadricColor = function(colR, x,y, colA,colB,colC,colD,colE,colF,colG,colH,colI,colJ,colK,colL,colM,colM,colN,colO,colP){
	var r = this.quadric2D(x,y, colA.x,colB.x,colC.x,colD.x,colE.x,colF.x,colG.x,colH.x,colI.x,colJ.x,colK.x,colL.x,colM.x,colM.x,colN.x,colO.x,colP.x);
	var g = this.quadric2D(x,y, colA.y,colB.y,colC.y,colD.y,colE.y,colF.y,colG.y,colH.y,colI.y,colJ.y,colK.y,colL.y,colM.y,colM.y,colN.y,colO.y,colP.y);
	var b = this.quadric2D(x,y, colA.z,colB.z,colC.z,colD.z,colE.z,colF.z,colG.z,colH.z,colI.z,colJ.z,colK.z,colL.z,colM.z,colM.z,colN.z,colO.z,colP.z);
	colR.x = Math.min(Math.max(r,0.0),1.0);
	colR.y = Math.min(Math.max(g,0.0),1.0);
	colR.z = Math.min(Math.max(b,0.0),1.0);
}
ImageMat.prototype.quadric2D = function(x,y, A,B,C,D, E,F,G,H, I,J,K,L, M,N,O,P){
	var xx = x*x; var xxx = xx*x;
	var yy = y*y; var yyy = yy*y;
	var a = this.quadric1D(x,xx,xxx, A,B,C,D);
	var b = this.quadric1D(x,xx,xxx, E,F,G,H);
	var c = this.quadric1D(x,xx,xxx, I,J,K,L);
	var d = this.quadric1D(x,xx,xxx, M,N,O,P);
	return this.quadric1D(y,yy,yyy, a,b,c,d);
}
ImageMat.prototype.quadric1D = function(t,tt,ttt,A,B,C,D){
	var a = 3*B - 3*C + D - A;
	var b = 2*A - 5*B + 4*C - D;
	var c = B - A;
	var d = B;
	return ( a*ttt + b*tt + c*t + d );
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
ImageMat.prototype.width = function(){
	return this._width;
}
ImageMat.prototype.height = function(){
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
	this.setGrnFromFloat(g);
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
// ------------------------------------------------------------------------------------------------------------------------ interpolations
ImageMat.rotateImage = function(){
	
}
// ------------------------------------------------------------------------------------------------------------------------ image operations
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
			if( tl||to||tr|| lf||se||ri|| bl||br||br ){
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
ImageMat.gtFloat = function(data, val){
	var i, len = data.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = data[i]>val;
	}
	return result;
}
ImageMat.ltFloat = function(data, val){
	var i, len = data.length;
	var result = new Array(len);
	for(i=0;i<len;++i){
		result[i] = data[i]<val;
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
ImageMat.flipAbsFxn = function(f){ 
	return Math.abs(f-0.5);
}


/*
		RETRACT
	* *		*
	***		
	***		
	 * 		
*/




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
