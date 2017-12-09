// UndoStack.js


// --------------------------------------------------------------------------------------------------------------------
function UndoStack(){
	this._stack = [];
}
// --------------------------------------------------------------------------------------------------------------------
UndoStack.prototype.count = function(){
	return this._stack.length;
}
UndoStack.prototype.isEmpty = function(){
	return this._stack.length==0;
}
UndoStack.prototype.push = function(fxn,ctx,obj){
	this._stack.push([fxn,ctx,obj]);
}
UndoStack.prototype.pop = function(){
	if(this._stack.length>0){
		var item = this._stack.pop();
		var fxn = item[0];
		var ctx = item[1];
		var obj = item[2];
		if(fxn){
			if(ctx){
				if(obj){
					fxn.call(ctx,obj);
				}else{
					fxn.call(ctx);
				}
			}else{
				if(obj){
					fxn(obj);
				}else{
					fxn();
				}
			}
		}
	}
}
