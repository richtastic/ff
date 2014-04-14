// Scene3DR.js
function Scene3DR(){
	this._views = new Array();
	/*
	- 3D points [i]
	- triangle lattice
	- textures [i]
	- cameras [i]
	*/
}
// ------------------------------------------------------------------------------------------------------------------------ 
Scene3DR.prototype.addViewSource = function(r,g,b){
	var view = new View3DR(r,g,b);
	this._views.push(view);
}
Scene3DR.prototype.x = function(){
}
Scene3DR.prototype.kill = function(){
	//
}