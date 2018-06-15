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

	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this._handleKeyboardUp,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	this._keyboard.addListeners();
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
		/*
		var d = new DOImage(img);
		this._root.addChild(d);
		d.matrix().scale(imageScale);
		//d.graphics().alpha(0.03);
		d.graphics().alpha(0.50);
		//d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		*/
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
BeliefTest.prototype._handleKeyboardDown = function(e){
	lattice = this._lattice;
	if(!lattice){
		return;
	}
	if(e.keyCode==Keyboard.KEY_SPACE){
		lattice.iteration();
	}else if(e.keyCode==Keyboard.KEY_ENTER){
		this.drawLattice();
	}
}
BeliefTest.prototype._handleGetMatchesComplete = function(data){
	var str = Code.binaryToString(data);
	var yaml = YAML.parse(str);
	var matches = yaml[0]["matches"];


	var viewA = this._views[0];
	var viewB = this._views[1];
	var imageA = viewA.image();
	var imageB = viewB.image();

	// console.log(viewA,viewB);
	// console.log(matches);
	var needleSize = 21;
	var featureNeighborhood = needleSize * 3;
	var haystackSize = 3*needleSize;
	var needleMask = null;
		needleMask = ImageMat.circleMask(needleSize);

	for(var i=0; i<matches.length; ++i){
break;
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

	// add seeds:
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var fr = match["fr"];
		var to = match["to"];
		var scaleAtoB = to["s"]/fr["s"];
		var angleAtoB = to["a"]-fr["a"];
		var pointA = new V2D(fr["x"],fr["y"]);
		var pointB = new V2D(to["x"],to["y"]);
		pointA.scale(imageA.width(),imageA.height());
		pointB.scale(imageB.width(),imageB.height());

		scaleAtoB = 1.0;
		angleAtoB = 0.0;
		// pointA.scale(imageA.Width,imageAHeight);
		// pointB.scale(imageBWidth,imageBHeight);
		// if(i==9){
		if(i==2){
		//if(i==4){
		// if(i==6){
		//if(i==17){ // table - bad
		// if(i==20){ 
			var cell = lattice.cellFromPoint(pointA);
			cell.setSeed(pointA,pointB,scaleAtoB,angleAtoB);
		}
		// if(i>=10){
		// // if(i>=8){
		// 	break;
		// }
	}
	// choose among best matches
	lattice.cellsChooseMatch();

	//
	this.drawLattice();
	lattice.iteration();
	
}
BeliefTest.prototype.drawLattice = function(e){
	if(!this._display){
		this._display = new DO();
		GLOBALSTAGE.addChild(this._display);
	}
	//var displayScale = 1.5;
	var displayScale = 1.0;
	var display = this._display;
	display.removeAllChildren();
	var lattice = this._lattice;
	var viewA = lattice.viewA();
	var viewB = lattice.viewB();
	var imageA = viewA.image();
	var imageB = viewB.image();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();
	var cells = lattice._cells;
	var cellSize = lattice._cellSize;
	var countX = lattice._cellCountX;
	var countY = lattice._cellCountY;
	// show images:
		var alp = 0.50;
		var iii = imageA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.graphics().alpha(alp);
		d.matrix().scale(displayScale);
		display.addChild(d);
		var iii = imageB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.graphics().alpha(alp);
		d.matrix().scale(displayScale);
		d.matrix().translate(imageAWidth*displayScale, 0.0);
		display.addChild(d);
		
	// var d = new DOImage(img);
	// 	this._root.addChild(d);
	// 	d.matrix().scale(imageScale);
	// 	//d.graphics().alpha(0.03);
	// 	d.graphics().alpha(0.50);
	// 	//d.graphics().alpha(1.0);
	// 	d.matrix().translate(x,y);
	// show cells:
	for(var j=0; j<countY; ++j){
		for(var i=0; i<countX; ++i){
			
			var cell = lattice.cellFromColRow(i,j);
			// good match ?
			var match = cell.match();
			if(match){
				var pointA = match.pointA(); // chould be center
				var pointB = match.pointB();
				var center = cell.center();
				var cellSize = lattice.cellSize();
				var matrix = match.affine();
					inverse = Matrix.inverse(matrix);
				// B in A
				var img = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,cellSize,cellSize, inverse);
				img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
				var d = new DOImage(img);
				d.matrix().scale(displayScale);
				//d.matrix().scale(2.0);
				d.matrix().translate((center.x-cellSize*0.5)*displayScale,(center.y-cellSize*0.5)*displayScale);
				display.addChild(d);
				// A in B
				var img = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,cellSize,cellSize, matrix);
				img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
				var d = new DOImage(img);
				d.matrix().scale(displayScale);
				d.matrix().translate(imageAWidth,0);
				d.matrix().translate((pointB.x-cellSize*0.5)*displayScale,(pointB.y-cellSize*0.5)*displayScale);
				display.addChild(d);
			}else{
				var d = new DO();
				if(false){//cell.hasMatch()){
					d.graphics().setLine(1.0,0x99FF9933);
					d.graphics().setFill(0x66FF9933);
				}else{
					d.graphics().setLine(1.0,0x99FF0000);
					d.graphics().setFill(0x66FF0000);
				}
				d.graphics().beginPath();
				d.graphics().drawRect(i*cellSize*displayScale,j*cellSize*displayScale, cellSize*displayScale,cellSize*displayScale);
				// d.graphics().moveTo(x,y);
				// d.graphics().lineTo(x+v.x,y+v.y);
				d.graphics().fill();
				d.graphics().strokeLine();
				d.graphics().endPath();
				display.addChild(d);
			}
		}
	}
	// show matches:
var dCount = 0;
	for(var j=0; j<countY; ++j){
break;
		for(var i=0; i<countX; ++i){
			var cell = lattice.cellFromColRow(i,j);
			var match = cell.match();
			if(match){
				// console.log(match);
				var pointA = match.pointA();
				var pointB = match.pointB();
				// A
				var d = new DO();
				d.graphics().setLine(1.0,0xFFFF00FF);
				d.graphics().beginPath();
				d.graphics().drawCircle(pointA.x*displayScale,pointA.y*displayScale, 5);
				d.graphics().strokeLine();
				d.graphics().endPath();
				display.addChild(d);
				// B
				var d = new DO();
				d.graphics().setLine(1.0,0xFFFF00FF);
				d.graphics().beginPath();
				d.graphics().drawCircle(imageAWidth+displayScale+pointB.x*displayScale,pointB.y*displayScale, 5);
				d.graphics().strokeLine();
				d.graphics().endPath();
				display.addChild(d);

/*
				// match A
				var compareSize = lattice.cellSize()
				var matrix = match.affine();
				var img = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
				img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
				var d = new DOImage(img);
				d.matrix().scale(2.0);
				d.matrix().translate(1100,10+dCount*50);
				display.addChild(d);
				// match B
				var compareSize = lattice.cellSize()
				var matrix = null
				var img = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrix);
				img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
				var d = new DOImage(img);
				d.matrix().scale(2.0);
				d.matrix().translate(1100 + 50,10+dCount*50);
				display.addChild(d);
*/

				++dCount;

			// var matrix = new Matrix(3,3).identity();
			// 	matrix = Matrix.transform2DRotate(matrix,-angleAB);
			// 	matrix = Matrix.transform2DScale(matrix,1.0/scaleAB);
			// var img = imageB.extractRectFromFloatImage(pB.x,pB.y,scale,null,compareSize,compareSize, matrix);
			// 	img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
			// 	var d = new DOImage(img);
			// 	d.matrix().scale(1.0);
			// 	d.matrix().translate(0 + pA.x - compareSize*0.5, pA.y - compareSize*0.5);
			// 	this._matchDisplay.addChild(d);
			}
		}
	}
	// 
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
BeliefTest.Cell = function(lattice, i,j, center){
	this._putativeMatches = [];
	this._match = null;
	this._label = null;
	this._lattice = lattice;
	this._col = i;
	this._row = j;
	this._center = center.copy();
	this._neighbors = [];
	this._hasChanged = false;
	this._votes = [];
}
BeliefTest.Cell._LABEL = 0;
BeliefTest.Cell.nextLabel = function(){
	return ++BeliefTest.Cell._LABEL;
}
BeliefTest.Cell.prototype.hasChanged = function(hasChanged){
	if(hasChanged!==undefined){
		this._hasChanged = hasChanged;
	}
	return this._hasChanged;
}
BeliefTest.Cell.prototype.addNeighbor = function(n){
	this._neighbors.push(n);
	this._hasChanged = true;
}
BeliefTest.Cell.prototype.neighbors = function(){
	return this._neighbors;
}
BeliefTest.Cell.prototype.addVote = function(v){
	this._votes.push(v);
}
BeliefTest.Cell.prototype.votePercent = function(){
	var count = this._votes.length;
	if(count>0){
		var sum = Code.sum(this._votes);
		return sum/count;
	}
	return 0;
}
BeliefTest.Cell.prototype.voteCount = function(){
	return this._votes.length;
}
BeliefTest.Cell.prototype.resetVotes = function(){
	this._votes = [];
}
BeliefTest.Cell.prototype.setSeed = function(pointA,pointB, scaleAtoB,angleAtoB){
	// if(this.match()){
	// 	console.log("match exists .. no seed .. todo: add to list");
	// 	return null;
	// }
	var lattice = this._lattice;
	var imageA = lattice.viewA().image();
	var imageB = lattice.viewB().image();
	var cellSize = lattice.cellSize();
	var vectorX = new V2D(1.0,0.0);
	var vectorY = new V2D(0.0,1.0);
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,scaleAtoB);
		matrix = Matrix.transform2DRotate(matrix,angleAtoB);
	vectorX = matrix.multV2DtoV2D(vectorX);
	vectorY = matrix.multV2DtoV2D(vectorY);
	// affine transform
	// cellSize*0.25
	var optimum = R3D.optimumAffineTransform(imageA,pointA, imageB,pointB, vectorX,vectorY, cellSize, 1,0.1,0.1);
	// var u = new V2D(0,0);
	// var x = new V2D(1,0);
	// var y = new V2D(0,1);
	// var o = optimum["O"];
	// var a = optimum["A"];
	// var b = optimum["B"];
	// var matrix = R3D.affineMatrixExact([u,x,y],[u,a,b]);
	var matrix = BeliefTest.affineFromResult(optimum);
	// reverse
	var centerA = this.center();
	var compareSize = lattice.compareSize();
	var searchSize = Math.ceil(2*cellSize);
	var best = BeliefTest.optimumLocation(imageA,centerA, imageB,pointB, compareSize,searchSize, matrix);
	var bestB = best["location"];
	// TODO : now find optimal transform at center location
		vectorX = matrix.multV2DtoV2D(new V2D(1,0));
		vectorY = matrix.multV2DtoV2D(new V2D(0,1));
		var optimum = R3D.optimumAffineTransform(imageA,centerA, imageB,bestB, vectorX,vectorY, compareSize, 0);
		var matrix = BeliefTest.affineFromResult(optimum);
	
	// make match
	var cell = this;
	var match = lattice.newMatchFrom(cell, centerA, bestB, matrix);
	if(lattice.matchValidation(cell,match)){
		cell.addPutativeMatch(match);
	}
}
BeliefTest.Cell.prototype.center = function(center){
	if(center!==undefined){
		this._center = center;
	}
	return this._center;
}

BeliefTest.Cell.prototype.label = function(label){
	if(label!==undefined){
		this._label = label;
	}
	return this._label;
}
BeliefTest.Cell.prototype.addPutativeMatch = function(match){
	this._putativeMatches.push(match);
}
BeliefTest.Cell.prototype.applyBestMatch = function(match){
	var putatives = this._putativeMatches;
	if(putatives.length>0){
		// TODO: pick best score within constraints
		// ordering constraints
		this._match = putatives[0];
		Code.emptyArray(putatives);
		this._hasChanged = true;
		return true;
	}
	return false;
}
BeliefTest.Cell.prototype.match = function(match){
	if(match!==undefined){
		this._match = match;
	}
	return this._match;
}
BeliefTest.Cell.prototype.hasMatch = function(){
	return this._match!==null;
}
BeliefTest.Cell.prototype.dropMatch = function(){
	if(this._match){
		this._match = null;
		this.resetVotes();
		return true;
	}
	return false;
}

BeliefTest.Cell.prototype.label = function(label){
	if(label!==undefined){
		this._label = label;
	}
	return this._label;
}

BeliefTest.affineFromResult = function(optimum){
	var u = new V2D(0,0);
	var x = new V2D(1,0);
	var y = new V2D(0,1);
	var o = optimum["O"];
	var a = optimum["A"];
	var b = optimum["B"];
	var matrix = R3D.affineMatrixExact([u,x,y],[u,a,b]);
	return matrix;
}

BeliefTest.XXX = 0;
BeliefTest.optimumLocation = function(imageA,pointA, imageB,pointB, needleSize,haystackRelativeSize, matrix,   show){
	// sizing
	var compareSize = 11;
	var cellScale = (needleSize/compareSize);
	var haystackSize = Math.ceil((haystackRelativeSize/needleSize)*compareSize);
	var haystackSize = Math.max(haystackSize,compareSize);
	// needle + haystack
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,cellScale,null,haystackSize,haystackSize, null);
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,cellScale,null,compareSize,compareSize, matrix);
	// find minimum of SAD:
		var scoresSAD = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
		var scoresNCC = R3D.normalizedCrossCorrelation(needle,null, haystack, true);
		var scoresMult = ImageMat.mulFloat(scoresSAD["value"],scoresNCC["value"]);
		var scores = {
			"width": scoresSAD["width"],
			"height": scoresSAD["height"],
			"value": scoresMult
		}
		// scores = scoresNCC;
		scores = scoresSAD;
	var values = scores.value;
	var valueWidth = scores.width;
	var valueHeight = scores.height;
	var info = Code.infoArray(values);
	var index = info["indexMin"];
	var zLoc = values[index];
	var xLoc = index % valueWidth;
	var yLoc = (index/valueWidth) | 0;
	var peak = new V3D(xLoc,yLoc,zLoc);
	var p = new V2D(pointB.x - (valueWidth*0.5)*cellScale + peak.x*cellScale, pointB.y - (valueHeight*0.5)*cellScale + peak.y*cellScale);

if(show){
	var sca = 4.0;
var iii = needle;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(210,400);
GLOBALSTAGE.addChild(d);

var iii = haystack;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10,400);
GLOBALSTAGE.addChild(d);

var values = ImageMat.getNormalFloat01(values);
var heat = ImageMat.heatImage(values, valueWidth, valueHeight, true);
var img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), heat.width(),heat.height());
var d = new DOImage(img);
d.graphics().alpha(0.5);
d.matrix().scale(sca);
d.matrix().translate(10,400);
	d.matrix().translate(Math.floor(compareSize*0.5)*sca,Math.floor(compareSize*0.5)*sca);
GLOBALSTAGE.addChild(d);
}

	return {"location":p, "score":peak.z};
}




/// --------------------------------------------------------------------------------------------------------
BeliefTest.Match = function(){
	this._pointA = null;
	this._pointB = null;
	this._affine = null;
	this._scoreSAD = null;
	this._scoreNCC = null;
	this._vectorSiftScore = null;
	this._vectorSadScore = null;
	this._x = null;
}
BeliefTest.Match.prototype.pointA = function(pointA){
	if(pointA!==undefined){
		this._pointA = pointA;
	}
	return this._pointA;
}
BeliefTest.Match.prototype.pointB = function(pointB){
	if(pointB!==undefined){
		this._pointB = pointB;
	}
	return this._pointB;
}
BeliefTest.Match.prototype.affine = function(affine){
	if(affine!==undefined){
		this._affine = affine;
	}
	return this._affine;
}
BeliefTest.Match.prototype.scoreNCC = function(scoreNCC){
	if(scoreNCC!==undefined){
		this._scoreNCC = scoreNCC;
	}
	return this._scoreNCC;
}
BeliefTest.Match.prototype.scoreSAD = function(scoreSAD){
	if(scoreSAD!==undefined){
		this._scoreSAD = scoreSAD;
	}
	return this._scoreSAD;
}
BeliefTest.Match.prototype.x = function(point){
	
}
BeliefTest.Match.prototype.x = function(){
	
}

/// --------------------------------------------------------------------------------------------------------
BeliefTest.Lattice = function(viewA,viewB){
	this._viewA = null;
	this._viewB = null;
	this._graph = null;
	this._cells = null;
	this.viewA(viewA);
	this.viewB(viewB);
	this.generateGraph();
}
BeliefTest.Lattice.prototype.generateGraph = function(){
	if(!this._viewA || !this._viewA.image()){
		return;
	}
	var viewWidth = this._viewA.image().width();
	var viewHeight = this._viewA.image().height();
	//var cellSize = 25;
	var cellSize = 11;
	var compareSize = Math.floor(cellSize*1.5);
	if(compareSize%2==0){ // keep odd
		compareSize -= 1;
	}
	// compareSize = Math.round(cellSize*0.5);
	// compareSize = cellSize;
	compareSize = cellSize + 2;
	var cellCountI = Math.floor(viewWidth/cellSize);
	var cellCountJ = Math.floor(viewHeight/cellSize);
	var cellCount = cellCountI*cellCountJ;
	this._cellSize = cellSize;
	this._compareSize = compareSize;
	this._cellCountX = cellCountI;
	this._cellCountY = cellCountJ;
	// var graph = new Graph();
	var cells = Code.newArrayNulls(cellCount);
	// console.log("LATTICE SIZE: "+cellCountI+"x"+cellCountJ);
	// create cells
	for(var j=0; j<cellCountJ; ++j){
		for(var i=0; i<cellCountI; ++i){
			//var vertex = graph.addVertex();
			var center = new V2D( (i+0.5)*cellSize, (j+0.5)*cellSize );
			var cell = new BeliefTest.Cell(this, i,j, center);
			cells[j*cellCountI+i] = cell;
		}
	}
	// add neighbors
	for(var j=0; j<cellCountJ; ++j){
		for(var i=0; i<cellCountI; ++i){
			var cell = cells[j*cellCountI+i];
			var c;
			for(var jj=-1; jj<=1; ++jj){
				for(var ii=-1; ii<=1; ++ii){
					var jjj = jj + j;
					var iii = ii + i;
					if(jjj==j && iii==i){
						continue;
					}
					if(jjj>=0 && jjj<cellCountJ && iii>=0 && iii<cellCountI){
						c = cells[jjj*cellCountI+iii];
						if(c==cell){
							console.log(i,j,iii,jjj)
							console.log(cell);
							console.log(c);
							throw "EQUAL"
						}
						cell.addNeighbor(c);
					}
				}
			}
		}
	}
	// this._graph = graph;
	this._cells = cells;
	// console.log(cells);
}
BeliefTest.Lattice.prototype.newMatchFrom = function(cell, pointA, pointB, matrix){
	var lattice = this;//cell.lattice();
	var compareSize = lattice.compareSize();
	var imageA = lattice.viewA().image();
	var imageB = lattice.viewB().image();
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, null);
	var scoreNCC = R3D.normalizedCrossCorrelation(needle,null,haystack,true);
		scoreNCC = scoreNCC["value"][0];
	var scoreSAD = R3D.searchNeedleHaystackImageFlat(needle,null,haystack);
		scoreSAD = scoreSAD["value"][0];

	var match = new BeliefTest.Match();
		match.pointA(pointA);
		match.pointB(pointB);
		match.affine(matrix);
		match.scoreNCC(scoreNCC);
		match.scoreSAD(scoreSAD);
	return match;
}
BeliefTest.Lattice.prototype.matchValidation = function(cell, match){
	// forward / reverse consistency

	// ordering constraints
	var scoreSAD = match.scoreSAD();
	if(scoreSAD>0.525){
		return false;
	}
	var scoreNCC = match.scoreNCC();
	if(scoreNCC>0.525){
		return false;
	}
	/*
		relative path costs
		uniqueness
		F error
	*/
	return true;
}
BeliefTest.Lattice.prototype.cellSize = function(){
	return this._cellSize;
}
BeliefTest.Lattice.prototype.compareSize = function(){
	return this._compareSize;
}
BeliefTest.Lattice.prototype.viewA = function(viewA){
	if(viewA!==undefined){
		this._viewA = viewA;
	}
	return this._viewA;
}
BeliefTest.Lattice.prototype.viewB = function(viewB){
	if(viewB!==undefined){
		this._viewB = viewB;
	}
	return this._viewB;
}
BeliefTest.Lattice.prototype.indexFromColRow = function(i,j){
	if(0<=i & i<=this._cellCountX && 0<=j & j<=this._cellCountY){
		var index = j*this._cellCountX + i;
		return index;
	}
}
BeliefTest.Lattice.prototype.indexFromLocation = function(x,y){
	var i = Math.floor(x/this._cellSize);
	var j = Math.floor(y/this._cellSize);
	return this.indexFromColRow(i,j);
}
BeliefTest.Lattice.prototype.cellFromPoint = function(point){
	var index = this.indexFromLocation(point.x,point.y);
	if(index===null){
		return null;
	}
	var cell = this._cells[index];
	return cell;
}
BeliefTest.Lattice.prototype.cellFromColRow = function(i,j){
	var index = this.indexFromColRow(i,j);
	if(index===null){
		return null;
	}
	var cell = this._cells[index];
	return cell;
}
BeliefTest.Lattice.prototype.forEachCell = function(fxn){
	var cells = this._cells;
	var cellCountI = this._cellCountX;
	var cellCountJ = this._cellCountY;
	for(var j=0; j<cellCountJ; ++j){
		for(var i=0; i<cellCountI; ++i){
			var index = j*cellCountI+i;
			var cell = cells[index];
			fxn(cell, i, j, index);
		}
	}
}
BeliefTest.Lattice.prototype.cellsChooseMatch = function(){
	this.forEachCell(function(cell, i, j, index){
		cell.applyBestMatch();
	});
}
BeliefTest.Lattice.prototype.iteration = function(e){
	// console.log("TODO");
	var lattice = this;
	var cellSize = this._cellSize;
	var found = false;
	var viewA = this.viewA();
	var viewB = this.viewB();
	var imageA = viewA.image();
	var imageB = viewB.image();
	var ccc = 0;
var compareN = -1;
	this.forEachCell(function(cell, i, j, index){
		if(!found){
			var hasChanged = cell.hasChanged();
			var match = cell.match();
			if(hasChanged && match){
				// if(ccc==2){
				// console.log("PROCESS: "+i+","+j);
				var neighbors = cell.neighbors();
				var cellCenter = cell.center();
				for(var n=0; n<neighbors.length; ++n){
					// only create new matches for cells without matches
					var neighbor = neighbors[n];
					if(neighbor.match()){
						continue;
					}
					// if(n!=7){
					// 	continue;
					// }
var show = n==compareN;
					
					var neighborCenter = neighbor.center();
					var matrix = match.affine();
					//var dirA = V2D.sub(cell.center(),n.center());
					var pointA = match.pointA();
					var pointB = match.pointB();
					var dirA = V2D.sub(neighborCenter,cellCenter);
					// console.log(dirA+"");
					var dirB = matrix.multV2DtoV2D(dirA);
					// console.log(dirB+"");
					var predictB = V2D.add(pointB,dirB);
					// find expected location of neighbor based on 
					var inverse = Matrix.inverse(matrix);
					// move point b around till it fits to point a
					

					//var optimumLocation = R3D.optimumTranslation(imageB,predictB, imageA,neighborCenter, vectorX,vectorY, cellSize, 1,0.1,0.1);
					var optimumLocation = BeliefTest.optimumLocation(imageA,neighborCenter, imageB,predictB, cellSize,cellSize*4, matrix,   show);
					var bestB = optimumLocation["location"];
					// TODO: ANY PART IS OUTSIDE IMAGE B
					if(bestB.x<=0 || bestB.x>=imageB.width() || bestB.y<=0 || bestB.y>=imageB.height()){
						console.log("OUTSIDE");
						return;
					}

					// optimum transform
					var vectorX = inverse.multV2DtoV2D(new V2D(1,0));
					var vectorY = inverse.multV2DtoV2D(new V2D(0,1));
					var optimum = R3D.optimumAffineTransform(imageB,bestB, imageA,neighborCenter, vectorX,vectorY, cellSize, cellSize*0.5,0.25,0.25);
						bestB = V2D.add(optimum["O"], bestB);
					var bestInverse = BeliefTest.affineFromResult(optimum);
					var bestMatrix = Matrix.inverse(bestInverse);
					
					// show it all
					
// if(false){
if(show){
					// neighbor relationship
					var d = new DO();
					d.graphics().setLine(1.0,0x9900FF33);
					d.graphics().beginPath();
					d.graphics().moveTo(cellCenter.x,cellCenter.y);
					d.graphics().lineTo(neighborCenter.x,neighborCenter.y);
					d.graphics().strokeLine();
					d.graphics().endPath();
					GLOBALSTAGE.addChild(d);

					// me
					var d = new DO();
					d.graphics().setLine(2.0,0x990033FF);
					d.graphics().beginPath();
					d.graphics().drawCircle(imageA.width()+pointB.x,0+pointB.y, 4.0);
					d.graphics().strokeLine();
					d.graphics().endPath();
					GLOBALSTAGE.addChild(d);

					// predicted
					var d = new DO();
					d.graphics().setLine(2.0,0x9900FF33);
					d.graphics().beginPath();
					d.graphics().drawCircle(imageA.width()+predictB.x,0+predictB.y, 5.0);
					d.graphics().strokeLine();
					d.graphics().endPath();
					GLOBALSTAGE.addChild(d);

					// resulted
					var d = new DO();
					d.graphics().setLine(1.0,0x99FF3300);
					d.graphics().beginPath();
					d.graphics().drawCircle(imageA.width()+bestB.x,0+bestB.y, 7.0);
					d.graphics().strokeLine();
					d.graphics().endPath();
					GLOBALSTAGE.addChild(d);

					// predicted area
					var bImage = imageB.extractRectFromFloatImage(predictB.x,predictB.y,1.0,null,cellSize*2,cellSize*2, null);
					// neighbor
					var nImage = imageA.extractRectFromFloatImage(neighborCenter.x,neighborCenter.y,1.0,null,cellSize,cellSize, null);
					// result
					var oImage = imageB.extractRectFromFloatImage(bestB.x,bestB.y,1.0,null,cellSize,cellSize, bestInverse);

					var iii = bImage;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(3.0);
					d.matrix().translate(1200, 10);
					GLOBALSTAGE.addChild(d);


					var iii = nImage;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(3.0);
					d.matrix().translate(1200, 200);
					GLOBALSTAGE.addChild(d);


					var iii = oImage;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(3.0);
					d.matrix().translate(1400, 200);
					GLOBALSTAGE.addChild(d);





}
					// console.log("DIFF: "+V2D.distance(predictB,bestB));
					// console.log(" - "+neighborCenter);


					// console.log("    > "+neighbor._col+","+neighbor._row);
					var match = lattice.newMatchFrom(neighbor, neighborCenter, bestB, bestMatrix);
					if(lattice.matchValidation(cell,match)){
						// console.log(" - "+neighborCenter);
						neighbor.addPutativeMatch(match);
					}

					// found = true;
					// break;
				}
				// }
				// ++ccc;
			}
		}
	});
	
	// reset ...
	// this.forEachCell(function(cell, i, j, index){
	// 	var hasChanged = cell.hasChanged();
	// 	if(hasChanged){
	// 		cell.hasChanged(false);
	// 	}
	// });

	// finish expansion
	lattice.cellsChooseMatch();


	// process belief, reset votes
	var smallerFirst = function(a,b){
		return a<b ? -1 : 1;
	}
	var count = 0;
	lattice.forEachCell(function(cell, i, j, index){
		if(true){
			cell.resetVotes();
			var match = cell.match();
			if(match){
				// console.log(count+"  CELL: "+i+","+j+" @ "+cell.center());
				// console.log("               "+match.pointA());
				var neighbors = cell.neighbors();
				var cellCenter = cell.center();
				// hists:
				var compareAffine = [];
				var compareTranslate = [];
				var compareNCC = [];
				var compareSAD = [];
				for(var n=0; n<neighbors.length; ++n){
					var neighbor = neighbors[n];
					var neighborMatch = neighbor.match();
					if(neighborMatch){
						// console.log("process match");

						// affine compare
						var compare = BeliefTest.affineCompare(match.affine(), neighborMatch.affine());
							compare = compare["error"];
						compareAffine.push(compare);

						// translation compare
						var compare = BeliefTest.translationCompare(cell, match, neighbor, neighborMatch);
							compare = compare["error"];

						compareTranslate.push(compare);
						//console.log(" "+n+"compare: "+compare);

						// forward-backward-compare - uniticity

						// ordering compare 

						// ncc compare
						// var compare = BeliefTest.NCCCompare(match, neighborMatch);
						// 	compare = compare["error"];
						// compareNCC.push(compare);
						compareNCC.push(neighborMatch.scoreNCC());

						// sad compare
						// var compare = BeliefTest.SADCompare(match, neighborMatch);
						// 	compare = compare["error"];
						// compareSAD.push(compare);
						compareSAD.push(neighborMatch.scoreSAD());

						// ...
					}
				}
				// can include self in some estimates
				compareNCC.push(match.scoreNCC());
				compareSAD.push(match.scoreSAD());

				// sort for half-means
				var halfMeanPercent = 0.5;
				compareAffine.sort(smallerFirst);
				compareTranslate.sort(smallerFirst);
				compareNCC.sort(smallerFirst);
				compareSAD.sort(smallerFirst);

				var meanAffine = Code.mean(compareAffine);
				var stdAffine = Code.stdDev(compareAffine,meanAffine);
				var meanTranslate = Code.mean(compareTranslate);
				var stdTranslate = Code.stdDev(compareTranslate,meanTranslate);
				// console.log(Math.ceil(compareAffine.length*halfMeanPercent));
				var meanHalfAffine = Code.mean(compareAffine,null,Math.ceil(compareAffine.length*halfMeanPercent));
				
				var meanNCC = Code.mean(compareNCC);
				var stdNCC = Code.stdDev(compareNCC,meanNCC);
				var meanSAD = Code.mean(compareSAD);
				var stdSAD = Code.stdDev(compareSAD,meanSAD);



				// one-sided offset
				// var meanHalfAffine = Code.mean(compareAffine, null, 10);

				// var hist = Code.histogram(compareSAD, null, 10);
				// var hist = Code.histogram(compareNCC, null, 10);
				var hist = Code.histogram(compareAffine, null, 10);
				// var hist = Code.histogram(compareTranslate, null, 10);
				var infoAffine = Code.infoArray(compareAffine);

// MIRROR:
console.log("stdAffine: "+stdAffine);
// meanAffine = Code.meanHalfNormal(compareAffine);
// stdAffine = Code.stdDevHalfNormal(compareAffine, meanAffine);
// Code.stdDevHalfNormal(compareAffine, Code.min(compareAffine));
meanAffine = Code.min(compareAffine);
stdAffine = Code.stdDev(compareAffine,meanAffine);
// stdAffine = Code.stdDevHalfNormal(compareAffine, meanAffine);
// console.log(" ... ")
// var mirrorAffine = Code.mirrorArray(compareAffine);
// var doubleAffine = Code.arrayPushArray(mirrorAffine,compareAffine);
// console.log(doubleAffine);
/*
var meanAffine = Code.mean(doubleAffine);
var stdAffine = Code.stdDev(doubleAffine,meanAffine);
*/
console.log("count: "+compareAffine.length+" @ "+meanAffine+" "+" +/- "+stdAffine+"  : ["+infoAffine["min"]+","+infoAffine["max"]+"] ("+infoAffine["range"]+") ");
				//console.log("count: "+compareAffine.length+" @ "+meanAffine+" @ ("+meanHalfAffine+") "+" +/- "+stdAffine+" : ["+infoAffine["min"]+","+infoAffine["max"]+"] ("+infoAffine["range"]+") ");
				// console.log("count: "+compareSAD.length+" @ "+meanSAD+" +/- "+stdSAD);
				Code.printHistogram(hist["histogram"]);
/*
cutoff:
min + sigma / (mean/halfmean) ---- drops too many in equal-distribution

halfmean + sigma ---- not discriminating

min + (mean-halfmean)*2 ---- 



// different distributions:
exponential ?

half-normal ----- > sigma multiplier between 1 & 2 .... like 1.414 ~ 1.6
50.0% = 0.68
68.0% = 1.00
84.1% = 1.414
86.0% = 1.50
90.0% = 1.65
95.0% = 2.00
99.7% = 3.00
*/

				cell._compareNCC = {
					"list": compareNCC,
					"mean": meanNCC,
					"std": stdNCC,
				};
				cell._compareSAD = {
					"list": compareSAD,
					"mean": meanSAD,
					"std": stdSAD,
				};
				cell._compareAffine = {
					"list": compareAffine,
					"mean": meanAffine,
					"std": stdAffine,
				};
				cell._compareTranslate = {
					"list": compareTranslate,
					"mean": meanTranslate,
					"std": stdTranslate,
				};
				// console.log("     compare: "+compareAffine);
				// console.log("     compare: "+compareTranslate);
				// console.log("     compare: "+compareNCC);
				// console.log("     compare: "+compareSAD);
				++count;


				// store the data internally

				// calculate MY expected values & error
			}
		}
	});

	// get neighbor's expected values & vote
	lattice.forEachCell(function(cell, i, j, index){
	});

	var minimumVotePercentKeep = 0.50;
	// drop predicted outliers
	lattice.forEachCell(function(cell, i, j, index){
		var match = cell.match();
		if(match){
			var voteTotal = cell.voteCount();
			var votePercent = cell.votePercent();
			if(voteTotal>2){ // minimum = self + 2 others
				if(votePercent>minimumVotePercentKeep){
					// keep
				}else{
					// drop
					cell.dropMatch();
				}
			}
		}
	});
/*
	// EXPAND / DILATE
	for each cell
		for each neighbor
			if neighbor does not have a 
				find best neighbor match
				append match to neighbor putatives
	for each cell
		if has putative matches
			pick best putative
	
	// PROCESS BELIEF
	for each cell
		A) GET VALUES FROM NEIGHBORS
		   CALCULATE EXPECTED VALUE
    for each cell
		B) GET EXPECTED VALUES FROM NEIGHBORS
		   CALCULATE IF INLIER OR OUTLIER
		C) VOTE ON NEIGHBORS AS TO GOOD/BAD ESTIMATION

	// RELAX/RETRACT
	calculate globals
		- F
	for each cell
		C) DROP IF OUTLIER

	SET VALUES [when point is created]

*/
	// reset

	// STOPPING CONDITIONS ?
	/*

	*/
}
BeliefTest.affineCompare = function(matrixA, matrixB){ // error in affine transforms
	var vectorX = new V2D(1.0,0.0);
	var vectorY = new V2D(0.0,1.0);
	var vectorXA = matrixA.multV2DtoV2D(vectorX);
	var vectorYA = matrixA.multV2DtoV2D(vectorY);
	var vectorXB = matrixB.multV2DtoV2D(vectorX);
	var vectorYB = matrixB.multV2DtoV2D(vectorY);
	var diffX = V2D.sub(vectorXA,vectorXB);
	var diffY = V2D.sub(vectorYA,vectorYB);
	var error = V2D.distance(diffX,diffY);
	return {"error":error};
}
BeliefTest.translationCompare = function(cell, match, neighbor, neighborMatch){ // error in cell translations
	var before = V2D.sub(neighbor.center(), cell.center());
	var after = match.affine().multV2DtoV2D(before);
	var actual = V2D.sub(neighborMatch.pointB(), match.pointB());
	var diff = V2D.sub(after,actual);
	// console.log(diff.length()+" / "+before.length());
	var error = diff.length()/before.length();
	// var error = diff.length();
	return {"error":error};
}
BeliefTest.orderCompare = function(cell, match, neighbors, neighborMatches){ // in same direction
	//
}
BeliefTest.forwardBackwardCompare = function(cell, match, neighbors, neighborMatches){ // distances from expected location
	// 
}
BeliefTest.NCCCompare = function(match,neighborMatch){
	var error = neighborMatch.scoreNCC() - match.scoreNCC();
	// var error = match.scoreNCC();
	return {"error":error};
}
BeliefTest.SADCompare = function(match,neighborMatch){
	var error = neighborMatch.scoreSAD() - match.scoreSAD();
	return {"error":error};
}
BeliefTest.flowCompare = function(){
	//
}
BeliefTest.averageColorCompare = function(){
	//
}
BeliefTest.colorHistogramCompare = function(){
	//
}
BeliefTest.gradientCompare = function(){
	//
}
BeliefTest.patchSADCompare = function(){
	//
}
BeliefTest.patchNCCCompare = function(){
	//
}
BeliefTest.uniquenessCompare = function(){
	//
}
BeliefTest.entropyCompare = function(){
	//
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






