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
	var T = new Voronoi.BinTree(); // status structure - binary search tree
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



/* BinTree */
Voronoi.BinTree = function(v){
	this._value = null;
	this._left = null;
	this._right = null;
	this._parent = null;
	this.value(v);
}
Voronoi.BinTree.prototype.leaf = function(){
	return this._left==null && this._right==null;
}
Voronoi.BinTree.prototype.wtf = function(){
	return this._value==null && this.leaf();
}
Voronoi.BinTree.prototype.value = function(v){
	if(v!==undefined){
		this._value = v;
	}
	return this._value;
}
Voronoi.BinTree.prototype.left = function(l){
	if(l!==undefined){
		this._left = l;
	}
	return this._left;
}
Voronoi.BinTree.prototype.right = function(r){
	if(r!==undefined){
		this._right = r;
	}
	return this._right;
}
Voronoi.BinTree.prototype.parent = function(p){
	if(p!==undefined){
		this._parent = p;
	}
	return this._parent;
}


/* Event */
Voronoi.EVENT_TYPE_SITE = 0;
Voronoi.EVENT_TYPE_CIRCLE = 1;
Voronoi.Event = function(p,t){
	this._type = null;
	this._arc = null;
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
Voronoi.Event.prototype.arc = function(a){
	if(a!==undefined){
		this._arc = a;
	}
	return this._arc;
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


/* Arc */
Voronoi.Arc = function(p){
	this._circleEvents = [];
	this._point = null;
	this.point(p);
}
Voronoi.Arc.prototype.point = function(p){
	if(p!==undefined){
		this._point = p;
	}
	return this._point;
}
Voronoi.Arc.prototype.removeCircleEventsFromQueue = function(queue){
	while(this._circleEvents.length>0){
		Code.removeElement( queue, this._circleEvents.pop() );
	}
}


/* WaveFront */
Voronoi.WaveFront = function(){
	this._tree = new Voronoi.BinTree();
	this._length = 0;
}
Voronoi.WaveFront.prototype.isEmpty = function(){
	if(this._length>0){
		return false;
	}
	return true;
}
Voronoi.WaveFront.prototype.length = function(){
	return this._length;
}
Voronoi.WaveFront.prototype.addArc = function(a){
	var prev;
	var node = this._tree;
	var value = node.value();
	while( value ){
		// find x coordinate of this intersection
			//
		// ... sub-node if necessary ...
		prev = node;
		if(gotoleft?){
			node = node.left();
		}else{
			node = node.right();
		}
		value = node?node.value():null;
	}
	++this._length;
}
Voronoi.WaveFront.prototype.addArcAbovePointAndDirectrixAndQueue = function(p,d,q){
	arc = this._FIND NODE
	arc.removeCircleEventsFromQueue(q);
	//this._T.splitArcAtPoint(arc,e.point());
}
// Voronoi.WaveFront.prototype.arcAbovePointAndDirectrix = function(p,d){
// 	// 
// }
// Voronoi.WaveFront.prototype.splitArcAtPoint = function(arc,point){
	
// }


/* EdgeList */
Voronoi.EdgeList = function(){
	this._what = null;
	
}








/*


kruskal MST - add useful edges ordered by weight 

*/













