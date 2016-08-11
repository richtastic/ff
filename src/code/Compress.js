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

	// console.log("bytes:");
	// for(var i=0; i<compressedDataLength; ++i){
	// 	console.log(Code.prependFixed(i+"","0",3)+": "+inputArray[i+compressedDataOffset] );
	// }

	var uncompressedData = [];

	// 

	// var currentByteIndex = 0;
	// var currentBitIndex = 0;

// READ BLOCK HEADER
	// LZ77 starts at LSB of Byte:
	// block begins with 3 header bits : BFINAL=1 | BTYPE=2
	var bfinal = Compress.readNBitsFromBytes(inputArray, compressedDataOffset*8, 1, true); // first bit -- BFINAL == 1 if last black
	var btype = Compress.readNBitsFromBytes(inputArray, compressedDataOffset*8+1, 2, true); // next 2 bits -- 00==no compression, 01==fixed huffman, 10==dynamic huffman, 11 = N/A

	//compressedDataOffset += 3;
	var currentBitIndex = compressedDataOffset*8 + 3;

	console.log("start: "+inputArray[compressedDataOffset]);
	console.log(" _ BFINAL: "+bfinal+"  BTYPE:"+btype);


	if(btype==0x3){
		console.log("error, type 0b0011 reserved");
		
	}else if(btype==0x0){
		console.log("btype == 0 = NO COMPRESSION");
		// ignore bits up to next byte boundary
		//var next = currentBitIndex+1;
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
				var HLIT = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 5, true); currentBitIndex += 5;
					var codeLengthLiteralCount = HLIT + 257;
				var HDIST = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 5, true); currentBitIndex += 5;
					var codeLengthDistanceCount = HDIST + 1;
				var HCLEN = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 4, true); currentBitIndex += 4;
					var codeLengthsCodeCount = HCLEN + 4;
			console.log("HLIT: "+HLIT);
			console.log(" -> codeLengthLiteralCount: "+codeLengthLiteralCount);
			console.log("HDIST: "+HDIST);
			console.log(" -> codeLengthDistanceCount: "+codeLengthDistanceCount);
			console.log("HCLEN: "+HCLEN);
			console.log(" -> codeLengthsCodeCount: "+codeLengthsCodeCount);

			// read in HCLEN bits

var codeAlphabetOrder = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]; // random permutation lookup table
var codeAlphabetOrderLength = codeAlphabetOrder.length;
// for(i=0;i<codeAlphabetOrder.length;++i){
// 	console.log( Code.prependFixed( i+": "+codeAlphabetOrder[i]+" = ", " ", 10) +Code.intToBinaryString(codeAlphabetOrder[i],7));
// }

			//
			var i, j;

			var compressed_code_lengths = Code.newArrayZeros(codeAlphabetOrderLength);
console.log(codeAlphabetOrderLength)
			// CODE LENGTHS
			for(i=0; i<codeLengthsCodeCount; ++i){
				var bits = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 3, false); currentBitIndex += 3;
				var index = codeAlphabetOrder[i]; // translate from read value to lookup table value
				compressed_code_lengths[index] = bits;
			}

//compressed_code_lengths = [3, 3, 3, 3, 3, 2, 4, 4];
console.log(compressed_code_lengths);
// var amt = 0;
// for(i=0;i<compressed_code_lengths.length;++i){
// 	amt += compressed_code_lengths[i];
// 	console.log( amt );
// }
// GET HUFFMAN CODES FROM LIST OF CODE LENGTHS
var compressed_huffman_codes = Compress.huffmanCodesFromLengths(compressed_code_lengths);
console.log(compressed_huffman_codes)
//console.log(compressed_huffman_codes.length);
var huffmanTree = Compress.huffmanTreeFromCodes(compressed_huffman_codes);
// console.log(huffmanTree);
// 
// 
var readBits;
// 
// ?
var codeLengthValuesCount = codeLengthLiteralCount + codeLengthDistanceCount; // HLIT + HDSIT + 258
// 
//
//
//

/*
 compressed byte array illustration
   <- data reading order <-  
+===+       +===+ +===+ +===+ 
| n |  ...  | 2 | | 1 | | 0 |
+===+       +===+ +===+ +===+
 bytes in 
fixed-width in MSB-to-LSB order
huffman-codes in bit-reverse
*/
console.log("huffmanTree");
console.log(huffmanTree.toString());
readBits = 0;
			// LITERAL LENGTHS //  USING HUFFMAN TREE CODES
			for(i=0; i<codeLengthValuesCount; ++i){
				if(i<codeLengthLiteralCount){
					// literals & lengths sequence
				}else{
					// distance sequence
				}
// The code length repeat codes can cross from HLIT + 257 to the HDIST + 1 code lengths. In other words, all code lengths form a single sequence of HLIT + HDIST + 258 values.
				var symbol = Compress.readSymbolWithHuffmanTree(inputArray,currentBitIndex,huffmanTree);
				console.log(symbol);
				if(!symbol){
					break;
				}
				var value = symbol["symbol"];
				readBits += symbol["bitLength"];
				currentBitIndex += symbol["bitLength"];
				var bits;
				if(value<=15){ // code length of 0-15
					console.log("0-15");
				}else if(value==16){ // copy previous code length, 3-6 times
					console.log("16");
					// next 2 bits = repeat length
					bits = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 2, true); currentBitIndex += 2;
					var repeatLength = bits + 3;
				}else if(value<=17){ // repeat code length 0, 3-10 times
					console.log("17");
					bits = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 3, true); currentBitIndex += 3;
					var repeatLength = bits + 3;
				}else if(value==18){ // repeat code length 0, 11-138 times
					console.log("18");
					bits = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 7, true); currentBitIndex += 7;
					var repeatLength = bits + 11;
				}

			}
console.log("................................: "+readBits);

			// COMBINE INTO HUFFMAN CODE

			// PROCESS COMPRESSED DATA

			// EOD MARKER

return null;











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

Compress.huffmanCodesFromLengths = function(huffmanCodeLengths){ // bit length frequency array
	var i, j;

	// STEP 1 - COUNT NUMBER OF CODE FOR EACH CODE LENGTH
	var maximumBits = Code.maxArray(huffmanCodeLengths);
	var bitLengthCounts = Code.newArrayZeros(maximumBits+1);
	for(var i=0; i<huffmanCodeLengths.length; ++i){
		bitLengthCounts[huffmanCodeLengths[i]]++;
	}

	// STEP 2 - INITIALIZE CODES TO SMALLEST VALUE FOR EACH CODE LENGTH
	var code = 0;
	bitLengthCounts[0] = 0; // some lengths might have 0 count
	var nextCodes = Code.newArrayZeros(maximumBits);
	for(i=1; i<=maximumBits; ++i){
	    code = (code + bitLengthCounts[i-1]) << 1; // adding with previous = ? , shift left makes sure it starts with a 0
	    nextCodes[i] = code;
	}

	// STEP 3 - CREATE CODES FOR EACH SYMBOL, STARTING AT EADH START-CODE
	var symbolList = [];
	var index = 0;
	for(i=0; i<huffmanCodeLengths.length; ++i){
		var bits = huffmanCodeLengths[i];
		var len = bitLengthCounts[bits];
	        if(len!=0){
	        	var code = nextCodes[bits];
            	nextCodes[bits]++;
				symbolList[i] = {"binaryCode":code,"bitLength":bits,"symbol":i};
				//console.log(symbolList[i]);
	        }else{
	        	symbolList[i] = null;
	        }
	    }
	return symbolList;
}

Compress.readSymbolWithHuffmanTree = function(byteArray,offset,huffman){
	var bit;
	var node = huffman;
	var c = 0;
	var bitSequence = 0;
	var read = 0;
	while(node){
		c++;
		if(c>10){
			break;
		}
		bit = Compress.readNBitsFromBytes(byteArray, offset+read, 1, true); read += 1; // IS THIS TRUE OR FALSE
		console.log(c+": "+bit);
		bitSequence = (bitSequence<<1);
		if(bit==0){
			node = node.left();
			bitSequence |= 0x0;
		}else{
			node = node.right();
			bitSequence |= 0x1;
		}
		//console.log(node);
		if(!node){
			console.log("error node is null for: "+bitSequence);
			return null;
		}
		if(!node.hasChildren()){
			return {"bitLength":read, "binaryCode":bitSequence, "symbol":node.data()};
		}
	}
	return null;
}

Compress.huffmanTreeFromCodes = function(codes){
	var i, j;
	var root = new Tree();
	for(i=0; i<codes.length; ++i){
		var entry = codes[i];
		if(entry){
			var bitLength = entry["bitLength"];
			var binaryCode = entry["binaryCode"];
			var symbol = entry["symbol"];
			// put item in tree
			var node = root;
			for(j=0;j<bitLength;++j){
				var isOne = Code.getBitFromRight(binaryCode,bitLength-j-1);
				var next;
				if(isOne){
					next = node.right();
					if(!next){
						next = new Tree();
						node.right(next);
					}
				}else{
					next = node.left();
					if(!next){
						next = new Tree();
						node.left(next);
					}
				}
				node = next;
			}
			node.data(symbol);
		}
	}
	return root;
};

Compress.readNBitsFromBytes = function(inputArray, offsetBits, lengthBits, fromLSB){
	fromLSB = fromLSB !== undefined ? fromLSB : false;
	var offsetByte = Math.floor(offsetBits/8);
	var startBit = offsetBits - offsetByte*8;
	var byt, isOne, mask;
	var value = 0x0;
	var read = 0;
	var index = offsetByte;
	if(!fromLSB){ // start from 7,6,...,1,0
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

