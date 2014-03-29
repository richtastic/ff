// Recon2D.js

function Recon2D(){
	// don't init me
}
Recon2D.epsilon = 1E-16;
Recon2D.isPointOnLine = function(point,line){
	var dot = point.x*line.x + point.y*line.y + point.z*line.z;
	if(Math.abs(dot)<Recon2D.epsilon){ return true; }
	return false;
}

Recon2D.pointFromLineIntersection = function(lineA,lineB){
	var point = new V3D();
	return point;
}

Recon2D.lineFromPointJoin = function(pointA,pointB){ // 
	var line = new V3D();
	return line;
}


Recon2D.isPointAtInfinity = function(point){ // <a,b,0>
	return point.z == 0;
}

Recon2D.isLineAtInfinity = function(line){ // ~ <0,0,1>
	return line.x==0 && line.y==0 && line.z!=0;
}

Recon2D.isPointOnConic = function(point,conic){ // vT * C * v = 0
	var matrix = conic.matrix();
	var temp = Matrix.multV3DtoV3D(new V3D(), point);
	var dot = V3D.dot(point,temp);
	return dot<Recon2D.epsilon;
}

Recon2D.lineTangentToConicPoint = function(point,conic){ // l = C * x
	//
}

Recon2D.pointFromConicTangentLine = function(line,conic){ // x = inv(C) * l
	// 
}

Recon2D.isLineOnDualOfConic = function(line,conic){
	var matrix = conic.dualMatrix();
	var temp = Matrix.multV3DtoV3D(new V3D(), point);
	var dot = V3D.dot(point,temp);
	return dot<Recon2D.epsilon;
}


// (AB*CD)/(AD*BC)  |  (AB*CD)/(AC*BD)  |  (AC*BD)/(AD*BC)
Recon2D.crossRatio = function(pointA,pointB,pointC,pointD){ // ignores z
	// var vAB = new V2D(pointA.x-pointB.x,pointA.y-pointB.y);
	// var vCD = new V2D(pointC.x-pointD.x,pointC.y-pointD.y);
	// var vAC = new V2D(pointA.x-pointC.x,pointA.y-pointC.y);
	// var vBD = new V2D(pointB.x-pointD.x,pointB.y-pointD.y);
	// var lenAB = vAB.length();
	// var lenCD = vCD.length();
	// var lenAC = vAC.length();
	// var lenBD = vBD.length();
	// if(lenAC==0||lenBD==0){ return null; }
	// return (lenAB*lenCD)/(lenAC*lenBD);
	// check for infinity cancel?
	var aXbYcXdY = pointA.x*pointB.y*pointC.x*pointD.y;
	var aXbYcYdX = pointA.x*pointB.y*pointC.y*pointD.x;
	var aYbXcXdY = pointA.y*pointB.x*pointC.x*pointD.y;
	var aYbXcYdX = pointA.y*pointB.x*pointC.y*pointD.x;
	var aXbXcYdY = pointA.x*pointB.x*pointC.y*pointD.y;
	var aYbYcXdX = pointA.y*pointB.y*pointC.x*pointD.x;
	var num = (aXbYcXdY + aXbYcYdX + aYbXcXdY + aYbXcYdX);
	var den = (aXbXcYdY + aXbYcYdX + aYbXcXdY + aYbYcXdX);
	return num/den;
}

Recon2D. = function(){
}

Recon2D. = function(){
}

Recon2D. = function(){
}

Recon2D. = function(){
}

Recon2D. = function(){
}




Conic2D = function(a,b,c,d,e,f){
	this._a = this._b = this._c = this._d = this._e = this._f = 0;
	this.set(a,b,c,d,e,f);
}
Conic2D.prototype.set = function(a,b,c,d,e,f){
	this._a = a!==undefined?a:0;
	this._b = b!==undefined?b:0;
	this._c = c!==undefined?c:0;
	this._d = d!==undefined?d:0;
	this._e = e!==undefined?e:0;
	this._f = f!==undefined?f:0;
}
Conic2D.prototype.setFromMatrix = function(matrix){
	this._a = matrix.get(0,0);
	this._b = (matrix.get(0,1) + matrix.get(1,0));
	this._c = matrix.get(1,1);
	this._d = (matrix.get(0,2) + matrix.get(2,0));
	this._e = (matrix.get(1,2) + matrix.get(2,1));
	this._f = matrix.get(2,2);
}
Conic2D.prototype.matrix = function(){
	return new Matrix(3,3).setFromArray([a,0.5*b,0.5*d, 0.5*b,c,0.5*e, 0.5*d,0.5*e,f]);
}
Conic2D.prototype.dualMatrix = function(){
	var matrix = Matrix.inverse(this.matrix());
	return dual;
}
/*
Recon2D.dualConicFromConic = function(conic){
	var matrix = Matrix.inverse(conic.matrix());
	var dual = new Conic2D().setFromMatrix(matrix);
	return dual;
}
Recon2D.conicFromDualConic = function(dual){
	var matrix = Matrix.inverse(dual.matrix());
	var conic = new Conic2D().setFromMatrix(matrix);
	return conic;
}
Conic2D.fromDualConic = function(dual){
	var matrix = Matrix.inverse(dual.matrix());
	var conic = new Conic2D().setFromMatrix(matrix);
}
*/


