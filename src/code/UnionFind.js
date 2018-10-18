// UnionFind.js


// --------------------------------------------------------------------------------------------------------------------
function UnionFind(fxn){
	this._countObjects = 0;
	this._countSets = 0;
	this._hash = {};
	this._hashing = UnionFind._hashingFxn;
	this.hashing(fxn);
}
UnionFind._hashingFxn = function(o){
	return o+"";
}
// --------------------------------------------------------------------------------------------------------------------
UnionFind.prototype.lengthObjects = function(fxn){
	return this._countObjects;
}
UnionFind.prototype.lengthSets = function(fxn){
	return this._countSets;
}
UnionFind.prototype.hashing = function(fxn){
	if(fxn!==undefined){
		this._hashing = fxn;
	}
	return this._hashing;
}
UnionFind.prototype.addSet = function(obj){
	var hash = this._hashing(obj);
	var set = new UnionFind.Set(hash, obj);
	this._hash[hash] = set;
	this._countObjects += 1;
	this._countSets += 1;
	return set;
}
UnionFind.prototype.setFromObject = function(obj){
	var hash = this._hashing(obj);
	if(hash in this._hash){
		var set = this._hash[hash];
		return set;
	}
	return null;
}
UnionFind.prototype.isSameSet = function(objectA, objectB){
	var setA = this.setFromObject(objectA);
	var setB = this.setFromObject(objectB);
	if(!setA || !setB){
		throw "?";
	}
	return setA == setB;
}
UnionFind.prototype.union = function(objectA, objectB){
	var setA = this.setFromObject(objectA);
	var setB = this.setFromObject(objectB);
	if(!setA || !setB){
		throw "?";
	}
	if(setA==setB){ // already joined
		return false;
	}
	var objects = setB.allObjects();
	for(var i=0; i<objects.length; ++i){
		var object = objects[i];
		var hash = this._hashing(object);
		this._hash[hash] = setA;
		setA.addObject(hash,object);
	}
	setB.kill();
	this._countSets -= 1;
	return true;
}
UnionFind.prototype.allSets = function(){
	// TODO: faster unique checking
	var arr = [];
	var hash = this._hash;
	var keys = Code.keys(hash);
	for(var i=keys.length; i--;){
		var key = keys[i];
		var obj = hash[key];
		Code.addUnique(arr, obj);
	}
	return arr;
	// return Code.arrayFromHash(this._hash);
}
UnionFind.prototype.kill = function(){
	if(this._sets){
		for(var i=this._sets.length; i--;){
			var et = this._sets[i];
			set.kill();
		}
		Code.emptyArray(this._sets);
		this._sets = null;
	}
	if(this._hash){
		var keys = Code.keys(this._hash);
		for(var i=keys.length; i--;){
			var key = keys[i];
			delete this._hash[key];
		}
		this._hash = null;
	}
	this._hashing = null;
	this._countSets = 0;
	this._countObjects = 0;
	return this;
}
UnionFind.prototype.toString = function(){
	return "[UF: o:"+this._countObjects+" s:"+this._countSets+"]";
}
// --------------------------------------------------------------------------------------------------------------------
UnionFind.Set = function(hash, object){
	this._count = 0;
	this._id = UnionFind.Set._id++;
	this._hash = {};
	this.addObject(hash, object);
}
UnionFind.Set._id = 0;
// --------------------------------------------------------------------------------------------------------------------
UnionFind.prototype.length = function(fxn){
	return this._count;
}
UnionFind.Set.prototype.objectForHash = function(hash){
	if(hash in this._hash){
		return this._hash[hash];
	}
	return null;
}
UnionFind.Set.prototype.addObject = function(hash, object){
	if(hash in this._hash){ // already exists
		return false;
	}
	this._hash[hash] = object;
	this._count += 1;
	return true;
}
UnionFind.Set.prototype.removeObject = function(hash, object){
	if(hash in this._hash){ // exists
		var obj = this._hash[hash];
		if(obj==object){
			delete this._hash[hash];
			this._count -= 1;
			return true;
		}
	}
	return false;
}
UnionFind.Set.prototype.allObjects = function(){
	return Code.arrayFromHash(this._hash);
}
UnionFind.Set.prototype.kill = function(){
	if(this._hash){
		var keys = Code.keys(this._hash);
		for(var i=keys.length; i--;){
			var key = keys[i];
			delete this._hash[key];
		}
		this._hash = null;
	}
	return this;
}
// --------------------------------------------------------------------------------------------------------------------
