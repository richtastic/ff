// FragArray

// fradwindow

function FragArray(){
	this._maximumWindowCount = 100;
	this._windowCount = 0;
	this._windows = [];
	this._lower = null;
	this._upper = null;
	this._minimumIndex = null;
	this._maximumIndex = null;
}

FragArray.prototype.addElements = function(elements, startIndex, endIndex){
	// if start is less than minimum => cap to start
	// if end is greater than maximum => cap to end
	if(false){
		//
	}
}
FragArray.prototype.containsIndexInRange = function(startIndex, endIndex){
	if(this._window.length==0){
		return false;
	}
	// outside
	if(startIndex>this._maximumIndex){
		return false;
	}
	if(endIndex<this._minimumIndex){
		return false;
	}
	// maybe inside
	var i=0, len = this._windows.length;
	for(i=0;i<len;++i){
		var win = this._windows[i];
		var start = win["start"];
		var end = win["end"];
		if(!(startIndex>start && endIndex<end)){
			return true;
		}
	}
}
FragArray.prototype._createWindow = function(data, startIndex, endIndex);
	var win = {};
	win["start"] = startIndex;
	win["end"] = endIndex;
	win["data"] = data;
	return win;
}
FragArray.prototype._insertWindow = function(win);
	
}


// // catalog, segmented array, window, section, distributed, parceled, binned, partitioned, fragmented



