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
	new ImageLoader("./images/",["F_S_1_1.jpg","F_S_1_2.jpg"],this,this.imagesLoadComplete).load();
}
Fun.prototype.imagesLoadComplete = function(o){
	this._inputImages = o.images;
	this._inputFilenames = o.files;
	this._inputPoints = [];
	this._inputPoints.push([ new V3D(0.235,0.075), new V3D(0.590,0.085), new V3D(0.835,0.035), new V3D(0.430,0.440), new V3D(0.795,0.330), new V3D(0.805,0.430), new V3D(0.215,0.555) ]);//, new V3D(0.880,0.580), new V3D(0.750,0.670) ]);
	this._inputPoints.push([ new V3D(0.175,0.115), new V3D(0.525,0.150), new V3D(0.770,0.115), new V3D(0.370,0.490), new V3D(0.730,0.395), new V3D(0.740,0.495), new V3D(0.150,0.600) ]);//, new V3D(0.820,0.635), new V3D(0.695,0.730) ]);
var str = "";
	for(var i=0;i<this._inputPoints.length;++i){
		for(var j=0;j<this._inputPoints[i].length;++j){
			this._inputPoints[i][j].z = 1.0;
			str += ""+this._inputPoints[i][j].x+" "+this._inputPoints[i][j].y+" "+this._inputPoints[i][j].z+" \n";
		}
		str += "\n";
	}
str += "";
Code.copyToClipboardPrompt(str);
	this.all();
	this.displayData();
}
Fun.prototype.displayData = function(){
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
			this._root.addChild( R3D.drawPointAt(accWid + wid*v.x,hei*v.y,   0xFF,0x00,0x00) );
		}
		// display final points
		// ...
		accWid += wid;
	}
}
Fun.prototype.all = function(){
	var ret;
	// normalize input points
	ret = R3D.calculateNormalizedPoints(this._inputPoints);
	this._normalizedInputPoints = ret.normalized;
	this._forwardTransforms = ret.forward;
	this._reverseTransforms = ret.reverse;
	// RANSAC
		// ...
	// fundamental matrix
	R3D.fundamentalMatrix(this._normalizedInputPoints[0],this._normalizedInputPoints[1]);
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

// Fun.prototype. = function(){
// 	//
// }

// Fun.prototype. = function(){
// 	//
// }

// Fun.prototype. = function(){
// 	//
// }


