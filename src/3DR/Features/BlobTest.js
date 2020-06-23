function BlobTest(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._root = new DO();
	//this._root.matrix().scale(1.5);
	//this._root.matrix().translate(10,50);
	this._stage.root().addChild(this._root);

	new ImageLoader("../images/muffin/",["IMG_6097_25.JPG", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load(); // GOOD : [46 @ 0.83 | 45 @ 0.78]

}
BlobTest.prototype.imagesLoadComplete = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
 GLOBALSCALE = 1.0;
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



	// CORNERS:
	var imageMatrixList = [imageMatrixA,imageMatrixB];
	var featureList = [];
	for(var i=0; i<imageMatrixList.length; ++i){
		var imageMatrix = imageMatrixList[i];
		var imageWidth = imageMatrix.width();
		var imageHeight = imageMatrix.height();
		var features = R3D.differentialCornersForImage(imageMatrix, new V2D(600,400));
		R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);
		// var normalizedFeatures = R3D.normalizeSIFTObjects(features, imageMatrix.width(), imageMatrix.height());
		// console.log("FEATURES: "+normalizedFeatures.length);
		// 	features = R3D.denormalizeSIFTObjects(normalizedFeatures, imageWidth, imageHeight);
		// // OBJECTS
		// var objects = R3D.generateProgressiveSIFTObjects(features, imageMatrix);
		// featureList[i] = objects;
	}
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
