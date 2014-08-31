// Trans.js

function Trans(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// import image to work with
	var imageLoader = new ImageLoader("./images/",["desktop1.png"], this,this.handleImageLoaded,null);
	imageLoader.load();
}
Trans.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}
Trans.prototype.handleImageLoaded = function(e){
	var i, d, p, rad;
	image = e.images[0];
	var imageWidth = image.width;
	var imageHeight = image.height;
	// display image
	d = new DOImage(image);
	this._root.addChild(d);
	// convert to data array for calculations
	var imageARGB = this._stage.getDOAsARGB(d, imageWidth,imageHeight);
	var imageMat = new ImageMat(imageWidth,imageHeight);
	imageMat.setFromArrayARGB(imageARGB);
	// 4 points to make a homography
	var planeWidth = 800;
	var planeHeight = 400;
	var points = [new V2D(159,397), new V2D(544,381), new V2D(601,430.5), new V2D(163,456)];
	var planePoints = [new V2D(0,0), new V2D(planeWidth-1,0), new V2D(planeWidth-1,planeHeight-1,1), new V2D(0,planeHeight-1,1)];

/*
PICK 5 PAIRS OF ORTHOGONAL LINES
*/
var pair, a,b,c,d, pa, pb, pc, pd, l, m;
var linesOrthoPairs = [];
linesOrthoPairs.push([[new V2D(189,411), new V2D(190,419)],[new V2D(189,419), new V2D(204,418)]]); // Q
linesOrthoPairs.push([[new V2D(273,417), new V2D(289,422)],[new V2D(276,423), new V2D(287,416)]]); // G
linesOrthoPairs.push([[new V2D(326,424), new V2D(339,423)],[new V2D(339,423), new V2D(344,432)]]); // M
linesOrthoPairs.push([[new V2D(253,449), new V2D(369,442)],[new V2D(369,442), new V2D(358,422)]]); // SPACE
linesOrthoPairs.push([[new V2D(430,390), new V2D(442,405)],[new V2D(442,406), new V2D(491,404)]]); // FXNS
// moar points
linesOrthoPairs.push([[new V2D(521,423), new V2D(543,395)],[new V2D(570,420), new V2D(497,397)]]); // NUMS
linesOrthoPairs.push([[new V2D(158,405), new V2D(417,391)],[new V2D(417,391), new V2D(453,438)]]); // KEYS

// visual feedback of orthogonal lines
for(i=0;i<linesOrthoPairs.length;++i){
	pair = linesOrthoPairs[i];
	pa = pair[0][0];
	pb = pair[0][1];
	pc = pair[1][0];
	pd = pair[1][1];
	// draw
	d = new DO();
	d.graphics().clear();
	// 1
	d.graphics().setLine(1.0,0x999966FF);
	d.graphics().beginPath();
	d.graphics().moveTo(pa.x,pa.y);
	d.graphics().lineTo(pb.x,pb.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	// 2
	d.graphics().setLine(1.0,0x99FF6699);
	d.graphics().beginPath();
	d.graphics().moveTo(pc.x,pc.y);
	d.graphics().lineTo(pd.x,pd.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	// add
	this._root.addChild(d);
}

// construct least squares matrix
// A
// var cols = 6;
// B
var cols = 5;

var Aconic = new Matrix(linesOrthoPairs.length,cols);
var Xconic = new Matrix(cols,1);
var Bconic = new Matrix(Aconic.rows(),1);
for(i=0;i<linesOrthoPairs.length;++i){
	pair = linesOrthoPairs[i];
	pa = pair[0][0];
	pb = pair[0][1];
	pc = pair[1][0];
	pd = pair[1][1];
	a = new V3D(pa.x,pa.y,1);
	b = new V3D(pb.x,pb.y,1);
	l = V3D.cross(a,b);
	//l.homo();
	c = new V3D(pc.x,pc.y,1);
	d = new V3D(pd.x,pd.y,1);
	m = V3D.cross(c,d);
	//m.homo();
	//
	// console.log("...")
	// console.log(a.toString()+" | "+b.toString())
	// console.log(c.toString()+" | "+d.toString())
	// console.log("...")
	// console.log(l.toString()+" | "+m.toString())
	//
	Aconic.set(i,0, l.x*m.x );
	Aconic.set(i,1, (l.x*m.y+l.y*m.x)*0.5 );
	Aconic.set(i,2, l.y*m.y );
	Aconic.set(i,3, (l.x*m.z+l.z*m.x)*0.5 );
	Aconic.set(i,4, (l.y*m.z+l.z*m.y)*0.5 );
	// A
	// Aconic.set(i,5, l.z*m.z );
	// Bconic.set(i,0, 0 );
	// B
	Bconic.set(i,0, -(l.z*m.z) );
}
console.log("... A|B");
console.log(Aconic.toString());
console.log(Bconic.toString());
// A
// console.log("... SVD time")
// var svd = Matrix.SVD(Aconic);
// var Cconic = svd.V.colToArray(5);
// console.log(Cconic.toString())
// var sca = 1.0;
// a = Cconic[0]/sca;
// b = Cconic[1]/sca;
// c = Cconic[2]/sca;
// d = Cconic[3]/sca;
// e = Cconic[4]/sca;
// f = 1.0/sca;

// B
console.log("... solve time")
//Xconic = Matrix.solve(Aconic,Bconic);
Ainv = Matrix.pseudoInverseSimple(Aconic);
//Ainv = Matrix.pseudoInverseSVD(Aconic);
console.log(Ainv);
Xconic = Matrix.mult(Ainv,Bconic);
console.log("... X:");
console.log(Xconic.toString());
var sca = 1.0;//1E5;
a = Xconic.get(0,0)/sca;
b = Xconic.get(1,0)/sca;
c = Xconic.get(2,0)/sca;
d = Xconic.get(3,0)/sca;
e = Xconic.get(4,0)/sca;
f = 1.0/sca;


console.log("vars: "+a+" "+b+" "+c+" "+d+" "+e+" "+f)

// construct infinite conic
var infinConic = new Matrix(3,3);
infinConic.setFromArray([a,b*0.5,d*0.5, b*0.5,c,e*0.5, d*0.5,e*0.5,f]);
console.log(infinConic.toString());


// EIGENVECTORS?
var eigs = Matrix.eigenValuesAndVectors(infinConic);
var eigVec = eigs.vectors;
var eigVal = eigs.values;
var eigenU = new Matrix(3,3); // orthonormal
var eigenV = new Matrix(3,3); // diagonal
for(i=0;i<3;++i){ // column
	eigenV.set(i,i, eigVal[i]);
	for(j=0;j<3;++j){ // row
		eigenU.set(j,i, eigVec[i].get(j,0) );
	}
}
console.log("... EIGEN")
console.log(eigenU.toString())
console.log(eigenV.toString())
var eigenU_T = Matrix.transpose(eigenU);


svd = Matrix.SVD(infinConic);
console.log("... SVD")
console.log(svd.U.toString());
console.log(svd.S.toString());
console.log(svd.V.toString());

var lambda0 = svd.S.get(0,0);
var lambda1 = svd.S.get(1,1);
var lambda2 = svd.S.get(2,2);

//var D = new Matrix(3,3).setFromArray([Math.sqrt(lambda0),0,0, 0,Math.sqrt(lambda1),0, 0,0,Math.sqrt(lambda2)]);
var D = new Matrix(3,3).setFromArray([Math.sqrt(lambda0),0,0, 0,Math.sqrt(lambda1),0, 0,0,10]);
var E = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,1]);

var U = svd.U;
var S = svd.S;
var V = svd.V;
U = Matrix.mult(U,D);
// more accurate:
// U.setFromArray([
//   -3.9936e+02, -5.2657e+01, -2.0606e-05,
//   -4.2094e+02, 4.9958e+01, -2.4337e-04,
//   -9.9889e-01, 9.9942e-02, 1.1080e-01]);


var U_T = Matrix.transpose(U);


var newA = Matrix.mult(U,Matrix.mult(E,U_T));
console.log("COMPARE:");
console.log(newA.toString());
console.log("VS:");
console.log(infinConic.toString());

// need upper cholesky factorization to find K of KK^T


// U = eigenU;
// V = eigenU;
// U_T = eigenU_T;

console.log("...");


/*
var D = new Matrix(3,3).setFromArray([Math.sqrt(lambda0),0,0, 0,Math.sqrt(lambda1),0, 0,0,10]);
U = Matrix.mult(U,D);
U_T = Matrix.transpose(U);
var A = Matrix.mult(U,Matrix.mult(S,U_T));
console.log("......A:");
console.log(A.toString());
console.log("......SVD:");
svd = Matrix.SVD(A);
console.log(svd.U.toString());
console.log(svd.S.toString());
console.log(svd.V.toString());
console.log("...")
*/
//var homography = Matrix.transpose(U);
//var homography = svd.U;
var homography = U;
//homography = Matrix.inverse(homography);

homography = Matrix.transform2DScale(homography,1E-2);
homography = Matrix.transform2DTranslate(homography,-400,-100);


/*
var U = svd.U;

///degenSigma = new Matrix(3,3).setFromArray([lambda0,0,0, 0,lambda1,0, 0,0,lambda2]);
degenSigma = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,0]);
var Nconic = Matrix.mult(U,Matrix.mult(degenSigma, Matrix.transpose(U) ));
console.log(Nconic.toString());

svd = Matrix.SVD(Nconic);
console.log("... AGAIN")
console.log(svd.U.toString());
console.log(svd.S.toString());
console.log(svd.V.toString());

var degenSigma = Matrix.mult(D,infinConic);
*/
//var homography = svd.U;//Matrix.mult(svd.U,degenSigma);
//var homography = Matrix.transpose(svd.U);

console.log(homography.toString());
console.log("=============================");

// dual is/are circular points

// projectivity = ?

/*
console.log("...")





	var lineA = Code.lineEquationFromPoints2D(points[0],points[3]);
	var lineB = Code.lineEquationFromPoints2D(points[1],points[2]);

var pA = new V3D(points[0].x,points[0].y,1.0);
var pB = new V3D(points[3].x,points[3].y,1.0);
var lA = V3D.cross(pA,pB);
console.log(lineA)
console.log(lineA.a/lineA.c,lineA.b/lineA.c,lineA.c/lineA.c)
console.log(lA)
lA.homo();
console.log(lA)
lineA.a = lA.x;
lineA.b = lA.y;
lineA.c = lA.z;

var pC = new V3D(points[1].x,points[1].y,1.0);
var pD = new V3D(points[2].x,points[2].y,1.0);
var lB = V3D.cross(pC,pD);
console.log(lineB)
console.log(lB)
lB.homo();
console.log(lB)
lineB.a = lB.x;
lineB.b = lB.y;
lineB.c = lB.z;

	var intersectionAB = Code.homoIntersectionFromLines2D(lineA.a,lineA.b,lineA.c, lineB.a,lineB.b,lineB.c);
	intersectionAB.homo();

	var lineC = Code.lineEquationFromPoints2D(points[0],points[1]);
	var lineD = Code.lineEquationFromPoints2D(points[2],points[3]);

var lC = V3D.cross(pA,pC);
lC.homo();
lineC.a = lC.x;
lineC.b = lC.y;
lineC.c = lC.z;

var lD = V3D.cross(pD,pB);
lD.homo();
lineD.a = lD.x;
lineD.b = lD.y;
lineD.c = lD.z;

	var intersectionCD = Code.homoIntersectionFromLines2D(lineC.a,lineC.b,lineC.c, lineD.a,lineD.b,lineD.c);
	intersectionCD.homo();

		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0,0xFF00FF00);
		d.graphics().beginPath();
		// AB
		d.graphics().moveTo(points[2].x,points[2].y);
		d.graphics().lineTo(intersectionAB.x,intersectionAB.y);
		d.graphics().moveTo(points[3].x,points[3].y);
		d.graphics().lineTo(intersectionAB.x,intersectionAB.y);
		// CD
		d.graphics().moveTo(points[0].x,points[0].y);
		d.graphics().lineTo(intersectionCD.x,intersectionCD.y);
		d.graphics().moveTo(points[3].x,points[3].y);
		d.graphics().lineTo(intersectionCD.x,intersectionCD.y);

		// AB-CD
		//d.graphics().setLine(1.0,0xFF0000FF);
		d.graphics().moveTo(intersectionAB.x,intersectionAB.y);
		d.graphics().lineTo(intersectionCD.x,intersectionCD.y);

		d.graphics().endPath();
		d.graphics().strokeLine();
		this._root.addChild(d);

	var lineInf = Code.lineEquationFromPoints2D(intersectionAB,intersectionCD);
	console.log("INFINIT LINE: ")
	console.log(lineInf);

	//var lineInf2 = Code.homoLineFromPoints2D (intersectionAB,intersectionCD);
	var lineInf2 = Code.homoLineFromPoints2D (intersectionAB.x,intersectionAB.y,intersectionAB.z, intersectionCD.x,intersectionCD.y,intersectionCD.z);
	console.log("INFINIT LINE:  ... 2:")
	console.log(lineInf2);

lineInf.a = lineInf2.x;
lineInf.b = lineInf2.y;
lineInf.c = lineInf2.z;

	// show points on screen
	rad = 3.0;
	for(i=0;i<points.length;++i){
//console.log(points[i].toString()+"  =>  "+planePoints[i].toString())
		p = points[i];
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().setFill(0x00FF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(p.x,p.y, rad);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
		this._root.addChild(d);
	}
	// create homography (this is the solution looking for) H = Hp * Ha * Hm
	//var homography = Matrix.get2DProjectiveMatrix(planePoints,points);

	// unknown homography
	var homography = new Matrix(3,3).identity(); // current image
	Ha = new Matrix(3,3).identity();
	
	//console.log(homography.toString());
	var lInf = new V3D(lineInf.a,lineInf.b,lineInf.c);
lInf.homo();
// lInf.x = -lInf.x;
// lInf.y = -lInf.y;
	var lineMatrix = (new Matrix(3,3)).setFromArray([1,0,0, 0,1,0, lInf.x,lInf.y,lInf.z]);
	console.log("lineMatrix")
	console.log(lineMatrix.toString())
//	var lmInv = Matrix.inverse(lineMatrix);
//	console.log(lmInv.toString());
//	Ha = Matrix.mult(homography,lmInv);
//	Ha = Matrix.mult(lmInv,homography);
//	console.log(Ha.toString());

	homography = Matrix.mult(Ha,lineMatrix);
	console.log(homography.toString())

// find conic at infinity in original image: 
// l*C*m = 0 
// a*l1*m1
// b*(l1*m2+l2*m1)/2
// c*l2m2
// d*(l1*m3+l3*m1)/2
// e*(l2*m3+l3*m2)/2
// f*l3*m3
// 5 unknowns: a,b,c,d,e,f
// [l1*m1 , (l1*m2+l2*m1)/2 , l2m2, (l1*m3+l3*m1)/2, (l2*m3+l3*m2)/2 , l3*m3] [a,b,c,d,e,f]T = 0
// 5 paris of orthogonal lines to find C*inf

*/


	// 
	//homography = Ha
	//homography = lineMatrix
	//homography = lmInv;
	//homography = Matrix.transpose(lmInv);
	//homography = Matrix.transpose(lineMatrix);

	var pt = new V3D(0,0,1);
	pt = new V3D(159,397);
	homography.multV2DtoV3D(pt,pt)
	console.log( ".........." )
	console.log( pt.toString() )
	pt.homo()
	console.log( pt.toString() )
	console.log( ".........." )




// USE TRANSFORMED CORNERS TO SCALE IT TO FIT IN WINDOW

// this sadly qualifies as affine
//homography = new Matrix(3,3).identity();
//homography = Matrix.inverse(homography);
//homography = Matrix.transpose(homography);
console.log(homography.toString())
//homography = Matrix.transform2DRotate(homography,Math.PI/10.0);
/*
homography = Matrix.transform2DScale(homography,0.05,0.007);
homography = Matrix.transform2DTranslate(homography,100,2200);
*/
//homography = Matrix.transform2DScale(homography,10,0.5);
// homography = Matrix.transform2DScale(homography,0.005);
// homography = Matrix.transform2DTranslate(homography,200,10);

//homography = Matrix.inverse(homography);
	//homography = Matrix.transform2DTranslate(homography,-pt.x,-pt.y);
	//homography = Matrix.transform2DScale(homography,2);
	//homography = Matrix.transform2DTranslate(homography,-200,-75);
	//homography = Matrix.transform2DTranslate(homography,-30,50);
	//var tX = 0, tY = 0;
	// var tX = -200, tY = -50;
	// //var tX = pt.x, tY = pt.y;
	// var b;
	// b = Matrix._transformTemp.setFromArray([1.0,0.0,tX, 0.0,1.0,tY, 0.0,0.0,1.0]);
	// //homography = Matrix.mult(b,homography);
	// homography = Matrix.mult(homography,b);

	// show transformed block
	//var imagePlaneMat = ImageMat.extractRectWithProjection(imageMat,imageWidth,imageHeight, planeWidth,planeHeight, homography);
	var imagePlaneMat = ImageMat.extractRectWithProjection(imageMat,imageWidth,imageHeight, planeWidth,planeHeight, homography);
	//var imagePlaneMat = ImageMat.applyProjection(imageMat,imageWidth,imageHeight, planeWidth,planeHeight, homography);
	var imagePlaneARGB = ImageMat.ARGBFromFloats(imagePlaneMat.red(),imagePlaneMat.grn(),imagePlaneMat.blu());
	var imagePlane = this._stage.getARGBAsImage(imagePlaneARGB, planeWidth,planeHeight);
	d = new DOImage(imagePlane);
	d.matrix().identity();
	d.matrix().translate(imageWidth,0);
	this._root.addChild(d);
	console.log(".........");
	/*
	

find line@inf
get affine from projective
	*/
}
Trans.prototype.handleEnterFrame = function(e){
	console.log(e);
}
Trans.prototype.a = function(){
	//
}


