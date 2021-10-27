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


var img = GLOBALSTAGE.getFloatRGBAsImage(gray,gray,gray, wid,hei);
var d = new DOImage(img);
// d.matrix().scale(10.0);
d.matrix().translate(OFFX + 500 + 0, OFFY + 0);
GLOBALSTAGE.addChild(d);


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

QRCode.fromGrid = function(dataMatrix, size){ // QR data matrix -> data
	// sizes: 21 (v1) - 177 (v40) @ increments of 4
	console.log(dataMatrix);
	console.log(dataMatrix.length);
	console.log(Math.sqrt(dataMatrix.length));
	var count = Math.round( Math.sqrt(dataMatrix.length) );
	var size = count;
	var version = (count-17) / 4;
	console.log(count+" = v "+version);

	// version 7+ are different? version is inside of data ?
	// had error data (H?)


	QRCode._alignmentMask(size,version);


throw "..."

	// extract the data from the matrix

	// start from bottom right, up & down
	// account for finder patterns & alignment patterns & timing patterns[functional]
	var x = size-1;
	var y = size-1;
	for(var i=0; i<1000; ++i){
		QRCode._insideFunctionalPattern(size,version, x,y);
	}

	// format: 15-bit sequence: 5 data (ECL[2] mask[3]) | 10 error correction (BCH)
	// error correction level indicators: L:01 M:00 Q:11 H:10
	// mask pattern

	// read thru data:
	// ECI Mode (4) | ECI Designator (8,16,24) | Mode Indicator (4) | Char Count Indicator | Data bit stream


	throw "fromGrid";
}

QRCode._versonFromSize = function(size){
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
	}else if(size<=0){ // 21-27 	101-? 		22 [25(5)]
		return 5;
	}else if(size<=0){ // 28-34     ?-? 		33 [36(6)]
		return 6;
	}else if(size<=177){ // 35-40   -177 	46 [49(7)]
		return 7;
	}
	throw "?"
}
QRCode._alignmentMask = function(size,version){


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






// TEST:
// size = QRCode._sizeFromVersion(1);
// size = QRCode._sizeFromVersion(2);
// size = QRCode._sizeFromVersion(6);
// size = QRCode._sizeFromVersion(7);
// size = QRCode._sizeFromVersion(11);
// size = QRCode._sizeFromVersion(13);
// size = QRCode._sizeFromVersion(14);
// size = QRCode._sizeFromVersion(20);
// size = QRCode._sizeFromVersion(21);
// size = QRCode._sizeFromVersion(22);
// size = QRCode._sizeFromVersion(27);
// size = QRCode._sizeFromVersion(28); // X
// size = QRCode._sizeFromVersion(29);
// size = QRCode._sizeFromVersion(34);
// size = QRCode._sizeFromVersion(35);
// size = QRCode._sizeFromVersion(39); // X
// size = QRCode._sizeFromVersion(40); // X
version = null;




	if(!version){
		version = QRCode._versonFromSize(size);
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
	console.log(locations);



	throw "..."

	for(var j=0; j<locations.length; ++j){
		var locY = locations[j];
		for(var i=0; i<locations.length; ++i){
			var locX = locations[i];
			var isCorner = (locX<=6 && locY<=6) || (locX<=6 && locY>=(size-6-1))  || (locX>=(size-6-1) && locY<=6);
			if(!isCorner){
				// centers.push( center );
				for(var y=-2; y<=2; ++y){
					for(var x=-2; x<=2; ++x){
						var index = (locY+y)*size + locX+x;
						mask[index] = 1;
					}
				}
			}
		}
	}


var img = GLOBALSTAGE.getFloatRGBAsImage(mask,mask,mask, size,size);
var d = new DOImage(img);
d.matrix().scale(5);
d.matrix().translate(0 + 1400 , 0 + 0);
GLOBALSTAGE.addChild(d);



	throw "?"
	// var centers = [];
	/*
	know bottom right (4 corners)
	then divide the interrior by the count
for(var i=0; i<=40; ++i){
	console.log(i+": "+( (i/7)|0 ));
}

	*/
	for(var j=0; j<count; ++j){
		for(var i=0; i<count; ++i){
			var center = new V2D();
			if(true){
				// centers.push( center );
				for(var y=-2; y<=2; ++y){
					for(var x=-2; x<=2; ++x){
						var index = (j+y)*size + i+x;
						mask[index] = 1;
					}
				}
			}
		}
	}
	// console.log(centers);




	throw "..."
	return {"value":mask, "size":size};
}

QRCode._alignmentPatternLocations = function(size,version){
	var count = (version+7)/7 | 0;
		count = count + 1;
	if(version<=1){
		count = 0;
	}
	// ((i+7)/7)|0
	console.log(" version: "+version);
	console.log(" count: "+count);

	var interior = size - 6 - 7;
	var divisions = count-1;
	var preSpace = interior/divisions;
	// var spacing = Math.ceil(preSpace);
	var spacing = Math.round(preSpace);
	if(spacing%2==1){
		spacing += 1;
	}
	var remainder = interior - (divisions-1)*spacing; // spacing after timing location


	console.log(" size: "+size);
	console.log(" interior: "+interior);
	console.log(" spacing: "+spacing+" ("+preSpace+")");
	console.log(" remainder: "+remainder);
	console.log(" ............. ");
	console.log(" divisions: "+divisions);
	var blankSpace = interior - ((count-1)*4);
	var split = (blankSpace/divisions)  + 4;

	console.log(" blankSpace: "+blankSpace);
	console.log(" split: "+split);


//  #7: 16 + 16
//  #8: 18 + 18
// #10  22 + 22
// #13: 28 + 28
// #14: 20 + 20 ...
// #15: 20 + 22 ... <
// #20: 28 + 28 ...
// #22: 20 + 24 ... <
// #28: 20 + 24 ... <
// #32: 28 + 26 ...
// #33: 24 + 28 ... <
// #39: 20 + 28 ... <
// #40: 24 + 28 ... <

	var locations = [];
	for(var i=0; i<count; ++i){
		// var percent = (i/(count-1));

		var location = null;
		if(i==0){ // first
			location = 6;
		}else if(i==count-1){ // last
			location = size - 7;
		}else{
			location = (i-1)*spacing + remainder + 6;
		}

		// var location = null;
		// if(percent<0.5){
		// 	location = Math.floor( percent*interior ) + 6;
		// }else{
		// 	location = Math.ceil( percent*interior ) + 6;
		// }

		//var location = Math.round( percent*interior ) + 6; // mostly correct
		// if(location%2==1){
		// 	location -= 1; // ?
		// }
		// var location = Math.floor( percent*interior ) + 6;
		// var location = Math.round( percent*(size-1) ); // wrong
		// console.log("loc: "+location);
		locations.push(location);
	}
	return locations;
}
/*
	-----
	0	15	*
	1	21
	2	25
	3	29
	4	33
	5	37
	6	41
	7	45
	...
	10	?
	14 73
	...
	20	?
	...
	38	169
	39	173
	40	177

for(var i=0; i<=40; ++i){
	console.log(i+": "+(i*4 + 17));
}
*/
QRCode._insideFunctionalPattern = function(size,version, x,y){
	// finding pattern:


	// timing pattern:


	// alignment pattern:

		// how to derive ?

	if(version>=7){
		// version chunks UR, BL

		// format?

		// ...
	}

	return false;
}
QRCode.fromData = function(data){ // create QR code from data
	// 

	throw "fromData";
}
// ------------------------------------------------------------------------
QRCode.prototype.x = function(){
	// 
}

QRCode.prototype.x = function(){
	// 
}

QRCode.prototype.x = function(){
	// 
}

QRCode.prototype.x = function(){
	// 
}

QRCode.prototype.x = function(){
	// 
}

/*





















*/























// ...

