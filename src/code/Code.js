// Code.js 
// OVERRIDES:
Math.PI2 = Math.PI*2.0;
Math.TAU = Math.PI*2.0;
Math.PIO2 = Math.PI*0.5;
// 
Code.IS_IE = navigator && navigator.appName && (navigator.appName).toLowerCase().indexOf("explorer") >= 0; // (document.body.attachEvent && window.ActiveXObject);
Code.IS_OPERA = navigator && navigator.appVersion && (navigator.appVersion).toLowerCase().indexOf("opera") >= 0; // guess
Code.IS_SAFARI = navigator && navigator.appVersion && (navigator.appVersion).toLowerCase().indexOf("safari") >= 0;
Code.IS_FF = navigator && navigator.appVersion && (navigator.appVersion).toLowerCase().indexOf("mozilla") >= 0; // guess
Code.IS_CHROME = navigator && navigator.appVersion && (navigator.appVersion).toLowerCase().indexOf("chrome") >= 0;

Code.TYPE_OBJECT = "object";
Code.TYPE_ARRAY = 'array';
Code.TYPE_FUNCTION = "function";
Code.TYPE_NUMBER = "number";
Code.TYPE_STRING = "string";
Code.TYPE_UNDEFINED = "undefined";

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
Code.JS_EVENT_TOUCH_TAP = "tap";
Code.JS_EVENT_TOUCH_DOUBLE_TAP = "dbltap";

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
Code.JS_EVENT_CHANGE = "change"; // ?
	Code.JS_EVENT_ONCHANGE = "onchange";
Code.JS_EVENT_INPUT_CHANGE = "input";
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
Code.JS_EVENT_TEXT_INPUT = "textinput";
	Code.JS_EVENT_ON_INPUT = "oninput";


Code.JS_CURSOR_STYLE_NONE = "none";						// hides cursor
Code.JS_CURSOR_STYLE_DEFAULT = "auto";					// 
Code.JS_CURSOR_STYLE_DEFAULT = "default";				// ^
Code.JS_CURSOR_STYLE_CROSSHAIR = "crosshair";			// +
Code.JS_CURSOR_STYLE_RESIZE_TOP = "n-resize";			// ^|
Code.JS_CURSOR_STYLE_RESIZE_TOP_LEFT = "nw-resize";		// |\
Code.JS_CURSOR_STYLE_RESIZE_TOP_RIGHT = "ne-resize";		// /|
Code.JS_CURSOR_STYLE_RESIZE_BOTTOM = "s-resize";			// v
Code.JS_CURSOR_STYLE_RESIZE_BOTTOM_LEFT = "se-resize";	// |/
Code.JS_CURSOR_STYLE_RESIZE_BOTTOM_RIGHT = "sw-resize";	// \|
Code.JS_CURSOR_STYLE_RESIZE_RIGHT = "e-resize";			// >|
Code.JS_CURSOR_STYLE_RESIZE_LEFT = "w-resize";			// |<
Code.JS_CURSOR_STYLE_RESIZE_TL_BR = "nwse-resize";		// \
Code.JS_CURSOR_STYLE_RESIZE_TR_BL = "nesw-resize";		// /
Code.JS_CURSOR_STYLE_RESIZE_TOP_BOTTOM = "ns-resize";	// |
Code.JS_CURSOR_STYLE_RESIZE_LEFT_RIGHT = "ew-resize";	// |
Code.JS_CURSOR_STYLE_SLIDE_HORIZONTAL = "col-resize";	// <-|->
Code.JS_CURSOR_STYLE_SLIDE_VERTICAL = "row-resize";		// vertical version of: <-|->

Code.JS_CURSOR_STYLE_ALIAS = "alias";					//  curvy arrow CW
Code.JS_CURSOR_STYLE_SCROLL_ALL = "all-scroll";	 		// 4-arrows ~ move ()
Code.JS_CURSOR_STYLE_MOVE_ARROWS = "move"; 				// 4-arrows OR a hand grabbing _m
Code.JS_CURSOR_STYLE_ADD = "cell";						// crosshair - PLUS sign
Code.JS_CURSOR_STYLE_MENU = "context-menu";				// arrow + little nav infographic
Code.JS_CURSOR_STYLE_COPY = "copy";						// arrow + little add infographic
Code.JS_CURSOR_STYLE_NO_DROP = "no-drop";				// arrow + no-smoking infographic ~ not-allowed
Code.JS_CURSOR_STYLE_NO = "not-allowed";				// arrow + no-smoking infographic
Code.JS_CURSOR_STYLE_PROGRESS = "progress";				// arrow + spinning ball infographic
Code.JS_CURSOR_STYLE_WAIT = "wait";						// arrow + spinning ball infographic ~ progress

Code.JS_CURSOR_STYLE_TEXT = "text";						// I
Code.JS_CURSOR_STYLE_TEXT_VERTICAL = "vertical-text";	// I (vertical)
Code.JS_CURSOR_STYLE_ZOOM_IN = "zoom-in";				// magnifying glass + PLUS
Code.JS_CURSOR_STYLE_ZOOM_OUT = "zoom-out";				// magnifying glass + MINUS
Code.JS_CURSOR_STYLE_HELP = "help";						// ?
Code.JS_CURSOR_STYLE_GRAB = "move";						// _m
Code.JS_CURSOR_STYLE_FINGER = "pointer";					// hand pointing
//Code.JS_CURSOR_STYLE_POINT = "point";					// ^ / |m
//Code.JS_CURSOR_STYLE_WAIT = "progress";					// tick

//Code.JS_CURSOR_STYLE_ENTER_A_URL ... ("url('http://www.kirupa.com/html5/images/pointer_cursor.png')"); // external image - NOT USED?
Code.JS_CURSOR_STYLE_CAN_GRAB = "grab";
Code.JS_CURSOR_STYLE_GRABBING = "grabbing";

// http://www.htmlgoodies.com/beyond/css/article.php/3470321
Code.JS_CURSOR_STYLE_HAND = "hand"; // ~ pointer



Code.monthsShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
Code.monthsLong = ["January","February","March","April","May","June","July","August","September","October","November","December"];
Code.daysOfWeekShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // getday(0) == sunday
Code.daysOfWeekLong = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// ------------------------------------------------------------------------------------------
function Code(){
	this.www = 234;
}
Code.getType = function(obj){
	return (typeof obj);
}
Code.isNumber = function(obj){
	return (typeof obj)==Code.TYPE_NUMBER;
}
Code.isString = function(obj){
	return (typeof obj)==Code.TYPE_STRING;
}
Code.isObject = function(obj){
	return (obj && obj.constructor==Object);
	//return (typeof obj)==Code.TYPE_OBJECT; // arrays show up as objects
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
Code.parseJSON = function(str){
	var obj = str;
	if(obj===undefined || obj===null){
		console.log("UNDEFINED VARIALBE");
		obj = {};
	}else{
		//var obj = JSON.parse(str);
		if(Code.isString(obj)){
			obj = JSON.parse(obj);
		}
	}
	return obj;	
}
Code.StringFromJSON = function(obj){
	var str = JSON.stringify(obj);
	return str;
}

Code.JSONToObject = function(json){
	//return Code._JSONToObject(json);
	var data = Code._nextJSONParseOperation(json, 0, null, null);
	console.log("got data:",data);
	var object = data["object"];
	console.log(object);
	return object;
	/*
	object
	array
	index - next index
	*/
}

/*
- start a new object
	=> {...}
- start a new array
	=> [...]
- start a new string
	=> "..."
- start a new number
	=> #..(E)
- start a new bool
	=> true || false
- separate array elements or object elements
	,
*/
/*
Code._JSONToObject = function(json, index, object){
	if(!json){
		return null;
	}
	if(!object){
		index = 0;
	}
	var data = Code._nextJSONParseOperation(json, index, object, null);
	return data;
}
Code._JSONToArray = function(json, index, array){
	if(!json){
		return null;
	}
	Code._nextJSONParseOperation(json, index, null, array);
}
*/
Code._nextJSONParseOperation = function(json,index, containerObject, containerArray){
	var i, len, ch, nx, indexCh, indexNx, ret;
	i = index;
	len = json.length;
	var object = null;
	var array = null;
	var data = null;
	var isInsideString = false;
	var isEscapedChar = false;
	var wasEscapedChar = false;
	var isExpectingKey = false;
		var objectKeyIndex = null;
		var objectValue = null;
	var isExpectingValueAfterKey = false;
		var previousString = null;
		var previousMark = index;
	while(i<len){;
		wasEscapedChar = isEscapedChar;
		ret = Code._nextJSONParseCharFromString(json,i);
		ch = ret[0];
		indexCh = ret[1];
		console.log(ch);
		i = indexCh + 1;
		if(ch=='\\'){
			if(!isEscapedChar){
				console.log(" => ESCAPE");
				isEscapedChar = true;
			}else{
				console.log(" => UNESCAPE");
				isEscapedChar = false;
			}
		}else if(ch=='{'){
			console.log(" => START OBJECT");
object = {};
if(containerObject==null){
	containerObject = object;
}else{
	data = Code._nextJSONParseOperation(json,i, object, null);
	i = data["index"];
	if(containerObject){
		containerObject[objectKeyIndex] = object;
	}else if(containerArray){
		containerArray.push(object);
	}
}
			isExpectingKey = true;
		}else if(ch=='}'){
			console.log(" => END OBJECT");
			break;
		}else if(ch=='['){
			console.log(" => START ARRAY");
array = [];
if(containerArray==null){
	containerArray = array;
}else{
	data = Code._nextJSONParseOperation(json,i, null, array);
	i = data["index"];
	if(containerObject){
		containerObject[objectKeyIndex] = array;
	}else if(containerArray){
		containerArray.push(array);
	}
}
// Code.JSONToObject
		}else if(ch==']'){
			console.log(" => END ARRAY");
			break;
		}else if(ch=='"'){
			if(!isInsideString){
				console.log(" => START STRING");
				previousMark = i;
				isInsideString = true;
			}else{
				if(isEscapedChar){
					console.log(" => STILL IN STRING");
				}else{
					console.log(" => END STRING");
					isInsideString = false;
					previousString = json.substring(previousMark,i-1);
						console.log("   == '"+previousString+"'");
						if(isExpectingKey){
							objectKeyIndex = previousString;
							isExpectingKey = false;
						}else{
							objectValue = previousString;
//							isExpectingValueAfterKey = true;
							console.log("ASSIGNING: "+objectKeyIndex+" = "+objectValue);
							containerObject[objectKeyIndex] = objectValue;
						}
				}
			}
		}else if(ch==':'){
			console.log(" => SEPARATE KEY VALUE");
			isExpectingValueAfterKey = true;
		}else{
			// boolean = true / false
			// number = [0-9]*(.)[0-9]*(e|E)[0-9]*
			if(ch=='t'){
				console.log("TRUE?")
			}else if(ch=='f'){
				console.log("FALSE?")
			}
		}
		if(wasEscapedChar){ // second escape = back to normal
			isEscapedChar = !isEscapedChar;
		}
	}
	var returnData = {};
	returnData["index"] = i;
	if(containerObject!=null){
		returnData["object"] = containerObject;
	}else if(containerArray!=null){
		returnData["array"] = containerArray;
	}if(object!=null){
		returnData["object"] = object;
	}else if(array!=null){
		returnData["array"] = array;
	}
	console.log(returnData);
	return returnData;
	
}
Code._nextJSONParseCharFromString = function(str,index){
	var i, ch, len=str.length;
	for(i=index; i<len; ++i){
		ch  = str[i];
		if(ch==" " || ch=="\t" || ch=="\n" || ch=="\r"){
			continue;
		}else{
			return [ch, i];
		}
	}
	return null;
}
Code.escapeJSONString = function(str){
	return str.replace('"','\\"');
}
Code.arrayToJSON = function(array){
	var json = "[";
	var i, len, lm1, val;
	len = array.length;
	lm1 = len - 1;
	var needsComma = false;
	for(i=0; i<=lm1; ++i){
		val = array[i];
		val = Code._evaluateJSONElementToString(val);
		if(val){
			if(needsComma){
				json += ",";
			}
			json += val;
			needsComma = true;
		}
	}
	json += "]";
	return json;
}
Code.objectToJSON = function(object){
	var json = "{";
	var keys = Code.keys(object);
	var i, j, key, val, len;
	len = keys.length;
	lm1 = len - 1;
	var needsComma = false;
	for(i=0; i<=lm1; ++i){
		key = keys[i];
		val = object[key];
		key = Code._evaluateJSONElementToString(key);
		val = Code._evaluateJSONElementToString(val);
		if(key && val){
			if(needsComma){
				json += ",";
			}
			json += key+":"+val;
			needsComma = true;
		}
	}
	json += "}";
	return json;
}
Code._evaluateJSONElementToString = function(element){
	if(element==null || element==undefined){
		return "null";
	}else if(Code.isObject(element)){
		return Code.objectToJSON(element);
	}else if(Code.isArray(element)){
		return Code.arrayToJSON(element);
	}else if(Code.isString(element)){
		return '"'+Code.escapeJSONString(element)+'"';
	}else if(Code.isNumber(element)){
		return ""+element;
	} // function
	return null;
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
Code.keys = function keys(object){
	if(object){
		return Object.keys(object);
		//var keys = []; for(var key in object){ keys.push(key); } return keys;
	}
	return [];
}
Code.hasKey = function keys(object, key){
	if(object){
		return key in object;
	}
	return false;
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

Code.objectHasProperty = function(o,p){
	return o.hasOwnProperty(p);
}
Code.subProperty = function(o,list){ // Code.subProperty({"a":{"b":[{"c":666}]}},["a","b","0","c"])
	var i = 0;
	//while(o!==undefined && o!==null && i<list.length){
	while( (Code.isArray(o) || Code.isObject(o)) && i<list.length ){
		o = o[list[i]];
		++i;
	}
	return o;
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
// ------------------------------------------------------------------------------------------ EXTEND
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
// ------------------------------------------------------------------------------------------ ARRAY
Code.arrayFromCommaSeparatedString = function(str){
	return Code.arrayFromStringSeparatedString(str,",");
}
Code.arrayFromStringSeparatedString = function(str, separator){
	if(str && separator){
		return str.split(separator);
	}
	return [];
}
Code.stringFromCommaSeparatedArray = function(arr){
	return arr.join(",");
}

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
	return Code.newArrayConstant(len, 0.0);
}
Code.newArrayOnes = function(len){
	return Code.newArrayConstant(len, 1.0);
}
Code.newArrayConstant = function(len,val){
	var i, arr = new Array(len);
	for(i=len;i--;){
		arr[i] = val;
	}
	return arr;
}
Code.newArrayIndexes = function(fr,to){
	console.log(fr,to);
	if(to===undefined){
		to = fr;
		fr = 0;
	}
	var arr = new Array();
	var i, len = to-fr+1;
	for(i=0;i<len;++i){
		arr.push(fr+i);
	}
	return arr;
}
Code.setArrayConstant = function(arr,c){
	for(var i=arr.length;i--;){
		arr[i] = c;
	}
	return arr;
}
Code.arrayPushArray = function(a,b){
	var i, len=b.length;
	for(i=0;i<len;++i){
		a.push(b[i]);
	}
	return a;
}
Code.arrayUnshiftArray = function(a,b){
	var i, len=b.length;
	for(i=0;i<len;++i){
		a.unshift(b[len-i-1]);
	}
	return a;
}
// a = [0,1,2,3]
// b = [0,1,2,3]
// Code.arrayEquality(a,b)
// a = [0,1,2]
Code.arrayEquality = function(a,b, count, startA,startB){
	var lenA = a.length;
	var lenB = b.length;
	count = count!==undefined ? count : lenA ;
	startA = startA !== undefined ? startA : 0;
	startB = startB !== undefined ? startB : 0;
	count = Math.min(count,lenA-startA);
	count = Math.min(count,lenB-startB);
	var u, v, i;
	var equal = true;
	for(i=0; i<count; ++i){
		u = a[startA+i];
		v = b[startB+i];
		// console.log(u,v);
		if(u!=v){
			return false;
		}
	}
	return true;
}
// Code.pushFront = function(a,b){
// 	a.unshift(a,b);
// }
Code.arrayInsert = function(a, i, o){
	a.splice(i, 0, o);
	return a;
}
Code.arrayInsertArray = function(a, i, b){
	for(var j=0;j<b.length;++j){
		a.splice(i+j, 0, b[j]);
	}
	return a;
}
// Array.prototype.insert = function(i, o){ this.splice(i, 0, o); }
// Code.copyArray(array)
// Code.copyArray(arrayTo, arrayFrom)
// Code.copyArray(array, start, end)
// Code.copyArray(arrayTo, arrayFrom, start, end)
Code.copyArray = function(a,b,start,end){ // a = b
	if(a==b){return;}
	if(arguments.length==1){
		b=a; a=new Array(); start=0; end=b.length-1;
	}else if(arguments.length==2){
		start=0; end=b.length - 1;
	}else if(arguments.length==3){
		end=start; start=b; b=a; a=new Array();
	}else if(arguments.length==4){
		//
	}
	//if(b===undefined){ b=a; a=new Array(); }
	Code.emptyArray(a);
	for(var j=0,i=start; i<=end; ++i,++j){
		a[j] = b[i];
	}
	return a;
}
Code.arrayReverse = function(a, b){
	if(b===undefined){
		b = a; a = new Array();
	}
	Code.emptyArray(a);
	var i, j, temp, len=b.length;
	var lm1 = len-1;
	var lo2 = Math.floor(b.length);
	if(len==0){ return a; }
	for(i=0;i<lo2;++i){
		j = lm1-i;
		temp = b[i];
		a[i] = b[j];
		a[j] = temp;
	}
	return a;
}
Code.emptyArray = function(a){
	while(a.length>0){ a.pop(); }
}
Code.truncateArray = function(a,length){
	while(a.length>length){ a.pop(); }
}
Code.getElementsWithFunction = function(element, fxn, stop, arr){
	arr = arr!==undefined ? arr : [];
	if(element){
		var result = fxn(element);
		if(result){
			arr.push(element);
			if(stop){
				return arr;
			}
		}
		var i, child, len = Code.numChildren(element);
		for(i=0; i<len; ++i){
			child = Code.getChild(element,i);
			Code.getElementsWithFunction(child, fxn, stop, arr);
			if(stop && arr.length>0){
				break;
			}
		}
	}
	return arr;
}
Code.elementExists = function(a,o){ // O(n)
	for(var i=0; i<a.length; ++i){
		if(a[i]==o){ return true; }
	}
	return false;
}
Code.indexOfElement = function(a,o){ // O(n)
	for(var i=0; i<a.length; ++i){
		if(a[i]==o){ return i; }
	}
	return null;
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
Code.subSampleArray = function(a,count){
	var i, index, len = a.length - count;
	for(i=0;i<len;++i){
		index = Math.floor(Math.random()*a.length);
		a[index] = a.pop();
	}
}
Code.arrayLimit = function(arr,min,max){
	var i, len = arr.length;
	if(min>max){
		// LIMIT TO ONLY OUTSIDE
	}else{
		for(i=len-1;i>=0;--i){
			arr[i] = Math.max(Math.min(arr[i],max),min);
		}
	}
}
Code.newIndexArray = function(start,end){ // inclusive
	array = [];
	for(i=start;i<=end;++i){
		array.push(i);
	}
	return array;
}
Code.arrayRandomItemPop = function(array){
	if(array.length==0){ return null; }
	var index = Math.floor(Math.random()*array.length);
	var value = array.splice(index,1);
	return value;
}

// ------------------------------------------------------------------------------------------ ARRAY 2D
Code.newArray2D = function(rows,cols){
	var i, arr = new Array(rows);
	for(i=0;i<rows;++i){
		arr[i] = new Array(cols);
	}
	return arr;
}
Code.newArray2DZeros = function(rows,cols){
	var i, j, a, arr = new Array(rows);
	for(i=0;i<rows;++i){
		a = new Array(cols);
		for(j=0;j<cols;++j){
			a[j] = 0.0;
		}
		arr[i] = a;
	}
	return arr;
}
Code.setArray2DFromArray = function(arr,row,col,list){
	var i, j, index = 0, len = list.length;
	for(j=0;j<row;++j){
		for(i=0;i<col && index<len;++i,++index){
			arr[j][i] = list[index];
		}
	}
	return arr;
}
Code.copyArray2DFromArray2D = function(arr,row,col,list){
	var i, j;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			arr[j][i] = list[j][i];
		}
	}
	return arr;
}
Code.array2DtoString = function(arr, exp){
	exp = exp===undefined?4:exp;
	var minLen = exp+6+1; // -#.E+#
	var rows = arr.length;
	var cols = (rows>0)?(arr[0].length):(0);
	var i, j, rowm1 = rows-1, colm1 = cols-1, num, val;
	var str = "";
	for(j=0;j<=rowm1;++j){
		//str += "[ ";
		str += " ";
		for(i=0;i<=colm1;++i){
			num = arr[j][i];
			val = num.toExponential(exp);
			if(num>=0){ // +/1 prefix
				val = " " + val;
			}
			str += Code.padStringLeft(val,minLen," ");
		}
		//str += " ]";
		str += "; ";
		if(j<rowm1){
			str += "\n ";
		}
	}
	return str.replace(/e/g,"E");
}
Code.array1Das2DtoString = function(arr, wid,hei, exp){
	exp = exp===undefined?4:exp;
	var minLen = exp+6+1; // -#.E+#
	var i, j, val, index=0, str = "";
	str += "\n";
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i,++index){
			//str += arr[index]+" ";
			num = arr[index];
			val = num.toExponential(exp);
			if(num<0){
				str += Code.padStringLeft(val,minLen," ");
			}else{
				str += " "+Code.padStringLeft(val,minLen-1," ");
			}
		}
		str += "\n";
	}
	return str;
}
// ------------------------------------------------------------------------------------------ SIMULATED ARRAY 2D
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
	var max = a[0];
	for(var i=a.length; i--; ){
		max = Math.max(max,a[i]);
	}
	return max;
	//return Math.max.apply(this,a); // max stack size exceeded
}
Code.minArray = function(a){
	var min = a[0];
	for(var i=a.length; i--; ){
		min = Math.min(min,a[i]);
	}
	return min;
	//return Math.min.apply(this,a); // max stack size exceeded
}
Code.sumArray = function(a){
	var sum = 0;
	for(var i=a.length; i--; ){
		sum += a[i];
	}
	return sum;
}
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
Code.getTimeMilliseconds = function(utc){
    var d = new Date();
    var t = d.getTime();
    if(utc){
    	t += Code.getTimeZone()*360000;
    }
    return t;
}
Code.getTimeZone = function(){
	var d = new Date();
	var hours = Math.floor( -d.getTimezoneOffset()/60 );
	return hours;
}
Code.getTimeStampFromMilliseconds = function(milliseconds){
	var d = new Date(milliseconds);
	return Code.getTimeStamp(d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}
Code.getTimeStamp = function(year, month, day, hour, min, sec, ms){
	var str = "";
    if(arguments.length<=1){ // 0 or 1 args
    	var d;
    	if(year===undefined){
    		d = Code.getTimeMilliseconds(true);
    		d = new Date(d);
    	}else{
    		d = new Date(year);
    	}
		year = d.getFullYear();
		month = d.getMonth()+1;
		day = d.getDate();
		hour = d.getHours();
		min = d.getMinutes();
		sec = d.getSeconds();
		ms = d.getMilliseconds();
    }
    year = year!==undefined ? year : 0;
    month = month!==undefined ? month : 1;
    day = day!==undefined ? day : 1;
    hour = hour!==undefined ? hour : 0;
    min = min!==undefined ? min : 0;
    sec = sec!==undefined ? sec : 0;
    ms = ms!==undefined ? ms : 0;
    str = ""+Code.prependFixed(""+year,"0",4)
	+"-"+Code.prependFixed(""+month,"0",2)
	+"-"+Code.prependFixed(""+day,"0",2)
	+" "+Code.prependFixed(""+hour,"0",2)
	+":"+Code.prependFixed(""+min,"0",2)
	+":"+Code.prependFixed(""+sec,"0",2)
	+"."+Code.postpendFixed(""+ms,"0",4);
	return str;
}
Code.getTimeFromTimeStamp = function(timestamp){
	if(timestamp!==undefined && timestamp.length==24){
		var year = timestamp.substr(0,4);
		var month = timestamp.substr(5,2);
		var day = timestamp.substr(8,2);
		var hour = timestamp.substr(11,2);
		var min = timestamp.substr(14,2);
		var sec = timestamp.substr(17,2);
		var ms = timestamp.substr(20,4);
		year = parseInt(year);
		month = parseInt(month);
		day = parseInt(day);
		hour = parseInt(hour);
		min = parseInt(min);
		sec = parseInt(sec);
		ms = parseInt(ms);
		var d = new Date( year, month-1, day, hour, min, sec, ms );
		return d.getTime();
	}
	return null;
}
Code.getDateFromTimeStamp = function(timestamp){
	var time = Code.getTimeFromTimeStamp(timestamp);
	var date = new Date(time);
	return date;
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
Code.getBitFromRight = function(binaryCode,i){
	return ((binaryCode >> i) & 0x01);
}
Code.reverseBits = function(value,bits){
	var rev = 0;
	for(var i=0; i<bits; ++i){
		rev <<= 1;
		rev |= ((value >> i)&0x1);
	}
	return rev;
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
Code.randomInt = function(min,max){
	if(max===undefined){
		max = min;
		min = 0;
	}
	return min + Math.min( Math.floor(Math.random()*(max-min+1)), max-min);
}
Code.randomFloat = function(min,max){
	if(max===undefined){
		max = min;
		min = 0;
	}
	return min + Math.random()*(max-min);
}
// Code.getColARGBFromString("0x456").toString(16)
// Code.getColARGBFromString("0x3456").toString(16)
// Code.getColARGBFromString("0x445566").toString(16)
// Code.getColARGBFromString("0x33445566").toString(16)
Code.getColARGBFromString = function(hexString){
	if(!hexString){
		return null;
	}
	hexString = hexString.replace("0x","");
	hexString = hexString.replace("#","");
	var a, r, g, b, col = parseInt(hexString,16);
	if(hexString.length==3){ // RGB
		a = 0xFF;
		r = (col>>8) & 0x00F;
		g = (col>>4) & 0x00F;
		b = (col>>0) & 0x00F;
		r = r + (r<<4);
		g = g + (g<<4);
		b = b + (b<<4);
	}else if(hexString.length==4){ // ARGB
		a = (col>>12) & 0x000F;
		r = (col>>8) & 0x000F;
		g = (col>>4) & 0x000F;
		b = (col>>0) & 0x000F;
		a = a + (a<<4);
		r = r + (r<<4);
		g = g + (g<<4);
		b = b + (b<<4);
	}else if(hexString.length==6){ // RRGGBB
		a = 0xFF;
		r = (col>>16) & 0x000000FF;
		g = (col>>8) & 0x000000FF;
		b = (col>>0) & 0x000000FF;
	}else if(hexString.length==8){ // AARRGGBB
		a = (col>>24) & 0x000000FF;
		r = (col>>16) & 0x000000FF;
		g = (col>>8) & 0x000000FF;
		b = (col>>0) & 0x000000FF;
	}else{
		return null;
	}
	col = ((a << 24) + (r << 16) + (g << 8) + (b << 0)) >>> 0;
	return col;
}
Code.getColARGBFromFloat = function(a,r,g,b){
	a = Math.min(Math.floor(a*256.0),255);
	r = Math.min(Math.floor(r*256.0),255);
	g = Math.min(Math.floor(g*256.0),255);
	b = Math.min(Math.floor(b*256.0),255);
	return Code.getColARGB(a,r,g,b);
}
Code.getColARGB = function(a,r,g,b){
	return (a<<24)+(r<<16)+(g<<8)+b;
}
Code.getColARGBCombineOver = function(colorBase, colorOver){
	var aBase = Code.getAlpARGB(colorBase);
	var rBase = Code.getRedARGB(colorBase);
	var gBase = Code.getGrnARGB(colorBase);
	var bBase = Code.getBluARGB(colorBase);
		var pBase = aBase / 255.0;
		var pBm1 = 1.0 - pBase;
	var aOver = Code.getAlpARGB(colorOver);
	var rOver = Code.getRedARGB(colorOver);
	var gOver = Code.getGrnARGB(colorOver);
	var bOver = Code.getBluARGB(colorOver);
		var pOver = aOver / 255.0;
		var pOm1 = 1.0 - pOver;
	//var pRatio = ;

		// var aOut = Code.clampRound0255(aBase + aOver*pBm1);
		// var rOut = Code.clampRound0255(rBase + rOver*pBm1);
		// var gOut = Code.clampRound0255(gBase + gOver*pBm1);
		// var bOut = Code.clampRound0255(bBase + bOver*pBm1);

	//var aOut = Code.clampRound0255(aBase*pOm1 + aOver*pOver);
	//var rOut = Code.clampRound0255(rBase*pOm1 + rOver*pOver);
	// var gOut = Code.clampRound0255(gBase*pOm1 + gOver*pOver);
	// var bOut = Code.clampRound0255(bBase*pOm1 + bOver*pOver);

	// var aOut = Code.clampRound0255(aBase + aOver*pBm1);
	// var rOut = Code.clampRound0255(rBase*pOm1 + rOver);
	// var gOut = Code.clampRound0255(gBase*pOm1 + gOver);
	// var bOut = Code.clampRound0255(bBase*pOm1 + bOver);

	// var aOut = Code.clampRound0255(aBase*pOm1 + aOver*pOver);
	// var rOut = Code.clampRound0255(rBase*pOm1 + rOver*pOver);
	// var gOut = Code.clampRound0255(gBase*pOm1 + gOver*pOver);
	// var bOut = Code.clampRound0255(bBase*pOm1 + bOver*pOver);

	var aOut = Code.clampRound0255(aBase*pOm1 + aOver*pOver);
	var rOut = Code.clampRound0255(rBase*pOm1 + rOver*pOver);
	var gOut = Code.clampRound0255(gBase*pOm1 + gOver*pOver);
	var bOut = Code.clampRound0255(bBase*pOm1 + bOver*pOver);


	// var aOut = Code.clampRound0255(aBase  );
	// var rOut = Code.clampRound0255(rBase  );
	// var gOut = Code.clampRound0255(gBase  );
	// var bOut = Code.clampRound0255(bBase   );

	// console.log(aBase,rBase,gBase,bBase)
	// console.log(aOver,rOver,gOver,bOver)
	// console.log(aOut,rOut,gOut,bOut)
	return Code.getColARGB(aOut,rOut,gOut,bOut)>>>0;
	//return Code.getColARGB( Code.clampRound0255(aBase + aOver*pBm1), Code.clampRound0255(rBase + rOver*pBm1), Code.clampRound0255(gBase + gOver*pBm1), Code.clampRound0255(bBase + bOver*pBm1) );
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
Code.setRedARGB = function(col, r){
	col = col & 0x00FFFFFF;
	return col + (r << 0);
}
Code.setGrnARGB = function(col, g){
	col = col & 0x00FFFFFF;
	return col + (g << 8);
}
Code.setBluARGB = function(col, b){
	col = col & 0x00FFFFFF;
	return col + (b << 16);
}
Code.setAlpARGB = function(col, a){
	col = col & 0x00FFFFFF;
	return col + (a << 24);
}
Code.getFloatAlpARGB = function(col){
	return ((col>>24)&0xFF)/255.0;
}
Code.getFloatRedARGB = function(col){
	return ((col>>16)&0xFF)/255.0;
}
Code.getFloatGrnARGB = function(col){
	return ((col>>8)&0xFF)/255.0;
}
Code.getFloatBluARGB = function(col){
	return (col&0xFF)/255.0;
}
Code.clampRound0255 = function(n){
	return Math.min(Math.max(Math.round(n),0),255);
}
Code.getFloatArrayARGBFromARGB = function(col){
	//
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

Code.HSVFromRGB = function(vout, vin){//, r,g,b){ // in [0,1]
	if(vin===undefined){
		vin = vout;
		vout = new V3D();
	}
	var r = vin.x;
	var g = vin.y;
	var b = vin.z;
	var h, s, v;
	var min = Math.min(r,g,b);
	var max = Math.max(r,g,b);
	var range = max - min;
	// V
	v = max;
	// S
	if(max!=0.0){
		s = range / max;
	}else{
		s = 0;
	}
	// H
	if(range==0){
		h = 0;
	}else{
		if(r===max){
			h = (g-b)/range;
		}else if(g===max){
			h = (b-r)/range + 2.0;
		}else if(b===max){
			h = (r-g)/range + 4.0;
		}
		h /= 6.0;
	}
	h = Math.min(Math.max(h,0.0),1.0);
	s = Math.min(Math.max(s,0.0),1.0);
	v = Math.min(Math.max(v,0.0),1.0);
	vout.set(h,s,v);
	return vout;
	//return {"h":h, "s":s, "v":v};
}
// Code.HSVFromRGB(new V3D(1,1,1))
Code.RGBFromHSV = function(vout, vin){ // h in [0,1], s in [0,1], v in [0,1]       (h usually 0-360 deg)

// some color yellow? is turned to black

	if(vin===undefined){
		vin = vout;
		vout = new V3D();
	}
	var h = vin.x;
	var s = vin.y;
	var v = vin.z;
	var i, r, g, b, f, p, q, t;
	if(s===0){
		r = g = b = v;
	}else{
		h *= 6.0;
		i = Math.floor(h);
		f = h - i;
		var oms = 1.0 - s;
		var omsf = 1.0 - (s*f);
		var omsomf = 1.0 - s*(1.0-f);

// omsf = Math.min(Math.max(omsf,0.0),1.0);
// omsomf = Math.min(Math.max(omsomf,0.0),1.0);
// oms = Math.min(Math.max(oms,0.0),1.0);

		p = v * oms;
		q = v * omsf;
		t = v * omsomf;
		switch(i){ // i in [0,]
			case 0:
				r = v;
				g = t;
				b = p;
			break;
			case 1:
				r = q;
				g = v;
				b = p;
			break;
			case 2:
				r = p;
				g = v;
				b = t;
			break;
			case 3:
				r = p;
				g = q;
				b = v;
			break;
			case 4:
				r = t;
				g = p;
				b = v;
			case 5:
				r = v;
				g = p;
				b = q;
			break;
			default:
				//console.log(i,h);
				r = 0.0;
				g = 0.0;
				b = 0.0;
		}
	}
	/*
	if(h==1.0 || s==1.0 || v==1.0){
	//if(h==0.0 || s==0.0 || v==0.0){
		r = 1.0;
		g = 1.0;
		b = 1.0;
	}
	*/
	r = Math.min(Math.max(r,0.0),1.0);
	g = Math.min(Math.max(g,0.0),1.0);
	b = Math.min(Math.max(b,0.0),1.0);
	vout.set(r,g,b);
	return vout;
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
Code.sign = function(num){
	return num>=0.0 ? 1.0 : -1.0;
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

Code.randomizedArray = function(len){
	var i, arr = [], len = len?len:10;
	for(i=0;i<len;++i){
		arr[i] = i;
	}
	Code.randomizeArray(arr, false);
}
Code.randomizeArray = function(arr, guarantee){
	var i, len = arr.length;
	if(len<=1){return;}
	var indexA, indexB, temp;
	var wasLastIndex = arr[len-1];
	for(i=0;i<len;++i){
		indexA = Math.floor(Math.random()*len);
		indexB = Math.floor(Math.random()*len);
		temp = arr[indexA];
		arr[indexA] = arr[indexB];
		arr[indexB] = temp;
	}
	// guarantee non-repeats
    var isFirstIndex = arr[0];
    if(guarantee){
	    if(wasLastIndex==isFirstIndex){ 
	        indexA = 0;
	        indexB = Math.floor(Math.random()*(len-1))+1;
	        temp = arr[indexA];
	        arr[indexA] = arr[indexB];
	        arr[indexB] = temp;
	    }
	}
}

Code.randomSubsetFromArray = function(newArr, count, oldArr){
	if(count<oldArr*0.5){
		return Code._randomSubsetNoScale(newArr,count,oldArr);
	}
	return Code._randomSubsetResourceHog(newArr,count,oldArr);
}
Code._randomSubsetResourceHog = function(newArr, count, oldArr){
	var i, len = oldArr.length;
	var arr = Code.newArray();
	for(i=0;i<len;++i){
		arr[i] = i;
	}
	Code.randomizeArray(arr);
	len = Math.min(count,len);
	for(i=0;i<len;++i){
		newArr[i] = oldArr[ arr[i] ];
	}
	return newArr;
}
Code._randomSubsetNoScale = function(newArr, count, oldArr){
	var item, i, j=0, len = oldArr.length;
	var temp = [];
	while(j<count){
		item = Math.floor(Math.random()*(len-1))+1;
		item = oldArr[item];
		if(!Code.elementExists(temp,item)){
			temp.push(item);
			newArr.push(item);
			++j;
		}
	}
	return newArr;
}

Code.stdDev = function(list,key,mean){
	var i, sig=0, item, len=list.length;
	if(len==0){ return 0; }
	for(i=len;i--;){
		item = list[key]
		sig += Math.pow(item-mean,2);
	}
	return Math.sqrt(sig / len);
}
Code.median = function(list,key){
	var i, mu=0, item, len=list.length;
	if(len==0){ return 0; }
	for(i=len;i--;){
		item = list[key]
		mu += item;
	}
	return mu / len;
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
};
Code.getElementTag = function(ele){
	var tag = ele.tagName;
	if(!tag){
		tag = "";
	}
	return tag.toLowerCase();
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
Code.getScrollBarSize = function(){
	var inner = document.createElement('p');
	inner.style.width = "100%";
	inner.style.height = "200px";
	var outer = document.createElement('div');
	outer.style.position = "absolute";
	outer.style.top = "0px";
	outer.style.left = "0px";
	outer.style.visibility = "hidden";
	outer.style.width = "200px";
	outer.style.height = "150px";
	outer.style.overflow = "hidden";
	outer.appendChild(inner);
	document.body.appendChild(outer);
	var w1 = inner.offsetWidth;
	outer.style.overflow = 'scroll';
	var w2 = inner.offsetWidth;
	if (w1 == w2){
		w2 = outer.clientWidth;
	}
	document.body.removeChild(outer);
	return (w1 - w2);
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
Code.newAnchor = function(link,content){
	var a = Code.newElement("a");
	if(link!=undefined && link!=null){
		Code.setProperty(a,"href",link);
	}
	if(content!=undefined && content!=null){
		Code.setContent(a,content);
	}
	return a;
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
Code.newSelect = function(array){ // [.., [DISPLAY, VALUE (,SELECTED)], ..]
	var sel = Code.newElement("select");
	if(array){
		var i, len=array.length;
		for(i=0; i<len; ++i){
			var itm = array[i];
			var a = itm.length>0 ? itm[0] : undefined;
			var b = itm.length>1 ? itm[1] : undefined;
			var c = itm.length>2 ? itm[2] : undefined;
			var opn = Code.newOption(a,b,c);
			Code.addChild(sel,opn);
		}
	}
	return sel;
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

Code.newInputButton = function(val){
	var button = Code.newElement("button");
	if(val!==undefined){
		Code.setAttribute(button,"value",val);
		Code.setContent(button,val);
	}
	return button;
};

Code.setAttribute = function(a,nam,val){
	a.setAttribute(nam,val);
};
Code.getAttribute = function(a,nam){
	a.getAttribute(nam);
};

Code.setTextPlaceholder = function(a,val){
	Code.setAttribute(a,"placeholder",val);
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

Code.newImage = function(t){
	var i = new Image();
	if(t!==undefined){
		Code.appendChild(t,i);
	}
	return i;
}

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


Code.addHeader = function(t){
	return t.createTHead();
}
Code.addFooter = function(t){
	return t.createTFoot();
}
Code.addBody = function(t){
	var b = Code.newElement("tbody");
	Code.addChild(t,b);
	return b;
}

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
Code.removeChildAt = function(a,index){
	return Code.removeChild(a, Code.getChild(a,index));
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
};
Code.hasProperty = function(ele,par){
	var p = Code.getProperty(ele,par);
	return p !== undefined && p !== null;
};
Code.removeProperty = function(ele,pro){
	return ele.removeAttribute(pro);
};
Code.getValueOrDefault = function(obj,key, def){
	var val = obj[key];
	if(val!==undefined && val!==null){
		return val;
	}
	return def;
};
Code.getPropertyOrDefault = function(ele,pro, def){
	if(Code.hasProperty(ele,pro)){
		return Code.getProperty(ele,pro);
	}
	return def;
};
Code.setDisabled = function(a){
	a.disabled = true;
}
Code.setEnabled = function(a){
	a.disabled = false;
}

Code.setStyleLinearGradient = function(ele,def, angle, colors,locations){
	angle = Math.round((180.0/Math.PI)*angle);
	var styleSafari = "-webkit-linear-gradient";
	var styleOpera = "-o-linear-gradient";
	var styleFireFox = "-moz-linear-gradient";
	var styleStandard = "linear-gradient";
	var style = styleStandard;
	if(Code.IS_SAFARI){
		style = styleSafari;
	}else if(Code.IS_OPERA){
		style = styleOpera;
	}else if(Code.IS_FF){
		style = styleFireFox;
	}
	style += "(";
	style += angle+"deg,";
	var i, len = Math.min(colors.length, locations.length);
	var lm1 = len-1;
	for(i=0; i<len; ++i){
		var color = colors[i];
		var location = locations[i];
		color = Code.getJSColorFromARGB(color);
		location = Math.round(location*100.0);
		style += color+" "+location+"%";
		if(i<lm1){
			style += ",";
		}
	}
	style += ")";
	Code.removeStyle(ele, "background");
	if(def){
		Code.addStyle(ele, "background", def);
	}
	// background-image ?
	Code.addStyle(ele, "background", style);
}
Code.setStyleRadialGradient = function(ele,def, locationX,locationY, dirX,dirY, colors,locations){
	// ...
}

Code.setStyleOverflow = function(ele,val){
	ele.style.overflow = val;
}
Code.setStyleOverflowX = function(ele,val){
	ele.style.overflowX = val;
}
Code.setStyleOverflowY = function(ele,val){
	ele.style.overflowY = val;
}
Code.setStyleWordWrap = function(ele,val){
	ele.style.wordWrap = val;
};
//Code.setStyleWordBreak(elementField,"break-all"); // CJK
Code.setStyleWidth = function(ele,val){
	ele.style.width = val;
};
Code.getStyleWidth = function(ele){
	return ele.style.width;
};
Code.setStyleHeight = function(ele,val){
	ele.style.height = val;
};
Code.setStyleBorderRadius = function(ele,val){
	//ele.style.borderRadius = val; // not work
	Code.removeStyle(ele, "border-radius");
	Code.addStyle(ele, "border-radius:"+val);
};
Code.setStyleBorderTopLeftRadius = function(ele,val){
	Code.removeStyle(ele, "border-top-left-radius");
	Code.addStyle(ele, "border-top-left-radius:"+val);
};
Code.setStyleBorderTopRightRadius = function(ele,val){
	Code.removeStyle(ele, "border-top-right-radius");
	Code.addStyle(ele, "border-top-right-radius:"+val);
};
Code.setStyleBorderBottomRightRadius = function(ele,val){
	Code.removeStyle(ele, "border-bottom-right-radius");
	Code.addStyle(ele, "border-bottom-right-radius:"+val);
};
Code.setStyleBorderBottomLeftRadius = function(ele,val){
	Code.removeStyle(ele, "border-bottom-left-radius");
	Code.addStyle(ele, "border-bottom-left-radius:"+val);
};
Code.setStyleBackground = function(ele,val){
	ele.style.background = val;
};
Code.setStyleBackgroundImage = function(ele,val){
	ele.style.backgroundImage = val;
};
Code.setStyleBackgroundColor = function(ele,val){
	ele.style.backgroundColor = val;
};
Code.setStyleBorder = function(ele,val){
	ele.style.borderStyle = val;
};
Code.setStyleBorderLeft = function(ele,val){
	ele.style.borderLeftStyle = val;
};
Code.setStyleBorderRight = function(ele,val){
	ele.style.borderRightStyle = val;
};
Code.setStyleBorderTop = function(ele,val){
	ele.style.borderTopStyle = val;
};
Code.setStyleBorderBottom = function(ele,val){
	ele.style.borderBottomStyle = val;
};
Code.setStyleBorderColor = function(ele,val){
	ele.style.borderColor = val;
};
Code.setStyleBorderColorLeft = function(ele,val){
	ele.style.borderLeftColor = val;
};
Code.setStyleBorderColorRight = function(ele,val){
	ele.style.borderRightColor = val;
};
Code.setStyleBorderColorTop = function(ele,val){
	ele.style.borderTopColor = val;
};
Code.setStyleBorderColorBottom = function(ele,val){
	ele.style.borderBottomColor = val;
};
Code.setStyleBorderWidth = function(ele,val){
	ele.style.borderWidth = val;
};
Code.setStyleBorderWidthLeft = function(ele,val){
	ele.style.borderLeftWidth = val;
};
Code.setStyleBorderWidthRight = function(ele,val){
	ele.style.borderRightWidth = val;
};
Code.setStyleBorderWidthTop = function(ele,val){
	ele.style.borderTopWidth = val;
};
Code.setStyleBorderWidthBottom = function(ele,val){
	ele.style.borderBottomWidth = val;
};
Code.setStyleCursor = function(ele,styleIn){
	var cursorStyle = "cursor: -moz-"+styleIn+"; cursor: -webkit-"+styleIn+"; cursor: "+styleIn+";";
	var style = ele.getAttribute("style");
	style = Code.removeAllStyle(style, "cursor");
	style = style + "" + cursorStyle;
	ele.setAttribute("style",style);
};
Code.removeAllStyle = function(style, property){ // property:attribute;
	style = (style!==undefined && style!==null) ? style : "";
	var reg = new RegExp(""+property+".*?:.*?;( )*", "gi");
	return style.replace(reg,"");
};
Code.setStyleMinHeight = function(ele,min){
	ele.style.minHeight = min;
};
Code.setStyleMaxHeight = function(ele,max){
	ele.style.maxHeight = max;
};
Code.setStyleMinWidth = function(ele,min){
	ele.style.minWidth = min;
};
Code.setStyleMaxWidth = function(ele,max){
	ele.style.maxWidth = max;
};
Code.setStyleFloat = function(ele,flt){
	ele.style.cssFloat = flt;
};
Code.setStyleDisplay = function(ele,display){
	ele.style.display = display;
};
Code.setStyleZIndex = function(ele,style){
	ele.style.zIndex = style;
};
Code.setStylePadding = function(ele,style){
	ele.style.padding = style;
};
Code.setStylePaddingLeft = function(ele,style){
	ele.style.paddingLeft = style;
};
Code.setStylePaddingRight = function(ele,style){
	ele.style.paddingRight = style;
};
Code.setStylePaddingTop = function(ele,style){
	ele.style.paddingTop = style;
};
Code.setStylePaddingBottom = function(ele,style){
	ele.style.paddingBottom = style;
};
Code.setStyleMargin = function(ele,style){
	ele.style.margin = style;
};
Code.setStyleMarginLeft = function(ele,style){
	ele.style.marginLeft = style;
};
Code.setStyleMarginRight = function(ele,style){
	ele.style.marginRight = style;
};
Code.setStyleMarginTop = function(ele,style){
	ele.style.marginTop = style;
};
Code.setStyleMarginBottom = function(ele,style){
	ele.style.marginBottom = style;
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
Code.setStyleTop = function(ele,style){
	ele.style.top = style;
};
Code.setStyleBottom = function(ele,style){
	ele.style.bottom = style;
};
Code.setStyleTextAlign = function(ele,style){
	ele.style.textAlign = style;
};
Code.setStyleVerticalAlign = function(ele,style){
	ele.style.verticalAlign = style;
};
Code.setStyleColor = function(ele,style){
	ele.style.color = style;
};
Code.setStyleFontSize = function(ele,style){
	ele.style.fontSize = style;
};
Code.setStyleFontWeight = function(ele,style){ // lighter=100, normal=400, bold=700
	ele.style.fontWeight = style;
};
Code.setStyleFontBold = function(ele,style){
	Code.setStyleFontWeight(ele,"bold");
};
Code.setStyleFontLighter = function(ele,style){
	Code.setStyleFontWeight(ele,"lighter");
};
Code.setStyleFontBolder = function(ele,style){
	Code.setStyleFontWeight(ele,"bolder");
};
Code.setStyleFontFamily = function(ele,style){
	ele.style.fontFamily = style;
};
Code.setStyleLineHeight = function(ele,style){
	ele.style.lineHeight = style;
};
Code.setStyleFontStyle = function(ele,style){
	ele.style.fontStyle = style;
};
Code.setStyleFontStyleItalic = function(ele){
	Code.setStyleFontStyle(ele,"italic");
};
Code.setSrc = function(i,s){
	return i.src = s;
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
Code.hasClass = function(ele,cla){
	var c = Code.getClass(ele);
	var hasClass = c.match(cla);
	return hasClass != null;
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
Code.getStyle = function(ele,prop){
	/*var c = ele.getAttribute("style");
	if(c==undefined || c==null){
		c = ele.style;
		if(c==undefined || c==null){
			return "";
		}
	}
	return c;*/
};
Code.addStyle = function(ele,sty,val){
	if(val!==undefined){
		sty = sty+":"+val;
	}
	var style = ele.getAttribute("style");
	style += sty;//+";";
	ele.setAttribute("style",style);
};
Code.removeStyle = function(ele,sty){
	var s = ele.getAttribute("style");
	s = s ? s : ""; // style may not yet exist
	var reg = new RegExp(""+sty+"\:.*?;","g");
	s = s.replace(reg," ");
	s = s.replace("  "," ");
	s = s.replace(/^ /,"");
	ele.setAttribute("style",s);
}
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
Code.getTargetFromEvent = function(e){
	if(!e){ e = window.event; } // IE
	if(e.target){
		return e.target;
	}
	return e.srcElement; // IE
}
Code.getTargetFromMouseEvent = function(e){
	return Code.getTargetFromEvent(e);
}
Code.getTouchPosition = function(e){
	return Code.getMousePosition(e);
}
Code.getMousePosition = function(e){
	e = Code.getJSEvent(e);
	var pos = new V2D(0,0);
	throw "where is this used?"
	var ele = null;
	//var ele = this._canvas; // CANVAS ???
	while(ele != null){
		pos.x += ele.offsetLeft;
		pos.y += ele.offsetTop;
		ele = ele.offsetParent;
	}
	pos.x = e.pageX - pos.x;
	pos.y = e.pageY - pos.y;
	return pos;
}
Code.getMousePositionLocal = function(e){
	e = Code.getJSEvent(e);
	return new V2D(e.offsetX,e.offsetY);
}
Code.getMouseLeftClick = function(e){
	e = Code.getJSEvent(e);
	return e.button === 0;
}
Code.getMouseMiddleClick = function(e){
	e = Code.getJSEvent(e);
	return e.button === 1;
}
Code.getMouseRightClick = function(e){
	e = Code.getJSEvent(e);
	return e.button === 2;
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
		// if(str=="onchange"){
		// 	console.log("is change ....")
		// 	//Code.addListenerChange(ele);
		// 	ele.onchange = fxn;
		// }else{
			ele.addEventListener(str,fxn);
		//}
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
Code.sizeToFitOutside = function(containerWidth,containerHeight, contentsWidth,contentsHeight){
	var s = new V2D();
	return s;
}
Code.sizeToFitInside = function(containerWidth,containerHeight, contentsWidth,contentsHeight){
	var s = new V2D();
	return s;
}

// -------------------------------------------------------- COOKIES
Code.setCookie = function(c_name, value, seconds){
	seconds = seconds!==undefined ? seconds : (356*24*60*60) // 1 year
	var miliseconds = seconds*1000;
	var exdate = new Date();
	exdate.setTime( exdate.getTime() + miliseconds);
	var c_value = escape(value) + ((miliseconds==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
	console.log(document.cookie);
};
Code.deleteCookie = function(name){
	Code.setCookie(name,"x",-1);
};
Code.deleteAllCookies = function(name){
	document.cookie = "";
};
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
};
// -------------------------------------------------------- DATE FUNCTIONS
Code.getFirstDayOfWeekInMonth = function(milliseconds){ // 0=SUN, 6=SAT
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), 1, 0,0,0,0);
	return d.getDay();
};
Code.getMonthOfYear = function(milliseconds){
	var d = new Date(milliseconds);
	return d.getMonth();
};
Code.getDayOfMonth = function(milliseconds){
	var d = new Date(milliseconds);
	return d.getDate();
};
Code.getDaysInMonth = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth()+1, 0, 0,0,0,0);
	return d.getDate();
};
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
};
Code.getPrevMonthFirstDay = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth()-1, 1,0,0,0,0);
	return d.getTime();
};
Code.getNextMonthFirstDay = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth()+1, 1,0,0,0,0);
	return d.getTime();
};

Code.getPrevDay = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate()-1, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	return d.getTime();
};
Code.getNextDay = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	return d.getTime();
};
Code.formatDayString = function(year,month,day){
	return Code.prependFixed(""+year,"0",4)+"-"+Code.prependFixed(""+month,"0",2)+"-"+Code.prependFixed(""+day,"0",2);
};
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

Code.getHumanReadableDateString = function(timestamp){
	var date = Code.getDateFromTimeStamp(timestamp);
	return Code.getShortDateDescriptiveString(date);
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
Code.escapeURI = function(str){
	return encodeURIComponent(str);
}
Code.escapeSpaces = function(str){
	return (str+"")
         .replace(/ /g, "$20");
}
// ENCODE URL STRING SAFE FOR SENDING:
// encodeURIComponent(str)
// encodeURI(str)
// escape(str)

// ------------------------------------------------------------------------------------------------------------------------------------------------- formatting
Code.clipStringToMaxChars = function(str,chr,filler){
	if(chr<=0){
		return "";
	}
	filler = filler!==undefined ? filler : "...";
	var maxChar = chr + filler.length;
	var strLen = str.length;
	if(strLen>maxChar){
		var rightLength = Math.floor(chr/2);
		var leftLength = chr - rightLength;
		var leftString = str.substring(0,leftLength);
		var rightString = str.substring(strLen-rightLength,strLen);
		return leftString+""+filler+""+rightString;
	}
	return str;
}
Code.padStringCenter = function(val,wid,fillerLeft,fillerRight){
	if(val.length>=wid){
		return val.substring(0,wid);
	}
	fillerLeft = fillerLeft!==undefined ? fillerLeft : " ";
	fillerRight = fillerLeft!==undefined ? fillerRight : fillerLeft;
	var left = Math.floor((wid-val.length)*0.5);
	val = Code.padStringLeft(val,val.length+left,fillerLeft);
	val = Code.padStringRight(val,wid,fillerRight);
	return val;
}
Code.padString = function(val,wid,filler){
	return Code.padStringLeft(val,wid,filler);
}
Code.padStringLeft = function(val,wid,filler){
	filler = filler!==undefined?filler:" ";
	if(filler.length==0){ filler = " "; }
	var str = val;
	while(str.length<wid){
		str = str + filler;
	}
	return str;
}
Code.padStringRight = function(val,wid,filler){
	filler = filler!==undefined?filler:" ";
	if(filler.length==0){ filler = " "; }
	var str = val;
	while(str.length<wid){
		str = filler + str;
	}
	return str;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- MATHS
Code.rangeForceMinMax = function(value, min, max){
	return Math.min(Math.max(value,min),max);
}
Code.convetRangeDiscreteRound = function(value, oldMin, oldMax, newMin,newMax){
	var oldRange = oldMax - oldMin;
	if (oldRange==0) { return newMin; }
	value = (value - oldMin) / oldRange; // [0,1]
	var newRange = newMax - newMin;
	return newMin + Math.min(Math.floor( value * newRange),newMax-1);
}
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
}
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
Code.powOdd = function(n,p){
	var r = Math.pow(Math.abs(n),p);
	if(n<0){
		return -r;
	}
	return r;
}
Code.quadraticSolution = function(a,b,c){ // a*x^2 + b*x + c = 0
	if(a==0){ // linear
		if(b==0){ // singular (vertical)
			return null;
		}
		return -c/b;
	}
	var inside = b*b - 4.0*a*c;
	if(inside<0){ // complex
		//console.log(-b*0.5/a + " +/- i*" + Math.sqrt(-inside));
		return null;
	}
	if(inside==0){ // real repeated
		var x = -b/(2.0*a);
		return [x,x];
	}
	var root = Math.sqrt(inside);
	return [(-b+root)/(2.0*a), (-b-root)/(2.0*a)];
}
Code.cubicSolution = function(a,b,c,d){ // a*x^3 + b*x^2 + c*x + d = 0
	if(a==0){ // quadratic
		return Code.quadraticSolution(b,c,d);
	}
	var A = b/a;
	var B = c/a;
	var C = d/a;
	var AO3 = A/3.0;
	var R = (9.0*A*B - 27.0*C - 2.0*A*A*A)/54.0;
	var RR = R*R;
	var Q = (3.0*B - A*A)/9.0;
	var QQQ = Q*Q*Q;
	var D = RR + QQQ;
	var x1, x2, x3;
	if(3.0*Q-2.0*R+D==0.0){ // 3 equal
		x1 = Code.powOdd(C,1.0/3.0);
		return [x1,x1,x1];
	}
	if(D<0.0){ // 3 distinct
		var theta = Math.acos(R/Math.sqrt(-QQQ));
		var rQ = Math.sqrt(-Q);
		x1 = 2.0 * rQ * Math.cos(theta/3.0) - AO3;
		x2 = 2.0 * rQ * Math.cos((theta+Math.PI2)/3.0) - AO3;
		x3 = 2.0 * rQ * Math.cos((theta+Math.PI2*2.0)/3.0) - AO3;
		return [x1,x2,x3];
	}else if(D > 0.0){ // 1 real
		var rD = Math.sqrt(D);
		var S = Code.powOdd(R + rD,1.0/3.0);
		var T = Code.powOdd(R - rD,1.0/3.0);
		x1 = S + T - AO3;
		//xR = -(S+T)*0.5 - AO3;
		//xI = (S-T)*0.5*Math.sqrt(3.0);
		// x2 = xR + i*xI
		// x3 = xR - i*xI
		return [x1];
	}else{ // D == 0.0 // 3 real, 2+ same
		var RC = Code.powOdd(R,1.0/3.0);
		x1 = 2.0*RC - AO3;
		x2 = -RC - AO3;
		x3 = x2;
		return [x1,x2,x3];
	}
	// this covers D <=0.0
	// console.log(x1,x2,x3);
	var r = Math.sqrt(RR-D);
	var rc = Code.powOdd(r,1.0/3.0);
	var theta = Math.acos(R/r);
	x1 = 2.0*rc*Math.cos(theta/3.0) - AO3;
	x2 = -rc*(Math.cos(theta/3.0)+Math.sqrt(3.0)*Math.sin(theta/3.0)) - AO3;
	x3 = -rc*(Math.cos(theta/3.0)-Math.sqrt(3.0)*Math.sin(theta/3.0)) - AO3;
	return [x1,x2,x3];
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
Code.inverse4x4 = function(arr, a,b,c,d, e,f,g,h, i,j,k,l, m,n,o,p){ // http://www.cg.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/teche23.html
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
Code.interpolate1D = function(locOut, locIn, a, b, c, d){ // list of V2D
	if(!b){ // only a
		locOut.x = a.x;
		locOut.y = a.y;
		return locOut;
	}else if(!c){ // a & b == linear
		var x = locIn.x - a.x;
		var y = locIn.y - a.y;
		var dx = b.x - a.x;
		var dy = b.y - a.y;
		if(dx==0){
			locOut.y = a.y;
		}else{
			locOut.y = a.y + (x*dy/dx);
		}
		locOut.x = locIn.x;
		return locOut;
	}else if(d===undefined){ // a & b & c
		var x = locIn.x - a.x;
		var y = locIn.y - a.y;
		var dx = c.x - a.x;
		var dy = c.y - a.y;
		// var dxAB = b.x-a.x;
		// var dyAB = b.y-a.y;
		// var dxBC = c.x-b.x;
		// var dyBC = c.y-b.y;
		var ddy = (c.y - 2.0*b.y + a.y)/dx;
		// if(dx==0){
		// 	locOut.y = a.y;
		// }else{
		// f(x+a) = f(x)  +  f'(x) * (x-a)  +  1/2 * f''(x) * (x-a)^2
		locOut.y = a.y + (dy/dx)*x + 0.5*ddy*x*x;
		locOut.x = locIn.x;
		return locOut;
	}else{ // all
		//
	}
	return null;
}
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
				}else{ // need to interpolate at a neighbor ... is this not already done?
					//console.log("result; "+result.toString());
					result.x += i; result.y += j;
					list.push(result);
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
	var eps = 1.0; // 0.5
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
			// 	result = new V4D(i,j,0,b4); // --- close enough
			// 	list.push(result);
			// continue;
				result = Code.extrema3DInterpolate(new V4D(),a1,a3,a4,a5,a7, b0,b1,b2,b3,b4,b5,b6,b7,b8, c1,c3,c4,c5,c7);
				if(result==null){ console.log("null result"); continue; }
				if(Math.abs(result.x)<eps && Math.abs(result.y)<eps && Math.abs(result.z)<eps){ // inside window
					result.x += i; result.y += j; result.z += k;
					list.push(result);
				}else{ // need to interpolate at a neighbor
					// console.log("neighbor - result; "+result.toString()+"----------    ");
					// console.log("          var a = ["+a0+","+a1+","+a2+","+a3+","+a4+","+a5+","+a6+","+a7+","+a8+"] ");
					// console.log("          var b = ["+b0+","+b1+","+b2+","+b3+","+b4+","+b5+","+b6+","+b7+","+b8+"] ");
					// console.log("          var c = ["+c0+","+c1+","+c2+","+c3+","+c4+","+c5+","+c6+","+c7+","+c8+"] ");
					result.x += i; result.y += j; result.z += k;
					list.push(result);
				}
			}
		}
	}
	return list;
}
Code._tempMatrixArray3 = [0,0,0];
Code._tempMatrixArray9 = [0,0,0, 0,0,0, 0,0,0];
Code.extrema3DInterpolate = function(loc, a1,a3,a4,a5,a7, b0,b1,b2,b3,b4,b5,b6,b7,b8, c1,c3,c4,c5,c7){ // a is bot, b is middle, c is top
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


Code.lineSegCollinear2D = function(a,b, c,d){
	var AB = V2D.sub(b,a);
	var AC = V2D.sub(c,a);
	var AD = V2D.sub(d,a);
	var cross1 = V2D.cross(AB,AC);
	var cross2 = V2D.cross(AB,AD);
	//console.log("lineSegCollinear2D :"+cross1+" "+cross2);
	var eps = 1E-10;
	if( Math.abs(cross1)<eps && Math.abs(cross2)<eps ){
		return true;
	}
	return false;
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
	if(den == 0){ // anti/parallel
		var areaABC = V2D.areaTri(a,b,c);
		var areaABD = V2D.areaTri(a,b,d);
		if(areaABD==0.0 && areaABC==0.0){ // collinear
			var ab = V2D.sub(b,a);
			var lenAB2 = ab.length(); lenAB2 *= lenAB2;
			//if(lenAB2==0.0){ return null; }
			var ac = V2D.sub(c,a);
			var ad = V2D.sub(d,a);
			var dotC = V2D.dot(ab,ac)/lenAB2;
			var dotD = V2D.dot(ab,ad)/lenAB2;
			var dotMax = Math.max(dotC,dotD);
			var dotMin = Math.min(dotC,dotD);
			if((dotMin<0 && dotMax<0) || (1<dotMin && 1<dotMax)){
				return null;
			}
			dotMin = Math.max(0,dotMin);
			dotMax = Math.min(1,dotMax);
			var cd = V2D.sub(d,c);
			var lenCD2 = cd.length(); lenCD2 *= lenCD2;
			//if(lenCD==0.0){ return null; }
			var p1 = new V2D(a.x+ab.x*dotMin, a.y+ab.y*dotMin);
			var cp1 = V2D.sub(p1,c);
			var dotCP1 = V2D.dot(cd,cp1)/lenCD2;
			if(dotMin==dotMax){ // single end intersection
				return new V4D(p1.x, p1.y, dotMin, dotCP1);
			}
			var p2 = new V2D(a.x+ab.x*dotMax, a.y+ab.y*dotMax);
			var cp2 = V2D.sub(p2,c);
			var dotCP2 = V2D.dot(cd,cp2)/lenCD2;
			console.log(p1,p2)
			return [new V4D(p1.x, p1.y, dotMin, dotCP1), new V4D(p2.x, p2.y, dotMax, dotCP2)];

		}
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

Code.lineSegLineIntersect2D = function(a,b, c,d){ // x,y = point | z = %ab : line segment & infinite line intersection
	var caX = (c.x - a.x);
	var dcX = (d.x - c.x);
	var baX = (b.x - a.x);
	var caY = (c.y - a.y);
	var dcY = (d.y - c.y);
	var baY = (b.y - a.y);
	var den = baY*dcX - baX*dcY;
	if(den == 0){ return null; }
	var num2 = dcX*caY - dcY*caX;
	var t2 = num2/den;
	if(t2 < 0 || t2 > 1){ return null; }
	return new V4D( a.x+t2*baX, a.y+t2*baY, t2);
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
Code.rayFiniteInfinitePositiveIntersect2D = function(a,b, c,d){ // finite ray and positive-infinite ray
	var den = b.y*d.x - b.x*d.y;
	if(den == 0){ return null; }
	var num1 = (d.x*(c.y-a.y) + d.y*(a.x-c.x));
	var num2 = (b.x*(c.y-a.y) + b.y*(a.x-c.x));
	var t1 = num1/den;
	var t2 = num2/den;
	if(t1>=0 && t1<=1.0 && t2>=0){
		return new V2D(a.x+t1*b.x, a.y+t1*b.y);
	}
	return null;
}
Code.closestPointLine2D = function(org,dir, point){ // infinite ray and point
	var t = (V2D.dot(dir,point)-V2D.dot(org,dir))/V2D.dot(dir,dir);
	return new V2D(org.x+t*dir.x,org.y+t*dir.y);
}
Code.distancePointRay2D = function(org,dir, point){ // point and RAY
	var p = Code.closestPointLine2D(org,dir, point);
	return V2D.distance(point,p);
}
Code.distancePointLine2D_ = function(a,b, point){ // point and RAY
	var dir = V2D.sub(b,a);
	return Code.distancePointRay2D(a,dir, point);
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



Code.sizeToFitRectInRect = function(widthItem,heightItem, widthContainer,heightContainer){
	var widthToHeight = widthItem/heightItem;
	var width = heightContainer*widthToHeight;
	var height = widthContainer/widthToHeight;
	if(width>widthContainer){
		height = heightContainer;
	}else if(height>heightContainer){
		width = widthContainer;
	}
	return {"width":width, "height":height};
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
	var lineAB = V2D.sub(a,b);
	var lineBC = V2D.sub(b,c);
	//var lineAC = V2D.sub(a,c);
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
Code.intersectRayTri = function(org,dir, a,b,c, nrm){ // finite ray - tri intersection (only non-parallel directions [else 2D line intersection])
	var num, den, ab, ac, bc, ca, ap, bp, cp, p, u, v, w;
	// solve for t in [0,1]
	num = nrm.x*(a.x-org.x) + nrm.y*(a.y-org.y) + nrm.z*(a.z-org.z);
	den = nrm.x*dir.x + nrm.y*dir.y + nrm.z*dir.z;
	if(den==0){ return null; } // zero or infinite intersections
	t = num/den;
	if(t<0 || t>1){ return null; } // outside ray
	p = new V3D(org.x+t*dir.x,org.y+t*dir.y,org.z+t*dir.z);
	// edges
	ab = V3D.sub(b,a);
	bc = V3D.sub(c,b);
	ca = V3D.sub(a,c);
	// to point
	ap = V3D.sub(p,a);
	bp = V3D.sub(p,b);
	cp = V3D.sub(p,c);
	// area directionals
	u = V3D.dot(V3D.cross(ab,ap),nrm);
	v = V3D.dot(V3D.cross(bc,bp),nrm);
	w = V3D.dot(V3D.cross(ca,cp),nrm);
	// all in same direction
	if( (u>=0 && v>=0 && w>=0) || (u<=0 && v<=0 && w<=0) ){
		return p;
	}
	return null;
}
Code.intersectRayQuad = function(org,dir, a,b,c,d, nrm){ // finite ray - quad intersection (only non-parallel directions [else 2D line intersection])
	var num, den, ab, ac, bc, ca, ap, bp, cp, p, u, v, w;
	// solve for t in [0,1]
	num = nrm.x*(a.x-org.x) + nrm.y*(a.y-org.y) + nrm.z*(a.z-org.z);
	den = nrm.x*dir.x + nrm.y*dir.y + nrm.z*dir.z;
	if(den==0){ return null; } // zero or infinite intersections
	t = num/den;
	if(t<0.0 || t>1.0){ return null; } // outside ray
	p = new V3D(org.x+t*dir.x,org.y+t*dir.y,org.z+t*dir.z);
	// edges
	ab = V3D.sub(b,a);
	bc = V3D.sub(c,b);
	cd = V3D.sub(d,c);
	da = V3D.sub(a,d);
	// to point
	ap = V3D.sub(p,a);
	bp = V3D.sub(p,b);
	cp = V3D.sub(p,c);
	dp = V3D.sub(p,d);
	// area directionals
	u = V3D.dot(V3D.cross(ab,ap),nrm);
	v = V3D.dot(V3D.cross(bc,bp),nrm);
	w = V3D.dot(V3D.cross(cd,cp),nrm);
	s = V3D.dot(V3D.cross(da,dp),nrm);
	// all in same direction
	if( (u>=0 && v>=0 && w>=0 && s>=0) || (u<=0 && v<=0 && w<=0 && s<=0) ){
		return p;
	}
	return null;
}
Code._temp_A = [];
// var A = Code._temp_A;
// A[0]=nA.x, A[1]=nA.y, A[2]=nA.z, A[3]=nB.x, A[4]=nB.y, A[5]=nB.z, A[6]=dir.x, A[7]=dir.y, A[8]=dir.z;
// Code.matrix3x3Inverse(A);
Code.planePlaneIntersection = function(pA,nA, pB,nB){ // infinite plane intersection = line
	var dir = V3D.cross(nA,nB).norm();
	if(dir.length()==0){return null;} // zero or infinite intersections
	var A = Code.matrix3x3Inverse([nA.x,nA.y,nA.z, nB.x,nB.y,nB.z, dir.x,dir.y,dir.z]);
	var b = new V3D(V3D.dot(pA,nA), V3D.dot(pB,nB), V3D.dot(pA,dir));
	Code.matrix3x3xV3D(b, A, b);
	return [b, dir];
}
Code.triTriIntersection2D = function(a1,b1,c1, a2,b2,c2){ // polygonal intersection
	// var ab1 = V2D.sub(a1,b1); // CW
	// var bc1 = V2D.sub(c1,a1);
	// var ca1 = V2D.sub(b1,c1);
	// var arrOrgA = [b1,a1,c1]; // CW
	// var arrDirA = [ab1,bc1,ca1];
	var ab1 = V2D.sub(b1,a1);
	var bc1 = V2D.sub(c1,b1);
	var ca1 = V2D.sub(a1,c1);
	var arrOrgA = [a1,b1,c1];
	var arrDirA = [ab1,bc1,ca1];
	var ab2 = V2D.sub(b2,a2);
	var bc2 = V2D.sub(c2,b2);
	var ca2 = V2D.sub(a2,c2);
	var arrOrgB = [a2,b2,c2];
	var arrDirB = [ab2,bc2,ca2];
	var cross1, cross2, cross3;
	var i, j, orgA, dirA, orgB, dirB, temp, p, dist;
	var polygon = [];
	var tempSort = function(a,b){ return b[1]-a[1]; } // largest at beginning, smallest at end
	for(i=0;i<3;++i){
		orgA = arrOrgA[i];
		dirA = arrDirA[i];
		// orgA inside B
		cross1 = V2D.cross(ab2,V2D.sub(orgA,a2));
		cross2 = V2D.cross(bc2,V2D.sub(orgA,b2));
		cross3 = V2D.cross(ca2,V2D.sub(orgA,c2));
		// strictly inside
		if( (cross1>0&&cross2>0&&cross3>0) || (cross1<0&&cross2<0&&cross3<0) ){ // CCW / CW
			polygon.push(V2D.copy(orgA));
		}
		// any intersections along 
		temp = []; // clear
		for(j=0;j<3;++j){
			orgB = arrOrgB[j];
			dirB = arrDirB[j];
			p = Code.rayFiniteInfinitePositiveIntersect2D(orgA,dirA, orgB,dirB);
			if(p){
				dist = V2D.distanceSquare(orgB,p);
				if(dist>dirB.lengthSquare()){ // use end point = next point
					p.copy( arrOrgB[(j+1)%3] );
				}
				//dist = V2D.distanceSquare(orgA,p);
				temp.push([p,dist]);
			}
		}
		// sort on closest intersection
		if(temp.length>0){
			if(temp.length>1){
				temp.sort(tempSort);
//console.log("--------------");
				//for(j=temp.length;j--;){
				for(j=0;j<temp.length;++j){
//console.log(temp[j][1]+": "+temp[j][0]+"");
					polygon.push(temp[j][0]);
				}
			}else{
				polygon.push(temp[0][0]);
			}
		}
	}
	return polygon; // remove duplicate (end) points ?
	// this is a double-copy for exactly the same triangles
}

Code.quadQuadIntersection2DBoolean = function(a1,b1,c1,d1, a2,b2,c2,d2){ 
	var checkA = Code.triTriIntersection2DBoolean(a1,b1,c1, a2,b2,c2);
	var checkB = Code.triTriIntersection2DBoolean(a1,b1,c1, a2,c2,d2);
	var checkC = Code.triTriIntersection2DBoolean(a1,c1,d1, a2,b2,c2);
	var checkD = Code.triTriIntersection2DBoolean(a1,c1,d1, a2,c2,d2);
	return checkA || checkB || checkC || checkD;
}


Code.triTriIntersection2DBoolean = function(a1,b1,c1, a2,b2,c2){ // polygonal intersection
	var ab1 = V2D.sub(b1,a1);
	var bc1 = V2D.sub(c1,b1);
	var ca1 = V2D.sub(a1,c1);
	var arrOrgA = [a1,b1,c1];
	var arrDirA = [ab1,bc1,ca1];
	var ab2 = V2D.sub(b2,a2);
	var bc2 = V2D.sub(c2,b2);
	var ca2 = V2D.sub(a2,c2);
	var arrOrgB = [a2,b2,c2];
	var arrDirB = [ab2,bc2,ca2];
	var i, j, orgA, dirA, orgB, dirB, temp, p, dist;
	// intersections?
	for(i=0;i<3;++i){
		orgA = arrOrgA[i];
		dirA = arrDirA[i];
		for(j=0;j<3;++j){
			orgB = arrOrgB[j];
			dirB = arrDirB[j];
			p = Code.rayFiniteIntersect2D(orgA,dirA, orgB,dirB);
			if(p){
				return true;
			}
		}
	}
	// 1 inside 2?
	orgA = a1;
	cross1 = V2D.cross(ab2,V2D.sub(orgA,a2));
	cross2 = V2D.cross(bc2,V2D.sub(orgA,b2));
	cross3 = V2D.cross(ca2,V2D.sub(orgA,c2));
	if( (cross1>=0&&cross2>0&&cross3>=0) || (cross1<=0&&cross2<=0&&cross3<=0) ){
		return true;
	}
	// 2 inside 1?
	orgB = a2;
	cross1 = V2D.cross(ab1,V2D.sub(orgB,a1));
	cross2 = V2D.cross(bc1,V2D.sub(orgB,b1));
	cross3 = V2D.cross(ca1,V2D.sub(orgB,c1));
	if( (cross1>=0&&cross2>0&&cross3>=0) || (cross1<=0&&cross2<=0&&cross3<=0) ){
		return true;
	}
	// no intersection
	return false;
}
Code.triTriIntersection3D = function(a1,b1,c1,n1, a2,b2,c2,n2){ // n = b-a x c-a
	var i, temp;
	// a triangle intersection exists if signed distances are different
	var d1 = -V3D.dot(n1,a1);
	var d12a = V3D.dot(n1,a2) + d1;
	var d12b = V3D.dot(n1,b2) + d1;
	var d12c = V3D.dot(n1,c2) + d1;
	if( (d12a>0 && d12b>0 && d12c>0) || (d12a<0 && d12b<0 && d12c<0) ){ return null; } // all tri2 on single side
	var d2 = -V3D.dot(n2,a2);
	var d21a = V3D.dot(n2,a1) + d2;
	var d21b = V3D.dot(n2,b1) + d2;
	var d21c = V3D.dot(n2,c1) + d2;
	if( (d21a>0 && d21b>0 && d21c>0) || (d21a<0 && d21b<0 && d21c<0) ){ return null; } // all tri1 on single side
	var ab1 = V3D.sub(b1,a1);
	var bc1 = V3D.sub(c1,b1);
	var ca1 = V3D.sub(a1,c1);
	var ab2 = V3D.sub(b2,a2);
	var bc2 = V3D.sub(c2,b2);
	var ca2 = V3D.sub(a2,c2);
	if( d12a==0 && d12b==0 && d12c==0 ){ // coplanar
		// project to 2D
		console.log("PLANAR");
		var theta = V3D.angle(n1,V3D.DIRZ);
		var norm = V3D.cross(V3D.DIRZ,n1);
		var matTo = Matrix3D.TEMP.identity();
		matTo.translate(-a1.x,-a1.y,-a1.z);
		matTo.rotateVector(norm, -theta);
		var pA1 = matTo.multV3D(new V3D(), a1);
		var pB1 = matTo.multV3D(new V3D(), b1);
		var pC1 = matTo.multV3D(new V3D(), c1);
		var pA2 = matTo.multV3D(new V3D(), a2);
		var pB2 = matTo.multV3D(new V3D(), b2);
		var pC2 = matTo.multV3D(new V3D(), c2);
		// find 2D intersections
		// console.log(pA1+" "+pB1+" "+pC1);
		// console.log(pA2+" "+pB2+" "+pC2);
		var int2D = Code.triTriIntersection2D(pA1,pB1,pC1, pA2,pB2,pC2);
		// unproject
		var matFr = Matrix3D.TEMP.identity();
		matFr.rotateVector(norm, theta);
		matFr.translate(a1.x,a1.y,a1.z);
		for(i=int2D.length;i--;){
			//console.log("fr: "+int2D[i]+"");
			int2D[i] = V3D.fromV2D(int2D[i]);
			matFr.multV3D(int2D[i],int2D[i]);
			//console.log("to: "+int2D[i]+"");
		}
		return int2D;
	}
	var line = Code.planePlaneIntersection(a1,n1, a2,n2);
	var o = line[0];
	var d = line[1]; d.norm();
	var o1, u1, o2, u2;
	// A segment of intersection
	if( (d21a<=0&&d21b>0&&d21c>0) || (d21a>=0&&d21b<0&&d21c<0) ){ // lone a
		o1 = Code.closestPointsLines3D(a1,ab1, o,d)[0];
		u1 = Code.closestPointsLines3D(c1,ca1, o,d)[0];
	}else if( (d21a>0&&d21b<=0&&d21c>0) || (d21a<0&&d21b>=0&&d21c<0) ){ // lone b
		o1 = Code.closestPointsLines3D(a1,ab1, o,d)[0];
		u1 = Code.closestPointsLines3D(b1,bc1, o,d)[0];
	}else if( (d21a>0&&d21b>0&&d21c<=0) || (d21a<0&&d21b<0&&d21c>=0) ){ // lone c
		o1 = Code.closestPointsLines3D(b1,bc1, o,d)[0];
		u1 = Code.closestPointsLines3D(c1,ca1, o,d)[0];
	}else if(d21a==0&&d21b==0){ // line ab
		o1 = V3D.copy(a1);
		u1 = V3D.copy(b1);
	}else if(d21b==0&&d21c==0){ // line bc
		o1 = V3D.copy(b1);
		u1 = V3D.copy(c1);
	}else if(d21c==0&&d21a==0){ // line ca
		o1 = V3D.copy(c1);
		u1 = V3D.copy(a1);
	}else{ return null; } // ?
	// B segment of intersection
	if( (d12a<=0&&d12b>0&&d12c>0) || (d12a>=0&&d12b<0&&d12c<0) ){ // lone a
		o2 = Code.closestPointsLines3D(a2,ab2, o,d)[0];
		u2 = Code.closestPointsLines3D(c2,ca2, o,d)[0];
	}else if( (d12a>0&&d12b<=0&&d12c>0) || (d12a<0&&d12b>=0&&d12c<0) ){ // lone b
		o2 = Code.closestPointsLines3D(a2,ab2, o,d)[0];
		u2 = Code.closestPointsLines3D(b2,bc2, o,d)[0];
	}else if( (d12a>0&&d12b>0&&d12c<=0) || (d12a<0&&d12b<0&&d12c>=0) ){ // lone c
		o2 = Code.closestPointsLines3D(b2,bc2, o,d)[0];
		u2 = Code.closestPointsLines3D(c2,ca2, o,d)[0];
	}else if(d12a==0&&d12b==0){ // line ab
		o2 = V3D.copy(a2);
		u2 = V3D.copy(b2);
	}else if(d12b==0&&d12c==0){ // line bc
		o2 = V3D.copy(b2);
		u2 = V3D.copy(c2);
	}else if(d12c==0&&d12a==0){ // line ca
		o2 = V3D.copy(c2);
		u2 = V3D.copy(a2);
	}else{ return null; } // ?
	// 1D interval check
	var int1A = V3D.dot(V3D.sub(o1,o),d);
	var int1B = V3D.dot(V3D.sub(u1,o),d);
	var int2A = V3D.dot(V3D.sub(o2,o),d);
	var int2B = V3D.dot(V3D.sub(u2,o),d);
//console.log(" "+int1A+" - "+int1B+"    "+int2A+" - "+int2B);
	if(int1A>int1B){ temp=int1A; int1A=int1B; int1B=temp; } // int1B before int1A
	if(int2A>int2B){ temp=int2A; int2A=int2B; int2B=temp; } // int2B before int2A
	if(int1A>int2A){ // int1 before int2
		temp=int1A; int1A=int2A; int2A=temp;
		temp=int1B; int1B=int2B; int2B=temp;
	}
	// no overlap
	if(int1B<int2A){ return null; }
	// first point
	var intA = int1A;
	if(int2A>int1A){ intA = int2A;}
	// second point
	var intB = int1B;
	if(int2B<int1B){ intB = int2B; }
// console.log(" "+int1A+" - "+int1B);
// console.log(" "+int2A+" - "+int2B);
// console.log("[ "+intA+" "+intB+" ]");
	// line segment in ray form
	a = V3D.add(o, d.copy().scale(intA));
	b = V3D.add(o, d.copy().scale(intB));
// console.log("[ "+a+" "+b+" ]");
	//d = d.scale(intB-intA); // d = V3D.sub(b,a);
	return [a,b]; // [a,d];
}
Code.triTriIntersection3DBoolean = function(a1,b1,c1,n1, a2,b2,c2,n2){ // n = b-a x c-a
	var i, temp;
	// a triangle intersection exists if signed distances are different
	var d1 = -V3D.dot(n1,a1);
	var d12a = V3D.dot(n1,a2) + d1;
	var d12b = V3D.dot(n1,b2) + d1;
	var d12c = V3D.dot(n1,c2) + d1;
	if( (d12a>0 && d12b>0 && d12c>0) || (d12a<0 && d12b<0 && d12c<0) ){ return false; } // all tri2 on single side
	var d2 = -V3D.dot(n2,a2);
	var d21a = V3D.dot(n2,a1) + d2;
	var d21b = V3D.dot(n2,b1) + d2;
	var d21c = V3D.dot(n2,c1) + d2;
	if( (d21a>0 && d21b>0 && d21c>0) || (d21a<0 && d21b<0 && d21c<0) ){ return false; } // all tri1 on single side
	var ab1 = V3D.sub(b1,a1);
	var bc1 = V3D.sub(c1,b1);
	var ca1 = V3D.sub(a1,c1);
	var ab2 = V3D.sub(b2,a2);
	var bc2 = V3D.sub(c2,b2);
	var ca2 = V3D.sub(a2,c2);
	if( d12a==0 && d12b==0 && d12c==0 ){ // coplanar
		// project to 2D
		var theta = V3D.angle(n1,V3D.DIRZ);
		var norm = V3D.cross(V3D.DIRZ,n1);
		var matTo = Matrix3D.TEMP.identity();
		matTo.translate(-a1.x,-a1.y,-a1.z);
		matTo.rotateVector(norm, -theta);
		var pA1 = matTo.multV3D(new V3D(), a1);
		var pB1 = matTo.multV3D(new V3D(), b1);
		var pC1 = matTo.multV3D(new V3D(), c1);
		var pA2 = matTo.multV3D(new V3D(), a2);
		var pB2 = matTo.multV3D(new V3D(), b2);
		var pC2 = matTo.multV3D(new V3D(), c2);
		// find 2D intersections
		return Code.triTriIntersection2DBoolean(pA1,pB1,pC1, pA2,pB2,pC2);
	}
	var line = Code.planePlaneIntersection(a1,n1, a2,n2);
	var o = line[0];
	var d = line[1]; d.norm();
	var o1, u1, o2, u2;
	// A segment of intersection
	if( (d21a<=0&&d21b>0&&d21c>0) || (d21a>=0&&d21b<0&&d21c<0) ){ // lone a
		o1 = Code.closestPointsLines3D(a1,ab1, o,d)[0];
		u1 = Code.closestPointsLines3D(c1,ca1, o,d)[0];
	}else if( (d21a>0&&d21b<=0&&d21c>0) || (d21a<0&&d21b>=0&&d21c<0) ){ // lone b
		o1 = Code.closestPointsLines3D(a1,ab1, o,d)[0];
		u1 = Code.closestPointsLines3D(b1,bc1, o,d)[0];
	}else if( (d21a>0&&d21b>0&&d21c<=0) || (d21a<0&&d21b<0&&d21c>=0) ){ // lone c
		o1 = Code.closestPointsLines3D(b1,bc1, o,d)[0];
		u1 = Code.closestPointsLines3D(c1,ca1, o,d)[0];
	}else if(d21a==0&&d21b==0){ // line ab
		o1 = V3D.copy(a1);
		u1 = V3D.copy(b1);
	}else if(d21b==0&&d21c==0){ // line bc
		o1 = V3D.copy(b1);
		u1 = V3D.copy(c1);
	}else if(d21c==0&&d21a==0){ // line ca
		o1 = V3D.copy(c1);
		u1 = V3D.copy(a1);
	}else{ return false; } // ?
	// B segment of intersection
	if( (d12a<=0&&d12b>0&&d12c>0) || (d12a>=0&&d12b<0&&d12c<0) ){ // lone a
		o2 = Code.closestPointsLines3D(a2,ab2, o,d)[0];
		u2 = Code.closestPointsLines3D(c2,ca2, o,d)[0];
	}else if( (d12a>0&&d12b<=0&&d12c>0) || (d12a<0&&d12b>=0&&d12c<0) ){ // lone b
		o2 = Code.closestPointsLines3D(a2,ab2, o,d)[0];
		u2 = Code.closestPointsLines3D(b2,bc2, o,d)[0];
	}else if( (d12a>0&&d12b>0&&d12c<=0) || (d12a<0&&d12b<0&&d12c>=0) ){ // lone c
		o2 = Code.closestPointsLines3D(b2,bc2, o,d)[0];
		u2 = Code.closestPointsLines3D(c2,ca2, o,d)[0];
	}else if(d12a==0&&d12b==0){ // line ab
		o2 = V3D.copy(a2);
		u2 = V3D.copy(b2);
	}else if(d12b==0&&d12c==0){ // line bc
		o2 = V3D.copy(b2);
		u2 = V3D.copy(c2);
	}else if(d12c==0&&d12a==0){ // line ca
		o2 = V3D.copy(c2);
		u2 = V3D.copy(a2);
	}else{ return false; } // ?
	// 1D interval check
	var int1A = V3D.dot(V3D.sub(o1,o),d);
	var int1B = V3D.dot(V3D.sub(u1,o),d);
	var int2A = V3D.dot(V3D.sub(o2,o),d);
	var int2B = V3D.dot(V3D.sub(u2,o),d);
	if(int1A>int1B){ temp=int1A; int1A=int1B; int1B=temp; } // int1B before int1A
	if(int2A>int2B){ temp=int2A; int2A=int2B; int2B=temp; } // int2B before int2A
	if(int1A>int2A){ // int1 before int2
		temp=int1A; int1A=int2A; int2A=temp;
		temp=int1B; int1B=int2B; int2B=temp;
	}
	// no overlap
	if(int1B<int2A){ return false; }
	return true;
}
Code.planeEquationFromPointNormal = function(pnt,nrm){ // should d = -dot?
	var q = new V3D(nrm.x,nrm.y,nrm.z); q.norm();
	var dot = q.x*pnt.x + q.y*pnt.y + q.z*pnt.z; // q.scale(dot);
	return {a:nrm.x, b:nrm.y, c:nrm.z, d:-dot};
}
Code.planePointNormalFromEquation = function(a,b,c,d){
	var nrm = new V3D(a,b,c);
	var len = nrm.length();
	if(len!=0.0){ len = 1.0/len; }
	return {normal:nrm, point:new V3D(a*d*len,b*d*len,c*d*len)};
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- equation coefficients
Code.lineOriginAndDirection2DFromEquation = function(org,dir, a,b,c){
	if(c==0){
		org.x = 0;
		org.y = 0;
		dir.x = 0;
		dir.y = 0;
	}else{
		len = Math.sqrt(a*a+b*b);
		len = len*len;
		org.x = -a*c/len;
		org.y = -b*c/len;
		dir.x = -b;
		dir.y = a;
		dir.norm();
	}
}
Code.lineEquationFromPoints2D = function(a,b){ // 
	dir = V2D.sub(b,a);
	var closest = Code.closestPointLine2D(a,dir, V2D.ZERO);
	var len = closest.length();
	closest.norm();
	return {a:closest.x, b:closest.y, c:-len};
}
Code.homoIntersectionFromLines2D = function(a1,b1,c1, a2,b2,c2){ // [A]x B
	return new V3D(b1*c2-c1*b2, c1*a2-a1*c2, a1*b2-b1*a2); // 
}
Code.homoLineFromPoints2D = function(a1,b1,c1, a2,b2,c2){ // [A]x B - dual
	return new V3D(b1*c2-c1*b2, c1*a2-a1*c2, a1*b2-b1*a2);
}
Code.conicFromCoefficients = function(a,b,c,d,e,f){
	return new Matrix2D().setFromArray([a,b*0.5,d*0.5, b*0.5,c,e*0.5, d*0.5,e*0.5,f]);
}
Code.quadricFromCoefficients = function(a,b,c,d,e,f,g,h,i,j){ // M4D?
	//return new Matrix3D().setFromArray([a,b*0.5,d*0.5, b*0.5,c,e*0.5, d*0.5,e*0.5,f]);
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- Array Matrix Math
Code.matrix3x3xV3D = function(z,m,x){ // z = matrix*x
	if(!x){ x=m; m=z; z=new V3D(); }
	z.set(m[0]*x.x+m[1]*x.y+m[2]*x.z, m[3]*x.x+m[4]*x.y+m[5]*x.z, m[6]*x.x+m[7]*x.y+m[8]*x.z);
	return z;
}
Code.matrix3x3Inverse = function(z,x){ // z = inverse(x)
	x = x||z;
	var det = x[0]*(x[4]*x[8]-x[5]*x[7]) + x[1]*(x[6]*x[5]-x[3]*x[8]) + x[2]*(x[3]*x[7]-x[6]*x[4]); // a*(e*i-f*h) + b*(g*f-d*i) + c*(d*h-g*e)
	if(det==0.0){ return null; }
	det = 1.0/det;
	var a = (x[4]*x[8]-x[5]*x[7])*det;
	var b = (x[2]*x[7]-x[1]*x[8])*det;
	var c = (x[1]*x[5]-x[2]*x[4])*det;
	var d = (x[5]*x[6]-x[3]*x[8])*det;
	var e = (x[0]*x[8]-x[2]*x[6])*det;
	var f = (x[2]*x[3]-x[0]*x[5])*det;
	var g = (x[3]*x[7]-x[4]*x[6])*det;
	var h = (x[1]*x[6]-x[0]*x[7])*det;
	var i = (x[0]*x[4]-x[1]*x[3])*det;
	z[0] = a; z[1] = b; z[2] = c; z[3] = d; z[4] = e; z[5] = f; z[6] = g; z[7] = h; z[8] = i;
	return z;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- CLOSEST POINT 3D
Code.closestPointsSegments3D = function(oa,da, ob,db){ // finite ray-ray closet points
	var A, B, ta, tb, flip;
	var dot_dada = V3D.dot(da,da);
	var dot_dadb = V3D.dot(da,db);
	var dot_dbdb = V3D.dot(db,db);
	var dot_oada = V3D.dot(oa,da);
	var dot_obdb = V3D.dot(ob,db);
	var dot_oadb = V3D.dot(oa,db);
	var dot_obda = V3D.dot(ob,da);
	var den = dot_dada*dot_dbdb - dot_dadb*dot_dadb;
	if(den==0){ // parallel, pick some point and match
		B = new V3D(ob.x+db.x,ob.y+db.y,ob.z+db.z);
		ta = Code.closestPointTLine3D(oa,da, ob);
		tb = Code.closestPointTLine3D(oa,da, B);
		flip = false;
		if(ta>tb){ flip=ta; ta=tb; tb=flip; flip=true;} // ordered increasing, if anti-parallel
		if(ta<=0 && tb<=0){
			A = new V3D(oa.x,oa.y,oa.z);
			tb = flip?0:1;
			B = new V3D(ob.x+tb*db.x,ob.y+tb*db.y,ob.z+tb*db.z);
		}else if(ta<0.0 && tb>0.0){
			A = new V3D(oa.x,oa.y,oa.z); // A = new V3D(oa.x+tb*da.x,oa.y+tb*da.y,oa.z+tb*da.z);
			B = Code.closestPointLine3D(ob,db, A);
		}else if(ta>=0.0 && ta<=1.0){
			A = new V3D(oa.x+ta*da.x,oa.y+ta*da.y,oa.z+ta*da.z);
			tb = flip?1:0;
			B = new V3D(ob.x+tb*db.x,ob.y+tb*db.y,ob.z+tb*db.z);
		}else{ // ta>=1.0 && b>=1.0
			A = new V3D(oa.x+da.x,oa.y+da.y,oa.z+da.z);
			tb = flip?1:0;
			B = new V3D(ob.x+tb*db.x,ob.y+tb*db.y,ob.z+tb*db.z);
		}
	}else{
		var oadb_obdb = dot_oadb - dot_obdb;
		var obda_oada = dot_obda - dot_oada;
		ta = (dot_dadb*oadb_obdb + dot_dbdb*obda_oada)/den;
		tb = (dot_dadb*obda_oada + dot_dada*oadb_obdb)/den;
		if(ta<0.0){
			ta = 0.0;
			tb = (dot_oadb-dot_obdb)/dot_dbdb; // closest point given endpoint oa
			tb = Math.min(Math.max(tb,0.0),1.0);
		}else if(ta>1.0){
			ta = 1.0;
			A = V3D.add(oa,da);
			tb = (V3D.dot(A,db)-dot_obdb)/dot_dbdb; // closest point given endpoint oa+da
			tb = Math.min(Math.max(tb,0.0),1.0);
		}else if(tb<0.0){
			tb = 0.0;
			ta = (dot_obda-dot_oada)/dot_dada; // closest point given endpoint ob
			ta = Math.min(Math.max(ta,0.0),1.0);
		}else if(tb>1.0){
			tb = 1.0;
			B = V3D.add(ob,db);
			ta = (V3D.dot(B,da)-dot_oada)/dot_dada; // closest point given endpoint ob+db
			ta = Math.min(Math.max(ta,0.0),1.0);
		}
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

Code.closestPointPlane3D = function(q,n, p){ // 
	var t = ((q.x-p.x)*n.x + (q.y-p.y)*n.y + (q.z-p.z)*n.z)/(n.x*n.x+n.y*n.y+n.z*n.z);
	return new V3D(p.x+t*n.x,p.y+t*n.y,p.z+t*n.z);
}
Code.closestPointTri3D = function(pnt, a,b,c,nrm){ // closest point to plane also inside tri bounds
	var p, ab,bc,ca, u,v,w;
	p = Code.closestPointPlane3D(a,nrm, pnt);
	// edges
	ab = V3D.sub(b,a);
	bc = V3D.sub(c,b);
	ca = V3D.sub(a,c);
	// to point
	ap = V3D.sub(p,a);
	bp = V3D.sub(p,b);
	cp = V3D.sub(p,c);
	// area directionals
	u = V3D.dot(V3D.cross(ab,ap),nrm);
	v = V3D.dot(V3D.cross(bc,bp),nrm);
	w = V3D.dot(V3D.cross(ca,cp),nrm);
	// all in same direction
	if( (u>=0 && v>=0 && w>=0) || (u<=0 && v<=0 && w<=0) ){
		return p;
	}
	return null;
}

Code.closestDistancePointTri3D = function(p, a,b,c,nrm){ // shortest distance between point p and tri a,b,c
	var d1,d2,d3, ray = Code.closestPointTri3D(p,a,b,c,nrm);
	if( ray ){ // closest point to plane inside tri
		return V3D.distance(p,ray);
	} // else closest point on each of 3 edges
	ray = new V3D();
	V3D.sub(ray, b,a);
	d1 = V3D.distanceSquare(p, Code.closestPointLineSegment3D(a,ray, p) );
	V3D.sub(ray, c,b);
	d2 = V3D.distanceSquare(p, Code.closestPointLineSegment3D(b,ray, p) );
	V3D.sub(ray, a,c);
	d3 = V3D.distanceSquare(p, Code.closestPointLineSegment3D(c,ray, p) );
	return Math.sqrt( Math.min(d1,d2,d3) );
}
Code.closestDistanceSegmentTri3D = function(org,dir, a,b,c,nrm){ // shortest distance between line segment AB and tri a,b,c
	var ab, ac, bc, ca, pA,pB,pC, dA,dB,dC;
	ab = V3D.sub(b,a);
	ac = V3D.sub(c,a);
	if(nrm===undefined){ nrm=V3D.cross(ab,ac).norm(); }
	// check for interrior triangle plane intersection with line
	pA = Code.intersectRayTri(org,dir, a,b,c, nrm);
//console.log("A "+pA);
	if(pA){
		return 0;
	}
	// check for interrior triangle plane closest point with line ends
	var B = new V3D(org.x+dir.x, org.y+dir.y, org.z+dir.z);
	pA = Code.closestPointTri3D(org, a,b,c,nrm);
	pB = Code.closestPointTri3D(B,   a,b,c,nrm);
//console.log("B "+pA+" "+pB);
	if(pA&&pB){
		dA = V3D.distance(org,pA);
		dB = V3D.distance(B,pB);
		return Math.min(dA,dB);
	}else if(pA){
		return V3D.distance(org,pA);
	}else if(pB){
		return V3D.distance(B,pB);
	}
	// find closest point between each segment
//console.log("C");
	bc = V3D.sub(c,b);
	ca = V3D.sub(a,c);
	pA = Code.closestPointsSegments3D(org,dir, a,ab);
	dA = V3D.distance(pA[0],pA[1]);
//console.log(" "+dA+" "+pA[0]+" "+pA[1]);
	pB = Code.closestPointsSegments3D(org,dir, b,bc);
	dB = V3D.distance(pB[0],pB[1]);
//console.log(" "+dB+" "+pB[0]+" "+pB[1]);
	pC = Code.closestPointsSegments3D(org,dir, c,ca);
	dC = V3D.distance(pC[0],pC[1]);
//console.log(" "+dC+" "+pC[0]+" "+pC[1]);
	return Math.min(dA,dB,dC);
}
Code.isPointInsideRect2D = function(p, a,b,c,d){ 
	return Code.isPointInsidePolygon2D(p, [a,b,c,d]);
}
Code.isPointInsidePolygon2D = function(p, polygonArray){ // http://alienryderflex.com/polygon/   || return: intersections % 2 != 0
	var i, j, a, b, len=polygonArray.length;
	if(len<=2){ return false; } // check is on/near line for len==2?
	var oddNodes = false;
	for(i=0, j=len-1; i<len; ++i){
		a = polygonArray[i];
		b = polygonArray[j];
		if( ((a.y<p.y && b.y>=p.y) || (b.y<p.y && a.y>=p.y)) && (a.x<=p.x || b.x<=p.x) ){
			var intersect = (a.x+(p.y-a.y)/(b.y-a.y)*(b.x-a.x));
			intersect = (intersect < p.x);
			oddNodes = (oddNodes==intersect) ? false : true; // xor
			//oddNodes ^= intersect;
		}
		j = i;
	}
	return oddNodes;
}
Code.polygonOperation2D = function(polyA,polyB, _iteration, operation){
	var polyA = Poly2D.poly2DfromArray(polyA);
	var polyB = Poly2D.poly2DfromArray(polyB);
	var polyC = Poly2D.compute(polyA,polyB,operation, _iteration);
	return polyC;
}
Code.polygonUnion2D = function(polyA,polyB, _iteration){
	return Code.polygonOperation2D(polyA,polyB, _iteration, Poly2D.SweepEvent.ResultTypeUnion);
}
Code.polygonIntersection2D = function(polyA,polyB, _iteration){
	return Code.polygonOperation2D(polyA,polyB, _iteration, Poly2D.SweepEvent.ResultTypeIntersection);
}
Code.polygonDifference2D = function(polyA,polyB, _iteration){
	return Code.polygonOperation2D(polyA,polyB, _iteration, Poly2D.SweepEvent.ResultTypeDifference);
}
Code.polygonXOR2D = function(polyA,polyB, _iteration){
	return Code.polygonOperation2D(polyA,polyB, _iteration, Poly2D.SweepEvent.ResultTypeXOR);
}
Code.polygonArea2D = function(polyArray){
	var polygon = Poly2D.poly2DfromArray(polyArray);
	var area = polygon.area();
	polygon.kill();
	return area;
}
Code.rectContainingRectAtTangent = function(a,b,c,d, tan){
	var points = [a,b,c,d];
	var angle = V2D.angle(V2D.DIRX,tan);
	// rotate
	for(i=0;i<points.length;++i){
		points[i] = V2D.rotate(points[i], -angle);
	}
	// find bounding box
	var extrema = V2D.extremaFromArray(points);
	var min = extrema.min;
	var max = extrema.max;
	points[0].set(min.x,min.y);
	points[1].set(max.x,min.y);
	points[2].set(max.x,max.y);
	points[3].set(min.x,max.y);
	// rotate back
	for(i=0;i<points.length;++i){
		points[i] = V2D.rotate(points[i], angle);
	}
	return points;
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
Code.SSDEqual = function(a,b){
	var maxA = Math.max.apply(this,a);
	var minA = Math.min.apply(this,a);
	var maxB = Math.max.apply(this,b);
	var minB = Math.min.apply(this,b);
	var rangeA = maxA-minA;
	var rangeB = maxB-minB;
	if(rangeA!=0){ rangeA = 1.0/rangeA; }
	if(rangeB!=0){ rangeB = 1.0/rangeB; }
	var i, ssd = 0;
	for(i=a.length;i--;){
		ssd += Math.pow( rangeA*(a[i]-minA) - rangeB*(b[i]-minB),2);
	}
	return ssd;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- 


Code.cuboidsSeparate = function(aMin,aMax, bMin,bMax){
	return aMax.x<bMin.x || aMax.y<bMin.y || aMax.z<bMin.z || aMin.x>bMax.x || aMin.y>bMax.y || aMin.z>bMax.z;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------- 
Code.parsePointSetString = function(data, max){
	var lines = data.split("\n");
	var i, v, line, nums, x, y, z, list = [], len = lines.length;
	if(max!==undefined){ len = max; } // limit to max lines
	for(i=0;i<len;++i){
		line = lines[i];
		if(line.length==0 || line.charAt(0)=="#"){ continue; } // comments, empty lines
		nums = line.split(" ");
		if(nums.length>=3){ // 1st line is length, some sources have additional fields
			x = Number(nums[0]);
			y = Number(nums[1]);
			z = Number(nums[2]);
			v = new V3D(x,y,z);
			list.push(v);
		}
	}
	return list;
}



Code.requiredIterationsForModel = function(pDesiredCoverage, pOutlier, sampleCount){
	return Math.ceil(Math.log(1.0-pDesiredCoverage)/Math.log( 1 - Math.pow(pOutlier,sampleCount) ))
}


// -------------------------------------------------------------------------------------------------------------------------------------------------  THESE NEED TO BE RECHECKED - COPIED FROM OLD CODE

Code.killArray = function(a){
	while(a.length>0){ a.pop().kill(); }
}
Code.killMe = function(obj){
	for(var key in obj){
		obj[key] = null;
	}
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

// conversion functions ----------------------------------------------
Code.getHex = function (intVal){
	var str = intVal.toString(16);
	while(str.length<6){
		str = "0"+str;
	}
	return '#'+str;
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
Code.binaryToBase64String = function(binaryData){
	return window.btoa(binaryData);
}
Code.base64StringToBinary = function(stringData){
	return null; // ?
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
}


// multivalued logic [0,1]
Code.fuzzyNot = function(a){ // compliment
	return 1 - a;
}
Code.fuzzyAnd = function(a,b){ // intersection
	return Math.min(a,b);
}
Code.fuzzyOr = function(a,b){ // union
	return Math.max(a,b);
}
Code.fuzzyXor = function(a,b){ // 
	return Math.min( Math.max(a,b), Math.max(1-a,1-b) ); // === Math.max( Math.min(a,1-b), Math.min(1-a,b) );
}
Code.fuzzyProbOr = function(a,b){
	return a+b - a*b;
}
Code.fuzzyProbAnd = function(a,b){
	return a*b;
}
Code.fuzzyDistance = function(a,b){
	return Math.abs(a-b);
}
Code.fuzzyRound = function(a,b){
	return (a<b)?a:1;
}
Code.fuzzyTruncate = function(a,b){
	return (a>b)?a:0;
}



// // bezier curves:
// Code.bezier2DQuadraticExtrema = function(A, B, C){
// 	var tx = 0.5;
// 	var ty = 0.5;
// 	var denX = A.x - 2*B.x + C.x;
// 	var denY = A.y - 2*B.y + C.y;
// 	if(denX==0 || denY==0){
// 		return null;
// 	}
// 	tx = (A.x - B.x)/denX;
// 	ty = (A.y - B.y)/denY;
// 	var tx1 = 1-tx;
// 	var ty1 = 1-ty;
// // cap t in [0,1]
// 	return new V2D( A.x*tx1*tx1 + 2*B.x*tx1*tx + C.x*tx*tx, A.y*ty1*ty1 + 2*B.y*ty1*ty + C.y*ty*ty );
// }



// Code.bezier2DCubicExtrema = function(A, B, C, D){
// 	var t, a, b, c, z0, z1, ins, sqr;
// /*
// // A.x -= A.x;
// // B.x -= A.x;
// // C.x -= A.x;
// // D.x -= A.x;
// // X
// 	a = -A.x + 3*B.x - 3*C.x + D.x;
// 	b = 2*A.x - 4*B.x + 2*C.x;
// 	c = B.x - A.x;
// console.log(a,b,c);
// 	if(a==0){ return null; }
// 	ins = b*b - 4*a*c;
// console.log(ins);
// 	if(ins < 0){ return null; } // ?
// 	sqr = Math.sqrt(ins);
// 	z0 = (-b + sqr)/(2*a);
// 	z1 = (-b - sqr)/(2*a);
// console.log(z0,z1)

// */


// // A.y -= A.y;
// // B.y -= A.y;
// // C.y -= A.y;
// // D.y -= A.y;
// //t = (-A.y + 2*B.y - C.y)/(-A.y + 3*B.y - 3*C.y + D.y);
// //console.log("second: "+t);
// // Y
// 	a = -A.y + 3*B.y - 3*C.y + D.y;
// 	b = 2*A.y - 4*B.y + 2*C.y;
// 	c = B.y - A.y;
// // a *= 3;
// // b *= 3;
// // c *= 3;
// console.log(a,b,c);
// //	if(a==0){ return null; }
// 	ins = b*b - 4*a*c;
// console.log(ins);
// 	if(ins < 0){ return null; } // ?
// 	sqr = Math.sqrt(ins);
// console.log((-b + sqr),(-b - sqr))
// 	z0 = (-b + sqr)/(2*a);
// 	z1 = (-b - sqr)/(2*a);
// console.log(z0,z1)


// function computeCubicFirstDerivativeRoots(a,b,c,d) {
//     var ret = [-1,-1];
//   var tl = -a+2*b-c;
//   var tr = -Math.sqrt(-a*(c-d) + b*b - b*(c+d) +c*c);
//   var dn = -a+3*b-3*c+d;
//     if(dn!=0) { ret[0] = (tl+tr)/dn; ret[1] = (tl-tr)/dn; }
//     return ret; 
// }

// console.log(A.y,B.y,C.y,D.y);
// console.log( computeCubicFirstDerivativeRoots(A.y,B.y,C.y,D.y) )
// //console.log( computeCubicFirstDerivativeRoots(A.x,B.x,C.x,D.x) )

// 	// ... which ?
// 	t = z0;
// 	// ?
// 	t = z1;
// 	// 
// 	t1 = 1-t;
// 	return new V2D( );
// }

Code.bezier2DExtrema = function(){ // arguments = list of coefficients
	// Newton Raphson
	// 
}


Code.bezier2DQuadraticBoundingBox = function(A, B, C){ // parbola maxima root finding
	//var t, u, f, g, h, point, step, steps = 20;
	var minX, minY, maxX, maxY, x, y, t;
	minX  = Math.min(A.x,C.x);
	minY = Math.min(A.y,C.y);
	maxX  = Math.max(A.x,C.x);
	maxY = Math.max(A.y,C.y);
	numX = A.x - B.x;
	numY = A.y - B.y;
	denX = A.x - 2*B.x + C.x;
	denY = A.y - 2*B.y + C.y;
	if(denX!=0){
		t = numX/denX;
		if(t>0 && t<1){
			x = Code.bezier2DQuadraticAtT(A,B,C, t).x;
			minX  = Math.min(minX,x);
			maxX  = Math.max(maxX,x);
		}
	}
	if(denY!=0){
		t = numY/denY;
		if(t>0 && t<1){
			y = Code.bezier2DQuadraticAtT(A,B,C, t).y;
			minY  = Math.min(minY,y);
			maxY  = Math.max(maxY,y);
		}
	}
	return new Rect(minX,minY, maxX-minX,maxY-minY);
}
Code.bezier2DCubicBoundingBox = function(A, B, C, D){ // Newton-Raphson
	var t, u, f, g, h, point, step, steps = 20;
	var minX, minY, maxX, maxY;
	minX  = Math.min(A.x,D.x);
	minY = Math.min(A.y,D.y);
	maxX  = Math.max(A.x,D.x);
	maxY = Math.max(A.y,D.y);
	var min = 1E-6;
	for(step=0;step<=steps;++step){
		t = 1.0*step/steps;
		// X
		for(i=0;i<10;++i){
			g = Code.bezier2DCubicTangentAtT(A,B,C,D, t);
			h = Code.bezier2DCubicSecondAtT(A,B,C,D, t);
			u = t;
			if( h.x!=0 ){ t = t - g.x/h.x; }else{ break; }
			if( Math.abs(u-t) < min){ break; }
		}
		t = Math.min(1, Math.max(0,t)); // cap in reality
		point = Code.bezier2DCubicAtT(A,B,C,D, t);
		minX = (point.x<minX)?point.x:minX;
		maxX = (point.x>maxX)?point.x:maxX;
		// Y
		for(i=0;i<10;++i){
			g = Code.bezier2DCubicTangentAtT(A,B,C,D, t);
			h = Code.bezier2DCubicSecondAtT(A,B,C,D, t);
			u = t;
			if( h.y!=0 ){ t = t - g.y/h.y; }else{ break; }
			if( Math.abs(u-t) < min){ break; }
		}
		t = Math.min(1, Math.max(0,t)); // cap in reality
		point = Code.bezier2DCubicAtT(A,B,C,D, t);
		minY = (point.y<minY)?point.y:minY;
		maxY = (point.y>maxY)?point.y:maxY;
	}
	return new Rect(minX,minY, maxX-minX,maxY-minY);
}

Code.bezier2DQuadraticSplit = function(A, B, C, t){ // De Casteljau's algorithm
	var u = 1.0 - t;
	var Q = Code.bezier2DQuadraticAtT(A,B,C, t);
	var AB = new V2D(A.x*u+B.x*t, A.y*u+B.y*t);
	var BC = new V2D(B.x*u+C.x*t, B.y*u+C.y*t);
	var X = new V2D(AB.x*u+BC.x*t, AB.y*u+BC.y*t);
	return [[A,AB,X,Q], [Q,Y,CD,D]];
}
Code.bezier2DCubicSplit = function(A, B, C, D, t){ // De Casteljau's algorithm
	var u = 1.0 - t;
	var Q = Code.bezier2DCubicAtT(A,B,C,D, t);
	var AB = new V2D(A.x*u+B.x*t, A.y*u+B.y*t);
	var BC = new V2D(B.x*u+C.x*t, B.y*u+C.y*t);
	var CD = new V2D(C.x*u+D.x*t, C.y*u+D.y*t);
	var X = new V2D(AB.x*u+BC.x*t, AB.y*u+BC.y*t);
	var Y = new V2D(BC.x*u+CD.x*t, BC.y*u+CD.y*t);
	return [[A,AB,X,Q], [Q,Y,CD,D]];
}
Code.bezier2DSplit = function(){ // arguments = list of coefficients | cut point
	// 
}




Code.bezier2DQuadraticAtT = function(A,B,C, t){
	var t1 = 1-t;
	var tA = t1*t1;
	var tB = 2*t1*t;
	var tC = t*t;
	return new V2D( A.x*tA+B.x*tB+C.x*tC, A.y*tA+B.y*tB+C.y*tC );
}
Code.bezier2DQuadraticTangentAtT = function(A,B,C, t){
	return new V2D( 2*(t-1)*A.x + 2*(1-2*t)*B.x + 2*t*C.x, 2*(t-1)*A.y + 2*(1-2*t)*B.y + 2*t*C.y );
}
Code.bezier2DQuadraticSecondAtT = function(A,B,C, t){
	return new V2D( 2*A.x-4*B.x+2*C.x, 2*A.y-4*B.y+2*C.y );
}
Code.bezier2DQuadraticNormalAtT = function(A,B,C, t){
	var eps = 0.001;
	var tanA = Code.bezier2DQuadraticTangentAtT(A,B,C, t-eps);
	var tanB = Code.bezier2DQuadraticTangentAtT(A,B,C, t+eps);
	tanA.norm();
	tanB.norm();
	var norm = V2D.sub(tanB,tanA);
	norm.scale(0.5/eps);
	return norm;
}
Code.bezier2DQuadraticClosestPointToPoint = function(source, A,B,C, intervals){
	intervals = intervals!==undefined?intervals:100;
	var i, t, point;
	var bestPoint = null, bestDistance = null;
	for(i=0;i<=intervals;++i){
		t = i/intervals;
		point = Code.bezier2DQuadraticAtT(A,B,C, t);
		distance = V2D.distance(point,source);
		if(!bestPoint || distance<bestDistance){
			bestPoint = point;
			bestDistance = distance;
		}
	}
	return bestPoint;
}
Code.bezier2DCubicClosestPointToPoint = function(source, A,B,C,D, intervals, loops){
	intervals = intervals!==undefined?intervals:10;
	loops = loops!==undefined?loops:3;
	var i, j, t, point, bestPoints = [], tMin = 0, tMax = 1.0;;
	var sortFxn = function(a,b){ return a[0] - b[0]; };
	for(j=0;j<=loops;++j){
		for(i=0;i<=intervals;++i){
			t = (i/intervals)*(tMax-tMin) + tMin;
			point = Code.bezier2DCubicAtT(A,B,C,D, t);
			distance = V2D.distance(point,source);
			bestPoints.push([distance,t,point]);
			bestPoints.sort(sortFxn);
			Code.truncateArray(bestPoints,2);
		}
		tMin = Math.min( bestPoints[0][1], bestPoints[1][1] );
		tMax = Math.max( bestPoints[0][1], bestPoints[1][1] );
		if(tMin==tMax){
			break;
		}
	}
	var best = bestPoints[0][2];
	Code.emptyArray(bestPoints);
	return best;
	//return bestPoint;
}

Code.bezier2DCubicAtT = function(A,B,C,D, t){
	var t1 = 1-t;
	var tA = t1*t1*t1;
	var tB = 3*t1*t1*t;
	var tC = 3*t1*t*t;
	var tD = t*t*t;
	return new V2D( A.x*tA+B.x*tB+C.x*tC+D.x*tD, A.y*tA+B.y*tB+C.y*tC+D.y*tD );
}
Code.bezier1DCubicAtT = function(a,b,c,d, t){
	var t1 = 1-t;
	var tA = t1*t1*t1;
	var tB = 3*t1*t1*t;
	var tC = 3*t1*t*t;
	var tD = t*t*t;
	return a*tA+b*tB+c*tC+d*tD;
}

Code.bezier2DCubicTangentAtT = function(A,B,C,D, t){ // scaled tangent
	var t1 = 1-t;
	/*var tt = t*t;
	var tA = 3*(-1+2*t-tt);
	var tB = 3*(1-4*t+3*tt);
	var tC = 3*(2*t-3*tt);
	var tD = 3*tt;
	return new V2D( A.x*tA+B.x*tB+C.x*tC+D.x*tD, A.y*tA+B.y*tB+C.y*tC+D.y*tD );
	*/
	//return new V2D( -3*t1*t1*A.x + 3*t1*t1*B.x - 6*t*t1*B.x - 3*t*t*C.x + 6*t*t1*C.x + 3*t*t*D.x,  -3*t1*t1*A.y + 3*t1*t1*B.y - 6*t*t1*B.y - 3*t*t*C.y + 6*t*t1*C.y + 3*t*t*D.y );
	return new V2D( 3*t1*t1*(B.x-A.x)+6*t*t1*(C.x-B.x)+3*t*t*(D.x-C.x) , 3*t1*t1*(B.y-A.y)+6*t*t1*(C.y-B.y)+3*t*t*(D.y-C.y) );
}
Code.bezier2DCubicNormalAtT = function(A,B,C,D, t){ // scaled normal - NOT CURRENTLY direction of osculating circle
	// cheating
	var eps = 0.001;
	var tanA = Code.bezier2DCubicTangentAtT(A,B,C,D, t-eps);
	var tanB = Code.bezier2DCubicTangentAtT(A,B,C,D, t+eps);
	tanA.norm();
	tanB.norm();
	var norm = V2D.sub(tanB,tanA);
	norm.scale(0.5/eps);
	return norm;
}




Code.bezier2DCubicSecondAtT = function(A,B,C,D, t){ // second derivative
	var t1 = 1-t;
	var tt = t*t;
	return new V2D( 6*t1*(C.x-2*B.x+A.x)+6*t*(D.x-2*C.x+B.x),  6*t1*(C.y-2*B.y+A.y)+6*t*(D.y-2*C.y+B.y) );
}

Code.bezier2DQuadraticLength = function(A,B,C, intervals){
	intervals = intervals!==undefined?intervals:100;
	var i, t;
	var ptA = new V2D(), ptB = new V2D();
	var distance = 0;
	t = 0.0;
	ptA = Code.bezier2DQuadraticAtT(A,B,C, t);
	for (i=1; i<=intervals; ++i){
		t = i/intervals;
		ptB = Code.bezier2DQuadraticAtT(A,B,C, t);
		distance += V2D.distance(ptA,ptB);
		ptA.x = ptB.x;
		ptA.y = ptB.y;
	}
	return distance;
}

Code.bezier2DCubicLength = function(A,B,C,D, intervals){
	intervals = intervals!==undefined?intervals:100;
	var i, t;
	var ptA = new V2D(), ptB = new V2D();
	var distance = 0;
	t = 0.0;
	ptA = Code.bezier2DCubicAtT(A,B,C,D, t);
	for (i=1; i<=intervals; ++i){
		t = i/intervals;
		ptB = Code.bezier2DCubicAtT(A,B,C,D, t);
		distance += V2D.distance(ptA,ptB);
		ptA.x = ptB.x;
		ptA.y = ptB.y;
	}
	return distance;
}

Code.bezier2DCubicLinearN = function(A,B,C,D){
	
}






Code.spherePointFrom2DRect = function(originx,originy,width,height, px,py){
	var center = new V3D(originx+width*0.5,originy+height*0.5,0);
	var point = new V3D(px,py,0);
	var cenToPnt = V3D.sub(point,center);
	var radius = Math.min(center.x,center.y);
	if(cenToPnt.length()>radius){ // snap to sphere
		cenToPnt.norm().scale(radius);
		cenToPnt.z = 0;
	}else{
		cenToPnt.z = Math.sqrt(radius*radius - cenToPnt.y*cenToPnt.y - cenToPnt.x*cenToPnt.x);
	}
	cenToPnt.y = -cenToPnt.y;
	return cenToPnt;
}



Code.insideTrianglePadded3D = function(a,b,c,pad){
	// check inside inside triangle
	// check inside outer triangle
	// check inside any of circles radius pad
	// check sub-rectangles
	return false;
}

Code.uint32FromByteArray = function(binaryArray,offset){
	var out = binaryArray[offset+0]<<24 | binaryArray[offset+1]<<16 |  binaryArray[offset+2]<<8 |  binaryArray[offset+3]<<0;
	return out >>> 0;
}
Code.uint16FromByteArray = function(binaryArray,offset){
	var out = binaryArray[offset+0]<<8 | binaryArray[offset+1]<<0;
	return out >>> 0;
}
Code.uint8FromByteArray = function(binaryArray,offset){
	return binaryArray[offset+0] >>> 0;
}


Code.BROWSER_TYPE_UNKNOWN = "unknown";
Code.BROWSER_TYPE_IE6 = "ie6";
Code.getBrowser = function(){
	if(!navigator){
		return Code.BROWSER_TYPE_IE6;
	}
	console.log(navigator);
	console.log(navigator.product);
	console.log(navigator.appVersion);
	console.log(navigator.platform);
	console.log(navigator.userAgent);
	return Code.BROWSER_TYPE_UNKNOWN;
	//
	// Opera 8.0+
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	    // Firefox 1.0+
	var isFirefox = typeof InstallTrigger !== 'undefined';
	    // At least Safari 3+: "[object HTMLElementConstructor]"
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	    // Internet Explorer 6-11
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
	    // Edge 20+
	var isEdge = !isIE && !!window.StyleMedia;
	    // Chrome 1+
	var isChrome = !!window.chrome && !!window.chrome.webstore;
	    // Blink engine detection
	var isBlink = (isChrome || isOpera) && !!window.CSS;
}






