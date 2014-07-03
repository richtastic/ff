// Code.js 
// OVERRIDES:
Math.PI2 = Math.PI*2.0;
Math.TAU = Math.PI*2.0;
Math.PIO2 = Math.PI*0.5;
// 
Code.IS_IE = ( (navigator.appName).toLowerCase().indexOf("explorer") >=0 );
// http://www.quirksmode.org/dom/events/index.html
Code.JS_EVENT_CLICK = "click";
Code.JS_EVENT_RESIZE = "resize";
Code.JS_EVENT_MOUSE_UP = "mouseup";
Code.JS_EVENT_MOUSE_DOWN = "mousedown";
Code.JS_EVENT_MOUSE_MOVE = "mousemove";
Code.JS_EVENT_MOUSE_OUT = "mouseout";
	//Code.JS_EVENT_MOUSE_ENTER = "mouseenter";
	//Code.JS_EVENT_MOUSE_LEAVE = "mouseleave";
Code.JS_EVENT_MOUSE_OVER = "mouseover";
Code.JS_EVENT_MOUSE_WHEEL = "mousewheel";
	//Code.JS_EVENT_WHEEL = "wheel";
Code.JS_EVENT_KEY_UP = "keyup";
Code.JS_EVENT_KEY_DOWN = "keydown";
Code.JS_EVENT_TOUCH_START = "touchstart";
Code.JS_EVENT_TOUCH_MOVE = "touchmove";
Code.JS_EVENT_TOUCH_END = "touchend";
Code.JS_EVENT_TOUCH_ENTER = "touchenter";
Code.JS_EVENT_TOUCH_LEAVE = "touchleave";
Code.JS_EVENT_TOUCH_CANCEL = "touchcancel";

Code.JS_EVENT_DRAG_START = "dragstart";
Code.JS_EVENT_DRAG_MOVE = "drag";
Code.JS_EVENT_DRAG_END = "dragend";
Code.JS_EVENT_DRAG_ENTER = "dragenter";
Code.JS_EVENT_DRAG_OVER = "dragover";
Code.JS_EVENT_DRAG_LEAVE = "dragleave";
Code.JS_EVENT_DRAG_DROP = "drop";

Code.JS_EVENT_LOAD_END = "loadend";
Code.JS_EVENT_LOAD_PROGRESS = "progress";
Code.JS_EVENT_LOAD_START = "loadstart";
Code.JS_EVENT_ABORT = "abort";
Code.JS_EVENT_ERROR = "error";

Code.JS_EVENT_SCROLL = "scroll"; // window.onscroll
Code.JS_EVENT_BLUR = "blur";
Code.JS_EVENT_CHANGE = "change";
Code.JS_EVENT_RIGHT_CLICK = "contextmenu";
Code.JS_EVENT_COPY = "copy";
Code.JS_EVENT_CUT = "cut";
Code.JS_EVENT_PASTE = "paste";
Code.JS_EVENT_DOUBLE_CLICK = "dblclick";
Code.JS_EVENT_ERROR = "error";
Code.JS_EVENT_FOCUS = "focus";
Code.JS_EVENT_FOCUS_IN = "focusin";
Code.JS_EVENT_FOCUS_OUT = "focusout";
Code.JS_EVENT_LOCATION = "hashchange";
Code.JS_EVENT_KEY_DOWN = "keydown";
Code.JS_EVENT_KEY_PRESS = "keypress";
Code.JS_EVENT_KEY_UP = "keyup";
Code.JS_EVENT_LOAD = "load";
Code.JS_EVENT_RESET = "reset";
Code.JS_EVENT_SCROLL = "scroll";
Code.JS_EVENT_SELECT = "select";
Code.JS_EVENT_SUBMIT = "submit";
Code.JS_EVENT_UNLOAD = "textinput";
//
Code.TYPE_FUNCTION = 'function';
Code.TYPE_OBJECT = 'object';
Code.TYPE_STRING = 'string';
Code.TYPE_ARRAY = 'array';
Code.TYPE_NUMBER = 'number';
Code.monthsShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
Code.monthsLong = ["January","February","March","April","May","June","July","August","September","October","November","December"];
Code.daysOfWeekShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
Code.daysOfWeekLong = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// ------------------------------------------------------------------------------------------
function Code(){
	this.www = 234;
}
Code.isNumber = function(obj){
	return (typeof obj)==Code.TYPE_NUMBER;
}
Code.isString = function(obj){
	return (typeof obj)==Code.TYPE_STRING;
}
Code.isObject = function(obj){
	return (typeof obj)==Code.TYPE_OBJECT;
}
Code.isFunction = function(obj){
	return (typeof obj)==Code.TYPE_FUNCTION;
}
Code.isArray = function(obj){
	return (obj && obj.constructor==Array); // instanceofArray
	//return (typeof obj)==Code.TYPE_ARRAY;
}
Code.copyToClipboardPrompt = function(str){
	var txt = Code.newInputTextArea(str, 3,10);
	Code.setStyleZIndex(txt,"9999");
	Code.setStylePosition(txt,"absolute");
	Code.setStyleRight(txt,"0");
	document.body.appendChild(txt);
	txt.ondblclick = function(e){ document.body.removeChild(e.target); e.ondblclick=null; }
}
// ------------------------------------------------------------------------------------------ CLASS SUB/SUPER EXTEND
Code.extendClass = function extendClass(target, source) {
	if(Object && Object.getOwnPropertyNames!==undefined){
	    Object.getOwnPropertyNames(source).forEach(function(propName) {
	        Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
	    });
	}else{ // IE
		for(key in source){
			target[key] = source[key];
		}
	}
    return target;
}

Code.inheritClass = function inheritClass(SubC, SuperC){
	// console.log( Object.defineProperty );
	// console.log( Object.getProperties );
	// console.log( Object.getOwnPropertyNames );
	// console.log( Object.getOwnPropertyDescriptor );
//console.log( Object.hasOwnProperty ); // YES
//console.log(SuperC); // YES
//console.log(SuperC.prototype); // YES
    var subProto = null;
    if(Object && Object.create!==undefined){
    	subProto = Object.create(SuperC.prototype);
    	Code.extendClass(subProto, SubC.prototype);
    	SubC.prototype = subProto;
    	SubC._ = SuperC.prototype;
    }else{ // IE
    	/*
		subProto = new Object();
// console.log(subProto.constructor.prototype);
// console.log(SuperC.constructor.prototype);
		//subProto.prototype = SuperC.prototype;
		//subProto.prototype = new SuperC();
		//subProto.prototype = (new SuperC()).prototype;
		for(var key in SuperC.prototype){
			//subProto.prototype[key] = SuperC.prototype[key];
			subProto.constructor.prototype[key] = SuperC.prototype[key];
			//subProto[key] = SuperC.prototype[key];
		}
		//subProto.prototype = SuperC.prototype;
		//subProto.__proto__ = SuperC.prototype;
		//subProto.constructor.prototype = SuperC.constructor.prototype;
		//subProto.constructor.prototype = SuperC.prototype;
		//
		Code.extendClass(subProto, SubC.prototype);
    	SubC.prototype = subProto;
    	SubC._ = SuperC.prototype;
    	//SubC._ = SuperC.constructor.prototype;
    	*/
    	SubC.prototype = new SuperC();
    	SubC._ = SuperC.constructor.prototype;
    }
}

Code.isa = function(obj, klass){ // only this?
	return (obj && obj.constructor && obj.constructor==klass);
}
Code.ofa = function(obj, klass){ // inherits?
	return (obj && obj.constructor && obj.constructor==klass) || Code.ofa(obj.constructor._, klass);
}
// ------------------------------------------------------------------------------------------ PRINT
Code.log = function log(o){
	if(console && console.log!==null && console.log!==undefined){
		if(o!==undefined && o!==null){
			if(typeof o.toString == Code.TYPE_FUNCTION){
				console.log( o.toString() );
			}else if(typeof o == Code.TYPE_STRING){
				console.log( o );
			}else if(typeof o == Code.TYPE_FUNCTION){
				console.log( o );
			}else if(false){//typeof o == Code.TYPE_OBJECT && o.toString!==null && o.toString!==undefined){
				console.log( o.toString() );
			}else{
				console.log( o );
			}
		}
	}
}


Code.booleanToString = function(b){
	if(b===true || b==="true" || b==="t"){ // b===1 || b==="1"
		return "true";
	}
	return "false";
}
Code.binarySearchArrayFloatDecreasing = function(needle,hay){
	return hay-needle;
}
Code.binarySearchArrayFloatIncreasing = function(needle,hay){ // searching for needle, comparing to item hay
	return needle-hay;
}
Code.binarySearchArray = function(arr,fxn,needle){ // Code.binarySearchArray([0,1,2,3,4,5],Code.binarySearchArrayFloatIncreasing, 3.5)
	var left, right, middle, val;
	left = 0; right = arr.length-1;
	middle = Math.floor((right+left)/2);
	val = fxn(needle,arr[middle]);
	while( val !=0 && left<right){
		// console.log("["+left+" |"+middle+"| "+right+"] = "+arr[middle]+"      ("+val+")");
		if(val<0){
			right = middle-1;
		}else{
			left = middle+1;
		}
		middle = Math.floor((right+left)/2);
		val = fxn(needle,arr[middle]);
	}
	middle = Math.min(Math.max(0,middle),arr.length-1); // -1?
	if(val<0){
		if(middle-1>=0){ // END
			return [middle-1,middle];
		}
	}else if(val>0){
		if(middle+1<arr.length){ // END
			return [middle,middle+1];
		}
	}
	return [middle];
}
// ------------------------------------------------------------------------------------------ ARRAY
Code.setArray = function(arr){
	var i, im1, len = arguments.length;
	for(im1=0,i=1;i<len;++i,++im1){
		arr[im1] = arguments[i];
	}
	return arr;
}
Code.newArray = function(){
	var arr = new Array();
	var i, len = arguments.length;
	for(i=0;i<len;++i){
		arr.push(arguments[i]);
	}
	return arr;
}
Code.newArrayZeros = function(len){
	var i, arr = new Array(len);
	for(i=len;i--;){
		arr[i] = 0.0;
	}
	return arr;
}
Code.setArrayConstant = function(arr,c){
	for(var i=arr.length;i--;){
		arr[i] = c;
	}
	return arr;
}
Code.copyArray = function(a,b){ // a = b
	if(a==b){return;}
	if(b===undefined){ b=a; a=new Array(); }
	Code.emptyArray(a);
	var i, len = b.length;
	for(i=0;i<len;++i){
		a[i] = b[i];
	}
	return a;
}
Code.emptyArray = function(a){
	while(a.length>0){ a.pop(); }
}
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
Code.removeElementAt = function(a,i){ // preserve order
	var len = a.length;
	while(i<len){
		a[i] = a[i+1];
		++i;
	}
	a.pop();
	return;
}
Code.removeElementAtSimple = function(a,i){ // not preserve order O(n/2)
	var len = a.length;
	a[i] = a[len-1];
	a.pop();
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
Code.removeElementAtSimple = function(a,i){ // not preserve order
	a[i] = a[a.length-1];
	a.pop();
	return;
}
Code.subArray2D = function(a,wid,hei, staX,endX, staY,endY){ // inclusive indexes
	var lenX = endX - staX + 1;
	var lenY = endY - staY + 1;
	if(lenX<=0||lenY<=0){
		return new Array();
	}
	var i, j, b = new Array(lenX*lenY);
	for(j=0;j<lenY;++j){
		for(i=0;i<lenX;++i){
			b[lenX*j+i] = a[(wid)*(j+staY)+(i+staX)];
		}
	}
	return b;
}
Code.toStringArray2D = function(a,wid,hei, exp){
	exp = exp===undefined?4:exp;
	var minLen = exp+6+1; // -#.E+#
	var i, j, num, val, str = "[";
	var hm1 = hei-1;
	var wm1 = wid-1;
	for(j=0;j<hei;++j){
		if(j>0){
			str += " ";
		}
		for(i=0;i<wid;++i){
			num = a[wid*j+i];
			val = num.toExponential(exp);
			if(num>=0){ // +/1 prefix
				val = " " + val;
			}
			str += Code.padStringLeft(val,minLen," ");
			if( !(j==hm1&&i==wm1) ){
				if(i==wm1){
					str += ";";
				}else{
					str += ",";
				}
			}
		}
		if(j<hm1){
			str += "\n";
		}else{
			str += "]";
		}
	}
	return str.replace(/e/g,"E");
}
Code.convolutionSum = function(a,b){
	var i, j, val, lenA = a.length, lenB = b.length, sum = 0.0;
	for(i=0;i<lenA;++i){
		val = a[i];
		for(j=0;j<lenB;++j){
			sum += val*b[j];
		}
	}
	return sum;
}
Code.checkPoints2DToZeroOne = function(arr, width, height){
	var i, len = arr.length, greaterThanOne = false;
	for(i=len;i--;){
		if(p.x>1.0 || p.y>1.0){
			greaterThanOne = true;
			break;
		}
	}
	if(greaterThanOne){
		Code.pointsToZeroOne(arr, width, height);
	}
}
Code.points2DToZeroOne = function(arr, width, height){
	for(var i=arr.length;i--;){
		arr.x /= width;
		arr.y /= width;
	}
}
// ------------------------------------------------------------------------------------------ 
Code.isUnique = function(val){ // val, ...array
	for(i=1;i<arguments.length;++i){
		if(val==arguments[i]){
			return false;
		}
	}
	return true;
}
Code.secondMax = function(){
	var a;
	var max = Math.max.apply(this,arguments);
	var nextMax = Math.min.apply(this,arguments);
	for(var i=0;i<arguments.length;++i){
		a = arguments[i];
		if( nextMax>a && a!=max){
			nextMax = a;
		}
	}
	return nextMax;
}
Code.maxArray = function(a){
	return Math.max.apply(this,a);
}
Code.minArray = function(a){
	return Math.min.apply(this,a);
}
//console.log( Code.secondMax(1,2,42,34,23,7) );
	//console.log( Math.max([1,2,42,34,23,7]) ); // NO
	//console.log( Math.max.call(this,[1,2,42,34,23,7]) ); // NO
	//console.log( Math.max.apply(this,[1,2,42,34,23,7]) ); // WORKS\
// ------------------------------------------------------------------------------------------ TIME
Code._timerDates = [];
Code._timerDateTop = 0;
Code.timerStart = function(){
	Code._timerDates.push( Code.getTimeMilliseconds() );
}
Code.timerStop = function(){
	Code._timerDateTop = Code.getTimeMilliseconds() - Code._timerDates.pop();
}
Code.timerQuickDifferenceSeconds = function(){
	return (Code.getTimeMilliseconds() - Code._timerDates[Code._timerDates.length-1])/1000.0;
}
Code.timerDifference = function(){
	return Code._timerDateTop;
}
Code.timerDifferenceSeconds = function(){
	return Code.timerDifference()/1000.0;
}
Code.getTimeMilliseconds = function(){
    var d = new Date();
    return d.getTime();
}
Code.getTimeZone = function(){
	var d = new Date();
	var hours = Math.floor( -d.getTimezoneOffset()/60 );
	return hours;
}
Code.getTimeStamp = function(){
    var d = new Date( Code.getTimeMilliseconds() );
	var str = d.getFullYear()
	+"-"+Code.prependFixed(""+d.getMonth(),"0",2)
	+"-"+Code.prependFixed(""+(d.getDate()+1),"0",2)
	+" "+Code.prependFixed(""+d.getHours(),"0",2)
	+":"+Code.prependFixed(""+d.getMinutes(),"0",2)
	+":"+Code.prependFixed(""+d.getSeconds(),"0",2)
	+"."+Code.postpendFixed(""+d.getMilliseconds(),"0",4);
	return str;
}
Code.getAMPMFromDate = function(date){
	return parseInt(date.getHours(),10)<12?"AM":"PM";
}
Code.getHourStringFromDate = function(date){
	hour = date.getHours();
	if(hour>12){
		hour -= 12; 
	}
	if(hour==0){ // 12 AM || PM
		hour = 12;
	}
	return Code.prependFixed(hour+"","0",1)+":"+Code.prependFixed(date.getMinutes()+"","0",2)+""+Code.getAMPMFromDate(date);
}
// ------------------------------------------------------------------------------------------ BINARY REPRESENTATIONS
Code.intToBinaryString = function(num,cnt){
	var i, len = (cnt!=null)?cnt:32, ander = 1;
	var str = "";
	for(i=0;i<len;++i){
		str = "" +((ander&num)!=0?1:0) + str;
		ander <<= 1;
	}
	return str;
}
// angles ----------------------------------------------------
Code.minAngle = function(a,b){ // [0,2pi] => [-pi,pi]
	var nB = a-b;
	if(nB>Math.PI){
		return nB - 2*Math.PI;
	}else if(nB<-Math.PI){
		return nB + 2*Math.PI;
	}
	return nB;
}

Code.angleZeroTwoPi = function(ang){ // [-inf,inf] => [0,2pi]
	var pi2 = Math.PI*2;
	while(ang>=pi2){
		ang -= pi2;
	}
	while(ang<0){
		ang += pi2;
	}
	return ang;
}

Code.angleTwoPi = function(ang){ // [-inf,inf] => [-2pi,2pi]
	var pi2 = Math.PI*2;
	while(ang>pi2){
		ang -= pi2;
	}
	pi2 = -pi2;
	while(ang<pi2){
		ang -= pi2;
	}
	return ang;
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
Code.getColARGB = function(a,r,g,b){
	return (a<<24)+(r<<16)+(g<<8)+b;
}
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
Code.getFloatArrayARGBFromARGB = function(col){
	var a = Code.getAlpARGB(col);
	var r = Code.getRedARGB(col);
	var g = Code.getGrnARGB(col);
	var b = Code.getBluARGB(col);
	return [a/255.0,r/255.0,g/255.0,b/255.0]; // col/256
}
// color functions ----------------------------------------------------
Code.getJSColorFromRGBA = function(col){
	return "rgba("+Code.getRedRGBA(col)+","+Code.getGrnRGBA(col)+","+Code.getBluRGBA(col)+","+Code.getAlpRGBA(col)/255.0+")";
}
Code.getJSColorFromARGB = function(col){
	return "rgba("+Code.getRedARGB(col)+","+Code.getGrnARGB(col)+","+Code.getBluARGB(col)+","+Code.getAlpARGB(col)/255.0+")";
}
// color transfer ----------------------------------------------------
// http://www.couleur.org/?page=transformations
//http://www.rapidtables.com/convert/color/rgb-to-cmyk.htm
//http://en.wikipedia.org/wiki/YUV
Code.YUV_WR = 0.299;
Code.YUV_WB = 0.114;
Code.YUV_WG = 0.587; // 1 - WR - WB
Code.YUV_UMAX = 0.436;
Code.YUV_VMAX = 0.615;
Code.YUVFromRGB = function(rgb){
	var r = Code.getRedARGB(rgb)/255.0;
	var g = Code.getGrnARGB(rgb)/255.0;
	var b = Code.getBluARGB(rgb)/255.0;
	var y = Code.YUV_WR*r + Code.YUV_WG*g + Code.YUV_WB*b;
	var u = Code.YUV_UMAX * ((b-y)/(1.0-Code.YUV_WB));
	var u = Code.YUV_VMAX * ((r-y)/(1.0-Code.YUV_WB));
	return {y:y, u:u, v:v};
}
Code.RGBFromYUV = function(y,u,v){
	var r = y + v*((1.0-Code.YUV_WR)/Code.YUV_VMAX);
	var b = y + u*((1.0-Code.YUV_WB)/Code.YUV_UMAX);
	var g = y - u*(Code.YUV_WB*(1.0-Code.YUV_WB)/Code.YUV_VMAX/Code.YUV_WG);
		g -= u*(Code.YUV_WR*(1.0-Code.YUV_WR)/Code.YUV_VMAX/Code.YUV_WG);
	r = Math.max(0,Math.min(Math.floor(256.0*r*(1.0-k)),255));
	g = Math.max(0,Math.min(Math.floor(256.0*g*(1.0-k)),255));
	b = Math.max(0,Math.min(Math.floor(256.0*b*(1.0-k)),255));
	return Code.getColARGB(0x0, r,g,b);
}
Code.HSLFromRGB = function(rgb){
	// 
}
Code.HSVFromRGB = function(rgb){
	// 
}
Code.CMYKFromRGB = function(rgb){
	var r = Code.getRedARGB(rgb)/255.0;
	var g = Code.getGrnARGB(rgb)/255.0;
	var b = Code.getBluARGB(rgb)/255.0;
	var k = Math.max(r,g,b);
	var c = 0.0, m = 0.0, y = 0.0;
	if(k>0.0){
		c = (k-r)/k;
		m = (k-g)/k;
		y = (k-b)/k;
	}
	k = 1.0 - k;
	return {c:c, m:m, y:y, k:k};
}
Code.RGBFromCMYK = function(c,m,y,k){
	var r = Math.min(Math.floor(256.0*(1.0-c)*(1.0-k)),255);
	var g = Math.min(Math.floor(256.0*(1.0-m)*(1.0-k)),255);
	var b = Math.min(Math.floor(256.0*(1.0-y)*(1.0-k)),255);
	return Code.getColARGB(0x0, r,g,b);
}
// formatting functions ----------------------------------------------
Code.prependFixed = function(start,pad,count){
	var str = start;
	while(str.length<count){
		str = pad+str;
	}
	return str;
}
Code.postpendFixed = function(start,pad,count){
	var str = start;
	while(str.length<count){
		str = str+pad;
	}
	return str;
}

// -------------------------------------------------------- RNG
Code._randGaussSin = null;
Code.randGauss = function(){ // box muller - randn, normal, gaussian
	var a, r;
	if(Code._randGaussSin){
		a = Code._randGaussSin;
		Code._randGaussSin = null
		return a;
	}
	r = Math.sqrt(-2.0*Math.log(Math.random()));
	a = Math.TAU*Math.random();
	Code._randGaussSin = r*Math.sin(a);
	return r*Math.cos(a);
}
Code.randChiSquare = function(){ // 2 DOF
	return rs = -2.0*Math.log(Math.random());
}
Code.randChiSquareN = function(n){ // N DOF
	var i, sum = 0.0, nm1 = Math.floor(n/2.0);
	for(i=0;i<nm1;++i){
		sum += Code.randChiSquare();
	}
	if(n%2==1){
		sum += Math.pow(Code.randGauss(),2)
	}
	return sum;
}

// -------------------------------------------------------- HTML
Code.getBody = function(){
	return document.body;
};
Code.getHead = function(){
	return document.head;
};
Code.setPageTitle = function(str){
	document.head.getElementsByTagName("title")[0].innerHTML = str;
	// if title DNE - make it
}
Code.getID = function(argA,argB){
	if(arguments.length>1){
		return argA.getElementById(argB);
	}
	return document.getElementById(argA);
};
Code.getName = function(argA,argB){
	var eles = document.getElementsByName(argA);
	if(eles.length==0){
		return null;
	}else if(eles.length==1){
		return eles[0];
	}
	return eles;
};
Code.newElement = function(type){
	return document.createElement(type);
};
Code.newScript = function(type){
	return Code.newElement("script");
};
Code.newDiv = function(a){
	var div = Code.newElement("div");
	if(a!=undefined){
		Code.setContent(div,a);
	}
	return div;
};
Code.newTable = function(){
	return Code.newElement("table");
};
Code.newTableHeader = function(){
	return Code.newElement("th");
};
Code.newTableRow = function(){
	return Code.newElement("tr");
};
Code.newTableCol = function(){
	return Code.newElement("td");
};
Code.newSelect = function(){
	return Code.newElement("select");
};
Code.newOption = function(a,b,c){
	var opt = Code.newElement("option");
	if(a!==true && a!==undefined && b!==true && b!==undefined){
		Code.setContent(opt,a);
		opt.setAttribute("value",b);
		if(c===true){
			opt.setAttribute("selected","selected");
		}
	}else if(a!==true && a!==undefined){
		Code.setContent(opt,a);
		opt.setAttribute("value",a);
		if(b===true){
			opt.setAttribute("selected","selected");
		}
	}else{
		Code.setContent(opt,"");
		opt.setAttribute("value","");
		if(a===true){
			opt.setAttribute("selected","selected");
		}
	}
	return opt;
};
Code.setMaxLength = function(v,m){
	Code.setProperty(v,"maxlength",m);
};
Code.newInput = function(){
	return Code.newElement("input");
};
Code.newInputSubmit = function(a){
	var sub = Code.newInput();
	sub.setAttribute("type","submit");
	if(a!==undefined){
		Code.setInputLabel(sub,a);//sub.setAttribute("value",a);
	}
	return sub;
};
Code.setInputLabel = function(a,b){
	a.setAttribute("value",b);
}
Code.newInputText = function(a){
	var sub = Code.newInput();
	sub.setAttribute("type","text");
	if(a!==undefined){
		sub.setAttribute("value",a);
	}
	return sub;
};
Code.newInputPassword = function(a){
	var sub = Code.newInput();
	sub.setAttribute("type","password");
	if(a!==undefined){
		sub.setAttribute("value",a);
	}
	return sub;
};
Code.newInputCheckbox = function(name,value){
	ele = Code.newElement("input");
	Code.setProperty(ele,"type","checkbox");
	Code.setProperty(ele,"name",name);
	Code.setProperty(ele,"value",value);
	return ele;
}
Code.newInputRadio = function(name,value){
	ele = Code.newElement("input");
	Code.setProperty(ele,"type","radio");
	Code.setProperty(ele,"name",name);
	Code.setProperty(ele,"value",value);
	return ele;
}
Code.getInputCheckboxValue = function(e){
	return e.checked;//Code.getProperty(e,"value");//e.checked;
}
Code.setInputCheckboxValue = function(e,v){
	if(v){
		e.checked = true;
	}else{
		e.checked = false;
	}
}
Code.setChecked = function(e){
	e.checked = true;
}
Code.setUnchecked = function(e){
	e.checked = false;
}
Code.isChecked = function(e){
	if(e.checked){
		return true;
	}
	return false;
}
Code.setInputTextValue = function(a,b){
	//a.setAttribute("value",b);
	a.value = b;
};
Code.getInputTextValue = function(a){
	return a.value;//Code.getProperty(a,"value");
};
Code.newInputTextArea = function(a, r,c){
	var sub = Code.newElement("textarea");
	if(a!==undefined){
		sub.value = a ;//Code.setContent(a,"value");sub.setAttribute("value",a);
	}
	if(r!==undefined){
		sub.setAttribute("rows",r);
	}
	if(c!==undefined){
		sub.setAttribute("cols",c);
	}
	return sub;
};

Code.getTextAreaValue = function(a){
	return a.value;
}
Code.setTextAreaValue = function(a,b){
	return a.value = b;
}

Code.newListUnordered = function(){
	var li = Code.newElement("ul");
	return li;
};
Code.newListOrdered = function(){
	var li = Code.newElement("ol");
	return li;
};
Code.newListItem = function(a){
	var li = Code.newElement("li");
	if(a!==undefined){
		Code.setContent(li, a);
	}
	return li;
};

 // IE error - need to use insertRow with tables
Code.addRow = function(a,i){
	if(i===undefined){ i=-1; }
	return a.insertRow(i);//a.rows);
}
Code.removeRow = function(a){
	return a.deleteRow(a.rows.length-1);
}
Code.getRows = function(a){
	return a.rows;
}
Code.getRowCount = function(a){
	return a.rows.length;
}
Code.addCell = function(a,i){
	if(i===undefined){ i=-1; }
	return a.insertCell(i);//a.cells);
}
Code.spanCell = function(a,i){
	a.colSpan = ""+i;
	return Code.setProperty(a,"colspan",""+i);
}
Code.removeCell = function(a){
	return a.deleteCell(a.cells-1);
}
Code.getCells = function(a){
	return a.cells;
}

Code.addChild = function(a,b){
	//if(a.nodeName=="table"){
	//	a.insertRow(b);
	//}else{
		a.appendChild(b);
	//}
};
Code.getChild = function(a,i){
	return a.children[i];
};
Code.numChildren = function(a){
	return a.children.length;
};
Code.removeChild = function(a,b){
	if(b.parentNode==a){
		a.removeChild(b);
	}
};
Code.removeAllChildren = function(a){
	while(Code.numChildren(a)>0){
		Code.removeChild(a,Code.getChild(a,0));
	}
};
Code.getParent = function(a){
	return a.parentNode;
};
Code.removeFromParent = function(a){
	if(a.parentNode){
		a.parentNode.removeChild(a);
	}
};
Code.setProperty = function(ele,pro,val){
	return ele.setAttribute(pro,val);
};
Code.getProperty = function(ele,pro){
	return ele.getAttribute(pro);
}
Code.setDisabled = function(a){
	a.disabled = true;
}
Code.setEnabled = function(a){
	a.disabled = false;
}
Code.setStyleWidth = function(ele,val){
	ele.style.width = val;
};
Code.setStyleBackground = function(ele,val){
	ele.style.background = val;
};
Code.setStyleCursor = function(ele,style){
	ele.style.cursor = style;
};
Code.setStyleZIndex = function(ele,style){
	ele.style.zIndex = style;
};
Code.setStylePosition = function(ele,style){
	ele.style.position = style;
};
Code.setStyleRight = function(ele,style){
	ele.style.right = style;
};
Code.setStyleLeft = function(ele,style){
	ele.style.left = style;
};
Code.getDomBody = function(){
	return document.body;
}
Code.emptyDom = function(ele){
	while(ele.firstChild){
		Code.removeChild(ele,ele.firstChild);
	}
};
// - CLASS
Code.getClass = function(ele){
	var c = ele.getAttribute("class");
	if(c==undefined || c==null){
		c = ele.className;
		if(c==undefined || c==null){
			return "";
		}
	}
	return c;
}
Code.setClass = function(ele,cla){
	ele.setAttribute("class",cla);
};
Code.addClass = function(ele,cla){
	var c = Code.getClass(ele)+" "+cla;
	c = c.replace("  "," ");
	c = c.replace(/^ /,"");
	ele.setAttribute("class",c);
	ele.className = c;
};
Code.removeClass = function(ele,cla){
	var c = Code.getClass(ele)
	c = c.replace(cla,"");
	c = c.replace("  "," ");
	ele.setAttribute("class",c);
};
/*
Code.getStyle = function(ele){
	var c = ele.getAttribute("style");
	if(c==undefined || c==null){
		c = ele.style;
		if(c==undefined || c==null){
			return "";
		}
	}
	return c;
}*/
Code.addStyle = function(ele,cla){
	/*var c = Code.getClass(ele)+" "+cla;
	c = c.replace("  "," ");
	c = c.replace(/^ /,"");
	ele.setAttribute("class",c);
	ele.className = c;*/
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

// hiding 
// ele.setAttribute("display","none");
Code.hide = function(ele){
	ele.style.display = "none";
}
Code.unhide = function(ele){
	ele.style.display = Code.IS_IE?"block":"inherit";
}
// -------------------------------------------------------- TRANSLATORS
Code.getJSEvent = function(e){
	if(!e){ e = window.event; } // IE
	return e;
}
Code.getTypeFromEvent = function(e){
	if(!e){ e = window.event; } // IE
	return e.type;
}
Code.getTargetFromMouseEvent = function(e){
	if(!e){ e = window.event; } // IE
	if(e.target){
		return e.target;
	}
	return e.srcElement; // IE
}
Code.getKeyCodeFromKeyboardEvent = function(e){
	return e.keyCode;
}
// -------------------------------------------------------- LISTENING
Code.addEventListener = function(ele,str,fxn){
	if(Code.IS_IE){
		// ele["on"+str] = fxn
		ele.attachEvent("on"+str,fxn);
	}else{
		ele.addEventListener(str,fxn);
	}
}
Code.removeEventListener = function(ele,str,fxn){
	if(Code.IS_IE){
		// ele["on"+str] = null
		ele.detachEvent("on"+str,fxn);
	}else{
		ele.removeEventListener(str,fxn);
	}
}
// -------------------------------------------------------- LISTENERS
Code.addListenerClick = function(ele,fxn,ctx){
	var f = function(){ fxn.apply(ctx,arguments); }
	Code._addListenerClick(ele,f);
}
Code.removeListenerClick = function(ele,fxn,ctx){
	Code._removeListenerClick(ele,f);
}
Code._addListenerClick = function(ele,fxn){
	if(ele.addEventListener!=null){
		ele.addEventListener("click",fxn);
	}else{ // IE
		ele.onclick = fxn;
	}
}
Code._removeListenerClick = function(ele,fxn){
	if(ele.removeEventListener!=null){
		ele.removeEventListener("click",fxn);
	}else{ // IE
		ele.onclick = null;
	}
}
//
Code.addListenerChange = function(ele,fxn){
	if(ele.addEventListener!=null){
		ele.addEventListener("change",fxn);
	}else{ // IE
		ele.onchange = fxn;
	}
}
Code.stopEventPropagation = function(e){
	e.stopPropagation();
}
Code.eventPreventDefault = function(e){
	if(e.preventDefault){
		e.preventDefault();
	}
}

Code.preserveAspectRatio2D = function(v,wid,hei,fitWid,fitHei){
	var ar = wid/hei;
	v.x = fitWid; v.y = fitWid/ar;
	if(v.y>fitHei){
		v.x = fitHei*ar; v.y = fitHei;
	}
}

// -------------------------------------------------------- COOKIES
Code.setCookie = function(c_name, value, seconds){
	seconds = seconds*1000;
	var exdate = new Date();
	exdate.setTime( exdate.getTime() + seconds);
	var c_value = escape(value) + ((seconds==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}
Code.deleteCookie = function(name){
	Code.setCookie(name,"x",-1);
}
Code.getCookie = function(c_name){
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "="); // not first
	if(c_start == -1){
		c_start = c_value.indexOf(c_name + "="); // first
	}
	if(c_start == -1){
		c_value = null;
	}else{
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1){
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}
// -------------------------------------------------------- DATE FUNCTIONS
Code.getDaysInMonth = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth()+1, 0, 0,0,0,0);
	return d.getDate();
}
Code.getFirstMondayInWeek = function(milliseconds){
	var m, d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0,0);
	var remainder = d.getTime() - milliseconds;
	dow = d.getDay();
	while(dow!=1){
		d = new Date(d.getFullYear(), d.getMonth(), d.getDate()-1, 0,0,0,0);
		milliseconds = d.getTime();
		d = new Date(milliseconds);
		dow = d.getDay();
	}
	return milliseconds + remainder;
}
Code.getNextDay = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	return d.getTime();
}
Code.formatDayString = function(year,month,day){
	return Code.prependFixed(""+year,"0",4)+"-"+Code.prependFixed(""+month,"0",2)+"-"+Code.prependFixed(""+day,"0",2);
}
//
Code.dateFromString = function(str){
	if( str.length<10 ){
		return null;
	}
	var arr=null, yyyy=0, mm=0, dd=0, hh=0, nn=0, ss=0, nnnn=0;
	yyyy = parseInt(str.substr(0,4),10);
	mm = parseInt(str.substr(5,2),10)-1;
	dd = parseInt(str.substr(8,2),10);
	if( str.length>=19 ){
		arr = Code.timeValuesFromString( str.substr(11,str.length) );
		hh = arr[0];
		nn = arr[1];
		ss = arr[2];
		if( arr.length==4){
			nnnn = arr[3];
		}
	}
	var date = new Date(yyyy,mm,dd,hh,nn,ss,nnnn);
	return date;
}
Code.timeValuesFromString = function(str){
	if( str.length<8){
		return null;
	}
	var arr = new Array();
	arr.push(parseInt(str.substr(0,2),10) );
	arr.push(parseInt(str.substr(3,2),10) );
	arr.push(parseInt(str.substr(6,2),10) );
	if(str.length>=13){
		arr.push( parseInt(str.substr(9,4),10) );
	}
	return arr;
}
Code.getArrayListFromTimeString = function(str){ // separates hour,minute,second,milli from HH:MM:SS[.NNNN]
	var arr = new Array();
	arr.push( parseInt(str.substr(0,2),10) );
	arr.push( parseInt(str.substr(3,2),10) );
	arr.push( parseInt(str.substr(6,2),10) );
	if(str.length>8){
		arr.push( parseInt(str.substr(9,4),10) );
	}else{
		arr.push(0);
	}
	return arr;
}
Code.getLogicalArrayFromRepeatString = function(alg){ // separates alg into usable array
	var i, index, str, arr, letter, rep, tmp, stasto;
	var daySplit = alg.split(",");
	var daysOfWeek = new Array(7);
	for(i=0;i<daysOfWeek.length;++i){
		daysOfWeek[i] = new Array();
	}
	for(i=0;i<daySplit.length;++i){
		str = daySplit[i];
		if(str.length<=1){ continue; }
		letter = str.substr(0,1);
		if(letter=="M"){ index = 0;
		}else if(letter=="T"){ index = 1;
		}else if(letter=="W"){ index = 2;
		}else if(letter=="R"){ index = 3;
		}else if(letter=="F"){ index = 4;
		}else if(letter=="S"){ index = 5;
		}else if(letter=="U"){ index = 6;
		}else{ continue; }
		arr = daysOfWeek[index];
		str = str.substr(1,str.length);
		rep = str.split("|");
		for(j=0;j<rep.length;++j){
			stasto = rep[j].split("-");
			tmp = new Array();
			tmp.push( Code.getArrayListFromTimeString(stasto[0]) ); // start time
			tmp.push( Code.getArrayListFromTimeString(stasto[1]) ); // plus time
			arr.push(tmp);
		}
	}
	return daysOfWeek; // DAYSOFWEEK[ PAIRS[ START[HH,MM,SS,NNNN],STOP[HH,MM,SS,NNNN] ], ... ]
}

Code.humanReadableRepeatString = function(alg){
	var i, j, lm1, pairs, begin, add, str="";
	var dow = ["M","T","W","R","F","S","U"];
	var daysOfWeek = Code.getLogicalArrayFromRepeatString(alg);
	var count = 0, found = 0;
	for(i=0;i<daysOfWeek.length;++i){
		if(daysOfWeek[i].length>0){
			++count;
		}
	}
	for(i=0;i<daysOfWeek.length;++i){
		pairs = daysOfWeek[i];
		if(pairs.length>0){
			str += dow[i]+"[";
			var lm1 = pairs.length-1;
			for(j=0;j<=lm1;++j){
				begin = pairs[j][0];
				add = pairs[j][1];
				str += Code.prependFixed(begin[0]+"","0",2)+":"+Code.prependFixed(begin[1]+"","0",2); // ignore ss,nnn
				str += " +"+Code.prependFixed(add[0]+"","0",2)+":"+Code.prependFixed(add[1]+"","0",2); // ignore ss,nnn
				if(j<lm1){
					str += " | ";
				}
			}
			str += "]";
			//
			++found;
			if(found<count){
				str += ", ";
			}
		}
	}
	return str;
}

Code.getShortDateDescriptiveString = function(date,timeOnly){
	var hrs = date.getHours();
	if(hrs>=13){ hrs -= 12; }
	if(hrs==0){ hrs=12; }
	var str = hrs+":"+Code.prependFixed(date.getMinutes()+"","0",2)+Code.getAMPMFromDate(date);
	if(timeOnly){ return str; }
	return (date.getMonth()+1)+"/"+date.getDate()+"/"+((date.getFullYear()+"").substr(2,2))+" "+str;
}
Code.getShortDateDescriptiveStringTime = function(date){
	return Code.getShortDateDescriptiveString(date,true);
}

Code.phoneAsNumbersToHuman = function(phone){
	var len = phone.length;
	var lm1 = len-1;
	if(len<=4){
		return phone;
	}else if(len<=7){
		return phone.substring(0,lm1-3)+"-"+phone.substring(lm1-3,len);
	}else if(len<=10){
		return "("+phone.substring(0,lm1-6)+")"+phone.substring(lm1-6,lm1-3)+"-"+phone.substring(lm1-3,len);
	}
	return phone.substring(0,lm1-9)+"-"+phone.substring(lm1-9,lm1-6)+"-"+phone.substring(lm1-6,lm1-3)+"-"+phone.substring(lm1-3,len);
}

Code.escapeHTML = function(str){
	return (str+"")
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// ENCODE URL STRING SAFE FOR SENDING:
// encodeURIComponent(str)
// encodeURI(str)
// escape(str)

// ------------------------------------------------------------------------------------------------------------------------------------------------- formatting
Code.padString = function(val,wid,filler){
	return Code.padStringLeft(val,wid,filler);
}
Code.padStringLeft = function(val,wid,filler){
	filler = filler!==undefined?filler:" ";
	var str = val;
	while(str.length<wid){
		str = str + filler;
	}
	return str;
}
Code.padStringRight = function(val,wid,filler){
	filler = filler!==undefined?filler:" ";
	var str = val;
	while(str.length<wid){
		str = filler + str;
	}
	return str;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- MATHS
Code.distancePoints2D = function(ax,ay, bx,by){
	return Math.sqrt(Math.pow(ax-bx,2) + Math.pow(ay-by,2));
}

Code.moduloFloat = function(a,b){ // a%b
	return a - Math.floor(a/b)*b;
}

Code.trimMaxEnds = function(a,b){
	while(a.length>1 && a[0]>a[1]){ a.shift(); b.shift(); } // left
	while(a.length>1 && a[a.length-1]>a[a.length-2]){ a.pop(); b.pop(); } // right
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- transform matrices
Code.separateAffine2D = function(a,b,c,d, tx,ty){
	var scaleX = Math.sqrt(a*a+b*b);
	var scaleY = Math.sqrt(c*c+d*d);
	var rotationA = Math.atan(c/d);
	var rotationB = Math.atan(-b/a);
	var rotation = (rotationA+rotationB)*0.5;
	return {scaleX:scaleX, scaleY:scaleY, scale:(scaleX+scaleY)*0.5, rotation:rotation, translationX:tx, translationY:ty};
}

//------------------------------------------------------------------------------------------------------------------------------------------------- matrices
Code.inverse2x2 = function(arr, a,b,c,d){
	var det = a*d - b*c;
	if(det==0){ return null; }
	det = 1/det;
	arr[0] = det*d;
	arr[1] = -det*b;
	arr[2] = -det*c;
	arr[3] = det*a;
	return arr;
}
Code.inverse3x3 = function(arr, a,b,c,d,e,f,g,h,i){
	var x = e*i-f*h;
	var y = f*g-d*i;
	var z = d*h-e*g;
	var det = a*x + b*y + c*z;
	if(det==0){ return null; }
	det = 1/det;
	arr[0] = det*x;
	arr[1] = det*(c*h-b*i);
	arr[2] = det*(b*f-c*e);
	arr[3] = det*y;
	arr[4] = det*(a*i-c*g);
	arr[5] = det*(c*d-a*f);
	arr[6] = det*z;
	arr[7] = det*(b*g-a*h);
	arr[8] = det*(a*e-b*d);
	return arr;
}
Code.inverse4x4 = function(arr, a,b,c,d, e,f,g,h, i,j,h,k, l,m,n,o){ // http://www.cg.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/teche23.html
	var det = 0;
	if(det==0){ return null; }
	det = 1/det;
	return arr;
}
Code.mult3x3by3x1toV3D = function(v, tbt, tbo){
	v.x = tbo[0]*tbt[0] + tbo[1]*tbt[1] + tbo[2]*tbt[2];
	v.y = tbo[0]*tbt[3] + tbo[1]*tbt[4] + tbo[2]*tbt[5];
	v.z = tbo[0]*tbt[6] + tbo[1]*tbt[7] + tbo[2]*tbt[8];
}
Code.mult2x2by2x1toV2D = function(v, tbt, tbo){
	v.x = tbo[0]*tbt[0] + tbo[1]*tbt[1];
	v.y = tbo[0]*tbt[2] + tbo[1]*tbt[3];
}
//------------------------------------------------------------------------------------------------------------------------------------------------- interpolation - 1D
Code.findMaxima1D = function(d){
	var i, lenM1 = d.length-1, a,b,c, v, list = [];
	for(i=1;i<lenM1;++i){
		a = d[i-1]; b = d[i]; c = d[i+1];
		if(b>=a&&b>=c){
			v = Code.interpolateExtrema1D(new V2D(), a,b,c);
			if(v){ v.x += i; list.push(v); }
		}
	}
	return list;
}
Code.findMinima1D = function(d){
	var i, lenM1 = d.length-1, a,b,c, v, list = [];
	for(i=1;i<lenM1;++i){
		a = d[i-1]; b = d[i]; c = d[i+1];
		if(b<=a&&b<=c){
			v = Code.interpolateExtrema1D(new V2D(), a,b,c);
			if(v){ v.x += i; list.push(v); }
		}
	}
	return list;
}
Code.findExtrema1D = function(d){
	var i, lenM1 = d.length-1, a,b,c, v, list = [];
	for(i=1;i<lenM1;++i){
		a = d[i-1]; b = d[i]; c = d[i+1];
		if( (b<=a&&b<=c) || (b>=a&&b>=c) ){
			v = Code.interpolateExtrema1D(new V2D(), a,b,c);
			if(v){ v.x += i; list.push(v); }
		}
	}
	return list;
}
Code.findExtrema1DSecondary = function(value, linearValues){
	var base = Math.floor(value.x);
	var remainder = value.x - base;
	value.x = linearValues[base]+remainder;
	return value;
}
Code.findGlobalExtrema1D = function(yVals, noEnds){
	var val, i, lenM1 = yVals.length-1;
	var min = yVals[0], max = yVals[0];
	var minIndex = 0, maxIndex = 0;
	for(i=1;i<=lenM1;++i){
		val = yVals[i];
		if(val>max){ max = val; maxIndex = i; }
		if(val<min){ min = val; minIndex = i; }
	}
	if(maxIndex!=0&&maxIndex!=lenM1){ // find local maxima
		max = Code.interpolateExtrema1D(new V2D(), yVals[maxIndex-1], yVals[maxIndex], yVals[maxIndex+1]);
		max.x += maxIndex;
	}else if( !(noEnds===true) ){
		max = new V2D(maxIndex,yVals[maxIndex]);
	}else{
		max = null;
	}
	if(minIndex!=0&&minIndex!=lenM1){ // find local minima
		min = Code.interpolateExtrema1D(new V2D(), yVals[minIndex-1], yVals[minIndex], yVals[minIndex+1]);
	}else if( !(noEnds===true) ){
		min = new V2D(minIndex,yVals[minIndex]);
		min.x += minIndex;
	}else{
		min = null;
	}
	return {min:min, max:max};
}
Code.interpolateExtrema1D = function(loc, a,b,c){
	var dxdx = (c-2.0*b+a);
	if(dxdx==0){ return null; }
	var dx = (c-a)*0.5;
	loc.x = -dx/dxdx;
	loc.y = b + 0.5*dx*loc.x;
	return loc;
}
Code.findExtrema1DDiff = function(xVals,yVals, noEnds){
	var val, i, lenM1 = yVals.length-1;
	var min = yVals[0], max = yVals[0];
	var minIndex = 0, maxIndex = 0;
	for(i=1;i<=lenM1;++i){
		val = yVals[i];
		if(val>max){ max = val; maxIndex = i; }
		if(val<min){ min = val; minIndex = i; }
	}
	if(maxIndex!=0&&maxIndex!=lenM1){ // find local maxima
		max = Code.interpolateExtrema1D(new V2D(), xVals[maxIndex-1],yVals[maxIndex-1], xVals[maxIndex],yVals[maxIndex], xVals[maxIndex+1],yVals[maxIndex+1]);
	}else{
		if(noEnds===true){
			max = null;
		}else{
			max = new V2D(xVals[maxIndex],yVals[maxIndex]);
		}
	}
	if(minIndex!=0&&minIndex!=lenM1){ // find local minima
		min = Code.interpolateExtrema1D(new V2D(), xVals[minIndex-1],yVals[minIndex-1], xVals[minIndex],yVals[minIndex], xVals[minIndex+1],yVals[minIndex+1]);
	}else{
		if(noEnds===true){
			min = null;
		}else{
			min = new V2D(xVals[minIndex],yVals[minIndex]);
		}
	}
	return {min:min, max:max};
}
Code.interpolateExtrema1DDiff = function(ext, xA,yA, xB,yB, xC,yC){ // unequal x separation
	var dx1 = xB-xA;
	var dx2 = xC-xB;
	var dx3 = xC-xA;
	var dy1 = yB-yA;
	var dy2 = yC-yB;
	var dy3 = yC-yA;
	var dD = dy3/dx3;
	var ddD = 0.5*(dy2-dy1)/(dx2-dx1);
	x = -dD/ddD;
	ext.y = yB + 0.5*x*dD;
	ext.x = x + xB;
	return ext;
}
//------------------------------------------------------------------------------------------------------------------------------------------------- interpolation - 2D
Code.gradient2D = function(loc,d0,d1,d2,d3,d4,d5,d6,d7,d8){
	loc.x = (d5-d3)*0.5;
	loc.y = (d7-d1)*0.5;
}
Code.findExtrema2DFloat = function(d, wid,hei){
	var i, j, hm1=hei-1, wm1=wid-1, list = [];
	var jW0, jW1, jW2, i0,i1,i2;
	var d0,d1,d2,d3,d4,d5,d6,d7,d8;
	var result, count = 0;
	var eps = 1.0; // 0.5;
	for(j=1;j<hm1;++j){
		jW0 = (j-1)*wid; jW1 = j*wid; jW2 = (j+1)*wid;
		for(i=1;i<wm1;++i){
			i0 = i-1; i1 = i; i2 = i+1;
			d0 = d[jW0+i0]; d1 = d[jW0+i1]; d2 = d[jW0+i2]; d3 = d[jW1+i0]; d4 = d[jW1+i1]; d5 = d[jW1+i2]; d6 = d[jW2+i0]; d7 = d[jW2+i1]; d8 = d[jW2+i2];
			if( (d0<d4&&d1<d4&&d2<d4&&d3<d4&&d5<d4&&d6<d4&&d7<d4&&d8<d4) // maxima
			||  (d0>d4&&d1>d4&&d2>d4&&d3>d4&&d5>d4&&d6>d4&&d7>d4&&d8>d4) ){ // minima
				result = Code.extrema2DFloatInterpolate(new V3D(), d0,d1,d2,d3,d4,d5,d6,d7,d8);
				if(result==null){ continue; }
				if(Math.abs(result.x)<eps && Math.abs(result.y)<eps){ // inside window
					result.x += i; result.y += j;
					list.push(result);
				}else{ // need to interpolate at a neighbor
					//	console.log("result; "+result.toString());
				}
			}
		}
	}
	return list;
}
Code._tempMatrixArray2 = [0,0];
Code._tempMatrixArray4 = [0,0,0,0];
Code.extrema2DFloatInterpolate = function(loc, d0,d1,d2,d3,d4,d5,d6,d7,d8){ // 
	var dx = (d5-d3)*0.5;
	var dy = (d7-d1)*0.5;
	var dxdx = (d5-2.0*d4+d3);
	var dydy = (d7-2.0*d4+d1);
	var dxdy = (d8-d6-d2+d0)*0.25;
	var Hinv = Code.inverse2x2(Code._tempMatrixArray4, dxdx,dxdy, dxdy,dydy);
	if(!Hinv){ return null; }
	var dD = Code.setArray(Code._tempMatrixArray2,dx,dy);
	Code.mult2x2by2x1toV2D(loc, Hinv,dD);
	loc.x = -loc.x; loc.y = -loc.y;
	loc.z = d4 + 0.5*(dx*loc.x + dy*loc.y);
	return loc;
}
//------------------------------------------------------------------------------------------------------------------------------------------------- interpolation - 3D
Code.findExtrema3D = function(a,b,c, wid,hei, k){ // a=-1, b=0, c=+1
	k = k!==undefined?k:0;
	var i, j, hm1=hei-1, wm1=wid-1, list = [];
	var a0,a1,a2,a3,a4,a5,a6,a7,a8, b0,b1,b2,b3,b4,b5,b6,b7,b8, c0,c1,c2,c3,c4,c5,c6,c7;
	var jW0,jW1,jW2, i0,i1,i2, result;
	var eps = 1.0; // 0.5;
	for(j=1;j<hm1;++j){
		jW0 = (j-1)*wid, jW1 = j*wid, jW2 = (j+1)*wid;
		for(i=1;i<wm1;++i){
			i0 = i-1; i1 = i; i2 = i+1;
			a0 = a[jW0+i0]; a1 = a[jW0+i1]; a2 = a[jW0+i2]; a3 = a[jW1+i0]; a4 = a[jW1+i1]; a5 = a[jW1+i2]; a6 = a[jW2+i0]; a7 = a[jW2+i1]; a8 = a[jW2+i2];
			b0 = b[jW0+i0]; b1 = b[jW0+i1]; b2 = b[jW0+i2]; b3 = b[jW1+i0]; b4 = b[jW1+i1]; b5 = b[jW1+i2]; b6 = b[jW2+i0]; b7 = b[jW2+i1]; b8 = b[jW2+i2];
			c0 = c[jW0+i0]; c1 = c[jW0+i1]; c2 = c[jW0+i2]; c3 = c[jW1+i0]; c4 = c[jW1+i1]; c5 = c[jW1+i2]; c6 = c[jW2+i0]; c7 = c[jW2+i1]; c8 = c[jW2+i2];
			if((a0<b4&&a1<b4&&a2<b4&&a3<b4&&a4<b4&&a5<b4&&a6<b4&&a7<b4&&a8<b4 // maxima
			&& b0<b4&&b1<b4&&b2<b4&&b3<b4    &&   b5<b4&&b6<b4&&b7<b4&&b8<b4
			&& c0<b4&&c1<b4&&c2<b4&&c3<b4&&c4<b4&&c5<b4&&c6<b4&&c7<b4&&c8<b4)
			||
			(a0>b4&&a1>b4&&a2>b4&&a3>b4&&a4>b4&&a5>b4&&a6>b4&&a7>b4&&a8>b4 // minima
			&& b0>b4&&b1>b4&&b2>b4&&b3>b4    &&   b5>b4&&b6>b4&&b7>b4&&b8>b4
			&& c0>b4&&c1>b4&&c2>b4&&c3>b4&&c4>b4&&c5>b4&&c6>b4&&c7>b4&&c8>b4) ){
				result = Code.extrema3DInterpolate(new V4D(),a1,a3,a4,a5,a7, b0,b1,b2,b3,b4,b5,b6,b7,b8, c1,c3,c4,c5,c7);
				if(result==null){ continue; }
				if(Math.abs(result.x)<eps && Math.abs(result.y)<eps && Math.abs(result.z)<eps){ // inside window
					result.x += i; result.y += j; result.z += k;
					list.push(result);
				}else{ // need to interpolate at a neighbor
					//	console.log("result; "+result.toString());
				}
			}
		}
	}
	return list;
}
Code._tempMatrixArray3 = [0,0,0];
Code._tempMatrixArray9 = [0,0,0, 0,0,0, 0,0,0];
Code.extrema3DInterpolate = function(loc, a1,a3,a4,a5,a7, b0,b1,b2,b3,b4,b5,b6,b7,b8, c1,c3,c4,c5,c7, keepDet){ // a is bot, b is middle, c is top
	var dx = (b5-b3)*0.5;
	var dy = (b7-b1)*0.5;
	var dz = (c4-a4)*0.5;
	var dxdx = (b5-2.0*b4+b3);
	var dydy = (b7-2.0*b4+b1);
	var dzdz = (c4-2.0*b4+a4);
	var dxdy = (b8-b6-b2+b0)*0.25;
	var dxdz = (c5-c3-a5+a3)*0.25;
	var dydz = (c7-c1-a7+a1)*0.25;
	var Hinv = Code.inverse3x3(Code._tempMatrixArray9, dxdx,dxdy,dxdz, dxdy,dydy,dydz, dxdz,dydz,dzdz);
	if(!Hinv){ return null; }
	var dD = Code.setArray(Code._tempMatrixArray3, dx,dy,dz);
	Code.mult3x3by3x1toV3D(loc, Hinv,dD);
	loc.x = -loc.x; loc.y = -loc.y; loc.z = -loc.z;
	loc.t = b4 + 0.5*(dx*loc.x + dy*loc.y + dz*loc.z);
	return loc;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------- SINGLE-FUNCTION INTERPOLATION
Code.linear1DRatio = function(C, A,B){
	return (C-A)/(B-A);
}
Code.linear1D = function(t, A,B){
	return t*B + (1.0-t)*A;
}
Code.linear2D = function(x,y, A,B,C,D){
	return Code.linear1D(y, Code.linear1D(x,A,B), Code.linear1D(x,C,D));
}



// ------------------------------------------------------------------------------------------------------------------------------------------------- INTERSECTIONS 2D
Code.lineSegIntersect2D = function(a,b, c,d){ // x,y = point | z = %ab, t = %cd
	var caX = (c.x - a.x);
	var dcX = (d.x - c.x);
	var baX = (b.x - a.x);
	var caY = (c.y - a.y);
	var dcY = (d.y - c.y);
	var baY = (b.y - a.y);
	var den = baY*dcX - baX*dcY;
	if(den == 0){
		return null;
	}
	var num1 = baX*caY - baY*caX;
	var num2 = dcX*caY - dcY*caX; // dcX*acY-dcY*acX;
	var t1 = num1/den; // (baX*caY-baY*caX)/(dcX*baY-dcY*baX);
	var t2 = num2/den; // (dcX*acY-dcY*acX)/(baX*dcY-baY*dcX);
	if(t1 < 0 || t1 > 1 || t2 < 0 || t2 > 1){ // outside time frame
		return null;
	}
	return new V4D( a.x+t2*baX, a.y+t2*baY, t2, t1 ); // new V4D( c.x+t1*dcX, c.y+t1*dcY, t1, t2 );
}
Code.rayLineIntersect2D = function(a,b, c,d){ // two infinite lines
	var den = b.y*d.x - b.x*d.y;
	if(den == 0){ return null; } // infinite or zero intersections
	var num = (d.x*(c.y-a.y) + d.y*(a.x-c.x));
	var t = num/den;
	return new V2D(a.x+t*b.x, a.y+t*b.y); // num = (b.x*(c.y-a.y) + b.y*(a.x-c.x)); return new V2D(c.x+t2*d.x, c.y+t2*d.y);
}
Code.rayIntersect2D = function(a,b, c,d){ // positive intersections of two infinite rays
	var den = b.y*d.x - b.x*d.y;
	if(den == 0){ return null; }
	var num1 = (d.x*(c.y-a.y) + d.y*(a.x-c.x));
	var num2 = (b.x*(c.y-a.y) + b.y*(a.x-c.x));
	var t1 = num1/den;
	var t2 = num2/den;
	if(t1>=0 && t2>=0){
		return new V2D(a.x+t1*b.x, a.y+t1*b.y);
	}
	return null;
}
Code.rayFiniteIntersect2D = function(a,b, c,d){ // two finite rays
	var den = b.y*d.x - b.x*d.y;
	if(den == 0){ return null; }
	var num1 = (d.x*(c.y-a.y) + d.y*(a.x-c.x));
	var num2 = (b.x*(c.y-a.y) + b.y*(a.x-c.x));
	var t1 = num1/den;
	var t2 = num2/den;
	if(t1>=0 && t1<=1.0 && t2>=0 && t2<=1.0){
		return new V2D(a.x+t1*b.x, a.y+t1*b.y);
	}
	return null;
}
Code.closestPointLine2D = function(org,dir, point){ // infinite ray and point
	var t = (V2D.dot(dir,point)-V2D.dot(org,dir))/V2D.dot(dir,dir);
	return new V3D(org.x+t*dir.x,org.y+t*dir.y);
}
Code.closestPointLineSegment2D = function(org,dir, point){ // finite ray and point
	var t = (V2D.dot(dir,point)-V2D.dot(org,dir))/V2D.dot(dir,dir);
	if(t<=0){
		return new V2D(org.x,org.y);
	}else if(t>=1){
		return new V2D(org.x+dir.x,org.y+dir.y);
	}
	return new V2D(org.x+t*dir.x,org.y+t*dir.y);
}




/*


*/
Code.parabolaABCFromFocusDirectrix = function(focA,c){
	var a = focA.x, b = focA.y;
	var A = 1/(2.0*(b-c));
	var B = -2.0*a*A;
	var C = (a*a + b*b - c*c)*A;
	return {a:A,b:B,c:C};
	//return [A,B,C];
}
Code.parabolaFocusDirectrixFromABC = function(A,B,C){
	if(A==0){ return null; }
	var h = -0.5*B/A;
	var k = A*h*h + B*h + C;
	var p = 0.25/A;
	return {focus:new V2D(h,k+p), directrix:k-p};
}
Code.intersectionParabolas = function(focA,dirA, focB,dirB){
	var a1 = focA.x, b1 = focA.y, c1 = dirA;
	var a2 = focB.x, b2 = focB.y, c2 = dirB;
	var x, y, divA = (b1-c1), divB = (b2-c2);
	var A1 = 0.5/divA;
	var B1 = -2.0*a1*A1;
	var C1 = (a1*a1 + b1*b1 - c1*c1)*A1;
	var A2 = 0.5/divB;
	var B2 = -2.0*a2*A2;
	var C2 = (a2*a2 + b2*b2 - c2*c2)*A2;
	if(divA==0 && divB==0){ // two lines at same directrix
		if(focA.x==focB.x){ // y must also be equal
			return [new V2D().copy(focA)];
		}
		return null;
	}else if(divA==0){ // single line A
		x = focA.x;
		y = A2*x*x + B2*x + C2;
		return [new V2D(x,y)];
	}else if(divB==0){ // single line B
		x = focB.x;
		y = A1*x*x + B1*x + C1;
		return [new V2D(x,y)];
	}
	var A = A1-A2, B = B1-B2, C = C1-C2;
	var intAx, intAy, intBx, intBy;
	var inside = B*B - 4*A*C;
	if(A==0 && B==0 && C!=0){ return null; }  // inconsistent
	if(inside<0){ return null; } // imaginary
	if(A==0){ // single intersection Bx + C = 0
		if(C==0){ return null; } // infinite intersections (no constraints)
		intAx = -C/B;
		intAy = A1*intAx*intAx + B1*intAx + C1; // intAy = A2*intAx*intAx + B2*intAx + C2;
		return [new V2D(intAx,intAy)];
	} // two intersections
	if(inside==0){ // real repeated - WHEN DOES THIS HAPPEN?
		intAx = -0.5*B/A;
		intAy = A1*intAx*intAx + B1*intAx + C1;
		return [new V2D(intAx,intAy)];
	}
	var sqrt = Math.sqrt(inside);
	intAx = 0.5*(sqrt - B)/A;
	intBx = -0.5*(B +sqrt)/A;
	intAy = A1*intAx*intAx + B1*intAx + C1;
	intBy = A1*intBx*intBx + B1*intBx + C1;
	return [new V2D(intAx,intAy), new V2D(intBx,intBy)];
}
Code.pointAboveParabola = function(focus,directrix, point){
	var abc = Code.parabolaABCFromFocusDirectrix(focus,directrix);
	var a = abc[0], b = abc[1],c = abc[2];
	var yVal = a*point.x*point.x + b*point.x + c;
	if(point.y>yVal){
		return true;
	}
	return false;
}
Code.intersectionRayParabola = function(org,dir, foc,drx){
	if(foc.y==drx.y){ // infinitely thin parabola
		if(dir.x==0){ // infinite or 0 intersections
			return null;
		}
		var t = (drx.x - org.x)/dir.x;
		return(new V2D(org.x+t*dir.x,org.y+t*dir.y));
	}
	var list = Code.parabolaABCFromFocusDirectrix(foc,drx);
	var pA = list.a, pB = list.b, pC = list.c;
	if(dir.x==0){ // vertical line intersects at single point
		console.log("vertical");
		return [new V2D(org.x, pA*org.x*org.x + pB*org.x + pC)];
	}
	var m = dir.y/dir.x;
	var b = org.y - m*org.x;
	var A = pA, B = pB-m, C = pC-b;
	console.log("A: "+A);
	console.log("B: "+B);
	console.log("C: "+C);
	if(A==0){ // single intersection
		console.log("single");
		var x1 = -C/B;
		var y1 = pA*x1*x1 + pB*x1 + pC;
		return [new V2D(x1,y1)];
	}
	var inside = B*B - 4*A*C;
	console.log("inside: "+inside);
	if(inside<0){ // imaginary = no intersection
		console.log("imaginary");
		return null;
	}
	var sqrt = Math.sqrt(inside);
	console.log("sqrt: "+sqrt);
	if(inside==0){ // repeated real intersections
		console.log("double real");
		var x1 =  0.5*(sqrt - B)/A;
		var y1 = pA*x1*x1 + pB*x1 + pC;
		return [new V2D(x1,y1)];
	} // two real intersection
	var x1 =  0.5*(sqrt - B)/A;
	var x2 = -0.5*(sqrt + B)/A;
	var y1 = pA*x1*x1 + pB*x1 + pC;
	var y2 = pA*x2*x2 + pB*x2 + pC;
	return [new V2D(x1,y1), new V2D(x2,y2)];
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- CIRCLES
Code.circleFromPoints = function(a,b,c){
	var lineAB = V2D.diff(a,b);
	var lineBC = V2D.diff(b,c);
	//var lineAC = V2D.diff(a,c);
	var rotAB = V2D.rotate(lineAB,Math.PIO2);
	var rotBC = V2D.rotate(lineBC,Math.PIO2);
	//var rotAC = V2D.rotate(lineAC,Math.PIO2);
	var midAB = V2D.midpoint(a,b);
	var midBC = V2D.midpoint(b,c);
	//var midAC = V2D.midpoint(a,c);
	var cenA = Code.rayLineIntersect2D(midAB,rotAB, midBC,rotBC);
	//var cenB = Code.rayLineIntersect2D(midBC,rotBC, midAC,rotAC);
	//var cenC = Code.rayLineIntersect2D(midAC,rotAC, midAB,rotAB);
	if(cenA){ // entering in duplicate points kills me
		var lenA = V2D.distance(cenA,a);
		//var lenB = V2D.distance(cenB,b);
		//var lenC = V2D.distance(cenC,c);
		return {center:cenA, radius:lenA};
	}
	return null;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- INTERSECTIONS 3D
Code.closestPointTLine3D = function(org,dir, point){ // infinite ray and point - t value
	return (V3D.dot(dir,point)-V3D.dot(org,dir))/V3D.dot(dir,dir);
}
Code.closestPointLine3D = function(org,dir, point){ // infinite ray and point
	var t = (V3D.dot(dir,point)-V3D.dot(org,dir))/V3D.dot(dir,dir);
	return new V3D(org.x+t*dir.x,org.y+t*dir.y,org.z+t*dir.z);
}
Code.closestPointLineSegment3D = function(org,dir, point){ // finite ray and point
	var t = (V3D.dot(dir,point)-V3D.dot(org,dir))/V3D.dot(dir,dir);
	if(t<=0){
		return new V3D(org.x,org.y,org.z);
	}else if(t>=1){
		return new V3D(org.x+dir.x,org.y+dir.y,org.z+dir.z);
	}
	return new V3D(org.x+t*dir.x,org.y+t*dir.y,org.z+t*dir.z);
}

Code.intersectRayPlane = function(org,dir, pnt,nrm){ // infinite ray - plane intersection
	var num = nrm.x*(pnt.x-org.x) + nrm.y*(pnt.y-org.y) + nrm.z*(pnt.z-org.z);
	if(num==0){ return (new V3D()).copy(org); } // point is already in plane (first of possibly infinite intersections)
	var den = nrm.x*dir.x + nrm.y*dir.y + nrm.z*dir.z;
	if(den==0){ return null; } // zero or infinite intersections
	var t = num/den;
	return new V3D(org.x+t*dir.x,org.y+t*dir.y,org.z+t*dir.z);
}
Code.intersectRayTri = function(org,dir, a,b,c, nrm){ // finite ray - tri intersection
	var num, den, ab, ac, bc, ca, ap, bp, cp, p, u, v, w;
	ab = V3D.sub(b,a);
	ac = V3D.sub(c,a);
	if(nrm===undefined){ nrm = V3D.cross(ab,bc).norm(); }
	num = nrm.x*(a.x-org.x) + nrm.y*(a.y-org.y) + nrm.z*(a.z-org.z);
	if(num==0){ return (new V3D()).copy(org); } // point is already in plane (first of possibly infinite intersections)
	den = nrm.x*dir.x + nrm.y*dir.y + nrm.z*dir.z;
	if(den==0){ return null; } // zero or infinite intersections
	t = num/den;
	if(t<0 || t>1){ return null; } // outside ray
	p = new V3D(org.x+t*dir.x,org.y+t*dir.y,org.z+t*dir.z);
	// edges
	bc = V3D.sub(c,b);
	ca = V3D.sub(a,c);
	// to point
	ap = V3D.sub(b,a);
	bp = V3D.sub(c,b);
	cp = V3D.sub(a,c);
	// area directionals
	u = V3D.dot(V3D.cross(ap,ab),nrm);
	v = V3D.dot(V3D.cross(bp,bc),nrm);
	w = V3D.dot(V3D.cross(cp,ca),nrm);
	if( (u>=0 && v>=0 && w>=0) || (u<=0 && v<=0 && w<=0) ){
		return p;
	}
	return null;
}
Code.planeEquationFromPointNormal = function(pnt,nrm){
	var q = new V3D(nrm.x,nrm.y,nrm.z); q.norm();
	var dot = (q.x*pnt.x + q.y*pnt.y +  q.z*pnt.z); // q.scale(dot);
	return {a:nrm.x, b:nrm.y, c:nrm.z, d:dot};
}
Code.planePointNormalFromEquation = function(a,b,c,d){
	var nrm = new V3D(a,b,c);
	var len = nrm.length();
	if(len!=0.0){ len = 1.0/len; }
	return {normal:nrm, point:new V3D(a*d*len,b*d*len,c*d*len)};
}


// ------------------------------------------------------------------------------------------------------------------------------------------------- CLOSEST POINT 3D
Code.closestPointsSegments3D = function(oa,da, ob,db){ // finite ray-ray closet points
	var A, B, ta, tb;
	var dot_dada = V3D.dot(da,da);
	var dot_dadb = V3D.dot(da,db);
	var dot_dbdb = V3D.dot(db,db);
	var dot_oada = V3D.dot(oa,da);
	var dot_obdb = V3D.dot(ob,db);
	var dot_oadb = V3D.dot(oa,db);
	var dot_obda = V3D.dot(ob,da);
	var den = dot_dada*dot_dbdb - dot_dadb*dot_dadb;
	if(den==0){ // parallel, pick some point & match
		A = new V3D(ob.x+db.x,ob.y+db.y,ob.z+db.z);
		ta = Code.closestPointTLine3D(oa,db,oa); // 0
		tb = Code.closestPointTLine3D(A ,db,oa); // 1

// HERE - FINISH

		A = null;
		B = null;
	}else{
		var oadb_obdb = dot_oadb - dot_obdb;
		var obda_oada = dot_obda - dot_oada;
		ta = (dot_dadb*oadb_obdb + dot_dbdb*obda_oada)/den;
		tb = (dot_dadb*obda_oada + dot_dada*oadb_obdb)/den;
		ta = Math.min(Math.max(ta,0.0),1.0);
		tb = Math.min(Math.max(tb,0.0),1.0);
		A = new V3D(oa.x+ta*da.x, oa.y+ta*da.y, oa.z+ta*da.z);
		B = new V3D(ob.x+tb*db.x, ob.y+tb*db.y, ob.z+tb*db.z);
	}
	return [A,B];
}
Code.closestPointsLines3D = function(oa,da, ob,db){ // infinite ray-ray closet points
	var dot_dada = V3D.dot(da,da);
	var dot_dadb = V3D.dot(da,db);
	var dot_dbdb = V3D.dot(db,db);
	var dot_oada = V3D.dot(oa,da);
	var dot_obdb = V3D.dot(ob,db);
	var dot_oadb = V3D.dot(oa,db);
	var dot_obda = V3D.dot(ob,da);
	var den = dot_dadb*dot_dadb-dot_dbdb*dot_dada;
	if(den==0){ // parallel = infinite points
		return null;
	}
	var X = dot_dadb;
	var Y = dot_dada;
	var C = dot_obda - dot_oada;
	var D = dot_obdb - dot_oadb;
	var num = (D*Y-C*X);
	var tb = num/den;
	var ta = (tb*dot_dadb - dot_oada + dot_obda)/dot_dada;
	var A = new V3D(oa.x+ta*da.x, oa.y+ta*da.y, oa.z+ta*da.z);
	var B = new V3D(ob.x+tb*db.x, ob.y+tb*db.y, ob.z+tb*db.z);
	return [A,B];
}
Code.closestPointPlane3D = function(o,d, b){ // 
	var t = ((b.x-o.x)*d.x + (b.y-o.y)*d.y + (b.z-o.z)*d.z)/d.length();
	return new V3D(b.x+t*d.x,b.y+t*d.y,b.z+t*d.z);
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- 
Code.parabolaFromDirectrix = function(a,b, c, x){ // y = focus, directrix, x
	return ((x-a)*(x-a) + b*b - c*c)/(2*(b-c));
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- 
Code.ssdWindow = function(needle,widN,heiN, haystack,widH,heiH){
	return ImageMat.ssd(image,imageWidth,imageHeight, operator,operatorWidth,operatorHeight);
}
Code.ssdWindowInside = function(needle,widN,heiN, haystack,widH,heiH){
	return ImageMat.ssdInner(image,imageWidth,imageHeight, operator,operatorWidth,operatorHeight);
}

// ------------------------------------------------------------------------------------------------------------------------------------------------- 


Code.cuboidsSeparate = function(aMin,aMax, bMin,bMax){
	return aMax.x<bMin.x || aMax.y<bMin.y || aMax.z<bMin.z || aMin.x>bMax.x || aMin.y>bMax.y || aMin.z>bMax.z;
}





/*
function.call(this, a, b, c);
function.apply(this,arg);
*/

// base64
