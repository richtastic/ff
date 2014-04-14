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
//this._root.matrix().translate(0,200);
	this._stage.root().addChild(this._root);
	// load images
	new ImageLoader("./images/",["F_S_1_1.jpg","F_S_1_2.jpg"],this,this.imagesLoadComplete).load();
}
Fun.prototype.imagesLoadComplete = function(o){
	this._inputImages = o.images;
	this._inputFilenames = o.files;
	this._inputPoints = [];
	this._inputPoints.push([ new V3D(0.235,0.075), new V3D(0.587,0.085), new V3D(0.836,0.0336), new V3D(0.430,0.440), new V3D(0.795,0.330), new V3D(0.805,0.430), new V3D(0.215,0.555), new V3D(0.880,0.580), new V3D(0.750,0.670), new V3D(0.235,0.733) ]);
	this._inputPoints.push([ new V3D(0.175,0.113), new V3D(0.525,0.150), new V3D(0.770,0.115), new V3D(0.370,0.490), new V3D(0.730,0.395), new V3D(0.740,0.495), new V3D(0.150,0.600), new V3D(0.820,0.635), new V3D(0.695,0.730), new V3D(0.170,0.790) ]);
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
	var len = this._inputImages.length;
	// display initial images
	for(i=0;i<len;++i){
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
		// display epipolar lines
		for(k=0;k<this._lines[i].length;++k){
			var pA = new V2D(this._lines[i][k][0].x*wid + accWid, this._lines[i][k][0].y*hei );
			var pB = new V2D(this._lines[i][k][1].x*wid + accWid, this._lines[i][k][1].y*hei );
			var d = new DO();
			var colLine = 0xFF00FFFF;
			d.graphics().setLine(1.0, colLine );
			d.graphics().beginPath();
			d.graphics().moveTo(pA.x,pA.y);
			d.graphics().lineTo(pB.x,pB.y);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
			this._root.addChild( d );
		}
		// display final points
		
		// ...
		accWid += wid;
	}
	

var F = R3D.fundamentalMatrix(this._normalizedInputPoints[0],this._normalizedInputPoints[1]);
F = Matrix.mult(F,this._forwardTransforms[0]); // a normalized
F = Matrix.mult(Matrix.transpose(this._forwardTransforms[1]),F); // b denormalized
Finv = Matrix.transpose(F);

// epipoles
	var e = R3D.getEpipolesFromF(F);
	
	var rect, data, img;
	img = this._inputImages[0];
var wid = img.width;
var hei = img.height;
img = this._stage.renderImage(wid,hei, this._root);
//document.body.appendChild(img);
	data = this._stage.getImageAsFloatRGB(img);
	rect = R3D.polarRectification(data, new V2D(e.A.x*data.width,e.A.y*data.height));
	//rect = R3D.polarRectification(data, new V2D(e.B.x*data.width,e.B.y*data.height));
	//rect = R3D.polarRectification(data, new V2D(1.5*data.width,-0.25*data.height));
	//rect = R3D.polarRectification(data, new V2D(-.5*data.width,-.25*data.height)); // 1 			| -7   : -62
	//rect = R3D.polarRectification(data, new V2D(.999*data.width,-.25*data.height)); // 2 			| -159 : -20
	//rect = R3D.polarRectification(data, new V2D(1.5*data.width,-.005*data.height)); // 3 			| -164 : -107
	//rect = R3D.polarRectification(data, new V2D(-.50*data.width,0.0001*data.height)); // 4 			| 20  : -48
	//rect = R3D.polarRectification(data, new V2D(0.5*data.width,0.00001*data.height)); // 5
	//rect = R3D.polarRectification(data, new V2D(1.50*data.width,0.9995*data.height)); // 6
	//rect = R3D.polarRectification(data, new V2D(-.50*data.width,1.005*data.height)); // 7
	//rect = R3D.polarRectification(data, new V2D(.005*data.width,1.5*data.height)); // 8
	//rect = R3D.polarRectification(data, new V2D(1.0001*data.width,1.5*data.height)); // 9
	// console.log(rect.angles.length)
	// for(i=0;i<rect.angles.length;i+=10){
	// 	console.log(i+" | "+rect.angles[i]);
	// }
	//console.log( Code.toStringArray2D(rect.angles,rect.angles.length,1) );

var i = this._stage.getFloatRGBAsImage(rect.red,rect.grn,rect.blu, rect.width, rect.height);
var d = new DOImage(i);
d.matrix().translate(900,0);
this._stage.addChild(d);

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
	var F = R3D.fundamentalMatrix(this._normalizedInputPoints[0],this._normalizedInputPoints[1]);
	F = Matrix.mult(F,this._forwardTransforms[0]); // a normalized
	F = Matrix.mult(Matrix.transpose(this._forwardTransforms[1]),F); // b denormalized
	Finv = Matrix.transpose(F);
	// epipolar lines
	this._lines = new Array();
	var l1, l2, point, line;
	for(j=0;j<this._inputPoints.length;++j){
		var index = this._inputPoints.length-j-1;
		this._lines[index] = new Array();
		var lines = this._lines[index];
		for(i=0;i<this._inputPoints[j].length;++i){
			point = this._inputPoints[j][i];
			if(j==0){
				line = F.multV3DtoV3D(new V3D(), point);
			}else{
				line = Finv.multV3DtoV3D(new V3D(), point);
			}
			l1 = new V3D( 0.0,-line.z/line.y,1.0);
			l2 = new V3D( 1.35,(-1.35*line.x-line.z)/line.y,1.0);
			lines.push( [l1,l2] );
		}
	}
	// ...

/*
convert point in image to point in rectified
	- radius = given
	- theta from lookup table ... 
*/

//for(i=0;i<this._inputImages.length;++i){

	// img = this._inputImages[1];
	// data = this._stage.getImageAsFloatRGB(img);
	// rect = R3D.polarRectification(data, new V2D(e.B.x*data.width,e.B.y*data.height));
	// console.log(rect);

	// image rectification for fine-reconstruction of all X
	
	// search along epipolar line (even better - search along effed F)

	// disparity

	// + camera matrices
	// + Xi
	
	/// 
}
/*
disparity searching:
A) image rectification
	+ all stereo disparity matching
	+ construct single image for each view
	- near epipoles, the location to search is 2D
B) search along rank2+ F line
	+ search location is 1D near epipoles
	- have to do this hundreds of times

*) scale can change (adaptive?)
*/


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


