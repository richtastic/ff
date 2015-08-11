// Stitching.js

function Stitching(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	//
	var imageList, imageLoader;
	// import image to work with
	imageList = ["snow1.png","snow2.png"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleSceneImagesLoaded,null);
	imageLoader.load();
}
Stitching.prototype.drawPolygon = function(pointList, colorLine, colorFill, lineWidth){
	var i=0, len=pointList.length;
	if(len<=1){ return; }
	colorLine = colorLine ? colorLine : 0xFFFF0000;
	lineWidth = lineWidth ? lineWidth : 1.0;
	colorFill = colorFill ? colorFill : 0x9900FF00;
	var d = new DO();
	d.graphics().setLine(lineWidth,colorLine);
	
	for(i=0; i<len; ++i){
		var offX = 0;//10.0*(Math.random()-0.5);
		var offY = 0;//10.0*(Math.random()-0.5);
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
		d.graphics().beginPath();
		d.graphics().moveTo(pA.x,pA.y);
		d.graphics().lineTo(pB.x+offX,pB.y+offY);
			d.graphics().lineTo(pB.x+lin1.x,pB.y+lin1.y);
			d.graphics().lineTo(pB.x+lin2.x,pB.y+lin2.y);
			d.graphics().lineTo(pB.x,pB.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	
	this._root.addChild(d);
}
Stitching.prototype.handleSceneImagesLoaded = function(imageInfo){

	// var a = [0,1,2,3,4,5,6,7];
	// console.log(Code.copyArray(a));
	// console.log(Code.copyArray(new Array(), a));
	// console.log(Code.copyArray(a,0,4));
	// console.log(Code.copyArray(new Array(), a,3,7));
	// return;


	var polyA = [];
		polyA.push(new V2D(220,250));
		polyA.push(new V2D(270,200));
		//polyA.push(new V2D(300,100));
		polyA.push(new V2D(10,20));
	var polyB = [];
		polyB.push(new V2D(100,200));
		polyB.push(new V2D(250,20));
		polyB.push(new V2D(120,150));
	// var polyA = [];
	// 	polyA.push(new V2D(50,50));
	// 	polyA.push(new V2D(50,250));
	// 	polyA.push(new V2D(350,250));
	// 	polyA.push(new V2D(350,50));
	// var polyB = [];
	// 	polyB.push(new V2D(10,100));
	// 	polyB.push(new V2D(10,400));
	// 	polyB.push(new V2D(400,400));
	// 	polyB.push(new V2D(400,100));
	var polyC = Code.polygonUnion2D(polyA,polyB);

	this.drawPolygon(polyA, 0xFFCC0000, 0x00000000, 1.0);
	this.drawPolygon(polyB, 0xFF00CC00, 0x00000000, 1.0);
	this.drawPolygon(polyC, 0xFF0000CC, 0x00000000, 1.5);


return;







	var imageList = imageInfo.images;
	var i, j, list = [], d, img, x=0, y=0;
var featurePoints = [];
var features = [];
var matrixOffY = 50;
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
		var imageAMatR = imageMat.red;
		var imageAMatG = imageMat.grn;
		var imageAMatB = imageMat.blu;
		// 	imageMat = this._stage.getImageAsFloatGray(imageB);
		// var imageBMat = imageMat.gray;
		for(j=0; j<imageCHeight; ++j){
			for(i=0; i<imageCWidth; ++i){
				var index = imageCWidth*j + i;
				var ptB = new V3D(i,j,1.0);
				ptB.x += offsetBC.x;
				ptB.y += offsetBC.y;
				var ptA = Hinv.multV3DtoV3D(new V3D(), ptB);
				var fr = new V2D(ptA.x/ptA.z,ptA.y/ptA.z);
				//var isPointInside = Code.isPointInsidePolygon2D(ptA,);
				isPointInside = (fr.x>=0) && (fr.x<imageA.width) && (fr.y>=0) && (fr.y<imageA.height);
				if(isPointInside){
					//imageCMat[index] = ImageMat.getPointInterpolateLinear(imageAMat, imageA.width,imageA.height, fr.x,fr.y);
					//imageCMat[index] = ImageMat.getPointInterpolateCubic(imageAMat, imageA.width,imageA.height, fr.x,fr.y);
					imageCMatR[index] = ImageMat.getPointInterpolateLinear(imageAMatR, imageA.width,imageA.height, fr.x,fr.y);
					imageCMatG[index] = ImageMat.getPointInterpolateLinear(imageAMatG, imageA.width,imageA.height, fr.x,fr.y);
					imageCMatB[index] = ImageMat.getPointInterpolateLinear(imageAMatB, imageA.width,imageA.height, fr.x,fr.y);
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
		img.moveToBack();
		//img.moveForward();
		img.matrix().translate(400.0,matrixOffY);
		img.matrix().translate(offsetBC.x,offsetBC.y);
	}
	console.log("DONE");
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



