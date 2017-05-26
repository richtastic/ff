// NeuralNetwork.js

function NeuralNetwork(config){
	// this._inputSize = 0;
	// this._outputSize = 0;
	this._layers = [];
	this.configuration(config);
}
NeuralNetwork.prototype.configuration = function(config){
	if(config!==undefined){
		var layerInfo = config["layers"];
			var layerLength = layerInfo.length;
		var layers = [];
		var i, len=layerLength;
		var lm1 = len-1;
		// this._inputSize = layerInfo[0];
		// this._outputSize = layerInfo[layerInfo.length-1];
		//for(i=1; i<lm1; ++i){
		for(i=1; i<len; ++i){ // minimum of 2 'weight' layers : in =w0=> out
			var count = layerInfo[i];
			layers.push( Code.newArrayZeros(count) );
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
	var i, j;
	for(j=0; j<layers.length; ++j){
		var layer = layers[j];
		for(i=0; i<layer.length; ++i){
			layer[i] = Math.random()*range - halfRange;
		}
	}
}
// NeuralNetwork.prototype.example = function(inputVector, outputVector){
// }

NeuralNetwork.prototype.learn = function(inputVector, outputVector){
	var i, j, layers = this._layers;
	// 
	var working = Code.copyArray(inputVector);
	var workings = []; // a
		workings.push( Code.copyArray(working) );
	// forward propagation
	for(i=0; i<layers.length; ++i){
		working.splice(0,0, 1.0);
		layer = layers[i];
		var temp = Code.newArrayZeros(layer.length);
		this._forward(temp, working, layer);
		this._forwardFxn(temp);
		working = temp;
		workings.push( Code.copyArray(working) );
	}
	console.log("FWD: workings: ",workings);
	var error = this._backward(outputVector, workings);


	//Matrix.lmMinimize( fxn, args, yVals.length, xVals.length, xVals, yVals, maxIterations, 1E-10, 1E-10, flip );
	//Matrix.lmMinimize = function(fxn,args, m, n, xInitial, yFinal, maxIterations, fTolerance, xTolerance, lambdaScaleFlip){ 

	
	return false;
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

NeuralNetwork.prototype._backward = function(outputVector, results){
	var i, j, layer;
	var layers = this._layers;
	var predicted = results[results.length-1];
	var deltas = [];
	var delta = Code.newArrayZeros(outputVector.length);
	for(i=0; i<delta.length; ++i){
		delta[i] = predicted[i] - outputVector[i];
	}
	deltas.shift( Code.copyArray(delta) );
	for(i=results.length-1; i>=1; --i){
		console.log("i: "+i);
		layer = layers[i-1];
		var z = results[i];
		var gz = this._backwardFxn(z);
		// console.log(layer);
		// console.log(delta);
		// console.log(gz);
		var temp = Code.newArrayZeros(results[i-1].length);
		//temp = layer * delta * gz;
			console.log(layer.length, delta.length, gz.length, "=> "+temp.length);
			temp = ImageMat.mulFloat(layer, delta);
			//temp = ImageMat.mulFloat(layer, delta);
			//temp = ImageMat.mulFloat(temp, gz);
		delta = temp;
		deltas.shift( Code.copyArray(delta) );
	}
	console.log("DELTAS: "+deltas.length);
	console.log(deltas);
	return deltas;
}

NeuralNetwork.prototype._updateError = function(deltas){
	var i, j, layer, delta;
	var layers = this._layers;
	for(i=0; i<layers.length; ++i){
		layer = layers[i];
		console.log("ERROR: LAYER "+layer.length);
		delta = deltas[i];
		console.log("ERROR: DELTA "+delta.length);
		for(j=0; j<deltas.length; ++i){
			layer[j] = layer[j] - delta[j];
		}
	}
}

NeuralNetwork.prototype.process = function(inputs){
	// go thru each layer and produce output
	var i, j;
	var layers = this._layers;
	for(i=0; i<layers.length; ++i){
		// ?
	}
	var outputs = Code.copyArray([]);
	return outputs;
}

NeuralNetwork.prototype._forwardFxn = function(vector){
	for(var i=0; i<vector.length; ++i){
		vector[i] = NeuralNetwork._sigmoid(vector[i]);
	}
	return vector;
}
NeuralNetwork.prototype._backwardFxn = function(vector){
	for(var i=0; i<vector.length; ++i){
		//vector[i] = NeuralNetwork._sigmoidGradient(vector[i]);
		vector[i] = vector[i] * (1.0 - vector[i]);
	}
	return vector;
}
NeuralNetwork._sigmoid = function(v){
	return 1.0 / (1.0 + Math.exp(-v))
}
NeuralNetwork._sigmoidGradient = function(v){
	return NeuralNetwork.sigmoid(v)*(1.0-NeuralNetwork.sigmoid(v));
}

NeuralNetwork.prototype.toString = function(){
	var str = "";
	return str;
}
