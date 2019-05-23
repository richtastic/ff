// Code.js
// isBrowser = false;
// isNode = false;
// (function () {
// 	// var root = this;
// 	if (typeof module !== 'undefined' && module.exports) {
// 		isNode = true;
// 	}
// 	if (typeof window !== 'undefined' && window.navigator) {
// 		isBrowser = true;
// 	}
// })();
// console.log("STATUS: "+isNode+" | "+isBrowser);

// NODEJS INCLUSION
isBrowser = false;
isNode = false;
if (typeof module !== 'undefined' && module.exports) { isNode = true; }
if (typeof window !== 'undefined' && window.navigator) { isBrowser = true; }
if(isNode){
	var Code = require("./Code.js");
}




// OVERRIDES:
Math.PI2 = Math.PI*2.0;
Math.TAU = Math.PI*2.0;
Math.PIO2 = Math.PI*0.5;
Math.lg = Math.log2;
//
if(isBrowser){
Code.IS_IE = navigator && navigator.appName && (navigator.appName).toLowerCase().indexOf("explorer") >= 0; // (document.body.attachEvent && window.ActiveXObject);
Code.IS_OPERA = navigator && navigator.appVersion && (navigator.appVersion).toLowerCase().indexOf("opera") >= 0; // guess
Code.IS_SAFARI = navigator && navigator.appVersion && (navigator.appVersion).toLowerCase().indexOf("safari") >= 0;
Code.IS_FF = navigator && navigator.appVersion && (navigator.appVersion).toLowerCase().indexOf("mozilla") >= 0; // guess
Code.IS_CHROME = navigator && navigator.appVersion && (navigator.appVersion).toLowerCase().indexOf("chrome") >= 0;
}

Code.TYPE_OBJECT = "object";
Code.TYPE_ARRAY = 'array';
Code.TYPE_FUNCTION = "function";
Code.TYPE_NUMBER = "number";
Code.TYPE_STRING = "string";
Code.TYPE_BOOLEAN = "boolean";
Code.TYPE_UNDEFINED = "undefined";

// http://www.quirksmode.org/dom/events/index.html
Code.JS_EVENT_CLICK = "click";
Code.JS_EVENT_RESIZE = "resize";
Code.JS_EVENT_MOUSE_UP = "mouseup";
Code.JS_EVENT_MOUSE_DOWN = "mousedown";
Code.JS_EVENT_MOUSE_MOVE = "mousemove";
Code.JS_EVENT_MOUSE_OUT = "mouseout"; // mouse leave w/o bubbling
Code.JS_EVENT_MOUSE_LEAVE = "mouseleave"; // mouse out w/ bubbling
Code.JS_EVENT_MOUSE_ENTER = "mouseenter";
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

Code.INT_MAX_VALUE = +2147483647; // 2^31 - 1
Code.INT_MIN_VALUE = -2147483648; // 2^31



Code.monthsShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
Code.monthsLong = ["January","February","March","April","May","June","July","August","September","October","November","December"];
Code.daysOfWeekShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // getday(0) == sunday
Code.daysOfWeekLong = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// ------------------------------------------------------------------------------------------
function Code(){
	throw "this is a library";
}
Code.getType = function(obj){
	return (typeof obj);
}
Code.isUndefined = function(obj){
	return obj===undefined;
}
Code.isNaN = function(obj){
	return isNaN(obj);
}
Code.isNull = function(obj){
	return obj === null;
}
Code.isNumber = function(obj){
	return (typeof obj)==Code.TYPE_NUMBER;
}
Code.isString = function(obj){
	return (typeof obj)==Code.TYPE_STRING;
}
Code.isObject = function(obj){
	return (obj && (typeof obj)==Code.TYPE_OBJECT && obj.constructor==Object);
}
Code.isFunction = function(obj){
	return (typeof obj)==Code.TYPE_FUNCTION;
}
Code.isBoolean = function(obj){
	return (typeof obj)==Code.TYPE_BOOLEAN;
}
Code.isArray = function(obj){
	return (obj && (typeof obj)==Code.TYPE_OBJECT && obj.constructor==Array); // instanceofArray
}
Code.isInstance = function(obj){
	return (obj && (typeof obj)==Code.TYPE_OBJECT && obj.constructor!=Object && obj.constructor!=Array);
}
Code.isObjectOrInstance = function(obj){ // not an array
	return (obj && (typeof obj)==Code.TYPE_OBJECT && obj.constructor!=Array);
}
Code.copyToClipboardPrompt = function(str){
	var txt = Code.newInputTextArea(str, 3,10);
	Code.setStyleZIndex(txt,"9999");
	Code.setStylePosition(txt,"absolute");
	Code.setStyleRight(txt,"0");
	document.body.appendChild(txt);
	txt.ondblclick = function(e){ document.body.removeChild(e.target); e.ondblclick=null; }
}

Code.setURLParameter = function(url,key,value){
	var datum = Code.parseURL(url);
	datum["parameters"][key] = value+"";
	return Code.generateURL(datum["protocol"], datum["fulldomain"], datum["path"], datum["parameters"], datum["fragment"]);
}
Code.getURLParameter = function(url,key){
	var datum = Code.parseURL(url);
	return datum["parameters"][key];
}
Code.generateURL = function(protocol, fulldomain, path, parameters, fragment){
	if(path && path.length>0){
		if(path[0]!=="/"){
			path = "/"+path;
		}
	}else{
		path = "/";
	}
	var url = protocol+"://"+fulldomain+""+path+"";
	if(parameters){
		var keys = Code.keys(parameters);
		for(i=0; i<keys.length;++i){
			var key = keys[i];
			var val = parameters[key];
			if(i==0){
				url = url+"?";
			}else{
				url = url+"&";
			}
			if(Code.isArray(val)){
				for(j=0; j<val.length; ++j){
					var v = val[j];
					url = url+key+"[]="+v;
					if(j<val.length-1){
						url = url+"&";
					}
				}
			}else{
				url = url+key+"="+val;
			}
		}
	}
	if(fragment){
		url = url+"#"+fragment;
	}
	return url;
}
Code.parseURL = function(url){ // https://tools.ietf.org/html/rfc3986#section-4.1  |  rfc1808.txt
	//  https://   my.username   @     abc      .   123.www.123.com  :   80    /a/b/location  ?    a=b&b=c&d=c   ;    #    here
	// [protocol]   [userinfo]     [subdomain]            [domain]     [port]      [path]        [query string]      []   [fragment/anchor]
	// SPACE = %20
	// & sepraates
	// ; also separates
	// + =
	// multivalued: field1=a&field2=b&field3=...
	//          OR: field=a,b,...
	//          OR: field[0]=1&field[1]=b&...
	//
	// eg: https://video.google.co.uk/site/home?basic=123&arr[]=0&arr[]=1&arr[]=2;list[0]=a;list[1]=b;list[2]=c&items=first,second,third#end
	//url = "https://video.google.co.uk/site/home?basic=123&arr[]=0&arr[]=1&arr[]=2;list[0]=a;list[1]=b;list[2]=c&items=first,second,third#end";
	// http://localhost/wordpress/wp-admin/admin.php?page=giau-plugin-submenu-data-entry&table=languages
	// file:///var/www/html/index.php
	var datum = {};
	var parameters = [];
	datum["subdomain"] = null; // eg: video
	datum["domain"] = null; // eg: google.co.uk
	//
	var i, len=url.length, lm1 = len-1;
	var ch;
	var skip = [];
	var current = "";
	var protocol = null;
	var fulldomain = null;
	var fullpath = null;
		var hasStartedParameters = false;
		var isExpectingKey = false;
		var isExpectingValue = false;
		var currentKey = null;
		var currentValue = null;
	var hasStartedAnchor = false;
	var anchor = null;
	for(i=0;i<len;++i){
		ch = url[i];
		if(skip.length>0){
			if(skip[0]==ch){
				skip.shift();
			}else{
				console.log("expected: '"+skip[0]+"' , found: '"+ch+"' ")
				return null;
			}
			continue;
		}
		if(!protocol){
			if(ch==":"){
				protocol = current;
				current = "";
				skip = ['/','/'];
			}else{
				current += ch;
			}
		}else if(!fulldomain){
			if(ch=="/"){
				fulldomain = current;
				current = "/";
			}else{
				current += ch;
			}
		}else if(!fullpath){
			if(ch=="?" || ch=="#"){
				fullpath = current;
				current = "";
				--i;
			}else{
				current += ch;
			}
		}else{ // parameters || anchor
			if(hasStartedAnchor){
				current += ch;
			}else{
				if(ch=="?"){ // start params
					if(hasStartedParameters){
						console.log("unexpected '?' ");
						return null;
					}
					current = "";
					hasStartedParameters = true;
					isExpectingKey = true;
					isExpectingValue = false;
				}else if(ch=="="){ // assignment
					if(!isExpectingKey){
						console.log("not expecting key assignment '='");
						return null;
					}
					currentKey = current;
					current = "";
					isExpectingKey = false;
					isExpectingValue = true;
				}else if(ch=="&" || ch==";"){ // next var
					if(!isExpectingValue){
						console.log("not expecting value assignment '&' / ';'");
						return null;
					}
					currentValue = current;
					current = "";
					isExpectingKey = true;
					isExpectingValue = false;
					Code._appendParameter(parameters, currentKey, currentValue);
				}else if(ch=="#"){ // start anchor
					// TODO: CHECK IF IS IN THE MIDDLE OF PARAM ASSIGNMENT
					if(isExpectingValue){ // last value
						currentValue = current;
						current = "";
						Code._appendParameter(parameters, currentKey, currentValue);
					}
					hasStartedAnchor = true;
					current = "";
				}else{
					current += ch;
				}
			}
		}
	}
	if(hasStartedAnchor){ // everything after anchor is client side
		anchor = current;
		current = "";
	}else if(isExpectingValue){ // last value
		currentValue = current;
		current = "";
		Code._appendParameter(parameters, currentKey, currentValue);
	}
	// console.log(protocol);
	// console.log(fulldomain);
	// console.log(fullpath);
	// console.log(parameters);
	// console.log(anchor);
	datum["protocol"] = protocol;
	datum["fulldomain"] = fulldomain;
	datum["path"] = fullpath;
	datum["parameters"] = parameters;
	datum["fragment"] = anchor;
	return datum;
}
Code.fileExtensionFromName = function(filename){
	var regex = /\.(\w+)$/g;
	var ext = filename.match(regex);
	if(ext){
		ext = ext[0];
		return ext.substr(1,ext.length-1);
	}
	return null;
}
Code.appendToPath = function(path){
	if(!path){
		return "";
	}
	var fin = path;
	for(var i=1; i<arguments.length; ++i){
		var next = arguments[i];
		var concat = "";
		if(fin.length>0 && next.length>0){
			var last = fin.substr(fin.length-1,1);
			var first = next.substr(0,1);
			//console.log(i,fin, last,first);
			if(last!="/" && first!="/"){
				concat = "/";
			}
		}
		fin = fin+concat+next;
	}
	return fin;
}
Code.printMatlabArray = function(array,name, ret){
	name = name!==undefined ? name : "x";
	var str = name+" = [";
	for(var i=0; i<array.length; ++i){
		str = str + array[i] + "";
		if(i<array.length-1){
			str = str + ",";
		}
	}
	str = str + "];";
	if(ret){
		return str;
	}
	console.log(str);
}
Code.printHistogram = function(bins, displayMax){
	var displayMax = displayMax!==undefined ? displayMax : 10;
	var str = "";
	var info = Code.infoArray(bins);
	var max = info["max"];

	var scale = displayMax/max;
	for(var i=0; i<bins.length; ++i){
		str += "\n";
		var j = 0;
		var bin = bins[i];
		bin = Math.round(bin*scale);
		str += "[";
		for(j=0; j<bin; ++j){
			str += "*";
		}
		for(; j<displayMax; ++j){
			str += " ";
		}
		str += "] "+i;
	}
	str += "\n";
	console.log(str);
}
Code._appendParameter = function(container, key, value){ //
	//console.log("ASSIGN: "+key+"="+value);
	var regeExArrayPush = new RegExp("\\[\\]$","g");
	var regeExArrayIndex = new RegExp("\\[([0-9]+)\\]$","g"); // non-integer indexes?
	var matchArrayPush = key.match(regeExArrayPush);
	var matchArrayIndex = key.match(regeExArrayIndex);
	// value could be an array
	value = Code.unescapeURI(value);
	var matchValueArray = value.match(",");
	if(false){//if( matchValueArray && matchValueArray.length>0 ){ // value has commas: a,b,c // NOT SUPPORTED
		value = Code.arrayFromStringSeparatedString(value,",");
	}
	if(matchArrayPush && matchArrayPush.length==1 && matchArrayPush[0]!==""){ // varname[] // PREFERRED (PHP)
		var arr = key.replace(regeExArrayPush,"");
		if(!Code.hasKey(container,arr)){
			container[arr] = [];
		}
		container[arr].push(value);
	}else if(matchArrayIndex && matchArrayIndex.length==1 && matchArrayIndex[0]!==""){ // varname[i] // ONLY SEMI SUPPORTED
		var arr = key.replace(matchArrayIndex,"");
		var index = matchArrayIndex[0].replace(new RegExp("(\\[|\\])","g"),"");
			index = parseInt(index);
		if(!Code.hasKey(container,arr)){
			container[arr] = [];
		}
		container[arr][index] = value;
	}else{ // regular
		container[key] = value;
	}
}
Code.parseJSON = function(str){
	var obj = str;
	if(obj===undefined || obj===null || obj===""){
		console.log("UNDEFINED VARIABLE");
		obj = {};
	}else{
		//var obj = JSON.parse(str);
		if(Code.isString(obj)){
			try{
				obj = JSON.parse(obj);
			}catch(e){
				console.log("COULD NOT PARSE: ");
				console.log("\n"+obj);
				obj = null;
			}
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
Code.hasKey = function(object, key){
	if(object){
		return key in object;
	}
	return false;
}
Code.constructorClass = function constructorClass(subClass, self){ // ClassName._.constructor.call(this, paramA); // constructor
	var params = [];
	for(var i=2; i<arguments.length; ++i){
		params.push(arguments[i]);
	}
	subClass._.constructor.apply(self, params); // constructor
}
Code.inheritClass = function inheritClass(SubC, SuperC){
    var subProto = null;
    if(Object && Object.create!==undefined){
    	subProto = Object.create(SuperC.prototype);
    	Code.extendClass(subProto, SubC.prototype);
    	SubC.prototype = subProto;
    	SubC._ = SuperC.prototype;
    }else{ // IE
    	SubC.prototype = new SuperC();
    	SubC._ = SuperC.constructor.prototype;
    }
}
Code.methodClass = function(subClass, self, method){
	var params = [];
	for(var i=3; i<arguments.length; ++i){
		params.push(arguments[i]);
	}
	// this._.kill.call(this);
	var fxn = subClass._[method].apply(self, params);
	//
	// subClass._.constructor.apply(self, params); // constructor
	//
}
Code.isa = function(obj, klass){ // only this?
	return (obj && obj.constructor && obj.constructor==klass);
}
Code.ofa = function(obj, klass){ // inherits?
	if(obj){
		return (obj && obj.constructor && obj.constructor==klass) || Code.ofa(obj.constructor._, klass);
	}
	return false;
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
			}else if(false){ // typeof o == Code.TYPE_OBJECT && o.toString!==null && o.toString!==undefined){
				console.log( o.toString() );
			}else{
				console.log( o );
			}
		}
	}
}

Code.objectHasProperty = function(o,p){
	// p in o
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
/*
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
*/
Code.objectToArray = function(object){
	return Object.values(object);
	// var arr = [];
	// var keys = Code.keys(hash);
	// for(var i=0; i<keys.length; ++i){
	// 	var index = keys[i];
	// 	var value = hash[index];
	// 	arr.push(value);
	// }
	// return arr;
}
Code.forEach = function(object, fxn){
	if(Code.isArray(object)){
		return Code._forEachArray(object,fxn);
	}else{ // isArray
		return Code._forEachHash(object,fxn);
	}
}
Code._forEachArray = function(array, fxn){
	var len = array.length;
	for(var i=0; i<len; ++i){
		var value = array[i];
		var result = fxn(value, i);
		if(result){
			break;
		}
	}
}
Code._forEachHash = function(hash, fxn){
	var keys = Code.keys(hash);
	for(var i=0; i<keys.length; ++i){
		var index = keys[i];
		var value = hash[index];
		var result = fxn(value, index);
		if(result){
			break;
		}
	}
}
Code.hash = function(string){
	if(string==null || string.length==0){ return 0; }
	var i, char, hash = 0;
	for(i=string.length; i--; ){
		char = string.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // >>> 0
	}
	return hash;
}
Code._adjacentCircularArrayIndexes = function(a,l,r){
	if(Math.abs(l-r)==1){
		return true;
	}
	if(l==a.length-1 && r==0){
		return true;
	}
	if(r==a.length-1 && l==0){
		return true;
	}
	return false;
}
Code._middleCircularArrayIndexes = function(a,l,r){
	if(r<l){ // wrap around
		return ((l+r+a.length)*0.5 | 0) % a.length;
	} // else mid
	return (l+r)*0.5 | 0;
}
// to search in CCW orientation: new angle = zeroTo2Pi(2pi - old angle)
Code.binarySearchCircular = function(a, f, log){ // f returns a direction LEFT or RIGHT or EQUAL and a MAGNITUDE for better/worse
	if(a.length==0){
		return null;
	}
	if(a.length==1){
		return [0];
	}
	var temp, mIndex, mValue;
	var aIndex = 0;
	var bIndex = a.length/2 | 0;
	var aValue = f(a[aIndex]);
	var bValue = f(a[bIndex]);
	// endpoint checks
	if(aValue==0){
		return [aIndex];
	}
	if(bValue==0){
		return [bIndex];
	}
	// pick initial interval/direction to search between
	var isOppsite = false;
	if(aValue>0 && bValue>0){ // + +
		if(aValue>=bValue){
			isOppsite = true;
		}
	}else if(aValue<0 && bValue<0){ // - -
		if(aValue>=bValue){
			isOppsite = true;
		}
	}else if(aValue<=0 && bValue>=0){ // - +
		isOppsite = true;
	}


	if(isOppsite){
if(log){
console.log("SEARCH OPPOSITE");
}
		temp = aIndex;
		aIndex = bIndex;
		bIndex = temp;
		temp = aValue;
		aValue = bValue;
		bValue = temp;
	} // else: + - => left
if(log){
console.log("START SEARCH: "+aIndex,bIndex);
}
var i = 100;
while(i>0){
	// console.log(" -------------------------------------------- "+aIndex+": "+aValue+" | "+bIndex+": "+bValue+" / "+a.length, Code._adjacentCircularArrayIndexes(a,aIndex,bIndex));
	if( Code._adjacentCircularArrayIndexes(a,aIndex,bIndex) ){ // adjacent
if(log){
console.log("END ADJACENT: "+aIndex,bIndex);
}
		return [aIndex,bIndex];
	}
	mIndex = Code._middleCircularArrayIndexes(a,aIndex,bIndex);
	mValue = f(a[mIndex]);
if(log){
console.log("  ["+aIndex+": "+aValue+" | "+mIndex+": "+mValue+" | "+bIndex+": "+bValue+" ] ");
}
	// found
	if(mValue==0){ // midpoint check
if(log){
console.log("MID FOUND: "+mIndex);
}
		return [mIndex];
	}

	var isARight = aValue>=0;
	var isMRight = mValue>=0;
	var isBRight = bValue>=0;
	if( aValue==mValue && mValue==bValue){
		throw "UN-HANDLE EQUAL?";
	}
	var direction = 0;
	if( isARight &&  isMRight &&  isBRight){ // + + + 7
if(log){
console.log("  + + + ");
}
		// compare magnitures
		var sma = Math.min(aValue,mValue,bValue);
		var lar = Math.max(aValue,mValue,bValue);
		if(sma==aValue && lar==mValue){
			direction = -1; // => left
		}else if(sma==mValue && lar==bValue){
			direction = 1; // => right
		}else{
			throw "?";
		}
	}else if(!isARight && !isMRight && !isBRight){ // - - - 0
if(log){
console.log("  - - - ");
}
		// compare magnitures
		var sma = Math.max(aValue,mValue,bValue);
		var lar = Math.min(aValue,mValue,bValue);
		if(lar==aValue && sma==mValue){
			direction = -1; // => left
		}else if(lar==mValue && sma==bValue){
			direction = 1; // => right
		}else{
			throw "?";
		}
	}else if(!isARight && !isMRight &&  isBRight){ // - - + 1
if(log){
console.log("  - - + ");
}
		throw "DNE";
	}else if(!isARight &&  isMRight && !isBRight){ // - + - 2
if(log){
console.log("  - + - ");
}
		direction = 1; // => right
	}else if(!isARight &&  isMRight &&  isBRight){ // - + + 3
if(log){
console.log("  - + + ");
}
		throw "DNE";
	}else if( isARight && !isMRight && !isBRight){ // + - - 4
if(log){
console.log("  + - - ");
}
		direction = -1; // => left
	}else if( isARight && !isMRight &&  isBRight){ // + - + 5
if(log){
console.log("  + - + ");
}
		direction = -1; // => left
	}else if( isARight &&  isMRight && !isBRight){ // + + - 6
if(log){
console.log("  + + - ");
}
		direction = 1; // => right
	}else{
		throw "N/A";
	}
	// move
	if(direction==-1){ // left
		bIndex = mIndex;
		bValue = mValue;
if(log){
console.log("    => L");
}
	}else if(direction==1){ // right
		aIndex = mIndex;
		aValue = mValue;
if(log){
console.log("    => R");
}
	}else{
		throw "can't go nowhere";
	}
--i;
}

throw "bad";
}
Code.binarySearch = function(a, f, noEnds){ // assumed increasing | if AT INDEX: return index, if BETWEEN INDEX: return [a,b], if OUTSIDE: return [end]
	if(a.length==0){
		return null;
	}
	var minIndex = 0;
	var maxIndex = a.length-1;
	var value, result, middleIndex;
	while(minIndex<=maxIndex){
		middleIndex = (minIndex+maxIndex) >> 1;
		value = a[middleIndex];
		result = f(value);
		if(result==0){
			return middleIndex;
		}else if(result<0){
			maxIndex = middleIndex - 1;
		}else{ // result>0
			minIndex = middleIndex + 1;
		}
	}
	if(minIndex==a.length){ // return [a.length]
		if(noEnds){
			return null;
		}
		return [a.length-1];
	}
	if(maxIndex==-1){ // return [-1]
		if(noEnds){
			return null;
		}
		return [0];
	}
	return [maxIndex,minIndex];
}
Code.recursiveProperty = function(object, def){
	if(object){
		var value = object;
		var i, len = arguments.length;
		for(i=2; i<len; ++i){
			var index = arguments[i];
			if(value && Code.hasKey(value,index)){
				value = value[index];
			}else{ // not make it to end
				return def;
			}
		}
		return value;
	}
	return def;
}
// ------------------------------------------------------------------------------------------ EXTEND
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
Code.stringReplaceAll = function(haystack,needle,replacement){
	needle = needle.replace(/\./g,"\\.");
	needle = needle.replace(/\[/g,"\\[");
	needle = needle.replace(/\]/g,"\\]");
	needle = needle.replace(/\(/g,"\\(");
	needle = needle.replace(/\)/g,"\\)");
	// others?
	// needle = needle.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	// console.log(needle)
	// NOT WORK WITH \
	var regex = new RegExp(needle,"g");
	return haystack.replace(regex,replacement);
}
// ------------------------------------------------------------------------------------------ ARRAY
Code.commaSeparatedStringFromArray = function(arr){
	var str = "";
	var i, s;
	var len = arr.length;
	var lm1 = len - 1;
	for(i=0; i<len; ++i){
		s = arr[i]+"";
		s = s.replace(/\\/g,"\\\\"); // escape backslashes
		s = s.replace(/,/g,"\\,"); // escape commas
		str += s;
		if(i<lm1){
			str += ",";
		}
	}
	return str;
};
Code.arrayFromCommaSeparatedString = function(str){ // only things that should be escaped are , and \
	if(!str){ return []; }
	var arr = [];
	var index = 0;
	var i, ch;
	var len = str.length;
	var currentTag = "";
	for(i=0; i<=len; ++i){
		ch = null;
		if(i<len){
			ch = str[i];
		}
		if(ch=="\\"){ // escape character
			var chNext = null;
			if(i+1 < len){
				chNext = str[i+1];
			}
			if(chNext){
				currentTag += chNext;
				i += 1;
			}
		}else if(i==len || ch==","){ // split
				if(currentTag.length>0){
					arr.push(currentTag);
					currentTag = "";
				}
		}else{ // normal character
			currentTag += ch;
		}
	}
	return arr;
}
Code.arrayFromStringSeparatedString = function(str, separator){
	if(str && separator){
		return str.split(separator);
	}
	return [];
}
Code.stringFromCommaSeparatedArray = function(arr){
	return Code.commaSeparatedStringFromArray(arr);
}

Code.setArray = function(arr){
	var i, im1, len = arguments.length;
	for(im1=0,i=1;i<len;++i,++im1){
		arr[im1] = arguments[i];
	}
	return arr;
}
Code.arraySet = function(arr, c){
	var i, len = arr.length;
	for(i=0;i<len;++i){
		arr[i] = c;
	}
	return arr;
}
Code.arrayFromHash = function(hash, nonnull){
	nonnull = nonnull!==undefined ? nonnull : true;
	var arr = [];
	var keys = Code.keys(hash);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var value = hash[key];
		if(nonnull || value!==undefined){
			arr.push(value);
		}
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
Code.newArrayArrays = function(len){
	var i, arr = new Array(len);
	for(i=len;i--;){
		arr[i] = [];
	}
	return arr;
}
Code.newArrayNulls = function(len){
	return Code.newArrayConstant(len, null);
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
// Code.appendArray = function(a,b){

Code.arrayMap = function(arr, fxn){
	var i, len = arr.length;
	for(i=0;i<len;++i){
		arr[i] = fxn(arr[i]);
	}
	return arr;
}

Code.arrayPushArray = function(a,b, start,end){
	if(a && b){
		start = start!==undefined ? start : 0;
		end = end!==undefined ? end : b.length-1;
		var i;
		for(i=start;i<=end;++i){
			a.push(b[i]);
		}
	}
	return a;
}
Code.arrayPushArrays = function(a,others){
	var args = arguments;
	for(var i=1; i<args.length; ++i){
		Code.arrayPushArray(a,args[i]);
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
Code.arrayRemoveIndexes = function(a, list){
	list = Code.copyArray(list);
	list.sort(function(a,b){return a<b ? -1 : 1});
	var r = 0;
	for(var j=list.length-1;j>=0;--j){
		a.splice(list[j], 1);
	}
	return a;
}
Code.subArray = function(b, a, start, count){ // b = a[start,...start+count-1]
	if(count==undefined){ // a, start, count
		count = start;
		start = a;
		a = b;
		b = [];
	}
	count = Math.min(a.length-start,count);
	for(var i=0; i<count; ++i){
		b[i] = a[i+start];
	}
	return b;
}
Code.transformArray = function(a,f){
	for(var i=a.length; i--; ){
		a[i] = f(a[i]);
	}
	return a;
}
Code.filterArray = function(a, f, args){
	filtered = [];
	for(var i=0; i<a.length; ++i){
		if(f(a[i],args)){
			filtered.push(a[i]);
		}
	}
	return filtered;
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
	//end = Math.min(b.length-1,end);
	//if(b===undefined){ b=a; a=new Array(); }
	Code.emptyArray(a);
	end = Math.min(b.length-1, end);
	for(var j=0,i=start; i<=end; ++i,++j){
		a[j] = b[i];
	}
	return a;
};
Code.copyArrayIndexes = function(a,b, indexes){
	if(indexes===undefined){
		indexes = b; b = a; a = new Array();
	}
	var i, len=indexes.length;
	for(i=0; i<len; ++i){
		a.push( b[indexes[i]]);
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
};
Code.emptyArray = function(a){
	while(a.length>0){ a.pop(); }
};
Code.truncateArray = function(a,length){
	if(a.length>length){
		a.splice(length,a.length-length);
	}
	return a;
};
Code.preTruncateArray = function(a,length){
	if(a.length>length){
		a.splice(0,a.length-length);
	}
	return a;
};
Code.getScaledArray = function(array, scale, fxn){ // ENDS MATCH UP
	var a = [];
	var inLength = array.length;
	var lm1 = inLength-1;
	var length = Math.round(inLength*scale);
	var s = (length-1)/(inLength-1);
	// console.log("S: "+s)
	if(fxn){ // perform merging op
		for(var i=0; i<length; ++i){
			var p = i/s;
			var A = Math.floor(p);
			var B = Math.ceil(p);
			p = p - A;
			// var q = 1.0-p;
			A = Math.min(A,lm1);
			B = Math.min(B,lm1);
			var val = fxn(array[A],array[B],p);
			a[i] = val;
		}
	}else{
		for(var i=0; i<length; ++i){
			var p = i/s;
			// console.log(p);
			var A = Math.floor(p);
			var B = Math.ceil(p);
			p = p - A;
			var q = 1.0-p;
			A = Math.min(A,lm1);
			B = Math.min(B,lm1);
			// console.log(p,A,B);
			a[i] = array[A]*q + array[B]*p; // TODO: POSSIBLY OPTION TO INTERPOLATE BETWEEN POINTS USING POLYNOMIAL
		}
	}
	return a;
}
Code.getElements = function(element, fxn, stop, arr){
	return Code.getElementsWithFunction(element, fxn, stop, arr);
};
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
};
// Code.arrayIntersect = function(c,a,b, equalFxn, combineFxn){ // c = a && b
// 	if(b===undefined){
// 		b = a;
// 		a = c;
// 		c = [];
// 	}
// 	var i;
// 	for(i=0; i<a.length; ++i){
// 		if(Code.elementExists(b, a[i])){
// 			c.push(a[i]);
// 		}
// 	}
// 	return c;
// };
Code.arrayPushNotEqual = function(a,o,v){
	if(o!==v){
		a.push(o);
	}
	return a;
}
Code.arrayPushNotNull = function(a,o){
	Code.arrayPushNotEqual(a,o,null);
}
Code.arrayUnion = function(c,a,b){ // c = a || b
	if(b===undefined){
		b = a;
		a = c;
		c = [];
	}
	Code.arrayPushArray(c,a);
	var i;
	for(i=0; i<b.length; ++i){
		Code.addUnique(c, b[i]);
	}
	return c;
};
Code.arrayIntersect = function(c,a,b, equalFxn, combineFxn){
	if(b===undefined){
		b = a;
		a = c;
		c = [];
	}
	if(c==a || c==b){
		throw "need independent array";
	}
	for(var i=0; i<a.length; ++i){
		var found = false;
		var itemA = a[i];
		for(j=0; j<b.length; ++j){
			var itemB = b[j];
			var equal = false;
			if(equalFxn){
				equal = equalFxn(itemA,itemB);
			}else{
				equal = itemA==itemB;
			}
			if(equal){
				found = true;
				break;
			}
		}
		if(found){
			if(combineFxn){
				itemA = combineFxn(itemA,itemB);
			}
			c.push(itemA);
		}
	}
	return c;
};
Code.elementExists = function(a,o){ // O(n)   --- this wont work for an array of functions ....
	if( Code.isFunction(o) ){ // function
		for(var i=0; i<a.length; ++i){
			if( o(a) ){ return true; }
		}
	}else{ // object
		for(var i=0; i<a.length; ++i){
			if(a[i]==o){ return true; }
		}
	}
	return false;
}
Code.removeDuplicates = function(arrayA,arrayB){
	var i,j,a,b;
	if(arrayB){ // remove items in B from A
		for(i=0; i<arrayA.length; ++i){
			a = arrayA[i];
			for(j=0; j<arrayB.length; ++j){
				b = arrayB[j];
				if(a==b){
					arrayA.splice(i,1);
					--i;
					break;
				}
			}
		}
	}else{
		for(i=0; i<arrayA.length; ++i){
			a = arrayA[i];
			for(j=i+1; j<arrayA.length; ++j){
				b = arrayA[j];
				if(a==b){
					arrayA[j] = arrayA[arrayA.length-1];
					arrayA.pop();
					--j;
				}
			}
		}
	}
	return arrayA;
}
Code.indexOfElement = function(a,o){ // O(n)
	if( Code.isFunction(o) ){ // function
		for(var i=0; i<a.length; ++i){
			if( o(a[i]) ){ return i; }
		}
	} else {
		for(var i=0; i<a.length; ++i){
			if(a[i]==o){ return i; }
		}
	}
	return null;
}
Code.addUnique = function(a,o){ // O(n)
	if( !Code.elementExists(a,o) ){ a.push(o); return true; }
	return false;
}
Code.removeElements = function(a,f){ // preserves order O(n)
	var removed = [];
	for(var i=0; i<a.length; ++i){
		if(f(a[i])){
			removed.push(a[i]);
			a.splice(i,1);
			--i;
		}
	}
	return removed;
}
Code.printPoints = function(points){
	var i, point, str = "";
	for(i=0; i<points.length; ++i){
		point = points[i];
		if(point.v!==undefined){
			str = str + "var pt = new V4D("+point.x+","+point.y+","+point.z+","+point.t+"); pt.u = "+point.u+"; pt.v = "+point.v+"; points.push( pt ); // " + i + "\n";
		}else if(point.t!==undefined){
			str = str + "points.push( new V4D("+point.x+","+point.y+","+point.z+","+point.t+") ); // " + i + "\n";
		}else if(point.z!==undefined){
			str = str + "points.push( new V3D("+point.x+","+point.y+","+point.z+") ); // " + i + "\n";
		}else{
			str = str + "points.push( new V2D("+point.x+","+point.y+") ); // " + i + "\n";
		}
	}
	console.log("\n\n"+str+"\n\n");
}
Code.removeElement = function(a,o){  // preserves order O(n)
	var i, len = a.length;
	for(i=0;i<len;++i){
		if(a[i]==o){
			a.splice(i,1);
			return o;
		}
	}
	return null;
}
Code.removeElementAt = function(a,i){ // preserve order
	return a.splice(i,1);
	// var len = a.length;
	// while(i<len){
	// 	a[i] = a[i+1];
	// 	++i;
	// }
	// a.pop();
	// return;
}
Code.removeElementsAt = function(a,list){
	list.sort(function(a,b){return a<b ? -1 : 1});
	var prev = -1;
	var off = 0;
	for(var i=0; i<list.length; ++i){
		var next = list[i];
		if(prev!=next){
			Code.removeElementAt(a,next-off);
			prev = next;
			++off;
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
Code.removeElementAtSimple = function(a,i){ // not preserve order
	return a.splice(i,1);
	// a[i] = a[a.length-1];
	// a.pop();
	// return;
}
Code.subSampleArray = function(a,count){
	var i, index, len = a.length - count;
	for(i=0;i<len;++i){
		index = Math.floor(Math.random()*a.length);
		a[index] = a.pop();
	}
	return a;
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
Code.reverseArray = function(array){
	var i, len = array.length;
	var lm1 = len - 1;
	var a = new Array(len);
	for(i=0; i<len; ++i){
		a[i] = array[lm1-i];
	}
	return a;
}
Code.arrayRandomItemPop = function(array){
	if(array.length==0){ return null; }
	var index = Math.floor(Math.random()*array.length);
	var value = array.splice(index,1);
	return value;
}
Code.arrayRandomItem = function(array){
	if(array.length==0){ return null; }
	var index = Math.floor(Math.random()*array.length);
	return array[index];
}
Code.normalizeArray = function(array){ // L2 length
	var length = 0;
	var value, i, len = array.length;
	for(i=0; i<len; ++i){
		value = array[i];
		length += value*value;
	}
	if(length>0){
		for(i=0; i<len; ++i){
			array[i] = array[i]/length;
		}
	}
	return array;
}
Code.sortFrequency = function(array){
	if(array.length==0){
		return null;
	}
	var sorted = Code.copyArray(array).sort(function(a,b){ return a<b ? -1 : 1; });
	var items = [];
	var value = sorted[0];
	var item = {"value":value,"count":1};
	items.push(item);
	for(var i=1; i<sorted.length; ++i){
		var v = sorted[i];
		if(v!=value){
			value = v;
			item = {"value":value,"count":1};
			items.push(item);
		}else{
			item["count"]++;
		}
	}
	var items = items.sort(function(a,b){ return a["count"]>b["count"] ? -1 : 1; });
	return items;
}
Code.sad = function(a,b){
	var sad = 0;
	var i, len = Math.min(a.length,b.length);
	for(i=0; i<len; ++i){
		sad += Math.abs(a[i]-b[i]);
	}
	return sad;
}
Code.ssd = function(a,b){
	var sad = 0;
	var i, len = Math.min(a.length,b.length);
	for(i=0; i<len; ++i){
		sad += Math.pow(a[i]-b[i],2);
	}
	return sad;
}
Code.cc = function(a,b){
	var cc = 0;
	var i, len = Math.min(a.length,b.length);
	for(i=0; i<len; ++i){
		cc += a[i]*b[i];
	}
	return c;
}
Code.sad_cc = function(a,b){ // smaller is better
	var sad = 0;
	var cc = 0;
	var i, len = Math.min(a.length,b.length);
	for(i=0; i<len; ++i){
		cc += a[i]*b[i];
		sad += Math.abs(a[i]-b[i]);
	}
	if(sad==0){
		sad = 1E-6;
	}
	// sad
	// -cc
	return -cc/sad;
	//return -cc*sad;
}
Code.clipArray = function(array, min,max){
	min = min!==undefined ? min : 0.0;
	max = max!==undefined ? max : 1.0;
	var i, len = array.length;
	for(i=0; i<len; ++i){
		array[i] = Math.min(Math.max(min,array[i]),max);
	}
	return array;
}
// Code.arrayToZeroOne = function(a){
// 	var i, len = a.length;
// 	for(i=0;i<len;++i){
// 		if(a[i]!==0.0){
// 			return true;
// 		}
// 	}
// 	return false;
// }
// ImageMat.normalFloat01
Code.nonZero = function(a){
	var i, len = a.length;
	for(i=0;i<len;++i){
		if(a[i]!==0.0){
			return true;
		}
	}
	return false;
}
Code.toMonotonicIncreasing = function(array){
	var next = [];
	var i, len = array.length;
	if(len==0){
		return next;
	}
	next[0] = array[0];
	for(i=1; i<len; ++i){
		next[i] = Math.max(next[i-1],array[i]);
	}
	return next;
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
Code.array1Das2DtoString = function(arr, wid,hei, exp, min){
	exp = exp===undefined?4:exp;
	var minLen = min!==undefined ? min : exp+6+1; // -#.E+#
	var i, j, val, index=0, str = "";
	str += "\n";
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i,++index){
			//str += arr[index]+" ";
			num = arr[index];
			if(num!==undefined && num!==null){
				//val = num.toExponential(exp);
				val = num+""
				if(num<0){
					str += Code.padStringLeft(val,minLen," ");
				}else{
					str += " "+Code.padStringLeft(val,minLen-1," ");
				}
			}else{
				str += Code.padStringLeft("x",minLen," ");
			}
		}
		str += "\n";
	}
	return str;
}
Code.max2DArray = function(array2D){
	return Code.info2DArray["max"];
}
Code.min2DArray = function(array2D){
	return Code.info2DArray["min"];
}
Code.minIndex = function(array){
	if(array.length==0){
		return null;
	}
	var minIndex = array.length-1;
	var minValue = array[minIndex];
	for(var i=minIndex; i--; ){
		var v = array[i];
		if(v<minValue){
			minValue = v;
			minIndex = i;
		}
	}
	return minIndex
}
Code.info2DArray = function(array2D){
	var element, arr, i, j, lenJ, lenI = array2D.length;
	var min = array2D[0][0];
	var max = min;
	for(i=0; i<lenI; ++i){
		arr = array2D[i];
		lenJ = arr.length;
		for(j=0; j<lenJ; ++j){
			element = array2D[i][j];
			min = Math.min(min, element);
			max = Math.max(max, element);
		}
	}
	var range = max - min;
	return {"max":max, "min":min, "range":range};
}
Code.infoArray = function(array, masking){
	var element, arr, i, len = array.length;
	var min = null;
	var max = null;
	var minIndex = -1;
	var maxIndex = minIndex;
	var total = 0;
	var count = 0;
	var mask = 1.0;
	for(i=0; i<len; ++i){
		if(masking){ mask = masking[i]; }
		if(mask!==0.0){
			element = array[i];
			if(element!==null && element!==undefined){
				++count;
				total += element;
				if(min==null || element<min){
					min = element;
					minIndex = i;
				}
				if(max==null || element>max){
					max = element;
					maxIndex = i;
				}
			}
		}
	}
	var avg = 0;
	if(count>0){
		avg = total / count;
	}
	if(max!==null && min!==null){
		var range = max - min;
	}
	// if(max==undefined){
	// 	console.log(array)
	// }
	return {"max":max, "min":min, "range":range, "mean":avg, "total":total, "indexMax":maxIndex, "indexMin":minIndex, "count":count};
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
	for(var i=arr.length; i--;){
		arr.x /= width;
		arr.y /= height;
	}
}

Code.sum = function(a){
	var i, sum=0;
	for(i=a.length; i--;){
		sum += a[i];
	}
	return sum;
}
// Code.combineErrorMeasurements([4,1,2,3],[0.1,0.3,0.2,0.1])
Code.errorsToPercents = function(errors){ // literally just normalized, but with final error approx
	var percents = [];
	var N = errors.length;
	var eps = 1E-10;
	var estimateBot = 0;
	var percentsTotal = 0;
	for(i=0; i<N; ++i){
		var errI = errors[i];
		if(errI<eps){
			errI = eps;
		}
		errI = 1.0/errI;
		estimateBot += errI;
		percents[i] = errI;
		percentsTotal += errI;
	}
	for(i=0; i<N; ++i){
		percents[i] = percents[i]/percentsTotal;
	}
	var error = 1.0/estimateBot;
	return {"percents":percents, "errors":errors, "error":error};
}

Code.combineErrorMeasurements = function(estimates,errors){
	var i;
	var N = estimates.length;
	var sumEstimates = Code.sum(estimates);
	var sumErrors = Code.sum(estimates);
	var probErrors = [];
	var eps = 1E-10;
	var percents = [];
	var estimateTop = 0;
	var estimateBot = 0;
	for(i=0; i<N; ++i){
		var errI = errors[i];
		if(errI<eps){
			errI = eps;
		}
		estimateTop += estimates[i]/errI;
		errI = 1.0/errI;
		estimateBot += errI;
		percents[i] = errI;
		//estimate += Math.pow(probErrors[i]*estimates[i], 2);
	}
	var estimate = estimateTop/estimateBot;
	//combined = Math.sqrt(combined);
	var error = 1.0/estimateBot;
	return {"value":estimate, "error":error, "percents":percents};
}
Code.combineErrorMeasurementsV3D = function(points,errors){
	var x = [];
	var y = [];
	var z = [];
	for(var i=0; i<points.length; ++i){
		var p = points[i];
		x.push(p.x);
		y.push(p.y);
		z.push(p.z);
	}
	x = Code.combineErrorMeasurements(x,errors);
	y = Code.combineErrorMeasurements(y,errors);
	z = Code.combineErrorMeasurements(z,errors);
	var estimate = new V3D();
	estimate.x = x["value"];
	estimate.y = y["value"];
	estimate.z = z["value"];
	var error = new V3D();
	error.x = x["error"];
	error.y = y["error"];
	error.z = z["error"];
	// var percents = [];
	return {"value":estimate, "error":error};
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
Code.max = Code.maxArray = function(a){
	var max = a[0];
	for(var i=a.length; i--; ){
		max = Math.max(max,a[i]);
	}
	return max;
}
Code.min = Code.minArray = function(a){
	var min = a[0];
	for(var i=a.length; i--; ){
		min = Math.min(min,a[i]);
	}
	return min;
}
Code.minIndex = function(a){
	var min = a[0];
	var index = 0;
	for(var i=a.length; i--; ){
		if(min>a[i]){
			index = i;
			min = a[i];
		}
	}
	return index;
}
Code.maxIndex = function(a){
	var max = a[0];
	var index = 0;
	for(var i=a.length; i--; ){
		if(max<a[i]){
			index = i;
			max = a[i];
		}
	}
	return index;
}
Code.sumArray = function(a){
	var sum = 0;
	for(var i=a.length; i--; ){
		sum += a[i];
	}
	return sum;
}
Code.gradientDescent = function(fxn, args, x, dx, iter, diff, epsilon){
	var i, j, k, c;
	var sizeX = x.length;
	// var epsilon = 1E-6;
	epsilon = epsilon!==undefined ? epsilon : 1E-6;
	var cost = fxn(args, x, false, -1); // current cost
	var currCost, nextCost;
	var maxIterations = iter!=null ? iter : 50;
	var minDifference = diff!=null ? diff : 1E-10;
	var lambda = 1.0/epsilon; // start at on par with 1.0
	var scaler = 2.0; // smaller is more accurate, larger is quicker initially
	var nextX = Code.newArrayZeros(sizeX);
	var prevX = Code.copyArray(x); // local instance of x
	var dy = Code.newArrayZeros(sizeX);
	var tx = Code.newArrayZeros(sizeX);
	// TODO: individual epsilon for each variable
	if(!dx){
		dx = Code.newArrayZeros(sizeX);
		for(i=0; i<sizeX; ++i){
			dx[i] = epsilon;
		}
	}
	for(k=0; k<maxIterations; ++k){
		for(i=0; i<sizeX; ++i){
			Code.copyArray(tx,prevX);
			tx[i] += dx[i];
			c = fxn(args, tx, false, i);
			dy[i] = c - cost;
			// if(Code.isNaN(dy[0])){
			// 	console.log(tx);
			// 	console.log(c);
			// 	console.log(cost);
			// 	throw "dy is NaN";
			// }
			tx[i] = 0;
		}
		// initial best guess:
		for(i=0; i<sizeX; ++i){
			nextX[i] = prevX[i] - lambda*dy[i];
		}
		var newCost = fxn(args, nextX, false, -1);
		// scale down lambda as necessary:
		var iter = 10;
		while(newCost>=cost && iter>0){
			lambda /= scaler;
			for(i=0; i<sizeX; ++i){
				nextX[i] = prevX[i] - lambda*dy[i];
			}
			newCost = fxn(args, nextX, false, -1);
			--iter;
		}
		// should be good by now, following gradient
		var diffCost = Math.abs(newCost-cost);
		if(newCost<cost){
			cost = newCost;
			var temp = prevX;
			prevX = nextX;
			nextX = temp;
			fxn(args,prevX, true, -1);
			lambda *= scaler;
		}else{ // should not happen much
			lambda /= scaler;
		}
		if(diffCost<minDifference){
			break;
		}
	}
	if(k==maxIterations){
		// console.log("iteration quit");
	}
	Code.copyArray(x,prevX);
	return {"x":x,"cost":cost};
}
// https://www.topcoder.com/community/data-science/data-science-tutorials/assignment-problem-and-hungarian-algorithm/
Code.minimizedAssignmentProblem = function(costMatrix){ // hungarian solution to assignment problem O(n^3) : list of edges
	var WEIGHT_INFINITY = 1E10;
	var EPSILON = 0;
	var N = costMatrix.length; // assuming square matrix representing bipartite  workers (X) : jobs (Y) costs -- find minimal cost
	var labelsX = Code.newArrayZeros(N); // X & Y labels
	var labelsY = Code.newArrayZeros(N);
	var slack = Code.newArrayZeros(N); // deltas between weight changes between augmented array
	var slackX = Code.newArrayZeros(N); // label(slackX[y]) + label(y) - w(slackX[y],y) = slack[y]
	var xy = Code.newArrayZeros(N); // vertex matched with i [Xi]
	var yx = Code.newArrayZeros(N); // vertex matched with j [Yi]
	var S = Code.newArrayZeros(N); //
	var T = Code.newArrayZeros(N); //
	var prev = Code.newArrayZeros(N); //
	var i, j, n, maxMatch;

	var hungarian = function(){
		maxMatch = 0;
		Code.setArrayConstant(xy,-1);
		Code.setArrayConstant(yx,-1);
		// labelsX & labelsY already zeroed out initialty
		for(i=0; i<N; ++i){
			for(j=0; j<N; ++j){
				labelsX[i] = Math.max(labelsX[i],costMatrix[i][j]);
			}
		}
		// while an augmenting path exists:
		augment();
		// internal cost
		totalCost = 0;
		var solution = {};
		var edgeList = [];
		for(i=0; i<N; ++i){
			j = xy[i];
			edgeList.push([i,j]);
			totalCost += costMatrix[i][xy[i]];
		}
		solution["cost"] = totalCost;
		solution["edges"] = edgeList;
		return solution;
	}
	var augment = function(){ // find & fllip an alternating path
		if(maxMatch==N){ // found match
			return;
		}
		var i, j, root;
		var q = Code.newArrayZeros(N); // queue
		var rd = 0, wr = 0; // read / write flags
		Code.setArrayConstant(S, false); //
		Code.setArrayConstant(T, false); //
		Code.setArrayConstant(prev, -1);
		for(i=0; i<N; ++i){ // find root of tree
			if(xy[i] == -1){
				root = i;
				q[wr++] = root;
				prev[i] = -2;
				S[i] = true;
				break;
			}
		}
		for(j=0; j<N; ++j){ // init delta array:
			slack[j] = labelsX[root] + labelsY[j] - costMatrix[root][j];
			slackX[j] = root;
		}
		//
var loopLimit = 0;
		while(true){ // improve labels
loopLimit++;
if(loopLimit%1000==0){
	console.log("LOOPED: "+loopLimit);
	}
if(loopLimit>100000){
	console.log("REACHED LOOP LIMIT: "+loopLimit);
break;
}
			while(rd < wr){ // breadth first search
				i = q[rd++];
				for(j=0; j<N; ++j){ // for all edges in equality graph
					if(costMatrix[i][j] == labelsX[i] + labelsY[j] && !T[j]){
						if(yx[j]==-1){ // exposed vertex
							break; // augmenting path exists
						}
						T[j] = true;
						q[wr++] = yx[j]; // add vertex to queue
						addToTree(yx[j], i);
					}
				}
				if(j<N){
					break;
				}
			}
			if(j<N){
				break;
			}
			// no augmenting path
			updateLabels();
			rd = 0;
			wr = 0;
			for(j=0; j<N; ++j){ // aff edge slackX[j]->y iff :
				if(!T[j] && slack[j]==0){
					if(yx[j]==-1){ // exposed vertex = augmenting path
						i = slackX[j];
						break;
					}else{
						T[j] = true;
					}
					if(!S[yx[j]]){
						q[wr++] = yx[j]; // add vertex to queue
						addToTree(yx[j], slackX[j]);
					}
				}
			}
			if(j<N){ // augmenting path
				break;
			}
		}
		if(j<N){ // augmenting path
			++maxMatch;
			for(var cx=i, cy=j, ty; cx!=-2; cx = prev[cx], cy=ty){ // inverse edges along augmenting path
				ty = xy[cx];
				yx[cy] = cx;
				xy[cx] = cy;
			}
			augment(); // back to step 1
		}
	}
	var addToTree = function(i, prevX){ // add new edges to alternating tree, i = current vertex, prevX = vertex before i in alternating path
		// add edges prevX->xy[i] && sy[x]->x
		S[i] = true; // i now in S
		prev[i] = prevX;
		for(j=0; j<N; ++j){
			if(labelsX[i] + labelsY[j] - costMatrix[i][j] < slack[j] - EPSILON){
				slack[j] = labelsX[i] + labelsY[j] - costMatrix[i][j];
				slackX[j] = i;
			}
		}
	}
	var updateLabels = function(){ //  improve labels
		var i, j, delta = WEIGHT_INFINITY;
		for(j=0; j<N; ++j){
			if(!T[j]){
				delta = Math.min(delta, slack[j]);
			}
		}
		for(i=0; i<N; ++i){
			if(S[i]){
				labelsX[i] -= delta;
			}
		}
		for(j=0; j<N; ++j){
			if(T[j]){
				labelsY[j] += delta;
			}else{
				slack[j] -= delta;
			}
		}
	}
	return hungarian();
}
// ------------------------------------------------------------------------------------------ TIME
Code.scientificNotation = function(number, count){ // significant digits exponent
	return number.toExponential(count);
}
Code.getTimeDivisionsFromMilliseconds = function(value){
	if(value===undefined){ value = 0;}
	var years = Math.floor(value/(1000*60*60*24*365));
		value -= years*1000*60*60*24*365;
	var days = Math.floor(value/(1000*60*60*24));
		value -= days*1000*60*60*24;
	var hours = Math.floor(value/(1000*60*60));
		value -= hours*1000*60*60;
	var minutes = Math.floor(value/(1000*60));
		value -= minutes*1000*60;
	var seconds = Math.floor(value/(1000));
		value -= seconds*1000;
	var millis = value;
	return {"years":years, "days":days, "hours":hours, "minutes":minutes, "seconds":seconds, "milliseconds":millis};
}

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
	utc = utc!==undefined ? utc : true;
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
	milliseconds = milliseconds!==undefined ? milliseconds : Code.getTimeMilliseconds();
	var d = new Date(milliseconds);
//	console.log(d+" == DATE");
	return Code.getTimeStamp(d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}
Code.stringRemovePrefix = function(str,prefix){
	if(!str){ return ""; }
	var regex = new RegExp("^("+prefix+")*", "gi");
	return str.replace(regex,"");
}
Code.stringFilterNumbersOnly = function(str){ // [0-9]+[.[0-9]+][(E|e)[+.-][0-9]+]  -- possibly allow scientific notation
	if(!str){ return ""; }
	return str.replace(/[^0-9]/g,""); // remove non-digits
}

Code.getTimeStampZulu = function(){
	var str = "";
    var d = Code.getTimeMilliseconds(true);
	d = new Date(d);
	var year = d.getFullYear();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var hour = d.getHours();
	var min = d.getMinutes();
	var sec = d.getSeconds();
    str = ""+Code.prependFixed(""+year,"0",4)
	+"-"+Code.prependFixed(""+month,"0",2)
	+"-"+Code.prependFixed(""+day,"0",2)
	+"T"+Code.prependFixed(""+hour,"0",2)
	+":"+Code.prependFixed(""+min,"0",2)
	+":"+Code.prependFixed(""+sec,"0",2);
	return str;
}

Code.getTimeStamp = function(year, month, day, hour, min, sec, ms){
	var str = "";
    if(arguments.length<=1){ // 0 or 1 args
    	var d;
    	if(year===undefined){ // use NOW
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
Code.getDuration = function(years,days, hours,minutes,seconds, milliseconds){ // ms
	var y = years*365*24*60*60*1000;
	var d = days*24*60*60*1000;
	var h = hours*60*60*1000;
	var m = minutes*60*1000;
	var s = seconds*1000;
	var u = milliseconds;
	return y + d + h + m + s + u;
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
Code.numbersToWindownNormalPercents = function(distances){
	if(distances.length==0){
		return null;
	}
	if(distances.length==1){
		return [1];
	}
	var min = Code.min(distances);
	var sigma = Code.stdDev(distances,min);
	var values = [];
	var den = 2*sigma*sigma; // prefix = 1 /( sig*Math.sqrt(2*Math.pi) )
	for(var i=0; i<distances.length; ++i){
		var x = distances[i] - min;
		var v = Math.exp(-x*x/den);
		values.push(v);
	}
	return Code.countsToPercents(values);
}
Code.countsToPercents = function(values){
	var total = 0;
	for(var i=0; i<values.length; ++i){
		total += values[i];
	}
	if(total<=0){
		return null;
	}
	var percents = [];
	for(var i=0; i<values.length; ++i){
		percents[i] = values[i]/total;
	}
	return percents;
}
Code.averageNumbers = function(values, percents){
	var i, count = values.length;
	var sum = 0;
	var p = 1.0/count;
	for(i=0; i<count; ++i){
		var value = values[i];
		if(percents){
			p = percents[i];
		}
		sum += value*p;
	}
	return sum;
}
Code.avg = Code.averageNumbers;
Code.averageV2D = function(values, percents){
	var i, count = values.length;
	var sum = new V2D(0,0);
	var p = 1.0/count;
	for(i=0; i<count; ++i){
		var value = values[i];
		if(percents){
			p = percents[i];
		}
		sum.x += value.x*p;
		sum.y += value.y*p;
	}
	return sum;
}
Code.averageV3D = function(values, percents){
	var i, count = values.length;
	var sum = new V3D(0,0,0);
	var p = 1.0/count;
	for(i=0; i<count; ++i){
		var value = values[i];
		if(percents){
			p = percents[i];
		}
		sum.x += value.x*p;
		sum.y += value.y*p;
		sum.z += value.z*p;
	}
	return sum;
}
Code.averageAngleVector2D = function(vectors, percents){ // vectors assumed nonzero
	if(!vectors){
		return null;
	}
	var count = vectors.length;
	if(count==0){
		return null;
	}
	var percent = 1.0/count;
	if(percents){
		percent = percents[0];
	}
	var total = vectors[0].copy();
	var sumPercent = percent;
	total.norm();
	for(var i=1; i<vectors.length; ++i){
		var vector = vectors[i];
		if(percents){
			percent = percents[i];
		}
		var angle = V2D.angleDirection(total,vector);
		sumPercent += percent;
		var weight = (percent/sumPercent);
		angle *= weight;
		total.rotate(angle);
		total.norm(); // numerical error keep at 1.0
	}
	return total;
}




Code.twistAdd = function(a,b){
	var direction = a["direction"].copy();
	var addition = b["direction"];
	var cross = V3D.cross(V3D.DIRZ,addition);
	var angle = V3D.angle(V3D.DIRZ,addition);
		console.log("   "+cross+" @ "+Code.degrees(angle));
	if(cross.length()>0){
		cross.norm();
		V3D.rotateAngle(direction,direction,cross,angle);
	}
	// var sumDir = Code.addAngleVector3D(valueA["direction"],valueB["direction"]);
	var angle = Code.angleZeroTwoPi(a["angle"]+b["angle"]);
	var sum = {"direction":direction, "angle":angle};
	return sum;
}
Code.twistInverse = function(value){
	var direction = value["direction"].copy();
	var cross = V3D.cross(V3D.DIRZ,direction);
	var angle = V3D.angle(V3D.DIRZ,direction);
	if(cross.length()>0){
		cross.norm();
		V3D.rotateAngle(direction,direction,cross,-2*angle);
	}
	// var diffDir = Code.subAngleVector3D(V3D.DIRZ,value["direction"]);
	return {"direction":direction, "angle":-value["angle"]};
}
Code.twistRelative = function(a,b){
	var aDir = a["direction"];
	var bDir = b["direction"];
	var aAng = a["angle"];
	var bAng = b["angle"];
	var crossAB = V3D.cross(aDir,bDir);
		crossAB.norm();
	var angleAB = V3D.angle(aDir,bDir);
		console.log("   "+crossAB+" @ "+Code.degrees(angleAB));
	var dir = new V3D(0,0,1);
		dir = V3D.rotateAngle(dir,crossAB,angleAB);
	var ang = Code.angleZeroTwoPi(bAng-aAng);
console.log(V3D.DIRZ+"")
		console.log("   "+V3D.cross(V3D.DIRZ,dir)+" @ "+Code.degrees(V3D.angle(V3D.DIRZ,dir)));
	// {"normal":dir, "twist":angleAB, "angle":ang};
	throw "yup";
	return {"direction":dir, "angle":ang};
}


Code.twistIdentity = function(){
	return {"direction":new V3D(0,0,1), "angle":0};
}
Code.twistCopy = function(twist){
	return {"direction":twist["direction"].copy(), "angle":twist["angle"]};
}
Code.twistInvert = function(value){
	throw "...";
	var diffDir = Code._opAngleVector3D(V3D.DIRZ,value["direction"] -2);
	return {"direction":diffDir, "angle":-value["angle"]};
}

Code.addTwistVector3D = function(valueA,valueB){
	var sumDir = Code.addAngleVector3D(valueA["direction"],valueB["direction"]);
	var sumAng = Code.angleZeroTwoPi(valueA["angle"]+valueB["angle"]);
	var sum = {"direction":sumDir, "angle":sumAng};
	return sum;
}
Code.diffTwistVector3D = function(valueA,valueB){
	var diffDir = Code.subAngleVector3D(valueA["direction"],valueB["direction"]);
	var diffAng = -V2D.angleDirection(new V2D(1,0).rotate(valueA["angle"]),new V2D(1,0).rotate(valueB["angle"]));
	var diff = {"direction":diffDir, "angle":diffAng};
	return diff;
}
Code.addAngleVector3D = function(vectorA, vectorB){
	return Code._opAngleVector3D(vectorA, vectorB, 1);
}
Code.subAngleVector3D = function(vectorA, vectorB){
	return Code._opAngleVector3D(vectorA, vectorB, -1);
}
Code._opAngleVector3D = function(vectorA, vectorB, mag){ // assume Z = default location
	var vectorC = vectorA.copy();
	var crossB = V3D.cross(V3D.DIRZ,vectorB);
	var angleB = V3D.angle(V3D.DIRZ,vectorB);
	if(crossB.length()>0){
		crossB.norm();
		V3D.rotateAngle(vectorC,vectorC,crossB,angleB*mag);
	}
	return vectorC;
}
Code.averageAngleVector3D = function(vectors, percents){ // center of vectors via rotation on sphere [ignores twist]
	if(!vectors){
		return null;
	}
	var count = vectors.length;
	if(count==0){
		return null;
	}
	var percent = 1.0/count;
	if(percents){
		percent = percents[0];
	}
	var total = vectors[0].copy();
	var sumPercent = percent;
	total.norm();
	var cross = new V3D();
	for(var i=1; i<vectors.length; ++i){
		var vector = vectors[i];
		if(percents){
			percent = percents[i];
		}
		V3D.cross(cross, total,vector);
		cross.norm();
		var angle = V3D.angle(total,vector);
		sumPercent += percent;
		var weight = (percent/sumPercent);
		angle *= weight;
		total.rotate(cross,angle);
		total.norm();
	}
	return total;

}
Code.averageVectorTwist3D = function(twists, percents){
	var count = twists.length;
	var locations = [];
	var angles = [];
	var directions = [];
	for(var i=0; i<count; ++i){
		var twist = twists[i];
		directions.push(twist["direction"]);
		var angle = twist["angle"];
		angles.push(new V2D(1,0).rotate(angle));
		locations.push(twist["offset"]);
	}
	var location = V3D.meanFromArray(locations);
	var angle = Code.averageAngleVector2D(angles);
	var direction = Code.averageAngleVector3D(directions);
		angle = V2D.angleDirection(V2D.DIRX,angle);
	var average = {"direction":direction, "angle":angle, "offset":location};
	return average;
}
Code.axisFromQuaternion = function(q){
	var x = new V3D(1,0,0);
	var y = new V3D(0,1,0);
	var z = new V3D(0,0,1);
	q.qMulPoint(x,x);
	q.qMulPoint(y,y);
	q.qMulPoint(z,z);
	return [x,y,z];
}
Code.axisFromMatrix3D = function(m){
	// var o = new V3D(0,0,0);
	// var x = new V3D(1,0,0);
	// var y = new V3D(0,1,0);
	// var z = new V3D(0,0,1);
	// matrix.multV3DtoV3D(o,o);
	// matrix.multV3DtoV3D(x,x);
	// matrix.multV3DtoV3D(y,y);
	// matrix.multV3DtoV3D(z,z);
	// x.sub(o).norm();
	// y.sub(o).norm();
	// z.sub(o).norm();
	// return [x,y,z];
	var x = new V3D(m.get(0,0),m.get(1,0),m.get(2,0));
	var y = new V3D(m.get(0,1),m.get(1,1),m.get(2,1));
	var z = new V3D(m.get(0,2),m.get(1,2),m.get(2,2));
	return [x,y,z];
}
Code.vectorTwistFromQuaternion = function(q){
	var o = new V3D(0,0,0);
	var x = new V3D(1,0,0);
	var y = new V3D(0,1,0);
	var z = new V3D(0,0,1);
	q.qMulPoint(x,x);
	q.qMulPoint(y,y);
	q.qMulPoint(z,z);
	return Code._vectorTwistFromCanonical(o,x,y,z);
}
Code.vectorTwistFromMatrix3D = function(matrix){
	var o = new V3D(0,0,0);
	var x = new V3D(1,0,0);
	var y = new V3D(0,1,0);
	var z = new V3D(0,0,1);
	matrix.multV3DtoV3D(o,o);
	matrix.multV3DtoV3D(x,x);
	matrix.multV3DtoV3D(y,y);
	matrix.multV3DtoV3D(z,z);
	x.sub(o).norm();
	y.sub(o).norm();
	z.sub(o).norm();
	return Code._vectorTwistFromCanonical(o,x,y,z);
}
// Code.quaternionFromVectorTwist = function(twist){
// 	var matrix = Code.Matrix3DFromVectorTwist(V3D.ZERO, twist);
// 	var quaternion = V4D.qFromMatrix(matrix);
// 	return quaternion;
// }
Code.quaternionFromVectorTwist = function(twist){
	var dir = twist["direction"];
	var ang = twist["angle"];
	var rotZ = V4D.qIdentity().qRotateDir(V3D.DIRZ,ang);
		var cross = V3D.cross(V3D.DIRZ,dir);
		if(!cross || cross.length()==0){
			cross = new V3D(0,0,1);
		}
		cross.norm();
		var angle = V3D.angle(V3D.DIRZ,dir);
	var rotX = V4D.qIdentity().qRotateDir(cross,angle);
	var q = V4D.qIdentity();
		q = V4D.qMul(rotZ,q).qNorm();
		q = V4D.qMul(rotX,q).qNorm();
		// q = V4D.qMul(q,rotZ).qNorm();
		// q = V4D.qMul(q,rotX).qNorm();
	return q;
}
Code._vectorTwistFromCanonical = function(o,x,y,z){
	// find the angle Z has made with Z
	var dir = V3D.cross(V3D.DIRZ,z).norm();
	var ang = V3D.angle(V3D.DIRZ,z);
	// undo the z movement
	x = V3D.rotateAngle(x,dir,-ang);
	// y = V3D.rotateAngle(y,dir,-ang);
	// find the x & y angles (sould be identical)
	var crossX = V3D.cross(V3D.DIRX,x);
	// var crossY = V3D.cross(V3D.DIRY,y);
	var angleX = V3D.angle(V3D.DIRX,x);
	// var angleY = V3D.angle(V3D.DIRY,y);
	var angle = angleX; // (angleX+angleY)*0.5; // TODO: average small error ?
	if(crossX.z<0){
		angle = -angle;
	}
	var direction = z.copy();
	return {"direction":direction, "angle":angle, "offset":o};
}
Code.Matrix3DFromVectorTwist = function(location, rotation){
	if(rotation===undefined){
		rotation = location;
		location = rotation["offset"];
		if(!location){
			location = new V3D(0,0,0);
		}
	}
	var twist = rotation["angle"];
	var dir = rotation["direction"];
	var attitude = V3D.cross(V3D.DIRZ,dir).norm();
	var angle = V3D.angle(V3D.DIRZ,dir);
	var transform = new Matrix3D();
		transform.rotateVector(new V3D(0,0,1), twist);
		if(attitude.length()>0){
			transform.rotateVector(attitude, angle);
		}
		// console.log("BEFORE: \n"+transform);
		transform.translate(location.x,location.y,location.z);
		// console.log(" AFTER: \n"+transform);
	transform = Matrix3D.matrixFromMatrix3D(transform);
	// console.log("OUT: \n"+transform);
	return transform;
}
Code.averageQuaternions = function(quaternions, weights){
	var count = quaternions.length;
	var A = new Matrix(4,4);
	var Q = new Matrix(4,4);
	if(weights){
		var weight = 0;
		for(var i=0; i<count; ++i){
			var q = quaternions[i];
			var a = [q.t,q.x,q.y,q.z];
			Matrix.outerArrays(Q, a,a);
			Q.scale(weights[i]);
			Matrix.add(A, A,Q);
			weight += weights[i];
		}
		A.scale(1.0/weight);
	}else{
		for(var i=0; i<count; ++i){
			var q = quaternions[i];
			var a = [q.t,q.x,q.y,q.z];
			Matrix.outerArrays(Q, a,a);
			Matrix.add(A, A,Q);
		}
		A.scale(1.0/count);
	}
	var eigen = Matrix.eigenValuesAndVectors(A);
	var v = eigen["vectors"][0].toArray();
	var q = new V4D(v[0],v[1],v[2],v[3]);
	return q;
}

Code.rotationMatrixToQuaternion = function(a00,a01,a02, a10,a11,a12, a20,a21,a22){ // assuming top 3x3 of rotation matrix
	if(a01===undefined){ // array
		a22 = a00[8];
		a21 = a00[7];
		a20 = a00[6];
		a12 = a00[5];
		a11 = a00[4];
		a10 = a00[3];
		a02 = a00[2];
		a01 = a00[1];
		a00 = a00[0];
	} // else as-is
	var trace = a00 + a11 + a22;
	var w, x, y, z, s;
	if(trace>0) {
		s = 0.5 / Math.sqrt(trace + 1.0);
		w = 0.25 / s;
		x = (a21-a12) * s;
		y = (a02-a20) * s;
		z = (a10-a01) * s;
	}else{
		if(a00>a11 && a00>a22){
			s = 2.0 * Math.sqrt(1.0+a00-a11-a22);
			w = (a21-a12) / s;
			x = 0.25 * s;
			y = (a01+a10) / s;
			z = (a02+a20) / s;
		}else if(a11>a22){
			s = 2.0 * Math.sqrt(1.0+a11-a00-a22);
			w = (a02-a20) / s;
			x = (a01+a10) / s;
			y = 0.25 * s;
			z = (a12+a21) / s;
		}else{
			s = 2.0 * Math.sqrt(1.0+a22-a00-a11);
			w = (a10-a01) / s;
			x = (a02+a20) / s;
			y = (a12+a21) / s;
			z = 0.25 * s;
		}
	}
	return new V4D(x,y,z,w);
}
Code.averageMatrices3D = function(matrixes, percents){ // average location offset, twist, orientation of matrices
	var twists = [];
	for(var i=0; i<matrixes.length; ++i){
		var matrix = matrixes[i];
		var twist = Code.vectorTwistFromMatrix3D(matrix);
		twists.push(twist);
	}
	var average = Code.averageVectorTwist3D(twists, percents);
	var result = Code.Matrix3DFromVectorTwist(average["offset"], average);
	return result;
}
Code.averageAffineMatrices = function(affines, percents){
	var i, count = affines.length;
	if(count==0){
		return null;
	}
	var offsets = [];
	var directions = [];
	var interriors = [];
	var magnitudesX = [];
	var magnitudesY = [];
	// collect
	for(i=0; i<count; ++i){
		var affine = affines[i];
		var o = new V2D(0,0);
		var x = new V2D(1,0);
		var y = new V2D(0,1);
		affine.multV2DtoV2D(o,o);
		affine.multV2DtoV2D(x,x);
		affine.multV2DtoV2D(y,y);
		x.sub(o);
		y.sub(o);
		var z = Code.averageAngleVector2D([x,y]);
		var a = V2D.angleDirection(x,y);
		offsets.push(o);
		directions.push(z);
		interriors.push(a);
		magnitudesX.push(x.length());
		magnitudesY.push(y.length());
	}
	// average
	var offset = Code.averageV2D(offsets,percents);
	var direction = Code.averageAngleVector2D(directions,percents);
	var interrior = Code.averageNumbers(interriors,percents);
	var magnitudeX = Code.averageNumbers(magnitudesX,percents);
	var magnitudeY = Code.averageNumbers(magnitudesY,percents);
	var angle = V2D.angleDirection(V2D.DIRX,direction);
	// final
	var a = new V2D(1,0).rotate(angle).rotate(-interrior*0.5).scale(magnitudeX).add(offset);
	var b = new V2D(1,0).rotate(angle).rotate( interrior*0.5).scale(magnitudeY).add(offset);
	var affine = R3D.affineMatrixExact([V2D.ZERO.copy(),V2D.DIRX.copy(),V2D.DIRY.copy()],[offset,a,b]);
	return affine;
	/*
	ALT:
	for each matrix:
	get offset exact
	get xscale
	get yscale
	get xdir & ydir & average
	// AVERAGE:
	offset = p2D

	*/
}
Code.averageAngles = function(angles, percents){
	var i, count = angles.length;
	var sumSin = 0;
	var sumCos = 0;
	var p = 1.0/count;
	for(i=0; i<count; ++i){
		var angle = angles[i];
		if(percents){
			p = percents[i];
		}
		sumSin += Math.sin(angle)*p;
		sumCos += Math.cos(angle)*p;
	}
	return Math.atan2(sumSin,sumCos);
}
Code.maxTriAngle = function(A,B,C){
	var ab = new V3D();
	var bc = new V3D();
	var ca = new V3D();
	V3D.sub(ab,B,A);
	V3D.sub(bc,C,B);
	V3D.sub(ca,A,C);
	a = Math.PI - V3D.angle(ab,ca);
	b = Math.PI - V3D.angle(bc,ab);
	c = Math.PI - V3D.angle(ca,bc);
	var maxAngle = Math.max(a,b,c);
	return maxAngle;
}
Code.minAngle = function(a,b){ // [0,2pi] => [-pi,pi]
	// a = Code.angleZeroTwoPi(a);
	// b = Code.angleZeroTwoPi(b);
	var nB = a-b;
	if(nB>Math.PI){
		return nB - 2*Math.PI;
	}else if(nB<-Math.PI){
		return nB + 2*Math.PI;
	}
	return -nB;
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
Code.anglePi = function(ang){ // [-inf,inf] => [0,2pi]
	var pi = Math.PI;
	var pi2 = Math.PI*2;
	while(ang>=pi){
		ang -= pi2;
	}
	while(ang<-pi){
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
Code.angleDifference = function(a,b){ // radians between a->b
	if(a<=b){
		return b-a;
	}
	return b + Math.PI*2 - a;
}
Code.angleDirection = function(a,b){
	a = V2D.DIRX.copy().rotate(a);
	b = V2D.DIRX.copy().rotate(b);
	return V2D.angleDirection(a,b);
}
Code.isAngleInside = function(start,end, a){ // all angles in [0,2pi]
	var diffE = Code.angleDifference(start,end);
	var diffA = Code.angleDifference(start,a);
	if(diffA<=diffE){
		return true;
	}
	return false;
}
Code.anglesToBins = function(angles, mags, binCount){ // [0,2pi]
	var withPercentBinning = true;
	// var withPercentBinning = false;
	var bins = Code.newArrayZeros(binCount);
	var binAngle = Math.PI*2.0/binCount;
	var halfAngle = binAngle*0.5;
	var baseDir = new V2D(1,0).rotate(-halfAngle);
	for(var i=0; i<angles.length; ++i){
		var angle = angles[i];
		var mag = mags[i];
		// var angle = V2D.angleDirection(V2D.DIRX,vector);
			// angle = Code.angleZeroTwoPi(angle);
		var percent = angle/(Math.PI2);
		var binP = percent*binCount;
		var binD = Math.floor(binP);
		var binR = binP % 1;
		var binS = 1.0 - binR;
		if(withPercentBinning){
			var binI = binD;
			var binJ = (binD+1)%binCount;
			bins[binI] += mag*binS;
			bins[binJ] += mag*binR;
		}else{
			bins[binD] += mag;
		}
	}
	return {"bins":bins, "count":binCount};
}
Code.vectorsToAngleBins = function(vectors, binCount){
	var angles = [];
	var mags = [];
	for(var i=0; i<vectors.length; ++i){
		var vector = vectors[i];
		var mag = vector.length();
		var angle = V2D.angleDirection(V2D.DIRX,vector);
			angle = Code.angleZeroTwoPi(angle);
		angles.push(angle);
		mags.push(mag);
	}
	return Code.anglesToBins(angles, mags, binCount);
}

Code.vectorsToBins3D = function(vectors, sizeX,sizeY,sizeZ, offX,offY,offZ){
	var binCount = sizeX*sizeY*sizeZ;
	var bins = Code.newArrayZeros(binCount);
	var minV = new V3D();
	var maxV = new V3D();
	var minR = new V3D();
	var maxR = new V3D();
	var halfSize = 0.5;
	var cuboid = new Cuboid();
	for(var i=0; i<vectors.length; ++i){
		var vector = vectors[i];
		// minV.set(offX+vector.x-halfSize,offY+vector.y-halfSize,offZ+vector.z-halfSize);
		// maxV.set(offX+vector.x+halfSize,offY+vector.y+halfSize,offZ+vector.z+halfSize);
		minV.set(vector.x-halfSize,vector.y-halfSize,vector.z-halfSize);
		maxV.set(vector.x+halfSize,vector.y+halfSize,vector.z+halfSize);
		var intersections = [];
		var volumeTotal = 0;
		var mag = vector.length();
		for(var z=0; z<sizeZ; ++z){
			for(var y=0; y<sizeY; ++y){
				for(var x=0; x<sizeX; ++x){
					minR.set(offX+x-0,offY+y-0,offZ+z-0);
					maxR.set(offX+x+1,offY+y+1,offZ+z+1);
					var intersection = Code.cuboidIntersect(minV,maxV,minR,maxR, cuboid);
					if(intersection){
						var vol = intersection.volume();
						if(vol>0){
							var bin = z*sizeY*sizeX + y*sizeX + x;
							volumeTotal += vol;
							intersections.push([bin,vol]);
						}
					}
				}
			}
		}
		for(var j=0; j<intersections.length; ++j){
			var intersection = intersections[j];
			var bin = intersection[0];
			var vol = intersection[1];

			bins[bin] += mag*vol/volumeTotal;
		}
	}
	return {"bins":bins, "count":binCount};
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
Code.randomIndexes = function(count, range){
	var i, set = [];
	var rm1 = range-1;
	for(i=0; i<count; ++i){
		set[i] = Code.randomInt(rm1);
	}
	return set;
}
// Code.randomIndexes = function(count){
// 	var i, set = [];
// 	var cm1 = count-1;
// 	for(i=0; i<count; ++i){
// 		set[i] = i;
// 	}
// 	// swap
// 	for(i=0; i<count; ++i){
// 		var j = Code.randomInt(cm1);
// 		var t = set[i];
// 		set[i] = set[j];
// 		set[j] = t;
// 	}
// 	return set;
// }
// Code.randomIntervalSet(5, 0, 10);
Code.randomSampleRepeatsMaximum = function(array, maximumCount, randomCount){ // use array as-is if too small, else subsample
	var samples = null;
	if(array.length<maximumCount){
		samples = Code.copyArray(array);
	}else{
		samples = Code.randomSampleRepeats(array,randomCount);
	}
	return samples;
}
Code.randomSampleRepeats = function(array, count){
	var len = array.length;
	var random = [];
	for(var i=0; i<count; ++i){
		var index = Math.floor(Math.random()*len);
		random.push(array[index]);
	}
	return random;
}
Code.randomIntervalSet = function(count, min,max){
// TODO: OPTIMIZATIONS FOR DIFFERENT COUNT CASES
	if(max===undefined){ max = min; min = 0; }
	var maxMinusMin = max-min;
	// var maxMinusMinP1 = maxMinusMin + 1;
	if(maxMinusMin < count){
		return []; // impossible
	}
	var i, set = [];
	for(i=0; i<=maxMinusMin; ++i){
		set[i] = i + min;
	}
	Code.randomizeArray(set); // unnecessary
	while(set.length>count){ // remove a random index
		set.splice( Math.min(Math.floor(Math.random()*set.length),set.length-1), 1);
	}
	return set;
}

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
Code.randomIntArray = function(count, min,max){
	var i, a = [];
	for(i=0; i<count; ++i){
		a[i] = Code.randomInt(min,max);
	}
	return a;
}
Code.randomID = function(len){
	len = len!==undefined ? len : 6;
	var chars = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	var i, c, str = "";
	for(i=0; i<len; ++i){
		c = Code.randomInt(0,chars.length-1);
		str = str + chars[c];
	}
	return str;
}
Code.randomPointOnSphere = function(radius){
	radius = radius!==undefind ? radius : 1.0;
	var u = Math.random(), v = Math.random();
	var the = 2*Math.PI*u;
	var phi = Math.acos(2*v-1);
	var cp = Math.sin(phi), sp = Math.sin(phi);
	var ct = Math.sin(the), st = Math.sin(the);
	var x = radius*sp*ct;
	var y = radius*sp*st;
	var z = radius*cp;
	return new V3D(x,y,z);
}
Code.randomPointInSphere = function(radius){
	radius = radius!==undefind ? radius : 1.0;
	var c = Math.random(), x = Math.random(), y = Math.random(), z = Math.random();
	var len = Math.sqrt(x*x + y*y + z*z);
	x /= len; y /= len; z /= len;
	c = radius*Code.cubeRoot(c);
	return new V3D(x*c,y*c,z*c);
	/*
    var u = Math.random();
    var v = Math.random();
    var theta = 2.0*u*Math.PI;
    var phi = Math.acos(2.0*v - 1.0);
    var r = Code.cubeRoot(Math.random());
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    var sinPhi = Math.sin(phi);
    var cosPhi = Math.cos(phi);
    var x = r*sinPhi*cosTheta;
    var y = r*sinPhi*sinTheta;
    var z = r*cosPhi;
    return new V3D(x,y,z);
	*/
}
Code.divSpace = function(start,end,count){ // start+end / count
	count -= 1;
	var range = end-start;
	var i, arr = [];
	for(i=0; i<=count; ++i){
		arr[i] = start + i*range/count;
	}
	return arr;
}
Code.lineSpace = function(start,end,count){ // start +count ... end
	count = count!==undefined ? count : 1.0;
	var i, arr = [];
	if(count==0){
		return [start];
	}
	if(end<start){ // decreasing
		if(count>0){
			count = -count;
		}
		for(i=start; i>=end; i+=count){
			arr.push(i);
		}
	}else{
		if(count<0){
			count = -count;
		}
		for(i=start; i<=end; i+=count){
			arr.push(i);
		}
	}
	return arr;
}

Code.interpolateColorGradientARGB = function(percent, colors,locations){
	if(colors.length==0){
		return colors[0];
	}
	if(!locations){
		locations = [];
		for(var i=0; i<colors.length; ++i){
			locations.push(i/(colors.length-1));
		}
	}
	var lm1 = colors.length - 1;
	for(var i=0; i<lm1; ++i){
		var locationA = locations[i];
		var locationB = locations[i+1];
		if(locationA<=percent && percent<=locationB){
			var colorA = colors[i];
			var colorB = colors[i+1];
			var r = (locationB-locationA);
			if(r==0){
				return colorA;
			}
			var p = (percent-locationA)/r;
			var pm1 = 1.0 - p;
			var alpA = Code.getFloatAlpARGB(colorA);
			var alpB = Code.getFloatAlpARGB(colorB);
			var redA = Code.getFloatRedARGB(colorA);
			var redB = Code.getFloatRedARGB(colorB);
			var grnA = Code.getFloatGrnARGB(colorA);
			var grnB = Code.getFloatGrnARGB(colorB);
			var bluA = Code.getFloatBluARGB(colorA);
			var bluB = Code.getFloatBluARGB(colorB);
			var alp = pm1*alpA + p*alpB;
			var red = pm1*redA + p*redB;
			var grn = pm1*grnA + p*grnB;
			var blu = pm1*bluA + p*bluB;
			var color = Code.getColARGBFromFloat(alp,red,grn,blu);
			return color;
		}
	}
	return null; // error?
}
// Code.grayscaleFloatToHeatMapFloat = function(gry){
// 	var colors = [0xFF000000, 0xFF330066, 0xFF0000FF, 0xFF3399FF, 0xFF00FF00, 0xFFFF0000, 0xFFFF9900, 0xFFFFFFFF];
// 	var color = Code.interpolateColorGradientARGB(gry[i], colors);
// 	var a = Code.getFloatAlpARGB(color);
// 	var r = Code.getFloatRedARGB(color);
// 	var g = Code.getFloatGrnARGB(color);
// 	var b = Code.getFloatBluARGB(color);
// 	return {"alp":a, "red":r, "grn":g, "blu":b};
// }
Code.grayscaleFloatToHeatMapFloat = function(gry, colors){ // in [0,1]
	// 0xFFFF0000,
	colors = colors!==undefined ? colors : [0xFF000000, 0xFF330066, 0xFF0000FF, 0xFF3399FF, 0xFF00FF00, 0xFFFF0000, 0xFFFF9900, 0xFFFFFFFF]; // 0->1: black, purple, blue, turquoise, green, red, yellow, white
	var i, len = gry.length;
	var a = Code.newArray(len);
	var r = Code.newArray(len);
	var g = Code.newArray(len);
	var b = Code.newArray(len);
	for(var i=0;i<len;++i){
		var color = Code.interpolateColorGradientARGB(gry[i], colors);
		a[i] = Code.getFloatAlpARGB(color);
		r[i] = Code.getFloatRedARGB(color);
		g[i] = Code.getFloatGrnARGB(color);
		b[i] = Code.getFloatBluARGB(color);
	}
	return {"alp":a, "red":r, "grn":g, "blu":b};
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
	return col >>> 0;
}
Code.getHexColorARGB = function(col){
	return "0x"+Code.getHexNumber(col,8);
}
// Code.getHex( Code.colorARGBFromJSColor( "rgba(23,50,244,0.5)" ) );
Code.colorARGBFromJSColor = function(jsColor){
	if(jsColor){
		if(jsColor.length >= 3){
			if(jsColor.substring(0,4)=="rgba"){ // rgba(r,g,b,a)
				var inside = jsColor.substring(jsColor.indexOf("(")+1,jsColor.indexOf(")"));
				var items = inside.split(",");
				if(items.length==4){
					var r = parseInt(items[0]) / 255.0;
					var g = parseInt(items[1]) / 255.0;
					var b = parseInt(items[2]) / 255.0;
					var a = parseFloat(items[3]);
					return Code.getColARGBFromFloat(a,r,g,b);
				}
			}else if(jsColor.substring(0,3)=="rgb"){ // rgb(r,g,b)
				var inside = jsColor.substring(jsColor.indexOf("(")+1,jsColor.indexOf(")"));
				var items = inside.split(",");
				if(items.length==3){
					var r = parseInt(items[0]) / 255.0;
					var g = parseInt(items[1]) / 255.0;
					var b = parseInt(items[2]) / 255.0;
					return Code.getColARGBFromFloat(1.0,r,g,b);
				}
			}else{ // (#|0x)RGB
				return Code.getColARGBFromString(jsColor);
			}
		}
	}
	return 0x00000000; // default clear
}
Code.getHexNumber = function(num,pad, post){
	if(num===undefined){ return 0; }
	var str = num.toString(16).toUpperCase();
	if(pad!==undefined){
		if(post){
			str = Code.postpendFixed(str,"0",pad);
		}else{
			str = Code.prependFixed(str,"0",pad);
		}
	}
	return str;
}
Code.printArrayHex = function(a,pad){
	var str = "";
	if(a){
		for(var i=0; i<a.length; ++i){
			str = str + "" +Code.getHexNumber(a[i],pad);
		}
	}
	return str;
	//Code.getHexNumber = function(num,pad, post){
}
Code.getColARGBFromFloat = function(a,r,g,b){
	a = Math.min(Math.floor(a*256.0),255);
	r = Math.min(Math.floor(r*256.0),255);
	g = Math.min(Math.floor(g*256.0),255);
	b = Math.min(Math.floor(b*256.0),255);
	return Code.getColARGB(a,r,g,b);
}
Code.inverseColorARGB = function(col){
	a = (col>>24) & 0x000000FF;
	r = (col>>16) & 0x000000FF;
	g = (col>>8) & 0x000000FF;
	b = (col>>0) & 0x000000FF;
	//a = Math.min(256-a,255);
	r = Math.min(256-r,255);
	g = Math.min(256-g,255);
	b = Math.min(256-b,255);;
	return Code.getColARGB(a,r,g,b);
}
Code.getColARGB = function(a,r,g,b){
	return ((a<<24)+(r<<16)+(g<<8)+b) >>> 0;
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
Code.setAlpFloatARGB = function(col, a){
	col = col & 0x00FFFFFF;
	a = Math.min(Math.floor(a*256.0),255);
	return col + (a << 24);
}
Code.setRedFloatARGB = function(col, r){
	col = col & 0x00FFFFFF;
	r = Math.min(Math.floor(r*256.0),255);
	return col + (r << 16);
}
Code.setGrnFloatARGB = function(col, g){
	col = col & 0x00FFFFFF;
	g = Math.min(Math.floor(g*256.0),255);
	return col + (g << 8);
}
Code.setBluFloatARGB = function(col, b){
	col = col & 0x00FFFFFF;
	b = Math.min(Math.floor(b*256.0),255);
	return col + (b);
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
Code.getFloatARGB = function(col){
	var a = Code.getFloatAlpARGB(col);
	var r = Code.getFloatRedARGB(col);
	var g = Code.getFloatGrnARGB(col);
	var b = Code.getFloatBluARGB(col);
	return [a,r,g,b];
}
Code.linear2DColorARGB = function(x,y, colA,colB,colC,colD){
	var tl = Code.getFloatARGB(colA);
	var tr = Code.getFloatARGB(colB);
	var bl = Code.getFloatARGB(colC);
	var br = Code.getFloatARGB(colD);
	var a = Code.linear2D(x,y, tl[0],tr[0],bl[0],br[0]);
	var r = Code.linear2D(x,y, tl[1],tr[1],bl[1],br[1]);
	var g = Code.linear2D(x,y, tl[2],tr[2],bl[2],br[2]);
	var b = Code.linear2D(x,y, tl[3],tr[3],bl[3],br[3]);
	var color = Code.getColARGBFromFloat(a,r,g,b);
	return color;
}
Code.clampRound0255 = function(n){
	return Math.min(Math.max(Math.round(n),0),255);
}
Code.clamp = function(n, a,b){ // TODO: BETTWER WORD
	return Math.min(Math.max(n,a),b);
}
Code.array01To0255 = function(array){
	for(var i=0; i<array.length; ++i){
		array[i] = Math.min(Math.floor(array[i]*256.0),255);
	}
	return array;
}
// Code.getFloatArrayARGBFromARGB = function(col){
// 	return Code.getFloatARGB(colA);
// }
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
Code.LUVFromRGB = function(){ // CIE / LUV. : L=[0,100] U=[-134,220], V=[-140,122]

	//
}
Code.RGBtoYUV = function(rgb){ // in [0,1]
	var y = rgb.x*0.299 + rgb.y*0.587 + rgb.z*0.114;
	var u = rgb.x*-0.147 + rgb.y*-0.289 + rgb.z*0.463;
	var v = rgb.x*0.615 + rgb.y*-0.515 + rgb.z*-0.100;
	return new V3D(y,u,v);
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
Code.fixed = function(start,count){
	if(start && start.length>count){
		return start.substring(0,count-1);
	}
	return start;
}
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
Code.centerpendFixed = function(start,pad,count){
	var str = start;
	var toggle = 0;
	while(str.length<count){
		if(toggle%2==0){
			str = pad+str;
		}else{
			str = str+pad;
		}
		++toggle;
	}
	return str;
}
Code.sign = function(num){
	return num>=0.0 ? 1.0 : -1.0;
}
// -------------------------------------------------------- RNG
Code.PRNG = function(array, input, mod){ // Code.PRNG([101681,101693,103001,102929,104033], i, 104729);
	input = input!==undefined ? input : 0;
	mod = mod!==undefined ? mod : 900275296079; //Math.pow(2,30)-1;
	var i, j;
	var len = array.length;
	var number = 0;
	for(i=0; i<31; ++i){
		for(j=0; j<len; ++j){
			array[i%len] = (array[input%len] + input) % mod; // this has had problems
			input = Math.abs((input + array[j]) % mod);
		}
		if(input%2==0){
			number = number + Math.pow(2,-(31-i));
		}
	}
	//console.log(array+"")
	return number;
}
Code.CSPRNG = function(array, iterations){ // sequence of masses, positions, velocities
	iterations = iterations!==undefined ? iterations : 10;
	var size = 7; // mass, px,py,pz, vx,vy,vz
	if(array.length<2*size){ // need 2 minimum
		return null;
	}
	var i, j;
	var masses = [];
	var positions = [];
	var velocities = [];
	var g = 0;
	for(i=0, j=0; i<array.length; i+=3, ++j){
		masses[j] = array[i];
		positions[j] = array[i+1];
		velocities[j] = array[i+2];
	}
	var number = 0;
	for(i=0; i<iterations; ++i){
		for(j=0; j<masses.length; ++j){
			for(k=0; k<masses.length; ++k){
				// F = m1 * m2 * G / r
			}
		}
		// if(input%2==0){
		// 	number = number + Math.pow(2,-(31-i));
		// }
	}
	for(i=0, j=0; i<array.length; i+=3, ++j){
		array[i]   = masses[j];
		array[i+1] = positions[j];
		array[i+2] = velocities[j];
	}
	return number;
}
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
Code.addRandomNoise = function(arr,mag){
	var i, n;
	for(i=0; i<arr.length; ++i){
		n = (Math.random()-0.5)*mag;
		arr[i] += n;
	}
	return arr;
}
Code.randomizedArray = function(len){
	var i, arr = [], len = len?len:10;
	for(i=0;i<len;++i){
		arr[i] = i;
	}
	Code.randomizeArray(arr, false);
}
Code.randomizeArray = function(arr, guarantee){
	guarantee = guarantee!==undefined ? guarantee : false;
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
Code.mirrorArray = function(array){
	var min = Code.min(array);
	// var max = Code.max(array);
	// var range = max-min;
	var next = [];
	for(var i=0; i<array.length; ++i){
		console.log(array[i], -1*(array[i]-min) + min);
		next.push( -1*(array[i]-min) + min );
	}
	return next;
}
Code.stdDev = function(list,mean,key, count){
	var i, sig=0, item, len=list.length;
	if(count!==undefined){
		len = Math.min(len,count);
	}
	if(len==0){ return 0; }
	for(i=len;i--;){
		item = list[i];
		if(key!==undefined && key!==null){
			item = item[key];
		}
		sig += Math.pow(item-mean,2);
	}
	return Math.sqrt(sig / len);
}
Code.mean = function(list,key, count){
	var i, mu=0, item, len=list.length;
	if(count!==undefined){
		len = Math.min(len,count);
	}
	if(len==0){ return 0; }
	//for(i=len;i--;){
	for(i=0;i<len;++i){
		item = list[i];
		if(key!==undefined && key!==null){
			item = item[key];
		}
		mu += item;
	}
	return mu / len;
}
Code.median = function(list,key,count, doSort){ // median = middle of set: assume sorted
// TODO: key unused
	if(list.length==0){
		return null;
	}
	var len = list.length;
	if(count!==undefined){
		len = Math.min(len,count);
	}
	var lo = Math.floor(len*0.5);
	if(len%2==0){
		var hi = lo + 1;
		return (list[lo] + list[hi])*0.5;
	}
	return list[lo];
}
Code.percentile = function(list, percent){ // not statistics percentile .. more just linear array percent index
	var count = list.length;
	var indexA = Math.floor(count*percent);
	var indexB = Math.min(Math.ceil(count*percent),count-1);
	return (list[indexA] + list[indexB])*0.5;
}
Code.sum = function(list,key,count){
	var i, sum=0, item, len=list.length;
	if(count!==undefined){
		len = Math.min(len,count);
	}
	if(len==0){ return 0; }
	for(i=len;i--;){
		item = list[i];
		if(key!==undefined && key!==null){
			item = item[key];
		}
		sum += item;
	}
	return sum;
}

Code.runningInfos = function(list, windowSize){
	var halfSize = windowSize*0.5 | 0;
	var middleSize = halfSize+1;
	var sum = 0;
	var averages = [];
	// var squareds = [];
	var sigmas = [];
	for(var i=0; i<middleSize && i<list.length; ++i){
		sum += list[i];
	}
	var counts = [];
	var maxCountCheck = list.length-halfSize-1;
	for(var i=0; i<list.length; ++i){
		var countA = windowSize;
		var countB = windowSize;
		if(i<=halfSize){
			countA = i+halfSize;
		}
		if(i>=maxCountCheck){
			countB = maxCountCheck-i+windowSize-1;
		}
		var count = Math.min(countA,countB);
		counts.push(count);
		var avg = sum/count;
		averages[i] = avg;
		// averages[i] = sum;
		var minI = Math.max(0,i-halfSize);
		var maxI = Math.min(list.length-1,i+halfSize);
		// console.log(minI,maxI);
		var std = 0;
		for(var ii=minI; ii<=maxI; ++ii){
			std += Math.pow(list[ii] - avg, 2);
		}
		// console.log(std);
		sigmas[i] = Math.sqrt(std/count);
		// sigmas[i] = ;
		if(i>=halfSize){
			sum -= list[i-halfSize];
			// console.log("drop: "+list[i-halfSize]);
		}
		if(i+middleSize<list.length){
			sum += list[i+middleSize];
			// console.log("add : "+list[i+middleSize]);
		}
	}
	// console.log(counts);

	return {"mean":averages, "sigma":sigmas};
};

Code.abs = function(a){
	for(var i=a.length; i--; ){
		a[i] = Math.abs(a[i]);
	}
	return a;
}
Code.arrayVectorSub = function(c,a,b){
	if(b===undefined){
		b = a;
		a = c;
		c = Code.newArray(a.length);
	}
	for(var i=a.length; i--; ){
		c[i] = a[i] - b[i];
	}
	return c;
}
Code.arrayVectorAdd = function(c,a,b){ // c = a + b
	if(b===undefined){
		b = a;
		a = c;
		c = Code.newArray(a.length);
	}
	for(var i=a.length; i--; ){
		c[i] = a[i] + b[i];
	}
	return c;
}
Code.arrayVectorMul = function(c,a,b){
	if(b===undefined){
		b = a;
		a = c;
		c = Code.newArray(a.length);
	}
	for(var i=a.length; i--; ){
		c[i] = a[i] * b[i];
	}
	return c;
}
Code.arrayVectorDiv = function(c,a,b){
	if(b===undefined){
		b = a;
		a = c;
		c = Code.newArray(a.length);
	}
	for(var i=a.length; i--; ){
		c[i] = a[i] / b[i];
	}
	return c;
}
Code.arrayVectorLength = function(a){
	var s = 0;
	for(var i=a.length; i--; ){
		s += a[i]*a[i];
	}
	return Math.sqrt(s);
}
Code.arrayVectorScale = function(a, s){
	var c = Code.newArray(a.length);
	for(var i=a.length; i--; ){
		c[i] = s*a[i];
	}
	return c;
};
Code.arraySub = Code.arrayVectorSub;
Code.arrayAdd = Code.arrayVectorAdd;
Code.arrayScale = Code.arrayVectorScale;
Code.arrayClip = function(a, min, max){
	for(var i=a.length; i--; ){
		a[i] = Math.min(Math.max(a[i], min),max);
	}
	return a;
}
Code.arrayDerivative = function(a){
	var result = [];
	var i, len = a.length;
	for(i=1; i<a.length; ++i){
		result.push(a[i]-a[i-1]);
	}
	return result;
}

Code.separateArrayConstant = function(list,k){
	var i, item, len=list.length;
	var left = [];
	var right = [];
	var out = [];
	for(i=0;i<len;++i){
		item = list[i];
		if(item<k){
			left.push(i);
			out[i] = true;
		}else{
			right.push(i);
			out[i] = false;
		}
	}
	return {"left":left, "right":right, "list":out};
}
/*
ar vLen = Code.arrayVectorLength(v);
	if(vLen > maxVectorLength){ maxVectorLength = vLen; maxVector = Code.copyArray(v); }
	if(vLen < minVectorLength){ minVectorLength = vLen; minVector = Code.copyArray(v); }
	// if(lenR > maxVectorLength){ maxVectorLength = lenR; maxVector = r; }
	// if(lenG > maxVectorLength){ maxVectorLength = lenG; maxVector = g; }
	// if(lenB > maxVectorLength){ maxVectorLength = lenB; maxVector = b; }
	// if(lenR < minVectorLength){ minVectorLength = lenR; minVector = r; }
	// if(lenG < minVectorLength){ minVectorLength = lenG; minVector = g; }
	// if(lenB < minVectorLength){ minVectorLength = lenB; minVector = b; }
	var d = Math.sqrt(x*x + y*y);
	var fall = Math.exp(-d/size);
	var s = fall/vLen;
	Code.arrayScale(vLen);
*/
Code.diff1D = function(array){
	var lm1 = array.length - 1;
	var deltas = [];
	for(var i=0; i<lm1; ++i){
		deltas.push(array[i+1]-array[i]);
	}
	return deltas;
}
Code.gaussianWindow = function(sigma, len, unit){ // to simplify: mirror
	len = len!==undefined ? len : (Math.round(sigma*1.5)*2 + 1);
	unit = unit!==undefined ? unit : true;
	var array = new Array(len);
	var c = 1/(2*sigma*sigma);
	var wo2 = Math.floor(len*0.5);
	var i, x, xx, sum = 0;
	for(i=0; i<len; ++i){
		x = wo2 - i;
		xx = x * x;
		val = Math.exp(-xx*c);
		array[i] = val;
		sum += val;
	}
	if(unit){
		for(i=0; i<len; ++i){
			array[i] = array[i]/sum;
		}
	}
	return array;
}
Code.convolve1D = function(array, filter, reverse, popPadding){
	reverse = reverse!==undefined ? reverse : true;
	if(reverse==true){
		filter = Code.reverseArray(filter);
	}
	return Code.slideWindow(array, filter, popPadding);
}
Code.slideWindow = function(array, filter, popPadding){ // sliding window -- convolve should flip filter
	popPadding = popPadding!==undefined ? popPadding : true
	if(filter.length>array.length){
		var temp = array;
		array = filter;
		filter = temp;
	}
	var i, j, k, c;
	var lenA = array.length;
	var lenAm1 = lenA-1;
	var lenF = filter.length;
	var lenFm1 = lenF-1;
	var lenR = lenA + lenFm1;
	var lenRm1 = lenR - lenFm1;
	var result = new Array(lenR);
	var count, value;
	//console.log("  "+lenR+" = "+lenA+" + "+lenF);
	for(k=0; k<lenR; ++k){
		if(k<lenFm1){
			//console.log("A");
			i = 0;
			j = lenFm1 - k;
			count = lenF - j;
		}else if(k>=lenRm1){
			//console.log("B: ");
			i = k - lenFm1;
			j = 0;
			count = lenA - i;
		}else{
			//console.log("C");
			i = k - lenFm1;
			j = 0;
			count = lenF;
		}
		//console.log("  "+k+"   .......... "+i+" | "+j+" | "+count);
		value = 0;
		for(c=0; c<count; ++c){
			value += array[i+c] * filter[j+c];
		}
		result[k] = value;
	}
	if(popPadding && lenF>1){
		var start = Math.floor(lenF*0.5);
		var end = lenF - start;
		result = Code.copyArray(result,start,lenR-end);
	}
	return result;
}
// -------------------------------------------------------- HTML
Code.getWindow = function(){
	return window;
};
Code.getDocument = function(){
	return document;
};
Code.getBody = function(){
	return document.body;
};
Code.getURL = function(){
	return document.location+"";
};
Code.setURL = function(url){
	document.location = url;
};
// Code.getDomBody = function(){
// 	return document.body;
// };
Code.getDocumentHTML = function(){
	return document.documentElement;
}
Code.documentBody = function(){
	return document.body;
}

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
	// window width - documentHTML
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
Code.newBreak = function(){
	var div = Code.newElement("br");
	return div;
};
Code.newDiv = function(a){
	var div = Code.newElement("div");
	if(a!=undefined){
		Code.setContent(div,a);
	}
	return div;
};
Code.newVideo = function(a){
	var div = Code.newElement("video");
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
Code.getSelected = function(select){
	return Code.getProperty(select.options[select.selectedIndex],"value");
}
Code.setSelected = function(select,value){
	var i, len = Code.numChildren(select);
	for(i=0; i<len; ++i){
		var child = Code.getChild(select,i);
		var v = Code.getProperty(child,"value");
		if(v==value){
			Code.setProperty(child,"selected","selected");
		}else{
			Code.removeProperty(child,"selected");
		}
	}
}
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
Code.getInputTextSelectedRange = function(e){
	var start = e.selectionStart;
	var end = e.selectionEnd;
	var len = end-start;
	return {"start":start, "end":end, "length":len};
}
Code.setInputTextSelectedRange = function(e, start, end){
	//if(e.createTextRange){
	if(e.createTextRange){
		var range = e.createTextRange();
		range.move('character',start);
		// TODO: end ?
		range.select();
	}else if(e.selectionStart || e.selectionStart === 0){
		//e.setSelectionRange(start,end);
		//var selDir = forward backward none
		//e.setSelectionRange(0,0);
		//e.selectionStart = 0
		//e.selectionEnd = 0
		var newStart = start
		var newEnd = end
setTimeout(function() {
		//e.setSelectionRange(0,0+1,"none");
		//console.log("BEFORE: "+e.selectionStart+" | "+start+":"+end)
		e.focus();
		//e.setSelectionRange(start,end-1);
		//e.setSelectionRange(0,0);
		e.setSelectionRange(newStart,newEnd);
		//console.log("AFTER: "+e.selectionStart)
},1);
		//e.focus();
	}else{
		console.log("?");
	}
}
Code.startTrackInputRange = function(input, dispatch){
	dispatch.addJSEventListener(input, Code.JS_EVENT_MOUSE_DOWN, Code._trackInputRangeFxn, Code, {"event":Code.JS_EVENT_MOUSE_DOWN, "input":input});
	dispatch.addJSEventListener(input, Code.JS_EVENT_MOUSE_UP, Code._trackInputRangeFxn, Code, {"event":Code.JS_EVENT_MOUSE_OUT, "input":input});
	dispatch.addJSEventListener(input, Code.JS_EVENT_MOUSE_MOVE, Code._trackInputRangeFxn, Code, {"event":Code.JS_EVENT_MOUSE_OUT, "input":input});
	dispatch.addJSEventListener(input, Code.JS_EVENT_MOUSE_OUT, Code._trackInputRangeFxn, Code, {"event":Code.JS_EVENT_MOUSE_OUT, "input":input});
	dispatch.addJSEventListener(input, Code.JS_EVENT_KEY_DOWN, Code._trackInputRangeFxn, Code, {"event":Code.JS_EVENT_MOUSE_OUT, "input":input});
	dispatch.addJSEventListener(input, Code.JS_EVENT_KEY_UP, Code._trackInputRangeFxn, Code, {"event":Code.JS_EVENT_KEY_UP, "input":input});
}
Code.stopTrackInputRange = function(input, dispatch){
	dispatch.removeJSEventListener(input, Code.JS_EVENT_MOUSE_DOWN, Code._trackInputRangeFxn, Code);
	dispatch.removeJSEventListener(input, Code.JS_EVENT_MOUSE_UP, Code._trackInputRangeFxn, Code);
	dispatch.removeJSEventListener(input, Code.JS_EVENT_MOUSE_MOVE, Code._trackInputRangeFxn, Code);
	dispatch.removeJSEventListener(input, Code.JS_EVENT_MOUSE_OUT, Code._trackInputRangeFxn, Code);
	dispatch.removeJSEventListener(input, Code.JS_EVENT_KEY_DOWN, Code._trackInputRangeFxn, Code);
	dispatch.removeJSEventListener(input, Code.JS_EVENT_KEY_UP, Code._trackInputRangeFxn, Code);
	// change focus mouseenter mouseleave
}
Code._trackInputRangeFxn = function(e,data){ // the selected range is not always determinable by JS UI events
	var event = data["event"];
	var input = data["input"];
	var cursorRange = Code.getInputTextSelectedRange(input);
	var rangeStart = cursorRange["start"];
	var rangeEnd = cursorRange["end"];
	Code.setProperty(input,"data-selection-start",rangeStart);
	Code.setProperty(input,"data-selection-end",rangeEnd);
	if(event==Code.JS_EVENT_MOUSE_OUT){
		var data = {"event":null, "input":input};
		setTimeout(function() {
			Code._trackInputRangeFxn(null,data);
		},1);
	}
}

Code.inputTextUpdateWithLength = function(input, maxLength, filler, postFxn){
	filler = filler ? filler : " ";
	var eStart = Code.getProperty(input,"data-selection-start");
	var eEnd = Code.getProperty(input,"data-selection-end");
	var value = Code.getInputTextValue(input);
	var cursorRange = Code.getInputTextSelectedRange(input);
	var cursorPosition = Math.max(cursorRange.start,cursorRange.end);
	var cursorRemovedCount = 0;
	if(eStart && eEnd){
		eStart = parseInt(eStart);
		eEnd = parseInt(eEnd);
		cursorRemovedCount = eEnd - eStart;
	}
	var newCursorLocation = null;
	var newValue = null;
	if(cursorPosition==value.length){ // replace first
		if(cursorRemovedCount>0){ // selected values already replaced
			newValue = value;
			newCursorLocation = cursorPosition;
		}else{
			newValue = value.substring(1,cursorPosition);
			newCursorLocation = newValue.length;
		}
	}else{ // replace selected
		if(cursorRemovedCount>0){ // selected values already replaced
			newValue = value;
			newCursorLocation = cursorPosition;
		}else{
			var stringA = value.substring(0,cursorPosition);
			var stringB = value.substring(cursorPosition+1,value.length);
			var newString = stringA+""+stringB;
			newValue = newString;
			newCursorLocation = cursorPosition;
		}
	}

	// LENGTH CHECK
	if(newValue.length>=maxLength){ // get right end
		newValue = newValue.substring(newValue.length-maxLength,newValue.length);
	}else{ // pad left end
		newValue = Code.prependFixed(newValue,filler,maxLength)
	}

	// UPDATE
	Code.setInputTextValue(input,newValue);
	Code.setInputTextSelectedRange(input,newCursorLocation,newCursorLocation); // postFxn

	// RETURN
	return newValue;

	//giau.InputFieldColor.hexFieldUpdateOverwrite = function(elementField,count){
}
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
	return Code.valueOrDefault(val, def);
};
Code.valueOrDefault = function(val, def){
	if(val!==undefined && val!==null){
		return val;
	}
	return def;
}
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

// .width .height
// getBoundingClientRect()
// can return 0 certain DOM modifications to the element recently --- display:none
Code.getElementWidth = function(ele){
	return Math.max(ele.clientWidth,ele.offsetWidth,ele.scrollWidth);
}
Code.getElementHeight = function(ele){
	return Math.max(ele.clientHeight,ele.offsetHeight,ele.scrollHeight);
}
Code.getElementLeftRelative = function(ele){
	return ele.offsetLeft;
}
Code.getElementLeftAbsolute = function(ele){
	var left = 0;
	var e = ele;
	while(e){
		left += e.offsetLeft;
		e = e.offsetParent;
	}
	return left;
}
Code.getElementTopRelative = function(ele){
	return ele.offsetTop;
}
Code.getElementTopAbsolute = function(ele){
	var top = 0;
	var e = ele;
	while(e){
		top += e.offsetTop;
		e = e.offsetParent;
	}
	return top;
}
Code.getElementPositionAbsolute = function(ele){
	var left = Code.getElementLeftAbsolute(ele);
	var top = Code.getElementTopAbsolute(ele);
	return new V2D(left,top);
}
Code.getElementPositionRelative = function(ele){
	var left = Code.getElementLeftRelative(ele);
	var top = Code.getElementTopRelative(ele);
	return new V2D(left,top);
}
Code.getPageScrollLocation = function(){
	var doc = Code.getDocumentHTML();
	var win = Code.getWindow();
	var left = (win.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
	var top = (win.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	return {"left":left,"top":top};
}
Code.getWindowScrollLocation = function(){
// TODO:
	var doc = Code.getDocumentHTML();
	var win = Code.getWindow();
	var left = (win.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
	var top = (win.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	return {"left":left,"top":top};
}
Code.getWindowSize = function(){ // viewport
	var win = Code.getWindow();
	var doc = Code.getDocumentHTML();

	var widthWindow = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var widthHTML = Code.getElementWidth(doc);
		var width = Math.min(widthWindow,widthHTML); // subtract 15px for scrollbar
	var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	return {"width":width,"height":height};
}

Code.getPageSize = function(){ // actual content
	var doc = Code.getDocumentHTML();
	var width = Code.getElementWidth(doc);
	var height = Code.getElementHeight(doc);
	return {"width":width,"height":height};
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
Code.setStyleBackgroundImageFit = function(ele){ // big enough to fit inside
	var sty = "background-size";
	var val = "contain";
	Code.removeStyle(ele, sty);
	Code.addStyle(ele, sty, val);
}
Code.setStyleBackgroundImageFill = function(ele){ // entire area
	var sty = "background-size";
	var val = "cover";
	Code.removeStyle(ele, sty);
	Code.addStyle(ele, sty, val);
}
Code.setStyleBackgroundImageSize = function(ele,wid,hei){
	var sty = "background-size";
	var val = wid+" "+hei;
	Code.removeStyle(ele, sty);
	Code.addStyle(ele, sty, val);
}
Code.setStyleTextDecoration = function(ele,val){
	var sty = "text-decoration";
	Code.removeStyle(ele, sty);
	Code.addStyle(ele, sty, val);
}
Code.setStyleTextUnderline = function(ele){
	Code.setStyleTextDecoration(ele,"underline");
}
Code.setStyleTextOverline = function(ele){
	Code.setStyleTextDecoration(ele,"overline");
}
Code.setStyleTextThroughLine = function(ele){
	Code.setStyleTextDecoration(ele,"line-through");
}

Code.setStyleBackgroundImageRepeat = function(ele,x,y){
	//var sty = "background-repeat";
	var repeatType = "repeat";
	if(x!==undefined && y!==undefined){
		if(!x && !y){
			repeatType = "no-repeat";
		}else if(x && !y){
			repeatType = "repeat-x";
		}else if(!x && y){
			repeatType = "repeat-y";
		}
	}
	ele.style.backgroundRepeat = repeatType;
}
Code.setStyleBackgroundColor = function(ele,val){
	ele.style.backgroundColor = val;
};
Code.getStyleBackgroundColor = function(ele){
	var bg = ele.style.backgroundColor; // rgba() | #FGA
	var hex = Code.colorARGBFromJSColor(bg);
	return hex;
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
Code.setStyleFontMonospace = function(ele){
	Code.setStyleFontFamily(ele,"Courier, monospace");// Courier New, Courier, FreeMono, sans-serif
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
Code.getImageIsLoaded = function(img){
	return img.complete;
};
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
	return Code.getMousePositionAbsolute(e);
	/*
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
	// these lines undo the entire loop???
	pos.x = e.pageX - pos.x;
	pos.y = e.pageY - pos.y;
	return pos;
	*/
}
Code.getMousePositionLocal = function(e){
	e = Code.getJSEvent(e);
	return new V2D(e.offsetX,e.offsetY);
}
Code.getMousePositionAbsolute = function(e){
	e = Code.getJSEvent(e);
	return new V2D(e.pageX,e.pageY);
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
	var ratioContents = contentsWidth/contentsHeight;
	var sizeW = containerHeight * ratioContents;
	var sizeH = containerWidth / ratioContents;
	if(sizeW>=containerWidth){
		s.set(sizeW, sizeW/ratioContents);
	}else{
		s.set(sizeH*ratioContents,sizeH);
	}
	return s;
}
Code.sizeToFitInside = function(containerWidth,containerHeight, contentsWidth,contentsHeight){
	var s = new V2D();
	var ratioContents = contentsWidth/contentsHeight;
	var sizeW = containerHeight * ratioContents;
	var sizeH = containerWidth / ratioContents;
	if(sizeW<containerWidth){
		s.set(sizeW, sizeW/ratioContents);
	}else{
		s.set(sizeH*ratioContents,sizeH);
	}
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
	//console.log(document.cookie);
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
Code.getHour = function(milliseconds){
	var d = new Date(milliseconds);
	return d.getHours();
};
Code.getMinute = function(milliseconds){
	var d = new Date(milliseconds);
	return d.getMinutes()
};
Code.getSecond = function(milliseconds){
	var d = new Date(milliseconds);
	return d.getSeconds();
};
Code.getMillisecond = function(milliseconds){
	var d = new Date(milliseconds);
	return d.getMilliseconds()*10;
};
Code.getYear = function(milliseconds){
	var d = new Date(milliseconds);
	return d.getFullYear();
};
Code.getMonthOfYear = function(milliseconds){
	var d = new Date(milliseconds);
	return d.getMonth();
};
Code.getDayOfMonth = function(milliseconds){
	var d = new Date(milliseconds);
	return d.getDate();
};
Code.getDayOfWeek = function(milliseconds){
	var d = new Date(milliseconds);
	return d.getDay();
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
Code.getSetMillisecond = function(milliseconds, millisecond){
	millisecond = Math.floor(millisecond / 10); // input is 0-9999, -> 0,999
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), millisecond);
	return d.getTime();
};
Code.getSetSecond = function(milliseconds, second){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), second, d.getMilliseconds());
	return d.getTime();
};
Code.getSetMinute = function(milliseconds, minute){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), minute, d.getSeconds(), d.getMilliseconds());
	return d.getTime();
};
Code.getSetHour = function(milliseconds, hour){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	return d.getTime();
};
Code.getSetDay = function(milliseconds, day){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth(), day, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	return d.getTime();
};
Code.getSetYear = function(milliseconds, year){
	var d = new Date(milliseconds);
	d = new Date(year, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	return d.getTime();
};
Code.getSetMonth = function(milliseconds, month){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), month, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	return d.getTime();
};
Code.getPrevMonth = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth()-1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	return d.getTime();
};
Code.getNextMonth = function(milliseconds){
	var d = new Date(milliseconds);
	d = new Date(d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
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
Code.dateFromString = function(str){ // YYYY-MM-DD[XHH:MM:SSSS[.NNNN]]
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
	nnnn = Math.floor(nnnn/10); // [0,9999] => [0,999]
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
/*
<SPACE> %20

*/
Code.unescapeURI = function(str){
	return decodeURIComponent(str);
}
Code.escapeSpaces = function(str){
	return (str+"")
         .replace(/ /g, "%20");
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
Code.convetRangeDiscreteRound = function(value, oldMin, oldMax, newMin,newMax){ // CONVERT?
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
		return [-c/b];
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
Code.cubicRoot = function(n){
	return Math.cbrt(n);
}
Code.cubicSolution = function(a,b,c,d){ // a*x^3 + b*x^2 + c*x + d = 0
	if(a==0){ // quadratic
		var value = Code.quadraticSolution(b,c,d);
		if(!Code.isArray(value)){
			value = [value];
		}
		return value;
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
// ------------------------------------------------------------------------------------------------------------------------------------------------- function fitting
Code.bestFitLine2D = function(points, count, weights){ // line fitting: y = mx + b
	var i, len = points.length;
	if(count!==undefined){
		len = Math.min(len,count);
	}
	if(len<2){
		return null;
	}
	if(len==2){
		var dx = points[1].x - points[0].x;
		var dy = points[1].y - points[0].y;
		var m = dy/dx;
		b = ((points[0].y - m*points[0].x) + (points[1].y - m*points[1].x))*0.5;
		return {"m":m, "b":b};
	}
	if(weights){
		return Code.bestFitLine2DWeights(points, count, weights);
	}
	var A = new Matrix(len,3);
	for(i=0;i<len;++i){
		p = points[i];
		A.set(i,0, p.x);
		A.set(i,1, 1.0);
		A.set(i,2, -p.y);
	}
	svd = Matrix.SVD(A);
	coeff = svd.V.colToArray(2);
	m = coeff[0];
	b = coeff[1];
	y = coeff[2]; // deviates from 1
	m /= y;
	b /= y;
	return {"m":m, "b":b};
}
Code.bestFitLine2DWeights = function(points, count, weights){ // weighted least squares, NON-homoscedasticity
	// weights are inverse of importance , ie: 1/sigma^2 = 1/var
	var i, j, len = points.length;
	if(count!==undefined){
		len = Math.min(len,count);
	}
	var n = len;
	var X = new Matrix(n,n);
	var Y = new Matrix(n,n);
	var W = new Matrix(n,n);
	// TODO: filter out 0 weights
	for(i=0; i<len; ++i){
		var point = points[i];
		var weight = weights[i];
		X.set(i,i, point.x);
		Y.set(i,i, point.y);
		weight = 1.0/weight;
		W.set(i,i, weight);
	}
	console.log(X+"");
	console.log(Y+"");
	console.log(W+"");
	var Xt = Matrix.transpose(X);
	var A = Matrix.mult(W,X);
	A = Matrix.mult(Xt,A);
	A = Matrix.inverse(A);
	var B = Matrix.mult(W,Y);
	B = Matrix.mult(Xt,B);
	var beta = Matrix.mult(A,B);
	console.log("....");
	console.log(beta+"");
	//
	// A = X^T * W * X
	// B = X^T * W * Y
	// argmin = Ainv * B

}
// TODO: BILINEAR VECTOR FIELD ?
Code.imageNonlinearTransform = function(source, mappingFxn, samplesX, samplesY){ // image warping / distorting / transform -- very time consuming
	var toPoint = function(a){
		return a["point"];
	};
	var sourceWidth = source.width();
	var sourceHeight = source.height();
	var swm1 = sourceWidth - 1;
	var shm1 = sourceHeight - 1;
	// add samples to space
	var pointFr = new V2D();
	var pointTo = new V2D();
	var minTo = null;
	var maxTo = null;
	var points = [];
	for(var j=0; j<=samplesY; ++j){
		var pJ = j/samplesY;
		for(var i=0; i<=samplesX; ++i){
			var pI = i/samplesX;
			pointFr.set(pI*sourceWidth - 0.5, pJ*sourceHeight - 0.5);
			//pointFr.set(pI*swm1 - 0.0, pJ*shm1 - 0.0);
			mappingFxn(pointTo, pointFr);
			var p = {"point":pointTo.copy(), "mapping":pointFr.copy()};
			points.push(p);
			if(!minTo){ minTo = pointTo.copy(); }
			if(!maxTo){ maxTo = pointTo.copy(); }
			V2D.min(minTo, minTo,pointTo);
			V2D.max(maxTo, maxTo,pointTo);
		}
	}
	console.log("mini: "+minTo);
	console.log("maxi: "+maxTo);
	// create destination image
	var mini = new V2D(Math.floor(minTo.x), Math.floor(minTo.y));
	var maxi = new V2D(Math.ceil(maxTo.x), Math.ceil(maxTo.y));
	var destWidth = maxi.x - mini.x;
	var destHeight = maxi.y - mini.y;
	// console.log("     SOURCE SIZE: "+sourceWidth+"x"+sourceHeight);
	// console.log("DESTINATION SIZE: "+destWidth+"x"+destHeight);
	var destination = new ImageMat(destWidth,destHeight);
	var pointSpace = new QuadTree(toPoint, mini, maxi);
	// console.log(points.length);
	for(var i=0; i<points.length; ++i){
		var p = points[i];
		pointSpace.insertObject(p);
	}
	// fill in
	var weights = [];
	var val = new V3D();
	var org = new V2D();
	var dir = new V2D();
	for(var j=0; j<destHeight; ++j){
		for(var i=0; i<destWidth; ++i){
			pointTo.set(i,j);
				//pointTo.add(mini.x,mini.y);
				pointTo.add(minTo.x,minTo.y);
			/*
			// poor  & not much faster
			var neighbors = pointSpace.kNN(pointTo, 1);
			var neighbor = neighbors[0];
			pointFr.copy(neighbor["mapping"]);
			*/
			var neighbors = pointSpace.kNN(pointTo, 4);
			var totalWeight = 0;
			for(var k=0; k<neighbors.length; ++k){
				var neighbor = neighbors[k];
				var b = neighbor["mapping"];
				//var weight = 1.0/(0.1 + V2D.distance(pointTo,b) );
				var weight = 1.0/(1.0 + V2D.distance(pointTo,b) );
				weights[k] = weight;
				totalWeight += weight;
			}
			//pointFr.set(0,0);
			org.set(0,0);
			dir.set(0,0);
			for(var k=0; k<neighbors.length; ++k){
				var neighbor = neighbors[k];
				var a = neighbor["point"];
				var b = neighbor["mapping"];
				var v = V2D.sub(b,a);
				var percent = weights[k]/totalWeight;
				//pointFr.add(percent*b.x,percent*b.y);
				org.add(percent*a.x,percent*a.y);
				dir.add(percent*v.x,percent*v.y);
			}
			pointFr.set(org.x+dir.x,org.y+dir.y);
			// if(0<=pointFr.x && pointFr.x<=sourceWidth-1 && 0<=pointFr.y && pointFr.y<=sourceHeight-1){
				source.getPoint(val, pointFr.x,pointFr.y);
			// }else{
			// 	val.set(0,0,0);
			// }
			destination.setPoint(i,j, val);
		}
	}
	// TODO: better interpolation
	// faster averaging?
	return {"image":destination, "min":mini, "max":maxi};
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
	det = 1.0/det;
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

Code.determinant4x4 = function(a,b,c,d, e,f,g,h, i,j,k,l, m,n,o,p){ // TODO ^
	var mat = new Matrix(4,4,[a,b,c,d, e,f,g,h, i,j,k,l, m,n,o,p]);
	var det = mat.det();
	return det;
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
Code.findGlobalValue1D = function(array, value){
	var i, len=array.length;
	var lm1 = len - 1;
	var prev;
	locations = [];
// TODO: return all matches, not just first
	for(i=0; i<lm1; ++i){
		var a = array[i];
		var b = array[i+1];
		if((a<=value && value<=b) || (a>=value && value>=b)){
			// console.log(a+ " <= "+value+" <= "+b);
			// linear:
			var range = b-a;
			if(range==0){
				return a + 0.5; // center
			}
			var p = (value - a)/range;
			var pm1 = 1.0 - p;
			locations.push(i + p);
			//value = Code.interpolate1D(new V2D(), new V2D(),  new V2D(), new V2D());
		}
	}
	if(array[lm1]<=value && locations.length==0){
		locations.push(lm1);
	}
	if(array[0]>=value && locations.length==0){
		locations.push(0);
	}
	return locations;
}
Code.interpolateValue1D = function(array, location){
	if(array.length==0){
		return null;
	}
	if(location>0 && location < array.length-1){
		var min = Math.floor(location);
		var max = min + 1;
		var a = array[min];
		var b = array[max];
//		console.log("interpolate: "+min+" | "+location+" | "+max);
		var range = b-a;
		if(range==0){
			return a;
		}
		var p = (location - min);
		var pm1 = 1.0 - p;
		return a*pm1 + b*p;
		//value = Code.interpolate1D(new V2D(), new V2D(location,0),  new V2D(min,array[min]), new V2D(max,array[max]));
		//return value.y;
	}
	if(location<0){
		return array[0];
	}
	return array[array.length-1];
}
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
	if(d.length>1 &&d[0]>=d[1]){
		list.push( new V2D(0,d[0]) );
	}
	if(d.length>1 &&d[d.length-1]>=d[d.length-2]){
		list.push( new V2D(d.length-1,d[d.length-1]) );
	}
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
	if(d.length>1 &&d[0]<=d[1]){
		list.push( new V2D(0,d[0]) );
	}
	if(d.length>1 &&d[d.length-1]<=d[d.length-2]){
		list.push( new V2D(d.length-1,d[d.length-1]) );
	}
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
Code.findExtremaProminence1D = function(d){
	var wasIncreasing = false;
	var wasDecreasing = false;
	var isIncreasing = false;
	var isDecreasing = false;
	var previousMaxima = null;
	var previousMinima = null;
	var i, len = d.length;
	var lm1 = len - 1;
	var value, prevValue = null;
	var maxima = [];
	var minima = [];
	var extrema = [];
	var v;
	var wasMaxima = false;
	var hasChanged = false;
	for(i=0; i<len; ++i){
		value = d[i];
		isIncreasing = value >= prevValue;
		isDecreasing = value <= prevValue;
//		console.log(" "+i+": "+value);
		if(i==0){
			previousMaxima = new V2D(0,d[i]);
			previousMinima = previousMaxima;
		}else{
			if(prevValue!==null && prevValue!==value && hasChanged){
				if((isIncreasing && wasDecreasing) || (isDecreasing && wasIncreasing)){ // switched
					v = Code.interpolateExtrema1D(new V3D(), d[i-2],d[i-1],d[i]);
					v.x += i-1;
					v.z = 0; // unset
					if(isIncreasing && wasDecreasing){ // switched == minimum
//						console.log(" MIN => "+d[i-1]);
						wasMaxima = false;
						minima.push(v);
						extrema.push(v);
						if(maxima.length>0){ // PREVIOUS MAXIMA CHECK LAST 2 MINIMA => SET PROMINENCE
							max = maxima[maxima.length-1];
							max.z = max.y - Math.max(previousMinima.y,v.y);
						}
						previousMinima = v;
					}else if(isDecreasing && wasIncreasing){ // switched == maxima
//						console.log(" MAX => "+d[i-1]);
						wasMaxima = true;
						maxima.push(v);
						extrema.push(v);
						if(minima.length>0){ // PREVIOUS MINIMA CHECK LAST 2 MAXIMA => SET PROMINENCE
							min = minima[minima.length-1];
							min.z = Math.min(previousMaxima.y,v.y) - min.y;
						}
						previousMaxima = v;
					}
				}
			}
			if(prevValue != value){ // first series of repeats has changed
				hasChanged = true;
			}
		}
		if(i==lm1){ // at end
			v = new V2D(0,d[i]);
			if(wasMaxima){
				if(maxima.length>0){
					max = maxima[maxima.length-1];
					max.z = max.y - Math.max(previousMinima.y,v.y);
				}
			}else{
				if(minima.length>0){ // PREVIOUS MINIMA CHECK LAST 2 MAXIMA => SET PROMINENCE
					min = minima[minima.length-1];
					min.z = Math.min(previousMaxima.y,v.y) - min.y;
				}
			}
		}

		wasIncreasing = isIncreasing;
		wasDecreasing = isDecreasing;
		prevValue = value;
	}
	return {"max":maxima, "min":minima, "extrema":extrema};
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
		min.x += minIndex;
	}else if( !(noEnds===true) ){
		min = new V2D(minIndex,yVals[minIndex]);
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
Code.interpolateArray1D = function(array,value){ // linear interpolate
	var min = Math.floor(value);
	var nex = min+1;
	if(array.length>nex){
		var diff = value - min;
		var dim1 = 1.0 - diff;
		var a = array[min];
		var b = array[nex];
		return a*dim1 + b*diff;
	}
	return value;
}
Code.interpolateArray2DLinear = function(grid,wid,hei, x,y, fxn){
	var minX = x | 0;
	var maxX = Math.min(minX + 1,wid-1);
	var minY = y | 0;
	var maxY = Math.min(minY + 1,hei-1);
	// NN
	// var index = minY*wid + minX;
	// return grid[index];
	// linear
	var pxb = x - minX;
	var pyb = y - minY;
	var pxa = 1 - x;
	var pya = 1 - y;
	var indexA = minY*wid + minX;
	var indexB = minY*wid + maxX;
	var indexC = maxY*wid + minX;
	var indexD = maxY*wid + maxX;
	var pA = pxa*pya;
	var pB = pxb*pya;
	var pC = pxa*pyb;
	var pD = pxb*pyb;
	var list = [grid[indexA],grid[indexB],grid[indexC],grid[indexD]];
	var counts = [pA,pB,pC,pD];
	return fxn(list,counts);
}
//------------------------------------------------------------------------------------------------------------------------------------------------- interpolation - 2D
Code.gradient2D = function(loc,d0,d1,d2,d3,d4,d5,d6,d7,d8){
	loc.x = (d5-d3)*0.5;
	loc.y = (d7-d1)*0.5;
}
Code.findMaxima2DFloat = function(d, wid,hei, inte){
	// inte = false;
	return Code.findExtrema2DFloat(d,wid,hei, inte, true, false);
}
Code.findMinima2DFloat = function(d, wid,hei, inte){
	// inte = false;
	return Code.findExtrema2DFloat(d,wid,hei, inte, false, true);
}
Code.findExtrema2DFloat = function(d, wid,hei,   inte, maxi,mini){
	inte = inte!==undefined ? inte : false;
	maxi = maxi!==undefined ? maxi : true;
	mini = mini!==undefined ? mini : true;
	var i, j, hm1=hei-1, wm1=wid-1, list = [];
	var jW0, jW1, jW2, i0,i1,i2;
	var d0,d1,d2,d3,d4,d5,d6,d7,d8;
	var result, count = 0;
// var info = Code.infoArray(d);
// var minimum = info["min"];
// var maximum = info["max"];
// var minIndex = info["indexMin"];
// var maxIndex = info["indexMax"];
//console.log(info,minimum,maximum);
// console.log("minimum: "+minIndex+" = "+minimum);
// console.log("maximum: "+maxIndex+" = "+maximum);
// var eq = true;
var count = 0;
	for(j=1;j<hm1;++j){
		jW0 = (j-1)*wid; jW1 = j*wid; jW2 = (j+1)*wid;
		//console.log(jW0,jW1,jW2);
		for(i=1;i<wm1;++i){
			// var isGT = false;
			// var isLT = false;
			i0 = i-1; i1 = i; i2 = i+1;
			//var index = jW1+i1;
			d0 = d[jW0+i0];
			d1 = d[jW0+i1];
			d2 = d[jW0+i2];
			d3 = d[jW1+i0];
			d4 = d[jW1+i1];
			d5 = d[jW1+i2];
			d6 = d[jW2+i0];
			d7 = d[jW2+i1];
			d8 = d[jW2+i2];
			var isGT = d0<d4&&d1<d4&&d2<d4&&d3<d4&&d5<d4&&d6<d4&&d7<d4&&d8<d4 && maxi;
			var isLT = d0>d4&&d1>d4&&d2>d4&&d3>d4&&d5>d4&&d6>d4&&d7>d4&&d8>d4 && mini;

// var d4 = d[index];
//console.log(d4,minimum);
// if(d4==minimum){
// 	console.log("minimum: "+minimum);
// }
			// if(eq){
			// 	isGT = d0<=d4&&d1<=d4&&d2<=d4&&d3<=d4&&d5<=d4&&d6<=d4&&d7<=d4&&d8<=d4 && maxi;
			// 	isLT = d0>=d4&&d1>=d4&&d2>=d4&&d3>=d4&&d5>=d4&&d6>=d4&&d7>=d4&&d8>=d4 && mini;
			// 	//console.log("check eq "+isGT+" | "+isLT);
			// }
			//var isGTE = d0<=d4&&d1<=d4&&d2<=d4&&d3<=d4&&d5<=d4&&d6<=d4&&d7<=d4&&d8<=d4;
			//var isLTE = d0>=d4&&d1>=d4&&d2>=d4&&d3>=d4&&d5>=d4&&d6>=d4&&d7>=d4&&d8>=d4;
//inte = true;
			if(isGT || isLT){
				//console.log("maybe: "+d4);
				if(inte){
					result = new V3D(i,j,d4);
					list.push(result);
				}else{
					result = Code.extrema2DFloatInterpolate(new V3D(), d0,d1,d2,d3,d4,d5,d6,d7,d8);
					if(result==null){ console.log("COULD NOT FIND EXTREMA"); continue; }
					if(Math.abs(result.x)<1.0 && Math.abs(result.y<1.0)){ // outside area, numerical error?
						result.x += i; result.y += j;
						list.push(result);
					}else{ // need to look at neighbor
						// console.log(" "+d0+" "+d1+" "+d2+" "+d3+" "+d4+" "+d5+" "+d6+" "+d7+" "+d8+" ");
						result = new V3D(i,j,d4);
						list.push(result);
					}
				}
			// if( (d0<d4&&d1<d4&&d2<d4&&d3<d4&&d5<d4&&d6<d4&&d7<d4&&d8<d4) // maxima
			// ||  (d0>d4&&d1>d4&&d2>d4&&d3>d4&&d5>d4&&d6>d4&&d7>d4&&d8>d4) ){ // minima
			// if( (d0<=d4&&d1<=d4&&d2<=d4&&d3<=d4&&d5<=d4&&d6<=d4&&d7<=d4&&d8<=d4) // maxima
			// ||  (d0>=d4&&d1>=d4&&d2>=d4&&d3>=d4&&d5>=d4&&d6>=d4&&d7>=d4&&d8>=d4) ){ // minima
			// if(true){
			// if(isGTE || isLTE){
			// 	if(inte && (isGT || isLT)){
			// 		result = new V3D(i,j,d4);
			// 		list.push(result);
			// 		continue;
			// 	}else{
			// 		result = Code.extrema2DFloatInterpolate(new V3D(), d0,d1,d2,d3,d4,d5,d6,d7,d8);
			// 		if(result==null){ console.log("COULD NOT FIND EXTREMA"); continue; }
			// 			d4 = result.z;
			// 			isGT = d0<d4&&d1<d4&&d2<d4&&d3<d4&&d5<d4&&d6<d4&&d7<d4&&d8<d4;
			// 			isLT = d0>d4&&d1>d4&&d2>d4&&d3>d4&&d5>d4&&d6>d4&&d7>d4&&d8>d4;
			// 			if(isGT || isLT){
			// 				result.x += i; result.y += j;
			// 				list.push(result);
			// 				continue;
			// 			}
			// 	}
			}

			++count;
		}
	}
//	console.log("COUNT: "+count)
	return list;
}
// https://www.value-at-risk.net/ordinary-interpolation-methodology/
//Code.extrema2DFloatDiscrete = function(d, wid,hei){
Code.contourTreeExtrema = function(d, wid,hei){
	// CRITICAL POINTS
	// 2D SCALAR
	/*

	contour tree
	http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.538.4660&rep=rep1&type=pdf

	convert to triangle set


	WATER FILL MAXIMA / MINIMA / SADDLE:
	) order on maxima [record value & x & y]
	) for each element:
		) make it into a group
		) if touching a neighbor who is already a group [lookup index]
			) add to other group's list of elements
		) else
			) keep in own group list
		) mark point as group index

	) for each maxima:
		) center point = location = average first points with all same value






	*/
	return null;
}


https://www.quora.com/What-is-the-Hessian-matrix
Code._tempMatrixArray2 = [0,0];
Code._tempMatrixArray4 = [0,0,0,0];
Code.extrema2DFloatInterpolate = function(loc, d0,d1,d2,d3,d4,d5,d6,d7,d8){ // want to know where dx and dy are simultaneously equal to zero
	var dx = (d5-d3)*0.5;
	var dy = (d7-d1)*0.5;
	var dxdx = (d5-2.0*d4+d3);
	var dydy = (d7-2.0*d4+d1);
	var dxdy = (d8-d6-d2+d0)*0.25;
	var Hinv = Code.inverse2x2(Code._tempMatrixArray4, dxdx,dxdy, dxdy,dydy);
		//var H = new Matrix(2,2, [dxdx,dxdy, dxdy,dydy]);
		//var Hinv = Matrix.inverse(H);
		//Hinv = Hinv.toArray();
	if(!Hinv){ console.log("COULD NOT FIND INVERSE"); return null; }
	var dD = Code.setArray(Code._tempMatrixArray2,dx,dy);
	Code.mult2x2by2x1toV2D(loc, Hinv,dD);
	loc.x = -loc.x; loc.y = -loc.y;
	loc.z = d4 + 0.5*(dx*loc.x + dy*loc.y);
	// if(Code.isNaN(loc.x) || Code.isNaN(loc.y)){
	// 	console.log(dx);
	// 	console.log(dy);
	// 	console.log(dxdx);
	// 	console.log(dxdy);
	// 	console.log(dydy);
	// 	console.log(dD);
	// 	console.log(loc);
	// 	console.log(d0,d1,d2,d3,d4,d5,d6,d7,d8)
	// 	throw "?";
	// }
	return loc;
}
//------------------------------------------------------------------------------------------------------------------------------------------------- interpolation - 3D
Code.findExtrema3DVolume = function(volume, wid,hei){ // list of 2D images
	var list = [];
	var i, j, k, v, len=volume.length;
	var wm1 = wid-1;
	var hm1 = hei-1;
	var lm1 = len-1;
	for(k=1; k<lm1; ++k){ // brute force extrema checking
		for(j=1; j<hm1; ++j){
			for(i=1; i<wm1; ++i){
				var isExtrema = Code.isExtrema3D(volume,wid,hei,i,j,k);
				if(isExtrema){
					// console.log("isExtrema: "+i+","+j+","+k)
					var point = Code.extrema3DInterpolateRecursive(volume,wid,hei,i,j,k);
					if(point){
						list.push(point);
					}
				}
			}
		}
	}
	return list;
}

Code.extrema3DInterpolateRecursive = function(volume, wid,hei, inI,inJ,inK){
	var currentStep = 10;
	var i = inI;
	var j = inJ;
	var k = inK;
	var len = volume.length;
	var wm1 = wid-1;
	var hm1 = hei-1;
	var lm1 = len-1;
	var a0,a1,a2,a3,a4,a5,a6,a7,a8, b0,b1,b2,b3,b4,b5,b6,b7,b8, c0,c1,c2,c3,c4,c5,c6,c7;
	var jW0,jW1,jW2, i0,i1,i2;
	var a,b,c;
	while(currentStep>=0){
		--currentStep;
		a = volume[k-1];
		b = volume[k+0];
		c = volume[k+1];
		jW0 = (j-1)*wid, jW1 = j*wid, jW2 = (j+1)*wid;
		i0 = i-1; i1 = i; i2 = i+1;
		a0 = a[jW0+i0]; a1 = a[jW0+i1]; a2 = a[jW0+i2]; a3 = a[jW1+i0]; a4 = a[jW1+i1]; a5 = a[jW1+i2]; a6 = a[jW2+i0]; a7 = a[jW2+i1]; a8 = a[jW2+i2];
		b0 = b[jW0+i0]; b1 = b[jW0+i1]; b2 = b[jW0+i2]; b3 = b[jW1+i0]; b4 = b[jW1+i1]; b5 = b[jW1+i2]; b6 = b[jW2+i0]; b7 = b[jW2+i1]; b8 = b[jW2+i2];
		c0 = c[jW0+i0]; c1 = c[jW0+i1]; c2 = c[jW0+i2]; c3 = c[jW1+i0]; c4 = c[jW1+i1]; c5 = c[jW1+i2]; c6 = c[jW2+i0]; c7 = c[jW2+i1]; c8 = c[jW2+i2];
		var offset = Code.extrema3DInterpolate(new V4D(),a1,a3,a4,a5,a7, b0,b1,b2,b3,b4,b5,b6,b7,b8, c1,c3,c4,c5,c7);
		if(!offset){
			return null;
		}
		if( Math.abs(offset.x)<0.5 && Math.abs(offset.y)<0.5 && Math.abs(offset.z)<0.5){ // found it
			offset.x += i;
			offset.y += j;
			offset.z += k;
			return offset;
		}else{ // need to continue
			i += Math.floor(offset.x + 0.5);
			j += Math.floor(offset.y + 0.5);
			k += Math.floor(offset.z + 0.5);
			if(i<1 || i>=wm1 || j<1 || j>=hm1 || k<1 || k>=lm1){ // outside limits - need to bail
				break;
			}
		}
	} // fail by iteration maxima
	// return null;
	// b4 = volume[inK][inJ*wid+inI];
	return new V4D(inI,inJ,inK, b4);
}
Code.isExtrema3D = function(volume, wid,hei, i,j,k, simple){
	var a0,a1,a2,a3,a4,a5,a6,a7,a8, b0,b1,b2,b3,b4,b5,b6,b7,b8, c0,c1,c2,c3,c4,c5,c6,c7;
	var jW0,jW1,jW2, i0,i1,i2, result;
	var isMaxima = false;
	var isMinima = false;
	var a = volume[k-1];
	var b = volume[k+0];
	var c = volume[k+1];
	i0 = i-1; i1 = i; i2 = i+1;
	jW0 = (j-1)*wid, jW1 = j*wid, jW2 = (j+1)*wid;
	a0 = a[jW0+i0]; a1 = a[jW0+i1]; a2 = a[jW0+i2]; a3 = a[jW1+i0]; a4 = a[jW1+i1]; a5 = a[jW1+i2]; a6 = a[jW2+i0]; a7 = a[jW2+i1]; a8 = a[jW2+i2];
	b0 = b[jW0+i0]; b1 = b[jW0+i1]; b2 = b[jW0+i2]; b3 = b[jW1+i0]; b4 = b[jW1+i1]; b5 = b[jW1+i2]; b6 = b[jW2+i0]; b7 = b[jW2+i1]; b8 = b[jW2+i2];
	c0 = c[jW0+i0]; c1 = c[jW0+i1]; c2 = c[jW0+i2]; c3 = c[jW1+i0]; c4 = c[jW1+i1]; c5 = c[jW1+i2]; c6 = c[jW2+i0]; c7 = c[jW2+i1]; c8 = c[jW2+i2];
	/*
	if(simple===true){
		isMaxima = b3<b4&&b5<b4 && b1<b4&&b7<b4 && a4<b4&&c4<b4;
		isMinima = b3>b4&&b5>b4 && b1>b4&&b7>b4 && a4>b4&&c4>b4;
	}else{
		isMaxima = (a0<b4&&a1<b4&&a2<b4&&a3<b4&&a4<b4&&a5<b4&&a6<b4&&a7<b4&&a8<b4 // maxima
				 && b0<b4&&b1<b4&&b2<b4&&b3<b4    &&   b5<b4&&b6<b4&&b7<b4&&b8<b4
				 && c0<b4&&c1<b4&&c2<b4&&c3<b4&&c4<b4&&c5<b4&&c6<b4&&c7<b4&&c8<b4);
		isMinima = (a0>b4&&a1>b4&&a2>b4&&a3>b4&&a4>b4&&a5>b4&&a6>b4&&a7>b4&&a8>b4 // minima
				 && b0>b4&&b1>b4&&b2>b4&&b3>b4    &&   b5>b4&&b6>b4&&b7>b4&&b8>b4
				 && c0>b4&&c1>b4&&c2>b4&&c3>b4&&c4>b4&&c5>b4&&c6>b4&&c7>b4&&c8>b4);
	}
	if(isMaxima || isMinima){
		return true;
	}
	return false;
	*/
	if(b4>=0){ // maxima
		isMaxima = (a0<=b4&&a1<=b4&&a2<=b4&&a3<=b4&&a4<=b4&&a5<=b4&&a6<=b4&&a7<=b4&&a8<=b4
				 && b0<=b4&&b1<=b4&&b2<=b4&&b3<=b4    &&   b5<=b4&&b6<=b4&&b7<=b4&&b8<=b4
				 && c0<=b4&&c1<=b4&&c2<=b4&&c3<=b4&&c4<=b4&&c5<=b4&&c6<=b4&&c7<=b4&&c8<=b4);
		return isMaxima;
	}else{
		isMinima = (a0>=b4&&a1>=b4&&a2>=b4&&a3>=b4&&a4>=b4&&a5>=b4&&a6>=b4&&a7>=b4&&a8>=b4 // minima
				 && b0>=b4&&b1>=b4&&b2>=b4&&b3>=b4    &&   b5>=b4&&b6>=b4&&b7>=b4&&b8>=b4
				 && c0>=b4&&c1>=b4&&c2>=b4&&c3>=b4&&c4>=b4&&c5>=b4&&c6>=b4&&c7>=b4&&c8>=b4);
		return isMinima;
	}
}

Code.findExtrema3D = function(a,b,c, wid,hei, k, simple){ // a=-1, b=0, c=+1
	k = k!==undefined ? k : 0;
	var i, j, hm1=hei-1, wm1=wid-1, list=[];
	var a0,a1,a2,a3,a4,a5,a6,a7,a8, b0,b1,b2,b3,b4,b5,b6,b7,b8, c0,c1,c2,c3,c4,c5,c6,c7;
	var jW0,jW1,jW2, i0,i1,i2, result;
	for(j=1;j<hm1;++j){
		jW0 = (j-1)*wid, jW1 = j*wid, jW2 = (j+1)*wid;
		for(i=1;i<wm1;++i){
			i0 = i-1; i1 = i; i2 = i+1;
			a0 = a[jW0+i0]; a1 = a[jW0+i1]; a2 = a[jW0+i2]; a3 = a[jW1+i0]; a4 = a[jW1+i1]; a5 = a[jW1+i2]; a6 = a[jW2+i0]; a7 = a[jW2+i1]; a8 = a[jW2+i2];
			b0 = b[jW0+i0]; b1 = b[jW0+i1]; b2 = b[jW0+i2]; b3 = b[jW1+i0]; b4 = b[jW1+i1]; b5 = b[jW1+i2]; b6 = b[jW2+i0]; b7 = b[jW2+i1]; b8 = b[jW2+i2];
			c0 = c[jW0+i0]; c1 = c[jW0+i1]; c2 = c[jW0+i2]; c3 = c[jW1+i0]; c4 = c[jW1+i1]; c5 = c[jW1+i2]; c6 = c[jW2+i0]; c7 = c[jW2+i1]; c8 = c[jW2+i2];
			var isMaxima = false;
			var isMinima = false;
			if(simple===true){
				isMaxima = b3<b4&&b5<b4 && b1<b4&&b7<b4 && a4<b4&&c4<b4;
				isMinima = b3>b4&&b5>b4 && b1>b4&&b7>b4 && a4>b4&&c4>b4;
			}else{
				isMaxima = (a0<b4&&a1<b4&&a2<b4&&a3<b4&&a4<b4&&a5<b4&&a6<b4&&a7<b4&&a8<b4 // maxima
						 && b0<b4&&b1<b4&&b2<b4&&b3<b4    &&   b5<b4&&b6<b4&&b7<b4&&b8<b4
						 && c0<b4&&c1<b4&&c2<b4&&c3<b4&&c4<b4&&c5<b4&&c6<b4&&c7<b4&&c8<b4);
				isMinima = (a0>b4&&a1>b4&&a2>b4&&a3>b4&&a4>b4&&a5>b4&&a6>b4&&a7>b4&&a8>b4 // minima
						 && b0>b4&&b1>b4&&b2>b4&&b3>b4    &&   b5>b4&&b6>b4&&b7>b4&&b8>b4
						 && c0>b4&&c1>b4&&c2>b4&&c3>b4&&c4>b4&&c5>b4&&c6>b4&&c7>b4&&c8>b4);
			}
			if(isMaxima || isMinima){
				result = Code.extrema3DInterpolate(new V4D(),a1,a3,a4,a5,a7, b0,b1,b2,b3,b4,b5,b6,b7,b8, c1,c3,c4,c5,c7);
				if(Math.abs(result.x)<1.0 && Math.abs(result.y)<1.0 && Math.abs(result.z)<1.0){ // inside window
					result.x += i; result.y += j; result.z += k;
					list.push(result);
				}else{ // need to interpolate at a neighbor
					result = new V4D(i,j,k,b4);
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

// ------------------------------------------------------------------------------------------------------------------------------------- gb------------ SINGLE-FUNCTION INTERPOLATION
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
	return new V3D( a.x+t2*baX, a.y+t2*baY, t2);
}

Code.rayLineIntersect2D = function(a,b, c,d){ // two infinite lines
	var den = b.y*d.x - b.x*d.y;
	if(den == 0){ return null; } // infinite or zero intersections
	var num = (d.x*(c.y-a.y) + d.y*(a.x-c.x));
	var t = num/den;
	return new V2D(a.x+t*b.x, a.y+t*b.y); // num = (b.x*(c.y-a.y) + b.y*(a.x-c.x)); return new V2D(c.x+t2*d.x, c.y+t2*d.y);
}
Code.rayInfiniteIntersect2D = function(a,b, c,d){ // intersections of two infinite rays
	var den = b.y*d.x - b.x*d.y;
	if(den == 0){ return null; }
	var num1 = (d.x*(c.y-a.y) + d.y*(a.x-c.x));
	var num2 = (b.x*(c.y-a.y) + b.y*(a.x-c.x));
	var t1 = num1/den;
	return new V2D(a.x+t1*b.x, a.y+t1*b.y);
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
Code.rayFiniteInfiniteIntersect2D = function(a,b, c,d){ // finite ray and infinite ray
	var den = b.y*d.x - b.x*d.y;
	if(den == 0){ return null; }
	var num1 = (d.x*(c.y-a.y) + d.y*(a.x-c.x));
	var num2 = (b.x*(c.y-a.y) + b.y*(a.x-c.x));
	var t1 = num1/den;
	// var t2 = num2/den;
	if(t1>=0 && t1<=1.0){
		return new V2D(a.x+t1*b.x, a.y+t1*b.y);
	}
	return null;
}
Code.closestPointLine2D = function(org,dir, point){ // infinite ray and point
	var bot = V2D.dot(dir,dir);
	if(bot==0){
		return new V2D(point.x,point.y);
	}
	var t = (V2D.dot(dir,point)-V2D.dot(org,dir))/bot;
	return new V2D(org.x+t*dir.x,org.y+t*dir.y);
}
Code.distancePointRay2D = function(org,dir, point){ // point and RAY
	var p = Code.closestPointLine2D(org,dir, point);
	return V2D.distance(point,p);
}
// Code.distancePointLine2D_ = function(a,b, point){ // point and RAY
// 	var dir = V2D.sub(b,a);
// 	return Code.distancePointRay2D(a,dir, point);
// }
Code.distancePointRayFinite2D = function(org,dir, point){ // point and ray - finite
	var p = Code.closestPointLineSegment2D(org,dir, point);
	return V2D.distance(point,p);
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
Code.clipLine2DToRect = function(org,dir, x,y,w,h){
// Code.clipRayRect2D
	var eps = 1E-6;
	var poly = [new V2D(x,y), new V2D(x+w,y), new V2D(x+w,y+h), new V2D(x,y+h)];
	var inv = dir.copy().scale(-1);
	var ints = [];
	var lines = [];
		lines.push( [poly[0], new V2D(1,0)] );
		lines.push( [poly[1], new V2D(0,1)] );
		lines.push( [poly[2], new V2D(-1,0)] );
		lines.push( [poly[3], new V2D(0,-1)] );
	for(var i=0; i<lines.length; ++i){
		var o = lines[i][0];
		var d = lines[i][1];
		var intersection = Code.rayLineIntersect2D(org,dir, o,d);
		if(intersection){
			//if(Code.isPointInsidePolygon2D(intersection, poly)){
			if(x-eps<=intersection.x && intersection.x<=x+w+eps && y-eps<=intersection.y && intersection.y<=y+h+eps){
				ints.push(intersection);
			}
		}
	}
	return ints;
}

/*
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

*/
Code.parabolaABCFromFocusDirectrix = function(focA,c){ // ax^2 + bx + c
	var a = focA.x, b = focA.y;
	var A = 1/(2.0*(b-c));
	var B = -2.0*a*A;
	var C = (a*a + b*b - c*c)*A;
	return {"a":A,"b":B,"c":C};
}
Code.parabolaFocusDirectrixFromABC = function(A,B,C){
	if(A==0){ return null; }
	var h = -0.5*B/A;
	var k = A*h*h + B*h + C;
	var p = 0.25/A;
	return {"focus":new V2D(h,k+p), "directrix":k-p};
}
Code.parabolaABCFromPoints = function(x1,y1, x2,y2, x3,y3){
	var den = (x1-x2)*(x1-x3)*(x2-x3);
	var a = (x3*(y2-y1) + x2*(y1-y3) + x1*(y3-y2))/den;
	var b = (x3*x3*(y1-y2) + x2*x2*(y3-y1) + x1*x1*(y2-y3))/den;
	var c = (x2*x3*(x2-x3)*y1 + x3*x1*(x3-x1)*y2 + x1*x2*(x1-x2)*y3)/den;
	//Code.inverse3x3(arr, a,b,c,d,e,f,g,h,i);
	return {"a":a,"b":b,"c":c};
}
Code.parabolaVertexFromABC = function(a,b,c){ // peak/min
	var parabola = Code.parabolaFocusDirectrixFromABC(a,b,c);
	var focus = parabola["focus"];
	var x = focus.x;
	var y = a*x*x + b*x + c;
	return new V2D(x, y);
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
Code.isPointAboveParabola = function(focus,directrix, point){
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
Code.convexHull = function(pointList){ // V2D point list
	pointList = Code.copyArray(pointList);
	if(pointList.length<3){
		return pointList;
	}
	pointList.sort(function(a,b){ // sort on lower x & lower y
		if(a.x<b.x){
			return -1;
		}else if(a.x>b.x){
			return 1;
		}else if(a.y<b.y){
			return -1;
		}else if(a.y>b.y){
			return 1;
		}else{
			return 0;
		}
	});
	// bottom
	var bot = [];
	for(var i=0; i<pointList.length; ++i){
		var point = pointList[i];
		while(bot.length>=2 && V2D.crossOrigin(point,bot[bot.length-2],bot[bot.length-1]) <= 0){
			bot.pop();
		}
		bot.push(point);
	}
	// top
	var top = [];
	for(var i=pointList.length-1; i>=0; --i){
		var point = pointList[i];
		while(top.length>=2 && V2D.crossOrigin(point,top[top.length-2],top[top.length-1]) <= 0){
			top.pop();
		}
		top.push(point);
	}
	bot.pop();
	top.pop();
	Code.arrayPushArray(bot,top);
	return bot;
}
Code.minRect = function(pointList){ // minimum area rectangle / bounding box for convex hull : V2D list - exhaustive O(n^2) -- todo: rotating calipers
	if(pointList.length<3){
		return null;
	} // rotate for each edge & record area
	var bestArea = null;
	var bestAngle = null;
	var bestWidth = null;
	var bestHeight= null;
	var bestCorner = new V2D();
	var p = new V2D();
	var len = pointList.length;
	for(var i=0; i<len; ++i){
		var pointA = pointList[i];
		var pointB = pointList[(i+1)%len];
		var angle = Math.atan2(pointB.y-pointA.y,pointB.x-pointA.x);
		var minX = null;
		var minY = null;
		var maxX = null;
		var maxY = null;
		for(var j=0; j<len; ++j){
			p.set(pointList[j]);
			p.rotate(-angle);
			if(j==0){
				minX = p.x;
				minY = p.y;
				maxX = p.x;
				maxY = p.y;
			}else{
				minX = Math.min(minX,p.x);
				minY = Math.min(minY,p.y);
				maxX = Math.max(maxX,p.x);
				maxY = Math.max(maxY,p.y);
			}
		}
		var w = maxX-minX;
		var h = maxY-minY;
		var area = w*h;
		if(bestArea===null || bestArea>area){
			bestArea = area;
			bestAngle = angle;
			bestWidth = w;
			bestHeight = h;
			bestCorner.set(minX,minY);
			bestCorner.rotate(angle);
		}
	}
	return {"origin":bestCorner, "width":bestWidth, "height":bestHeight, "angle":bestAngle, "area":bestArea};
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- CIRCLES
Code.colinear = function(a,b,c){
	var EPSILON = 1E-12;
	var OME = 1.0 - EPSILON;
	var ab = V2D.sub(b,a);
	var bc = V2D.sub(c,b);
	var ca = V2D.sub(a,c);
	ab.norm();
	bc.norm();
	ca.norm();
	var dot1 = V2D.dot(ab,bc);
	var dot2 = V2D.dot(bc,ca);
	var dot3 = V2D.dot(ca,ab);
	dot1 = Math.abs(dot1);
	dot2 = Math.abs(dot2);
	dot3 = Math.abs(dot3);
	if(dot1>=OME || dot2>=OME || dot3>=OME ){
		return true;
	}
	return false;
}
Code.circleClosestPointToPoint = function(center,radius, point){
	var d = V2D.sub(point,center);
	var distance = d.length();
	if(distance==0){
		return null // entire circle is solution
	}
	d.scale(radius/distance);
	d.add(center);
	return d;
}
Code.circleDistanceToPoint = function(center,radius, point){
	var distance = V2D.distance(point,center);
	if(distance<radius){
		return radius-distance;
	}
	return distance-radius;
}
Code.sphereDistanceToPoint = function(center,radius, point){
	var distance = V3D.distance(point,center);
	if(distance<radius){
		return radius-distance;
	}
	return distance-radius;
}
Code.circleFromPoints = function(a,b,c){
	if(Code.colinear(a,b,c)){
		return null;
	}
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

Code.circleCoefficientsToCircle = function(a,b1,b2,c){
	var center = new V2D(b1,b2).scale(-1.0/(2.0*a));
	var bSq = b1*b1 + b2*b2;
	var left = bSq/(4.0*a*a);
	var right = c/a;
	var inside = left - right
	var radius = Math.sqrt(inside);
	return {"radius":radius,"center":center};
}
Code.circleAlgebraic = function(points, location){
	var N = points.length;
	var W = null;
	var weights = null;
	var i, p;
	// W
	if(location){
		var distanceTotal = 0;
		weights = [];
		for(i=0; i<N; ++i){
			p = points[i];
			var dist = V3D.distance(location,p);
			distanceTotal += dist;
			weights[i] = dist;
		}
		for(i=0; i<N; ++i){
			p = points[i];
			var dist = weights[i];
			// var dist = V2D.distance(location,p);
			// var weight = 1.0/(1.0 + dist*dist);
			//var weight = Math.exp(-dist*dist);
			//weight = Math.pow(weight,2);
			//weight = Math.pow(dist,-2);
// TODO: PICK A WEIGHT
			var weight = Math.exp(-dist);
			// weights.push(weight);
			weights[i] = weight;
		}
		W = new Matrix(N,N);
		for(i=0; i<N; ++i){
			var weight = weights[i];
			W.set(i,i, weight);
		}
	}
	// A
	var A = new Matrix(N,4);
	for(i=0; i<N; ++i){
		p = points[i];
		A.set(i,0, V2D.dot(p,p));
		A.set(i,1, p.x);
		A.set(i,2, p.y);
		A.set(i,3, 1);
	}
	if(W!=null){
		A = Matrix.mult(W,A);
	}
	// SVD projection closest
	var svd = Matrix.SVD(A);
	var best = svd.V.colToArray(3);
	var a = best[0];
	var b1 = best[1];
	var b2 = best[2];
	var c = best[3];

	if(a===0){
		return null;
	}
	var circle = Code.circleCoefficientsToCircle(a,b1,b2,c);
	circle["weights"] = weights;
	return circle;
}
Code._circleGeometricGD = function(args,vals, isUpdate){
	if(isUpdate){ return; }
	var points = args[0];
	var weights = args[1];
	var cx = vals[0];
	var cy = vals[1];
	var rad = vals[2];
	var cen = new V2D(cx,cy);
	var error = 0;
	var weight = 1.0;
	for(var i=0; i<points.length; ++i){
		var p = points[i];
		var dist = Code.circleDistanceToPoint(cen,rad,p);
		if(weights){
			weight = weights[i];
		}
		error += weight * dist*dist;
	}
	return error;
}
Code.circleGeometric = function(points, location, maxIterations){
	maxIterations = maxIterations!==undefined ? maxIterations : 50;
	var circle = Code.circleAlgebraic(points, location);
	if(!circle){ // plane:
		// TODO: 2D-LINE  FROM POINTS:
		// var pts3D = [];
		// for(var i=0; i<points.length; ++i){
		// 	pts3D[i] = new V2D(points[i].x,points[i].y, 0);
		// }
		// var location3D = new V3D(location.x,location.y, 0);
		// console.log(location3D, pts3D);
		//var plane = Code.planeFromPoints(location3D, pts3D);
		var plane = Code.planeFromPoints2D(location, points);
		return plane;
	}
	var weights = circle["weights"];
	var center = circle["center"];
	var radius = circle["radius"];
	var result = Code.gradientDescent(Code._circleGeometricGD, [points, weights], [center.x,center.y,radius], null, maxIterations, 1E-8);
	var x = result["x"];
	center = new V2D(x[0],x[1]);
	radius = x[2];
	return {"center":center, "radius":radius, "weights":weights};
}

Code.sphereFromPoints = function(a,b,c,d){ // ~95+s% accurate
	// var i;
	// if(Code.coplanar(a,b,c,d)){
	// 	return null;
	// }
	var AB = V3D.sub(b,a);
	// var AC = V3D.sub(c,a);
	// var AD = V3D.sub(d,a);
	var BC = V3D.sub(c,b);
	//var BD = V3D.sub(d,b);
	var CD = V3D.sub(d,c);
	var dotA = V3D.dot(a,a);
	var dotB = V3D.dot(b,b);
	var dotC = V3D.dot(c,c);
	var dotD = V3D.dot(d,d);
	// ...
	var A = new Matrix(3,3);
	A.fromArray([AB.x,AB.y,AB.z, BC.x,BC.y,BC.z, CD.x,CD.y,CD.z]);
	var B = new Matrix(3,1);
	B.set(0,0, (dotA-dotB)*0.5);
	B.set(1,0, (dotB-dotC)*0.5);
	B.set(2,0, (dotC-dotD)*0.5);
	var invA = Matrix.inverse(A);
	var X = Matrix.mult(invA,B);
	console.log(X);
	X = X.toArray();
	var center = new V3D(X[0],X[1],X[2]);
	var radius = V3D.sub(a,center).length();
	center.scale(-1);
	radius = Math.sqrt(radius);
	return {"radius":radius, "center":center};
}
Code.sphereCoefficientsToSphere = function(a,b1,b2,b3,c){
	var center = new V3D(b1,b2,b3).scale(-1.0/(2.0*a));
	var left = V3D.dot(center,center);
	var right = c/a;
	var inside = left - right
	var radius = Math.sqrt(inside);
	return {"radius":radius,"center":center};
}

Code.sphereAlgebraic = function(points, location){
	var N = points.length;
	var W = null;
	var weights = null;
	var i, p;
	// W
	// if(false){
	if(location){
		var distanceTotal = 0;
		weights = [];
		for(i=0; i<N; ++i){
			p = points[i];
			var dist = V3D.distance(location,p);
			distanceTotal += dist;
			weights[i] = dist;
		}
		var distanceAverage = distanceTotal/N;
		var sigma = Code.stdDev(weights,distanceAverage);
		// var bot = distanceAverage*distanceAverage;
		var bot = sigma*sigma;
		for(i=0; i<N; ++i){ // gaussian weight
			var dist = weights[i];
			// var weight = Math.exp(-dist/distanceAverage);
			// var weight = Math.exp(-dist/(distanceAverage*distanceAverage));
			//var weight = 1.0/(1.0 + dist*dist);
// weight = 1.0;
			//var weight = Math.exp(-dist/distanceAverage);
			var top = dist*dist;
			var weight = Math.exp(-top/bot);
			weights[i] = weight;
		}
		W = new Matrix(N,N);
		for(i=0; i<N; ++i){
			var weight = weights[i];
			W.set(i,i, weight);
		}
	}
	// A
	var A = new Matrix(N,5);
	for(i=0; i<N; ++i){
		p = points[i];
		A.set(i,0, V3D.dot(p,p));
		A.set(i,1, p.x);
		A.set(i,2, p.y);
		A.set(i,3, p.z);
		A.set(i,4, 1);
	}
	if(W!=null){
		A = Matrix.mult(W,A);
	}
	// SVD projection closest
	var svd = Matrix.SVD(A);
	var best = svd.V.colToArray(4);
	var a = best[0];
	var b1 = best[1];
	var b2 = best[2];
	var b3 = best[3];
	var c = best[4];
// console.log(best);
	if(a===0){ // plane
		// console.log("PLANE");
		var plane = Code.planeFromPoints(location, points, weights);
		return plane;
	}
	var sphere = Code.sphereCoefficientsToSphere(a,b1,b2,b3,c);
	sphere["weights"] = weights;
	return sphere;
}


Code._sphereGeometricGD = function(args,vals, isUpdate){
	if(isUpdate){ return; }
	var points = args[0];
	var weights = args[1];
	var cx = vals[0];
	var cy = vals[1];
	var cz = vals[2];
	var rad = vals[3];
	var cen = new V3D(cx,cy,cz);
	var error = 0;
	var weight = 1.0;
	for(var i=0; i<points.length; ++i){
		var p = points[i];
		var dist = Code.sphereDistanceToPoint(cen,rad,p);
		if(weights){
			weight = weights[i];
		}
		error += weight * dist*dist;
	}
	return error;
}
Code.sphereGeometric = function(points, location, maxIterations){
	maxIterations = maxIterations!==undefined ? maxIterations : 50;
	var sphere = Code.sphereAlgebraic(points, location);
	if(!sphere){
		console.log("what ?");
		return null;
	}
	var center = sphere["center"];
	if(!center){ // plane
		return sphere;
	}
	var weights = sphere["weights"];
	var radius = sphere["radius"];
	var result = Code.gradientDescent(Code._sphereGeometricGD, [points, weights], [center.x,center.y,center.z,radius], null, maxIterations, 1E-8);
	var x = result["x"];
	center = new V3D(x[0],x[1],x[2]);
	radius = x[3];
	return {"center":center, "radius":radius, "weights":weights};
}



Code.interpolateP2D = function(pointX, pointsA, pointsB, weights){ // TODO: convex hull outside closest point => weight = 1
// weights = null;
	var x = pointX;
	var scale = 0.0;
	var position = new V2D();
	var centerA = new V2D();
	var centerB = new V2D();
	var percent = 1.0 / pointsA.length;
	var w = percent;
	for(var i=0; i<pointsA.length; ++i){
		if(weights){
			w = weights[i];
		}
		var a = pointsA[i];
		var b = pointsB[i];
		centerA.add(w*a.x, w*a.y);
		centerB.add(w*b.x, w*b.y);
	}
// centerA.set(0,0);
// centerB.set(0,0);
// centerA.set(-100,0);
// centerB.set(-100,0);
	// move COM if coincides with  ... hack
	var atCOM = true;
	while(atCOM){
		atCOM = false;
		for(var i=0; i<pointsA.length; ++i){
			var a = pointsA[i];
			var b = pointsB[i];
			if(V2D.distanceSquare(a,centerA)<1E-10){
				centerA.add(1.0,1.0); // ...
				atCOM = true;
				break;
			}
			if(V2D.distanceSquare(b,centerB)<1E-10){
				centerB.add(1.0,1.0); // ...
				atCOM = true;
				break;
			}
		}
	}
	// return the point if at center:
	//
	//
	var position = new V2D();
	var ao = new V2D();
	var bo = new V2D();
	var ax = new V2D();
	var bx = new V2D();
	var p1 = new V2D();
	var t1 = new V2D();
	var p2 = new V2D();
	var t2 = new V2D();
	var w = percent;
	for(var i=0; i<pointsA.length; ++i){
		if(weights){
			w = weights[i];
		}
		var a = pointsA[i];
		var b = pointsB[i];
		V2D.sub(ao, centerA,a);
		V2D.sub(bo, centerB,b);
		V2D.sub(ax, x,a);
		var scale = 1.0;
		var lenAX = ax.length();
		var lenAO = ao.length();
		var lenBO = bo.length();
		if(lenAX<1E-10){
			return b.copy();
		}
		if(lenAO<1E-10){ // basically at center
			t1.set(0,0);
			p1.set(ax.x/lenAX,ax.y/lenAX);
		}else{
			t1.set(ao.x/lenAO,ao.y/lenAO);
			V2D.rotate(p1, t1,Math.PI*0.5);
			if(lenBO>1E-10){
				scale = lenBO/lenAO;
			} // else scale = 1.0
		}
		var sizeT = V2D.dot(ax,t1);
		var sizeP = V2D.dot(ax,p1);
		if(lenBO<1E-10){
			t2.set(0,0);
			p2.set(ax.x/lenAX,ax.y/lenAX);
		}else{
			t2.set(bo.x/lenBO,bo.y/lenBO);
			V2D.rotate(p2, t2, Math.PI*0.5);
		}
		bx.set((p2.x*sizeP+t2.x*sizeT)*scale,(p2.y*sizeP+t2.y*sizeT)*scale);
		position.add((b.x+bx.x)*w,(b.y+bx.y)*w);
	}
	return position;
}





// ------------------------------------------------------------------------------------------------------------------------------------------------- INTERSECTIONS 3D
Code.closestPointTLine3D = function(org,dir, point){ // infinite ray and point - t value
	return (V3D.dot(dir,point)-V3D.dot(org,dir))/V3D.dot(dir,dir);
}
Code.closestPointLine3D = function(org,dir, point){ // infinite ray and point
	var t = (V3D.dot(dir,point)-V3D.dot(org,dir))/V3D.dot(dir,dir);
	return new V3D(org.x+t*dir.x,org.y+t*dir.y,org.z+t*dir.z);
}
Code.distancePointLine3D = function(org,dir, point){ // finite ray and point --- distancePointRayFinite3D
	var closest = Code.closestPointLine3D(org,dir, point);
	return V3D.distance(point, closest);
}
Code.distancePointRayFinite3D = Code.distancePointLine3D; // NOT TRUE ?
Code.closestPointLineSegment3D = function(org,dir, point){ // finite ray and point
	var t = (V3D.dot(dir,point)-V3D.dot(org,dir))/V3D.dot(dir,dir);
	if(t<=0){
		return new V3D(org.x,org.y,org.z);
	}else if(t>=1){
		return new V3D(org.x+dir.x,org.y+dir.y,org.z+dir.z);
	}
	return new V3D(org.x+t*dir.x,org.y+t*dir.y,org.z+t*dir.z);
}
Code.intersectRayPlaneFinite = function(org,dir, pnt,nrm){
	return Code.intersectRayPlane(org,dir, pnt,nrm, 1);
}
Code.intersectRayPlane = function(org,dir, pnt,nrm, limit){ // infinite ray - plane intersection
	var num = nrm.x*(pnt.x-org.x) + nrm.y*(pnt.y-org.y) + nrm.z*(pnt.z-org.z);
	if(num==0){ return (new V3D()).copy(org); } // point is already in plane (first of possibly infinite intersections)
	var den = nrm.x*dir.x + nrm.y*dir.y + nrm.z*dir.z;
	if(den==0){ return null; } // zero or infinite intersections
	var t = num/den;
	if(limit===1){
		if(t<0 || t>1.0){
			return false;
		}
	}
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
Code.intersectRayDisk = function(org,dir, cen,nrm,rad){ // finite ray - circular-plane intersection [splat / surfel / disk]
	var intersection = Code.intersectRayPlaneFinite(org,dir, cen,nrm);
	if(intersection){
		var d = V3D.distance(intersection,cen); // distanceSquare
		if(d<rad){
			return intersection;
		}
	}
	return null;
}
Code.rayFromPointPerimeter = function(points,hull,forSite){
	var rays = [];
	if(hull.length>1){
		for(i=0; i<=hull.length; ++i){
			var site = hull[ i%hull.length ];
			var prev = hull[ (i-1+hull.length)%hull.length ];
			var next = hull[ (i+1)%hull.length ];
			var sitePoint = points[site];
			var prevPoint = points[prev];
			var nextPoint = points[next];
			var v1 = V2D.sub(sitePoint,prevPoint);
				v1.norm();
			var v2 = V2D.sub(sitePoint,nextPoint);
				v2.norm();
			var angle = V2D.angleDirection(v2,v1) * 0.5;
			var ray = V2D.rotate(v2.copy(),angle);
			if(forSite){
				rays[site] = ray;
			}else{
				rays[i] = ray;
			}
		}
	}
	return rays;
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
Code.intersectRayCircle2D = function(org,dir, cen,rad){ // infinite ray & circle
	var a = dir.x*dir.x + dir.y*dir.y;
	var b = 2*(dir.x*org.x + dir.y*org.y - dir.x*cen.x - dir.y*cen.y);
	var c = org.x*org.x + org.y*org.y + cen.x*cen.x + cen.y*cen.y - 2*(org.x*cen.x + org.y*cen.y) - rad*rad;
	var r = Code.quadraticSolution(a,b,c);
	if(r===null){ // imaginary / no
		return null;
	}
	if(r.length==2){
		a = r[0];
		b = r[1];
		if(a!=b){
			a = new V2D(org.x + a*dir.x, org.y + a*dir.y);
			b = new V2D(org.x + b*dir.x, org.y + b*dir.y);
			return [a, b];
		} // continue to returning non-repeated solution
	}
	r = r[0];
	return [new V2D(org.x + r*dir.x, org.y + r*dir.y)];
}
Code.intersectRayCircle2DBoolean = function(org,dir, cen,rad){ // infinite ray & circle checker
	var p = closestPointLine2D(org,dir, cen);
	if(p){
		p = V2D.distanceSquare(p,cen);
		if(p<=rad*rad){
			return true;
		}
	}
	return false;
}

Code.intersectFiniteRayCircle2DBoolean = function(org,dir, cen,rad){ // infinite ray & circle checker
	var p = closestPointLineSegment2D(org,dir, cen);
	if(p){
		// let oToP = V2D.sub(p, org);
		// let lenDir = dir.length();
		// let dot = V2D.dot(direction, oToP)/(lenDir*lenDir);
		// if(dot<0.0 || dot>1.0){ // outside finite ray size
		// 	return false
		// }
		p = V2D.distanceSquare(p,cen);
		if(p<=rad*rad){
			return true;
		}
	}
	return false;
}
Code.intersectRaySphere3D = function(org,dir, cen,rad){ // infinite ray & sphere
	var a = dir.x*dir.x + dir.y*dir.y+ dir.z*dir.z;
	var b = 2*(dir.x*org.x + dir.y*org.y + dir.z*org.z - dir.x*cen.x - dir.y*cen.y - dir.z*cen.z);
	var c = org.x*org.x + org.y*org.y + org.z*org.z + cen.x*cen.x + cen.y*cen.y + cen.z*cen.z - 2*(org.x*cen.x + org.y*cen.y + org.z*cen.z) - rad*rad;
	var r = Code.quadraticSolution(a,b,c);
	if(r===null){ // imaginary / no
		return null;
	}
	for(var i=0; i<r.length; ++i){
		var t = r[i];
		r[i] = new V2D(org.x + t*dir.x, org.y + t*dir.y, org.z + t*dir.z)
	}
	return r;
}

Code.pointInsideCone3DBoolean = function(cen,dir,ratio, point){
	var p = V3D.sub(point,cen);
	var dot = V3D.dot(p,dir);
	if(dot<0){ // negative direction
		return false;
	}
	var perp = V3D.perpendicularComponent(dir,p);
	var para = V3D.sub(p,perp);
	var rise = perp.length();
	var run = para.length();
	if(rise>dir.length()){ // too far out
		return false;
	}
	if(run==0){
		return true;
	}
	var rr = rise/run;
	return rr <= ratio;
}
Code.sphereInsideCone3DBoolean = function(cen,dir,ratio, sph,rad){ // any part of sphere touches/inside/ovarlap cone
	var p = V3D.sub(sph,cen);
	if(p.length()<=rad){ // near vertex
		return true;
	}
	// offset-cone-body
	var dirLength = dir.length();
	var unitDir = dir.copy().scale(1.0/dirLength);
	var ang = Math.atan(ratio);
	// var cos = Math.cos(ang);
	var sin = Math.sin(ang);
	var mild = sin*rad; // small offset for cap end
	var medium = rad/sin; // large offset for origin offset
	var offA = medium - mild;
	var offB = offA + dirLength;
	var cen2 = unitDir.copy().scale(-medium).add(cen);
	// point inside cone && parallel is between off2 & off3
	var p2 = V3D.sub(sph,cen2);
	var dot = V3D.dot(p2,unitDir);
	if(dot<offA){ // too far back
		return false;
	}
	if(dot<offB){ // cone2 interrior
		var para = unitDir.copy().scale(dot);
		var perp = V3D.sub(p2,para);
		var rise = perp.length();
		var run = dot;
		var rr = rise/run;
		if(rr<=ratio){
			return true;
		}
	} // end-plane-cap
	cen2.copy(cen).add(dir);
	var rad2 = ratio*dirLength; // mouth opening : circular plane
	var distance = Code.distancePointPlaneCircular(cen2,unitDir,rad2, sph);
	if(distance<=rad){ // inside cap
		return true;
	} // outside 3 separate objects
	return false;
}
Code.pointInsideCone2DBoolean = function(cen,dir,ratio, point){
	throw "?";
}
Code.circleInsideCone2DBoolean = function(){
	throw "?";
}
Code.distancePointPlaneCircular = function(cen,nor,rad, point){
	var closest = Code.closestPointPlane3D(cen,nor,point);
	var cToC = V3D.sub(closest,cen);
	if(cToC.length()<=rad){ // plane perpendicular
		return V3D.distance(point,closest);
	} // else closest point is on rim
	cToC.length(rad);
	cToC.add(cen);
	return V3D.distance(point,cToC);
}

Code.isCCW = function(a,b,c){
	var ab = V2D.sub(b,a);
	var bc = V2D.sub(c,b);
	//var ca = V2D.sub(a,c);
	var cross = V2D.cross(ab,bc);
	//cross2 = V2D.cross(bc,V2D.sub(orgA,b2));
	//cross3 = V2D.cross(ca,V2D.sub(orgA,c2));
	// strictly inside
	return cross >= 0;
}
Code.convexNeighborhood3D = function(center, points, knn, minNeighborhood){ // points are closest relevant neighbors
	knn = knn!==undefined ? knn : points;
	minNeighborhood = minNeighborhood!==undefined ? minNeighborhood : 5;
	var collection = [];
	var minDistance = null;
	var maxDistance = null;
	for(i=0; i<points.length; ++i){
		var distanceSquare = V3D.distanceSquare(points[i],center);
		collection[i] = {"source":knn[i], "point":points[i], "distance":distanceSquare};
		if(minDistance==null || minDistance>distanceSquare){
			minDistance = distanceSquare;
		}
		if(maxDistance==null || maxDistance<distanceSquare){
			maxDistance = distanceSquare;
		}
	}
	collection = collection.sort(function(a,b){
		return a["distance"] < b["distance"] ? -1 : 1;
	});
	// remove all points~@ center for more circular neighborhood
	var centerRemoved = [];
	var minDistanceEquality = maxDistance!==null ? (minDistance+maxDistance)*0.5 * 0.01 : 0.0; // 1/10th the average size
	while(collection.length>0 && collection[0]["distance"]<=minDistanceEquality){
		centerRemoved.push( collection[0] );
		collection.shift();
	}
	var halfPlaneInfo = Code.halfPlaneSubsetPoints3D(center, collection, "point");
	var halfPlaneKeep = halfPlaneInfo["yes"];
	var halfPlaneDrop = halfPlaneInfo["no"];
	var neighborhood = [];
	// middle points
	for(i=0; i<centerRemoved.length; ++i){
		neighborhood.push(centerRemoved[i]["source"]);
	}
	// half plane points
	for(i=0; i<halfPlaneKeep.length; ++i){
		neighborhood.push(halfPlaneKeep[i]["source"]);
	}
	// necessary extras
	for(i=0; i<halfPlaneDrop.length && neighborhood.length<minNeighborhood; ++i){
		neighborhood.push(halfPlaneDrop[i]["source"]);
	}
	return neighborhood;
}

Code.halfPlaneSubsetPoints3D = function(location, points, keyPoint){ // points already sorted
	var i, j, halfPlanes = [];
	var N = points.length;
	var setKeep = [];
	var setDrop = [];
	for(i=0; i<N; ++i){
		var point = points[i];
		if(keyPoint){
			point = point[keyPoint];
		}
		var dir = V3D.sub(point,location);
		// var distPoint = dir.length();
		var isBehind = false;
		for(j=0; j<halfPlanes.length; ++j){
			var plane = halfPlanes[j];
			var o = plane["o"];
			var d = plane["d"];
			var pos = Code.pointOnPositiveSidePlane3D(point, o,d);
			if(!pos){
			//Code.intersectRayPlane (org,dir, pnt,nrm
			// var intersect = Code.intersectRayPlaneFinite(location,dir, o,d);
			// if(intersect){
				isBehind = true;
				break;
			}
		}
		if(!isBehind){
			var d = dir;
			d.scale(-1);
			d.norm();
			var o = point;
			var plane = {"o":o, "d":d, "data":points[i]};
			halfPlanes.push(plane);
			setKeep.push(points[i]);
		}else{
			setDrop.push(points[i]);
		}
	}
	return {"yes":setKeep, "no":setDrop};
}



Code.convexNeighborhood2D = function(center, points, knn, minNeighborhood){ // points are closest relevant neighbors
	knn = knn!==undefined ? knn : points;
	minNeighborhood = minNeighborhood!==undefined ? minNeighborhood : 3;
	var collection = [];
	var minDistance = null;
	var maxDistance = null;
	for(i=0; i<points.length; ++i){
		var distanceSquare = V2D.distanceSquare(points[i],center);
		collection[i] = {"source":knn[i], "point":points[i], "distance":distanceSquare};
		if(minDistance==null || minDistance>distanceSquare){
			minDistance = distanceSquare;
		}
		if(maxDistance==null || maxDistance<distanceSquare){
			maxDistance = distanceSquare;
		}
	}
	collection = collection.sort(function(a,b){
		return a["distance"] < b["distance"] ? -1 : 1;
	});
	// remove all points~@ center for more circular neighborhood
	var centerRemoved = [];
	var minDistanceEquality = maxDistance!==null ? (minDistance+maxDistance)*0.5 * 0.01 : 0.0; // 1/10th the average size
	while(collection.length>0 && collection[0]["distance"]<=minDistanceEquality){
		// TODO: 0 OR NEAR ZERO
		centerRemoved.push( collection[0] );
		collection.shift();
	}
	var halfPlaneInfo = Code.halfPlaneSubsetPoints2D(center, collection, "point");
	var halfPlaneKeep = halfPlaneInfo["yes"];
	var halfPlaneDrop = halfPlaneInfo["no"];
	var neighborhood = [];
	// middle points
	for(i=0; i<centerRemoved.length; ++i){
		neighborhood.push(centerRemoved[i]["source"]);
	}
	// half plane points
	for(i=0; i<halfPlaneKeep.length; ++i){
		neighborhood.push(halfPlaneKeep[i]["source"]);
	}
	// necessary extras
	for(i=0; i<halfPlaneDrop.length && neighborhood.length<minNeighborhood; ++i){
		neighborhood.push(halfPlaneDrop[i]["source"]);
	}
	return neighborhood;
}
Code.halfPlaneSubsetPoints2D = function(location, points, keyPoint){ // points already sorted
	var i, j, halfPlanes = [];
	var N = points.length;
	var setKeep = [];
	var setDrop = [];
	for(i=0; i<N; ++i){
		var point = points[i];
		if(keyPoint){
			point = point[keyPoint];
		}
		var dir = V2D.sub(point,location);
		var distPoint = dir.length();
		var isBehind = false;
		for(j=0; j<halfPlanes.length; ++j){
			var plane = halfPlanes[j];
			var o = plane["o"];
			var d = plane["d"];
			// var d2 = d.copy().scale(-1);
			// var intersectA = Code.rayIntersect2D(o,d, location,dir);
			// var intersectB = Code.rayIntersect2D(o,d2, location,dir);
			// var intersect = intersectA ? intersectA : intersectB;
			// if(intersect && V2D.distance(intersect,location)<distPoint ){
			var pos = Code.pointOnPositiveSidePlane2D(point, o,d);
			if(!pos){
				isBehind = true;
				break;
			}
		}
		if(!isBehind){
			var d = V2D.rotate(dir,Math.PI*0.5);
			var o = point;
			var plane = {"o":o, "d":d, "data":points[i]};
			halfPlanes.push(plane);
			setKeep.push(points[i]);
		}else{
			setDrop.push(points[i]);
		}
	}
	return {"yes":setKeep, "no":setDrop};
}
Code.minRectFromPolygon = function(points){ // min-area-rect: epects convex hull - n^2 - TODO: rotating calipers
	// ...
	var i, j, a, b, p, len=points.length;
	var ab = new V2D();
	var p = new V2D();
	var angle;
	var min, max, width, height, area;
	var minArea = null;
	var minRect = null;
	var q = new V2D();
	for(i=0; i<len; ++i){ // each edge
		a = points[i];
		b = points[(i+1)%len];
		V2D.sub(ab, b,a);
		angle = V2D.angleDirection(V2D.DIRX,ab);
		min = null;
		max = null;
		for(j=0; j<len; ++j){ // find rect of
			p = points[j];
			V2D.rotate(q, p,-angle);
			if(!min){
				min = q.copy();
			}
			if(!max){ max = q.copy(); }
			V2D.min(min, min,q);
			V2D.max(max, max,q);
		}
		width = max.x-min.x;
		height = max.y-min.y;
		area = width*height;
		if(minArea==null || area<minArea){
			minArea = area;
			minRect = {"origin":new V2D(min.x,min.y),"width":width,"height":height,"angle":angle};
		}
	}
	return minRect;
}
Code.minimumTriAngle = function(a,b,c){ // CCW
	var ab = V2D.sub(b,a);
	var bc = V2D.sub(c,b);
	var ca = V2D.sub(a,c);
	var ba = ab.copy().scale(-1);
	var cb = bc.copy().scale(-1);
	var ac = ca.copy().scale(-1);
	var angleA = V2D.angle(ab,ac);
	var angleB = V2D.angle(ab,ac);
	var angleC = V2D.angle(ca,cb);
	return Math.min(angleA,angleB,angleC);
}
Code.clipRayRect2D = function(org,dir, a,b,c,d){
// Code.clipLine2DToRect
	var ints = [];
	var ab = V2D.sub(b,a);
	var bc = V2D.sub(c,b);
	var cd = V2D.sub(d,c);
	var da = V2D.sub(a,d);
	var lines = [];
	lines.push([a,ab],[b,bc],[c,cd],[d,da]);
	// console.log(lines);
	for(var i=0; i<lines.length; ++i){
		var o = lines[i][0];
		var d = lines[i][1];
		var intersection = Code.rayFiniteInfiniteIntersect2D(o,d,org,dir);
		// console.log(intersection);
		if(intersection){
			ints.push(intersection);
		}
	}
	// TODO: edge case where there are repeated intersections
	return {"a":ints[0], "b":ints[1]}
}
Code.triTriIntersection2D = function(a1,b1,c1, a2,b2,c2){
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
	var hasIn = false;
	var hasOut = false;
	var startIndex = null;
	// keep track of in/out end points
	var arrOutA = Code._triTriInsides(arrOrgA,arrDirA,arrOrgB,arrDirB);
	var arrOutB = Code._triTriInsides(arrOrgB,arrDirB,arrOrgA,arrDirA);
	var arrInts = [];
	var hasOutA = false;
	for(var i=0; i<arrOutA.length; ++i){
		var isOut = arrOutA[i];
		hasOutA = hasOutA || isOut;
		if(!isOut){
			arrInts.push(arrOrgA[i].copy());
		}
	}
	var hasOutB = false;
	for(var i=0; i<arrOutB.length; ++i){
		var isOut = arrOutB[i];
		hasOutB = hasOutB || isOut;
		if(!isOut){
			arrInts.push(arrOrgB[i].copy());
		}
	}
	if(!hasOutA || !hasOutB){
		return arrInts;
	}
	var tempSort = function(a,b){
		return a[1] < b[1] ? -1 : 1;
	}
	// find all intersections
	for(var i=0; i<arrOrgA.length; ++i){
		var orgA = arrOrgA[i];
		var dirA = arrDirA[i];
		for(j=0;j<arrOrgB.length;++j){
			orgB = arrOrgB[j];
			dirB = arrDirB[j];
			p = Code.rayFiniteIntersect2D(orgA,dirA,orgB,dirB);
			if(p){
				arrInts.push(p);
			}
		}
	}
	// find COM
	if(arrInts.length>1){
		var c = V2D.average(arrInts);
		var v = new V2D();
		// sort on angle
		for(var i=0; i<arrInts.length; ++i){
			var p = arrInts[i];
			v.set(p.x-c.x,p.y-c.y);
			var a = V2D.angleDirection(V2D.DIRX,v);
			arrInts[i] = [p,a];
		}
		arrInts.sort(tempSort);
		for(var i=0; i<arrInts.length; ++i){
			arrInts[i] = arrInts[i][0];
		}
	}
	return arrInts;
}
Code._triTriInsides = function(arrOrgA,arrDirA,arrOrgB,arrDirB){
	var arrOutA = [];
	for(var i=0; i<arrOrgA.length; ++i){
		var oA = arrOrgA[i];
		var positives = 0;
		for(var j=0; j<arrOrgB.length; ++j){
			var oB = arrOrgB[j];
			var dB = arrDirB[j];
			var dBA = V2D.sub(oA,oB);
			var cross = V2D.cross(dB,dBA);
			// console.log(j+" = "+cross);
			if(cross>0){
				positives++;
			}
		}
		var isIn = positives==arrOrgB.length;
		var isOut = !isIn;
		arrOutA[i] = isOut;
	}
	return arrOutA;
}


Code.triTriIntersection2D_BAD = function(a1,b1,c1, a2,b2,c2){
	return Code._triTriIntersection2D(a1,b1,c1, a2,b2,c2, true);
}
Code._triTriIntersection2D = function(a1,b1,c1, a2,b2,c2, retry){ // convex polygon intersection
	var ab1 = V2D.sub(b1,a1);
	var bc1 = V2D.sub(c1,b1);
	var ca1 = V2D.sub(a1,c1);
	var arrOrgA = [a1,b1,c1];
	var arrDirA = [ab1,bc1,ca1];
	var arrOutA = [];
	var ab2 = V2D.sub(b2,a2);
	var bc2 = V2D.sub(c2,b2);
	var ca2 = V2D.sub(a2,c2);
	var arrOrgB = [a2,b2,c2];
	var arrDirB = [ab2,bc2,ca2];
	var hasIn = false;
	var hasOut = false;
	var startIndex = null;

	for(var i=0; i<arrOrgA.length; ++i){
		var oA = arrOrgA[i];
		var positives = 0;
		for(var j=0; j<arrOrgB.length; ++j){
			var oB = arrOrgB[j];
			var dB = arrDirB[j];
			var dBA = V2D.sub(oA,oB);
			var cross = V2D.cross(dB,dBA);
			console.log(j+" = "+cross);
			if(cross>0){
				positives++;
			}
		}
		var isIn = positives==arrOrgB.length;
		var isOut = !isIn;
		// var isOut = positives==arrOrgB.length;
		arrOutA[i] = isOut;
		hasIn |= isIn;
		hasOut |= isOut;
		if(isOut){
			startIndex = i;
		}
	}
	console.log(arrOutA);
	if(hasIn && !hasOut){ // all inside
		console.log("all inside");
		return [a1,b1,c1];

	}else if(!hasIn && hasOut){ // all outside - possibly try opposite
		console.log("all outside");
		if(retry){
			return Code._triTriIntersection2D(a2,b2,c2, a1,b1,c1, false);
		}
	} // some in and some out
	var polygon = [];
	var tempSort = function(a,b){ return a[1] < b[1] ? -1 : 1; } // largest at beginning, smallest at end
	// start outside:
	for(var i=0; i<arrOrgA.length; ++i){
		var index = (i+startIndex)%arrOrgA.length;
		var orgA = arrOrgA[index];
		var dirA = arrDirA[index];
		var isOut = arrOutA[index];
		console.log(""+index+" = "+isOut+" | "+orgA);
		// get all intersections:
		var temp = [];
		for(j=0;j<arrOrgB.length;++j){
			orgB = arrOrgB[j];
			dirB = arrDirB[j];
			p = Code.rayFiniteIntersect2D(orgA,dirA,orgB,dirB);
			if(p){
				dist = V2D.distanceSquare(orgA,p);
				console.log("  "+i+"-"+j+" = "+p+"  ("+dist+") ");//" % "+percent);
				temp.push([p,dist]);
			}else{
				console.log("  "+i+"-"+j+" = "+null);
			}
		}
		// check add starting point
		if(!isOut){
			console.log("is in => ");
			polygon.push(orgA.copy());
		}
		// add all intersections
		temp.sort(tempSort);
		for(j=0;j<temp.length;++j){
			polygon.push(temp[j][0]);
		}
	}
	return polygon;
}
Code.triTriIntersection2D_OLD = function(a1,b1,c1, a2,b2,c2){
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
	var v1, v2, v3;
	var polygon = [];
	var tempSort = function(a,b){ return a[1] < b[1] ? -1 : 1; } // largest at beginning, smallest at end
	// console.log("  ---   ");
	for(i=0;i<3;++i){
		orgA = arrOrgA[i];
		dirA = arrDirA[i];
		// orgA inside B
		// cross1 = V2D.cross(ab2,V2D.sub(orgA,a2));
		// cross2 = V2D.cross(bc2,V2D.sub(orgA,b2));
		// cross3 = V2D.cross(ca2,V2D.sub(orgA,c2));
		v1 = V2D.sub(a2,orgA);
		v2 = V2D.sub(b2,orgA);
		v3 = V2D.sub(c2,orgA);
		cross1 = V2D.cross(ab2,v1);
		cross2 = V2D.cross(bc2,v2);
		cross3 = V2D.cross(ca2,v3);
		// var dot1 = V2D.dot(ab2,v1);
		// var dot2 = V2D.dot(bc2,v2);
		// var dot3 = V2D.dot(ca2,v3);
		// strictly inside
		if( (cross1>0&&cross2>0&&cross3>0) || (cross1<0&&cross2<0&&cross3<0) ){ // CCW / CW
			// if(dot1>0 && dot2>0 && dot3>0){
				// console.log("   "+i+":  = "+orgA);
				polygon.push(V2D.copy(orgA));
			// }
		}
		// any intersections along
		temp = []; // clear
		for(j=0;j<3;++j){
			orgB = arrOrgB[j];
			dirB = arrDirB[j];
			//p = Code.rayFiniteInfinitePositiveIntersect2D(orgA,dirA, orgB,dirB);
			//p = Code.rayFiniteInfinitePositiveIntersect2D(orgB,dirB, orgA,dirA);
			p = Code.rayFiniteIntersect2D(orgA,dirA,orgB,dirB);
			if(p){
				// dist = V2D.distanceSquare(orgB,p);
				// if(dist>dirB.lengthSquare()){ // use end point = next point
				// 	p.copy( arrOrgB[(j+1)%3] );
				// }
				// order on distance from infinite ray

				var percent = 0;

				var dB1 = V2D.distance(orgB,p);
				var dB2 = dirB.length();
				if(dB2>0){
					percent = dB1/dB2;
				}

				dist = V2D.distanceSquare(orgA,p);
				// console.log(" "+i+"-"+j+" = "+p+"  ("+dist+") % "+percent);
				temp.push([p,dist]);
			}else{
				// console.log(" "+i+"-"+j+" = "+null);
			}
		}
		// sort on closest intersection
		if(temp.length>0){
			if(temp.length>1){
				temp.sort(tempSort);
				for(j=0;j<temp.length;++j){
					polygon.push(temp[j][0]);
				}
			}else{
				polygon.push(temp[0][0]);
			}
		}
	}
	// remove duplicated points
	var espilon = 1E-16;
	for(var i=0; i<polygon.length; ++i){
		if(V2D.equal(polygon[i], polygon[(i+1)%polygon.length], espilon)){
			polygon.splice(i,1);
			--i;
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
Code.triTriIntersection3D = function(a1,b1,c1,n1, a2,b2,c2,n2,   log){ // n = b-a x c-a
	log = false;
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
// if(log){
// 	console.log("B");
// 	console.log(" "+line);
// }
	if( (d21a<=0&&d21b>=0&&d21c>=0) || (d21a>=0&&d21b<=0&&d21c<=0) ){ // lone a
		o1 = Code.closestPointsLines3D(a1,ab1, o,d);
		u1 = Code.closestPointsLines3D(c1,ca1, o,d);
		if(o1){ o1 = o1[0]; }
		if(u1){ u1 = u1[0]; }
	}else if( (d21a>=0&&d21b<=0&&d21c>=0) || (d21a<=0&&d21b>=0&&d21c<=0) ){ // lone b
		o1 = Code.closestPointsLines3D(a1,ab1, o,d);
		u1 = Code.closestPointsLines3D(b1,bc1, o,d);
		if(o1){ o1 = o1[0]; }
		if(u1){ u1 = u1[0]; }
	}else if( (d21a>=0&&d21b>=0&&d21c<=0) || (d21a<=0&&d21b<=0&&d21c>=0) ){ // lone c
		o1 = Code.closestPointsLines3D(b1,bc1, o,d);
		u1 = Code.closestPointsLines3D(c1,ca1, o,d);
		if(o1){ o1 = o1[0]; }
		if(u1){ u1 = u1[0]; }
	}else if(d21a==0&&d21b==0){ // line ab
		o1 = V3D.copy(a1);
		u1 = V3D.copy(b1);
	}else if(d21b==0&&d21c==0){ // line bc
		o1 = V3D.copy(b1);
		u1 = V3D.copy(c1);
	}else if(d21c==0&&d21a==0){ // line ca
		o1 = V3D.copy(c1);
		u1 = V3D.copy(a1);
	}else{
		console.log("WHAT IS THIS ?: "+d21a+" | "+d21b+" | "+d21c+" | "+" ... ");
		throw "?";
	} // ?
	// B segment of intersection
	// if(log){
	// console.log("C");
	// }
	if( (d12a<=0&&d12b>=0&&d12c>=0) || (d12a>=0&&d12b<=0&&d12c<=0) ){ // lone a
		o2 = Code.closestPointsLines3D(a2,ab2, o,d);
		u2 = Code.closestPointsLines3D(c2,ca2, o,d);
		if(o2){ o2 = o2[0]; }
		if(u2){ u2 = u2[0]; }
	}else if( (d12a>=0&&d12b<=0&&d12c>=0) || (d12a<=0&&d12b>=0&&d12c<=0) ){ // lone b
		o2 = Code.closestPointsLines3D(a2,ab2, o,d);
		u2 = Code.closestPointsLines3D(b2,bc2, o,d);
		if(o2){ o2 = o2[0]; }
		if(u2){ u2 = u2[0]; }
	}else if( (d12a>=0&&d12b>=0&&d12c<=0) || (d12a<=0&&d12b<=0&&d12c>=0) ){ // lone c
		o2 = Code.closestPointsLines3D(b2,bc2, o,d);
		u2 = Code.closestPointsLines3D(c2,ca2, o,d);
		if(o2){ o2 = o2[0]; }
		if(u2){ u2 = u2[0]; }
	}else if(d12a==0&&d12b==0){ // line ab
		o2 = V3D.copy(a2);
		u2 = V3D.copy(b2);
	}else if(d12b==0&&d12c==0){ // line bc
		o2 = V3D.copy(b2);
		u2 = V3D.copy(c2);
	}else if(d12c==0&&d12a==0){ // line ca
		o2 = V3D.copy(c2);
		u2 = V3D.copy(a2);
	}else{
		console.log("WHAT IS THIS ?: "+d21a+" | "+d21b+" | "+d21c+" | "+" ... ");
		throw "?";
	} // ?
	// 1D interval check
	if(!o1 || !o2 || !u1 || !u2){ // parallel somewhere -> many or no intersections
		return null;
	}
	if(log){
		console.log("D");
	}
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
	if(int1B<int2A){
		if(log){
			console.log(" => no overlap");
		}
		return null;
	}
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
// intersections, fenceA-B
Code.triSizeWithBase2D = function(a,b,c){
	var dAB = V2D.sub(b,a);
	var aAB = V2D.angleDirection(V2D.DIRX,dAB);
	var C = c.copy().sub(a).rotate(-aAB);
	var B = b.copy().sub(a).rotate(-aAB);
	var minX = Math.min(0,C.x,B.x);
	var maxX = Math.max(0,C.x,B.x);
	var minY = Math.min(0,C.y,B.y);
	var maxY = Math.max(0,C.y,B.y);
	var width = maxX-minX;
	var height = maxY-minY;
	return new V2D(width,height);
	/*
	var dAB = V2D.sub(b,a);
	var lAB = dAB.length();
	var dAC = V2D.sub(c,a);
	var lAC = dAC.length();
	if(lAB==0 || lAC==0){
		return null;
	}
	dAB.scale(1.0/lAB);
	dAC.scale(1.0/lAC);
	var dotAB = V2D.dot(dAB,dAC);
	var width = lAB;
	var oWid = Math.abs(dotAB*lAC);
	if(dotAB<0){ // opposite direction
		width += oWid;
	}
	var height = Math.sqrt(Math.abs(lAC*lAC - oWid*oWid));
	return new V2D(width,height);
	*/
}
Code.triSizeWithBase3D = function(a,b,c){
	var dAB = V3D.sub(b,a);
	var lAB = dAB.length();
	var dAC = V3D.sub(c,a);
	var lAC = dAC.length();
	if(lAB==0 || lAC==0){
		return null;
	}
	dAB.scale(1.0/lAB);
	dAC.scale(1.0/lAC);
	var dotAB = V3D.dot(dAB,dAC);
	var width = lAB;
	var oWid = Math.abs(dotAB*lAC);
	if(dotAB<0){ // opposite direction
		width += oWid;
	}
	// var norm = V3D.cross(dAB,dAC);
	// dAB.rotate(norm,Math.PIO2);
	// dotAB = V3D.dot(dAB,dAC); // orthogonal direction
	// var height = Math.abs(dotAB);
	var height = Math.sqrt(Math.abs(lAC*lAC - oWid*oWid));
	return new V2D(width,height);
};
Code.triBarycentricCoordinate2D = function(v, a,b,c, p){
	var ab = V2D.sub(b,a);
	var bc = V2D.sub(c,b);
	var ca = V2D.sub(a,c);
	return Code.triBarycentricCoordinate2DFast(v, a,b,c, ab,bc,ca, p);
}
Code.triBarycentricCoordinate2DFast = function(v, a,b,c, ab,bc,ca, p){
	var closestAB = Code.closestPointLineSegment2D(a,ab,p);
	var closestBC = Code.closestPointLineSegment2D(b,bc,p);
	var closestCA = Code.closestPointLineSegment2D(c,ca,p);
	var ap = V2D.sub(p,a);
	var bp = V2D.sub(p,b);
	var cp = V2D.sub(p,c);
	var crossA = V2D.cross(ab,ap);
	var crossB = V2D.cross(bc,bp);
	var crossC = V2D.cross(ca,cp);
	var inside = (crossA<=0 && crossB<=0 && crossC<=0) || (crossA>=0 && crossB>=0 && crossC>=0);
	if(inside){ // inside
		/*
		var lenAB = ab.length();
		var lenBC = bc.length();
		var lenCA = ca.length();
		var aToAB = V2D.sub(a,closestAB);
		var bToBC = V2D.sub(b,closestBC);
		var cToCA = V2D.sub(c,closestCA);
		var lenAB_C = aToAB.length();
		var lenBC_C = bToBC.length();
		var lenCA_C = cToCA.length();
		var pA_1 = lenAB_C/lenAB;
		var pB_1 = 1.0 - pA_1;
		var pB_2 = lenBC_C/lenBC;
		var pC_2 = 1.0 - pB_2;
		var pC_3 = lenCA_C/lenCA;
		var pA_3 = 1.0 - pC_3;
// console.log(pA_1,pB_1,pB_2,pC_2,pC_3,pA_3);
		var pA = pB_1*pC_3;
		var pB = pA_1*pC_2;
		var pC = pB_2*pA_3;
		var pTotal = pA + pB + pC;
// console.log(pA/pTotal,pB/pTotal,pC/pTotal);
		v.set(pA/pTotal,pB/pTotal,pC/pTotal);
		*/
		var areaABP = Math.abs(crossA);
		var areaBCP = Math.abs(crossB);
		var areaCAP = Math.abs(crossC);
		var areaTot = areaABP+areaBCP+areaCAP;
// console.log(areaBCP/areaTot,areaCAP/areaTot,areaABP/areaTot);
		v.set(areaBCP/areaTot,areaCAP/areaTot,areaABP/areaTot);

	}else{ // outside
		// find closest point
		var dAB = V2D.distanceSquare(p,closestAB);
		var dBC = V2D.distanceSquare(p,closestBC);
		var dCA = V2D.distanceSquare(p,closestCA);
		var close = 0;
		var distance = dAB;
		var cat;
		if(dBC<distance){
			close = 1;
			distance = dBC;
		}
		if(dCA<distance){
			close = 2;
			distance = dCA;
		}
		if(close==0){ // AB
			var aToAB = V2D.sub(a,closestAB);
			var lenAB_C = aToAB.length();
			var lenAB = ab.length();
			var pA_1 = lenAB_C/lenAB;
			var pB_1 = 1.0 - pA_1;
			v.set(pB_1,pA_1,0);
		}else if(close==1){ // BC
			var bToBC = V2D.sub(b,closestBC);
			var lenBC_C = bToBC.length();
			var lenBC = bc.length();
			var pB_2 = lenBC_C/lenBC;
			var pC_2 = 1.0 - pB_2;
			v.set(0,pC_2,pB_2);
		}else if(close==2){ // CA
			var cToCA = V2D.sub(c,closestCA);
			var lenCA_C = cToCA.length();
			var lenCA = ca.length();
			var pC_3 = lenCA_C/lenCA;
			var pA_3 = 1.0 - pC_3;
			v.set(pC_3,0,pA_3);
		}
	}
};
Code.pointsNullOrCloseToLine3D = function(intersectionPoints, lineA, lineB){
	if(!intersectionPoints){
		return true;
	}
	var lineAB = V3D.sub(lineB,lineA);
	for(var i=0; i<intersectionPoints.length; ++i){
		var point = intersectionPoints[i];
		var dist = Code.distancePointLine3D(lineA,lineAB, point);
		if(dist>1E-6){
			//console.log("pointsNullOrCloseToLine3D: "+dist);
			return false;
		}
	}
	return true;
}

Code.pointsNullOrCloseToPoints3D = function(pointsA, pointsB){ // fairly specific to MLSMesh3D
	throw "nah";
	if(!pointsA || !pointsB){
		return true;
	}
return false;




// TODO: is this on outer or inner ?
	var really = false;
	for(var i=0; i<pointsA.length; ++i){
		for(var j=0; j<pointsB.length; ++j){
			really |= V3D.equalToEpsilon(pointsA[i],pointsB[j]);
			V3D.equalToEpsilon(pointsA[i],pointsB[j]);
		}
	}
	if(!really){
		return false;
	}
	return true;
}
Code.planeEquationFromPointNormal3D = function(pnt,nrm){ // should d = -dot?
	var q = new V3D(nrm.x,nrm.y,nrm.z); q.norm();
	var dot = q.x*pnt.x + q.y*pnt.y + q.z*pnt.z; // q.scale(dot);
	return {a:nrm.x, b:nrm.y, c:nrm.z, d:-dot};
}
Code.planePointNormalFromEquation3D = function(a,b,c,d){
	var nrm = new V3D(a,b,c);
	var len = nrm.length();
	if(len!=0.0){ len = 1.0/len; }
	return {normal:nrm, point:new V3D(a*d*len,b*d*len,c*d*len)};
}
Code.projectPointToPlane3D = function(location, point,normal){
	var diff = V3D.sub(location,point);
	var dN = V3D.dot(normal,diff);
	return new V3D(location.x-dN*normal.x, location.y-dN*normal.y, location.z-dN*normal.z);
}
Code.projectPointsTo2DPlane = function(points, planePoint, planeNormal){ // x & y directions are after rotation
	var projections = [];
	for(var i=0; i<points.length; ++i){
		var location = points[i];
		var offsetAngle = V3D.angle(V3D.DIRZ,planeNormal);
		var projection = V3D.sub(location,planePoint);
		if(Math.abs(offsetAngle) > 0){ // else ~ already on plane
			var offsetNormal = V3D.cross(V3D.DIRZ,planeNormal).norm();
			projection = V3D.rotateAngle(projection, offsetNormal, -offsetAngle);
		}
		projection = new V2D(projection.x,projection.y);
		projections[i] = projection;
	}
	return projections;
}
Code.projectTo2DPlane = function(location, planePoint, planeNormal){
	return Code.projectPointsTo2DPlane([location],planePoint, planeNormal)[0];
}
Code.pointOnPositiveSidePlane2D = function(location, planePoint, planeNormal, error){
	error = error!==undefined ? error : -1E-8;
	var toP = V2D.sub(location,planePoint);
	var dot = V2D.dot(planeNormal,toP);
	return dot>=error;
}
Code.pointOnPositiveSidePlane3D = function(location, planePoint, planeNormal, error, print){
	error = error!==undefined ? error : -1E-8;
	var toP = V3D.sub(location,planePoint);
	var dot = V3D.dot(planeNormal,toP);
	if(print){
		console.log("     "+dot+" >= "+error);
	}
	return dot>=error;
}
Code.planeFromPoints = function(center, points, weights, cov){
	if(!center){
		center = V3D.mean(points);
	}
	var i, point, weight, distanceSquare;
	var len = points.length;
	var weightTotal=0;
	var centerOfMass = new V3D(0.0,0.0,0.0);
	var A=0,B=0,C=0, E=0,F=0, I=0;
	var dx,dy,dz;
	if(!weights){ // make up own weights
		weights = [];
		var weightAvg = 0;
		for(i=0; i<len; ++i){
			point = points[i];
			weights[i] = V3D.distance(point,center);
//console.log(weights[i]+" "+point+" "+center);
			weightAvg += weights[i];
		}
		weightAvg /= len;
		for(i=0; i<len; ++i){
			point = points[i];
			weight = weights[i];
			//weight = 1.0/(1.0 + weight*weight);
			weight = Math.exp(-weight/weightAvg);
			weights[i] = weight;
		}
	}
	for(i=0; i<len; ++i){
		point = points[i];
		weight = weights[i];
		centerOfMass.add(weight*point.x, weight*point.y, weight*point.z);
		weightTotal += weight;
	}
	// console.log(centerOfMass+" | "+weightTotal);
	if(weightTotal>0){
		centerOfMass.scale(1.0/weightTotal);
	}
	for(i=0; i<len; ++i){
		point = points[i];
		// distanceSquare = V3D.distanceSquare(point, center);
		weight = weights[i];
		dx = point.x-centerOfMass.x;
		dy = point.y-centerOfMass.y;
		dz = point.z-centerOfMass.z;
		A += weight*dx*dx; B += weight*dx*dy; C += weight*dx*dz;
		E += weight*dy*dy; F += weight*dy*dz; I += weight*dz*dz;
	}
	var covariance = new Matrix(3,3).fromArray([A,B,C, B,E,F, C,F,I]);
	//console.log(covariance);
	var v0, v1, v2;
	try{
		var eig = Matrix.eigenValuesAndVectors(covariance);
		var values = eig.values;
		var vectors = eig.vectors;
		var vMin = Math.min(values[0],values[1],values[2]); // least direction
		if(cov){
			return values;
		}
		var vA = vectors[0].toV3D();
		var vB = vectors[1].toV3D();
		var vC = vectors[2].toV3D();
		if(values[0] == vMin){
			v0 = vA; v1 = vB; v2 = vC;
		}else if(values[1] == vMin){
			v0 = vB; v1 = vA; v2 = vC;
		}else{
			v0 = vC; v1 = vA; v2 = vB;
		}
		if( V3D.dot(V3D.cross(v1,v2),v0) <0 ){ // consistent orientation
			var temp = v1; v1 = v2; v2 = temp;
		}
	}catch(e){ // covariance is likely all the same / not invertable => make something up
		v0 = new V3D(1,0,0);
		v1 = new V3D(0,1,0);
		v2 = new V3D(0,0,1);
	}
	//var diff = V3D.sub(center,centerOfMass);
	//var dN = V3D.dot(v0,diff);
	//var proj = new V3D( center.x-dN*v0.x, center.y-dN*v0.y, center.z-dN*v0.z ); // center plane under point's projection
	return {"point":centerOfMass, "normal":v0, "x":v1, "y":v2};
	// var normal = v0; // ||v0|| === 1
	// var plane = Code.planeEquationFromPointNormal(centerOfMass,nrm);
	// return plane;
}
Code.planeFromPoints2D = function(center, points, weights){
	if(!center){
		center = V2D.mean(points);
	}
	var i, point, weight, distanceSquare;
	var len = points.length;
	var weightTotal=0;
	var centerOfMass = new V2D(0.0,0.0);
	var A=0,B=0,D=0;
	var dx,dy;
	if(!weights){ // make up own weights
		weights = [];
		var weightAvg = 0;
		for(i=0; i<len; ++i){
			point = points[i];
			weights[i] = V2D.distance(point,center);
			weightAvg += weights[i];
		}
		weightAvg /= len;
		for(i=0; i<len; ++i){
			point = points[i];
			weight = weights[i];
			weight = Math.exp(-weight/weightAvg);
			weights[i] = weight;
		}
	}
	for(i=0; i<len; ++i){
		point = points[i];
		weight = weights[i];
		centerOfMass.add(weight*point.x, weight*point.y);
		weightTotal += weight;
	}
	if(weightTotal>0){
		centerOfMass.scale(1.0/weightTotal);
	}
	for(i=0; i<len; ++i){
		point = points[i];
		distanceSquare = V3D.distanceSquare(point, center);
		weight = weights[i];
		dx = point.x-centerOfMass.x;
		dy = point.y-centerOfMass.y;
		A += weight*dx*dx;
		B += weight*dx*dy;
		D += weight*dy*dy;
	}
	var covariance = new Matrix(2,2).fromArray([A,B,B,D]);
	// console.log(covariance);
	var v0, v1;
	try{
		// TODO: NOT ALWAYS WORK:
		// var eig = Code.eigenValuesAndVectors2D(A,B,B,D);
		// var values = eig["values"];
		// var vectors = eig["vectors"];
		// var vA = V2D.fromArray(vectors[0]);
		// var vB = V2D.fromArray(vectors[1]);
		var eig = Matrix.eigenValuesAndVectors(covariance);
		// console.log(eig.vectors[0].toV2D()+" ? "+eig.vectors[1].toV2D()+" : "+eig.values[0]+" ? "+eig.values[1]);
		var values = eig.values;
		var vectors = eig.vectors;
		var vA = vectors[0].toV2D();
		var vB = vectors[1].toV2D();
		// console.log(vA+" | "+vB+" : "+values[0]+" / "+values[1]);
		var vMin = Math.min(values[0],values[1]); // least direction
		if(values[0] == vMin){
			v0 = vA; v1 = vB;
		}else{
			v0 = vB; v1 = vA;
		}
		if( V2D.dot(v0,v1) < 0 ){ // consistent orientation - CCW 90 degrees
			v1.mult(-1.0);
		}
	}catch(e){ // covariance is likely all the same / not invertable => make something up
		console.log(e)
		throw "what?"
	}
	return {"point":centerOfMass, "normal":v0, "x":v1};
}

Code.consistentOrientation = function(pointA,pointB, pointsA,pointsB){ // TODO: if duplicated angles => also allow
	var verbose = false;
	if(pointsA.length<=2){
		return true;
	}
	var orderA = [];
	var orderB = [];
	for(var i=0; i<pointsA.length; ++i){
		var pA = pointsA[i];
		var pB = pointsB[i];
		var a = V2D.sub(pA,pointA);
		var b = V2D.sub(pB,pointB);
		var angleA = V2D.angleDirection(V2D.DIRX,a);
		var angleB = V2D.angleDirection(V2D.DIRX,b);
			angleA = Code.angleZeroTwoPi(angleA);
			angleB = Code.angleZeroTwoPi(angleB);
		orderA.push([angleA,i]);
		orderB.push([angleB,i]);
	}
	// sort by angle
	var angleFxn = function(a,b){
		return a[0]<b[0] ? -1 : 1;
	}
	orderA.sort(angleFxn);
	orderB.sort(angleFxn);
	var first = orderA[0][1];
	var last = orderA[orderA.length-1][1];
	//iterate thru each
	for(var j=0; j<orderB.length; ++j){
		var b = orderB[j][1];
		if(b==first){
			break;
		}
	}
	if(verbose){
		console.log(orderA);
		console.log(orderB);
		console.log(0+" = "+j);
	}
	var count = pointsA.length;
	for(var i=0; i<orderA.length; ++i){
		var a = orderA[i][1];
		var b = orderB[(i+j)%count][1];
		if(a!=b){
			if(verbose){
				console.log("FOUND INVALID ORDERING: "+a+" | "+b);
				// console.log(orderA);
				// console.log(orderB);
			}
			return false;
		}
	}
	return true;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- center of mass / centroid / moment / covariance / ...
Code.centroid2D = function(image, imageWidth,imageHeight, imageMaskWeights){ // centroid === center of mass
	var cen = new V2D();
	var length = imageWidth * imageHeight;
	var totalWeight = 0;
	var i, j, index, value;
	var mask = 1.0;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
			index = j*imageWidth + i;
			if(imageMaskWeights){
				mask = imageMaskWeights[index];
			}
			if(mask>0.0){
				value = image[index];
				value *= mask;
				totalWeight += value;
				cen.x += i*value;
				cen.y += j*value;
			}
		}
	}
	cen.scale(1.0/totalWeight);
	return cen;
}



Code.momentMatrixFrom2DArray = function(source, width, height, center, mask){
	center = center!==undefined ? center : Code.centroidFrom2DArray(source, width,height, mask);
	var i, j, x, y, value;
	var moment = 0;
	var totalWeight = 0;
	var m = 1.0;
	var index = 0;
	var mxx = 0;
	var mxy = 0;
	var myy = 0;
	var m = 1.0;
	var count = 0;
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			if(mask){
				m = mask[index];
			}
			if(m!=0){
				++count;
				value = source[index];
				totalWeight += value;
				x = i - center.x;
				y = j - center.y;
				mxx += value * x * x;
				mxy += value * x * y;
				myy += value * y * y;
			}
			++index;
		}
	}
	if(totalWeight!=0){
		mxx /= totalWeight;
		mxy /= totalWeight;
		myy /= totalWeight;
	}
	var matrix = new Matrix(2,2,[mxx,mxy,mxy,myy]);
	return matrix;
}
Code.momentFrom2DArray = function(source, width, height, center, mask){
	var matrix = Code.momentMatrixFrom2DArray(source, width, height, center, mask);
// matrix = Matrix.inverse(matrix);
	var eigens = Matrix.eigenValuesAndVectors(matrix);
	var eigenVectors = eigens.vectors
	eigenVectors[0] = eigenVectors[0].toArray();
	eigenVectors[1] = eigenVectors[1].toArray();
	var eigenValues = eigens.values;
	var ev1 = new V3D(eigenVectors[0][0],eigenVectors[0][1],eigenValues[0]);
	var ev2 = new V3D(eigenVectors[1][0],eigenVectors[1][1],eigenValues[1]);
	if(ev1.z<ev2.z){ // show largest first
		var temp = ev2;
		ev2 = ev1;
		ev1 = temp;
	}
	return [ev1,ev2];
}
Code.covarianceFrom2DArray = function(source, width, height, center, mask){
	// same as moment ?
	throw "?"
}

Code.centroidFrom2DArray = function(source, width, height, mask){ // SUM: m_i * x_i / M
	var cen = new V2D();
	var length = width * height;
	var totalWeight = 0;
	var i, j, value;
	var index = 0;
	var m = 1.0;
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			if(mask){
				m = mask[index];
			}
			if(m!=0){
				value = source[index];
				totalWeight += value;
				cen.x += i*value;
				cen.y += j*value;
			}
			++index;
		}
	}
	if(totalWeight!=0){
		cen.scale(1.0/totalWeight);
	}
	return cen;
}

Code.fill2DArrayRect = function(array,wid,hei, x,y, width,height, fill){
	for(var j=0; j<height; ++j){
		for(var i=0; i<width; ++i){
			var index = (j+y)*wid + (i+x);
			array[index] = fill;
		}
	}
}

/*
ImageMat.calculateMoment = function(gry,wid,hei,mean,mask){
	mean = mean!==undefined ? mean : ImageMat.calculateCentroid(gry, wid,hei);

	//var totalWeight = ImageMat.sumFloat(gry);
	// var m01 = ImageMat.calculateRawMoment(gry,wid,hei,0,1,mean);
	// var m10 = ImageMat.calculateRawMoment(gry,wid,hei,1,0,mean);

	var m11 = ImageMat.calculateRawMoment(gry,wid,hei,1,1,mean,mask);
	var m20 = ImageMat.calculateRawMoment(gry,wid,hei,2,0,mean,mask);
	var m02 = ImageMat.calculateRawMoment(gry,wid,hei,0,2,mean,mask);
	var matrix = new Matrix(2,2,[m20,m11,m11,m02]);

	var eigens = Matrix.eigenValuesAndVectors(matrix);
	var eigenVectors = eigens.vectors
	eigenVectors[0] = eigenVectors[0].toArray();
	eigenVectors[1] = eigenVectors[1].toArray();
	var eigenValues = eigens.values;
	var ev1 = new V3D(eigenVectors[0][0],eigenVectors[0][1],eigenValues[0]);
	var ev2 = new V3D(eigenVectors[1][0],eigenVectors[1][1],eigenValues[1]);
	if(ev1.z<ev2.z){ // show largest first
		var temp = ev2;
		ev2 = ev1;
		ev1 = temp;
	}
	return [ev1,ev2];
}

ImageMat.calculateRawMoment = function(image, imageWidth,imageHeight, expX, expY, mean, inMask){
	mean = mean!==undefined ? mean : ImageMat.calculateCentroid(image, imageWidth,imageHeight);
	var i, j, x, y, index, value;
	var moment = 0;
	var totalWeight = 0;
	var mask = 1.0;
	for(j=0; j<imageHeight; ++j){
		for(i=0; i<imageWidth; ++i){
			index = j*imageWidth + i;
			if(inMask){
				mask = inMask[index];
			}
			if(mask!=1){
				continue;
			}
			value = image[index];
			totalWeight += value;
			x = i - mean.x;
			y = j - mean.y;
			// x = i;
			// y = j;
			moment += value * Math.pow(x,expX) * Math.pow(y,expY);
		}
	}
	return moment/totalWeight;
}


*/




// ------------------------------------------------------------------------------------------------------------------------------------------------- equation coefficients
Code.lineOriginAndDirection2DFromEquation = function(org,dir, a,b,c){
	// if(c==0){
	// 	org.x = 0;
	// 	org.y = 0;
	// 	dir.x = 0;
	// 	dir.y = 0;
	// }else{
		len = Math.sqrt(a*a+b*b);
		len = len*len;
		if(len==0){
			org.x = 0;
			org.y = 0;
			dir.x = 0;
			dir.y = 0;
		}else{
			org.x = -a*c/len;
			org.y = -b*c/len;
			dir.x = -b;
			dir.y = a;
			// var ab = new V2D(a,b);
			// V2D.rotate(dir, ab,Math.PIO2);
			dir.norm();
		}
	// }
}
Code.lineEquationFromRay2D = function(org,dir){
	var closest = Code.closestPointLine2D(org,dir, V2D.ZERO);
	var len = closest.length();
	closest.norm();
	return {"a":closest.x, "b":closest.y, "c":-len};
}
Code.lineEquationFromPoints2D = function(a,b){ //
	dir = V2D.sub(b,a);
	var closest = Code.closestPointLine2D(a,dir, V2D.ZERO);
	var len = closest.length();
	closest.norm();
	return {"a":closest.x, "b":closest.y, "c":-len};
}
Code.homoIntersectionFromLines2D = function(a1,b1,c1, a2,b2,c2){ // [A]x B
	return new V3D(b1*c2-c1*b2, c1*a2-a1*c2, a1*b2-b1*a2); //
}
Code.homoLineFromPoints2D = function(a1,b1,c1, a2,b2,c2){ // [A]x B - dual
	return new V3D(b1*c2-c1*b2, c1*a2-a1*c2, a1*b2-b1*a2);
}
Code.conicFromCoefficients = function(a,b,c,d,e,f){
	return new Matrix2D().fromArray([a,b*0.5,d*0.5, b*0.5,c,e*0.5, d*0.5,e*0.5,f]);
}
Code.quadricFromCoefficients = function(a,b,c,d,e,f,g,h,i,j){ // M4D?
	//return new Matrix3D().fromArray([a,b*0.5,d*0.5, b*0.5,c,e*0.5, d*0.5,e*0.5,f]);
}
// ------------------------------------------------------------------------------------------------------------------------------------------------- Array Matrix Math
Code.eigenValuesAndVectors2D = function(a,b,c,d){
// TODO: WAS THIS WORKING OR WHAT?
	var trace = a + d;
	var det = a*d - b*c;
	var left = trace*0.5;
	var inside = trace*trace*0.25 - det;
	inside = Math.max(0,inside);
	var right = Math.sqrt(inside);
	var l1 = left - right;
	var l2 = left + right;
// TODO: VALUES / VECTORS CAN BE REVERSED:
	var a1 = (a-l1);
	var v1x = 0, v1y = 1;
	if(a1!=0){
		v1x = -b/a1;
	}else{
		var d1 = (d-l1);
		if(d1!=0){
			v1x = -c/d1;
		}else{
			v1x = 1; v1y = 0;
		}
	}
	var m1 = Math.sqrt(v1x*v1x + v1y*v1y);
	var a2 = (a-l2);
	var v2x = 0, v2y = 1;
	if(a2!=0){
		v2x = -b/a2;
	}else{
		var d2 = (d-l2);
		if(d2!=0){
			v2x = -c/d2;
		}else{
			v2x = 0; v2y = 1;
		}
	}
	var m2 = Math.sqrt(v2x*v2x + v2y*v2y);
	return {values:[l1,l2], vectors:[[v1x/m1,v1y/m1],[v2x/m2,v2y/m2]]};
}
Code.eigenValues2D = function(a,b,c,d){
	//Code.quadraticSolution
	var trace = a + d;
	var det = a*d - b*c;
	var left = trace*0.5;
	var inside = trace*trace*0.25 - det;
		inside = Math.max(0,inside);
	var right = Math.sqrt(inside);
	var l1 = left - right;
	var l2 = left + right;
	return [l1, l2];
}
Code.eigenVectors2D = function(a,b,c,d){
	return Code.eigenValuesAndVectors2D(a,b,c,d).vectors;
}
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
Code.closestPointsFiniteRays3D = function(oa,da, ob,db){
	var closest = Code.closestPointsLines3D(oa,da, ob,db);
	var A, B;
	if(closest){
		A = closest[0];
		B = closest[1];
	}else{ // parallel - pick one inside
		var ea = V3D.add(oa,da);
		var eb = V3D.add(ob,db);
		var tryAo = Code.closestPointLineSegment3D(oa,da, ob);
		var tryAe = Code.closestPointLineSegment3D(oa,da, eb);
		var tryBo = Code.closestPointLineSegment3D(ob,db, oa);
		var tryBe = Code.closestPointLineSegment3D(ob,db, ea);
		var dist1 = V3D.distance(ob,tryAo);
		var dist2 = V3D.distance(eb,tryAe);
		var dist3 = V3D.distance(oa,tryBo);
		var dist4 = V3D.distance(ea,tryBe);
		var dist = dist1;
		A = tryAo;
		B = ob;
		if(dist2<dist){
			dist = dist2;
			A = tryAe;
			B = eb;
		}
		if(dist3<dist){
			dist = dist3;
			A = oa;
			B = tryBo;
		}
		if(dist4<dist){
			dist = dist4;
			A = ea;
			B = tryBe;
		}
		return [A,B];
	}
	// return [A,B];
	var lenA = da.length();
	var lenB = db.length();
	var dirA = V3D.sub(A,oa);
	var dirB = V3D.sub(B,ob);
	var dotA = V3D.dot(da,dirA);
	var dotB = V3D.dot(db,dirB);
	var lenA2 = dirA.length();
	var lenB2 = dirB.length();
// console.log(dotA+" | "+dotB);
	if(dotA<0){
		A = oa.copy();
	}else if(lenA2>lenA){
		A = oa.copy().add(da);
	}
	if(dotB<0){
		B = ob.copy();
	}else if(lenB2>lenB){
		B = ob.copy().add(db);
	}
	// if endpoints changed, so could new closest point
	var oppB = Code.closestPointLineSegment3D(ob,db, A);
	var oppA = Code.closestPointLineSegment3D(oa,da, B);
	var distA = V3D.distance(A,oppA);
	var distB = V3D.distance(B,oppB);
	// console.log(distA+" | "+distB);
	if(distA>0){
		A = oppA;
	}
	if(distB>0){
		B = oppB;
	}
	return [A,B];
}
Code.closestDistanceFiniteRays3D = function(oa,da, ob,db){
	var closest = Code.closestPointsFiniteRays3D(oa,da, ob,db);
	var A = closest[0];
	var B = closest[1];
	return V3D.distance(A,B);
}
Code.medianPointLines3D = function(lines){ // list of o+d lines
	// if 2 lines => return Code.closestPointsLines3D
	// if 3+ lines:
	// cost = ||(l-o) x d)|| / ||d||
	// minimized at deriviative = 0
	// => least squares solution
	// SUMi=0_to_m: l - o - d*[(l-o)*d]/||d||
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

Code.closestPointOnTri3D = function(p, a,b,c,nrm){ // shortest distance between point p and tri a,b,c
	var d1,d2,d3, ray = Code.closestPointTri3D(p,a,b,c,nrm);
	if( ray ){ // closest point to plane inside tri
		return V3D.distance(p,ray);
	} // else closest point on each of 3 edges
	ray = new V3D();
	V3D.sub(ray, b,a);
	var p1 = Code.closestPointLineSegment3D(a,ray, p);
	d1 = V3D.distanceSquare(p, p1 );
	V3D.sub(ray, c,b);
	var p2 = Code.closestPointLineSegment3D(b,ray, p)
	d2 = V3D.distanceSquare(p, p2 );
	V3D.sub(ray, a,c);
	var p3 = Code.closestPointLineSegment3D(c,ray, p);
	d3 = V3D.distanceSquare(p, p3 );
	if(d1<=d2 && d1<=d3){
		return p1;
	}
	if(d2<=d1 && d2<=d3){
		return p2;
	}
	if(d3<=d1 && d3<=d2){
		return p3;
	}
	throw "???";
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

Code.radians = function(degrees){
	return degrees*(Math.PI/180.0);
}
Code.degrees = function(radians){
	return radians*(180.0/Math.PI);
}
Code.digits = function(value, d){
	d = d!==undefined ? d : 5;
	return value.toExponential(d);
}

Code.isPointInsideTri2DFast = function(p, a,b,c){
	if(p.x < Math.min(a.x,b.x,c.x)){
		return false;
	}
	if(p.x > Math.max(a.x,b.x,c.x)){
		return false;
	}
	if(p.y < Math.min(a.y,b.y,c.y)){
		return false;
	}
	if(p.y > Math.max(a.y,b.y,c.y)){
		return false;
	}
	return Code.isPointInsidePolygon2D(p, [a,b,c]);
}
Code.isPointInsideTri2D = function(p, a,b,c){
	var ab = V2D.sub(b,a);
	var bc = V2D.sub(c,b);
	var ca = V2D.sub(a,c);
	var ap = V2D.sub(p,a);
	var bp = V2D.sub(p,b);
	var cp = V2D.sub(p,c);
	var angleA = V2D.angleDirection(ab,ap);
	var angleB = V2D.angleDirection(bc,bp);
	var angleC = V2D.angleDirection(ca,cp);
	var eps = 1E-5;
	if(angleA<=eps && angleB<=eps && angleC <=eps){
		return true;
	}
	if(angleA>=-eps && angleB>=-eps && angleC >=-eps){
		return true;
	}
	return false;
	// var dotAA = V2D.dot(ab);
	// var dotAA = V2D.dot(ab);
	// var dotAA = V2D.dot(ab);
	// var dotAA = V2D.dot(ab);
	// var dotAA = V2D.dot(ab);
}
// Code.isPointInsideTri2D = function(p, a,b,c){ /// not correct at borders for whatever reason
// 	return Code.isPointInsidePolygon2D(p, [a,b,c]);
// }
Code.distancePointTri2D = function(p, A,B,C){
	if(Code.isPointInsideTri2D(p,A,B,C)){
		return 0;
	}
	var dir = new V2D();
	V2D.sub(dir,B,A);
	var dAB = Code.distancePointRayFinite2D(A,dir, p);
	V2D.sub(dir,C,B);
	var dBC = Code.distancePointRayFinite2D(B,dir, p);
	V2D.sub(dir,A,C);
	var dCA = Code.distancePointRayFinite2D(C,dir, p);
	return Math.min(dAB,dBC,dCA);
}
Code.isPointInsideRect2D = function(p, a,b,c,d){
	if(arguments.length<5){
		var w = a;
		var h = b;
		a = new V2D(0,0);
		b = new V2D(w,0);
		c = new V2D(w,h);
		d = new V2D(0,h);
	}
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
			intersect = (intersect < p.x); // <= ? le
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
Code.smallestCircle = function(points){
	throw "TODO";
}
Code.smallestCircleCircles = function(centers,radiuses){
	// TODO: this simply finds A circle - not necessarily optimal?
	if(centers.length==0){
		return null;
	}
	var center = centers[0].copy();
	var radius = radiuses[0];
	var AB = new V2D();
	var A = new V2D();
	var B = new V2D();
	for(var i=1; i<centers.length; ++i){
		var cen = centers[i];
		var rad = radiuses[i];
		V2D.sub(AB,cen,center);
		var lAB = AB.length();
		if(lAB>0){
			AB.norm();
			A.copy(AB).scale(-radius).add(center);
			B.copy(AB).scale(rad).add(cen);
			radius = V2D.distance(A,B)*0.5;
			V2D.midpoint(center,A,B);
		}else{
			radius = Math.max(radius,rad);
		}
	}
	return {"center":center, "radius":radius};
}
// -------------------------------------------------------------------------------------------------------------------------------------------------
Code.parabolaFromDirectrix = function(a,b, c, x){ // y = focus, directrix, x
	return ((x-a)*(x-a) + b*b - c*c)/(2*(b-c));
}
Code.parabolaAlgebraic = function(points, location, intercept){ // 2d list of points -> least squares solution
	// TODO: intercept force y = location = ?
	// a*x*x + b*x + c = 0
	// (x - h)^2 = 4*p(y-k)
	//
	if(points.length<3){
		return null;
	}
	var N = points.length;
	var W = null;
	var weights = null;
	var i, p;
	// W
	if(location){
		weights = [];
		for(i=0; i<N; ++i){
			p = points[i];
			var dist = V2D.distance(location,p);
			var weight = 1.0/(1.0 + dist*dist);
			//var weight = Math.exp(-dist*dist);
			//weight = Math.pow(weight,2);
			//weight = Math.pow(dist,-2);
			weights.push(weight);
		}
		W = new Matrix(N,N);
		for(i=0; i<N; ++i){
			var weight = weights[i];
			W.set(i,i, weight);
		}
	}
	// A
	var A = new Matrix(N,4);
	for(i=0; i<N; ++i){
		p = points[i];
		A.set(i,0, p.x*p.x);
		A.set(i,1, p.x);
		A.set(i,2, 1);
		A.set(i,3, -p.y);
	}
	if(W!=null){
		A = Matrix.mult(W,A);
	}
	// SVD projection closest
	var svd = Matrix.SVD(A);
	var best = svd.V.colToArray(3);
	var a = best[0];
	var b = best[1];
	var c = best[2];
	var y = best[3];
	if(y===0){
		return null;
	}
	a /= y;
	b /= y;
	c /= y;
	var parabola = {"a":a,"b":b,"c":c};
	parabola["weights"] = weights;
	return parabola;
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
//Code.subRect = function(image,width,height, point,newWidth,newHeight, matrix){
	// var newWidth = Math.round(width*scale);
	// var newHeight = Math.round(height*scale);
	//var sigma =
	// matrix = new Matrix(3,3).identity();
	// var scale = matrix.getScale();
	// if(scale>1.0){ // zoom in
	// 	//
	// }else{ // zoom out
	// 	//
	// }
	/*
	find extent of resulting rect, extract only that, gaussian blur that, transfer from that
	*/
// }

Code.scaleImage = function(image,width,height, point,scale){
	var newWidth = Math.round(width*scale);
	var newHeight = Math.round(height*scale);
	if(scale>1.0){ // zoom in
		// extract only the rect area (+ padding?)
	}else{ // zoom out
		// only interpolate
	}
	//HERE
	return null;
}
Code.pointInterpolate2DLinear = function(array, wid,hei, x,y){
	var hm1 = hei-1, wm1 = wid-1;
	var minX = Math.min( Math.max(Math.floor(x), 0), wm1);
	var minY = Math.min( Math.max(Math.floor(y), 0), hm1);
	var maxX = Math.max( Math.min(Math.ceil(x), wm1), 0);
	var maxY = Math.max( Math.min(Math.ceil(y), hm1), 0);
	var indexA = minY*wid + minX; var colA = array[indexA];
	var indexB = minY*wid + maxX; var colB = array[indexB];
	var indexC = maxY*wid + minX; var colC = array[indexC];
	var indexD = maxY*wid + maxX; var colD = array[indexD];
	minX = x - minX;
	if(x<0||x>wid){ minX=0.0;}
	minY = y - minY;
	if(y<0||y>hei){ minY=0.0;}
	var val = Code.linear2D(minX,minY, colA,colB,colC,colD);
	if(isNaN(val)){
		console.log("PT",wid,hei,x,y);
	}
	return val;
}
// -------------------------------------------------------------------------------------------------------------------------------------------------
Code.nextExponentialTwoRounded = function(d){
	var n = Math.abs(d);
	var e = Math.ceil(Math.log(n)/Math.log(2));
	return Math.pow(2,e);
}
Code.cuboidInside = function(aMin,aMax, bMin,bMax){ // b inside A
	return aMin.x<=bMin.x && aMin.y<=bMin.y && aMin.z<bMin.z && aMax.x>=bMax.x && aMax.y>bMax.y && aMax.z>bMax.z;
}
Code.cuboidsSeparate = function(aMin,aMax, bMin,bMax){
	return aMax.x<bMin.x || aMax.y<bMin.y || aMax.z<bMin.z || aMin.x>bMax.x || aMin.y>bMax.y || aMin.z>bMax.z;
}
Code.cuboidIntersect = function(aMin,aMax, bMin,bMax, cuboid){
	if(Code.cuboidsSeparate(aMin,aMax, bMin,bMax)){
		return null;
	}
	var left = Math.max(aMin.x,bMin.x);
	var right = Math.min(aMax.x,bMax.x);
	var bottom = Math.max(aMin.y,bMin.y);
	var top = Math.min(aMax.y,bMax.y);
	var down = Math.max(aMin.z,bMin.z);
	var up = Math.min(aMax.z,bMax.z);
	var width = right-left;
	var height = top-bottom;
	var depth = up-down;
	if(!cuboid){
		cuboid = new Cuboid();
	}
	cuboid.set(new V3D(left,bottom,down),new V3D(width,height,depth));
	return cuboid;
}
Code.rectsSeparate = function(aMin,aMax, bMin,bMax){
	return aMax.x<bMin.x || aMax.y<bMin.y || aMin.x>bMax.x || aMin.y>bMax.y;
}
Code.rectIntersect = function(aMin,aMax, bMin,bMax){
	if(Code.rectsSeparate(aMin,aMax, bMin,bMax)){
		return null;
	}
	var left = Math.max(aMin.x,bMin.x);
	var right = Math.min(aMax.x,bMax.x);
	var bottom = Math.max(aMin.y,bMin.y);
	var top = Math.min(aMax.y,bMax.y);
	var width = right-left;
	var height = top-bottom;
	var rect = new Rect(left,bottom,width,height);
	return rect;
}
Code.rectInside = function(aMin,aMax, bMin,bMax){ // b inside A
	return aMin.x<=bMin.x && aMin.y<=bMin.y && aMax.x>=bMax.x && aMax.y>bMax.y;
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
/*
Code.preserveAspectRatio2D = function(v,wid,hei,fitWid,fitHei){
	var ar = wid/hei;
	v.x = fitWid; v.y = fitWid/ar;
	if(v.y>fitHei){
		v.x = fitHei*ar; v.y = fitHei;
	}
}
*/
// conversion functions ----------------------------------------------
Code.brightnessFromARGB = function(col){
	var colors = Code.getFloatARGB(col);
	var avg = (colors[1] + colors[2] + colors[3])/3.0;
	return avg;
}
Code.getHex = function(intVal, ignore){
	var str = intVal.toString(16);
	while(str.length<6){
		str = "0"+str;
	}
	if(ignore){
		return str;
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
Code.byteArrayToJsBinary = function(binaryData){
	var len = binaryData.length;
	var bytes = '';
	for(var i=0; i<len; ++i){
		bytes += String.fromCharCode(binaryData[i]);
	}
	return bytes;
}
Code.binaryToBase64String = function(binaryData, offset, count, skip){
	offset = offset!==undefined ? offset : 0;
	count = count!==undefined ? count : binaryData.length;
	if(offset>0 || count<binaryData.length){
		//console.log("TRIM.  "+offset+" & "+count);
		var size = Math.min(count, binaryData.length-offset);
		var byteArray = new Uint8Array(size);
		var end = offset+size;//Math.min(offset+count, binaryData.length);
		//console.log("OFFSET: "+offset);
		for(var i=offset, j=0; i<end; ++i, ++j){
			byteArray[j] = binaryData[i];
		}
		binaryData = byteArray;
	}
	var bytes = binaryData;
	// if(!skip){
		bytes = Code.byteArrayToJsBinary(binaryData);
	// }
	return window.btoa(bytes);
	/*
	return window.btoa(binaryData);
	// TODO: BY SELF
	*/
}
Code.arrayBufferToBase64 = function(arrayBuffer){
	return Code.binaryToBase64String( new Uint8Array(arrayBuffer) );
	/*
    var binary = '';
    var bytes = new Uint8Array(arrayBuffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
    */
}

Code.base64StringToBinary = function(stringData, check, final){
	check = check!==undefined ? check : true;
	final = final!==undefined ? final : true;
	if(check){
		stringData = stringData.replace(/data:(.*);base64,/,"");
	}
    //console.log(window.atob(stringData));
	var i, char, byt;
	if(!Code._base64Table){
		Code._base64Table = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];
	}
	var BASE64TABLE = Code._base64Table;
	var lookupTable = {};
	for(i=0; i<BASE64TABLE.length; ++i){
		char = BASE64TABLE[i];
		lookupTable[char] = i;
	}
	var bytes = [];
	var count = stringData.length;
	var endMask = 1;
	var currentByte = 0x0;
	var currentLength = 0;
	for(i=0; i<count; ++i){
		char = stringData[i];
		if(char=="="){ // drop remainder
			currentLength = 0;
			break;
		}else{
			var c = lookupTable[char];
			currentByte <<= 6;
			currentByte |= c;
			currentLength += 6;
			if(currentLength>8){
				byt = (currentByte >> (currentLength-8)) & 0x0FF;
				currentLength -= 8;
				bytes.push(byt);
			}
		}
	}
	if(currentLength>0){
		byt = (currentByte >> (currentLength-8)) & 0x0FF;
		bytes.push(byt);
		currentLength = 0;
	}
	if(final){
		var byteArray = new Uint8Array(bytes.length);
		for(i=0; i<bytes.length; ++i){
			byteArray[i] = bytes[i];
		}
		return byteArray;
	}else{
		return bytes;
	}
}
Code.appendHeaderBase64 = function(base64, type){
	return "data:"+type+";base64,"+base64;
}

Code.saveFile = function(data, type){
	data = [data];
	type = type!==undefined ? type : "image/png";
	//var type = 'application/octet-stream';
	var blob = new Blob(data,{"type":type});
	var url = window.URL.createObjectURL(blob);
	var view = window;
	view.open(url, "newwindow",'width=300,height=300');

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
Code.stringToBinary = function(str){ // currently only asci-256
	var i, len = str.length;
	var buffer = new Uint8Array(len);
	for(i=0; i<len; ++i){
		buffer[i] = str.charCodeAt(i);
	}
	return buffer;
	// // 'utf-16le'
	// var encoder = new TextEncoder('utf-8');
	// var data = encoder.encode(str);
	// return data;
	// // encoder.decode(data);
}
Code.binaryToString = function(binary){
	var i, len = binary.length;
	var array = [];
	for(i=0; i<len; ++i){
		array.push( String.fromCharCode(binary[i]) );
	}
	var str = array.join("");
	return str;
}
Code.binaryToYAMLObject = function(binary){
	var str = Code.binaryToString(binary);
	var yaml = YAML.parse(str);
	if(Code.isArray(yaml)){
		yaml = yaml[0];
	}
	return yaml;
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

Code.dropOutliers = function(list, valueFxn, sigmas, rightOnly, useMin){
	rightOnly = rightOnly!==undefined && rightOnly!==null ? rightOnly : true;
	useMin = useMin!==undefined && useMin!==null ? useMin : false;
	if(list.length<=1){
		return {"outliers":[], "inliers":Code.copyArray(list)};
	}
	var min = null;
	var mean = 0;
	var sigma = 0;
	var i;
	var value;
	var count = list.length;
	var values = [];
	for(i=0; i<count; ++i){
		var item = list[i];
		value = valueFxn(item);
		values[i] = value;
		mean += value;
		if(min===null){
			min = value;
		}else{
			min = Math.min(min,value);
		}
	}
	mean /= count;
	if(useMin){
		mean = min;
	}
	for(i=0; i<count; ++i){
		value = values[i];
		sigma += Math.pow(value - mean,2);
	}
	sigma = Math.sqrt( sigma / count );
	var maxValue = sigmas * sigma;
	var keep = [];
	var outliers = [];
	for(i=0; i<count; ++i){
		value = values[i] - mean;
		var shouldKeep = Math.abs(value) < maxValue;
		if(rightOnly){
			shouldKeep = value < maxValue;
		} // left only: -value
		if(shouldKeep){
			keep.push(list[i]);
		}else{
			outliers.push(list[i]);
		}
	}
	return {"outliers":outliers, "inliers":keep};
}

Code.histogram = function(data, masking, buckets){
	var value, i, bin, len = data.length;
	buckets = (buckets!==undefined && buckets!==null) ? buckets : Math.round(Math.sqrt(len));
	var info = Code.infoArray(data);
	var infoMax = info["max"];
	var infoMin = info["min"];
	var infoRange = info["range"];
		infoRange = infoMax - infoMin;
	var bm1 = buckets - 1;
	var histogram = Code.newArrayZeros(buckets);
	var mask = 1.0;
	for(i=0; i<len; ++i){
		if(masking){ mask = masking[i]; }
		if(mask!=0.0){
			value = (data[i]-infoMin)/infoRange;
			bin = Math.min(Math.floor( value*buckets ),bm1);
			histogram[bin] += 1;
		}
	}
	var bucketSize = 0;
	if(buckets>0){
		bucketSize = infoRange/buckets;
	}
	return {"histogram":histogram, "size":bucketSize, "min":infoMin, "max":infoMax};
}
Code.range = function(data, masking){
	var i, len=data.length;
	var min = null;
	var max = null;
	for(i=0; i<len; ++i){
		var value = data[i];
		if(!min){min = value;}
		if(!max){max = value;}
		min = Math.min(min,value);
		max = Math.max(max,value);
	}
	var range = max - min;
	return range;
}
Code.variabilityImageDiffs = function(data, width, height){
	var i, j, x, y, m, len = data.length;
	var wm1 = width - 1;
	var hm1 = height - 1;
	var roughness = 0;
	var minX, maxX, minY, maxY, value, val, ind, index, m, diff, result, mCount;
	var mask = 1.0;
	var total = 0;
	var maskCount = 0;
	var result = Code.newArrayZeros(width*height);
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			var index = j*width + i;
			value = data[index];
			minX = Math.max(0,i-1);
			maxX = Math.min(i+1,wm1);
			minY = Math.max(0,j-1);
			maxY = Math.min(j+1,hm1);
			//tot = null;
			tot = 0;
			mCount = 0;
			for(y=minY; y<=maxY; ++y){
				for(x=minX; x<=maxX; ++x){
					ind = y*width + x;
					if(ind!==index){ // no differential with self
						++mCount
						val = data[ind];
						diff = Math.abs(value - val); // directional difference ?
						tot += diff;
						// if(tot===null){
						// 	tot = diff;
						// }else{
						// 	tot = Math.min(tot,diff); // minimum variablity
						// }
					}
				}
			}
			if(tot){
				result[index] = mCount>0 ? tot/mCount : 0;
				//result[index] = tot;
			}
		}
	}
	return result;
}
Code.variabilityImageColorGradient = function(data, width, height){ //
	var i, j, x, y, m, len = data.length;
	var wm1 = width - 1;
	var hm1 = height - 1;
	var roughness = 0;
	var minX, maxX, minY, maxY, value, val, ind, index, m, diff, result, mCount;
	var mask = 1.0;
	var total = 0;
	var maskCount = 0;
	var result = Code.newArrayZeros(width*height);
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			var index = j*width + i;
			value = data[index];
			minX = Math.max(0,i-1);
			maxX = Math.min(i+1,wm1);
			minY = Math.max(0,j-1);
			maxY = Math.min(j+1,hm1);
			avg = 0;
			mCount = 0;
			for(y=minY; y<=maxY; ++y){
				for(x=minX; x<=maxX; ++x){
					ind = y*width + x;
					val = data[ind];
					avg += val;
					++mCount;
					// if(ind!==index){ // no differential with self
					// 	++mCount
					// 	val = data[ind];
					// 	diff = Math.abs(value - val); // directional difference ?
					// 	tot += diff;
					// 	// if(tot===null){
					// 	// 	tot = diff;
					// 	// }else{
					// 	// 	tot = Math.min(tot,diff); // minimum variablity
					// 	// }
					// }
				}
			}
			avg /= mCount;
			var diff = Math.abs(value-avg);
			result[index] = diff;

		}
	}
	return result;
}
Code.variabilityImage = Code.variabilityImageColorGradient;
Code.variability = function(data, width, height, masking, isMin){ // roughness measure of a 2D surface
	var i, j, x, y, m, len = data.length;
	var wm1 = width - 1;
	var hm1 = height - 1;
	var roughness = 0;
	var minX, maxX, minY, maxY, value, val, ind, index, m, diff, result, mCount;
	var mask = 1.0;
	var total = 0;
	var maskCount = 0;
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			var index = j*width + i;
			if(masking){
				mask = masking[index];
			}
			if(mask!==0){
				++maskCount;
				value = data[index];
				minX = Math.max(0,i-1);
				maxX = Math.min(i+1,wm1);
				minY = Math.max(0,j-1);
				maxY = Math.min(j+1,hm1);
				m = 1.0;
				//tot = null;
				var avg = 0;
				mCount = 0;
				for(y=minY; y<=maxY; ++y){
					for(x=minX; x<=maxX; ++x){
						ind = y*width + x;

						val = data[ind];
						avg += val;
						++mCount;

						/*
						if(ind!==index){ // no differential with self
							if(masking){
								m = masking[ind];
							}
							if(m!==0){
								++mCount;
								val = data[ind];
								diff = Math.abs(value - val); // directional difference ?
								//console.log(value)
								if(tot===null){
									tot = diff;
								}else{
									if(isMin){
										tot = Math.min(tot,diff); // minimum variablity
										//tot = Math.max(tot,diff); // maximum variablity
									}else{
										tot += diff; // average variablity
									}
								}
							}
						}
						*/
					}
				}

				avg /= mCount;
				var diff = Math.abs(value-avg);
				total += diff;

				/*
				if(tot && mCount>0){
					if(!isMin){
						tot = tot / mCount; // average variablity
					}
					total += tot;
				}
				*/
			}
		}
	}
	if(maskCount>0){ // average of each individual
		return total/maskCount;
	}
	return 0;
}


Code.entropy01 = function(data, masking, buckets){
	buckets = (buckets!==undefined && buckets!==null)? buckets : 10;
	var i, count, p;
	var histogram = Code.histogram01(data, masking,buckets);
	var totalCount = Code.sumArray(histogram);
	var entropy = 0;
	for(i=0; i<buckets; ++i){
		count = histogram[i];
		p = count / totalCount;
		if(p>0){
			entropy += p * Math.log2(p);
		}
	}
	var maxE = -Math.log2(1.0/buckets);
	return -entropy/maxE;
}
Code.histogram01 = function(data, masking, buckets){
	var value, i, bin, len = data.length;
	buckets = (buckets!==undefined && buckets!==null)? buckets : Math.sqrt(len);
	var bm1 = buckets - 1;
	var histogram = Code.newArrayZeros(buckets);
	var mask = 1.0;
	for(i=0; i<len; ++i){
		if(masking){ mask = masking[i]; }
		if(mask!=0.0){
			bin = Math.min(Math.floor( data[i]*buckets ),bm1);
			histogram[bin] += 1;
		}
	}
	return histogram;
}


Code.valuesIn = function(array, value){
	var values = [];
	var i, len=array.length;
	var lm1 = len-1;
	for(i=0; i<lm1; ++i){
		var vA = array[i];
		var vB = array[i+1];
		var val = null;
		//console.log(vA,vB,value)
		// currently linear interpolated
		if(vA<=value && value<=vB){ // ASSUME INCREASING
			var ran = vB-vA;
			var pct = (value-vA)/ran;
			var loc = i + pct;
			val = {"location":loc};
		}
		if(val){
			values.push(val);
		}
	}
	return values;
}

// CURVATURE:

Code.curvature3D5 = function(e, d,f, b,h){ // center, xlow,xhigh, ylow,yhigh -- assumes normal estimated at 0,0,1
	if(!Code.curvature3D5._C){
		Code.curvature3D5._C = new Matrix(3,3);
		Code.curvature3D5._n = new V3D();
		Code.curvature3D5._n0 = new V3D();
		Code.curvature3D5._n1 = new V3D();
		Code.curvature3D5._n2 = new V3D();
		Code.curvature3D5._n3 = new V3D();
		Code.curvature3D5._eb = new V3D();
		Code.curvature3D5._ed = new V3D();
		Code.curvature3D5._ef = new V3D();
		Code.curvature3D5._eh = new V3D();
	}
	var df = V3D.sub(f,d);
	var bh = V3D.sub(h,b);
	var normal = V3D.cross(df,bh).norm();
	var normDot = V3D.dot(V3D.DIRZ,normal); // inaccurate normal sampling error == cos(theta)
// console.log("normDot: "+normDot);
normDot = 1;
	// assumed flat:
	var dx = Math.abs((f.x-d.x)*0.5);
	var dy = Math.abs((h.y-b.y)*0.5);
	// actual chord length:
	// var dx = df.length()*0.5;
	// var dy = bh.length()*0.5;
	var eb = V3D.sub(Code.curvature3D5._eb,b,e);
	var ed = V3D.sub(Code.curvature3D5._ed,d,e);
	var ef = V3D.sub(Code.curvature3D5._ef,f,e);
	var eh = V3D.sub(Code.curvature3D5._eh,h,e);
	var N0 = V3D.cross(Code.curvature3D5._n0,eb,ed).norm();
	var N1 = V3D.cross(Code.curvature3D5._n1,ef,eb).norm();
	var N2 = V3D.cross(Code.curvature3D5._n2,ed,eh).norm();
	var N3 = V3D.cross(Code.curvature3D5._n3,eh,ef).norm();
// console.log(N0.length(),N1.length(),N2.length(),N3.length());
	var dNxdx = 0.5*( (N1.x-N0.x) + (N3.x-N2.x) ) / dx;
	var dNydx = 0.5*( (N1.y-N0.y) + (N3.y-N2.y) ) / dx;
	var dNzdx = 0.5*( (N1.z-N0.z) + (N3.z-N2.z) ) / dx;
	var dNxdy = 0.5*( (N2.x-N0.x) + (N3.x-N1.x) ) / dy;
	var dNydy = 0.5*( (N2.y-N0.y) + (N3.y-N1.y) ) / dy;
	var dNzdy = 0.5*( (N2.z-N0.z) + (N3.z-N1.z) ) / dy;
	// var dNxdz = 0;
	// var dNydz = 0;
	// var dNzdz = 0;
	var C = Code.curvature3D5._C;
	C.set(0,0, dNxdx);
	C.set(0,1, dNxdy);
	// C.set(0,2, dNxdz);
	C.set(1,0, dNydx);
	C.set(1,1, dNydy);
	// C.set(1,2, dNydz);
	C.set(2,0, dNzdx);
	C.set(2,1, dNzdy);
	// C.set(2,2, dNzdz);
	var eig = Matrix.eigenValuesAndVectors(C);

	// 	console.log(dNxdx);
	// console.log(dNxdy);
	// console.log(dNydx);
	// 	console.log(dNydy);
	// console.log(dNzdx);
	// console.log(dNzdy);

	var values = eig["values"];
	// console.log(values)
	var kappaA = values[0];
	var kappaB = values[1];
	var kappaC = values[2];
	if(kappaA<0 || kappaB<0 || kappaC<0){
		normal.scale(-1);
	}
	if(kappaA==0){
		kappaA = C;
	}else if(kappaB==0){
		kappaB = kappaC;
	}
	kappaA = Math.abs(kappaA*normDot);
	kappaB = Math.abs(kappaB*normDot);
	var min = Math.min(kappaA,kappaB);
	var max = Math.max(kappaA,kappaB);
	return {"min":min, "max":max, "normal":normal};
}
Code.curvature3D5._C = null;
Code.curvature3D = function(a,b,c, d,e,f, g,h,i){
	return Code._curvature3D(a,b,c, d,e,f, g,h,i, true);
}
Code._curvature3D = function(a,b,c, d,e,f, g,h,i, simple){ // assumed on a plane projected to height-field
	// average of distances ~ dx & dy
	var dx = (f.x-d.x)*0.5;
	var dy = (h.y-b.y)*0.5;
	// derivatives
	var dzdx = (f.z-d.z)*0.5;
	var dzdy = (h.z-b.z)*0.5;
	// second derivatives
	var dzdxx = (f.z - 2.0*e.z + d.z);
	var dzdyy = (h.z - 2.0*e.z + b.z);
	var dzdxy = (i.z - c.z - g.z + a.z)*0.25;
	// tangent vectors
	var tangentA = new V3D(dx,0,dzdx);
	var tangentB = new V3D(0,dy,dzdy);
	// normal vectors
	var normal = V3D.cross(tangentA,tangentB);
	var unitNormal = normal.copy().norm();
	// (I)
	var E = V3D.dot(tangentA,tangentA);
	var F = V3D.dot(tangentA,tangentB);
	var G = V3D.dot(tangentB,tangentB);
	// (II)
	var L = dzdxx*unitNormal.z;
	var M = dzdxy*unitNormal.z;
	var N = dzdyy*unitNormal.z;
	// curvatures
	var den = E*G - F*F;
	var K = (L*N - M*M)/den;
	var H = (E*N + G*L - 2.0*F*M)/(2.0*den);
	var inside = H*H - K;
		inside = Math.max(inside,0);
	var sqin = Math.sqrt(inside);
	var pMin = H - sqin;
	var pMax = H + sqin;
	if(simple){
		var min = Math.abs(pMax);
		var max = Math.abs(pMin);
		if(max<min){
			temp = max;
			max = min;
			min = temp;
		}
		return {"min":min, "max":max, "normal":unitNormal};
	}
	// radius of curvature
	var rA = 1.0/pMin;
	var rB = 1.0/pMax;
	// primary curvature directions
	var a = L*G-F*M;
	var b = M*G-F*N;
	var c = E*M-F*L;
	var d = E*N-F*M;
	var scale = 1.0/(E*G-F*F);
	var eig = Matrix.eigenValuesAndVectors2D(a,b,c,d);
	var eigenValues = eig.values;
	var eigenVectors = eig.vectors;
	// primary curvatures in 3D frame
	var eigA = new V3D(eigenVectors[0][0],eigenVectors[0][1],0);
	var eigB = new V3D(eigenVectors[1][0],eigenVectors[1][1],0);
	if(eigenValues[1]>eigenValues[0]){
		var temp = eigA; eigA = eigB; eigB = temp;
	}
	// perpendicular vector:
	var twist = V3D.cross(unitNormal,V3D.DIRZ); twist.norm();
	if(twist.length()==0){
		twist.set(0,0,1);
	}
	var angle = V3D.angle(V3D.DIRZ,unitNormal);
	// rotate vectors to match z axis
	var twistX = V3D.rotateAngle(new V3D(),V3D.DIRX,twist,-angle);
	var twistY = V3D.rotateAngle(new V3D(),V3D.DIRY,twist,-angle);
	// find angle between axes
	var angleX = V3D.angle(tangentA,V3D.DIRX);
	var angleY = V3D.angle(tangentB,V3D.DIRY);
	if( Math.abs(angleX-angleY)>1E-6 ){ // roundoff error
		angleX = V3D.angle(tangentA,V3D.DIRY);
		angleY = V3D.angle(tangentB,V3D.DIRX);
	}
	// repeat process for eigenvectors
	var twistEigA = V3D.rotateAngle(new V3D(),eigA,twist,-angle);
	var twistEigB = V3D.rotateAngle(new V3D(),eigB,twist,-angle);
	var frameEigA = V3D.rotateAngle(new V3D(),twistEigA,unitNormal,-angleX);
	var frameEigB = V3D.rotateAngle(new V3D(),twistEigB,unitNormal,-angleX);
	frameEigA.norm();
	frameEigB.norm();
	var curveMin = Math.abs(pMin);
	var curveMax = Math.abs(pMax);
	if( curveMin>curveMax ){
		var temp = curveMin; curveMin = curveMax; curveMax = temp;
//		console.log("FLIP B :"+pMin+" "+pMax);
	}
	// unitNormal.scale(-1.0); // flip from direction of curvature to direction of exterior
	return {"min":curveMin, "max":curveMax, "directionMax":frameEigA, "directionMin":frameEigB, "normal":unitNormal};
}
/*

BivariateSurface.prototype.curvatureAt = function(x1,y1){
	var temp;
	var dx = dy = 1E-6;
	// var dxx = dx*dx;
	// var dxy = dx*dy;
	// var dyy = dy*dy;
	// locations
	var x0 = x1-dx, x2 = x1+dx;
	var y0 = y1-dy, y2 = y1+dy;
	// values
	var z00 = this.valueAt(x0,y0);
	var z10 = this.valueAt(x1,y0);
	var z20 = this.valueAt(x2,y0);
	var z01 = this.valueAt(x0,y1);
	var z11 = this.valueAt(x1,y1);
	var z21 = this.valueAt(x2,y1);
	var z02 = this.valueAt(x0,y2);
	var z12 = this.valueAt(x1,y2);
	var z22 = this.valueAt(x2,y2);
	// derivatives
	var dzdx = (z21-z01)*0.5;
	var dzdy = (z12-z10)*0.5;
	// second derivatives
	var dzdxx = (z21 - 2.0*z11 + z01);
	var dzdyy = (z12 - 2.0*z11 + z10);
	var dzdxy = (z22 - z20 - z02 + z00)*0.25;
	// tangent vectors
	var tangentA = new V3D(dx,0,dzdx);
	var tangentB = new V3D(0,dy,dzdy);
	// normal vectors
	var normal = V3D.cross(tangentA,tangentB);
	var unitNormal = normal.copy().norm();
	// second derivative vectors
	// var secondA = new V3D(0,0,dzdxx);
	// var secondB = new V3D(0,0,dzdxy);
	// var secondC = new V3D(0,0,dzdyy);
	// (I)
	var E = V3D.dot(tangentA,tangentA);
	var F = V3D.dot(tangentA,tangentB);
	var G = V3D.dot(tangentB,tangentB);
	// (II)
	var L = dzdxx*unitNormal.z; // V3D.dot(secondA,unitNormal); // secondA.z*unitNormal.z
	var M = dzdxy*unitNormal.z; // V3D.dot(secondB,unitNormal); // secondB.z*unitNormal.z
	var N = dzdyy*unitNormal.z; // V3D.dot(secondC,unitNormal); // secondC.z*unitNormal.z
	// curvatures
	var den = E*G - F*F;
	var K = (L*N - M*M)/den;
	var H = (E*N + G*L - 2.0*F*M)/(2.0*den);
	var inside = H*H - K;
	var sqin = Math.sqrt(inside);
	var pMin = H - sqin;
	var pMax = H + sqin;
	// radius of curvature
	var rA = 1.0/pMin;
	var rB = 1.0/pMax;
	// primary curvature directions
	var a = L*G-F*M;
	var b = M*G-F*N;
	var c = E*M-F*L;
	var d = E*N-F*M;
	var scale = 1.0/(E*G-F*F);
	var eig = Matrix.eigenValuesAndVectors2D(a,b,c,d);
	var eigenValues = eig.values;
	var eigenVectors = eig.vectors;
	// primary curvatures in 3D frame
	var eigA = new V3D(eigenVectors[0][0],eigenVectors[0][1],0);
	var eigB = new V3D(eigenVectors[1][0],eigenVectors[1][1],0);
	if(eigenValues[1]>eigenValues[0]){
		temp = eigA; eigA = eigB; eigB = temp;
	}
		// perpendicular vector:
		var twist = V3D.cross(unitNormal,V3D.DIRZ); twist.norm();
		var angle = V3D.angle(V3D.DIRZ,unitNormal);
		// rotate vectors to match z axis
		var twistX = V3D.rotateAngle(new V3D(),V3D.DIRX,twist,-angle);
		var twistY = V3D.rotateAngle(new V3D(),V3D.DIRY,twist,-angle);
		// find angle between axes
		var angleX = V3D.angle(tangentA,V3D.DIRX);
		var angleY = V3D.angle(tangentB,V3D.DIRY);
		if( Math.abs(angleX-angleY)>1E-6 ){ // roundoff error
//			console.log("inside");
			angleX = V3D.angle(tangentA,V3D.DIRY);
			angleY = V3D.angle(tangentB,V3D.DIRX);
		}
		// repeat process for eigenvectors
		var twistEigA = V3D.rotateAngle(new V3D(),eigA,twist,-angle);
		var twistEigB = V3D.rotateAngle(new V3D(),eigB,twist,-angle);
		var frameEigA = V3D.rotateAngle(new V3D(),twistEigA,unitNormal,-angleX);
		var frameEigB = V3D.rotateAngle(new V3D(),twistEigB,unitNormal,-angleX);
		frameEigA.norm();
		frameEigB.norm();
// console.log(tangentA+"")
// console.log(tangentB+"")
// console.log(normal+"")
// console.log(unitNormal+"")
// console.log("gauss: "+K)
// console.log("avg: "+H)
// console.log(pMin)
// console.log(pMax)
// console.log("radiusA: "+rA)
// console.log("radiusB: "+rB)
// console.log("eigenvector world frame 1: "+frameEigA)
// console.log("eigenvector world frame 2: "+frameEigB)
	var curveMin = Math.abs(pMin);
	var curveMax = Math.abs(pMax);
	if( curveMin>curveMax ){
		temp = curveMin; curveMin = curveMax; curveMax = temp;
//		console.log("FLIP B :"+pMin+" "+pMax);
	}
	unitNormal.scale(-1.0); // flip from direction of curvature to direction of exterior
	return {min:curveMin, max:curveMax, directionMax:frameEigA, directionMin:frameEigB, normal:unitNormal};
}

*/
Code.curvature2D = function(a,b,c){ // |dT/ds|
	var tangent = V2D.sub(c,a);
	var t1 = V2D.sub(b,a);
	var t2 = V2D.sub(c,b);
	// var epsilon = tangent.length()*0.5;
	var epsilon = (t1.length() + t2.length())*0.5;
	if(epsilon==0){
		return null;
	}
	t1.norm();
	t2.norm();
	var dt = V2D.sub(t2,t1);
		normal = dt.copy();
		normal.norm();
	dt.scale(1.0/epsilon);
	var kappa = dt.length();
	var radius = null;
	if(kappa!=0){
		radius = 1.0/kappa;
	}
	var info = {"normal":normal, "tangent":tangent, "radius":radius, "curvature":kappa};
	return info;
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




// Code.generatePoints3DHemisphere
Code.generateTri3DHemisphere = function(ox,oy,oz, rad, latCount,lonCount, totalAngle){ // triangle point sets -- QUADS
	latCount = latCount!==undefined ? latCount : 0;
	lonCount = lonCount!==undefined ? lonCount : 0;
	totalAngle = totalAngle!==undefined ? totalAngle : Math.PI; // pi = hemisphere, 2pi = sphere
	var twoPi = Math.PI*2.0;
	totalAngle = Math.min(totalAngle,twoPi);
	var fullCircle = totalAngle == twoPi;
	lonCount = Math.max(lonCount,3);
	latCount = Math.max(latCount,3);
	var tris = [];
	var tri;
	for(var j=0; j<latCount; ++j){ // up/down
		var y0 = Math.cos((j/latCount)*Math.PI)*rad;
		var y1 = Math.cos(((j+1)/latCount)*Math.PI)*rad;
		var radX0 = Math.sin((j/latCount)*Math.PI)*rad;
		var radX1 = Math.sin(((j+1)/latCount)*Math.PI)*rad;
		console.log("radX: "+radX0+" - "+radX1+" ... radY: "+y0+" - "+y1);
		for(var i=0; i<lonCount; ++i){ // around
			var sin0 = Math.sin((i/lonCount)*totalAngle);
			var sin1 = Math.sin(((i+1)/lonCount)*totalAngle);
			var cos0 = Math.cos((i/lonCount)*totalAngle);
			var cos1 = Math.cos(((i+1)/lonCount)*totalAngle);
			var x00 = cos0*radX0;
			var x01 = cos1*radX0;
			var x10 = cos0*radX1;
			var x11 = cos1*radX1;
			var z00 = sin0*radX0;
			var z01 = sin1*radX0;
			var z10 = sin0*radX1;
			var z11 = sin1*radX1;
			if(j==0){
				console.log("   ... top");
			}else if(j==latCount-1){
				console.log("   ... bot");
			}else{
				var tl = new V3D(x00,y0,z00);
				var tr = new V3D(x01,y0,z01);
				var br = new V3D(x10,y1,z10);
				var bl = new V3D(x11,y1,z11);
				tl.add(ox,oy,oz);
				tr.add(ox,oy,oz);
				bl.add(ox,oy,oz);
				br.add(ox,oy,oz);
				tri = new Tri3D(tr,tl,bl);
				tris.push(tri);
				tri = new Tri3D(bl,br,tr);
				tris.push(tri);
			}
		}
	}
	return tris;
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
Code.charStringFromByteArray = function(binaryArray,offset, count){
	var i, c, str = "";
	if( Code.isNumber(count) ){
		for(i=0; i<count; ++i){
			c = Code.uint8FromByteArray(binaryArray, offset+i);
			c = String.fromCharCode(c);
			str = str + c;
		}
		return str;
	}else{ // read till newline
		var newline = false;
		i = offset;
		var read = 0;
		while(!newline){
			if(i>=binaryArray.length){
				break;
			}
			c = Code.uint8FromByteArray(binaryArray, i);
			c = String.fromCharCode(c);
			if(c==count){
				newline = true;
			}else{
				str = str + c;
			}
			++read;
			++i;
		}
		return {"value":str,"count":read};
	}

}
Code.stringStartsWith = function(str,beg){
	if(str.length>=beg.length){
		var beginning = str.substr(0,beg.length);
		if(beginning===beg){
			return true;
		}
	}
	return false;
}
Code.uint32LittleEndianFromByteArray = function(binaryArray,offset){
	var out = binaryArray[offset+0]<<0 | binaryArray[offset+1]<<8 |  binaryArray[offset+2]<<16 |  binaryArray[offset+3]<<24;
	return out >>> 0;
}
Code.uint16LittleEndianFromByteArray = function(binaryArray,offset){
	var out = binaryArray[offset+0]<<0 | binaryArray[offset+1]<<8;
	return out >>> 0;
}
Code.float32LittleEndianFromByteArray = function(binaryArray,offset){
	var word = Code.uint32LittleEndianFromByteArray(binaryArray, offset);
	var sign =     (word & 0x80000000) >> 31; sign >>> 0;
	var exponent = (word & 0x7F800000) >> 23; exponent >>> 0;
	var fraction = (word & 0x007FFFFF) >>  0; fraction >>> 0;
	if(exponent==0x00){
		if(fraction==0){ // zeros
			return sign==0 ? +0 : -0;
		} //  denormalized numbers
		return (sign==0 ? +1 : -1) * (fraction * Math.pow(2,-126));
	}else if(exponent==0xFF){
		if(fraction==0){ // INF
			return sign==0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
		} // NAN
		return Number.NaN;
	}else{
		exponent -= 127;
		fraction += 0x800000;
	}
	return (sign==0 ? +1 : -1) * (fraction*Math.pow(2,-23)) * Math.pow(2,exponent);
}
Code.float64LittleEndianFromByteArray = function(binaryArray,offset){
	var word1 = Code.uint32LittleEndianFromByteArray(binaryArray, offset+4);
	var word2 = Code.uint32LittleEndianFromByteArray(binaryArray, offset+0);
	var sign =      (word1 >> 31) & 0x00000001; sign >>> 0;
	var exponent =  (word1 >> 20) & 0x000007FF; exponent >>> 0;
	var fractionA = (word2 >>  0) & 0x007FFFFF; fractionA >>> 0;
	var fractionB = word2; fractionB >>> 0; // 52 = 20 | 32
	if(exponent==0x0){
		if(fractionA==0 && fractionB==0){ // zeros
			return sign==0 ? +0 : -0;
		} //  subnormals
		return (sign==0 ? +1 : -1) * (fractionA * Math.pow(2,-1022) + fractionB * Math.pow(2,-1022-20));
	}else if(exponent==0x7FF){
		if(fractionA==0 && fractionB==0){ // INF
			return sign==0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
		} // NAN
		return Number.NaN;
	}else{
		exponent -= 1023;
		fractionA += 0x800000;
	}
	return (sign==0 ? +1 : -1) * (fractionA*Math.pow(2,-52) + fractionB*Math.pow(2,-52-20)) * Math.pow(2,exponent);
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
Code.open = function(url){
	window.open(url);
}

Code.assert = function(boolCheck, comment){
	if(!boolCheck){
		throw comment ? comment : "assert bool check";
	}
}


// -------------------------------------------------------------------------------------------------------------------------------------------- Sorting
Code.bubbleSort = function(a,f){ // n -> n^2
	throw "todo";
}
Code.selectionSort = function(a,f){ // n -> n^2
	throw "todo";
}
Code.mergeSort = function(a,f){ // n -> n*lg(n)
	throw "todo";
}
Code.heapSort = function(a,f){ // n*lg(n)
	throw "todo";
}
Code.quickSort = function(a,f){ // n*lg(n) -> n^2
	throw "todo";
}
Code.insertionSort = function(a,f){ // n -> n^2
	throw "todo";
}
Code.radixSort = function(a,f){ // n*k
	throw "todo";
}


// -------------------------------------------------------------------------------------------------------------------------------------------- Array
Array.prototype.first = function(){
	if(this.length>0){
		return this[0];
	}
	return undefined;
}
Array.prototype.last = function(){
	if(this.length>0){
		return this[this.length-1];
	}
	return undefined;
}





// NODE JS INCLUSION:
if(isNode){
	module.exports = Code;
}
