// MessageBus.js
MessageBus.EVENT_X = "EVENT_X";

// ---------------------------------------------------------------------
function MessageBus(){
	MessageBus._.constructor.call(this);
}
Code.inheritClass(MessageBus, Dispatchable);


MessageBus._defaultBus = null;
MessageBus.defaultBus = function(){
	if(MessageBus._defaultBus===null){
		MessageBus._defaultBus = new MessageBus();
	}
	return MessageBus._defaultBus;
}

