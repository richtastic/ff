// BinFast.js
BinFast.FULL = 16;
BinFast.HALF = 16;

// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
function BinFast(sizeInBits, signed){
	this._data = new Array();
	this._signed = (signed===true||signed===false)?signed:false;
	this.length(sizeInBits?sizeInBits:32);
	this.zero();
}
// ------------------------------------------------------------------------------------------
BinFast.prototype.copy = function(c){
	var i, len = c._data.length;
	for(i=0;i<len;++i){
		this._data[i] = c._data[i];
	}
	while(this._data.length > c._data.length){
		this._data.pop();
	}
	this._signed = c._signed;
}
BinFast.prototype.copyReg = function(c){
	var i, len = Math.min(this._data.length,c._data.length);
	for(i=0;i<len;++i){
		this._data[i] = c._data[i];
	}
	len = this._data.length;
	for(i;i<len;++i){
		this._data[i] = 0; // SIGN?
	}
}
BinFast.prototype.copyLength = function(c){
	this.length(c.bitCount());
}
BinFast.prototype.zero = function(l){
	var i, len = this._data.length;
	for(i=0;i<len;++i){
		this._data[i] = 0;
	}
}
BinFast.prototype.ones = function(l){
	var i, len = this._data.length;
	for(i=0;i<len;++i){
		this._data[i] = 0x0000FFFF;
	}
}
BinFast.prototype.signed = function(s){
	if(arguments.length>0){
		//
	}
	return this._signed;
}
BinFast.prototype.length = function(l){
	if(arguments.length>0){
		var count = Math.ceil(l/BinFast.FULL);
		while(this._data.length<count){
			this._data.push(0);
		}
		while(this._data.length>count){
			this._data.pop();
		}
	}
	return this._data.length;
}
BinFast.prototype.bitCount = function(){
	return BinFast.FULL*this.length();
}
BinFast.prototype.isNegative = function(){
	return false;
}
BinFast.prototype.randomize = function(){
	var i, j, len = this._data.length, len2=BinFast.FULL, num;
	for(i=0;i<len;++i){
		mask = 1;
		num = 0;
		for(j=0;j<len2;++j){
			if( Math.floor(Math.random()*10)%2==0){
				num |= mask;
			}
			mask <<= 1;
		}
		this._data[i] = num;
	}
}
// ------------------------------------------------------------------------------------------
BinFast.prototype.setFromString = function setFromString(str){
	var index, mask, i, j, len2=BinFast.FULL, len = Math.min(this._data.length, Math.ceil(str.length/BinFast.FULL));
	this.zero();
	index = str.length-1;
	for(i=0;i<len;++i){
		mask = 1;
		for(j=0;j<len2;++j){
			if( str.charAt(index)=="1" ){
				this._data[i] |= mask;
			}
			mask <<= 1;
			--index;
		}
	}
}
BinFast.prototype.setFromInt = function setFromInt(num){
	var index, mask, i, j, len2=BinFast.FULL, len = Math.min(this._data.length, 32/BinFast.FULL );
	this.zero();
	var numMask = 0x00000001;
	for(i=0;i<len;++i){
		mask = 1;
		for(j=0;j<len2;++j){
			if( (numMask & num) != 0 ){
				this._data[i] |= mask;
			}
			mask <<= 1;
			numMask <<= 1;
			--index;
		}
	}
}
// ------------------------------------------------------------------------------------------ MASKING
BinFast.prototype.maskLow = function(){
	var i, len = this.length(), reg = BinFast.FULL;
	var halfLen = Math.floor(len/2);
	for(i=0; i<halfLen; ++i){
		this._data[i] = 0;
	}
	if(len%2==1){
		this._data[i] &= 0x0000FF00;
	}
}
BinFast.prototype.maskHigh = function(){
	var i, len = this.length(), reg = BinFast.FULL;
	var halfLen = len - Math.floor(len/2);
	for(i=len-1; i>=halfLen; --i){
		this._data[i] = 0;
	}
	if(len%2==1){
		this._data[i] &= 0x000000FF;
	}
}
// ------------------------------------------------------------------------------------------ BIT 
BinFast.prototype.odd = function setFromInt(){
	this._data[0] |= 0x00000001;
}
BinFast.and = function(c, a,b){ // c = a & b
	var i, len = a.length();
	for(i=0; i<len; ++i){
		c._data[i] = (a._data[i] & b._data[i]) & 0x0000FFFF;
	}
}
BinFast.or = function(c, a,b){ // c = a | b
	var i, len = a.length();
	for(i=0; i<len; ++i){
		c._data[i] = (a._data[i] | b._data[i]) & 0x0000FFFF;
	}
}
BinFast.xor = function(c, a,b){ // c = a ^ b
	var i, len = a.length();
	for(i=0; i<len; ++i){
		c._data[i] = (a._data[i] ^ b._data[i]) & 0x0000FFFF;
	}
}
BinFast.not = function(c, a){ // c = !a
	var i, len = a.length();
	for(i=0; i<len; ++i){
		c._data[i] = (~a._data[i]) & 0x0000FFFF;
	}
}
BinFast.left = function(c, a,b, circular){ // c = a << b
	var i, len = a.length(), temp = BinFast.TEMP;
	var index0, index1, major = Math.floor( b/BinFast.FULL );
	var lo, hi, minor = b - major*BinFast.FULL;
	var maxor = BinFast.FULL - minor, lm1 = len-1;
	for(i=0; i<len; ++i){ temp[i] = 0; }
	for(i=0; i<len; ++i){
		index0 = (lm1+i-major)%len;
		index1 = (len+i-major)%len;
		hi = (a._data[index0] >> maxor) & 0x0000FFFF;
		lo = (a._data[index1] << minor) & 0x0000FFFF;
		temp[i] = hi | lo;
	}
	if(!circular){ // assuming unsigned
		for(i=0; i<major; ++i){
			temp[i] = 0;
		}
		temp[i] &= (0x0000FFFF<<minor);
	}
	for(i=0; i<len; ++i){ c._data[i] = temp[i]; }
}
BinFast.leftCircular = function(c, a,b){
	return BinFast.left(c, a,b, true);
}
BinFast.right = function(c, a,b, circular){ // c = a >> b
	var i, len = a.length(), temp = BinFast.TEMP;
	var index0, index1, major = Math.floor( b/BinFast.FULL );
	var lo, hi, minor = b - major*BinFast.FULL;
	var maxor = BinFast.FULL - minor;
	for(i=0; i<len; ++i){ temp[i] = 0; }
	for(i=0; i<len; ++i){
		index0 = (i+major)%len;
		index1 = (i+major+1)%len;
		hi = a._data[index0] >> minor;
		lo = (a._data[index1] & (0x0000FFFF>>maxor)) << maxor;
		temp[i] = hi | lo;
	}
	if(!circular){ // assuming unsigned
		lo = len-major;
		for(i=len-1; i>=lo; --i){
			temp[i] = 0;
		}
		//console.log(b+" ? "+i+"/"+len+"-"+major+" = "+lo);
		temp[i] &= (0x0000FFFF>>minor);
	}
	for(i=0; i<len; ++i){ c._data[i] = temp[i]; }
}
BinFast.rightCircular = function(c, a,b){
	return BinFast.right(c, a,b, true);
}
// ------------------------------------------------------------------------------------------ COMPARE
BinFast.eq = function(a,b){ // a = b
	var i, len = a.length();
	for(i=len-1;i>=0;--i){
		if(a._data[i]!=b._data[i]){
			return false;
		}
	}
	return true;
}
BinFast.ne = function(a,b){ // a != b
	return !BinFast.eq(a,b);
}
BinFast.gt = function(a,b){ // a > b
	var i, len = a.length();
	for(i=len-1;i>=0;--i){
		if(a._data[i]>b._data[i]){
			return true;
		}else if(a._data[i]<b._data[i]){
			return false;
		}
	}
	return false; // equal
}
BinFast.ge = function(a,b){ // a >= b
	var i, len = a.length();
	for(i=len-1;i>=0;--i){
		if(a._data[i]>b._data[i]){
			return true;
		}else if(a._data[i]<b._data[i]){
			return false;
		}
	}
	return true; // equal
}
BinFast.lt = function(a,b){ // a < b
	var i, len = a.length();
	for(i=len-1;i>=0;--i){
		if(a._data[i]<b._data[i]){
			return true;
		}else if(a._data[i]>b._data[i]){
			return false;
		}
	}
	return false; // equal
}
BinFast.le = function(a,b){ // a <= b
	var i, len = a.length();
	for(i=len-1;i>=0;--i){
		if(a._data[i]<b._data[i]){
			return true;
		}else if(a._data[i]>b._data[i]){
			return false;
		}
	}
	return true; // equal
}
// BinFast. = function(c, a,b){ // c = a  b }
// ------------------------------------------------------------------------------------------ MATH
BinFast.abs = function(c, a){ // c = |a|
	c.copy(a);
	// if( BinInt.isNegative(a) ){
	// 	BinInt.neg(c,a);
	// }else{
	// 	BinInt.copyReg(c,a);
	// }
}
BinFast.TEMPNEG = new BinFast();
BinFast.neg = function(c, a){ // c = -a
	BinFast.not(c,a);
	var temp = BinFast.TEMPNEG; temp.copy(c); temp.zero(); temp._data[0] = 1;
	BinFast.add(c,temp,c);
}
BinFast.add = function(c, a,b){ // c = a + b
	var i, len = c._data.length;
	var loA, hiA, loB, hiB, loC, hiC, carry = 0;
	for(i=0;i<len;++i){
		loA = a._data[i] & 0x0000FFFF;
		loB = b._data[i] & 0x0000FFFF;
		loC = loA + loB + carry;
		carry = (loC >> 16) & 0x0000FFFF;
		c._data[i] = loC & 0x0000FFFF;
	}
}
BinFast.TEMPSUB = new BinFast();
BinFast.sub = function(c, a,b){ // c = a - b
	var temp = BinFast.TEMPSUB;
	temp.copy(b); BinFast.neg(temp,temp);
	return BinFast.add( c, a, temp);
}

BinFast.TEMP = new Array();
while(BinFast.TEMP.length<(16384/16)){ // 2^14/2^4 = 2^10 = 1024 32-bit ints
	BinFast.TEMP.push(0);
}

BinFast.mul = function(c, a,b){ // c = a * b
	var i, j, jpi, len = c._data.length, loA, loB, carry, overflow = false, temp = BinFast.TEMP;
	for(i=0;i<len;++i){
		temp[i] = 0;
	}
	for(i=0;i<len;++i){
		loA = a._data[i];
		carry = 0;
		for(j=0;j<len;++j){
			jpi = j+i;
			if(jpi>=len){ continue; } // overflow
			loB = b._data[j];
			temp[jpi] += loA*loB  + carry;
			carry = (temp[jpi]>>16) & 0x0000FFFF;
			temp[jpi] &= 0x0000FFFF;
		}
	}
	for(i=0;i<len;++i){
		c._data[i] = temp[i];
	}
}

BinFast.TEMPREM = new BinFast();
BinFast.TEMPSOR = new BinFast();
BinFast.TEMPEND = new BinFast();
BinFast.TEMPQUO = new BinFast();
BinFast.TEMPDIV = new BinFast();

BinFast.rem = function(r,c, a,b){ // c = a/b, r = a%b 	:	DIVISOR | DIVIDEND = QUOTIENT
	var sor = BinFast.TEMPSOR, end = BinFast.TEMPEND, quo = BinFast.TEMPQUO, div = BinFast.TEMPDIV;
	var skipped, i, len = Math.max((c!=null)?c.length():0, a.length(), b.length()), len2 = BinFast.FULL;
	var reg = len*len2;
	var tempOne = BinFast.TEMPREM; tempOne.length(reg); tempOne.zero(); tempOne._data[0] = 1;
	sor.length(reg); BinFast.abs(sor,b);
	end.length(reg); BinFast.abs(end,a);
	quo.length(reg); quo.zero();
	div.length(reg);
	for(i=0;i<=reg;++i){
		//console.log("............"+quo.toString());
		BinFast.left(quo, quo, 1);
		BinFast.right(div, end, reg-i);
		if( BinFast.ge(div,sor) ){ // div is now a temp var
			BinFast.left(div, sor, reg-i);
			BinFast.sub(end, end, div);
			BinFast.add(quo, quo, tempOne);
		}
	}
	if(c){ c.copy(quo); }
	if(r){ r.copy(end); }
}

BinFast.div = function(c, a,b){ // c = a / b
	return BinFast.rem(null,c,a,b);
}
BinFast.mod = function(c, a,b){ // c = a % b
	return BinFast.rem(c,null,a,b);
}

BinFast.TEMPPOWC = new BinFast();
BinFast.TEMPPOWN = new BinFast();
BinFast.TEMPPOWZ = new BinFast();
BinFast.TEMPPOWM = new BinFast();
//BinFast.TEMPPOWXXX = new BinFast();

BinFast.pow = function(c, a,b, mo_in){ // c = a^b % n
	var mask, reg = c.length(), cnt = BinFast.FULL;
	var i, j, len = reg*cnt;
	var tempZero = BinFast.TEMPPOWZ; tempZero.length(len); tempZero.zero();
	if( BinFast.eq(a,tempZero) ){
		c.zero();
		return;
	}else if( BinFast.eq(b,tempZero) ){
		c.zero(); c._data[0] = 1;
		return;
	}
	var mo = null; if(mo_in){ mo = BinFast.TEMPPOWM; mo.copy(mo_in); mo.length(len*2); }
	var tempC = BinFast.TEMPPOWC; tempC.length(len*2); tempC.zero(); tempC._data[0] = 1;
	var n = BinFast.TEMPPOWN; n.copy(a); n.length(len*2);
	for(i=0;i<reg;++i){
		bVal = b._data[i];
		mask = 0x00000001;
		for(j=0;j<cnt;++j){
			if( (bVal & mask) > 0 ){
				BinFast.mul(tempC,tempC,n);
				if(mo){
					BinFast.mod(tempC,tempC,mo);
				}
			}
			BinFast.mul(n,n,n);
			if(mo){
				BinFast.mod(n,n,mo);
			}
		mask <<= 1;
		}
	}
	c.copy(tempC); c.length(len);//c.copyReg(tempC);
}

// ------------------------------------------------------------------------------------------ CRYPTOGRAPHICS
BinFast.TEMPPRIO = new BinFast();
BinFast.TEMPPRIZ = new BinFast();
BinFast.TEMPPRIA = new BinFast();
BinFast.TEMPPRIB = new BinFast();
BinFast.TEMPPRID = new BinFast();
BinFast.TEMPPRIE = new BinFast();
BinFast.TEMPPRIN = new BinFast();
BinFast.millerRabinPrime = function(in_n){ // c probably isn't a composite - 1/4
var n = BinFast.TEMPPRIN; n.copy(in_n);
	var reg = n.length(), cnt = BinFast.FULL;
	var val, index, i, j, len = reg*cnt;
	var tempOne = BinFast.TEMPPRIO; tempOne.length(len); tempOne.zero(); tempOne._data[0] = 1;
	var tempZero = BinFast.TEMPPRIZ; tempZero.length(len); tempZero.zero();
	var nm1 = BinFast.TEMPPRIA; nm1.length(len); BinFast.sub(nm1,n,tempOne);
	index=0;
	var cont = true;
	for(i=0;(i<reg)&&cont;++i){
		val = nm1._data[i];
		mask = 0x00000001;
		for(j=0;j<cnt;++j){
			if( (val & mask) > 0 ){
				cont = false;
				break;
			}
			mask <<= 1;
			++index;
		}
	}
	i = index;
	var m = BinFast.TEMPPRIB; m.length(len); BinFast.right(m, nm1, i);
	var a = BinFast.TEMPPRID; a.length(len); a.zero();
	while( BinFast.eq(a,tempZero) ){ // le 2
		a.randomize(); // //a.setFromInt(1041247843);
		BinFast.mod(a,a,nm1); // a should be in [2?,n-2]
	}
	a.length(len*2); m.length(len*2); n.length(len*2); tempOne.length(len*2); nm1.length(len*2);
	var b = BinFast.TEMPPRIE; b.length(len*2); BinFast.pow(b,a,m,n);
	if( BinFast.eq(b,tempOne) ){
		return true;
	}
	for(; i>=0; --i){
		if( BinFast.eq(b,tempOne) ){
			return false;
		}else if( BinFast.eq(b,nm1) ){
			return true;
		}
		BinFast.mul(b,b,b);
		BinFast.mod(b,b,n);
	}
	return false;
}
BinFast.randomPrime = function(p, max, num){ // p = random prime number, max = maximum number of tests
	var i, j, maxTests = (max!=null && max!=undefined)?max:255, numTests = (num!=null && num!=undefined)?num:Math.round( Math.log(p.bitCount()));
	var done;
	for(i=0; i<maxTests; ++i){
		p.randomize(); p.odd();
		done = true;
		for(j=0; j<numTests; ++j){
			if( !BinFast.millerRabinPrime(p) ){
				done = false;
				break;
			}
		}
		if(done){
			log("NUMBER OF TESTS: "+i);
			return true;
		}
	}
	return false;
}
BinFast.diffieHellmanPublic = function(p,g){ // out: p = random prime number, g = random base
	/*if(cheat){
		var len = p.bitCount()/2;
		var prime1 = new BinFast(len); prime2 = new BinFast(len);
		BinFast.randomPrime(prime1); BinFast.randomPrime(prime2);
		g.setFromString( prime1.toStringSimple() );
		p.setFromString( prime2.toStringSimple() );
		BinFast.mul(p,p,g);
		g.randomize(); g.odd();
	}else{*/
		p.signed(false); g.signed(false);
		console.log("P...");
		BinFast.randomPrime(p);
		console.log("G...");
		g.randomize(); g.odd();//BinFast.randomPrime(g);
	//}
}
BinFast.diffieHellmanPrivate = function(pri,pub, p,g){ // in: p,g | out: pri = private key, pub = public key
	pri.signed(false); pub.signed(false);
	pri.randomize();
	BinFast.pow(pub, g,pri, p);
}
BinFast.diffieHellmanSecret = function(s, pri,pub, p){ // in: pri,pub, p, out: secret
	BinFast.pow(s, pub,pri, p);
}
//http://en.wikipedia.org/wiki/RSA_(algorithm)
// n is twice as big as the primes p and q
BinFast.RSA = function(pubN,pubE, priD){ // p,q,phi also secret
	// p = BinFast.randomPrime(p);
	// q = BinFast.randomPrime(q);
	// n = p*q;
	// phi = (p-1)*(q-1)
	// max = phi.maximumUsedBits
	// while( e%phi > 0 ){ // gcd(e,phi)>1
	// e.random();
	// mask out highest e bits
	// }
	// d = ExtendedEuclideanAlgorithm(e,phi,n  ) // chinese remainder?
	// pubN.copy(n);
	// pubE.copy(e);
	// priD.copy(d);
}
BinFast.RSAencrypt = function(cyphertext, message, n,e){ // 0 <=m < n
	// cyphertext = (m^e) % n
	// 
	// 
	// 
}
BinFast.RSAdecrypt = function(message, cyphertext, n,e){
	// message = (c^d) % n
	// 
	// 
	// 
}
// ------------------------------------------------------------------------------------------
BinFast.prototype.getIntValue = function getIntValue(){
	var val, mask, j, i, len = Math.min( this.length(), 32/BinFast.FULL ), reg=BinFast.FULL, count=0, num = 0;
	for(i=0;i<len;++i){
		val = this._data[i];
		mask = 0x00000001;
		for(j=0;j<reg;++j){
			if( (mask&val) != 0 ){
				num = num | (1<<count);
			}
			mask <<= 1;
			++count;
		}
	}
	// if signed and less than 32 bits - pend with 1s
	return num;
}
BinFast.prototype.toString = function toString(str){
	var i, j, d, len = this._data.length, len2=BinFast.FULL;
	var lm1 = len*len2, index = 0, str = "";
	for(i=0;i<len;++i){
		mask = 1;
		d = this._data[i];
		for(j=0;j<len2;++j){
			if( d & mask ){
				str = "1" + str;
			}else{
				str = "0" + str;
			}
			mask <<= 1;
			++index;
			if(index%8==0 && index!=lm1){
				str = "|"+str;
			}
		}
	}
	str = "["+(len*len2)+"]" + str;
	return str;
}
BinFast.prototype.toStringSimple = function toString(str){
	var i, j, d, len = this._data.length, len2=BinFast.FULL;
	var lm1 = len*len2, index = 0, str = "";
	for(i=0;i<len;++i){
		mask = 1;
		d = this._data[i];
		for(j=0;j<len2;++j){
			if( d & mask ){
				str = "1" + str;
			}else{
				str = "0" + str;
			}
			mask <<= 1;
		}
	}
	return str;
}
BinFast.TEMPTS10TEN = new BinFast();
BinFast.TEMPTS10NUM = new BinFast();
BinFast.TEMPTS10REM = new BinFast();
BinFast.TEMPTS10TEMP = new BinFast();
BinFast.TEMPTS10ZERO = new BinFast();
BinFast.prototype.toString10 = function toString10(){
	var gt, val, str="", isNeg = false; ten = BinFast.TEMPTS10TEN, num = BinFast.TEMPTS10NUM, rem = BinFast.TEMPTS10REM, temp = BinFast.TEMPTS10TEMP, zero = BinFast.TEMPTS10ZERO;
	ten.copyLength(this); num.copyLength(this); rem.copyLength(this); temp.copyLength(this); zero.copyLength(this);
	ten.setFromInt(10); zero.setFromInt(0);
	num.copy(this);
	if(num.isNegative()){
		isNeg = true;
		BinFast.neg(num,num);
	}
	gt = BinFast.gt(num,zero);
	while( gt ){
		BinFast.rem(rem,num,num,ten);
		val = rem.getIntValue();
		str = val+str;
		gt = BinFast.gt(num,zero);
	}
	if(str == ""){
		str = "0";
	}else if(isNeg){
		str = "-" + str;
	}
	return str;
}
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------


