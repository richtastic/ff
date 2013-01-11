// DOContainer.js

function DOContainer(style){
	var self = this;
	self._display = new DO();
	self.display = function(){
		return self._display;
	}
}

