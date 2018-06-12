// BeliefTest.js

function BeliefTest(){
	console.log("BeliefTest");
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
GLOBALSTAGE = this._stage;
	// import image to work with
	// import images & correspondences

	// R3D.normalizedCrossCorrelation(needle,needleMask, haystack);

	this._views = [];

	var imageLoader = new ImageLoader("./images/",["room0.png","room2.png"], this,this.handleImageLoaded,null);
	imageLoader.load();
}
BeliefTest.prototype.handleMouseClickFxn = function(e){
	//console.log(e.x,e.y)
}
BeliefTest.prototype.handleImageLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	var imageScale = 1.0;
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		d.matrix().scale(imageScale);
		//d.graphics().alpha(0.03);
		d.graphics().alpha(0.50);
		//d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width*imageScale;
				var matrix = this._stage.getImageAsFloatRGB(img);
				matrix = new ImageMat(matrix["width"], matrix["height"], matrix["red"], matrix["grn"], matrix["blu"]);
			var view = new BeliefTest.View(matrix);
		this._views.push(view);
	}
	// var display = this._root;
	// display.matrix().scale(1.5);
	// GLOBALSTAGE = this._stage;

	this.getMatches();
}
BeliefTest.prototype.getMatches = function(){
	var client = new ClientFile("../php/service_file.php");
	var path = "projects/0/pairs/FF6ZQTUH/matches.yaml";
	client.addFunction(ClientFile.EVENT_GET_COMPLETE, this._handleGetMatchesComplete, this);
	client.get(path);
}
BeliefTest.prototype._handleGetMatchesComplete = function(data){
	var str = Code.binaryToString(data);
	var yaml = YAML.parse(str);
	var matches = yaml[0]["matches"];


	var viewA = this._views[0];
	var viewB = this._views[1];
	var imageA = viewA.image();
	var imageB = viewB.image();

	console.log(viewA,viewB);
	// console.log(matches);
	var needleSize = 21;
	var featureNeighborhood = needleSize * 3;
	var haystackSize = 3*needleSize;
	var needleMask = null;
		needleMask = ImageMat.circleMask(needleSize);

	for(var i=0; i<matches.length; ++i){

		if(i!=22){
			continue;
		}

		var match = matches[i];
		var fr = match["fr"];
		var to = match["to"];
		var scaleAtoB = to["s"]/fr["s"];
		var angleAtoB = to["a"]-fr["a"];
		var pointA = new V2D(fr["x"],fr["y"]);
		var pointB = new V2D(to["x"],to["y"]);

		pointA.scale(imageA.width(),imageA.height());
		pointB.scale(imageB.width(),imageB.height());



// pointB.add(100.0,100.0);
// pointB.add(-100.0,100.0);
// pointB.add(-50.0,0.0);
// pointB.add(-50.0,120.0);

// pointB.add(100.0,0.0);

var vectorX = new V2D(1.0,0.0);
var vectorY = new V2D(0.0,1.0);
var matrix = new Matrix(3,3).identity();
matrix = Matrix.transform2DScale(matrix,scaleAtoB);
matrix = Matrix.transform2DRotate(matrix,angleAtoB);
	vectorX = matrix.multV2DtoV2D(vectorX);
	vectorY = matrix.multV2DtoV2D(vectorY);
	console.log(vectorX+"");
	console.log(vectorY+"");

var optimum = R3D.optimumAffineTransform(imageA,pointA, imageB,pointB, vectorX,vectorY, needleSize);
var u = new V2D(0,0);
var x = new V2D(1,0);
var y = new V2D(0,1);
var a = optimum["A"];
var b = optimum["B"];
var o = optimum["O"];
var matrix = R3D.affineMatrixExact([o,x,y],[o,a,b]);


// old:
// var matrix = new Matrix(3,3).identity();
// matrix = Matrix.transform2DScale(matrix,scaleAtoB);
// matrix = Matrix.transform2DRotate(matrix,angleAtoB);
// o = new V2D(0,0);

var needle = imageA.extractRectFromFloatImage(pointA.x+o.x,pointA.y+o.y,1.0,null,needleSize,needleSize, matrix);
var matrix = new Matrix(3,3).identity();
var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,haystackSize,haystackSize, matrix);


/*
		// NEEDLE
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,scaleAtoB);
			matrix = Matrix.transform2DRotate(matrix,angleAtoB);
		var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,needleSize,needleSize, matrix);
		var matrix = new Matrix(3,3).identity();
		var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,haystackSize,haystackSize, matrix);
*/
		
		//var ncc = R3D.normalizedCrossCorrelation(needle,needleMask, haystack);
		var ncc = R3D.normalizedCrossCorrelation(needle,needleMask, haystack, true); // cost
		console.log(ncc);

		var nccValues = ncc["value"];
		var nccSize = ncc["width"];
		// console.log(haystack);


// SIFT
// var circular = R3D.SIFTVectorCircular(imageA, pointA,featureNeighborhood,?, true);
// Code.printHistogram(circular, 25);
// SAD
// var circular = R3D.SADVectorCircular(imageA, pointA,featureNeighborhood,?, true);
// Code.printHistogram(circular, 25);



var matrixA = new Matrix(3,3).identity();
	matrixA = Matrix.transform2DScale(matrixA,scaleAtoB);
	matrixA = Matrix.transform2DRotate(matrixA,angleAtoB);
var matrixB = new Matrix(3,3).identity();



console.log("SAD test:");
var vectorA = R3D.SADVectorCircular(imageA, pointA,featureNeighborhood,matrixA, true);
var vectorB = R3D.SADVectorCircular(imageB, pointB,featureNeighborhood,matrixB, true);
var compareSADAB = R3D.compareSADVectorCircular(vectorA, vectorB);
// console.log(vectorA);
// console.log(vectorB);
// Code.printHistogram(vectorA, 25);
// Code.printHistogram(vectorB, 25);
console.log("SAD:  "+compareSADAB);

var vectorA = R3D.SIFTVectorCircular(imageA, pointA,featureNeighborhood,matrixA, true);
var vectorB = R3D.SIFTVectorCircular(imageB, pointB,featureNeighborhood,matrixB, true);
var compareSIFTAB = R3D.compareSIFTVectorCircular(vectorA, vectorB);

// Code.printHistogram(vectorA, 25);
// Code.printHistogram(vectorB, 25);
console.log("SIFT: "+compareSIFTAB);

console.log(" -> :  "+(compareSADAB*compareSIFTAB));


// var peaks = Code.findMaxima2DFloat(nccValues,nccSize,nccSize, true);
// peaks.sort( function(a,b){ return a.z>b.z ? -1 : 1; } );
var peaks = Code.findMinima2DFloat(nccValues,nccSize,nccSize, true);
peaks.sort( function(a,b){ return a.z<b.z ? -1 : 1; } );
// console.log(peaks);

		var sca = 6.0;
		var OFFX = 1200.0;
		var OFFY = 10.0;
		var d = new DO();
			d.graphics().setLine(2.0, 0xFFFF0000);
			d.graphics().beginPath();
			d.graphics().drawCircle(pointA.x,pointA.y, 5);
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(0 + 0, 0 + 0);
			GLOBALSTAGE.addChild(d);
		var d = new DO();
			d.graphics().setLine(2.0, 0xFF0000FF);
			d.graphics().beginPath();
			d.graphics().drawCircle(pointB.x,pointB.y, 5);
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(0 + imageA.width(), 0 + 0);
			GLOBALSTAGE.addChild(d);


			var iii = needle;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(OFFX, OFFY);
			GLOBALSTAGE.addChild(d);

			var iii = haystack;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(OFFX + 150, OFFY);
			GLOBALSTAGE.addChild(d);


		var heat = ImageMat.heatImage(nccValues, nccSize, nccSize, true);
		var img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), nccSize,nccSize);
		var d = new DOImage(img);
			d.graphics().alpha(0.1);
			// d.graphics().alpha(0.5);
			d.matrix().scale(sca);
			d.matrix().translate(OFFX + 150, OFFY + 0);
			d.matrix().translate(Math.floor(needleSize*0.5)*sca,Math.floor(needleSize*0.5)*sca);
			

		GLOBALSTAGE.addChild(d);

		for(var p=0; p<peaks.length; ++p){
			var peak = peaks[p];
			var d = new DO();
			d.graphics().setLine(2.0, 0xFFFFCCFF);
			d.graphics().beginPath();
			//d.graphics().drawCircle(0,0, 8*((peaks.length-i)/peaks.length));
			// console.log( peak.z )
			d.graphics().drawCircle(0,0, 8*((peaks.length-p)/peaks.length));
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(OFFX + 150, OFFY + 0);
			d.matrix().translate(Math.floor(needleSize*0.5)*sca,Math.floor(needleSize*0.5)*sca);
			d.matrix().translate(peak.x*sca, peak.y*sca);
			GLOBALSTAGE.addChild(d);
		}


		/*
		var siz = 21;
			var sca = 6.0;
			var fnt = 15;
			var matrix = new Matrix(3,3).identity();
			var frK = imageA.extractRectFromFloatImage(fr.x,fr.y,1.0,null,siz,siz, matrix);
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,1.0/sc);
				matrix = Matrix.transform2DRotate(matrix,-an);
			var toK = imageB.extractRectFromFloatImage(to.x,to.y,1.0,null,siz,siz, matrix);




			var iii = frK;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(1100, 10 + k*siz*sca);
			GLOBALSTAGE.addChild(d);
			var iii = toK;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(1100 + sca*siz, 10 + k*siz*sca);
			GLOBALSTAGE.addChild(d);


		*/
		break;
	}


	var lattice = new BeliefTest.Lattice(viewA,viewB);
	this._lattice = lattice;
}
BeliefTest.prototype.handleEnterFrame = function(e){
	//console.log(e);
}
/// --------------------------------------------------------------------------------------------------------
BeliefTest.View = function(image){
	this._imageFlat = null;
	this._imageGradient = null;
	this._imageCorners = null;
	this.image(image);
}

BeliefTest.View.prototype.image = function(image){
	if(image!==undefined){
		this._image = image;
		// generate other fields as necessary
	}
	return this._image;
}
/// --------------------------------------------------------------------------------------------------------
BeliefTest.Cell = function(){
	//
}
/// --------------------------------------------------------------------------------------------------------
BeliefTest.Lattice = function(viewA,viewB){
	this._viewA = null;
	this._viewB = null;
}
BeliefTest.Lattice.prototype.viewA = function(viewA){
	if(viewA!==undefined){
		this._viewA = viewA;
	}
	return this._viewA;
}
BeliefTest.Lattice.prototype.viewB = function(viewA){
	if(viewA!==undefined){
		this._viewA = viewA;
	}
	return this._viewA;
}
/// --------------------------------------------------------------------------------------------------------
BeliefTest.X = function(){
	//
}
/// --------------------------------------------------------------------------------------------------------
BeliefTest.X = function(){
	//
}
/// --------------------------------------------------------------------------------------------------------






