// Synthetic.js

function Synthetic(){
	this.createDisplay();
	this.defineCameras();
	this.generate3DPoints();
	this.projectPointsTo2D();
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
		cam.M = Matrix.transform3DRotateZ(cam.M, Math.TAU/10.0);
		cam.M = Matrix.transform3DRotateX(cam.M, Math.TAU/4.0);
		//cam.M = Matrix.transform3DRotateZ(cam.M, Math.TAU/10.0);
		cam.M = Matrix.transform3DTranslate(cam.M, -0.5, 0.5, 0.5);
		cam.M = Matrix.transform3DTranslate(cam.M, tx, ty, tz);
		cam.M = Matrix.transform3DTranslate(cam.M, 0.0, 0.3, 0.5);
	cameras.push(cam);
		cam = {};
		cam.width = width;
		cam.height = height;
		cam.K = new Matrix(3,3).setFromArray([fx, s, cx,  0.0, fy, cy,  0.0, 0.0, 1.0]);
		cam.M = new Matrix(4,4).identity();
		cam.M = Matrix.transform3DRotateZ(cam.M, Math.TAU/10.0);
		cam.M = Matrix.transform3DRotateX(cam.M, Math.TAU/3.0);
		//cam.M = Matrix.transform3DRotateZ(cam.M, Math.TAU/10.0);
		cam.M = Matrix.transform3DTranslate(cam.M, -0.5, 0.5, 0.5);
		cam.M = Matrix.transform3DTranslate(cam.M, tx, ty, tz);
		cam.M = Matrix.transform3DTranslate(cam.M, 0.0, 0.5, 0.0);
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
/*
var Kt = Matrix.transpose(K);
var Ki = Matrix.inverse(K);
var x = M.multV3DtoV3D(new V3D(), p3d);
console.log("y...");
var y = new Matrix(3,1).setFromArray(v.toArray());
//console.log(y.toString());
	//y = Matrix.mult( Kt,y );
	y = Matrix.mult( Ki,y ); ////////////////////////////////////
	y = new V3D().setFromArray( y.toArray() );
console.log("v: "+v.toString()+", x:"+x.toString()+", y:"+y.toString());
*/
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
		//path.graphics().beginPath();
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
		// path.graphics().endPath();
		path.graphics().strokeLine();
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
		F = R3D.fundamentalMatrix(pointsA,pointsB);
		//console.log("F:"+F.toString());
		Ka = camA.K;
		Kb = camB.K;
		KaT = Matrix.transpose(Ka);
		KbT = Matrix.transpose(Kb);
	var KaInv = Matrix.inverse(Ka);
	var KbInv = Matrix.inverse(Kb);
		E = Matrix.mult(F,Ka);
		E = Matrix.mult(KbT,E);
console.log("E:\n"+E.toString());

// CAN VERIFY E BY DRAWLING EPIPOLAR LINES


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
		var Z = new Matrix(3,3).setFromArray([0.0, 1.0, 0.0,  -1.0, 0.0, 0.0,  0.0, 0.0, 0.0]);
		var diag110 = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,0]);
		// force D = 1,1,0
		// S = diag110
		//
		var svd = Matrix.SVD(E);
		var U = svd.U;
		var S = svd.S;
		var V = svd.V;
		var Vt = Matrix.transpose(V);
		var t = U.getCol(2);
		console.log(t.toString())
		var tNeg = t.copy().scale(-1.0);
		// four possible solutions
	// one of 4 possible solutions
	var possibleA = Matrix.mult(U,Matrix.mult(W,Vt));
	possibleA = possibleA.appendColFromArray(t.toArray()   ).appendRowFromArray([0,0,0,1]);
	var possibleB = Matrix.mult(U,Matrix.mult(W,Vt));
	possibleB = possibleB.appendColFromArray(tNeg.toArray()).appendRowFromArray([0,0,0,1]);
	var possibleC = Matrix.mult(U,Matrix.mult(Wt,Vt));
	possibleC = possibleC.appendColFromArray(t.toArray()   ).appendRowFromArray([0,0,0,1]);
	var possibleD = Matrix.mult(U,Matrix.mult(Wt,Vt));
	possibleD = possibleD.appendColFromArray(tNeg.toArray()).appendRowFromArray([0,0,0,1]);
	var possibles = [];
	possibles.push( possibleA );
	possibles.push( possibleB );
	possibles.push( possibleC );
	possibles.push( possibleD );
	var det;
	for(i=0;i<possibles.length;++i){
		var m = possibles[i];
		var r = m.getSubMatrix(0,0, 3,3);
		det = r.det();
		if(det<0){
			// ONLY WANT TO FLIP ROTATION MATRIX - NOT FULL MATRIX
			console.log("FLIP "+i+" : "+det);
			m.scale(-1.0);
		}
	}



	// find single matrix that results in 3D point in front of both cameras Z>0
	var pA = pointsA[0];
	var pB = pointsB[0];
	// to normalized points
	//pA = Matrix.mult( KaT, new Matrix(3,1).setFromArray(pA.toArray()) );
	pA = Matrix.mult( KaInv, new Matrix(3,1).setFromArray(pA.toArray()) );
	//pA = Matrix.mult( new Matrix(3,1).setFromArray(pA.toArray()), KaInv );
		pA = new V3D().setFromArray(pA.toArray());
	//pB = Matrix.mult( KbT, new Matrix(3,1).setFromArray(pB.toArray()) );
	pB = Matrix.mult( KbInv, new Matrix(3,1).setFromArray(pB.toArray()) );
	//pB = Matrix.mult( new Matrix(3,1).setFromArray(pB.toArray()), KbInv );
		pB = new V3D().setFromArray(pB.toArray());
	// console.log("pA:"+pA.toString());
	// console.log("pB:"+pB.toString());

	var x = new Matrix(3,1).setFromArray(pA.toArray());
	var y = new Matrix(3,1).setFromArray(pB.toArray());
		x = Matrix.transpose(x);
	var res = Matrix.mult(x,Matrix.mult(E,y));
	console.log("res:"+res.toString());

	var pAx = Matrix.crossMatrixFromV3D( pA );
	var pBx = Matrix.crossMatrixFromV3D( pB );

	var M1 = new Matrix(3,4).setFromArray([1,0,0,0, 0,1,0,0, 0,0,1,0]);
		// M1 = M1.getSubMatrix(0,0, 3,4);
	var projection = null;
	len = possibles.length;
	for(i=0;i<len;++i){
			// 
		var M2 = possibles[i];
			M2 = M2.getSubMatrix(0,0, 3,4);
		// console.log(i+":\n"+M1.toString());
		// console.log(i+":\n"+M2.toString());
		var pAM = Matrix.mult(pAx,M1);
		var pBM = Matrix.mult(pBx,M2);
		
		var A = pAM.copy().appendMatrixBottom(pBM);
		console.log("A:\n"+A.toString());
		svd = Matrix.SVD(A);
		//console.log(V.toString())
		var P1 = svd.V.getCol(3);
		var p1Norm = new V4D().setFromArray(P1.toArray());
		
		p1Norm.homo();
		
		var P2 = new Matrix(4,1).setFromArray( p1Norm.toArray() );
		P2 = Matrix.mult(M2,P2);
		var p2Norm = new V4D().setFromArray(P2.toArray());
		
		p2Norm.homo();
		
		if(p1Norm.z>0 && p2Norm.z>0){
			console.log(".......................>>XXX");
			projection = M2;
			//break;
		}
	}
	//if(projection){
		console.log("projection:");
		console.log(projection.toString());
	//}
	cam = {}
	cam.width = camA.width;
	cam.height = camA.height;
	cam.K = camA.K.copy();
	cam.M = projection.copy();
	//cam.M = Matrix.mult(camA.M,projection);
	//cam.M = Matrix.mult(projection,camA.M);
	//cam.M = Matrix.mult(camB.M,projection);
	//cam.M = Matrix.mult(projection,camB.M);
	//cam.M = Pab.copy();
	//cam.M = camA.M.copy();
	cams.push(cam);
	//
	this.projectPointsTo2D();
	
		//
		break;
	}
}





























