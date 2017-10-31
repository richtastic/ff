// NeuralNetwork.js

function NeuralNetwork(config){
	this._layers = [];
	this.configuration(config);
}
NeuralNetwork.prototype.configuration = function(config){
	if(config!==undefined){
		var layerInfo = config["layers"];
			var layerLength = layerInfo.length;
		var layers = [];
		var i, j, k, prev;
		for(i=0; i<layerLength; ++i){ // minimum of 2 'weight' layers : in =w0=> out
			var count = layerInfo[i];
			var neurons = [];
			for(j=0; j<count; ++j){
				neurons[j] = new NeuralNetwork.Neuron();
			}
			layers[i] = neurons;
			// connect backwards
			if(i>0){
				prev = layers[i-1];
				var lenCurr = neurons.length;
				for(j=0; j<lenCurr; ++j){
					a = neurons[j];
					a.addNeurons(prev);
				}
			}
		}
		this._layers = layers;
		console.log(layers);
	}
	return null;
}
NeuralNetwork.prototype.init = function(){
	var range = 1.0;
	var halfRange = 0.5*range;
	var layers = this._layers;
	var i, j, k, neuron, connections;
	for(i=1; i<layers.length; ++i){
		var layer = layers[i];
		var prevLength = layers[i-1].length;
		for(j=0; j<layer.length; ++j){
			neuron = layer[j];
			var weights = [];
			for(k=0; k<prevLength; ++k){
				weights[k] = Math.random()*range - halfRange;
			}
			neuron.connectionWeights(weights);
		}
	}
}
// NeuralNetwork.prototype.example = function(inputVector, outputVector){
// }
NeuralNetwork.prototype._setInput = function(inputVector){
	var i, neuron;
	var layer = this._layers[0];
	for(i=0; i<layer.length; ++i){
		neuron = layer[i];
		neuron.output(inputVector[i]);
	}
}
NeuralNetwork.prototype._getOutput = function(inputVector){
	var i, neuron;
	var layer = this._layers[this._layers.length-1];
	var output = [];
	for(i=0; i<layer.length; ++i){
		neuron = layer[i];
		output[i] = neuron.output();
	}
	return output;
}
NeuralNetwork.prototype._cascadeOutputs = function(){
	var i, j, layer, neuron;
	var layers = this._layers;
	for(i=1; i<layers.length; ++i){ // input layer should already be set
		layer = layers[i];
		for(j=0; j<layer.length; ++j){
			neuron = layer[j];
			neuron.forwardProcess();
		}
	}
}
NeuralNetwork.prototype.learn = function(inputVectors, outputVectors, loopCount, loopCompleteFxn){
	var i, j, k, layers = this._layers;
	var loopMaxSteps = loopCount? loopCount : 10;
	var reporting = 1;
	//var loopMinError = 0.1 * outputVector.length;
	var loopMinError = 0.1;
	var minTotalError = null;
	for(i=0; i<loopMaxSteps; ++i){
		if(i%reporting==0){
			console.log("loop: "+i);
		}
		for(j=0; j<inputVectors.length; ++j){
			//console.log("      "+j);

			var inputVector = inputVectors[j];
			var outputVector = outputVectors[j];
			// forward
			this._setInput(inputVector);
			this._cascadeOutputs();
			// forward
			var output = this._getOutput();
			/*
			var totalError = 0;
			for(k=0; k<output.length; ++k){
				error = Math.pow(output[k]-outputVector[k],2) * 0.5;
				totalError += error;
			}
			*/
			// classification distance
			// var distance = null;
			// var idx = null;
			// for(i=0; i<?; ++i){
			// 	var dist = Math.abs(?-output[i]);
			// 	if(distance==null || dist<distance){
			// 		distance = dist;
			// 		idx = i;
			// 	}
			// }
			//
			// backward -- WHEN CORRECT ONLY?
			this._backward(outputVector);

			/*
			// save best
			if(minTotalError==null || totalError<minTotalError){
				minTotalError = totalError;
				var layers = this._layers;
				var ii, jj, kk;
				for(ii=1; ii<layers.length; ++ii){ // input layer should already be set
					var layer = layers[ii];
					for(jj=0; jj<layer.length; ++jj){
						var neuron = layer[jj];
						var connections = neuron.connections();
						for(kk=0; kk<connections.length; ++kk){
							var connection = connections[kk];
							connection.weightBest(connection.weight());
						}
					}
				}
			}
			*/
			// console.log("backward error: "+error);
			// console.log(j+" VECTOR")
		}
		if(loopCompleteFxn){
			loopCompleteFxn(this);
		}
	}
	return minTotalError;
}

NeuralNetwork.prototype.predict = function(inputVector){
	this._setInput(inputVector);
	this._cascadeOutputs();
	var output = this._getOutput();
	return output;
}

NeuralNetwork.prototype._forward = function(next, prev, weight){
	var i, j;
	var temp = Code.newArrayZeros(next.length);
	for(i=0; i<next.length; ++i){
		for(j=0; j<prev.length; ++j){
			temp[i] += prev[j] * weight[j];
		}
	}
	Code.copyArray(next, temp);
	return next;
}

NeuralNetwork.prototype._backward = function(outputVector){
var learningRate = 0.1;
var momentum = 0.7;
	var i, j, neuron, layer;
	var layers = this._layers;
	// output layer
	outputLayer = layers[layers.length-1];
	layer = outputLayer;
	for(i=0; i<layer.length; ++i){ // init backwards
		var outputReal = outputVector[i];
		neuron = layer[i];
		var outputNeuron = neuron.output();
		var connections = neuron.connections();
		for(j=0; j<connections.length; ++j){
			var connection = connections[j];
			var outputPrev = connection.opposite(neuron).output();
			//console.log(outputPrev);
			var derivative = (outputReal - outputNeuron) * outputNeuron * (1.0 - outputNeuron);
			//console.log("derivative: "+derivative);
			var deltaWeight = learningRate * derivative * outputPrev;
			var newWeight = connection.weight() + deltaWeight;
			var nextWeight = newWeight + momentum*connection.weightDeltaPrev();
			//var newConnDelta = connection.weight() + deltaWeight;
			connection.weightDelta(deltaWeight);
			connection.weight(nextWeight);
		}
	}
	//console.log("others");
	var prevDerivatives = null;
	var lastHiddenLayerIndex = layers.length-2;
	for(i=lastHiddenLayerIndex; i>0; --i){ // init backwards
		layer = layers[i];
		var nextDerivatives = [];//Code.newArrayZeros(layer.length);
		for(j=0; j<layer.length; ++j){
			//console.log(prevDerivatives)
			neuron = layer[j];
			var neuronOutput = neuron.output();
			//console.log(j+": neuronOutput :"+neuronOutput);
			var sumOutput = 0;
			if(i==lastHiddenLayerIndex){
				//console.log("last");
				for(k=0; k<outputLayer.length; ++k){

					var n = outputLayer[k];
					var conn = n.connection(neuron);
					var wjk = conn.weight();
					var dy = outputVector[k];
					var yk = n.output();
					//console.log(wjk+" | "+dy+" | "+yk);
					sumOutput += (dy-yk)*yk*(1-yk)*wjk;
					if(Code.isNaN(sumOutput)){
						throw "sumOutput"
					}
				}
			}else{
				//console.log("not last");
				var nextLayer = layers[i+1];
				for(k=0; k<nextLayer.length; ++k){
					var n = nextLayer[k];
					var wjk = n.connection(neuron).weight();
					//console.log(k+": "+wjk+" @ "+prevDerivatives[k])
					sumOutput += (prevDerivatives?prevDerivatives[k]:0)*wjk;
				}
				if(Code.isNaN(sumOutput)){
					throw "sumOutput"
				}
			}
			var derivative = neuronOutput*(1-neuronOutput)*sumOutput;
//			console.log(j+": "+derivative);
			nextDerivatives[j] = derivative;
			
			var connections = neuron.connections();
			for(k=0; k<connections.length; ++k){
				var connection = connections[k];
				var prevOutput = connection.opposite(neuron).output();
				//console.log(k+": "+prevOutput);
				var deltaWeight = learningRate * derivative * prevOutput;
				//console.log(k+": "+derivative);
				var newWeight = connection.weight() + deltaWeight;
				var nextWeight = newWeight + momentum * connection.weightDeltaPrev();
				//console.log(k+": "+connection.weight()+" ? "+connection.weightDeltaPrev());
				if(Code.isNaN(newWeight)){
					throw "newWeight: "+newWeight
				}
				if(Code.isNaN(nextWeight)){
					throw "nextWeight"
				}
				connection.weightDelta(deltaWeight);
				connection.weight(nextWeight);
			}
		}
		prevDerivatives = nextDerivatives;
		nextDerivatives = [];
	}
}
NeuralNetwork.prototype.toString = function(){
	console.log("toString")
	var maxSize = 0;
	var i, j;
	var layer, neuron, value, isNeg, offset;
	var layers = this._layers;
	var str = "NeuralNetwork: ["+this._layers.length+"] |";
	for(i=0; i<layers.length; ++i){
		layer = layers[i];
		maxSize = Math.max(maxSize,layer.length);
		var str = str + " "+layer.length;
	}
	
	var lines = Code.newArray(maxSize);
	var line;
	for(j=0; j<maxSize; ++j){
		lines[j] = "";
	}
	var spaceBlank = "           ";
	for(i=0; i<layers.length; ++i){
		layer = layers[i];
		line = lines[i];
		offset = Math.round((maxSize-1-layer.length)*0.5);
		offset = Math.max(0,offset);
		for(j=0; j<offset; ++j){
			lines[j] = lines[j] + spaceBlank; // 8 empty
		}
		for(j=0; j<layer.length; ++j){
			neuron = layer[j];
			value = neuron.output();
			isNeg = value < 0;
			value = Code.centerpendFixed((isNeg?"-":"+")+""+(Math.abs(value).toExponential(5))," ",10);
			lines[j+offset] = lines[j+offset] + value;
		}
		for(j+=offset;j<=maxSize; ++j){
			lines[j] = lines[j] + spaceBlank; // 8 empty
		}
	}
	str = str + "\n";
	for(j=0; j<maxSize; ++j){
		str = str + Code.postpendFixed(" "+j+":"," ",6) + lines[j] + "\n";
	}
	str = str + "\n";
	return str;
}

// NeuralNetwork.prototype._updateError = function(deltas){
// 	var i, j, layer, delta;
// 	var layers = this._layers;
// 	for(i=0; i<layers.length; ++i){
// 		layer = layers[i];
// 		console.log("ERROR: LAYER "+layer.length);
// 		delta = deltas[i];
// 		console.log("ERROR: DELTA "+delta.length);
// 		for(j=0; j<deltas.length; ++i){
// 			layer[j] = layer[j] - delta[j];
// 		}
// 	}
// }

// NeuralNetwork.prototype.process = function(inputs){
// 	// go thru each layer and produce output
// 	var i, j;
// 	var layers = this._layers;
// 	for(i=0; i<layers.length; ++i){
// 		// ?
// 	}
// 	var outputs = Code.copyArray([]);
// 	return outputs;
// }

// NeuralNetwork.prototype._forwardFxn = function(vector){
// 	for(var i=0; i<vector.length; ++i){
// 		vector[i] = NeuralNetwork._sigmoid(vector[i]);
// 	}
// 	return vector;
// }
// NeuralNetwork.prototype._backwardFxn = function(vector){
// 	for(var i=0; i<vector.length; ++i){
// 		//vector[i] = NeuralNetwork._sigmoidGradient(vector[i]);
// 		vector[i] = vector[i] * (1.0 - vector[i]);
// 	}
// 	return vector;
// }
NeuralNetwork._sigmoid = function(v){
	return 1.0 / (1.0 + Math.exp(-v));
}
NeuralNetwork._sigmoidGradient = function(v){
	return NeuralNetwork.sigmoid(v)*(1.0-NeuralNetwork.sigmoid(v));
}


// connections:
NeuralNetwork.Connection = function(a,b, w){
	this._id = NeuralNetwork.Connection._id++;
	this._counter = 0;
	this._a = null;
	this._b = null;
	this._weight = null;
	this._weightBest = null;
	this._weightDelta = 0;
	this._weightDeltaPrev = 0;
	this.a(a);
	this.b(b);
	this.weight(w);
}
NeuralNetwork.Connection._id = 0;
NeuralNetwork.Connection.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
NeuralNetwork.Connection.prototype.weight = function(w){
	if(w!==undefined){
		this._weight = w;
	}
	return this._weight;
}
NeuralNetwork.Connection.prototype.weightBest = function(w){
	if(w!==undefined){
		this._weightBest = w;
	}
	return this._weightBest;
}
NeuralNetwork.Connection.prototype.weightDelta = function(w){
	if(w!==undefined){
		this._weightDelta = w;
	}
	return this._weightDelta;
}
NeuralNetwork.Connection.prototype.weightDeltaPrev = function(w){
	if(w!==undefined){
		this._weightDeltaPrev = w;
	}
	return this._weightDeltaPrev;
}
NeuralNetwork.Connection.prototype.a = function(a){
	if(a!==undefined){
		this._a = a;
	}
	return this._a;
}
NeuralNetwork.Connection.prototype.b = function(b){
	if(b!==undefined){
		this._b = b;
	}
	return this._b;
}
NeuralNetwork.Connection.prototype.opposite = function(n){
	if(this._a==n){
		return this._b;
	}else if(this._b==n){
		return this._a;
	}
	return null;
}
// neurons:
NeuralNetwork.Neuron = function(){
	this._id = NeuralNetwork.Neuron._id++;
	this._output = null;
	this._counter = 0;
	this._connectionsHash = {};
	this._connections = [];
}
NeuralNetwork.Neuron._id = 0;
NeuralNetwork.Neuron.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
NeuralNetwork.Neuron.prototype.addNeurons = function(neurons){
	if(neurons!==undefined){
		var i, neuron;
		for(i=0; i<neurons.length; ++i){
			neuron = neurons[i];
			connection = new NeuralNetwork.Connection(neuron,this);
			this._connectionsHash[""+neuron.id()] = connection;
			this._connections.push(connection);
		}
	}
	return neurons;
}
NeuralNetwork.Neuron.prototype.connection = function(neuron){
	var connection = null;
	// console.log(this.id()+" => "+neuron.id());
	// console.log(this._connectionsHash)
	//console.log(this._connectionsHash.keys().length)
	if(neuron!==undefined){
		if(Code.isNumber(neuron)){
			connection = this._connectionsHash[neuron+""];
			// console.log("in b");
		}else{
			connection = this._connectionsHash[neuron.id()+""];
			// console.log("in c");
			// console.log(connection);
		}
	}
	return connection;
}
NeuralNetwork.Neuron.prototype.connections = function(){
	return this._connections;
}
NeuralNetwork.Neuron.prototype.connectionWeights = function(weights){
	var connections = this._connections;
	var i, connection;
	// var keys = Code.keys(connections);
	// for(i=0; i<keys.length; ++i){
	// 	key = keys[i];
	for(i=0; i<connections.length; ++i){
		//console.log(i+" : "+weights[i]);
		connection = connections[i];
		connection.weight(weights[i]);
	}
}
NeuralNetwork.Neuron.prototype.forwardProcess = function(){
	var connections = this._connections;
	var i, neuron, weight, connection, source, key, value = 0;
	// var keys = Code.keys(connections);
	// for(i=0; i<keys.length; ++i){
	// 	key = keys[i];
	//	connection = connections[key];
	for(i=0; i<connections.length; ++i){
		connection = connections[i];
		weight = connection.weight();
		neuron = connection.opposite(this);
		source = neuron.output();
		value += weight * source;
	}
	this._output = NeuralNetwork._sigmoid(value);
	return this.output();
}
NeuralNetwork.Neuron.prototype.output = function(o){
	if(o!==undefined){
		this._output = o;
	}
	return this._output;
}
NeuralNetwork.Neuron.prototype.toString = function(){
	var str = "[N:"+this._id+"]";
	return str;
}








