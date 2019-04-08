function RiftTest(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._root = new DO();
	this._stage.root().addChild(this._root);

	new ImageLoader("./images/iowa/",["0.JPG", "1.JPG"],this,this.imagesLoadComplete).load();

}

RiftTest.prototype.imagesLoadComplete = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
//GLOBALSCALE = 1.75;
 // GLOBALSCALE = 1.0;
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
	// 	var d = new DOImage(img);
	// 	this._root.addChild(d);
	// 	d.matrix().scale(GLOBALSCALE);
	// 	// d.graphics().alpha(0.10);
	// 	d.graphics().alpha(0.50);
	// 	// d.graphics().alpha(1.0);
	// 	d.matrix().translate(x,y);
	// 	x += img.width*GLOBALSCALE;
	}
	var display = this._root;
	display.matrix().scale(1.5);
	GLOBALSTAGE = this._stage;

// show initial points
	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);

	var filter = new Filter();
	var imgs = [imageMatrixA,imageMatrixB];
	var sharpen = [];
	for(var i=0; i<imgs.length; ++i){
break;
		var imageMatrix = imgs[i];
		var red = imageMatrix.red();
		var grn = imageMatrix.grn();
		var blu = imageMatrix.blu();
		var src = imageMatrix.gry();
		var wid = imageMatrix.width();
		var hei = imageMatrix.height();
		// var size = 11;
		// var threshold = undefined;
		// var rangeMin = undefined;
		// var result = ImageMat.adaptiveThreshold(src, wid, hei, size, threshold, rangeMin)
		// console.log(result);

		// filter.applyFilterHistogramExpand(1.0, red,grn,blu, wid,hei);
		filter.applyFilterSharpen(1.0, red,grn,blu, wid,hei);
		// filter.applyFilterMedian({"percent":1.0, "window":0.01}, red,grn,blu, wid,hei); // SLOW
		// filter.applyFilterContrast(1.0, red,grn,blu, wid,hei); // ?
		// filter.applyFilterVibrance(1.0,red,grn,blu, wid,hei);
		// filter.applyFilterHue(1.0,red,grn,blu, wid,hei);


		// Filter.filterHistogramExpand()
		// var sharp = imageMatrix.copy();
		var sharp = imageMatrix;

		sharp.red(red);
		sharp.grn(grn);
		sharp.blu(blu);
		sharpen.push(sharp);
	}

// show images
var matrixes = [imageMatrixA,imageMatrixB];
var x = 0;
var y = 0;
for(i=0;i<matrixes.length;++i){
	var img = matrixes[i];
console.log(img);
	var iii = img;
		img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	this._root.addChild(d);
	// d.matrix().scale(GLOBALSCALE);
	// d.graphics().alpha(0.10);
	d.graphics().alpha(0.50);
	// d.graphics().alpha(1.0);
	d.matrix().translate(x,y);
	// x += img.width*GLOBALSCALE;
	x += img.width;
}


// throw "?";


	// get feature info
	var maxCount = 4000;
	var featuresA = R3D.calculateScaleCornerFeatures(imageMatrixA, maxCount);
	var featuresB = R3D.calculateScaleCornerFeatures(imageMatrixB, maxCount);


// show initial features:
this.showFeatures(featuresA, 0,0, display, 0x990000FF);
this.showFeatures(featuresB, imageMatrixA.width(),0, display, 0x990000FF);


// pick a feature to focus on:



// throw "?";



	// get feature descriptor
	var objectsA = R3D.generateSIFTObjects(featuresA, imageMatrixA);
	var objectsB = R3D.generateSIFTObjects(featuresB, imageMatrixB);


	var maxFeatures = 800;
	var matchData = R3D.fullMatchesForObjects(objectsA, imageMatrixA, objectsB, imageMatrixB, maxFeatures);//, objectsAllA,objectsAllB);





	if(!matchData){
		throw "could not find full matches";
	}
	var F = matchData["F"];
	var matches = matchData["matches"];

	var matrixFfwd = F;
	if(matrixFfwd){
		console.log(F.toArray()+"");
		var matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	}

	// console.log("best ... ");
	// console.log(best);

	this.showMSERmatches(matches, imageMatrixA, imageMatrixB);

throw "..."


	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var fr = match["from"];
		var to = match["to"];
		if(!fr){
			fr = match["A"];
			to = match["B"];
		}
		pointsA.push(fr["point"]);
		pointsB.push(to["point"]);
	}

	// return;

	//if(false){
	if(true){
	R3D.drawMatches(matches, 0,0, imageMatrixA.width(),0, display);
	if(matrixFfwd){
	R3D.showRansac(pointsA,pointsB, matrixFfwd, matrixFrev, display, imageMatrixA,imageMatrixB);
	}
	}

	throw "HERE"



	// var matrixFfwd = [2.041322467847871e-7,0.000014304778253234078,-0.0016910858521905143,-0.0000021465269183805225,-0.00001003739246648299,0.019402193354383566,-0.00004247026281761891,-0.020592074595533316,0.14857516866839532];
	// matrixFfwd = new Matrix(3,3).fromArray(matrixFfwd);


	// var matrixFfwd = [-0.0000041576723316428, -0.00005882120633163811, 0.008730780225219698, 0.00004167019132862216, -0.0000020442702939101748, -0.025987525163972135, -0.004339999775773085, 0.02644111516518665, -0.02076316997976102];
	// 	matrixFfwd = new Matrix(3,3).fromArray(matrixFfwd);
	// var matrixFfwd = [-0.000004139363896986988, -0.00005863702537626256, 0.008705674476541317, 0.00004131342313242088, -0.0000018824489333730404, -0.025913976364139904, -0.004291507571148334, 0.02638087842817162, -0.027575659232469817];
	// 	matrixFfwd = new Matrix(3,3).fromArray(matrixFfwd);
	// var matrixFfwd = [-0.000003486663949059767, -0.000046789577223311455, 0.006911118081526229, 0.0000328596065195337, -0.0000036611058428955012, -0.02273586780312925, -0.0031370534738073396, 0.02335622033036775, -0.023247364225031944];
	// 	matrixFfwd = new Matrix(3,3).fromArray(matrixFfwd);

	// MEDIUM / DENSISH:
	console.log("stereoHighConfidenceMatches");
	var matches = R3D.stereoHighConfidenceMatches(imageMatrixA,imageMatrixB, pointsA,pointsB,matrixFfwd);
	console.log(matches);


	throw "HERE"

	matches = R3D.matchesRemoveClosePairs(matches,imageMatrixA,imageMatrixB, 1.0);
	console.log(matches);

	R3D.stereoMatchAverageAffine(imageMatrixA,imageMatrixB,matches);
	console.log(matches);


	console.log("pointsA:");
	Code.printPoints(pointsA);

	console.log("pointsB:");
	Code.printPoints(pointsB);


}


RiftTest.prototype.showFeatures = function(features, offsetX, offsetY, display, color){
	color = color!==undefined ? color : 0xFFFF0000;
	for(var k=0; k<features.length; ++k){
		var feature = features[k];
		var center = feature["point"];
		var x = center.x;
		var y = center.y;
		var angle = feature["angle"];
		var size = feature["size"];;

		var c = new DO();

		// DOT:
		//c.graphics().setLine(1.0, Code.setAlpARGB(color, 0x33) );
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(0,0, 1);
		c.graphics().strokeLine();
		c.graphics().endPath();


		/*
		//c.graphics().drawEllipse(0,0, sizeX,sizeY, 0);
		c.graphics().drawRect(-sizeX*0.5,-sizeY*0.5, sizeX,sizeY);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().rotate(angleX);
		//c.matrix().scale(GLOBALSCALE);

		*/

		c.matrix().translate(x + offsetX, y + offsetY);

		display.addChild(c);
		/*
		var bestAngles = feature["bestAngles"];
		if(bestAngles){
			for(var j=0; j<bestAngles.length; ++j){
				var best = bestAngles[j];
				var angle = best[0];
				var mag = (sizeX+sizeY)*0.5;
					mag = 10
				var lX = mag*Math.cos(-angle);
				var lY = mag*Math.sin(-angle);
				c.graphics().setLine(1.0, Code.setAlpARGB(color, 0xFF) );
				c.graphics().beginPath();
				c.graphics().moveTo(0,0);
				c.graphics().lineTo(lX,lY);
				c.graphics().strokeLine();
				c.graphics().endPath();
			}
		}
		*/
	}
}




RiftTest.prototype.showMSERmatches = function(matches, imageA, imageB){
	var offY = imageA.height();
console.log(offY);
	var blockSize = 25;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var score = match["score"];
		// console.log(match);
		var pairs = null;
		if( Code.isObject(match["A"])){
			pairs = [match["A"],match["B"]];
		}else{
			pairs = [match["from"],match["to"]];
		}
// draw matches:
var ssss = 1.5;
var c = new DO();
c.graphics().setLine(1.0, 0x66FF0000);
c.graphics().beginPath();
		for(var j=0; j<pairs.length; ++j){
			var item = pairs[j];
// console.log(item);
			var feature = item;
			if(item["feature"]){
				feature = item["feature"];
			}
			var center = feature["center"];
			if(!center){
				center = feature["point"];
			}
			var dirX = feature["x"];
			var dirY = feature["y"];

			//var bestAngle = feature["angle"];
			//var bestAngle = item["angle"];
				var bestAngle = j==0 ? match["angleA"] : match["angleB"]; // TODO: GET FROM BEST MATCH YEAH
				var bestSize = j==0 ? match["sizeA"] : match["sizeB"];
				var sizeX = bestSize;
				var sizeY = bestSize;
				var angleX = 0;
if(bestAngle===undefined){
	bestAngle = feature["angle"];
	bestSize = feature["size"];
	sizeX = bestSize;
	sizeY = bestSize;
}
			// var sizeX = dirX.length();
			// var sizeY = dirY.length();
			// var angleX = V2D.angleDirection(V2D.DIRX,dirX);
			var scaleX = blockSize/sizeX;
			var scaleY = blockSize/sizeY;
			var image;
			if(j==0){
				image = imageA;
			}else{
				image = imageB;
			}
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DRotate(matrix,-angleX);
				matrix = Matrix.transform2DScale(matrix,scaleX,scaleY);
				matrix = Matrix.transform2DRotate(matrix,-bestAngle);
				//matrix = Matrix.transform2DScale(matrix,0.5);
			var block = image.extractRectFromFloatImage(center.x,center.y,1.0,null,blockSize,blockSize, matrix);

			var img, d;
			img = GLOBALSTAGE.getFloatRGBAsImage(block.red(), block.grn(), block.blu(), block.width(), block.height());
			d = new DOImage(img);
			d.matrix().scale(2.0);
			d.matrix().translate(10 + 50*i, 10 + offY*ssss + 50*j);
			GLOBALSTAGE.addChild(d);

			// color = 0xFFFF0000;
			center = center.copy();
			if(j==0){
				c.graphics().drawCircle(center.x, center.y, 5);
				c.graphics().moveTo(center.x, center.y);
			}else{
				//center.x += imageA.width()*ssss;
				center.x += imageA.width();
				c.graphics().lineTo(center.x, center.y);
				c.graphics().drawCircle(center.x, center.y, 5);
			}
			// if(j==1){
			// 	c.matrix().translate(imageA.width()*ssss,0.0);
			// }
		}
c.graphics().strokeLine();
c.graphics().endPath();
c.matrix().scale(ssss);
GLOBALSTAGE.addChild(c);


score = Math.round(score*1E4)/1E4;
var c = new DOText(score+"", 12, DOText.FONT_ARIAL, 0xFF000000, DOText.ALIGN_CENTER);
c.matrix().translate(10 + 25 + 50*i, offY*ssss + 120 + (i%3)*14 );
GLOBALSTAGE.addChild(c);


	}
}


// ...
