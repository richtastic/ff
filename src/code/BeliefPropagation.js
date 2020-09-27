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
	this._factors = [];
	this._variables = [];
	this._messages = {};
}
FactorGraph.directionPairIDFromIDs = function(idA,idB){
	var index = idA+"-"+idB;
	return index;
}
FactorGraph.normalizedArray = function(norm,array){
	if(!array){ // same in & out
		array = norm;
	}
	var total = 0;
	var len = array.length;
	if(len>0){
		for(var i=0; i<len; ++i){
			total += array[i];
		}
		if(total==0){
			total = 1.0;
		}
		for(var i=0; i<len; ++i){
			norm[i] = array[i]/total;
		}
	}
	return norm;
}
// FactorGraph.pairIDFromIDs = function(idA,idB){
// 	var index = Math.min(idA,idB)+"-"+Math.max(idA,idB);
// 	return index;
// }
FactorGraph.prototype.addFactor = function(variableNodes,potentials, data){ // [x0,x1,x2,...] [ MSB...LSB ]
	var node = new FactorGraph.FactorNode(variableNodes,potentials, data);
	this._factors.push(node);
	return node;
}
FactorGraph.prototype.addVariable = function(states, data){
	var node = new FactorGraph.VariableNode(states, data);
	this._variables.push(node);
	return node;
}
// FactorGraph.prototype.addEdge = function(nodeA,nodeB){
// 	var isAFactor = Code.isa(nodeA,FactorGraph.FactorNode);
// 	var isAVariable = Code.isa(nodeA,FactorGraph.VariableNode);
// 	var isBFactor = Code.isa(nodeB,FactorGraph.FactorNode);
// 	var isBVariable = Code.isa(nodeB,FactorGraph.VariableNode);
// 	if(isAFactor && isBVariable){
// 		// 
// 		return;
// 	}else if(isAVariable && isBFactor){
// 		// 
// 		return;
// 	}
// 	throw "incorrect situation";
// }
FactorGraph.prototype.sumProduct = function(){ // exact: DAG inference
	// pick root node
	// ...
	throw "sumProduct";
}
FactorGraph.prototype.maxProduct = function(){ // MAP
	// ..
	throw "maxProduct";
}
FactorGraph.prototype.maxSum = function(){ // ?
	// ..
	throw "maxSum";
}
FactorGraph.prototype.loopyBP = function(maxIterations){ // loopy sumProduct
	var graph = this;
	// variables are already set to unobserved(equadistribution) or observed (single value)

	// scheduling = factor nodes + variable nodes
	var variables = this._variables;
	var factors = this._factors;
	var nodes = Code.arrayPushArrays([], this._factors, variables);
	console.log(nodes);

	// initialize all variable->factor edges to initial belief setting
	for(var i=0; i<variables.length; ++i){
		var variable = variables[i];
		var defaultMessage = variable.initialBelief();
		console.log(defaultMessage);
		var neighbors = variable.factors();
		for(var j=0; j<neighbors.length; ++j){
			var neighbor = neighbors[j];
			graph.setMessage(variable,neighbor,defaultMessage);
		}
	}

	// iterate to convergence
	var operation = FactorGraph._operationSumProduct;
	this._iterate(nodes, operation, maxIterations);
	throw "loopyBP";

	var result = {"iterations":0};
	return result;
}
FactorGraph.prototype.loopyMAP = function(maxIterations){ // loopy maxProduct
	// ..
	throw "loopyMAP";
}
FactorGraph.prototype._iterate = function(nodes, operation, maxIterations){
	var graph = this;

var vari = this._variables[0];
console.log(vari.data()+" ... ");
// var queryNodes = [ vari ];
var queryNodes = this._variables;

	maxIterations = Code.valueOrDefault(maxIterations,10);
	for(var i=0; i<maxIterations; ++i){
		console.log("_iterate +++++++++++++++++++++++++++++++++++++ "+i);
		// go thru all nodes
		for(var n=0; n<nodes.length; ++n){
			var node = nodes[n];
			var neighbors = node.neighbors();
			for(var m=0; m<neighbors.length; ++m){
				var neighbor = neighbors[m];
				var message = operation(graph, node,neighbor);
console.log("  set: "+node.data()+" -> "+neighbor.data()+" = "+message);
				graph.setMessage(node,neighbor,message);
			}
		}
		// update beliefs ?
		for(var n=0; n<queryNodes.length; ++n){
			var node = queryNodes[n];
			var belief = node.belief(graph);
			console.log(" "+node.data()+" := "+belief);
			// node.observe(belief);
			// node._initialBelief = belief;
		}
	}
}

FactorGraph._operationSumProduct = function(graph,nodeA,nodeB){ // A to B
	var accumulator = null;
	// VARIABLE
	if(Code.isa(nodeA,FactorGraph.VariableNode)){
var doLog = false;
// if(nodeA.data()=="A"){
// 	doLog = true;
// }
if(doLog){
	console.log(nodeA.data()+" -> "+nodeB.data());
}
		accumulator = nodeA.initialBelief();
		accumulator = Code.copyArray(accumulator);
if(doLog){
	console.log("   "+accumulator+"     ");
}
		if(!nodeA.isObserved()){
			var neighbors = nodeA.factors();
			for(var i=0; i<neighbors.length; ++i){
				var neighbor = neighbors[i];
				if(neighbor!=nodeB){
					var message = graph.getMessage(neighbor,nodeA); // neighbor -> node
if(doLog){
	console.log("   m: "+neighbor.data()+" =  "+message);
}
					for(var s=0; s<accumulator.length; ++s){
						accumulator[s] *= message[s];
					}
				}
			}
		}
if(doLog){
	console.log("   "+accumulator+" <<< ");
}
		return accumulator;
	}else{ // FACTOR

var doLog = false;
// if(nodeA.data()=="fAM"){
// 	doLog = true;
// }
		accumulator = nodeA.potentials();
		accumulator = Code.copyArray(accumulator);
if(doLog){
	console.log(nodeA.data()+" -> "+nodeB.data());
	console.log(accumulator+" := ");
}
		// var neighbors = nodeA.neighbors();
		var variables = nodeA.variables();
		// construct modulo states:
		var rounds = [];
		var round = 1;
		rounds.push(round); // 1
		for(var j=0, i=variables.length-1; i>=0; --i, ++j){
			var node = variables[i];
			round *= node.states();
			rounds.push(round);
		}
if(doLog){
	// console.log("rounds: "+rounds);
}
		// fill out table: each variable @ each state
		for(var v=0; v<variables.length; ++v){
			var variable = variables[v];
			if(variable==nodeB){
				continue; // skip to neighbor
			}
			var message = graph.getMessage(variable,nodeA);
if(doLog){
	console.log(" m: "+variable.data()+" = "+message);
}
			var u = variables.length - v - 1; // opposite MSB | LSB
			var modulus = rounds[u+1];
			var divisor = rounds[u];
			for(var i=0; i<accumulator.length; ++i){
				var state = ((i%modulus)/divisor) | 0;
if(doLog){
	console.log(i+" = "+state);
}
				var value = message[state];
				accumulator[i] *= value;
			}
		}
// console.log(" accumulator "+nodeA.data()+" = "+accumulator);
if(doLog){
	console.log(accumulator+" <<<< ");
}
		// product
// console.log("marginalize");
		var outStates = Code.newArrayZeros(nodeB.states());
		var v = nodeA.variableToIndex(nodeB);
		var u = variables.length - v - 1; // opposite MSB | LSB
		var modulus = rounds[u+1];
		var divisor = rounds[u];
if(doLog){
	console.log(" index: "+nodeB.data()+" = "+v+","+u+" ");
}
		// find state info for var
		// var modulus = rounds[v+1];
		// var divisor = rounds[v];
// console.log(modulus,divisor);
		for(var i=0; i<accumulator.length; ++i){
			var val = accumulator[i];
			var state = ((i%modulus)/divisor) | 0;
if(doLog){
	console.log("     "+i+"  state: "+state+" = "+val);
}
			outStates[state] += val;
		}
// console.log(outStates);
		// throw "yep"
		// marginalize: sum over nodeB unique states
		// for(var s=0; s<states; ++s){// for each var
		// 	for(var i=0; i<neighbors.length; ++i){
		// 		var neighbor = neighbors[i];
		// 		if(neighbor!=nodeB){
		// 		}
		// 	}
		// }
		// console.log(accumulator+"");
		// sum
		// for(var i=0; i<neighbors.length; ++i){
		// 	var neighbor = neighbors[i];
		// 	if(neighbor!=nodeB){
		// 		accumulator = nodeA.marginalize(neighbor,accumulator);
		// 	}
		// }
		if(doLog){
			console.log(outStates+" <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<, out ");
		}
		FactorGraph.normalizedArray(outStates);
		return outStates;
	} // end else
	
}
FactorGraph._operationMaxProduct = function(nodeA,nodeB){
	throw "_operationMAP";
}

FactorGraph.prototype.junctionTree = function(){ // reduce graph to connected cliques to speed up message passing
	// ..
	throw "make junction tree ?"
}

FactorGraph.prototype.messages = function(){
	// ..
}
// FactorGraph.prototype.makeMessage = function(nodeFrom,nodeTo){
// 	var graph = this;
// 	var message = null;
// 	if(Code.isa(nodeFrom,FactorGraph.VariableNode)){ // v -> f

// 	}else{ // f -> v
// 		// ...
// 	}
// 	// var message = nodeFrom.makeMessage(nodeTo);
// 	return message;
// }
FactorGraph.prototype.getMessage = function(nodeFrom,nodeTo){
	var index = FactorGraph.directionPairIDFromIDs(nodeFrom.id(),nodeTo.id());
	var message = this._messages[index];
	return message;
}
FactorGraph.prototype.setMessage = function(nodeFrom,nodeTo, message){
	var index = FactorGraph.directionPairIDFromIDs(nodeFrom.id(),nodeTo.id());
	this._messages[index] = message;
}

FactorGraph.prototype.x = function(){
	// ..
}

FactorGraph.prototype.toString = function(){
	return "[FG]";
}



FactorGraph._NodeID = 0;

FactorGraph.VariableNode = function(states,data,observations){
	states = Code.valueOrDefault(states,2); // default binary
	this._id = FactorGraph._NodeID++;
	this._data = null;
	this._states = states;
	this._marginals = Code.newArrayZeros(this._states); // belief / probabilities for each state
	this.data(data);
	this._factors = [];
	// initial potentials - equal-probable ?
	this._initialBelief = null; // Code.newArrayOnes(states); // initial belief / prior 
	this._observed = false;
	this.observe(observations);
}
FactorGraph.VariableNode.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
FactorGraph.VariableNode.prototype.data = function(data){
	if(data!==undefined){
		this._data = data;
	}
	return this._data;
}
FactorGraph.VariableNode.prototype.states = function(){
	return this._states;
}
// FactorGraph.VariableNode.prototype.marginals = function(){ // is marginal same as belief ?
// 	return this._marginals;
// }
FactorGraph.VariableNode.prototype.belief = function(graph){ // multiply all incoming messages 
	if(graph){ // calculate
		// console.log("calculate belief");
		var nodeA = this;
var doLog = false;
// if(nodeA.data()=="A"){
// if(nodeA.data()=="J"){
// 	doLog = true;
// }
		accumulator = nodeA.initialBelief();
		accumulator = Code.copyArray(accumulator);
if(doLog){
	console.log("belief: "+nodeA.data()+" @ "+accumulator);
}
		if(!nodeA.isObserved()){
			var neighbors = nodeA.factors();
// if(doLog){
// 	console.log(neighbors);
// }
			for(var i=0; i<neighbors.length; ++i){
				var neighbor = neighbors[i];
				var message = graph.getMessage(neighbor,nodeA);
if(doLog){
	console.log("    m: "+neighbor.data()+"->"+nodeA.data()+" = "+message);
}
				for(var s=0; s<accumulator.length; ++s){
					accumulator[s] *= message[s];
				}
			}
		}
if(doLog){
	console.log("     "+accumulator+" ??? ");
}		
		FactorGraph.normalizedArray(accumulator);
if(doLog){
	console.log("     "+accumulator+" ============= ");
}
		this._marginals = accumulator;
	}
	return this._marginals;
}
FactorGraph.VariableNode.prototype.initialBelief = function(){
	return this._initialBelief;
}
FactorGraph.VariableNode.prototype.observe = function(value){
	var states = this._states;
	if(value===null || value===undefined){
// console.log("no observations");
		this._observed = false;
		this._initialBelief = Code.newArrayOnes(states);
	}else if(Code.isArray(value)){
// console.log("array observation: "+value);
		this._observed = true;
		this._initialBelief = value;
	}else{ // index
// console.log("single state observation: "+value);
		this._observed = true;
		this._initialBelief = Code.newArrayZeros(states);
		this._initialBelief[value] = 1.0;
	}
	return this.isObserved();
}
FactorGraph.VariableNode.prototype.isObserved = function(){
	return this._observed;
}
FactorGraph.VariableNode.prototype.addFactor = function(f){
	return this._factors.push(f);
}
FactorGraph.VariableNode.prototype.factors = function(){
	return this._factors;
}
FactorGraph.VariableNode.prototype.neighbors = function(exclude){
	exclude = Code.valueOrDefault(exclude,null);
	var nodes = this._factors;
	if(!exclude){
		return nodes;
	} // else pre-filter
	var neighbors = [];
	for(var i=0; i<nodes.length;++i){
		var node = nodes[i];
		if(node!=exclude){
			neighbors.push(node);
		}
	}
	return neighbors;
}


FactorGraph.FactorNode = function(variables, potentials, data){ // potentials, factors, table, probabilities, ...
	this._id = FactorGraph._NodeID++;
	this._variables = variables;
	this._potentials = potentials;
	var hash = {};
	for(var i=0; i<variables.length; ++i){
		var variable = variables[i];
		variable.addFactor(this);
		hash[variable.id()] = i;
	}
	this._variableIDToIndex = hash;
	this._data = null;
	this.data(data);
}
FactorGraph.FactorNode.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
FactorGraph.FactorNode.prototype.data = function(data){
	if(data!==undefined){
		this._data = data;
	}
	return this._data;
}
FactorGraph.FactorNode.prototype.potentials = function(){
	return this._potentials;
}
FactorGraph.FactorNode.prototype.variables = function(){
	return this._variables;
}
FactorGraph.FactorNode.prototype.variableToIndex = function(variable){
	return this._variableIDToIndex[variable.id()];
}
FactorGraph.FactorNode.prototype.neighbors = function(exclude){
	exclude = Code.valueOrDefault(exclude,null);
	var nodes = this._variables;
	if(!exclude){
		return nodes;
	} // else pre-filter
	var neighbors = [];
	for(var i=0; i<nodes.length;++i){
		var node = nodes[i];
		if(node!=exclude){
			neighbors.push(node);
		}
	}
	return neighbors;
}
FactorGraph.FactorNode.prototype.marginalize = function(variableNode, accumulator, normalize){ // remove non-interested node values
// go thru table and sum all of the same states into single vector with only states/values of variableNode

// ..

if(normalize){
	// to percents
}

// new_dims = tuple(d for d in self.dim if d not in dims)
// return Discrete(pmf, *new_dims)
}
FactorGraph.FactorNode.prototype.printTable = function(useData){
	useData = Code.valueOrDefault(useData,true);
	var spacingVar = 7;
	var str = "";
	var counts = [];
	var variables = this._variables;
	var potentials = this._potentials;
	var variableCount = variables.length;
	for(var i=0; i<variableCount; ++i){
		counts.push( variables[i].states() );
		var name = null;
		if(useData){
			name = ""+variables[i].data();
		}else{
			name = ""+i;
		}
		var s = Code.padStringCenter(name, spacingVar);
		str = str + s + " | ";
	}
	var name = null;
		if(useData){
			name = ""+this.data();
		}else{
			name = "f";
		}
	str = str + Code.padStringCenter(name, spacingVar);
	var lineLength = str.length;
	var s = Code.padString("",lineLength,"-");
	str = str + "\n" + s + "\n";
	
	// 
	var states = Code.newArrayZeros(variableCount);
	for(var i=0; i<potentials.length; ++i){
		var value = potentials[i];
		var line = "";
		for(var v=0; v<variableCount; ++v){
			var val = states[v];
			var s = Code.padStringCenter(""+val, spacingVar);
			line = line + s + " | ";
		}
		// increment state
		for(var s=variableCount-1; s>=0; --s){
			var state = states[s];
			var count = counts[s];
			state += 1;
			if(state>=count){
				states[s] = 0; // proceed to incrementing next level
			}else{
				states[s] = state;
				break; // done at this level
			}
		}

		// line
		var s = Code.padStringCenter(""+Code.clipStringToMaxChars(value,spacingVar), spacingVar);
		line = line + s;
		str = str + line + "\n";
	}
	console.log(str);
	return str;
}










