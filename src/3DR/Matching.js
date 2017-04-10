// Matching.js

function Matching(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();

	var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}
Matching.prototype.handleImagesLoaded = function(imageInfo){
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
//		d.graphics().alpha(0.15);
		d.matrix().translate(x,y);
		x += img.width;
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);

	//this.showComparrison(imageMatrixA, imageMatrixB);

/*	
	var imageCornerA = R3D.harrisCornerDetection(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height());//, konstant, sigma);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
	var imageCornerB = R3D.harrisCornerDetection(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height());//, konstant, sigma);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);

//	this.showComparrison(imageCornerA, imageCornerB, true);

	var imageCornerA = R3D.hessianCornerDetection(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height());//, konstant, sigma);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
	var imageCornerB = R3D.hessianCornerDetection(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height());//, konstant, sigma);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);
	
//	this.showComparrison(imageCornerA, imageCornerB, true);
		//imageCornerA = ImageMat.applyGaussianFloat(imageMatrixA.gry(),imageMatrixA.width(), imageMatrixA.height(), 1.6);
		//imageCornerA = ImageMat.secondDerivativeX(imageCornerA, imageMatrixA.width(), imageMatrixA.height()).value;
		imageCornerA = ImageMat.secondDerivativeX(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height()).value;
		imageCornerA = ImageMat.absFloat(imageCornerA);
			imageCornerA = ImageMat.applyGaussianFloat(imageCornerA,imageMatrixA.width(), imageMatrixA.height(), 1.6);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
		imageCornerB = ImageMat.secondDerivativeX(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height()).value;
		imageCornerB = ImageMat.absFloat(imageCornerB);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);
//	this.showComparrison(imageCornerA, imageCornerB);

	var imageCostA = ImageMat.totalCostToMoveAny(imageMatrixA);
		imageCostA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCostA);
	var imageCostB = ImageMat.totalCostToMoveAny(imageMatrixB);
		imageCostB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCostB);
//	this.showComparrison(imageCostA, imageCostB);
*/
/*
	var imageVariationA = ImageMat.rangeInWindow(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height(), 3,3).value;
		imageVariationA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageVariationA);
	var imageVariationB = ImageMat.rangeInWindow(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height(), 3,3).value;
		imageVariationB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageVariationB);
	this.showComparrison(imageVariationA, imageVariationB);


	var imageBestPointsA = R3D.bestFeatureFilterRGB(imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
		imageBestPointsA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageBestPointsA);
	var imageBestPointsB = R3D.bestFeatureFilterRGB(imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
		imageBestPointsB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageBestPointsB);
	this.showComparrison(imageBestPointsA, imageBestPointsB);
*/
/*
	var bestFeaturesA = R3D.bestFeatureListRGB(imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
	var bestFeaturesB = R3D.bestFeatureListRGB(imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
	
	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);
	this.drawAround(bestFeaturesA, 0,300);
	this.drawAround(bestFeaturesB, 400,300);
	// this.drawAround(bestFeaturesA, 0,0);
	// this.drawAround(bestFeaturesB, 400,0);
*/


	// mouse butt
	// var featurePointA = new V2D(326.5,176);
	// var featurePointB = new V2D(256,227);
	// var loc = new V2D(240,200);
	// var siz = new V2D(60,60);
	// origin
	// var featurePointA = new V2D(173,107);
	// var featurePointB = new V2D(212,46);
	// var loc = new V2D(190,25);
	// var siz = new V2D(50,50);
	// glasses corner
	var featurePointA = new V2D(189,180);
	var featurePointB = new V2D(169,180);
	var loc = new V2D(140,160);
	var siz = new V2D(60,60);
		this.drawAround([featurePointA], 0,0);
		this.drawAround([featurePointB], 400,0);

	var rangeA = new AreaMap.Range(imageMatrixA,imageMatrixA.width(),imageMatrixA.height(), 10,10);
	var rangeB = new AreaMap.Range(imageMatrixB,imageMatrixB.width(),imageMatrixB.height(), 10,10);

	// get a feature at a point & feature at a similar point
	var featureA = new ZFeature();
	featureA.setupWithImage(rangeA, featurePointA, 1.0,    true);
	var featureB = new ZFeature();
	featureB.setupWithImage(rangeB, featurePointB, 1.0,    true);

	featureA.visualize(875,200, rangeA);
	featureB.visualize(875,300, rangeB);

	// compare features
	var score = ZFeature.compareScore(featureA, featureB, rangeA,rangeB);
	console.log("1 & 2 score: "+score);
	var score = ZFeature.compareScore(featureA, featureA, rangeA,rangeA);
	console.log("1 & 1 score: "+score);
	var score = ZFeature.compareScore(featureB, featureB, rangeB,rangeB);
	console.log("2 & 2 score: "+score);
	// get best score in area ...

		// go thru board
	var gridX = 1, gridY = 1;
	var gX = Math.floor(siz.x/gridX);
	var gY = Math.floor(siz.y/gridY);
	var gridSize = gX * gY;
	var grid = Code.newArrayZeros(gridSize);
	var index = 0;
	var featureX;
	var ratioSize = gridX;
	for(j=0; j<gY; ++j){
		for(i=0; i<gX; ++i){
			index = j*gX + i;
			var p = new V2D(loc.x + i*gridX, loc.y + j*gridY);
			//console.log(p+"  "+index+"/"+gridSize);
			//console.log(index+"/"+gridSize+" = "+(index/gridSize));
			featureX = new ZFeature();
			featureX.setupWithImage(rangeB, p, 1.0);
			//score = ZFeature.compareScore(feature1, feature2);
			score = ZFeature.compareScore(featureA, featureX, rangeA, rangeB);
			//score = ZFeature.compareScore(featureX, feature2); // SHOULD BE 0
			grid[index] = score;
			//grid[index] = i*j;
		}
		console.log("    "+(j/gY));
	}

	// SHOW
	grid = ImageMat.getNormalFloat01(grid);
	grid = ImageMat.invertFloat01(grid);
	//grid = ImageMat.pow(grid,2);
	grid = ImageMat.pow(grid,10);
	//grid = ImageMat.pow(grid,1000);
	img = GLOBALSTAGE.getFloatRGBAsImage(grid,grid,grid, gX,gY);
	d = new DOImage(img);
	//d.matrix().scale(ratioSize);
	//d.matrix().translate(800,0);
	d.matrix().translate(400, 0);
	d.matrix().translate(loc.x, loc.y);
	d.graphics().alpha(0.70);
	GLOBALSTAGE.addChild(d);



}
Matching.prototype.drawAround = function(locations, offX, offY){
	var i, c;
	var sca = 1.0;
	var count = Math.min(locations.length-1,2000);
	for(i=0;i<locations.length;++i){
		var percent = (i+0.0)/((count==0?1.0:count)+0.0);
		var percem1 = 1 - percent;
		var p = locations[i];
		//console.log(i+" "+p.z+"    "+percent);
		// if(p.z<0.5){
		// 	return;
		// }
		c = new DO();
		var color = Code.getColARGBFromFloat(1.0,percem1,0,percent);
		c.graphics().setLine(2.0, color);
		//c.graphics().setFill(0x00FF6666);
		c.graphics().beginPath();
		//c.graphics().drawCircle((p.x)*sca, (p.y)*sca,  3 + i*0.5);
		c.graphics().drawCircle((p.x)*sca, (p.y)*sca,  3 + i*0.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		//c.graphics().fill();
		//c.graphics().alpha(1.0/(i+1));
			c.matrix().translate(offX,offY);
		GLOBALSTAGE.addChild(c);
		if(i>=count){
			break;
		}
	}

}
Matching._DY = 300;
Matching.prototype.showComparrison = function(imageA, imageB, invert){
	var dy = Matching._DY;
	var red, grn, blu, d;
	
	red = Code.copyArray(imageA.red());
	grn = Code.copyArray(imageA.grn());
	blu = Code.copyArray(imageA.blu());
	red = ImageMat.normalFloat01(red);
	grn = ImageMat.normalFloat01(grn);
	blu = ImageMat.normalFloat01(blu);
	if(invert){
		red = ImageMat.invertFloat01(red);
		grn = ImageMat.invertFloat01(grn);
		blu = ImageMat.invertFloat01(blu);
	}

	img = GLOBALSTAGE.getFloatRGBAsImage(red,grn,blu, imageA.width(),imageA.height());
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(0, dy);
	GLOBALSTAGE.addChild(d);

	red = Code.copyArray(imageB.red());
	grn = Code.copyArray(imageB.grn());
	blu = Code.copyArray(imageB.blu());
	red = ImageMat.normalFloat01(red);
	grn = ImageMat.normalFloat01(grn);
	blu = ImageMat.normalFloat01(blu);
	if(invert){
		red = ImageMat.invertFloat01(red);
		grn = ImageMat.invertFloat01(grn);
		blu = ImageMat.invertFloat01(blu);
	}

	img = GLOBALSTAGE.getFloatRGBAsImage(red,grn,blu, imageB.width(),imageB.height());
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(400, dy);
	GLOBALSTAGE.addChild(d);

	Matching._DY += 300;
}
/*
- get initial best points
	- VISUALIZE:
		- cornerness
		- move cost
		- local disparity (value range)
		- high gradient?
		- blobness ?
		- scale peaks
		- hessian
		- hessian detector
	- best: norm(corner)*norm(move cost)*norm(local disparity)*...
- create descriptors for points
- compare descriptors to get best match
*/