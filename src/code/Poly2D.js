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
Poly2D.prototype.copy = function(c){
	if(!c){
		return Poly2D.copy( this );
	}else{
		return Poly2D.copy( c, this);
	}
}
Poly2D.prototype.area = function(){
	var i, j, lm2, points;
	var a, b, c, area=0;
	var len = this._pointSets.length;
	for(i=len; i--;){
		points = this._pointSets[i];
		lm2 = points.length-2;
		for(j=0; j<lm2 ;j++){
			cross = V2D.areaTri(points[0],points[j+1],points[j+2]);
			area += cross;
		}
	}
	return area;
}
Poly2D.prototype.kill = function(){
	if(this._pointSets){
		for(i=this._pointSets.length; i--;){
			Code.emptyArray(this._pointSets[i]);
		}
		Code.emptyArray(this._pointSets);
		this._pointSets = null;
	}
	return this;
}
// --------------------------------------------------------------------------------------------------------- 
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
/*
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
*/
// ---------------------------------------------------------------------------------------------------------
Poly2D.SweepEvent = function(pnt,ply,etp){
	this._id = Poly2D.SweepEvent._id++;
	this._edge = null; // actual edge object
	this._point = null; // edge's point
	this._opposite = null; // opposite event (right/left)
	this._polygon = Poly2D.SweepEvent.PolygonTypeUnknown; // polygon identity
	this._inOut = false; // edge is in-out transition for a vertical line
	this._inside = false;
	this._edgeType = Poly2D.SweepEvent.EdgeTypeUnknown; // edge behavior
	this._isLeft = false;
	this.point(pnt);
	this.polygon(ply);
	this.edgeType(etp);
}
Poly2D.SweepEvent._id = 0;
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
Poly2D.SweepEvent.ResultTypeXOR = 4;
// ---------------------------------------------------------------------------------------------------------
Poly2D.SweepEvent.prototype.toString = function(){
	return "[SE: "+(this.isLeftEvent() ? "L" : "R")+" "+(this.polygon())+" "+(this.inside() ? "in " : "out")+" "+(this.inOut() ? "in->out" : "out->in")+" "+this.point()+"=>"+(this.opposite() ? this.opposite().point() : "X")+"]"
}
Poly2D.SweepEvent.prototype.polygon = function(p){
	if(p!==undefined){
		this._polygon = p;
	}
	return this._polygon;
}
Poly2D.SweepEvent.prototype.id = function(i){
	return this._id;
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
Poly2D.SweepEvent.prototype.edgeType = function(e){
	if(e!==undefined){
		this._edgeType = e;
	}
	return this._edgeType;
}

Poly2D.SweepEvent.isEdgeAbovePoint = function(eventA, point){ // one of the edge points assumed to be equal
	var pointA = eventA.point();
	var pointB = eventA.opposite().point();
	var area = V2D.areaTri(pointA,pointB,point);
	if( eventA.isLeftEvent() ){
		return area < 0;
	}
	return area > 0;
}
Poly2D.SweepEvent.isEdgeBelowPoint = function(eventA, point){
	return !Poly2D.SweepEvent.isEdgeAbovePoint(eventA,point);
}
Poly2D.SweepEvent.setInsideFlag = function(event,prev, sweepLine){
//	console.log("........................................ "+event.polygon() );
//	console.log("setInsideFlag A: inside:"+event.inside()+" & inOut:"+event.inOut());
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
		event.inside( !prev.inOut() );
		event.inOut( prev.inside() );
	}
//	console.log("setInsideFlag B: inside:"+event.inside()+" & inOut:"+event.inOut());
}


// ---------------------------------------------------------------------------------------------------------
Poly2D.PolyChain = function(){
	this._points = [];
}
Poly2D.PolyChain.EPSILON = undefined; // 1E-10; // undefined; //
Poly2D.PolyChain.prototype.toString = function(){
	var str = "[PolyChain("+this._points.length+"): ";
	for(var i=0;i< this._points.length; ++i){
		str += ""+this._points[i]+" ";
	}
	str += "]";
	return str;
}
Poly2D.PolyChain.prototype.toArray = function(){
	var points = this._points;
	var i, len=points.length;
	var arr = new Array();
	if(len>0 && V2D.equal(points[0],points[len-1]) ){ // if first point is same as last point, drop
		--len;
	}
	for(i=0; i<len; ++i){
		arr[i] = points[i];
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
	if(this._points.length>1){
		var a = this._points[0];
		var b = this._points[this._points.length-1];
		var len = array.length;
		var lm1 = len-1;
		var pointA = array[0];
		var pointB = array[lm1];
		// var canAA = a.x==pointA.x && a.y==pointA.y;
		// var canAB = a.x==pointB.x && a.y==pointB.y;
		// var canBA = b.x==pointA.x && b.y==pointA.y;
		// var canBB = b.x==pointB.x && b.y==pointB.y;
		var eps = Poly2D.PolyChain.EPSILON;
		var canAA = V2D.equal(a,pointA, eps);
		var canAB = V2D.equal(a,pointB, eps);
		var canBA = V2D.equal(b,pointA, eps);
		var canBB = V2D.equal(b,pointB, eps);
		return canAA || canAB || canBA || canBB;
	}
	return true;
}
Poly2D.PolyChain.prototype.addEdge = function(pointA, pointB){
	return this._addElements([pointA,pointB]);
}
Poly2D.PolyChain.prototype.addChain = function(chain){
	return this._addElements(chain._points);
}
Poly2D.PolyChain.prototype._addElements = function(array){
	// console.log("THIS");
	// console.log(this._points);
	// console.log("ADDD");
	// console.log(array)
	// console.log("...");
	if( this.isComplete() ){ return false; }
	var i, len = array.length;
	if(this._points.length>0){
		var a = this._points[0];
		var b = this._points[this._points.length-1];
		var lm1 = len-1;
		var lm2 = len-2;
		var pointA = array[0];
		var pointB = array[lm1];
		var eps = Poly2D.PolyChain.EPSILON;
		var canAA = V2D.equal(a,pointA, eps);
		var canAB = V2D.equal(a,pointB, eps);
		var canBA = V2D.equal(b,pointA, eps);
		var canBB = V2D.equal(b,pointB, eps);
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
		var eps = Poly2D.PolyChain.EPSILON;
		var endsEqual = V2D.equal(a,b, eps);
		if(endsEqual){ // if(a.x==b.x && a.y==b.y){
			return true;
		}
	}
	return false;
}
// ---------------------------------------------------------------------------------------------------------
Poly2D.PolyChainSet = function(){
	this._chainsIncomplete = [];
	this._chainsComplete = [];
}
Poly2D.PolyChainSet.prototype.isComplete = function(){
	for(var i=0; i<this._chainsComplete.length; ++i){
		if(!this._chainsComplete[i].isComplete()){
			console.log("incomplete chain "+i);
			return false;
		}
	}
	return this._chainsIncomplete.length == 0;
}
Poly2D.PolyChainSet.prototype.addEdge = function(pointA,pointB){
//console.log("ADD EGDE: "+pointA+" + "+pointB);
	var chains = this._chainsIncomplete;
	var i, len=chains.length;
	var chain, availableChains = [];
	// find any chains with available ends
	for(i=0; i<len; ++i){
		chain = chains[i];
		if( chain.canAddEdge(pointA,pointB) ){
			availableChains.push(chain);
		}
	}
	len = availableChains.length;
//console.log("avail chains: "+len);
	if(len>2){ // should never happen
		console.log("invalid chain set");
		return false;
	}else if(len==2){ // link 2 chains together
//console.log("=> link chains");
		var old = availableChains[1];
		chain = availableChains[0];
		chain.addEdge(pointA,pointB);
		Code.removeElementAtSimple(chains, old);
		chain.addChain( old );
	} else if(len==1){ // add to end of single chain
//console.log("=> end-chain");
		chain = availableChains[0];
		chain.addEdge(pointA,pointB);
	} else { // create new chain
//console.log("=> new chain");
		chain = new Poly2D.PolyChain();
		chains.push(chain);
		chain.addEdge(pointA,pointB);
	}
	if(chain.isComplete()){
		Code.removeElementSimple(chains, chain);
		this._chainsComplete.push(chain);
	}
//console.log(this.toString());
	return true;
}
Poly2D.PolyChainSet.prototype.toArray = function(){
	var arrayList = [];
	var chains, chains, i, len;
	// incomplete
	chains = this._chainsIncomplete;
	len=chains.length;
	for(i=0; i<len; ++i){
		chain = chains[i];
		arrayList.push(chain.toArray());
	}
	// complete
	chains = this._chainsComplete;
	len=chains.length;
	for(i=0; i<len; ++i){
		chain = chains[i];
		arrayList.push(chain.toArray());
	}
	return arrayList;
}
Poly2D.PolyChainSet.prototype.toString = function(){
	var i, len, str, chains;
	str = "[PolyChainSet: \n";
	chains = this._chainsComplete;
	len = chains.length;
	for(i=0;i<len;++i){
		str += "  cmp_"+i+": "+chains[i].toString() + "\n";
	}
	chains = this._chainsIncomplete;
	len = chains.length;
	for(i=0;i<len;++i){
		str += "  inc_"+i+": "+chains[i].toString() + "\n";
	}
	str += "]";
	return str;
}

// ---------------------------------------------------------------------------------------------------------
Poly2D.PolySweepLine = function(){
	this._edges = new PriorityQueue();
	this._edges.sorting( Poly2D.sweepEventLineCompareNumeric );
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
Poly2D.PolySweepLine.prototype.toArray = function(){
	return this._edges.toArray();
}
Poly2D.PolySweepLine.prototype.toString = function(){
	return this._edges.toString();
}
Poly2D.PolySweepLine.prototype.toStringLinear = function(){
	var arr = this.toArray();
	var i, len=arr.length;
	var str = "";
	for(i=0; i<len; ++i){
		str += arr[i].toString();
		str += "\n";
	}
	return str;
}

// ---------------------------------------------------------------------------------------------------------
Poly2D.processSegment = function(eventQueue, pointA,pointB, polygonType){
	if(!V2D.equal(pointA,pointB)){
		var eventA = new Poly2D.SweepEvent(pointA, polygonType, Poly2D.SweepEvent.EdgeTypeRegular);
		var eventB = new Poly2D.SweepEvent(pointB, polygonType, Poly2D.SweepEvent.EdgeTypeRegular);
		eventA.opposite(eventB);
		eventB.opposite(eventA);
		var result = Poly2D.sweepEventCompare(eventA,eventB);
		if(result<=0){
			eventA.isLeftEvent(true);
			eventB.isLeftEvent(false);
		}else{
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
Poly2D.possibleIntersection = function(eventA, eventB, sweepLine, eventQueue){
	if(!eventA || !eventB){
		return false;
	}
//	console.log("possibleEdgeIntersection "+eventA+" "+eventB);
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
		}else{
			point = new V2D(point.x,point.y);
		}
	}else{
		//console.log("no intersections");
		return false;
	}
	// console.log("numIntersections: "+numIntersections);
	// console.log(point,pointA,pointB);
	var oppositeA = eventA.opposite();
	var oppositeB = eventB.opposite();
	// single intersection - endpoint
	if( numIntersections==1 && (V2D.equal(eventA.point(),eventB.point()) || V2D.equal(oppositeA.point(),oppositeB.point()) ) ){
		//console.log("int drop A");
		return false;
	}
	// double intersection - same polygon - error
	if(numIntersections==2 && eventA.polygon()==eventB.polygon()){
		//console.log("int drop B");
		return false;
	}
	//
	// console.log(eventA);
	// console.log(eventB);
	//console.log("numIntersections: "+numIntersections);
	if(numIntersections==1){
		var any = false;
		if( !V2D.equal(eventA.point(),point) && !V2D.equal(eventA.opposite().point(),point)){
			any |= Poly2D.divideSegment(eventA,point, sweepLine,eventQueue);
		}
		if( !V2D.equal(eventB.point(),point) && !V2D.equal(eventB.opposite().point(),point)){
			any |= Poly2D.divideSegment(eventB,point, sweepLine,eventQueue);
		}
		return any;
	}
	// numIntersections == 2
	console.log("handle 2+ intersections ...");
	return true;
}
// ---------------------------------------------------------------------------------------------------------
Poly2D.divideSegment = function(event, point, sweepLine, eventQueue){
	if( V2D.equal(event.point(),point) || V2D.equal(event.opposite().point(),point)){ // single point is endpoint
		console.log("divide segment drop");
		return false;
	}
//	console.log("divide segment: "+event+" | "+point);
	if( !event.isLeftEvent() ){
		event = event.opposite();
	}
	var eventRight = new Poly2D.SweepEvent(point,event.polygon(),event.edgeType());
	var eventLeft = new Poly2D.SweepEvent(point,event.polygon(),event.edgeType());
		//eventRight.inside( event.inside() );
		eventLeft.inside( event.inside() );
		//eventRight.inOut( event.inOut() );
		eventLeft.inOut( event.inOut() );
	eventRight.isLeftEvent(false);
	eventLeft.isLeftEvent(true);
	eventRight.opposite(event);
	eventLeft.opposite(event.opposite());
	event.opposite().opposite(eventLeft);
	event.opposite(eventRight);
	eventQueue.push(eventRight);
	eventQueue.push(eventLeft);
	return true;
}
Poly2D.compareNumericToLogical = function(result){
	return result==1 ? true : false;
}
Poly2D.sweepEventCompare = function(eventA, eventB){
	return Poly2D.compareNumericToLogical( Poly2D.sweepEventCompareNumeric(eventA,eventB) );
}
Poly2D.sweepEventCompareNumeric = function(eventA, eventB){
	if(eventA==eventB){
		return 0;
	}
	if(eventA.point().x < eventB.point().x){
		return -1;
	}
	if(eventA.point().x > eventB.point().x){
		return 1;
	}
	if(eventA.point().y < eventB.point().y){
		return -1;
	}
	if(eventA.point().y > eventB.point().y){
		return 1;
	}
	if(eventA.isLeftEvent() != eventB.isLeftEvent()){ // right before left
		return eventA.isLeftEvent() ? 1 : -1;
	}
	return Poly2D.SweepEvent.isEdgeBelowPoint(eventA,eventB.opposite().point()) ? -1 : 1;
}

Poly2D.sweepEventLineCompareNumeric = function(eventA, eventB){ // segmentCompareNumeric
//	console.log("compare: "+eventA+" ? "+eventB);
	if(eventA==eventB){
//		console.log(" => 0   (Z)");
		return 0;
	}
	// shared end points -> force next point to be lower
	if( V2D.equal(eventA.opposite().point(),eventB.point()) ){
//		console.log(" => 1   (X)");
		return 1;
	}else if( V2D.equal(eventB.opposite().point(),eventA.point()) ){ // shared end points && collinearity
//		console.log(" => -1   (Y)");
		return -1;
	}

	if( V2D.equal(eventA.point(),eventB.point()) ){
		result = Poly2D.SweepEvent.isEdgeBelowPoint(eventA,eventB.opposite().point());
		if(result){
//			console.log(" => -1   (A)");
			return -1;
		}
//		console.log(" => 1   (B)");
		return 1;
	}

	var oV;
	if(eventA.point().x>eventB.point().x){ // largest starting point
		oV = eventA.point();
	}else{
		oV = eventB.point();
	}
	var dV = new V2D(0,1);
	var oA = eventA.point();
	var dA = V2D.sub(eventA.opposite().point(),eventA.point());
	var oB = eventB.point();
	var dB = V2D.sub(eventB.opposite().point(),eventB.point());
	//
	var pAV = Code.rayLineIntersect2D(oA,dA, oV,dV);
	var pBV = Code.rayLineIntersect2D(oB,dB, oV,dV);
	if(pAV==null){ // vertical
		pAV = oA;
	}
	if(pBV==null){ // vertical
		pBV = oB;
	}
	var VPA = V2D.sub(pAV,oV);
	var VPB = V2D.sub(pBV,oV);
	
	var dotA = V2D.dot(dV,VPA);
	var dotB = V2D.dot(dV,VPB);
	//console.log(pAV+" ? "+pBV+" ? "+VPA+"-+-"+VPB+"  => "+dotA+" / "+dotB);
	if(dotA<dotB){
		//console.log(" => -1   (XX)");
		return -1;
	}
	//console.log(" => -1   (YY)");
	return 1;
}

// ---------------------------------------------------------------------------------------------------------

Poly2D.compute = function(polygonA, polygonB, operationType, iteration){ // subject = A, clipping = B
var sweepArray = [];
var doneEdgeArray = [];
	iteration = iteration!==undefined ? iteration : 999;
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
		eventQueue.sorting( Poly2D.sweepEventCompareNumeric );
	Poly2D.processPolygon(eventQueue, polygonA, Poly2D.SweepEvent.PolygonTypeSubject);
	Poly2D.processPolygon(eventQueue, polygonB, Poly2D.SweepEvent.PolygonTypeClipped);
	//
	var sweepLine = new Poly2D.PolySweepLine();
	var chainSet = new Poly2D.PolyChainSet();
	//
	var event, prev, next, opposite, addEdge;
	var count = 0;
	while( !eventQueue.isEmpty() && count < iteration ){
		++count;
//		console.log("EVENT QUEUE: \n"+eventQueue.toStringLinear());
		// console.log("SWEEP LINE: \n"+sweepLine.toStringLinear());
		event = eventQueue.minimum();
		eventQueue.popMinimum(); // eventQueue.removeObject(event); // 
		// update sweep line
		if(event.isLeftEvent()){ // add
//			console.log("---------------------------------------LEFT:  "+event.point()+" -> "+event.opposite().point());
			sweepLine.insert(event);
			// console.log("INSIDED");
			// console.log("SWEEP LINE ADDED: \n"+sweepLine.toString());
			prev = sweepLine.prev(event);
			next = sweepLine.next(event);
			Poly2D.SweepEvent.setInsideFlag(event, prev, sweepLine);
			Poly2D.possibleIntersection(event, next, sweepLine, eventQueue);
			Poly2D.possibleIntersection(prev, event, sweepLine, eventQueue);
		}else{ // remove
//doneEdgeArray.push([event.point().copy(),event.opposite().point().copy()]);
//			console.log("---------------------------------------RIGHT: "+event.point()+" -> "+event.opposite().point());
			opposite = event.opposite();
			prev = sweepLine.prev(opposite);
			next = sweepLine.next(opposite);
			addEdge = false;
//console.log(event.edgeType()==opposite.edgeType())
			if(event.edgeType()==Poly2D.SweepEvent.EdgeTypeRegular){
				if(operationType==Poly2D.SweepEvent.ResultTypeIntersection){
					if(opposite.inside()){
						addEdge = true;
					}
				}else if(operationType==Poly2D.SweepEvent.ResultTypeUnion){
					if(!opposite.inside()){
						addEdge = true;
					}
				}else if(operationType==Poly2D.SweepEvent.ResultTypeDifference){
					if( (event.polygon()==Poly2D.SweepEvent.PolygonTypeSubject && !opposite.inside()) || (event.polygon()==Poly2D.SweepEvent.PolygonTypeClipped && opposite.inside()) ){
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
			}else{
				console.log("EDGE TYPE OTHER: "+event.edgeType());
			}
			if(addEdge){
doneEdgeArray.push([event.point().copy(),event.opposite().point().copy()]);
				//console.log("ADD EDGE");
				chainSet.addEdge(event.point().copy(),event.opposite().point().copy());
			}
			var erased = sweepLine.erase(opposite);
			//console.log("erased: "+erased);
			if(erased==null){
				console.log("ERASED ERROR ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,<<<<<<<<<<<<<<<<<<<<<<<<<");
//				throw "tried to remove a sweep line event that was not found"
			}
			Poly2D.possibleIntersection(prev, next, sweepLine, eventQueue);
		}
	} // end while
//	console.log("ITERATION: \n"+count);
//	console.log("EVENT QUEUE OUT: \n"+eventQueue.toStringLinear());
	//console.log("EVENT QUEUE OUT: \n"+eventQueue.toString());
//	console.log("SWEEP LINE OUT: \n"+sweepLine.toStringLinear());
	//console.log("SWEEP LINE OUT: \n"+sweepLine.toString());
// for(var j=0; j<doneEdgeArray.length; ++j){
// 	console.log(doneEdgeArray[j][0]+"=>"+doneEdgeArray[j][1])
// }
// return doneEdgeArray;

var arr = sweepLine.toArray();
//console.log(arr);
for(var j=0; j<arr.length; ++j){
	sweepArray.push([arr[j].point(),arr[j].opposite().point()]);
}
if(sweepArray.length>0){
return sweepArray;
}
	var done = chainSet.isComplete();
	// console.log("complete: "+done);
	// console.log("chainset "+chainSet.toString());
	var arr = chainSet.toArray();
	//console.log(arr);
return arr;
	var poly = new Poly2D.poly2DfromArray(arr);
	console.log(poly);
	return poly;
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






