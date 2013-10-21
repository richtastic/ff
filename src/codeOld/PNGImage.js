// PNGImage.js
// http://www.libpng.org/pub/png/spec/1.2/PNG-Structure.html
// http://en.wikipedia.org/wiki/Portable_Network_Graphics
// http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html
// byte order: B4 B3 B2 B1 : MSB -> LSB
function PNGImage(){
	this.generatePNGImage = function(){
        var pngPrefix = [137, 80, 78, 71, 13, 10, 26, 10]; // decimal png header

    }
    this.generateChunk = function(){
        // length of data = 4-bytes = # bytes
        // chunk type = 4-bytes = a-z,A-Z,65-90,97-122
            // 1 = upper = crititcal, lower = noncritical
            // 2 = upper = public, lower = private
            // 3 = upper only
            // 4 = upper = (may be) unsafe, lower = safe
        // chunk data = length-bytes
        // CRC = 4-bytes = inverted(x^32+x^26+x^23+x^22+x^16+x^12+x^11+x^10+x^8+x^7+x^5+x^4+x^2+x+1)
            // http://www.libpng.org/pub/png/spec/1.2/PNG-CRCAppendix.html
    }
    /* crit. chunks: 
    IHDR:
        width: 4-bytes                  ...
        height: 4-bytes                 ...
        bit-depth: 1-byte               bits per sample / bits per palette index: 1,2,4,8,16
        color-type: 1-byte              addition of: 1:palette used, 2:color used, 4:alpha used : 1,2,3,4,6
        compression method: 1-byte      
        filter method: 1-byte
        interlaced method: 1-byte
    PLTE: palette 
    IDAT: image 
    IEND: image end
    */
    /* anci. chunks: 
    bKGD: background
    cHRM: chromaticity coords
    gAMA: gama
    hIST: histogram of colors
    iCCP: ICC color profile
    iTXt: UTF-8 text
    pHYs: pixel size / aspect ratio
    sBIT: color-accuracy
    sRGB: standard RGB color space is used
    sTER: stereo-image is used
    tEXt: text name=value pair
    tIME: modification date
    tRNS: transparancy info - single or multiple
    zTXt: compressed tEXt
    */
    /*
    
    */
}


// http://lodev.org/lodepng/
