// yaml.js

function yaml(){
	var self = this;
	// var document_url = "data.yaml";
	// var document_url = "test.yaml";
	var document_url = "long.yaml";
	var ajax = new Ajax();
	var blob = null;
	// self.ajax.get(self.document_url,self.handle_ajax_success,self.handle_ajax_failure);
	// url,con,comp,params
	ajax.get(document_url,this, this.handle_ajax_success, {});
	// this.testWrite();
}
yaml.prototype.testWrite = function(){



	var yaml = new YAML();
	yaml.writeYAML("IDGAF YAML");
	yaml.writeComment("yaml file");
	yaml.writeObjectStart("myObject");
		yaml.writeReferenceDefinition("ref0");
		yaml.writeCommentAppend("my object");
		yaml.writeString("index","value");
		yaml.writeNull("null");
		yaml.writeBoolean("bool",false);
		yaml.writeNumber("num",3.141);
		yaml.writeNumber("int",3141);
	yaml.writeObjectEnd();
	yaml.writeObjectStart("myRef");
		yaml.writeReferencePointer("ref0");
	yaml.writeObjectEnd();

	var doc = yaml.toString();

	console.log(doc);

	var obj = YAML.parse(doc);

	console.log(obj);

	// doc = YAML.parse(obj);
	
	// console.log(doc);
}
yaml.prototype.handle_ajax_success = function(data){
	console.log("SUCCESS:");
	// console.log(f);
	// console.log(e);

	console.log(data);
	// var yaml = new YAML();
	// var object = YAML.parse(data);
	var object = YAML.parse(data);
	// 
	console.log(object);

	// self.blob = self.yaml.parse(e);

	// self.yaml.parse(str);


	//console.log(self.blob);
	/*
	var repeated = { "a": 123, "b": "str", "c": "grrr" };
	var obj = new Object();
	var arr = new Array("item1",{},{},"item2",repeated)
	obj["cat"] = 4;
	obj["dog"] = "DOG!";
	obj["repeated"] = repeated;
	obj["subObject"] = { "bacon": "string here", "double": 1.666, "further": repeated, "array":arr, "r1":repeated, "r2":repeated, "r3":repeated };
	console.log("-------------------------");
	console.log(obj);
	var str = self.yaml.generate(obj);
	console.log(str);
	console.log("+++++++++++++++++++++++++");
	self.blob = self.yaml.parse(str);
	console.log(self.blob);
	*/
}
yaml.prototype.handle_ajax_failure = function(e){
	console.log("FAIL: "+e);
}