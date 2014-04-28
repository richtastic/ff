// Link3DR.js
function Link3DR(){
	this._A = null; // view A
	this._B = null; // view B
	this._F_AtoB = null; // points from A to lines in B
	this._F_BtoA = null; // points from B to lines in A
	this._extrinsic_AtoB = null; // camera pose B relative to A
	this._extrinsic_BtoA = null; // camera pose A relative to B
	this._epipoleA = null; // 
	this._epipoleB = null; // 
	this._lookupTableA = null;
	this._lookupTableB = null;
}
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
Link3DR.prototype.A = function(a){
	if(a!==undefined){
		this._A = a;
	}
	return this._A;
}
Link3DR.prototype.B = function(b){
	if(b!==undefined){
		this._B = b;
	}
	return this._B;
}
Link3DR.prototype.FA = function(){
	return this._F_AtoB;
}
Link3DR.prototype.FB = function(){
	return this._F_BtoA;
}
Link3DR.prototype.epipoleA = function(){
	return new V2D(this._epipoleA.x,this._epipoleA.y);
}
Link3DR.prototype.epipoleB = function(){
	return new V2D(this._epipoleB.x,this._epipoleB.y);
}
Link3DR.prototype.epipoleAImage = function(){
	return new V2D(this._epipoleA.x*this._A.source().width(),this._epipoleA.y*this._A.source().height());
}
Link3DR.prototype.epipoleBImage = function(){
	return new V2D(this._epipoleB.x*this._B.source().width(),this._epipoleB.y*this._B.source().height());
}
// ------------------------------------------------------------------------------------------------------------------------ 
Link3DR.prototype.bundleAdjust = function(b){
	// actual bundle adjust goes here
	var ret;
	// normalize input points
	inputPoints = [this._A.putativePoints(), this._B.putativePoints()];
	ret = R3D.calculateNormalizedPoints(inputPoints);
	var normalizedInputPoints = ret.normalized;
	var forwardTransforms = ret.forward;
	var reverseTransforms = ret.reverse;
	// RANSAC
		// ...
	// fundamental matrix
	var F = R3D.fundamentalMatrix(normalizedInputPoints[0],normalizedInputPoints[1]);
	F = Matrix.mult(F,forwardTransforms[0]); // a normalized
	F = Matrix.mult(Matrix.transpose(forwardTransforms[1]),F); // b denormalized
	var Finv = Matrix.transpose(F);
	var epipoles = R3D.getEpipolesFromF(F);
	// copy
	this._epipoleA = epipoles.A;
	this._epipoleB = epipoles.B;
	this._F_AtoB = F;
	this._F_BtoA = Finv;
	this._A.resolvedPoints(this._A.putativePoints());
	this._B.resolvedPoints(this._B.putativePoints());

	epipoles = R3D.getEpipolesFromF(this._F_AtoB);
	this._epipoleA = epipoles.A;
	this._epipoleB = epipoles.B;
}
// ------------------------------------------------------------------------------------------------------------------------ OPS
Link3DR.prototype.searchLineInBFromPointInA = function(point){
	return Link3DR.searchLineFromPoint(this._F_AtoB,point);
}
Link3DR.prototype.searchLineInAFromPointInB = function(point){
	return Link3DR.searchLineFromPoint(this._F_BtoA,point);
}
Link3DR.searchLineFromPoint = function(F, point){
// should handle epipole-in-image half lines ...
	var line, l1, l2, intA, intB, list = [];
	line = F.multV3DtoV3D(new V3D(), point); // if .z==undefined || null || 0 ... assume 2D multiplication
	if(line.x==0.0 && line.y==0.0){
		return null;
	}
	var TL = new V2D(0,0);
	var TR = new V2D(1.0,0);
	var BR = new V2D(1.0,1.0);
	var BL = new V2D(0,1.0);
	if( Math.abs(line.x) > Math.abs(line.y) ){ // more vertical
		l1 = new V2D( -line.z/line.x, 0.0);
		l2 = new V2D( (-1.0*line.y-line.z)/line.x, 1.0);
		intA = Code.lineSegIntersect2D(l1,l2, TL,BL);
		intB = Code.lineSegIntersect2D(l1,l2, TR,BR);
		if(intA){ intA = new V2D(intA.x,intA.y); }
		if(intB){ intB = new V2D(intB.x,intB.y); }
		if(intA && intB){
			list.push( intA ); list.push( intB );
		}else{
			if(0<l1.x && l1.x<1.0){ list.push(l1); }
			if(intA){ list.push( intA ); }
			if(intB){ list.push( intB ); }
			if(0<l2.x && l2.x<1.0){ list.push(l2); }
		}
	}else{ // more horizontal
		l1 = new V2D( 0.0,-line.z/line.y);
		l2 = new V2D( 1.0,(-1.0*line.x-line.z)/line.y);
		intA = Code.lineSegIntersect2D(l1,l2, TL,TR);
		intB = Code.lineSegIntersect2D(l1,l2, BL,BR);
		if(intA){ intA = new V2D(intA.x,intA.y); }
		if(intB){ intB = new V2D(intB.x,intB.y); }
		if(intA && intB){
			list.push( intA ); list.push( intB );
		}else{
			if(0<l1.y && l1.y<1.0){ list.push(l1); }
			if(intA){ list.push( intA ); }
			if(intB){ list.push( intB ); }
			if(0<l2.y && l2.y<1.0){ list.push(l2); }
		}
	}
	return list; // this list is not ordered - distance requires width/height/ratio known
}
// ------------------------------------------------------------------------------------------------------------------------ OPS
Link3DR.prototype.searchThetaRadiusInBFromPointInA = function(point){
	return this.searchThetaRadiusFromPoint(this._F_AtoB,this._epipoleB,this._B.width(),this._B.height(),point);
}
Link3DR.prototype.searchThetaRadiusInAFromPointInB = function(point){
	return this.searchThetaRadiusFromPoint(this._F_BtoA,this._epipoleA,this._A.width(),this._A.height(),point);
}
Link3DR.prototype.searchThetaRadiusFromPoint = function(F,epi,width,height,point){ // width/height ratio necessary
	var angle, dir, line, epipole = new V2D().copy(epi);
	line = Link3DR.searchLineFromPoint(F, point);
	line[0].x *= width; line[0].y *= height;
	line[1].x *= width; line[1].y *= height;
	epipole.x *= width; epipole.y *= height;
	if(V2D.distance(line[0],epipole)>V2D.distance(line[1],epipole)){
		dir = V2D.diff(line[0],line[1]);
	}else{
		dir = V2D.diff(line[1],line[0]);
	}
	var r0 = V2D.distance(line[0],epipole);
	var r1 = V2D.distance(line[1],epipole);
	dir.norm();
	angle = V2D.angleDirection(dir,V2D.DIRX);
	return {angle:angle, radiusMin:Math.min(r0,r1), radiusMax:Math.max(r0,r1)};
}
Link3DR.prototype.rectify = function(){
	// var epipoleA = null;
	// this._rectificationA = this._A.getRectification(epipoleA);
	// this._rectificationB = this._B.getRectification(epipoleB);
}
// ------------------------------------------------------------------------------------------------------------------------ 
Link3DR.prototype.getImageLineAWithPointBImageCoords = function(point, winHei){ 
	var normPoint = new V3D().copy(point);
	normPoint.x /= this._B.source().width();
	normPoint.y /= this._B.source().height();
	return this.getImageLineAWithPointB(normPoint,winHei);
}
Link3DR.prototype.getImageLineAWithPointB = function(point, winHei){ 
	return Link3DR.getImageLineWithPoint(this._F_BtoA,this._epipoleA,point,this._A.source(), winHei);
}
Link3DR.prototype.getImageLineBWithPointAImageCoords = function(point, winHei){ 
	var normPoint = new V3D().copy(point);
	normPoint.x /= this._A.source().width();
	normPoint.y /= this._A.source().height();
	return this.getImageLineBWithPointA(normPoint,winHei);
}
Link3DR.prototype.getImageLineBWithPointA = function(point, winHei){ 
	return Link3DR.getImageLineWithPoint(this._F_AtoB,this._epipoleB,point,this._B.source(), winHei);
}
Link3DR.prototype.getImagePointEpipoleFromA = function(point, winWid,winHei){
	return Link3DR.getImageLineWithPoint(null,this._epipoleA,point,this._A.source(), winHei,winWid);
}
Link3DR.prototype.getImagePointEpipoleFromB = function(point, winWid,winHei){
	return Link3DR.getImageLineWithPoint(null,this._epipoleB,point,this._B.source(), winHei,winWid);
}
Link3DR.getImageLineWithPoint = function(F,epipole, point,image, winHei, winWid){ // non-rectification image line
	winHei = winHei!==undefined?winHei:11;
	var aX,aY, bX,bY, cX,cY, dX,dY, ort = new V2D();
	var pointGrab = winWid!==undefined; // with winWid set, 
	var intersections, newImage, winWid, intA, intB, dir, ort, len;
	epipole = new V2D(epipole.x*image.width(), epipole.y*image.height() );
	// find intersection with image
	if(pointGrab){
		dir = V2D.diff(point,epipole);
		V2D.rotate(ort,dir,-Math.PIO2);
		dir.setLength(winHei*0.5);
		ort.setLength(winWid*0.5);
		aX = point.x + ort.x - dir.x;
		aY = point.y + ort.y - dir.y;
		bX = point.x + ort.x + dir.x;
		bY = point.y + ort.y + dir.y;
		cX = point.x - ort.x + dir.x;
		cY = point.y - ort.y + dir.y;
		dX = point.x - ort.x - dir.x;
		dY = point.y - ort.y - dir.y;
		intA = intB = new V2D().copy(point);
	}else{
		intersections = Link3DR.searchLineFromPoint(F, point);
		intA = intersections[0]; intB = intersections[1];
		intA.x *= image.width(); intA.y *= image.height();
		intB.x *= image.width(); intB.y *= image.height();
		if( V2D.distance(intA,epipole) > V2D.distance(intB,epipole) ){
			intA = intersections[1]; intB = intersections[0];
		}
		//console.log(intA.toString()+"  "+intB.toString()+"        "+epipole.toString())
		//console.log(V2D.distance(intA,epipole) , V2D.distance(intB,epipole))
		dir = V2D.diff(intB,intA);
		len = dir.length();
		winWid = Math.ceil( len );
		dir.setLength(winWid-len);
		intB.add(dir);
		intA.sub(dir);
		// orthogonal
		dir = V2D.diff(intB,intA);
		dir.setLength(winHei*0.5);
		V2D.rotate(ort,dir,-Math.PIO2);
		aX = intA.x + ort.x;
		aY = intA.y + ort.y;
		bX = intB.x + ort.x;
		bY = intB.y + ort.y;
		cX = intB.x - ort.x;
		cY = intB.y - ort.y;
		dX = intA.x - ort.x;
		dY = intA.y - ort.y;
	}
	// extract rectangle from source
	newImage = ImageMat.extractRect(image, aX,aY,bX,bY,cX,cY,dX,dY, winWid,winHei);
	return {image:newImage, TL:new V2D(aX,aY), TR:new V2D(aX,aY), BR:new V2D(aX,aY), BL:new V2D(aX,aY), intersectionA:intA, intersectionB:intB, width:winWid, height:winHei};
}
// ------------------------------------------------------------------------------------------------------------------------ 
Link3DR.getLookupTableFromRectification = function(rect){
	var data = R3D.monotonicAngleArray(rect.angles);
	rect.minAngle = data.min;
	rect.maxAngle = data.max;
	rect.increasing = data.increasing;
	rect.image = new ImageMat(rect.width,rect.height);
	rect.image.setFromFloats(rect.red,rect.grn,rect.blu);
	rect.red = null; rect.grn = null; rect.blu = null;
	delete rect.red; delete rect.grn; delete rect.blu;
	//{red:rectifiedR, grn:rectifiedG, blu:rectifiedB, width:radiusCount, height:thetaCount, angles:angleTable, radiusMin:radiusMin, radiusMax:radiusMax};
	//{max:max, min:min, angles:angles, increasing:(angles[0]<angles[1])};
	return rect; // already has angles array
}
Link3DR.prototype.calculateRectificationTables = function(){
	var rect, epipoles = R3D.getEpipolesFromF(this._F_AtoB);
	// A
	rect = this._A.getRectification(epipoles.A);
	this._lookupTableA = Link3DR.getLookupTableFromRectification(rect);
	// B
	rect = this._B.getRectification(epipoles.B);
	this._lookupTableB = Link3DR.getLookupTableFromRectification(rect);
	

	// angle = R3D.angleInLimits(angle,angleTable.min,angleTable.max);
	// var index;
	// if(thetas[0]<thetas[1]){ // console.log("INCREASING");
	// 	index = Code.binarySearchArray(thetas,Code.binarySearchArrayFloatIncreasing, angle);
	// }else{ // console.log("DECREASING");
	// 	index = Code.binarySearchArray(thetas,Code.binarySearchArrayFloatDecreasing, angle);
	// }
	
}
Link3DR.rectificationAngleIndex = function(rect, angle){
	angle = R3D.angleInLimits(angle,rect.minAngle,rect.maxAngle);
	var index;
	if(rect.increasing){
		index = Code.binarySearchArray(rect.angles,Code.binarySearchArrayFloatIncreasing, angle);
	}else{
		index = Code.binarySearchArray(rect.angles,Code.binarySearchArrayFloatDecreasing, angle);
	}
	if(index.length==1){ // exact match (lolz)
		index = index[0];
	}else{ // interpolate to exact line (probly not necessary)
		index = Code.linear1D(Code.linear1DRatio(angle,rect.angles[index[0]],rect.angles[index[1]]),index[0],index[1]);
	}
	return index;
}
Link3DR.prototype.rectificationA = function(){
	return this._lookupTableA;
}
Link3DR.prototype.rectificationB = function(){
	return this._lookupTableB;
}
// ------------------------------------------------------------------------------------------------------------------------ 
Link3DR.prototype.calculateDisparity = function(){ // dense point matching (correspondence)
	// 
	// disparity: vector distance from expected location of a point (via reference origin)
	// 
	// each pair of CALCULATED lines:
		// find major edge points in A -> ssd match in B
		// find major edge points in B -> ssd match in A
			// RESULT: line-anchor-ordering-match
				// using this ordering-pinned-constraint, find best 
/*
system
structure
alignment
layout
line-order
arrangement, sequence
graph

positioning

point-line

matching
*/

// start with smaller image (with stricter ssd?)
// zoomed-in searching is restricted to smaller area
// use different window sizes? (when cannot find a match / )
// look at discarding non-texture (flat) search needles

var imagesA = [], imagesB = [], linesA = [], linesB = [], matches = [], subs,match;
	var matcher;
	var i, j, point, pointA, pointB, info, needle, haystack, haystackA, haystackB, infoA, infoB, intA1, intA2, intB1, intB2, windowSize = 25, searchSize = 35;
	var hayWid, hayHei, hayHei2, hayHeiMin, hayHeiMax, winSize2 = Math.floor(windowSize*0.5);
var maxSSD = searchSize*0.666;// *0.707; // maximum discrpency per pixel
// between 0.5 && 0.707
//maxSSD = Math.pow(maxSSD,3);
	// GET EVERYTHING IN IMAGE-COORDINATES
	var pointListA = this._A.resolvedPointsImageCoords();
	var pointListB = this._B.resolvedPointsImageCoords();
	var epipoleA = this.epipoleAImage();
	var epipoleB = this.epipoleBImage();
	var sourceA = this.A().source();
	var sourceB = this.B().source();
	for(i=0;i<pointListA.length;++i){
		pointA = pointListA[i];
		// needle - A
		info = this.getImagePointEpipoleFromA(pointA, windowSize,windowSize);
		needle = info.image;
imagesA.push(needle.to3Array());
		// haystack - B
		info = this.getImageLineBWithPointAImageCoords(pointA, searchSize);
		intB1 = info.intersectionA;
		intB2 = info.intersectionB;
linesB.push(info.image.to3Array());
		haystack = info.image;
		haystackB = info.image;
		infoB = info;
		// point - B
		point = Link3DR.bestMatchNeedleHaystack(needle,haystack);
		pointB = Link3DR.fromHayStackToImage(point,haystack, intB1,intB2, info.TL,info.TR,info.BR,info.BL);
		pointB = new V3D(pointB.x,pointB.y,1.0);
imagesB.push(needle.to3Array());
		// line - A
		info = this.getImageLineAWithPointBImageCoords(pointB, searchSize);
		intA1 = info.intersectionA;
		intA2 = info.intersectionB;
		haystackA = info.image;
		infoA = info;
linesA.push(info.image.to3Array());
subs = [];
matches.push(subs);
		// for each point in A - find match in B
		hayWid = haystackA.width();
		hayHei = haystackA.height();
		hayHei2 = Math.floor(hayHei*0.5);
		hayHeiMin = hayHei2 - winSize2;
		hayHeiMax = hayHei2 + winSize2;
		for(j=winSize2;j<hayWid-winSize2;j+=10){
			needle = haystackA.getSubImageIndex(j-winSize2,j+winSize2, hayHeiMin,hayHeiMax);
			//console.log(needle)
			point = Link3DR.bestMatchNeedleHaystack(needle,haystackB);
			//console.log(point.z);
			//point = Link3DR.fromHayStackToImage(point,haystackB, intB1,intB2, infoB.TL,infoB.TR,infoB.BR,info.BL);
			var n = haystackB.getSubImage(point.x,point.y, windowSize,windowSize);
			if(point.z > maxSSD ){ // ssd limits
				Code.setArrayConstant( n.red(), 1.0 );
				subs.push([needle.to3Array(),n.to3Array()]); // show as bad match
				//subs.push([needle.to3Array(),null]);
			}else{
				subs.push([needle.to3Array(),n.to3Array()]);
			}
			// DISPARITY?
			// ?
			// ?
		}
		//console.log("   ");
		// //
		// search along each line for good point matches
		// // 
		// match all other points along opposite line
		//matcher = new DualOrder();
		// construct restriction-model
		// // 
		// fill in point gaps
		// //for(j=0;j<pointListB.length;++j){
		// 	//
		// //}
	}
	// 
	// search in-between (NON-CALCULATED) lines?
		// move away from known line 'pixel' at a time up to median line (or edge/end)
	// 
	// 
	// local disparity assumes beginning of line (A) is zero of axis
	// global disparity assumes some radius R from epipole is zero of axis ? (or THE EPIPOLE if inside picture?)
	// 

	// OUTPUT: mapping between each pixel in each image, (with disparity ?)
	// 		LIST: []
	//			i: 
	//				imageA: x,y
	//				imageB: x,y
	// 				disparity: value (distance from A-B)
	return {imagesA:imagesA, imagesB:imagesB, linesA:linesA, linesB:linesB, matches:matches};
}
Link3DR.bestMatchNeedleHaystack = function(needle,haystack){
	var grayNeedle = ImageMat.grayFromFloats( needle.red(),needle.grn(),needle.blu() );
	var grayHaystack = ImageMat.grayFromFloats( haystack.red(),haystack.grn(),haystack.blu() );
	// normalize for comparrison
	// GRAY
grayNeedle = ImageMat.normalFloat01(grayNeedle);
grayHaystack = ImageMat.normalFloat01(grayHaystack);
	var ssd = ImageMat.ssdInner(grayHaystack,haystack.width(),haystack.height(), grayNeedle,needle.width(),needle.height());
	// RGB
// var ssdR, ssdG, ssdB;
// var nedR = ImageMat.getNormalFloat01(needle.red());
// var nedG = ImageMat.getNormalFloat01(needle.grn());
// var nedB = ImageMat.getNormalFloat01(needle.blu());
// var hayR = ImageMat.getNormalFloat01(haystack.red());
// var hayG = ImageMat.getNormalFloat01(haystack.grn());
// var hayB = ImageMat.getNormalFloat01(haystack.blu());
// ssdR = ImageMat.ssdInner(hayR,haystack.width(),haystack.height(), nedR,needle.width(),needle.height());
// ssdG = ImageMat.ssdInner(hayG,haystack.width(),haystack.height(), nedG,needle.width(),needle.height());
// ssdB = ImageMat.ssdInner(hayB,haystack.width(),haystack.height(), nedB,needle.width(),needle.height());
// ssd = ImageMat.mulFloat(ssdR,ssdG);
// ssd = ImageMat.mulFloat(ssdB,ssd);
// ssd = ImageMat.absFloat(ssd);
	// 
	var ssdWid = haystack.width()-needle.width()+1;
	var ssdHei = haystack.height()-needle.height()+1;
	// calculate peaks
	var extrema = Code.findExtrema2DFloat(ssd, ssdWid,ssdHei);
	var sortPeaksFxn = function(a,b){ return a.z-b.z; }
	extrema.sort(sortPeaksFxn);
	// get coords of highest peak in image
	if(extrema.length>0){
		console.log(extrema[0].z+"    <    "+extrema[1].z);
		var peak = extrema[0];
		peak.x += Math.floor(needle.width()*0.5); // shift right
		peak.y += Math.floor(needle.height()*0.5); // shift down
		return peak;
	}
	return null;
}
Link3DR.fromHayStackToImage = function(point,haystack, intA,intB, TL,TR,BR,BL){ // translate haystack coords to original image coords
	var originalPoint = new V2D();
	var t = point.x/haystack.width();
	// parallel
	originalPoint.x = Code.linear1D( t, intA.x,intB.x);
	originalPoint.y = Code.linear1D( t, intA.y,intB.y);
	// tangental
	var dir = V2D.diff(TL,BL);
	dir.setLength( point.x - haystack.height()*0.5 ); // distance from middle-line
	originalPoint.add(dir);
	return originalPoint;
}
// ------------------------------------------------------------------------------------------------------------------------ 
// ------------------------------------------------------------------------------------------------------------------------ 
Link3DR.prototype.x = function(){
	//
}
Link3DR.prototype.kill = function(){
	//
}
