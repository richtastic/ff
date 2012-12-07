// Complex.js

function Complex(rea,img){
	var self = this;
	if(!rea){ rea = 0; }
	if(!img){ img = 0; }
	self.value = new V2D(rea,img);
	self.real = function(r){
		if(arguments.length>0){
			self.value.x = r; // arguments[0];
		}else{
			return self.value.x;
		}
	};
	self.imag = function(val){
		if(arguments.length>0){
			self.value.y = arguments[0];
		}else{
			return self.value.y;
		}
	};
	self.magnitude = function(){
		return self.value.length();
	};
	self.angle = function(){
		if(self.value.x==0 && self.value.y==0){ return 0.0; }
		return Math.atan2(self.value.y, self.value.x);
	};
	self.toString = function(){
		return self.toStringRect();
	};
	self.toStringRect = function(){
		var reSign = self.value.x<0?"-":"";
		var imSign = self.value.y<0?"-":"+";
		return reSign+""+Math.abs(self.rounding(self.value.x))+" "+imSign+" "+Math.abs(self.rounding(self.value.y))+"j";
	};
	self.toStringEuler = function(){
		var mag = self.magnitude();
		var ang = self.angle();
		return ""+self.rounding(mag)+"<"+self.rounding(ang*180/Math.PI)+"*";
	};
	self.rounding = function(n){
		return (Math.round(n*1000)/1000);
	}
	self.kill = function(){
		self.value.kill();
		self.value = null;
	};
};
Complex.add = function (c,a,b){ // c = a+b 
	c.value.x = a.value.x + b.value.x;
	c.value.y = a.value.y + b.value.y;
};
Complex.sub = function (c,a,b){ // c = a-b 
	c.value.x = a.value.x - b.value.x;
	c.value.y = a.value.y - b.value.y;
};
Complex.mul = function (c,a,b){ // c = a*b 
	var aMag = a.magnitude(), bMag = b.magnitude();
	var aAng = a.angle(), bAng = b.angle();
	var cMag = aMag*bMag;
	var cAng = aAng + bAng;
	c.value.x = cMag*Math.cos(cAng);
	c.value.y = cMag*Math.sin(cAng);
};
Complex.mul = function (c,a,b){ // c = a/b 
	var aMag = a.magnitude(), bMag = b.magnitude();
	var aAng = a.angle(), bAng = b.angle();
	var cMag = aMag/bMag;
	var cAng = aAng - bAng;
	c.value.x = cMag*Math.cos(cAng);
	c.value.y = cMag*Math.sin(cAng);
};



