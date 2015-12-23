// Stitching.js

function Stitching(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._keyboard = new Keyboard();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleEnterFrame,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDownFxn,this);
	this._keyboard.addListeners();
	// resources
	this._resource = {};
	//
	var imageList, imageLoader;
	// import image to work with
	imageList = ["snow1.png","snow2.png"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleSceneImagesLoaded,null);
	imageLoader.load();
}
Stitching.prototype.drawPolygon = function(pointList, colorLine, colorFill, lineWidth, complete){
	complete = complete!==undefined ? complete : true;
	var i=0, len=pointList.length;
	if(len<=1){ return; }
	colorLine = colorLine!==undefined ? colorLine : 0xFFFF0000;
	lineWidth = lineWidth!==undefined ? lineWidth : 1.0;
	colorFill = colorFill!==undefined ? colorFill : 0x9900FF00;
	var d = new DO();
	d.graphics().setLine(lineWidth,colorLine);
	d.graphics().beginPath();
	d.graphics().setFill(colorFill);
	for(i=0; i<len; ++i){
		if(!complete){
			if(i==len-1){
				break;
			}
		}
var ext = 0.0;
		var offAX = ext*(Math.random()-0.5);
		var offAY = ext*(Math.random()-0.5);
		var offBX = ext*(Math.random()-0.5);
		var offBY = ext*(Math.random()-0.5);
		var pA = pointList[i];
		var pB = pointList[(i+1)%len];
		var dir = V2D.sub(pB,pA); dir.norm();
		//var nrm = V2D.rotate(dir,Math.PIO2);
		var ang = 20.0*(Math.PI/180.0);
		var siz = 15.0;
		var lin1 = V2D.rotate(dir,Math.PI-ang);
		var lin2 = V2D.rotate(dir,-(Math.PI-ang));
			lin1.scale(siz);
			lin2.scale(siz);
		//d.graphics().beginPath();
		d.graphics().moveTo(pA.x+offAX,pA.y+offAY);
		d.graphics().lineTo(pB.x+offBX,pB.y+offBY);
			d.graphics().lineTo(pB.x+offBX+lin1.x,pB.y+offBY+lin1.y);
			d.graphics().lineTo(pB.x+offBX+lin2.x,pB.y+offBY+lin2.y);
			d.graphics().lineTo(pB.x+offBX,pB.y+offBY);
		//d.graphics().endPath();
		d.graphics().strokeLine();
	}
	d.graphics().fill();
	d.graphics().endPath();
	this._root.addChild(d);
	return d;
}
Stitching.prototype.handleKeyboardDownFxn = function(e){
	if(e.keyCode==Keyboard.KEY_SPACE){
		this.iteration = this.iteration!==undefined ? this.iteration+1 : 0;
		this.testPolyPoly();
	}
}
Stitching.prototype.testPolyPoly = function(){
//	console.log(this.iteration);
	var polyA = [];
		polyA.push(new V2D(240,250));
		polyA.push(new V2D(270,200));
		//polyA.push(new V2D(100,100));
		//polyA.push(new V2D(300,100));
		polyA.push(new V2D(10,20));
	var polyB = [];
		polyB.push(new V2D(80,270));
		polyB.push(new V2D(250,20));
		//polyB.push(new V2D(100,20));
		polyB.push(new V2D(100,150));
		/*
	// rectangles
	var polyA = [];
		polyA.push(new V2D(50,50));
		polyA.push(new V2D(50,250));
		polyA.push(new V2D(350,250));
		polyA.push(new V2D(350,50));
	var polyB = [];
		polyB.push(new V2D(10,100));
		polyB.push(new V2D(10,400));
		polyB.push(new V2D(400,400));
		polyB.push(new V2D(400,100));
	// rectangles shared edges
	var polyA = [];
		polyA.push(new V2D(150,150));
		polyA.push(new V2D(150,250));
		polyA.push(new V2D(400,250));
		polyA.push(new V2D(400,150));
	var polyB = [];
		polyB.push(new V2D(10,100));
		polyB.push(new V2D(10,400));
		polyB.push(new V2D(400,400));
		polyB.push(new V2D(400,100));
		*/
	var polyC = Code.polygonUnion2D(polyA,polyB, this.iteration);
	console.log(polyC)


this._root.removeAllChildren();
	this.drawPolygon(polyA, 0xFFCC0000, 0xFFCC0000, 2.0);
	this.drawPolygon(polyB, 0xFF00CC00, 0xFF00CC00, 2.0);
	//this.drawPolygon(polyC, 0xFF0000CC, 0x00000000, 1.5);
	console.log("DRAW ARROWS: "+polyC.length);
	for(i=0;i<polyC.length;++i){
		var con = polyC[i];
		//V2D.shiftPoints(con,Math.random()*50.0, Math.random()*25.0); // XOR is grouped
		this.drawPolygon(con, 0xFF0000CC, 0xFF0000CC, 1.0, false);
		// for(j=0;j<con.length;++j){
		// 	this.drawPolygon(con[j], 0xFF0000CC, 0x00000000, 2.0);
		// }
	}
}
Stitching.prototype.testGraph = function(){
	var graph = new Graph();
	var v, e;
	/*
	var vs,v2,v3,v4,v5,vt;
	// vertexes
	v = graph.addVertex();
	v.id("s");
	vs = v;
	v = graph.addVertex();
	v.id("2");
	v2 = v;
	v = graph.addVertex();
	v.id("3");
	v3 = v;
	v = graph.addVertex();
	v.id("4");
	v4 = v;
	v = graph.addVertex();
	v.id("5");
	v5 = v;
	v = graph.addVertex();
	v.id("t");
	vt = v;
	// edges
	graph.addEdge(vs,v2, 3, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(vs,v3, 3, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(vs,v4, 2, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v2,v4, 1, Graph.Edge.DIRECTION_REVERSE);
	graph.addEdge(v2,v5, 4, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v3,v4, 1, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v3,vt, 2, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v4,v5, 1, Graph.Edge.DIRECTION_REVERSE);
	graph.addEdge(v4,vt, 2, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v5,vt, 1, Graph.Edge.DIRECTION_FORWARD);
	*/
	var vs,v1,v2,v3,v4,v5,v6,vt;
	v = graph.addVertex();
	v.id("s");
	vs = v;
	v = graph.addVertex();
	v.id("1");
	v1 = v;
	v = graph.addVertex();
	v.id("2");
	v2 = v;
	v = graph.addVertex();
	v.id("3");
	v3 = v;
	v = graph.addVertex();
	v.id("4");
	v4 = v;
	v = graph.addVertex();
	v.id("5");
	v5 = v;
	v = graph.addVertex();
	v.id("6");
	v6 = v;
	v = graph.addVertex();
	v.id("t");
	vt = v;
	graph.addEdge(vs,v1, 10,Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(vs,v2, 5, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(vs,v3, 15,Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v1,v2, 4, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v1,v4, 9, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v1,v5, 15,Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v2,v3, 4, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v2,v5, 8, Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v2,v6, 6, Graph.Edge.DIRECTION_REVERSE);
	graph.addEdge(v3,v6, 16,Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v4,v5, 15,Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v4,vt, 10,Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v5,v6, 15,Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v5,vt, 10,Graph.Edge.DIRECTION_FORWARD);
	graph.addEdge(v6,vt, 10,Graph.Edge.DIRECTION_FORWARD);

	console.log(graph);
	console.log(graph.toString());

	var path = graph.BFS(vs,vt);
	console.log(path);

	var cut = graph.minCut(vs,vt);
	console.log(cut);
	for(var i=0;i<cut.length;++i){
		console.log(cut[i].toString());
	}
}
Stitching.prototype.testWatershed = function(imageInfo){
	var imageList = imageInfo.images;
	var i, j, list = [], d, img, x=0, y=0;
	for(i=0;i<imageList.length;++i){
		img = imageList[i];
		list[i] = img;
		d = new DOImage(img);
//		this._root.addChild(d);
			d.matrix().translate(400.0,0.0);
		break;
	}
	var imageGray = this._stage.getImageAsFloatGray(img);
	var wid = imageGray.width;
	var hei = imageGray.height;
	var sigma = 1.4; // 1.4;
	var imageGrayFloat = imageGray.gray;
	var imageGrayFloatGauss = ImageMat.applyGaussianFloat(imageGrayFloat,wid,hei, sigma);
	//

	//var watershed = ImageMat.watershed(imageGrayFloat,wid,hei);
	var watershed = ImageMat.watershed(imageGrayFloatGauss,wid,hei);
	console.log(watershed.length);
	var imgGroups = this.colorImageWithGroups(watershed,wid,hei);
	img = this._stage.getFloatARGBAsImage(imgGroups.alp,imgGroups.red,imgGroups.grn,imgGroups.blu,wid,hei, null);
	d = new DOImage(img);
	this._root.addChild(d);
	d.matrix().translate(400.0,0.0);
	d.graphics().alpha(0.5);
}
Stitching.prototype.colorImageWithGroups = function(groups, width, height){
	var i, j, p, len, len2, group, index;
	var pixels = width*height;
	var imageRed = Code.newArrayZeros(pixels);
	var imageGrn = Code.newArrayZeros(pixels);
	var imageBlu = Code.newArrayZeros(pixels);
	var imageAlp = Code.newArrayZeros(pixels);
	len = groups.length;
	//var colors = new Array(5); for(i=0;i<colors.length;++i){ colors[i] = i/(colors.length-1);
	var countRed = 7;
	var countGrn = 11;
	var countBlu = 13;
	for(i=0;i<len;++i){
		group = groups[i];
		//image[i] = colors[group % colors.length];
		imageRed[i] = (group % countRed)/(countRed-1);
		imageGrn[i] = (group % countBlu)/(countBlu-1);
		imageBlu[i] = (group % countGrn)/(countGrn-1);
		imageAlp[i] = 1.0;
	}
	return {"red":imageRed, "blu":imageBlu, "grn":imageGrn, "alp":imageAlp};
}
Stitching.prototype.handleSceneImagesLoaded = function(imageInfo){

// this.testPolyPoly();
// return;

// this.testGraph();
// return;

// this.testWatershed(imageInfo);
// return;


	var imageList = imageInfo.images;
	var i, j, list = [], d, img, x=0, y=0;
var featurePoints = [];
var features = [];
var matrixOffY = 50;
var matrixOffX = 400.0;
	for(i=0;i<imageList.length;++i){
		img = imageList[i];
		list[i] = img;
		d = new DOImage(img);
		this._root.addChild(d);
if(i==0){
	d.removeParent();
}
// d.addFunction(Canvas.EVENT_MOUSE_DOWN,function(e){
// 	console.log(e);
// 	console.log("down");
// 	d.moveToFront();
// },d);
		d.moveToBack();
		d.enableDragging();
		d.matrix().identity();
		d.matrix().translate(x,y+matrixOffY);
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().endPath();
		d.graphics().strokeLine();
		//
		var imageMat = this._stage.getImageAsFloatGray(img);
		var points = R3D.pointsCornerDetector(imageMat.gray, imageMat.width,imageMat.height);
		var fxn = function(a,b){
			if(b.z>a.z){
				return 1;
			}else if(b.z<a.z){
				return -1;
			}
			return 0;
		}
		points = points.sort( fxn );

		Code.truncateArray(points,30);
			// var gray = this._stage.getFloatGrayAsImage(points, imageMat.width,imageMat.height, null);
			// d = new DOImage(gray);
			// d.matrix().identity().translate(x,gray.height);
			// this._root.addChild(d);
			for(j=0;j<points.length;++j){
				//console.log(points[j].z);
				var point = points[j];
				var r = 0xFF;
				var g = 0x00;
				var b = 0x00;
				var size = 1 + points[j].z*100000.0;
				var pnt = R3D.drawPointAt(point.x,point.y, r,g,b, size);
//				d.addChild(pnt);
				var winSize = 25;
				var sigma = null;//1.6;
				var scale = 0.50;
				var px = point.x;
				var py = point.y;
				var matrix = new Matrix(3,3).identity();
				var win = ImageMat.extractRectFromFloatImage(px,py,scale,sigma, winSize,winSize, imageMat.gray,imageMat.width,imageMat.height, matrix);
					var obj = R3D.gradientDirection(win,winSize,winSize);
					var primaryAngle = obj.angle;
					matrix = Matrix.transform2DRotate( new Matrix(3,3).identity(), -primaryAngle);
					win = ImageMat.extractRectFromFloatImage(px,py,scale,sigma, winSize,winSize, imageMat.gray,imageMat.width,imageMat.height, matrix);
// ORIENTATE IMAGE ST PRIMARY GRADIENT DIRECTION IS HORIZONTAL IN +X
				var feature = {center:point,image:win,matches:[]};
					var iii = this._stage.getFloatGrayAsImage(win, winSize,winSize, null);
					var e = new DOImage(iii);
					//e.matrix().identity().translate(Math.random()*400,Math.random()*100);
					e.matrix().identity().translate(j*winSize,i*winSize);
//					this._root.addChild(e);
				points[j] = feature;
			}
features.push(points);
		x += img.width;
		y += 0;
	}
	// find best matches in featuresA / B
	//for(j=0;j<features.length;++j){
		//var list = features[j];
		var featureA, featureB;
		var listA = features[0];
		var listB = features[1];
		for(i=0;i<listA.length;++i){
			featureA = listA[i];
			for(j=0;j<listB.length;++j){
				featureB = listB[j];
				var ssd = Code.SSDEqual(featureA.image, featureB.image);
				featureA.matches.push({feature:featureB, score:ssd});
				featureB.matches.push({feature:featureA, score:ssd});
			}
			//console.log("feat: "+feature.center);
		}
		// sort matches by lowest score
		var sortScore = function(a,b){
			if(b.score<a.score){
				return 1;
			}else if(b.score>a.score){
				return -1;
			}
			return 0;
		}
		for(i=0;i<listA.length;++i){
			featureA = listA[i];
			featureA.matches.sort(sortScore);
		}
		for(i=0;i<listB.length;++i){
			featureB = listB[i];
			featureB.matches.sort(sortScore);
		}
var matches = [];
		// matches are valid of they are both at top
		for(i=0;i<listA.length;++i){
			featureA = listA[i];
			featureB = featureA.matches[0].feature;
			featureC = featureB.matches[0].feature;
			if(featureA==featureC){
				var e = new DO();
				e.graphics().setLine(1.0,0xFF0000FF);
				e.graphics().beginPath();
				e.graphics().moveTo(featureA.center.x,featureA.center.y);
				e.graphics().lineTo(featureB.center.x+400,featureB.center.y);
				e.graphics().endPath();
				e.graphics().strokeLine();
//				this._root.addChild(e);
				size = 15;
				r = 0x00;
				g = 0x00;
				b = 0xFF;
				pnt = R3D.drawPointAt(featureA.center.x,featureA.center.y, r,g,b, size);
//				this._root.addChild(pnt);
				pnt = R3D.drawPointAt(featureB.center.x+400,featureB.center.y, r,g,b, size);
//				this._root.addChild(pnt);
				matches.push({A:featureA, B:featureB});
			}
		}
		// 
console.log("matches: "+matches.length);
// searching for best fit homography: H = [a b c; d e f; g h i]
	// RANSAC matches
	var initialAssumedProbabilityOutliers = 0.5;
	var minSampleCount = 5;
	var pDesired = 0.99;
	var populationCount = matches.length;
	var sigmaDistanceScale = 5.0; // 5-sigma
	//
	var pOutlier = initialAssumedProbabilityOutliers;
	//
	var minAllowableSupport = 4;
	var maxSupport = 0;
	var maxConsensus = 0;
	var maxModel = 0;
	var maxIterations = Code.requiredIterationsForModel(pDesired, pOutlier, minSampleCount);
	var sampleIndexList, samples, pointsA, pointsB, pointsANormalized, pointsBNormalized;
	var index;
	var H, Hinv;
	var match, pointA, pointB;
	var distA, distB;
	var consensus;
	//
	console.log("ITERATIONS: "+maxIterations);
//	console.log("DISTANCE: "+maxLineDistance);
	for(j=0;j<maxIterations;++j){
		sampleIndexList = Code.newIndexArray(0,populationCount-1);
		samples = [];
		pointsA = [];
		pointsB = [];
		for(i=0;i<minSampleCount;++i){
			index = Code.arrayRandomItemPop(sampleIndexList);
			match = matches[index];
			pointsA.push( V3D.fromV2D(match.A.center,1.0) );
			pointsB.push( V3D.fromV2D(match.B.center,1.0) );
		}
		pointsANormalized = R3D.calculateNormalizedPoints([pointsA]);
		pointsBNormalized = R3D.calculateNormalizedPoints([pointsB]);
		H = R3D.homographyMatrixLinear(pointsANormalized.normalized[0], pointsBNormalized.normalized[0]);
		var optimalResult = R3D.homographyMatrixNonlinearVars(H, pointsANormalized.normalized[0], pointsBNormalized.normalized[0]);
		var optimalPoints = optimalResult.x;
		var optimalA = [];
		var optimalB = [];
		for (i=0;i<minSampleCount; ++i){
			optimalA.push(new V2D(optimalPoints[i*4+0],optimalPoints[i*4+1]));
			optimalB.push(new V2D(optimalPoints[i*4+2],optimalPoints[i*4+3]));
		}
// console.log(optimalA)
// console.log(optimalB)
		H = optimalResult.H;
		H = Matrix.mult(H, pointsANormalized.forward[0]);
		H = Matrix.mult(pointsBNormalized.reverse[0], H);
		Hinv = Matrix.inverse(H);

// var pA = pointsA[0];
// var pAH = H.multV3DtoV3D(new V3D(), pA);
// pAH.homo();
// var pB = pointsB[0];
// var pBH = Hinv.multV3DtoV3D(new V3D(), pB);
// pBH.homo();
// //H = Matrix.inverse(H);

// console.log("pA:  "+pA.toString());
// console.log("pBH: "+pBH.toString());

// console.log("pAH: "+pAH.toString());
// console.log("pB:  "+pB.toString());

// break;
		// find support count
		consensus = [];


// FIND MAXIMUM ALLOWABLE DISTANCE A POINT CAN BE FROM CALCULATED POINT AND STILL BE CONSIDERED VALID

// find OPTIMAL x & x'
// n = MINIMUM POINT COUNT
var averageDistanceA = 0;
var averageDistanceB = 0;
for(i=0; i<minSampleCount; ++i){
	var A = pointsA[i];
	var B = pointsB[i];
	var X = optimalA[i];
	var Y = optimalB[i];
		Y = H.multV3DtoV3D( new V3D(), V3D.fromV2D(A,1.0) );
		X = Hinv.multV3DtoV3D( new V3D(), V3D.fromV2D(B,1.0) );
	var distanceA = V2D.distance(A,X);
	var distanceB = V2D.distance(B,Y);
	averageDistanceA += distanceA;
	averageDistanceB += distanceB;
}

averageDistanceA /= minSampleCount;
averageDistanceB /= minSampleCount;
var sigmaDistanceA = 0;
var sigmaDistanceB = 0;
for(i=0; i<minSampleCount; ++i){
	var A = pointsA[i];
	var B = pointsB[i];
	var X = optimalA[i];
	var Y = optimalB[i];
	var distanceA = V2D.distance(A,X);
	var distanceB = V2D.distance(B,Y);
	sigmaDistanceA += Math.pow(distanceA - averageDistanceA, 2);
	sigmaDistanceB += Math.pow(distanceB - averageDistanceB, 2);
}
// sigma = sqrt( sum(x_i-x_avg)/n )
sigmaDistanceA = Math.sqrt(sigmaDistanceA/minSampleCount);
sigmaDistanceB = Math.sqrt(sigmaDistanceB/minSampleCount);
console.log("ERRORS:",sigmaDistanceA,sigmaDistanceB);
var maxPointDistanceA = sigmaDistanceScale * sigmaDistanceA; // pixels
var maxPointDistanceB = sigmaDistanceScale * sigmaDistanceB; // pixels

maxPointDistanceA = 1.0;
maxPointDistanceB = 1.0;

		for(i=0;i<populationCount;++i){
			match = matches[i];
			pointA = V3D.fromV2D(match.A.center,1.0);
			pointB = V3D.fromV2D(match.B.center,1.0);
			//console.log(pointA+" - "+pointB)
			pointAH = H.multV3DtoV3D(new V3D(), pointA);
			pointBH = Hinv.multV3DtoV3D(new V3D(), pointB);
			pointAH.homo();
			pointBH.homo();
//			console.log(pointAH+" - "+pointBH)
			distA = V2D.distance(pointA,pointBH);
			distB = V2D.distance(pointB,pointAH);
//			console.log(distA+" - "+distB);
			if(distA <= maxPointDistanceA && distB <= maxPointDistanceB){
				consensus.push([pointA,pointB]);
			}
		}
// SHOULD ALWAYS HAVE A MINIMUM OF 2
//		console.log(consensus.length);
		// save best consensus
		if(consensus.length>maxSupport && consensus.length>=minAllowableSupport){
			maxSupport = consensus.length;
			maxConsensus = consensus;
			maxModel = H.copy();
			// update max iterations based on known min inliers
			pOutlier = maxSupport*1.0/populationCount;
			//pOutlier = 1 - pInlier;
			maxIterations = Code.requiredIterationsForModel(pDesired, pOutlier, minSampleCount);
			console.log(" >>> NEW SUPPORT: "+maxSupport+" MAX ITERATIONS: "+maxIterations);
		}

	}

	// BEST RANSAC MODEL RESULT
	console.log("+=+=+=+=+=+=+=+=+=+=+=+");
	console.log("MAX SUPPORT: "+maxSupport);
	console.log("+=+=+=+=+=+=+=+=+=+=+=+");
	//console.log("MAX SUPPORT: "+maxSupport);
	H = maxModel;
	Hinv = Matrix.inverse(H);

	// PLACE IMAGE 1 OVER IMAGE 2
	var temp;
	var imageA = imageList[0];
	var imageB = imageList[1];
	var imageACorners = [], imageBCorners = [];
	imageACorners.push(new V2D(0,0)); // TL
	imageACorners.push(new V2D(imageA.width,0)); // TR
	imageACorners.push(new V2D(imageA.width,imageA.height)); // BR
	imageACorners.push(new V2D(0,imageA.height)); // BL
	imageBCorners.push(new V2D(0,0)); // TL
	imageBCorners.push(new V2D(imageB.width,0)); // TR
	imageBCorners.push(new V2D(imageB.width,imageB.height)); // BR
	imageBCorners.push(new V2D(0,imageB.height)); // BL

	imageACornersInB = this.pointListTransformedH(imageACorners, H);
//	imageACornersInB = this.pointListTransformedH(imageACorners, Hinv);
//imageACornersInB = this.pointListTransformedH(imageACornersInB, Hinv);
	//imageBCornersInA = this.pointListTransformedH(imageBCorners, Hinv);
	temp = V2D.extremaFromArray(imageACornersInB);
	var imageATransMin = temp.min;
	var imageATransMax = temp.max;
	var imageATransWidth = imageATransMax.x-imageATransMin.x;
	var imageATransHeight = imageATransMax.y-imageATransMin.y;
	console.log(imageATransMin+" -> "+imageATransMax);
	console.log(imageATransWidth+" x "+imageATransHeight);
	if(imageATransWidth>2.0*imageA.width || imageATransHeight>2.0*imageA.height){
		console.log("HOMOGRAPHY IS TOO WARPED");
	} else {
		console.log("START TO WARP");
		var imageMat;
		var imageCWidth = Math.ceil(imageATransWidth);
		var imageCHeight = Math.ceil(imageATransHeight);
		var offsetBC = V2D.copy( imageATransMin );
		var imageCPixels = imageCWidth*imageCHeight;
		//var imageCMat = new Array(imageCPixels);
		var imageCMatR = new Array(imageCPixels);
		var imageCMatG = new Array(imageCPixels);
		var imageCMatB = new Array(imageCPixels);
		var imageCMatA = new Array(imageCPixels);
			//imageMat = this._stage.getImageAsFloatGray(imageA);
		//var imageAMat = imageMat.gray;
			imageMat = this._stage.getImageAsFloatRGB(imageA);
		//var imageAMat = imageMat.gray;
		var imageAMatR = imageMat.red;
		var imageAMatG = imageMat.grn;
		var imageAMatB = imageMat.blu;
			//imageMat = this._stage.getImageAsFloatGray(imageB);
			imageMat = this._stage.getImageAsFloatRGB(imageB);
		//var imageBMat = imageMat.gray;
		var imageBMatR = imageMat.red;
		var imageBMatG = imageMat.grn;
		var imageBMatB = imageMat.blu;

		for(j=0; j<imageCHeight; ++j){
			for(i=0; i<imageCWidth; ++i){
				var index = imageCWidth*j + i;
				var ptB = new V3D(i,j,1.0);
				ptB.x += offsetBC.x;
				ptB.y += offsetBC.y;
				var ptA = Hinv.multV3DtoV3D(new V3D(), ptB);
				var fr = new V2D(ptA.x/ptA.z,ptA.y/ptA.z);
				var isPointInside = (fr.x>=0) && (fr.x<imageA.width) && (fr.y>=0) && (fr.y<imageA.height);
				if(isPointInside){
					imageCMatR[index] = ImageMat.getPointInterpolateCubic(imageAMatR, imageA.width,imageA.height, fr.x,fr.y);
					imageCMatG[index] = ImageMat.getPointInterpolateCubic(imageAMatG, imageA.width,imageA.height, fr.x,fr.y);
					imageCMatB[index] = ImageMat.getPointInterpolateCubic(imageAMatB, imageA.width,imageA.height, fr.x,fr.y);
					imageCMatA[index] = 1.0;
				} else {
					imageCMatR[index] = 0.0;
					imageCMatG[index] = 0.0;
					imageCMatB[index] = 0.0;
					imageCMatA[index] = 0.0;
				}
			}
		}
		//imageC = this._stage.getFloatGrayAsImage(imageCMat, imageCWidth,imageCHeight, null);
		imageC = this._stage.getFloatARGBAsImage(imageCMatA,imageCMatR,imageCMatG,imageCMatB, imageCWidth,imageCHeight, null);
		// Stage.prototype.getFloatARGBAsImage = function(a,r,g,b, wid,hei, matrix, type){
		var img = new DOImage(imageC);
		//img.graphics().alpha(0.75);
		this._root.addChild(img);
		//img.moveBackward();
		//img.moveToBack();
		//img.moveForward();
		img.matrix().translate(matrixOffX,matrixOffY);
		img.matrix().translate(offsetBC.x,offsetBC.y);
	}
	// find intersecting regions:
	var polyA = imageACorners;
	var polyB = imageACornersInB;
	//polyC = Code.polygonUnion2D(polyA,polyB);
	//polyC = Code.polygonDifference2D(polyA,polyB);
	polyC = Code.polygonIntersection2D(polyA,polyB);
	console.log(polyC);
	// find largest polygon & assign bounding box
	var intersectionRect = new Rect();
	var intersectionPoly = null;
	var maxArea = 0;

	// d = this.drawPolygon(polyA, 0xFFCC0000, 0xFFCC0000, 2.0);
	// 	d.matrix().translate(matrixOffX,matrixOffY);
	// d = this.drawPolygon(polyB, 0xFF00CC00, 0xFF00CC00, 2.0);
	// 	d.matrix().translate(matrixOffX,matrixOffY);
	console.log("DRAW ARROWS: "+polyC.length);
	for(i=0;i<polyC.length;++i){
		var con = polyC[i];
		var area = Math.abs( Code.polygonArea2D(con) );
		if(area>maxArea){
			maxArea = area;
			intersectionRect.fromArray(con);
			intersectionPoly = con;
		}
		// d = this.drawPolygon(con, 0xFF0000CC, 0xFF0000CC, 1.0, true);
		// d.matrix().translate(matrixOffX,matrixOffY);
	}


console.log("intersectionRect"+intersectionRect.toString()+"")

// calculate intersection & mask
var padLeft = 1;
var padRight = 1;
var padTop = 1;
var padBot = 1;
var wid = Math.ceil(intersectionRect.width()) + padLeft + padRight;
var hei = Math.ceil(intersectionRect.height()) + padTop + padBot;
var intersectionImage = Code.newArrayZeros(wid*hei);
//var intersectionImageA = Code.newArrayZeros(wid*hei);
var intersectionMask = Code.newArrayZeros(wid*hei); // inside: 0, else: 2^simages
var intersectionList = Code.newArrayZeros(wid*hei);
var allIntersections = Code.newArrayIndexes(0,1);//[1,2];
var offX = intersectionRect.x() - padLeft;
var offY = intersectionRect.y() - padTop;
console.log("OFFSET FROM IMAGEB TL: "+offX+","+offY);
for(j=0;j<hei;++j){
	for(i=0;i<wid;++i){
		var index = j*wid + i;
				var ptB = new V3D(i+offX,j+offY,1.0);
				var to = ptB;
				var ptA = Hinv.multV3DtoV3D(new V3D(), ptB);
				var fr = new V2D(ptA.x/ptA.z,ptA.y/ptA.z);
				var colorA, colorB, colorC;
				//var isPointInside = Code.isPointInsidePolygon2D(ptA,);
				
				var isPointInsideA = ( (fr.x>=0) && (fr.x<imageA.width) && (fr.y>=0) && (fr.y<imageA.height) );
				var isPointInsideB = ( (to.x>=0) && (to.x<imageB.width) && (to.y>=0) && (to.y<imageB.height) );
				var isPointInside = isPointInsideA && isPointInsideB;
				//
				intersectionList[index] = [];
				if(isPointInside){
					//imageCMat[index] = ImageMat.getPointInterpolateLinear(imageAMat, imageA.width,imageA.height, fr.x,fr.y);
					//imageCMat[index] = ImageMat.getPointInterpolateCubic(imageAMat, imageA.width,imageA.height, fr.x,fr.y);
					// imageCMatR[index] = ImageMat.getPointInterpolateCubic(imageAMatR, imageA.width,imageA.height, fr.x,fr.y);
					// imageCMatG[index] = ImageMat.getPointInterpolateCubic(imageAMatG, imageA.width,imageA.height, fr.x,fr.y);
					// imageCMatB[index] = ImageMat.getPointInterpolateCubic(imageAMatB, imageA.width,imageA.height, fr.x,fr.y);
					// imageCMatR[index] = ImageMat.getPointInterpolateLinear(imageAMatR, imageA.width,imageA.height, fr.x,fr.y);
					// imageCMatG[index] = ImageMat.getPointInterpolateLinear(imageAMatG, imageA.width,imageA.height, fr.x,fr.y);
					// imageCMatB[index] = ImageMat.getPointInterpolateLinear(imageAMatB, imageA.width,imageA.height, fr.x,fr.y);
colorA = ImageMat.getPointInterpolateCubic(imageAMatR, imageA.width,imageA.height, fr.x,fr.y);
colorB = ImageMat.getPointInterpolateCubic(imageBMatR, imageB.width,imageB.height, to.x,to.y);
					// average:
					//colorC = (colorA + colorB)*0.5;
					// difference:
					colorC = Math.abs(colorA - colorB);

					intersectionImage[index] = colorC;
					intersectionMask[index] = 0.0;
				} else {
					intersectionImage[index] = 0.0;
					intersectionMask[index] = 1.0 + (isPointInsideA ? 1.0 : 0) + (isPointInsideB ? 1.0 : 0);
					if(isPointInsideA){ intersectionList[index].push(0); }
					if(isPointInsideB){ intersectionList[index].push(1); }
					// imageCMatR[index] = 0.0;
					// imageCMatG[index] = 0.0;
					// imageCMatB[index] = 0.0;
					// imageCMatA[index] = 0.0;
				}


		// if inside, mask = 1, else mask = 0
	}
}		

		intersectionImage = ImageMat.normalFloat01(intersectionImage);
		// imageC = this._stage.getFloatARGBAsImage(intersectionMask,intersectionImage,intersectionImage,intersectionImage, wid,hei, null);
		// img = new DOImage(imageC);
		// this._root.addChild(img);

// WATERSHEDDING:
	var sigma = 2.4; // 1.4;
	var imageGrayFloatGauss = ImageMat.applyGaussianFloat(intersectionImage,wid,hei, sigma);

// drop gaussian
//imageGrayFloatGauss = intersectionImage;
//
var watershed = ImageMat.watershed(imageGrayFloatGauss,wid,hei, intersectionMask);
var pixels = watershed.pixels;
var imgGroups = this.colorImageWithGroups(pixels,wid,hei);
	// //
	// img = this._stage.getFloatARGBAsImage(imgGroups.alp,imgGroups.red,imgGroups.grn,imgGroups.blu,wid,hei, null);
	// //
	// d = new DOImage(img);
	// this._root.addChild(d);
	// d.matrix().translate(0.0,300.0);
	// d.graphics().alpha(0.80);

// graph from watershed grouping
var watershedPixels = watershed.pixels;
var watershedGroups = watershed.groups;
var watershedRects = watershed.rects;
var data = Stitching.graphFromGroupBitmap(watershedGroups, watershedRects, watershedPixels,wid,hei, intersectionMask, intersectionList, allIntersections, this);
var graph = data.graph;
var extrema = data.extrema;
console.log("graph:");
console.log(graph);
console.log("extrema:");
console.log(extrema);
if(extrema.length>1) {
	var vs = extrema[0];
	var vt = extrema[1];
	var path = graph.BFS(vs,vt);
	console.log("PATH:");
	console.log(path);
	if(!path){
		console.log("no path exists, can't try cutting");
	}

	// console.log("COPY");
	// var copy = graph.copy();
	// console.log(graph.vertexes().length+" | "+graph.edges().length); // console.log(graph.toString());
	// console.log(copy.vertexes().length+" | "+copy.edges().length); // console.log(copy.toString());

	var cut = graph.minCut(vs,vt);
	console.log("CUT:");
	console.log(cut);
	console.log(cut.length);

	console.log("SPLIT:");
	var graphs = graph.splitWithCut(cut);
	console.log(graphs);
	if(graphs){
		var graphA = graphs[0];
		var graphB = graphs[1];
		var vertexes;
		var groupsA = [];
		var groupsB = [];
		var groups;
		var pictureIndex;
		// find which picture each graph corresponds to
	var groupList = [[groupsA,graphA._vertexes], [groupsB,graphB._vertexes]];
	for(k=0; k<groupList.length; ++k){
		vertexes = groupList[k][1];
		groups = groupList[k][0];
		for(i=0;i<vertexes.length;++i){
			var data = vertexes[i].data();
			if(data!==null){
				if(data.index!==null){
					groups.push(data.index);
				}
				if(data.node!==null){
					console.log("FOUND: "+data.node);
					pictureIndex = data.node;
					groupList[k][2] = pictureIndex;
				}
			}
		}
	}
		// GO THRU EACH GROUP AND USE PIXEL MAPPED TO FROM IMAGE
		var groupBitmap = Code.newArrayZeros(wid*hei); // 0 = N/A, >0 = group
		var bitmapValue;
		//var mergedBitmapGry = Code.newArrayZeros(wid*hei);
		var mergedBitmapRed = Code.newArrayZeros(wid*hei);
		var mergedBitmapGrn = Code.newArrayZeros(wid*hei);
		var mergedBitmapBlu = Code.newArrayZeros(wid*hei);
		var mergedBitmapAlp = Code.newArrayZeros(wid*hei);
		for(k=0; k<groupList.length; ++k){
			var imageIndex = groupList[k][2];
			console.log("imageIndex: "+imageIndex);
			groups = groupList[k][0];
			bitmapValue = k+1;
			for(i=0;i<groups.length;++i){
				var index = groups[i];
				var group = watershedGroups[index];
				for(j=0;j<group.length;++j){
					var pixel = group[j];
					index = pixel.y*wid + pixel.x;
					groupBitmap[index] = bitmapValue;
					mergedBitmapAlp[index] = 1.0;
					// construct pixels to find colors in separate images
					var x = pixel.x + offX ;//- padLeft;// - offsetBC.x; // - offX; //- padLeft; // - offX 
					var y = pixel.y + offY; //- padTop;// - offsetBC.y; //offY; //- padTop; // - offXY

					var ptB = new V3D(x,y,1.0);
					var to = ptB;
					var ptA = Hinv.multV3DtoV3D(new V3D(), ptB);
					var fr = new V2D(ptA.x/ptA.z,ptA.y/ptA.z);
					var r,g,b;
					if(imageIndex==0){ // B <rect>
						r = ImageMat.getPointInterpolateCubic(imageBMatR, imageB.width,imageB.height, to.x,to.y);//imageBMatR[ind];
						g = ImageMat.getPointInterpolateCubic(imageBMatG, imageB.width,imageB.height, to.x,to.y);//imageBMatG[ind];
						b = ImageMat.getPointInterpolateCubic(imageBMatB, imageB.width,imageB.height, to.x,to.y);//imageBMatB[ind];
						mergedBitmapRed[index] = r;
						mergedBitmapGrn[index] = g;
						mergedBitmapBlu[index] = b;
					}else{ // A <warped>
						r = ImageMat.getPointInterpolateCubic(imageAMatR, imageA.width,imageA.height, fr.x,fr.y);
						g = ImageMat.getPointInterpolateCubic(imageAMatG, imageA.width,imageA.height, fr.x,fr.y);
						b = ImageMat.getPointInterpolateCubic(imageAMatB, imageA.width,imageA.height, fr.x,fr.y);
						mergedBitmapRed[index] = r;
						mergedBitmapGrn[index] = g;
						mergedBitmapBlu[index] = b;
					}
				}
			}
		}
		console.log("D");
// WHAT TO DO ABOUT CORNER POINTS --- ADD TO GROUP & GRAB ARBITRARY PICTURE PIXELS?
		


	// imgGroups = this.colorImageWithGroups(groupBitmap,wid,hei);
	// img = this._stage.getFloatARGBAsImage(imgGroups.alp,imgGroups.red,imgGroups.grn,imgGroups.blu,wid,hei, null);
	img = this._stage.getFloatARGBAsImage(mergedBitmapAlp,  mergedBitmapRed,mergedBitmapGrn,mergedBitmapBlu  ,wid,hei, null);
	//
	d = new DOImage(img);
	this._root.addChild(d);
	//
	d.matrix().translate(matrixOffX+offX,matrixOffY+offY);
//	d.graphics().alpha(0.60);


/*
		vertexes = [];
		Code.arrayInsertArray(vertexes,vertexes.length,graphA._vertexes);
		Code.arrayInsertArray(vertexes,vertexes.length,graphB._vertexes);
		// 
		console.log(graphA._vertexes.length);
		//for(i=0;i<graphA._vertexes.length;++i){
		//	var v = graphA._vertexes[i];
		for(i=0;i<vertexes.length;++i){
			var v = vertexes[i];
			var data = v.data();
			console.log(data.node);
			if (data.index) {
				var index = data.index; // null = extrema, others = index
				var color = data.node==0 ? 0xFFFF0000 : 0xFF0000FF;
				if(index!==null){
					var rect = watershedRects[index];
					this.drawRectFromRect(rect, color);
				}
			}
		}
*/

	// FOR SMOOTHING / FADING BORDER: 
	// 1 SEPARATE IMAGE, GAUSSED on A or B
	// if == 0 => just grab A
	// if == 1 => just grab B
	// else => get combination of (1-p)*A + p*B


	}

}
	console.log("DONE");
}

Stitching.prototype.drawRectFromRect = function(rect, colorLine, colorFill, padding){
	padding = padding!==undefined ? padding : 2;
	var d = new DO();
	this._root.addChild(d);
	d.matrix().translate(0.0,300.0);
	//
	colorFill = colorFill!==undefined ? colorFill : 0x0000FF00;
	colorLine = colorLine!==undefined ? colorLine : 0xFFFF0000;
	var lineWidth = 1.0;
	d.graphics().setLine(lineWidth,colorLine);
	d.graphics().beginPath();
	d.graphics().setFill(colorFill);
	var pA = rect.min();
	var pB = rect.max();
	pA.x -= padding;
	pA.y -= padding;
	pB.x += padding;
	pB.y += padding;
	d.graphics().moveTo(pA.x,pA.y);
	d.graphics().lineTo(pB.x,pA.y);
	d.graphics().lineTo(pB.x,pB.y);
	d.graphics().lineTo(pA.x,pB.y);
	d.graphics().lineTo(pA.x,pA.y);
	d.graphics().strokeLine();
	d.graphics().fill();
	d.graphics().endPath();
}

Stitching.pixelNeighbors8HasValue = function(i,j, image,width,height, value){
	var neighbors = Stitching.pixelNeighbors8(i,j);
	for(var i=0; i<neighbors.length; ++i){
		var neighbor = neighbors[i];
		if(neighbor.x>=0 && neighbor.x<width && neighbor.y>=0 && neighbor.y<height){
			var index = neighbor.y*width + neighbor.x;
			var val = image[index];
			if(val==value){
				return true;
			}
		}
	}
	return false;
}
Stitching.pixelNeighbors8 = function(i,j){
	var list = [];
	list.push(new V2D(i-1,j-1));
	list.push(new V2D(i,j-1));
	list.push(new V2D(i+1,j-1));
	list.push(new V2D(i-1,j));
	//list.push(new V2D(i,j));
	list.push(new V2D(i+1,j));
	list.push(new V2D(i-1,j+1));
	list.push(new V2D(i,j+1));
	list.push(new V2D(i+1,j+1));
	return list;
}

Stitching.graphFromGroupBitmap = function(groupList, groupRects, groupMap,width,height, inverseMask, sourceList, allSources, s){
	var graph = new Graph();
	var u, v, e;
	var i, j, k, index, len, group, pixel, pixels, neighbors, borders, sources;
	var groupCount = groupList.length;
	console.log("graphFromGroupBitmap: "+groupCount);
	var vertexList = [];
	var infiniteVertexes = [];
	// create infinite nodes
	for(i=0;i<allSources.length;++i){
		v = graph.addVertex();
		v.data( {"index":null,"node":i} );
		infiniteVertexes.push(v);
	}
	// create infinite node connections
	for(i=0; i<groupList.length; ++i){ // for each group
		// find if group touches borders
		group = groupList[i];
		borders = []; // collection of all the borders item touches
		len = group.length;
		for(j=0; j<len; ++j){ // for each pixel in group
			pixel = group[j];
			neighbors = Stitching.pixelNeighbors8(pixel.x,pixel.y);
			for(k=0;k<neighbors.length;++k){ // for each neighbor
				neighbor = neighbors[k];
				index = neighbor.y * width + neighbor.x; // 2D index
				if(inverseMask[index]!=0){
					sources = sourceList[index];
					for(l=0;l<sources.length;++l){
						index = sources[l];
						borders[index] = borders[index] ? borders[index]++ : 1;
					}
				}
			}
		}
		var keys = Code.keys(borders);
		var borderCount = keys.length;
		if(borderCount>=2){ // touches multiple borders
			// do not add as vertex in graph
			// s.drawRectFromRect(groupRects[i]);
			vertexList[i] = null;
		} else { // 0 or 1 border
			// add group vertex to graph 
			v = graph.addVertex();
			v.data( {"index":i,"node":null} );
			vertexList[i] = v;
			if(borderCount==1){ // touches 1 border
				index = keys[0];
				//console.log(index);
				for(j=0;j<allSources.length;++j){ // add infinite connections to the first mask it does NOT TOUCH
					key = allSources[j];
					if(key!=index){
						// TODO: INDEXES AND KEYS DON'T NECESSARILY MATCH
						u = infiniteVertexes[key];
						graph.addEdge(u,v, Graph.WEIGHT_INFINITY,Graph.Edge.DIRECTION_DUPLEX);
						//s.drawRectFromRect(groupRects[i]);
						break;
					}
				}

			} // touches no borders
			else {
				//s.drawRectFromRect(groupRects[i]);
			}
		}
	}
	// connect adjacent groups
	for(i=0; i<groupList.length; ++i){
		var groupA = groupList[i];
		var vertexA = vertexList[i];
		for(j=i+1; j<groupList.length; ++j){
			var groupB = groupList[j];
			var vertexB = vertexList[j];
			if(vertexA && vertexB){
				var rectA = groupRects[i];
				var rectB = groupRects[j];
				rectA = rectA.copy().pad(1,1,1,1);
				if( Rect.isIntersect(rectA,rectB) ){ // possible neighboring groups
					var edgeA = [];
					var edgeB = [];
					for(k=0; k<groupA.length; ++k){ // all neighboring group A pixels
						var pixelA = groupA[k];
						var isNeighborA = Stitching.pixelNeighbors8HasValue(pixelA.x,pixelA.y, groupMap,width,height, j);
						if(isNeighborA){
							edgeA.push(pixelA);
						}
					}
					for(k=0; k<groupB.length; ++k){ // all neighboring group B pixels
						var pixelB = groupB[k];
						var isNeighborB = Stitching.pixelNeighbors8HasValue(pixelB.x,pixelB.y, groupMap,width,height, i);
						if(isNeighborB){
							edgeB.push(pixelB);
						}
					}
					if(edgeA.length>0 && edgeB.length>0){ // shared edge
						// => add edge between nodes with cost of list
						var costA = 0;
						var costB = 0;
						for(k=0; k<edgeA.length; ++k){ costA+=edgeA[k].z; }
						for(k=0; k<edgeB.length; ++k){ costB+=edgeB[k].z; }
						var totalCost = (costA + costB)*0.5;
						graph.addEdge(vertexA,vertexB, totalCost,Graph.Edge.DIRECTION_DUPLEX);
					}
				}
			}
		}
	}

	return {"graph":graph, "extrema":infiniteVertexes};
}


Stitching.prototype.pointListTransformedH = function(pointList,H){
	var i, len = pointList.length;
	var pt = new V3D();
	var newList = [];
	for(i=0; i<len; ++i){
		var point = pointList[i];
		pt.set(point.x,point.y,1.0);
		var transPoint = H.multV3DtoV3D(new V3D(), pt);
		transPoint.homo();
		newList.push(transPoint);
	}
	return newList;
}

Stitching.prototype.combineTriangles = function(){
	var triList = this._tris;
	var imgList = this._imgs;
	console.log(triList);
	console.log(imgList);
}
Stitching.prototype.handleEnterFrame = function(e){ // 2D canvas
	//console.log(e);
}
Stitching.prototype.handleMouseClickFxn = function(e){
	console.log(e.x%400,e.y)
}



