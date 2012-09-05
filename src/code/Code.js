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
Code.removeElementSimple = function(a,o){ // not preserves order
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


