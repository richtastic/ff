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
	line = F.multV3DtoV3D(new V3D(), point);
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
Link3DR.prototype.getImageLineAWithPointB = function(point, winHei){ 
	return Link3DR.getImageLineWithPoint(this._F_BtoA,this._epipoleA,point,this._A.source(), winHei);
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
Link3DR.prototype.x = function(){
	//
}
Link3DR.prototype.kill = function(){
	//
}
