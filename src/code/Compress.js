// Compress.js
function Compress(){
	//
}
// http://www.ietf.org/rfc/rfc1950.txt
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
	var flags = inputArray[offset+0];
	var checks = inputArray[offset+1];
	console.log("flags: "+flags);
	console.log("checks: "+checks);
	//


	var outputTable = {};
	return outputTable;
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

