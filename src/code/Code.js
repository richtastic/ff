// Code.js 
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
// ------------------------------------------------------------------------------------------ ARRAY
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
Code._timerDateA = 0;
Code._timerDateB = 0;
Code.timerStart = function(){
	Code._timerDateA = Code.getTimeMilliseconds();
}
Code.timerStop = function(){
	Code._timerDateB = Code.getTimeMilliseconds();
}
Code.timerDifference = function(){
	return Code._timerDateB - Code._timerDateA;
}
Code.timerDifferenceSeconds = function(){
	return Code.timerDifference()/1000.0;
}
Code.getTimeMilliseconds = function(){
    var d = new Date();
    return d.getTime();
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
	while(ang>pi2){
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
// color functions ----------------------------------------------------
Code.getJSColorFromRGBA = function(col){
	return "rgba("+Code.getRedRGBA(col)+","+Code.getGrnRGBA(col)+","+Code.getBluRGBA(col)+","+Code.getAlpRGBA(col)/255.0+")";
}
Code.getJSColorFromARGB = function(col){
	return "rgba("+Code.getRedARGB(col)+","+Code.getGrnARGB(col)+","+Code.getBluARGB(col)+","+Code.getAlpARGB(col)/255.0+")";
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
		// ele["on"+str]
		ele.attachEvent("on"+str,fxn);
	}else{
		ele.addEventListener(str,fxn);
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


/*
function.call(this, a, b, c);
function.apply(this,arg);
*/
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
// ------------------------------------------------ MATHS
Code.interpolateExtrema = function(xVals,yVals, noEnds){
	// find local maxima
	// find local minima
	return {min:null, max:null};
}
Code.locateExtrema1D = function(xA,yA, xB,yB, xC,yC){ // quadric interpolation
	var ext = new V2D();
	var dx1 = xB-xA;
	var dx2 = xC-xB;
	var dx3 = xC-xA;
	var dy1 = yB-yA;
	var dy2 = yC-yB;
	var dy3 = yC-yA;
	var dD = dy3/dx3;
	var ddD = 0.5*(dy2-dy1)/(dx2-dx1);
	
	x = -dD/ddD;
	//ext.y = yB + x*dD + 0.5*x*x*ddD;
	ext.y = yB + 0.5*x*dD;
	ext.x = x + xB;

	return ext;
}


// base64

	// var dx1 = xB-xA;
	// var dx2 = xC-xB;
	// if(dx1>dx2){
	// 	// ext = Code.locateExtrema1D(-xA);
	// 	// return ext;
	// }
	// var dx3 = xC-xA;
	// var dy1 = yB-yA;
	// var dy2 = yC-yB;
	// var dy3 = yC-yA;
	// // 
	// var d2 = 2.0 * ((dy2/dx2) - (dy1/dx1))/dx3;
	// var d1 = (dy2/dx2) + 0.5*d2*dx2;
	// ext.x = xB - d1/d2;
	// ext.y = yB + 0.5*d1*(ext.x-xB);


	// return ext;
//var dx = xC-xA;
	//var dy = yC-yA;
	// var dxdx = ()/(2.0*(xC-xB)*(xB-xA));
	// var dydy = ()/(2.0*(yC-yB)*(yB-yA));