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
	this._reference = -1;
	this._nodes = []; // first item is reference object
	if(object!==undefined){
		this.addObject(o);
	}
}
UnionFind.Set.prototype.nodes = function(){
	return this._nodes;
}
UnionFind.Set.prototype.getRepresentative = function(object){
	for(var i=0; i<this._nodes.length; ++i){
		if(this._nodes[i]==object){
			return this._nodes[this._reference];
		}
	}
	return null;
}
UnionFind.Set.prototype.addObject = function(object, change){
	if(object){
		if(this._reference<0){
			this._reference = 0;
		}
		if(change){
			this._ref = this._nodes.length;
		}
		this._nodes.push(object);
		return true;
	}
	return false;
}
UnionFind.Set.prototype.kill = function(){
	if(this._nodes){
		Code.emptyArray(this._nodes);
	}
	this._reference = -1;
}

