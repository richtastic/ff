// WebEx1.js

function WebEx1(){
	var frameRate = 1000/100;
  	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FIXED,false,true);
    this._stage = new StageGL(this._canvas, frameRate, this.getVertexShaders1(), this.getFragmentShaders1());
  	this._stage.setBackgroundColor(0.0,0.0,0.0,1.0);
	this._stage.enableDepthTest();
	this.setupFxn1();
}
// ------------------------------------------------------------------------------------------------------------------------ Lesson 3 
// ------------------------------------------------------------------------------------------------------------------------ Lesson 2 
// ------------------------------------------------------------------------------------------------------------------------ Lesson 1 
WebEx1.prototype.setupFxn1 = function(e){
//this._angleTri = 0;
	this._vertexPositionAttrib = this._stage.enableVertexAttribute("aVertexPosition");
	this._vertexColorAttrib = this._stage.enableVertexAttribute("aVertexColor");
	this._triBuffer = this._stage.getBufferFloat32Array([0.0,1.0,0.0, -1.0,-1.0,0.0, 1.0,-1.0,0.0], 3);
		this._triColorBuffer = this._stage.getBufferFloat32Array([1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0], 4);
	this._squBuffer = this._stage.getBufferFloat32Array([1.0,1.0,0.0, -1.0,1.0,0.0, 1.0,-1.0,0.0, -1.0,-1.0,0.0], 3);
		this._squColorBuffer = this._stage.getBufferFloat32Array([1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0], 4);
    this._stage.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this.onEnterFrameFxn1, this);
    this._stage.start();
}
WebEx1.prototype.onEnterFrameFxn1 = function(e){
	// RESET
	this._stage.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);
	this._stage.clear();
	// TRIANGLE
	this._stage.matrixIdentity();
	this._stage.matrixTranslate(-1.5,0.0,-7.0);
//this._stage.matrixPush();
this._stage.matrixRotate(e*0.05, 0,1,0);
		this._stage.bindFloatBuffer(this._vertexColorAttrib, this._triColorBuffer);
	this._stage.drawTriangles(this._vertexPositionAttrib, this._triBuffer);
//this._stage.matrixPop();
	// SQUARE
	this._stage.matrixIdentity();
	this._stage.matrixTranslate(1.5,0.0,-7.0);
	this._stage.matrixRotate(e*0.01, 1,1,0);
		this._stage.bindFloatBuffer(this._vertexColorAttrib, this._squColorBuffer);
	this._stage.drawTriangleList(this._vertexPositionAttrib, this._squBuffer);
}
WebEx1.prototype.getVertexShaders1 = function(){
	return ["\
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
    "];
}
WebEx1.prototype.getFragmentShaders1 = function(){
    return ["\
		precision mediump float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
    "];
}

// var out = new GLMAT_ARRAY_TYPE(16);

