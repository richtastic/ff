// ColorMatRGBY.js
function ColorMatRGBY(ptX,ptY, wid,hei, r,g,b,y, nW,nH){
	this._wid = nW;
	this._hei = nH;
	var len = nW*nH;
	this._red = new Array(len);
	this._grn = new Array(len);
	this._blu = new Array(len);
	this._gry = new Array(len);
	var i, j, nu, ol;
	var minX = Math.floor(ptX-(nW/2));
	var minY = Math.floor(ptY-(nH/2));
	for(i=0;i<nW;++i){
		for(j=0;j<nH;++j){
			nu = j*nW + i;
			ol = (minY+j)*wid + (minX+i);
			this._red[nu] = r[ol];
			this._grn[nu] = g[ol];
			this._blu[nu] = b[ol];
			this._gry[nu] = y[ol];
		}
	}
}
ColorMatRGBY.prototype.width = function(){
	return this._wid;
}
ColorMatRGBY.prototype.height = function(){
	return this._hei;
}
ColorMatRGBY.prototype.red = function(){
	return this._red;
}
ColorMatRGBY.prototype.grn = function(){
	return this._grn;
}
ColorMatRGBY.prototype.blu = function(){
	return this._blu;
}
ColorMatRGBY.prototype.gry = function(){
	return this._gry;
}

