// ByteData
ByteData.BITS_PER_INT = 32;
ByteData.CRC_32_A = 0x04C11DB7;
ByteData.CRC_32_B = 0xEDB88320;
ByteData.CRC_32_C = 0x82608EDB;
ByteData.MAX_SUB_INDEX = ByteData.BITS_PER_INT - 1;
ByteData.STRING_64_ARRAY = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','+','/'];
/*
|<--------------- length ----------------------->V (bits)
|<--- position --->V (bits)
|00..00|00..00|00..00|00..00|00..00|00..00|00..00|
              |<---^ subIndex (bits-of-chunk)
|<-----|------| index|------|----->| (chunks)
*/

function ByteData(){
	this._data = new Array();
	this._position = 0; // current index in bits
	this._length = 0; // total individual bits
	// helpers
	this._index = 0; // data array index (chunks)
	this._subIndex = 0; // bit index on chunk-level
	this._ander = 0; // subIndex-masking
}
ByteData.prototype.copy = function(b){ // this = b
	var i, len = this._data.length, lenB = b._data.length;
	for(i=0;i<lenB;++i){ // match all of b's elements
		this._data[i] = b._data[i];
	}
	for(;i<len;++i){ // remove unused end
		this._data.pop();
	}
	this._length = b._length;
	this._position = b._position;
}
ByteData.prototype._setup_position = function(p){ // set reading params based on p (bits)
	this._index = Math.floor(p / ByteData.BITS_PER_INT);
	this._subIndex = ByteData.MAX_SUB_INDEX - (p % ByteData.BITS_PER_INT);
	this._ander = 1 << this._subIndex;
}
ByteData.prototype.clear = function(){
	this._length = 0;
	this._position = 0;
	Code.emptyArray(this._data);
}
ByteData.prototype.position = function(p){ // position in bits
	if(p!==undefined){
		this._position = Math.max(0,p);
		var len = Math.floor(this._postition/ByteData.BITS_PER_INT);
		while(this._data.length<len){ // extend to fit if position is past length
			this._data.push(0);
		}
	}
	return this._position;
}
ByteData.prototype.length = function(l){ // total bits
	if(l!==undefined){
		this._length = Math.max(0,l);
		var len = Math.floor(this._length/ByteData.BITS_PER_INT) + 1;
		while(this._data.length<len){ // extend to fit if new length is past old length
			this._data.push(0);
		}
		while(this._data.length>len){ // retract to fit if new length is less than old length
			this._data.pop();
		}
		this._position = Math.min(this._position,this._data.length-1); // position <= length
	}
	return this._length;
}
ByteData.prototype.read = function(){ // start read at _position
	if(this._position >=this._length){ return 0; } // -1?
	this._setup_position(this._position);
	++this._position; // goto next position for next read
	return (this._data[this._index] & this._ander)!=0?1:0;
}
ByteData.prototype.write = function(d){ // write at position
	this._setup_position(this._position);
	if(this._index >= this._data.length){ this._data.push(0); } // append chunk to data
	if(d==0){
		this._data[this._index] = (this._data[this._index] & ~this._ander);
	}else{
		this._data[this._index] = (this._data[this._index] | this._ander);
	}
	++this._position; // goto next position for next write
	if(this._position>this._length){ // position <= length
		this._length = this._position;
	}
	return d;
}
// -------------------------------------------------------------------------------------------------------------- ByteData
ByteData.prototype.readByteData = function(ba, len, rev){
	ba = ba!==undefined?ba:new ByteArray();
	if(ba==this){ return null; }
	ba.length(len);
	ba.position(0);
	if(rev){
		for(i=0;i<len;++i){
			ba._position = ba._length - i - 1;
			ba.write( this.read() );
		}
	}else{
		ba._position = 0;
		for(i=0;i<len;++i){
			ba.write( this.read() );
		}
	}
	return ba;
}
ByteData.prototype.writeByteData = function(ba, rev){
	if(ba==this){ return; }
	var i, len = ba._length, was = ba._position;
	if(rev){
		for(i=0;i<len;++i){
			ba._position = ba._length - i - 1;
			this.write( ba.read() );
		}
	}else{
		ba._position = 0;
		for(i=0;i<len;++i){
			this.write( ba.read() );
		}
	}
	ba._position = was;
}
// -------------------------------------------------------------------------------------------------------------- binary string
ByteData.prototype.readBinaryString = function(len){
	var i, str = "";
	for(i=0;i<len;++i){
		str += this.read();
	}
	return str;
}
ByteData.prototype.writeBinaryString = function(str){
    var i, len = str.length;
    for(i=0;i<len;++i){
        if(str.charAt(i)!='0'){
        	this.write(1);
        }else{
        	this.write(0);
    	}
    }
}
// -------------------------------------------------------------------------------------------------------------- uint
ByteData.prototype.readUintN = function(len){
	var i, num = 0;
	for(i=len-1;i>=0;--i){
		if( this.read() ){
			num = (num | 1<<i)>>>0;
		}
	}
	return num;
}
ByteData.prototype.writeUintN = function(n,b){
    var i, ander = 1;
    ander <<= b-1;
    for(i=0;i<b;++i){
        (ander&n)==0?this.write(0):this.write(1);
        ander >>>= 1;
        //ander &= 0x7FFFFFFF;
    }
}
ByteData.prototype.readUint4 = function(){
	return this.readUintN(4);
}
ByteData.prototype.writeUint4 = function(n){
	this.writeUintN(n,4);
}
ByteData.prototype.readUint6 = function(){
	return this.readUintN(6);
}
ByteData.prototype.writeUint6 = function(n){
	this.writeUintN(n,6);
}
ByteData.prototype.readUint8 = function(){
	return this.readUintN(8);
}
ByteData.prototype.writeUint8 = function(n){
	this.writeUintN(n,8);
}
ByteData.prototype.readUint16 = function(){
	return this.readUintN(16);
}
ByteData.prototype.writeUint16 = function(n){
	this.writeUintN(n,16);
}
ByteData.prototype.readUint32 = function(){
	return this.readUintN(32);
}
ByteData.prototype.writeUint32 = function(n){
	this.writeUintN(n,32);
}
// -------------------------------------------------------------------------------------------------------------- toString
ByteData.prototype.toStringBin = function(){
	var str = "", i, len = this.length(), was = this.position();
	this.position(0);
	for(i=0;i<len;++i){
		if ( i%8==0 && i>0){
			str = str + "|"
		}
		str = str+this.read();
	}
	this.position(was);
	return str;
}
ByteData.prototype.toStringHex = function(){
	var str = "", i, len = Math.ceil( this.length()/4.0 ) , was = this.position();
	this.position(0);
	for(i=0;i<len;++i){
		if ( i%8==0 && i>0){
			str = str + "|"
		}
		str = str+this.readUint4().toString(16).toUpperCase();
	}
	this.position(was);
	return str;
}
ByteData.prototype.toString64 = function(){
	var arr = ByteData.STRING_64_ARRAY, was = this.position();
	var str = "", i, len = Math.ceil(this.length()/6.0);
	this.position(0);
	for(i=0;i<len;++i){
		str = str+ arr[ this.readUint6() ];
	}
	if(len%6==1){ str += "="; }
	else if(len%6==1){ str += "=="; }
	this.position(was);
	return str;
}
ByteData.prototype.toString = function(){
	return this.toStringBin();
}
// -------------------------------------------------------------------------------------------------------------- kill
ByteData.prototype.kill = function(){
	this.clear();
	this._position = undefined;
	this._length = undefined;
	this._index = undefined;
	this._subIndex = undefined;
	this._ander = undefined;
	this._data = null;
}
// -------------------------------------------------------------------------------------------------------------- error checking
ByteData.prototype._doCRC = function(divisor,sta,end){
	sta = sta!==undefined?sta:0;
	end = end!==undefined?end:this.length();
	var was = this.position();
	var bits = Math.ceil(Math.log(divisor)/Math.log(2));
	var leftMask = 0x0001<<bits-1;
	var acc = 0;
	// xor like a mother
	this.position(sta);
	for(i=sta;i<end;++i){ // while(this.position() < this.length()){
		acc = acc<<1 | this.read();
		if(acc&leftMask){
			acc = acc ^ divisor;
		}
	}
	// ending
	for(i=0;i<bits;++i){
		acc = acc<<1;
		if(acc&leftMask){
			acc = acc ^ divisor;
		}
	}
	this.position(was);
	return acc;
}
ByteData.prototype.appendCRC = function(divisor){
	divisor = divisor!==undefined?divisor:ByteData.CRC_32_A;
	var bits = Math.ceil(Math.log(divisor)/Math.log(2));
	var was = this.position();
	var acc = this._doCRC(divisor);
	// append CDC divisor, remainder, bits
	this.position(this.length());
	this.writeUintN(divisor,bits);
	this.writeUintN(acc,bits);
	this.writeUint8(bits);
	this.position(was);
}
ByteData.prototype.removeCRC = function(divisor){
	var len = this.length();
	var was = this.position();
	this.position(len-8);
	bits = this.readUint8();
	var crcPosition = len-8-bits*2;
	this.length(crcPosition);
	this.position(was);
}
ByteData.prototype.checkCRC = function(){
	var divisor, remainder, accumulator, bits, len = this.length(), was = this.position();
	this.position(len-8);
	bits = this.readUint8();
	var crcPosition = len-8-bits*2;
	this.position(crcPosition);
	divisor = this.readUintN(bits);
	remainder = this.readUintN(bits);
	accumulator = this._doCRC(divisor,0,crcPosition);
	this.position(was);
	return remainder==accumulator;
}
// -------------------------------------------------------------------------------------------------------------- compression - huffman
ByteData._howToSortHuffmanNodes = function(a,b){
	return a.data.count<b.data.count;
}
ByteData._recursiveDescentHuffman = function(node,table,bits,value){
	bits=bits!==undefined?bits:0;
	value=value!==undefined?value:0;
	if(node.children.length==0){
		node.data.bits = bits;
		node.data.value = value;
		table[node.data.index] = node.data;
		return;
	}
	ByteData._recursiveDescentHuffman(node.children[0],table,bits+1,(value<<1)|0);
	ByteData._recursiveDescentHuffman(node.children[1],table,bits+1,(value<<1)|1);
}
ByteData._recursiveWriteHuffman = function(node,ba,bits,tag){
	tag = tag!==undefined?tag:" ";
	if(node.children.length==2){ // pivot
		//console.log(tag+" (pivot)");
		ba.writeUint8(0);
		ByteData._recursiveWriteHuffman(node.children[0],ba,bits,tag+" ");
		ByteData._recursiveWriteHuffman(node.children[1],ba,bits,tag+" ");
	}else{ // end
		ba.writeUint8(node.data.bits);
		ba.writeUintN(node.data.value,node.data.bits);
		ba.writeUintN(node.data.index,bits);
		//console.log(tag+" "+node.data.value+"  "+node.data.bits+" ["+node.data.index+"]");
	}
}
ByteData._recursiveReadHuffman = function(node,ba,bits,tag){
	tag = tag!==undefined?tag:" ";
	var b = ba.readUint8();
	if(b==0){ // pivot
		//console.log(tag+" (pivot)");
		node.data = {};
		node.addChild(new Node()); node.addChild(new Node());
		ByteData._recursiveReadHuffman(node.children[0],ba,bits,tag+" ");
		ByteData._recursiveReadHuffman(node.children[1],ba,bits,tag+" ");
	}else{ // end
		var value = ba.readUintN(b);
		var index = ba.readUintN(bits);
		node.data = {bits:b, value:value, index:index};
		//console.log(tag+" "+node.data.value+"  "+node.data.bits+" ["+node.data.index+"]");
	}
}
ByteData._readHuffmanFromRoot = function(node,ba,bits){
	if(node.children.length==0){
		return node.data.index;
	}else{
		var val = ba.read();
		return ByteData._readHuffmanFromRoot(node.children[val],ba,bits);
	}
}
ByteData.prototype.compressedHuffman = function(bits){
	bits = bits!==undefined?bits:4;
	var i, len, val, node, nodeA, nodeB, obj, len = Math.pow(2,bits), ba = new ByteData();
	var was = this.position();
	// generate frequency table
	var table = Code.newArrayZeros( len );
	this.position(0);
	while( this.position()<this.length() ){
		table[ this.readUintN(bits) ]++;
	}
	// node frequency table
	for(i=0;i<len;++i){
		table[i] = new Node({count:table[i], index:i},null);
	}
	// create frequency tree
	while(table.length>1){ // until single root
		table.sort(ByteData._howToSortHuffmanNodes);
		nodeA = table[table.length-1];
		nodeB = table[table.length-2];
		node = new Node({count:nodeA.data.count+nodeB.data.count, index:-1});
		node.addChild(nodeA); node.addChild(nodeB);
		table.pop(); table.pop();
		table.push(node);
	}
	node = table.pop();
	ByteData._recursiveDescentHuffman(node,table); // direct mapping
	// write huffman header
	ba.writeUint8(bits);
	ByteData._recursiveWriteHuffman(node,ba,bits);
	// read and compress
	this.position(0);
	while(this.position()<this.length()){
		val = table[ this.readUintN(bits) ];
		//console.log(val.value, val.bits);
		ba.writeUintN( val.value, val.bits );
	}
	return ba;
}
ByteData.prototype.decompressedHuffman = function(){
	var bits, val, node = new Node(), ba = new ByteData(), was = this.position();
	// read huffman header
	this.position(0);
	bits = this.readUint8(bits);
	ByteData._recursiveReadHuffman(node,this,bits);
	// read and decompress
	while(this.position()<this.length()){
		val = ByteData._readHuffmanFromRoot(node,this,bits);
		ba.writeUintN( val, bits);
	}
	this.position(was);
	return ba;
}
// -------------------------------------------------------------------------------------------------------------- compression - rice / golomb
ByteData.prototype.compressedRice = function(bits,encBits){ // only supports up to 32-bit (otherwise needs long-int math)
	bits = bits!==undefined?bits:4;
	encBits = encBits!==undefined?encBits:(bits*2);
	var i, j, ba = new ByteData(), was = this.position();
	var q, r, N, M = Math.pow(2,bits);
	this.position(0);
	ba.writeUint8(bits);
	ba.writeUint8(encBits);
	while(this.position()<this.length()){
		N = this.readUintN(encBits);
		q = Math.floor(N/M);
		r = N - q*M;
		for(j=0;j<q;++j){
			ba.write(1);
		}
		ba.write(0);
		ba.writeUintN(r,bits);
	}
	this.position(was);
	return ba;
}
ByteData.prototype.decompressedRice = function(){
	var bits, encBits, q, r, N, M;
	var ba = new ByteData();
	var was = this.position();
	this.position(0);
	bits = this.readUint8();
	encBits = this.readUint8(encBits);
	M = Math.pow(2,bits); // bits-1
	while(this.position()<this.length()){
		q = 0;
		while( this.read()==1 ){
			++q;
		}
		r = this.readUintN(bits);
		N = q*M+r;
		ba.writeUintN(N,encBits);
	}
	this.position(was);
	return ba;
}

// -------------------------------------------------------------------------------------------------------------- crypto
ByteData.SHA1 = function(message){
	var mCopy = new ByteData();//0, false);
	ByteData.copy(mCopy,message);
	var originalLen = mCopy.length();
	// STEP 1) EXTENDIFY - EXTEND MESSAGE TO: MESSAGE|1|0...0|LENGTH -----------------------------------------
	mCopy.position( originalLen );
	mCopy.write(1);
	console.log("MESSAGE:");
	console.log(mCopy.toString());
	// COPY TO TEMP MESSAGE
	var messageLen = mCopy.length();
	var remainder = 512 - (messageLen % 512);
	var len64 = new BinInt(64);
	len64.setFromInt(originalLen);
	if(remainder < 64){
		remainder += 512;
	}
	for(;remainder>64;--remainder){
		mCopy.write(0);
	}
	for(i=64-1;i>=0;--i){
		len64.position(i);
		mCopy.write( len64.read() );
	}
	var messageLen = mCopy.length();
	// INIT HASHING
	var H0 = new BinInt(32); H0.setFromInt( 0x67452301 );
	var H1 = new BinInt(32); H1.setFromInt( 0xEFCDAB89 );
	var H2 = new BinInt(32); H2.setFromInt( 0x98BADCFE );
	var H3 = new BinInt(32); H3.setFromInt( 0x10325476 );
	var H4 = new BinInt(32); H4.setFromInt( 0xC3D2E1F0 );
	var A = new BinInt(32), B = new BinInt(32), C = new BinInt(32), D = new BinInt(32), E = new BinInt(32);
	var F = new BinInt(32), K = new BinInt(32), X = new BinInt(32), Y = new BinInt(32), Z = new BinInt(32), TEMP, chunk;
	var chunk512 = new BinInt(512);
	// INIT CHUNKS
	var chunkList = new Array();
	for(i=0;i<16;++i){
		chunkList.push( new BinInt(32) );
	}
	var chunkCount = Math.ceil(messageLen/512);
	console.log("TOTAL LEN: "+messageLen);
	// LOOP
	for(i=0;i<chunkCount;++i){
		// STEP 2) CHUNKIFY - SPLIT 512-CHUNK INTO 16+64=80 32-BIT SUB-CHUNKS
		mCopy.position(i*512);
		for(j=0;j<16;++j){
			chunk = chunkList[j];
			for(k=0;k<32;++k){
				chunk._position = 31-k;
				chunk.write( mCopy.read() );
			}
		}
		// CONTINUE HASH
		BinInt.copy(A,H0); BinInt.copy(B,H1); BinInt.copy(C,H2); BinInt.copy(D,H3); BinInt.copy(E,H4);
		for(j=0;j<80;++j){
			chunk = chunkList[j%16];
			// STEP 3) DEFINE KEY AND FUNCTION:
			if(j<20){ // F = (B & C) | (!B & D)
				K.setFromInt(0x5A827999);
				BinInt.andFast(X,B,C);
				BinInt.notFast(Y,B);
				BinInt.andFast(Y,Y,D);
				BinInt.orFast(F,X,Y);
			}else if(j<40){ // F = B ^ C ^ D
				K.setFromInt(0x6ED9EBA1);
				BinInt.xorFast(X,B,C);
				BinInt.xorFast(F,X,D);
			}else if(j<60){ // F = (B & C) | (B & D) | (C & D)
				K.setFromInt(0x8F1BBCDC);
				BinInt.andFast(X,B,C);
				BinInt.andFast(Y,B,D);
				BinInt.andFast(Z,C,D);
				BinInt.orFast(Y,X,Y);
				BinInt.orFast(F,Y,Z);
			}else{ // F = B ^ C ^ D
				K.setFromInt(0xCA62C1D6);
				BinInt.xorFast(X,B,C);
				BinInt.xorFast(F,X,D);
			}
			// STEP 4) MIXIFY
			// NEXT A = LC(A,5) + F + K + E + chunk
			BinInt.leftCircular(X,A,5);
			BinInt.add(Y,F,K);
			BinInt.add(Z,E,chunk);
			BinInt.add(Y,X,Y);
			BinInt.add(Z,Y,Z);
			// E = D  |  D = C  |  C = LR(B,30)  |  B = A
			BinInt.copy(E,D);
			BinInt.copy(D,C);
			BinInt.leftCircular(C,B,30);
			BinInt.copy(B,A);
			BinInt.copy(A,Z);
			// update chunk list
			BinInt.xorFast(X,chunkList[(j+13)%16],chunkList[(j+8)%16]);
			BinInt.xorFast(Y,chunkList[(j+2)%16],chunkList[(j+0)%16]);
			BinInt.xorFast(Z,X,Y);
			BinInt.leftCircular(Z,Z,1);
			BinInt.copy(chunk,Z);
		}
		// STEP 5) SUM HASH
		BinInt.add(H0,H0,A);
		BinInt.add(H1,H1,B);
		BinInt.add(H2,H2,C);
		BinInt.add(H3,H3,D);
		BinInt.add(H4,H4,E);
	}
	// RETURN
	var sha1 = new BinInt(160);
	sha1.position(0);
	sha1.writeByteData(H4);
	sha1.writeByteData(H3);
	sha1.writeByteData(H2);
	sha1.writeByteData(H1);
	sha1.writeByteData(H0);
	return sha1;
}
ByteData.SHA256 = function(message){
	return null;
}
ByteData.SHA512 = function(message){
	return null;
}

// AES > BLOW > DESX > RC4 > DES   | RSA / DH
/* 
http://csrc.nist.gov/publications/fips/fips197/fips-197.pdf

*/
ByteData.AESencrypt = function(encryption, key, message){
	encryption.length(0);
	var keyLength = key.length();
	var rounds = (keyLength==128)?10:((keyLength==192)?12:14)
	console.log(keyLength+" : "+rounds);
	var chunk = new BinInt(128);
	// sbox lookup table
		// ...
	// round key lookup table
		// ...
	while(false){ // per message chunk
		// calculate round key (expansion)
			// ...
		// whitening
			// ... 
		for(i=0;i<rounds;++i){ // per round
			// sub bytes
				// ...
			// shift rows
				// ...
			if(i<rounds-1){
				// mix columns
					// ...
			}
			// add round key
				// ...
		}
	}
}

ByteData.AESdecrypt = function(decryption, key, message){
	// yayz
}


ByteData.RSA = function(pub,pri){
	// p,q = random prime
	// n = p*q
	// f = (p-1)*(q-1)
	// pub = [2,f-1] && gcd(pub,f)==1
	// pri = d*e = 1 % f
}

// // ByteData.js
// // ------------------------------------------------------------------------------------------------- Binary Math
// ByteData.and = function(c,a,b){ // c = a & b
// 	var i, len = Math.min(a.getTotalBits(),b.getTotalBits());
// 	for(i=0;i<len;++i){
// 		if( a.getBit(i) && b.getBit(i) ){
// 			c.setBit(i,1);
// 		}else{
// 			c.setBit(i,0);
// 		}
// 	}
// }
// ByteData.or = function(c,a,b){ // c = a | b
// 	var i, len = Math.min(a.getTotalBits(),b.getTotalBits());
// 	for(i=0;i<len;++i){
// 		if( a.getBit(i) || b.getBit(i) ){
// 			c.setBit(i,1);
// 		}else{
// 			c.setBit(i,0);
// 		}
// 	}
// }
// ByteData.xor = function(c,a,b){ // c = a | b
// 	var i, len = Math.min(a.getTotalBits(),b.getTotalBits());
// 	for(i=0;i<len;++i){
// 		if( (a.getBit(i) && !b.getBit(i)) || (!a.getBit(i) && b.getBit(i)) ){
// 			c.setBit(i,1);
// 		}else{
// 			c.setBit(i,0);
// 		}
// 	}
// }
// ByteData.rightShift = function(c){

// }
// ByteData.leftShift = function(c){
	
// }
// ByteData.add = function(c,a,b){ // c = a + b
// 	var i, len = Math.min(a.getTotalBits(),b.getTotalBits());
// 	var aBit, bBit, cBit, cout = 0;
// 	for(i=0;i<len;++i){
// 		aBit = a.getBit(i);
// 		bBit = b.getBit(i);
// 		console.log(aBit);
// 		if(aBit!=0){
// 			if(bBit!=0){
// 				if(cout!=0){
// 					cBit = 1;
// 					cout = 1;
// 				}else{
// 					cBit = 0;
// 					cout = 1;
// 				}
// 			}else{
// 				if(cout!=0){
// 					cBit = 0;
// 					cout = 1;
// 				}else{
// 					cBit = 1;
// 					cout = 0;
// 				}
// 			}
// 		}else{
// 			if(bBit!=0){
// 				if(cout!=0){
// 					cBit = 0;
// 					cout = 1;
// 				}else{
// 					cBit = 1;
// 					cout = 0;
// 				}
// 			}else{
// 				if(cout!=0){
// 					cBit = 1;
// 					cout = 0;
// 				}else{
// 					cBit = 0;
// 					cout = 0;
// 				}
// 			}
// 		}
// 		c.setBit(i,cBit);
// 	}
// };
// /*ByteData.add = function(c,a,b){ // c = a + b
// 	// 2s compliment?
// 	ByteData.and(c,a,b);
// };*/
// ByteData.sub = function(c,a,b){ // c = a - b
// 	ByteData.temp.copy(b);
// 	// 2s compliment?
// };
// ByteData.mul = function(c,a,b){ // c = a * b
// 	// shifting
// };
// ByteData.div = function(c,a,b){ // c = a / b
// 	// ?
// };

// // ------------------------------------------------------------------------------------------------- correct 64-bit encoding
// ByteData.arrayString64 = null;
// ByteData.arrayInverse64 = null;
// ByteData.getString64Array = function(){
// 	if(ByteData.arrayString64){
// 		return ByteData.arrayString64;
// 	}
// 	var str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[]";
// 	var i, len = str.length;
// 	ByteData.arrayString64 = new Array();
// 	for(i=0;i<len;++i){
// 		ByteData.arrayString64[i] = str.charAt(i);
// 	}
// 	return ByteData.arrayString64;
// }
// ByteData.getString64Hash = function(){
// 	if(ByteData.arrayInverse64){
// 		return ByteData.arrayInverse64;
// 	}
// 	var arr = ByteData.getString64Array();
// 	var i, len = arr.length;
// 	ByteData.arrayInverse64 = new Array();
// 	for(i=0;i<len;++i){
// 		ByteData.arrayInverse64[ arr[i] ] = i;
// 	}
// 	return ByteData.arrayInverse64;
// }
// // ------------------------------------------------------------------------------------------------- official bit64 encoded
// ByteData.arrayStringBit64 = null;
// ByteData.arrayInverseBit64 = null;
// ByteData.getStringBit64Array = function(){
// 	if(ByteData.arrayStringBit64){
// 		return ByteData.arrayStringBit64;
// 	}
// 	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
// 	var i, len = str.length;
// 	ByteData.arrayStringBit64 = new Array();
// 	for(i=0;i<len;++i){
// 		ByteData.arrayStringBit64[i] = str.charAt(i);
// 	}
// 	return ByteData.arrayStringBit64;
// }
// ByteData.getString64Hash = function(){
// 	if(ByteData.arrayInverseBit64){
// 		return ByteData.arrayInverseBit64;
// 	}
// 	var arr = ByteData.getStringBit64Array();
// 	var i, len = arr.length;
// 	ByteData.arrayInverseBit64 = new Array();
// 	for(i=0;i<len;++i){
// 		ByteData.arrayInverseBit64[ arr[i] ] = i;
// 	}
// 	return ByteData.arrayInverseBit64;
// }
// // ----------------------------------------------------------------
// ByteData.reverseUint = function(n,count){
// 	var i=0, m=0, ander = 1, toand = 1;
// 	ander <<= count-1;
// 	while(ander!=0){
// 		var anded = ander&n;
// 		if(anded != 0){
// 			m += toand;
// 		}
// 		ander >>= 1;
// 		toand <<= 1;
// 	}
// 	console.log(n+" => "+m);
// 	return m;
// }
// // ------------ instance
// function ByteData(){
// 	var self = this;
// 	// private:
// 	var bytes = [];
// 	var length = -1;
// 		// write
// 	var subIndex = 0;
// 	var subCount = 0;
// 		// read
// 	var readIndex = 0;
// 	var readSubIndex = 0;
// 	var signBit = false;
// 	// public:
// 	this.clearData = clearData;
// 	function clearData(){
// 		Code.emptyArray(bytes);
// 		length = -1;
// 		subIndex = 0;
// 		subCount = 0;
// 	}
// 	this.getBit = function(n){
// 		var s = Math.floor(n/32);
// 		var b = n % 32;
// 		var ander = -2147483648;
// 		for(var i=0;i<b;++i){
// 			ander >>= 1;
// 			ander &= 0x7FFFFFFF;
// 		}
// 		return (bytes[s] & ander) != 0;
// 	};
// 	this.setBit = function(n,v){
// //			n = (length+1)*32 - (31 - subCount) - (n+1); // reverse
// 		var s = Math.floor(n/32);
// 		var b = n % 32;
// 		var ander = -2147483648;
// 		for(var i=0;i<b;++i){
// 			ander >>= 1;
// 			ander &= 0x7FFFFFFF;
// 		}
// 		if(v!=0){
// 			bytes[s] = bytes[s] | ander;
// 		}else{
// 			ander = ~ander;
// 			bytes[s] = bytes[s] & ander;
// 		}
// 	}
// 	this.readEnd = readEnd;
// 	function readEnd(){
// 		return readIndex>length || (readIndex==length && (readSubIndex<=0&&subIndex<=0 || readSubIndex>0&&readSubIndex<=subIndex) );
// 	}
// 	this.getTotalBits = getTotalBits;
// 	function getTotalBits(){
// 		return 32*length + subCount + 1;
// 	}
// 	// --------------------------------------------------------------------------
// 	this.copy = function(datum){
// 		if(self == datum){
// 			return;
// 		}
// 		this.clearData();
// 		var i, len = datum.getTotalBits();
// 		datum.initRead();
// 		for(i=0; i<len; ++i){
// 			this.writeBit( datum.readBit() );
// 		}
// 	}
// 	// --------------------------------------------------------------------------
// 	this.writeString64 = function(str){
// 		var arr = ByteData.getString64Hash();
// 		var i, len = str.length, num;
// 		console.log("length: "+len);
// 		for(i=0;i<len;++i){
// 			num = arr[str.charAt(i)];
// 			this.writeUint6( num );
// 		}
// 	}
//     // ------------------------------------------------------------------------------------------------- Uint#
//     this.writeUintN = function(n,b){
//         /*var i, ander = 1;
//         for(i=0;i<b;++i){
//             (ander&n)==0?writeBit(0):writeBit(1);
//             ander <<= 1;
//         }*/
//         var i, ander = 1;
//         ander <<= b-1;
//         for(i=0;i<b;++i){
//             (ander&n)==0?writeBit(0):writeBit(1);
//             ander >>= 1;
//             ander &= 0x7FFFFFFF;
//         }
//     }
//     this.readUintN = function(b){
//         /*var i, ander = 1, n=0;
//         for(i=0;i<b;++i){
//             readBit()==0?n:n|=ander;
//             ander <<= 1;
//         }*/
//         var i, ander = 1, n=0;
//         ander <<= b-1;
//         for(i=0;i<b;++i){
//             readBit()==0?n:n|=ander;
//             ander >>= 1;
//             ander &= 0x7FFFFFFF;
//         }
//         return n;
//     }
// 	// ------------------------------------------------------------------------------------------------- Uint4 nibble
// 	this.writeUint4 = function(n){ this.writeUintN(n,4); }
// 	this.readUint4 = function(){ return this.readUintN(4); }
// 	// ------------------------------------------------------------------------------------------------- Uint6
// 	this.writeUint6 = function(n){ this.writeUintN(n,6); }
// 	this.readUint6 = function(){ return this.readUintN(6); }
// 	// ------------------------------------------------------------------------------------------------- Uint8 byte
// 	this.writeUint8 = function(n){ this.writeUintN(n,8); }
// 	this.readUint8 = function(){ return this.readUintN(8); }
// 	// ------------------------------------------------------------------------------------------------- Uint16
// 	this.writeUint16 = function(n){ this.writeUintN(n,16); }
// 	this.readUint16 = function(){ return this.readUintN(16); }
// 	// ------------------------------------------------------------------------------------------------- Uint32
// 	this.writeUint32 = function(n){ this.writeUintN(n,32); }
// 	this.readUint32 = function(){ return this.readUintN(32); }
// 	// ------------------------------------------------------------------------------------------------- Strings
// 	this.writeString = function(str,includeLength){
// 		var i, len = str.length;
// 		if( includeLength===null || includeLength===undefined){
// 			this.writeUint32(len);
// 		}
// 		for(i=0;i<len;++i){
// 			this.writeASCII(str.charAt(i));
// 		}
// 	}
// 	this.readString = function(includeLength){
// 		if(includeLength===null || includeLength===undefined){
// 			includeLength = -1;
// 		}
// 		var i, len, str = "";
// 		if(includeLength<0){ // read byte length
// 			len = this.readUint32();
// 		}else if(includeLength==0){ // read to end
// 			len = this.getTotalBits()/8;
// 		}else{ // read param length
// 			len = includeLength;
// 		}
// 		for(i=0;i<len;++i){
// 			str = str + this.readASCII();
// 		}
// 		return str;
// 	}
// 	this.writeASCII = function(letter){
// 		var n = letter.charCodeAt(0);
// 		this.writeUint8(n);
// 	}
// 	this.readASCII = function(){
// 		var n = this.readUint8();
// 		return String.fromCharCode( n )
// 	}
// 	// ------------------------------------------------------------------------------------------------- 
// 	this.toStringBin = function(){
// 		var str = "", h, i, len = getTotalBits();
// 		initRead();
// 		for(i=0;i<len;++i){
// 			if ( i%8==0 && i>0){
// 				str = str + "|"
// 			}
// 			str = str+readBit();
// 		}
// 		return str;
// 	}
// 	this.toString64BitEncoded = function(){
// 		var arr = ByteData.getStringBit64Array();
// 		initRead();
// 		var i, str = "";
// 		var totBits = getTotalBits();
// 		var len = Math.ceil(totBits/6.0);
// 		var rem = len*6 - totBits;
// 		for(i=0;i<len;++i){
// 			str = str+ arr[ this.readUint6() ];
// 		}
// 		if(rem>=4){
// 			str = str + "==";
// 		}else if(rem>=2){
// 			str = str + "=";
// 		}
// 		return str;
// 	}
// 	this.toString10 = function(){
// 		var str = "";
// 		/*var i, len = Math.ceil(getTotalBits()/4.0);
// 		initRead();
// 		for(i=0;i<len;++i){
// 			if ( i%8==0 && i>0){
// 				str = str + "|"
// 			}
// 			str = str+readUint4().toString(16).toUpperCase();
// 		}*/
// 		return str;
// 	}
// 	this.toString = function(){
// 		return this.toStringBin();
// 	}
// 	// 
// 	/*this.printBinaryString = printBinaryString;
// 	function printBinaryString(){
// 		var i, len=length+1, str = "";
// 		for(i=0;i<len;++i){
// 			str = base10ToBinaryString(bytes[i],32) + str;
// 		}
// 		var rev = "";
// 		len = str.length;
// 		for(i=0;i<len;++i){
// 			rev = str.substr(i,1)+rev;
// 		}
// 		//document.write(str);
// 		document.write(rev);
// 	}*/
// 	this.getSubIndex = getSubIndex;
// 	function getSubIndex(){
// 		return subIndex;
// 	}
// 	/*
// 	this.getASCIICode = getASCIICode;
// 	function getASCIICode(){
// 		var charListASCII = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ()";
// 		var charArrayASCII = [];
// 		var i, len = charListASCII.length;
// 		for(i=0;i<len;++i){
// 			charArrayASCII[i] = charListASCII.charAt(i);
// 		}
// 		var val, str="";
// 		initRead();
// 		while(!readEnd()){
// 			val = 0;
// 			for(i=0;i<5;++i){
// 				val <<= 1;
// 				val |= readBit();
// 			}
// 			str += charArrayASCII[val];
// 		}
// 		document.write(str);
// 	}


// 	// ----------------
// 	function base10ToBinaryString(number,bitsMax){
// 		var str="", digit=1, isOdd, i;
// 		var sign = 0;
// 		if(number<0){
// 			sign = 1;
// 			number = -number;
// 		}
// 		while(number>0){
// 			isOdd = number % 2;
// 			str = ""+isOdd+str;
// 			digit <<= 1;
// 			number >>= 1;
// 		}
// 		if(str.length>bitsMax){
// 			return str.substr(str.length-bitsMax,bitsMax);
// 		}
// 		for(i=str.length;i<bitsMax;++i){
// 			str = "0"+str;
// 		}
// 		if(sign>0&&bitsMax==32){
// 			str = "1"+str.substr(1,str.length-1);
// 		}
// 		return str;
// 	}
// 	*/
// }

// ByteData.temp = new ByteData();
