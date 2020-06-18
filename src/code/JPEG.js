// JPEG.js
// https://www.w3.org/TR/PNG/
// https://wiki.mozilla.org/APNG_Specification
function JPEG(){
	this._width = null;
	this._height = null;
}
JPEG.prototype.width = function(w){
	if(w!==undefined){
		this._width = w;
	}
	return this._width;
}
JPEG.prototype.height = function(h){
	if(h!==undefined){
		this._height = h;
	}
	return this._height;
}




JPEG.EXIF = function(imageDOM, callback, context){
	// console.log(imageDOM);
	var imageSRC = imageDOM.src;
	console.log(imageSRC);
	if(/^data\:/.test(imageSRC)){
		console.log("base 64 encoded");
		var binary = Code.base64StringToBinary(imageSRC);
		console.log(binary);
	}else{
		console.log("url");
		// Ajax.prototype.get = function(url,con,comp,params){
		var ajax = new Ajax();
		ajax.binary(true);
		ajax.get(imageSRC, JPEG.EXIF, function(data){
			console.log("got");
			console.log(typeof data);
			var info = JPEG.EXIFFomData(data);
			console.log(info);
		});
	}
}

// https://en.wikipedia.org/wiki/JPEG_File_Interchange_Format
// https://en.wikipedia.org/wiki/Exif
JPEG.EXIFFomData = function(binaryArray){
	var offset = 0;
	// SOI = 0xFFD8 | start of image
	var b0 = Code.uint16FromByteArray(binaryArray,offset+0);
	if( !(b0==0xFFD8) ){
		throw "start of image not found: "+b0;
	}
	offset += 2;

	// get APP0 & APP1 markers
	var item;
	var continueReading = true;
	var c = 5;
	var hashEXIF = {};
	while(continueReading && c>0){
		item = Code.uint8FromByteArray(binaryArray,offset+0);
		// console.log(item);
		console.log(Code.getHexNumber(item,2));


		// FFE0 = application marker

		if(!(item==0xFF)){
			console.log(item);
			throw "unexpected";
		}

		item = Code.uint8FromByteArray(binaryArray,offset+1);
		// console.log(item);
		console.log(Code.getHexNumber(item,2));

		var itemLength = Code.uint16FromByteArray(binaryArray,offset+2);
		console.log("itemLength: "+itemLength);
		offset += 2;
		if(item==0xE0){ // 224 = header / thumbnail
			console.log(">> thumbnail ? ");
			localOffset = offset+2;
			var identifier = Code.charStringFromByteArray(binaryArray,localOffset, 5); // JFIF\0
			console.log("identifier: "+identifier);
			localOffset += 5;
			var versionMajor = Code.uint8FromByteArray(binaryArray,localOffset);
			var versionMinor = Code.uint8FromByteArray(binaryArray,localOffset+1);
			console.log("version: "+versionMajor+"."+versionMinor);
			localOffset += 2;


			offset += itemLength;
		}else if(item==0xE1){ // 225 = 
			console.log(">> exif");
			// JPEG._EXIFFromOffset(binaryArray, offset+2,itemLength-2, hashEXIF);
			// console.log(hashEXIF);
			offset += itemLength;
			// console.log("DONE EXIF DATA");
			// continueReading = false;
			// break;
		}else if(item==0xEA){ // 234 = 
			// console.log( Code.getHexNumber(Code.uint8FromByteArray(binaryArray,offset+2),2) );//
			//  console.log(">> jpg image");
			console.log(">> EA ?");
			console.log(item);
			offset += itemLength;
		}else{
			console.log(">> other");
			console.log(item);
			offset += itemLength;
			throw "?"
		}


		--c;
	}

	
	var makerNote = hashEXIF["MakerNote"];
	console.log(makerNote)
	if(makerNote){
		var str = Code.charStringFromByteArray(makerNote, 0, 10);
		console.log(str);
	}


	throw "..."
	return null;
}

JPEG._EXIFFromOffset = function(binaryArray, offset, length, hash){
	var tagHash = hash;
	if(!tagHash){
		tagHash = {};
	}

	var header = Code.charStringFromByteArray(binaryArray,offset, 4);
	console.log("HEADER: "+header)
	if(header!="Exif"){
		throw "no header";
	}

	offset += 4;
	var x = Code.uint16FromByteArray(binaryArray,offset);
	console.log(x); // 4 zeros
	
	offset += 2;
	x = Code.uint16FromByteArray(binaryArray,offset);
	console.log(x); // 0x4D4D - tiff
	
	var offTIFF = offset;

	offset += 2;
	x = Code.uint16FromByteArray(binaryArray,offset);
	console.log(x); // 0x002A - tiff

	offset += 2;
	x = Code.uint32FromByteArray(binaryArray,offset);
	console.log(x); // 0x 0000|0008
	console.log(Code.getHexNumber(x,8));

	offset += 4;

	var keepReading = true;
	var c = 4;
	while(keepReading && c>0){
		var tagCount = Code.uint16FromByteArray(binaryArray,offset);
		console.log("tags: "+tagCount);

		offset += 2;
		var tagLookup = JPEG._EXIFTags;
		// IFD - image file directory
		console.log("tagCount: "+tagCount);
		for(var i=0; i<tagCount; ++i){ // CODE (2) | VALUE (10) 
			console.log("TAG ITEM "+i+"/"+tagCount);
			var offTag = offset + i*12;
			var tagInfo = JPEG._EXIFTagValue(binaryArray, offTag, offTIFF);
			console.log(tagInfo);
			// throw "?"
			var tagCode = tagInfo["key"];
			var tagKey = tagLookup[tagCode];
			var tagValue = tagInfo["value"];
			if(!tagKey){
				console.log("unknown tag: "+Code.getHexNumber(tagCode,4))
				continue;
			}
			console.log(tagKey+" = "+tagValue);
			tagHash[tagKey] = tagValue;
		}
		console.log("END FOR");;
		var exifOffset = tagHash[JPEG._EXIFTag_ExifOffset];
		var gpsOffset = tagHash[JPEG._EXIFTag_GPSOffset];
		if(exifOffset){
			console.log(" -------------------------------------------------------- ")
			console.log("exifOffset: "+exifOffset);
			delete tagHash[JPEG._EXIFTag_ExifOffset];
			offset = offTIFF + exifOffset;
			// throw "more"
		}else if(gpsOffset){
			console.log(" -------------------------------------------------------- ")
			console.log("gpsOffset: "+gpsOffset);
			delete tagHash[JPEG._EXIFTag_GPSOffset];
			offset = offTIFF + gpsOffset;
		}else{
			continueReading = false;
		}
		--c;
	}
	console.log("end tag while");
	return tagHash;
}

JPEG._EXIFTagValue = function(binaryArray, offsetTag, offsetTIFF){ // tag(2) | format(2) | components(4) | data(4)
	// key already found
	var tag = Code.uint16FromByteArray(binaryArray,offsetTag+0);
	var format = Code.uint16FromByteArray(binaryArray,offsetTag+2);
	var componentCount = Code.uint32FromByteArray(binaryArray,offsetTag+4);
	var dataOffset = Code.uint32FromByteArray(binaryArray,offsetTag+8);
		dataOffset += 0;
	console.log(" tag: "+ Code.getHexNumber(tag,2));
	console.log(" format: "+Code.getHexNumber(format,2));
	console.log(" componentCount: "+ Code.getHexNumber(componentCount,4));
	console.log(" dataOffset: "+Code.getHexNumber(dataOffset,4));
	// var offset = offsetTag + 8; // where the data would be
	var offsetData = offsetTIFF + dataOffset; // where the data would be
	var offsetInternal = offsetTag + 8;
	var value = null;
	var offset = null;
	switch(format){
		case 1: // unsigned byte -- same as 7
			if(componentCount==1){
				value = Code.uint8FromByteArray(binaryArray,offsetInternal);
			}else{
				console.log("many ?");
				value = [];
				offset = componentCount<=4 ? offsetInternal : offsetData;
				for(var i=0; i<componentCount; ++i){
					value[i] = Code.uint8FromByteArray(binaryArray, offset+i);
				}
			}
			break;
		case 2: // ascii strings
			value = Code.charStringFromByteArray(binaryArray,offsetData,componentCount-1);
			console.log(value);
			break;
		case 3: // unsigned short
			if(componentCount==1){
				value = Code.uint16FromByteArray(binaryArray,offsetInternal);
			}else{
				console.log("many ?");
				value = [];
				offset = componentCount<=2 ? offsetInternal : offsetData;
				for(var i=0; i<componentCount; ++i){
					value[i] = Code.uint16FromByteArray(binaryArray, offset+i*2);
				}
			}
			break;
		case 4: // unsigned long [int]
			if(componentCount==1){
				value = Code.uint32FromByteArray(binaryArray,offsetInternal);
			}else{
				throw "many"
			}
			break;
		case 5: // unsigned rational
			if(componentCount==1){
				var num = Code.uint32FromByteArray(binaryArray,offsetData);
				var den = Code.uint32FromByteArray(binaryArray,offsetData+4);
				value = {"num":num,"den":den,"value":(num/den)};
				// console.log(num+" / "+den+" = "+value);
			}else{
				value = [];
				offset = offsetData;
				for(var i=0; i<componentCount; ++i){
					var num = Code.uint32FromByteArray(binaryArray, offset+i*8);
					var den = Code.uint32FromByteArray(binaryArray, offset+i*8+4);
					value[i] = {"num":num,"den":den,"value":(num/den)};
				}
			}
			break;
		case 6: // unsigned signed byte
			throw "6";
			break;
		case 7: // unsigned undefined -- depends on tag
			if(componentCount==1){
				value = Code.uint8FromByteArray(binaryArray,offsetInternal);
			}else{
				console.log("many ?");
				value = [];
				offset = componentCount<=4 ? offsetInternal : offsetData;
				for(var i=0; i<componentCount; ++i){
					value[i] = Code.uint8FromByteArray(binaryArray, offset+i);
				}
			}
		break;
		case 8: // signed short
			throw "8";
			break;
		case 9: // signed long
			throw "9";
			break;
		case 10: // signed rational
			if(componentCount==1){
				var num = Code.int32FromByteArray(binaryArray,offsetData);
				var den = Code.int32FromByteArray(binaryArray,offsetData+4);
				value = {"num":num,"den":den,"value":(num/den)};
			}else{
				throw "many";
			}
			break;
		case 11: // sigle float
			throw "11";
			break;
		case 12: // double float
			throw "12";
			break;
		default: // 0, 13+
			console.log("unknown data format: "+Code.getHexNumber(format,2));
	}
	// throw "out _EXIFTagValue";
	return {"key":tag, "value":value};
}

// https://exiftool.org/TagNames/EXIF.html
// https://exiftool.org/TagNames/EXIF.html
JPEG._EXIFTag_ExifOffset = "ExifOffset";
JPEG._EXIFTag_GPSOffset = "GPSInfo";
JPEG._EXIFTags = {};


JPEG._EXIFTags[0x0005] = "GPS";


JPEG._EXIFTags[0x010F] = "Make";
JPEG._EXIFTags[0x0110] = "Model";
JPEG._EXIFTags[0x0112] = "Orientation";
JPEG._EXIFTags[0x011A] = "XResolution";
JPEG._EXIFTags[0x011B] = "YResolution";
JPEG._EXIFTags[0x0128] = "ResolutionUnit";
JPEG._EXIFTags[0x0131] = "Software";
JPEG._EXIFTags[0x0132] = "ModifyDate";
JPEG._EXIFTags[0x0213] = "YCbCrPositioning";
JPEG._EXIFTags[0x8769] = JPEG._EXIFTag_ExifOffset;//"ExifOffset";
JPEG._EXIFTags[0x8825] = JPEG._EXIFTag_GPSOffset;//"GPSInfo";
// JPEG._EXIFTags[0x] = "";
JPEG._EXIFTags[0x829A] = "ExposureTime";
JPEG._EXIFTags[0x829D] = "FNumber";
JPEG._EXIFTags[0x8822] = "ExposureProgram";
JPEG._EXIFTags[0x8827] = "ISOSpeedRatings";
JPEG._EXIFTags[0x9000] = "ExifVersion";
JPEG._EXIFTags[0x9003] = "DateTimeOriginal";
JPEG._EXIFTags[0x9004] = "CreateDate";
JPEG._EXIFTags[0x9010] = "OffsetTime";
JPEG._EXIFTags[0x9011] = "OffsetTimeOriginal";
JPEG._EXIFTags[0x9012] = "OffsetTimeDigitized";
JPEG._EXIFTags[0x9101] = "ComponentConfiguration";
JPEG._EXIFTags[0x9201] = "ShutterSpeedValue";
JPEG._EXIFTags[0x9202] = "ApertureValue";
JPEG._EXIFTags[0x9203] = "BrightnesasValue";
JPEG._EXIFTags[0x9204] = "ExposureCompensation";
JPEG._EXIFTags[0x9207] = "MeteringMode";
JPEG._EXIFTags[0x9209] = "Flash";
JPEG._EXIFTags[0x920A] = "FocalLength";
JPEG._EXIFTags[0x9214] = "SubjectArea";
JPEG._EXIFTags[0x927C] = "MakerNote"; // MakerNoteApple ... MakerNoteUnknown
JPEG._EXIFTags[0x9291] = "SubSecTimeOriginal";
JPEG._EXIFTags[0x9292] = "SubSecTimeDigitized";
JPEG._EXIFTags[0xA000] = "FlashpixVersion";
JPEG._EXIFTags[0xA001] = "ColorSpace";
JPEG._EXIFTags[0xA002] = "ExifImageWidth";
JPEG._EXIFTags[0xA003] = "ExifImageHeight";
JPEG._EXIFTags[0xA217] = "SensingMethod";
JPEG._EXIFTags[0xA301] = "SceneType";
JPEG._EXIFTags[0xA402] = "ExposureMode";
JPEG._EXIFTags[0xA403] = "WhiteBalance";
JPEG._EXIFTags[0xA405] = "FocalLengthIn35mmFormat";
JPEG._EXIFTags[0xA406] = "SceneCaptureType";
JPEG._EXIFTags[0xA432] = "LensSpecification"; // "LensInfo"
JPEG._EXIFTags[0xA433] = "LensMake";
JPEG._EXIFTags[0xA434] = "LensModel";
// ...
JPEG._EXIFTags[0x3133] = "";

// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";
// JPEG._EXIFTags[0x] = "";




















// 