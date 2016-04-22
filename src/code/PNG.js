// PNG.js
// https://www.w3.org/TR/PNG/
function PNG(){
	//
}
// --------------------------------------------------------------------------
PNG._MIMETYPE_1 = "image/png"; // internet media type
PNG._MIMETYPE_2 = "image/x-png"; 
PNG.prototype.a = function(){
	//
}

PNG.prototype._headerChunk = function(width,height,depth,colorType,compressionMethod,filterMethod,interlaceMethod){
	//
}

PNG.prototype._textKeywordChunk = function(title,author,description,copyright,created,software,disclaimer,warning,source,comment){
	//
}

// IHDR :  73  72  68  82 - image header
// PLTE :  80  76  84  69 - RGB palette
// IDAT :  73  68  64  84 - image data output from compression algorithm
// IEND :  73  69  78  68 - end of image trailer
// tRNS : 116  82  78  83 - transparency / alpha table
// cHRM :  99  72  82  77 - chromaticities
// gAMA : 103  65  77  65 - gamma output intensities
// iCCP : 105  67  67  80 - embedded icc profile - international color consortium
// sBIT : 115  66  73  84 - significant bits to use for sample depths
// sRGB : 115  82  71  66 - standard r g b colorspace
// tEXt : 116  69  88 116 - keyword string combo
// iTXt : 105  84  88 116 - international textural keyword string combo
// zTXt : 122  84  88 116 - compressed keyword string combo
// bKGD :  98  75  71  68 - background color
// hIST : 104  73  83  84 - historgram usage frequency 
// pHYs : 112  72  89 115 - physical pixel dimensions
// sPLT : 115  80  76  86 - suggested palette 
// tIME : 116  73  77  69 - time last modified


