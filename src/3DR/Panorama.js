// Panorama.js

function Panorama(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
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
	this._inputPoints.push([new V3D(0.565,0.340),new V3D(0.790,0.375),new V3D(0.590,0.565),new V3D(0.860,0.670) ,new V3D(0.620,0.720)]);//,new V3D(0.955,0.690) ]);
	this._inputPoints.push([new V3D(0.365,0.290),new V3D(0.590,0.315),new V3D(0.400,0.515),new V3D(0.670,0.600) ,new V3D(0.435,0.670)]);//,new V3D(0.955,0.690) ]);
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
	var ret = R3D.calculateNormalizedPoints(this._inputPoints);
	this._normalizedPoints = ret.normalized;
	this._inputPointTransforms = ret.forward;
	this._inputPointInverseTransforms = ret.reverse;
	// start work
	this.beginPanorama();
}

Panorama.prototype.beginPanorama = function(){
	var d, wid, hei, i, accWid = 0;
	var u, v, w;
	// display initial images
	for(i=0;i<this._inputImages.length;++i){
		d = new DOImage(this._inputImages[i]);
		d.matrix().translate(accWid,0.0);
		this._root.addChild(d);
		wid = d.width();
		hei = d.height();
		// display initial points
		for(j=0;j<this._inputPoints[i].length;++j){
			v = this._inputPoints[i][j];
			this._root.addChild( R3D.drawPointAt(accWid + wid*v.x,hei*v.y) );
		}
		accWid += wid;
	}
	// RANSAC GOES HERE
	var H = this.goldStandardAlgorithmH();
	var Hinv = Matrix.inverse(H);
var sum = 0.0;
var str = "dat = [\n";
	// display calculated points
	for(j=0;j<this._inputPoints[0].length;++j){
		u = this._inputPoints[0][j];
		v = this._inputPoints[1][j];
		// A calculated
		w = Hinv.multV3DtoV3D(new V3D(),v);
		w.homo();
		//console.log(u.toString()+" "+v.toString());
		//console.log(V2D.sub(u,w).length());
str += V2D.sub(v,w).length() + " \n";
sum += V2D.sub(v,w).length();
		v = w;
v.x -= 0.01;
		accWid = 0;
		this._root.addChild( R3D.drawPointAt(accWid + wid*v.x,hei*v.y) );
		// B calculated
		w = H.multV3DtoV3D(new V3D(),u);
		w.homo();
		//console.log(V2D.sub(v,w).length()); // console.log(v,w);
str += V2D.sub(v,w).length() + " \n";
		v = w;
v.x -= 0.01;
		accWid = 400;
		this._root.addChild( R3D.drawPointAt(accWid + wid*v.x,hei*v.y) );
	}
sum /= this._inputPoints[0].length;
str += "]; \n";
str += "sum(dat)/size(dat,1) \n";
console.log(str);
console.log("average error: "+sum);
}
Panorama.prototype.goldStandardAlgorithmH = function(){
	var pointsA = this._normalizedPoints[0]; // this._inputPoints[0];
	var pointsB = this._normalizedPoints[1]; // this._inputPoints[1];
	var minErrorDiff = 1E-16;
	var maxIterations = 30;
	var errors, error, sampsonError, jacobian, Jinv, epsilon = 1E-8, err = 0, prevErr = 0;
	var i,j,k, ret, H, h, delta, he, row,col, a,b, pointLen = pointsA.length, dataCount = pointsA.length*2*2;
	var currentResults;
var eN=0,eP=0;
	// init via RANSAC / DLT
	H = this.directLinearTransformH();
	h = new Matrix(9,1);
	he = new Matrix(9,1);
	h.setFromArray( H.toArray() );
	jacobian = new Matrix(dataCount,9);
// var t = new Matrix(9,1);
// t.randomize(0.01);
// t.offset(-0.005);
// Matrix.add(h,h,t);
var lambda = 0.001;
var lambdaScale = 10.0;
	for(i=0;i<maxIterations;++i){
	 	// y: value at H
		currentResults = this.locationsFromHColumn(h,pointsA,pointsB).points;
		// dy: absolute error at H
		error = this.absoluteErrorFromHColumn(h,pointsA,pointsB).errors;
		//console.log("error: "+error.getNorm());
		err = error.getNorm();
		console.log(err-prevErr);
		if( Math.abs(err-prevErr) < minErrorDiff ){
			console.log("converged");
			break;
		}
		prevErr = err;
		// jacobian
		for(k=0;k<9;++k){
			he.copy(h); he.set(k,0, he.get(k,0)+epsilon );
			ret = this.locationsFromHColumn(he,pointsA,pointsB);
			var delY = Matrix.sub(ret.points,currentResults);
			jacobian.setColFromCol(k, delY,0);
		}
		jacobian.scale(1.0/epsilon);
		//Jinv = Matrix.pseudoInverse(jacobian);
var jt = Matrix.transpose(jacobian);
var jj = Matrix.mult(jt,jacobian);
var L = new Matrix(jacobian.cols(),jacobian.cols()).identity();
L.scale(lambda);
var ji = Matrix.add(jj,L);
ji = Matrix.inverse(ji);
Jinv = Matrix.mult(ji,jt);
delta = Matrix.mult(Jinv, error);
var potentialH = Matrix.add(h,delta); // putative
var newError = this.absoluteErrorFromHColumn(potentialH,pointsA,pointsB).errors.getNorm();
if(newError<err){
	//console.log("GOTO NEXT: "+newError+" < "+err);
	Matrix.add(h, h,delta);
	lambda *= lambdaScale; // more 
}else{
	//console.log("BAD, SKIP: "+newError+" > "+err);
	lambda /= lambdaScale; // less
}

		// 
		// dx: next h values
		// delta = Matrix.mult(Jinv, error);
		// // x += dx
		// Matrix.add(h, h,delta);

/*
sampson - if this is fact wtf that means
*/
/*
		var error = this.sampsonsFromHColumn(h,pointsA,pointsB).errors;
		err = error.getNorm();
		console.log(err-prevErr);
		if( Math.abs(err-prevErr) < minErrorDiff ){
			console.log("converged");
			break;
		}
		prevErr = err;
		console.log(error.toString());
		var eJ = new Matrix(pointsA.length,9);
		for(k=0;k<9;++k){
			he.copy(h); he.set(k,0, he.get(k,0)+epsilon );
			ret = this.sampsonsFromHColumn(he,pointsA,pointsB);
			var delY = Matrix.sub(ret.errors,error);
			eJ.setColFromCol(k, delY,0);
		}
jacobian = eJ;
		eJ.scale(1.0/epsilon);
		//Jinv = Matrix.pseudoInverse(eJ);
var jt = Matrix.transpose(jacobian);
var jj = Matrix.mult(jt,jacobian);
var L = new Matrix(jacobian.cols(),jacobian.cols()).identity();
L.scale(lambda);
var ji = Matrix.add(jj,L);
ji = Matrix.inverse(ji);
Jinv = Matrix.mult(ji,jt);
delta = Matrix.mult(Jinv, error);
var potentialH = Matrix.add(h,delta); // putative
//var newError = this.absoluteErrorFromHColumn(potentialH,pointsA,pointsB).errors.getNorm();
var newError = this.sampsonsFromHColumn(he,pointsA,pointsB);
if(newError<err){
	//console.log("GOTO NEXT: "+newError+" < "+err);
	Matrix.add(h, h,delta);
	lambda *= lambdaScale; // more 
}else{
	//console.log("BAD, SKIP: "+newError+" > "+err);
	lambda /= lambdaScale; // less
}		
		// next H
		// delta = Matrix.mult(Jinv, eNow);
		// Matrix.add(h, h,delta);
*/

/*
gold standard:

*/

	}
	// normal:  average error: 0.20110955268203262 
	// sampson: average error: 0.20111007855590562 // way faster convergence
	H.setFromArray( h.toArray() );
	console.log(H.toString(10));
	
	// error = ;
	// sampsonError = ;
	// epsilon

	// pre/post normalize
	var pointAT = this._inputPointTransforms[0];
	var pointBT = this._inputPointTransforms[1];
	var pointAinvT = this._inputPointInverseTransforms[0];
	var pointBinvT = this._inputPointInverseTransforms[1];
	H = Matrix.mult(H,pointAT);
	H = Matrix.mult(pointBinvT,H);
	return H;
}
Panorama.prototype.sampsonFromCorrespondence = function(h,pointsA,pointsB, k){
	var A = this.getDLTA(pointsA,pointsB);
	var e = Matrix.mult(A,h);
	var J = this.jacobianDLT(h,pointsA[k],pointsB[k]);
	// console.log("single J:");
	// console.log(J.toString());
	var JT = Matrix.transpose(J);
	var JJ = Matrix.mult(J,JT);
	var JI = Matrix.inverse(JJ);
	// console.log("inverse J:");
	// console.log(JI.toString());
	var Ch = new Matrix(2,1).setFromArray([e.get(k*2+0,0), e.get(k*2+1,0)]);
	var Ct = Matrix.transpose(Ch);
	// console.log("CH COST: ");
	// console.log(Ch.toString());
	var sam = Matrix.mult(JI,Ch);
	sam = Matrix.mult(Ct,sam);
	sam = sam.get(0,0);
	return sam;//Math.sqrt(sam);
}
Panorama.prototype.sampsonsFromHColumn = function(h,pointsA,pointsB){
	var i, a, b, len=pointsA.length;
	var error = new Matrix(len,1);
	for(i=0;i<len;++i){
		error.set(i,0, this.sampsonFromCorrespondence(h,pointsA,pointsB,i) );
	}
	return {errors:error};
}
Panorama.prototype.locationsFromHColumn = function(h,pointsA,pointsB){
	var H = new Matrix(3,3).setFromArray(h.toArray());
	var Hinv = Matrix.inverse(H);
	var dataLength = pointsA.length*2*2;
	var results = new Matrix(dataLength,1);
	var i, a, b, a2 = new V3D(), b2 = new V3D();
	for(i=0;i<pointsA.length;++i){
		a = pointsA[i];
		b = pointsB[i];
		b2 = H.multV3DtoV3D(b2, a);
		a2 = Hinv.multV3DtoV3D(a2, b);
		a2.homo();
		b2.homo();
		results.set(i*4+0, 0, a2.x);
		results.set(i*4+1, 0, a2.y);
		results.set(i*4+2, 0, b2.x);
		results.set(i*4+3, 0, b2.y);
	}
	return {points:results};
}
Panorama.prototype.absoluteErrorFromHColumn = function(h,pointsA,pointsB){
	var H = new Matrix(3,3).setFromArray(h.toArray());
	var Hinv = Matrix.inverse(H);
	var dataLength = pointsA.length*2*2;
	var error = new Matrix(dataLength,1);
	var i, a, b, a2 = new V3D(), b2 = new V3D();
	for(i=0;i<pointsA.length;++i){
		a = pointsA[i];
		b = pointsB[i];
		b2 = H.multV3DtoV3D(b2, a);
		a2 = Hinv.multV3DtoV3D(a2, b);
		a2.homo();
		b2.homo();
		error.set(i*4+0, 0, a2.x-a.x);
		error.set(i*4+1, 0, a2.y-a.y);
		error.set(i*4+2, 0, b2.x-b.x);
		error.set(i*4+3, 0, b2.y-b.y);
error.set(i*4+0, 0, Math.pow(a2.x-a.x,2) );
error.set(i*4+1, 0, Math.pow(a2.y-a.y,2) );
error.set(i*4+2, 0, Math.pow(b2.x-b.x,2) );
error.set(i*4+3, 0, Math.pow(b2.y-b.y,2) );
	}
	return {errors:error};
}
Panorama.prototype.directLinearTransform4H = function(pointsA, pointsB){
	// compute only using 4 points
	var H = null;
	return H;
}
Panorama.prototype.jacobianDLT = function(h,a,b){ // df(x,y,x',y')/di
	var J = new Matrix(2,4);
	var A = h.get(0,0), B = h.get(1,0), C = h.get(2,0);
	var D = h.get(3,0), E = h.get(4,0), F = h.get(5,0);
	var G = h.get(6,0), H = h.get(7,0), I = h.get(8,0);
	J.setFromArray([ -b.z*D+b.y*G, -b.z*E+b.y*H, 0, a.x*G+a.y*H+a.z*I,   b.z*A-b.x*G, b.z*B-b.x*H, -a.x*G-a.y*H-a.z*I, 0 ]);
	// 3rd row?
	return J;
}
Panorama.prototype.getDLTA = function(pointsA,pointsB){
	var i, A, len=pointsA.length, rows = [];
	// x cross Hx = 0  =>  Ah = b
	for(i=0;i<len;++i){
		a = pointsA[i];// a = new V3D(a.x,a.y,1.0); // a = pointAT.multV3DtoV3D(new V3D(), pointsA[i]); // x
		b = pointsB[i];// b = new V3D(b.x,b.y,1.0); // b = pointBT.multV3DtoV3D(new V3D(), pointsB[i]); // x'
		rows.push([        0,        0,        0,   -b.z*a.x,  -b.z*a.y, -b.z*a.z,  b.y*a.x,  b.y*a.y,  b.y*a.z ]);
		rows.push([  b.z*a.x,  b.z*a.y,  b.z*a.z,         0,        0,        0,   -b.x*a.x, -b.x*a.y, -b.x*a.z ]);
		// if(b.z==0 || a.z==0){ // w|w' = 0 => keep third row
		// 	rows.push([  b.y*a.x,  b.y*a.y,  b.y*a.z,  -b.x*a.x, -b.x*a.y, -b.x*a.z,         0,        0,        0 ]);
		// }
	}
	A = new Matrix(rows.length,9).setFromArrayMatrix(rows);
	return A;
}
Panorama.prototype.directLinearTransformH = function(){
	var i, a, b, x, H, A;
	var pointsA = this._normalizedPoints[0];
	var pointsB = this._normalizedPoints[1];
	// homogenious solution:
	var A  = this.getDLTA(pointsA,pointsB);
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
	// H = Matrix.mult(H,pointAT);
	// H = Matrix.mult(pointBinvT,H);
	return H;
}
Panorama.prototype.RANSAC = function(){
	//
}
Panorama.prototype.leastMeadianOfSquares = function(){
	//
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