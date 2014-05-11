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


// --------------------------------------------------------------------------------------------------------------------
/* Event */
Voronoi.EVENT_TYPE_SITE = 0;
Voronoi.EVENT_TYPE_CIRCLE = 1;
Voronoi.Event = function(p,t){
	this._type = null;
	this._arcLeft = null;
	this._arcCenter = null;
	this._arcRight = null;
	this._circle = null;
	this._point = new V2D();
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
Voronoi.Event.prototype.isCircleEvent = function(){
	return this._type==Voronoi.EVENT_TYPE_CIRCLE;
}
Voronoi.Event.prototype.isSiteEvent = function(){
	return this._type==Voronoi.EVENT_TYPE_SITE;
}
Voronoi.Event.prototype.type = function(t){
	if(t!==undefined){
		this._type = t;
	}
	return this._type;
}
Voronoi.Event.prototype.left = function(l){
	if(l!==undefined){
		this._arcLeft = l;
	}
	return this._arcLeft;
}
Voronoi.Event.prototype.center = function(c){
	if(c!==undefined){
		this._arcCenter = c;
	}
	return this._arcCenter;
}
Voronoi.Event.prototype.right = function(r){
	if(r!==undefined){
		this._arcRight = r;
	}
	return this._arcRight;
}
Voronoi.Event.prototype.circle = function(c){
	if(c!==undefined){
		this._circle = c;
	}
	return this._circle;
}
Voronoi.Event.prototype.containsArc = function(arc){
	// if(this._arcLeft.center()==arc.center()){
	// 	return true;
	// }else if(this._arcCenter.center()==arc.center()){
	// 	return true;
	// }else if(this._arcRight.center()==arc.center()){
	// 	return true;
	// }
	if(this._arcLeft==arc){
		return true;
	}else if(this._arcCenter==arc){
		return true;
	}else if(this._arcRight==arc){
		return true;
	}
	return false;
}
Voronoi.Event.prototype.clear = function(){
	if(this._arcLeft){
		this._arcLeft.removeCircleEventWithArc(this._arcCenter);
	}
	if(this._arcCenter){
		this._arcCenter.removeCircleEvent(this);
	}
	if(this._arcRight){
		this._arcRight.removeCircleEventWithArc(this._arcCenter);
	}
}
Voronoi.Event.prototype.kill = function(){
	this._type = null;
	this._arcLeft = null;
	this._arcCenter = null;
	this._arcRight = null;
	this._circle = null;
	this._point = null;
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

// --------------------------------------------------------------------------------------------------------------------
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
}
Voronoi.Queue.prototype.removeEvent = function(e){
	//if(e){
	Code.removeElement(this._list,e);
	//}
}
Voronoi.Queue.prototype.removeCircleEventWithArc = function(arc){
	var i, e;
	for(i=0; i<this._list.length; ++i){
		e = this._list[i];
		if(e.isCircleEvent()){
			console.log("CIRCLE CONTAIN ARC?: "+arc+" "+e.circle().center+" "+e.containsArc(arc)+" ");
			console.log("                     "+e.left());
			console.log("                     "+e.center());
			console.log("                     "+e.right());
		}
		if(e.isCircleEvent() && e.containsArc(arc)){
			Code.removeElementAt(this._list,i);
			e.clear();
			e.kill();
			--i;
		}
	}
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
Voronoi.Arc = function(parL,dirL, parC, parR,dirR, dirX){
	this._circleEvent = null;
	this._halfEdges = [];
	this._parabolaLeft = null;
	this._parabolaCenter = null;
	this._parabolaRight = null;
	this._directionLeft = Voronoi.ARC_PARABOLA_INT_UNKNOWN;
	this._directionRight = Voronoi.ARC_PARABOLA_INT_UNKNOWN;
	this._directrix = null; // directrix pointer for arc ordering, splitting, merging
	//this._node = null; // pointer to tree node for faster referencing
	this.left(parL);
	this.center(parC);
	this.right(parR);
	this.leftDirection(dirL);
	this.rightDirection(dirR);
	this.directrix(dirX)
	//this.halfEdge(edge);
	//this.node(node);
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
		var arc = new Voronoi.Arc(arcL.left(),arcL.leftDirection(), arcL.center(), arcR.right(),arcR.rightDirection(), arcC.directrix(), new Voronoi.HalfEdge(), null);
		return [arc];
	} // separate arcs
	var newL = new Voronoi.Arc(arcL.left(),arcL.leftDirection(), arcL.center(), arcR.center(),Voronoi.ARC_PARABOLA_INT_UNKNOWN, arcC.directrix(), new Voronoi.HalfEdge(), null);
	var newR = new Voronoi.Arc(arcL.center(),Voronoi.ARC_PARABOLA_INT_UNKNOWN, arcR.center(), arcR.right(),arcR.rightDirection(), arcC.directrix(), new Voronoi.HalfEdge(), null);
	var centerDistance = arcC.intersectionAverage();
	var intersections = Code.intersectionParabolas(newL.center(),newL.directrix().y, newR.center(),newR.directrix().y);
	if(intersections.length==2){
		if(intersections[0].x>intersections[1].x){ // order
			intersections = [intersections[1],intersections[0]];
		}
		var distanceA = Math.abs(intersections[0].x-centerDistance);
		var distanceB = Math.abs(intersections[1].x-centerDistance);
		if(distanceA<distanceB){
			newL.rightDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
			newR.leftDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
		}else{
			newL.rightDirection(Voronoi.ARC_PARABOLA_INT_RIGHT);
			newR.leftDirection(Voronoi.ARC_PARABOLA_INT_RIGHT);
		}
	}else if(intersections.length==1){ // doesn't matter
		console.log("SINGLE INTERSECTION");
		newL.rightDirection(Voronoi.ARC_PARABOLA_INT_RIGHT);
		newL.leftDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
	}else{ // 
		console.log("????????");
	}
	return [newL,newR];
}
// -------------------------------------------------------------------------------------------------------------------- get/set
// Voronoi.Arc.prototype.node = function(n){
// 	if(n!==undefined){
// 		this._node = n;
// 	}
// 	return this._node;
// }
Voronoi.Arc.prototype.physicalCopy = function(a){ // addition
	this.left(a.left());
	this.center(a.center());
	this.right(a.right());
	this.leftDirection(a.leftDirection());
	this.rightDirection(a.rightDirection());
	this.directrix(a.directrix())
}
Voronoi.Arc.prototype.copy = function(a){ // identical
	this.phsicalCopy(a);
	this._circleEvent = a.circleEvent();
	Code.copyArray(this._halfEdges,a.halfEdges()); // also need to update half edge pointers
}
Voronoi.Arc.prototype.addHalfEdge = function(e){
	this._halfEdges.push(e);
}
Voronoi.Arc.prototype.halfEdges = function(e){
	if(e!==undefined){
		this._halfEdge = e;
	}
	return this._halfEdge;
}
Voronoi.Arc.prototype.circleEvent = function(c){
	if(c!==undefined){
		this._circleEvent = c;
	}
	return this._circleEvent;
}
// Voronoi.Arc.prototype.addCircleEvent = function(e){
// 	this._circleEvents.push(e);
// }
// Voronoi.Arc.prototype.removeCircleEvent = function(e){
// 	Code.removeElement(this._circleEvents,e);
// }
// Voronoi.Arc.prototype.removeCircleEventWithArc = function(arc){
// //if(!this._circleEvents){ return; } // fix me
// 	for(var i=0;i<this._circleEvents.length;++i){
// 		var circleEvent = this._circleEvents[i];
// 		if(circleEvent.containsArc(arc)){
// 			//queue.removeEvent(circleEvent);
// 			//Code.removeElement(this._circleEvents,e);
// 			Code.removeElementAtSimple(this._circleEvents,i);
// 			--i;
// 		}
// 	}
// }
// Voronoi.Arc.prototype.removeCircleEventWithArc = function(arc){
// 	if(this._circleEvent.containsArc(arc)){
// 		Code.removeElementAtSimple(this._circleEvents,i);
// 	}
// }
// Voronoi.Arc.prototype.clearCircleEventsWithQueue = function(queue){
// 	var circleEvent;
// 	while(this._circleEvents.length>0){
// 		circleEvent = this._circleEvents.pop();
// 		console.log("REMOVING: "+circleEvent);
// 		queue.removeEvent(circleEvent);
// 		circleEvent.clear(); // remove from eveyone else's event list
// 		circleEvent.kill();
// 	}
// }
// Voronoi.Arc.prototype.circleEvents = function(e){ // set?
// 	if(e!==undefined){
// 		this._circleEvents = e;
// 	}
// 	return this._circleEvents;
// }
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
	//str += " "+(this.node().data()==this)+" ";
	str += " ";
	str += "]";
	return str;

}
Voronoi.Arc.prototype.kill = function(){
	//this._node = null;
	if(this._circleEvents){
		Code.emptyArray(this._circleEvents);
		this._circleEvents = null;
	}
	if(this._halfEdges){
		Code.emptyArray(this._halfEdges);
		this._halfEdges = null;
	}
	this._parabolaLeft = null;
	this._parabolaCenter = null;
	this._parabolaRight = null;
	this._directionLeft = Voronoi.ARC_PARABOLA_INT_UNKNOWN;
	this._directionRight = Voronoi.ARC_PARABOLA_INT_UNKNOWN;
	this._directrix = null;
}
// -------------------------------------------------------------------------------------------------------------------- intersections
Voronoi.Arc.prototype.intersectLeft = function(){
	if(this._parabolaLeft){
		var intLeft = Code.intersectionParabolas(this._parabolaLeft,this._directrix.y, this._parabolaCenter,this._directrix.y);
		if(intLeft){
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
	}
	return null;
}
Voronoi.Arc.prototype.intersectRight = function(){
	if(this._parabolaRight){
		var intRight = Code.intersectionParabolas(this._parabolaCenter,this._directrix.y, this._parabolaRight,this._directrix.y);
		if(intRight){
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
	this._tree = new RedBlackTree();
	this._length = 0;
	this.sortForSearchPoint();
}
Voronoi.WaveFront.sortingArcPoint = function(a,b){
	if( Code.isa(b,V2D) ){ // arc and point - search
		return a.containsPoint(b);
	}else{ // two arcs - insert
		if( Voronoi.Arc.isArcToLeftOfArc(b,a) ){
			return -1;
		}
		return 1;
	}
}
Voronoi.WaveFront.sortingArcEquality = function(a,b){
	if(a==b){
		return 0;
	}
	if( Voronoi.Arc.isArcToLeftOfArc(b,a) ){
		return -1;
	}
	return 1;
}
Voronoi.WaveFront.prototype.root = function(){
	return this._tree;
}
Voronoi.WaveFront.prototype.isEmpty = function(){
	return this._tree.isEmpty();
}
Voronoi.WaveFront.prototype.length = function(){
	return this._tree.length();
}
Voronoi.WaveFront.prototype.addArc = function(arc){
	++this._length;
	return this._tree.insertObject(arc);
}
Voronoi.WaveFront.prototype.sortForSearchPoint = function(){
	this._tree.sorting( Voronoi.WaveFront.sortingArcPoint );
}
Voronoi.WaveFront.prototype.sortForSearchArc = function(){
	this._tree.sorting( Voronoi.WaveFront.sortingArcEquality );
}
Voronoi.WaveFront.prototype.nextNode = function(arc){
 	this.sortForSearchArc();
	var node = this._tree.findNodeFromObject(arc);
	this.sortForSearchPoint();
	return this._tree.nextNode(node);
 }
Voronoi.WaveFront.prototype.addArcAbovePointAndDirectrixAndQueue = function(point,directrix,queue){
// console.log("add .........................................................................."+directrix);
// console.log(this._tree.toString());
	var arc, node, list, i, left, center, right;
	if(this.isEmpty()){ // infiniarc
		arc = new Voronoi.Arc(null,Voronoi.ARC_PARABOLA_INT_UNKNOWN, point, null,Voronoi.ARC_PARABOLA_INT_UNKNOWN, directrix, new Voronoi.HalfEdge(), null);
		node = RedBlackTree.newEmptyNode(arc);
		this._tree.insertNode(node);
	}else{
// console.log(point.toString());
		// find arc to split
		node = this._tree.findObject(point);
// console.log(node);
		arc = node.data();
// console.log("arc:"+arc);
		// remove false-alarm circle events
circleEvent = arc.circleEvent();
if(circleEvent){
console.log("AN ARC HAD A CIRCLE EVENT");
// center
queue.removeEvent( arc.circleEvent() );
arc.circleEvent(null);
// left
left = circleEvent.left();
if(left.circleEvent().containsArc(arc)){
	console.log("CONTAINED - LEFT");
	queue.removeEvent( left.circleEvent() );
	left.circleEvent(null);
}
// right
right = circleEvent.right();
if(right.circleEvent().containsArc(arc)){
	console.log("CONTAINED - RIGHT");
	queue.removeEvent( right.circleEvent() );
	right.circleEvent(null);
}
}
		// get list of new arcs
		list = Voronoi.Arc.splitArcAtPoint(arc,point);
		// copy over new left arc
		arc.physicalCopy(list[0]);
		// only add 2 new arcs
		for(i=1;i<list.length;++i){
			arc = list[i];
			node = RedBlackTree.newEmptyNode(arc);
			this._tree.insertNode(node);
		}
console.log("TRIPLETS:     "+list[1]);
		// left triplets of points
		this.checkAddCircleWithRight(list[1],directrix,queue);
 		// right triplets of points
 		this.checkAddCircleWithLeft(list[1],directrix,queue);
	}
// console.log("\n");
// console.log(this._tree.toString());
// console.log("END ADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
}
Voronoi.WaveFront.prototype.checkAddCircleWithRight = function(right,directrix,queue){ // left triplets of points
	var node, left, center;
	this.sortForSearchArc();
	node = this._tree.findNodeFromObject(right);//right.node();
	node = this._tree.prevNode(node);
	center = node?node.data():null;
	node = this._tree.prevNode(node);
	left = node?node.data():null;
	console.log("      R   "+left);
	console.log("      R   "+center);
	console.log("      R   "+right);
	if(left && center && right){
		Voronoi.WaveFront.addCirclePointFromArcs(left,center,right, directrix, queue);
	}
	this.sortForSearchPoint();
}
Voronoi.WaveFront.prototype.checkAddCircleWithLeft = function(left,directrix,queue){ // right triplets of points
	var node, left, center;
	this.sortForSearchArc();
	node = this._tree.findNodeFromObject(left);//left.node();
	node = this._tree.nextNode(node);
	center = node?node.data():null;
	node = this._tree.nextNode(node);
	right = node?node.data():null;
	console.log("      L   "+left);
	console.log("      L   "+center);
	console.log("      L   "+right);
	if(left && center && right){
		Voronoi.WaveFront.addCirclePointFromArcs(left,center,right, directrix, queue);
	}
	this.sortForSearchPoint();
}
Voronoi.WaveFront.addCirclePointFromArcs = function(left,center,right, directrix, queue){
	var circle = Code.circleFromPoints(left.center(),center.center(),right.center());
	var point = new V2D(circle.center.x,circle.center.y-circle.radius);
	if(point.y<directrix.y){
console.log("ADD CIRCLE: "+point.y+" < "+directrix.y);
		var circleEvent = new Voronoi.Event(point,Voronoi.EVENT_TYPE_CIRCLE);
		circleEvent.circle(circle);
		// add merge circle event to disappearing arc
queue.removeEvent( center.circleEvent() );
center.circleEvent(null);
center.circleEvent(circleEvent);
		//center.addCircleEvent(circleEvent);
		circleEvent.left(left);
		circleEvent.center(center);
		circleEvent.right(right);
		queue.addEvent(circleEvent);
	}else{
		console.log("POINT IS IN PAST "+point+" | "+directrix);
	}
}
Voronoi.WaveFront.prototype.removeArcAtCircleWithDirectrixAndQueueAndGraph = function(circleEvent, directrix, queue, graph){
// console.log("BEFORE:        -------------------- -------------------------------");
// console.log(this._tree.toString());
	var i, list, left, center, right, node;
	left = circleEvent.left();
	center = circleEvent.center();
	right = circleEvent.right();

// delete all circleEvents involving middle arc
// queue.removeEvent( center.circleEvent() );
// center.circleEvent(null);
//var e = center.circleEvent();
//console.log("EQUAL EVENTS: "+(e==circleEvent));
if(circleEvent){
//console.log("AN ARC HAD A CIRCLE EVENT");
// center
queue.removeEvent( center.circleEvent() );
center.circleEvent(null);
// left
if(left.circleEvent() && left.circleEvent().containsArc(center)){
	console.log("CONTAINED - LEFT");
	queue.removeEvent( left.circleEvent() );
	left.circleEvent(null);
}
// right
if(right.circleEvent() && right.circleEvent().containsArc(center)){
	console.log("CONTAINED - RIGHT");
	queue.removeEvent( right.circleEvent() );
	right.circleEvent(null);
}
}

console.log("MERGING ....");
console.log(left+"");
console.log(center+"");
console.log(right+"");


	this.sortForSearchArc();
	var nc = this._tree.findNodeFromObject(center)
	this.sortForSearchPoint();
	list = Voronoi.Arc.mergeArcs(left,center,right);
	// remove all other circle events involving this arc
	console.log(""+center);
	queue.removeCircleEventWithArc(center);
	// only delete middle node
	this._tree.deleteNode(nc);
	center.kill();
	// copy left and right
	left.physicalCopy(list[0]);
	if(list.length==2){
		right.physicalCopy(list[1]);
	}else{ // unification of arc - delete both
		this.sortForSearchArc();
		var nr = this._tree.findNodeFromObject(center)
		this.sortForSearchPoint();
		this._tree.deleteNode(nr);
	}
	// left triplets of points
	this.checkAddCircleWithRight(right,directrix,queue);
	// right triplets of points
	this.checkAddCircleWithLeft(left,directrix,queue);
// console.log("\n");
// console.log(this._tree.toString());
// console.log("END DELETEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");

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












