// SerialString.js
SerialString.OBJECT_TYPE_UNKNOWN = 0;
SerialString.OBJECT_TYPE_STRING = 1;
SerialString.OBJECT_TYPE_BOOLEAN = 2;
SerialString.OBJECT_TYPE_NUMBER = 3;
SerialString.OBJECT_TYPE_OBJECT = 4;
SerialString.OBJECT_TYPE_ARRAY = 5;
SerialString.OBJECT_DIVIDER = "|";
function SerialString(can, fr){
	this.index = 0;
	this.value = "";
	this.set("");
}
// ------------------------------------------------------------------------------------------------------------------------ GET/SET PROPERTIES
SerialString.prototype.get = function(r){
	return this.value;
}
SerialString.prototype.set = function(s){
	this.index = 0;
	this.value = s;
}
// ------------------------------------------------------------------------------------------------------------------------ WRITING
SerialString.prototype.startWrite = function(){
	this.set("");
}
SerialString.prototype.writeInt = function(i){
	this.value += (i+SerialString.OBJECT_DIVIDER);
}
/*SerialString.prototype.writeLongInt = function(l){
	this.value += (l+SerialString.OBJECT_DIVIDER);
}*/
SerialString.prototype.writeFloat = function(f){
	this.value += (f+SerialString.OBJECT_DIVIDER);
}
/*SerialString.prototype.writeDouble = function(d){
	this.value += (d+SerialString.OBJECT_DIVIDER);
}*/
SerialString.prototype.writeNumber = function(n){
	this.value += (n+SerialString.OBJECT_DIVIDER);
}
SerialString.prototype.writeString = function(s){
	if(s==null){
		this.value += "0"+SerialString.OBJECT_DIVIDER+SerialString.OBJECT_DIVIDER;
	}else{
		this.value += (s.length+SerialString.OBJECT_DIVIDER+s+SerialString.OBJECT_DIVIDER);
	}
}
// ------------------------------------------------------------------------------------------------------------------------ ARRAYS
/*SerialString.prototype.writeIntArray = function(a){
	var i, len = a.length;
	this.writeInt(len);
	for(i=0;i<len;++i){
		this.writeInt(a[i]);
	}
}
SerialString.prototype.writeFloatArray = function(a){
	var i, len = a.length;
	this.writeInt(len);
	for(i=0;i<len;++i){
		this.writeFloat(a[i]);
	}
}
SerialString.prototype.writeNumberArray = function(a){
	var i, len = a.length;
	this.writeInt(len);
	for(i=0;i<len;++i){
		this.writeNumber(a[i]);
	}
}*/
// ------------------------------------------------------------------------------------------------------------------------ COMPLEX
SerialString.prototype.writeObject = function(hash){
	var key, value, count = 0;
	for(key in hash){
		value = hash[key];
		if( (value===undefined || value===null) || Code.isString(value) || Code.isNumber(value) || Code.isArray(value) || Code.isObject(value) ){
			++count;
		}
	}
	this.writeInt( count );
	for(key in hash){
		value = hash[key];
		this.writeString(key);
		if(value!==null && value!==undefined){
			this.writeInt(1);
			if( Code.isString(value) ){
				this.writeInt(SerialString.OBJECT_TYPE_STRING);
				this.writeString(value);
			}else if( Code.isArray(value) ){
				this.writeInt(SerialString.OBJECT_TYPE_ARRAY);
				this.writeArray(value);
			}else if( Code.isObject(value) ){
				this.writeInt(SerialString.OBJECT_TYPE_OBJECT);
				this.writeObject(value);
			}else if( Code.isNumber(value) ){
				this.writeInt(SerialString.OBJECT_TYPE_NUMBER);
				this.writeNumber(value);
			}else{ // no functions please
				console.log(TAG,"UNKNOWN TYPE: '"+value+"'");
			}
		}else{
			this.writeInt(0);
		}
	}
}
SerialString.prototype.writeObjectArray = function(hashList){
	var hash, i, len = hashList.size();
	this.writeInt(len);
	for(i=0;i<len;++i){
		hash = hashList[i];
		this.writeObject(hash);
	}
}
// ------------------------------------------------------------------------------------------------------------------------ READING
SerialString.prototype.startRead = function(){
	this.index = 0;
}
SerialString.prototype.readInt = function(){
	var end = this.getSerializeEnd(this.value,this.index);
	var i = Number( this.value.substring(this.index,end) );
	this.index = end + 1;
	return i;
}/*
SerialString.prototype.readLongInt = function(){
	var end = this.getSerializeEnd(this.value,this.index);
	var l = Number( this.value.substring(this.index,end) );
	this.index = end + 1;
	return l;
}*/
SerialString.prototype.readFloat = function(){
	var end = this.getSerializeEnd(this.value,this.index);
	var f = Number( this.value.substring(this.index,end) );
	this.index = end + 1;
	return f;
}/*
SerialString.prototype.readDouble = function(){
	var end = this.getSerializeEnd(this.value,this.index);
	var d = Number( this.value.substring(this.index,end) );
	this.index = end + 1;
	return d;
}*/
SerialString.prototype.readNumber = function(){
	var end = this.getSerializeEnd(this.value,this.index);
	var n = Number( this.value.substring(this.index,end) );
	this.index = end + 1;
	return n;
}
SerialString.prototype.readString = function(){
	var len = this.readInt();
	var s = this.value.substring(this.index,this.index+len);
	this.index += len + 1;
	return s;
}
// ------------------------------- ARRAYS
/*SerialString.prototype.readIntArray = function(){
	var i, len = this.readInt();
	var a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = this.readInt();
	}
	return a;
}
SerialString.prototype.readFloatArray = function(){
	var i, len = this.readInt();
	var a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = this.readFloat();
	}
	return a;
}
SerialString.prototype.readStringArray = function(){
	var i, len = this.readInt();
	var a = new Array(len);
	for(i=0;i<len;++i){
		a[i] = this.readString();
	}
	return a;
}*/
// ------------------------------- COMPLEX
SerialString.prototype.readObject = function(){
	var key, value, hash = {};
	var isNull, type, i, len = this.readInt();
	for(i=0;i<len;++i){
		key = this.readString();
		isNull = this.readInt();
		if(isNull==1){
			type = this.readInt();
			if(type==SerialString.OBJECT_TYPE_STRING){
				value = this.readString();
			}else if(type==SerialString.OBJECT_TYPE_NUMBER){
				value = this.readNumber();
			}else if(type==SerialString.OBJECT_TYPE_OBJECT){
				value = this.readObject();
			}else if(type==SerialString.OBJECT_TYPE_ARRAY){
				value = this.readArray();
			}else{ // uh-oh
				value = SerialString.OBJECT_TYPE_UNKNOWN;
			}
		}else{
			value = null;
		}
		hash[key] = value;
	}
	return hash;
}
SerialString.prototype.readArrayObject = function(){
	var i, len = readInt();
	var hashList = new Array(len);
	for(i=0;i<len;++i){
		hashList[i] = this.readObject();
	}
	return hashList;
}
// ------------------------------------------------------------- HELPERS
SerialString.prototype.getSerializeEnd = function(s, start){
	var end, len = s.length;
	for(end=start;end<len;++end){
		if( s.charAt(end)=='|' ){
			break;
		}
	}
	return end;
}
SerialString.prototype.toString = function(){
	return "[ "+this.value+" ]";
}
SerialString.prototype.kill = function(){
	this.value = null;
	this.index = -1;
}



/*
	var data = new SerialString();

	data.startWrite();
	data.writeString("wtf");
	data.writeNumber(1234);
	data.writeNumber(66.69);
	data.writeObject({cat:"kitty", num:123, zec:1009001});
	console.log( data.toString() );

	data.startRead();
	console.log( data.readString() );
	console.log( data.readNumber() );
	console.log( data.readNumber() );
	console.log( data.readObject() );

*/

