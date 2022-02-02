// Geometry3D.js


// Display World -----------------------------------------------------------------------------------------------

function D3D(stage){ // Display 3D
	console.log("Display3D");
	this._stage = stage;
	this._camera = new D3D.Cam3D();
	this._objects3D = []; // TODO: space 3D for segmenting
}
D3D.prototype.kill = function(){
	//
}
// D3D.prototype.render = function(stage){
// 	//
// }
D3D.sortZ = function(a,b){
	// return a["z"] < b["z"] ? -1 : 1;
	return a["z"] > b["z"] ? -1 : 1;
}
D3D.prototype.addObject = function(object){
	this._objects3D.push(object);
}
D3D.prototype.camera = function(camera){
	if(camera!==undefined){
		this._camera = camera;
	}
	return this._camera;
}
D3D.prototype.render = function(){
	//
	var stage = this._stage;
	var camera = this._camera;
	var objects = this._objects3D;

	var display = stage.root();
	var graphics = display.graphics();

	var ordered = [];
	for(var i=0; i<objects.length; ++i){
		var object = objects[i];
		// console.log(object,stage,camera);
		var data = object.render(null, camera, true);
		if(data){
			var z = data["z"];
			if(camera._clipNearZ<z && z<camera._clipFarZ){
				ordered.push({"o":object, "z":z});
			}
		}
	}
	// console.log(ordered);
	// throw "...";
	ordered.sort(D3D.sortZ);
	graphics.clear();
	for(var i=0; i<ordered.length; ++i){
		var object = ordered[i]["o"];
		var order = object.render(graphics, camera, false);
		// ordered.push({"object":object, "order":order});
	}
}

// Display Object -----------------------------------------------------------------------------------------------
D3D.DO3D = function(){
	// console.log("DO3D");
}
D3D.DO3D.prototype.kill = function(){
	//
}
D3D.DO3D.prototype.sphere = function(){ // containing sphere
	//
}
D3D.DO3D.prototype.cuboid = function(){ // containing cuboid
	//
}
D3D.DO3D.prototype.render = function(graphics, camera, data){ // 
	// return {"z":0};
	return null;
}

// Point -----------------------------------------------------------------------------------------------
D3D.Point3D = function(p, c, s){
	this._pos = new V3D(0,0,0);
	// this._color = Code.getColARGBFromFloat(1.0, 0.9,0.0,0.1);
	this._color = 0xFFCC0033;
	this._sizeRadius = 5.0; // display size on sreen
	this.point(p);
	this.size(s);
	this.color(c);
}
Code.inheritClass(D3D.Point3D,D3D.DO3D);
D3D.Point3D.prototype.point = function(p){
	if(p){
		this._pos.copy(p);
	}
	return this._pos;
}
D3D.Point3D.prototype.size = function(s){
	if(s!==undefined){
		this._sizeRadius = s;
	}
	return this._sizeRadius;
}
D3D.Point3D.prototype.color = function(c){
	if(c!==undefined){
		this._color = c;
	}
	return this._color;
}
D3D.Point3D.prototype.render = function(graphics, camera, data){
	var p3D = camera.projectPoint(this._pos);
	// console.log(p3D);
	if(data){
		return {"z":p3D.z};
	}
	// console.log(p3D+"");
	// p3D.y = -p3D.y; // up is negative
	// graphics.setLine(1.0,this._colo);
	graphics.setFill(this._color);
	// console.log(this._color);
	// graphics.moveTo(p3D.x, p3D.y);
	graphics.beginPath();
	graphics.drawCircle(p3D.x, p3D.y, this._sizeRadius);
	// graphics.strokeLine();
	graphics.endPath();
	graphics.fill();
	//this._.render(stage,camera);
}

// Line -----------------------------------------------------------------------------------------------
D3D.Line3D = function(a,b, color, size){
	this._a = new V3D(0,0,0);
	this._b = new V3D(0,0,0);
	this._color = 0xFFCC0033;
	this._size = 3;
	this._segments = 1; // TODO: segment in 2D
	this.a(a);
	this.b(b);
	this.color(color);
	this.size(size);
}
Code.inheritClass(D3D.Line3D,D3D.DO3D);
D3D.Line3D.prototype.a = function(a){
	if(a){
		this._a.copy(a);
	}
	return this._a;
}
D3D.Line3D.prototype.b = function(b){
	if(b){
		this._b.copy(b);
	}
	return this._b;
}
D3D.Line3D.prototype.size = function(s){
	if(s!==undefined){
		this._size = s;
	}
	return this._size;
}
D3D.Line3D.prototype.color = function(c){
	if(c!==undefined){
		this._color = c;
	}
	return this._color;
}
D3D.Line3D.prototype.render = function(graphics, camera, data){
	var a = this._a;
	var b = this._b;
	var pA = camera.projectPoint(a);
	var pB = camera.projectPoint(b);
	// console.log(p3D);
	if(data){
		var z = (pA.z+pB.z)*0.5;
		return {"z":z};
	}
	// console.log("LINE")
	// console.log(this._size, this._color);
	// console.log(pA+"",pB+"");
	graphics.setLine(this._size, this._color);
	graphics.beginPath();
	graphics.moveTo(pA.x, pA.y);
	graphics.lineTo(pB.x, pB.y);
	graphics.strokeLine();
	graphics.endPath();
}

// Triangle  -----------------------------------------------------------------------------------------------
D3D.Tri3D = function(){
	this._a = new V3D(0,0,0);
	this._b = new V3D(1,0,0);
	this._c = new V3D(0,1,0);
	console.log("Tri3D");
}
Code.inheritClass(D3D.Tri3D,D3D.DO3D);




// Plane [rectangular] -----------------------------------------------------------------------------------------------
D3D.Plane3D = function(){
	this._o = new V3D(0,0,0);
	this._dirA = new V3D(1,0,0);
	this._dirB = new V3D(0,1,0);
	this._divisionsA = 1;
	this._divisionsB = 1;
	console.log("Plane3D");
}
Code.inheritClass(D3D.Plane3D,D3D.DO3D);



// Image -----------------------------------------------------------------------------------------------
D3D.Image3D = function(image){
	console.log("Image3D");
	this._source = image;
}
Code.inheritClass(D3D.Image3D,D3D.Plane3D);


// Billboard -----------------------------------------------------------------------------------------------
D3D.BillboardImage3D = function(image){
	this._source = image;
}
Code.inheritClass(D3D.BillboardImage3D,D3D.DO3D);
D3D.BillboardImage3D.prototype.render = function(stage, camera, data){
	
}






// STOLEN FROM 3DR - duplicated & altered:


// Cam3D.js
// Camera -----------------------------------------------------------------------------------------------
D3D.Cam3D = function(p, r, l,f, s){
	this._rot = new V4D();
	this._rot.qClear();
	this._pos = new V3D(0,0,0);
	this._K = new Matrix2D();
	// this._target = new V3D(0,0,0);
	// this._distortion = null;
	this.position(p);
	this.rotation(r);
	this._scale = 1.0;
	//this.K(0,0, .0001,.0001, 0);
	//this.K(0,0, 10000,10000, 0);
	// this.K(0,0, 100,100, 0);
	// this.K(0,0, 100,100, 0);
	this.K(0,0, 1000,1000, 0);
	// this.distortion(0,0,0 ,0,0);
	this._clipNearZ = 0.0;
	this._clipFarZ = 9E99;
	this._matrix = new Matrix3D();
	//
	this._clippingRadius = 999; // simpler geometry to clip large points
}
Code.inheritClass(D3D.Cam3D,D3D.DO3D);

// debug rendering:
D3D.Cam3D.prototype.render = function(graphics,camera,data){
	// this._.render(stage,camera);
}

D3D.Cam3D.prototype.projectPoint = function(p,q){
	var matrix = this.matrix();
	var point2D = matrix.multV3D(p,q);
		point2D.y = -point2D.y;
		var z = point2D.z;
		point2D.z = 1;
		if(z==0){
			point2D.x = 0;
			point2D.y = 0;
		}else{
			point2D.x /= z;
			point2D.y /= z;
		}
	this._K.multV3D(point2D,point2D);
		point2D.z = z;
	return point2D;
}

D3D.Cam3D.prototype.identity = function(){
	this._pos.set(0,0,0);
	this._rot.qClear();
	this._updateMatrix();
}

D3D.Cam3D.prototype.position = function(p){
	if(p!==undefined){
		this._pos.copy(p);
		this._updateMatrix();
	}
	return this._pos;
}
D3D.Cam3D.prototype.rotation = function(r){
	if(r!==undefined){
		this._rot = r;
		this._updateMatrix();
	}
	return this._rot;
}
D3D.Cam3D.prototype.K = function(cx,cy, fx,fy, s){
	if(cx!==undefined){
		// this._K.fromArray([fx, s, cx, 0,   0, fy, cy, 0,  0, 0, 1, 0]);
		// this._K.fromArray([fx, s, cx,   0, fy, cy, 0, 0, 1]);
		this._K.fromArray([fx,s,0,fy, cx, cy]);
	}
	return this._K;
}
// D3D.Cam3D.prototype.distortion = function(k1,k2,k3,p1,p2){
// 	if(k1!==undefined){
// 		if(p2!==undefined){
// 			this._distortion = {"k1":k1, "k2":k2, "k3":k3, "p1":p1, "p2":p2};
// 		}else{
// 			this._distortion = k1;
// 		}
// 	}
// 	return this._distortion;
// }
D3D.Cam3D.prototype.rotate = function(vector, angle){
	var q = new V4D().qClear();
	q.qRotateDir(vector, angle);
	this._rot = V4D.qMul(q, this._rot);
	this._rot.qNorm();
	this._updateMatrix();
	return this;
}
D3D.Cam3D.prototype.translate = function(t){
	this._pos.add(t);
	this._updateMatrix();
	return this;
}
D3D.Cam3D.prototype.transform = function(point){
	var matrix = this._matrix;
	return matrix.multV3D(point);
	// var next = point.copy();
	// next = this._rot.qRotatePoint(new V3D(), next);
	// next.sub(this._pos);
	// return next;
}
D3D.Cam3D.prototype.orientation = function(){
	var x = new V3D(1,0,0);
	var y = new V3D(0,1,0);
	var z = new V3D(0,0,1);
	var o = new V3D(0,0,0);
	// var matrix = ;
	x = this.transform(x); // rotation offset
	y = this.transform(y);
	z = this.transform(z);
	o = this.transform(o);
	x.sub(o); // translation offset
	y.sub(o);
	z.sub(o);
	x.norm(); // scale offset
	y.norm();
	z.norm();
	return {"x":x,"y":y,"z":z,"o":o};
}
D3D.Cam3D.prototype._updateMatrix = function(){
	var rotation = new Matrix3D();
	V4D.qMatrix(this._rot,rotation);
	var translation = new Matrix3D();
	translation.translate(-this._pos.x,-this._pos.y,-this._pos.z);
	var combined = this._matrix;
	combined.mult(translation,rotation);
}
D3D.Cam3D.prototype.matrix = function(){
	return this._matrix;
}










// D3D.Cam3D.prototype.applyDistortion = function(d,u){ // c = distort(a)
// 	if(u===undefined){
// 		u = d;
// 		d = new V2D();
// 	}
// 	var d = R3D.applyDistortionParameters(d, u, this.K(), this.distortion());
// 	return d;
// }
D3D.Cam3D.prototype.toString = function(){
	var str = "";
	str += "[Cam3D: ";
	// str += " "+this._pos.toString();
	// str += " "+(this._rot*(180.0/Math.PI))+"*";
	// str += " "+this._focalLength+", "+(this._fieldOfView*(180.0/Math.PI))+"*";
	str += "]";
	return str;
}
D3D.Cam3D.prototype.kill = function(){
	this._pos = null;
	this._angle = undefined;
	this._focalLength = undefined;
	this._fieldOfView = undefined;
	Cam3D._.kill();
}



















/*
Cam3D.prototype.identity = function(p){
	this._pos.set(0,0,0);
	this._rot.qClear();
}

Cam3D.prototype.position = function(p){
	if(p!==undefined){
		this._pos.copy(p);
	}
	return this._pos;
}
Cam3D.prototype.rotation = function(r){
	// if(r!==undefined){
	// 	this._rot = r;
	// }
	return this._rot;
}
Cam3D.prototype.K = function(cx,cy, fx,fy, s){
	if(cx!==undefined){
		this._K.fromArray([fx, s, cx, 0,   0, fy, cy, 0,  0, 0, 1, 0]);
	}
	return this._K;
}

Cam3D.prototype.distortion = function(k1,k2,k3,p1,p2){
	if(k1!==undefined){
		if(p2!==undefined){
			this._distortion = {"k1":k1, "k2":k2, "k3":k3, "p1":p1, "p2":p2};
		}else{
			this._distortion = k1;
		}
	}
	return this._distortion;
}



Cam3D.prototype.rotate = function(vector, angle){
	var q = new V4D().qClear();
	q.qRotateDir(vector, angle);
	this._rot = V4D.qMul(q, this._rot);
	this._rot.qNorm();
	return this;
}
Cam3D.prototype.translate = function(t){
	this._pos.add(t);
	return this;
}
Cam3D.prototype.transform = function(point){
	var next = point.copy();
	next = this._rot.qRotatePoint(new V3D(), next);
	next.sub(this._pos);
	return next;
}
Cam3D.prototype.orientation = function(){
	var x = new V3D(1,0,0);
	var y = new V3D(0,1,0);
	var z = new V3D(0,0,1);
	var o = new V3D(0,0,0);
	x = this.transform(x);
	y = this.transform(y);
	z = this.transform(z);
	o = this.transform(o);
	x.sub(o);
	y.sub(o);
	z.sub(o);
	return {"x":x,"y":y,"z":z,"o":o};
}


Cam3D.prototype.matrix = function(){
	var rotation = new Matrix3D();
	V4D.qMatrix(this._rot,rotation);

	var translation = new Matrix3D();
	translation.translate(-this._pos.x,-this._pos.y,-this._pos.z);


	var combined = new Matrix3D();
	// combined.mult(rotation,translation); // x
	combined.mult(translation,rotation);

	return combined;
}










Cam3D.prototype.applyDistortion = function(d,u){ // c = distort(a)
	if(u===undefined){
		u = d;
		d = new V2D();
	}
	var d = R3D.applyDistortionParameters(d, u, this.K(), this.distortion());
	return d;
}




Cam3D.prototype.toString = function(){
	var str = "";
	str += "[Cam3D: ";
	// str += " "+this._pos.toString();
	// str += " "+(this._rot*(180.0/Math.PI))+"*";
	// str += " "+this._focalLength+", "+(this._fieldOfView*(180.0/Math.PI))+"*";
	str += "]";
	return str;
}
Cam3D.prototype.kill = function(){

	this._pos = null;
	this._angle = undefined;
	this._focalLength = undefined;
	this._fieldOfView = undefined;
	Cam3D._.kill();
}

*/