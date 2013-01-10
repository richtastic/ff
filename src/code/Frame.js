// Frame.js

function Frame(con,len){
	var self = this;
	self._length = 1;
	self._content = null;
	self.length = function(len){
		if(len!=null){
			self._length = len;
		}else{
			return self._length;
		}
	};
	self.content = function(con){
		if(arguments.length>0){
			self._content = con;
		}else{
			return self._content;
		}
	};
	self.kill = function(){
		self._length = null;
		self._content = null;
	};
	// constructor ----------------
	self.length(len);
	self.content(con);
}

