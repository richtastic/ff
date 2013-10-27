// ColorFloat.js
function ColorFloat(r,g,b){
	this._red = 0;
	this._grn = 0;
	this._blu = 0;
	this._gry = this._calcGray();
}
ColorFloat.prototype._calcGray = function(){
	return (this._red+this._grn+this._blu)/3;
}
ColorFloat.prototype.red = function(){
	return this._red;
}
ColorFloat.prototype.grn = function(){
	return this._grn;
}
ColorFloat.prototype.blu = function(){
	return this._blu;
}
ColorFloat.prototype.gry = function(){
	return this._gry;
}

