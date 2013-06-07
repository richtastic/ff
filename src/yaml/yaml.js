// yaml.js

function yaml(){
	var self = this;
	self.document_url = "data.yaml";
	self.ajax = new Ajax();
	self.yaml = new YAML();
	self.blob = null;
	this.handle_ajax_success = function(e){
		console.log("SUCCESS:");
		self.blob = self.yaml.parse(e);
		console.log(self.blob);
	}
	this.handle_ajax_failure = function(e){
		console.log("FAIL: "+e);
	}
	self.ajax.get(self.document_url,self.handle_ajax_success,self.handle_ajax_failure);
}