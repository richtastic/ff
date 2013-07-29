// ByteData.js 
ByteData.BITS_PER_INT = 32;
ByteData.MAX_SUB_INDEX = ByteData.BITS_PER_INT - 1;
ByteData.prototype.copy = function(c,a){ // c = a
	var i, lenA = a._data.length, lenC = c._data.length;
	for(i=0;i<lenA;++i){
		c._data[i] = a._data[i];
	}
	for(;i<lenC;++i){
		c._data.pop();
	}
	c._length = a._length;
	c._position = a._position;
}
ByteData.copy = ByteData.prototype.copy;
// ------------------------------------------------------------------------------------------
function ByteData(){
	this._data = new Array();
	this._position = 0;
	this._length = 0;
	this._index = 0;
	this._subIndex = 0;
	this._ander = 0;
	this.clear();
}

// ------------------------------------------------------------------------------------------
ByteData.prototype.clear = function clear(){
	Code.emptyArray(this._data);
	this._length = 0;
	this._position = 0;
}

ByteData.prototype.position = function position(p){
	if(arguments.length>0){
		this._position = Math.max(0,p);
		var len = Math.floor(this._postition/ByteData.BITS_PER_INT);
		while(this._data.length<len){
			this._data.push(0);
		}
	}
	return this._position;
}
ByteData.prototype.length = function length(l){
	if(arguments.length>0){
		this._length = l;
		var len = Math.floor(this._length/ByteData.BITS_PER_INT) + 1;
		while(this._data.length<len){
			this._data.push(0);
		}
		while(this._data.length>len){
			this._data.pop();
		}
	}
	return this._length;
}
// ------------------------------------------------------------------------------------------ WRITE
ByteData.prototype.write = function write(d){
	this._setup_position(this._position);
	if(this._index >= this._data.length){
		this._data.push(0);
	}
	if(d==0){
		this._data[this._index] = (this._data[this._index] & ~this._ander);
	}else{
		this._data[this._index] = (this._data[this._index] | this._ander);
	}
	++this._position;
	if(this._position>this._length){
		this._length = this._position;
	}
	return d;
}
ByteData.prototype.writeByteData = function writeByteData(ba, rev){
	var i, len = ba._length;
	if(rev){
		for(i=0;i<len;++i){
			ba._position = ba._length - i - 1;
			this.write( ba.read() );
		}
	}else{
		var was = ba._position;
		ba._position = 0;
		for(i=0;i<len;++i){
			this.write( ba.read() );
		}
		ba._position = was;
	}
}
// ------------------------------------------------------------------------------------------ READ
ByteData.prototype._setup_position = function _setup_position(p){
	this._index = Math.floor(p / ByteData.BITS_PER_INT);
	this._subIndex = ByteData.MAX_SUB_INDEX - (p % ByteData.BITS_PER_INT);
	this._ander = 1 << this._subIndex;
}
ByteData.prototype.read = function read(){
	if(this._position >=this._length){
		return -1;
	}
	this._setup_position(this._position);
	++this._position;
	return (this._data[this._index] & this._ander)!=0?1:0;
}
ByteData.prototype.readUintN = function readUintN(len){
	var i, num = 0;
	for(i=0;i<len;++i){
		if( this.read() ){
			num += 1<<i;
		}
	}
	return num;
}
ByteData.prototype.readUint4 = function readUint4(){
	return this.readUintN(4);
}
// ------------------------------------------------------------------------------------------ PRINT
ByteData.prototype.toString = function toString(){
	return this.toStringBin();
}
ByteData.prototype.toStringBin = function toStringBin(){
	var str = "", i, len = this.length();
	var was = this.position();
	this.position(0);
	for(i=0;i<len;++i){
		if ( i%8==0 && i>0){
			str = str + "|"
		}
		str = str+this.read();
	}
	this.position(was);
	return str;
}
ByteData.prototype.toStringHex = function toStringHex(){
	var str = "";
	var i, len = Math.ceil( (this._length)/4.0 );
	this._position = 0;
	for(i=0;i<len;++i){
		if ( i%8==0 && i>0){
			str = str + "|"
		}
		str = str+this.readUint4().toString(16).toUpperCase();
	}
	return str;
}

// ------------------------------------------------------------------------------------------ KILL
ByteData.prototype.kill = function(){
	this.clear();
	this._data = null;
	this._position = undefined;
	this._length = undefined;
	this._index = undefined;
	this._subIndex = undefined;
	this._ander = undefined;
}

// ------------------------------------------------------------------------------------------ ENCRYPTION














