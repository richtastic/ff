// ColorAngle.js
function ColorAngle(r,g,b,y){
	this._red = 0;
	this._grn = 0;
	this._blu = 0;
	this._gry = y;
}
ColorAngle.prototype.red = function(r){
	if(arguments.length>0){
		this._red = r;
	}
	return this._red;
}
ColorAngle.prototype.grn = function(){
	return this._grn;
}
ColorAngle.prototype.blu = function(){
	return this._blu;
}
ColorAngle.prototype.gry = function(){
	return this._gry;
}

