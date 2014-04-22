// View3DR.js
function View3DR(){
	this._sourceImage = new ImageMat();
	this._intrinsic = new Matrix(3,3).identity(); // K
	this._links = new Array();
	this._featuresPutative = new Array();
	this._featuresResolved = new Array();
}
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
View3DR._deepCopyV3DHomoArray = function(to,from){
	Code.emptyArray(to);
	var i, len = from.length;
	for(i=0;i<len;++i){
		to.push( new V3D(from[i].x,from[i].y,1.0) );
	}
}
View3DR.scalePointList = function(list,scaleX,scaleY){
	for(var i=list.length;i--;){
		list[i].x *= scaleX; list[i].y *= scaleY;
	}
	return list;
}
// 
View3DR.prototype.putativePoints = function(list){ // assumed [0-1]
	if(list){
		View3DR._deepCopyV3DHomoArray(this._featuresPutative,list);
	}
	return this._featuresPutative;
}
View3DR.prototype.resolvedPoints = function(list){ // assumed [0-1]
	if(list){
		View3DR._deepCopyV3DHomoArray(this._featuresResolved,list);
	}
	return this._featuresResolved;
}
View3DR.prototype.resolvedPointsImageCoords = function(list){
	if(list){ // set
		View3DR.scalePointList(list,1.0/this.source().width(),1.0/this.source().height());
		list = this.resolvedPoints(list);
	}else{ // get
		list = this.resolvedPoints();
		View3DR.scalePointList(list,this.source().width(),this.source().height());
	}
	return list;
}
View3DR.prototype.source = function(r,g,b,w,h){
	if(r!==undefined){
		if(w!==undefined && h!==undefined){ // R, G, B, width, height
			this._sourceImage.init(w,h,r,g,b);
		}else if(g!==undefined && b!==undefined){ // Gray, width, height
			this._sourceImage.init(w,h,r);
		}else{ // ImageMat
			this._sourceImage.copy(r);
		}
	}
	return this._sourceImage;
}
View3DR.prototype.width = function(){
	return this._sourceImage.width();
}
View3DR.prototype.height = function(){
	return this._sourceImage.height();
}
// ------------------------------------------------------------------------------------------------------------------------ FUNCTIONAL
View3DR.prototype.addLink = function(l){
	this._links.push(l);
}
View3DR.prototype.getRectification = function(epipole){
	var wid = this._sourceImage.width();
	var hei = this._sourceImage.height();
	var e = new V2D(epipole.x*wid,epipole.y*hei);
	var wrapper = {source:this.source(), width:wid, height:hei};
	return R3D.polarRectification(wrapper,e);
}
// ------------------------------------------------------------------------------------------------------------------------ PROCESSING
View3DR.prototype.x = function(){
	// 
}
View3DR.prototype.x = function(){
	// 
}

View3DR.prototype.kill = function(){
	Code.emptyArray(this._sourceImage);
}
