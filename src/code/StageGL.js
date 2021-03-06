// StageGL.js
StageGL.EVENT_ON_ENTER_FRAME="staentfrm";
StageGL.EVENT_ON_EXIT_FRAME="staextfrm";
StageGL.VIEWPORT_MODE_FULL_SIZE="full";
StageGL.VIEWPORT_MODE_FULL_CENTER="center";

function StageGL(can, fr, vertexShaders, fragmentShaders){
	StageGL._.constructor.call(this);
	this._timer = new Ticker(fr);
	this._dateTime = Code.getTimeMilliseconds();
	this._time = 0;
	this._countTime = 0;
	this._programs = [];
	this.canvas(can);
	for(var i=0; i<vertexShaders.length; ++i){
		this.appendProgram( vertexShaders[i], fragmentShaders[i]);
	}
	this.selectProgram(0);
    //  matrices
	this._projectionMatrix = mat4.create();
	this._modelViewMatrixStack = new MatrixStackGL();
	// view settings
	this.frustrumAngle(45);
	this.distanceNear(0.01);
	this.distanceFar(100.0);
	this.addListeners();
}
Code.inheritClass(StageGL,Dispatchable);
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
StageGL.prototype.program = function(i){
	return this._programs[i];
}
StageGL.prototype.selectProgram = function(i){
	this._canvas.program( this._programs[i] );
}
StageGL.prototype.appendProgram = function(vertexShader, fragmentShader){
	if(vertexShader && fragmentShader){
		this._programs[this._programs.length] = this._canvas.newProgram(vertexShader, fragmentShader);
	}
}
// ------------------------------------------------------------------------------------------------------------------------ CANVAS PASSTHROUGH
StageGL.prototype.canvas = function(canvas){
	if(canvas!==undefined){
		this._canvas = canvas;
	}
	return this._canvas;
}
StageGL.prototype.getBufferFloat32Array = function(list, itemSize){
	var buffer = this._canvas.getBufferFloat32Array(list,itemSize);
	buffer.length = list.length/itemSize;
	buffer.sizeX = itemSize;
	return buffer;
}
StageGL.prototype.getBufferUint16ArrayElement = function(list, itemSize){
	var buffer = this._canvas.getBufferUint16ArrayElement(list,itemSize);
	buffer.length = list.length/itemSize;
	buffer.sizeX = itemSize;
	return buffer;
}

StageGL.prototype.setBackgroundColor = function(r,g,b,a){
	if(arguments.length==1){
		a = Code.getFloatARGB(r);
		r = a[1]; g = a[2]; b = a[3]; a = a[0];
	}
    return this._canvas.setBackgroundColor(r,g,b,a);
}
StageGL.prototype.enableDepthTest = function(){
	return this._canvas.enableDepthTest();
}
StageGL.prototype.enableCulling = function(){
	return this._canvas.enableCulling();
}
StageGL.prototype.disableCulling = function(){
	return this._canvas.disableCulling();
}
StageGL.prototype.enableVertexAttribute = function(attrib){
	return this._canvas.enableVertexAttribute(attrib);
}

StageGL.prototype.setViewport = function(mode,a,b,c,d){
	var xPos=0, yPos=0, wid = this._canvas.width(), hei = this._canvas.height(); // default
	if(mode==StageGL.VIEWPORT_MODE_FULL_CENTER){
		// center via a,b,c,d in percentages
	}
	return this._canvas.setViewport(xPos,yPos,wid,hei);
}
StageGL.prototype.frustrumAngle = function(a){
	if(a!==undefined){
		this._frustrumAngle = a;
	}
	return this._frustrumAngle;
}
StageGL.prototype.distanceNear = function(d){
	if(d!==undefined){
		this._distanceNear = d;
	}
	return this._distanceNear;
}
StageGL.prototype.distanceFar = function(d){
	if(d!==undefined){
		this._distanceFar = d;
	}
	return this._distanceFar;
}
StageGL.prototype.clear = function(){
	this._canvas.clearViewport();
	var angle = this._frustrumAngle;
	var ratio = this._canvas.width()/this._canvas.height();
	var cutClose = this._distanceNear;
	var cutFar = this._distanceFar;
	this.setPerspective(angle,ratio, cutClose,cutFar, this._projectionMatrix);
	this.matrixReset();
}
StageGL.prototype.setPerspective = function(angle, ratio, cutClose, cutFar, matrix){
	mat4.perspective(angle, ratio, cutClose, cutFar, matrix);
}
StageGL.prototype.matrixPush = function(){
	this._modelViewMatrixStack.push();
}
StageGL.prototype.matrixPop = function(){
	this._modelViewMatrixStack.pop();
}
StageGL.prototype.matrixIdentity = function(){
	mat4.identity(this._modelViewMatrixStack.matrix());
}
StageGL.prototype.matrixTranslate = function(x,y,z){
	mat4.translate(this._modelViewMatrixStack.matrix(), [x,y,z]);
}
StageGL.prototype.matrixRotate = function(theta, x,y,z){
	mat4.rotate(this._modelViewMatrixStack.matrix(), theta, [x,y,z]);
}
StageGL.prototype.matrixScale = function(x,y,z){
	mat4.scale(this._modelViewMatrixStack.matrix(),[x,y,z]);
}
StageGL.prototype.matrixMultM3D = function(m){
	mat4.postMultM3D(this._modelViewMatrixStack.matrix(),m);
}
StageGL.prototype.matrixMultM3DPre = function(m){
	mat4.preMultM3D(this._modelViewMatrixStack.matrix(),m);
}
StageGL.prototype.matrixSetFromMatrix3D = function(matrix3D){
	this._modelViewMatrixStack.fromArray( matrix3D.toArray() );
}
StageGL.prototype.getMatrixAsArray = function(){
	return this._modelViewMatrixStack.toArray();
}
StageGL.prototype.bindArrayFloatBuffer = function(attr,buffer){
	this._canvas.bindArrayFloatBuffer(attr,buffer,buffer.sizeX);
}
StageGL.prototype.bindElementArrayBuffer = function(attr,buffer){
	// ??
	this._canvas.bindElementArrayBuffer(attr,buffer,buffer.sizeX);
}
StageGL.prototype.drawElementArrayUint16Buffer = function(buffer){
	this._canvas.drawElementArrayUint16Buffer(buffer, buffer.length);
}
StageGL.prototype.setLineWidth = function(width){
	this._canvas.setLineWidth(width);
}
StageGL.prototype.drawPoints = function(attr,buffer){
	if(buffer.length>0){
		this._canvas.drawPoints(buffer.length);
	}
}
StageGL.prototype.drawLines = function(attr,buffer){
	if(buffer.length>0){
		this._canvas.drawLines(buffer.length);
	}
}
StageGL.prototype.drawLineList = function(attr,buffer){
	if(buffer.length>0){
		this._canvas.drawLineList(buffer.length);
	}
}
StageGL.prototype.drawTriangles = function(attr,buffer){
	if(buffer.length>0){
		this._canvas.drawTriangles(buffer.length);
	}
}
StageGL.prototype.drawTriangleList = function(attr,buffer){
	if(buffer.length>0){
		this._canvas.drawTriangleList(buffer.length);
	}
}
StageGL.prototype.matrixReset = function(){
	this._canvas.uniformMatrices(this._projectionMatrix, this._modelViewMatrixStack.matrix());
}
// ------------------------------------------------------------------------------------------------------------------------ RENDERING
StageGL.prototype.render = function(){
	++this._countTime;
	var newDateTime = Code.getTimeMilliseconds();
	var deltaTime = newDateTime - this._dateTime;
	this._dateTime = newDateTime;
	this._time += deltaTime
	//this._canvas.clear();
	this.alertAll(Stage.EVENT_ON_ENTER_FRAME,this._countTime, this._time);
	//this._root.render(this._canvas);
	this.alertAll(Stage.EVENT_ON_EXIT_FRAME,this._countTime, this._time);
}
// ------------------------------------------------------------------------------------------------------------------------ EVENTS
StageGL.prototype.start = function(){
	this._timer.start();
}
StageGL.prototype.stop = function(){
	this._timer.stop();
}
StageGL.prototype.isRunning = function(){
	return this._timer.isRunning();
}
StageGL.prototype._enterFrame = function(e){
	++this._time;
	this.render();
}
// ------------------------------------------------------------------------------------------------------------------------ LISTENERS
StageGL.prototype.addListeners = function(){
	this._timer.addFunction(Ticker.EVENT_TICK,this._enterFrame,this);
 	this._canvas.addListeners();
// 	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this._stageResized,this);
// 	this._canvas.addFunction(Canvas.EVENT_MOUSE_DOWN,this._canvasMouseDown,this);
// 	this._canvas.addFunction(Canvas.EVENT_MOUSE_UP,this._canvasMouseUp,this);
// 	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._canvasMouseClick,this);
// 	this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this._canvasMouseMove,this);
}
StageGL.prototype.removeListeners = function(){
	this._timer.removeFunction(Ticker.EVENT_TICK,this._enterFrame,this);
 	this._canvas.removeListeners();
// 	this._canvas.removeFunction(Canvas.EVENT_WINDOW_RESIZE,this._stageResized,this);
// 	this._canvas.removeFunction(Canvas.EVENT_MOUSE_DOWN,this._canvasMouseDown,this);
// 	this._canvas.removeFunction(Canvas.EVENT_MOUSE_UP,this._canvasMouseUp,this);
// 	this._canvas.removeFunction(Canvas.EVENT_MOUSE_CLICK,this._canvasMouseClick,this);
// 	this._canvas.removeFunction(Canvas.EVENT_MOUSE_MOVE,this._canvasMouseMove,this);
}
// ------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------------------------
