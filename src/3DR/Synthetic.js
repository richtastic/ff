// Synthetic.js

function Synthetic(){
	this.createDisplay();
	this.defineCameras();
	this.generate3DPoints();
	this.projectPointsTo2D();
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
	cam = {};
	var f = 500;
	var fx = f;
	var fy = f;
	var s = 0.00;
	var cx = 200;
	var cy = 100;
	cam.K = new Matrix(3,3).setFromArray([fx, s, cx,  0.0, fy, cy,  0.0, 0.0, 1.0]);
	cam.M = new Matrix(4,4).identity();
	var tx = 0;
	var ty = 0;
	var tz = 5;
		
		cam.M = Matrix.transform3DRotateZ(cam.M, Math.TAU/10.0);
		cam.M = Matrix.transform3DRotateX(cam.M, Math.TAU/4.0);
		//cam.M = Matrix.transform3DRotateZ(cam.M, Math.TAU/10.0);
		cam.M = Matrix.transform3DTranslate(cam.M, -0.5, 0.5, 0.5);
		cam.M = Matrix.transform3DTranslate(cam.M, tx, ty, tz);
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
	var i, len, v, p2d, p3d;
	var cam = this._cameras[0];
	var points2D = [];
	var points3D = this._points3D;
	var M = new Matrix(3,4).setFromArray(cam.M.toArray());
	var K = cam.K.copy();
	var P = Matrix.mult( K, M );
		P.appendRowFromArray([0.0, 0.0, 0.0, 1.0]);
// console.log(M.toString());
// console.log(K.toString());
// console.log(P.toString());
	len = points3D.length;
	for(i=0;i<len;++i){
		p3d = points3D[i];
// console.log(p3d);
		v = P.multV3DtoV3D(new V3D(), p3d);
		if (v.z < 0){
			console.log("behind camera: "+v.toString());
		}
		if(v.z!=0){
			p2d = new V2D(v.x/v.z, v.y/v.z);
			//p2d = new V2D(v.x, v.y);
		}else{
			p2d = new V2D(0,0);
		}
console.log(p2d.toString());
		points2D.push(p2d);
	}
	this._points2D = points2D;
}
Synthetic.prototype.display2DPoints = function(){
	var i, len, p;
	var points2D = this._points2D;
	len = points2D.length;
	for(i=0; i<len; ++i){
		p = points2D[i];
		var d = new DO();
		d.graphics().clear();
		d.graphics().setFill(0xFF990000);
		d.graphics().setLine(1.0,0xFF000000);
		d.graphics().beginPath();
		d.graphics().drawCircle(p.x,p.y,2.0);
		//d.graphics().moveTo(10,10);
		//d.graphics().lineTo(0,0);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.graphics().fill();
		this._root.addChild(d);
//		console.log(d);
	}
}

Synthetic.prototype.handleMouseClickFxn = function(v){
	console.log("click: "+v);
}




