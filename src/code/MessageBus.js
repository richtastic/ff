// MessageBus.js
MessageBus.EVENT_X = "EVENT_X";

// ---------------------------------------------------------------------
function MessageBus(){
	//
}


MessageBus._defaultBus = null;
MessageBus.prototype.defaultBus = function(){
	if(MessageBus._defaultBus===null){
		MessageBus._defaultBus = new MessageBus();
	}
	return MessageBus._defaultBus;
}

