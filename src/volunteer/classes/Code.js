// Code.js 
Code.IS_IE = ( (navigator.appName).toLowerCase().indexOf("explorer") >=0 );

// ------------------------------------------------------------------------------------------
function Code(){
	this.www = 234;
}

// ------------------------------------------------------------------------------------------ CLASS SUB/SUPER EXTEND
Code.extendClass = function extendClass(target, source) {
    Object.getOwnPropertyNames(source).forEach(function(propName) {
        Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
    });
    return target;
}

Code.inheritClass = function inheritClass(SubC, SuperC) {
    var subProto = Object.create(SuperC.prototype);
    Code.extendClass(subProto, SubC.prototype);
    SubC.prototype = subProto;
    SubC._ = SuperC.prototype;
}

// ------------------------------------------------------------------------------------------ PRINT
Code.log = function log(o){
	if(typeof o == Code.TYPE_STRING){
		console.log( o );
	}else if(typeof o == Code.TYPE_FUNCTION){
		console.log( o );
	}else{
		console.log( o.toString() );
	}
}
// ------------------------------------------------------------------------------------------ ARRAY
Code.emptyArray = function(a){
	while(a.length>0){ a.pop(); }
}


// ------------------------------------------------------------------------------------------ TIME
Code.getTimeMilliseconds = function(){
    var d = new Date();
    return d.getTime();
};

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
// formatting functions ----------------------------------------------
Code.prependFixed = function(start,pad,count){
	var str = start;
	while(str.length<count){
		str = pad+str;
	}
	return str;
}


// -------------------------------------------------------- HTML
Code.getBody = function(){
	return document.body;
};
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
Code.newDiv = function(){
	return document.createElement("div");
};
Code.addChild = function(a,b){
	a.appendChild(b);
};
Code.setProperty = function(ele,pro,val){
	ele.setAttribute(pro,val);
};
Code.setStyleWidth = function(ele,val){
	ele.style.width = val;
};
Code.setStyleBackground = function(ele,val){
	ele.style.background = val;
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
	ele.setAttribute("class",c);
	ele.className = c;
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

// hiding 
// ele.setAttribute("display","none");
Code.hide = function(ele){
	ele.style.display = "none";
}
Code.unhide = function(ele){
	ele.style.display = Code.IS_IE?"block":"inherit";
}

// -------------------------------------------------------- LISTENERS
Code.addListenerClick = function(ele,fxn){
	if(ele.addEventListener!=null){
		ele.addEventListener("click",fxn);
	}else{ // IE
		ele.onclick = fxn;
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



/*
function.call(this, a, b, c);
function.apply(this,arg);
*/

