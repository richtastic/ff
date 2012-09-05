// Video.js
function Video(){
	Code.extendClass(this,DO);
	this.images = new Array();
	this.index = -1;
	// 
	this.addImage = addImage;
	function addImage(img){
		this.images.push(img);
	}
	// -----------------------------------------------
	var bits = new ByteData();
	var vidData = new VideoData1();
	bits.clearData();
	console.log("read/writ/ing...");
	bits.writeString64(vidData.data);
	console.log("saving");
	bits.initRead();
	var wid, hei, i, j, index;
	console.log( "videoType: " + bits.readUint8() );
	var dataAvailable = !bits.readEnd();
	while(dataAvailable){
		console.log( "imageType: " + bits.readUint8() );
		wid = bits.readUint16();
		hei = bits.readUint16();
		console.log("dimensions: "+wid+"x"+hei);
		if(wid*hei<=0){ break; }
	this.width = wid;
	this.height = hei;
		var img = new Array(wid*hei);
		index = 0;
		for(j=0;j<hei;++j){
			for(i=0;i<wid;++i){
				col = bits.readUint32();
				img[index] = col;
				++index; // j*wid+i
			}
		}
		this.addImage(img);
		dataAvailable = !bits.readEnd();
	}
	console.log("...complete...");
// -----------------------------------------------
this.counter = -1;
	this.render = render;
	function render(canvas){
		this.super.setupRender.call(this,canvas);
		var context = canvas.getContext();
		var wid, hei, i, j, r, g, b, a, col;
		// 
		this.counter++;
		if(this.counter>=this.images.length){
			this.counter=0;
		}
		var img = this.images[this.counter];
		var index = 0;
		wid = this.width;
		hei = this.height;
		//var imageData = context.createImageData(wid,hei);
			var imageData = new Array();
		for(j=0;j<hei;++j){
			for(i=0;i<wid;++i){
				col = img[index];
				r = Code.getRedARGB(col);
				g = Code.getGrnARGB(col);
				b = Code.getBluARGB(col);
				a = Code.getAlpARGB(col);
				//this.setPixelRGBA( imageData, i,j, r,g,b,a );
					col = String.fromCharCode( b,g,r,0 );
					imageData[(hei-j-1)*wid+i] = col;
				++index;
			}
		}
		//context.putImageData(imageData, 0,0);
			var img = new Image(wid,hei);
			img.width = wid;
			img.height = hei;
			img.src = 'data:image/bmp;base64,'+window.btoa(this.generateBMPImageHeader(wid,hei)+imageData.join(""));
			 context.drawImage(img, 0,0, wid,hei);
		this.super.takedownRender.call(this);
	}
	this.generateBMPImageHeader = generateBMPImageHeader;
	function generateBMPImageHeader(w,h){
		var imgWidth = parseInt(width);
		var imgHeight = parseInt(height);
		var imageData = new Array();
		var sizeOfImage = imgWidth * imgHeight;
		var height = h;
		var width = w;
		height = _asLittleEndianHex(height, 4);
        width = _asLittleEndianHex(width, 4);
        num_file_bytes = _asLittleEndianHex(sizeOfImage*4, 4);
        imageHeader = ('BM' +                // "Magic Number"
                	num_file_bytes +     // size of the file (bytes)*
                	'\x00\x00' +         // reserved
                	'\x00\x00' +         // reserved
                	'\x36\x00\x00\x00' + // offset of where BMP data lives (54 bytes)
                	'\x28\x00\x00\x00' + // number of remaining bytes in header from here (40 bytes)
                	width +              // the width of the bitmap in pixels*
                	height +             // the height of the bitmap in pixels*
                	'\x01\x00' +         // the number of color planes (1)
                	'\x20\x00' +         // 32 bits / pixel
                	'\x00\x00\x00\x00' + // No compression (0)
                	'\x00\x00\x00\x00' + // size of the BMP data (bytes)*
                	'\x13\x0B\x00\x00' + // 2835 pixels/meter - horizontal resolution
                	'\x13\x0B\x00\x00' + // 2835 pixels/meter - the vertical resolution
               		'\x00\x00\x00\x00' + // Number of colors in the palette (keep 0 for 32-bit)
                	'\x00\x00\x00\x00'   // 0 important colors (means all colors are important)
			);
		return imageHeader;
	}
	this._asLittleEndianHex = _asLittleEndianHex;
	function _asLittleEndianHex(value, bytes){
		var result = [];
		for (; bytes>0; bytes--){
			result.push(String.fromCharCode(value & 255));
			value >>= 8;
		}
		return result.join('');
	}
	this.setPixelRGBA = setPixelRGBA;
	function setPixelRGBA(dat, x,y, r,g,b,a){
		var index = (x+y*dat.width)*4;
		dat.data[index+0] = r;
		dat.data[index+1] = g;
		dat.data[index+2] = b;
		dat.data[index+3] = a;
	}
	// 
	this.kill = kill;
	function kill(){
		this.images = null;
	}
	// 
}
