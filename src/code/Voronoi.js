// Voronoi.js
Voronoi.EPSILON = 1E-8;


function Voronoi(){
	this._graph = new Graph();
	this._points = new Array();
}
// -----------------------------------------------------------------------------------------------
Voronoi.pointsEqualToEpsilon = function(a,b){ // TODO: USE SQUARE, NOT HYPOTENUSE
	var dist = V2D.distance(a,b);
	if(dist<Voronoi.EPSILON){
		return true;
	}
	return false;
}
Voronoi.removeDuplicatePoints2D = function(array, attachments){
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
				if(attachments){
					attachments[j] = attachments[len];
					attachments.pop();
				}
				--j;
			}
		}
	}
	return array;
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
	if(a.y<b.y){
		return -1;
	}else if(a.y>b.y){
		return 1;
	}
	return 0;
}

Voronoi.fortune = function(points, attachments){
	var i, event, point;
 	points = Code.copyArray(points);
 	if(attachments){
 		attachments = Code.copyArray(attachments);
 	}
	Voronoi.removeDuplicatePoints2D(points, attachments);
	var Q = new Voronoi.Queue();
	for(i=0; i<points.length;++i){
		point = points[i];
		event = new Voronoi.Event(point, Voronoi.EVENT_TYPE_SITE);
		event.site( new Voronoi.Site(point) );
		if(attachments){
			event.site().data(attachments[i]);
		}
		Q.addEvent(event);
	}
// try{
	var T = new Voronoi.WaveFront();
	var D = new Voronoi.EdgeGraph();
	var directrix = new V2D();
	while( !Q.isEmpty() ){
		var next = Q.next();
		directrix.copy( next.point() );
		if(next.isSiteEvent()){
			T.addArcAboveSiteAndDirectrixAndQueueAndGraph(next, directrix, Q, D);
		}else{
			T.removeArcAtCircleWithDirectrixAndQueueAndGraph(next, directrix, Q, D);
		}
	}
// }catch(x){
// 	console.log("got error ");
// 	var str = "\n";
// 	for(var i=0; i<points.length; ++i){
// 		//console.log(points[i]);
// 		var p = points[i];
// 		str += "points.push( new V2D("+p.x+","+p.y+") );\n";
// 	}
// 	str += "\n";
// 	//console.log(str);
// 	throw("yep");
// }
	return D;
}

Voronoi._siteEvent = function(Q,T,D,p){
	// Voronoi.WaveFront.prototype.addArcAbovePointAndDirectrixAndQueue = function(point,directrix,queue){
}
Voronoi._circleEvent = function(Q,T,D,gamma){
	// Voronoi.WaveFront.prototype.removeArcAtCircleWithDirectrixAndQueueAndGraph = function(circleEvent, directrix, queue, graph){
}


Voronoi.delaunay = function(points, attachments){ // TODO: insertion-based delauny good for iteritive surface definition
	var D = Voronoi.fortune(points, attachments);
	//D.removeDuplicates();
	return D.triangulate();
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
	str += this._point+"";
	if( this._type==Voronoi.EVENT_TYPE_CIRCLE){
		str += this._circle.radius+"";
	}
	str += "]";
	return str;
}

// --------------------------------------------------------------------------------------------------------------------
/* Queue */
Voronoi.Queue = function(){
	this._list = [];
}
Voronoi.equal = function(a,b){
	return Voronoi.order(a,b)==0;
}
Voronoi.order = function(a,b){
	if(a==b){
		return 0;
	}else{
		return a<b ? -1 : 1;
	}

	var epsilon = Voronoi.EPSILON;
	var diff = Math.abs(a-b);
	if(diff<=epsilon){
		return 0;
	}
	return a<b ? -1 : 1;
}
Voronoi.Queue.sortPointY = function(a,b){ // since added after all site events, circle events are always first ---- larger y > end, smaller x > end
	var pointA = a.point();
	var pointB = b.point();

	var sortY = Voronoi.order(pointA.y,pointB.y);
	var sortX = Voronoi.order(pointA.x,pointB.x);
//	console.log(a.type()+" | "+b.type()+" @ "+sortY+" - "+sortX);
	if(a.type()==Voronoi.EVENT_TYPE_CIRCLE && b.type()==Voronoi.EVENT_TYPE_SITE){
		if(sortY==0){
			return 1; // circle always
		}else if(sortY==-1){
			return -1; // site to end
		} // else sortY==1
		return 1; // circle to end
	}else if(a.type()==Voronoi.EVENT_TYPE_SITE && b.type()==Voronoi.EVENT_TYPE_CIRCLE){
		if(sortY==0){
			return -1; // circle always
		}else if(sortY==-1){
			return -1; // circle to end
		} // else sortY==1
		return 1; // site to end
	} // same types
	if(sortY==0){
		if(sortX==0){
			return 0;
		}else if(sortX==-1){
			return -1;
		} // else sortX==1
		return 1;
	}else if(sortY==-1){
		return -1;
	} // else sortY==1
	return 1;
	
/*
	if(pointA.y == pointB.y){
		if(pointA.x == pointB.x){
			if(a.type()==Voronoi.EVENT_TYPE_CIRCLE && b.type()==Voronoi.EVENT_TYPE_SITE){
				return 1;
			}else if(a.type()==Voronoi.EVENT_TYPE_SITE && b.type()==Voronoi.EVENT_TYPE_CIRCLE){
				return -1;
			}
			return 0;
		}
		return pointA.x < pointB.x ? -1 : 1; // ???
	}
	return pointA.y < pointB.y ? -1 : 1;
	*/
}
Voronoi.Queue.prototype.addEvent = function(e){
	Code.addUnique(this._list,e);
	this._list = this._list.sort( Voronoi.Queue.sortPointY );
}
Voronoi.Queue.prototype.removeEvent = function(e){
	Code.removeElement(this._list,e);
}
Voronoi.Queue.prototype.removeCircleEventWithArcAndTree = function(arc,tree){
	var i, e, center, left, right;
	for(i=0; i<this._list.length; ++i){
		e = this._list[i];
		if(e.isCircleEvent()){
			if(e.containsArc(arc)){
				center = e.center();
				center.removeCircleEvent(e);
				// if(center.circleEvent()==e){
				// 	center.circleEvent(null);
				// }
				center = center.node();
				left = tree.prevNode(center);
				left = left.data();
				left.removeCircleEvent(e);
				// if(left.circleEvent()==e){
				// 	left.circleEvent(null);
				// }
				right = tree.prevNode(center);
				right = right.data();
				// if(right.circleEvent()==e){
				// 	right.circleEvent(null);
				// }
				right.removeCircleEvent(e);
				Code.removeElementAt(this._list,i);
				e.kill();
				--i;
			}
		}
	}
}
Voronoi.Queue.prototype.isEmpty = function(){
	//console.log(this._list.length)
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
	var i, str = "[Queue: | ";
	for(i=0;i<this._list.length;++i){
		str += this._list[i]+" | ";
	}
	str += "]";
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
	this._circleEvents = [];
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
	Code.copyArray(a.circleEvents());
	//this.circleEvent(a.circleEvent());
	//var circ = a.circleEvent(); // necessary? - this is later deleted when new circle-events are serached for
	// this.circleEvent( circ );
	// if(circ){
	// 	if(circle.center()==a){
	// 		circle.center(this);
	// 	}
	// }
}
Voronoi.Arc.prototype.copy = function(a){ // identical
	this.physicalCopy(a);
}
// -------------------------------------------------------------------------------------------------------------------- class
Voronoi.Arc.isArcToLeftOfArc = function(a,b){
	// console.log("isArcToLeftOfArc");
	// console.log(a,b);
	var avgA = a.intersectionAverage();
	var avgB = b.intersectionAverage();
	// if(avgA==null || avgB==null){ // no intersections
	// 	return a.center().point().x < b.center().point().x;
	// }
	if(avgA==null && avgB==null){ // no intersections
		return a.center().point().x < b.center().point().x;
	}else if(avgA==null && avgB!=null){ // a intersection
		return avgA < b.center().point().x;
	}else if(avgA!=null && avgB==null){ // b intersection
		return a.center().point().x < avgB;
	}
	return avgA < avgB;
	
}
Voronoi.Arc.splitArcAtSite = function(arc,site, tree){
	if(arc.containsPointBoolean(site.point())){
		// console.log("SPLIT: "+arc+"    @   "+site.point());
		var i = arc.intersections();
		//console.log(i+" = "+i.length);
		var l = i[0];
		var r = i[1];
		var dropLeft = false;
		var dropRight = false;
		var arcL, arcC, arcR;
		if(site.point().y==arc.center().point().y){
			if(site.point().x<arc.center().point().x){
				//console.log("LEFT");
				arcL = new Voronoi.Arc(arc.left(),arc.leftDirection(), site, arc.center(),Voronoi.ARC_PARABOLA_INT_LEFT, arc.directrix());
				arcL.edgeLeft(arc.edgeLeft());
				arcL.edgeRight(null);
				arcR = new Voronoi.Arc(site,Voronoi.ARC_PARABOLA_INT_RIGHT, arc.center(), arc.right(),arc.rightDirection(), arc.directrix());
				arcR.edgeLeft(null);
				arcR.edgeRight(arc.edgeRight());
			}else{ //
				//console.log("RIGHT");
				arcL = new Voronoi.Arc(arc.left(),arc.leftDirection(), arc.center(), site,Voronoi.ARC_PARABOLA_INT_LEFT, arc.directrix());
				arcL.edgeLeft(arc.edgeLeft());
				arcL.edgeRight(null);
				arcR = new Voronoi.Arc(arc.center(),Voronoi.ARC_PARABOLA_INT_RIGHT, site, arc.right(),arc.rightDirection(), arc.directrix());
				arcR.edgeLeft(null);
				arcR.edgeRight(arc.edgeRight());
			}
			// console.log(" => "+arcL+" , "+arcR);
			return [arcL,arcR];
		}

//there's a circle event right by a site event, and the intersected arc is off by epsilon


// Voronoi.js:388 <213.3772233983162,126.75444679663246>,<235,125> = 2
// Voronoi.js:421 IS CLOSENESS RIGHT: <235,115> | <235,125>
		// parL,dirL, parC, parR,dirR, dirX){
			//console.log(".       ARC: "+arc);
		if( l && Math.abs(l.x-site.point().x) < 1E-10 ){
			// console.log("IS CLOSENESS LEFT: "+site.point()+" | "+l);
			dropLeft = true;
		}
		if( r && Math.abs(r.x-site.point().x) < 1E-10 ){
			// console.log("IS CLOSENESS RIGHT: "+site.point()+" | "+r);
			dropRight = true;
		}
		if(dropLeft || dropRight){
			// console.log(".   arcL: "+tree.prevNode(arc.node()).data());
			// console.log(".   arcC: "+arc);
			// console.log(".   arcR: "+tree.nextNode(arc.node()).data());
			// find dieing arc
			var skip = false;
			var epsilon = 1E-10;
			var width = arc.width();
			// console.log("width:  "+width);
			if(width>=0 && width<=epsilon){
				// console.log("SKIP A");
				skip = true;
			}
			var l = tree.prevNode(arc.node())
			if(l){
				l = l.data();
				var width = l.width();
				// console.log("width:  "+width);
				if(width>=0 && width<=epsilon){
					// console.log("SKIP B");
					// arc = l;
					// dropLeft = true;
					// dropRight = false;
					skip = true;
				}
			}
			var r = tree.nextNode(arc.node())
			if(r){
				r = r.data();
				var width = r.width();
				// console.log("width:  "+width);
				if(width>=0 && width<=epsilon){
					//console.log("SKIP C");
					// arc = r;
					// dropLeft = true;
					// dropRight = false;
					skip = true;
				}
			}
			if(skip){
				throw "skip should never happen because circles are before sites";
				//console.log( "skip should never happen because circles are before sites" );
				return [];
			}
			//return [];
			// NOT SURE WHAT TO DO ????
			if(!skip){
				if(dropLeft){
					arcR = arc;
					node = tree.prevNode(arc.node());
					arcL = node.data();
				}
				if(dropRight){
					arcL = arc;
					node = tree.nextNode(arc.node());
					arcR = node.data();
				}
				var ints = Code.intersectionParabolas(arcL.center().point(),arc.directrix().y, arcR.center().point(),arc.directrix().y);
				var inter = ints[0]; // assuming 1
					// TODO: multiple intersection return one closest to vertex x
				arcC = new Voronoi.Arc(arcL.center(),Voronoi.ARC_PARABOLA_INT_LEFT, site, arcR.center(),Voronoi.ARC_PARABOLA_INT_RIGHT, arc.directrix());
				arcC.edgeLeft(null); // to be added
				arcC.edgeRight(null); // to be added
				arcL.right(arcC.center());
				arcL.rightDirection(Voronoi.ARC_PARABOLA_INT_LEFT);
				arcR.left(arcC.center());
				arcR.leftDirection(Voronoi.ARC_PARABOLA_INT_RIGHT);
				return [arcL,arcC,arcR,inter];
			}
		}
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
	if(!intersections){
		throw "NO intersections";
	}
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
Voronoi.Arc.prototype.circleEvents = function(){
	return this._circleEvents;
}
Voronoi.Arc.prototype.hasCircleEvent = function(c){
	return Code.elementExists(this._circleEvents,c);
}
Voronoi.Arc.prototype.addCircleEvent = function(c){
	if(c!==undefined){
		if(Code.addUnique(this._circleEvents,c)){
			return true;
		}
	}
	return false;
}
Voronoi.Arc.prototype.removeCircleEvent = function(c){
	if(c!==undefined){
		if(Code.removeElement(this._circleEvents,c)){
			return true;
		}
	}
	return false;
}
Voronoi.Arc.prototype.removeAllCircleEvents = function(queue){
	if(queue){
		var circles = this.circleEvents();
		for(var i=0; i<circles.length; ++i){
			//console.log("REMOVE EVENT: "+i+": "+circles[i]);
			queue.removeEvent( circles[i] );
		}
	}
	Code.emptyArray(this._circleEvents);
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
Voronoi.Arc.prototype.width = function(){
	var ints = this.intersections();
	if(ints.length==2 && ints[0] && ints[1]){
		var width = Math.abs(ints[0].x-ints[1].x);
		return width;
	}
	return -1;
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
	str += ""+this._circleEvents;
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
		if(this._parabolaLeft.point().y==this._parabolaCenter.point().y){
			return new V2D((this._parabolaLeft.point().x+this._parabolaCenter.point().x)*0.5,this._directrix.y);
		}
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
		if(this._parabolaRight.point().y==this._parabolaCenter.point().y){
			return new V2D((this._parabolaRight.point().x+this._parabolaCenter.point().x)*0.5,this._directrix.y);
		}
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
		var contains = a.containsPoint(b);
		// console.log("ARC CONTAINS:   "+a+"  ?  "+b+" ?? "+contains);
		return contains;
	}else if( Code.isa(a,V2D) ){ // arc and point - search
		var contains = b.containsPoint(a);
		// console.log("ARC CONTAINS:   "+b+"  ?  "+a+" ?? "+contains);
		return contains;
	}else{ // two arcs - insert
		if(a==b){ // this only happens at arc search
			return 0;
		}
		if( Voronoi.Arc.isArcToLeftOfArc(a,b) ){
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
	//console.log("addArcAboveSiteAndDirectrixAndQueueAndGraph: "+siteEvent);
	var arc, node, list, i, left, center, right, edge, point, site;
	point = siteEvent.point();
	site = siteEvent.site();
	if(this.isEmpty()){
		// wavefront
		arc = new Voronoi.Arc(null,Voronoi.ARC_PARABOLA_INT_UNKNOWN, site, null,Voronoi.ARC_PARABOLA_INT_UNKNOWN, directrix);
		node = this._tree.newEmptyNode(arc);
		arc.node(node);
		this._tree.insertNode(node);
		// graph
		graph.addSite(arc.center());
	}else{ // find arc to split
		node = this._tree.findObject( site.point() );
		// console.log(".         SITE: "+site);
		// console.log("FIND FOR SITE: "+site.point());
		arc = node.data();
		// remove false-alarm circle events
		arc.removeAllCircleEvents(queue);
		// get list of new arc set
		list = Voronoi.Arc.splitArcAtSite(arc,site, this._tree);
		if(list.length==2){ // parallel parabolas -- first sequence only
			//console.log("parallel 1");
			var left = list[0];
			var right = list[1];
			arc.physicalCopy(left);
			left.kill();
			left = arc;
			node = this._tree.newEmptyNode(right);
			this._tree.insertNode(node);
			right.node(node);
			graph.addSite(left.center());
			graph.addSite(right.center());
			// new
			edge = Voronoi.HalfEdge.newTwins();
				graph.addEdge(edge);
				graph.addEdge(edge.opposite());
			left.center().addEdge(edge);
				edge.site(left.center());
			right.center().addEdge(edge.opposite());
				edge.opposite().site(right.center());
			// SET NEW
			right.edgeLeft(edge.opposite());
			left.edgeRight(edge);
		}else{
			if(list.length==4){
				//console.log("parallel 2");
				var twoEdges = list.pop();
				var left = list[0];
				var center = list[1];
				var right = list[2];
				left.removeAllCircleEvents(queue);
				right.removeAllCircleEvents(queue);
				// add single new arc
				node = this._tree.newEmptyNode(center);
				this._tree.insertNode(node);
				center.node(node);
				graph.addSite(center.center());
				// vertex
				var vertex = new Voronoi.Vertex(twoEdges);
				// terminals
				graph.addVertex(vertex);
				vertex.addEdge(left.edgeRight()); // are opposites of eachother
				vertex.addEdge(right.edgeLeft()); // console.log(left.edgeRight().opposite() == right.edgeLeft()); // should be true
				// add vertex+edges to closing cell
				var prevLeftEdgeRight = left.edgeRight();
				var prevRightEdgeLeft = right.edgeLeft();

				// new edges
				var edgeL = Voronoi.HalfEdge.newTwins();
				var edgeR = Voronoi.HalfEdge.newTwins();
				graph.addEdge(edgeL);
				graph.addEdge(edgeL.opposite());
				graph.addEdge(edgeR);
				graph.addEdge(edgeR.opposite());
				//
				left.center().addEdge(edgeL);
				center.center().addEdge(edgeL.opposite());
				center.center().addEdge(edgeR.opposite());
				right.center().addEdge(edgeR);
				//
				edgeL.site(left.center());
				edgeL.opposite().site(center.center());
				edgeR.site(right.center());
				edgeR.opposite().site(center.center());
				// new update
				left.edgeRight(edgeL);
				center.edgeLeft(edgeL.opposite());
				center.edgeRight(edgeR.opposite());
				right.edgeLeft(edgeR);
				// news
				vertex.addEdge(edgeL);
				vertex.addEdge(edgeL.opposite());
				vertex.addEdge(edgeR);
				vertex.addEdge(edgeR.opposite());
				// add vertex+edges to opening cell
				prevLeftEdgeRight.vertexAndEdgeAdd(vertex, edgeL);
				prevRightEdgeLeft.vertexAndEdgeAdd(vertex, edgeR);
				edgeL.vertexAndEdgeAdd(vertex, prevLeftEdgeRight);
				edgeL.opposite().vertexAndEdgeAdd(vertex, edgeR);
				edgeR.vertexAndEdgeAdd(vertex, prevRightEdgeLeft);
				edgeR.opposite().vertexAndEdgeAdd(vertex, edgeL);

			}else if(list.length==3){ // single new edge
				//var prevLeftEdgeRight = arc.edgeRight();
				//console.log("parallel 3");
				var left = list[0];
				var center = list[1];
				var right = list[2];
				// copy over new left arc
				arc.physicalCopy(left);
				left.kill(); // - never used, replace
				left = arc;
				// only add 2 new arcs
				for(i=1;i<list.length;++i){
					arc = list[i];
					node = this._tree.newEmptyNode(arc);
					this._tree.insertNode(node);
					arc.node(node);
				}
				// graph
				graph.addSite(left.center());
				graph.addSite(center.center());
				graph.addSite(right.center());
				// left interface
				edge = Voronoi.HalfEdge.newTwins();
				graph.addEdge(edge);
				graph.addEdge(edge.opposite());
				center.center().addEdge(edge);
				left.center().addEdge(edge.opposite()); // left + right
				// add sites to edges
				edge.site(center.center()); // center
				edge.opposite().site(left.center()); // left + right
				// edgeLeft already copied over
				left.edgeRight(edge.opposite());
				center.edgeLeft(edge);
				center.edgeRight(edge);
				// right
				right.edgeLeft(edge.opposite());
				// edgeRight stays
			}
			if(center){
				// left triplets of points
				this.checkAddCircleWithRight(center,directrix,queue);
		 		// right triplets of points
		 		this.checkAddCircleWithLeft(center,directrix,queue);
		 	}
	 	}
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
	center.removeAllCircleEvents(queue);
	// queue.removeEvent( center.circleEvent() );
	// center.circleEvent(null);
	// console.log("circleFromPoints: "+left.center().point(),center.center().point(),right.center().point());
	var circle = Code.circleFromPoints(left.center().point(),center.center().point(),right.center().point());
	if(!circle){  return; } // not colinear
	// convergence = CW around 
	var AB = V2D.sub(left.center().point(), center.center().point());
	var CB = V2D.sub(right.center().point(), center.center().point());
	var isConvergence = V2D.cross(AB,CB)>=0;
	//console.log("CIRCLE FROM POINTS: "+left.center().point()+" "+center.center().point()+" "+right.center().point()+"  =  "+circle+" | "+isConvergence);
	if(!isConvergence){
		return;
	}
	// queue point
	var point = new V2D(circle.center.x,circle.center.y-circle.radius);
	 // find node to attach to by point search
	var arc = this._tree.findNodeFromObject(circle.center);
	if(!arc){ console.log("FIND NODE FROM CIRCLE: "+circle.center); return; } // TODO: WHY IS ARC NULL?
	arc = arc.data();
	var aboveCenter = Code.isPointAboveParabola(arc.center().point(),directrix.y, circle.center);
	if(!aboveCenter && point.y<=directrix.y){
		var circleEvent = new Voronoi.Event(point,Voronoi.EVENT_TYPE_CIRCLE);
		circleEvent.circle(circle);
		circleEvent.center(center);
		// set merge circle event to disappearing arc
		center.addCircleEvent(circleEvent);
		queue.addEvent(circleEvent);
	} // else point is in past
}
Voronoi.WaveFront.prototype.removeArcAtCircleWithDirectrixAndQueueAndGraph = function(circleEvent, directrix, queue, graph){
	//console.log("removeArcAtCircleWithDirectrixAndQueueAndGraph "+circleEvent+"  @  "+directrix);
//console.log("BEFORE MERGE:        -------------------- ------------------------------- "+circleEvent+" | "+directrix);
	var left, center, right, node;
	center = circleEvent.center();
	node = center.node();
	left = this._tree.prevNode( node ).data();
	right = this._tree.nextNode( node ).data();
	// delete all circleEvents involving middle arc
	queue.removeCircleEventWithArcAndTree( center, this._tree );
	// calculate new arcs
	var pt = circleEvent.circle().center;
	this.mergeArcs(left,center,right, queue,graph, pt);
	// left triplets of points
	this.checkAddCircleWithRight(right,directrix,queue,circleEvent);
	// right triplets of points
	this.checkAddCircleWithLeft(left,directrix,queue,circleEvent);
	// done with event
	circleEvent.kill();
}
Voronoi.WaveFront.prototype.mergeArcs = function(left,center,right, queue,graph, pt){
	var i, list, left, center, right, node, vertex;
	node = center.node();
	list = Voronoi.Arc.mergeArcs(left,center,right);
	// only delete middle node
	this._tree.deleteNode(node);
	center.kill();
	// if RedBlackTree isn't consistent with deletion:
	if(node.data()){
		node.data().node(node);
	}
	// copy left and right
	left.physicalCopy(list[0]);
	if(list.length==2){
		right.physicalCopy(list[1]);
	}else{ // unification of arc - delete both - can this ever happen ?
		console.log("has this ever been tested ?");
		// var nr = center.node();
		// this._tree.deleteNode(nr);
	}
	// add vertex at circle center to graph
	var e, o, d;
	vertex = new Voronoi.Vertex(pt);
	graph.addVertex(vertex);
	var l = left.edgeRight();
	var r = right.edgeLeft();
	if(!l || !r){
		throw "merge is broked: "+l+" | "+r;
	}
	// add old edges to vertex
	vertex.addEdge(l);
	vertex.addEdge(l.opposite());
	vertex.addEdge(r);
	vertex.addEdge(r.opposite());
	// add vertex+edges to closing cell
	l.opposite().vertexAndEdgeAdd(vertex, r.opposite());
	r.opposite().vertexAndEdgeAdd(vertex, l.opposite());
	// new edge from vertex
	var edge = Voronoi.HalfEdge.newTwins();
	// add edge to graph
	graph.addEdge(edge);
	graph.addEdge(edge.opposite());
	// add edge to vertex
	vertex.addEdge(edge);
	vertex.addEdge(edge.opposite());
	// add vertex+edges to left cell
	l.vertexAndEdgeAdd(vertex, edge.opposite());
	edge.opposite().vertexAndEdgeAdd(vertex, l);
	// add vertex+edges to right cell
	r.vertexAndEdgeAdd(vertex, edge);
	edge.vertexAndEdgeAdd(vertex, r);
	// add new edge to sites
	edge.opposite().site( left.center() );
	edge.site( right.center() );
	// add edge to sites
	left.center().addEdge(edge.opposite());
	right.center().addEdge(edge);
	// update arc edges to new edge+opposite
	left.edgeRight(edge.opposite());
	right.edgeLeft(edge);

}
Voronoi.WaveFront.prototype.toString = function(){
	return "WAVEFRONT:\n"+this._tree.toString();
}

// --------------------------------------------------------------------------------------------------------------------
// Site (Fortune) 
Voronoi.Site = function(p,d){
	this._point = new V2D();
	this._edges = [];
	this._data = null;
	this.point(p);
	this.data(d);
	this._index = null;
}
Voronoi.Site.prototype.index = function(i){
	if(i!==undefined){
		this._index = i;
	}
	return this._index;
}
Voronoi.Site.prototype.point = function(p){
	if(p!==undefined){
		this._point.copy(p);
	}
	return this._point;
}
Voronoi.Site.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
Voronoi.Site.prototype.addEdge = function(e){
	this._edges.push(e);
}
Voronoi.Site.prototype.removeEdge = function(e){
	Code.removeElementSimple(this._edges, e);
}
Voronoi.Site.prototype.edges = function(){
	return this._edges;
}
Voronoi.Site.prototype.adjacentSites = function(){
	var edges = this.edges();
	var i, edge, oppo, site, sites = [];
	for(i=0; i<edges.length; ++i){
		edge = edges[i];
		oppo = edge.opposite();
		site = oppo.site();
		Code.addUnique(sites,site);
	}
	return sites;
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
		// console.log(this._vertexA);
		// console.log(this._vertexB);
		// console.log(this._vertexA+"");
		// console.log(this._vertexB+"");
		//this.checkOrientation();
		// console.log("EQUAL VERTEXES: "+this._vertexA.point()+" && "+this._vertexB.point());
		// console.log("    => : "+this.opposite()+". ");
		console.log( "BOTH VERTEXES ALREADY ASSIGNED" );
		//throw "BOTH VERTEXES ALREADY ASSIGNED";
	} // if I know the site, I can calculate CCW and correct my direction if necessary
	if(this._vertexA && this._vertexB && V2D.equal(this._vertexA.point(),this._vertexB.point())){
		// console.log("EQUAL VERTEXES: "+this._vertexA.point()+" && "+this._vertexB.point());
		// console.log("    => : "+this.opposite()+". ");
	}
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
Voronoi.HalfEdge.prototype.isZero = function(){
	if(this._vertexA && this._vertexB && V2D.equal(this._vertexA.point(),this._vertexB.point())){
		return true;
	}
	return false;
}
Voronoi.HalfEdge.prototype.next = function(n){
	if(n!==undefined && n!==true){
		this._next = n;
	}
	if(n===true){
		var t = this._next;
		if(t && t.isZero()){
			var n = t.next();
			var p = t.prev();
			if(n==this){
				return p;
			}
			return n;
		}
	}
	return this._next;
}
Voronoi.HalfEdge.prototype.prev = function(p){
	if(p!==undefined){
		this._prev = p;
	}
	if(n===true){
		var t = this._prev;
		if(t && t.isZero()){
			var n = t.next();
			var p = t.prev();
			if(n==this){
				return p;
			}
			return n;
		}
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
Voronoi.HalfEdge.prototype.fixZeroOrientation = function(){
	if(this.isZero()){
		var n, p, t;
		t = this._next;
		if(t){
			n = t.next();
			p = t.prev();
			if(n==this){
				// inconsistent
				consistent.log("inconsistent");
			}else if(p==this){
				// consistent
			}
		}else{ // no next
			t = this._prev;
			if(t){
				n = t.next();
				p = t.prev();
				if(p==this){
					// inconsistent
					consistent.log("inconsistent");
				}else if(n==this){
					// consistent
				}
			}
		}
		//var p = this._p;
	}
}
Voronoi.HalfEdge.prototype.checkOrientation = function(){
	if(this._vertexA && this._vertexB && this._site){
		if(this._vertexA && this._vertexB && V2D.equal(this._vertexA.point(), this._vertexB.point()) ){
			// can remove self ...
		}
		var AC = V2D.sub(this._vertexA.point(),this._site.point());
		var BC = V2D.sub(this._vertexB.point(),this._site.point());
		if( V2D.cross(AC,BC)<0 ){
			this.flipDirection();
		}
	}
}
Voronoi.HalfEdge.prototype.kill = function(){
	this._vertexA = null;
	this._vertexB = null;
	this._opposite = null;
	this._next = null;
	this._prev = null;
	this._site = null;
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
Voronoi.Vertex.prototype.edges = function(){
	return this._edges;
}
Voronoi.Vertex.prototype.addEdge = function(e){
	this._edges.push(e);
}
Voronoi.Vertex.prototype.removeEdge = function(e){
	Code.removeElementSimple(this._edges, e);
}
Voronoi.Vertex.prototype.kill = function(){
	Code.emptyArray(this._edges);
	this._edges = null;
	this._point = null;
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
Voronoi.EdgeGraph.prototype.removeEdge = function(e){
	Code.removeElementSimple(this._edges, e);
}
Voronoi.EdgeGraph.prototype.addVertex = function(v){
	this._vertexes.push(v);
}
Voronoi.EdgeGraph.prototype.removeVertex = function(v){
	Code.removeElementSimple(this._vertexes,v);
}
Voronoi.EdgeGraph.prototype.addSite = function(s){ // parabolas
	Code.addUnique(this._sites, s);
	//this._sites.push(s);
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
	}
	return str;
}
Voronoi.EdgeGraph.prototype.removeDuplicates = function(){ // remove edges with same endpoints
	//console.log("removeDuplicates ...");
}
Voronoi.EdgeGraph.prototype.removeDuplicatesX = function(){ // remove vertices with same point
	//console.log("removeDuplicates ...");
	var i, len, j, sites, site, edges, edge, oppo, prev, next, temp, A, B, PA, PB, NA, NB;
	sites = this._sites;
	len = sites.length;
	for(i=0;i<len;++i){
		site = sites[i];
		edges = site.edges();
		//console.log("edges: "+edges.length);
		for(j=0;j<edges.length;++j){
			edge = edges[j];
			A = edge.vertexA();
			B = edge.vertexB();
			if( A && B && Voronoi.pointsEqualToEpsilon(A.point(),B.point()) ){
				oppo = edge.opposite();
				// edgeside
				prev = edge.prev();
				next = edge.next();
//console.log("STA A: "+A.edges().length);
				if(prev.next()==edge){
					prev.next(next);
					if(prev.vertexB()==A){ prev.vertexB(B); A.removeEdge(prev); B.addEdge(prev); }
				}else if(prev.prev()==edge){
					prev.prev(next);
					if(prev.vertexA()==A){ prev.vertexA(B); A.removeEdge(prev);  B.addEdge(prev); }
				}
				if(next.next()==edge){
					next.next(prev);
					if(next.vertexB()==A){ next.vertexB(B); A.removeEdge(next); B.addEdge(next); }
				}else if(next.prev()==edge){
					next.prev(prev);
					if(next.vertexA()==A){ next.vertexA(B); A.removeEdge(next); B.addEdge(next); }
				}
//console.log("S1- A: "+A.edges().length);
				PA = prev; NA = next;
				// opposite
				prev = oppo.prev();
				next = oppo.next();
				if(prev.next()==oppo){
					prev.next(next);
					if(prev.vertexB()==A){ prev.vertexB(B); A.removeEdge(prev); B.addEdge(prev); }
				}else if(prev.prev()==oppo){
					prev.prev(next);
					if(prev.vertexA()==A){ prev.vertexA(B); A.removeEdge(prev);  B.addEdge(prev); }
				}
				if(next.next()==oppo){
					next.next(prev);
					if(next.vertexB()==A){ next.vertexB(B); A.removeEdge(next); B.addEdge(next); }
				}else if(next.prev()==oppo){
					next.prev(prev);
					if(next.vertexA()==A){ next.vertexA(B); A.removeEdge(next); B.addEdge(next); }
				}
// console.log("S2- A: "+A.edges().length);
				// 
				PB = prev; NB = next;
				// ARE THE OPPOSITES STILL VALID?
				A.removeEdge(edge);
				A.removeEdge(oppo);
// console.log("NEW A: "+A.edges().length);
var remA = A.edges()[0];
var remB = A.edges()[1];
				// console.log( remA+"" );
				// console.log( remB+"" );
				// remove from history
				// console.log("STA B: "+B.edges().length);
				// edge
				// 
				B.removeEdge(edge);
				this.removeEdge(edge);
				edge.site().removeEdge(edge);
				edge.kill();
				// oppo
				// 
				B.removeEdge(oppo);
				this.removeEdge(oppo);
				oppo.site().removeEdge(oppo);
				oppo.kill();
				// A

				this.removeVertex(A);
				// console.log("OLD B: "+B.edges().length);
				var k, ed, ee = A.edges();
				for(k=0;k<ee.length;++k){
					ed = ee[k];
					if(ed.vertexA()==A){
						ed.vertexA(B); B.addEdge(ed);
					}else if(ee[k].vertexB()==A){
						ed.vertexB(B); B.addEdge(ed);
					}else{
						console.log("errrrr");
					}
				}
				// console.log("NEW B: "+B.edges().length);
// console.log("LAS A: "+A.edges().length);
				A.kill();

				// 
				if(PA.next().prev()!=PA){
					console.log("NO 1");
				}
				if(NA.prev().next()!=NA){
					console.log("NO 2");
				}
				if(PB.next().prev()!=PB){
					console.log("NO 3");
				}
				if(NB.prev().next()!=NB){
					console.log("NO 4");
				}
				// 
				if(PA.opposite().next().prev()!=PA.opposite()){
					console.log("NO 5");
				}
				if(NA.opposite().prev().next()!=NA.opposite()){
					console.log("NO 6");
				}
				if(PB.opposite().next().prev()!=PB.opposite()){
					console.log("NO 7");
				}
				if(NB.opposite().prev().next()!=NB.opposite()){
					console.log("NO 8");
				}
// NA.opposite(NB);
// NB.opposite(NA);

// PA.opposite(PB);
// PB.opposite(PA);

// PA.opposite(NB);
// NB.opposite(PA);

// NA.opposite(PB);
// PB.opposite(NA);
				--j;
			}
		}
	}
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
Voronoi.EdgeGraph._siteSorting = function(a,b){
	return Voronoi.EdgeGraph._pointSorting(a.point(), b.point());
}
Voronoi.EdgeGraph._pointSorting = function(a,b){
	if(a.y==b.y){
		if(a.x==b.x){
			return 0;
		}else if(a.x<b.x){
			return -1;
		}
		return 1;
	}else if(a.y<b.y){
		return -1;
	}
	return 1;
}
Voronoi.EdgeGraph._triangleSorting = function(a,b){
	var eq0 = Voronoi.EdgeGraph._pointSorting(a[0].point(),b[0].point());
	if(eq0==0){
		var eq1 = Voronoi.EdgeGraph._pointSorting(a[1].point(),b[1].point());
		if(eq1==0){
			return Voronoi.EdgeGraph._pointSorting(a[2].point(),b[2].point());
		}
		return eq1;
	}
	return eq0;
}
Voronoi.EdgeGraph.prototype.triangulate = function(){ // tesselation / triangle set [] of cells
	var triangles = new RedBlackTree(Voronoi.EdgeGraph._triangleSorting);
	var i, j;
	var sites = this._sites;
	for(i=0; i<sites.length; ++i){
		var site = sites[i];
		site.index(i);
	}
	for(i=0; i<sites.length; ++i){
		var siteA = sites[i];
		var adjacentA = siteA.adjacentSites();
		//console.log("     SITE   "+i+".   "+siteA.point()+"  | adj:"+adjacentA.length);
		for(j=0; j<adjacentA.length; ++j){
			var siteB = adjacentA[j];
			var adjacentB = siteB.adjacentSites();
			//console.log("         SITE   "+j+".   "+siteB.point()+"  | adj:"+adjacentB.length);
			for(k=0; k<adjacentB.length; ++k){
				var siteC = adjacentB[k];
				//var adjacentC = siteC.adjacentSites();
				var exists = Code.elementExists(adjacentA,siteC);
				//console.log("            SITE   "+k+".   "+siteC.point()+"");
				if(exists){
					pointA = siteA;
					pointB = siteB;
					pointC = siteC;
					var list = [pointA,pointB,pointC].sort(Voronoi.EdgeGraph._siteSorting);
					//console.log("TRIANGLE: "+list[0].point()+" - "+list[1].point()+" - "+list[2].point()+"  ");
					triangles.insertObjectUnique(list);
				}
			}
		}
		/*
		for(j=0; j<edgesA.length; ++j){
			var edgeA = edgesA[j];
				//edgeA.fixZeroOrientation();
			var nextA = edgeA.next();
			var prevA = edgeA.prev();
			var edgeB = edgeA.opposite();
				//edgeB.fixZeroOrientation();
			var prevB = edgeB.prev();
			var nextB = edgeB.next();
			var siteB = edgeB.site();
			var pointB = siteB.point();
			var siteCA = null;
			var siteCB = null;
			//console.log("            "+j+".        ");
			console.log("               "+j+".  "+edgeA+"    :   "+edgeA.vertexA()+", "+edgeA.vertexB());
			console.log("                        "+siteB+" ... ");
			//console.log("                        ");
			
			// NEXT
			if(nextA && nextA.opposite()){
				siteCA = edgeA.next().opposite().site();
			}
			if(prevB && prevB.opposite()){
				siteCB = prevB.opposite().site();
			}
			// ELSE PREV
			if(!nextA){
				if(prevA && prevA.opposite()){
					siteCA = prevA.opposite().site();
				}
				if(nextB && nextB.opposite()){
					siteCB = nextB.opposite().site();
				}
			}
			if(siteA && siteB && siteCA && (siteCA == siteCB)){ // guaranteeing consistency not necessary
				pointA = siteA;
				pointB = siteB;
				pointC = siteCA;
				var list = [pointA,pointB,pointC].sort(Voronoi.EdgeGraph._siteSorting);
				console.log("TRIANGLE: "+list[0].point()+" - "+list[1].point()+" - "+list[2].point()+"  ");
				triangles.insertObjectUnique(list);
			}
			*/
			/*
			go over each edge in site A & get a list of adjacent sites
				for each adjacnet site, if this site also is adjacent to another site as site A => triangle
			*/
		/*
			var edgeA = edgesA[j];
			var edgeAO = edgeA.opposite();
			var siteB = edgeAO.site();
			var edgesB = siteB.edges();
			for(k=0; k<edgesB.length; ++k){
				var edgeB = edgesB[k];
				//
			}
			//var pointA = siteA.point();
			*/
		
	}
	triangles = triangles.toArray();
	var tris = [];
	var data = [];
	var points = [];
	var perimeters = [];
	var rays = [];
	for(i=0; i<sites.length; ++i){
		var site = sites[i];
		points[i] = site.point();
		data[i] = site.data();
		var edges = site.edges();
		var perimeter = false;
		for(j=0; j<edges.length; ++j){
			var edge = edges[j];
			if(edge.prev()==null || edge.next()==null){
				perimeter = true;
			}
		}
		perimeters[i] = perimeter;
		rays[i] = null;
	}
	for(i=0; i<triangles.length; ++i){
		var sites = triangles[i];
		var siteA = sites[0];
		var siteB = sites[1];
		var siteC = sites[2];
if(siteB.index()==null){
	console.log("NULL INDEX: "+siteB+" "+siteB.index()+" / "+triangles.length);
}
		var tri = [siteA.index(), siteB.index(), siteC.index()];
//		console.log("TRI "+i+" : "+tri);
		tris[i] = tri;
	}
	var hull = this._convexSites();
	for(i=0; i<=hull.length; ++i){
		var site = hull[ i%hull.length ];
		prev = hull[ (i-1+hull.length)%hull.length ];
		next = hull[ (i+1)%hull.length ];
		var v1 = V2D.sub(site.point(),prev.point());
			v1.norm();
		var v2 = V2D.sub(site.point(),next.point());
			v2.norm();
		var angle = V2D.angleDirection(v2,v1) * 0.5;
		ray = V2D.rotate(v2.copy(),angle)
		rays[site.index()] = ray;
	}
	for(i=0; i<hull.length; ++i){
		hull[i] = hull[i].index();
	}
	return {"points":points, "triangles":tris, "datas":data, "perimeters":perimeters, "perpendiculars":rays, "convexHull":hull};
}
Voronoi.EdgeGraph.prototype.convexHull = function(){ 
	var sites = this._convexSites();
	var i, len = sites.length;
	for(i=0; i<len; ++i){
		sites[i] = sites[i].point();
	}
	return sites;
}
Voronoi.EdgeGraph.prototype._convexSites = function(){ // convex hull = set of all points that have infinite edges
	var pointList = [];
	var sites = this._sites;
	var i, j, k;
	for(i=0; i<sites.length; ++i){ // find first site with an edge.next == null
		var site0 = sites[i];
		var edges0 = site0.edges();
		for(j=0; j<edges0.length; ++j){
			var edge0 = edges0[j];
			if(edge0.next()==null){
				//pointList.push(site0.point());
				pointList.push(site0);
				var sitePrev = site0;
				var site = edge0.opposite().site();
				var iterations = 0;
				while(site){ // go about perimeter from some start site back to initial site
					++iterations;
					if(iterations>1E4){ // TODO: REMOVE ERROR CHECK
						console.log("fix me");
						break;
					}
					if(site==site0){
						return pointList;
					}
					//pointList.push(site.point());
					pointList.push(site);
					var edges = site.edges();
					for(k=0; k<edges.length; ++k){
						var edge = edges[k];
						// if(edge.prev()==null){
						// 	if(edge.opposite().site() != sitePrev){
						// 		site = edge.opposite().site();
						// 		break;
						// 	}
						// }
						if(edge.next()==null){
							if(edge.opposite().site() != sitePrev){
								sitePrev = site;
								site = edge.opposite().site();
								break;
							}
						}
					}
				}
				return pointList;
			}
		}
	}
	return pointList;
}

/*


kruskal MST - add useful edges ordered by weight 

*/












