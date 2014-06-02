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
  	this._stage3D.setBackgroundColor(0x88FFFFFF);
	this._stage3D.frustrumAngle(60);
	this._stage3D.enableDepthTest();
	this._stage3D.start();
	// datas
	this._pointCloud = null;
	this._front = new Front();
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
    "];
    
}
SurfaceTri.prototype.getFragmentShaders1 = function(){
    return ["\
		precision mediump float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
    "];
    
}
// ------------------------------------------------------------------------------------------------------------------------ 
SurfaceTri.prototype.onEnterFrameFxn3D = function(e){
	//console.log(e);
	this._stage3D.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);
	this._stage3D.clear();
	// 
	this._stage3D.matrixIdentity();
	this._stage3D.matrixTranslate(0.0,0.0,-3.0);
	this._stage3D.matrixRotate(e*0.01, 0,1,0);
	this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._spherePointBuffer);
	this._stage3D.bindArrayFloatBuffer(this._vertexColorAttrib, this._sphereColorBuffer);
	this._stage3D.matrixReset();
	this._stage3D.drawPoints(this._vertexPositionAttrib, this._spherePointBuffer);
}
SurfaceTri.prototype.setupSphere3D = function(){
	// 
	this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._vertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");

	// POINTS
	var pts = this.generateSpherePoints(10,1.0,0.0);
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

	// PLANE FITTING
	var cov = this.covarianceFromPoints(pts);

	// START
	this._stage3D.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this.onEnterFrameFxn3D, this);
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
		dx = p.x-a; dy = p.y-b; dz = p.z-c; // divide variance by weight for futher points (weight = 1/error)
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
	console.log(minDir+"");
	
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
		//list.push(v.x,v.y,v.z);
		//list.push(Math.random()*10-5,Math.random()*10-5,Math.random()*10-5);
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
	// 
}



