// Compress.js
function Compress(){
	//
}
//  http://www.ietf.org/rfc/rfc1950.txt -- stream & adler checksum
// https://www.ietf.org/rfc/rfc1951.txt -- deflate
/*

BLOCK = HUFFMAN-CODE-TREES + COMPRESSED-DATA
COMPRESSED-DATA = LITERAL-BYTES + POINTERS-TO-DUPS
POINTER = <length, backward distance>
LENGTH-LIMIT: 258 BYTES
DISTANCE-LIMIT: 23K BYTES

LSBYTE-FIRST STORAGE, EG: 520 = |00001000|000000010   [normally opposite]

*/
Compress.LZ77_FLG_FDICT = 0x00;
Compress.lz77Compress = function(inputArray, offset, length){
	if(!inputArray){ return null; }
	offset = offset!==undefined ? offset : 0;
	length = length!==undefined ? length : inputArray.length;
	var outputTable = {};
	return outputTable;
}
Compress.lz77Decompress = function(inputArray, offset, length){ // zlib
	if(!inputArray){ return null; }
	offset = offset!==undefined ? offset : 0;
	length = length!==undefined ? length : inputArray.length;
	var cmf = inputArray[offset+0]; // CMF
		var compressionMethod = (cmf & 0x0F) >> 0; // CM - 8=window up to 32K
		var compressionInfo = (cmf & 0xF0) >> 4; // CINFO - @ CM=8 : base-2 log of (window - 8), 2^(7 -8) = 32K = 32768
	var flg = inputArray[offset+1]; // FLG
		var fcheck = (flg & 0x1F) >> 0;
		var fdict = (flg & 0x20) >> 5;
		var flevel = (flg & 0xC0) >> 6;
	var adler32 = Code.uint32FromByteArray(inputArray,offset+length-4); // ADLER32 = uncompressed data checksum
	var currentIndex = offset + 2;

	console.log("checks: ");
		console.log("  CM:"+compressionMethod+" | CINFO:"+compressionInfo);

	console.log("flags: ");
		console.log("  FCHECK:"+fcheck+" | FDICT:"+fdict+" | FLEVEL:"+flevel);
		//   FCHECK:23 | FDICT:0 |FLEVEL: 3
	console.log(" : "+(compressionMethod*256+flg)+" % 31 = "+((compressionMethod*256+flg)%31)); // must be multiple of 31
	if(compressionMethod==8){
		console.log("deflate compression method");
		var exponent = compressionInfo + 8;
		var windowSize = Math.pow(2,exponent);
		console.log("windowSize: "+windowSize);
		// base-2 logarithm of the LZ77 window size, minus eight (CINFO=7 indicates a 32K window size)
		// 2^(log(7)/log(2) - 8)
	} else {
		console.log("only compression method 8 is allowed");
		return null;
	}
	
	if(fdict==1){//flg & Compress.LZ77_FLG_FDICT!=0){
		console.log("dictionary present");
		var dictionaryID = Code.uint32FromByteArray(inputArray,currentIndex); // DICTID
		currentIndex += 4;
	}else{
		//
	}

	if(flevel==0){
		console.log("compression = fastest algorithm");
	}else if(flevel==1){
		console.log("compression = fast algorithm");
	}else if(flevel==2){
		console.log("compression = default algorithm");
	}else if(flevel==3){
		console.log("compression = maximum, slowest");
	}


	var compressedDataOffset = currentIndex;
	var compressedDataLength = length - 4 - (compressedDataOffset-offset);
	console.log("uncompress data: @"+compressedDataOffset+" -> "+compressedDataLength);

	var adler32 = Compress.readNBitsFromBytes(inputArray, (compressedDataOffset+compressedDataLength)*8, 32);
	console.log(" ADLER32 FOUND: "+adler32);



	console.log(offset+" -> "+compressedDataOffset)

	console.log("bytes:");
	for(var i=0; i<compressedDataLength; ++i){
		console.log(Code.prependFixed(i+"","0",3)+": "+inputArray[i+compressedDataOffset] );
	}

	var uncompressedData = [];

	// 

	// var currentByteIndex = 0;
	// var currentBitIndex = 0;

// READ BLOCK HEADER
	// NEED 3 BYTES

	// LZ77 starts at LSB of Byte:
	// block begins with 3 header bits : BFINAL=1 | BTYPE=2
	var bfinal = Compress.readNBitsFromBytes(inputArray, compressedDataOffset*8, 1, true); // first bit -- BFINAL == 1 if last black
	var btype = Compress.readNBitsFromBytes(inputArray, compressedDataOffset*8+1, 2, true); // next 2 bits -- 00==no compression, 01==fixed huffman, 10==dynamic huffman, 11 = N/A

	compressedDataOffset += 3;

	console.log("start: "+inputArray[compressedDataOffset]);
	console.log(" _ BFINAL: "+bfinal+"  BTYPE:"+btype);
	if(btype==0x3){
		console.log("error, type 0b0011 reserved");
		
	}else if(btype==0x0){
		console.log("btype == 0 = NO COMPRESSION");
		// ignore bits up to next byte boundary
		var next = compressedDataOffset+1;
		var byt = inputArray[next];
		console.log("TO READ: "+byt ); //  215 = 1101|0111
		var len = Compress.readNBitsFromBytes(inputArray, next*8, 16);// first 2 bytes - LEN == number of bytes in data
		next += 2;
		var nlen = Compress.readNBitsFromBytes(inputArray, next*8, 16);// next 2 bytes - NLEN = 1s compliment of LEN
		console.log("LEN: "+len+" | NLEN:"+nlen);
		// LEN: 55139 | NLEN:24672
	   // 9876543210987654321098765432109876543210

		// 0b1101011101100011
		// 0b 110000001100000

	}else if(btype==0x1 || btype==0x2){ // compressed
		//console.log("btype == 01 || 10 = COMPRESSION");
		if(btype==0x1){
			console.log("01 = fixed huffman");
			// loooping...
		}else if(btype==0x2){ // huffman tables provided in data
			console.log("10 = dynamic huffman"); 
			// read representtion of code tree:
			// length-code,distance-code
			var huffman = [];
				var HLIT = Compress.readNBitsFromBytes(inputArray, compressedDataOffset*8, 5, true); 
					var codeLengthLiteral = HLIT + 257;
				var HDIST = Compress.readNBitsFromBytes(inputArray, compressedDataOffset*8, 5, true); 
					var codeLengthDistance = HDIST + 1;
				var HCLEN = Compress.readNBitsFromBytes(inputArray, compressedDataOffset*8, 4, true);
					var codeLengthsAlphabet = HCLEN + 4; // * 3 ?
					var codeAlphabet = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
						//
				// 0-15 : code length 0-15
				// 16 : copy prev code length 3-6 times, next 2 bits = repeatlength-3 (0=3, 3=6)
				// 17 : repeat code length for 3-10 times (3 bits of length)
				// 18 : repeat code length for 11-138 times (7 bits)
				// var HLIT = 5;
				// var HDIST = 5; // # distance codes - 1
				// var HCLEN = 4; // # codes length codes - 4
		}
		// 0..255 == literal
		// 256 == end-of-block
		// 257..285 == length codes
	}else{ // 11
		console.log("RESERVED TYPE 11 - ERROR");
		return null;
	}
	
	//var computedAdler32 = Compress.adler32(inputArray, compressedDataOffset, compressedDataLength);
	//console.log(" ADLER32 COMPUTED: "+computedAdler32);



	// decompressed output bytes
	var outputBytes = new Uint8Array();
	return outputBytes;
}

Compress.readNBitsFromBytes = function(inputArray, offsetBits, lengthBits, fromLSB){
	fromLSB = fromLSB !== undefined ? fromLSB : false;
	var offsetByte = Math.floor(offsetBits/8);
	var startBit = offsetBits - offsetByte*8;
	var byt, isOne, mask;
	var value = 0x0;
	var read = 0;
	var index = offsetByte;
	if(!fromLSB){ // start form 7,6,...,1,0
		mask = 0x80 >> startBit;
		while(read < lengthBits){
			value = value << 1;
			byt = inputArray[index];
			isOne = (mask & byt) !=0 ? 1 : 0;
			value = value | isOne;
			mask >>= 1;
			++read;
			if(mask==0){
				++index;
				mask = 0x80;
			}
		}
	}else{ // start from 0,1,...,6,7
		mask = 0x01 << startBit;
		while(read < lengthBits){
			value = value << 1;
			byt = inputArray[index];
			isOne = (mask & byt) !=0 ? 1 : 0;
			value = value | isOne;
			mask <<= 1;
			++read;
			if(mask>=0x100){
				++index;
				mask = 0x80;
			}
		}
	}
	return value;
}

// http://www.ietf.org/rfc/rfc1950.txt
Compress.ADLER32_BASE = 65521;
Compress.adler32 = function(inputArray, offset, length){
	var adler = 0x00000001;
	adler = Compress._adler32Update(adler, inputArray, offset, length);
	return adler;
}
Compress._adler32Update = function(adler, inputArray, offset, length){
	var s1 = adler & 0x0000FFFF;
	var s2 = (adler >> 16) & 0x0000FFFF;
	var i, c;
	for(i=0; i<length; ++i){
		c = inputArray[i+offset];
		s1 = (s1 + c)  % Compress.ADLER32_BASE;
		s2 = (s1 + s2) % Compress.ADLER32_BASE;
	}
	return (s2 << 16) + s1;
}
// https://www.w3.org/TR/PNG/#D-CRCAppendix
Compress.CRC = function(bytes){
	var length = bytes.length;
	var crc = Compress._CRC32File(bytes, 0, length);
	crc = crc ^ 0xFFFFFFFF;
	return crc;
}
Compress._CRC32File = function(bytes, offset, count){
	var i;
	var crc = 0xFFFFFFFF;
	var table = Compress._CRC32Table();
	for(i=offset; i<count; ++i){
		crc = table[(crc ^ bytes[i]) & 0x000000FF] ^ (crc >> 8);
	}
	return crc;
}
Compress._CRC32Polynomial = 0xEDB88320; // flipped: 0x04C11DB7
Compress._CRC32TableValue = null;
Compress._CRC32Table = function(){
	if(Compress._CRC32TableValue){
		return Compress._CRC32TableValue;
	}
	var polynomial = Compress._CRC32Polynomial;
	var crc, i, j;
	var table = new Array(256); // 16 x 16
	for(i=0; i<256; ++i){
		crc = i;
		for(j=0; j<8; ++j){
			if ((crc & 1) !=0){
				crc = (crc >> 1) ^ polynomial;
			}else{
				crc = crc >> 1;
			}
		}
		table[i] = crc;
	}
	Compress._CRC32TableValue = table;
	return table;
}
// ------------------------------------------------------------------------------------------------------------------------ 
Compress.prototype.a = function(){
	//
}

