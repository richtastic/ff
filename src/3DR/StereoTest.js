function StereoTest(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._root = new DO();
	this._stage.root().addChild(this._root);
	// new ImageLoader("./images/",["stereo_1_left.png", "stereo_1_right.png"],this,this.imagesLoadComplete).load(); // BIG CONES
	// new ImageLoader("./images/",["stereo_0_left.png", "stereo_0_right.png"],this,this.imagesLoadComplete).load(); // SMALL CONES
	// new ImageLoader("./images/",["stereo_2_left.png", "stereo_2_right.png"],this,this.imagesLoadComplete).load(); // DESKS - OFFICE
	// new ImageLoader("./images/",["stereo_3_left.png", "stereo_3_right.png"],this,this.imagesLoadComplete).load(); // MEETING - OFFICE

	// REVERSE:
	// new ImageLoader("./images/",["stereo_0_right.png", "stereo_0_left.png"],this,this.imagesLoadComplete).load();
	// 
	new ImageLoader("./images/",["stereo_teddy_2.png", "stereo_teddy_6.png"],this,this.imagesLoadComplete).load(); // 
	// new ImageLoader("./images/",["stereo_tsukuba_1.png", "stereo_tsukuba_5.png"],this,this.imagesLoadComplete).load(); // 
}
StereoTest.prototype.imagesLoadComplete = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		// d.graphics().alpha(0.01);
		// d.graphics().alpha(0.50);
		d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width;
	}
	var display = this._root;
	// display.matrix().scale(1.5);
	GLOBALSTAGE = this._stage;
GLOBALSTAGE.root().matrix().scale(2.0);

	var imagePathA = fileList[0];
	var imagePathB = fileList[1];

		var imageSourceA = images[0];
		var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
		var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

		var imageSourceB = images[1];
		var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
		var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);

	StereoTest.hierarchyMatch(imageMatrixA,imageMatrixB);
}
StereoTest.hierarchyMatch = function(imageMatrixA,imageMatrixB){
var OFFY = 0;
	// var miniumSize = 8;
	var miniumSize = 16;
	// var miniumSize = 32;
	// var miniumSize = 64;
	var widthA = imageMatrixA.width();
	var heightA = imageMatrixA.height();
	var widthB = imageMatrixB.width();
	var heightB = imageMatrixB.height();

	var exponentAX = Math.log2(widthA/miniumSize);
	var exponentAY = Math.log2(heightA/miniumSize);
	var exponentBX = Math.log2(widthB/miniumSize);
	var exponentBY = Math.log2(heightB/miniumSize);
	
	var exponent = Math.min(exponentAX,exponentAY,exponentBX,exponentBY);
		exponent = Math.floor(exponent);

		console.log(exponentAX,exponentAY, exponentBX,exponentBY,exponent);
	var disparity = null;
	var pWidA = null;
	var pHeiA = null;
	for(var i=0; i<=exponent; ++i){
		var scale = Math.pow(2,-(exponent-i));
		// scale = 0.5;
		var widA = Math.round(widthA * scale);
		var heiA = Math.round(heightA * scale);
		var widB = Math.round(widthB * scale);
		var heiB = Math.round(heightB * scale);
		console.log(scale+" : "+widA+"x"+heiA+" - "+widB+"x"+heiB);
		var imgA = imageMatrixA.getScaledImage(scale);
		var imgB = imageMatrixB.getScaledImage(scale);

		var dOffset = null;
		var dRange = null;
// dRange =20;
		// dRange = miniumSize;
		dRange = miniumSize/2;
		dRange = Math.max(dRange,8);
		// dRange = Math.ceil(widA * 0.5);
		if(disparity){
			// WANT SCALING AVERAGING W/O 0-1 clipping
/*
			var info = Code.infoArray(disparity);
			disparity = ImageMat.getNormalFloat01(disparity);
			// var sigma = 1.0;
			var sigma = null;
			var blur = ImageMat.getScaledImage(disparity,pWidA,pHeiA,2.0, sigma, widA,heiA);
			blur = blur["value"];
			ImageMat.mulConst(blur,info["range"]);
			ImageMat.add(blur,info["min"]);
console.log(blur);
			
			// ImageMat.getBlurredImage(source,wid,hei, sigma){
dOffset = blur;
*/

			dOffset = [];
			for(var y=0; y<heiA; ++y){
				for(var x=0; x<widA; ++x){
					var index = y*widA + x;
					var rY = Math.floor(y*0.5);
					var rX = Math.floor(x*0.5);
						rX = Math.min(rX,pWidA-1);
						rY = Math.min(rY,pHeiA-1);
					var ind = rY*pWidA + rX;
					var d = disparity[ind];
						d = d*2.0; // scale up
						// d = d*0.5; // ?
					dOffset[index] = d;
				}
			}

			// console.log(dOffset);
		}
		disparity = StereoTest.blockMatch(imgA,imgB, dOffset,dRange);
		// disparity = StereoTest.blockMatchOrdering(imgA,imgB, dOffset,dRange);
		// console.log(disparity)
		
		var depths = Code.copyArray(disparity);
		/*
		var info = StereoTest.blockMatchCells(imgA,imgB, dOffset,dRange);

		console.log(info);

		// var disparity = null;
		var confidence = info["confidence"];

		// TODO:
		// voting / belief propagation
		
			each cell's 9 population points
			- identify outliers
				- pick next-best-fit
		

		
		var depths = Code.copyArray(confidence);
		*/
		pWidA = widA;
		pHeiA = heiA;
		
		// depths = ImageMat.absFloat(depths);
		depths = ImageMat.getNormalFloat01(depths);
		
		// depths = ImageMat.pow(depths,0.25);
		// depths = ImageMat.pow(depths,10);

			ImageMat.invertFloat01(depths);
			// console.log(depths);
			var colors = [0xFF000099,0xFF0000FF,0xFF00FFFF,0xFF00FF00,0xFFFFFF00,0xFFFF0000,0xFFCC0000,0xFF990000,0xFF660000];
			// var colors = [0xFF000000, 0xFFFFFFFF];
			var heat = ImageMat.heatImage(depths, widA, heiA, true, colors); // R O C B
				img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), widA, heiA);
				d = new DOImage(img);
				// d.graphics().alpha(0.25);
				// d.graphics().alpha(0.5);
				d.graphics().alpha(1.0);
				// d.matrix().scale(displayScale*currentScale);
				// d.matrix().scale(2.0);
				// d.matrix().translate(500, 10 + 50*i);
				d.matrix().translate(900, 10*(i+1) + OFFY);
				if(widA==widthA){
					// d.graphics().alpha(0.5);
					d.graphics().alpha(0.75);
					d.matrix().identity();
				}
				GLOBALSTAGE.addChild(d);
				OFFY += heiA;
// if(i==1){
// 	break;
// }
	}

	throw "?"
}

StereoTest.blockMatchCells = function(imageMatrixA,imageMatrixB,  inputDisparity, disparityRange){
	var halfBlockSize = 3;
	var blockSize = 2*halfBlockSize + 1;
	var widthA = imageMatrixA.width();
	var heightA = imageMatrixA.height();
	var widthB = imageMatrixB.width();
	var heightB = imageMatrixB.height();
	var totalPixels = widthA*heightA;
	// var disparity = Code.newArrayZeros(totalPixels);
	disparityRange = disparityRange!==undefined && disparityRange!==null ? disparityRange : Math.round(widthA*0.25); // 30
console.log(widthA,disparityRange)
	// var disparityRange = Math.min(disparityRange,widthA);
	// for each row:

	var cells = [];
	for(var i=0; i<totalPixels; ++i){
		cells[i] = new StereoTest.Cell();
	}
	console.log(cells);

	var disparityStart = 0;
	for(var m=0; m<heightA; ++m){
		// if(m%10==0){
		// 	console.log(m+" / "+heightA);
		// }
		var minr = m-halfBlockSize;
		var maxr = m+halfBlockSize;
		minr = Math.min(heightA-1,Math.max(0,minr));
		maxr = Math.min(heightA-1,Math.max(0,maxr));
		// for each col:
		for(var n=0; n<widthA; ++n){
			// needle
			var minc = n-halfBlockSize;
			var maxc = n+halfBlockSize;
			minc = Math.min(widthA-1,Math.max(0,minc));
			maxc = Math.min(widthA-1,Math.max(0,maxc));
			// var wid = maxc-minc+1;
			// var hei = maxr-minr+1;


			// var needle = imageMatrixA.extractRect(minc,minr, maxc,minr, maxc,maxr, minc,maxr, wid,hei);
			// use previous offsets
			if(inputDisparity){
				var index = m*widthA + n;
				disparityStart = inputDisparity[index];
				disparityStart = Math.round(disparityStart);
			}
			// haystack
			var roiMinC = n-disparityRange+disparityStart;
			var roiMaxC = n+disparityRange+disparityStart;
			var roiMinR = minr;
			var roiMaxR = maxr;
			// var wid = roiMaxC-roiMinC+1;
			// var hei = roiMaxR-roiMinR+1;
			// limits haystack
			roiMinC = Math.min(widthB-1,Math.max(0,roiMinC));
			roiMaxC = Math.min(widthB-1,Math.max(0,roiMaxC));
			roiMinR = Math.min(heightB-1,Math.max(0,roiMinR));
			roiMaxR = Math.min(heightB-1,Math.max(0,roiMaxR));
			// limits needle
			
			// ...
			var disparityOffset = -(n-roiMinC);
			// var haystack = imageMatrixB.extractRect(roiMinC,roiMinR, roiMaxC,roiMinR, roiMaxC,roiMaxR, roiMinC,roiMaxR, wid,hei);
			// var solution = R3D.searchNeedleHaystackImageFlatSAD(needle,null, haystack);
			// imageA,startAX,endAX,startAY,endAY, imageB,startBX,endBX,startAY,endAY
			var solution = R3D.inPlaceOperation(imageMatrixB,roiMinC,roiMaxC,roiMinR,roiMaxR, imageMatrixA,minc,maxc,minr,maxr, R3D.inPlaceOperationSADRGB, []);
			var values = solution["value"];
			var valueWidth = solution["width"];
			var valueHeight = solution["height"];
/*
var img = GLOBALSTAGE.getFloatRGBAsImage(needle.red(), needle.grn(), needle.blu(), needle.width(), needle.height());
var d = new DOImage(img);
// d.matrix().scale(scale);
d.matrix().scale(5.0);
d.matrix().translate(100,100);
GLOBALSTAGE.addChild(d);

var img = GLOBALSTAGE.getFloatRGBAsImage(haystack.red(), haystack.grn(), haystack.blu(), haystack.width(), haystack.height());
var d = new DOImage(img);
// d.matrix().scale(scale);
d.matrix().scale(5.0);
d.matrix().translate(100,200);
GLOBALSTAGE.addChild(d);
*/
			
			var index = m*widthA + n;
			var cell = cells[index];

			// A
			// var ext = Code.findGlobalExtrema1D(values, false);
			// if(!ext){
			// 	continue;
			// }
			// var minima = [ext["min"]];

			// B
			var minima = Code.findMinima1D(values);


			if(minima.length==0){
				var info = Code.infoArray(values);
				var minIndex = info["indexMin"];
				var minValue = info["min"];
				minima.push(new V2D(minIndex,minValue));
				// Code.printMatlabArray(values,"v");
			}
			var min = Code.min(values);
			var max = Code.max(values);
			cell.setRange(min,max);
			// console.log(minima);
			for(var k=0; k<minima.length; ++k){
				var min = minima[k];
				var d = min.x + disparityOffset;
				var score = min.y;
				cell.addOption(d, score);
			}
			cell.sortOptions();
// OR RATIO?

			// if(minima.y>0.01){
			// 	// console.log("TOO LARGE: "+minima.y);
			// 	d = 0;
			// }
			// disparity[index] = d;

			// TODO: HANDLE NO-MATCH

		}
	}
	var conf = [];
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		// conf[i] = cell.getConfidence(0);
		// conf[i] = cell.getMinimum();
		conf[i] = cell.getDisparity(0);
	}
	return {"cells":cells, "width":widthA, "height":heightA, "confidence":conf};
}


StereoTest.blockMatchOrdering = function(imageMatrixA,imageMatrixB,  inputDisparity, disparityRange){ // ,inputDisparityWidth,inputDisparityHeight,
	var halfBlockSize = 3;
	var blockSize = 2*halfBlockSize + 1;
	var widthA = imageMatrixA.width();
	var heightA = imageMatrixA.height();
	var widthB = imageMatrixB.width();
	var heightB = imageMatrixB.height();
	var totalPixels = widthA*heightA;
	var finalDisparity = Code.newArrayZeros(totalPixels);
	disparityRange = disparityRange!==undefined && disparityRange!==null ? disparityRange : Math.round(widthA*0.25); // 30
// disparityRange = 16;
	var disparityInset = (disparityRange - halfBlockSize) + 0;
	var dispartityCount = (disparityRange*2+1)-(halfBlockSize*2+1)+1;
	// var disparityRange = Math.min(disparityRange,widthA);
	// for each row:

	// var costOcclusion = 100;
	// var costOcclusion = 0.1;
	// var costOcclusion = 0.0001;
	// var costOcclusion = 0.00000001;
	var costInf = 1E5;
	var costOcclusion = 0.0000; // around the minimum cost for a comparrison in a row
	var disparityStart = 0;
	for(var m=0; m<heightA; ++m){
		var minr = m-halfBlockSize;
		var maxr = m+halfBlockSize;
			minr = Math.min(heightA-1,Math.max(0,minr));
			maxr = Math.min(heightA-1,Math.max(0,maxr));
		var roiMinR = minr;
		var roiMaxR = maxr;
			roiMinR = Math.min(heightB-1,Math.max(0,roiMinR));
			roiMaxR = Math.min(heightB-1,Math.max(0,roiMaxR));
		var disparities = [];
		for(var n=0; n<widthA; ++n){
			// needle
			var minc = n-halfBlockSize;
			var maxc = n+halfBlockSize;
			minc = Math.min(widthA-1,Math.max(0,minc));
			maxc = Math.min(widthA-1,Math.max(0,maxc));
			// use previous offsets
			if(inputDisparity){
				var index = m*widthA + n;
				disparityStart = inputDisparity[index];
				disparityStart = Math.round(disparityStart);
			}
			// haystack
			var roiMinC = n-disparityRange+disparityStart;
			var roiMaxC = n+disparityRange+disparityStart;

			// limits haystack
			roiMinC = Math.min(widthB-1,Math.max(0,roiMinC));
			roiMaxC = Math.min(widthB-1,Math.max(0,roiMaxC));
			

			var disparityOffset = -(n-roiMinC-halfBlockSize);
				if(disparityOffset>0){
					disparityOffset = 0;
				}
			var solution = R3D.inPlaceOperation(imageMatrixB,roiMinC,roiMaxC,roiMinR,roiMaxR, imageMatrixA,minc,maxc,minr,maxr, R3D.inPlaceOperationSADRGB, []);
			var values = solution["value"];
			var valueWidth = solution["width"];
			var valueHeight = solution["height"];
			//
			var absDisparity = [];
			var pathCosts = [];
			var previousIndexes = [];
			for(var d=0; d<values.length; ++d){
				absDisparity[d] = d + disparityOffset;
				pathCosts[d] = null;
				previousIndexes[d] = null;
			}
			disparities.push({"costs":values, "disparities":absDisparity, "pathCosts":pathCosts, "previous":previousIndexes});
			//
		}
		// optimal path searching
var startM = 100;
var endM = 0;
		// start at left and fill in predecessor based on best score
		for(var n=0; n<widthA; ++n){
			var current = disparities[n];
			var previous = null;
			if(n>0){
				previous = disparities[n-1];
			}
			for(var c=0; c<current.costs.length; ++c){
				var currentCost = current.costs[c];
				var currentDisp = current.disparities[c];
				var previousCost = 0;
				var previousIndex = null;
				if(previous){
					var previousMinIndex = null;
					var previousMinCost = null;
					var disparityMinCost = 0;
					for(var p=0; p<previous.costs.length; ++p){
						var prevDisp = previous.disparities[p];
						var prevCost = previous.pathCosts[p];
						// console.log(p+": "+prevDisp+" <= "+currentDisp);
						if(prevDisp<=currentDisp){ // can only point to previous disparities
							
							if(previousMinIndex===null || prevCost<previousMinCost){
								previousMinIndex = p;
								previousMinCost = prevCost;
								var diffDisp = Math.abs(currentDisp-prevDisp);
								disparityMinCost = diffDisp*costOcclusion;
							}
						}
					}
					// console.log(previousMinIndex);
					if(previousMinIndex!==null){
						previousIndex = previousMinIndex;
						previousCost = previousMinCost;
						// console.log(c+": "+previousIndex);
					}
					var endCost = 0;//costInf*Math.abs(currentDisp);
					var totalCost = currentCost + previousCost + disparityMinCost + endCost;
					current.pathCosts[c] = totalCost;
					current.previous[c] = previousIndex;
					// console.log("   "+n+":"+c+" = "+currentCost+" + "+previousCost+" + "+disparityMinCost+" = "+totalCost+"     @ "+previousIndex);
				}else{
					current.pathCosts[c] = costInf*Math.abs(currentDisp);
					current.previous[c] = null;
				}
				
			}
			// console.log(current);
		}
		
		// console.log(disparities);

		// start at right and work back to find best predecessor
		var current = disparities[widthA-1];
		var currentMinPathCost = null;
		var currentMinPathIndex = null;
		var currentMinPreviousIndex = null;
		for(var c=0;c<current.pathCosts.length; ++c){
			var currentPathCost = current.pathCosts[c];
			if(currentPathCost!==null){
				if(currentMinPathIndex==null || currentPathCost<currentMinPathCost){
					currentMinPathIndex = c;
					currentMinPathCost = currentPathCost;
					currentMinPreviousIndex = current.previous[c];
				}
			}
		}
// console.log(disparities);
// console.log(current);
// console.log(currentMinPathIndex);
// console.log(currentMinPathCost);
// console.log(currentMinPreviousIndex);
// console.log("MINIMUM END: "+currentMinPathIndex+" => previous: "+currentMinPreviousIndex);
		var disparityList = [];
		// disparityList.unshift( current.disparities[currentMinPathIndex] );
		// currentMinPathIndex = current.previous[currentMinPathIndex];
		// currentMinPathIndex = currentMinPreviousIndex;

// console.log(disparities);
var lastValue = null;
		for(var n=widthA-1; n>=0; --n){
			var current = disparities[n];
			var disp = lastValue;
if(currentMinPathIndex){
			var value = StereoTest.interpolateMinima( current.costs, currentMinPathIndex);

			disp = current.disparities[currentMinPathIndex];
			if(disp===undefined){
				disp = 0;
			}
			

			// console.log(value);
			// console.log(disp);
			var next = disp + (value.x-currentMinPathIndex);
if(m==60){
			console.log(disp , value.x, currentMinPathIndex, next);
}
			disp = next;
}
			if(disp===null){
				throw "why null?";
			}else{
				lastValue = disp;
			}
			disparityList.unshift(disp);
			currentMinPathIndex = current.previous[currentMinPathIndex];
		}

		// save
		for(var n=0; n<widthA; ++n){
			var disparity = disparityList[n];
			if(disparity===undefined || disparity===null){
				throw "BAD ?"
			}
			// var disparity = disparities[n];
			var index = m*widthA + n;
			finalDisparity[index] = disparity;
		}
		
// console.log(m);

// var startM = 1000;
// var endM = 0;
if(startM<=m && m<=endM){
	// console.log("SHOW");
console.log(disparityList);
console.log(disparities);

		// SHOW LINE:
		var temp = [];
		// var dCount = disparityRange*2+1;
		// var dCount = (disparityRange*2+1)-(halfBlockSize*2+1)+1;
		console.log(disparityInset,dispartityCount);
		// var dOff = Math.floor(dCount/2);

		// (20*2+1)-(3*2+1)+1
		for(var n=0; n<widthA; ++n){
var best = disparityList[n];
			var disparity = disparities[n];
			var list = Code.newArrayZeros(dispartityCount);
			for(var i=0; i<disparity.disparities.length; ++i){
				var cost = disparity.costs[i];
				var disp = disparity.disparities[i];
if(disp==best){
	cost = 0.001;
	// cost = -0.00001;
}
				list[disp+disparityInset] = cost;
			}
			for(var i=0; i<list.length;++i){
				temp.push(list[i]);
			}
		}

		// console.log(temp);
		var widA = dispartityCount;
		var heiA = widthA;
			// var colors = [0xFF000099,0xFF0000FF,0xFF00FFFF,0xFF00FF00,0xFFFFFF00,0xFFFF0000,0xFFCC0000,0xFF990000,0xFF660000];
		temp = ImageMat.getNormalFloat01(temp);
		// temp = ImageMat.pow(temp,0.5);
		var colors = [0xFF000000, 0xFFFFFFFF];
		var heat = ImageMat.heatImage(temp, widA, heiA, true, colors);
		img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), widA, heiA);
		d = new DOImage(img);
		// d.graphics().alpha(0.25);
		// d.graphics().alpha(0.5);
		d.matrix().scale(1.5);
		d.matrix().translate(10 + 70*(m-startM), 10);
		GLOBALSTAGE.addChild(d);
}

		// if(m>20){
		// 	throw "out";
		// }


	}
	// throw "out";

	return finalDisparity;
}

StereoTest.blockMatch = function(imageMatrixA,imageMatrixB,  inputDisparity, disparityRange){ // ,inputDisparityWidth,inputDisparityHeight,
	var halfBlockSize = 3;
	var blockSize = 2*halfBlockSize + 1;
	var widthA = imageMatrixA.width();
	var heightA = imageMatrixA.height();
	var widthB = imageMatrixB.width();
	var heightB = imageMatrixB.height();
	var totalPixels = widthA*heightA;
	var disparity = Code.newArrayZeros(totalPixels);
	disparityRange = disparityRange!==undefined && disparityRange!==null ? disparityRange : Math.round(widthA*0.25); // 30
	// var disparityRange = Math.min(disparityRange,widthA);
	// for each row:


	var disparityStart = 0;
	for(var m=0; m<heightA; ++m){
		// if(m%10==0){
		// 	console.log(m+" / "+heightA);
		// }
		var minr = m-halfBlockSize;
		var maxr = m+halfBlockSize;
		minr = Math.min(heightA-1,Math.max(0,minr));
		maxr = Math.min(heightA-1,Math.max(0,maxr));
		// for each col:
		for(var n=0; n<widthA; ++n){
			// needle
			var minc = n-halfBlockSize;
			var maxc = n+halfBlockSize;
			minc = Math.min(widthA-1,Math.max(0,minc));
			maxc = Math.min(widthA-1,Math.max(0,maxc));
			// var wid = maxc-minc+1;
			// var hei = maxr-minr+1;


			// var needle = imageMatrixA.extractRect(minc,minr, maxc,minr, maxc,maxr, minc,maxr, wid,hei);
			// use previous offsets
			if(inputDisparity){
				var index = m*widthA + n;
				disparityStart = inputDisparity[index];
				disparityStart = Math.round(disparityStart);
			}
			// haystack
			var roiMinC = n-disparityRange+disparityStart;
			var roiMaxC = n+disparityRange+disparityStart;
			var roiMinR = minr;
			var roiMaxR = maxr;
			// var wid = roiMaxC-roiMinC+1;
			// var hei = roiMaxR-roiMinR+1;
			// limits haystack
			roiMinC = Math.min(widthB-1,Math.max(0,roiMinC));
			roiMaxC = Math.min(widthB-1,Math.max(0,roiMaxC));
			roiMinR = Math.min(heightB-1,Math.max(0,roiMinR));
			roiMaxR = Math.min(heightB-1,Math.max(0,roiMaxR));
			// limits needle
			
			// ...
			// var disparityOffset = -(n-roiMinC);
			var disparityOffset = -(n-roiMinC-halfBlockSize);
				if(disparityOffset>0){
					disparityOffset = 0;
				}
			// var haystack = imageMatrixB.extractRect(roiMinC,roiMinR, roiMaxC,roiMinR, roiMaxC,roiMaxR, roiMinC,roiMaxR, wid,hei);
			// var solution = R3D.searchNeedleHaystackImageFlatSAD(needle,null, haystack);
			// imageA,startAX,endAX,startAY,endAY, imageB,startBX,endBX,startAY,endAY
			var solution = R3D.inPlaceOperation(imageMatrixB,roiMinC,roiMaxC,roiMinR,roiMaxR, imageMatrixA,minc,maxc,minr,maxr, R3D.inPlaceOperationSADRGB, []);
			var values = solution["value"];
			var valueWidth = solution["width"];
			var valueHeight = solution["height"];
/*
var img = GLOBALSTAGE.getFloatRGBAsImage(needle.red(), needle.grn(), needle.blu(), needle.width(), needle.height());
var d = new DOImage(img);
// d.matrix().scale(scale);
d.matrix().scale(5.0);
d.matrix().translate(100,100);
GLOBALSTAGE.addChild(d);

var img = GLOBALSTAGE.getFloatRGBAsImage(haystack.red(), haystack.grn(), haystack.blu(), haystack.width(), haystack.height());
var d = new DOImage(img);
// d.matrix().scale(scale);
d.matrix().scale(5.0);
d.matrix().translate(100,200);
GLOBALSTAGE.addChild(d);
*/
			// TODO: BACKUP PEAKS TOO
			var index = m*widthA + n;
			var ext = Code.findGlobalExtrema1D(values, false);
			var minima = ext["min"];
			if(!ext || !minima){
				throw "what?";
			}
			var d = minima.x + disparityOffset;

			if(inputDisparity){
				var diff = Math.abs(d-inputDisparity[index]);
				if(diff>disparityRange){
					// console.log(diff+" / "+disparityRange);
					d = inputDisparity[index];
				}
			}
// OR RATIO?

			if(minima.y>0.01){
				// console.log("TOO LARGE: "+minima.y);
				if(inputDisparity){
					d = inputDisparity[index];
				}else{
					d = null;
				}
			}
			disparity[index] = d;

			// TODO: HANDLE NO-MATCH

		}
	}
	// fill in gaps:
	for(var i=0;i<heightA;++i){
		for(var j=0;j<widthA;++j){
			var index = j*widthA + i;
			var value = disparity[index];
			if(value===null){
				var fixed = false;
				for(var k=1; k<widthA; ++k){
					var ii = i+k;
					if(ii<widthA){
						var ind = j*widthA + ii;
						var next = disparity[ind];
						if(next!==null){
							disparity[index] = next;
							fixed = true;
							break;
						}
					}
					var ii = i-k;
					if(ii>=0){
						var ind = j*widthA + ii;
						var next = disparity[ind];
						if(next!==null){
							disparity[index] = next;
							fixed = true;
							break;
						}
					}
				}
				if(!fixed){
					disparity[index] = 0;
				}
			}
		}
	}

	return disparity;
}

/*
		% Construct template and region of interest.
		
		roi = [minr+templateCenter(1)‐2 ...
			   minc+templateCenter(2)+mind‐2 ...
			   1 maxd‐mind+1];
		% Lookup proper TemplateMatcher object; create if empty.
		if isempty(tmats{size(template,1),size(template,2)})
			tmats{size(template,1),size(template,2)} = ...
end
video.TemplateMatcher('ROIInputPort',true);
		thisTemplateMatcher = tmats{size(template,1),size(template,2)};
		% Run TemplateMatcher object.
		loc = step(thisTemplateMatcher, leftI, template, roi);
		Dbasic(m,n) = loc(2) ‐ roi(2) + mind;
end end
*/


StereoTest.Cell = function(){
	this._options = [];
	this._min = null;
	this._max = null;
};
StereoTest.Cell.OptionSort = function(a,b){
	return a[0] < b[0] ? -1 : 1;
	// return a[0] < b[0] ? 1 : -1;
};
StereoTest.Cell.prototype.addOption = function(delta, score){
	this._options.push([score, delta]);
};
StereoTest.Cell.prototype.setRange = function(min, max){
	this._min = min;
	this._max = max;
};
StereoTest.Cell.prototype.sortOptions = function(){
	this._options.sort(StereoTest.Cell.OptionSort);
};
StereoTest.Cell.prototype.getMinimum = function(){
	var options = this._options;
	if(options.length>0){
		var opt0 = options[0];
		var score0 = opt0[0];
		return score0;
	}
	console.log("no minimum");
	return 0.0;
};
StereoTest.Cell.prototype.getDisparity = function(index){
	var options = this._options;
	if(options.length>0){
		var opt0 = options[0];
		var disp0 = opt0[1];
		return disp0;
	}
	console.log("no minimum");
	return 0.0;
};
StereoTest.Cell.prototype.getConfidence = function(index){
	var options = this._options;
	if(options.length>1){
		var opt0 = options[0];
		var opt1 = options[1];
		var score0 = opt0[0];
		var score1 = opt1[0];
		var range = this._max - this._min;
		var diff = score1-score0;
		return diff/range;
	}
	return 0;
}


StereoTest.interpolateMinima = function(array, index){
	var last = array.length-1;
	if(index!==0 || index!==last){
		var l = array[index-1];
		var m = array[index+0];
		var r = array[index+1];
		if(l>=m && m<=r){
			v = Code.interpolateExtrema1D(new V2D(), l,m,r);
			v.x += index;
			// console.log(v);
			// throw "find min";
			return v;
		}
	}
	return new V2D(index,array[index]);
}




