// PNGImage.js
// http://www.libpng.org/pub/png/spec/1.2/PNG-Structure.html
// byte order: B4 B3 B2 B1 : MSB -> LSB
function PNGImage(){
	this.generatePNGImage = function(){
        var pngPrefix = [137, 80, 78, 71, 13, 10, 26, 10]; // decimal png header

    }
    this.generateChunk = function(){
        // length of data = 4-bytes = # bytes
        // chunk type = 4-bytes = a-z,A-Z,65-90,97-122
        // chunk data = length-bytes
        // CRC = 4-bytes
    }
}



