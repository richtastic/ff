// NeuralNetwork.js

function NeuralNetwork(config){
	this._layers = [];
	this.configuration(config);
}
NeuralNetwork.prototype.configuration = function(config){
	if(config!==undefined){
		var layers = [];
		var i, len=config.length;
		for(i=0; i<len; ++i){
			var count = config[i];
			layers.push( Code.newArrayZeros(count) );
		}
		this._layers = layers;
	}
	return null;
}
NeuralNetwork.prototype.learn = function(inputs, outputs){
	// random init
	// forward propagation
	// backwards propagation
	// ...
	return false;
}

NeuralNetwork.prototype.process = function(inputs){
	return null;
}

NeuralNetwork.prototype.toString = function(){
	var str = "";
	return str;
}
