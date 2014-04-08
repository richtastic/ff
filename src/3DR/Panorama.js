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
	this.calculateNormalizedPoints();
	// start work
	this.beginPanorama();
}
Panorama.prototype.calculatePrinciple = function(points){
	var cov = this.calculateCovariance2D(points);
	// console.log("COV: ");
	// console.log(cov.toString());
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
	// console.log("EIG: ");
	// console.log(eigVal[0],eigVal[1]);
	// console.log("EIGDIR: ");
	// console.log(eigDir);
	//
	var dirEigA = new V2D(eigDir[0].get(0,0),eigDir[0].get(1,0));
	var dirEigB = new V2D(eigDir[1].get(0,0),eigDir[1].get(1,0));
	var dirX = new V2D(1,0);
	// console.log(dirEigA.toString());
	// console.log(dirEigB.toString());
	var angle = V2D.angleDirection(dirX,dirEigA);
	// console.log("ANGLE: ");
	// console.log(angle*180/Math.PI);
	var ratio = Math.sqrt(eigVal[0]/eigVal[1]);
	// console.log("RATIO: ");
	// console.log(ratio);
	// console.log(" ");
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
	this._normalizedPoints = [];
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
var useNormalized = true;//false;
		cenX /= len; cenY /= len;
		avgX = 0.0; avgY = 0.0; avgD = 0.0;
		for(j=0;j<len;++j){
			v = this._inputPoints[i][j];
			pX = Math.pow(v.x-cenX, 2.0);
			pY = Math.pow(v.y-cenY, 2.0);
			avgD += Math.sqrt(pX+pY);
				tmp.set(v.x-cenX,v.y-cenY);
				V2D.rotate(tmp,tmp,-angle);
				// console.log(tmp.toString());
				avgX += Math.abs(tmp.x);
				avgY += Math.abs(tmp.y);
		}
		avgX /= len; avgY /= len; avgD /= len;
		// console.log("AVERAGES: "+avgX,avgY);
		// console.log(ratio,avgX/avgY);
		// console.log("TRANSLATE: "+cenX+" "+cenY);
		// console.log("    SCALE: "+(Math.sqrt(2)/avgD) );
		T = new Matrix(3,3).identity();
		T = Matrix.transform2DTranslate(T,-cenX,-cenY);
		if(!useNormalized){
			T = Matrix.transform2DScale(T,Math.sqrt(2)/avgD);
		}else{
			T = Matrix.transform2DRotate(T,-angle);
			T = Matrix.transform2DScale(T,Math.sqrt(2)/avgX,Math.sqrt(2)/avgY);
			T = Matrix.transform2DRotate(T,angle);
		}
		this._inputPointTransforms[i] = T;
		Tinv = new Matrix(3,3).identity();
		if(!useNormalized){
			Tinv = Matrix.transform2DScale(Tinv,avgD/Math.sqrt(2));
		}else{
			Tinv = Matrix.transform2DRotate(Tinv,-angle);
			Tinv = Matrix.transform2DScale(Tinv,avgX/Math.sqrt(2),avgY/Math.sqrt(2));
			Tinv = Matrix.transform2DRotate(Tinv,angle);
		}
		Tinv = Matrix.transform2DTranslate(Tinv,cenX,cenY);
		this._inputPointInverseTransforms[i] = Tinv;
	}
	// save normalized points
	for(i=0;i<this._inputPoints.length;++i){
		len = this._inputPoints[i].length;
		T = this._inputPointTransforms[i];
		this._normalizedPoints[i] = new Array(len);
		for(j=0;j<len;++j){
			v = this._inputPoints[i][j];
			this._normalizedPoints[i][j] = T.multV3DtoV3D(new V3D(),v);
		}
	}
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
			this._root.addChild( this._drawPointAt(accWid + wid*v.x,hei*v.y) );
		}
		accWid += wid;
	}
	// RANSAC GOES HERE
	var H = this.goldStandardAlgorithmH();
	var Hinv = Matrix.inverse(H);
var str = "dat = [\n";
	// display calculated points
	for(j=0;j<this._inputPoints[0].length;++j){
		u = this._inputPoints[0][j];
		v = this._inputPoints[1][j];
		// A calculated
		w = Hinv.multV3DtoV3D(new V3D(),v);
		w.homo();
		//console.log(u.toString()+" "+v.toString());
		//console.log(V2D.diff(u,w).length());
str += V2D.diff(v,w).length() + " \n";
		v = w;
//v.x -= 0.01;
		accWid = 0;
		this._root.addChild( this._drawPointAt(accWid + wid*v.x,hei*v.y) );
		// B calculated
		w = H.multV3DtoV3D(new V3D(),u);
		w.homo();
		//console.log(V2D.diff(v,w).length()); // console.log(v,w);
str += V2D.diff(v,w).length() + " \n";
		v = w;
//v.x -= 0.01;
		accWid = 400;
		this._root.addChild( this._drawPointAt(accWid + wid*v.x,hei*v.y) );
	}
str += "]; \n";
str += "sum(dat)/size(dat,1) \n";
console.log(str);
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
// var v = Matrix.eigenValuesAndVectors(jj);
// console.log("EIGEN VALUES AND VECTORS");
// console.log(v.values);
var jt = Matrix.transpose(jacobian);
var jj = Matrix.mult(jt,jacobian);
var L = new Matrix(jacobian.cols(),jacobian.cols()).identity();
L.scale(lambda);
var ji = Matrix.add(jj,L);
ji = Matrix.inverse(ji);
Jinv = Matrix.mult(ji,jt);

delta = Matrix.mult(Jinv, error);
var potentialH = Matrix.add(h,delta); // putative
// TEMP
var newError = this.absoluteErrorFromHColumn(potentialH,pointsA,pointsB).errors.getNorm();
if(newError<err){
	//console.log("GOTO NEXT: "+newError+" < "+err);
	Matrix.add(h, h,delta);
	lambda *= lambdaScale; // more 
}else{
	//console.log("BAD, SKIP: "+newError+" > "+err);
	lambda /= lambdaScale; // less
}

/*
console.log(jacobian.rows()+" x "+jacobian.cols());
// console.log(ji.toString());
// console.log(jt.toString());
console.log(ji.rows()+" x "+ji.cols());
console.log(jt.rows()+" x "+jt.cols());
*/
		// 
		// dx: next h values
		// delta = Matrix.mult(Jinv, error);
		// // x += dx
		// Matrix.add(h, h,delta);

/*
sampson
*/

// var eNow = this.sampsonsFromHColumn(h,pointsA,pointsB).errors;
// console.log(eNow.toString())
// var eJ = new Matrix(pointsA.length,9);
// for(k=0;k<9;++k){
// 	he.copy(h); he.set(k,0, he.get(k,0)+epsilon );
// 	ret = this.sampsonsFromHColumn(he,pointsA,pointsB);
// 	var delY = Matrix.sub(ret.errors,eNow);
// 	eJ.setColFromCol(k, delY,0);
// }
// eJ.scale(1.0/epsilon);
// Jinv = Matrix.pseudoInverse(eJ);
// // error
// eN = eNow.getNorm();
// console.log(eN-eP);
// eP = eN
// // next H
// delta = Matrix.mult(Jinv, eNow);
// Matrix.add(h, h,delta);
	}
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