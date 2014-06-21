// MLSMesh.js
function MLSMesh(){
	this._pointCloud = null;
	this._trangles = null;
	this._vertexes = null;
	this._edges = null;
	this._fronts = null;
	this._field = null;
}
MLSMesh.prototype.initWithPointCloud = function(cloud){

}
MLSMesh.prototype.triangulateSurface = function(rho){
	// ...
}
MLSMesh.prototype.triangulate = function(){
/*
	fronts = FirstFront()
	while(frontSet.length>0){
		current = fronts.first()
		// close front with only 3 vertexes - what about initial front?
		if(current.vertexCount()==3){
			current.closeFront()
			fronts.removeFront(current)
			continue
		}
		// ?
		e = current.bestEdge()
		if(e.canCutEar()){
			e.cutEar()
			continue
		}
		// 
		p = vertexPredict(edge,field)
		if( !triangleTooClose(e,p) ){ // 
			e.growTriangle() // ?
		}else{ // 
			front = closestFront(e,p)
			if(front==current){ // same front?
				front = fronts.split(current-front) // separate front from current
				fronts.addFront( front ) // add as new front
			}else{ // different fronts
				front = merge(current,front) // combine
				fronts.removeFront(front) // remove second copy from list
			}
		}
	}
*/
}



