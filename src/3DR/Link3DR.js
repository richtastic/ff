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
}
// ------------------------------------------------------------------------------------------------------------------------ OPS
Link3DR.prototype.searchLineInBFromPointInA = function(point){
	return this.searchLineFromPoint(this._F_AtoB,point);
}
Link3DR.prototype.searchLineInAFromPointInB = function(point){
	return this.searchLineFromPoint(this._F_BtoA,point);
}
Link3DR.prototype.searchLineFromPoint = function(F, point){
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
			if(intA.y < intB.y){
				list.push( intA ); list.push( intB );
			}else{
				list.push( intB ); list.push( intA );
			}
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
			if(intA.x < intB.x){
				list.push( intA ); list.push( intB );
			}else{
				list.push( intB ); list.push( intA );
			}
		}else{
			if(0<l1.y && l1.y<1.0){ list.push(l1); }
			if(intA){ list.push( intA ); }
			if(intB){ list.push( intB ); }
			if(0<l2.y && l2.y<1.0){ list.push(l2); }
		}
	}
	return list;
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
	line = this.searchLineFromPoint(F, point);
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
	var epipoleA = null;
	this._rectificationA = this._A.getRectification(epipoleA);
	this._rectificationB = this._B.getRectification(epipoleB);
}
// ------------------------------------------------------------------------------------------------------------------------ 
Link3DR.getLookupTableFromRectification = function(rect){
	var data = R3D.monotonicAngleArray(rect.angles);
	rect.minAngle = data.min;
	rect.maxAngle = data.max;
	rect.increasing = data.increasing;
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
