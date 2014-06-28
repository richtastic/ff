// Tri.js
function Tri(a,b,c){ // CCW+
	this._A = null;
	this._B = null;
	this._C = null;
	this.A(a);
	this.B(b);
	this.C(c);
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri.prototype.A = function(a){
	if(a!==undefined){
		this._A = a;
	}
	return this._A;
}
Tri.prototype.B = function(b){
	if(b!==undefined){
		this._B = b;
	}
	return this._B;
}
Tri.prototype.C = function(c){
	if(c!==undefined){
		this._C = c;
	}
	return this._C;
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
	this._A = null;
	this._B = null;
	this._C = null;
}