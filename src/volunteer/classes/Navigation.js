// Navigation.js < PageWeb
Navigation.EVENT_ITEM_CLICKED = "EVENT_ITEM_CLICKED";

// ------------------------------------------------------------------------------ constructor
function Navigation(container,containerClass,listClass,itemClass, unselected, selected){
	Navigation._.constructor.apply(this,arguments);
	Code.addClass(this._root,containerClass);
	this._listContainer = Code.newListUnordered();
		Code.addClass(this._listContainer,listClass);
	this._navList = {};
	this._itemClass = itemClass;
	this._itemClassUnselected = unselected;
	this._itemClassSelected = selected;
	this._init();
}
Code.inheritClass(Navigation, PageWeb);
// ------------------------------------------------------------------------------ 
Navigation.prototype._init = function(){
	Code.addChild(this._root, this._listContainer);
}
// ------------------------------------------------------------------------------ get/set
Navigation.prototype.addMenuItem = function(referenceName,displayText){
	var li = Code.newListItem(displayText);
		Code.addClass(li,this._itemClass);
		Code.addChild(this._listContainer,li);
	this._navList[referenceName] = li;
	Code.addListenerClick(li,this._itemClicked,this);
}
Navigation.prototype.removeMenuItem = function(referenceName){
	//
}
Navigation.prototype.setSelected = function(name){
	for(key in this._navList){
		Code.removeClass(this._navList[key], this._itemClassUnselected);
		Code.removeClass(this._navList[key], this._itemClassSelected);
		Code.addClass(this._navList[key], this._itemClassUnselected);
	}
	Code.removeClass(this._navList[name], this._itemClassUnselected);
	Code.addClass(this._navList[name], this._itemClassSelected);
}
// ------------------------------------------------------------------------------ events
Navigation.prototype._itemClicked = function(e){
	var o = Code.getTargetFromMouseEvent(e);
	var key, found = null;
	for(key in this._navList){
		if(this._navList[key]==o){
			found = this._navList[key]; break;
		}
	}
	if(found!=null){
		this.alertAll(Navigation.EVENT_ITEM_CLICKED, key, found);
		this.setSelected(key);
	}
}
// ------------------------------------------------------------------------------ 
Navigation.prototype.wtf = function(){
	//
}

