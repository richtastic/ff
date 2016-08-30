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


Compress.testHuff = function(code_length_list){
	code_length_list = code_length_list!==undefined ? code_length_list : [];
	var i;

	// step 1
	var max_code = code_length_list.length-1;
	var maxCount = Code.maxArray(code_length_list);
	var MAX_BITS = maxCount;
	bl_count = Code.newArrayZeros(MAX_BITS+1);
	for(i=0; i<=max_code; ++i){
		var count = code_length_list[i];
		bl_count[count]++;
	}
	console.log("bl_count: ",bl_count);

	// step 2
	var code = 0;
	bl_count[0] = 0; // discard all 0 counts
	var next_code = Code.newArrayZeros(MAX_BITS+1);
	for(i=1; i<=MAX_BITS; ++i){
		code = (code + bl_count[i-1]) << 1;
		next_code[i] = code;
	}
	console.log("next_code: ",next_code);

	// step 3
	var codes = Code.newArrayZeros(max_code+1);
	for(i=0; i<=max_code; ++i){
		var len = code_length_list[i];
		if(len!=0){
			codes[i] = next_code[len];
			next_code[len]++;
		}
	}
	console.log("codes: ",codes);
}

Compress.lz77Decompress = function(inputArray, offset, length){ // zlib
	//console.log("lz77Decompress",inputArray, offset, length);
	// 0      1      (opt 2-5)
    // 0..7 | 0..7 | 0 ... 32 | 0 ... n | 0 ... 32 |
	// CMF  | FLG  |  DICTID  |   data  |  adler32 |

//Compress.testHuff([2,1,3,3]);
//Compress.testHuff([3,3,3,3,3,2,4,4]);
//Compress.testHuff([4, 0, 4,  5,  0,  3,  4, 2,   6, 1,   6, 0,   6, 1, 0, 0, 0,  3, 0]);
//               [24, 0, 25, 54, 0, 10, 26, 4, 110, 0, 111, 0, 112, 1, 0, 0, 0, 11, 0]
//return;

	if(!inputArray){ return null; }
	offset = offset!==undefined ? offset : 0;
	length = length!==undefined ? length : inputArray.length;
var currentIndex = offset;
if(true){
	var CMF = Compress.readNBitsFromBytes(inputArray, offset*8, 8, false); //inputArray[offset+0]; // CMF
		var CM = (CMF>>0) & 0x0F;  // CM - 8=window up to 32K
			var compressionMethod = CM;
		var CINFO = (CMF >> 4) & 0XF; // CINFO - @ CM=8 : base-2 log of (window - 8), 2^(7 -8) = 32K = 32768
			var compressionInfo = CINFO;
	var FLG = Compress.readNBitsFromBytes(inputArray, (offset+1)*8, 8, false); //inputArray[offset+1]; // FLG
		var FCHECK = (FLG>>0) & 0x1F; // 0-4
		var FDICT = (FLG>>5) & 0x01; // 5
		var FLEVEL = (FLG>>6) & 0x03; // 6-7

	//var adler32 = Code.uint32FromByteArray(inputArray,offset+length-4); // ADLER32 = uncompressed data checksum
	currentIndex += 2;

	// console.log(" CMF: ");
	// 	console.log("  CM:"+compressionMethod+" | CINFO:"+compressionInfo);
	// console.log(" FLG: ");
	// 	console.log("  FCHECK:"+FCHECK+" | FDICT:"+FDICT+" | FLEVEL:"+FLEVEL);
	if(compressionMethod==8){ // base-2 logarithm of the LZ77 window size, minus eight (CINFO=7 indicates a 32K window size) 
//		console.log("deflate compression method");
		var exponent = compressionInfo + 8;
		var windowSize = Math.pow(2,exponent);
//		console.log("windowSize: "+windowSize+" bytes");
		// 2^(log(7)/log(2) - 8)
	} else {
		console.log("only compression method 8 is allowed");
		return null;
	}

	var isFCheckValid = (CMF*256+FLG)%31 == 0;
	if(!isFCheckValid){
		console.log("isFCheckValid NOT VALID: CMF:"+CMF+" | FLG:"+FLG);
		return null;
	}
	
	if(FDICT==1){//FLG & Compress.LZ77_FLG_FDICT!=0){
//		console.log("dictionary present, defined for PNG (move this check outside / make setting)");
		var dictionaryID = Code.uint32FromByteArray(inputArray,currentIndex); // DICTID
		currentIndex += 4;
	}else{
		//
	}

	if(FLEVEL==0){
//		console.log("compression = fastest algorithm");
	}else if(FLEVEL==1){
//		console.log("compression = fast algorithm");
	}else if(FLEVEL==2){
//		console.log("compression = default algorithm");
	}else if(FLEVEL==3){
//		console.log("compression = maximum, slowest");
	}
}else{

}

	// decompressed output bytes
	//var outputBytes = new Uint8Array(); // can't add dynamically
	var outputBytes = new Array();
	var currentOutputBitIndex = 0;

	var compressedDataOffset = currentIndex;
	var compressedDataLength = length - 4 - (compressedDataOffset);
//	console.log("uncompress data: @"+compressedDataOffset+" -> "+compressedDataLength+" ================================================= ");
//	console.log(inputArray[currentIndex]);


var should = 0;
var currentBitIndex = compressedDataOffset*8;
var isLastBlock = false
var blockCount = 0;
while(!isLastBlock){
//	console.log("block: "+blockCount+".............................");
	++blockCount;
	if(blockCount>25){
		break;
	}

		// READ BLOCK HEADER

//		console.log("read block at bit: "+currentBitIndex+" ( "+compressedDataOffset+" bytes ) ");
		// LZ77 starts at LSB of Byte:
		// block begins with 3 header bits : BFINAL=1 | BTYPE=2
		var bfinal = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 1, true); currentBitIndex += 1; // first bit -- BFINAL == 1 if last black
		var btype = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 2, true); currentBitIndex += 2; // next 2 bits -- 00==no compression, 01==fixed huffman, 10==dynamic huffman, 11 = N/A
//		console.log(" _ BFINAL: "+bfinal+"  BTYPE:"+btype+"...........................................................................");
	isLastBlock = bfinal==1;

	var huffmanTreeLiterals = null;
	var huffmanTreeDistances = null;



		if(btype==0x3){
			console.log("error, type 0b0011 reserved");
			
		}else if(btype==0x0){
			console.log("btype == 0 = NO COMPRESSION");
			/*
			// ignore bits up to next byte boundary
			//var next = currentBitIndex+1;
			var byt = inputArray[next];
			console.log("TO READ: "+byt ); //  215 = 1101|0111
			var len = Compress.readNBitsFromBytes(inputArray, currentBitIndex 16, true);// first 2 bytes - LEN == number of bytes in data
			next += 2;
			var nlen = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 16, true);// next 2 bytes - NLEN = 1s compliment of LEN
			console.log("LEN: "+len+" | NLEN:"+nlen);
			// LEN: 55139 | NLEN:24672
		   // 9876543210987654321098765432109876543210
			*/

		}else if(btype==0x1 || btype==0x2){ // compressed
			var returnValue = Compress.literalAndDistanceHuffmanTreesFromCompressed(btype, inputArray, currentBitIndex);
			var huffmanTreeLiterals = returnValue["literalTree"];
			var huffmanTreeDistances = returnValue["distanceTree"];
			currentBitIndex = returnValue["nextBitIndex"];
		}else{ // 11
			console.log("RESERVED TYPE 11 - ERROR");
			return null;
		}

		// lengths: 257 -> 285
		var huffman_code_length_extra_bits = [0,0,0,0,0,0,0,  0, 1, 1, 1, 1, 2, 2,  2,  2,  3,  3,  3,  3,   4,   4,   4,   4,   5,   5,   5,    5,    0]; 
		var huffman_code_length_start = [3,4,5,6,7,8,9, 10,11,13,15,17,19,23, 27, 31, 35, 43, 51, 59,  67,  83,  99, 115, 131, 163, 195,  227,  258];
		// distances: 0 -> 29
		var huffman_code_distance_extra_bits = [0,0,0,0,1,1,2,  2, 3, 3, 4, 4, 5, 5,  6,  6,  7,  7,  8,  8,   9,   9,  10,  10,  11,  11,  12,   12,   13,   13];
		var huffman_code_distances_start = [1,2,3,4,5,7,9, 13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577]; // to 32768

	var count = 0;
	while(true){
	//	console.log("READING ------------------------------------------------------------ "+currentBitIndex+"         WRITE INDEX: "+currentOutputBitIndex+" ("+(currentOutputBitIndex/8)+")");
		// if(count>1E10){
		// 	break;
		// }
		var symbol = Compress.readSymbolWithHuffmanTree(inputArray,currentBitIndex,huffmanTreeLiterals);
		if(!symbol){
			console.log(huffmanTreeLiterals);
			console.log(huffmanTreeLiterals.toString());
			console.log( Compress.printHuffmanTree(huffmanTreeLiterals) );
			return null;
		} // bad tree error
		var symbolValue = symbol["symbol"];
		var symbolBinary = symbol["binaryCode"];
		var symbolBitLength = symbol["bitLength"];
	 	currentBitIndex += symbolBitLength;
		if(symbolValue<=255){ // alphabet
			//Compress.writeNBitsToBytes = function(outputArray, offsetOutputBits, sourceBits, lengthBits, fromLSB){
			//currentOutputBitIndex += Compress.writeNBitsToBytes(outputBytes, currentOutputBitIndex, symbolValue, symbolBitLength, false); // this is a byte?
			currentOutputBitIndex += Compress.writeNBitsToBytes(outputBytes, currentOutputBitIndex, symbolValue, 8, false); // this is a byte?
should += 8;
		}else if(symbolValue==256){ // done
//			console.log("DONE");
			break;
		}else if(257<=symbolValue && symbolValue<=285){ // <length, backwards>
			// LENGTH
			var lengthLookupIndex = symbolValue - 257;
			var lengthBase = huffman_code_length_start[lengthLookupIndex];
			var lengthMoreBits = huffman_code_length_extra_bits[lengthLookupIndex];
			var lengthExtra = Compress.readNBitsFromBytes(inputArray, currentBitIndex, lengthMoreBits, true); currentBitIndex += lengthMoreBits;
			var lengthTotal = lengthBase + lengthExtra;
//console.log("length tot: "+lengthTotal);

			// DISTANCE
			var symbolDistance = Compress.readSymbolWithHuffmanTree(inputArray,currentBitIndex,huffmanTreeDistances);
			var distanceValue = symbolDistance["symbol"];
			var distanceBinary = symbolDistance["binaryCode"];
			var distanceBitLength = symbolDistance["bitLength"];
 			currentBitIndex += distanceBitLength;
			// LOOKUP
			var distanceStart = huffman_code_distances_start[distanceValue];
			var moreBitsDistance = huffman_code_distance_extra_bits[distanceValue];
			var extraBits = Compress.readNBitsFromBytes(inputArray, currentBitIndex, moreBitsDistance, true); currentBitIndex += moreBitsDistance;
			var distanceTotal = distanceStart + extraBits;
			// amount is in bytes
			distanceTotal = distanceTotal * 8;
			lengthTotal = lengthTotal * 8;
//console.log("distance  tot: "+distanceTotal);
//console.log("---> <"+lengthTotal+", ",distanceTotal+">");
			// copy bits
			var startRead = currentOutputBitIndex - distanceTotal;
			var lengthRead = lengthTotal;
			should += lengthRead;

			// for(j=0; j<lengthRead; ++j){
			// 	var bit = Compress.readNBitsFromBytes(outputBytes, startRead+j, 1, true);
			// 	currentOutputBitIndex += Compress.writeNBitsToBytes(outputBytes, currentOutputBitIndex, 1, 1, false); 
			// }
startRead /= 8;
lengthRead /= 8;
			for(j=0; j<lengthRead; ++j){
				var byt = outputBytes[startRead+j];
				//console.log(startRead,outputBytes.length,currentOutputBitIndex/8);
				//console.log(outputBytes[Math.floor(currentOutputBitIndex/8 + j)] , byt);
				outputBytes.push(byt);
				//outputBytes[Math.floor(currentOutputBitIndex/8 + j)] = byt;
				currentOutputBitIndex += 8;
should += 8;
			}

			// var resultRead = Compress.readNBitsFromBytes(outputBytes, startRead, lengthRead, true);
			// // paste bits
			// currentOutputBitIndex += Compress.writeNBitsToBytes(outputBytes, currentOutputBitIndex, resultRead, lengthRead, false); // this is a byte multiple
		}else{
			console.log("dunno");
		}		
	++count;
	}
} // end for each block
	
 	// ADLER32 = uncompressed data checksum
 	var adlerLocation = Math.ceil(currentBitIndex/8)*8; // skip up to nearest byte
	var adler32 = Compress.readNBitsFromBytes(inputArray, adlerLocation, 32, false);
		currentBitIndex = adlerLocation + 32;
	//console.log(" ADLER32 FOUND: "+adler32+" @ "+);
	var computedAdler32 = Compress.adler32(outputBytes, 0, outputBytes.length);
//	console.log(" ADLER32 CHECKSUM: "+adler32+" / "+computedAdler32+" @ "+adlerLocation);
	if(adler32 != computedAdler32){
		console.log("ADLER32 CHECKSUM NOT MATCH: "+adler32+" | "+computedAdler32);
//		return null;
	}

var totalReadBits = currentBitIndex - offset*8;
var totalReadBytes = Math.ceil(totalReadBits/8);
	// console.log("FINAL LOCATION: "+currentBitIndex+" / "+(inputArray.length*8)+"    read: "+totalReadBits+" bits (~"+totalReadBytes+" bytes)");
	// console.log("FINAL WRITTEN BITS: "+currentOutputBitIndex+" = "+Math.ceil(currentOutputBitIndex/8)+" bytes || "+outputBytes.length);

	return outputBytes;
}




Compress.literalAndDistanceHuffmanTreesFromCompressed = function(compressionType, inputArray, currentBitIndex){ // 0x1 or 02 compression type
	var huffmanTreeLiterals;
	var huffmanTreeDistances;
	if(compressionType==0x1){ // fixed huffman
		// generate literal code length array:
		var huffman_code_literal_values = [0,144,256,280,288];
		var huffman_code_literal_bits = [8,9,7,8];

		var literalCodeLengths = [];
		var literalIndex = 0;
		var bitCount = huffman_code_literal_bits[literalIndex];
		var literal = huffman_code_literal_values[literalIndex];
		while(literalIndex<huffman_code_literal_values.length-1){
			if(literal>=huffman_code_literal_values[literalIndex+1]){
				++literalIndex;
				literal = huffman_code_literal_values[literalIndex];
				bitCount = huffman_code_literal_bits[literalIndex];
			}else{
				literalCodeLengths[literal] = bitCount;
				++literal;
			}
		}
		console.log(literalCodeLengths)
		var literalHuffmanCodes = Compress.huffmanCodesFromLengths(literalCodeLengths);
		console.log(literalHuffmanCodes)
		var literalHuffmanTree = Compress.huffmanTreeFromCodes(literalHuffmanCodes);
		console.log(literalHuffmanTree);


		// generate distance array + codes + tree
		var distanceCodeLengths = [];
		for(i=0; i<32; ++i){ // 0-29 used, 30-31 unused
			distanceCodeLengths[i] = 5;
		}
		var distanceHuffmanCodes = Compress.huffmanCodesFromLengths(distanceCodeLengths);
		console.log(distanceHuffmanCodes);
		var distanceHuffmanTree = Compress.huffmanTreeFromCodes(distanceHuffmanCodes);
		console.log(distanceHuffmanTree);

		huffmanTreeLiterals = literalHuffmanTree;
		huffmanTreeDistances = distanceHuffmanTree;

			// loooping...
	}else if(compressionType==0x2){ // dynamic huffman tables provided in data
		var huffman = [];
		var HLIT = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 5, true); currentBitIndex += 5;
			var codeLengthLiteralCount = HLIT + 257;
		var HDIST = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 5, true); currentBitIndex += 5;
			var codeLengthDistanceCount = HDIST + 1;
		var HCLEN = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 4, true); currentBitIndex += 4;
			var codeLengthsCodeCount = HCLEN + 4;
		var codeLengthValuesCount = codeLengthLiteralCount + codeLengthDistanceCount; // HLIT + HDSIT + 258
		// console.log("HLIT: "+HLIT);
		// console.log(" -> codeLengthLiteralCount: "+codeLengthLiteralCount);
		// console.log("HDIST: "+HDIST);
		// console.log(" -> codeLengthDistanceCount: "+codeLengthDistanceCount);
		// console.log("HCLEN: "+HCLEN);
		// console.log(" -> codeLengthsCodeCount: "+codeLengthsCodeCount);
		// console.log("codeLengthValuesCount: "+codeLengthValuesCount);

var codeAlphabetOrder = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]; // random permutation lookup table -- 19
var codeAlphabetOrderLength = codeAlphabetOrder.length;
			
		var i, j;
		var compressed_code_lengths = Code.newArrayZeros(codeAlphabetOrderLength);
		// CODE LENGTHS
		for(i=0; i<codeLengthsCodeCount; ++i){
			var bits = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 3, true); currentBitIndex += 3;
			//console.log(i+":   => "+bits);
			var index = codeAlphabetOrder[i]; // translate from read value to lookup table value
			compressed_code_lengths[index] = bits;
		}
		var compressed_huffman_codes = Compress.huffmanCodesFromLengths(compressed_code_lengths);
		var huffmanTree = Compress.huffmanTreeFromCodes(compressed_huffman_codes);
		// console.log("huffmanTree");
		// console.log(huffmanTree.toString());
		// console.log("huffman Tree Codes");
		// console.log( Compress.printHuffmanTree(huffmanTree) );

		// GET HUFFMAN CODES FROM LIST OF CODE LENGTHS
//		console.log("reading in literals and distances");
		// LITERAL LENGTHS //  USING HUFFMAN TREE CODES
var prevCodeLength = 0;
var codeLengths = null;
var codeLengthsLiterals = [];
var codeLengthsDistances = [];
			for(i=0; i<codeLengthValuesCount; ++i){
				if(i<codeLengthLiteralCount){
					codeLengths = codeLengthsLiterals;
				}else{
					codeLengths = codeLengthsDistances;
				}
				//console.log(i+" / "+codeLengthValuesCount);
				if(i<codeLengthLiteralCount){
					// literals & lengths sequence
				}else{
					// distance sequence
				}
// The code length repeat codes can cross from HLIT + 257 to the HDIST + 1 code lengths. In other words, all code lengths form a single sequence of HLIT + HDIST + 258 values.
				var symbol = Compress.readSymbolWithHuffmanTree(inputArray,currentBitIndex,huffmanTree);
				//console.log(symbol);
				if(!symbol){
					console.log("ERORR NO SYMBOL");
					break;
				}
				var value = symbol["symbol"];
				//console.log("   "+i+" : inside ->: "+value+"                                      "+Math.random());
				currentBitIndex += symbol["bitLength"];
				var bits;
				if(value<=15){ // code length of 0-15
					codeLengths.push(value);
					prevCodeLength = value;
				}else if(value==16){ // copy previous code length, 3-6 times
					// next 2 bits = repeat length
					bits = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 2, true); currentBitIndex += 2;
					var repeatLength = bits + 3;
					for(j=0; j<repeatLength; ++j){
						codeLengths.push(prevCodeLength);
					}
					i += repeatLength-1;
				}else if(value<=17){ // repeat code length 0, 3-10 times
					bits = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 3, true); currentBitIndex += 3;
					var repeatLength = bits + 3;
					for(j=0; j<repeatLength; ++j){
						//codeLengths.push(prevCodeLength);
						codeLengths.push(0);
					}
					i += repeatLength-1;
				}else if(value==18){ // repeat code length 0, 11-138 times
					//console.log("18");
					bits = Compress.readNBitsFromBytes(inputArray, currentBitIndex, 7, true); currentBitIndex += 7;
					var repeatLength = bits + 11;
					for(j=0; j<repeatLength; ++j){
						codeLengths.push(0);
					}
					i += repeatLength-1;
					prevCodeLength = 0; // is prev now 0 ?
				}
			}
			// console.log("COMPLETED LITERALS / DISTS: ");
			// console.log(codeLengthsLiterals+"");
			// console.log(codeLengthsDistances+"");

			// create huffman trees
//			console.log("COMPLETED READING IN LITERALS / DISTANCES:");
			var literalHuffmanCodes = Compress.huffmanCodesFromLengths(codeLengthsLiterals);
//			console.log(literalHuffmanCodes);
			var literalHuffmanTree = Compress.huffmanTreeFromCodes(literalHuffmanCodes);
//			console.log(literalHuffmanTree);

//console.log("distances");
			var distanceHuffmanCodes = Compress.huffmanCodesFromLengths(codeLengthsDistances);
//			console.log(distanceHuffmanCodes);
			var distanceHuffmanTree = Compress.huffmanTreeFromCodes(distanceHuffmanCodes);
//			console.log(distanceHuffmanTree);


			huffmanTreeLiterals = literalHuffmanTree;
			huffmanTreeDistances = distanceHuffmanTree;
		}else{
			return null;
		}
	return {"literalTree":huffmanTreeLiterals, "distanceTree":huffmanTreeDistances, "nextBitIndex":currentBitIndex}
}

Compress.printHuffmanTree = function(huffmanTree, table){
	var table = [];
	Compress._printHuffmanTree(huffmanTree, 0, 0, table);
	var i, key, val;
	var max = 0;
	var keys = Code.keys(table);
	var entries = keys.length;
	for(i=0; i<entries; ++i){
		key = keys[i];
		val = table[ key ];
			var count = val[0];
			var sym = val[1];
			var bits = val[2];
		max = Math.max(max,sym);
	}
	// print
	var str = "";
	for(i=0; i<entries; ++i){
		key = keys[i];
		val = table[key];
			var count = val[0];
			var sym = val[1];
			var bits = val[2];
		str = str + Code.prependFixed(""+i," ",4)+" : "+Code.prependFixed(""+Code.intToBinaryString(bits,count)," ",16)+" = "+Code.prependFixed(""+sym," ",6);
		str = str + "\n";
	}
	
	return str;
}
Compress._printHuffmanTree = function(node, bits, count, table){
	//console.log("   => "+count+" = "+node.data());
	if(node.left()){
		Compress._printHuffmanTree( node.left(),  ((bits<<1)|0), count+1, table);
	}
	if(node.right()){
		Compress._printHuffmanTree( node.right(), ((bits<<1)|1), count+1, table);
	}
	if(node.data()){
		table[bits] = [count,node.data(),bits];
	}
}

Compress.huffmanCodesFromLengths = function(huffmanCodeLengths){ // bit length frequency array
	var i, j;

	// STEP 1 - COUNT NUMBER OF CODE FOR EACH CODE LENGTH
	var maximumBits = Code.maxArray(huffmanCodeLengths);
	var bitLengthCounts = Code.newArrayZeros(maximumBits+1);
	for(var i=0; i<huffmanCodeLengths.length; ++i){
		bitLengthCounts[huffmanCodeLengths[i]]++;
	}
//	console.log("bitLengthCounts:")
//	console.log(bitLengthCounts)

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
	        }else{
	        	symbolList[i] = null;
	        }
	    }
	return symbolList;
}
Compress.writeNBitsToBytes = function(outputArray, offsetOutputBits, sourceBits, lengthBits, fromLSB){
	fromLSB = false;
	//console.log("writeNBitsToBytes: "+offsetOutputBits+" + "+lengthBits);
	if(lengthBits<=0){
		return 0;
	}
	var i, mask, offsetDestinationMask;
	var offsetOutputBytes = Math.floor(offsetOutputBits/8);
		var bitByteDiff = offsetOutputBits - offsetOutputBytes*8;
//console.log(offsetOutputBits+" / "+offsetOutputBytes+" = bitByteDiff: "+bitByteDiff)
	if(offsetOutputBytes>=outputArray.length){
		offsetOutputBytes[offsetOutputBytes] = 0x0;
	}
	if(!fromLSB){
//		offsetSourceMask = 0x01 << (lengthBits-1);
		offsetDestinationMask = 0x80 >> bitByteDiff;
		for(i=0; i<lengthBits; ++i){
//			console.log( lengthBits-i-1, offsetDestinationMask );
			var prevDestination = outputArray[offsetOutputBytes];
			var isOneSource = ((sourceBits>>(lengthBits-i-1)) & 0x01)==1;
//console.log("  write: "+(isOneSource ? 1 : 0));
			var nextDestination = isOneSource ? (prevDestination | offsetDestinationMask) : (prevDestination & (~offsetDestinationMask));
			outputArray[offsetOutputBytes] = nextDestination;
			offsetDestinationMask >>= 1;
//			offsetSourceMask >>= 1;
			if(offsetDestinationMask==0){
				offsetDestinationMask = 0x80;
				++offsetOutputBytes;
				if(i<lengthBits-1){
//					console.log("AT END -- add another:"+offsetOutputBytes);
					outputArray[offsetOutputBytes] = 0x0;
				}
			}
//			offsetSourceMask >>= 1;
		}
		return lengthBits;
	}
	return 0;
}

Compress.readSymbolWithHuffmanTree = function(byteArray,offset,huffman){
	var bit;
	var node = huffman;
	var c = 0;
	var bitSequence = 0;
	var read = 0;
	while(node){
		c++;
		if(c>32){
			break;
		}
		bit = Compress.readNBitsFromBytes(byteArray, offset+read, 1, true); read += 1;
//		console.log(c+": "+bit);
		bitSequence <<= 1;
		if(bit==0){
			node = node.left();
			bitSequence |= 0x0;
		}else{
			node = node.right();
			bitSequence |= 0x1;
		}
		//console.log(node);
		if(!node){
			console.log("error node is null for: "+bitSequence+"  --  "+Code.intToBinaryString(bitSequence,c));
			return null;
		}
		if(!node.hasChildren()){
		//if(node.data()){
			//console.log("    => found: "+Code.intToBinaryString(bitSequence,c) );
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
	//console.log("           reading bits:  @"+offsetBits+"   > "+lengthBits);
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
//value = value | (isOne << read);
			mask >>= 1;
			++read;
			if(mask==0){
				++index;
				mask = 0x80;
			}
		}
	}else{ // start from 0,1,...,6,7
		mask = 0x01 << startBit;
//console.log("                   startBit: "+startBit);
		while(read < lengthBits){
			//value = value << 1;
			byt = inputArray[index];
			isOne = (mask & byt) !=0 ? 1 : 0;
//console.log("read:   "+(isOne ? 1 : 0)+"                                 "+Code.getTimeStamp()+"_"+Math.random());
			//value = value | isOne;
			value = value | (isOne << read);
			mask <<= 1;
			++read;
			if(mask>=0x100){
				//console.log("          < flip");
				++index;
				mask = 0x01;
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
	//return ((s2 << 16) & 0xFFFF0000) | (s1 & 0x0000FFFF);
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




