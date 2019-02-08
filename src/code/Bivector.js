// Bivector.js
Bivector.YAML = {
	// X:"x",
	// Y:"y",
}

function Bivector(a,b,c){
	this._01 = 0;
	this._02 = 0;
	this._12 = 0;
	this.b01(a);
	this.b02(b);
	this.b12(c);
}
Bivector.prototype.b01 = function(v){
	if(v!==undefined){
		this._01 = v;
	}
	return this._01;
}
Bivector.prototype.b02 = function(v){
	if(v!==undefined){
		this._02 = v;
	}
	return this._02;
}
Bivector.prototype.b12 = function(v){
	if(v!==undefined){
		this._12 = v;
	}
	return this._12;
}
Bivector.wedge = function(a,b){
	var A = a.x*b.y - a.y-b.x; // xy
	var B = a.x*b.z - a.z*b.x; // xz
	var C = a.y*b.z - a.z*b.y; // yz
	return new Bivector(A,B,C);
}



function Rotor(a,b,c,d){
	this._a = 1;
	this._01 = 0;
	this._02 = 0;
	this._12 = 0;
	this.a(a);
	if(b && Code.isa(b,Bivector)){
		this.b01(b.b01());
		this.b02(b.b02());
		this.b12(b.b12());
	}else{
		this.b01(b);
		this.b02(c);
		this.b12(d);
	}
}
Rotor.prototype.a = function(v){
	if(v!==undefined){
		this._a = v;
	}
	return this._a;
}
Rotor.prototype.b01 = function(v){
	if(v!==undefined){
		this._01 = v;
	}
	return this._01;
}
Rotor.prototype.b02 = function(v){
	if(v!==undefined){
		this._02 = v;
	}
	return this._02;
}
Rotor.prototype.b12 = function(v){
	if(v!==undefined){
		this._12 = v;
	}
	return this._12;
}


Rotor.wedge = function(a,b){

}


// ...
