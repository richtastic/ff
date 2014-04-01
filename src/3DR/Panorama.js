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
	// start work
	this.beginPanorama();
}
Panorama.prototype.normalizePoints = function(){
	var i, j;
	for(i=0;i<this._inputPoints.length;++i){
		for(j=0;j<this._inputPoints[i].length;++j){
			v = this._inputPoints[i][j];
			v.x -= 0.5; v.y -= 0.5;
			v.x *= 2*Math.sqrt(2); v.y *= 2*Math.sqrt(2);
		}
	}
}
Panorama.prototype.denormalizePoints = function(){
	var i, j;
	for(i=0;i<this._inputPoints.length;++i){
		for(j=0;j<this._inputPoints[i].length;++j){
			v = this._inputPoints[i][j];
			v.x /= 2*8*Math.sqrt(2); v.y /= 2*8*Math.sqrt(2);
			v.x += 0.5; v.y += 0.5;
		}
	}
}
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
this.normalizePoints();
	var H = this.directLinearTransform();
	var Hinv = Matrix.inverse(H);
//this.denormalizePoints();
	console.log(H.toString());
	// console.log(Hinv.toString());
	console.log(".........................");
	for(j=0;j<this._inputPoints[0].length;++j){
		u = this._inputPoints[0][j];
		v = this._inputPoints[1][j];
		w = H.multV3DtoV3D(new V3D(),u);
		//w = H.multV3DtoV3D(new V3D(),v);
		w.homo();
		//console.log(u,w);
		console.log(v,w);
		v = w;
		v.x /= 2*Math.sqrt(2); v.y /= 2*Math.sqrt(2);
		v.x += 0.5; v.y += 0.5;
		accWid = 400;
		this._root.addChild( this._drawPointAt(accWid + wid*v.x,hei*v.y) );
	}
	// find Frundamental Matrix 
}
Panorama.prototype.directLinearTransform = function(){
	var i, a, b, x, H, A, rows = [];
	var pointsA = this._inputPoints[0];
	var pointsB = this._inputPoints[1];
	// normalize points
		// ...
	// x cross Hx = 0  =>  Ah = b
	// homogenious solution:
	for(i=0;i<pointsA.length;++i){
		a = pointsA[i];// a = new V3D(a.x,a.y,1.0); // x
		b = pointsB[i];// b = new V3D(b.x,b.y,1.0); // x'
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
	// console.log( " H: " );
	// console.log( H.toString() );
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
	var rad = 6.0;
	var d = new DO();
	d.graphics().setLine(2.0,0xFFFF0000);
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