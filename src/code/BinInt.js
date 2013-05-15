// BinInt
BinInt.copy = function(c,a){ // c = a
	ByteData.copy(c,a);
};

BinInt.and = function(c, a,b){ // c = a & b
	var i, len = c.length();
	var aV, bV;
	a.position(0); b.position(0); c.position(0);
	for(i=0;i<len;++i){
		aV = a.read(); bV = b.read();
		c.write( (aV!=0 && bV!=0)?1:0 );
	}
};
BinInt.or = function(c, a,b){ // c = a & b
	var i, len = c.length();
	var aV, bV;
	a.position(0); b.position(0); c.position(0);
	for(i=0;i<len;++i){
		aV = a.read(); bV = b.read();
		c.write( (aV!=0 || bV!=0)?1:0 );
	}
};
BinInt.xor = function(c, a,b){ // c = a & b
	var i, len = c.length();
	var aV, bV;
	a.position(0); b.position(0); c.position(0);
	for(i=0;i<len;++i){
		aV = a.read(); bV = b.read();
		c.write( ((aV!=0 && bV==0)||(aV==0 && bV!=0))?1:0 );
	}
};
BinInt.not = function(c, a){ // c = ~a
	var i, len = c.length();
	var aV;
	a.position(0); c.position(0);
	for(i=0;i<len;++i){
		aV = a.read();
		c.write( (aV!=0)?0:1 );
	}
};
BinInt.left = function(c, a, b, arith){ // c = a<<b [arithmetic]
	var val, i, len = a.length();
	for(i=len-1; i>=b;--i){
		a.position(i-b);
		val = a.read();
		c.position(i);
		c.write( val );
	}
	if(!arith){
		val = 0;
	}
	c.position(0);
	for(i=0;i<b;++i){
		c.write( val );
	}
};
BinInt.right = function(c, a, b, arith){ // c = a>>b [arithmetic]
	var val, i, len = a.length();
	var lmb = len-b;
	a.position(a.length()-1); val = a.read(); a.position(b);
	c.position(0);
	for(i=0;i<lmb;++i){
		val = a.read();
		c.write( val );
	}
	if(!arith){
		val = 0;
	}
	for(;i<len;++i){
		c.write( val );
	}
};
BinInt.isNegative = function(a){ // a<0
	var was = a.position();
	a.position(a.length()-1)
	var isNeg = a.read();
	a.position(was);
	return isNeg;
}
BinInt.abs = function(c, a){ // c = |a|
	if( BinInt.isNegative(a) ){
		BinInt.neg(c,a);
	}else{
		BinInt.copy(c,a);
	}
};
BinInt.neg = function(c, a){ // c = -a
	BinInt.not(BinInt.TEMP_NEG,a);
	BinInt.add(c,BinInt.ONE,BinInt.TEMP_NEG);
};
BinInt.add = function(c, a,b){ // c = a + b
	var i, len = c.length();
	var aV, bV, cV = 0;
	a.position(0); b.position(0); c.position(0);
	for(i=0;i<len;++i){
		aV = a.read(); bV = b.read();
		c.write( res = (aV ^ bV) ^ cV );
		cV = (aV&&bV) || (bV&&cV) || (cV&&aV);
	}
	return (cV!=0)?1:0;
};
BinInt.sub = function(c, a,b){ // c = a - b
	BinInt.neg( BinInt.TEMP_SUB, b );
	BinInt.add( c, a, BinInt.TEMP_SUB );
};
BinInt.mul = function(c, a,b){ // c = a * b
	BinInt.copy(BinInt.TEMP_MUL_A_ABS, a); BinInt.abs(BinInt.TEMP_MUL_A_ABS, a);
	BinInt.copy(BinInt.TEMP_MUL_B_ABS, b); BinInt.abs(BinInt.TEMP_MUL_B_ABS, b);
	var i, len = c.length();
	c.zero();
	for(i=0;i<len;++i){
		a.position(i);
		if(a.read()!=0){
			BinInt.left(BinInt.TEMP_MUL_B, BinInt.TEMP_MUL_B_ABS, i);
			BinInt.add(BinInt.TEMP_MUL_C,BinInt.TEMP_MUL_B,c);
			BinInt.copy(c,BinInt.TEMP_MUL_C);
		}
	}
	var isNegA = BinInt.isNegative(a), isNegB = BinInt.isNegative(b);
	if( isNegA ^ isNegB ){
		BinInt.neg(BinInt.TEMP_MUL_C, c)
		BinInt.copy(c,BinInt.TEMP_MUL_C);
	}
};
// DIVISOR | DIVIDEND = QUOTIENT
BinInt.div = function(c, a,b){ // c = a / b
	/*
	SOR = abs( DIVISOR )
	END = abs( DIVIDEND )
	QUO = 0
	repeat from i = 1 to length-1:
		DIV = shift END right length-i
		if DIV > SOR {
			END -= shift SOR left length-i
			QUO += 1
		}
		shift QUO left
	REM = DIV
	*/
};
BinInt.mod = function(c, a,b){ // c = a % b = a - [a/b]*b
	
};
BinInt.pow = function(c, a,b){ // c = a ^ b 
	
};
BinInt.gt = function(c, a){ // c > a
	return false;
};
BinInt.lt = function(c, a){ // c < a
	return false;
};
BinInt.eq = function(c, a){ // c == a
	return false;
};
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
BinInt.INITIALIZED = false;
BinInt.ZERO = null;
BinInt.ONE = null;
BinInt.TEMP_SUB = null;
BinInt.TEMP_NEG = null;
BinInt.TEMP_MUL_A_ABS = null;
BinInt.TEMP_MUL_B_ABS = null;
BinInt.TEMP_MUL_A = null;
BinInt.TEMP_MUL_B = null;
BinInt.TEMP_MUL_C = null;
BinInt.init = function(){
	if(!BinInt.INITIALIZED){
		BinInt.INITIALIZED = true;
		BinInt.ZERO = new BinInt();
		BinInt.ZERO.setFromInt(0);
		BinInt.ONE = new BinInt();
		BinInt.ONE.setFromInt(1);
		BinInt.TEMP_SUB = new BinInt();
		BinInt.TEMP_NEG = new BinInt();
		BinInt.TEMP_MUL_A_ABS = new BinInt();
		BinInt.TEMP_MUL_B_ABS = new BinInt();
		BinInt.TEMP_MUL_B = new BinInt();
		BinInt.TEMP_MUL_C = new BinInt();
	}
};



function BinInt(totSize){
	BinInt.init();
	Code.extendClass(this,ByteData,arguments);
	var self = this;
	/*this.read = Code.overrideClass(self, self.read, function(){
		if(self._position >=self._length){ // always return the last bit
			--self._position;
		}
		return self.super(arguments.callee).read.call(self,null);
	});*/
	//
	this.zero = function(){
		var was = self.length();
		self.length(0);
		self.length(was);
	};
	// 
	this.setFromString = function(str){
		var i, len = Math.min(self.length(), str.length);
		self.zero();
		self.position(0);
		for(i=len-1;i>=0;--i){
			self.write( str.charAt(i)!="0" );
		}
	};
	this.setFromInt = function(num){
		var i, len = Math.min(self.length(), 32), ander = 1;
		self.zero();
		self.position(0);
		for(i=0;i<len;++i){
			self.write( (ander&num)!=0?1:0 );
			ander <<= 1;
		}
		if(num<0){
			len = self.length();
			for(;i<len;++i){
				self.write(1);
			}
		}
	};
	//
	/*this.toString = Code.overrideClass(this, this.toString, function(){
		return "["+self.length()+"]"+self.super(arguments.callee).toString.call(self,null);
	});*/
	this.toStringBin = Code.overrideClass(this, this.toStringBin, function(){
		var str = "", i, len = self.length(), was = self.position();
		self.position(0);
		for(i=0;i<len;++i){
			if ( i%8==0 && i>0){
				str = "|"+str;
			}
			str = self.read()+str;
		}
		self.position(was);
		str = "["+self.length()+"]"+str;
		return str;
	});
	this.kill = Code.overrideClass(this, this.kill, function(){

		self.super(arguments.callee).kill.call(self,null);
	});
	//
	self.length(totSize?totSize:16);
};
