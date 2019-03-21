// Tri2D.js
Tri2D.YAML = {
	A:"a",
	B:"b",
	C:"c"
};

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
Tri2D.prototype.toObject = function(){
	var DATA = Tri2D.YAML;
	var object = {};
	object[DATA.A] = this.A().toObject();
	object[DATA.B] = this.B().toObject();
	object[DATA.C] = this.C().toObject();
	return object;
}
// --------------------------------------------------------------------------------------------------------------------
Tri2D.prototype.rotate = function(origin,angle){
	if(angle===undefined){
		angle = origin;
		origin = new V2D(0,0);
	}
	this.A().sub(origin).rotate(angle).add(origin);
	this.B().sub(origin).rotate(angle).add(origin);
	this.C().sub(origin).rotate(angle).add(origin);
}
Tri2D.prototype.translate = function(t){
	this.A().add(t);
	this.B().add(t);
	this.C().add(t);
}
Tri2D.prototype.isPoint = function(){
	return this.area() < 1E-32;
}
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
Tri2D.prototype.AB = function(){
	return V2D.sub(this.B(),this.A());
}
Tri2D.prototype.BC = function(){
	return V2D.sub(this.C(),this.B());
}
Tri2D.prototype.CA = function(){
	return V2D.sub(this.A(),this.C());
}
Tri2D.prototype.ABLength = function(){
	return this.AB().length();
}
Tri2D.prototype.BCLength = function(){
	return this.BC().length();
}
Tri2D.prototype.CALength = function(){
	return this.CA().length();
}
Tri2D.prototype.EdgeLengths = function(){
	return [this.ABLength(),this.BCLength(),this.CALength()];
}
Tri2D.prototype.points = function(){
	return [this.A(),this.B(),this.C()];
}
Tri2D.prototype.minimumRect = function(){
	return Code.minRectFromPolygon(this.points());
}
Tri2D.prototype.min = function(){
	var v = this.A().copy();
	V2D.min(v, v,this.B());
	V2D.min(v, v,this.C());
	return v;
}
Tri2D.prototype.max = function(){
	var v = this.A().copy();
	V2D.max(v, v,this.B());
	V2D.max(v, v,this.C());
	return v;
}
Tri2D.prototype.boundingRect = function(){
	var info = V2D.extremaFromArray([this.A(),this.B(),this.C()]);
	return new Rect(info["min"].x,info["min"].y, info["size"].x,info["size"].y);
}
Tri2D.prototype.area = function(){
	var AB = this.AB();
	var AC = this.CA();
	return Math.abs(V2D.cross(AB,AC)) * 0.5; // ?
}
Tri2D.prototype.center = function(){ // barycenter
	return new V2D((this._a.x+this._b.x+this._c.x)/3.0, (this._a.y+this._b.y+this._c.y)/3.0);
}
Tri2D.prototype.copy = function(a){
	if(a===undefined){ return new Tri2D(this.A(),this.B(),this.C()); }
	this.A(a.A());
	this.B(a.B());
	this.C(a.C());
	return this;
}
// --------------------------------------------------------------------------------------------------------------------
Tri2D.prototype.jitter = function(amplitude){
	amplitude = amplitude!==undefined ? amplitude : 1.0;
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
	str += "]";
	return str;
}
Tri2D.prototype.kill = function(){ // doesn't own points
	this._a = null;
	this._b = null;
	this._c = null;
}


Tri2D.copy = function(a){
	return (new Tri2D()).copy(a);
}
