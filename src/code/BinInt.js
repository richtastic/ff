// BinInt
BinInt.copy = ByteData.copy;

BinInt.and = function(c, a,b){ // c = a & b
	var datA = a._data, datB = b._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = datA[i] & datB[i];
	}
};
BinInt.or = function(c, a,b){ // c = a | b
	var datA = a._data, datB = b._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = datA[i] | datB[i];
	}
};
BinInt.xor = function(c, a,b){ // c = a ^ b
	var datA = a._data, datB = b._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = datA[i] ^ datB[i];
	}
};
BinInt.not = function(c, a,b){ // c = ~a
	var datA = a._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = ~datA[i];
	}
};
BinInt.left = function(c, a, b, arith){ // c = a<<b [arithmetic]
	var tempC = BinInt.TEMP_C, tempA = BinInt.TEMP_A;
	BinInt.copy(tempC, c); BinInt.copy(tempA, a);
	var val, i, len = tempA._length;
	for(i=len-1; i>=b; --i){
		tempA._position = i-b;
		val = tempA.read();
		tempC._position = i;
		tempC.write( val );
	}
	if(!arith){
		val = 0;
	}
	tempC._position = 0;
	for(i=0;i<b;++i){
		tempC.write( val );
	}
	BinInt.copy(c,tempC)
};
BinInt.right = function(c, a, b, arith){ // c = a>>b [arithmetic]
	var tempC = BinInt.TEMP_C, tempA = BinInt.TEMP_A;
	BinInt.copy(tempC, c); BinInt.copy(tempA, a);
	var val, i, len = tempA._length;
	var lmb = len-b;
	tempA._position = tempA._length-1; val = tempA.read(); tempA._position = b;
	tempC._position = 0;
	for(i=0;i<lmb;++i){
		val = tempA.read();
		tempC.write( val );
	}
	if(!arith){
		val = 0;
	}
	for(;i<len;++i){
		tempC.write( val );
	}
	BinInt.copy(c,tempC);
};

BinInt.isNegative = function(a){ // a<0
	var was = a._position;
	a._position = a._length - 1;
	var isNeg = a.read();
	a._position = was;
	return isNeg;
};
BinInt.add = function(c, a,b){ // c = a + b
	var tempA = BinInt.TEMP_A, tempB = BinInt.TEMP_B, tempC = BinInt.TEMP_C;
	var i, len = c.length(), aV, bV, cV = 0;
	BinInt.copy(tempA,a); BinInt.copy(tempB,b); BinInt.copy(tempC,c);
	tempA.position(0); tempB.position(0); tempC.position(0);
	for(i=0;i<len;++i){
		aV = tempA.read(); bV = tempB.read();
		tempC.write( (aV ^ bV) ^ cV );
		cV = (aV&&bV) || (bV&&cV) || (cV&&aV);
	}
	BinInt.copy(c,tempC);
	return (cV!=0)?1:0;
};

BinInt.neg = function(c, a){ // c = -a
	BinInt.not(c,a);
	BinInt.add(c,BinInt.ONE,c);
};
BinInt.sub = function(c, a,b){ // c = a - b
	BinInt.copy(BinInt.TEMP_C, c);
	BinInt.neg(BinInt.TEMP_C , b );
	return BinInt.add( c, a, BinInt.TEMP_C );
};
BinInt.abs = function(c, a){ // c = |a|
	if( BinInt.isNegative(a) ){
		BinInt.neg(c,a);
	}else if(c!=a){
		BinInt.copy(c,a);
	}
};

BinInt.mul = function(c, a,b){ // c = a * b
	var tempA = BinInt.TEMP_MUL_A_ABS, tempB = BinInt.TEMP_MUL_B_ABS;
	BinInt.abs(tempA, a); BinInt.abs(tempB, b);
	var i, len = c.length();
	c.zero();
	tempA._position = 0;
	for(i=0;i<len;++i){
		if(tempA.read()!=0){
			BinInt.left(BinInt.TEMP_MUL_B, tempB, i);
			BinInt.add(c,BinInt.TEMP_MUL_B,c);
			//BinInt.add(c,tempB,tempC);
		}
		//BinInt.left(c, tempB, 1);
	}
	var isNegA = BinInt.isNegative(a), isNegB = BinInt.isNegative(b);
	if( isNegA ^ isNegB ){
		BinInt.neg(c, c)
	}
};
// DIVISOR | DIVIDEND = QUOTIENT
//
BinInt.rem = function(r,c, a,b){ // c = a / b, r = a%b
	var sor = BinInt.TEMP_REM_SOR, end = BinInt.TEMP_REM_END, quo = BinInt.TEMP_REM_QUO, div = BinInt.TEMP_REM_DIV;
	var i, len = c.length();
	BinInt.abs(sor,b);
	BinInt.abs(end,a);
	quo.zero();
	for(i=0;i<=len;++i){
		BinInt.left(quo, quo, 1);
		BinInt.right(div, end, len-i);
		if( BinInt.gte(div,sor) ){ // div is now a temp var
			BinInt.left(div, sor, len-i);
			BinInt.sub(end, end, div);
			BinInt.add(quo, quo, BinInt.ONE);
		}
	}
	i = BinInt.isNegative(a);
	len = BinInt.isNegative(b);
	if(i && len || !i && !len){
		if(c){ BinInt.copy(c,quo); }
		if(r){ BinInt.copy(r,end); }
	}else{
		if(c){ BinInt.neg(c,quo); }
		if(r){ BinInt.neg(r,end); }
	}
};
// DIVISOR | DIVIDEND = QUOTIENT
BinInt.div = function(c, a,b){ // c = a / b
	BinInt.rem(null,c,a,b);
};
BinInt.mod = function(c, a,b){ // c = a % b
	BinInt.rem(c,null,a,b);
};
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
BinInt.TEMP_MUL_C_ABS = null;
BinInt.TEMP_MUL_B = null;
//
BinInt.TEMP_C = null;
BinInt.TEMP_B = null;
BinInt.TEMP_A = null;
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
		BinInt.TEMP_MUL_C_ABS = new BinInt();
		BinInt.TEMP_MUL_B = new BinInt();
		//
		BinInt.TEMP_A = new BinInt();
		BinInt.TEMP_B = new BinInt();
		BinInt.TEMP_C = new BinInt();
		//
		BinInt.TEMP_REM_SOR = new BinInt();
		BinInt.TEMP_REM_END = new BinInt();
		BinInt.TEMP_REM_DIV = new BinInt();
		BinInt.TEMP_REM_QUO = new BinInt();
		BinInt.TEMP_REM_TEMP = new BinInt();
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
			BinInt.rem(rem,num,num,ten);
			str = rem.getIntValue()+str;
			//BinInt.copy(num,temp);
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
	self.length(totSize?totSize:128);
};
