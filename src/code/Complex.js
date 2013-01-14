// Complex.js
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
Complex.mul = function (c,a,b){ // c = a/b 
	var aMag = a.magnitude(), bMag = b.magnitude();
	var aAng = a.angle(), bAng = b.angle();
	var cMag = aMag/bMag;
	var cAng = aAng - bAng;
	c._value.x = cMag*Math.cos(cAng);
	c._value.y = cMag*Math.sin(cAng);
}
function Complex(rea,img){
	if(!rea){ rea = 0; }
	if(!img){ img = 0; }
	this._value = new V2D(rea,img);
	this.real = function(r){
		if(arguments.length>0){
			this._value.x = r;
		}else{
			return this._value.x;
		}
	}
	this.imag = function(val){
		if(arguments.length>0){
			this._value.y = arguments[0];
		}else{
			return this._value.y;
		}
	}
	this.magnitude = function(){
		return this._value.length();
	}
	this.angle = function(){
		if(this._value.x==0 && this._value.y==0){ return 0.0; }
		return Math.atan2(this._value.y, this._value.x);
	}
	this.toString = function(){
		return this.toStringRect();
	}
	this.toStringRect = function(){
		var reSign = this._value.x<0?"-":"";
		var imSign = this._value.y<0?"-":"+";
		return reSign+""+Math.abs(this.rounding(this._value.x))+" "+imSign+" "+Math.abs(this.rounding(this._value.y))+"j";
	}
	this.toStringEuler = function(){
		var mag = this.magnitude();
		var ang = this.angle();
		return ""+this.rounding(mag)+"<"+this.rounding(ang*180/Math.PI)+"*";
	}
	this.rounding = function(n){
		return (Math.round(n*1000)/1000);
	}
	this.kill = function(){
		this._value.kill();
		this._value = null;
	}
};
