// BinInt.js < ByteData

// NODEJS INCLUSION
isBrowser = false;
isNode = false;
if (typeof module !== 'undefined' && module.exports) { isNode = true; }
if (typeof window !== 'undefined' && window.navigator) { isBrowser = true; }
if(isNode){
	var Code = require("./Code.js");
	var ByteData = require("./ByteData.js");
}


BinInt.SHORTINT = 16;
BinInt.INT = 32;
BinInt.LONGINT = 64;
BinInt.ENC_LO = 256;
BinInt.ENC_ME = 512;
BinInt.ENC_HI = 1024;
BinInt.END_SE = 2048;
// ------------------------------------------------------------------------------------------
BinInt.copy = function(c, a){ // exact copy - data, length, sign
	ByteData.copy(c, a);
	c._signed = a._signed;
}
BinInt.prototype.copy = function(b){
	BinInt.copy(this,b);
}
BinInt.copyLen = function(c, a){ // c will get same storage length as a
	c.length( a.length() );
}
BinInt.copyReg = function(c, a){ // copy from |a| to fit |c| as if hardware-register
	var wasA = a.position(), wasC = c.position();
	var lenC = c.length();
	var valA;
	a.position(0); c.position(0);
	for(i=0;i<lenC;++i){
		valA = a.read();
		c.write(valA);
	}
	a.position(wasA); c.position(wasC);
};
// ------------------------------------------------------------------------------------------
function BinInt(sizeInBits, signed){
	BinInt._.constructor.call(this);
	this._signed = (signed===true || signed===false)?signed:false;
	this.length(sizeInBits?sizeInBits:32);
}
Code.inheritClass(BinInt, ByteData);

// ------------------------------------------------------------------------------------------ READ
BinInt.prototype.read = function read(){
	if(this._position >=this._length){ // always return the last bit
		return BinInt.isNegative(this?1:0);
	}else{
		return BinInt._.read.call(this);
	}
}
BinInt.prototype.signed = function signed(s){
	return this._signed;
}
BinInt.prototype.zero = function zero(){
	var i, len = this._data.length;
	for(i=0;i<len;++i){
		this._data[i] = 0;
	}
	this._position = 0;
}
// ------------------------------------------------------------------------------------------ SET
BinInt.prototype.setFromString = function setFromString(str){
	var i, len = Math.min(this.length(), str.length);
	this.zero();
	this.position(0);
	for(i=len-1;i>=0;--i){
		this.write( str.charAt(i)!="0" );
	}
}

BinInt.prototype.setFromInt = function setFromInt(num){
	var i, len = Math.min(this.length(), 32);
	var ander = 1;
	this.zero();
	this.position(0);
	for(i=0;i<len;++i){
		this.write( (ander&num)!=0?1:0 );
		ander <<= 1;
	}
	if(num<0){
		num = 1;
	}else{
		num = 0;
	}
	len = this.length();	
	for(;i<len;++i){
		this.write(num);
	}
	// AUTO - REVERSE ?
}
BinInt.prototype.writeStringHex = function(str){
	var len = str.length;
	// console.log(len+" "+this.length());
	var bitsTotal = len*4;
	var length = this.length();
	if(bitsTotal!==length){
		if(bitsTotal>length){
			throw "too long - potential overlow?";
		} //  else:
		var diff = length-bitsTotal;
		var mod = diff % 4;
		if(mod!=0){
			throw "non 4 divisible";
		}
		diff /= 4;
		str = Code.prependFixed(str,"0",diff + len);
		// console.log("new str: "+str);
	}
	return BinInt._.writeStringHex.apply(this,[str]);

}
// ------------------------------------------------------------------------------------------ PRINT
BinInt.prototype.toStringDebug = function(){
	return this.toStringBinInt()+" = "+this.toString10Int()+" = "+this.toStringHexInt();
}

BinInt.prototype.toStringBinInt = function toStringBin(){
	var str = "", i, len = this.length(), was = this.position();
	this.position(0);
	for(i=0;i<len;++i){
		if ( i%8==0 && i>0){
			str = "|"+str;
		}
		str = this.read()+str;
	}
	this.position(was);
	str = "["+this.length()+"]"+str;
	return str;
}
BinInt.prototype.toStringHexInt = function toStringHex(){ // REVERSE print out
	// console.log("toStringHexInt");
	var str = "";
	var i, len = Math.ceil( (this._length)/4.0 );
	var was = this.position();
	this.position(0);
	for(i=0;i<len;++i){
		if ( i%8==0 && i>0){
			str = "|" + str;
		}
		var four = this.readUint4();
		var inv = ((four&0x01)<<3) | ((four&0x02)<<1) | ((four&0x04)>>1)  | ((four&0x08)>>3);
		var char = ByteData.HEX_LOOKUP[inv];
		str = char+str;

	}
	this.position(was);
	str = "["+this.length()+"]"+str;
	return str;
}
BinInt.prototype.toString10Int = function(){
	str = "";
	var ten = new BinInt(), num = new BinInt(), rem = new BinInt(), temp = new BinInt();
	BinInt.copy(ten, this);
	BinInt.copy(num, this);
	BinInt.copy(rem, this);
	BinInt.copy(temp, this);
	ten.setFromInt(10);
	BinInt.copy(num,this);
	var isNeg = false;
	if(BinInt.isNegative(num)){
		isNeg = true;
		BinInt.neg(num,num);
	}
	var gt = BinInt.gt(num,BinInt.ZERO);
	var val;
	while( gt ){
		BinInt.rem(rem,num,num,ten);
		val = rem.getIntValue();
		str = val+str;
		//console.log(rem.getIntValue());
		//BinInt.copy(num,temp);
		gt = BinInt.gt(num,BinInt.ZERO);
	}
	if(str == ""){
		str = "0";
	}else if(isNeg){
		str = "-" + str;
	}
	return str;
}
BinInt.prototype.getIntValue = function getIntValue(){
	var was = this.position();
	var i, len = this.length();
	var num = 0;
	this._position = 0;
	for(i=0;i<len;++i){
		if( this.read()!=0 ){
			num = num | (1<<i);
		}
	}
	this._position = was;
	return num;
}
// ------------------------------------------------------------------------------------------ RANDOMIZE
BinInt.prototype.randomize = function(rng){
	var i, len = this.length();
	this.position(0);
	if(rng){
		for(i=0;i<len;++i){
			this.write( (rng.next()%2)==1?1:0 );
		}
	}else{
		for(i=0;i<len;++i){
			this.write( ( Math.floor(Math.random()*1000) %2)==1?1:0 );
		}
	}
}
// BinInt.randomize = function(c, rng){
// 	c.randomize(rng);
// }
BinInt.randomize = function(c, rng){
	var i, len = c.length();
	c.position(0);
	if(rng){
		for(i=0;i<len;++i){
			c.write( (rng.next()%2)==1?1:0 );
		}
	}else{
		for(i=0;i<len;++i){
			c.write( ( Math.floor(Math.random()*1000) %2)==1?1:0 );
		}
	}
}
// ------------------------------------------------------------------------------------------ KILL
BinInt.prototype.kill = function kill(){
	this._signed = false;
	ByteData.prototype.kill.call(this);
}
// ------------------------------------------------------------------------------------------ OPERATIONS:
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// AND
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
}
BinInt.andFast = function(c, a,b){ // c = a & b   |a| = |b| = |c|
	var datA = a._data, datB = b._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = datA[i] & datB[i];
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// OR
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
}
BinInt.orFast = function(c, a,b){ // c = a | b   |a| = |b| = |c|
	var datA = a._data, datB = b._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = datA[i] | datB[i];
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// XOR
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
}
BinInt.xorFast = function(c, a,b){ // c = a ^ b   |a| = |b| = |c|
	var datA = a._data, datB = b._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = datA[i] ^ datB[i];
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// NOT
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
}
BinInt.notFast = function(c, a){ // c = ~a   |a| = |c|
	var datA = a._data, datC = c._data;
	var i, len = datC.length;
	for(i=0;i<len;++i){
		datC[i] = ~datA[i];
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// LEFT
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
}
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
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// RIGHT
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
}
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
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// IS-NEGATIVE
BinInt.isNegative = function(a){ // a<0
	if(!a._signed){ return false; }
	var was = a._position;
	a._position = a._length - 1;
	var isNeg = a.read();
	a._position = was;
	return isNeg!=0?true:false;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// EQUAL-TO
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
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// GREATER-THAN-EQUAL-TO
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
	a.position(0); c.position(0);
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
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// GREATER-THAN
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
	a.position(0); c.position(0);
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// LESS-THAN-EQUAL-TO
BinInt.le = function(c, a){ // c < a
	return !BinInt.gt(c,a);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// LESS-THAN
BinInt.lt = function(c, a){ // c < a
	return !BinInt.ge(c,a);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ADD
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
}
BinInt.add2 = function(c, a,b){ // c = a + b
	var i, len = c.length()/32;
	var loA, hiA, loB, hiB, loC, hiC, carry = 0;
	for(i=0;i<len;++i){
		loA = a._data[i] & 0x0000FFFF;
		hiA = (a._data[i] >> 16) & 0x0000FFFF;
		loB = b._data[i] & 0x0000FFFF;
		hiB = (b._data[i] >> 16) & 0x0000FFFF;
		console.log( BinInt.intToBinaryString(a._data[i]) );
		console.log( BinInt.intToBinaryString(hiA,16) + "" + BinInt.intToBinaryString(loA,16) );
		loC = loA + loB + carry;
		carry = (loC >> 16) & 0x0000FFFF;
		hiC = hiA + hiB + carry;
		carry = (hiC >> 16) & 0x0000FFFF;
		c._data[i] = ( hiC << 16 ) | loC;
	}
}

// ByteData.add = BinInt.add;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// NEG
BinInt.neg = function(c, a){ // c = -a
	BinInt.not(c,a);
	BinInt.add(c,BinInt.ONE,c);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// SUB
BinInt.sub = function(c, a,b){ // c = a - b
	BinInt.copy(BinInt.TEMP_C, c);
	BinInt.neg(BinInt.TEMP_C , b );
	return BinInt.add( c, a, BinInt.TEMP_C );
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// ABS
BinInt.abs = function(c, a){ // c = |a|
	if( BinInt.isNegative(a) ){
		BinInt.neg(c,a);
	}else{
		BinInt.copyReg(c,a);
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// MUL
BinInt.mul = function(c, a,b){ // c = a * b
	var tempA = BinInt.TEMP_MUL_A_ABS, tempB = BinInt.TEMP_MUL_B_ABS, tempC = BinInt.TEMP_MUL_B;
	var isNegA = BinInt.isNegative(a), isNegB = BinInt.isNegative(b);
	var tempLen =  Math.max(c.length(), a.length(), b.length());
	tempA.length(a.length()); BinInt.abs(tempA, a);
	tempB.length(tempLen); BinInt.abs(tempB, b);
	tempC.length(tempLen);
	var i, len = c.length();
	c.zero();
	tempA.position(0);
	for(i=0;i<len;++i){
		if(tempA.read()!=0){
			BinInt.left(tempC, tempB, i);
			BinInt.add(c,tempC,c);
		}
	}
	if( isNegA ^ isNegB ){
		BinInt.neg(c, c); // c._signed ?
	}
}
/*
23*51 = 1173

23*1 =   23
23*5 = 1150


2345*5321 = 12477745
2345*21 =      49245
2345*53 =   12428500




00|00|23|45*00|00|53|21 = 12|47|77|45

00|00|23|45*00|00|53|21

        *0*0*0*0
23*21 =    483
23*53 = 1219
45*21 =      945
45*53 =   2385
48300+12190000+954+238500

l1*l0 * 2^0
l1*h0 * 2^16
h1*l0 * 2^16
h1*h0 * 2^32

lo * lo stays as is
lo * hi - half is added to THIS, half to NEXT
hi * hi - 

carry = what high+1 bits would have been 





335*2345 = 785575

785575/335 = 2345

[78|55|75]/[00|03|35] = [00|23|45]

[78|55|75]/[00|03|35] = [00|23|45]



[00|78|55|75]/[00|00|03|35]
HI = maximum possible number (all 1s)
LO = minimum possible number (all 0s)
335 * 10000 = 3350000 > 785575
335 * 1000 = 335000 < 785575
335 * 5000 = 1675000 > 785575
335 * 3000 = 1005000 > 785575
335 * 1500 = 502500 < 785575
335 * 2250 = 753750 < 785575
335 * 2625 = 879375 > 785575
335 * 2312 = 774520 < 785575
335 * 2468 = 826780 > 785575
335 * 2390 = 800650 > 785575
335 * 2351 = 787585 > 785575
335 * 2300 = 770500 < 785575
335 * 2325 = 778875 < 785575
335 * 2338 = 783230 < 785575
335 * 2344 = 785240 < 785575
335 * 2344 = 785240 < 785575
335 * 2347 = 786245 > 785575
335 * 2345 = 785575 = 785575
IF number is same BEFORE/AFTER - then use the smaller, and remainder by subtraction


335 * 2318 = 776530 < 785575
335 * 2321 = 777535 < 785575
335 * 2323 = 777535 < 785575


...............................
12345678/9012 =  1369.91544607
12000000/9000 =  1333.3
340000/90 =      3777.8
5600/90 =          62.222
78/90 =             0.86666
12000000/12 = 1000000.0
340000/12 =     28333.333
5600/12 =         466.666
78/12 =             6.5

1333+3777+62+1000000+28333+466+6 = 1033977

12345678/90 = 137174.2
12345678/12 =   1028806.5
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// REMAINDER = DIV + MOD
BinInt.rem = function(r,c, a,b){ // c = a/b, r = a%b 	:	DIVISOR | DIVIDEND = QUOTIENT
	var sor = BinInt.TEMP_REM_SOR, end = BinInt.TEMP_REM_END, quo = BinInt.TEMP_REM_QUO, div = BinInt.TEMP_REM_DIV;
	var skipped, i, len = Math.max((c!=null)?c.length():0, a.length(), b.length());// r?0:r.length()
		sor.length(len); BinInt.abs(sor,b);
		end.length(len); BinInt.abs(end,a);
		quo.length(len);
		div.length(len);
	var bitLenA = a._position, bitLenB = b._position;
	quo.zero();
	for(i=0; i<=len; ++i){//bitLenB){
	//console.log("............"+quo.toString());
		BinInt.left(quo, quo, 1);
		BinInt.right(div, end, len-i);
		// ONLY REALLY HAVE TO CHECK EVERY N-th OR N-th+1 time - 
		if( BinInt.ge(div,sor) ){ // div is now a temp var
			BinInt.left(div, sor, len-i);
			BinInt.sub(end, end, div);
			BinInt.add(quo, quo, BinInt.ONE);
		}
	}
	i = BinInt.isNegative(a);
	len = BinInt.isNegative(b);
	if(i && len || !i && !len){
		if(c){ BinInt.copyReg(c,quo); }
		if(r){ BinInt.copyReg(r,end); }
	}else{
		if(c){ BinInt.neg(c,quo); } // c._signed ?
		if(r){ BinInt.neg(r,end); } // r._signed ?
	}
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// DIVISION
BinInt.div = function(c, a,b){ // c = a / b
	BinInt.rem(null,c,a,b);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// MODULIS
BinInt.mod = function(c, a,b){ // c = a % b
	BinInt.rem(c,null,a,b);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// POWER
BinInt.pow = function(c, a,b, mo){ // c = a^b % n
	if( BinInt.eq(a,BinInt.ZERO) ){
		c.setFromInt(0);
		return;
	}else if( BinInt.eq(b,BinInt.ZERO) ){
		c.setFromInt(1);
		return;
	}
	var i, len = c.length();
	var tempC = BinInt.TEMP_POWER_C; tempC.length(len*2); tempC.setFromInt(1);
	var n = BinInt.TEMP_POWER_N; n.length(len*2); BinInt.copyReg(n,a);
	var was = b._position;
	b.position(0);
	for(i=0;i<len;++i){
		if( b.read()!=0 ){
			BinInt.mul(tempC,tempC,n);
			if(mo){
				BinInt.mod(tempC,tempC,mo);
			}
		}
		BinInt.mul(n,n,n);
		if(mo){
			BinInt.mod(n,n,mo);
		}
	}
	b._position = was;
	BinInt.copyReg(c,tempC);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// MAX
BinInt.max = function(c, a,b){ // c = max(a,b)
	if( BinInt.gt(a,b) ){
		BinInt.copyReg(c,a);
	}else{
		BinInt.copyReg(c,b);
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// MIN
BinInt.min = function(c, a,b){ // c = min(a,b)
	if( BinInt.gt(b,a) ){
		BinInt.copyReg(c,a);
	}else{
		BinInt.copyReg(c,b);
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////// GCD
BinInt.gcd = function(c, a,b){ // c = gcd(a,b)
	var tempA = BinInt.TEMP_GCD_A, tempB = BinInt.TEMP_GCD_B, q = BinInt.TEMP_GCD_C, r = BinInt.TEMP_GCD_D;
	var len = Math.max( c.length(), b.length(), a.length() );
	tempA.length(len); tempB.length(len); q.length(len); r.length(len);
	BinInt.max(tempA, a,b);
	BinInt.min(tempB, a,b);
	while( !BinInt.eq(tempB,BinInt.ZERO) ){
		BinInt.rem(r,q, tempA, tempB);
		if( BinInt.eq(r,BinInt.ZERO) ){
			BinInt.copyReg(c, tempB);
			return;
		}
		BinInt.copyReg(tempA,tempB);
		BinInt.copyReg(tempB,r);
	}
	BinInt.copyReg(c, tempA);
};
// ------------------- CRYPTOGRAPHICS
//////////////////////////////////////////////////////////////////////////////////////////////////// MILLER-RABIN PRIMALITY TEST
BinInt.millerRabinPrime = function(n){ // c probably isn't a composite - 1/4
	var i, len = n.length();
	var nm1 = BinInt.TEMP_PRIME_A; nm1.length(len); BinInt.sub(nm1,n,BinInt.ONE);
	nm1._position = 0;
	for(i=0;i<len;++i){
		if(nm1.read()!=0){
			break;
		}
	}
	var m = BinInt.TEMP_PRIME_B; m.length(len); BinInt.right(m, nm1, i);
	var a = BinInt.TEMP_PRIME_D; a.length(len); a.setFromInt(0);
	while( BinInt.eq(a,BinInt.ZERO) ){ // le 2
		BinInt.randomize(a);
		BinInt.mod(a,a,nm1); // a should be in [2?,n-2]
	}
	var b = BinInt.TEMP_PRIME_E; b.length(len*2); BinInt.pow(b,a,m,n);
	if( BinInt.eq(b,BinInt.ONE) ){// || BinInt.eq(b,nm1) ){
		//console.log("ret1");
		return true;
	}
	for(; i>=0; --i){
		if( BinInt.eq(b,BinInt.ONE) ){
			console.log("ret1 - 2");
			return false;
		}else if( BinInt.eq(b,nm1) ){
			console.log("ret1 - 3");
			return true;
		}
		BinInt.mul(b,b,b);
		BinInt.mod(b,b,n);
	}
	console.log("ret1 - 4");
	return false;
}
BinInt.randomPrime = function(p, max, num){ // p = random prime number, max = maximum number of tests
	var i, j, maxTests = (max!=null && max!=undefined)?max:255, numTests = (num!=null && num!=undefined)?num:Math.round( Math.log(p.length() ));
	var done;
	for(i=0; i<maxTests; ++i){
		console.log(i);
		BinInt.randomize(p);
		p._position = 0; p.write(1);
		done = true;
		for(j=0; j<numTests; ++j){
			console.log(" > "+j);
			if( !BinInt.millerRabinPrime(p) ){
				done = false;
				break;
			}
		}
		if(done){
			return true;
		}
	}
	return false;
}
BinInt.diffieHellmanPublic = function(p,g){ // out: p = random prime number, g = random base
	p.signed(false); g.signed(false);
	console.log("P...");
	BinInt.randomPrime(p);
	console.log("G...");
	BinInt.randomPrime(g);
}
BinInt.diffieHellmanPrivate = function(pri,pub, p,g){ // in: p,g | out: pri = private key, pub = public key
	pri.signed(false); pub.signed(false);
	BinInt.randomize(pri);
	BinInt.pow(pub, g,pri, p);
}
BinInt.diffieHellmanSecret = function(s, pri,pub, p){ // in: pri,pub, p, out: secret
	BinInt.pow(s, pub,pri, p);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
// BinInt.LETTERS = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
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
BinInt.TEMP_POWER_C = null;
//
BinInt.TEMP_A = null;
BinInt.TEMP_B = null;
BinInt.TEMP_C = null;
//
BinInt.TEMP_GCD_A = null;
BinInt.TEMP_GCD_B = null;
BinInt.TEMP_GCD_C = null;
BinInt.TEMP_GCD_D = null;
BinInt.TEMP_DH = null;
BinInt.TEMP_PRIME_A = null;
BinInt.TEMP_PRIME_B = null;
BinInt.TEMP_PRIME_C = null;
BinInt.TEMP_PRIME_D = null;
BinInt.TEMP_PRIME_E = null;
BinInt.init = function(){
	if(!BinInt.INITIALIZED){
		BinInt.INITIALIZED = true;
		BinInt.ZERO = new BinInt(32);
		BinInt.ZERO.setFromInt(0);
		BinInt.ONE = new BinInt(32);
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
		BinInt.TEMP_POWER_C = new BinInt();
		//
		BinInt.TEMP_A = new BinInt();
		BinInt.TEMP_B = new BinInt();
		BinInt.TEMP_C = new BinInt();
		BinInt.TEMP_GCD_A = new BinInt();
		BinInt.TEMP_GCD_B = new BinInt();
		BinInt.TEMP_GCD_C = new BinInt();
		BinInt.TEMP_GCD_D = new BinInt();
		//
		BinInt.TEMP_REM_SOR = new BinInt();
		BinInt.TEMP_REM_END = new BinInt();
		BinInt.TEMP_REM_DIV = new BinInt();
		BinInt.TEMP_REM_QUO = new BinInt();
		BinInt.TEMP_REM_TEMP = new BinInt();
		//
		BinInt.TEMP_DH = new BinInt(32,false);
		BinInt.TEMP_PRIME_A = new BinInt(32,false);
		BinInt.TEMP_PRIME_B = new BinInt(32,false);
		BinInt.TEMP_PRIME_C = new BinInt(32,false);
		BinInt.TEMP_PRIME_D = new BinInt(32,false);
		BinInt.TEMP_PRIME_E = new BinInt(32,false);
	}
};


BinInt.init();







if(Code.isNode()){
	module.exports = BinInt;
}
