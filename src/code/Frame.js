// Frame.js

function Frame(con,len){
	var self = this;
	this.length = 1;
	this.content = con;
	if(len!=null){
		this.length = len
	}
	this.kill = function(){
		self.length = null;
		self.content = null;
	}
}

