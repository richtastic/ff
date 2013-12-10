// StageGL.js
StageGL.EVENT_ON_ENTER_FRAME="staentfrm";
StageGL.EVENT_ON_EXIT_FRAME="staextfrm";
StageGL.VIEWPORT_MODE_FULL_SIZE="full";
StageGL.VIEWPORT_MODE_FULL_CENTER="center";

function StageGL(can, fr, vertexShaders, fragmentShaders){
	StageGL._.constructor.call(this);
	this._timer = new Ticker(fr);
	this._time = 0;
	// 
	this.canvas(can);
	this._canvas.startProgram();
    this._canvas.setVertexShaders(vertexShaders);
    this._canvas.setFragmentShaders(fragmentShaders);
    this._canvas.linkProgram();
    //  matrices
	this._pMatrix = mat4.create();
	this._mvMatrix = mat4.create();
	//
	this.addListeners();
}
Code.inheritClass(StageGL,Dispatchable);
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
// ------------------------------------------------------------------------------------------------------------------------ CANVAS PASSTHROUGH
StageGL.prototype.canvas = function(canvas){
	if(canvas!==undefined){
		this._canvas = canvas;
	}
	return this._canvas;
}
StageGL.prototype.getBufferFloat32Array = function(list){
	var buffer = this._canvas.getBufferFloat32Array(list);
	buffer.length = list.length/3;
	return buffer;
}
StageGL.prototype.setBackgroundColor = function(r,g,b,a){
    return this._canvas.setBackgroundColor(r,g,b,a);
}
StageGL.prototype.enableDepthTest = function(){
	return this._canvas.enableDepthTest();
}
StageGL.prototype.setViewport = function(mode,a,b,c,d){
	var xPos=0, yPos=0, wid = this._canvas.width(), hei = this._canvas.height(); // default
	if(mode==StageGL.VIEWPORT_MODE_FULL_CENTER){
		// center via a,b,c,d in percentages
	}
	return this._canvas.setViewport(xPos,yPos,wid,hei);
}
StageGL.prototype.clear = function(){
	this._canvas.clearViewport();
	var angle = 45;
	var ratio = this._canvas.width()/this._canvas.height();
	var cutClose = 0.1;
	var cutFar = 100.0;
	this.setPerspective(angle,ratio, cutClose,cutFar, this._pMatrix);
}
StageGL.prototype.setPerspective = function(angle, ratio, cutClose, cutFar, matrix){
	mat4.perspective(angle, ratio, cutClose, cutFar, matrix);
}
StageGL.prototype.matrixIdentity = function(){
	mat4.identity(this._mvMatrix);
}
StageGL.prototype.matrixTranslate = function(x,y,z){
	mat4.translate(this._mvMatrix, [x,y,z]);
}
StageGL.prototype.drawTriangles = function(buffer){
	this._canvas.bindFloatBuffer(buffer);
	this.matrixReset();
	this._canvas.drawTriangles(buffer.length);
}
StageGL.prototype.drawTriangleList = function(buffer){
	this._canvas.bindFloatBuffer(buffer);
	this.matrixReset();
	this._canvas.drawTriangleList(buffer.length);
}
StageGL.prototype.matrixReset = function(){
	this._canvas.uniformMatrices(this._pMatrix, this._mvMatrix);
}
// ------------------------------------------------------------------------------------------------------------------------ RENDERING
StageGL.prototype.render = function(){
	//this._canvas.clear();
	this.alertAll(Stage.EVENT_ON_ENTER_FRAME,this._time);
	//this._root.render(this._canvas);
	this.alertAll(Stage.EVENT_ON_EXIT_FRAME,this._time);
}
// ------------------------------------------------------------------------------------------------------------------------ EVENTS
StageGL.prototype.start = function(){
	this._timer.start();
}
StageGL.prototype.stop = function(){
	this._timer.stop();
}
StageGL.prototype._enterFrame = function(e){
	++this._time;
	this.render();
}
// ------------------------------------------------------------------------------------------------------------------------ LISTENERS
StageGL.prototype.addListeners = function(){
	this._timer.addFunction(Ticker.EVENT_TICK,this._enterFrame,this);
// 	this._canvas.addListeners();
// 	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this._stageResized,this);
// 	this._canvas.addFunction(Canvas.EVENT_MOUSE_DOWN,this._canvasMouseDown,this);
// 	this._canvas.addFunction(Canvas.EVENT_MOUSE_UP,this._canvasMouseUp,this);
// 	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._canvasMouseClick,this);
// 	this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this._canvasMouseMove,this);
}
StageGL.prototype.removeListeners = function(){
	this._timer.removeFunction(Ticker.EVENT_TICK,this._enterFrame,this);
// 	this._canvas.removeListeners();
// 	this._canvas.removeFunction(Canvas.EVENT_WINDOW_RESIZE,this._stageResized,this);
// 	this._canvas.removeFunction(Canvas.EVENT_MOUSE_DOWN,this._canvasMouseDown,this);
// 	this._canvas.removeFunction(Canvas.EVENT_MOUSE_UP,this._canvasMouseUp,this);
// 	this._canvas.removeFunction(Canvas.EVENT_MOUSE_CLICK,this._canvasMouseClick,this);
// 	this._canvas.removeFunction(Canvas.EVENT_MOUSE_MOVE,this._canvasMouseMove,this);
}
// ------------------------------------------------------------------------------------------------------------------------ 

// ------------------------------------------------------------------------------------------------------------------------ 

