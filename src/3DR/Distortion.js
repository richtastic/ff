// Distortion.js

function Distortion(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._root = new DO();
	this._stage.root().addChild(this._root);
	GLOBALSTAGE = this._stage;
	// load images
	imageList = ["caseStudy1-0.jpg","caseStudy1-26.jpg"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.imagesLoadComplete,null);
	imageLoader.load();
}
Distortion.prototype.imagesLoadComplete = function(imageInfo){
	var imageList = imageInfo.images;

	var imageSourceA = imageList[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = imageList[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);
	
	var i, j, list = [], d, img, x=0, y=0;
	for(i=0;i<imageList.length;++i){
		img = imageList[i];
		list[i] = img;
		d = new DOImage(img);
		d.enableDragging();
		this._root.addChild(d);
		d.matrix().identity();
		d.matrix().translate(x,y);
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().endPath();
		d.graphics().strokeLine();
		x += img.width;
		y += 0;
	}

	// K
	var K = [ 3.7576E+2 , -1.7370E+0 , 1.9356E+2 ,  0.0000E+0 , 3.8050E+2 , 1.6544E+2 ,  0.0000E+0 , 0.0000E+0 , 1.0000E+0 ];
	K = new Matrix(3,3).fromArray(K);

	// distortion
	var distFwd = [0.000008307734426799319, -3.377152135790497e-10, 3.5230315771502345e-15, 0.000013584543511478514, 0.000012701653003035555]; // forward
	var distRev = [-0.0000078775062568953, 2.739331666780191e-10, -2.6835259486512955e-15, 0.000014738976576623628, -0.00001788406255261619]; // inverted

	var dist = distFwd;
	var distortion = {};
	distortion["k1"] = dist[0];
	distortion["k2"] = dist[1];
	distortion["k3"] = dist[2];
	distortion["p1"] = dist[3];
	distortion["p2"] = dist[4];
	var distortionFwd = distortion;

	var dist = distRev;
	var distortion = {};
	distortion["k1"] = dist[0];
	distortion["k2"] = dist[1];
	distortion["k3"] = dist[2];
	distortion["p1"] = dist[3];
	distortion["p2"] = dist[4];
	var distortionRev = distortion;


	// // // playing
	// distortion = distortionFwd;
	// distortion["k1"] = -1E-6;
	// //distortion["k1"] = 1E-5;
	// distortion["k2"] = 1E-21;
	// distortion["k3"] = 1E-20;
	// distortion["p1"] = 1E-4;
	// distortion["p2"] = 1E-10;

	var inverged = R3D.invertImageDistortion(imageMatrixA, K, distortionFwd, distortionRev);
	var invertedCenter = inverged["center"];
	var invertedMatrixA = inverged["image"];
	
	var img = GLOBALSTAGE.getFloatRGBAsImage(invertedMatrixA.red(), invertedMatrixA.grn(), invertedMatrixA.blu(), invertedMatrixA.width(), invertedMatrixA.height());
	var d = new DOImage(img);
	d.matrix().translate(800+10,0+10);
	this._root.addChild(d);
}

Distortion.prototype.a = function(){
	// 
}


