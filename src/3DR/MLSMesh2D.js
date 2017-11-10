// MLSMesh2D.js


function MLSMesh2D(points, angle){
	this._angle = Math.PI*0.1; // 18 degrees
	this._quadTree = new QuadTree();
	this.points(points);
	this.angle(angle);
}
MLSMesh2D.x = function(){
	// ... 
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh2D.prototype.points = function(p){
	//var 
	this._quadTree.initWithObjects(points);
}
MLSMesh2D.prototype.angle = function(a){ // constant angle ov curvature for 
	// ... 
}
MLSMesh2D.prototype.create = function(){ // main function to create the surface
	// estimate normals
	// propagate normals
	// estimate curvatures
	// init edge fronts & mesh
	// propagation loop
	// end 
}


MLSMesh2D.prototype.x = function(){
	// ... 
}



MLSMesh2D.prototype.x = function(){
	// ... 
}


MLSMesh2D.prototype.x = function(){
	// ... 
}


// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh2D.Point = function(point){
	this._point = point;
	this._normal = null;
	this._curvature = null;
}


















































































