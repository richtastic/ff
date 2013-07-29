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
	var index, mask, i, j, len2=BinFast.FULL, len = Math.min(this._data.length, Math.ceil(str.length/BinFast.HALF));
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
	var index, mask, i, j, len2=BinFast.FULL, len = Math.min(this._data.length, 32/BinFast.HALF );
	this.zero();
	var numMask = 0x00000001;
	for(i=0;i<len;++i){
		mask = 1;
		for(j=0;j<len2;++j){
			if( (numMask & num) > 0 ){
				this._data[i] |= mask;
			}
			mask <<= 1;
			numMask <<= 1;
			--index;
		}
	}
}
// ------------------------------------------------------------------------------------------ BIT 
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
BinFast.neg = function(c, a){ // c = -a
	BinFast.not(c,a);
	var temp = BinFast.TEMPONE; temp.copy(c); temp.zero(); temp._data[0] = 1;
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
BinFast.sub = function(c, a,b){ // c = a - b
	var temp = BinFast.TEMPE;
	temp.copy(b); BinFast.neg(temp,temp);
	return BinFast.add( c, a, temp);
}

BinFast.TEMP = new Array();
while(BinFast.TEMP.length<(16384/16)){ // 2^14
	BinFast.TEMP.push(0);
}
BinFast.TEMPONE = new BinFast();
BinFast.TEMPA = new BinFast();
BinFast.TEMPB = new BinFast();
BinFast.TEMPC = new BinFast();
BinFast.TEMPD = new BinFast();
BinFast.TEMPE = new BinFast();


BinFast.mul = function(c, a,b){ // c = a * b
	var i, j, jpi, len = c._data.length;
	var loA, loB, carry, overflow = false;
	var temp = BinFast.TEMP; //c.zero();
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
BinFast.TEMPREM = new BinFast();
BinFast.TEMPSOR = new BinFast();
BinFast.TEMPEND = new BinFast();
BinFast.TEMPQUO = new BinFast();
BinFast.TEMPDIV = new BinFast();

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
BinFast.TEMPPOWXXX = new BinFast();

BinFast.pow = function(c, a,b, mo_in){ // c = a^b % n
var mask, reg = c.length(), cnt = BinFast.FULL;
var i, j, len = reg*cnt;
	var tempZero = BinFast.TEMPPOWZ; tempZero.length(len); tempZero.zero();
	if( BinFast.eq(a,tempZero) ){
		console.log("POW-0");
		c.zero();
		return;
	}else if( BinFast.eq(b,tempZero) ){
		c.zero(); c._data[0] = 1;
		console.log("POW-1");
		return;
	}
var mo = null; if(mo_in){ mo = BinFast.TEMPPOWM; mo.copy(mo_in); mo.length(len*2); }
	var tempC = BinFast.TEMPPOWC; tempC.length(len*2); tempC._data[0] = 1;
var tempXXX = BinFast.TEMPPOWXXX; tempXXX.length(len*2);
	var n = BinFast.TEMPPOWN; n.copy(a); n.length(len*2);
	for(i=0;i<reg;++i){
		bVal = b._data[i];
		mask = 0x00000001;
		for(j=0;j<cnt;++j){
			if( (bVal & mask) > 0 ){
				//console.log( (i*cnt+j) + ": " + tempC.toString());
				BinFast.mul(tempC,tempC,n);
				if(mo){
					console.log( tempC.toString() + " + " + mo.toString() );
					//BinFast.mod(tempC,tempC,mo);
					BinFast.mod(tempXXX,tempC,mo);
					tempC.copy(tempXXX);
					console.log( " >> " + tempC.toString());
				}
			}
			BinFast.mul(n,n,n);
			if(mo){
				//BinFast.mod(n,n,mo);
				BinFast.mod(tempXXX,n,mo);
				n.copy(tempXXX);
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
//console.log("k: "+i);
	var m = BinFast.TEMPPRIB; m.length(len); BinFast.right(m, nm1, i);
	var a = BinFast.TEMPPRID; a.length(len); a.zero();
	while( BinFast.eq(a,tempZero) ){ // le 2
//		a.randomize();
a.setFromInt(1041247843);
		BinFast.mod(a,a,nm1); // a should be in [2?,n-2]
	}
a.length(len*2); m.length(len*2); n.length(len*2); tempOne.length(len*2); nm1.length(len*2);

	var b = BinFast.TEMPPRIE; b.length(len*2); BinFast.pow(b,a,m,n);
	console.log("B1: "+b.toString());
	console.log("A1: "+a.toString());
	console.log("M1: "+m.toString());
	console.log("N1: "+n.toString());
	if( BinFast.eq(b,tempOne) ){
		console.log("ret1");
		return true;
	}
	//console.log("E");
	for(; i>=0; --i){
		if( BinFast.eq(b,tempOne) ){
			console.log("ret2");
			return false;
		}else if( BinFast.eq(b,nm1) ){
			console.log("ret3");
			return true;
		}
		BinFast.mul(b,b,b);
		BinFast.mod(b,b,n);
	}
	console.log("ret4");
	return false;
}
// ------------------------------------------------------------------------------------------
BinFast.prototype.toString = function toString(str){
	var i, j, d, len = this._data.length, len2=BinFast.FULL;
	var lm1 = len*len2, index = 0;
	var str = "";
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
	/*console.log(len,len2);
	for(i=0;i<len;++i){
		console.log(this._data[i]);
	}*/
	str = "["+(len*len2)+"]" + str;
	return str;
}
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------


//Code.inheritClass(BinInt, ByteData);
// DIVISON BY MULTIPLICATION
// BinFast.rem = function(r,c, a,b){ // c = a/b, r = a%b 	:	DIVISOR | DIVIDEND = QUOTIENT
// 	var i, j, len = c.length(), len2 = BinFast.FULL;
// 	var mask, was, reg = len*len2;
// 	var ans = BinFast.TEMPA; ans.length( reg ); ans.ones();
// 	var pro = BinFast.TEMPB; pro.length( reg );
// 	for(i=len-1; i>=0; --i){
// 		for(j=len2-1; j>=0; --j){
// 			BinFast.mul(pro, ans,b);
// 			if( BinFast.gt(pro,a) ){
// 				was = ans._data[i];
// 				mask = ~(0x00000001 << j);
// 				ans._data[i] = was & mask;
// 				BinFast.mul(pro, ans,b);
// 				if( BinFast.lt(pro,a) ){
// 					ans._data[i] = was;
// 				}
// 			}
// 		}
// 	}
// 	BinFast.mul(pro, ans,b);
// //console.log("A: "+ans.toString());
// 	if( BinFast.gt(pro,a) ){
// 		//console.log("SUBTRACT 1 HERE");
// 		pro.zero(); pro._data[0] = 0;
// 		BinFast.sub(c,ans,pro);
// 		//console.log("B: "+c.toString());
// 	}else{
// 		c.copy(ans);
// 	}
// }


// BinFast.mul = function(c, a,b){ // c = a * b
// 	var i, j, len = c._data.length;
// 	var loA, hiA, loB, hiB, loC, hiC. allC, lolo, lohi, hilo, hihi, carry, temp;
// 	c.zero();
// 	for(i=0;i<len;++i){
// 		loA = a._data[i] & 0x0000FFFF;
// 		hiA = (a._data[i] >> 16) & 0x0000FFFF;
// 		//loB = b._data[i] & 0x0000FFFF;
// 		//hiB = (b._data[i] >> 16) & 0x0000FFFF;
// 		console.log( BinInt.intToBinaryString(a._data[i]) );
// 		console.log( BinInt.intToBinaryString(hiA,16) + "" + BinInt.intToBinaryString(loA,16) );
// 		loC = loA + loB + carry;
// 		carry = (loC >> 16) & 0x0000FFFF;
// 		hiC = hiA + hiB + carry;
// 		carry = (hiC >> 16) & 0x0000FFFF;
// 		c._data[i] = ( hiC << 16 ) | loC;
// 		/*
// 		lolo = loA * loB;
// 		lohi = loA * hiB;
// 		hilo = hiA * loB;
// 		hihi = hiA * hiB;
// 		allC = lolo + carry
// 		//console.log( BinInt.intToBinaryString(hiC,16) + "" + BinInt.intToBinaryString(loC,16) );
// 		c._data[i] = allC;//( hiC << 16 ) | loC;
// 		*/
// 		carry = 0;
// 		for(j=0;j<len;++j){
// 			loB = b._data[j] & 0x0000FFFF;
// 			hiB = (b._data[j] >> 16) & 0x0000FFFF;
// 			//
// 			loC = loA*loB;
// 			hiC = loA*hiB + hiA*lowB + (loC >> 16)&0x0000FFFF;
// 			carry = hiA*hiB + (hiC >> 16)&0x0000FFFF;
// 		}
// 	}
// }
// BinFast.add = function(c, a,b){ // c = a + b
// 	var i, len = c._data.length;
// 	var loA, hiA, loB, hiB, loC, hiC, carry = 0;
// 	console.log(len)
// 	for(i=0;i<len;++i){
// 		loA = a._data[i] & 0x0000FFFF;
// 		hiA = (a._data[i] >> 16) & 0x0000FFFF;
// 		loB = b._data[i] & 0x0000FFFF;
// 		hiB = (b._data[i] >> 16) & 0x0000FFFF;
// 		console.log( BinInt.intToBinaryString(a._data[i]) );
// 		console.log( BinInt.intToBinaryString(hiA,16) + "" + BinInt.intToBinaryString(loA,16) );
// 		loC = loA + loB + carry;
// 		carry = (loC >> 16) & 0x0000FFFF;
// 		hiC = hiA + hiB + carry;
// 		carry = (hiC >> 16) & 0x0000FFFF;
// 		c._data[i] = ( hiC << 16 ) | loC;
// 	}
// }