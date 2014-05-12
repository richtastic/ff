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
	// Voronoi.WaveFront.prototype.addArcAbovePointAndDirectrixAndQueue = function(point,directrix,queue){
}
Voronoi._circleEvent = function(Q,T,D,gamma){
	// Voronoi.WaveFront.prototype.removeArcAtCircleWithDirectrixAndQueueAndGraph = function(circleEvent, directrix, queue, graph){
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
	this._point = new V2D();
	// site event
	this._site = null;
	// circle event
	this._arcLeft = null;
	this._arcCenter = null;
	this._arcRight = null;
	this._circle = null;
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
Voronoi.Event.prototype.site = function(s){
	if(s!==undefined){
		this._site = s;
	}
	return this._site;
}
Voronoi.Event.prototype.containsArc = function(arc){
	if(this._arcLeft==arc){
		return true;
	}else if(this._arcCenter==arc){
		return true;
	}else if(this._arcRight==arc){
		return true;
	}
	return false;
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
			if(e.containsArc(arc)){
				// remove from 
				if(e.center().circleEvent()==e){
					e.center().circleEvent(null);
				}
				if(e.left().circleEvent()==e){
					e.left().circleEvent(null);
				}
				if(e.right().circleEvent()==e){
					e.right().circleEvent(null);
				}
				Code.removeElementAt(this._list,i);
				e.kill();
				--i;
			}
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
	this._parabolaLeft = null;
	this._parabolaCenter = null;
	this._parabolaRight = null;
	this._directionLeft = Voronoi.ARC_PARABOLA_INT_UNKNOWN;
	this._directionRight = Voronoi.ARC_PARABOLA_INT_UNKNOWN;
	this._edgeLeft = null;
	this._edgeRight = null;
	this._directrix = null; // directrix pointer for arc ordering, splitting, merging
	//this._node = null; // pointer to tree node for faster referencing
	this.left(parL);
	this.center(parC);
	this.right(parR);
	this.leftDirection(dirL);
	this.rightDirection(dirR);
	this.directrix(dirX)
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
Voronoi.Arc.splitArcAtSite = function(arc,site){
	if(arc.containsPointBoolean(site.point())){
		var arcL, arcC, arcR;
		arcL = new Voronoi.Arc(arc.left(),arc.leftDirection(), arc.center(), site,Voronoi.ARC_PARABOLA_INT_LEFT, arc.directrix());
		arcC = new Voronoi.Arc(arc.center(),Voronoi.ARC_PARABOLA_INT_LEFT, site, arc.center(),Voronoi.ARC_PARABOLA_INT_RIGHT, arc.directrix());
		arcR = new Voronoi.Arc(site,Voronoi.ARC_PARABOLA_INT_RIGHT, arc.center(), arc.right(),arc.rightDirection(), arc.directrix());
		return [arcL,arcC,arcR];
	}
	return null;
}
Voronoi.Arc.mergeArcs = function(arcL,arcC,arcR){
	if(arcL.center()==arcR.center()){ // single arc
		var arc = new Voronoi.Arc(arcL.left(),arcL.leftDirection(), arcL.center(), arcR.right(),arcR.rightDirection(), arcC.directrix());
		return [arc];
	} // separate arcs
	var newL = new Voronoi.Arc(arcL.left(),arcL.leftDirection(), arcL.center(), arcR.center(),Voronoi.ARC_PARABOLA_INT_UNKNOWN, arcC.directrix());
	var newR = new Voronoi.Arc(arcL.center(),Voronoi.ARC_PARABOLA_INT_UNKNOWN, arcR.center(), arcR.right(),arcR.rightDirection(), arcC.directrix());
	var centerDistance = arcC.intersectionAverage();
	var intersections = Code.intersectionParabolas(newL.center().point(),newL.directrix().y, newR.center().point(),newR.directrix().y);
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
		newL.rightDirection(Voronoi.ARC_PARABOLA_INT_RIGHT);
		newR.leftDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
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
	this.directrix(a.directrix());
	this.edgeLeft(a.edgeLeft());
}
Voronoi.Arc.prototype.copy = function(a){ // identical
	this.phsicalCopy(a);
	this.circleEvent(a.circleEvent());
}
Voronoi.Arc.prototype.edgeLeft = function(e){
	if(e!==undefined){
		this._edgeLeft = e;
	}
	return this._edgeLeft;
}
Voronoi.Arc.prototype.edgeRight = function(e){
	if(e!==undefined){
		this._edgeRight = e;
	}
	return this._edgeRight;
}
Voronoi.Arc.prototype.circleEvent = function(c){
	if(c!==undefined){
		this._circleEvent = c;
	}
	return this._circleEvent;
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
		var intLeft = Code.intersectionParabolas(this._parabolaLeft.point(),this._directrix.y, this._parabolaCenter.point(),this._directrix.y);
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
		var intRight = Code.intersectionParabolas(this._parabolaCenter.point(),this._directrix.y, this._parabolaRight.point(),this._directrix.y);
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
	this._tree.sorting( Voronoi.WaveFront.sortingArcPoint );
}
Voronoi.WaveFront.sortingArcPoint = function(a,b){
	if( Code.isa(b,V2D) ){ // arc and point - search
		return a.containsPoint(b);
	}else{ // two arcs - insert
		if(a==b){ // this only happens at search
			return 0;
		}
		if( Voronoi.Arc.isArcToLeftOfArc(b,a) ){
			return -1;
		}
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
	return this._tree.length();
}
Voronoi.WaveFront.prototype.addArc = function(arc){
	++this._length;
	return this._tree.insertObject(arc);
}
Voronoi.WaveFront.prototype.nextNode = function(arc){
	var node = this._tree.findNodeFromObject(arc);
	return this._tree.nextNode(node);
 }
Voronoi.WaveFront.prototype.addArcAboveSiteAndDirectrixAndQueueAndGraph = function(siteEvent,directrix,queue,graph){
console.log("add ..........................................................................................."+directrix);
// console.log(this._tree.toString());
	var arc, node, list, i, left, center, right, edge, point, site;
	point = siteEvent.point();
	site = siteEvent.site();
	if(this.isEmpty()){ // infiniarc
		arc = new Voronoi.Arc(null,Voronoi.ARC_PARABOLA_INT_UNKNOWN, siteEvent.site(), null,Voronoi.ARC_PARABOLA_INT_UNKNOWN, directrix);
		node = RedBlackTree.newEmptyNode(arc);
		this._tree.insertNode(node);
	}else{
		// find arc to split
		node = this._tree.findObject(site.point());
		arc = node.data();
		// remove false-alarm circle events
		queue.removeEvent( arc.circleEvent() );
		arc.circleEvent(null);
		// get list of new arcs
		list = Voronoi.Arc.splitArcAtSite(arc,siteEvent.site());
		// copy over new left arc
		arc.physicalCopy(list[0]);
		list[0] = arc;
		// only add 2 new arcs
		for(i=1;i<list.length;++i){
			arc = list[i];
			node = RedBlackTree.newEmptyNode(arc);
			this._tree.insertNode(node);
		}
		// add new edge record
		edge = Voronoi.HalfEdge.newTwins();
// list[0].addHalfEdge(edge);
// list[1].addHalfEdge(edge.opposite());
		graph.addEdge(edge);
		graph.addEdge(edge.opposite());
		// left triplets of points
		this.checkAddCircleWithRight(list[1],directrix,queue);
 		// right triplets of points
 		this.checkAddCircleWithLeft(list[1],directrix,queue);
	}
// console.log("\n");
// console.log(this._tree.toString());
console.log("add ........................................................................................... END");
}
Voronoi.WaveFront.prototype.checkAddCircleWithRight = function(right,directrix,queue){ // left triplets of points
	var node, left, center;
	node = this._tree.findNodeFromObject(right);//right.node();
	node = this._tree.prevNode(node);
	center = node?node.data():null;
	node = this._tree.prevNode(node);
	left = node?node.data():null;
	if(left && center && right){
		this.addCirclePointFromArcs(left,center,right, directrix, queue, 1,center.center());
	}
}
Voronoi.WaveFront.prototype.checkAddCircleWithLeft = function(left,directrix,queue){ // right triplets of points
	var node, left, center;
	node = this._tree.findNodeFromObject(left);//left.node();
	node = this._tree.nextNode(node);
	center = node?node.data():null;
	node = this._tree.nextNode(node);
	right = node?node.data():null;
	if(left && center && right){
		this.addCirclePointFromArcs(left,center,right, directrix, queue, -1,center.center());
	}
}
Voronoi.WaveFront.prototype.addCirclePointFromArcs = function(left,center,right, directrix, queue, dir,convergePoint){
	var circle = Code.circleFromPoints(left.center().point(),center.center().point(),right.center().point());
	if(!circle){ return; }
		var point = new V2D(circle.center.x,circle.center.y-circle.radius);
//circle CENTER needs to be below all parabolas ( or in past)
var aboveNode = this._tree.findNodeFromObject(circle.center);
console.log(aboveNode);
console.log(circle.center+"");
var arc = aboveNode.data();
var aboveCenter = Code.pointAboveParabola(arc.center().point(),directrix.y, circle.center);
console.log( arc+""+aboveCenter );
//circle event needs to converge on correct side?
//var aboveCenter = false;
	/*if(dir==-1){ // left
		if(!(point.x<=convergePoint.x)){
			console.log("converges on wrong side - LEFT");
			return;
		}
	}else if(dir==1){ // right
		if(!(point.x>=convergePoint.x)){
			console.log("converges on wrong side - RIGHT");
			return;
		}
	}*/
	if(!aboveCenter && point.y<(directrix.y-1E-10)){ // readds same point
		console.log("ADD CIRCLE: "+point.y+" < "+directrix.y);
		var circleEvent = new Voronoi.Event(point,Voronoi.EVENT_TYPE_CIRCLE);
		circleEvent.circle(circle);
		circleEvent.left(left);
		circleEvent.center(center);
		circleEvent.right(right);
console.log(right+"");
console.log(center+"");
console.log(left+"");
		// remove previous false-alarm circle event
		queue.removeEvent( center.circleEvent() );
		// set merge circle event to disappearing arc
		center.circleEvent(circleEvent);
		queue.addEvent(circleEvent);
	}else{
		console.log("POINT IS IN PAST "+point+" | "+directrix);
	}
}
Voronoi.WaveFront.prototype.removeArcAtCircleWithDirectrixAndQueueAndGraph = function(circleEvent, directrix, queue, graph){
// console.log("BEFORE:        -------------------- -------------------------------");
// console.log(this._tree.toString());
	var i, list, left, center, right, node, vertex;
	left = circleEvent.left();
	center = circleEvent.center();
	right = circleEvent.right();
console.log(center+"");
var nodeC = this._tree.findNodeFromObject(center);
var nodeL = this._tree.prevNode(nodeC);
var nodeR = this._tree.nextNode(nodeC);
var r = nodeR.data();
var l = nodeL.data();
	// delete all circleEvents involving middle arc (including this one)
	queue.removeCircleEventWithArc( center );
console.log("MERGING ....");
console.log(l==left); // some split/merge didn't get recorded correctly...
console.log(r==right);
console.log(l+"");
console.log(r+"");
console.log("\n");
console.log(left+"");
console.log(center+"");
console.log(right+"");
left = l;
right = r;
	// calculate new arcs
	list = Voronoi.Arc.mergeArcs(left,center,right);
// copy data from middle node to graph
// add vertex at circle center and connect half-edges
vertex = new Voronoi.Vertex();
vertex.point(circleEvent.circle().center);
graph.addVertex(vertex);
// edge?.vertexA(vertex);
// edge?.opposite().vertexB(vertex);
	// only delete middle node
	var nc = this._tree.findNodeFromObject(center);
	this._tree.deleteNode(nc);
	center.kill();
	// copy left and right
	left.physicalCopy(list[0]);
	if(list.length==2){
		right.physicalCopy(list[1]);
	}else{ // unification of arc - delete both
		var nr = this._tree.findNodeFromObject(center);
		this._tree.deleteNode(nr);
	}
// add new edges & connect to vertex
edge = Voronoi.HalfEdge.newTwins();
edge.vertexA(vertex);
edge.opposite().vertexB(vertex);
// left.addHalfEdge(edge);
// right.addHalfEdge(edge);
graph.addEdge(edge);
graph.addEdge(edge.opposite());

	// left triplets of points
	this.checkAddCircleWithRight(right,directrix,queue);
	// right triplets of points
	this.checkAddCircleWithLeft(left,directrix,queue);
}
Voronoi.WaveFront.prototype.toString = function(){
	return "WAVEFRONT:\n"+this._tree.toString();
}

// --------------------------------------------------------------------------------------------------------------------
/* Site (Fortune) */
Voronoi.Site = function(p){
	this._point = new V2D();
	this._edges = [];
	this.point(p);
}
Voronoi.Site.prototype.point = function(p){
	if(p!==undefined){
		this._point.copy(p);
	}
	return this._point;
}
Voronoi.Site.prototype.toString = function(){
	var str = "[Site: ";
	str += this._point.toString()+"]";
	return str;
}

// --------------------------------------------------------------------------------------------------------------------
/* HalfEdge */
Voronoi.HalfEdge = function(){
	this._vertexA = null;
	this._vertexB = null;
	this._opposite = null;
	this._next = null;
	this._prev = null;
}
// --------------------------------------------------------------------------------------------------------------------
Voronoi.HalfEdge.newTwins = function(){
	var edgeA = new Voronoi.HalfEdge();
	var edgeB = new Voronoi.HalfEdge();
	edgeA.opposite(edgeB);
	edgeB.opposite(edgeA);
	return edgeA;
}
// --------------------------------------------------------------------------------------------------------------------
Voronoi.HalfEdge.prototype.opposite = function(o){
	if(o!==undefined){
		this._opposite = o;
	}
	return this._opposite;
}
Voronoi.HalfEdge.prototype.vertexA = function(a){
	if(a!==undefined){
		this._vertexA = a;
	}
	return this._vertexA;
}
Voronoi.HalfEdge.prototype.vertexB = function(b){
	if(b!==undefined){
		this._vertexB = b;
	}
	return this._vertexB;
}
Voronoi.HalfEdge.prototype.next = function(n){
	if(n!==undefined){
		this._next = n;
	}
	return this._next;
}
Voronoi.HalfEdge.prototype.prev = function(p){
	if(p!==undefined){
		this._prev = p;
	}
	return this._prev;
}

// --------------------------------------------------------------------------------------------------------------------
/* Vertex */
Voronoi.Vertex = function(){
	this._edges = [];
	this._point = new V2D();
}
Voronoi.Vertex.prototype.point = function(p){
	if(p!==undefined){
		this._point.copy(p);
	}
	return this._point;
}

// --------------------------------------------------------------------------------------------------------------------
/* Cell (Face) */
Voronoi.Cell = function(){
	this._point = new V2D(); // central site
	this._edges = [];
}
Voronoi.Cell.prototype.point = function(p){
	if(p!==undefined){
		this._point.copy(p);
	}
	return this._point;
}

// --------------------------------------------------------------------------------------------------------------------
/* EdgeGraph */
Voronoi.EdgeGraph = function(){
	this._edges = [];
	this._vertexes = [];
	this._cells = [];
}
Voronoi.EdgeGraph.prototype.addEdge = function(e){
	this._edges.push(e);
}
Voronoi.EdgeGraph.prototype.addVertex = function(v){
	this._vertexes.push(v);
}




/*


kruskal MST - add useful edges ordered by weight 

*/












