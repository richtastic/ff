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

// --------------------------------------------------------------------------------------------------------------------
/* Arc */
Voronoi.ARC_PARABOLA_INT_UNKNOWN = -1;
Voronoi.ARC_PARABOLA_INT_LEFT = 0;
Voronoi.ARC_PARABOLA_INT_RIGHT = 1;
Voronoi.Arc = function(parL,dirL, parC, parR,dirR, dirX, edge, node){
	this._circleEvents = [];
	this._halfEdge = null;
	this._parabolaLeft = null;
	this._parabolaCenter = null;
	this._parabolaRight = null;
	this._directionLeft = Voronoi.ARC_PARABOLA_INT_UNKNOWN;
	this._directionRight = Voronoi.ARC_PARABOLA_INT_UNKNOWN;
	this._directrix = null; // directrix pointer for arc ordering
	this._node = null; // pointer to tree node for faster referencing
	this.left(parL);
	this.center(parC);
	this.right(parR);
	this.leftDirection(dirL);
	this.rightDirection(dirR);
	this.directrix(dirX)
	this.halfEdge(edge);
	this.node(node);
}
// -------------------------------------------------------------------------------------------------------------------- class
Voronoi.Arc.isArcToLeftOfArc = function(a,b){
	var avgA = a.intersectionAverage();
	var avgB = b.intersectionAverage();
	if(avgA==null || avgB==null){
		return false;
	}
	return avgA < avgB;
}
Voronoi.Arc.splitArcAtPoint = function(arc,point){
	if(arc.containsPointBoolean(point)){
		var arcL, arcC, arcR;
		arcL = new Voronoi.Arc(arc.left(),arc.leftDirection(), arc.center(), point,Voronoi.ARC_PARABOLA_INT_LEFT, arc.directrix(), new Voronoi.HalfEdge(), null);
		arcC = new Voronoi.Arc(arc.center(),Voronoi.ARC_PARABOLA_INT_LEFT, point, arc.center(),Voronoi.ARC_PARABOLA_INT_RIGHT, arc.directrix(), new Voronoi.HalfEdge(), null);
		arcR = new Voronoi.Arc(point,Voronoi.ARC_PARABOLA_INT_RIGHT, arc.center(), arc.right(),arc.rightDirection(), arc.directrix(), new Voronoi.HalfEdge(), null);
		return [arcL,arcC,arcR];
	}
	return null;
}
Voronoi.Arc.mergeArcs = function(arcL,arcC,arcR){
	if(arcL.center()==arcR.center()){ // single arc
		var arc = new Voronoi.Arc(arcL.left(),arcL.leftDirection(), arcL.center(), arcR.right(),arcR._directionRight(), arcC.directrix(), new Voronoi.HalfEdge(), null);
		return [arc];
	} // separate arcs
	var newL = new Voronoi.Arc(arcL.left(),arcL.leftDirection(), arcL.center(), arcR.center(),Voronoi.ARC_PARABOLA_INT_UNKNOWN, arcC.directrix(), new Voronoi.HalfEdge(), null);
	var newR = new Voronoi.Arc(arcL.center(),Voronoi.ARC_PARABOLA_INT_UNKNOWN, arcR.center(), arcR.right(),arcR._directionRight(), arcC.directrix(), new Voronoi.HalfEdge(), null);
	var centerPoint = arcC.intersectionAverage();
	console.log(centerPoint);
	var intersections = Code.intersectionParabolas(newL.center(),newL.directrix().y, newR.center(),newR.directrix().y);
	console.log(intersections);
	if(intersections.length==2){
		if(intersections[0].x>intersections[1].x){ // order
			intersections = [intersections[1],intersections[0]];
		}
		var distanceA = V2D.distance(intersections[0],centerPoint);
		var distanceB = V2D.distance(intersections[1],centerPoint);
		if(distanceA<distanceB){
			newL.directionRight(Voronoi.ARC_PARABOLA_INT_LEFT);
			newL.directionLeft(Voronoi.ARC_PARABOLA_INT_LEFT);
		}else{
			newL.directionRight(Voronoi.ARC_PARABOLA_INT_RIGHT);
			newL.directionLeft(Voronoi.ARC_PARABOLA_INT_RIGHT);
		}
	}else if(intersections.length==1){ // doesn't matter
		newL.directionRight(Voronoi.ARC_PARABOLA_INT_RIGHT);
		newL.directionLeft(Voronoi.ARC_PARABOLA_INT_LEFT);
	}else{ // 
		console.log("????????");
	}
	return [newL,newR];
}
// -------------------------------------------------------------------------------------------------------------------- get/set
Voronoi.Arc.prototype.node = function(n){
	if(n!==undefined){
		this._node = n;
	}
	return this._node;
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
Voronoi.Arc.prototype.left = function(l){
	if(l!==undefined){
		this._parabolaLeft = l;
	}
	return this._parabolaLeft;
}
Voronoi.Arc.prototype.center = function(c){
	if(c!==undefined){
		this._parabolaCenter = c;
	}
	return this._parabolaCenter;
}
Voronoi.Arc.prototype.right = function(r){
	if(r!==undefined){
		this._parabolaRight = r;
	}
	return this._parabolaRight;
}
Voronoi.Arc.prototype.leftDirection = function(l){
	if(l!==undefined){
		this._directionLeft = l;
	}
	return this._directionLeft;
}
Voronoi.Arc.prototype.rightDirection = function(r){
	if(r!==undefined){
		this._directionRight = r;
	}
	return this._directionRight;
}
Voronoi.Arc.prototype.directrix = function(d){
	if(d!==undefined){
		this._directrix = d;
	}
	return this._directrix;
}
Voronoi.Arc.prototype.toString = function(){
	var str = "";
	var ints = this.intersections();
	str += "[Arc: ";
	if(this.center()){
		str += "  "+this.center()+"  ";
	}else{
		str += "  (x)  ";
	}
	if(ints[0]){
		str += "["+ints[0].x+", ";
	}else{
		str += "(-inf, ";
	}
	if(ints[1]){
		str += ""+ints[1].x+"]";
	}else{
		str += "inf)";
	}
	if(this.leftDirection()==Voronoi.ARC_PARABOLA_INT_LEFT){
		str += " (L";	
	}else if(this.leftDirection()==Voronoi.ARC_PARABOLA_INT_RIGHT){
		str += " (R";	
	}else{
		str += " (?";	
	}
	if(this.rightDirection()==Voronoi.ARC_PARABOLA_INT_LEFT){
		str += ",L)";	
	}else if(this.rightDirection()==Voronoi.ARC_PARABOLA_INT_RIGHT){
		str += ",R)";	
	}else{
		str += ",?)";	
	}
	str += " ";
	str += "]";
	return str;

}
Voronoi.Arc.prototype.kill = function(){
	this._node = null;
	this._node = null;
	this._node = null;
	this._node = null;
	this._node = null;
	this._node = null;
}
// -------------------------------------------------------------------------------------------------------------------- operations
Voronoi.Arc.prototype.removeCircleEventsFromQueue = function(queue){
	while(this._circleEvents.length>0){
		Code.removeElement( queue, this._circleEvents.pop() );
	}
}
// -------------------------------------------------------------------------------------------------------------------- intersections
Voronoi.Arc.prototype.intersectLeft = function(){
	if(this._parabolaLeft){
		var intLeft = Code.intersectionParabolas(this._parabolaLeft,this._directrix.y, this._parabolaCenter,this._directrix.y);
		if(intLeft.length==2){
			if(intLeft[0].x>intLeft[1].x){
				intLeft = [intLeft[1],intLeft[0]];
			}
			if(this._directionLeft==Voronoi.ARC_PARABOLA_INT_LEFT){
				return intLeft[0];
			}else if(this._directionLeft==Voronoi.ARC_PARABOLA_INT_RIGHT){
				return intLeft[1];
			}
		}else if(intLeft.length==1){
			return intLeft[0];
		}else{
			return null;
		}
	}
	return null;
}
Voronoi.Arc.prototype.intersectRight = function(){
	if(this._parabolaRight){
		var intRight = Code.intersectionParabolas(this._parabolaCenter,this._directrix.y, this._parabolaRight,this._directrix.y);
		if(intRight.length==2){
			if(intRight[0].x>intRight[1].x){
				intRight = [intRight[1],intRight[0]];
			}
			if(this._directionRight==Voronoi.ARC_PARABOLA_INT_LEFT){
				return intRight[0];
			}else if(this._directionRight==Voronoi.ARC_PARABOLA_INT_RIGHT){
				return intRight[1];
			}
		}else if(intRight.length==1){
			return intRight[0];
		}else{
			return null;
		}
	}
	return null;
}
Voronoi.Arc.prototype.intersections = function(){
	return [this.intersectLeft(),this.intersectRight()];
}
Voronoi.Arc.prototype.intersectionAverage = function(a,b){
	var ints = this.intersections();
	if(ints[0]!=null && ints[1]!=null){
		return (ints[0].x+ints[1].x)*0.5;
	}else if(ints[0]!=null && ints[1]==null){
		return ints[0].x + 1.0; // numerical stability
	}else if(ints[0]==null && ints[1]!=null){
		return ints[1].x - 1.0; // numerical stability
	}
	return null;
}
Voronoi.Arc.prototype.containsPointBoolean = function(point){
	return this.containsPoint(point)==0;
}
Voronoi.Arc.prototype.containsPoint = function(point){ // searching via point
	var ints = this.intersections();
	if(ints[0]!=null && ints[1]!=null){
		if(ints[0].x<point.x){
			if(point.x<=ints[1].x){
				return 0; // inside
			}
			return 1; // right
		}
		return -1; // left
	}
	if(ints[0]==null && ints[1]==null){ // [-inf,inf]
		return 0; // inside
	}
	if(ints[1]==null){ // [b, inf]
		if(ints[0].x<point.x){
			return 0; // inside
		}
		return -1; // left
	}else if(ints[0]==null){ // [-inf, a]
		if(point.x<=ints[1].x){
			return 0; // inside
		}
		return 1; // right
	}
	return 0;
}



// --------------------------------------------------------------------------------------------------------------------
/* WaveFront */
Voronoi.WaveFront = function(){
	this._tree = new RedBlackTree(Voronoi.WaveFront.sorting);
	this._length = 0;
}
Voronoi.WaveFront.sorting = function(a,b){
	if( Code.isa(b,V2D) ){ // arc and point - search
		return a.containsPoint(b);
	}else{ // two arcs - insert
		if( Voronoi.Arc.isArcToLeftOfArc(b,a) ){
			//console.log("TO LEFT");
			return -1;
		}
		//console.log("TO RIGHT");
		return 1;
	}
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
	return this._tree.insertObject(arc);
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
console.log(this._tree.toString());
	node = this._tree.findObject( point );
console.log(node);
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
	nA = RedBlackTree.newEmptyNode(pA);
	nB = RedBlackTree.newEmptyNode(pB);
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
			this._tree.insertNode(nB);
		}else{ // to right
			nA.right(nB);
			this._tree.insertNode(nA);
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












