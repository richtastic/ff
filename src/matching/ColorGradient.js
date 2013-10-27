// ColorGradient.js
function ColorGradient(rx,ry, gx,gy, bx,by, yx,yy){
	this._red = new V2D();
	this._grn = new V2D();
	this._blu = new V2D();
	this._gry = new V2D();
	this.red(rx,ry);
}
ColorGradient.prototype.red = function(rx,ry){
	if(arguments.length>0){
		this._red.set(rx,ry);
	}
	return this._red;
}
ColorGradient.prototype.grn = function(gx,gy){
	if(arguments.length>0){
		this._grn.set(gx,gy);
	}
	return this._grn;
}
ColorGradient.prototype.blu = function(bx,by){
	if(arguments.length>0){
		this._blu.set(bx,by);
	}
	return this._blu;
}
ColorGradient.prototype.gry = function(yx,yy){
	if(arguments.length>0){
		this._gry.set(yx,yy);
	}
	return this._gry;
}

