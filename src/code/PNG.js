// PNG.js
// https://www.w3.org/TR/PNG/
// https://wiki.mozilla.org/APNG_Specification
function PNG(){
	this._width = null;
	this._height = null;
	this._frames = [];
}
PNG.prototype.width = function(w){
	if(w!==undefined){
		this._width = w;
	}
	return this._width;
}
PNG.prototype.height = function(h){
	if(h!==undefined){
		this._height = h;
	}
	return this._height;
}
PNG.prototype.isAnimated = function(){
	return this._frames.length > 1;
}
PNG.prototype.imageData = function(index){
	var frame = this.frame(index);
	if(frame){
		return frame.imageData();
	}
	return null;
}
PNG.prototype.frame = function(index, f){
	index = index!==undefined ? index : 0;
	if(0<=index && index<this._frames.length){
		if(f!=undefined){
			this._frames[index] = f;
		}
		return this._frames[index];
	}
	return null;
}
PNG.prototype.addFrame = function(frame){
	if(frame!=undefined){
		this._frames.push(frame);
	}
	return frame;
}
PNG.prototype.framesTotal = function(){
	return this._frames.length;
}
PNG.prototype.getIndependentImages = function(){
	// go thru animation & combine frames into separate image arrays
	return null;
}
PNG.Frame = function(){
	this._rect = new Rect();
	this._blendType = null;
	this._removeType = null;
	this._image = null;
	this._duration = 0;
}
PNG.Frame.prototype.width = function(w){
	if(w!==undefined){
		this._rect.width(w);
	}
	return this._rect.width();
}
PNG.Frame.prototype.height = function(h){
	if(h!==undefined){
		this._rect.height(h);
	}
	return this._rect.height();
}
PNG.Frame.prototype.x = function(x){
	if(x!==undefined){
		this._rect.x(x);
	}
	return this._rect.x();
}
PNG.Frame.prototype.y = function(y){
	if(y!==undefined){
		this._rect.y(y);
	}
	return this._rect.y();
}
PNG.Frame.prototype.imageData = function(data){
	if(data!==undefined){
		this._image = data;
	}
	return this._image;
}
PNG.Frame.prototype.duration = function(d){
	if(d!==undefined){
		this._duration = d;
	}
	return this._duration;
}
// --------------------------------------------------------------------------
PNG._MIMETYPE_1 = "image/png"; // internet media type
PNG._MIMETYPE_2 = "image/x-png"; 
PNG._MIMETYPE_APNG = "image/apng"; 
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
PNG._CHUNK_ACTL = [97,  99,  84,  76]; // acTL : ? - animation control
PNG._CHUNK_FCTL = [102, 99,  84,  76]; // fcTL : ? - frame control
PNG._CHUNK_FDAT = [102, 100, 65,  84]; // fdAT : ? - frame data
PNG._CHUNK_TYPE_ACTL = "actl";
PNG._CHUNK_TYPE_FCTL = "fctl";
PNG._CHUNK_TYPE_FDAT = "fdat";
//                                                                   3         2         1
//                                                                 210987654321098765432109876543210
PNG._CRC_BEGIN = 0x0; // 32 26 23 22 16 12 11 10 8 7 5 4 2 1 0 =  0b100000100110000010001110110110111
//                                                               0b011111011001111101110001001001000
PNG_APNG_DISPOSAL_OP_NONE = 0;
PNG_APNG_DISPOSAL_OP_BACKGROUND = 1;
PNG_APNG_DISPOSAL_OP_PREVIOUS = 2;
PNG_APNG_BLEND_OP_SOURCE = 0; // overwrite
PNG_APNG_BLEND_OP_OVER = 1; // blend (alpha)
//    0xedb88320
//    1110|1101|1011|1000|1000|0011|0010|0000




//PNG.binaryArrayToFloatARGB = function(binaryArray){
PNG.binaryArrayToPNG = function(binaryArray){
	console.log(binaryArray)
	if(!binaryArray){
		return null;
	}
	outputResult = {};
	outputResult["frameData"] = {};
	var len = binaryArray.length;
	var headerLen = PNG._HEADER_INT_LIST.length;
	if(len<PNG._HEADER_INT_LIST.length){
		console.log("exit A");
		return null;
	}
	var i, j, k, a, b;
	for(i=0; i<headerLen; ++i){

		a = binaryArray[i];
		b = PNG._HEADER_INT_LIST[i];
		console.log(a,b);
		if(a!==b){
			console.log("exit B");
			return null;
		}
	}

	var chunk = PNG._readChunk(binaryArray,i);
	console.log(chunk)
	while(chunk!=null){
		var redo = PNG._processChunk(chunk,binaryArray,outputResult);
		if(redo){
			continue;
		}
		i = chunk.next;
		console.log(" chunk: "+i+" / "+binaryArray.length);
		chunk = PNG._readChunk(binaryArray,i);
	}
	// put data into class structure
	var imagePNG = new PNG();
	imagePNG.width(outputResult["width"]);
	imagePNG.height(outputResult["height"]);
	// FRAMES
	var frames = outputResult["frames"];
	for(i=0; i<frames.length; ++i){
		var frame = frames[i];
		console.log("frame: "+i)
		console.log(frame)
		var imageFrame = new PNG.Frame();
			imageFrame.x(frame["offsetX"]);
			imageFrame.y(frame["offsetY"]);
			imageFrame.width(frame["width"]);
			imageFrame.height(frame["height"]);
			imageFrame.imageData( frame["image"] );
			console.log(frame["delay"])
			imageFrame.duration( frame["delay"] );
			imagePNG.addFrame(imageFrame);
	}
	return imagePNG;
}
PNG._processChunk = function(chunk,binaryArray,outputResult){
	var readyToProcessImage = false;
var returnValue = null;
var frameData = outputResult["frameData"];
	var i;
	var start = chunk.dataOffset; // length + header
	var length = chunk.dataLength;
	var end = start + length;
	//console.log("----------------------------------------------------------------------- start:"+start+" length: "+length);
	var type = chunk.type;
	console.log("type:                                               "+chunk.type);
	if(type==PNG._CHUNK_TYPE_IHDR){ // 4 | 4 | 1 | 1 | 1 | 1 | 1 = 13 bytes
		var width = Code.uint32FromByteArray(binaryArray,start+0);
		var height = Code.uint32FromByteArray(binaryArray,start+4);
		// var width = binaryArray[start+0]<<24 | 
		// 			binaryArray[start+1]<<16 | 
		// 			binaryArray[start+2]<<8 | 
		// 			binaryArray[start+3]<<0 ;
		// var height= binaryArray[start+4+0]<<24 | 
		// 			binaryArray[start+4+1]<<16 | 
		// 			binaryArray[start+4+2]<<8 | 
		// 			binaryArray[start+4+3]<<0 ;
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
		var witX = Code.uint32FromByteArray(binaryArray,start+0);
		var witY = Code.uint32FromByteArray(binaryArray,start+4);
		var redX = Code.uint32FromByteArray(binaryArray,start+8);
		var redY = Code.uint32FromByteArray(binaryArray,start+12);
		var grnX = Code.uint32FromByteArray(binaryArray,start+16);
		var grnY = Code.uint32FromByteArray(binaryArray,start+20);
		var bluX = Code.uint32FromByteArray(binaryArray,start+24);
		var bluY = Code.uint32FromByteArray(binaryArray,start+28);
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
	}else if(type==PNG._CHUNK_TYPE_IDAT || type==PNG._CHUNK_TYPE_FDAT){ // multiple IDATs are conactenated (as compressed) then decompressed as a single stream
		if(!outputResult["imageData"]){
			outputResult["imageData"] = [];
		}
		if(type==PNG._CHUNK_TYPE_IDAT){
			outputResult["imageData"].push([start,length])
		}else if(type==PNG._CHUNK_TYPE_FDAT){
			var sequenceNumber = Code.uint32FromByteArray(binaryArray,start);
			console.log("seq #:"+sequenceNumber)
			outputResult["imageData"].push([start+4,length-4])
		}
		console.log("IDAT: "+start+" : "+length+" ........................");
	}else if(type==PNG._CHUNK_TYPE_IEND){ // multiple IDATs are conactenated (as compressed) then decompressed as a single stream
		console.log("IEND");
		readyToProcessImage = true;
	}else if(type==PNG._CHUNK_TYPE_ACTL){ // APNG - animation control
		console.log("APNG - ACTL : "+binaryArray.length);
		var totalFrameCount = Code.uint32FromByteArray(binaryArray,start+0); // first 32 bits
		var totalLoopCount = Code.uint32FromByteArray(binaryArray,start+4); // second 32 bits
		totalFrameCount = totalFrameCount >>> 0;
		totalLoopCount = totalLoopCount >>> 0;
		console.log("  total frames: "+totalFrameCount);
		console.log("   loop count: "+totalLoopCount);
	}else if(type==PNG._CHUNK_TYPE_FCTL){ // APNG - frame control
		if(outputResult["imageData"] && outputResult["imageData"].length>0){ // has already filled in from other
			readyToProcessImage = true;
			returnValue = true;
			// process previous image data
		}else {
			console.log("APNG - FCTL");
			var sequenceNumber = Code.uint32FromByteArray(binaryArray,start+0);
			var frameWidth = Code.uint32FromByteArray(binaryArray,start+4);
			var frameHeight = Code.uint32FromByteArray(binaryArray,start+8);
			var frameXOffset = Code.uint32FromByteArray(binaryArray,start+12);
			var frameYOffset = Code.uint32FromByteArray(binaryArray,start+16);
			var frameDelayNumerator = Code.uint16FromByteArray(binaryArray,start+20);
			var frameDelayDenominator = Code.uint16FromByteArray(binaryArray,start+22);
				frameDelayDenominator = frameDelayDenominator!=0 ? frameDelayDenominator : 100;
			var frameDisposalOp = Code.uint8FromByteArray(binaryArray,start+24);
			var frameBlendOp  = Code.uint8FromByteArray(binaryArray,start+25);
			var frameDelay = frameDelayNumerator / frameDelayDenominator;
			console.log("    frame: "+sequenceNumber);
			console.log("    size: "+frameWidth+"x"+frameHeight+"    offset: "+frameXOffset+","+frameYOffset);
			console.log("    delay: "+frameDelay);
			console.log("    displsoal op: "+frameDisposalOp+"    blend op: "+frameBlendOp);
			frameData["offsetX"] = frameXOffset;
			frameData["offsetY"] = frameYOffset;
			frameData["width"] = frameWidth;
			frameData["height"] = frameHeight;
			frameData["delay"] = frameDelay;//frameDelayNumerator / frameDelayDenominator;
		}
	}else if(type==PNG._CHUNK_TYPE_FDAT){ // APNG - frame data
		console.log("APNG - FDAT");
	}else{
		console.log("unknown type: "+type);
	}


	if(readyToProcessImage){
		if(outputResult["imageData"]){
			console.log("new frame ++++++++++++++++++++++++++++++++++++++++++++++++ "+frameData["width"]+"x"+frameData["height"]);

			var imageData = PNG._processImage(outputResult,binaryArray, frameData["width"], frameData["height"]);
			if(!outputResult["frames"]){
				outputResult["frames"] = [];
			}

			var frame = {};
			frame["delay"] = frameData["delay"];
			frame["offsetX"] = frameData["offsetX"];
			frame["offsetY"] = frameData["offsetY"];
			frame["width"] = frameData["width"];
			frame["height"] = frameData["height"];
			frame["image"] = imageData["image"];
			
			outputResult["frames"].push(frame);
			Code.emptyArray( outputResult["imageData"] );
			outputResult["frameData"] = {};
		}
	}

	return returnValue;
}

PNG._processImage = function(outputResult, binaryArray, imageWidth, imageHeight){
	var imageData = outputResult["imageData"];
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

	var colorType = outputResult.colorType;
	var filterMethod = outputResult.filterMethod;
	// if filtered, inverse filter

	console.log("... DECOMPRESSING DATA ... : "+compressedImageData.length+" / "+totalDataLength+"              -----------------------------------------------------------------------------------------------------           ");
	var outputArray = [];
	var offsetOutput = 0;
	var decompressed = Compress.lz77Decompress(compressedImageData, 0, totalDataLength);
var imageWidthP1 = imageWidth + 1;
var outputDataArray = [];

var outputDataObject = {};
	outputDataObject["width"] = imageWidth;
	outputDataObject["height"] = imageHeight;
	outputDataObject["image"] = outputDataArray;
	var palette = outputResult["palette"];
	var alphaPallette = outputResult["alpha_palette"];
if(palette){
	for(i=0;i<decompressed.length;++i){
		var x = (i%imageWidthP1);
		var y = Math.floor(i/imageWidthP1);
		var index = decompressed[i];
		var color = palette[index];
		var r = color.x;
		var g = color.y;
		var b = color.z;
		var a = alphaPallette[index];
outputDataArray[i] = Code.getColARGB(a,r,g,b);
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
}else{ // only idat
	// INVERSE FILTERING
	var channels = Math.floor( decompressed.length/(imageHeight*imageWidth) ); // eg 4 = rgba | TODO: non-8-bit coloring scheme
console.log(channels,imageWidth,imageHeight);
	var out = new Array(channels*imageWidth*imageHeight);
	var channelGap = channels*8;
	var lineWidthOut = imageWidth*channels;
	var lineWidthIn = lineWidthOut + 1; // +1 for filter type
	var indexIn = 0;
	var indexOut = 0;
	for(j=0; j<imageHeight; ++j){
		var filterType = decompressed[indexIn++];
		if(filterType==0){ // N/A : recon(x) = filt(x)
			for(i=0; i<lineWidthOut; ++i){
				out[indexOut+i] = decompressed[indexIn+i];
			}
			indexOut += lineWidthOut;
			indexIn += lineWidthOut;
		}else if(filterType==1){ // SUB : recon(x) = filter(x) + recon(a)
			for(i=0; i<channels; ++i){ // first few bytes
				out[indexOut+i] = decompressed[indexIn+i];
			}
			for(i=channels; i<lineWidthOut; ++i){
				out[indexOut+i] = decompressed[indexIn+i] + out[indexOut + i - channels]; // prev pixel
				out[indexOut+i] = out[indexOut+i] & 0xFF;
			}
			indexOut += lineWidthOut;
			indexIn += lineWidthOut;
		}else if(filterType==2){ // UP : recon(x) = filter(x) + recon(b)
			for(i=0; i<channels; ++i){ // first few bytes
				out[indexOut+i] = decompressed[indexIn+i];
				out[indexOut+i] = out[indexOut+i] & 0xFF;
			}
			for(i=0; i<lineWidthOut; ++i){
				out[indexOut+i] = decompressed[indexIn+i] + out[indexOut + i - lineWidthOut]; // prev line
				out[indexOut+i] = out[indexOut+i] & 0xFF;
			}
			indexOut += lineWidthOut;
			indexIn += lineWidthOut;
		}else if(filterType==3){ // AVG : recon(x) = filt(x) + floor( (recon(a)+recon(b))/2 )
			for(i=0; i<lineWidthOut; ++i){
				out[indexOut+i] = decompressed[indexIn+i] + Math.floor( (out[indexOut + i - channels] + out[indexOut + i - lineWidthOut]) * 0.5 ); // prev pixel + prev line pixel
				out[indexOut+i] = out[indexOut+i] & 0xFF;
			}
			indexOut += lineWidthOut;
			indexIn += lineWidthOut;
		}else if(filterType==4){ // PAETH PREDICTOR : recon(x) = filt(x) + paeth(recon(a), recon(b), recon(c))
			for(i=0; i<channels; ++i){ // first few bytes
				out[indexOut+i] = decompressed[indexIn+i];
			}
			for(i=channels; i<lineWidthOut; ++i){
				out[indexOut+i] = decompressed[indexIn+i] + PNG.paethPredictor( out[indexOut + i - channels], out[indexOut + i - lineWidthOut], out[indexOut + i - channels - lineWidthOut]);
				out[indexOut+i] = out[indexOut+i] & 0xFF;
			}
			indexOut += lineWidthOut;
			indexIn += lineWidthOut;
		}else{
			console.log("unknown filter "+ filterType);
		}
	}
//  c b
//  a x
decompressed = out;
	var index = 0;
	var outIndex = 0;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
		var a = 0xFF;
		var r = decompressed[index++];
		var g = decompressed[index++];
		var b = decompressed[index++];
		if(channels==4){
			a = decompressed[index++];
		}
		if(index>decompressed.length){
			console.log("too far");
			break;
		}
outputDataArray[outIndex] = Code.getColARGB(a,r,g,b);
++outIndex;
		}
	}
}

return outputDataObject;

}
PNG.paethPredictor = function(a, b, c){
	var p = a + b - c;
	var pa = Math.abs(p - a); // b - c
	var pb = Math.abs(p - b); // a - c
	var pc = Math.abs(p - c); // a + b - 2c
	if(pa<=pb && pa<=pc){
		return a;
	}else if(pb<=pc){
		return b;
	}
	return c;
	
}

PNG._readChunk = function(binaryArray,offset,length){ // header:4 | length:4 | data:N | crc:4
	length = length!==undefined ? length : binaryArray.length;
	var i, j, k, a, b, found;
	if(offset+4>=length){ // no more headers can be read
		return null;
	}
	var chunkLength = Code.uint32FromByteArray(binaryArray,offset);
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
			var chunkCRC = Code.uint32FromByteArray(binaryArray,i);
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
		// APNG
		chunkTypes.push([PNG._CHUNK_ACTL,PNG._CHUNK_TYPE_ACTL]);
		chunkTypes.push([PNG._CHUNK_FCTL,PNG._CHUNK_TYPE_FCTL]);
		chunkTypes.push([PNG._CHUNK_FDAT,PNG._CHUNK_TYPE_FDAT]);
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





PNG.arrayARGB32ToBinaryArray = function(imageColorsARGB32){
		// choose palette or IDAT
			// choose compressions
		// 
	var outputBytes = [];
	// create chunks
		// create header
		// calculate CRC32
	// combine into array
	// convert array to UINT8
	return outputBytes;
}


// JPEG: https://www.w3.org/Graphics/JPEG/itu-t81.pdf



