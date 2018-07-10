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
	// var imageLoader = new ImageLoader("./images/",["caseStudy1-0.jpg","caseStudy1-20.jpg"], this,this.handleImageLoaded,null);
	// var imageLoader = new ImageLoader("./images/",["room0.png","room0.png"], this,this.handleImageLoaded,null);
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
	}else if(e.keyCode==Keyboard.KEY_LET_P){
		this.createLabelGroups();
	}else if(e.keyCode==Keyboard.KEY_LET_Q){
		var display = this._display;
		if(display){
			display.removeAllChildren();
		}
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

/*
["caseStudy1-0.jpg","caseStudy1-20.jpg"],
230,85 => 251,102
[230,85]./[400,300] => [251,102]./[400,300]
*/
/*
matches = [{
			"fr": {"x":0.57500,"y":0.28333},
			"to": {"x":0.62750,"y":0.34000},
			"s": 1.0,
			"a": 0.0
		}];
*/

/*
// SAME:
matches = [{
			"fr": {"x":0.40,"y":0.30},
			"to": {"x":0.40,"y":0.30},
			"s": 1.0,
			"a": 0.0
		}];
*/

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
	var queue = lattice.queue();
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
		// if(true){
		if(i==9){
		// if(i<10){
// if(i==2){
		// if(i==4){
		// if(i==6){
		//if(i==17){ // table - bad
		// if(i==20){ 
// if(i==21){
// if(i==25){
// if(i==29){
//if(i==42){
// if(i==43){
//if(i==21 || i==25 || i==42){
			var cell = lattice.cellFromPoint(pointA);
			cell.addSeedMatch(pointA,pointB,scaleAtoB,angleAtoB);
			queue.push(cell);
		}
		// if(i>=10){
		// // if(i>=8){
		// 	break;
		// }
	}

	// seed choose & set among best matches
	var list = queue.toArray();
	queue.clear();
	console.log("SEED LIST");
	console.log(list);
	for(var i=0; i<list.length; ++i){
		var cell = list[i];
		cell.applyBestPutativeMatch();
	}
	//
	this.drawLattice();

//	lattice.seedIteration();

	lattice.iteration();
	
}
BeliefTest.prototype.drawLattice = function(e){ // TODO: ERROR THROWN -- likely bad looking match -- too close to neighbor ?
	if(!this._display){
		this._display = new DO();
		GLOBALSTAGE.addChild(this._display);
	}
	//var displayScale = 1.5;
	var displayScale = 1.0;
	var display = this._display;
	display.removeAllChildren();
// console.log(display._children);
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

	// show calculated cells:
	var list = lattice._wasList;
	// console.log("WAS LIST");
	// console.log(list);
	if(list){

		for(var i=0; i<list.length; ++i){
			var cell = list[i];
			var center = cell.center();
			var d = new DO();
				// d.graphics().setLine(1.0,0x9966FF99);
				d.graphics().setFill(0x6666FF99);
				// d.graphics().setFill(0xFF66FF99);
				d.graphics().beginPath();
				d.graphics().drawRect((center.x-cellSize*0.5)*displayScale, (center.y-cellSize*0.5)*displayScale, cellSize*displayScale,cellSize*displayScale);
				d.graphics().fill();
				// d.graphics().strokeLine();
				d.graphics().endPath();
				display.addChild(d);
		}
	}
	
/*
	// show field -- optical flow
	for(var j=0; j<countY; ++j){
		for(var i=0; i<countX; ++i){
			var cell = lattice.cellFromColRow(i,j);
			var match = cell.match();
			if(match){
				// console.log("DRAW")
				// crate vector
				var pA = match.pointA();
				var pB = match.pointB();
				var dAB = V2D.sub(pB,pA);
				// console.log(dAB.length());
				// draw arrow
				var d = new DO();
				d.graphics().setLine(1.0,0x99009900);
				d.graphics().beginPath();
				d.graphics().moveTo(0,0);
				d.graphics().lineTo(dAB.x,dAB.y);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(pA.x,pA.y);
				d.matrix().translate(imageAWidth+imageBWidth,0);
				display.addChild(d);

			}
		}
	}
*/
/*
	// show labels
	var colors = [];
	for(var j=0; j<countY; ++j){
		for(var i=0; i<countX; ++i){
			var cell = lattice.cellFromColRow(i,j);
			var match = cell.match();
			if(match){
				var label = cell.label();
				if(label<0){
					continue;
				}
				while(label>=colors.length){
					var color = Code.getColARGBFromFloat(1.0, Math.random(),Math.random(),Math.random());
					colors.push( color );
				}
				var color = colors[label];
				// console.log(label,color);
				// console.log("DRAW")
				// crate vector
				// var pA = match.pointA();
				// var pB = match.pointB();
				// var dAB = V2D.sub(pB,pA);
				// console.log(dAB.length());
				// draw arrow
				var d = new DO();
				// d.graphics().setLine(1.0,0x99000099);
				d.graphics().setFill(color);
				d.graphics().beginPath();
				d.graphics().drawRect(i*cellSize*displayScale,j*cellSize*displayScale, cellSize*displayScale,cellSize*displayScale);
				d.graphics().fill();
				// d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(imageAWidth+imageBWidth+imageBWidth,0);
				// d.matrix().translate(imageAWidth+imageBWidth,0);
				display.addChild(d);

			}
		}
	}
*/
/*
	// show depths
	var depths = [];
	var minDistance = null;
	var maxDistance = null;
	for(var j=0; j<countY; ++j){
		for(var i=0; i<countX; ++i){
			var cell = lattice.cellFromColRow(i,j);
			var match = cell.match();
			if(match){
				var pointA = match.pointA();
				var pointB = match.pointB();
				var dirAB = V2D.sub(pointB,pointA);
				var distance = dirAB.length();
				if(minDistance==null || distance<minDistance){
					minDistance = distance;
				}
				if(maxDistance==null || distance>maxDistance){
					maxDistance = distance;
				}
				depths.push([pointA,distance]);
			}
		}
	}
	if(maxDistance && minDistance){
		var offDX = imageAWidth+imageBWidth+imageBWidth;
		var offDY = 0;
		var d = new DO();
		d.graphics().setFill(0xFF330000);
		d.graphics().beginPath();
		d.graphics().drawRect(0,0, imageAWidth,imageAHeight);
		d.graphics().fill();
		d.graphics().endPath();
		d.matrix().translate(offDX,offDY);
		display.addChild(d);

		var rangeDistance = maxDistance-minDistance;
		for(var i=0; i<depths.length; ++i){
			var depth = depths[i];
			var point = depth[0];
			var distance = depth[1];
			var rel = (distance-minDistance)/rangeDistance;
			var col = Code.getColARGBFromFloat(1.0, rel,rel,rel);
			var d = new DO();
			d.graphics().setFill(col);
			d.graphics().beginPath();
			// d.graphics().drawRect(cellSize*displayScale,j*cellSize*displayScale, cellSize*displayScale,cellSize*displayScale);
			d.graphics().drawCircle(point.x,point.y, cellSize);
			d.graphics().fill();
			d.graphics().endPath();
			d.matrix().translate(offDX,offDY);
			// d.matrix().translate(imageAWidth+imageBWidth,0);
			display.addChild(d);
		}
	}
*/

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

BeliefTest.prototype.createLabelGroups = function(e){
	var lattice = this._lattice;
	// var fxnB = function(neighbor, index){
	// reset all labels
	lattice.forEachCell(function(cell, i, j, index){
		cell.label(-1);
	});
	BeliefTest.Cell.resetLabel();

	lattice.forEachCell(function(cell, i, j, index){
		var label = cell.label();
		var match = cell.match();
		if(match && label<0){
			// console.log(label);
			label = BeliefTest.Cell.nextLabel();
			console.log("START ..."+label);
			var queue = []; // TODO: UNIQUE QUEUE
			queue.push(cell);
			var iterations = 0;
			while(queue.length>0){
				if(iterations%100==0){
					// console.log("iterations: "+iterations);
				}
				var c = queue.shift();
				var indexC = c.id();
				if(c.label()<0){ // don't redo
					c.label(label);
					c.forEachNeighbor8(function(n,indexN){
						if(n.match() && n.label()<0){
							var voteCN = c._votes[indexN];
							var voteNC = n._votes[indexC];
							// console.log(" exists: "+voteCN+" | "+voteNC);
							if(voteCN==1 && voteNC==1){
								queue.push(n);
							}
						}
					});
				}
				++iterations;
			}
			console.log(" total iterations: "+iterations);
		}
	});
	// console.log("out label: "+label);
	/*
	
	lattice.forEachCell(function(cell, i, j, index){
		var label = cell.label();

		cell.forEachNeighbor(){

		}
		if(label<-1){
			label = BeliefTest.Cell.nextLabel();
		}
		cell.label(label);
	});
	*/
	// for(var j=0; j<countY; ++j){
	// 	for(var i=0; i<countX; ++i){
	// 		var cell = lattice.cellFromColRow(i,j);
	// 		// good match ?
	// 		var match = cell.match();
	// 		if(match){
	// 			//
	// 		}
	// 	}
	// }
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
		this._imageFlat = image;
		// generate other fields as necessary
		/*
		var gradient = image.gradientVector();
		console.log(gradient);
		this._imageGradient = gradient;
		*/
	}
	return this._imageFlat;
}
BeliefTest.View.prototype.gradient = function(gradient){
	return this._imageGradient;
}
BeliefTest.View.prototype.corners = function(corners){
	return this._imageCorners;
}
/// --------------------------------------------------------------------------------------------------------
BeliefTest.Cell = function(lattice, i,j, center){
	this._id = (BeliefTest.Cell._ID++)+""; // string lookup id
	this._putativeMatches = [];
	this._label = null;
	this._lattice = lattice;
	this._col = i;
	this._row = j;
	this._center = center.copy();
	this._match = null;
	this._previousMatch = null;
	this._neighbors4 = {};
	this._neighbors8 = {};
	this._paths = {};
	this._votes = {};
	this._metrics = null;
}
BeliefTest.Cell._ID = 0;
BeliefTest.Cell._LABEL = 0;
BeliefTest.Cell.resetLabel = function(){
	BeliefTest.Cell._LABEL = 0;
}
BeliefTest.Cell.nextLabel = function(){
	return BeliefTest.Cell._LABEL++;
}
BeliefTest.Cell.prototype.id = function(){
	return this._id;
}
BeliefTest.Cell.prototype.attempts = function(attempts){
	if(attempts!==undefined){
		this._attempts = attempts;
	}
	return this._attempts;
}
BeliefTest.Cell.prototype.addNeighbor4 = function(n){
	var index = n.id();
	this._neighbors4[index] = n;
	this._paths[index] = null;
}
BeliefTest.Cell.prototype.addNeighbor8 = function(n){
	var index = n.id();
	this._neighbors8[index] = n;
	this._votes[index] = null;
}
BeliefTest.Cell.prototype.neighbors4 = function(){
	return this._neighbors4;
}
BeliefTest.Cell.prototype.neighbors8 = function(){
	return this._neighbors8;
}
BeliefTest.Cell.prototype.addVote = function(cell, v){
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
BeliefTest.Cell.prototype.addSeedMatch = function(pointA,pointB, scaleAtoB,angleAtoB){
	var cell = this;
	var lattice = cell._lattice;
	var match = lattice.matchFromSettings(cell, pointA,pointB,scaleAtoB,angleAtoB);
	console.log("got a match",match);
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
BeliefTest.Cell.prototype.applyBestPutativeMatch = function(match){
	var matches = this._putativeMatches;
	console.log(matches)
	var lattice = this._lattice;
	var queue = lattice.queue();
	if(matches.length>0){
		var bestMatch = null;
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			if(bestMatch==null || match.scoreNCC()<bestMatch.scoreNCC()){ // criteria
				bestMatch = match;
			}
		}
		console.log("bestMatch: "+bestMatch);
		// choose best putative match
		if(bestMatch){
			console.log(" ... add match -> pair : "+bestMatch.scoreNCC()+" & "+bestMatch.scoreSAD());
			Code.emptyArray(matches);
			// compute best 4-neighbor matches
			this.setMatch(bestMatch);
			var cell = this;
			// add cell to Q [this is to update the seed's metrics]
			queue.push(cell);
			// add 4-neighbors to Q
			cell.forEachNeighbor4(function(neighbor,index){
				queue.push(neighbor);
			});
			return true;
		}
	}
	console.log("NO");
	return false;
}
BeliefTest.Cell.prototype.revertMatch = function(){
	this._match = this._previousMatch;
}
BeliefTest.Cell.prototype.match = function(match){
	if(match!==undefined){
		this._match = match;
	}
	return this._match;
}
BeliefTest.Cell.prototype.previousMatch = function(previousMatch){
	if(previousMatch!==undefined){
		this._previousMatch = previousMatch;
	}
	return this._previousMatch;
}
BeliefTest.Cell.prototype.forEachNeighbor8 = function(fxn){
	var cell = this;
	var neighbors = cell._neighbors8;
	var neighborKeys = Code.keys(neighbors);
	for(var i=0; i<neighborKeys.length; ++i){
		var index = neighborKeys[i];
		var neighbor = neighbors[index];
		fxn(neighbor, index);
	}
}
BeliefTest.Cell.prototype.forEachNeighbor4 = function(fxn){
	var cell = this;
	var neighbors = cell._neighbors4;
	var neighborKeys = Code.keys(neighbors);
	for(var i=0; i<neighborKeys.length; ++i){
		var index = neighborKeys[i];
		var neighbor = neighbors[index];
		fxn(neighbor, index);
	}
}
BeliefTest.Cell.prototype.setMatch = function(newMatch){
	// console.log("setMatch",newMatch);
	var cell = this;
	cell._previousMatch = cell._match;
	cell._match = newMatch;
	var lattice = cell._lattice;
	var paths = cell._paths;
	var neighbors = cell._neighbors4;
	var neighborKeys = Code.keys(neighbors);
	var queue = lattice.queue();
	// update / check
	// queue.push(cell);
	// cell.updateMetrics();

	for(var i=0; i<neighborKeys.length; ++i){
		var index = neighborKeys[i];
		var neighbor = neighbors[index];
		// console.log("CENTERS: "+cell.center()+" | "+neighbor.center()+" & "+newMatch.pointA());
		var pathMatch = lattice.bestMatchFromSettings(newMatch, cell, neighbor);
		// console.log("  "+i+" => "+pathMatch.scorePathNCC()+" & "+pathMatch.scorePathSAD());//+"   &&& "+pathMatch.s);
		if(lattice.matchValidation(cell,pathMatch)){
			paths[index] = pathMatch;
		}else{
			paths[index] = null;
		}
		// update / check
		// queue.push(neighbor);
		//neighbor.updateMetrics();
	}
}
BeliefTest.Cell.prototype.hasMatch = function(){
	return this._match!==null;
}
BeliefTest.Cell.prototype.dropMatch = function(){
	if(this._match){
		var lattice = this._lattice;
		var neighbors = this._neighbors8;
		var neighborKeys = Code.keys(neighbors);
		var queue = lattice.queue();
		this._previousMatch = this._match;
		this._match = null;
		// KEEPING THESE FOR REVERTING
		// for(var i=0; i<neighborKeys.length; ++i){
		// 	var index = neighborKeys[i];
		// 	this._paths[index] = null;
		// 	this._votes[index] = null;
		// 	this._metrics = null;
		// }
		// update / check
//		queue.push(this);
		for(var i=0; i<neighborKeys.length; ++i){
			var index = neighborKeys[i];
			var neighbor = neighbors[index];
			// update / check
			neighbor.updateMetrics();
		}

		return true;
	}
	return false;
}
BeliefTest.Cell.prototype.voteInfo = function(){
	var cell = this;
	var lattice = cell._lattice;
	var neighbors = cell._neighbors8;
	var neighborKeys = Code.keys(neighbors);
	var count = 0;
	var percent = 0;
	var cellID = cell.id();
	for(var i=0; i<neighborKeys.length; ++i){
		var index = neighborKeys[i];
		var neighbor = neighbors[index];
		var vote = neighbor._votes[cellID];
		if(vote===null){
			// N/A
		}else{
			count +=1;
			percent += vote;
		}
	}
	if(count>0){
		percent /= count;
	}
	return {"count":count, "percent":percent};
}
BeliefTest.Cell.prototype.label = function(label){
	if(label!==undefined){
		this._label = label;
	}
	return this._label;
}
BeliefTest.Cell.prototype.updateMetrics = function(){
	var match = this.match();
	if(!match){
		return;
	}
	var cell = this;
	var neighbors = cell._neighbors8;
	var neighborKeys = Code.keys(neighbors);
	var metricAffine = [];
	var metricTranslate = [];
	var metricNCC = [];
	var metricSAD = [];
	var metricPathNCC = [];
	var metricPathSAD = [];
	var metricRelativePathNCC = [];
	var metricRelativePathSAD = [];
	// append metrics
	metricNCC.push(match.scoreNCC());
	metricSAD.push(match.scoreSAD());
	metricPathNCC.push(match.scorePathNCC());
	metricPathSAD.push(match.scorePathSAD());
	metricRelativePathNCC.push(match.scoreRelativePathNCC());
	metricRelativePathSAD.push(match.scoreRelativePathSAD());
	for(var i=0; i<neighborKeys.length; ++i){
		var index = neighborKeys[i];
		var neighbor = neighbors[index];
		var neighborMatch = neighbor.match();
		if(neighborMatch){
			// affine compare
			var compare = BeliefTest.affineCompare(match.affine(), neighborMatch.affine());
				compare = compare["error"];
			metricAffine.push(compare);
			// translation compare
			var compare = BeliefTest.translationCompare(cell, match, neighbor, neighborMatch);
				compare = compare["error"];
			metricTranslate.push(compare);
			// ncc compare
			metricNCC.push(neighborMatch.scoreNCC());
			// sad compare
			metricSAD.push(neighborMatch.scoreSAD());
			// pair cost NCC
			metricPathNCC.push(neighborMatch.scorePathNCC());
			// pair cost SAD
			metricPathSAD.push(neighborMatch.scorePathSAD());
			// relative cost NCC
			metricRelativePathNCC.push(neighborMatch.scoreRelativePathNCC());
			// relative cost SAD
			metricRelativePathSAD.push(neighborMatch.scoreRelativePathSAD());
		} // TODO: OTHERS = ordering compare, group vs single affine compare, ordering 'spread' --- angles are loosened/tightened?, forward-backward-compare - uniticity
	}

	// console.log("METRIC AFFINE: ");
	// Code.printMatlabArray(metricAffine, "a");

	var meanAffine = Code.min(metricAffine);
	var stdAffine = Code.stdDev(metricTranslate,meanAffine);
	var meanTranslate = Code.min(metricTranslate);
	var stdTranslate = Code.stdDev(metricTranslate,meanTranslate);
	var meanNCC = Code.min(metricNCC);
	var stdNCC = Code.stdDev(metricNCC,meanNCC);
	var meanSAD = Code.min(metricSAD);
	var stdSAD = Code.stdDev(metricSAD,meanSAD);
	var meanPathNCC = Code.min(metricNCC);
	var stdPathNCC = Code.stdDev(metricPathNCC,meanPathNCC);
	var meanPathSAD = Code.min(metricPathSAD);
	var stdPathSAD = Code.stdDev(metricPathSAD,meanPathSAD);

	var meanRelativePathSAD = Code.min(metricRelativePathSAD);
	var stdRelativePathSAD = Code.stdDev(metricRelativePathSAD,meanRelativePathSAD);
	var meanRelativePathNCC = Code.min(metricRelativePathNCC);
	var stdRelativePathNCC = Code.stdDev(metricRelativePathNCC,meanRelativePathNCC);
	// group affine
	// var compareGroupAffine = lattice.groupAffineCompare(cell, match);
	var metrics = {};
	metrics["affine"] = {
		"list": metricAffine,
		"mean": meanAffine,
		"sigma": stdAffine,
	};
	metrics["trans"] = {
		"list": metricTranslate,
		"mean": meanTranslate,
		"sigma": stdTranslate,
	};
	metrics["ncc"] = {
		"list": metricNCC,
		"mean": meanNCC,
		"sigma": stdNCC,
	};
	metrics["sad"] = {
		"list": metricSAD,
		"mean": meanSAD,
		"sigma": stdSAD,
	};
	metrics["nccPath"] = {
		"list": metricPathNCC,
		"mean": meanPathNCC,
		"sigma": stdPathNCC,
	};
	metrics["sadPath"] = {
		"list": metricPathSAD,
		"mean": meanPathSAD,
		"sigma": stdPathSAD,
	};
	metrics["sadPathRelative"] = {
		"list": metricRelativePathSAD,
		"mean": meanRelativePathSAD,
		"sigma": stdRelativePathSAD,
	};
	metrics["nccPathRelative"] = {
		"list": metricRelativePathNCC,
		"mean": meanRelativePathNCC,
		"sigma": stdRelativePathNCC,
	};
	// compare._compareGroupAffine = compareGroupAffine;
	this._metrics = metrics;
	this._votes = [];
	var votes = this._votes;
	// votes from metrics
	for(var i=0; i<neighborKeys.length; ++i){
		var index = neighborKeys[i];
		var neighbor = neighbors[index];
		var neighborMatch = neighbor.match();
		if(neighborMatch){
			var vote = BeliefTest.voteFromMetric(metrics, neighborMatch, neighbor, match, cell);
			votes[index] = vote;
		}else{
			votes[index] = 0;
		}
	}
}
BeliefTest.voteFromMetric = function(metrics, neighborMatch, neighborCell, sourceMatch, sourceCell){
return 1;
	var metricAffine = metrics["affine"];
	var metricTranslate = metrics["affine"];
	var metricNCC = metrics["ncc"];
	var metricSAD = metrics["sad"];
	var metricPathNCC = metrics["nccPath"];
	var metricPathSAD = metrics["sadPath"];
	var metricRelativePathNCC = metrics["nccPathRelative"];
	var metricRelativePathSAD = metrics["sadPathRelative"];
		var meanAffine = metricAffine["mean"];
		var sigmaAffine = metricAffine["sigma"];
		var meanTranslate = metricTranslate["mean"];
		var sigmaTranslate = metricTranslate["sigma"];
		var meanSAD = metricSAD["mean"];
		var sigmaSAD = metricSAD["sigma"];
		var meanNCC = metricNCC["mean"];
		var sigmaNCC = metricNCC["sigma"];
		var meanPathSAD = metricPathSAD["mean"];
		var sigmaPathSAD = metricPathSAD["sigma"];
		var meanPathNCC = metricPathNCC["mean"];
		var sigmaPathNCC = metricPathNCC["sigma"];

		var meanRelativePathNCC = metricRelativePathNCC["mean"];
		var sigmaRelativePathNCC = metricRelativePathNCC["sigma"];
		var meanRelativePathSAD = metricRelativePathSAD["mean"];
		var sigmaRelativePathSAD = metricRelativePathSAD["sigma"];
	// var sigmaLimitAffine = 1.414;
	// var sigmaLimitTranslate = 1.414;
	var sigmaLimitAffine = 2.0;
	var sigmaLimitTranslate = 2.0;
	var sigmaLimitNCC = 2.0;
	var sigmaLimitSAD = 2.0;
	var sigmaLimitPathNCC = 3.0;
	var sigmaLimitPathSAD = 3.0;
	// var sigmaLimitPathNCC = 1.5;
	// var sigmaLimitPathSAD = 1.5;
	var sigmaLimitRelativePathNCC = 3.0;
	var sigmaLimitRelativePathSAD = 3.0;
	// var scoreAffine = neighborMatch.scoreAffine();
	// var scoreTranslate = neighborMatch.scoreTranslate();
	var compare = BeliefTest.affineCompare(sourceMatch.affine(), neighborMatch.affine());
		var scoreAffine = compare["error"];
	var compare = BeliefTest.translationCompare(sourceCell, sourceMatch, neighborCell, neighborMatch);
		var scoreTranslate = compare["error"];
	var scoreNCC = neighborMatch.scoreNCC();
	var scoreSAD = neighborMatch.scoreSAD();
	var scorePathNCC = neighborMatch.scorePathNCC();
	var scorePathSAD = neighborMatch.scorePathSAD();
	var scoreRelativePathNCC = neighborMatch.scoreRelativePathNCC();
	var scoreRelativePathSAD = neighborMatch.scoreRelativePathSAD();
	// crossing
	var keepAffine = true; // var keepAffine = scoreAffine < meanAffine + sigmaAffine*sigmaLimitAffine;
	var keepTranslate = true; // var keepTranslate = scoreTranslate < meanTranslate + sigmaTranslate*sigmaLimitAffine;
	var keepNCC = scoreNCC < meanNCC + sigmaNCC*sigmaLimitNCC;
	var keepSAD = scoreSAD < meanSAD + sigmaSAD*sigmaLimitSAD;
	var keepPathNCC = scorePathNCC < meanPathNCC + sigmaPathNCC*sigmaLimitPathNCC;
	var keepPathSAD = scorePathSAD < meanPathSAD + sigmaPathSAD*sigmaLimitPathSAD;
	var keepRelativePathNCC = scoreRelativePathNCC < meanRelativePathNCC + sigmaRelativePathNCC*sigmaLimitRelativePathNCC;
	var keepRelativePathSAD = scoreRelativePathSAD < meanRelativePathSAD + sigmaRelativePathSAD*sigmaLimitRelativePathSAD;
// keepNCC = true;
// keepSAD = true;
// keepPathNCC = true;
// keepPathSAD = true;
// keepRelativePathNCC = true;
// keepRelativePathSAD = true;
	if(keepAffine && keepTranslate && keepNCC && keepSAD && keepPathNCC && keepPathSAD && keepRelativePathNCC && keepRelativePathSAD){
		return 1;
	}
	return 0;
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

	// sub-pixel interpolation
	if(0<xLoc && xLoc<valueWidth-1 && 0<yLoc && yLoc<valueHeight-1){
		var d0 = values[(yLoc-1)*valueWidth + (xLoc-1)];
		var d1 = values[(yLoc-1)*valueWidth + (xLoc+0)];
		var d2 = values[(yLoc-1)*valueWidth + (xLoc+1)];
		var d3 = values[(yLoc+0)*valueWidth + (xLoc-1)];
		var d4 = values[(yLoc+0)*valueWidth + (xLoc+0)];
		var d5 = values[(yLoc+0)*valueWidth + (xLoc+1)];
		var d6 = values[(yLoc+1)*valueWidth + (xLoc-1)];
		var d7 = values[(yLoc+1)*valueWidth + (xLoc+0)];
		var d8 = values[(yLoc+1)*valueWidth + (xLoc+1)];
		var result = Code.extrema2DFloatInterpolate(new V3D(), d0,d1,d2,d3,d4,d5,d6,d7,d8);
		result.x += xLoc;
		result.y += yLoc;
		// console.log(" RESULT: "+peak+" / "+result);
		peak = result;
	}

	//var p = new V2D(pointB.x + 1 - (valueWidth*0.5)*cellScale + peak.x*cellScale, pointB.y + 1 - (valueHeight*0.5)*cellScale + peak.y*cellScale);
// console.log(needleSize+"/"+haystackSize+" in "+valueWidth+"x"+valueHeight+" ("+cellScale+") ");
	var p = new V2D(pointB.x + (-valueWidth*0.5 + peak.x)*cellScale, pointB.y + (-valueHeight*0.5 + peak.y)*cellScale);

	



	//var p = new V2D(pointB.x - (valueWidth*0.5)*cellScale + peak.x*cellScale, pointB.y - (valueHeight*0.5)*cellScale + peak.y*cellScale);

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
	this._scorePathSAD = null;
	this._scorePathNCC = null;
	this._scoreRelativePathNCC = null;
	this._scoreRelativePathSAD = null;
	this._uniqueness = null;
	// this._vectorSiftScore = null;
	// this._vectorSadScore = null;
	this._scoreGrad = null;
	this._scorePathGrad = null;
	this._range = null;
}
BeliefTest.Match.prototype.uniqueness = function(uniqueness){
	if(uniqueness!==undefined){
		this._uniqueness = uniqueness;
	}
	return this._uniqueness;
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
BeliefTest.Match.prototype.scorePathNCC = function(scorePathNCC){
	if(scorePathNCC!==undefined){
		this._scorePathNCC = scorePathNCC;
	}
	return this._scorePathNCC;
}
BeliefTest.Match.prototype.scorePathSAD = function(scorePathSAD){
	if(scorePathSAD!==undefined){
		this._scorePathSAD = scorePathSAD;
	}
	return this._scorePathSAD;
}
BeliefTest.Match.prototype.scoreRelativePathNCC = function(scoreRelativePathNCC){
	if(scoreRelativePathNCC!==undefined){
		this._scoreRelativePathNCC = scoreRelativePathNCC;
	}
	return this._scoreRelativePathNCC;
}
BeliefTest.Match.prototype.scoreRelativePathSAD = function(scoreRelativePathSAD){
	if(scoreRelativePathSAD!==undefined){
		this._scoreRelativePathSAD = scoreRelativePathSAD;
	}
	return this._scoreRelativePathSAD;
}
BeliefTest.Match.prototype.range = function(range){
	if(range!==undefined){
		this._range = range;
	}
	return this._range;
}
BeliefTest.Match.prototype.x = function(){
	
}

/// --------------------------------------------------------------------------------------------------------
BeliefTest.Lattice = function(viewA,viewB){
	this._viewA = null;
	this._viewB = null;
	this._graph = null;
	this._cells = null;
	this._F = null;
	this.viewA(viewA);
	this.viewB(viewB);
	this.generateGraph();
	this._queue = new PriorityQueue(BeliefTest.Lattice._cellOrdering);
}
BeliefTest.Lattice._cellOrdering = function(a,b){
	if(a==b){
		return 0;
	}else if(a._row<b._row){
		return -1;
	}else if(a._row>b._row){
		return 1;
	}else if(a._col<b._col){
		return -1;
	}else if(a._col>b._col){
		return 1;
	}
	throw "?";
	return 0;
}
BeliefTest.Lattice.prototype.calculateF = function(){
	var matchedCells = [];
	this.forEachCell(function(cell, i, j, index){
		var match = cell.match();
		if(match){
			matchedCells.push(cell);
		}
	});
	if(matchedCells.length>16){
		var pointsA = [];
		var pointsB = [];
		for(var i=0; i<matchedCells.length; ++i){
			var cell = matchedCells[i];
			var match = cell.match();
			var pointA = match.pointA();
			var pointB = match.pointB();
			pointsA.push(pointA);
			pointsB.push(pointB);
		}
		// console.log(pointsA);
		// console.log(pointsB);
		var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB, true);
		var F2 = R3D.fundamentalInverse(F);
		// console.log(F);
		var info = R3D.fundamentalError(F,F2,pointsA,pointsB);
		console.log("  "+F+"");
		console.log("  "+info["mean"]+" +/- "+info["sigma"]);
		this._Ffwd = F;
		this._Frev = F2;
		this._Fmean = info["mean"];
		this._Fsigma = info["sigma"];
	}else{
		this._F = null;
	}
}
BeliefTest.Lattice.prototype.dropGlobalMatches = function(remQueue){
	var Ffwd = this._Ffwd;
	var lattice = this;
	var queue = lattice.queue();
	if(Ffwd){
		var limitErrorSigma = 3.0; // 1-2   1 stops propagation, 2 introduces lots of error
		var maxErrorF = this._Fmean + this._Fsigma*limitErrorSigma;
		var Frev = this._Frev;
		this.forEachCell(function(cell, i, j, index){
			var match = cell.match();
			if(match){
				var pointA = match.pointA();
				var pointB = match.pointB();
				var info = R3D.fundamentalErrorSingle(Ffwd,Frev,pointA,pointB);
				var error = info["error"];
				// console.log("  "+error);
				if(error>maxErrorF){
					cell.dropMatch();
					remQueue.push(cell);
//					queue.push(cell);
				}
			}
		});
	}
}
BeliefTest.Lattice.prototype.generateGraph = function(){
	if(!this._viewA || !this._viewA.image()){
		return;
	}
	var viewWidth = this._viewA.image().width();
	var viewHeight = this._viewA.image().height();
	//var cellSize = 25;
	// var cellSize = 15;
	
	var cellSize = 41;
	var compareSize = 81;

	// largest:
	// var cellSize = 21;
	// var compareSize = 41;

	// average:
	// var cellSize = 11;
	// var compareSize = 21;

	// var cellSize = 5;
	// var compareSize = 11;

	// smallest
	// var cellSize = 1;
	// var compareSize = 5;


	// var compareSize = Math.floor(cellSize*1.5);
	// if(compareSize%2==0){ // keep odd
	// 	compareSize -= 1;
	// }
	// compareSize = Math.round(cellSize*0.5);
	// compareSize = cellSize;
	// compareSize = cellSize + 2;
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
			
			// 4 neighbor
			var pairs = [[-1,0],[1,0],[0,-1],[0,1]];
			for(var k=0; k<pairs.length; ++k){
				var pair = pairs[k];
				var iii = i + pair[0];
				var jjj = j + pair[1];
				if(jjj>=0 && jjj<cellCountJ && iii>=0 && iii<cellCountI){
					c = cells[jjj*cellCountI+iii];
					cell.addNeighbor4(c);
				}
			}
			
			
			// 8 neighbor
			for(var jj=-1; jj<=1; ++jj){
				for(var ii=-1; ii<=1; ++ii){
					var jjj = jj + j;
					var iii = ii + i;
					if(jjj==j && iii==i){
						continue;
					}
					if(jjj>=0 && jjj<cellCountJ && iii>=0 && iii<cellCountI){
						c = cells[jjj*cellCountI+iii];
						cell.addNeighbor8(c);
					}
				}
			}
			
		}
	}
	// this._graph = graph;
	this._cells = cells;
	// console.log(cells);
}

BeliefTest.Lattice.prototype.matchFromSettings = function(cell, pointA,pointB, scaleAtoB,angleAtoB){
	var lattice = this;
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
	var matrix = BeliefTest.affineFromResult(optimum);
	// reverse
	var centerA = cell.center();
	var compareSize = lattice.compareSize();
	// console.log("compareSize: "+compareSize);
	// console.log("cellSize: "+compareSize);
	var searchSize = Math.ceil(2*cellSize); // 2-3
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
	return match;
}
BeliefTest.Lattice.prototype.bestMatchFromSettings = function(match, cell, neighbor){
	var lattice = this;
	var imageA = lattice.viewA().image();
	var imageB = lattice.viewB().image();
	var cellSize = lattice.cellSize();
	var cellCenter = cell.center();
	var neighborCenter = neighbor.center();
	var matrix = match.affine();
	var pointA = match.pointA();
	var pointB = match.pointB();
	var dirA = V2D.sub(neighborCenter,cellCenter);
	var dirB = matrix.multV2DtoV2D(dirA);
	var predictB = V2D.add(pointB,dirB);
	// find expected location of neighbor based on 
	// console.log(" points: "+dirA+" & "+dirB);
	var inverse = Matrix.inverse(matrix);
	// move point b around till it fits to point a
	// var optimumLocation = R3D.optimumTranslation(imageB,predictB, imageA,neighborCenter, vectorX,vectorY, cellSize, 1,0.1,0.1);
	var optimumLocation = BeliefTest.optimumLocation(imageA,neighborCenter, imageB,predictB, cellSize,cellSize*4, matrix,   false);
	var bestB = optimumLocation["location"];
	// optimum transform
	var vectorX = inverse.multV2DtoV2D(new V2D(1,0));
	var vectorY = inverse.multV2DtoV2D(new V2D(0,1));
	// console.log("B: "+vectorX+" & "+vectorY);
	var optimum = R3D.optimumAffineTransform(imageB,bestB, imageA,neighborCenter, vectorX,vectorY, cellSize, cellSize*0.5,0.25,0.25);
		bestB = V2D.add(optimum["O"], bestB);
		// bestB = V2D.sub(bestB,optimum["O"]);
	var bestInverse = BeliefTest.affineFromResult(optimum);
	var bestMatrix = Matrix.inverse(bestInverse);
	var pathMatch = lattice.newMatchFrom(neighbor, neighborCenter, bestB, bestMatrix, match);
	return pathMatch;
}
CALLED = 0;
BeliefTest.Lattice.prototype.newMatchFrom = function(cell, pointA, pointB, matrix, originMatch, zoomCount){
zoomCount = zoomCount!==undefined ? zoomCount : 0;
	var lattice = this;
	var cellSize = lattice.cellSize();
	var compareSize = lattice.compareSize();
	// var zoomScale = zoomCount + 1;
	var zoomScale = Math.pow(2,zoomCount);
// console.log("zoomScale: "+zoomScale);
	compareSize = Math.round(compareSize * zoomScale);
	// var compareCount = compareSize*compareSize;
	var imageA = lattice.viewA().image();
	var imageB = lattice.viewB().image();


	// forward-reverse validation: fwd-bak
	var inverse = Matrix.inverse(matrix);
	var searchSize = Math.ceil(3*compareSize); // 2-3
	var optimumLocation = BeliefTest.optimumLocation(imageB,pointB, imageA,pointA, compareSize,searchSize, inverse,   false);
	var bestA = optimumLocation["location"];
	// var haystackA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
	var distanceAB = V2D.distance(bestA,pointA);
	var maxCrossCheckDistance = 0.5 * cellSize;
	// var maxCrossCheckDistance = 0.5 * compareSize;
	// var maxCrossCheckDistance = cellSize;
	if(distanceAB>maxCrossCheckDistance){
		var result = null;
		if(zoomCount<=5){ // 1, 2, 4, 8 OR 1,2,3,4
			result = this.newMatchFrom(cell, pointA, pointB, matrix, originMatch, zoomCount+1);
		}
		// if(zoomCount==3 && !result){
		// 	// console.log("DROP   "+distanceAB+"  >?>  "+maxCrossCheckDistance+" ("+cellSize+" ) ");
		// }
		return result;
	}



	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, null);
	var scoreNCC = R3D.normalizedCrossCorrelation(needle,null,haystack,true);

		// console.log(scoreNCC);
		scoreNCC = scoreNCC["value"][0];
	var scoreSAD = R3D.searchNeedleHaystackImageFlat(needle,null,haystack);

		// console.log(scoreSAD);
		scoreSAD = scoreSAD["value"][0];
	var range = needle.range()["y"];

	// var uniqueness = R3D.uniquenessFromNeedleHaystack(needle,null,haystack);
	// var haystackSize = compareSize*3;
	// var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,haystackSize,haystackSize, null);
	// var info = R3D.normalizedCrossCorrelation(needle,null,haystack,true);
	// 	var uniquenessNCC = R3D.Dense.uniquenessFromValueList(info["value"],info["width"],info["height"]);
	// var uniqueness = uniquenessNCC;
	var uniqueness = 1.0;


	var match = new BeliefTest.Match();
		match.pointA(pointA);
		match.pointB(pointB);
		match.affine(matrix);
		match.scoreNCC(scoreNCC);
		match.scoreSAD(scoreSAD);
		match.range(range);
		match.uniqueness(uniqueness);
		var pathA, pathB, baseNCC, baseSAD;
	if(originMatch){
		baseNCC = originMatch.scoreNCC();
		baseSAD = originMatch.scoreSAD();
		// TODO: THIS SHOULD ACTUALLY BE EXTRACTING PATHS FROM A->A' & B->B`
		var pointA1 = originMatch.pointA();
		var pointA2 = match.pointA();
		var pointB1 = originMatch.pointB();
		var pointB2 = match.pointB();
		var paths = BeliefTest.pathTransforms(imageA,pointA1,pointA2, imageB,pointB1,pointB2, compareSize, 1.0);
		pathA = paths["A"];
		pathB = paths["B"];
		// currently ratios:
		// match.scorePathNCC( scoreNCC/originMatch.scoreNCC() );
		// match.scorePathSAD( scoreSAD/originMatch.scoreSAD() );
	}else{ // seed
		baseNCC = scoreNCC;
		baseSAD = scoreSAD;
		pathA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize*2,compareSize*2, matrix);
		pathB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize*2,compareSize*2, null);
	}






// console.log(pathA);
		// console.log(pathB);
		// throw "?";
	//var data = R3D.Dense.comparePathTransforms(imageA,pointA1,pointA2, imageB,pointB1,pointB2, sizeCompare,scaAB, subShow);
	var scoreNCC = R3D.normalizedCrossCorrelation(pathA,null,pathB,true);
		scoreNCC = scoreNCC["value"][0];
	var scoreSAD = R3D.searchNeedleHaystackImageFlat(pathA,null,pathB);
		scoreSAD = scoreSAD["value"][0];
	var relativeNCC = scoreNCC/baseNCC;
	var relativeSAD = scoreSAD/baseSAD;
//		console.log("  PATH SCORES: "+relativeNCC+" & "+relativeSAD+"    of  "+scoreNCC+" & "+scoreSAD);
	match.scoreRelativePathNCC( relativeNCC );
	match.scoreRelativePathSAD( relativeSAD );
	match.scorePathNCC( scoreNCC );
	match.scorePathSAD( scoreSAD );
/*
if(originMatch){
// var imgA;
// if(originMatch){
var imgA1 = imageA.extractRectFromFloatImage(originMatch.pointA().x,originMatch.pointA().y,1.0,null,compareSize*2,compareSize*2, null);
// }else{
// var imgA = imageA.extractRectFromFloatImage(match.pointA().x,match.pointA().y,1.0,null,compareSize,compareSize, null);
// }
var imgA2 = imageA.extractRectFromFloatImage(match.pointA().x,match.pointA().y,1.0,null,compareSize*2,compareSize*2, null);
var imgB1 = imageB.extractRectFromFloatImage(originMatch.pointB().x,originMatch.pointB().y,1.0,null,compareSize*2,compareSize*2, null);
var imgB2 = imageB.extractRectFromFloatImage(match.pointB().x,match.pointB().y,1.0,null,compareSize*2,compareSize*2, null);

var sca = 4.0;

var iii = imgA1;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(2.0);
d.matrix().translate(1000, 100*CALLED);
GLOBALSTAGE.addChild(d);

var iii = imgA2;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(2.0);
d.matrix().translate(1080, 100*CALLED);
GLOBALSTAGE.addChild(d);

var iii = imgB1;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(2.0);
d.matrix().translate(1160, 100*CALLED);
GLOBALSTAGE.addChild(d);

var iii = imgB2;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(2.0);
d.matrix().translate(1240, 100*CALLED);
GLOBALSTAGE.addChild(d);


var iii = pathA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(1400, 100*CALLED);
GLOBALSTAGE.addChild(d);

var iii = pathB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(1600, 100*CALLED);
GLOBALSTAGE.addChild(d);


var dd = new DOText(scoreNCC+" | "+scoreSAD, 12, DOText.FONT_ARIAL, 0xFF000000, DOText.ALIGN_LEFT);
dd.matrix().translate(1800, 20 + 100*CALLED);
GLOBALSTAGE.addChild(dd);



++CALLED;
}
*/

	return match;
}

BeliefTest.pathTransforms = function(imageA,pointA1,pointA2, imageB,pointB1,pointB2, inputCompareSize, scaleAtoB){
	var compareSize = (inputCompareSize!==undefined && inputCompareSize!==null)? inputCompareSize : 11; // size of a cell 
	scaleAtoB = scaleAtoB!==undefined ? scaleAtoB : 1.0;
	var sizeA = compareSize;
	var sizeB = compareSize*scaleAtoB;

	var dirA = V2D.sub(pointA2,pointA1);
	var dirB = V2D.sub(pointB2,pointB1);
	var lengthA = dirA.length() + (sizeA + sizeB)*0.5;
	var lengthB = dirB.length() + (sizeA + sizeB)*0.5;

	var averageLength = (lengthA+lengthB)*0.5;
	var haystackWidth = Math.round(averageLength);
	var haystackHeight = 11;
		haystackWidth = Math.max(haystackWidth,haystackHeight);

	var haystackA = R3D.Dense.extractRectFromPoints(imageA,pointA1,pointA2, sizeA,sizeB, haystackWidth,haystackHeight);
	var haystackB = R3D.Dense.extractRectFromPoints(imageB,pointB1,pointB2, sizeA,sizeB, haystackWidth,haystackHeight);
	return {"A":haystackA, "B":haystackB};
}
BeliefTest.Lattice.orientationTest = function(cell, match){
//	console.log(cell)
	var neighbors = cell.neighbors8();
	var orderA = [];
	var orderB = [];
	var matchA = match.pointA();
	var matchB = match.pointB();
	for(var i=0; i<neighbors.length; ++i){
		var neighbor = neighbors[i];
		var m = neighbor.match();
		if(m){
			var mA = m.pointA();
			var mB = m.pointB();
			var angleA = V2D.angleDirection(mA,matchA);
			var angleB = V2D.angleDirection(mB,matchB);
				angleA = Code.angleZeroTwoPi(angleA);
				angleB = Code.angleZeroTwoPi(angleB);
			orderA.push([angleA,i]);
			orderB.push([angleB,i]);
		}
	}
	var count = orderA.length;
	if(count<=2){ // only list of 3 or more have orientation conflicts
		return true;
	}
	// sort by angleB
	var angle = function(a,b){
		return a[0]<b[0] ? -1 : 1;
	}
	orderA.sort(angle);
	orderB.sort(angle);
	var first = orderA[0][1];
	var last = orderA[orderA.length-1][1];
	//iterate thru each
	for(var j=0; j<orderB.length; ++j){
		var b = orderB[j][1];
		if(b==first){
			break;
		}
	}
	for(var i=0; i<orderA.length; ++i){
		var a = orderA[i][1];
		var b = orderB[(i+j)%count][1];
		if(a!=b){
			// console.log("FOUND INVALID ORDERING: "+a+" | "+b);
			// console.log(orderA);
			// console.log(orderB);
			return false;
		}
	}
	return true;
}

BeliefTest.Lattice.prototype.matchValidation = function(cell, match){
	if(!match){
		return false;
	}
	var lattice = this;
	// ordering constraints
	var ordered = BeliefTest.Lattice.orientationTest(cell,match);
	if(!ordered){
		console.log("DROP ORDERING");
		return false;
	}
	// TODO: use affine average scale to determine limits
	// var minDistanceScale = 0.5;
	// var maxDistanceScale = 2.0;
	var minDistanceScale = 0.25;
	var maxDistanceScale = 4.0;
	/*
	var affine = match.affine();
	var vectorX = new V2D(1.0,0.0);
	var vectorY = new V2D(0.0,1.0);
	vectorX = affine.multV2DtoV2D(vectorX);
	vectorY = affine.multV2DtoV2D(vectorY);
	var maxXY = Math.max(vectorX.length(),vectorY.length());
	var minXY = Math.min(vectorX.length(),vectorY.length());
		minXY = Math.min(minXY, 1.0/minXY);
		maxXY = Math.min(maxXY, 1.0/maxXY);
	minDistanceScale = Math.max(minXY,minDistanceScale);
	maxDistanceScale = Math.max(maxXY,maxDistanceScale);
	*/
	// min & max distance constraints
	var neighbors = cell.neighbors8();
	for(var i=0; i<neighbors.length; ++i){
		var neighbor = neighbors[i];
		var m = neighbor.match();
		if(m){
			var distanceA = V2D.distance(match.pointA(),m.pointA());
			var distanceB = V2D.distance(match.pointB(),m.pointB());
			var ratio = distanceB/distanceA;
			if(ratio>maxDistanceScale || ratio<minDistanceScale){
				return false;
			}
		}
	}
	var viewA = lattice.viewA();
	var viewB = lattice.viewB();
	var imageA = viewA.image();
	var imageB = viewB.image();
	var bestB = match.pointB();
	if(bestB.x<=0 || bestB.x>=imageB.width() || bestB.y<=0 || bestB.y>=imageB.height()){
		console.log("DROP OUTSIDE");
		// console.log("OUTSIDE");
		return false;
	}

	// max distance constraint

	// minimum range
	
	// var minimumRange = 0.02; // TODO: per pixel range 0.01 / 1 is ok, 0.05 / 100 is ok
	// // console.log(match.range());
	// if(match.range()<minimumRange){
	// 	return false;
	// }
	
	// minimum variabliity

	// min uniqueness
	var minUniquenessNCC = 0.001;
	var uniqueness = match.uniqueness();
	// console.log("   uniqueness "+uniqueness);
	if(uniqueness<minUniquenessNCC){
		console.log("DROP UNIQUENESS");
		return false;
	}

	// score constraints
	var scoreSAD = match.scoreSAD();
	//if(scoreSAD>0.525){
	if(scoreSAD>0.5){
		console.log("DROP SCORE SAD: "+scoreSAD);
		return false;
	}
	var scoreNCC = match.scoreNCC();
	if(scoreNCC>0.5){
		console.log("DROP SCORE NCC: "+scoreNCC);
		return false;
	}

	// relative path costs
	var scorePathSAD = match.scorePathSAD();
	var scorePathNCC = match.scorePathNCC();
	var maxPathNCC = 0.90;
	var maxPathSAD = 0.90;
	if(scorePathSAD>maxPathSAD){
		console.log("DROP PATH SAD");
		return false;
	}
	if(scorePathNCC>maxPathNCC){
		console.log("DROP PATH NCC");
		return false;
	}
	var relativePathSAD = match.scoreRelativePathSAD();
	var relativePathNCC = match.scoreRelativePathNCC();
	// ~2-4
	// var maxRelativeNCC = 14.0;
	// var maxRelativeSAD = 14.0;
	// if(relativePathSAD>maxRelativeSAD){
	// 	console.log("DROP RELATIVE SAD");
	// 	return false;
	// }
	// if(relativePathNCC>maxRelativeNCC){
	// 	console.log("DROP RELATIVE NCC");
	// 	return false;
	// }
	/*
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
// BeliefTest.Lattice.prototype.cellsChooseSeedMatch = function(){
// 	this.forEachCell(function(cell, i, j, index){
// 		cell.applyBestMatch();
// 	});
// }
BeliefTest.Lattice.prototype.queue = function(){
	return this._queue;
}

BeliefTest.Lattice.prototype.iteration = function(e){
	var lattice = this;
	var queue = lattice.queue();
var addQueue = new PriorityQueue(BeliefTest.Lattice._cellOrdering);
var remQueue = new PriorityQueue(BeliefTest.Lattice._cellOrdering);
	var list = queue.toArray();
this._wasList = list;
	queue.clear();
	console.log("iteration - "+list.length);
// var pushCount = 0;
	// setting/replacing best matches
	for(var i=0; i<list.length; ++i){
		var cell = list[i];
		var cellID = cell.id();
		var neighbors = cell.neighbors4();
		var neighborKeys = Code.keys(neighbors);
		// finding best match to possibly replace with
		var bestMatch = cell.match();
		for(var j=0; j<neighborKeys.length; ++j){
			var index = neighborKeys[j];
			var neighbor = neighbors[index];
			var neighborMatch = neighbor.match();
			if(neighborMatch){ // has possible path matches
				var match = neighbor._paths[cellID];
				if(match){ // valid
					//if(bestMatch==null || match.scorePathNCC()<bestMatch.scorePathNCC()){
						if(bestMatch==null ||
							(match.scoreSAD()<bestMatch.scoreSAD() || match.scoreNCC()<bestMatch.scoreNCC())
							){
							// match.scorePathNCC()<bestMatch.scorePathNCC() && match.scoreNCC()<bestMatch.scoreNCC() 
							//match.scoreNCC()<bestMatch.scoreNCC()){ // TODO: LOWEST RELATIVE PATH COSTS
						bestMatch = match;
					}
				}
			}
		}
		if(bestMatch && bestMatch!=cell.match()){ // match exists and is better
			var match = cell.match();
			var prevScore = 0;
			if(match && bestMatch){
				var prevScoreSAD = bestMatch.scoreSAD()/match.scoreSAD();
				var prevScoreNCC = bestMatch.scoreNCC()/match.scoreNCC();
				prevScore = Math.min(prevScoreSAD,prevScoreNCC);
			}
			//console.log("  prevScore: "+prevScore);
			if(prevScore<0.95){
				// if(match){
				// 	console.log("UPDATE MATCH: "+match.scoreSAD()+"<"+bestMatch.scoreSAD()+" || "+match.scoreNCC()+"<"+bestMatch.scoreNCC()+" +++++++++ ");
				// }else{
				// 	console.log("NEW MATCH:    "+bestMatch.scoreSAD()+" || "+bestMatch.scoreNCC()+" +++++++++ ");
				// }
				console.log("  prevScore: "+prevScore);
				cell.setMatch(bestMatch);
				// queue.push(cell);
					addQueue.push(cell);
			}
		}	
	}
	// 
	// console.log("PUSH COUNT: "+pushCount);

	// update metrics
	for(var i=0; i<list.length; ++i){
		var cell = list[i];
		cell.updateMetrics();
	}

	// dropping bad matches - check votes
	for(var i=0; i<list.length; ++i){
		var cell = list[i];
		var match = cell.match();
		if(match){
			var info = cell.voteInfo();
			var count = info["count"];
			var percent = info["percent"];
			// console.log("VOTES: "+count+" | "+percent);
			// if(count>3 && percent<0.50){
			// if(count>1 && percent<0.75){
			// if(count>6 && percent<0.50 ||  // 3/7 = 0.42
			//    count>4 && percent<0.41 ||  // 2/5 = .40
			//    count>2 && percent<0.34 // 1/3 = .33
			// 	){
			if(count>6 && percent<0.30 ||  // 3/7 = 0.42
			   count>4 && percent<0.20 ||  // 2/5 = .40
			   count>2 && percent<0.10 // 1/3 = .33
				){
				// console.log("REMOVE CELL ...",cell);
				// queue.remove(cell);
				cell.dropMatch();
				remQueue.push(cell);
				cell._previousMatch = null;
			}
		}
	}

	// globals
	lattice.calculateF();
	lattice.dropGlobalMatches(remQueue);

	// only include elements that don't toggle between add/remove
	var addList = addQueue.toArray();
	var remList = remQueue.toArray();
	addQueue.clear();
	remQueue.clear();
	for(var i=0; i<addList.length; ++i){
		var cell = addList[i];
		if(Code.elementExists(remList, cell)){
			// console.log("EXISTS");
			Code.removeElement(remList, cell);
		}else{
			queue.push(cell);
		}
	}
	for(var i=0; i<remList.length; ++i){
		var cell = remList[i];
		queue.push(cell);
	}

	// add all 4-neighbors of remaining cells
	var list = queue.toArray();
	queue.clear();
	for(var i=0; i<list.length; ++i){
		var cell = list[i];
		cell.forEachNeighbor4(function(neighbor,index){
			queue.push(neighbor);
		});
		queue.push(cell);
	}

	
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
	var error = diff.length()/before.length(); // relative error
	// var error = diff.length(); // absolute
	return {"error":error};
}
BeliefTest.Lattice.prototype.groupAffineCompare = function(cell, match){ // in same direction
	// how does actual group move
	var neighbors = cell.neighbors8();
	var matches = [];
	for(var i=0; i<neighbors.length; ++i){
		var neighbor = neighbors[i];
		var m = neighbor.match();
		if(m){
			matches.push(m);
		}
	}
	if(matches.length>2){ // if less than 2 matches, nothing to compare
		//
	}
	return null;
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






