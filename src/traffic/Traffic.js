// Traffic.js

function Traffic(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);




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
}

Traffic.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}

Traffic.prototype.handleEnterFrame = function(e){
	// console.log(e);
}



Traffic.Lane = function(){
	this._begin = new V2D();
	this._end = new V2D();
	this._length = 0.0;
	this._adjLeft = [];
	this._adjRight = [];
}


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


Transportation Engineering




*/



