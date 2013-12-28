// Complex.js
function Complex(rea,img){
	if(rea===undefined){ rea = 0; }
	if(img===undefined){ img = 0; }
	this._value = new V2D(rea,img);
}
// ------------------------------------------------------------------------------------------------------------------------ fundamental
Complex.prototype.set = function(r,i){
	this._value.x = r;
	this._value.y = i;
}
Complex.prototype.real = function(r){
	if(arguments.length>0){
		this._value.x = r;
	}
	return this._value.x;
}
Complex.prototype.imag = function(i){
	if(arguments.length>0){
		this._value.y = i;
	}
	return this._value.y;
}
Complex.prototype.copy = function(a){
	if(arguments.length>0){
		this._value.x = a._value.x;
		this._value.y = a._value.y;
		return this;
	}else{
		return new Complex(this._value.x,this._value.y);
	}
}
// ------------------------------------------------------------------------------------------------------------------------ derived
Complex.prototype.magnitude = function(){
	return this._value.length();
}
Complex.prototype.angle = function(){
	if(this._value.x==0 && this._value.y==0){ return 0.0; }
	return Math.atan2(this._value.y, this._value.x);
}
// ------------------------------------------------------------------------------------------------------------------------ print
Complex.prototype.toString = function(){
	return this.toStringRect();
}
Complex.prototype.toStringRect = function(){
	var reSign = this._value.x<0?"-":"";
	var imSign = this._value.y<0?"-":"+";
	return reSign+""+Math.abs(this.rounding(this._value.x))+" "+imSign+" "+Math.abs(this.rounding(this._value.y))+"j";
}
// ------------------------------------------------------------------------------------------------------------------------ 
Complex.prototype.toStringEuler = function(){
	var mag = this.magnitude();
	var ang = this.angle();
	return ""+this.rounding(mag)+"<"+this.rounding(ang*180/Math.PI)+"*";
}
Complex.prototype.rounding = function(n){
	return n;//(Math.round(n*1000)/1000);
}
Complex.prototype.kill = function(){
	this._value.kill();
	this._value = null;
}
// ------------------------------------------------------------------------------------------------------------------------ basics
Complex.add = function (c,a,b){ // c = a+b 
	var y = a._value.y + b._value.y;
	c._value.x = a._value.x + b._value.x;
	c._value.y = y;
}
Complex.sub = function (c,a,b){ // c = a-b 
	var y = a._value.y - b._value.y;
	c._value.x = a._value.x - b._value.x;
	c._value.y = y;
}
Complex.mul = function (c,a,b){ // c = a*b 
	var aMag = a.magnitude(), bMag = b.magnitude();
	var aAng = a.angle(), bAng = b.angle();
	var cMag = aMag*bMag;
	var cAng = aAng + bAng;
	c._value.x = cMag*Math.cos(cAng);
	c._value.y = cMag*Math.sin(cAng);
}
Complex.div = function (c,a,b){ // c = a/b 
	var aMag = a.magnitude(), bMag = b.magnitude();
	var aAng = a.angle(), bAng = b.angle();
	var cMag = aMag/bMag;
	var cAng = aAng - bAng;
	c._value.x = cMag*Math.cos(cAng);
	c._value.y = cMag*Math.sin(cAng);
}
// ------------------------------------------------------------------------------------------------------------------------ math
Complex._temp1 = new Complex();
Complex._temp2 = new Complex();
Complex._temp3 = new Complex();
Complex._temp4 = new Complex();
Complex.exp = function(c, a){ // c = exp(a) = sum x^n/n!
	var t = Complex._temp1; // accumulator
	var u = Complex._temp2; // dividend (x^n)
	var v = Complex._temp3; // divisor (n!)
	var q = Complex._temp4; // quotient
	var i, n = 18; // 18~24
	// -1.1312043863307872 + 2.471726671776442j // 16
	// -1.1312043837320238 + 2.471726671976549j // 18
	// -1.1312043837567194 + 2.471726672005256j // 20
	// -1.1312043837568195 + 2.471726672004819j // 22
	// -1.1312043837568155 + 2.471726672004821j // 24
	// -1.1312043837568155 + 2.471726672004821j // 26
	t.set(1,0); u.set(1,0); v.set(1,0); q.set(1,0);
	for(i=1;i<=n;++i){
		v.real( v.real()*i ); // n!
		Complex.mul(u, u,a); // x^n
		Complex.div(q, u,v);
		Complex.add(t, t,q); // acc
	}
	c.copy(t);
}
// ------------------------------------------------------------------------------------------------------------------------ 
// ------------------------------------------------------------------------------------------------------------------------ 
/*
var A = new Complex(1,1);
	var B = new Complex(-1,1);
console.log(A.toString());
console.log(B.toString());
	Complex.add(A,A,B);
console.log(A.toString());
*/