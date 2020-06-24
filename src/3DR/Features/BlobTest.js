function BlobTest(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._root = new DO();
	this._stage.root().addChild(this._root);

	// new ImageLoader("../images/muffin/",["IMG_6097_25.JPG", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["IMG_6099_25.JPG", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../sunflowers.png", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../sunflowers_real.png", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../daisies.jpg", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();

	new ImageLoader("../images/muffin/",["../room0.png", "../room2.png"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../F_S_1_1.jpg", "../F_S_1_2.jpg"],this,this.imagesLoadComplete).load();

	// new ImageLoader("../images/muffin/",["../caseStudy1-24.jpg", "../caseStudy1-26.jpg"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../caseStudy1-26.jpg", "../caseStudy1-29.jpg"],this,this.imagesLoadComplete).load();
	
	// new ImageLoader("../images/muffin/",["../bench_B.png", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	
	// new ImageLoader("../images/muffin/",["../bench_A.png", "../bench_B.png"],this,this.imagesLoadComplete).load();

}
BlobTest.prototype.imagesLoadComplete = function(imageInfo){

/*
var a = [0,0,0, 0,0,0, 0,0,0];
var b = [0,0,0, 0,1,0, 0,0,0];
var c = [0,0,0, 0,0,0, 0,0,0];
var wid = 3;
var hei = 3;
var list = [a,b,c];

var extrema = Code.findExtrema3DVolume(list, wid,hei);
console.log(extrema);

throw ".."
*/


	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
 // GLOBALSCALE = 1.0;
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		/*
		var d = new DOImage(img);
		this._root.addChild(d);
		d.matrix().scale(GLOBALSCALE);
		// d.graphics().alpha(0.10);
		d.graphics().alpha(0.50);
		// d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width*GLOBALSCALE;
		*/
	}
	var display = this._root;
	// display.matrix().scale(1.5);
	GLOBALSTAGE = this._stage;

var imagePathA = fileList[0];
var imagePathB = fileList[1];

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);



GLOBALSTAGE.root().matrix().scale(2.0);
	// CORNERS:
	var imageMatrixList = [imageMatrixA,imageMatrixB];
	var featureList = [];
	for(var i=0; i<imageMatrixList.length; ++i){
		var imageMatrix = imageMatrixList[i];

		// imageMatrix = new ImageMatScaled(imageMatrix);

		var imageWidth = imageMatrix.width();
		var imageHeight = imageMatrix.height();

		// MSER
		// var result = R3D.MSERfeatures(imageMatrix);
		// console.log(result);
		
		// break;

		// CORNERS
		// var features = R3D.differentialCornersForImage(imageMatrix, new V2D(600,400));
		// R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);

		// var corners = R3D.differentialCornersForImageSingle(imageMatrix);



		var info = R3D.imageCornersDifferential(imageMatrix, false);
		var angles = info["angles"];
		var scores = info["value"];
		console.log(scores);
		scores = ImageMat.normalFloat01(scores);
		var colors = [0xFF000000, 0xFF000099, 0xFFCC00CC, 0xFFFF0000, 0xFFFFFFFF];
		var img = ImageMat.heatImage(scores, imageWidth, imageHeight, false, colors);
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.graphics().alpha(1.0);
		d.matrix().translate(imageWidth*i, 0);
		GLOBALSTAGE.addChild(d);

/*
var point = new V2D(202,132);
var point = new V2D(347,91);
		// EXAMPLE
		var showLocation = new V2D(40,40);
		var showSize = 2.5;
		var sampleSize = 7;
		var sca = 7.0;
		
		// var showLocation = new V2D(250,90);
				var c = new DO();
				c.graphics().setLine(2.0, 0xFF0000FF);
				c.graphics().beginPath();
				c.graphics().drawCircle(point.x, point.y, 4);
				c.graphics().strokeLine();
				c.graphics().endPath();
				GLOBALSTAGE.addChild(c);
		var index = Math.round(point.y)*imageWidth + Math.round(point.x);
console.log("FROM INDEX: "+index);//+" X "+V2D.DIRX);
		var angle = angles[index];
			// angle = Math.PI - angle;


// angle = Code.radians(45);
// angle = Code.radians(-45);
		console.log("angle: "+Code.degrees(angle));


		imageMatrix = new ImageMatScaled(imageMatrix);

		var image = imageMatrix.extractRect(point,1.0, sampleSize,sampleSize, null);
		console.log(sampleSize);

		var img = image;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		// d.graphics().alpha(1.0);
		d.matrix().scale(sca);
		d.matrix().translate(showLocation.x,showLocation.y);
		GLOBALSTAGE.addChild(d);

		var c = new DO();
		c.graphics().setLine(2.0, 0xFF00FF00);
		c.graphics().beginPath();
		c.graphics().drawCircle(0, 0, sca*showSize);
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(sca*showSize*Math.cos(angle), sca*showSize*Math.sin(angle));
		c.graphics().strokeLine();
		c.graphics().endPath();
		// c.matrix().scale(1,-1);
		c.matrix().translate(showLocation.x + sca*sampleSize*0.5,showLocation.y + sca*sampleSize*0.5);
		GLOBALSTAGE.addChild(c);

		throw "??";
*/



/*		
		var info = R3D.differentialCornersForImageSingle(imageMatrix, 0.01);
		// console.log(info);
		var points = info["points"];
		var angles = info["angles"];
		// console.log(points,angles);
		var features = [];
		for(var f=0; f<points.length; ++f){
			var point = points[f];
			var angle = angles[f];
			var feature = {};
			feature["point"] = new V2D(point.x,point.y);
			feature["size"] = 5.0;
			feature["angle"] = angle;
			features.push(feature);
		}
		R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);
*/



		// BLOBS
		// , new V2D(800,600)
		// var features = R3D.SIFTBlobsForImage(imageMatrix, new V2D(800,600));
		// R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);

		// var blobs = R3D.SIFTExtractTest2(imageMatrix);
		// console.log(blobs);
		// var features = blobs;
		// R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);
		// throw "..."

		

		// R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);
		// var normalizedFeatures = R3D.normalizeSIFTObjects(features, imageMatrix.width(), imageMatrix.height());
		// console.log("FEATURES: "+normalizedFeatures.length);
		// 	features = R3D.denormalizeSIFTObjects(normalizedFeatures, imageWidth, imageHeight);
		// // OBJECTS
		// var objects = R3D.generateProgressiveSIFTObjects(features, imageMatrix);
		// featureList[i] = objects;
	}
	throw "..."
/*
	var objectsA = featureList[0];
	var objectsB = featureList[1];
	// coarse full features
	var result = R3D.progressiveFullMatchingDense(objectsA, imageMatrixA, objectsB, imageMatrixB);
	console.log(result);
	// 195 px error
	// coarse F corners
	// var result = R3D.findLocalSupportingCornerMatches(imageMatrixA,imageMatrixB, pointsA,pointsB);
	// guided F corners
	// result = R3D.findDenseCornerFMatches(imageMatrixA,imageMatrixB, F, searchDensePixelError, null, pointsA,pointsB);
*/

	// find blobs


	// create features


	// feature compare


	// top features


	// F RANSAC


	// best features



	// dense features F
}
