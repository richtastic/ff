// Code.js
function Code(){
	alert('you shouldn\'t instantiate the Code class');
}
// basic functions ----------------------------------------------
Code.log = function(o){
	console.log( o.toString() );
}
// array functions ----------------------------------------------
Code.elementExists = function(a,o){
	var i;
	for(i=0;i<a.length;++i){
		if(a[i]==o){ return true; }
	}
	return false;
}
Code.addUnique = function(a,o){
	if( !Code.elementExists(a,o) ){ a.push(o); }
}
Code.removeElement = function(a,o){ // preserves order
	var i, len = a.length;
	for(i=0;i<len;++i){
		if(a[i]==o){
			len-=1;
			while(i<len){
				a[i] = a[i+1];
				++i;
			}
			a.pop();
			return;
		}
	}
}
Code.removeElementSimple = function(a,o){ // not preserve order
	var i, len = a.length;
	for(i=0;i<len;++i){
		if(a[i]==o){
			a[i] = a[len-1];
			a.pop();
			return;
		}
	}
}
Code.emptyArray = function(a){
	while(a.length>0){ a.pop(); }
}
Code.killArray = function(a){
	while(a.length>0){ a.pop().kill(); }
}
Code.killMe = function(obj){
	for(var key in obj){
		obj[key] = null;
	}
}
Code.newArray = function(){
	var arr = new Array();
	var i, len = arguments.length;
	for(i=0;i<len;++i){
		arr.push(arguments[i]);
	}
	return arr;
}
Code.copyArray = function(a,b){ // a = b
	Code.emptyArray(a);
	var i, len = b.length;
	for(i=0;i<len;++i){
		a[i] = b[i];
	}
}
// conversion functions ----------------------------------------------
Code.getHex = function (intVal){
	var str = intVal.toString(16);
	while(str.length<6){
		str = "0"+str;
	}
	return '#'+str;
}

// class functions ----------------------------------------------
Code.extendClass = function(child,parent){ // parent.apply(child); child.base = new parent; child.base.child = child;
	parent.apply(child); child.super = new parent; // child.super.child = child;
	/*for (var key in child){
		console.log("child["+key+"]");
	}
	for (var key in child.super){
		console.log("child.super["+key+"]");
	}*/
	/*
	for (var key in child.super){ // copy all variables from parent to child
		//console.log("parent["+key+"] = ");//+child.super[key]);
		child[key] = child.super[key];
	}
	*/
}
// color functions ----------------------------------------------------
Code.getColRGBA = function(r,g,b,a){
	return (r<<24)+(g<<16)+(b<<8)+a;
}
Code.getRedRGBA = function(col){
	return (col>>24)&0xFF;
}
Code.getGrnRGBA = function(col){
	return (col>>16)&0xFF;
}
Code.getBluRGBA = function(col){
	return (col>>8)&0xFF;
}
Code.getAlpRGBA = function(col){
	return col&0xFF;
}
// color functions ----------------------------------------------------
Code.getRedARGB = function(col){
	return (col>>16)&0xFF;
}
Code.getGrnARGB = function(col){
	return (col>>8)&0xFF;
}
Code.getBluARGB = function(col){
	return (col)&0xFF;
}
Code.getAlpARGB = function(col){
	return (col>>24)&0xFF;
}
// color functions ----------------------------------------------------
Code.getJSRGBA = function(col){
	return "rgba("+Code.getRedRGBA(col)+","+Code.getGrnRGBA(col)+","+Code.getBluRGBA(col)+","+Code.getAlpRGBA(col)/255.0+")";
}
// ? functions ----------------------------------------------
Code.preserveAspectRatio2D = function(v,wid,hei,fitWid,fitHei){
	var ar = wid/hei;
	v.x = fitWid; v.y = fitWid/ar;
	if(v.y>fitHei){
		v.x = fitHei*ar; v.y = fitHei;
	}
}
// -------------------------------------------------------- images
Code.generateBMPImageHeader = function(w,h){ // 
    var imgWidth = parseInt(width);
    var imgHeight = parseInt(height);
    var imageData = new Array();
    var sizeOfImage = imgWidth * imgHeight;
    var height = h;
    var width = w;
    height = Code.asLittleEndianHex(height, 4);
    width = Code.asLittleEndianHex(width, 4);
    num_file_bytes = Code.asLittleEndianHex(sizeOfImage*4, 4);
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
Code.asLittleEndianHex = function(value, bytes){
    var result = [];
    for (; bytes>0; bytes--){
        result.push(String.fromCharCode(value & 255));
        value >>= 8;
    }
    return result.join('');
}
Code.setPixelRGBA = function(dat, x,y, r,g,b,a){
    var index = (x+y*dat.width)*4;
    dat.data[index+0] = r;
    dat.data[index+1] = g;
    dat.data[index+2] = b;
    dat.data[index+3] = a;
}
Code.generateBMPImageSrc = function(wid,hei,imageData){
    return 'data:image/bmp;base64,'+window.btoa(Code.generateBMPImageHeader(wid,hei)+imageData.join(""));
}
Code.generateImageFromData = function(wid,hei,imageData){
    var img = new Image(wid,hei);
    img.width = wid;
    img.height = hei;
    img.src = Code.generateBMPImageSrc(wid,hei,imageData);
    return img;
}
//Code.generateImageFrombit64encode = function(wid,hei,str){
Code.generateImageFrombit64encode = function(str){
    var img = new Image();
    img.src = str;
    return img;
}

