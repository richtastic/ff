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
	
	// var imageLoader = new ImageLoader("./images/",["caseStudy1-0.jpg","caseStudy1-0.jpg"], this,this.handleImageLoaded,null);
	// var imageLoader = new ImageLoader("./images/",["snow1.png","snow2.png"], this,this.handleImageLoaded,null);
	var imageLoader = new ImageLoader("./images/",["room0.png","room2.png"], this,this.handleImageLoaded,null);
	// var imageLoader = new ImageLoader("./images/",["F_S_1_1.jpg","F_S_1_2.jpg"], this,this.handleImageLoaded,null);
	// var imageLoader = new ImageLoader("./images/",["caseStudy1-0.jpg","caseStudy1-20.jpg"], this,this.handleImageLoaded,null);
	// var imageLoader = new ImageLoader("./images/",["room0.png","room0.png"], this,this.handleImageLoaded,null);
	imageLoader.load();

	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this._handleKeyboardUp,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	this._keyboard.addListeners();

	if(!this._display){
		this._display = new DO();
		GLOBALSTAGE.addChild(this._display);
		this._insides = new DO();
		this.resetDisplay();
	}
//var displayScale = 1.5;
}


BeliefTest.testDisplayZoom = function(image){
	console.log("testDisplayZoom");




	var finder = new R3D.CompareSizeFinder(image);
	console.log(finder);
	var size = finder.minSizeForPoint(125,126);
	console.log(size);



	var iii = image;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	// d.matrix().scale(1.0);
	d.matrix().translate(10 , 10);
	GLOBALSTAGE.addChild(d);


	var targetValues = Code.copyArray(finder._scales);
	var sourceWidth = image.width();
	var sourceHeight = image.height();
	ImageMat.normalFloat01(targetValues);
	ImageMat.pow(targetValues,0.5);
	var heat = ImageMat.heatImage(targetValues, sourceWidth, sourceHeight, true);
	var iii = heat;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().translate(10 , 10);
	d.graphics().alpha(0.50);
	GLOBALSTAGE.addChild(d);

throw "... redone in R3D";


	var isRange = false; // cornernes
	// var isRange = true;


	var source = image.gry();
	var sourceWidth = image.width();
	var sourceHeight = image.height();
	console.log(source);




var gry = source;
var width = sourceWidth;
var height = sourceHeight;
var corners = R3D.harrisCornerDetection(gry, width, height);
ImageMat.normalFloat01(corners);
// ImageMat.add(corners,1.0);
// ImageMat.pow(corners,0.1); // more linear shapes
ImageMat.pow(corners,0.10);
// ImageMat.pow(corners,0.25);
// ImageMat.log(corners);
// ImageMat.add(corners,1.0);
// ImageMat.log(corners);
// ImageMat.add(corners,-1.0);

tmp = Code.copyArray(corners);
tmp.sort(function(a,b){
	return a < b ? -1 : 1;
});
// Code.printMatlabArray(tmp);

var minimumCornerness = tmp[Math.round(tmp.length*0.333)];

source = corners;

		// var iii = img;
		// var img = GLOBALSTAGE.getFloatRGBAsImage(source,source,source, sourceWidth,sourceHeight);
		// var d = new DOImage(img);
		// d.matrix().scale(1.0);
		// d.matrix().translate(10 , 10);
		// GLOBALSTAGE.addChild(d);

		// var sca = 2.0;
		// var squ = 50;
		// var spa = 10.0;
		// var matrix = null;
		
		// var p2DA = point2DA.point2D();

		// // SHOW POINT BY ITSELF
		// var img = imageA.extractRectFromFloatImage(p2DA.x,p2DA.y,1.0,null,squ,squ, null);
		// console.log(img.range());
		// var iii = img;
		// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		// var d = new DOImage(img);
		// d.matrix().scale(sca);
		// d.matrix().translate(10 + (sca*squ + spa)*i, 10);
		// GLOBALSTAGE.addChild(d);

// var wid = 16;
// var hei = 16;
// var len = wid*hei
// source = [];
// for(var i=0; i<len; ++i){
// 	var val = Code.randomInt(0,9);
// 	source.push(val);
// }

// var str = Code.toStringArray2D(source,wid,hei, 2);
// console.log(str);
// sourceWidth = wid;
// sourceHeight = hei;

// throw "...";


	var pixels = sourceWidth*sourceHeight;
	var records = [];
	var sizes = [];
	var recordCurr = [];
	for(var i=0; i<pixels; ++i){
		var pixel = source[i];
		recordCurr[i] = [pixel,pixel];
	}
	var sizeCurr = new V2D(sourceWidth,sourceHeight);
	records.push(recordCurr);
	sizes.push(sizeCurr);
	var scaleValues = [];
	var scales = 7; // 1,2,4,8,16 -- max to be based on original image size
	scaleValues.push(Math.pow(2,0)); // first skipped
	for(var s=1; s<scales; ++s){
		var scale = Math.pow(2,-s);
		var width = Math.ceil(scale*sourceWidth);
		var height = Math.ceil(scale*sourceHeight);
		scaleValues.push(scale);
		// console.log(s+" : "+scale+" = "+width+" x "+height+"   || WAS: "+sizeCurr);
		var recordNext = [];
		// for each new pixel
		for(var j=0; j<height; ++j){
			for(var i=0; i<width; ++i){
				var iOld = Math.floor(i*2.0);
				var jOld = Math.floor(j*2.0);
				var minI = iOld;
				var minJ = jOld;
				var maxI = Math.min(sizeCurr.x-1,iOld+1);
				var maxJ = Math.min(sizeCurr.y-1,jOld+1);
				var record = null;
				// edge case noneven division
				if(minI>maxI){
					minI = maxI;
				}
				if(minJ>maxJ){
					minJ = maxJ;
				}
				// get max & min in 3x3 area
				for(var jj=minJ; jj<=maxJ; ++jj){
					for(var ii=minI; ii<=maxI; ++ii){
						var ind = jj*sizeCurr.x + ii;
						var val = recordCurr[ind];
						if(!record){
							record = [val[0],val[1]];
						}else{
							record[0] = Math.min(record[0],val[0]);
							record[1] = Math.max(record[1],val[1]);
						}
					}
				}
				// save
				var index = j*width + i;
				recordNext[index] = record;
			}
		}
		sizeCurr = new V2D(width,height);
		sizes.push(sizeCurr);
		records.push(recordNext);
		recordCurr = recordNext;
	}
	console.log(records);
/*
	for(var i=0; i<records.length; ++i){
		// var wid = ;
		// var hei = ;
		var r = records[i];
		var s = [];
		for(var j=0; j<r.length; ++j){
			s[j] = r[j][0];
		}
		var str = Code.toStringArray2D(s,sizes[i].x,sizes[i].y, 2);
		console.log(str);
	}
*/
	
	// var targetValue = 0.10;
	// var targetValue = 0.25;
	var targetValue = 0.50;
	// var targetValue = minimumCornerness;

console.log(minimumCornerness)

	var target = [];
	var xValues = Code.lineSpace(0,scales-1);
	console.log(xValues);
	// get graphs:
	for(var j=0; j<sourceHeight; ++j){
		for(var i=0; i<sourceWidth; ++i){
			var index = j*sourceWidth + i;
			var yValues = [];
			for(s=0; s<scales; ++s){
				var scale = scaleValues[s];
				var size = sizes[s];
				var record = records[s];
				var ii = Math.floor(scale*i);
				var jj = Math.floor(scale*j);
				var ind = jj*size.x + ii;
				var val = record[ind];
				if(isRange){
					val = val[1] - val[0];
				}else{
					val = val[1]; // maximum
				}
				yValues.push(val);
				//if(j==0 && i==0){
				// if(index==5031){
				// 	console.log(s,scale,size+"",record.length+"",ii,jj,val)
				// }
			}
			target[index] = yValues;
		}
	}
	console.log(target);
	// to target range:
	var targetValues = [];
	for(var j=0; j<sourceHeight; ++j){
		for(var i=0; i<sourceWidth; ++i){
			var index = j*sourceWidth + i;
			var yValues = target[index];
			var result = Code.findGlobalValue1D(yValues, targetValue);
			var scale = result[0];
			if(scale<0){
				console.log(scale);
			}
			scale = Math.pow(2,scale);
			targetValues[index] = scale;
		}
	}

	console.log(targetValues);

	var x = 275;
	var y = 100;
	var scaleValue = ImageMat.getPointInterpolateLinear(targetValues, sourceWidth,sourceHeight, x,y);
	console.log(scaleValue+" @ "+x+","+y);



var min = Code.min(targetValues);
var max = Code.max(targetValues);
var ran = max-min;
ImageMat.normalFloat01(targetValues);

console.log(min,max);

var s = 0.25;
var wid = Math.round(s*sourceWidth);
var hei = Math.round(s*sourceHeight);
console.log(wid,hei);
resized = ImageMat.extractRect(targetValues, 0,0, sourceWidth,0, sourceWidth,sourceHeight, 0,sourceHeight, wid,hei, sourceWidth,sourceHeight);
// console.log(resized);
ImageMat.mulConst(resized, ran);
ImageMat.addConst(resized, min);

Code.printMatlabArray(resized,"tz");


// throw ">";




	
	// ImageMat.pow(targetValues,0.1); 
	// ImageMat.pow(targetValues,0.5);
	// ImageMat.pow(targetValues,4.0); 



var heat = ImageMat.heatImage(targetValues, sourceWidth, sourceHeight, true);
// var img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), sourceWidth, sourceHeight);
// console.log(img);
	// ImageMat.normalFloat01(targetValues);
	// ImageMat.invertFloat01(targetValues);
	// ImageMat.normalFloat01(corners);
// ImageMat.add(corners,1.0);
		//ImageMat.pow(targetValues,0.10); 
		// ImageMat.pow(targetValues,4.0); 
		
		var iii = heat;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		// var wid = sourceWidth;
		// var hei = sourceHeight;
		//var img = GLOBALSTAGE.getFloatRGBAsImage(iii,iii,iii, wid,hei);
		var d = new DOImage(img);
		// d.matrix().scale(sca);
		// d.matrix().translate(10 + (sca*squ + spa)*i, 10);
		GLOBALSTAGE.addChild(d);

	
	

	/*
		using flat images : want to keep track of max and min => range
		using cornerness : want to keep track of max
	
		process:
			source = copy source image [gry]
			record = formatted source
			
			scaleCount = 5 [1=original, 2,4,8,16]

			recordCurr = record
			for each zoom:
				recordNext = halved recordCurr
				for each pixel:
					do window max operation on record
					recordNext[pixel] = result
		
		plot:
		for pixel i:
			location in record j = floor(i*2^-j)
		
		interpoloate on exponential scale


		plot single pixel & interpolated location



		plot ENTIRE IMAGE VALUE

	*/

	throw "... testDisplayZoom";
}


BeliefTest.prototype.handleMouseClickFxn = function(e){
	var location = e["location"];
	var lattice = this._lattice;
	var display = this._display;
	if(lattice && display){
		var OFFX = 1300;
		var OFFY = 300;
		var insides = this._insides;
		insides.removeAllChildren();
		insides.matrix().identity();
		// insides.matrix().scale(1,-1);
		insides.matrix().translate(OFFX,OFFY);
		var cellSize = lattice.cellSize();
		var viewA = this._views[0];
		var viewB = this._views[1];
		var imageA = viewA.image();
		var imageB = viewB.image();
		var widthA = imageA.width();
		var heightA = imageA.height();
		var widthB = imageB.width();
		var heightB = imageB.height();
		var p = new V2D(location.x % widthA, location.y % heightA);
		var cell = lattice.cellFromPoint(p);
		if(cell){
			//console.log(cell);
			var match = cell.match();

			if(match){
				console.log(match);
				var ordered = BeliefTest.Lattice.orientationTest(cell,match, true);
				// console.log("ORDERED: "+ordered);
				var affine = match.affine();
				// visualize match:
				// affine arrows
				var dirX = new V2D(1,0);
				var dirY = new V2D(0,1);
				var vecX = affine.multV2DtoV2D(dirX);
				var vecY = affine.multV2DtoV2D(dirY);
				var sss = 100/cellSize;
				var box = sss*cellSize*0.5;
				var d = new DO();
					d.graphics().setLine(1.0,0xFFFF0000);
					d.graphics().beginPath();
					d.graphics().moveTo(0,0);
					d.graphics().lineTo(dirX.x*box,dirX.y*box);
					d.graphics().strokeLine();
					d.graphics().endPath();

					d.graphics().setLine(1.0,0xFF0000FF);
					d.graphics().beginPath();
					d.graphics().moveTo(0,0);
					d.graphics().lineTo(dirY.x*box,dirY.y*box);
					d.graphics().strokeLine();
					d.graphics().endPath();


					insides.addChild(d);
// console.log(dirX+" & "+dirY);
// console.log(vecX+" & "+vecY);
				var d = new DO();
					d.graphics().setLine(1.0,0xFFCC6600);
					d.graphics().beginPath();
					d.graphics().moveTo(0,0);
					d.graphics().lineTo(vecX.x*box,vecX.y*box);
					d.graphics().strokeLine();
					d.graphics().endPath();

					d.graphics().setLine(1.0,0xFF0099CC);
					d.graphics().beginPath();
					d.graphics().moveTo(0,0);
					d.graphics().lineTo(vecY.x*box,vecY.y*box);
					d.graphics().strokeLine();
					d.graphics().endPath();

					// d.matrix().translate(2,2);
					insides.addChild(d);

					// square
					var d = new DO();
					d.graphics().setLine(1.0,0xFFFF0000);
					d.graphics().beginPath();
					// d.graphics().drawRect(-box*0.5,-box*0.5,box,box);
					d.graphics().moveTo(-box*vecX.x + -box*vecY.x,-box*vecX.y + -box*vecY.y);
					d.graphics().lineTo( box*vecX.x + -box*vecY.x, box*vecX.y + -box*vecY.y);
					d.graphics().lineTo( box*vecX.x +  box*vecY.x, box*vecX.y +  box*vecY.y);
					d.graphics().lineTo(-box*vecX.x +  box*vecY.x,-box*vecX.y +  box*vecY.y);
					d.graphics().endPath();
					d.graphics().strokeLine();
					
					insides.addChild(d);

					cell.forEachNeighbor8(function(n,ind){
						var m = n.match();
						if(m){
							var dirA = V2D.sub(m.pointA(),match.pointA());
							var preB = affine.multV2DtoV2D(dirA);
							var absB = V2D.add(match.pointB(),preB);
							var dirB = V2D.sub(m.pointB(),match.pointB());
							//var difB = V2D.sub();
// console.log(".   "+dirA+" -> "+preB);
								// var d = new DO();
								// d.graphics().setLine(1.0,0xFFFF0000);
								// d.graphics().beginPath();
								// //d.graphics().drawRect(-sss*0.5,-sss*0.5,sss,sss);
								// d.graphics().moveTo(-sss*dirX.x + -sss*dirY.x,-sss*dirX.y + -sss*dirY.y);
								// d.graphics().lineTo( sss*dirX.x + -sss*dirY.x, sss*dirX.y + -sss*dirY.y);
								// d.graphics().lineTo( sss*dirX.x +  sss*dirY.x, sss*dirX.y +  sss*dirY.y);
								// d.graphics().lineTo(-sss*dirX.x +  sss*dirY.x,-sss*dirX.y +  sss*dirY.y);
								// d.graphics().endPath();
								// d.graphics().strokeLine();
								// d.matrix().translate(OFFX,OFFY);
								// display.addChild(d);

								// expected:
								var d = new DO();
								d.graphics().setLine(1.0,0xFF00CC00);
								d.graphics().beginPath();
								d.graphics().drawCircle(preB.x*sss,preB.y*sss, 4.0);
								d.graphics().endPath();
								d.graphics().strokeLine();
								insides.addChild(d);
								// actual:
								var d = new DO();
								d.graphics().setLine(1.0,0xFF0000CC);
								d.graphics().beginPath();
								d.graphics().drawCircle(dirB.x*sss,dirB.y*sss, 4.0);
								d.graphics().endPath();
								d.graphics().strokeLine();
								insides.addChild(d);
								// diff
								var d = new DO();
								d.graphics().setLine(1.0,0x99000000);
								d.graphics().beginPath();
								d.graphics().moveTo(preB.x*sss,preB.y*sss);
								d.graphics().lineTo(dirB.x*sss,dirB.y*sss);
								d.graphics().endPath();
								d.graphics().strokeLine();
								insides.addChild(d);
								
						}
					});
				// SQUARE

				// var d = new DO();
				// 	d.graphics().setLine(1.0,0xFFFFFF00);
				// 	d.graphics().beginPath();
				// 	d.graphics().moveTo(0,0);
				// 	d.graphics().lineTo(vecX.x*sss,vecY.y*sss);
				// 	d.graphics().strokeLine();
				// 	d.graphics().endPath();
				// 	d.matrix().translate(OFFX,OFFY);
				// 	insides.addChild(d);

				// affine cell
				// d.graphics().drawRect(i*cellSize*displayScale,j*cellSize*displayScale, cellSize*displayScale,cellSize*displayScale);
				// position translation
				// neighbor discrepancies [4 & 8]
			}
		}
	}


}
BeliefTest.prototype.handleImageLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	var imageScale = 1.0;
	var matrixes = [];
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
		matrixes.push(matrix);
	}
	// var display = this._root;
	// display.matrix().scale(1.5);
	// GLOBALSTAGE = this._stage;


BeliefTest.testDisplayZoom(matrixes[0]);
throw "testing display zoom";


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
		this.resetDisplay();
	}else if(e.keyCode==Keyboard.KEY_LET_B){
		lattice.calcInfo();
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
/*
// FS_i_j:
// A: [191,133]./[408,306] = 0.27679   0.47619
// B: [167,150]./[408,306] = 0.40931   0.49020
matches = [{
			"fr": {"x":0.46814,"y":0.43464},
			"to": {"x":0.40931,"y":0.49020},
			"s": 1.0,
			"a": 0.0
		}];
*/

// ROOM
// 0 : [139.5,180.0]./[504,378] = 0.27540   0.47698
// 1 : [155,137]./[504,378] =  0.30754   0.36243
// 2 : [161.5,116.5]./[504,378] =   0.32044   0.30820
matches = [{
			"fr": {"x":0.27679,"y":0.47619},
			"to": {"x":0.32044,"y":0.30820},
			"s": 1.0,
			"a": 0.0
		}];

	// console.log(viewA,viewB);
	// console.log(matches);


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
		if(true){
		// if(i==9){
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
			queue.pushUnique(cell);
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
//	this.drawLattice();

//	lattice.seedIteration();

	lattice.iteration();
	
}
BeliefTest.prototype.resetDisplay = function(){
	this._display.removeAllChildren();
	this._insides.removeAllChildren();
	this._display.addChild(this._insides);
}
BeliefTest.prototype.drawLattice = function(e){ // TODO: ERROR THROWN -- likely bad looking match -- too close to neighbor ?
	this.resetDisplay();
	var displayScale = 1.0;
	var display = this._display;
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
		var alp = 0.250;
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
				var pointA = match.pointA(); // should be center
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
	
	// show outlines in B:
	for(var j=0; j<countY; ++j){
		for(var i=0; i<countX; ++i){
			var cell = lattice.cellFromColRow(i,j);
			var match = cell.match();
			if(match){
				var pointA = match.pointA();
				var pointB = match.pointB();
				var center = cell.center();
				var cellSize = lattice.cellSize();
				// var matrix = match.affine();
				// 	inverse = Matrix.inverse(matrix);
				// // B in A
				// var img = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,cellSize,cellSize, inverse);
				// img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
				// var d = new DOImage(img);
				// d.matrix().scale(displayScale);
				// //d.matrix().scale(2.0);
				// d.matrix().translate((center.x-cellSize*0.5)*displayScale,(center.y-cellSize*0.5)*displayScale);
				// display.addChild(d);
				// // A in B
				// var img = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,cellSize,cellSize, matrix);
				// img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
				// var d = new DOImage(img);
				// d.matrix().scale(displayScale);
				// d.matrix().translate(imageAWidth,0);
				// d.matrix().translate((pointB.x-cellSize*0.5)*displayScale,(pointB.y-cellSize*0.5)*displayScale);
				// display.addChild(d);



				var d = new DO();
				d.graphics().beginPath();
				d.graphics().setLine(1.0,0xFFFF0033);
				//d.graphics().drawRect(-cellSize*0.5*displayScale,-cellSize*0.5*displayScale,cellSize*displayScale,cellSize*displayScale);
				d.graphics().drawRect(0,0,cellSize*displayScale,cellSize*displayScale);
				//i*cellSize*displayScale,j*cellSize*displayScale, cellSize*displayScale,cellSize*displayScale);
				d.graphics().strokeLine();
				d.graphics().endPath();
				display.addChild(d);
				d.matrix().translate(imageAWidth,0);
				d.matrix().translate((pointB.x-cellSize*0.5)*displayScale,(pointB.y-cellSize*0.5)*displayScale);
			}
		}
	}


	// show calculated cells:
	var list = lattice._wasList;
	// console.log(list);
	if(list){
// console.log("WAS LIST "+list.length);
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
BeliefTest.Cell.prototype.expectedLocation = function(point, origin){
	var match = this.match();
	if(match){
		var pointA = origin!==undefined ? origin : match.pointA();
		var pointB = match.pointB();
		var diff = V2D.sub(point,pointA);
		diff = match.affine().multV2DtoV2D(diff,diff);
		return diff.add(pointB);
	}
	return null;
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
	if(matches.length>0){
		var lattice = this._lattice;
		var queue = lattice.queue();
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
			console.log(" ... add match -> pair :  NCC: "+bestMatch.scoreNCC()+" &  SAD: "+bestMatch.scoreSAD());
			Code.emptyArray(this._putativeMatches);
			this.setMatch(bestMatch);
			queue.pushUnique(this);
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
	var cell = this;

//	throw "need to make sure this match is not shitty"
	
	// affine cannot be too much different than any of 8 neighbors
		// dot products of x & y ?

	// actual points must all be within 90-180 deg of predicted line
		// dot > 0

	// actual points must be close enough to predicted location 

	// any 1 actual points can't have too much error: ~ ?

	// if predicted points are :
	// check invalid geometry:


	var ordered = BeliefTest.Lattice.orientationTest(cell,newMatch);

	





// these all have to be true && all neighbors must agree on new match as well ...


// orientationTest


		cell._previousMatch = cell._match;
		cell._match = newMatch;


//get best prediction for each of neighbors
	var lattice = cell._lattice;
	var paths = cell._paths;
	var neighbors = cell._neighbors4;
	var neighborKeys = Code.keys(neighbors);
	var queue = lattice.queue();
	for(var i=0; i<neighborKeys.length; ++i){
		var index = neighborKeys[i];
		var neighbor = neighbors[index];
		var pathMatch = lattice.bestMatchFromLocation(cell, newMatch.affine(),newMatch.pointA(),newMatch.pointB(), neighbor.center());
		// console.log("  "+i+" => "+pathMatch.scorePathNCC()+" & "+pathMatch.scorePathSAD());//+"   &&& "+pathMatch.s);
		if(lattice.matchValidation(cell,pathMatch)){
			paths[index] = pathMatch;
		}else{
			paths[index] = null;
		}
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





// THESE ^





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
//return 1;
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
	var sigmaLimitAffine = 1.9;
	var sigmaLimitTranslate = 1.9;
	var sigmaLimitNCC = 1.9;
	var sigmaLimitSAD = 1.9;
	var sigmaLimitPathNCC = 2.0;
	var sigmaLimitPathSAD = 2.0;
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
	// var keepAffine = true; // 
	// var keepTranslate = true; // 
	var keepAffine = scoreAffine < meanAffine + sigmaAffine*sigmaLimitAffine;
	var keepTranslate = scoreTranslate < meanTranslate + sigmaTranslate*sigmaLimitAffine;
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
BeliefTest.optimumScoresAtLocation = function(imageA,pointA, imageB,pointB, needleSize,haystackRelativeSize, matrix){
	var compareSize = BeliefTest.COMPARE_SIZE;
	var cellScale = (needleSize/compareSize);
	var haystackSize = Math.ceil((haystackRelativeSize/needleSize)*compareSize);
	var haystackSize = Math.max(haystackSize,compareSize);
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,cellScale,null,haystackSize,haystackSize, null);
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,cellScale,null,compareSize,compareSize, matrix);
	// find minimum of SAD:
		var scoresSAD = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
		var scoresNCC = R3D.normalizedCrossCorrelation(needle,null, haystack, true);
		var scoresMult = ImageMat.mulFloat(scoresSAD["value"],scoresNCC["value"]);
		var scoresAdd = ImageMat.addFloat(scoresSAD["value"],scoresNCC["value"]);
		var scores = {
			"width": scoresSAD["width"],
			"height": scoresSAD["height"],
			"value": scoresMult
			// "value": scoresSAD["value"]
		}
	return scores;
}
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
	// return 0;
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
		// console.log("  "+F+"");
		//console.log(info);
		console.log("  F: "+info["mean"]+" +/- "+info["sigma"]);
		this._Ffwd = F;
		this._Frev = F2;
		this._Fmean = info["mean"];
		this._Fsigma = info["sigma"];
	}else{
		this._F = null;
	}
}


BeliefTest.Lattice.prototype.calculateInfo = function(){
	var matchedCells = [];
	this.forEachCell(function(cell, i, j, index){
		var match = cell.match();
		if(match){
			matchedCells.push(cell);
		}
	});
	if(matchedCells.length>16){
		var info = {};

		var listSAD = [];
		var listNCC = [];
		var listMUL = [];
		var listF = [];
		for(var i=0; i<matchedCells.length; ++i){
			var cell = matchedCells[i];
			var match = cell.match();
			if(match){
				var scoreSAD = match.scoreSAD();
				var scoreNCC = match.scoreNCC();
				var scoreMUL = scoreNCC * scoreSAD;
				listSAD.push(scoreSAD);
				listNCC.push(scoreNCC);
				listMUL.push(scoreMUL);
				//listSAD.push(match.scoreSAD());
			}
		}
		// var fxnLess = function(a,b){
		// 	return a<b ? -1 : 1;
		// };
		// listSAD.sort(fxnLess);
		// listNCC.sort(fxnLess);
		// listMUL.sort(fxnLess);
		var minSAD = Code.min(listSAD);
		var minNCC = Code.min(listNCC);
		var minMUL = Code.min(listMUL);
		var sigSAD = Code.stdDev(listSAD,minSAD);
		var sigNCC = Code.stdDev(listNCC,minNCC);
		var sigMUL = Code.stdDev(listMUL,minMUL);
		info["SAD"] = {"mean":minSAD, "sigma":sigSAD};
		info["NCC"] = {"mean":minNCC, "sigma":sigNCC};
		info["MUL"] = {"mean":minMUL, "sigma":sigMUL};

		this._info = info;

	}else{
		this._info = null;
	}
}
BeliefTest.Lattice.prototype.dropGlobalMatches = function(remQueue){
	var Ffwd = this._Ffwd;
	var lattice = this;
	// var queue = lattice.queue();
	if(Ffwd){
		var limitErrorSigma = 2.0; // 1-2   1 stops propagation, 2 introduces lots of error
		var maxErrorF = lattice._Fmean + lattice._Fsigma*limitErrorSigma;
		var Frev = lattice._Frev;

		var infoAll = this._info;

		var meanSAD = infoAll["SAD"]["mean"];
		var meanNCC = infoAll["NCC"]["mean"];
		var meanMUL = infoAll["MUL"]["mean"];
		
		var sigmaSAD = infoAll["SAD"]["sigma"];
		var sigmaNCC = infoAll["NCC"]["sigma"];
		var sigmaMUL = infoAll["MUL"]["sigma"];

		var maxErrorSAD = meanSAD + 2.0*sigmaSAD;
		var maxErrorNCC = meanNCC + 2.0*sigmaNCC;
		var maxErrorMUL = meanMUL + 2.0*sigmaMUL;

		lattice.forEachCell(function(cell, i, j, index){
			var match = cell.match();
			if(match){
				var pointA = match.pointA();
				var pointB = match.pointB();
				var info = R3D.fundamentalErrorSingle(Ffwd,Frev,pointA,pointB);
				var error = info["error"];
				// console.log("  "+error);
				var scoreSAD = match.scoreSAD();
				var scoreNCC = match.scoreNCC();
				var scoreMUL = scoreNCC * scoreSAD;
				if(error>maxErrorF){
					cell.dropMatch();
					remQueue.pushUnique(cell);
//					queue.pushUnique(cell);
				}else if(scoreSAD>maxErrorSAD || scoreNCC>maxErrorNCC || scoreMUL>maxErrorMUL){
					cell.dropMatch();
					remQueue.pushUnique(cell);
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
	
	// var cellSize = 81;
	// var compareSize = 161;

	// var cellSize = 41;
	// var compareSize = 81;

	// largest:
	// var cellSize = 21;
	// var compareSize = 41;

	// average:
	var cellSize = 11;
	var compareSize = 21;

	// var cellSize = 5;
	// var compareSize = 11;

	// smallest
	// var cellSize = 1;
	// var compareSize = 5;

	// var cellSize = 3;
	// var compareSize = 7;


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
	var searchSize = Math.ceil(2*cellSize); // 2-3
	var best = BeliefTest.optimumLocation(imageA,centerA, imageB,pointB, compareSize,searchSize, matrix);
	var bestB = best["location"];
	// find optimal transform at center location
	vectorX = matrix.multV2DtoV2D(new V2D(1,0));
	vectorY = matrix.multV2DtoV2D(new V2D(0,1));
	var optimum = R3D.optimumAffineTransform(imageA,centerA, imageB,bestB, vectorX,vectorY, compareSize, 0);
	var matrix = BeliefTest.affineFromResult(optimum);
	// make match
	var cell = this;
	var match = lattice.newMatchFrom(cell, centerA, bestB, matrix);
	return match;
}
BeliefTest.Lattice.prototype.updateMatchFromSettings = function(cell, match){
	// var optimum = R3D.optimumAffineTransform(imageB,bestB, imageA,neighborCenter, vectorX,vectorY, cellSize, limitPixel,limitVAB,limitVAB);
		//bestB = V2D.add(optimum["O"], bestB);
		// bestB = V2D.sub(bestB,optimum["O"]);
	// var bestInverse = BeliefTest.affineFromResult(optimum);
	// var bestMatrix = Matrix.inverse(bestInverse);

	// TODO: update affine to better
	var newMatch = this.newMatchFrom(cell, match.pointA(), match.pointB(), match.affine(), null);
	return newMatch;
}
BeliefTest.Lattice.prototype._errorAffine = function(size){
	if(!this._errorAffineMatrix){
		var arr = [];
		var center = size*0.5;
		for(var i=0; i<size; ++i){
			for(var j=0; j<size; ++j){
				var index = j*size + i;
				var distance = Math.sqrt( Math.pow(center-i,2) +  Math.pow(center-j,2) );
				arr[index] = distance;
			}
		}
		this._errorAffineMatrix = arr; // 33 - 11 + 1 = 23
	}
	return this._errorAffineMatrix;
}
BeliefTest.COMPARE_SIZE = 11;
BeliefTest.Lattice.prototype.bestMatchFromLocation = function(cell, affine,centerA,centerB, existingA){ // 
	var locationB = this.bestAffineLocationFromLocation(affine,centerA,centerB, existingA);
	var compareSize = this.compareSize();
	// update affine
	var lattice = this;
	var imageA = lattice.viewA().image();
	var imageB = lattice.viewB().image();
	var vectorX = affine.multV2DtoV2D(new V2D(1,0));
	var vectorY = affine.multV2DtoV2D(new V2D(0,1));
	var limitPixel = 0.0;
	var limitVAB = 0.25;
	var optimum = R3D.optimumAffineTransform(imageA,existingA, imageB,locationB, vectorX,vectorY, compareSize, limitPixel,limitVAB,limitVAB);
	// console.log(optimum)
	var bestInverse = BeliefTest.affineFromResult(optimum);
	// new match
	var newMatch = lattice.newMatchFrom(cell, existingA, locationB, affine, null);
	return newMatch;
}
BeliefTest.Lattice.prototype.bestAffineLocationFromLocation = function(affine,centerA,centerB, existingA){ // use affine error + score error to find best location
	var deltaA = V2D.sub(existingA,centerA); // A to B
	var deltaB = affine.multV2DtoV2D(deltaA);
	var predictedB = V2D.add(centerB,deltaB);
	// get scores
	var lattice = this;
	var imageA = lattice.viewA().image();
	var imageB = lattice.viewB().image();
	var compareSize = lattice.compareSize();
	var needleSize = compareSize;
	var haystackSize = needleSize*3;
	var cellScale = (needleSize/BeliefTest.COMPARE_SIZE);
	//var finalSize = 11*3 - 11 + 1; //haystackSize - needleSize + 1;
//throw "is this right: "+centerA+" vs "+existingA;
	var scores = BeliefTest.optimumScoresAtLocation(imageA,centerA, imageB,predictedB, needleSize,haystackSize,affine);
	// console.log(scores);
	var finalSize = scores["width"];
	var score = scores["value"];
	var errorAffine = this._errorAffine(finalSize);
	// var cScore = 0.5;
	// var cAffine = 0.5;
	var cScore = 0.01;
	var cAffine = 0.99;
	var error = [];
	for(var i=0; i<score.length; ++i){
		error[i] = cScore * score[i] + cAffine * (errorAffine[i]*(1.0/compareSize));
	}
	// console.log(error);
	// console.log(predictedB)
	var minimum = BeliefTest.Lattice.minimumFromValues(error, finalSize, finalSize, predictedB, cellScale);
	var absoluteLocation = minimum["location"];
	return absoluteLocation;
}
BeliefTest.Lattice.minimumFromValues = function(values, valueWidth, valueHeight, pointB, cellScale){
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
	var p = new V2D(pointB.x + (-valueWidth*0.5 + peak.x)*cellScale, pointB.y + (-valueHeight*0.5 + peak.y)*cellScale);
	return {"location":p, "score":peak.z};
}
BeliefTest.Lattice.prototype.bestMatchFromSettings = function(match, cell, neighbor, pointBIn){
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
	var bestB = null;
	var limitPixel = cellSize*0.5;
	var limitVAB = 0.25;
	// var searchSize = cellSize*4;
	var searchSize = cellSize*2;
	// if(pointBIn){
	// 	bestB = pointBIn;
	// 	limitPixel = 0;
	// 	limitVAB = 0.10;
	// }else{
		var optimumLocation = BeliefTest.optimumLocation(imageA,neighborCenter, imageB,predictB, cellSize,searchSize, matrix,   false);
		bestB = optimumLocation["location"];
	// }
	// optimum transform
	var vectorX = inverse.multV2DtoV2D(new V2D(1,0));
	var vectorY = inverse.multV2DtoV2D(new V2D(0,1));
	// console.log("B: "+vectorX+" & "+vectorY);
	var optimum = R3D.optimumAffineTransform(imageB,bestB, imageA,neighborCenter, vectorX,vectorY, cellSize, limitPixel,limitVAB,limitVAB);
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

/*
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
*/


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
	//if(originMatch){
	if(false){ // IGNORE RELATIVES
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
BeliefTest.Lattice.orientationTest = function(cell, match, verbose){
	//	console.log(cell)
	var orderA = [];
	var orderB = [];
	var matchA = match.pointA();
	var matchB = match.pointB();
	var affine = match.affine();
	var neighbors = [];
	cell.forEachNeighbor8(function(neighbor,i){
		var m = neighbor.match();
		if(m){
			neighbors.push(neighbor);
			var mA = m.pointA();
			var mB = m.pointB();
			var a = V2D.sub(mA,matchA);
			var b = V2D.sub(mB,matchB);
			var angleA = V2D.angleDirection(V2D.DIRX,a);
			var angleB = V2D.angleDirection(V2D.DIRX,b);
				angleA = Code.angleZeroTwoPi(angleA);
				angleB = Code.angleZeroTwoPi(angleB);
			orderA.push([angleA,i]);
			orderB.push([angleB,i]);
		}
	});
	var count = orderA.length;

	
	var maxAngle = Math.PI*0.5; // 90 degrees = half plane | 45 degrees = quadrant
	var maxDistanceRatio = 4.0; //
	for(var i=0; i<neighbors.length; ++i){
		var neighbor = neighbors[i];
		var m = neighbor.match();
		var mA = m.pointA();
		var mB = m.pointB();
		var a = V2D.sub(mA,matchA);
		var b = V2D.sub(mB,matchB);
		var c = affine.multV2DtoV2D(a);
		var angle = V2D.angle(b,c);
		// half-plane - angle checking
		if(angle>maxAngle){
			return false;
		}
		// maximum distance checking
		var distanceB = b.length();
		var distanceC = a.length();
		var ratio = Math.max(distanceB,distanceC) / Math.min(distanceB,distanceC);
		if(ratio>maxDistanceRatio){
			return false;
		}
		
	}
	





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
	if(verbose){
		console.log(orderA);
		console.log(orderB);
		console.log(0+" = "+j);
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
BeliefTest.AffineMetric = function(affine){ // ignores rotation & scale, metric for 'deformation' of a matrix -- skewnessish
	var a = affine.get(0,0);
	var b = affine.get(1,0);
	var c = affine.get(0,1);
	var d = affine.get(1,1);
	var eig = Code.eigenValuesAndVectors2D(a,b,c,d);
	var eigenValues = eig["values"];
	var valueSma = eigenValues[0];
	var valueBig = eigenValues[1];
	var valueRatio = valueBig/valueSma;
	return valueRatio;
}
BeliefTest.Lattice.prototype.matchValidation = function(cell, match){
	if(!match){
		return false;
	}
	var lattice = this;

	// affine matrix has a limit:
	var affine = match.affine();
	var a = affine.get(0,0);
	var b = affine.get(1,0);
	var c = affine.get(0,1);
	var d = affine.get(1,1);
	var eig = Code.eigenValuesAndVectors2D(a,b,c,d);
	// console.log(a,b,c,d);
	var eigenValues = eig["values"];
	var eigenVectors = eig["vectors"];
	var valueSma = eigenValues[0];
	var valueBig = eigenValues[1];
	var vectorSma = eigenVectors[0];
	var vectorBig = eigenVectors[1];
	var valueRatio = valueBig/valueSma;
	// console.log("RATIO: "+valueRatio+" = "+valueBig+" | "+valueSma);
	var maxRatio = 2.0;
	if(valueRatio>maxRatio){
		// console.log("DROP SCALE RATIO: "+valueRatio);
		return;
	}
	// angle limit
	//var angle = V2D.angle(vectorSma,vectorBig);




	// ordering constraints
	var ordered = BeliefTest.Lattice.orientationTest(cell,match);
	if(!ordered){
		// console.log("DROP ORDERING");
		return false;
	}
	/*
	// TODO: use affine average scale to determine limits
	// var minDistanceScale = 0.5;
	// var maxDistanceScale = 2.0;
	var minDistanceScale = 0.25;
	var maxDistanceScale = 4.0;
	
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
				console.log("DROP DISTANCES");
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
		// console.log("DROP OUTSIDE");
		return false;
	}

	// max distance constraint

	// minimum range
	
	// var minimumRange = 0.02; // TODO: per pixel range 0.01 / 1 is ok, 0.05 / 100 is ok
	// // console.log(match.range());
	// if(match.range()<minimumRange){
	// 	return false;
	// }
	var range = match.range();
	
	// minimum variabliity
	/*
	// min uniqueness
	var minUniquenessNCC = 0.001;
	var uniqueness = match.uniqueness();
	// console.log("   uniqueness "+uniqueness);
	if(uniqueness<minUniquenessNCC){
		console.log("DROP UNIQUENESS");
		return false;
	}
	*/
	
// TODO: SAD * range ???
	var scoreSAD = match.scoreSAD();
	var scoreNCC = match.scoreNCC();
	var scoreMult = scoreSAD * scoreNCC;

var rangeSAD = scoreSAD/range;
var rangeNCC = scoreNCC/range;
console.log("RANGE CHECK: "+range+" => "+rangeSAD+" & "+rangeNCC);
	/*
	if(rangeSAD>1.0){
		return false;
	}
	if(rangeNCC>1.0){
		return false;
	}
	*/

	// score constraints
	
	//if(scoreSAD>0.525){
	if(scoreSAD>0.40){
		console.log("DROP SCORE SAD: "+scoreSAD);
		return false;
	}
	if(scoreNCC>0.60){
		console.log("DROP SCORE NCC: "+scoreNCC);
		return false;
	}
	// if(scoreMult>0.40*0.40){
	// 	console.log("DROP SCORE MULT: "+scoreMult);
	// 	return false;
	// }

	// // TESTING
	// if(scoreMult>0.50){ // 0.707^2
	// 	console.log("DROP SCORE DOU: "+scoreMult);
	// 	return false;
	// }
	
	
	/*
	// relative path costs
	var scorePathSAD = match.scorePathSAD();
	var scorePathNCC = match.scorePathNCC();
	var maxPathNCC = 0.50;
	var maxPathSAD = 0.40;
	if(scorePathSAD>maxPathSAD){
		console.log("DROP PATH SAD");
		return false;
	}
	if(scorePathNCC>maxPathNCC){
		console.log("DROP PATH NCC "+scorePathNCC);
		return false;
	}
	*/
	/*
	var relativePathSAD = match.scoreRelativePathSAD();
	var relativePathNCC = match.scoreRelativePathNCC();
	// ~2-4
	var maxRelativeNCC = 4.0;
	var maxRelativeSAD = 4.0;
	if(relativePathSAD>maxRelativeSAD){
		console.log("DROP RELATIVE SAD");
		return false;
	}
	if(relativePathNCC>maxRelativeNCC){
		console.log("DROP RELATIVE NCC");
		return false;
	}
	*/
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
	var p = new V2D();
	var cellSize = lattice.cellSize();
	var compareSize = lattice.compareSize();
	var viewA = lattice.viewA();
	var viewB = lattice.viewB();
	var imageA = viewA.image();
	var imageB = viewB.image();
var addQueue = new PriorityQueue(BeliefTest.Lattice._cellOrdering);
var remQueue = new PriorityQueue(BeliefTest.Lattice._cellOrdering);

console.log("Q SIZE: "+queue.length()+" / "+lattice._cells.length);
if(queue.length()>2000){
	throw "???"
}

	var list = queue.toArray();
	this._wasList = list;
	queue.clear();
/*
	// calculate error gradient
	for(var i=0; i<list.length; ++i){
		var cell = list[i];
		var cellMatch = cell.match();
		if(!cellMatch){
			continue;
		}
		// get 3x3 error grid
		var error = this.errorSquare3x3(cell, cellMatch);
		var minimum = Code.findMinima2DFloat(error, 3,3);
		var errorCurrent = error[1*3 + 1]; // center error
		var gradient = null;
		if(minimum && minimum.length==1){
			minimum = minimum[0];
			// console.log(" > has minimum @ "+minimum);
			// console.log(minimum);
			gradient = new V2D(minimum.x - 1, minimum.y - 1);
		}else{
			gradient = ImageMat.scharrGradient(error,3,3, 1,1);
			gradient.scale(-1); // toward minimum
			// console.log(" > gradient "+gradient);
			gradient.norm(); // always 1 .... 0
			gradient.scale(0.5);
		}
		var dir = gradient.copy();
		// UPDATE NEW POSITION IF BETTER THAN OLD POSITION
		var oldPointB = cellMatch.pointB();
		var newPointB = oldPointB.copy().add(dir);
		cellMatch.pointB(newPointB)
		var newMatch = lattice.updateMatchFromSettings(cell, cellMatch);
			cellMatch.pointB(oldPointB);
		var error = this.errorSquare3x3(cell, newMatch);
		var errorNext = error[1*3 + 1]; // center error
		// console.log(newMatch);
		scoreRatio = newMatch.scoreNCC()/cellMatch.scoreNCC();

		var errorRatio = errorNext/errorCurrent;
		// console.log("ERRORS: "+errorRatio+" @ "+errorCurrent+" -> "+errorNext);
		// console.log(scoreRatio);
		// if(scoreRatio<1.0){
		//if(errorRatio<1.0){
// something better?
		if(errorRatio<0.990){
			cell._match = newMatch;
			addQueue.pushUnique(cell);
		}else{
			gradLen = 0; // NO MORE
		}
	}
*/

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
			if( 
				count>6 && percent<0.60 ||  // 2/7 = 0.28 | 3/7 = 0.42 | 4/7 = 0.57 | 5/7 = 0.71 | 6/7
				// count>6 && percent<0.80 || 
			   count>4 && percent<0.50 ||  // 2/5 = 0.40 | 3/5 = 0.60
			   // count>4 && percent<0.70 ||  
			   count>2 && percent<0.40 // 1/3 = .33 | 2/3 = 0.66
			   // count>2 && percent<0.60
				){
				console.log("DROP MATCH");
				cell.dropMatch();
				remQueue.pushUnique(cell);
				// cell._previousMatch = null;
			}
		}
	}

	
	// add possible neighbors
	for(var i=0; i<list.length; ++i){
		var cell = list[i];
		var match = cell.match();
		if(match){
			cell.forEachNeighbor4(function(neighbor,index){
				var neighborMatch = neighbor.match();
				if(!neighborMatch){
					// console.log("try adding new");
					var prevMatch = neighbor._previousMatch;
					var pathMatch = null;
					// TODO - allow new matches if some case ?
					var setMatch = true;
					var attempted = false;
					if(prevMatch){
						// console.log(prevMatch);
						// if score is different ?
						attempted = true;
						setMatch = false;
						pathMatch = lattice.bestMatchFromSettings(match, cell, neighbor);
						if(pathMatch && lattice.matchValidation(neighbor,pathMatch)){
							// second chance to update match ?
							// console.log(pathMatch,prevMatch);
							var prevScore = 1;
							if(match && pathMatch){
								var prevScoreSAD = pathMatch.scoreSAD()/match.scoreSAD();
								var prevScoreNCC = pathMatch.scoreNCC()/match.scoreNCC();
								prevScore = Math.min(prevScoreSAD,prevScoreNCC);
							}
							// console.log("  prevScore: "+prevScore);
							//if(prevScore<0.95){
							if(true){
								setMatch = true;
							}
						}
					}


					if(setMatch){
						//console.log("add a neighbor match : "+neighbor._previousMatch);
						if(!attempted){ // try now
							pathMatch = lattice.bestMatchFromSettings(match, cell, neighbor);
							if(!lattice.matchValidation(neighbor,pathMatch)){
								pathMatch = null;
							}
						}
						if(pathMatch){
							neighbor.setMatch(pathMatch);
							addQueue.pushUnique(neighbor);
						}
					}
				}
			});
		}
	}

	/*

for each cell in L
	for each 4/8-neighbor:
		if neighbor doesn't have a match
			if have prior neighbor preduction, use this
			else predict best matching location for neighbor & store
			if prediction is much better than neighbor's initial / final score
				set neighbor match
				add neighbor to Q (need to validate/adjust)

	*/

	// global criteria evaluation
	lattice.calculateF();
	lattice.calculateInfo();
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
			queue.pushUnique(cell);
		}
	}
	for(var i=0; i<remList.length; ++i){
		var cell = remList[i];
		queue.pushUnique(cell);
	}

	// add all 4-neighbors of remaining cells
	var list = queue.toArray();
	queue.clear();
	for(var i=0; i<list.length; ++i){
		var cell = list[i];
		cell.forEachNeighbor8(function(neighbor,index){
			queue.pushUnique(neighbor);
		});
		queue.pushUnique(cell);
	}

}
BeliefTest.Lattice.prototype.calcInfo = function(cell, cellMatch){
	var lattice = this;
	var cells = lattice._cells;

	var listSAD = [];
	var listNCC = [];
	var listMUL = [];
	var listF = [];
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		var match = cell.match();
		if(match){
			var scoreSAD = match.scoreSAD();
			var scoreNCC = match.scoreNCC();
			var scoreMUL = scoreNCC * scoreSAD;
			listSAD.push(scoreSAD);
			listNCC.push(scoreNCC);
			listMUL.push(scoreMUL);
			//listSAD.push(match.scoreSAD());
		}
	}
	var fxnLess = function(a,b){
		return a<b ? -1 : 1;
	};
	listSAD.sort(fxnLess);
	listNCC.sort(fxnLess);
	listMUL.sort(fxnLess);
	Code.printMatlabArray(listSAD, "sad");
	Code.printMatlabArray(listNCC, "ncc");
	Code.printMatlabArray(listMUL, "mul");
}


BeliefTest.Lattice.prototype.errorSquare3x3 = function(cell, cellMatch){
throw "?";
	var lattice = this;
	//
	var pointA = cellMatch.pointA();
	var pointB = cellMatch.pointB();
	//var cG = 0.50;
	var cG = 0.50;
	var eG = 1.0;
	var cN = 0.50;
	var eN = 1.0;
	var p = new V2D();
	var cellSize = lattice.cellSize();
	var compareSize = lattice.compareSize();
	var viewA = lattice.viewA();
	var viewB = lattice.viewB();
	var imageA = viewA.image();
	var imageB = viewB.image();
	
	var needleSize = 11;
	var cellScale = (needleSize/compareSize);
	var haystackSize = compareSize + 2; // get a 3x3
	// needle + haystack
	var matrix = cellMatch.affine();
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,cellScale,null,compareSize,compareSize, null);
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,cellScale,null,haystackSize,haystackSize, matrix);
	// find minimum of SAD:
	var scoresSAD = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
	var scoresNCC = R3D.normalizedCrossCorrelation(needle,null, haystack, true);
	scoresSAD = scoresSAD["value"];
	scoresNCC = scoresNCC["value"];
	// console.log(scoresNCC);
	var ncc = scoresSAD;
	// get geometric error
	var geo = [];
	var ind = 0;
	for(var ii=-1; ii<=1; ++ii){
		for(var jj=-1; jj<=1; ++jj){
			var totalError = 0;
			p.set(pointB.x + ii, pointB.x + jj);
			var totalCount = 0;
			cell.forEachNeighbor8(function(neighbor,index){
				var neighborMatch = neighbor.match()
				if(neighborMatch){
					totalCount += 1;
					// cell->neighbor
					var expectedB = neighbor.expectedLocation(pointA);
					var diff = V2D.distance(expectedB,p);
					totalError += diff;
					// neighbor->cell
					var expectedA = cell.expectedLocation(neighborMatch.pointA(), p);
					var diff = V2D.distance(expectedA,neighborMatch.pointB());
					totalError += diff;
				}
			});
			if(totalCount>0){
				//totalError /= cellSize; // normalize for hierarchical comparrision
				// totalError /= totalCount; // normalize average error ?
			}
			geo[ind] = totalError;
			++ind;
		}
	}

	// get total error
	var error = [];
	// TODO: should this pre - subtract minimum ?
	// var min = Code.min(geo);
	// for(var j=0; j<geo.length; ++j){
	// 	geo[j] -= min;
	// }
	//
	for(var j=0; j<geo.length; ++j){
		error[j] = cG*Math.pow(geo[j],eG) + cN*Math.pow(ncc[j],eN);
	}
	// console.log(ncc,geo,error);
	// console.log(geo);
	// estimate gradient
	//var gradient = ImageMat.scharrGradient(error,3,3, 1,1);
	// var gradient = ImageMat.gradientVector(error,3,3, 1,1);
	//console.log(ImageMat.gradientVector(error,3,3, 1,1)+" / "+ImageMat.scharrGradient(error,3,3, 1,1));
	//cell._errorGradient = gradient;

	// var d = error;
	//var minimum = Code.extrema2DFloatInterpolate(new V3D(), d[0],d[1],d[2],d[3],d[4],d[5],d[6],d[7],d[8]);
	return error;
}

BeliefTest.Lattice.prototype.iterationOLD = function(e){
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
						if(bestMatch==null ||
							(match.scoreSAD()<bestMatch.scoreSAD() && match.scoreNCC()<bestMatch.scoreNCC())
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
			var prevScore = 1.0;
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
				addQueue.pushUnique(cell);
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
				remQueue.pushUnique(cell);
//				cell._previousMatch = null;
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
			queue.pushUnique(cell);
		}
	}
	for(var i=0; i<remList.length; ++i){
		var cell = remList[i];
		queue.pushUnique(cell);
	}

	// add all 4-neighbors of remaining cells
	var list = queue.toArray();
	queue.clear();
	for(var i=0; i<list.length; ++i){
		var cell = list[i];
		cell.forEachNeighbor4(function(neighbor,index){
			queue.pushUnique(neighbor);
		});
		queue.pushUnique(cell);
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






