// Vor.js

function Vor(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas,(1/10)*1000);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._root.matrix().scale(1.0,-1.0);
	//this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	//this._root.matrix().scale(2.0);
	this._root.matrix().translate(200,600);
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
// DISPLAY GROUP:
	// points.push( new V2D(-3,7) );
	// points.push( new V2D(-2,4) );
	// points.push( new V2D(-1,5) );
	// points.push( new V2D(-0.5,1) );
	// points.push( new V2D(0,3) );
	// points.push( new V2D(1,8) );
	// points.push( new V2D(2,4.5) );
	// points.push( new V2D(2.5,3) );
	// points.push( new V2D(3,7) );
	// points.push( new V2D(4,0) );
	// points.push( new V2D(4.5,4) );
	// points.push( new V2D(5,9) );
	// points.push( new V2D(6,2) );
	// points.push( new V2D(7,6) );
	// points.push( new V2D(7.5,3) );
	// points.push( new V2D(8,7) );
	// points.push( new V2D(9,6) );
	// points.push( new V2D(10,4) );
	// points.push( new V2D(11,3) );
	// points.push( new V2D(12,2) );
	// points.push( new V2D(13,0) );
	// points.push( new V2D(14,6) );
	// points.push( new V2D(15,9) );
	// points.push( new V2D(15.5,4) );
	// points.push( new V2D(16,8) );
	// points.push( new V2D(17,5.5) );
	// points.push( new V2D(18,2) );
	// points.push( new V2D(19,1) );
	// points.push( new V2D(20,6) );

// VALENCE 4 VERTEX IN HERE SOMEWHERE:
	// points.push( new V2D(-3,7) );
	// points.push( new V2D(-2,4) );
	// points.push( new V2D(-1,5) );
	// points.push( new V2D(-0.5,1) );
	// points.push( new V2D(0,3) );
	// points.push( new V2D(1,8) );
	// points.push( new V2D(2,4.5) );
	// points.push( new V2D(2.5,3) );
	// points.push( new V2D(3,7) );
	// points.push( new V2D(4,0) );
	// points.push( new V2D(4.5,4) );
	// points.push( new V2D(5,9) );
	// points.push( new V2D(6,2) );
	// points.push( new V2D(7,6) );
	// points.push( new V2D(7.5,3) );
	// points.push( new V2D(8,8) );
	// points.push( new V2D(9,6) );
	// points.push( new V2D(10,4) );
	// points.push( new V2D(11,3) );
	// points.push( new V2D(12,2) );
	// points.push( new V2D(13,0) );
	// points.push( new V2D(14,6) );
	// points.push( new V2D(15,9) );
	// points.push( new V2D(15.5,4) );


// NEW TEST
points.push( new V2D(226,87) );
points.push( new V2D(172,107) );
points.push( new V2D(216,154) );
points.push( new V2D(22.5,166) );
points.push( new V2D(361,183) );
points.push( new V2D(18,225) );


// TEST GROUP:
/*
	points.push( new V2D(5,8) );
	points.push( new V2D(6,7.5) );
	points.push( new V2D(4,7) );
	points.push( new V2D(3,5) );
	points.push( new V2D(7,5) );
	points.push( new V2D(9.5,4) );
	points.push( new V2D(5,3) );
	points.push( new V2D(3,2.75) );
	points.push( new V2D(7,2.75) );
	points.push( new V2D(5.5,2.5) );
*/
// points.push( new V2D(3,6) );
// points.push( new V2D(4,6) );
// points.push( new V2D(5.5,4) );

// points.push( new V2D(3,6) );
// points.push( new V2D(5,6) );
// points.push( new V2D(4,6) );
// points.push( new V2D(5,5) );
// points.push( new V2D(5.5,4) );

// points.push( new V2D(3,6) );
// points.push( new V2D(5,6) );
// points.push( new V2D(4,6) );


	// points.push( new V2D(2,7) );
	// points.push( new V2D(3,4) );
	// points.push( new V2D(5,2) );
	// points.push( new V2D(5,6) );
	// points.push( new V2D(6,4) );
	// points.push( new V2D(8,2) );
	// points.push( new V2D(3,7.0) );
	// points.push( new V2D(3.5,7.0) );
	// points.push( new V2D(5,7.5) );

// points.push( new V2D(1,1) );
// points.push( new V2D(0,6) );
// points.push( new V2D(1,8) );
// points.push( new V2D(0.5,7) );
// points.push( new V2D(0,0) );
// points.push( new V2D(1.4,6.2) );
// points.push( new V2D(1.5,6.2) );
// points.push( new V2D(1.6,6.2) );
// points.push( new V2D(3.4,7.2) );
// points.push( new V2D(3.5,7.1) );
// points.push( new V2D(4.7,7.0) );
// points.push( new V2D(3.4,7.4) );
// points.push( new V2D(3.5,7.3) );
// points.push( new V2D(3.1,6.6) );
// points.push( new V2D(4.1,5.6) );
// points.push( new V2D(3.1,5.7) );
// points.push( new V2D(6.6,4.6) );
// points.push( new V2D(6.4,4.7) );
// for(i=0;i<50;++i){
// 	points.push( new V2D(Math.random()*30,Math.random()*10) );
// }
// remove duplicate points 
Voronoi.removeDuplicatePoints2D(points);
//Voronoi.removePointsBelow(points, new V2D(0,5.0));
	voronoi = new Voronoi();
	var scale = 1;//1*30.0;
	for(i=0;i<points.length;++i){
		points[i].x *= scale;
		points[i].y *= scale;
		points[i].y -= 100;
		this._root.addChild( Vor.makePoint(points[i]) );
	}
	// IF
if(false){
	animation:
	this._animPoints = points;
	var speed = 50;
	this._ticker = new Ticker(speed);
	this._ticker.addFunction(Ticker.EVENT_TICK,this.animation_tick,this);
	this._ticker.start();
	return;
}else{
	// ELSE
	this._D = Voronoi.fortune(points);
	var col = 0x0000FF00;
	var site, sites, edge, edges, A, B;
		sites = this._D.sites();
	this._animParabolas = new DO();
	this._root.addChild( this._animParabolas );

	//console.log( voronoi.toString() );
GLOBALSTAGE = this._root;
	//var triangles = Voronoi.delaunay(ponits);
	var display = GLOBALSTAGE;
	
/*
var sites = this._D.sites();
for(i=0; i<sites.length; ++i){
	var site = sites[i];
	//if(true){
	//if(i==0){ // 0, 1, 2, 6, 7, 11
		var edges = site.edges();
		for(j=0; j<edges.length; ++j){
			var edge = edges[j];
			console.log(edge.vertexA()+" => "+edge.vertexB());
			var a = edge.site();
			var b = edge.opposite().site();
			display.graphics().beginPath();
			display.graphics().setLine(5.0,0xFF00FF00);
			//display.graphics().setFill(0x330000FF);
			display.graphics().moveTo(a.point().x,a.point().y);
			display.graphics().lineTo(b.point().x,b.point().y);
			display.graphics().endPath();
			display.graphics().strokeLine();
			display.graphics().fill();
		}
	//}
}
*/

	var triangles = this._D.triangulate();
	// OR
	// var d = new Delaunay();
	// d.fromVoronoi(this._D.sites(),this._D.edges());
	// var triangles = d.triangles();

	for(i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		//tri.jitter(20);
		var pointA = tri.A();
		var pointB = tri.B();
		var pointC = tri.C();
			// pointA = pointA.point();
			// pointB = pointB.point();
			// pointC = pointC.point();
		display.graphics().beginPath();
		display.graphics().setLine(1.0,0xFFFF0000);
		display.graphics().setFill(0x110000FF);
		display.graphics().moveTo(pointA.x,pointA.y);
		display.graphics().lineTo(pointB.x,pointB.y);
		display.graphics().lineTo(pointC.x,pointC.y);
		display.graphics().endPath();
		display.graphics().strokeLine();
		display.graphics().fill();
	}
	var convexHull = this._D.convexHull();
	display.graphics().beginPath();
	display.graphics().setLine(2.0,0xFF00FF00);
	display.graphics().drawPolygon(convexHull,true);
	display.graphics().strokeLine();
	

	this._D.finalize(this._animParabolas);
		this._animParabolas.graphics().clear();
		// DRAW FINAL IMAGE
		//this._animParabolas.graphics().setLine(1.0,0xFF333399);
		for(i=0;i<sites.length;++i){
			//console.log("SITE:"+i);
			site = sites[i];
			edges = site.edges();
			var count = 0;
			edge = edges[0];
			var firstEdge = edge;
			count = 0;
			A = edge.vertexA();
			B = edge.vertexB();
			this._animParabolas.graphics().beginPath();
			//var col = Code.getColARGB(0x33,Math.floor(Math.random()*256.0),Math.floor(Math.random()*256.0),0xFF);
			this._animParabolas.graphics().setFill(col);
			this._animParabolas.graphics().setLine(2.0,0xFF330099);
			if(A){
				this._animParabolas.graphics().moveTo(A.point().x+Vor.magRand(),A.point().y+Vor.magRand());
			}
			while(edge && count<15){
				B = edge.vertexB();
				if(B && (edge.next()!==firstEdge) ){
					this._animParabolas.graphics().lineTo(B.point().x+Vor.magRand(),B.point().y+Vor.magRand());
				}
				edge = edge.next();
				if(edge==firstEdge){
					break;
				}
				++count;
			}
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().strokeLine();
			this._animParabolas.graphics().fill();
		}
	}
}
Vor.prototype.animation_tick = function(t){
	var x, y, a, b, c, p, e, i, j, len, arc;
	var limitLeft = -200, limitRight = 1000;
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
		this._T = new Voronoi.WaveFront();
		this._D = new Voronoi.EdgeGraph();
		this._directrix = new V2D();
	}
	var circleEvents, halfEdge, next, arc, directrix, node, left, right, leftPoint, intPoint, arr, parabola;

//
	this._directrix.y = this._animPosY;
	directrix = this._directrix.y;
	//
	var offYStart = 400;//420;
	var rateStart = 0.5;//12.5;


	// ALGORITHM
	if( !this._Q.isEmpty() ){
//console.log("Q: "+this._Q);
		next = this._Q.peek();
var looped = false;
		while(next && next.point().y>this._directrix.y){
looped = true;
//console.log(" \n"+this._Q.toString()+"    + "+this._directrix.toString());
// console.log(" TREE A:\n"+this._T._tree+"\n");
var temp = new V2D(this._directrix.x,this._directrix.y);
			e = this._Q.next();
this._directrix.copy( e.point() );
			if(e.isSiteEvent()){
				this._T.addArcAboveSiteAndDirectrixAndQueueAndGraph(e, this._directrix, this._Q, this._D);
			}else{
				this._T.removeArcAtCircleWithDirectrixAndQueueAndGraph(e, this._directrix, this._Q, this._D);
			}
			next = this._Q.peek();
this._directrix.copy( temp );
//console.log("-------------------------------------------------------------------------------------------------------");
		}
		if(looped){ // pause at event
			this._ticker.stop();
		}
		console.log(" TREE B:\n"+this._T._tree+"\n");
		//console.log(" TREE B:\n"+this._T._tree.toArray()+"\n");

	}else{
		this._ticker.stop();
console.log("FINALIZE!");


this._D.removeDuplicates();
		var site, sites, edge, edges, A, B;
		sites = this._D.sites();
		// for(i=0;i<sites.length;++i){
		// 	site = sites[i];
		// 	edges = site.edges();
		// 	edge.checkOrientation();
		// }

this._D.finalize(this._animParabolas);
// CLEAR CURRENT SCREEN:
this._animParabolas.graphics().clear();
this._stillVornoi.graphics().clear();
this._animDirectrix.graphics().clear();
		// DRAW FINAL IMAGE
		//this._animParabolas.graphics().setLine(1.0,0xFF333399);
		for(i=0;i<sites.length;++i){
			//console.log("SITE:"+i);
			site = sites[i];
			edges = site.edges();
			var count = 0;
			edge = edges[0];
			var firstEdge = edge;
			count = 0;
			A = edge.vertexA();
			B = edge.vertexB();
			this._animParabolas.graphics().beginPath();
			//var col = Code.getColARGB(0x33,Math.floor(Math.random()*256.0),Math.floor(Math.random()*256.0),0xFF);
			this._animParabolas.graphics().setFill(col);
			this._animParabolas.graphics().setLine(2.0,0xFF330099);
			if(A){
				this._animParabolas.graphics().moveTo(A.point().x+Vor.magRand(),A.point().y+Vor.magRand());
			}
			while(edge && count<15){
				B = edge.vertexB();
				if(B && (edge.next()!==firstEdge) ){
					this._animParabolas.graphics().lineTo(B.point().x+Vor.magRand(),B.point().y+Vor.magRand());
				}
				edge = edge.next();
				if(edge==firstEdge){
					break;
				}
				++count;
			}
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().strokeLine();
			this._animParabolas.graphics().fill();
/*
			// DRAW HALF-EDGE INSETS:
			var insetLen = 6.0;
			var sizeLen = 8.0;
			edge = firstEdge;
			this._animParabolas.graphics().setLine(2.0,0xFFCC0000);
			var dir, he1, he2;
			var count=0;
			while(edge && count<10){
				A = edge.vertexA();
				B = edge.vertexB();
				if(A && B){
					this._animParabolas.graphics().beginPath();
					//
					he1 = V2D.sub(edge.prev().vertexB().point(), edge.prev().vertexA().point());
					he2 = V2D.sub(edge.vertexB().point(), edge.vertexA().point());
					he1.flip();
					he1.norm();
					he2.norm();
					dir = V2D.add(he1,he2);
					dir.norm();
					dir.scale(insetLen);
					he1.scale(-sizeLen);
					he2.scale(sizeLen);
					this._animParabolas.graphics().moveTo(A.point().x+dir.x+he2.x,A.point().y+dir.y+he2.y);
					// 
					he1 = V2D.sub(edge.next().vertexB().point(), edge.next().vertexA().point());
					he2 = V2D.sub(edge.vertexB().point(), edge.vertexA().point());
					he2.flip();
					he1.norm();
					he2.norm();
					dir = V2D.add(he1,he2);
					dir.norm();
					dir.scale(insetLen);
					// 
					this._animParabolas.graphics().lineTo(B.point().x+dir.x,B.point().y+dir.y);
					// head
					this._animParabolas.graphics().lineTo(B.point().x+3.0*dir.x,B.point().y+2.0*dir.y);
					this._animParabolas.graphics().moveTo(B.point().x+dir.x,B.point().y+dir.y);
					//
					this._animParabolas.graphics().endPath();
					this._animParabolas.graphics().strokeLine();
				}
				edge = edge.next();
				if(edge==firstEdge){ break; }
				++count;
			}
*/
			//console.log(count)
		}
return;
		// delaunay generation
		var delaunay = new Delaunay();
		delaunay.fromVoronoi( this._D );
		var triangles = delaunay.triangles();
		var tri;
		len = triangles.length;
		this._animParabolas.graphics().setLine(2.0,0xFFCC0033);
		//this._animParabolas.graphics().setFill(0x66FF0099);
		for(i=0;i<len;++i){
			tri = triangles[i];
			var col = Code.getColARGB(0x66,0xCC+Math.floor(Math.random()*(0xFF-0xCC+1) ),Math.floor(Math.random()*32.0),Math.floor(Math.random()*128.0));
			this._animParabolas.graphics().setFill(col);
			this._animParabolas.graphics().beginPath();
			this._animParabolas.graphics().moveTo(tri.A().point().x,tri.A().point().y);
			this._animParabolas.graphics().lineTo(tri.B().point().x +Vor.magRand(), tri.B().point().y +Vor.magRand());
			this._animParabolas.graphics().lineTo(tri.C().point().x +Vor.magRand(), tri.C().point().y +Vor.magRand());
			this._animParabolas.graphics().lineTo(tri.A().point().x,tri.A().point().y);
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().strokeLine();
			this._animParabolas.graphics().fill();
		}
		return;
	}


	
	this._animPosY = offYStart - this._animationTick*rateStart;
	this._animDirectrix.matrix().identity();
	this._animDirectrix.matrix().translate(0,this._animPosY);
	//
	this._animParabolas.graphics().clear();
	this._animParabolas.graphics().setLine(1.0,0xFF229933);
	this._animParabolas.graphics().beginPath();
	len = this._animPoints.length;
	var focus, left=limitLeft, right=limitRight;
	var deltaJ = (right-left)/200.0;
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
	this._animParabolas.graphics().setLine(2.0,0xFFCC0066);
	this._animParabolas.graphics().beginPath();
	node = this._T.root().minimumNode();
		var count = 0;
		while(node){
			arc = node.data();
			parabola = arc.center().point();
			var intersections = arc.intersections();
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
			deltaJ = (right.x-left.x)/100.0;
			arr = Code.parabolaABCFromFocusDirectrix(parabola,directrix);
			a = arr.a, b = arr.b, c = arr.c;
			//a = parabola.x; b = parabola.y; c = directrix;
			for(j=left.x, cc=0;j<=right.x && cc<100;j+=deltaJ, ++cc){ // hooray for finite precision
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
			if(count >= 100){
				console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
				node = null;
				throw new Error();
			}
			++count;
		}
		node = null;
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

	this._animationTick++;
}


Vor.magRand = function(){
	//return Math.random()*40.0 - 20.0;
	//return Math.random()*20.0 - 10.0;
	return 0;
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

