// Vor.js

function Vor(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas,(1/10)*1000);
	this._root = new DO();
	this._stage.root().addChild(this._root);
	this._root.matrix().scale(10.0,-10.0);
	this._root.matrix().translate(200,200);
	this._stage.start();
	this.voronoi();
}
Vor.prototype.voronoi = function(){
	var points = new Array();
	points.push( new V2D(1,1) );
	points.push( new V2D(1,5) );
	points.push( new V2D(2,7) );
	points.push( new V2D(3,4) );
	points.push( new V2D(5,2) );
	points.push( new V2D(5,6) );
	points.push( new V2D(6,4) );
	points.push( new V2D(8,2) );
	voronoi = new Voronoi();
	for(i=0;i<points.length;++i){
		this._root.addChild( Vor.makePoint(points[i]) );
	}
	//
	
	voronoi.fortune(points);

	console.log( voronoi.toString() );

	//voronoi.delaunay();
}
Vor.makePoint = function(v,r){
	r = r!==undefined?r:2.0;
	var d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFF333333);
	d.graphics().beginPath();
	d.graphics().moveTo(v.x,v.y);
	d.graphics().drawEllipse(v.x,v.y,r,r,0);
	d.graphics().fill(0xFF666666);
	d.graphics().endPath();
	//d.graphics().strokeLine();
	return d;
}

