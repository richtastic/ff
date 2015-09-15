// Poly2D.js
// 2D
Poly2D = function(){
	this._pointSets = [];
}
Poly2D.prototype.addPoint = function(point){
	if(this._pointSets.length==0){
		this._pointSets.push([]);
	}
	this._pointSets[this._pointSets.length-1].push(point);
	return this;
}
Poly2D.prototype.addContour = function(){
	this._pointSets.push([]);
	return this;
}
Poly2D.prototype.removeAllContours = function(){
	Code.emptyArray(this._pointSets);
	return this;
}
Poly2D.poly2DfromArray = function(arr){ // single array
	var poly = new Poly2D();
	poly.removeAllContours();
	var i, len=arr.length;
	for(i=0;i<len;++i){
		poly.addPoint(arr[i]);
	}
	return poly;
}
Poly2D.prototype.toString = function(){
	var i, len = this._pointSets.length;
	var str = "[Poly2D ("+len+"):";
	for(i=0;i<len;++i){
		str += " "+this._pointSets[i];
	}
	str += "]";
	return str;
}
Poly2D.prototype.contourCount = function(){
	return this._pointSets.length;
}
Poly2D.prototype.pointCount = function(){
	var i, len = this._pointSets.length;
	var count = 0;
	for(i=0;i<len;++i){
		count += this._pointSets[i].length;
	}
	return count;
}
Poly2D.prototype.edgeCount = function(){
	return this.pointCount();
}
Poly2D.prototype.boundingBox = function(){
	var i, j, l, p, arr, len = this._pointSets.length;
	var min = new V2D();
	var max = new V2D();
	var count = 0;
	for(i=0;i<len;++i){
		arr = this._pointSets[i];
		l = arr.length;
		for(j=0;j<l;++j){
			p = arr[j];
			V2D.max(max,p);
			V2D.min(min,p);
			++count;
		}
	}
	if(count>0){
		var rect = new Rect();
		rect.set(min.x,min.y, max.x-min.x, max.y-min.y);
		return rect;
	}
	return null;
}
Poly2D.prototype.add = function(c){
	if(c){
		var i, j, l, cnt, arr, len;
		cnt = c._pointSets;
		len = cnt.length;
		for(i=0;i<len;++i){
			arr = cnt[i];
			l = arr.length;
			this.addContour();
			for(j=0;j<l;++j){
				this.addPoint(arr[j]);
			}
		}
		return this;
	}
}
Poly2D.add = function(c,a,b){ // c = a + b === union
	if(b===undefined){
		b = a;
		a = c;
		c = new Poly2D();
	}
	c.removeAllContours();
	c.add(a);
	c.add(b);
}
Poly2D.copy = function(c){
	if(!c){
		return Poly2D.copy( this );
	}else{
		return Poly2D.copy( c, this);
	}
}
Poly2D.copy = function(a,b){ // a = b
	if(b===undefined){
		b = a;
		a = new Poly2D();
	}
	a.removeAllContours();
	var i, j, l, arr, len=b._pointSets.length;
	for(i=0;i<len;++i){
		arr = b._pointSets[i];
		a.addContour();
		for(j=0;j<len;++j){
			a.addPoint(arr[j]);
		}
	}
	return a;
}

// --------------------------------------------------------------------------------------------------------- EDGE
Poly2D.Edge = function(a,b){
	this._a = null;
	this._b = null;
	this.A(a);
	this.B(b);
}
Poly2D.Edge.prototype.toString = function(){
	var str = "[Edge: "+this._a+" <=> "+this._b+" ]";
	return str;
}
Poly2D.Edge.prototype.A = function(a){
	if(a!==undefined){ this._a = a; }
	return this._a;
}
Poly2D.Edge.prototype.B = function(b){
	if(b!==undefined){ this._b = b; }
	return this._b;
}

// ---------------------------------------------------------------------------------------------------------
Poly2D.SweepEvent = function(edg,pnt,ply,etp){
	this._edge = null; // actual edge object
	this._point = null; // edge's left/right point
	this._direction = Poly2D.SweepEvent.DirectionTypeUnknown; // assigned location (leftness)
	this._opposite = null; // opposite event (right/left)
	this._polygon = Poly2D.SweepEvent.PolygonTypeUnknown; // polygon identity
	this._inOut = false; // edge is in-out transition for a vertical line
	this._inside = false;
	this._edgeType = Poly2D.SweepEvent.EdgeTypeUnknown; // edge behavior
	this._isLeft = false;
	this.edge(edg);
	this.point(pnt);
	this.polygon(ply);
	this.edgeType(etp);
}
// ---------------------------------------------------------------------------------------------------------
Poly2D.SweepEvent.setInsideFlag = function(leftEndpoint,prevLeftEnd){ // left endpoint, previous left endpoint
	if(prevLeftEnd==null){ // no previous edge => not inside and not in/out?
		leftEndpoint.inside( false );
		leftEndpoint.inOut( false );
	}else if( leftEndpoint.polygon()==prevLeftEnd.polygon() ){ // same polygon => 
		leftEndpoint.inside( prevLeftEnd.inside() );
		leftEndpoint.inOut( !prevLeftEnd.inOut() );
	}else{ // prevLeftEnd is different polygon => 
		leftEndpoint.inside( !prevLeftEnd.inOut() );
		leftEndpoint.inOut( prevLeftEnd.inside() );
	}
}
// ---------------------------------------------------------------------------------------------------------
Poly2D.SweepEvent.DirectionTypeUnknown = 0;
Poly2D.SweepEvent.DirectionTypeLeft = 1;
Poly2D.SweepEvent.DirectionTypeRight = 2;
// ---------------------------------------------------------------------------------------------------------
Poly2D.SweepEvent.PolygonTypeUnknown = 0;
Poly2D.SweepEvent.PolygonTypeSubject = 1;
Poly2D.SweepEvent.PolygonTypeClipped = 2;
// ---------------------------------------------------------------------------------------------------------
Poly2D.SweepEvent.EdgeTypeUnknown = 0;
Poly2D.SweepEvent.EdgeTypeRegular = 1;
Poly2D.SweepEvent.EdgeTypeNonContributing = 2;
Poly2D.SweepEvent.EdgeTypeSameTransition = 3;
Poly2D.SweepEvent.EdgeTypeDifferentTransition = 4;
// ---------------------------------------------------------------------------------------------------------
Poly2D.SweepEvent.ResultTypeUnknown = 0;
Poly2D.SweepEvent.ResultTypeUnion = 1;
Poly2D.SweepEvent.ResultTypeIntersection = 2;
Poly2D.SweepEvent.ResultTypeDifference = 3;
Poly2D.SweepEvent.ResultTypeXOR = 3;
// ---------------------------------------------------------------------------------------------------------
Poly2D.SweepEvent.prototype.toString = function(){
	var str = "[ "+(this.isLeftEvent()?"L":"R")+" | "+this.point()+" => "+this.opposite().point()+" ]";
	return str;
}
Poly2D.SweepEvent.prototype.polygon = function(p){
	if(p!==undefined){
		this._polygon = p;
	}
	return this._polygon;
}
Poly2D.SweepEvent.prototype.edge = function(e){
	if(e!==undefined){
		this._edge = e;
	}
	return this._edge;
}
Poly2D.SweepEvent.prototype.point = function(p){
	if(p!==undefined){
		this._point = p;
	}
	return this._point;
}
Poly2D.SweepEvent.prototype.isLeftEvent = function(l){
	if(l!==undefined){
		this._isLeft = l;
	}
	return this._isLeft;
}

Poly2D.SweepEvent.prototype.opposite = function(o){
	if(o!==undefined){
		this._opposite = o;
	}
	return this._opposite;
}
Poly2D.SweepEvent.prototype.inside = function(i){
	if(i!==undefined){
		this._inside = i;
	}
	return this._inside;
}
Poly2D.SweepEvent.prototype.inOut = function(i){
	if(i!==undefined){
		this._inOut = i;
	}
	return this._inOut;
}
Poly2D.SweepEvent.prototype.polyType = function(p){
	if(p!==undefined){
		this.polyType = p;
	}
	return this.polyType;
}
Poly2D.SweepEvent.prototype.edgeType = function(e){
	if(e!==undefined){
		this._edgeType = e;
	}
	return this._edgeType;
}
// Poly2D.SweepEvent.prototype.isEdgeBelowPoint = function(point){


// HERE

// 	var area = V2D.areaTri(this.point().point(),this.opposite().point().point(), point);
// 	if(this.isLeftPoint()){
// 		return area < 0;
// 	}
// 	return area > 0;
// }
// Poly2D.SweepEvent.prototype.isEdgeAbovePoint = function(point){ // rename to aboveorequalto
// 	var area = V2D.areaTri(this.point().point(),this.opposite().point().point(), point);
// 	if(this.isLeftPoint()){
// 		return area >= 0;
// 	}
// 	return area <= 0;
// }
// Poly2D.SweepEvent.prototype.isInsideOtherPolygon = function(){
// 	return this.inside();
// }
// Poly2D.SweepEvent.prototype.setInsideOtherPolygonFlag = function(e){
// 	Poly2D.SweepEvent.setInsideFlag(this,e);
// }
// Code.PolySweepPointEvent.setInsideFlag = function(le,ple){ // left endpoint, previous left endpoint
// //console.log("setInsideOtherPolygonFlag: "+le.inside()+" / "+le.inOut()+" .. . ")
// 	if(ple==null){ // no previous edge => not inside and not in/out?
// 		le.inside( false );
// 		le.inOut( false );
// 	}else if( le.polygon()==ple.polygon() ){ // same polygon => 
// 		le.inside( ple.inside() );
// 		le.inOut( !ple.inOut() );
// 	}else{ // ple is different polygon => 
// 		le.inside( !ple.inOut() );
// 		le.inOut( ple.inside() );
// 	}
// }
Poly2D.SweepEvent.setInsideFlag = function(event,prev, sweepLine){
	if(!prev){ // no previous edge => not inside and not in/out?
		event.inside(false);
		event.inOut(false);
	}else if(prev.edgeType()!==Poly2D.SweepEvent.EdgeTypeRegular){
		console.log("IRREGULAR CASE");
		var prevPrev = sweepLine.prev(prev);
		if(!prevPrev){ // overlap
			event.inside(true);
			event.inOut(false);
		}else{ // overlapping segments
			if(event.polygon()==prev.polygon()){ // same polygon
				event.inside( !prevPrev.inOut() );
				event.inOut( !prev.inOut() );
			}else{ // different polygon
				event.inside( !prev.inOut() );
				event.inOut( !prevPrev.inOut() );
			}
		}
	}else if(event.polygon()==prev.polygon() ){ // same polygon
		event.inside( prev.inside() );
		event.inOut( !prev.inOut() );
	}else{ // different polygon
		event.inside( !prev.inside() );
		event.inOut( prev.inOut() );
	}
}


// ---------------------------------------------------------------------------------------------------------
Poly2D.PolyChain = function(){
	this._points = [];
}
Poly2D.PolyChain.prototype.toString = function(){
	var str = "[PolyChain("+this._points.length+"): ";
	for(var i=0;i< this._points.length; ++i){
		str += ""+this._points[i]+" ";
	}
	str += "]";
	return str;
}
Poly2D.PolyChain.prototype.toArray = function(){
	var i, len=this._points.length;
	var arr = new Array();
	for(i=0; i<len; ++i){
		arr[i] = this._points[i];
	}
	return arr;
}
Poly2D.PolyChain.prototype.length = function(){
	return this._points.length;
}
Poly2D.PolyChain.prototype.canAddEdge = function(pointA, pointB){
	return this._canAddElements([pointA,pointB]);
}
Poly2D.PolyChain.prototype._canAddElements = function(array){
	if( this.isComplete() ){ return false; }
	if(this._points.length>0){
		var a = this._points[0];
		var b = this._points[this._points.length-1];
		var len = array.length;
		var lm1 = len-1;
		var pointA = array[0];
		var pointB = array[lm1];
		var canAA = a.x==pointA.x && a.y==pointA.y;
		var canAB = a.x==pointB.x && a.y==pointB.y;
		var canBA = b.x==pointA.x && b.y==pointA.y;
		var canBB = b.x==pointB.x && b.y==pointB.y;
		return canAA || canAB || canBA || canBB;
	}else{
		return true;
	}
	return false;
}
Poly2D.PolyChain.prototype.addEdge = function(pointA, pointB){
	return this._addElements([pointA,pointB]);
}
Poly2D.PolyChain.prototype.addChain = function(chain){
	return this._addElements(chain._points);
}
Poly2D.PolyChain.prototype._addElements = function(array){
	if( this.isComplete() ){ return false; }
	var i, len = array.length;
	if(this._points.length>0){
		var a = this._points[0];
		var b = this._points[this._points.length-1];
		var lm1 = len-1;
		var lm2 = len-2;
		var pointA = array[0];
		var pointB = array[lm1];
		var canAA = a.x==pointA.x && a.y==pointA.y;
		var canAB = a.x==pointB.x && a.y==pointB.y;
		var canBA = b.x==pointA.x && b.y==pointA.y;
		var canBB = b.x==pointB.x && b.y==pointB.y;
		console.log(canAA , canAB , canBA , canBB);
		if(canAA && canAB && canBA && canBB){
			return false; // same points everywhere
		}
		if(canAA && canBB){ // complete @ forward
			for(i=lm2; i>=0; --i){
				this._points.push(array[i]);
			}
		}else if(canAB && canBA){ // complete @ reverse
			for(i=1; i<len; ++i){
				this._points.push(array[i]);
			}
			return true;
		}else if(canAA){
			for(i=1; i<len; ++i){
				this._points.unshift(array[i]);
			}
			return true;
		}else if(canAB){
			for(i=lm2; i>=0; --i){
				this._points.unshift(array[i]);
			}
			return true;
		}else if(canBA){
			for(i=1; i<len; ++i){
				this._points.push(array[i]);
			}
			return true;
		}else if(canBB){
			for(i=lm2; i>=0; --i){
				this._points.push(array[i]);
			}
			return true;
		}else{
			console.log("UNKNOWN SITUATION");
		}
	}else{
		for(i=0; i<len; ++i){
			this._points.push(array[i]);
		}
		return true;
	}
	return false;
}
Poly2D.PolyChain.prototype.isComplete = function(){
	if(this._points.length>1){
		var a = this._points[0];
		var b = this._points[this._points.length-1];
		if(a.x==b.x && a.y==b.y){
			return true;
		}
	}
	return false;
}
// ---------------------------------------------------------------------------------------------------------
Poly2D.PolyChainSet = function(){
	this._chains = [];
}

// ---------------------------------------------------------------------------------------------------------
Poly2D.PolySweepLine = function(){
	this._edges = new PriorityQueue();
	this._edges.sorting( Code._polygonSweepEventSort );
}
Poly2D.PolySweepLine.prototype.insert = function(event){
	return this._edges.push(event);
}
Poly2D.PolySweepLine.prototype.find = function(event){
	event = this._edges.find(event);
	return event;
}
Poly2D.PolySweepLine.prototype.next = function(event){
	event = this._edges.next(event);
	return event;
}
Poly2D.PolySweepLine.prototype.prev = function(event){
	event = this._edges.prev(event);
	return event;
}
Poly2D.PolySweepLine.prototype.erase = function(event){
	event = this._edges.removeObject(event);
	return event;
}
// Code.PolySweepLine.prototype.location = function(l){
// 	if(this._edges.length>0){
// 		return this._edges[this._edges.length-1].left();
// 	}
// 	return null;
// }

// ---------------------------------------------------------------------------------------------------------
Poly2D.processSegment = function(eventQueue, pointA,pointB, polygonType){
	if(!V2D.equal(pointA,pointB)){
		var edge = new Poly2D.Edge(pointA,pointB);
		var eventA = new Poly2D.SweepEvent( edge, pointA, polygonType);
		var eventB = new Poly2D.SweepEvent( edge, pointB, polygonType);
		eventA.opposite(eventB);
		eventB.opposite(eventA);
		if(eventA.point().x < eventB.point().x){
			eventA.isLeftEvent(true);
			eventB.isLeftEvent(false);
		}else if(eventA.point().x > eventB.point().x){
			eventA.isLeftEvent(false);
			eventB.isLeftEvent(true);
		}else if(eventA.point().y < eventB.point().y){
			eventA.isLeftEvent(true);
			eventB.isLeftEvent(false);
		}else{ // eventA.point().y > eventB.point().y
			eventA.isLeftEvent(false);
			eventB.isLeftEvent(true);
		}
		eventQueue.push(eventA);
		eventQueue.push(eventB);
	}
}
Poly2D.processPolygon = function(eventQueue, polygon, polygonType){
	var i, j, l, arr, len, cnt, pointA, pointB;
	cnt = polygon._pointSets;
	len = cnt.length;
	for(i=0;i<len;++i){
		arr = cnt[i];
		l = arr.length;
		for(j=0;j<l;++j){
			pointA = arr[j];
			pointB = arr[(j+1)%l];
			Poly2D.processSegment(eventQueue, pointA, pointB, polygonType);
		}
	}
}
Poly2D.possibleIntersection = function(eventA, eventB){
	console.log("possibleEdgeIntersection "+eventA+" "+eventB);
	if(!eventA || !eventB){
		return false;
	}
	var a = eventA.point();
	var b = eventA.opposite().point();
	var c = eventB.point();
	var d = eventB.opposite().point();
	var point = Code.lineSegIntersect2D(a,b, c,d);
	var numIntersections = 0;
	var pointA, pointB;
	// count intersections
	if(point){
		numIntersections = 1;
		if( Code.isArray(point) ){
			numIntersections = 2;
			pointA = point[0];
			pointB = point[1];
		}
	}else{
		return false;
	}
	var oppositeA = eventA.opposite();
	var oppositeB = eventB.opposite();
	// single intersection - endpoint
	if(numIntersections==1 && (V2D.equal(eventA.point(),eventB.point()) || V2D.equal(oppositeA.point(),oppositeB.point())){
		return false;
	}
	// double intersection - same polygon - error
	if(numIntersections==2 && eventA.polygonType()==eventB.polygonType()){
		return false;
	}
	//
	if(numIntersections==1){
		if( !V2D.equal(eventA.point(),point) && V2D.equal(eventA.opposite().point(),point)){
			divideSegment(eventA,point);
		}
		if( !V2D.equal(eventB.point(),point) && V2D.equal(eventB.opposite().point(),point)){
			divideSegment(eventB,point);
		}
		return true;
	}
	// numIntersections == 2
	//
	return true;
}
// ---------------------------------------------------------------------------------------------------------
Poly2D.divideSegment = function(event,point){
	if( V2D.equal(event.point(),point) || V2D.equal(event.opposite().point(),point)){  // single point is endpoint
		return false;
	}
	// ...
	return true;
}
/*
void Martinez::possibleIntersection (SweepEvent* e1, SweepEvent* e2)
...

	// The line segments overlap
	vector<SweepEvent *> sortedEvents;
	if (e1->p == e2->p) {
		sortedEvents.push_back (0);
	} else if (sec (e1, e2)) {
		sortedEvents.push_back (e2);
		sortedEvents.push_back (e1);
	} else {
		sortedEvents.push_back (e1);
		sortedEvents.push_back (e2);
	}
	if (e1->other->p == e2->other->p) {
		sortedEvents.push_back (0);
	} else if (sec (e1->other, e2->other)) {
		sortedEvents.push_back (e2->other);
		sortedEvents.push_back (e1->other);
	} else {
		sortedEvents.push_back (e1->other);
		sortedEvents.push_back (e2->other);
	}

	if (sortedEvents.size () == 2) { // are both line segments equal?
		e1->type = e1->other->type = NON_CONTRIBUTING;
		e2->type = e2->other->type = (e1->inOut == e2->inOut) ? SAME_TRANSITION : DIFFERENT_TRANSITION;
		return;
	}
	if (sortedEvents.size () == 3) { // the line segments share an endpoint
		sortedEvents[1]->type = sortedEvents[1]->other->type = NON_CONTRIBUTING;
		if (sortedEvents[0])         // is the right endpoint the shared point?
			sortedEvents[0]->other->type = (e1->inOut == e2->inOut) ? SAME_TRANSITION : DIFFERENT_TRANSITION;
		 else 								// the shared point is the left endpoint
			sortedEvents[2]->other->type = (e1->inOut == e2->inOut) ? SAME_TRANSITION : DIFFERENT_TRANSITION;
		divideSegment (sortedEvents[0] ? sortedEvents[0] : sortedEvents[2]->other, sortedEvents[1]->p);
		return;
	}
	if (sortedEvents[0] != sortedEvents[3]->other) { // no line segment includes totally the other one
		sortedEvents[1]->type = NON_CONTRIBUTING;
		sortedEvents[2]->type = (e1->inOut == e2->inOut) ? SAME_TRANSITION : DIFFERENT_TRANSITION;
		divideSegment (sortedEvents[0], sortedEvents[1]->p);
		divideSegment (sortedEvents[1], sortedEvents[2]->p);
		return;
	}
	 // one line segment includes the other one
	sortedEvents[1]->type = sortedEvents[1]->other->type = NON_CONTRIBUTING;
	divideSegment (sortedEvents[0], sortedEvents[1]->p);
	sortedEvents[3]->other->type = (e1->inOut == e2->inOut) ? SAME_TRANSITION : DIFFERENT_TRANSITION;
	divideSegment (sortedEvents[3]->other, sortedEvents[2]->p);
}
*/

// ---------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------

Poly2D.compute = function(polygonA, polygonB, operationType){ // subject = A, clipping = B
	if(!polygonA || !polygonB || !operationType){
		return null;
	}
	// empty polygon
	if(polygonA.contourCount()==0 || polygonB.contourCount()==0){
		if(operationType==Poly2D.SweepEvent.ResultTypeDifference){
			return polygonA.copy();
		}else if(operationType==Poly2D.SweepEvent.ResultTypeUnion || operationType==Poly2D.SweepEvent.ResultTypeXOR){
			return (polygonA.contourCount()==0) ? polygonB.copy() : polygonA.copy();
		}
	}
	// no box intersection
	var boundingRectA = polygonA.boundingBox();
	var minPointA = boundingRectA.min();
	var maxPointA = boundingRectA.max();
	var boundingRectB = polygonB.boundingBox();
	var minPointB = boundingRectB.min();
	var maxPointB = boundingRectB.max();
	if(minPointA.x>maxPointB.y || maxPointA.x<minPointB.x || minPointA.y>maxPointB.y || maxPointA.y<minPointB.y){
		if(operationType==Poly2D.SweepEvent.ResultTypeDifference){
			return polygonA.copy();
		}else if(operationType==Poly2D.SweepEvent.ResultTypeUnion || operationType==Poly2D.SweepEvent.ResultTypeXOR){
			return Poly2D.add(polygonA, polygonB);
		}
	}
	// add all points to event queue
	var eventQueue = new PriorityQueue();
	Poly2D.processPolygon(eventQueue, polygonA, Poly2D.SweepEvent.PolygonTypeSubject);
	Poly2D.processPolygon(eventQueue, polygonB, Poly2D.SweepEvent.PolygonTypeClipped);
	//
	var sweepLine = new Poly2D.PolySweepLine();
	var chainSet = new Poly2D.PolyChainSet();
	//
	var event, prev, next, opposite, addEdge;
	while( !eventQueue.isEmpty() ){
		event = eventQueue.minimum();
		eventQueue.popMinimum(); // eventQueue.removeObject(event); // 
		// update sweep line
		if(event.isLeftEvent()){ // add
			sweepLine.insert(event);
			prev = sweepLine.prev(event);
			next = sweepLine.next(event);
			Poly2D.SweepEvent.setInsideFlag(event, prev, sweepLine);
			Poly2D.possibleIntersection(event, next);
			Poly2D.possibleIntersection(prev, event);
		}else{ // remove
			opposite = event.opposite();
			prev = sweepLine.prev(opposite);
			next = sweepLine.next(opposite);
			addEdge = false;
			if(event.edgeType==Poly2D.SweepEvent.EdgeTypeRegular){
				if(operationType==Poly2D.SweepEvent.ResultTypeIntersection){
					if(opposite.inside()){
						addEdge = true;
					}
				}else if(operationType==Poly2D.SweepEvent.ResultTypeUnion){
					if(!opposite.inside()){
						addEdge = true;
					}
				}else if(operationType==Poly2D.SweepEvent.ResultTypeDifference){
					if( (event.polygonType()==Poly2D.SweepEvent.PolygonTypeSubject && !opposite.inside()) || (event.polygonType()==Poly2D.SweepEvent.PolygonTypeClipped && opposite.inside()) ){
						addEdge = true;
					}
				}else if(operationType==Poly2D.SweepEvent.ResultTypeXOR){
					addEdge = true;
				}
			}else if(event.edgeType==Poly2D.SweepEvent.EdgeTypeSameTransition){
				if(operationType==Poly2D.SweepEvent.ResultTypeIntersection || operationType==Poly2D.SweepEvent.ResultTypeUnion){
					addEdge = true;
				}
			}else if(event.edgeType==Poly2D.SweepEvent.EdgeTypeDifferentTransition){
				if(operationType==Poly2D.SweepEvent.ResultTypeDifference){
					addEdge = true;
				}
			}
			if(addEdge){
				chainSet.addEdge(event.edge().A(),event.edge().B());
			}
			sweepLine.erase(opposite);
			Poly2D.possibleIntersection(prev, next);
		}
	}
	
	chainSet...
}


// ---------------------------------------------------------------------------------------------------------







// ---------------------------------------------------------------------------------------------------------



// --------------------------------------------------------------------------------------- 


// --------------------------------------------------------------------------------------- 

// --------------------------------------------------------------------------------

// Code.boundingBoxFromPolygon2D = function(array){
// 	var extrema = V2D.extremaFromArray(array);
// 	return new Rect(extrema.min.x,extrema.min.y, extrema.max.x-extrema.min.x, extrema.max.y,extrema.min.y );
// }






