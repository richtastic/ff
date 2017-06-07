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
	var i;
	var count = 0;
	var mask;
	var bins = Code.newArrayZeros(SIFTDescriptor.BIN_COUNT_OVERALL);
	for(i=0; i<circleMask.length; ++i){
		count += circleMask[i];
		mask = circleMask[i];
		if(mask!=0.0){
			var v = gradients[i];
			var m = v.length();
			var a = V2D.angleDirection(V2D.DIRX,v);
			a = Code.angleZeroTwoPi(a);
			//console.log(a*180/Math.PI);
			var bin = Math.min(Math.floor((a/Math.PI2) * SIFTDescriptor.BIN_COUNT_OVERALL),SIFTDescriptor.BIN_COUNT_OVERALL-1);
			//console.log(a+" => "+bin);
			bins[bin] += m;
		}
	}
	// find peak direction
	// parabola / interpolate estimate the best angle

	// extract image at new orientation

	// get 16 separate bins
		// weight on gaussian

	// convert bins into vector

	// normalize vector ||m||

	// clip high-value vector components

	// normalize vector ||m||

	//var s = "\n\nhold off;\nx=["+bins+"];\nbar(x);\n";
	console.log(s)
	var s = new SIFTDescriptor();
	return s;
}


SIFTDescriptor.prototype.normalize = function(){
	var i, len = this._vector.length;
	var total = 0;
	for(i=0; i<len ;++i){
		total += this._vector[i];
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