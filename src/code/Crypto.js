// ByteData

// NODEJS INCLUSION
isBrowser = false;
isNode = false;
if (typeof module !== 'undefined' && module.exports) { isNode = true; }
if (typeof window !== 'undefined' && window.navigator) { isBrowser = true; }
if(isNode){
	var Code = require("./Code.js");
	var ByteData = require("./ByteData.js");
	var BinInt = require("./BinInt.js");
}


function Crypto(){
	throw "this is a static library";
}

Crypto.SHA1 = function(message){
	var mCopy = new ByteData();
		mCopy.writeUint8Array(message);
	var originalLen = mCopy.length();
	// STEP 1) EXTENDIFY - EXTEND MESSAGE TO: MESSAGE|1|0...0|LENGTH -----------------------------------------
	mCopy.position( originalLen );
	mCopy.write(1);
	// COPY TO TEMP MESSAGE
	var messageLen = mCopy.length();
	var remainder = 512 - (messageLen % 512);
// console.log("remainder: "+remainder);
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
	var F = new BinInt(32), K = new BinInt(32), X = new BinInt(32), Y = new BinInt(32), Z = new BinInt(32);
	var TEMP, chunk;
	var chunk512 = new BinInt(512);
	// INIT CHUNKS
	var chunkList = new Array();
	for(i=0;i<16;++i){
		chunkList.push( new BinInt(32) );
	}
	var chunkCount = Math.ceil(messageLen/512);
	// console.log("TOTAL LEN: "+messageLen+" = "+chunkCount+" CHUNKS");
	// LOOP
	for(i=0;i<chunkCount;++i){
		// STEP 2) CHUNKIFY - SPLIT 512-CHUNK INTO 16+64=80 32-BIT SUB-CHUNKS
		mCopy.position(i*512);
		for(j=0;j<16;++j){
			chunk = chunkList[j];
			// for(k=0;k<32;++k){ // TODO: CAN SPEED UP USING FAST-32 COPIES ON LINES
			// 	chunk._position = 31-k;
			// 	// chunk._position = k;
			// 	chunk.write( mCopy.read() );
			// }
			chunk.writeUint32( mCopy.readUint32() );
			chunk.reverse();
		}
		// CONTINUE HASH
		A.copy(H0); B.copy(H1); C.copy(H2); D.copy(H3); E.copy(H4);
		// console.log("A "+A.toStringDebug());
		// console.log("B "+B.toStringDebug());
		// console.log("C "+C.toStringDebug());
		// console.log("D "+D.toStringDebug());
		// console.log("E "+E.toStringDebug());
		for(j=0;j<80;++j){
		// console.log(" loooøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøøø")
			chunk = chunkList[j%16];
			// STEP 3) DEFINE KEY AND FUNCTION:
			if(j<20){ // F = (B & C) | (!B & D)
				// K.setFromIntForward(0x5A827999);
				K.setFromInt(0x5A827999);
				BinInt.andFast(X,B,C);
				BinInt.notFast(Y,B);
				BinInt.andFast(Y,Y,D);
				BinInt.orFast(F,X,Y);
			}else if(j<40){ // F = B ^ C ^ D
				// K.setFromIntForward(0x6ED9EBA1);
				K.setFromInt(0x6ED9EBA1);
				BinInt.xorFast(X,B,C);
				BinInt.xorFast(F,X,D);
			}else if(j<60){ // F = (B & C) | (B & D) | (C & D)
				// K.setFromIntForward(0x8F1BBCDC);
				K.setFromInt(0x8F1BBCDC);
				BinInt.andFast(X,B,C);
				BinInt.andFast(Y,B,D);
				BinInt.andFast(Z,C,D);
				BinInt.orFast(Y,X,Y);
				BinInt.orFast(F,Y,Z);
			}else{ // F = B ^ C ^ D
				// K.setFromIntForward(0xCA62C1D6);
				K.setFromInt(0xCA62C1D6);
				BinInt.xorFast(X,B,C);
				BinInt.xorFast(F,X,D);
			}
// console.log("K "+K.toStringDebug());
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


// console.log("A "+A.toStringDebug());
// console.log("B "+B.toStringDebug());
// console.log("C "+C.toStringDebug());
// console.log("D "+D.toStringDebug());
// console.log("E "+E.toStringDebug());

// if(j>=1){
// 	throw "end early";
// }
		}
		// STEP 5) SUM HASH
		BinInt.add(H0,H0,A);
		BinInt.add(H1,H1,B);
		BinInt.add(H2,H2,C);
		BinInt.add(H3,H3,D);
		BinInt.add(H4,H4,E);


// console.log( " H0: "+H0.toStringDebug() );
// console.log( " H1: "+H1.toStringDebug() );
// console.log( " H2: "+H2.toStringDebug() );
// console.log( " H3: "+H3.toStringDebug() );
// console.log( " H4: "+H4.toStringDebug() );

		// throw "OUT";
	}
	// RETURN
	// var sha1 = new BinInt(160);
	var sha1 = new ByteData(160);
	sha1.position(0);

// throw "OUT";
	// sha1.writeByteData(H4);
	// sha1.writeByteData(H3);
	// sha1.writeByteData(H2);
	// sha1.writeByteData(H1);
	// sha1.writeByteData(H0);

// REVERSE INTS


H0.reverse();
H1.reverse();
H2.reverse();
H3.reverse();
H4.reverse();

	sha1.writeByteData(H0);
	sha1.writeByteData(H1);
	sha1.writeByteData(H2);
	sha1.writeByteData(H3);
	sha1.writeByteData(H4);



	return sha1;
}
Crypto.SHA256 = function(message){
	return null;
}
Crypto.SHA512 = function(message){
	return null;
}

Crypto._AESsecretPrepare = function(secret){ 
	var secretRequired = 256 / 8; // bytes
	var secretLength = secret.length;
	if(secretLength==0){ // need at least 1 byte
		throw "no secret"
	}
	var secretRemainder = secretRequired - secretLength;
	if(secretRemainder>0){
		var i = 0;
		for(var j=secretLength; j<secretRemainder; ++j, ++i){
			secret[j] = secret[i];
		}
	}
	secretRemainder = Math.max(secretRemainder,0);
	info = {};
		info["original"] = secretLength;
		info["added"] = secretRemainder;
	return info;
}
Crypto._AESsecretRestore = function(secret, secretInfo){ 
	var remainder = secretInfo["added"];
	for(var i=0; i<remainder; ++i){
		secret.pop();
	}
}
Crypto._AESplaintextPrepare = function(plaintext){
	var lengthMultiple = 256 / 8; // bytes
	// force a byte for length info
	plaintext.push(0x080);
	var plaintextLength = plaintext.length;
	// console.log("plaintextLength+1: "+plaintextLength);
	var plaintextRemainder = plaintextLength % lengthMultiple;
	// console.log("plaintextRemainder: "+plaintextRemainder);
	//console.log(plaintext);
	var appendCount = 0;
	if(plaintextRemainder>0){
		appendCount = lengthMultiple - plaintextRemainder;
		for(var i=0; i<appendCount; ++i){
			plaintext.push(0x000);
		}
	}
	info = {};
		info["original"] = plaintextLength;
		info["added"] = appendCount + 1; //including nonzero
	return info;
}
Crypto._AESplaintextRestore = function(plaintext, plaintextInfo){ 
	var remainder = plaintextInfo["added"];
	for(var i=0; i<remainder; ++i){
		plaintext.pop();
	}
}

Crypto.getEncryptedData = function(encrypted){ // enc | salt | iv
	var countSalt = 256/8;
	var countIV = 256/8;
	var info = {};
		info["iv"] = Code.subArray([], encrypted, encrypted.length-countIV-0,countIV);
		info["salt"] = Code.subArray([], encrypted, encrypted.length-countSalt-countIV-0,countSalt);
	return info;
}

// var encrypted = ByteData.AESencrypt(key, plaintext, type, size, useSalting);
Crypto.encryptAES = function(secret, plaintext, inputSalt, inputIV){ // implementation utilizing AES-256
	// append secret as needed
	var secretInfo = Crypto._AESsecretPrepare(secret);
	
	// append plaintext as needed
	var plaintextInfo = Crypto._AESplaintextPrepare(plaintext);
	// console.log("plaintext: "+plaintext.length);
	// console.log(plaintext);

	// create password salt
	var passwordSalt = inputSalt!==undefined ? inputSalt : Crypto.randomBytes(256/8);
	// console.log("passwordSalt: "+passwordSalt);

	// password xoring
	var secretSalted = Crypto.xor(secret,passwordSalt);
	// console.log("secretSalted: "+secretSalted);
	// console.log("secretSalted: "+secretSalted.length);

	// create IV
	var intitializationVector = inputIV!==undefined ? inputIV : Crypto.randomBytes(256/8);
	// console.log("intitializationVector: "+intitializationVector);
	// console.log(" iv: "+intitializationVector.length);

	// encryption
	var type = ByteData.AES_TYPE_CBC;
	var size = ByteData.AES_SIZE_256;
	// console.log("plaintext length: "+plaintext.length);
	var encrypted = ByteData.AESencrypt(secretSalted, plaintext, type, size, intitializationVector);

	// append salt & IV 
	Code.arrayPushArray(encrypted, passwordSalt);
	Code.arrayPushArray(encrypted, intitializationVector);

	// undo any padding or whatnot & return to original state
	Crypto._AESsecretRestore(secret, secretInfo);
	Crypto._AESplaintextRestore(plaintext, plaintextInfo);

	return encrypted; // ciphertext
	
}
Crypto.decryptAES = function(secret, ciphertext){
	// append secret by repeating
	var secretInfo = Crypto._AESsecretPrepare(secret);

var originalSize = ciphertext.length;

	// extract IV
	var ivLength = 256/8;
	// console.log(" ivLength: "+ivLength);
	var start = ciphertext.length-ivLength;
	var end = ciphertext.length;
	var intitializationVector = Code.copyArray([], ciphertext, start, end);
	// console.log(" iv: "+intitializationVector);
	// console.log(" iv: "+intitializationVector.length);
	// console.log(" a: "+intitializationVector[intitializationVector.length-1]);
	// console.log(" b: "+ciphertext[ciphertext.length-1]);

	// extract password salt
	var saltLength = 256/8;
	end = start-1;
	start -= saltLength;
	var passwordSalt = Code.copyArray([], ciphertext, start, end);
	// console.log("passwordSalt: "+passwordSalt);
	var secretSalted = Crypto.xor(secret,passwordSalt);
	// console.log("secretSalted: "+secretSalted);
	// console.log("secretSalted: "+secretSalted.length);
	
	Code.truncateArray(ciphertext,start);
	// console.log("cipher length: "+ciphertext.length+" : "+start);
	
	// var restored = ByteData.AESdecrypt(key, encrypted, type, size, useSalting);
	// decrypt
	var type = ByteData.AES_TYPE_CBC;
	var size = ByteData.AES_SIZE_256;
	var decrypted = ByteData.AESdecrypt(secretSalted, ciphertext, type, size, intitializationVector);

	// do any size truncating
	// var popCount = saltLength + ivLength;
	// console.log("popCount: "+popCount)
	// for(var i=0; i<popCount; ++i){
	// 	decrypted.pop();
	// }
	// console.log(decrypted.length+" ????????????????");

	// remove N bytes from end
	for(var i=decrypted.length-1; i>=0; --i){
		var val = decrypted.pop();
		if(val!=0){
			break;
		}
	}
	// undo any padding or whatnot & return to original state
	Crypto._AESsecretRestore(secret, secretInfo);

	// restore cyphertext:
	Code.arrayPushArray(ciphertext,passwordSalt);
	Code.arrayPushArray(ciphertext,intitializationVector);

var finalSize = ciphertext.length;
if(originalSize!=finalSize){
	throw "didnt restore"
}
	// throw "decryptAES";

	return decrypted; // plaintext
}







Crypto.RSA = function(pub,pri){
	// p,q = random prime
	// n = p*q
	// f = (p-1)*(q-1) [totient]
	// pub = [2,f-1] && gcd(pub,f)==1  .... 
	// [also n is public]
	// pri = d*e = 1 % f  == shared secret
	// ENCRYPTION:
	// 	cyphertext = plaintext ^ pub % n
	// DECRYPTION
	// 	plaintext = cyphertext ^ pri % f
}





Crypto.randomBytes = function(count){ // TODO: more secure than Math.random()
	var bytes = [];
	// Code.randomIntArray(16, 0,0xFF);
	for(var i=0; i<count;++i){
		bytes[i] = Code.randomInt(0x00,0xFF);
	}
	return bytes;
}



Crypto.xor = function(c, a,b){
	if(!b){
		b = a;
		a = c;
		c = [];
	}
	var len = Math.min(a.length, b.length);
	for(var i=0; i<len;++i){
		c[i] = a[i] ^ b[i];
	}
	return c;
}




Crypto.planetaryDRBG = function(){
	/*
	initialize with timestamp data
	input:
		N x  [px,py, vx,vy]
	iteration:
		run N-body simulation with delta t
	output:
		single bit = sum of bits % 1 (xor) of ith planetary position / distance / ...
	*/

	if(false){
		Crypto._initPlanetaryDRBG();
		Crypto._iteratePlanetaryDRBG();
	}

	throw "planetaryDRBG"
	return Crypto._bitPlanetaryDRBG();
}
Crypto._initPlanetaryDRBG = function(){
	var milliseconds = Code.getTimeMilliseconds();
	console.log(milliseconds);
	var bodies = [];
		bodies.push({"px":0,"py":0,"vx":0,"vy":0});
		bodies.push({"px":1,"py":1,"vx":0,"vy":0});
	// ..
	Crypto._dataPlanetaryDRBG = {"bodies":bodies};
}
Crypto._iteratePlanetaryDRBG = function(){
	// ...
}
Crypto._bitPlanetaryDRBG = function(){
	// ...
}


if(Code.isNode()){
	module.exports = Crypto;
}


