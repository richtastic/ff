// Tri2D.js
function Tri2D(a,b,c){ // CCW+
	this._a = null;
	this._b = null;
	this._c = null;
	this.A(a);
	this.B(b);
	this.C(c);
}
Tri2D.fromPoints = function(a,b,c){
	return (new Tri2D(a,b,c));
}
Tri2D.fromList = function(ax,ay, bx,by, cx,cy){
	return new Tri2D(new V2D(ax,ay), new V2D(bx,by), new V2D(cx,cy));
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri2D.prototype.A = function(a){
	if(a!==undefined){
		this._a = a;
	}
	return this._a;
}
Tri2D.prototype.B = function(b){
	if(b!==undefined){
		this._b = b;
	}
	return this._b;
}
Tri2D.prototype.C = function(c){
	if(c!==undefined){
		this._c = c;
	}
	return this._c;
}
Tri2D.prototype.area = function(){
	var AB = V2D.sub(this._b,this._a);
	var AC = V2D.sub(this._c,this._a);
	return V2D.cross(AB, AB,AC);
}
Tri2D.prototype.center = function(){ // barycenter
	return new V2D((this._a.x+this._b.x+this._c.x)/3.0, (this._a.y+this._b.y+this._c.y)/3.0);
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri2D.prototype.jitter = function(amplitude){
	this._a = this._a.copy();
	this._b = this._b.copy();
	this._c = this._c.copy();
	this._a.x += Math.random()*amplitude - amplitude*0.5;
	this._a.y += Math.random()*amplitude - amplitude*0.5;
	this._b.x += Math.random()*amplitude - amplitude*0.5;
	this._b.y += Math.random()*amplitude - amplitude*0.5;
	this._c.x += Math.random()*amplitude - amplitude*0.5;
	this._c.y += Math.random()*amplitude - amplitude*0.5;
}
// -------------------------------------------------------------------------------------------------------------------- 
Tri2D.prototype.toString = function(){
	var str = "";
	str += "[Tri2D: ";
	str += this._a?(this._a.toString()):("[null]");
	str += ", ";
	str += this._b?(this._b.toString()):("[null]");
	str += ", ";
	str += this._c?(this._c.toString()):("[null]");
	str += " ]";
	return str;
}
Tri2D.prototype.kill = function(){ // doesn't own points
	this._a = null;
	this._b = null;
	this._c = null;
}