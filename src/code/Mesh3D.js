// Mesh3D.js
Mesh3D.X = 0;

function Mesh3D(angle, points){
	this._angle = Math.PI*0.1; // 18 degrees
	this._pointSpace = new OctTree(Mesh2D._pointToPoint);
	this._triangleSpace = new OctSpace(Mesh2D._triToCuboid);
	this._points = null;
	this.angle(angle);
	this.points(points);
}


// --------------------------------------------------------------------------------------------------------
Mesh3D._pointToPoint = function(point){
	return point.point();
}
Mesh3D._triToCuboid = function(tri){
	return tri.cuboid();
}
Mesh3D.x = function(){
	return null;
}

// --------------------------------------------------------------------------------------------------------
Mesh3D.prototype.x = function(){
	return null;
}












