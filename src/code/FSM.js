// FSM.js

FSM.EVENT_START_STATE = "start";
FSM.EVENT_ENTER_STATE = "enter";
FSM.EVENT_EXIT_STATE = "exit";
FSM.EVENT_SET_TARGET_STATE = "target";

// default edges to use
FSM.NEXT_DEFAULT = "default";
FSM.NEXT_SUCCESS = "success";
FSM.NEXT_FAILURE = "failure";
FSM.NEXT_ERROR = "error";
FSM.NEXT_A = "a";
FSM.NEXT_B = "b";
FSM.NEXT_C = "c";

function FSM(){
	FSM._.constructor.call(this);
	this.init();
}
Code.inheritClass(FSM,Dispatchable);
FSM.prototype.init = function(){
	this._currentStateID = 0;
	this._currentEdgeID = 0;
	this._currentState = null;
	this._targetState = null;
	// this._dispatch = new Dispatch();
	this._states = {};
	// this._edges = {};
}
FSM.prototype.alertAll = function(str,obj){
	FSM._.alertAll.call(this,str,obj);
}

FSM.prototype.addState = function(data, enter, exit){
	var state = new FSM.State(this, this._currentStateID++, data, enter, exit);
	this._states[state.id()] = state;
	if(!this._currentState){
		this._currentState = state;
	}
}
FSM.prototype.set = function(state, context){ // no transition
	if(this._currentState!=null){
		this._currentState._didExitEvent(context);
	}
	if(state){
		this._currentState = state;
	}else{
		this._currentState = null;
	}
	// start();
}
FSM.prototype.start = function(){ // send start events
	var state = this._currentState;
	var context = null;
	if(state!=null){
		this.alertAll(FSM.EVENT_START_STATE, {"state":state, "context":context});
		this.alertAll(FSM.EVENT_ENTER_STATE, {"state":state, "context":context});
	}
}
FSM.prototype.goto = function(state, context){ // set desired(goal,request,destination,target,) state destination
	this._targetState = state;
	this._targetContext = context;
	this.alertAll(FSM.EVENT_SET_TARGET_STATE, {"state":state, "context":context});
}
FSM.prototype._next = function(edge, context){ // A->B
	var currentState = this._currentState;
	if(!currentState){
		throw("no current state");
	}
	var nextState = edge.next(context, this._targetState, this._targetContext);
	currentState._didExitEvent(context);
	this.alertAll(FSM.EVENT_EXIT_STATE, {"state":currentState, "context":context});
	if(nextState){
		this._currentState = nextState;
		nextState._didEnterEvent(context);
		this.alertAll(FSM.EVENT_ENTER_STATE, {"state":nextState, "context":context});
	}else{
		this._currentState = null;
		console.log("no next state");
	}
}

// FSM.prototype.connect = function(edgeName,state,fxn){ // A->B
// 	var edge = new FSM.Edge(this._currentEdgeID++, data, fxn);
// }

FSM.State = function(fsm, id, data, fxnEnter, fxnExit){ // fxn(context, data, from/to)
	this._id = id;
	this._fsm = fsm;
	this._data = data;
	this._enterFxn = fxnEnter;
	this._exitFxn = fxnExit;
	// this._substates = null;
	// this._subFSM = null;
	this._edges = {};
}
FSM.State.prototype.id = function(){
	return this._id;
}
FSM.State.prototype.next = function(edgeID, context){
	var edge = this._edges[edgeID];
	if(!edge){
		throw "no edge";
	}
	this._fsm.next(edge, context);
}
FSM.State.prototype._didEnterEvent = function(context, from, target){
	if(this._enterFxn){
		this._enterFxn(context, this._data, from, target);
	}
}
FSM.State.prototype._didExitEvent = function(context, from, target){
	if(this._exitFxn){
		this._exitFxn(context, this._data, from, target);
	}
}
FSM.State.prototype.connect = function(edgeName,fxn){ // A->B
	var edge = new FSM.Edge(this._currentEdgeID++, fxn);
	this._edges[edgeName] = edge;
}

FSM.Edge = function(id, fxn){//, data){ 
	this._id = id;
	this._nextFxn = fxn;
	// this._data = data;
}
FSM.Edge.prototype.id = function(){ 
	return this._id;
}
FSM.Edge.prototype.next = function(context, target, targetContext){ // determine dynamically what the next state should be
	if(!this._nextFxn){
		return null;
	}
	return this._nextFxn(context, target, targetContext);
}



/*

*/




