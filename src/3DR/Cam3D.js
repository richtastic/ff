// Cam3D.js

function Cam3D(p, r, l,f, s){
//	Cam3D._.constructor.call(this,  p, r, l,f, s); // Code.constructorClass(Cam3D, this);
	//this._rot = new V3D(0,0,0); // 
	this._rot = new V4D();
		this._rot.qClear();
		console.log("asdadsasdsasasd "+this._rot);
	this._pos = new V3D(0,0,0);
	this._K = new Matrix3D();
	this._target = new V3D(0,0,0);
	this._distortion = null;
	this.position(p);
	this.rotation(r);
	this._scale = 1.0;
	//this.K(0,0, .0001,.0001, 0);
	//this.K(0,0, 10000,10000, 0);
	this.K(0,0, 100,100, 0);
	this.distortion(0,0,0 ,0,0);
//	this._matrix = new Matrix3D();
}
//Code.inheritClass(Cam3D,Cam2D);

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
//	console.log(this._rot+" ... ROTATE BY: "+vector+" @ "+Code.degrees(angle));
	var q = new V4D().qClear();
	q.qRotateDir(vector.x,vector.y,vector.z, angle);
	//console.log("q: "+q)

	//V4D.qMul(this._rot, this._rot, q);
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
	// console.log(this._pos);
	var rotation = new Matrix3D();
	V4D.qMatrix(rotation, this._rot);

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
