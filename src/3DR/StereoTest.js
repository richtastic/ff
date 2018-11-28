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
	new ImageLoader("./images/",["stereo_3_left.png", "stereo_3_right.png"],this,this.imagesLoadComplete).load(); // MEETING - OFFICE
	// 
	// new ImageLoader("./images/",["stereo_teddy_2.png", "stereo_teddy_6.png"],this,this.imagesLoadComplete).load(); // 
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
		d.graphics().alpha(0.50);
		// d.graphics().alpha(1.0);
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
	var miniumSize = 16;
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
		dRange = miniumSize;
		// dRange = miniumSize/2;
		// dRange = Math.ceil(widA * 0.5);
		if(disparity){
			// WANT SCALING AVERAGING W/O 0-1 clipping
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
			console.log(dOffset);
		}
		disparity = StereoTest.blockMatch(imgA,imgB, dOffset,dRange);

		// TODO:
		// voting / belief propagation
		/*
			each cell's 9 population points
			- identify outliers
				- pick next-best-fit
		*/

		pWidA = widA;
		pHeiA = heiA;
		var depths = Code.copyArray(disparity);
		depths = ImageMat.absFloat(depths);
		depths = ImageMat.getNormalFloat01(depths);
			ImageMat.invertFloat01(depths);
			// console.log(depths);
			var colors = [0xFF000099,0xFF0000FF,0xFF00FFFF,0xFF00FF00,0xFFFFFF00,0xFFFF0000,0xFFCC0000,0xFF990000,0xFF660000];
			// var colors = [0xFF000000, 0xFFFFFFFF];
			var heat = ImageMat.heatImage(depths, widA, heiA, true, colors); // R O C B
				img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), widA, heiA);
				d = new DOImage(img);
				// d.matrix().scale(displayScale*currentScale);
				d.matrix().scale(1.0);
				// d.matrix().translate(500, 10 + 50*i);
				d.matrix().translate(600, 10*(i+1) + OFFY);
				GLOBALSTAGE.addChild(d);
				OFFY += heiA;
// if(i==1){
// 	break;
// }
	}

	throw "?"
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
    	// for each col:
    	for(var n=0; n<widthA; ++n){
      		var minc = n-halfBlockSize;
        	var maxc = n+halfBlockSize;
        	var wid = maxc-minc+1;
        	var hei = maxr-minr+1;
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
        	minc = Math.min(widthA-1,Math.max(0,minc));
        	maxc = Math.min(widthA-1,Math.max(0,maxc));
        	minr = Math.min(heightA-1,Math.max(0,minr));
        	maxr = Math.min(heightA-1,Math.max(0,maxr));
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
			// TODO: BACKUP PEAKS TOO
			var index = m*widthA + n;
    		var ext = Code.findGlobalExtrema1D(values, false);
    		var minima = ext["min"];
    		if(!ext || !minima){
    			throw "what?";
    		}
        	var d = minima.x + disparityOffset;
// OR RATIO?

        	if(minima.y>0.01){
        		// console.log("TOO LARGE: "+minima.y);
        		d = 0;
        	}
        	disparity[index] = d;

        	// TODO: HANDLE NO-MATCH

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
