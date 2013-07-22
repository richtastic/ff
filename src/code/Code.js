// Code.js
Code.RESERVED_WORDS = ["super","superList","superRank","superFxn"];
Code.TYPE_OBJECT = "object";
Code.TYPE_FUNCTION = "function";
Code.TYPE_NUMBER = "number";
Code.TYPE_STRING = "string";
Code.TYPE_UNDEFINED = "undefined";
// instance functions ----------------------------------------------
function Code(){
	alert('you shouldn\'t instantiate the Code class');
}
// basic functions ----------------------------------------------
Code.log = function(o){
	if(typeof o == Code.TYPE_STRING){
		console.log(o);
	}else if(typeof o == Code.TYPE_FUNCTION){
		console.log(o);
	}else{
		console.log( o.toString() );
	}
}
// array functions ----------------------------------------------
Code.elementExists = function(a,o){ // O(n)
	for(var i=0; i<a.length; ++i){
		if(a[i]==o){ return true; }
	}
	return false;
}
Code.addUnique = function(a,o){ // O(n)
	if( !Code.elementExists(a,o) ){ a.push(o); return true; }
	return false;
}
Code.removeElement = function(a,o){ // preserves order O(n)
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
Code.removeElementSimple = function(a,o){ // not preserve order O(n/2)
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
	if(a==b){return;}
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
Code.extendClass = function(child,parent,args){
	parent.apply(child,args); // give functions and objects
	if(!child.super){ // first extension
		child._superList = [ {} ];
		child._superRank = 0;
		child.super = function(n){
			if(n == undefined){
				return null; // arguments.callee ?
			}else if(typeof n == Code.TYPE_FUNCTION){
				return child._superList[ n._superRank ];
			}
			return child._superList[n];
		}
	}else{ // add another 'super' object
		child._superList.push({});
		child._superRank++;
	}
	for(key in child){ // give each function a rank/overriding fxn
		if(typeof child[key] == Code.TYPE_FUNCTION){
			if(!child[key]._superFxn){
				child[key]._superFxn = child[key];
				child[key]._superRank = child._superRank;
			}
		}
	}
}
Code.overrideClass = function(child,oldFxn,newFxn){
	var fxnKey = null;
	for(key in child){ // find key name
		if(typeof child[key] == Code.TYPE_FUNCTION){
			if(child[key]==oldFxn){
				fxnKey = key;
				break;
			}
		}
	}// save old fxn in super and set key to new fxn
	child._superList[child._superRank][fxnKey] = oldFxn;
	child[fxnKey] = newFxn;
	newFxn._superFxn = fxnKey;
	newFxn._superRank = child._superRank;
	return newFxn;
}
// color functions ----------------------------------------------------
Code.color255 = function(c){
	return Math.min( Math.max( Math.round(c), 0), 255);
}
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
// object styling functions ----------------------------------------------
Code.copyProperties = function(objectOut,objectIn, override){
	for(p in objectIn){
		if(!objectOut[p] || override){
			objectOut[p] = objectIn[p];
		}
	}
};
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
Code.generateImageFromBit64encode = function(str, fxn){
    var img = new Image();
    if(fxn!=null){
    	img.onload = fxn;
    }
    img.src = str;
    return img;
};
Code.getTimeMilliseconds = function(){
    var d = new Date();
    return d.getTime();
};
Code.gcd = function(a,b){
	a = Math.abs(a); b = Math.abs(b);
	temp = Math.max(a,b); b = Math.min(a,b); a = temp;
	while(b!=0){
		q = Math.floor(a/b);
		r = a%b; // a - b*q;
		if(r == 0){
			return b;
		}
		a = b; b = r;
	}
	return Math.max(a,b);
};
// -------------------------------------------------------- HTML
Code.getID = function(id){
	return document.getElementById(id);
};
Code.newElement = function(type){
	return document.createElement(type);
};
Code.newDiv = function(){
	return document.createElement("div");
};
Code.addChild = function(a,b){
	a.appendChild(b);
};
Code.setProperty = function(ele,pro,val){
	ele.setAttribute(pro,val);
}
// - CLASS
Code.getClass = function(ele){
	var c = ele.getAttribute("class");
	if(c==undefined || c==null){
		return "";
	}
	return c;
};
Code.setClass = function(ele,cla){
	ele.setAttribute("class",cla);
};
Code.addClass = function(ele,cla){
	var c = Code.getClass(ele)+" "+cla;
	ele.setAttribute("class",c);
};
Code.removeClass = function(ele,cla){
	ele.setAttribute("class",Code.getClass(ele).replace(cla,""));
};
// - 
Code.getContent = function(ele){
	return ele.innerHTML;
}
Code.setContent = function(ele,val){
	ele.innerHTML = val;
}
Code.copyHTML = function(ele){
	// crate new element yeppers
	return null;
}
