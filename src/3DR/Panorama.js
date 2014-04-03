// Panorama.js

function Panorama(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._stage.start();
	this._root = new DO();
	this._stage.root().addChild(this._root);
	// load images
	new ImageLoader("./images/",["snow1.png","snow2.png"],this,this.imagesLoadComplete).load();
}
Panorama.prototype.imagesLoadComplete = function(o){
	// get data
	this._inputImages = o.images;
	this._inputFilenames = o.files;
	this._inputPoints = [];
	this._inputPoints.push([new V2D(0.565,0.340),new V3D(0.790,0.375),new V3D(0.590,0.565),new V3D(0.860,0.670) ,new V3D(0.620,0.720)]);//,new V3D(0.955,0.690) ]);
	this._inputPoints.push([new V2D(0.365,0.290),new V3D(0.590,0.315),new V3D(0.400,0.515),new V3D(0.670,0.600) ,new V3D(0.435,0.670)]);//,new V3D(0.955,0.690) ]);
	//this._inputPoints.push([new V2D(0.085,0.295),new V3D(0.319,0.325),new V3D(0.155,0.520),new V3D(0.525,0.565) ,new V3D(0.360,0.620)]);//,new V3D(0.595,0.575) ]);
	for(var i=0;i<this._inputPoints.length;++i){
		for(var j=0;j<this._inputPoints[i].length;++j){
			this._inputPoints[i][j].z = 1.0;
		}
	}
	//this.calculatePrinciple( this._inputPoints[0] );
	// var pts = [new V2D(2.5,2.4),new V2D(0.5,0.7),new V2D(2.2,2.9),new V2D(1.9,2.2),new V2D(3.1,3.0),new V2D(2.3,2.7),new V2D(2.0,1.6),new V2D(1.0,1.1),new V2D(1.5,1.6),new V2D(1.1,0.9)];
	// this.calculatePrinciple( pts );
	//
	this.calculateNormalizedPoints();
	// start work
	this.beginPanorama();
}
Panorama.prototype.calculatePrinciple = function(points){
	var cov = this.calculateCovariance2D(points);
	console.log("COV: ");
	console.log(cov.toString());
	var svd = Matrix.SVD(cov);
	var sigmas = svd.S;
	var sigDir = svd.V;
	// console.log("SIG: ");
	// console.log(sigmas.toString());
	// console.log("SIGDIR: ");
	// console.log(sigDir.toString());
	var eigs = Matrix.eigenValuesAndVectors(cov);
	var eigVal = eigs.values;
	var eigDir = eigs.vectors;
	console.log("EIG: ");
	console.log(eigVal[0],eigVal[1]);
	// console.log("EIGDIR: ");
	// console.log(eigDir);
	//
	var dirEigA = new V2D(eigDir[0].get(0,0),eigDir[0].get(1,0));
	var dirEigB = new V2D(eigDir[1].get(0,0),eigDir[1].get(1,0));
	var dirX = new V2D(1,0);
	console.log(dirEigA.toString());
	console.log(dirEigB.toString());
	var angle = V2D.angleDirection(dirX,dirEigA);
	console.log("ANGLE: ");
	console.log(angle*180/Math.PI);
	var ratio = Math.sqrt(eigVal[0]/eigVal[1]);
	console.log("RATIO: ");
	console.log(ratio);
	console.log(" ");
	return {direction:dirEigA, angle:angle, scale:ratio}
}
Panorama.prototype.calculateCovariance2D = function(points){
	var i, len, meanX, meanY, normX, normY, sigXX, sigXY, sigYY;
	len = points.length;
	meanX = 0; meanY = 0;
	for(i=0;i<len;++i){
		meanX += points[i].x; meanY += points[i].y;
	}
	sigXX = 0; sigXY = 0; sigYY = 0;
	meanX /= len; meanY /= len;
	for(i=0;i<len;++i){
		normX = points[i].x - meanX;
		normY = points[i].y - meanY;
		sigXX += normX*normX;
		sigXY += normX*normY;
		sigYY += normY*normY;
	}
	len -= 1;
	sigXX /= len; sigXY /= len; sigYY /= len;
	return new Matrix(2,2).setFromArray([sigXX, sigXY, sigXY, sigYY]);
}
Panorama.prototype.calculateNormalizedPoints = function(){
	var i, j, len, T, pX, pY, cenX, cenY, avgX, avgY, avgD;
	this._inputPointTransforms = [];
	this._inputPointInverseTransforms = [];
	for(i=0;i<this._inputPoints.length;++i){
		len = this._inputPoints[i].length;
		cenX = 0.0; cenY = 0.0;
		for(j=0;j<len;++j){
			v = this._inputPoints[i][j];
			cenX += v.x; cenY += v.y;
		}
var dirInfo = this.calculatePrinciple(this._inputPoints[i]);
var angle = dirInfo.angle;
var ratio = dirInfo.scale;
var tmp = new V2D();
		cenX /= len; cenY /= len;
		avgX = 0.0; avgY = 0.0; avgD = 0.0;
		for(j=0;j<len;++j){
			v = this._inputPoints[i][j];
			pX = Math.pow(v.x-cenX, 2.0);
			pY = Math.pow(v.y-cenY, 2.0);
			avgD += Math.sqrt(pX+pY);
				tmp.set(v.x-cenX,v.y-cenY);
				V2D.rotate(tmp,tmp,-angle);
				console.log(tmp.toString());
				avgX += Math.abs(tmp.x);
				avgY += Math.abs(tmp.y);
		}
		avgX /= len; avgY /= len; avgD /= len;
		console.log("AVERAGES: "+avgX,avgY);
console.log(ratio,avgX/avgY);

		T = new Matrix(3,3).identity();
		T = Matrix.transform2DTranslate(T,-cenX,-cenY);
		//T = Matrix.transform2DScale(T,Math.sqrt(2)/avgD);
			T = Matrix.transform2DRotate(T,-angle);
			T = Matrix.transform2DScale(T,Math.sqrt(2)/avgX,Math.sqrt(2)/avgY);
			T = Matrix.transform2DRotate(T,angle);
		this._inputPointTransforms[i] = T;
		Tinv = new Matrix(3,3).identity();
			Tinv = Matrix.transform2DRotate(Tinv,-angle);
			Tinv = Matrix.transform2DScale(Tinv,avgX/Math.sqrt(2),avgY/Math.sqrt(2));
			Tinv = Matrix.transform2DRotate(Tinv,angle);
		//Tinv = Matrix.transform2DScale(Tinv,avgD/Math.sqrt(2));
		Tinv = Matrix.transform2DTranslate(Tinv,cenX,cenY);
		this._inputPointInverseTransforms[i] = Tinv;
	}
}
/*
NORMAL SCALING
0.001123908763455454
0.00022355651578567014
0.0008892842607994475
0.00009235205561524109
0.00030597140617939225
AVG: 5.2701e-04

WITH ANISOTROPIC SCALING:
0.0014165622409150222
0.0006146484649091402
0.0009938979846075959
0.00033543098779688834
0.00016528583707249648 
AVG: 7.0517e-04
*/
// Panorama.prototype.denormalizePoints = function(){
// 	var i, j;
// 	for(i=0;i<this._inputPoints.length;++i){
// 		for(j=0;j<this._inputPoints[i].length;++j){
// 			v = this._inputPoints[i][j];
// 			v.x /= 2*8*Math.sqrt(2); v.y /= 2*8*Math.sqrt(2);
// 			v.x += 0.5; v.y += 0.5;
// 		}
// 	}
// }
Panorama.prototype.beginPanorama = function(){
	var d, wid, hei, i, accWid = 0;
	var u, v, w;
	// display images
	for(i=0;i<this._inputImages.length;++i){
		d = new DOImage(this._inputImages[i]);
		d.matrix().translate(accWid,0.0);
		this._root.addChild(d);
		wid = d.width();
		hei = d.height();
		// display points
		for(j=0;j<this._inputPoints[i].length;++j){
			v = this._inputPoints[i][j];
			this._root.addChild( this._drawPointAt(accWid + wid*v.x,hei*v.y) );
		}
		accWid += wid;
	}
	var H = this.directLinearTransform();
	var Hinv = Matrix.inverse(H);
	// display calculated points
	for(j=0;j<this._inputPoints[0].length;++j){
		u = this._inputPoints[0][j];
		v = this._inputPoints[1][j];
		w = H.multV3DtoV3D(new V3D(),u);
		w.homo();
		console.log(V2D.diff(v,w).length()); // console.log(v,w);
		v = w;
		accWid = 400;
		this._root.addChild( this._drawPointAt(accWid + wid*v.x,hei*v.y) );
	}
	// find Frundamental Matrix 
}
Panorama.prototype.directLinearTransform = function(){
	var i, a, b, x, H, A, rows = [];
	var pointsA = this._inputPoints[0];
	var pointsB = this._inputPoints[1];
	var pointAT = this._inputPointTransforms[0];
	var pointBT = this._inputPointTransforms[1];
	var pointAinvT = this._inputPointInverseTransforms[0];
	var pointBinvT = this._inputPointInverseTransforms[1];
	// normalize points
		// ...
	// x cross Hx = 0  =>  Ah = b
	// homogenious solution:
	for(i=0;i<pointsA.length;++i){
		//a = pointsA[i];// a = new V3D(a.x,a.y,1.0);
		//b = pointsB[i];// b = new V3D(b.x,b.y,1.0);
		a = pointAT.multV3DtoV3D(new V3D(), pointsA[i]); // x
		b = pointBT.multV3DtoV3D(new V3D(), pointsB[i]); // x'
		rows.push([        0,        0,        0,   -b.z*a.x,  -b.z*a.y, -b.z*a.z,  b.y*a.x,  b.y*a.y,  b.y*a.z ]);
		rows.push([  b.z*a.x,  b.z*a.y,  b.z*a.z,         0,        0,        0,   -b.x*a.x, -b.x*a.y, -b.x*a.z ]);
		if(b.z==0 || a.z==0){ // w|w' = 0 => keep third row
			rows.push([  b.y*a.x,  b.y*a.y,  b.y*a.z,  -b.x*a.x, -b.x*a.y, -b.x*a.z,         0,        0,        0 ]);
		}
	}
	A = new Matrix(rows.length,9).setFromArrayMatrix(rows);
	// least squares - svd
		// if 8x9 => 1D nul space is solution ?
		// else
	var svd = Matrix.SVD(A);
	var U = svd.U;
	var S = svd.S;
	var V = svd.V;
	x = V.getCol(8); // last column = min(sigma)
	H = new Matrix(3,3).setFromArray([x.get(0,0),x.get(1,0),x.get(2,0), x.get(3,0),x.get(4,0),x.get(5,0), x.get(6,0),x.get(7,0),x.get(8,0)]);
	// H := inv(T')*H*T
	H = Matrix.mult(H,pointAT);
	H = Matrix.mult(pointBinvT,H);
	// non-linear least squares - ?
		// ...
	return H;
}
Panorama.prototype.RANSAC = function(){
	//
}
Panorama.prototype.leastMeadianOfSquares = function(){
	//
}
Panorama.prototype.goldStandardAlgorithm = function(){
	// init via RANSAC / DLT
}
Panorama.prototype.maximumLiklyhoodEstimation = function(){
	// maximum likelyhood estimation of H
}
Panorama.prototype.sampsonError = function(){
	// maximum likelyhood estimation of H
}
Panorama.prototype.x = function(){
	// 
}
/*
gold standard algorithm

error/cost functions:
* algebraic - difference from zero of: Ht = 0 
* geometric - distance from image points
* reprojection
* comparison
* geometric interpretation
* sampson
* statistical cost fxn / maximum liklihood estimation
* mahalanobis

iteration methods:
* newton
* levenberg-marquardt
* powell's
* simplex
*/
Panorama.prototype._drawPointAt = function(pX,pY){
	var rad = 6.0;
	var d = new DO();
	d.graphics().setLine(2.0, Code.getColARGB(0xFF,Math.floor(256*Math.random()),Math.floor(256*Math.random()),Math.floor(256*Math.random())) );
	d.graphics().beginPath();
	d.graphics().setFill(0x0000FF00);
	d.graphics().moveTo(rad,0);
	d.graphics().drawEllipse(pX,pY, rad,rad, 0.0);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	return d;
}
Panorama.prototype.a = function(){
	console.log("hai");
}


// DLT
// // inhomogeneous solution:
// var cols = [];
// for(i=0;i<pointsA.length;++i){
// 	a = pointsA[i]; // x
// 	b = pointsB[i]; // x'
// 	rows.push([        0,        0,        0,   b.z*a.x,  b.z*a.y, -b.y*a.z,  -b.y*a.x, -b.y*a.y ]);
// 	rows.push([ -b.z*a.x, -b.z*a.y, -b.z*a.z,         0,        0,        0,   b.x*a.x,  b.x*a.y ]);
// 	cols.push([ b.y*a.z]);
// 	cols.push([-b.x*a.z]);
// 	if(b.z==0 || a.z==0){ // w|w' = 0 => keep third row
// 	rows.push([  b.y*a.x,  b.y*a.y,  b.y*a.z,  -b.x*a.x, -b.x*a.y, -b.x*a.z,         0,        0 ]);
// 	cols.push([0]);
// 	}
// }
// var A = new Matrix(rows.length,8).setFromArrayMatrix(rows);
// var b = new Matrix(cols.length,1);