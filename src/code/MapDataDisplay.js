// MapDataDisplay.js
// SOURCE DATA | DISPLAY VIEW DEMO SHOW VISUALIZE- connection relation communication

MapDataDisplay = function(source, field, element, updateElement, updateData){
	this.object(null);
	this.field(null);
	this.updateElementFxn(null);
	this.updateDataFxn(null);
	this.element(null);
	this.set(source, field, element, updateElement, updateData);
}

//field, value, updateElementFunction, elementField);

MapDataDisplay.prototype.set = function(source, field, element, updateElement, updateData){
	this.object(source);
	this.field(field);
	this.updateElementFxn(updateElement);
	this.updateDataFxn(updateData);
	this.element(element);
	return this;
}

MapDataDisplay.prototype.updateDataFromElement = function(){
	if(this._updateDataFxn!==null){
		this._updateDataFxn(this.object(), this.field(), this.element());
	}
}

MapDataDisplay.prototype.updateElementFromData = function(){
	if(this._updateElementFxn!==null){
		this._updateElementFxn(this.object(), this.field(), this.element());
	}
}

MapDataDisplay.prototype.object = function(o){
	if(o!==undefined){
		this._dataObject = o;
	}
	return this._dataObject;
}
MapDataDisplay.prototype.field = function(f){
	if(f!==undefined){
		this._objectField = f;
	}
	return this._objectField;
}
MapDataDisplay.prototype.updateDataFxn = function(u){
	if(u!==undefined){
		this._updateDataFxn = u;
	}
	return this._updateDataFxn;
}
MapDataDisplay.prototype.updateElementFxn = function(u){
	if(u!==undefined){
		this._updateElementFxn = u;
	}
	return this._updateElementFxn;
}
MapDataDisplay.prototype.element = function(e){
	if(e!==undefined){
		this._element = e;
	}
	return this._element;
}

