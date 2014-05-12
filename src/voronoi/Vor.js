// Vor.js

function Vor(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas,(1/10)*1000);
	this._root = new DO();
	this._stage.root().addChild(this._root);
	this._root.matrix().scale(1.0,-1.0);
	//this._root.matrix().scale(2.0);
	this._root.matrix().translate(400,500);
	this._stage.start();
	this.voronoi();
	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.keyboardFxnKeyDown, this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.keyboardFxnKeyDown2, this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.keyboardFxnKeyUp, this);
	this._keyboard.addListeners();
}
	
Vor.prototype.keyboardFxnKeyUp = function(e){
	// console.log("key up "+e);
}
Vor.prototype.keyboardFxnKeyDown = function(e){
	// console.log("key down "+e);
	if(e.keyCode==Keyboard.KEY_SPACE){
		if(this._ticker.isRunning()){
			console.log("PAUSE");
			this._ticker.stop();
		}else{
			console.log("START");
			this._ticker.start();
		}
	}
}
Vor.prototype.keyboardFxnKeyDown2 = function(e){
	// console.log("key still down "+e);
}

Vor.prototype.voronoi = function(){
	var points = new Array();
	//points.push( new V2D(1,1) );
	points.push( new V2D(0,6) );
	points.push( new V2D(2,7) );
//	points.push( new V2D(3,4) );
//	points.push( new V2D(5,2) );
//	points.push( new V2D(5,6) );
	points.push( new V2D(6,4) );
	points.push( new V2D(8,2) );
points.push( new V2D(1,8) );
points.push( new V2D(0.5,7) );
points.push( new V2D(0,0) );
	voronoi = new Voronoi();
	var scale = 50.0;
	for(i=0;i<points.length;++i){
		points[i].x *= 50.0;
		points[i].y *= 50.0;
		this._root.addChild( Vor.makePoint(points[i]) );
	}
	//
//	var circle = Vor.circleFromPoints(points[0],points[1],points[2],    this._root);
	// console.log(circle);
	// this._root.addChild( Vor.makeLine(points[0],points[1]) );
	// this._root.addChild( Vor.makeLine(points[1],points[2]) );
	// this._root.addChild( Vor.makeLine(points[2],points[0]) );
	// this._root.addChild( Vor.makeCircle(circle.center,circle.radius) );
	
	// animation:
	this._animPoints = points;
	var speed = 50;
	this._ticker = new Ticker(speed);
	this._ticker.addFunction(Ticker.EVENT_TICK,this.animation_tick,this);
	this._ticker.start();
	
	//voronoi.fortune(points);

	//console.log( voronoi.toString() );

	//voronoi.delaunay();
}
Vor.prototype.animation_tick = function(){
	var x, y, a, b, c, p, e, i, j, len, arc;
	var limitLeft = -300, limitRight = 900;
	if(this._animationTick===undefined){
		this._animationTick = 0;
		this._animDirectrix = new DO();
		this._animDirectrix.graphics().clear();
		this._animDirectrix.graphics().setLine(1.0,0xFF0000FF);
		this._animDirectrix.graphics().beginPath();
		this._animDirectrix.graphics().moveTo(limitLeft,0);
		this._animDirectrix.graphics().lineTo(limitRight,0);
		this._animDirectrix.graphics().endPath();
		this._animDirectrix.graphics().strokeLine();
		this._root.addChild(this._animDirectrix);
		this._animParabolas = new DO();
		this._stillVornoi = new DO();
		this._stillVornoi.graphics().setFill(0xFFDDAA33);
		this._root.addChild( this._stillVornoi );
		this._root.addChild( this._animParabolas );
		// ALGORITHM
		this._Q = new Voronoi.Queue();
		for(i=0;i<this._animPoints.length;++i){
			p = this._animPoints[i];
			e = new Voronoi.Event(p, Voronoi.EVENT_TYPE_SITE);
			e.site( new Voronoi.Site(p) );
			this._Q.addEvent( e );
		}
		console.log(this._Q.toString());
		this._T = new Voronoi.WaveFront();
		this._D = new Voronoi.EdgeGraph();
		this._directrix = new V2D();
	}
	var circleEvents, halfEdge, next, arc, directrix, node, left, right, leftPoint, intPoint, arr, parabola;
	this._directrix.y = this._animPosY;
	directrix = this._directrix.y;
	//
	var offYStart = 360;//375;
	var rateStart = 1.5;//2.5;
	this._animPosY = offYStart - this._animationTick*rateStart;
	this._animDirectrix.matrix().identity();
	this._animDirectrix.matrix().translate(0,this._animPosY);
	//
	this._animParabolas.graphics().clear();
	this._animParabolas.graphics().setLine(1.0,0xFF229933);
	this._animParabolas.graphics().beginPath();
	len = this._animPoints.length;
	var focus, left=limitLeft, right=limitRight;
	var deltaJ = (right-left)/100.0;
	for(i=0;i<len;++i){
		focus = this._animPoints[i];
		a = focus.x;
		b = focus.y;
		c = directrix;
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
	// DRAW WAVEFRONT INTERSECTIONS ...
	//this._animParabolas.graphics().clear();
	this._animParabolas.graphics().setLine(2.0,0xFFCC0066);
	this._animParabolas.graphics().beginPath();
	node = this._T.root().minimumNode();
		var count = 0;
		while(node){
//console.log(node);
			arc = node.data();
			parabola = arc.center().point();
//console.log(parabola.toString(),directrix);
			var intersections = arc.intersections();
//console.log(intersections);
			// left limit
			left = new V2D(limitLeft,0);
			if(intersections[0]){
				if(intersections[0].x>left.x){
					left = intersections[0];
					this._stillVornoi.graphics().beginPath();
					this._stillVornoi.graphics().drawCircle(left.x,left.y,2.0);
					this._stillVornoi.graphics().endPath();
					this._stillVornoi.graphics().fill();
				}
			}
			// right limit
			right = new V2D(limitRight,0);
			if(intersections[1]){
				if(intersections[1].x<right.x){
					right = intersections[1];
					this._stillVornoi.graphics().beginPath();
					this._stillVornoi.graphics().drawCircle(right.x,right.y,2.0);
					this._stillVornoi.graphics().endPath();
					this._stillVornoi.graphics().fill();
				}
			}
			deltaJ = (right.x-left.x)/50.0;
			arr = Code.parabolaABCFromFocusDirectrix(parabola,directrix);
			a = arr[0], b = arr[1], c = arr[2];
			//a = parabola.x; b = parabola.y; c = directrix;
			for(j=left.x;j<=right.x;j+=deltaJ){
				x = j;
				y = a*x*x + b*x + c;
				//y = ((x-a)*(x-a) + b*b - c*c)/(2.0*(b-c));
				if(j==left.x && count==0){
					this._animParabolas.graphics().moveTo(x,y);
				}else{
					this._animParabolas.graphics().lineTo(x,y);
				}
			}
			node = this._T.nextNode(arc);
			if(count >= 10){
				console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
				node = null;
				throw new Error();
			}
			++count;
		}
		node = null;
	//console.log(count);
	this._animParabolas.graphics().moveTo(0,0);
	this._animParabolas.graphics().endPath();
	this._animParabolas.graphics().strokeLine();
	
	// DRAW CIRCLES IN QUEUE:
	var eventList = this._Q._list
	for(i=0;i<eventList.length;++i){
		var e = eventList[i];
		if(e.isCircleEvent()){
			var circle = e.circle();
			// center
			this._animParabolas.graphics().setFill(0xFF0000FF);
			this._animParabolas.graphics().beginPath();
			this._animParabolas.graphics().drawCircle(circle.center.x,circle.center.y,3.0);
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().fill();
			// perimeter
			this._animParabolas.graphics().setLine(1.0,0xFF3333CC);
			this._animParabolas.graphics().beginPath();
			this._animParabolas.graphics().drawCircle(circle.center.x,circle.center.y,circle.radius);
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().strokeLine();
			// bottom
			this._animParabolas.graphics().setFill(0xFF00CCFF);
			this._animParabolas.graphics().beginPath();
			this._animParabolas.graphics().drawCircle(e.point().x,e.point().y,3.0);
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().fill();
		}
	}

	// DRAW CURRENT GRAPH
	this._animParabolas.graphics().setLine(1.0,0xFFFF00FF);
	var face, halfEdge, edges, faces = this._D.sites();
	for(i=0;i<faces.length;++i){
		face = faces[i];
		edges = face.edges();
		for(j=0;j<edges.length;++j){
			halfEdge = edges[j];
			if(halfEdge.vertexA() && halfEdge.vertexB()){
				var pointA = halfEdge.vertexA().point();
				var pointB = halfEdge.vertexB().point();
				this._animParabolas.graphics().beginPath();
				this._animParabolas.graphics().moveTo(pointA.x,pointA.y);
				this._animParabolas.graphics().lineTo(pointB.x,pointB.y);
				this._animParabolas.graphics().endPath();
				this._animParabolas.graphics().strokeLine();
			}
		}
	}

	// ALGORITHM
	if( !this._Q.isEmpty() ){
		next = this._Q.peek();
//console.log(next);
		while(next && next.point().y>this._directrix.y){
console.log(this._Q.toString()+"    + "+this._directrix.toString());
var temp = new V2D(this._directrix.x,this._directrix.y);
			e = this._Q.next();
this._directrix.copy( e.point() );
console.log("popped "+e);
console.log(this._T.toString());
			if(e.isSiteEvent()){
				this._T.addArcAboveSiteAndDirectrixAndQueueAndGraph(e, this._directrix, this._Q, this._D);
			}else{
				this._T.removeArcAtCircleWithDirectrixAndQueueAndGraph(e, this._directrix, this._Q, this._D);
			}
			next = this._Q.peek();
console.log("\n");
console.log(this._T.toString());
console.log("\n");
this._directrix.copy( temp );
console.log("-------------------------------------------------------------------------------------------------------");
		}
	}else{
		this._ticker.stop();
		// DRAW FINAL IMAGE
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

