// SurfaceTri.js
function SurfaceTri(){
	// visuals
	this._canvas2D = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,false);
	this._stage2D = new Stage(this._canvas2D, 1000.0/10.0);
	this._stage2D.start();
	this._root = new DO();
	this._stage2D.root().addChild(this._root);
	// 
	this._canvas3D = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,true);
	this._stage3D = new StageGL(this._canvas3D, 1000.0/10.0, this.getVertexShaders1(), this.getFragmentShaders1());
  	this._stage3D.setBackgroundColor(0x00000000);
	this._stage3D.frustrumAngle(60);
	this._stage3D.enableDepthTest();
	this._stage3D.start();
	// datas
	this._pointCloud = new PointCloud();
	this._mlsMesh = new MLSMesh();
	// // 
	this.plot1D();
	//
	this.setupSphere3D();
}
SurfaceTri.prototype.getVertexShaders1 = function(){
	return ["\
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_PointSize = 3.0; \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
    "];/*,"\
    	attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
	"];*/
}
SurfaceTri.prototype.getFragmentShaders1 = function(){
    return ["\
		precision mediump float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
	"];/*,"\
		precision mediump float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
    "];*/
}
// ------------------------------------------------------------------------------------------------------------------------ 
SurfaceTri.prototype.onEnterFrameFxn3D = function(e){
	//console.log(e);
	this._stage3D.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);
	this._stage3D.clear();
	// 
	this._stage3D.matrixIdentity();
	this._stage3D.matrixTranslate(0.0,0.0,-3.0);
	this._stage3D.matrixRotate(e*0.03, 0,1,0);
	this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._spherePointBuffer);
	this._stage3D.bindArrayFloatBuffer(this._vertexColorAttrib, this._sphereColorBuffer);
	this._stage3D.matrixReset();
	this._stage3D.drawPoints(this._vertexPositionAttrib, this._spherePointBuffer);
	//
	if(this._planeTriangleVertexList){
		// console.log(this._planeTriangleVertexList);
		// console.log(this._planeTriangleColorsList);
		this._stage3D.matrixIdentity();
		this._stage3D.matrixTranslate(0.0,0.0,-3.0);
		this._stage3D.matrixRotate(e*0.03, 0,1,0);
		this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._planeTriangleVertexList);
		this._stage3D.bindArrayFloatBuffer(this._vertexColorAttrib, this._planeTriangleColorsList);
		this._stage3D.matrixReset();
		this._stage3D.drawTriangles(this._vertexPositionAttrib, this._planeTriangleVertexList);
	}
	this._stage3D.matrixReset();
}
SurfaceTri.prototype.setupSphere3D = function(){
	// 
	this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._vertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");

	// POINTS
	var pts = this.generateSpherePoints(200,1.0,0.0);
	var p, i;
	var points = [];
	var colors = [];
	for(i=0;i<pts.length;++i){
		p = pts[i];
		points.push(p.x,p.y,p.z);
		colors.push(Math.random(),Math.random(),Math.random(),1.0);
	}
	this._spherePointBuffer = this._stage3D.getBufferFloat32Array(points,3);
	this._sphereColorBuffer = this._stage3D.getBufferFloat32Array(colors,4);

	// POINT CLOUD
	this._pointCloud.initWithPointArray(pts, true); // force cubes
	this._mlsMesh.initWithPointCloud(this._pointCloud);
	this._mlsMesh.triangulateSurface();

console.log(".................................. display crap ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------");

var plane = this._mlsMesh.crap.plane;
console.log(plane)
var org = plane.point;
var inPlane0 = plane.orthogonalA;
var inPlane1 = plane.orthogonalB;
inPlane0.scale(0.33);
inPlane1.scale(0.33);

var list = [inPlane0.x+org.x,inPlane0.y+org.y,inPlane0.z+org.z,
			inPlane1.x+org.x,inPlane1.y+org.y,inPlane1.z+org.z,
			org.x-(inPlane0.x+inPlane1.x)*0.5,
			org.y-(inPlane0.y+inPlane1.y)*0.5,
			org.z-(inPlane0.z+inPlane1.z)*0.5];
var colors = [1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0];

var transF = this._mlsMesh.crap.forward;
var transR = this._mlsMesh.crap.reverse;
var bivariate = this._mlsMesh.crap.bivariate

var j, k, x, y, z, x1,y1,z11,z12,z21,z22, x2,y2,z2, i1,i2, j1,j2;
var p11 = new V3D(), p21 = new V3D(), p12 = new V3D(), p22 = new V3D();
var sca = 0.1;
for(j=0;j<10;++j){
	j1 = j;
	j2 = j+1;
	for(i=0;i<10;++i){
		i1 = i;
		i2 = i+1;
		//
		x1 = (-5 + i1)*sca;
		x2 = (-5 + i2)*sca;
		y1 = (-5 + j1)*sca;
		y2 = (-5 + j2)*sca;
		z11 = bivariate.valueAt(x1,y1);
		z12 = bivariate.valueAt(x1,y2);
		z21 = bivariate.valueAt(x2,y1);
		z22 = bivariate.valueAt(x2,y2);
		//
		p11.set(x1,y1,z11);
		p21.set(x2,y1,z21);
		p12.set(x1,y2,z12);
		p22.set(x2,y2,z22);
		//
		transR.multV3D(p11,p11);
		transR.multV3D(p12,p12);
		transR.multV3D(p21,p21);
		transR.multV3D(p22,p22);
		//
		list.push(p11.x,p11.y,p11.z, p22.x,p22.y,p22.z, p12.x,p12.y,p12.z);
		list.push(p11.x,p11.y,p11.z, p21.x,p21.y,p21.z, p22.x,p22.y,p22.z);
		for(k=0;k<6;++k){
			colors.push(Math.random(),Math.random(),Math.random(), 0.75);
		}
		//colors.push(Math.random(),Math.random(),Math.random(), 0.75);
	}
}


this._planeTriangleVertexList = this._stage3D.getBufferFloat32Array(list,3);
this._planeTriangleColorsList = this._stage3D.getBufferFloat32Array(colors,4);

// console.log(list)
// console.log(colors)
// console.log(this._planeTriangleVertexList)
// console.log(this._planeTriangleColorsList)


	// PLANE FITTING
	//var cov = this.covarianceFromPoints(pts);
//	var plane = this.planeFromPoints(pts);

	// START
	this._stage3D.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this.onEnterFrameFxn3D, this);
}
// find support plane for point r (reference frame)
SurfaceTri.prototype.pointPlaneFromPoints = function(r, points){
	var i,j,k, val, len = points.length;
	var point, iter, maxIter=5;
	var t=0, n=new V3D(), q=new V3D();
	var A,B,C,D,E,F,G,H,I, M = new Matrix(3,3);
	// initial approximation for n, t=0, weights are fixed
	for(j=0;j<3;++j){ // row
		for(k=0;k<3;++k){ // col
			val = 0;
			for(i=0;i<len;++i){
				point = points[i];
				console.log(""+point);
				// ..
				// ..
			}
			M.set(j,k, val);
		}
	}
	// M.setFromArray([A,B,C, B,E,F, C,F,I]);
	// n = eigenvector for smallest eigenvalue of 
	n.set(); // 
	
	// for(iter=0;iter<maxIter;++iter){
	// 	for(i=0;i<len;++i){
	// 		point = points[i];
	// 		console.log(""+point);
	// 		//..
	// 		..
	// 	}
	// 	break;
	// }
	// ...
	return {normal:n, origin:q};
}
// find surface approximation from 
SurfaceTri.prototype.surfaceFromPlanePoints = function(r, normal,origin, points){
	return {};
}
// full process point projected to surface
SurfaceTri.prototype.projectPointToSurface = function(r, points){
	var projection = new V3D();
	var plane = this.pointPlaneFromPoints(r,points);
	var nrm = plane.normal;
	var org = plane.origin;
	var surface = this.surfaceFromPlanePoints(r, nrm,org, points);
	// surface is set of polynomials: cubic/quartic
	// projection = g(0,0) = a*<n>
	return projection;
}
// minimization weighting
SurfaceTri.prototype.distanceWeight = function(q,point, h){ // h should probably be determined by some mean distance between some set of nearby points
	h = h!==undefined?h:1.0; h = h*h;
	var distSquare = distanceSquare(q,point);
	return Math.exp(-distSquare/h);
}
SurfaceTri.prototype.covarianceFromPoints = function(points){
	var dx,dy,dz, p, i, len = points.length;
	//var mu = new V3D();
	var a = 0, b = 0, c = 0;
	var A=0,B=0,C=0, E=0,F=0, I=0;
	// mean
	for(i=0;i<len;++i){
		p = points[i];
		a += p.x;
		b += p.y;
		c += p.z; // centers of mass should be weighted means
	}
	a /= len; b /= len; c /= len;
	for(i=0;i<len;++i){
		p = points[i];
		dx = p.x-a; dy = p.y-b; dz = p.z-c; // divide variance by weight for futher points (weight = 1/error) : w_i = 1/var_i, var_i = variance of ith error
		A += dx*dx;
		B += dx*dy;
		C += dx*dz;
		E += dy*dy;
		F += dy*dz;
		I += dz*dz;
	}
	var cov = new Matrix(3,3).setFromArray([A,B,C, B,E,F, C,F,I]);
	var eig = Matrix.eigenValuesAndVectors(cov);
	var svd = Matrix.SVD(cov);
	console.log(cov.toString());
	console.log(svd);
	var values = eig.values;
	var vectors = eig.vectors;
	var v0 = vectors[0].toV3D();
	var v1 = vectors[1].toV3D();
	var v2 = vectors[2].toV3D();
	console.log(values);
	console.log(v0+"");
	console.log(v1+"");
	console.log(v2+"");
	console.log("...");
	var U = svd.U;
	var S = svd.S;
	var V = svd.V;
	
	console.log(U.toString());
	console.log(S.toString());
	console.log(V.toString());

	var minDir = new V3D().setFromArray(V.colToArray(2));
	var N = new Matrix(3,1).setFromArray(V.colToArray(2));
	console.log(minDir+"");
	console.log(N+"");
	//
	// var A = Matrix.mult(cov,N);
	// A = Matrix.mult(Matrix.transpose(N),A);
	// console.log(A+"");

	var inPlane0 = new V3D().setFromArray(V.colToArray(0));
	var inPlane1 = new V3D().setFromArray(V.colToArray(1));
	var com = new V3D(a,b,c);
	var edge = new V3D();

	// make triangle plane:
	var list = [inPlane0.x+a,inPlane0.y+a,inPlane0.z+c, inPlane1.x+a,inPlane1.y+b,inPlane1.z+c, a,b,c];
	this._planeTriangleVertexList = this._stage3D.getBufferFloat32Array(list,3);
	var colors = [1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0];
	this._planeTriangleColorsList = this._stage3D.getBufferFloat32Array(colors,4);
	console.log("...............");
	console.log(list);
	console.log(colors);
	console.log(this._planeTriangleVertexList)
	console.log(this._planeTriangleColorsList)
	return cov;
}
SurfaceTri.prototype.generateSpherePoints = function(count,radius,error){
	count = count!==undefined?count:25;
	radius = radius!==undefined?radius:1.0;
	error = error!==undefined?error:0.01;
	var i, v, theta, phi, psi, rad, list = [];
	for(i=0;i<count;++i){
		u = Math.random()*2.0-1.0;
		rad = Math.sqrt(1-u*u);
		theta = Math.random()*Math.TAU;
		v = new V3D(rad*Math.cos(theta),rad*Math.sin(theta),u);
		v.scale(radius+(Math.random()-0.5)*error);
		list.push(v);
		//v.set(Math.random()*10-5,Math.random()*10-5,Math.random()*10-5);
		// v.x *= 0.5;
		// v.y *= 1.0;
		// v.z *= 2.0;
	}
	return list;
}
// ------------------------------------------------------------------------------------------------------------------------ 
SurfaceTri.prototype.plot1D = function(){
	var fxn1D = function(x){ return (x-200)*(x-100)*(x+200)*0.00001; } // (-1.0*x*x*x + 2.0*x*x - 5*x - 1.0)
	var minX = -400, maxX = 400;
	var minY = -400, maxY = 400;
	var d, x, y, i, len;
	d = new DO();
	this._root.addChild(d);
	d.matrix().scale(1,-1); // y is positive
	d.matrix().translate(400,400);
	d.graphics().clear();
	// axis
	d.graphics().setLine(1.0,0xFFCC9999);
	d.graphics().beginPath();
	d.graphics().moveTo(minX,0); d.graphics().lineTo(maxX,0);
	d.graphics().moveTo(0,minY); d.graphics().lineTo(0,maxY);
	d.graphics().endPath();
	d.graphics().strokeLine();
	// 1D data
	d.graphics().setLine(2.0,0xFF0000CC);
	d.graphics().beginPath();
	len = 100;
	for(i=0;i<=len;++i){
		x = minX + (1.0*i/len)*(maxX-minX);
		y = fxn1D(x);
		y = Math.min(Math.max(y,minY),maxY);
		if(i==0){
			d.graphics().moveTo(x,y);
		}else{
			d.graphics().lineTo(x,y);
			if(i==len-1){
				d.graphics().moveTo(x,y);
			}
		}
	}
	d.graphics().endPath();
	d.graphics().strokeLine();
	// 1D tangent
	var dx, dy, ymh, yph, dir = new V2D();
	len = 12;
	for(i=0;i<=len;++i){
		x = minX + (1.0*i/len)*(maxX-minX);
		y = fxn1D(x);
		// y = Math.min(Math.max(y,minY),maxY);
		// derivative: (tangent)
		dx = 0.01;
		ymh = fxn1D(x-dx);
		yph = fxn1D(x+dx);
		dy = (yph-ymh)*0.5;
		dir.set(dx,dy); dir.norm(); dir.scale(100.0);
		//dir.set(dx,dy); dir.scale(100000.0); // proportional scaling
		d.graphics().setLine(1.0,0xFFCC0000);
		d.graphics().beginPath();
		//d.graphics().moveTo(x-dir.x,y-dir.y);
		d.graphics().moveTo(x,y);
		d.graphics().lineTo(x+dir.x,y+dir.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		// vector calculus
var dirA = new V2D(x-dx,ymh);
var dirB = new V2D(x+dx,yph);
var dR = V2D.diff(dirB,dirA);
		// right side
		dir.set(dR.y,-dR.x);
		dir.norm(); dir.scale(100.0);
		d.graphics().setLine(1.0,0xFF00CC00);
		d.graphics().beginPath();
		//d.graphics().moveTo(x-dir.x,y-dir.y);
		d.graphics().moveTo(x,y);
		d.graphics().lineTo(x+dir.x,y+dir.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		// left side
		dir.set(-dR.y,dR.x);
		dir.norm(); dir.scale(100.0);
		d.graphics().setLine(1.0,0xFF0000CC);
		d.graphics().beginPath();
		//d.graphics().moveTo(x-dir.x,y-dir.y);
		d.graphics().moveTo(x,y);
		d.graphics().lineTo(x+dir.x,y+dir.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		// curvature
		// second derivative (?)
		// dxdx = dx*dx;
		// dydy = (ymh - 2.0*y + yph)/dx;
		// ym2h = fxn1D(x-2*dx);
		// yp2h = fxn1D(x+2*dx);
		// dy0 = (ymh-ym2h)*0.5;
		// dy1 = (ymh-ym2h)*0.5;
		// dy2 = (yp2h-ymh)*0.5;
var dirR0 = new V2D(x-dx,ymh);
var dirR1 = new V2D(x,y);
var dirR2 = new V2D(x+dx,yph);
var dRA = V2D.sub(dirR1,dirR0); dRA.norm(); // unit tangent 1
var dRB = V2D.sub(dirR2,dirR1); dRB.norm(); // unit tangent 2
var dRdR = V2D.sub(dRB,dRA); dRdR.scale(1/dx);
dir.set(dRdR.x,dRdR.y);
kappa = dRdR.length();
radius = 1/kappa;
		dir.norm(); dir.scale(radius);
		d.graphics().setLine(1.0,0xFF000000);
		d.graphics().beginPath();
		//d.graphics().moveTo(x-dir.x,y-dir.y);
		d.graphics().moveTo(x,y);
		d.graphics().lineTo(x+dir.x,y+dir.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		//ddy = (dy2-dy1)*0.5;
		// circle
		d.graphics().beginPath();
dRdR.norm();
radius *= 1E-1; // display purposes
		d.graphics().drawCircle(x+dRdR.x*radius,y+dRdR.y*radius,radius);
		d.graphics().endPath();
		d.graphics().strokeLine();
		//
		//dir.set(dxdx,ddy); dir.norm(); dir.scale(100.0);
		//dir.set(dxdx,dydy); dir.norm(); dir.scale(100.0);
		//
	}
	// 1D normal
	// 1D binormal
}

// ------------------------------------------------------------------------------------------------------------------------ 
SurfaceTri.prototype.wtf = function(){
}

SurfaceTri.prototype.wtf = function(){
/*
fronts = FirstFront()
while(frontSet.length>0){
    current = fronts.first()
    // close front with only 3 vertexes - what about initial front?
    if(current.vertexCount()==3){
        current.closeFront()
        fronts.removeFront(current)
        continue
    }
    // ?
    e = current.bestEdge()
    if(e.canCutEar()){
        e.cutEar()
        continue
    }
    // 
    p = vertexPredict(edge,field)
    if( !triangleTooClose(e,p) ){ // 
        e.growTriangle() // ?
    }else{ // 
        front = closestFront(e,p)
        if(front==current){ // same front?
            front = fronts.split(current-front) // separate front from current
            fronts.addFront( front ) // add as new front
        }else{ // different fronts
            front = merge(current,front) // combine
            fronts.removeFront(front) // remove second copy from list
        }
    }
}
*/
}



