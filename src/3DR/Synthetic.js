// Synthetic.js

function Synthetic(){
	this.testA();
	this.createDisplay();
	this.defineCameras();
	this.generate3DPoints();
	this.projectPointsTo2D();
	this.display2DPoints();
	this.pointCalculations();
	this.display2DPoints();
	console.log("done");
}
Synthetic.prototype.createDisplay = function(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
}
Synthetic.prototype.defineCameras = function(){
	var cam;
	var cameras = [];
	var f = 750;
	var fx = f;
	var fy = f;
	var s = 0.00;
	var width = 400;
	var height = 300;
	var cx = width*0.5 + 0;
	var cy = height*0.5 + 0;
	var tx = 0;
	var ty = 0;
	var tz = 5;
		cam = {};
		cam.width = width;
		cam.height = height;
		cam.K = new Matrix(3,3).setFromArray([fx, s, cx,  0.0, fy, cy,  0.0, 0.0, 1.0]);
		cam.M = new Matrix(4,4).identity();
//cam.M = Matrix.transform3DTranslate(cam.M, -0.1, 0.0, 0.0);
		cam.M = Matrix.transform3DRotateZ(cam.M, Math.TAU/10.0);
		cam.M = Matrix.transform3DRotateX(cam.M, Math.TAU/4.0);
		//cam.M = Matrix.transform3DRotateZ(cam.M, Math.TAU/10.0);
		cam.M = Matrix.transform3DTranslate(cam.M, -0.5, 0.5, 0.5);
		cam.M = Matrix.transform3DTranslate(cam.M, tx, ty, tz);
		cam.M = Matrix.transform3DTranslate(cam.M, 0.0, 0.3, 0.5);
//cam.M = Matrix.transform3DTranslate(cam.M, -0.5, 0.10, 0.0);
	cameras.push(cam);
		cam = {};
		cam.width = width;
		cam.height = height;
		cam.K = new Matrix(3,3).setFromArray([fx, s, cx,  0.0, fy, cy,  0.0, 0.0, 1.0]);
		cam.M = new Matrix(4,4).identity();
//cam.M = Matrix.transform3DTranslate(cam.M, -0.5, 0.0, -0.5);
		cam.M = Matrix.transform3DRotateZ(cam.M, Math.TAU/10.0);
		cam.M = Matrix.transform3DRotateX(cam.M, Math.TAU/3.0);
		//cam.M = Matrix.transform3DRotateZ(cam.M, Math.TAU/10.0);
		cam.M = Matrix.transform3DTranslate(cam.M, -0.5, 0.5, 0.5);
		cam.M = Matrix.transform3DTranslate(cam.M, tx, ty, tz);
		cam.M = Matrix.transform3DTranslate(cam.M, 0.0, 0.5, 1.0);
	cameras.push(cam);

	this._cameras = cameras;
}
Synthetic.prototype.generate3DPoints = function(){
	var points3D = [];
	// cube-house
	points3D.push(new V3D(0.0, 0.0, 0.0)); // bot
	points3D.push(new V3D(1.0, 0.0, 0.0));
	points3D.push(new V3D(1.0, 1.0, 0.0));
	points3D.push(new V3D(0.0, 1.0, 0.0));
	points3D.push(new V3D(0.0, 0.0, 1.0)); // top
	points3D.push(new V3D(1.0, 0.0, 1.0));
	points3D.push(new V3D(1.0, 1.0, 1.0));
	points3D.push(new V3D(0.0, 1.0, 1.0));
	points3D.push(new V3D(0.5, 0.0, 1.5)); // roof
	points3D.push(new V3D(0.5, 1.0, 1.5));
	// 
	this._points3D = points3D;
}
Synthetic.prototype.projectPointsTo2D = function(){
	var i, len, j, cams, v, p2d, p3d, cam;
	var points3D = this._points3D;
	cams = this._cameras;
	for(j=0; j<cams.length; ++j){
		cam = cams[j];
		var points2D = [];
		var M = new Matrix(3,4).setFromArray(cam.M.toArray());
		var K = cam.K.copy();
		var P = Matrix.mult( K, M );
			P.appendRowFromArray([0.0, 0.0, 0.0, 1.0]);
		var width = cam.width;
		var height = cam.height;
		len = points3D.length;
		for(i=0;i<len;++i){
			p3d = points3D[i];
			v = P.multV3DtoV3D(new V3D(), p3d);
			if(v.z < 0){
				console.log("behind camera: "+v.toString());
				p2d = null;
			}else{
				if(v.z!=0){
					p2d = new V2D(v.x/v.z, v.y/v.z);
					if((p2d.x<0 || p2d.x>width) || (p2d.y<0 || p2d.y>height)){
						p2d = null;
					}
				}else{
					p2d = new V2D(0,0);
				}
			}
			points2D.push(p2d);
		}
		cam.points2D = points2D;
	}
}
Synthetic.prototype.display2DPoints = function(){
	var i, j, len, p, path, cams;
	var offset = new V2D(0,0);
	cams = this._cameras;
	for(j=0;j<cams.length;++j){
		var cam = cams[j];
		var points2D = cam.points2D;
		len = points2D.length;
		path = new DO();
		path.graphics().clear();
		path.graphics().setLine(1.0,0xFF0000FF);
		path.graphics().beginPath();
		this._root.addChild(path);
		path.matrix().identity();
		path.matrix().translate(offset.x,offset.y);
		for(i=0; i<len; ++i){
			p = points2D[i];
			if(!p){
				continue;
			}
			var d = new DO();
			d.graphics().clear();
			d.graphics().setFill(0xFF990000);
			d.graphics().setLine(1.0,0xFF000000);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y,2.0);
			d.graphics().endPath();
			d.graphics().strokeLine();
			d.graphics().fill();
			path.addChild(d);
			if(i==0){
				path.graphics().moveTo(p.x,p.y);
			}else{
				path.graphics().lineTo(p.x,p.y);
			}
		}
		path.graphics().strokeLine();
		path.graphics().endPath();
		offset.x += cam.width;
		offset.y += 0;
	}
}

Synthetic.prototype.handleMouseClickFxn = function(v){
	console.log("click: "+v);
}



Synthetic.prototype.pointCalculations = function(v){
	console.log("calc");
	var i, j, len, cams, cam, camA, camB, p2dA, p2dB, p3d, points2D, points3D, Ka, Kb, Pab, Pa, Pb, M, P, F, E;
	var pointsA, pointsB;
	cams = this._cameras;
	points3D = this._points3D;
	for(j=0; j<cams.length; ++j){
		camA = cams[j];
		camB = cams[(j+1)%cams.length];
		len = camA.points2D.length;
		pointsA = [];
		pointsB = [];
		for(i=0; i<len; ++i){
			p2dA = camA.points2D[i];
			p2dB = camB.points2D[i];
			p3d = points3D[i];
			if(p2dA && p2dB && p3d){
				pointsA.push( new V3D(p2dA.x,p2dA.y,1.0) );
				pointsB.push( new V3D(p2dB.x,p2dB.y,1.0) );
			}
		}
		//
		Pa = camA.M.copy();
		PaInv = Matrix.inverse(Pa);
		Pb = camB.M.copy();
		PbInv = Matrix.inverse(Pb);
Ra = camA.M.getSubMatrix(0,0, 3,3);
Rb = camB.M.getSubMatrix(0,0, 3,3);
RaI = Matrix.inverse(Ra);
RbI = Matrix.inverse(Rb);
Rab = Matrix.mult(Ra,RbI);
Ta = camA.M.getSubMatrix(0,3, 3,1);
Tb = camB.M.getSubMatrix(0,3, 3,1);
TbN = Tb.copy().scale(-1);
Tab = Matrix.add(Ta,TbN);
// Rab = Ra
// Tab = Ta
Pab = Rab.copy().appendColFromArray( Tab.toArray() ).appendRowFromArray([0,0,0,1]);
		//Pab = Matrix.mult(Pb,PaInv);
		//Pab = Matrix.mult(PaInv,Pb);
		//Pab = Matrix.mult(Pa,PbInv);
		//Pab = Matrix.mult(Pa,Pb);
		//Pab = Matrix.inverse(Pab);




















		F = R3D.fundamentalMatrix(pointsB,pointsA);
		// var fundamental = R3D.fundamentalRANSACFromPoints(pointsA,pointsB);
		// fundamental = R3D.fundamentalMatrixNonlinear(fundamental,pointsA,pointsB);
		// F = fundamental
		// console.log("F:"+F.toString());
		Ka = camA.K;
		Kb = camB.K;
		KaT = Matrix.transpose(Ka);
		KbT = Matrix.transpose(Kb);
	var KaInv = Matrix.inverse(Ka);
	var KbInv = Matrix.inverse(Kb);
		E = Matrix.mult(F,Ka);
		E = Matrix.mult(KbT,E);

		/* // TEST p1 * K * p0 = 0
		var index = 0;
		var p0 = pointsA[index];
		var p1 = pointsB[index];
		p0 = KaInv.multV3DtoV3D(new V3D(),p0);
		p1 = KbInv.multV3DtoV3D(new V3D(),p1);
		p0 = new Matrix(1,3).fromArray(p0.toArray());
		p1 = new Matrix(3,1).fromArray(p1.toArray());
		console.log("p0:\n"+p0.toString());
		console.log("p1:\n"+p1.toString());
		//console.log("F:\n"+F.toString());
		console.log("E:\n"+E.toString());
		var r = Matrix.mult(p0,Matrix.mult(E,p1));
		//var r = Matrix.mult(p0,Matrix.mult(F,p1));
		console.log("r:\n"+r.toString());
		*/

// VERIFY F BY DRAWLING EPIPOLAR LINES
// var epipoles = R3D.getEpipolesFromF(F,true);
// console.log(epipoles);

//var fundamental = F;
var fundamental = Matrix.transpose(F);
var fundamentalInverse = Matrix.transpose(fundamental);
for(var k=0;k<pointsA.length;++k){
	if(!pointsA[k] || !pointsB[k]){ continue; }
	var pointA = pointsA[k];
	var pointB = pointsB[k];
	pointA = new V3D(pointA.x,pointA.y,1.0);
	pointB = new V3D(pointB.x,pointB.y,1.0);
	var lineA = new V3D();
	var lineB = new V3D();

	
	fundamental.multV3DtoV3D(lineA, pointA);
	fundamentalInverse.multV3DtoV3D(lineB, pointB);

	var d, v;
	var dir = new V2D();
	var org = new V2D();
	var imageWidth = camA.width;
	var imageHeight = camA.height;
	var scale = 500; // imageWidth + imageHeight;
	//
	//
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	dir.scale(scale);
	d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(imageWidth+org.x-dir.x,org.y-dir.y);
	d.graphics().lineTo(imageWidth+org.x+dir.x,org.y+dir.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	this._root.addChild(d);
	//
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
	dir.scale(scale);
	d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo( 0 + org.x-dir.x,org.y-dir.y);
	d.graphics().lineTo( 0 + org.x+dir.x,org.y+dir.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	this._root.addChild(d);
}


		//
		// console.log("Pa:\n"+Pa.toString());
		// console.log("PaInv:\n"+PaInv.toString());
		// console.log("Pb: "+Pb.toString());
		// console.log("Pab:\n"+Pab.toString());
// console.log("Pab:\n"+(Matrix.mult(Pb,PaInv)).toString());
// console.log("Pab:\n"+(Matrix.mult(PaInv,Pb)).toString());
// console.log("Pab:\n"+(Matrix.mult(Pa,PbInv)).toString());
// console.log("Pab:\n"+(Matrix.mult(PbInv,Pa)).toString());
// NORMALIZE POINTS ???????
		//
		var W = new Matrix(3,3).setFromArray([0.0, -1.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, 1.0]);
		var Wt = Matrix.transpose(W);
		//var Z = new Matrix(3,3).setFromArray([0.0, 1.0, 0.0,  -1.0, 0.0, 0.0,  0.0, 0.0, 0.0]);
		var diag110 = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,0]);
		var svd, U, S, V, Vt;
		// force D = 1,1,0
			// svd = Matrix.SVD(E);
			// U = svd.U;
			// S = svd.S;
			// V = svd.V;
			// S = diag110;
			// console.log("U:"+U.toString());
			// console.log("S:"+S.toString());
			// console.log("V:"+V.toString());
			// //E = Matrix.mult(U,Matrix.mult(S,Vt));
		svd = Matrix.SVD(E);
		U = svd.U;
		S = svd.S;
		V = svd.V;
		Vt = Matrix.transpose(V);
		var t = U.getCol(2);
		console.log("t: "+t.toString());
		var tNeg = t.copy().scale(-1.0);
		// four possible solutions
	// one of 4 possible solutions
	var possibleA = Matrix.mult(U,Matrix.mult(W,Vt)). appendColFromArray(t.toArray()   ).appendRowFromArray([0,0,0,1]);
	var possibleB = Matrix.mult(U,Matrix.mult(W,Vt)). appendColFromArray(tNeg.toArray()).appendRowFromArray([0,0,0,1]);
	var possibleC = Matrix.mult(U,Matrix.mult(Wt,Vt)).appendColFromArray(t.toArray()   ).appendRowFromArray([0,0,0,1]);
	var possibleD = Matrix.mult(U,Matrix.mult(Wt,Vt)).appendColFromArray(tNeg.toArray()).appendRowFromArray([0,0,0,1]);
	var possibles = [];
	possibles.push( possibleA );
	possibles.push( possibleB );
	possibles.push( possibleC );
	possibles.push( possibleD );
	for(i=0;i<possibles.length;++i){
		var m = possibles[i];
		var r = m.getSubMatrix(0,0, 3,3);
		var det = r.det();
		if(det<0){ // ONLY WANT TO FLIP ROTATION MATRIX - NOT FULL MATRIX
			console.log("FLIP "+i+" : "+det);
			r.scale(-1.0);
			r.appendColFromArray( m.getSubMatrix(0,3, 3,1).toArray() );
			r.appendRowFromArray([0,0,0,1]);
			possibles[i] = r;
		}
//possibles[i] = Matrix.multV3DtoV3D(possibles[i]);
	}



	// find single matrix that results in 3D point in front of both cameras Z>0
	var index = 1;
	var pA = pointsA[index];
	var pB = pointsB[index];
	var p3D = points3D[index];
	console.log("p3D: "+p3D.toString());
	console.log("pA: "+pA.toString());
	pA = KaInv.multV3DtoV3D(new V3D(), pA);
	pB = KbInv.multV3DtoV3D(new V3D(), pB);
	// console.log("pA: "+pA.toString());
	// pA.homo();
	// pB.homo();
	// console.log("pA: "+pA.toString());

	var pAx = Matrix.crossMatrixFromV3D( pA );
	var pBx = Matrix.crossMatrixFromV3D( pB );

	var M1 = new Matrix(3,4).setFromArray([1,0,0,0, 0,1,0,0, 0,0,1,0]);
//M1 = camA.M.getSubMatrix(0,0, 3,4);
//M1 = camB.M.getSubMatrix(0,0, 3,4);
//console.log("M1:\n"+M1.toString());
	var projection = null;
	len = possibles.length;
	for(i=0;i<len;++i){
		var possible = possibles[i];
		var possibleInv = Matrix.inverse(possible);
		var M2 = possibleInv.getSubMatrix(0,0, 3,4);
		var pAM = Matrix.mult(pAx,M1);
		var pBM = Matrix.mult(pBx,M2);
		
		var A = pAM.copy().appendMatrixBottom(pBM);

		svd = Matrix.SVD(A);
		var P1 = svd.V.getCol(3);
		var p1Norm = new V4D().setFromArray(P1.toArray());
		p1Norm.homo(); // THIS IS THE ACTUAL 3D POINT - LOCATION
		//console.log("p1Norm:"+p1Norm.toString());
		var P1est = new Matrix(4,1).setFromArray( p1Norm.toArray() );

		var P2 = Matrix.mult(possibleInv,P1est);
		//var P2 = Matrix.mult(possible,P1est);
		var p2Norm = new V4D().setFromArray(P2.toArray());
		//p2Norm.homo(); // not necessary?
		//console.log("p2Norm:"+p2Norm.toString());
		
		if(p1Norm.z>0 && p2Norm.z>0){
		//if(p1Norm.z<=0 && p2Norm.z<=0){
			console.log(".......................>>XXX");
			projection = possible;
break;
		}
	}
// camA.M.identity();
	// console.log("projection:");
	// console.log(projection.toString());
	cam = {}
	cam.width = camA.width;
	cam.height = camA.height;
	cam.K = camA.K.copy();
	//var delta = Matrix.inverse(projection);
	var delta = projection.copy();
	console.log("delta:\n"+delta.toString());

var oDir = delta.multV3DtoV3D(new V3D(), new V3D(0,0,0));
var xDir = delta.multV3DtoV3D(new V3D(), new V3D(1,0,0));
var yDir = delta.multV3DtoV3D(new V3D(), new V3D(0,1,0));
var zDir = delta.multV3DtoV3D(new V3D(), new V3D(0,0,1));
console.log("o:"+oDir.toString());
console.log("x:"+xDir.toString()+" == "+V3D.distance(oDir,xDir));
console.log("y:"+yDir.toString()+" == "+V3D.distance(oDir,yDir));
console.log("z:"+zDir.toString()+" == "+V3D.distance(oDir,zDir));
// delta.set(0,3, 0);
// delta.set(1,3, 3.3072E+0);
// delta.set(2,3, 9.0385E-1);
// delta.set(1,2, -0.5);
// delta.set(2,1, 0.5);
// console.log("delta:\n"+delta.toString());
	cam.M = Matrix.mult(delta,camA.M.copy());

// 3D LOCATIONS IN TERMS OF PROJECTION MATRIX:
len = points3D.length;
for(i=0;i<len-1;++i){
	var pA = points3D[i];
	var pB = points3D[i+1];
//	console.log("distance: "+V3D.distance(pA,pB));
}
var M1 = new Matrix(3,4).setFromArray([1,0,0,0, 0,1,0,0, 0,0,1,0]);
// M1 = camA.M.getSubMatrix(0,0, 3,4);
var M2 = projection.getSubMatrix(0,0, 3,4);
var points3D_2 = [];
for(i=0;i<len;++i){
	var pA = pointsA[i];
	var pB = pointsB[i];
	pA = KaInv.multV3DtoV3D(new V3D(), pA);
	pB = KbInv.multV3DtoV3D(new V3D(), pB);
	var p2DA = pA;
	var p2DB = pB;
	if (p2DA && p2DB){
		var p3D = points3D[i];
		var pAx = Matrix.crossMatrixFromV3D( p2DA );
		var pBx = Matrix.crossMatrixFromV3D( p2DB );
		var pAM = Matrix.mult(pAx,M1);
		var pBM = Matrix.mult(pBx,M2);
		var A = pAM.copy().appendMatrixBottom(pBM);
		var svd = Matrix.SVD(A);
		var p = svd.V.getCol(3);
		var pNorm = new V4D().setFromArray(p.toArray()).homo();
		p3D = new V3D(pNorm.x,pNorm.y,pNorm.z);
		points3D_2[i] = p3D;
	}
}
for(i=0;i<len-1;++i){
	var pA = points3D[i];
	var pB = points3D[i+1];
	//console.log(pA.toString());
	//console.log("distance: "+V3D.distance(pA,pB));
}


var euclid = R3D.euclieanTransform3D(points3D,points3D_2);
var eucInv = Matrix.inverse(euclid);
eucInv = R3D.euclieanTransform3D(points3D_2,points3D);
console.log("point transform: \n"+euclid);
for(i=0;i<len;++i){
	var p = points3D_2[i];
	//p = euclid.multV3DtoV3D(new V3D, p);
	p = eucInv.multV3DtoV3D(new V3D, p);
	points3D[i] = p;
}

// // REAL ANSWER:
var aRev = Matrix.inverse(camA.M)
var bFwd = camB.M
delta = Matrix.mult(bFwd,aRev);
console.log("REAL DELTA: \n",delta.toString());
// //var net = Matrix.mult(delta,camA.M.copy());
// //cam.M = net;

	cams.push(cam);
	
	this.projectPointsTo2D();
	
		//
		break;
	}
}






Synthetic.prototype.testA = function(){
return;

	var M, q;
	M = new Matrix3D();
	q = new V4D();

	M.rotateX(Math.TAU/6.0);
	q = M.toQuaternion();
	
	console.log("M:\n"+M.toString());
	console.log("q:\n"+q.toString());

	M.fromQuaternion(q);
	q = M.toQuaternion();

	console.log("M:\n"+M.toString());
	console.log("q:\n"+q.toString());

	M.fromQuaternion(q);
	q = M.toQuaternion();
	
	console.log("M:\n"+M.toString());
	console.log("q:\n"+q.toString());

	return;


	//

	var A, B, C, D, R, T, temp, v;
	A = new Matrix(4,4).identity();
	B = new Matrix(4,4).identity();
	A = Matrix.transform3DRotateX(A,Math.TAU/6.0);
	B = Matrix.transform3DTranslate(B,1,2,3);
	console.log("A:\n"+A.toString());
	console.log("B:\n"+B.toString());

	C = Matrix.mult(B,A);
	console.log("A, B:\n"+C.toString());

	R = C.getSubMatrix(0,0, 3,3);
	T = C.getSubMatrix(0,3, 3,1);
	console.log("R:\n"+R.toString());
	console.log("T:\n"+T.toString());

	temp = new Matrix3D().fromArrayRotation( R.toArray() );
	v = temp.toQuaternion();
	console.log("v: "+v.toString());

	R = new Matrix3D();
	R.fromQuaternion(v);
	R.fromArrayTranslation( T.toArray() );
	//console.log(R);
	R = R.toMatrix();
	console.log("R: "+R.toString());

}






















