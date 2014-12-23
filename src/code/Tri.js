// Tri.js
function Tri(a,b,c){ // CCW+
	this._a = null;
	this._b = null;
	this._c = null;
	this.A(a);
	this.B(b);
	this.C(c);
}
Tri.fromList = function(ax,ay,az, bx,by,bz, cx,cy,cz){
	return new Tri(new V3D(ax,ay,az), new V3D(bx,by,bz), new V3D(cx,cy,cz));
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri.prototype.A = function(a){
	if(a!==undefined){
		this._a = a;
	}
	return this._a;
}
Tri.prototype.B = function(b){
	if(b!==undefined){
		this._b = b;
	}
	return this._b;
}
Tri.prototype.C = function(c){
	if(c!==undefined){
		this._c = c;
	}
	return this._c;
}
Tri.prototype.normal = function(){
	var AB = V3D.sub(this._b,this._a);
	var AC = V3D.sub(this._c,this._a);
	V3D.cross(AB, AB,AC);
	AB.norm();
	return AB;
}
Tri.prototype.center = function(){ // barycenter
	return new V3D((this._a.x+this._b.x+this._c.x)/3.0, (this._a.y+this._b.y+this._c.y)/3.0, (this._a.z+this._b.z+this._c.z)/3.0);
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri.prototype.jitter = function(amplitude){
	this._a = this._a.copy();
	this._b = this._b.copy();
	this._c = this._c.copy();
	this._a.x += Math.random()*amplitude - amplitude*0.5;
	this._a.y += Math.random()*amplitude - amplitude*0.5;
	this._a.z += Math.random()*amplitude - amplitude*0.5;
	this._b.x += Math.random()*amplitude - amplitude*0.5;
	this._b.y += Math.random()*amplitude - amplitude*0.5;
	this._b.z += Math.random()*amplitude - amplitude*0.5;
	this._c.x += Math.random()*amplitude - amplitude*0.5;
	this._c.y += Math.random()*amplitude - amplitude*0.5;
	this._c.z += Math.random()*amplitude - amplitude*0.5;
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri.prototype.toString = function(){
	var str = "";
	str += "[Tri: ";
	str += this._a?(this._a.toString()):("[null]");
	str += ", ";
	str += this._b?(this._b.toString()):("[null]");
	str += ", ";
	str += this._c?(this._c.toString()):("[null]");
	str += " ]";
	return str;
}

Tri.prototype.kill = function(){
	this._a = null;
	this._b = null;
	this._c = null;
}