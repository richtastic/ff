// Tri3D.js
function Tri3D(a,b,c){ // CCW+
	Tri3D._.constructor.call(this,a,b,c);
}
Code.inheritClass(Tri3D, Tri2D);
Tri3D.fromPoints = function(a,b,c){
	return (new Tri3D(a,b,c));
}
Tri3D.fromList = function(ax,ay,az, bx,by,bz, cx,cy,cz){
	return new Tri3D(new V3D(ax,ay,az), new V3D(bx,by,bz), new V3D(cx,cy,cz));
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri3D.prototype.normal = function(){
	var AB = V3D.sub(this._b,this._a);
	var AC = V3D.sub(this._c,this._a);
	V3D.cross(AB, AB,AC);
	AB.norm();
	return AB;
}
Tri3D.prototype.area = function(){
	var AB = V3D.sub(this._b,this._a);
	var AC = V3D.sub(this._c,this._a);
	V3D.cross(AB, AB,AC);
	return AB.length();
}
Tri3D.prototype.center = function(){ // barycenter
	return new V3D((this._a.x+this._b.x+this._c.x)/3.0, (this._a.y+this._b.y+this._c.y)/3.0, (this._a.z+this._b.z+this._c.z)/3.0);
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri3D.prototype.jitter = function(amplitude){
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
Tri3D.prototype.toString = function(){
	var str = "";
	str += "[Tri3D: ";
	str += this._a?(this._a.toString()):("[null]");
	str += ", ";
	str += this._b?(this._b.toString()):("[null]");
	str += ", ";
	str += this._c?(this._c.toString()):("[null]");
	str += " ]";
	return str;
}
