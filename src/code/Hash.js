// Hash.js

function Hash(intFxn, startSize){
	this._count = 0;
	this._list = [];
	this._intFxn = Hash.toIntegerFromInteger;
	this._hashFxn = this.hash1;
	this.intFxn(intFxn);
	startSize = startSize!==undefined ? startSize : Hash.MIN_SIZE_CAPACITY;
	this._resize(startSize); //
}
Hash.MIN_SIZE_CAPACITY = 4;
Hash.toIntegerFromUnknown = function(u){
	if(Code.isNumber(u)){
		return Hash.toIntegerFromFloat(u);
	}
}
Hash.toIntegerFromInteger = function(i){
	return i;
}
Hash.toIntegerFromFloat = function(f){ // todo: binary
	return Hash.toIntegerFromString(f.toExponential(52));
}
Hash.toIntegerFromString = function(s){
	var val = 0;
	var len = s.length;
	for(var i=0; i<len; ++i){
		var c = s.charCodeAt(i);
		val += (c)*(i+1);
	}
	return val;
}
Hash.prototype.hash1 = function(i){
	var len = this._list.length;
	var low = Math.log2(len) | 0;
	var a = Math.pow(2,low)+1;
	var b = Math.pow(2,low+1)+1;
	var x = Math.pow(2,low)-1;
	var j = (i+b)%a;
	var k = (i+a)%b;
	var h = ((j+k)*x) % len;
	return h;
}
Hash.prototype.hash2 = function(i){
	throw "?";
}
// --------------------------------------------------------------------------
Hash.prototype.intFxn = function(fxn){
    if(fxn!==undefined){
        this._intFxn = fxn;
    }
    return this._intFxn;
}
Hash.prototype.hashFxn = function(fxn){
    if(fxn!==undefined){
        this._hashFxn = fxn;
    }
    return this._hashFxn;
}
Hash.prototype.remove = function(key){
	var list = this._list;
	var k = this._intFxn(key);
	var index = this._hashFxn(k);
	var existing = list[index];
	if(existing){
		for(var i=0; i<existing.length; ++i){
			if(existing[i][0]===key){
				if(existing.length==0){
					list[index] = null;
				}else{
					existing.splice(i,1);
				}
				return true;
			}
		}
	}
	return false;
}
Hash.prototype.value = function(key,val){
	var list = this._list;
	var k = this._intFxn(key);
	var index = this._hashFxn(k);
	// console.log(" value: "+k+" => "+index);
	var existing = list[index];
	if(val!==undefined){ // SET
		if(existing){
			var found = false;
			for(var i=0; i<existing.length; ++i){
				if(existing[i][0]===key){ // update
					existing[i][1] = val;
					found = true;
					break;
				}
			}
			if(!found){ // create
				existing.push([key,val]);
			}
		}else{
			list[index] = [[key,val]];
		}
		this._count += 1;
		this._checkResize();
	}else{ // GET
		if(existing){
			for(var i=0; i<existing.length; ++i){
				if(existing[i][0]===key){
					return existing[i][1];
				}
			}
		}
		return null;
	}
    return val;
}
Hash.prototype._checkResize = function(){
	var minRatio = 0.25;
	var maxRatio = 0.75;
	var loadFactor = this.loadFactor();
	if(loadFactor<minRatio && this._list.length>Hash.MIN_SIZE_CAPACITY){
		// console.log("resize to smaller");
		this._resize(this._list.length*0.5|0);
	}else if(loadFactor>maxRatio){
		// console.log("resize to bigger");
		this._resize(this._list.length*2);
	}
}
Hash.prototype.loadFactor = function(){
	return this._count/this._list.length;
}
Hash.prototype._resize = function(size){
    var current = this.toKeyValueArray();
	// console.log(this._list.length+" -> "+size);
	Code.emptyArray(this._list);
	this._list = Code.newArrayNulls(size);
	for(var i=0; i<current.length; ++i){
		var item = current[i];
		this.value(item[0],item[1]);
	}
}
Hash.prototype.length = function(){
    return this._count;
}
Hash.prototype.toKeyValueArray = function(){
	var list = this._list;
	var len = list.length;
	var array = [];
	for(var i=0; i<len; ++i){
		var entry = list[i];
		if(entry){
			for(var j=0; j<entry.length; ++j){
				array.push(entry[j]);
			}
		}
	}
	return array;
}
Hash.prototype.toArray = function(){
	var array = this.toKeyValueArray();
	var len = array.length;
	for(var i=0; i<len; ++i){
		array[i] = array[i][1];
	}
	return array;
}
Hash.prototype.keys = function(){
	var array = this.toKeyValueArray();
	var len = array.length;
	for(var i=0; i<len; ++i){
		array[i] = array[i][0];
	}
	return array;
}
Hash.prototype.toString = function(){
	var str = "[Hash: "+this._count+"/"+this._list.length+"]";
    return str;
}
