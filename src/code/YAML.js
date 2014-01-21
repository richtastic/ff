// YAML.js
YAML.COMMENT="#";
YAML.TAB="\t";

function YAML(){
	this._lines = new Array();
	this._lineNumber = 0;
}
YAML.prototype._parse = function(inputString){
	var output = new Object();
	// var self = this;
	// self.document_url = "data.yaml";
	// self.ajax = new Ajax();
	// self.yaml = new YAML();
	// self.blob = null;
	// this.handle_ajax_success = function(e){
	// 	console.log("SUCCESS:");
	// 	self.blob = self.yaml.parse(e);
	// 	//console.log(self.blob);
	// 	//
	// 	var repeated = { "a": 123, "b": "str", "c": "grrr" };
	// 	var obj = new Object();
	// 	var arr = new Array("item1",{},{},"item2",repeated)
	// 	obj["cat"] = 4;
	// 	obj["dog"] = "DOG!";
	// 	obj["repeated"] = repeated;
	// 	obj["subObject"] = { "bacon": "string here", "double": 1.666, "further": repeated, "array":arr, "r1":repeated, "r2":repeated, "r3":repeated };
	// 	console.log("-------------------------");
	// 	console.log(obj);
	// 	var str = self.yaml.generate(obj);
	// 	console.log(str);
	// 	console.log("+++++++++++++++++++++++++");
	// 	self.blob = self.yaml.parse(str);
	// 	console.log(self.blob);
	// }
	// this.handle_ajax_failure = function(e){
	// 	console.log("FAIL: "+e);
	// }
	// self.ajax.get(self.document_url,self.handle_ajax_success,self.handle_ajax_failure);
	return output;
}
YAML.prototype.parse = function(inputString){
	return new YAML()._parse(inputString);
}