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
Voronoi.EPSILON = 1E-10;
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
Voronoi.Event.pointsEqualToEpsilon = function(a,b){
	var dist = V2D.distance(a,b);
	console.log("DISTANCE: "+dist);
	if(dist<Voronoi.EPSILON){
		return true;
	}
	return false;
}
Voronoi.Event.equal = function(a,b){
	if(a&&b){
		if(a.type()==b.type()){
			if(a.isCircleEvent()){
				if( Voronoi.Event.pointsEqualToEpsilon(a.point(),b.point()) && Voronoi.Event.pointsEqualToEpsilon(a.circle().center,b.circle().center) ){
					console.log("EQUALITY");
					return true;
				}
			}
		}
	}
	return false;
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
	// if(this.center()){
	// 	if(this.center()){
	// 		str += " <"+this.center()+">";
	// 	}
	// }
	str += "]";
	return str;
}

// --------------------------------------------------------------------------------------------------------------------
/* Queue */
Voronoi.Queue = function(){
	this._list = [];
}
Voronoi.Queue.sortPointY = function(a,b){
	var diff = a.point().y-b.point().y;
	// sort by x coord next?
	// handle circle events before site events -> for when circle even coincides with site event
	// if(diff==0){
	// 	if(a.isCircleEvent()&&b.isSiteEvent){
	// 		return -1;
	// 	}else if(a.isSiteEvent()&&b.isCircleEvent){
	// 		return 1;
	// 	}
	// }
	return diff; // [smallest...largest]
}
Voronoi.Queue.prototype.addEvent = function(e){
	Code.addUnique(this._list,e); // this._list.push(e);
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
			// console.log("CIRCLE CONTAIN ARC?: "+arc+" "+e.circle().center+" "+e.containsArc(arc)+" ");
			// console.log("                     "+e.left());
			// console.log("                     "+e.center());
			// console.log("                     "+e.right());
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
Voronoi.ARC_COUNT = 0;
Voronoi.Arc = function(parL,dirL, parC, parR,dirR, dirX){
	this._id = Voronoi.ARC_COUNT++;
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
Voronoi.Arc.prototype.physicalCopy = function(a){ // addition
	this._id = a._id;
	this.left(a.left());
	this.center(a.center());
	this.right(a.right());
	this.leftDirection(a.leftDirection());
	this.rightDirection(a.rightDirection());
	this.directrix(a.directrix());
	this.edgeLeft(a.edgeLeft());
	this.edgeRight(a.edgeRight());
	this.circleEvent(a.circleEvent());
	var circ = a.circleEvent(); // necessary?
	if(circ){
		if(circle.left()==a){
			circle.left(this);
		}
		if(circle.center()==a){
			circle.center(this);
		}
		if(circle.right()==a){
			circle.right(this);
		}
	}
}
Voronoi.Arc.prototype.copy = function(a){ // identical
	this.phsicalCopy(a);
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
		arcL.edgeLeft(arc.edgeLeft());
		arcL.edgeRight(null); // to be added
		arcC = new Voronoi.Arc(arc.center(),Voronoi.ARC_PARABOLA_INT_LEFT, site, arc.center(),Voronoi.ARC_PARABOLA_INT_RIGHT, arc.directrix());
		arcC.edgeLeft(null); // to be added
		arcC.edgeRight(null); // to be added
		arcR = new Voronoi.Arc(site,Voronoi.ARC_PARABOLA_INT_RIGHT, arc.center(), arc.right(),arc.rightDirection(), arc.directrix());
		arcR.edgeLeft(null); // to be added
		arcR.edgeRight(arc.edgeRight());
		return [arcL,arcC,arcR];
	}
	return null;
}
Voronoi.Arc.mergeArcs = function(arcL,arcC,arcR){
	var directrix = arcC.directrix();
	var temp = new V2D().copy(directrix); // to fix single point of intersection problem ...
	directrix.y -= 100; // some number to guarantee directions (rather than single point of itnersection)
	var retVal = Voronoi.Arc._mergeArcs2(arcL,arcC,arcR);
	directrix.copy(temp);
	return retVal;
}
Voronoi.Arc._mergeArcs2 = function(arcL,arcC,arcR){
	if(arcL.center()==arcR.center()){ // single arc
		var arc = new Voronoi.Arc(arcL.left(),arcL.leftDirection(), arcL.center(), arcR.right(),arcR.rightDirection(), arcC.directrix());
		return [arc];
	} // separate arcs
	var newL = new Voronoi.Arc(arcL.left(),arcL.leftDirection(), arcL.center(), arcR.center(),Voronoi.ARC_PARABOLA_INT_UNKNOWN, arcC.directrix());
	newL.edgeLeft(arcL.edgeLeft());
	newL.edgeRight(arcL.edgeRight());
	var newR = new Voronoi.Arc(arcL.center(),Voronoi.ARC_PARABOLA_INT_UNKNOWN, arcR.center(), arcR.right(),arcR.rightDirection(), arcC.directrix());
	newR.edgeLeft(arcR.edgeLeft());
	newR.edgeRight(arcR.edgeRight());
	var centerDistance = arcC.intersectionAverage();
	var intersections = Code.intersectionParabolas(newL.center().point(),newL.directrix().y, newR.center().point(),newR.directrix().y);
	if(intersections.length==2){
		console.log("two intersections");
		if(intersections[0].x>intersections[1].x){ // order
			intersections = [intersections[1],intersections[0]];
		}
		var distanceA = Math.abs(intersections[0].x-centerDistance);
		var distanceB = Math.abs(intersections[1].x-centerDistance);
		/*if(distanceA==distanceB){
			newL.rightDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
			newR.leftDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
		}else*/ if(distanceA<distanceB){
			newL.rightDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
			newR.leftDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
		}else{
			newL.rightDirection(Voronoi.ARC_PARABOLA_INT_RIGHT);
			newR.leftDirection(Voronoi.ARC_PARABOLA_INT_RIGHT);
		}
	}else if(intersections.length==1){
		if(false){
			console.log("INTERSECT AT POINT ...");
			// if there is an intersection at a single point, the direction DOES matter
			// detect this and get it right
		}
		console.log("SINGLE intersection");
		// doesn't matter
		newL.rightDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
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
	str += "[Arc: "+this._id+" ";
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
	str += "<"+(this._edgeLeft?"YES":"NO")+","+(this._edgeRight?"YES":"NO")+">";	
	//str += " "+(this.node().data()==this)+" ";
	str += " ";
	if(this._circleEvent){
		str += ""+this._circleEvent;
	}else{
		str += "(null)";
	}
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
		if(ints[0].x<=point.x){ // non inclusive left
			if(point.x<=ints[1].x){ // inclusive right
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
	// infinitely thin?
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
		// add to graph
		graph.addSite(arc.center());
		// infini-edge-left
		edge = Voronoi.HalfEdge.newTwins();
		graph.addEdge(edge);
		//graph.addEdge(edge.opposite()); // other side of infinity
		arc.edgeLeft(edge);
		arc.center().addEdge(edge);
		// infini-edge-right
		edge = Voronoi.HalfEdge.newTwins();
		graph.addEdge(edge);
		//graph.addEdge(edge.opposite()); // other side of infinity
		arc.edgeRight(edge);
		arc.center().addEdge(edge);
	}else{
		// find arc to split
		node = this._tree.findObject(site.point());
		arc = node.data();
		// remove false-alarm circle events
		queue.removeEvent( arc.circleEvent() );
		arc.circleEvent(null);
// INTERSECTING AT INTERSECTION POINT
var thisNode = node;
var prevNode = this._tree.prevNode(node);
var nextNode = this._tree.nextNode(node);
var siteLeft = null, siteCenter = null, siteRight = null;
if(prevNode){
	siteLeft = prevNode.data().center();
}
if(thisNode){
	siteCenter = thisNode.data().center();
}
if(nextNode){
	siteRight = nextNode.data().center();
}
// var aL, aR, pL, pR;
// var didIntersect = false;
// console.log("check point intersect");
// if(prevNode){
// 	aL = prevNode.data();
// 	aR = thisNode.data();
// 	pL = aL.intersectRight();
// 	pR = aR.intersectLeft();
// 	console.log(pL,pR);
// 	if( V2D.equal(pL,pR) ){ // split at point
// 		console.log("INTERSECT AT POINT L");
// 		didIntersect = true;
// 	}
// }
// if(nextNode){
// 	aL = thisNode.data();
// 	aR = nextNode.data();
// 	pL = aL.intersectRight();
// 	pR = aR.intersectLeft();
// 	console.log(pL,pR);
// 	if( V2D.equal(pL,pR) ){ // split at point
// 		console.log("INTERSECT AT POINT R");
// 		didIntersect = true;
// 	}
// }
// if(!didIntersect){}
		// get list of new arcs
		list = Voronoi.Arc.splitArcAtSite(arc,siteEvent.site());
		// copy over new left arc
		arc.physicalCopy(list[0]);
		list[0] = arc; // list[0].kill() - never used
		// only add 2 new arcs
		for(i=1;i<list.length;++i){
			arc = list[i];
			node = RedBlackTree.newEmptyNode(arc);
			this._tree.insertNode(node);
		}
		// add new edge record to arcs and graph
		graph.addSite(list[1].center());
		edge = Voronoi.HalfEdge.newTwins();
		graph.addEdge(edge);
		//graph.addEdge(edge.opposite());
// left
// edgeLeft already copied over
list[0].edgeRight(edge);
list[0].center().addEdge(edge);
// center
list[1].edgeLeft(edge.opposite());
list[1].edgeRight(edge.opposite());
list[1].center().addEdge(edge.opposite());
// right
list[2].edgeLeft(edge);
//list[2].center().addEdge(edge); // already added at left arc
// edgeRight already copied over
		// left triplets of points
		this.checkAddCircleWithRight(list[1],directrix,queue,null, true);
 		// right triplets of points
 		this.checkAddCircleWithLeft(list[1],directrix,queue,null, true);
	}
// console.log("\n");
// console.log(this._tree.toString());
// console.log("SPLIT RESULT: ");
// console.log(graph.toString());
console.log("add ........................................................................................... END");
}
Voronoi.WaveFront.prototype.checkAddCircleWithRight = function(right,directrix,queue, circleEvent, isAdd){ // left triplets of points
	var node, left, center;
	node = this._tree.findNodeFromObject(right);//right.node();
	node = this._tree.prevNode(node);
	center = node?node.data():null;
	node = this._tree.prevNode(node);
	left = node?node.data():null;
	if(left && center && right){
		this.addCirclePointFromArcs(left,center,right, directrix, queue, circleEvent, isAdd);// 1,center.center());
	}
}
Voronoi.WaveFront.prototype.checkAddCircleWithLeft = function(left,directrix,queue, circleEvent, isAdd){ // right triplets of points
	var node, right, center;
	node = this._tree.findNodeFromObject(left);//left.node();
	node = this._tree.nextNode(node);
	center = node?node.data():null;
	node = this._tree.nextNode(node);
	right = node?node.data():null;
	if(left && center && right){
		this.addCirclePointFromArcs(left,center,right, directrix, queue, circleEvent, isAdd);// -1,center.center());
	}
}

Voronoi.WaveFront.prototype.addCirclePointFromArcs = function(left,center,right, directrix, queue, oldCircleEvent, isAdd){//dir,convergePoint){
	isAdd = isAdd!==undefined?isAdd:false;
	// is it necessary to check if newest circle has a higher point before it overwrites the old? or is order of discovery the priority?
// remove previous false-alarm circle event - reguardless of what happens
queue.removeEvent( center.circleEvent() );
center.circleEvent(null);
	var circle = Code.circleFromPoints(left.center().point(),center.center().point(),right.center().point());
	if(!circle){ return; } // not colinear
// test for convergence: circle is consistently oriented (based on parabola points)
// var AB = V2D.diff(left.center().point(), center.center().point());
// var BC = V2D.diff(center.center().point(), right.center().point());
// var ACirc = V2D.diff(left.center().point(), circle.center);
// var BCirc = V2D.diff(center.center().point(), circle.center);
// var c1 = V2D.cross(AB,ACirc);
// var c2 = V2D.cross(BC,BCirc);
// var isConvergence = ((c1<=0)&&(c2<=0));// || ((c1>=0)&&(c2>=0));
// 
var AB = V2D.diff(left.center().point(), center.center().point());
var CB = V2D.diff(right.center().point(), center.center().point());
var isConvergence = V2D.cross(AB,CB)>=0;
if(!isConvergence){
	return;
}

// THIS IS INCORRECT AGAIN

		var point = new V2D(circle.center.x,circle.center.y-circle.radius);
//circle CENTER needs to be below all parabolas ( or in past)
var aboveNode = this._tree.findNodeFromObject(circle.center);
// console.log(aboveNode);
// console.log(circle.center+"");
var arc = aboveNode.data();
var aboveCenter = Code.pointAboveParabola(arc.center().point(),directrix.y, circle.center);
//console.log( arc+""+aboveCenter );
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
	//if(!aboveCenter){
	if(!aboveCenter && point.y<=directrix.y){
	//if(point.y<=directrix.y){
	//if( (isAdd && point.y<=directrix.y) || (!isAdd && point.y<directrix.y) ){
	//if(!aboveCenter && point.y<(directrix.y-1E-10)){
	//if( (!isAdd && !aboveCenter) || (isAdd && !aboveCenter && point.y<(directrix.y-1E-10)) ){
	//&& point.y<=directrix.y ){// point.y<(directrix.y-1E-10)){ // readds same point --- use some other method, like 'amIOnMyWayOut' to prevent calculation
console.log("addCirclePointFromArcs: "+circle.center+" | "+circle.radius+" ADD CIRCLE  ADD CIRCLE  ADD CIRCLE  ADD CIRCLE  ADD CIRCLE  ADD CIRCLE  ADD CIRCLE  ADD CIRCLE  ADD CIRCLE  ADD CIRCLE :::::: "+point+" | "+directrix);
		//console.log("ADD CIRCLE: "+point.y+" < "+directrix.y);
		var circleEvent = new Voronoi.Event(point,Voronoi.EVENT_TYPE_CIRCLE);
		circleEvent.circle(circle);
		circleEvent.left(left);
		circleEvent.center(center);
		circleEvent.right(right);
console.log(right+"");
console.log(center+"");
console.log(left+"");
		// // remove previous false-alarm circle event ^^^^^^^^^^^^^^
		// queue.removeEvent( center.circleEvent() );
		// set merge circle event to disappearing arc
		center.circleEvent(circleEvent);

// PROBLEM: circle events are being generated for arcs that don't converge - but who's parabolas do - 

		if( true){//!Voronoi.Event.equal(oldCircleEvent,circleEvent) ){
			console.log("NOT DUPLICATE: "+circleEvent);
			queue.addEvent(circleEvent);
		}else{
			console.log("DUPLICATE IGNORED: "+circleEvent);
		}
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

var prevSiteLeft = left.center();
var prevSiteCenter = center.center();
var prevSiteRight = right.center();

console.log(center+"");
var nodeC = this._tree.findNodeFromObject(center);
var nodeL = this._tree.prevNode(nodeC);
var nodeR = this._tree.nextNode(nodeC);
var r = nodeR.data();
var l = nodeL.data();
	// delete all circleEvents involving middle arc
	queue.removeCircleEventWithArc( center );
// console.log("MERGING ....");
// console.log(l==left); // some split/merge didn't get recorded correctly...
// console.log(r==right);
// console.log(l+"");
// console.log(r+"");
// console.log("\n");
// console.log(left+"");
// console.log(center+"");
// console.log(right+"");
left = l;
right = r;

	// calculate new arcs
//var temp = new V2D().copy(directrix); // to fix single point of intersection problem ...
//directrix.y -= 100; // some number to guarantee directions (rather than single point of itnersection)
	list = Voronoi.Arc.mergeArcs(left,center,right);
//directrix.copy(temp);
	// only delete middle node
	var nc = this._tree.findNodeFromObject(center);
	this._tree.deleteNode(nc);
//	center.kill(); ///////////////////////////////////////////////// ?
	// copy left and right
	left.physicalCopy(list[0]);
	if(list.length==2){
		right.physicalCopy(list[1]);
	}else{ // unification of arc - delete both
		var nr = this._tree.findNodeFromObject(center);
		this._tree.deleteNode(nr);
	}

console.log("......................");
console.log(left+"");
console.log(right+"");
console.log( left.edgeRight() );
console.log( right.edgeLeft() );
// add vertex at circle center and connect half-edges
vertex = new Voronoi.Vertex();
vertex.point(circleEvent.circle().center);
graph.addVertex(vertex);
// add vertex to old edges
left.edgeRight().vertexAdd(vertex);
//left.edgeRight().opposite().vertexAdd(vertex);
right.edgeLeft().vertexAdd(vertex);
//right.edgeLeft().opposite().vertexAdd(vertex);
// add old edges to vertex
vertex.addEdge(left.edgeRight());
//vertex.addEdge(left.edgeRight().opposite());
vertex.addEdge(right.edgeLeft());
//vertex.addEdge(right.edgeLeft().opposite());

// new edge from vertex
var edge = Voronoi.HalfEdge.newTwins();

// add edge to vertex
vertex.addEdge(edge);
//vertex.addEdge(edge.opposite());
// add vertex to edge
edge.vertexAdd(vertex);
//edge.opposite().vertexAdd(vertex);

// link old edges to new edges (via vertex) -- should do this with same operation as vertex?
left.edgeRight().opposite().next(right.edgeLeft().opposite());
right.edgeLeft().opposite().next(left.edgeRight().opposite());
// 2
left.edgeRight().next(edge);
edge.prev(left.edgeRight());
// 3
right.edgeLeft().next(edge.opposite());
edge.opposite().prev(right.edgeLeft());
// update arc edges to new edge+opposite
left.edgeRight(edge);
left.center().addEdge(edge);
right.edgeLeft(edge.opposite());
right.center().addEdge(edge.opposite());


// PROBLEM: circles are adding converging points for incorrect converging points
// need to somehow verify that the arc being included IS the arc calculating for

/*
var n, l, c, r;

	r = right;
	n = this._tree.findNodeFromObject(r);
	n = this._tree.prevNode(n);
	c = n?n.data():null;
	n = this._tree.prevNode(n);
	l = n?n.data():null;
	if(l && c && r){
		l = l.center();
		c = c.center();
		r = r.center();
		if( !(l==prevSiteLeft || l==prevSiteCenter || l==prevSiteRight) &&
			!(c==prevSiteLeft || c==prevSiteCenter || c==prevSiteRight) &&
			!(r==prevSiteLeft || r==prevSiteCenter || r==prevSiteRight) ){
			console.log("FOUNDX-CHECK1");
			//console.log(l.point()+","+c.point()+","+r.point());
			//console.log(prevSiteLeft.point()+","+prevSiteCenter.point()+","+prevSiteRight.point());
			this.checkAddCircleWithRight(right,directrix,queue);
		}else{
			console.log("FOUNDX1");
		}
		//this.addCirclePointFromArcs(left,center,right, directrix, queue, isAdd);// 1,center.center());
	}


	r = left;
	n = this._tree.findNodeFromObject(r);
	n = this._tree.prevNode(n);
	c = n?n.data():null;
	n = this._tree.prevNode(n);
	l = n?n.data():null;
	if(l && c && r){
		l = l.center();
		c = c.center();
		r = r.center();
		if( !(l==prevSiteLeft || l==prevSiteCenter || l==prevSiteRight) &&
			!(c==prevSiteLeft || c==prevSiteCenter || c==prevSiteRight) &&
			!(r==prevSiteLeft || r==prevSiteCenter || r==prevSiteRight) ){
			console.log("FOUNDX-CHECK2");
			this.checkAddCircleWithRight(left,directrix,queue);
		}else{
			console.log("FOUNDX2");
		}
		//this.addCirclePointFromArcs(left,center,right, directrix, queue, isAdd);// 1,center.center());
	}
*/

	// // left triplets of points
	// this.checkAddCircleWithRight(right,directrix,queue);
	// // right triplets of points
	// this.checkAddCircleWithLeft(left,directrix,queue);

// --------
	// left triplets of points
	this.checkAddCircleWithRight(right,directrix,queue,circleEvent);
// if(!Voronoi.Event.equal(circleEvent,newCE)){
// 	newCE;
// 	console.log("ADDED CIRCLE EVENT:");
// }else{
// 	console.log("CIRCLE EVENT DUPLICATE:");
// }
	// right triplets of points
	this.checkAddCircleWithLeft(left,directrix,queue,circleEvent);
//
// console.log("MERGE RESULT: ");
// console.log(graph.toString());
// circleEvent.kill();
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
Voronoi.Site.prototype.addEdge = function(e){
	this._edges.push(e);
}
Voronoi.Site.prototype.edges = function(){
	return this._edges;
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
	var edgeB = edgeA; // new Voronoi.HalfEdge();
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
Voronoi.HalfEdge.prototype.vertexAdd = function(v){ // assigns external vertex to unassigned internal vertex
	if(!this._vertexA){
		this._vertexA = v
	}else if(!this._vertexB){
		this._vertexB = v;
	}else{
		"BOTH VERTEXES ALREADY ASSIGNED";
	}
	// if I know the site, I can calculate CCW and correct my direction if necessary
}

Voronoi.HalfEdge.prototype.vertexA = function(a){
	if(a!==undefined){
		console.log("vertexA WAS: "+this._vertexA+" IS: "+a);
		this._vertexA = a;
	}
	return this._vertexA;
}
Voronoi.HalfEdge.prototype.vertexB = function(b){
	if(b!==undefined){
		console.log("vertexB WAS: "+this._vertexB+" IS: "+b);
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
Voronoi.HalfEdge.prototype.toString = function(){
	var str = "[HalfEdge: ";
	str += this._vertexA+" -> "+this._vertexB+" ";
	str += (this._prev?"prev":"null")+" <-> "+(this._next?"next":"null");
	str += "]";
	return str;
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
Voronoi.Vertex.prototype.addEdge = function(e){
	this._edges.push(e);
}
Voronoi.Vertex.prototype.toString = function(){
	var str = "[Vertex: ";
	str += this._point+" ("+this._edges.length+")";
	str += "]";
	return str;
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
	this._cells = []; // final?
	this._sites = []; // initial - from fortune algorithm
}
Voronoi.EdgeGraph.prototype.addEdge = function(e){
	this._edges.push(e);
}
Voronoi.EdgeGraph.prototype.addVertex = function(v){
	this._vertexes.push(v);
}
Voronoi.EdgeGraph.prototype.addSite = function(s){ // parabolas
	this._sites.push(s);
}
Voronoi.EdgeGraph.prototype.sites = function(){
	return this._sites;
}
Voronoi.EdgeGraph.prototype.toString = function(){
	var str = "";
	var face, halfEdge, edges, faces = this.sites();
	for(i=0;i<faces.length;++i){
		face = faces[i];
		edges = face.edges();
		for(j=0;j<edges.length;++j){
			halfEdge = edges[j];
			str += " "+i+"  : "+j+": "+halfEdge+"\n";
		}
		//str += "FACE/SITE "+i+": "+face+"--------------\n";
	}
	return str;
}


/*


kruskal MST - add useful edges ordered by weight 

*/












