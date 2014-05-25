// Delaunay.js

function Delaunay(){
	this._vertexes = [];
	this._triangles = [];
}
// -----------------------------------------------------------------------------------
Delaunay.prototype.triangles = function(){
	return this._triangles;
}
Delaunay.prototype.vertexes = function(){
	return this._vertexes;
}
// -----------------------------------------------------------------------------------
Delaunay.prototype.fromVoronoi = function(voronoi){ // Voronoi.EdgeGraph
	var i, len, sites, site, edges, edge, prev, firstEdge, tri;
	Code.emptyArray(this._vertexes);
	Code.emptyArray(this._triangles);
	sites = voronoi.sites();
	// less than 3 sites, nothing to do:
	if(sites.length<3){
		return;
	}
	// give all sites a simple vertex
	len = sites.length;
	for(i=0;i<len;++i){
		site = sites[i];
		site.vertex = new Delaunay.Vertex(site.point());
	}
	// zero out all edge triangle counts
	edges = voronoi.edges();
	len = sites.length;
	for(i=0;i<len;++i){
		edges[i].triangle = 0;
	}
	// create triangles
	len = sites.length;
	for(i=0;i<len;++i){
		site = sites[i];
		edges = site.edges();
		edge = edges[0];
var count = 0;
		// find a non-infinite edge
		while( !edge.opposite() && count<100){
			edge = edge.next();
++count;
		}
console.log(count)
count = 0;
		firstEdge = edge;
		// find first non-infinite edge
		while( edge.prev() && edge.prev().opposite() && count<100){
			edge = edge.prev();
			if( edge==firstEdge){
				break;
			}
++count;
		}
console.log(count)
count = 0;
		firstEdge = edge;
		// create triangle for each edge
		while( edge.next() /*&& edge.next()!=firstEdge*/ && edge.next().opposite() && count<100){
			//if( !edge.triangle && !edge.next().triangle ){
			//if( !(edge.triangle || edge.next().triangle) ){

	// half-infinite edges have a max value of 1
	// regular edges have a max value of 2
			//if( edge.triangle<2 && edge.next().triangle<2 && edge.opposite().prev().triangle<2 ){
				var limitA = (edge.next().opposite()&&edge.prev().opposite())?2:1;
				var limitB = (edge.next().next().opposite()&&edge.opposite())?2:1;
				var limitC = (edge.opposite().next().opposite()&&edge.opposite().prev().opposite())?2:1;
				//console.log(limitA,limitB,limitC);
			// this would be an easier check before capping the sites
			if( edge.triangle<limitA && edge.next().triangle<limitB && edge.opposite().prev().triangle<limitC ){
				tri = new Delaunay.Triangle();
				tri.A( site.vertex );
				tri.B( edge.opposite().site().vertex );
				tri.C( edge.next().opposite().site().vertex );
				this._triangles.push(tri);
				// mark:
				// edge.triangle = tri;
				// edge.opposite().triangle = tri;
				// edge.next().triangle = tri;
				// edge.next().opposite().triangle = tri;
				edge.triangle++;
				edge.opposite().triangle++;
				edge.next().triangle++;
				edge.next().opposite().triangle++;

				edge.opposite().prev().triangle++;
				edge.opposite().prev().opposite().triangle++;
			}
			// mark edge with triangle-edge for non-duplication and later connections
			edge = edge.next();
			if( edge==firstEdge){
				break;
			}
++count;
		}
console.log(count)
count = 0;
	}
	// clear site simple vertexes
	sites = voronoi.sites();
	len = sites.length;
	for(i=0;i<len;++i){
		sites[i].vertex = null;
	}
	// clear all edge triangle counts
	edges = voronoi.edges();
	len = edges.length;
	for(i=0;i<len;++i){
		edges[i].triangle = 0;
	}
}

// -----------------------------------------------------------------------------------
Delaunay.Triangle = function(){
	this._a = null;
	this._b = null;
	this._c = null;
}
Delaunay.Triangle.prototype.A = function(v){
	if(v!==undefined){
		this._a = v;
	}
	return this._a;
}
Delaunay.Triangle.prototype.B = function(v){
	if(v!==undefined){
		this._b = v;
	}
	return this._b;
}
Delaunay.Triangle.prototype.C = function(v){
	if(v!==undefined){
		this._c = v;
	}
	return this._c;
}
// -----------------------------------------------------------------------------------
Delaunay.Vertex = function(p){
	this._point = new V2D();
	this.point(p);
}
Delaunay.Vertex.prototype.point = function(point){
	if(point!==undefined){
		this._point.copy(point);
	}
	return this._point;
}
// -----------------------------------------------------------------------------------







