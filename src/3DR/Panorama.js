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
	this._inputPoints.push([new V2D(0.565,0.340),new V3D(0.790,0.375),new V3D(0.590,0.565),new V3D(0.860,0.670) ,new V3D(0.620,0.720) ]);
	this._inputPoints.push([new V2D(0.085,0.295),new V3D(0.320,0.330),new V3D(0.155,0.520),new V3D(0.525,0.565) ,new V3D(0.360,0.620) ]);
	// for(var i=0;i<this._inputPoints.length;++i){
	// 	for(var j=0;j<this._inputPoints[i].length;++j){
	// 		this._inputPoints[i][j].x *= 100.0;
	// 		this._inputPoints[i][j].y *= 100.0;
	// 		this._inputPoints[i][j].z *= 100.0;
	// 	}
	// }
	// start work
	this.beginPanorama();
}
Panorama.prototype.beginPanorama = function(){
	var d, wid, hei, i, accWid = 0;
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
	this.directLinearTransform();
	// find Frundamental Matrix 
}
Panorama.prototype.directLinearTransform = function(){
	var i, a, b, x, H, A, rows = [];
	var pointsA = this._inputPoints[0];
	var pointsB = this._inputPoints[1];
	// normalize points
		// ...
	// x cross Hx = 0  =>  Ah = b
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
	// homogenious solution:
	for(i=0;i<pointsA.length;++i){
		a = pointsA[i]; a = new V3D(a.x,a.y,1.0); // x
		b = pointsB[i]; b = new V3D(b.x,b.y,1.0); // x'
		// rows.push([        0,        0,        0,   b.z*a.x,  b.z*a.y,  b.y*a.z,  -b.y*a.x, -b.y*a.y, -b.y*a.z ]);
		// rows.push([ -b.z*a.x, -b.z*a.y, -b.z*a.z,         0,        0,        0,   b.x*a.x,  b.x*a.y,  b.x*a.z ]);
		rows.push([        0,        0,        0,   -b.z*a.x,  -b.z*a.y, -b.y*a.z,  b.y*a.x,  b.y*a.y,  b.y*a.z ]);
		rows.push([  b.z*a.x,  b.z*a.y,  b.z*a.z,         0,        0,        0,   -b.x*a.x, -b.x*a.y, -b.x*a.z ]);
		if(b.z==0 || a.z==0){ // w|w' = 0 => keep third row
		rows.push([  b.y*a.x,  b.y*a.y,  b.y*a.z,  -b.x*a.x, -b.x*a.y, -b.x*a.z,         0,        0,        0 ]);
		}
	}
	A = new Matrix(rows.length,9).setFromArrayMatrix(rows);
	//b = new Matrix(rows.length,1);
	// least squares - svd
		// if 8x9 => 1D nul space is solution ?
		// else
	console.log( A.toString() );
	//console.log( b.toString() );
		//x = Matrix.solve(A,b);
		var svd = Matrix.SVD(A);
		console.log(svd);
		var U = svd.U;
		var S = svd.S;
		var V = svd.V;
	console.log( " -------- " );
	console.log( U.toString() );
	console.log( S.toString() );
	console.log( V.toString() );
	console.log( " -------- " );
	x = new Matrix(9,1).setFromArray(V._rows[8]);
		console.log( x.toString() );
		H = new Matrix(3,3).setFromArray([x.get(0,0),x.get(1,0),x.get(2,0), x.get(3,0),x.get(4,0),x.get(5,0), x.get(6,0),x.get(7,0),1]);
	console.log( H.toString() );
	//
	// console.log( H.toString() );
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
* algebraic
* geometric
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
	var rad = 4.0;
	var d = new DO();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().setFill(0x9900FF00);
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

