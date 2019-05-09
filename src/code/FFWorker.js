// FFWorker.js
FFWorker.FILENAMES = ['Code.js'];
FFWorker.EVENT_MESSAGE_FROM = "message";
function FFWorker(homeDirectory, context){
	this._context = context;

	var list = FFWorker.FILENAMES;
	for(i=0;i<list.length;++i){
		importScripts(homeDirectory+list[i]);
	}
	var self = this;
	var fxn = function(e){
		self.handledMessageFrom(e);
	};
	this._context.addEventListener(FFWorker.EVENT_MESSAGE_FROM, fxn, false);
}

FFWorker.prototype.passMessageTo = function(message){
	this._context.postMessage(message);
}
FFWorker.prototype.handledMessageFrom = function(e){
	this.passMessageTo(e.data);
}
FFWorker.prototype.finish = function(e){
	console.log("CLOSE");
	this._context.close();
}
FFWorker.prototype.kill = function(e){
	if(this._context){
		this.close();
		this._context = null;
	}
}


// ...
