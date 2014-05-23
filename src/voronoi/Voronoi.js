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
	this._site = null; // quick referencing
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
	console.log("flipDirection")
}
Voronoi.HalfEdge.prototype.checkOrientation = function(){
	if(this._vertexA && this._vertexB && this._site){
		var AC = V2D.sub(this._vertexA,this._site.point());
		var BC = V2D.sub(this._vertexB,this._site.point());
		if( V2D.cross(AC,BC)<0 ){
			console.log("check");
			this.flipDirection();
		}
	}
}
Voronoi.HalfEdge.prototype.toString = function(){
	var str = "[HalfEdge: "+this._id+" ";
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
Voronoi.EdgeGraph.prototype.finalize = function(root){ // cap infinite edges to box
	var i, j, k, len, sites, site, edges, edge, A, B, ang, temp, vertex, center;
	//var CA = new V2D(), CB = new V2D();
	sites = this._sites

	// find box dynamically by limits of vertexes and site + padding
console.log("finalize");
	var boxTLX = -100;
	var boxTLY = 400;
	var boxWid = 700;
	var boxHei = 500;
	var maxMagnitude = boxWid+boxHei;
	var linesCCW = [ [new V2D(boxTLX,boxTLY),new V2D(0,-boxHei)], [new V2D(boxTLX,boxTLY-boxHei),new V2D(boxWid,0)], [new V2D(boxTLX+boxWid,boxTLY-boxHei),new V2D(0,boxHei)], [new V2D(boxTLX+boxWid,boxTLY),new V2D(-boxWid,0)] ];
	
	len = sites.length;
	for(i=0;i<len;++i){
		site = sites[i];
		center = site.point();
		edges = site.edges();
		len2 = edges.length;
		// find the infinite edges for each site - should always be exactly 2
		var infiniEdges = [];
		for(j=0;j<len2;++j){
			edge = edges[j];
			A = edge.prev(); //edge.vertexA(); // prev
			B = edge.next(); //edge.vertexB(); // next
if(edge.next()){
	edge.next().checkOrientation();
}
if(edge.prev()){
	edge.prev().checkOrientation();
}
			if(!A && !B){
				infiniEdges.push(edge); // no known orientation
			}else if(!A){
				infiniEdges.push(edge);
				if( edge.next() && (edge.next().prev()!=edge) ){ // CW => CCW
				//if( edge.next() && (edge.next().next()==edge) ){ // CW => CCW
					edge.flipDirection();
				}
			}else if(!B){
				infiniEdges.push(edge);
				if( edge.prev() && (edge.prev().next()!=edge) ){ // CW => CCW
				//if( edge.prev() && (edge.prev().prev()==edge) ){ // CW => CCW
					edge.flipDirection();
				}
			}
		}
var d;
var ray = new V2D(), mid = new V2D(), ints, dir, org;
var col = Code.getColARGB(0xFF,Math.floor(Math.random()*256.0),Math.floor(Math.random()*256.0),Math.floor(Math.random()*256.0));
		// fill in missing vertexes and orientation for all types of infiniedges: 1) multi-polygon, 2) from single vertex, 3) disconnected
// if missing both: both intersections are valid (but may need to be rotated)
// if missing one vertex => only one direction is correct, 
// if missing one vertex AND previous shows no known direction => only one is correct
		if(infiniEdges.length==2){
			for(j=0;j<2;++j){
				edge = infiniEdges[j];
				a = edge.site().point();
				b = edge.opposite().site().point();
				V2D.midpoint(mid, b,a);
				V2D.sub(ray, b,a);
				V2D.rotate(ray,ray, Math.PIO2);
				ray.norm();
				ray.scale(maxMagnitude);
				// save calculations for next loop
				infiniEdges[j] = {edge:edge, org:mid, dir:ray};
				// fill in missing vertexes of known edges
var pt;
var ra = new V2D(ray.x,ray.y);
ra.norm(); ra.scale(100);
var cc = 0xFFFF0000;
if(edge.vertexA()){
	pt = edge.vertexA().point();
}else if(edge.vertexB()){
	pt = edge.vertexB().point();
	cc = 0xFF0000FF;
}
var tr = new V2D(pt.x+ra.x, pt.y+ra.y);

var AC = V2D.sub(pt,a);
var BC = V2D.sub(tr,a);
if( V2D.cross(AC,BC)<0 ){
	console.log("flip");
	dir.flip();
}
d = new DO();
d.graphics().clear();
d.graphics().setLine(2.0, cc);
d.graphics().beginPath();
d.graphics().moveTo(pt.x,pt.y);
d.graphics().lineTo(tr.x, tr.y);
d.graphics().endPath();
d.graphics().strokeLine();
root.addChild(d);
				for(k=0;k<linesCCW.length;++k){
					org = linesCCW[k][0];
					dir = linesCCW[k][1];
					//if( !edge.next() ){
					if(!edge.vertexB()){ // next
						//ray.flip();
						ints = Code.rayFiniteIntersect2D(mid,ray, org,dir);
						//ray.flip();
						if(ints){
							// before this can be replaced, it needs to be checked that it produces a 
							//
							vertex = new Voronoi.Vertex();
							vertex.point(ints);
							this.addVertex(vertex);
							vertex.addEdge(edge);
							edge.vertexB(vertex);
							edge.checkOrientation();
d = new DO();
d.graphics().clear();
d.graphics().setLine(2.0, 0xFFCC0000);
//d.graphics().setFill(0xFFCC0000);
d.graphics().setFill(col);
d.graphics().beginPath();
d.graphics().drawCircle(ints.x,ints.y-4, 15.0);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
root.addChild(d);
						}
					}
					//if( !edge.prev() ){
					if(!edge.vertexA()){ // prev
						ray.flip();
						ints = Code.rayFiniteIntersect2D(mid,ray, org,dir);
						ray.flip();
						if(ints){
							vertex = new Voronoi.Vertex();
							vertex.point(ints);
							this.addVertex(vertex);
							vertex.addEdge(edge);
							edge.vertexA(vertex);
							edge.checkOrientation();
d = new DO();
d.graphics().clear();
d.graphics().setFill(col);
d.graphics().setLine(2.0, 0xFF0000CC);
//d.graphics().setFill(0xFF0000CC);
d.graphics().beginPath();
d.graphics().drawCircle(ints.x,ints.y+4, 15.0);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
root.addChild(d);
						}
					}
				}
			}
			// orientate the disconnected edges consistently ?????????????

			// direction = point above and below point directrix
			// direction+orientation updated based on CCW rotation of line about 
		}
	}
	/*
	len = sites.length;
	for(i=0;i<len;++i){
		site = sites[i];
		center = site.point();
		edges = site.edges();
		len2 = edges.length;
		var infiniEdges = [];
		for(j=0;j<len2;++j){
			edge = edges[j];
			A = edge.vertexA(); // prev
			B = edge.vertexB(); // next
			if(!A && !B){
				// two parallel edges - need to handle specially
				console.log("trouble abrewin");
				// create start and end from intersections, and orientate CCW
				// need to connect to partner edge in different way
			}else if(!A){
				infiniEdges.push(edge);
				if( (edge.next().next()==edge) ){ // CW => CCW
					edge.flipDirection();
				}
			}else if(!B){
				infiniEdges.push(edge);
				if( (edge.prev().prev()==edge) ){ // CW => CCW
					edge.flipDirection();
				}
			}
		}
		//console.log("INFINITE EDGES: "+infiniEdges.length);
		if(infiniEdges.length==2){
			if( infiniEdges[0].next() ){ // wrong order
				infiniEdges = [infiniEdges[1],infiniEdges[0]];
			}
			var k, l, intersection, edgeOrg, edgeDir, org, dir, a, b;
			var dats = [null,null];
			len2 = infiniEdges.length;
			for(j=0;j<len2;++j){
				edge = infiniEdges[j];
				org = (edge.vertexA()?edge.vertexA():edge.vertexB()).point();
				a = edge.site().point();
				b = edge.opposite().site().point();
				dir = V2D.sub(b,a);
				dir.norm();
				V2D.rotate(dir, dir,Math.PIO2);
				a = V2D.sub(org,center);
				b = V2D.sub(V2D.add(org,dir),center);
				if( V2D.angleDirection(a,b)<0 ){ // this never happens ... consistent geometry
					console.log("flip direction");
					dir.flip();
				}
				dir.scale(dirMag);
				dats[j] = [org,dir];
			}
			edge = infiniEdges[0];
			edgeOrg = dats[0][0];
			edgeDir = dats[0][1];
			for(k=0;k<4;++k){
				org = linesCCW[k][0];
				dir = linesCCW[k][1];
				intersection = Code.rayFiniteIntersect2D(edgeOrg,edgeDir, org,dir);
				if(intersection){
console.log("int A: "+intersection);
					vertex = new Voronoi.Vertex();
					vertex.point(intersection);
					this.addVertex(vertex);
					vertex.addEdge(edge);
					edge.vertexB(vertex);
					// 
					var prevEdge = new Voronoi.HalfEdge();
					this.addEdge(prevEdge);
					prevEdge.site(site);
					vertex.addEdge(prevEdge);
					prevEdge.vertexA(vertex);
					prevEdge.prev(edge);
					edge.next(prevEdge);
					//
					edge = infiniEdges[1];
					edgeOrg = dats[1][0];
					edgeDir = dats[1][1];
					edgeDir.flip(); // intersection direction is opposite 
					for(l=0;l<4;++l){
						org = linesCCW[(k+l)%4][0];
						dir = linesCCW[(k+l)%4][1];
						intersection = Code.rayFiniteIntersect2D(edgeOrg,edgeDir, org,dir);
						if(intersection){
console.log("int B:   "+intersection);
							prevEdge.next(edge);
							edge.prev(prevEdge);
							b = new Voronoi.Vertex();
							b.point(intersection);
							prevEdge.vertexB(b);
							prevEdge.vertexB().addEdge(prevEdge);
							edge.vertexA(b);
							edge.vertexA().addEdge(edge);
							break;
						}else{ // new edge
							temp = new Voronoi.HalfEdge();
							this.addEdge(temp);
							temp.site(site);
							site.addEdge(temp);
							//
							prevEdge.next(temp);
							temp.prev(prevEdge);
							b = new Voronoi.Vertex();
							b.point( linesCCW[(k+l+1)%4][0] );
							b.addEdge(prevEdge);
							b.addEdge(temp);
							prevEdge.vertexB( b );
							temp.vertexA( b );
							prevEdge = temp;
						}
						if(l==4){
							console.log("never intersected - l");
						}
					}
					break;
				}
				if(k==4){
					console.log("never intersected - k");
				}
			}
			
		}
	}
	// orientate edges for each site CCW  +  combine/remove duplicate vertexes
	len = sites.length;
	for(i=0;i<len;++i){
		site = sites[i];
		center = site.point();
		edges = site.edges();
		len2 = edges.length;
		//console.log(len2+":::::::::::::");
		for(j=0;j<len2;++j){
			edge = edges[j];
			A = edge.vertexA();
			B = edge.vertexB();
			if(A && B){
				//console.log("   "+A.point()+"|"+B.point()+" = "+V2D.distance(A.point(),B.point()) );
				if( Voronoi.pointsEqualToEpsilon(A.point(),B.point()) ){
					console.log("DUP POINT - NO EDGE: ");
				}
				V2D.diff(CA, A.point(),center);
				V2D.diff(CB, B.point(),center);
				ang = V2D.angleDirection(CA,CB);
				if(ang<0){ // CW
					edge.flipDirection();
				}
			} // else infiniedge
		}
	}
	*/
}
/*
NEW STRATEGY:
1st loop over infinite edges / border to find all vertexes for each infinite edge
	- find vertexes
	- determine orientations (start vertex, end vertex)
2nd loop over all infinite edges and connect vertices by boundaries, filling in next,prev
	- connect (fill in missing) edges (boundary segments)
	- determine prev/next

*/

/*


kruskal MST - add useful edges ordered by weight 

*/












