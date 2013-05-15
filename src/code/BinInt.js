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
	var sor = new BinInt(), end = new BinInt(), quo = new BinInt(), div = new BinInt(), temp = new BinInt(), temp2 = new BinInt();
	var i, len = c.length();
	BinInt.abs(sor,b);
	BinInt.abs(end,a);
	quo.zero();
	for(i=0;i<=len;++i){
		BinInt.left(temp, quo, 1);
		BinInt.copy(quo, temp);
		BinInt.right(div, end, len-i);
		if( BinInt.gte(div,sor) ){
			BinInt.left(temp2, sor, len-i);
			BinInt.sub(temp, end, temp2);
			BinInt.copy(end, temp);
			BinInt.add(temp, quo, BinInt.ONE);
			BinInt.copy(quo, temp);
		}
	} // remainder = end
	BinInt.copy(c,quo);
};
BinInt.mod = function(c, a,b){ // c = a % b
	var sor = new BinInt(), end = new BinInt(), quo = new BinInt(), div = new BinInt(), temp = new BinInt(), temp2 = new BinInt();
	var i, len = c.length();
	BinInt.abs(sor,b);
	BinInt.abs(end,a);
	quo.zero();
	for(i=0;i<=len;++i){
		BinInt.left(temp, quo, 1);
		BinInt.copy(quo, temp);
		BinInt.right(div, end, len-i);
		if( BinInt.gte(div,sor) ){
			BinInt.left(temp2, sor, len-i);
			BinInt.sub(temp, end, temp2);
			BinInt.copy(end, temp);
			BinInt.add(temp, quo, BinInt.ONE);
			BinInt.copy(quo, temp);
		}
	}
	BinInt.copy(c,end);
};
/*
BinInt.mod = function(c, a,b){ // c = a % b = a - [a/b]*b
	
};*/
BinInt.pow = function(c, a,b){ // c = a ^ b 
	
};
BinInt.gte = function(c, a){ // c >= a
	var negC = BinInt.isNegative(c);
	var negA = BinInt.isNegative(a);
	if(!negA && !negC){
		BinInt.sub(BinInt.TEMP_COMP, c,a);
		if( BinInt.isNegative(BinInt.TEMP_COMP) ){
			return false;
		}else{
			return true;
		}
	}else{ // fill this out
		return false;
	}
};
BinInt.gt = function(c, a){ // c > a
	var negC = BinInt.isNegative(c);
	var negA = BinInt.isNegative(a);
	if(!negA && !negC){
		BinInt.sub(BinInt.TEMP_COMP, c,a);
		if( BinInt.isNegative(BinInt.TEMP_COMP) ){
			return false;
		}else{
			if( BinInt.eq(c,a) ){
				return false
			}
			return true;
		}
	}else{ // fill this out
		return false;
	}
};
BinInt.lt = function(c, a){ // c < a
	return false;
};
BinInt.eq = function(c, a){ // c == a
	var valA, valC, i, len = Math.max( c.length(), a.length() );
	var wasA = a.position(), wasC = c.position();
	a.position(0); c.position(0);
	var eq = true;
	for(i=0;i<len;++i){
		valA = a.read();
		valC = c.read();
		if(valA!=valC){
			eq = false;
			break;
		}
	}
	a.position(wasA); c.position(wasC);
	return eq;
};

BinInt.sameBitLength = function(c, a){ // c.length = a.length
	//
};
BinInt.LETTERS = ["0","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
BinInt.get10String = function(){
	//
	return "";
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
BinInt.INITIALIZED = false;
BinInt.ZERO = null;
BinInt.ONE = null;
BinInt.TEMP_COMP = null;
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
		BinInt.TEMP_COMP = new BinInt();
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
	this.toString10 = function(){
		str = "";
		var ten = new BinInt(), num = new BinInt(), rem = new BinInt(), temp = new BinInt();
		BinInt.copy(ten, self);
		BinInt.copy(num, self);
		BinInt.copy(rem, self);
		BinInt.copy(temp, self);
		ten.setFromInt(10);
		BinInt.copy(num,self);
		while( BinInt.gt(num,BinInt.ZERO) ){
			BinInt.mod(rem,num,ten);
			str = rem.getIntValue()+str;
			BinInt.div(temp,num,ten);
			BinInt.copy(num,temp);
		}
		return str;
 	};
 	this.getIntValue = function(){
 		var was = self.position();
 		var i, len = self.length();
 		var num = 0;
 		self.position(0);
 		for(i=0;i<len;++i){
 			if( self.read()!=0 ){
 				num = num | (1<<i);
 			}
 		}
 		self.position(was);
 		return num;
 	}
	this.kill = Code.overrideClass(this, this.kill, function(){

		self.super(arguments.callee).kill.call(self,null);
	});
	//
	self.length(totSize?totSize:256);
};
