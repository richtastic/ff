// PNG.js
// https://www.w3.org/TR/PNG/
function PNG(){
	//
}
// --------------------------------------------------------------------------
PNG._MIMETYPE_1 = "image/png"; // internet media type
PNG._MIMETYPE_2 = "image/x-png"; 
// DATASTREAM HEADER:  0/00  P   N   G   \r  \n SUB? \n
PNG._HEADER_INT_LIST = [137, 80, 78, 71, 13, 10, 26, 10];
PNG._CHUNK_IHDR = [73,  72,  68,  82]; // IHDR :  73  72  68  82 - image header
PNG._CHUNK_PLTE = [80,  76,  84,  69]; // PLTE :  80  76  84  69 - RGB palette
PNG._CHUNK_IDAT = [73,  68,  65,  84]; // IDAT :  73  68  65  84 - image data output from compression algorithm
PNG._CHUNK_IEND = [73,  69,  78,  68]; // IEND :  73  69  78  68 - end of image trailer
PNG._CHUNK_TRNS = [116, 82,  78,  83]; // tRNS : 116  82  78  83 - transparency / alpha table
PNG._CHUNK_CHRM = [99,  72,  82,  77]; // cHRM :  99  72  82  77 - chromaticities
PNG._CHUNK_GAMA = [103, 65,  77,  65]; // gAMA : 103  65  77  65 - gamma output intensities
PNG._CHUNK_ICCP = [105, 67,  67,  80]; // iCCP : 105  67  67  80 - embedded icc profile - international color consortium
PNG._CHUNK_SBIT = [115, 66,  73,  84]; // sBIT : 115  66  73  84 - significant bits to use for sample depths
PNG._CHUNK_SRGB = [115, 82,  71,  66]; // sRGB : 115  82  71  66 - standard r g b colorspace
PNG._CHUNK_TEXT = [116, 69,  88, 116]; // tEXt : 116  69  88 116 - keyword string combo
PNG._CHUNK_ITXT = [105, 84,  88, 116]; // iTXt : 105  84  88 116 - international textural keyword string combo
PNG._CHUNK_ZTXT = [122, 84,  88, 116]; // zTXt : 122  84  88 116 - compressed keyword string combo
PNG._CHUNK_BKGD = [98,  75,  71,  68]; // bKGD :  98  75  71  68 - background color
PNG._CHUNK_HIST = [104, 73,  83,  84]; // hIST : 104  73  83  84 - historgram usage frequency 
PNG._CHUNK_PHYS = [112, 72,  89, 115]; // pHYs : 112  72  89 115 - physical pixel dimensions
PNG._CHUNK_SPLT = [115, 80,  76,  86]; // sPLT : 115  80  76  86 - suggested palette 
PNG._CHUNK_TIME = [116, 73,  77,  69]; // tIME : 116  73  77  69 - time last modified in UTC
PNG._CHUNK_TYPE_UNKNOWN = "????";
PNG._CHUNK_TYPE_IHDR = "ihdr";
PNG._CHUNK_TYPE_PLTE = "plte";
PNG._CHUNK_TYPE_IDAT = "idat";
PNG._CHUNK_TYPE_IEND = "iend";
PNG._CHUNK_TYPE_TRNS = "trns";
PNG._CHUNK_TYPE_CHRM = "chrm";
PNG._CHUNK_TYPE_GAMA = "gama";
PNG._CHUNK_TYPE_ICCP = "iccp";
PNG._CHUNK_TYPE_SBIT = "sbit";
PNG._CHUNK_TYPE_SRGB = "srgb";
PNG._CHUNK_TYPE_TEXT = "text";
PNG._CHUNK_TYPE_ITXT = "itxt";
PNG._CHUNK_TYPE_ZTXT = "ztxt";
PNG._CHUNK_TYPE_BKGD = "bkgd";
PNG._CHUNK_TYPE_HIST = "hist";
PNG._CHUNK_TYPE_SPLT = "splt";
PNG._CHUNK_TYPE_TIME = "time";
// APNG:
PNG._CHUNK_ACTL = [97,  99,  84,  76]; // acTL : ? - animation controle
PNG._CHUNK_FCTL = [102, 99,  84,  76]; // fcTL : ? - frame control
PNG._CHUNK_FDAT = [102, 100, 65,  84]; // fdAT : ? - frame data
PNG._CHUNK_TYPE_ACTL = "actl";
PNG._CHUNK_TYPE_FCTL = "fctl";
PNG._CHUNK_TYPE_FDAT = "fdat";
//                                                                   3         2         1
//                                                                 210987654321098765432109876543210
PNG._CRC_BEGIN = 0x0; // 32 26 23 22 16 12 11 10 8 7 5 4 2 1 0 =  0b100000100110000010001110110110111
//                                                               0b011111011001111101110001001001000
//                                                                                       
//    0xedb88320
//    1110|1101|1011|1000|1000|0011|0010|0000




PNG.binaryArrayToFloatARGB = function(binaryArray){
	console.log(binaryArray)
	if(!binaryArray){
		return null;
	}
	var outputResult = {};
	var len = binaryArray.length;
	console.log("length: "+len);
	var headerLen = PNG._HEADER_INT_LIST.length;
	if(len<PNG._HEADER_INT_LIST.length){
		return null;
	}
	var i, j, k, a, b;
	for(i=0; i<headerLen; ++i){
		a = binaryArray[i];
		b = PNG._HEADER_INT_LIST[i];
		if(a!==b){
			return null;
		}
	}
	var chunk = PNG._readChunk(binaryArray,i);
	while(chunk!=null){
		PNG._processChunk(chunk,binaryArray,outputResult);
		i = chunk.next;
		console.log(" chunk: "+i+" / "+binaryArray.length);
		chunk = PNG._readChunk(binaryArray,i);
	}
	PNG._processImage(outputResult,binaryArray);

	//console.log("DO SOME STUFF: "+i);
	return null;
	
	// console.log("end of data = CRC: "+(i + 13)+"+(i + 13");
	// for(i=0; i<len; ++i){
	// 	console.log("i:"+i+" = "+binaryArray[i])
	// }
	// return outputResult;
}
PNG._processChunk = function(chunk,binaryArray,outputResult){
	var i;
	var start = chunk.dataOffset; // length + header
	var length = chunk.dataLength;
	var end = start + length;
	//console.log("----------------------------------------------------------------------- start:"+start+" length: "+length);
	var type = chunk.type;
	console.log("type:                                               "+chunk.type);
	if(type==PNG._CHUNK_TYPE_IHDR){ // 4 | 4 | 1 | 1 | 1 | 1 | 1 = 13 bytes
		var width = binaryArray[start+0]<<24 | 
					binaryArray[start+1]<<16 | 
					binaryArray[start+2]<<8 | 
					binaryArray[start+3]<<0 ;
		var height= binaryArray[start+4+0]<<24 | 
					binaryArray[start+4+1]<<16 | 
					binaryArray[start+4+2]<<8 | 
					binaryArray[start+4+3]<<0 ;
		var bitDepth = binaryArray[start+8];
		var colorType = binaryArray[start+9];
		var compressionMethod = binaryArray[start+10];
		var filterMethod = binaryArray[start+11];
		var interlaceMethod = binaryArray[start+12];
		outputResult["width"] = width;
		outputResult["height"] = height;
		outputResult["bitDepth"] = bitDepth;
		outputResult["colorType"] = colorType;
		outputResult["compressionMethod"] = compressionMethod;
		outputResult["filterMethod"] = filterMethod;
		outputResult["interlaceMethod"] = interlaceMethod;
		console.log("IHDR: "+width+"x"+height+" bd:"+bitDepth+" ct:"+colorType+" cm:"+compressionMethod+" fm:"+filterMethod+" im:"+interlaceMethod);
	}else if(type==PNG._CHUNK_TYPE_TEXT){
		var stringList = outputResult["text"];
		if(stringList===undefined){
			stringList = [];
			outputResult["text"] = stringList;
		}
		var str = "";
		var keywordValuePair = {};
		for(i=start;i<end;++i){
			var v = binaryArray[i];
			if(v==0){
				if(str!=""){
					keywordValuePair["key"] = str;
				} 
				str = "";
			}else{
				var c = String.fromCharCode(v);
				str += c;
			}
		}
		keywordValuePair["value"] = str;
		console.log("TEXT: "+keywordValuePair["key"]+" = "+keywordValuePair["value"]);
		stringList.push(keywordValuePair);
	}else if(type==PNG._CHUNK_TYPE_GAMA){ // = 4
		var gamma = Code.uint32FromByteArray(binaryArray,start+0);
		outputResult["gamma"] = gamma;
		console.log("GAMA: "+gamma);
	}else if(type==PNG._CHUNK_TYPE_CHRM){ // 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 = 32
		var witX = Code.uint16FromByteArray(binaryArray,start+0);
		var witY = Code.uint16FromByteArray(binaryArray,start+4);
		var redX = Code.uint16FromByteArray(binaryArray,start+8);
		var redY = Code.uint16FromByteArray(binaryArray,start+12);
		var grnX = Code.uint16FromByteArray(binaryArray,start+16);
		var grnY = Code.uint16FromByteArray(binaryArray,start+20);
		var bluX = Code.uint16FromByteArray(binaryArray,start+24);
		var bluY = Code.uint16FromByteArray(binaryArray,start+28);
		outputResult["chromaticity"] = {"wit":new V2D(witX,witY),
										"red":new V2D(redX,redY),
										"grn":new V2D(grnX,grnY),
										"blu":new V2D(bluX,bluY),};
		console.log("CHRM: "+witX+","+witY+" | "+redX+","+redY+" | "+grnX+","+grnY+" | "+bluX+","+bluY+"");
	}else if(type==PNG._CHUNK_TYPE_PLTE){
		var colorType = outputResult.colorType;
		if(length%3==0){// && colorType==3){ // 3 | 2,6
			var i, j, red, grn, blu;
			var table = [];
			for(i=0,j=0;i<length;i+=3,j+=1){
				red = binaryArray[start+i+0];
				grn = binaryArray[start+i+1];
				blu = binaryArray[start+i+2];
				table[j] = new V3D(red,grn,blu);
			}
			outputResult["palette"] = table;
			console.log("PLTE: table="+(length/3));
		}else{
			console.log("PLTE: ERROR: "+length+" | "+colorType);
		}
	}else if(type==PNG._CHUNK_TYPE_TRNS){
		var colorType = outputResult.colorType;
		if(length>=0){ // && colorType==3){ // 0,2,3
			var i, j, alp;
			var table = [];
			for(i=0;i<length;i+=1){
				alp = binaryArray[start+i];
				table[i] = alp;
			}
			// remaining assumed to be 0xFF
			outputResult["alpha_palette"] = table;
			console.log("TRNS: table="+length);
			// TODO - COMBINE ALPH AND COLOR PALETTES
		}else{
			console.log("TRNS: ERROR: "+length+" | "+colorType);
		}
	}else if(type==PNG._CHUNK_TYPE_BKGD){ // 0,4: 2  /  2,6: 
		var colorType = outputResult.colorType;
		if(length==1 && colorType==3){ // 3
			var index = binaryArray[start+0];
			console.log("BKGD: index="+index);
			outputResult["backgroundIndex"] = index;
		}else if(length==2 && (colorType==0||colorType==4)){ // 0,4
			var gry = Code.uint16FromByteArray(binaryArray,start+0);
			outputResult["backgroundColor"] = new V3D(gry,gry,gry);
			console.log("BKGD: "+gry);
		}else if(length==6 && (colorType==2||colorType==6)){ // 2,6
			var red = Code.uint16FromByteArray(binaryArray,start+0);
			var grn = Code.uint16FromByteArray(binaryArray,start+2);
			var blu = Code.uint16FromByteArray(binaryArray,start+4);
			outputResult["backgroundColor"] = new V3D(red,grn,blu);
			console.log("BKGD: "+red+","+grn+","+blu);
		}else{
			console.log("BKGD: BAD BG TYPE");
		}
	}else if(type==PNG._CHUNK_TYPE_TIME){ // 2 | 1 | 1 | 1 | 1 | 1 = 7
		var year = binaryArray[start+0]<<8 | binaryArray[start+1]<<0;
		var month = binaryArray[start+2];
		var day = binaryArray[start+3];
		var hour = binaryArray[start+4];
		var minute = binaryArray[start+5];
		var second = binaryArray[start+6];
		var millisecond = 0;
		var time = Date.UTC(year, month, day, hour, minute, second, millisecond);
		outputResult["modified"] = time;
		console.log("TIME: "+year+" "+month+" "+day+" "+hour+" "+minute+" "+second+"  = "+time);
	}else if(type==PNG._CHUNK_TYPE_IDAT){ // multiple IDATs are conactenated (as compressed) then decompressed as a single stream
		var idatList = outputResult["imageData"]
		if(!idatList){
			idatList = [];
			outputResult["imageData"] = idatList;
		}
		outputResult["imageData"].push([start,length])
		console.log("IDAT: "+start+" : "+length);
	}else if(type==PNG._CHUNK_TYPE_IEND){ // multiple IDATs are conactenated (as compressed) then decompressed as a single stream
		console.log("IEND");
	}else{
		console.log("unknown type: "+type);
	}
	// switch(type){
	// 	PNG._CHUNK_TYPE_IHDR:
	// 		console.log("found ihdr");
	// 		break;
	// 	default:
	// 		console.log("unknown type: "+type);
	// }
}

PNG._processImage = function(outputResult, binaryArray){
	var imageData = outputResult["imageData"]
	if(!imageData || imageData.length==0){ // empty image data
		return null;
	}
	var i, j, index;
	// combine all idata into single stream
	console.log("  . combining compressed image data: "+imageData);
	var totalDataLength = 0;
	for(i=0; i<imageData.length; ++i){
		totalDataLength += imageData[i][1];
	}
	var compressedImageData = new Uint8Array(totalDataLength);
	index = 0;
	for(i=0; i<imageData.length; ++i){
		var start = imageData[i][0];
		var length = imageData[i][1];
		var end = start + length;
		for(j=start; j<end; ++j){
			compressedImageData[index] = binaryArray[j];
			++index;
		}
	}
	console.log(" compressed data length: "+compressedImageData.length);

	var colorType = outputResult.colorType;
	var filterMethod = outputResult.filterMethod;
	// if filtered, inverse filter

	console.log("... DECOMPRESSING LZ77 ... : "+compressedImageData.length+" / "+totalDataLength+"              -----------------------------------------------------------------------------------------------------           ");
	//console.log(compressedImageData);

//Compress.writeNBitsToBytes = function(outputArray, offsetOutputBits, sourceBits, lengthBits, fromLSB){
	var outputArray = [];
	var offsetOutput = 0;

// TESTING WRITING BITS
// 	offsetOutput += Compress.writeNBitsToBytes(outputArray, offsetOutput, 0x00000002, 4, false);
// 	console.log(offsetOutput);
// 	offsetOutput += Compress.writeNBitsToBytes(outputArray, offsetOutput, 0x00000013, 8, false);
// 	console.log(offsetOutput);
// 	offsetOutput += Compress.writeNBitsToBytes(outputArray, offsetOutput, 0x00000044, 6, false);
// 	console.log(offsetOutput);
// 	console.log(outputArray);
// 	// 00000010|00010011|01000100
// 	// 00100001|00110100|0100000 = 33 | 3
// return;

	var decompressed = Compress.lz77Decompress(compressedImageData, 0, totalDataLength);

var stage = GLOBALSTAGE;

var imageWidth = outputResult["width"];
var imageHeight = outputResult["height"];
var imageWidthP1 = imageWidth + 1;

	console.log("outputResult")
	console.log(outputResult)
	console.log(imageWidth+"x"+imageHeight);
	var palette = outputResult["palette"];
	var alphaPallette = outputResult["alpha_palette"];

	console.log(palette)
	console.log(alphaPallette)

	console.log("got decompressed data:"+decompressed.length);
var d = new DO();
stage.addChild(d);
var size = 5;
	for(i=0;i<decompressed.length;++i){
		var x = (i%imageWidthP1);
		var y = Math.floor(i/imageWidthP1);
		// var x = (i%imageHeight);
		// var y = Math.floor(i/imageHeight);
		//console.log(x,y)
		var index = decompressed[i];
		//console.log(index);
		var color = palette[index];
		//console.log(color);
		var r = color.x;
		var g = color.y;
		var b = color.z;
		var a = alphaPallette[index];
		//a = 0xFF;
		color = Code.getColARGB(a,r,g,b);
		d.graphics().setFill(color);
		d.graphics().beginPath();
		d.graphics().drawRect(x*size,y*size,size,size);
		d.graphics().endPath();
		d.graphics().fill();

		//console.log(decompressed[i]);
	}
	// interlace method
	// 0 = left-right sequentially
	// 1 = scanline
	// 
	// bit depth
	// # of bits per color
	// 
	// color type
	// 0 == grayscale
	// 2 == truecolor
	// 3 == indexed
	// 4 == grayscale+alpha
	// 6 == truecolor+alpha


	// 10x8 = 80 entries exected for A) indexes, B)true-color
	/*
	45 = 101101
		= 6 bits
		6 * 10*8 = 480 / 8 = 60
	*/


	
	//console.log("IDAT: "+decompressed.length);
}

PNG._readChunk = function(binaryArray,offset,length){ // header:4 | length:4 | data:N | crc:4
	length = length!==undefined ? length : binaryArray.length;
	var i, j, k, a, b, found;
	if(offset+4>=length){ // no more headers can be read
		return null;
	}
	var chunkLength =	(binaryArray[offset+3]<<0 ) |
						(binaryArray[offset+2]<<8 ) |
						(binaryArray[offset+1]<<16) |
						(binaryArray[offset+0]<<24);
	var fullChunkLength = chunkLength;
	if(offset+8>=length){
		console.log("WHAT DOES THIS MEAN?");
		// ????
	}else{
		fullChunkLength += 4 + 4 + 4;
		var dataOffset = 4 + 4 + offset;
		var chunkHeader = [binaryArray[offset+4], binaryArray[offset+5], binaryArray[offset+6], binaryArray[offset+7]];
		var chunkData = [];
		for(i=offset+8, j=0; i<length && j<chunkLength; ++i, ++j){
			chunkData.push(binaryArray[i]);
		}
		if(i+4>=length){ // NO CRC
			//return null;
		}else { // CRC
			var chunkCRC = (binaryArray[i+0] <<24) |
							(binaryArray[i+1]<<16) |
							(binaryArray[i+2]<<8 ) |
							(binaryArray[i+3]<<0 );
			i += 4;
		}
	}
	var chunkType = PNG._chunkTypeFromArray(chunkHeader);
	console.log("  _ chunk: "+chunkHeader+" ("+chunkLength+") | "+chunkType);
	return {"length":fullChunkLength, "offset":offset, "type":chunkType, "chunk":chunkHeader, "data":chunkData, "dataOffset":dataOffset, "dataLength":chunkLength, "crc":chunkCRC, "next":i};
}
PNG._chunkTypeFromArray = function(array){
	var chunkTypes = PNG._chunkLookupTable();
	var i, len = chunkTypes.length;
	for(i=0; i<len; ++i){
		var header = chunkTypes[i][0];
		var type = chunkTypes[i][1];
		//console.log(array+" | "+header)
		if(Code.arrayEquality(array,header)){
			return type;
		}
	}
	return PNG._CHUNK_TYPE_UNKNOWN;
}
PNG._chunkLookupTable = function(){
	if(PNG._CHUNK_LOOKUP_TABLE===undefined){
		var chunkTypes = [];
		chunkTypes.push([PNG._CHUNK_IHDR,PNG._CHUNK_TYPE_IHDR]);
		chunkTypes.push([PNG._CHUNK_PLTE,PNG._CHUNK_TYPE_PLTE]);
		chunkTypes.push([PNG._CHUNK_IDAT,PNG._CHUNK_TYPE_IDAT]);
		chunkTypes.push([PNG._CHUNK_IEND,PNG._CHUNK_TYPE_IEND]);
		chunkTypes.push([PNG._CHUNK_TRNS,PNG._CHUNK_TYPE_TRNS]);
		chunkTypes.push([PNG._CHUNK_CHRM,PNG._CHUNK_TYPE_CHRM]);
		chunkTypes.push([PNG._CHUNK_GAMA,PNG._CHUNK_TYPE_GAMA]);
		chunkTypes.push([PNG._CHUNK_ICCP,PNG._CHUNK_TYPE_ICCP]);
		chunkTypes.push([PNG._CHUNK_SBIT,PNG._CHUNK_TYPE_SBIT]);
		chunkTypes.push([PNG._CHUNK_SRGB,PNG._CHUNK_TYPE_SRGB]);
		chunkTypes.push([PNG._CHUNK_TEXT,PNG._CHUNK_TYPE_TEXT]);
		chunkTypes.push([PNG._CHUNK_ITXT,PNG._CHUNK_TYPE_ITXT]);
		chunkTypes.push([PNG._CHUNK_ZTXT,PNG._CHUNK_TYPE_ZTXT]);
		chunkTypes.push([PNG._CHUNK_BKGD,PNG._CHUNK_TYPE_BKGD]);
		chunkTypes.push([PNG._CHUNK_HIST,PNG._CHUNK_TYPE_HIST]);
		chunkTypes.push([PNG._CHUNK_PHYS,PNG._CHUNK_TYPE_PHYS]);
		chunkTypes.push([PNG._CHUNK_SPLT,PNG._CHUNK_TYPE_SPLT]);
		chunkTypes.push([PNG._CHUNK_TIME,PNG._CHUNK_TYPE_TIME]);
		PNG._CHUNK_LOOKUP_TABLE = chunkTypes;
	}
	return PNG._CHUNK_LOOKUP_TABLE;
}
// (B,L)E -- go back B , copy length L, append explicit E


PNG.prototype._headerChunk = function(width,height,depth,colorType,compressionMethod,filterMethod,interlaceMethod){
	//
}

PNG.prototype._textKeywordChunk = function(title,author,description,copyright,created,software,disclaimer,warning,source,comment){
	//
}

