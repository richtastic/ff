// DOPin.js

function DOPin(style){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
	this._button = null;
	this._connection = null;
	this._element = null;
	this.connection = function(c){
		if(arguments.length==0){
			if(this._connection){
				this._connection.removePin(this);
			}
			this._connection = c;
			this._connection.addPin(this);
		}
		return this._connection;
	}
	this.element = function(e){
		if(arguments.length==0){
			return this._element;
		}
		this._element = e;
	}
}

