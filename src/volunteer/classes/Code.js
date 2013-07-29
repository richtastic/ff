// Code.js 
//Code = {};
Code.prototype.BOOYAH = "fuckit";

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




/*
function.call(this, a, b, c);
function.apply(this,arg);
*/

