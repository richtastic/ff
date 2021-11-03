// QRCode.js

function QRCode(){
	this._version = null;
	this._error = null; // error correction 
	this._mask = null; // mask pattern
	this._moduleMatrix = null; // 
	this._width = null; // 
	this._height = null; // 
	// image -> data
	// data -> qr code
}
// ------------------------------------------------------------------------
QRCode.fromImage = function(imageData){ // find in image & return data
	var OFFX = 10;
	var OFFY = 10;

	var matrix = imageData;

	// var img = matrix;
	var img = GLOBALSTAGE.getImageMatAsImage(matrix);
	var d = new DOImage(img);
	d.matrix().translate(OFFX + 0, OFFY + 0);
	GLOBALSTAGE.addChild(d);
	// dxxx += imgA.width();// widthA*scale;
	// 

	// scale to manageable size


	// scale up / down based on needed resolution for large/smaller versions

	// get grayscale
	var wid = matrix.width();
	var hei = matrix.height();
	var gray = matrix.gry();

	// ImageMat.threshold(gray, 0.5);

	var size = Math.round( (wid+hei)*0.5 * 0.1);
	var threshold = 0.5;
	// var size = null;
	// var threshold = null;
	// var rangeMin = null;
	var rangeMin = 0.05;
	console.log(gray, wid, hei, size, threshold, rangeMin)
	var result = ImageMat.adaptiveThreshold(gray, wid, hei, size, threshold, rangeMin);
	gray = result["value"];
		// console.log(result);

	// retract/expand ?

// throw "..."
// var img = GLOBALSTAGE.getFloatRGBAsImage(gray,gray,gray, wid,hei);
// var d = new DOImage(img);
// // d.matrix().scale(10.0);
// d.matrix().translate(OFFX + 600 + 0, OFFY + 0);
// GLOBALSTAGE.addChild(d);


		// throw "?";

	// ImageMat.adaptiveThreshold = function(src, wid, hei, size, threshold, rangeMin){ 



	// local range maximizing

	// local 0-1 thresholding

	var grayInverted = Code.copyArray(gray);
		ImageMat.invertFloat01(grayInverted);
// gray = grayInverted;
	
	console.log(gray,wid,hei);

	// var blobs = ImageMat.findBlobs(gray, wid, hei);
	// console.log(blobs);

	var info = ImageMat.findBlobsCOM(gray, wid, hei);
	ImageMat.describeBlobs(info);
	var blobsWhite = info["blobs"];

	var info = ImageMat.findBlobsCOM(grayInverted, wid, hei);
	ImageMat.describeBlobs(info);
	var blobsBlack = info["blobs"];
	

	// info
	var blobs = blobsBlack;
	for(var i=0; i<blobs.length; ++i){
		var blob = blobs[i];
		blob["color"] = "black";
		blob["point"] = new V2D(blob["x"],blob["y"]);
	}
	var blobs = blobsWhite;
	for(var i=0; i<blobs.length; ++i){
		var blob = blobs[i];
		blob["color"] = "white";
		blob["point"] = new V2D(blob["x"],blob["y"]);
	}
	// .
	// 
	console.log(blobs);

	// show
	var d = new DO();
	d.matrix().translate(OFFX + 0, OFFY + 0);
	GLOBALSTAGE.addChild(d);
	d.graphics().clear();
	var blobs = blobsWhite;
	for(var i=0; i<blobs.length; ++i){
		var blob = blobs[i];
		var x = blob["x"];
		var y = blob["y"];
		var radMin = blob["radiusMin"];
		var radMax = blob["radiusMax"];
		d.graphics().beginPath();
		d.graphics().setLine(1.0, 0xFFFF0000);
		d.graphics().drawCircle(x,y, radMin);
		d.graphics().endPath();
		d.graphics().strokeLine();

		d.graphics().beginPath();
		d.graphics().setLine(2.0, 0xFFFF0000);
		d.graphics().drawCircle(x,y, radMax);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	
	// show
	var d = new DO();
	d.matrix().translate(OFFX + 0, OFFY + 0);
	GLOBALSTAGE.addChild(d);
	d.graphics().clear();
	var blobs = blobsBlack;
	for(var i=0; i<blobs.length; ++i){
		var blob = blobs[i];
		var x = blob["x"];
		var y = blob["y"];
		// console.log(x,y)
		// 
		var radMin = blob["radiusMin"];
		var radMax = blob["radiusMax"];
		d.graphics().beginPath();
		d.graphics().setLine(1.0, 0xFF00FF00);
		d.graphics().drawCircle(x,y, radMin);
		d.graphics().endPath();
		d.graphics().strokeLine();

		d.graphics().beginPath();
		d.graphics().setLine(2.0, 0xFF00FF00);
		d.graphics().drawCircle(x,y, radMax);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	
	




	// put blobs into 2d quad space
	var blobToPoint = function(b){
		return b["point"];
		// return new V2D(b["x"],b["y"]);
	}
	var space = new QuadTree(blobToPoint);
	// insert
	for(var i=0; i<blobsWhite.length; ++i){
		var blob = blobsWhite[i];
		space.insertObject(blob);
	}
	for(var i=0; i<blobsBlack.length; ++i){
		var blob = blobsBlack[i];
		space.insertObject(blob);
	}

	console.log(space);
	var blobsAll = space.toArray();
	for(var i=0; i<blobsAll.length; ++i){
		var blob = blobsAll[i];
		blob["id"] = i;
	}

	// finder patterns: small black, larger white, largest black -- concentric
	var finderPatterns = {};
	for(var i=0; i<blobsWhite.length; ++i){
		var blobWhite = blobsWhite[i];
		var whiteID = blobWhite["id"];
		var center = blobWhite["point"];
		var radMin = blobWhite["radiusMin"];
		var radMax = blobWhite["radiusMax"];
		var radAvg = (radMin+radMax)*0.5;
		//...
		var blobs = space.objectsInsideCircle(center, radMin);
		//finderPatterns
		// console.log(blobs);
		// narrow by size
		for(var j=0; j<blobs.length; ++j){
			var blob = blobs[j];
			var color = blob["color"];
			if(color=="black"){

				var rMin = blob["radiusMin"];
				var rMax = blob["radiusMax"];
				var rAvg = (rMin+rMax)*0.5;
				var ratio = radAvg/rAvg;
				console.log(rAvg,radAvg,ratio);
				// 2.5/1.5 = 1.666
				// 1.36 ?
				if(1.20<ratio && ratio<1.60){ // 1.36
					if(!finderPatterns[whiteID]){
						finderPatterns[whiteID] = {"small":[],"large":[], "white":blobWhite};
					}
					finderPatterns[whiteID]["small"].push(blob);
				}
				if(0.50<ratio && ratio<0.75){ // 0.67
					if(!finderPatterns[whiteID]){
						finderPatterns[whiteID] = {"small":[],"large":[], "white":blobWhite};
					}
					finderPatterns[whiteID]["large"].push(blob);
				}

				// finderPatterns.push([blobWhite,blob]);
			}

		}
	}
	// pick only candidates 
	console.log(finderPatterns);
	var candidatePatterns = [];
	var keys = Code.keys(finderPatterns);
	for(var i=0; i<keys.length; ++i){
		 var key = keys[i];
		 var entry = finderPatterns[key];
		 // console.log(entry);
		 if(entry["small"].length==1 && entry["large"].length==1){
			var pattern = {};
			pattern["inner"] = entry["small"][0];
			pattern["center"] = entry["white"];
			pattern["outer"] = entry["large"][0];
			candidatePatterns.push(pattern);
		 }
	}
	console.log(candidatePatterns);

	// throw "..."

	// show
	var d = new DO();
	d.matrix().translate(OFFX + 0, OFFY + 0);
	GLOBALSTAGE.addChild(d);
	d.graphics().clear();
	// var blobs = candidatePatterns;
	for(var i=0; i<candidatePatterns.length; ++i){
		var entry = candidatePatterns[i];
		var white = entry["center"];
		var point = white["point"];
		var x = point.x;
		var y = point.y;
		// var x = blob["x"];
		// var y = blob["y"];
		// console.log(x,y)
		// 
		// var radMin = blob["radiusMin"];
		// var radMax = blob["radiusMax"];
		// d.graphics().beginPath();
		// d.graphics().setLine(1.0, 0xFF00FF00);
		// d.graphics().drawCircle(x,y, radMin);
		// d.graphics().endPath();
		// d.graphics().strokeLine();

		d.graphics().beginPath();
		d.graphics().setLine(5.0, 0xFFFF00FF);
		d.graphics().drawCircle(x,y, 5.0);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}

	// for all combinations of 3 finder patterns:
	if(candidatePatterns.length!=3){
		console.log(candidatePatterns);
		throw "different number of candidatePatterns != 3";
	}

	// estimate module size:
	for(var i=0; i<candidatePatterns.length; ++i){
		var entry = candidatePatterns[i];
		// console.log(entry);
		var innerMin = entry["inner"]["radiusMin"]*(2.0/3);
		var innerMax = entry["inner"]["radiusMax"]*(2.0/3/Math.sqrt(2));
		var centerMin = entry["center"]["radiusMin"]*(2.0/3);
		var centerMax = entry["center"]["radiusMax"]*(2.0/5/Math.sqrt(2));
		var outerMin = entry["outer"]["radiusMin"]*(2.0/5);
		var outerMax = entry["outer"]["radiusMax"]*(2.0/7/Math.sqrt(2));
		var size = (innerMin+innerMax+centerMin+centerMax+outerMin+outerMax)/6.0;
		// console.log(innerMin,innerMax,centerMin,centerMax,outerMin,outerMax, size);
		entry["module"] = size;
		entry["point"] = entry["inner"]["point"];
	}
	// throw "..."


	// discover which of 3 is corner : DISTANCES : TIMING PATTERNS?
	var a = candidatePatterns[0];
	var b = candidatePatterns[1];
	var c = candidatePatterns[2];
	var pA = a["center"]["point"];
	var pB = b["center"]["point"];
	var pC = c["center"]["point"];
	// var dirAB = V2D.sub(pB);
	var dAB = V2D.distance(pA,pB);
	var dAC = V2D.distance(pA,pC);
	var dBC = V2D.distance(pB,pC);

	console.log(dAB,dAC,dBC);

	var blobO = null;
	var blobX = null;
	var blobY = null;
	if(dAB>dAC && dAB>dBC){ // AB hypotenuse, C corner
		blobO = c;
		var dCA = V2D.sub(pA,pC);
		var dCB = V2D.sub(pB,pC);
		var angle = V2D.angleDirection(dCA,dCB);
		console.log("C: "+Code.degrees(angle));
		if(angle>=0){
			blobX = a;
			blobY = b;
		}else{
			blobX = b;
			blobY = a;
		}
	}else if(dAC>dAB && dAC>dBC){ // AC hypotenuse, B corner
		blobO = b;
		var dBA = V2D.sub(pA,pB);
		var dBC = V2D.sub(pC,pB);
		var angle = V2D.angleDirection(dBA,dBC);
		console.log("B: "+Code.degrees(angle));
		if(angle>=0){
			blobX = a;
			blobY = c;
		}else{
			blobX = c;
			blobY = a;
		}
	}else{ // BC hypotenuse, A corner
		blobO = a;
		var dAB = V2D.sub(pB,pA);
		var dAC = V2D.sub(pC,pA);
		var angle = V2D.angleDirection(dAB,dAC);
		console.log("A: "+Code.degrees(angle));
		if(angle>=0){
			blobX = b;
			blobY = c;
		}else{
			blobX = c;
			blobY = b;
		}
	}
	console.log(blobO,blobX,blobY);

	// DRAW
	var d = new DO();
	d.matrix().translate(OFFX + 0, OFFY + 0);
	GLOBALSTAGE.addChild(d);
	d.graphics().clear();
		d.graphics().beginPath();
		d.graphics().setLine(5.0, 0xFFCC0033);
		d.graphics().moveTo(blobO["center"]["point"].x,blobO["center"]["point"].y);
		d.graphics().lineTo(blobX["center"]["point"].x,blobX["center"]["point"].y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		//
		d.graphics().beginPath();
		d.graphics().setLine(5.0, 0xFF00CC66);
		d.graphics().moveTo(blobO["center"]["point"].x,blobO["center"]["point"].y);
		d.graphics().lineTo(blobY["center"]["point"].x,blobY["center"]["point"].y);
		d.graphics().endPath();
		d.graphics().strokeLine();
	// .

	// calculate initial global affine matrix (container)
	var pointO = blobO["point"];
	var pointX = blobX["point"];
	var pointY = blobY["point"];
	var moduleSize = blobO["module"];
	var finderSize = moduleSize*7/2;
	var dirX = V2D.sub(pointX,pointO).norm();
	var dirY = V2D.sub(pointY,pointO).norm();

// console.log(dirX+"?");
// console.log(dirY+"?");

	var tl = new V2D(-finderSize*dirX.x - finderSize*dirY.x, - finderSize*dirX.y - finderSize*dirY.y ) .add(pointO);
	var tr = new V2D( finderSize*dirX.x + finderSize*dirY.x, - finderSize*dirX.y - finderSize*dirY.y ) .add(pointX);
	var bl = new V2D(-finderSize*dirX.x - finderSize*dirY.x,   finderSize*dirX.y + finderSize*dirY.y ) .add(pointY);
	var br = V2D.add( V2D.sub(tr,tl), V2D.sub(bl,tl)).add(pointO).add( V2D.sub(tl,pointO) );

	// DRAW enclosing square
	var d = new DO();
	d.matrix().translate(OFFX + 0, OFFY + 0);
	GLOBALSTAGE.addChild(d);
	d.graphics().clear();
		
		d.graphics().setLine(3.0, 0xFF9966FF);
		d.graphics().beginPath();
		d.graphics().moveTo(tl.x,tl.y);
		d.graphics().lineTo(tr.x,tr.y);
		d.graphics().lineTo(br.x,br.y);
		d.graphics().lineTo(bl.x,bl.y);
		d.graphics().endPath();
		d.graphics().strokeLine();

	// calc rough estimate of matrix size [from relative module sizes]
	var sizeX = V2D.sub(tr,tl).length()/moduleSize;
	var sizeY = V2D.sub(bl,tl).length()/moduleSize;
	
	var qrSize = Math.round( (sizeX+sizeY)*0.5 );
	console.log(sizeX,sizeY, qrSize);


	// extract squares from original image:
	var origin = new V2D(tl); // corner point
	var affine = new Matrix2D(); // affine matrix
	var count = qrSize;

	var oTR = V2D.sub(tr,tl);
	var oBL = V2D.sub(bl,tl);

	R3D.affineCornerMatrixLinear([new V2D(1,0), new V2D(0,1)],[oTR,oBL],affine);

	console.log(affine+"");

	// R3D.affineCornerMatrixLinear = function(pointsA,pointsB, reuse){

	var dataMatrix = Code.newArrayZeros(count*count);

var d = new DO();
d.matrix().translate(OFFX + 0, OFFY + 0);
GLOBALSTAGE.addChild(d);
d.graphics().clear();
	
	var p = new V2D();
	var v = new V3D();
	for(var y=0; y<count; ++y){
		for(var x=0; x<count; ++x){
			p.set((x+0.5)/count,(y+0.5)/count);
			affine.multV2DtoV2D(p,p);
			p.add(tl);
			// get at p ... 
			// console.log(gray,v);
			// gray.getAt(p,v);
			var ind = Math.round(p.y)*wid + Math.round(p.x);
			var v = gray[ind];
// console.log(v);
			var val = v>0.5 ? 1.0 : 0.0;

			var index = y*count + x;
			// var val = v.length();
			// console.log(gray,val);
			dataMatrix[index] = val;

// 
d.graphics().setLine(3.0, 0xFFFF00FF);
d.graphics().beginPath();
d.graphics().drawCircle(p.x,p.y, 3.0);
d.graphics().endPath();
d.graphics().strokeLine();
// 

		}
	}



// console.log(dataMatrix);


// var img = GLOBALSTAGE.getImageMatAsImage(dataMatrix);
var img = GLOBALSTAGE.getFloatRGBAsImage(dataMatrix,dataMatrix,dataMatrix, count,count);

// console.log(img);
// console.log(wid,hei);

var d = new DOImage(img);
d.matrix().scale(10.0);
d.matrix().translate(OFFX + 1000 + 0, OFFY + 0);
GLOBALSTAGE.addChild(d);

// throw "..."
return {"grid":dataMatrix, "size":count};
	

	

	

	// calc 

	// find alignment patterns inside square


	// ................


	// 
	// 
	

	// get 1D profile in X & Y of origin finder pattern

	// estimate corner of origin finder pattern

	// estimate module size

	// follow timing pattern 

	// from corner A: iteritively follow timing pattern to determing grid size
	// use local neighborhood for POSSIBLY differently colored neighbors to keep search toward middle of module line
		// -> gets the size of the qr data matrix
		// => know size of data

	// find alignment patterns [if expecting any?]

	// separate collection into a set of grids
	

	// for each grid section, using locally affine estimates:
	// record 1s & 0s into global bitmap

	// -> OUTPUT: QR PATTERN

	//
	throw "fromImage";

}


QRCode.fromGrid = function(dataMatrix, size){ // QR data matrix -> data [p 59]
	// STEP 1 - GET IMAGE W/ DARK=0 LIGHT=1
	
	// STEP 2 - READ FORMAT
	var info = QRCode._readFormatFromGrid(dataMatrix);
	var dataECL = info["ecl"];
	var dataMask = info["mask"];

	// STEP 3 - READ VERSION
	var info = QRCode._readVersionFromGrid(dataMatrix);
	var versionData = info["version"];

	// throw "..."
	// QRCode._bitCapacityTest();

	var info = QRCode.bitCapacityFromSize(size);
	console.log(info);
	// var remainderBits = QRCode.bitRemainderFromSize(size);

	// STEP 4 - XOR MASK
	var dataUnmasked = Code.copyArray(dataMatrix);
	// var dataUnmasked = dataMatrix;
	QRCode._applyGridMasking(dataUnmasked,size, dataMask);
	// QRCode._applyGridMasking(dataUnmasked,size, dataMask);


var img = GLOBALSTAGE.getFloatRGBAsImage(dataUnmasked,dataUnmasked,dataUnmasked, size,size);
var d = new DOImage(img);
d.matrix().scale(10);
d.matrix().translate(10 + 1600 , 10 + 0);
GLOBALSTAGE.addChild(d);


	// STEP 5 - READ CHARACTERS
	var info = QRCode._readDataFromGrid(dataUnmasked);
	console.log(info);
	var bytes = info["data"];
/*
	// // STEP 5 - "RESTORE" DATA & ERROR CORRECTION CODEWORDS
	var info = QRCode._revertOrderDataBlocks(bytes, versionData, dataECL);
	console.log(info);
		bytes = info["data"];

throw "..."
*/


	// // STEP 6 + 7 - ERROR DETECTION + CORRECTING
	// var info = QRCode._errorCorrectData(bytes, versionData, dataECL);
	// console.log(info);
	// var bytes = info["data"];
	// console.log(bytes);


// throw "..."

	// STEP 7 + 8 - DATA TO CODEWORDS/SEGMENTS > CHARACTERS
	var datum = QRCode._readStringFromMode(bytes, versionData, dataECL);
	console.log(datum);

throw "..."
	/*
	var str = "";
	for(var i=0; i<bytes.length; ++i){
		var byte = bytes[i];
		// var val = String.fromCharCode(byte);
		// str = str+""+val;
	}
	console.log(str);
	*/

	throw "?"

	

	


	// WHEN IS MASKING DONE ?


	// , "version":version, "size":size, "versionData":versionData, "formatData":formatData, "other":null};

	// version + format + data + error + ...




	// format: 15-bit sequence: 5 data (ECL[2] mask[3]) | 10 error correction (BCH)
	// error correction level indicators: L:01 M:00 Q:11 H:10
	// mask pattern

	// read thru data:
	// ECI Mode (4) | ECI Designator (8,16,24) | Mode Indicator (4) | Char Count Indicator | Data bit stream


	throw "fromGrid";
}

// ------------------------------------------------------------------------
// QRCode.bitRemainderFromVersion = function(version){
// 	var size = QRCode._sizeFromVersion(version);
// 	return QRCode.bitCapacityFromSize(size);
// }
QRCode.bitCapacityFromVersion = function(version){
	var size = QRCode._sizeFromVersion(version);
	return QRCode.bitCapacityFromSize(size);
}
// QRCode.bitRemainderFromSize = function(size){
// 	var available = QRCode.bitCapacityFromSize;
// 	var remainder = available%8;
// 	return remainder;
// }
QRCode.bitCapacityFromSize = function(size){ // data table 1
	// console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
	// console.log("size: "+size);
	var version = QRCode._versionFromSize(size);
	// console.log("version: "+version);
	var totalBits = size*size;
	// console.log("totalBits: "+totalBits);
	var sizeFinderPattern = 8*8; // including white spacing
	var sizeAlignmentPattern = 5*5;
	var sizeTimingPattern = size - 8*2;
	var sizeVersionPattern = 6*2 + 3 + 8*2; // 16 + 15 ?
	var sizeFormatPattern = 6*3;

	// console.log("totalBits: "totalBits);
	var countAlignmentInRow = QRCode._alignmentCountForSize(size);
	var countAlignmentPattern = QRCode._alignmentCountExistingForSize(size);
	var countFormatPattern = 0;

	if(version==0){ // micro
		throw "do micro";
	}else if(version==1){
		// 
	}
	if(version>=7){
		countFormatPattern = 2;
		sizeTimingPattern -= Math.max(5*(countAlignmentInRow-2),0); // alignment patterns inside
	}
	// console.log("sizeFinderPattern: "+sizeFinderPattern);
	// console.log("sizeTimingPattern: "+sizeTimingPattern);
	// console.log("sizeAlignmentPattern: "+sizeAlignmentPattern);
	// console.log("countAlignmentInRow: "+countAlignmentInRow);
	// console.log("countAlignmentPattern: "+countAlignmentPattern);
	var sizeFunctional = 3*sizeFinderPattern + 2*sizeTimingPattern + countAlignmentPattern*sizeAlignmentPattern;
	var sizeInformation = sizeVersionPattern + countFormatPattern*sizeFormatPattern;
	// console.log("sizeFunctional: "+sizeFunctional);
	// console.log("sizeInformation: "+sizeInformation);

	var sizeTotalUnused =sizeFunctional + sizeInformation;

	// console.log("sizeTotalUnused: "+sizeTotalUnused);

	var sizeTotalAvailable = totalBits - sizeTotalUnused;

	// console.log("sizeTotalAvailable: "+sizeTotalAvailable);

	var bytesTotalAvailable = sizeTotalAvailable/8 | 0;

	var bitsRemainder = sizeTotalAvailable % 8;

	// console.log("bytesTotalAvailable: "+bytesTotalAvailable);
	// console.log("bitsRemainder: "+bitsRemainder);

	// throw "bitCapacityFromSize";
	return {"bits":sizeTotalAvailable, "bytes":bytesTotalAvailable, "remainder":bitsRemainder};
}
QRCode._errorCorrectData = function(data, version){
	

	if(ecl==QRCode.ECL_L){
		console.log("ECL L");
	}else if(ecl==QRCode.ECL_M){
		console.log("ECL M");
	}else if(ecl==QRCode.ECL_Q){
		console.log("ECL Q");
	}else if(ecl==QRCode.ECL_H){
		console.log("ECL H");
	}
	var errorCount = 0;
	var bytes = [];

	throw "_readStringFromMode";
	return {"errors":errorCount, "data":bytes};
}

QRCode._revertOrderDataBlocks = function(data, version, ecl){
	// assemble into 2 separate matrixes
	var matrixDataRows = 0;
	var matrixDataCols = 0;
	var matrixDataRemainder = 0;
	var matrixErrorRows = 0;
	var matrixErrorCols = 0;
	var matrixErrorRemainder = 0;

// QRCode.ECL_L = 0x01; // 7%
// QRCode.ECL_M = 0x00; // 15%
// QRCode.ECL_Q = 0x03; // 25%
// QRCode.ECL_H = 0x02; // 30%

	var eclToIndex = function(e){
		if(e==QRCode.ECL_L){
			return 0;
		}else if(e==QRCode.ECL_M){
			return 1;
		}else if(e==QRCode.ECL_Q){
			return 2;
		}else if(e==QRCode.ECL_H){
			return 3;
		}
		throw "unknown ecl: "+e;
	}
	// p.35 - table for ECC characteristics
	var tableECC = []; // error correction codewords [bytes used for error correction]
		tableECC.push([0,0,0,0]); // 0 ?
		tableECC.push([7,10,13,17]); // 1
		tableECC.push([10,16,22,28]);
		tableECC.push([15,26,36,44]); // 3
		tableECC.push([20,36,52,64]);
		tableECC.push([26,48,72,88]); // 5
		tableECC.push([36,64,96,112]); // 6
		tableECC.push([40,72,108,130]); // 7
		tableECC.push([48,88,132,156]);
		tableECC.push([60,110,160,192]);
		tableECC.push([72,130,192,224]); // 10
		tableECC.push([80,150,224,264]); // 11
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
		// tableECC.push([,,,]);
	var tableECB = []; // error correction blocks [row-groupings of data+ecc]
		tableECB.push([0,0,0,0]); // 0 ?
		tableECB.push([1,1,1,1]); // 1
		tableECB.push([1,1,1,1]);
		tableECB.push([1,1,2,2]); // 3
		tableECB.push([1,2,2,4]);
		tableECB.push([1,2,2,2]); // 5
		tableECB.push([2,4,4,4]);
		// tableECB.push([2,4,2,4]); // 7 -- starts double-table
			tableECB.push([2,4,6,5]); // TOTALS
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);
		// tableECB.push([,,,]);

	// M, L, Q, H
	// var eclPercents = [0.07, 0.15, 0.25, 0.30];
	// var percent = eclPercents[ecl];

	console.log("version : "+version);
	console.log("ecl : "+ecl);
	console.log(data);

	// table 13:
		var info = QRCode.bitCapacityFromVersion(i);
	var totalCodewords =  info["bytes"] ;
	console.log("totalCodewords: "+totalCodewords);
	// these have to come from a table:
	var indexECL = eclToIndex(ecl);
	var countECC = tableECC[version][indexECL];
	var countECB = tableECB[version][indexECL];
	var eccPerBlock = 0;


	console.log("countECC: "+countECC);
	console.log("countECB: "+countECB);
	

	// d >= e + 2t + p

	// p 46

	// place data into matrixes in order
	var matrixData = [];
	var matrixError = [];

	// TODO: do error correcting

	// read out data from matrixes in order

	var orderedData = data;

	throw "_revertOrderDataBlocks";
	return {"data":orderedData};
}

QRCode._readStringFromMode = function(data, version, ecl){

console.log(data);
for(var i=0; i<5; ++i){
console.log(i+" : "+Code.intToBinaryString(data[i], 8));
}


// console.log(version);
// console.log(ecl);

	// alphanumeric - 45 characters
	// 11 bits per 2 input character
	var table = QRCode.TABLE_ALPHA_NUMERIC;
	var current = 0x0;
	var ind = 0;
	var sub = 0;
	var readNBits = function(data, index, subIndex, totalReadCount){
		// var totalReadCount = 11;
		var bit = 0x01 << totalReadCount-1; // 0b0 1000000000
		var value = 0x0;
		var read = 0;
		// console.log("ind: "+index+" sub:"+subIndex);
		for(var i=0; i<10; ++i){ // max of 3-4 bytes
			var byte = data[index];
			// console.log(" "+i+": "+Code.intToBinaryString(byte, 8));
			// var rem = subIndex;
			// console.log("rem: "+rem);
			for(var j=subIndex; j<8; ++j){
				var b = 0x01 << (7-j);
				// console.log(" "+Code.intToBinaryString(b, 20)+" = "+ (byte&b) );
				if( (byte&b) !=0){
					value |= bit;
				}
				// console.log(" "+Code.intToBinaryString(value, totalReadCount)+"");
				bit >>= 1;
				read += 1;
				subIndex+=1;
				if(read==totalReadCount){
					break;
				}
			}
			if(subIndex==8){
				index += 1;
				subIndex = 0;
			}
			if(read==totalReadCount){
				break;
			}
		}
		console.log(" "+Code.intToBinaryString(value, totalReadCount));
		// console.log(" -> "+index+" & "+subIndex);
		return {"value":value, "index":index, "subdex":subIndex};
	}

	// get initial mode:



	var mode = 0;
	// num 0001
	// alp 0010
	// byt 0100
	// kan 1000

	/*
	QRCode.MODE_INDICATOR_ECI = 0x7; // extended channel interpretation mode : 
	QRCode.MODE_INDICATOR_NUMERIC = 0x1;
	QRCode.MODE_INDICATOR_ALPHANUMERIC = 0x2;
	QRCode.MODE_INDICATOR_BYTE = 0x4;
	QRCode.MODE_INDICATOR_KANJI = 0x8;
	QRCode.MODE_INDICATOR_NUMERIC = 0x1;
	QRCode.MODE_INDICATOR_APPEND = 0x3;
	QRCode.MODE_INDICATOR_FNC1_FIRST = 0x5;
	QRCode.MODE_INDICATOR_FNC1_SECOND = 0x9;
	QRCode.MODE_INDICATOR_TERMINATOR = 0x000;
	*/
	var countECIModeIndicator = 4;
	var info = readNBits(data,ind,sub, countECIModeIndicator);
	var value = info["value"];
		ind = info["index"];
		sub = info["subdex"];
	mode = value;
	console.log("mode: "+mode);

// throw "????"

	if(mode==QRCode.MODE_INDICATOR_TERMINATOR){
		console.log("MODE TERMINATOR");
		throw "."
	}else if(mode==QRCode.MODE_INDICATOR_ECI){
		console.log("MODE ECI");
		throw "."
	}else if(mode==QRCode.MODE_INDICATOR_APPEND){
		console.log("MODE STRUCTURED APPEND");
		throw "."
	}

		var versionToIndex = function(version){
			if(1<=version && version <=9){
				return 0;
			}else if(10<=version && version <=26){
				return 1;
			}else if(27<=version && version <=40){
				return 2;
			}
			throw "unknown version: "+version;
		};

		var modeToIndex = function(mode){
			if(mode==QRCode.MODE_INDICATOR_NUMERIC){
				return 0;
			}else if(mode==QRCode.MODE_INDICATOR_ALPHANUMERIC){
				return 1;
			}else if(mode==QRCode.MODE_INDICATOR_BYTE){
				return 2;
			}else if(mode==QRCode.MODE_INDICATOR_KANJI){
				return 3;
			}
			throw "unknown mode: "+mode;
		};


	// [MODE][VERSION_INDEX]
	var dataLengthTable = [];
		dataLengthTable[modeToIndex(QRCode.MODE_INDICATOR_NUMERIC)] = [10,12,14];
		dataLengthTable[modeToIndex(QRCode.MODE_INDICATOR_ALPHANUMERIC)] = [9,11,13];
		dataLengthTable[modeToIndex(QRCode.MODE_INDICATOR_BYTE)] = [8,16,16];
		dataLengthTable[modeToIndex(QRCode.MODE_INDICATOR_KANJI)] = [8,10,12];
// VERSIONS
// 000001 1
// 001001 9
// 001010 10
// 011010 26
// 011011 27
// 101000 40
// 1-9
// 10-26
// 27-40

		console.log("VERSION: "+version);


/*
	var dataLengthTable = {};
		dataLengthTable[version] = [10, 9, 8, 8];
		dataLengthTable[version] = [12, 11, 16, 10];
		dataLengthTable[version] = [14, 13, 16, 12];
	
	var lengthBits = dataLengthTable[mode][index];
	*/

	var indexVersion = versionToIndex(version);
	var indexMode = modeToIndex(mode); /// .... could use bits too
console.log("indexVersion: "+indexVersion);
console.log("indexMode: "+indexMode);
// console.log(dataLengthTable);
	var chunkLength = dataLengthTable[indexMode][indexVersion];

	console.log("chunkLength: "+chunkLength);


	// ECI DESIGNATOR ?
	// 8, 16, 24

// throw "..."

	var characterCodeCount = 11;

	if(mode==QRCode.MODE_INDICATOR_NUMERIC){
		console.log("MODE NUMBER");
		// 

		var charterLength = 0;

// // V1 = 9 bits length
// 		var info = readNBits(data,ind,sub, 9);
// 		var value = info["value"];
// 			ind = info["index"];
// 			sub = info["subdex"];

// 		characterLength = value;
// console.log(" > characterLength: "+characterLength);

// 		var characterCodeCount = 11;
// 		var info = readNBits(data,ind,sub, characterCodeCount);
// 		var value = info["value"];
// 			ind = info["index"];
// 			sub = info["subdex"];
// 		var charA = value/45 | 0;
// 		var charB = value%45;

	}else if(mode==QRCode.MODE_INDICATOR_ALPHANUMERIC){
		console.log("MODE ALPHANUMERIC");

		var charterLength = 0;

// V1 = 9 bits length
		var info = readNBits(data,ind,sub, chunkLength);
		var value = info["value"];
			ind = info["index"];
			sub = info["subdex"];

		characterLength = value;
console.log(" > characterLength: "+characterLength+"   ("+Code.intToBinaryString(characterLength, chunkLength)+")");

		var characterCodeCount = 11; // 2 characters
		var info = readNBits(data,ind,sub, characterCodeCount);
		var value = info["value"];
			ind = info["index"];
			sub = info["subdex"];
		var charAIndex = value/45 | 0;
		var charBIndex = value%45 | 0;
		var charA = QRCode.TABLE_ALPHA_NUMERIC[charAIndex];
		var charB = QRCode.TABLE_ALPHA_NUMERIC[charBIndex];

		console.log("-> "+charA+" "+charB);

	}else if(mode==QRCode.MODE_INDICATOR_BYTE){
		console.log("MODE BYTE");
	}else if(mode==QRCode.MODE_INDICATOR_KANJI){
		console.log("MODE KANJI");
	}else{
		console.log("MODE UNKNOWN");
		throw "?";
	}

throw "here ?"








	var str = "";
	
	for(var i=0; i<10; ++i){
	// for(var i=0; i<1000; ++i){
		if(ind>data.length-2){
			break;
		}

		var info = readNBits(data,ind,sub, characterCodeCount);
		var value = info["value"];
			ind = info["index"];
			sub = info["subdex"];
		var charA = value/45 | 0;
		var charB = value%45;
		var valueA = table[charA];
		var valueB = table[charB];
		console.log(" "+charA+": "+valueA+" | "+charB+": "+valueB);
		str = str+""+valueA+""+valueB;

	}
	console.log(str);
throw "..."
	return null;
}
QRCode._versionFromSize = function(size){
	if(size==15){
		return 0;
	}
	return (size-17) / 4;
}
QRCode._sizeFromVersion = function(version){
	if(version==0){ // micro
		return 15
	}
	return version*4 + 17; // 1=21, 
}
// 6, 18 ???
QRCode._alignmentCountForSize = function(size,version){ // [from bottom-left ?]
	// 			version # 			size 	# of alignment pattern [n^2 - 3]
	if(size<=15){ // micro
		return 0;
	}else if(size<=21){ // 1 		21			0 [0]
		return 0;
	}else if(size<=41){ // 2-6      25-41 		1 [4(2)]
		return 1;
	}else if(size<=69){ // 7-13     45-69 		6 [9(3)]
		return 3;
	}else if(size<=97){ // 14-20 	73-97 		13 [16(4)]
		return 4;
	}else if(size<=125){ // 21-27 	101-? 		22 [25(5)]
		return 5;
	}else if(size<=153){ // 28-34     ?-? 		33 [36(6)]
		return 6;
	}else if(size<=177){ // 35-40   -177 	46 [49(7)]
		return 7;
	}
	throw "?"
}
QRCode._alignmentCountExistingForSize = function(size,version){
	var count = QRCode._alignmentCountForSize(size,version);
	// 0 = 0
	// 1 = 1
	if(count>=2){
		var square = count*count;
		count = square - 3;
	}
	return count;
}
QRCode._alignmentMask = function(size,version){
// QRCode._alignmentPatternLocationsTest();
	version = null;
	if(!version){
		version = QRCode._versionFromSize(size);
	}
	var mask = Code.newArrayZeros(size*size);
	// size / 2;
	// 5x5 squares
	// 0-1   -> 0	[2]
	// 2-6   -> 4 	[5]
	// 7-13  -> 3 	[7]
	// 14-20 -> 4 	[7]
	// 21-27 -> 5 	[7]
	// 28-34 -> 6 	[7]
	// 35-40 -> 7 	[6]
	var locations = QRCode._alignmentPatternLocations(size,version);
	// console.log(locations);
	// create bit mask
	for(var j=0; j<locations.length; ++j){
		var locY = locations[j];
		for(var i=0; i<locations.length; ++i){
			var locX = locations[i];
			var isCorner = (locX<=6 && locY<=6) || (locX<=6 && locY>=(size-1-6))  || (locX>=(size-1-6) && locY<=6);
			if(!isCorner){
				for(var y=-2; y<=2; ++y){
					for(var x=-2; x<=2; ++x){
						var index = (locY+y)*size + locX+x;
						mask[index] = 1;
					}
				}
			}
		}
	}

	return {"value":mask, "size":size};
}

QRCode._alignmentPatternLocations = function(size,version){
	var count = ((version+7)/7 | 0) + 1;
	if(version<=1){
		count = 0;
	}
	var interior = size - 6 - 7;
	var divisions = count-1;
	var preSpace = interior/divisions;
	var spacing = Math.round(preSpace);
	if(spacing%2==1){
		spacing += 1;
	}
	var remainder = interior - (divisions-1)*spacing; // spacing after timing location
	var locations = [];
	for(var i=0; i<count; ++i){
		var location = null;
		if(i==0){ // first
			location = 6;
		}else if(i==count-1){ // last
			location = size - 7;
		}else{
			location = (i-1)*spacing + remainder + 6;
		}
		locations.push(location);
	}
	return locations;
}


QRCode._errorCorrectionFromData = function(data){
	throw "QRCode._errorCorrectionFromData";
}

QRCode._dataFromFormattedData = function(formatted){
	// ECI HEADER: mode (4) | ECI designator (8,16,24) | 
	// SEGMENTS: mode (4) | character ount indicator | data bit stream
	throw "_dataFromFormattedData";
}

QRCode._formattedDataFromData = function(data){
	// 
	throw "_formattedDataFromdata";
}

QRCode._readVersionFromGrid = function(dataMatrix){ // 2 x 18-bits -- MASKING NOT APPLIED TO VERSION INFO
	var size = Math.round( Math.sqrt(dataMatrix.length) );
	// 6 version | BCH(18-6) 12 bits  = 18
	var version = QRCode._versionFromSize(size);
	if(version<7){ // no version data inside of matrix, just return derived value
		return {"version":version};
	}

	var versionTR = 0x0;
	var bit = 0x01;
	// vertical
	for(var j=0; j<=5; ++j){
		for(var i=0; i<=2; ++i){
			var index = j*size + (i+size-11);
			var value = dataMatrix[index];
			if(value!=0){
				versionTR |= bit;
			}
			bit <<= 1;
		}
	}
	console.log("versionTR: "+Code.intToBinaryString(versionTR));

	var versionBL = 0x0;
	var bit = 0x01;
	// vertical
	for(var i=0; i<=5; ++i){
		for(var j=0; j<=2; ++j){
			var index = (j+size-11)*size + i;
			var value = dataMatrix[index];
			if(value!=0){
				versionBL |= bit;
			}
			bit <<= 1;
		}
	}
	console.log("versionBL: "+Code.intToBinaryString(versionBL));

	
	throw "_readVersionFromGrid";

	// 18,6 BCH
	// ANNEX D
	// error correcting here too

	// version number: is all 6 bits
	var version = (versionBL >> 12) ^ 0x03F;

	return {"versionA":versionTR, "versionB":versionBL, "version":version};
}

QRCode._readFormatFromGrid = function(dataMatrix){ // 2 x 15-bits
	var size = Math.round( Math.sqrt(dataMatrix.length) );
	// | 5 data (2 ECL) (3 MASK) | 10 bits (BCH)| 
	// xored w/ 101010000010010
	var xoring = 0x05412; // 0x5412 = 0b 0101 0100 0001 0010
	// read TL
	var formatTL = 0x0;
	var bit = 0x01;
	// vertical
	for(var i=0; i<=8; ++i){
		if(i==6){ // skip timing line
			continue;
		}
		var index = i*size + 8;
		var value = dataMatrix[index];
		if(value!=0){
			formatTL |= bit;
		}
		bit <<= 1;
	}
	// horizontal
	for(var i=7; i>=0; --i){
		if(i==6){ // skip timing line
			continue;
		}
		var index = 8*size + i;
		var value = dataMatrix[index];
		if(value!=0){
			formatTL |= bit;
		}
		bit <<= 1;
	}
	console.log("formatTL: "+formatTL);
	console.log(Code.intToBinaryString(formatTL));

	// read TR/BL
	var formatTB = 0x0;
	var bit = 0x01;
	// horizontal
	for(var i=size-1; i>=size-8; --i){
		var index = 8*size + i;
		var value = dataMatrix[index];
		if(value!=0){
			formatTB |= bit;
		}
		bit <<= 1;
	}
	// vertical
	for(var i=size-7; i<size; ++i){
		var index = i*size + 8;
		var value = dataMatrix[index];
		if(value!=0){
			formatTB |= bit;
		}
		bit <<= 1;
	}
	
	console.log("formatTB: "+formatTB);
	console.log(Code.intToBinaryString(formatTB));
	//
	// unmask?
	formatTL ^= xoring;
	formatTB ^= xoring;
	//
	if(formatTL!=formatTB){
		throw "unequal formats";
	}
	//

	console.log("xoring: "+Code.intToBinaryString(xoring));

	// error correct ?
	console.log("error correcting ...");
// (15, 5) BCH code
	console.log("formatTL: "+Code.intToBinaryString(formatTL, 15));
	console.log("formatTB: "+Code.intToBinaryString(formatTB, 15));


	// error correcting
	/*
	formatTL = QRCode._BCHCorrect_15_5(formatTL);
	formatTB = QRCode._BCHCorrect_15_5(formatTB);

	console.log("formatTL: "+formatTL);
	console.log("formatTB: "+formatTB);
	*/
// 543210987654321
// 101010000010010
// 10101
// 
	var format = formatTL;
// format = 0x40CE; // after xor
// format = 0x14DC; // before xor
// console.log("format: "+Code.intToBinaryString(format));
	var dataMask = (format >> 10) & 0x07;
	var dataECL = (format >> 13) & 0x03;
	// ...
	console.log("dataMask: "+Code.intToBinaryString(dataMask,3)+" ("+dataMask+")");
	console.log("dataECL: "+Code.intToBinaryString(dataECL,2)+" ("+dataECL+")");
	// ...
	// throw "_readFormatFromGrid";
	return {"formatA":formatTL, "formatB":formatTB, "format":format, "ecl":dataECL, "mask":dataMask};
}
QRCode._applyGridMasking = function(dataMatrix, size, mask){
	// mask = 0;
	// mask = 1;
	// mask = 2;
	// mask = 3;
	// mask = 4;
	// mask = 5;
	// mask = 6;
	// mask = 7;
console.log("MASK: "+mask+" : @ size: "+size+"");
	// throw "..."
	var version = QRCode._versionFromSize(size);
	var info = QRCode._alignmentMask(size,version);
	var alignMask = info["value"];
var mmm = Code.newArrayZeros(size*size);
	var index = 0;
	for(var i=0; i<size; ++i){ // QR code definition is reversed
		for(var j=0; j<size; ++j){

	// for(var j=0; j<size; ++j){
	// 	for(var i=0; i<size; ++i){
		
			
			// TODO: skip if in functional pattern
			// var isInside = QRCode._insideFunctionalPattern(size,version, i,j, alignMask); // TODO: for decoding this doesn't matter

// index = i*size + j;
index = j*size + i;
			var isInside = false;
			if(!isInside){
				var masking = 0;
				if(mask==0){ // 000
					masking = (i+j)%2 == 0 ? 1 : 0;
				}else if(mask==1){ // 001
					masking = i%2 == 0 ? 1 : 0;
				}else if(mask==2){ // 010
					masking = (j)%3 == 0 ? 1 : 0;
				}else if(mask==3){ // 011
					masking = (i+j)%3 == 0 ? 1 : 0;
				}else if(mask==4){ // 100
					masking = ( ((i/2)|0) + ((j/3)|0) )%2 == 0 ? 1 : 0;
				}else if(mask==5){ // 101
					masking = ((i*j)%2) + ((i*j)%3) == 0 ? 1 : 0;
				}else if(mask==6){ // 110
					masking = ( ((i*j)%2) + ((i*j)%3) )%2 == 0 ? 1 : 0;
				}else if(mask==7){ // 111
					masking = ( ((i*j)%3) + ((i+j)%2) )%2 == 0 ? 1 : 0;
				}else{
					throw "unknown mask: "+mask;
				}
				masking = (masking==0 ? 1 : 0); // a DARK MODULE as the satisfy (true) condition
	mmm[index] = masking;

				// xor
				// var value = dataMatrix[index];
				// if(value==masking){ // reverse xor w/ dark modules
				// 	value = 1;
				// }else{
				// 	value = 0;
				// }

				// REVERSE: REVERSE MODULES WHICH CORRESPOND TO DARK MODULES IN THE MASKING PATTERN
				var value = dataMatrix[index];
				if(masking==0){ //  a dark module is a flip  
					if(value==0){
						value = 1;
					}else{
						value = 0;
					}
				}

				dataMatrix[index] = value;
			}
			//
			++index;
		}
	}

// console.log(mmm);
var img = GLOBALSTAGE.getFloatRGBAsImage(mmm,mmm,mmm, size,size);
var d = new DOImage(img);
d.matrix().scale(10);
d.matrix().translate(0 + 1400 , 500 + 0);
GLOBALSTAGE.addChild(d);
// throw "masked";

	return dataMatrix;
}
QRCode._readDataFromGrid = function(dataMatrix, todoValidAreaMatrix){

	var size = Math.round( Math.sqrt(dataMatrix.length) );
	var version = QRCode._versionFromSize(size);
	console.log("version: "+version+" = "+size+"x"+size);

	// version 7+ are different? version is inside of data ?
	// had error data (H?)

	var info = QRCode._alignmentMask(size,version);
	// console.log(info);
	var mask = info["value"];

var img = GLOBALSTAGE.getFloatRGBAsImage(mask,mask,mask, size,size);
var d = new DOImage(img);
d.matrix().scale(5);
d.matrix().translate(0 + 1400 , 0 + 0);
GLOBALSTAGE.addChild(d);

	// output buffers
	var data = [];
	var formatData = [];
	var versionData = [];
	// read data from bottom right, starting up
	var position = new V2D(size-1,size-1); // index in data matrix
	var bit = 0; // current/next bit to read into codeword
	var codeword = 0x00; // codeword
	var isDirectionUp = true;
	var isBitRight = true;
	var isLeftOfTiming = false;

	var read = Code.newArrayZeros(size*size);
	
	// for(var i=0; i<10; ++i){
	// for(var i=0; i<20; ++i){
	// for(var i=0; i<50; ++i){
	// for(var i=0; i<60; ++i){
	// for(var i=0; i<80; ++i){
	// for(var i=0; i<110; ++i){
	// for(var i=0; i<150; ++i){
	// for(var i=0; i<200; ++i){
	// for(var i=0; i<260; ++i){ // align
	// for(var i=0; i<300; ++i){
	// for(var i=0; i<400; ++i){
	// for(var i=0; i<578; ++i){
	// for(var i=0; i<580; ++i){
	// for(var i=0; i<590; ++i){
	// for(var i=0; i<610; ++i){
	// for(var i=0; i<660; ++i){
	// for(var i=0; i<700; ++i){
	// for(var i=0; i<750; ++i){
	// for(var i=0; i<850; ++i){
	for(var i=0; i<1E99; ++i){
		// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++: "+i+" @ "+position.x+","+position.y);
		var isInside = QRCode._insideFunctionalPattern(size,version, position.x,position.y, mask);
		// console.log("isInside: "+isInside);
		if(!isInside){
			var index = position.y*size + position.x;
read[index] = 1;
			var value = dataMatrix[index];


// var color = 0xFF000000;
var color = 0xFFFF0000;
// var sca = 10.55;

var text = new DOText(""+(7-bit), 11, DOText.FONT_ARIAL, color, DOText.ALIGN_CENTER);
// text.matrix().translate(600,400);

//A
var sca = 11.9;
text.matrix().translate(554,65);
text.matrix().translate(position.x*sca, position.y*sca);

// B
// var sca = 11.1;
// text.matrix().translate(551,45);
// text.matrix().translate(position.x*sca, position.y*sca);


// text.matrix().translate(0*sca, 0*sca);
// text.matrix().translate( (size-1)*sca, (size-1)*sca);
GLOBALSTAGE.addChild(text);

			// console.log("read bit: "+value+"  @ "+position.x+","+position.y+" ... ");
			if(value!=0){
				codeword |= (1 << (7-bit) );
			}
			++bit;
			if(bit>7){ // end of word
				// console.log(codeword);
				// throw "bit end";
				data.push(codeword);
				codeword = 0x00;
				bit = 0;
			}
		}
		// 
		// move cusor
		if(isBitRight){ // move left
			position.x -= 1;
		}else{ // move right & DIR
			position.x += 1;
			if(isDirectionUp){
				position.y -= 1;
			}else{ // down
				position.y += 1;
			}
		}
		// 
		// check bounding
		if(position.y < 0){
			// console.log("moved out of top "+position);
			position.x -= 1; //undo prev
			position.x -= isBitRight ? 2 : 1;
			position.y = 0;
			isBitRight = true;
			isDirectionUp = false;
			// console.log("=> "+position);
			if(!isLeftOfTiming && position.x <=7){
				//move 1 more
				position.x -= 1;
				// console.log("=> "+position);
				// throw "???"
				isLeftOfTiming = true;
			}
			// console.log("=> "+position);
		}else if(position.y >= size){
			// console.log("moved out of bot: "+position);
			// throw "moved out of bottom";
			position.x -= 1; //undo prev
			position.x -= isBitRight ? 2 : 1;
			position.y = size-1;
			isBitRight = true;
			isDirectionUp = true;
		}else if(position.x < 0){
			// console.log("moved out of left"); // done
			// console.log(bit);
			break;
		}else if(position.x >= size){ // never a scenario ?
			throw "moved out of right";
		}else{
			// flip left/right bit grabbing
			isBitRight = !isBitRight;
		}

		// TODO: possibly past left timing pattern ? move left 1 extra pixel
	
		// throw "..."
	}

// throw "eeeeh"

var img = GLOBALSTAGE.getFloatRGBAsImage(read,read,read, size,size);
var d = new DOImage(img);
d.matrix().scale(10);
d.matrix().translate(0 + 2000 , 0 + 0);
GLOBALSTAGE.addChild(d);

	
	console.log(data);

	// throw "...";

	return {"data":data};
}
QRCode._insideFunctionalPattern = function(size,version, x,y, alignmentMask){
	if(version==0){
		throw "micro ?"
	}

	var end7 = size-7-1;
	// finding pattern / spacing:
	if(x<=7 && y<=7){ // top left
		// console.log("inside TL: "+x+","+y);
		return true;
	}else if(x>=end7 && y<=7){ // top right
		// console.log("inside TR: "+x+","+y);
		return true;
	}else if(x<=7 && y>=end7){ // bot left
		// console.log("inside BL: "+x+","+y);
		return true;
	}

	// timing pattern:
	if(x==6 || y==6){ // vertical | horizontal
		// console.log("inside timing: "+x+","+y);
		return true;
	}

	// alignment pattern:
	var index = y*size + x;
	var value = alignmentMask[index];
	if(value!=0){
		// console.log("inside align: "+x+","+y);
		return true;
	}
	// version info
	if( (x==8 && y<=8) || (x<=8 && y==8) ){ // TL
		// console.log("inside version TL: "+x+","+y);
		return true;
	}else if( (x==8 && y>=(size-7-1)) ){ // BL
		// console.log("inside version BL: "+x+","+y);
		return true;
	}else if( (y==8 && x>=(size-7-1)) ){ // TR
		// console.log("inside version TR: "+x+","+y);
		return true;
	}
	// version chunks UR, BL, TR

	if(version>=7){
		if(x<=5 && size-11<=y && y<=size-9){
			// console.log("inside format BL: "+x+","+y);
			return true;
		}else if(y<=5 && size-11<=x && x<=size-9){
			// console.log("inside format TR: "+x+","+y);
			return true;
		}
	}

	return false;
}
QRCode.fromString = function(str, errorCorrectionSetting){
	// decide from modex:


	var table = QRCode.TABLE_ALPHA_NUMERIC;
	var lookup = {};
	for(var i=0; i<table.length; ++i){
		var key = table[i];
		if(key!==""){
			lookup[key] = true;
		}
	}

	var bytes = [];
	var count = str.length;
	var byte = 0x0;
	var byteIndex = 0;
	for(var i=0; i<count; ++i){
		var key = str.charAt(i);
		var exists = lookup[key];
		if(exists){
			// convert to byte & 
			// .
			// separators / segments?
			// .
			// .
			// bytes.push("???");
		}else{
			console.log("char not exist: '"+key+"' ")
		}
	}
	// TODO: append any remaining [subindex > 0]

	return QRCode.fromData(bytes);
}
QRCode.fromData = function(data, errorCorrectionSetting){ // create QR code from data

	// ECI header [non-default?]
		// ECI MODE INDICATOR: [4 bits]
		// ECI DESIGNATOR: [8,16,24 nits]

	// separate into segments?
	// MODE INDICATOR [4 bits]
	// CHARACTER COUNT INDICATOR
	// DATA BIT STREAM

	// 

	// calculate size needed 

	// calculate error correction codes

	// test masks

	// apply mask

	// set version

	// set format

	// 

	throw "fromData";
}
// ------------------------------------------------------------------------
QRCode._BCHCorrect_15_5 = function(value){ // Bose-Chaudhuri-Hocquenghem (15,5)
	var wasArray = true;
	if(!Code.isArray(value)){
		wasArray = false;
		var arr = [];
		var bit = 0x01;
		var v;
		console.log(value);
		for(var i=0; i<15; ++i){
			
			if((bit & value) != 0){
				v = 1;
			}else{
				v = 0;
			}
			// arr.push(v);
			arr.unshift(v);
			bit <<= 1;
		}
		value = arr;
	}
	console.log(value);

	var gf = QRCode._BCHCorrect_GF16();
	console.log(gf);
	// syndrome/decoder
	var syndrome = QRCode._BCHCorrect_syndrome_15_5(value, gf);
	console.log(syndrome);

	// error position
	var errors = QRCode._BCHCorrect_errors_15_5(syndrome,gf);
	// console.log(positions);
	// var errors = QRCode._BCHCorrect_errorLocations(syndrome, gf);
	console.log(errors);

	var positions = QRCode._BCHCorrect_positions_15_5(value, errors);
	console.log(positions);

	// correct
	var count = QRCode._BCHCorrect_correct_15_5(value, positions);
	console.log(count);

	if(!wasArray){
		var bit = 0x01;
		var accumulator = 0x00;
		for(var i=0; i<15; ++i){
			if(value[14-i] != 0){
			// if(value[i] != 0){
				accumulator |= bit;
			}
			bit <<= 1;
		}
		value = accumulator;
		console.log(value);
	}
	return value;
}

QRCode._BCHCorrect_positions_15_5 = function(value, errors, gf){
	var positions = Code.newArrayZeros(4);
	if(errors[0]==-1){
		// no op
	}else if(errors[1]==-1){
		positions[0] = 1;
		positions[1] = errors[0];
	}else{
		var x1, x2, x3, t, t1, t2, hasError;
		for(var i=0; i<15; ++i){
			x1 = (i*1)%15;
			x2 = (i*2)%15;
			x3 = (i*3)%15;
			t = (errors[0] + x2) % 15;
			t1 = QRCode._BCHCorrect_add_15_5(x3, t, gf);
			t = (errors[1] + x1) % 15;
			t2 = QRCode._BCHCorrect_add_15_5(t1, t2, gf);
			hasError = QRCode._BCHCorrect_add_15_5(t1, t2, gf);
			if(hasError){
				positions[0] += 1;
				positions[positions[0]] = i;
			}
		}
	}
	return positions;
}

QRCode._BCHCorrect_correct_15_5 = function(value, positions){
	var count = positions[0];
	for(var i=1; i<=count; ++i){
		var index = positions[i];
		var val = value[index];
		value[index] = (val==0) ? 1 : 0;
	}
	return count;
}

QRCode._BCHCorrect_errors_15_5 = function(syndrome, gf){
	var errors = Code.newArrayZeros(4);

	// sigma A
	errors[0] = syndrome[0];

	// sigma B
	var t = (syndrome[0] + syndrome[1]) % 15;
	var parent = QRCode._BCHCorrect_add_15_5(syndrome[2], t, gf);
		parent = (parent>=15) ? -1 : parent;
	t = (syndrome[1] + syndrome[2]) % 15;
	var child = QRCode._BCHCorrect_add_15_5(syndrome[4], t, gf);
		child = (child>=15) ? -1 : child;
	errors[1] = (child<0 && parent<0) ? -1 : (child-parent + 15)%15;

	// sigma C
	t = (errors[0] + syndrome[1]) % 15;
	var u = QRCode._BCHCorrect_add_15_5(syndrome[2], t, gf);
	t = (syndrome[0] + errors[1]) % 15;
	var result = QRCode._BCHCorrect_add_15_5(u, t, gf);
	errors[2] = (result>=15) ? -1 : result;

	return errors;
}

QRCode._BCHCorrect_add_15_5 = function(a,b, gf){
	var p = Code.newArrayZeros(4);
	for(var i=0; i<4; ++i){
		var w1 = (a<0 || a>=15) ? 0 : gf[a][i];
		var w2 = (b<0 || b>=15) ? 0 : gf[b][i];
		p[i] = (w1 + w2) % 2;
	}
	return QRCode._BCHCorrect_elementExists(p, gf);
}

QRCode._BCHCorrect_syndrome_15_5 = function(input, gf){
	var syndrome = Code.newArrayZeros(5);
	var p = Code.newArrayZeros(4);
	// A
	for(var i=0; i<15; ++i){
		if(input[i]==1){
			for(var j=0; j<4; ++j){
				p[j] = (p[j] + gf[i][j]) % 2;
			}
		}
	}
	var index = QRCode._BCHCorrect_elementExists(p, gf);
	syndrome[0] = (index>=15) ? -1 : index;

	// B
	for(var i=0; i<4; ++i){ p[i] = 0; }
	for(var i=0; i<15; ++i){
		if(input[i]==1){
			for(var j=0; j<4; ++j){
				p[j] = (p[j] + gf[(i*3) % 15][j]) % 2;
			}
		}
	}
	var index = QRCode._BCHCorrect_elementExists(p, gf);
	syndrome[2] = (index>=15) ? -1 : index;

	// C
	for(var i=0; i<4; ++i){ p[i] = 0; }
	for(var i=0; i<15; ++i){
		if(input[i]==1){
			for(var j=0; j<4; ++j){
				p[j] = (p[j] + gf[(i*5) % 15][j]) % 2;
			}
		}
	}
	var index = QRCode._BCHCorrect_elementExists(p, gf);
	syndrome[4] = (index>=15) ? -1 : index;

	// TODO: 1 or -1 ?

	return syndrome;
}

QRCode._BCHCorrect_GF16 = function(){ // GF(2^4) = GF(16) = polynomial 0-15
	var seed = [1,1,0,0];
	var gf = Code.newArrayNulls(16);
	// all zeros
	for(var i=0; i<16; ++i){
		gf[i] = Code.newArrayZeros(4);
	}
	// identity
	for(var i=0; i<4; ++i){
		gf[i][i] = 1.0;
	}
	// seed
	for(var i=0; i<4; ++i){
		gf[4][i] = seed[i];
	}
	// fill
	for(var i=5; i<16; ++i){
		for(var j=1; j<4; ++j){
			gf[i][j] = gf[i-1][j-1];
		}
		if(gf[i-1][3] == 1){
			for(var j=0; j<4; ++j){
				gf[i][j] = (gf[i][j] + seed[j]) % 2;
			}
		}
	}

	return gf;
}

QRCode._BCHCorrect_elementExists = function(v, gf){
	var i = 0;
	for(; i<15; ++i){
		if( v[0]==gf[i][0] && v[1]==gf[i][1] && v[2]==gf[i][2] && v[3]==gf[i][3] ){
			return i;
		}
	}
	return i; // 15
}

QRCode._ReedSolomon_ = function(value){ // GF(2^8) = GF(16)
	// 
}



QRCode.prototype.x = function(){
	// 
}

QRCode.prototype.x = function(){
	// 
}


// DEFAULT ECI: 0x0020 = JIS8 & SHIFT+JIS character sets

QRCode.MODE_INDICATOR_ECI = 0x7; // extended channel interpretation mode : 
QRCode.MODE_INDICATOR_NUMERIC = 0x1; // 0-9 [0x30-0x39 @ 3 characters per 10 bits]
QRCode.MODE_INDICATOR_ALPHANUMERIC = 0x2; // [45 characters 2 characters per 11 bits]
QRCode.MODE_INDICATOR_BYTE = 0x4; // LATIN/KANA char set - JUS X 0201 chars 0x00-0xFF [1 character per 8 bits]
QRCode.MODE_INDICATOR_KANJI = 0x8; // JIS X 0208 [2 chars per 13 bits
// MIXING MODE]
// QRCode.MODE_INDICATOR_??? = 0x1;
QRCode.MODE_INDICATOR_APPEND = 0x3; // structure append = use multiple QR codes
// FNC1 ???
QRCode.MODE_INDICATOR_FNC1_FIRST = 0x5;
QRCode.MODE_INDICATOR_FNC1_SECOND = 0x9;
QRCode.MODE_INDICATOR_TERMINATOR = 0x000;

QRCode.MODE_INDICATOR_EXTENDED_CHANNEL_INTERPRETATION = 0x07;


// LENGTHS OF CHARACTERS:
QRCode.MODE_NUMERIC_COUNT_01_09 = 10;
QRCode.MODE_NUMERIC_COUNT_10_26 = 12;
QRCode.MODE_NUMERIC_COUNT_27_40 = 14;

QRCode.MODE_ALPHANUMERIC_COUNT_01_09 = 9;
QRCode.MODE_ALPHANUMERIC_COUNT_10_26 = 11;
QRCode.MODE_ALPHANUMERIC_COUNT_27_40 = 13;

QRCode.MODE_BYTE_COUNT_01_09 = 8;
QRCode.MODE_BYTE_COUNT_10_26 = 16;
QRCode.MODE_BYTE_COUNT_27_40 = 16;

QRCode.MODE_KANJI_COUNT_01_09 = 8;
QRCode.MODE_KANJI_COUNT_10_26 = 10;
QRCode.MODE_KANJI_COUNT_27_40 = 12;

QRCode.ECL_L = 0x01; // 7%
QRCode.ECL_M = 0x00; // 15%
QRCode.ECL_Q = 0x03; // 25%
QRCode.ECL_H = 0x02; // 30%

QRCode.TABLE_ALPHA_NUMERIC = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":", "","","","","",""]; // 6 unused characters



QRCode._alignmentPatternLocationsTest = function(){
	
var table = [];
	table.push([]); // 0
	table.push([]); // 1
	table.push([6,18]);
	table.push([6,22]);
	table.push([6,26]);
	table.push([6,30]);
	table.push([6,34]);
	table.push([6,22,38]); // 7
	table.push([6,24,42]);
	table.push([6,26,46]);
	table.push([6,28,50]);
	table.push([6,30,54]);
	table.push([6,32,58]);
	table.push([6,34,62]);
	table.push([6,26,46,66]); // 14
	table.push([6,26,48,70]);
	table.push([6,26,50,74]);
	table.push([6,30,54,78]);
	table.push([6,30,56,82]);
	table.push([6,30,58,86]);
	table.push([6,34,62,90]);
	table.push([6,28,50,72,94]); // 21
	table.push([6,26,50,74,98]);
	table.push([6,30,54,78,102]);
	table.push([6,28,54,80,106]);
	table.push([6,32,58,84,110]);
	table.push([6,30,58,86,114]);
	table.push([6,34,62,90,118]);
	table.push([6,26,50,74,98,122]); // 28
	table.push([6,30,54,78,102,126]);
	table.push([6,26,52,78,104,130]);
	table.push([6,30,56,82,108,134]);
	table.push([6,34,60,86,112,138]);
	table.push([6,30,58,86,114,142]);
	table.push([6,34,62,90,118,146]);
	table.push([6,30,54,78,102,126,150]); // 35
	table.push([6,24,50,76,102,128,154]);
	table.push([6,28,54,80,106,132,158]);
	table.push([6,32,58,84,110,136,162]);
	table.push([6,26,54,82,110,138,166]);
	table.push([6,30,58,86,114,142,170]); // 40

	// TEST

	for(var v=0; v<=40; ++v){
		var version = v;
		var size = QRCode._sizeFromVersion(version);
		var locations = QRCode._alignmentPatternLocations(size,version);
		console.log(locations);
		var list = table[v];
		if(list.length!=locations.length){
			console.log(list);
			throw "mismatch dimension";
		}
		for(var i=0; i<list.length; ++i){
			if(list[i]!=locations[i]){
				console.log(list);
				throw "mismatch value";
			}
		}
	}

	throw "testing completed"
}


QRCode._bitCapacityTest = function(){
	var list = [];
		list.push( [0, 0, 0] ); // 0
		list.push( [208, 26, 0] ); // 1
		list.push( [359, 44, 7] ); // 2
		list.push( [567, 70, 7] );
		list.push( [807, 100, 7] );
		list.push( [1079, 134, 7] );
		list.push( [1383, 172, 7] ); // 6

		list.push( [1568, 196, 0] ); // 7
		list.push( [1936, 242, 0] );
		list.push( [2336, 292, 0] );
		list.push( [2768, 346, 0] ); // 10
		list.push( [3232, 404, 0] ); 
		list.push( [3728, 466, 0] ); 
		list.push( [4256, 532, 0] );
		list.push( [4651, 581, 3] ); // 14
		list.push( [5243, 655, 3] );
		list.push( [5867, 733, 3] );
		list.push( [6523, 815, 3] ); // 17
		list.push( [7211, 901, 3] );
		list.push( [7931, 991, 3] );
		list.push( [8683, 1085, 3] ); // 20
		list.push( [9252, 1156, 4] ); // 21
		list.push( [10068, 1258, 4] );
		list.push( [10916, 1364, 4] );
		list.push( [11796, 1474, 4] );
		list.push( [12708, 1588, 4] );
		list.push( [13652, 1706, 4] );
		list.push( [14628, 1828, 4] ); // 27
		list.push( [15371, 1921, 3] ); // 28
		list.push( [16411, 2051, 3] );
		list.push( [17483, 2185, 3] );
		list.push( [18587, 2323, 3] );
		list.push( [19723, 2465, 3] );
		list.push( [20891, 2611, 3] );
		list.push( [22091, 2761, 3] ); // 34
		list.push( [23008, 2876, 0] ); // 35
		list.push( [24272, 3034, 0] );
		list.push( [25568, 3196, 0] );
		list.push( [26896, 3362, 0] );
		list.push( [28256, 3532, 0] );
		list.push( [29648, 3706, 0] ); // 40
		
	
	// skip micro ...

	for(var i=1; i<=40; ++i){
		var item = list[i];
		var info = QRCode.bitCapacityFromVersion(i);
		// var info = QRCode.bitCapacityFromSize(size);
		// console.log(info);
		var bits = info["bits"];
		var bytes = info["bytes"];
		var rem = info["remainder"];
		if(item[0]!==bits || item[1]!==bytes || item[2]!==rem){
			console.log(info);
			throw "wrong size @ "+i;
		}
	}

}


/*

ECI
	- assignmet number?
	- 
numeric
	- divide into groups of 3 digits
	- 
alpha
	- 
	- 
byte
	- 
	- 
kanji
	- ?
mixing
	- ?
	- FNC1

0000 terminator OR if number of bits left is < 3 then assumed (reader ignores last 1-3 bits
)


















*/























// ...

