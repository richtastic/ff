// Compress.js
function Compress(){
	//
}
// http://www.ietf.org/rfc/rfc1950.txt
Compress.LZ77_FLG_FDICT = 0x00;
Compress.lz77Compress = function(inputArray, offset, length){
	if(!inputArray){ return null; }
	offset = offset!==undefined ? offset : 0;
	length = length!==undefined ? length : inputArray.length;
	var outputTable = {};
	return outputTable;
}
Compress.lz77Decompress = function(inputArray, offset, length){
	if(!inputArray){ return null; }
	offset = offset!==undefined ? offset : 0;
	length = length!==undefined ? length : inputArray.length;
	var cmf = inputArray[offset+0]; // CMF
		var compressionMethod = (cmf & 0x0F) >> 0;
		var compressionInfo = (cmf & 0xF0) >> 4;
	var flg = inputArray[offset+1]; // FLG
		var fcheck = (flg & 0x1F) >> 0;
		var fdict = (flg & 0x20) >> 5;
		var flevel = (flg & 0xC0) >> 6;
	var adler32 = Code.uint32FromByteArray(inputArray,offset+length-4); // ADLER32 = uncompressed data checksum
	var currentIndex = offset + 2;
	console.log("flags: "+flg);
		console.log("  "+fcheck+" | "+fdict+" | "+flevel);
	console.log("checks: "+cmf);
		console.log("  "+compressionMethod+" | "+compressionInfo);
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



	var outputTable = {};
	return outputTable;
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
	for(i=offset; i<length; ++i){
		c = inputArray[i];
		s1 = (s1 + c) % Compress.ADLER32_BASE;
		s2 = (s1+s2) % Compress.ADLER32_BASE;
	}
	return (s2 << 16) | s1;
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

