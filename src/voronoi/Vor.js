// Vor.js
/*

circle from 3 points
animate wave-line-front propagation

*/
function Vor(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas,(1/10)*1000);
	this._root = new DO();
	this._stage.root().addChild(this._root);
	this._root.matrix().scale(1.0,-1.0);
	this._root.matrix().translate(200,500);
	this._stage.start();
	this.voronoi();
}
Vor.circleFromPoints = function(a,b,c, root){
	var lineAB = V2D.diff(a,b);
	var lineBC = V2D.diff(b,c);
	var lineAC = V2D.diff(a,c);
	var rotAB = V2D.rotate(lineAB,Math.PIO2);
	var rotBC = V2D.rotate(lineBC,Math.PIO2);
	var rotAC = V2D.rotate(lineAC,Math.PIO2);
	var midAB = V2D.midpoint(a,b);
	var midBC = V2D.midpoint(b,c);
	var midAC = V2D.midpoint(a,c);
	var cenA = Code.rayIntersect2D(midAB,rotAB, midBC,rotBC);
	var cenB = Code.rayIntersect2D(midBC,rotBC, midAC,rotAC);
	var cenC = Code.rayIntersect2D(midAC,rotAC, midAB,rotAB);
	var lenA = V2D.distance(cenA,a);
	var lenB = V2D.distance(cenB,b);
	var lenC = V2D.distance(cenC,c);
	// root.addChild( Vor.makePoint(midAB,5.0,0xFF00FF00) );
	// root.addChild( Vor.makeLine(midAB,V2D.add(midAB,rotAB),0xFF00FF00) );
	// root.addChild( Vor.makePoint(midBC,5.0,0xFF00FF00) );
	// root.addChild( Vor.makeLine(midBC,V2D.add(midBC,rotBC),0xFF00FF00) );
	// root.addChild( Vor.makePoint(midAC,5.0,0xFF00FF00) );
	// root.addChild( Vor.makeLine(midAC,V2D.add(midAC,rotAC),0xFF00FF00) );
	return {center:cenA, radius:lenA};
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
	var scale = 50.0;
	for(i=0;i<points.length;++i){
		points[i].x *= 50.0;
		points[i].y *= 50.0;
		this._root.addChild( Vor.makePoint(points[i]) );
	}
	//
	var circle = Vor.circleFromPoints(points[0],points[1],points[2],    this._root);
	// console.log(circle);
	// this._root.addChild( Vor.makeLine(points[0],points[1]) );
	// this._root.addChild( Vor.makeLine(points[1],points[2]) );
	// this._root.addChild( Vor.makeLine(points[2],points[0]) );
	// this._root.addChild( Vor.makeCircle(circle.center,circle.radius) );
	
	// animation:
	this._animPoints = points;
	var speed = 100;
	this._ticker = new Ticker(speed);
	this._ticker.addFunction(Ticker.EVENT_TICK,this.animation_tick,this);
	this._ticker.start();
	
	//voronoi.fortune(points);

	//console.log( voronoi.toString() );

	//voronoi.delaunay();
}
Vor.prototype.animation_tick = function(){
	var x, y, a, b, c, p, e, i, len, arc;
	if(this._animationTick===undefined){
		this._animationTick = 0;
		this._animDirectrix = new DO();
		this._animDirectrix.graphics().clear();
		this._animDirectrix.graphics().setLine(1.0,0xFF0000FF);
		this._animDirectrix.graphics().beginPath();
		this._animDirectrix.graphics().moveTo(-100,0);
		this._animDirectrix.graphics().lineTo(1000,0);
		this._animDirectrix.graphics().endPath();
		this._animDirectrix.graphics().strokeLine();
		this._root.addChild(this._animDirectrix);
		this._animParabolas = new DO();
		this._root.addChild( this._animParabolas );
		// ALGORITHM
		this._Q = new Voronoi.Queue();
		for(i=0;i<this._animPoints.length;++i){
			p = this._animPoints[i];
			this._Q.addEvent( new Voronoi.Event(p, Voronoi.EVENT_TYPE_SITE) );
		}
		console.log(this._Q.toString());
		this._T = new Voronoi.WaveFront();
		this._D = new Voronoi.EdgeList();
	}
	//
	this._animPosY = 375 - this._animationTick*0.5;
	this._animDirectrix.matrix().identity();
	this._animDirectrix.matrix().translate(0,this._animPosY);
	//
	this._animParabolas.graphics().clear();
	this._animParabolas.graphics().setLine(1.0,0xFF229933);
	this._animParabolas.graphics().beginPath();
	len = this._animPoints.length;
	var focus, left=-100, right=500;
	var deltaJ = (right-left)/100.0;
	for(i=0;i<len;++i){
		focus = this._animPoints[i];
		a = focus.x;
		b = focus.y;
		c = this._animPosY; // y = directrix
		for(j=left;j<=right;j+=deltaJ){
			x = j;
			y = ((x-a)*(x-a) + b*b - c*c)/(2*(b-c));
			if(j==left){
				this._animParabolas.graphics().moveTo(x,y);
			}else{
				this._animParabolas.graphics().lineTo(x,y);
			}
		}
	}
	this._animParabolas.graphics().moveTo(0,0);
	this._animParabolas.graphics().endPath();
	this._animParabolas.graphics().strokeLine();
	//
	// ALGORITHM
	var circleEvents;
	if( !this._Q.isEmpty() ){
		var next = this._Q.peek();
		//console.log(next.point().y);
		//console.log(this._animPosY);
		var directrix = this._animPosY;
		if(next && next.point().y>directrix){
			e = this._Q.next();
			console.log("popped "+e);
			if(e.type()==Voronoi.EVENT_TYPE_SITE){ // SITE
				if(this._T.isEmpty()){
					this._T.addArc( new Voronoi.Arc( e.point() ) );
				}else{
					// arc = this._T.arcAbovePointAndDirectrix(e.point(), directrix);
					// arc.removeCircleEventsFromQueue(this._Q);
					// this._T.splitArcAtPoint(arc,e.point());
					Voronoi.WaveFront.prototype.addArcAbovePointAndDirectrixAndQueue(e,point(),directrix);
				}
			}else{ // CIRCLE
				// arc will disappear
			}
		}
	}
	//
	this._animationTick++;
}




Vor.makeLine = function(a,b,col,wid){
	col = col!==undefined?col:0xFFFF0000;
	wid = wid!==undefined?wid:1.0;
	var d = new DO();
	d.graphics().clear();
	d.graphics().setLine(wid,col);
	d.graphics().beginPath();
	d.graphics().moveTo(a.x,a.y);
	d.graphics().lineTo(b.x,b.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	return d;
}
Vor.makeCircle = function(v,r,col,wid){
	col = col!==undefined?col:0xFFFF0000;
	wid = wid!==undefined?wid:1.0;
	var d = new DO();
	d.graphics().clear();
	d.graphics().setLine(wid,col);
	d.graphics().beginPath();
	d.graphics().drawCircle(v.x,v.y,r);
	d.graphics().endPath();
	d.graphics().strokeLine();
	return d;
}
Vor.makePoint = function(v,r,cf,cl){
	r = r!==undefined?r:2.0;
	cf = cf!==undefined?cf:0xFF666666;
	cl = cl!==undefined?cl:0x00000000;
	r *= 2.0;
	var d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,cl);
	d.graphics().setFill(cf);
	d.graphics().beginPath();
	d.graphics().moveTo(v.x,v.y);
	d.graphics().drawEllipse(v.x,v.y,r,r,0);
	d.graphics().fill();
	d.graphics().endPath();

	d.graphics().strokeLine();
	return d;
}

