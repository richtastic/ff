// CircuitNet.js

function CircuitNet(){
	var self = this;
	//self.nodes = new Array();
	self.elements = new Array();
	//
	self.addElement = function(o){
		Code.addUnique(self.elements,o);
	};
	self.connectElements = function(a,ai, b,bi){
		var pinA = a.pin(ai), pinB = b.pin(bi);
		var nodeA = pinA.node(), nodeB = pinB.node();
		nodeA.uniteWith(nodeB);
	};
	self.disconnectElements = function(a,ai, b,bi){ // isolate pin bi
		var pinA = a.pin(ai), pinB = b.pin(bi);
		var nodeA = pinA.node();//, nodeB = pinB.node();
		console.log( nodeA.toString() );
		var nodeB = nodeA.separateFrom(pinB);
		console.log( nodeA.toString() );
		console.log( nodeB.toString() );
	};
	self.getAllNodes = function(){
		var list = new Array();
		var ele, pin, i, j, len2, len = self.elements.length;
		for(i=0;i<len;++i){
			ele = self.elements[i];
			len2 = ele.pins.length;
			for(j=0;j<len2;++j){
				pin = ele.pins[j];
				Code.addUnique( list, pin.node() );
			}
		}
		return list;
	}
	self.setAllNodesToVoltage = function(v){
		var i, list = self.getAllNodes();
		for(i=0;i<list.length;++i){
			list[i].voltage = v;
		}
	};
	/*self.addNode = function(o){
		Code.addUnique(self.nodes,o);
	};*/ 
	self.kill = function(){
		// 
	};
};




