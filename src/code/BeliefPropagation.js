// BeliefPropagation.js
BeliefPropagation.x = function(){
	// ...
}
// ------------------------------------------------------------------------------------------------------------------------ CLASS
function BeliefPropagation(graph, toVar, toFac, mVtoF, mFtoV, pV, pF, complete, minDelta, maxIterations){
	this._variables = null;
	this._factors = null;
	this._graph = graph;
	this._toVariableFxn = null;
	this._toFactorFxn = null;
	this._messageVtoFFxn = null;
	this._messageFtoVFxn = null;
	this._processVFxn = null;
	this._processFFxn = null;
	this._completeFxn = null;
	this._minDelta = Code.valueOrDefault(minDelta,0);
	this._maxIterations = Code.valueOrDefault(maxIterations,10);
	console.log(this);
	this.toVariable(toVar);
	this.toFactor(toFac);
	this.messageVtoF(mVtoF);
	this.messageFtoV(mFtoV);
	this.processV(pV);
	this.processF(pF);
	this.complete(complete);
}

// ------------------------------------------------------------------------------------------------------------------------ LIFECYCLE FXNS
BeliefPropagation.prototype.toVariable = function(fxn){
	if(fxn!==undefined){
		this._toVariableFxn = fxn;
	}
	return this._toVariableFxn;
}
BeliefPropagation.prototype.toFactor = function(fxn){
	if(fxn!==undefined){
		this._toFactorFxn = fxn;
	}
	return this._toFactorFxn;
}
BeliefPropagation.prototype.messageVtoF = function(fxn){
	if(fxn!==undefined){
		this._messageVtoFFxn = fxn;
	}
	return this._messageVtoFFxn;
}
BeliefPropagation.prototype.messageFtoV = function(fxn){
	if(fxn!==undefined){
		this._messageFtoVFxn = fxn;
	}
	return this._messageFtoVFxn;
}
BeliefPropagation.prototype.processV = function(fxn){
	if(fxn!==undefined){
		this._processVFxn = fxn;
	}
	return this._processVFxn;
}
BeliefPropagation.prototype.processF = function(fxn){
	if(fxn!==undefined){
		this._processFFxn = fxn;
	}
	return this._processFFxn;
}
BeliefPropagation.prototype.complete = function(fxn){
	if(fxn!==undefined){
		this._completeFxn = fxn;
	}
	return this._completeFxn;
}
// ------------------------------------------------------------------------------------------------------------------------ PROCESS
BeliefPropagation.prototype.solve = function(){
	this._initialize();
	this._solve();
}
BeliefPropagation.prototype._initialize = function(){
	console.log("_initialize");
	var graph = this._graph;
	var vertexes = graph.vertexes();
	var vLookup = {};
	var vList = [];
	var toV = this._toVariableFxn;
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var index = vertex.id();
		var variable = toV(vertex);
		vLookup[index] = variable;
		vList.push(variable);
	}
	console.log(vLookup);
	console.log(vList);
	var edges = graph.edges();
	var fLookup = {};
	var fList = [];
	var toF = this._toFactorFxn;
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var index = edge.id();
		var factor = toF(edge);
		fLookup[index] = factor;
		fList.push(factor);
	}
	console.log(fLookup);
	console.log(fList);
	this._factorLookup = fLookup;
	this._variableLookup = vLookup;
	this._factorList = fList;
	this._variableList = vList;
}
BeliefPropagation.prototype._solve = function(){
	console.log("_solve");
	var graph = this._graph;
	var vertexes = graph.vertexes();
	var edges = graph.edges();
	var vCount = vertexes.length;
	var fCount = edges.length;
	var maxIterations = this._maxIterations;
	var minDelta = this._minDelta;
	// var fTable = this._factorLookup;
	// var vTable = this._variableLookup;
	var fTable = this._factorLookup;
	var vTable = this._variableLookup;
	// var fKeys = Code.keys(fTable);
	// var vKeys = Code.keys(vTable);
	var fList = this._factorList;
	var vList = this._variableList;
	var messageVtoF = this._messageVtoFFxn;
	var messageFtoV = this._messageFtoVFxn;
	var processF = this._processFFxn;
	var processV = this._processVFxn;
	var i, j, k;
	for(var iteration=0; iteration>maxIterations; ++iteration){
		console.log(": "+iteration+"  /  "+maxIterations);
		// variable to factor
		for(i=vCount; --i;){
			var variable = vList[i];
			var vertex = vertexes[i];
			var es = vertex.edges();
			for(j=es.length; --j;){
				var edge = es[j];
				var index = edge.id();
				var factor = fTable[index];
				messageVtoF(variable,factor);
			}
		}
		// process f
		for(i=fList.length; --i;){
			var factor = fList[i];
			processF(factor);
		}
		// factor to variable
		for(i=fList.length; --i;){
			var factor = fList[i];
			var edge = edges[i];
			var vs = edge.vertexes();
			for(j=vs.length; --j;){
				var vertex = vs[j];
				var index = vertex.id();
				var variable = vTable[index];
				messageFtoV(factor,variable);
			}
		}
		// process v
		var delta = 0;
		for(i=vList.length; --i;){
			var variable = vList[i];
			delta += processV(factor);
		}
		delta /= vList.length;
		console.log(delta+" <?< "+minDelta);
		if(delta<minDelta){
			break;
		}
	}
	console.log("done");
	this._completeFxn();
}
BeliefPropagation.prototype.kill = function(){
	this._variables = null;
	this._factors = null;
}
BeliefPropagation.prototype.toString = function(){
	return "[BP]";
}




// factor graph:
function FactorGraph(what){
	// ...
}
FactorGraph.prototype.toString = function(){
	return "[FG]";
}
















