// MatrixStackGL.js
// requires mat4
MatrixStackGL.WTF = "wtf";
// no dependencies (loads ScriptLoader on own)
function MatrixStackGL(){
	this._working = mat4.create();
	this._stack = [];
}
MatrixStackGL.prototype.push = function(){
	var duplicate = mat4.create();
	mat4.set(this._working, duplicate);
	this._stack.push(duplicate);
}
MatrixStackGL.prototype.pop = function(){
	if(this._stack.length>0){
		this._working = this._stack.pop();
	}
}
MatrixStackGL.prototype.matrix = function(){ // direct reference
	return this._working;
}
MatrixStackGL.prototype.toArray = function(){ // mutable copy
	return mat4.toArray(this._working);
}
MatrixStackGL.prototype.fromArray = function(arr){
	return mat4.fromArray(this._working, arr);
}
MatrixStackGL.prototype.kill = function(){
	Code.emptyArray(this._stack);
	this._stack = null;
	this._working = null;
}

