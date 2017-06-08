// SIFTDescriptor.js
SIFTDescriptor.BIN_COUNT = 8;
SIFTDescriptor.BIN_COUNT_OVERALL = 36;
SIFTDescriptor.BIN_NORMALIZE_MAX = 0.50; // 0.20
SIFTDescriptor.BIN_OVERALL_THRESHOLD_MAX = 0.80; // 0.80

function SIFTDescriptor(){
	this._cellCountSize = 4; // 4 x 4 cells
	this._cellPixelSize = 4; // 4 x 4 pixels
	var perCell = this._cellCountSize;
	var perPixel = this._cellPixelSize;
	var totalPixels = perPixel*perPixel * perCell*perCell;
	var totalBins = SIFTDescriptor.BIN_COUNT * perCell * perCell;
	this._vector = Code.newArrayZeros(totalPixels);
	this._orientationAngle = 0.0;
}
//SIFTDescriptor._gauss = null;
// SIFTDescriptor.gaussian = function(){
// 	if(!SIFTDescriptor._gauss){
// 		SIFTDescriptor._gauss = ImageMat.getGaussianWindowSimple(16,16, 1.6);
// 	}
// 	return SIFTDescriptor._gauss;
// }

SIFTDescriptor.compare = function(descA,descB){ // L1 distance
	var i, score = 0;
	var vectorA = descA.vector();
	var vectorB = descB.vector();
	for(i=0; i<vectorA.length; ++i){
		score += Math.abs(vectorA[i] - vectorB[i]);
	}
	return score;
}
SIFTDescriptor.findMaximumOrientations = function(Ix,Iy,w,h){
	/*
	var bW = bH = 16; // descriptor window size
	var offX = Math.floor((w-bW)*0.5);
	var offY = Math.floor((h-bH)*0.5);
	var gauss = SIFTDescriptor.gaussian();
	var bin = new GradBinDescriptor(SIFTDescriptor.BIN_COUNT_OVERALL);
	var i, j, index, gIndex = 0;
	for(j=0;j<bH;++j){
		for(i=0;i<bW;++i,++gIndex){
			index = w*(offY+j) + offX+i;
			bin.addVector(Ix[index], Iy[index], Math.sqrt( Math.pow(Ix[index],2)+Math.pow(Iy[index],2) )*gauss[gIndex]);
		}
	}
	// find interpolated maximums
	var peaks = bin.getPeaks();
	if(peaks.length==0){ return peaks; } // no peaks
	// - find all maximal orientations within threshold
	var max = peaks[0].y;
	for(i=0;i<peaks.length;++i){
		max = Math.max(max,peaks[i].y);
	}
	max = max * SIFTDescriptor.BIN_OVERALL_THRESHOLD_MAX;
	for(i=0;i<peaks.length;++i){
		if( peaks[i].y < max){ // remove from list
			peaks[i] = peaks[peaks.length-1]; peaks.pop();
			--i; // recheck
		}
	}
	// convert peaks to list of angles
	for(i=0;i<peaks.length;++i){
		//console.log(peaks[i].y);
		peaks[i] = peaks[i].x;
	}
	return peaks;
	*/
}
SIFT_CALL = -1;
SIFTDescriptor.fromPointGray = function(source, width, height, point){
++SIFT_CALL;
	var overallSize = 21;
	var location = new V2D(point.x*width, point.y*height);
	var radius = point.z;
	var scale = overallSize/radius/2.0;
	var descriptorScale = 1.5;
	var overallScale = scale/descriptorScale;
//overallScale = 1.0;
	var area = ImageMat.extractRectFromPointSimple(source, width,height, location.x,location.y,overallScale, overallSize,overallSize);
	// BLUR IMAGE
	var blurred = ImageMat.getBlurredImage(area, overallSize,overallSize, 1.25);
	// GET DERIVATIVES
	var gradients = ImageMat.gradientVector(blurred, overallSize,overallSize);
	//

var show = area;
img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, overallSize, overallSize);
d = new DOImage(img);
d.matrix().translate((SIFT_CALL%20)*(overallSize+2),Math.floor(SIFT_CALL/20)*(overallSize+2)+350);
GLOBALSTAGE.addChild(d);

	var circleMask = ImageMat.circleMask(overallSize,overallSize);
	var i, j, k;
	var count = 0;
	var mask;
	var totalBinCount = SIFTDescriptor.BIN_COUNT_OVERALL;
	var bins = Code.newArrayZeros(totalBinCount);
	for(i=0; i<circleMask.length; ++i){
		count += circleMask[i];
		mask = circleMask[i];
		if(mask!=0.0){
			var v = gradients[i];
			var m = v.length();
			var a = V2D.angleDirection(V2D.DIRX,v);
			a = Code.angleZeroTwoPi(a);
			//console.log(a*180/Math.PI);
			var bin = Math.min(Math.floor((a/Math.PI2)*totalBinCount),totalBinCount-1);
			//console.log(a+" => "+bin);
			bins[bin] += m;
		}
	}
	// find peak direction
	var info = Code.infoArray(bins);
	var binMaxValue = info["max"];
	var binMaxIndex = info["indexMax"];
	//console.log(binMaxIndex+" : "+binMaxValue);
	// parabola / interpolate estimate the best angle
	var x0 = (binMaxIndex-1)%totalBinCount; x0 = (x0>=0) ? x0 : (x0+totalBinCount);
	var x1 = binMaxIndex;
	var x2 = (binMaxIndex+1)%totalBinCount;
	var y0 = bins[x0];
	var y1 = bins[x1];
	var y2 = bins[x2];
	//console.log(x0,y0," ",x1,y1," ",x2,y2," ")
	var parabola = Code.parabolaABCFromPoints(-1,y0, 0,y1, 1,y2);
	var binAngle = Math.PI2/totalBinCount;
	var binHalfAngle = binAngle*0.5;
	var angle0 = x0*binAngle + binHalfAngle;
	var angle1 = x1*binAngle + binHalfAngle;
	var angle2 = x2*binAngle + binHalfAngle;
	//console.log(parabola)
	var parabolaPeak = Code.parabolaVertexFromABC(parabola["a"],parabola["b"],parabola["c"]);
	//console.log(parabolaPeak)
	// interpolate to find optimum orientation
	var optimalOrientation = 0.0;
	if(angle0>angle1){
		angle0 -= Math.PI2;
	}
	if(angle2<angle1){
		angle2 += Math.PI2;
	}
	if(parabolaPeak.x<0){ // left 2
		var per = 1 + parabolaPeak.x;
		var pm1 = 1 - per;
		optimalOrientation = pm1*angle0 + per*angle1;
	}else{ // right 2
		var per = parabolaPeak.x;
		var pm1 = 1 - per;
		optimalOrientation = pm1*angle1 + per*angle2;
	}
	//console.log("optimalOrientation: "+optimalOrientation+" ["+angle0+"|"+angle1+"|"+angle2+"]");
	// extract image at new orientation
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix, optimalOrientation);
		matrix = Matrix.transform2DTranslate(matrix, location.x,location.y);
		matrix = Matrix.transform2DScale(matrix, overallScale);
	var insideSet = 16;
	var padding = 2;
	var outsideSet = insideSet + 2*padding;
	// GET IMAGE
	area = ImageMat.extractRectFromMatrix(source, width,height, outsideSet,outsideSet, matrix);
	// BLUR IMAGE
	blurred = ImageMat.getBlurredImage(area, outsideSet,outsideSet, 1.25);
	// GET DERIVATIVES
	gradients = ImageMat.gradientVector(blurred, outsideSet,outsideSet);
	// UNPAD
	gradients = ImageMat.unpadFloat(gradients,outsideSet,outsideSet, padding,padding,padding,padding);
	area = ImageMat.unpadFloat(area,outsideSet,outsideSet, padding,padding,padding,padding);
	
	// get 16 separate bins
	//circleMask = ImageMat.circleMask(insideSet,insideSet);
	var gaussianMask = ImageMat.gaussianMask(insideSet,insideSet);
	var bins = [];
	var binCount = 8;
	// for each grid component: 4x4 = 16
	for(j=0; j<4; ++j){
		for(i=0; i<4; ++i){
			var bin = Code.newArrayZeros(binCount);
			bins.push(bin);
			for(jj=0; jj<4; ++jj){
				for(ii=0; ii<4; ++ii){
					var index = (j*4+jj)*insideSet + (i*4+ii);
					var gradient = gradients[index];
					//console.log(gradient);
					var m = gradient.length();
					var a = V2D.angleDirection(V2D.DIRX,gradient);
						a = Code.angleZeroTwoPi(a);
					var w = gaussianMask[index];// weight on gaussian
					//console.log(m,w);
					var b = Math.min(Math.floor((a/Math.PI2)*binCount),binCount-1);
					bin[b] += m*w;
				}
			}
			
		}
	}

	// convert bins into vector
	var vector = [];
	//console.log(bins);
	for(i=0; i<bins.length; ++i){
		var bin = bins[i];
		for(j=0; j<bin.length; ++j){
			vector.push(bin[j]);
		}
	}
	//console.log(vector);
	// normalize vector ||m||
	Code.normalizeArray(vector);
	// clip high-value vector components

	// normalize vector ||m||

	//var s = "\n\nhold off;\nx=["+bins+"];\nbar(x);\n";
	//console.log(s)
	var s = new SIFTDescriptor();
	s.vector(vector);
	return s;
}

SIFTDescriptor.prototype.vector = function(v){
	if(v!==undefined){
		this._vector = v;
	}
	return this._vector;
}

SIFTDescriptor.prototype.normalize = function(){
	var i, len = this._vector.length;
	var total = 0;
	for(i=0; i<len ;++i){
		total += this._vector[i]*this._vector[i];
	}
	if(total>0){
		total = 1.0/total;
		for(i=0; i<len;++i){
			this._vector[i] = this._vector[i] * total;
		}
	}
}
/*
SIFTDescriptor.prototype.fromGradients = function(Ix,Iy,w,h){
	var gauss = SIFTDescriptor.gaussian();
	var bW = bH = 16; // descriptor window size
	var offX = Math.floor((w-bW)*0.5);
	var offY = Math.floor((h-bH)*0.5);
	var i, j, x, y, bin, cenX = Math.floor(w*0.5), cenY = Math.floor(h*0.5);
	var cntW = w/this._width, cntH = h/this._height;
	this.clear();
	var gIndex = 0;
	for(j=0;j<bH;++j){
		for(i=0;i<bW;++i,++gIndex){
			index = w*(j+offY) + i+offX;
			bin = this._width*Math.floor(j/cntH) + Math.floor(i/cntW);
			//var mag = Math.sqrt( Math.pow(Ix[index],2)+Math.pow(Iy[index],2) )*gauss[gIndex];
			var mag = Math.sqrt( Math.pow(Ix[index],2)+Math.pow(Iy[index],2) );
			//var mag = 1.0;
			var ang = Math.atan2(Iy[index],Ix[index]);
			this._bins[bin].addAngle(ang, mag);
		}
	}
	return this;
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
			str += Code.postpendFixed(Code.prependFixed("","*",bin[j]*20)," ",max);
		}
		str += "\n";
	}
	return str;
}
*/
/*
GradBinDescriptor
*/