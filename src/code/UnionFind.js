// UnionFind.js


// --------------------------------------------------------------------------------------------------------------------
function UnionFind(fxn){
	this._sets = [];
}
// --------------------------------------------------------------------------------------------------------------------
UnionFind.prototype.newSet = function(object){
	var set = new UnionFind.Set(obj);
	this._sets.push( set );
	return set;
}
UnionFind.prototype.find = function(object){
	var i, rep;
	for(i=this._sets.length; --i;){
		rep = this._sets[i].getRepresentative(object);
		if(rep){ return rep; }
	}
	return null;
}
UnionFind.prototype.union = function(objectA, objectB){
	var i, arr, rep, repA=null, repB=null, indA=-1, indB=-1;
	for(i=this._sets.length; --i;){
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
		for(i=arr.length;--i;){
			set.addObject(arr[i]);
		}
		arr = setB.nodes();
		for(i=arr.length;--i;){
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
	//
}

// --------------------------------------------------------------------------------------------------------------------
UnionFind.Set = function(o){
	this._reference = null;
	this._hash = {};
	this._hashing = UnionFind._hashingFxn;
	if(object!==undefined){
		this.addObject(o);
	}
}
UnionFind.Set._hashingFxn = function(object){
	return object.toString();
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
UnionFind.Set.prototype.addObject = function(object, change){
	if(object){
		if(change){
			this.reference(object);
		}
		this._nodes.push(object);
		return true;
	}
	return false;
}
UnionFind.Set.prototype.removeObject = function(object){
	if(object){
		var key = this._hashing(object);
		if( Code.objectHasProperty(this._hash,key) ){
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
	// ...
	HERE
	if(this._nodes){
		Code.emptyArray(this._nodes);
	}
	this._reference = -1;
}

