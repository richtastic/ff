// FragArray

// fradwindow

function FragArray(mergeFxn){
	this._maximumWindowCount = 10;
	this._windowCount = 0;
	this._windows = [];
	this._lower = null;
	this._upper = null;
	this._minimumIndex = null;
	this._maximumIndex = null;
	//
	this._mergeFxn = FragArray._defaultMerge;
	this._endUpdateFxn = FragArray._defaultUpdateEnd;
}
FragArray._defaultUpdateEnd = function(dataWas,startWas,endWas, isRight){
	if(isRight){
		this._setEndMax(dataWas, startWas, endWas);
	}else{
		this._setEndMin(dataWas, startWas, endWas);
	}
}
FragArray._defaultMerge = function(dataA,startA,endA, dataB,startB,endB, startIndex,endIndex){
	var countA = startA-endA+1;
	var countB = startB-endB+1;
	var count = endIndex-startIndex+1;
	var list = new Array(count);
	var i;
	for(i=startA;i<=endA;++i){
		list[i-count] = dataA[i];
	}
	for(i=startB;i<=endB;++i){
		list[i-count] = dataB[i];
	}
	return list;
}
FragArray.prototype._trimToMaxLength = function(keepRight){
	keepRight = keepRight !== undefined ? keepRight : false;
	var i;
	var len = this._windows.length;
	var totalCount = 0;
	if(len==0){
		// check ends ?
	}else{
		if(false){//keepRight){
			console.log("keep right");
		}else{
			console.log("keep left");
			//var minIndex = null;
			for(i=0;i<this._windows.length;++i){
				var win = this._windows[i];
				// if(minIndex===null){
				// 	minIndex = win["start"];
				// }
				var count = win["end"] - win["start"] + 1;
				var tempCount = totalCount + count;
				console.log("count: "+count)
				console.log(tempCount+" <?< "+this._maximumWindowCount);
				if(tempCount<=this._maximumWindowCount){
					var totalCount = tempCount;
				}else{
					var keepCount = this._maximumWindowCount - count + 1;
					var removeCount = count - keepCount
					console.log("keep this many: "+keepCount+", remove:"+removeCount);
					// DIVIDE THIS BLOCK UP
//					HERE
					//
					while(this._windows.length>i){ // drop remaining
						this._windows.pop();
					}
					break;
				}
			}
		}
	}
}
FragArray.prototype.setEndMin = function(data, startIndex, endIndex){
	this._lower = this._createWindow(data,startIndex,endIndex);
}
FragArray.prototype.setEndMax = function(data, startIndex, endIndex){
	this._upper = this._createWindow(data,startIndex,endIndex);
}
FragArray.prototype.addElements = function(elements, startIndex, endIndex){
	// if start is less than minimum => cap to start
	// if end is greater than maximum => cap to end
	if(false){
		//
	}
	console.log("add...");
	var win = this._createWindow(elements, startIndex, endIndex);
	this._insertWindow(win);
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

FragArray.prototype._createWindow = function(data, startIndex, endIndex){
	if(!data || startIndex>endIndex){
		return null;
	}
	var win = {};
	win["start"] = startIndex;
	win["end"] = endIndex;
	win["data"] = data;
	console.log("CREATE WN",win);
	return win;
}

FragArray.prototype._mergeWindows = function(winA,winB){
	console.log("merge : "+winA["start"]+"->"+winA["end"]+"  "+winB["start"]+"->"+winB["end"]+" ");
	var A = null;
	var B = null;
	if(winA["end"] < winB["start"]-1 || winA["start"]+1 < winB["end"]){
		return null; // no overlapping
	}
	if(winA["start"] < winB["start"]){
		A = winA;
		B = winB;
	}else{
		A = winB;
		B = winA;
	}
	var min = A["start"];
	var max = B["end"];
	data = this._mergeFxn(A["data"],A["start"],A["end"], B["data"],B["start"],B["end"], min, max);
	var newWin = this._createWindow(data, min, max);
	return newWin;
}
FragArray.prototype._insertWindow = function(window){
	if(!window){
		return;
	}
	var i;
	var insertIndex = 0;
	var merging = false;
	var isRight = false;
	
	for(i=0; i<this._windows.length; ++i){
		var win = this._windows[i];
		if(!merging){
			if(window["end"] < win["start"]+1){ // found avail slot before
				break;
			}
			if(window["start"]-1 > win["end"]){ // slot is after
				insertIndex = i+1;
				continue;
			}
			// adjacent | intersection
			var winNew = this._mergeWindows(window,win);
			if(winNew){
				this._windows[i] = winNew;
				merging = true; // have to merge subsequent intersections
				if(i==this._windows.length-1){ // is on upper end
					console.log("merge keep right A");
					isRight = true;
				}
			}else{
				break;
			}
		}else{
			var oldWin = this._windows[i-1];
			var newWin = this._mergeWindows(oldWin,win);
			if(newWin){
				this._windows[i-1] = winNew;
				Code.removeElementAt(this._windows,i);
				i--; // recheck
				if(i==this._windows.length-1){ // is on upper end
					console.log("merge keep right B");
					isRight = true;
				}
			}else{
				break;
			}
		}
	}
	if(!merging){
		this._windows[insertIndex] = window;
	}
	this._trimToMaxLength(isRight);
}

FragArray.prototype.toString = function(){
	var str = "[Frag: ";
	var i, len = this._windows.length;
	if(this._lower){
		str += "[lower...]";
	}
	for(i=0; i<len; ++i){
		var win = this._windows[i];
		str += "["+win["start"]+".."+win["end"]+"]";
	}
	if(this._upper){
		str += "[...upper]";
	}
	var any = this._lower || this._upper || len > 0;
	if(!any){
		str += "(empty)";
	}
	str += " ]";
	return str;
}

FragArray.prototype.kill = function(win){
	this._windows = null;
}

// // catalog, segmented array, window, section, distributed, parceled, binned, partitioned, fragmented



