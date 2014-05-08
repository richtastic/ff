// Voronoi.js





function Voronoi(){
	this._graph = new Graph();
	this._points = new Array();
}
Voronoi.prototype.setPoints2D = function(array){
	if(array!==undefined){
		Code.copyArray(this._points,array);
	}
}


Voronoi.sortPointsY = function(a,b){
	return a.y-b.y; // [smallest...largest]
}
Voronoi.prototype.fortune = function(points){
	Voronoi.fortune(this,points);
}



Voronoi.fortune = function(voronoi,points){
	console.log("fortune ... ");
	var i, len, e;
	voronoi.setPoints2D(points);
	var Q = Code.copyArray(points); // events
	var T = new Voronoi.WaveFront(); // status structure - binary search tree
	var D = new Graph(); // doubly connected edge list
	Q.sort(Voronoi.sortPointsY); // push on all events ... sort by largest Y
	while(Q.length>0){ // while Q not empty
		e = Q.pop();
		console.log("point: "+e.toString());
		if(null){// if site event:
			Voronoi._siteEvent(Q,T,D,e); // handle site event
		}else{
			Voronoi._circleEvent(Q,T,D,e); // handle circle event with T.leaf - gamma = disappeared arc
		}
	}
}

Voronoi._siteEvent = function(Q,T,D,p){
	/*
	if(T.empty()){
		// 1:
		console.log("empty, add point");
		T.value([{points:[p], circle:null}); // add point as leaf node
	}else{
		// 2:
		arc = ...;// search for closest vertical intersection of p with the various parabolas in T
		if(arc.value().circle){ // circle false alarm
			console.log("false alarm");
			Code.removeElement(Q,arc.value().circle);
			arc.value().circle = null;
		}
		// 3:
		node = new Voronoi.BinTree(arc.value());
		node.value({points:[p], circle:null});
		arc.middle(node);
		[pj,pi], [pi,pj]
		rebalance T ... 
		// 
	}
	*/
}
Voronoi._circleEvent = function(Q,T,D,gamma){
	//
}


Voronoi.prototype.delaunay = function(points){
	console.log("delaunay ... ");
	// ...
}


Voronoi.prototype.toString = function(){
	var str = "";
	var i, len = this._points.length;
	for(i=0;i<len;++i){
		str += this._points[i].toString()+"\n";
	}
	return str;
}



/* Event */
Voronoi.EVENT_TYPE_SITE = 0;
Voronoi.EVENT_TYPE_CIRCLE = 1;
Voronoi.Event = function(p,t){
	this._type = null;
	this._arcLeft = null;
	this._arcRight = null;
	this._parabola = null;
	this._circle = null;
	this._point = new V2D();
	this._circles = [];
	this.point(p);
	this.type(t);
}
Voronoi.Event.prototype.point = function(x,y){
	if(x!==undefined){
		if(y!==undefined){
			this._point.set(x,y);
		}else{
			this._point.copy(x);
		}
	}
	return this._point;
}
Voronoi.Event.prototype.type = function(t){
	if(t!==undefined){
		this._type = t;
	}
	return this._type;
}
Voronoi.Event.prototype.arcLeft = function(l){
	if(l!==undefined){
		this._arcLeft = l;
	}
	return this._arcLeft;
}
Voronoi.Event.prototype.arcRight = function(r){
	if(r!==undefined){
		this._arcRight = r;
	}
	return this._arcRight;
}
Voronoi.Event.prototype.parabola = function(p){
	if(p!==undefined){
		this._parabola = p;
	}
	return this._parabola;
}
Voronoi.Event.prototype.arcs = function(l,r,p){
	if(l!==undefined){
		this.arcLeft(l);
		this.arcRight(r);
		this.parabola(p);
	}
}
Voronoi.Event.prototype.circle = function(c){
	if(c!==undefined){
		this._circle = c;
	}
	return this._circle;
}
Voronoi.Event.prototype.toString = function(){
	var str = "";
	if( this._type==Voronoi.EVENT_TYPE_SITE){
		str += "[SITE ";
	}else{ // this._type==Voronoi.EVENT_TYPE_CIRCLE
		str += "[CIRC ";
	}
	str += this._point.toString();
	str += "]";
	return str;
}


/* Queue */
Voronoi.Queue = function(){
	this._list = [];
}
Voronoi.Queue.sortPointY = function(a,b){
	return a.point().y-b.point().y; // [smallest...largest]
}
Voronoi.Queue.prototype.addEvent = function(e){
	this._list.push(e);
	this._list.sort( Voronoi.Queue.sortPointY );
	//console.log(this._list);
}
Voronoi.Queue.prototype.removeEvent = function(e){
	Code.removeElement(this._list,e);
}
Voronoi.Queue.prototype.isEmpty = function(){
	if(this._list.length>0){
		return false;
	}
	return true;
}
Voronoi.Queue.prototype.peek = function(){
	if(this._list.length>0){
		return this._list[this._list.length-1];
	}
	return null;
}
Voronoi.Queue.prototype.next = function(){
	if(this._list.length>0){
		return this._list.pop();
	}
	return null;
}
Voronoi.Queue.prototype.toString = function(){
	var i, str = "Queue: | ";
	for(i=0;i<this._list.length;++i){
		str += this._list[i]+" | ";
	}
	return str;
}


/* Arc  -------------------------- this isn't really an Arc, it's a 'break point' - intersection, and the arc is the area between these intersection points */
Voronoi.ARC_PARABOLA_INT_UNKNOWN = -1;
Voronoi.ARC_PARABOLA_INT_LEFT = 0;
Voronoi.ARC_PARABOLA_INT_RIGHT = 1;
Voronoi.Arc = function(parA,parB,dir, edge){
	this._circleEvents = [];
	this._halfEdge = null;
	this._parabolaLeft = null;
	this._parabolaRight = null;
	this._direction = Voronoi.ARC_PARABOLA_INT_UNKNOWN;
	//this._directrix = null;
	this._node = null; // location in tree
	this._nodeLeft = null; // next leftward intersection
	this._nodeRight = null; // next rightward intersection
	// init
	this.parabolaLeft(parA)
	this.parabolaRight(parB);
	this.direction(dir);
	//this.directrix(dirx)
	this.halfEdge(edge);
}
Voronoi.Arc.prototype.node = function(n){
	if(n!==undefined){
		this._node = n;
	}
	return this._node;
}
Voronoi.Arc.prototype.nodeLeft = function(n){
	if(n!==undefined){
		this._nodeLeft = n;
	}
	return this._nodeLeft;
}
Voronoi.Arc.prototype.nodeRight = function(n){
	if(n!==undefined){
		this._nodeRight = n;
	}
	return this._nodeRight;
}
Voronoi.Arc.prototype.halfEdge = function(e){
	if(e!==undefined){
		this._halfEdge = e;
	}
	return this._halfEdge;
}
Voronoi.Arc.prototype.circleEvents = function(e){ // set?
	if(e!==undefined){
		this._circleEvents = e;
	}
	return this._circleEvents;
}
// Voronoi.Arc.prototype.parabolas = function(a,b){
// 	if(a!==undefined){
// 		this._parabolaLeft = a;
// 		this._parabolaRight = b;
// 	}
// }
Voronoi.Arc.prototype.parabolaLeft = function(l){
	if(l!==undefined){
		this._parabolaLeft = l;
	}
	return this._parabolaLeft;
}
Voronoi.Arc.prototype.parabolaRight = function(r){
	if(r!==undefined){
		this._parabolaRight = r;
	}
	return this._parabolaRight;
}
Voronoi.Arc.prototype.direction = function(a){
	if(a!==undefined){
		this._direction = a;
	}
}
// Voronoi.Arc.prototype.directrix = function(d){
// 	if(d!==undefined){
// 		this._directrix = d;
// 	}
// }
Voronoi.Arc.prototype.nonIntersection = function(){
	return this._parabolaLeft == this._parabolaRight; // or left+right nodes are null
}
Voronoi.Arc.prototype.toString = function(){
	var str = "";
	str += "[Arc: ";
	str += this._parabolaLeft.toString() + " " + this._parabolaRight.toString();
	str += this.nodeLeft()?("[N]<-"):("x<-");
	str += " | ";
	str += this.nodeRight()?("->[N]"):("->x");
	str += (this._direction==Voronoi.ARC_PARABOLA_INT_LEFT)?" (L) ":" (R) ";
	/*if(this.node()){
		str += " "+(this.node().left()?"[]":"x")+"<- | ";
		str += " ->"+(this.node().right()?"[]":"x");
	}else{
		str += " (null) ";
	}*/
	str += "]";
	return str;

}
Voronoi.Arc.prototype.removeCircleEventsFromQueue = function(queue){
	while(this._circleEvents.length>0){
		Code.removeElement( queue, this._circleEvents.pop() );
	}
}
Voronoi.Arc.prototype.intersectionFromDirectrix = function(directrix){
	var intersection = null;
	var intersections = Code.intersectionParabolas(this._parabolaLeft,directrix, this._parabolaRight,directrix);
	if(intersections){
		for(var i=0;i<intersections.length;++i){
			//console.log( "parabola intersection "+i+": " + intersections[i].toString() );
		}
	}else{
		console.log("no int")
	}
	if(intersections.length==2){
		var intA = intersections[0], intB = intersections[1];
		if(this._direction==Voronoi.ARC_PARABOLA_INT_LEFT){
			intersection = intA.x<intB.x?intA:intB;
		}else{ // if(this._directionA==Voronoi.ARC_PARABOLA_FOCUS_RIGHT){
			intersection = intA.x>intB.x?intA:intB;
		}
	}else if(intersections.length==1){
		intersection = intersections[0];
	}else{
		console.log("UH OH");
	}
	return intersection;
}
Voronoi.Arc.prototype.whichParabola = function(point){ // after searching
	if(this.nonIntersection()){
		return this._parabolaLeft;
	}
	var intersection = this.intersectionFromDirectrix(point.y);
	console.log(point,intersection)
	if(point.x<intersection.x){
		return this._parabolaLeft;
	}
	return this._parabolaRight;
}
Voronoi.Arc.prototype.containing = function(point){ // searching
	if(this.nonIntersection()){
		return 0; // this happens when there is only 1 arc in the tree
	}
	var intersection = this.intersectionFromDirectrix(point.y);
	console.log(point,intersection)
	if(point.x<intersection.x){ // left
		if(this.node().left()){
			return -1;
		}
	}else{ // right
		if(this.node().right()){
			return 1;
		}
	}
	return 0;
}


/* WaveFront */
Voronoi.WaveFront = function(){
	this._tree = new Voronoi.BinTree(Voronoi.WaveFront.sorting);
	this._length = 0;
}
Voronoi.WaveFront.sorting = function(a,b){
	//console.log(a,b);
	if( Code.isa(b,V2D) ){ // arc and point - find if point intersects ..
		//console.log("V2D: "+b.toString());
		return a.containing(b); // value()
	}else{ // two arcs
		if(a==b){
			return 0;
		}
		return -1; // ... anything really
	}
	return b-a;
}
Voronoi.WaveFront.prototype.root = function(){
	return this._tree;
}
Voronoi.WaveFront.prototype.isEmpty = function(){
	return this._tree.isEmpty();
}
Voronoi.WaveFront.prototype.length = function(){
	return this._length;
	//return this._tree.length();
}
Voronoi.WaveFront.prototype.addArc = function(arc){
	++this._length;
	return this._tree.addItem(arc);
}
/*Voronoi.WaveFront.prototype.addArcFromPoint = function(point){
	var prev;
	var node = this._tree.root();
	var value = node.value();
	while( value ){
		// find x coordinate of this intersection
			//
		// ... sub-node if necessary ...
		// prev = node;
		// if(gotoleft?){
		// 	node = node.left();
		// }else{
		// 	node = node.right();
		// }
		// value = node?node.value():null;
	}
	++this._length;
}*/
Voronoi.WaveFront.prototype.addArcAbovePointAndDirectrixAndQueue = function(point,directrix,queue){
	console.log("add ..........................................................................");
	var i, arc, node, len, circles, pA,pB, parabola;
	node = this._tree.findItem( point );
	arc = node.value();
	console.log(point+" POINT INTERSECTS ARC: "+arc);
	circles = arc.circleEvents();
	while(circles.length>0){ // false alarms
		queue.removeEvent(circles.pop());
	}
	parabola = arc.whichParabola(point);
	// new 3-tree
	pA = new Voronoi.Arc();
	pB = new Voronoi.Arc();
	nA = new Voronoi.BinNode(pA);
	nB = new Voronoi.BinNode(pB);
	pA.node(nA);
	pB.node(nB);
console.log("SETTING: "+(pA.node().value()==pA)+" & "+(pB.node().value()==pB));
	pA.direction(Voronoi.ARC_PARABOLA_INT_LEFT);
	pB.direction(Voronoi.ARC_PARABOLA_INT_RIGHT);
	pA.parabolaLeft(parabola);
	pA.parabolaRight(point);
	pB.parabolaLeft(point);
	pB.parabolaRight(parabola);
	pA.halfEdge( new Voronoi.HalfEdge() );
	pB.halfEdge( new Voronoi.HalfEdge() );
	console.log("HERE")
	// arrange neighbors
	if(parabola==arc.parabolaLeft()){ // to left
		pA.nodeLeft(arc.nodeLeft());
		pA.nodeRight(nB);
		pB.nodeLeft(nA);
		pB.nodeRight(arc.node());
		if(arc.nodeLeft()){
			arc.nodeLeft().value().nodeRight(nA);
		}
		arc.nodeLeft(nB);
	}else{ // to right
		pA.nodeLeft(arc.node());
		pA.nodeRight(nB);
		pB.nodeLeft(nA);
		pB.nodeRight(arc.nodeRight());
		if(arc.nodeRight()){
			arc.nodeRight().value().nodeLeft(nB);
		}
		arc.nodeRight(nA);
	}
	// insert into tree
		// ...
	// 
	console.log(" --------- ");
	if(this.length()==1){ // node is useless - just replace?
		console.log("CLEAR");
		this._tree.clear();
		pA.nodeLeft(null);
		pB.nodeRight(null);
		if(parabola==arc.parabolaLeft()){ // to left
			nB.left(nA);
			this._tree.addNode(nB);
		}else{ // to right
			nA.right(nB);
			this._tree.addNode(nA);
		}
		this._length=2;
	}else{
		console.log("ADD");
		if(parabola==arc.parabolaLeft()){ // to left
			nA.left(arc.node().left());
			nB.left(nA);
			arc.node().left(nB);
		}else{ // to right
			nB.right(arc.node().right());
			nA.right(nB);
			arc.node().right(nA);
		}
		this._length+=2;
	}
	// parents taken care of
	// circles = triplets of points
	var points, circle;
	arc = pA;
	points = [arc.parabolaRight()];
	while(arc && points.length<3){ // leftward
		node = arc.nodeLeft();
		if(node){
			arc = node.value();
			points.push(arc.parabolaRight());
		}else{
			arc = null;
		}
	}
	if(points.length==3){
		console.log("POTENTIAL CIRCLE LEFT");
		console.log(points);
		circle = Code.circleFromPoints(points[0],points[1],points[2]);
		point = new V2D(circle.center.x,circle.center.y-circle.radius);
		circleEvent = new Voronoi.Event(point,Voronoi.EVENT_TYPE_CIRCLE);
		circleEvent.circle(circle);
			arc = pA;
			arc.circleEvents().push(circleEvent);
			arc = arc.nodeLeft().value();
			arc.circleEvents().push(circleEvent);
			arc = arc.nodeLeft().value();
			arc.circleEvents().push(circleEvent);
		circleEvent.arcs( pA.nodeLeft().value(),pA, points[1]); // left, right, parabola
		queue.addEvent(circleEvent);
	}
	// 
	arc = pB;
	points = [arc.parabolaLeft()];
	while(arc && points.length<3){ // rightward
		node = arc.nodeRight();
		if(node){
			arc = node.value();
			points.push(arc.parabolaLeft());
		}else{
			arc = null;
		}
	}
	
	if(points.length==3){
		console.log("POTENTIAL CIRCLE RIGHT");
		console.log(points);
		circle = Code.circleFromPoints(points[0],points[1],points[2]);
		point = new V2D(circle.center.x,circle.center.y-circle.radius);
		circleEvent = new Voronoi.Event(point,Voronoi.EVENT_TYPE_CIRCLE);
		circleEvent.circle(circle);
			arc = pB;
			arc.circleEvents().push(circleEvent);
			arc = arc.nodeRight().value();
			arc.circleEvents().push(circleEvent);
			arc = arc.nodeRight().value();
			arc.circleEvents().push(circleEvent);
		circleEvent.arcs( pB,pB.nodeRight().value(), points[1]); // left, right, parabola
		queue.addEvent(circleEvent);
	}

	// ...
	console.log(nA);
	console.log(nB);

	console.log("--------------------------------------------------------\n\n");
	// arc.removeCircleEventsFromQueue(q);
	//this._T.splitArcAtPoint(arc,e.point());
}
Voronoi.WaveFront.prototype.removeArcAtCircleWithQueueAndGraph = function(circleEvent, queue, graph){
	console.log("BEFORE:");
	console.log(this._tree.toString());
//point,circle,arc
	// add to graph:

		// center of circle = vertex
		// 2 new half-edges add to adjacent neighbors
		// 
	// circle triplets:
		// arc.right(), arc.left(), arc.left().left()
		// arc.left(), arc.right(), arc.right().right()
	// delete arc from tree
	//this._tree.remove
	var leftIntersection = circleEvent.arcLeft();
	var rightIntersection = circleEvent.arcRight();
	var parabola = circleEvent.parabola();
	console.log(leftIntersection);
	console.log(rightIntersection);
	console.log(parabola);

	var arc, leftLeft=null, left, right, rightRight=null;
	// GET VALUES
	// left = leftIntersection.nodeLeft();
	// if(left){
	// 	left = left.value();
	// 	// leftLeft = left.nodeLeft();
	// 	// if(leftLeft){
	// 	// 	leftLeft = leftLeft.value();
	// 	// }
	// }
	// right = leftIntersection.nodeRight();
	// if(right){
	// 	right = right.value();
	// 	// rightRight = right.nodeRight();
	// 	// if(rightRight){
	// 	// 	rightRight = rightRight.value();
	// 	// }
	// }
	//
	// arc = new Voronoi.Arc();
	// arc.parabolaLeft();
	// clear left
	// if(left){
	// 	left.parabolaRight(right.parabolaLeft());
	// 	left.direction(right.direction());
	// 	left.nodeRight(right.node());
	// }
	// // clear right
	// if(right){
	// 	right.parabolaLeft(left.parabolaRight());
	// 	left.direction(right.direction());
	// 	right.nodeLeft(left.node());
	// }

leftIntersection.node( rightIntersection.node().remove() );
leftIntersection.nodeLeft().value().nodeRight( leftIntersection.node() );

console.log(leftIntersection.node().toString());
console.log(leftIntersection.node());
	if( rightIntersection.nodeRight() ){
		arc = rightIntersection.nodeRight().value();
		console.log(arc);
		arc.nodeLeft( leftIntersection.node() );
	}
console.log(leftIntersection.node().toString());
console.log(leftIntersection.node());
	leftIntersection.nodeRight( rightIntersection.nodeRight() );
	leftIntersection.parabolaRight(rightIntersection.parabolaRight());
	leftIntersection.direction(rightIntersection.direction()==Voronoi.ARC_PARABOLA_INT_RIGHT?Voronoi.ARC_PARABOLA_INT_LEFT:Voronoi.ARC_PARABOLA_INT_RIGHT); // flip direction?
	//leftIntersection.
	//Voronoi.ARC_PARABOLA_INT_RIGHT);
	// remove from tree
	//leftIntersection.node().remove();
	
//console.log(rightIntersection.node()==leftIntersection.node());

	// add new to tree
/*
	this._circleEvents = [];
	this._halfEdge = null;
	this._parabolaLeft = null;
	this._parabolaRight = null;
	this._direction = Voronoi.ARC_PARABOLA_INT_UNKNOWN;
	//this._directrix = null;
	this._node = null; // location in tree
	this._nodeLeft = null; // next leftward intersection
	this._nodeRight = null; // next rightward intersection
*/
	console.log("AFTER:");
	console.log(this._tree.toString());

//throw new Error();

		// make sure to remove the parabola from the left and right - replace with correct
	// delete all cicle events with INVOLVE arc in queue
		// this can only be the left and right adjacent neighbors
		//.. 

}
Voronoi.WaveFront.prototype.toString = function(){
	return "WAVEFRONT:\n"+this._tree.toString();
}
// Voronoi.WaveFront.prototype.arcAbovePointAndDirectrix = function(p,d){
// 	// 
// }
// Voronoi.WaveFront.prototype.splitArcAtPoint = function(arc,point){
	
// }

/* HalfEdge */
Voronoi.HalfEdge = function(){
	this._what = null;
}

/* Vertex */
Voronoi.Vertex = function(){
	this._what = null;
}

/* EdgeGraph */
Voronoi.EdgeGraph = function(){
	this._edges = [];
	this._vertexes = [];
}
Voronoi.EdgeGraph.prototype.addEdge = function(e){
	this._edges.push(e);
}
Voronoi.EdgeGraph.prototype.addVertex = function(v){
	this._vertex.push(v);
}







/*


kruskal MST - add useful edges ordered by weight 

*/












