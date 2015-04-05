// Traffic.js

function Traffic(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 50);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleEnterFrame,this);

	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.keyboardFxnKeyDown, this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.keyboardFxnKeyDown2, this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.keyboardFxnKeyUp, this);
	this._keyboard.addListeners();




	/*
	var A = new V2D(0,0);
	var B = new V2D(20,10);
	var C = new V2D(100,100);
	var D = new V2D(0,100);
	var len = Code.bezier2DCubicLength(A,B,C,D);
	console.log(len);

	var d ;
	d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0, 0xFFFF0000);
	//d.graphics().beginPath();
	d.graphics().moveTo(A.x,A.y);
	d.graphics().bezierTo(B.x,B.y, C.x,C.y, D.x,D.y);
	d.graphics().strokeLine();
	//d.graphics().endPath();
	this._root.addChild(d);
	*/

	this._lanes = [];
	this._vehicles = [];

	var lane, laneA, laneB, laneC, laneD, car, attr, point, point2;
	// lane 1
	laneA = new Traffic.Lane();
	laneA.setPath( new V2D(20,20),  new V2D(20,150) );
	laneA.setCapacityFromPath();
	this._lanes.push(laneA);

	// lane 2
	laneB = new Traffic.Lane();
	point = laneA.pointAtPathPercent(0.50);
	laneB.setPath( new V2D(100,20),  new V2D(20,20), point);
	laneB.setCapacityFromPath();
	this._lanes.push(laneB);

	// lane 3
	laneC = new Traffic.Lane();
	point = laneA.pointAtPathPercent(1.0);
	laneC.setPath( point,  new V2D(20,260),  new V2D(70,250) );
	laneC.setCapacityFromPath();
	this._lanes.push(laneC);

	// lane 4
	laneD = new Traffic.Lane();
	point = laneC.pointAtPathPercent(1.0);
	point2 = laneB.pointAtPathPercent(0.0);
	laneD.setPath( point,  new V2D(250,200),  new V2D(200,20),  point2 );
	laneD.setCapacityFromPath();
	this._lanes.push(laneD);


	// connect laneA to acceleration laneB
	Traffic.Lane.connectLanesLR(laneA,0.25,0.5, laneB,0.5,1.0);
	// connect laneA to next laneC
	Traffic.Lane.connectLanesPN(laneA,1.0,1.0, laneC,0.0,0.0);
	// connect laneC to next laneD
	Traffic.Lane.connectLanesPN(laneC,1.0,1.0, laneD,0.0,0.0);
	// connect laneD to next laneB
	Traffic.Lane.connectLanesPN(laneD,1.0,1.0, laneB,0.0,0.0);

	// add speed limit to lane A
	attr = new Traffic.Lane.Attribute.SpeedLimit(0,1.0,laneA, 25.0);
	laneA.addAttribute(attr);

	// add speed limit to ramp B
	attr = new Traffic.Lane.Attribute.SpeedLimit(0,1.0,laneB, 10.0);
	laneB.addAttribute(attr);

	// add speed limit to lane C
	attr = new Traffic.Lane.Attribute.SpeedLimit(0,1.0,laneC, 10.0);
	laneC.addAttribute(attr);

	// add speed limit to lane D
	attr = new Traffic.Lane.Attribute.SpeedLimit(0,1.0,laneD, 20.0);
	laneD.addAttribute(attr);

	car = new Traffic.Vehicle();
	car.start(90.0);
	car.length(0.1);
	laneA.addVehicle(car);
	this._vehicles.push(car);



this._path = laneD._path;

	this.renderScene();
}
Traffic.prototype.keyboardFxnKeyUp = function(e){
	// console.log("key up "+e);
}
Traffic.prototype.keyboardFxnKeyDown = function(e){
	/*
	if(e.keyCode==Keyboard.KEY_SPACE){
		this._isPlaying = !this._isPlaying;
	}else if(e.keyCode==Keyboard.KEY_UP){
		this._stage.frameRate( Math.max( this._stage.frameRate()*0.5, 10) );
	}else if(e.keyCode==Keyboard.KEY_DOWN){
		this._stage.frameRate( Math.min( this._stage.frameRate()*2.0, 1000) );
	}else if(e.keyCode==Keyboard.KEY_LET_Z){
		this.globalCellOperation(this.cellRandomAlive,0.0);
	}else if(e.keyCode==Keyboard.KEY_LET_X){
		this.globalCellOperation(this.cellRandomAlive,0.5);
	}else if(e.keyCode==Keyboard.KEY_LET_C){
		this.globalCellOperation(this.cellFlipCellState,0.5);
	}else if(e.keyCode==Keyboard.KEY_LEFT){
		this._cellSizeWidth = Math.max(this._cellSizeWidth-1.0, 1.0);
		this._cellSizeHeight = this._cellSizeWidth;
	}else if(e.keyCode==Keyboard.KEY_RIGHT){
		this._cellSizeWidth = Math.min(this._cellSizeWidth+1.0, 20.0);
		this._cellSizeHeight = this._cellSizeWidth;
	}
	// redraw update
	this.renderCells();
	*/
}
Traffic.prototype.keyboardFxnKeyDown2 = function(e){
	// console.log("key still down "+e);
}

Traffic.prototype.processScene = function(){
	var dt = 0.10;
	var d, i, j, k, vehicles, vehicle, attr, car, lane, points, attributes;
	var cars = this._vehicles;
	var lanes = this._lanes;
	for(i=0;i<lanes.length;++i){
		lane = lanes[i];
		// generation points
		// consuming points
	}
	for(i=0;i<cars.length;++i){
		car = cars[i];
		car.prepareNextState(dt);
		lanes = car._lanes;
		// for each adjacent / nearby lane
		for(j=0;j<lanes.length;++j){
			lane = lanes[j];
			car.processLane(lane);
			// for each attribute
			attributes = lane._attributes;
			for(k=0;k<attributes.length;++k){
				// react
				attr = attributes[k];
				car.processAttribute(attr);
			}
			// for each car in lane
			vehicles = lane._vehicles;
			for(k=0;k<vehicles.length;++k){
				vehicle = vehicles[k];
				if(vehicle!=car){
					car.processVehicle(vehicle);
				}
			}
		}
	}
	for(i=0;i<cars.length;++i){
		car = cars[i];
		car.processSelf();
		//console.log(car.speed())
		car.gotoNextState(dt);
	}
}
Traffic.prototype.renderScene = function(){
	var d, i, j, car, lane, point, points, color, dir, dir2, p;
	var cars;
	var lanes = this._lanes;
	d = this._root;
	d.graphics().clear();
	for(i=0;i<lanes.length;++i){
		lane = lanes[i];
		color = lane._color;
		color = Code.getColARGBFromFloat(color[0],color[1],color[2],color[3]);
		points = lane._path;
		
		d.graphics().beginPath();
		d.graphics().setLine(1.0,color);
		d.graphics().moveTo(points[0].x,points[0].y);
		if(points.length==2){
			d.graphics().lineTo(points[1].x,points[1].y);
		}else if(points.length==3){
			d.graphics().bezierTo(points[1].x,points[1].y, points[2].x,points[2].y);
		}else if(points.length==4){
			d.graphics().bezierTo(points[1].x,points[1].y, points[2].x,points[2].y, points[3].x,points[3].y);
		}
		d.graphics().strokeLine();
		d.graphics().endPath();
		// 
		attrs = lane._attributes;
		for(j=0;j<attrs.length;++j){
			attr = attrs[j];
		}
		cars = lane._vehicles;//lane._vehicles.toArray();
		for(j=0;j<cars.length;++j){
			car = cars[j];
			wid = 5.0;
			hei = 10.0;
			p = (car.start()+0.5*car.length())/lane.length();
			point = lane.pointAtPathPercent( p );
			dir = lane.directionAtPathPercent(p);
			dir.norm();
			dir2 = V2D.rotate(dir,-Math.PIO2);
			//

var n = null;
if (lane._path.length==2){
	n = V2D.copy(dir2).norm();
}else if (lane._path.length==3){
	n = Code.bezier2DQuadraticNormalAtT(lane._path[0],lane._path[1],lane._path[2], p);
}else if (lane._path.length==4){
	n = Code.bezier2DCubicNormalAtT(lane._path[0],lane._path[1],lane._path[2],lane._path[3], p);
}
if(n){
	n.scale(25.0);
	//console.log(n.length());
	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFF229900);
	d.graphics().moveTo(point.x, point.y);
	d.graphics().lineTo(point.x+n.x, point.y+n.y);
	d.graphics().strokeLine();
	d.graphics().endPath();
}

				color = car._color;
				color = Code.getColARGBFromFloat(color[0],color[1],color[2],color[3]);
			d.graphics().setLine(1.0,color);
			d.graphics().setFill(0x9900FF00);
			d.graphics().beginPath();
			
			dir.scale(hei*0.5);
			dir2.scale(wid*0.5);
			d.graphics().moveTo(point.x - dir2.x - dir.x, point.y - dir2.y - dir.y);
			d.graphics().lineTo(point.x + dir2.x - dir.x, point.y + dir2.y - dir.y);
			d.graphics().lineTo(point.x + dir2.x + dir.x, point.y + dir2.y + dir.y);
			d.graphics().lineTo(point.x - dir2.x + dir.x, point.y - dir2.y + dir.y);
			d.graphics().lineTo(point.x - dir2.x - dir.x, point.y - dir2.y - dir.y);
			

			d.graphics().fill();
			d.graphics().strokeLine();
			d.graphics().endPath();
		}
	}
	cars = this._vehicles;
	for(i=0;i<cars.length;++i){
		car = cars[i];
	}
}

Traffic.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y);
	var A = this._path[0];
	var B = this._path[1];
	var C = this._path[2];
	var D = this._path[3];
	var point = new V2D(e.x,e.y);
	//point = Code.bezier2DQuadraticClosestPointToPoint(point, A,B,C,D);
	point = Code.bezier2DCubicClosestPointToPoint(point, A,B,C,D);
	console.log(point);
	var d = this._root;
	//
	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFF0000FF);
	d.graphics().setFill(0x9900FF00);
	d.graphics().drawCircle(e.x,e.y,4.0);
	d.graphics().fill();
	d.graphics().strokeLine();
	d.graphics().endPath();
	//
	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFF0000FF);
	d.graphics().setFill(0x99FF0000);
	d.graphics().drawCircle(point.x,point.y,4.0);
	d.graphics().fill();
	d.graphics().strokeLine();
	d.graphics().endPath();
	//
	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFF00FF00);
	d.graphics().moveTo(e.x,e.y);
	d.graphics().lineTo(point.x,point.y);
	d.graphics().strokeLine();
	d.graphics().endPath();
}

Traffic.prototype.handleEnterFrame = function(e){
return;
	this.processScene();
	this.renderScene();
}

// LANE ------------------------------------------------------------------------------------------------------------------------------------------------------------
Traffic.Lane = function(len){
	this._attributes = [];//new IntervalTree();
	this._vehicles = [];//new IntervalTree();
	this._length = 0.0; // capacity
	this.length(len);
	// visuals
	this._path = [];
	this._color = [1.0,1.0,0.0,0.0];
}
Traffic.Lane.LANE_ATTRIBUTE_TYPE_UNKNOWN = 0;
Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_LEFT = 1;
Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_RIGHT = 2;
Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_PREV = 3;
Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_NEXT = 4;
Traffic.Lane.LANE_ATTRIBUTE_TYPE_BLOCK = 5; // accident, construction - temporary stoppages
Traffic.Lane.LANE_ATTRIBUTE_TYPE_SPEED_LIMIT = 6;
Traffic.Lane.LANE_ATTRIBUTE_TYPE_TRAFFIC_SIGNAL = 7;
Traffic.Lane.LANE_ATTRIBUTE_TYPE_ALERT = 99; // sign, info (caution merging)

Traffic.Lane.prototype.length = function(l){
	if(l!==undefined){ this._length = l; }
	return this._length;
}

Traffic.Lane.prototype.pointAtPathPercent = function(p){
	if(this._path.length==2){
		return V2D.pointAtT(this._path[0],this._path[1], p);
	}else if(this._path.length==3){
		return Code.bezier2DQuadraticAtT(this._path[0],this._path[1],this._path[2], p);
	}else if(this._path.length==4){
		return Code.bezier2DCubicAtT(this._path[0],this._path[1],this._path[2],this._path[3], p);
	}
	return null;
}
Traffic.Lane.prototype.directionAtPathPercent = function(p){
	if(this._path.length==2){
		return V2D.sub(this._path[1],this._path[0]).norm()
	}else if(this._path.length==3){
		return Code.bezier2DQuadraticTangentAtT(this._path[0],this._path[1],this._path[2], p);
	}else if(this._path.length==4){
		return Code.bezier2DCubicTangentAtT(this._path[0],this._path[1],this._path[2],this._path[3], p);
	}
	return null;
}
Traffic.Lane.prototype.closestPercentToPoint = function(point){
	if(this._path.length==2){
		var org = this._path[0];
		var dir = V2D.sub(this._path[1],this._path[0]);
		var pnt = Code.closestPointLineSegment2D(org,dir, point);
		return V2D.sub(pnt,org).length() / dir.length();
	}else if(this._path.length==3){
		return null;//Code.bezier2DQuadraticTangentAtT(this._path[0],this._path[1],this._path[2], p);
	}else if(this._path.length==4){
		return null;//Code.bezier2DCubicTangentAtT(this._path[0],this._path[1],this._path[2],this._path[3], p);
	}
	return null;
}
Traffic.Lane.prototype.closestPointToPoint = function(point){
	if(this._path.length==2){
		var org = this._path[0];
		var dir = V2D.sub(this._path[1],this._path[0]);
		return Code.closestPointLineSegment2D(org,dir, point);
	}else if(this._path.length==3){
		return null;//Code.bezier2DQuadraticTangentAtT(this._path[0],this._path[1],this._path[2], p);
	}else if(this._path.length==4){
		return null;//Code.bezier2DCubicTangentAtT(this._path[0],this._path[1],this._path[2],this._path[3], p);
	}
	return null;
}

Traffic.Lane.prototype.setPath = function(A,B,C,D){
	Code.emptyArray(this._path);
	for(var i=0; i<arguments.length; ++i){
		this._path.push( arguments[i] );
	}
}
Traffic.Lane.prototype.setCapacityFromPath = function(){
	var len = 0;
	if(this._path.length==2){
		len = V2D.distance(this._path[0],this._path[1]);
	}else if(this._path.length==3){
		len = Code.bezier2DQuadraticLength(this._path[0],this._path[1],this._path[2]);
	}else if(this._path.length==4){
		len = Code.bezier2DCubicLength(this._path[0],this._path[1],this._path[2],this._path[3]);
	}
	this.length( len );
}
Traffic.Lane.prototype.addVehicle = function(vehicle){
	//var node = this._vehicles.insert(vehicle.start(),vehicle.length(), vehicle);
	//vehicle.node = node; // need to store this for periodic deletion
	Code.addUnique(this._vehicles,vehicle);
	vehicle.addLane(this);
}
Traffic.Lane.prototype.removeVehicle = function(vehicle){
	Code.removeElement(this._vehicles,vehicle);
	vehicle.removeLane(this);
}
Traffic.Lane.prototype.addAttribute = function(attribute){
	//this._attributes.insert(attribute);
	Code.addUnique(this._attributes,attribute);
}
Traffic.Lane.prototype.attributes = function(){
	return this._attributes;
}

Traffic.Lane.connectLanes = function(laneA,pA1,pA2,typeA, laneB,pB1,pB2,typeB){
	var attributeA = new Traffic.Lane.Attribute.Adjacent(typeA,pA1,pA2, laneA);
	var attributeB = new Traffic.Lane.Attribute.Adjacent(typeB,pB1,pB2, laneB);
	attributeA.adjacent(attributeB);
	attributeB.adjacent(attributeA);
	laneA.addAttribute(attributeA);
	laneB.addAttribute(attributeB);
}

Traffic.Lane.connectLanesLR = function(laneA,pA1,pA2, laneB,pB1,pB2){ // laneA is left, laneB is right
	Traffic.Lane.connectLanes(laneA,pA1,pA2,Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_RIGHT, laneB,pB1,pB2,Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_LEFT);
}
Traffic.Lane.connectLanesPN = function(laneA,pA1,pA2, laneB,pB1,pB2){ // laneA is prev, laneB is next
	Traffic.Lane.connectLanes(laneA,pA1,pA2,Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_NEXT, laneB,pB1,pB2,Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_PREV);
}

// ATTRIBUTE ------------------------------------------------------------------------------------------------------------------------------------------------------------
Traffic.Lane.Attribute = function(t,s,o,l){
	this._start = 0.0; // relative point
	this._stop = 0.0; // relative point
	this._type = Traffic.Lane.LANE_ATTRIBUTE_TYPE_UNKNOWN;
	this._lane = null;
	this._reference = null;
	this.type(t);
	this.start(s);
	this.stop(o);
	this.lane(l);
	// visuals
	this._color = [1.0,0.0,0.0,1.0];
}
Traffic.Lane.Attribute.prototype.type = function(t){
	if(t!==undefined){ this._type = t; }
	return this._type;
}
Traffic.Lane.Attribute.prototype.start = function(s){
	if(s!==undefined){ this._start=s; }
	return this._start;
}
Traffic.Lane.Attribute.prototype.stop = function(s){
	if(s!==undefined){ this._stop = s; }
	return this._stop;
}
Traffic.Lane.Attribute.prototype.reference = function(r){
	if(r!==undefined){ this._reference = r; }
	return this._reference;
}
Traffic.Lane.Attribute.prototype.lane = function(l){
	if(l!==undefined){ this._lane = l; }
	return this._lane;
}
// ATTRIBUTE TYPE ADJACENT --------------------------------------------------------------------------------------------------------------------
Traffic.Lane.Attribute.Adjacent = function(t,s,o,l, a,d){
	Traffic.Lane.Attribute.Adjacent._.constructor.call(this, t, s,o,l);
	this._adjacent = null; // attribute
	this.adjacent(a);
}
Code.inheritClass(Traffic.Lane.Attribute.Adjacent, Traffic.Lane.Attribute);
Traffic.Lane.Attribute.Adjacent.prototype.adjacent = function(a){
	if(a!==undefined){ this._adjacent=a; }
	return this._adjacent;
}
Traffic.Lane.Attribute.Adjacent.prototype.dual = function(){
	return this._adjacent.lane();
}
// ATTRIBUTE TYPE SPEED LIMIT --------------------------------------------------------------------------------------------------------------------
Traffic.Lane.Attribute.SpeedLimit = function(s,o,l, p){
	Traffic.Lane.Attribute.SpeedLimit._.constructor.call(this, Traffic.Lane.LANE_ATTRIBUTE_TYPE_SPEED_LIMIT, s,o,l);
	this._speed = 0.0;
	this.speed(p);
}
Code.inheritClass(Traffic.Lane.Attribute.SpeedLimit, Traffic.Lane.Attribute);
Traffic.Lane.Attribute.SpeedLimit.prototype.speed = function(s){
	if(s!==undefined){ this._speed=s; }
	return this._speed;
}
// ATTRIBUTE TYPE ? --------------------------------------------------------------------------------------------------------------------





// VEHICLE --------------------------------------------------------------------------------------------------------------------
Traffic.Vehicle = function(len){
	this._start = 0.0; // location
	this._length = 1.0; // head-to-tail capacity nonrelative
	this._speed = 2.5; // speed
	this._lanes = [];
	this.length(len);
	// driver behavior
	this._maximumAcceleration = 0.5;
	this._assumedDefaultSpeed = 1.0; // d/s
	this._desiredRelativeSpeed = 1.0; // speed limit
	this._desiredMinimumSpacing = 1.0; // d
	this._reactionDelaySpeed = 0.1; // s
	// visuals
	this._color = [1.0,0.0,0.0,1.0];
}
Traffic.Vehicle.prototype.start = function(s){
	if(s!==undefined){ this._start=s; }
	return this._start;
}
Traffic.Vehicle.prototype.length = function(l){
	if(l!==undefined){ this._length = l; }
	return this._length;
}
Traffic.Vehicle.prototype.speed = function(s){
	if(s!==undefined){ this._speed=s; }
	return this._speed;
}
Traffic.Vehicle.prototype.addLane = function(lane){
	Code.addUnique(this._lanes,lane);
}
Traffic.Vehicle.prototype.removeLane = function(lane){
	Code.removeElement(this._lanes,lane);
}
Traffic.Vehicle.prototype.prepareNextState = function(dt){
	// preprocessing
}
Traffic.Vehicle.prototype.processAttribute = function(attr){
	switch(attr.type()){
		case Traffic.Lane.LANE_ATTRIBUTE_TYPE_SPEED_LIMIT:
			this.setDesiredSpeed(attr.speed());
			break;
		default:
			//console.log("N/A");
			break;
	}
	//console.log(attr.type());
}
Traffic.Vehicle.prototype.processVehicle = function(vehicle){
	// 
}
Traffic.Vehicle.prototype.processLane = function(lane){
	// 
}
Traffic.Vehicle.prototype.processSelf = function(){
	// 
}
Traffic.Vehicle.prototype.gotoNextState = function(dt){
	var i, attr, attributes, lane, dual;
	this._speed += Math.min(this._maximumAcceleration*dt, (this._assumedDefaultSpeed-this._speed)*0.5);
	//
	var next = this.start() + dt*this.speed();
	lane = this._lanes[0];
	var success = true;
	var diff;
	if( next > lane.length() ){
		success = false;
		diff = next - lane.length();
		attributes = lane.attributes();
		for(i=0;i<attributes.length && !success;++i){
			attr = attributes[i];
			switch(attr.type()){
				case Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_NEXT:
				lane.removeVehicle(this);
				attr.dual().addVehicle(this);
				next = diff; // need to recheck that vehicle hasn't also zoomed past this lane as well
				console.log("exit");
				success = true;
				break;
			default:
				break;
			}
		}
	}
	if(!success){
		attributes = lane.attributes();
		for(i=0;i<attributes.length && !success;++i){
			attr = attributes[i];
			switch(attr.type()){
				case Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_LEFT: // want to ramp in before the last second
				case Traffic.Lane.LANE_ATTRIBUTE_TYPE_ADJACENT_RIGHT:
					lane.removeVehicle(this);
					dual = attr.dual();
					dual.addVehicle(this);
					next = diff; // need to recheck that vehicle hasn't also zoomed past this lane as well
					// should put on next lane at closest point to NEXT location
					var p = this.start()/lane.length();
					var position = lane.pointAtPathPercent( p );
					var closest = dual.closestPointToPoint( position );
					var percent = dual.closestPercentToPoint( position );
					next = percent*dual.length();
					console.log("left/right");
					success = true;
					break;
				default:
					//console.log("N/A");
					break;
			}
		}
	}
	if(success){
		this.start( next );
	}else{
		this._speed = 0.0;
	}
	// post-processing
		// transition between lanes
	// goto next state
	this._nextLaneTransition = 0.0;
	this._nextLane = null;
	this._nextStart = null;
	this._nextSpeed = null;
}
Traffic.Vehicle.prototype.setDesiredSpeed = function(speed){
	this._assumedDefaultSpeed = speed * this._desiredRelativeSpeed;
}

//IntervalTree

/*

Learn how to drive:
- use turn signals
	- so that people around you know your intentions
	- so that people you mistakenly don't see know your intentions
- don't speed up to the next car
	- you'll only have to break once there
	- reverse dampening
- don't change lanes constantly to be in the faster one
	- adds more break time for people adjusting to you
- with multiple exit lanes (during traffic) get into the far-most exit lane
	- otherwise there's a wall of cars blocking others to enter forcing them to slow down anyway, and force themselves into the wall
- maintain constant speed
	- 
- don't weave through lanes to maintain top speed like it's a game
	- durrr


- infrastructure:
	- should alert people beforheand where problems are, or when/where lanes are closed
	- signaling


*/

/*

traffic theory
traffic flow theory
stream
network movement

http://en.wikipedia.org/wiki/Traffic_flow
http://en.wikipedia.org/wiki/Three-phase_traffic_theory
http://www.fhwa.dot.gov/publications/research/operations/tft/chap2.pdf
http://www.webpages.uidaho.edu/niatt_labmanual/Chapters/trafficflowtheory/Introduction/index.htm
http://www.fhwa.dot.gov/publications/research/operations/tft/chap2.pdf


Transportation Engineering




*/

/*

MODELING:

- lanes
	- adjacent
	- onramps
	- offramps
- accidents
- 



--- concepts needed:
	- points which are not accessible [blocks, accidents, construction]
	- available transition locations
	- capacity (length)




*/



