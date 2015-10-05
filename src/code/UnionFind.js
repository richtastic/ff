// UnionFind.js


// --------------------------------------------------------------------------------------------------------------------
function UnionFind(fxn){
	this._sets = [];
	this._hashing = UnionFind.Set._hashingFxn;
	this.hashing(fxn);
}
// --------------------------------------------------------------------------------------------------------------------
UnionFind.prototype.hashing = function(fxn){
	if(fxn!==undefined){
		this._hashing = fxn;
	}
	return this._hashing;
}
UnionFind.prototype.newSet = function(obj){
	var set = new UnionFind.Set(this._hashing,obj);
	this._sets.push(set);
	return set;
}
UnionFind.prototype.findSetFromObject = function(obj){
	var i, rep, set;
	for(i=this._sets.length; i--;){
		set = this._sets[i];
		if( set.contains(obj) ){
			return set;
		}
	}
	return null;
}
UnionFind.prototype.findReferenceFromObject = function(obj){
	var set = this.findReferenceFromObject(obj);
	if(set){
		return set.reference();
	}
	return null;
}
UnionFind.prototype.union = function(objectA, objectB){ // 
	var i, arr, rep, repA=null, repB=null, indA=-1, indB=-1;
	for(i=this._sets.length; i--;){
		rep = this._sets[i].getRepresentative(object);
		if(rep){ repA = rep; indA = i; }
		rep = this._sets[i].getRepresentative(object);
		if(rep){ repA = rep; indB = i; }
	}
	if(repA && repB && repA != repB){
		var setA = this._sets[indA];
		var setB = this._sets[indB];
		var set = new UnionFind.Set();
		arr = setA.nodes();
		for(i=arr.length;i--;){
			set.addObject(arr[i]);
		}
		arr = setB.nodes();
		for(i=arr.length;i--;){
			set.addObject(arr[i]);
		}
		setA.kill();
		setB.kill();
		this._sets.push(set);
		return true;
	}
	return false;
}
UnionFind.prototype.kill = function(){
	if(this._sets){
		var i, set;
		for(i=this._sets.length; i--;){
			set = this._sets[i];
			set.kill();
		}
		Code.emptyArray(this._sets);
		this._sets = null;
	}
	this._hashing = null;
	return this;
}

// --------------------------------------------------------------------------------------------------------------------
UnionFind.Set = function(fxn,obj){
	this._id = UnionFind.Set._id++;
	this._reference = null;
	this._hash = {};
	this._hashing = UnionFind.Set._hashingFxn;
	if(fxn!==undefined){
		if( Code.isFunction(fxn) ){
			this.hashing(fxn);
		}
		if( Code.isObject(fxn) ){
			this.addObject(fxn);
		}
	}
	if(obj!==undefined){
		if( Code.isObject(obj) ){
			this.addObject(obj);
		}
	}
}
UnionFind.Set._id = 0;
UnionFind.Set._hashingFxn = function(obj){
	return obj.toString();
}
// --------------------------------------------------------------------------------------------------------------------
UnionFind.Set.prototype.hashing = function(fxn){
	if(fxn!==undefined){
		this._hashing = fxn;
	}
	return this._hashing;
}
UnionFind.Set.prototype.reference = function(r){
	if(r!==undefined){
		this._reference = r;
	}
	return this._reference;
}
UnionFind.Set.prototype.contains = function(obj){
	var key = this._hashing(obj)
	if( Code.objectHasProperty(this._hash,key) ){
		var o = this._hash[key];
		if(o==obj){
			return true;
		}
	}
	return false;
}
UnionFind.Set.prototype.addObject = function(object, change){
	if(object && !this.contains(object) ){
		if(!this._reference){
			change = true;
		}
		if(change){
			this.reference(object);
		}
		this._hash[ this._hashing(object) ] = object;
		return true;
	}
	return false;
}
UnionFind.Set.prototype.removeObject = function(object){
	if(object){
		if( this.contains(object) ){
			var key = this._hashing(object);
			var obj = this._hash[key];
			if(obj==object){
				delete this._hash[key];
				return true;
			}
		}
	}
	return false;
}
UnionFind.Set.prototype.kill = function(){
	if(this._hash){
		var i, set;
		for(var key in this._hash){
			delete this._hashing[key];
		}
		this._hash = null;
	}
	this._hashing = null;
	this._reference = null;
	return this;
}

