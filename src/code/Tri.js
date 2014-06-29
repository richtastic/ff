// Tri.js
function Tri(a,b,c){ // CCW+
	this._a = null;
	this._b = null;
	this._c = null;
	this.A(a);
	this.B(b);
	this.C(c);
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
	var AB = V3D.sub(B,A);
	var BC = V3D.sub(C,B);
	V3D.cross(AB, AB,BC);
	AB.norm();
	return AB;
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri.prototype.kill = function(){
	this._a = null;
	this._b = null;
	this._c = null;
}