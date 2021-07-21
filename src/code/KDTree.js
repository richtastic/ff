// KDTree.js
// build tree a single time from all points

function KDTree(dimensions,toDimensionalArray,mins,maxs,eps){
    this._root = new KDTree.Node();
    this._dimensions = null;
    this._autoResize = true;
    this._maximumSplitDataCount = 4; // some small number : 
    this._maximumSplitDepthCount = 7; // some exponential number : d^k
    this.dimensions(dimensions);
    this.toDimensionalArray(toDimensionalArray);
	// this.initWithSize(min,max,eps);
    if(mins && maxs){
        this.initWithMinMax(mins,maxs);
    }
}
KDTree.prototype.clear = function(){
    throw "...";
}
KDTree.prototype.min = function(min){
    if(min!==undefined){
        this._min = min;
    }
    return this._min;
}
KDTree.prototype.max = function(max){
    if(max!==undefined){
        this._max = max;
    }
    return this._max;
}
KDTree.prototype.dimensions = function(dimensions){
    if(dimensions!==undefined){
        this._dimensions = dimensions;
    }
    return this._dimensions;
}
KDTree.prototype.toDimensionalArray = function(fxn){
    if(fxn!==undefined){
        this._toDimensionalArray = fxn;
    }
    return this._toDimensionalArray;
}
KDTree.prototype.initWithMinMax = function(){
    throw "...";
}
KDTree.prototype.insertObjects = function(objects){
    // find mean / median
    // for axis i
    // sort objects OR random selection of objects to estimate median
    // create left / right arrays
    // create center = all values equal to median
    // insert to left & right
    throw "...";
}
QuadTree.prototype.insertObject = function(object){
    var toDA = this._toDimensionalArray(object);
    var location = toDA(object);
    var dimensions = this.dimensions();
    var min = this.min();
    var max = this.max();
    var isInside = true;
    for(var i=0; i<dimensions; ++i){
        var loc = location[i];
        if(loc<min[i] || loc>max[i]){
            isInside = false;
            break;
        }
    }
    // console.log(". insertObject ------------------------------------------------------------------------------------   "+point);
    if(isInside){
        this._root.insertObject(object,toDA);
    }else if(this._autoResize){
        var objects = this.toArray();
        objects.push(obj);
        this.clear();
        this.initWithObjects(objects, true);
    } // else drop on floor
}
KDTree.prototype.removeObject = function(object){
    //
    throw "...";
}

KDTree.prototype.kNN = function(point,k){
    k = k!==undefined ? k : 1;
    // ...
    throw "...";
}
KDTree.prototype.find = function(object,array){
    //
    throw "...";
}
KDTree.prototype._findObject = function(array){
    //
    throw "...";
}
KDTree.prototype.kill = function(){
    //
    throw "...";
}
KDTree.prototype.toArray = function(){
    //
    throw "...";
}

KDTree.Node = function(depth){
    this._objects = [];
    this._depth = null;
    this._upper = null;
    this._lower = null;
    this.depth(depth);
}
KDTree.Node.prototype.depth = function(depth){
    if(depth!==undefined){
        this._depth = depth;
    }
    return this._depth;
}
KDTree.Node.prototype.firstObject = function(){
    if(this._objects.length>0){
        return this._objects[0];
    }
    return null;
}
KDTree.Node.prototype.objects = function(){
    return this._objects;
}
KDTree.Node.prototype.lower = function(lower){
    if(lower!==undefined){
        this._lower = lower;
    }
    return this._lower;
}
KDTree.Node.prototype.upper = function(upper){
    if(right!==undefined){
        this._upper = upper;
    }
    return this._upper;
}
KDTree.Node.prototype.kill = function(){
    this._objects = null;
    this._lower = null;
    this._upper = null;
}
KDTree.Node.prototype.insertObject = function(object, toDA, maxDepth, maxCount){
    if(this._lower || this._upper){
        throw "has children >> insert there"
    }
    var objects = this._objects;
    if(!objects){
        this._objects = [object];
        return;
    }
    if(this._depth==maxDepth){
        this._objects.push(object);
        return;
    }
    if(objects.length<maxCount){
        objects.push(object);
    }
    var objectDA = toDA(object);
    if(objects.length>0){
        var hasDuplicate;
        for(var i=0; i<objects.length; ++i){
            if( toDA(objects[i]) == something ){
                hasDuplicate = true;
                break;
            }
        }
        // allow multiplicity
        if(hasDuplicate){
            objects.push(object);
            return;
        }
        
    }
    throw "max count needs to allow dups"
    // create & put in children
    this._lower = new KDTree.Node(this._depth+1, minL,maxL);
    this._upper = new KDTree.Node(this._depth+1, minU,maxU);

    // A = D mod K
    throw "..."
}

// KDTree.Object = function(object,array){
//     this._object = null;
//     this._array = null;
//     this.object(object);
//     this.array(array);
// }
// KDTree.Object.prototype.array = function(array){
//     if(array!==undefined){
//         this._array = array;
//     }
//     return this._array;
// }
// KDTree.Object.prototype.object = function(object){
//     if(object!==undefined){
//         this._object = object;
//     }
//     return this._object;
// }
// KDTree.Object.prototype.kill = function(){
//     this._object = null;
//     this._array = null;
// }
