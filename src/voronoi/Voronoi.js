// Voronoi.js
Voronoi.EPSILON = 1E-10;


function Voronoi(){
	this._graph = new Graph();
	this._points = new Array();
}
// -----------------------------------------------------------------------------------------------
Voronoi.pointsEqualToEpsilon = function(a,b){
	var dist = V2D.distance(a,b);
	if(dist<Voronoi.EPSILON){
		return true;
	}
	return false;
}
Voronoi.removeDuplicatePoints2D = function(array){
	var i, j, a, b, len = array.length;
	for(i=0;i<len;++i){
		a = array[i];
		for(j=i+1;j<len;++j){
			b = array[j];
			if( Voronoi.pointsEqualToEpsilon(a,b) ){
				console.log("duplicate point: "+a+" | "+b);
				--len;
				array[j] = array[len];
				array.pop();
				--j;
			}
		}
	}
}
Voronoi.removePointsBelow = function(array, point){
	var i, a, len = array.length;
	for(i=0;i<len;++i){
		a = array[i];
		if(a.y<point.y){
			--len;
			array[i] = array[len];
			array.pop();
			--i;
		}
	}
}
// -----------------------------------------------------------------------------------------------
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
	this._arcCenter = null;
	this._circle = null;
	// init
	this.point(p);
	this.type(t);
}
Voronoi.Event.equal = function(a,b){
	if(a&&b){
		if(a.type()==b.type()){
			if(a.isCircleEvent()){
				if( Voronoi.pointsEqualToEpsilon(a.point(),b.point()) && Voronoi.pointsEqualToEpsilon(a.circle().center,b.circle().center) ){
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
Voronoi.Event.prototype.center = function(c){
	if(c!==undefined){
		this._arcCenter = c;
	}
	return this._arcCenter;
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
Voronoi.Queue.sortPointY = function(a,b){ // since added after all site events, circle events are always first?
	var diff = a.point().y-b.point().y;
	// handle circle events before site events -> for when circle even coincides with site event
	// if(a.isCircleEvent()&&b.isSiteEvent){
	// 	return -1;
	// }else if(a.isSiteEvent()&&b.isCircleEvent){
	// 	return 1;
	// }
	if(diff==0){
		diff = a.point().x-b.point().x;
	}
	return diff; // [smallest...largest]
}
Voronoi.Queue.prototype.addEvent = function(e){
	Code.addUnique(this._list,e); // this._list.push(e);
	this._list.sort( Voronoi.Queue.sortPointY );
}
Voronoi.Queue.prototype.removeEvent = function(e){
	Code.removeElement(this._list,e);
}

Voronoi.Queue.prototype.removeCircleEventWithArcAndTree = function(arc,tree){
	var i, e, left, right;
	for(i=0; i<this._list.length; ++i){
		e = this._list[i];
		if(e.isCircleEvent()){
			if(e.containsArc(arc)){
				if(e.center().circleEvent()==e){
					e.center().circleEvent(null);
				}
				left = tree.prevNode(e.center().node());
				left = left.data();
				if(left.circleEvent()==e){
					left.circleEvent(null);
				}
				right = tree.prevNode(e.center().node());
				right = right.data();
				if(right.circleEvent()==e){
					right.circleEvent(null);
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
	this._node = null; // pointer to tree node for faster referencing AND numerical error ignorance
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
	//this.node(a.node());
	var circ = a.circleEvent(); // necessary? - this is later deleted when new circle-events are serached for
	this.circleEvent( circ );
	if(circ){
		if(circle.center()==a){
			circle.center(this);
		}
	}
}
Voronoi.Arc.prototype.copy = function(a){ // identical
	this.physicalCopy(a);
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
Voronoi.Arc.splitArcAtSite = function(arc,site, tree){
	if(arc.containsPointBoolean(site.point())){
		/*var directrix = arc.directrix();
		var temp = new V2D().copy(directrix);
		directrix.y -= 100.0;
		var pointA = arc.center().point();
		var pointB = site.point();
		var ints = Code.intersectionParabolas( pointA, directrix.y, pointB, directrix.y );
		directrix.copy(temp);
		if(ints.length==1){ // happens if first n sites have same y coord
			console.log(tree.toString());
			// refind to get correct arc
			var node = tree.findObject(site.point());
			arc = node.data();
			var pointA = arc.center().point();
			console.log(pointA+" <");
			// if it's
			if(pointA<pointB){
				pointA = arc.center();
				pointB = site;
			}else{
				pointB = arc.center();
				pointA = site;
			}
			arcL = new Voronoi.Arc(arc.left(),arc.leftDirection(), pointA, pointB,Voronoi.ARC_PARABOLA_INT_RIGHT, arc.directrix());
			arcL.edgeLeft(arc.edgeLeft());
			arcL.edgeRight(null); // to be added
			arcR = new Voronoi.Arc(pointA,Voronoi.ARC_PARABOLA_INT_LEFT, pointB, arc.right(),arc.rightDirection(), arc.directrix());
			arcR.edgeLeft(null); // to be added
			arcR.edgeRight(arc.edgeRight());
			return [arcL,arcR];
		}else{*/
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
		//}
	}
	return null;
}
Voronoi.Arc.mergeArcs = function(arcL,arcC,arcR){
	var directrix = arcC.directrix();
	var temp = new V2D().copy(directrix); // to fix single point of intersection problem ...
	directrix.y -= 100.0; // some number to guarantee directions (rather than single point of intersection)
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
		// doesn't matter
		newL.rightDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
		newR.leftDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
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
	str += " "+(this.node()?(this.node().data()==this):"null")+" ";
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
		if(ints[0].x<point.x){ // non inclusive left
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
	if( Code.isa(b,V2D) ){ // arc and point - search
		return a.containsPoint(b);
	}else{ // two arcs - insert
		if(a==b){ // this only happens at arc search
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
	var node = arc.node();
	return this._tree.nextNode(node);
}
Voronoi.WaveFront.prototype.addArcAboveSiteAndDirectrixAndQueueAndGraph = function(siteEvent,directrix,queue,graph){
//console.log("add ..........................................................................................."+directrix);
	var arc, node, list, i, left, center, right, edge, point, site;
	point = siteEvent.point();
	site = siteEvent.site();
	if(this.isEmpty()){ // infiniarc(s)
		var prevArc = null;
		var wasSort = this._tree.sorting();
		var fxn = function(a,b){
			return b.center().point().x - a.center().point().x;
		};
		this._tree.sorting( fxn );
		while(site){ // multiple initial sites with same y
			arc = new Voronoi.Arc(null,Voronoi.ARC_PARABOLA_INT_UNKNOWN, site, null,Voronoi.ARC_PARABOLA_INT_UNKNOWN, directrix);
			node = RedBlackTree.newEmptyNode(arc);
			arc.node(node);
			// add site to graph
			graph.addSite(arc.center());
			if(prevArc){
				arc.right(prevArc.center());
				prevArc.left(arc.center());
				arc.leftDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
				prevArc.leftDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
				// add edges to graph
				edge = Voronoi.HalfEdge.newTwins();
				graph.addEdge(edge);
				graph.addEdge(edge.opposite());
				// add edges to arcs
				prevArc.edgeLeft(edge);
				arc.edgeRight(edge.opposite());
				// add edges to sites
				prevArc.center().addEdge(edge);
				arc.center().addEdge(edge.opposite());
				// add sites to edges
				edge.site(prevArc.center());
				edge.opposite().site(arc.center());
			}
			prevArc = arc; // remember for next iteration
			this._tree.insertNode(node);
			// check if next arc is at same y:
			site = null;
			var peek = queue.peek();
			if(peek && peek.point().y>=directrix.y){
				siteEvent = queue.next();
				point = siteEvent.point();
				site = siteEvent.site();
			}
		}
		this._tree.sorting( wasSort );
	}else{
		// find arc to split
		node = this._tree.findObject(site.point());
		arc = node.data();
		// remove false-alarm circle events
		queue.removeEvent( arc.circleEvent() );
		arc.circleEvent(null);
		// get list of new arc set
		list = Voronoi.Arc.splitArcAtSite(arc,site, this._tree);
		// copy over new left arc
		arc.physicalCopy(list[0]);
		// arc.node == same node as before
		list[0].kill(); // - never used
		list[0] = arc;
		// only add 2 new arcs
		for(i=1;i<list.length;++i){
			arc = list[i];
			node = RedBlackTree.newEmptyNode(arc);
			this._tree.insertNode(node);
			arc.node(node);
		}
		// add site to graph
		graph.addSite(list[1].center());
		// add edges to graph
		edge = Voronoi.HalfEdge.newTwins();
		graph.addEdge(edge);
		graph.addEdge(edge.opposite());
		// add edges to sites
		list[1].center().addEdge(edge); // center
		list[0].center().addEdge(edge.opposite()); // left + right
		// add sites to edges
		edge.site(list[1].center()); // center
		edge.opposite().site(list[0].center()); // left + right
		// left
		// edgeLeft already copied over
		list[0].edgeRight(edge.opposite());
		// center
		list[1].edgeLeft(edge);
		list[1].edgeRight(edge);
		// right
		if(list.length==3){
			list[2].edgeLeft(edge.opposite());
		}
		// edgeRight already copied over
		// left triplets of points
		this.checkAddCircleWithRight(list[1],directrix,queue);
 		// right triplets of points
 		this.checkAddCircleWithLeft(list[1],directrix,queue);
	}
	siteEvent.kill();
}
Voronoi.WaveFront.prototype.checkAddCircleWithRight = function(right,directrix,queue){ // left triplets of points
	var node, left, center;
	node = right.node();
	node = this._tree.prevNode(node);
	center = node?node.data():null;
	node = this._tree.prevNode(node);
	left = node?node.data():null;
	if(left && center && right){
		this.addCirclePointFromArcs(left,center,right, directrix, queue);
	}
}
Voronoi.WaveFront.prototype.checkAddCircleWithLeft = function(left,directrix,queue){ // right triplets of points
	var node, right, center;
	node = left.node();
	node = this._tree.nextNode(node);
	center = node?node.data():null;
	node = this._tree.nextNode(node);
	right = node?node.data():null;
	if(left && center && right){
		this.addCirclePointFromArcs(left,center,right, directrix, queue);
	}
}

Voronoi.WaveFront.prototype.addCirclePointFromArcs = function(left,center,right, directrix, queue){
	// remove previous false-alarm circle event - reguardless of what happens
	queue.removeEvent( center.circleEvent() );
	center.circleEvent(null);
	var circle = Code.circleFromPoints(left.center().point(),center.center().point(),right.center().point());
	if(!circle){  return; } // not colinear
	// convergence = CW around 
	var AB = V2D.diff(left.center().point(), center.center().point());
	var CB = V2D.diff(right.center().point(), center.center().point());
	var isConvergence = V2D.cross(AB,CB)>=0;
	if(!isConvergence){
		return;
	}
	// queue point
	var point = new V2D(circle.center.x,circle.center.y-circle.radius);
	 // find node to attach to by point search
	var arc = this._tree.findNodeFromObject(circle.center).data();
	var aboveCenter = Code.pointAboveParabola(arc.center().point(),directrix.y, circle.center);
	if(!aboveCenter && point.y<=directrix.y){
		var circleEvent = new Voronoi.Event(point,Voronoi.EVENT_TYPE_CIRCLE);
		circleEvent.circle(circle);
		circleEvent.center(center);
		// set merge circle event to disappearing arc
		center.circleEvent(circleEvent);
		queue.addEvent(circleEvent);
	} // else point is in past
}
Voronoi.WaveFront.prototype.removeArcAtCircleWithDirectrixAndQueueAndGraph = function(circleEvent, directrix, queue, graph){
//console.log("BEFORE MERGE:        -------------------- -------------------------------");
	var i, list, left, center, right, node, vertex, nc;
	center = circleEvent.center();
	nc = center.node();
	left = this._tree.prevNode( nc ).data();
	right = this._tree.nextNode( nc ).data();
	// delete all circleEvents involving middle arc
	queue.removeCircleEventWithArcAndTree( center, this._tree );
	// calculate new arcs
	list = Voronoi.Arc.mergeArcs(left,center,right);
	// only delete middle node
	this._tree.deleteNode(nc);
	center.kill();
// if RedBlackTree isn't consistent with deletion:
if(nc.data()){
	nc.data().node(nc);
}
	// copy left and right
	left.physicalCopy(list[0]);
	if(list.length==2){
		right.physicalCopy(list[1]);
	}else{ // unification of arc - delete both - can this ever happen ?
		console.log("has this ever been tested ?");
		var nr = center.node();
		this._tree.deleteNode(nr);
	}
	// add vertex at circle center to graph
	vertex = new Voronoi.Vertex();
	vertex.point(circleEvent.circle().center);
	graph.addVertex(vertex);
	// add old edges to vertex
	vertex.addEdge(left.edgeRight());
	vertex.addEdge(left.edgeRight().opposite());
	vertex.addEdge(right.edgeLeft());
	vertex.addEdge(right.edgeLeft().opposite());
	// new edge from vertex
	var edge = Voronoi.HalfEdge.newTwins();
	// add edge to graph
	graph.addEdge(edge);
	graph.addEdge(edge.opposite());
	// add edge to vertex
	vertex.addEdge(edge);
	vertex.addEdge(edge.opposite());
	// add vertex+edges to closing cell
	left.edgeRight().opposite().vertexAndEdgeAdd(vertex, right.edgeLeft().opposite());
	right.edgeLeft().opposite().vertexAndEdgeAdd(vertex, left.edgeRight().opposite());
	// add vertex+edges to left cell
	left.edgeRight().vertexAndEdgeAdd(vertex, edge.opposite());
	edge.opposite().vertexAndEdgeAdd(vertex, left.edgeRight());
	// add vertex+edges to right cell
	right.edgeLeft().vertexAndEdgeAdd(vertex, edge);
	edge.vertexAndEdgeAdd(vertex, right.edgeLeft());
	// add new edge to sites
	edge.opposite().site( left.center() );
	edge.site( right.center() );
	// add edge to sites
	left.center().addEdge(edge.opposite());
	right.center().addEdge(edge);

var e1 = left.edgeRight();
var e2 = right.edgeLeft();
if( e1.vertexA() && e1.vertexB() && Voronoi.pointsEqualToEpsilon(e1.vertexA().point(),e1.vertexB().point()) ){
// PROPER CLEANUP -> TOTALLY REMOVE ONE OF THE VERTEXES
	// my orientation cannot be trusted
	var vP = e1.vertexA().point();
	console.log("DROP DUPLICATED VERTEXES 1");

	if( e1.prev().vertexB() && Voronoi.pointsEqualToEpsilon(e1.prev().vertexB().point(), vP) ){
		e1.prev().next( e1.next() );
	}else if( e1.prev().vertexA() && Voronoi.pointsEqualToEpsilon(e1.prev().vertexA().point(), vP) ){
		e1.prev().prev( e1.next() );
	}else{
		console.log("ERRRRRRRRRRRR 1");
	}
	if( e1.next().vertexB() && Voronoi.pointsEqualToEpsilon(e1.next().vertexB().point(), vP) ){
		e1.next().next( e1.prev() );
	}else if( e1.next().vertexA() && Voronoi.pointsEqualToEpsilon(e1.next().vertexA().point(), vP) ){
		e1.next().prev( e1.prev() );
	}else{
		console.log("ERRRRRRRRRRRR 2");
	}
	e1.site().removeEdge(e1);
	e1.opposite().site().removeEdge(e1.opposite());

e1 = e1.opposite();
	var vP = e1.vertexA().point();
	console.log("DROP DUPLICATED VERTEXES 4");

	if( e1.prev().vertexB() && Voronoi.pointsEqualToEpsilon(e1.prev().vertexB().point(), vP) ){
		e1.prev().next( e1.next() );
	}else if( e1.prev().vertexA() && Voronoi.pointsEqualToEpsilon(e1.prev().vertexA().point(), vP) ){
		e1.prev().prev( e1.next() );
	}else{
		console.log("ERRRRRRRRRRRR 1");
	}
	if( e1.next().vertexB() && Voronoi.pointsEqualToEpsilon(e1.next().vertexB().point(), vP) ){
		e1.next().next( e1.prev() );
	}else if( e1.next().vertexA() && Voronoi.pointsEqualToEpsilon(e1.next().vertexA().point(), vP) ){
		e1.next().prev( e1.prev() );
	}else{
		console.log("ERRRRRRRRRRRR 2");
	}

/*
	e1.prev().next( e1.next() );
	e1.next().prev( e1.prev() );
	e1.site().removeEdge(e1);

	e1.opposite().prev().next( e1.opposite().next() );
	e1.opposite().next().prev( e1.opposite().prev() );
	e1.opposite().site().removeEdge(e1.opposite());
*/
	// remove e1 / opposite from sites and graph and vertexes
	// remove duplicated vertex from graph
}
// if( e1.opposite().vertexA() && e1.opposite().vertexB() && Voronoi.pointsEqualToEpsilon(e1.opposite().vertexA().point(),e1.opposite().vertexB().point()) ){
// 	console.log("DROP DUPLICATED VERTEXES 4");
// }



if( e2.vertexA() && e2.vertexB() && Voronoi.pointsEqualToEpsilon(e2.vertexA().point(),e2.vertexB().point()) ){
	console.log("DROP DUPLICATED VERTEXES 2");
}
if( edge.vertexA() && edge.vertexB() && Voronoi.pointsEqualToEpsilon(edge.vertexA().point(),edge.vertexB().point()) ){
	console.log("DROP DUPLICATED VERTEXES 3");
}
if( e2.opposite().vertexA() && e2.opposite().vertexB() && Voronoi.pointsEqualToEpsilon(e2.opposite().vertexA().point(),e2.opposite().vertexB().point()) ){
	console.log("DROP DUPLICATED VERTEXES 5");
}
if( edge.opposite().vertexA() && edge.vertexB() && Voronoi.pointsEqualToEpsilon(edge.opposite().vertexA().point(),edge.opposite().vertexB().point()) ){
	console.log("DROP DUPLICATED VERTEXES 6");
}
/*
if(edge.next() && e1.next()){
	if(edge == e1.next()){
		console.log("next is prev");
	}
}
if(edge.opposite().next() && e1.next()){
	if(edge.opposite().next() == e1.next()){
		console.log("next is prev");
	}
}
if(edge.next() && e1.next()){
	if(edge.next() == e1.prev()){
		console.log("next is prev");
	}
}
if(edge.opposite().prev() && e1.next()){
	if(edge.opposite().prev() == e1.next()){
		console.log("next is prev");
	}
}
// other
if(edge.prev() && e2.next()){
	if(edge.prev() == e2.next()){
		console.log("next is prev");
	}
}
if(edge.opposite().prev() && e2.next()){
	if(edge.opposite().prev() == e2.next()){
		console.log("next is prev");
	}
}
*/
	// update arc edges to new edge+opposite
	left.edgeRight(edge.opposite());
	right.edgeLeft(edge);
	// left triplets of points
	this.checkAddCircleWithRight(right,directrix,queue,circleEvent);
	// right triplets of points
	this.checkAddCircleWithLeft(left,directrix,queue,circleEvent);
	// done with event
	circleEvent.kill();
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
Voronoi.Site.prototype.removeEdge = function(e){
	//console.log("REMOVING: "+this._edges.length);
	Code.removeElementSimple(this._edges, e);
	//console.log("      => "+this._edges.length);
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
Voronoi.HALF_EDGE_COUNT = 0;
Voronoi.HalfEdge = function(){
	this._id = ++Voronoi.HALF_EDGE_COUNT;
	this._vertexA = null;
	this._vertexB = null;
	this._opposite = null;
	this._next = null;
	this._prev = null;
	this._site = null;
	//this.triangle = null; // delaunay
	this.triangle = 0; // delaunay
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
Voronoi.HalfEdge.prototype.site = function(s){
	if(s!==undefined){
		this._site = s;
	}
	return this._site;
}
Voronoi.HalfEdge.prototype.opposite = function(o){
	if(o!==undefined){
		this._opposite = o;
	}
	return this._opposite;
}
Voronoi.HalfEdge.prototype.vertexAndEdgeAdd = function(v,e){ // assigns external vertex to unassigned internal vertex
	if(!this._vertexA){
		this._vertexA = v
		this._prev = e;
	}else if(!this._vertexB){
		this._vertexB = v;
		this._next = e;
		this.checkOrientation();
	}else{
		"BOTH VERTEXES ALREADY ASSIGNED";
	}
	// if I know the site, I can calculate CCW and correct my direction if necessary
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
Voronoi.HalfEdge.prototype.flipDirection = function(){
	temp = this._prev;
	this._prev = this._next;
	this._next = temp;
	temp = this._vertexA;
	this._vertexA = this._vertexB;
	this._vertexB = temp;
}
Voronoi.HalfEdge.prototype.checkOrientation = function(){
	if(this._vertexA && this._vertexB && this._site){
		var AC = V2D.sub(this._vertexA.point(),this._site.point());
		var BC = V2D.sub(this._vertexB.point(),this._site.point());
		if( V2D.cross(AC,BC)<0 ){
		//if( V2D.angleDirection(AC,BC)>0 ){
			this.flipDirection();
		}
	}
}
Voronoi.HalfEdge.prototype.toString = function(){
	var str = "[HalfEdge: "+this._id+" ";
	str += this._vertexA+" -> "+this._vertexB+" ";
	str += (this._prev?"prev":"null")+" <-> "+(this._next?"next":"null");
	str += this.site?" (S)":" (?)";
	str += "]";
	return str;
}

// --------------------------------------------------------------------------------------------------------------------
/* Vertex */
Voronoi.Vertex = function(p){
	this._edges = [];
	this._point = new V2D();
	this.point(p);
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
	this._point = new V2D();
	this._edges = [];
	this.vertex = null; // delaunay
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
Voronoi.EdgeGraph.prototype.edges = function(){
	return this._edges;
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
Voronoi.EdgeGraph.prototype.finalize = function(root){ // cap infinite edges to box
	var i, j, k, l, len, sites, site, edges, edge, ang, temp, vertex, center, d, ray, yar, mid, ints, dir, org, a, b, p, count, arr, prevEdge, prevVertex;
	sites = this._sites;

	// empty: nothing to do
	if(this._sites.length==0){
		return;
	}

	// find box dynamically by limits of vertexes and sites + padding
	var boxPadding = 100;
	var boxTLX = this._sites[0].point().x;
	var boxTLY = this._sites[0].point().y;
	var boxBRX = boxTLX;
	var boxBRY = boxTLY;
	arr = this._sites;
	len = arr.length;
	for(i=1;i<len;++i){
		boxTLX = Math.min(boxTLX,arr[i].point().x);
		boxTLY = Math.max(boxTLY,arr[i].point().y);
		boxBRX = Math.max(boxBRX,arr[i].point().x);
		boxBRY = Math.min(boxBRY,arr[i].point().y);
	}
	arr = this._vertexes;
	len = arr.length;
	for(i=0;i<len;++i){
		boxTLX = Math.min(boxTLX,arr[i].point().x);
		boxTLY = Math.max(boxTLY,arr[i].point().y);
		boxBRX = Math.max(boxBRX,arr[i].point().x);
		boxBRY = Math.min(boxBRY,arr[i].point().y);
	}
	boxTLX -= boxPadding;
	boxTLY += boxPadding;
	boxBRX += boxPadding;
	boxBRY -= boxPadding;
	var boxWid = boxBRX-boxTLX;
	var boxHei = boxTLY-boxBRY;
	var maxMagnitude = boxWid+boxHei;
	var linesCCW = [ [new V2D(boxTLX,boxTLY),new V2D(0,-boxHei)], [new V2D(boxTLX,boxBRY),new V2D(boxWid,0)], [new V2D(boxBRX,boxBRY),new V2D(0,boxHei)], [new V2D(boxBRX,boxTLY),new V2D(-boxWid,0)] ];

	// if there exists a single site, return the box
	if(this._sites.length==1){ // sero edges
		site = sites[0];
		len = linesCCW.length;
		prevEdge = null;
		prevVertex = null;
		firstEdge = null;
		for(i=0;i<len;++i){
			vertex = new Voronoi.Vertex(linesCCW[i][0]);
			this.addVertex(vertex);
			edge = new Voronoi.HalfEdge();
			this.addEdge(edge);
			site.addEdge(edge);
			edge.site(site);
			if(prevEdge){
				edge.vertexA(prevVertex);
				edge.prev(prevEdge);
				prevEdge.vertexB(prevVertex);
				prevEdge.next(edge);
			}else{
				firstEdge = edge;
			}
			prevEdge = edge;
			prevVertex = vertex;
		}
		firstEdge.vertexA(prevVertex);
		firstEdge.prev(prevEdge);
		prevEdge.vertexB(firstEdge.vertexA());
		prevEdge.next(firstEdge);
		return;
	}

	len = sites.length;
	for(i=0;i<len;++i){
		site = sites[i];
		center = site.point();
		edges = site.edges();
		len2 = edges.length;
		// identify infinite edges for each site
		var infiniEdges = [];
		for(j=0;j<len2;++j){
			edge = edges[j];
			A = edge.prev();
			B = edge.next();
			if(!A && !B){
				infiniEdges.push(edge); // no known orientation
			}else if(!A){
				infiniEdges.push(edge);
				if( edge.next() && (edge.next().prev()!=edge) ){ // CW => CCW
				//if( edge.next() && edge.next().prev() && edge.next().next() && (edge.next().next()==edge) ){ // CW => CCW
					edge.flipDirection();
				}
			}else if(!B){
				infiniEdges.push(edge);
				if( edge.prev() && (edge.prev().next()!=edge) ){ // CW => CCW
				//if( edge.prev() && edge.prev().prev() && edge.prev().next() && (edge.prev().prev()==edge) ){ // CW => CCW
					edge.flipDirection();
				}
			}
		}
		// fill in missing vertexes and orientation for all types of infiniedges: 1) multi-polygon, 2) from single vertex, 3) disconnected
		if(infiniEdges.length>0){
			// determine edge orientations
			for(j=0;j<infiniEdges.length;++j){
				edge = infiniEdges[j];
				a = edge.site().point();
				b = edge.opposite().site().point();
				mid = V2D.midpoint(b,a);
				ray = V2D.sub(b,a);
				V2D.rotate(ray,ray, Math.PIO2);
				ray.norm();
				ray.scale(maxMagnitude);
				// save calculations for next steps
				infiniEdges[j] = {edge:edge, org:mid, dir:ray};
			}
			// if single-vertex edges, direction is still unknown up to this point, 4 possible orientations
			a = infiniEdges[0].edge;
			b = infiniEdges.length==2?infiniEdges[1].edge:null;
			var isOnly = a && b && (a.prev()==b || a.next()==b) && (b.prev()==a || b.next()==a);
			if(isOnly){ // single vertex
				var v, s, c1, c2, orgA, orgB, dirA, dirB;
				s = site.point();
				orgA = infiniEdges[0].org;
				orgB = infiniEdges[1].org;
				dirA = infiniEdges[0].dir;
				dirB = infiniEdges[1].dir;
				//console.log("SINGLE-POINT CONNECTIONS");
				v = a.vertexA()?a.vertexA():a.vertexB();
				p = v.point();
				c = V2D.sub( s, p );

				// one has to be P->null && null->P 
				//console.log( V2D.angleDirection(dirA,dirB) );
				// cell can never be greater than Math.PI 
				if(V2D.cross(dirA,dirB)>0){
					b.vertexA(v);
					b.prev(a);
					b.vertexB(null);
					b.next(null);
					a.vertexA(null);
					a.prev(null);
					a.vertexB(v);
					a.next(b);
				}else{
					a.vertexA(v);
					a.prev(b);
					a.vertexB(null);
					a.next(null);
					b.vertexA(null);
					b.prev(null);
					b.vertexB(v);
					b.next(a);
				}
			}
if(infiniEdges.length==1){
	edge = infiniEdges[0].edge;
	dir = infiniEdges[0].dir;
	org = infiniEdges[0].org;
	dir = new V2D().copy(dir); dir.flip;
	infiniEdges.push({edge:edge, org:org, dir:dir}); // itself x2
}
			// fill in missing vertexes of known edges
			// AND do bounding cell edge addition
			//for(j=0;j<2;++j){
// console.log(infiniEdges[0].edge.vertexA());
// console.log(infiniEdges[1].edge.vertexA());
// pick edge missing next() vertex

			// do this loop twice if full infinite edges
			var willContinue = true;
			while(willContinue){
//console.log("continuing");
				willContinue = false;
				a = infiniEdges[0];
				if(a.edge.vertexB()){
					a = infiniEdges[1];
				}
				edge = a.edge;
				mid = a.org;
				ray = a.dir;
//console.log(""+edge);
				for(k=0;k<4;++k){
					org = linesCCW[k][0];
					dir = linesCCW[k][1];
					ints = Code.rayFiniteIntersect2D(mid,ray, org,dir);
					if(ints){
						vertex = new Voronoi.Vertex();
						vertex.point(ints);
						this.addVertex(vertex);
						vertex.addEdge(edge);
						edge.vertexB(vertex);
						prevEdge = edge;
						// new edge
						temp = new Voronoi.HalfEdge();
						this.addEdge(temp);
						vertex.addEdge(temp);
						site.addEdge(temp);
						temp.site(site);
						temp.vertexA( vertex );
						temp.prev(prevEdge);
						prevEdge.next(temp);
						prevEdge = temp;
						// searching for next edge:
						a = a==infiniEdges[1]?infiniEdges[0]:infiniEdges[1];
						edge = a.edge;
						mid = a.org;
						ray = new V2D().copy(a.dir);
						ray.flip();
						for(l=0;l<4;++l){ // connect with next
							org = linesCCW[(k+l)%4][0];
							dir = linesCCW[(k+l)%4][1];
							ints = Code.rayFiniteIntersect2D(mid,ray, org,dir);
							if(ints){
								vertex = new Voronoi.Vertex();
								vertex.point(ints);
								this.addVertex(vertex);
								// prev
								vertex.addEdge(prevEdge);
								prevEdge.vertexB(vertex);
								prevEdge.next(edge);
								// next
								vertex.addEdge(edge);
								edge.vertexA(vertex);
								edge.prev(prevEdge);
								// double loop
								if(!edge.vertexB()){
									willContinue = true;
								}
								k = 5; // double break
								break;
							}else{ // new edge
								vertex = new Voronoi.Vertex();
								vertex.point( linesCCW[(k+l+1)%4][0] );
								this.addVertex(vertex);
								vertex.addEdge(prevEdge);
								//
								temp = new Voronoi.HalfEdge();
								this.addEdge(temp);
								site.addEdge(temp);
								vertex.addEdge(temp);
								temp.site(site);
								//
								prevEdge.next(temp);
								prevEdge.vertexB( vertex );
								temp.prev(prevEdge);
								temp.vertexA( vertex );
								prevEdge = temp;
							}
						}
						//ray.flip(); // back
					}
				}
			}
			// disconnected edges may be CW, and each edge for site must be rechecked for consistency
		} // if
	} // sites

}
Voronoi.EdgeGraph.prototype.convexHull = function(root){
	var siteList = [];
	// go about perimeter from some start site back to itself
	// first edge: .prev()-most finite edge
	// rotate edge till .next()-most finite edge
	return siteList;
}

/*


kruskal MST - add useful edges ordered by weight 

*/












