function FeatureTest(){
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

//this.ransacMatches();
//return;
	// load images
	//var imageList = ["caseStudy1-0.jpg","caseStudy1-26.jpg"];
	//var imageList = ["snow1.png","snow2.png"];
	//var imageList = ["F_S_1_1.jpg","F_S_1_2.jpg"];
	//var imageList = ["calibration1-0.jpg","calibration1-1.jpg"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalex.png"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalexy.png"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalexrotate.png"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalexrotateskew.png"];
	//var imageList = ["catHat.jpg","catHat.jpg"];
//new ImageLoader("./images/",imageList,this,this.imagesLoadComplete).load();
//new ImageLoader("./images/",["tgag.jpg"],this,this.getScaledImage).load();
// main study
new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-9.jpg"],this,this.imagesLoadComplete2).load();
// pool
// new ImageLoader("./images/",["F_S_1_1.jpg", "F_S_1_2.jpg"],this,this.imagesLoadComplete2).load();
// snow
// new ImageLoader("./images/",["snow1.png", "snow2.png"],this,this.imagesLoadComplete2).load();
// zoom study:
// new ImageLoader("./images/",["caseStudy1-20.jpg", "caseStudy1-24.jpg"],this,this.imagesLoadComplete2).load(); // typical translation
//new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-24.jpg"],this,this.imagesLoadComplete2).load(); // typical - broked first one
//new ImageLoader("./images/",["caseStudy1-14.jpg", "caseStudy1-20.jpg"],this,this.imagesLoadComplete2).load(); // obscure 
// new ImageLoader("./images/",["caseStudy1-14.jpg", "caseStudy1-20_rot.jpg"],this,this.imagesLoadComplete2).load(); // obscure & rotated ----------- MVP
//new ImageLoader("./images/",["caseStudy1-24.jpg", "caseStudy1-26.jpg"],this,this.imagesLoadComplete2).load(); // typical angle
//new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-20.jpg"],this,this.imagesLoadComplete2).load(); // typical angle

// new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-12.jpg"],this,this.imagesLoadComplete2).load(); // actual big scale difference

//new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-20_rot.jpg"],this,this.imagesLoadComplete2).load(); // rotated
// new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-0_rot.jpg"],this,this.imagesLoadComplete2).load(); // rotated
// new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-0_big.jpg"],this,this.imagesLoadComplete2).load(); // zoom difference x2
// new ImageLoader("./images/",["xA_small.jpg", "xB_small.jpg"],this,this.imagesLoadComplete2).load(); // ex bad --------------------------------- MVP
// new ImageLoader("./images/",["yA_small.jpg", "yB_small.jpg"],this,this.imagesLoadComplete2).load(); // ex poor
//new ImageLoader("./images/",["zA_small.jpg", "zB_small.jpg"],this,this.imagesLoadComplete2).load(); // ex ok

//new ImageLoader("./images/",["room0.png", "room1.png"],this,this.imagesLoadComplete2).load(); // real / close scenario

}
FeatureTest.prototype.showCorners = function(features, display, offsetX, offsetY, color){
	color = color!==undefined ? color : 0xFFFF0000;
	for(k=0; k<features.length; ++k){
		var point = features[k];
		if(!Code.isa(point,V4D)){
			point = new V4D(point["point"].x,point["point"].y, point["size"],point["angle"]);
		}
		//console.log(""+point)
			// var x = point.x * imageMatrixA.width();
			// var y = point.y * imageMatrixA.height();
			// var z = point.z;
			var x = point.x;
			var y = point.y;
			var z = point.z;
			var a = point.t;
		var c = new DO();
			//color = Code.getColARGBFromFloat(1.0,1.0 * Math.pow((point.t-min) / (max-min), .5),0,0);
			//color = 0xFF000000;
			c.graphics().setLine(0.50, color);
			c.graphics().beginPath();
			c.graphics().drawCircle(x, y, z);
			c.graphics().strokeLine();
			c.graphics().endPath();

// 			var v = new V2D(z,0);
// 			v.rotate(a);
// 			c.graphics().beginPath();
// 			c.graphics().moveTo(x,y);
// 			c.graphics().lineTo(x+v.x,y+v.y);
// 			c.graphics().strokeLine();
// 			c.graphics().endPath();
// //			c.matrix().scale(GLOBALSCALE);
// 			//c.matrix().translate(0 + f*imageMatrixA.width()*GLOBALSCALE, 0);
			c.matrix().translate(offsetX, offsetY);
			display.addChild(c);
	}
	
}
FeatureTest.prototype.showMSER = function(features, display, offsetX, offsetY, color){
	color = color!==undefined ? color : 0xFFFF0000;
	for(k=0; k<features.length; ++k){
		var feature = features[k];
		//console.log(feature)
		var center = feature["center"];
		var x = center.x;
		var y = center.y;
		var dX = feature["x"];
		var dY = feature["y"];

		var sizeX = dX.length();
		var sizeY = dY.length();
		var angleX = V2D.angleDirection(V2D.DIRX,dX);

		var c = new DO();
		c.graphics().setLine(1.0,color);
		c.graphics().beginPath();
		//c.graphics().moveTo(x,y);
		//c.graphics().lineTo(x+v.x,y+v.y);
		//c.graphics().drawCircle(0,0, 5);
		//c.graphics().drawEllipse(0,0, sizeX,sizeY, 0);
		c.graphics().drawRect(-sizeX*0.5,-sizeY*0.5, sizeX,sizeY);
		c.graphics().strokeLine();
		c.graphics().endPath();
		// 
		c.matrix().rotate(angleX);
		//c.matrix().scale(GLOBALSCALE);
		c.matrix().translate(x + offsetX, y + offsetY);
		display.addChild(c);

		/*
		var point = features[k];
		if(!Code.isa(point,V4D)){
			point = new V4D(point["point"].x,point["point"].y, point["size"],point["angle"]);
		}
		//console.log(""+point)
			// var x = point.x * imageMatrixA.width();
			// var y = point.y * imageMatrixA.height();
			// var z = point.z;
			var x = point.x;
			var y = point.y;
			var z = point.z;
			var a = point.t;
		var c = new DO();
			color = 0xFFFF0000;
			//color = Code.getColARGBFromFloat(1.0,1.0 * Math.pow((point.t-min) / (max-min), .5),0,0);
			//color = 0xFF000000;
			c.graphics().setLine(0.50, color);
			c.graphics().beginPath();
			c.graphics().drawCircle(x, y, z);
			c.graphics().strokeLine();
			c.graphics().endPath();

			var v = new V2D(z,0);
			v.rotate(a);
			c.graphics().beginPath();
			c.graphics().moveTo(x,y);
			c.graphics().lineTo(x+v.x,y+v.y);
			c.graphics().strokeLine();
			c.graphics().endPath();
			c.matrix().scale(GLOBALSCALE);
			c.matrix().translate(0 + f*imageMatrixA.width()*GLOBALSCALE, 0);
			display.addChild(c);
			*/
	}
}


FeatureTest.imageFromParameters = function(imageMatrix, point,scale,angle,sizeX,sizeY,bestAngle, sizeWidth,sizeHeight){
	sizeWidth = sizeWidth!==undefined ? sizeWidth : 11;
	sizeHeight = sizeHeight!==undefined ? sizeHeight : 11;
	var scaleX = sizeWidth/sizeX;
	var scaleY = sizeHeight/sizeY;
	var matrix = new Matrix(3,3).identity();
	matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DTranslate(matrix, -sizeWidth*0.5, -sizeHeight*0.5);
			matrix = Matrix.transform2DRotate(matrix,angle);
			matrix = Matrix.transform2DScale(matrix,scaleX,scaleY);
			matrix = Matrix.transform2DRotate(matrix,bestAngle);
			matrix = Matrix.transform2DScale(matrix,scale);
		matrix = Matrix.transform2DTranslate(matrix, point.x, point.y);
	var image = imageMatrix.extractRectFromMatrix(sizeWidth,sizeHeight, matrix);
	return image;
}
FeatureTest._defaultCircularSADinMaskValue = null;
FeatureTest._defaultCircularSADBinMask = function(){
	if(!FeatureTest._defaultCircularSADinMaskValue){
		//FeatureTest._defaultCircularSADinMaskValue = R3D.circularSIFTBinMask(3.2, 3); // 32
		//FeatureTest._defaultCircularSADinMaskValue = R3D.circularSIFTBinMask(3, 3); // 30
		//FeatureTest._defaultCircularSADinMaskValue = R3D.circularSIFTBinMask(2.5, 3); // 25
		FeatureTest._defaultCircularSADinMaskValue = R3D.circularSIFTBinMask(2, 3); // 20
	}
	return FeatureTest._defaultCircularSADinMaskValue;
}
FeatureTest.SADVectorRGBGradientOctantCircular = function(imageMatrix, center,directionX,directionY,optimumAngle){
	//var scale = 1.0;
	//var scale = 0.707;
	var scale = 0.25;
	//var scale = 0.5;
	var angleX = V2D.angleDirection(V2D.DIRX,directionX);
	var sizeX = directionX.length();
	var sizeY = directionY.length();
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	var binMask = FeatureTest._defaultCircularSADBinMask();
		var binLookup = binMask["value"];
		var binWidth = binMask["width"];
		var binCount = binMask["bins"];
		var binWeights = binMask["weights"];
	var outerSize = binWidth;
	var paddedSize = outerSize + 2;
	var vector = Code.newArrayZeros(binCount*8);
	var image = FeatureTest.imageFromParameters(imageMatrix, center,scale,-angleX,sizeX,sizeY,-optimumAngle, paddedSize,paddedSize);
	var vR = image.red();
	var vG = image.grn();
	var vB = image.blu();
	
	// var vector = Code.newArray();
	// for(var i=0; i<vR.length; ++i){
	// 	vector.push(vR[i]);
	// 	vector.push(vG[i]);
	// 	vector.push(vB[i]);
	// }
	// var min = Code.minArray(vector);
	// Code.arraySub(vector, min);
	// Code.normalizeArray(vector);
	// return vector;
	

	
	var averageColor = new V3D();
	var v = new V3D(r,g,b);
	var delta = new V3D();
	for(var j=0; j<outerSize; ++j){
		for(var i=0; i<outerSize; ++i){
			var index = j*outerSize + i;
			var binGroup = binLookup[index];
			if(binGroup<0){
				continue;
			}
			var binWeight = binWeights[index];
//			var binWeight = 1.0;
			// AVERAGE COLOR
			averageColor.set(0,0,0);
			for(var jj=0;jj<=2;++jj){
				for(var ii=0;ii<=2;++ii){
					var x = (i+ii);
					var y = (j+jj);
					var ind = y*paddedSize + x;
					var r = vR[ind];
					var g = vG[ind];
					var b = vB[ind];
					averageColor.add(r,g,b);
				}
			}
			averageColor.scale(1.0/9.0);
			// COLOR GRADIENT
			index = (j+1)*paddedSize + (i+1);
			var r = vR[index];
			var g = vG[index];
			var b = vB[index];
			v.set(r,g,b);
			V3D.sub(delta, v,averageColor);
			// ADD TO BIN
			var bin = R3D._RGBGrayToBin(delta);
			var mag = delta.length() * binWeight;
			index = binGroup*8 + bin;
			vector[index] += mag;
		}
	}
	var min = Code.minArray(vector);
	Code.arraySub(vector, min);
	Code.normalizeArray(vector);
	
	return vector;
}
FeatureTest._defaultCircularSIFTBinMaskValue = null;
FeatureTest._defaultCircularSIFTBinMask = function(){
	if(!FeatureTest._defaultCircularSIFTBinMaskValue){
		FeatureTest._defaultCircularSIFTBinMaskValue = R3D.circularSIFTBinMask(2, 3); // 2,2.5,3
	}
	return FeatureTest._defaultCircularSIFTBinMaskValue;
}
FeatureTest.SIFTVectorCircular = function(imageMatrix, center,directionX,directionY,optimumAngle, colors){
	colors = colors!==undefined ? colors : true;
	var colorCount = colors ? 3 : 1;
	//var scale = 1.0;
	//var scale = 0.707;
	//var scale = 0.5;
	var scale = 0.25;

	var binMask = FeatureTest._defaultCircularSIFTBinMask();
		var binLookup = binMask["value"];
		var binWidth = binMask["width"];
		var binCount = binMask["bins"];
		var binWeights = binMask["weights"];
	var binsSize = 8;
//	var binsSize = 16;
	var vectorLen = binCount*binsSize;
	var vector = Code.newArrayZeros(vectorLen*colorCount);

	var angleX = V2D.angleDirection(V2D.DIRX,directionX);
	var sizeX = directionX.length();
	var sizeY = directionY.length();
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();


	var gradients = FeatureTest._SIFTimage(imageMatrix, binWidth, center, scale,-angleX,sizeX,sizeY,-optimumAngle, colors);
	//console.log(gradients)
	var gradientR, gradientG, gradientB, gradientY;
	if(colors){
		var gradientR = gradients["r"];
		var gradientG = gradients["g"];
		var gradientB = gradients["b"];
	}else{
		var gradientY = gradients["y"];
	}

	for(var j=0; j<binWidth; ++j){
		for(var i=0; i<binWidth; ++i){
			var index = j*binWidth + i;
			var bin = binLookup[index];
			if(bin>=0){
				var weight = binWeights[index];
				if(colors){
					R3D._SIFVectorRGBCircularVectorAdd(vector, gradientR[index], binsSize, binCount, vectorLen, bin, weight, 0);
					R3D._SIFVectorRGBCircularVectorAdd(vector, gradientG[index], binsSize, binCount, vectorLen, bin, weight, 1);
					R3D._SIFVectorRGBCircularVectorAdd(vector, gradientB[index], binsSize, binCount, vectorLen, bin, weight, 2);
				}else{
					R3D._SIFVectorRGBCircularVectorAdd(vector, gradientY[index], binsSize, binCount, vectorLen, bin, weight, 0);
				}
			}
		}
	}
	var min = Code.minArray(vector);
	Code.arraySub(vector, min);
	Code.normalizeArray(vector);
	vector = ImageMat.pow(vector,0.25);
	return vector;
}
FeatureTest._SIFTimage = function(imageMatrix, insideSet, location, scale,angle,sizeX,sizeY,bestAngle, colors){
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	if(colors){
		var red = FeatureTest._SIFTchannel(imageMatrix.red(), wid,hei, insideSet, location, scale,angle,sizeX,sizeY,bestAngle);
		var grn = FeatureTest._SIFTchannel(imageMatrix.grn(), wid,hei, insideSet, location, scale,angle,sizeX,sizeY,bestAngle);
		var blu = FeatureTest._SIFTchannel(imageMatrix.blu(), wid,hei, insideSet, location, scale,angle,sizeX,sizeY,bestAngle);
		return {"r":red,"g":grn,"b":blu};
	}else{
		var gry = FeatureTest._SIFTchannel(imageMatrix.gry(), wid,hei, insideSet, location, scale,angle,sizeX,sizeY,bestAngle);
		return {"y":gry};
	}
}
// imageMatrix, point,scale,angle,sizeX,sizeY,bestAngle, sizeWidth,sizeHeight
//FeatureTest._SIFTchannel = function(source,width,height, insideSet, location, scale, angle){
FeatureTest.CALLX1 = 0;	
FeatureTest._SIFTchannel = function(source,width,height, insideSet, location, scale,angle,sizeX,sizeY,bestAngle){
	var padding = 2;
	var outsideSet = insideSet + 2*padding;
	// extract image at new orientation
	var scaleX = insideSet/sizeX;
	var scaleY = insideSet/sizeY;
	var matrix = new Matrix(3,3).identity();
		// matrix = Matrix.transform2DTranslate(matrix, (-location.x) , (-location.y) );
		// matrix = Matrix.transform2DScale(matrix, scale);
		// matrix = Matrix.transform2DRotate(matrix, -angle);
		// matrix = Matrix.transform2DTranslate(matrix, (outsideSet*0.5) , (outsideSet*0.5) );
		// matrix = Matrix.inverse(matrix);

		matrix = Matrix.transform2DTranslate(matrix, -outsideSet*0.5, -outsideSet*0.5);
		matrix = Matrix.transform2DRotate(matrix,angle);
		matrix = Matrix.transform2DScale(matrix,scaleX,scaleY);
		matrix = Matrix.transform2DRotate(matrix,bestAngle);
		matrix = Matrix.transform2DScale(matrix,scale);
		matrix = Matrix.transform2DTranslate(matrix, location.x, location.y);
		
		// matrix = Matrix.transform2DTranslate(matrix, (-location.x) , (-location.y) );
		// matrix = Matrix.transform2DScale(matrix, scale);
		// matrix = Matrix.transform2DRotate(matrix, -angle);
		// matrix = Matrix.transform2DTranslate(matrix, (outsideSet*0.5) , (outsideSet*0.5) );
		// matrix = Matrix.inverse(matrix);



	var area = ImageMat.extractRectFromMatrix(source, width,height, outsideSet,outsideSet, matrix);
	// BLUR IMAGE
	//var blurred = ImageMat.getBlurredImage(area, outsideSet,outsideSet, SIFTDescriptor.GAUSSIAN_BLUR_GRADIENT);
	var blurred = area;

		// var img, d;
		// img = GLOBALSTAGE.getFloatRGBAsImage(blurred,blurred,blurred, outsideSet, outsideSet);
		// d = new DOImage(img);
		// d.matrix().scale(2.0);
		// d.matrix().translate(10 + 50*FeatureTest.CALLX1, 10 + 50);
		// GLOBALSTAGE.addChild(d);
		// ++FeatureTest.CALLX1;

	// GET DERIVATIVES
	var gradients = ImageMat.gradientVector(blurred, outsideSet,outsideSet).value;
	gradients = ImageMat.unpadFloat(gradients,outsideSet,outsideSet, padding,padding,padding,padding);
	return gradients;
}

// FeatureTest.prototype.processCornerFeatures = function(image, corners, offY){
// 	var vectors = [];
// }

FeatureTest.prototype.processMSERfeatures = function(image, corners, gradient, features, offY){
	console.log(corners);
var featureScale = 1.0;
	var vectors = [];
	var blockSize = 24;
	offY += 200;

	for(var i=0; i<features.length; ++i){
		

		var feature = features[i];
		var center = feature["center"];
		var dirX = feature["x"];
		var dirY = feature["y"];
		var sizeX = dirX.length();
		var sizeY = dirY.length();
		var scaleX = blockSize/sizeX;
		var scaleY = blockSize/sizeY;
		
		// var sigma = null;
		// var matrix = new Matrix(3,3).identity();
		// 	matrix = Matrix.transform2DRotate(matrix,-angleX);
		// 	matrix = Matrix.transform2DScale(matrix,scaleX,scaleY);
			//matrix = Matrix.transform2DRotate(matrix,-angleX);
		
		//x,y,scale,sigma, w,h, imgSource,imgWid,imgHei, matrix
		//var cornerBlock = ImageMat.extractRectFromFloatImage(center.x,center.y,1.0,sigma,blockSize,blockSize, corners,width,height, matrix);
		// x,y,scale,sigma, w,h, imgSource,imgWid,imgHei, matrix)
		//var cornerBlock = ImageMat.extractRectFromFloatImage(center.x,center.y,1.0,sigma,blockSize,blockSize, image.gry(),width,height, matrix);




if(corners){ // make corner features
	var a = center.copy().add( dirX.copy().scale(-0.5) ).add( dirY.copy().scale(-0.5) );
	var b = a.copy().add(dirX);
	var c = a.copy().add(dirX).add(dirY);
	var d = a.copy().add(dirY);
	var poly = [a,b,c,d];
	// find all incident corners
	var averageSize = (sizeX+sizeY)*0.5;
	for(var c=0; c<corners.length; ++c){
		var corner = corners[c];
		var inside = Code.isPointInsidePolygon2D(center,poly);
		if(inside){
			// console.log("inside");
			// console.log(corner);
			var cen = new V2D(corner.x,corner.y);
			var dX = new V2D(averageSize,0);
			var dY = new V2D(0,averageSize);
			var f = {"center":cen,"x":dX,"y":dY};
			FeatureTest.addToVectors(vectors, f, cen, dX,dY, featureScale, image, blockSize);
		}
	}
}else{
	//console.log("i: "+i);
	FeatureTest.addToVectors(vectors, feature, center, dirX,dirY, featureScale, image, blockSize);
}

	
	//console.log("bestAngle: "+bestAngle);

/*
		matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DRotate(matrix,-angleX);
			matrix = Matrix.transform2DScale(matrix,scaleX,scaleY);
			matrix = Matrix.transform2DRotate(matrix,-bestAngle);
		var block = image.extractRectFromFloatImage(center.x,center.y,1.0,sigma,blockSize,blockSize, matrix);

		var img, d;
		img = GLOBALSTAGE.getFloatRGBAsImage(block.red(), block.grn(), block.blu(), block.width(), block.height());
		//img = GLOBALSTAGE.getFloatRGBAsImage(cornerBlock,cornerBlock,cornerBlock, blockSize,blockSize);
		d = new DOImage(img);
		d.matrix().scale(2.0);
		d.matrix().translate(10 + 50*i, 10 + offY);
		GLOBALSTAGE.addChild(d);

*/

		
		// get primary direction

		// if(i>3){
		// 	break;
		// }
		// if(i>50){
		// 	break;
		// }
	}
	return vectors;
}
FeatureTest.addToVectors = function(vectors, feature, center, dirX,dirY, featureScale, image, blockSize){
	var paddingSize = 4;
	var gradientBlockSize = blockSize + 2*paddingSize;

	var sizeX = dirX.length();
	var sizeY = dirY.length();
	//var maxSize = Math.max(sizeX,sizeY);
	var angleX = V2D.angleDirection(V2D.DIRX,dirX);
	//var widthToHeight = sizeX/sizeY;
	var scaleX = blockSize/sizeX;
	var scaleY = blockSize/sizeY;

	var useColors = true;
	//var featureScale = 1.0;
	//var featureScale = 1.0/Math.sqrt(2.0); // 0.707 inside circle
	//var featureScale = 0.5; // zoom out
	var featureScale = .707;
	
	var width = image.width();
	var height = image.height();
	var blockMask = ImageMat.circleMask(blockSize);
	var sigma = 1.0;
	var gaussMask = ImageMat.gaussianMask(blockSize,blockSize, sigma);




	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,-angleX);
		matrix = Matrix.transform2DScale(matrix,scaleX,scaleY);
		matrix = Matrix.transform2DScale(matrix,featureScale);
		//matrix = Matrix.transform2DScale(matrix,2.5);
		// matrix = Matrix.transform2DRotate(matrix,-bestAngle);
	var gradientBlock = ImageMat.extractRectFromFloatImage(center.x,center.y,2.0,null,gradientBlockSize,gradientBlockSize, image.gry(),width,height, matrix);
	var gradientBlurBlock = ImageMat.getBlurredImage(gradientBlock, gradientBlockSize, gradientBlockSize, 1.0);
	var gradientBlock = ImageMat.gradientVector(gradientBlurBlock, gradientBlockSize, gradientBlockSize).value;
	gradientBlock = ImageMat.subImage(gradientBlock,gradientBlockSize,gradientBlockSize, paddingSize,paddingSize,blockSize,blockSize);
	
	// var gradientBlock = image.extractRectFromFloatImage(center.x,center.y,1.0,sigma,gradientBlockSize,gradientBlockSize, matrix);
	// var gradientBlurBlock = gradientBlock.getBlurredImage(1.0);
	// var gradientBlock = gradientBlurBlock.calculateGradient();


	// find primary direction:
/*
	var binsTotal = 16;
	var bins = Code.newArrayZeros(binsTotal);
	var off = (blockSize-0.5)*0.5;
	for(var x=0; x<blockSize; ++x){
		for(var y=0; y<blockSize; ++y){
			var index = y*blockSize + x;
			var maskValue = blockMask[index];
			if(maskValue>0){
				var vx = x - off;
				var vy = y - off;
				var angle = Math.atan2(vy,vx) + Math.PI;
				var bin = Math.min(Math.floor((angle/Math.PI2)*binsTotal),binsTotal-1);
				var cornerScore = cornerBlock[index];
				var distance = Math.sqrt( vx*vx + vy*vy );
				if(distance<1){
					distance = 1;
				}
				// distance = 1.0;
				var score = cornerScore / distance;
				bins[bin] += score;
			}
		}
	}
	*/

	//var binsTotal = 36;
	//var binsTotal = 48;
	var binsTotal = 64;

	// TODO: find different peaks

	var bins = Code.newArrayZeros(binsTotal);
	var off = (blockSize-0.5)*0.5;
	for(var x=0; x<blockSize; ++x){
		for(var y=0; y<blockSize; ++y){
			var index = y*blockSize + x;
			var maskValue = blockMask[index];
			if(maskValue>0){
				var grad = gradientBlock[index];
				var mag = grad.length();
				var vx = x - off;
				var vy = y - off;
				// var angle = Math.atan2(vy,vx) + Math.PI;
				var angle = Math.atan2(grad.y,grad.x) + Math.PI;
				var bin = Math.min(Math.floor((angle/Math.PI2)*binsTotal),binsTotal-1);
				//var cornerScore = cornerBlock[index];
				var distance = Math.sqrt( vx*vx + vy*vy );
				if(distance<1){
					distance = 1;
				}
				//var falloff = Math.exp(-distance*distance*1.0);
				var falloff = 1.0;
				//distance = 1.0;
				var score = mag * falloff;
				bins[bin] += score;
			}
		}
	}
	
	var bestBinDropPercent = 0.75;
	var bestBinKeepPercent = 0.80;
	var info = Code.infoArray(bins);
	var maxAngleScore = info["max"];
	var scoreCutoffDrop = maxAngleScore*bestBinDropPercent;
	var scoreCutoffKeep = maxAngleScore*bestBinDropPercent;
	var bestAngles = [];
	var checkAngles = [];
	for(var index=0; index<bins.length; ++index){
		var bin = bins[index];
		if(bin>=scoreCutoffDrop){
			checkAngles.push([bin,index]);
		}
		if(bin>=scoreCutoffKeep){
			bestAngles.push([bin,index]);
		}
	}
useColors = false;
	if(checkAngles.length<=2){
	//if(true){//if(checkAngles.length<=5){
		for(var j=0; j<bestAngles.length; ++j){
			var best = bestAngles[j];
			var index = best[1];
			var bestAngle = R3D.interpolateAngleMaxima(bins,index);
			var vectorSAD = FeatureTest.SADVectorRGBGradientOctantCircular(image, center,dirX,dirY,bestAngle);
			var vectorSIFT = FeatureTest.SIFTVectorCircular(image, center,dirX,dirY,bestAngle, useColors);
			var vector = [];
				Code.arrayPushArray(vector,vectorSIFT);
				Code.arrayPushArray(vector,vectorSAD);
				//console.log("sizes: "+vectorSAD.length+" / "+vectorSIFT.length); // 200/600
			
			vectors.push({"vector":vector, "feature":feature, "angle":bestAngle});
		}
	}
}

FeatureTest.prototype.showMSERmatches = function(matches, imageA, imageB){
	var offY = 0;
	var blockSize = 25;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pairs = [match["A"],match["B"]];
		for(var j=0; j<pairs.length; ++j){
			var item = pairs[j];
			var feature = item["feature"];
			var center = feature["center"];
			var dirX = feature["x"];
			var dirY = feature["y"];
			//var bestAngle = feature["angle"];
			var bestAngle = item["angle"];
			var sizeX = dirX.length();
			var sizeY = dirY.length();
			var angleX = V2D.angleDirection(V2D.DIRX,dirX);
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
				matrix = Matrix.transform2DScale(matrix,0.5);
			var block = image.extractRectFromFloatImage(center.x,center.y,1.0,null,blockSize,blockSize, matrix);

			var img, d;
			img = GLOBALSTAGE.getFloatRGBAsImage(block.red(), block.grn(), block.blu(), block.width(), block.height());
			d = new DOImage(img);
			d.matrix().scale(2.0);
			d.matrix().translate(10 + 50*i, 10 + offY + 50*j);
			GLOBALSTAGE.addChild(d);
		}
	}
}

FeatureTest.compareSADVectors = function(vectorA, vectorB){
	var score = 0;
	var i, len = vectorA.length;
	for(i=0; i<len; ++i){
		var a = vectorA[i];
		var b = vectorB[i];
		var d = Math.abs(a-b);
		score += d;
		//score += d*d;
	}
	return score;
}

FeatureTest.prototype.compareVectors = function(objectsA, putativeA, objectsB, putativeB, minimumRatio, minScore){
	minimumRatio = 0.95;
	minScore = 0.0;
	var sortScore = function(a,b){
		return a["score"] < b["score"] ? -1 : 1;
	};
	var tableMatch = {};
	var i, j, k;
	var matches = [];
	var matchesA = Code.newArrayArrays(objectsA.length);
	var matchesB = Code.newArrayArrays(objectsB.length);
	// index
	for(i=0; i<objectsA.length; ++i){
		objectsA[i]["index"] = i;
	}
	for(i=0; i<objectsB.length; ++i){
		objectsB[i]["index"] = i;
	}
	// A to putative B
	for(i=0; i<objectsA.length; ++i){
		var objectA = objectsA[i];
		var putative = putativeA; // if simply list
		if( Code.isArray(putative[0]) ){ // list of arrays
			putative = putative[i];
		}
		var vectorA = objectA["vector"];
		var indexA = objectA["index"];
		var sadA = objectA["sad"];

		for(j=0; j<putative.length; ++j){
			var lookup = i+"-"+j;
			tableMatch[lookup] = true;
			var objectB = putative[j];
			var vectorB = objectB["vector"];
			var indexB = objectB["index"];
			//var sadB = objectB["sad"];
			var score = FeatureTest.compareSADVectors(vectorA, vectorB);
			var match = {"A":objectA, "B":objectB, "score":score, "a":indexA, "b":indexB};
			matchesA[indexA].push(match);
			matchesB[indexB].push(match);
			matches.push(match);
		}
	}
	// B to putative A
	for(i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i];
		var putative = putativeB;
		if( Code.isArray(putative[0]) ){ // list of arrays
			putative = putative[i];
		}
		var vectorB = objectB["vector"];
		var indexB = objectB["index"];
		var sadB = objectB["sad"];
		for(j=0; j<putative.length; ++j){
			var lookup = j+"-"+i;
			if(tableMatch[lookup]){
				continue;
			}
			tableMatch[lookup] = true;
			var objectA = putative[j];
			var vectorA = objectA["vector"];
			var indexA = objectA["index"];
			var score = FeatureTest.compareSADVectors(vectorA, vectorB);
			var match = {"A":objectA, "B":objectB, "score":score, "a":indexA, "b":indexB};
			matchesA[indexA].push(match);
			matchesB[indexB].push(match);
			matches.push(match);
		}
	}
	// sort
	for(i=0; i<objectsA.length; ++i){
		matchesA[i] = matchesA[i].sort(sortScore);
	}
	for(i=0; i<objectsB.length; ++i){
		matchesB[i] = matchesB[i].sort(sortScore);
	}
//	console.log(matches);
	// matches = matches.sort(sortScore);
	//console.log(objectsA.length+" x "+objectsB.length+" = "+matches.length);
	var bestMatches = [];

	for(i=0; i<matchesA.length; ++i){
		var lA = matchesA[i];
		if(lA.length>0){
			var matchFound = false;
			var mA = lA[0];
			var aA = mA["a"];
			var aB = mA["b"];
			var lB = matchesB[aB];
			//console.log(lB.length);
			// match based on top matches equal eachother
			if(lB && lB.length>0){
				var mB = lB[0];
				var bA = mB["a"];
				var bB = mB["b"];
				if(aA==bA && aB==bB){
					//console.log("FOUND: "+i+","+j)
					var objectA = mA["A"];
					var objectB = mB["B"];
					var score = lA[0]["score"];
					// console.log(score);
					var scoreRank = null;
					var scoreA, scoreB;
					// var pass = false;
					if(lA.length>1 && lB.length>1){
						scoreA = lA[0]["score"]/lA[1]["score"];
						scoreB = lB[0]["score"]/lB[1]["score"];
						scoreRank = Math.max(scoreA,scoreB);
						//console.log(scoreA+" + "+scoreB+" = "+scoreRank);
						var score = scoreRank;
						var match = {"A":objectA, "B":objectB, "score":score, "a":objectA["index"], "b":objectB["index"]};
						bestMatches.push(match);
					}
				}
			}
		}
	}
	bestMatches.sort(sortScore);
	// bestMatches.sort(function(a,b){
	// 	return a["score"] < b["score"] ? -1 : 1;
	// });
	console.log(bestMatches);
	return bestMatches;
}
FeatureTest.convertCornersToFeatures = function(corners, features, imageMatrix){
	HERE
	/*
	create 'corner' objects
	put corners in quadtree
	for each region
		get local rect from feature
		grab all points inside rect
			each corner inside actual rect:
			=> set feature IF is feature average area is smaller than current
	each corner object with feature assigned:
		convert to 'region' at 
	*/
	return [];
}

FeatureTest.prototype.imagesLoadComplete2 = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
//GLOBALSCALE = 1.75;
 GLOBALSCALE = 1.0;
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		d.matrix().scale(GLOBALSCALE);
		//d.graphics().alpha(0.03);
		d.graphics().alpha(0.50);
		//d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width*GLOBALSCALE;
	}
	var display = this._root;
	display.matrix().scale(1.5);
	GLOBALSTAGE = this._stage;

var imagePathA = fileList[0];
var imagePathB = fileList[1];

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);


// var temp = imageMatrixB
// imageMatrixB = imageMatrixA
// imageMatrixA = temp

	// var featuresA = R3D.optimalFeaturePointsInImage(imageMatrixA);
	// var featuresB = R3D.optimalFeaturePointsInImage(imageMatrixB);

// imageMatrixGA = imageMatrixA.gradientMagnitude();
// imageMatrixGA.normalize();
// imageMatrixGB = imageMatrixB.gradientMagnitude();
// imageMatrixGB.normalize();






/*
// A
var pt = new V3D(151,104, 4.0);
//var pt = new V3D(251,104, 4.0);

// B
//pt.scale(2.0);


featuresA = [];
featuresB = [];


featuresA.push(pt);



// costToMoveAny



var point = pt.copy();
	var imageMatrix = imageMatrixA;
	//var imageMatrix = imageMatrixB;
var padding = 2;
var blockSize = 21;
var blockInsideA = blockSize-2;
var blockMask = ImageMat.circleMask(blockSize,blockSize, 0);
var blockMaskA = ImageMat.circleMask(blockSize,blockSize, 2);
var blockMaskB = ImageMat.circleMask(blockSize,blockSize, 4);


var prevBlock = null;

var scales = [0.125,0.25,0.5,1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0,9.0,10.0,12.0,14.0,16.0,18.0,20.0,25.0,30.0];
var size = point.z;
var cellScale = 1.0;
var angle = 0;
var x = [];
for(var i=0; i<scales.length; ++i){
	var sigma = null;
	//console.log(i+": "+s)
	var s = 1.0/scales[i];
	//var s = scales[i];
	var scale = s * blockSize/size;
		var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		matrix = Matrix.transform2DRotate(matrix,angle);
	var block = imageMatrix.extractRectFromFloatImage(point.x,point.y,1.0,sigma,blockSize,blockSize, matrix);
	
	var gry = block.gry();
	// var entropy = Code.entropy01(gry, blockMask);
	// var range = Code.range(gry, blockMask);
	// var value = entropy*range;
	var value = Code.variability(gry, block.width(), block.height(), blockMask);
	// Code.variability = function(data, width, height, masking, isMin){
	x.push(value);
	


var img, d;
img = GLOBALSTAGE.getFloatRGBAsImage(block.red(), block.grn(), block.blu(), block.width(), block.height());
d = new DOImage(img);
//d.matrix().scale();//displayScale*originalWid/imageCurrentWid);
d.matrix().translate(100, 50 + 30*i);
GLOBALSTAGE.addChild(d);
}


Code.printMatlabArray(x,"x");

return;
*/



var useCorners = false; // SIFT points are still more poor than corners
//var useCorners = true;
var useSIFT = false;
//var useSIFT = true;
//var useCornerGeometry = true;
var useCornerGeometry = false;

var useCorners = false;
var useBlobs = true;

var featuresA = null;
var featuresB = null;
if(useCorners){
	// featuresA = R3D.testExtract1(imageMatrixA, R3D.CORNER_SELECT_REGULAR, null, true);
	// featuresB = R3D.testExtract1(imageMatrixB, R3D.CORNER_SELECT_REGULAR, null, true);
	// if too few points, 
	featuresA = R3D.testExtract1(imageMatrixA, R3D.CORNER_SELECT_RELAXED, null, true);
	featuresB = R3D.testExtract1(imageMatrixB, R3D.CORNER_SELECT_RELAXED, null, true);
	/*for(var i=0; i<featuresA.length; ++i){
		featuresA[i].z *= 2;
	}
	for(var i=0; i<featuresB.length; ++i){
		featuresB[i].z *= 2;
	}*/
	// featuresA = R3D.cornerFeaturesAddAngles(imageMatrixA, featuresA);
	// featuresB = R3D.cornerFeaturesAddAngles(imageMatrixB, featuresB);
	// var featuresA = R3D.testExtract1(imageMatrixGA, null, null, true);
	// var featuresB = R3D.testExtract1(imageMatrixGB, null, null, true);
}else if(useSIFT){
	featuresA = R3D.SIFTExtractTest1(imageMatrixA);
	featuresB = R3D.SIFTExtractTest1(imageMatrixB);
	// featuresA = R3D.featureCornersToPSA(featuresA, imageMatrixA);
	// featuresB = R3D.featureCornersToPSA(featuresB, imageMatrixB);
}else if(useCornerGeometry){
	console.log("useCornerGeometry");
	featuresA = R3D.extractCornerGeometryFeatures(imageMatrixA, true);
	featuresB = R3D.extractCornerGeometryFeatures(imageMatrixB, true);
}else if(useBlobs){
	var gryA = imageMatrixA.gry();
	var gryB = imageMatrixB.gry();
	// var cornersA = R3D.cornerScaleScores(gryA,imageMatrixA.width(),imageMatrixA.height()).value;
	// var cornersB = R3D.cornerScaleScores(gryB,imageMatrixB.width(),imageMatrixB.height()).value;
	
	// ImageMat.pow(cornersA,0.25);
	// ImageMat.pow(cornersB,0.25);

	// //ImageMat.pow(cornersA,0.1);
	// var sigma = 1.0;
	// cornersBlurA = ImageMat.getBlurredImage(cornersA, imageMatrixA.width(),imageMatrixA.height(), sigma);
	// ImageMat.normalFloat01(cornersBlurA);

	// cornersBlurB = ImageMat.getBlurredImage(cornersB, imageMatrixB.width(),imageMatrixB.height(), sigma);
	// ImageMat.normalFloat01(cornersBlurB);

	// //ImageMat.normalFloat01(cornersA);

	// cornersA = cornersBlurA;
	// cornersB = cornersBlurB;

	// var gradientA = ImageMat.gradientVector(gryA,imageMatrixA.width(),imageMatrixA.height());
	// var gradientB = ImageMat.gradientVector(gryB,imageMatrixB.width(),imageMatrixB.height());

var gradientA = null;
var gradientB = null;
var cornersA = null;
var cornersB = null;

	//ImageMat.pow(cornersA,0.25);
	// ImageMat.addConst(cornersA,1.0);
	// ImageMat.log(cornersA);
	// ImageMat.addConst(cornersA,1.0);
	// ImageMat.log(cornersA);
	//ImageMat.normalFloat01(cornersA);



		// var img, d;
		// img = GLOBALSTAGE.getFloatRGBAsImage(cornersA,cornersA,cornersA, imageMatrixA.width(),imageMatrixA.height());
		// d = new DOImage(img);
		// d.matrix().scale(1.5);
		// d.matrix().translate(0,0);
		// GLOBALSTAGE.addChild(d);
	var display = this._root;

	featuresA = R3D.MSERfeatures(imageMatrixA);
	featuresB = R3D.MSERfeatures(imageMatrixB);
	console.log("features: "+featuresA.length+"  "+featuresB.length);
	var c1 = 0xFFFF0000;
	this.showMSER(featuresA, display, 0,0, c1);
	this.showMSER(featuresB, display, imageMatrixA.width(),0, c1);


	// corner play:
	//var types = R3D.CORNER_SELECT_RELAXED;
	var types = R3D.CORNER_SELECT_REGULAR;
	var cornersA = R3D.testExtract1(imageMatrixA, types, null, true);
	var cornersB = R3D.testExtract1(imageMatrixB, types, null, true);
	console.log("corners: "+cornersA.length+"  "+cornersB.length);
	var c1 = 0xFF00FF00;

	Code.truncateArray(cornersA,10);
	Code.truncateArray(cornersB,10);
	this.showCorners(cornersA, display, 0,0, c1);
	this.showCorners(cornersB, display, imageMatrixA.width(),0, c1);
	console.log(cornersA);


	// convert corners to features:
	var featuresA = FeatureTest.convertCornersToFeatures(cornersA, featuresA, imageMatrixA);
	var featuresB = FeatureTest.convertCornersToFeatures(cornersB, featuresB, imageMatrixB);

//	HERE

	var cornersA = null;
	var cornersB = null;
	var vectorsA = this.processMSERfeatures(imageMatrixA, cornersA, gradientA, featuresA, 0);
	var vectorsB = this.processMSERfeatures(imageMatrixB, cornersB, gradientB, featuresB, 50);
	console.log("vectors: "+vectorsA.length+"  "+vectorsB.length);
	
	var fA = [];
	for(var i=0; i<vectorsA.length; ++i){
		var vector = vectorsA[i];
		fA.push(vector["feature"]);
	}
	var fB = [];
	for(var i=0; i<vectorsB.length; ++i){
		var vector = vectorsB[i];
		fB.push(vector["feature"]);
	}

	this.showMSER(fA, display, 0,0, 0xFF00FF00);
	this.showMSER(fB, display, imageMatrixA.width(),0, 0xFF00FF00);
	
	var matches = this.compareVectors(vectorsA,vectorsB, vectorsB,vectorsA);
	this.showMSERmatches(matches, imageMatrixA, imageMatrixB);
	




	


	// var vectorsA = this.processCornerFeatures(imageMatrixA, cornersA, 0);
	// var vectorsB = this.processCornerFeatures(imageMatrixB, cornersB, 50);

	throw "HERE";
}

// OVERWRITE: / ADD:
// featuresA = R3D.cornerFeaturesAddAngles(imageMatrixA, featuresA);
// featuresB = R3D.cornerFeaturesAddAngles(imageMatrixB, featuresB);

console.log(featuresA.length+" | "+featuresB.length);

// console.log(featuresA)
// // group by corners
// //if(false){
// if(true){
// // convert point features to line-features
// 	featuresA = R3D.featureCornersToLines(featuresA, imageMatrixA);
// 	featuresB = R3D.featureCornersToLines(featuresB, imageMatrixB);
// 	console.log(featuresA.length+" | "+featuresB.length);
// }


if(false){
// default set corner size & orientation
var lists = [featuresA,featuresB];
for(var f=0; f<lists.length; ++f){
	var features = lists[f];
	for(var k=0; k<features.length; ++k){
		var feature = features[k];
		feature.z *= 10; // 1 -> size
		feature.t = 0.0; // 0 rotation
	}
}
}

// show initial feature sites
if(true){
// if(false){
	// show points:
	var lists = [featuresA,featuresB];
	for(var f=0; f<lists.length; ++f){
		var features = lists[f];
		
		for(k=0; k<features.length; ++k){
			var point = features[k];
			if(!Code.isa(point,V4D)){
				point = new V4D(point["point"].x,point["point"].y, point["size"],point["angle"]);
			}
			//console.log(""+point)
				// var x = point.x * imageMatrixA.width();
				// var y = point.y * imageMatrixA.height();
				// var z = point.z;
				var x = point.x;
				var y = point.y;
				var z = point.z;
				var a = point.t;
//z=1
//z *= 0.25;
			var c = new DO();
				color = 0xFFFF0000;
				//color = Code.getColARGBFromFloat(1.0,1.0 * Math.pow((point.t-min) / (max-min), .5),0,0);
				//color = 0xFF000000;
				c.graphics().setLine(0.50, color);
				c.graphics().beginPath();
				c.graphics().drawCircle(x, y, z);
				c.graphics().strokeLine();
				c.graphics().endPath();

				var v = new V2D(z,0);
				v.rotate(a);
				c.graphics().beginPath();
				c.graphics().moveTo(x,y);
				c.graphics().lineTo(x+v.x,y+v.y);
				c.graphics().strokeLine();
				c.graphics().endPath();
				c.matrix().scale(GLOBALSCALE);
				c.matrix().translate(0 + f*imageMatrixA.width()*GLOBALSCALE, 0);
				display.addChild(c);
		}
	}
	//return;
}



return;





	// var cornerMatrixAR = R3D.cornerScaleScores(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var cornerMatrixAG = R3D.cornerScaleScores(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var cornerMatrixAB = R3D.cornerScaleScores(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var cornerMatrixA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), cornerMatrixAR,cornerMatrixAG,cornerMatrixAB);
	// var cornerMatrixBR = R3D.cornerScaleScores(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var cornerMatrixBG = R3D.cornerScaleScores(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var cornerMatrixBB = R3D.cornerScaleScores(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var cornerMatrixB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), cornerMatrixBR,cornerMatrixBG,cornerMatrixBB);

	// var gradientMatrixAR = ImageMat.gradientMagnitude(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var gradientMatrixAG = ImageMat.gradientMagnitude(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var gradientMatrixAB = ImageMat.gradientMagnitude(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var gradientMatrixA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), gradientMatrixAR,gradientMatrixAG,gradientMatrixAB);
	// var gradientMatrixBR = ImageMat.gradientMagnitude(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var gradientMatrixBG = ImageMat.gradientMagnitude(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var gradientMatrixBB = ImageMat.gradientMagnitude(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var gradientMatrixB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), gradientMatrixBR,gradientMatrixBG,gradientMatrixBB);

// 	// get sift-vectors:
// 	var list = [featuresA,featuresB];
// 	var images = [imageMatrixA, imageMatrixB];
// 	// var corners = [cornerMatrixA,cornerMatrixB];
// 	// var gradients = [gradientMatrixA,gradientMatrixB];
// 	var objectList = [];
// 	for(i=0; i<list.length; ++i){
// 		var imageMatrix = images[i];
// 		// var imageCorners = corners[i];
// 		// var imageGradients = gradients[i];
// //console.log(imageCorners)
// 		var features = list[i];
// 		//var vectors = [];
// 		//vectorList.push(vectors);
// 		var objects = [];
// 		objectList.push(objects);
// 		for(k=0; k<features.length; ++k){
// 			var point = features[k];
			
// 			var sizeCovariance = 21;
// 			var maskCOV = ImageMat.circleMask(sizeCovariance);
// //maskCOV = null;
// 			var location = new V2D(point.x,point.y);
// 			var rad = point.z;
// 			var dia = 2.0*rad; // full area
// 			var diaNeighborhood = dia * 2.0; // area around
// 			var scale = 1.0;
// 			var angle = 0.0;
// 			var skewX = 0.0;
// 			var skewY = 0.0;

// 			var size = sizeCovariance;
// 			scale = scale * diaNeighborhood/size;
// 			//var pointScale = scale;
// // ZOOM OUT TO GET MORE UNIQUENESS
// // FUZZ TO AVERAGE
// 			// var imageCorner = R3D.imageFromParameters(imageCorners, loc,scale,angle,skewX,skewY, size,size);
// 			// var imageGradient = R3D.imageFromParameters(imageGradients, loc,scale,angle,skewX,skewY, size,size);
// 			var image = R3D.imageFromParameters(imageMatrix, location,scale,angle,skewX,skewY, size,size);

// 			//image = imageGradient
// 			//image = image.getBlurredImage(1.0);

// // 			var cov = R3D.calculateCovarianceImage(image.gry(),image.width(),image.height(), maskCOV);
// // 			//console.log(cov);
// // 			var ang = R3D.calculatePrinciple(cov);
// // 			console.log(ang);
// // var pointAngle = ang["angle"];
// // var pointScale = ang["scale"];

// //var ang = R3D.covariangeImageRGB(image,maskCOV);
// //var ang = R3D.covariangeImageRGB(imageCorner,maskCOV);
// //var ang = R3D.covariangeImageRGB(imageGradient,maskCOV);
// //var pointAngles = R3D.angleImageRGB(imageGradient,maskCOV);
// var pointAngles = R3D.angleImageRGB(image,maskCOV);



// //var pointAngles = ang;
// for(a=0; a<pointAngles.length; ++a){
// 	var pointAngle = pointAngles[a];
// //var pointAngle = ang["angle"];
// //var pointScale = ang["scale"];


// // TODO: GET COV ANGLE / SCALE
// // var circleMask = ImageMat.circleMask(overallSize,overallSize);
// // var areaCenter = new V2D( (overallSize-1)*0.5, (overallSize-1)*0.5 );
// // var covariance = ImageMat.calculateCovariance(area, overallSize,overallSize, areaCenter, circleMask);
// // var covarianceRatio = covariance[0].z/covariance[1].z;
// // var covarianceAngle = V2D.angleDirection(V2D.DIRX, covariance[0]);
// // var covarianceScale = Math.pow(covarianceRatio,1.0);


// 			//var primaryAngle = ;
// // create a list of points from image vector
// 			//R3D.calculatePrinciple(points);
// 			//R3D.gradientDirection(rect, wid,hei);
// 			//R3D.covariance2D = function(points, centroid){
// //			???


// if(k<0){
// 			var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
// 				img = new DOImage(img);
// 				//img.matrix().scale();
// 				//img.matrix().translate(810 + Math.floor(i/10)*compareSize*sca* 2 + compareSize*sca, 10 + (i%10)*compareSize*sca);
// 				img.matrix().translate(-size*0.5,-size*0.5);
// 				img.matrix().rotate(-pointAngle);
// 				//img.matrix().scale(1.0/pointScale);
// 				img.matrix().translate(size*0.5,size*0.5);
// 				img.matrix().translate(810 + i*125 + a*size*1.1, 10 + k*size*1.1);
// 				display.addChild(img);
// }
// 				/*
// 				//var zoomScales = [1.0,1.5,2.0];
// 				//var zoomScales = [0.5,1.0,2.0];
// 				//var zoomScales = [1.0];
// 				//var zoomScales = [1.0,1.5,2.0];
// 				//var zoomScales = [1.0,1.5,2.0,2.5,3.0];
// 				//var zoomScales = [0.25,0.5,0.75,1.0];
// 				var zoomScales = [0.5,0.75,1.0,1.5,2.0];
// 				var gry = image.gry();
// 				var wid = image.width();
// 				var hei = image.height();
// 				var loc = new V2D(wid*0.5,hei*0.5);
// 				var sca = 1.0;
// 				var ang = 0.0;
// 				var vector = [];
// 				for(var z=0; z<zoomScales.length; ++z){
// 					var zoom = zoomScales[z];
// 					//var sca = zoom / diaNeighborhood;
// 					var sca = zoom * diaNeighborhood / 20; // TODO: 20 = 16 + 2*2 @ vectorFromImage
// 					var ang = pointAngle;
// 					// var vectorY = SIFTDescriptor.vectorFromImage(imageMatrix.gry(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
// 					// Code.arrayPushArray(vector,vectorY);
// 					var vectorR = SIFTDescriptor.vectorFromImage(imageMatrix.red(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
// 					var vectorG = SIFTDescriptor.vectorFromImage(imageMatrix.grn(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
// 					var vectorB = SIFTDescriptor.vectorFromImage(imageMatrix.blu(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
// 					Code.arrayPushArray(vector,vectorR);
// 					Code.arrayPushArray(vector,vectorG);
// 					Code.arrayPushArray(vector,vectorB);
// 				}
// 				*/
// 				var vector = R3D.SIFTVector(imageMatrix, location, diaNeighborhood, pointAngle);
// 			var object = {"angle":pointAngle, "scale":0.0, "size":diaNeighborhood, "point":location, "vector":vector};
// 			objects.push(object);
// }
			
// 		}
// 	}

// var objectsA = objectList[0];
// var objectsB = objectList[1];

console.log(featuresA);

// featuresA = R3D.keepGoodCornerFeatures(featuresA);
// featuresB = R3D.keepGoodCornerFeatures(featuresB);

console.log(featuresA.length+" v "+featuresB.length);

var objectsA = R3D.generateSIFTObjects(featuresA, imageMatrixA);
var objectsB = R3D.generateSIFTObjects(featuresB, imageMatrixB);

// for(var i=0; i<featuresA.length; ++i){
// 	console.log(featuresA[i]["angle"]+"|"+objectsA[i]["angle"])
// }

if(false){
//if(true){
	// reduce count
objectsA = R3D.siftObjectsToUnique(objectsA);
objectsB = R3D.siftObjectsToUnique(objectsB);
console.log(objectsA.length+" & "+objectsB.length);
}

/*

// SHOW SINGLE MATCH & EQUALITY INFORMATION


//var indexA = 10; // corner - grey
//var indexA = 70; // FL
//var indexA = 75;

//var indexA = 80;
//var indexA = 70;
//var indexA = 280; // face
var indexA = 290;



var upper = 1.0;

var objectA = objectsA[indexA];

var displaySize = 31;

var vectorA = objectA["vector"];
var indexA = objectA["index"];
var sadA = objectA["sad"];
var angleA = objectA["angle"];
var sizeA = objectA["size"];
var pointA = objectA["point"];
var scaleA = sizeA/displaySize;

scaleA = scaleA * upper;

// display:
var img = R3D.imageFromParameters(imageMatrixA, pointA,scaleA,angleA,0,0, displaySize,displaySize);
img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
var d = new DOImage(img);
d.matrix().translate(50, 50);
GLOBALSTAGE.addChild(d);


var rows = 15;
var results = [];
for(var j=0; j<objectsB.length; ++j){
	var objectB = objectsB[j];
	var vectorB = objectB["vector"];
	var indexB = objectB["index"];
	var sadB = objectB["sad"];
	var angleB = objectB["angle"];
	var sizeB = objectB["size"];
	var pointB = objectB["point"];
	var scaleB = sizeB/displaySize;

scaleB = scaleB * upper;

	//var scoreSIFT = SIFTDescriptor.compareVector(vectorA, vectorB);
	var scoreSAD = R3D.compareSADVector(sadA, sadB);
	//var scoreSAD = R3D.compareSADVector(sadA, sadB);
	//var scoreSAD = R3D.compareSADVector3D(sadA, sadB);
	//var scoreSAD = R3D.compareSADGradientVector(sadA, sadB);

	// display
	var img = R3D.imageFromParameters(imageMatrixB, pointB,scaleB,angleB,0,0, displaySize,displaySize);
	img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());

	//var img = SIFTDescriptor.flatFromImage(imageMatrixB.red(), imageMatrixB.width(),imageMatrixB.height(), pointB,scaleB,angleB);
	//img = GLOBALSTAGE.getFloatRGBAsImage(img,img,img, 11,11);
	
	
	var d = new DOImage(img);
	// var x = 100 + (j/rows|0)*(displaySize*2);
	// var y = 50 + (j%rows)*(displaySize+12)
	// d.matrix().translate(x, y);
	GLOBALSTAGE.addChild(d);


	//var score = scoreSIFT;
	var score = scoreSAD;
	
	
	//var disp = scoreSIFT.toExponential(4);
	//var disp = scoreSAD+"";//.toExponential(4);
	var disp = score+"";
	//disp = Code.clipStringToMaxChars(disp,6);
	disp = disp.substr(0,7);
	//Code.clipStringToMaxChars = function(str,chr,filler){
	var dd = new DOText(disp+"", 8, DOText.FONT_ARIAL, 0xFF000000, DOText.ALIGN_LEFT);
	// dd.matrix().translate(x,y+displaySize+8);
	GLOBALSTAGE.addChild(dd);


	
	//console.log(score)
	results.push([score, d, dd]);
}
results = results.sort(function(a,b){
	return a[0] < b[0] ? -1 : 1;
});

for(var j=0; j<results.length; ++j){
	var x = 100 + (j/rows|0)*(displaySize*2);
	var y = 50 + (j%rows)*(displaySize+12)

	var result = results[j];
	var score = result[0];
	var d = result[1];
	var dd = result[2];

	d.matrix().identity();
	d.matrix().translate(x, y);

	dd.matrix().identity();
	dd.matrix().translate(x,y+displaySize+8);

}


return;

*/






var matrixFfwd = null;
var matrixFrev = null;


var doFatMatch = true;
//var doFatMatch = false;
if(doFatMatch){

//var oldStuff = true;
var oldStuff = false;

if(oldStuff){
// DO UNKNOWN-ALL FAT MATCHING
console.log("FAT MATCH");
var matching = R3D.matchObjectsSubset(objectsA, objectsB, objectsB, objectsA);
var best = matching["best"];


var valueFxn = function(a){
	return a["score"];
}
var sigma = 1.5;
var groupA = Code.dropOutliers(best, valueFxn, sigma);
	var inA = groupA["inliers"];
	var ouA = groupA["outliers"];
	console.log("dropped: "+inA.length+" | "+ouA.length+" ("+(best.length-ouA.length)+")");
//best = inA;

var pointsA = [];
var pointsB = [];
for(i=0; i<best.length; ++i){
	pointsA.push(best[i]["A"]["point"]);
	pointsB.push(best[i]["B"]["point"]);
	//console.log(pointsA[i]+" / "+pointsB[i]);
}
//console.log(pointsA,pointsB);

if(pointsA.length<100){
	console.log("low amount of good fat matches");
}


// show first draft matches
//if(false){
if(true){
R3D.drawMatches(best, 0,0, imageMatrixA.width(),0, display);
return;
}

}else{ // old vs new stuff


//NEW:

//fullMatchesForObjects
var maxFeatures = 800;
var matchData = R3D.fullMatchesForObjects(objectsA, imageMatrixA, objectsB, imageMatrixB, maxFeatures);
var F = matchData["F"];
var matches = matchData["matches"];
console.log(matchData)

var matrixFfwd = F;
var matrixFrev = R3D.fundamentalInverse(matrixFfwd);

var pointsA = [];
var pointsB = [];
for(var i=0; i<matches.length; ++i){
	var match = matches[i];
//	console.log(match)
// console.log(match);
// console.log(match["from"]);
// console.log(match["from"]["point"]);
	pointsA.push(match["from"]["point"]);
	pointsB.push(match["to"]["point"]);
}

//if(false){
if(true){
R3D.drawMatches(matches, 0,0, imageMatrixA.width(),0, display);
R3D.showRansac(pointsA,pointsB, matrixFfwd, matrixFrev, display, imageMatrixA,imageMatrixB);
}


/*
// MAKE V4D points for generating relative transforms
var pointsA = [];
var pointsB = [];
// var transforms = [];
var matching = [];
for(var i=0; i<matches.length; ++i){
	var match = matches[i];
	console.log(match);
	throw "?"
	var score = match["score"];
	var A = match["from"];
	var B = match["to"];
	var pA = A["point"];
	var pB = B["point"];
	var sA = A["size"];
	var sB = B["size"];
	var aA = A["angle"];
	var aB = B["angle"];
	//var vA = new V4D(pA.x,pA.y,);
	// var matrix = R3D.matrixTransform2D(null,null, sA,sB, aA,aB);

	// var vA = new V4D(pA.x,pA.y,sA,aA);
	// var vB = new V4D(pB.x,pB.y,sB,aB);
	// pointsA.push(vA);
	// pointsB.push(vB);
	// transforms.push(matrix);

	var fr = {"point":pA, "size":sA, "angle":aA};
	var to = {"point":pB, "size":sB, "angle":aB};
	var m = {"score":score, "A":null, "B":null, "from":fr, "to":to};
	matching.push(m);
}
console.log(pointsA);
console.log(pointsB);
// console.log(transforms);
// = function(locationA,locationB, sizeA,sizeB, angleA,angleB){
*/



//var info = R3D.refinedMatchPoints(imageMatrixA,imageMatrixB, pointsA,pointsB);
// var transforms = info["transforms"];
// var pointsA = info["pointsA"];
// var pointsB = info["pointsB"];
//var yaml = R3D.outputSparsePoints(imageMatrixA,imageMatrixB, pointsA,pointsB, transforms);


var yaml = R3D.outputMatchPoints(imageMatrixA, imageMatrixB, matrixFfwd, matches, yaml);
///console.log(yaml)


return;
} // end new stuff
// 


// // initial test matching:
// console.log("initial matches start");
// var bestMatches = R3D.optimalFeatureMatchesInImages(imageMatrixA,imageMatrixB, featuresA,featuresB);
// var pointsA = bestMatches["pointsA"];
// var pointsB = bestMatches["pointsB"];
// var matches = bestMatches["matches"];
// console.log(pointsA,pointsB);

// console.log("refine start");
// var info = R3D.refinedMatchPoints(imageMatrixA,imageMatrixB, pointsA,pointsB);
// var transforms = info["transforms"];
// var pointsA = info["pointsA"];
// var pointsB = info["pointsB"];

// UNKNOWN F, DO RANSAC F SEARCH
console.log("ransac start");
// var error = 2.0; // few good matches
// var error = 1.5;
var error = 1.0; // lots of good matches
// var error = 0.5;
// var error = 0.25;
//var error = 1.0; // shows more points, shows more widespread misses
//var error = 0.5; // more points

var result = R3D.fundamentalRANSACFromPoints(pointsA,pointsB, error, matrixFfwd);
matrixFfwd = result["F"];
var recheckCount = 0;
if(result["matches"].length>200 && recheckCount>0){ // try with lower error to get more accurate F
	error = error * 0.5;
	var result = R3D.fundamentalRANSACFromPoints(pointsA,pointsB, error, matrixFfwd);
	var matrixFfwd = result["F"];
	--recheckCount;
}
matrixFrev = R3D.fundamentalInverse(matrixFfwd);
var ransacMatches = result["matches"];
console.log(matrixFfwd.toArray()+"");


// var matrixFfwd = R3D.fundamentalRefineFromPoints(pointsA,pointsB);
// var matrixFrev = R3D.fundamentalInverse(matrixFfwd);
// console.log(matrixFfwd+"");
// console.log(matrixFfwd.toArray()+"");

// matches = [];
// for(i=0; i<pointsA.length; ++i){
// 	matches.push({"pointA":pointsA[i], "pointB":pointsB[i]});
// }

console.log("showRansac...");
if(true){
//if(false){
R3D.showRansac(pointsA,pointsB, matrixFfwd, matrixFrev, display, imageMatrixA,imageMatrixB);
return;
}


// main test case
// 0.000009922081724208012,-0.000021979443879611114,-0.02408291331289476,-0.000018988317673575977,-0.000023988033072291394,-0.00921142272248456,0.023998774814843207,0.01644780293372704,0.029690954586221736
// 0.000008863797036674087,-0.000022999507708011593,-0.02269964556817645,-0.000021328907731917772,-0.000025310917963202806,-0.008034989957471685,0.023334388531389326,0.016257090703830034,-0.09187655405011143
// nu:
// -0.00001443379910278167,0.00001619149755304177,0.027196878457638442,0.00002262975572919865,0.00002427545587443947,0.010071448448549283,-0.02508059344765386,-0.016636806065596085,-0.26375845126737757
// 0.000012796345432805438,-0.00001813625433628053,-0.02665568702738417,-0.000021181659856711046,-0.000024294650708435927,-0.01023743045661177,0.025200989031943847,0.016930232400357896,0.1956812790803158

// pool
// parallelish:
// -4.329575620378955e-7,-0.000006527606439833653,-0.000035786992605986486,0.000010592059410897693,-0.000002301606537170875,0.013500324399064447,-0.0009201995453029818,-0.013870954152777209,-0.07627085401772694
// -9.114594473867189e-8,-9.314654939898829e-7,-0.00011759683512453242,0.000004775527415844851,-0.0000023837567721791096,0.014627715970924923,-0.0008512310413968526,-0.014812826381786258,-0.08706618390046071
// radialish:
// -0.0000012915273650053417,-0.00003994587372281122,0.004969366247427215,0.00004391476386329129,-0.0000018812180601731265,0.006239675069682308,-0.006123388330698889,-0.0074773214821302475,0.1269561914884496
// -9.607134124851651e-7,-0.00003477829274297771,0.00492854191289035,0.00003852144457127489,-0.000001919902454415091,0.007262668443135141,-0.006096071726922473,-0.00833262187469865,0.11780616036979104
// 0.0000012196664173849832,0.00002582351016668929,-0.001657679429534259,-0.000029985574376317293,0.0000018569147357183277,-0.0084990521584006,0.0025909194843890416,0.00942332287131448,-0.006972287558751901

// snow
// parallelish:
// 1.1800445042470806e-7,-0.0000027259485774118485,-0.0015187215077467541,0.000002571134191830763,2.3447461174616949e-7,-0.02217071738525383,0.0004886141322427082,0.021968974842540876,-0.19824168162683264
// 3.4009438688059313e-7,-0.000006704217159580149,-0.0010107730741188436,0.0000068767588301145586,4.2166096739107775e-7,-0.023586913283455423,-0.00011155676880719541,0.022954779872645263,-0.14908830209360915
// radial:
// -0.000010145954026738663,0.0002051991188203881,-0.02980968244798959,-0.00020427297167430989,-0.000010343796946417176,0.03163542344905958,0.02974061320378105,-0.01308367009715102,-2.3802670596704862




R3D.drawMatches(ransacMatches, 0,0, imageMatrixA.width(),0, display, 0x99FF0000);

// TODO: RANSAC HERE
// var ransac = R3D.fundamentalRANSACFromPoints(pointsA, pointsB, 1.5);
// var ransacMatches = ransac["matches"];
// pointsA = ransacMatches[0];
// pointsB = ransacMatches[1];
// var matrixFfwd = ransac["F"];
// var matrixFrev = R3D.fundamentalInverse(matrixFfwd);


} // doFatMatch
else
{ // already have F from array:

// main case study:
// var F = [0.000012796345432805438,-0.00001813625433628053,-0.02665568702738417,-0.000021181659856711046,-0.000024294650708435927,-0.01023743045661177,0.025200989031943847,0.016930232400357896,0.1956812790803158];

// pool
// 

// snow
// var F = [3.4009438688059313e-7,-0.000006704217159580149,-0.0010107730741188436,0.0000068767588301145586,4.2166096739107775e-7,-0.023586913283455423,-0.00011155676880719541,0.022954779872645263,-0.14908830209360915];

	F = new Matrix(3,3).fromArray(F);
	matrixFfwd = F;
	matrixFrev = R3D.fundamentalInverse(matrixFfwd);
}
	// var objectsA = objectsA;
	// var objectsB = objectsB;

	var error = 10; // 5=255 10=261
	var putativeA = R3D.limitedObjectSearchFromF(objectsA,imageMatrixA,objectsB,imageMatrixB,matrixFfwd, error);
	var putativeB = R3D.limitedObjectSearchFromF(objectsB,imageMatrixB,objectsA,imageMatrixA,matrixFrev, error);

	console.log("putatives: ");
	console.log(putativeA);
	console.log(putativeB);

	var matching = R3D.matchObjectsSubset(objectsA, putativeA, objectsB, putativeB);
	console.log(matching);
	// var matches = matching["matches"];
	// var matchesA = matching["A"];
	// var matchesB = matching["B"];
	var matchesBest = matching["best"];
	console.log("cross matching...");
	console.log(matchesBest);
	var matches = matchesBest;
// var matches = matching["matches"];
// console.log(matches);
	var rowSize = 15;
	var compareSize = 40;

//if(true){
if(false){
// show original best matches
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		//console.log(match)
		var objectA = match["A"];
		var pointA = objectA["point"];
		var angleA = objectA["angle"];
		var sizeA = objectA["size"];
		var objectB = match["B"];
		var pointB = objectB["point"];
		var angleB = objectB["angle"];
		var sizeB = objectB["size"];
		//var imageA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
			//var imageB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrix);
		var imageA = R3D.imageFromParameters(imageMatrixA, pointA, sizeA/compareSize,angleA,0.0,0.0, compareSize,compareSize);
		var imageB = R3D.imageFromParameters(imageMatrixB, pointB, sizeB/compareSize,angleB,0.0,0.0, compareSize,compareSize);

		var image = imageA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			img = new DOImage(img);
			img.matrix().translate(10 + (i/rowSize | 0)*(compareSize*2+50), 10 + (i%rowSize)*(compareSize+5));
			GLOBALSTAGE.addChild(img);
		var image = imageB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			img = new DOImage(img);
			//img.matrix().translate(100, 100 + i*(compareSize+5));
			img.matrix().translate(10 + (i/rowSize | 0)*(compareSize*2+50) + compareSize, 10 + (i%rowSize)*(compareSize+5));
			GLOBALSTAGE.addChild(img);
		if(i>300){
			break;
		}
	}
return;
}

console.log("refining...");

//var refine = R3D.refineFromSIFT(sA,sB, imageMatrixA,imageMatrixB);


	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		var objectA = match["A"];
		var objectB = match["B"];
		var sizeA = objectA["size"];
		var sizeB = objectB["size"];
		var angleA	= objectA["angle"];
		var angleB	= objectB["angle"];
		var pointA	= objectA["point"];
		var pointB	= objectB["point"];
		var refine = R3D.refineFromFeatures(pointA,sizeA,angleA, pointB,sizeB,angleB, imageMatrixA,imageMatrixB);
		console.log(i+": "+refine["score"]+"   => "+refine["scale"]+" | "+refine["angle"]+" | "+refine["trans"]);
		var refineScale = refine["scale"];
		var refineAngle = refine["angle"];
		var refineSkewX = refine["skewX"];
		var refineSkewY = refine["skewY"];
		var refineTrans = refine["trans"];
		match["REFINE"] = refine;
		match["score"] = refine["score"];
		// 
		var pointAllA = V2D.add(pointA,refineTrans);
		var scaleAllA = refineScale * sizeA/compareSize;
		var angleAllA = angleA + refineAngle;
		var skewXAllA = refineSkewX;
		var skewYAllA = refineSkewY;
// TODO: MULTI-SCALE  SAD SCORE:
		
		//var scales = Code.divSpace(-.5,.5,3);//[-.5,0,.5];
		//var scales = Code.divSpace(0,1,3);//[-.5,0,.5];
		var scales = Code.divSpace(-1,1,3);
		var sadSize = 11;
		var compareMask = null;
		var sadTotal = 1.0;
		var rangeDiff;
		var intensityDiff;
		for(k=0; k<scales.length; ++k){
			var scale = scales[k];
			scale = Math.pow(2,scale);
			var scaleAllAInner = scale * refineScale * sizeA/sadSize;
			var scaleB = scale * sizeB/sadSize;
			var imageA = R3D.imageFromParameters(imageMatrixA, pointAllA, scale*scaleAllAInner,angleAllA,skewXAllA,skewYAllA, sadSize,sadSize);
			var imageB = R3D.imageFromParameters(imageMatrixB, pointB, scale*scaleB,angleB,0.0,0.0, sadSize,sadSize);
			var sadC = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
			var sadG = R3D.sadRGBGradient(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(),imageA.width(),imageA.width(), compareMask);
			var sad = sadC * sadG;
			//var sad = sadC;
			// sadTotal += sad;
			// OTHER PENALTIES ?
			// range differences
			// average intensity difference
			sadTotal *= sad;
		}
		match["SAD"] = sadTotal;
		// SIFT
	
		var siftA = R3D.SIFTVector(imageMatrixA, pointAllA, refineScale * sizeA, angleAllA);
		var siftB = R3D.SIFTVector(imageMatrixB, pointB, sizeB, angleB);
		var siftScore = SIFTDescriptor.compareVector(siftA,siftB);
		match["SIFT"] = siftScore;

		// ORDERING:
		match["score"] = sadTotal;
		
		//sadTotal *= rangeDiff;
		//sadTotal *= intensityDiff;
		
if(false){
		// show refinement
		var imageA = R3D.imageFromParameters(imageMatrixA, pointAllA, scaleAllA,angleAllA,skewXAllA,skewYAllA, compareSize,compareSize);
		// var imageB = R3D.imageFromParameters(imageMatrixB, pointB, sizeB/compareSize,angleB,0.0,0.0, compareSize,compareSize);

		var image = imageA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			img = new DOImage(img);
			img.matrix().translate(80 + 10 + (i/rowSize | 0)*(compareSize*2+50), 10 + (i%rowSize)*(compareSize+5));
			GLOBALSTAGE.addChild(img);
		// var image = imageB;
		// var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
		// 	img = new DOImage(img);
		// 	//img.matrix().translate(100, 100 + i*(compareSize+5));
		// 	img.matrix().translate(10 + (i/rowSize | 0)*(compareSize*2+30) + compareSize, 10 + (i%rowSize)*(compareSize+5));
		// 	GLOBALSTAGE.addChild(img);
}
		
	}

//	return;


// sort from refinement
matches = matches.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});
/*
	// AGAIN
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		//console.log(match)
		var objectA = match["A"];
		var pointA = objectA["point"];
		var angleA = objectA["angle"];
		var sizeA = objectA["size"];
		var objectB = match["B"];
		var pointB = objectB["point"];
		var angleB = objectB["angle"];
		var sizeB = objectB["size"];
		var outer = 1.5;
		//var imageA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
			//var imageB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrix);
			var imageA, imageB;
			var refine = match["REFINE"];
			if(refine){
				var refineScale = refine["scale"];
				var refineAngle = refine["angle"];
				var refineSkewX = refine["skewX"];
				var refineSkewY = refine["skewY"];
				var refineTrans = refine["trans"];
				// 
				var pointAllA = V2D.add(pointA,refineTrans);
				var scaleAllA = refineScale * sizeA/compareSize;
				var angleAllA = angleA + refineAngle;
				var skewXAllA = refineSkewX;
				var skewYAllA = refineSkewY;
				imageA = R3D.imageFromParameters(imageMatrixA, pointAllA, outer*scaleAllA,angleAllA,skewXAllA,skewYAllA, compareSize,compareSize);
			}else{
				imageA = R3D.imageFromParameters(imageMatrixA, pointA, outer*sizeA/compareSize,angleA,0.0,0.0, compareSize,compareSize);
			}
			imageB = R3D.imageFromParameters(imageMatrixB, pointB, outer*sizeB/compareSize,angleB,0.0,0.0, compareSize,compareSize);

		var image = imageA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			img = new DOImage(img);
			img.matrix().translate(10 + (i/rowSize | 0)*(compareSize*2+50), 10 + (i%rowSize)*(compareSize+5));
			GLOBALSTAGE.addChild(img);
		var image = imageB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			img = new DOImage(img);
			//img.matrix().translate(100, 100 + i*(compareSize+5));
			img.matrix().translate(10 + (i/rowSize | 0)*(compareSize*2+50) + compareSize, 10 + (i%rowSize)*(compareSize+5));
			GLOBALSTAGE.addChild(img);
		if(i>300){
			break;
		}
	}
*/

// TODO: DROP POINTS WITH HIGH SCALE DIFF
// TODO: DROP POINTS WITH LOW VARIABILITY
//  ""					  VERY CLOSE LOCATIONS (choose one with better score)
//  ""					  LARGE COLOR AVG DIFFERENCES (blue vs white) -- hue/sat/val ?
//  ""					  
	
	// drop matches outside good ranges
	var keepMatches = [];
	var compareSize = 11;
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		//console.log(match)
		var objectA = match["A"];
		var pointA = objectA["point"];
		var angleA = objectA["angle"];
		var sizeA = objectA["size"];
		var objectB = match["B"];
		var pointB = objectB["point"];
		var angleB = objectB["angle"];
		var sizeB = objectB["size"];
		var siftScore = match["SIFT"];
		var sadScore = match["SAD"];
		var outer = 1.5;
		//var imageA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
			//var imageB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrix);
			var imageA, imageB;
			var refine = match["REFINE"];
			if(refine){
				var refineScale = refine["scale"];
				var refineAngle = refine["angle"];
				var refineSkewX = refine["skewX"];
				var refineSkewY = refine["skewY"];
				var refineTrans = refine["trans"];
				// 
				var pointAllA = V2D.add(pointA,refineTrans);
				var scaleAllA = refineScale * sizeA/compareSize;
				var angleAllA = angleA + refineAngle;
				var skewXAllA = refineSkewX;
				var skewYAllA = refineSkewY;

				imageA = R3D.imageFromParameters(imageMatrixA, pointAllA, outer*scaleAllA,angleAllA,skewXAllA,skewYAllA, compareSize,compareSize);
				imageB = R3D.imageFromParameters(imageMatrixB, pointB, outer*sizeB/compareSize,angleB,0.0,0.0, compareSize,compareSize);

				// drop high scale change
				if(refineScale>10.0 || refineScale<0.1){
					console.log("DROPPED SCALE: "+refineScale);
					continue;
				}

				// drop high angle change


				// low variability

				// close to another (better) match
				var minDistancePoints = 0.25; // 1 pixel
				var skipDistance = false;
				var distanceA = 0;
				var distanceB = 0;
				for(var j=i-1; j>=0; --j){
					var matchJ = matches[j];
					var oA = matchJ["A"];
					var oB = matchJ["B"];
					var pA = oA["point"];
					var pB = oB["point"];
					distanceA = V2D.distance(pointA,pA);
					distanceB = V2D.distance(pointB,pB);
					if(distanceA<=minDistancePoints || distanceB<=minDistancePoints){
						skipDistance = true;
						break;
					}
				}
				if(skipDistance){
					//console.log("DROPPED DISTANCE: "+distanceA+" | "+distanceB);
					continue;
				}

				if(siftScore>0.10){
					console.log("DROPPED SIFT: "+siftScore);
					continue;
				}

				if(sadScore>0.15){
					console.log("DROPPED SAD: "+sadScore);
					continue;
				}


				// large color diff
				var infoAR = Code.infoArray(imageA.red());
				var infoAG = Code.infoArray(imageA.grn());
				var infoAB = Code.infoArray(imageA.blu());
				var infoBR = Code.infoArray(imageB.red());
				var infoBG = Code.infoArray(imageB.grn());
				var infoBB = Code.infoArray(imageB.blu());

				var meanDiffR = Math.abs(infoAR["mean"]-infoBR["mean"]);
				var meanDiffG = Math.abs(infoAG["mean"]-infoBG["mean"]);
				var meanDiffB = Math.abs(infoAB["mean"]-infoBB["mean"]);
				//console.log(i+"meanDiff: "+meanDiffR+" | "+meanDiffG+" | "+meanDiffB+" | ");
				var maxMeanDiff = 0.20;
				if(meanDiffR>maxMeanDiff || meanDiffG>maxMeanDiff || meanDiffB>maxMeanDiff){
					console.log("DROPPED MEAN: "+meanDiffR+" | "+meanDiffG+" | "+meanDiffB+" | ");
					continue;
				}

				// 
			}
		match["score"] = siftScore;
		keepMatches.push(match);
	}
matches = keepMatches;


// sort from refinement
matches = matches.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});
var scoreKeep = 0.75;
var scoreMin = matches[0]["score"];
var scoreMax = matches[matches.length-1]["score"];
var scoreRange = scoreMax - scoreMin;
var maxScoreValue = scoreMin + scoreRange*scoreKeep;
console.log("WAS COUNT: "+matches.length);
for(i=0; i<matches.length; ++i){
	if(matches[i]["score"]>maxScoreValue){
		matches.splice(i,matches.length-i-1);
		break;
	}
}
console.log(" IS COUNT: "+matches.length);


	// AGAIN
	var compareSize = 40;
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		//console.log(match)
		var objectA = match["A"];
		var pointA = objectA["point"];
		var angleA = objectA["angle"];
		var sizeA = objectA["size"];
		var objectB = match["B"];
		var pointB = objectB["point"];
		var angleB = objectB["angle"];
		var sizeB = objectB["size"];
		var outer = 1.5;
		//var imageA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
			//var imageB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrix);
			var imageA, imageB;
			var refine = match["REFINE"];
			if(refine){
				var refineScale = refine["scale"];
				var refineAngle = refine["angle"];
				var refineSkewX = refine["skewX"];
				var refineSkewY = refine["skewY"];
				var refineTrans = refine["trans"];
				// 
				var pointAllA = V2D.add(pointA,refineTrans);
				var scaleAllA = refineScale * sizeA/compareSize;
				var angleAllA = angleA + refineAngle;
				var skewXAllA = refineSkewX;
				var skewYAllA = refineSkewY;
				imageA = R3D.imageFromParameters(imageMatrixA, pointAllA, outer*scaleAllA,angleAllA,skewXAllA,skewYAllA, compareSize,compareSize);
			}else{
				imageA = R3D.imageFromParameters(imageMatrixA, pointA, outer*sizeA/compareSize,angleA,0.0,0.0, compareSize,compareSize);
			}
			imageB = R3D.imageFromParameters(imageMatrixB, pointB, outer*sizeB/compareSize,angleB,0.0,0.0, compareSize,compareSize);

		var image = imageA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			img = new DOImage(img);
			img.matrix().translate(10 + (i/rowSize | 0)*(compareSize*2+50), 10 + (i%rowSize)*(compareSize+5));
			GLOBALSTAGE.addChild(img);
		var image = imageB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			img = new DOImage(img);
			//img.matrix().translate(100, 100 + i*(compareSize+5));
			img.matrix().translate(10 + (i/rowSize | 0)*(compareSize*2+50) + compareSize, 10 + (i%rowSize)*(compareSize+5));
			GLOBALSTAGE.addChild(img);
		if(i>300){
			break;
		}
	}


//return;

// DO F AGAIN:
var fPointsA = [];
var fPointsB = [];
for(i=0; i<matches.length; ++i){
	var match = matches[i];
	var objectA = match["A"];
	var objectB = match["B"];
	var pointA	= objectA["point"];
	var pointB	= objectB["point"];
	fPointsA.push(pointA);
	fPointsB.push(pointB);
}
matrixFfwd = R3D.fundamentalMatrixNonlinear(matrixFfwd,fPointsA,fPointsB);


// OUTPUT
	var pointsA = [];
	var pointsB = [];
	var transforms = [];
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		var objectA = match["A"];
		var objectB = match["B"];
		var sizeA	= objectA["size"];
		var sizeB	= objectB["size"];
		var angleA	= objectA["angle"];
		var angleB	= objectB["angle"];
		var pointA	= objectA["point"];
		var pointB	= objectB["point"];
	var matrix = new Matrix(3,3).identity();
	// TO A
	matrix = Matrix.transform2DScale(matrix, 1.0/sizeA);
	matrix = Matrix.transform2DRotate(matrix, -angleA);
	var refine = match["REFINE"];
	if(refine){
		pointA = V2D.add(pointA,refine["trans"]);
		//console.log(refine["trans"]+"");
		//console.log(pointA+"");
		matrix = Matrix.transform2DScale(matrix, refine["scale"]);
		matrix = Matrix.transform2DRotate(matrix, refine["angle"]);
	}
	// BEST COMPARE
	// matrix = Matrix.transform2DScale(matrix, 1.0/scaleAToB);
	// matrix = Matrix.transform2DRotate(matrix, -angleAToB);
	// matrix = Matrix.transform2DSkewX(matrix, -skewXAToB);
	// matrix = Matrix.transform2DSkewY(matrix, -skewYAToB);
	// matrix = Matrix.transform2DTranslate(matrix, -transAToB.x, -transAToB.y);
	// UNDO B
	matrix = Matrix.transform2DScale(matrix, sizeB);
	matrix = Matrix.transform2DRotate(matrix, angleB);
//matrix = Matrix.inverse(matrix); // noooo
		pointsA.push(pointA);
		pointsB.push(pointB);
		transforms.push(matrix);
	}
	// END HERE
	var imageInfoA = {
		"id":"0",
		"path":imagePathA,
		"width":imageMatrixA.width(),
		"height":imageMatrixA.height(),
	};
	var imageInfoB = {
		"id":"1",
		"path":imagePathB,
		"width":imageMatrixB.width(),
		"height":imageMatrixB.height(),
	};
	var output = R3D.outputMediumPoints(imageMatrixA,imageMatrixB, pointsA,pointsB, transforms, matrixFfwd, imageInfoA,imageInfoB);
	console.log(output);
if(pointsA.length<40){
console.log("low amount of good final matches");
}
	
}
FeatureTest.prototype.getScaledImage = function(o){
	var img = o.images[0];
	var scale = 2.0;
	var wid = img.width;
	var hei = img.height;
	var wid2 = wid*scale;
	var hei2 = hei*scale;
	var data = this._stage.getImageAsFloatRGB(img);
	console.log("A");
	var mat = new ImageMat(img.width,img.height, data.red,data.grn,data.blu);
	console.log("B");
	var a = Code.newArrayOnes(wid2*hei2);
	var r = ImageMat.extractRect(data.red, 0,0, wid,0, wid,hei, 0,hei, wid2,hei2, wid,hei);
	var g = ImageMat.extractRect(data.grn, 0,0, wid,0, wid,hei, 0,hei, wid2,hei2, wid,hei);
	var b = ImageMat.extractRect(data.blu, 0,0, wid,0, wid,hei, 0,hei, wid2,hei2, wid,hei);
	Code.arrayLimit(r,0,1.0);
	Code.arrayLimit(g,0,1.0);
	Code.arrayLimit(b,0,1.0);
	var i = this._stage.getFloatARGBAsImage(a,r,g,b, wid2,hei2, null);
	//var d = new DOImage(i);
	//this._root.addChild(d);
	document.body.appendChild(i);
}
FeatureTest.prototype.handleMouseClickFxn = function(e){
	//console.log(e);
	var point = e.location;
	console.log((point.x%400)+","+(point.y));
}
FeatureTest.prototype.imagesLoadComplete = function(o){
	this._imageSourceList = [];
	this._imageDOList = [];
	this._imageFilnameList = [];
	this._imageFeatureList = [];
	this.displayImages(o.images,o.files);
	// this.findFeatures();
	// this.displayFeatures();
	var pts = []; //  A, B, ...
	pts.push(new V3D(228,150,1.0), new V3D(685,170,1.0)); // left length 				// 0
	pts.push(new V3D(232,105,1.0), new V3D(696,106,1.0)); // body middle 				// 1
	pts.push(new V3D(233,86,1.0), new V3D(699,77,1.0)); // face middle 					// 2
	pts.push(new V3D(88,208,1.0), new V3D(531,194,1.0)); // left classes dot 			// 3
	pts.push(new V3D(113,216,1.0), new V3D(566,212,1.0)); // left glasses black 		// 4
	pts.push(new V3D(24,167,1.0), new V3D(428,138,1.0)); // lighter red 				// 5
	pts.push(new V3D(191,89,1.0), new V3D(617,120,1.0)); // grid dark blue 				// 6
	pts.push(new V3D(161,76,1.0), new V3D(582,107,1.0)); // grid dark red 				// 7
	pts.push(new V3D(260,170,1.0), new V3D(744,183,1.0)); // base right corner 			// 8
	pts.push(new V3D(41,257,1.0), new V3D(453,266,1.0)); // 4 							// 9
	pts.push(new V3D(238,256,1.0), new V3D(790.5,268,1.0)); //  						// 10
	pts.push(new V3D(205,76,1.0), new V3D(634,104,1.0)); //  							// 11
	pts.push(new V3D(203,116,1.0), new V3D(631,153,1.0)); //  							// 12
	pts.push(new V3D(176,128,1.0), new V3D(603,161,1.0)); //  							// 13
	pts.push(new V3D(171,69,1.0), new V3D(593,101,1.0)); //  							// 14
	pts.push(new V3D(173,108,1.0), new V3D(591,146,1.0)); // 							// 15
	pts.push(new V3D(172,90,1.0), new V3D(593,125,1.0)); // 							// 16
	pts.push(new V3D(189,105,1.0), new V3D(611,139,1.0)); // 							// 17 -- double check
	pts.push(new V3D(186,72,1.0), new V3D(613,102,1.0)); // 							// 18
	// line connections 
	pairs = [];
	//pairs.push([0,1]);
	//pairs.push([15,16]);
	//pairs.push([16,17]);
	pairs.push([11,12]); // right square
	pairs.push([14,15]); // left square
	pairs.push([11,14]); // top square
	pairs.push([12,15]); // bot square
	// pts.push(new V3D(,,1.0), new V3D(,,1.0));
	var i, len, u, v, pair;
	// points
	len = pts.length;
	var str = "";
	for(i=0;i<len;i+=2){
		v = pts[i+0];
		d = R3D.drawPointAt(v.x,v.y, 0x00,0x00,0xFF);
		this._root.addChild(d);
		//d.matrix().translate(j*400,0);
		v = pts[i+1];
		d = R3D.drawPointAt(v.x,v.y, 0x00,0x00,0xFF);
		this._root.addChild(d);
		// normalize points to width/height with correct offsets
		pts[i+0].x = (pts[i+0].x-0.0)/400.0;
		pts[i+0].y = (pts[i+0].y-0.0)/300.0;
		pts[i+1].x = (pts[i+1].x-400.0)/400.0;
		pts[i+1].y = (pts[i+1].y-0.0)/300.0;
	}
	// lines
	len = pairs.length;
	d = new DO();
	this._root.addChild(d);
	for(i=0;i<len;++i){
		pair = pairs[i];
		// left
		u = pts[ pair[0]*2+0 ];
		v = pts[ pair[1]*2+0 ];
		u = new V2D(u.x*400,u.y*300);
		v = new V2D(v.x*400,v.y*300);
		d.graphics().setLine(1.0,0xFF0000FF);
		d.graphics().beginPath();
		d.graphics().moveTo(u.x,u.y);
		d.graphics().lineTo(v.x,v.y);
		d.graphics().strokeLine();
		d.graphics().endPath();

		// right
		u = pts[ pair[0]*2+1 ];
		v = pts[ pair[1]*2+1 ];
		u = new V2D(u.x*400 + 400,u.y*300);
		v = new V2D(v.x*400 + 400,v.y*300);
		d.graphics().setLine(1.0,0xFF0000FF);
		d.graphics().beginPath();
		d.graphics().moveTo(u.x,u.y);
		d.graphics().lineTo(v.x,v.y);
		d.graphics().strokeLine();
		d.graphics().endPath();
	}
	// registering points
	len = pts.length;
	// ...
	str = "\n";
	var ptsA = [];
	var ptsB = [];
	var j = 0;
	for(i=0;i<len;i+=2){
		str += "pointsA.push( new V3D("+pts[i+0].x+","+pts[i+0].y+",1.0) ); pointsB.push( new V3D("+pts[i+1].x+","+pts[i+1].y+",1.0) );\n";
// var sca = 1E-3;
// pts[i+0].x += Math.random()*sca - sca*0.5;
// pts[i+0].y += Math.random()*sca - sca*0.5;
// pts[i+1].x += Math.random()*sca - sca*0.5;
// pts[i+1].y += Math.random()*sca - sca*0.5;
		ptsA.push(new V3D(pts[i+0].x*400,pts[i+0].y*300,1.0));
		ptsB.push(new V3D(pts[i+1].x*400,pts[i+1].y*300,1.0));
		//console.log(ptsA[j]+" "+ptsB[j])
		++j;
	}
	str += "";
//	console.log(str);
linePairsTrash = pairs;
this.ransacMatches(ptsA,ptsB, linePairsTrash);
}
FeatureTest.prototype.ransacMatches = function(pointsA,pointsB, linePairsTrash){
	var imageWidth=400;
	var imageHeight=300;
/*
	var pointsA = [new V3D(0.47707116489607626,0.03014735217288287,1.0),new V3D(0.734346848707403,0.8095214992040373,1.0),new V3D(0.2603040983156068,0.09556285242297957,1.0),new V3D(0.8125219213824287,0.7685001105539645,1.0),new V3D(0.6162294485184842,0.2430524709830829,1.0),new V3D(0.4741021369729052,0.8758553326200259,1.0),new V3D(0.291061901001906,0.21275041842209833,1.0),new V3D(0.23699579072223143,0.8810597652018555,1.0),new V3D(0.841449375387314,0.8534438198397032,1.0),new V3D(0.48328928059227544,0.23897240659392793,1.0),new V3D(0.26969370237813,0.8050205212538243,1.0),new V3D(0.16874578735092607,0.7650981355180863,1.0),new V3D(0.8333658132469864,0.7232573027453226,1.0),new V3D(0.23350742171993474,0.22535583972273257,1.0),new V3D(0.22858989639778637,0.21857924744211815,1.0),new V3D(0.39298875369272696,0.8229518024846969,1.0),new V3D(0.7472504094410491,0.12882917176341233,1.0),new V3D(0.2118411184269057,0.03836125369593742,1.0),new V3D(0.6078734136159086,0.9299758813816021,1.0),new V3D(0.08973496529506945,0.6102118768715644,1.0),new V3D(0.2817087417692407,0.5832243870499338,1.0),new V3D(0.8026041584414461,0.9100426259878227,1.0),new V3D(0.69498304012979,0.017945994209970725,1.0),new V3D(0.8413449988945798,0.3233089367298686,1.0),new V3D(0.8037995153205907,0.2329950219100474,1.0),new V3D(0.596002370331012,0.9243663723515672,1.0),new V3D(0.36452679317370323,0.28706886279019705,1.0),new V3D(0.6156405182871729,0.1876682907968904,1.0),new V3D(0.40216833871425256,0.7216989216840936,1.0),new V3D(0.07057551089414163,0.6669293073277655,1.0),new V3D(0.8595356146235622,0.8339878803816717,1.0),new V3D(0.9702345312889119,0.30879165792267405,1.0),new V3D(0.659054335051914,0.29098441639429284,1.0),new V3D(0.3315846144156928,0.8989080233975714,1.0),new V3D(0.20184814864109288,0.6024179691473053,1.0),new V3D(0.02019607788429412,0.893115471520595,1.0),new V3D(0.9784504334160742,0.763949296895991,1.0),new V3D(0.09443261085927812,0.029533430268774422,1.0),new V3D(0.3187480465270493,0.6535930452197318,1.0),new V3D(0.9012020182120657,0.3179545704213461,1.0),new V3D(0.3960887361600314,0.9677175010731622,1.0),new V3D(0.8621130960097915,0.7972699884504567,1.0),new V3D(0.09957173830075805,0.6424024981824912,1.0),new V3D(0.18751972945194062,0.25934020337367464,1.0),new V3D(0.12471165450697633,0.7196374289546164,1.0),new V3D(0.5949469671558764,0.20061559426024977,1.0),new V3D(0.5249677135905995,0.06977357862720365,1.0),new V3D(0.9930843566504037,0.07522719891226454,1.0),new V3D(0.38071814329433706,0.8853457555059786,1.0),new V3D(0.30145458975772527,0.38075288451785805,1.0),new V3D(0.9821898956800333,0.6706866560901317,1.0),new V3D(0.08135983564723884,0.09163267253742781,1.0),new V3D(0.5828347741258674,0.8254281068223727,1.0),new V3D(0.7447442459463961,0.12305631124518186,1.0),new V3D(0.2886397418474024,0.5315810662200235,1.0),new V3D(0.18296544261056574,0.8866087200570005,1.0),new V3D(0.6068463382389289,0.17530009638718294,1.0),new V3D(0.9483376894882469,0.35984116189029486,1.0),new V3D(0.23618700634646672,0.9102345725796395,1.0),new V3D(0.09960373778004765,0.7944273249837227,1.0),new V3D(0.12726384646661157,0.04684998276654224,1.0),new V3D(0.2223425274225785,0.2103618948316977,1.0),new V3D(0.06158122541479567,0.014221379263903421,1.0),new V3D(0.04739239171935765,0.769918725745263,1.0),new V3D(0.22492040519774834,0.8297914021084898,1.0),new V3D(0.5214132359583652,0.960788750330366,1.0),new V3D(0.25096753750002854,0.6732473482900351,1.0),new V3D(0.1844735819709417,0.6830566336630345,1.0),new V3D(0.863232092276665,0.014170238804429995,1.0),new V3D(0.03772643649574608,0.07994064383811386,1.0),new V3D(0.27880130392717384,0.9839374779941549,1.0),new V3D(0.4366438765546221,0.6177111533451832,1.0),new V3D(0.10717122371145903,0.7566760974419321,1.0),new V3D(0.3084845933440718,0.136302523261779,1.0),new V3D(0.10395684744179812,0.2762189492994075,1.0),new V3D(0.11520392456785811,0.6029435983268825,1.0),new V3D(0.8653707368021902,0.7802509012087534,1.0),new V3D(0.8973799875494559,0.6703417757087716,1.0),new V3D(0.1446111587439365,0.8195079395000309,1.0),new V3D(0.47415884027419575,0.6399559969669538,1.0),new V3D(0.40488391778084226,0.6788540525858509,1.0),new V3D(0.9140375694018849,0.6854550517845268,1.0),new V3D(0.9098991104752724,0.4879229202412872,1.0),new V3D(0.12600439405495537,0.6326134279935732,1.0),new V3D(0.1276995361122694,0.7360128087361328,1.0),new V3D(0.5199147181672432,0.8339232591983767,1.0),new V3D(0.21053364547882972,0.971637895406998,1.0),new V3D(0.381847534065605,0.7164167817099856,1.0),new V3D(0.2767123770161675,0.14827437689278603,1.0),new V3D(0.05703908508773066,0.7716337215160837,1.0),new V3D(0.10037206355940696,0.7475507650648295,1.0),new V3D(0.1874327278133627,0.17744829181615168,1.0),new V3D(0.4982022666308098,0.9459209920083854,1.0),new V3D(0.1191076996701375,0.9302050922115416,1.0),new V3D(0.5048531556771235,0.7796319699309145,1.0),new V3D(0.8733885575319142,0.048971191456249646,1.0),new V3D(0.3824919914357659,0.7915118770345684,1.0),new V3D(0.14168510578363752,0.5958235786249833,1.0),new V3D(0.8593238967084474,0.8432729621421493,1.0),new V3D(0.5122334662056569,0.8842873092482146,1.0),new V3D(0.46322581558269876,0.8803097185484756,1.0),new V3D(0.8799562747622045,0.61933748157789,1.0),new V3D(0.5313810368639369,0.8969960173732346,1.0),new V3D(0.2746816232836987,0.7193572828594345,1.0),new V3D(0.6045658347847599,0.002457332051457511,1.0),new V3D(0.029279684767068534,0.11786241213969331,1.0),new V3D(0.437297386593468,0.6642472893542959,1.0),new V3D(0.0833014505473653,0.25575085918887347,1.0),new V3D(0.894816406965856,0.21668187373587025,1.0),new V3D(0.43143897785277857,0.6972368459867256,1.0),new V3D(0.870076871290765,0.7543206185198114,1.0),new V3D(0.5788706649553366,0.2282914682011023,1.0),new V3D(0.1390483057578629,0.5735722497929746,1.0),new V3D(0.6015163133616717,0.04954627405380519,1.0),new V3D(0.5360147630118736,0.9405330981508846,1.0),new V3D(0.17938805604776853,0.04309819151818454,1.0),new V3D(0.2575264882182322,0.21896253055426712,1.0),new V3D(0.0916095473787102,0.7628558689124182,1.0),new V3D(0.08401234756416702,0.7698128815642665,1.0),new V3D(0.8335939866316295,0.7519365203105609,1.0),new V3D(0.11771845945986455,0.8183883431662997,1.0),new V3D(0.040576264660438406,0.8663069650988565,1.0),new V3D(0.9833493110477518,0.7247603610897099,1.0),new V3D(0.5184232057794669,0.8124264189691291,1.0),new V3D(0.060949732757764934,0.6259088424549331,1.0),new V3D(0.09891144630778928,0.8231774161300617,1.0),];
	var pointsB = [new V3D(0.6375898147693746,0.9703586259723977,1.0),new V3D(0.44997124889204526,0.19461935653291293,1.0),new V3D(0.7867880404577008,0.9083781895200033,1.0),new V3D(0.40153421985427806,0.22574096966012203,1.0),new V3D(0.5420720404585287,0.7572788107345059,1.0),new V3D(0.6349036289809431,0.1244500623341015,1.0),new V3D(0.7693031246745679,0.787534366692678,1.0),new V3D(0.8060892198361107,0.11867594930133132,1.0),new V3D(0.3760053930585548,0.1470039978322177,1.0),new V3D(0.6388522208149147,0.7604936013219271,1.0),new V3D(0.7867035218341181,0.19223044947698392,1.0),new V3D(0.8560710757143174,0.23724817546673108,1.0),new V3D(0.3843644893310292,0.27648309369088137,1.0),new V3D(0.8111127030606008,0.7733017484669227,1.0),new V3D(0.8137511944139105,0.7821402935576681,1.0),new V3D(0.6956742742712447,0.1765855898334488,1.0),new V3D(0.45156257817625783,0.8728366802896382,1.0),new V3D(0.831269787604546,0.9582344762335453,1.0),new V3D(0.5515416557452333,0.06933005874163155,1.0),new V3D(0.9103662147501917,0.38867016431302936,1.0),new V3D(0.775287964760221,0.41821756255307674,1.0),new V3D(0.4070571407798512,0.08886755695066856,1.0),new V3D(0.4863303277743389,0.9833742302704911,1.0),new V3D(0.3797834814794654,0.6781520182893415,1.0),new V3D(0.40904638355886225,0.7708675427927949,1.0),new V3D(0.5530012166225834,0.07514039187099565,1.0),new V3D(0.7166676939529485,0.7115220991102228,1.0),new V3D(0.5378389763071424,0.8044840303221105,1.0),new V3D(0.6901179753284995,0.27651152055196004,1.0),new V3D(0.9189107822010105,0.33264927024488017,1.0),new V3D(0.36643400420797834,0.2494318408060407,1.0),new V3D(0.1639351504678454,0.6460522843815891,1.0),new V3D(0.5040750837816287,0.7091931157441059,1.0),new V3D(0.7397197348084803,0.10615909276447652,1.0),new V3D(0.8309514312374118,0.3999593785523505,1.0),new V3D(0.9552535579746076,0.10700969547763933,1.0),new V3D(0.30460505971433216,0.34048994756927964,1.0),new V3D(0.9114968829753338,0.9551948538891698,1.0),new V3D(0.7481857082121747,0.3451375746508256,1.0),new V3D(0.10138410879042814,0.08094719924834842,1.0),new V3D(0.6957875449112391,0.03009471057468237,1.0),new V3D(0.36686719859321376,0.21433913575264485,1.0),new V3D(0.9038874054862783,0.35794585858559624,1.0),new V3D(0.837144940137475,0.740815415521189,1.0),new V3D(0.883750056962784,0.3063720325753735,1.0),new V3D(0.5593398367986986,0.7949949945153423,1.0),new V3D(0.31289671695920296,0.6886740428498409,1.0),new V3D(0.19805529384086704,0.24470470842052156,1.0),new V3D(0.7017806870385139,0.10948320164231112,1.0),new V3D(0.8028558542147849,0.679573377938942,1.0),new V3D(0.0941961375074349,0.23824722485159133,1.0),new V3D(0.9099327082106455,0.9083495766923988,1.0),new V3D(0.14102561413551576,0.5794479053507432,1.0),new V3D(0.03147883690513699,0.28454337967965787,1.0),new V3D(0.2369017010431212,0.6563559961644712,1.0),new V3D(0.7403536761721823,0.2971737414292514,1.0),new V3D(0.5436590094559591,0.8260514101556281,1.0),new V3D(0.6043691186995864,0.9436243405880004,1.0),new V3D(0.5649863435790121,0.1607001463809693,1.0),new V3D(0.9030920962700145,0.2059030792283647,1.0),new V3D(0.2024610202091954,0.6898318375998106,1.0),new V3D(0.905639678664187,0.33154321236985823,1.0),new V3D(0.26755497432953324,0.7495923902927284,1.0),new V3D(0.9349378271145727,0.23015856857492845,1.0),new V3D(0.8123909359763847,0.15390975592631392,1.0),new V3D(0.6048733136427235,0.03335162672357884,1.0),new V3D(0.8980802932360494,0.936289391138986,1.0),new V3D(0.692869950252571,0.11435297720782645,1.0),new V3D(0.36984138958010243,0.9867078178978895,1.0),new V3D(0.43502188932191843,0.7593501761190505,1.0),new V3D(0.8437503909311672,0.3262218081736945,1.0),new V3D(0.704707978241592,0.4030250735120509,1.0),new V3D(0.897164643845814,0.2437009274274252,1.0),new V3D(0.8869175858164854,0.4879760679728202,1.0),new V3D(0.7397694296990681,0.8245571999009618,1.0),new V3D(0.845542351627477,0.0853073600571387,1.0),new V3D(0.8927251091525001,0.8840168568141187,1.0),new V3D(0.3410965965146766,0.11981541362931568,1.0),new V3D(0.6677221367177001,0.04406817069660235,1.0),new V3D(0.7547582761638055,0.9514923485974892,1.0),new V3D(0.690821296388383,0.3206660967713706,1.0),new V3D(0.2613141434333652,0.8004400083389926,1.0),new V3D(0.4686524092682858,0.6456243611202347,1.0),new V3D(0.8511321420092927,0.4294154845390053,1.0),new V3D(0.8869642879583307,0.24340763183679556,1.0),new V3D(0.3858911574143148,0.6677199579211771,1.0),new V3D(0.44721897357683205,0.1370618768522244,1.0),new V3D(0.7212908424014342,0.0367606558524824,1.0),new V3D(0.7676137996890375,0.8543067248329315,1.0),new V3D(0.3688430643693188,0.023698779568867085,1.0),new V3D(0.9031801829903943,0.2525814553238621,1.0),new V3D(0.9126664764703825,0.3381654190960543,1.0),new V3D(0.9139241684414924,0.004203299373046369,1.0),new V3D(0.12201718109078569,0.9150238113317172,1.0),new V3D(0.08301019662303773,0.36070762861364825,1.0),new V3D(0.6543309205181608,0.023071805090885522,1.0),new V3D(0.7532368125930478,0.23401538314919995,1.0),new V3D(0.7695004856044793,0.31635059248216035,1.0),new V3D(0.8652338272149912,0.3844319827415072,1.0),new V3D(0.38980960571458895,0.7374447020013484,1.0),new V3D(0.36974296080315733,0.015767027148511418,1.0),new V3D(0.30204528968749417,0.16227211466418973,1.0),new V3D(0.6395310523736003,0.044131684136018284,1.0),new V3D(0.777890098495242,0.2824174629646422,1.0),new V3D(0.360407503896977,0.46437241359367043,1.0),new V3D(0.39073981513166856,0.9786036593655167,1.0),new V3D(0.7564527525662192,0.2502889768910864,1.0),new V3D(0.934718956688708,0.20027830601716684,1.0),new V3D(0.8164491238323037,0.4770989216869568,1.0),new V3D(0.8564187085338607,0.25099884889913987,1.0),new V3D(0.3646377452340889,0.22645039855934807,1.0),new V3D(0.3602757596462346,0.2547435117434274,1.0),new V3D(0.5240689342926352,0.9616640137848064,1.0),new V3D(0.056813076619015135,0.6258693531022205,1.0),new V3D(0.06112877476268963,0.038969103241211084,1.0),new V3D(0.9762267647758824,0.8346015476184697,1.0),new V3D(0.21671163715681493,0.4517996845048732,1.0),new V3D(0.914302474399389,0.23758472378027762,1.0),new V3D(0.9140796047946149,0.2230221798908368,1.0),new V3D(0.8067548299080343,0.8836884036424124,1.0),new V3D(0.6883827560533919,0.05039919773129633,1.0),new V3D(0.9144002845335415,0.04666819559588438,1.0),new V3D(0.3122282029560064,0.061292008837920305,1.0),new V3D(0.18661860395531998,0.29072983855705803,1.0),new V3D(0.08459592371627624,0.56515356958614,1.0),new V3D(0.9154223908154654,0.17703200323839766,1.0),];
	// ...
Code.emptyArray(pointsA); Code.emptyArray(pointsB);
pointsA.push( new V3D(0.57,0.5,1.0) ); pointsB.push( new V3D(0.7125,0.5666666666666667,1.0) );
pointsA.push( new V3D(0.58,0.35,1.0) ); pointsB.push( new V3D(0.74,0.35333333333333333,1.0) );
pointsA.push( new V3D(0.5825,0.2866666666666667,1.0) ); pointsB.push( new V3D(0.7475,0.25666666666666665,1.0) );
pointsA.push( new V3D(0.22,0.6933333333333334,1.0) ); pointsB.push( new V3D(0.3275,0.6466666666666666,1.0) );
pointsA.push( new V3D(0.2825,0.72,1.0) ); pointsB.push( new V3D(0.415,0.7066666666666667,1.0) );
pointsA.push( new V3D(0.06,0.5566666666666666,1.0) ); pointsB.push( new V3D(0.07,0.46,1.0) );
pointsA.push( new V3D(0.4775,0.2966666666666667,1.0) ); pointsB.push( new V3D(0.5425,0.4,1.0) );
pointsA.push( new V3D(0.4025,0.25333333333333335,1.0) ); pointsB.push( new V3D(0.455,0.3566666666666667,1.0) );
pointsA.push( new V3D(0.65,0.5666666666666667,1.0) ); pointsB.push( new V3D(0.86,0.61,1.0) );
var i, len = pointsA.length;
for(i=0;i<len;++i){
	pointsA[i] = new V3D(pointsA[i].x*imageWidth,pointsA[i].y*imageHeight,1.0);
	pointsB[i] = new V3D(pointsB[i].x*imageWidth,pointsB[i].y*imageHeight,1.0);
}
*/
	//
	var fundamental = R3D.fundamentalRANSACFromPoints(pointsA,pointsB);
	//var fundamental = R3D.fundamentalMatrix(pointsA,pointsB);
	console.log(fundamental+"");
	fundamental = R3D.fundamentalMatrixNonlinear(fundamental,pointsA,pointsB);
	console.log(fundamental+"");

// FOUND VIA MANUAL3DR
var F = fundamental;
var K = new Matrix(3,3).setFromArray([3.7610E+2, -4.3992E-1, 2.0162E+2, 0.0000E+0, 3.7674E+2, 1.5226E+2, 0.0000E+0, 0.0000E+0, 1.0000E+0]);
var Kt = Matrix.transpose(K);
var E = Matrix.mult(Kt,Matrix.mult(F,K));
//fundamental = E;


for(var k=0;k<pointsA.length;++k){
	var pointA = pointsA[k];
	var pointB = pointsB[k];
	var lineA = new V3D();
	var lineB = new V3D();

	var fundamentalInverse = Matrix.transpose(fundamental);
	fundamental.multV3DtoV3D(lineA, pointA);
	fundamentalInverse.multV3DtoV3D(lineB, pointB);

	var d, v;
	var dir = new V2D();
	var org = new V2D();
	var scale = 500;
	//
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	dir.scale(scale);
	d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(imageWidth+org.x-dir.x,org.y-dir.y);
	d.graphics().lineTo(imageWidth+org.x+dir.x,org.y+dir.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	this._root.addChild(d);
	//
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
	dir.scale(scale);
	d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo( 0 + org.x-dir.x,org.y-dir.y);
	d.graphics().lineTo( 0 + org.x+dir.x,org.y+dir.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	this._root.addChild(d);
	//
	// d = R3D.drawPointAt(imageWidth+org.x,org.y, 0x00,0xFF,0x00);
	// this._root.addChild(d);
	d = R3D.drawPointAt(pointA.x,pointA.y, 0xFF,0x00,0x00);
	this._root.addChild(d);
	d = R3D.drawPointAt(imageWidth+pointB.x,pointB.y, 0xFF,0x00,0x00);
	this._root.addChild(d);
}

	//
	this.denseFeatureMatching();
	// refine matches
	var points = R3D.triangulatePoints(fundamental,pointsA,pointsB);
	var points2DA = points["A"];
	var points2DB = points["B"];
	var points3D = points["3D"];
	//console.log(points3D);

	var i, str = "\n";
	str += "var pts = [];\n";
	for(i=0;i<points3D.length;++i){
		var pt = points3D[i];
// pt.homo(); // doesn't make sense
		str += "pts.push(new V3D("+pt.x+","+pt.y+","+pt.z+"));"+ "" +"\n";
	}
	str += "\n";
	//console.log(str);

	str += "var prs = [];\n";
	len = linePairsTrash.length;
	for(i=0;i<len;++i){
		str += "prs.push( [" + linePairsTrash[i][0] + ", " + linePairsTrash[i][1] + "] ); \n";
	}
	console.log(str);
	
}
FeatureTest.prototype.denseFeatureMatching = function(){
	//
}
FeatureTest.prototype.what = function(fundamental,pointsA,pointsB){
	// ...
}

FeatureTest.prototype.displayImages = function(images,files){
	var i, d, len, img;
	var currentX = 0, currentY = 0;
	for(i=0;i<images.length;++i){
		img = images[i];
		d = new DOImage(img);
		d.matrix().identity();
		d.matrix().translate(currentX,currentY);
		this._root.addChild(d);
		currentX += img.width;
		this._imageSourceList.push(img);
		this._imageDOList.push(d);
		this._imageFilnameList.push(files[i]);
	}
}
FeatureTest.prototype.findFeatures = function(){
	var i, d, img, len, file, desc;
this._peaks = [];
this._scales = [];
	i = 0;
	for(i=0;i<this._imageSourceList.length;++i){
		img = this._imageSourceList[i];
		file = this._imageFilnameList[i];
		desc = ImageDescriptor.fromImageFileStage(img,file,this._stage);
		this._imageFeatureList[i] = desc;
		var scales = desc.processScaleSpace();
this._scales[i] = scales;
// var peaks = desc.processCornerSpace();
// this._peaks[i] = peaks;
		desc.describeFeatures();
		// 
		desc.dropNonUniqueFeatures();
//break;
	}
//	return;
	//
	var matcher = new ImageMatcher();
	matcher.matchDescriptors(this._imageFeatureList[0], this._imageFeatureList[1]);
	matcher.chooseBestMatches();
	
	var matches = matcher.matches();
	var obj, img, feature, featureA, featureB;
var strA = "var pointsA = [";
var strB = "var pointsB = [";
	for(i=0;i<matches.length;++i){
		img = this._imageSourceList[0];
		obj = this._imageDOList[0];
		featureA = matches[i][0];
		this.displayFeature(featureA,obj,img);
		//
		img = this._imageSourceList[1];
		obj = this._imageDOList[1];
		featureB = matches[i][1];
		this.displayFeature(featureB,obj,img);
		//
		var wid = img.width;
		var hei = img.height;
		var xA = featureA.x()*wid;
		var yA = featureA.y()*hei;
		var xB = featureB.x()*wid;
			//xB += wid; // to other image
		var yB = featureB.y()*hei;
			//yB += 0; // to other image
		var d = new DO();
		var col = Code.getColARGB(0xFF,Code.randomInt(0xFF),Code.randomInt(0xFF),Code.randomInt(0xFF));
		d.graphics().clear();
		d.graphics().setLine(1.0,col);
		d.graphics().beginPath();
		d.graphics().moveTo(xA,yA);
		d.graphics().lineTo(xB,yB);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().identity();
		this._root.addChild(d);
strA += "new V3D("+featureA.x()+","+featureA.y()+",1.0),";
strB += "new V3D("+featureB.x()+","+featureB.y()+",1.0),";
	}
strA += "];\n";
strB += "];\n";
console.log("\n"+"var imageWidth="+this._imageSourceList[0].width+";\nvar imageHeight="+this._imageSourceList[0].height+"\n"+strA+"\n"+strB);
}
FeatureTest.prototype.displayFeatures = function(){
	var i, j, d, img, desc, len, img, obj, fea;
	for(i=0;i<this._imageFeatureList.length;++i){
		desc = this._imageFeatureList[i];
		img = this._imageSourceList[i];
		obj = this._imageDOList[i];
		var features = desc.featureList();
		for(j=0;j<features.length;++j){
			fea = features[j];
//this.displayFeature(fea,obj,img);
		}
this._feaLocX = 0.0;
this._feaLocY = 400.0;
this._feaCount = 0;

		var scales = this._scales[i];
		if(false && i==0 && scales){
			var viz = scales["viz"];
			var arr = viz;
			var currWidth = 400*i;
			var currHeight = 300;
			// 
// 			for(j=0;j<arr.length;++j){
// j = 0
// 				var source = arr[j];
// 				var _src = source["source"];
// 				var _wid = source["width"];
// 				var _hei = source["height"];
// 				var sca = 4.0;
// 				//var _col = ImageMat.ARGBFromFloat(_src);
// 				var _img = this._stage.getFloatRGBAsImage(_src,_src,_src,_wid,_hei);
// 				d = new DOImage(_img);
// 				this._root.addChild(d);
// 				d.matrix().identity();
// 				d.matrix().scale(sca);
// 				d.matrix().translate(currWidth,currHeight);
// 				currWidth += _wid*sca;
// break;
// 			}
			// in-image circling of peak locations
			// var peaks = scales["scalePeaks"];
			// for(j=0;j<peaks.length;++j){
			// 	var peak = peaks[j];
			// 	this.displayPeak(peak,obj,true);
			// }
			// gray DOG base images
			var offScaleX = 0;
			var offScaleY = 300;
			scales = scales["images"];
			for(j=0;j<scales.length;++j){
				var source = scales[j];
				var _src = source["source"];
				var _wid = source["width"];
				var _hei = source["height"];
				_src = ImageMat.normalFloat01(_src);
				//var _col = ImageMat.ARGBFromFloat(_src);
				var _img = this._stage.getFloatRGBAsImage(_src,_src,_src,_wid,_hei);
				d = new DOImage(_img);
				d.matrix().translate(offScaleX,offScaleY);
				this._root.addChild(d);
				offScaleX += _wid;
			}
			
		}
		var peaks = this._peaks[i];
		if(peaks){
			for(j=0;j<peaks.length;++j){
				var peak = peaks[j];
				this.displayPeak(peak,obj);
			}
		}
//break;
	}
}
FeatureTest.prototype.displayPeak = function(peak,obj,scaler){
	var rad = 1.0;
	if(scaler){
		rad = 0.5*peak.value;
	}
	var d = new DO();
	var x = peak.x;
	var y = peak.y;
	//main
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFFFF00);
	d.graphics().beginPath();
	d.graphics().setFill(0x22FF0000);
	d.graphics().moveTo(rad,0);
	d.graphics().arc(0,0, rad, 0,Math.PI*2, false);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	d.matrix().identity();
	d.matrix().translate(x,y);
	obj.addChild(d);
}
FeatureTest.prototype.displayFeature = function(feature,obj,img){
if(obj&&img){
	var wid = img.width;
	var hei = img.height;
	var x = feature.x();
	var y = feature.y();
	var scale = feature.scale();
	x *= wid;
	y *= hei;
	//pt = new V3D(ptList[i].x*wid,ptList[i].y*hei,ptList[i].z);
	var d = new DO();
	var rad = 5.0;
	//rad = 1.0 + 5.0*Math.log(0.1*scale);
	rad = 4.0*scale;
var angles = feature.colorAngle();
var redAng = angles.redAng();
var grnAng = angles.grnAng();
var bluAng = angles.bluAng();
var gryAng = angles.gryAng();
var redMag = angles.redMag();
var grnMag = angles.grnMag();
var bluMag = angles.bluMag();
var gryMag = angles.gryMag();
	//main
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFFFF00);
	d.graphics().beginPath();
	d.graphics().setFill(0x22FF0000);
	d.graphics().moveTo(rad,0);
	d.graphics().arc(0,0, rad, 0,Math.PI*2, false);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	// red line
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(0,0);
	d.graphics().lineTo( rad*Math.cos(redAng)*redMag, rad*Math.sin(redAng)*redMag );
	d.graphics().endPath();
	d.graphics().strokeLine();
	// grn line
	d.graphics().setLine(1.0,0xFF00FF00);
	d.graphics().beginPath();
	d.graphics().moveTo(0,0);
	d.graphics().lineTo( rad*Math.cos(grnAng)*grnMag, rad*Math.sin(grnAng)*grnMag );
	d.graphics().endPath();
	d.graphics().strokeLine();
	// blu line
	d.graphics().setLine(1.0,0xFF0000FF);
	d.graphics().beginPath();
	d.graphics().moveTo(0,0);
	d.graphics().lineTo( rad*Math.cos(bluAng)*bluMag, rad*Math.sin(bluAng)*bluMag );
	d.graphics().endPath();
	d.graphics().strokeLine();
	// grn line
	d.graphics().setLine(1.0,0xFFFFFFFF);
	d.graphics().beginPath();
	d.graphics().moveTo(0,0);
	d.graphics().lineTo( rad*Math.cos(gryAng)*gryMag, rad*Math.sin(gryAng)*gryMag );
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.matrix().identity();
	d.matrix().translate(x,y);
	obj.addChild(d);
};

//return;

//
if(this._feaLocX===undefined){
	this._feaLocX = 0.0;
	this._feaLocY = 300.0;
	this._feaCount = 0;
}
if(this._feaCount<80){
	var _red = feature._flat._red;
	var _grn = feature._flat._grn;
	var _blu = feature._flat._blu;
	var _wid = feature._flat.width();
	var _hei = feature._flat.height();
	var img = this._stage.getFloatRGBAsImage(_red,_grn,_blu,_wid,_hei);
	var sca = 2.0;
	d = new DOImage(img);
	d.matrix().identity();
	d.matrix().scale(sca);
	d.matrix().translate(this._feaLocX,this._feaLocY);
	this._feaLocX += _wid*sca;
	this._root.addChild(d);
	if(this._feaLocX>1200.0){
		this._feaLocX = 0.0;
		this._feaLocY += _hei*sca;
	}
++this._feaCount;
}
}


