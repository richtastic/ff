// View3DR.js
function View3DR(r,g,b){
	this._sourceImage = new ImageMat();
	this._sourceImage.setFromFloats(r,g,b);
	this._intrinsic = new Matrix(3,3).identity(); // K
	this._links = new Array();
	/*
	this._extrinsic = new Matrix(3,4).identity(); // M
	*/
}
// ------------------------------------------------------------------------------------------------------------------------ 
View3DR.prototype.source = function(s){
	if(s!==undefined){
		// 
	}
	return this._sourceImage;
}
View3DR.prototype.addLink = function(l){
	this._links.push(l);
}
View3DR.prototype.getRectification = function(epipole){
	return R3D.polarRectification(this.source(),epipole);
}

View3DR.prototype.x = function(){
	// 
}
View3DR.prototype.x = function(){
	// 
}

View3DR.prototype.kill = function(){
	Code.emptyArray(this._sourceImage);
}
