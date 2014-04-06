// Fun.js

/*

*) Fundamental matrix (14) [ch 10+14+15]
	A) direct reconstruction via measured points
	B) 	a) affine: plane at infinity
		b) metric: image of absolute conic
*) Image Rectification (14+15) [ch ]
*) Disparity map (14+15+16) [ch ]
*) Triangulation (15) [ch 11]
*) trifocal tensor (17) [ch 14+15]
*) repeat. [ch 17]
*) auto calibration [ch 18]
point triplets - define plane
*) () [ch ]
*) () [ch ]
*) () [ch ]
*) () [ch ]
*/



function Fun(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._stage.start();
	this._root = new DO();
	this._stage.root().addChild(this._root);
	// load images
	//new ImageLoader("./images/",["snow1.png","snow2.png"],this,this.imagesLoadComplete).load();
}
Fun.prototype.imagesLoadComplete = function(o){
	this.all();
}

Fun.prototype.all = function(){
	// fundamental matrix
	// + camera matrices
	// + Xi
	// image rectrification for fine-reconstruction of all X
	/// 
}


Fun.prototype.fundementalFromPoints = function(pointsA,pointB){
	// normalize points x, x'
	// solve Af = 0 : Ai = x'*x x'*y x' y'*x y'*y y' x y 1
	// F = [a b c; d e f; g h i]
	// force F to rank 2, while closestly approximating 
		// a) using last column of V in F = USV^T
		// b) iteritively start with (a), minimize geometric distance via L.M. converging f
	//
	var F = new Matrix(3,3);
	return F;
}

Fun.prototype. = function(){
	//
}

Fun.prototype. = function(){
	//
}

Fun.prototype. = function(){
	//
}
