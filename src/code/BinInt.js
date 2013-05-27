// BinInt
BinInt.copy = function(c, a){
	ByteData.copy(c, a);
	c._signed = a._signed;
}
//////////////////////////////////////////////////////////////////////////////////////////////////// AND
BinInt.and = function(c, a,b){ // c = a & b 
	var tempA = BinInt.TEMP_A, tempB = BinInt.TEMP_B, tempC = BinInt.TEMP_C;
	var i, len = c.length(), aV, bV;
	BinInt.copy(tempA,a); BinInt.copy(tempB,b); BinInt.copy(tempC,c);
	tempA.position(0); tempB.position(0); tempC.position(0);
	for(i=0;i<len;++i){
		aV = tempA.read(); bV = tempB.read();
		tempC.write( (aV!=0) && (bV!=0) );
	}
	BinInt.copy(c,tempC);
};
BinInt.andFast = function(c, a,b){ // c = a & b   |a| = |b| = |c|
	var datA = a._data, datB = b._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = datA[i] & datB[i];
	}
};
//////////////////////////////////////////////////////////////////////////////////////////////////// OR
BinInt.or = function(c, a,b){ // c = a | b 
	var tempA = BinInt.TEMP_A, tempB = BinInt.TEMP_B, tempC = BinInt.TEMP_C;
	var i, len = c.length(), aV, bV;
	BinInt.copy(tempA,a); BinInt.copy(tempB,b); BinInt.copy(tempC,c);
	tempA.position(0); tempB.position(0); tempC.position(0);
	for(i=0;i<len;++i){
		aV = tempA.read(); bV = tempB.read();
		tempC.write( (aV!=0) || (bV!=0) );
	}
	BinInt.copy(c,tempC);
};
BinInt.orFast = function(c, a,b){ // c = a | b   |a| = |b| = |c|
	var datA = a._data, datB = b._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = datA[i] | datB[i];
	}
};
//////////////////////////////////////////////////////////////////////////////////////////////////// XOR
BinInt.xor = function(c, a,b){ // c = a ^ b 
	var tempA = BinInt.TEMP_A, tempB = BinInt.TEMP_B, tempC = BinInt.TEMP_C;
	var i, len = c.length(), aV, bV;
	BinInt.copy(tempA,a); BinInt.copy(tempB,b); BinInt.copy(tempC,c);
	tempA.position(0); tempB.position(0); tempC.position(0);
	for(i=0;i<len;++i){
		aV = tempA.read(); bV = tempB.read();
		tempC.write( ((aV==0) && (bV!=0)) || ((aV!=0) && (bV==0)) );
	}
	BinInt.copy(c,tempC);
};
BinInt.xorFast = function(c, a,b){ // c = a ^ b   |a| = |b| = |c|
	var datA = a._data, datB = b._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = datA[i] ^ datB[i];
	}
};
//////////////////////////////////////////////////////////////////////////////////////////////////// NOT
BinInt.not = function(c, a){ //  c = ~a
	var tempA = BinInt.TEMP_A, tempC = BinInt.TEMP_C;
	var i, len = c.length(), aV;
	BinInt.copy(tempA,a); BinInt.copy(tempC,c);
	tempA.position(0); tempC.position(0);
	for(i=0;i<len;++i){
		aV = tempA.read();
		tempC.write( aV==0 );
	}
	BinInt.copy(c,tempC);
};
BinInt.notFast = function(c, a){ // c = ~a   |a| = |c|
	var datA = a._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = ~datA[i];
	}
};
//////////////////////////////////////////////////////////////////////////////////////////////////// LEFT
BinInt.left = function(c, a, b, arith){ // c = a<<b [arithmetic]
	var tempC = BinInt.TEMP_C, tempA = BinInt.TEMP_A;
	BinInt.copy(tempC, a); BinInt.copy(tempA, a);
	var val, i, len = tempA._length;
	for(i=len-1; i>=b; --i){
		tempA._position = i-b;
		val = tempA.read();
		tempC._position = i;
		tempC.write( val );
	}
	if(!arith){
		val = 0;
	}else{
		tempA._position = 0;
		val = tempA.read();
	}
	tempC._position = 0;
	for(i=0;i<b;++i){
		tempC.write( val );
	}
	len = c._length;
	var was = c._position;
	if(len==tempC._length){
		BinInt.copy(c,tempC);
	}else{
		c._position = 0;
		tempC._position = 0;
		for(i=0;i<len;++i){
			val = tempC.read();
			c.write( val );
		}
	}
	c._position = was;
};
BinInt.leftCircular = function(c, a, b){ // c = a<<b [circular]
	var tempC = BinInt.TEMP_C, tempA = BinInt.TEMP_A;
	BinInt.copy(tempC, a); BinInt.copy(tempA, a);
	var val, i, len = tempA._length;
	b = b%len;
	for(i=0; i<len; ++i){
		tempA._position = (len+i-b)%len;
		val = tempA.read();
		tempC._position = i;
		tempC.write( val );
	}
	len = c._length;
	var was = c._position;
	if(len==tempC._length){
		BinInt.copy(c,tempC);
	}else{
		c._position = 0;
		tempC._position = 0;
		for(i=0;i<len;++i){
			val = tempC.read();
			c.write( val );
		}
	}
	c._position = was;
};
//////////////////////////////////////////////////////////////////////////////////////////////////// RIGHT
BinInt.right = function(c, a, b, arith){ // c = a>>b [arithmetic]
	var tempC = BinInt.TEMP_C, tempA = BinInt.TEMP_A;
	BinInt.copy(tempC, a); BinInt.copy(tempA, a);
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
	//
	len = c._length;
	var was = c._position;
	if(len==tempC._length){
		BinInt.copy(c,tempC);
	}else{
		c._position = 0;
		tempC._position = 0;
		for(i=0;i<len;++i){
			val = tempC.read();
			c.write( val );
		}
	}
	c._position = was;
};
BinInt.rightCircular = function(c, a, b){ // c = a>>b [circular]
	var tempC = BinInt.TEMP_C, tempA = BinInt.TEMP_A;
	BinInt.copy(tempC, a); BinInt.copy(tempA, a);
	var val, i, len = tempA._length;
	b = b%len;
	for(i=0; i<len; ++i){
		tempA._position = (len-i+b)%len;
		val = tempA.read();
		tempC._position = i;
		tempC.write( val );
	}
	len = c._length;
	var was = c._position;
	if(len==tempC._length){
		BinInt.copy(c,tempC);
	}else{
		c._position = 0;
		tempC._position = 0;
		for(i=0;i<len;++i){
			val = tempC.read();
			c.write( val );
		}
	}
	c._position = was;
};
//////////////////////////////////////////////////////////////////////////////////////////////////// IS-NEGATIVE
BinInt.isNegative = function(a){ // a<0
	if(!a._signed){ return false; }
	var was = a._position;
	a._position = a._length - 1;
	var isNeg = a.read();
	a._position = was;
	return isNeg!=0?true:false;
};
//////////////////////////////////////////////////////////////////////////////////////////////////// EQUAL-TO
BinInt.eq = function(c, a){ // c == a
	var negA = BinInt.isNegative(a), negC = BinInt.isNegative(c);
	if( (negA && !negC) || (!negA && negC) ){
		return false;
	}else if( negA && negC ){
		// 
	}
	var wasA = a.position(), wasC = c.position();
	var valA, valC;
	var retVal = true;
	var len = Math.max( a.length(), c.length() );
	for(i=len-1; i>=0; --i){
		a._position = i; c._position = i;
		valA = a.read(); valC = c.read();
		if( valA != valC ){
			retVal = false;
			break;
		}
	}
	a._position = wasA; c._position = wasC;
	return retVal;
};
//////////////////////////////////////////////////////////////////////////////////////////////////// GREATER-THAN-EQUAL-TO
BinInt.ge = function(c, a){ // c >= a
	var negA = BinInt.isNegative(a), negC = BinInt.isNegative(c);
	if( negA && !negC ){
		return true;
	}else if( !negA && negC ){
		return false;
	}else if( negA && negC ){
		// 
	}
	var wasA = a.position(), wasC = c.position();
	var valA, valC, retVal = true;
	var len = Math.max( a.length(), c.length() );
	for(i=len-1; i>=0; --i){
		a._position = i; c._position = i;
		valA = a.read(); valC = c.read();
		if( (valA==0) && (valC!=0) ){
			retVal = true;
			break;
		}else if( valA != valC ){
			retVal = false;
			break;
		}
	}
	a._position = wasA; c._position = wasC;
	return retVal;
};
//////////////////////////////////////////////////////////////////////////////////////////////////// GREATER-THAN
BinInt.gt = function(c, a){ // c > a
	var negA = BinInt.isNegative(a), negC = BinInt.isNegative(c);
	if( negA && !negC ){
		return true;
	}else if( !negA && negC ){
		return false;
	}else if( negA && negC ){
		// 
	}
	var wasA = a.position(), wasC = c.position();
	var valA, valC, retVal = true;
	var len = Math.max( a.length(), c.length() );
	var eq = true;
	for(i=len-1; i>=0; --i){
		a._position = i; c._position = i;
		valA = a.read(); valC = c.read();
		if( (valA==0) && (valC!=0) ){
			retVal = true;
			eq = false;
			break;
		}else if( valA != valC ){
			retVal = false;
			eq = false;
			break;
		}
	}
	a._position = wasA; c._position = wasC;
	if(eq){
		return false;
	}
	return retVal;
};
//////////////////////////////////////////////////////////////////////////////////////////////////// LESS-THAN-EQUAL-TO
BinInt.le = function(c, a){ // c < a
	return !BinInt.gt(c,a);
};
//////////////////////////////////////////////////////////////////////////////////////////////////// LESS-THAN
BinInt.lt = function(c, a){ // c < a
	return !BinInt.gte(c,a);
};
//////////////////////////////////////////////////////////////////////////////////////////////////// ADD
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
	var isNegA = BinInt.isNegative(tempA), isNegB = BinInt.isNegative(tempA);
	BinInt.abs(tempA, a); BinInt.abs(tempB, b);
	var i, len = c.length();
	c.zero();
	tempA.position(0);
	for(i=0;i<len;++i){
		if(tempA.read()!=0){
			BinInt.left(BinInt.TEMP_MUL_B, tempB, i);
			BinInt.add(c,BinInt.TEMP_MUL_B,c);
		}
	}
	if( isNegA ^ isNegB ){
		BinInt.neg(c, c)
	}
};
// DIVISOR | DIVIDEND = QUOTIENT
/*
BinInt.rem = function(r,c, a,b){ // c = a / b, r = a%b
	var sor = BinInt.TEMP_REM_SOR, end = BinInt.TEMP_REM_END, quo = BinInt.TEMP_REM_QUO, div = BinInt.TEMP_REM_DIV;
	var i, len = c.length();
	if(a._signed && b._signed && c._signed){
		BinInt.abs(sor,b);
		BinInt.abs(end,a);
	}else{
		BinInt.copy(sor,b);
		BinInt.copy(end,a);
	}
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
*/


BinInt.rem = function(r,c, a,b){ // c = a / b, r = a%b
	var sor = BinInt.TEMP_REM_SOR, end = BinInt.TEMP_REM_END, quo = BinInt.TEMP_REM_QUO, div = BinInt.TEMP_REM_DIV;
	var skipped, i, len = c.length();
	if(a._signed && b._signed && c._signed){
		BinInt.abs(sor,b);
		BinInt.abs(end,a);
	}else{
		BinInt.copy(sor,b);
		BinInt.copy(end,a);
	}
	var bitLenA = a._position, bitLenB = b._position;
	for(i=len-1;i>=0;--i){ a._position = i; if( a.read()!=0 ){ a._position = bitLenA; bitLenA = i; break; } }
	for(i=len-1;i>=0;--i){ b._position = i; if( b.read()!=0 ){ b._position = bitLenB; bitLenB = i; break; } }
	//console.log("bitLenA: "+bitLenA);
	//console.log("bitLenB: "+bitLenB);
	quo.zero();
	i = len - Math.max(bitLenA,bitLenB);
	while(i<=len){//bitLenB){//for(i=0;i<=len;++i){
		BinInt.left(quo, quo, 1);
		BinInt.right(div, end, len-i);
		// ONLY REALLY HAVE TO CHECK EVERY N-th OR N-th+1 time - 
		if( BinInt.gte(div,sor) ){ // div is now a temp var
			BinInt.left(div, sor, len-i);
			BinInt.sub(end, end, div);
			BinInt.add(quo, quo, BinInt.ONE);
			//console.log("inside: "+i);
		}
		++i;
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
//////////////////////////////////////////////////////////////////////////////////////////////////// POWER
BinInt.pow = function(c, a,b){ // c = a^b
	c.setFromInt(1);
	if( BinInt.eq(a,BinInt.ZERO) ){
		c.setFromInt(0);
		return;
	}else if( BinInt.eq(b,BinInt.ZERO) ){
		return;
	}
	var n = BinInt.TEMP_POWER_N;
	var i, len = c.length();
	BinInt.copy(n,a);
	n.length(len);
	var was = b._position;
	b.position(0);
	for(i=0;i<len;++i){
		if( b.read()!=0 ){
			console.log(i+" : 0");
			BinInt.mul(c,c,n);
		}
		BinInt.mul(n,n,n);
	}
}

BinInt.sameBitLength = function(c, a){ // c.length = a.length
	//
};
BinInt.LETTERS = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
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
BinInt.TEMP_POWER_N = null;
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
		BinInt.TEMP_POWER_N = new BinInt();
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



function BinInt(totSize, signed){
	BinInt.init();
	Code.extendClass(this,ByteData,arguments);
	var self = this;
	this.read = Code.overrideClass(this, this.read, function(){
		//console.log(self._position);
		if(self._position >=self._length){ // always return the last bit
			return BinInt.isNegative(self)?1:0;
		}else{
			return self.super(arguments.callee).read.call(self,null);
		}
	});
	//
	this._signed = (signed===true || signed===false)?signed:false;
	//this._signed = false;
	this.signed = function(s){
		return this._signed;
	}
	this.zero = function(){
		var i, len = self._data.length;
		for(i=0;i<len;++i){
			self._data[i] = 0;
		}
		self._position = 0;
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
			num = 1;
		}else{
			num = 0;
		}
		len = self.length();	
		for(;i<len;++i){
			self.write(num);
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
	this.toStringHex = Code.overrideClass(this, this.toStringHex, function(){
		var str = "";
		var i, len = Math.ceil( (self._length)/4.0 );
		self._position = 0;
		for(i=0;i<len;++i){
			if ( i%8==0 && i>0){
				str = "|" + str;
			}
			str = (self.readUint4().toString(16).toUpperCase())+str;
		}
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
			//console.log(rem.getIntValue());
			//BinInt.copy(num,temp);
		}
		return str;
 	};
 	this.getIntValue = function(){
 		var was = self.position();
 		var i, len = self.length();
 		var num = 0;
 		self._position = 0;
 		for(i=0;i<len;++i){
 			if( self.read()!=0 ){
 				num = num | (1<<i);
 			}
 		}
 		self._position = was;
 		return num;
 	}
	this.kill = Code.overrideClass(this, this.kill, function(){

		self.super(arguments.callee).kill.call(self,null);
	});
	//
	self.length(totSize?totSize:32);
};




BinInt.millerRabinPrime = function(c){ // c probably isn't a composite - 1/4

}
BinInt.isPrime = function(c){ // c probably isn't a composite
	for(var i=0;i<10;++i){
		if(!millerRabinPrime(c)){
			return false;
		}
	}
	return true;
}
BinInt.gcd = function(c, a,b){ // c = gcd(a,b)
	//
	// 
}
// ------------------- CRYPTOGRAPHICS




/*






Diffie-Hellman: 
PUBLIC: p = prime number, g = base
A: a = 6;  A = mod( g^a, p )
B: b = 15; B = mod( g^b, p )
s = sA = sB = mod( A.^b, p ) = mod( B.^a, p )

p = 23;
g = 6;
a = 6;
A = mod(g.^a,p);
b = 6;
B = mod(g.^b,p);
sA = mod(A.^b,p);
sB = mod(B.^a,p);
sA
sB

isprime(127)

STEPS:
1) Alice computes random prime number [2^1024+] = p
2) Alice computes random prime number [2^1024+] = g
		primitive root modulo p?
		base number [] = g
3) Alice shares p and g with Bob
4) Alice computes random number [] = a	| Bob computes random number [] = b
5) Alice computes g^a % p = A	| Bob computes g^b % p = B
6) Alice sends A to Bob	| Bob sends B to Alice
7) Alice computes  s = B^a % p	| Bob computes s = A^b % p
Public: p, g, A, B
Secret: a, s | b, s

IMPLEMENTATIONS:
0) pow function 
1) random number generator
2) prime number checker
3) random prime number generator
4) primitive root calculateion

p = 23;
g = 6;
a = 6;
A = mod(g.^a,p);
b = 6;
B = mod(g.^b,p);
sA = mod(A.^b,p);
sB = mod(B.^a,p);
sA
sB



Necessary Cryptography:

ANY COMMUNICATION NEEDS A KEY ---- WHERE IS THIS KEY STORED? COOKIES?

REGISTERING / INITIALIZING COMMUNICATION SESSION:::::::::::::::::::::::: ECOMID != ENCRYPT(COMID)
1) CLIENT ASKS SERVER TO INITIALIZE A SESSION
2) SERVER GIVES CLIENT PUBLIC-KEY-1 + COMMUNICATION IDENTIFIER (COMMID)
3) CLIENT GIVES SERVER PUBLIC-KEY-2 + ENCRYPTED PASSWORD + ENCRYPTED COMMID (ECOMID)
4) SERVER GIVES CLIENT OK + ECOMID

CONTINUING AN EXISTING SESSION:::::::::::::::::::
1) CLIENT ASKS SERVER FOR A SERVICE + ENCRYPTED DATA/REQUEST + ECOMID
2) SERVER ASKS CLIENT TO DECRYPT, COMPUTE, ENCRYPT, RETURN A RANDOM-FUNCTION-HASH + ECOMID
3) CLIENT SENDS SERVER ENCRYPTED FUNCTION(HASH,...) RESULT + ECOMID
4) SERVER GIVES CLIENT OK + ENCRYPTED DATA/RESPONSE

VERIFICATION CHECKS:
*SHORT AMOUNT OF TIME HAS PASSED (AN HOUR?)
*INCORRECT RESPONSE

page?id=

OPERATIONS
AND
OR
XOR
NOT
CSL
CSR

REPRESENTED AS 256 HEX NUMERALS
EID  = 1024-bit encrypted random-hash
DATA = N-bit encrypted data

CHARS:
32:   8  	6 		= 1.333
64:   16 	11 		= 1.454
128:  32 	22 		= 1.454
256:  64 	42 		= 1.523
512:  128	86 		= 1.488
1024: 256	171 	= 1.497
EX:
32:   01234567
64:   0123456789ABCDEF
128:  0123456789ABCDEFGHIJKLMNOPQRSTUV
256:  0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./
512:  0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./
1024: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz./


AES - 128 block size

http://en.wikipedia.org/wiki/Advanced_Encryption_Standard

http://en.wikipedia.org/wiki/Primality_test

*/






