// Render3D.js

function Render3D(size){
	this._root = new DO();
	this._size = new V2D(600,400);
	this._currentCamera = -1;
	this._cameras = [];
	this.size(size);
	// this.addCamera();
}


// steal
Render3D.Cam3D = Cam3D;

Render3D.prototype.display = function(){
	return this._root;
}
Render3D.prototype.clear = function(){
	this._root.removeAllChildren();
}
Render3D.prototype.size = function(s){
	if(s!==undefined){
		this._size.copy(s);
	}
	return this._size;
}
Render3D.prototype.addCamera = function(info){
	
	var size = this.size();

	var camera = new Cam3D();
	var cx = size.x*0.5;
	var cy = size.y*0.5;
	var fx = 1000;
	var fy = 1000;
	var s = 0;
	var k1 = 0;//1E-10;
	var k2 = 0;//1E-15;
	var k3 = 0;//1E-15;
	var p1 = 0;//1E-20;
	var p2 = 0;//1E-25;
	camera.K(cx,cy, fx,fy, s);
	camera.distortion(k1,k2,k3, p1,p2);
	// camera.translate(0,5,-15);
	// camera.translate( new V3D(0,0,-100) );


	this._cameras.push(camera);
	if(this._currentCamera==-1){
		this._currentCamera = 0;
	}
	return camera;
}
Render3D.prototype.currentCamera = function(){
	return this._cameras[this._currentCamera];
}
Render3D.prototype.renderPoints = function(points,infos){
	var screen = this.size();
	var display = this._root;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var p = this.toScreenPoint(point);
		// console.log(point);
		// console.log(p);
		// break;
		if(p){
			// console.log(p+"");
			var rad = 2.0;
			var d = new DO();
			d.graphics().setFill(0xFFFF0000);
			// d.graphics().setLine(1.0, 0xFFFF0000);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x, p.y, rad);
			// d.graphics().drawCircle(5,5, rad);
			d.graphics().fill();
			// d.graphics().strokeLine();
			d.graphics().endPath();
			//dList.push([d,point.z]);
			display.addChild(d);
		}
	}
}
Render3D.prototype.renderLines = function(lines,infos){
	var screen = this.size();
	var display = this._root;
	for(var i=0; i<lines.length; ++i){
		var line = lines[i];
		var a = line[0];
		var b = line[1];
		var a = this.toScreenPoint(a);
		var b = this.toScreenPoint(b);
		if(a && b){
			// console.log(p+"");
			// var rad = 2.0;
			var d = new DO();
			// d.graphics().setFill(0xFFFF0000);
			d.graphics().setLine(1.0, 0xFF0000FF);
			d.graphics().beginPath();
			d.graphics().moveTo(a.x,a.y);
			d.graphics().lineTo(b.x,b.y);
			d.graphics().strokeLine();
			d.graphics().endPath();
			display.addChild(d);
		}
	}
}
Render3D.prototype.renderPolygons = function(polys,infos){
	var screen = this.size();
	var display = this._root;
	for(var i=0; i<polys.length; ++i){
		var poly = polys[i];
		var d = new DO();
		d.graphics().setLine(1.0, 0xFFFF00FF);
		d.graphics().beginPath();
		for(var j=0; j<poly.length; ++j){
			var a = poly[j];
			var a = this.toScreenPoint(a);
			if(a){
				if(j==0){
					d.graphics().moveTo(a.x,a.y);
				}else{
					d.graphics().lineTo(a.x,a.y);
				}
			}
		}
		d.graphics().endPath();
		d.graphics().strokeLine();
		display.addChild(d);
	}
}

Render3D.prototype.toScreenPoint = function(point3D){
	var camera = this.currentCamera();
	var cameraK = camera.K();
	var cameraMatrix = camera.matrix();
	// console.log(point3D);
	return this.toScreenPointFull(point3D, camera,cameraMatrix,cameraK, screen.x,screen.y);
}
Render3D.prototype.toScreenPointFull = function(point3D, camera,cameraMatrix,cameraK, screenWidth,screenHeight){
	var local3D = cameraMatrix.multV3D(new V3D(), point3D);
	// console.log(local3D+"")
	if(local3D.z>0){
		var projected3D = cameraK.multV3D(new V3D(), local3D);
		var image3D = new V3D(projected3D.x/projected3D.z,projected3D.y/projected3D.z,projected3D.z);
		var screen3D = camera.applyDistortion(new V2D(), image3D);
		var point = new V3D(screen3D.x,screen3D.y,image3D.z);
		if(0<=point.x && point.x<screenWidth){
			if(0<=point.y && point.y<screenHeight){
				return point;
			}
		}
		return point;
	}
	return null;
}



